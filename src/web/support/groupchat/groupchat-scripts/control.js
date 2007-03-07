org.jive.spank.control = {
    doConnect: function(usernameField, passwordField, server) {
        var connBtn = getEl("connect");
        connBtn.dom.disabled = true;
        connBtn.hide();
        jive.spank.Spinner.show({x: connBtn.getX() - 10, y: connBtn.getY()});
        window.connection = new XMPPConnection("/http-bind/", server,
                new org.jive.spank.control.ConnectionListener(usernameField, passwordField));
        connection.connect();
    },
    doLogout: function() {
        var presence = new XMPP.Presence();
        presence.setType("unavailable");
        connection.logout(presence);
    },
    onUnload: function(event) {
        if (typeof window.rosterWindow == "undefined") {
            return;
        }
        var answer = confirm("Leaving this page will disconnect you from Sparkweb, are you sure?");
        if (answer) {
            org.jive.spank.control.doLogout();
        }
        else {
            event.stopEvent();
        }
    },
    doRegistration: function() {
        window.accountDialog = new jive.spank.dialog.CreateAccount(doRegistrationValidation);
    },
    doRegistrationValidation: function(fields) {

    },
    windows: {}
}

//YAHOO.ext.EventManager.addListener(window, "unload", org.jive.spank.control.onUnload);

org.jive.spank.control.ConnectionListener = function(usernameField, passwordField) {
    this.usernameField = usernameField;
    this.passwordField = passwordField;
}

org.jive.spank.control.ConnectionListener.prototype = {
    connectionSuccessful: function(connection) {
        window.chatManager = new org.jive.spank.chat.Manager(connection);
        window.chatSessionListener = new org.jive.spank.chat.ChatSessionListener(chatSessionCreated,
                chatSessionClosed);
        chatManager.addChatSessionListener(chatSessionListener);

        window.muc = new org.jive.spank.muc.Manager(connection, chatManager);

        console.debug("Connection successfully established.");
        var username = $F(this.usernameField);
        var password = $F(this.passwordField);
        connection.login(username, password, null);
    },
    connectionFailed: function() {
        this.authenticationFailed();
    },
    connectionClosed: function(closedConnection, error) {
        destroyAllChatWindows();
        if (window.rosterWindow) {
            window.rosterWindow.destroy();
            window.rosterWindow = undefined;
        }
        window.presenceManager = undefined;
        window.rosterManager = undefined;
        window.conferenceServers = undefined;
        window.mucControl = undefined;
        window.connection = undefined;
        window.chatManager = undefined;
        window.contactMonitor = undefined;
        window.mucManager = undefined;
        window.muc = undefined;
        $("jive-loginBox").style.visibility = "";
        $("jive-webTop").style.display = "";
        $("loginText").innerHTML = "";
        var connBtn = getEl("connect");
        connBtn.dom.disabled = false;
        connBtn.show();
        $(this.usernameField).value = "";
        $(this.passwordField).value = "";
        if (error) {
            alert("Your connection to the server has closed.");
        }
        jive.spank.Spinner.hide();
    },
    authenticationSuccessful: function(connection) {
        $("loginText").innerHTML = "Login successful!";
        window.contactMonitor = new org.jive.spank.control.ContactMonitor();
        window.presenceManager = new org.jive.spank.presence.Manager(connection, null, "manual");
        window.presenceManager.addPresenceListener(contactMonitor.handlePresence.bind(contactMonitor));
        window.rosterManager = new org.jive.spank.roster.Manager(connection, doRoster, presenceManager);
        window.mucManager = new org.jive.spank.control.MucManager(muc);

        window.conferenceServers = new Array();
        muc.getConferenceServers(function(server) {
            window.mucControl.enable();
            conferenceServers.push(server);
        });

        org.jive.spank.x.chatstate.getManager(chatManager)
                .addStateListener(contactMonitor.handleState.bind(contactMonitor));
    },
    authenticationFailed: function(failedConnection, error) {
        $("loginText").innerHTML = "Login failure. :(";
        var connBtn = getEl("connect");
        connBtn.dom.disabled = false;
        connBtn.show();
        delete connection;
        jive.spank.Spinner.hide();
    },
    packetsReceived: function() {
        if (typeof window.rosterWindow != "undefined") {
            rosterWindow.beginUpdate();
        }
    },
    packetsProcessed: function() {
        if (typeof window.rosterWindow != "undefined") {
            rosterWindow.endUpdate();
        }
    }
}

org.jive.spank.control.ContactMonitor = function() {

}

