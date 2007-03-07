jive = {};
jive.spank = {};
jive.spank.chat = {};

jive.spank.Window = function(id, title, dialogConfObj) {
	this.bodyId = YAHOO.util.Dom.generateId();
	jive.spank.chat.Template.dialog.append(id, { windowTitle: title, bodyId: this.bodyId });
	this.dialog = new YAHOO.ext.LayoutDialog(id, dialogConfObj);
	this.dialog.addKeyListener(27, this.dialog.hide, this.dialog);
	
	this.tabs = {};
	this.id = id;
};

YAHOO.extend(jive.spank.Window, YAHOO.ext.util.Observable, {
	isUpdating: false,
	beginUpdate: function() {
		if(!this.isUpdating) {
			this.isUpdating = true;
			this.dialog.beginUpdate();
		}
	},
	endUpdate: function() {
		if(this.isUpdating) {
			this.isUpdating = false;
			this.dialog.endUpdate();
		}
	},
	show: function() {
		this.dialog.show();
	},
	hide: function() {
		this.dialog.hide();
	},
	isVisible: function() {
		return this.dialog.isVisible();
	},
	destroy: function() {
		this.hide();
		this.dialog.destroy(true);
		delete this.dialog;
	}
});

jive.spank.chat.ChatWindow = function(id, attributes) {
	var width = attributes["width"] ? attributes["width"] : 520;
	var height = attributes["height"] ? attributes["height"] : 450;
	var x = attributes["x"] ? attributes["x"] : (YAHOO.util.Dom.getViewportWidth() / 2) - 260;
	var y = attributes["y"] ? attributes["y"] : (YAHOO.util.Dom.getViewportHeight() / 2) - 225;
	var blinkTab = attributes["blinktab"] == "true" ? true : false;
	if(blinkTab) {
		this.notificationInterval = {};
	}
	var confObject = { 
		modal: false,
		constraintoviewport: false,
		width: width,
		height: height,
		shadow: false,
		resizable: false,
		draggable: false,
		minWidth: 300,
		minHeight: 300,
		x: x,
		y: y,
		closable: false,
		south: {
			autoScroll: false,
			initialSize: 30
		},
		center: {
			autoScroll: false,
			autoTabs: false
		}
	};
	jive.spank.chat.ChatWindow.superclass.constructor.call(this, id, "Chat", confObject);
	this.events = {
		"input": true,
		"message": true,
		/**
		 * @event mucdblclicked
		 * Fires when the user double-clicks a MUC row in a MUC chooser. 
		 * @param {jive.spank.chat.ChatWindow} chatwindow the window asking for the MUC
		 * @param {String} address the MUC's name, for composition with a server to form a JID.
		 * @param {String} choosertabId DOM ID of the MUC chooser tab, for optional passing to addMUC for destruction
		 */
		"mucdblclicked": true,
		"tabclosed": true,
		/**
		 * @event mucinvitation
		 * Fires when the user invites a contact to a MUC. 
		 * @param {jive.spank.chat.ChatWindow} chatwindow ref to the muc's chat window
		 * @param {String} userjid JID for the invited user
		 * @param {String} roomjid the MUC's JID
		 */
		"mucinvitation": true,
		/**
		 * @event changenameinmuc
		 * Fires when the user submits a nickname change
		 * @param {jive.spank.chat.ChatWindow} chatwindow ref to the muc's chat window
		 * @param {String} roomjid JID for the MUC in question
		 * @param {String} newnick the nick to change to
		 */
		"changenameinmuc": true
	};
	
	this.newMessages = {};
	this._wrappedFns = {};
	this.tabs = {};
	this.tabId = '';
};
YAHOO.extend(jive.spank.chat.ChatWindow, jive.spank.Window, {
	
	prepUserPane: function() {
		var layout = this.dialog.getLayout();
		jive.spank.chat.Template.userpane.append(this.bodyId + '-toppane', {id: this.bodyId});
		this.dialog.beginUpdate();
		layout.add('south', new YAHOO.ext.ContentPanel(this.bodyId + '-toppane'));
		this.dialog.endUpdate();
	},
	
	preAddMUC: function(roomObj, choosertabId) {
		var tabId = "jive-tab-" + roomObj.jid;
		if (this.dialog.layout.regions['center'].panels.items['jive-tab-' + roomObj.jid + '-spinner']) {
			delete this.dialog.layout.regions['center'].panels.items['jive-tab-' + roomObj.jid + '-spinner'];
		}
		jive.spank.chat.Template.spinnertab.append(this.bodyId, 
				{tabId: tabId, text: 'Joining "' + roomObj.name + '"...'});
		if (choosertabId) {
			this.getTabs().removeTab(choosertabId); // maybe best left to external method?
		}
		
		var layout = this.dialog.getLayout();
		this.dialog.beginUpdate();
		layout.add('center', new YAHOO.ext.ContentPanel(tabId + '-spinner',
			{title: roomObj.name}));
		this.dialog.endUpdate();
		
		var thetab = this.getTabs().items['jive-tab-' + roomObj.jid + '-spinner'];
		thetab.textEl.addClass('jive-muc');
		
		var self = this;
		thetab.addListener("close", function() {
			delete self.dialog.layout.regions['center'].panels.items['jive-tab-' + roomObj.jid + '-spinner'];
		});
		
		this.tabs[roomObj.jid] = {
			type: "muc-spinner",
			tab: thetab
		};
	},
	
	/**
	 * Adds a tab for a multi-user chat room.
	 *
	 * @param {Object} roomObj JSON with keys 'jid', 'name', and 'occupants' (the 
	 * latter being just like the JSON for a roster group)
	 * @param {String} choosertabId optional DOM ID for a muc-chooser tab to kill
	 * @param {RosterWindow} rosterWindow optional to show a list of possible invitees to the
	 * conference room.
	 */
	addMUC: function(roomObj, choosertabId, rosterWindow) {
		var tabId = "jive-tab-" + roomObj.jid;
		this.dialog.beginUpdate();
		if (this.tabs[roomObj.jid] && this.tabs[roomObj.jid].type == 'muc-spinner') {
			var tabid = this.tabs[roomObj.jid].tab.id
			this.getTabs().removeTab(this.tabs[roomObj.jid].tab.id);
		}
		
		jive.spank.chat.Template.muctab.append(this.bodyId, {tabId: tabId});
		var layout = this.dialog.getLayout();
		
		var mucLayout = new YAHOO.ext.BorderLayout(tabId + "-layout", 
			jive.spank.chat.ChatWindow.mucConfObject);
		
		mucLayout.add('north', new YAHOO.ext.ContentPanel(tabId + '-controls'));
		mucLayout.add('center', new YAHOO.ext.ContentPanel(tabId + '-history'));
		mucLayout.add('east', new YAHOO.ext.ContentPanel(tabId + '-occupants'));
		
		// south panel and textarea sizing
		mucLayout = this._layoutTextarea(mucLayout, tabId, roomObj.jid.toString());
		
		layout.add('center', new YAHOO.ext.NestedLayoutPanel(mucLayout,
			{title: roomObj.name, closable: true}));
		
		var self = this;
		this.dialog.addListener("hide", function() {
			YAHOO.ext.EventManager.removeListener("blur", textArea, self._wrappedFns[tabId].pop());
			YAHOO.ext.EventManager.removeListener("focus", textArea, self._wrappedFns[tabId].pop());
			YAHOO.ext.EventManager.removeListener("keypress", textArea, self._wrappedFns[tabId].pop());
			
			var roomEl = getEl(roomObj.jid + '-');
			if(roomEl) {
				roomEl.remove();
			}
			
			delete self._wrappedFns[tabId];
			delete self.tabs[roomObj.jid];
		});
		var clearNotifyListener = function() {self.clearNotification(roomObj.jid);};
		getEl(getEl(tabId + '-history').dom.parentNode.id).addListener("click", clearNotifyListener);
		
		// fill in room participants
		jive.spank.chat.Template.roster.append(tabId + '-occupants', {
			rosterId: tabId + '-roster', 
			groups: ''
		});
		this.roster = new jive.spank.roster.Roster(tabId + '-roster');
		
		var participants = {"Participants": (roomObj.occupants ? roomObj.occupants : {})};
		this.roster.setRoster(participants);
		this.roster.render();
		this.roster.sortGroups();
		this.roster._enableBehaviors(false); // false = no group hiding
		getEl(tabId + "-text").dom.focus();
		
		jive.spank.chat.Template.muc_controls.append(tabId + '-controls', {tabId: tabId});
		
		this.dialog.endUpdate();
		
		this.tabId = tabId;
		this.tabs[tabId] = {room: roomObj};
		if (this.dialog.layout.regions['south']) { // user panel
			this.finalizeUserPane('FIXME');
		}
	},
	
	finalizeUserPane: function(uname) {
		var tpl = jive.spank.chat.Template;
		tpl.userpane_loggedin.append(this.bodyId + '-message', {id: this.bodyId, uname: uname});
		tpl.userpane_changebtn.append(this.bodyId + '-toppane', {id: this.bodyId});
		
		// add changenick behavior
		var self = this;
		getEl(this.bodyId + '-changenickbtn').addListener('click', function() {
			self.showChangeNick(self.tabs[self.tabId].room);
		});
	},
	
	setSubject: function(subj) {
		getEl(this.tabId + '-subject').dom.innerHTML = subj;
	},
	
	_layoutTextarea: function(innerLayout, tabId, tabJID) {
		innerLayout.add('south', new YAHOO.ext.ContentPanel(tabId + '-text'));
		var textArea = getEl(tabId + "-text");
		var resizeHandler = function() {
			textArea.fitToParent();
		}
		innerLayout.delayedListener("regionresized", resizeHandler, 100);
		this.dialog.addListener("resize", resizeHandler);
		// and to start off on the right foot:
		resizeHandler();
		
		// adding a message handler to textarea
		var self = this;
		this._wrappedFns[tabId] = [];
		this._wrappedFns[tabId].push(textArea.mon('keypress', function(evt){
			if (evt.getKey() == 13 && !evt.shiftKey) {
				self.fireEvent("message", tabJID, self.getMessage());
				window.setTimeout(function() {textArea.dom.value = "";}, 10);
			}
			else {
				self.fireEvent("input", tabJID);
			}
		}));
		this._wrappedFns[tabId].push(textArea.mon('focus', function(){
			self.clearNotification(tabJID);
		}));
		return innerLayout;
	},
	
	_doMucControls: function(tabId, roomObj, rosterWindow) {
		jive.spank.chat.Template.muc_controls.append(tabId + '-controls',
			{jid: roomObj.jid});
		jive.spank.chat.Template.mucinvitemenu.append(document.body,
			{jid: roomObj.jid});
		var elm = getEl(roomObj.jid + '-container');
		elm.hide();
		
		var mucAutoComp = new jive.spank.AutoComplete(roomObj.jid + '-autocomp', 
			roomObj.jid + '-autocomp-menu', 
			new YAHOO.widget.DS_JSFunction(rosterWindow.contactsForAutocomp.bind(rosterWindow)),
			{typeAhead: true, autoHighlight: true, minQueryLength: 0, maxResultsDisplayed: 20}
		);
		mucAutoComp.formatResult = function(oResultItem, sQuery) {
			return "<div class='roster-contact-" + oResultItem[2] + "'>" + oResultItem[0] + "</div>";
		};
		
		var jid = roomObj.jid;
		var self = this;
		mucAutoComp.dataReturnEvent.subscribe(function(type, args) {
			if(args[2][0][0] != args[1]) { // first autocomp result != the query
				self.invitee = args[1]; // the query
			}
			else {
				self.invitee = args[2][0][1]; // that's roster results, first one, JID
			}
		});
		mucAutoComp.itemSelectEvent.subscribe(function(type,args){
			self.fireEvent('mucinvitation', self, args[2][1].jid, jid);
		});
		
		getEl(jid + '-control').mon('click', function(){
			self.invitee = '';
			var entry = elm.getChildrenByTagName('input')[0];
			entry.setWidth(elm.getWidth() - 2);
			entry.dom.value = '';
			elm.alignTo(this, 'bl');
			elm.show();
			elm.setStyle('z-index',self.dialog.lastZIndex + 1);
			entry.dom.focus();
			mucAutoComp._populateList('', rosterWindow.contactsForAutocomp(), mucAutoComp);
			elm.repaint();
		});
		// realign menu when window moves? when pane resizes?
		
		getEl(jid + '-autocomp').mon('keypress',function(evt) {
			if (evt.getKey() == 13) {
				evt.stopEvent();
				self.fireEvent('mucinvitation', self, self.invitee, jid);
				
				getEl(jid + '-container').hide();
				getEl('jive-tab-' + self.getActiveTabJID() + '-text').dom.focus();
			}
		});
		getEl(jid + '-autocomp').mon('blur',function() {
			getEl(jid + '-container').hide();
			getEl('jive-tab-' + self.getActiveTabJID() + '-text').dom.focus();
		});
		
		// aaaaand briefly by comparison, the change-nick button
		getEl(jid + '-changenick').addListener('click',function(){
			self.showChangeNick(roomObj, {
				x: self.dialog.el.getX() + 125,
				y: self.dialog.el.getY() + 140
			});
		});
	},
	
	showChangeNick: function(roomObj, confObj) {
		var self = this;
		confObj = $H(confObj).merge({
			title: "Changing your nickname in " + roomObj.name,
			width: 285, height: 105, constrained: false,
			templateKeys: {nick: ''}
		});
		var renamer = new jive.spank.chat.Dialog(self,
			jive.spank.chat.Template.rename,
			confObj
		);
		renamer.dialog.show();
		
		var self = this;
		var doChange = function() {
			self.fireEvent("changenameinmuc", self, roomObj.jid, $F(renamer.id + '-name'));
			renamer.dialog.hide();
		};
		getEl(renamer.id + '-name').mon("keypress", 
			doChange.createInterceptor(function(evt){return evt.getKey() == 13;}));
		getEl(renamer.id + '-rename').addListener("click", doChange);
	},
	
	/**
	 * Final bit of the message chain: adds HTML, sorts out time, and scrolls it
	 * into view.
	 * 
	 * @param {String} jid valid jid that links the message to tab in this window.
	 * @param {String} from contact name to display.
	 * @param {Object/HTMLElement} msgObj a conf obj with body, isLocal (bool) and time, or a prepared DOM element
	 * @param {Function} callback optional func to call once we've drawn the DOM element
	 */
	 addMessage: function(jid, from, msgObj, callback) { 
		var msgframe = getEl("jive-tab-" + jid + "-history");
		var oScroll = msgframe.dom.parentNode.scrollTop;
		
		if (msgObj.body) {
			var timecls = '';
			if (msgObj.time) {
				timecls = 'offline';
			}
			else {
				var dateobj = new Date();
				msgObj.time = dateobj.toLocaleTimeString();
			}
			var type = (msgObj.isLocal ? "user" : "contact");
			var newElm = jive.spank.chat.Template.message.append(msgframe.id, 
				{from: from, message: msgObj.body, type: type, time: msgObj.time, timeclass: timecls});
		}
		else {
			msgframe.dom.appendChild(msgObj.el);
			msgObj.callback(this);
		}
		
		var newScroll = msgframe.getHeight() - msgframe.dom.parentNode.clientHeight;
		msgframe.dom.parentNode.scrollTop = newScroll;
		
		var testjid = jive.spank.chat.ChatWindow.focusedJID;
		if (testjid != jid) {
			this.addNotification(jid);
		}
	},
	addStatusMessage: function(jid, message) {
		var msgframe = getEl("jive-tab-" + jid + "-history");
		var oScroll = msgframe.dom.parentNode.scrollTop;
		
		var newElm = jive.spank.chat.Template.statusMessage.append(msgframe.id, {message: message});
		
		var newScroll = msgframe.getHeight() - msgframe.dom.parentNode.clientHeight;
		msgframe.dom.parentNode.scrollTop = newScroll;
	},
	
	/**
	 * Notifies the user that the tab needs their attention.
	 */
	addNotification: function(jid) {
		var thistab = this.getTabByJID(jid);
		
		if (typeof this.newMessages[jid] == 'undefined') {
			this.newMessages[jid] = 1;
		}
		else { 
			this.newMessages[jid]++; 
		}
		
		thistab.textEl.addClass('jive-notify');
		
		// make sure there is an interval for this window
		if (this.notificationInterval && !this.notificationInterval[jid]) {
			var bodyId = bodyId;
			this.notificationInterval = window.setInterval(function(){
				getEls('#' + bodyId + ' span.jive-notify').toggleClass('flashNotify');
			}, 1000);
		}
		else {
			getEls('#' + this.bodyId + ' span.jive-notify').addClass('flashNotify');
		}
		// and the browser window too
		jive.spank.notifier.doTitleNotify();
		
		if (/ \(\d+\)$/.test(thistab.text)) {
			thistab.setText(thistab.text.replace(/ \(\d+\)$/, ''));
		}
		thistab.setText(thistab.text + " (" + this.newMessages[jid] + ")");
	},
	
	/**
	 * Clears any notifications currently operating on the tab for a particular JID
	 * 
	 * @param {String} jid the jid to clear the notifications for.
	 */
	clearNotification: function(jid) {
		delete this.newMessages[jid];
		if (this.notificationInterval && this.notificationInterval[jid] 
			&& this.newMessages.properties && this.newMessages.properties.length == 0) {
			window.clearInterval(this.notificationInterval[jid]);
			this.notificationInterval[jid] = null;
		}
		jive.spank.notifier.doTitleNotify();
	},
	/**
	 * Clears all notifications operating on this window.
	 */
	clearAllNotifications: function() {
		var blinkers = getEls('#' + this.bodyId + ' span.jive-notify');
		blinkers.removeClass('jive-notify');
		// doesn't fix tab texts on the assumption that we call this when we close
		window.clearInterval(this.notificationInterval);
		this.notificationInterval = null;
		blinkers.removeClass('flashNotify');
		this.newMessages = {};
		jive.spank.notifier.doTitleNotify();
	},
	
	/**
	 * Returns the message typed into the currently active tab.
	 */
	getMessage: function() {
		return getEl(this.tabId + '-text').dom.value;
	},

	destroy: function() {
		this.clearAllNotifications();
		jive.spank.chat.ChatWindow.superclass.destroy.call(this);
	},
	
	hide: function() {
		this.clearAllNotifications();
		jive.spank.chat.ChatWindow.superclass.hide.call(this);
	},
	
});

