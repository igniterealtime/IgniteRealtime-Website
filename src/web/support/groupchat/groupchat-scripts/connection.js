/**
 * Creates a new XMPP connection which passes XMPP packets to the server and processes XMPP packets from
 * the server.
 *
 * @param {String} binding the HTTP address to bind to.
 * @param {String} domain the host being connected to.
 * @param {Object} connectionListener a connection listener which will be notified when there is a connection
 * error, when the connection is established, and when authentication is successful.
 */
function XMPPConnection(binding, domain, connectionListener) {
    this.binding = binding;
    this.domain = domain;
    this.isConnected = false;
    this.isAuthenticated = false;

    this._packetFilters = new Array();
    this._outgoingPacketFilters = new Array();
    this._packetQueue = new Array();
    this._connectionListeners = new Array();
    this._packetHandler = this._createPacketHandler();
    this.addConnectionListener(connectionListener);
    util.HTTP.reset();
}

XMPPConnection.prototype = {
/**
 * Adds a connection listener which will be notified when there is a connection
 * error, when the connection is established, and when authentication is successful.
 * {
 * 		connectionSuccessful: function(connection)
 * 		connectionFailed: function(connection, error)
 * 		authenticationSuccessful: function(connection)
 * 		authenticationFailed: function(connection, error)
 * 		connectionClosed: function(connection, error)
 * 		packetsReceived: function(requestID, packetCount)
 * 		packetsProcessed: function(requestID)
 * }
 *
 * @param {Object} connectionListener the connection listener which is being added.
 */
    addConnectionListener: function(connectionListener) {
        if (!connectionListener) {
            return;
        }
        this._connectionListeners.push(connectionListener);
    },
/**
 * Removes a connection listener.
 *
 * @param {Object} connectionListener the listener which is being removed.
 */
    removeConnectionListener: function(connectionListener) {
        if (!connectionListener) {
            return;
        }
        var index = this._connectionListeners.indexOf(connectionListener);
        if (index >= 0) {
            this._connectionListeners.splice(index, 1);
        }
    },
    _fireEvent: function(event, error) {
        var self = this;
        this._connectionListeners.each(function(listener) {
            if (listener[event]) {
                try {
                    listener[event](self, error);
                }
                catch (error) {
                    console.error("Error processing listener: %s", error);
                }
            }
        });
    },
/**
 * Connects the the XMPP server provided in the XMPPConnection constructor using HTTP binding. After a successful
 * connection the connectionSuccessful event will be fired to any connection listeners. If the connection is not
 * successful the connectionFailed event will be fired.
 */
    connect: function() {
        var connection = this;
        var buildSessionRequest = function(holdValue, ridValue, secureValue, waitValue) {
            var attrs = {
                xmlns: "http://jabber.org/protocol/httpbind",
                hold: holdValue,
                rid: ridValue,
                secure: secureValue,
                wait: waitValue
            }

            return util.XML.element("body", "", attrs);
        }
        this._rid = Math.floor(Math.random() * 1000000);

        var bodyContent = buildSessionRequest(1, this._rid, true, 10);
        console.debug("Initial request: %s", bodyContent);
        var callback = function(originalRequest) {
            var responseBody = originalRequest.responseXML.documentElement;
            console.debug("Intial response: %x", responseBody);

            connection.isConnected = true;
            connection.authentication = connection._configureConnection(responseBody);
            connection._fireEvent("connectionSuccessful");
        }

        var failureFunction = function(request, header) {
            console.error("Connection to the server failed: " + header);
            this._fireEvent("connectionFailed")
        }.bind(this);
        var request = util.HTTP.doRequest(this.binding, bodyContent, callback,
                failureFunction, failureFunction);
    },
    logout: function(packet) {
        if (this.loggedOut) {
            return;
        }
        if (this._timer) {
            this._timer.cancel();
        }
        var attrs = {
            xmlns: "http://jabber.org/protocol/httpbind",
            rid: this._getNextRID(),
            sid: this._sid,
            type: "terminate"
        }
        var content = util.XML.element("body", (packet ? packet.toXML() : ""), attrs);
        this.loggedOut = true;
        util.HTTP.doRequest(this.binding, content, this.destroy.bind(this),
                this.destroy.bind(this), this.destroy.bind(this));
    },
/**
 * Closes the connection to the server. If an error is passed in it will be passed
 * along to the conenction listeners.
 *
 * @param {Error} error an error if it occured to close the connection.
 */
    destroy: function(error) {
        if (!this.isConnected) {
            return;
        }
        this.isConnected = false;
        this.isAuthenticated = false;

        delete this.authentication;
        delete this.username;
        delete this.password;
        delete this._sid;
        delete this._pollingInterval;
        delete this._wait;
        delete this._inactivity;
        this._packetHandler = Prototype.emptyFunction;

        if (this._timer) {
            this._timer.cancel();
        }

        this._packetFilters.clear();
        this._outgoingPacketFilters.clear();
        this._packetQueue.clear();

        if (!this.loggedOut && !error) {
            error = new Error("connection lost");
        }

        this._fireEvent("connectionClosed", (!this.loggedOut ? error : null));
        this._connectionListeners.clear();
    },
/**
 * Authenticates with the server using the provided username and password. The SASL methods currently supported
 * are plain and anonymous. If no username is provided an anonymous session is created with the conencted server.
 * After succesful authentication, the authenticationSuccessful event is fired to all connection listeners and, if
 * authentication fails, the authenticationFailed event is fired.
 *
 * @param {String} username the username which will be used to authenticate with the server.
 * @param {String} password the password to use to authenticate with the server.
 * @param {String} resource the resource, which will uniquely identify this session from any others currently
 * using the same username on the server.
 */
    login: function(username, password, resource) {
        if (!this.authentication.auth["anonymous"] && (!username || username == "")) {
            throw new Error("Username must be provided to login.");
        }
        if (!this.authentication.auth["anonymous"] && (!password || password == "")) {
            throw new Error("Password must be provided to login.");
        }
        this.username = username;
        this.password = password;
        this.resource = (!resource ? "spank" : resource);

        var auth;
        if (!username) {
            auth = this.authentication.auth["anonymous"];
        }
        else {
            auth = this.authentication.auth["plain"];
        }

        this._handleAuthentication(auth, 0);
    },
    _handleAuthentication: function(currentFunction, step) {
        var connection = this;
        var callback = function(originalRequest) {
            var responseBody = originalRequest.responseXML.documentElement;
            var response = responseBody.firstChild;
            // check to see if we have a response, otherwise, we will need to wait.
            var result;
            if (response) {
                result = currentFunction[step].handleResponse(responseBody.firstChild);
            }
            else {
                connection._handleAuthentication(currentFunction, step);
                return;
            }
            if (result.authComplete) {
                if (result.authSuccess) {
                    connection._bindConnection();
                }
                else {
                    connection._fireEvent("authenticationFailed");
                }
            }
            else {
                connection._handleAuthentication(result, step++);
            }
        }
        if (step != this.lastStep) {
            this.lastStep = step;
            util.HTTP.doRequest(this.binding, currentFunction[step].createRequest(this), callback);
        }
        else {
            this._handlePing(callback);
        }
    },
    _configureConnection: function(responseBody) {
        this._sid = responseBody.getAttribute("sid");
        this._pollingInterval = responseBody.getAttribute("polling");
        this._wait = responseBody.getAttribute("wait");
        this._inactivity = responseBody.getAttribute("inactivity");

        this.isConnected = true;
        var features = responseBody.firstChild;

        var authentication = {};
        for (var i = 0; i < features.childNodes.length; i++) {
            var feature = features.childNodes[i];
            if (feature.tagName == "mechanisms") {
                authentication.auth = this._configureAuthMechanisms(feature);
            }
            else if (feature.tagName == "bind") {
                authentication.bind = true;
            }
            else if (feature.tagName == "session") {
                authentication.session = true;
            }
        }
        return authentication;
    },
    _configureAuthMechanisms: function(mechanisms) {
        var authMechanism = {};
        for (var i = 0; i < mechanisms.childNodes.length; i++) {
            var mechanism = mechanisms.childNodes[i];
            if (mechanism.firstChild.nodeValue == "PLAIN") {
                authMechanism["plain"] = SASLAuth.plainAuth;
            }
            else if (mechanism.firstChild.nodeValue == "ANONYMOUS") {
                authMechanism["anonymous"] = SASLAuth.anonymous;
            }
        }

        if (!authMechanism) {
            authMechanism = function() {
                // here we will throw an error
                return false;
            }
        }

        return authMechanism;
    },
    _getNextRID: function() {
        return ++this._rid;
    },
    _createRequest: function(bodyContent) {
        var attrs = {
            xmlns: "http://jabber.org/protocol/httpbind",
            rid: this._getNextRID(),
            sid: this._sid
        }

        return util.XML.element("body", bodyContent, attrs);
    },
    _bindConnection: function() {
        var bindIQ = new XMPP.IQ("set");
        bindIQ.setXMLNS("jabber:client");

        var bind = bindIQ.addExtension("bind", "urn:ietf:params:xml:ns:xmpp-bind");

        bind.appendChild(bindIQ.doc.createElement("resource"))
                .appendChild(bindIQ.doc.createTextNode(this.resource));

        console.debug("Bind the connection! %x", bindIQ.doc.documentElement);

        var connection = this;
        var callback = function(packet) {
            var bind = packet.getExtension("bind");

            console.debug("Bind Response: %x", bind);

            var jid = bind.firstChild;
            connection._jid = jid.firstChild.nodeValue;
            connection._establishSession();
        }
        var id = bindIQ.getID();
        var packetFilter = new org.jive.spank.PacketFilter(callback, function(packet) {
            return packet.getID() == id;
        });

        this.sendPacket(bindIQ, packetFilter);
    },
    _establishSession: function() {
        var sessionIQ = new XMPP.IQ("set");
        sessionIQ.setXMLNS("jabber:client");

        sessionIQ.addExtension("session", "urn:ietf:params:xml:ns:xmpp-session");
        console.debug("Establishing session: %x", sessionIQ.doc.documentElement);

        var connection = this;
        var callback = function(originalRequest) {
            connection.isAuthenticated = true;
            connection._fireEvent("authenticationSuccessful");
        }
        var id = sessionIQ.getID();
        var packetFilter = new org.jive.spank.PacketFilter(callback, function(packet) {
            return packet.getID() == id;
        });

        this.sendPacket(sessionIQ, packetFilter);
    },
/**
 * Sends a packet to the connected XMPP server. The packet, or a group of packets,
 * is wrapped in a body tag and sent to the server using HTTPBinding.
 *
 * @param {XMPP.Packet} packet a valid xmpp packet.
 * @param {org.jive.spank.PacketFilter} convinence for adding a PacketFilter,
 * the filter will be removed upon its execution.
 */
    sendPacket: function(packet, packetFilter) {
        if (!packet || !(typeof packet == "object" && packet instanceof XMPP.Packet)) {
            return;
        }

        // Lets clear out the ping timer if its there.
        if (this._timer) {
            this._timer.cancel();
            delete this._timer;
        }

        if (packetFilter) {
            this.addPacketFilter(packetFilter, true);
        }

        if (this._shouldQueuePacket()) {
            this._queuePacket(packet);
            return;
        }
        var packets = new Array();
        packets.push(packet);
        this._sendPackets(packets);
    },
    _sendPackets: function(packets) {
        if (!this.isConnected) {
            return;
        }
        var requestArray = new Array();
        for (var i = 0; i < packets.length; i++) {
            this._handlePacket(this._outgoingPacketFilters.slice(), packets[i]);
            requestArray.push(packets[i].toXML());
        }
        util.HTTP.doRequest(this.binding, this._createRequest(requestArray.join("")),
                this._packetHandler, connection._createFailureHandler(),
                connection._createExceptionHandler());
    },
    _createFailureHandler: function() {
        var self = this;
        return function(request, header) {
            console.error("Request failure: %s", header);
            self.destroy(header);
        }
    },
    _createExceptionHandler: function() {
        var self = this;
        return function(request, error) {
            console.error("Request exception: %s", error);
            self.destroy(error);
        }
    },
    _createPacketHandler: function() {
        var connection = this;
        return function(serverResponse) {
            var responseBody = serverResponse.responseXML.documentElement;
            var packets = responseBody.childNodes;
            var len = packets.length;
            connection._fireEvent("packetsReceived");
            for (var i = 0; i < len; i++) {
                var packetElement = packets.item(i).cloneNode(true);
                var packetType = packetElement.tagName;
                var packet;

                if (packetType == "iq") {
                    packet = new XMPP.IQ(null, null, null, packetElement);
                }
                else if (packetType == "presence") {
                    packet = new XMPP.Presence(null, null, packetElement);
                }
                else if (packetType == "message") {
                    packet = new XMPP.Message(null, null, null, packetElement);
                }
                else {
                    console.error("Server returned unknown packet, tossing: %x", packetElement);
                    continue;
                }
                // Slice the array so we have a copy of it. This keeps us safe in case a listener
                // is removed while processing packets.
                connection._handlePacket(connection._packetFilters.slice(), packet);

            }
            connection._fireEvent("packetsProcessed");
            if (connection._packetQueue.length > 0) {
                connection._sendPackets(connection._packetQueue.compact());
                connection._packetQueue.clear();
            }
            else {
                connection._handlePing();
            }
        };
    },
/**
 * Adds a PacketFilter to the connection. An optional parameter of removeOnExecution when true will cause the
 * PacketFilter to be removed from the connection upon its execution. The PacketFilter is checked if it should
 * be executed for each packet that is recieved on the connection.
 *
 * @param {org.jive.spank.PacketFilter} packetFilter the filter being added to the connection.
 * @param {boolean} removeOnExecution (optional) true if the filter should be removed after it has been
 * exectuted for the first time.
 */
    addPacketFilter: function(packetFilter, removeOnExecution) {
        if (!packetFilter || !(packetFilter instanceof org.jive.spank.PacketFilter)) {
            throw Error("PacketFilter must be an instance of PacketFilter");
        }
        packetFilter.removeOnExecution = removeOnExecution;
        this._packetFilters.push(packetFilter);
    },
/**
 * Removes a PacketFilter from the connection.
 *
 * @param {org.jive.spank.PacketFilter} packetFilter the packet filter which is being removed.
 */
    removePacketFilter: function(packetFilter) {
        if (!packetFilter) {
            return;
        }

        var index = this._packetFilters.indexOf(packetFilter);
        if (index >= 0) {
            this._packetFilters.splice(index, 1);
        }
    },
/**
 * Adds an outgoing PacketFilter to the connection. An outgoing PacketFilter is executed on every packet being
 * sent from this connection.
 *
 * @param {org.jive.spank.PacketFilter} packetFilter the PacketFilter which will be executed on each packet being
 * sent to the server.
 */
    addOutgoingPacketFilter: function(packetFilter) {
        if (!packetFilter || !(packetFilter instanceof org.jive.spank.PacketFilter)) {
            throw Error("PacketFilter must be an instance of PacketFilter");
        }
        this._outgoingPacketFilters.push(packetFilter);
    },
    _handlePacket: function(packetFilters, packet) {
        for (var i = packetFilters.length - 1; i >= 0; i--) {
            try {
                if (packetFilters[i].accept(packet) && packetFilters[i].removeOnExecution) {
                    this.removePacketFilter(packetFilters[i]);
                }
            }
            catch(e) {
                console.error("Error processing packet: %s", e.message);
                if (packetFilters[i].removeOnExecution) {
                    this.removePacketFilter(packetFilters[i]);
                }
            }
        }
    },
    _handlePing: function(responseHandler) {
        if (this._timer) {
            this._timer.cancel();
            delete this._timer;
        }
        if (util.HTTP.requestCount <= 0) {
            this._timer = new TimeoutExecutor(this._pingServer(responseHandler),
                    2 * this._pollingInterval);
        }
    },
    _pingServer: function(responseHandler) {
        if (!this.isConnected) {
            return;
        }
        var connection = this;
        if (!responseHandler) {
            responseHandler = this._packetHandler;
        }
        return function() {
            util.HTTP.doRequest(connection.binding, connection._createRequest(),
                    responseHandler, connection._createFailureHandler(),
                    connection._createExceptionHandler());
        }
    },
    _shouldQueuePacket: function() {
        return util.HTTP.requestCount >= util.HTTP.maxConcurrentRequests
                || this._packetQueue.size > 0;
    },
    _queuePacket: function(packet) {
        this._packetQueue.push(packet);
    }
}