org.jive.spank.control.ContactMonitor.prototype = {
    handlePresence: function(presencePacket) {
        var presence;
        if (presencePacket.getType() == "subscribe") {
            this.handleSubscription(presencePacket.getFrom());
            return;
        }
        else {
            presence = this.getMode(presencePacket);
        }
        var jid = presencePacket.getFrom().toBareJID();
        var currentStatus = rosterWindow.getContactStatus(jid);
        if (currentStatus && currentStatus == "composing") {
            return;
        }
        rosterWindow.changeContactStatus(jid, presence.mode, presence.status);
    },
    handleState: function(jid, state, isMUC) {
        var session = chatManager.getSession(jid);
        var jidString;
        if (session) {
            jidString = session.getJIDString();
        }
        else if (isMUC) {
            jidString = jid.toString();
        }
        else {
            jidString = jid.toBareJID();
        }
        var contact = getContact(jidString);
        if (!contact || !contact.changeStatus) {
            return;
        }
        if (state == "composing") {
            contact.changeStatus(state);
        }
        else {
            var presence = this.getMode(getContactPresence(jid));
            contact.changeStatus(presence.mode, presence.status);
        }
    },
    handleAddContact: function(window, jid, nick, group) {
        rosterManager.addEntry(new XMPP.JID(jid), nick, new Array(group));
    },
    handleRemoveContact: function(window, jid) {
        rosterManager.removeEntry(new XMPP.JID(jid));
    },
    onAdded: function(rosterItems) {
        for (var i = 0; i < rosterItems.length; i++) {
            var rosterItem = rosterItems[i];
            this.addContact(rosterItem);
        }
    },
    addContact: function(rosterItem) {
        var groups = rosterItem.getGroups();
        var jid = rosterItem.getJID().toString();
        var presencePacket = presenceManager.getPresence(rosterItem.getJID());
        var status;
        if (presencePacket) {
            status = this.getMode(presencePacket).mode;
        }
        else {
            status = "pending"
        }
        var contact = {
            getJID: function () {
                return jid
            },
            getName: function() {
                return (rosterItem.getName()
                        ? rosterItem.getName() : rosterItem.getJID().toString())
            },
            status: status
        };
        rosterWindow.addContact(contact, (groups[0] ? groups[0] : "Unfiled"));
    },
    onUpdated: function(rosterItems) {
        for (var i = 0; i < rosterItems.length; i++) {
            var rosterItem = rosterItems[i];
            rosterWindow.removeContact(rosterItem.getJID().toString());
            this.addContact(rosterItem);
        }
    },
    onRemoved: function(rosterItems) {
        for (var i = 0; i < rosterItems.length; i++) {
            var rosterItem = rosterItems[i];
            rosterWindow.removeContact(rosterItem.getJID().toString());
        }
    },
    getMode: function(presencePacket) {
        var mode;
        var status;
        if (!presencePacket) {
            return {
                mode: "unavailable",
                status: null
            }
        }
        switch (presencePacket.getType()) {
            case "available":
                mode = presencePacket.getMode();
                if (!mode) {
                    mode = "available";
                }
                status = presencePacket.getStatus();
                break;
            default:
                mode = "unavailable";
                break;
        }
        return {
            mode: mode,
            status: status
        };
    },
    handleSubscription: function(from) {
        if (!rosterManager._users[from.toBareJID()]) {
            rosterWindow.showSubscriptionRequest(from.toString(), from.getNode());
        }
        else {
            this.handleAcceptSubscription(null, false, from.toBareJID())
        }
    },
    handleAcceptSubscription: function(dialog, shouldAddToContact, jid, nick, group) {
        var presence = new XMPP.Presence(new XMPP.JID(jid));
        presence.setType("subscribed");
        connection.sendPacket(presence);

        if (shouldAddToContact) {
            this.handleAddContact(dialog, jid, nick, group);
        }
    },
    handleDenySubscription: function(dialog, shouldAddToContact, jid, nick, group) {
        var presence = new XMPP.Presence(new XMPP.JID(jid));
        presence.setType("unsubscribed");
        connection.sendPacket(presence);
    }
}

org.jive.spank.control.MucManager = function(muc) {
    this.muc = muc;
    this.muc.addInvitationsListener(this.handleInvitation.bind(this));
}