jive.spank.chat.ChatWindow.getWindow = function(windowId) {
	return jive.spank.chat.ChatWindow.currentWindow[windowId];
}

jive.spank.chat.ChatWindow.createWindow = function() {
	var component = spank.loadComponent("chat");
	jive.spank.chat.ChatWindow.currentWindow[component.id] = component;
	return component;
}

jive.spank.chat.ChatWindow.destroyWindow = function(windowId) {
	if(jive.spank.chat.ChatWindow.currentWindow[windowId]) {
		jive.spank.chat.ChatWindow.currentWindow[windowId].destroy();
		delete jive.spank.chat.ChatWindow.currentWindow[windowId];
	}
}

jive.spank.chat.ChatWindow.mucConfObject = {
	north: {
		initialSize: 30
	},
	east: {
		split: true,
		initialSize: 100,
		minSize: 50,
		maxSize: 200,
		autoScroll: true,
		collapsible: true
	},
	center: {
		autoScroll: true
	},
	south: {
		split: true,
		initialSize: 50,
		minSize: 50,
		maxSize: 200,
		autoScroll: false,
		collapsible: true
	}
};
jive.spank.chat.ChatWindow.currentWindow = {};
jive.spank.chat.ChatWindow.focusedJID = '';


jive.spank.roster = {};