var SASLAuth = {
    plainAuth: [{
        createRequest: function(connection) {
            var authContent = connection.username + "@" + connection.domain;
            authContent += '\u0000';
            authContent += connection.username;
            authContent += '\u0000';
            authContent += connection.password;

            authContent = util.base64.encode(authContent);

            var attrs = {
                mechanism: "PLAIN",
                xmlns: "urn:ietf:params:xml:ns:xmpp-sasl"
            }

            var bodyContent = util.XML.element("auth", authContent, attrs);

            var request = connection._createRequest(bodyContent);
            console.debug("Plain auth request: %s", request);
            return request;
        },
        handleResponse: function(responseBody) {
            var success = responseBody.tagName == "success";
            return {
                authComplete: true,
                authSuccess: success
            };
        }
    }],
    anonymous: [{
        createRequest: function(connection) {
            var attrs = {
                mechanism: "ANONYMOUS",
                xmlns: "urn:ietf:params:xml:ns:xmpp-sasl"
            }

            var bodyContent = util.XML.element("auth", null, attrs);
            var request = connection._createRequest(bodyContent);
            console.debug("Plain auth request: %s", request);
            return request;
        },
        handleResponse: function(responseBody) {
            var success = responseBody.tagName == "success";
            return {
                authComplete: true,
                authSuccess: success
            };
        }
    }]
};

var TimeoutExecutor = Class.create();
TimeoutExecutor.prototype = {
    initialize: function(callback, timeout) {
        this.callback = callback;
        this.timeout = timeout;
        this.currentlyExecuting = false;

        this.registerCallback();
    },
    registerCallback: function() {
        this.timeoutID = setTimeout(this.onTimerEvent.bind(this), this.timeout * 1000);
    },
    onTimerEvent: function() {
        try {
            this.currentlyExecuting = true;
            if (this.callback && this.callback instanceof Function) {
                this.callback();
            }
        }
        finally {
            this.currentlyExecuting = false;
            delete this.timeoutID;
        }
    },
    cancel: function() {
        if (!this.currentlyExecuting && this.timeoutID) {
            clearTimeout(this.timeoutID);
            delete this.timeoutID;
        }
    },
    reset: function() {
        if (!this.currentlyExecuting && this.timeoutID) {
            clearTimeout(this.timeoutID);
            delete this.timeoutID;
            this.registerCallback();
        }
    }
}

var org = {};
org.jive = {};
org.jive.spank = {};
org.jive.spank.chat = {};
/**
 * Creates a ChatManager object. The ChatManager object will hook up the listeners on the
 * connection object to deal with incoming and outgoing chats.
 *
 * @param {XMPPConnection} connection the connection object which this ChatManager is being
 * initialized for.
 * @param {String} server the server for which this ChatManager is handling chats.
 * @param {boolean} shouldUseThreads boolean indicating whether threads should be used to uniquely identify
 * conversations between two entities.
 */
org.jive.spank.chat.Manager = function(connection, server, shouldUseThreads) {
    if (!connection || !(connection instanceof XMPPConnection)) {
        throw Error("connection required for ChatManager.");
    }

    this.getConnection = function () {
        return connection;
    }

    this.servers = {};
    if (server) {
        this.servers[server] = false;
    }

    var self = this;
    connection.addConnectionListener({
        connectionClosed: function() {
            self.destroy();
        }
    });

    this.packetFilter = new org.jive.spank.PacketFilter(this._createMessageHandler(),
            this._createMessageFilter());
    connection.addPacketFilter(this.packetFilter);

    this._chatSessions = new Array();
    this._chatSessionListeners = new Array();
    this._baseID = util.StringUtil.randomString(5);
    this._threadID = 1;
    this.shouldUseThreads = shouldUseThreads;

    this.presenceFilter = new org.jive.spank.PacketFilter(this._presenceHandler.bind(this), function(packet) {
        return packet.getPacketType() == "presence" && packet.getType() == "unavailable";
    });
    connection.addPacketFilter(this.presenceFilter);
}

org.jive.spank.chat.Manager.prototype = {
    _createMessageHandler: function() {
        var manager = this;
        return function(message) {
            manager._handleMessage(message);
        }
    },
    _createMessageFilter: function() {
        return function(packet) {
            return packet.getPacketType() == "message" && packet.getType() == "chat" && packet.getBody();
        }
    },
    _presenceHandler: function(packet) {
        // If the user sends an unavailable from the resource we are chatting with we want to revert
        // to undefined for the resource
        var chatSession = this._chatSessions.find(function(session) {
            return session.sessionMatches(packet.getFrom(), null, true);
        });
        if (!chatSession || this.servers[packet.getFrom().getDomain()]) {
            return;
        }
        var bareJID = chatSession.getJID().getBareJID();
        chatSession.getJID = function() {
            return bareJID;
        };
    },
    _handleMessage: function(message) {
        console.debug("Handling message: %s", message.getID());

        var chatSession = this._chatSessions.find(function(session) {
            return session.sessionMatches(message.getFrom(), message.getThread());
        });
        if (!chatSession) {
            chatSession = this.createSession(message.getFrom(), (this.shouldUseThreads ?
                                                                 message.getThread() : null));
        }

        chatSession._handleMessage(message);
    },
/**
 * A chat session listener listens for new chat sessions to be created on the connection.
 *
 * @param {Function} listener called when a new session is created with the manager and session as
 * parameters.
 */
    addChatSessionListener: function(listener) {
        this._chatSessionListeners.push(listener);
    },
/**
 * Removes a chat session listener from the manager.
 *
 * @param {Function} listener the listener being removed.
 */
    removeChatSessionListener: function(listener) {
        if (!listener) {
            return;
        }
        var index = this._chatSessionListeners.indexOf(listener);
        if (index >= 0) {
            this._chatSessionListeners.splice(index, 1);
        }
    },
/**
 * Closes a chat session.
 *
 * @param {org.jive.spank.chat.Session} session the session being closed.
 */
    closeChatSession: function(session) {
        if (!session) {
            return;
        }

        var index = this._chatSessions.indexOf(session);
        if (index < 0) {
            return;
        }

        this._chatSessions.splice(index, 1);
        delete session._messageListeners;
        this._fireChatSessionClosed(session);
    },
    _fireNewChatSessionCreated: function(session) {
        var manager = this;
        this._chatSessionListeners.each(function(listener) {
            if (listener.created) {
                listener.created(manager, session);
            }
        });
    },
    _fireChatSessionClosed: function(session) {
        var manager = this;
        this._chatSessionListeners.each(function(listener) {
            if (listener.closed) {
                listener.closed(manager, session);
            }
        });
    },
/**
 * Returns a chat session given a jid and a thread that uniquely identify a session. The thread parameter is
 * optional and only utilized if threads are enabled.
 *
 * @param {XMPP.JID} jid the jid for which to find the releated chat session.
 * @param {String} thread (optional) the thread for which to find the related chat session.
 */
    getSession: function(jid, thread) {
        return this._chatSessions.find(function(session) {
            return session.sessionMatches(jid, thread);
        });
    },
    createSession: function(jid, thread) {
        if (!jid) {
            throw new Error("JID must be specified.");
        }
        if (!thread && this.shouldUseThreads) {
            thread = this._createThreadID();
        }

        var session = new org.jive.spank.chat.Session(this, jid, thread);
        this._chatSessions.push(session);
        this._fireNewChatSessionCreated(session);
        return session;
    },
    registerDomain: function(domain, shouldMatchFullJID) {
        this.servers[domain] = shouldMatchFullJID;
    },
    _createThreadID: function() {
        return this._baseID + this._threadID++;
    },
    destroy: function() {
        for (var i = 0; i < this._chatSessions.length; i++) {
            this.closeChatSession(this._chatSessions[i]);
        }
        this._chatSessions.clear();

        this._chatSessionListeners.clear();
        delete this._chatSessionListeners;
        this.getConnection = Prototype.emptyFunction;
    }
}