org.jive.spank.control.MucManager.prototype = {
    handleInvitation: function(invite) {
        var jid = new XMPP.JID(invite["from"]);
        var session = chatManager.getSession(jid);
        if (!session) {
            session = chatManager.createSession(jid);
        }
        var contact = getContact(session.getJIDString());
        var invitationGUI = new jive.spank.chat.CustomMessage('mucinvitation', {
            contactJID: jid,
            name: contact.name,
            chatname: invite["room"],
            jid: ''
        });
        invitationGUI.addListener('accepted', this.handleInvitationAccept.bind(this));
        invitationGUI.addListener('declined', this.handleInvitationDecline.bind(this));
        addMessage(contact.jid, contact.name, invitationGUI);
    },
    handleInvitationAccept: function(chatWindow, config) {
        joinMUC(chatWindow, config.chatname.toString(), new XMPP.JID(config.chatname.toString()).getNode());
    },
    handleInvitationDecline: function(chatWindow, config) {
        this.muc.declineInvitation(config.contactJID, config.chatname);
    },
    handleNameChange: function(window, roomJID, newName) {
        var room = this.muc.getRoom(new XMPP.JID(roomJID));
        room.changeNickname(newName);
    }
}

var rosterWindow;

function doRoster(roster) {
    rosterWindow = spank.loadComponent("roster");
    rosterWindow.addTab("Contacts");
    rosterWindow.setRoster(roster.getRoster());
    rosterWindow.roster.addListener("contactdblclicked", doOpenContact);
    rosterWindow.setUserInfo(connection.username, 'Available');
    // presenceManager.getCurrentPresence() seems not to work?

    doEmoticons();

    rosterWindow.addControl("addcontact", {
        events: {
            click: function() {
                rosterWindow.showAddContact(rosterWindow);
            }
        },
        imgSrc: 'resources/images/addcontact_16x16.png',
        tooltip: 'Add Contact'
    });

    window.mucControl = rosterWindow.addControl("muc", {
        events: {
            click: handleMUCChooser
        },
        imgSrc: 'resources/images/conference_16x16.png',
        tooltip: 'Conferences'
    });
    window.mucControl.disable();

    rosterWindow.addControl("startchat", {
        events: {
            click: org.jive.spank.control.actions.StartChat
        },
        imgSrc: 'resources/images/chat_16x16.gif',
        tooltip: 'Start Chat'
    });

    rosterWindow.addListener('changestatus', function(window, mode, status) {
        var presence = new XMPP.Presence();
        presence.setMode(mode);
        presence.setStatus(status);
        presenceManager.sendPresence(presence);
        window.changeUserStatus(mode, status);
    });
    rosterWindow.addListener('addcontact', contactMonitor.handleAddContact.bind(contactMonitor));
    rosterWindow.addListener('acceptsubscription', contactMonitor.handleAcceptSubscription.bind(contactMonitor));
    rosterWindow.addListener('denysubscription', contactMonitor.handleDenySubscription.bind(contactMonitor));
    rosterWindow.addListener('removecontact', contactMonitor.handleRemoveContact.bind(contactMonitor));

    rosterWindow.addListener('close', org.jive.spank.control.doLogout);
    rosterWindow.show();
    $("jive-loginBox").style.visibility = "hidden";
    $("jive-webTop").style.display = 'block';
    rosterManager.addRosterListener(contactMonitor);

    jive.spank.Spinner.hide();
}

org.jive.spank.control.actions = {
    StartChat: function() {
        jive.spank.dialog.StartChat(doOpenContact);
    },
    createConferenceWindow: function(chatWindow) {
        var createConference = new jive.spank.dialog.CreateConference(chatWindow);
        createConference.show();
        createConference.focus();

        createConference.addListener("muccreated", org.jive.spank.control.actions.createConference
                .createCallback(createConference));
    },
    createConference: function(createConference) {
        var values = createConference.getValues();
        var configuration = {};
        if (values.isPrivate) {
            configuration["muc#roomconfig_passwordprotectedroom"] = "true";
            configuration["muc#roomconfig_roomsecret"] = values.password;
        }
        configuration["muc#roomconfig_roomname"] = values.name;
        if (values.isPermanent) {
            configuration["muc#roomconfig_persistentroom"] = "true";
        }
        if (values.topic && values.topic != '') {
            configuration["muc#roomconfig_roomdesc"] = values.topic;
        }
        var roomAddress = new XMPP.JID(values.name + "@" + conferenceServers[0].toString());
        var name = values.name;
        var room = muc.createRoom(roomAddress);
        var joinCallback = {
            onSuccess: function() {
                var tab = getChatWindow("chattest").addMUC({
                    jid: roomAddress, name: name
                }, null, rosterWindow);
                // load the occupants
                var occupants = room.getOccupants();
                for (var i = 0; i < occupants.length; i++) {
                    mucOccupantHandler(occupants[i]);
                }
                tab.roster.addListener("contactdblclicked", doOpenContact);
            }
        };
        var nick = connection.username;
        room.create(nick, configuration, joinCallback, mucMessageHandler, mucOccupantHandler);
        createConference.hide();
    }
}