jive.spank.roster.Roster = function (id, separateOfflines) {
	this.el = getEl(id);
	this.groups = {};
	this.closedgroups = [];
	this.events = {
		/**
		 * @event contactdblclicked
		 * Fires when the user double-clicks a contact in the roster. 
		 * @param {jive.spank.roster.Roster} roster
		 * @param {jive.spank.roster.Contact} contact
		 */
		"contactdblclicked": true,
		/**
		 * @event offline
		 * Fires when a contact starts or stops being 'unavailable' - but not
		 * when their status was previously unknown (e.g. not in the first
		 * population phase of the roster). 
		 */
		"offlinemoved": true
	};
	if (separateOfflines) {
		this.offlines = ''; // will hold id of "virtual roster group" element.
		this._wrappedClick = null;
	};
};

YAHOO.extend(jive.spank.roster.Roster, YAHOO.ext.util.Observable, {
	/**
	 * Creates new group and does up the HTML. Hit setRoster instead for setting up
	 * many groups at a time.
	 * 
	 * @param {String} displayed name of group.
	 * @param {Object} JSON representing the group's members, with usernames as keys.
	 */
	addGroup: function(groupName, groupObj) {
		if(this.groups[groupName]) {
			return this.groups[groupName];
		}
		this.groups[groupName] = new jive.spank.roster.RosterGroup(this, groupName, groupObj);
		this.el.insertHtml('beforeEnd', this.groups[groupName].render(false));
		this.groups[groupName]._enableBehaviors();
		return this.groups[groupName];
	},
	
	addContact: function(userObj, groupName, groupObj) {
		var group = this.addGroup(groupName, groupObj);
		group.addContact(userObj);
	},
	
	removeContact: function(jid) {
		this.findContact(jid).remove();
	},
	
	/**
	 * Creates groups from a composite JSON obj of the whole roster. Will NOT rewrite
	 * HTML, call render() for that.
	 * 
	 * @param {Object} JSON representing groups, with group names as keys, and
	 * usernames as keys beneath that.
	 */
    setRoster: function(rosterObj) {
		var groupObj;
		for (groupName in rosterObj) {
			groupObj = rosterObj[groupName];
			this.groups[groupName] = new jive.spank.roster.RosterGroup(this, groupName, groupObj);
		}
    },
	
	render: function() {
		var groupHTML = '';
		var skipOfflinesFlag = typeof this.offlines != 'undefined';
		
		this._logClosedGroups();
		
		for (var g in this.groups) {
			groupHTML += this.groups[g].render(skipOfflinesFlag);
		}
		
		this.el.dom.innerHTML = groupHTML;
		
		return this;
	},
	
	/**
	 * Returns contact obj for the currently selected contact.
	 */
	getSelectedUser: function() {
		var victim = $$('ul#' + this.id + ' ul.group-list li.selected')[0];
		var idparts = victim.id.split("-");
		var grouphandle = idparts[3];
		var foundjid = idparts[2];
		return this.findContact(foundjid, grouphandle);
	},
	
	findContact: function(jid, groupName) {
		if (groupName) groupName = groupName.replace(/[^0-9A-Za-z]/, '_');
		for (var grouploopName in this.groups) {
			if (groupName && grouploopName.replace(/[^0-9A-Za-z]/, '_') != groupName) continue;
			var foundContact = this.groups[grouploopName].contacts.find(function(contact){
				return contact.jid == jid;
			});
			if (foundContact) {
				return foundContact;
			}
		}
		return null;
	},
	
	changeContactStatus: function(jid, newMode, newStatus) {
		var contact = this.findContact(jid);
		if(contact) {
			contact.changeStatus(newMode, newStatus);
		}
	},
	
	getContactStatus: function(jid) {
		var contact = this.findContact(jid);
		if(contact) {
			return contact.status;
		}
	},
	
	renderOffline: function() {
		var groups = this.groups;
		var offlineHTML = '';
		for(var groupName in groups) {
			this.groups[groupName].contacts.each(function(contact){
				if (contact.status == "unavailable") {
					offlineHTML += contact.render();
				}
			});
		}
		
		if ((offlineHTML == '' || this.offlines != '') && getEl('group-' + this.offlines)) {
			getEl('group-' + this.offlines).remove();
		}
		else {
			this.offlines = "Offline_Group-" + this.el.id;
		}
		
		if (offlineHTML != '') {
			this.el.insertHtml('beforeEnd', jive.spank.chat.Template.roster_group.applyTemplate({
				id: this.offlines,
				renderClosed: 'open',
				online: '',
				groupName: "Offline Group",
				users: offlineHTML
			}));
			
			// behaviors on contacts will be taken care of,
			// but not showing and hiding the group. hence:
			var labell = getEl('group-label-' + this.offlines);
			labell.unselectable();
			this._wrappedClick = labell.getChildrenByTagName('em')[0].mon('click', 
				jive.spank.roster.RosterGroup.toggleGroupVisListener);
			
			// finally:
			jive.spank.roster.RosterGroup.sortContactHTML(this.offlines);
		}
	},
	
	sortGroups: function() {
		var prent = this.el;
		if (prent && prent.dom != null) {
			var lines = prent.getChildrenByClassName('group');
			var sorted = lines.sortBy(function(line){
				return line.id.split("-")[1].toLowerCase();
			});
			sorted.each(function(line){
				line.appendTo(prent.dom);
			});
		}
		for (var g in this.groups) {
			this.groups[g].sort();
		}
	},
	
	_logClosedGroups: function() {
		this.closedgroups = [];
		var groups = this.el.getChildrenByClassName('closed');
		for(var i = 0; i < groups.length; i++) {
			if(groups[i].firstChild) {
				this.closedgroups.push(groups[i].firstChild.innerHTML);
			}
		}
	},
	
	_enableBehaviors: function(doGroupHiding) {
		for (var g in this.groups) {
			this.groups[g]._enableBehaviors(doGroupHiding);
		}
	}
});


