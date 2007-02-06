<?xml version="1.0" ?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:jf="http://www.jivesoftware.com/xmlns/jiveforums/rss">

    <xsl:template match="/">
        <xsl:apply-templates/>
    </xsl:template>

    <xsl:template match="item">
        <div class="ignite_sidebar_body_stat"><span>Members</span> <strong>
        <xsl:choose>
            <xsl:when test="jf:numUsers"><xsl:value-of select="format-number(jf:numUsers, '###,###,###,###')" /></xsl:when>
            <xsl:otherwise>n/a</xsl:otherwise>
        </xsl:choose>
        </strong></div>
        
        <div class="ignite_sidebar_body_stat"><span>Forum Posts</span> <strong>
        <xsl:choose>
            <xsl:when test="jf:numMessages"><xsl:value-of select="format-number(jf:numMessages, '###,###,###,###')" /></xsl:when>
            <xsl:otherwise>n/a</xsl:otherwise>
        </xsl:choose>
        </strong></div>
    </xsl:template>

    <xsl:template match="text()"/>

</xsl:stylesheet>