org.jive.spank.chat.Session = function(manager, jid, thread) {
    this.getJID = function() {
        return jid;
    };
    this.getThread = function() {
        return thread;
    };
    this.getManager = function() {
        return manager;
    };

    this._messageListeners = new Array();
}

org.jive.spank.chat.Session.prototype = {
    getJIDString: function() {
        if (this.getManager().servers[this.getJID().getDomain()]) {
            return this.getJID().toString();
        }
        else {
            return this.getJID().toBareJID();
        }
    },
    sessionMatches: function(jid, thread, matchFullJID) {
        var jidMatches;
        if (this.getManager().servers[jid.getDomain()] || matchFullJID) {
            jidMatches = jid.toString() == this.getJID().toString();
        }
        else {
            jidMatches = jid.toBareJID() == this.getJID().toBareJID();
        }

        if (this.getManager().shouldUseThreads && thread) {
            return jidMatches && this.getThread() == thread;
        }
        else {
            return jidMatches;
        }
    },
    addListener: function(listener) {
        if (!listener) {
            return;
        }
        this._messageListeners.push(listener);
    },
    _handleMessage: function(message) {
        var session = this;
        var jid = message.getFrom();
        this.getJID = function() {
            return jid;
        }
        this._messageListeners.each(function(listener) {
            if (listener.messageRecieved) {
                listener.messageRecieved(session, message);
            }
        });
    },
    sendMessage: function(messageBody, message) {
        if (!message) {
            message = new XMPP.Message("chat", this.getManager().getConnection()._jid,
                    this.getJID());
        }
        else {
            message.setTo(this.getJID());
            message.setType("chat");
            message.setBody(messageBody);
        }
        message.setBody(messageBody);
        message.setThread(this.getThread());

        this.getManager().getConnection().sendPacket(message);
    }
}

/**
 * A listener utilized by the ChatManager to notify interested parties when a new ChatSession is
 * created or destroyed.
 *
 * @param {Function} sessionCreated called when a new chat session is created.
 * @param {Function} sessionClosed called when a caht session is closed.
 */
org.jive.spank.chat.ChatSessionListener = function(sessionCreated, sessionClosed) {
    this.created = sessionCreated;
    this.closed = sessionClosed;
}

org.jive.spank.presence = {};

/**
 * Creates a presence manager. The presence manager class handles the user's presence, and
 * also keeps track of all presences recieved from remote users. Presence interceptors can
 * be added in order to add extensions to sent presence packets.
 *
 * @param {XMPPConnection} connection the connection on which this presence manager will use.
 * @param {XMPP.JID} all packets originating from this manager will be sent to this JID if they
 * do not already have a to set on them.
 * @param {String} the mode to process subscriptions, accept, reject, or manual.
 */
org.jive.spank.presence.Manager = function(connection, jid, subscriptionMode) {
    if (!connection || !(connection instanceof XMPPConnection)) {
        throw Error("Connection required for the presence manager.");
    }

    this.getConnection = function() {
        return connection;
    }

    var self = this;
    connection.addConnectionListener({
        connectionClosed: function() {
            self.destroy();
        }
    });

    if (!jid) {
        this._presencePacketFilter = new org.jive.spank.PacketFilter(this._createPresencePacketHandler(),
                function(packet) {
                    return packet.getPacketType() == "presence";
                });
    }
    else {
        this._presencePacketFilter = new org.jive.spank.PacketFilter(this._createPresencePacketHandler(),
                function(packet) {
                    return packet.getPacketType() == "presence" && packet.getFrom().toBareJID() == jid.toBareJID();
                });
    }

    connection.addPacketFilter(this._presencePacketFilter);
    this._presenceListeners = new Array();
    this._presence = {};
    this._jid = jid;
    this.mode = subscriptionMode;
}

org.jive.spank.presence.Manager.prototype = {
/**
 * Sends a presence packet to the server
 *
 * @param {XMPP.Presence} presence
 */
    sendPresence: function(presence) {
        if (!presence) {
            presence = new XMPP.Presence();
        }
        if (!presence.getTo() && this._jid) {
            presence.setTo(this._jid.toString());
        }
        this.getCurrentPresence = function() {
            return presence;
        };
        this.getConnection().sendPacket(presence);
    },
/**
 * The subscription mode will allow for the default handling of subscription packets, either
 * accepting all, rejecting all, or manual. The default mode is manual.
 * @param {String} mode can be either accept, reject, or manual.
 */
    setSubscriptionMode: function(mode) {
        this.mode = mode;
    },
    addPresenceListener: function(presenceListener) {
        if (!presenceListener || !(presenceListener instanceof Function)) {
            throw Error("Presence listener must be function");
        }
        this._presenceListeners.push(presenceListener);
    },
    getHighestResource: function(jid) {
        var bareJID = jid.toBareJID();
        if (!this._presence[bareJID]) {
            return null;
        }

        var highest;
        for (var resource in this._presence[bareJID].resources) {
            var presence = this._presence[bareJID].resources[resource];
            if (!highest || presence.getPriority() >= highest.getPriority) {
                highest = presence;
            }
        }
        return highest;
    },
    getPresence: function(jid) {
        if (!jid.getResource()) {
            return this.getHighestResource(jid);
        }
        var bareJID = jid.toBareJID();
        if (!this._presence[bareJID]) {
            return null;
        }
        else {
            return this._presence[bareJID].resources[jid.getResource()];
        }
    },
    _createPresencePacketHandler: function() {
        var manager = this;
        return function(presencePacket) {
            manager._handlePresencePacket(presencePacket);
        }
    },
    _handlePresencePacket: function(presencePacket) {
        var type = presencePacket.getType();
        if (type == "available" || type == "unavailable") {
            var jid = presencePacket.getFrom();
            var bareJID = jid.toBareJID();
            if (!this._presence[bareJID] && type == "available") {
                this._presence[bareJID] = {};
                this._presence[bareJID].resources = {};
            }
            else if (!this._presence[bareJID]) {
                return;
            }
            var resource = jid.getResource();
            if (type == "available") {
                this._presence[jid.toBareJID()].resources[resource] = presencePacket;
            }
            else {
                delete this._presence[jid.toBareJID()].resources[resource];
            }
        }
        else if ((presencePacket.getType() == "subscribe"
                || presencePacket.getType() == "unsubscribe")
                && (this.mode == "accept" || this.mode == "reject")) {
            var response = new XMPP.Presence(presencePacket.getFrom());
            response.setType((this.mode == "accept" && presencePacket.getType() != "unsubscribe"
                    ? "subscribed" : "unsubscribed"));
            this.getConnection().sendPacket(response);
        }
        if (!this._presenceListeners) {
            return;
        }
        this._presenceListeners.each(function(presenceListener) {
            presenceListener(presencePacket);
        });
    },
    destroy: function() {
        delete this._presence;
        if (this.getConnection()) {
            this.getConnection().removePacketFilter(this._presencePacketFilter);
        }
        this.getConnection = Prototype.emptyFunction;
        delete this._presenceListeners;
    }
}

org.jive.spank.roster = {};

/**
 * Creates a roster, the appropriate listeners will then be registered with the XMPP Connection.
 * After the listeners are established, the user roster is requested and the users intial presence
 * is sent.
 *
 * @param {XMPPConnection} connection the XMPP connection which this roster will use.
 * @param {Function} onLoadCallback an optional callback which will be called when the roster is
 * loaded.
 * @param {org.jive.spank.presence.Manager} Specify a custom presence manager for the roster, if one
 * is not provided it will be created.
 */
org.jive.spank.roster.Manager = function(connection, onLoadCallback, presenceManager) {
    if (!connection || !(connection instanceof XMPPConnection)) {
        throw Error("Connection required for the roster manager.");
    }

    var self = this;
    connection.addConnectionListener({
        connectionClosed: function() {
            self.destroy();
        }
    });
    this.getConnection = function() {
        return connection;
    }

    this.rosterPacketFilter = new org.jive.spank.PacketFilter(this._rosterPacketHandler(),
            this._createRosterPacketFilter);

    connection.addPacketFilter(this.rosterPacketFilter);

    if (!presenceManager) {
        presenceManager = new org.jive.spank.presence.Manager(connection);
    }

    this.onLoadCallback = onLoadCallback;
    var rosterPacket = new org.jive.spank.roster.Packet();
    this._initialRequestID = rosterPacket.getID();
    connection.sendPacket(rosterPacket);

    this.rosterListeners = new Array();
}

