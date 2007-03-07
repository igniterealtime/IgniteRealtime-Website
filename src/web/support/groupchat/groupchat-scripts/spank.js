var jive = {};
jive.spank = {};
jive.spank.chat = {};

var spank = {
    loadComponent: function(type) {
        if (type == null || type == "") {
            return null;
        }

        var component = spank._createComponent(type);
        var attributes = spank._loadAttributes(type);

        switch (type) {
            case "chat":
                return new jive.spank.chat.ChatWindow(component.id, attributes);
            case "roster":
                return new jive.spank.roster.RosterWindow(component.id, attributes);
            default:
                return null;
        }
    },
    _loadAttributes: function(element) {
        if (!spank.conf || !spank.conf[element]) {
            return {};
        }
        return spank.conf[element];
    },
    _createComponent: function(type) {
        var elm = document.createElement('div');
        elm.id = YAHOO.util.Dom.generateId();
        document.getElementsByTagName('body')[0].appendChild(elm);
        return elm;
    }
};

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
        if (!this.isUpdating) {
            this.isUpdating = true;
            this.dialog.beginUpdate();
        }
    },
    endUpdate: function() {
        if (this.isUpdating) {
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
    var resizable = attributes["resizable"] != "false";
    var draggable = attributes["draggable"] != "false";
    var closable = attributes["closable"] != "false";
    var blinkTab = attributes["blinktab"] == "true";
    var constrained = attributes["constrained"] != "false";
    if (blinkTab) {
        this.notificationInterval = {};
    }
    var confObject = {
        modal: false,
        constraintoviewport: constrained,
        width: width,
        height: height,
        shadow: false,
        proxyDrag: true,
        resizable: resizable,
        draggable: draggable,
        minWidth: 300,
        minHeight: 300,
        x: x,
        y: y,
        closable: closable
    };
    if (attributes['bottomPane']) {
        confObject = $H(confObject).merge({
            south: {
                autoScroll: false,
                initialSize: 30
            },
            east: {
                split: true,
                initialSize: 105,
                minSize: 50,
                maxSize: 200,
                autoScroll: false,
                collapsible: true
            },
            center: {
                autoScroll: false,
                autoTabs: false
            }
        });
    }
    else {
        confObject = $H(confObject).merge({
            north: {
                autoScroll: false,
                initialSize: 90
            },
            east: {
                split: true,
                initialSize: 105,
                minSize: 50,
                maxSize: 200,
                autoScroll: false,
                collapsible: true
            },
            center: {
                autoScroll: true,
                closeOnTab: true,
                closeontab: true,
                alwaysShowTabs: true,
                autoTabs: false
            }
        });
    }
    jive.spank.chat.ChatWindow.superclass.constructor.call(this, id, "Chat", confObject);
    this.events = {
        "input": true,
        "message": true,
        "nickcomplete" : true,
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
        "changenameinmuc": true,
    /**
     * @event refreshmuclist
     * Fires when the user wants to refresh that there list of MUCs
     * @param {jive.spank.chat.ChatWindow} chatwindow ref to the muc's chat window
     */
        "refreshmuclist": true,
			/**
	 * @event createmuc
	 * Fires when the user wants to create a MUC
	 */
	"createmuc": true
    };
    var layout = this.dialog.getLayout();

    layout.regions['center'].addListener("panelremoved", function() {
        if (layout.regions['center'].tabs.items.length == 0) {
            this.dialog.hide();
        }
    }.bind(this));

    this.dialog.addListener("hide", function() {
        if (this.destroyed) {
            return;
        }
        this.destroyed = true;
        this.removeAllTabs();
        this.dialog.destroy(true);
        this.dialog.proxy.remove();
        this.dialog.resizer.proxy.remove();
    }.bind(this));

    this.newMessages = {};
    this._wrappedFns = {};
};
YAHOO.extend(jive.spank.chat.ChatWindow, jive.spank.Window, {

/**
 * Does the heavy HTML lifting for adding a new tab.
 *
 * @param {jive.spank.chat.Contact/String} either a Contact object (or fakey
 * version with name and jid properties) or a jid.
 */
    addTab: function(contactObj) {
        this.dialog.beginUpdate();
        if (typeof contactObj == 'string') {
            var thejid = contactObj;
            contactObj = {name: thejid, jid: thejid};
        }
        var tabId = "jive-tab-" + contactObj.jid;

        jive.spank.chat.Template.tab.append(this.bodyId, {tabId: tabId});
        var layout = this.dialog.getLayout();

        var innerLayout = new YAHOO.ext.BorderLayout(tabId + "-layout",
                jive.spank.chat.ChatWindow.tabConfObject);

        innerLayout.add('north', new YAHOO.ext.ContentPanel(tabId + '-toppane'));
        jive.spank.chat.Template.chat_toppane.append(tabId + '-toppane', {tabId: tabId});
        innerLayout.regions['north'].hide();

        innerLayout.add('center', new YAHOO.ext.ContentPanel(tabId + '-history'));

        // south panel and textarea sizing
        innerLayout = this._layoutTextarea(innerLayout, tabId, contactObj.jid.toString());

        layout.add('center', new YAHOO.ext.NestedLayoutPanel(innerLayout,
        {title: contactObj.name, closable: true}));

        // now it's a tab, so we can do this:
        var thetab = this.getTabByJID(contactObj.jid);
        var textArea = getEl(tabId + "-text");

        this.tabs[contactObj.jid] = {
            type: "chat",
            tab: this.getTabByJID(contactObj.jid),
            contact: contactObj
        };

        var tabFocusAction = function(contact) {
            this.clearNotification(contact.jid);
            this.dialog.setTitle(contact.name);
            this._scrollMessageHistory(getEl("jive-tab-" + contact.jid + "-history"));
            textArea.dom.focus();
        }.bind(this, contactObj);
        thetab.addListener("activate", tabFocusAction);

        thetab.addListener("close", function() {
            this._wrappedFns[tabId].each(function(value) {
                value();
            });
            this.fireEvent("tabclosed", contactObj, this.tabs[contactObj.jid]);

            delete this._wrappedFns[tabId];
            delete this.tabs[contactObj.jid];
        }.bind(this));
        var clearNotifyListener = function(contact) {
            this.clearNotification(contact.jid);
        }.bind(this, contactObj);
        thetab.el.mon("click", clearNotifyListener);
        getEl(getEl(tabId + '-history').dom.parentNode.id).mon("click", clearNotifyListener);

        if (contactObj.addListener) {
            var listener = function(oldStatus, status) {
                thetab.textEl.replaceClass('jive-status-' + oldStatus, 'jive-status-' + status)
            };
            contactObj.addListener("status", listener);
            thetab.addListener("close", function() {
                contactObj.removeListener("statusChanged", listener);
            });
        }
        thetab.textEl.addClass('jive-status-' + (contactObj.status ?
                                                 contactObj.status : "unavailable"));
        this.dialog.endUpdate();
        tabFocusAction();
        return true;
    },

    preAddMUCChooser: function() {
        var tabId = "jive-tab-mucchooser";
        if (this.dialog.layout.regions['center'].panels.items[tabId + '-spinner']) {
            delete this.dialog.layout.regions['center'].panels.items[tabId + '-spinner'];
        }
        jive.spank.chat.Template.spinnertab.append(this.bodyId,
        {tabId: tabId, text: 'Loading...'});

        var layout = this.dialog.getLayout();
        this.dialog.beginUpdate();
        layout.add('center', new YAHOO.ext.ContentPanel(tabId + '-spinner',
        {title: 'Choose a Conference'}));
        this.dialog.endUpdate();

        var thetab = this.getTabs().items[tabId + '-spinner'];
        thetab.textEl.addClass('jive-muc');

        var self = this;
        thetab.addListener("close", function() {
            delete self.dialog.layout.regions['center'].panels.items[tabId + '-spinner'];
        });

        this.tabs['mucchooser'] = {
            type: "muc-spinner",
            tab: thetab
        };
    },

    addChooseMUCTab: function(roomsData) {
        this.dialog.beginUpdate();
        if (this.tabs['mucchooser']) {
            this.getTabs().removeTab('jive-tab-mucchooser-spinner');
            delete this.dialog.layout.regions['center'].panels.items['jive-tab-mucchooser-spinner'];
            delete this.tabs['mucchooser'];
        }

        var tabId = YAHOO.util.Dom.generateId();
        jive.spank.chat.Template.mucchooser.append(this.bodyId, {tabId: tabId});
        this._wrappedFns[tabId] = [];

        var roomGrid = this._buildMUCChooserGrid(roomsData, tabId);

        var layout = this.dialog.getLayout();

        var innerLayout = new YAHOO.ext.BorderLayout(tabId + "-layout",
                jive.spank.chat.ChatWindow.chooseMUCConfObject);

        innerLayout.add('north', new YAHOO.ext.ContentPanel(tabId + '-toppane'));
        jive.spank.chat.Template.muc_chooser_top.append(tabId + '-toppane', {tabId: tabId});

        // fire up those tophat buttons
        getEl(tabId + '-createconf').addListener('click', this.fireEvent.createDelegate(this, ['createmuc', this]));
        getEl(tabId + '-refresh').addListener('click',  this.fireEvent.createDelegate(this, ['refreshmuclist', this]));

        // add gridpanel with our grid
        innerLayout.add('center', new YAHOO.ext.GridPanel(roomGrid));

        layout.add('center', new YAHOO.ext.NestedLayoutPanel(innerLayout,
        {title: "Choose a Conference", closable: true}));


        var realTabId = getEl(tabId + '-roomgrid').getParentByClass('yui-ext-tabitembody').id;
        var muctab = this.getTabs().items[realTabId];
        muctab.textEl.addClass('jive-muc');

        var self = this;
        var tabFocusAction = function() {
            self.dialog.setTitle("Choose a Conference");
        };
        muctab.addListener("activate", tabFocusAction);
        muctab.addListener("close", this._wrappedFns[tabId].each.createDelegate(
                this._wrappedFns[tabId], [function(func) {
            func();
        } ]));

        this.tabs['muc-chooser-' + tabId] = {
            type: "muc-chooser",
            tab: muctab
        };
        this.dialog.endUpdate();
        getEl(tabId + '-confcontrols').fitToParent();
        tabFocusAction();
    },

    _buildMUCChooserGrid: function(roomsData, tabId) {
        var schema = {
            fields: ["name", "muc#roominfo_subject", "muc#roominfo_occupants"]
        }
        var gridData = new YAHOO.ext.grid.SpankJSONDataModel(schema);
        var dataProcessor = function(value) {
            if (value.values) {
                return value.values[0];
            }
            else {
                return value;
            }
        }
        gridData.addPreprocessor(1, dataProcessor);
        gridData.addPreprocessor(2, dataProcessor);
        gridData.loadData(roomsData);

        // get some labels on there
        var roomCols = [
        {header: "Name", width: 240, sortable: true},
        {header: "Subject", width: 160, sortable: true},
        {header: "Occupants", width: 70, sortable: true}
                ];
        var gridCols = new YAHOO.ext.grid.DefaultColumnModel(roomCols);

        // finally! build grid
        var roomGrid = new YAHOO.ext.grid.Grid(tabId + '-roomgrid', {
            dataModel: gridData,
            colModel: gridCols,
            selModel: new YAHOO.ext.grid.SingleSelectionModel(),
            monitorWindowResize: false,
            stripeRows: false
        });
        roomGrid.render();
        this._wrappedFns[tabId].push(roomGrid.destroy.createDelegate(roomGrid, [true]));
        // add row dblclick handler
        roomGrid.addListener('rowdblclick', function(grid, rownum, evt) {
            var choosertabId = evt.findTarget('ylayout-nested-layout').id;
            var name = grid.getDataModel().getRow(rownum)[0]
            var jid = grid.getSelectedRowId();
            this.fireEvent("mucdblclicked", this, jid, name, choosertabId);
        }.bind(this));

        return roomGrid;
    },

    preAddMUC: function(roomObj, choosertabId) {
        var tabId = "jive-tab-" + roomObj.jid;
        if (this.dialog.layout.regions['center'].panels.items['jive-tab-' + roomObj.jid + '-spinner']) {
            delete this.dialog.layout.regions['center'].panels.items['jive-tab-' + roomObj.jid + '-spinner'];
        }
        jive.spank.chat.Template.spinnertab.append(this.bodyId,
        {tabId: tabId, text: 'Joining "' + roomObj.name + '"...'});
        if (choosertabId) {
            this.getTabs().removeTab(choosertabId);
            // maybe best left to external method?
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
    removeMUCSpinner: function(jid) {
        if (this.tabs[jid] && this.tabs[jid].type == 'muc-spinner') {
            this.dialog.beginUpdate();
            delete this.dialog.layout.regions['center'].panels.items['jive-tab-' + jid + '-spinner'];
            this.getTabs().removeTab(this.tabs[jid].tab.id);
            delete this.tabs[jid];
            if (this.dialog.layout.regions['center'].tabs.items.length == 0) {
                this.dialog.hide();
            }
            else {
                this.dialog.endUpdate();
            }
        }
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
        var mainLayout = new YAHOO.ext.BorderLayout(tabId + "-layout", jive.spank.chat.ChatWindow.mucConfObject);
        var sidebarLayout = new YAHOO.ext.BorderLayout(tabId + "-sidebarlayout", jive.spank.chat.ChatWindow.mucSidebarConfObject);


        var topic = new YAHOO.ext.ContentPanel(tabId + '-controls');
        mainLayout.add('north', topic);
        
        var chatPanel = new YAHOO.ext.ContentPanel(tabId + '-history');
        mainLayout.add('center', chatPanel);

        //adds the text entry box to 'south'
        mainLayout = this._layoutTextarea(mainLayout, tabId, roomObj.jid.toString());
        
        
        //the other element in the sidebar is added in prepUserPane
        var contactList = new YAHOO.ext.ContentPanel(tabId + '-occupants');
        sidebarLayout.add('center', contactList);
        
        
        //put together the sidebar + main area
        var sidebar = new YAHOO.ext.NestedLayoutPanel(sidebarLayout);
        layout.add('east', sidebar);
        var main = new YAHOO.ext.NestedLayoutPanel(mainLayout, {title: roomObj.name, closable: true});
        layout.add('center', main);
        
        topic.getEl().dom.parentNode.className += " jive-topic";
        chatPanel.getEl().dom.parentNode.className += " jive-chat";
        contactList.getEl().dom.parentNode.parentNode.className += " jive-contact-list";
        main.getEl().dom.parentNode.className += " jive-main";
        sidebar.getEl().dom.parentNode.className += " jive-sidebar";
        
        var eastSplit = layout.regions['east'].getSplitBar()
        this._wrappedFns[tabId].push(eastSplit.destroy.createDelegate(eastSplit, [true]));

        // now it's a tab, so we can do this:
        var thetab = this.getTabByJID(roomObj.jid);
        var tabFocusAction = function(jid, name, textArea, messageHistory) {
            this.clearNotification(jid);
            this.dialog.setTitle("<h1>" + name + "</h1>");
            this._scrollMessageHistory(messageHistory);
            textArea.dom.parentNode.className += " jive-message-field"; //hax. Should only be set once.
            textArea.dom.focus();
        }.bind(this, roomObj.jid, roomObj.name, getEl(tabId + "-text"), getEl(tabId + "-history"));

        thetab.addListener("activate", tabFocusAction);
        if (!this.dialog.getLayout().regions['south']) {
            thetab.addListener("close", function() {
                this._wrappedFns[tabId].each(function(value) {
                    value();
                });
                this.fireEvent("tabclosed", roomObj, this.tabs[roomObj.jid]);

                var roomEl = getEl(roomObj.jid + '-');
                if (roomEl) {
                    roomEl.remove();
                }

                delete this._wrappedFns[tabId];
                delete this.tabs[roomObj.jid];
                thetab.purgeListeners();
            }.bind(this));
            thetab.textEl.addClass('jive-muc');
        }
        else {
            jive.spank.chat.Template.muc_subject.append(tabId + '-controls', {jid: roomObj.jid});
            this.tabId = tabId;
            this.dialog.getLayout().regions['center'].panels.items[0].id = tabId;
        }

        var clearNotifyListener = this.clearNotification.createDelegate(this, [roomObj.jid]);
        thetab.el.addListener("click", clearNotifyListener);
        getEl(getEl(tabId + '-history').dom.parentNode.id).addListener("click",
                clearNotifyListener);

        if (rosterWindow) {
            this._doMucControls(tabId, roomObj,
                    rosterWindow.contactsForAutocomp.createDelegate(rosterWindow));
        }
        // fill in room participants
        jive.spank.chat.Template.roster.append(tabId + '-occupants', {
            rosterId: tabId + '-roster',
            groups: ''
        });
        thetab.roster = new jive.spank.roster.Roster(tabId + '-roster');

        var participants = {"Participants": (roomObj.occupants ? roomObj.occupants : {})};
        thetab.roster.setRoster(participants);
        thetab.roster.render();
        thetab.roster.sortGroups();
        thetab.roster._enableBehaviors(false);
        // false = no group hiding
        getEl(tabId + "-text").dom.focus();

        this.dialog.endUpdate();
        tabFocusAction();
        return this.tabs[roomObj.jid] = {
            type: "muc-room",
            tab: thetab,
            roster: thetab.roster,
            participants: thetab.roster.groups["Participants"],
            room: roomObj
        };
    },

    _layoutTextarea: function(innerLayout, tabId, tabJID) {
        innerLayout.add('south', new YAHOO.ext.ContentPanel(tabId + '-text'));
        var textArea = getEl(tabId + "-text");

        this._wrappedFns[tabId] = [];

        var southSplit = innerLayout.regions['south'].getSplitBar()
        this._wrappedFns[tabId].push(southSplit.destroy.createDelegate(southSplit, [true]));

        var resizeHandler = textArea.fitToParent.createDelegate(textArea);
        innerLayout.delayedListener("regionresized", resizeHandler, 100);
        this._wrappedFns[tabId].push(innerLayout.purgeListeners.createDelegate(innerLayout));

        this.dialog.addListener("resize", resizeHandler);
        this._wrappedFns[tabId].push(this.dialog.removeListener.createDelegate(this.dialog,
                ["resize", resizeHandler]));

        //XXX: this is a hack to get around the fact that it's too early. We should figure out where it really goes.
        //Without it, the text entry box is too large until you resize the window.
        window.setTimeout(resizeHandler, 1000);

        // adding a message handler to textarea
        var wrapper = textArea.mon('keypress', function(evt) {
            if (evt.getKey() == 13 && !evt.shiftKey && this.getMessage() != "") {
                this.fireEvent("message", tabJID, this.getMessage());
                window.setTimeout(function() {
                    this.dom.value = "";
                }.bind(textArea), 10);
				evt.preventDefault();
            }
            else {
                if (evt.getKey() == 9) {
                    //tab completion of nicks.
                    this.fireEvent("nickcomplete", tabJID, this.getMessage(), textArea);
                    evt.preventDefault();
                }
                if (evt.getKey() == 13) {
                    return;
                }
                this.fireEvent("input", tabJID);
            }
        }.bind(this));
        this._wrappedFns[tabId].push(YAHOO.ext.EventManager.removeListener.createDelegate(
                YAHOO.ext.EventManager, ["keypress", textArea, wrapper]));

        wrapper = textArea.mon('focus', function() {
            var jid = this.getActiveTabJID();
            this.clearNotification(jid);
            jive.spank.chat.ChatWindow.focusedJID = jid;
        }.bind(this));
        this._wrappedFns[tabId].push(YAHOO.ext.EventManager.removeListener.createDelegate(
                YAHOO.ext.EventManager, ["focus", textArea, wrapper]));

        wrapper = textArea.mon('blur', function() {
            jive.spank.chat.ChatWindow.focusedJID = '';
        });

        this._wrappedFns[tabId].push(YAHOO.ext.EventManager.removeListener.createDelegate(
                YAHOO.ext.EventManager, ["blur", textArea, wrapper]));

        return innerLayout;
    },

    _doMucControls: function(tabId, room, contactListFunction) {
        jive.spank.chat.Template.muc_controls.append(tabId + '-controls',
        {jid: room.jid});
        jive.spank.chat.Template.mucinvitemenu.append(document.body,
        {jid: room.jid});

        var mucInviteContainer = getEl(room.jid + '-container');
        mucInviteContainer.hide();
        this._wrappedFns[tabId].push(mucInviteContainer.remove.createDelegate(mucInviteContainer));

        var mucAutoComp = new jive.spank.AutoComplete(room.jid + '-autocomp',
                room.jid + '-autocomp-menu',
                new YAHOO.widget.DS_JSFunction(contactListFunction),
        {typeAhead: true, autoHighlight: true, minQueryLength: 0, maxResultsDisplayed: 20}
                );
        mucAutoComp.formatResult = function(oResultItem, sQuery) {
            return "<div class='roster-contact-" + oResultItem[2] + "'>" + oResultItem[0] + "</div>";
        };

        var jid = room.jid;
        var self = this;
        mucAutoComp.itemSelectEvent.subscribe(function(type, args) {
            self.fireEvent('mucinvitation', self, args[2][1].toString(), jid);
            getEl(jid + '-autocomp').dom.blur();
        });

        var inviteControl = getEl(jid + '-control');
        inviteControl.mon('click', function(chatWindow, inviteContainerElement, mucAutoComplete, contactListFunction) {
            chatWindow.invitee = '';

            var entry = inviteContainerElement.getChildrenByTagName('input')[0];
            entry.setWidth(inviteContainerElement.getWidth() - 2);
            entry.dom.value = '';
            inviteContainerElement.alignTo(this, 'bl');
            inviteContainerElement.show();
            inviteContainerElement.setStyle('z-index', self.dialog.lastZIndex + 1);
            entry.dom.focus();

            mucAutoComp._populateList('', contactListFunction(), mucAutoComp);

            inviteContainerElement.repaint();
        }.createDelegate(inviteControl, [this, getEl(room.jid + '-container'), mucAutoComp,
                contactListFunction]));
        // realign menu when window moves? when pane resizes?

        var autoComplete = getEl(jid + '-autocomp');
        autoComplete.mon('keypress', function(autoComplete, jid, contactListFunction,
                                              evt) {
            if (evt.getKey() == 13) {
                evt.preventDefault();
                var contact = contactListFunction().detect(function(text, value) {
                    return text == value[0];
                }.bind(this, autoComplete.dom.value));

                if (!contact) {
                    contact = autoComplete.dom.value;
                }
                else {
                    contact = contact[1].toString();
                }
                this.fireEvent('mucinvitation', this, contact, jid);
                getEl(jid + '-container').hide();
                getEl('jive-tab-' + this.getActiveTabJID() + '-text').dom.focus();
            }
        }.bind(this, autoComplete, jid, contactListFunction));
        autoComplete.addListener('blur', function() {
            window.setTimeout("getEl('" + jid + "-container').hide();", 200);
            getEl('jive-tab-' + self.getActiveTabJID() + '-text').dom.focus();
        });

        // aaaaand briefly by comparison, the change-nick button
        getEl(jid + '-changenick').addListener('click', function() {
            var confObj = self.dialog.getLayout().getRegion('south') ?
                          {x: self.dialog.el.getX() + 125, y: self.dialog.el.getY() + 140}
                    : null;
            self.showChangeNick(room, confObj);
        });
    },

   /* showChangeNick: function(roomObj, confObj) {
        var self = this;
        confObj = $H(confObj).merge({
            title: "Change Nickname",
            width: 285, height: 105,
            templateKeys: {nick: ''}
        });
        var renamer = new jive.spank.chat.Dialog(self,
                jive.spank.chat.Template.rename,
                confObj
                );
        renamer.dialog.show();
        var doChange = function() {
            self.fireEvent("changenameinmuc", self, roomObj.jid, $F(renamer.id + '-name'));
            renamer.dialog.hide();
        };
        getEl(renamer.id + '-name').mon("keypress",
                doChange.createInterceptor(function(evt) {
                    return evt.getKey() == 13;
                }));
        getEl(renamer.id + '-rename').addListener("click", doChange);
        getEl(renamer.id + '-name').dom.focus();
    },*/

    showMUCPassword: function(roomObj, confObj, passwordCallback) {
        confObj = $H(confObj).merge({
            title: "Enter the password for '" + roomObj.name + "'",
            width: 285, height: 105
        });
        var keymasta = new jive.spank.chat.Dialog(this,
                jive.spank.chat.Template.mucpassword,
                confObj
                );
        keymasta.dialog.show();

        var self = this;
        var called = false;
        var doSecret = function() {
            var password = $F(keymasta.id + '-passwd');
            passwordCallback(password);
            called = true;
            keymasta.dialog.hide();
        };
        keymasta.dialog.addListener('hide', function() {
            if (!called) {
                passwordCallback(null);
            }
        });
        getEl(keymasta.id + '-passwd').mon("keypress",
                doSecret.createInterceptor(function(evt) {
                    return evt.getKey() == 13;
                }));
        getEl(keymasta.id + '-sendsecret').addListener("click", doSecret);
        getEl(keymasta.id + '-passwd').dom.focus();
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
            var mentioned = (msgObj.mentioned ? "mentioned" : "");
			var body = jive.spank.chat.Filter.applyAll(msgObj.body);
            var newElm = jive.spank.chat.Template.message.append(msgframe.id,
            {from: from, message: body, type: type, mentioned: mentioned, time: msgObj.time, msgclass: timecls});
        }
        else {
            msgframe.dom.appendChild(msgObj.el);
            msgObj.callback(this);
        }

        this._scrollMessageHistory(msgframe);

        var testjid = jive.spank.chat.ChatWindow.focusedJID;
        if (testjid != jid) {
            this.addNotification(jid);
        }
    },
    addStatusMessage: function(jid, message) {
        var msgframe = getEl("jive-tab-" + jid + "-history");

        var newElm = jive.spank.chat.Template.statusMessage.append(msgframe.id, {message: message});

        this._scrollMessageHistory(msgframe);
    },

    _scrollMessageHistory: function(histElm) {
        histElm.dom.parentNode.scrollTop = histElm.getHeight()
                - histElm.dom.parentNode.clientHeight;
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

		if(thistab && thistab.textEl)
			thistab.textEl.addClass('jive-notify');

        // make sure there is an interval for this window
        if (this.notificationInterval && !this.notificationInterval[jid]) {
            var bodyId = this.bodyId;
            this.notificationInterval = window.setInterval(function() {
                getEls('#' + bodyId + ' span.jive-notify').toggleClass('flashNotify');
            }, 1000);
        }
        else {
            getEls('#' + this.bodyId + ' span.jive-notify').addClass('flashNotify');
        }
        // and the browser window too
        jive.spank.notifier.doTitleNotify();

		if(thistab && thistab.text) {
			if (/ \(\d+\)$/.test(thistab.text)) {
				thistab.setText(thistab.text.replace(/ \(\d+\)$/, ''));
			}
			thistab.setText(thistab.text + " (" + this.newMessages[jid] + ")");
		}
    },

/**
 * Clears any notifications currently operating on the tab for a particular JID
 *
 * @param {String} jid the jid to clear the notifications for.
 */
    clearNotification: function(jid) {
        var thetab = this.getTabByJID(jid);
        if (thetab && thetab.textEl) {
            thetab.textEl.removeClass('jive-notify').removeClass('flashNotify');
            thetab.setText(thetab.text.replace(/ \(\d+\)$/, ''));
        }
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
        var thetab = this.getTabs() ? this.getTabs().active : this._tabIfSingleTab();
        var currTabId = thetab.id.split("-");
        currTabId[3] = "text";
        var currTextArea = currTabId.join("-");
        return getEl(currTextArea).dom.value;
    },
    getActiveTabJID: function() {
        var thetab = this.getTabs() ? this.getTabs().active : this._tabIfSingleTab();
        return thetab.id.split("-")[2];
    },
    getTabJID: function(id) {
        var thetab = this.getTabs() ? this.getTabs().getTab(id) : this._tabIfSingleTab();
        return thetab.id.split("-")[2];
    },
/**
 * Returns all of the tabs of this chat window.
 */
    getTabs: function() {
        var regions = this.dialog.getLayout().regions;
        return regions["center"].getTabs();
    },

/**
 * Takes a JID and returns the tab for the jid.
 *
 * @param {String} jid the jid for which to return the tab
 */
    getTabByJID: function(jid) {
        var guys = this.getTabs();
        if (guys != null) {
            var tabb = guys.items['jive-tab-' + jid + '-layout'];
            return (typeof tabb == 'undefined') ? null : tabb;
        }
        else {
            return this._tabIfSingleTab();
        }
    },

    _tabIfSingleTab: function() {
        return this.dialog.getLayout().regions["center"].panels.items[0];
    },

/**
 * Removes all of the tabs from this window.
 */
    removeAllTabs: function() {
        //return;
        var tabs = this.getTabs();
        if (!tabs) {
            return;
        }
        for (var i = tabs.getCount() - 1; i >= 0; i--) {
            tabs.getTab(i).closeClick();
        }
        delete this.tabs;
        this.tabs = {};
    },

    destroy: function() {
        this.clearAllNotifications();
        jive.spank.chat.ChatWindow.superclass.destroy.call(this);
        delete this.tabs;
    },

    hide: function() {
        this.clearAllNotifications();

        jive.spank.chat.ChatWindow.superclass.hide.call(this);
    },

/**
 * Creates tab in this window for the specified contact or JID.
 *
 * @param {jive.spank.chat.Contact/String} either a Contact object (or fakey
 * version with name and jid properties) or a jid.
 */
    getContactTab: function(contactObj, focus) {
        if (typeof contactObj == 'string') {
            // we were just passed a jid, compensate
            var jid = contactObj;
            contactObj = {name: jid, jid: jid};
        }

        var thetabs = this.getTabs();
        var convo;
        if (thetabs) {
            convo = thetabs.getTab("jive-tab-" + contactObj.jid + "-layout");
        }
        if (typeof convo == 'undefined') {
            this.addTab(contactObj);
        }
        if (focus) {
            this.focusContactTab(contactObj);
        }
    },

    focusContactTab: function (contactObj) {
        var thetabs = this.getTabs();
        thetabs.activate("jive-tab-" + contactObj.jid + "-layout");
        var textArea = getEl("jive-tab-" + contactObj.jid + "-text");
        textArea.dom.focus();
    },

    prepUserPane: function() {
        // assumes presence of an east pane on the main dialog's layout, which in turn contains at least one pane! beware
        var layout = this.dialog.getLayout().getRegion("east").getPanel(0).getLayout();
        jive.spank.chat.Template.userpane.append(this.bodyId + '-toppane', {id: this.bodyId});
        this.dialog.beginUpdate();
        var header = new YAHOO.ext.ContentPanel(this.bodyId + '-toppane');
        layout.add('north', header);
        header.getEl().dom.parentNode.className += " jive-user-controls";
        this.dialog.endUpdate();
    },

    finalizeUserPane: function(uname) {
        jive.spank.chat.Template.userpane_loggedin.append(this.bodyId + '-message', {id: this.bodyId, uname: uname});

		//this lets us style the username field based on whether the user has clicked on it to edit.
		var input = getEl(this.bodyId + '-uname');
		var inputfield = input.dom;
        var setEditing = function() { 
        	this.className = this.className.replace("jive-muc-username", "jive-muc-username-active");
        }.bind(inputfield);
        
        var setNotEditing = function() {
        	this.className = this.className.replace("jive-muc-username-active", "jive-muc-username");
        }.bind(inputfield);
        
        // add changenick behavior
        var change = function(evt) {
            if(evt.keyCode == 13 || evt.type == "blur") {
                var jidFromId = this.tabId.split("-")[2];
                var room = this.tabs[jidFromId].room;
                this.fireEvent("changenameinmuc", this, room.jid, getEl(this.bodyId + '-uname').dom.value);
                setNotEditing();
            }
        };
        getEl(this.bodyId + '-uname').addListener('keydown', change.bind(this));
        //resize stuff disabled for now.
//        var resizeHandler = input.fitToParent.createDelegate(input);

       // this.dialog.addListener("resize", resizeHandler);

        inputfield.onfocus = setEditing;
        inputfield.onblur = change.bind(this);
        //XXX: this is a hack to get around the fact that it's too early. We should figure out where it really goes.
        //Without it, the text entry box is too large until you resize the window.
       // window.setTimeout(resizeHandler, 1000);
    },

/**
 * Sets the subject line on MUC tabs. JID is optional in embedded-group-chat situations.
 *
 * @param {String} subject the subject line to display
 * @param {String} roomJid optional JID for the MUC tab in question
 */
    setSubject: function(subject, roomJid) {
        var subjElm = getEl((this.tabId ? this.tabId : "jive-tab-" + roomJid) + '-subject');
        if (subjElm && subjElm.dom) {
            subjElm.dom.innerHTML = subject;
        }
    }

});

jive.spank.chat.ChatWindow.getWindow = function(windowId) {
    return jive.spank.chat.ChatWindow.currentWindow[windowId];
}

jive.spank.chat.ChatWindow.createWindow = function() {
    var component = spank.loadComponent("chat");
    jive.spank.chat.ChatWindow.currentWindow[component.id] = component;
    component.dialog.addListener("hide", function() {
        delete jive.spank.chat.ChatWindow.currentWindow[component.id];
    });
    return component;
}

jive.spank.chat.ChatWindow.destroyWindow = function(windowId) {
    if (jive.spank.chat.ChatWindow.currentWindow[windowId]) {
        jive.spank.chat.ChatWindow.currentWindow[windowId].hide();
        delete jive.spank.chat.ChatWindow.currentWindow[windowId];
    }
}

jive.spank.chat.ChatWindow.tabConfObject = {
    north: {
        initialSize: 72
    },
    south: {
        split: true,
        initialSize: 50,
        minSize: 50,
        maxSize: 200,
        autoScroll: false,
        collapsible: true
    },
    center: {
        autoScroll: true
    }
};
jive.spank.chat.ChatWindow.chooseMUCConfObject = {
    north: {
        initialSize: 50
    },
    center: {
        autoScroll: true
    }
};

jive.spank.chat.ChatWindow.mucSidebarConfObject = {
    north: {
        initialSize: 38,
        margins: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 10
        }
    },
    center: {
        initialSize: 50,
        minSize: 50,
        maxSize: 200,
        autoScroll: true,
        collapsible: true
    }
};

jive.spank.chat.ChatWindow.mucConfObject = {
    north: {
        initialSize: 38,
        margins: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 10
        }
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

jive.spank.roster.RosterWindow = function(id, attributes) {
    var width = attributes["width"] ? attributes["width"] : 310;
    var height = attributes["height"] ?
                 attributes["height"] :
                 YAHOO.util.Dom.getViewportHeight() - 40;
    var x = attributes["x"] ? attributes["x"] : YAHOO.util.Dom.getViewportWidth() - 330;
    var y = attributes["y"] ? attributes["y"] : 20;
    var resizable = attributes["resizable"] != "false";
    var draggable = attributes["draggable"] != "false";
    var closable = attributes["closable"] != "false";

    this.roster = null;
    // set in setRoster
    this.groups = null;
    // ditto

    this.controls = {};
    this.controlCount = 0;

    var conf = {
        modal: false,
        width: width,
        height: height,
        resizable: resizable,
        draggable: draggable,
        proxyDrag: true,
        shadow: false,
        minWidth: 200,
        minHeight: 150,
        x: x,
        y: y,
        closable: closable,
        shim: false,
        north: {
            initialSize: 50,
            autoScroll: false
        },
        center: {
            closeOnTab: true,
            alwaysShowTabs: false,
            autoTabs: true
        }
    };
    this.events = {
    /**
     * @event changestatus
     * User picks a status from the menu or from the Set Status Msg dialog.
     * @param {jive.spank.roster.Roster} roster this roster window
     * @param {String} mode string representing the mode: 'chat', 'available', 'away', 'dnd'
     * @param {String} status optional status message
     */
        'changestatus': true,
    /**
     * @event setstatusmsgrequest
     * Request for the Set Status Msg dialog.
     * @param {jive.spank.roster.RosterWindow} roster this roster window
     */
        'setstatusmsgrequest': true,
    /**
     * @event addcontact
     * Hey, the user would like to add somebody.
     * @param {jive.spank.roster.RosterWindow} roster this roster window
     * @param {String} jid supposedly a valid JID!
     * @param {String} name the name by which the user wishes to remember this JID
     * @param {String} group the (uncleaned, unmolested) name of a group to add to
     */
        'addcontact': true,
    /**
     * @event acceptsubscription
     * User has decided to let someone add them.
     * @param {jive.spank.roster.RosterWindow} roster this roster window
     * @param {Boolean} addReciprocal true if we should add them as well
     * @param {String} jid JID of the subscriber
     * @param {String} nickname the nickname by which to add the subscriber
     * @param {String} group the (uncleaned, unmolested) name of the group to add to
     */
        'acceptsubscription': true,
        'denysubscription': true,
    /**
     * @event renamecontact
     * Hey, the user would like to rename somebody.
     * @param {jive.spank.roster.RosterWindow} roster this roster window
     * @param {jive.spank.roster.Contact} contact a contact object
     * @param {String} name the new name to change to
     */
        'renamecontact': true,
    /**
     * @event renamegroup
     * Hey, the user would like to rename an entire group.
     * @param {jive.spank.roster.RosterWindow} roster this roster window
     * @param {jive.spank.roster.RosterGroup} group a group object
     * @param {String} name the new name to change to
     */
        'renamegroup': true,
    /**
     * @event removecontact
     * Remove this contact from the roster pls
     * @param {jive.spank.roster.RosterWindow} roster this roster window
     * @param {jive.spank.roster.Contact} contact a contact object
     */
        'removecontact': true,
    /**
     * @event removegroup
     * Remove this group and ALL of its contacts
     * @param {jive.spank.roster.RosterWindow} roster this roster window
     * @param {jive.spank.roster.RosterGroup} group a group object
     */
        'removegroup': true,
        'close': true
    };
    jive.spank.roster.RosterWindow.superclass.constructor.call(this, id, "Spark Web", conf);

    var layout = this.dialog.getLayout();
    this.dialog.beginUpdate();
    layout.add('north', new YAHOO.ext.ContentPanel(this.bodyId + '-toppane'));
    this.dialog.endUpdate();

    this.dialog.close.removeAllListeners();
    this.dialog.close.addListener('click', function() {
        if (confirm("Are you sure you want to close the connection?\n('OK' to logout, 'Cancel' to stay connected.)")) {
            this.dialog.hide();
            this.fireEvent('close', this);
        }
    }.bind(this));

    this._prepContextMenus();
    //	YAHOO.ext.EventManager.onWindowResize(function(width,height){
    //		this.dialog.moveTo(width - (this.dialog.body.getWidth() + 20), 20);
    //	}, this, true);
};

YAHOO.extend(jive.spank.roster.RosterWindow, jive.spank.Window, {
    needsUpdate: false,
    addTab: function(title) {
        var tabId = YAHOO.util.Dom.generateId();
        jive.spank.chat.Template.rostertab.append(this.bodyId, {tabId: tabId});
        var layout = this.dialog.getLayout();

        this.dialog.beginUpdate();

        var innerLayout = new YAHOO.ext.BorderLayout(tabId + "-layout", {
            north: {
                split: false,
                initialSize: 28,
                autoScroll: false
            },
            center: {
                autoScroll: true
            }
        });

        innerLayout.add('center', new YAHOO.ext.ContentPanel(tabId + '-resources'));
        jive.spank.chat.Template.roster.append(tabId + '-resources',
        {rosterId: 'jive-roster', groups: ''});
        innerLayout.add('north', new YAHOO.ext.ContentPanel(tabId + '-user'));
        jive.spank.chat.Template.control_panel.append(tabId + '-user',
        {tabId: tabId});

        this.controlPanel = innerLayout.regions['north'];
        this.controlPanel.hide();

        layout.add('center', new YAHOO.ext.NestedLayoutPanel(innerLayout, {title: title}));
        this.dialog.endUpdate();

        this.tabs[title] = tabId;
    },

    _prepUserStatusPanel: function(username, userStatus) {
        var elm = getEl(this.bodyId + '-toppane');
        jive.spank.chat.Template.status_panel.append(elm.id, {
            bodyId: this.bodyId,
            username: username,
            status: userStatus,
            statusName: userStatus.toLowerCase()
        });

        var statMenu = new YAHOO.widget.Menu("jive-statusmenu");
        statMenu.addItems([
                [
                {text: "Free to Chat"},
                {text: "Available"},
                {text: "On The Road"},
                {text: "Away"},
                {text: "On Phone"},
                {text: "Do Not Disturb"}
                        ],
                [
                {text: "Set status message...", disabled: true}
                        ]
                ]);
        statMenu.render(document.body);

        var self = this;
        var fireChangeStatus = function(eventType, eventArr, statusStr) {
            this.fireEvent("changestatus", this, statusStr);
        };
        var fireSetStatusMsg = function() {
            self.fireEvent("setstatusmsgrequest", self);
        };

        var menuItem;
        var statii = ['chat','available','onroad','away','onphone','dnd'];
        for (var i = 0; i < 6; i++) {
            menuItem = statMenu.getItem(i);
            menuItem.element.className += ' roster-contact-' + statii[i];
            menuItem.clickEvent.subscribe(fireChangeStatus, statii[i], self);
        }
        //statMenu.getItem(6).clickEvent.subscribe(fireSetStatusMsg);

        getEl(this.bodyId + '-statusmenu-ctrl').addListener('click', function() {
            getEl(statMenu.element).alignTo(this, 'bl');
            statMenu.element.style.zIndex = self.dialog.lastZIndex + 1;
            statMenu.show();
        });

        // dragging windows doesn't hide the menu! let's fix that
        var hideStatus = function() {
            statMenu.hide();
        };
        this.dialog.header.addListener('click', hideStatus);
        for (var chawin in jive.spank.chat.ChatWindow.currentWindow) {
            jive.spank.chat.ChatWindow.currentWindow[chawin].dialog.header.addListener('click', hideStatus);
            // will only work on windows open at the time... hmm
            // i'll live with that
        }
    },

    _prepContextMenus: function() {
        if (!getEl("contact-conmenu")) {
            this.addMenuDiv("contact-conmenu");
        }

        this.contactMenu = new YAHOO.widget.Menu("contact-conmenu", {lazyLoad: true});
        if (this.contactMenu.getItemGroups().length == 0) {
            this.contactMenu.addItems([
            {text: "Start Chat"},
            {text: "Rename Contact"},
            {text: "Remove Contact"}
                    ]);
            this.contactMenu.render(document.body);
        }

        var self = this;
        var doChatFor = function(type, args) {
            self.contactMenu.clickedContact.group._roster.fireEvent("contactdblclicked",
                    self.contactMenu.clickedContact.group._roster, self.contactMenu.clickedContact
                    );
        };
        this.contactMenu.getItem(0).clickEvent.subscribe(doChatFor);
        this.contactMenu.getItem(1).clickEvent.subscribe(
                this.showRename.createDelegate(this, [self.contactMenu.clickedContact]), this);
        this.contactMenu.getItem(2).clickEvent.subscribe(
                this.showRemove.createDelegate(this, [self.contactMenu.clickedContact]), this);

        /* and now, groups */
        if (!getEl("group-conmenu")) {
            this.addMenuDiv("group-conmenu");
        }

        this.groupMenu = new YAHOO.widget.Menu("group-conmenu", {lazyLoad: true});
        if (this.groupMenu.getItemGroups().length == 0) {
            this.groupMenu.addItems([
            {text: "Rename Group"},
            {text: "Remove Group"}
                    ]);
        }
        this.groupMenu.render(document.body);

        this.groupMenu.getItem(0).clickEvent.subscribe(
                this.showGroupRename.bind(this, this.fetchClickedGroup.bind(this)));
        this.groupMenu.getItem(1).clickEvent.subscribe(
                this.showGroupRemove.bind(this, this.fetchClickedGroup.bind(this)));
    },

    setUserInfo: function(user, userMode) {
        // looking for the keys 'name' and either 'status' or 'mode'.
        // that's if user is an obj.
        var userName;
        if (arguments.length > 1) {
            userName = user;
        }
        else {
            userName = user.name;
            userMode = (user.status ? user.status : user.mode);
        }
        this.dialog.setTitle("Spark Web - " + userName);
        this._prepUserStatusPanel(userName, userMode);
    },

    addGroup: function(groupName, groupObj) {
        this.roster.addGroup(groupName, groupObj);
    },

    addControl: function(ctrlTitle, confObj) {
        // this method continues to assume one rosterwindow tab named 'Contacts'

        // make control obj
        this.controls[ctrlTitle] = jive.spank.chat.Control.add(
                this.tabs['Contacts'] + '-controls',
                ctrlTitle,
                confObj
                );

        this.controlCount++;

        if (!this.controlPanel.isVisible()) {
            this.controlPanel.show();
        }

        return this.controls[ctrlTitle];
    },

    removeControl: function(ctrlTitle) {
        if (this.controls[ctrlTitle]) {
            this.controls[ctrlTitle].remove();
            delete this.controls[ctrlTitle];
        }
        this.controlCount--;
    },

    setRoster: function(rosterObj) {
        if (rosterObj == null) {
            rosterObj = this.fakeRosterStruct;
        }

        this.roster = new jive.spank.roster.Roster('jive-roster', true);
        this.groups = this.roster.groups;

        this.roster.setRoster(rosterObj);
        this.render();

        this.roster.addListener('offlinemoved', function() {
            if (!this.isUpdating) {
                this.render(true);
            }
            else {
                this.needsUpdate = true;
            }
        }, this, 1);
    },

/**
 * Returns contact obj for the currently selected contact.
 */
    getSelectedUser: function() {
        return this.roster.getSelectedUser();
    },

/**
 * Less elegant but more flexible way of finding contact objects: feed it the LI's ID.
 */
    getContactFromID: function(idStr) {
        var parts = idStr.split('-');
        var cJid = parts.slice(2, parts.length - 1).join('');
        // in case of jids with dashes
        return jive.spank.roster.Contact.find(this, cJid, parts[parts.length - 1]);
    },

/**
 * Draws HTML once the groups property is populated. Rewrites roster HTML entirely.
 */
    render: function(forceNow) {
        var tabId = this.tabs["Contacts"];

        this.roster.render();
        this.needsUpdate = false;

        // now that they exist:
        this.dialog.addListener("show", this.finishDisplay, this, true);
        if (forceNow) {
            this.finishDisplay();
        }
    },

    finishDisplay: function() {
        this.roster.sortGroups();
        this.roster.renderOffline();
        this.roster._enableBehaviors();
        this.enableContextMenus();
    },

    enableContextMenus: function() {
        getEls("ul#jive-roster ul.group-list li").mon('contextmenu', function(evt) {
            evt.stopEvent();
            var menutarget = evt.getTarget();
            if (menutarget.tagName.toLowerCase() != "li") {
                menutarget = menutarget.parentNode;
                // if more stuff goes into contact HTML this may break
            }
            this.contactMenu.clickedContact = this.getContactFromID(menutarget.id);

            // select the element
            var damnbug = menutarget.id;
            getEls('ul.jive-roster ul.group-list li').removeClass('selected');
            document.getElementById(damnbug).className += " selected";

            getEl(this.contactMenu.element).moveTo(evt.getPageX(), evt.getPageY());
            this.contactMenu.element.style.zIndex = this.dialog.lastZIndex + 1;
            this.contactMenu.show();
        }, this, true);

        getEls("ul#jive-roster span.group-isonline em").mon('contextmenu', function(evt) {
            evt.stopEvent();
            var menutarget = evt.getTarget();
            this.groupMenu.clickedGroup = this.groups[menutarget.innerHTML];

            getEl(this.groupMenu.element).moveTo(evt.getPageX(), evt.getPageY());
            this.groupMenu.element.style.zIndex = this.dialog.lastZIndex + 1;
            this.groupMenu.show();
        }, this, true);
        try {
            getEls("li#group-Offline_Group-jive-roster span.group-label em").mon('contextmenu',
                    function(evt) {
                        evt.stopEvent();
                    });
        }
        catch(error) {
            /* do nothing, while not an ideal situation, if it works, it works. */
        }
    },

    addContact: function(contact, groupName, group) {
        this.roster.addContact(contact, groupName, group);
        this.render(true);
    },

/**
 * Deletes all traces of specified contact
 */
    removeContact: function(jid) {
        this.roster.removeContact(jid);
    },

    changeUserStatus: function(newMode, newStatus) {
        var menu = getEl(this.bodyId + '-statusmenu-ctrl');
        var fullModeStrs = {
            chat: "Free to Chat",
            available: "Available",
            onroad: "On Road",
            away: "Away",
            onphone: "On Phone",
            dnd: "Do Not Disturb"
        };

        menu.dom.className = menu.dom.className.replace(
                /roster-contact-([^ ]*)/, 'roster-contact-' + newMode);
        menu.getChildrenByTagName('span')[0].dom.innerHTML = (
                newStatus != null ? newStatus : fullModeStrs[newMode]);
    },

    changeContactStatus: function(jid, newMode, newStatus) {
        this.roster.changeContactStatus(jid, newMode, newStatus);
    },

    getContactStatus: function(jid) {
        return this.roster.getContactStatus(jid);
    },

    showAddGroup: function() {
        var self = this;
        var addg = new jive.spank.chat.Dialog(self,
                jive.spank.chat.Template.add_group,
        {title: "Add Group", width: 280, height: 140, yOffset: 125}
                );
        addg.dialog.show();

        // wire up the go button
        getEl(addg.id + '-creategroup').addListener('click', function() {
            // submit info
            self.fireEvent('addgroup', self, $F(addg.id + '-addgroupname'));
            addg.dialog.hide();
        });
    },

    showAddContact: function() {
        var self = this;
        var addc = new jive.spank.chat.Dialog(self,
                jive.spank.chat.Template.add_contact,
        {title: "Add Contact", width: 280, height: 155}
                );
        addc.dialog.show();

        this._autocompGroups(addc, '-addcontact-group');

        $(addc.id + '-addusername').focus();

        // finally, wire up the buttons
        getEl(addc.id + '-createcontact').addListener('click', function() {
            // submit info
            self.fireEvent('addcontact', self,
                    $F(addc.id + '-addusername'),
                    $F(addc.id + '-addnickname'),
                    $F(addc.id + '-addcontact-group')
                    );
            addc.dialog.hide();
        });
    },

    showSubscriptionRequest: function(subscriberJid, subscriberNick) {
        var self = this;
        var subr = new jive.spank.chat.Dialog(self,
                jive.spank.chat.Template.sub_request,
        {title: "Allow " + (subscriberNick != '' ? subscriberNick : subscriberJid) + " to add you?",
            width: 440, height: 220,
            templateKeys: {jid: subscriberJid, nick: subscriberNick} }
                );
        subr.dialog.show();

        this._autocompGroups(subr, '-subrequest-group');

        // wire up the actions
        getEl(subr.id + '-add').addListener('click', function() {
            // toggle style on labels
            getEls('#' + subr.id + ' label').toggleClass('disabled');
            getEl(subr.id + '-jid').toggleClass('disabled');
            // toggle enabled on fields
            getEl(subr.id + '-nick').dom.disabled = getEl(subr.id + '-subrequest-group').dom.disabled =
                                                    !getEl(subr.id + '-add').dom.checked;
        });
        getEl(subr.id + '-acceptsubrequest').addListener('click', function() {
            // submit info
            self.fireEvent('acceptsubscription', self,
                    $F(subr.id + '-add'),
                    subscriberJid,
                    $F(subr.id + '-nick'),
                    $F(subr.id + '-subrequest-group')
                    );
            subr.dialog.hide();
        });
        getEl(subr.id + '-denysubrequest').addListener('click', function() {
            // submit info
            self.fireEvent('denysubscription', self,
                    $F(subr.id + '-add'),
                    subscriberJid,
                    $F(subr.id + '-nick'),
                    $F(subr.id + '-subrequest-group')
                    );
            subr.dialog.hide();
        });
    },

    showRename: function(contactOrGrpObj) {
        if (contactOrGrpObj == null) {
            contactOrGrpObj = this.contactMenu.clickedContact;
        }

        var renamer = new jive.spank.chat.Dialog(self,
                jive.spank.chat.Template.rename,
        {title: "Renaming '" + contactOrGrpObj.name + "'",
            width: 250, height: 115,
            templateKeys: {nick: contactOrGrpObj.name} }
                );
        renamer.dialog.show();

        var self = this;
        var doRename = function() {
            var eventtofire = (typeof contactOrGrpObj.jid != 'undefined') ? 'renamecontact' : 'renamegroup';
            self.fireEvent(eventtofire, self, contactOrGrpObj, $F(renamer.id + '-name'));
            getEl(renamer.id + '-rename').removeAllListeners();
            renamer.dialog.hide();
        };
        getEl(renamer.id + '-name').mon("keypress",
                doRename.createInterceptor(function(evt) {
                    return evt.getKey() == 13;
                }));
        getEl(renamer.id + '-rename').addListener("click", doRename);
    },

    showRemove: function(contactObj) {
        // actually don't show anything
        this.fireEvent("removecontact", this, this.contactMenu.clickedContact.jid.toString());
    },

    showGroupRename: function(grpGetterFunc) {
        var grpObj = grpGetterFunc();
        this.showRename(grpObj);
    },
    fetchClickedGroup: function() {
        // this is always the func passed into the above,
        // so we can get the clicked group in realtime rather than at bind time.
        return this.groupMenu.clickedGroup;
    },

    showGroupRemove: function(grpFunc) {
        var grpObj = grpFunc();
        // same deal as above
        var safety = new jive.spank.chat.Dialog(this,
                jive.spank.chat.Template.remove_group,
        {title: "Removing '" + grpObj.name + "'",
            width: 250, height: 100,
            templateKeys: {name: grpObj.name} }
                );
        safety.dialog.show();

        var self = this;
        var doRemove = function() {
            self.fireEvent("removegroup", self, grpObj);
            getEl(safety.id + '-remove').removeAllListeners();
            safety.dialog.hide();
        };
        getEl(safety.id + '-remove').addListener("click", doRemove);
    },

    _autocompGroups: function(dlog, fieldIdSuffix) {
        var fieldId = dlog.id + fieldIdSuffix;
        var conMenuId = fieldId + '-menu';
        var self = this;

        if (getEl(conMenuId) == null) {
            var conMenu = self.addMenuDiv(conMenuId);
            conMenu.className = "groups-ac";
        }

        var groupsFunc = function(query) {
            var justalist = [];
            for (var g in self.roster.groups) {
                justalist.push(g);
            }
            return self._prepareAutocompArray(justalist, query);
        };

        var grpAutoComp = new jive.spank.FlatAutoComplete(fieldId,
                conMenuId,
                new YAHOO.widget.DS_JSFunction(groupsFunc),
        {typeAhead: true, minQueryLength: 0}
                );
        grpAutoComp.formatResult = function(oResultItem, sQuery) {
            return oResultItem;
        };
        grpAutoComp.dataReturnEvent.subscribe(function(type, args) {
            if (args[2].length == 0) { // group results empty
                grpAutoComp.setBody("<div class='empty'>(No matches, will create new)</div>");
            }
            var thelm = getEl(conMenuId);
            thelm.alignTo(getEl(fieldId), 'bl');
            thelm.dom.style.zIndex = dlog.dialog.lastZIndex + 1;
            thelm.show();
        });

        getEl(fieldId).addListener('blur', function() {
            getEl(conMenuId).hide();
        });
        /* addListener('focus',function(){
              var thegroups = groupsFunc();
              if (this.dom && this.dom.value == '') {
                  grpAutoComp._populateList('', thegroups, grpAutoComp);
              }
          }). */

        getEls('#' + conMenuId + ' li').mon('mousedown', function(evt) {
            getEl(fieldId).dom.value = evt.getTarget().innerHTML;
        });

        dlog.dialog.addListener('beforehide', function() {
            grpAutoComp.formatResult = Prototype.emptyFunction;
            groupsFunc = Prototype.emptyFunction;
            getEl(conMenuId).removeAllListeners();
            getEl(fieldId).removeAllListeners();
            grpAutoComp.dataReturnEvent.unsubscribeAll();
            getEls('#' + conMenuId + ' li').removeAllListeners();
            getEl(conMenuId).remove();
        });

        return grpAutoComp;
    },

    contactsForAutocomp: function(query) {
        var roster = this.roster;
        var autocompstruct = [];

        for (var g in roster.groups) {
            roster.groups[g].contacts.each(function(ctact) {
                autocompstruct.push([ctact.name, ctact.jid, ctact.status]);
            });
        }
        return this._prepareAutocompArray(autocompstruct, query);
    },

    _prepareAutocompArray: function(results, query) {
        var resultIsArray = typeof results[0] != 'string';

        if (resultIsArray && results.length == 0) {
            return results;
        }

        results = results.sortBy(function(result) {
            if (resultIsArray) {
                return result[0].toLowerCase();
            }
            else {
                return result.toLowerCase();
            }
        });

        if (results.length < 2 || !query || query == '') {
            return results;
        }
        else {
            var frontandback = results.partition(function(result) {
                return (resultIsArray ? result[0].indexOf(query) == 0 : result.indexOf(query) == 0);
            });
            return frontandback[0].concat(frontandback[1]);
        }
    },

    addMenuDiv: function(divId) {
        var menushell = document.createElement('div');
        menushell.id = divId;
        menushell.style.visibility = 'hidden';
        document.body.appendChild(menushell);
        return menushell;
    },
    endUpdate: function() {
        if (this.needsUpdate) {
            this.render(true);
        }
        jive.spank.roster.RosterWindow.superclass.endUpdate.call(this);
    },
    destroy: function() {
        jive.spank.roster.RosterWindow.superclass.destroy.call(this);
    }
});

jive.spank.chat.Dialog = function(parentWindow, template, configuration) {
    this.parentWindow = parentWindow;

    var elm = document.createElement('div');
    this.id = elm.id = YAHOO.util.Dom.generateId();
    document.body.appendChild(elm);

    var constrained = !configuration.constrained;
	jive.spank.chat.Dialog.superclass.constructor.call(this, elm.id, {
        title: configuration.title,
        modal: configuration.modal,
        constraintoviewport: constrained,
        width: configuration.width,
        height: configuration.height,
        shadow: true,
        proxyDrag: true,
        resizable: false,
        draggable: true,
        x: configuration.x ? configuration.x : (YAHOO.util.Dom.getViewportWidth() / 2)
                - (configuration.width > 0 ? (configuration.width / 2) : 0),
        y: configuration.y ? configuration.y : (YAHOO.util.Dom.getViewportHeight() / 2)
                - (configuration.height > 0 ? configuration.height / 2 : 0),
        closable: true
    });
    this.dialog = this;

    if (configuration.templateKeys) {
        var templateKeys = configuration.templateKeys;
        templateKeys.id = this.id;
        template.append(this.body.dom, templateKeys);
    }
    else {
        template.append(this.body.dom, {id: this.id});
    }

    getEls('#' + this.id + ' .jive-closedialog').addListener('click', this.hide.bind(this));
    this.addListener('hide', this.destroy.bind(this));
};

YAHOO.extend(jive.spank.chat.Dialog, YAHOO.ext.BasicDialog, {
	destroy: function() {
		jive.spank.chat.Dialog.superclass.destroy(this, true);
        this.proxy.remove();
        this.shadow.remove();
        if (this.mask) {
            this.mask.remove();
        }
		this.purgeListeners();
	}
});

jive.spank.dialog = {};

jive.spank.dialog.StartChat = function(callback) {
    var chatDlog = new jive.spank.chat.Dialog(this,
            jive.spank.chat.Template.start_chat,
    {title: "Start a chat",
        width: 250, height: 105 }
            );
    chatDlog.dialog.show();

    var startChat = function() {
        var thejid = $F(chatDlog.id + '-jid');
        if (thejid.replace(/^\s+|\s+$/g, '') != '') {
            callback(this, {jid: thejid});
            getEl(chatDlog.id + '-startbtn').removeAllListeners();
            chatDlog.dialog.hide();
        }
        else {
            $(chatDlog.id).focus();
        }
    };
    $(chatDlog.id + '-jid').focus();
    getEl(chatDlog.id + '-startbtn').addListener("click", startChat);
};

jive.spank.dialog.CreateConference = function(parentWindow, configuration) {
	if(!configuration) {
		configuration = {};
	}
	configuration = $H(configuration).merge(this._configuration);
	jive.spank.dialog.CreateConference.superclass.constructor.call(this, parentWindow,
		jive.spank.chat.Template.muccreation, configuration);
	this.events = $H(this.events).merge({
		"muccreated": true
	});
	this.addListener("hide", this.onHide.bind(this));
	getEl(this.id + '-private').addListener('click', this._privateCheckboxListener.bind(this));
	getEl(this.id + '-createroom').addListener('click', this._createRoomListener.bind(this));
};

YAHOO.extend(jive.spank.dialog.CreateConference, jive.spank.chat.Dialog, {
	_configuration: {
            title: "Create a Conference",
            width: 285, height: 285
	},
	_createRoomListener: function() {
		var privflag = getEl(this.id + '-private');
		var thingOne = $F(this.id + '-roompw');
		var thingTwo = $F(this.id + '-roomconfirm')
		if (privflag.dom.checked && thingOne != thingTwo) {
			alert("Sorry, your password and confirmation don't match.");
			$(this.id + '-roompw').select();
			return false;
		}
		this.fireEvent("muccreated", this, this.getValues());
	},
	_privateCheckboxListener: function() {
		// toggle style on labels
		getEls('#' + this.id + ' .fieldset label').toggleClass('disabled');
		// toggle enabled on fields
		getEl(this.id + '-roompw').dom.disabled = getEl(this.id + '-roomconfirm').dom.disabled =
			!getEl(this.id + '-private').dom.checked;
	},
	focus: function() {
		getEl(this.id + '-roomname').dom.focus();
	},
	getValues: function() {
		return {
			name: $F(this.id + '-roomname'),
			topic: $F(this.id + '-roomtopic'),
			isPermanent: $(this.id + '-permanent').checked,
			isPrivate: $(this.id + '-private').checked,
			password: $F(this.id + '-roompw'),
			confirmPassowrd: $F(this.id + '-roomconfirm')
		};
	},
	onHide: function() {
		getEl(this.id + '-private').removeAllListeners();
		getEl(this.id + '-createroom').removeAllListeners();
	}
});

jive.spank.dialog.UserSearch = function(parentWindow, searchForm, configuration) {
    if (!configuration) {
        configuration = {};
    }
    configuration.templateKeys = {
        instructions: 'Insert your instructions here.'
    }
    configuration = $H(configuration).merge(this._configuration);
    var template = this._createTemplate(searchForm);
    jive.spank.dialog.UserSearch.superclass.constructor.call(this, parentWindow,
            template, configuration);
    this.events = $H(this.events).merge({
        "search": true
    });

    this.addListener("hide", this.onHide.bind(this));
    this.addListener("show", this.onShow.bind(this));

    this._buildSearchGrid([["test", "test", "test"], ["test", "test", "test"]],
            this.id + "-search-grid");
    this.onShow();
    this.searchGrid.render();
};

YAHOO.extend(jive.spank.dialog.UserSearch, jive.spank.chat.Dialog, {
    _configuration : {
        title: "Person Search"
    },
    _template : [
            '<div id="{id}-person-search" class="dbody personsearch">',
            '<div class="jive-dbody-description">',
            '<h1>Person Search</h1>',
            '<p>{instructions}</p>',
            '</div>',
            '<div class="">',
            '<fieldset>',
            '<legend>Search Service</legend>',
            '<p><label for="service">Search Service</label>',
            '<select name="selectservice" tabindex="{firstTabIndex}">',
            '</select>',
            '<a href="#">Add Service</a>',
            '</p>',
            '</fieldset>',
            '</div>',
            '<div class="">',
            '<fieldset>',
            '<legend>Person Search Form</legend>',
            '{searchform}',
            '<p class="buttons"><input type="submit" value="Search" tabindex="{lastTabIndex}"/></p>',
            '</fieldset>',
            '</div>',
            '<div id="{id}-search-grid" class="jive-grid">',
            '</div>',
            '</div>'],
    _createTemplate: function(searchForm) {
        searchForm = [
                '<p><input name="Username" type="checkbox" value="Username" checked',
                '/>Username</p>',
                '<p><label for="testdrop">Test Dropdown</label>',
                '<select id="testdrop" name="testdrop">',
                '<option>test 1</option>',
                '<option>test 2</option>',
                '<option>test 3</option>',
                '</select>',
                '</p>'];
        var template = this._template;
        var index = template.indexOf("{searchform}");
        template.splice(index, 1, searchForm.join(''));
        return new YAHOO.ext.DomHelper.Template(template.join(''));
    },
    onHide : function() {
        this.searchGrid.destroy();
    },
    onShow: function() {
        var personSearch = getEl(this.id + "-person-search");
        var width = Math.max(this.body.getWidth(), personSearch.getWidth());
        this.resizeTo(500, 500);
    },
    _buildSearchGrid: function(searchData, searchGridId) {
        var schema = {
            fields: ["name", "muc#roominfo_subject", "muc#roominfo_occupants"]
        }
        var gridData = new YAHOO.ext.grid.DefaultDataModel(searchData);

        // get some labels on there
        var roomCols = [
        {header: "Username", width: 240, sortable: true},
        {header: "Name", width: 160, sortable: true},
        {header: "E-Mail", width: 70, sortable: true}
                ];
        var gridCols = new YAHOO.ext.grid.DefaultColumnModel(roomCols);

        // finally! build grid
        this.searchGrid = new YAHOO.ext.grid.Grid(searchGridId, {
            dataModel: gridData,
            colModel: gridCols,
            selModel: new YAHOO.ext.grid.SingleSelectionModel(),
            monitorWindowResize: false,
            stripeRows: false
        });

        return this.searchGrid;
    }
});

jive.spank.dialog.CreateAccount = function(verify) {
    this.dialog = new jive.spank.chat.Dialog(null,
            jive.spank.chat.Template.create_account,
    {title: "Creating an account",
        width: 250, height: 180, modal: true}
            );
    var creator = this.dialog;
    this.nameField = getEl(creator.id + '-name');
    this.passwordField = getEl(creator.id + '-passwd');
    this.createButton = getEl(creator.id + '-submit');
    this.verifyCallback = verify;
    getEl(creator.id + '-confirm').mon("keypress",
            this._doSubmit.createInterceptor(function(evt) {
                return evt.getKey() == 13;
            }));
    getEl(creator.id + '-submit').addListener("click", this._doSubmit.bind(this));

    this.nameField.mon("keypress",
            function() {
                this.dom.style.backgroundColor = "#fff";
            }.bind(this.nameField));

    this.passwordField.mon("keypress",
            function() {
                this.dom.style.backgroundColor = "#fff";
            }.bind(this.passwordField));

    this.nameField.dom.focus();
    creator.dialog.show();
};
jive.spank.dialog.CreateAccount.prototype = {
    _doSubmit: function() {
        var creator = this.dialog;
        var error = $(creator.id + "-error");
        $(creator.id + '-name').style.backgroundColor = "#fff";
        $(creator.id + '-passwd').style.backgroundColor = "#fff";
        if ($F(creator.id + '-name') == '') {
            $(creator.id + '-name').style.backgroundColor = "#f00";
            $(creator.id + '-name').select();
            return false;
        }
        if ($F(creator.id + '-passwd') == '') {
            $(creator.id + '-passwd').style.backgroundColor = "#f00";
            $(creator.id + '-passwd').select();
            return false;
        }
        if ($F(creator.id + '-passwd') != $F(creator.id + '-confirm')) {
            $(creator.id + '-passwd').style.backgroundColor = "#f00";
            $(creator.id + '-passwd').select();
            return false;
        }
        this.createButton.dom.disabled = true;
        this.createButton.hide();
        jive.spank.Spinner.show({x: this.createButton.getX() - 10, y: this.createButton.getY()});
        this.verifyCallback({
            username: $F(creator.id + '-name'),
            password: $F(creator.id + '-passwd')
        });

    },
    verify: function(fields) {
        var creator = this.dialog;
        if (verify) {
            if (verify.name) {
                $(creator.id + '-name').style.backgroundColor = "#f00";
                $(creator.id + '-name').select();
                return;
            }
            if (verify.password) {
                $(creator.id + '-passwd').style.backgroundColor = "#f00";
                $(creator.id + '-passwd').select();
                return;
            }
        }
        getEl(creator.id + '-confirm').removeAllListeners();
        getEl(creator.id + '-submit').removeAllListeners();
        this.nameField.removeAllListeners();
        this.passwordField.removeAllListeners();
        this.dialog.hide();
    }
}

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
        this.offlines = '';
        // will hold id of "virtual roster group" element.
        this._wrappedClick = null;
    }
    ;
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
        if (this.groups[groupName]) {
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
        var victim = this.findContact(jid);
        var grp = victim.group;
        victim.remove();
        if (grp.contacts.length == 0) {
            grp.remove();
        }
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
            var foundContact = this.groups[grouploopName].contacts.find(function(contact) {
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
        if (contact) {
            contact.changeStatus(newMode, newStatus);
        }
    },

    getContactStatus: function(jid) {
        var contact = this.findContact(jid);
        if (contact) {
            return contact.status;
        }
    },

    renderOffline: function() {
        var groups = this.groups;
        var offlineHTML = '';
        for (var groupName in groups) {
            this.groups[groupName].contacts.each(function(contact) {
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
            var sorted = lines.sortBy(function(line) {
                return line.id.split("-")[1].toLowerCase();
            });
            sorted.each(function(line) {
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
        for (var i = 0; i < groups.length; i++) {
            if (groups[i].firstChild) {
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
    if (groupJson) {
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
            if (this.contacts[u].jid == jid) {
                return u;
            }
        }
        return -1;
    },

    getContactByJID: function(jid) {
        var index = this.contactIndexByJid(jid);
        if (index >= 0) {
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
        if (body == '' && skipOfflines) {
            return '';
        }

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
        for (u = this.contacts.length - 1; u >= 0; u--) {
            this.contacts[u]._enableBehaviors();
        }
    }
};

jive.spank.roster.RosterGroup.toggleGroupVisListener = function(evt) {
    var elm = evt.getTarget().parentNode;
    var count = elm.parentNode.childNodes.length;
    var groupUL;
    for (var i = count - 1; i >= 0; i--) {
        if (elm.parentNode.childNodes[i].nodeName == "UL") {
            groupUL = elm.parentNode.childNodes[i];
            break;
        }
    }
    if (groupUL != null) {
        var display = (groupUL.style.display == "none") ? 'block' : 'none';
        for (var j = groupUL.childNodes.length - 1; i >= 0; i--) {
            if (groupUL.childNodes[j].nodeName == "LI") {
                groupUL.childNodes[j].style.display = display;
            }
        }
        groupUL.style.display = display;

        elm = getEl(elm);
        elm.removeClass(display == 'block' ? "closed" : "open");
        elm.addClass(display == 'block' ? "open" : "closed");
    }
};
jive.spank.roster.RosterGroup.sortContactHTML = function(id) {
    var prent = getEl('group-list-' + id);
    if (prent && prent.dom != null) {
        var lines = prent.getChildrenByTagName('li');
        var sorted = lines.sortBy(function(line) {
            return line.dom.innerHTML;
        });
        sorted.each(function(line) {
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
            this._wrappedDblClick = elm.mon('dblclick', function(evt) {
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
        var foundContact = grouploop[grouploopName].contacts.find(function(contact) {
            return contact.jid == jid;
        });
        if (foundContact) {
            return foundContact;
        }
    }
    return null;
};


jive.spank.chat.Control = function(panelToAdd, title, elm) {
    // elm is a bare HTMLElement, so there's a chance we'll need this:
    elm.id = elm.id || YAHOO.util.Dom.generateId();

    this.el = getEl(elm.id);
    this.el.appendTo(panelToAdd);
    this.el.setDisplayed('inline').unselectable();

    this.events = {
    /**
     * These all get the Control obj as their first arg and
     * a YAHOO.ext Event as their second.
     */
        "click": true,
        "dblclick": true,
        "mouseover": true,
        "mouseout": true,
        "mousedown": true,
        "mouseup": true,
        "mousemove": true
    };
    this._wrappedListeners = {};
    var self = this;
    // i hate to do this, but looping through the event names breaks
    this._wrappedListeners['click'] = this.el.addManagedListener('click', function(evt) {
        self.fireEvent('click', evt);
    });
    this._wrappedListeners['dblclick'] = this.el.addManagedListener('dblclick', function(evt) {
        self.fireEvent('dblclick', evt);
    });
    this._wrappedListeners['mouseover'] = this.el.addManagedListener('mouseover', function(evt) {
        self.fireEvent('mouseover', evt);
    });
    this._wrappedListeners['mouseout'] = this.el.addManagedListener('mouseout', function(evt) {
        self.fireEvent('mouseout', evt);
    });
    this._wrappedListeners['mousedown'] = this.el.addManagedListener('mousedown', function(evt) {
        self.fireEvent('mousedown', evt);
    });
    this._wrappedListeners['mouseup'] = this.el.addManagedListener('mouseup', function(evt) {
        self.fireEvent('mouseup', evt);
    });
    this._wrappedListeners['mousemove'] = this.el.addManagedListener('mousemove', function(evt) {
        self.fireEvent('mousemove', evt);
    });

    this.title = title;
    this.panel = panelToAdd;
};
YAHOO.extend(jive.spank.chat.Control, YAHOO.ext.util.Observable, {
    fireEvent: function() {
        if (!this.el.hasClass('jive-disabled')) {
            jive.spank.chat.Control.superclass.fireEvent.call(this, arguments[0], self, arguments[1]);
        }
    },

    remove: function() {
        this.purgeListeners();
        for (var eventName in this.events)
        {
            YAHOO.ext.EventManager.removeListener(eventName, this.el, this._wrappedListeners[eventName]);
        }
        this._wrappedListeners = null;
        this.el.remove();
    },
    enable: function() {
        this.el.removeClass('jive-disabled');
    },
    disable: function() {
        this.el.addClass('jive-disabled');
    },
    toggleEnabled: function() {
        this.el.toggleClass('jive-disabled');
    }
});
jive.spank.chat.Control.add = function(destElm, ctrlTitle, confObj) {
    var body = document.getElementsByTagName('body')[0];
    // fetch elm if ctrlElmId provided
    if (typeof confObj != 'function' && confObj.elmId != null) {
        var elmorig = $(confObj.elmId);
        var elm = elmorig.cloneNode(true);
        elm.id = 'jivectrl-' + elmorig.id;
        elm.style.display = 'none';
        body.appendChild(elm);
    }
    else if (typeof confObj != 'function' && confObj.imgSrc != null) {
        var elm = document.createElement('a');
        elm.appendChild(document.createElement('img'));
        var elmId = elm.id = YAHOO.util.Dom.generateId();
        elm.className = 'imgbtn';
        elm.firstChild.setAttribute('src', confObj.imgSrc);
        if (confObj.tooltip) {
            elm.setAttribute('title', confObj.tooltip);
        }
        elm.setAttribute('href', '#');
        body.appendChild(elm);
    }
    else {
        var classNm = 'autobtn';
        var elmId = YAHOO.util.Dom.generateId();
        if (typeof confObj != 'function' && confObj.className != null) {
            classNm = confObj.className;
        }
        jive.spank.chat.Template.control_btn.append(body, {
            id: elmId,
            cls: classNm,
            text: ctrlTitle
        });
    }
    if (typeof confObj != 'function' && confObj.tooltip) {
        elm.setAttribute('title', confObj.tooltip);
    }

    // make control obj
    var thecontrol = new jive.spank.chat.Control(
            getEl(destElm),
            ctrlTitle,
            elm
            );

    if (typeof confObj == 'function') {
        thecontrol.addListener("click", confObj);
    }
    else {
        for (var eventName in confObj.events) {
            thecontrol.addListener(eventName, confObj.events[eventName]);
        }
    }
    return thecontrol;
};

/**
 * CustomMessage objects have an HTMLElement 'elm' property and a function 'callback' property.
 */
jive.spank.chat.CustomMessage = function(type, config) {
    var template = new YAHOO.ext.DomHelper.Template(this.finishers[type].template.join(''));
    this.callback = this.finishers[type].callback;
	this.destroy = this.finishers[type].destroy;
    this.events = this.finishers[type].events;

    config.id = config.id || YAHOO.util.Dom.generateId();

    this.el = document.createElement('div');
    this.el.innerHTML = template.applyTemplate(config);
    this.el.id = config.id;
    this.config = config;
}

YAHOO.extend(jive.spank.chat.CustomMessage, YAHOO.ext.util.Observable, {
    finishers: {
        mucinvitation: {
            events: {
                'accepted': true,
                'declined': true
            },
            callback: function(window) {
                var theId = this.el.id;
                var roomname = getEl(theId + '-room').dom.innerHTML;
                var invitername = getEl(theId + '-inviter').dom.innerHTML;

                getEl(theId + '-join').addListener('click', function() {
                    this.fireEvent('accepted', window, this.config);
                    getEl(theId + '-message').dom.innerHTML =
                    'You accepted ' + invitername + '\'s invitation to "' + roomname + '".';
                    this.destroy();
                }.bind(this));
                getEl(theId + '-decline').addListener('click', function() {
                    this.fireEvent('declined', window, this.config);
                    getEl(theId + '-message').dom.innerHTML =
                    'You declined ' + invitername + '\'s invitation to "' + roomname + '".';
                    this.destroy();
                }.bind(this));
            },
            destroy: function() {
                var theId = this.el.id;
                getEl(theId + '-join').removeAllListeners();
                getEl(theId + '-decline').removeAllListeners();
                getEl(theId + '-controls').remove();
                this.purgeListeners();
                delete this.config;
            },
            template: [
                    '<div class="jive-mucinvite">',
                    '<p id="{id}-message"><span id="{id}-inviter">{name}</span> has invited you to',
                    'join the conference "<span id="{id}-room">{chatname}</span>".</p>',
                    '<div id="{id}-controls"><a id="{id}-join" href="#">Accept</a>',
                    '<a id="{id}-decline" href="#">Decline</a></div>',
                    '<span id="{id}-jid" style="display: none;">{jid}</span>',
                    '</div>'
                    ]
        }
    }});


/**
 * Subclassing YUI's autocomplete widget to deal with some weirdnesses in our data sources.
 */
jive.spank.AutoComplete = function(fieldId, containerId, dataSource, confObj) {
    jive.spank.AutoComplete.superclass.constructor.call(this, fieldId, containerId, dataSource, confObj);
}
YAHOO.extend(jive.spank.AutoComplete, YAHOO.widget.AutoComplete);
jive.spank.AutoComplete.prototype._populateList = function(query, results, self) {
    self.autoHighlight = (results[0][0].indexOf(query) == 0);
    jive.spank.AutoComplete.superclass._populateList.call(this, query, results, self);
}

jive.spank.AutoComplete.prototype._onTextboxKeyDown = function(v, oSelf) {
    var nKeyCode = v.keyCode;

    switch (nKeyCode) {
        case 9: // tab
            if (oSelf.delimChar && (oSelf._nKeyCode != nKeyCode)) {
                if (oSelf._bContainerOpen) {
                    YAHOO.util.Event.stopEvent(v);
                }
            }
            // select an item or clear out
            if (oSelf._oCurItem) {
                oSelf._selectItem(oSelf._oCurItem);
            }
            else {
                oSelf._toggleContainer(false);
            }
            break;
        case 13: // enter
            if (oSelf._nKeyCode != nKeyCode) {
                if (oSelf._bContainerOpen) {
                    YAHOO.util.Event.stopEvent(v);
                }
            }
            oSelf._toggleContainer(false);
            break;
        case 27: // esc
            oSelf._toggleContainer(false);
            return;
        case 39: // right
            oSelf._jumpSelection();
            break;
        case 38: // up
            YAHOO.util.Event.stopEvent(v);
            oSelf._moveSelection(nKeyCode);
            break;
        case 40: // down
            YAHOO.util.Event.stopEvent(v);
            oSelf._moveSelection(nKeyCode);
            break;
        default:
            break;
    }
};
/**
 * This one tweaks it up a little extra for the roster-group data source, which is a 1-dimensional
 * array, not 2-D like the contacts datasource in the invite menu.
 */
jive.spank.FlatAutoComplete = function(fieldId, containerId, dataSource, confObj) {
    jive.spank.FlatAutoComplete.superclass.constructor.call(this, fieldId, containerId, dataSource, confObj);
}
YAHOO.extend(jive.spank.FlatAutoComplete, YAHOO.widget.AutoComplete);
jive.spank.FlatAutoComplete.prototype._populateList = function(query, results, self) {
    self.autoHighlight = (results[0] && results[0].indexOf(query) == 0);
    jive.spank.AutoComplete.superclass._populateList.call(this, query, results, self);
}
jive.spank.FlatAutoComplete.prototype._updateValue = function(item) {
    item._sResultKey = item._oResultData;
    jive.spank.AutoComplete.superclass._updateValue.call(this, item);
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
            '<img src="resources/images/progress.gif" alt="" />{text}</div>'
            )
};


/**
 * Makes message-text filters, suitable for adding emoticons, links into Wikipedia
 * or whatever you can cook up.
 *
 * @param {String} name a short name by which you can unregister the filter later.
 * @param {RegExp} filterer a regex to test strs against
 * @param {String} filterTo a string to replace the matches with - $1 and $2 and such for matched groups will work
 */
jive.spank.chat.Filter = function(name, filterer, filterTo) {
    this.filterPattern = filterer;
    this.filterReplacement = filterTo;
    this.name = name;
};
jive.spank.chat.Filter.prototype.apply = function(stringToFilter) {
    return stringToFilter.replace(this.filterPattern, this.filterReplacement);
}

jive.spank.chat.Filter.applyAll = function(stringToFilter) {
    // apply filter only to text nodes
    jive.spank.chat.Filter.registeredFilters.each(function(filter) {
        stringToFilter = filter.apply(stringToFilter);
    });
    return stringToFilter;
};

jive.spank.chat.Filter.add = function(name, filterer, filterTo) {
    jive.spank.chat.Filter.registeredFilters.push(new jive.spank.chat.Filter(name, filterer, filterTo));
}
jive.spank.chat.Filter.remove = function(filterName) {
    jive.spank.chat.Filter.registeredFilters.each(function(ftr, i) {
        if (ftr.name == filterName) {
            delete jive.spank.chat.Filter.registeredFilters[i];
            throw $break;
        }
    });
}
jive.spank.chat.Filter.unregisterAll = function() {
    for (var t = jive.spank.chat.Filter.registeredFilters.length - 1; t >= 0; t--) {
        delete jive.spank.chat.Filter.registeredFilters[t];
    }
}

jive.spank.chat.Filter.registeredFilters = [];


// notification nonsense
jive.spank.notifier = {};
jive.spank.notifier.origTitle = null;
jive.spank.notifier.titleMsg = '';
jive.spank.notifier.titleInterval = null;
jive.spank.notifier.countNewMsgs = function() {
    var windowObj;
    var lastOneName = '';
    var newMsgCt = 0;
    for (var windowId in jive.spank.chat.ChatWindow.currentWindow)
    {
        windowObj = jive.spank.chat.ChatWindow.currentWindow[windowId];
        for (var tabJid in windowObj.newMessages) {
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
    add_contact: new YAHOO.ext.DomHelper.Template([
            '<div class="dbody addcontact">',
            '<table width="100%" cellpadding="2" cellspacing="0" border="0">',
            '<tr><td width="35%">',
            '<label for="{id}-addusername">Username:</label>',
            '</td><td width="65%">',
            '<input type="text" id="{id}-addusername" value="" />',
            '</td></tr>',

            '<tr><td><label for="{id}-addnickname">Nickname:</label>',
            '</td><td><input type="text" id="{id}-addnickname" value="" /></td></tr>',

            '<tr><td><label for="{id}-addcontact-group">Group:</label></td><td>',
            '<input type="text" id="{id}-addcontact-group" value="" />',
            '</td></tr>',

            '<tr><td colspan="2" align="center" class="masterctrl">',
            '<input type="button" class="btn createcontact" id="{id}-createcontact" value="Add" />',
            '<input type="button" class="btn jive-closedialog" id="{id}-closeaddcontact" value="Cancel" />',
            '</td></tr></table>',
            '</div>'
            ].join('')),
    add_group: new YAHOO.ext.DomHelper.Template([
            '<div class="dbody">',
            '<table width="100%" cellpadding="2" cellspacing="0" border="0">',
            '<tr><td width="25%" rowspan="2">',
    // image goes here?
            '</td><td width="75%">',
            'Enter new group name:<br/>',
            '<input type="text" id="{id}-addgroupname" value="" />',
            '</td></tr>',
            '<tr><td>',
            '<input type="button" class="btn creategroup" id="{id}-creategroup" value="Add" />',
            '<input type="button" class="btn jive-closedialog" id="{id}-closeaddgroup" value="Cancel" />',
            '</td></tr></table>',
            '</div>'
            ].join('')),
    chat_toppane: new YAHOO.ext.DomHelper.Template(
            '<div id="{bodyId}-topchat" class="jive-chat-toppane">' +
            '<p class="avatar"><img id="{bodyId}-avatar" src="../images/sparkweb-avatar.png" height="48" width="48" alt="" /></p>' +
            '<h4></h4>' +
            '<p id="{bodyId}-time">Time: <span></span></p>' +
            '<div id="{bodyId}-controls" class="jive-ctrlbar-topchat"></div>' +
            '</div>'
            ),
    contact:new YAHOO.ext.DomHelper.Template(
            '<li id="{id}" class="roster-contact-{status}">{username} <span id="{id}-msg" class="msg">{message}</span></li>'
            ),
    control_btn: new YAHOO.ext.DomHelper.Template(
            '<a href="#" class="jive-control-btn {cls}" id="{id}">{text}</a>'
            ),
    control_panel:new YAHOO.ext.DomHelper.Template(
            '<div id="{tabId}-controls" class="jive-ctrlbar"></div>'
            ),
    create_account: new YAHOO.ext.DomHelper.Template([
            '<div class="dbody">',
            '<table border="0" cellpadding="0" cellspacing="4"><tr>',
            '<td><div class="{id}-name-label">Username:</div></td>',
            '<td><input type="text" id="{id}-name" /></td></tr>',
            '<td><div class="{id}-passwd-label">Password:</div></td>',
            '<td><input type="password" id="{id}-passwd" /></td></tr>',
            '<td><div class="{id}-confirm-label">Confirm Password:</div></td>',
            '<td><input type="password" id="{id}-confirm" /></td></tr>',
            '</table>',
            '<p align="center"><input type="button" class="btn" id="{id}-submit" value="Submit" />',
            '<input type="button" class="btn jive-closedialog" id="{id}-cancel" value="Cancel" /></p>',
            '</div>'
            ].join('')),
    dialog:new YAHOO.ext.DomHelper.Template(
            '<div class="ydlg-hd"><h1>{windowTitle}</h1></div>' +
            '<div id="{bodyId}" class="ydlg-bd">' +
            '<div id="{bodyId}-toppane" class="ydlg-bd jive-toppane"></div>' +
            '</div>'
            ),
    message:new YAHOO.ext.DomHelper.Template(
            '<div class="{type}-message {mentioned} {msgclass}"><span class="meta"><em>({time})</em>' +
            '&nbsp;{from}: </span><span class="message-content">{message}</span></div>'
            ),
    muc_chooser_top: new YAHOO.ext.DomHelper.Template(
            '<div class="dhead chooseconf">Create or join a conference room</div>' +
            '<div id="{tabId}-confcontrols" class="dbody chooseconf">' +
            '<div id="{tabId}-createconf" class="jive-invite-control">Create a Conference</div>' +
            '<div id="{tabId}-refresh" class="jive-invite-control">Refresh List</div>' +
            '</div>'
            ),
    muc_controls: new YAHOO.ext.DomHelper.Template(
            '<p>Subject: <span id="jive-tab-{jid}-subject"></span></p>' +
            '<div class="muc-ctrl-frame">' +
            '<div id="{jid}-changenick" class="jive-invite-control">Change nickname</div>' +
            '<div id="{jid}-control" class="jive-invite-control">Invite contact ' +
            '<img align="absmiddle" src="resources/images/menutri.gif" height="4" width="7" alt="" /></div>' +
            '</div>'
            ),
    muc_subject: new YAHOO.ext.DomHelper.Template(
            '<p>Subject: <span id="jive-tab-{jid}-subject"></span></p>'
            ),
    mucchooser: new YAHOO.ext.DomHelper.Template(
            '<div id="{tabId}-layout" class="ylayout-inactive-content">' +
            '<div id="{tabId}-toppane" class="ydlg-bd jive-toppane"></div>' +
            '<div id="{tabId}-roomgrid"></div>' +
            '</div>'
            ),
    muccreation: new YAHOO.ext.DomHelper.Template([
            '<div class="dbody">',
            '<table border="0" cellpadding="0" cellspacing="4"><tr>',
            '<td><label for="{id}-roomname">Room Name:</label></td>',
            '<td><input type="text" id="{id}-roomname" /></td></tr>',
            '<tr><td><label for="{id}-roomtopic">Room Topic:</label></td>',
            '<td><input type="text" id="{id}-roomtopic" /></td></tr>',
            '<tr><td colspan="2"><input type="checkbox" id="{id}-permanent" />',
            '<label for="{id}-permanent"> Make permanent</label></td></tr></table>',
            '<div class="fieldset">',
            '<p class="legend"><span><input type="checkbox" id="{id}-private" />',
            ' Make private</span></p>',
            '<table border="0" cellpadding="0" cellspacing="4"><tr>',
            '<td><label for="{id}-roompw" class="disabled">Password:</label></td>',
            '<td><input type="password" id="{id}-roompw" disabled="disabled" /></td></tr>',
            '<td><label for="{id}-roomconfirm" class="disabled">Confirm Password:</label></td>',
            '<td><input type="password" id="{id}-roomconfirm" disabled="disabled" /></td></tr>',
            '</table></div>',
            '<p align="center"><input type="button" class="btn" id="{id}-createroom" value="Create" />',
            '<input type="button" class="btn jive-closedialog" id="{id}-cancel" value="Cancel" /></p>',
            '</div>'
            ].join('')),
    mucinvitemenu:  new YAHOO.ext.DomHelper.Template(
            '<div id="{jid}-container" class="jive-invite-menu">' +
            '<input id="{jid}-autocomp" type="text">' +
            '<div id="{jid}-autocomp-menu"></div>' +
            '</div>'
            ),
    mucpassword: new YAHOO.ext.DomHelper.Template([
            '<div class="dbody">',
            '<p align="center">Enter password:</p>',
            '<p align="center"><input type="password" class="btn" id="{id}-passwd" value="" /></p>',
            '<p align="center"><input type="button" class="btn" id="{id}-sendsecret" value="Join" />',
            '<input type="button" class="btn jive-closedialog" id="{id}-cancel" value="Cancel" /></p>',
            '</div>'
            ].join('')),
    muctab:new YAHOO.ext.DomHelper.Template(
            '<div id="{tabId}-layout" class="ylayout-inactive-content ydlg-tab">' +
            '<div id="{tabId}-controls" class="jive-muc-ctrl"></div>' +
            '<div id="{tabId}-history" class="jive-history"></div>' +
            '<div id="{tabId}-sidebarlayout" class="ylayout-inactive-content ydlg-tab">' +
            '<div id="{tabId}-sidebar-header" class="jive-muc-sidebar-header"></div>' +
            '<div id="{tabId}-occupants" class="jive-muc-occupants"></div>' +
			'<div id="{tabId}-userstatus" class="jive-muc-status"></div>' +
            '</div>' +
            '<textarea id="{tabId}-text" class="jive-tab-message"></textarea>' +
            '</div>'
            ),
    remove_group: new YAHOO.ext.DomHelper.Template([
            '<div class="dbody">',
            '<p align="center">Are you sure you want to remove \'{name}\'?</p>',
            '<p align="center"><input type="button" class="btn" id="{id}-remove" value="Yes" />',
            '<input type="button" class="btn jive-closedialog" id="{id}-cancel" value="No" /></p>',
            '</div>'
            ].join('')),
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
    rostertab:new YAHOO.ext.DomHelper.Template(
            '<div id="{tabId}-layout" class="ylayout-inactive-content">' +
            '<div id="{tabId}-user" class="jive-controlpanel"></div>' +
            '<div id="{tabId}-resources"></div>' +
            '</div>'
            ),
    spinnertab: new YAHOO.ext.DomHelper.Template(
            '<div id="{tabId}-spinner" class="ylayout-inactive-content ydlg-tab jive-spinnertab">' +
            '<div id="jive-spinner"><img src="resources/images/progress.gif" alt="" />{text}</div>' +
            '</div>'
            ),
    start_chat: new YAHOO.ext.DomHelper.Template([
            '<div class="dbody" style="text-align: center;">',
            '<p>Enter an address:</p>',
            '<p><input type="text" id="{id}-jid" /></p>',
            '<p style="margin-top: 4px;"><input type="button" class="btn" id="{id}-startbtn" value="Start Chat" />',
            '<input type="button" class="btn jive-closedialog" id="{id}-cancel" value="Cancel" /></p>',
            '</div>'
            ].join('')),
    statusMessage: new YAHOO.ext.DomHelper.Template(
            '<div class="status-message">{message}</div>'
            ),
    status_panel: new YAHOO.ext.DomHelper.Template(
            '<div class="jive-userstatus">' +
            '<p class="avatar"><img id="{bodyId}-avatar" src="../images/sparkweb-avatar.png" height="48" width="48" alt="" /></p>' +
            '<h4>{username}</h4>' +
            '<p id="{bodyId}-status" class="jive-mystatus">' +
            '<a href="#" id="{bodyId}-statusmenu-ctrl" class="roster-contact-{statusName}"><span>{status}</span></a></p>' +
            '</div>'
            ),
    sub_request: new YAHOO.ext.DomHelper.Template([
            '<div class="dhead">{nick} ({jid}) wants to add you as a contact.</div>',
            '<div class="dbody fieldset">',

            '<p class="legend"><span><input type="checkbox" id="{id}-add" checked="checked" />',
            ' Add user to your contacts too</span></p>',
            '<table width="100%" cellpadding="2" cellspacing="0" border="0">',
            '<tr><td width="35%">',

            '<label for="addusername">Username:</label>',
            '</td><td id="{id}-jid" width="65%">{jid}</td></tr>',
            '<tr><td><label for="{id}-nick">Nickname:</label>',
            '</td><td><input type="text" id="{id}-nick" value="{nick}" /></td></tr>',
            '<tr><td><label for="{id}-subrequest-group">Group:</label></td><td>',
            '<input type="text" id="{id}-subrequest-group" value="" />',

            '</td></tr></table></div>',
            '<p align="center">',
            '<input type="button" class="btn subrequest" id="{id}-acceptsubrequest" value="Allow" />',
            '<input type="button" class="btn subrequest" id="{id}-denysubrequest" value="Deny" />',
            '</p>'
            ].join('')),
    tab:new YAHOO.ext.DomHelper.Template(
            '<div id="{tabId}-layout" class="ylayout-inactive-content ydlg-tab">' +
            '<div id="{tabId}-toppane" class="ydlg-bd jive-toppane"></div>' +
            '<div id="{tabId}-history" class="jive-history"></div>' +
            '<textarea id="{tabId}-text" class="jive-tab-message"></textarea>' +
            '</div>'
            ),
    userpane: new YAHOO.ext.DomHelper.Template(
            '<span id="{id}-message">{message}</span>'
            ),
    userpane_loggedin: new YAHOO.ext.DomHelper.Template(
            '<input class="jive-muc-username" type="text" id="{id}-uname" value="{uname}"></input>'
            ),
    userpane_changebtn: new YAHOO.ext.DomHelper.Template(
            '<a id="{id}-changenickbtn" href="javascript:void(0);">Change Nickname</a>'
            ),
	userstatus: new YAHOO.ext.DomHelper.Template(
            '<div id="{tabId}-layout" class="ylayout-inactive-content ydlg-tab">' +
            '<div id="{tabId}-toppane" class="ydlg-bd jive-toppane"></div>' +
            '<div id="{tabId}-history" class="jive-history"></div>' +
            '<textarea id="{tabId}-text" class="jive-tab-message"></textarea>' +
            '</div>'
            )
};

/**
 * @class YAHOO.ext.grid.SpankJSONDataModel
 * This is an implementation of a DataModel used by the Grid. It works
 * with JSON data.
 * <br>Example schema:
 * <pre><code>
 * var schema = {
 *	 root: 'Results.Result',
 *	 id: 'ASIN',
 *	 fields: ['Author', 'Title', 'Manufacturer', 'ProductGroup']
 * };
 * </code></pre>
 * @extends YAHOO.ext.grid.LoadableDataModel
 * @constructor
 */
YAHOO.ext.grid.SpankJSONDataModel = function(schema) {
    YAHOO.ext.grid.SpankJSONDataModel.superclass.constructor.call(this, YAHOO.ext.grid.LoadableDataModel.JSON);
    /**@private*/
    this.schema = schema;
};
YAHOO.extendX(YAHOO.ext.grid.SpankJSONDataModel, YAHOO.ext.grid.LoadableDataModel, {
/**
 * Overrides loadData in LoadableDataModel to process JSON data
 * @param {Object} data The JSON object to load
 * @param {Function} callback
 */
    loadData : function(data, callback, keepExisting) {
        var idField = this.schema.id;
        var fields = this.schema.fields;
        try {
            if (this.schema.totalProperty) {
                var v = parseInt(eval('data.' + this.schema.totalProperty), 10);
                if (!isNaN(v)) {
                    this.totalCount = v;
                }
            }
            var rowData = [];
            if (this.schema.root) {
                var root = eval('data.' + this.schema.root);
            }
            else {
                var root = data;
            }
            for (var i in root) {
                var node = root[i];
                var colData = [];
                colData.node = node;
                colData.id = (typeof node[idField] != 'undefined' && node[idField] !== '' ? node[idField] : String(i));
                for (var j = 0; j < fields.length; j++) {
                    var val = node[fields[j]];
                    if (typeof val == 'undefined') {
                        val = '';
                    }
                    if (this.preprocessors[j]) {
                        val = this.preprocessors[j](val);
                    }
                    colData.push(val);
                }
                rowData.push(colData);
            }
            if (keepExisting !== true) {
                this.removeAll();
            }
            this.addRows(rowData);
            if (typeof callback == 'function') {
                callback(this, true);
            }
            this.fireLoadEvent();
        }
        catch(e) {
            this.fireLoadException(e, null);
            if (typeof callback == 'function') {
                callback(this, false);
            }
        }
    },

/**
 * Overrides getRowId in DefaultDataModel to return the ID value of the specified node.
 * @param {Number} rowIndex
 * @return {Number}
 */
    getRowId : function(rowIndex) {
        return this.data[rowIndex].id;
    }
});

/**
 * And now, extensions to YAHOO.ext.Element
 */
YAHOO.ext.Element.prototype.getParentByClass = function(className, tagName) {
    if (tagName) {
        tagName = tagName.toLowerCase();
    }
    function isMatch(el) {
        if (!el) {
            return false;
        }
        if (className && !YAHOO.util.Dom.hasClass(el, className)) {
            return false;
        }
        return !(tagName && el.tagName.toLowerCase() != tagName);

    }
    ;

    var t = this.dom;
    if (!t || isMatch(t)) {
        return t;
    }
    var p = t.parentNode;
    var b = document.body;
    while (p && p != b) {
        if (isMatch(p)) {
            return p;
        }
        p = p.parentNode;
    }

    return null;
};

YAHOO.ext.Element.prototype.setSelectable = function(which) {
    this.dom.unselectable = which ? 'off' : 'on';
    if (!which) {
        this.applyStyles('-moz-user-select:none;-khtml-user-select:none;');
    }
    else {
        this.applyStyles('-moz-user-select:normal;-khtml-user-select:auto;');
    }
    // skipping the swallowEvent bit - use this and you must take care of that elsewhere
    // hopefully that'll be fine
    return this;
};