jive.spank.roster.RosterGroup = function(roster, name, groupJson) {
	this.name = name;
	this.cleanName = name.replace(/[^A-Za-z0-9]/, '_');
	
	this.contacts = [];
	if(groupJson) {
		this._rebuildContacts(groupJson);
	}
	this._roster = roster;
	
	this.id = this.cleanName + "-" + this._roster.el.id;
	
	this._wrappedClick = null;
};

jive.spank.roster.RosterGroup.prototype = {
	_rebuildContacts: function(json) {
		for (var uname in json) {
			this.contacts.push(new jive.spank.roster.Contact(json[uname], this));
		}
	},
	
	/**
	 * Creates new contact and adds to group. Handles the HTML.
	 * 
	 * @param {Object} JSON-ish object with jid, optional status.
	 */
	addContact: function(userObj) {
		var newguy = new jive.spank.roster.Contact(userObj, this);
		this.contacts.push(newguy);
		
		var wheretodraw = "group-list-" + this.id;
		if (typeof this._roster.offlines != 'undefined' && newguy.status == 'unavailable') {
			wheretodraw = "group-list-" + this._roster.offlines;
		}
		
		jive.spank.chat.Template.contact.append(wheretodraw, {
			id: newguy.id,
			status: newguy.status,
			username: newguy.name
		});
		this.contacts[this.contacts.length - 1]._enableBehaviors();
	},
	
	removeContact: function(jid) {
		var victim = this.getContactByJID(jid);
		if (victim) {
			victim.remove();
		}
	},
	
	/**
	 * Gets index within this group's contacts array of a given jid.
	 * 
	 * @param {String} a jid, of course.
	 */
	contactIndexByJid: function(jid) {
		for (var u = this.contacts.length - 1; u >= 0; u--) {
			if (this.contacts[u].jid == jid) { return u; }
		}
		return -1;
	},
	
	getContactByJID: function(jid) {
		var index = this.contactIndexByJid(jid);
		if(index >= 0) {
			return this.contacts[index];
		}
		else {
			return null;
		}
	},
	
	/**
	 * Returns HTML for whole group. Doesn't add it anywhere or make things clickable.
	 */
	render: function(skipOfflines) {
		var renderClosed = 'open';
		var closedcheck = this._roster.closedgroups.indexOf(this.name) != -1;
		if (closedcheck) {
			renderClosed = 'closed';
		}
		
		var body = this._getMembersHtml(skipOfflines);
		if (body == '' && skipOfflines) { return ''; }
		
		return jive.spank.chat.Template.roster_group.applyTemplate({
			id: this.id,
			renderClosed: renderClosed,
			online: 'group-isonline',
			groupName: this.name,
			users: body
		});
	},
	
	/**
	 * Sorts contact LIs alphabetically. Only affects the HTML, not the contacts array.
	 * Relies on a couple bits from prototype.
	 */
	sort: function() {
		jive.spank.roster.RosterGroup.sortContactHTML(this.id);
	},
	
	/**
	 * Kill self, no questions asked
	 */
	remove: function() {
		var elm = getEl("group-" + this.id);
		YAHOO.ext.EventManager.removeListener(elm, "click", this._wrappedClick);
		this._wrappedClick = null;
		elm.remove();
		delete this._roster.groups[this.name];
	},
	
	_getMembersHtml: function(skipOfflines) {
		var userDump = '';
		for (var u = 0; u < this.contacts.length; u++) {
			if (!skipOfflines || this.contacts[u].status != 'unavailable') {
				userDump += this.contacts[u].render();
			}
		}
		return userDump;
	}, 
	
	_enableBehaviors: function(doGroupHiding) {
		if (doGroupHiding == null) {
			doGroupHiding = true;
		}
		var labell = getEl('group-label-' + this.id);
		if (labell && labell.dom) {
			labell.unselectable();
			var enablee = labell.getChildrenByTagName('em')[0];
			enablee.unselectable();
			if (doGroupHiding) {
				this._wrappedClick = enablee.mon('click', 
					jive.spank.roster.RosterGroup.toggleGroupVisListener);
			}
		}
		// carry thru to contacts
		for(u = this.contacts.length - 1; u >= 0; u--) {
			this.contacts[u]._enableBehaviors();
		}
	}
};