org.jive.spank.roster.Manager.prototype = {
    getRoster: function() {
        return this._roster;
    },
    _rosterPacketHandler: function() {
        var manager = this;
        return function(rosterPacket) {
            manager._handleRosterPacket(
                    new org.jive.spank.roster.Packet(null, null, null, rosterPacket.rootNode.cloneNode(true)));
        }
    },
    _createRosterPacketFilter: function(packet) {
        var query = packet.getExtension("query");
        return query != null && query.namespaceURI == "jabber:iq:roster";
    },
    _handleRosterPacket: function(rosterPacket) {
        console.debug("Roster packet recieved %s", rosterPacket.getID());

        if (rosterPacket.getID() == this._initialRequestID) {
            this._handleInitialResponse(rosterPacket);
        }
        else if (rosterPacket.getType() == "set") {
            this._handleRosterAdd(rosterPacket, true);
        }
    },
    _handleInitialResponse: function(rosterPacket) {
        this._roster = {};
        this._users = {};
        this._handleRosterAdd(rosterPacket, false);
        if (this.onLoadCallback && this.onLoadCallback instanceof Function) {
            this.onLoadCallback(this);
            this.onLoadCallback = Prototype.emptyFunction;
        }

        presenceManager.sendPresence();
    },
    _handleRosterAdd: function(rosterPacket, shouldFireListeners) {
        var items = rosterPacket.getItems();
        var roster = this._roster;
        var users = this._users;
        var added = new Array();
        var removed = new Array();
        var updated = new Array();
        items.each(function(item) {
            var jid = item.getJID().toBareJID();
            if (item.getSubscription() == "remove"
                    || (item.getSubscription() == "none" && !item.isSubscriptionPending())) {
                item = users[jid];
                if (!item) {
                    return;
                }
                delete users[jid];
                if (roster["unfiled"] && roster["unfiled"][item.getName()]) {
                    delete roster["unfiled"][item.getJID().toString()];
                }
                var groups = item.getGroups();
                for (var i = 0; i < groups.length; i++) {
                    var group = groups[i];
                    if (!roster[group]) {
                        continue;
                    }
                    delete roster[group][item.getJID().toString()];
                }
                removed.push(item);
                return;
            }
            var isUpdated = false;
            var isAdded = false;
            // Delete any of the users old groups...
            var oldItem;
            if (users[jid]) {
                oldItem = users[jid];
                var oldGroups = oldItem.getGroups();
                var groups = item.getGroups();
                for (var i = 0; i < oldGroups.length; i++) {
                    var group = groups[i];
                    if (groups.indexOf(oldGroups[i]) < 0 && roster[group]) {
                        if (!isUpdated) {
                            isUpdated = true;
                            updated.push(item);
                        }
                        delete roster[group][oldItem.getJID().toString()];
                    }
                }
            }
            else {
                isAdded = true;
                added.push(item);
            }

            if (!isUpdated && !isAdded
                    && (oldItem.getName() != item.getName()
                    || oldItem.getSubscription() != item.getSubscription())) {
                isUpdated = true;
                updated.push(item);
            }
            users[jid] = item;

            var groups = item.getGroups();
            for (var i = 0; i < groups.length; i++) {
                var group = groups[i];
                if (!roster[group]) {
                    roster[group] = {};
                }
                if (!roster[group][item.getJID().toString()] && !isUpdated && !isAdded) {
                    isUpdated = true;
                    updated.push(item);
                }
                roster[group][item.getJID().toString()] = item;
            }

            // No groups, add to unfiled.
            if (groups.length == 0) {
                if (!roster["unfiled"]) {
                    roster["unfiled"] = {};
                }
                if (!roster["unfiled"][item.getJID().toString()] && !isUpdated && !isAdded) {
                    isUpdated = true;
                    updated.push(item);
                }
                roster["unfiled"][item.getJID().toString()] = item;
            }
        });
        if (shouldFireListeners) {
            this._fireRosterUpdates(added, updated, removed);
        }
    },
    _fireRosterUpdates: function(added, updated, removed) {
        this.rosterListeners.each(function(listener) {
            if (added.length > 0 && listener.onAdded) {
                listener.onAdded(added);
            }
            if (updated.length > 0 && listener.onUpdated) {
                listener.onUpdated(updated);
            }
            if (removed.length > 0 && listener.onRemoved) {
                listener.onRemoved(removed);
            }
        });
    },
    addEntry: function(jid, name, groups) {
        var packet = new org.jive.spank.roster.Packet("set");
        var item = packet.addItem(jid, name);
        if (groups) {
            item.addGroups(groups);
        }

        console.debug("adding contact: %x", packet.doc.documentElement);
        this.getConnection().sendPacket(packet);

        var presence = new XMPP.Presence(jid);
        presence.setType("subscribe");
        this.getConnection().sendPacket(presence);
    },
    removeEntry: function(jid) {
        var packet = new org.jive.spank.roster.Packet("set");
        var item = packet.addItem(jid);
        item.setSubscription("remove");

        console.debug("removing roster entry: %x", packet.doc.documentElement);
        this.getConnection().sendPacket(packet);
    },
/**
 * Adds a roster listener.
 *
 * @param {Object} rosterListener contains onAdded, onUpdated, and onRemoved
 */
    addRosterListener: function(rosterListener) {
        this.rosterListeners.push(rosterListener);
    },
/**
 * Removes a roster listener.
 *
 * @param {Object} rosterListener the listener to remove.
 */
    removeRosterListener: function(rosterListener) {
        if (!rosterListener) {
            return;
        }

        var index = this.rosterListeners.indexOf(rosterListener);
        if (index >= 0) {
            this.rosterListeners.splice(index, 1);
        }
    },
    destroy: function() {
        this.rosterListeners.clear();
        this.getConnection = Prototype.emptyFunction;
        delete this._roster;
        delete this._users;
        delete this._handleRosterAdd;
        this.onLoadCallback = Prototype.emptyFunction;
        delete this._initialRequestID;
    }
}

org.jive.spank.disco = {
    _connections: new Array(),
/**
 * Retrieves a singleton for the connection which is the service discovery manager.
 *
 * @param {XMPP.Connection} connection the connection to retrieve the singleton for.
 */
    getManager: function(connection) {
        var sid = connection._sid;
        if (org.jive.spank.disco._connections[sid] == null) {
            org.jive.spank.disco._connections[sid]
                    = new org.jive.spank.disco.Manager(connection);
            connection.addConnectionListener({
                connectionClosed: function() {
                    delete org.jive.spank.disco._connections[sid];
                }
            });
        }
        return org.jive.spank.disco._connections[sid];
    }
}

/**
 * The disco manager manages service discovery on an XMPP Connection.
 *
 * @param {XMPP.Connection} connection the connection which this service discovery manager will
 * handle disco for.
 */
org.jive.spank.disco.Manager = function(connection) {
    this._connection = connection;
    var self = this;
    this.features = new Array();
    this.infoCache = {};
    var discoFilter = new org.jive.spank.PacketFilter(function(request) {
        self._handleDiscoResquest(request);
    }, function(packet) {
        return packet.getPacketType() == "iq" && packet.getType() == "get" && packet.getQuery()
                && packet.getQuery().getAttribute("xmlns") ==
                   "http://jabber.org/protocol/disco#info";
    });
    connection.addPacketFilter(discoFilter);
    connection.addConnectionListener({
        connectionClosed: function() {
            self.destroy();
        }
    });
}

org.jive.spank.disco.Manager.prototype = {
    getCategory: function(jid, shouldClearCache) {
        var discoverPacket = this.infoCache[jid.toString()];
        if (!discoverPacket || shouldClearCache) {
            this.discoverInfo(null, jid);
            return null;
        }

        if (discoverPacket.getType() != "result") {
            return null;
        }

        var query = discoverPacket.getExtension("query");
        var info = query.childNodes;
        for (var i = 0; i < info.length; i++) {
            if (info[i].tagName == "identity") {
                return info[i].getAttribute("category");
            }
        }
        return null;
    },
    hasFeature: function(jid, feature, shouldClearCache) {
        var discoverPacket = this.infoCache[jid.toString()];
        if (!discoverPacket || shouldClearCache) {
            this.discoverInfo(null, jid);
            return false;
        }

        if (discoverPacket.getType() != "result") {
            return false;
        }

        var query = discoverPacket.getExtension("query");
        var info = query.childNodes;
        for (var i = 0; i < info.length; i++) {
            if (info[i].tagName == "feature") {
                if (info[i].getAttribute("var") == feature) {
                    return true;
                }
            }
        }
        return false;
    },
    discoverInfo: function(infoCallback, jid, node) {
        var getInfo = new XMPP.IQ("get", this._connection._jid, jid.toString());
        var id = getInfo.getID();

        var query = getInfo.setQuery("http://jabber.org/protocol/disco#info");
        if (node) {
            query.setAttribute("node", node);
        }

        var self = this;
        this._connection.sendPacket(getInfo, new org.jive.spank.PacketFilter(
                function(packet) {
                    self.infoCache[jid.toString()] = packet;
                    if (infoCallback) {
                        infoCallback(packet);
                    }
                }, function(packet) {
            return packet.getID() == id;
        }));
    },
    discoverItems: function(itemsCallback, jid, node) {
        if (!itemsCallback) {
            return;
        }
        var getInfo = new XMPP.IQ("get", this._connection._jid, jid.toString());
        var id = getInfo.getID();

        var query = getInfo.setQuery("http://jabber.org/protocol/disco#items");
        if (node) {
            query.setAttribute("node", node);
        }

        this._connection.sendPacket(getInfo, new org.jive.spank.PacketFilter(itemsCallback,
                function(packet) {
                    return packet.getID() == id;
                }));
    },
    addFeature: function(feature) {
        this.features.push(feature);
    },
    removeFeature: function(feature) {
        var index = this.features.indexOf(feature);
        if (index >= 0) {
            this.features.splice(index, 1);
        }
    },
    _handleDiscoResquest: function(get) {
        var result = new XMPP.IQ("result", this._connection._jid, get.getFrom());
        result.setID(get.getID());
        var query = result.setQuery("http://jabber.org/protocol/disco#info");
        var identity = query.appendChild(result.doc.createElement("identity"));
        identity.setAttribute("category", "client");
        identity.setAttribute("name", "spank");
        identity.setAttribute("type", "web");

        for (var i = 0; i < this.features.length; i++) {
            var feature = this.features[i];
            var featureNode = query.appendChild(result.doc.createElement("feature"));
            featureNode.setAttribute("var", feature);
        }
        this._connection.sendPacket(result);
    },
    destroy: function() {
        this.infoCache = {};
        var index = org.jive.spank.disco._connections.indexOf(this);
        if (index >= 0) {
            org.jive.spank.disco._connections.splice(index, 1);
        }
    }
}

org.jive.spank.muc = {};

/**
 * The multi-user chat manager has functions for room creation, adding and removing invitation
 * listeners, and retrieving multi-user chat conference servers and rooms from the XMPP server.
 *
 * @param {XMPPConnection} connection the XMPPConnection which this manager utilizes for its
 * communications.
 * @param {org.jive.spank.chat.Manager} chatManager the chat manager is used for private chats
 * originating inside of MUC rooms.
 */
org.jive.spank.muc.Manager = function(connection, chatManager) {
    this._connection = connection;
    var self = this;
    connection.addConnectionListener({
        connectionClosed: function() {
            self.destroy();
        }
    });
    this.invitationListeners = new Array();
    this.rooms = new Array();
    this.chatManager = chatManager;
    org.jive.spank.disco.getManager(connection).addFeature("http://jabber.org/protocol/muc");
}

