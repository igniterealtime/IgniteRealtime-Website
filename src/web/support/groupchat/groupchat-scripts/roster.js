/**
 * @author Alex
 */

function handleGroupClick(groupLink) {
	var group = groupLink.parentNode;
	var count = group.childNodes.length;
	var groupUL;
	for(var i = 0; i < count; i++) {
		if(group.childNodes[i].nodeName == "UL") {
			groupUL = group.childNodes[i];
		}
	}
	if(groupUL == null) {
		return;
	}
	
	var display;
	if(groupUL.style.display == "none") {
		display = "";
	}
	else {
		display = "none";
	}
	
	count = groupUL.childNodes.length;
	for(var i = 0; i < count; i++) {
		if(groupUL.childNodes[i].nodeName == "LI") {
			groupUL.childNodes[i].style.display = display;
		}
	}
	
	groupUL.style.display = display;
}