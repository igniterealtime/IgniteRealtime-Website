/**
 * JavaScript for showing/hiding the Group Chat timer in the navbar.
 */
function runGroupChatTimer() {
    // All times/dates are UTC
    var SCHEDULED_DAY = 3;
    var SCHEDULED_HOUR = 18;

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
            message += '<strong><a href="http://www.igniterealtime.org/support/group_chat.jsp">Now</a></strong>';
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