org.jive.spank.muc.Manager.prototype = {
/**
 * Returns a list of conference servers operating on the server. If the server argument is
 * not specifed the currently connected server is used.
 *
 * @param {Function} serversCallback the function that is called with the server list when
 * the response is recieved.
 * @param {XMPP.JID} server (optional) the server to retrieve the list of conference servers
 * from.
 */
    getConferenceServers: function(serversCallback, server) {
        if (!server) {
            server = new XMPP.JID(this._connection.domain);
        }

        var infoCallback = function(infoResponse) {
            var query = infoResponse.getExtension("query");
            var infoNodes = query.childNodes;
            for (var i = 0; i < infoNodes.length; i++) {
                var info = infoNodes[i];
                if (info.tagName == "feature") {
                    if (info.getAttribute("var") == "http://jabber.org/protocol/muc") {
                        serversCallback(infoResponse.getFrom());
                        return;
                    }
                }
            }
        };

        var callback = function(itemsResponse) {
            var query = itemsResponse.getExtension("query");
            var items = query.childNodes;
            var itemList = {};
            for (var i = 0; i < items.length; i++) {
                var jid = items[i].getAttribute("jid");
                if (!jid) {
                    continue;
                }
                org.jive.spank.disco.getManager(this._connection).discoverInfo(infoCallback,
                        new XMPP.JID(jid));
            }
        }.bind(this);

        org.jive.spank.disco.getManager(this._connection).discoverItems(callback, server);
    },
/**
 * Retrieves a list of rooms from a MUC service. To receive the info on the rooms pass
 * the returned structure to #retrieveRoomsInfo.
 *
 * @param {XMPP.JID} serviceJID the jid of the service for which to retrieve rooms.
 * @param {Function} roomsCallback the callback called with the rooms as its argument when the
 * server returns the rooms response.
 */
    retrieveRooms: function(serviceJID, roomsCallback) {
        if (!serviceJID || !roomsCallback) {
            return;
        }

        var callback = function(itemsResponse) {
            var query = itemsResponse.getExtension("query");
            var items = query.childNodes;
            var itemList = {};
            for (var i = 0; i < items.length; i++) {
                var jid = items[i].getAttribute("jid");
                if (!jid) {
                    continue;
                }
                var name = items[i].getAttribute("name");

                itemList[jid] = {
                    name: name
                };
            }
            roomsCallback(itemList);
        }

        org.jive.spank.disco.getManager(this._connection).discoverItems(callback, serviceJID);
    },
    retrieveRoomsInfo: function(rooms, roomsCallback) {
        if (!rooms || !roomsCallback) {
            return;
        }

        var count = 0;

        var callback = function(infoResponse) {
            var jid = infoResponse.getFrom().toString();
            var query = infoResponse.getExtension("query");
            var info = query.childNodes;
            var room = rooms[jid];
            if (room) {
                for (var i = 0; i < info.length; i++) {
                    if (info[i].tagName == "feature") {

                    }
                    else if (info[i].tagName == "x") {
                        var xdata = new XMPP.XData(null, info[i]);
                        var fields = xdata.getFields();
                        for (var field in fields) {
                            rooms[jid][field] = {};
                            for (var value in fields[field]) {
                                rooms[jid][field][value] = fields[field][value];
                            }
                        }
                    }
                }
            }
            if (--count <= 0) {
                roomsCallback(rooms);
            }
        }

        for (var room in rooms) {
            count++;
            org.jive.spank.disco.getManager(this._connection).discoverInfo(callback, room);
        }
    },
/**
 * Retrieves a conference room to be joined.
 *
 * @param {XMPP.JID} roomJID the jid of the room to be created.
 */
    createRoom: function(roomJID) {
        this.chatManager.registerDomain(roomJID.getDomain(), true);
        return new org.jive.spank.muc.Room(this, roomJID);
    },
    getRoom: function(roomJID) {
        return this.rooms.detect(function(value, index) {
            return value.jid.toString() == roomJID.toString();
        });
    },
    _addRoom: function(room) {
        this.rooms.push(room);
    },
    _removeRoom: function(room) {
        if (!room) {
            return;
        }
        var index = this.rooms.indexOf(room);
        if (index >= 0) {
            this.rooms.splice(index, 1);
        }
    },
    addInvitationsListener: function(invitationListener) {
        if (!(invitationListener instanceof Function)) {
            throw Error("invitation listener must be a function.");
        }
        var invitationListeners = this.invitationListeners;
        if (this.invitationListeners.length <= 0) {
            this.invitationFilter = new org.jive.spank.PacketFilter(function(packet) {
                var userPacket = new org.jive.spank.muc.User(null, null, packet.rootNode.cloneNode(true));
                var invitation = userPacket.getInvite();

                if (invitation) {
                    invitationListeners.each(function(listener) {
                        listener(invitation);
                    });
                }
            },
                    function(packet) {
                        if (packet.getPacketType() != "message") {
                            return false;
                        }
                        var ex = packet.getExtension("x");
                        if (!ex) {
                            return false;
                        }

                        return ex.getAttribute("xmlns") == "http://jabber.org/protocol/muc#user";
                    });
            this._connection.addPacketFilter(this.invitationFilter);
        }
        this.invitationListeners.push(invitationListener);
    },
    removeInvitationsListener: function(invitationListener) {
        if (!invitationListener || !(invitationListener instanceof Function)) {
            throw Error("listeners must be a function");
        }

        var index = this.invitationListeners.indexOf(invitationListener);
        if (index >= 0) {
            this.invitationListeners.splice(index, 1);
        }
        if (this.invitationListeners.size() <= 0 && this.invitationFilter) {
            this._connection.removePacketFilter(this.invitationFilter);
            delete this.invitationFilter;
        }
    },
    declineInvitation: function(from, room, reason) {
        if (!room || !from) {
            throw Error("Cannot decline invitation, invitiation missing information");
        }
        var packet = new org.jive.spank.muc.User(room);
        packet.setDecline(from, reason);
        this._connection.sendPacket(packet);
    },
    destroy: function() {
        for (var i = 0; i < this.rooms.length; i++) {
            this.rooms[i].leave(true);
        }
        this.rooms.clear();
        this.invitationListeners.clear();
    }
}

org.jive.spank.muc.Room = function(manager, roomJID) {
    this.manager = manager;
    this.connection = manager._connection;
    this.jid = roomJID;
    this.presenceListeners = new Array();
    this.messageListeners = new Array();
    this.isJoined = false;
}

org.jive.spank.muc.Room.prototype = {
/**
 * Joins a MultiUserChat room by sending an available presence.
 *
 * @param {String} nickname
 * @param {String} password
 * @param {Function} joinCallback onSuccess is called if the room is joined successfully
 * and onError is called if it is not.
 * @param {Function} occupantListener
 */
    join: function(nickname, password, joinCallback, messageListener, occupantListener) {
        var roomJID = this.jid;
        var presence = new XMPP.Presence(roomJID.toString() + "/" + nickname);
        var mucExtension = presence.addExtension("x", "http://jabber.org/protocol/muc");
        if (password) {
            var passwordElement = mucExtension.appendChild(
                    presence.doc.createElement("password"));
            passwordElement.appendChild(presence.doc.createTextNode(password));
        }
        this._initPresenceManager(nickname, occupantListener);
        if (messageListener) {
            this._initMessageListener(messageListener);
        }
        var packetFilter;
        if (joinCallback && (joinCallback.onSuccess || joinCallback.onError)) {
            var room = this;
            packetFilter = new org.jive.spank.PacketFilter(function(packet) {
                if (packet.getError() && joinCallback.onError) {
                    this.presenceManager.destroy();
                    this.presenceManager = undefined;
                    this.connection.removePacketFilter(this.messageFilter);
                    joinCallback.onError(packet);
                }
                else if (!packet.getError() && joinCallback.onSuccess) {
                    this.manager._addRoom(this);
                    this.nickname = nickname;
                    room.occupantJid = new XMPP.JID(roomJID.toString() + "/" + nickname);
                    room.isJoined = true;
                    this.presenceManager._handlePresencePacket(packet);
                    joinCallback.onSuccess(new org.jive.spank.muc.Occupant(packet));
                }
                joinCallback = Prototype.emptyFunction;
            }.bind(this),
                    function(packet) {
                        return packet.getFrom().toString() == presence.getTo().toString();
                    });
        }
        this.connection.sendPacket(presence, packetFilter);
    },
    create: function(nickname, configuration, createCallback, messageListener, occupantListener) {
        var callback = {};
        if (createCallback.onSuccess) {
            callback.onSuccess = this._createSuccess.bind(this, createCallback.onSuccess,
                    configuration, messageListener, occupantListener);
        }
        this.join(nickname, null, callback);
    },
    _createSuccess: function(callback, configuration, messageListener, occupantListener, occupant) {
        var _handleConfigurationForm = function(occupant, configuration, callback, messageListener,
                                                occupantListener, room, configurationForm) {
            var answerForm = configurationForm.getAnswerForm();
            for (var answer in configuration) {
                answerForm.setAnswer(answer, [configuration[answer]]);
            }
            this.sendConfigurationForm(answerForm);
            this.addOccupantListener(occupantListener);
            this._initMessageListener(messageListener);
            callback(occupant);
            callback = Prototype.emptyFunction;
        };
        this.getConfigurationForm(_handleConfigurationForm.bind(this, occupant, configuration,
                callback, messageListener, occupantListener));
    },
    leave: function(shouldNotRemove) {
        this.isJoined = false;

        this.connection.removePacketFilter(this.messageFilter);
        delete this.connection;

        try {
            var presence = new XMPP.Presence();
            presence.setType("unavailable");
            this.presenceManager.sendPresence(presence);
        }
        catch(error) {
            // ohh well
        }

        this.presenceManager.destroy();
        this.presenceManager = undefined;
        if (!shouldNotRemove) {
            this.manager._removeRoom(this);
        }
    },
    _initPresenceManager: function(nickname, occupantListener) {
        this.presenceManager = new org.jive.spank.presence.Manager(this.connection,
                new XMPP.JID(this.jid.toString() + "/" + nickname));
        if (occupantListener) {
            this.addOccupantListener(occupantListener);
        }
    },
    addOccupantListener: function(occupantListener) {
        var presenceListener = function(presence) {
            if (!presence.getError()) {
                occupantListener(new org.jive.spank.muc.Occupant(presence));
            }
        };
        this.presenceManager.addPresenceListener(presenceListener);
    },
/**
 * Returns an array of all current occupants of the room.
 */
    getOccupants: function() {
        var occupants = new Array();
        var roomPresences = this.presenceManager._presence[this.jid];
        if (!roomPresences) {
            return occupants;
        }
        var resources = roomPresences.resources;
        for (var resource in resources) {
            var presence = resources[resource];
            if (presence.getType != "unavailable") {
                occupants.push(new org.jive.spank.muc.Occupant(presence));
            }
        }
        return occupants;
    },
    getOccupant: function(nick) {
        var userJID = this.jid + "/" + nick;

        var presence = this.presenceManager._presence[this.jid].resources[nick];
        if (presence == null || presence.getType() == "unavailable") {
            return null;
        }
        else {
            return new org.jive.spank.muc.Occupant(presence);
        }
    },
    _initMessageListener: function(messageListener) {
        var room = this;
        this.messageFilter = new org.jive.spank.PacketFilter(function(message) {
            room.messageListeners.each(function(listener) {
                var handled = false;
                if (message.getSubject() && listener.subjectUpdated) {
                    listener.subjectUpdated(room, message.getFrom(), message.getSubject());
                    handled = true;
                }
                var ex = message.getExtension("x");
                if (ex) {
                    var isUser = ex.getAttribute("xmlns") == "http://jabber.org/protocol/muc#user";
                    if (isUser && listener.invitationDeclined) {
                        var user = new org.jive.spank.muc.User(null, null, message.rootNode);
                        var decline = user.getDecline();
                        if (decline) {
                            listener.invitationDeclined(decline);
                            handled = true;
                        }
                    }
                }
                if (listener.messageReceived && !handled) {
                    listener.messageReceived(message);
                }
            });
        }, function(packet) {
            return packet.getFrom().toBareJID() == room.jid.toBareJID()
                    && packet.getPacketType() == "message" && (packet.getType()
                    == "groupchat" || packet.getType() == "normal");
        });

        this.connection.addPacketFilter(this.messageFilter);
        if (messageListener) {
            this.messageListeners.push(messageListener);
        }
    },
    sendMessage: function(messageBody, message) {
        if (!message) {
            message = new XMPP.Message("groupchat", this.connection, this.jid);
        }
        else {
            message.setType("groupchat");
            message.setFrom(this.jid);
        }
        message.setBody(messageBody);

        this.connection.sendPacket(message);
    },
    addMessageListener: function(messageListener) {
        if (!messageListener) {
            throw Error("listeners cannot be null");
        }
        this.messageListeners.push(messageListener);
    },
    removeMessageListener: function(messageListener) {
        if (!messageListener) {
            throw Error("listeners must be a function");
        }

        var index = this.messageListeners.indexOf(messageListener);
        if (index >= 0) {
            this.messageListeners.splice(index, 1);
        }
    },
    setSubject: function(subject) {
        var message = new XMPP.Message(this.jid);
        var ex = message.addExtension("subject");
        ex.appendChild(message.doc.createTextNode(subject));

        this.connection.sendPacket(message);
    },
    invite: function(jid, reason) {
        var invite = new org.jive.spank.muc.User(this.jid);
        invite.setInvite(jid, reason);
        this.connection.sendPacket(invite);
    },
    changeNickname: function(nickname) {
        if (!this.isJoined) {
            throw Error("Cannot change nickname if not in room.");
        }

        var presence = new XMPP.Presence();
        presence.setTo(new XMPP.JID(this.jid.toBareJID() + "/" + nickname));
        this.connection.sendPacket(presence);
    },
    getConfigurationForm: function(callback) {
        var iq = new XMPP.IQ("get", this.jid, this.jid.getBareJID());
        iq.setQuery("http://jabber.org/protocol/muc#owner");
        var packetFilter = org.jive.spank.PacketFilter.filter.IDFilter(function(response) {
            if (response.getExtension("x", "jabber:x:data")) {
                callback(this.jid.getBareJID(), new XMPP.XData(null,
                        response.getExtension("x", "jabber:x:data")));
            }
        }.bind(this), iq);
        this.connection.sendPacket(iq, packetFilter);
    },
    sendConfigurationForm: function(form, callback) {
        var iq = new XMPP.IQ("set", this.jid, this.jid.getBareJID());
        var query = iq.setQuery("http://jabber.org/protocol/muc#owner");

        var formNode = form.rootNode.cloneNode(true);
        iq.doc.importNode(formNode, true);
        query.appendChild(formNode);

        // trim the form
        var nodes = formNode.childNodes;
        for (var i = nodes.length - 1; i >= 0; i--) {
            if (!nodes[i].hasChildNodes()) {
                formNode.removeChild(nodes[i]);
            }
        }

        var packetFilter;
        if (callback) {
            org.jive.spank.PacketFilter.filter.IDFilter(function(response, jid) {
                callback(jid.getBareJID());
            }.bind(this), this.jid);
        }
        this.connection.sendPacket(iq, packetFilter);
    }
}

