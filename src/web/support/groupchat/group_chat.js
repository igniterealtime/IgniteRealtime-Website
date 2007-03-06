//console.error = function(string) { var errorString = ""; for(var i = 0; i < arguments.length; i++) { errorString += arguments[i] + " "; } alert(errorString); };
//console.info = console.error;
//console.debug = console.error;
//console.warn = console.error;

jive_groupchat_config_defaults = {
	width: 750,
	height: 450,
    x: 0,
    y: 0,
    fitToParent: "true",
    constrained: "false",
    draggable: "false",
    resizable: "true",
    closable: "true",
    bottomPane: "false",
    mucServer: "conference.localhost",
    server: "localhost",
    connectionAddress: "localhost:7080",
    roomName: "test"
}

function jive_configureGroupChat()
{
    if(!window.jive_groupchat_config)
        window.jive_groupchat_config = {};
    for (var key in jive_groupchat_config_defaults) {
	   if(!jive_groupchat_config[key]) {
	       jive_groupchat_config[key] = jive_groupchat_config_defaults[key];    
	   }   
    }
    if(jive_groupchat_config["fitToParent"]) {
    	jive_groupchat_config["width"] = null;
    	jive_groupchat_config["height"] = null;
    }
}

jive_configureGroupChat();

MessageHandler = {    
    subjectUpdated: function(room, updater, newSubject) {
        window.controller.chatWindow.setSubject(newSubject, room.jid.toString());
    },
    
    messageReceived: function(message) {
        var from = message.getFrom();
        var room = from.toBareJID();
        var nick = from.getResource();

        var bodyEl = message.getBody();
        var local = window.controller.nickname.toLowerCase() == nick;  //why is it lowercase? O_o
        bodyEl.mentioned = (bodyEl.body.indexOf(window.controller.nickname.toLowerCase()) > -1) ? "mentioned" : null;
        var t = message.getExtension("x", "jabber:x:delay");
        if ((t || !local) && bodyEl) {
            if (t) {
                t = new XMPP.DelayInformation(t).getDate()
                        .toLocaleTimeString();
            }
            window.controller.chatWindow.addMessage(room, nick, bodyEl, local, t);
        }
    }
}

