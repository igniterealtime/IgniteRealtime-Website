/**
 * Copyright (C) 1999-2014 Jive Software. All rights reserved.
 * This software is the proprietary information of Jive Software. Use is subject to license terms.
 */
package org.jivesoftware.util;

import java.util.StringTokenizer;

/**
 * Holds version information for Openfire.
 *
 * @author Iain Shigeoka
 */
public class Version implements Comparable<Version> {

    /**
     * The major number (ie 1.x.x).
     */
    private int major;

    /**
     * The minor version number (ie x.1.x).
     */
    private int minor;

    /**
     * The micro version number (ie x.x.1).
     */
    private int micro;

    /**
     * A status release number or -1 to indicate none.
     */
    private int statusVersion;

    /**
     * The release state of the product (Release, Release Candidate).
     */
    private ReleaseStatus status;

    /**
     * Cached version string information
     */
    private String versionString;

    /**
     * Create a new version information object.
     *
     * @param major the major release number.
     * @param minor the minor release number.
     * @param micro the micro release number.
     * @param status the status of the release.
     */
    public Version(int major, int minor, int micro, ReleaseStatus status, int statusVersion) {
        this.major = major;
        this.minor = minor;
        this.micro = micro;
        this.status = status;
        this.statusVersion = statusVersion;
    }
    
    /**
     * Create a new version from a simple version string (e.g. "3.9.3")
     * 
     * @param source the version string
     */
    public Version(String source) {
    	// initialize the defaults
    	major = minor = micro = 0;
    	status = ReleaseStatus.Release;
    	statusVersion = -1;
    	
    	if (source != null) {
        	StringTokenizer parser = new StringTokenizer(source, ".");
    		try {
    			major = parser.hasMoreTokens() ? Integer.parseInt(parser.nextToken()) : 0;
    			minor = parser.hasMoreTokens() ? Integer.parseInt(parser.nextToken()) : 0;
    			micro = parser.hasMoreTokens() ? Integer.parseInt(parser.nextToken()) : 0;
    		}
    		catch (NumberFormatException nfe) {
    			// ignore bad version
    		}
    	}  	
    }

    /**
     * Returns the version number of this instance of Openfire as a
     * String (ie major.minor.revision).
     *
     * @return The version as a string
     */
    public String getVersionString() {
    	if (versionString == null) {
            if (status != null) {
                if (status == ReleaseStatus.Release) {
                    versionString = major + "." + minor + "." + micro;
                }
                else {
                    if (statusVersion >= 0) {
                        versionString = major + "." + minor + "." + micro + " " + status.toString() +
                                " " + statusVersion;
                    }
                    else {
                        versionString = major + "." + minor + "." + micro + " " + status.toString();
                    }
                }
            }
            else {
                versionString = major + "." + minor + "." + micro;
            }
    		
    	}
        return versionString;
    }

    /**
     * Returns the release status of this product.
     *
     * @return the release status of this product.
     */
    public ReleaseStatus getStatus() {
        return status;
    }

    /**
     * Obtain the major release number for this product.
     *
     * @return The major release number 1.x.x
     */
    public int getMajor() {
        return major;
    }

    /**
     * Obtain the minor release number for this product.
     *
     * @return The minor release number x.1.x
     */
    public int getMinor() {
        return minor;
    }

    /**
     * Obtain the micro release number for this product.
     *
     * @return The micro release number x.x.1
     */
    public int getMicro() {
        return micro;
    }

    /**
     * Obtain the status release number for this product. For example, if
     * the release status is <strong>alpha</strong> the release may be <strong>5</strong>
     * resulting in a release status of <strong>Alpha 5</strong>.
     *
     * @return The status version or -1 if none is set.
     */
    public int getStatusVersion() {
        return statusVersion;
    }

    /**
     * A class to represent the release status of the server. Product releases
     * are indicated by type safe enum constants.
     */
    public enum ReleaseStatus {
        Release(""), Release_Candidate("RC"), Beta("Beta"), Alpha("Alpha");

        private String status;

        private ReleaseStatus(String status) {
            this.status = status;
        }

        @Override
		public String toString() {
            return status;
        }
    }
    
    /**
     * Convenience method for comparing versions
     * 
     * @param otherVersion a verion to compare against
     */
    public boolean isNewerThan(Version otherVersion) {
    	return this.compareTo(otherVersion) > 0;
    }

	@Override
	public int compareTo(Version that) {
		if (that == null) {
			return 1;
		}
		
		long thisVersion = (this.getMicro()*10) + (this.getMinor()*1000) + (this.getMajor()*100000);
		long thatVersion = (that.getMicro()*10) + (that.getMinor()*1000) + (that.getMajor()*100000);
		
		return thisVersion == thatVersion ? 0 : thisVersion > thatVersion ? 1 : -1;
	}
}