org.jive.spank.muc.Occupant = function(presence) {
    this.presence = presence;
}

org.jive.spank.muc.Occupant.prototype = {
    getAffiliation: function() {
        var user = this.presence.getExtension("x");
        if (user == null) {
            return null;
        }
        return user.firstChild.getAttribute("affiliation");
    },
    getRole: function() {
        var user = this.presence.getExtension("x");
        if (user == null) {
            return null;
        }
        return user.firstChild.getAttribute("role");
    },
    getNick: function() {
        return this.presence.getFrom().getResource();
    },
    getRoom: function() {
        return this.presence.getFrom().toBareJID();
    }
}

/**
 * When packets are recieved by spank they go through a packet filter in order for interested parties
 * to be able to recieve them.
 *
 * @param {Function} callback the callback to execute after the filter test is passed.
 * @param {Function} filterTest the test to see if the callback should be executed, if this parameter
 * is undefined then all packets will be accepted.
 */
org.jive.spank.PacketFilter = function(callback, filterTest) {
    if (!callback) {
        throw Error("Callback must be specified");
    }

    this.getFilterTest = function() {
        return filterTest
    };
    this.getCallback = function() {
        return callback
    };
}

org.jive.spank.PacketFilter.prototype = {
/**
 * Tests the packet using the filter test and passes it to the callback if it passes the
 * test.
 *
 * @param {Object} packet the packet to test and pass to the callback if the test passes
 * @return {Boolean} true if the callback was executed and false if it was not.
 */
    accept: function(packet) {
        if (!packet || !(packet instanceof XMPP.Packet)) {
            return;
        }
        var filterTest = this.getFilterTest();
        var executeCallback = true;
        if (filterTest) {
            executeCallback = filterTest(packet);
        }
        if (executeCallback) {
            var callback = this.getCallback();
            callback(packet);
        }
        return executeCallback;
    }
}

org.jive.spank.PacketFilter.filter = {
    IDFilter: function(callback, packet) {
        return new org.jive.spank.PacketFilter(callback, function(packet, testPacket) {
            return testPacket.getID() == packet.getID();
        }.bind(this, packet));
    }
}

org.jive.spank.x = {}

org.jive.spank.x.chatstate = {
    _connections: new Array(),
/**
 * Retrieves a singleton for the connection which is the chat state manager.
 *
 * @param {org.jive.spank.chat.Manager} manager the chat manager to retrieve the singleton for.
 */
    getManager: function(manager) {
        if (org.jive.spank.x.chatstate._connections[manager.getConnection()._sid] == null) {
            org.jive.spank.x.chatstate._connections[manager.getConnection()._sid] = new org.jive.spank.x.chatstate.Manager(manager);
        }
        return org.jive.spank.x.chatstate._connections[manager.getConnection()._sid];
    }
}

org.jive.spank.x.chatstate.Manager = function(manager) {
    this._manager = manager;
    this._connection = manager.getConnection();
    this._lastState = {};
    this._lastStateSent = {};
    this._stateListeners = new Array();
    var self = this;
    this._connection.addPacketFilter(new org.jive.spank.PacketFilter(this._handleIncomingState.bind(this),
            function(packet) {
                return packet.getPacketType() == "message"
                        && (packet.getType() == "chat" || packet.getType() == "groupchat")
                        && packet.getExtension(null, "http://jabber.org/protocol/chatstates")
                        && !packet.getExtension("x", "jabber:x:delay");
            }));
    manager.getConnection().addConnectionListener({
        connectionClosed: function() {
            self.destroy();
        }
    });
    org.jive.spank.disco.getManager(manager.getConnection()).addFeature("http://jabber.org/protocol/chatstates");
}

org.jive.spank.x.chatstate.Manager.prototype = {
    setCurrentState: function(chatState, jid, message, isMultiUserChat) {
        var created = false;
        if (!message) {
            message = new XMPP.Message((isMultiUserChat ? "groupchat" : "chat"), null, jid);
            created = true;
        }
        if (!isMultiUserChat && !this.shouldSendState(jid)) {
            if (created) {
                return null;
            }
            else {
                return message;
            }
        }
        chatState = (chatState ? chatState : "active");
        message.addExtension(chatState, "http://jabber.org/protocol/chatstates");
        this._lastStateSent[jid.toString()] = chatState;
        return message;
    },
    shouldSendState: function(jid) {
        if (this._lastState[jid.toString()]) {
            return this._lastState[jid.toString()];
        }
        // if there is no resource attached we cannot send an iq request so we have to operate
        // purely on whether or not we have already sent them a state at this point, if we have
        // then don't send them anything.
        if (!jid.getResource()) {
            return !this._lastStateSent[jid.toString()];
        }
        var disco = org.jive.spank.disco.getManager(this._connection);
        var category = disco.getCategory(jid);
        if (!category) {
            return false;
        }
        // This is a MUC we can send state
        else if (category == "conference") {
            return true;
        }

        return disco.hasFeature(jid, "http://jabber.org/protocol/chatstates");
    },
    addStateListener: function(stateListener) {
        if (stateListener && stateListener instanceof Function) {
            this._stateListeners.push(stateListener);
        }
    },
    removeStateListener: function(stateListener) {
        if (stateListener) {
            var i = this._stateListeners.indexOf(stateListener);
            if (i >= 0) {
                this._stateListeners.splice(i, 1);
            }
        }
    },
    _handleIncomingState: function(message) {
        var from = message.getFrom().toString();
        var extension = message.getExtension(null, "http://jabber.org/protocol/chatstates");
        this._lastState[from] = extension.tagName;
        for (var i = 0; i < this._stateListeners.length; i++) {
            this._stateListeners[i](message.getFrom(), extension.tagName, message.getType() == "groupchat");
        }
    },
    destroy: function() {

    }
}

var util = {
    XML: {
        element: function(name, content, attributes) {
            var att_str = '';
            if (attributes) {
                att_str = this.formatAttributes(attributes);
            }
            var xml;
            if (!content) {
                xml = '<' + name + att_str + '/>';
            }
            else {
                xml = '<' + name + att_str + '>' + content + '</' + name + '>';
            }
            return xml;
        },
        formatAttributes: function(attrs) {
            var attr_string = "";

            for (var attr in attrs) {
                var attr_value = attrs[attr];
                attr_string += ' ' + attr + '="' + attr_value + '"';
            }

            return attr_string;
        }
    },
    HTTP: {
        requestCount: 0,
        maxConcurrentRequests: 2,
        failureState: false,
        pendingRequests: new Array(),
        doRequest: function(url, bodyContent, callback, onFailure, onException) {
            if (this.failureState) {
                throw Error("HTTP connection in failure state and must be reset.");
            }
            if (this.requestCount >= this.maxConcurrentRequests) {
                this.pendingRequests.push({
                    requestURL: url,
                    requestBody: bodyContent,
                    requestCallback: callback,
                    requestFailure: onFailure,
                    requestException: onException
                });
                return;
            }
            var pendingRequests = this.pendingRequests;
            var successCallback = function(originalRequest) {
                util.HTTP.requestCount--;
                if (pendingRequests.length > 0) {
                    var request = pendingRequests.splice(0, 1)[0];
                    util.HTTP.doRequest(request.requestURL, request.requestBody,
                            request.requestCallback, request.requestFailure, request.requestException);
                }
                if (callback) {
                    callback(originalRequest);
                }
            }
            var failureCallback = function(originalRequest, header) {
                util.HTTP.requestCount--;
                // Turning on a failure state will cause an subsequent requests to fail.
                util.HTTP.failureState = true;
                if (!onFailure) {
                    return;
                }
                pendingRequests.splice(0, 0, {
                    requestURL: url,
                    requestBody: bodyContent,
                    requestCallback: callback,
                    requestFailure: onFailure,
                    requestException: onException
                });
                onFailure(originalRequest, header);
            }
            var exceptionCallback = function(originalRequest, error) {
                util.HTTP.requestCount--;
                // Turning on a failure state will cause an subsequent requests to fail.
                util.HTTP.failureState = true;
                console.error("Request exception! " + error);
                if (!onException) {
                    return;
                }
                pendingRequests.splice(0, 0, {
                    requestURL: url,
                    requestBody: bodyContent,
                    requestCallback: callback,
                    requestFailure: onFailure,
                    requestException: onException
                });
                onException(originalRequest, error);
            }
            this.requestCount++;
            var request;
            if (typeof Flash != 'undefined') {
                request = new Flash.request();
                request.onload = successCallback;
                request.open("POST", url);
                request.send(bodyContent);
            }
            else {
                request = new Ajax.Request(url, {
                    method: "post",
                    postBody: bodyContent,
                    onSuccess: successCallback,
                    onException: exceptionCallback,
                    onFailure: failureCallback
                });
            }
        },
        reset: function() {
            this.failureState = false;
            this.pendingRequests = new Array();
        }},
    Integer: {
        randomInt: function(intFrom, intTo, intSeed) {
            // Make sure that we have integers.
            intFrom = Math.floor(intFrom);
            intTo = Math.floor(intTo);

            // Return the random number.
            return(
                    Math.floor(
                            intFrom +
                            (
                                    (intTo - intFrom + 1) *

                                    // Seed the random number if a value was passed.
                                    Math.random(
                                            (intSeed != null) ? intSeed : 0
                                            )
                                    ))
                    );
        }
    },
    StringUtil: {
        randomString: function(len) {
            // Define local variables.
            var strLargeText = "";
            var intValue = 0;
            var arrCharacters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ" ;

            // Loop over number of characters in string.
            for (var intI = 0; intI < len; intI++) {

                // Get a random value between 0 and the length of the
                // character list.
                intValue = util.Integer.randomInt(0, (arrCharacters.length - 1), intI);

                // Append a character that is randomly chosen
                strLargeText += arrCharacters.charAt(intValue);

            }
            return strLargeText;
        }
    }
};

var XMPP = { };

XMPP.Packet = function() {
};

XMPP.Packet.packetID = 1;