jive.spank.roster.RosterGroup.sortContactHTML = function(id) {
	var prent = getEl('group-list-' + id);
	if (prent && prent.dom != null) {
		var lines = prent.getChildrenByTagName('li');
		var sorted = lines.sortBy(function(line){
			return line.dom.innerHTML;
		});
		sorted.each(function(line){
			line.appendTo(prent.dom);
		});
	}
};


jive.spank.roster.Contact = function(userObj, groupRef) {
	this.jid = (typeof userObj != 'string' && userObj.getJID) ? userObj.getJID()
		: "fake" + Math.random() + "@jivesoftware.com";
	this.name = (userObj.getName && userObj.getName() ? userObj.getName() : this.jid);
	this.status = typeof userObj != 'string' && userObj.status ? userObj.status : 
		userObj.isSubscriptionPending && userObj.isSubscriptionPending() ? "pending" : "unavailable";
	this.group = groupRef;
	this.id = 'roster-contact-' + this.jid + '-' + this.group.cleanName;
	this.currentMessage = '';
	
	this._wrappedClick = null;
	this._wrappedDblClick = null;
	this.events = {
		"status": true,
		"offlinemoved": true
	}
};

YAHOO.extend(jive.spank.roster.Contact, YAHOO.ext.util.Observable, {
	/**
	 * Kill self, no questions asked
	 */
	remove: function() {
		var elm = getEl(this.id);
		YAHOO.ext.EventManager.removeListener(elm, "click", this._wrappedClick);
		this._wrappedClick = null;
		YAHOO.ext.EventManager.removeListener(elm, "dblclick", this._wrappedDblClick);
		this._wrappedDblClick = null;
		YAHOO.ext.EventManager.removeListener(elm, "mouseover", this._wrappedMouseOver);
		delete this._wrappedMouseOver;
		YAHOO.ext.EventManager.removeListener(elm, "mouseout", this._wrappedMouseOut);
		delete this._wrappedMouseOut;
		elm.remove();
		this.group.contacts.splice(this.group.contactIndexByJid(this.jid), 1);
		delete this.group;
	},
	
	/**
	 * Resets contact's HTML classname to reflect newStatus.
	 * 
	 * @param {String} string to hopefully match one of the status class declarations.
	 */
	changeStatus: function(newMode, newStatus) {
		newMode = newMode.toLowerCase();
		
		getEl(this.id).replaceClass("roster-contact-" + this.status, "roster-contact-" + newMode);
		
		var oldMode = (this.status ? this.status : "unavailable");
		var realOldMode = this.status;
		
		this.status = newMode;
		
		if (realOldMode == 'unavailable' || newMode == 'unavailable') {
			this.group._roster.fireEvent('offlinemoved');
			// this gets its own var, realOldMode, so we don't fire a lot of
			// false positives when first populating the roster
		}
		this.fireEvent("status", oldMode, newMode);
		this._changeStatusMsg(newStatus);	
		return oldMode;
	},
	
	/**
	 * Return HTML as string, don't add it anywhere or make it hot.
	 */
	render: function() {
		return jive.spank.chat.Template.contact.applyTemplate({
			id: this.id,
			username: this.name,
			status: this.status,
			message: this.currentMessage
		});
	},
	
	_changeStatusMsg: function(msg) {
		this.currentMessage = (!msg || msg.strip() == '' ? '' : '- ' + msg);
		var statusElm = getEl(this.id + '-msg');
		statusElm.dom.innerHTML = this.currentMessage;
	},
	
	_enableBehaviors: function() {
		var elm = getEl(this.id);
		if (elm) {
			elm.unselectable();
			
			// someday, also add mouseover for the popup profiley thing
			// but for now
			this._wrappedClick = elm.mon('click', function(evt) {
				var goodElm = getEl(evt.getTarget());
				var damnbug = goodElm.dom.id;
				getEls('ul.jive-roster ul.group-list li').removeClass('selected');
				document.getElementById(damnbug).className += " selected";
			});
			var self = this;
			this._wrappedDblClick = elm.mon('dblclick',function(evt) {
				evt.stopEvent();
				self.group._roster.fireEvent("contactdblclicked", self.group._roster, self);
			});
			this._wrappedMouseOver = elm.addManagedListener("mouseover", function(evt) {
				var goodElm = getEl(evt.getTarget());
				var damnbug = goodElm.dom.id;
				document.getElementById(damnbug).className += " hover";
			});
			this._wrappedMouseOut = elm.addManagedListener("mouseout", function(evt) {
				elm.removeClass('hover');
			});
		}
	}
});

