<?xml version="1.0" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

		<xsl:template match="/">
        <xsl:apply-templates/>
    </xsl:template>

    <xsl:template match="item">
       <div class="news">
							 <font color="#888888"><xsl:value-of select="jf:date"/> - </font> 
							 <a><xsl:attribute name="href">
                  <xsl:value-of select="link"/>
                  </xsl:attribute>
                  <xsl:value-of select="title"/>
                </a>
					</div>
    </xsl:template>
    <xsl:template match="text()"/>
</xsl:stylesheet>