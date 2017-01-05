/**
 * Copyright (C) 1999-2005 Jive Software. All rights reserved.
 * This software is the proprietary information of Jive Software. Use is subject to license terms.
 */

package org.jivesoftware.updater;

/**
 * Simple model to represent the information requested by the Spark IM client.
 * <p/>
 *
 * @author Derek DeMoro
 */
public class Version {
    private String version;
    private long updateTime;
    private String downloadURL;
    private String displayMessage;
    private String changeLogURL;

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public long getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(long updateTime) {
        this.updateTime = updateTime;
    }

    public String getDownloadURL() {
        return downloadURL;
    }

    public void setDownloadURL(String downloadURL) {
        this.downloadURL = downloadURL;
    }

    public String getDisplayMessage() {
        return displayMessage;
    }

    public void setDisplayMessage(String displayMessage) {
        this.displayMessage = displayMessage;
    }

    public String getChangeLogURL() {
        return changeLogURL;
    }

    public void setChangeLogURL(String changeLogURL) {
        this.changeLogURL = changeLogURL;
    }
}