/**
 * Returns first contact object in the named group that matches the JID given.
 * If no group name is given, searches all groups and returns first match.
 * 
 * @param {String} jid valid jid.
 * @param {String} groupName name of group to look in. Cleaned w/ underscores or not, doesn't matter.
 */
jive.spank.roster.Contact.find = function(currentRoster, jid, groupName) {
	var grouploop = currentRoster.groups;
	for (var grouploopName in grouploop) {
		if (groupName && grouploopName.replace(/[^0-9A-Za-z]/, '_') != groupName) continue;
		var foundContact = grouploop[grouploopName].contacts.find(function(contact){
			return contact.jid == jid;
		});
		if (foundContact) {
			return foundContact;
		}
	}
	return null;
};




jive.spank.chat.Dialog = function(parentWindow, template, confObj) {
	this.parentWindow = parentWindow;
	
	var elm = document.createElement('div');
	this.id = elm.id = YAHOO.util.Dom.generateId();
	document.body.appendChild(elm);
	
	var constrained = confObj.constrained || true;
	
	this.dialog = new YAHOO.ext.BasicDialog(elm.id, { 
		title: confObj.title, 
		modal: false,
		width: confObj.width,
		height: confObj.height,
		shadow: true,
		proxyDrag: true,
		constraintoviewport: constrained,
		resizable: false,
		draggable: true,
		x: confObj.x ? confObj.x : (YAHOO.util.Dom.getViewportWidth() / 2) - (confObj.width / 2),
		y: confObj.y ? confObj.y : (YAHOO.util.Dom.getViewportHeight() / 2) - (confObj.height / 2),
		closable: true
	});
	
	if (confObj.templateKeys) {
		var newObj = confObj.templateKeys;
		newObj.id = this.id;
		template.append(this.dialog.body.dom, newObj);
	}
	else {
		template.append(this.dialog.body.dom, {id: this.id});
	}
	
	var self = this;
	getEls('#' + this.id + ' .jive-closedialog').addListener('click', function(){
		self.dialog.hide();
	});
	self.dialog.addListener('hide', function(e) {
		self.dialog.destroy(true);
	});
};


