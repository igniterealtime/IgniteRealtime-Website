<?xml version="1.0" ?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:ignite="http://www.igniterealtime.org/xmlns/downloadstats/rss">

    <xsl:template match="/">
        <xsl:apply-templates/>
    </xsl:template>

    <xsl:template match="channel">
        <div class="ignite_sidebar_body_stat"><span>Blog Entries</span> <strong>
        <xsl:choose>
            <xsl:when test="ignite:numposts"><xsl:value-of select="format-number(ignite:numposts, '###,###,###,###')" /></xsl:when>
            <xsl:otherwise>n/a</xsl:otherwise>
        </xsl:choose>
        </strong></div>
    </xsl:template>

    <xsl:template match="text()"/>

</xsl:stylesheet>