function getChatWindow(id) {
    var chatWindow;
    if (org.jive.spank.control.windows[id]) {
        chatWindow = jive.spank.chat.ChatWindow.getWindow(org.jive.spank.control.windows[id]);
    }

    if (!chatWindow) {
        chatWindow = jive.spank.chat.ChatWindow.createWindow();
        org.jive.spank.control.windows[id] = chatWindow.id;
        initializeChatWindow(chatWindow);
    }
    if (!chatWindow.isVisible()) {
        chatWindow.show();
    }
    return chatWindow;
}

function destroyAllChatWindows() {
    for (var id in org.jive.spank.control.windows) {
        jive.spank.chat.ChatWindow.destroyWindow(org.jive.spank.control.windows[id]);
    }
    delete org.jive.spank.control.windows;
    org.jive.spank.control.windows = {};
    if (typeof inputMonitor != "undefined") {
        inputMonitor.destroy();
        delete inputMonitor;
    }
}

function initializeChatWindow(dialog) {
    dialog.addListener("message", handleMessage);
    dialog.addListener("mucdblclicked", joinMUC);
    dialog.addListener("tabclosed", handleTabClosed);
    dialog.addListener("mucinvitation", handleMUCInvite);
    dialog.addListener("changenameinmuc", mucManager.handleNameChange.bind(mucManager));
    dialog.addListener("createmuc", org.jive.spank.control.actions.createConferenceWindow);

    if (window.inputMonitor) {
        window.inputMonitor.destroy();
    }
    window.inputMonitor = new org.jive.spank.control.InputMonitor();
    inputMonitor.init();
    dialog.addListener("input", inputMonitor.handleUserInput.bind(inputMonitor));
}

function doOpenContact(roster, contact) {
    var jid;
    if (!(contact.jid instanceof XMPP.JID)) {
        jid = new XMPP.JID(contact.jid);
    }
    else {
        jid = contact.jid;
    }
    var session = chatManager.getSession(jid);
    if (!session) {
        session = chatManager.createSession(jid);
    }
    contact.jid = session.getJIDString();
    var dialog = getChatWindow("chattest");
    dialog.getContactTab(contact, true);
}

function chatSessionCreated(manager, session) {
    console.debug("Chat session created.");
    session.addListener(chatListener);

    var contactObj = getContact(session.getJIDString());

    var dialog = getChatWindow("chattest");
    dialog.getContactTab(contactObj);
    org.jive.spank.x.chatstate.getManager(chatManager).setCurrentState("active", session.getJID());
}

function getContact(jid) {
    var bare = new XMPP.JID(jid).getBareJID();
    var contactObj;
    if (muc.getRoom(bare)) {
        var roster = getChatWindow("chattest").tabs[bare].roster;
        contactObj = roster.findContact(jid);
    }
    else {
        contactObj = jive.spank.roster.Contact.find(rosterWindow.roster, jid);
    }
    if (!contactObj) {
        jid = new XMPP.JID(jid);
        contactObj = {
            jid: jid.toString(),
            name: jid.getNode(),
            status: "unavailable"
        }
    }
    return contactObj;
}

function getContactPresence(jid) {
    var room = muc.getRoom(jid.getBareJID());
    var presence;
    if (room) {
        presence = room.presenceManager;
    }
    else {
        presence = presenceManager;
    }
    return presence.getPresence(jid);
}

function handleMessage(jid, messageBody) {
    jid = new XMPP.JID(jid);
    var type = getChatWindow("chattest").tabs[jid.toString()].type;
    var username;
    if (type == "chat") {
        var session = chatManager.getSession(jid);
        if (!session) {
            session = chatManager.createSession(jid);
        }
        var message = org.jive.spank.x.chatstate.getManager(chatManager)
                .setCurrentState("active", session.getJID());
        session.sendMessage(messageBody, message);
        username = connection.username;
    }
    else if (type == "muc-room") {
        var room = muc.getRoom(jid);
        var message = org.jive.spank.x.chatstate.getManager(chatManager)
                .setCurrentState("active", jid);
        room.sendMessage(messageBody, message);
        username = room.nickname;
    }
    addMessage(jid, username, messageBody, true);
}

