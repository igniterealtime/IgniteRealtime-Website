<?xml version="1.0" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="/">
        <xsl:apply-templates/>
    </xsl:template>
		
    <xsl:template match="channel">
		  <xsl:for-each select="item">				
		     <div class="ignite_sidebar_forum ignite_sidebar_forum_{position() mod 2}">
					<img src="/images/ignite_avatar_16x16_temp.gif" width="16" height="16" alt="" />
					<div>
					<b><xsl:value-of select="jf:author"/></b> in
					"<a><xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
					<xsl:attribute name="title">Posted <xsl:value-of select="jf:date"/></xsl:attribute>
          <xsl:value-of select="title"/></a>"
		  			</div>
			   </div>
		  </xsl:for-each>		
    </xsl:template>

    <xsl:template match="text()"/>

</xsl:stylesheet>