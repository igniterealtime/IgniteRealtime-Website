var dialog;
var rosterWindow;
		
function doOpenContact(roster, contact) {
	dialog = getChatWindow("chattest");
	dialog.getContactTab(contact, true);
}

function getChatWindow() {
	var chatWindow = jive.spank.chat.ChatWindow.getWindow("chattest");
	if(!chatWindow) {
		chatWindow = jive.spank.chat.ChatWindow.createWindow("chattest");
	}
	if(!chatWindow.isVisible()) {
		chatWindow.removeAllTabs();
		chatWindow.show();
	}
	return chatWindow;
}

var showDialog = function() {
	rosterWindow = spank.loadComponent("rostertest");
	rosterWindow.addTab("Contacts");
	rosterWindow.setRoster();
	rosterWindow.roster.addListener("contactdblclicked", doOpenContact);
	rosterWindow.show();
	rosterWindow.setUserInfo({name: 'testuser', status: 'available'});
}

function slowTestMessage()
{
	var throwout = window.setTimeout(testMessage, 3000);
}

function testMessage() {
	var contact = rosterWindow.groups['IM Team'].contacts[0];
	if (dialog) {
		dialog.getContactTab(contact, false);
	}
	else {
		doOpenContact(rosterWindow, contact);
	}
	dialog.addMessage(contact.jid, contact.name, "test1", false);
}

function testChooseMUC() {
	if (dialog) {
		dialog.addChooseMUCTab({
			'RadWombat': {address: 'radwombtech', occupants: 0},
			'HiddenCombat': {address: 'hc', occupants: 7},
			'dev': {address: 'devchat', occupants: 132}
		});
		dialog.addListener("mucdblclicked", testAddMuc);
	}
}

// just for testing:
function testAddMuc(chatwindow, address, name, chooserTabId) {
	//console.log("%o",arguments);
	chatwindow.addMUC({
		jid: address + 'MUCfake@conference.jivesoftware.com', name: address,
		occupants: {
			"Moe":{status:'available'},
			"Larry":{status:'available'},
			"Curly":{status:'available'}
		}
	}, chooserTabId);
}

function testAddControl() {
	if (rosterWindow) {
		/* if(rosterWindow.controls['TestImg']) {
			rosterWindow.removeControl("TestImg");
		}
		else {
			rosterWindow.addControl("TestImg", {elmId: 'hideyguy', events:{click:function(){alert('testimg clicked');}}});
		} */
		
		if(rosterWindow.controls['TestBasic']) {
			rosterWindow.removeControl("TestBasic");
		}
		else {
			rosterWindow.addControl("TestBasic", function(){alert('look, a control');});
		}
		
		if(rosterWindow.controls['TestClass']) {
			rosterWindow.removeControl("TestClass");
		}
		else {
			rosterWindow.addControl("TestClass", {
				className: 'TestClass',
				events: {
					click: function(ctrl,evt){alert('test w class: ' + evt.getTarget().className);}
				}
			});
		}
	}
}

function testChangeStatus () {
	if (rosterWindow)
	{
		if (rosterWindow.groups['IM Team'].contacts.find(function(guy){return guy.status != 'unavailable';})) {
			rosterWindow.groups['IM Team'].contacts.each(function(guy){
				rosterWindow.changeContactStatus(guy.jid, 'unavailable', '');
			});
		}
		else {
			var randSrc = ['available','away','dnd', 'unavailable'];
			//console.debug(randStat);
			rosterWindow.groups['IM Team'].contacts.each(function(guy){
				randStr = randSrc[Math.floor(Math.random()*4)];
				rosterWindow.changeContactStatus(guy.jid, randStr, (randStr == 'away' ? 'Away due to Idle' : ''));
			});
		}
	}
}
