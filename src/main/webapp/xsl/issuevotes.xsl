<?xml version="1.0" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
	<xsl:apply-templates/>
</xsl:template>

  <xsl:template match="channel">
       <table border="0" cellpadding="2" width="100%">
           <tr>
               <th colspan="2">Issue</th>
               <th>Product</th>
               <th>Votes</th>
           </tr>
          <xsl:for-each select="item">
            <tr>
                <td>
            <xsl:apply-templates />
              </td>
              <td><a>
            <xsl:attribute name="HREF">
            <xsl:value-of select="link"/>
            </xsl:attribute>
            <xsl:value-of select="title"/>
            </a>
                </td>
                <td>
                    <xsl:choose>
                        <xsl:when test="starts-with(key, 'JM')">
                            Openfire (formerly Wildfire)
                        </xsl:when>
                        <xsl:when test="starts-with(key, 'SPARK')">
                            Spark
                        </xsl:when>
                        <xsl:when test="starts-with(key, 'ENT')">
                            Openfire Business Edition
                        </xsl:when>
                        <xsl:when test="starts-with(key, 'SMACK')">
                            Smack
                        </xsl:when>
                        <xsl:when test="starts-with(key, 'TINDER')">
                            Tinder
                        </xsl:when>
                        <xsl:when test="starts-with(key, 'XIFF')">
                            XIFF
                        </xsl:when>
                        <xsl:when test="starts-with(key, 'GATE')">
                            IM Gateway Plugin
                        </xsl:when>
                        <xsl:otherwise>
                            Other
                        </xsl:otherwise>
                    </xsl:choose>
                </td>
                <td align="center"><xsl:value-of select="votes" /></td>
            </tr>
        </xsl:for-each>
       </table>
    </xsl:template>

  <xsl:template match="type">
	<xsl:choose>
	<xsl:when test="@id='2'">
		<IMG SRC="/images/ignite_issue-green_16x16.gif" title="NewFeature">
		<xsl:attribute name="NewFeature"><xsl:value-of select="." /></xsl:attribute>
		</IMG>
	</xsl:when>
	<xsl:when test="@id='4'">
		<IMG SRC="/images/ignite_issue-orange_16x16.gif" title="Improvement">
		<xsl:attribute name="Improvement"><xsl:value-of select="." /></xsl:attribute>
		</IMG>
	</xsl:when>
	<xsl:when test="@id='3'">
		<IMG SRC="/images/ignite_issue-orange_16x16.gif" title="Task">
		<xsl:attribute name="Task"><xsl:value-of select="." /></xsl:attribute>
		</IMG>
	</xsl:when>
    <xsl:when test="@id='5'">
		<IMG SRC="/images/ignite_issue-orange_16x16.gif" title="Task">
		<xsl:attribute name="Task"><xsl:value-of select="." /></xsl:attribute>
		</IMG>
	</xsl:when>
    <xsl:when test="@id='1'">
		<IMG SRC="/images/ignite_issue-red_16x16.gif" title="Bug">
		<xsl:attribute name="Bug"><xsl:value-of select="." /></xsl:attribute>
		</IMG>
	</xsl:when>
	<xsl:otherwise />
	</xsl:choose>
	<xsl:value-of select="' '" />

  </xsl:template>

  <xsl:template match="text()"/>

</xsl:stylesheet>