jive.spank.Spinner = {
	show: function(confObj) {
		if (confObj == null) {
			confObj = {};
		}
		if (!this.isShowing) {
			var x = confObj.x || (YAHOO.util.Dom.getViewportWidth() / 2) - 60;
			var y = confObj.y || (YAHOO.util.Dom.getViewportHeight() / 2) - 20;
			var text = confObj.text || 'Loading...';
			this.template.append(document.body, {text: text});
			var theEl = getEl("jive-spinner");
			if (confObj.el && confObj.position) {
				theEl.alignTo(confObj.el, confObj.position);
			}
			else {
				theEl.moveTo(x, y);
			}
			theEl.setStyle('z-index', 20000);
			theEl.show();
			this.isShowing = true;
		}
	},
	isShowing: false,
	hide: function() {
		if (this.isShowing) {
			getEl("jive-spinner").remove();
			this.isShowing = false;
		}
	},
	template: new YAHOO.ext.DomHelper.Template(
		'<div style="visibility: hidden;" id="jive-spinner">' +
		'<img src="images/progress.gif" alt="" />{text}</div>'
	)
};


jive.spank.chat.Filter = function(name, filterer, filterTo) {
	if (typeof filterer != 'function') {
		// expecting a regex, with a string chaser
		var newfilter = function(str){return str.replace(filterer, filterTo);};
		filterer = newfilter;
	}
	this.filterMethod = filterer;
	this.name = name;
};
jive.spank.chat.Filter.prototype.apply = function(elm){
	return jive.spank.chat.Filter._treewalk(this.filterMethod, elm);
}

jive.spank.chat.Filter.applyAll = function(elm) {
	// apply filter only to text nodes
	elm = jive.spank.chat.Filter.registeredFilters.inject(elm, function(elm, filter) {
		elm = jive.spank.chat.Filter._treewalk(filter.filterMethod, elm);
	});
};
jive.spank.chat.Filter.register = function(filter) {
	jive.spank.chat.Filter.registeredFilters.push(filter);
}
jive.spank.chat.Filter.unregister = function(filterName) {
	jive.spank.chat.Filter.registeredFilters.each(function(ftr,i){
		if (ftr.name == filterName) {
			delete jive.spank.chat.Filter.registeredFilters[i];
			throw $break;
		}
	});
}
jive.spank.chat.Filter.registeredFilters = [];
jive.spank.chat.Filter._treewalk = function(filter, elm){
	elm.childNodes.each(function(leaf){
		if (leaf.nodeType == 3) {
			leaf = filter(leaf);
		}
		else {
			leaf = jive.spank.chat.Filter._treewalk(filter, leaf);
		}
	});
	return elm;
};


