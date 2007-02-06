<?xml version="1.0" ?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:ignite="http://www.igniterealtime.org/xmlns/downloadstats/rss"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:content="http://purl.org/rss/1.0/modules/content/">

    <xsl:template match="/">
        <xsl:apply-templates/>
    </xsl:template>

    <xsl:template match="channel">
		  <xsl:for-each select="item">
              <xsl:choose>
              <!-- Only show first 5 blog entries. -->
              <xsl:when test="position() < 6">
              <!-- BEGIN blog entry -->
              <!-- Test for even or odd -->
              <xsl:variable name="css_even_odd">
                  <xsl:choose>
                      <xsl:when test="position() mod 2 = 0">ignite_blog_entry ignite_blog_entry_odd</xsl:when>
                      <xsl:when test="position() mod 2 = 1">ignite_blog_entry</xsl:when>
                  </xsl:choose>
              </xsl:variable>

              <div><xsl:attribute name="class"><xsl:value-of select="$css_even_odd" /></xsl:attribute>

                  <!-- BEGIN blog entry header area -->
                  <div class="ignite_blog_entry_header">
                      <!-- BEGIN blog author avatar -->
                      <xsl:variable name="avatar">
                          <xsl:choose>
                              <xsl:when test="dc:creator = 'gato'">/images/avatars/gato.png</xsl:when>
                              <xsl:when test="dc:creator = 'matt'">/images/avatars/matt.png</xsl:when>
                              <xsl:when test="dc:creator = 'alex'">/images/avatars/alex.png</xsl:when>
                              <xsl:when test="dc:creator = 'derek'">/images/avatars/derek.png</xsl:when>
                              <xsl:when test="dc:creator = 'greg'">/images/avatars/greg.png</xsl:when>
                              <xsl:when test="dc:creator = 'thiago'">/images/avatars/thiago.png</xsl:when>
                              <xsl:when test="dc:creator = 'jadestorm'">/images/avatars/jadestorm.png</xsl:when>
                              <!-- need nick@lymabean -->
                              <xsl:otherwise>/images/default-avatar-new-32x32.png</xsl:otherwise>
                          </xsl:choose>
                      </xsl:variable>

                      <img>
                          <xsl:attribute name="src"><xsl:value-of select="$avatar" /></xsl:attribute>
                          <xsl:attribute name="alt"><xsl:value-of select="dc:creator"/></xsl:attribute>
                          <xsl:attribute name="width">32</xsl:attribute>
                          <xsl:attribute name="height">32</xsl:attribute>
                      </img>
                      <!--<img src="/images/default-avatar-new-32x32.png" width="32" height="32" alt="" />-->
                      <!-- END blog author avatar -->

                      <!-- BEGIN blog comments bubble -->
                      <div class="ignite_blog_entry_comments">
                          <a><xsl:attribute name="href"><xsl:value-of select="comments"/></xsl:attribute>
                              <xsl:value-of select="ignite:commentCount" />
                          </a>
                      </div>
                      <!-- END blog comments bubble -->

                      <!-- BEGIN blog entry title -->
                      <h2><a><xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute><xsl:value-of select="title" /></a></h2>
                      <!-- END blog entry title -->

                      <!-- BEGIN blog entry author and datestamp -->
                      <span class="ignite_blog_entry_author">
                          Posted by <a><xsl:attribute name="href">http://www.igniterealtime.org/blog/author/<xsl:value-of select="dc:creator"/></xsl:attribute><xsl:value-of select="dc:creator"/></a>
                      </span>
                      <span class="ignite_blog_entry_date">
                        <xsl:variable name="d" select="pubDate"/>
                        <xsl:call-template name="format-date">
                             <xsl:with-param name="date" select="$d" />
                             <xsl:with-param name="format" select="3" />
                        </xsl:call-template>
                      </span>
                      <!-- END blog entry author and datestamp -->
                  </div>
                  <!-- END blog entry header area -->

                  <!-- BEGIN blog entry body area -->
                  <div class="ignite_blog_entry_body">
                      <xsl:value-of select="content:encoded" disable-output-escaping="yes"/>
                  </div>
                  <!-- END blog entry body area -->

                  <!-- BEGIN blog entry details -->
                  <div class="ignite_blog_entry_details">
                      <span class="ignite_blog_entry_details_tags">Tags:
                          <xsl:for-each select="category">
                              <xsl:if test="position() &gt; 1">, </xsl:if>
                              <a><xsl:attribute name="href">http://www.igniterealtime.org/blog/category/<xsl:value-of select="." /></xsl:attribute><xsl:value-of select="." /></a>
                          </xsl:for-each>
                      </span>
                      <span class="ignite_blog_entry_details_comments">
                          <a><xsl:attribute name="href"><xsl:value-of select="comments"/></xsl:attribute>
                              <xsl:value-of select="ignite:commentCount" />
                          </a>
                      </span>
                  </div>
                  <!-- END blog entry details-->

              </div>
              <!-- END blog entry -->
              </xsl:when></xsl:choose> 
          </xsl:for-each>
    </xsl:template>

    <!-- 1/8/04  01.08.04   January 8 2004 -->
    <xsl:template name="format-date">
        <xsl:param name="date" />
        <xsl:param name="format" select="0" />

        <xsl:variable name="day" select="substring-before(substring-after($date, ' '), ' ')" />
        <xsl:variable name="monthName" select="substring-before(substring-after(substring-after($date, ' '), ' '), ' ')" />
        <xsl:variable name="year" select="substring-before(substring-after(substring-after(substring-after($date, ' '), ' '), ' '), ' ')" />

        <xsl:variable name="month" select="substring(substring-after('Jan01Feb02Mar03Apr04May05Jun06Jul07Aug08Sep09Oct10Nov11Dec12', $monthName), 1, 2)" />

        <xsl:variable name="monthNameFull">
            <xsl:choose>
                <xsl:when test="$month = '01'">January</xsl:when>
                <xsl:when test="$month = '02'">February</xsl:when>
                <xsl:when test="$month = '03'">March</xsl:when>
                <xsl:when test="$month = '04'">April</xsl:when>
                <xsl:when test="$month = '05'">May</xsl:when>
                <xsl:when test="$month = '06'">June</xsl:when>
                <xsl:when test="$month = '07'">July</xsl:when>
                <xsl:when test="$month = '08'">August</xsl:when>
                <xsl:when test="$month = '09'">September</xsl:when>
                <xsl:when test="$month = '10'">October</xsl:when>
                <xsl:when test="$month = '11'">November</xsl:when>
                <xsl:when test="$month = '12'">December</xsl:when>
            </xsl:choose>
        </xsl:variable>

        <xsl:variable name="day2" select="concat(translate(substring($day,1,1), '0', ''), substring($day,2,1))" />
        <xsl:variable name="month2" select="concat(translate(substring($month,1,1), '0', ''), substring($month,2,1))" />

        <xsl:choose>
            <xsl:when test="$format = 1">
                <xsl:value-of select="concat($month2, '/', $day2, '/', substring($year, 3))" />
            </xsl:when>
            <xsl:when test="$format = 2">
                <xsl:value-of select="concat($month, '.', $day, '.', substring($year, 3))" />
            </xsl:when>
            <xsl:when test="$format = 3">
                <xsl:value-of select="concat($monthNameFull, ' ', $day2, ', ', $year)" />
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="$date" />
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template match="text()"/>

</xsl:stylesheet>