XMPP.Packet.prototype = {
    idBase: util.StringUtil.randomString(5),
    _init: function(packetType, from, to, element) {
        this.doc = Sarissa.getDomDocument();
        var created = !element;
        if (!element) {
            element = this.doc.createElement(packetType);
        }
        // Fix for safari, IE6 doesn't support importNode but works
        // fine with just appendChild
        else if (!_SARISSA_IS_IE) {
            element = this.doc.importNode(element, true);
        }
        this.doc.appendChild(element);

        this.rootNode = this.doc.firstChild;
        if (created) {
            this.addAttributes({id: this._nextPacketID()});
            this.setFrom(from);
            this.setTo(to);
        }
    },
    getPacketType: function() {
        return this.rootNode.tagName;
    },
    getID: function() {
        return this.rootNode.getAttribute("id");
    },
    setID: function(id) {
        this.rootNode.setAttribute("id", id);
    },
    _nextPacketID: function() {
        return this.idBase + "-" + XMPP.Packet.packetID++;
    },
    removeAttributes: function(attributes) {
        for (var i = 0; i < attributes.length; i++) {
            this.rootNode.removeAttribute(attributes[i]);
        }
    },
    addAttributes: function(attributes) {
        for (var attr in attributes) {
            this.rootNode.setAttribute(attr, attributes[attr]);
        }
    },
    setFrom: function(fromValue) {
        if (!fromValue || fromValue == "") {
            this.removeAttributes($A("from"));
        }
        else {
            this.addAttributes({ from: fromValue });
        }
    },
    getFrom: function() {
        if (this.from) {
            return this.from;
        }
        var from = this.rootNode.getAttribute("from");
        if (!from) {
            this.from = null;
        }
        else {
            this.from = new XMPP.JID(from);
        }
        return this.from;
    },
    setTo: function(toValue) {
        this.to = null;
        if (!toValue || toValue == "") {
            this.removeAttributes($A("to"));
        }
        else {
            this.addAttributes({ to: toValue });
        }
    },
/**
 * Returns the JID of the user to whom this packet is being directed.
 *
 * @return {XMPP.JID} the JID of the user to whom this packet is being directed.
 */
    getTo: function() {
        if (this.to) {
            return this.to;
        }
        var to = this.rootNode.getAttribute("to");
        if (!to) {
            this.to = null;
        }
        else {
            this.to = new XMPP.JID(to);
        }
        return this.to;
    },
/**
 * Sets the namespace of the packet.
 * NOTE: Opera requires that the namespace of an element be set when it is created
 * so this method will not work in opera.
 *
 * @param {String} xmlnsValue the namespace to be set on the packet.
 */
    setXMLNS: function(xmlnsValue) {
        if (!xmlnsValue || xmlnsValue == "") {
            this.removeAttributes($A("xmlns"));
        }
        else {
            this.addAttributes({ xmlns: xmlnsValue });
        }
    },
/**
 * Serializes the packet to a string.
 */
    toXML: function() {
        var xml = this.doc.xml ? this.doc.xml
                : (new XMLSerializer()).serializeToString(this.doc);
        if (xml.indexOf('<?xml version="1.0"?>') >= 0) {
            // 'fix' for opera so that it doesn't pass this along.
            xml = xml.substr('<?xml version="1.0"?>'.length);
        }
        return xml;
    },
/**
 * Creates and adds an extension to the packet, returning the created extension.
 *
 * @param {String} extensionName the name of the extension that is being created.
 * @param {String} extensionNamespace (optional) the namespace of the extension that is
 * being created
 */
    addExtension: function(extensionName, extensionNamespace) {
        if (extensionNamespace && this.doc.createElementNS) {
            this.extension = this.rootNode.appendChild(
                    this.doc.createElementNS(extensionNamespace,
                            extensionName));
        }
        else {
            this.extension = this.rootNode.appendChild(
                    this.doc.createElement(extensionName));
        }
        if (extensionNamespace) {
            this.extension.setAttribute("xmlns", extensionNamespace);
        }

        return this.extension;
    },
    addTextExtension: function(textNodeName, textNodeContent) {
        var textNode = this.addExtension(textNodeName);
        textNode.appendChild(this.doc.createTextNode(textNodeContent));
    },
/**
 * Returns the first packet extension that matches the given arguments. Note that this method returns the
 * actual element inside of the document and not a clone. Both arguments are
 * optional, and, if none match null is returned.
 *
 * @param {String} extensionName the name of the extension that is to be returned.
 * @param {String} namespace the namespace of extension that is to be returned.
 */
    getExtension: function(extensionName, namespace) {
        var nodes = this.getExtensions(extensionName, namespace);
        if (!nodes || nodes.length <= 0) {
            return null;
        }
        else {
            return nodes[0];
        }
    },
    getExtensions: function(extensionName, namespace) {
        if (!extensionName) {
            extensionName = "*";
        }
        var nodes = this.rootNode.getElementsByTagName(extensionName);
        if (nodes.length <= 0) {
            return new Array();
        }

        var collector = function(node) {
            if (!namespace || node.getAttribute("xmlns") == namespace) {
                return node;
            }
            else {
                return null;
            }
        }

        return $A(nodes).collect(collector).toArray().compact();
    },
/**
 * Removes and returns the first extension in the list of extensions with the given
 * name.
 *
 * @param {String} extensionName the name of the extension to be removed from the extensions.
 */
    removeExtension: function(extensionName) {
        var extensions = this.rootNode.childNodes;
        for (var i = 0; i < extensions.length; i++) {
            if (extensions[i].tagName == extensionName) {
                return this.rootNode.removeChild(extensions[i]);
            }
        }
    },
/**
 * If the packet contains an error returns the error code, or null if there is no error.
 */
    getError: function() {
        var error = this.getExtension("error");
        if (error == null) {
            return null;
        }
        else {
            return error.getAttribute("code");
        }
    }
};

XMPP.IQ = function(packetType, from, to, element, init) {
    if (init) {
        return;
    }
    this._init("iq", from, to, element);

    if (!element) {
        this.setType(packetType);
    }
};

XMPP.IQ.prototype = Object.extend(new XMPP.Packet(), {
    setType: function(packetType) {
        if (!packetType || packetType == "") {
            packetType = "get";
        }
        this.addAttributes({ type: packetType });
    },
    getType: function() {
        return this.rootNode.getAttribute("type");
    },
    setQuery: function(xmlns) {
        return this.addExtension("query", xmlns);
    },
    getQuery: function() {
        return this.getExtension("query");
    }
});

XMPP.Registration = function(packetType, to, element) {
    this._init("iq", null, to, element);

    if (!element) {
        this.setType(packetType);
        this.setQuery("jabber:iq:register");
    }
}

XMPP.Registration.prototype = Object.extend(new XMPP.IQ(null, null, null, null, true), {
    getInstructions: function() {
        var instructions = this.getExtension("instructions");
        if (!instructions) {
            return null;
        }
        else if (!instructions.firstChild) {
            return "";
        }
        return  instructions.firstChild.nodeValue;
    },
    setAttributes: function(map) {
        for (var attr in map) {
            this.addTextExtension(attr, map[attr]);
        }
    }
});

XMPP.Presence = function(to, from, element) {
    this._init("presence", from, to, element);
}

XMPP.Presence.prototype = Object.extend(new XMPP.Packet(), {
    setType: function(presenceType) {
        if (!presenceType || presenceType == "" || presenceType == "available") {
            this.removeAttributes($A("type"));
        }
        else {
            this.addAttributes({ type : presenceType});
        }
    },
    getType: function() {
        var type = this.rootNode.getAttribute("type")
        return (type ? type : "available");
    },
    setPriority: function(priority) {
        if (!priority || !(priority instanceof Number)) {
            this.removeExtension("priority");
        }
        else {
            this.addTextExtension("priority", priority);
        }
    },
    getPriority: function() {
        var priority = this.getExtension("priority");
        if (priority) {
            return priority.firstChild.nodeValue;
        }
        else {
            return 0;
        }
    },
    setMode: function(mode) {
        if (!mode || mode == "" || mode == "available") {
            this.removeExtension("show");
        }
        else {
            this.addTextExtension("show", mode);
        }
    },
    getMode: function() {
        var show = this.getExtension("show");
        if (show) {
            return show.firstChild.nodeValue;
        }
        else {
            return null;
        }
    },
    setStatus: function(status) {
        if (!status || status == "") {
            this.removeExtension("status");
        }
        else {
            this.addTextExtension("status", status);
        }
    },
    getStatus: function() {
        var status = this.getExtension("status");
        if (status && status.firstChild) {
            return status.firstChild.nodeValue;
        }
        else {
            return null;
        }
    }
});

XMPP.Message = function(packetType, from, to, element) {
    if (!packetType && !from && !to && !element) {
        return;
    }
    this._init("message", from, to, element);

    if (!element) {
        this.setType(packetType);
    }
}

XMPP.Message.prototype = Object.extend(new XMPP.Packet(), {
    setType: function(messageType) {
        if (!messageType || messageType == "" || messageType == "normal") {
            this.removeAttributes($A("type"));
        }
        else {
            this.addAttributes({ type : messageType });
        }
    },
    getType: function() {
        var type = this.rootNode.getAttribute("type");
        if (!type) {
            type = "normal";
        }
        return type;
    },
    setSubject: function(subject) {
        if (!subject || subject == "") {
            this.removeExtension("subject");
        }
        else {
            this.addTextExtension("subject", subject);
        }
    },
    getSubject: function() {
        var subject = this.getExtension("subject");
        if (!subject) {
            return null;
        }
        else if (!subject.firstChild) {
            return "";
        }
        return  subject.firstChild.nodeValue;
    },
    setBody: function(body) {
        if (!body || body == "") {
            this.removeExtension("body");
        }
        else {
            this.addTextExtension("body", body);
        }
    },
    getBody: function() {
        var body = this.getExtension("body");
        if (!body) {
            return null;
        }
        return {
            body: body.firstChild.nodeValue,
            lang: body.getAttribute("lang")
        }
    },
    getBodies: function() {
        var bodies = this.getExtensions("body");
        if (!body) {
            return null;
        }
        return bodies.collect(function(body) {
            return {
                body: body.firstChild.nodeValue,
                lang: body.getAttribute("lang")
            }
        });
    },
    setThread: function(thread) {
        if (!thread || thread == "") {
            this.removeExtension("thread");
        }
        else {
            this.addTextExtension("thread", thread);
        }
    },
    getThread: function() {
        var threadExtension = this.getExtension("thread");
        if (!threadExtension) {
            return null;
        }

        return threadExtension.firstChild.nodeValue;
    }
});

org.jive.spank.roster.Packet = function(packetType, from, to, element) {
    this._init("iq", from, to, element);

    if (!element) {
        this.setType(packetType);
        this.setQuery("jabber:iq:roster");
    }
}

org.jive.spank.roster.Packet.prototype = Object.extend(new XMPP.IQ(null, null, null, null, true), {
    getItems: function() {
        var items = new Array();
        var nodes = this.getExtension().childNodes;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].tagName != "item") {
                continue;
            }

            var item = new org.jive.spank.roster.Item(nodes[i].cloneNode(true));
            items.push(item);
        }
        return items;
    },
    addItem: function(jid, name) {
        var item = this.doc.createElement("item");
        this.getExtension().appendChild(item);

        item.setAttribute("jid", jid.toBareJID());
        if (name) {
            item.setAttribute("name", name);
        }

        return new org.jive.spank.roster.Item(item);
    }
});

org.jive.spank.roster.Item = function(element) {
    this._element = element;
}

