/**
 * JavaScript for showing/hiding the Group Chat timer in the navbar.
 */

// by default, hide the header elements
document.getElementById('ignite_nav_groupchat-block').innerHTML = '';
document.getElementById('ignite_nav_groupchat_moreinfo').style.display = NONE;
document.getElementById('ignite_nav_groupchat').style.display = NONE;

function runGroupChatTimer() {
    // Constants
    var MINUTES_IN_HOUR = 60;
    var BLOCK = 'block';
    var NONE = 'none';

    var now = new Date();
    var day = now.getUTCDay();
    var hour = now.getUTCHours();
    var minute = now.getUTCMinutes();
    var message = "Join community group chat ";
    var show = false;

    // Scheduled time is UTC
    var SCHEDULED_DAY = 3;
    var SCHEDULED_HOUR = 18;

    // Is it DST?
	var MAR_DATE = new Date();
	MAR_DATE.setUTCMonth(2);
	MAR_DATE.setUTCDate(3);
	MAR_DATE.setUTCDate(10); //UTC 2am PST (non-DST) 
	var NOV_DATE = new Date();
	NOV_DATE.setUTCMonth(10);
	NOV_DATE.setUTCDate(2);
	NOV_DATE.setUTCDate(9); //UTC 2am PST (ON-DST)
    if ( (now.getTime() > MAR_DATE.getTime()) && (now.getTime() < NOV_DATE.getTime()) ) {
    	// in DST, so use UTC-1 for hour
    	SCHEDULED_HOUR = 17;
    }


    // Is it Wednesday?
    if (day == SCHEDULED_DAY) {
        // Is it less than three hours until the group chat?
        if (hour >= (SCHEDULED_HOUR - 3) && hour < SCHEDULED_HOUR) {
            // Starts in X minutes
            var minutes = ((SCHEDULED_HOUR - hour - 1) * MINUTES_IN_HOUR) + (MINUTES_IN_HOUR - minute);
            message += "in <strong>" + minutes + " minute";
            if (MINUTES_IN_HOUR - minute != 1) {
                message += "s";
            }
            message += "</strong>";
            show = true;
        }
        // Is it occurring now?
        else if (hour == SCHEDULED_HOUR) {
            // Now
            message += '<strong><a href="/support/group_chat.jsp">Now</a></strong>';
            showNow = true;
            show = true;
        }
    }

    // UI updates
    if (show) {
        document.getElementById('ignite_nav_groupchat').style.display = BLOCK;
        document.getElementById('ignite_nav_groupchat_moreinfo').style.display = BLOCK;
        document.getElementById('ignite_nav_groupchat-block').innerHTML = message;
    }
    else {
        document.getElementById('ignite_nav_groupchat-block').innerHTML = '';
        document.getElementById('ignite_nav_groupchat_moreinfo').style.display = NONE;
        document.getElementById('ignite_nav_groupchat').style.display = NONE;
    }
}