// notification nonsense
jive.spank.notifier = {};
jive.spank.notifier.origTitle = null;
jive.spank.notifier.titleMsg = '';
jive.spank.notifier.titleInterval = null;
jive.spank.notifier.countNewMsgs = function() {
	var windowObj;
	var lastOneName = '';
	var newMsgCt = 0;
	for (windowId in jive.spank.chat.ChatWindow.currentWindow)
	{
		windowObj = jive.spank.chat.ChatWindow.currentWindow[windowId];
		for (tabJid in windowObj.newMessages) {
			newMsgCt += windowObj.newMessages[tabJid];
		}
	}
	return newMsgCt;
};
jive.spank.notifier.doTitleNotify = function(contactName) {
	var ct = jive.spank.notifier.countNewMsgs();
	if (jive.spank.notifier.titleInterval) {
		window.clearTimeout(jive.spank.notifier.titleInterval);
		jive.spank.notifier.titleInterval = null;
	}
	if (ct <= 0)
	{
		if (jive.spank.notifier.origTitle != null) {
			document.title = jive.spank.notifier.origTitle;
			jive.spank.notifier.origTitle = null;
		}
		return null;
	}
	else {
		jive.spank.notifier.titleMsg = "* " + ct + " new chat message" + (ct > 1 ? "s" : "");
	}
	if (jive.spank.notifier.origTitle == null) {
		jive.spank.notifier.origTitle = document.title;
	}
	jive.spank.notifier.titleInterval = window.setTimeout(jive.spank.notifier.rotateTitle, 2000);
};
jive.spank.notifier.rotateTitle = function() {
	document.title = (document.title == jive.spank.notifier.titleMsg) ? 
		jive.spank.notifier.origTitle :
		jive.spank.notifier.titleMsg;
	jive.spank.notifier.titleInterval = window.setTimeout(jive.spank.notifier.rotateTitle, 2000);
};

// templates
jive.spank.chat.Template = {
	contact:new YAHOO.ext.DomHelper.Template(
		'<li id="{id}" class="roster-contact-{status}">{username} <span id="{id}-msg" class="msg">{message}</span></li>'
	),
	dialog:new YAHOO.ext.DomHelper.Template(
		'<div class="ydlg-hd">{windowTitle}</div>' +
		'<div id="{bodyId}" class="ydlg-bd">' +
		'<div id="{bodyId}-toppane" class="ydlg-bd jive-userpane"></div>' +
		'</div>'
	),
	message:new YAHOO.ext.DomHelper.Template(
		'<div class="{type}-message"><span><em class="{timeclass}">({time})</em> {from}:</span> {message}</div>'
	),
	muctab:new YAHOO.ext.DomHelper.Template(
		'<div id="{tabId}-layout" class="ylayout-inactive-content ydlg-tab">' +
		'<div id="{tabId}-controls" class="jive-muc-ctrl"></div>' +
		'<div id="{tabId}-history" class="jive-history"></div>' +
		'<div id="{tabId}-occupants" class="jive-muc-occupants"></div>' +
		'<textarea id="{tabId}-text" class="jive-tab-message"></textarea>' +
		'</div>'
	),
	muc_controls: new YAHOO.ext.DomHelper.Template(
		'<p>Subject: <span id="{tabId}-subject"></span></p>'
	),
	rename: new YAHOO.ext.DomHelper.Template([
		'<div class="dbody">',
		'<div style="text-align: center; padding: 8px;">Rename to: ',
		'<input type="text" id="{id}-name" value="" /></div>',
		'<div style="text-align: center;">',
		'<input type="button" class="btn" id="{id}-rename" value="OK" />',
		'<input type="button" class="btn jive-closedialog" id="{id}-close" value="Cancel" />',
		'</div>',
		'</div>'
	].join('')),
	roster:new YAHOO.ext.DomHelper.Template(
		'<ul id="{rosterId}" class="jive-roster">{groups}</ul>'
	),
	roster_group:new YAHOO.ext.DomHelper.Template(
		'<li id="group-{id}" class="group">' +
		'<span id="group-label-{id}" class="group-label {online} {renderClosed}"><em>{groupName}</em></span>' +
		'<ul id="group-list-{id}" class="group-list">{users}</ul>' +
		'</li>'
	),
	spinnertab: new YAHOO.ext.DomHelper.Template(
		'<div id="{tabId}-spinner" class="ylayout-inactive-content ydlg-tab jive-spinnertab">' +
		'<div id="jive-spinner"><img src="images/progress.gif" alt="" />{text}</div>' +
		'</div>'
	),
	statusMessage: new YAHOO.ext.DomHelper.Template(
		'<div class="status-message">{message}</div>'
	),
	userpane: new YAHOO.ext.DomHelper.Template(
		'<span id="{id}-message">{message}</span>'
	),
	userpane_loggedin: new YAHOO.ext.DomHelper.Template(
		'You are logged in as <strong id="{id}-uname">{uname}</strong>'
	),
	userpane_changebtn: new YAHOO.ext.DomHelper.Template(
		'<a id="{id}-changenickbtn" href="javascript:void();">Change Nickname</a>'
	)
};

YAHOO.ext.Element.prototype.getParentByClass = function(className, tagName){
	if(tagName) {
		tagName = tagName.toLowerCase();
	}
	function isMatch(el){
		if(!el){
			return false;
		}
		if(className && !YAHOO.util.Dom.hasClass(el, className)){
			return false;
		}
		if(tagName && el.tagName.toLowerCase() != tagName){
			return false;
		}
		return true;
	};
	
	var t = this.dom;
	if(!t || isMatch(t)){
		return t;
	}
	var p = t.parentNode;
	var b = document.body;
	while(p && p != b){
		if(isMatch(p)){
			return p;
		}
		p = p.parentNode;
	}
	
	return null;
};

YAHOO.ext.EventManager.onDocumentReady(function(){
	window.groupChat = new jive.spank.chat.ChatWindow('groupchat', {
			width: 520,
			height: 450,
			x: 130,
			y: 340
	});
	window.groupChat.prepUserPane();
	window.groupChat.addMUC({name: 'Group Chat', jid: 'openchat@igniterealtime.org'});
	window.groupChat.show();
	getEl(window.groupChat.tabId + '-layout').dom.parentNode.style.position = 'absolute';
});
