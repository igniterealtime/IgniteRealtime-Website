
<script language="JavaScript" type="text/javascript">
/* BEGIN random quote rotation function */
function rotatequotes() {

var quotes=new Array()

quotes[0] = document.getElementById('igniteQuote1');
quotes[1] = document.getElementById('igniteQuote2');
quotes[2] = document.getElementById('igniteQuote3');


var whichquote=Math.floor(Math.random()*(quotes.length));

var theQuote = quotes[whichquote];

quotes[0].style.display = 'none';
quotes[0].style.visibility = 'hidden';
quotes[1].style.display = 'none';
quotes[1].style.visibility = 'hidden';
quotes[2].style.display = 'none';
quotes[2].style.visibility = 'hidden';

theQuote.style.display = 'block';
theQuote.style.visibility = 'visible';

}
/* END random quote rotation function */
</script>


				<div id="igniteQuote1" style="display: none; visibility: hidden">
					<div class="ignite_sidebar_body_quote">
						<p>The interaction with talented developers and with enthusiasts from around the world makes working with Openfire and Spark very enjoyable. IgniteRealtime.org opens exciting new ways for this vibrant community to share ideas and work together.</p>
					</div>
					<div class="ignite_sidebar_body_attrib">
						&ndash; <a href="#">bhenson</a> 
						<img src="<%=request.getContextPath()%>/images/ignite_avatar_16x16_temp.gif" width="16" height="16" alt="" />
					</div>
				</div>
				
				<div id="igniteQuote2" style="display: none; visibility: hidden">
					<div class="ignite_sidebar_body_quote">
						<p>TThe interaction with talented developers and with enthusiasts from around the world makes working with Openfire and Spark very enjoyable. IgniteRealtime.org opens exciting new ways for this vibrant community to share ideas and work together.</p>
					</div>
					<div class="ignite_sidebar_body_attrib">
						&ndash; <a href="#">captain amazing</a> 
						<img src="<%=request.getContextPath()%>/images/ignite_avatar_16x16_temp.gif" width="16" height="16" alt="" />
					</div>
				</div>
				
				<div id="igniteQuote3" style="display: none; visibility: hidden">
					<div class="ignite_sidebar_body_quote">
						<p>The interaction with talented developers and with enthusiasts from around the world makes working with Openfire and Spark very enjoyable. IgniteRealtime.org opens exciting new ways for this vibrant community to share ideas and work together.</p>
					</div>
					<div class="ignite_sidebar_body_attrib">
						&ndash; <a href="#">ryanvanderzanden</a> 
						<img src="<%=request.getContextPath()%>/images/ignite_avatar_16x16_temp.gif" width="16" height="16" alt="" />
					</div>
				</div>