org.jive.spank.control.InputMonitor = function() {
    this.composingTimeout = 3000;
    this.inputState = {};
}

org.jive.spank.control.InputMonitor.prototype = {
    init: function() {
        this.inputMonitor = new PeriodicalExecuter(this.monitorFunction.bind(this), 2);
    },
    monitorFunction: function() {
        var time = new Date().getTime();
        for (var inputJID in this.inputState) {
            var input = this.inputState[inputJID];
            if (input.state == "composing" && (time - input.lastInput) >= this.composingTimeout) {
                delete this.inputState[inputJID];
                this.updateState(inputJID, "active");
            }
        }
    },
    handleUserInput: function(jid) {
        if (this.inputState[jid] && this.inputState[jid].state == "composing") {
            this.inputState[jid].lastInput = new Date().getTime();
            return;
        }
        if (!this.inputState[jid]) {
            this.inputState[jid] = {};
        }

        this.inputState[jid].state = "composing";
        this.inputState[jid].lastInput = new Date().getTime();
        this.updateState(jid, "composing");

    },
    updateState: function(jid, newState) {
        console.debug("%s sent to %s", newState, jid);
        jid = new XMPP.JID(jid);
        var session = chatManager.getSession(jid);
        var room;
        if (session) {
            jid = session.getJID();
        }
        else {
            room = muc.getRoom(jid);
        }
        var message = org.jive.spank.x.chatstate.getManager(chatManager)
                .setCurrentState(newState, jid, null, room != null);
        if (message) {
            connection.sendPacket(message);
        }
    },
    destroy: function() {
        this.inputMonitor.stop();
        this.inputState = {};
    }
}
function addMessage(jid, name, msg, isLocal, time) {
    getChatWindow("chattest").getContactTab({jid: jid, name: name});
    var msgObj = msg;
    if (typeof msg == 'string') {
        msgObj = {body: msg, isLocal: isLocal, time: time};
    }
    getChatWindow("chattest").addMessage(jid, name, msgObj);
}

function handleMUCChooser() {
    var mucManager = muc;
    getChatWindow("chattest").preAddMUCChooser();
    mucManager.retrieveRooms(conferenceServers[0], function(roomList) {
        mucManager.retrieveRoomsInfo(roomList, roomInfo);
    });
}

function roomInfo(roomList) {
    getChatWindow("chattest").addChooseMUCTab(roomList);
}

function joinMUC(chatWindow, address, name, tabChooserId, password, shouldNotAddMUCSpinner) {
    var roomAddress = new XMPP.JID(address);
    if (muc.getRoom(roomAddress) && muc.getRoom(roomAddress).isJoined) {
        getChatWindow("chattest").getTabByJID(address).activate();
        return;
    }
    if (!shouldNotAddMUCSpinner) {
        chatWindow.preAddMUC({name: name, jid: address}, tabChooserId);
    }
    var room = muc.createRoom(roomAddress);
    if (!name) {
        name = roomAddress.getNode();
    }
    var joinCallback = {
        onSuccess: function() {
            var tab = getChatWindow("chattest").addMUC({
                jid: address, name: name
            }, tabChooserId, rosterWindow);
            // load the occupants
            var occupants = room.getOccupants();
            for (var i = 0; i < occupants.length; i++) {
                mucOccupantHandler(occupants[i]);
            }
            tab.roster.addListener("contactdblclicked", doOpenContact);
        },
        onError: function(packet) {
            if (packet.getError() == '401') {
                getChatWindow("chattest").showMUCPassword({jid: address, name: name},
                        null, function(password) {
                    if (!password) {
                        getChatWindow("chattest").removeMUCSpinner(address);
                    }
                    else {
                        joinMUC(chatWindow, address, name, tabChooserId, password, true);
                    }
                });
                return;
            }
            chatWindow.removeMUCSpinner(address);
        }
    }
    var nick = connection.username;
    room.join(nick, password, joinCallback, mucMessageHandler, mucOccupantHandler);
}

