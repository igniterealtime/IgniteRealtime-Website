/*
togglePanel function
This is for showing and hiding the login / signup / user panel.
This toggles the panel (slides up and down) from the tab button.
*/

function togglePanel(thisID) {

var tabClosed = $('jive-consoleTab');
var tabOpened = $('jive-consoleTab-open');
//alert(tabState);

	if ($(thisID).style.display != 'none') {
		Effect.toggle($(thisID), 'slide', {duration: .4});
		$(tabOpened).id = "jive-consoleTab";
	} else {
		Effect.toggle($(thisID), 'slide', {duration: .4});
		$(tabClosed).id = "jive-consoleTab-open";
	}
}


/*
closePanel function
This is for showing and hiding the 'info' or promo panels.
This toggles the panel from the close button and sets a cookie.
*/
function closePanel(sectionName) {

var bigID = $('ignite_bigpanel');
var smallID = $('ignite_smallpanel');

	if ($(bigID).style.display != 'none') {
		$(bigID).style.display = 'none';
		$(smallID).style.display = 'block';
		Cookies.setCookie(sectionName, 'closed', 365);
	} else {
		$(smallID).style.display = 'none';
		$(bigID).style.display = 'block';
		Cookies.deleteCookie(sectionName);
	} 
	
}


/*
checkPanel function
This checks for a cookie for the given section
if the cookie is there, it hides the large version
and shows the thinner panel.
*/
function checkPanel(sectionName) {

var bigID = $('ignite_bigpanel');
var smallID = $('ignite_smallpanel');

	if (Cookies.getCookie(sectionName) != null) {
		$(bigID).style.display = 'none';
		$(smallID).style.display = 'block';
	} else {
		$(smallID).style.display = 'none';
		$(bigID).style.display = 'block';
	}
}



/* 
toggleDownloadPanel function
This is for showing and hiding the download page's panels. 
This toggles toggles an individual panel (slides up and down), or switches 
between them if one's already open.
*/

function toggleDownloadPanel(openThis,closeThat,closeThatToo) {

openBtn = openThis+"Btn";
closeBtn1 = closeThat+"Btn";
closeBtn2 = closeThatToo+"Btn";


if ($(closeThatToo) != null) {

	if ($(openThis).style.display != 'none' && $(closeThat).style.display == 'none' && $(closeThatToo).style.display == 'none') {
		Effect.toggle($(openThis),'slide', {duration: .4});
		$(openBtn).className = "ignite_download_btn";
	} else if ($(openThis).style.display == 'none' && $(closeThat).style.display != 'none') {
		$(closeThat).style.display = 'none';
		$(openThis).style.display = 'block';
		$(closeBtn1).className = "ignite_download_btn";
		$(openBtn).className = "ignite_download_btn_current";
	} else if ($(openThis).style.display == 'none' && $(closeThatToo).style.display != 'none') {
		$(closeThatToo).style.display = 'none';
		$(openThis).style.display = 'block';
		$(closeBtn2).className = "ignite_download_btn";
		$(openBtn).className = "ignite_download_btn_current";
	} else {
		Effect.toggle($(openThis),'slide', {duration: .4});
		$(openBtn).className = "ignite_download_btn_current";
	}
	
} else if ($(closeThat) != null) {

	if ($(openThis).style.display != 'none' && $(closeThat).style.display == 'none') {
		Effect.toggle($(openThis),'slide', {duration: .4});
		$(openBtn).className = "ignite_download_btn";
	} else if ($(openThis).style.display == 'none' && $(closeThat).style.display != 'none') {
		$(closeThat).style.display = 'none';
		$(openThis).style.display = 'block';
		$(closeBtn1).className = "ignite_download_btn";
		$(openBtn).className = "ignite_download_btn_current";
	} else {
		Effect.toggle($(openThis),'slide', {duration: .4});
		$(openBtn).className = "ignite_download_btn_current";
	}

} else {
	if ($(openThis).style.display != 'none') {
		Effect.toggle($(openThis),'slide', {duration: .4});
		$(openBtn).className = "ignite_download_btn";
	} else {
		Effect.toggle($(openThis),'slide', {duration: .4});
		$(openBtn).className = "ignite_download_btn_current";
	}
}



}