org.jive.spank.roster.Item.prototype = {
    getJID: function() {
        var attr = this._element.getAttribute("jid");
        if (!attr) {
            return null;
        }
        else {
            return new XMPP.JID(attr);
        }
    },
    getName: function() {
        return this._element.getAttribute("name");
    },
    isSubscriptionPending: function() {
        return this._element.getAttribute("ask");
    },
    getSubscription: function() {
        return this._element.getAttribute("subscription");
    },
    setSubscription: function(subscription) {
        this._element.setAttribute("subscription", subscription);
    },
    getGroups: function() {
        var nodes = this._element.childNodes;
        var groups = new Array();
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].tagName == "group" && nodes[i].firstChild) {
                groups.push(nodes[i].firstChild.nodeValue);
            }
        }
        return groups;
    },
    addGroups: function(groups) {
        for (var i = 0; i < groups.length; i++) {
            var groupNode = this._element.appendChild(this._element.ownerDocument
                    .createElement("group"));
            groupNode.appendChild(this._element.ownerDocument.createTextNode(groups[i]));
        }
    }
}

org.jive.spank.muc.User = function(to, from, element) {
    this._init("message", from, to, element);

    if (!element) {
        this.addExtension("x", "http://jabber.org/protocol/muc#user");
    }
}

org.jive.spank.muc.User.prototype = Object.extend(new XMPP.Message(), {
    setInvite: function(jid, reason) {
        if (!jid || !(jid instanceof XMPP.JID)) {
            throw Error("Inivte must contain invitee, provide a JID");
        }

        var invite = this.doc.createElement("invite");
        this.getExtension().appendChild(invite);

        invite.setAttribute("to", jid.toString());

        if (reason) {
            var reasonNode = this.doc.createElement("reason");
            reasonNode.appendChild(this.doc.createTextNode(reason));
            invite.appendChild(reasonNode);
        }
    },
    getInvite: function() {
        var ex = this.getExtension("x");
        if (!ex) {
            return null;
        }
        var childNodes = ex.childNodes;
        var invite;
        for (var i = 0; i < childNodes.length; i++) {
            var node = childNodes[i];
            if (node.tagName == "invite") {
                invite = node;
                break;
            }
        }
        if (!invite) {
            return null;
        }

        var reason = invite.firstChild;
        if (reason) {
            reason = reason.firstChild.nodeValue;
        }
        else {
            reason = null;
        }

        var invitation = {};
        invitation["room"] = this.getFrom();
        invitation["from"] = invite.getAttribute("from");
        if (reason) {
            invitation["reason"] = reason;
        }
        return invitation;
    },
    setDecline: function(jid, reason) {
        if (!jid || !(jid instanceof XMPP.JID)) {
            throw Error("Invite must contain invitee, provide a JID");
        }

        var decline = this.doc.createElement("decline");
        this.getExtension().appendChild(decline);

        decline.setAttribute("to", jid.toString());

        if (reason) {
            var reasonNode = this.doc.createElement("reason");
            reasonNode.appendChild(this.doc.createTextNode(reason));
            decline.appendChild(reasonNode);
        }
    },
    getDecline: function() {
        var ex = this.getExtension("x");
        if (!ex) {
            return null;
        }
        var childNodes = ex.childNodes;
        var declineNode;
        for (var i = 0; i < childNodes.length; i++) {
            var node = childNodes[i];
            if (node.tagName == "decline") {
                declineNode = node;
                break;
            }
        }
        if (!declineNode) {
            return null;
        }

        var reason = declineNode.firstChild;
        if (reason) {
            reason = reason.firstChild.nodeValue;
        }
        else {
            reason = null;
        }

        var decline = {};
        decline.room = this.getFrom();
        decline.from = declineNode.getAttribute("from");
        if (reason) {
            decline.reason = reason;
        }
        return decline;
    }
});

/**
 * A message with the muc owner extension attached to it. The owner extension handles
 * things like destroying a room and changing user roles.
 *
 * @param {JID} to the room handling the owner packet.
 * @param {JID} from the owner sending the request.
 * @param {Element} element the base element used to create this packet.
 */
org.jive.spank.muc.Owner = function(packetType, to, from, element) {
    this._init("iq", from, to, element);

    if (!element) {
        this.setQuery("http://jabber.org/protocol/muc#owner");
    }
}

org.jive.spank.muc.Owner.prototype = Object.extend(new XMPP.IQ(null, null, null, null, true), {
    setDestroy: function(reason, jid) {
        var destroy = this.doc.createElement("destroy");
        this.getExtension().appendChild(destroy);

        if (jid) {
            destroy.setAttribute("jid", jid.toString());
        }
        if (reason) {
            var reasonNode = this.doc.createElement("reason");
            reasonNode.appendChild(this.doc.createTextNode(reason));
            destroy.appendChild(reasonNode);
        }
    },
    getDestroy: function() {
        var childNodes = this.getExtension().childNodes;
        var destroyNode;

        for (var i = 0; i < childNodes.length; i++) {
            if (childNodes[i].tagName == "destroy") {
                destroyNode = childNodes[i];
                break;
            }
        }

        if (destroyNode) {
            var jid = destroyNode.getAttribute("jid");
            var reason;
            if (destroyNode.firstChild) {
                reason = destroyNode.firstChild.firstChild.nodeValue;
            }
            return {
                jid: jid,
                reason: reason
            }
        }
        else {
            return null;
        }
    },
    addItem: function(affiliation, jid, nick, role, reason, actor) {
        var item = this.doc.createElement("item");
        this.getExtension().appendChild(item);

        if (affiliation) {
            item.setAttribute("affiliation", affiliation);
        }
        if (jid && jid instanceof XMPP.JID) {
            item.setAttribute("jid", jid.toString());
        }
        if (nick) {
            item.setAttribute("nick", nick);
        }
        if (role) {
            item.setAttribute("role", role);
        }
        if (reason) {
            var reasonNode = this.doc.createElement("reason");
            reasonNode.appendChild(this.doc.createTextNode(reason));
            destroy.appendChild(reasonNode);
        }
        if (actor) {
            var actorNode = this.doc.createElement("actor");
            actorNode.setAttribute("jid", actor);
            destroy.appendChild(actorNode);
        }
    }
});


XMPP.JID = function(jid) {
    this.jid = jid.toLowerCase();
}

XMPP.JID.prototype = {
    toString: function() {
        return this.jid;
    },
    toBareJID: function() {
        if (!this.bareJID) {
            var i = this.jid.indexOf("/");
            if (i < 0) {
                this.bareJID = this.jid;
            }
            else {
                this.bareJID = this.jid.slice(0, i);
            }
        }
        return this.bareJID;
    },
    getBareJID: function() {
        return new XMPP.JID(this.toBareJID());
    },
    getResource: function() {
        var i = this.jid.indexOf("/");
        if (i < 0) {
            return null;
        }
        else {
            return this.jid.slice(i + 1);
        }
    },
    getNode: function() {
        var i = this.jid.indexOf("@");
        if (i < 0) {
            return null;
        }
        else {
            return this.jid.slice(0, i);
        }
    },
    getDomain: function() {
        var i = this.jid.indexOf("@");
        var j = this.jid.indexOf("/");
        if (i < 0) {
            return null;
        }
        else {
            if (j < 0) {
                return this.jid.slice(i + 1);
            }
            else {
                return this.jid.slice(i + 1, j);
            }
        }
    }
}

XMPP.PacketExtension = function() {
};

XMPP.PacketExtension.prototype = {
    _init: function(fieldName, namespace, element) {
        this.doc = Sarissa.getDomDocument();
        var created = !element;
        if (!element) {
            element = this.doc.createElementNS(namespace, fieldName);
        }
        // Fix for safari, IE6 doesn't support importNode but works
        // fine with just appendChild
        else if (!_SARISSA_IS_IE) {
            element = this.doc.importNode(element, true);
        }
        this.doc.appendChild(element);

        this.rootNode = this.doc.firstChild;
    }
}

XMPP.XData = function(type, element) {
    this._init("x", "jabber:x:data", element);

    if (type) {
        this.setType(type);
    }
}

XMPP.XData.prototype = Object.extend(new XMPP.PacketExtension(), {
    getType: function() {
        this.rootNode.getAttribute("type");
    },
/**
 * Valid form types are as follows:
 * form  	The form-processing entity is asking the form-submitting entity to complete a form.
 * submit 	The form-submitting entity is submitting data to the form-processing entity.
 * cancel 	The form-submitting entity has cancelled submission of data to the form-processing entity.
 * result 	The form-processing entity is returning data (e.g., search results) to the
 * form-submitting entity, or the data is a generic data set
 *
 * @param {String} type the type of the form.
 */
    setType: function(type) {
        if (!type) {
            type = "form";
        }

        this.rootNode.setAttribute("type", type);
    },
    getFields: function() {
        var fields = this.rootNode.childNodes;

        var toReturn = {};
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            if (field.tagName != "field" || field.getAttribute("type") == "hidden") {
                continue;
            }

            var variable = field.getAttribute("var");
            var fieldLabel = field.getAttribute("label");
            var values = new Array();
            var fieldValues = field.childNodes;
            for (var j = 0; j < fieldValues.length; j++) {
                if (fieldValues[j].tagName != "value" || !fieldValues[j].firstChild) {
                    continue;
                }
                values.push(fieldValues[j].firstChild.nodeValue);
            }

            toReturn[variable] = {
                fieldLabel: fieldLabel,
                values: values
            }
        }
        return toReturn;
    },
    getAnswerForm: function() {
        var answerForm = new XMPP.XData("submit");

        var fields = $A(this.rootNode.childNodes);
        fields.each(function(field) {
            if (field.tagName != "field" || !field.getAttribute("var")) {
                return;
            }

            var shouldCloneChildren = field.getAttribute("type") == "hidden";
            var node = answerForm.doc.importNode(field.cloneNode(shouldCloneChildren), true);
            answerForm.rootNode.appendChild(node);
        });
        return answerForm;
    },
    setAnswer: function(variable, answers) {
        var field = this.getField(variable);
        if (!field) {
            return;
        }
        answers.each(function(answer) {
            var textNode = field.appendChild(this.doc.createElement("value"));
            textNode.appendChild(this.doc.createTextNode(answer));
        }.bind(this));
    },
    getField: function(variable) {
        return $A(this.rootNode.childNodes).detect(function(field) {
            return field.getAttribute("var") == variable;
        });
    }
});

XMPP.DelayInformation = function(element) {
    this.element = element;
}

XMPP.DelayInformation.prototype = {
    getDate: function() {
        var stamp = this.element.getAttribute("stamp");

        var date = new Date();
        var datetime = stamp.split("T");
        date.setUTCFullYear(datetime[0].substr(0, 4), datetime[0].substr(4, 2) - 1,
                datetime[0].substr(6, 2));
        var time = datetime[1].split(":");
        date.setUTCHours(time[0], time[1], time[2]);
        return date;
    }
}

/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 *
 **/

util.base64 = {

// private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

// public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = util.base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            }
            else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                     this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                     this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

// public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = util.base64._utf8_decode(output);

        return output;

    },

// private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

// private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c, c1, c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                var c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}

if (typeof console == 'undefined' || !console.firebug) {
    // Try to be compatible with other browsers
    // Only use firebug logging when available
    var console = new Object;
    console.trace = function() {
    };
    console.log = function() {
    };
    console.debug = function(message) {
        if (typeof opera != "undefined") {
            opera.postError(message);
        }
    };
    console.info = function() {
    };
    console.warn = function() {
    };
    console.error = function(message) {
        if (typeof opera != "undefined") {
            opera.postError(message);
        }
    };
    console.time = function() {
    };
    console.timeEnd = function() {
    };
    console.count = function() {
    };
    console.profile = function() {
    };
    console.profileEnd = function() {
    };
}