var mucMessageHandler = {
    messageReceived: function(message) {
        var from = message.getFrom();
        var room = from.toBareJID();
        var nick = from.getResource();

        var body = message.getBody();
        var isLocal = connection.username == nick;
        var time = message.getExtension("x", "jabber:x:delay");
        if ((time || !isLocal) && body) {
            if (time) {
                time = new XMPP.DelayInformation(time).getDate()
                        .toLocaleTimeString();
            }
            if (nick) {
                addMessage(room, nick, body.body, isLocal, time);
            }
            else {
                getChatWindow("chattest").addStatusMessage(room, body.body);
            }
        }
    },
    invitationDeclined: function(decline) {
        var jid = decline.from;
        var contact = getContact(jid);
        var name = jid;
        if (contact) {
            name = contact.name;
        }
        getChatWindow("chattest").addStatusMessage(decline.room.toString(),
                name + " has declined the invitation to join the room.")
    },
    subjectUpdated: function(room, updater, newSubject) {
        getChatWindow("chattest").setSubject(newSubject, room.jid.toString());
    }
}

function mucOccupantHandler(occupant) {
    var room = occupant.getRoom();
    var mucRoom = muc.getRoom(new XMPP.JID(room));
    if (!mucRoom || !mucRoom.isJoined) {
        return;
    }
    var jid = occupant.presence.getFrom();
    var tab = getChatWindow("chattest").tabs[room];
    if (!tab) {
        return;
    }
    var participants = tab.participants;
    if (!participants) {
        return;
    }

    var contact = participants.getContactByJID(jid.toString());
    var mode;
    var status;
    switch (occupant.presence.getType()) {
        case "available":
            mode = occupant.presence.getMode();
            if (!mode) {
                mode = "available";
            }
            status = occupant.presence.getStatus();
            break;
        default:
            mode = "unavailable";
            break;
    }
    if (!contact && mode != "unavailable") {
        contact = participants.addContact({
            jid: jid,
            getJID: function() {
                return this.jid.toString()
            },
            status: mode,
            getName: function() {
                return occupant.getNick()
            }
        });
        getChatWindow("chattest").addStatusMessage(room,
                occupant.getNick() + " has joined the room.");
    }
    else if (contact && mode == "unavailable") {
        contact.changeStatus(mode);
        participants.removeContact(jid.toString());
        getChatWindow("chattest").addStatusMessage(room,
                occupant.getNick() + " has left the room.");
    }
    else if (contact) {
        contact.changeStatus(mode);
    }
}

function handleTabClosed(roomObj, tab) {
    switch (tab.type) {
        case "muc-room":
            muc.getRoom(roomObj.jid).leave();
            break;
        case "chat":
            var session = chatManager.getSession(new XMPP.JID(roomObj.jid.toString()));
            if (session) {
                chatManager.closeChatSession(session);
            }
            break;
    }
}

function handleMUCInvite(chatWindow, inviteeJID, roomJID) {
    muc.getRoom(roomJID).invite(new XMPP.JID(inviteeJID));
    var contact = getContact(inviteeJID);

    var message = contact.name + " has been invited to join the room.";
    chatWindow.addStatusMessage(roomJID, message);
}

function chatSessionClosed(manager, session) {
    console.debug("Chat session closed.");
}

var chatListener = {
    messageRecieved: function(session, message) {
        if (!message.getBody() || message.getBody().body == "") {
            return;
        }
        var name = getChatWindow("chattest").tabs[session.getJIDString()].contact.name;
        addMessage(session.getJIDString(), name, message.getBody().body);
    }
}

function doEmoticons() {
    var smilies = [
            ['angry',         /&gt;:o|&gt;:-o|&gt;:O|&gt;:-O/g ],
            ['confused',     /\?:\|/g ],
            ['cool',         /B-\)|8-\)/g ],
            ['cry',         /:\'\(/g ],
            ['devil',         /\]:\)/g ],
            ['grin',         /:-D|:D/g ],
            ['happy',         /:-\)|:\)/g ],
            ['laugh',         /:\^0/g ],
            ['love',         /:x/g ],
            ['mischief',     /;\\/g ],
            ['sad',         /:-\(|:\(/g ],
            ['silly',         /:-p|:-P|:P|:p/g ],
            ['wink',         /;-\)|;\)/g ]
            ];
    smilies.each(function(smileyArr) {
        jive.spank.chat.Filter.add(smileyArr[0], smileyArr[1],
                '<img src="resources/images/emoticons/' + smileyArr[0] + '.gif" alt="" />'
                );
    });
    jive.spank.chat.Filter.add('uri', /\b(\w+?:\/\/[^\s+\"\<\>]+)/ig,
            '<a href="$1" target="_blank">$1</a>');
    jive.spank.chat.Filter.add('webaddress', /(\s|^)(www\.[^\s+\"\<\>]+)/ig,
            '<a href="http://$2" target="_blank">$2</a>');
}