controller = {
    chatWindow: null,
    conf: null,
    connection: null,
    connectionSuccessful : function(conn)
    {
        this.connection = conn;
        conn.login();
        window.onbeforeunload = conn.disconnect;
    },
    
    connectionFailed: function(connection, error) { alert("Error: " + error); },
    
    authenticationSuccessful: function(conn) {
        this.chatWindow = new jive.spank.chat.ChatWindow('groupchat', window.jive_groupchat_config);
        if(window.jive_groupchat_config["fitToParent"] == "true") {
    		window.resizeHandler();
    	}
        this.chatManager = new org.jive.spank.chat.Manager(conn, window.jive_groupchat_config["server"], false);
        this.mucManager = new org.jive.spank.muc.Manager(conn, this.chatManager);
        this.joinChat();
    },
    
    joinChat: function() {
        this.conf = this.mucManager.createRoom(new XMPP.JID(window.jive_groupchat_config["roomName"] + "@" + window.jive_groupchat_config["mucServer"]));
        this.nickname = "User" + Math.floor(Math.random()*500);
        this.conf.join(this.nickname, "", this, MessageHandler, this.occupantListener);
    },
    
    authenticationFailed: function(connection, error) { alert("Authentication failed: " + error); },
    connectionClosed: function(connection, error)     { },
    
    occupantListener : function(occupant) {
        var room = occupant.getRoom();
        var mucRoom = window.controller.mucManager.getRoom(new XMPP.JID(room));
        if (!mucRoom || !mucRoom.isJoined) {
            return;
        }
        var jid = occupant.presence.getFrom();
        var tab = window.controller.chatWindow.tabs[room];
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
            window.controller.chatWindow.addStatusMessage(room,
                    occupant.getNick() + " has joined the room.");
        }
        else if (contact && mode == "unavailable") {
            contact.changeStatus(mode);
            participants.removeContact(jid.toString());
            window.controller.chatWindow.addStatusMessage(room,
                        occupant.getNick() + " has left the room.");
        }
        else if (contact) {
            contact.changeStatus(mode);
        }
    },

    sendMessage : function(tabjid, value)
    {
        this.completionState = {index : 0, completed : null, original : null};
        
        var jid = new XMPP.JID(this.nickname);
        this.conf.sendMessage(value, org.jive.spank.x.chatstate.getManager(this.chatManager).setCurrentState("active", jid));
        this.chatWindow.addMessage(window.controller.conf.jid, this.nickname, {body:value, isLocal:true}, true);
    },
    
    completionState : {
        index : 0,
        completed : null,
        original : null
    },
      
    completeNick : function (jid, messageBody, textArea) {
        jid = new XMPP.JID(jid);
        var room = this.mucManager.getRoom(jid);
        var occupants = room.getOccupants();
        var nick;
        var state = this.completionState;
        var loopCounter = 0; //we're treating the contact list as a circular buffer, so we want to break out of the loop as soon as we've been through the whole thing with no hits
        if(state.original == null || state.completed != messageBody)
            state.original = messageBody;
        for(var i = state.index; i < occupants.length && loopCounter < occupants.length; i++)
        {
            loopCounter++;
            state.index = i + 1;
            nick = occupants[i].getNick();
            if(state.index >= occupants.length) {
                state.index = 0;
                i = 0;
            }
            if(nick.indexOf(state.original) == 0 && state.original.length < nick.length)
            {
                state.completed = nick + ":";
                textArea.dom.value = state.completed;
                textArea.dom.selectionStart = state.original.length;
                textArea.dom.selectionEnd = textArea.dom.value.length;
                return;
            }
        }
    },
    
    handleNameChange: function(window, roomJID, newName) {
        this.nickname = newName;
        this.conf.changeNickname(newName);
    },
        
    onSuccess : function(occupant) {
		var chatWindow = window.controller.chatWindow;
		var room = window.controller.conf;
        chatWindow.addMUC({name: room.nickname, jid: room.jid});
        var occupants = room.getOccupants();
		for (var i = 0; i < occupants.length; i++) {
			window.controller.occupantListener(occupants[i]);
		}
        chatWindow.prepUserPane();
        chatWindow.show();
        chatWindow.finalizeUserPane(this.nickname);
        chatWindow.setSubject('');
        // fix a dialog drawing bug
        getEl(chatWindow.tabId + '-layout').dom.parentNode.style.position = 'absolute';
        chatWindow.addListener('message', this.sendMessage.bind(this));
        chatWindow.addListener('nickcomplete', this.completeNick.bind(this));
        chatWindow.addListener("changenameinmuc", this.handleNameChange.bind(this));
        chatWindow.dialog.addListener("beforeshow", this.joinChat, window.controller, true);
        chatWindow.dialog.addListener("beforehide", this.conf.leave.bind(this.conf));
    }
};

var resizeHandler = function() {
	var dlog = window.controller.chatWindow.dialog;
	dlog.beginUpdate();
	dlog.getEl().fitToParent();
	dlog.resizeTo(dlog.getEl().getWidth(), dlog.getEl().getHeight()); //force the contents to update
	var xy = YAHOO.util.Dom.getXY(dlog.getEl().dom.parentNode);
	dlog.moveTo(xy[0], xy[1]);
	dlog.endUpdate();
}

var toggleTheme = function() {
    getEl(document.body, true).toggleClass('jivetheme-muc');
};

YAHOO.ext.EventManager.onDocumentReady(function(){
    window.connection = new XMPPConnection("/http-bind/", window.jive_groupchat_config["connectionAddress"], controller);
    connection.connect(); toggleTheme();
});

if(window.jive_groupchat_config["fitToParent"] == "true") {
	YAHOO.ext.EventManager.onWindowResize(resizeHandler, window, false);
}
