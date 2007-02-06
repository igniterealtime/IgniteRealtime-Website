<?xml version="1.0" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
	<xsl:apply-templates/>
</xsl:template>

  <xsl:template match="channel">
		  <xsl:for-each select="item">
        
				<div class="ignite_sidebar_issue ignite_sidebar_issue_{position() mod 2}">
				<xsl:apply-templates />
				<div><a>
            <xsl:attribute name="HREF">
            <xsl:value-of select="link"/>
            </xsl:attribute>
            <xsl:value-of select="title"/>
        </a></div>
				</div>
				</xsl:for-each>		
    </xsl:template>

  <xsl:template match="type">
	<xsl:choose>
	<xsl:when test="@id='2'">
		<IMG SRC="/images/ignite_issue-green_16x16.gif" title="New Feature">
		<xsl:attribute name="New Feature"><xsl:value-of select="." /></xsl:attribute>
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
