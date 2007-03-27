var strftime_funks={zeropad:function(n){
return n>9?n:"0"+n;
},a:function(t){
return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][t.getDay()];
},A:function(t){
return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][t.getDay()];
},b:function(t){
return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][t.getMonth()];
},B:function(t){
return ["January","February","March","April","May","June","July","August","September","October","November","December"][t.getMonth()];
},c:function(t){
return t.toString();
},d:function(t){
return this.zeropad(t.getDate());
},e:function(t){
return t.getDate();
},F:function(t){
return t.getMilliseconds();
},H:function(t){
return this.zeropad(t.getHours());
},I:function(t){
var _c=((t.getHours()+12)%12);
return this.zeropad((_c==0)?12:_c);
},"1I":function(t){
var _e=((t.getHours()+12)%12);
return ((_e==0)?12:_e);
},j:function(t){
var Y=t.getFullYear(),M=t.getMonth(),D=t.getDate();
M++;
var K=2-(Y%4==0);
return Math.floor(275*M/9)-K*(M>2)+D-30;
},m:function(t){
return this.zeropad(t.getMonth()+1);
},M:function(t){
return this.zeropad(t.getMinutes());
},p:function(t){
return this.H(t)<12?"AM":"PM";
},S:function(t){
return this.zeropad(t.getSeconds());
},w:function(t){
return t.getDay();
},x:function(t){
return t.toDateString();
},X:function(t){
return t.toTimeString();
},y:function(t){
return this.zeropad(this.Y(t)%100);
},Y:function(t){
return t.getFullYear();
},z:function(t){
var _1e=t.getTimezoneOffset();
var h=Math.floor(_1e/60);
var m=_1e-(h*60);
return this.zeropad(h)+""+this.zeropad(m);
},Z:function(t){
return this.z(t);
},"%":function(t){
return "%";
}};
var strftime=function(t,fmt){
for(var s in strftime_funks){
if((s.length==1||s.length==2)&&fmt.indexOf(s)>-1){
fmt=fmt.replace("%"+s,strftime_funks[s](t));
}
}
return fmt;
};


function Sarissa(){
}
Sarissa.PARSED_OK="Document contains no parsing errors";
Sarissa.PARSED_EMPTY="Document is empty";
Sarissa.PARSED_UNKNOWN_ERROR="Not well-formed or other error";
var _sarissa_iNsCounter=0;
var _SARISSA_IEPREFIX4XSLPARAM="";
var _SARISSA_HAS_DOM_IMPLEMENTATION=document.implementation&&true;
var _SARISSA_HAS_DOM_CREATE_DOCUMENT=_SARISSA_HAS_DOM_IMPLEMENTATION&&document.implementation.createDocument;
var _SARISSA_HAS_DOM_FEATURE=_SARISSA_HAS_DOM_IMPLEMENTATION&&document.implementation.hasFeature;
var _SARISSA_IS_MOZ=_SARISSA_HAS_DOM_CREATE_DOCUMENT&&_SARISSA_HAS_DOM_FEATURE;
var _SARISSA_IS_SAFARI=(navigator.userAgent&&navigator.vendor&&(navigator.userAgent.toLowerCase().indexOf("applewebkit")!=-1||navigator.vendor.indexOf("Apple")!=-1));
var _SARISSA_IS_IE=document.all&&window.ActiveXObject&&navigator.userAgent.toLowerCase().indexOf("msie")>-1&&navigator.userAgent.toLowerCase().indexOf("opera")==-1;
if(!window.Node||!Node.ELEMENT_NODE){
Node={ELEMENT_NODE:1,ATTRIBUTE_NODE:2,TEXT_NODE:3,CDATA_SECTION_NODE:4,ENTITY_REFERENCE_NODE:5,ENTITY_NODE:6,PROCESSING_INSTRUCTION_NODE:7,COMMENT_NODE:8,DOCUMENT_NODE:9,DOCUMENT_TYPE_NODE:10,DOCUMENT_FRAGMENT_NODE:11,NOTATION_NODE:12};
}
if(typeof XMLDocument=="undefined"&&typeof Document!="undefined"){
XMLDocument=Document;
}
if(_SARISSA_IS_IE){
_SARISSA_IEPREFIX4XSLPARAM="xsl:";
var _SARISSA_DOM_PROGID="";
var _SARISSA_XMLHTTP_PROGID="";
var _SARISSA_DOM_XMLWRITER="";
Sarissa.pickRecentProgID=function(_1){
var _2=false;
for(var i=0;i<_1.length&&!_2;i++){
try{
var _4=new ActiveXObject(_1[i]);
o2Store=_1[i];
_2=true;
}
catch(objException){
}
}
if(!_2){
throw "Could not retreive a valid progID of Class: "+_1[_1.length-1]+". (original exception: "+e+")";
}
_1=null;
return o2Store;
};
_SARISSA_DOM_PROGID=null;
_SARISSA_THREADEDDOM_PROGID=null;
_SARISSA_XSLTEMPLATE_PROGID=null;
_SARISSA_XMLHTTP_PROGID=null;
if(!window.XMLHttpRequest){
XMLHttpRequest=function(){
if(!_SARISSA_XMLHTTP_PROGID){
_SARISSA_XMLHTTP_PROGID=Sarissa.pickRecentProgID(["Msxml2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"]);
}
return new ActiveXObject(_SARISSA_XMLHTTP_PROGID);
};
}
Sarissa.getDomDocument=function(_5,_6){
if(!_SARISSA_DOM_PROGID){
_SARISSA_DOM_PROGID=Sarissa.pickRecentProgID(["Msxml2.DOMDocument.6.0","Msxml2.DOMDocument.3.0","MSXML2.DOMDocument","MSXML.DOMDocument","Microsoft.XMLDOM"]);
}
var _7=new ActiveXObject(_SARISSA_DOM_PROGID);
if(_6){
var _8="";
if(_5){
if(_6.indexOf(":")>1){
_8=_6.substring(0,_6.indexOf(":"));
_6=_6.substring(_6.indexOf(":")+1);
}else{
_8="a"+(_sarissa_iNsCounter++);
}
}
if(_5){
_7.loadXML("<"+_8+":"+_6+" xmlns:"+_8+"=\""+_5+"\""+" />");
}else{
_7.loadXML("<"+_6+" />");
}
}
return _7;
};
Sarissa.getParseErrorText=function(_9){
var _a=Sarissa.PARSED_OK;
if(_9.parseError.errorCode!=0){
_a="XML Parsing Error: "+_9.parseError.reason+"\nLocation: "+_9.parseError.url+"\nLine Number "+_9.parseError.line+", Column "+_9.parseError.linepos+":\n"+_9.parseError.srcText+"\n";
for(var i=0;i<_9.parseError.linepos;i++){
_a+="-";
}
_a+="^\n";
}else{
if(_9.documentElement==null){
_a=Sarissa.PARSED_EMPTY;
}
}
return _a;
};
Sarissa.setXpathNamespaces=function(_c,_d){
_c.setProperty("SelectionLanguage","XPath");
_c.setProperty("SelectionNamespaces",_d);
};
XSLTProcessor=function(){
if(!_SARISSA_XSLTEMPLATE_PROGID){
_SARISSA_XSLTEMPLATE_PROGID=Sarissa.pickRecentProgID(["Msxml2.XSLTemplate.6.0","MSXML2.XSLTemplate.3.0"]);
}
this.template=new ActiveXObject(_SARISSA_XSLTEMPLATE_PROGID);
this.processor=null;
};
XSLTProcessor.prototype.importStylesheet=function(_e){
if(!_SARISSA_THREADEDDOM_PROGID){
_SARISSA_THREADEDDOM_PROGID=Sarissa.pickRecentProgID(["MSXML2.FreeThreadedDOMDocument.6.0","MSXML2.FreeThreadedDOMDocument.3.0"]);
}
_e.setProperty("SelectionLanguage","XPath");
_e.setProperty("SelectionNamespaces","xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
var _f=new ActiveXObject(_SARISSA_THREADEDDOM_PROGID);
if(_e.url&&_e.selectSingleNode("//xsl:*[local-name() = 'import' or local-name() = 'include']")!=null){
_f.async=false;
if(_SARISSA_THREADEDDOM_PROGID=="MSXML2.FreeThreadedDOMDocument.6.0"){
_f.setProperty("AllowDocumentFunction",true);
_f.resolveExternals=true;
}
_f.load(_e.url);
}else{
_f.loadXML(_e.xml);
}
_f.setProperty("SelectionNamespaces","xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
var _10=_f.selectSingleNode("//xsl:output");
this.outputMethod=_10?_10.getAttribute("method"):"html";
this.template.stylesheet=_f;
this.processor=this.template.createProcessor();
this.paramsSet=new Array();
};
XSLTProcessor.prototype.transformToDocument=function(_11){
if(_SARISSA_THREADEDDOM_PROGID){
this.processor.input=_11;
var _12=new ActiveXObject(_SARISSA_DOM_PROGID);
this.processor.output=_12;
this.processor.transform();
return _12;
}else{
if(!_SARISSA_DOM_XMLWRITER){
_SARISSA_DOM_XMLWRITER=Sarissa.pickRecentProgID(["Msxml2.MXXMLWriter.6.0","Msxml2.MXXMLWriter.3.0","MSXML2.MXXMLWriter","MSXML.MXXMLWriter","Microsoft.XMLDOM"]);
}
this.processor.input=_11;
var _12=new ActiveXObject(_SARISSA_DOM_XMLWRITER);
this.processor.output=_12;
this.processor.transform();
var _13=new ActiveXObject(_SARISSA_DOM_PROGID);
_13.loadXML(_12.output+"");
return _13;
}
};
XSLTProcessor.prototype.transformToFragment=function(_14,_15){
this.processor.input=_14;
this.processor.transform();
var s=this.processor.output;
var f=_15.createDocumentFragment();
if(this.outputMethod=="text"){
f.appendChild(_15.createTextNode(s));
}else{
if(_15.body&&_15.body.innerHTML){
var _18=_15.createElement("div");
_18.innerHTML=s;
while(_18.hasChildNodes()){
f.appendChild(_18.firstChild);
}
}else{
var _19=new ActiveXObject(_SARISSA_DOM_PROGID);
if(s.substring(0,5)=="<?xml"){
s=s.substring(s.indexOf("?>")+2);
}
var xml="".concat("<my>",s,"</my>");
_19.loadXML(xml);
var _18=_19.documentElement;
while(_18.hasChildNodes()){
f.appendChild(_18.firstChild);
}
}
}
return f;
};
XSLTProcessor.prototype.setParameter=function(_1b,_1c,_1d){
if(_1b){
this.processor.addParameter(_1c,_1d,_1b);
}else{
this.processor.addParameter(_1c,_1d);
}
if(!this.paramsSet[""+_1b]){
this.paramsSet[""+_1b]=new Array();
}
this.paramsSet[""+_1b][_1c]=_1d;
};
XSLTProcessor.prototype.getParameter=function(_1e,_1f){
_1e=_1e||"";
if(this.paramsSet[_1e]&&this.paramsSet[_1e][_1f]){
return this.paramsSet[_1e][_1f];
}else{
return null;
}
};
XSLTProcessor.prototype.clearParameters=function(){
for(var _20 in this.paramsSet){
for(var _21 in this.paramsSet[_20]){
if(_20){
this.processor.addParameter(_21,null,_20);
}else{
this.processor.addParameter(_21,null);
}
}
}
this.paramsSet=new Array();
};
}else{
if(_SARISSA_HAS_DOM_CREATE_DOCUMENT){
Sarissa.__handleLoad__=function(_22){
Sarissa.__setReadyState__(_22,4);
};
_sarissa_XMLDocument_onload=function(){
Sarissa.__handleLoad__(this);
};
Sarissa.__setReadyState__=function(_23,_24){
_23.readyState=_24;
_23.readystate=_24;
if(_23.onreadystatechange!=null&&typeof _23.onreadystatechange=="function"){
_23.onreadystatechange();
}
};
Sarissa.getDomDocument=function(_25,_26){
var _27=document.implementation.createDocument(_25?_25:null,_26?_26:null,null);
if(!_27.onreadystatechange){
_27.onreadystatechange=null;
}
if(!_27.readyState){
_27.readyState=0;
}
_27.addEventListener("load",_sarissa_XMLDocument_onload,false);
return _27;
};
if(window.XMLDocument){
}else{
if(_SARISSA_HAS_DOM_FEATURE&&window.Document&&!Document.prototype.load&&document.implementation.hasFeature("LS","3.0")){
Sarissa.getDomDocument=function(_28,_29){
var _2a=document.implementation.createDocument(_28?_28:null,_29?_29:null,null);
return _2a;
};
}else{
Sarissa.getDomDocument=function(_2b,_2c){
var _2d=document.implementation.createDocument(_2b?_2b:null,_2c?_2c:null,null);
if(_2d&&(_2b||_2c)&&!_2d.documentElement){
_2d.appendChild(_2d.createElementNS(_2b,_2c));
}
return _2d;
};
}
}
}
}
if(!window.DOMParser){
if(_SARISSA_IS_SAFARI){
DOMParser=function(){
};
DOMParser.prototype.parseFromString=function(_2e,_2f){
var _30=new XMLHttpRequest();
_30.open("GET","data:text/xml;charset=utf-8,"+encodeURIComponent(_2e),false);
_30.send(null);
return _30.responseXML;
};
}else{
if(Sarissa.getDomDocument&&Sarissa.getDomDocument()&&Sarissa.getDomDocument(null,"bar").xml){
DOMParser=function(){
};
DOMParser.prototype.parseFromString=function(_31,_32){
var doc=Sarissa.getDomDocument();
doc.loadXML(_31);
return doc;
};
}
}
}
if((typeof (document.importNode)=="undefined")&&_SARISSA_IS_IE){
try{
document.importNode=function(_34,_35){
var tmp;
if(_34.nodeName=="tbody"||_34.nodeName=="tr"){
tmp=document.createElement("table");
}else{
if(_34.nodeName=="td"){
tmp=document.createElement("tr");
}else{
if(_34.nodeName=="option"){
tmp=document.createElement("select");
}else{
tmp=document.createElement("div");
}
}
}
if(_35){
tmp.innerHTML=_34.xml?_34.xml:_34.outerHTML;
}else{
tmp.innerHTML=_34.xml?_34.cloneNode(false).xml:_34.cloneNode(false).outerHTML;
}
return tmp.getElementsByTagName("*")[0];
};
}
catch(e){
}
}
if(!Sarissa.getParseErrorText){
Sarissa.getParseErrorText=function(_37){
var _38=Sarissa.PARSED_OK;
if(!_37.documentElement){
_38=Sarissa.PARSED_EMPTY;
}else{
if(_37.documentElement.tagName=="parsererror"){
_38=_37.documentElement.firstChild.data;
_38+="\n"+_37.documentElement.firstChild.nextSibling.firstChild.data;
}else{
if(_37.getElementsByTagName("parsererror").length>0){
var _39=_37.getElementsByTagName("parsererror")[0];
_38=Sarissa.getText(_39,true)+"\n";
}else{
if(_37.parseError&&_37.parseError.errorCode!=0){
_38=Sarissa.PARSED_UNKNOWN_ERROR;
}
}
}
}
return _38;
};
}
Sarissa.getText=function(_3a,_3b){
var s="";
var _3d=_3a.childNodes;
for(var i=0;i<_3d.length;i++){
var _3f=_3d[i];
var _40=_3f.nodeType;
if(_40==Node.TEXT_NODE||_40==Node.CDATA_SECTION_NODE){
s+=_3f.data;
}else{
if(_3b==true&&(_40==Node.ELEMENT_NODE||_40==Node.DOCUMENT_NODE||_40==Node.DOCUMENT_FRAGMENT_NODE)){
s+=Sarissa.getText(_3f,true);
}
}
}
return s;
};
if(!window.XMLSerializer&&Sarissa.getDomDocument&&Sarissa.getDomDocument("","foo",null).xml){
XMLSerializer=function(){
};
XMLSerializer.prototype.serializeToString=function(_41){
return _41.xml;
};
}
Sarissa.stripTags=function(s){
return s.replace(/<[^>]+>/g,"");
};
Sarissa.clearChildNodes=function(_43){
while(_43.firstChild){
_43.removeChild(_43.firstChild);
}
};
Sarissa.copyChildNodes=function(_44,_45,_46){
if((!_44)||(!_45)){
throw "Both source and destination nodes must be provided";
}
if(!_46){
Sarissa.clearChildNodes(_45);
}
var _47=_45.nodeType==Node.DOCUMENT_NODE?_45:_45.ownerDocument;
var _48=_44.childNodes;
if(typeof (_47.importNode)!="undefined"){
for(var i=0;i<_48.length;i++){
_45.appendChild(_47.importNode(_48[i],true));
}
}else{
for(var i=0;i<_48.length;i++){
_45.appendChild(_48[i].cloneNode(true));
}
}
};
Sarissa.moveChildNodes=function(_4a,_4b,_4c){
if((!_4a)||(!_4b)){
throw "Both source and destination nodes must be provided";
}
if(!_4c){
Sarissa.clearChildNodes(_4b);
}
var _4d=_4a.childNodes;
if(_4a.ownerDocument==_4b.ownerDocument){
while(_4a.firstChild){
_4b.appendChild(_4a.firstChild);
}
}else{
var _4e=_4b.nodeType==Node.DOCUMENT_NODE?_4b:_4b.ownerDocument;
if(typeof (_4e.importNode)!="undefined"){
for(var i=0;i<_4d.length;i++){
_4b.appendChild(_4e.importNode(_4d[i],true));
}
}else{
for(var i=0;i<_4d.length;i++){
_4b.appendChild(_4d[i].cloneNode(true));
}
}
Sarissa.clearChildNodes(_4a);
}
};
Sarissa.xmlize=function(_50,_51,_52){
_52=_52?_52:"";
var s=_52+"<"+_51+">";
var _54=false;
if(!(_50 instanceof Object)||_50 instanceof Number||_50 instanceof String||_50 instanceof Boolean||_50 instanceof Date){
s+=Sarissa.escape(""+_50);
_54=true;
}else{
s+="\n";
var _55="";
var _56=_50 instanceof Array;
for(var _57 in _50){
s+=Sarissa.xmlize(_50[_57],(_56?"array-item key=\""+_57+"\"":_57),_52+"   ");
}
s+=_52;
}
return s+=(_51.indexOf(" ")!=-1?"</array-item>\n":"</"+_51+">\n");
};
Sarissa.escape=function(_58){
return _58.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
};
Sarissa.unescape=function(_59){
return _59.replace(/&apos;/g,"'").replace(/&quot;/g,"\"").replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&amp;/g,"&");
};


function getAllChildren(e){
return e.all?e.all:e.getElementsByTagName("*");
}
document.getElementsBySelector=function(_2){
if(!document.getElementsByTagName){
return new Array();
}
var _3=_2.split(" ");
var _4=new Array(document);
for(var i=0;i<_3.length;i++){
token=_3[i].replace(/^\s+/,"").replace(/\s+$/,"");
if(token.indexOf("#")>-1){
var _6=token.split("#");
var _7=_6[0];
var id=_6[1];
var _9=document.getElementById(id);
if(_7&&_9.nodeName.toLowerCase()!=_7){
return new Array();
}
_4=new Array(_9);
continue;
}
if(token.indexOf(".")>-1){
var _6=token.split(".");
var _7=_6[0];
var _a=_6[1];
if(!_7){
_7="*";
}
var _b=new Array;
var _c=0;
for(var h=0;h<_4.length;h++){
var _e;
if(_7=="*"){
_e=getAllChildren(_4[h]);
}else{
_e=_4[h].getElementsByTagName(_7);
}
for(var j=0;j<_e.length;j++){
_b[_c++]=_e[j];
}
}
_4=new Array;
var _10=0;
for(var k=0;k<_b.length;k++){
if(_b[k].className&&_b[k].className.match(new RegExp("\\b"+_a+"\\b"))){
_4[_10++]=_b[k];
}
}
continue;
}
if(token.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/)){
var _7=RegExp.$1;
var _12=RegExp.$2;
var _13=RegExp.$3;
var _14=RegExp.$4;
if(!_7){
_7="*";
}
var _b=new Array;
var _c=0;
for(var h=0;h<_4.length;h++){
var _e;
if(_7=="*"){
_e=getAllChildren(_4[h]);
}else{
_e=_4[h].getElementsByTagName(_7);
}
for(var j=0;j<_e.length;j++){
_b[_c++]=_e[j];
}
}
_4=new Array;
var _10=0;
var _15;
switch(_13){
case "=":
_15=function(e){
return (e.getAttribute(_12)==_14);
};
break;
case "~":
_15=function(e){
return (e.getAttribute(_12).match(new RegExp("\\b"+_14+"\\b")));
};
break;
case "|":
_15=function(e){
return (e.getAttribute(_12).match(new RegExp("^"+_14+"-?")));
};
break;
case "^":
_15=function(e){
return (e.getAttribute(_12).indexOf(_14)==0);
};
break;
case "$":
_15=function(e){
return (e.getAttribute(_12).lastIndexOf(_14)==e.getAttribute(_12).length-_14.length);
};
break;
case "*":
_15=function(e){
return (e.getAttribute(_12).indexOf(_14)>-1);
};
break;
default:
_15=function(e){
return e.getAttribute(_12);
};
}
_4=new Array;
var _10=0;
for(var k=0;k<_b.length;k++){
if(_15(_b[k])){
_4[_10++]=_b[k];
}
}
continue;
}
_7=token;
var _b=new Array;
var _c=0;
for(var h=0;h<_4.length;h++){
var _e=_4[h].getElementsByTagName(_7);
for(var j=0;j<_e.length;j++){
_b[_c++]=_e[j];
}
}
_4=_b;
}
return _4;
};


var Prototype={Version:"1.5.0",BrowserFeatures:{XPath:!!document.evaluate},ScriptFragment:"(?:<script.*?>)((\n|\r|.)*?)(?:</script>)",emptyFunction:function(){
},K:function(x){
return x;
}};
var Class={create:function(){
return function(){
this.initialize.apply(this,arguments);
};
}};
var Abstract=new Object();
Object.extend=function(_2,_3){
for(var _4 in _3){
_2[_4]=_3[_4];
}
return _2;
};
Object.extend(Object,{inspect:function(_5){
try{
if(_5===undefined){
return "undefined";
}
if(_5===null){
return "null";
}
return _5.inspect?_5.inspect():_5.toString();
}
catch(e){
if(e instanceof RangeError){
return "...";
}
throw e;
}
},keys:function(_6){
var _7=[];
for(var _8 in _6){
_7.push(_8);
}
return _7;
},values:function(_9){
var _a=[];
for(var _b in _9){
_a.push(_9[_b]);
}
return _a;
},clone:function(_c){
return Object.extend({},_c);
}});
Function.prototype.bind=function(){
var _d=this,_e=$A(arguments),_f=_e.shift();
return function(){
return _d.apply(_f,_e.concat($A(arguments)));
};
};
Function.prototype.bindAsEventListener=function(_10){
var _11=this,_12=$A(arguments),_10=_12.shift();
return function(_13){
return _11.apply(_10,[(_13||window.event)].concat(_12).concat($A(arguments)));
};
};
Object.extend(Number.prototype,{toColorPart:function(){
var _14=this.toString(16);
if(this<16){
return "0"+_14;
}
return _14;
},succ:function(){
return this+1;
},times:function(_15){
$R(0,this,true).each(_15);
return this;
}});
var Try={these:function(){
var _16;
for(var i=0,_18=arguments.length;i<_18;i++){
var _19=arguments[i];
try{
_16=_19();
break;
}
catch(e){
}
}
return _16;
}};
var PeriodicalExecuter=Class.create();
PeriodicalExecuter.prototype={initialize:function(_1a,_1b){
this.callback=_1a;
this.frequency=_1b;
this.currentlyExecuting=false;
this.registerCallback();
},registerCallback:function(){
this.timer=setInterval(this.onTimerEvent.bind(this),this.frequency*1000);
},stop:function(){
if(!this.timer){
return;
}
clearInterval(this.timer);
this.timer=null;
},onTimerEvent:function(){
if(!this.currentlyExecuting){
try{
this.currentlyExecuting=true;
this.callback(this);
}
finally{
this.currentlyExecuting=false;
}
}
}};
String.interpret=function(_1c){
return _1c==null?"":String(_1c);
};
Object.extend(String.prototype,{gsub:function(_1d,_1e){
var _1f="",_20=this,_21;
_1e=arguments.callee.prepareReplacement(_1e);
while(_20.length>0){
if(_21=_20.match(_1d)){
_1f+=_20.slice(0,_21.index);
_1f+=String.interpret(_1e(_21));
_20=_20.slice(_21.index+_21[0].length);
}else{
_1f+=_20,_20="";
}
}
return _1f;
},sub:function(_22,_23,_24){
_23=this.gsub.prepareReplacement(_23);
_24=_24===undefined?1:_24;
return this.gsub(_22,function(_25){
if(--_24<0){
return _25[0];
}
return _23(_25);
});
},scan:function(_26,_27){
this.gsub(_26,_27);
return this;
},truncate:function(_28,_29){
_28=_28||30;
_29=_29===undefined?"...":_29;
return this.length>_28?this.slice(0,_28-_29.length)+_29:this;
},strip:function(){
return this.replace(/^\s+/,"").replace(/\s+$/,"");
},stripTags:function(){
return this.replace(/<\/?[^>]+>/gi,"");
},stripScripts:function(){
return this.replace(new RegExp(Prototype.ScriptFragment,"img"),"");
},extractScripts:function(){
var _2a=new RegExp(Prototype.ScriptFragment,"img");
var _2b=new RegExp(Prototype.ScriptFragment,"im");
return (this.match(_2a)||[]).map(function(_2c){
return (_2c.match(_2b)||["",""])[1];
});
},evalScripts:function(){
return this.extractScripts().map(function(_2d){
return eval(_2d);
});
},escapeHTML:function(){
var div=document.createElement("div");
var _2f=document.createTextNode(this);
div.appendChild(_2f);
return div.innerHTML;
},unescapeHTML:function(){
var div=document.createElement("div");
div.innerHTML=this.stripTags();
return div.childNodes[0]?(div.childNodes.length>1?$A(div.childNodes).inject("",function(_31,_32){
return _31+_32.nodeValue;
}):div.childNodes[0].nodeValue):"";
},toQueryParams:function(_33){
var _34=this.strip().match(/([^?#]*)(#.*)?$/);
if(!_34){
return {};
}
return _34[1].split(_33||"&").inject({},function(_35,_36){
if((_36=_36.split("="))[0]){
var _37=decodeURIComponent(_36[0]);
var _38=_36[1]?decodeURIComponent(_36[1]):undefined;
if(_35[_37]!==undefined){
if(_35[_37].constructor!=Array){
_35[_37]=[_35[_37]];
}
if(_38){
_35[_37].push(_38);
}
}else{
_35[_37]=_38;
}
}
return _35;
});
},toArray:function(){
return this.split("");
},succ:function(){
return this.slice(0,this.length-1)+String.fromCharCode(this.charCodeAt(this.length-1)+1);
},camelize:function(){
var _39=this.split("-"),len=_39.length;
if(len==1){
return _39[0];
}
var _3b=this.charAt(0)=="-"?_39[0].charAt(0).toUpperCase()+_39[0].substring(1):_39[0];
for(var i=1;i<len;i++){
_3b+=_39[i].charAt(0).toUpperCase()+_39[i].substring(1);
}
return _3b;
},capitalize:function(){
return this.charAt(0).toUpperCase()+this.substring(1).toLowerCase();
},underscore:function(){
return this.gsub(/::/,"/").gsub(/([A-Z]+)([A-Z][a-z])/,"#{1}_#{2}").gsub(/([a-z\d])([A-Z])/,"#{1}_#{2}").gsub(/-/,"_").toLowerCase();
},dasherize:function(){
return this.gsub(/_/,"-");
},inspect:function(_3d){
var _3e=this.replace(/\\/g,"\\\\");
if(_3d){
return "\""+_3e.replace(/"/g,"\\\"")+"\"";
}else{
return "'"+_3e.replace(/'/g,"\\'")+"'";
}
}});
String.prototype.gsub.prepareReplacement=function(_3f){
if(typeof _3f=="function"){
return _3f;
}
var _40=new Template(_3f);
return function(_41){
return _40.evaluate(_41);
};
};
String.prototype.parseQuery=String.prototype.toQueryParams;
var Template=Class.create();
Template.Pattern=/(^|.|\r|\n)(#\{(.*?)\})/;
Template.prototype={initialize:function(_42,_43){
this.template=_42.toString();
this.pattern=_43||Template.Pattern;
},evaluate:function(_44){
return this.template.gsub(this.pattern,function(_45){
var _46=_45[1];
if(_46=="\\"){
return _45[2];
}
return _46+String.interpret(_44[_45[3]]);
});
}};
var $break=new Object();
var $continue=new Object();
var Enumerable={each:function(_47){
var _48=0;
try{
this._each(function(_49){
try{
_47(_49,_48++);
}
catch(e){
if(e!=$continue){
throw e;
}
}
});
}
catch(e){
if(e!=$break){
throw e;
}
}
return this;
},eachSlice:function(_4a,_4b){
var _4c=-_4a,_4d=[],_4e=this.toArray();
while((_4c+=_4a)<_4e.length){
_4d.push(_4e.slice(_4c,_4c+_4a));
}
return _4d.map(_4b);
},all:function(_4f){
var _50=true;
this.each(function(_51,_52){
_50=_50&&!!(_4f||Prototype.K)(_51,_52);
if(!_50){
throw $break;
}
});
return _50;
},any:function(_53){
var _54=false;
this.each(function(_55,_56){
if(_54=!!(_53||Prototype.K)(_55,_56)){
throw $break;
}
});
return _54;
},collect:function(_57){
var _58=[];
this.each(function(_59,_5a){
_58.push((_57||Prototype.K)(_59,_5a));
});
return _58;
},detect:function(_5b){
var _5c;
this.each(function(_5d,_5e){
if(_5b(_5d,_5e)){
_5c=_5d;
throw $break;
}
});
return _5c;
},findAll:function(_5f){
var _60=[];
this.each(function(_61,_62){
if(_5f(_61,_62)){
_60.push(_61);
}
});
return _60;
},grep:function(_63,_64){
var _65=[];
this.each(function(_66,_67){
var _68=_66.toString();
if(_68.match(_63)){
_65.push((_64||Prototype.K)(_66,_67));
}
});
return _65;
},include:function(_69){
var _6a=false;
this.each(function(_6b){
if(_6b==_69){
_6a=true;
throw $break;
}
});
return _6a;
},inGroupsOf:function(_6c,_6d){
_6d=_6d===undefined?null:_6d;
return this.eachSlice(_6c,function(_6e){
while(_6e.length<_6c){
_6e.push(_6d);
}
return _6e;
});
},inject:function(_6f,_70){
this.each(function(_71,_72){
_6f=_70(_6f,_71,_72);
});
return _6f;
},invoke:function(_73){
var _74=$A(arguments).slice(1);
return this.map(function(_75){
return _75[_73].apply(_75,_74);
});
},max:function(_76){
var _77;
this.each(function(_78,_79){
_78=(_76||Prototype.K)(_78,_79);
if(_77==undefined||_78>=_77){
_77=_78;
}
});
return _77;
},min:function(_7a){
var _7b;
this.each(function(_7c,_7d){
_7c=(_7a||Prototype.K)(_7c,_7d);
if(_7b==undefined||_7c<_7b){
_7b=_7c;
}
});
return _7b;
},partition:function(_7e){
var _7f=[],_80=[];
this.each(function(_81,_82){
((_7e||Prototype.K)(_81,_82)?_7f:_80).push(_81);
});
return [_7f,_80];
},pluck:function(_83){
var _84=[];
this.each(function(_85,_86){
_84.push(_85[_83]);
});
return _84;
},reject:function(_87){
var _88=[];
this.each(function(_89,_8a){
if(!_87(_89,_8a)){
_88.push(_89);
}
});
return _88;
},sortBy:function(_8b){
return this.map(function(_8c,_8d){
return {value:_8c,criteria:_8b(_8c,_8d)};
}).sort(function(_8e,_8f){
var a=_8e.criteria,b=_8f.criteria;
return a<b?-1:a>b?1:0;
}).pluck("value");
},toArray:function(){
return this.map();
},zip:function(){
var _92=Prototype.K,_93=$A(arguments);
if(typeof _93.last()=="function"){
_92=_93.pop();
}
var _94=[this].concat(_93).map($A);
return this.map(function(_95,_96){
return _92(_94.pluck(_96));
});
},size:function(){
return this.toArray().length;
},inspect:function(){
return "#<Enumerable:"+this.toArray().inspect()+">";
}};
Object.extend(Enumerable,{map:Enumerable.collect,find:Enumerable.detect,select:Enumerable.findAll,member:Enumerable.include,entries:Enumerable.toArray});
var $A=Array.from=function(_97){
if(!_97){
return [];
}
if(_97.toArray){
return _97.toArray();
}else{
var _98=[];
for(var i=0,_9a=_97.length;i<_9a;i++){
_98.push(_97[i]);
}
return _98;
}
};
Object.extend(Array.prototype,Enumerable);
if(!Array.prototype._reverse){
Array.prototype._reverse=Array.prototype.reverse;
}
Object.extend(Array.prototype,{_each:function(_9b){
for(var i=0,_9d=this.length;i<_9d;i++){
_9b(this[i]);
}
},clear:function(){
this.length=0;
return this;
},first:function(){
return this[0];
},last:function(){
return this[this.length-1];
},compact:function(){
return this.select(function(_9e){
return _9e!=null;
});
},flatten:function(){
return this.inject([],function(_9f,_a0){
return _9f.concat(_a0&&_a0.constructor==Array?_a0.flatten():[_a0]);
});
},without:function(){
var _a1=$A(arguments);
return this.select(function(_a2){
return !_a1.include(_a2);
});
},indexOf:function(_a3){
for(var i=0,_a5=this.length;i<_a5;i++){
if(this[i]==_a3){
return i;
}
}
return -1;
},reverse:function(_a6){
return (_a6!==false?this:this.toArray())._reverse();
},reduce:function(){
return this.length>1?this:this[0];
},uniq:function(){
return this.inject([],function(_a7,_a8){
return _a7.include(_a8)?_a7:_a7.concat([_a8]);
});
},clone:function(){
return [].concat(this);
},size:function(){
return this.length;
},inspect:function(){
return "["+this.map(Object.inspect).join(", ")+"]";
}});
Array.prototype.toArray=Array.prototype.clone;
function $w(_a9){
_a9=_a9.strip();
return _a9?_a9.split(/\s+/):[];
}
if(window.opera){
Array.prototype.concat=function(){
var _aa=[];
for(var i=0,_ac=this.length;i<_ac;i++){
_aa.push(this[i]);
}
for(var i=0,_ac=arguments.length;i<_ac;i++){
if(arguments[i].constructor==Array){
for(var j=0,_ae=arguments[i].length;j<_ae;j++){
_aa.push(arguments[i][j]);
}
}else{
_aa.push(arguments[i]);
}
}
return _aa;
};
}
var Hash=function(obj){
Object.extend(this,obj||{});
};
Object.extend(Hash,{toQueryString:function(obj){
var _b1=[];
this.prototype._each.call(obj,function(_b2){
if(!_b2.key){
return;
}
if(_b2.value&&_b2.value.constructor==Array){
var _b3=_b2.value.compact();
if(_b3.length<2){
_b2.value=_b3.reduce();
}else{
key=encodeURIComponent(_b2.key);
_b3.each(function(_b4){
_b4=_b4!=undefined?encodeURIComponent(_b4):"";
_b1.push(key+"="+encodeURIComponent(_b4));
});
return;
}
}
if(_b2.value==undefined){
_b2[1]="";
}
_b1.push(_b2.map(encodeURIComponent).join("="));
});
return _b1.join("&");
}});
Object.extend(Hash.prototype,Enumerable);
Object.extend(Hash.prototype,{_each:function(_b5){
for(var key in this){
var _b7=this[key];
if(_b7&&_b7==Hash.prototype[key]){
continue;
}
var _b8=[key,_b7];
_b8.key=key;
_b8.value=_b7;
_b5(_b8);
}
},keys:function(){
return this.pluck("key");
},values:function(){
return this.pluck("value");
},merge:function(_b9){
return $H(_b9).inject(this,function(_ba,_bb){
_ba[_bb.key]=_bb.value;
return _ba;
});
},remove:function(){
var _bc;
for(var i=0,_be=arguments.length;i<_be;i++){
var _bf=this[arguments[i]];
if(_bf!==undefined){
if(_bc===undefined){
_bc=_bf;
}else{
if(_bc.constructor!=Array){
_bc=[_bc];
}
_bc.push(_bf);
}
}
delete this[arguments[i]];
}
return _bc;
},toQueryString:function(){
return Hash.toQueryString(this);
},inspect:function(){
return "#<Hash:{"+this.map(function(_c0){
return _c0.map(Object.inspect).join(": ");
}).join(", ")+"}>";
}});
function $H(_c1){
if(_c1&&_c1.constructor==Hash){
return _c1;
}
return new Hash(_c1);
}
ObjectRange=Class.create();
Object.extend(ObjectRange.prototype,Enumerable);
Object.extend(ObjectRange.prototype,{initialize:function(_c2,end,_c4){
this.start=_c2;
this.end=end;
this.exclusive=_c4;
},_each:function(_c5){
var _c6=this.start;
while(this.include(_c6)){
_c5(_c6);
_c6=_c6.succ();
}
},include:function(_c7){
if(_c7<this.start){
return false;
}
if(this.exclusive){
return _c7<this.end;
}
return _c7<=this.end;
}});
var $R=function(_c8,end,_ca){
return new ObjectRange(_c8,end,_ca);
};
var Ajax={getTransport:function(){
return Try.these(function(){
return new XMLHttpRequest();
},function(){
return new ActiveXObject("Msxml2.XMLHTTP");
},function(){
return new ActiveXObject("Microsoft.XMLHTTP");
})||false;
},activeRequestCount:0};
Ajax.Responders={responders:[],_each:function(_cb){
this.responders._each(_cb);
},register:function(_cc){
if(!this.include(_cc)){
this.responders.push(_cc);
}
},unregister:function(_cd){
this.responders=this.responders.without(_cd);
},dispatch:function(_ce,_cf,_d0,_d1){
this.each(function(_d2){
if(typeof _d2[_ce]=="function"){
try{
_d2[_ce].apply(_d2,[_cf,_d0,_d1]);
}
catch(e){
}
}
});
}};
Object.extend(Ajax.Responders,Enumerable);
Ajax.Responders.register({onCreate:function(){
Ajax.activeRequestCount++;
},onComplete:function(){
Ajax.activeRequestCount--;
}});
Ajax.Base=function(){
};
Ajax.Base.prototype={setOptions:function(_d3){
this.options={method:"post",asynchronous:true,contentType:"application/x-www-form-urlencoded",encoding:"UTF-8",parameters:""};
Object.extend(this.options,_d3||{});
this.options.method=this.options.method.toLowerCase();
if(typeof this.options.parameters=="string"){
this.options.parameters=this.options.parameters.toQueryParams();
}
}};
Ajax.Request=Class.create();
Ajax.Request.Events=["Uninitialized","Loading","Loaded","Interactive","Complete"];
Ajax.Request.prototype=Object.extend(new Ajax.Base(),{_complete:false,initialize:function(url,_d5){
this.transport=Ajax.getTransport();
this.setOptions(_d5);
this.request(url);
},request:function(url){
this.url=url;
this.method=this.options.method;
var _d7=this.options.parameters;
if(!["get","post"].include(this.method)){
_d7["_method"]=this.method;
this.method="post";
}
_d7=Hash.toQueryString(_d7);
if(_d7&&/Konqueror|Safari|KHTML/.test(navigator.userAgent)){
_d7+="&_=";
}
if(this.method=="get"&&_d7){
this.url+=(this.url.indexOf("?")>-1?"&":"?")+_d7;
}
try{
Ajax.Responders.dispatch("onCreate",this,this.transport);
this.transport.open(this.method.toUpperCase(),this.url,this.options.asynchronous);
if(this.options.asynchronous){
setTimeout(function(){
this.respondToReadyState(1);
}.bind(this),10);
}
this.transport.onreadystatechange=this.onStateChange.bind(this);
this.setRequestHeaders();
var _d8=this.method=="post"?(this.options.postBody||_d7):null;
this.transport.send(_d8);
if(!this.options.asynchronous&&this.transport.overrideMimeType){
this.onStateChange();
}
}
catch(e){
this.dispatchException(e);
}
},onStateChange:function(){
var _d9=this.transport.readyState;
if(_d9>1&&!((_d9==4)&&this._complete)){
this.respondToReadyState(this.transport.readyState);
}
},setRequestHeaders:function(){
var _da={"X-Requested-With":"XMLHttpRequest","X-Prototype-Version":Prototype.Version,"Accept":"text/javascript, text/html, application/xml, text/xml, */*"};
if(this.method=="post"){
_da["Content-type"]=this.options.contentType+(this.options.encoding?"; charset="+this.options.encoding:"");
if(this.transport.overrideMimeType&&(navigator.userAgent.match(/Gecko\/(\d{4})/)||[0,2005])[1]<2005){
_da["Connection"]="close";
}
}
if(typeof this.options.requestHeaders=="object"){
var _db=this.options.requestHeaders;
if(typeof _db.push=="function"){
for(var i=0,_dd=_db.length;i<_dd;i+=2){
_da[_db[i]]=_db[i+1];
}
}else{
$H(_db).each(function(_de){
_da[_de.key]=_de.value;
});
}
}
for(var _df in _da){
this.transport.setRequestHeader(_df,_da[_df]);
}
},success:function(){
return !this.transport.status||(this.transport.status>=200&&this.transport.status<300);
},respondToReadyState:function(_e0){
var _e1=Ajax.Request.Events[_e0];
var _e2=this.transport,_e3=this.evalJSON();
if(_e1=="Complete"){
try{
this._complete=true;
(this.options["on"+this.transport.status]||this.options["on"+(this.success()?"Success":"Failure")]||Prototype.emptyFunction)(_e2,_e3);
}
catch(e){
this.dispatchException(e);
}
if((this.getHeader("Content-type")||"text/javascript").strip().match(/^(text|application)\/(x-)?(java|ecma)script(;.*)?$/i)){
this.evalResponse();
}
}
try{
(this.options["on"+_e1]||Prototype.emptyFunction)(_e2,_e3);
Ajax.Responders.dispatch("on"+_e1,this,_e2,_e3);
}
catch(e){
this.dispatchException(e);
}
if(_e1=="Complete"){
this.transport.onreadystatechange=Prototype.emptyFunction;
}
},getHeader:function(_e4){
try{
return this.transport.getResponseHeader(_e4);
}
catch(e){
return null;
}
},evalJSON:function(){
try{
var _e5=this.getHeader("X-JSON");
return _e5?eval("("+_e5+")"):null;
}
catch(e){
return null;
}
},evalResponse:function(){
try{
return eval(this.transport.responseText);
}
catch(e){
this.dispatchException(e);
}
},dispatchException:function(_e6){
(this.options.onException||Prototype.emptyFunction)(this,_e6);
Ajax.Responders.dispatch("onException",this,_e6);
}});
Ajax.Updater=Class.create();
Object.extend(Object.extend(Ajax.Updater.prototype,Ajax.Request.prototype),{initialize:function(_e7,url,_e9){
this.container={success:(_e7.success||_e7),failure:(_e7.failure||(_e7.success?null:_e7))};
this.transport=Ajax.getTransport();
this.setOptions(_e9);
var _ea=this.options.onComplete||Prototype.emptyFunction;
this.options.onComplete=(function(_eb,_ec){
this.updateContent();
_ea(_eb,_ec);
}).bind(this);
this.request(url);
},updateContent:function(){
var _ed=this.container[this.success()?"success":"failure"];
var _ee=this.transport.responseText;
if(!this.options.evalScripts){
_ee=_ee.stripScripts();
}
if(_ed=$(_ed)){
if(this.options.insertion){
new this.options.insertion(_ed,_ee);
}else{
_ed.update(_ee);
}
}
if(this.success()){
if(this.onComplete){
setTimeout(this.onComplete.bind(this),10);
}
}
}});
Ajax.PeriodicalUpdater=Class.create();
Ajax.PeriodicalUpdater.prototype=Object.extend(new Ajax.Base(),{initialize:function(_ef,url,_f1){
this.setOptions(_f1);
this.onComplete=this.options.onComplete;
this.frequency=(this.options.frequency||2);
this.decay=(this.options.decay||1);
this.updater={};
this.container=_ef;
this.url=url;
this.start();
},start:function(){
this.options.onComplete=this.updateComplete.bind(this);
this.onTimerEvent();
},stop:function(){
this.updater.options.onComplete=undefined;
clearTimeout(this.timer);
(this.onComplete||Prototype.emptyFunction).apply(this,arguments);
},updateComplete:function(_f2){
if(this.options.decay){
this.decay=(_f2.responseText==this.lastText?this.decay*this.options.decay:1);
this.lastText=_f2.responseText;
}
this.timer=setTimeout(this.onTimerEvent.bind(this),this.decay*this.frequency*1000);
},onTimerEvent:function(){
this.updater=new Ajax.Updater(this.container,this.url,this.options);
}});
function $(_f3){
if(arguments.length>1){
for(var i=0,_f5=[],_f6=arguments.length;i<_f6;i++){
_f5.push($(arguments[i]));
}
return _f5;
}
if(typeof _f3=="string"){
_f3=document.getElementById(_f3);
}
return Element.extend(_f3);
}
if(Prototype.BrowserFeatures.XPath){
document._getElementsByXPath=function(_f7,_f8){
var _f9=[];
var _fa=document.evaluate(_f7,$(_f8)||document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
for(var i=0,_fc=_fa.snapshotLength;i<_fc;i++){
_f9.push(_fa.snapshotItem(i));
}
return _f9;
};
}
document.getElementsByClassName=function(_fd,_fe){
if(Prototype.BrowserFeatures.XPath){
var q=".//*[contains(concat(' ', @class, ' '), ' "+_fd+" ')]";
return document._getElementsByXPath(q,_fe);
}else{
var _100=($(_fe)||document.body).getElementsByTagName("*");
var _101=[],_102;
for(var i=0,_104=_100.length;i<_104;i++){
_102=_100[i];
if(Element.hasClassName(_102,_fd)){
_101.push(Element.extend(_102));
}
}
return _101;
}
};
if(!window.Element){
var Element=new Object();
}
Element.extend=function(_105){
if(!_105||_nativeExtensions||_105.nodeType==3){
return _105;
}
if(!_105._extended&&_105.tagName&&_105!=window){
var _106=Object.clone(Element.Methods),_107=Element.extend.cache;
if(_105.tagName=="FORM"){
Object.extend(_106,Form.Methods);
}
if(["INPUT","TEXTAREA","SELECT"].include(_105.tagName)){
Object.extend(_106,Form.Element.Methods);
}
Object.extend(_106,Element.Methods.Simulated);
for(var _108 in _106){
var _109=_106[_108];
if(typeof _109=="function"&&!(_108 in _105)){
_105[_108]=_107.findOrStore(_109);
}
}
}
_105._extended=true;
return _105;
};
Element.extend.cache={findOrStore:function(_10a){
return this[_10a]=this[_10a]||function(){
return _10a.apply(null,[this].concat($A(arguments)));
};
}};
Element.Methods={visible:function(_10b){
return $(_10b).style.display!="none";
},toggle:function(_10c){
_10c=$(_10c);
Element[Element.visible(_10c)?"hide":"show"](_10c);
return _10c;
},hide:function(_10d){
$(_10d).style.display="none";
return _10d;
},show:function(_10e){
$(_10e).style.display="";
return _10e;
},remove:function(_10f){
_10f=$(_10f);
_10f.parentNode.removeChild(_10f);
return _10f;
},update:function(_110,html){
html=typeof html=="undefined"?"":html.toString();
$(_110).innerHTML=html.stripScripts();
setTimeout(function(){
html.evalScripts();
},10);
return _110;
},replace:function(_112,html){
_112=$(_112);
html=typeof html=="undefined"?"":html.toString();
if(_112.outerHTML){
_112.outerHTML=html.stripScripts();
}else{
var _114=_112.ownerDocument.createRange();
_114.selectNodeContents(_112);
_112.parentNode.replaceChild(_114.createContextualFragment(html.stripScripts()),_112);
}
setTimeout(function(){
html.evalScripts();
},10);
return _112;
},inspect:function(_115){
_115=$(_115);
var _116="<"+_115.tagName.toLowerCase();
$H({"id":"id","className":"class"}).each(function(pair){
var _118=pair.first(),_119=pair.last();
var _11a=(_115[_118]||"").toString();
if(_11a){
_116+=" "+_119+"="+_11a.inspect(true);
}
});
return _116+">";
},recursivelyCollect:function(_11b,_11c){
_11b=$(_11b);
var _11d=[];
while(_11b=_11b[_11c]){
if(_11b.nodeType==1){
_11d.push(Element.extend(_11b));
}
}
return _11d;
},ancestors:function(_11e){
return $(_11e).recursivelyCollect("parentNode");
},descendants:function(_11f){
return $A($(_11f).getElementsByTagName("*"));
},immediateDescendants:function(_120){
if(!(_120=$(_120).firstChild)){
return [];
}
while(_120&&_120.nodeType!=1){
_120=_120.nextSibling;
}
if(_120){
return [_120].concat($(_120).nextSiblings());
}
return [];
},previousSiblings:function(_121){
return $(_121).recursivelyCollect("previousSibling");
},nextSiblings:function(_122){
return $(_122).recursivelyCollect("nextSibling");
},siblings:function(_123){
_123=$(_123);
return _123.previousSiblings().reverse().concat(_123.nextSiblings());
},match:function(_124,_125){
if(typeof _125=="string"){
_125=new Selector(_125);
}
return _125.match($(_124));
},up:function(_126,_127,_128){
return Selector.findElement($(_126).ancestors(),_127,_128);
},down:function(_129,_12a,_12b){
return Selector.findElement($(_129).descendants(),_12a,_12b);
},previous:function(_12c,_12d,_12e){
return Selector.findElement($(_12c).previousSiblings(),_12d,_12e);
},next:function(_12f,_130,_131){
return Selector.findElement($(_12f).nextSiblings(),_130,_131);
},getElementsBySelector:function(){
var args=$A(arguments),_133=$(args.shift());
return Selector.findChildElements(_133,args);
},getElementsByClassName:function(_134,_135){
return document.getElementsByClassName(_135,_134);
},readAttribute:function(_136,name){
_136=$(_136);
if(document.all&&!window.opera){
var t=Element._attributeTranslations;
if(t.values[name]){
return t.values[name](_136,name);
}
if(t.names[name]){
name=t.names[name];
}
var _139=_136.attributes[name];
if(_139){
return _139.nodeValue;
}
}
return _136.getAttribute(name);
},getHeight:function(_13a){
return $(_13a).getDimensions().height;
},getWidth:function(_13b){
return $(_13b).getDimensions().width;
},classNames:function(_13c){
return new Element.ClassNames(_13c);
},hasClassName:function(_13d,_13e){
if(!(_13d=$(_13d))){
return;
}
var _13f=_13d.className;
if(_13f.length==0){
return false;
}
if(_13f==_13e||_13f.match(new RegExp("(^|\\s)"+_13e+"(\\s|$)"))){
return true;
}
return false;
},addClassName:function(_140,_141){
if(!(_140=$(_140))){
return;
}
Element.classNames(_140).add(_141);
return _140;
},removeClassName:function(_142,_143){
if(!(_142=$(_142))){
return;
}
Element.classNames(_142).remove(_143);
return _142;
},toggleClassName:function(_144,_145){
if(!(_144=$(_144))){
return;
}
Element.classNames(_144)[_144.hasClassName(_145)?"remove":"add"](_145);
return _144;
},observe:function(){
Event.observe.apply(Event,arguments);
return $A(arguments).first();
},stopObserving:function(){
Event.stopObserving.apply(Event,arguments);
return $A(arguments).first();
},cleanWhitespace:function(_146){
_146=$(_146);
var node=_146.firstChild;
while(node){
var _148=node.nextSibling;
if(node.nodeType==3&&!/\S/.test(node.nodeValue)){
_146.removeChild(node);
}
node=_148;
}
return _146;
},empty:function(_149){
return $(_149).innerHTML.match(/^\s*$/);
},descendantOf:function(_14a,_14b){
_14a=$(_14a),_14b=$(_14b);
while(_14a=_14a.parentNode){
if(_14a==_14b){
return true;
}
}
return false;
},scrollTo:function(_14c){
_14c=$(_14c);
var pos=Position.cumulativeOffset(_14c);
window.scrollTo(pos[0],pos[1]);
return _14c;
},getStyle:function(_14e,_14f){
_14e=$(_14e);
if(["float","cssFloat"].include(_14f)){
_14f=(typeof _14e.style.styleFloat!="undefined"?"styleFloat":"cssFloat");
}
_14f=_14f.camelize();
var _150=_14e.style[_14f];
if(!_150){
if(document.defaultView&&document.defaultView.getComputedStyle){
var css=document.defaultView.getComputedStyle(_14e,null);
_150=css?css[_14f]:null;
}else{
if(_14e.currentStyle){
_150=_14e.currentStyle[_14f];
}
}
}
if((_150=="auto")&&["width","height"].include(_14f)&&(_14e.getStyle("display")!="none")){
_150=_14e["offset"+_14f.capitalize()]+"px";
}
if(window.opera&&["left","top","right","bottom"].include(_14f)){
if(Element.getStyle(_14e,"position")=="static"){
_150="auto";
}
}
if(_14f=="opacity"){
if(_150){
return parseFloat(_150);
}
if(_150=(_14e.getStyle("filter")||"").match(/alpha\(opacity=(.*)\)/)){
if(_150[1]){
return parseFloat(_150[1])/100;
}
}
return 1;
}
return _150=="auto"?null:_150;
},setStyle:function(_152,_153){
_152=$(_152);
for(var name in _153){
var _155=_153[name];
if(name=="opacity"){
if(_155==1){
_155=(/Gecko/.test(navigator.userAgent)&&!/Konqueror|Safari|KHTML/.test(navigator.userAgent))?0.999999:1;
if(/MSIE/.test(navigator.userAgent)&&!window.opera){
_152.style.filter=_152.getStyle("filter").replace(/alpha\([^\)]*\)/gi,"");
}
}else{
if(_155==""){
if(/MSIE/.test(navigator.userAgent)&&!window.opera){
_152.style.filter=_152.getStyle("filter").replace(/alpha\([^\)]*\)/gi,"");
}
}else{
if(_155<0.00001){
_155=0;
}
if(/MSIE/.test(navigator.userAgent)&&!window.opera){
_152.style.filter=_152.getStyle("filter").replace(/alpha\([^\)]*\)/gi,"")+"alpha(opacity="+_155*100+")";
}
}
}
}else{
if(["float","cssFloat"].include(name)){
name=(typeof _152.style.styleFloat!="undefined")?"styleFloat":"cssFloat";
}
}
_152.style[name.camelize()]=_155;
}
return _152;
},getDimensions:function(_156){
_156=$(_156);
var _157=$(_156).getStyle("display");
if(_157!="none"&&_157!=null){
return {width:_156.offsetWidth,height:_156.offsetHeight};
}
var els=_156.style;
var _159=els.visibility;
var _15a=els.position;
var _15b=els.display;
els.visibility="hidden";
els.position="absolute";
els.display="block";
var _15c=_156.clientWidth;
var _15d=_156.clientHeight;
els.display=_15b;
els.position=_15a;
els.visibility=_159;
return {width:_15c,height:_15d};
},makePositioned:function(_15e){
_15e=$(_15e);
var pos=Element.getStyle(_15e,"position");
if(pos=="static"||!pos){
_15e._madePositioned=true;
_15e.style.position="relative";
if(window.opera){
_15e.style.top=0;
_15e.style.left=0;
}
}
return _15e;
},undoPositioned:function(_160){
_160=$(_160);
if(_160._madePositioned){
_160._madePositioned=undefined;
_160.style.position=_160.style.top=_160.style.left=_160.style.bottom=_160.style.right="";
}
return _160;
},makeClipping:function(_161){
_161=$(_161);
if(_161._overflow){
return _161;
}
_161._overflow=_161.style.overflow||"auto";
if((Element.getStyle(_161,"overflow")||"visible")!="hidden"){
_161.style.overflow="hidden";
}
return _161;
},undoClipping:function(_162){
_162=$(_162);
if(!_162._overflow){
return _162;
}
_162.style.overflow=_162._overflow=="auto"?"":_162._overflow;
_162._overflow=null;
return _162;
}};
Object.extend(Element.Methods,{childOf:Element.Methods.descendantOf});
Element._attributeTranslations={};
Element._attributeTranslations.names={colspan:"colSpan",rowspan:"rowSpan",valign:"vAlign",datetime:"dateTime",accesskey:"accessKey",tabindex:"tabIndex",enctype:"encType",maxlength:"maxLength",readonly:"readOnly",longdesc:"longDesc"};
Element._attributeTranslations.values={_getAttr:function(_163,_164){
return _163.getAttribute(_164,2);
},_flag:function(_165,_166){
return $(_165).hasAttribute(_166)?_166:null;
},style:function(_167){
return _167.style.cssText.toLowerCase();
},title:function(_168){
var node=_168.getAttributeNode("title");
return node.specified?node.nodeValue:null;
}};
Object.extend(Element._attributeTranslations.values,{href:Element._attributeTranslations.values._getAttr,src:Element._attributeTranslations.values._getAttr,disabled:Element._attributeTranslations.values._flag,checked:Element._attributeTranslations.values._flag,readonly:Element._attributeTranslations.values._flag,multiple:Element._attributeTranslations.values._flag});
Element.Methods.Simulated={hasAttribute:function(_16a,_16b){
var t=Element._attributeTranslations;
_16b=t.names[_16b]||_16b;
return $(_16a).getAttributeNode(_16b).specified;
}};
if(document.all&&!window.opera){
Element.Methods.update=function(_16d,html){
_16d=$(_16d);
html=typeof html=="undefined"?"":html.toString();
var _16f=_16d.tagName.toUpperCase();
if(["THEAD","TBODY","TR","TD"].include(_16f)){
var div=document.createElement("div");
switch(_16f){
case "THEAD":
case "TBODY":
div.innerHTML="<table><tbody>"+html.stripScripts()+"</tbody></table>";
depth=2;
break;
case "TR":
div.innerHTML="<table><tbody><tr>"+html.stripScripts()+"</tr></tbody></table>";
depth=3;
break;
case "TD":
div.innerHTML="<table><tbody><tr><td>"+html.stripScripts()+"</td></tr></tbody></table>";
depth=4;
}
$A(_16d.childNodes).each(function(node){
_16d.removeChild(node);
});
depth.times(function(){
div=div.firstChild;
});
$A(div.childNodes).each(function(node){
_16d.appendChild(node);
});
}else{
_16d.innerHTML=html.stripScripts();
}
setTimeout(function(){
html.evalScripts();
},10);
return _16d;
};
}
Object.extend(Element,Element.Methods);
var _nativeExtensions=false;
if(/Konqueror|Safari|KHTML/.test(navigator.userAgent)){
["","Form","Input","TextArea","Select"].each(function(tag){
var _174="HTML"+tag+"Element";
if(window[_174]){
return;
}
var _175=window[_174]={};
_175.prototype=document.createElement(tag?tag.toLowerCase():"div").__proto__;
});
}
Element.addMethods=function(_176){
Object.extend(Element.Methods,_176||{});
function copy(_177,_178,_179){
_179=_179||false;
var _17a=Element.extend.cache;
for(var _17b in _177){
var _17c=_177[_17b];
if(!_179||!(_17b in _178)){
_178[_17b]=_17a.findOrStore(_17c);
}
}
}
if(typeof HTMLElement!="undefined"){
copy(Element.Methods,HTMLElement.prototype);
copy(Element.Methods.Simulated,HTMLElement.prototype,true);
copy(Form.Methods,HTMLFormElement.prototype);
[HTMLInputElement,HTMLTextAreaElement,HTMLSelectElement].each(function(_17d){
copy(Form.Element.Methods,_17d.prototype);
});
_nativeExtensions=true;
}
};
var Toggle=new Object();
Toggle.display=Element.toggle;
Abstract.Insertion=function(_17e){
this.adjacency=_17e;
};
Abstract.Insertion.prototype={initialize:function(_17f,_180){
this.element=$(_17f);
this.content=_180.stripScripts();
if(this.adjacency&&this.element.insertAdjacentHTML){
try{
this.element.insertAdjacentHTML(this.adjacency,this.content);
}
catch(e){
var _181=this.element.tagName.toUpperCase();
if(["TBODY","TR"].include(_181)){
this.insertContent(this.contentFromAnonymousTable());
}else{
throw e;
}
}
}else{
this.range=this.element.ownerDocument.createRange();
if(this.initializeRange){
this.initializeRange();
}
this.insertContent([this.range.createContextualFragment(this.content)]);
}
setTimeout(function(){
_180.evalScripts();
},10);
},contentFromAnonymousTable:function(){
var div=document.createElement("div");
div.innerHTML="<table><tbody>"+this.content+"</tbody></table>";
return $A(div.childNodes[0].childNodes[0].childNodes);
}};
var Insertion=new Object();
Insertion.Before=Class.create();
Insertion.Before.prototype=Object.extend(new Abstract.Insertion("beforeBegin"),{initializeRange:function(){
this.range.setStartBefore(this.element);
},insertContent:function(_183){
_183.each((function(_184){
this.element.parentNode.insertBefore(_184,this.element);
}).bind(this));
}});
Insertion.Top=Class.create();
Insertion.Top.prototype=Object.extend(new Abstract.Insertion("afterBegin"),{initializeRange:function(){
this.range.selectNodeContents(this.element);
this.range.collapse(true);
},insertContent:function(_185){
_185.reverse(false).each((function(_186){
this.element.insertBefore(_186,this.element.firstChild);
}).bind(this));
}});
Insertion.Bottom=Class.create();
Insertion.Bottom.prototype=Object.extend(new Abstract.Insertion("beforeEnd"),{initializeRange:function(){
this.range.selectNodeContents(this.element);
this.range.collapse(this.element);
},insertContent:function(_187){
_187.each((function(_188){
this.element.appendChild(_188);
}).bind(this));
}});
Insertion.After=Class.create();
Insertion.After.prototype=Object.extend(new Abstract.Insertion("afterEnd"),{initializeRange:function(){
this.range.setStartAfter(this.element);
},insertContent:function(_189){
_189.each((function(_18a){
this.element.parentNode.insertBefore(_18a,this.element.nextSibling);
}).bind(this));
}});
Element.ClassNames=Class.create();
Element.ClassNames.prototype={initialize:function(_18b){
this.element=$(_18b);
},_each:function(_18c){
this.element.className.split(/\s+/).select(function(name){
return name.length>0;
})._each(_18c);
},set:function(_18e){
this.element.className=_18e;
},add:function(_18f){
if(this.include(_18f)){
return;
}
this.set($A(this).concat(_18f).join(" "));
},remove:function(_190){
if(!this.include(_190)){
return;
}
this.set($A(this).without(_190).join(" "));
},toString:function(){
return $A(this).join(" ");
}};
Object.extend(Element.ClassNames.prototype,Enumerable);
var Selector=Class.create();
Selector.prototype={initialize:function(_191){
this.params={classNames:[]};
this.expression=_191.toString().strip();
this.parseExpression();
this.compileMatcher();
},parseExpression:function(){
function abort(_192){
throw "Parse error in selector: "+_192;
}
if(this.expression==""){
abort("empty expression");
}
var _193=this.params,expr=this.expression,_195,_196,_197,rest;
while(_195=expr.match(/^(.*)\[([a-z0-9_:-]+?)(?:([~\|!]?=)(?:"([^"]*)"|([^\]\s]*)))?\]$/i)){
_193.attributes=_193.attributes||[];
_193.attributes.push({name:_195[2],operator:_195[3],value:_195[4]||_195[5]||""});
expr=_195[1];
}
if(expr=="*"){
return this.params.wildcard=true;
}
while(_195=expr.match(/^([^a-z0-9_-])?([a-z0-9_-]+)(.*)/i)){
_196=_195[1],_197=_195[2],rest=_195[3];
switch(_196){
case "#":
_193.id=_197;
break;
case ".":
_193.classNames.push(_197);
break;
case "":
case undefined:
_193.tagName=_197.toUpperCase();
break;
default:
abort(expr.inspect());
}
expr=rest;
}
if(expr.length>0){
abort(expr.inspect());
}
},buildMatchExpression:function(){
var _199=this.params,_19a=[],_19b;
if(_199.wildcard){
_19a.push("true");
}
if(_19b=_199.id){
_19a.push("element.readAttribute(\"id\") == "+_19b.inspect());
}
if(_19b=_199.tagName){
_19a.push("element.tagName.toUpperCase() == "+_19b.inspect());
}
if((_19b=_199.classNames).length>0){
for(var i=0,_19d=_19b.length;i<_19d;i++){
_19a.push("element.hasClassName("+_19b[i].inspect()+")");
}
}
if(_19b=_199.attributes){
_19b.each(function(_19e){
var _19f="element.readAttribute("+_19e.name.inspect()+")";
var _1a0=function(_1a1){
return _19f+" && "+_19f+".split("+_1a1.inspect()+")";
};
switch(_19e.operator){
case "=":
_19a.push(_19f+" == "+_19e.value.inspect());
break;
case "~=":
_19a.push(_1a0(" ")+".include("+_19e.value.inspect()+")");
break;
case "|=":
_19a.push(_1a0("-")+".first().toUpperCase() == "+_19e.value.toUpperCase().inspect());
break;
case "!=":
_19a.push(_19f+" != "+_19e.value.inspect());
break;
case "":
case undefined:
_19a.push("element.hasAttribute("+_19e.name.inspect()+")");
break;
default:
throw "Unknown operator "+_19e.operator+" in selector";
}
});
}
return _19a.join(" && ");
},compileMatcher:function(){
this.match=new Function("element","if (!element.tagName) return false;       element = $(element);       return "+this.buildMatchExpression());
},findElements:function(_1a2){
var _1a3;
if(_1a3=$(this.params.id)){
if(this.match(_1a3)){
if(!_1a2||Element.childOf(_1a3,_1a2)){
return [_1a3];
}
}
}
_1a2=(_1a2||document).getElementsByTagName(this.params.tagName||"*");
var _1a4=[];
for(var i=0,_1a6=_1a2.length;i<_1a6;i++){
if(this.match(_1a3=_1a2[i])){
_1a4.push(Element.extend(_1a3));
}
}
return _1a4;
},toString:function(){
return this.expression;
}};
Object.extend(Selector,{matchElements:function(_1a7,_1a8){
var _1a9=new Selector(_1a8);
return _1a7.select(_1a9.match.bind(_1a9)).map(Element.extend);
},findElement:function(_1aa,_1ab,_1ac){
if(typeof _1ab=="number"){
_1ac=_1ab,_1ab=false;
}
return Selector.matchElements(_1aa,_1ab||"*")[_1ac||0];
},findChildElements:function(_1ad,_1ae){
return _1ae.map(function(_1af){
return _1af.match(/[^\s"]+(?:"[^"]*"[^\s"]+)*/g).inject([null],function(_1b0,expr){
var _1b2=new Selector(expr);
return _1b0.inject([],function(_1b3,_1b4){
return _1b3.concat(_1b2.findElements(_1b4||_1ad));
});
});
}).flatten();
}});
function $$(){
return Selector.findChildElements(document,$A(arguments));
}
var Form={reset:function(form){
$(form).reset();
return form;
},serializeElements:function(_1b6,_1b7){
var data=_1b6.inject({},function(_1b9,_1ba){
if(!_1ba.disabled&&_1ba.name){
var key=_1ba.name,_1bc=$(_1ba).getValue();
if(_1bc!=undefined){
if(_1b9[key]){
if(_1b9[key].constructor!=Array){
_1b9[key]=[_1b9[key]];
}
_1b9[key].push(_1bc);
}else{
_1b9[key]=_1bc;
}
}
}
return _1b9;
});
return _1b7?data:Hash.toQueryString(data);
}};
Form.Methods={serialize:function(form,_1be){
return Form.serializeElements(Form.getElements(form),_1be);
},getElements:function(form){
return $A($(form).getElementsByTagName("*")).inject([],function(_1c0,_1c1){
if(Form.Element.Serializers[_1c1.tagName.toLowerCase()]){
_1c0.push(Element.extend(_1c1));
}
return _1c0;
});
},getInputs:function(form,_1c3,name){
form=$(form);
var _1c5=form.getElementsByTagName("input");
if(!_1c3&&!name){
return $A(_1c5).map(Element.extend);
}
for(var i=0,_1c7=[],_1c8=_1c5.length;i<_1c8;i++){
var _1c9=_1c5[i];
if((_1c3&&_1c9.type!=_1c3)||(name&&_1c9.name!=name)){
continue;
}
_1c7.push(Element.extend(_1c9));
}
return _1c7;
},disable:function(form){
form=$(form);
form.getElements().each(function(_1cb){
_1cb.blur();
_1cb.disabled="true";
});
return form;
},enable:function(form){
form=$(form);
form.getElements().each(function(_1cd){
_1cd.disabled="";
});
return form;
},findFirstElement:function(form){
return $(form).getElements().find(function(_1cf){
return _1cf.type!="hidden"&&!_1cf.disabled&&["input","select","textarea"].include(_1cf.tagName.toLowerCase());
});
},focusFirstElement:function(form){
form=$(form);
form.findFirstElement().activate();
return form;
}};
Object.extend(Form,Form.Methods);
Form.Element={focus:function(_1d1){
$(_1d1).focus();
return _1d1;
},select:function(_1d2){
$(_1d2).select();
return _1d2;
}};
Form.Element.Methods={serialize:function(_1d3){
_1d3=$(_1d3);
if(!_1d3.disabled&&_1d3.name){
var _1d4=_1d3.getValue();
if(_1d4!=undefined){
var pair={};
pair[_1d3.name]=_1d4;
return Hash.toQueryString(pair);
}
}
return "";
},getValue:function(_1d6){
_1d6=$(_1d6);
var _1d7=_1d6.tagName.toLowerCase();
return Form.Element.Serializers[_1d7](_1d6);
},clear:function(_1d8){
$(_1d8).value="";
return _1d8;
},present:function(_1d9){
return $(_1d9).value!="";
},activate:function(_1da){
_1da=$(_1da);
_1da.focus();
if(_1da.select&&(_1da.tagName.toLowerCase()!="input"||!["button","reset","submit"].include(_1da.type))){
_1da.select();
}
return _1da;
},disable:function(_1db){
_1db=$(_1db);
_1db.disabled=true;
return _1db;
},enable:function(_1dc){
_1dc=$(_1dc);
_1dc.blur();
_1dc.disabled=false;
return _1dc;
}};
Object.extend(Form.Element,Form.Element.Methods);
var Field=Form.Element;
var $F=Form.Element.getValue;
Form.Element.Serializers={input:function(_1dd){
switch(_1dd.type.toLowerCase()){
case "checkbox":
case "radio":
return Form.Element.Serializers.inputSelector(_1dd);
default:
return Form.Element.Serializers.textarea(_1dd);
}
},inputSelector:function(_1de){
return _1de.checked?_1de.value:null;
},textarea:function(_1df){
return _1df.value;
},select:function(_1e0){
return this[_1e0.type=="select-one"?"selectOne":"selectMany"](_1e0);
},selectOne:function(_1e1){
var _1e2=_1e1.selectedIndex;
return _1e2>=0?this.optionValue(_1e1.options[_1e2]):null;
},selectMany:function(_1e3){
var _1e4,_1e5=_1e3.length;
if(!_1e5){
return null;
}
for(var i=0,_1e4=[];i<_1e5;i++){
var opt=_1e3.options[i];
if(opt.selected){
_1e4.push(this.optionValue(opt));
}
}
return _1e4;
},optionValue:function(opt){
return Element.extend(opt).hasAttribute("value")?opt.value:opt.text;
}};
Abstract.TimedObserver=function(){
};
Abstract.TimedObserver.prototype={initialize:function(_1e9,_1ea,_1eb){
this.frequency=_1ea;
this.element=$(_1e9);
this.callback=_1eb;
this.lastValue=this.getValue();
this.registerCallback();
},registerCallback:function(){
setInterval(this.onTimerEvent.bind(this),this.frequency*1000);
},onTimerEvent:function(){
var _1ec=this.getValue();
var _1ed=("string"==typeof this.lastValue&&"string"==typeof _1ec?this.lastValue!=_1ec:String(this.lastValue)!=String(_1ec));
if(_1ed){
this.callback(this.element,_1ec);
this.lastValue=_1ec;
}
}};
Form.Element.Observer=Class.create();
Form.Element.Observer.prototype=Object.extend(new Abstract.TimedObserver(),{getValue:function(){
return Form.Element.getValue(this.element);
}});
Form.Observer=Class.create();
Form.Observer.prototype=Object.extend(new Abstract.TimedObserver(),{getValue:function(){
return Form.serialize(this.element);
}});
Abstract.EventObserver=function(){
};
Abstract.EventObserver.prototype={initialize:function(_1ee,_1ef){
this.element=$(_1ee);
this.callback=_1ef;
this.lastValue=this.getValue();
if(this.element.tagName.toLowerCase()=="form"){
this.registerFormCallbacks();
}else{
this.registerCallback(this.element);
}
},onElementEvent:function(){
var _1f0=this.getValue();
if(this.lastValue!=_1f0){
this.callback(this.element,_1f0);
this.lastValue=_1f0;
}
},registerFormCallbacks:function(){
Form.getElements(this.element).each(this.registerCallback.bind(this));
},registerCallback:function(_1f1){
if(_1f1.type){
switch(_1f1.type.toLowerCase()){
case "checkbox":
case "radio":
Event.observe(_1f1,"click",this.onElementEvent.bind(this));
break;
default:
Event.observe(_1f1,"change",this.onElementEvent.bind(this));
break;
}
}
}};
Form.Element.EventObserver=Class.create();
Form.Element.EventObserver.prototype=Object.extend(new Abstract.EventObserver(),{getValue:function(){
return Form.Element.getValue(this.element);
}});
Form.EventObserver=Class.create();
Form.EventObserver.prototype=Object.extend(new Abstract.EventObserver(),{getValue:function(){
return Form.serialize(this.element);
}});
if(!window.Event){
var Event=new Object();
}
Object.extend(Event,{KEY_BACKSPACE:8,KEY_TAB:9,KEY_RETURN:13,KEY_ESC:27,KEY_LEFT:37,KEY_UP:38,KEY_RIGHT:39,KEY_DOWN:40,KEY_DELETE:46,KEY_HOME:36,KEY_END:35,KEY_PAGEUP:33,KEY_PAGEDOWN:34,element:function(_1f2){
return _1f2.target||_1f2.srcElement;
},isLeftClick:function(_1f3){
return (((_1f3.which)&&(_1f3.which==1))||((_1f3.button)&&(_1f3.button==1)));
},pointerX:function(_1f4){
return _1f4.pageX||(_1f4.clientX+(document.documentElement.scrollLeft||document.body.scrollLeft));
},pointerY:function(_1f5){
return _1f5.pageY||(_1f5.clientY+(document.documentElement.scrollTop||document.body.scrollTop));
},stop:function(_1f6){
if(_1f6.preventDefault){
_1f6.preventDefault();
_1f6.stopPropagation();
}else{
_1f6.returnValue=false;
_1f6.cancelBubble=true;
}
},findElement:function(_1f7,_1f8){
var _1f9=Event.element(_1f7);
while(_1f9.parentNode&&(!_1f9.tagName||(_1f9.tagName.toUpperCase()!=_1f8.toUpperCase()))){
_1f9=_1f9.parentNode;
}
return _1f9;
},observers:false,_observeAndCache:function(_1fa,name,_1fc,_1fd){
if(!this.observers){
this.observers=[];
}
if(_1fa.addEventListener){
this.observers.push([_1fa,name,_1fc,_1fd]);
_1fa.addEventListener(name,_1fc,_1fd);
}else{
if(_1fa.attachEvent){
this.observers.push([_1fa,name,_1fc,_1fd]);
_1fa.attachEvent("on"+name,_1fc);
}
}
},unloadCache:function(){
if(!Event.observers){
return;
}
for(var i=0,_1ff=Event.observers.length;i<_1ff;i++){
Event.stopObserving.apply(this,Event.observers[i]);
Event.observers[i][0]=null;
}
Event.observers=false;
},observe:function(_200,name,_202,_203){
_200=$(_200);
_203=_203||false;
if(name=="keypress"&&(navigator.appVersion.match(/Konqueror|Safari|KHTML/)||_200.attachEvent)){
name="keydown";
}
Event._observeAndCache(_200,name,_202,_203);
},stopObserving:function(_204,name,_206,_207){
_204=$(_204);
_207=_207||false;
if(name=="keypress"&&(navigator.appVersion.match(/Konqueror|Safari|KHTML/)||_204.detachEvent)){
name="keydown";
}
if(_204.removeEventListener){
_204.removeEventListener(name,_206,_207);
}else{
if(_204.detachEvent){
try{
_204.detachEvent("on"+name,_206);
}
catch(e){
}
}
}
}});
if(navigator.appVersion.match(/\bMSIE\b/)){
Event.observe(window,"unload",Event.unloadCache,false);
}
var Position={includeScrollOffsets:false,prepare:function(){
this.deltaX=window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft||0;
this.deltaY=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0;
},realOffset:function(_208){
var _209=0,_20a=0;
do{
_209+=_208.scrollTop||0;
_20a+=_208.scrollLeft||0;
_208=_208.parentNode;
}while(_208);
return [_20a,_209];
},cumulativeOffset:function(_20b){
var _20c=0,_20d=0;
do{
_20c+=_20b.offsetTop||0;
_20d+=_20b.offsetLeft||0;
_20b=_20b.offsetParent;
}while(_20b);
return [_20d,_20c];
},positionedOffset:function(_20e){
var _20f=0,_210=0;
do{
_20f+=_20e.offsetTop||0;
_210+=_20e.offsetLeft||0;
_20e=_20e.offsetParent;
if(_20e){
if(_20e.tagName=="BODY"){
break;
}
var p=Element.getStyle(_20e,"position");
if(p=="relative"||p=="absolute"){
break;
}
}
}while(_20e);
return [_210,_20f];
},offsetParent:function(_212){
if(_212.offsetParent){
return _212.offsetParent;
}
if(_212==document.body){
return _212;
}
while((_212=_212.parentNode)&&_212!=document.body){
if(Element.getStyle(_212,"position")!="static"){
return _212;
}
}
return document.body;
},within:function(_213,x,y){
if(this.includeScrollOffsets){
return this.withinIncludingScrolloffsets(_213,x,y);
}
this.xcomp=x;
this.ycomp=y;
this.offset=this.cumulativeOffset(_213);
return (y>=this.offset[1]&&y<this.offset[1]+_213.offsetHeight&&x>=this.offset[0]&&x<this.offset[0]+_213.offsetWidth);
},withinIncludingScrolloffsets:function(_216,x,y){
var _219=this.realOffset(_216);
this.xcomp=x+_219[0]-this.deltaX;
this.ycomp=y+_219[1]-this.deltaY;
this.offset=this.cumulativeOffset(_216);
return (this.ycomp>=this.offset[1]&&this.ycomp<this.offset[1]+_216.offsetHeight&&this.xcomp>=this.offset[0]&&this.xcomp<this.offset[0]+_216.offsetWidth);
},overlap:function(mode,_21b){
if(!mode){
return 0;
}
if(mode=="vertical"){
return ((this.offset[1]+_21b.offsetHeight)-this.ycomp)/_21b.offsetHeight;
}
if(mode=="horizontal"){
return ((this.offset[0]+_21b.offsetWidth)-this.xcomp)/_21b.offsetWidth;
}
},page:function(_21c){
var _21d=0,_21e=0;
var _21f=_21c;
do{
_21d+=_21f.offsetTop||0;
_21e+=_21f.offsetLeft||0;
if(_21f.offsetParent==document.body){
if(Element.getStyle(_21f,"position")=="absolute"){
break;
}
}
}while(_21f=_21f.offsetParent);
_21f=_21c;
do{
if(!window.opera||_21f.tagName=="BODY"){
_21d-=_21f.scrollTop||0;
_21e-=_21f.scrollLeft||0;
}
}while(_21f=_21f.parentNode);
return [_21e,_21d];
},clone:function(_220,_221){
var _222=Object.extend({setLeft:true,setTop:true,setWidth:true,setHeight:true,offsetTop:0,offsetLeft:0},arguments[2]||{});
_220=$(_220);
var p=Position.page(_220);
_221=$(_221);
var _224=[0,0];
var _225=null;
if(Element.getStyle(_221,"position")=="absolute"){
_225=Position.offsetParent(_221);
_224=Position.page(_225);
}
if(_225==document.body){
_224[0]-=document.body.offsetLeft;
_224[1]-=document.body.offsetTop;
}
if(_222.setLeft){
_221.style.left=(p[0]-_224[0]+_222.offsetLeft)+"px";
}
if(_222.setTop){
_221.style.top=(p[1]-_224[1]+_222.offsetTop)+"px";
}
if(_222.setWidth){
_221.style.width=_220.offsetWidth+"px";
}
if(_222.setHeight){
_221.style.height=_220.offsetHeight+"px";
}
},absolutize:function(_226){
_226=$(_226);
if(_226.style.position=="absolute"){
return;
}
Position.prepare();
var _227=Position.positionedOffset(_226);
var top=_227[1];
var left=_227[0];
var _22a=_226.clientWidth;
var _22b=_226.clientHeight;
_226._originalLeft=left-parseFloat(_226.style.left||0);
_226._originalTop=top-parseFloat(_226.style.top||0);
_226._originalWidth=_226.style.width;
_226._originalHeight=_226.style.height;
_226.style.position="absolute";
_226.style.top=top+"px";
_226.style.left=left+"px";
_226.style.width=_22a+"px";
_226.style.height=_22b+"px";
},relativize:function(_22c){
_22c=$(_22c);
if(_22c.style.position=="relative"){
return;
}
Position.prepare();
_22c.style.position="relative";
var top=parseFloat(_22c.style.top||0)-(_22c._originalTop||0);
var left=parseFloat(_22c.style.left||0)-(_22c._originalLeft||0);
_22c.style.top=top+"px";
_22c.style.left=left+"px";
_22c.style.height=_22c._originalHeight;
_22c.style.width=_22c._originalWidth;
}};
if(/Konqueror|Safari|KHTML/.test(navigator.userAgent)){
Position.cumulativeOffset=function(_22f){
var _230=0,_231=0;
do{
_230+=_22f.offsetTop||0;
_231+=_22f.offsetLeft||0;
if(_22f.offsetParent==document.body){
if(Element.getStyle(_22f,"position")=="absolute"){
break;
}
}
_22f=_22f.offsetParent;
}while(_22f);
return [_231,_230];
};
}
Element.addMethods();


if(typeof YAHOO=="undefined"){
var YAHOO={};
}
YAHOO.namespace=function(){
var a=arguments,o=null,i,j,d;
for(i=0;i<a.length;i=i+1){
d=a[i].split(".");
o=YAHOO;
for(j=(d[0]=="YAHOO")?1:0;j<d.length;j=j+1){
o[d[j]]=o[d[j]]||{};
o=o[d[j]];
}
}
return o;
};
YAHOO.log=function(_6,_7,_8){
var l=YAHOO.widget.Logger;
if(l&&l.log){
return l.log(_6,_7,_8);
}else{
return false;
}
};
YAHOO.init=function(){
this.namespace("util","widget","example");
if(typeof YAHOO_config!="undefined"){
var l=YAHOO_config.listener,ls=YAHOO.env.listeners,_c=true,i;
if(l){
for(i=0;i<ls.length;i=i+1){
if(ls[i]==l){
_c=false;
break;
}
}
if(_c){
ls.push(l);
}
}
}
};
YAHOO.register=function(_e,_f,_10){
var _11=YAHOO.env.modules;
if(!_11[_e]){
_11[_e]={versions:[],builds:[]};
}
var m=_11[_e],v=_10.version,b=_10.build,ls=YAHOO.env.listeners;
m.name=_e;
m.version=v;
m.build=b;
m.versions.push(v);
m.builds.push(b);
m.mainClass=_f;
for(var i=0;i<ls.length;i=i+1){
ls[i](m);
}
if(_f){
_f.VERSION=v;
_f.BUILD=b;
}else{
YAHOO.log("mainClass is undefined for module "+_e,"warn");
}
};
YAHOO.env=YAHOO.env||{modules:[],listeners:[],getVersion:function(_17){
return YAHOO.env.modules[_17]||null;
}};
YAHOO.lang={isArray:function(obj){
if(obj.constructor&&obj.constructor.toString().indexOf("Array")>-1){
return true;
}else{
return YAHOO.lang.isObject(obj)&&obj.constructor==Array;
}
},isBoolean:function(obj){
return typeof obj=="boolean";
},isFunction:function(obj){
return typeof obj=="function";
},isNull:function(obj){
return obj===null;
},isNumber:function(obj){
return typeof obj=="number"&&isFinite(obj);
},isObject:function(obj){
return typeof obj=="object"||YAHOO.lang.isFunction(obj);
},isString:function(obj){
return typeof obj=="string";
},isUndefined:function(obj){
return typeof obj=="undefined";
},hasOwnProperty:function(obj,_21){
if(Object.prototype.hasOwnProperty){
return obj.hasOwnProperty(_21);
}
return !YAHOO.lang.isUndefined(obj[_21])&&obj.constructor.prototype[_21]!==obj[_21];
},extend:function(_22,_23,_24){
var F=function(){
};
F.prototype=_23.prototype;
_22.prototype=new F();
_22.prototype.constructor=_22;
_22.superclass=_23.prototype;
if(_23.prototype.constructor==Object.prototype.constructor){
_23.prototype.constructor=_23;
}
if(_24){
for(var i in _24){
_22.prototype[i]=_24[i];
}
}
},augment:function(r,s){
var rp=r.prototype,sp=s.prototype,a=arguments,i,p;
if(a[2]){
for(i=2;i<a.length;i=i+1){
rp[a[i]]=sp[a[i]];
}
}else{
for(p in sp){
if(!rp[p]){
rp[p]=sp[p];
}
}
}
}};
YAHOO.init();
YAHOO.util.Lang=YAHOO.lang;
YAHOO.augment=YAHOO.lang.augment;
YAHOO.extend=YAHOO.lang.extend;
YAHOO.register("yahoo",YAHOO,{version:"2.2.0",build:"127"});


function XMPPConnection(_1,_2,_3){
if(_1.charAt(0)=="/"){
this.binding=_1;
}else{
this.binding=new Poly9.URLParser(_1);
}
this.domain=_2;
this.isConnected=false;
this.isAuthenticated=false;
this._packetFilters=new Array();
this._outgoingPacketFilters=new Array();
this._packetQueue=new Array();
this._connectionListeners=new Array();
this._packetHandler=this._createPacketHandler();
this.addConnectionListener(_3);
util.HTTP.reset();
}
XMPPConnection.prototype={addConnectionListener:function(_4){
if(!_4){
return;
}
this._connectionListeners.push(_4);
},removeConnectionListener:function(_5){
if(!_5){
return;
}
var _6=this._connectionListeners.indexOf(_5);
if(_6>=0){
this._connectionListeners.splice(_6,1);
}
},_fireEvent:function(_7,_8){
var _9=this;
this._connectionListeners.each(function(_a){
if(_a[_7]){
try{
_a[_7](_9,_8);
}
catch(_8){
console.error("Error processing listener: %s",_8);
}
}
});
},connect:function(){
var _b=this;
var _c=function(_d,_e,_f,_10){
var _11={xmlns:"http://jabber.org/protocol/httpbind",hold:_d,rid:_e,secure:_f,wait:_10};
return util.XML.element("body","",_11);
};
this._rid=Math.floor(Math.random()*1000000);
var _12=_c(1,this._rid,true,10);
console.debug("Initial request: %s",_12);
var _13=function(_14){
var _15=_14.responseXML.documentElement;
console.debug("Intial response: %x",_15);
_b.isConnected=true;
_b.authentication=_b._configureConnection(_15);
_b._fireEvent("connectionSuccessful");
};
var _16=function(_17,_18){
console.error("Connection to the server failed: "+_18);
this._fireEvent("connectionFailed");
}.bind(this);
var _19=util.HTTP.doRequest(this.binding,_12,_13,_16,_16);
},logout:function(_1a){
if(this.loggedOut){
return;
}
if(this._timer){
this._timer.cancel();
}
var _1b={xmlns:"http://jabber.org/protocol/httpbind",rid:this._getNextRID(),sid:this._sid,type:"terminate"};
var _1c=util.XML.element("body",(_1a?_1a.toXML():""),_1b);
this.loggedOut=true;
util.HTTP.doRequest(this.binding,_1c,this.destroy.bind(this),this.destroy.bind(this),this.destroy.bind(this));
},destroy:function(_1d){
if(!this.isConnected){
return;
}
this.isConnected=false;
this.isAuthenticated=false;
delete this.authentication;
delete this.username;
delete this.password;
delete this._sid;
delete this._pollingInterval;
delete this._wait;
delete this._inactivity;
this._packetHandler=Prototype.emptyFunction;
if(this._timer){
this._timer.cancel();
}
this._packetFilters.clear();
this._outgoingPacketFilters.clear();
this._packetQueue.clear();
if(!this.loggedOut&&!_1d){
_1d=new Error("connection lost");
}
this._fireEvent("connectionClosed",(!this.loggedOut?_1d:null));
this._connectionListeners.clear();
},login:function(_1e,_1f,_20){
if(!this.authentication.auth["anonymous"]&&(!_1e||_1e=="")){
throw new Error("Username must be provided to login.");
}
if(!this.authentication.auth["anonymous"]&&(!_1f||_1f=="")){
throw new Error("Password must be provided to login.");
}
this.username=_1e;
this.password=_1f;
this.resource=(!_20?"spank":_20);
var _21;
if(!_1e){
_21=this.authentication.auth["anonymous"];
}else{
_21=this.authentication.auth["plain"];
}
this._handleAuthentication(_21,0);
},_handleAuthentication:function(_22,_23){
var _24=this;
var _25=function(_26){
var _27=_26.responseXML.documentElement;
var _28=_27.firstChild;
var _29;
if(_28){
_29=_22[_23].handleResponse(_27.firstChild);
}else{
_24._handleAuthentication(_22,_23);
return;
}
if(_29.authComplete){
if(_29.authSuccess){
_24._bindConnection();
}else{
_24._fireEvent("authenticationFailed");
}
}else{
_24._handleAuthentication(_29,_23++);
}
};
if(_23!=this.lastStep){
this.lastStep=_23;
util.HTTP.doRequest(this.binding,_22[_23].createRequest(this),_25);
}else{
this._handlePing(_25);
}
},_configureConnection:function(_2a){
this._sid=_2a.getAttribute("sid");
this._pollingInterval=_2a.getAttribute("polling");
this._wait=_2a.getAttribute("wait");
this._inactivity=_2a.getAttribute("inactivity");
this.isConnected=true;
var _2b=_2a.firstChild;
var _2c={};
for(var i=0;i<_2b.childNodes.length;i++){
var _2e=_2b.childNodes[i];
if(_2e.tagName=="mechanisms"){
_2c.auth=this._configureAuthMechanisms(_2e);
}else{
if(_2e.tagName=="bind"){
_2c.bind=true;
}else{
if(_2e.tagName=="session"){
_2c.session=true;
}
}
}
}
return _2c;
},_configureAuthMechanisms:function(_2f){
var _30={};
for(var i=0;i<_2f.childNodes.length;i++){
var _32=_2f.childNodes[i];
if(_32.firstChild.nodeValue=="PLAIN"){
_30["plain"]=SASLAuth.plainAuth;
}else{
if(_32.firstChild.nodeValue=="ANONYMOUS"){
_30["anonymous"]=SASLAuth.anonymous;
}
}
}
if(!_30){
_30=function(){
return false;
};
}
return _30;
},_getNextRID:function(){
return ++this._rid;
},_createRequest:function(_33){
var _34={xmlns:"http://jabber.org/protocol/httpbind",rid:this._getNextRID(),sid:this._sid};
return util.XML.element("body",_33,_34);
},_bindConnection:function(){
var _35=new XMPP.IQ("set");
_35.setXMLNS("jabber:client");
var _36=_35.addExtension("bind","urn:ietf:params:xml:ns:xmpp-bind");
_36.appendChild(_35.doc.createElement("resource")).appendChild(_35.doc.createTextNode(this.resource));
console.debug("Bind the connection! %x",_35.doc.documentElement);
var _37=this;
var _38=function(_39){
var _3a=_39.getExtension("bind");
console.debug("Bind Response: %x",_3a);
var jid=_3a.firstChild;
_37._jid=jid.firstChild.nodeValue;
_37._establishSession();
};
var id=_35.getID();
var _3d=new org.jive.spank.PacketFilter(_38,function(_3e){
return _3e.getID()==id;
});
this.sendPacket(_35,_3d);
},_establishSession:function(){
var _3f=new XMPP.IQ("set");
_3f.setXMLNS("jabber:client");
_3f.addExtension("session","urn:ietf:params:xml:ns:xmpp-session");
console.debug("Establishing session: %x",_3f.doc.documentElement);
var _40=this;
var _41=function(_42){
_40.isAuthenticated=true;
_40._fireEvent("authenticationSuccessful");
};
var id=_3f.getID();
var _44=new org.jive.spank.PacketFilter(_41,function(_45){
return _45.getID()==id;
});
this.sendPacket(_3f,_44);
},sendPacket:function(_46,_47){
if(!_46||!(typeof _46=="object"&&_46 instanceof XMPP.Packet)){
return;
}
if(this._timer){
this._timer.cancel();
delete this._timer;
}
if(_47){
this.addPacketFilter(_47,true);
}
if(this._shouldQueuePacket()){
this._queuePacket(_46);
return;
}
var _48=new Array();
_48.push(_46);
this._sendPackets(_48);
},_sendPackets:function(_49){
if(!this.isConnected){
return;
}
var _4a=new Array();
for(var i=0;i<_49.length;i++){
this._handlePacket(this._outgoingPacketFilters.slice(),_49[i]);
_4a.push(_49[i].toXML());
}
util.HTTP.doRequest(this.binding,this._createRequest(_4a.join("")),this._packetHandler,connection._createFailureHandler(),connection._createExceptionHandler());
},_createFailureHandler:function(){
var _4c=this;
return function(_4d,_4e){
console.error("Request failure: %s",_4e);
_4c.destroy(_4e);
};
},_createExceptionHandler:function(){
var _4f=this;
return function(_50,_51){
console.error("Request exception: %s",_51);
_4f.destroy(_51);
};
},_createPacketHandler:function(){
var _52=this;
return function(_53){
var _54=_53.responseXML.documentElement;
var _55=_54.childNodes;
var len=_55.length;
_52._fireEvent("packetsReceived");
for(var i=0;i<len;i++){
var _58=_55.item(i).cloneNode(true);
var _59=_58.tagName;
var _5a;
if(_59=="iq"){
_5a=new XMPP.IQ(null,null,null,_58);
}else{
if(_59=="presence"){
_5a=new XMPP.Presence(null,null,_58);
}else{
if(_59=="message"){
_5a=new XMPP.Message(null,null,null,_58);
}else{
console.error("Server returned unknown packet, tossing: %x",_58);
continue;
}
}
}
_52._handlePacket(_52._packetFilters.slice(),_5a);
}
_52._fireEvent("packetsProcessed");
if(_52._packetQueue.length>0){
_52._sendPackets(_52._packetQueue.compact());
_52._packetQueue.clear();
}else{
_52._handlePing();
}
};
},addPacketFilter:function(_5b,_5c){
if(!_5b||!(_5b instanceof org.jive.spank.PacketFilter)){
throw Error("PacketFilter must be an instance of PacketFilter");
}
_5b.removeOnExecution=_5c;
this._packetFilters.push(_5b);
},removePacketFilter:function(_5d){
if(!_5d){
return;
}
var _5e=this._packetFilters.indexOf(_5d);
if(_5e>=0){
this._packetFilters.splice(_5e,1);
}
},addOutgoingPacketFilter:function(_5f){
if(!_5f||!(_5f instanceof org.jive.spank.PacketFilter)){
throw Error("PacketFilter must be an instance of PacketFilter");
}
this._outgoingPacketFilters.push(_5f);
},_handlePacket:function(_60,_61){
for(var i=_60.length-1;i>=0;i--){
try{
if(_60[i].accept(_61)&&_60[i].removeOnExecution){
this.removePacketFilter(_60[i]);
}
}
catch(e){
console.error("Error processing packet: %s",e.message);
if(_60[i].removeOnExecution){
this.removePacketFilter(_60[i]);
}
}
}
},_handlePing:function(_63){
if(this._timer){
this._timer.cancel();
delete this._timer;
}
if(util.HTTP.requestCount<=0){
this._timer=new TimeoutExecutor(this._pingServer(_63),2*this._pollingInterval);
}
},_pingServer:function(_64){
if(!this.isConnected){
return;
}
var _65=this;
if(!_64){
_64=this._packetHandler;
}
return function(){
util.HTTP.doRequest(_65.binding,_65._createRequest(),_64,_65._createFailureHandler(),_65._createExceptionHandler());
};
},_shouldQueuePacket:function(){
return util.HTTP.requestCount>=util.HTTP.maxConcurrentRequests||this._packetQueue.size>0;
},_queuePacket:function(_66){
this._packetQueue.push(_66);
}};
var SASLAuth={plainAuth:[{createRequest:function(_67){
var _68=_67.username+"@"+_67.domain;
_68+="\x00";
_68+=_67.username;
_68+="\x00";
_68+=_67.password;
_68=util.base64.encode(_68);
var _69={mechanism:"PLAIN",xmlns:"urn:ietf:params:xml:ns:xmpp-sasl"};
var _6a=util.XML.element("auth",_68,_69);
var _6b=_67._createRequest(_6a);
console.debug("Plain auth request: %s",_6b);
return _6b;
},handleResponse:function(_6c){
var _6d=_6c.tagName=="success";
return {authComplete:true,authSuccess:_6d};
}}],anonymous:[{createRequest:function(_6e){
var _6f={mechanism:"ANONYMOUS",xmlns:"urn:ietf:params:xml:ns:xmpp-sasl"};
var _70=util.XML.element("auth",null,_6f);
var _71=_6e._createRequest(_70);
console.debug("Plain auth request: %s",_71);
return _71;
},handleResponse:function(_72){
var _73=_72.tagName=="success";
return {authComplete:true,authSuccess:_73};
}}]};
var TimeoutExecutor=Class.create();
TimeoutExecutor.prototype={initialize:function(_74,_75){
this.callback=_74;
this.timeout=_75;
this.currentlyExecuting=false;
this.registerCallback();
},registerCallback:function(){
this.timeoutID=setTimeout(this.onTimerEvent.bind(this),this.timeout*1000);
},onTimerEvent:function(){
try{
this.currentlyExecuting=true;
if(this.callback&&this.callback instanceof Function){
this.callback();
}
}
finally{
this.currentlyExecuting=false;
delete this.timeoutID;
}
},cancel:function(){
if(!this.currentlyExecuting&&this.timeoutID){
clearTimeout(this.timeoutID);
delete this.timeoutID;
}
},reset:function(){
if(!this.currentlyExecuting&&this.timeoutID){
clearTimeout(this.timeoutID);
delete this.timeoutID;
this.registerCallback();
}
}};
var org={};
org.jive={};
org.jive.spank={};
org.jive.spank.chat={};
org.jive.spank.chat.Manager=function(_76,_77,_78){
if(!_76||!(_76 instanceof XMPPConnection)){
throw Error("connection required for ChatManager.");
}
this.getConnection=function(){
return _76;
};
this.servers={};
if(_77){
this.servers[_77]=false;
}
var _79=this;
_76.addConnectionListener({connectionClosed:function(){
_79.destroy();
}});
this.packetFilter=new org.jive.spank.PacketFilter(this._createMessageHandler(),this._createMessageFilter());
_76.addPacketFilter(this.packetFilter);
this._chatSessions=new Array();
this._chatSessionListeners=new Array();
this._baseID=util.StringUtil.randomString(5);
this._threadID=1;
this.shouldUseThreads=_78;
this.presenceFilter=new org.jive.spank.PacketFilter(this._presenceHandler.bind(this),function(_7a){
return _7a.getPacketType()=="presence"&&_7a.getType()=="unavailable";
});
_76.addPacketFilter(this.presenceFilter);
};
org.jive.spank.chat.Manager.prototype={_createMessageHandler:function(){
var _7b=this;
return function(_7c){
_7b._handleMessage(_7c);
};
},_createMessageFilter:function(){
return function(_7d){
return _7d.getPacketType()=="message"&&_7d.getType()=="chat"&&_7d.getBody();
};
},_presenceHandler:function(_7e){
var _7f=this._chatSessions.find(function(_80){
return _80.sessionMatches(_7e.getFrom(),null,true);
});
if(!_7f||this.servers[_7e.getFrom().getDomain()]){
return;
}
var _81=_7f.getJID().getBareJID();
_7f.getJID=function(){
return _81;
};
},_handleMessage:function(_82){
console.debug("Handling message: %s",_82.getID());
var _83=this._chatSessions.find(function(_84){
return _84.sessionMatches(_82.getFrom(),_82.getThread());
});
if(!_83){
_83=this.createSession(_82.getFrom(),(this.shouldUseThreads?_82.getThread():null));
}
_83._handleMessage(_82);
},addChatSessionListener:function(_85){
this._chatSessionListeners.push(_85);
},removeChatSessionListener:function(_86){
if(!_86){
return;
}
var _87=this._chatSessionListeners.indexOf(_86);
if(_87>=0){
this._chatSessionListeners.splice(_87,1);
}
},closeChatSession:function(_88){
if(!_88){
return;
}
var _89=this._chatSessions.indexOf(_88);
if(_89<0){
return;
}
this._chatSessions.splice(_89,1);
delete _88._messageListeners;
this._fireChatSessionClosed(_88);
},_fireNewChatSessionCreated:function(_8a){
var _8b=this;
this._chatSessionListeners.each(function(_8c){
if(_8c.created){
_8c.created(_8b,_8a);
}
});
},_fireChatSessionClosed:function(_8d){
var _8e=this;
this._chatSessionListeners.each(function(_8f){
if(_8f.closed){
_8f.closed(_8e,_8d);
}
});
},getSession:function(jid,_91){
return this._chatSessions.find(function(_92){
return _92.sessionMatches(jid,_91);
});
},createSession:function(jid,_94){
if(!jid){
throw new Error("JID must be specified.");
}
if(!_94&&this.shouldUseThreads){
_94=this._createThreadID();
}
var _95=new org.jive.spank.chat.Session(this,jid,_94);
this._chatSessions.push(_95);
this._fireNewChatSessionCreated(_95);
return _95;
},registerDomain:function(_96,_97){
this.servers[_96]=_97;
},_createThreadID:function(){
return this._baseID+this._threadID++;
},destroy:function(){
for(var i=0;i<this._chatSessions.length;i++){
this.closeChatSession(this._chatSessions[i]);
}
this._chatSessions.clear();
this._chatSessionListeners.clear();
delete this._chatSessionListeners;
this.getConnection=Prototype.emptyFunction;
}};
org.jive.spank.chat.Session=function(_99,jid,_9b){
this.getJID=function(){
return jid;
};
this.getThread=function(){
return _9b;
};
this.getManager=function(){
return _99;
};
this._messageListeners=new Array();
};
org.jive.spank.chat.Session.prototype={getJIDString:function(){
if(this.getManager().servers[this.getJID().getDomain()]){
return this.getJID().toString();
}else{
return this.getJID().toBareJID();
}
},sessionMatches:function(jid,_9d,_9e){
var _9f;
if(this.getManager().servers[jid.getDomain()]||_9e){
_9f=jid.toString()==this.getJID().toString();
}else{
_9f=jid.toBareJID()==this.getJID().toBareJID();
}
if(this.getManager().shouldUseThreads&&_9d){
return _9f&&this.getThread()==_9d;
}else{
return _9f;
}
},addListener:function(_a0){
if(!_a0){
return;
}
this._messageListeners.push(_a0);
},_handleMessage:function(_a1){
var _a2=this;
var jid=_a1.getFrom();
this.getJID=function(){
return jid;
};
this._messageListeners.each(function(_a4){
if(_a4.messageRecieved){
_a4.messageRecieved(_a2,_a1);
}
});
},sendMessage:function(_a5,_a6){
if(!_a6){
_a6=new XMPP.Message("chat",this.getManager().getConnection()._jid,this.getJID());
}else{
_a6.setTo(this.getJID());
_a6.setType("chat");
_a6.setBody(_a5);
}
_a6.setBody(_a5);
_a6.setThread(this.getThread());
this.getManager().getConnection().sendPacket(_a6);
}};
org.jive.spank.chat.ChatSessionListener=function(_a7,_a8){
this.created=_a7;
this.closed=_a8;
};
org.jive.spank.presence={};
org.jive.spank.presence.Manager=function(_a9,jid,_ab){
if(!_a9||!(_a9 instanceof XMPPConnection)){
throw Error("Connection required for the presence manager.");
}
this.getConnection=function(){
return _a9;
};
var _ac=this;
_a9.addConnectionListener({connectionClosed:function(){
_ac.destroy();
}});
if(!jid){
this._presencePacketFilter=new org.jive.spank.PacketFilter(this._createPresencePacketHandler(),function(_ad){
return _ad.getPacketType()=="presence";
});
}else{
this._presencePacketFilter=new org.jive.spank.PacketFilter(this._createPresencePacketHandler(),function(_ae){
return _ae.getPacketType()=="presence"&&_ae.getFrom().toBareJID()==jid.toBareJID();
});
}
_a9.addPacketFilter(this._presencePacketFilter);
this._presenceListeners=new Array();
this._presence={};
this._jid=jid;
this.mode=_ab;
};
org.jive.spank.presence.Manager.prototype={sendPresence:function(_af){
if(!_af){
_af=new XMPP.Presence();
}
if(!_af.getTo()&&this._jid){
_af.setTo(this._jid.toString());
}
this.getCurrentPresence=function(){
return _af;
};
this.getConnection().sendPacket(_af);
},setSubscriptionMode:function(_b0){
this.mode=_b0;
},addPresenceListener:function(_b1){
if(!_b1||!(_b1 instanceof Function)){
throw Error("Presence listener must be function");
}
this._presenceListeners.push(_b1);
},getHighestResource:function(jid){
var _b3=jid.toBareJID();
if(!this._presence[_b3]){
return null;
}
var _b4;
for(var _b5 in this._presence[_b3].resources){
var _b6=this._presence[_b3].resources[_b5];
if(!_b4||_b6.getPriority()>=_b4.getPriority){
_b4=_b6;
}
}
return _b4;
},getPresence:function(jid){
if(!jid.getResource()){
return this.getHighestResource(jid);
}
var _b8=jid.toBareJID();
if(!this._presence[_b8]){
return null;
}else{
return this._presence[_b8].resources[jid.getResource()];
}
},_createPresencePacketHandler:function(){
var _b9=this;
return function(_ba){
_b9._handlePresencePacket(_ba);
};
},_handlePresencePacket:function(_bb){
var _bc=_bb.getType();
if(_bc=="available"||_bc=="unavailable"){
var jid=_bb.getFrom();
var _be=jid.toBareJID();
if(!this._presence[_be]&&_bc=="available"){
this._presence[_be]={};
this._presence[_be].resources={};
}else{
if(!this._presence[_be]){
return;
}
}
var _bf=jid.getResource();
if(_bc=="available"){
this._presence[jid.toBareJID()].resources[_bf]=_bb;
}else{
delete this._presence[jid.toBareJID()].resources[_bf];
}
}else{
if((_bb.getType()=="subscribe"||_bb.getType()=="unsubscribe")&&(this.mode=="accept"||this.mode=="reject")){
var _c0=new XMPP.Presence(_bb.getFrom());
_c0.setType((this.mode=="accept"&&_bb.getType()!="unsubscribe"?"subscribed":"unsubscribed"));
this.getConnection().sendPacket(_c0);
}
}
if(!this._presenceListeners){
return;
}
this._presenceListeners.each(function(_c1){
_c1(_bb);
});
},destroy:function(){
delete this._presence;
if(this.getConnection()){
this.getConnection().removePacketFilter(this._presencePacketFilter);
}
this.getConnection=Prototype.emptyFunction;
delete this._presenceListeners;
}};
org.jive.spank.roster={};
org.jive.spank.roster.Manager=function(_c2,_c3,_c4){
if(!_c2||!(_c2 instanceof XMPPConnection)){
throw Error("Connection required for the roster manager.");
}
var _c5=this;
_c2.addConnectionListener({connectionClosed:function(){
_c5.destroy();
}});
this.getConnection=function(){
return _c2;
};
this.rosterPacketFilter=new org.jive.spank.PacketFilter(this._rosterPacketHandler(),this._createRosterPacketFilter);
_c2.addPacketFilter(this.rosterPacketFilter);
if(!_c4){
_c4=new org.jive.spank.presence.Manager(_c2);
}
this.onLoadCallback=_c3;
var _c6=new org.jive.spank.roster.Packet();
this._initialRequestID=_c6.getID();
_c2.sendPacket(_c6);
this.rosterListeners=new Array();
};
org.jive.spank.roster.Manager.prototype={getRoster:function(){
return this._roster;
},_rosterPacketHandler:function(){
var _c7=this;
return function(_c8){
_c7._handleRosterPacket(new org.jive.spank.roster.Packet(null,null,null,_c8.rootNode.cloneNode(true)));
};
},_createRosterPacketFilter:function(_c9){
var _ca=_c9.getExtension("query");
return _ca!=null&&_ca.namespaceURI=="jabber:iq:roster";
},_handleRosterPacket:function(_cb){
console.debug("Roster packet recieved %s",_cb.getID());
if(_cb.getID()==this._initialRequestID){
this._handleInitialResponse(_cb);
}else{
if(_cb.getType()=="set"){
this._handleRosterAdd(_cb,true);
}
}
},_handleInitialResponse:function(_cc){
this._roster={};
this._users={};
this._handleRosterAdd(_cc,false);
if(this.onLoadCallback&&this.onLoadCallback instanceof Function){
this.onLoadCallback(this);
this.onLoadCallback=Prototype.emptyFunction;
}
presenceManager.sendPresence();
},_handleRosterAdd:function(_cd,_ce){
var _cf=_cd.getItems();
var _d0=this._roster;
var _d1=this._users;
var _d2=new Array();
var _d3=new Array();
var _d4=new Array();
_cf.each(function(_d5){
var jid=_d5.getJID().toBareJID();
if(_d5.getSubscription()=="remove"||(_d5.getSubscription()=="none"&&!_d5.isSubscriptionPending())){
_d5=_d1[jid];
if(!_d5){
return;
}
delete _d1[jid];
if(_d0["unfiled"]&&_d0["unfiled"][_d5.getName()]){
delete _d0["unfiled"][_d5.getJID().toString()];
}
var _d7=_d5.getGroups();
for(var i=0;i<_d7.length;i++){
var _d9=_d7[i];
if(!_d0[_d9]){
continue;
}
delete _d0[_d9][_d5.getJID().toString()];
}
_d3.push(_d5);
return;
}
var _da=false;
var _db=false;
var _dc;
if(_d1[jid]){
_dc=_d1[jid];
var _dd=_dc.getGroups();
var _d7=_d5.getGroups();
for(var i=0;i<_dd.length;i++){
var _d9=_d7[i];
if(_d7.indexOf(_dd[i])<0&&_d0[_d9]){
if(!_da){
_da=true;
_d4.push(_d5);
}
delete _d0[_d9][_dc.getJID().toString()];
}
}
}else{
_db=true;
_d2.push(_d5);
}
if(!_da&&!_db&&(_dc.getName()!=_d5.getName()||_dc.getSubscription()!=_d5.getSubscription())){
_da=true;
_d4.push(_d5);
}
_d1[jid]=_d5;
var _d7=_d5.getGroups();
for(var i=0;i<_d7.length;i++){
var _d9=_d7[i];
if(!_d0[_d9]){
_d0[_d9]={};
}
if(!_d0[_d9][_d5.getJID().toString()]&&!_da&&!_db){
_da=true;
_d4.push(_d5);
}
_d0[_d9][_d5.getJID().toString()]=_d5;
}
if(_d7.length==0){
if(!_d0["unfiled"]){
_d0["unfiled"]={};
}
if(!_d0["unfiled"][_d5.getJID().toString()]&&!_da&&!_db){
_da=true;
_d4.push(_d5);
}
_d0["unfiled"][_d5.getJID().toString()]=_d5;
}
});
if(_ce){
this._fireRosterUpdates(_d2,_d4,_d3);
}
},_fireRosterUpdates:function(_de,_df,_e0){
this.rosterListeners.each(function(_e1){
if(_de.length>0&&_e1.onAdded){
_e1.onAdded(_de);
}
if(_df.length>0&&_e1.onUpdated){
_e1.onUpdated(_df);
}
if(_e0.length>0&&_e1.onRemoved){
_e1.onRemoved(_e0);
}
});
},addEntry:function(jid,_e3,_e4){
var _e5=new org.jive.spank.roster.Packet("set");
var _e6=_e5.addItem(jid,_e3);
if(_e4){
_e6.addGroups(_e4);
}
console.debug("adding contact: %x",_e5.doc.documentElement);
this.getConnection().sendPacket(_e5);
var _e7=new XMPP.Presence(jid);
_e7.setType("subscribe");
this.getConnection().sendPacket(_e7);
},removeEntry:function(jid){
var _e9=new org.jive.spank.roster.Packet("set");
var _ea=_e9.addItem(jid);
_ea.setSubscription("remove");
console.debug("removing roster entry: %x",_e9.doc.documentElement);
this.getConnection().sendPacket(_e9);
},addRosterListener:function(_eb){
this.rosterListeners.push(_eb);
},removeRosterListener:function(_ec){
if(!_ec){
return;
}
var _ed=this.rosterListeners.indexOf(_ec);
if(_ed>=0){
this.rosterListeners.splice(_ed,1);
}
},destroy:function(){
this.rosterListeners.clear();
this.getConnection=Prototype.emptyFunction;
delete this._roster;
delete this._users;
delete this._handleRosterAdd;
this.onLoadCallback=Prototype.emptyFunction;
delete this._initialRequestID;
}};
org.jive.spank.disco={_connections:new Array(),getManager:function(_ee){
var sid=_ee._sid;
if(org.jive.spank.disco._connections[sid]==null){
org.jive.spank.disco._connections[sid]=new org.jive.spank.disco.Manager(_ee);
_ee.addConnectionListener({connectionClosed:function(){
delete org.jive.spank.disco._connections[sid];
}});
}
return org.jive.spank.disco._connections[sid];
}};
org.jive.spank.disco.Manager=function(_f0){
this._connection=_f0;
var _f1=this;
this.features=new Array();
this.infoCache={};
var _f2=new org.jive.spank.PacketFilter(function(_f3){
_f1._handleDiscoResquest(_f3);
},function(_f4){
return _f4.getPacketType()=="iq"&&_f4.getType()=="get"&&_f4.getQuery()&&_f4.getQuery().getAttribute("xmlns")=="http://jabber.org/protocol/disco#info";
});
_f0.addPacketFilter(_f2);
_f0.addConnectionListener({connectionClosed:function(){
_f1.destroy();
}});
};
org.jive.spank.disco.Manager.prototype={getCategory:function(jid,_f6){
var _f7=this.infoCache[jid.toString()];
if(!_f7||_f6){
this.discoverInfo(null,jid);
return null;
}
if(_f7.getType()!="result"){
return null;
}
var _f8=_f7.getExtension("query");
var _f9=_f8.childNodes;
for(var i=0;i<_f9.length;i++){
if(_f9[i].tagName=="identity"){
return _f9[i].getAttribute("category");
}
}
return null;
},hasFeature:function(jid,_fc,_fd){
var _fe=this.infoCache[jid.toString()];
if(!_fe||_fd){
this.discoverInfo(null,jid);
return false;
}
if(_fe.getType()!="result"){
return false;
}
var _ff=_fe.getExtension("query");
var info=_ff.childNodes;
for(var i=0;i<info.length;i++){
if(info[i].tagName=="feature"){
if(info[i].getAttribute("var")==_fc){
return true;
}
}
}
return false;
},discoverInfo:function(_102,jid,node){
var _105=new XMPP.IQ("get",this._connection._jid,jid.toString());
var id=_105.getID();
var _107=_105.setQuery("http://jabber.org/protocol/disco#info");
if(node){
_107.setAttribute("node",node);
}
var self=this;
this._connection.sendPacket(_105,new org.jive.spank.PacketFilter(function(_109){
self.infoCache[jid.toString()]=_109;
if(_102){
_102(_109);
}
},function(_10a){
return _10a.getID()==id;
}));
},discoverItems:function(_10b,jid,node){
if(!_10b){
return;
}
var _10e=new XMPP.IQ("get",this._connection._jid,jid.toString());
var id=_10e.getID();
var _110=_10e.setQuery("http://jabber.org/protocol/disco#items");
if(node){
_110.setAttribute("node",node);
}
this._connection.sendPacket(_10e,new org.jive.spank.PacketFilter(_10b,function(_111){
return _111.getID()==id;
}));
},addFeature:function(_112){
this.features.push(_112);
},removeFeature:function(_113){
var _114=this.features.indexOf(_113);
if(_114>=0){
this.features.splice(_114,1);
}
},_handleDiscoResquest:function(get){
var _116=new XMPP.IQ("result",this._connection._jid,get.getFrom());
_116.setID(get.getID());
var _117=_116.setQuery("http://jabber.org/protocol/disco#info");
var _118=_117.appendChild(_116.doc.createElement("identity"));
_118.setAttribute("category","client");
_118.setAttribute("name","spank");
_118.setAttribute("type","web");
for(var i=0;i<this.features.length;i++){
var _11a=this.features[i];
var _11b=_117.appendChild(_116.doc.createElement("feature"));
_11b.setAttribute("var",_11a);
}
this._connection.sendPacket(_116);
},destroy:function(){
this.infoCache={};
var _11c=org.jive.spank.disco._connections.indexOf(this);
if(_11c>=0){
org.jive.spank.disco._connections.splice(_11c,1);
}
}};
org.jive.spank.muc={};
org.jive.spank.muc.Manager=function(_11d,_11e){
this._connection=_11d;
var self=this;
_11d.addConnectionListener({connectionClosed:function(){
self.destroy();
}});
this.invitationListeners=new Array();
this.rooms=new Array();
this.chatManager=_11e;
org.jive.spank.disco.getManager(_11d).addFeature("http://jabber.org/protocol/muc");
};
org.jive.spank.muc.Manager.prototype={getConferenceServers:function(_120,_121){
if(!_121){
_121=new XMPP.JID(this._connection.domain);
}
var _122=function(_123){
var _124=_123.getExtension("query");
var _125=_124.childNodes;
for(var i=0;i<_125.length;i++){
var info=_125[i];
if(info.tagName=="feature"){
if(info.getAttribute("var")=="http://jabber.org/protocol/muc"){
_120(_123.getFrom());
return;
}
}
}
};
var _128=function(_129){
var _12a=_129.getExtension("query");
var _12b=_12a.childNodes;
var _12c={};
for(var i=0;i<_12b.length;i++){
var jid=_12b[i].getAttribute("jid");
if(!jid){
continue;
}
org.jive.spank.disco.getManager(this._connection).discoverInfo(_122,new XMPP.JID(jid));
}
}.bind(this);
org.jive.spank.disco.getManager(this._connection).discoverItems(_128,_121);
},retrieveRooms:function(_12f,_130){
if(!_12f||!_130){
return;
}
var _131=function(_132){
var _133=_132.getExtension("query");
var _134=_133.childNodes;
var _135={};
for(var i=0;i<_134.length;i++){
var jid=_134[i].getAttribute("jid");
if(!jid){
continue;
}
var name=_134[i].getAttribute("name");
_135[jid]={name:name};
}
_130(_135);
};
org.jive.spank.disco.getManager(this._connection).discoverItems(_131,_12f);
},retrieveRoomsInfo:function(_139,_13a){
if(!_139||!_13a){
return;
}
var _13b=0;
var _13c=function(_13d){
var jid=_13d.getFrom().toString();
var _13f=_13d.getExtension("query");
var info=_13f.childNodes;
var room=_139[jid];
if(room){
for(var i=0;i<info.length;i++){
if(info[i].tagName=="feature"){
}else{
if(info[i].tagName=="x"){
var _143=new XMPP.XData(null,info[i]);
var _144=_143.getFields();
for(var _145 in _144){
_139[jid][_145]={};
for(var _146 in _144[_145]){
_139[jid][_145][_146]=_144[_145][_146];
}
}
}
}
}
}
if(--_13b<=0){
_13a(_139);
}
};
for(var room in _139){
_13b++;
org.jive.spank.disco.getManager(this._connection).discoverInfo(_13c,room);
}
},createRoom:function(_148){
this.chatManager.registerDomain(_148.getDomain(),true);
return new org.jive.spank.muc.Room(this,_148);
},getRoom:function(_149){
return this.rooms.detect(function(_14a,_14b){
return _14a.jid.toString()==_149.toString();
});
},_addRoom:function(room){
this.rooms.push(room);
},_removeRoom:function(room){
if(!room){
return;
}
var _14e=this.rooms.indexOf(room);
if(_14e>=0){
this.rooms.splice(_14e,1);
}
},addInvitationsListener:function(_14f){
if(!(_14f instanceof Function)){
throw Error("invitation listener must be a function.");
}
var _150=this.invitationListeners;
if(this.invitationListeners.length<=0){
this.invitationFilter=new org.jive.spank.PacketFilter(function(_151){
var _152=new org.jive.spank.muc.User(null,null,_151.rootNode.cloneNode(true));
var _153=_152.getInvite();
if(_153){
_150.each(function(_154){
_154(_153);
});
}
},function(_155){
if(_155.getPacketType()!="message"){
return false;
}
var ex=_155.getExtension("x");
if(!ex){
return false;
}
return ex.getAttribute("xmlns")=="http://jabber.org/protocol/muc#user";
});
this._connection.addPacketFilter(this.invitationFilter);
}
this.invitationListeners.push(_14f);
},removeInvitationsListener:function(_157){
if(!_157||!(_157 instanceof Function)){
throw Error("listeners must be a function");
}
var _158=this.invitationListeners.indexOf(_157);
if(_158>=0){
this.invitationListeners.splice(_158,1);
}
if(this.invitationListeners.size()<=0&&this.invitationFilter){
this._connection.removePacketFilter(this.invitationFilter);
delete this.invitationFilter;
}
},declineInvitation:function(from,room,_15b){
if(!room||!from){
throw Error("Cannot decline invitation, invitiation missing information");
}
var _15c=new org.jive.spank.muc.User(room);
_15c.setDecline(from,_15b);
this._connection.sendPacket(_15c);
},destroy:function(){
for(var i=0;i<this.rooms.length;i++){
this.rooms[i].leave(true);
}
this.rooms.clear();
this.invitationListeners.clear();
}};
org.jive.spank.muc.Room=function(_15e,_15f){
this.manager=_15e;
this.connection=_15e._connection;
this.jid=_15f;
this.presenceListeners=new Array();
this.messageListeners=new Array();
this.isJoined=false;
};
org.jive.spank.muc.Room.prototype={join:function(_160,_161,_162,_163,_164){
var _165=this.jid;
var _166=new XMPP.Presence(_165.toString()+"/"+_160);
var _167=_166.addExtension("x","http://jabber.org/protocol/muc");
if(_161){
var _168=_167.appendChild(_166.doc.createElement("password"));
_168.appendChild(_166.doc.createTextNode(_161));
}
this._initPresenceManager(_160,_164);
if(_163){
this._initMessageListener(_163);
}
var _169;
if(_162&&(_162.onSuccess||_162.onError)){
var room=this;
_169=new org.jive.spank.PacketFilter(function(_16b){
if(_16b.getError()&&_162.onError){
this.presenceManager.destroy();
this.presenceManager=undefined;
this.connection.removePacketFilter(this.messageFilter);
_162.onError(_16b);
}else{
if(!_16b.getError()&&_162.onSuccess){
this.manager._addRoom(this);
this.nickname=_160;
room.occupantJid=new XMPP.JID(_165.toString()+"/"+_160);
room.isJoined=true;
this.presenceManager._handlePresencePacket(_16b);
_162.onSuccess(new org.jive.spank.muc.Occupant(_16b));
}
}
_162=Prototype.emptyFunction;
}.bind(this),function(_16c){
return _16c.getFrom().toString()==_166.getTo().toString();
});
}
this.connection.sendPacket(_166,_169);
},create:function(_16d,_16e,_16f,_170,_171){
var _172={};
if(_16f.onSuccess){
_172.onSuccess=this._createSuccess.bind(this,_16f.onSuccess,_16e,_170,_171);
}
this.join(_16d,null,_172);
},_createSuccess:function(_173,_174,_175,_176,_177){
var _178=function(_179,_17a,_17b,_17c,_17d,room,_17f){
var _180=_17f.getAnswerForm();
for(var _181 in _17a){
_180.setAnswer(_181,[_17a[_181]]);
}
this.sendConfigurationForm(_180);
this.addOccupantListener(_17d);
this._initMessageListener(_17c);
_17b(_179);
_17b=Prototype.emptyFunction;
};
this.getConfigurationForm(_178.bind(this,_177,_174,_173,_175,_176));
},leave:function(_182){
this.isJoined=false;
this.connection.removePacketFilter(this.messageFilter);
delete this.connection;
try{
var _183=new XMPP.Presence();
_183.setType("unavailable");
this.presenceManager.sendPresence(_183);
}
catch(error){
}
this.presenceManager.destroy();
this.presenceManager=undefined;
if(!_182){
this.manager._removeRoom(this);
}
},_initPresenceManager:function(_184,_185){
this.presenceManager=new org.jive.spank.presence.Manager(this.connection,new XMPP.JID(this.jid.toString()+"/"+_184));
if(_185){
this.addOccupantListener(_185);
}
},addOccupantListener:function(_186){
var _187=function(_188){
if(!_188.getError()){
_186(new org.jive.spank.muc.Occupant(_188));
}
};
this.presenceManager.addPresenceListener(_187);
},getOccupants:function(){
var _189=new Array();
var _18a=this.presenceManager._presence[this.jid];
if(!_18a){
return _189;
}
var _18b=_18a.resources;
for(var _18c in _18b){
var _18d=_18b[_18c];
if(_18d.getType!="unavailable"){
_189.push(new org.jive.spank.muc.Occupant(_18d));
}
}
return _189;
},getOccupant:function(nick){
var _18f=this.jid+"/"+nick;
var _190=this.presenceManager._presence[this.jid].resources[nick];
if(_190==null||_190.getType()=="unavailable"){
return null;
}else{
return new org.jive.spank.muc.Occupant(_190);
}
},_initMessageListener:function(_191){
var room=this;
this.messageFilter=new org.jive.spank.PacketFilter(function(_193){
room.messageListeners.each(function(_194){
var _195=false;
if(_193.getSubject()&&_194.subjectUpdated){
_194.subjectUpdated(room,_193.getFrom(),_193.getSubject());
_195=true;
}
var ex=_193.getExtension("x");
if(ex){
var _197=ex.getAttribute("xmlns")=="http://jabber.org/protocol/muc#user";
if(_197&&_194.invitationDeclined){
var user=new org.jive.spank.muc.User(null,null,_193.rootNode);
var _199=user.getDecline();
if(_199){
_194.invitationDeclined(_199);
_195=true;
}
}
}
if(_194.messageReceived&&!_195){
_194.messageReceived(_193);
}
});
},function(_19a){
return _19a.getFrom().toBareJID()==room.jid.toBareJID()&&_19a.getPacketType()=="message"&&(_19a.getType()=="groupchat"||_19a.getType()=="normal");
});
this.connection.addPacketFilter(this.messageFilter);
if(_191){
this.messageListeners.push(_191);
}
},sendMessage:function(_19b,_19c){
if(!_19c){
_19c=new XMPP.Message("groupchat",this.connection,this.jid);
}else{
_19c.setType("groupchat");
_19c.setFrom(this.jid);
}
_19c.setBody(_19b);
this.connection.sendPacket(_19c);
},addMessageListener:function(_19d){
if(!_19d){
throw Error("listeners cannot be null");
}
this.messageListeners.push(_19d);
},removeMessageListener:function(_19e){
if(!_19e){
throw Error("listeners must be a function");
}
var _19f=this.messageListeners.indexOf(_19e);
if(_19f>=0){
this.messageListeners.splice(_19f,1);
}
},setSubject:function(_1a0){
var _1a1=new XMPP.Message(this.jid);
var ex=_1a1.addExtension("subject");
ex.appendChild(_1a1.doc.createTextNode(_1a0));
this.connection.sendPacket(_1a1);
},invite:function(jid,_1a4){
var _1a5=new org.jive.spank.muc.User(this.jid);
_1a5.setInvite(jid,_1a4);
this.connection.sendPacket(_1a5);
},changeNickname:function(_1a6){
if(!this.isJoined){
throw Error("Cannot change nickname if not in room.");
}
var _1a7=new XMPP.Presence();
_1a7.setTo(new XMPP.JID(this.jid.toBareJID()+"/"+_1a6));
this.connection.sendPacket(_1a7);
},getConfigurationForm:function(_1a8){
var iq=new XMPP.IQ("get",this.jid,this.jid.getBareJID());
iq.setQuery("http://jabber.org/protocol/muc#owner");
var _1aa=org.jive.spank.PacketFilter.filter.IDFilter(function(_1ab){
if(_1ab.getExtension("x","jabber:x:data")){
_1a8(this.jid.getBareJID(),new XMPP.XData(null,_1ab.getExtension("x","jabber:x:data")));
}
}.bind(this),iq);
this.connection.sendPacket(iq,_1aa);
},sendConfigurationForm:function(form,_1ad){
var iq=new XMPP.IQ("set",this.jid,this.jid.getBareJID());
var _1af=iq.setQuery("http://jabber.org/protocol/muc#owner");
var _1b0=form.rootNode.cloneNode(true);
if(iq.doc.importNode){
iq.doc.importNode(_1b0,true);
}
_1af.appendChild(_1b0);
var _1b1=_1b0.childNodes;
for(var i=_1b1.length-1;i>=0;i--){
if(!_1b1[i].hasChildNodes()){
_1b0.removeChild(_1b1[i]);
}
}
var _1b3;
if(_1ad){
org.jive.spank.PacketFilter.filter.IDFilter(function(_1b4,jid){
_1ad(jid.getBareJID());
}.bind(this),this.jid);
}
this.connection.sendPacket(iq,_1b3);
}};
org.jive.spank.muc.Occupant=function(_1b6){
this.presence=_1b6;
};
org.jive.spank.muc.Occupant.prototype={getAffiliation:function(){
var user=this.presence.getExtension("x");
if(user==null){
return null;
}
return user.firstChild.getAttribute("affiliation");
},getRole:function(){
var user=this.presence.getExtension("x");
if(user==null){
return null;
}
return user.firstChild.getAttribute("role");
},getNick:function(){
return this.presence.getFrom().getResource();
},getRoom:function(){
return this.presence.getFrom().toBareJID();
}};
org.jive.spank.PacketFilter=function(_1b9,_1ba){
if(!_1b9){
throw Error("Callback must be specified");
}
this.getFilterTest=function(){
return _1ba;
};
this.getCallback=function(){
return _1b9;
};
};
org.jive.spank.PacketFilter.prototype={accept:function(_1bb){
if(!_1bb||!(_1bb instanceof XMPP.Packet)){
return;
}
var _1bc=this.getFilterTest();
var _1bd=true;
if(_1bc){
_1bd=_1bc(_1bb);
}
if(_1bd){
var _1be=this.getCallback();
_1be(_1bb);
}
return _1bd;
}};
org.jive.spank.PacketFilter.filter={IDFilter:function(_1bf,_1c0){
return new org.jive.spank.PacketFilter(_1bf,function(_1c1,_1c2){
return _1c2.getID()==_1c1.getID();
}.bind(this,_1c0));
}};
org.jive.spank.x={};
org.jive.spank.x.chatstate={_connections:new Array(),getManager:function(_1c3){
if(org.jive.spank.x.chatstate._connections[_1c3.getConnection()._sid]==null){
org.jive.spank.x.chatstate._connections[_1c3.getConnection()._sid]=new org.jive.spank.x.chatstate.Manager(_1c3);
}
return org.jive.spank.x.chatstate._connections[_1c3.getConnection()._sid];
}};
org.jive.spank.x.chatstate.Manager=function(_1c4){
this._manager=_1c4;
this._connection=_1c4.getConnection();
this._lastState={};
this._lastStateSent={};
this._stateListeners=new Array();
var self=this;
this._connection.addPacketFilter(new org.jive.spank.PacketFilter(this._handleIncomingState.bind(this),function(_1c6){
return _1c6.getPacketType()=="message"&&(_1c6.getType()=="chat"||_1c6.getType()=="groupchat")&&_1c6.getExtension(null,"http://jabber.org/protocol/chatstates")&&!_1c6.getExtension("x","jabber:x:delay");
}));
_1c4.getConnection().addConnectionListener({connectionClosed:function(){
self.destroy();
}});
org.jive.spank.disco.getManager(_1c4.getConnection()).addFeature("http://jabber.org/protocol/chatstates");
};
org.jive.spank.x.chatstate.Manager.prototype={setCurrentState:function(_1c7,jid,_1c9,_1ca){
var _1cb=false;
if(!_1c9){
_1c9=new XMPP.Message((_1ca?"groupchat":"chat"),null,jid);
_1cb=true;
}
if(!_1ca&&!this.shouldSendState(jid)){
if(_1cb){
return null;
}else{
return _1c9;
}
}
_1c7=(_1c7?_1c7:"active");
_1c9.addExtension(_1c7,"http://jabber.org/protocol/chatstates");
this._lastStateSent[jid.toString()]=_1c7;
return _1c9;
},shouldSendState:function(jid){
if(this._lastState[jid.toString()]){
return this._lastState[jid.toString()];
}
if(!jid.getResource()){
return !this._lastStateSent[jid.toString()];
}
var _1cd=org.jive.spank.disco.getManager(this._connection);
var _1ce=_1cd.getCategory(jid);
if(!_1ce){
return false;
}else{
if(_1ce=="conference"){
return true;
}
}
return _1cd.hasFeature(jid,"http://jabber.org/protocol/chatstates");
},addStateListener:function(_1cf){
if(_1cf&&_1cf instanceof Function){
this._stateListeners.push(_1cf);
}
},removeStateListener:function(_1d0){
if(_1d0){
var i=this._stateListeners.indexOf(_1d0);
if(i>=0){
this._stateListeners.splice(i,1);
}
}
},_handleIncomingState:function(_1d2){
var from=_1d2.getFrom().toString();
var _1d4=_1d2.getExtension(null,"http://jabber.org/protocol/chatstates");
this._lastState[from]=_1d4.tagName;
for(var i=0;i<this._stateListeners.length;i++){
this._stateListeners[i](_1d2.getFrom(),_1d4.tagName,_1d2.getType()=="groupchat");
}
},destroy:function(){
}};
var util={XML:{element:function(name,_1d7,_1d8){
var _1d9="";
if(_1d8){
_1d9=this.formatAttributes(_1d8);
}
var xml;
if(!_1d7){
xml="<"+name+_1d9+"/>";
}else{
xml="<"+name+_1d9+">"+_1d7+"</"+name+">";
}
return xml;
},formatAttributes:function(_1db){
var _1dc="";
for(var attr in _1db){
var _1de=_1db[attr];
_1dc+=" "+attr+"=\""+_1de+"\"";
}
return _1dc;
}},HTTP:{requestCount:0,maxConcurrentRequests:2,failureState:false,pendingRequests:new Array(),doRequest:function(url,_1e0,_1e1,_1e2,_1e3){
if(this.failureState){
throw Error("HTTP connection in failure state and must be reset.");
}
if(this.requestCount>=this.maxConcurrentRequests){
this.pendingRequests.push({requestURL:url,requestBody:_1e0,requestCallback:_1e1,requestFailure:_1e2,requestException:_1e3});
return;
}
var _1e4=this.pendingRequests;
var _1e5=function(_1e6){
util.HTTP.requestCount--;
if(_1e4.length>0){
var _1e7=_1e4.splice(0,1)[0];
util.HTTP.doRequest(_1e7.requestURL,_1e7.requestBody,_1e7.requestCallback,_1e7.requestFailure,_1e7.requestException);
}
if(_1e1){
_1e1(_1e6);
}
};
var _1e8=function(_1e9,_1ea){
util.HTTP.requestCount--;
util.HTTP.failureState=true;
if(!_1e2){
return;
}
_1e4.splice(0,0,{requestURL:url,requestBody:_1e0,requestCallback:_1e1,requestFailure:_1e2,requestException:_1e3});
_1e2(_1e9,_1ea);
};
var _1eb=function(_1ec,_1ed){
util.HTTP.requestCount--;
util.HTTP.failureState=true;
console.error("Request exception! "+_1ed);
if(!_1e3){
return;
}
_1e4.splice(0,0,{requestURL:url,requestBody:_1e0,requestCallback:_1e1,requestFailure:_1e2,requestException:_1e3});
_1e3(_1ec,_1ed);
};
this.requestCount++;
var _1ee;
var _1ef;
if(typeof url=="string"){
_1ee=url;
_1ef="post";
}
return new Ajax.Request(_1ee,{method:"post",postBody:_1e0,onSuccess:_1e5,onException:_1eb,onFailure:_1e8});
},reset:function(){
this.failureState=false;
this.pendingRequests=new Array();
}},Integer:{randomInt:function(_1f0,_1f1,_1f2){
_1f0=Math.floor(_1f0);
_1f1=Math.floor(_1f1);
return (Math.floor(_1f0+((_1f1-_1f0+1)*Math.random((_1f2!=null)?_1f2:0))));
}},StringUtil:{randomString:function(len){
var _1f4="";
var _1f5=0;
var _1f6="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
for(var intI=0;intI<len;intI++){
_1f5=util.Integer.randomInt(0,(_1f6.length-1),intI);
_1f4+=_1f6.charAt(_1f5);
}
return _1f4;
}}};
var XMPP={};
XMPP.Packet=function(){
};
XMPP.Packet.packetID=1;
XMPP.Packet.prototype={idBase:util.StringUtil.randomString(5),_init:function(_1f8,from,to,_1fb){
this.doc=Sarissa.getDomDocument();
var _1fc=!_1fb;
if(!_1fb){
_1fb=this.doc.createElement(_1f8);
}else{
if(!_SARISSA_IS_IE){
_1fb=this.doc.importNode(_1fb,true);
}
}
this.doc.appendChild(_1fb);
this.rootNode=this.doc.firstChild;
if(_1fc){
this.addAttributes({id:this._nextPacketID()});
this.setFrom(from);
this.setTo(to);
}
},getPacketType:function(){
return this.rootNode.tagName;
},getID:function(){
return this.rootNode.getAttribute("id");
},setID:function(id){
this.rootNode.setAttribute("id",id);
},_nextPacketID:function(){
return this.idBase+"-"+XMPP.Packet.packetID++;
},removeAttributes:function(_1fe){
for(var i=0;i<_1fe.length;i++){
this.rootNode.removeAttribute(_1fe[i]);
}
},addAttributes:function(_200){
for(var attr in _200){
this.rootNode.setAttribute(attr,_200[attr]);
}
},setFrom:function(_202){
if(!_202||_202==""){
this.removeAttributes($A("from"));
}else{
this.addAttributes({from:_202});
}
},getFrom:function(){
if(this.from){
return this.from;
}
var from=this.rootNode.getAttribute("from");
if(!from){
this.from=null;
}else{
this.from=new XMPP.JID(from);
}
return this.from;
},setTo:function(_204){
this.to=null;
if(!_204||_204==""){
this.removeAttributes($A("to"));
}else{
this.addAttributes({to:_204});
}
},getTo:function(){
if(this.to){
return this.to;
}
var to=this.rootNode.getAttribute("to");
if(!to){
this.to=null;
}else{
this.to=new XMPP.JID(to);
}
return this.to;
},setXMLNS:function(_206){
if(!_206||_206==""){
this.removeAttributes($A("xmlns"));
}else{
this.addAttributes({xmlns:_206});
}
},toXML:function(){
var xml=this.doc.xml?this.doc.xml:(new XMLSerializer()).serializeToString(this.doc);
if(xml.indexOf("<?xml version=\"1.0\"?>")>=0){
xml=xml.substr("<?xml version=\"1.0\"?>".length);
}
return xml;
},addExtension:function(_208,_209){
if(_209&&this.doc.createElementNS){
this.extension=this.rootNode.appendChild(this.doc.createElementNS(_209,_208));
}else{
this.extension=this.rootNode.appendChild(this.doc.createElement(_208));
}
if(_209){
this.extension.setAttribute("xmlns",_209);
}
return this.extension;
},addTextExtension:function(_20a,_20b){
var _20c=this.addExtension(_20a);
_20c.appendChild(this.doc.createTextNode(_20b));
},getExtension:function(_20d,_20e){
var _20f=this.getExtensions(_20d,_20e);
if(!_20f||_20f.length<=0){
return null;
}else{
return _20f[0];
}
},getExtensions:function(_210,_211){
if(!_210){
_210="*";
}
var _212=this.rootNode.getElementsByTagName(_210);
if(_212.length<=0){
return new Array();
}
var _213=function(node){
if(!_211||node.getAttribute("xmlns")==_211){
return node;
}else{
return null;
}
};
return $A(_212).collect(_213).toArray().compact();
},removeExtension:function(_215){
var _216=this.rootNode.childNodes;
for(var i=0;i<_216.length;i++){
if(_216[i].tagName==_215){
return this.rootNode.removeChild(_216[i]);
}
}
},getError:function(){
var _218=this.getExtension("error");
if(_218==null){
return null;
}else{
return _218.getAttribute("code");
}
}};
XMPP.IQ=function(_219,from,to,_21c,init){
if(init){
return;
}
this._init("iq",from,to,_21c);
if(!_21c){
this.setType(_219);
}
};
XMPP.IQ.prototype=Object.extend(new XMPP.Packet(),{setType:function(_21e){
if(!_21e||_21e==""){
_21e="get";
}
this.addAttributes({type:_21e});
},getType:function(){
return this.rootNode.getAttribute("type");
},setQuery:function(_21f){
return this.addExtension("query",_21f);
},getQuery:function(){
return this.getExtension("query");
}});
XMPP.Registration=function(_220,to,_222){
this._init("iq",null,to,_222);
if(!_222){
this.setType(_220);
this.setQuery("jabber:iq:register");
}
};
XMPP.Registration.prototype=Object.extend(new XMPP.IQ(null,null,null,null,true),{getInstructions:function(){
var _223=this.getExtension("instructions");
if(!_223){
return null;
}else{
if(!_223.firstChild){
return "";
}
}
return _223.firstChild.nodeValue;
},setAttributes:function(map){
for(var attr in map){
this.addTextExtension(attr,map[attr]);
}
}});
XMPP.Presence=function(to,from,_228){
this._init("presence",from,to,_228);
};
XMPP.Presence.prototype=Object.extend(new XMPP.Packet(),{setType:function(_229){
if(!_229||_229==""||_229=="available"){
this.removeAttributes($A("type"));
}else{
this.addAttributes({type:_229});
}
},getType:function(){
var type=this.rootNode.getAttribute("type");
return (type?type:"available");
},setPriority:function(_22b){
if(!_22b||!(_22b instanceof Number)){
this.removeExtension("priority");
}else{
this.addTextExtension("priority",_22b);
}
},getPriority:function(){
var _22c=this.getExtension("priority");
if(_22c){
return _22c.firstChild.nodeValue;
}else{
return 0;
}
},setMode:function(mode){
if(!mode||mode==""||mode=="available"){
this.removeExtension("show");
}else{
this.addTextExtension("show",mode);
}
},getMode:function(){
var show=this.getExtension("show");
if(show){
return show.firstChild.nodeValue;
}else{
return null;
}
},setStatus:function(_22f){
if(!_22f||_22f==""){
this.removeExtension("status");
}else{
this.addTextExtension("status",_22f);
}
},getStatus:function(){
var _230=this.getExtension("status");
if(_230&&_230.firstChild){
return _230.firstChild.nodeValue.escapeHTML();
}else{
return null;
}
}});
XMPP.Message=function(_231,from,to,_234){
if(!_231&&!from&&!to&&!_234){
return;
}
this._init("message",from,to,_234);
if(!_234){
this.setType(_231);
}
};
XMPP.Message.prototype=Object.extend(new XMPP.Packet(),{setType:function(_235){
if(!_235||_235==""||_235=="normal"){
this.removeAttributes($A("type"));
}else{
this.addAttributes({type:_235});
}
},getType:function(){
var type=this.rootNode.getAttribute("type");
if(!type){
type="normal";
}
return type;
},setSubject:function(_237){
if(!_237||_237==""){
this.removeExtension("subject");
}else{
this.addTextExtension("subject",_237);
}
},getSubject:function(){
var _238=this.getExtension("subject");
if(!_238){
return null;
}else{
if(!_238.firstChild){
return "";
}
}
return _238.firstChild.nodeValue;
},setBody:function(body){
if(!body||body==""){
this.removeExtension("body");
}else{
this.addTextExtension("body",body);
}
},getBody:function(){
var body=this.getExtension("body");
if(!body){
return null;
}
return {body:body.firstChild.nodeValue.escapeHTML(),lang:body.getAttribute("lang")};
},getBodies:function(){
var _23b=this.getExtensions("body");
if(!body){
return null;
}
return _23b.collect(function(body){
return {body:body.firstChild.nodeValue.escapeHTML(),lang:body.getAttribute("lang")};
});
},setThread:function(_23d){
if(!_23d||_23d==""){
this.removeExtension("thread");
}else{
this.addTextExtension("thread",_23d);
}
},getThread:function(){
var _23e=this.getExtension("thread");
if(!_23e){
return null;
}
return _23e.firstChild.nodeValue;
}});
org.jive.spank.roster.Packet=function(_23f,from,to,_242){
this._init("iq",from,to,_242);
if(!_242){
this.setType(_23f);
this.setQuery("jabber:iq:roster");
}
};
org.jive.spank.roster.Packet.prototype=Object.extend(new XMPP.IQ(null,null,null,null,true),{getItems:function(){
var _243=new Array();
var _244=this.getExtension().childNodes;
for(var i=0;i<_244.length;i++){
if(_244[i].tagName!="item"){
continue;
}
var item=new org.jive.spank.roster.Item(_244[i].cloneNode(true));
_243.push(item);
}
return _243;
},addItem:function(jid,name){
var item=this.doc.createElement("item");
this.getExtension().appendChild(item);
item.setAttribute("jid",jid.toBareJID());
if(name){
item.setAttribute("name",name);
}
return new org.jive.spank.roster.Item(item);
}});
org.jive.spank.roster.Item=function(_24a){
this._element=_24a;
};
org.jive.spank.roster.Item.prototype={getJID:function(){
var attr=this._element.getAttribute("jid");
if(!attr){
return null;
}else{
return new XMPP.JID(attr);
}
},getName:function(){
return this._element.getAttribute("name");
},isSubscriptionPending:function(){
return this._element.getAttribute("ask");
},getSubscription:function(){
return this._element.getAttribute("subscription");
},setSubscription:function(_24c){
this._element.setAttribute("subscription",_24c);
},getGroups:function(){
var _24d=this._element.childNodes;
var _24e=new Array();
for(var i=0;i<_24d.length;i++){
if(_24d[i].tagName=="group"&&_24d[i].firstChild){
_24e.push(_24d[i].firstChild.nodeValue);
}
}
return _24e;
},addGroups:function(_250){
for(var i=0;i<_250.length;i++){
var _252=this._element.appendChild(this._element.ownerDocument.createElement("group"));
_252.appendChild(this._element.ownerDocument.createTextNode(_250[i]));
}
}};
org.jive.spank.muc.User=function(to,from,_255){
this._init("message",from,to,_255);
if(!_255){
this.addExtension("x","http://jabber.org/protocol/muc#user");
}
};
org.jive.spank.muc.User.prototype=Object.extend(new XMPP.Message(),{setInvite:function(jid,_257){
if(!jid||!(jid instanceof XMPP.JID)){
throw Error("Inivte must contain invitee, provide a JID");
}
var _258=this.doc.createElement("invite");
this.getExtension().appendChild(_258);
_258.setAttribute("to",jid.toString());
if(_257){
var _259=this.doc.createElement("reason");
_259.appendChild(this.doc.createTextNode(_257));
_258.appendChild(_259);
}
},getInvite:function(){
var ex=this.getExtension("x");
if(!ex){
return null;
}
var _25b=ex.childNodes;
var _25c;
for(var i=0;i<_25b.length;i++){
var node=_25b[i];
if(node.tagName=="invite"){
_25c=node;
break;
}
}
if(!_25c){
return null;
}
var _25f=_25c.firstChild;
if(_25f){
_25f=_25f.firstChild.nodeValue;
}else{
_25f=null;
}
var _260={};
_260["room"]=this.getFrom();
_260["from"]=_25c.getAttribute("from");
if(_25f){
_260["reason"]=_25f;
}
return _260;
},setDecline:function(jid,_262){
if(!jid||!(jid instanceof XMPP.JID)){
throw Error("Invite must contain invitee, provide a JID");
}
var _263=this.doc.createElement("decline");
this.getExtension().appendChild(_263);
_263.setAttribute("to",jid.toString());
if(_262){
var _264=this.doc.createElement("reason");
_264.appendChild(this.doc.createTextNode(_262));
_263.appendChild(_264);
}
},getDecline:function(){
var ex=this.getExtension("x");
if(!ex){
return null;
}
var _266=ex.childNodes;
var _267;
for(var i=0;i<_266.length;i++){
var node=_266[i];
if(node.tagName=="decline"){
_267=node;
break;
}
}
if(!_267){
return null;
}
var _26a=_267.firstChild;
if(_26a){
_26a=_26a.firstChild.nodeValue;
}else{
_26a=null;
}
var _26b={};
_26b.room=this.getFrom();
_26b.from=_267.getAttribute("from");
if(_26a){
_26b.reason=_26a;
}
return _26b;
}});
org.jive.spank.muc.Owner=function(_26c,to,from,_26f){
this._init("iq",from,to,_26f);
if(!_26f){
this.setQuery("http://jabber.org/protocol/muc#owner");
}
};
org.jive.spank.muc.Owner.prototype=Object.extend(new XMPP.IQ(null,null,null,null,true),{setDestroy:function(_270,jid){
var _272=this.doc.createElement("destroy");
this.getExtension().appendChild(_272);
if(jid){
_272.setAttribute("jid",jid.toString());
}
if(_270){
var _273=this.doc.createElement("reason");
_273.appendChild(this.doc.createTextNode(_270));
_272.appendChild(_273);
}
},getDestroy:function(){
var _274=this.getExtension().childNodes;
var _275;
for(var i=0;i<_274.length;i++){
if(_274[i].tagName=="destroy"){
_275=_274[i];
break;
}
}
if(_275){
var jid=_275.getAttribute("jid");
var _278;
if(_275.firstChild){
_278=_275.firstChild.firstChild.nodeValue;
}
return {jid:jid,reason:_278};
}else{
return null;
}
},addItem:function(_279,jid,nick,role,_27d,_27e){
var item=this.doc.createElement("item");
this.getExtension().appendChild(item);
if(_279){
item.setAttribute("affiliation",_279);
}
if(jid&&jid instanceof XMPP.JID){
item.setAttribute("jid",jid.toString());
}
if(nick){
item.setAttribute("nick",nick);
}
if(role){
item.setAttribute("role",role);
}
if(_27d){
var _280=this.doc.createElement("reason");
_280.appendChild(this.doc.createTextNode(_27d));
destroy.appendChild(_280);
}
if(_27e){
var _281=this.doc.createElement("actor");
_281.setAttribute("jid",_27e);
destroy.appendChild(_281);
}
}});
XMPP.JID=function(jid){
this.jid=jid.toLowerCase();
};
XMPP.JID.prototype={toString:function(){
return this.jid;
},toBareJID:function(){
if(!this.bareJID){
var i=this.jid.indexOf("/");
if(i<0){
this.bareJID=this.jid;
}else{
this.bareJID=this.jid.slice(0,i);
}
}
return this.bareJID;
},getBareJID:function(){
return new XMPP.JID(this.toBareJID());
},getResource:function(){
var i=this.jid.indexOf("/");
if(i<0){
return null;
}else{
return this.jid.slice(i+1);
}
},getNode:function(){
var i=this.jid.indexOf("@");
if(i<0){
return null;
}else{
return this.jid.slice(0,i);
}
},getDomain:function(){
var i=this.jid.indexOf("@");
var j=this.jid.indexOf("/");
if(i<0){
return null;
}else{
if(j<0){
return this.jid.slice(i+1);
}else{
return this.jid.slice(i+1,j);
}
}
}};
XMPP.PacketExtension=function(){
};
XMPP.PacketExtension.prototype={_init:function(_288,_289,_28a){
this.doc=Sarissa.getDomDocument();
var _28b=!_28a;
if(!_28a){
if(_289&&this.doc.createElementNS){
_28a=this.doc.createElementNS(_289,_288);
}else{
_28a=this.doc.createElement(_288);
}
if(_289){
_28a.setAttribute("xmlns",_289);
}
}else{
if(!_SARISSA_IS_IE){
_28a=this.doc.importNode(_28a,true);
}
}
this.doc.appendChild(_28a);
this.rootNode=this.doc.firstChild;
}};
XMPP.XData=function(type,_28d){
this._init("x","jabber:x:data",_28d);
if(type){
this.setType(type);
}
};
XMPP.XData.prototype=Object.extend(new XMPP.PacketExtension(),{getType:function(){
this.rootNode.getAttribute("type");
},setType:function(type){
if(!type){
type="form";
}
this.rootNode.setAttribute("type",type);
},getFields:function(){
var _28f=this.rootNode.childNodes;
var _290={};
for(var i=0;i<_28f.length;i++){
var _292=_28f[i];
if(_292.tagName!="field"||_292.getAttribute("type")=="hidden"){
continue;
}
var _293=_292.getAttribute("var");
var _294=_292.getAttribute("label");
var _295=new Array();
var _296=_292.childNodes;
for(var j=0;j<_296.length;j++){
if(_296[j].tagName!="value"||!_296[j].firstChild){
continue;
}
_295.push(_296[j].firstChild.nodeValue);
}
_290[_293]={fieldLabel:_294,values:_295};
}
return _290;
},getAnswerForm:function(){
var _298=new XMPP.XData("submit");
var _299=$A(this.rootNode.childNodes);
_299.each(function(_29a){
if(_29a.tagName!="field"||!_29a.getAttribute("var")){
return;
}
var _29b=_29a.getAttribute("type")=="hidden";
var _29c=_29a.cloneNode(_29b);
var node;
if(_298.doc.importNode){
node=_298.doc.importNode(_29c,true);
}else{
node=_29c;
}
_298.rootNode.appendChild(node);
});
return _298;
},setAnswer:function(_29e,_29f){
var _2a0=this.getField(_29e);
if(!_2a0){
return;
}
_29f.each(function(_2a1){
var _2a2=_2a0.appendChild(this.doc.createElement("value"));
_2a2.appendChild(this.doc.createTextNode(_2a1));
}.bind(this));
},getField:function(_2a3){
return $A(this.rootNode.childNodes).detect(function(_2a4){
return _2a4.getAttribute("var")==_2a3;
});
}});
XMPP.DelayInformation=function(_2a5){
this.element=_2a5;
};
XMPP.DelayInformation.prototype={getDate:function(){
var _2a6=this.element.getAttribute("stamp");
var date=new Date();
var _2a8=_2a6.split("T");
date.setUTCFullYear(_2a8[0].substr(0,4),_2a8[0].substr(4,2)-1,_2a8[0].substr(6,2));
var time=_2a8[1].split(":");
date.setUTCHours(time[0],time[1],time[2]);
return date;
}};
util.base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(_2aa){
var _2ab="";
var chr1,chr2,chr3,enc1,enc2,enc3,enc4;
var i=0;
_2aa=util.base64._utf8_encode(_2aa);
while(i<_2aa.length){
chr1=_2aa.charCodeAt(i++);
chr2=_2aa.charCodeAt(i++);
chr3=_2aa.charCodeAt(i++);
enc1=chr1>>2;
enc2=((chr1&3)<<4)|(chr2>>4);
enc3=((chr2&15)<<2)|(chr3>>6);
enc4=chr3&63;
if(isNaN(chr2)){
enc3=enc4=64;
}else{
if(isNaN(chr3)){
enc4=64;
}
}
_2ab=_2ab+this._keyStr.charAt(enc1)+this._keyStr.charAt(enc2)+this._keyStr.charAt(enc3)+this._keyStr.charAt(enc4);
}
return _2ab;
},decode:function(_2b4){
var _2b5="";
var chr1,chr2,chr3;
var enc1,enc2,enc3,enc4;
var i=0;
_2b4=_2b4.replace(/[^A-Za-z0-9\+\/\=]/g,"");
while(i<_2b4.length){
enc1=this._keyStr.indexOf(_2b4.charAt(i++));
enc2=this._keyStr.indexOf(_2b4.charAt(i++));
enc3=this._keyStr.indexOf(_2b4.charAt(i++));
enc4=this._keyStr.indexOf(_2b4.charAt(i++));
chr1=(enc1<<2)|(enc2>>4);
chr2=((enc2&15)<<4)|(enc3>>2);
chr3=((enc3&3)<<6)|enc4;
_2b5=_2b5+String.fromCharCode(chr1);
if(enc3!=64){
_2b5=_2b5+String.fromCharCode(chr2);
}
if(enc4!=64){
_2b5=_2b5+String.fromCharCode(chr3);
}
}
_2b5=util.base64._utf8_decode(_2b5);
return _2b5;
},_utf8_encode:function(_2be){
_2be=_2be.replace(/\r\n/g,"\n");
var _2bf="";
for(var n=0;n<_2be.length;n++){
var c=_2be.charCodeAt(n);
if(c<128){
_2bf+=String.fromCharCode(c);
}else{
if((c>127)&&(c<2048)){
_2bf+=String.fromCharCode((c>>6)|192);
_2bf+=String.fromCharCode((c&63)|128);
}else{
_2bf+=String.fromCharCode((c>>12)|224);
_2bf+=String.fromCharCode(((c>>6)&63)|128);
_2bf+=String.fromCharCode((c&63)|128);
}
}
}
return _2bf;
},_utf8_decode:function(_2c2){
var _2c3="";
var i=0;
var c,c1,c2=0;
while(i<_2c2.length){
c=_2c2.charCodeAt(i);
if(c<128){
_2c3+=String.fromCharCode(c);
i++;
}else{
if((c>191)&&(c<224)){
c2=_2c2.charCodeAt(i+1);
_2c3+=String.fromCharCode(((c&31)<<6)|(c2&63));
i+=2;
}else{
c2=_2c2.charCodeAt(i+1);
var c3=_2c2.charCodeAt(i+2);
_2c3+=String.fromCharCode(((c&15)<<12)|((c2&63)<<6)|(c3&63));
i+=3;
}
}
}
return _2c3;
}};
if(typeof Poly9=="undefined"){
var Poly9={};
}
Poly9.URLParser=function(url){
this._fields={"Username":4,"Password":5,"Port":7,"Protocol":2,"Host":6,"Pathname":8,"URL":0,"Querystring":9,"Fragment":10};
this._values={};
this._regex=null;
this.version=0.1;
this._regex=/^((\w+):\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/;
for(var f in this._fields){
this["get"+f]=this._makeGetter(f);
}
if(typeof url!="undefined"){
this._parse(url);
}
};
Poly9.URLParser.prototype.setURL=function(url){
this._parse(url);
};
Poly9.URLParser.prototype._initValues=function(){
for(var f in this._fields){
this._values[f]="";
}
};
Poly9.URLParser.prototype._parse=function(url){
this._initValues();
var r=this._regex.exec(url);
if(!r){
throw "DPURLParser::_parse -> Invalid URL";
}
for(var f in this._fields){
if(typeof r[this._fields[f]]!="undefined"){
this._values[f]=r[this._fields[f]];
}
}
};
Poly9.URLParser.prototype._makeGetter=function(_2d0){
return function(){
return this._values[_2d0];
};
};
if(typeof console=="undefined"||!console.firebug){
var console=new Object;
console.trace=function(){
};
console.log=function(){
};
console.debug=function(_2d1){
if(typeof opera!="undefined"){
opera.postError(_2d1);
}
};
console.info=function(){
};
console.warn=function(){
};
console.error=function(_2d2){
if(typeof opera!="undefined"){
opera.postError(_2d2);
}
};
console.time=function(){
};
console.timeEnd=function(){
};
console.count=function(){
};
console.profile=function(){
};
console.profileEnd=function(){
};
}


(function(){
var Y=YAHOO.util,_2,_3,_4=0,_5={};
var ua=navigator.userAgent.toLowerCase(),_7=(ua.indexOf("opera")>-1),_8=(ua.indexOf("safari")>-1),_9=(!_7&&!_8&&ua.indexOf("gecko")>-1),_a=(!_7&&ua.indexOf("msie")>-1);
var _b={HYPHEN:/(-[a-z])/i};
var _c=function(_d){
if(!_b.HYPHEN.test(_d)){
return _d;
}
if(_5[_d]){
return _5[_d];
}
while(_b.HYPHEN.exec(_d)){
_d=_d.replace(RegExp.$1,RegExp.$1.substr(1).toUpperCase());
}
_5[_d]=_d;
return _d;
};
if(document.defaultView&&document.defaultView.getComputedStyle){
_2=function(el,_f){
var _10=null;
var _11=document.defaultView.getComputedStyle(el,"");
if(_11){
_10=_11[_c(_f)];
}
return el.style[_f]||_10;
};
}else{
if(document.documentElement.currentStyle&&_a){
_2=function(el,_13){
switch(_c(_13)){
case "opacity":
var val=100;
try{
val=el.filters["DXImageTransform.Microsoft.Alpha"].opacity;
}
catch(e){
try{
val=el.filters("alpha").opacity;
}
catch(e){
}
}
return val/100;
break;
default:
var _15=el.currentStyle?el.currentStyle[_13]:null;
return (el.style[_13]||_15);
}
};
}else{
_2=function(el,_17){
return el.style[_17];
};
}
}
if(_a){
_3=function(el,_19,val){
switch(_19){
case "opacity":
if(typeof el.style.filter=="string"){
el.style.filter="alpha(opacity="+val*100+")";
if(!el.currentStyle||!el.currentStyle.hasLayout){
el.style.zoom=1;
}
}
break;
default:
el.style[_19]=val;
}
};
}else{
_3=function(el,_1c,val){
el.style[_1c]=val;
};
}
YAHOO.util.Dom={get:function(el){
if(!el){
return null;
}
if(typeof el!="string"&&!(el instanceof Array)){
return el;
}
if(typeof el=="string"){
return document.getElementById(el);
}else{
var _1f=[];
for(var i=0,len=el.length;i<len;++i){
_1f[_1f.length]=Y.Dom.get(el[i]);
}
return _1f;
}
return null;
},getStyle:function(el,_23){
_23=_c(_23);
var f=function(_25){
return _2(_25,_23);
};
return Y.Dom.batch(el,f,Y.Dom,true);
},setStyle:function(el,_27,val){
_27=_c(_27);
var f=function(_2a){
_3(_2a,_27,val);
};
Y.Dom.batch(el,f,Y.Dom,true);
},getXY:function(el){
var f=function(el){
if(el.parentNode===null||el.offsetParent===null||this.getStyle(el,"display")=="none"){
return false;
}
var _2e=null;
var pos=[];
var box;
if(el.getBoundingClientRect){
box=el.getBoundingClientRect();
var doc=document;
if(!this.inDocument(el)&&parent.document!=document){
doc=parent.document;
if(!this.isAncestor(doc.documentElement,el)){
return false;
}
}
var _32=Math.max(doc.documentElement.scrollTop,doc.body.scrollTop);
var _33=Math.max(doc.documentElement.scrollLeft,doc.body.scrollLeft);
return [box.left+_33,box.top+_32];
}else{
pos=[el.offsetLeft,el.offsetTop];
_2e=el.offsetParent;
if(_2e!=el){
while(_2e){
pos[0]+=_2e.offsetLeft;
pos[1]+=_2e.offsetTop;
_2e=_2e.offsetParent;
}
}
if(_8&&this.getStyle(el,"position")=="absolute"){
pos[0]-=document.body.offsetLeft;
pos[1]-=document.body.offsetTop;
}
}
if(el.parentNode){
_2e=el.parentNode;
}else{
_2e=null;
}
while(_2e&&_2e.tagName.toUpperCase()!="BODY"&&_2e.tagName.toUpperCase()!="HTML"){
if(Y.Dom.getStyle(_2e,"display")!="inline"){
pos[0]-=_2e.scrollLeft;
pos[1]-=_2e.scrollTop;
}
if(_2e.parentNode){
_2e=_2e.parentNode;
}else{
_2e=null;
}
}
return pos;
};
return Y.Dom.batch(el,f,Y.Dom,true);
},getX:function(el){
var f=function(el){
return Y.Dom.getXY(el)[0];
};
return Y.Dom.batch(el,f,Y.Dom,true);
},getY:function(el){
var f=function(el){
return Y.Dom.getXY(el)[1];
};
return Y.Dom.batch(el,f,Y.Dom,true);
},setXY:function(el,pos,_3c){
var f=function(el){
var _3f=this.getStyle(el,"position");
if(_3f=="static"){
this.setStyle(el,"position","relative");
_3f="relative";
}
var _40=this.getXY(el);
if(_40===false){
return false;
}
var _41=[parseInt(this.getStyle(el,"left"),10),parseInt(this.getStyle(el,"top"),10)];
if(isNaN(_41[0])){
_41[0]=(_3f=="relative")?0:el.offsetLeft;
}
if(isNaN(_41[1])){
_41[1]=(_3f=="relative")?0:el.offsetTop;
}
if(pos[0]!==null){
el.style.left=pos[0]-_40[0]+_41[0]+"px";
}
if(pos[1]!==null){
el.style.top=pos[1]-_40[1]+_41[1]+"px";
}
if(!_3c){
var _42=this.getXY(el);
if((pos[0]!==null&&_42[0]!=pos[0])||(pos[1]!==null&&_42[1]!=pos[1])){
this.setXY(el,pos,true);
}
}
};
Y.Dom.batch(el,f,Y.Dom,true);
},setX:function(el,x){
Y.Dom.setXY(el,[x,null]);
},setY:function(el,y){
Y.Dom.setXY(el,[null,y]);
},getRegion:function(el){
var f=function(el){
var _4a=new Y.Region.getRegion(el);
return _4a;
};
return Y.Dom.batch(el,f,Y.Dom,true);
},getClientWidth:function(){
return Y.Dom.getViewportWidth();
},getClientHeight:function(){
return Y.Dom.getViewportHeight();
},getElementsByClassName:function(_4b,tag,_4d){
var _4e=function(el){
return Y.Dom.hasClass(el,_4b);
};
return Y.Dom.getElementsBy(_4e,tag,_4d);
},hasClass:function(el,_51){
var re=new RegExp("(?:^|\\s+)"+_51+"(?:\\s+|$)");
var f=function(el){
return re.test(el["className"]);
};
return Y.Dom.batch(el,f,Y.Dom,true);
},addClass:function(el,_56){
var f=function(el){
if(this.hasClass(el,_56)){
return;
}
el["className"]=[el["className"],_56].join(" ");
};
Y.Dom.batch(el,f,Y.Dom,true);
},removeClass:function(el,_5a){
var re=new RegExp("(?:^|\\s+)"+_5a+"(?:\\s+|$)","g");
var f=function(el){
if(!this.hasClass(el,_5a)){
return;
}
var c=el["className"];
el["className"]=c.replace(re," ");
if(this.hasClass(el,_5a)){
this.removeClass(el,_5a);
}
};
Y.Dom.batch(el,f,Y.Dom,true);
},replaceClass:function(el,_60,_61){
if(_60===_61){
return false;
}
var re=new RegExp("(?:^|\\s+)"+_60+"(?:\\s+|$)","g");
var f=function(el){
if(!this.hasClass(el,_60)){
this.addClass(el,_61);
return;
}
el["className"]=el["className"].replace(re," "+_61+" ");
if(this.hasClass(el,_60)){
this.replaceClass(el,_60,_61);
}
};
Y.Dom.batch(el,f,Y.Dom,true);
},generateId:function(el,_66){
_66=_66||"yui-gen";
el=el||{};
var f=function(el){
if(el){
el=Y.Dom.get(el);
}else{
el={};
}
if(!el.id){
el.id=_66+_4++;
}
return el.id;
};
return Y.Dom.batch(el,f,Y.Dom,true);
},isAncestor:function(_69,_6a){
_69=Y.Dom.get(_69);
if(!_69||!_6a){
return false;
}
var f=function(_6c){
if(_69.contains&&!_8){
return _69.contains(_6c);
}else{
if(_69.compareDocumentPosition){
return !!(_69.compareDocumentPosition(_6c)&16);
}else{
var _6d=_6c.parentNode;
while(_6d){
if(_6d==_69){
return true;
}else{
if(!_6d.tagName||_6d.tagName.toUpperCase()=="HTML"){
return false;
}
}
_6d=_6d.parentNode;
}
return false;
}
}
};
return Y.Dom.batch(_6a,f,Y.Dom,true);
},inDocument:function(el){
var f=function(el){
return this.isAncestor(document.documentElement,el);
};
return Y.Dom.batch(el,f,Y.Dom,true);
},getElementsBy:function(_71,tag,_73){
tag=tag||"*";
var _74=[];
if(_73){
_73=Y.Dom.get(_73);
if(!_73){
return _74;
}
}else{
_73=document;
}
var _75=_73.getElementsByTagName(tag);
if(!_75.length&&(tag=="*"&&_73.all)){
_75=_73.all;
}
for(var i=0,len=_75.length;i<len;++i){
if(_71(_75[i])){
_74[_74.length]=_75[i];
}
}
return _74;
},batch:function(el,_79,o,_7b){
var id=el;
el=Y.Dom.get(el);
var _7d=(_7b)?o:window;
if(!el||el.tagName||!el.length){
if(!el){
return false;
}
return _79.call(_7d,el,o);
}
var _7e=[];
for(var i=0,len=el.length;i<len;++i){
if(!el[i]){
id=el[i];
}
_7e[_7e.length]=_79.call(_7d,el[i],o);
}
return _7e;
},getDocumentHeight:function(){
var _81=(document.compatMode!="CSS1Compat")?document.body.scrollHeight:document.documentElement.scrollHeight;
var h=Math.max(_81,Y.Dom.getViewportHeight());
return h;
},getDocumentWidth:function(){
var _83=(document.compatMode!="CSS1Compat")?document.body.scrollWidth:document.documentElement.scrollWidth;
var w=Math.max(_83,Y.Dom.getViewportWidth());
return w;
},getViewportHeight:function(){
var _85=self.innerHeight;
var _86=document.compatMode;
if((_86||_a)&&!_7){
_85=(_86=="CSS1Compat")?document.documentElement.clientHeight:document.body.clientHeight;
}
return _85;
},getViewportWidth:function(){
var _87=self.innerWidth;
var _88=document.compatMode;
if(_88||_a){
_87=(_88=="CSS1Compat")?document.documentElement.clientWidth:document.body.clientWidth;
}
return _87;
}};
})();
YAHOO.util.Region=function(t,r,b,l){
this.top=t;
this[1]=t;
this.right=r;
this.bottom=b;
this.left=l;
this[0]=l;
};
YAHOO.util.Region.prototype.contains=function(_8d){
return (_8d.left>=this.left&&_8d.right<=this.right&&_8d.top>=this.top&&_8d.bottom<=this.bottom);
};
YAHOO.util.Region.prototype.getArea=function(){
return ((this.bottom-this.top)*(this.right-this.left));
};
YAHOO.util.Region.prototype.intersect=function(_8e){
var t=Math.max(this.top,_8e.top);
var r=Math.min(this.right,_8e.right);
var b=Math.min(this.bottom,_8e.bottom);
var l=Math.max(this.left,_8e.left);
if(b>=t&&r>=l){
return new YAHOO.util.Region(t,r,b,l);
}else{
return null;
}
};
YAHOO.util.Region.prototype.union=function(_93){
var t=Math.min(this.top,_93.top);
var r=Math.max(this.right,_93.right);
var b=Math.max(this.bottom,_93.bottom);
var l=Math.min(this.left,_93.left);
return new YAHOO.util.Region(t,r,b,l);
};
YAHOO.util.Region.prototype.toString=function(){
return ("Region {"+"top: "+this.top+", right: "+this.right+", bottom: "+this.bottom+", left: "+this.left+"}");
};
YAHOO.util.Region.getRegion=function(el){
var p=YAHOO.util.Dom.getXY(el);
var t=p[1];
var r=p[0]+el.offsetWidth;
var b=p[1]+el.offsetHeight;
var l=p[0];
return new YAHOO.util.Region(t,r,b,l);
};
YAHOO.util.Point=function(x,y){
if(x instanceof Array){
y=x[1];
x=x[0];
}
this.x=this.right=this.left=this[0]=x;
this.y=this.top=this.bottom=this[1]=y;
};
YAHOO.util.Point.prototype=new YAHOO.util.Region();
YAHOO.register("dom",YAHOO.util.Dom,{version:"2.2.0",build:"127"});


if(!YAHOO.util.Event){
YAHOO.util.Event=function(){
var _1=false;
var _2=[];
var _3=[];
var _4=[];
var _5=[];
var _6=0;
var _7=[];
var _8=[];
var _9=0;
var _a=null;
return {POLL_RETRYS:200,POLL_INTERVAL:20,EL:0,TYPE:1,FN:2,WFN:3,OBJ:3,ADJ_SCOPE:4,isSafari:(/KHTML/gi).test(navigator.userAgent),webkit:function(){
var v=navigator.userAgent.match(/AppleWebKit\/([^ ]*)/);
if(v&&v[1]){
return v[1];
}
return null;
}(),isIE:(!this.webkit&&!navigator.userAgent.match(/opera/gi)&&navigator.userAgent.match(/msie/gi)),_interval:null,startInterval:function(){
if(!this._interval){
var _c=this;
var _d=function(){
_c._tryPreloadAttach();
};
this._interval=setInterval(_d,this.POLL_INTERVAL);
}
},onAvailable:function(_e,_f,_10,_11){
_7.push({id:_e,fn:_f,obj:_10,override:_11,checkReady:false});
_6=this.POLL_RETRYS;
this.startInterval();
},onContentReady:function(_12,_13,_14,_15){
_7.push({id:_12,fn:_13,obj:_14,override:_15,checkReady:true});
_6=this.POLL_RETRYS;
this.startInterval();
},addListener:function(el,_17,fn,obj,_1a){
if(!fn||!fn.call){
return false;
}
if(this._isValidCollection(el)){
var ok=true;
for(var i=0,len=el.length;i<len;++i){
ok=this.on(el[i],_17,fn,obj,_1a)&&ok;
}
return ok;
}else{
if(typeof el=="string"){
var oEl=this.getEl(el);
if(oEl){
el=oEl;
}else{
this.onAvailable(el,function(){
YAHOO.util.Event.on(el,_17,fn,obj,_1a);
});
return true;
}
}
}
if(!el){
return false;
}
if("unload"==_17&&obj!==this){
_3[_3.length]=[el,_17,fn,obj,_1a];
return true;
}
var _1f=el;
if(_1a){
if(_1a===true){
_1f=obj;
}else{
_1f=_1a;
}
}
var _20=function(e){
return fn.call(_1f,YAHOO.util.Event.getEvent(e),obj);
};
var li=[el,_17,fn,_20,_1f];
var _23=_2.length;
_2[_23]=li;
if(this.useLegacyEvent(el,_17)){
var _24=this.getLegacyIndex(el,_17);
if(_24==-1||el!=_4[_24][0]){
_24=_4.length;
_8[el.id+_17]=_24;
_4[_24]=[el,_17,el["on"+_17]];
_5[_24]=[];
el["on"+_17]=function(e){
YAHOO.util.Event.fireLegacyEvent(YAHOO.util.Event.getEvent(e),_24);
};
}
_5[_24].push(li);
}else{
try{
this._simpleAdd(el,_17,_20,false);
}
catch(ex){
this.lastError=ex;
this.removeListener(el,_17,fn);
return false;
}
}
return true;
},fireLegacyEvent:function(e,_27){
var ok=true,le,lh,li,_2c,ret;
lh=_5[_27];
for(var i=0,len=lh.length;i<len;++i){
li=lh[i];
if(li&&li[this.WFN]){
_2c=li[this.ADJ_SCOPE];
ret=li[this.WFN].call(_2c,e);
ok=(ok&&ret);
}
}
le=_4[_27];
if(le&&le[2]){
le[2](e);
}
return ok;
},getLegacyIndex:function(el,_31){
var key=this.generateId(el)+_31;
if(typeof _8[key]=="undefined"){
return -1;
}else{
return _8[key];
}
},useLegacyEvent:function(el,_34){
if(this.webkit&&("click"==_34||"dblclick"==_34)){
var v=parseInt(this.webkit,10);
if(!isNaN(v)&&v<418){
return true;
}
}
return false;
},removeListener:function(el,_37,fn){
var i,len;
if(typeof el=="string"){
el=this.getEl(el);
}else{
if(this._isValidCollection(el)){
var ok=true;
for(i=0,len=el.length;i<len;++i){
ok=(this.removeListener(el[i],_37,fn)&&ok);
}
return ok;
}
}
if(!fn||!fn.call){
return this.purgeElement(el,false,_37);
}
if("unload"==_37){
for(i=0,len=_3.length;i<len;i++){
var li=_3[i];
if(li&&li[0]==el&&li[1]==_37&&li[2]==fn){
_3.splice(i,1);
return true;
}
}
return false;
}
var _3d=null;
var _3e=arguments[3];
if("undefined"==typeof _3e){
_3e=this._getCacheIndex(el,_37,fn);
}
if(_3e>=0){
_3d=_2[_3e];
}
if(!el||!_3d){
return false;
}
if(this.useLegacyEvent(el,_37)){
var _3f=this.getLegacyIndex(el,_37);
var _40=_5[_3f];
if(_40){
for(i=0,len=_40.length;i<len;++i){
li=_40[i];
if(li&&li[this.EL]==el&&li[this.TYPE]==_37&&li[this.FN]==fn){
_40.splice(i,1);
break;
}
}
}
}else{
try{
this._simpleRemove(el,_37,_3d[this.WFN],false);
}
catch(ex){
this.lastError=ex;
return false;
}
}
delete _2[_3e][this.WFN];
delete _2[_3e][this.FN];
_2.splice(_3e,1);
return true;
},getTarget:function(ev,_42){
var t=ev.target||ev.srcElement;
return this.resolveTextNode(t);
},resolveTextNode:function(_44){
if(_44&&3==_44.nodeType){
return _44.parentNode;
}else{
return _44;
}
},getPageX:function(ev){
var x=ev.pageX;
if(!x&&0!==x){
x=ev.clientX||0;
if(this.isIE){
x+=this._getScrollLeft();
}
}
return x;
},getPageY:function(ev){
var y=ev.pageY;
if(!y&&0!==y){
y=ev.clientY||0;
if(this.isIE){
y+=this._getScrollTop();
}
}
return y;
},getXY:function(ev){
return [this.getPageX(ev),this.getPageY(ev)];
},getRelatedTarget:function(ev){
var t=ev.relatedTarget;
if(!t){
if(ev.type=="mouseout"){
t=ev.toElement;
}else{
if(ev.type=="mouseover"){
t=ev.fromElement;
}
}
}
return this.resolveTextNode(t);
},getTime:function(ev){
if(!ev.time){
var t=new Date().getTime();
try{
ev.time=t;
}
catch(ex){
this.lastError=ex;
return t;
}
}
return ev.time;
},stopEvent:function(ev){
this.stopPropagation(ev);
this.preventDefault(ev);
},stopPropagation:function(ev){
if(ev.stopPropagation){
ev.stopPropagation();
}else{
ev.cancelBubble=true;
}
},preventDefault:function(ev){
if(ev.preventDefault){
ev.preventDefault();
}else{
ev.returnValue=false;
}
},getEvent:function(e){
var ev=e||window.event;
if(!ev){
var c=this.getEvent.caller;
while(c){
ev=c.arguments[0];
if(ev&&Event==ev.constructor){
break;
}
c=c.caller;
}
}
return ev;
},getCharCode:function(ev){
return ev.charCode||ev.keyCode||0;
},_getCacheIndex:function(el,_56,fn){
for(var i=0,len=_2.length;i<len;++i){
var li=_2[i];
if(li&&li[this.FN]==fn&&li[this.EL]==el&&li[this.TYPE]==_56){
return i;
}
}
return -1;
},generateId:function(el){
var id=el.id;
if(!id){
id="yuievtautoid-"+_9;
++_9;
el.id=id;
}
return id;
},_isValidCollection:function(o){
return (o&&o.length&&typeof o!="string"&&!o.tagName&&!o.alert&&typeof o[0]!="undefined");
},elCache:{},getEl:function(id){
return document.getElementById(id);
},clearCache:function(){
},_load:function(e){
_1=true;
var EU=YAHOO.util.Event;
if(this.isIE){
EU._simpleRemove(window,"load",EU._load);
}
},_tryPreloadAttach:function(){
if(this.locked){
return false;
}
this.locked=true;
var _61=!_1;
if(!_61){
_61=(_6>0);
}
var _62=[];
for(var i=0,len=_7.length;i<len;++i){
var _65=_7[i];
if(_65){
var el=this.getEl(_65.id);
if(el){
if(!_65.checkReady||_1||el.nextSibling||(document&&document.body)){
var _67=el;
if(_65.override){
if(_65.override===true){
_67=_65.obj;
}else{
_67=_65.override;
}
}
_65.fn.call(_67,_65.obj);
_7[i]=null;
}
}else{
_62.push(_65);
}
}
}
_6=(_62.length===0)?0:_6-1;
if(_61){
this.startInterval();
}else{
clearInterval(this._interval);
this._interval=null;
}
this.locked=false;
return true;
},purgeElement:function(el,_69,_6a){
var _6b=this.getListeners(el,_6a);
if(_6b){
for(var i=0,len=_6b.length;i<len;++i){
var l=_6b[i];
this.removeListener(el,l.type,l.fn);
}
}
if(_69&&el&&el.childNodes){
for(i=0,len=el.childNodes.length;i<len;++i){
this.purgeElement(el.childNodes[i],_69,_6a);
}
}
},getListeners:function(el,_70){
var _71=[],_72;
if(!_70){
_72=[_2,_3];
}else{
if(_70=="unload"){
_72=[_3];
}else{
_72=[_2];
}
}
for(var j=0;j<_72.length;++j){
var _74=_72[j];
if(_74&&_74.length>0){
for(var i=0,len=_74.length;i<len;++i){
var l=_74[i];
if(l&&l[this.EL]===el&&(!_70||_70===l[this.TYPE])){
_71.push({type:l[this.TYPE],fn:l[this.FN],obj:l[this.OBJ],adjust:l[this.ADJ_SCOPE],index:i});
}
}
}
}
return (_71.length)?_71:null;
},_unload:function(e){
var EU=YAHOO.util.Event,i,j,l,len,_7e;
for(i=0,len=_3.length;i<len;++i){
l=_3[i];
if(l){
var _7f=window;
if(l[EU.ADJ_SCOPE]){
if(l[EU.ADJ_SCOPE]===true){
_7f=l[EU.OBJ];
}else{
_7f=l[EU.ADJ_SCOPE];
}
}
l[EU.FN].call(_7f,EU.getEvent(e),l[EU.OBJ]);
_3[i]=null;
l=null;
_7f=null;
}
}
_3=null;
if(_2&&_2.length>0){
j=_2.length;
while(j){
_7e=j-1;
l=_2[_7e];
if(l){
EU.removeListener(l[EU.EL],l[EU.TYPE],l[EU.FN],_7e);
}
j=j-1;
}
l=null;
EU.clearCache();
}
for(i=0,len=_4.length;i<len;++i){
_4[i][0]=null;
_4[i]=null;
}
_4=null;
EU._simpleRemove(window,"unload",EU._unload);
},_getScrollLeft:function(){
return this._getScroll()[1];
},_getScrollTop:function(){
return this._getScroll()[0];
},_getScroll:function(){
var dd=document.documentElement,db=document.body;
if(dd&&(dd.scrollTop||dd.scrollLeft)){
return [dd.scrollTop,dd.scrollLeft];
}else{
if(db){
return [db.scrollTop,db.scrollLeft];
}else{
return [0,0];
}
}
},regCE:function(){
},_simpleAdd:function(){
if(window.addEventListener){
return function(el,_83,fn,_85){
el.addEventListener(_83,fn,(_85));
};
}else{
if(window.attachEvent){
return function(el,_87,fn,_89){
el.attachEvent("on"+_87,fn);
};
}else{
return function(){
};
}
}
}(),_simpleRemove:function(){
if(window.removeEventListener){
return function(el,_8b,fn,_8d){
el.removeEventListener(_8b,fn,(_8d));
};
}else{
if(window.detachEvent){
return function(el,_8f,fn){
el.detachEvent("on"+_8f,fn);
};
}else{
return function(){
};
}
}
}()};
}();
(function(){
var EU=YAHOO.util.Event;
EU.on=EU.addListener;
if(document&&document.body){
EU._load();
}else{
EU._simpleAdd(window,"load",EU._load);
}
EU._simpleAdd(window,"unload",EU._unload);
EU._tryPreloadAttach();
})();
}
YAHOO.util.CustomEvent=function(_92,_93,_94,_95){
this.type=_92;
this.scope=_93||window;
this.silent=_94;
this.signature=_95||YAHOO.util.CustomEvent.LIST;
this.subscribers=[];
if(!this.silent){
}
var _96="_YUICEOnSubscribe";
if(_92!==_96){
this.subscribeEvent=new YAHOO.util.CustomEvent(_96,this,true);
}
};
YAHOO.util.CustomEvent.LIST=0;
YAHOO.util.CustomEvent.FLAT=1;
YAHOO.util.CustomEvent.prototype={subscribe:function(fn,obj,_99){
if(this.subscribeEvent){
this.subscribeEvent.fire(fn,obj,_99);
}
this.subscribers.push(new YAHOO.util.Subscriber(fn,obj,_99));
},unsubscribe:function(fn,obj){
if(!fn){
return this.unsubscribeAll();
}
var _9c=false;
for(var i=0,len=this.subscribers.length;i<len;++i){
var s=this.subscribers[i];
if(s&&s.contains(fn,obj)){
this._delete(i);
_9c=true;
}
}
return _9c;
},fire:function(){
var len=this.subscribers.length;
if(!len&&this.silent){
return true;
}
var _a1=[],ret=true,i;
for(i=0;i<arguments.length;++i){
_a1.push(arguments[i]);
}
var _a4=_a1.length;
if(!this.silent){
}
for(i=0;i<len;++i){
var s=this.subscribers[i];
if(s){
if(!this.silent){
}
var _a6=s.getScope(this.scope);
if(this.signature==YAHOO.util.CustomEvent.FLAT){
var _a7=null;
if(_a1.length>0){
_a7=_a1[0];
}
ret=s.fn.call(_a6,_a7,s.obj);
}else{
ret=s.fn.call(_a6,this.type,_a1,s.obj);
}
if(false===ret){
if(!this.silent){
}
return false;
}
}
}
return true;
},unsubscribeAll:function(){
for(var i=0,len=this.subscribers.length;i<len;++i){
this._delete(len-1-i);
}
return i;
},_delete:function(_aa){
var s=this.subscribers[_aa];
if(s){
delete s.fn;
delete s.obj;
}
this.subscribers.splice(_aa,1);
},toString:function(){
return "CustomEvent: "+"'"+this.type+"', "+"scope: "+this.scope;
}};
YAHOO.util.Subscriber=function(fn,obj,_ae){
this.fn=fn;
this.obj=obj||null;
this.override=_ae;
};
YAHOO.util.Subscriber.prototype.getScope=function(_af){
if(this.override){
if(this.override===true){
return this.obj;
}else{
return this.override;
}
}
return _af;
};
YAHOO.util.Subscriber.prototype.contains=function(fn,obj){
if(obj){
return (this.fn==fn&&this.obj==obj);
}else{
return (this.fn==fn);
}
};
YAHOO.util.Subscriber.prototype.toString=function(){
return "Subscriber { obj: "+(this.obj||"")+", override: "+(this.override||"no")+" }";
};
YAHOO.util.EventProvider=function(){
};
YAHOO.util.EventProvider.prototype={__yui_events:null,__yui_subscribers:null,subscribe:function(_b2,_b3,_b4,_b5){
this.__yui_events=this.__yui_events||{};
var ce=this.__yui_events[_b2];
if(ce){
ce.subscribe(_b3,_b4,_b5);
}else{
this.__yui_subscribers=this.__yui_subscribers||{};
var _b7=this.__yui_subscribers;
if(!_b7[_b2]){
_b7[_b2]=[];
}
_b7[_b2].push({fn:_b3,obj:_b4,override:_b5});
}
},unsubscribe:function(_b8,_b9,_ba){
this.__yui_events=this.__yui_events||{};
var ce=this.__yui_events[_b8];
if(ce){
return ce.unsubscribe(_b9,_ba);
}else{
return false;
}
},unsubscribeAll:function(_bc){
return this.unsubscribe(_bc);
},createEvent:function(_bd,_be){
this.__yui_events=this.__yui_events||{};
var _bf=_be||{};
var _c0=this.__yui_events;
if(_c0[_bd]){
}else{
var _c1=_bf.scope||this;
var _c2=_bf.silent||null;
var ce=new YAHOO.util.CustomEvent(_bd,_c1,_c2,YAHOO.util.CustomEvent.FLAT);
_c0[_bd]=ce;
if(_bf.onSubscribeCallback){
ce.subscribeEvent.subscribe(_bf.onSubscribeCallback);
}
this.__yui_subscribers=this.__yui_subscribers||{};
var qs=this.__yui_subscribers[_bd];
if(qs){
for(var i=0;i<qs.length;++i){
ce.subscribe(qs[i].fn,qs[i].obj,qs[i].override);
}
}
}
return _c0[_bd];
},fireEvent:function(_c6,_c7,_c8,etc){
this.__yui_events=this.__yui_events||{};
var ce=this.__yui_events[_c6];
if(ce){
var _cb=[];
for(var i=1;i<arguments.length;++i){
_cb.push(arguments[i]);
}
return ce.fire.apply(ce,_cb);
}else{
return null;
}
},hasEvent:function(_cd){
if(this.__yui_events){
if(this.__yui_events[_cd]){
return true;
}
}
return false;
}};
YAHOO.util.KeyListener=function(_ce,_cf,_d0,_d1){
if(!_ce){
}else{
if(!_cf){
}else{
if(!_d0){
}
}
}
if(!_d1){
_d1=YAHOO.util.KeyListener.KEYDOWN;
}
var _d2=new YAHOO.util.CustomEvent("keyPressed");
this.enabledEvent=new YAHOO.util.CustomEvent("enabled");
this.disabledEvent=new YAHOO.util.CustomEvent("disabled");
if(typeof _ce=="string"){
_ce=document.getElementById(_ce);
}
if(typeof _d0=="function"){
_d2.subscribe(_d0);
}else{
_d2.subscribe(_d0.fn,_d0.scope,_d0.correctScope);
}
function handleKeyPress(e,obj){
if(!_cf.shift){
_cf.shift=false;
}
if(!_cf.alt){
_cf.alt=false;
}
if(!_cf.ctrl){
_cf.ctrl=false;
}
if(e.shiftKey==_cf.shift&&e.altKey==_cf.alt&&e.ctrlKey==_cf.ctrl){
var _d5;
var _d6;
if(_cf.keys instanceof Array){
for(var i=0;i<_cf.keys.length;i++){
_d5=_cf.keys[i];
if(_d5==e.charCode){
_d2.fire(e.charCode,e);
break;
}else{
if(_d5==e.keyCode){
_d2.fire(e.keyCode,e);
break;
}
}
}
}else{
_d5=_cf.keys;
if(_d5==e.charCode){
_d2.fire(e.charCode,e);
}else{
if(_d5==e.keyCode){
_d2.fire(e.keyCode,e);
}
}
}
}
}
this.enable=function(){
if(!this.enabled){
YAHOO.util.Event.addListener(_ce,_d1,handleKeyPress);
this.enabledEvent.fire(_cf);
}
this.enabled=true;
};
this.disable=function(){
if(this.enabled){
YAHOO.util.Event.removeListener(_ce,_d1,handleKeyPress);
this.disabledEvent.fire(_cf);
}
this.enabled=false;
};
this.toString=function(){
return "KeyListener ["+_cf.keys+"] "+_ce.tagName+(_ce.id?"["+_ce.id+"]":"");
};
};
YAHOO.util.KeyListener.KEYDOWN="keydown";
YAHOO.util.KeyListener.KEYUP="keyup";
YAHOO.register("event",YAHOO.util.Event,{version:"2.2.0",build:"127"});


YAHOO.util.Config=function(_1){
if(_1){
this.init(_1);
}
};
YAHOO.util.Config.prototype={owner:null,queueInProgress:false,checkBoolean:function(_2){
if(typeof _2=="boolean"){
return true;
}else{
return false;
}
},checkNumber:function(_3){
if(isNaN(_3)){
return false;
}else{
return true;
}
}};
YAHOO.util.Config.prototype.init=function(_4){
this.owner=_4;
this.configChangedEvent=new YAHOO.util.CustomEvent("configChanged");
this.queueInProgress=false;
var _5={};
var _6={};
var _7=[];
var _8=function(_9,_a){
_9=_9.toLowerCase();
var _b=_5[_9];
if(typeof _b!="undefined"&&_b.event){
_b.event.fire(_a);
}
};
this.addProperty=function(_c,_d){
_c=_c.toLowerCase();
_5[_c]=_d;
_d.event=new YAHOO.util.CustomEvent(_c);
_d.key=_c;
if(_d.handler){
_d.event.subscribe(_d.handler,this.owner,true);
}
this.setProperty(_c,_d.value,true);
if(!_d.suppressEvent){
this.queueProperty(_c,_d.value);
}
};
this.getConfig=function(){
var _e={};
for(var _f in _5){
var _10=_5[_f];
if(typeof _10!="undefined"&&_10.event){
_e[_f]=_10.value;
}
}
return _e;
};
this.getProperty=function(key){
key=key.toLowerCase();
var _12=_5[key];
if(typeof _12!="undefined"&&_12.event){
return _12.value;
}else{
return undefined;
}
};
this.resetProperty=function(key){
key=key.toLowerCase();
var _14=_5[key];
if(typeof _14!="undefined"&&_14.event){
if(_6[key]&&_6[key]!="undefined"){
this.setProperty(key,_6[key]);
}
return true;
}else{
return false;
}
};
this.setProperty=function(key,_16,_17){
key=key.toLowerCase();
if(this.queueInProgress&&!_17){
this.queueProperty(key,_16);
return true;
}else{
var _18=_5[key];
if(typeof _18!="undefined"&&_18.event){
if(_18.validator&&!_18.validator(_16)){
return false;
}else{
_18.value=_16;
if(!_17){
_8(key,_16);
this.configChangedEvent.fire([key,_16]);
}
return true;
}
}else{
return false;
}
}
};
this.queueProperty=function(key,_1a){
key=key.toLowerCase();
var _1b=_5[key];
if(typeof _1b!="undefined"&&_1b.event){
if(typeof _1a!="undefined"&&_1b.validator&&!_1b.validator(_1a)){
return false;
}else{
if(typeof _1a!="undefined"){
_1b.value=_1a;
}else{
_1a=_1b.value;
}
var _1c=false;
for(var i=0;i<_7.length;i++){
var _1e=_7[i];
if(_1e){
var _1f=_1e[0];
var _20=_1e[1];
if(_1f.toLowerCase()==key){
_7[i]=null;
_7.push([key,(typeof _1a!="undefined"?_1a:_20)]);
_1c=true;
break;
}
}
}
if(!_1c&&typeof _1a!="undefined"){
_7.push([key,_1a]);
}
}
if(_1b.supercedes){
for(var s=0;s<_1b.supercedes.length;s++){
var _22=_1b.supercedes[s];
for(var q=0;q<_7.length;q++){
var _24=_7[q];
if(_24){
var _25=_24[0];
var _26=_24[1];
if(_25.toLowerCase()==_22.toLowerCase()){
_7.push([_25,_26]);
_7[q]=null;
break;
}
}
}
}
}
return true;
}else{
return false;
}
};
this.refireEvent=function(key){
key=key.toLowerCase();
var _28=_5[key];
if(typeof _28!="undefined"&&_28.event&&typeof _28.value!="undefined"){
if(this.queueInProgress){
this.queueProperty(key);
}else{
_8(key,_28.value);
}
}
};
this.applyConfig=function(_29,_2a){
if(_2a){
_6=_29;
}
for(var _2b in _29){
this.queueProperty(_2b,_29[_2b]);
}
};
this.refresh=function(){
for(var _2c in _5){
this.refireEvent(_2c);
}
};
this.fireQueue=function(){
this.queueInProgress=true;
for(var i=0;i<_7.length;i++){
var _2e=_7[i];
if(_2e){
var key=_2e[0];
var _30=_2e[1];
var _31=_5[key];
_31.value=_30;
_8(key,_30);
}
}
this.queueInProgress=false;
_7=[];
};
this.subscribeToConfigEvent=function(key,_33,obj,_35){
key=key.toLowerCase();
var _36=_5[key];
if(typeof _36!="undefined"&&_36.event){
if(!YAHOO.util.Config.alreadySubscribed(_36.event,_33,obj)){
_36.event.subscribe(_33,obj,_35);
}
return true;
}else{
return false;
}
};
this.unsubscribeFromConfigEvent=function(key,_38,obj){
key=key.toLowerCase();
var _3a=_5[key];
if(typeof _3a!="undefined"&&_3a.event){
return _3a.event.unsubscribe(_38,obj);
}else{
return false;
}
};
this.toString=function(){
var _3b="Config";
if(this.owner){
_3b+=" ["+this.owner.toString()+"]";
}
return _3b;
};
this.outputEventQueue=function(){
var _3c="";
for(var q=0;q<_7.length;q++){
var _3e=_7[q];
if(_3e){
_3c+=_3e[0]+"="+_3e[1]+", ";
}
}
return _3c;
};
};
YAHOO.util.Config.alreadySubscribed=function(evt,fn,obj){
for(var e=0;e<evt.subscribers.length;e++){
var _43=evt.subscribers[e];
if(_43&&_43.obj==obj&&_43.fn==fn){
return true;
}
}
return false;
};
YAHOO.widget.Module=function(el,_45){
if(el){
this.init(el,_45);
}else{
}
};
YAHOO.widget.Module.IMG_ROOT=null;
YAHOO.widget.Module.IMG_ROOT_SSL=null;
YAHOO.widget.Module.CSS_MODULE="module";
YAHOO.widget.Module.CSS_HEADER="hd";
YAHOO.widget.Module.CSS_BODY="bd";
YAHOO.widget.Module.CSS_FOOTER="ft";
YAHOO.widget.Module.RESIZE_MONITOR_SECURE_URL="javascript:false;";
YAHOO.widget.Module.textResizeEvent=new YAHOO.util.CustomEvent("textResize");
YAHOO.widget.Module.prototype={constructor:YAHOO.widget.Module,element:null,header:null,body:null,footer:null,id:null,imageRoot:YAHOO.widget.Module.IMG_ROOT,initEvents:function(){
this.beforeInitEvent=new YAHOO.util.CustomEvent("beforeInit");
this.initEvent=new YAHOO.util.CustomEvent("init");
this.appendEvent=new YAHOO.util.CustomEvent("append");
this.beforeRenderEvent=new YAHOO.util.CustomEvent("beforeRender");
this.renderEvent=new YAHOO.util.CustomEvent("render");
this.changeHeaderEvent=new YAHOO.util.CustomEvent("changeHeader");
this.changeBodyEvent=new YAHOO.util.CustomEvent("changeBody");
this.changeFooterEvent=new YAHOO.util.CustomEvent("changeFooter");
this.changeContentEvent=new YAHOO.util.CustomEvent("changeContent");
this.destroyEvent=new YAHOO.util.CustomEvent("destroy");
this.beforeShowEvent=new YAHOO.util.CustomEvent("beforeShow");
this.showEvent=new YAHOO.util.CustomEvent("show");
this.beforeHideEvent=new YAHOO.util.CustomEvent("beforeHide");
this.hideEvent=new YAHOO.util.CustomEvent("hide");
},platform:function(){
var ua=navigator.userAgent.toLowerCase();
if(ua.indexOf("windows")!=-1||ua.indexOf("win32")!=-1){
return "windows";
}else{
if(ua.indexOf("macintosh")!=-1){
return "mac";
}else{
return false;
}
}
}(),browser:function(){
var ua=navigator.userAgent.toLowerCase();
if(ua.indexOf("opera")!=-1){
return "opera";
}else{
if(ua.indexOf("msie 7")!=-1){
return "ie7";
}else{
if(ua.indexOf("msie")!=-1){
return "ie";
}else{
if(ua.indexOf("safari")!=-1){
return "safari";
}else{
if(ua.indexOf("gecko")!=-1){
return "gecko";
}else{
return false;
}
}
}
}
}
}(),isSecure:function(){
if(window.location.href.toLowerCase().indexOf("https")===0){
return true;
}else{
return false;
}
}(),initDefaultConfig:function(){
this.cfg.addProperty("visible",{value:true,handler:this.configVisible,validator:this.cfg.checkBoolean});
this.cfg.addProperty("effect",{suppressEvent:true,supercedes:["visible"]});
this.cfg.addProperty("monitorresize",{value:true,handler:this.configMonitorResize});
},init:function(el,_49){
this.initEvents();
this.beforeInitEvent.fire(YAHOO.widget.Module);
this.cfg=new YAHOO.util.Config(this);
if(this.isSecure){
this.imageRoot=YAHOO.widget.Module.IMG_ROOT_SSL;
}
if(typeof el=="string"){
var _4a=el;
el=document.getElementById(el);
if(!el){
el=document.createElement("div");
el.id=_4a;
}
}
this.element=el;
if(el.id){
this.id=el.id;
}
var _4b=this.element.childNodes;
if(_4b){
for(var i=0;i<_4b.length;i++){
var _4d=_4b[i];
switch(_4d.className){
case YAHOO.widget.Module.CSS_HEADER:
this.header=_4d;
break;
case YAHOO.widget.Module.CSS_BODY:
this.body=_4d;
break;
case YAHOO.widget.Module.CSS_FOOTER:
this.footer=_4d;
break;
}
}
}
this.initDefaultConfig();
YAHOO.util.Dom.addClass(this.element,YAHOO.widget.Module.CSS_MODULE);
if(_49){
this.cfg.applyConfig(_49,true);
}
if(!YAHOO.util.Config.alreadySubscribed(this.renderEvent,this.cfg.fireQueue,this.cfg)){
this.renderEvent.subscribe(this.cfg.fireQueue,this.cfg,true);
}
this.initEvent.fire(YAHOO.widget.Module);
},initResizeMonitor:function(){
if(this.browser!="opera"){
var _4e=document.getElementById("_yuiResizeMonitor");
if(!_4e){
_4e=document.createElement("iframe");
var bIE=(this.browser.indexOf("ie")===0);
if(this.isSecure&&YAHOO.widget.Module.RESIZE_MONITOR_SECURE_URL&&bIE){
_4e.src=YAHOO.widget.Module.RESIZE_MONITOR_SECURE_URL;
}
_4e.id="_yuiResizeMonitor";
_4e.style.visibility="hidden";
document.body.appendChild(_4e);
_4e.style.width="10em";
_4e.style.height="10em";
_4e.style.position="absolute";
var _50=-1*_4e.offsetWidth;
var _51=-1*_4e.offsetHeight;
_4e.style.top=_51+"px";
_4e.style.left=_50+"px";
_4e.style.borderStyle="none";
_4e.style.borderWidth="0";
YAHOO.util.Dom.setStyle(_4e,"opacity","0");
_4e.style.visibility="visible";
if(!bIE){
var doc=_4e.contentWindow.document;
doc.open();
doc.close();
}
}
var _53=function(){
YAHOO.widget.Module.textResizeEvent.fire();
};
if(_4e&&_4e.contentWindow){
this.resizeMonitor=_4e;
YAHOO.widget.Module.textResizeEvent.subscribe(this.onDomResize,this,true);
if(!YAHOO.widget.Module.textResizeInitialized){
if(!YAHOO.util.Event.addListener(this.resizeMonitor.contentWindow,"resize",_53)){
YAHOO.util.Event.addListener(this.resizeMonitor,"resize",_53);
}
YAHOO.widget.Module.textResizeInitialized=true;
}
}
}
},onDomResize:function(e,obj){
var _56=-1*this.resizeMonitor.offsetWidth,_57=-1*this.resizeMonitor.offsetHeight;
this.resizeMonitor.style.top=_57+"px";
this.resizeMonitor.style.left=_56+"px";
},setHeader:function(_58){
if(!this.header){
this.header=document.createElement("div");
this.header.className=YAHOO.widget.Module.CSS_HEADER;
}
if(typeof _58=="string"){
this.header.innerHTML=_58;
}else{
this.header.innerHTML="";
this.header.appendChild(_58);
}
this.changeHeaderEvent.fire(_58);
this.changeContentEvent.fire();
},appendToHeader:function(_59){
if(!this.header){
this.header=document.createElement("div");
this.header.className=YAHOO.widget.Module.CSS_HEADER;
}
this.header.appendChild(_59);
this.changeHeaderEvent.fire(_59);
this.changeContentEvent.fire();
},setBody:function(_5a){
if(!this.body){
this.body=document.createElement("div");
this.body.className=YAHOO.widget.Module.CSS_BODY;
}
if(typeof _5a=="string"){
this.body.innerHTML=_5a;
}else{
this.body.innerHTML="";
this.body.appendChild(_5a);
}
this.changeBodyEvent.fire(_5a);
this.changeContentEvent.fire();
},appendToBody:function(_5b){
if(!this.body){
this.body=document.createElement("div");
this.body.className=YAHOO.widget.Module.CSS_BODY;
}
this.body.appendChild(_5b);
this.changeBodyEvent.fire(_5b);
this.changeContentEvent.fire();
},setFooter:function(_5c){
if(!this.footer){
this.footer=document.createElement("div");
this.footer.className=YAHOO.widget.Module.CSS_FOOTER;
}
if(typeof _5c=="string"){
this.footer.innerHTML=_5c;
}else{
this.footer.innerHTML="";
this.footer.appendChild(_5c);
}
this.changeFooterEvent.fire(_5c);
this.changeContentEvent.fire();
},appendToFooter:function(_5d){
if(!this.footer){
this.footer=document.createElement("div");
this.footer.className=YAHOO.widget.Module.CSS_FOOTER;
}
this.footer.appendChild(_5d);
this.changeFooterEvent.fire(_5d);
this.changeContentEvent.fire();
},render:function(_5e,_5f){
this.beforeRenderEvent.fire();
if(!_5f){
_5f=this.element;
}
var me=this;
var _61=function(_62){
if(typeof _62=="string"){
_62=document.getElementById(_62);
}
if(_62){
_62.appendChild(me.element);
me.appendEvent.fire();
}
};
if(_5e){
_61(_5e);
}else{
if(!YAHOO.util.Dom.inDocument(this.element)){
return false;
}
}
if(this.header&&!YAHOO.util.Dom.inDocument(this.header)){
var _63=_5f.firstChild;
if(_63){
_5f.insertBefore(this.header,_63);
}else{
_5f.appendChild(this.header);
}
}
if(this.body&&!YAHOO.util.Dom.inDocument(this.body)){
if(this.footer&&YAHOO.util.Dom.isAncestor(this.moduleElement,this.footer)){
_5f.insertBefore(this.body,this.footer);
}else{
_5f.appendChild(this.body);
}
}
if(this.footer&&!YAHOO.util.Dom.inDocument(this.footer)){
_5f.appendChild(this.footer);
}
this.renderEvent.fire();
return true;
},destroy:function(){
var _64;
if(this.element){
YAHOO.util.Event.purgeElement(this.element,true);
_64=this.element.parentNode;
}
if(_64){
_64.removeChild(this.element);
}
this.element=null;
this.header=null;
this.body=null;
this.footer=null;
for(var e in this){
if(e instanceof YAHOO.util.CustomEvent){
e.unsubscribeAll();
}
}
YAHOO.widget.Module.textResizeEvent.unsubscribe(this.onDomResize,this);
this.destroyEvent.fire();
},show:function(){
this.cfg.setProperty("visible",true);
},hide:function(){
this.cfg.setProperty("visible",false);
},configVisible:function(_66,_67,obj){
var _69=_67[0];
if(_69){
this.beforeShowEvent.fire();
YAHOO.util.Dom.setStyle(this.element,"display","block");
this.showEvent.fire();
}else{
this.beforeHideEvent.fire();
YAHOO.util.Dom.setStyle(this.element,"display","none");
this.hideEvent.fire();
}
},configMonitorResize:function(_6a,_6b,obj){
var _6d=_6b[0];
if(_6d){
this.initResizeMonitor();
}else{
YAHOO.widget.Module.textResizeEvent.unsubscribe(this.onDomResize,this,true);
this.resizeMonitor=null;
}
}};
YAHOO.widget.Module.prototype.toString=function(){
return "Module "+this.id;
};
YAHOO.widget.Overlay=function(el,_6f){
YAHOO.widget.Overlay.superclass.constructor.call(this,el,_6f);
};
YAHOO.extend(YAHOO.widget.Overlay,YAHOO.widget.Module);
YAHOO.widget.Overlay.IFRAME_SRC="javascript:false;";
YAHOO.widget.Overlay.TOP_LEFT="tl";
YAHOO.widget.Overlay.TOP_RIGHT="tr";
YAHOO.widget.Overlay.BOTTOM_LEFT="bl";
YAHOO.widget.Overlay.BOTTOM_RIGHT="br";
YAHOO.widget.Overlay.CSS_OVERLAY="yui-overlay";
YAHOO.widget.Overlay.prototype.init=function(el,_71){
YAHOO.widget.Overlay.superclass.init.call(this,el);
this.beforeInitEvent.fire(YAHOO.widget.Overlay);
YAHOO.util.Dom.addClass(this.element,YAHOO.widget.Overlay.CSS_OVERLAY);
if(_71){
this.cfg.applyConfig(_71,true);
}
if(this.platform=="mac"&&this.browser=="gecko"){
if(!YAHOO.util.Config.alreadySubscribed(this.showEvent,this.showMacGeckoScrollbars,this)){
this.showEvent.subscribe(this.showMacGeckoScrollbars,this,true);
}
if(!YAHOO.util.Config.alreadySubscribed(this.hideEvent,this.hideMacGeckoScrollbars,this)){
this.hideEvent.subscribe(this.hideMacGeckoScrollbars,this,true);
}
}
this.initEvent.fire(YAHOO.widget.Overlay);
};
YAHOO.widget.Overlay.prototype.initEvents=function(){
YAHOO.widget.Overlay.superclass.initEvents.call(this);
this.beforeMoveEvent=new YAHOO.util.CustomEvent("beforeMove",this);
this.moveEvent=new YAHOO.util.CustomEvent("move",this);
};
YAHOO.widget.Overlay.prototype.initDefaultConfig=function(){
YAHOO.widget.Overlay.superclass.initDefaultConfig.call(this);
this.cfg.addProperty("x",{handler:this.configX,validator:this.cfg.checkNumber,suppressEvent:true,supercedes:["iframe"]});
this.cfg.addProperty("y",{handler:this.configY,validator:this.cfg.checkNumber,suppressEvent:true,supercedes:["iframe"]});
this.cfg.addProperty("xy",{handler:this.configXY,suppressEvent:true,supercedes:["iframe"]});
this.cfg.addProperty("context",{handler:this.configContext,suppressEvent:true,supercedes:["iframe"]});
this.cfg.addProperty("fixedcenter",{value:false,handler:this.configFixedCenter,validator:this.cfg.checkBoolean,supercedes:["iframe","visible"]});
this.cfg.addProperty("width",{handler:this.configWidth,suppressEvent:true,supercedes:["iframe"]});
this.cfg.addProperty("height",{handler:this.configHeight,suppressEvent:true,supercedes:["iframe"]});
this.cfg.addProperty("zIndex",{value:null,handler:this.configzIndex});
this.cfg.addProperty("constraintoviewport",{value:false,handler:this.configConstrainToViewport,validator:this.cfg.checkBoolean,supercedes:["iframe","x","y","xy"]});
this.cfg.addProperty("iframe",{value:(this.browser=="ie"?true:false),handler:this.configIframe,validator:this.cfg.checkBoolean,supercedes:["zIndex"]});
};
YAHOO.widget.Overlay.prototype.moveTo=function(x,y){
this.cfg.setProperty("xy",[x,y]);
};
YAHOO.widget.Overlay.prototype.hideMacGeckoScrollbars=function(){
YAHOO.util.Dom.removeClass(this.element,"show-scrollbars");
YAHOO.util.Dom.addClass(this.element,"hide-scrollbars");
};
YAHOO.widget.Overlay.prototype.showMacGeckoScrollbars=function(){
YAHOO.util.Dom.removeClass(this.element,"hide-scrollbars");
YAHOO.util.Dom.addClass(this.element,"show-scrollbars");
};
YAHOO.widget.Overlay.prototype.configVisible=function(_74,_75,obj){
var _77=_75[0];
var _78=YAHOO.util.Dom.getStyle(this.element,"visibility");
if(_78=="inherit"){
var e=this.element.parentNode;
while(e.nodeType!=9&&e.nodeType!=11){
_78=YAHOO.util.Dom.getStyle(e,"visibility");
if(_78!="inherit"){
break;
}
e=e.parentNode;
}
if(_78=="inherit"){
_78="visible";
}
}
var _7a=this.cfg.getProperty("effect");
var _7b=[];
if(_7a){
if(_7a instanceof Array){
for(var i=0;i<_7a.length;i++){
var eff=_7a[i];
_7b[_7b.length]=eff.effect(this,eff.duration);
}
}else{
_7b[_7b.length]=_7a.effect(this,_7a.duration);
}
}
var _7e=(this.platform=="mac"&&this.browser=="gecko");
if(_77){
if(_7e){
this.showMacGeckoScrollbars();
}
if(_7a){
if(_77){
if(_78!="visible"||_78===""){
this.beforeShowEvent.fire();
for(var j=0;j<_7b.length;j++){
var ei=_7b[j];
if(j===0&&!YAHOO.util.Config.alreadySubscribed(ei.animateInCompleteEvent,this.showEvent.fire,this.showEvent)){
ei.animateInCompleteEvent.subscribe(this.showEvent.fire,this.showEvent,true);
}
ei.animateIn();
}
}
}
}else{
if(_78!="visible"||_78===""){
this.beforeShowEvent.fire();
YAHOO.util.Dom.setStyle(this.element,"visibility","visible");
this.cfg.refireEvent("iframe");
this.showEvent.fire();
}
}
}else{
if(_7e){
this.hideMacGeckoScrollbars();
}
if(_7a){
if(_78=="visible"){
this.beforeHideEvent.fire();
for(var k=0;k<_7b.length;k++){
var h=_7b[k];
if(k===0&&!YAHOO.util.Config.alreadySubscribed(h.animateOutCompleteEvent,this.hideEvent.fire,this.hideEvent)){
h.animateOutCompleteEvent.subscribe(this.hideEvent.fire,this.hideEvent,true);
}
h.animateOut();
}
}else{
if(_78===""){
YAHOO.util.Dom.setStyle(this.element,"visibility","hidden");
}
}
}else{
if(_78=="visible"||_78===""){
this.beforeHideEvent.fire();
YAHOO.util.Dom.setStyle(this.element,"visibility","hidden");
this.cfg.refireEvent("iframe");
this.hideEvent.fire();
}
}
}
};
YAHOO.widget.Overlay.prototype.doCenterOnDOMEvent=function(){
if(this.cfg.getProperty("visible")){
this.center();
}
};
YAHOO.widget.Overlay.prototype.configFixedCenter=function(_83,_84,obj){
var val=_84[0];
if(val){
this.center();
if(!YAHOO.util.Config.alreadySubscribed(this.beforeShowEvent,this.center,this)){
this.beforeShowEvent.subscribe(this.center,this,true);
}
if(!YAHOO.util.Config.alreadySubscribed(YAHOO.widget.Overlay.windowResizeEvent,this.doCenterOnDOMEvent,this)){
YAHOO.widget.Overlay.windowResizeEvent.subscribe(this.doCenterOnDOMEvent,this,true);
}
if(!YAHOO.util.Config.alreadySubscribed(YAHOO.widget.Overlay.windowScrollEvent,this.doCenterOnDOMEvent,this)){
YAHOO.widget.Overlay.windowScrollEvent.subscribe(this.doCenterOnDOMEvent,this,true);
}
}else{
YAHOO.widget.Overlay.windowResizeEvent.unsubscribe(this.doCenterOnDOMEvent,this);
YAHOO.widget.Overlay.windowScrollEvent.unsubscribe(this.doCenterOnDOMEvent,this);
}
};
YAHOO.widget.Overlay.prototype.configHeight=function(_87,_88,obj){
var _8a=_88[0];
var el=this.element;
YAHOO.util.Dom.setStyle(el,"height",_8a);
this.cfg.refireEvent("iframe");
};
YAHOO.widget.Overlay.prototype.configWidth=function(_8c,_8d,obj){
var _8f=_8d[0];
var el=this.element;
YAHOO.util.Dom.setStyle(el,"width",_8f);
this.cfg.refireEvent("iframe");
};
YAHOO.widget.Overlay.prototype.configzIndex=function(_91,_92,obj){
var _94=_92[0];
var el=this.element;
if(!_94){
_94=YAHOO.util.Dom.getStyle(el,"zIndex");
if(!_94||isNaN(_94)){
_94=0;
}
}
if(this.iframe){
if(_94<=0){
_94=1;
}
YAHOO.util.Dom.setStyle(this.iframe,"zIndex",(_94-1));
}
YAHOO.util.Dom.setStyle(el,"zIndex",_94);
this.cfg.setProperty("zIndex",_94,true);
};
YAHOO.widget.Overlay.prototype.configXY=function(_96,_97,obj){
var pos=_97[0];
var x=pos[0];
var y=pos[1];
this.cfg.setProperty("x",x);
this.cfg.setProperty("y",y);
this.beforeMoveEvent.fire([x,y]);
x=this.cfg.getProperty("x");
y=this.cfg.getProperty("y");
this.cfg.refireEvent("iframe");
this.moveEvent.fire([x,y]);
};
YAHOO.widget.Overlay.prototype.configX=function(_9c,_9d,obj){
var x=_9d[0];
var y=this.cfg.getProperty("y");
this.cfg.setProperty("x",x,true);
this.cfg.setProperty("y",y,true);
this.beforeMoveEvent.fire([x,y]);
x=this.cfg.getProperty("x");
y=this.cfg.getProperty("y");
YAHOO.util.Dom.setX(this.element,x,true);
this.cfg.setProperty("xy",[x,y],true);
this.cfg.refireEvent("iframe");
this.moveEvent.fire([x,y]);
};
YAHOO.widget.Overlay.prototype.configY=function(_a1,_a2,obj){
var x=this.cfg.getProperty("x");
var y=_a2[0];
this.cfg.setProperty("x",x,true);
this.cfg.setProperty("y",y,true);
this.beforeMoveEvent.fire([x,y]);
x=this.cfg.getProperty("x");
y=this.cfg.getProperty("y");
YAHOO.util.Dom.setY(this.element,y,true);
this.cfg.setProperty("xy",[x,y],true);
this.cfg.refireEvent("iframe");
this.moveEvent.fire([x,y]);
};
YAHOO.widget.Overlay.prototype.showIframe=function(){
if(this.iframe){
this.iframe.style.display="block";
}
};
YAHOO.widget.Overlay.prototype.hideIframe=function(){
if(this.iframe){
this.iframe.style.display="none";
}
};
YAHOO.widget.Overlay.prototype.configIframe=function(_a6,_a7,obj){
var val=_a7[0];
if(val){
if(!YAHOO.util.Config.alreadySubscribed(this.showEvent,this.showIframe,this)){
this.showEvent.subscribe(this.showIframe,this,true);
}
if(!YAHOO.util.Config.alreadySubscribed(this.hideEvent,this.hideIframe,this)){
this.hideEvent.subscribe(this.hideIframe,this,true);
}
var x=this.cfg.getProperty("x");
var y=this.cfg.getProperty("y");
if(!x||!y){
this.syncPosition();
x=this.cfg.getProperty("x");
y=this.cfg.getProperty("y");
}
if(!isNaN(x)&&!isNaN(y)){
if(!this.iframe){
this.iframe=document.createElement("iframe");
if(this.isSecure){
this.iframe.src=YAHOO.widget.Overlay.IFRAME_SRC;
}
var _ac=this.element.parentNode;
if(_ac){
_ac.appendChild(this.iframe);
}else{
document.body.appendChild(this.iframe);
}
YAHOO.util.Dom.setStyle(this.iframe,"position","absolute");
YAHOO.util.Dom.setStyle(this.iframe,"border","none");
YAHOO.util.Dom.setStyle(this.iframe,"margin","0");
YAHOO.util.Dom.setStyle(this.iframe,"padding","0");
YAHOO.util.Dom.setStyle(this.iframe,"opacity","0");
if(this.cfg.getProperty("visible")){
this.showIframe();
}else{
this.hideIframe();
}
}
var _ad=YAHOO.util.Dom.getStyle(this.iframe,"display");
if(_ad=="none"){
this.iframe.style.display="block";
}
YAHOO.util.Dom.setXY(this.iframe,[x,y]);
var _ae=this.element.clientWidth;
var _af=this.element.clientHeight;
YAHOO.util.Dom.setStyle(this.iframe,"width",(_ae+2)+"px");
YAHOO.util.Dom.setStyle(this.iframe,"height",(_af+2)+"px");
if(_ad=="none"){
this.iframe.style.display="none";
}
}
}else{
if(this.iframe){
this.iframe.style.display="none";
}
this.showEvent.unsubscribe(this.showIframe,this);
this.hideEvent.unsubscribe(this.hideIframe,this);
}
};
YAHOO.widget.Overlay.prototype.configConstrainToViewport=function(_b0,_b1,obj){
var val=_b1[0];
if(val){
if(!YAHOO.util.Config.alreadySubscribed(this.beforeMoveEvent,this.enforceConstraints,this)){
this.beforeMoveEvent.subscribe(this.enforceConstraints,this,true);
}
}else{
this.beforeMoveEvent.unsubscribe(this.enforceConstraints,this);
}
};
YAHOO.widget.Overlay.prototype.configContext=function(_b4,_b5,obj){
var _b7=_b5[0];
if(_b7){
var _b8=_b7[0];
var _b9=_b7[1];
var _ba=_b7[2];
if(_b8){
if(typeof _b8=="string"){
this.cfg.setProperty("context",[document.getElementById(_b8),_b9,_ba],true);
}
if(_b9&&_ba){
this.align(_b9,_ba);
}
}
}
};
YAHOO.widget.Overlay.prototype.align=function(_bb,_bc){
var _bd=this.cfg.getProperty("context");
if(_bd){
var _be=_bd[0];
var _bf=this.element;
var me=this;
if(!_bb){
_bb=_bd[1];
}
if(!_bc){
_bc=_bd[2];
}
if(_bf&&_be){
var _c1=YAHOO.util.Dom.getRegion(_be);
var _c2=function(v,h){
switch(_bb){
case YAHOO.widget.Overlay.TOP_LEFT:
me.moveTo(h,v);
break;
case YAHOO.widget.Overlay.TOP_RIGHT:
me.moveTo(h-_bf.offsetWidth,v);
break;
case YAHOO.widget.Overlay.BOTTOM_LEFT:
me.moveTo(h,v-_bf.offsetHeight);
break;
case YAHOO.widget.Overlay.BOTTOM_RIGHT:
me.moveTo(h-_bf.offsetWidth,v-_bf.offsetHeight);
break;
}
};
switch(_bc){
case YAHOO.widget.Overlay.TOP_LEFT:
_c2(_c1.top,_c1.left);
break;
case YAHOO.widget.Overlay.TOP_RIGHT:
_c2(_c1.top,_c1.right);
break;
case YAHOO.widget.Overlay.BOTTOM_LEFT:
_c2(_c1.bottom,_c1.left);
break;
case YAHOO.widget.Overlay.BOTTOM_RIGHT:
_c2(_c1.bottom,_c1.right);
break;
}
}
}
};
YAHOO.widget.Overlay.prototype.enforceConstraints=function(_c5,_c6,obj){
var pos=_c6[0];
var x=pos[0];
var y=pos[1];
var _cb=this.element.offsetHeight;
var _cc=this.element.offsetWidth;
var _cd=YAHOO.util.Dom.getViewportWidth();
var _ce=YAHOO.util.Dom.getViewportHeight();
var _cf=document.documentElement.scrollLeft||document.body.scrollLeft;
var _d0=document.documentElement.scrollTop||document.body.scrollTop;
var _d1=_d0+10;
var _d2=_cf+10;
var _d3=_d0+_ce-_cb-10;
var _d4=_cf+_cd-_cc-10;
if(x<_d2){
x=_d2;
}else{
if(x>_d4){
x=_d4;
}
}
if(y<_d1){
y=_d1;
}else{
if(y>_d3){
y=_d3;
}
}
this.cfg.setProperty("x",x,true);
this.cfg.setProperty("y",y,true);
this.cfg.setProperty("xy",[x,y],true);
};
YAHOO.widget.Overlay.prototype.center=function(){
var _d5=document.documentElement.scrollLeft||document.body.scrollLeft;
var _d6=document.documentElement.scrollTop||document.body.scrollTop;
var _d7=YAHOO.util.Dom.getClientWidth();
var _d8=YAHOO.util.Dom.getClientHeight();
var _d9=this.element.offsetWidth;
var _da=this.element.offsetHeight;
var x=(_d7/2)-(_d9/2)+_d5;
var y=(_d8/2)-(_da/2)+_d6;
this.cfg.setProperty("xy",[parseInt(x,10),parseInt(y,10)]);
this.cfg.refireEvent("iframe");
};
YAHOO.widget.Overlay.prototype.syncPosition=function(){
var pos=YAHOO.util.Dom.getXY(this.element);
this.cfg.setProperty("x",pos[0],true);
this.cfg.setProperty("y",pos[1],true);
this.cfg.setProperty("xy",pos,true);
};
YAHOO.widget.Overlay.prototype.onDomResize=function(e,obj){
YAHOO.widget.Overlay.superclass.onDomResize.call(this,e,obj);
var me=this;
setTimeout(function(){
me.syncPosition();
me.cfg.refireEvent("iframe");
me.cfg.refireEvent("context");
},0);
};
YAHOO.widget.Overlay.prototype.destroy=function(){
if(this.iframe){
this.iframe.parentNode.removeChild(this.iframe);
}
this.iframe=null;
YAHOO.widget.Overlay.windowResizeEvent.unsubscribe(this.doCenterOnDOMEvent,this);
YAHOO.widget.Overlay.windowScrollEvent.unsubscribe(this.doCenterOnDOMEvent,this);
YAHOO.widget.Overlay.superclass.destroy.call(this);
};
YAHOO.widget.Overlay.prototype.toString=function(){
return "Overlay "+this.id;
};
YAHOO.widget.Overlay.windowScrollEvent=new YAHOO.util.CustomEvent("windowScroll");
YAHOO.widget.Overlay.windowResizeEvent=new YAHOO.util.CustomEvent("windowResize");
YAHOO.widget.Overlay.windowScrollHandler=function(e){
if(YAHOO.widget.Module.prototype.browser=="ie"||YAHOO.widget.Module.prototype.browser=="ie7"){
if(!window.scrollEnd){
window.scrollEnd=-1;
}
clearTimeout(window.scrollEnd);
window.scrollEnd=setTimeout(function(){
YAHOO.widget.Overlay.windowScrollEvent.fire();
},1);
}else{
YAHOO.widget.Overlay.windowScrollEvent.fire();
}
};
YAHOO.widget.Overlay.windowResizeHandler=function(e){
if(YAHOO.widget.Module.prototype.browser=="ie"||YAHOO.widget.Module.prototype.browser=="ie7"){
if(!window.resizeEnd){
window.resizeEnd=-1;
}
clearTimeout(window.resizeEnd);
window.resizeEnd=setTimeout(function(){
YAHOO.widget.Overlay.windowResizeEvent.fire();
},100);
}else{
YAHOO.widget.Overlay.windowResizeEvent.fire();
}
};
YAHOO.widget.Overlay._initialized=null;
if(YAHOO.widget.Overlay._initialized===null){
YAHOO.util.Event.addListener(window,"scroll",YAHOO.widget.Overlay.windowScrollHandler);
YAHOO.util.Event.addListener(window,"resize",YAHOO.widget.Overlay.windowResizeHandler);
YAHOO.widget.Overlay._initialized=true;
}
YAHOO.widget.OverlayManager=function(_e3){
this.init(_e3);
};
YAHOO.widget.OverlayManager.CSS_FOCUSED="focused";
YAHOO.widget.OverlayManager.prototype={constructor:YAHOO.widget.OverlayManager,overlays:null,initDefaultConfig:function(){
this.cfg.addProperty("overlays",{suppressEvent:true});
this.cfg.addProperty("focusevent",{value:"mousedown"});
},init:function(_e4){
this.cfg=new YAHOO.util.Config(this);
this.initDefaultConfig();
if(_e4){
this.cfg.applyConfig(_e4,true);
}
this.cfg.fireQueue();
var _e5=null;
this.getActive=function(){
return _e5;
};
this.focus=function(_e6){
var o=this.find(_e6);
if(o){
this.blurAll();
_e5=o;
YAHOO.util.Dom.addClass(_e5.element,YAHOO.widget.OverlayManager.CSS_FOCUSED);
this.overlays.sort(this.compareZIndexDesc);
var _e8=YAHOO.util.Dom.getStyle(this.overlays[0].element,"zIndex");
if(!isNaN(_e8)&&this.overlays[0]!=_e6){
_e5.cfg.setProperty("zIndex",(parseInt(_e8,10)+2));
}
this.overlays.sort(this.compareZIndexDesc);
}
};
this.remove=function(_e9){
var o=this.find(_e9);
if(o){
var _eb=YAHOO.util.Dom.getStyle(o.element,"zIndex");
o.cfg.setProperty("zIndex",-1000,true);
this.overlays.sort(this.compareZIndexDesc);
this.overlays=this.overlays.slice(0,this.overlays.length-1);
o.cfg.setProperty("zIndex",_eb,true);
o.cfg.setProperty("manager",null);
o.focusEvent=null;
o.blurEvent=null;
o.focus=null;
o.blur=null;
}
};
this.blurAll=function(){
_e5=null;
for(var o=0;o<this.overlays.length;o++){
YAHOO.util.Dom.removeClass(this.overlays[o].element,YAHOO.widget.OverlayManager.CSS_FOCUSED);
}
};
var _ed=this.cfg.getProperty("overlays");
if(!this.overlays){
this.overlays=[];
}
if(_ed){
this.register(_ed);
this.overlays.sort(this.compareZIndexDesc);
}
},register:function(_ee){
if(_ee instanceof YAHOO.widget.Overlay){
_ee.cfg.addProperty("manager",{value:this});
_ee.focusEvent=new YAHOO.util.CustomEvent("focus");
_ee.blurEvent=new YAHOO.util.CustomEvent("blur");
var mgr=this;
_ee.focus=function(){
mgr.focus(this);
this.focusEvent.fire();
};
_ee.blur=function(){
mgr.blurAll();
this.blurEvent.fire();
};
var _f0=function(e,obj){
_ee.focus();
};
var _f3=this.cfg.getProperty("focusevent");
YAHOO.util.Event.addListener(_ee.element,_f3,_f0,this,true);
var _f4=YAHOO.util.Dom.getStyle(_ee.element,"zIndex");
if(!isNaN(_f4)){
_ee.cfg.setProperty("zIndex",parseInt(_f4,10));
}else{
_ee.cfg.setProperty("zIndex",0);
}
this.overlays.push(_ee);
return true;
}else{
if(_ee instanceof Array){
var _f5=0;
for(var i=0;i<_ee.length;i++){
if(this.register(_ee[i])){
_f5++;
}
}
if(_f5>0){
return true;
}
}else{
return false;
}
}
},find:function(_f7){
if(_f7 instanceof YAHOO.widget.Overlay){
for(var o=0;o<this.overlays.length;o++){
if(this.overlays[o]==_f7){
return this.overlays[o];
}
}
}else{
if(typeof _f7=="string"){
for(var p=0;p<this.overlays.length;p++){
if(this.overlays[p].id==_f7){
return this.overlays[p];
}
}
}
}
return null;
},compareZIndexDesc:function(o1,o2){
var _fc=o1.cfg.getProperty("zIndex");
var _fd=o2.cfg.getProperty("zIndex");
if(_fc>_fd){
return -1;
}else{
if(_fc<_fd){
return 1;
}else{
return 0;
}
}
},showAll:function(){
for(var o=0;o<this.overlays.length;o++){
this.overlays[o].show();
}
},hideAll:function(){
for(var o=0;o<this.overlays.length;o++){
this.overlays[o].hide();
}
},toString:function(){
return "OverlayManager";
}};
YAHOO.util.KeyListener=function(_100,_101,_102,_103){
if(!_100){
}
if(!_101){
}
if(!_102){
}
if(!_103){
_103=YAHOO.util.KeyListener.KEYDOWN;
}
var _104=new YAHOO.util.CustomEvent("keyPressed");
this.enabledEvent=new YAHOO.util.CustomEvent("enabled");
this.disabledEvent=new YAHOO.util.CustomEvent("disabled");
if(typeof _100=="string"){
_100=document.getElementById(_100);
}
if(typeof _102=="function"){
_104.subscribe(_102);
}else{
_104.subscribe(_102.fn,_102.scope,_102.correctScope);
}
function handleKeyPress(e,obj){
if(!_101.shift){
_101.shift=false;
}
if(!_101.alt){
_101.alt=false;
}
if(!_101.ctrl){
_101.ctrl=false;
}
if(e.shiftKey==_101.shift&&e.altKey==_101.alt&&e.ctrlKey==_101.ctrl){
var _107;
var _108;
if(_101.keys instanceof Array){
for(var i=0;i<_101.keys.length;i++){
_107=_101.keys[i];
if(_107==e.charCode){
_104.fire(e.charCode,e);
break;
}else{
if(_107==e.keyCode){
_104.fire(e.keyCode,e);
break;
}
}
}
}else{
_107=_101.keys;
if(_107==e.charCode){
_104.fire(e.charCode,e);
}else{
if(_107==e.keyCode){
_104.fire(e.keyCode,e);
}
}
}
}
}
this.enable=function(){
if(!this.enabled){
YAHOO.util.Event.addListener(_100,_103,handleKeyPress);
this.enabledEvent.fire(_101);
}
this.enabled=true;
};
this.disable=function(){
if(this.enabled){
YAHOO.util.Event.removeListener(_100,_103,handleKeyPress);
this.disabledEvent.fire(_101);
}
this.enabled=false;
};
this.toString=function(){
return "KeyListener ["+_101.keys+"] "+_100.tagName+(_100.id?"["+_100.id+"]":"");
};
};
YAHOO.util.KeyListener.KEYDOWN="keydown";
YAHOO.util.KeyListener.KEYUP="keyup";
YAHOO.widget.ContainerEffect=function(_10a,_10b,_10c,_10d,_10e){
if(!_10e){
_10e=YAHOO.util.Anim;
}
this.overlay=_10a;
this.attrIn=_10b;
this.attrOut=_10c;
this.targetElement=_10d||_10a.element;
this.animClass=_10e;
};
YAHOO.widget.ContainerEffect.prototype.init=function(){
this.beforeAnimateInEvent=new YAHOO.util.CustomEvent("beforeAnimateIn");
this.beforeAnimateOutEvent=new YAHOO.util.CustomEvent("beforeAnimateOut");
this.animateInCompleteEvent=new YAHOO.util.CustomEvent("animateInComplete");
this.animateOutCompleteEvent=new YAHOO.util.CustomEvent("animateOutComplete");
this.animIn=new this.animClass(this.targetElement,this.attrIn.attributes,this.attrIn.duration,this.attrIn.method);
this.animIn.onStart.subscribe(this.handleStartAnimateIn,this);
this.animIn.onTween.subscribe(this.handleTweenAnimateIn,this);
this.animIn.onComplete.subscribe(this.handleCompleteAnimateIn,this);
this.animOut=new this.animClass(this.targetElement,this.attrOut.attributes,this.attrOut.duration,this.attrOut.method);
this.animOut.onStart.subscribe(this.handleStartAnimateOut,this);
this.animOut.onTween.subscribe(this.handleTweenAnimateOut,this);
this.animOut.onComplete.subscribe(this.handleCompleteAnimateOut,this);
};
YAHOO.widget.ContainerEffect.prototype.animateIn=function(){
this.beforeAnimateInEvent.fire();
this.animIn.animate();
};
YAHOO.widget.ContainerEffect.prototype.animateOut=function(){
this.beforeAnimateOutEvent.fire();
this.animOut.animate();
};
YAHOO.widget.ContainerEffect.prototype.handleStartAnimateIn=function(type,args,obj){
};
YAHOO.widget.ContainerEffect.prototype.handleTweenAnimateIn=function(type,args,obj){
};
YAHOO.widget.ContainerEffect.prototype.handleCompleteAnimateIn=function(type,args,obj){
};
YAHOO.widget.ContainerEffect.prototype.handleStartAnimateOut=function(type,args,obj){
};
YAHOO.widget.ContainerEffect.prototype.handleTweenAnimateOut=function(type,args,obj){
};
YAHOO.widget.ContainerEffect.prototype.handleCompleteAnimateOut=function(type,args,obj){
};
YAHOO.widget.ContainerEffect.prototype.toString=function(){
var _121="ContainerEffect";
if(this.overlay){
_121+=" ["+this.overlay.toString()+"]";
}
return _121;
};
YAHOO.widget.ContainerEffect.FADE=function(_122,dur){
var fade=new YAHOO.widget.ContainerEffect(_122,{attributes:{opacity:{from:0,to:1}},duration:dur,method:YAHOO.util.Easing.easeIn},{attributes:{opacity:{to:0}},duration:dur,method:YAHOO.util.Easing.easeOut},_122.element);
fade.handleStartAnimateIn=function(type,args,obj){
YAHOO.util.Dom.addClass(obj.overlay.element,"hide-select");
if(!obj.overlay.underlay){
obj.overlay.cfg.refireEvent("underlay");
}
if(obj.overlay.underlay){
obj.initialUnderlayOpacity=YAHOO.util.Dom.getStyle(obj.overlay.underlay,"opacity");
obj.overlay.underlay.style.filter=null;
}
YAHOO.util.Dom.setStyle(obj.overlay.element,"visibility","visible");
YAHOO.util.Dom.setStyle(obj.overlay.element,"opacity",0);
};
fade.handleCompleteAnimateIn=function(type,args,obj){
YAHOO.util.Dom.removeClass(obj.overlay.element,"hide-select");
if(obj.overlay.element.style.filter){
obj.overlay.element.style.filter=null;
}
if(obj.overlay.underlay){
YAHOO.util.Dom.setStyle(obj.overlay.underlay,"opacity",obj.initialUnderlayOpacity);
}
obj.overlay.cfg.refireEvent("iframe");
obj.animateInCompleteEvent.fire();
};
fade.handleStartAnimateOut=function(type,args,obj){
YAHOO.util.Dom.addClass(obj.overlay.element,"hide-select");
if(obj.overlay.underlay){
obj.overlay.underlay.style.filter=null;
}
};
fade.handleCompleteAnimateOut=function(type,args,obj){
YAHOO.util.Dom.removeClass(obj.overlay.element,"hide-select");
if(obj.overlay.element.style.filter){
obj.overlay.element.style.filter=null;
}
YAHOO.util.Dom.setStyle(obj.overlay.element,"visibility","hidden");
YAHOO.util.Dom.setStyle(obj.overlay.element,"opacity",1);
obj.overlay.cfg.refireEvent("iframe");
obj.animateOutCompleteEvent.fire();
};
fade.init();
return fade;
};
YAHOO.widget.ContainerEffect.SLIDE=function(_131,dur){
var x=_131.cfg.getProperty("x")||YAHOO.util.Dom.getX(_131.element);
var y=_131.cfg.getProperty("y")||YAHOO.util.Dom.getY(_131.element);
var _135=YAHOO.util.Dom.getClientWidth();
var _136=_131.element.offsetWidth;
var _137=new YAHOO.widget.ContainerEffect(_131,{attributes:{points:{to:[x,y]}},duration:dur,method:YAHOO.util.Easing.easeIn},{attributes:{points:{to:[(_135+25),y]}},duration:dur,method:YAHOO.util.Easing.easeOut},_131.element,YAHOO.util.Motion);
_137.handleStartAnimateIn=function(type,args,obj){
obj.overlay.element.style.left=(-25-_136)+"px";
obj.overlay.element.style.top=y+"px";
};
_137.handleTweenAnimateIn=function(type,args,obj){
var pos=YAHOO.util.Dom.getXY(obj.overlay.element);
var _13f=pos[0];
var _140=pos[1];
if(YAHOO.util.Dom.getStyle(obj.overlay.element,"visibility")=="hidden"&&_13f<x){
YAHOO.util.Dom.setStyle(obj.overlay.element,"visibility","visible");
}
obj.overlay.cfg.setProperty("xy",[_13f,_140],true);
obj.overlay.cfg.refireEvent("iframe");
};
_137.handleCompleteAnimateIn=function(type,args,obj){
obj.overlay.cfg.setProperty("xy",[x,y],true);
obj.startX=x;
obj.startY=y;
obj.overlay.cfg.refireEvent("iframe");
obj.animateInCompleteEvent.fire();
};
_137.handleStartAnimateOut=function(type,args,obj){
var vw=YAHOO.util.Dom.getViewportWidth();
var pos=YAHOO.util.Dom.getXY(obj.overlay.element);
var yso=pos[1];
var _14a=obj.animOut.attributes.points.to;
obj.animOut.attributes.points.to=[(vw+25),yso];
};
_137.handleTweenAnimateOut=function(type,args,obj){
var pos=YAHOO.util.Dom.getXY(obj.overlay.element);
var xto=pos[0];
var yto=pos[1];
obj.overlay.cfg.setProperty("xy",[xto,yto],true);
obj.overlay.cfg.refireEvent("iframe");
};
_137.handleCompleteAnimateOut=function(type,args,obj){
YAHOO.util.Dom.setStyle(obj.overlay.element,"visibility","hidden");
obj.overlay.cfg.setProperty("xy",[x,y]);
obj.animateOutCompleteEvent.fire();
};
_137.init();
return _137;
};
YAHOO.register("container_core",YAHOO.widget.Module,{version:"2.2.0",build:"127"});


(function(){
var _1=YAHOO.util.Dom,_2=YAHOO.util.Event;
YAHOO.widget.MenuManager=function(){
var _3=false,_4={},_5={},_6={},me=this;
function addItem(_8){
var _9=_8.id;
if(_8&&_5[_9]!=_8){
_5[_9]=_8;
_8.destroyEvent.subscribe(onItemDestroy,_8);
}
}
function removeItem(_a){
var _b=_a.id;
if(_b&&_5[_b]){
delete _5[_b];
}
}
function getMenuRootElement(_c){
var _d;
if(_c&&_c.tagName){
switch(_c.tagName.toUpperCase()){
case "DIV":
_d=_c.parentNode;
if((_1.hasClass(_c,"hd")||_1.hasClass(_c,"bd")||_1.hasClass(_c,"ft"))&&_d&&_d.tagName&&_d.tagName.toUpperCase()=="DIV"){
return _d;
}else{
return _c;
}
break;
case "LI":
return _c;
default:
_d=_c.parentNode;
if(_d){
return getMenuRootElement(_d);
}
break;
}
}
}
function onDOMEvent(_e){
var _f=_2.getTarget(_e),_10=getMenuRootElement(_f),_11,_12;
if(_10){
var _13=_10.tagName.toUpperCase();
if(_13=="LI"){
var sId=_10.id;
if(sId&&_5[sId]){
_11=_5[sId];
_12=_11.parent;
}
}else{
if(_13=="DIV"){
if(_10.id){
_12=_4[_10.id];
}
}
}
}
if(_12){
var _15={"click":"clickEvent","mousedown":"mouseDownEvent","mouseup":"mouseUpEvent","mouseover":"mouseOverEvent","mouseout":"mouseOutEvent","keydown":"keyDownEvent","keyup":"keyUpEvent","keypress":"keyPressEvent"},_16=_15[_e.type];
if(_11&&!_11.cfg.getProperty("disabled")){
_11[_16].fire(_e);
}
_12[_16].fire(_e,_11);
}else{
if(_e.type=="mousedown"){
var _17;
for(var i in _4){
if(_4.hasOwnProperty(i)){
_12=_4[i];
if(_12.cfg.getProperty("clicktohide")&&_12.cfg.getProperty("position")=="dynamic"){
_12.hide();
}else{
_12.clearActiveItem(true);
}
}
}
}
}
}
function onMenuDestroy(_19,_1a,_1b){
if(_1b&&_4[_1b.id]){
delete _4[_1b.id];
}
}
function onItemDestroy(_1c,_1d,_1e){
var sId=_1e.id;
if(sId&&_5[sId]){
delete _5[sId];
}
}
function onMenuVisibleConfigChange(_20,_21,_22){
var _23=_21[0];
if(_23){
_6[_22.id]=_22;
}else{
if(_6[_22.id]){
delete _6[_22.id];
}
}
}
function onItemAdded(_24,_25){
addItem(_25[0]);
}
function onItemRemoved(_26,_27){
removeItem(_27[0]);
}
return {addMenu:function(_28){
if(_28&&_28.id&&!_4[_28.id]){
_4[_28.id]=_28;
if(!_3){
var _29=document;
_2.addListener(_29,"mouseover",onDOMEvent,me,true);
_2.addListener(_29,"mouseout",onDOMEvent,me,true);
_2.addListener(_29,"mousedown",onDOMEvent,me,true);
_2.addListener(_29,"mouseup",onDOMEvent,me,true);
_2.addListener(_29,"click",onDOMEvent,me,true);
_2.addListener(_29,"keydown",onDOMEvent,me,true);
_2.addListener(_29,"keyup",onDOMEvent,me,true);
_2.addListener(_29,"keypress",onDOMEvent,me,true);
_3=true;
}
_28.destroyEvent.subscribe(onMenuDestroy,_28,me);
_28.cfg.subscribeToConfigEvent("visible",onMenuVisibleConfigChange,_28);
_28.itemAddedEvent.subscribe(onItemAdded);
_28.itemRemovedEvent.subscribe(onItemRemoved);
}
},removeMenu:function(_2a){
if(_2a&&_4[_2a.id]){
delete _4[_2a.id];
}
},hideVisible:function(){
var _2b;
for(var i in _6){
if(_6.hasOwnProperty(i)){
_2b=_6[i];
if(_2b.cfg.getProperty("position")=="dynamic"){
_2b.hide();
}
}
}
},getMenus:function(){
return _4;
},getMenu:function(_2d){
if(_4[_2d]){
return _4[_2d];
}
},toString:function(){
return ("MenuManager");
}};
}();
})();
(function(){
var Dom=YAHOO.util.Dom,_2f=YAHOO.util.Event,_30=YAHOO.lang;
YAHOO.widget.Menu=function(_31,_32){
if(_32){
this.parent=_32.parent;
this.lazyLoad=_32.lazyLoad||_32.lazyload;
this.itemData=_32.itemData||_32.itemdata;
}
YAHOO.widget.Menu.superclass.constructor.call(this,_31,_32);
};
YAHOO.lang.extend(YAHOO.widget.Menu,YAHOO.widget.Overlay,{CSS_CLASS_NAME:"yuimenu",ITEM_TYPE:null,GROUP_TITLE_TAG_NAME:"h6",_nHideDelayId:null,_nShowDelayId:null,_nSubmenuHideDelayId:null,_nBodyScrollId:null,_bHideDelayEventHandlersAssigned:false,_bHandledMouseOverEvent:false,_bHandledMouseOutEvent:false,_aGroupTitleElements:null,_aItemGroups:null,_aListElements:null,_nCurrentMouseX:0,_nMaxHeight:-1,_bStopMouseEventHandlers:false,_sClassName:null,lazyLoad:false,itemData:null,activeItem:null,parent:null,srcElement:null,mouseOverEvent:null,mouseOutEvent:null,mouseDownEvent:null,mouseUpEvent:null,clickEvent:null,keyPressEvent:null,keyDownEvent:null,keyUpEvent:null,itemAddedEvent:null,itemRemovedEvent:null,init:function(_33,_34){
this._aItemGroups=[];
this._aListElements=[];
this._aGroupTitleElements=[];
if(!this.ITEM_TYPE){
this.ITEM_TYPE=YAHOO.widget.MenuItem;
}
var _35;
if(typeof _33=="string"){
_35=document.getElementById(_33);
}else{
if(_33.tagName){
_35=_33;
}
}
if(_35&&_35.tagName){
switch(_35.tagName.toUpperCase()){
case "DIV":
this.srcElement=_35;
if(!_35.id){
_35.setAttribute("id",Dom.generateId());
}
YAHOO.widget.Menu.superclass.init.call(this,_35);
this.beforeInitEvent.fire(YAHOO.widget.Menu);
break;
case "SELECT":
this.srcElement=_35;
YAHOO.widget.Menu.superclass.init.call(this,Dom.generateId());
this.beforeInitEvent.fire(YAHOO.widget.Menu);
break;
}
}else{
YAHOO.widget.Menu.superclass.init.call(this,_33);
this.beforeInitEvent.fire(YAHOO.widget.Menu);
}
if(this.element){
var oEl=this.element;
Dom.addClass(oEl,this.CSS_CLASS_NAME);
this.initEvent.subscribe(this._onInit,this,true);
this.beforeRenderEvent.subscribe(this._onBeforeRender,this,true);
this.renderEvent.subscribe(this._setWidth,this,true);
this.beforeShowEvent.subscribe(this._onBeforeShow,this,true);
this.showEvent.subscribe(this._onShow,this,true);
this.beforeHideEvent.subscribe(this._onBeforeHide,this,true);
this.hideEvent.subscribe(this._onHide,this,true);
this.mouseOverEvent.subscribe(this._onMouseOver,this,true);
this.mouseOutEvent.subscribe(this._onMouseOut,this,true);
this.clickEvent.subscribe(this._onClick,this,true);
this.keyDownEvent.subscribe(this._onKeyDown,this,true);
this.keyPressEvent.subscribe(this._onKeyPress,this,true);
YAHOO.widget.Module.textResizeEvent.subscribe(this._onTextResize,this,true);
if(_34){
this.cfg.applyConfig(_34,true);
}
YAHOO.widget.MenuManager.addMenu(this);
this.initEvent.fire(YAHOO.widget.Menu);
}
},_initSubTree:function(){
var _37;
if(this.srcElement.tagName.toUpperCase()=="DIV"){
_37=this.body.firstChild;
var _38=0,_39=this.GROUP_TITLE_TAG_NAME.toUpperCase();
do{
if(_37&&_37.tagName){
switch(_37.tagName.toUpperCase()){
case _39:
this._aGroupTitleElements[_38]=_37;
break;
case "UL":
this._aListElements[_38]=_37;
this._aItemGroups[_38]=[];
_38++;
break;
}
}
}while((_37=_37.nextSibling));
if(this._aListElements[0]){
Dom.addClass(this._aListElements[0],"first-of-type");
}
}
_37=null;
if(this.srcElement.tagName){
var _3a=this.srcElement.tagName.toUpperCase();
switch(_3a){
case "DIV":
if(this._aListElements.length>0){
var i=this._aListElements.length-1;
do{
_37=this._aListElements[i].firstChild;
do{
if(_37&&_37.tagName&&_37.tagName.toUpperCase()=="LI"){
this.addItem(new this.ITEM_TYPE(_37,{parent:this}),i);
}
}while((_37=_37.nextSibling));
}while(i--);
}
break;
case "SELECT":
_37=this.srcElement.firstChild;
do{
if(_37&&_37.tagName){
switch(_37.tagName.toUpperCase()){
case "OPTGROUP":
case "OPTION":
this.addItem(new this.ITEM_TYPE(_37,{parent:this}));
break;
}
}
}while((_37=_37.nextSibling));
break;
}
}
},_getFirstEnabledItem:function(){
var _3c=this.getItems(),_3d=_3c.length,_3e;
for(var i=0;i<_3d;i++){
_3e=_3c[i];
if(_3e&&!_3e.cfg.getProperty("disabled")&&_3e.element.style.display!="none"){
return _3e;
}
}
},_checkPosition:function(_40){
if(typeof _40=="string"){
var _41=_40.toLowerCase();
return ("dynamic,static".indexOf(_41)!=-1);
}
},_addItemToGroup:function(_42,_43,_44){
var _45;
if(_43 instanceof this.ITEM_TYPE){
_45=_43;
_45.parent=this;
}else{
if(typeof _43=="string"){
_45=new this.ITEM_TYPE(_43,{parent:this});
}else{
if(typeof _43=="object"){
_43.parent=this;
_45=new this.ITEM_TYPE(_43.text,_43);
}
}
}
if(_45){
var _46=typeof _42=="number"?_42:0,_47=this._getItemGroup(_46),_48;
if(!_47){
_47=this._createItemGroup(_46);
}
if(typeof _44=="number"){
var _49=(_44>=_47.length);
if(_47[_44]){
_47.splice(_44,0,_45);
}else{
_47[_44]=_45;
}
_48=_47[_44];
if(_48){
if(_49&&(!_48.element.parentNode||_48.element.parentNode.nodeType==11)){
this._aListElements[_46].appendChild(_48.element);
}else{
function getNextItemSibling(_4a,_4b){
return (_4a[_4b]||getNextItemSibling(_4a,(_4b+1)));
}
var _4c=getNextItemSibling(_47,(_44+1));
if(_4c&&(!_48.element.parentNode||_48.element.parentNode.nodeType==11)){
this._aListElements[_46].insertBefore(_48.element,_4c.element);
}
}
_48.parent=this;
this._subscribeToItemEvents(_48);
this._configureSubmenu(_48);
this._updateItemProperties(_46);
this.itemAddedEvent.fire(_48);
return _48;
}
}else{
var _4d=_47.length;
_47[_4d]=_45;
_48=_47[_4d];
if(_48){
if(!Dom.isAncestor(this._aListElements[_46],_48.element)){
this._aListElements[_46].appendChild(_48.element);
}
_48.element.setAttribute("groupindex",_46);
_48.element.setAttribute("index",_4d);
_48.parent=this;
_48.index=_4d;
_48.groupIndex=_46;
this._subscribeToItemEvents(_48);
this._configureSubmenu(_48);
if(_4d===0){
Dom.addClass(_48.element,"first-of-type");
}
this.itemAddedEvent.fire(_48);
return _48;
}
}
}
},_removeItemFromGroupByIndex:function(_4e,_4f){
var _50=typeof _4e=="number"?_4e:0,_51=this._getItemGroup(_50);
if(_51){
var _52=_51.splice(_4f,1),_53=_52[0];
if(_53){
this._updateItemProperties(_50);
if(_51.length===0){
var oUL=this._aListElements[_50];
if(this.body&&oUL){
this.body.removeChild(oUL);
}
this._aItemGroups.splice(_50,1);
this._aListElements.splice(_50,1);
oUL=this._aListElements[0];
if(oUL){
Dom.addClass(oUL,"first-of-type");
}
}
this.itemRemovedEvent.fire(_53);
return _53;
}
}
},_removeItemFromGroupByValue:function(_55,_56){
var _57=this._getItemGroup(_55);
if(_57){
var _58=_57.length,_59=-1;
if(_58>0){
var i=_58-1;
do{
if(_57[i]==_56){
_59=i;
break;
}
}while(i--);
if(_59>-1){
return this._removeItemFromGroupByIndex(_55,_59);
}
}
}
},_updateItemProperties:function(_5b){
var _5c=this._getItemGroup(_5b),_5d=_5c.length;
if(_5d>0){
var i=_5d-1,_5f,oLI;
do{
_5f=_5c[i];
if(_5f){
oLI=_5f.element;
_5f.index=i;
_5f.groupIndex=_5b;
oLI.setAttribute("groupindex",_5b);
oLI.setAttribute("index",i);
Dom.removeClass(oLI,"first-of-type");
}
}while(i--);
if(oLI){
Dom.addClass(oLI,"first-of-type");
}
}
},_createItemGroup:function(_61){
if(!this._aItemGroups[_61]){
this._aItemGroups[_61]=[];
var oUL=document.createElement("ul");
this._aListElements[_61]=oUL;
return this._aItemGroups[_61];
}
},_getItemGroup:function(_63){
var _64=((typeof _63=="number")?_63:0);
return this._aItemGroups[_64];
},_configureSubmenu:function(_65){
var _66=_65.cfg.getProperty("submenu");
if(_66){
this.cfg.configChangedEvent.subscribe(this._onParentMenuConfigChange,_66,true);
this.renderEvent.subscribe(this._onParentMenuRender,_66,true);
_66.beforeShowEvent.subscribe(this._onSubmenuBeforeShow,_66,true);
_66.showEvent.subscribe(this._onSubmenuShow,_66,true);
_66.hideEvent.subscribe(this._onSubmenuHide,_66,true);
}
},_subscribeToItemEvents:function(_67){
_67.focusEvent.subscribe(this._onMenuItemFocus,_67,this);
_67.blurEvent.subscribe(this._onMenuItemBlur,this,true);
_67.cfg.configChangedEvent.subscribe(this._onMenuItemConfigChange,_67,this);
},_getOffsetWidth:function(){
var _68=this.element.cloneNode(true);
Dom.setStyle(_68,"width","");
document.body.appendChild(_68);
var _69=_68.offsetWidth;
document.body.removeChild(_68);
return _69;
},_setWidth:function(){
if(this.cfg.getProperty("position")=="dynamic"){
var _6a;
if(this.element.parentNode.tagName.toUpperCase()=="BODY"){
if(this.browser=="opera"){
_6a=this._getOffsetWidth();
}else{
Dom.setStyle(this.element,"width","auto");
_6a=this.element.offsetWidth;
}
}else{
_6a=this._getOffsetWidth();
}
this.cfg.setProperty("width",(_6a+"px"));
}
},_cancelHideDelay:function(){
var _6b=this.getRoot();
if(_6b._nHideDelayId){
window.clearTimeout(_6b._nHideDelayId);
}
},_execHideDelay:function(){
this._cancelHideDelay();
var _6c=this.getRoot(),me=this;
function hideMenu(){
if(_6c.activeItem){
_6c.clearActiveItem();
}
if(_6c==me&&me.cfg.getProperty("position")=="dynamic"){
me.hide();
}
}
_6c._nHideDelayId=window.setTimeout(hideMenu,_6c.cfg.getProperty("hidedelay"));
},_cancelShowDelay:function(){
var _6e=this.getRoot();
if(_6e._nShowDelayId){
window.clearTimeout(_6e._nShowDelayId);
}
},_execShowDelay:function(_6f){
var _70=this.getRoot();
function showMenu(){
if(_6f.parent.cfg.getProperty("selected")){
_6f.show();
}
}
_70._nShowDelayId=window.setTimeout(showMenu,_70.cfg.getProperty("showdelay"));
},_execSubmenuHideDelay:function(_71,_72,_73){
var me=this;
_71._nSubmenuHideDelayId=window.setTimeout(function(){
if(me._nCurrentMouseX>(_72+10)){
_71._nSubmenuHideDelayId=window.setTimeout(function(){
_71.hide();
},_73);
}else{
_71.hide();
}
},50);
},_disableScrollHeader:function(){
if(!this._bHeaderDisabled){
Dom.addClass(this.header,"topscrollbar_disabled");
this._bHeaderDisabled=true;
}
},_disableScrollFooter:function(){
if(!this._bFooterDisabled){
Dom.addClass(this.footer,"bottomscrollbar_disabled");
this._bFooterDisabled=true;
}
},_enableScrollHeader:function(){
if(this._bHeaderDisabled){
Dom.removeClass(this.header,"topscrollbar_disabled");
this._bHeaderDisabled=false;
}
},_enableScrollFooter:function(){
if(this._bFooterDisabled){
Dom.removeClass(this.footer,"bottomscrollbar_disabled");
this._bFooterDisabled=false;
}
},_onMouseOver:function(_75,_76,_77){
if(this._bStopMouseEventHandlers){
return false;
}
var _78=_76[0],_79=_76[1],_7a=_2f.getTarget(_78);
if(!this._bHandledMouseOverEvent&&(_7a==this.element||Dom.isAncestor(this.element,_7a))){
this._nCurrentMouseX=0;
_2f.addListener(this.element,"mousemove",this._onMouseMove,this,true);
this.clearActiveItem();
if(this.parent&&this._nSubmenuHideDelayId){
window.clearTimeout(this._nSubmenuHideDelayId);
this.parent.cfg.setProperty("selected",true);
var _7b=this.parent.parent;
_7b.activeItem=this.parent;
_7b._bHandledMouseOutEvent=true;
_7b._bHandledMouseOverEvent=false;
}
this._bHandledMouseOverEvent=true;
this._bHandledMouseOutEvent=false;
}
if(_79&&!_79.handledMouseOverEvent&&!_79.cfg.getProperty("disabled")&&(_7a==_79.element||Dom.isAncestor(_79.element,_7a))){
var _7c=this.cfg.getProperty("showdelay"),_7d=(_7c>0);
if(_7d){
this._cancelShowDelay();
}
var _7e=this.activeItem;
if(_7e){
_7e.cfg.setProperty("selected",false);
}
var _7f=_79.cfg;
_7f.setProperty("selected",true);
_79.focus();
if(this.cfg.getProperty("autosubmenudisplay")){
var _80=_7f.getProperty("submenu");
if(_80){
if(_7d){
this._execShowDelay(_80);
}else{
_80.show();
}
}
}
_79.handledMouseOverEvent=true;
_79.handledMouseOutEvent=false;
}
},_onMouseOut:function(_81,_82,_83){
if(this._bStopMouseEventHandlers){
return false;
}
var _84=_82[0],_85=_82[1],_86=_2f.getRelatedTarget(_84),_87=false;
if(_85&&!_85.cfg.getProperty("disabled")){
var _88=_85.cfg,_89=_88.getProperty("submenu");
if(_89&&(_86==_89.element||Dom.isAncestor(_89.element,_86))){
_87=true;
}
if(!_85.handledMouseOutEvent&&((_86!=_85.element&&!Dom.isAncestor(_85.element,_86))||_87)){
if(!_87){
_85.cfg.setProperty("selected",false);
if(_89){
var _8a=this.cfg.getProperty("submenuhidedelay"),_8b=this.cfg.getProperty("showdelay");
if(!(this instanceof YAHOO.widget.MenuBar)&&_8a>0&&_8b>=_8a){
this._execSubmenuHideDelay(_89,_2f.getPageX(_84),_8a);
}else{
_89.hide();
}
}
}
_85.handledMouseOutEvent=true;
_85.handledMouseOverEvent=false;
}
}
if(!this._bHandledMouseOutEvent&&((_86!=this.element&&!Dom.isAncestor(this.element,_86))||_87)){
_2f.removeListener(this.element,"mousemove",this._onMouseMove);
this._nCurrentMouseX=_2f.getPageX(_84);
this._bHandledMouseOutEvent=true;
this._bHandledMouseOverEvent=false;
}
},_onMouseMove:function(_8c,_8d){
if(this._bStopMouseEventHandlers){
return false;
}
this._nCurrentMouseX=_2f.getPageX(_8c);
},_onClick:function(_8e,_8f,_90){
var _91=_8f[0],_92=_8f[1],_93=_2f.getTarget(_91);
if(_92&&!_92.cfg.getProperty("disabled")){
var _94=_92.cfg,_95=_94.getProperty("submenu");
if(_93==_92.submenuIndicator&&_95){
if(_95.cfg.getProperty("visible")){
_95.hide();
_95.parent.focus();
}else{
this.clearActiveItem();
this.activeItem=_92;
_92.cfg.setProperty("selected",true);
_95.show();
}
}else{
var _96=_94.getProperty("url"),_97=(_96.substr((_96.length-1),1)=="#"),_98=_94.getProperty("target"),_99=(_98&&_98.length>0);
if(_93.tagName.toUpperCase()=="A"&&_97&&!_99){
_2f.preventDefault(_91);
}
if(_93.tagName.toUpperCase()!="A"&&!_97&&!_99){
document.location=_96;
}
if(_97&&!_95){
var _9a=this.getRoot();
if(_9a.cfg.getProperty("position")=="static"){
_9a.clearActiveItem();
}else{
if(_9a.cfg.getProperty("clicktohide")){
_9a.hide();
}
}
}
}
}
},_onKeyDown:function(_9b,_9c,_9d){
var _9e=_9c[0],_9f=_9c[1],me=this,_a1;
function stopMouseEventHandlers(){
me._bStopMouseEventHandlers=true;
window.setTimeout(function(){
me._bStopMouseEventHandlers=false;
},10);
}
if(_9f&&!_9f.cfg.getProperty("disabled")){
var _a2=_9f.cfg,_a3=this.parent,_a4,_a5;
switch(_9e.keyCode){
case 38:
case 40:
if(_9f==this.activeItem&&!_a2.getProperty("selected")){
_a2.setProperty("selected",true);
}else{
_a5=(_9e.keyCode==38)?_9f.getPreviousEnabledSibling():_9f.getNextEnabledSibling();
if(_a5){
this.clearActiveItem();
_a5.cfg.setProperty("selected",true);
_a5.focus();
if(this.cfg.getProperty("maxheight")>0){
var _a6=this.body;
_a6.scrollTop=(_a5.element.offsetTop+_a5.element.offsetHeight)-_a6.offsetHeight;
var _a7=_a6.scrollTop,_a8=_a6.scrollHeight-_a6.offsetHeight;
if(_a7===0){
this._disableScrollHeader();
this._enableScrollFooter();
}else{
if(_a7==_a8){
this._enableScrollHeader();
this._disableScrollFooter();
}else{
this._enableScrollHeader();
this._enableScrollFooter();
}
}
}
}
}
_2f.preventDefault(_9e);
stopMouseEventHandlers();
break;
case 39:
_a1=_a2.getProperty("submenu");
if(_a1){
if(!_a2.getProperty("selected")){
_a2.setProperty("selected",true);
}
_a1.show();
_a1.setInitialSelection();
}else{
_a4=this.getRoot();
if(_a4 instanceof YAHOO.widget.MenuBar){
_a5=_a4.activeItem.getNextEnabledSibling();
if(_a5){
_a4.clearActiveItem();
_a5.cfg.setProperty("selected",true);
_a1=_a5.cfg.getProperty("submenu");
if(_a1){
_a1.show();
}
_a5.focus();
}
}
}
_2f.preventDefault(_9e);
stopMouseEventHandlers();
break;
case 37:
if(_a3){
var _a9=_a3.parent;
if(_a9 instanceof YAHOO.widget.MenuBar){
_a5=_a9.activeItem.getPreviousEnabledSibling();
if(_a5){
_a9.clearActiveItem();
_a5.cfg.setProperty("selected",true);
_a1=_a5.cfg.getProperty("submenu");
if(_a1){
_a1.show();
}
_a5.focus();
}
}else{
this.hide();
_a3.focus();
}
}
_2f.preventDefault(_9e);
stopMouseEventHandlers();
break;
}
}
if(_9e.keyCode==27){
if(this.cfg.getProperty("position")=="dynamic"){
this.hide();
if(this.parent){
this.parent.focus();
}
}else{
if(this.activeItem){
_a1=this.activeItem.cfg.getProperty("submenu");
if(_a1&&_a1.cfg.getProperty("visible")){
_a1.hide();
this.activeItem.focus();
}else{
this.activeItem.cfg.setProperty("selected",false);
this.activeItem.blur();
}
}
}
_2f.preventDefault(_9e);
}
},_onKeyPress:function(_aa,_ab,_ac){
var _ad=_ab[0];
if(_ad.keyCode==40||_ad.keyCode==38){
YAHOO.util.Event.preventDefault(_ad);
}
},_onTextResize:function(_ae,_af,_b0){
if(this.browser=="gecko"&&!this._handleResize){
this._handleResize=true;
return;
}
var _b1=this.cfg;
if(_b1.getProperty("position")=="dynamic"){
_b1.setProperty("width",(this._getOffsetWidth()+"px"));
}
},_onScrollTargetMouseOver:function(_b2,_b3){
this._cancelHideDelay();
var _b4=_2f.getTarget(_b2),_b5=this.body,me=this,_b7,_b8;
function scrollBodyDown(){
var _b9=_b5.scrollTop;
if(_b9<_b7){
_b5.scrollTop=(_b9+1);
me._enableScrollHeader();
}else{
_b5.scrollTop=_b7;
window.clearInterval(me._nBodyScrollId);
me._disableScrollFooter();
}
}
function scrollBodyUp(){
var _ba=_b5.scrollTop;
if(_ba>0){
_b5.scrollTop=(_ba-1);
me._enableScrollFooter();
}else{
_b5.scrollTop=0;
window.clearInterval(me._nBodyScrollId);
me._disableScrollHeader();
}
}
if(Dom.hasClass(_b4,"hd")){
_b8=scrollBodyUp;
}else{
_b7=_b5.scrollHeight-_b5.offsetHeight;
_b8=scrollBodyDown;
}
this._nBodyScrollId=window.setInterval(_b8,10);
},_onScrollTargetMouseOut:function(_bb,_bc){
window.clearInterval(this._nBodyScrollId);
this._cancelHideDelay();
},_onInit:function(_bd,_be,_bf){
if(((this.parent&&!this.lazyLoad)||(!this.parent&&this.cfg.getProperty("position")=="static")||(!this.parent&&!this.lazyLoad&&this.cfg.getProperty("position")=="dynamic"))&&this.getItemGroups().length===0){
if(this.srcElement){
this._initSubTree();
}
if(this.itemData){
this.addItems(this.itemData);
}
}else{
if(this.lazyLoad){
this.cfg.fireQueue();
}
}
},_onBeforeRender:function(_c0,_c1,_c2){
var _c3=this.cfg,oEl=this.element,_c5=this._aListElements.length;
if(_c5>0){
var i=0,_c7=true,oUL,_c9;
do{
oUL=this._aListElements[i];
if(oUL){
if(_c7){
Dom.addClass(oUL,"first-of-type");
_c7=false;
}
if(!Dom.isAncestor(oEl,oUL)){
this.appendToBody(oUL);
}
_c9=this._aGroupTitleElements[i];
if(_c9){
if(!Dom.isAncestor(oEl,_c9)){
oUL.parentNode.insertBefore(_c9,oUL);
}
Dom.addClass(oUL,"hastitle");
}
}
i++;
}while(i<_c5);
}
},_onBeforeShow:function(_ca,_cb,_cc){
if(this.lazyLoad&&this.getItemGroups().length===0){
if(this.srcElement){
this._initSubTree();
}
if(this.itemData){
if(this.parent&&this.parent.parent&&this.parent.parent.srcElement&&this.parent.parent.srcElement.tagName.toUpperCase()=="SELECT"){
var _cd=this.itemData.length;
for(var n=0;n<_cd;n++){
if(this.itemData[n].tagName){
this.addItem((new this.ITEM_TYPE(this.itemData[n])));
}
}
}else{
this.addItems(this.itemData);
}
}
var _cf=this.srcElement;
if(_cf){
if(_cf.tagName.toUpperCase()=="SELECT"){
if(Dom.inDocument(_cf)){
this.render(_cf.parentNode);
}else{
this.render(this.cfg.getProperty("container"));
}
}else{
this.render();
}
}else{
if(this.parent){
this.render(this.parent.element);
}else{
this.render(this.cfg.getProperty("container"));
}
}
}
if(this.cfg.getProperty("position")=="dynamic"){
var _d0=Dom.getViewportHeight();
if(this.element.offsetHeight>=_d0){
var _d1=this.cfg.getProperty("maxheight");
this._nMaxHeight=_d1;
this.cfg.setProperty("maxheight",(_d0-20));
}
if(this.cfg.getProperty("maxheight")>0){
var _d2=this.body;
if(_d2.scrollTop>0){
_d2.scrollTop=0;
}
this._disableScrollHeader();
this._enableScrollFooter();
}
}
},_onShow:function(_d3,_d4,_d5){
this.setInitialFocus();
var _d6=this.parent;
if(_d6){
var _d7=_d6.parent,_d8=_d7.cfg.getProperty("submenualignment"),_d9=this.cfg.getProperty("submenualignment");
if((_d8[0]!=_d9[0])&&(_d8[1]!=_d9[1])){
this.cfg.setProperty("submenualignment",[_d8[0],_d8[1]]);
}
if(!_d7.cfg.getProperty("autosubmenudisplay")&&_d7.cfg.getProperty("position")=="static"){
_d7.cfg.setProperty("autosubmenudisplay",true);
function disableAutoSubmenuDisplay(_da){
if(_da.type=="mousedown"||(_da.type=="keydown"&&_da.keyCode==27)){
var _db=_2f.getTarget(_da);
if(_db!=_d7.element||!YAHOO.util.Dom.isAncestor(_d7.element,_db)){
_d7.cfg.setProperty("autosubmenudisplay",false);
_2f.removeListener(document,"mousedown",disableAutoSubmenuDisplay);
_2f.removeListener(document,"keydown",disableAutoSubmenuDisplay);
}
}
}
_2f.addListener(document,"mousedown",disableAutoSubmenuDisplay);
_2f.addListener(document,"keydown",disableAutoSubmenuDisplay);
}
}else{
if(!_d6&&this.lazyLoad){
this.cfg.refireEvent("xy");
}
}
},_onBeforeHide:function(_dc,_dd,_de){
var _df=this.activeItem;
if(_df){
var _e0=_df.cfg;
_e0.setProperty("selected",false);
var _e1=_e0.getProperty("submenu");
if(_e1){
_e1.hide();
}
_df.blur();
}
},_onHide:function(_e2,_e3,_e4){
if(this._nMaxHeight!=-1){
this.cfg.setProperty("maxheight",this._nMaxHeight);
this._nMaxHeight=-1;
}
},_onParentMenuConfigChange:function(_e5,_e6,_e7){
var _e8=_e6[0][0],_e9=_e6[0][1];
switch(_e8){
case "iframe":
case "constraintoviewport":
case "hidedelay":
case "showdelay":
case "submenuhidedelay":
case "clicktohide":
case "effect":
case "classname":
_e7.cfg.setProperty(_e8,_e9);
break;
}
},_onParentMenuRender:function(_ea,_eb,_ec){
var _ed=_ec.parent.parent,_ee={constraintoviewport:_ed.cfg.getProperty("constraintoviewport"),xy:[0,0],clicktohide:_ed.cfg.getProperty("clicktohide"),effect:_ed.cfg.getProperty("effect"),showdelay:_ed.cfg.getProperty("showdelay"),hidedelay:_ed.cfg.getProperty("hidedelay"),submenuhidedelay:_ed.cfg.getProperty("submenuhidedelay"),classname:_ed.cfg.getProperty("classname")};
if(this.cfg.getProperty("position")==_ed.cfg.getProperty("position")){
_ee.iframe=_ed.cfg.getProperty("iframe");
}
_ec.cfg.applyConfig(_ee);
if(!this.lazyLoad){
var oLI=this.parent.element;
if(this.element.parentNode==oLI){
this.render();
}else{
this.render(oLI);
}
}
},_onSubmenuBeforeShow:function(_f0,_f1,_f2){
var _f3=this.parent,_f4=_f3.parent.cfg.getProperty("submenualignment");
this.cfg.setProperty("context",[_f3.element,_f4[0],_f4[1]]);
var _f5=_f3.parent.body.scrollTop;
if((this.browser=="gecko"||this.browser=="safari")&&_f5>0){
this.cfg.setProperty("y",(this.cfg.getProperty("y")-_f5));
}
},_onSubmenuShow:function(_f6,_f7,_f8){
var _f9=this.parent;
_f9.submenuIndicator.firstChild.nodeValue=_f9.EXPANDED_SUBMENU_INDICATOR_TEXT;
},_onSubmenuHide:function(_fa,_fb,_fc){
var _fd=this.parent;
_fd.submenuIndicator.firstChild.nodeValue=_fd.COLLAPSED_SUBMENU_INDICATOR_TEXT;
},_onMenuItemFocus:function(_fe,_ff,_100){
this.activeItem=_100;
},_onMenuItemBlur:function(_101,_102){
this.activeItem=null;
},_onMenuItemConfigChange:function(_103,_104,_105){
var _106=_104[0][0];
switch(_106){
case "submenu":
var _107=_104[0][1];
if(_107){
this._configureSubmenu(_105);
}
break;
case "text":
case "helptext":
if(this.element.style.width){
var _108=this._getOffsetWidth()+"px";
Dom.setStyle(this.element,"width",_108);
}
break;
}
},enforceConstraints:function(type,args,obj){
var _10c=this.cfg,pos=args[0],x=pos[0],y=pos[1],_110=this.element.offsetHeight,_111=this.element.offsetWidth,_112=YAHOO.util.Dom.getViewportWidth(),_113=YAHOO.util.Dom.getViewportHeight(),_114=Math.max(document.documentElement.scrollLeft,document.body.scrollLeft),_115=Math.max(document.documentElement.scrollTop,document.body.scrollTop),_116=(this.parent&&this.parent.parent instanceof YAHOO.widget.MenuBar)?0:10,_117=_115+_116,_118=_114+_116,_119=_115+_113-_110-_116,_11a=_114+_112-_111-_116,_11b=_10c.getProperty("context"),_11c=_11b?_11b[0]:null;
if(x<10){
x=_118;
}else{
if((x+_111)>_112){
if(_11c&&((x-_11c.offsetWidth)>_111)){
x=(x-(_11c.offsetWidth+_111));
}else{
x=_11a;
}
}
}
if(y<10){
y=_117;
}else{
if(y>_119){
if(_11c&&(y>_110)){
y=((y+_11c.offsetHeight)-_110);
}else{
y=_119;
}
}
}
_10c.setProperty("x",x,true);
_10c.setProperty("y",y,true);
_10c.setProperty("xy",[x,y],true);
},configVisible:function(_11d,_11e,_11f){
if(this.cfg.getProperty("position")=="dynamic"){
YAHOO.widget.Menu.superclass.configVisible.call(this,_11d,_11e,_11f);
}else{
var _120=_11e[0],_121=Dom.getStyle(this.element,"display");
if(_120){
if(_121!="block"){
this.beforeShowEvent.fire();
Dom.setStyle(this.element,"display","block");
this.showEvent.fire();
}
}else{
if(_121=="block"){
this.beforeHideEvent.fire();
Dom.setStyle(this.element,"display","none");
this.hideEvent.fire();
}
}
}
},configPosition:function(_122,_123,_124){
var _125=_123[0]=="static"?"static":"absolute",oCfg=this.cfg;
Dom.setStyle(this.element,"position",_125);
if(_125=="static"){
oCfg.setProperty("iframe",false);
Dom.setStyle(this.element,"display","block");
oCfg.setProperty("visible",true);
}else{
Dom.setStyle(this.element,"visibility","hidden");
}
if(_125=="absolute"){
var _127=oCfg.getProperty("zindex");
if(!_127||_127===0){
_127=this.parent?(this.parent.parent.cfg.getProperty("zindex")+1):1;
oCfg.setProperty("zindex",_127);
}
}
},configIframe:function(_128,_129,_12a){
if(this.cfg.getProperty("position")=="dynamic"){
YAHOO.widget.Menu.superclass.configIframe.call(this,_128,_129,_12a);
}
},configHideDelay:function(_12b,_12c,_12d){
var _12e=_12c[0],_12f=this.mouseOutEvent,_130=this.mouseOverEvent,_131=this.keyDownEvent;
if(_12e>0){
if(!this._bHideDelayEventHandlersAssigned){
_12f.subscribe(this._execHideDelay,true);
_130.subscribe(this._cancelHideDelay,this,true);
_131.subscribe(this._cancelHideDelay,this,true);
this._bHideDelayEventHandlersAssigned=true;
}
}else{
_12f.unsubscribe(this._execHideDelay,this);
_130.unsubscribe(this._cancelHideDelay,this);
_131.unsubscribe(this._cancelHideDelay,this);
this._bHideDelayEventHandlersAssigned=false;
}
},configContainer:function(_132,_133,_134){
var _135=_133[0];
if(typeof _135=="string"){
this.cfg.setProperty("container",document.getElementById(_135),true);
}
},configMaxHeight:function(_136,_137,_138){
var _139=_137[0],_13a=this.body,_13b=this.header,_13c=this.footer,_13d=this._onScrollTargetMouseOver,_13e=this._onScrollTargetMouseOut;
if((_139>0)&&(_13a.offsetHeight>_139)){
if(!this.cfg.getProperty("width")){
this._setWidth();
}
if(!_13b&&!_13c){
this.setHeader("&#32;");
this.setFooter("&#32;");
_13b=this.header;
_13c=this.footer;
Dom.addClass(_13b,"topscrollbar");
Dom.addClass(_13c,"bottomscrollbar");
this.element.insertBefore(_13b,_13a);
this.element.appendChild(_13c);
_2f.addListener(_13b,"mouseover",_13d,this,true);
_2f.addListener(_13b,"mouseout",_13e,this,true);
_2f.addListener(_13c,"mouseover",_13d,this,true);
_2f.addListener(_13c,"mouseout",_13e,this,true);
}
var _13f=(_139-(this.footer.offsetHeight+this.header.offsetHeight));
Dom.setStyle(_13a,"height",(_13f+"px"));
Dom.setStyle(_13a,"overflow","hidden");
}else{
if(_13b&&_13c){
Dom.setStyle(_13a,"height","auto");
Dom.setStyle(_13a,"overflow","visible");
_2f.removeListener(_13b,"mouseover",_13d);
_2f.removeListener(_13b,"mouseout",_13e);
_2f.removeListener(_13c,"mouseover",_13d);
_2f.removeListener(_13c,"mouseout",_13e);
this.element.removeChild(_13b);
this.element.removeChild(_13c);
this.header=null;
this.footer=null;
}
}
},configClassName:function(_140,_141,_142){
var _143=_141[0];
if(this._sClassName){
Dom.removeClass(this.element,this._sClassName);
}
Dom.addClass(this.element,_143);
this._sClassName=_143;
},initEvents:function(){
YAHOO.widget.Menu.superclass.initEvents.call(this);
var _144=YAHOO.util.CustomEvent;
this.mouseOverEvent=new _144("mouseOverEvent",this);
this.mouseOutEvent=new _144("mouseOutEvent",this);
this.mouseDownEvent=new _144("mouseDownEvent",this);
this.mouseUpEvent=new _144("mouseUpEvent",this);
this.clickEvent=new _144("clickEvent",this);
this.keyPressEvent=new _144("keyPressEvent",this);
this.keyDownEvent=new _144("keyDownEvent",this);
this.keyUpEvent=new _144("keyUpEvent",this);
this.itemAddedEvent=new _144("itemAddedEvent",this);
this.itemRemovedEvent=new _144("itemRemovedEvent",this);
},getRoot:function(){
var _145=this.parent;
if(_145){
var _146=_145.parent;
return _146?_146.getRoot():this;
}else{
return this;
}
},toString:function(){
return ("Menu "+this.id);
},setItemGroupTitle:function(_147,_148){
if(typeof _147=="string"&&_147.length>0){
var _149=typeof _148=="number"?_148:0,_14a=this._aGroupTitleElements[_149];
if(_14a){
_14a.innerHTML=_147;
}else{
_14a=document.createElement(this.GROUP_TITLE_TAG_NAME);
_14a.innerHTML=_147;
this._aGroupTitleElements[_149]=_14a;
}
var i=this._aGroupTitleElements.length-1,_14c;
do{
if(this._aGroupTitleElements[i]){
Dom.removeClass(this._aGroupTitleElements[i],"first-of-type");
_14c=i;
}
}while(i--);
if(_14c!==null){
Dom.addClass(this._aGroupTitleElements[_14c],"first-of-type");
}
}
},addItem:function(_14d,_14e){
if(_14d){
return this._addItemToGroup(_14e,_14d);
}
},addItems:function(_14f,_150){
if(_30.isArray(_14f)){
var _151=_14f.length,_152=[],_153;
for(var i=0;i<_151;i++){
_153=_14f[i];
if(_153){
if(_30.isArray(_153)){
_152[_152.length]=this.addItems(_153,i);
}else{
_152[_152.length]=this._addItemToGroup(_150,_153);
}
}
}
if(_152.length){
return _152;
}
}
},insertItem:function(_155,_156,_157){
if(_155){
return this._addItemToGroup(_157,_155,_156);
}
},removeItem:function(_158,_159){
if(typeof _158!="undefined"){
var _15a;
if(_158 instanceof YAHOO.widget.MenuItem){
_15a=this._removeItemFromGroupByValue(_159,_158);
}else{
if(typeof _158=="number"){
_15a=this._removeItemFromGroupByIndex(_159,_158);
}
}
if(_15a){
_15a.destroy();
return _15a;
}
}
},getItems:function(){
var _15b=this._aItemGroups,_15c=_15b.length;
return ((_15c==1)?_15b[0]:(Array.prototype.concat.apply([],_15b)));
},getItemGroups:function(){
return this._aItemGroups;
},getItem:function(_15d,_15e){
if(typeof _15d=="number"){
var _15f=this._getItemGroup(_15e);
if(_15f){
return _15f[_15d];
}
}
},clearContent:function(){
var _160=this.getItems(),_161=_160.length,_162=this.element,_163=this.body,_164=this.header,_165=this.footer;
if(_161>0){
var i=_161-1,_167,_168;
do{
_167=_160[i];
if(_167){
_168=_167.cfg.getProperty("submenu");
if(_168){
this.cfg.configChangedEvent.unsubscribe(this._onParentMenuConfigChange,_168);
this.renderEvent.unsubscribe(this._onParentMenuRender,_168);
}
_167.destroy();
}
}while(i--);
}
if(_164){
_2f.purgeElement(_164);
_162.removeChild(_164);
}
if(_165){
_2f.purgeElement(_165);
_162.removeChild(_165);
}
if(_163){
_2f.purgeElement(_163);
_163.innerHTML="";
}
this._aItemGroups=[];
this._aListElements=[];
this._aGroupTitleElements=[];
},destroy:function(){
_2f.purgeElement(this.element);
this.mouseOverEvent.unsubscribeAll();
this.mouseOutEvent.unsubscribeAll();
this.mouseDownEvent.unsubscribeAll();
this.mouseUpEvent.unsubscribeAll();
this.clickEvent.unsubscribeAll();
this.keyPressEvent.unsubscribeAll();
this.keyDownEvent.unsubscribeAll();
this.keyUpEvent.unsubscribeAll();
this.itemAddedEvent.unsubscribeAll();
this.itemRemovedEvent.unsubscribeAll();
YAHOO.widget.Module.textResizeEvent.unsubscribe(this._onTextResize,this);
this.clearContent();
this._aItemGroups=null;
this._aListElements=null;
this._aGroupTitleElements=null;
YAHOO.widget.Menu.superclass.destroy.call(this);
},setInitialFocus:function(){
var _169=this._getFirstEnabledItem();
if(_169){
_169.focus();
}
},setInitialSelection:function(){
var _16a=this._getFirstEnabledItem();
if(_16a){
_16a.cfg.setProperty("selected",true);
}
},clearActiveItem:function(_16b){
if(this.cfg.getProperty("showdelay")>0){
this._cancelShowDelay();
}
var _16c=this.activeItem;
if(_16c){
var _16d=_16c.cfg;
_16d.setProperty("selected",false);
var _16e=_16d.getProperty("submenu");
if(_16e){
_16e.hide();
}
if(_16b){
_16c.blur();
}
}
},initDefaultConfig:function(){
YAHOO.widget.Menu.superclass.initDefaultConfig.call(this);
var _16f=this.cfg;
_16f.addProperty("visible",{value:false,handler:this.configVisible,validator:this.cfg.checkBoolean});
_16f.addProperty("constraintoviewport",{value:true,handler:this.configConstrainToViewport,validator:this.cfg.checkBoolean,supercedes:["iframe","x","y","xy"]});
_16f.addProperty("position",{value:"dynamic",handler:this.configPosition,validator:this._checkPosition,supercedes:["visible"]});
_16f.addProperty("submenualignment",{value:["tl","tr"]});
_16f.addProperty("autosubmenudisplay",{value:true,validator:_16f.checkBoolean});
_16f.addProperty("showdelay",{value:250,validator:_16f.checkNumber});
_16f.addProperty("hidedelay",{value:0,validator:_16f.checkNumber,handler:this.configHideDelay,suppressEvent:true});
_16f.addProperty("submenuhidedelay",{value:250,validator:_16f.checkNumber});
_16f.addProperty("clicktohide",{value:true,validator:_16f.checkBoolean});
_16f.addProperty("container",{value:document.body,handler:this.configContainer});
_16f.addProperty("maxheight",{value:0,validator:_16f.checkNumber,handler:this.configMaxHeight});
_16f.addProperty("classname",{value:null,handler:this.configClassName,validator:this._checkString});
}});
})();
(function(){
var Dom=YAHOO.util.Dom,_171=YAHOO.widget.Module,Menu=YAHOO.widget.Menu,_173=null,_174=null,_175=null;
YAHOO.widget.MenuItem=function(_176,_177){
if(_176){
if(_177){
this.parent=_177.parent;
this.value=_177.value;
this.id=_177.id;
}
this.init(_176,_177);
}
};
YAHOO.widget.MenuItem.prototype={SUBMENU_INDICATOR_IMAGE_PATH:"nt/ic/ut/alt1/menuarorght8_nrm_1.gif",SELECTED_SUBMENU_INDICATOR_IMAGE_PATH:"nt/ic/ut/alt1/menuarorght8_hov_1.gif",DISABLED_SUBMENU_INDICATOR_IMAGE_PATH:"nt/ic/ut/alt1/menuarorght8_dim_1.gif",COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT:"Collapsed.  Click to expand.",EXPANDED_SUBMENU_INDICATOR_ALT_TEXT:"Expanded.  Click to collapse.",DISABLED_SUBMENU_INDICATOR_ALT_TEXT:"Disabled.",COLLAPSED_SUBMENU_INDICATOR_TEXT:"Submenu collapsed.  Click to expand submenu.",EXPANDED_SUBMENU_INDICATOR_TEXT:"Submenu expanded.  Click to collapse submenu.",DISABLED_SUBMENU_INDICATOR_TEXT:"Submenu collapsed.  (Item disabled.)",CHECKED_IMAGE_PATH:"nt/ic/ut/bsc/menuchk8_nrm_1.gif",SELECTED_CHECKED_IMAGE_PATH:"nt/ic/ut/bsc/menuchk8_hov_1.gif",DISABLED_CHECKED_IMAGE_PATH:"nt/ic/ut/bsc/menuchk8_dim_1.gif",CHECKED_IMAGE_ALT_TEXT:"Checked.",DISABLED_CHECKED_IMAGE_ALT_TEXT:"Checked. (Item disabled.)",CHECKED_TEXT:"Menu item checked.",DISABLED_CHECKED_TEXT:"Checked. (Item disabled.)",CSS_CLASS_NAME:"yuimenuitem",SUBMENU_TYPE:null,IMG_ROOT:"http://us.i1.yimg.com/us.yimg.com/i/",IMG_ROOT_SSL:"https://a248.e.akamai.net/sec.yimg.com/i/",_oAnchor:null,_oText:null,_oHelpTextEM:null,_oSubmenu:null,_checkImage:null,_oCheckedIndicator:null,_oOnclickAttributeValue:null,_sClassName:null,constructor:YAHOO.widget.MenuItem,imageRoot:null,isSecure:_171.prototype.isSecure,index:null,groupIndex:null,parent:null,element:null,srcElement:null,value:null,submenuIndicator:null,browser:_171.prototype.browser,id:null,destroyEvent:null,mouseOverEvent:null,mouseOutEvent:null,mouseDownEvent:null,mouseUpEvent:null,clickEvent:null,keyPressEvent:null,keyDownEvent:null,keyUpEvent:null,focusEvent:null,blurEvent:null,init:function(_178,_179){
if(!this.SUBMENU_TYPE){
this.SUBMENU_TYPE=Menu;
}
this.cfg=new YAHOO.util.Config(this);
this.initDefaultConfig();
var _17a=this.cfg;
if(this._checkString(_178)){
this._createRootNodeStructure();
_17a.setProperty("text",_178);
}else{
if(this._checkDOMNode(_178)){
switch(_178.tagName.toUpperCase()){
case "OPTION":
this._createRootNodeStructure();
_17a.setProperty("text",_178.text);
this.srcElement=_178;
break;
case "OPTGROUP":
this._createRootNodeStructure();
_17a.setProperty("text",_178.label);
this.srcElement=_178;
this._initSubTree();
break;
case "LI":
var _17b=this._getFirstElement(_178,"A"),sURL="#",_17d,_17e;
if(_17b){
sURL=_17b.getAttribute("href");
_17d=_17b.getAttribute("target");
if(_17b.innerText){
_17e=_17b.innerText;
}else{
var _17f=_17b.ownerDocument.createRange();
_17f.selectNodeContents(_17b);
_17e=_17f.toString();
}
}else{
var _180=_178.firstChild;
_17e=_180.nodeValue;
_17b=document.createElement("a");
_17b.setAttribute("href",sURL);
_178.replaceChild(_17b,_180);
_17b.appendChild(_180);
}
this.srcElement=_178;
this.element=_178;
this._oAnchor=_17b;
var _181=this._getFirstElement(_17b),_182=false,_183=false;
if(_181){
this._oText=_181.firstChild;
switch(_181.tagName.toUpperCase()){
case "EM":
_182=true;
break;
case "STRONG":
_183=true;
break;
}
}else{
this._oText=_17b.firstChild;
}
_17a.setProperty("text",_17e,true);
_17a.setProperty("url",sURL,true);
_17a.setProperty("target",_17d,true);
_17a.setProperty("emphasis",_182,true);
_17a.setProperty("strongemphasis",_183,true);
this._initSubTree();
break;
}
}
}
if(this.element){
var sId=this.element.id;
if(!sId){
sId=this.id||Dom.generateId();
this.element.id=sId;
}
this.id=sId;
Dom.addClass(this.element,this.CSS_CLASS_NAME);
var _185=YAHOO.util.CustomEvent;
this.destroyEvent=new _185("destroyEvent",this);
this.mouseOverEvent=new _185("mouseOverEvent",this);
this.mouseOutEvent=new _185("mouseOutEvent",this);
this.mouseDownEvent=new _185("mouseDownEvent",this);
this.mouseUpEvent=new _185("mouseUpEvent",this);
this.clickEvent=new _185("clickEvent",this);
this.keyPressEvent=new _185("keyPressEvent",this);
this.keyDownEvent=new _185("keyDownEvent",this);
this.keyUpEvent=new _185("keyUpEvent",this);
this.focusEvent=new _185("focusEvent",this);
this.blurEvent=new _185("blurEvent",this);
if(_179){
_17a.applyConfig(_179);
}
_17a.fireQueue();
}
},_getFirstElement:function(_186,_187){
var _188=_186.firstChild,_189;
if(_188){
if(_188.nodeType==1){
_189=_188;
}else{
var _18a=_188.nextSibling;
if(_18a&&_18a.nodeType==1){
_189=_18a;
}
}
}
if(_187){
return (_189&&_189.tagName.toUpperCase()==_187)?_189:false;
}
return _189;
},_checkString:function(_18b){
return (typeof _18b=="string");
},_checkDOMNode:function(_18c){
return (_18c&&_18c.tagName);
},_createRootNodeStructure:function(){
if(!_173){
_173=document.createElement("li");
_173.innerHTML="<a href=\"#\">s</a>";
}
this.element=_173.cloneNode(true);
this._oAnchor=this.element.firstChild;
this._oText=this._oAnchor.firstChild;
this.element.appendChild(this._oAnchor);
},_initSubTree:function(){
var _18d=this.srcElement,_18e=this.cfg;
if(_18d.childNodes.length>0){
if(this.parent.lazyLoad&&this.parent.srcElement&&this.parent.srcElement.tagName.toUpperCase()=="SELECT"){
_18e.setProperty("submenu",{id:Dom.generateId(),itemdata:_18d.childNodes});
}else{
var _18f=_18d.firstChild,_190=[];
do{
if(_18f&&_18f.tagName){
switch(_18f.tagName.toUpperCase()){
case "DIV":
_18e.setProperty("submenu",_18f);
break;
case "OPTION":
_190[_190.length]=_18f;
break;
}
}
}while((_18f=_18f.nextSibling));
var _191=_190.length;
if(_191>0){
var _192=new this.SUBMENU_TYPE(Dom.generateId());
_18e.setProperty("submenu",_192);
for(var n=0;n<_191;n++){
_192.addItem((new _192.ITEM_TYPE(_190[n])));
}
}
}
}
},_preloadImage:function(_194){
var _195=this.imageRoot+_194;
if(!document.images[_195]){
var _196=document.createElement("img");
_196.src=_195;
_196.name=_195;
_196.id=_195;
_196.style.display="none";
document.body.appendChild(_196);
}
},configText:function(_197,_198,_199){
var _19a=_198[0];
if(this._oText){
this._oText.nodeValue=_19a;
}
},configHelpText:function(_19b,_19c,_19d){
var me=this,_19f=_19c[0],oEl=this.element,_1a1=this.cfg,_1a2=[oEl,this._oAnchor],_1a3=this.submenuIndicator;
function initHelpText(){
Dom.addClass(_1a2,"hashelptext");
if(_1a1.getProperty("disabled")){
_1a1.refireEvent("disabled");
}
if(_1a1.getProperty("selected")){
_1a1.refireEvent("selected");
}
}
function removeHelpText(){
Dom.removeClass(_1a2,"hashelptext");
oEl.removeChild(me._oHelpTextEM);
me._oHelpTextEM=null;
}
if(this._checkDOMNode(_19f)){
_19f.className="helptext";
if(this._oHelpTextEM){
this._oHelpTextEM.parentNode.replaceChild(_19f,this._oHelpTextEM);
}else{
this._oHelpTextEM=_19f;
oEl.insertBefore(this._oHelpTextEM,_1a3);
}
initHelpText();
}else{
if(this._checkString(_19f)){
if(_19f.length===0){
removeHelpText();
}else{
if(!this._oHelpTextEM){
this._oHelpTextEM=document.createElement("em");
this._oHelpTextEM.className="helptext";
oEl.insertBefore(this._oHelpTextEM,_1a3);
}
this._oHelpTextEM.innerHTML=_19f;
initHelpText();
}
}else{
if(!_19f&&this._oHelpTextEM){
removeHelpText();
}
}
}
},configURL:function(_1a4,_1a5,_1a6){
var sURL=_1a5[0];
if(!sURL){
sURL="#";
}
this._oAnchor.setAttribute("href",sURL);
},configTarget:function(_1a8,_1a9,_1aa){
var _1ab=_1a9[0],_1ac=this._oAnchor;
if(_1ab&&_1ab.length>0){
_1ac.setAttribute("target",_1ab);
}else{
_1ac.removeAttribute("target");
}
},configEmphasis:function(_1ad,_1ae,_1af){
var _1b0=_1ae[0],_1b1=this._oAnchor,_1b2=this._oText,_1b3=this.cfg,oEM;
if(_1b0&&_1b3.getProperty("strongemphasis")){
_1b3.setProperty("strongemphasis",false);
}
if(_1b1){
if(_1b0){
oEM=document.createElement("em");
oEM.appendChild(_1b2);
_1b1.appendChild(oEM);
}else{
oEM=this._getFirstElement(_1b1,"EM");
if(oEM){
_1b1.removeChild(oEM);
_1b1.appendChild(_1b2);
}
}
}
},configStrongEmphasis:function(_1b5,_1b6,_1b7){
var _1b8=_1b6[0],_1b9=this._oAnchor,_1ba=this._oText,_1bb=this.cfg,_1bc;
if(_1b8&&_1bb.getProperty("emphasis")){
_1bb.setProperty("emphasis",false);
}
if(_1b9){
if(_1b8){
_1bc=document.createElement("strong");
_1bc.appendChild(_1ba);
_1b9.appendChild(_1bc);
}else{
_1bc=this._getFirstElement(_1b9,"STRONG");
if(_1bc){
_1b9.removeChild(_1bc);
_1b9.appendChild(_1ba);
}
}
}
},configChecked:function(_1bd,_1be,_1bf){
var _1c0=_1be[0],oEl=this.element,_1c2=this.cfg,oEM;
if(_1c0){
if(!_175){
_175=document.createElement("em");
_175.innerHTML=this.CHECKED_TEXT;
_175.className="checkedindicator";
}
oEM=_175.cloneNode(true);
var _1c4=this.cfg.getProperty("submenu");
if(_1c4&&_1c4.element){
oEl.insertBefore(oEM,_1c4.element);
}else{
oEl.appendChild(oEM);
}
Dom.addClass(oEl,"checked");
this._oCheckedIndicator=oEM;
if(_1c2.getProperty("disabled")){
_1c2.refireEvent("disabled");
}
if(_1c2.getProperty("selected")){
_1c2.refireEvent("selected");
}
}else{
oEM=this._oCheckedIndicator;
Dom.removeClass(oEl,"checked");
if(oEM){
oEl.removeChild(oEM);
}
this._oCheckedIndicator=null;
}
},configDisabled:function(_1c5,_1c6,_1c7){
var _1c8=_1c6[0],_1c9=this.cfg,_1ca=this._oAnchor,_1cb=[this.element,_1ca],_1cc=this._oHelpTextEM,_1cd=this._oCheckedIndicator,_1ce=this.submenuIndicator,i=1;
if(_1cc){
i++;
_1cb[i]=_1cc;
}
if(_1cd){
_1cd.firstChild.nodeValue=_1c8?this.DISABLED_CHECKED_TEXT:this.CHECKED_TEXT;
i++;
_1cb[i]=_1cd;
}
if(_1ce){
_1ce.firstChild.nodeValue=_1c8?this.DISABLED_SUBMENU_INDICATOR_TEXT:this.COLLAPSED_SUBMENU_INDICATOR_TEXT;
i++;
_1cb[i]=_1ce;
}
if(_1c8){
if(_1c9.getProperty("selected")){
_1c9.setProperty("selected",false);
}
_1ca.removeAttribute("href");
Dom.addClass(_1cb,"disabled");
}else{
_1ca.setAttribute("href",_1c9.getProperty("url"));
Dom.removeClass(_1cb,"disabled");
}
},configSelected:function(_1d0,_1d1,_1d2){
if(!this.cfg.getProperty("disabled")){
var _1d3=_1d1[0],_1d4=this._oHelpTextEM,_1d5=this.submenuIndicator,_1d6=this._oCheckedIndicator,_1d7=[this.element,this._oAnchor],i=1;
if(_1d4){
i++;
_1d7[i]=_1d4;
}
if(_1d5){
i++;
_1d7[i]=_1d5;
}
if(_1d6){
i++;
_1d7[i]=_1d6;
}
if(_1d3){
Dom.addClass(_1d7,"selected");
}else{
Dom.removeClass(_1d7,"selected");
}
}
},configSubmenu:function(_1d9,_1da,_1db){
var oEl=this.element,_1dd=_1da[0],_1de=this.submenuIndicator,_1df=this.cfg,_1e0=[this.element,this._oAnchor],_1e1=this.parent&&this.parent.lazyLoad,_1e2;
if(_1dd){
if(_1dd instanceof Menu){
_1e2=_1dd;
_1e2.parent=this;
_1e2.lazyLoad=_1e1;
}else{
if(typeof _1dd=="object"&&_1dd.id&&!_1dd.nodeType){
var _1e3=_1dd.id,_1e4=_1dd;
_1e4.lazyload=_1e1;
_1e4.parent=this;
_1e2=new this.SUBMENU_TYPE(_1e3,_1e4);
this.cfg.setProperty("submenu",_1e2,true);
}else{
_1e2=new this.SUBMENU_TYPE(_1dd,{lazyload:_1e1,parent:this});
this.cfg.setProperty("submenu",_1e2,true);
}
}
if(_1e2){
this._oSubmenu=_1e2;
if(!_1de){
if(!_174){
_174=document.createElement("em");
_174.innerHTML=this.COLLAPSED_SUBMENU_INDICATOR_TEXT;
_174.className="submenuindicator";
}
_1de=_174.cloneNode(true);
if(_1e2.element.parentNode==oEl){
if(this.browser=="opera"){
oEl.appendChild(_1de);
_1e2.renderEvent.subscribe(function(){
_1de.parentNode.insertBefore(_1de,_1e2.element);
});
}else{
oEl.insertBefore(_1de,_1e2.element);
}
}else{
oEl.appendChild(_1de);
}
this.submenuIndicator=_1de;
}
Dom.addClass(_1e0,"hassubmenu");
if(_1df.getProperty("disabled")){
_1df.refireEvent("disabled");
}
if(_1df.getProperty("selected")){
_1df.refireEvent("selected");
}
}
}else{
Dom.removeClass(_1e0,"hassubmenu");
if(_1de){
oEl.removeChild(_1de);
}
if(this._oSubmenu){
this._oSubmenu.destroy();
}
}
},configOnClick:function(_1e5,_1e6,_1e7){
var _1e8=_1e6[0];
if(this._oOnclickAttributeValue&&(this._oOnclickAttributeValue!=_1e8)){
this.clickEvent.unsubscribe(this._oOnclickAttributeValue.fn,this._oOnclickAttributeValue.obj);
this._oOnclickAttributeValue=null;
}
if(!this._oOnclickAttributeValue&&typeof _1e8=="object"&&typeof _1e8.fn=="function"){
this.clickEvent.subscribe(_1e8.fn,(_1e8.obj||this),_1e8.scope);
this._oOnclickAttributeValue=_1e8;
}
},configClassName:function(_1e9,_1ea,_1eb){
var _1ec=_1ea[0];
if(this._sClassName){
Dom.removeClass(this.element,this._sClassName);
}
Dom.addClass(this.element,_1ec);
this._sClassName=_1ec;
},initDefaultConfig:function(){
var _1ed=this.cfg,_1ee=_1ed.checkBoolean;
_1ed.addProperty("text",{value:"",handler:this.configText,validator:this._checkString,suppressEvent:true});
_1ed.addProperty("helptext",{handler:this.configHelpText});
_1ed.addProperty("url",{value:"#",handler:this.configURL,suppressEvent:true});
_1ed.addProperty("target",{handler:this.configTarget,suppressEvent:true});
_1ed.addProperty("emphasis",{value:false,handler:this.configEmphasis,validator:_1ee,suppressEvent:true});
_1ed.addProperty("strongemphasis",{value:false,handler:this.configStrongEmphasis,validator:_1ee,suppressEvent:true});
_1ed.addProperty("checked",{value:false,handler:this.configChecked,validator:this.cfg.checkBoolean,suppressEvent:true,supercedes:["disabled"]});
_1ed.addProperty("disabled",{value:false,handler:this.configDisabled,validator:_1ee,suppressEvent:true});
_1ed.addProperty("selected",{value:false,handler:this.configSelected,validator:_1ee,suppressEvent:true});
_1ed.addProperty("submenu",{handler:this.configSubmenu});
_1ed.addProperty("onclick",{handler:this.configOnClick});
_1ed.addProperty("classname",{value:null,handler:this.configClassName,validator:this._checkString});
},getNextEnabledSibling:function(){
if(this.parent instanceof Menu){
var _1ef=this.groupIndex;
function getNextArrayItem(_1f0,_1f1){
return _1f0[_1f1]||getNextArrayItem(_1f0,(_1f1+1));
}
var _1f2=this.parent.getItemGroups(),_1f3;
if(this.index<(_1f2[_1ef].length-1)){
_1f3=getNextArrayItem(_1f2[_1ef],(this.index+1));
}else{
var _1f4;
if(_1ef<(_1f2.length-1)){
_1f4=_1ef+1;
}else{
_1f4=0;
}
var _1f5=getNextArrayItem(_1f2,_1f4);
_1f3=getNextArrayItem(_1f5,0);
}
return (_1f3.cfg.getProperty("disabled")||_1f3.element.style.display=="none")?_1f3.getNextEnabledSibling():_1f3;
}
},getPreviousEnabledSibling:function(){
if(this.parent instanceof Menu){
var _1f6=this.groupIndex;
function getPreviousArrayItem(_1f7,_1f8){
return _1f7[_1f8]||getPreviousArrayItem(_1f7,(_1f8-1));
}
function getFirstItemIndex(_1f9,_1fa){
return _1f9[_1fa]?_1fa:getFirstItemIndex(_1f9,(_1fa+1));
}
var _1fb=this.parent.getItemGroups(),_1fc;
if(this.index>getFirstItemIndex(_1fb[_1f6],0)){
_1fc=getPreviousArrayItem(_1fb[_1f6],(this.index-1));
}else{
var _1fd;
if(_1f6>getFirstItemIndex(_1fb,0)){
_1fd=_1f6-1;
}else{
_1fd=_1fb.length-1;
}
var _1fe=getPreviousArrayItem(_1fb,_1fd);
_1fc=getPreviousArrayItem(_1fe,(_1fe.length-1));
}
return (_1fc.cfg.getProperty("disabled")||_1fc.element.style.display=="none")?_1fc.getPreviousEnabledSibling():_1fc;
}
},focus:function(){
var _1ff=this.parent,_200=this._oAnchor,_201=_1ff.activeItem;
function setFocus(){
try{
_200.focus();
}
catch(e){
}
}
if(!this.cfg.getProperty("disabled")&&_1ff&&_1ff.cfg.getProperty("visible")&&this.element.style.display!="none"){
if(_201){
_201.blur();
}
window.setTimeout(setFocus,0);
this.focusEvent.fire();
}
},blur:function(){
var _202=this.parent;
if(!this.cfg.getProperty("disabled")&&_202&&Dom.getStyle(_202.element,"visibility")=="visible"){
this._oAnchor.blur();
this.blurEvent.fire();
}
},destroy:function(){
var oEl=this.element;
if(oEl){
var _204=this.cfg.getProperty("submenu");
if(_204){
_204.destroy();
}
this.mouseOverEvent.unsubscribeAll();
this.mouseOutEvent.unsubscribeAll();
this.mouseDownEvent.unsubscribeAll();
this.mouseUpEvent.unsubscribeAll();
this.clickEvent.unsubscribeAll();
this.keyPressEvent.unsubscribeAll();
this.keyDownEvent.unsubscribeAll();
this.keyUpEvent.unsubscribeAll();
this.focusEvent.unsubscribeAll();
this.blurEvent.unsubscribeAll();
this.cfg.configChangedEvent.unsubscribeAll();
var _205=oEl.parentNode;
if(_205){
_205.removeChild(oEl);
this.destroyEvent.fire();
}
this.destroyEvent.unsubscribeAll();
}
},toString:function(){
return ("MenuItem: "+this.cfg.getProperty("text"));
}};
})();
YAHOO.widget.ContextMenu=function(_206,_207){
YAHOO.widget.ContextMenu.superclass.constructor.call(this,_206,_207);
};
YAHOO.lang.extend(YAHOO.widget.ContextMenu,YAHOO.widget.Menu,{_oTrigger:null,_bCancelled:false,contextEventTarget:null,triggerContextMenuEvent:null,init:function(_208,_209){
if(!this.ITEM_TYPE){
this.ITEM_TYPE=YAHOO.widget.ContextMenuItem;
}
YAHOO.widget.ContextMenu.superclass.init.call(this,_208);
this.beforeInitEvent.fire(YAHOO.widget.ContextMenu);
if(_209){
this.cfg.applyConfig(_209,true);
}
this.initEvent.fire(YAHOO.widget.ContextMenu);
},initEvents:function(){
YAHOO.widget.ContextMenu.superclass.initEvents.call(this);
this.triggerContextMenuEvent=new YAHOO.util.CustomEvent("triggerContextMenuEvent",this);
},cancel:function(){
this._bCancelled=true;
},_removeEventHandlers:function(){
var _20a=YAHOO.util.Event,_20b=this._oTrigger,_20c=(this.browser=="opera");
_20a.removeListener(_20b,(_20c?"mousedown":"contextmenu"),this._onTriggerContextMenu);
if(_20c){
_20a.removeListener(_20b,"click",this._onTriggerClick);
}
},_onTriggerClick:function(_20d,_20e){
if(_20d.ctrlKey){
YAHOO.util.Event.stopEvent(_20d);
}
},_onTriggerContextMenu:function(_20f,_210){
var _211=YAHOO.util.Event;
if(_20f.type=="mousedown"&&!_20f.ctrlKey){
return;
}
_211.stopEvent(_20f);
YAHOO.widget.MenuManager.hideVisible();
this.contextEventTarget=_211.getTarget(_20f);
this.triggerContextMenuEvent.fire(_20f);
if(!this._bCancelled){
this.cfg.setProperty("xy",_211.getXY(_20f));
this.show();
}
this._bCancelled=false;
},toString:function(){
return ("ContextMenu "+this.id);
},initDefaultConfig:function(){
YAHOO.widget.ContextMenu.superclass.initDefaultConfig.call(this);
this.cfg.addProperty("trigger",{handler:this.configTrigger});
},destroy:function(){
this._removeEventHandlers();
YAHOO.widget.ContextMenu.superclass.destroy.call(this);
},configTrigger:function(_212,_213,_214){
var _215=YAHOO.util.Event,_216=_213[0];
if(_216){
if(this._oTrigger){
this._removeEventHandlers();
}
this._oTrigger=_216;
var _217=(this.browser=="opera");
_215.addListener(_216,(_217?"mousedown":"contextmenu"),this._onTriggerContextMenu,this,true);
if(_217){
_215.addListener(_216,"click",this._onTriggerClick,this,true);
}
}else{
this._removeEventHandlers();
}
}});
YAHOO.widget.ContextMenuItem=function(_218,_219){
YAHOO.widget.ContextMenuItem.superclass.constructor.call(this,_218,_219);
};
YAHOO.lang.extend(YAHOO.widget.ContextMenuItem,YAHOO.widget.MenuItem,{init:function(_21a,_21b){
if(!this.SUBMENU_TYPE){
this.SUBMENU_TYPE=YAHOO.widget.ContextMenu;
}
YAHOO.widget.ContextMenuItem.superclass.init.call(this,_21a);
var _21c=this.cfg;
if(_21b){
_21c.applyConfig(_21b,true);
}
_21c.fireQueue();
},toString:function(){
return ("ContextMenuItem: "+this.cfg.getProperty("text"));
}});
YAHOO.widget.MenuBar=function(_21d,_21e){
YAHOO.widget.MenuBar.superclass.constructor.call(this,_21d,_21e);
};
YAHOO.lang.extend(YAHOO.widget.MenuBar,YAHOO.widget.Menu,{init:function(_21f,_220){
if(!this.ITEM_TYPE){
this.ITEM_TYPE=YAHOO.widget.MenuBarItem;
}
YAHOO.widget.MenuBar.superclass.init.call(this,_21f);
this.beforeInitEvent.fire(YAHOO.widget.MenuBar);
if(_220){
this.cfg.applyConfig(_220,true);
}
this.initEvent.fire(YAHOO.widget.MenuBar);
},CSS_CLASS_NAME:"yuimenubar",_onKeyDown:function(_221,_222,_223){
var _224=YAHOO.util.Event,_225=_222[0],_226=_222[1],_227;
if(_226&&!_226.cfg.getProperty("disabled")){
var _228=_226.cfg;
switch(_225.keyCode){
case 37:
case 39:
if(_226==this.activeItem&&!_228.getProperty("selected")){
_228.setProperty("selected",true);
}else{
var _229=(_225.keyCode==37)?_226.getPreviousEnabledSibling():_226.getNextEnabledSibling();
if(_229){
this.clearActiveItem();
_229.cfg.setProperty("selected",true);
if(this.cfg.getProperty("autosubmenudisplay")){
_227=_229.cfg.getProperty("submenu");
if(_227){
_227.show();
_227.activeItem.blur();
_227.activeItem=null;
}
}
_229.focus();
}
}
_224.preventDefault(_225);
break;
case 40:
if(this.activeItem!=_226){
this.clearActiveItem();
_228.setProperty("selected",true);
_226.focus();
}
_227=_228.getProperty("submenu");
if(_227){
if(_227.cfg.getProperty("visible")){
_227.setInitialSelection();
_227.setInitialFocus();
}else{
_227.show();
}
}
_224.preventDefault(_225);
break;
}
}
if(_225.keyCode==27&&this.activeItem){
_227=this.activeItem.cfg.getProperty("submenu");
if(_227&&_227.cfg.getProperty("visible")){
_227.hide();
this.activeItem.focus();
}else{
this.activeItem.cfg.setProperty("selected",false);
this.activeItem.blur();
}
_224.preventDefault(_225);
}
},_onClick:function(_22a,_22b,_22c){
YAHOO.widget.MenuBar.superclass._onClick.call(this,_22a,_22b,_22c);
var _22d=_22b[1];
if(_22d&&!_22d.cfg.getProperty("disabled")){
var _22e=YAHOO.util.Event,Dom=YAHOO.util.Dom,_230=_22b[0],_231=_22e.getTarget(_230),_232=this.activeItem,_233=this.cfg;
if(_232&&_232!=_22d){
this.clearActiveItem();
}
_22d.cfg.setProperty("selected",true);
_22d.focus();
var _234=_22d.cfg.getProperty("submenu");
if(_234&&_231!=_22d.submenuIndicator){
if(_234.cfg.getProperty("visible")){
_234.hide();
}else{
_234.show();
}
}
}
},toString:function(){
return ("MenuBar "+this.id);
},initDefaultConfig:function(){
YAHOO.widget.MenuBar.superclass.initDefaultConfig.call(this);
var _235=this.cfg;
_235.addProperty("position",{value:"static",handler:this.configPosition,validator:this._checkPosition,supercedes:["visible"]});
_235.addProperty("submenualignment",{value:["tl","bl"]});
_235.addProperty("autosubmenudisplay",{value:false,validator:_235.checkBoolean});
}});
YAHOO.widget.MenuBarItem=function(_236,_237){
YAHOO.widget.MenuBarItem.superclass.constructor.call(this,_236,_237);
};
YAHOO.lang.extend(YAHOO.widget.MenuBarItem,YAHOO.widget.MenuItem,{init:function(_238,_239){
if(!this.SUBMENU_TYPE){
this.SUBMENU_TYPE=YAHOO.widget.Menu;
}
YAHOO.widget.MenuBarItem.superclass.init.call(this,_238);
var _23a=this.cfg;
if(_239){
_23a.applyConfig(_239,true);
}
_23a.fireQueue();
},CSS_CLASS_NAME:"yuimenubaritem",toString:function(){
return ("MenuBarItem: "+this.cfg.getProperty("text"));
}});
YAHOO.register("menu",YAHOO.widget.Menu,{version:"2.2.0",build:"127"});


YAHOO.util.Config=function(_1){
if(_1){
this.init(_1);
}
};
YAHOO.util.Config.prototype={owner:null,queueInProgress:false,checkBoolean:function(_2){
if(typeof _2=="boolean"){
return true;
}else{
return false;
}
},checkNumber:function(_3){
if(isNaN(_3)){
return false;
}else{
return true;
}
}};
YAHOO.util.Config.prototype.init=function(_4){
this.owner=_4;
this.configChangedEvent=new YAHOO.util.CustomEvent("configChanged");
this.queueInProgress=false;
var _5={};
var _6={};
var _7=[];
var _8=function(_9,_a){
_9=_9.toLowerCase();
var _b=_5[_9];
if(typeof _b!="undefined"&&_b.event){
_b.event.fire(_a);
}
};
this.addProperty=function(_c,_d){
_c=_c.toLowerCase();
_5[_c]=_d;
_d.event=new YAHOO.util.CustomEvent(_c);
_d.key=_c;
if(_d.handler){
_d.event.subscribe(_d.handler,this.owner,true);
}
this.setProperty(_c,_d.value,true);
if(!_d.suppressEvent){
this.queueProperty(_c,_d.value);
}
};
this.getConfig=function(){
var _e={};
for(var _f in _5){
var _10=_5[_f];
if(typeof _10!="undefined"&&_10.event){
_e[_f]=_10.value;
}
}
return _e;
};
this.getProperty=function(key){
key=key.toLowerCase();
var _12=_5[key];
if(typeof _12!="undefined"&&_12.event){
return _12.value;
}else{
return undefined;
}
};
this.resetProperty=function(key){
key=key.toLowerCase();
var _14=_5[key];
if(typeof _14!="undefined"&&_14.event){
if(_6[key]&&_6[key]!="undefined"){
this.setProperty(key,_6[key]);
}
return true;
}else{
return false;
}
};
this.setProperty=function(key,_16,_17){
key=key.toLowerCase();
if(this.queueInProgress&&!_17){
this.queueProperty(key,_16);
return true;
}else{
var _18=_5[key];
if(typeof _18!="undefined"&&_18.event){
if(_18.validator&&!_18.validator(_16)){
return false;
}else{
_18.value=_16;
if(!_17){
_8(key,_16);
this.configChangedEvent.fire([key,_16]);
}
return true;
}
}else{
return false;
}
}
};
this.queueProperty=function(key,_1a){
key=key.toLowerCase();
var _1b=_5[key];
if(typeof _1b!="undefined"&&_1b.event){
if(typeof _1a!="undefined"&&_1b.validator&&!_1b.validator(_1a)){
return false;
}else{
if(typeof _1a!="undefined"){
_1b.value=_1a;
}else{
_1a=_1b.value;
}
var _1c=false;
for(var i=0;i<_7.length;i++){
var _1e=_7[i];
if(_1e){
var _1f=_1e[0];
var _20=_1e[1];
if(_1f.toLowerCase()==key){
_7[i]=null;
_7.push([key,(typeof _1a!="undefined"?_1a:_20)]);
_1c=true;
break;
}
}
}
if(!_1c&&typeof _1a!="undefined"){
_7.push([key,_1a]);
}
}
if(_1b.supercedes){
for(var s=0;s<_1b.supercedes.length;s++){
var _22=_1b.supercedes[s];
for(var q=0;q<_7.length;q++){
var _24=_7[q];
if(_24){
var _25=_24[0];
var _26=_24[1];
if(_25.toLowerCase()==_22.toLowerCase()){
_7.push([_25,_26]);
_7[q]=null;
break;
}
}
}
}
}
return true;
}else{
return false;
}
};
this.refireEvent=function(key){
key=key.toLowerCase();
var _28=_5[key];
if(typeof _28!="undefined"&&_28.event&&typeof _28.value!="undefined"){
if(this.queueInProgress){
this.queueProperty(key);
}else{
_8(key,_28.value);
}
}
};
this.applyConfig=function(_29,_2a){
if(_2a){
_6=_29;
}
for(var _2b in _29){
this.queueProperty(_2b,_29[_2b]);
}
};
this.refresh=function(){
for(var _2c in _5){
this.refireEvent(_2c);
}
};
this.fireQueue=function(){
this.queueInProgress=true;
for(var i=0;i<_7.length;i++){
var _2e=_7[i];
if(_2e){
var key=_2e[0];
var _30=_2e[1];
var _31=_5[key];
_31.value=_30;
_8(key,_30);
}
}
this.queueInProgress=false;
_7=[];
};
this.subscribeToConfigEvent=function(key,_33,obj,_35){
key=key.toLowerCase();
var _36=_5[key];
if(typeof _36!="undefined"&&_36.event){
if(!YAHOO.util.Config.alreadySubscribed(_36.event,_33,obj)){
_36.event.subscribe(_33,obj,_35);
}
return true;
}else{
return false;
}
};
this.unsubscribeFromConfigEvent=function(key,_38,obj){
key=key.toLowerCase();
var _3a=_5[key];
if(typeof _3a!="undefined"&&_3a.event){
return _3a.event.unsubscribe(_38,obj);
}else{
return false;
}
};
this.toString=function(){
var _3b="Config";
if(this.owner){
_3b+=" ["+this.owner.toString()+"]";
}
return _3b;
};
this.outputEventQueue=function(){
var _3c="";
for(var q=0;q<_7.length;q++){
var _3e=_7[q];
if(_3e){
_3c+=_3e[0]+"="+_3e[1]+", ";
}
}
return _3c;
};
};
YAHOO.util.Config.alreadySubscribed=function(evt,fn,obj){
for(var e=0;e<evt.subscribers.length;e++){
var _43=evt.subscribers[e];
if(_43&&_43.obj==obj&&_43.fn==fn){
return true;
}
}
return false;
};
YAHOO.widget.Module=function(el,_45){
if(el){
this.init(el,_45);
}else{
}
};
YAHOO.widget.Module.IMG_ROOT=null;
YAHOO.widget.Module.IMG_ROOT_SSL=null;
YAHOO.widget.Module.CSS_MODULE="module";
YAHOO.widget.Module.CSS_HEADER="hd";
YAHOO.widget.Module.CSS_BODY="bd";
YAHOO.widget.Module.CSS_FOOTER="ft";
YAHOO.widget.Module.RESIZE_MONITOR_SECURE_URL="javascript:false;";
YAHOO.widget.Module.textResizeEvent=new YAHOO.util.CustomEvent("textResize");
YAHOO.widget.Module.prototype={constructor:YAHOO.widget.Module,element:null,header:null,body:null,footer:null,id:null,imageRoot:YAHOO.widget.Module.IMG_ROOT,initEvents:function(){
this.beforeInitEvent=new YAHOO.util.CustomEvent("beforeInit");
this.initEvent=new YAHOO.util.CustomEvent("init");
this.appendEvent=new YAHOO.util.CustomEvent("append");
this.beforeRenderEvent=new YAHOO.util.CustomEvent("beforeRender");
this.renderEvent=new YAHOO.util.CustomEvent("render");
this.changeHeaderEvent=new YAHOO.util.CustomEvent("changeHeader");
this.changeBodyEvent=new YAHOO.util.CustomEvent("changeBody");
this.changeFooterEvent=new YAHOO.util.CustomEvent("changeFooter");
this.changeContentEvent=new YAHOO.util.CustomEvent("changeContent");
this.destroyEvent=new YAHOO.util.CustomEvent("destroy");
this.beforeShowEvent=new YAHOO.util.CustomEvent("beforeShow");
this.showEvent=new YAHOO.util.CustomEvent("show");
this.beforeHideEvent=new YAHOO.util.CustomEvent("beforeHide");
this.hideEvent=new YAHOO.util.CustomEvent("hide");
},platform:function(){
var ua=navigator.userAgent.toLowerCase();
if(ua.indexOf("windows")!=-1||ua.indexOf("win32")!=-1){
return "windows";
}else{
if(ua.indexOf("macintosh")!=-1){
return "mac";
}else{
return false;
}
}
}(),browser:function(){
var ua=navigator.userAgent.toLowerCase();
if(ua.indexOf("opera")!=-1){
return "opera";
}else{
if(ua.indexOf("msie 7")!=-1){
return "ie7";
}else{
if(ua.indexOf("msie")!=-1){
return "ie";
}else{
if(ua.indexOf("safari")!=-1){
return "safari";
}else{
if(ua.indexOf("gecko")!=-1){
return "gecko";
}else{
return false;
}
}
}
}
}
}(),isSecure:function(){
if(window.location.href.toLowerCase().indexOf("https")===0){
return true;
}else{
return false;
}
}(),initDefaultConfig:function(){
this.cfg.addProperty("visible",{value:true,handler:this.configVisible,validator:this.cfg.checkBoolean});
this.cfg.addProperty("effect",{suppressEvent:true,supercedes:["visible"]});
this.cfg.addProperty("monitorresize",{value:true,handler:this.configMonitorResize});
},init:function(el,_49){
this.initEvents();
this.beforeInitEvent.fire(YAHOO.widget.Module);
this.cfg=new YAHOO.util.Config(this);
if(this.isSecure){
this.imageRoot=YAHOO.widget.Module.IMG_ROOT_SSL;
}
if(typeof el=="string"){
var _4a=el;
el=document.getElementById(el);
if(!el){
el=document.createElement("div");
el.id=_4a;
}
}
this.element=el;
if(el.id){
this.id=el.id;
}
var _4b=this.element.childNodes;
if(_4b){
for(var i=0;i<_4b.length;i++){
var _4d=_4b[i];
switch(_4d.className){
case YAHOO.widget.Module.CSS_HEADER:
this.header=_4d;
break;
case YAHOO.widget.Module.CSS_BODY:
this.body=_4d;
break;
case YAHOO.widget.Module.CSS_FOOTER:
this.footer=_4d;
break;
}
}
}
this.initDefaultConfig();
YAHOO.util.Dom.addClass(this.element,YAHOO.widget.Module.CSS_MODULE);
if(_49){
this.cfg.applyConfig(_49,true);
}
if(!YAHOO.util.Config.alreadySubscribed(this.renderEvent,this.cfg.fireQueue,this.cfg)){
this.renderEvent.subscribe(this.cfg.fireQueue,this.cfg,true);
}
this.initEvent.fire(YAHOO.widget.Module);
},initResizeMonitor:function(){
if(this.browser!="opera"){
var _4e=document.getElementById("_yuiResizeMonitor");
if(!_4e){
_4e=document.createElement("iframe");
var bIE=(this.browser.indexOf("ie")===0);
if(this.isSecure&&YAHOO.widget.Module.RESIZE_MONITOR_SECURE_URL&&bIE){
_4e.src=YAHOO.widget.Module.RESIZE_MONITOR_SECURE_URL;
}
_4e.id="_yuiResizeMonitor";
_4e.style.visibility="hidden";
document.body.appendChild(_4e);
_4e.style.width="10em";
_4e.style.height="10em";
_4e.style.position="absolute";
var _50=-1*_4e.offsetWidth;
var _51=-1*_4e.offsetHeight;
_4e.style.top=_51+"px";
_4e.style.left=_50+"px";
_4e.style.borderStyle="none";
_4e.style.borderWidth="0";
YAHOO.util.Dom.setStyle(_4e,"opacity","0");
_4e.style.visibility="visible";
if(!bIE){
var doc=_4e.contentWindow.document;
doc.open();
doc.close();
}
}
var _53=function(){
YAHOO.widget.Module.textResizeEvent.fire();
};
if(_4e&&_4e.contentWindow){
this.resizeMonitor=_4e;
YAHOO.widget.Module.textResizeEvent.subscribe(this.onDomResize,this,true);
if(!YAHOO.widget.Module.textResizeInitialized){
if(!YAHOO.util.Event.addListener(this.resizeMonitor.contentWindow,"resize",_53)){
YAHOO.util.Event.addListener(this.resizeMonitor,"resize",_53);
}
YAHOO.widget.Module.textResizeInitialized=true;
}
}
}
},onDomResize:function(e,obj){
var _56=-1*this.resizeMonitor.offsetWidth,_57=-1*this.resizeMonitor.offsetHeight;
this.resizeMonitor.style.top=_57+"px";
this.resizeMonitor.style.left=_56+"px";
},setHeader:function(_58){
if(!this.header){
this.header=document.createElement("div");
this.header.className=YAHOO.widget.Module.CSS_HEADER;
}
if(typeof _58=="string"){
this.header.innerHTML=_58;
}else{
this.header.innerHTML="";
this.header.appendChild(_58);
}
this.changeHeaderEvent.fire(_58);
this.changeContentEvent.fire();
},appendToHeader:function(_59){
if(!this.header){
this.header=document.createElement("div");
this.header.className=YAHOO.widget.Module.CSS_HEADER;
}
this.header.appendChild(_59);
this.changeHeaderEvent.fire(_59);
this.changeContentEvent.fire();
},setBody:function(_5a){
if(!this.body){
this.body=document.createElement("div");
this.body.className=YAHOO.widget.Module.CSS_BODY;
}
if(typeof _5a=="string"){
this.body.innerHTML=_5a;
}else{
this.body.innerHTML="";
this.body.appendChild(_5a);
}
this.changeBodyEvent.fire(_5a);
this.changeContentEvent.fire();
},appendToBody:function(_5b){
if(!this.body){
this.body=document.createElement("div");
this.body.className=YAHOO.widget.Module.CSS_BODY;
}
this.body.appendChild(_5b);
this.changeBodyEvent.fire(_5b);
this.changeContentEvent.fire();
},setFooter:function(_5c){
if(!this.footer){
this.footer=document.createElement("div");
this.footer.className=YAHOO.widget.Module.CSS_FOOTER;
}
if(typeof _5c=="string"){
this.footer.innerHTML=_5c;
}else{
this.footer.innerHTML="";
this.footer.appendChild(_5c);
}
this.changeFooterEvent.fire(_5c);
this.changeContentEvent.fire();
},appendToFooter:function(_5d){
if(!this.footer){
this.footer=document.createElement("div");
this.footer.className=YAHOO.widget.Module.CSS_FOOTER;
}
this.footer.appendChild(_5d);
this.changeFooterEvent.fire(_5d);
this.changeContentEvent.fire();
},render:function(_5e,_5f){
this.beforeRenderEvent.fire();
if(!_5f){
_5f=this.element;
}
var me=this;
var _61=function(_62){
if(typeof _62=="string"){
_62=document.getElementById(_62);
}
if(_62){
_62.appendChild(me.element);
me.appendEvent.fire();
}
};
if(_5e){
_61(_5e);
}else{
if(!YAHOO.util.Dom.inDocument(this.element)){
return false;
}
}
if(this.header&&!YAHOO.util.Dom.inDocument(this.header)){
var _63=_5f.firstChild;
if(_63){
_5f.insertBefore(this.header,_63);
}else{
_5f.appendChild(this.header);
}
}
if(this.body&&!YAHOO.util.Dom.inDocument(this.body)){
if(this.footer&&YAHOO.util.Dom.isAncestor(this.moduleElement,this.footer)){
_5f.insertBefore(this.body,this.footer);
}else{
_5f.appendChild(this.body);
}
}
if(this.footer&&!YAHOO.util.Dom.inDocument(this.footer)){
_5f.appendChild(this.footer);
}
this.renderEvent.fire();
return true;
},destroy:function(){
var _64;
if(this.element){
YAHOO.util.Event.purgeElement(this.element,true);
_64=this.element.parentNode;
}
if(_64){
_64.removeChild(this.element);
}
this.element=null;
this.header=null;
this.body=null;
this.footer=null;
for(var e in this){
if(e instanceof YAHOO.util.CustomEvent){
e.unsubscribeAll();
}
}
YAHOO.widget.Module.textResizeEvent.unsubscribe(this.onDomResize,this);
this.destroyEvent.fire();
},show:function(){
this.cfg.setProperty("visible",true);
},hide:function(){
this.cfg.setProperty("visible",false);
},configVisible:function(_66,_67,obj){
var _69=_67[0];
if(_69){
this.beforeShowEvent.fire();
YAHOO.util.Dom.setStyle(this.element,"display","block");
this.showEvent.fire();
}else{
this.beforeHideEvent.fire();
YAHOO.util.Dom.setStyle(this.element,"display","none");
this.hideEvent.fire();
}
},configMonitorResize:function(_6a,_6b,obj){
var _6d=_6b[0];
if(_6d){
this.initResizeMonitor();
}else{
YAHOO.widget.Module.textResizeEvent.unsubscribe(this.onDomResize,this,true);
this.resizeMonitor=null;
}
}};
YAHOO.widget.Module.prototype.toString=function(){
return "Module "+this.id;
};
YAHOO.widget.Overlay=function(el,_6f){
YAHOO.widget.Overlay.superclass.constructor.call(this,el,_6f);
};
YAHOO.extend(YAHOO.widget.Overlay,YAHOO.widget.Module);
YAHOO.widget.Overlay.IFRAME_SRC="javascript:false;";
YAHOO.widget.Overlay.TOP_LEFT="tl";
YAHOO.widget.Overlay.TOP_RIGHT="tr";
YAHOO.widget.Overlay.BOTTOM_LEFT="bl";
YAHOO.widget.Overlay.BOTTOM_RIGHT="br";
YAHOO.widget.Overlay.CSS_OVERLAY="yui-overlay";
YAHOO.widget.Overlay.prototype.init=function(el,_71){
YAHOO.widget.Overlay.superclass.init.call(this,el);
this.beforeInitEvent.fire(YAHOO.widget.Overlay);
YAHOO.util.Dom.addClass(this.element,YAHOO.widget.Overlay.CSS_OVERLAY);
if(_71){
this.cfg.applyConfig(_71,true);
}
if(this.platform=="mac"&&this.browser=="gecko"){
if(!YAHOO.util.Config.alreadySubscribed(this.showEvent,this.showMacGeckoScrollbars,this)){
this.showEvent.subscribe(this.showMacGeckoScrollbars,this,true);
}
if(!YAHOO.util.Config.alreadySubscribed(this.hideEvent,this.hideMacGeckoScrollbars,this)){
this.hideEvent.subscribe(this.hideMacGeckoScrollbars,this,true);
}
}
this.initEvent.fire(YAHOO.widget.Overlay);
};
YAHOO.widget.Overlay.prototype.initEvents=function(){
YAHOO.widget.Overlay.superclass.initEvents.call(this);
this.beforeMoveEvent=new YAHOO.util.CustomEvent("beforeMove",this);
this.moveEvent=new YAHOO.util.CustomEvent("move",this);
};
YAHOO.widget.Overlay.prototype.initDefaultConfig=function(){
YAHOO.widget.Overlay.superclass.initDefaultConfig.call(this);
this.cfg.addProperty("x",{handler:this.configX,validator:this.cfg.checkNumber,suppressEvent:true,supercedes:["iframe"]});
this.cfg.addProperty("y",{handler:this.configY,validator:this.cfg.checkNumber,suppressEvent:true,supercedes:["iframe"]});
this.cfg.addProperty("xy",{handler:this.configXY,suppressEvent:true,supercedes:["iframe"]});
this.cfg.addProperty("context",{handler:this.configContext,suppressEvent:true,supercedes:["iframe"]});
this.cfg.addProperty("fixedcenter",{value:false,handler:this.configFixedCenter,validator:this.cfg.checkBoolean,supercedes:["iframe","visible"]});
this.cfg.addProperty("width",{handler:this.configWidth,suppressEvent:true,supercedes:["iframe"]});
this.cfg.addProperty("height",{handler:this.configHeight,suppressEvent:true,supercedes:["iframe"]});
this.cfg.addProperty("zIndex",{value:null,handler:this.configzIndex});
this.cfg.addProperty("constraintoviewport",{value:false,handler:this.configConstrainToViewport,validator:this.cfg.checkBoolean,supercedes:["iframe","x","y","xy"]});
this.cfg.addProperty("iframe",{value:(this.browser=="ie"?true:false),handler:this.configIframe,validator:this.cfg.checkBoolean,supercedes:["zIndex"]});
};
YAHOO.widget.Overlay.prototype.moveTo=function(x,y){
this.cfg.setProperty("xy",[x,y]);
};
YAHOO.widget.Overlay.prototype.hideMacGeckoScrollbars=function(){
YAHOO.util.Dom.removeClass(this.element,"show-scrollbars");
YAHOO.util.Dom.addClass(this.element,"hide-scrollbars");
};
YAHOO.widget.Overlay.prototype.showMacGeckoScrollbars=function(){
YAHOO.util.Dom.removeClass(this.element,"hide-scrollbars");
YAHOO.util.Dom.addClass(this.element,"show-scrollbars");
};
YAHOO.widget.Overlay.prototype.configVisible=function(_74,_75,obj){
var _77=_75[0];
var _78=YAHOO.util.Dom.getStyle(this.element,"visibility");
if(_78=="inherit"){
var e=this.element.parentNode;
while(e.nodeType!=9&&e.nodeType!=11){
_78=YAHOO.util.Dom.getStyle(e,"visibility");
if(_78!="inherit"){
break;
}
e=e.parentNode;
}
if(_78=="inherit"){
_78="visible";
}
}
var _7a=this.cfg.getProperty("effect");
var _7b=[];
if(_7a){
if(_7a instanceof Array){
for(var i=0;i<_7a.length;i++){
var eff=_7a[i];
_7b[_7b.length]=eff.effect(this,eff.duration);
}
}else{
_7b[_7b.length]=_7a.effect(this,_7a.duration);
}
}
var _7e=(this.platform=="mac"&&this.browser=="gecko");
if(_77){
if(_7e){
this.showMacGeckoScrollbars();
}
if(_7a){
if(_77){
if(_78!="visible"||_78===""){
this.beforeShowEvent.fire();
for(var j=0;j<_7b.length;j++){
var ei=_7b[j];
if(j===0&&!YAHOO.util.Config.alreadySubscribed(ei.animateInCompleteEvent,this.showEvent.fire,this.showEvent)){
ei.animateInCompleteEvent.subscribe(this.showEvent.fire,this.showEvent,true);
}
ei.animateIn();
}
}
}
}else{
if(_78!="visible"||_78===""){
this.beforeShowEvent.fire();
YAHOO.util.Dom.setStyle(this.element,"visibility","visible");
this.cfg.refireEvent("iframe");
this.showEvent.fire();
}
}
}else{
if(_7e){
this.hideMacGeckoScrollbars();
}
if(_7a){
if(_78=="visible"){
this.beforeHideEvent.fire();
for(var k=0;k<_7b.length;k++){
var h=_7b[k];
if(k===0&&!YAHOO.util.Config.alreadySubscribed(h.animateOutCompleteEvent,this.hideEvent.fire,this.hideEvent)){
h.animateOutCompleteEvent.subscribe(this.hideEvent.fire,this.hideEvent,true);
}
h.animateOut();
}
}else{
if(_78===""){
YAHOO.util.Dom.setStyle(this.element,"visibility","hidden");
}
}
}else{
if(_78=="visible"||_78===""){
this.beforeHideEvent.fire();
YAHOO.util.Dom.setStyle(this.element,"visibility","hidden");
this.cfg.refireEvent("iframe");
this.hideEvent.fire();
}
}
}
};
YAHOO.widget.Overlay.prototype.doCenterOnDOMEvent=function(){
if(this.cfg.getProperty("visible")){
this.center();
}
};
YAHOO.widget.Overlay.prototype.configFixedCenter=function(_83,_84,obj){
var val=_84[0];
if(val){
this.center();
if(!YAHOO.util.Config.alreadySubscribed(this.beforeShowEvent,this.center,this)){
this.beforeShowEvent.subscribe(this.center,this,true);
}
if(!YAHOO.util.Config.alreadySubscribed(YAHOO.widget.Overlay.windowResizeEvent,this.doCenterOnDOMEvent,this)){
YAHOO.widget.Overlay.windowResizeEvent.subscribe(this.doCenterOnDOMEvent,this,true);
}
if(!YAHOO.util.Config.alreadySubscribed(YAHOO.widget.Overlay.windowScrollEvent,this.doCenterOnDOMEvent,this)){
YAHOO.widget.Overlay.windowScrollEvent.subscribe(this.doCenterOnDOMEvent,this,true);
}
}else{
YAHOO.widget.Overlay.windowResizeEvent.unsubscribe(this.doCenterOnDOMEvent,this);
YAHOO.widget.Overlay.windowScrollEvent.unsubscribe(this.doCenterOnDOMEvent,this);
}
};
YAHOO.widget.Overlay.prototype.configHeight=function(_87,_88,obj){
var _8a=_88[0];
var el=this.element;
YAHOO.util.Dom.setStyle(el,"height",_8a);
this.cfg.refireEvent("iframe");
};
YAHOO.widget.Overlay.prototype.configWidth=function(_8c,_8d,obj){
var _8f=_8d[0];
var el=this.element;
YAHOO.util.Dom.setStyle(el,"width",_8f);
this.cfg.refireEvent("iframe");
};
YAHOO.widget.Overlay.prototype.configzIndex=function(_91,_92,obj){
var _94=_92[0];
var el=this.element;
if(!_94){
_94=YAHOO.util.Dom.getStyle(el,"zIndex");
if(!_94||isNaN(_94)){
_94=0;
}
}
if(this.iframe){
if(_94<=0){
_94=1;
}
YAHOO.util.Dom.setStyle(this.iframe,"zIndex",(_94-1));
}
YAHOO.util.Dom.setStyle(el,"zIndex",_94);
this.cfg.setProperty("zIndex",_94,true);
};
YAHOO.widget.Overlay.prototype.configXY=function(_96,_97,obj){
var pos=_97[0];
var x=pos[0];
var y=pos[1];
this.cfg.setProperty("x",x);
this.cfg.setProperty("y",y);
this.beforeMoveEvent.fire([x,y]);
x=this.cfg.getProperty("x");
y=this.cfg.getProperty("y");
this.cfg.refireEvent("iframe");
this.moveEvent.fire([x,y]);
};
YAHOO.widget.Overlay.prototype.configX=function(_9c,_9d,obj){
var x=_9d[0];
var y=this.cfg.getProperty("y");
this.cfg.setProperty("x",x,true);
this.cfg.setProperty("y",y,true);
this.beforeMoveEvent.fire([x,y]);
x=this.cfg.getProperty("x");
y=this.cfg.getProperty("y");
YAHOO.util.Dom.setX(this.element,x,true);
this.cfg.setProperty("xy",[x,y],true);
this.cfg.refireEvent("iframe");
this.moveEvent.fire([x,y]);
};
YAHOO.widget.Overlay.prototype.configY=function(_a1,_a2,obj){
var x=this.cfg.getProperty("x");
var y=_a2[0];
this.cfg.setProperty("x",x,true);
this.cfg.setProperty("y",y,true);
this.beforeMoveEvent.fire([x,y]);
x=this.cfg.getProperty("x");
y=this.cfg.getProperty("y");
YAHOO.util.Dom.setY(this.element,y,true);
this.cfg.setProperty("xy",[x,y],true);
this.cfg.refireEvent("iframe");
this.moveEvent.fire([x,y]);
};
YAHOO.widget.Overlay.prototype.showIframe=function(){
if(this.iframe){
this.iframe.style.display="block";
}
};
YAHOO.widget.Overlay.prototype.hideIframe=function(){
if(this.iframe){
this.iframe.style.display="none";
}
};
YAHOO.widget.Overlay.prototype.configIframe=function(_a6,_a7,obj){
var val=_a7[0];
if(val){
if(!YAHOO.util.Config.alreadySubscribed(this.showEvent,this.showIframe,this)){
this.showEvent.subscribe(this.showIframe,this,true);
}
if(!YAHOO.util.Config.alreadySubscribed(this.hideEvent,this.hideIframe,this)){
this.hideEvent.subscribe(this.hideIframe,this,true);
}
var x=this.cfg.getProperty("x");
var y=this.cfg.getProperty("y");
if(!x||!y){
this.syncPosition();
x=this.cfg.getProperty("x");
y=this.cfg.getProperty("y");
}
if(!isNaN(x)&&!isNaN(y)){
if(!this.iframe){
this.iframe=document.createElement("iframe");
if(this.isSecure){
this.iframe.src=YAHOO.widget.Overlay.IFRAME_SRC;
}
var _ac=this.element.parentNode;
if(_ac){
_ac.appendChild(this.iframe);
}else{
document.body.appendChild(this.iframe);
}
YAHOO.util.Dom.setStyle(this.iframe,"position","absolute");
YAHOO.util.Dom.setStyle(this.iframe,"border","none");
YAHOO.util.Dom.setStyle(this.iframe,"margin","0");
YAHOO.util.Dom.setStyle(this.iframe,"padding","0");
YAHOO.util.Dom.setStyle(this.iframe,"opacity","0");
if(this.cfg.getProperty("visible")){
this.showIframe();
}else{
this.hideIframe();
}
}
var _ad=YAHOO.util.Dom.getStyle(this.iframe,"display");
if(_ad=="none"){
this.iframe.style.display="block";
}
YAHOO.util.Dom.setXY(this.iframe,[x,y]);
var _ae=this.element.clientWidth;
var _af=this.element.clientHeight;
YAHOO.util.Dom.setStyle(this.iframe,"width",(_ae+2)+"px");
YAHOO.util.Dom.setStyle(this.iframe,"height",(_af+2)+"px");
if(_ad=="none"){
this.iframe.style.display="none";
}
}
}else{
if(this.iframe){
this.iframe.style.display="none";
}
this.showEvent.unsubscribe(this.showIframe,this);
this.hideEvent.unsubscribe(this.hideIframe,this);
}
};
YAHOO.widget.Overlay.prototype.configConstrainToViewport=function(_b0,_b1,obj){
var val=_b1[0];
if(val){
if(!YAHOO.util.Config.alreadySubscribed(this.beforeMoveEvent,this.enforceConstraints,this)){
this.beforeMoveEvent.subscribe(this.enforceConstraints,this,true);
}
}else{
this.beforeMoveEvent.unsubscribe(this.enforceConstraints,this);
}
};
YAHOO.widget.Overlay.prototype.configContext=function(_b4,_b5,obj){
var _b7=_b5[0];
if(_b7){
var _b8=_b7[0];
var _b9=_b7[1];
var _ba=_b7[2];
if(_b8){
if(typeof _b8=="string"){
this.cfg.setProperty("context",[document.getElementById(_b8),_b9,_ba],true);
}
if(_b9&&_ba){
this.align(_b9,_ba);
}
}
}
};
YAHOO.widget.Overlay.prototype.align=function(_bb,_bc){
var _bd=this.cfg.getProperty("context");
if(_bd){
var _be=_bd[0];
var _bf=this.element;
var me=this;
if(!_bb){
_bb=_bd[1];
}
if(!_bc){
_bc=_bd[2];
}
if(_bf&&_be){
var _c1=YAHOO.util.Dom.getRegion(_be);
var _c2=function(v,h){
switch(_bb){
case YAHOO.widget.Overlay.TOP_LEFT:
me.moveTo(h,v);
break;
case YAHOO.widget.Overlay.TOP_RIGHT:
me.moveTo(h-_bf.offsetWidth,v);
break;
case YAHOO.widget.Overlay.BOTTOM_LEFT:
me.moveTo(h,v-_bf.offsetHeight);
break;
case YAHOO.widget.Overlay.BOTTOM_RIGHT:
me.moveTo(h-_bf.offsetWidth,v-_bf.offsetHeight);
break;
}
};
switch(_bc){
case YAHOO.widget.Overlay.TOP_LEFT:
_c2(_c1.top,_c1.left);
break;
case YAHOO.widget.Overlay.TOP_RIGHT:
_c2(_c1.top,_c1.right);
break;
case YAHOO.widget.Overlay.BOTTOM_LEFT:
_c2(_c1.bottom,_c1.left);
break;
case YAHOO.widget.Overlay.BOTTOM_RIGHT:
_c2(_c1.bottom,_c1.right);
break;
}
}
}
};
YAHOO.widget.Overlay.prototype.enforceConstraints=function(_c5,_c6,obj){
var pos=_c6[0];
var x=pos[0];
var y=pos[1];
var _cb=this.element.offsetHeight;
var _cc=this.element.offsetWidth;
var _cd=YAHOO.util.Dom.getViewportWidth();
var _ce=YAHOO.util.Dom.getViewportHeight();
var _cf=document.documentElement.scrollLeft||document.body.scrollLeft;
var _d0=document.documentElement.scrollTop||document.body.scrollTop;
var _d1=_d0+10;
var _d2=_cf+10;
var _d3=_d0+_ce-_cb-10;
var _d4=_cf+_cd-_cc-10;
if(x<_d2){
x=_d2;
}else{
if(x>_d4){
x=_d4;
}
}
if(y<_d1){
y=_d1;
}else{
if(y>_d3){
y=_d3;
}
}
this.cfg.setProperty("x",x,true);
this.cfg.setProperty("y",y,true);
this.cfg.setProperty("xy",[x,y],true);
};
YAHOO.widget.Overlay.prototype.center=function(){
var _d5=document.documentElement.scrollLeft||document.body.scrollLeft;
var _d6=document.documentElement.scrollTop||document.body.scrollTop;
var _d7=YAHOO.util.Dom.getClientWidth();
var _d8=YAHOO.util.Dom.getClientHeight();
var _d9=this.element.offsetWidth;
var _da=this.element.offsetHeight;
var x=(_d7/2)-(_d9/2)+_d5;
var y=(_d8/2)-(_da/2)+_d6;
this.cfg.setProperty("xy",[parseInt(x,10),parseInt(y,10)]);
this.cfg.refireEvent("iframe");
};
YAHOO.widget.Overlay.prototype.syncPosition=function(){
var pos=YAHOO.util.Dom.getXY(this.element);
this.cfg.setProperty("x",pos[0],true);
this.cfg.setProperty("y",pos[1],true);
this.cfg.setProperty("xy",pos,true);
};
YAHOO.widget.Overlay.prototype.onDomResize=function(e,obj){
YAHOO.widget.Overlay.superclass.onDomResize.call(this,e,obj);
var me=this;
setTimeout(function(){
me.syncPosition();
me.cfg.refireEvent("iframe");
me.cfg.refireEvent("context");
},0);
};
YAHOO.widget.Overlay.prototype.destroy=function(){
if(this.iframe){
this.iframe.parentNode.removeChild(this.iframe);
}
this.iframe=null;
YAHOO.widget.Overlay.windowResizeEvent.unsubscribe(this.doCenterOnDOMEvent,this);
YAHOO.widget.Overlay.windowScrollEvent.unsubscribe(this.doCenterOnDOMEvent,this);
YAHOO.widget.Overlay.superclass.destroy.call(this);
};
YAHOO.widget.Overlay.prototype.toString=function(){
return "Overlay "+this.id;
};
YAHOO.widget.Overlay.windowScrollEvent=new YAHOO.util.CustomEvent("windowScroll");
YAHOO.widget.Overlay.windowResizeEvent=new YAHOO.util.CustomEvent("windowResize");
YAHOO.widget.Overlay.windowScrollHandler=function(e){
if(YAHOO.widget.Module.prototype.browser=="ie"||YAHOO.widget.Module.prototype.browser=="ie7"){
if(!window.scrollEnd){
window.scrollEnd=-1;
}
clearTimeout(window.scrollEnd);
window.scrollEnd=setTimeout(function(){
YAHOO.widget.Overlay.windowScrollEvent.fire();
},1);
}else{
YAHOO.widget.Overlay.windowScrollEvent.fire();
}
};
YAHOO.widget.Overlay.windowResizeHandler=function(e){
if(YAHOO.widget.Module.prototype.browser=="ie"||YAHOO.widget.Module.prototype.browser=="ie7"){
if(!window.resizeEnd){
window.resizeEnd=-1;
}
clearTimeout(window.resizeEnd);
window.resizeEnd=setTimeout(function(){
YAHOO.widget.Overlay.windowResizeEvent.fire();
},100);
}else{
YAHOO.widget.Overlay.windowResizeEvent.fire();
}
};
YAHOO.widget.Overlay._initialized=null;
if(YAHOO.widget.Overlay._initialized===null){
YAHOO.util.Event.addListener(window,"scroll",YAHOO.widget.Overlay.windowScrollHandler);
YAHOO.util.Event.addListener(window,"resize",YAHOO.widget.Overlay.windowResizeHandler);
YAHOO.widget.Overlay._initialized=true;
}
YAHOO.widget.OverlayManager=function(_e3){
this.init(_e3);
};
YAHOO.widget.OverlayManager.CSS_FOCUSED="focused";
YAHOO.widget.OverlayManager.prototype={constructor:YAHOO.widget.OverlayManager,overlays:null,initDefaultConfig:function(){
this.cfg.addProperty("overlays",{suppressEvent:true});
this.cfg.addProperty("focusevent",{value:"mousedown"});
},init:function(_e4){
this.cfg=new YAHOO.util.Config(this);
this.initDefaultConfig();
if(_e4){
this.cfg.applyConfig(_e4,true);
}
this.cfg.fireQueue();
var _e5=null;
this.getActive=function(){
return _e5;
};
this.focus=function(_e6){
var o=this.find(_e6);
if(o){
this.blurAll();
_e5=o;
YAHOO.util.Dom.addClass(_e5.element,YAHOO.widget.OverlayManager.CSS_FOCUSED);
this.overlays.sort(this.compareZIndexDesc);
var _e8=YAHOO.util.Dom.getStyle(this.overlays[0].element,"zIndex");
if(!isNaN(_e8)&&this.overlays[0]!=_e6){
_e5.cfg.setProperty("zIndex",(parseInt(_e8,10)+2));
}
this.overlays.sort(this.compareZIndexDesc);
}
};
this.remove=function(_e9){
var o=this.find(_e9);
if(o){
var _eb=YAHOO.util.Dom.getStyle(o.element,"zIndex");
o.cfg.setProperty("zIndex",-1000,true);
this.overlays.sort(this.compareZIndexDesc);
this.overlays=this.overlays.slice(0,this.overlays.length-1);
o.cfg.setProperty("zIndex",_eb,true);
o.cfg.setProperty("manager",null);
o.focusEvent=null;
o.blurEvent=null;
o.focus=null;
o.blur=null;
}
};
this.blurAll=function(){
_e5=null;
for(var o=0;o<this.overlays.length;o++){
YAHOO.util.Dom.removeClass(this.overlays[o].element,YAHOO.widget.OverlayManager.CSS_FOCUSED);
}
};
var _ed=this.cfg.getProperty("overlays");
if(!this.overlays){
this.overlays=[];
}
if(_ed){
this.register(_ed);
this.overlays.sort(this.compareZIndexDesc);
}
},register:function(_ee){
if(_ee instanceof YAHOO.widget.Overlay){
_ee.cfg.addProperty("manager",{value:this});
_ee.focusEvent=new YAHOO.util.CustomEvent("focus");
_ee.blurEvent=new YAHOO.util.CustomEvent("blur");
var mgr=this;
_ee.focus=function(){
mgr.focus(this);
this.focusEvent.fire();
};
_ee.blur=function(){
mgr.blurAll();
this.blurEvent.fire();
};
var _f0=function(e,obj){
_ee.focus();
};
var _f3=this.cfg.getProperty("focusevent");
YAHOO.util.Event.addListener(_ee.element,_f3,_f0,this,true);
var _f4=YAHOO.util.Dom.getStyle(_ee.element,"zIndex");
if(!isNaN(_f4)){
_ee.cfg.setProperty("zIndex",parseInt(_f4,10));
}else{
_ee.cfg.setProperty("zIndex",0);
}
this.overlays.push(_ee);
return true;
}else{
if(_ee instanceof Array){
var _f5=0;
for(var i=0;i<_ee.length;i++){
if(this.register(_ee[i])){
_f5++;
}
}
if(_f5>0){
return true;
}
}else{
return false;
}
}
},find:function(_f7){
if(_f7 instanceof YAHOO.widget.Overlay){
for(var o=0;o<this.overlays.length;o++){
if(this.overlays[o]==_f7){
return this.overlays[o];
}
}
}else{
if(typeof _f7=="string"){
for(var p=0;p<this.overlays.length;p++){
if(this.overlays[p].id==_f7){
return this.overlays[p];
}
}
}
}
return null;
},compareZIndexDesc:function(o1,o2){
var _fc=o1.cfg.getProperty("zIndex");
var _fd=o2.cfg.getProperty("zIndex");
if(_fc>_fd){
return -1;
}else{
if(_fc<_fd){
return 1;
}else{
return 0;
}
}
},showAll:function(){
for(var o=0;o<this.overlays.length;o++){
this.overlays[o].show();
}
},hideAll:function(){
for(var o=0;o<this.overlays.length;o++){
this.overlays[o].hide();
}
},toString:function(){
return "OverlayManager";
}};
YAHOO.util.KeyListener=function(_100,_101,_102,_103){
if(!_100){
}
if(!_101){
}
if(!_102){
}
if(!_103){
_103=YAHOO.util.KeyListener.KEYDOWN;
}
var _104=new YAHOO.util.CustomEvent("keyPressed");
this.enabledEvent=new YAHOO.util.CustomEvent("enabled");
this.disabledEvent=new YAHOO.util.CustomEvent("disabled");
if(typeof _100=="string"){
_100=document.getElementById(_100);
}
if(typeof _102=="function"){
_104.subscribe(_102);
}else{
_104.subscribe(_102.fn,_102.scope,_102.correctScope);
}
function handleKeyPress(e,obj){
if(!_101.shift){
_101.shift=false;
}
if(!_101.alt){
_101.alt=false;
}
if(!_101.ctrl){
_101.ctrl=false;
}
if(e.shiftKey==_101.shift&&e.altKey==_101.alt&&e.ctrlKey==_101.ctrl){
var _107;
var _108;
if(_101.keys instanceof Array){
for(var i=0;i<_101.keys.length;i++){
_107=_101.keys[i];
if(_107==e.charCode){
_104.fire(e.charCode,e);
break;
}else{
if(_107==e.keyCode){
_104.fire(e.keyCode,e);
break;
}
}
}
}else{
_107=_101.keys;
if(_107==e.charCode){
_104.fire(e.charCode,e);
}else{
if(_107==e.keyCode){
_104.fire(e.keyCode,e);
}
}
}
}
}
this.enable=function(){
if(!this.enabled){
YAHOO.util.Event.addListener(_100,_103,handleKeyPress);
this.enabledEvent.fire(_101);
}
this.enabled=true;
};
this.disable=function(){
if(this.enabled){
YAHOO.util.Event.removeListener(_100,_103,handleKeyPress);
this.disabledEvent.fire(_101);
}
this.enabled=false;
};
this.toString=function(){
return "KeyListener ["+_101.keys+"] "+_100.tagName+(_100.id?"["+_100.id+"]":"");
};
};
YAHOO.util.KeyListener.KEYDOWN="keydown";
YAHOO.util.KeyListener.KEYUP="keyup";
YAHOO.widget.Tooltip=function(el,_10b){
YAHOO.widget.Tooltip.superclass.constructor.call(this,el,_10b);
};
YAHOO.extend(YAHOO.widget.Tooltip,YAHOO.widget.Overlay);
YAHOO.widget.Tooltip.CSS_TOOLTIP="yui-tt";
YAHOO.widget.Tooltip.prototype.init=function(el,_10d){
if(document.readyState&&document.readyState!="complete"){
var _10e=function(){
this.init(el,_10d);
};
YAHOO.util.Event.addListener(window,"load",_10e,this,true);
}else{
YAHOO.widget.Tooltip.superclass.init.call(this,el);
this.beforeInitEvent.fire(YAHOO.widget.Tooltip);
YAHOO.util.Dom.addClass(this.element,YAHOO.widget.Tooltip.CSS_TOOLTIP);
if(_10d){
this.cfg.applyConfig(_10d,true);
}
this.cfg.queueProperty("visible",false);
this.cfg.queueProperty("constraintoviewport",true);
this.setBody("");
this.render(this.cfg.getProperty("container"));
this.initEvent.fire(YAHOO.widget.Tooltip);
}
};
YAHOO.widget.Tooltip.prototype.initDefaultConfig=function(){
YAHOO.widget.Tooltip.superclass.initDefaultConfig.call(this);
this.cfg.addProperty("preventoverlap",{value:true,validator:this.cfg.checkBoolean,supercedes:["x","y","xy"]});
this.cfg.addProperty("showdelay",{value:200,handler:this.configShowDelay,validator:this.cfg.checkNumber});
this.cfg.addProperty("autodismissdelay",{value:5000,handler:this.configAutoDismissDelay,validator:this.cfg.checkNumber});
this.cfg.addProperty("hidedelay",{value:250,handler:this.configHideDelay,validator:this.cfg.checkNumber});
this.cfg.addProperty("text",{handler:this.configText,suppressEvent:true});
this.cfg.addProperty("container",{value:document.body,handler:this.configContainer});
};
YAHOO.widget.Tooltip.prototype.configText=function(type,args,obj){
var text=args[0];
if(text){
this.setBody(text);
}
};
YAHOO.widget.Tooltip.prototype.configContainer=function(type,args,obj){
var _116=args[0];
if(typeof _116=="string"){
this.cfg.setProperty("container",document.getElementById(_116),true);
}
};
YAHOO.widget.Tooltip.prototype.configContext=function(type,args,obj){
var _11a=args[0];
if(_11a){
if(!(_11a instanceof Array)){
if(typeof _11a=="string"){
this.cfg.setProperty("context",[document.getElementById(_11a)],true);
}else{
this.cfg.setProperty("context",[_11a],true);
}
_11a=this.cfg.getProperty("context");
}
if(this._context){
for(var c=0;c<this._context.length;++c){
var el=this._context[c];
YAHOO.util.Event.removeListener(el,"mouseover",this.onContextMouseOver);
YAHOO.util.Event.removeListener(el,"mousemove",this.onContextMouseMove);
YAHOO.util.Event.removeListener(el,"mouseout",this.onContextMouseOut);
}
}
this._context=_11a;
for(var d=0;d<this._context.length;++d){
var el2=this._context[d];
YAHOO.util.Event.addListener(el2,"mouseover",this.onContextMouseOver,this);
YAHOO.util.Event.addListener(el2,"mousemove",this.onContextMouseMove,this);
YAHOO.util.Event.addListener(el2,"mouseout",this.onContextMouseOut,this);
}
}
};
YAHOO.widget.Tooltip.prototype.onContextMouseMove=function(e,obj){
obj.pageX=YAHOO.util.Event.getPageX(e);
obj.pageY=YAHOO.util.Event.getPageY(e);
};
YAHOO.widget.Tooltip.prototype.onContextMouseOver=function(e,obj){
if(obj.hideProcId){
clearTimeout(obj.hideProcId);
obj.hideProcId=null;
}
var _123=this;
YAHOO.util.Event.addListener(_123,"mousemove",obj.onContextMouseMove,obj);
if(_123.title){
obj._tempTitle=_123.title;
_123.title="";
}
obj.showProcId=obj.doShow(e,_123);
};
YAHOO.widget.Tooltip.prototype.onContextMouseOut=function(e,obj){
var el=this;
if(obj._tempTitle){
el.title=obj._tempTitle;
obj._tempTitle=null;
}
if(obj.showProcId){
clearTimeout(obj.showProcId);
obj.showProcId=null;
}
if(obj.hideProcId){
clearTimeout(obj.hideProcId);
obj.hideProcId=null;
}
obj.hideProcId=setTimeout(function(){
obj.hide();
},obj.cfg.getProperty("hidedelay"));
};
YAHOO.widget.Tooltip.prototype.doShow=function(e,_128){
var _129=25;
if(this.browser=="opera"&&_128.tagName=="A"){
_129+=12;
}
var me=this;
return setTimeout(function(){
if(me._tempTitle){
me.setBody(me._tempTitle);
}else{
me.cfg.refireEvent("text");
}
me.moveTo(me.pageX,me.pageY+_129);
if(me.cfg.getProperty("preventoverlap")){
me.preventOverlap(me.pageX,me.pageY);
}
YAHOO.util.Event.removeListener(_128,"mousemove",me.onContextMouseMove);
me.show();
me.hideProcId=me.doHide();
},this.cfg.getProperty("showdelay"));
};
YAHOO.widget.Tooltip.prototype.doHide=function(){
var me=this;
return setTimeout(function(){
me.hide();
},this.cfg.getProperty("autodismissdelay"));
};
YAHOO.widget.Tooltip.prototype.preventOverlap=function(_12c,_12d){
var _12e=this.element.offsetHeight;
var _12f=YAHOO.util.Dom.getRegion(this.element);
_12f.top-=5;
_12f.left-=5;
_12f.right+=5;
_12f.bottom+=5;
var _130=new YAHOO.util.Point(_12c,_12d);
if(_12f.contains(_130)){
this.cfg.setProperty("y",(_12d-_12e-5));
}
};
YAHOO.widget.Tooltip.prototype.toString=function(){
return "Tooltip "+this.id;
};
YAHOO.widget.Panel=function(el,_132){
YAHOO.widget.Panel.superclass.constructor.call(this,el,_132);
};
YAHOO.extend(YAHOO.widget.Panel,YAHOO.widget.Overlay);
YAHOO.widget.Panel.CSS_PANEL="yui-panel";
YAHOO.widget.Panel.CSS_PANEL_CONTAINER="yui-panel-container";
YAHOO.widget.Panel.prototype.init=function(el,_134){
YAHOO.widget.Panel.superclass.init.call(this,el);
this.beforeInitEvent.fire(YAHOO.widget.Panel);
YAHOO.util.Dom.addClass(this.element,YAHOO.widget.Panel.CSS_PANEL);
this.buildWrapper();
if(_134){
this.cfg.applyConfig(_134,true);
}
this.beforeRenderEvent.subscribe(function(){
var _135=this.cfg.getProperty("draggable");
if(_135){
if(!this.header){
this.setHeader("&#160;");
}
}
},this,true);
var me=this;
var _137=function(){
this.blur();
};
this.showMaskEvent.subscribe(function(){
var _138=function(el){
if((el.tagName=="A"||el.tagName=="BUTTON"||el.tagName=="SELECT"||el.tagName=="INPUT"||el.tagName=="TEXTAREA")&&el.type!="hidden"){
if(!YAHOO.util.Dom.isAncestor(me.element,el)){
YAHOO.util.Event.addListener(el,"focus",_137,el,true);
return true;
}
}else{
return false;
}
};
this.focusableElements=YAHOO.util.Dom.getElementsBy(_138);
},this,true);
this.hideMaskEvent.subscribe(function(){
for(var i=0;i<this.focusableElements.length;i++){
var el2=this.focusableElements[i];
YAHOO.util.Event.removeListener(el2,"focus",_137);
}
},this,true);
this.beforeShowEvent.subscribe(function(){
this.cfg.refireEvent("underlay");
},this,true);
this.initEvent.fire(YAHOO.widget.Panel);
};
YAHOO.widget.Panel.prototype.initEvents=function(){
YAHOO.widget.Panel.superclass.initEvents.call(this);
this.showMaskEvent=new YAHOO.util.CustomEvent("showMask");
this.hideMaskEvent=new YAHOO.util.CustomEvent("hideMask");
this.dragEvent=new YAHOO.util.CustomEvent("drag");
};
YAHOO.widget.Panel.prototype.initDefaultConfig=function(){
YAHOO.widget.Panel.superclass.initDefaultConfig.call(this);
this.cfg.addProperty("close",{value:true,handler:this.configClose,validator:this.cfg.checkBoolean,supercedes:["visible"]});
this.cfg.addProperty("draggable",{value:true,handler:this.configDraggable,validator:this.cfg.checkBoolean,supercedes:["visible"]});
this.cfg.addProperty("underlay",{value:"shadow",handler:this.configUnderlay,supercedes:["visible"]});
this.cfg.addProperty("modal",{value:false,handler:this.configModal,validator:this.cfg.checkBoolean,supercedes:["visible"]});
this.cfg.addProperty("keylisteners",{handler:this.configKeyListeners,suppressEvent:true,supercedes:["visible"]});
};
YAHOO.widget.Panel.prototype.configClose=function(type,args,obj){
var val=args[0];
var _140=function(e,obj){
obj.hide();
};
if(val){
if(!this.close){
this.close=document.createElement("span");
YAHOO.util.Dom.addClass(this.close,"container-close");
this.close.innerHTML="&#160;";
this.innerElement.appendChild(this.close);
YAHOO.util.Event.addListener(this.close,"click",_140,this);
}else{
this.close.style.display="block";
}
}else{
if(this.close){
this.close.style.display="none";
}
}
};
YAHOO.widget.Panel.prototype.configDraggable=function(type,args,obj){
var val=args[0];
if(val){
if(this.header){
YAHOO.util.Dom.setStyle(this.header,"cursor","move");
this.registerDragDrop();
}
}else{
if(this.dd){
this.dd.unreg();
}
if(this.header){
YAHOO.util.Dom.setStyle(this.header,"cursor","auto");
}
}
};
YAHOO.widget.Panel.prototype.configUnderlay=function(type,args,obj){
var val=args[0];
switch(val.toLowerCase()){
case "shadow":
YAHOO.util.Dom.removeClass(this.element,"matte");
YAHOO.util.Dom.addClass(this.element,"shadow");
if(!this.underlay){
this.underlay=document.createElement("div");
this.underlay.className="underlay";
this.underlay.innerHTML="&#160;";
this.element.appendChild(this.underlay);
}
this.sizeUnderlay();
break;
case "matte":
YAHOO.util.Dom.removeClass(this.element,"shadow");
YAHOO.util.Dom.addClass(this.element,"matte");
break;
default:
YAHOO.util.Dom.removeClass(this.element,"shadow");
YAHOO.util.Dom.removeClass(this.element,"matte");
break;
}
};
YAHOO.widget.Panel.prototype.configModal=function(type,args,obj){
var _14e=args[0];
if(_14e){
this.buildMask();
if(!YAHOO.util.Config.alreadySubscribed(this.beforeShowEvent,this.showMask,this)){
this.beforeShowEvent.subscribe(this.showMask,this,true);
}
if(!YAHOO.util.Config.alreadySubscribed(this.hideEvent,this.hideMask,this)){
this.hideEvent.subscribe(this.hideMask,this,true);
}
if(!YAHOO.util.Config.alreadySubscribed(YAHOO.widget.Overlay.windowResizeEvent,this.sizeMask,this)){
YAHOO.widget.Overlay.windowResizeEvent.subscribe(this.sizeMask,this,true);
}
if(!YAHOO.util.Config.alreadySubscribed(this.destroyEvent,this.removeMask,this)){
this.destroyEvent.subscribe(this.removeMask,this,true);
}
this.cfg.refireEvent("zIndex");
}else{
this.beforeShowEvent.unsubscribe(this.showMask,this);
this.hideEvent.unsubscribe(this.hideMask,this);
YAHOO.widget.Overlay.windowResizeEvent.unsubscribe(this.sizeMask,this);
this.destroyEvent.unsubscribe(this.removeMask,this);
}
};
YAHOO.widget.Panel.prototype.removeMask=function(){
if(this.mask){
if(this.mask.parentNode){
this.mask.parentNode.removeChild(this.mask);
}
this.mask=null;
}
};
YAHOO.widget.Panel.prototype.configKeyListeners=function(type,args,obj){
var _152=args[0];
if(_152){
if(_152 instanceof Array){
for(var i=0;i<_152.length;i++){
var _154=_152[i];
if(!YAHOO.util.Config.alreadySubscribed(this.showEvent,_154.enable,_154)){
this.showEvent.subscribe(_154.enable,_154,true);
}
if(!YAHOO.util.Config.alreadySubscribed(this.hideEvent,_154.disable,_154)){
this.hideEvent.subscribe(_154.disable,_154,true);
this.destroyEvent.subscribe(_154.disable,_154,true);
}
}
}else{
if(!YAHOO.util.Config.alreadySubscribed(this.showEvent,_152.enable,_152)){
this.showEvent.subscribe(_152.enable,_152,true);
}
if(!YAHOO.util.Config.alreadySubscribed(this.hideEvent,_152.disable,_152)){
this.hideEvent.subscribe(_152.disable,_152,true);
this.destroyEvent.subscribe(_152.disable,_152,true);
}
}
}
};
YAHOO.widget.Panel.prototype.configHeight=function(type,args,obj){
var _158=args[0];
var el=this.innerElement;
YAHOO.util.Dom.setStyle(el,"height",_158);
this.cfg.refireEvent("underlay");
this.cfg.refireEvent("iframe");
};
YAHOO.widget.Panel.prototype.configWidth=function(type,args,obj){
var _15d=args[0];
var el=this.innerElement;
YAHOO.util.Dom.setStyle(el,"width",_15d);
this.cfg.refireEvent("underlay");
this.cfg.refireEvent("iframe");
};
YAHOO.widget.Panel.prototype.configzIndex=function(type,args,obj){
YAHOO.widget.Panel.superclass.configzIndex.call(this,type,args,obj);
var _162=0;
var _163=YAHOO.util.Dom.getStyle(this.element,"zIndex");
if(this.mask){
if(!_163||isNaN(_163)){
_163=0;
}
if(_163===0){
this.cfg.setProperty("zIndex",1);
}else{
_162=_163-1;
YAHOO.util.Dom.setStyle(this.mask,"zIndex",_162);
}
}
};
YAHOO.widget.Panel.prototype.buildWrapper=function(){
var _164=this.element.parentNode;
var _165=this.element;
var _166=document.createElement("div");
_166.className=YAHOO.widget.Panel.CSS_PANEL_CONTAINER;
_166.id=_165.id+"_c";
if(_164){
_164.insertBefore(_166,_165);
}
_166.appendChild(_165);
this.element=_166;
this.innerElement=_165;
YAHOO.util.Dom.setStyle(this.innerElement,"visibility","inherit");
};
YAHOO.widget.Panel.prototype.sizeUnderlay=function(){
if(this.underlay&&this.browser!="gecko"&&this.browser!="safari"){
this.underlay.style.width=this.innerElement.offsetWidth+"px";
this.underlay.style.height=this.innerElement.offsetHeight+"px";
}
};
YAHOO.widget.Panel.prototype.onDomResize=function(e,obj){
YAHOO.widget.Panel.superclass.onDomResize.call(this,e,obj);
var me=this;
setTimeout(function(){
me.sizeUnderlay();
},0);
};
YAHOO.widget.Panel.prototype.registerDragDrop=function(){
if(this.header){
this.dd=new YAHOO.util.DD(this.element.id,this.id);
if(!this.header.id){
this.header.id=this.id+"_h";
}
var me=this;
this.dd.startDrag=function(){
if(me.browser=="ie"){
YAHOO.util.Dom.addClass(me.element,"drag");
}
if(me.cfg.getProperty("constraintoviewport")){
var _16b=me.element.offsetHeight;
var _16c=me.element.offsetWidth;
var _16d=YAHOO.util.Dom.getViewportWidth();
var _16e=YAHOO.util.Dom.getViewportHeight();
var _16f=window.scrollX||document.documentElement.scrollLeft;
var _170=window.scrollY||document.documentElement.scrollTop;
var _171=_170+10;
var _172=_16f+10;
var _173=_170+_16e-_16b-10;
var _174=_16f+_16d-_16c-10;
this.minX=_172;
this.maxX=_174;
this.constrainX=true;
this.minY=_171;
this.maxY=_173;
this.constrainY=true;
}else{
this.constrainX=false;
this.constrainY=false;
}
me.dragEvent.fire("startDrag",arguments);
};
this.dd.onDrag=function(){
me.syncPosition();
me.cfg.refireEvent("iframe");
if(this.platform=="mac"&&this.browser=="gecko"){
this.showMacGeckoScrollbars();
}
me.dragEvent.fire("onDrag",arguments);
};
this.dd.endDrag=function(){
if(me.browser=="ie"){
YAHOO.util.Dom.removeClass(me.element,"drag");
}
me.dragEvent.fire("endDrag",arguments);
};
this.dd.setHandleElId(this.header.id);
this.dd.addInvalidHandleType("INPUT");
this.dd.addInvalidHandleType("SELECT");
this.dd.addInvalidHandleType("TEXTAREA");
}
};
YAHOO.widget.Panel.prototype.buildMask=function(){
if(!this.mask){
this.mask=document.createElement("div");
this.mask.id=this.id+"_mask";
this.mask.className="mask";
this.mask.innerHTML="&#160;";
var _175=function(e,obj){
YAHOO.util.Event.stopEvent(e);
};
var _178=document.body.firstChild;
if(_178){
document.body.insertBefore(this.mask,document.body.firstChild);
}else{
document.body.appendChild(this.mask);
}
}
};
YAHOO.widget.Panel.prototype.hideMask=function(){
if(this.cfg.getProperty("modal")&&this.mask){
this.mask.style.display="none";
this.hideMaskEvent.fire();
YAHOO.util.Dom.removeClass(document.body,"masked");
}
};
YAHOO.widget.Panel.prototype.showMask=function(){
if(this.cfg.getProperty("modal")&&this.mask){
YAHOO.util.Dom.addClass(document.body,"masked");
this.sizeMask();
this.mask.style.display="block";
this.showMaskEvent.fire();
}
};
YAHOO.widget.Panel.prototype.sizeMask=function(){
if(this.mask){
this.mask.style.height=YAHOO.util.Dom.getDocumentHeight()+"px";
this.mask.style.width=YAHOO.util.Dom.getDocumentWidth()+"px";
}
};
YAHOO.widget.Panel.prototype.render=function(_179){
return YAHOO.widget.Panel.superclass.render.call(this,_179,this.innerElement);
};
YAHOO.widget.Panel.prototype.toString=function(){
return "Panel "+this.id;
};
YAHOO.widget.Dialog=function(el,_17b){
YAHOO.widget.Dialog.superclass.constructor.call(this,el,_17b);
};
YAHOO.extend(YAHOO.widget.Dialog,YAHOO.widget.Panel);
YAHOO.widget.Dialog.CSS_DIALOG="yui-dialog";
YAHOO.widget.Dialog.prototype.initDefaultConfig=function(){
YAHOO.widget.Dialog.superclass.initDefaultConfig.call(this);
this.callback={success:null,failure:null,argument:null};
this.cfg.addProperty("postmethod",{value:"async",handler:this.configPostMethod,validator:function(val){
if(val!="form"&&val!="async"&&val!="none"&&val!="manual"){
return false;
}else{
return true;
}
}});
this.cfg.addProperty("buttons",{value:"none",handler:this.configButtons});
};
YAHOO.widget.Dialog.prototype.initEvents=function(){
YAHOO.widget.Dialog.superclass.initEvents.call(this);
this.beforeSubmitEvent=new YAHOO.util.CustomEvent("beforeSubmit");
this.submitEvent=new YAHOO.util.CustomEvent("submit");
this.manualSubmitEvent=new YAHOO.util.CustomEvent("manualSubmit");
this.asyncSubmitEvent=new YAHOO.util.CustomEvent("asyncSubmit");
this.formSubmitEvent=new YAHOO.util.CustomEvent("formSubmit");
this.cancelEvent=new YAHOO.util.CustomEvent("cancel");
};
YAHOO.widget.Dialog.prototype.init=function(el,_17e){
YAHOO.widget.Dialog.superclass.init.call(this,el);
this.beforeInitEvent.fire(YAHOO.widget.Dialog);
YAHOO.util.Dom.addClass(this.element,YAHOO.widget.Dialog.CSS_DIALOG);
this.cfg.setProperty("visible",false);
if(_17e){
this.cfg.applyConfig(_17e,true);
}
this.showEvent.subscribe(this.focusFirst,this,true);
this.beforeHideEvent.subscribe(this.blurButtons,this,true);
this.beforeRenderEvent.subscribe(function(){
var _17f=this.cfg.getProperty("buttons");
if(_17f&&_17f!="none"){
if(!this.footer){
this.setFooter("");
}
}
},this,true);
this.initEvent.fire(YAHOO.widget.Dialog);
};
YAHOO.widget.Dialog.prototype.doSubmit=function(){
var pm=this.cfg.getProperty("postmethod");
switch(pm){
case "async":
var _181=this.form.getAttribute("method")||"POST";
_181=_181.toUpperCase();
YAHOO.util.Connect.setForm(this.form);
var cObj=YAHOO.util.Connect.asyncRequest(_181,this.form.getAttribute("action"),this.callback);
this.asyncSubmitEvent.fire();
break;
case "form":
this.form.submit();
this.formSubmitEvent.fire();
break;
case "none":
case "manual":
this.manualSubmitEvent.fire();
break;
}
};
YAHOO.widget.Dialog.prototype.registerForm=function(){
var form=this.element.getElementsByTagName("form")[0];
if(!form){
var _184="<form name=\"frm_"+this.id+"\" action=\"\"></form>";
this.body.innerHTML+=_184;
form=this.element.getElementsByTagName("form")[0];
}
this.firstFormElement=function(){
for(var f=0;f<form.elements.length;f++){
var el=form.elements[f];
if(el.focus&&!el.disabled){
if(el.type&&el.type!="hidden"){
return el;
}
}
}
return null;
}();
this.lastFormElement=function(){
for(var f=form.elements.length-1;f>=0;f--){
var el=form.elements[f];
if(el.focus&&!el.disabled){
if(el.type&&el.type!="hidden"){
return el;
}
}
}
return null;
}();
this.form=form;
if(this.cfg.getProperty("modal")&&this.form){
var me=this;
var _18a=this.firstFormElement||this.firstButton;
if(_18a){
this.preventBackTab=new YAHOO.util.KeyListener(_18a,{shift:true,keys:9},{fn:me.focusLast,scope:me,correctScope:true});
this.showEvent.subscribe(this.preventBackTab.enable,this.preventBackTab,true);
this.hideEvent.subscribe(this.preventBackTab.disable,this.preventBackTab,true);
}
var _18b=this.lastButton||this.lastFormElement;
if(_18b){
this.preventTabOut=new YAHOO.util.KeyListener(_18b,{shift:false,keys:9},{fn:me.focusFirst,scope:me,correctScope:true});
this.showEvent.subscribe(this.preventTabOut.enable,this.preventTabOut,true);
this.hideEvent.subscribe(this.preventTabOut.disable,this.preventTabOut,true);
}
}
};
YAHOO.widget.Dialog.prototype.configClose=function(type,args,obj){
var val=args[0];
var _190=function(e,obj){
obj.cancel();
};
if(val){
if(!this.close){
this.close=document.createElement("div");
YAHOO.util.Dom.addClass(this.close,"container-close");
this.close.innerHTML="&#160;";
this.innerElement.appendChild(this.close);
YAHOO.util.Event.addListener(this.close,"click",_190,this);
}else{
this.close.style.display="block";
}
}else{
if(this.close){
this.close.style.display="none";
}
}
};
YAHOO.widget.Dialog.prototype.configButtons=function(type,args,obj){
var _196=args[0];
if(_196!="none"){
this.buttonSpan=null;
this.buttonSpan=document.createElement("span");
this.buttonSpan.className="button-group";
for(var b=0;b<_196.length;b++){
var _198=_196[b];
var _199=document.createElement("button");
_199.setAttribute("type","button");
if(_198.isDefault){
_199.className="default";
this.defaultHtmlButton=_199;
}
_199.appendChild(document.createTextNode(_198.text));
YAHOO.util.Event.addListener(_199,"click",_198.handler,this,true);
this.buttonSpan.appendChild(_199);
_198.htmlButton=_199;
if(b===0){
this.firstButton=_198.htmlButton;
}
if(b==(_196.length-1)){
this.lastButton=_198.htmlButton;
}
}
this.setFooter(this.buttonSpan);
this.cfg.refireEvent("iframe");
this.cfg.refireEvent("underlay");
}else{
if(this.buttonSpan){
if(this.buttonSpan.parentNode){
this.buttonSpan.parentNode.removeChild(this.buttonSpan);
}
this.buttonSpan=null;
this.firstButton=null;
this.lastButton=null;
this.defaultHtmlButton=null;
}
}
};
YAHOO.widget.Dialog.prototype.focusFirst=function(type,args,obj){
if(args){
var e=args[1];
if(e){
YAHOO.util.Event.stopEvent(e);
}
}
if(this.firstFormElement){
this.firstFormElement.focus();
}else{
this.focusDefaultButton();
}
};
YAHOO.widget.Dialog.prototype.focusLast=function(type,args,obj){
if(args){
var e=args[1];
if(e){
YAHOO.util.Event.stopEvent(e);
}
}
var _1a2=this.cfg.getProperty("buttons");
if(_1a2&&_1a2 instanceof Array){
this.focusLastButton();
}else{
if(this.lastFormElement){
this.lastFormElement.focus();
}
}
};
YAHOO.widget.Dialog.prototype.focusDefaultButton=function(){
if(this.defaultHtmlButton){
this.defaultHtmlButton.focus();
}
};
YAHOO.widget.Dialog.prototype.blurButtons=function(){
var _1a3=this.cfg.getProperty("buttons");
if(_1a3&&_1a3 instanceof Array){
var html=_1a3[0].htmlButton;
if(html){
html.blur();
}
}
};
YAHOO.widget.Dialog.prototype.focusFirstButton=function(){
var _1a5=this.cfg.getProperty("buttons");
if(_1a5&&_1a5 instanceof Array){
var html=_1a5[0].htmlButton;
if(html){
html.focus();
}
}
};
YAHOO.widget.Dialog.prototype.focusLastButton=function(){
var _1a7=this.cfg.getProperty("buttons");
if(_1a7&&_1a7 instanceof Array){
var html=_1a7[_1a7.length-1].htmlButton;
if(html){
html.focus();
}
}
};
YAHOO.widget.Dialog.prototype.configPostMethod=function(type,args,obj){
var _1ac=args[0];
this.registerForm();
YAHOO.util.Event.addListener(this.form,"submit",function(e){
YAHOO.util.Event.stopEvent(e);
this.submit();
this.form.blur();
},this,true);
};
YAHOO.widget.Dialog.prototype.validate=function(){
return true;
};
YAHOO.widget.Dialog.prototype.submit=function(){
if(this.validate()){
this.beforeSubmitEvent.fire();
this.doSubmit();
this.submitEvent.fire();
this.hide();
return true;
}else{
return false;
}
};
YAHOO.widget.Dialog.prototype.cancel=function(){
this.cancelEvent.fire();
this.hide();
};
YAHOO.widget.Dialog.prototype.getData=function(){
var _1ae=this.form;
if(_1ae){
var _1af=_1ae.elements,_1b0=_1af.length,_1b1={},_1b2,_1b3;
for(var i=0;i<_1b0;i++){
_1b2=_1af[i].name,_1b3=_1af[_1b2];
if(_1b3){
if(_1b3.tagName){
var _1b5=_1b3.type,_1b6=_1b3.tagName.toUpperCase();
switch(_1b6){
case "INPUT":
if(_1b5=="checkbox"){
_1b1[_1b2]=_1b3.checked;
}else{
if(_1b5!="radio"){
_1b1[_1b2]=_1b3.value;
}
}
break;
case "TEXTAREA":
_1b1[_1b2]=_1b3.value;
break;
case "SELECT":
var _1b7=_1b3.options,_1b8=_1b7.length,_1b9=[],_1ba,_1bb;
for(var n=0;n<_1b8;n++){
_1ba=_1b7[n];
if(_1ba.selected){
_1bb=_1ba.value;
if(!_1bb||_1bb===""){
_1bb=_1ba.text;
}
_1b9[_1b9.length]=_1bb;
}
}
_1b1[_1b2]=_1b9;
break;
}
}else{
var _1bd=_1b3.length,_1b5=_1b3[0].type,_1b6=_1b3[0].tagName.toUpperCase();
switch(_1b5){
case "radio":
var _1be;
for(var n=0;n<_1bd;n++){
_1be=_1b3[n];
if(_1be.checked){
_1b1[_1b2]=_1be.value;
break;
}
}
break;
case "checkbox":
var _1b9=[],_1bf;
for(var n=0;n<_1bd;n++){
_1bf=_1b3[n];
if(_1bf.checked){
_1b9[_1b9.length]=_1bf.value;
}
}
_1b1[_1b2]=_1b9;
break;
}
}
}
}
}
return _1b1;
};
YAHOO.widget.Dialog.prototype.toString=function(){
return "Dialog "+this.id;
};
YAHOO.widget.SimpleDialog=function(el,_1c1){
YAHOO.widget.SimpleDialog.superclass.constructor.call(this,el,_1c1);
};
YAHOO.extend(YAHOO.widget.SimpleDialog,YAHOO.widget.Dialog);
YAHOO.widget.SimpleDialog.ICON_BLOCK="blckicon";
YAHOO.widget.SimpleDialog.ICON_ALARM="alrticon";
YAHOO.widget.SimpleDialog.ICON_HELP="hlpicon";
YAHOO.widget.SimpleDialog.ICON_INFO="infoicon";
YAHOO.widget.SimpleDialog.ICON_WARN="warnicon";
YAHOO.widget.SimpleDialog.ICON_TIP="tipicon";
YAHOO.widget.SimpleDialog.CSS_SIMPLEDIALOG="yui-simple-dialog";
YAHOO.widget.SimpleDialog.prototype.initDefaultConfig=function(){
YAHOO.widget.SimpleDialog.superclass.initDefaultConfig.call(this);
this.cfg.addProperty("icon",{value:"none",handler:this.configIcon,suppressEvent:true});
this.cfg.addProperty("text",{value:"",handler:this.configText,suppressEvent:true,supercedes:["icon"]});
};
YAHOO.widget.SimpleDialog.prototype.init=function(el,_1c3){
YAHOO.widget.SimpleDialog.superclass.init.call(this,el);
this.beforeInitEvent.fire(YAHOO.widget.SimpleDialog);
YAHOO.util.Dom.addClass(this.element,YAHOO.widget.SimpleDialog.CSS_SIMPLEDIALOG);
this.cfg.queueProperty("postmethod","manual");
if(_1c3){
this.cfg.applyConfig(_1c3,true);
}
this.beforeRenderEvent.subscribe(function(){
if(!this.body){
this.setBody("");
}
},this,true);
this.initEvent.fire(YAHOO.widget.SimpleDialog);
};
YAHOO.widget.SimpleDialog.prototype.registerForm=function(){
YAHOO.widget.SimpleDialog.superclass.registerForm.call(this);
this.form.innerHTML+="<input type=\"hidden\" name=\""+this.id+"\" value=\"\"/>";
};
YAHOO.widget.SimpleDialog.prototype.configIcon=function(type,args,obj){
var icon=args[0];
if(icon&&icon!="none"){
var _1c8="";
if(icon.indexOf(".")==-1){
_1c8="<span class=\"yui-icon "+icon+"\" >&#160;</span>";
}else{
_1c8="<img src=\""+this.imageRoot+icon+"\" class=\"yui-icon\" />";
}
this.body.innerHTML=_1c8+this.body.innerHTML;
}
};
YAHOO.widget.SimpleDialog.prototype.configText=function(type,args,obj){
var text=args[0];
if(text){
this.setBody(text);
this.cfg.refireEvent("icon");
}
};
YAHOO.widget.SimpleDialog.prototype.toString=function(){
return "SimpleDialog "+this.id;
};
YAHOO.widget.ContainerEffect=function(_1cd,_1ce,_1cf,_1d0,_1d1){
if(!_1d1){
_1d1=YAHOO.util.Anim;
}
this.overlay=_1cd;
this.attrIn=_1ce;
this.attrOut=_1cf;
this.targetElement=_1d0||_1cd.element;
this.animClass=_1d1;
};
YAHOO.widget.ContainerEffect.prototype.init=function(){
this.beforeAnimateInEvent=new YAHOO.util.CustomEvent("beforeAnimateIn");
this.beforeAnimateOutEvent=new YAHOO.util.CustomEvent("beforeAnimateOut");
this.animateInCompleteEvent=new YAHOO.util.CustomEvent("animateInComplete");
this.animateOutCompleteEvent=new YAHOO.util.CustomEvent("animateOutComplete");
this.animIn=new this.animClass(this.targetElement,this.attrIn.attributes,this.attrIn.duration,this.attrIn.method);
this.animIn.onStart.subscribe(this.handleStartAnimateIn,this);
this.animIn.onTween.subscribe(this.handleTweenAnimateIn,this);
this.animIn.onComplete.subscribe(this.handleCompleteAnimateIn,this);
this.animOut=new this.animClass(this.targetElement,this.attrOut.attributes,this.attrOut.duration,this.attrOut.method);
this.animOut.onStart.subscribe(this.handleStartAnimateOut,this);
this.animOut.onTween.subscribe(this.handleTweenAnimateOut,this);
this.animOut.onComplete.subscribe(this.handleCompleteAnimateOut,this);
};
YAHOO.widget.ContainerEffect.prototype.animateIn=function(){
this.beforeAnimateInEvent.fire();
this.animIn.animate();
};
YAHOO.widget.ContainerEffect.prototype.animateOut=function(){
this.beforeAnimateOutEvent.fire();
this.animOut.animate();
};
YAHOO.widget.ContainerEffect.prototype.handleStartAnimateIn=function(type,args,obj){
};
YAHOO.widget.ContainerEffect.prototype.handleTweenAnimateIn=function(type,args,obj){
};
YAHOO.widget.ContainerEffect.prototype.handleCompleteAnimateIn=function(type,args,obj){
};
YAHOO.widget.ContainerEffect.prototype.handleStartAnimateOut=function(type,args,obj){
};
YAHOO.widget.ContainerEffect.prototype.handleTweenAnimateOut=function(type,args,obj){
};
YAHOO.widget.ContainerEffect.prototype.handleCompleteAnimateOut=function(type,args,obj){
};
YAHOO.widget.ContainerEffect.prototype.toString=function(){
var _1e4="ContainerEffect";
if(this.overlay){
_1e4+=" ["+this.overlay.toString()+"]";
}
return _1e4;
};
YAHOO.widget.ContainerEffect.FADE=function(_1e5,dur){
var fade=new YAHOO.widget.ContainerEffect(_1e5,{attributes:{opacity:{from:0,to:1}},duration:dur,method:YAHOO.util.Easing.easeIn},{attributes:{opacity:{to:0}},duration:dur,method:YAHOO.util.Easing.easeOut},_1e5.element);
fade.handleStartAnimateIn=function(type,args,obj){
YAHOO.util.Dom.addClass(obj.overlay.element,"hide-select");
if(!obj.overlay.underlay){
obj.overlay.cfg.refireEvent("underlay");
}
if(obj.overlay.underlay){
obj.initialUnderlayOpacity=YAHOO.util.Dom.getStyle(obj.overlay.underlay,"opacity");
obj.overlay.underlay.style.filter=null;
}
YAHOO.util.Dom.setStyle(obj.overlay.element,"visibility","visible");
YAHOO.util.Dom.setStyle(obj.overlay.element,"opacity",0);
};
fade.handleCompleteAnimateIn=function(type,args,obj){
YAHOO.util.Dom.removeClass(obj.overlay.element,"hide-select");
if(obj.overlay.element.style.filter){
obj.overlay.element.style.filter=null;
}
if(obj.overlay.underlay){
YAHOO.util.Dom.setStyle(obj.overlay.underlay,"opacity",obj.initialUnderlayOpacity);
}
obj.overlay.cfg.refireEvent("iframe");
obj.animateInCompleteEvent.fire();
};
fade.handleStartAnimateOut=function(type,args,obj){
YAHOO.util.Dom.addClass(obj.overlay.element,"hide-select");
if(obj.overlay.underlay){
obj.overlay.underlay.style.filter=null;
}
};
fade.handleCompleteAnimateOut=function(type,args,obj){
YAHOO.util.Dom.removeClass(obj.overlay.element,"hide-select");
if(obj.overlay.element.style.filter){
obj.overlay.element.style.filter=null;
}
YAHOO.util.Dom.setStyle(obj.overlay.element,"visibility","hidden");
YAHOO.util.Dom.setStyle(obj.overlay.element,"opacity",1);
obj.overlay.cfg.refireEvent("iframe");
obj.animateOutCompleteEvent.fire();
};
fade.init();
return fade;
};
YAHOO.widget.ContainerEffect.SLIDE=function(_1f4,dur){
var x=_1f4.cfg.getProperty("x")||YAHOO.util.Dom.getX(_1f4.element);
var y=_1f4.cfg.getProperty("y")||YAHOO.util.Dom.getY(_1f4.element);
var _1f8=YAHOO.util.Dom.getClientWidth();
var _1f9=_1f4.element.offsetWidth;
var _1fa=new YAHOO.widget.ContainerEffect(_1f4,{attributes:{points:{to:[x,y]}},duration:dur,method:YAHOO.util.Easing.easeIn},{attributes:{points:{to:[(_1f8+25),y]}},duration:dur,method:YAHOO.util.Easing.easeOut},_1f4.element,YAHOO.util.Motion);
_1fa.handleStartAnimateIn=function(type,args,obj){
obj.overlay.element.style.left=(-25-_1f9)+"px";
obj.overlay.element.style.top=y+"px";
};
_1fa.handleTweenAnimateIn=function(type,args,obj){
var pos=YAHOO.util.Dom.getXY(obj.overlay.element);
var _202=pos[0];
var _203=pos[1];
if(YAHOO.util.Dom.getStyle(obj.overlay.element,"visibility")=="hidden"&&_202<x){
YAHOO.util.Dom.setStyle(obj.overlay.element,"visibility","visible");
}
obj.overlay.cfg.setProperty("xy",[_202,_203],true);
obj.overlay.cfg.refireEvent("iframe");
};
_1fa.handleCompleteAnimateIn=function(type,args,obj){
obj.overlay.cfg.setProperty("xy",[x,y],true);
obj.startX=x;
obj.startY=y;
obj.overlay.cfg.refireEvent("iframe");
obj.animateInCompleteEvent.fire();
};
_1fa.handleStartAnimateOut=function(type,args,obj){
var vw=YAHOO.util.Dom.getViewportWidth();
var pos=YAHOO.util.Dom.getXY(obj.overlay.element);
var yso=pos[1];
var _20d=obj.animOut.attributes.points.to;
obj.animOut.attributes.points.to=[(vw+25),yso];
};
_1fa.handleTweenAnimateOut=function(type,args,obj){
var pos=YAHOO.util.Dom.getXY(obj.overlay.element);
var xto=pos[0];
var yto=pos[1];
obj.overlay.cfg.setProperty("xy",[xto,yto],true);
obj.overlay.cfg.refireEvent("iframe");
};
_1fa.handleCompleteAnimateOut=function(type,args,obj){
YAHOO.util.Dom.setStyle(obj.overlay.element,"visibility","hidden");
obj.overlay.cfg.setProperty("xy",[x,y]);
obj.animateOutCompleteEvent.fire();
};
_1fa.init();
return _1fa;
};
YAHOO.register("container",YAHOO.widget.Module,{version:"2.2.0",build:"115"});


if(!YAHOO.util.DragDropMgr){
YAHOO.util.DragDropMgr=function(){
var _1=YAHOO.util.Event;
return {ids:{},handleIds:{},dragCurrent:null,dragOvers:{},deltaX:0,deltaY:0,preventDefault:true,stopPropagation:true,initalized:false,locked:false,init:function(){
this.initialized=true;
},POINT:0,INTERSECT:1,STRICT_INTERSECT:2,mode:0,_execOnAll:function(_2,_3){
for(var i in this.ids){
for(var j in this.ids[i]){
var _6=this.ids[i][j];
if(!this.isTypeOfDD(_6)){
continue;
}
_6[_2].apply(_6,_3);
}
}
},_onLoad:function(){
this.init();
_1.on(document,"mouseup",this.handleMouseUp,this,true);
_1.on(document,"mousemove",this.handleMouseMove,this,true);
_1.on(window,"unload",this._onUnload,this,true);
_1.on(window,"resize",this._onResize,this,true);
},_onResize:function(e){
this._execOnAll("resetConstraints",[]);
},lock:function(){
this.locked=true;
},unlock:function(){
this.locked=false;
},isLocked:function(){
return this.locked;
},locationCache:{},useCache:true,clickPixelThresh:3,clickTimeThresh:1000,dragThreshMet:false,clickTimeout:null,startX:0,startY:0,regDragDrop:function(_8,_9){
if(!this.initialized){
this.init();
}
if(!this.ids[_9]){
this.ids[_9]={};
}
this.ids[_9][_8.id]=_8;
},removeDDFromGroup:function(_a,_b){
if(!this.ids[_b]){
this.ids[_b]={};
}
var _c=this.ids[_b];
if(_c&&_c[_a.id]){
delete _c[_a.id];
}
},_remove:function(_d){
for(var g in _d.groups){
if(g&&this.ids[g][_d.id]){
delete this.ids[g][_d.id];
}
}
delete this.handleIds[_d.id];
},regHandle:function(_f,_10){
if(!this.handleIds[_f]){
this.handleIds[_f]={};
}
this.handleIds[_f][_10]=_10;
},isDragDrop:function(id){
return (this.getDDById(id))?true:false;
},getRelated:function(_12,_13){
var _14=[];
for(var i in _12.groups){
for(j in this.ids[i]){
var dd=this.ids[i][j];
if(!this.isTypeOfDD(dd)){
continue;
}
if(!_13||dd.isTarget){
_14[_14.length]=dd;
}
}
}
return _14;
},isLegalTarget:function(oDD,_18){
var _19=this.getRelated(oDD,true);
for(var i=0,len=_19.length;i<len;++i){
if(_19[i].id==_18.id){
return true;
}
}
return false;
},isTypeOfDD:function(oDD){
return (oDD&&oDD.__ygDragDrop);
},isHandle:function(_1d,_1e){
return (this.handleIds[_1d]&&this.handleIds[_1d][_1e]);
},getDDById:function(id){
for(var i in this.ids){
if(this.ids[i][id]){
return this.ids[i][id];
}
}
return null;
},handleMouseDown:function(e,oDD){
this.currentTarget=YAHOO.util.Event.getTarget(e);
this.dragCurrent=oDD;
var el=oDD.getEl();
this.startX=YAHOO.util.Event.getPageX(e);
this.startY=YAHOO.util.Event.getPageY(e);
this.deltaX=this.startX-el.offsetLeft;
this.deltaY=this.startY-el.offsetTop;
this.dragThreshMet=false;
this.clickTimeout=setTimeout(function(){
var DDM=YAHOO.util.DDM;
DDM.startDrag(DDM.startX,DDM.startY);
},this.clickTimeThresh);
},startDrag:function(x,y){
clearTimeout(this.clickTimeout);
if(this.dragCurrent){
this.dragCurrent.b4StartDrag(x,y);
this.dragCurrent.startDrag(x,y);
}
this.dragThreshMet=true;
},handleMouseUp:function(e){
if(!this.dragCurrent){
return;
}
clearTimeout(this.clickTimeout);
if(this.dragThreshMet){
this.fireEvents(e,true);
}else{
}
this.stopDrag(e);
this.stopEvent(e);
},stopEvent:function(e){
if(this.stopPropagation){
YAHOO.util.Event.stopPropagation(e);
}
if(this.preventDefault){
YAHOO.util.Event.preventDefault(e);
}
},stopDrag:function(e){
if(this.dragCurrent){
if(this.dragThreshMet){
this.dragCurrent.b4EndDrag(e);
this.dragCurrent.endDrag(e);
}
this.dragCurrent.onMouseUp(e);
}
this.dragCurrent=null;
this.dragOvers={};
},handleMouseMove:function(e){
if(!this.dragCurrent){
return true;
}
if(YAHOO.util.Event.isIE&&!e.button){
this.stopEvent(e);
return this.handleMouseUp(e);
}
if(!this.dragThreshMet){
var _2b=Math.abs(this.startX-YAHOO.util.Event.getPageX(e));
var _2c=Math.abs(this.startY-YAHOO.util.Event.getPageY(e));
if(_2b>this.clickPixelThresh||_2c>this.clickPixelThresh){
this.startDrag(this.startX,this.startY);
}
}
if(this.dragThreshMet){
this.dragCurrent.b4Drag(e);
this.dragCurrent.onDrag(e);
this.fireEvents(e,false);
}
this.stopEvent(e);
return true;
},fireEvents:function(e,_2e){
var dc=this.dragCurrent;
if(!dc||dc.isLocked()){
return;
}
var x=YAHOO.util.Event.getPageX(e);
var y=YAHOO.util.Event.getPageY(e);
var pt=new YAHOO.util.Point(x,y);
var _33=[];
var _34=[];
var _35=[];
var _36=[];
var _37=[];
for(var i in this.dragOvers){
var ddo=this.dragOvers[i];
if(!this.isTypeOfDD(ddo)){
continue;
}
if(!this.isOverTarget(pt,ddo,this.mode)){
_34.push(ddo);
}
_33[i]=true;
delete this.dragOvers[i];
}
for(var _3a in dc.groups){
if("string"!=typeof _3a){
continue;
}
for(i in this.ids[_3a]){
var oDD=this.ids[_3a][i];
if(!this.isTypeOfDD(oDD)){
continue;
}
if(oDD.isTarget&&!oDD.isLocked()&&oDD!=dc){
if(this.isOverTarget(pt,oDD,this.mode)){
if(_2e){
_36.push(oDD);
}else{
if(!_33[oDD.id]){
_37.push(oDD);
}else{
_35.push(oDD);
}
this.dragOvers[oDD.id]=oDD;
}
}
}
}
}
if(this.mode){
if(_34.length){
dc.b4DragOut(e,_34);
dc.onDragOut(e,_34);
}
if(_37.length){
dc.onDragEnter(e,_37);
}
if(_35.length){
dc.b4DragOver(e,_35);
dc.onDragOver(e,_35);
}
if(_36.length){
dc.b4DragDrop(e,_36);
dc.onDragDrop(e,_36);
}
}else{
var len=0;
for(i=0,len=_34.length;i<len;++i){
dc.b4DragOut(e,_34[i].id);
dc.onDragOut(e,_34[i].id);
}
for(i=0,len=_37.length;i<len;++i){
dc.onDragEnter(e,_37[i].id);
}
for(i=0,len=_35.length;i<len;++i){
dc.b4DragOver(e,_35[i].id);
dc.onDragOver(e,_35[i].id);
}
for(i=0,len=_36.length;i<len;++i){
dc.b4DragDrop(e,_36[i].id);
dc.onDragDrop(e,_36[i].id);
}
}
if(_2e&&!_36.length){
dc.onInvalidDrop(e);
}
},getBestMatch:function(dds){
var _3e=null;
var len=dds.length;
if(len==1){
_3e=dds[0];
}else{
for(var i=0;i<len;++i){
var dd=dds[i];
if(this.mode==this.INTERSECT&&dd.cursorIsOver){
_3e=dd;
break;
}else{
if(!_3e||!_3e.overlap||(dd.overlap&&_3e.overlap.getArea()<dd.overlap.getArea())){
_3e=dd;
}
}
}
}
return _3e;
},refreshCache:function(_42){
var g=_42||this.ids;
for(var _44 in g){
if("string"!=typeof _44){
continue;
}
for(var i in this.ids[_44]){
var oDD=this.ids[_44][i];
if(this.isTypeOfDD(oDD)){
var loc=this.getLocation(oDD);
if(loc){
this.locationCache[oDD.id]=loc;
}else{
delete this.locationCache[oDD.id];
}
}
}
}
},verifyEl:function(el){
try{
if(el){
var _49=el.offsetParent;
if(_49){
return true;
}
}
}
catch(e){
}
return false;
},getLocation:function(oDD){
if(!this.isTypeOfDD(oDD)){
return null;
}
var el=oDD.getEl(),pos,x1,x2,y1,y2,t,r,b,l;
try{
pos=YAHOO.util.Dom.getXY(el);
}
catch(e){
}
if(!pos){
return null;
}
x1=pos[0];
x2=x1+el.offsetWidth;
y1=pos[1];
y2=y1+el.offsetHeight;
t=y1-oDD.padding[0];
r=x2+oDD.padding[1];
b=y2+oDD.padding[2];
l=x1-oDD.padding[3];
return new YAHOO.util.Region(t,r,b,l);
},isOverTarget:function(pt,_56,_57){
var loc=this.locationCache[_56.id];
if(!loc||!this.useCache){
loc=this.getLocation(_56);
this.locationCache[_56.id]=loc;
}
if(!loc){
return false;
}
_56.cursorIsOver=loc.contains(pt);
var dc=this.dragCurrent;
if(!dc||!dc.getTargetCoord||(!_57&&!dc.constrainX&&!dc.constrainY)){
return _56.cursorIsOver;
}
_56.overlap=null;
var pos=dc.getTargetCoord(pt.x,pt.y);
var el=dc.getDragEl();
var _5c=new YAHOO.util.Region(pos.y,pos.x+el.offsetWidth,pos.y+el.offsetHeight,pos.x);
var _5d=_5c.intersect(loc);
if(_5d){
_56.overlap=_5d;
return (_57)?true:_56.cursorIsOver;
}else{
return false;
}
},_onUnload:function(e,me){
this.unregAll();
},unregAll:function(){
if(this.dragCurrent){
this.stopDrag();
this.dragCurrent=null;
}
this._execOnAll("unreg",[]);
for(i in this.elementCache){
delete this.elementCache[i];
}
this.elementCache={};
this.ids={};
},elementCache:{},getElWrapper:function(id){
var _61=this.elementCache[id];
if(!_61||!_61.el){
_61=this.elementCache[id]=new this.ElementWrapper(YAHOO.util.Dom.get(id));
}
return _61;
},getElement:function(id){
return YAHOO.util.Dom.get(id);
},getCss:function(id){
var el=YAHOO.util.Dom.get(id);
return (el)?el.style:null;
},ElementWrapper:function(el){
this.el=el||null;
this.id=this.el&&el.id;
this.css=this.el&&el.style;
},getPosX:function(el){
return YAHOO.util.Dom.getX(el);
},getPosY:function(el){
return YAHOO.util.Dom.getY(el);
},swapNode:function(n1,n2){
if(n1.swapNode){
n1.swapNode(n2);
}else{
var p=n2.parentNode;
var s=n2.nextSibling;
if(s==n1){
p.insertBefore(n1,n2);
}else{
if(n2==n1.nextSibling){
p.insertBefore(n2,n1);
}else{
n1.parentNode.replaceChild(n2,n1);
p.insertBefore(n1,s);
}
}
}
},getScroll:function(){
var t,l,dde=document.documentElement,db=document.body;
if(dde&&(dde.scrollTop||dde.scrollLeft)){
t=dde.scrollTop;
l=dde.scrollLeft;
}else{
if(db){
t=db.scrollTop;
l=db.scrollLeft;
}else{
}
}
return {top:t,left:l};
},getStyle:function(el,_71){
return YAHOO.util.Dom.getStyle(el,_71);
},getScrollTop:function(){
return this.getScroll().top;
},getScrollLeft:function(){
return this.getScroll().left;
},moveToEl:function(_72,_73){
var _74=YAHOO.util.Dom.getXY(_73);
YAHOO.util.Dom.setXY(_72,_74);
},getClientHeight:function(){
return YAHOO.util.Dom.getViewportHeight();
},getClientWidth:function(){
return YAHOO.util.Dom.getViewportWidth();
},numericSort:function(a,b){
return (a-b);
},_timeoutCount:0,_addListeners:function(){
var DDM=YAHOO.util.DDM;
if(YAHOO.util.Event&&document){
DDM._onLoad();
}else{
if(DDM._timeoutCount>2000){
}else{
setTimeout(DDM._addListeners,10);
if(document&&document.body){
DDM._timeoutCount+=1;
}
}
}
},handleWasClicked:function(_78,id){
if(this.isHandle(id,_78.id)){
return true;
}else{
var p=_78.parentNode;
while(p){
if(this.isHandle(id,p.id)){
return true;
}else{
p=p.parentNode;
}
}
}
return false;
}};
}();
YAHOO.util.DDM=YAHOO.util.DragDropMgr;
YAHOO.util.DDM._addListeners();
}
(function(){
var _7b=YAHOO.util.Event;
var Dom=YAHOO.util.Dom;
YAHOO.util.DragDrop=function(id,_7e,_7f){
if(id){
this.init(id,_7e,_7f);
}
};
YAHOO.util.DragDrop.prototype={id:null,config:null,dragElId:null,handleElId:null,invalidHandleTypes:null,invalidHandleIds:null,invalidHandleClasses:null,startPageX:0,startPageY:0,groups:null,locked:false,lock:function(){
this.locked=true;
},unlock:function(){
this.locked=false;
},isTarget:true,padding:null,_domRef:null,__ygDragDrop:true,constrainX:false,constrainY:false,minX:0,maxX:0,minY:0,maxY:0,maintainOffset:false,xTicks:null,yTicks:null,primaryButtonOnly:true,available:false,hasOuterHandles:false,b4StartDrag:function(x,y){
},startDrag:function(x,y){
},b4Drag:function(e){
},onDrag:function(e){
},onDragEnter:function(e,id){
},b4DragOver:function(e){
},onDragOver:function(e,id){
},b4DragOut:function(e){
},onDragOut:function(e,id){
},b4DragDrop:function(e){
},onDragDrop:function(e,id){
},onInvalidDrop:function(e){
},b4EndDrag:function(e){
},endDrag:function(e){
},b4MouseDown:function(e){
},onMouseDown:function(e){
},onMouseUp:function(e){
},onAvailable:function(){
},getEl:function(){
if(!this._domRef){
this._domRef=Dom.get(this.id);
}
return this._domRef;
},getDragEl:function(){
return Dom.get(this.dragElId);
},init:function(id,_98,_99){
this.initTarget(id,_98,_99);
_7b.on(this.id,"mousedown",this.handleMouseDown,this,true);
},initTarget:function(id,_9b,_9c){
this.config=_9c||{};
this.DDM=YAHOO.util.DDM;
this.groups={};
if(typeof id!=="string"){
id=Dom.generateId(id);
}
this.id=id;
this.addToGroup((_9b)?_9b:"default");
this.handleElId=id;
_7b.onAvailable(id,this.handleOnAvailable,this,true);
this.setDragElId(id);
this.invalidHandleTypes={A:"A"};
this.invalidHandleIds={};
this.invalidHandleClasses=[];
this.applyConfig();
},applyConfig:function(){
this.padding=this.config.padding||[0,0,0,0];
this.isTarget=(this.config.isTarget!==false);
this.maintainOffset=(this.config.maintainOffset);
this.primaryButtonOnly=(this.config.primaryButtonOnly!==false);
},handleOnAvailable:function(){
this.available=true;
this.resetConstraints();
this.onAvailable();
},setPadding:function(_9d,_9e,_9f,_a0){
if(!_9e&&0!==_9e){
this.padding=[_9d,_9d,_9d,_9d];
}else{
if(!_9f&&0!==_9f){
this.padding=[_9d,_9e,_9d,_9e];
}else{
this.padding=[_9d,_9e,_9f,_a0];
}
}
},setInitPosition:function(_a1,_a2){
var el=this.getEl();
if(!this.DDM.verifyEl(el)){
return;
}
var dx=_a1||0;
var dy=_a2||0;
var p=Dom.getXY(el);
this.initPageX=p[0]-dx;
this.initPageY=p[1]-dy;
this.lastPageX=p[0];
this.lastPageY=p[1];
this.setStartPosition(p);
},setStartPosition:function(pos){
var p=pos||Dom.getXY(this.getEl());
this.deltaSetXY=null;
this.startPageX=p[0];
this.startPageY=p[1];
},addToGroup:function(_a9){
this.groups[_a9]=true;
this.DDM.regDragDrop(this,_a9);
},removeFromGroup:function(_aa){
if(this.groups[_aa]){
delete this.groups[_aa];
}
this.DDM.removeDDFromGroup(this,_aa);
},setDragElId:function(id){
this.dragElId=id;
},setHandleElId:function(id){
if(typeof id!=="string"){
id=Dom.generateId(id);
}
this.handleElId=id;
this.DDM.regHandle(this.id,id);
},setOuterHandleElId:function(id){
if(typeof id!=="string"){
id=Dom.generateId(id);
}
_7b.on(id,"mousedown",this.handleMouseDown,this,true);
this.setHandleElId(id);
this.hasOuterHandles=true;
},unreg:function(){
_7b.removeListener(this.id,"mousedown",this.handleMouseDown);
this._domRef=null;
this.DDM._remove(this);
},isLocked:function(){
return (this.DDM.isLocked()||this.locked);
},handleMouseDown:function(e,oDD){
var _b0=e.which||e.button;
if(this.primaryButtonOnly&&_b0>1){
return;
}
if(this.isLocked()){
return;
}
this.b4MouseDown(e);
this.onMouseDown(e);
this.DDM.refreshCache(this.groups);
var pt=new YAHOO.util.Point(_7b.getPageX(e),_7b.getPageY(e));
if(!this.hasOuterHandles&&!this.DDM.isOverTarget(pt,this)){
}else{
if(this.clickValidator(e)){
this.setStartPosition();
this.DDM.handleMouseDown(e,this);
this.DDM.stopEvent(e);
}else{
}
}
},clickValidator:function(e){
var _b3=_7b.getTarget(e);
return (this.isValidHandleChild(_b3)&&(this.id==this.handleElId||this.DDM.handleWasClicked(_b3,this.id)));
},addInvalidHandleType:function(_b4){
var _b5=_b4.toUpperCase();
this.invalidHandleTypes[_b5]=_b5;
},addInvalidHandleId:function(id){
if(typeof id!=="string"){
id=Dom.generateId(id);
}
this.invalidHandleIds[id]=id;
},addInvalidHandleClass:function(_b7){
this.invalidHandleClasses.push(_b7);
},removeInvalidHandleType:function(_b8){
var _b9=_b8.toUpperCase();
delete this.invalidHandleTypes[_b9];
},removeInvalidHandleId:function(id){
if(typeof id!=="string"){
id=Dom.generateId(id);
}
delete this.invalidHandleIds[id];
},removeInvalidHandleClass:function(_bb){
for(var i=0,len=this.invalidHandleClasses.length;i<len;++i){
if(this.invalidHandleClasses[i]==_bb){
delete this.invalidHandleClasses[i];
}
}
},isValidHandleChild:function(_be){
var _bf=true;
var _c0;
try{
_c0=_be.nodeName.toUpperCase();
}
catch(e){
_c0=_be.nodeName;
}
_bf=_bf&&!this.invalidHandleTypes[_c0];
_bf=_bf&&!this.invalidHandleIds[_be.id];
for(var i=0,len=this.invalidHandleClasses.length;_bf&&i<len;++i){
_bf=!Dom.hasClass(_be,this.invalidHandleClasses[i]);
}
return _bf;
},setXTicks:function(_c3,_c4){
this.xTicks=[];
this.xTickSize=_c4;
var _c5={};
for(var i=this.initPageX;i>=this.minX;i=i-_c4){
if(!_c5[i]){
this.xTicks[this.xTicks.length]=i;
_c5[i]=true;
}
}
for(i=this.initPageX;i<=this.maxX;i=i+_c4){
if(!_c5[i]){
this.xTicks[this.xTicks.length]=i;
_c5[i]=true;
}
}
this.xTicks.sort(this.DDM.numericSort);
},setYTicks:function(_c7,_c8){
this.yTicks=[];
this.yTickSize=_c8;
var _c9={};
for(var i=this.initPageY;i>=this.minY;i=i-_c8){
if(!_c9[i]){
this.yTicks[this.yTicks.length]=i;
_c9[i]=true;
}
}
for(i=this.initPageY;i<=this.maxY;i=i+_c8){
if(!_c9[i]){
this.yTicks[this.yTicks.length]=i;
_c9[i]=true;
}
}
this.yTicks.sort(this.DDM.numericSort);
},setXConstraint:function(_cb,_cc,_cd){
this.leftConstraint=parseInt(_cb,10);
this.rightConstraint=parseInt(_cc,10);
this.minX=this.initPageX-this.leftConstraint;
this.maxX=this.initPageX+this.rightConstraint;
if(_cd){
this.setXTicks(this.initPageX,_cd);
}
this.constrainX=true;
},clearConstraints:function(){
this.constrainX=false;
this.constrainY=false;
this.clearTicks();
},clearTicks:function(){
this.xTicks=null;
this.yTicks=null;
this.xTickSize=0;
this.yTickSize=0;
},setYConstraint:function(iUp,_cf,_d0){
this.topConstraint=parseInt(iUp,10);
this.bottomConstraint=parseInt(_cf,10);
this.minY=this.initPageY-this.topConstraint;
this.maxY=this.initPageY+this.bottomConstraint;
if(_d0){
this.setYTicks(this.initPageY,_d0);
}
this.constrainY=true;
},resetConstraints:function(){
if(this.initPageX||this.initPageX===0){
var dx=(this.maintainOffset)?this.lastPageX-this.initPageX:0;
var dy=(this.maintainOffset)?this.lastPageY-this.initPageY:0;
this.setInitPosition(dx,dy);
}else{
this.setInitPosition();
}
if(this.constrainX){
this.setXConstraint(this.leftConstraint,this.rightConstraint,this.xTickSize);
}
if(this.constrainY){
this.setYConstraint(this.topConstraint,this.bottomConstraint,this.yTickSize);
}
},getTick:function(val,_d4){
if(!_d4){
return val;
}else{
if(_d4[0]>=val){
return _d4[0];
}else{
for(var i=0,len=_d4.length;i<len;++i){
var _d7=i+1;
if(_d4[_d7]&&_d4[_d7]>=val){
var _d8=val-_d4[i];
var _d9=_d4[_d7]-val;
return (_d9>_d8)?_d4[i]:_d4[_d7];
}
}
return _d4[_d4.length-1];
}
}
},toString:function(){
return ("DragDrop "+this.id);
}};
})();
YAHOO.util.DD=function(id,_db,_dc){
if(id){
this.init(id,_db,_dc);
}
};
YAHOO.extend(YAHOO.util.DD,YAHOO.util.DragDrop,{scroll:true,autoOffset:function(_dd,_de){
var x=_dd-this.startPageX;
var y=_de-this.startPageY;
this.setDelta(x,y);
},setDelta:function(_e1,_e2){
this.deltaX=_e1;
this.deltaY=_e2;
},setDragElPos:function(_e3,_e4){
var el=this.getDragEl();
this.alignElWithMouse(el,_e3,_e4);
},alignElWithMouse:function(el,_e7,_e8){
var _e9=this.getTargetCoord(_e7,_e8);
if(!this.deltaSetXY){
var _ea=[_e9.x,_e9.y];
YAHOO.util.Dom.setXY(el,_ea);
var _eb=parseInt(YAHOO.util.Dom.getStyle(el,"left"),10);
var _ec=parseInt(YAHOO.util.Dom.getStyle(el,"top"),10);
this.deltaSetXY=[_eb-_e9.x,_ec-_e9.y];
}else{
YAHOO.util.Dom.setStyle(el,"left",(_e9.x+this.deltaSetXY[0])+"px");
YAHOO.util.Dom.setStyle(el,"top",(_e9.y+this.deltaSetXY[1])+"px");
}
this.cachePosition(_e9.x,_e9.y);
this.autoScroll(_e9.x,_e9.y,el.offsetHeight,el.offsetWidth);
},cachePosition:function(_ed,_ee){
if(_ed){
this.lastPageX=_ed;
this.lastPageY=_ee;
}else{
var _ef=YAHOO.util.Dom.getXY(this.getEl());
this.lastPageX=_ef[0];
this.lastPageY=_ef[1];
}
},autoScroll:function(x,y,h,w){
if(this.scroll){
var _f4=this.DDM.getClientHeight();
var _f5=this.DDM.getClientWidth();
var st=this.DDM.getScrollTop();
var sl=this.DDM.getScrollLeft();
var bot=h+y;
var _f9=w+x;
var _fa=(_f4+st-y-this.deltaY);
var _fb=(_f5+sl-x-this.deltaX);
var _fc=40;
var _fd=(document.all)?80:30;
if(bot>_f4&&_fa<_fc){
window.scrollTo(sl,st+_fd);
}
if(y<st&&st>0&&y-st<_fc){
window.scrollTo(sl,st-_fd);
}
if(_f9>_f5&&_fb<_fc){
window.scrollTo(sl+_fd,st);
}
if(x<sl&&sl>0&&x-sl<_fc){
window.scrollTo(sl-_fd,st);
}
}
},getTargetCoord:function(_fe,_ff){
var x=_fe-this.deltaX;
var y=_ff-this.deltaY;
if(this.constrainX){
if(x<this.minX){
x=this.minX;
}
if(x>this.maxX){
x=this.maxX;
}
}
if(this.constrainY){
if(y<this.minY){
y=this.minY;
}
if(y>this.maxY){
y=this.maxY;
}
}
x=this.getTick(x,this.xTicks);
y=this.getTick(y,this.yTicks);
return {x:x,y:y};
},applyConfig:function(){
YAHOO.util.DD.superclass.applyConfig.call(this);
this.scroll=(this.config.scroll!==false);
},b4MouseDown:function(e){
this.setStartPosition();
this.autoOffset(YAHOO.util.Event.getPageX(e),YAHOO.util.Event.getPageY(e));
},b4Drag:function(e){
this.setDragElPos(YAHOO.util.Event.getPageX(e),YAHOO.util.Event.getPageY(e));
},toString:function(){
return ("DD "+this.id);
}});
YAHOO.util.DDProxy=function(id,_105,_106){
if(id){
this.init(id,_105,_106);
this.initFrame();
}
};
YAHOO.util.DDProxy.dragElId="ygddfdiv";
YAHOO.extend(YAHOO.util.DDProxy,YAHOO.util.DD,{resizeFrame:true,centerFrame:false,createFrame:function(){
var self=this;
var body=document.body;
if(!body||!body.firstChild){
setTimeout(function(){
self.createFrame();
},50);
return;
}
var div=this.getDragEl();
if(!div){
div=document.createElement("div");
div.id=this.dragElId;
var s=div.style;
s.position="absolute";
s.visibility="hidden";
s.cursor="move";
s.border="2px solid #aaa";
s.zIndex=999;
body.insertBefore(div,body.firstChild);
}
},initFrame:function(){
this.createFrame();
},applyConfig:function(){
YAHOO.util.DDProxy.superclass.applyConfig.call(this);
this.resizeFrame=(this.config.resizeFrame!==false);
this.centerFrame=(this.config.centerFrame);
this.setDragElId(this.config.dragElId||YAHOO.util.DDProxy.dragElId);
},showFrame:function(_10b,_10c){
var el=this.getEl();
var _10e=this.getDragEl();
var s=_10e.style;
this._resizeProxy();
if(this.centerFrame){
this.setDelta(Math.round(parseInt(s.width,10)/2),Math.round(parseInt(s.height,10)/2));
}
this.setDragElPos(_10b,_10c);
YAHOO.util.Dom.setStyle(_10e,"visibility","visible");
},_resizeProxy:function(){
if(this.resizeFrame){
var DOM=YAHOO.util.Dom;
var el=this.getEl();
var _112=this.getDragEl();
var bt=parseInt(DOM.getStyle(_112,"borderTopWidth"),10);
var br=parseInt(DOM.getStyle(_112,"borderRightWidth"),10);
var bb=parseInt(DOM.getStyle(_112,"borderBottomWidth"),10);
var bl=parseInt(DOM.getStyle(_112,"borderLeftWidth"),10);
if(isNaN(bt)){
bt=0;
}
if(isNaN(br)){
br=0;
}
if(isNaN(bb)){
bb=0;
}
if(isNaN(bl)){
bl=0;
}
var _117=Math.max(0,el.offsetWidth-br-bl);
var _118=Math.max(0,el.offsetHeight-bt-bb);
DOM.setStyle(_112,"width",_117+"px");
DOM.setStyle(_112,"height",_118+"px");
}
},b4MouseDown:function(e){
this.setStartPosition();
var x=YAHOO.util.Event.getPageX(e);
var y=YAHOO.util.Event.getPageY(e);
this.autoOffset(x,y);
this.setDragElPos(x,y);
},b4StartDrag:function(x,y){
this.showFrame(x,y);
},b4EndDrag:function(e){
YAHOO.util.Dom.setStyle(this.getDragEl(),"visibility","hidden");
},endDrag:function(e){
var DOM=YAHOO.util.Dom;
var lel=this.getEl();
var del=this.getDragEl();
DOM.setStyle(del,"visibility","");
DOM.setStyle(lel,"visibility","hidden");
YAHOO.util.DDM.moveToEl(lel,del);
DOM.setStyle(del,"visibility","hidden");
DOM.setStyle(lel,"visibility","");
},toString:function(){
return ("DDProxy "+this.id);
}});
YAHOO.util.DDTarget=function(id,_124,_125){
if(id){
this.initTarget(id,_124,_125);
}
};
YAHOO.extend(YAHOO.util.DDTarget,YAHOO.util.DragDrop,{toString:function(){
return ("DDTarget "+this.id);
}});
YAHOO.register("dragdrop",YAHOO.util.DragDropMgr,{version:"2.2.0",build:"127"});


YAHOO.namespace("ext","ext.util","ext.grid");
YAHOO.ext.Strict=(document.compatMode=="CSS1Compat");
YAHOO.ext.SSL_SECURE_URL="javascript:false";
window.undefined=undefined;
Function.prototype.createCallback=function(){
var _1=arguments;
var _2=this;
return function(){
return _2.apply(window,_1);
};
};
Function.prototype.createDelegate=function(_3,_4,_5){
var _6=this;
return function(){
var _7=_4||arguments;
if(_5===true){
_7=Array.prototype.slice.call(arguments,0);
_7=_7.concat(_4);
}else{
if(typeof _5=="number"){
_7=Array.prototype.slice.call(arguments,0);
var _8=[_5,0].concat(_4);
Array.prototype.splice.apply(_7,_8);
}
}
return _6.apply(_3||window,_7);
};
};
Function.prototype.defer=function(_9,_a,_b,_c){
return setTimeout(this.createDelegate(_a,_b,_c),_9);
};
Function.prototype.createSequence=function(_d,_e){
if(typeof _d!="function"){
return this;
}
var _f=this;
return function(){
var _10=_f.apply(this||window,arguments);
_d.apply(_e||this||window,arguments);
return _10;
};
};
YAHOO.util.Event.on(window,"unload",function(){
delete Function.prototype.createSequence;
delete Function.prototype.defer;
delete Function.prototype.createDelegate;
delete Function.prototype.createCallback;
delete Function.prototype.createInterceptor;
});
Function.prototype.createInterceptor=function(fcn,_12){
if(typeof fcn!="function"){
return this;
}
var _13=this;
return function(){
fcn.target=this;
fcn.method=_13;
if(fcn.apply(_12||this||window,arguments)===false){
return;
}
return _13.apply(this||window,arguments);
};
};
YAHOO.ext.util.Browser=new function(){
var ua=navigator.userAgent.toLowerCase();
this.isOpera=(ua.indexOf("opera")>-1);
this.isSafari=(ua.indexOf("webkit")>-1);
this.isIE=(window.ActiveXObject);
this.isIE7=(ua.indexOf("msie 7")>-1);
this.isGecko=!this.isSafari&&(ua.indexOf("gecko")>-1);
if(ua.indexOf("windows")!=-1||ua.indexOf("win32")!=-1){
this.isWindows=true;
}else{
if(ua.indexOf("macintosh")!=-1){
this.isMac=true;
}
}
if(this.isIE&&!this.isIE7){
try{
document.execCommand("BackgroundImageCache",false,true);
}
catch(e){
}
}
}();
YAHOO.print=function(_15,_16,etc){
if(!YAHOO.ext._console){
var cs=YAHOO.ext.DomHelper.insertBefore(document.body.firstChild,{tag:"div",style:"width:250px;height:350px;overflow:auto;border:3px solid #c3daf9;"+"background:white;position:absolute;right:5px;top:5px;"+"font:normal 8pt arial,verdana,helvetica;z-index:50000;padding:5px;"},true);
new YAHOO.ext.Resizable(cs,{transparent:true,handles:"all",pinned:true,adjustments:[0,0],wrap:true,draggable:(YAHOO.util.DD?true:false)});
cs.on("dblclick",cs.hide);
YAHOO.ext._console=cs;
}
var msg="";
for(var i=0,len=arguments.length;i<len;i++){
msg+=arguments[i]+"<hr noshade style=\"color:#eeeeee;\" size=\"1\">";
}
YAHOO.ext._console.dom.innerHTML=msg+YAHOO.ext._console.dom.innerHTML;
YAHOO.ext._console.dom.scrollTop=0;
YAHOO.ext._console.show();
};
YAHOO.printf=function(_1c,_1d,_1e,etc){
var _20=Array.prototype.slice.call(arguments,1);
YAHOO.print(_1c.replace(/\{\{[^{}]*\}\}|\{(\d+)(,\s*([\w.]+))?\}/g,function(m,a1,a2,a3){
if(m.chatAt=="{"){
return m.slice(1,-1);
}
var rpl=_20[a1];
if(a3){
var f=eval(a3);
rpl=f(rpl);
}
return rpl?rpl:"";
}));
};
YAHOO.util.CustomEvent.prototype.fireDirect=function(){
var len=this.subscribers.length;
for(var i=0;i<len;++i){
var s=this.subscribers[i];
if(s){
var _2a=(s.override)?s.obj:this.scope;
if(s.fn.apply(_2a,arguments)===false){
return false;
}
}
}
return true;
};
YAHOO.extendX=function(_2b,_2c,_2d){
YAHOO.extend(_2b,_2c);
_2b.override=function(o){
YAHOO.override(_2b,o);
};
if(!_2b.prototype.override){
_2b.prototype.override=function(o){
for(var _30 in o){
this[_30]=o[_30];
}
};
}
if(_2d){
_2b.override(_2d);
}
};
YAHOO.override=function(_31,_32){
if(_32){
var p=_31.prototype;
for(var _34 in _32){
p[_34]=_32[_34];
}
}
};
YAHOO.ext.util.DelayedTask=function(fn,_36,_37){
var _38=null;
this.delay=function(_39,_3a,_3b,_3c){
if(_38){
clearTimeout(_38);
}
fn=_3a||fn;
_36=_3b||_36;
_37=_3c||_37;
_38=setTimeout(fn.createDelegate(_36,_37),_39);
};
this.cancel=function(){
if(_38){
clearTimeout(_38);
_38=null;
}
};
};
YAHOO.ext.KeyMap=function(el,_3e,_3f){
this.el=getEl(el);
this.eventName=_3f||"keydown";
this.bindings=[];
if(_3e instanceof Array){
for(var i=0,len=_3e.length;i<len;i++){
this.addBinding(_3e[i]);
}
}else{
this.addBinding(_3e);
}
this.keyDownDelegate=YAHOO.ext.EventManager.wrap(this.handleKeyDown,this,true);
this.enable();
};
YAHOO.ext.KeyMap.prototype={addBinding:function(_42){
var _43=_42.key,_44=_42.shift,_45=_42.ctrl,alt=_42.alt,fn=_42.fn,_48=_42.scope;
if(typeof _43=="string"){
var ks=[];
var _4a=_43.toUpperCase();
for(var j=0,len=_4a.length;j<len;j++){
ks.push(_4a.charCodeAt(j));
}
_43=ks;
}
var _4d=_43 instanceof Array;
var _4e=function(e){
if((!_44||e.shiftKey)&&(!_45||e.ctrlKey)&&(!alt||e.altKey)){
var k=e.getKey();
if(_4d){
for(var i=0,len=_43.length;i<len;i++){
if(_43[i]==k){
fn.call(_48||window,k,e);
return;
}
}
}else{
if(k==_43){
fn.call(_48||window,k,e);
}
}
}
};
this.bindings.push(_4e);
},handleKeyDown:function(e){
if(this.enabled){
var b=this.bindings;
for(var i=0,len=b.length;i<len;i++){
b[i](e);
}
}
},isEnabled:function(){
return this.enabled;
},enable:function(){
if(!this.enabled){
this.el.on(this.eventName,this.keyDownDelegate);
this.enabled=true;
}
},disable:function(){
if(this.enabled){
this.el.removeListener(this.eventName,this.keyDownDelegate);
this.enabled=false;
}
}};
YAHOO.ext.util.Observable=function(){
};
YAHOO.ext.util.Observable.prototype={fireEvent:function(){
var ce=this.events[arguments[0].toLowerCase()];
if(typeof ce=="object"){
return ce.fireDirect.apply(ce,Array.prototype.slice.call(arguments,1));
}else{
return true;
}
},addListener:function(_57,fn,_59,_5a){
_57=_57.toLowerCase();
var ce=this.events[_57];
if(!ce){
throw "You are trying to listen for an event that does not exist: \""+_57+"\".";
}
if(typeof ce=="boolean"){
ce=new YAHOO.util.CustomEvent(_57);
this.events[_57]=ce;
}
ce.subscribe(fn,_59,_5a);
},delayedListener:function(_5c,fn,_5e,_5f){
var _60=function(){
setTimeout(fn.createDelegate(_5e,arguments),_5f||1);
};
this.addListener(_5c,_60);
return _60;
},bufferedListener:function(_61,fn,_63,_64){
var _65=new YAHOO.ext.util.DelayedTask();
var _66=function(){
_65.delay(_64||250,fn,_63,Array.prototype.slice.call(arguments,0));
};
this.addListener(_61,_66);
return _66;
},removeListener:function(_67,fn,_69){
var ce=this.events[_67.toLowerCase()];
if(typeof ce=="object"){
ce.unsubscribe(fn,_69);
}
},purgeListeners:function(){
for(var evt in this.events){
if(typeof this.events[evt]=="object"){
this.events[evt].unsubscribeAll();
}
}
}};
YAHOO.ext.util.Observable.prototype.on=YAHOO.ext.util.Observable.prototype.addListener;
YAHOO.ext.util.Config={apply:function(obj,_6d,_6e){
if(_6e){
this.apply(obj,_6e);
}
if(_6d){
for(var _6f in _6d){
obj[_6f]=_6d[_6f];
}
}
return obj;
}};
if(!String.escape){
String.escape=function(_70){
return _70.replace(/('|\\)/g,"\\$1");
};
}
String.leftPad=function(val,_72,ch){
var _74=new String(val);
if(ch==null){
ch=" ";
}
while(_74.length<_72){
_74=ch+_74;
}
return _74;
};
if(YAHOO.util.Connect){
YAHOO.util.Connect.setHeader=function(o){
for(var _76 in this._http_header){
if(typeof this._http_header[_76]!="function"){
o.conn.setRequestHeader(_76,this._http_header[_76]);
}
}
delete this._http_header;
this._http_header={};
this._has_http_headers=false;
};
}
if(YAHOO.util.DragDrop){
YAHOO.util.DragDrop.prototype.defaultPadding={left:0,right:0,top:0,bottom:0};
YAHOO.util.DragDrop.prototype.constrainTo=function(_77,pad,_79){
if(typeof pad=="number"){
pad={left:pad,right:pad,top:pad,bottom:pad};
}
pad=pad||this.defaultPadding;
var b=getEl(this.getEl()).getBox();
var ce=getEl(_77);
var c=ce.dom==document.body?{x:0,y:0,width:YAHOO.util.Dom.getViewportWidth(),height:YAHOO.util.Dom.getViewportHeight()}:ce.getBox(_79||false);
var _7d=b.y-c.y;
var _7e=b.x-c.x;
this.resetConstraints();
this.setXConstraint(_7e-(pad.left||0),c.width-_7e-b.width-(pad.right||0));
this.setYConstraint(_7d-(pad.top||0),c.height-_7d-b.height-(pad.bottom||0));
};
}


YAHOO.ext.Element=function(_1,_2){
var _3=YAHOO.util.Dom.get(_1);
if(!_3){
return null;
}
if(!_2&&YAHOO.ext.Element.cache[_3.id]){
return YAHOO.ext.Element.cache[_3.id];
}
this.dom=_3;
this.id=this.dom.id;
this.visibilityMode=YAHOO.ext.Element.VISIBILITY;
this.originalDisplay=YAHOO.util.Dom.getStyle(this.dom,"display")||"";
if(this.autoDisplayMode){
if(this.originalDisplay=="none"){
this.setVisibilityMode(YAHOO.ext.Element.DISPLAY);
}
}
if(this.originalDisplay=="none"){
this.originalDisplay="";
}
this.defaultUnit="px";
};
YAHOO.ext.Element.prototype={setVisibilityMode:function(_4){
this.visibilityMode=_4;
return this;
},enableDisplayMode:function(_5){
this.setVisibilityMode(YAHOO.ext.Element.DISPLAY);
if(typeof _5!="undefined"){
this.originalDisplay=_5;
}
return this;
},animate:function(_6,_7,_8,_9,_a){
this.anim(_6,_7,_8,_9,_a);
return this;
},anim:function(_b,_c,_d,_e,_f){
_f=_f||YAHOO.util.Anim;
var _10=new _f(this.dom,_b,_c||0.35,_e||YAHOO.util.Easing.easeBoth);
if(_d){
if(!(_d instanceof Array)){
_10.onComplete.subscribe(_d,this,true);
}else{
for(var i=0;i<_d.length;i++){
var fn=_d[i];
if(fn){
_10.onComplete.subscribe(fn,this,true);
}
}
}
}
_10.animate();
},scrollIntoView:function(_13){
var c=getEl(_13||document.body,true);
var cp=c.getStyle("position");
var _16=false;
if(cp!="relative"&&cp!="absolute"){
c.setStyle("position","relative");
_16=true;
}
var el=this.dom;
var _18=parseInt(el.offsetTop,10);
var _19=_18+el.offsetHeight;
var _1a=parseInt(c.scrollTop,10);
var _1b=_1a+c.clientHeight;
if(_18<_1a){
c.scrollTop=_18;
}else{
if(_19>_1b){
c.scrollTop=_19-c.clientHeight;
}
}
if(_16){
c.setStyle("position",cp);
}
return this;
},autoHeight:function(_1c,_1d,_1e,_1f){
var _20=this.getHeight();
this.clip();
this.setHeight(1);
setTimeout(function(){
var _21=parseInt(this.dom.scrollHeight,10);
if(!_1c){
this.setHeight(_21);
this.unclip();
if(typeof _1e=="function"){
_1e();
}
}else{
this.setHeight(_20);
this.setHeight(_21,_1c,_1d,function(){
this.unclip();
if(typeof _1e=="function"){
_1e();
}
}.createDelegate(this),_1f);
}
}.createDelegate(this),0);
return this;
},isVisible:function(_22){
var vis=YAHOO.util.Dom.getStyle(this.dom,"visibility")!="hidden"&&YAHOO.util.Dom.getStyle(this.dom,"display")!="none";
if(!_22||!vis){
return vis;
}
var p=this.dom.parentNode;
while(p&&p.tagName.toLowerCase()!="body"){
if(YAHOO.util.Dom.getStyle(p,"visibility")=="hidden"||YAHOO.util.Dom.getStyle(p,"display")=="none"){
return false;
}
p=p.parentNode;
}
return true;
},select:function(_25,_26){
return YAHOO.ext.Element.select("#"+this.dom.id+" "+_25,_26);
},initDD:function(_27,_28,_29){
var dd=new YAHOO.util.DD(YAHOO.util.Dom.generateId(this.dom),_27,_28);
return YAHOO.ext.util.Config.apply(dd,_29);
},initDDProxy:function(_2b,_2c,_2d){
var dd=new YAHOO.util.DDProxy(YAHOO.util.Dom.generateId(this.dom),_2b,_2c);
return YAHOO.ext.util.Config.apply(dd,_2d);
},initDDTarget:function(_2f,_30,_31){
var dd=new YAHOO.util.DDTarget(YAHOO.util.Dom.generateId(this.dom),_2f,_30);
return YAHOO.ext.util.Config.apply(dd,_31);
},setVisible:function(_33,_34,_35,_36,_37){
if(!_34||!YAHOO.util.Anim){
if(this.visibilityMode==YAHOO.ext.Element.DISPLAY){
this.setDisplayed(_33);
}else{
YAHOO.util.Dom.setStyle(this.dom,"visibility",_33?"visible":"hidden");
}
}else{
this.setOpacity(_33?0:1);
YAHOO.util.Dom.setStyle(this.dom,"visibility","visible");
if(this.visibilityMode==YAHOO.ext.Element.DISPLAY){
this.setDisplayed(true);
}
var _38={opacity:{from:(_33?0:1),to:(_33?1:0)}};
var _39=new YAHOO.util.Anim(this.dom,_38,_35||0.35,_37||(_33?YAHOO.util.Easing.easeIn:YAHOO.util.Easing.easeOut));
_39.onComplete.subscribe((function(){
if(this.visibilityMode==YAHOO.ext.Element.DISPLAY){
this.setDisplayed(_33);
}else{
YAHOO.util.Dom.setStyle(this.dom,"visibility",_33?"visible":"hidden");
}
}).createDelegate(this));
if(_36){
_39.onComplete.subscribe(_36);
}
_39.animate();
}
return this;
},isDisplayed:function(){
return YAHOO.util.Dom.getStyle(this.dom,"display")!="none";
},toggle:function(_3a,_3b,_3c,_3d){
this.setVisible(!this.isVisible(),_3a,_3b,_3c,_3d);
return this;
},setDisplayed:function(_3e){
if(typeof _3e=="boolean"){
_3e=_3e?this.originalDisplay:"none";
}
YAHOO.util.Dom.setStyle(this.dom,"display",_3e);
return this;
},focus:function(){
try{
this.dom.focus();
}
catch(e){
}
return this;
},blur:function(){
try{
this.dom.blur();
}
catch(e){
}
return this;
},addClass:function(_3f){
if(_3f instanceof Array){
for(var i=0,len=_3f.length;i<len;i++){
this.addClass(_3f[i]);
}
}else{
if(!this.hasClass(_3f)){
this.dom.className=this.dom.className+" "+_3f;
}
}
return this;
},radioClass:function(_42){
var _43=this.dom.parentNode.childNodes;
for(var i=0;i<_43.length;i++){
var s=_43[i];
if(s.nodeType==1){
YAHOO.util.Dom.removeClass(s,_42);
}
}
this.addClass(_42);
return this;
},removeClass:function(_46){
if(_46 instanceof Array){
for(var i=0,len=_46.length;i<len;i++){
this.removeClass(_46[i]);
}
}else{
var re=new RegExp("(?:^|\\s+)"+_46+"(?:\\s+|$)","g");
var c=this.dom.className;
if(re.test(c)){
this.dom.className=c.replace(re," ");
}
}
return this;
},toggleClass:function(_4b){
if(this.hasClass(_4b)){
this.removeClass(_4b);
}else{
this.addClass(_4b);
}
return this;
},hasClass:function(_4c){
var re=new RegExp("(?:^|\\s+)"+_4c+"(?:\\s+|$)");
return re.test(this.dom.className);
},replaceClass:function(_4e,_4f){
this.removeClass(_4e);
this.addClass(_4f);
return this;
},getStyle:function(_50){
return YAHOO.util.Dom.getStyle(this.dom,_50);
},setStyle:function(_51,_52){
if(typeof _51=="string"){
YAHOO.util.Dom.setStyle(this.dom,_51,_52);
}else{
var D=YAHOO.util.Dom;
for(var _54 in _51){
if(typeof _51[_54]!="function"){
D.setStyle(this.dom,_54,_51[_54]);
}
}
}
return this;
},applyStyles:function(_55){
YAHOO.ext.DomHelper.applyStyles(this.dom,_55);
},getX:function(){
return YAHOO.util.Dom.getX(this.dom);
},getY:function(){
return YAHOO.util.Dom.getY(this.dom);
},getXY:function(){
return YAHOO.util.Dom.getXY(this.dom);
},setX:function(x,_57,_58,_59,_5a){
if(!_57||!YAHOO.util.Anim){
YAHOO.util.Dom.setX(this.dom,x);
}else{
this.setXY([x,this.getY()],_57,_58,_59,_5a);
}
return this;
},setY:function(y,_5c,_5d,_5e,_5f){
if(!_5c||!YAHOO.util.Anim){
YAHOO.util.Dom.setY(this.dom,y);
}else{
this.setXY([this.getX(),y],_5c,_5d,_5e,_5f);
}
return this;
},setLeft:function(_60){
YAHOO.util.Dom.setStyle(this.dom,"left",this.addUnits(_60));
return this;
},setTop:function(top){
YAHOO.util.Dom.setStyle(this.dom,"top",this.addUnits(top));
return this;
},setRight:function(_62){
YAHOO.util.Dom.setStyle(this.dom,"right",this.addUnits(_62));
return this;
},setBottom:function(_63){
YAHOO.util.Dom.setStyle(this.dom,"bottom",this.addUnits(_63));
return this;
},setXY:function(pos,_65,_66,_67,_68){
if(!_65||!YAHOO.util.Anim){
YAHOO.util.Dom.setXY(this.dom,pos);
}else{
this.anim({points:{to:pos}},_66,_67,_68,YAHOO.util.Motion);
}
return this;
},setLocation:function(x,y,_6b,_6c,_6d,_6e){
this.setXY([x,y],_6b,_6c,_6d,_6e);
return this;
},moveTo:function(x,y,_71,_72,_73,_74){
this.setXY([x,y],_71,_72,_73,_74);
return this;
},getRegion:function(){
return YAHOO.util.Dom.getRegion(this.dom);
},getHeight:function(_75){
var h=this.dom.offsetHeight;
return _75!==true?h:h-this.getBorderWidth("tb")-this.getPadding("tb");
},getWidth:function(_77){
var w=this.dom.offsetWidth;
return _77!==true?w:w-this.getBorderWidth("lr")-this.getPadding("lr");
},getSize:function(_79){
return {width:this.getWidth(_79),height:this.getHeight(_79)};
},adjustWidth:function(_7a){
if(typeof _7a=="number"){
if(this.autoBoxAdjust&&!this.isBorderBox()){
_7a-=(this.getBorderWidth("lr")+this.getPadding("lr"));
}
if(_7a<0){
_7a=0;
}
}
return _7a;
},adjustHeight:function(_7b){
if(typeof _7b=="number"){
if(this.autoBoxAdjust&&!this.isBorderBox()){
_7b-=(this.getBorderWidth("tb")+this.getPadding("tb"));
}
if(_7b<0){
_7b=0;
}
}
return _7b;
},setWidth:function(_7c,_7d,_7e,_7f,_80){
_7c=this.adjustWidth(_7c);
if(!_7d||!YAHOO.util.Anim){
YAHOO.util.Dom.setStyle(this.dom,"width",this.addUnits(_7c));
}else{
this.anim({width:{to:_7c}},_7e,_7f,_80||(_7c>this.getWidth()?YAHOO.util.Easing.easeOut:YAHOO.util.Easing.easeIn));
}
return this;
},setHeight:function(_81,_82,_83,_84,_85){
_81=this.adjustHeight(_81);
if(!_82||!YAHOO.util.Anim){
YAHOO.util.Dom.setStyle(this.dom,"height",this.addUnits(_81));
}else{
this.anim({height:{to:_81}},_83,_84,_85||(_81>this.getHeight()?YAHOO.util.Easing.easeOut:YAHOO.util.Easing.easeIn));
}
return this;
},setSize:function(_86,_87,_88,_89,_8a,_8b){
if(!_88||!YAHOO.util.Anim){
this.setWidth(_86);
this.setHeight(_87);
}else{
_86=this.adjustWidth(_86);
_87=this.adjustHeight(_87);
this.anim({width:{to:_86},height:{to:_87}},_89,_8a,_8b);
}
return this;
},setBounds:function(x,y,_8e,_8f,_90,_91,_92,_93){
if(!_90||!YAHOO.util.Anim){
this.setWidth(_8e);
this.setHeight(_8f);
this.setLocation(x,y);
}else{
_8e=this.adjustWidth(_8e);
_8f=this.adjustHeight(_8f);
this.anim({points:{to:[x,y]},width:{to:_8e},height:{to:_8f}},_91,_92,_93,YAHOO.util.Motion);
}
return this;
},setRegion:function(_94,_95,_96,_97,_98){
this.setBounds(_94.left,_94.top,_94.right-_94.left,_94.bottom-_94.top,_95,_96,_97,_98);
return this;
},addListener:function(_99,_9a,_9b,_9c){
YAHOO.util.Event.addListener(this.dom,_99,_9a,_9b||this,true);
return this;
},bufferedListener:function(_9d,fn,_9f,_a0){
var _a1=new YAHOO.ext.util.DelayedTask();
_9f=_9f||this;
var _a2=function(){
_a1.delay(_a0||250,fn,_9f,Array.prototype.slice.call(arguments,0));
};
this.addListener(_9d,_a2);
return _a2;
},addHandler:function(_a3,_a4,_a5,_a6,_a7){
var fn=YAHOO.ext.Element.createStopHandler(_a4,_a5,_a6||this,true);
YAHOO.util.Event.addListener(this.dom,_a3,fn);
return this;
},on:function(_a9,_aa,_ab,_ac){
YAHOO.util.Event.addListener(this.dom,_a9,_aa,_ab||this,true);
return this;
},addManagedListener:function(_ad,fn,_af,_b0){
return YAHOO.ext.EventManager.on(this.dom,_ad,fn,_af||this,true);
},mon:function(_b1,fn,_b3,_b4){
return YAHOO.ext.EventManager.on(this.dom,_b1,fn,_b3||this,true);
},removeListener:function(_b5,_b6,_b7){
YAHOO.util.Event.removeListener(this.dom,_b5,_b6);
return this;
},removeAllListeners:function(){
YAHOO.util.Event.purgeElement(this.dom);
return this;
},setOpacity:function(_b8,_b9,_ba,_bb,_bc){
if(!_b9||!YAHOO.util.Anim){
YAHOO.util.Dom.setStyle(this.dom,"opacity",_b8);
}else{
this.anim({opacity:{to:_b8}},_ba,_bb,_bc);
}
return this;
},getLeft:function(_bd){
if(!_bd){
return this.getX();
}else{
return parseInt(this.getStyle("left"),10)||0;
}
},getRight:function(_be){
if(!_be){
return this.getX()+this.getWidth();
}else{
return (this.getLeft(true)+this.getWidth())||0;
}
},getTop:function(_bf){
if(!_bf){
return this.getY();
}else{
return parseInt(this.getStyle("top"),10)||0;
}
},getBottom:function(_c0){
if(!_c0){
return this.getY()+this.getHeight();
}else{
return (this.getTop(true)+this.getHeight())||0;
}
},setAbsolutePositioned:function(_c1){
this.setStyle("position","absolute");
if(_c1){
this.setStyle("z-index",_c1);
}
return this;
},setRelativePositioned:function(_c2){
this.setStyle("position","relative");
if(_c2){
this.setStyle("z-index",_c2);
}
return this;
},clearPositioning:function(){
this.setStyle("position","");
this.setStyle("left","");
this.setStyle("right","");
this.setStyle("top","");
this.setStyle("bottom","");
return this;
},getPositioning:function(){
return {"position":this.getStyle("position"),"left":this.getStyle("left"),"right":this.getStyle("right"),"top":this.getStyle("top"),"bottom":this.getStyle("bottom")};
},getBorderWidth:function(_c3){
return this.addStyles(_c3,YAHOO.ext.Element.borders);
},getPadding:function(_c4){
return this.addStyles(_c4,YAHOO.ext.Element.paddings);
},setPositioning:function(_c5){
if(_c5.position){
this.setStyle("position",_c5.position);
}
if(_c5.left){
this.setLeft(_c5.left);
}
if(_c5.right){
this.setRight(_c5.right);
}
if(_c5.top){
this.setTop(_c5.top);
}
if(_c5.bottom){
this.setBottom(_c5.bottom);
}
return this;
},setLeftTop:function(_c6,top){
this.dom.style.left=this.addUnits(_c6);
this.dom.style.top=this.addUnits(top);
return this;
},move:function(_c8,_c9,_ca,_cb,_cc,_cd){
var xy=this.getXY();
_c8=_c8.toLowerCase();
switch(_c8){
case "l":
case "left":
this.moveTo(xy[0]-_c9,xy[1],_ca,_cb,_cc,_cd);
break;
case "r":
case "right":
this.moveTo(xy[0]+_c9,xy[1],_ca,_cb,_cc,_cd);
break;
case "t":
case "top":
case "up":
this.moveTo(xy[0],xy[1]-_c9,_ca,_cb,_cc,_cd);
break;
case "b":
case "bottom":
case "down":
this.moveTo(xy[0],xy[1]+_c9,_ca,_cb,_cc,_cd);
break;
}
return this;
},clip:function(){
if(!this.isClipped){
this.isClipped=true;
this.originalClip={"o":this.getStyle("overflow"),"x":this.getStyle("overflow-x"),"y":this.getStyle("overflow-y")};
this.setStyle("overflow","hidden");
this.setStyle("overflow-x","hidden");
this.setStyle("overflow-y","hidden");
}
return this;
},unclip:function(){
if(this.isClipped){
this.isClipped=false;
var o=this.originalClip;
if(o.o){
this.setStyle("overflow",o.o);
}
if(o.x){
this.setStyle("overflow-x",o.x);
}
if(o.y){
this.setStyle("overflow-y",o.y);
}
}
return this;
},alignTo:function(_d0,_d1,_d2,_d3,_d4,_d5,_d6){
var _d7=getEl(_d0);
if(!_d7){
return this;
}
_d2=_d2||[0,0];
var r=_d7.getRegion();
_d1=_d1.toLowerCase();
switch(_d1){
case "bl":
this.moveTo(r.left+_d2[0],r.bottom+_d2[1],_d3,_d4,_d5,_d6);
break;
case "br":
this.moveTo(r.right+_d2[0],r.bottom+_d2[1],_d3,_d4,_d5,_d6);
break;
case "tl":
this.moveTo(r.left+_d2[0],r.top+_d2[1],_d3,_d4,_d5,_d6);
break;
case "tr":
this.moveTo(r.right+_d2[0],r.top+_d2[1],_d3,_d4,_d5,_d6);
break;
}
return this;
},clearOpacity:function(){
if(window.ActiveXObject){
this.dom.style.filter="";
}else{
this.dom.style.opacity="";
this.dom.style["-moz-opacity"]="";
this.dom.style["-khtml-opacity"]="";
}
return this;
},hide:function(_d9,_da,_db,_dc){
this.setVisible(false,_d9,_da,_db,_dc);
return this;
},show:function(_dd,_de,_df,_e0){
this.setVisible(true,_dd,_de,_df,_e0);
return this;
},addUnits:function(_e1){
if(_e1===""||_e1=="auto"||typeof _e1=="undefined"){
return _e1;
}
if(typeof _e1=="number"||!YAHOO.ext.Element.unitPattern.test(_e1)){
return _e1+this.defaultUnit;
}
return _e1;
},beginMeasure:function(){
var el=this.dom;
if(el.offsetWidth||el.offsetHeight){
return this;
}
var _e3=[];
var p=this.dom;
while((!el.offsetWidth&&!el.offsetHeight)&&p&&p.tagName&&p.tagName.toLowerCase()!="body"){
if(YAHOO.util.Dom.getStyle(p,"display")=="none"){
_e3.push({el:p,visibility:YAHOO.util.Dom.getStyle(p,"visibility")});
p.style.visibility="hidden";
p.style.display="block";
}
p=p.parentNode;
}
this._measureChanged=_e3;
return this;
},endMeasure:function(){
var _e5=this._measureChanged;
if(_e5){
for(var i=0,len=_e5.length;i<len;i++){
var r=_e5[i];
r.el.style.visibility=r.visibility;
r.el.style.display="none";
}
this._measureChanged=null;
}
return this;
},update:function(_e9,_ea,_eb){
if(typeof _e9=="undefined"){
_e9="";
}
if(_ea!==true){
this.dom.innerHTML=_e9;
if(typeof _eb=="function"){
_eb();
}
return this;
}
var id=YAHOO.util.Dom.generateId();
var dom=this.dom;
_e9+="<span id=\""+id+"\"></span>";
YAHOO.util.Event.onAvailable(id,function(){
var hd=document.getElementsByTagName("head")[0];
var re=/(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/img;
var _f0=/\ssrc=([\'\"])(.*?)\1/i;
var _f1;
while(_f1=re.exec(_e9)){
var _f2=_f1[0].match(_f0);
if(_f2&&_f2[2]){
var s=document.createElement("script");
s.src=_f2[2];
hd.appendChild(s);
}else{
if(_f1[1]&&_f1[1].length>0){
eval(_f1[1]);
}
}
}
var el=document.getElementById(id);
if(el){
el.parentNode.removeChild(el);
}
if(typeof _eb=="function"){
_eb();
}
});
dom.innerHTML=_e9.replace(/(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/img,"");
return this;
},load:function(){
var um=this.getUpdateManager();
um.update.apply(um,arguments);
return this;
},getUpdateManager:function(){
if(!this.updateManager){
this.updateManager=new YAHOO.ext.UpdateManager(this);
}
return this.updateManager;
},unselectable:function(){
this.dom.unselectable="on";
this.swallowEvent("selectstart",true);
this.applyStyles("-moz-user-select:none;-khtml-user-select:none;");
return this;
},getCenterXY:function(_f6){
var _f7=Math.round((YAHOO.util.Dom.getViewportWidth()-this.getWidth())/2);
var _f8=Math.round((YAHOO.util.Dom.getViewportHeight()-this.getHeight())/2);
if(!_f6){
return [_f7,_f8];
}else{
var _f9=document.documentElement.scrollLeft||document.body.scrollLeft||0;
var _fa=document.documentElement.scrollTop||document.body.scrollTop||0;
return [_f7+_f9,_f8+_fa];
}
},center:function(_fb){
if(!_fb){
this.setXY(this.getCenterXY(true));
}else{
var box=YAHOO.ext.Element.get(_fb).getBox();
this.setXY([box.x+(box.width/2)-(this.getWidth()/2),box.y+(box.height/2)-(this.getHeight()/2)]);
}
return this;
},getChildrenByTagName:function(_fd){
var _fe=this.dom.getElementsByTagName(_fd);
var len=_fe.length;
var ce=new Array(len);
for(var i=0;i<len;++i){
ce[i]=YAHOO.ext.Element.get(_fe[i],true);
}
return ce;
},getChildrenByClassName:function(_102,_103){
var _104=YAHOO.util.Dom.getElementsByClassName(_102,_103,this.dom);
var len=_104.length;
var ce=new Array(len);
for(var i=0;i<len;++i){
ce[i]=YAHOO.ext.Element.get(_104[i],true);
}
return ce;
},isBorderBox:function(){
if(typeof this.bbox=="undefined"){
var el=this.dom;
var b=YAHOO.ext.util.Browser;
var _10a=YAHOO.ext.Strict;
this.bbox=((b.isIE&&!_10a&&el.style.boxSizing!="content-box")||(b.isGecko&&YAHOO.util.Dom.getStyle(el,"-moz-box-sizing")=="border-box")||(!b.isSafari&&YAHOO.util.Dom.getStyle(el,"box-sizing")=="border-box"));
}
return this.bbox;
},getBox:function(_10b,_10c){
var xy;
if(!_10c){
xy=this.getXY();
}else{
var left=parseInt(YAHOO.util.Dom.getStyle("left"),10)||0;
var top=parseInt(YAHOO.util.Dom.getStyle("top"),10)||0;
xy=[left,top];
}
var el=this.dom;
var w=el.offsetWidth;
var h=el.offsetHeight;
if(!_10b){
return {x:xy[0],y:xy[1],width:w,height:h};
}else{
var l=this.getBorderWidth("l")+this.getPadding("l");
var r=this.getBorderWidth("r")+this.getPadding("r");
var t=this.getBorderWidth("t")+this.getPadding("t");
var b=this.getBorderWidth("b")+this.getPadding("b");
return {x:xy[0]+l,y:xy[1]+t,width:w-(l+r),height:h-(t+b)};
}
},setBox:function(box,_118,_119,_11a,_11b,_11c){
var w=box.width,h=box.height;
if((_118&&!this.autoBoxAdjust)&&!this.isBorderBox()){
w-=(this.getBorderWidth("lr")+this.getPadding("lr"));
h-=(this.getBorderWidth("tb")+this.getPadding("tb"));
}
this.setBounds(box.x,box.y,w,h,_119,_11a,_11b,_11c);
return this;
},repaint:function(){
var dom=this.dom;
YAHOO.util.Dom.addClass(dom,"yui-ext-repaint");
setTimeout(function(){
YAHOO.util.Dom.removeClass(dom,"yui-ext-repaint");
},1);
return this;
},getMargins:function(side){
if(!side){
return {top:parseInt(this.getStyle("margin-top"),10)||0,left:parseInt(this.getStyle("margin-left"),10)||0,bottom:parseInt(this.getStyle("margin-bottom"),10)||0,right:parseInt(this.getStyle("margin-right"),10)||0};
}else{
return this.addStyles(side,YAHOO.ext.Element.margins);
}
},addStyles:function(_121,_122){
var val=0;
for(var i=0,len=_121.length;i<len;i++){
var w=parseInt(this.getStyle(_122[_121.charAt(i)]),10);
if(!isNaN(w)){
val+=w;
}
}
return val;
},createProxy:function(_127,_128,_129){
if(_128){
_128=YAHOO.util.Dom.get(_128);
}else{
_128=document.body;
}
_127=typeof _127=="object"?_127:{tag:"div",cls:_127};
var _12a=YAHOO.ext.DomHelper.append(_128,_127,true);
if(_129){
_12a.setBox(this.getBox());
}
return _12a;
},createShim:function(){
var _12b={tag:"iframe",frameBorder:"no",cls:"yiframe-shim",style:"position:absolute;visibility:hidden;left:0;top:0;overflow:hidden;",src:YAHOO.ext.SSL_SECURE_URL};
var shim=YAHOO.ext.DomHelper.append(this.dom.parentNode,_12b,true);
shim.setBox(this.getBox());
return shim;
},remove:function(){
this.dom.parentNode.removeChild(this.dom);
delete YAHOO.ext.Element.cache[this.dom.id];
},addClassOnOver:function(_12d){
this.on("mouseover",function(){
this.addClass(_12d);
},this,true);
this.on("mouseout",function(){
this.removeClass(_12d);
},this,true);
return this;
},swallowEvent:function(_12e,_12f){
var fn=function(e){
e.stopPropagation();
if(_12f){
e.preventDefault();
}
};
this.mon(_12e,fn);
return this;
},fitToParent:function(_132){
var p=getEl(this.dom.parentNode,true);
p.beginMeasure();
var box=p.getBox(true,true);
p.endMeasure();
this.setSize(box.width,box.height);
if(_132===true){
YAHOO.ext.EventManager.onWindowResize(this.fitToParent,this,true);
}
return this;
},getNextSibling:function(){
var n=this.dom.nextSibling;
while(n&&n.nodeType!=1){
n=n.nextSibling;
}
return n;
},getPrevSibling:function(){
var n=this.dom.previousSibling;
while(n&&n.nodeType!=1){
n=n.previousSibling;
}
return n;
},appendChild:function(el){
el=getEl(el);
el.appendTo(this);
return this;
},createChild:function(_138,_139){
var c;
if(_139){
c=YAHOO.ext.DomHelper.insertBefore(_139,_138,true);
}else{
c=YAHOO.ext.DomHelper.append(this.dom,_138,true);
}
return c;
},appendTo:function(el){
var node=getEl(el).dom;
node.appendChild(this.dom);
return this;
},insertBefore:function(el){
var node=getEl(el).dom;
node.parentNode.insertBefore(this.dom,node);
return this;
},insertAfter:function(el){
var node=getEl(el).dom;
node.parentNode.insertBefore(this.dom,node.nextSibling);
return this;
},wrap:function(_141){
if(!_141){
_141={tag:"div"};
}
var _142=YAHOO.ext.DomHelper.insertBefore(this.dom,_141,true);
_142.dom.appendChild(this.dom);
return _142;
},replace:function(el){
el=getEl(el);
this.insertBefore(el);
el.remove();
return this;
},insertHtml:function(_144,html){
YAHOO.ext.DomHelper.insertHtml(_144,this.dom,html);
return this;
},set:function(o){
var el=this.dom;
var _148=el.setAttribute?true:false;
for(var attr in o){
if(attr=="style"||typeof o[attr]=="function"){
continue;
}
if(attr=="cls"){
el.className=o["cls"];
}else{
if(_148){
el.setAttribute(attr,o[attr]);
}else{
el[attr]=o[attr];
}
}
}
YAHOO.ext.DomHelper.applyStyles(el,o.style);
return this;
},addKeyListener:function(key,fn,_14c){
var _14d;
if(typeof key!="object"||key instanceof Array){
_14d={key:key,fn:fn,scope:_14c};
}else{
_14d={key:key.key,shift:key.shift,ctrl:key.ctrl,alt:key.alt,fn:fn,scope:_14c};
}
var map=new YAHOO.ext.KeyMap(this,_14d);
return map;
},addKeyMap:function(_14f){
return new YAHOO.ext.KeyMap(this,_14f);
}};
YAHOO.ext.Element.prototype.autoBoxAdjust=true;
YAHOO.ext.Element.prototype.autoDisplayMode=true;
YAHOO.ext.Element.unitPattern=/\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i;
YAHOO.ext.Element.VISIBILITY=1;
YAHOO.ext.Element.DISPLAY=2;
YAHOO.ext.Element.blockElements=/^(?:address|blockquote|center|dir|div|dl|fieldset|form|h\d|hr|isindex|menu|ol|ul|p|pre|table|dd|dt|li|tbody|tr|td|thead|tfoot|iframe)$/i;
YAHOO.ext.Element.borders={l:"border-left-width",r:"border-right-width",t:"border-top-width",b:"border-bottom-width"};
YAHOO.ext.Element.paddings={l:"padding-left",r:"padding-right",t:"padding-top",b:"padding-bottom"};
YAHOO.ext.Element.margins={l:"margin-left",r:"margin-right",t:"margin-top",b:"margin-bottom"};
YAHOO.ext.Element.createStopHandler=function(_150,_151,_152,_153){
return function(e){
if(e){
if(_150){
YAHOO.util.Event.stopEvent(e);
}else{
YAHOO.util.Event.preventDefault(e);
}
}
_151.call(_153&&_152?_152:window,e,_152);
};
};
YAHOO.ext.Element.cache={};
YAHOO.ext.Element.get=function(el,_156){
if(!el){
return null;
}
_156=true;
if(el instanceof YAHOO.ext.Element){
el.dom=YAHOO.util.Dom.get(el.id);
YAHOO.ext.Element.cache[el.id]=el;
return el;
}else{
if(el.isComposite){
return el;
}else{
if(el instanceof Array){
return YAHOO.ext.Element.select(el);
}else{
if(el===document){
if(!YAHOO.ext.Element.cache["__ydocument"]){
var _157=function(){
};
_157.prototype=YAHOO.ext.Element.prototype;
var o=new _157();
o.dom=document;
YAHOO.ext.Element.cache["__ydocument"]=o;
}
return YAHOO.ext.Element.cache["__ydocument"];
}
}
}
}
var key=el;
if(typeof el!="string"){
if(!el.id&&!_156){
return null;
}
YAHOO.util.Dom.generateId(el,"elgen-");
key=el.id;
}
var _15a=YAHOO.ext.Element.cache[key];
if(!_15a){
_15a=new YAHOO.ext.Element(key);
if(!_15a.dom){
return null;
}
YAHOO.ext.Element.cache[key]=_15a;
}else{
_15a.dom=YAHOO.util.Dom.get(key);
}
return _15a;
};
var getEl=YAHOO.ext.Element.get;
YAHOO.util.Event.addListener(window,"unload",function(){
YAHOO.ext.Element.cache=null;
});


YAHOO.ext.DomHelper=new function(){
var d=document;
var _2=null;
this.useDom=false;
var _3=/^(?:base|basefont|br|frame|hr|img|input|isindex|link|meta|nextid|range|spacer|wbr|audioscope|area|param|keygen|col|limittext|spot|tab|over|right|left|choose|atop|of)$/i;
this.applyStyles=function(el,_5){
if(_5){
var D=YAHOO.util.Dom;
if(typeof _5=="string"){
var re=/\s?([a-z\-]*)\:([^;]*);?/gi;
var _8;
while((_8=re.exec(_5))!=null){
D.setStyle(el,_8[1],_8[2]);
}
}else{
if(typeof _5=="object"){
for(var _9 in _5){
D.setStyle(el,_9,_5[_9]);
}
}else{
if(typeof _5=="function"){
YAHOO.ext.DomHelper.applyStyles(el,_5.call());
}
}
}
}
};
var _a=function(o){
var b="";
b+="<"+o.tag;
for(var _d in o){
if(_d=="tag"||_d=="children"||_d=="html"||typeof o[_d]=="function"){
continue;
}
if(_d=="style"){
var s=o["style"];
if(typeof s=="function"){
s=s.call();
}
if(typeof s=="string"){
b+=" style=\""+s+"\"";
}else{
if(typeof s=="object"){
b+=" style=\"";
for(var _f in s){
if(typeof s[_f]!="function"){
b+=_f+":"+s[_f]+";";
}
}
b+="\"";
}
}
}else{
if(_d=="cls"){
b+=" class=\""+o["cls"]+"\"";
}else{
if(_d=="htmlFor"){
b+=" for=\""+o["htmlFor"]+"\"";
}else{
b+=" "+_d+"=\""+o[_d]+"\"";
}
}
}
}
if(_3.test(o.tag)){
b+=" />";
}else{
b+=">";
if(o.children){
for(var i=0,len=o.children.length;i<len;i++){
b+=_a(o.children[i],b);
}
}
if(o.html){
b+=o.html;
}
b+="</"+o.tag+">";
}
return b;
};
var _12=function(o,_14){
var el=d.createElement(o.tag);
var _16=el.setAttribute?true:false;
for(var _17 in o){
if(_17=="tag"||_17=="children"||_17=="html"||_17=="style"||typeof o[_17]=="function"){
continue;
}
if(_17=="cls"){
el.className=o["cls"];
}else{
if(_16){
el.setAttribute(_17,o[_17]);
}else{
el[_17]=o[_17];
}
}
}
YAHOO.ext.DomHelper.applyStyles(el,o.style);
if(o.children){
for(var i=0,len=o.children.length;i<len;i++){
_12(o.children[i],el);
}
}
if(o.html){
el.innerHTML=o.html;
}
if(_14){
_14.appendChild(el);
}
return el;
};
var _1a=function(tag,_1c,el,_1e){
if(!_2){
_2=document.createElement("div");
}
var _1f;
if(tag=="table"||tag=="tbody"){
_2.innerHTML="<table><tbody>"+_1e+"</tbody></table>";
_1f=_2.firstChild.firstChild.firstChild;
}else{
_2.innerHTML="<table><tbody><tr>"+_1e+"</tr></tbody></table>";
_1f=_2.firstChild.firstChild.firstChild.firstChild;
}
if(_1c=="beforebegin"){
el.parentNode.insertBefore(_1f,el);
return _1f;
}else{
if(_1c=="afterbegin"){
el.insertBefore(_1f,el.firstChild);
return _1f;
}else{
if(_1c=="beforeend"){
el.appendChild(_1f);
return _1f;
}else{
if(_1c=="afterend"){
el.parentNode.insertBefore(_1f,el.nextSibling);
return _1f;
}
}
}
}
};
this.insertHtml=function(_20,el,_22){
_20=_20.toLowerCase();
if(el.insertAdjacentHTML){
var tag=el.tagName.toLowerCase();
if(tag=="table"||tag=="tbody"||tag=="tr"){
return _1a(tag,_20,el,_22);
}
switch(_20){
case "beforebegin":
el.insertAdjacentHTML(_20,_22);
return el.previousSibling;
case "afterbegin":
el.insertAdjacentHTML(_20,_22);
return el.firstChild;
case "beforeend":
el.insertAdjacentHTML(_20,_22);
return el.lastChild;
case "afterend":
el.insertAdjacentHTML(_20,_22);
return el.nextSibling;
}
throw "Illegal insertion point -> \""+_20+"\"";
}
var _24=el.ownerDocument.createRange();
var _25;
switch(_20){
case "beforebegin":
_24.setStartBefore(el);
_25=_24.createContextualFragment(_22);
el.parentNode.insertBefore(_25,el);
return el.previousSibling;
case "afterbegin":
if(el.firstChild){
_24.setStartBefore(el.firstChild);
}else{
_24.selectNodeContents(el);
_24.collapse(true);
}
_25=_24.createContextualFragment(_22);
el.insertBefore(_25,el.firstChild);
return el.firstChild;
case "beforeend":
if(el.lastChild){
_24.setStartAfter(el.lastChild);
}else{
_24.selectNodeContents(el);
_24.collapse(false);
}
_25=_24.createContextualFragment(_22);
el.appendChild(_25);
return el.lastChild;
case "afterend":
_24.setStartAfter(el);
_25=_24.createContextualFragment(_22);
el.parentNode.insertBefore(_25,el.nextSibling);
return el.nextSibling;
}
throw "Illegal insertion point -> \""+_20+"\"";
};
this.insertBefore=function(el,o,_28){
el=YAHOO.util.Dom.get(el);
var _29;
if(this.useDom){
_29=_12(o,null);
el.parentNode.insertBefore(_29,el);
}else{
var _2a=_a(o);
_29=this.insertHtml("beforeBegin",el,_2a);
}
return _28?YAHOO.ext.Element.get(_29,true):_29;
};
this.insertAfter=function(el,o,_2d){
el=YAHOO.util.Dom.get(el);
var _2e;
if(this.useDom){
_2e=_12(o,null);
el.parentNode.insertBefore(_2e,el.nextSibling);
}else{
var _2f=_a(o);
_2e=this.insertHtml("afterEnd",el,_2f);
}
return _2d?YAHOO.ext.Element.get(_2e,true):_2e;
};
this.append=function(el,o,_32){
el=YAHOO.util.Dom.get(el);
var _33;
if(this.useDom){
_33=_12(o,null);
el.appendChild(_33);
}else{
var _34=_a(o);
_33=this.insertHtml("beforeEnd",el,_34);
}
return _32?YAHOO.ext.Element.get(_33,true):_33;
};
this.overwrite=function(el,o,_37){
el=YAHOO.util.Dom.get(el);
el.innerHTML=_a(o);
return _37?YAHOO.ext.Element.get(el.firstChild,true):el.firstChild;
};
this.createTemplate=function(o){
var _39=_a(o);
return new YAHOO.ext.DomHelper.Template(_39);
};
}();
YAHOO.ext.DomHelper.Template=function(_3a){
this.html=_3a;
};
YAHOO.ext.DomHelper.Template.prototype={applyTemplate:function(_3b){
if(this.compiled){
return this.compiled(_3b);
}
var _3c="";
var fn=function(_3e,_3f){
if(typeof _3b[_3f]!="undefined"){
return _3b[_3f];
}else{
return _3c;
}
};
return this.html.replace(this.re,fn);
},re:/\{(\w+)\}/g,compile:function(){
var _40=this.html;
var re=this.re;
var _42=[];
_42.push("this.compiled = function(values){ return [");
var _43;
var _44=0;
while((_43=re.exec(_40))!=null){
_42.push("'",_40.substring(_44,_43.index),"', ");
_42.push("values['",_40.substring(_43.index+1,re.lastIndex-1),"'], ");
_44=re.lastIndex;
}
_42.push("'",_40.substr(_44),"'].join('');};");
eval(_42.join(""));
},insertBefore:function(el,_46,_47){
el=YAHOO.util.Dom.get(el);
var _48=YAHOO.ext.DomHelper.insertHtml("beforeBegin",el,this.applyTemplate(_46));
return _47?YAHOO.ext.Element.get(_48,true):_48;
},insertAfter:function(el,_4a,_4b){
el=YAHOO.util.Dom.get(el);
var _4c=YAHOO.ext.DomHelper.insertHtml("afterEnd",el,this.applyTemplate(_4a));
return _4b?YAHOO.ext.Element.get(_4c,true):_4c;
},append:function(el,_4e,_4f){
el=YAHOO.util.Dom.get(el);
var _50=YAHOO.ext.DomHelper.insertHtml("beforeEnd",el,this.applyTemplate(_4e));
return _4f?YAHOO.ext.Element.get(_50,true):_50;
},overwrite:function(el,_52,_53){
el=YAHOO.util.Dom.get(el);
el.innerHTML="";
var _54=YAHOO.ext.DomHelper.insertHtml("beforeEnd",el,this.applyTemplate(_52));
return _53?YAHOO.ext.Element.get(_54,true):_54;
}};
YAHOO.ext.Template=YAHOO.ext.DomHelper.Template;


YAHOO.ext.CompositeElement=function(_1){
this.elements=[];
this.addElements(_1);
};
YAHOO.ext.CompositeElement.prototype={isComposite:true,addElements:function(_2){
if(!_2){
return this;
}
var _3=this.elements;
var _4=_3.length-1;
for(var i=0,_6=_2.length;i<_6;i++){
_3[++_4]=getEl(_2[i],true);
}
return this;
},invoke:function(fn,_8){
var _9=this.elements;
for(var i=0,_b=_9.length;i<_b;i++){
YAHOO.ext.Element.prototype[fn].apply(_9[i],_8);
}
return this;
},add:function(_c){
if(typeof _c=="string"){
this.addElements(YAHOO.ext.Element.selectorFunction(string));
}else{
if(_c instanceof Array){
this.addElements(_c);
}else{
this.addElements([_c]);
}
}
return this;
},each:function(fn,_e){
var _f=this.elements;
for(var i=0,len=_f.length;i<len;i++){
fn.call(_e||_f[i],_f[i],this,i);
}
return this;
}};
YAHOO.ext.CompositeElementLite=function(els){
YAHOO.ext.CompositeElementLite.superclass.constructor.call(this,els);
this.el=YAHOO.ext.Element.get(this.elements[0],true);
};
YAHOO.extendX(YAHOO.ext.CompositeElementLite,YAHOO.ext.CompositeElement,{addElements:function(els){
if(els){
this.elements=this.elements.concat(els);
}
return this;
},invoke:function(fn,_15){
var els=this.elements;
var el=this.el;
for(var i=0,len=els.length;i<len;i++){
el.dom=els[i];
YAHOO.ext.Element.prototype[fn].apply(el,_15);
}
return this;
}});
YAHOO.ext.CompositeElement.createCall=function(_1a,_1b){
if(!_1a[_1b]){
_1a[_1b]=function(){
return this.invoke(_1b,arguments);
};
}
};
for(var fnName in YAHOO.ext.Element.prototype){
if(typeof YAHOO.ext.Element.prototype[fnName]=="function"){
YAHOO.ext.CompositeElement.createCall(YAHOO.ext.CompositeElement.prototype,fnName);
}
}
if(typeof cssQuery=="function"){
YAHOO.ext.Element.selectorFunction=cssQuery;
}else{
if(typeof document.getElementsBySelector=="function"){
YAHOO.ext.Element.selectorFunction=document.getElementsBySelector.createDelegate(document);
}
}
YAHOO.ext.Element.select=function(_1c,_1d){
var els;
if(typeof _1c=="string"){
els=YAHOO.ext.Element.selectorFunction(_1c);
}else{
if(_1c instanceof Array){
els=_1c;
}else{
throw "Invalid selector";
}
}
if(_1d===true){
return new YAHOO.ext.CompositeElement(els);
}else{
return new YAHOO.ext.CompositeElementLite(els);
}
};
var getEls=YAHOO.ext.Element.select;


YAHOO.ext.EventManager=new function(){
var _1;
var _2;
var _3=false;
this.ieDeferSrc=false;
var _4;
var _5;
var _6=function(){
if(!_3){
_3=true;
if(_2){
clearInterval(_2);
}
if(_1){
_1.fire();
}
}
};
var _7=function(){
_1=new YAHOO.util.CustomEvent("documentready");
if(document.addEventListener){
YAHOO.util.Event.on(document,"DOMContentLoaded",_6);
}else{
if(YAHOO.ext.util.Browser.isIE){
document.write("<s"+"cript id=\"ie-deferred-loader\" defer=\"defer\" src=\""+(YAHOO.ext.EventManager.ieDeferSrc||YAHOO.ext.SSL_SECURE_URL)+"\"></s"+"cript>");
YAHOO.util.Event.on("ie-deferred-loader","readystatechange",function(){
if(this.readyState=="complete"){
_6();
}
});
}else{
if(YAHOO.ext.util.Browser.isSafari){
_2=setInterval(function(){
var rs=document.readyState;
if(rs=="loaded"||rs=="complete"){
_6();
}
},10);
}
}
}
YAHOO.util.Event.on(window,"load",_6);
};
this.wrap=function(fn,_a,_b){
var _c=function(e){
YAHOO.ext.EventObject.setEvent(e);
fn.call(_b?_a||window:window,YAHOO.ext.EventObject,_a);
};
return _c;
};
this.addListener=function(_e,_f,fn,_11,_12){
var _13=this.wrap(fn,_11,_12);
YAHOO.util.Event.addListener(_e,_f,_13);
return _13;
};
this.removeListener=function(_14,_15,_16){
return YAHOO.util.Event.removeListener(_14,_15,_16);
};
this.on=this.addListener;
this.onDocumentReady=function(fn,_18,_19){
if(_3){
fn.call(_19?_18||window:window,_18);
return;
}
if(!_1){
_7();
}
_1.subscribe(fn,_18,_19);
};
this.onWindowResize=function(fn,_1b,_1c){
if(!_4){
_4=new YAHOO.util.CustomEvent("windowresize");
_5=new YAHOO.ext.util.DelayedTask(function(){
_4.fireDirect(YAHOO.util.Dom.getViewportWidth(),YAHOO.util.Dom.getViewportHeight());
});
YAHOO.util.Event.on(window,"resize",function(){
_5.delay(50);
});
}
_4.subscribe(fn,_1b,_1c);
},this.removeResizeListener=function(fn,_1e){
if(_4){
_4.unsubscribe(fn,_1e);
}
};
};
YAHOO.ext.EventObject=new function(){
this.browserEvent=null;
this.button=-1;
this.shiftKey=false;
this.ctrlKey=false;
this.altKey=false;
this.BACKSPACE=8;
this.TAB=9;
this.RETURN=13;
this.ESC=27;
this.SPACE=32;
this.PAGEUP=33;
this.PAGEDOWN=34;
this.END=35;
this.HOME=36;
this.LEFT=37;
this.UP=38;
this.RIGHT=39;
this.DOWN=40;
this.DELETE=46;
this.F5=116;
this.setEvent=function(e){
if(e==this){
return this;
}
this.browserEvent=e;
if(e){
this.button=e.button;
this.shiftKey=e.shiftKey;
this.ctrlKey=e.ctrlKey;
this.altKey=e.altKey;
}else{
this.button=-1;
this.shiftKey=false;
this.ctrlKey=false;
this.altKey=false;
}
return this;
};
this.stopEvent=function(){
if(this.browserEvent){
YAHOO.util.Event.stopEvent(this.browserEvent);
}
};
this.preventDefault=function(){
if(this.browserEvent){
YAHOO.util.Event.preventDefault(this.browserEvent);
}
};
this.isNavKeyPress=function(){
return (this.browserEvent.keyCode&&this.browserEvent.keyCode>=33&&this.browserEvent.keyCode<=40);
};
this.stopPropagation=function(){
if(this.browserEvent){
YAHOO.util.Event.stopPropagation(this.browserEvent);
}
};
this.getCharCode=function(){
if(this.browserEvent){
return YAHOO.util.Event.getCharCode(this.browserEvent);
}
return null;
};
this.getKey=function(){
if(this.browserEvent){
return this.browserEvent.keyCode||this.browserEvent.charCode;
}
return null;
};
this.getPageX=function(){
if(this.browserEvent){
return YAHOO.util.Event.getPageX(this.browserEvent);
}
return null;
};
this.getPageY=function(){
if(this.browserEvent){
return YAHOO.util.Event.getPageY(this.browserEvent);
}
return null;
};
this.getTime=function(){
if(this.browserEvent){
return YAHOO.util.Event.getTime(this.browserEvent);
}
return null;
};
this.getXY=function(){
if(this.browserEvent){
return YAHOO.util.Event.getXY(this.browserEvent);
}
return [];
};
this.getTarget=function(){
if(this.browserEvent){
return YAHOO.util.Event.getTarget(this.browserEvent);
}
return null;
};
this.findTarget=function(_20,_21){
if(_21){
_21=_21.toLowerCase();
}
if(this.browserEvent){
function isMatch(el){
if(!el){
return false;
}
if(_20&&!YAHOO.util.Dom.hasClass(el,_20)){
return false;
}
if(_21&&el.tagName.toLowerCase()!=_21){
return false;
}
return true;
}
var t=this.getTarget();
if(!t||isMatch(t)){
return t;
}
var p=t.parentNode;
var b=document.body;
while(p&&p!=b){
if(isMatch(p)){
return p;
}
p=p.parentNode;
}
}
return null;
};
this.getRelatedTarget=function(){
if(this.browserEvent){
return YAHOO.util.Event.getRelatedTarget(this.browserEvent);
}
return null;
};
this.getWheelDelta=function(){
var e=this.browserEvent;
var _27=0;
if(e.wheelDelta){
_27=e.wheelDelta/120;
if(window.opera){
_27=-_27;
}
}else{
if(e.detail){
_27=-e.detail/3;
}
}
return _27;
};
this.hasModifier=function(){
return this.ctrlKey||this.altKey||this.shiftKey;
};
}();


YAHOO.ext.TabPanel=function(_1,_2){
this.el=getEl(_1,true);
this.tabPosition="top";
this.currentTabWidth=0;
this.minTabWidth=40;
this.maxTabWidth=250;
this.preferredTabWidth=175;
this.resizeTabs=false;
this.monitorResize=true;
if(_2){
if(typeof _2=="boolean"){
this.tabPosition=_2?"bottom":"top";
}else{
YAHOO.ext.util.Config.apply(this,_2);
}
}
if(this.tabPosition=="bottom"){
this.bodyEl=getEl(this.createBody(this.el.dom));
this.el.addClass("ytabs-bottom");
}
this.stripWrap=getEl(this.createStrip(this.el.dom),true);
this.stripEl=getEl(this.createStripList(this.stripWrap.dom),true);
this.stripBody=getEl(this.stripWrap.dom.firstChild.firstChild,true);
if(YAHOO.ext.util.Browser.isIE){
YAHOO.util.Dom.setStyle(this.stripWrap.dom.firstChild,"overflow-x","hidden");
}
if(this.tabPosition!="bottom"){
this.bodyEl=getEl(this.createBody(this.el.dom));
this.el.addClass("ytabs-top");
}
this.items=[];
this.bodyEl.setStyle("position","relative");
if(!this.items.indexOf){
this.items.indexOf=function(o){
for(var i=0,_5=this.length;i<_5;i++){
if(this[i]==o){
return i;
}
}
return -1;
};
}
this.active=null;
this.onTabChange=new YAHOO.util.CustomEvent("TabItem.onTabChange");
this.activateDelegate=this.activate.createDelegate(this);
this.events={"tabchange":this.onTabChange,"beforetabchange":new YAHOO.util.CustomEvent("beforechange")};
YAHOO.ext.EventManager.onWindowResize(this.onResize,this,true);
this.cpad=this.el.getPadding("lr");
this.hiddenCount=0;
};
YAHOO.ext.TabPanel.prototype={fireEvent:YAHOO.ext.util.Observable.prototype.fireEvent,on:YAHOO.ext.util.Observable.prototype.on,addListener:YAHOO.ext.util.Observable.prototype.addListener,delayedListener:YAHOO.ext.util.Observable.prototype.delayedListener,removeListener:YAHOO.ext.util.Observable.prototype.removeListener,purgeListeners:YAHOO.ext.util.Observable.prototype.purgeListeners,addTab:function(id,_7,_8,_9){
var _a=new YAHOO.ext.TabPanelItem(this,id,_7,_9);
this.addTabItem(_a);
if(_8){
_a.setContent(_8);
}
return _a;
},getTab:function(id){
return this.items[id];
},hideTab:function(id){
var t=this.items[id];
if(!t.isHidden()){
t.setHidden(true);
this.hiddenCount++;
this.autoSizeTabs();
}
},unhideTab:function(id){
var t=this.items[id];
if(t.isHidden()){
t.setHidden(false);
this.hiddenCount--;
this.autoSizeTabs();
}
},addTabItem:function(_10){
this.items[_10.id]=_10;
this.items.push(_10);
if(this.resizeTabs){
_10.setWidth(this.currentTabWidth||this.preferredTabWidth);
this.autoSizeTabs();
}else{
_10.autoSize();
}
},removeTab:function(id){
var _12=this.items;
var tab=_12[id];
if(!tab){
return;
}
var _14=_12.indexOf(tab);
if(this.active==tab&&_12.length>1){
var _15=this.getNextAvailable(_14);
if(_15){
_15.activate();
}
}
this.stripEl.dom.removeChild(tab.pnode.dom);
if(tab.bodyEl.dom.parentNode==this.bodyEl.dom){
this.bodyEl.dom.removeChild(tab.bodyEl.dom);
}
_12.splice(_14,1);
delete this.items[tab.id];
tab.fireEvent("close",tab);
tab.purgeListeners();
this.autoSizeTabs();
},getNextAvailable:function(_16){
var _17=this.items;
var _18=_16;
while(_18<_17.length){
var _19=_17[++_18];
if(_19&&!_19.isHidden()){
return _19;
}
}
var _18=_16;
while(_18>=0){
var _19=_17[--_18];
if(_19&&!_19.isHidden()){
return _19;
}
}
return null;
},disableTab:function(id){
var tab=this.items[id];
if(tab&&this.active!=tab){
tab.disable();
}
},enableTab:function(id){
var tab=this.items[id];
tab.enable();
},activate:function(id){
var tab=this.items[id];
if(tab==this.active){
return tab;
}
var e={};
this.fireEvent("beforetabchange",this,e,tab);
if(e.cancel!==true&&!tab.disabled){
if(this.active){
this.active.hide();
}
this.active=this.items[id];
this.active.show();
this.onTabChange.fireDirect(this,this.active);
}
return tab;
},getActiveTab:function(){
return this.active;
},syncHeight:function(_21){
var _22=(_21||this.el.getHeight())-this.el.getBorderWidth("tb")-this.el.getPadding("tb");
var bm=this.bodyEl.getMargins();
var _24=_22-(this.stripWrap.getHeight()||0)-(bm.top+bm.bottom);
this.bodyEl.setHeight(_24);
return _24;
},onResize:function(){
if(this.monitorResize){
this.autoSizeTabs();
}
},beginUpdate:function(){
this.updating=true;
},endUpdate:function(){
this.updating=false;
this.autoSizeTabs();
},autoSizeTabs:function(){
var _25=this.items.length;
var _26=_25-this.hiddenCount;
if(!this.resizeTabs||_25<1||_26<1||this.updating){
return;
}
var w=Math.max(this.el.getWidth()-this.cpad,10);
var _28=Math.floor(w/_26);
var b=this.stripBody;
if(b.getWidth()>w){
var _2a=this.items;
this.setTabWidth(Math.max(_28,this.minTabWidth));
if(_28<this.minTabWidth){
}
}else{
if(this.currentTabWidth<this.preferredTabWidth){
this.setTabWidth(Math.min(_28,this.preferredTabWidth));
}
}
},getCount:function(){
return this.items.length;
},setTabWidth:function(_2b){
this.currentTabWidth=_2b;
for(var i=0,len=this.items.length;i<len;i++){
if(!this.items[i].isHidden()){
this.items[i].setWidth(_2b);
}
}
},destroy:function(_2e){
YAHOO.ext.EventManager.removeResizeListener(this.onResize,this);
for(var i=0,len=this.items.length;i<len;i++){
this.items[i].purgeListeners();
}
if(_2e===true){
this.el.update("");
this.el.remove();
}
}};
YAHOO.ext.TabPanelItem=function(_31,id,_33,_34){
this.tabPanel=_31;
this.id=id;
this.disabled=false;
this.text=_33;
this.loaded=false;
this.closable=_34;
this.bodyEl=getEl(_31.createItemBody(_31.bodyEl.dom,id));
this.bodyEl.setVisibilityMode(YAHOO.ext.Element.VISIBILITY);
this.bodyEl.setStyle("display","block");
this.bodyEl.setStyle("zoom","1");
this.hideAction();
var els=_31.createStripElements(_31.stripEl.dom,_33,_34);
this.el=getEl(els.el,true);
this.inner=getEl(els.inner,true);
this.textEl=getEl(this.el.dom.firstChild.firstChild.firstChild,true);
this.pnode=getEl(els.el.parentNode,true);
this.el.mon("click",this.onTabClick,this,true);
if(_34){
var c=getEl(els.close,true);
c.dom.title=this.closeText;
c.addClassOnOver("close-over");
c.mon("click",this.closeClick,this,true);
}
this.onActivate=new YAHOO.util.CustomEvent("TabItem.onActivate");
this.onDeactivate=new YAHOO.util.CustomEvent("TabItem.onDeactivate");
this.events={"activate":this.onActivate,"beforeclose":new YAHOO.util.CustomEvent("beforeclose"),"close":new YAHOO.util.CustomEvent("close"),"deactivate":this.onDeactivate};
this.hidden=false;
};
YAHOO.ext.TabPanelItem.prototype={fireEvent:YAHOO.ext.util.Observable.prototype.fireEvent,on:YAHOO.ext.util.Observable.prototype.on,addListener:YAHOO.ext.util.Observable.prototype.addListener,delayedListener:YAHOO.ext.util.Observable.prototype.delayedListener,removeListener:YAHOO.ext.util.Observable.prototype.removeListener,purgeListeners:function(){
YAHOO.ext.util.Observable.prototype.purgeListeners.call(this);
this.el.removeAllListeners();
},show:function(){
this.pnode.addClass("on");
this.showAction();
if(YAHOO.ext.util.Browser.isOpera){
this.tabPanel.stripWrap.repaint();
}
this.onActivate.fireDirect(this.tabPanel,this);
},isActive:function(){
return this.tabPanel.getActiveTab()==this;
},hide:function(){
this.pnode.removeClass("on");
this.hideAction();
this.onDeactivate.fireDirect(this.tabPanel,this);
},hideAction:function(){
this.bodyEl.setStyle("position","absolute");
this.bodyEl.setLeft("-20000px");
this.bodyEl.setTop("-20000px");
this.bodyEl.hide();
},showAction:function(){
this.bodyEl.setStyle("position","relative");
this.bodyEl.setTop("");
this.bodyEl.setLeft("");
this.bodyEl.show();
this.tabPanel.el.repaint.defer(1);
},setTooltip:function(_37){
this.textEl.dom.title=_37;
},onTabClick:function(e){
e.preventDefault();
this.tabPanel.activate(this.id);
},getWidth:function(){
return this.inner.getWidth();
},setWidth:function(_39){
var _3a=_39-this.pnode.getPadding("lr");
this.inner.setWidth(_3a);
this.textEl.setWidth(_3a-this.inner.getPadding("lr"));
this.pnode.setWidth(_39);
},setHidden:function(_3b){
this.hidden=_3b;
this.pnode.setStyle("display",_3b?"none":"");
},isHidden:function(){
return this.hidden;
},getText:function(){
return this.text;
},autoSize:function(){
this.el.beginMeasure();
this.textEl.setWidth(1);
this.setWidth(this.textEl.dom.scrollWidth+this.pnode.getPadding("lr")+this.inner.getPadding("lr"));
this.el.endMeasure();
},setText:function(_3c){
this.text=_3c;
this.textEl.update(_3c);
this.textEl.dom.title=_3c;
if(!this.tabPanel.resizeTabs){
this.autoSize();
}
},activate:function(){
this.tabPanel.activate(this.id);
},disable:function(){
if(this.tabPanel.active!=this){
this.disabled=true;
this.pnode.addClass("disabled");
}
},enable:function(){
this.disabled=false;
this.pnode.removeClass("disabled");
},setContent:function(_3d,_3e){
this.bodyEl.update(_3d,_3e);
},getUpdateManager:function(){
return this.bodyEl.getUpdateManager();
},setUrl:function(url,_40,_41){
if(this.refreshDelegate){
this.onActivate.unsubscribe(this.refreshDelegate);
}
this.refreshDelegate=this._handleRefresh.createDelegate(this,[url,_40,_41]);
this.onActivate.subscribe(this.refreshDelegate);
return this.bodyEl.getUpdateManager();
},_handleRefresh:function(url,_43,_44){
if(!_44||!this.loaded){
var _45=this.bodyEl.getUpdateManager();
_45.update(url,_43,this._setLoaded.createDelegate(this));
}
},refresh:function(){
if(this.refreshDelegate){
this.loaded=false;
this.refreshDelegate();
}
},_setLoaded:function(){
this.loaded=true;
},closeClick:function(e){
var e={};
this.fireEvent("beforeclose",this,e);
if(e.cancel!==true){
this.tabPanel.removeTab(this.id);
}
},closeText:"Close this tab"};
YAHOO.ext.TabPanel.prototype.createStrip=function(_47){
var _48=document.createElement("div");
_48.className="ytab-wrap";
_47.appendChild(_48);
return _48;
};
YAHOO.ext.TabPanel.prototype.createStripList=function(_49){
_49.innerHTML="<div class=\"ytab-strip-wrap\"><table class=\"ytab-strip\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody><tr></tr></tbody></table></div>";
return _49.firstChild.firstChild.firstChild.firstChild;
};
YAHOO.ext.TabPanel.prototype.createBody=function(_4a){
var _4b=document.createElement("div");
YAHOO.util.Dom.generateId(_4b,"tab-body");
YAHOO.util.Dom.addClass(_4b,"yui-ext-tabbody");
_4a.appendChild(_4b);
return _4b;
};
YAHOO.ext.TabPanel.prototype.createItemBody=function(_4c,id){
var _4e=YAHOO.util.Dom.get(id);
if(!_4e){
_4e=document.createElement("div");
_4e.id=id;
}
YAHOO.util.Dom.addClass(_4e,"yui-ext-tabitembody");
_4c.insertBefore(_4e,_4c.firstChild);
return _4e;
};
YAHOO.ext.TabPanel.prototype.createStripElements=function(_4f,_50,_51){
var td=document.createElement("td");
_4f.appendChild(td);
if(_51){
td.className="ytab-closable";
if(!this.closeTpl){
this.closeTpl=new YAHOO.ext.Template("<a href=\"#\" class=\"ytab-right\"><span class=\"ytab-left\"><em class=\"ytab-inner\">"+"<span unselectable=\"on\" title=\"{text}\" class=\"ytab-text\">{text}</span>"+"<div unselectable=\"on\" class=\"close-icon\">&#160;</div></em></span></a>");
}
var el=this.closeTpl.overwrite(td,{"text":_50});
var _54=el.getElementsByTagName("div")[0];
var _55=el.getElementsByTagName("em")[0];
return {"el":el,"close":_54,"inner":_55};
}else{
if(!this.tabTpl){
this.tabTpl=new YAHOO.ext.Template("<a href=\"#\" class=\"ytab-right\"><span class=\"ytab-left\"><em class=\"ytab-inner\">"+"<span unselectable=\"on\" title=\"{text}\" class=\"ytab-text\">{text}</span></em></span></a>");
}
var el=this.tabTpl.overwrite(td,{"text":_50});
var _55=el.getElementsByTagName("em")[0];
return {"el":el,"inner":_55};
}
};


YAHOO.ext.Resizable=function(el,_2){
var _3=YAHOO.ext.Element.get;
this.el=_3(el,true);
this.el.autoBoxAdjust=true;
if(this.el.getStyle("position")!="absolute"){
this.el.setStyle("position","relative");
}
var dh=YAHOO.ext.DomHelper;
var _5=dh.createTemplate({tag:"div",cls:"yresizable-handle yresizable-handle-{0}",html:"&nbsp;"});
this.east=_3(_5.append(this.el.dom,["east"]),true);
this.south=_3(_5.append(this.el.dom,["south"]),true);
if(_2&&_2.multiDirectional){
this.west=_3(_5.append(this.el.dom,["west"]),true);
this.north=_3(_5.append(this.el.dom,["north"]),true);
}
this.corner=_3(_5.append(this.el.dom,["southeast"]),true);
this.proxy=_3(dh.insertBefore(document.body.firstChild,{tag:"div",cls:"yresizable-proxy",id:this.el.id+"-rzproxy"}),true);
this.proxy.autoBoxAdjust=true;
this.moveHandler=YAHOO.ext.EventManager.wrap(this.onMouseMove,this,true);
this.upHandler=YAHOO.ext.EventManager.wrap(this.onMouseUp,this,true);
this.selHandler=YAHOO.ext.EventManager.wrap(this.cancelSelection,this,true);
this.events={"beforeresize":new YAHOO.util.CustomEvent(),"resize":new YAHOO.util.CustomEvent()};
this.dir=null;
this.resizeChild=false;
this.adjustments=[0,0];
this.minWidth=5;
this.minHeight=5;
this.maxWidth=10000;
this.maxHeight=10000;
this.enabled=true;
this.animate=false;
this.duration=0.35;
this.dynamic=false;
this.multiDirectional=false;
this.disableTrackOver=false;
this.easing=YAHOO.util.Easing?YAHOO.util.Easing.easeOutStrong:null;
YAHOO.ext.util.Config.apply(this,_2);
if(this.resizeChild){
if(typeof this.resizeChild=="boolean"){
this.resizeChild=YAHOO.ext.Element.get(this.el.dom.firstChild,true);
}else{
this.resizeChild=YAHOO.ext.Element.get(this.resizeChild,true);
}
}
var _6=this.onMouseDown.createDelegate(this);
this.east.mon("mousedown",_6);
this.south.mon("mousedown",_6);
if(this.multiDirectional){
this.west.mon("mousedown",_6);
this.north.mon("mousedown",_6);
}
this.corner.mon("mousedown",_6);
if(!this.disableTrackOver){
var _7=this.onMouseOver.createDelegate(this);
var _8=this.onMouseOut.createDelegate(this);
this.east.mon("mouseover",_7);
this.east.mon("mouseout",_8);
this.south.mon("mouseover",_7);
this.south.mon("mouseout",_8);
if(this.multiDirectional){
this.west.mon("mouseover",_7);
this.west.mon("mouseout",_8);
this.north.mon("mouseover",_7);
this.north.mon("mouseout",_8);
}
this.corner.mon("mouseover",_7);
this.corner.mon("mouseout",_8);
}
this.updateChildSize();
};
YAHOO.extendX(YAHOO.ext.Resizable,YAHOO.ext.util.Observable,{resizeTo:function(_9,_a){
this.el.setSize(_9,_a);
this.fireEvent("resize",this,_9,_a,null);
},cancelSelection:function(e){
e.preventDefault();
},startSizing:function(e){
this.fireEvent("beforeresize",this,e);
if(this.enabled){
e.preventDefault();
this.startBox=this.el.getBox();
this.startPoint=e.getXY();
this.offsets=[(this.startBox.x+this.startBox.width)-this.startPoint[0],(this.startBox.y+this.startBox.height)-this.startPoint[1]];
this.proxy.setBox(this.startBox);
if(!this.dynamic){
this.proxy.show();
}
YAHOO.util.Event.on(document.body,"selectstart",this.selHandler);
YAHOO.util.Event.on(document.body,"mousemove",this.moveHandler);
YAHOO.util.Event.on(document.body,"mouseup",this.upHandler);
}
},onMouseDown:function(e){
if(this.enabled){
var t=e.getTarget();
if(t==this.corner.dom){
this.dir="both";
this.proxy.setStyle("cursor",this.corner.getStyle("cursor"));
this.startSizing(e);
}else{
if(t==this.east.dom){
this.dir="east";
this.proxy.setStyle("cursor",this.east.getStyle("cursor"));
this.startSizing(e);
}else{
if(t==this.south.dom){
this.dir="south";
this.proxy.setStyle("cursor",this.south.getStyle("cursor"));
this.startSizing(e);
}else{
if(t==this.west.dom){
this.dir="west";
this.proxy.setStyle("cursor",this.west.getStyle("cursor"));
this.startSizing(e);
}else{
if(t==this.north.dom){
this.dir="north";
this.proxy.setStyle("cursor",this.north.getStyle("cursor"));
this.startSizing(e);
}
}
}
}
}
}
},onMouseUp:function(e){
YAHOO.util.Event.removeListener(document.body,"selectstart",this.selHandler);
YAHOO.util.Event.removeListener(document.body,"mousemove",this.moveHandler);
YAHOO.util.Event.removeListener(document.body,"mouseup",this.upHandler);
var _10=this.resizeElement();
this.fireEvent("resize",this,_10.width,_10.height,e);
},updateChildSize:function(){
if(this.resizeChild&&this.el.dom.offsetWidth){
var el=this.el;
var _12=this.resizeChild;
var adj=this.adjustments;
setTimeout(function(){
var b=el.getBox(true);
_12.setSize(b.width+adj[0],b.height+adj[1]);
},1);
}
},snap:function(_15,inc){
if(!inc||!_15){
return _15;
}
var _17=_15;
var m=_15%inc;
if(m>0){
if(m>(inc/2)){
_17=_15+(inc-m);
}else{
_17=_15-m;
}
}
return _17;
},resizeElement:function(){
var box=this.proxy.getBox();
box.width=this.snap(box.width,this.widthIncrement);
box.height=this.snap(box.height,this.heightIncrement);
if(this.multiDirectional){
this.el.setBox(box,false,this.animate,this.duration,null,this.easing);
}else{
this.el.setSize(box.width,box.height,this.animate,this.duration,null,this.easing);
}
this.updateChildSize();
this.proxy.hide();
return box;
},onMouseMove:function(e){
if(this.enabled){
var xy=e.getXY();
if(this.dir=="both"||this.dir=="east"||this.dir=="south"){
var w=Math.min(Math.max(this.minWidth,xy[0]-this.startBox.x+this.offsets[0]),this.maxWidth);
var h=Math.min(Math.max(this.minHeight,xy[1]-this.startBox.y+this.offsets[1]),this.maxHeight);
if(this.dir=="both"){
this.proxy.setSize(w,h);
}else{
if(this.dir=="east"){
this.proxy.setWidth(w);
}else{
if(this.dir=="south"){
this.proxy.setHeight(h);
}
}
}
}else{
var x=this.startBox.x+(xy[0]-this.startPoint[0]);
var y=this.startBox.y+(xy[1]-this.startPoint[1]);
var w=this.startBox.width+(this.startBox.x-x);
var h=this.startBox.height+(this.startBox.y-y);
if(this.dir=="west"&&w<=this.maxWidth&&w>=this.minWidth){
this.proxy.setX(x);
this.proxy.setWidth(w);
}else{
if(this.dir=="north"&&h<=this.maxHeight&&h>=this.minHeight){
this.proxy.setY(y);
this.proxy.setHeight(h);
}
}
}
if(this.dynamic){
this.resizeElement();
}
}
},onMouseOver:function(){
if(this.enabled){
this.el.addClass("yresizable-over");
}
},onMouseOut:function(){
this.el.removeClass("yresizable-over");
}});


YAHOO.namespace("ext.state");
YAHOO.ext.state.Provider=function(){
YAHOO.ext.state.Provider.superclass.constructor.call(this);
this.events={"statechange":new YAHOO.util.CustomEvent("statechange")};
this.state={};
};
YAHOO.extendX(YAHOO.ext.state.Provider,YAHOO.ext.util.Observable,{get:function(_1,_2){
return typeof this.state[_1]=="undefined"?_2:this.state[_1];
},clear:function(_3){
delete this.state[_3];
this.fireEvent("statechange",this,_3,null);
},set:function(_4,_5){
this.state[_4]=_5;
this.fireEvent("statechange",this,_4,_5);
},decodeValue:function(_6){
var re=/^(a|n|d|b|s|o)\:(.*)$/;
var _8=re.exec(unescape(_6));
if(!_8||!_8[1]){
return;
}
var _9=_8[1];
var v=_8[2];
switch(_9){
case "n":
return parseFloat(v);
case "d":
return new Date(Date.parse(v));
case "b":
return (v=="1");
case "a":
var _b=[];
var _c=v.split("^");
for(var i=0,_e=_c.length;i<_e;i++){
_b.push(this.decodeValue(_c[i]));
}
return _b;
case "o":
var _b={};
var _c=v.split("^");
for(var i=0,_e=_c.length;i<_e;i++){
var kv=_c[i].split("=");
_b[kv[0]]=this.decodeValue(kv[1]);
}
return _b;
default:
return v;
}
},encodeValue:function(v){
var enc;
if(typeof v=="number"){
enc="n:"+v;
}else{
if(typeof v=="boolean"){
enc="b:"+(v?"1":"0");
}else{
if(v instanceof Date){
enc="d:"+v.toGMTString();
}else{
if(v instanceof Array){
var _12="";
for(var i=0,len=v.length;i<len;i++){
_12+=this.encodeValue(v[i]);
if(i!=len-1){
_12+="^";
}
}
enc="a:"+_12;
}else{
if(typeof v=="object"){
var _12="";
for(var key in v){
if(typeof v[key]!="function"){
_12+=key+"="+this.encodeValue(v[key])+"^";
}
}
enc="o:"+_12.substring(0,_12.length-1);
}else{
enc="s:"+v;
}
}
}
}
}
return escape(enc);
}});
YAHOO.ext.state.Manager=new function(){
var _16=new YAHOO.ext.state.Provider();
return {setProvider:function(_17){
_16=_17;
},get:function(key,_19){
return _16.get(key,_19);
},set:function(key,_1b){
_16.set(key,_1b);
},clear:function(key){
_16.clear(key);
},getProvider:function(){
return _16;
}};
}();
YAHOO.ext.state.CookieProvider=function(_1d){
YAHOO.ext.state.CookieProvider.superclass.constructor.call(this);
this.path="/";
this.expires=new Date(new Date().getTime()+(1000*60*60*24*7));
this.domain=null;
this.secure=false;
YAHOO.ext.util.Config.apply(this,_1d);
this.state=this.readCookies();
};
YAHOO.extendX(YAHOO.ext.state.CookieProvider,YAHOO.ext.state.Provider,{set:function(_1e,_1f){
if(typeof _1f=="undefined"||_1f===null){
this.clear(_1e);
return;
}
this.setCookie(_1e,_1f);
YAHOO.ext.state.CookieProvider.superclass.set.call(this,_1e,_1f);
},clear:function(_20){
this.clearCookie(_20);
YAHOO.ext.state.CookieProvider.superclass.clear.call(this,_20);
},readCookies:function(){
var _21={};
var c=document.cookie+";";
var re=/\s?(.*?)=(.*?);/g;
var _24;
while((_24=re.exec(c))!=null){
var _25=_24[1];
var _26=_24[2];
if(_25&&_25.substring(0,3)=="ys-"){
_21[_25.substr(3)]=this.decodeValue(_26);
}
}
return _21;
},setCookie:function(_27,_28){
document.cookie="ys-"+_27+"="+this.encodeValue(_28)+((this.expires==null)?"":("; expires="+this.expires.toGMTString()))+((this.path==null)?"":("; path="+this.path))+((this.domain==null)?"":("; domain="+this.domain))+((this.secure==true)?"; secure":"");
},clearCookie:function(_29){
document.cookie="ys-"+_29+"=null; expires=Thu, 01-Jan-70 00:00:01 GMT"+((this.path==null)?"":("; path="+this.path))+((this.domain==null)?"":("; domain="+this.domain))+((this.secure==true)?"; secure":"");
}});


YAHOO.ext.BasicDialog=function(el,_2){
this.el=getEl(el);
var dh=YAHOO.ext.DomHelper;
if(!this.el&&_2&&_2.autoCreate){
if(typeof _2.autoCreate=="object"){
if(!_2.autoCreate.id){
_2.autoCreate.id=el;
}
this.el=dh.append(document.body,_2.autoCreate,true);
}else{
this.el=dh.append(document.body,{tag:"div",id:el},true);
}
}
el=this.el;
el.setDisplayed(true);
el.hide=this.hideAction;
this.id=el.id;
el.addClass("ydlg");
this.shadowOffset=3;
this.minHeight=80;
this.minWidth=200;
this.minButtonWidth=75;
this.defaultButton=null;
YAHOO.ext.util.Config.apply(this,_2);
this.proxy=el.createProxy("ydlg-proxy");
this.proxy.hide=this.hideAction;
this.proxy.setOpacity(0.5);
this.proxy.hide();
if(_2.width){
el.setWidth(_2.width);
}
if(_2.height){
el.setHeight(_2.height);
}
this.size=el.getSize();
if(typeof _2.x!="undefined"&&typeof _2.y!="undefined"){
this.xy=[_2.x,_2.y];
}else{
this.xy=el.getCenterXY(true);
}
var cn=el.dom.childNodes;
for(var i=0,_6=cn.length;i<_6;i++){
var _7=cn[i];
if(_7&&_7.nodeType==1){
if(YAHOO.util.Dom.hasClass(_7,"ydlg-hd")){
this.header=getEl(_7,true);
}else{
if(YAHOO.util.Dom.hasClass(_7,"ydlg-bd")){
this.body=getEl(_7,true);
}else{
if(YAHOO.util.Dom.hasClass(_7,"ydlg-ft")){
this.footer=getEl(_7,true);
}
}
}
}
}
if(!this.header){
this.header=dh.append(el.dom,{tag:"div",cls:"ydlg-hd"},true);
}
if(this.title){
this.header.update(this.title);
}
if(!this.body){
this.body=dh.append(el.dom,{tag:"div",cls:"ydlg-bd"},true);
}
var hl=dh.insertBefore(this.header.dom,{tag:"div",cls:"ydlg-hd-left"});
var hr=dh.append(hl,{tag:"div",cls:"ydlg-hd-right"});
hr.appendChild(this.header.dom);
this.bwrap=dh.insertBefore(this.body.dom,{tag:"div",cls:"ydlg-dlg-body"},true);
this.bwrap.dom.appendChild(this.body.dom);
if(this.footer){
this.bwrap.dom.appendChild(this.footer.dom);
}
if(this.autoScroll!==false&&!this.autoTabs){
this.body.setStyle("overflow","auto");
}
if(this.closable!==false){
this.el.addClass("ydlg-closable");
this.close=dh.append(el.dom,{tag:"div",cls:"ydlg-close"},true);
this.close.mon("click",function(){
this.hide();
},this,true);
}
if(this.resizable!==false){
this.el.addClass("ydlg-resizable");
this.resizer=new YAHOO.ext.Resizable(el,{minWidth:this.minWidth||80,minHeight:this.minHeight||80,handles:"all",pinned:true});
this.resizer.on("beforeresize",this.beforeResize,this,true);
this.resizer.on("resize",this.onResize,this,true);
}
if(this.draggable!==false){
el.addClass("ydlg-draggable");
if(!this.proxyDrag){
var dd=new YAHOO.util.DD(el.dom.id,"WindowDrag");
}else{
var dd=new YAHOO.util.DDProxy(el.dom.id,"WindowDrag",{dragElId:this.proxy.id});
}
dd.setHandleElId(this.header.id);
dd.endDrag=this.endMove.createDelegate(this);
dd.startDrag=this.startMove.createDelegate(this);
dd.onDrag=this.onDrag.createDelegate(this);
this.dd=dd;
}
if(this.modal){
this.mask=dh.append(document.body,{tag:"div",cls:"ydlg-mask"},true);
this.mask.enableDisplayMode("block");
this.mask.hide();
}
if(this.shadow){
this.shadow=el.createProxy({tag:"div",cls:"ydlg-shadow"});
this.shadow.setOpacity(0.3);
this.shadow.setVisibilityMode(YAHOO.ext.Element.VISIBILITY);
this.shadow.setDisplayed("block");
this.shadow.hide=this.hideAction;
this.shadow.hide();
}else{
this.shadowOffset=0;
}
if(this.shim){
this.shim=this.el.createShim();
this.shim.hide=this.hideAction;
this.shim.hide();
}
if(this.autoTabs){
var _b=YAHOO.util.Dom.getElementsByClassName("ydlg-tab",this.tabTag||"div",el.dom);
if(_b.length>0){
this.body.addClass(this.tabPosition=="bottom"?"ytabs-bottom":"ytabs-top");
this.tabs=new YAHOO.ext.TabPanel(this.body.dom,this.tabPosition=="bottom");
for(var i=0,_6=_b.length;i<_6;i++){
var _c=_b[i];
this.tabs.addTab(YAHOO.util.Dom.generateId(_c),_c.title);
_c.title="";
}
this.tabs.activate(_b[0].id);
}
}
this.syncBodyHeight();
this.events={"keydown":true,"move":true,"resize":true,"beforehide":true,"hide":true,"beforeshow":true,"show":true};
el.mon("keydown",this.onKeyDown,this,true);
el.mon("mousedown",this.toFront,this,true);
YAHOO.ext.EventManager.onWindowResize(this.adjustViewport,this,true);
this.el.hide();
YAHOO.ext.DialogManager.register(this);
};
YAHOO.extendX(YAHOO.ext.BasicDialog,YAHOO.ext.util.Observable,{setTitle:function(_d){
this.header.update(_d);
return this;
},beforeResize:function(){
this.resizer.minHeight=Math.max(this.minHeight,this.getHeaderFooterHeight(true)+40);
},onResize:function(){
this.refreshSize();
this.syncBodyHeight();
this.adjustAssets();
this.fireEvent("resize",this,this.size.width,this.size.height);
},onKeyDown:function(e){
this.fireEvent("keydown",this,e);
},resizeTo:function(_f,_10){
this.el.setSize(_f,_10);
this.size={width:_f,height:_10};
this.syncBodyHeight();
if(this.fixedcenter){
this.center();
}
if(this.isVisible()){
this.constrainXY();
this.adjustAssets();
}
this.fireEvent("resize",this,_f,_10);
return this;
},addKeyListener:function(key,fn,_13){
var _14,_15,_16,alt;
if(typeof key=="object"&&!(key instanceof Array)){
_14=key["key"];
_15=key["shift"];
_16=key["ctrl"];
alt=key["alt"];
}else{
_14=key;
}
var _18=function(dlg,e){
if((!_15||e.shiftKey)&&(!_16||e.ctrlKey)&&(!alt||e.altKey)){
var k=e.getKey();
if(_14 instanceof Array){
for(var i=0,len=_14.length;i<len;i++){
if(_14[i]==k){
fn.call(_13||window,dlg,k,e);
return;
}
}
}else{
if(k==_14){
fn.call(_13||window,dlg,k,e);
}
}
}
};
this.on("keydown",_18);
return this;
},getTabs:function(){
if(!this.tabs){
this.body.addClass(this.tabPosition=="bottom"?"ytabs-bottom":"ytabs-top");
this.tabs=new YAHOO.ext.TabPanel(this.body.dom,this.tabPosition=="bottom");
}
return this.tabs;
},addButton:function(_1e,_1f,_20){
var dh=YAHOO.ext.DomHelper;
if(!this.footer){
this.footer=dh.append(this.bwrap.dom,{tag:"div",cls:"ydlg-ft"},true);
}
var _22={handler:_1f,scope:_20,minWidth:this.minButtonWidth};
if(typeof _1e=="string"){
_22.text=_1e;
}else{
_22.dhconfig=_1e;
}
var btn=new YAHOO.ext.Button(this.footer,_22);
this.syncBodyHeight();
if(!this.buttons){
this.buttons=[];
}
this.buttons.push(btn);
return btn;
},setDefaultButton:function(btn){
this.defaultButton=btn;
return this;
},getHeaderFooterHeight:function(_25){
var _26=0;
if(this.header){
_26+=this.header.getHeight();
}
if(this.footer){
var fm=this.footer.getMargins();
_26+=(this.footer.getHeight()+fm.top+fm.bottom);
}
_26+=this.bwrap.getPadding("tb")+this.bwrap.getBorderWidth("tb");
return _26;
},syncBodyHeight:function(){
var _28=this.size.height-this.getHeaderFooterHeight(false);
var bm=this.body.getMargins();
this.body.setHeight(_28-(bm.top+bm.bottom));
if(this.tabs){
this.tabs.syncHeight();
}
this.bwrap.setHeight(this.size.height-this.header.getHeight());
this.body.setWidth(this.el.getWidth(true)-this.bwrap.getBorderWidth("lr")-this.bwrap.getPadding("lr"));
},restoreState:function(){
var box=YAHOO.ext.state.Manager.get(this.el.id+"-state");
if(box&&box.width){
this.xy=[box.x,box.y];
this.resizeTo(box.width,box.height);
}
return this;
},beforeShow:function(){
if(this.fixedcenter){
this.xy=this.el.getCenterXY(true);
}
if(this.modal){
YAHOO.util.Dom.addClass(document.body,"masked");
this.mask.setSize(YAHOO.util.Dom.getDocumentWidth(),YAHOO.util.Dom.getDocumentHeight());
this.mask.show();
}
this.constrainXY();
},animShow:function(){
var b=getEl(this.animateTarget,true).getBox();
this.proxy.setSize(b.width,b.height);
this.proxy.setLocation(b.x,b.y);
this.proxy.show();
this.proxy.setBounds(this.xy[0],this.xy[1],this.size.width,this.size.height,true,0.35,this.showEl.createDelegate(this));
},show:function(_2c){
if(this.fireEvent("beforeshow",this)===false){
return;
}
if(this.syncHeightBeforeShow){
this.syncBodyHeight();
}
this.animateTarget=_2c||this.animateTarget;
if(!this.el.isVisible()){
this.beforeShow();
if(this.animateTarget){
this.animShow();
}else{
this.showEl();
}
}
return this;
},showEl:function(){
this.proxy.hide();
this.el.setXY(this.xy);
this.el.show();
this.adjustAssets(true);
this.toFront();
if(this.defaultButton){
this.defaultButton.focus();
}
this.fireEvent("show",this);
},constrainXY:function(){
if(this.constraintoviewport!==false){
if(!this.viewSize){
this.viewSize=[YAHOO.util.Dom.getViewportWidth(),YAHOO.util.Dom.getViewportHeight()];
}
var x=this.xy[0],y=this.xy[1];
var w=this.size.width,h=this.size.height;
var vw=this.viewSize[0],vh=this.viewSize[1];
var _33=false;
if(x+w>vw){
x=vw-w;
_33=true;
}
if(y+h>vh){
y=vh-h;
_33=true;
}
if(x<0){
x=0;
_33=true;
}
if(y<0){
y=0;
_33=true;
}
if(_33){
this.xy=[x,y];
if(this.isVisible()){
this.el.setLocation(x,y);
this.adjustAssets();
}
}
}
},onDrag:function(){
if(!this.proxyDrag){
this.xy=this.el.getXY();
this.adjustAssets();
}
},adjustAssets:function(_34){
var x=this.xy[0],y=this.xy[1];
var w=this.size.width,h=this.size.height;
if(_34===true){
if(this.shadow){
this.shadow.show();
}
if(this.shim){
this.shim.show();
}
}
if(this.shadow&&this.shadow.isVisible()){
this.shadow.setBounds(x+this.shadowOffset,y+this.shadowOffset,w,h);
}
if(this.shim&&this.shim.isVisible()){
this.shim.setBounds(x,y,w,h);
}
},adjustViewport:function(w,h){
if(!w||!h){
w=YAHOO.util.Dom.getViewportWidth();
h=YAHOO.util.Dom.getViewportHeight();
}
this.viewSize=[w,h];
if(this.modal&&this.mask.isVisible()){
this.mask.setSize(w,h);
this.mask.setSize(YAHOO.util.Dom.getDocumentWidth(),YAHOO.util.Dom.getDocumentHeight());
}
if(this.isVisible()){
this.constrainXY();
}
},destroy:function(_3b){
YAHOO.ext.EventManager.removeResizeListener(this.adjustViewport,this);
if(this.tabs){
this.tabs.destroy(_3b);
}
if(_3b===true){
this.el.update("");
this.el.remove();
}
YAHOO.ext.DialogManager.unregister(this);
},startMove:function(){
if(this.proxyDrag){
this.proxy.show();
}
if(this.constraintoviewport!==false){
this.dd.constrainTo(document.body,{right:this.shadowOffset,bottom:this.shadowOffset});
}
},endMove:function(){
if(!this.proxyDrag){
YAHOO.util.DD.prototype.endDrag.apply(this.dd,arguments);
}else{
YAHOO.util.DDProxy.prototype.endDrag.apply(this.dd,arguments);
this.proxy.hide();
}
this.refreshSize();
this.adjustAssets();
this.fireEvent("move",this,this.xy[0],this.xy[1]);
},toFront:function(){
YAHOO.ext.DialogManager.bringToFront(this);
return this;
},toBack:function(){
YAHOO.ext.DialogManager.sendToBack(this);
return this;
},center:function(){
this.moveTo(this.el.getCenterXY(true));
return this;
},moveTo:function(x,y){
this.xy=[x,y];
if(this.isVisible()){
this.el.setXY(this.xy);
this.adjustAssets();
}
return this;
},isVisible:function(){
return this.el.isVisible();
},animHide:function(_3e){
var b=getEl(this.animateTarget,true).getBox();
this.proxy.show();
this.proxy.setBounds(this.xy[0],this.xy[1],this.size.width,this.size.height);
this.el.hide();
this.proxy.setBounds(b.x,b.y,b.width,b.height,true,0.35,this.hideEl.createDelegate(this,[_3e]));
},hide:function(_40){
if(this.fireEvent("beforehide",this)===false){
return;
}
if(this.shadow){
this.shadow.hide();
}
if(this.shim){
this.shim.hide();
}
if(this.animateTarget){
this.animHide(_40);
}else{
this.el.hide();
this.hideEl(_40);
}
return this;
},hideEl:function(_41){
this.proxy.hide();
if(this.modal){
this.mask.hide();
YAHOO.util.Dom.removeClass(document.body,"masked");
}
this.fireEvent("hide",this);
if(typeof _41=="function"){
_41();
}
},hideAction:function(){
this.setLeft("-10000px");
this.setTop("-10000px");
this.setStyle("visibility","hidden");
},refreshSize:function(){
this.size=this.el.getSize();
this.xy=this.el.getXY();
YAHOO.ext.state.Manager.set(this.el.id+"-state",this.el.getBox());
},setZIndex:function(_42){
if(this.modal){
this.mask.setStyle("z-index",_42);
}
if(this.shadow){
this.shadow.setStyle("z-index",++_42);
}
if(this.shim){
this.shim.setStyle("z-index",++_42);
}
this.el.setStyle("z-index",++_42);
if(this.proxy){
this.proxy.setStyle("z-index",++_42);
}
if(this.resizer){
this.resizer.proxy.setStyle("z-index",++_42);
}
this.lastZIndex=_42;
},getEl:function(){
return this.el;
}});
YAHOO.ext.DialogManager=function(){
var _43={};
var _44=[];
var _45=null;
var _46=function(d1,d2){
return (!d1._lastAccess||d1._lastAccess<d2._lastAccess)?-1:1;
};
var _49=function(){
_44.sort(_46);
var _4a=YAHOO.ext.DialogManager.zseed;
for(var i=0,len=_44.length;i<len;i++){
if(_44[i]){
_44[i].setZIndex(_4a+(i*10));
}
}
};
return {zseed:10000,register:function(dlg){
_43[dlg.id]=dlg;
_44.push(dlg);
},unregister:function(dlg){
delete _43[dlg.id];
if(!_44.indexOf){
for(var i=0,len=_44.length;i<len;i++){
_44.splice(i,1);
return;
}
}else{
var i=_44.indexOf(dlg);
if(i!=-1){
_44.splice(i,1);
}
}
},get:function(id){
return typeof id=="object"?id:_43[id];
},bringToFront:function(dlg){
dlg=this.get(dlg);
if(dlg!=_45){
_45=dlg;
dlg._lastAccess=new Date().getTime();
_49();
}
return dlg;
},sendToBack:function(dlg){
dlg=this.get(dlg);
dlg._lastAccess=-(new Date().getTime());
_49();
return dlg;
}};
}();
YAHOO.ext.LayoutDialog=function(el,_55){
_55.autoTabs=false;
YAHOO.ext.LayoutDialog.superclass.constructor.call(this,el,_55);
this.body.setStyle({overflow:"hidden",position:"relative"});
this.layout=new YAHOO.ext.BorderLayout(this.body.dom,_55);
this.layout.monitorWindowResize=false;
this.center=YAHOO.ext.BasicDialog.prototype.center;
this.on("show",this.layout.layout,this.layout,true);
};
YAHOO.extendX(YAHOO.ext.LayoutDialog,YAHOO.ext.BasicDialog,{endUpdate:function(){
this.layout.endUpdate();
},beginUpdate:function(){
this.layout.beginUpdate();
},getLayout:function(){
return this.layout;
},syncBodyHeight:function(){
YAHOO.ext.LayoutDialog.superclass.syncBodyHeight.call(this);
if(this.layout){
this.layout.layout();
}
}});


if(YAHOO.util.DragDropMgr){
YAHOO.util.DragDropMgr.clickTimeThresh=350;
}
YAHOO.ext.SplitBar=function(_1,_2,_3,_4){
this.el=YAHOO.ext.Element.get(_1,true);
this.el.dom.unselectable="on";
this.resizingEl=YAHOO.ext.Element.get(_2,true);
this.orientation=_3||YAHOO.ext.SplitBar.HORIZONTAL;
this.minSize=0;
this.maxSize=2000;
this.onMoved=new YAHOO.util.CustomEvent("SplitBarMoved",this);
this.animate=false;
this.useShim=false;
this.shim=null;
this.proxy=YAHOO.ext.SplitBar.createProxy(this.orientation);
this.dd=new YAHOO.util.DDProxy(this.el.dom.id,"SplitBars",{dragElId:this.proxy.id});
this.dd.b4StartDrag=this.onStartProxyDrag.createDelegate(this);
this.dd.endDrag=this.onEndProxyDrag.createDelegate(this);
this.dragSpecs={};
this.adapter=new YAHOO.ext.SplitBar.BasicLayoutAdapter();
this.adapter.init(this);
if(this.orientation==YAHOO.ext.SplitBar.HORIZONTAL){
this.placement=_4||(this.el.getX()>this.resizingEl.getX()?YAHOO.ext.SplitBar.LEFT:YAHOO.ext.SplitBar.RIGHT);
this.el.setStyle("cursor","e-resize");
}else{
this.placement=_4||(this.el.getY()>this.resizingEl.getY()?YAHOO.ext.SplitBar.TOP:YAHOO.ext.SplitBar.BOTTOM);
this.el.setStyle("cursor","n-resize");
}
this.events={"resize":this.onMoved,"moved":this.onMoved,"beforeresize":new YAHOO.util.CustomEvent("beforeresize")};
};
YAHOO.extendX(YAHOO.ext.SplitBar,YAHOO.ext.util.Observable,{onStartProxyDrag:function(x,y){
this.fireEvent("beforeresize",this);
if(this.useShim){
if(!this.shim){
this.shim=YAHOO.ext.SplitBar.createShim();
}
this.shim.setVisible(true);
}
YAHOO.util.Dom.setStyle(this.proxy,"display","block");
var _7=this.adapter.getElementSize(this);
this.activeMinSize=this.getMinimumSize();
this.activeMaxSize=this.getMaximumSize();
var c1=_7-this.activeMinSize;
var c2=Math.max(this.activeMaxSize-_7,0);
if(this.orientation==YAHOO.ext.SplitBar.HORIZONTAL){
this.dd.resetConstraints();
this.dd.setXConstraint(this.placement==YAHOO.ext.SplitBar.LEFT?c1:c2,this.placement==YAHOO.ext.SplitBar.LEFT?c2:c1);
this.dd.setYConstraint(0,0);
}else{
this.dd.resetConstraints();
this.dd.setXConstraint(0,0);
this.dd.setYConstraint(this.placement==YAHOO.ext.SplitBar.TOP?c1:c2,this.placement==YAHOO.ext.SplitBar.TOP?c2:c1);
}
this.dragSpecs.startSize=_7;
this.dragSpecs.startPoint=[x,y];
YAHOO.util.DDProxy.prototype.b4StartDrag.call(this.dd,x,y);
},onEndProxyDrag:function(e){
YAHOO.util.Dom.setStyle(this.proxy,"display","none");
var _b=YAHOO.util.Event.getXY(e);
if(this.useShim){
this.shim.setVisible(false);
}
var _c;
if(this.orientation==YAHOO.ext.SplitBar.HORIZONTAL){
_c=this.dragSpecs.startSize+(this.placement==YAHOO.ext.SplitBar.LEFT?_b[0]-this.dragSpecs.startPoint[0]:this.dragSpecs.startPoint[0]-_b[0]);
}else{
_c=this.dragSpecs.startSize+(this.placement==YAHOO.ext.SplitBar.TOP?_b[1]-this.dragSpecs.startPoint[1]:this.dragSpecs.startPoint[1]-_b[1]);
}
_c=Math.min(Math.max(_c,this.activeMinSize),this.activeMaxSize);
if(_c!=this.dragSpecs.startSize){
this.adapter.setElementSize(this,_c);
this.onMoved.fireDirect(this,_c);
}
},getAdapter:function(){
return this.adapter;
},setAdapter:function(_d){
this.adapter=_d;
this.adapter.init(this);
},getMinimumSize:function(){
return this.minSize;
},setMinimumSize:function(_e){
this.minSize=_e;
},getMaximumSize:function(){
return this.maxSize;
},setMaximumSize:function(_f){
this.maxSize=_f;
},setCurrentSize:function(_10){
var _11=this.animate;
this.animate=false;
this.adapter.setElementSize(this,_10);
this.animate=_11;
},destroy:function(_12){
if(this.shim){
this.shim.remove();
}
this.dd.unreg();
this.proxy.parentNode.removeChild(this.proxy);
if(_12){
this.el.remove();
}
}});
YAHOO.ext.SplitBar.createShim=function(){
var _13=document.createElement("div");
_13.unselectable="on";
YAHOO.util.Dom.generateId(_13,"split-shim");
YAHOO.util.Dom.setStyle(_13,"width","100%");
YAHOO.util.Dom.setStyle(_13,"height","100%");
YAHOO.util.Dom.setStyle(_13,"position","absolute");
YAHOO.util.Dom.setStyle(_13,"background","white");
YAHOO.util.Dom.setStyle(_13,"z-index",11000);
window.document.body.appendChild(_13);
var _14=YAHOO.ext.Element.get(_13);
_14.setOpacity(0.01);
_14.setXY([0,0]);
return _14;
};
YAHOO.ext.SplitBar.createProxy=function(_15){
var _16=document.createElement("div");
_16.unselectable="on";
YAHOO.util.Dom.generateId(_16,"split-proxy");
YAHOO.util.Dom.setStyle(_16,"position","absolute");
YAHOO.util.Dom.setStyle(_16,"visibility","hidden");
YAHOO.util.Dom.setStyle(_16,"z-index",11001);
YAHOO.util.Dom.setStyle(_16,"background-color","#aaa");
if(_15==YAHOO.ext.SplitBar.HORIZONTAL){
YAHOO.util.Dom.setStyle(_16,"cursor","e-resize");
}else{
YAHOO.util.Dom.setStyle(_16,"cursor","n-resize");
}
YAHOO.util.Dom.setStyle(_16,"line-height","0px");
YAHOO.util.Dom.setStyle(_16,"font-size","0px");
window.document.body.appendChild(_16);
return _16;
};
YAHOO.ext.SplitBar.BasicLayoutAdapter=function(){
};
YAHOO.ext.SplitBar.BasicLayoutAdapter.prototype={init:function(s){
},getElementSize:function(s){
if(s.orientation==YAHOO.ext.SplitBar.HORIZONTAL){
return s.resizingEl.getWidth();
}else{
return s.resizingEl.getHeight();
}
},setElementSize:function(s,_1a,_1b){
if(s.orientation==YAHOO.ext.SplitBar.HORIZONTAL){
if(!YAHOO.util.Anim||!s.animate){
s.resizingEl.setWidth(_1a);
if(_1b){
_1b(s,_1a);
}
}else{
s.resizingEl.setWidth(_1a,true,0.1,_1b,YAHOO.util.Easing.easeOut);
}
}else{
if(!YAHOO.util.Anim||!s.animate){
s.resizingEl.setHeight(_1a);
if(_1b){
_1b(s,_1a);
}
}else{
s.resizingEl.setHeight(_1a,true,0.1,_1b,YAHOO.util.Easing.easeOut);
}
}
}};
YAHOO.ext.SplitBar.AbsoluteLayoutAdapter=function(_1c){
this.basic=new YAHOO.ext.SplitBar.BasicLayoutAdapter();
this.container=getEl(_1c);
};
YAHOO.ext.SplitBar.AbsoluteLayoutAdapter.prototype={init:function(s){
this.basic.init(s);
},getElementSize:function(s){
return this.basic.getElementSize(s);
},setElementSize:function(s,_20,_21){
this.basic.setElementSize(s,_20,this.moveSplitter.createDelegate(this,[s]));
},moveSplitter:function(s){
var yes=YAHOO.ext.SplitBar;
switch(s.placement){
case yes.LEFT:
s.el.setX(s.resizingEl.getRight());
break;
case yes.RIGHT:
s.el.setStyle("right",(this.container.getWidth()-s.resizingEl.getLeft())+"px");
break;
case yes.TOP:
s.el.setY(s.resizingEl.getBottom());
break;
case yes.BOTTOM:
s.el.setY(s.resizingEl.getTop()-s.el.getHeight());
break;
}
}};
YAHOO.ext.SplitBar.VERTICAL=1;
YAHOO.ext.SplitBar.HORIZONTAL=2;
YAHOO.ext.SplitBar.LEFT=1;
YAHOO.ext.SplitBar.RIGHT=2;
YAHOO.ext.SplitBar.TOP=3;
YAHOO.ext.SplitBar.BOTTOM=4;


YAHOO.ext.util.MixedCollection=function(_1){
this.items=[];
this.keys=[];
this.events={"clear":new YAHOO.util.CustomEvent("clear"),"add":new YAHOO.util.CustomEvent("add"),"replace":new YAHOO.util.CustomEvent("replace"),"remove":new YAHOO.util.CustomEvent("remove")};
this.allowFunctions=_1===true;
};
YAHOO.extendX(YAHOO.ext.util.MixedCollection,YAHOO.ext.util.Observable,{allowFunctions:false,add:function(_2,o){
if(arguments.length==1){
o=arguments[0];
_2=this.getKey(o);
}
this.items.push(o);
if(typeof _2!="undefined"&&_2!=null){
this.items[_2]=o;
this.keys.push(_2);
}
this.fireEvent("add",this.items.length-1,o,_2);
return o;
},getKey:function(o){
return null;
},replace:function(_5,o){
if(arguments.length==1){
o=arguments[0];
_5=this.getKey(o);
}
if(typeof this.items[_5]=="undefined"){
return this.add(_5,o);
}
var _7=this.items[_5];
if(typeof _5=="number"){
this.items[_5]=o;
}else{
var _8=this.indexOfKey(_5);
this.items[_8]=o;
this.items[_5]=o;
}
this.fireEvent("replace",_5,_7,o);
return o;
},addAll:function(_9){
if(arguments.length>1||_9 instanceof Array){
var _a=arguments.length>1?arguments:_9;
for(var i=0,_c=_a.length;i<_c;i++){
this.add(_a[i]);
}
}else{
for(var _d in _9){
if(this.allowFunctions||typeof _9[_d]!="function"){
this.add(_9[_d],_d);
}
}
}
},each:function(fn,_f){
for(var i=0,len=this.items.length;i<len;i++){
fn.call(_f||window,this.items[i]);
}
},eachKey:function(fn,_13){
for(var i=0,len=this.keys.length;i<len;i++){
fn.call(_13||window,this.keys[i],this.items[i]);
}
},find:function(fn,_17){
for(var i=0,len=this.items.length;i<len;i++){
if(fn.call(_17||window,this.items[i])){
return this.items[i];
}
}
return null;
},insert:function(_1a,key,o){
if(arguments.length==2){
o=arguments[1];
key=this.getKey(o);
}
if(_1a>=this.items.length){
return this.add(o,key);
}
this.items.splice(_1a,0,o);
if(typeof key!="undefined"&&key!=null){
this.items[key]=o;
this.keys.splice(_1a,0,key);
}
this.fireEvent("add",_1a,o,key);
return o;
},remove:function(o){
var _1e=this.indexOf(o);
this.items.splice(_1e,1);
if(typeof this.keys[_1e]!="undefined"){
var key=this.keys[_1e];
this.keys.splice(_1e,1);
delete this.items[key];
}
this.fireEvent("remove",o);
return o;
},removeAt:function(_20){
this.items.splice(_20,1);
var key=this.keys[_20];
if(typeof key!="undefined"){
this.keys.splice(_20,1);
delete this.items[key];
}
this.fireEvent("remove",o,key);
},removeKey:function(key){
var o=this.items[key];
var _24=this.indexOf(o);
this.items.splice(_24,1);
this.keys.splice(_24,1);
delete this.items[key];
this.fireEvent("remove",o,key);
},getCount:function(){
return this.items.length;
},indexOf:function(o){
if(!this.items.indexOf){
for(var i=0,len=this.items.length;i<len;i++){
if(this.items[i]==o){
return i;
}
}
return -1;
}else{
return this.items.indexOf(o);
}
},indexOfKey:function(key){
if(!this.keys.indexOf){
for(var i=0,len=this.keys.length;i<len;i++){
if(this.keys[i]==key){
return i;
}
}
return -1;
}else{
return this.keys.indexOf(key);
}
},item:function(key){
return this.items[key];
},contains:function(o){
return this.indexOf(o)!=-1;
},containsKey:function(key){
return typeof this.items[key]!="undefined";
},clear:function(o){
this.items=[];
this.keys=[];
this.fireEvent("clear");
},first:function(){
return this.items[0];
},last:function(){
return this.items[this.items.length];
}});
YAHOO.ext.util.MixedCollection.prototype.get=YAHOO.ext.util.MixedCollection.prototype.item;


YAHOO.ext.LayoutManager=function(_1){
YAHOO.ext.LayoutManager.superclass.constructor.call(this);
this.el=getEl(_1,true);
this.id=this.el.id;
this.el.addClass("ylayout-container");
this.monitorWindowResize=true;
this.regions={};
this.events={"layout":new YAHOO.util.CustomEvent(),"regionresized":new YAHOO.util.CustomEvent(),"regioncollapsed":new YAHOO.util.CustomEvent(),"regionexpanded":new YAHOO.util.CustomEvent()};
this.updating=false;
YAHOO.ext.EventManager.onWindowResize(this.onWindowResize,this,true);
};
YAHOO.extendX(YAHOO.ext.LayoutManager,YAHOO.ext.util.Observable,{isUpdating:function(){
return this.updating;
},beginUpdate:function(){
this.updating=true;
},endUpdate:function(_2){
this.updating=false;
if(!_2){
this.layout();
}
},layout:function(){
},onRegionResized:function(_3,_4){
this.fireEvent("regionresized",_3,_4);
this.layout();
},onRegionCollapsed:function(_5){
this.fireEvent("regioncollapsed",_5);
},onRegionExpanded:function(_6){
this.fireEvent("regionexpanded",_6);
},getViewSize:function(){
var _7;
if(this.el.dom!=document.body){
this.el.beginMeasure();
_7=this.el.getSize();
this.el.endMeasure();
}else{
_7={width:YAHOO.util.Dom.getViewportWidth(),height:YAHOO.util.Dom.getViewportHeight()};
}
_7.width-=this.el.getBorderWidth("lr")-this.el.getPadding("lr");
_7.height-=this.el.getBorderWidth("tb")-this.el.getPadding("tb");
return _7;
},getEl:function(){
return this.el;
},getRegion:function(_8){
return this.regions[_8.toLowerCase()];
},onWindowResize:function(){
if(this.monitorWindowResize){
this.layout();
}
}});


YAHOO.ext.BorderLayout=function(_1,_2){
YAHOO.ext.BorderLayout.superclass.constructor.call(this,_1);
this.factory=_2.factory||YAHOO.ext.BorderLayout.RegionFactory;
this.hideOnLayout=_2.hideOnLayout||false;
for(var i=0,_4=this.factory.validRegions.length;i<_4;i++){
var _5=this.factory.validRegions[i];
if(_2[_5]){
this.addRegion(_5,_2[_5]);
}
}
};
YAHOO.extendX(YAHOO.ext.BorderLayout,YAHOO.ext.LayoutManager,{addRegion:function(_6,_7){
if(!this.regions[_6]){
var r=this.factory.create(_6,this,_7);
this.regions[_6]=r;
r.on("visibilitychange",this.layout,this,true);
r.on("paneladded",this.layout,this,true);
r.on("panelremoved",this.layout,this,true);
r.on("invalidated",this.layout,this,true);
r.on("resized",this.onRegionResized,this,true);
r.on("collapsed",this.onRegionCollapsed,this,true);
r.on("expanded",this.onRegionExpanded,this,true);
}
return this.regions[_6];
},layout:function(){
if(this.updating){
return;
}
var _9=this.getViewSize();
var w=_9.width,h=_9.height;
var _c=w,_d=h,_e=0,_f=0;
var x=0,y=0;
var rs=this.regions;
var n=rs["north"],s=rs["south"],_15=rs["west"],e=rs["east"],c=rs["center"];
if(this.hideOnLayout){
c.el.setStyle("display","none");
}
if(n&&n.isVisible()){
var b=n.getBox();
var m=n.getMargins();
b.width=w-(m.left+m.right);
b.x=m.left;
b.y=m.top;
_e=b.height+b.y+m.bottom;
_d-=_e;
n.updateBox(this.safeBox(b));
}
if(s&&s.isVisible()){
var b=s.getBox();
var m=s.getMargins();
b.width=w-(m.left+m.right);
b.x=m.left;
var _1a=(b.height+m.top+m.bottom);
b.y=h-_1a+m.top;
_d-=_1a;
s.updateBox(this.safeBox(b));
}
if(_15&&_15.isVisible()){
var b=_15.getBox();
var m=_15.getMargins();
b.height=_d-(m.top+m.bottom);
b.x=m.left;
b.y=_e+m.top;
var _1b=(b.width+m.left+m.right);
_f+=_1b;
_c-=_1b;
_15.updateBox(this.safeBox(b));
}
if(e&&e.isVisible()){
var b=e.getBox();
var m=e.getMargins();
b.height=_d-(m.top+m.bottom);
var _1b=(b.width+m.left+m.right);
b.x=w-_1b+m.left;
b.y=_e+m.top;
_c-=_1b;
e.updateBox(this.safeBox(b));
}
if(c){
var m=c.getMargins();
var _1c={x:_f+m.left,y:_e+m.top,width:_c-(m.left+m.right),height:_d-(m.top+m.bottom)};
if(this.hideOnLayout){
c.el.setStyle("display","block");
}
c.updateBox(this.safeBox(_1c));
}
this.el.repaint();
this.fireEvent("layout",this);
},safeBox:function(box){
box.width=Math.max(0,box.width);
box.height=Math.max(0,box.height);
return box;
},add:function(_1e,_1f){
_1e=_1e.toLowerCase();
return this.regions[_1e].add(_1f);
},remove:function(_20,_21){
_20=_20.toLowerCase();
return this.regions[_20].remove(_21);
},findPanel:function(_22){
var rs=this.regions;
for(var _24 in rs){
if(typeof rs[_24]!="function"){
var p=rs[_24].getPanel(_22);
if(p){
return p;
}
}
}
return null;
},showPanel:function(_26){
var rs=this.regions;
for(var _28 in rs){
var r=rs[_28];
if(typeof r!="function"){
if(r.hasPanel(_26)){
return r.showPanel(_26);
}
}
}
return null;
},restoreState:function(_2a){
if(!_2a){
_2a=YAHOO.ext.state.Manager;
}
var sm=new YAHOO.ext.LayoutStateManager();
sm.init(this,_2a);
}});
YAHOO.ext.BorderLayout.RegionFactory={};
YAHOO.ext.BorderLayout.RegionFactory.validRegions=["north","south","east","west","center"];
YAHOO.ext.BorderLayout.RegionFactory.create=function(_2c,mgr,_2e){
if(_2e.lightweight){
return new YAHOO.ext.LayoutRegionLite(mgr,_2e);
}
_2c=_2c.toLowerCase();
switch(_2c){
case "north":
return new YAHOO.ext.NorthLayoutRegion(mgr,_2e);
case "south":
return new YAHOO.ext.SouthLayoutRegion(mgr,_2e);
case "east":
return new YAHOO.ext.EastLayoutRegion(mgr,_2e);
case "west":
return new YAHOO.ext.WestLayoutRegion(mgr,_2e);
case "center":
return new YAHOO.ext.CenterLayoutRegion(mgr,_2e);
}
throw "Layout region \""+_2c+"\" not supported.";
};


YAHOO.ext.ContentPanel=function(el,_2,_3){
YAHOO.ext.ContentPanel.superclass.constructor.call(this);
this.el=getEl(el,true);
if(!this.el&&_2&&_2.autoCreate){
if(typeof _2.autoCreate=="object"){
if(!_2.autoCreate.id){
_2.autoCreate.id=el;
}
this.el=YAHOO.ext.DomHelper.append(document.body,_2.autoCreate,true);
}else{
this.el=YAHOO.ext.DomHelper.append(document.body,{tag:"div",cls:"ylayout-inactive-content",id:el},true);
}
}
this.closable=false;
this.loaded=false;
this.active=false;
if(typeof _2=="string"){
this.title=_2;
}else{
YAHOO.ext.util.Config.apply(this,_2);
}
if(this.resizeEl){
this.resizeEl=getEl(this.resizeEl,true);
}else{
this.resizeEl=this.el;
}
this.events={"activate":new YAHOO.util.CustomEvent("activate"),"deactivate":new YAHOO.util.CustomEvent("deactivate")};
if(this.autoScroll){
this.el.setStyle("overflow","auto");
}
if(_3){
this.setContent(_3);
}
};
YAHOO.extendX(YAHOO.ext.ContentPanel,YAHOO.ext.util.Observable,{setRegion:function(_4){
this.region=_4;
if(_4){
this.el.replaceClass("ylayout-inactive-content","ylayout-active-content");
}else{
this.el.replaceClass("ylayout-active-content","ylayout-inactive-content");
}
},getToolbar:function(){
return this.toolbar;
},setActiveState:function(_5){
this.active=_5;
if(!_5){
this.fireEvent("deactivate",this);
}else{
this.fireEvent("activate",this);
}
},setContent:function(_6,_7){
this.el.update(_6,_7);
},getUpdateManager:function(){
return this.el.getUpdateManager();
},setUrl:function(_8,_9,_a){
if(this.refreshDelegate){
this.removeListener("activate",this.refreshDelegate);
}
this.refreshDelegate=this._handleRefresh.createDelegate(this,[_8,_9,_a]);
this.on("activate",this._handleRefresh.createDelegate(this,[_8,_9,_a]));
return this.el.getUpdateManager();
},_handleRefresh:function(_b,_c,_d){
if(!_d||!this.loaded){
var _e=this.el.getUpdateManager();
_e.update(_b,_c,this._setLoaded.createDelegate(this));
}
},_setLoaded:function(){
this.loaded=true;
},getId:function(){
return this.el.id;
},getEl:function(){
return this.el;
},adjustForComponents:function(_f,_10){
if(this.toolbar){
var te=this.toolbar.getEl();
_10-=te.getHeight();
te.setWidth(_f);
}
if(this.adjustments){
_f+=this.adjustments[0];
_10+=this.adjustments[1];
}
return {"width":_f,"height":_10};
},setSize:function(_12,_13){
if(this.fitToFrame){
var _14=this.adjustForComponents(_12,_13);
this.resizeEl.setSize(this.autoWidth?"auto":_14.width,_14.height);
}
},getTitle:function(){
return this.title;
},setTitle:function(_15){
this.title=_15;
if(this.region){
this.region.updatePanelTitle(this,_15);
}
},isClosable:function(){
return this.closable;
},beforeSlide:function(){
this.el.clip();
this.resizeEl.clip();
},afterSlide:function(){
this.el.unclip();
this.resizeEl.unclip();
},refresh:function(){
if(this.refreshDelegate){
this.loaded=false;
this.refreshDelegate();
}
},destroy:function(){
this.el.removeAllListeners();
var _16=document.createElement("span");
_16.appendChild(this.el.dom);
_16.innerHTML="";
this.el=null;
}});
YAHOO.ext.GridPanel=function(_17,_18){
this.wrapper=YAHOO.ext.DomHelper.append(document.body,{tag:"div",cls:"ylayout-grid-wrapper ylayout-inactive-content"},true);
this.wrapper.dom.appendChild(_17.container.dom);
YAHOO.ext.GridPanel.superclass.constructor.call(this,this.wrapper,_18);
if(this.toolbar){
this.toolbar.el.insertBefore(this.wrapper.dom.firstChild);
}
_17.monitorWindowResize=false;
_17.autoHeight=false;
_17.autoWidth=false;
this.grid=_17;
this.grid.container.replaceClass("ylayout-inactive-content","ylayout-component-panel");
};
YAHOO.extendX(YAHOO.ext.GridPanel,YAHOO.ext.ContentPanel,{getId:function(){
return this.grid.id;
},getGrid:function(){
return this.grid;
},setSize:function(_19,_1a){
var _1b=this.grid;
var _1c=this.adjustForComponents(_19,_1a);
_1b.container.setSize(_1c.width,_1c.height);
_1b.autoSize();
},beforeSlide:function(){
this.grid.getView().wrapEl.clip();
},afterSlide:function(){
this.grid.getView().wrapEl.unclip();
},destroy:function(){
this.grid.getView().unplugDataModel(this.grid.getDataModel());
this.grid.container.removeAllListeners();
YAHOO.ext.GridPanel.superclass.destroy.call(this);
}});
YAHOO.ext.NestedLayoutPanel=function(_1d,_1e){
YAHOO.ext.NestedLayoutPanel.superclass.constructor.call(this,_1d.getEl(),_1e);
_1d.monitorWindowResize=false;
this.layout=_1d;
this.layout.getEl().addClass("ylayout-nested-layout");
};
YAHOO.extendX(YAHOO.ext.NestedLayoutPanel,YAHOO.ext.ContentPanel,{setSize:function(_1f,_20){
var _21=this.adjustForComponents(_1f,_20);
this.layout.getEl().setSize(_21.width,_21.height);
this.layout.layout();
},getLayout:function(){
return this.layout;
}});


YAHOO.ext.LayoutRegion=function(_1,_2,_3){
this.mgr=_1;
this.position=_3;
var dh=YAHOO.ext.DomHelper;
this.el=dh.append(_1.el.dom,{tag:"div",cls:"ylayout-panel ylayout-panel-"+this.position},true);
this.titleEl=dh.append(this.el.dom,{tag:"div",unselectable:"on",cls:"yunselectable ylayout-panel-hd ylayout-title-"+this.position,children:[{tag:"span",cls:"yunselectable ylayout-panel-hd-text",unselectable:"on",html:"&#160;"},{tag:"div",cls:"yunselectable ylayout-panel-hd-tools",unselectable:"on"}]},true);
this.titleEl.enableDisplayMode();
this.titleTextEl=this.titleEl.dom.firstChild;
this.tools=getEl(this.titleEl.dom.childNodes[1],true);
this.closeBtn=this.createTool(this.tools.dom,"ylayout-close");
this.closeBtn.enableDisplayMode();
this.closeBtn.on("click",this.closeClicked,this,true);
this.closeBtn.hide();
this.bodyEl=dh.append(this.el.dom,{tag:"div",cls:"ylayout-panel-body"},true);
this.events={"beforeremove":new YAHOO.util.CustomEvent("beforeremove"),"invalidated":new YAHOO.util.CustomEvent("invalidated"),"visibilitychange":new YAHOO.util.CustomEvent("visibilitychange"),"paneladded":new YAHOO.util.CustomEvent("paneladded"),"panelremoved":new YAHOO.util.CustomEvent("panelremoved"),"collapsed":new YAHOO.util.CustomEvent("collapsed"),"expanded":new YAHOO.util.CustomEvent("expanded"),"panelactivated":new YAHOO.util.CustomEvent("panelactivated"),"resized":new YAHOO.util.CustomEvent("resized")};
this.panels=new YAHOO.ext.util.MixedCollection();
this.panels.getKey=this.getPanelId.createDelegate(this);
this.box=null;
this.visible=false;
this.collapsed=false;
this.hide();
this.on("paneladded",this.validateVisibility,this,true);
this.on("panelremoved",this.validateVisibility,this,true);
this.activePanel=null;
this.applyConfig(_2);
};
YAHOO.extendX(YAHOO.ext.LayoutRegion,YAHOO.ext.util.Observable,{getPanelId:function(p){
return p.getId();
},applyConfig:function(_6){
if(_6.collapsible&&this.position!="center"&&!this.collapsedEl){
var dh=YAHOO.ext.DomHelper;
this.collapseBtn=this.createTool(this.tools.dom,"ylayout-collapse-"+this.position);
this.collapseBtn.mon("click",this.collapse,this,true);
this.collapsedEl=dh.append(this.mgr.el.dom,{tag:"div",cls:"ylayout-collapsed ylayout-collapsed-"+this.position,children:[{tag:"div",cls:"ylayout-collapsed-tools"}]},true);
if(_6.floatable!==false){
this.collapsedEl.addClassOnOver("ylayout-collapsed-over");
this.collapsedEl.mon("click",this.collapseClick,this,true);
}
this.expandBtn=this.createTool(this.collapsedEl.dom.firstChild,"ylayout-expand-"+this.position);
this.expandBtn.mon("click",this.expand,this,true);
}
if(this.collapseBtn){
this.collapseBtn.setVisible(_6.collapsible==true);
}
this.cmargins=_6.cmargins||this.cmargins||(this.position=="west"||this.position=="east"?{top:0,left:2,right:2,bottom:0}:{top:2,left:0,right:0,bottom:2});
this.margins=_6.margins||this.margins||{top:0,left:0,right:0,bottom:0};
this.bottomTabs=_6.tabPosition!="top";
this.autoScroll=_6.autoScroll||false;
if(this.autoScroll){
this.bodyEl.setStyle("overflow","auto");
}else{
this.bodyEl.setStyle("overflow","hidden");
}
if((!_6.titlebar&&!_6.title)||_6.titlebar===false){
this.titleEl.hide();
}else{
this.titleEl.show();
if(_6.title){
this.titleTextEl.innerHTML=_6.title;
}
}
this.duration=_6.duration||0.3;
this.slideDuration=_6.slideDuration||0.45;
this.config=_6;
if(_6.collapsed){
this.collapse(true);
}
},resizeTo:function(_8){
switch(this.position){
case "east":
case "west":
this.el.setWidth(_8);
this.fireEvent("resized",this,_8);
break;
case "north":
case "south":
this.el.setHeight(_8);
this.fireEvent("resized",this,_8);
break;
}
},getBox:function(){
var b;
if(!this.collapsed){
b=this.el.getBox(false,true);
}else{
b=this.collapsedEl.getBox(false,true);
}
return b;
},getMargins:function(){
return this.collapsed?this.cmargins:this.margins;
},highlight:function(){
this.el.addClass("ylayout-panel-dragover");
},unhighlight:function(){
this.el.removeClass("ylayout-panel-dragover");
},updateBox:function(_a){
this.box=_a;
if(!this.collapsed){
this.el.dom.style.left=_a.x+"px";
this.el.dom.style.top=_a.y+"px";
this.el.setSize(_a.width,_a.height);
var _b=this.titleEl.isVisible()?_a.height-(this.titleEl.getHeight()||0):_a.height;
_b-=this.el.getBorderWidth("tb");
bodyWidth=_a.width-this.el.getBorderWidth("rl");
this.bodyEl.setHeight(_b);
this.bodyEl.setWidth(bodyWidth);
var _c=_b;
if(this.tabs){
_c=this.tabs.syncHeight(_b);
if(YAHOO.ext.util.Browser.isIE){
this.tabs.el.repaint();
}
}
this.panelSize={width:bodyWidth,height:_c};
if(this.activePanel){
this.activePanel.setSize(bodyWidth,_c);
}
}else{
this.collapsedEl.dom.style.left=_a.x+"px";
this.collapsedEl.dom.style.top=_a.y+"px";
this.collapsedEl.setSize(_a.width,_a.height);
}
if(this.tabs){
this.tabs.autoSizeTabs();
}
},getEl:function(){
return this.el;
},hide:function(){
if(!this.collapsed){
this.el.dom.style.left="-2000px";
this.el.hide();
}else{
this.collapsedEl.dom.style.left="-2000px";
this.collapsedEl.hide();
}
this.visible=false;
this.fireEvent("visibilitychange",this,false);
},show:function(){
if(!this.collapsed){
this.el.show();
}else{
this.collapsedEl.show();
}
this.visible=true;
this.fireEvent("visibilitychange",this,true);
},isVisible:function(){
return this.visible;
},closeClicked:function(){
if(this.activePanel){
this.remove(this.activePanel);
}
},collapseClick:function(e){
if(this.isSlid){
e.stopPropagation();
this.slideIn();
}else{
e.stopPropagation();
this.slideOut();
}
},collapse:function(_e){
if(this.collapsed){
return;
}
this.collapsed=true;
if(this.split){
this.split.el.hide();
}
if(this.config.animate&&_e!==true){
this.fireEvent("invalidated",this);
this.animateCollapse();
}else{
this.el.setLocation(-20000,-20000);
this.el.hide();
this.collapsedEl.show();
this.fireEvent("collapsed",this);
this.fireEvent("invalidated",this);
}
},animateCollapse:function(){
},expand:function(e,_10){
if(e){
e.stopPropagation();
}
if(!this.collapsed){
return;
}
if(this.isSlid){
this.slideIn(this.expand.createDelegate(this));
return;
}
this.collapsed=false;
this.el.show();
if(this.config.animate&&_10!==true){
this.animateExpand();
}else{
if(this.split){
this.split.el.show();
}
this.collapsedEl.setLocation(-2000,-2000);
this.collapsedEl.hide();
this.fireEvent("invalidated",this);
this.fireEvent("expanded",this);
}
},animateExpand:function(){
},initTabs:function(){
this.bodyEl.setStyle("overflow","hidden");
var ts=new YAHOO.ext.TabPanel(this.bodyEl.dom,this.bottomTabs);
this.tabs=ts;
ts.resizeTabs=this.config.resizeTabs===true;
ts.minTabWidth=this.config.minTabWidth||40;
ts.maxTabWidth=this.config.maxTabWidth||250;
ts.preferredTabWidth=this.config.preferredTabWidth||150;
ts.monitorResize=false;
ts.bodyEl.setStyle("overflow",this.config.autoScroll?"auto":"hidden");
this.panels.each(this.initPanelAsTab,this);
},initPanelAsTab:function(_12){
var ti=this.tabs.addTab(_12.getEl().id,_12.getTitle(),null,this.config.closeOnTab&&_12.isClosable());
ti.on("activate",function(){
this.setActivePanel(_12);
},this,true);
if(this.config.closeOnTab){
ti.on("beforeclose",function(t,e){
e.cancel=true;
this.remove(_12);
},this,true);
}
return ti;
},updatePanelTitle:function(_16,_17){
if(this.activePanel==_16){
this.updateTitle(_17);
}
if(this.tabs){
this.tabs.getTab(_16.getEl().id).setText(_17);
}
},updateTitle:function(_18){
if(this.titleTextEl&&!this.config.title){
this.titleTextEl.innerHTML=(typeof _18!="undefined"&&_18.length>0?_18:"&#160;");
}
},setActivePanel:function(_19){
_19=this.getPanel(_19);
if(this.activePanel&&this.activePanel!=_19){
this.activePanel.setActiveState(false);
}
this.activePanel=_19;
_19.setActiveState(true);
if(this.panelSize){
_19.setSize(this.panelSize.width,this.panelSize.height);
}
this.closeBtn.setVisible(!this.config.closeOnTab&&!this.isSlid&&_19.isClosable());
this.updateTitle(_19.getTitle());
this.fireEvent("panelactivated",this,_19);
},showPanel:function(_1a){
if(_1a=this.getPanel(_1a)){
if(this.tabs){
this.tabs.activate(_1a.getEl().id);
}else{
this.setActivePanel(_1a);
}
}
return _1a;
},getActivePanel:function(){
return this.activePanel;
},validateVisibility:function(){
if(this.panels.getCount()<1){
this.updateTitle("&#160;");
this.closeBtn.hide();
this.hide();
}else{
if(!this.isVisible()){
this.show();
}
}
},add:function(_1b){
if(arguments.length>1){
for(var i=0,len=arguments.length;i<len;i++){
this.add(arguments[i]);
}
return null;
}
if(this.hasPanel(_1b)){
this.showPanel(_1b);
return _1b;
}
_1b.setRegion(this);
this.panels.add(_1b);
if(this.panels.getCount()==1&&!this.config.alwaysShowTabs){
this.bodyEl.dom.appendChild(_1b.getEl().dom);
this.setActivePanel(_1b);
this.fireEvent("paneladded",this,_1b);
return _1b;
}
if(!this.tabs){
this.initTabs();
}else{
this.initPanelAsTab(_1b);
}
this.tabs.activate(_1b.getEl().id);
this.fireEvent("paneladded",this,_1b);
return _1b;
},hasPanel:function(_1e){
if(typeof _1e=="object"){
_1e=_1e.getId();
}
return this.getPanel(_1e)?true:false;
},hidePanel:function(_1f){
if(this.tabs&&(_1f=this.getPanel(_1f))){
this.tabs.hideTab(_1f.getEl().id);
}
},unhidePanel:function(_20){
if(this.tabs&&(_20=this.getPanel(_20))){
this.tabs.unhideTab(_20.getEl().id);
}
},clearPanels:function(){
while(this.panels.getCount()>0){
this.remove(this.panels.first());
}
},remove:function(_21,_22){
_21=this.getPanel(_21);
if(!_21){
return null;
}
var e={};
this.fireEvent("beforeremove",this,_21,e);
if(e.cancel===true){
return null;
}
_22=(typeof _22!="undefined"?_22:(this.config.preservePanels===true||_21.preserve===true));
var _24=_21.getId();
this.panels.removeKey(_24);
if(_22){
document.body.appendChild(_21.getEl().dom);
}
if(this.tabs){
this.tabs.removeTab(_21.getEl().id);
}else{
if(!_22){
this.bodyEl.dom.removeChild(_21.getEl().dom);
}
}
if(this.panels.getCount()==1&&this.tabs&&!this.config.alwaysShowTabs){
var p=this.panels.first();
var _26=document.createElement("span");
_26.appendChild(p.getEl().dom);
this.bodyEl.update("");
this.bodyEl.dom.appendChild(p.getEl().dom);
_26=null;
this.updateTitle(p.getTitle());
this.tabs=null;
this.bodyEl.setStyle("overflow",this.config.autoScroll?"auto":"hidden");
this.setActivePanel(p);
}
_21.setRegion(null);
if(this.activePanel==_21){
this.activePanel=null;
}
if(this.config.autoDestroy!==false&&_22!==true){
try{
_21.destroy();
}
catch(e){
}
}
this.fireEvent("panelremoved",this,_21);
return _21;
},getTabs:function(){
return this.tabs;
},getPanel:function(id){
if(typeof id=="object"){
return id;
}
return this.panels.get(id);
},getPosition:function(){
return this.position;
},createTool:function(_28,_29){
var btn=YAHOO.ext.DomHelper.append(_28,{tag:"div",cls:"ylayout-tools-button",children:[{tag:"div",cls:"ylayout-tools-button-inner "+_29,html:"&#160;"}]},true);
btn.addClassOnOver("ylayout-tools-button-over");
return btn;
}});


YAHOO.ext.LayoutStateManager=function(_1){
this.state={north:{},south:{},east:{},west:{}};
};
YAHOO.ext.LayoutStateManager.prototype={init:function(_2,_3){
this.provider=_3;
var _4=_3.get(_2.id+"-layout-state");
if(_4){
var _5=_2.isUpdating();
if(!_5){
_2.beginUpdate();
}
for(var _6 in _4){
if(typeof _4[_6]!="function"){
var _7=_4[_6];
var r=_2.getRegion(_6);
if(r&&_7){
if(_7.size){
r.resizeTo(_7.size);
}
if(_7.collapsed==true){
r.collapse(true);
}else{
r.expand(null,true);
}
}
}
}
if(!_5){
_2.endUpdate();
}
this.state=_4;
}
this.layout=_2;
_2.on("regionresized",this.onRegionResized,this,true);
_2.on("regioncollapsed",this.onRegionCollapsed,this,true);
_2.on("regionexpanded",this.onRegionExpanded,this,true);
},storeState:function(){
this.provider.set(this.layout.id+"-layout-state",this.state);
},onRegionResized:function(_9,_a){
this.state[_9.getPosition()].size=_a;
this.storeState();
},onRegionCollapsed:function(_b){
this.state[_b.getPosition()].collapsed=true;
this.storeState();
},onRegionExpanded:function(_c){
this.state[_c.getPosition()].collapsed=false;
this.storeState();
}};


YAHOO.ext.SplitLayoutRegion=function(_1,_2,_3,_4){
this.cursor=_4;
YAHOO.ext.SplitLayoutRegion.superclass.constructor.call(this,_1,_2,_3);
if(_2.split){
this.hide();
}
};
YAHOO.extendX(YAHOO.ext.SplitLayoutRegion,YAHOO.ext.LayoutRegion,{applyConfig:function(_5){
YAHOO.ext.SplitLayoutRegion.superclass.applyConfig.call(this,_5);
if(_5.split){
if(!this.split){
var _6=YAHOO.ext.DomHelper.append(this.mgr.el.dom,{tag:"div",id:this.el.id+"-split",cls:"ylayout-split ylayout-split-"+this.position,html:"&#160;"});
this.split=new YAHOO.ext.SplitBar(_6,this.el);
this.split.onMoved.subscribe(this.onSplitMove,this,true);
this.split.useShim=_5.useShim===true;
YAHOO.util.Dom.setStyle([this.split.el.dom,this.split.proxy],"cursor",this.cursor);
this.split.getMaximumSize=this.getMaxSize.createDelegate(this);
}
if(typeof _5.minSize!="undefined"){
this.split.minSize=_5.minSize;
}
if(typeof _5.maxSize!="undefined"){
this.split.maxSize=_5.maxSize;
}
}
},getMaxSize:function(){
var _7=this.config.maxSize||10000;
var _8=this.mgr.getRegion("center");
return Math.min(_7,(this.el.getWidth()+_8.getEl().getWidth())-_8.getMinWidth());
},onSplitMove:function(_9,_a){
this.fireEvent("resized",this,_a);
},getSplitBar:function(){
return this.split;
},hide:function(){
if(this.split){
this.split.el.setLocation(-2000,-2000);
this.split.el.hide();
}
YAHOO.ext.SplitLayoutRegion.superclass.hide.call(this);
},show:function(){
if(this.split){
this.split.el.show();
}
YAHOO.ext.SplitLayoutRegion.superclass.show.call(this);
},beforeSlide:function(){
if(YAHOO.ext.util.Browser.isGecko){
this.bodyEl.clip();
if(this.tabs){
this.tabs.bodyEl.clip();
}
if(this.activePanel){
this.activePanel.getEl().clip();
if(this.activePanel.beforeSlide){
this.activePanel.beforeSlide();
}
}
}
},afterSlide:function(){
if(YAHOO.ext.util.Browser.isGecko){
this.bodyEl.unclip();
if(this.tabs){
this.tabs.bodyEl.unclip();
}
if(this.activePanel){
this.activePanel.getEl().unclip();
if(this.activePanel.afterSlide){
this.activePanel.afterSlide();
}
}
}
},slideOut:function(){
if(!this.slideEl){
this.slideEl=new YAHOO.ext.Actor(YAHOO.ext.DomHelper.append(this.mgr.el.dom,{tag:"div",cls:"ylayout-slider"}));
if(this.config.autoHide!==false){
var _b=new YAHOO.ext.util.DelayedTask(this.slideIn,this);
this.slideEl.mon("mouseout",function(e){
var to=e.getRelatedTarget();
if(to&&to!=this.slideEl.dom&&!YAHOO.util.Dom.isAncestor(this.slideEl.dom,to)){
_b.delay(500);
}
},this,true);
this.slideEl.mon("mouseover",function(e){
_b.cancel();
},this,true);
}
}
var sl=this.slideEl,c=this.collapsedEl,cm=this.cmargins;
this.isSlid=true;
this.snapshot={"left":this.el.getLeft(true),"top":this.el.getTop(true),"colbtn":this.collapseBtn.isVisible(),"closebtn":this.closeBtn.isVisible()};
this.collapseBtn.hide();
this.closeBtn.hide();
this.el.show();
this.el.setLeftTop(0,0);
sl.startCapture(true);
var _12;
switch(this.position){
case "west":
sl.setLeft(c.getRight(true));
sl.setTop(c.getTop(true));
_12=this.el.getWidth();
break;
case "east":
sl.setRight(this.mgr.getViewSize().width-c.getLeft(true));
sl.setTop(c.getTop(true));
_12=this.el.getWidth();
break;
case "north":
sl.setLeft(c.getLeft(true));
sl.setTop(c.getBottom(true));
_12=this.el.getHeight();
break;
case "south":
sl.setLeft(c.getLeft(true));
sl.setBottom(this.mgr.getViewSize().height-c.getTop(true));
_12=this.el.getHeight();
break;
}
sl.dom.appendChild(this.el.dom);
YAHOO.util.Event.on(document.body,"click",this.slideInIf,this,true);
sl.setSize(this.el.getWidth(),this.el.getHeight());
this.beforeSlide();
if(this.activePanel){
this.activePanel.setSize(this.bodyEl.getWidth(),this.bodyEl.getHeight());
}
sl.slideShow(this.getAnchor(),_12,this.slideDuration,null,false);
sl.play(function(){
this.afterSlide();
}.createDelegate(this));
},slideInIf:function(e){
var t=YAHOO.util.Event.getTarget(e);
if(!YAHOO.util.Dom.isAncestor(this.el.dom,t)){
this.slideIn();
}
},slideIn:function(_15){
if(this.isSlid&&!this.slideEl.playlist.isPlaying()){
YAHOO.util.Event.removeListener(document.body,"click",this.slideInIf,this,true);
this.slideEl.startCapture(true);
this.slideEl.slideHide(this.getAnchor(),this.slideDuration,null);
this.beforeSlide();
this.slideEl.play(function(){
this.isSlid=false;
this.el.setPositioning(this.snapshot);
this.collapseBtn.setVisible(this.snapshot.colbtn);
this.closeBtn.setVisible(this.snapshot.closebtn);
this.afterSlide();
this.mgr.el.dom.appendChild(this.el.dom);
if(typeof _15=="function"){
_15();
}
}.createDelegate(this));
}
},animateExpand:function(){
var em=this.margins,cm=this.cmargins;
var c=this.collapsedEl,el=this.el;
var _1a,_1b;
switch(this.position){
case "west":
_1a="right";
el.setLeft(-(el.getWidth()+(em.right+em.left)));
el.setTop(c.getTop(true)-cm.top+em.top);
_1b=el.getWidth()+(em.right+em.left);
break;
case "east":
_1a="left";
el.setLeft(this.mgr.getViewSize().width+em.left);
el.setTop(c.getTop(true)-cm.top+em.top);
_1b=el.getWidth()+(em.right+em.left);
break;
case "north":
_1a="down";
el.setLeft(em.left);
el.setTop(-(el.getHeight()+(em.top+em.bottom)));
_1b=el.getHeight()+(em.top+em.bottom);
break;
case "south":
_1a="up";
el.setLeft(em.left);
el.setTop(this.mgr.getViewSize().height+em.top);
_1b=el.getHeight()+(em.top+em.bottom);
break;
}
this.beforeSlide();
el.setStyle("z-index","100");
el.show();
c.setLocation(-2000,-2000);
c.hide();
el.move(_1a,_1b,true,this.duration,function(){
this.afterSlide();
el.setStyle("z-index","");
if(this.split){
this.split.el.show();
}
this.fireEvent("invalidated",this);
this.fireEvent("expanded",this);
}.createDelegate(this),this.config.easing||YAHOO.util.Easing.easeOut);
},animateCollapse:function(){
var em=this.margins,cm=this.cmargins;
var c=this.collapsedEl,el=this.el;
var _20,_21;
switch(this.position){
case "west":
_20="left";
_21=el.getWidth()+(em.right+em.left);
break;
case "east":
_20="right";
_21=el.getWidth()+(em.right+em.left);
break;
case "north":
_20="up";
_21=el.getHeight()+(em.top+em.bottom);
break;
case "south":
_20="down";
_21=el.getHeight()+(em.top+em.bottom);
break;
}
this.el.setStyle("z-index","100");
this.beforeSlide();
this.el.move(_20,_21,true,this.duration,function(){
this.afterSlide();
this.el.setStyle("z-index","");
this.el.setLocation(-20000,-20000);
this.el.hide();
this.collapsedEl.show();
this.fireEvent("collapsed",this);
}.createDelegate(this),YAHOO.util.Easing.easeIn);
},getAnchor:function(){
switch(this.position){
case "west":
return "left";
case "east":
return "right";
case "north":
return "top";
case "south":
return "bottom";
}
}});


YAHOO.ext.CenterLayoutRegion=function(_1,_2){
YAHOO.ext.CenterLayoutRegion.superclass.constructor.call(this,_1,_2,"center");
this.visible=true;
this.minWidth=_2.minWidth||20;
this.minHeight=_2.minHeight||20;
};
YAHOO.extendX(YAHOO.ext.CenterLayoutRegion,YAHOO.ext.LayoutRegion,{hide:function(){
},show:function(){
},getMinWidth:function(){
return this.minWidth;
},getMinHeight:function(){
return this.minHeight;
}});
YAHOO.ext.NorthLayoutRegion=function(_3,_4){
YAHOO.ext.NorthLayoutRegion.superclass.constructor.call(this,_3,_4,"north","n-resize");
if(this.split){
this.split.placement=YAHOO.ext.SplitBar.TOP;
this.split.orientation=YAHOO.ext.SplitBar.VERTICAL;
this.split.el.addClass("ylayout-split-v");
}
if(typeof _4.initialSize!="undefined"){
this.el.setHeight(_4.initialSize);
}
};
YAHOO.extendX(YAHOO.ext.NorthLayoutRegion,YAHOO.ext.SplitLayoutRegion,{getBox:function(){
if(this.collapsed){
return this.collapsedEl.getBox();
}
var _5=this.el.getBox();
if(this.split){
_5.height+=this.split.el.getHeight();
}
return _5;
},updateBox:function(_6){
if(this.split&&!this.collapsed){
_6.height-=this.split.el.getHeight();
this.split.el.setLeft(_6.x);
this.split.el.setTop(_6.y+_6.height);
this.split.el.setWidth(_6.width);
}
if(this.collapsed){
this.el.setWidth(_6.width);
var _7=_6.width-this.el.getBorderWidth("rl");
this.bodyEl.setWidth(_7);
if(this.activePanel&&this.panelSize){
this.activePanel.setSize(_7,this.panelSize.height);
}
}
YAHOO.ext.NorthLayoutRegion.superclass.updateBox.call(this,_6);
}});
YAHOO.ext.SouthLayoutRegion=function(_8,_9){
YAHOO.ext.SouthLayoutRegion.superclass.constructor.call(this,_8,_9,"south","s-resize");
if(this.split){
this.split.placement=YAHOO.ext.SplitBar.BOTTOM;
this.split.orientation=YAHOO.ext.SplitBar.VERTICAL;
this.split.el.addClass("ylayout-split-v");
}
if(typeof _9.initialSize!="undefined"){
this.el.setHeight(_9.initialSize);
}
};
YAHOO.extendX(YAHOO.ext.SouthLayoutRegion,YAHOO.ext.SplitLayoutRegion,{getBox:function(){
if(this.collapsed){
return this.collapsedEl.getBox();
}
var _a=this.el.getBox();
if(this.split){
var sh=this.split.el.getHeight();
_a.height+=sh;
_a.y-=sh;
}
return _a;
},updateBox:function(_c){
if(this.split&&!this.collapsed){
var sh=this.split.el.getHeight();
_c.height-=sh;
_c.y+=sh;
this.split.el.setLeft(_c.x);
this.split.el.setTop(_c.y-sh);
this.split.el.setWidth(_c.width);
}
if(this.collapsed){
this.el.setWidth(_c.width);
var _e=_c.width-this.el.getBorderWidth("rl");
this.bodyEl.setWidth(_e);
if(this.activePanel&&this.panelSize){
this.activePanel.setSize(_e,this.panelSize.height);
}
}
YAHOO.ext.SouthLayoutRegion.superclass.updateBox.call(this,_c);
}});
YAHOO.ext.EastLayoutRegion=function(_f,_10){
YAHOO.ext.EastLayoutRegion.superclass.constructor.call(this,_f,_10,"east","e-resize");
if(this.split){
this.split.placement=YAHOO.ext.SplitBar.RIGHT;
this.split.orientation=YAHOO.ext.SplitBar.HORIZONTAL;
this.split.el.addClass("ylayout-split-h");
}
if(typeof _10.initialSize!="undefined"){
this.el.setWidth(_10.initialSize);
}
};
YAHOO.extendX(YAHOO.ext.EastLayoutRegion,YAHOO.ext.SplitLayoutRegion,{getBox:function(){
if(this.collapsed){
return this.collapsedEl.getBox();
}
var box=this.el.getBox();
if(this.split){
var sw=this.split.el.getWidth();
box.width+=sw;
box.x-=sw;
}
return box;
},updateBox:function(box){
if(this.split&&!this.collapsed){
var sw=this.split.el.getWidth();
box.width-=sw;
this.split.el.setLeft(box.x);
this.split.el.setTop(box.y);
this.split.el.setHeight(box.height);
box.x+=sw;
}
if(this.collapsed){
this.el.setHeight(box.height);
var _15=this.config.titlebar?box.height-(this.titleEl.getHeight()||0):box.height;
_15-=this.el.getBorderWidth("tb");
this.bodyEl.setHeight(_15);
if(this.activePanel&&this.panelSize){
this.activePanel.setSize(this.panelSize.width,_15);
}
}
YAHOO.ext.EastLayoutRegion.superclass.updateBox.call(this,box);
}});
YAHOO.ext.WestLayoutRegion=function(mgr,_17){
YAHOO.ext.WestLayoutRegion.superclass.constructor.call(this,mgr,_17,"west","w-resize");
if(this.split){
this.split.placement=YAHOO.ext.SplitBar.LEFT;
this.split.orientation=YAHOO.ext.SplitBar.HORIZONTAL;
this.split.el.addClass("ylayout-split-h");
}
if(typeof _17.initialSize!="undefined"){
this.el.setWidth(_17.initialSize);
}
};
YAHOO.extendX(YAHOO.ext.WestLayoutRegion,YAHOO.ext.SplitLayoutRegion,{getBox:function(){
if(this.collapsed){
return this.collapsedEl.getBox();
}
var box=this.el.getBox();
if(this.split){
box.width+=this.split.el.getWidth();
}
return box;
},updateBox:function(box){
if(this.split&&!this.collapsed){
var sw=this.split.el.getWidth();
box.width-=sw;
this.split.el.setLeft(box.x+box.width);
this.split.el.setTop(box.y);
this.split.el.setHeight(box.height);
}
if(this.collapsed){
this.el.setHeight(box.height);
var _1b=this.config.titlebar?box.height-(this.titleEl.getHeight()||0):box.height;
_1b-=this.el.getBorderWidth("tb");
this.bodyEl.setHeight(_1b);
if(this.activePanel&&this.panelSize){
this.activePanel.setSize(this.panelSize.width,_1b);
}
}
YAHOO.ext.WestLayoutRegion.superclass.updateBox.call(this,box);
}});


YAHOO.ext.util.CSS=new function(){
var _1=null;
var _2=function(_3){
var _4=function(_5){
var _6=/(-[a-z])/i.exec(_5);
return _5.replace(RegExp.$1,RegExp.$1.substr(1).toUpperCase());
};
while(_3.indexOf("-")>-1){
_3=_4(_3);
}
return _3;
};
this.getRules=function(_7){
if(_1==null||_7){
_1={};
var ds=document.styleSheets;
for(var i=0,_a=ds.length;i<_a;i++){
try{
var ss=ds[i];
var _c=ss.cssRules||ss.rules;
for(var j=_c.length-1;j>=0;--j){
_1[_c[j].selectorText]=_c[j];
}
}
catch(e){
}
}
}
return _1;
};
this.getRule=function(_e,_f){
var rs=this.getRules(_f);
if(!(_e instanceof Array)){
return rs[_e];
}
for(var i=0;i<_e.length;i++){
if(rs[_e[i]]){
return rs[_e[i]];
}
}
return null;
};
this.updateRule=function(_12,_13,_14){
if(!(_12 instanceof Array)){
var _15=this.getRule(_12);
if(_15){
_15.style[_2(_13)]=_14;
return true;
}
}else{
for(var i=0;i<_12.length;i++){
if(this.updateRule(_12[i],_13,_14)){
return true;
}
}
}
return false;
};
this.apply=function(el,_18){
if(!(_18 instanceof Array)){
var _19=this.getRule(_18);
if(_19){
var s=_19.style;
for(var key in s){
if(typeof s[key]!="function"){
if(s[key]&&String(s[key]).indexOf(":")<0&&s[key]!="false"){
try{
el.style[key]=s[key];
}
catch(e){
}
}
}
}
return true;
}
}else{
for(var i=0;i<_18.length;i++){
if(this.apply(el,_18[i])){
return true;
}
}
}
return false;
};
this.applyFirst=function(el,id,_1f){
var _20=["#"+id+" "+_1f,_1f];
return this.apply(el,_20);
};
this.revert=function(el,_22){
if(!(_22 instanceof Array)){
var _23=this.getRule(_22);
if(_23){
for(key in _23.style){
if(_23.style[key]&&String(_23.style[key]).indexOf(":")<0&&_23.style[key]!="false"){
try{
el.style[key]="";
}
catch(e){
}
}
}
return true;
}
}else{
for(var i=0;i<_22.length;i++){
if(this.revert(el,_22[i])){
return true;
}
}
}
return false;
};
this.revertFirst=function(el,id,_27){
var _28=["#"+id+" "+_27,_27];
return this.revert(el,_28);
};
}();


window.showUpperStuff="show";
var jive={};
jive.spank={};
jive.spank.chat={};
var jive_colors=["red","blue","gray","magenta","violet","olive","yellowgreen","darkred","darkgreen","darksalmon","darkcyan","darkyellow","mediumpurple","peru","olivedrab","royalred","darkorange","slateblue","slategray","goldenrod","orangered","tomato","dogderblue","steelblue","deeppink","saddlebrown","coral","royalblue"];
function uniqueColorForString(_1){
var _2=0;
for(var i=0;i<_1.length;i++){
_2+=_1.charCodeAt(i)*i;
}
return jive_colors[_2%jive_colors.length];
}
var spank={loadComponent:function(_4){
if(_4==null||_4==""){
return null;
}
var _5=spank._createComponent(_4);
var _6=spank._loadAttributes(_4);
switch(_4){
case "chat":
return new jive.spank.chat.ChatWindow(_5.id,_6);
case "roster":
return new jive.spank.roster.RosterWindow(_5.id,_6);
default:
return null;
}
},_loadAttributes:function(_7){
if(!spank.conf||!spank.conf[_7]){
return {};
}
return spank.conf[_7];
},_createComponent:function(_8){
var _9=document.createElement("div");
_9.id=YAHOO.util.Dom.generateId();
document.getElementsByTagName("body")[0].appendChild(_9);
return _9;
}};
jive.spank.Window=function(id,_b,_c){
this.bodyId=YAHOO.util.Dom.generateId();
jive.spank.chat.Template.dialog.append(id,{windowTitle:_b,bodyId:this.bodyId});
this.dialog=new YAHOO.ext.LayoutDialog(id,_c);
this.dialog.addKeyListener(27,this.dialog.hide,this.dialog);
this.tabs={};
this.id=id;
};
YAHOO.extend(jive.spank.Window,YAHOO.ext.util.Observable,{isUpdating:false,beginUpdate:function(){
if(!this.isUpdating){
this.isUpdating=true;
this.dialog.beginUpdate();
}
},endUpdate:function(){
if(this.isUpdating){
this.isUpdating=false;
this.dialog.endUpdate();
}
},show:function(){
this.dialog.show();
},hide:function(){
this.dialog.hide();
},isVisible:function(){
return this.dialog.isVisible();
},destroy:function(){
this.hide();
this.dialog.destroy(true);
delete this.dialog;
}});
jive.spank.chat.ChatWindow=function(id,_e){
var _f=_e["width"]?_e["width"]:520;
var _10=_e["height"]?_e["height"]:450;
var x=_e["x"]?_e["x"]:(YAHOO.util.Dom.getViewportWidth()/2)-260;
var y=_e["y"]?_e["y"]:(YAHOO.util.Dom.getViewportHeight()/2)-225;
var _13=_e["resizable"]!="false";
var _14=_e["draggable"]!="false";
var _15=_e["closable"]!="false";
var _16=_e["blinktab"]=="true";
var _17=_e["constrained"]!="false";
if(_16){
this.notificationInterval={};
}
var _18={modal:false,constraintoviewport:_17,width:_f,height:_10,shadow:false,proxyDrag:true,resizable:_13,draggable:_14,minWidth:300,minHeight:300,x:x,y:y,closable:_15};
if(_e["bottomPane"]){
_18=$H(_18).merge({south:{autoScroll:false,initialSize:30},east:{split:true,initialSize:170,minSize:50,maxSize:200,autoScroll:false,collapsible:true},center:{autoScroll:false,autoTabs:false}});
}else{
_18=$H(_18).merge({north:{autoScroll:false,initialSize:500},east:{split:true,initialSize:105,minSize:50,maxSize:200,autoScroll:false,collapsible:true},center:{autoScroll:true,closeOnTab:true,closeontab:true,alwaysShowTabs:true,autoTabs:false}});
}
jive.spank.chat.ChatWindow.superclass.constructor.call(this,id,"Chat",_18);
this.events={"input":true,"message":true,"nickcomplete":true,"mucdblclicked":true,"tabclosed":true,"mucinvitation":true,"changenameinmuc":true,"refreshmuclist":true,"createmuc":true};
var _19=this.dialog.getLayout();
_19.regions["center"].addListener("panelremoved",function(){
if(_19.regions["center"].tabs.items.length==0){
this.dialog.hide();
}
}.bind(this));
this.dialog.addListener("hide",function(){
if(this.destroyed){
return;
}
this.destroyed=true;
this.removeAllTabs();
this.dialog.destroy(true);
this.dialog.proxy.remove();
this.dialog.resizer.proxy.remove();
}.bind(this));
this.newMessages={};
this._wrappedFns={};
};
YAHOO.extend(jive.spank.chat.ChatWindow,jive.spank.Window,{addTab:function(_1a){
this.dialog.beginUpdate();
if(typeof _1a=="string"){
var _1b=_1a;
_1a={name:_1b,jid:_1b};
}
var _1c="jive-tab-"+_1a.jid;
jive.spank.chat.Template.tab.append(this.bodyId,{tabId:_1c});
var _1d=this.dialog.getLayout();
var _1e=new YAHOO.ext.BorderLayout(_1c+"-layout",jive.spank.chat.ChatWindow.tabConfObject);
if(window.showUpperStuff){
_1e.add("north",new YAHOO.ext.ContentPanel(_1c+"-toppane"));
jive.spank.chat.Template.chat_toppane.append(_1c+"-toppane",{tabId:_1c});
_1e.regions["north"].hide();
}
_1e.add("center",new YAHOO.ext.ContentPanel(_1c+"-history"));
_1e=this._layoutTextarea(_1e,_1c,_1a.jid.toString());
_1d.add("center",new YAHOO.ext.NestedLayoutPanel(_1e,{title:_1a.name,closable:true}));
var _1f=this.getTabByJID(_1a.jid);
var _20=getEl(_1c+"-text");
this.tabs[_1a.jid]={type:"chat",tab:this.getTabByJID(_1a.jid),contact:_1a};
var _21=function(_22){
this.clearNotification(_22.jid);
this.dialog.setTitle(_22.name);
this._scrollMessageHistory(getEl("jive-tab-"+_22.jid+"-history"));
_20.dom.focus();
}.bind(this,_1a);
_1f.addListener("activate",_21);
_1f.addListener("close",function(){
this._wrappedFns[_1c].each(function(_23){
_23();
});
this.fireEvent("tabclosed",_1a,this.tabs[_1a.jid]);
delete this._wrappedFns[_1c];
delete this.tabs[_1a.jid];
}.bind(this));
var _24=function(_25){
this.clearNotification(_25.jid);
}.bind(this,_1a);
_1f.el.mon("click",_24);
getEl(getEl(_1c+"-history").dom.parentNode.id).mon("click",_24);
if(_1a.addListener){
var _26=function(_27,_28){
_1f.textEl.replaceClass("jive-status-"+_27,"jive-status-"+_28);
};
_1a.addListener("status",_26);
_1f.addListener("close",function(){
_1a.removeListener("statusChanged",_26);
});
}
_1f.textEl.addClass("jive-status-"+(_1a.status?_1a.status:"unavailable"));
this.dialog.endUpdate();
_21();
return true;
},preAddMUCChooser:function(){
var _29="jive-tab-mucchooser";
if(this.dialog.layout.regions["center"].panels.items[_29+"-spinner"]){
delete this.dialog.layout.regions["center"].panels.items[_29+"-spinner"];
}
jive.spank.chat.Template.spinnertab.append(this.bodyId,{tabId:_29,text:"Loading..."});
var _2a=this.dialog.getLayout();
this.dialog.beginUpdate();
_2a.add("center",new YAHOO.ext.ContentPanel(_29+"-spinner",{title:"Choose a Conference"}));
this.dialog.endUpdate();
var _2b=this.getTabs().items[_29+"-spinner"];
_2b.textEl.addClass("jive-muc");
var _2c=this;
_2b.addListener("close",function(){
delete _2c.dialog.layout.regions["center"].panels.items[_29+"-spinner"];
});
this.tabs["mucchooser"]={type:"muc-spinner",tab:_2b};
},addChooseMUCTab:function(_2d){
if(window.jive_enable_grid){
this.dialog.beginUpdate();
if(this.tabs["mucchooser"]){
this.getTabs().removeTab("jive-tab-mucchooser-spinner");
delete this.dialog.layout.regions["center"].panels.items["jive-tab-mucchooser-spinner"];
delete this.tabs["mucchooser"];
}
var _2e=YAHOO.util.Dom.generateId();
jive.spank.chat.Template.mucchooser.append(this.bodyId,{tabId:_2e});
this._wrappedFns[_2e]=[];
var _2f=this.dialog.getLayout();
var _30=new YAHOO.ext.BorderLayout(_2e+"-layout",jive.spank.chat.ChatWindow.chooseMUCConfObject);
_30.add("north",new YAHOO.ext.ContentPanel(_2e+"-toppane"));
jive.spank.chat.Template.muc_chooser_top.append(_2e+"-toppane",{tabId:_2e});
getEl(_2e+"-createconf").addListener("click",this.fireEvent.createDelegate(this,["createmuc",this,_2e+"-layout"]));
getEl(_2e+"-refresh").addListener("click",this.fireEvent.createDelegate(this,["refreshmuclist",this,_2e]));
_30.add("center",new YAHOO.ext.GridPanel(this._buildMUCChooserGrid(_2d,_2e)));
_2f.add("center",new YAHOO.ext.NestedLayoutPanel(_30,{title:"Choose a Conference",closable:true}));
var _31=getEl(_2e+"-roomgrid").getParentByClass("yui-ext-tabitembody").id;
var _32=this.getTabs().items[_31];
_32.textEl.addClass("jive-muc");
var _33=this.dialog.setTitle.createDelegate(this.dialog,["Choose a Conference"]);
_32.addListener("activate",_33);
_32.addListener("close",this._wrappedFns[_2e].each.createDelegate(this._wrappedFns[_2e],[function(_34){
_34();
}]));
this.tabs["muc-chooser-"+_2e]={type:"muc-chooser",tab:_32};
this.dialog.endUpdate();
getEl(_2e+"-confcontrols").fitToParent();
_33();
}
},_buildMUCChooserGrid:function(_35,_36){
if(window.jive_enable_grid){
var _37={fields:["name","muc#roominfo_subject","muc#roominfo_occupants"]};
var _38=new YAHOO.ext.grid.SpankJSONDataModel(_37);
var _39=function(_3a){
if(_3a.values){
return _3a.values[0];
}else{
return _3a;
}
};
_38.addPreprocessor(1,_39);
_38.addPreprocessor(2,_39);
_38.loadData(_35);
var _3b=[{header:"Name",width:240,sortable:true},{header:"Subject",width:160,sortable:true},{header:"Occupants",width:70,sortable:true}];
var _3c=new YAHOO.ext.grid.DefaultColumnModel(_3b);
var _3d=new YAHOO.ext.grid.Grid(_36+"-roomgrid",{dataModel:_38,colModel:_3c,selModel:new YAHOO.ext.grid.SingleSelectionModel(),monitorWindowResize:false,stripeRows:false});
_3d.render();
this._wrappedFns[_36].push(_3d.destroy.createDelegate(_3d,[true]));
_3d.addListener("rowdblclick",function(_3e,_3f,evt){
var _41=evt.findTarget("ylayout-nested-layout").id;
var _42=_3e.getDataModel().getRow(_3f)[0];
var jid=_3e.getSelectedRowId();
this.fireEvent("mucdblclicked",this,jid,_42,_41);
}.bind(this));
return _3d;
}
},preAddMUC:function(_44,_45){
var _46="jive-tab-"+_44.jid;
if(this.dialog.layout.regions["center"].panels.items["jive-tab-"+_44.jid+"-spinner"]){
delete this.dialog.layout.regions["center"].panels.items["jive-tab-"+_44.jid+"-spinner"];
}
jive.spank.chat.Template.spinnertab.append(this.bodyId,{tabId:_46,text:"Joining \""+_44.name+"\"..."});
if(_45){
this.getTabs().removeTab(_45);
}
var _47=this.dialog.getLayout();
this.dialog.beginUpdate();
_47.add("center",new YAHOO.ext.ContentPanel(_46+"-spinner",{title:_44.name}));
this.dialog.endUpdate();
var _48=this.getTabs().items["jive-tab-"+_44.jid+"-spinner"];
_48.textEl.addClass("jive-muc");
var _49=this;
_48.addListener("close",function(){
delete _49.dialog.layout.regions["center"].panels.items["jive-tab-"+_44.jid+"-spinner"];
});
this.tabs[_44.jid]={type:"muc-spinner",tab:_48};
},removeMUCSpinner:function(jid){
if(this.tabs[jid]&&this.tabs[jid].type=="muc-spinner"){
this.dialog.beginUpdate();
delete this.dialog.layout.regions["center"].panels.items["jive-tab-"+jid+"-spinner"];
this.getTabs().removeTab(this.tabs[jid].tab.id);
delete this.tabs[jid];
if(this.dialog.layout.regions["center"].tabs.items.length==0){
this.dialog.hide();
}else{
this.dialog.endUpdate();
}
}
},addMUC:function(_4b,_4c,_4d){
var _4e="jive-tab-"+_4b.jid;
this.dialog.beginUpdate();
if(this.tabs[_4b.jid]&&this.tabs[_4b.jid].type=="muc-spinner"){
var _4f=this.tabs[_4b.jid].tab.id;
this.getTabs().removeTab(this.tabs[_4b.jid].tab.id);
}
jive.spank.chat.Template.muctab.append(this.bodyId,{tabId:_4e});
var _50=this.dialog.getLayout();
var _51=new YAHOO.ext.BorderLayout(_4e+"-layout",jive.spank.chat.ChatWindow.mucConfObject);
var _52=new YAHOO.ext.BorderLayout(_4e+"-sidebarlayout",jive.spank.chat.ChatWindow.mucSidebarConfObject);
if(window.showUpperStuff=="show"){
var _53=new YAHOO.ext.ContentPanel(_4e+"-controls");
_51.add("north",_53);
}
var _54=new YAHOO.ext.ContentPanel(_4e+"-history");
_51.add("center",_54);
_51=this._layoutTextarea(_51,_4e,_4b.jid.toString());
var _55=new YAHOO.ext.ContentPanel(_4e+"-occupants");
_52.add("center",_55);
var _56=new YAHOO.ext.NestedLayoutPanel(_52);
_50.add("east",_56);
var _57=new YAHOO.ext.NestedLayoutPanel(_51,{title:_4b.name,closable:true});
_50.add("center",_57);
if(window.showUpperStuff=="show"){
_53.getEl().dom.parentNode.className+=" jive-topic";
}
_54.getEl().dom.parentNode.className+=" jive-chat";
_55.getEl().dom.parentNode.parentNode.className+=" jive-contact-list";
_57.getEl().dom.parentNode.className+=" jive-main";
_56.getEl().dom.parentNode.className+=" jive-sidebar";
var _58=_50.regions["east"].getSplitBar();
this._wrappedFns[_4e].push(_58.destroy.createDelegate(_58,[true]));
var _59=this.getTabByJID(_4b.jid);
var _5a=function(jid,_5c,_5d,_5e){
this.clearNotification(jid);
this.dialog.setTitle("<h1>"+_5c+"</h1>");
this._scrollMessageHistory(_5e);
_5d.dom.parentNode.className+=" jive-message-field";
_5d.dom.focus();
}.bind(this,_4b.jid,_4b.name,getEl(_4e+"-text"),getEl(_4e+"-history"));
_59.addListener("activate",_5a);
if(!this.dialog.getLayout().regions["south"]){
_59.addListener("close",function(){
this._wrappedFns[_4e].each(function(_5f){
_5f();
});
this.fireEvent("tabclosed",_4b,this.tabs[_4b.jid]);
var _60=getEl(_4b.jid+"-");
if(_60){
_60.remove();
}
delete this._wrappedFns[_4e];
delete this.tabs[_4b.jid];
_59.purgeListeners();
}.bind(this));
_59.textEl.addClass("jive-muc");
}else{
jive.spank.chat.Template.muc_subject.append(_4e+"-controls",{jid:_4b.jid});
this.tabId=_4e;
this.dialog.getLayout().regions["center"].panels.items[0].id=_4e;
}
var _61=this.clearNotification.createDelegate(this,[_4b.jid]);
_59.el.addListener("click",_61);
getEl(getEl(_4e+"-history").dom.parentNode.id).addListener("click",_61);
if(_4d){
this._doMucControls(_4e,_4b,_4d.contactsForAutocomp.createDelegate(_4d));
}
jive.spank.chat.Template.roster.append(_4e+"-occupants",{rosterId:_4e+"-roster",groups:""});
_59.roster=new jive.spank.roster.Roster(_4e+"-roster");
var _62={"Participants":(_4b.occupants?_4b.occupants:{})};
_59.roster.setRoster(_62);
_59.roster.render();
_59.roster.sortGroups();
_59.roster._enableBehaviors(false);
getEl(_4e+"-text").dom.focus();
this.dialog.endUpdate();
_5a();
return this.tabs[_4b.jid]={type:"muc-room",tab:_59,roster:_59.roster,participants:_59.roster.groups["Participants"],room:_4b};
},_layoutTextarea:function(_63,_64,_65){
_63.add("south",new YAHOO.ext.ContentPanel(_64+"-text"));
var _66=getEl(_64+"-text");
this._wrappedFns[_64]=[];
var _67=_63.regions["south"].getSplitBar();
this._wrappedFns[_64].push(_67.destroy.createDelegate(_67,[true]));
var _68=_66.fitToParent.createDelegate(_66);
_63.delayedListener("regionresized",_68,100);
this._wrappedFns[_64].push(_63.purgeListeners.createDelegate(_63));
this.dialog.addListener("resize",_68);
this._wrappedFns[_64].push(this.dialog.removeListener.createDelegate(this.dialog,["resize",_68]));
window.setTimeout(_68,1000);
var _69=_66.mon("keypress",function(evt){
if(evt.getKey()==13&&!evt.shiftKey&&this.getMessage()!=""){
this.fireEvent("message",_65,this.getMessage());
window.setTimeout(function(){
this.dom.value="";
}.bind(_66),10);
evt.preventDefault();
}else{
if(evt.getKey()==9){
this.fireEvent("nickcomplete",_65,this.getMessage(),_66);
evt.preventDefault();
}
if(evt.getKey()==13){
return;
}
this.fireEvent("input",_65);
}
}.bind(this));
this._wrappedFns[_64].push(YAHOO.ext.EventManager.removeListener.createDelegate(YAHOO.ext.EventManager,["keypress",_66,_69]));
_69=_66.mon("focus",function(){
var jid=this.getActiveTabJID();
this.clearNotification(jid);
jive.spank.chat.ChatWindow.focusedJID=jid;
}.bind(this));
this._wrappedFns[_64].push(YAHOO.ext.EventManager.removeListener.createDelegate(YAHOO.ext.EventManager,["focus",_66,_69]));
_69=_66.mon("blur",function(){
jive.spank.chat.ChatWindow.focusedJID="";
});
this._wrappedFns[_64].push(YAHOO.ext.EventManager.removeListener.createDelegate(YAHOO.ext.EventManager,["blur",_66,_69]));
return _63;
},_doMucControls:function(_6c,_6d,_6e){
jive.spank.chat.Template.muc_controls.append(_6c+"-controls",{jid:_6d.jid});
jive.spank.chat.Template.mucinvitemenu.append(document.body,{jid:_6d.jid});
var _6f=getEl(_6d.jid+"-container");
_6f.hide();
this._wrappedFns[_6c].push(_6f.remove.createDelegate(_6f));
var _70=new jive.spank.AutoComplete(_6d.jid+"-autocomp",_6d.jid+"-autocomp-menu",new YAHOO.widget.DS_JSFunction(_6e),{typeAhead:true,autoHighlight:true,minQueryLength:0,maxResultsDisplayed:20});
_70.formatResult=function(_71,_72){
return "<div class='roster-contact-"+_71[2]+"'>"+_71[0]+"</div>";
};
var jid=_6d.jid;
var _74=this;
_70.itemSelectEvent.subscribe(function(_75,_76){
_74.fireEvent("mucinvitation",_74,_76[2][1].toString(),jid);
getEl(jid+"-autocomp").dom.blur();
});
var _77=getEl(jid+"-control");
var _78=getEl(_6d.jid+"-autocomp-menu");
_77.mon("click",function(_79,_7a,_7b,_7c,_7d){
_79.invitee="";
var _7e=_7a.getChildrenByTagName("input")[0];
_7e.dom.value="";
_7a.alignTo(this,"bl");
_7d.setWidth(192);
_7e.setWidth(192);
_7a.show();
_7a.setStyle("z-index",_74.dialog.lastZIndex+1);
_7e.dom.focus();
_70._populateList("",_7c(),_70);
_7a.repaint();
}.createDelegate(_77,[this,getEl(_6d.jid+"-container"),_70,_6e,_78]));
var _7f=getEl(jid+"-autocomp");
_7f.mon("keypress",function(_80,jid,_82,evt){
if(evt.getKey()==13){
evt.preventDefault();
var _84=_82().detect(function(_85,_86){
return _85==_86[0];
}.bind(this,_80.dom.value));
if(!_84){
_84=_80.dom.value;
}else{
_84=_84[1].toString();
}
this.fireEvent("mucinvitation",this,_84,jid);
window.setTimeout("getEl('"+jid+"-container').hide();",200);
getEl("jive-tab-"+this.getActiveTabJID()+"-text").dom.focus();
}
}.bind(this,_7f,jid,_6e));
_7f.addListener("blur",function(){
window.setTimeout("getEl('"+jid+"-container').hide();",200);
getEl("jive-tab-"+_74.getActiveTabJID()+"-text").dom.focus();
});
getEl(jid+"-changenick").addListener("click",function(){
var _87=_74.dialog.getLayout().getRegion("south")?{x:_74.dialog.el.getX()+125,y:_74.dialog.el.getY()+140}:null;
_74.showChangeNick(_6d,_87);
});
},showMUCPassword:function(_88,_89,_8a){
_89=$H(_89).merge({title:"Enter the password for '"+_88.name+"'",width:285,height:105});
var _8b=new jive.spank.chat.Dialog(this,jive.spank.chat.Template.mucpassword,_89);
_8b.dialog.show();
var _8c=this;
var _8d=false;
var _8e=function(){
var _8f=$F(_8b.id+"-passwd");
_8a(_8f);
_8d=true;
_8b.dialog.hide();
};
_8b.dialog.addListener("hide",function(){
if(!_8d){
_8a(null);
}
});
getEl(_8b.id+"-passwd").mon("keypress",_8e.createInterceptor(function(evt){
return evt.getKey()==13;
}));
getEl(_8b.id+"-sendsecret").addListener("click",_8e);
getEl(_8b.id+"-passwd").dom.focus();
},addMessage:function(jid,_92,_93,_94){
var _95=getEl("jive-tab-"+jid+"-history");
_92=_92.toLowerCase();
if(_93.body){
var _96="";
if(_93.time){
_96="offline";
}else{
var _97=new Date();
_93.time=_97.toLocaleTimeString();
}
var _98=(_93.isLocal?"user":"contact");
var _99=(_93.mentioned?"mentioned":"");
var _9a=((this.previousMessageInfo!=null&&_92==this.previousMessageInfo.from)?"consecutive":"");
this.previousMessageInfo={jid:jid,from:_92,msg:_93,time:_93.time};
if(_93.body.indexOf("/me")==0){
_93.action="action";
_93.body=" * "+_92+_93.body.replace("/me","");
}
var _9b=jive.spank.chat.Filter.applyAll(_93.body);
var _9c=jive.spank.chat.Template.message.append(_95.id,{from:_92,message:_9b,type:_98,mentioned:_99,consecutive:_9a,action:_93.action,time:_93.time,msgclass:_96,color:uniqueColorForString(_92)});
}else{
_95.dom.appendChild(_93.el);
_93.callback(this);
}
this._scrollMessageHistory(_95);
var _9d=jive.spank.chat.ChatWindow.focusedJID;
if(_9d!=jid){
this.addNotification(jid);
}
},addStatusMessage:function(jid,_9f,_a0){
delete this.previousMessageInfo;
var _a1=getEl("jive-tab-"+jid+"-history");
var _a2=jive.spank.chat.Template.statusMessage.append(_a1.id,{message:_9f,customClass:_a0});
this._scrollMessageHistory(_a1);
},_scrollMessageHistory:function(_a3){
_a3.dom.parentNode.scrollTop=_a3.getHeight()-_a3.dom.parentNode.clientHeight;
},addNotification:function(jid){
var _a5=this.getTabByJID(jid);
if(typeof this.newMessages[jid]=="undefined"){
this.newMessages[jid]=1;
}else{
this.newMessages[jid]++;
}
if(_a5&&_a5.textEl){
_a5.textEl.addClass("jive-notify");
}
if(this.notificationInterval&&!this.notificationInterval[jid]){
var _a6=this.bodyId;
this.notificationInterval=window.setInterval(function(){
getEls("#"+_a6+" span.jive-notify").toggleClass("flashNotify");
},1000);
}else{
getEls("#"+this.bodyId+" span.jive-notify").addClass("flashNotify");
}
jive.spank.notifier.doTitleNotify();
if(_a5&&_a5.text){
if(/ \(\d+\)$/.test(_a5.text)){
_a5.setText(_a5.text.replace(/ \(\d+\)$/,""));
}
_a5.setText(_a5.text+" ("+this.newMessages[jid]+")");
}
},clearNotification:function(jid){
var _a8=this.getTabByJID(jid);
if(_a8&&_a8.textEl){
_a8.textEl.removeClass("jive-notify").removeClass("flashNotify");
_a8.setText(_a8.text.replace(/ \(\d+\)$/,""));
}
delete this.newMessages[jid];
if(this.notificationInterval&&this.notificationInterval[jid]&&this.newMessages.properties&&this.newMessages.properties.length==0){
window.clearInterval(this.notificationInterval[jid]);
this.notificationInterval[jid]=null;
}
jive.spank.notifier.doTitleNotify();
},clearAllNotifications:function(){
var _a9=getEls("#"+this.bodyId+" span.jive-notify");
_a9.removeClass("jive-notify");
window.clearInterval(this.notificationInterval);
this.notificationInterval=null;
_a9.removeClass("flashNotify");
this.newMessages={};
jive.spank.notifier.doTitleNotify();
},getMessage:function(){
var _aa=this.getTabs()?this.getTabs().active:this._tabIfSingleTab();
var _ab=_aa.id.split("-");
_ab[3]="text";
var _ac=_ab.join("-");
return getEl(_ac).dom.value;
},getActiveTabJID:function(){
var _ad=this.getTabs()?this.getTabs().active:this._tabIfSingleTab();
return _ad.id.split("-")[2];
},getTabJID:function(id){
var _af=this.getTabs()?this.getTabs().getTab(id):this._tabIfSingleTab();
return _af.id.split("-")[2];
},getTabs:function(){
var _b0=this.dialog.getLayout().regions;
return _b0["center"].getTabs();
},getTabByJID:function(jid){
var _b2=this.getTabs();
if(_b2!=null){
var _b3=_b2.items["jive-tab-"+jid+"-layout"];
if(!_b3){
_b3=_b2.items["jive-tab-"+jid+"-spinner"];
}
return (typeof _b3=="undefined")?null:_b3;
}else{
return this._tabIfSingleTab();
}
},_tabIfSingleTab:function(){
return this.dialog.getLayout().regions["center"].panels.items[0];
},removeAllTabs:function(){
var _b4=this.getTabs();
if(!_b4){
return;
}
for(var i=_b4.getCount()-1;i>=0;i--){
_b4.getTab(i).closeClick();
}
delete this.tabs;
this.tabs={};
},destroy:function(){
this.clearAllNotifications();
jive.spank.chat.ChatWindow.superclass.destroy.call(this);
delete this.tabs;
},hide:function(){
this.clearAllNotifications();
jive.spank.chat.ChatWindow.superclass.hide.call(this);
},getContactTab:function(_b6,_b7){
if(typeof _b6=="string"){
var jid=_b6;
_b6={name:jid,jid:jid};
}
var _b9=this.getTabs();
var _ba;
if(_b9){
_ba=_b9.getTab("jive-tab-"+_b6.jid+"-layout");
}
if(typeof _ba=="undefined"){
this.addTab(_b6);
}
if(_b7){
this.focusContactTab(_b6);
}
},focusContactTab:function(_bb){
var _bc=this.getTabs();
_bc.activate("jive-tab-"+_bb.jid+"-layout");
var _bd=getEl("jive-tab-"+_bb.jid+"-text");
_bd.dom.focus();
},prepUserPane:function(){
if(window.showUpperStuff=="show"){
var _be=this.dialog.getLayout().getRegion("east").getPanel(0).getLayout();
jive.spank.chat.Template.userpane.append(this.bodyId+"-toppane",{id:this.bodyId});
this.dialog.beginUpdate();
var _bf=new YAHOO.ext.ContentPanel(this.bodyId+"-toppane");
_be.add("north",_bf);
_bf.getEl().dom.parentNode.className+=" jive-user-controls";
this.dialog.endUpdate();
}
},finalizeUserPane:function(_c0,_c1){
if(window.showUpperStuff=="show"){
jive.spank.chat.Template.userpane_loggedin.append(this.bodyId+"-message",{id:this.bodyId,uname:_c0,presence:"available"});
var _c2=getEl(this.bodyId+"-uname");
var _c3=getEl(this.bodyId+"-uname-edit");
var _c4=function(evt){
if(evt==undefined||evt.keyCode==13){
var _c6=this.tabId.split("-")[2];
var _c7=getEl(this.bodyId+"-uname");
_c7.replaceClass("jive-muc-username-active","jive-muc-username");
this.fireEvent("changenameinmuc",this,this.tabs[_c6].room.jid,_c7.dom.value);
getEl("jive-tab-"+this.getActiveTabJID()+"-text").dom.focus();
getEl(this.bodyId+"-uname-edit").dom.innerHTML="change";
if(evt!=undefined){
evt.preventDefault();
}
}
}.bind(this);
var _c8=function(){
if(this.dom.className.indexOf("jive-muc-username-active")>-1){
_c4();
}else{
this.replaceClass("jive-muc-username","jive-muc-username-active");
this.dom.focus();
}
}.bind(_c2);
_c3.on("click",function(){
this.dom.innerHTML=(this.dom.innerHTML=="change"?"ok":"change");
_c8();
}.bind(_c3));
_c2.on("keydown",_c4);
var _c9=function(_ca,_cb,_cc){
this.dom.value=_cc;
}.bind(_c2);
this.addListener("changenameinmuc",_c9);
var tt=new YAHOO.widget.Tooltip("nick-edit-tooltip",{context:_c3.dom,showDelay:500,zIndex:15000});
tt.setHeader("");
tt.setBody("<p>Click here to change your nickname</p>");
tt.setFooter("");
if(_c1){
var _ce=getEl(this.bodyId+"-presencecontrol");
var _cf=function(){
var _d0=_ce.hasClass("available")?"away":"available";
var _d1=_d0=="available"?"away":"available";
_ce.replaceClass(_d1,_d0);
_ce.dom.innerHTML=_d0;
var _d2=this.tabId.split("-")[2];
var _d3=new XMPP.Presence();
_d3.setMode(_d0);
_d3.setTo(new XMPP.JID(_d2+"/"+getEl(this.bodyId+"-uname").dom.value));
_c1.getRoom(_d2).presenceManager.sendPresence(_d3);
}.bind(this);
_ce.on("click",_cf);
var tt1=new YAHOO.widget.Tooltip("presence-control-tooltip",{context:_ce.dom,showDelay:500,zIndex:15000});
tt1.setHeader("");
tt1.setBody("<p>Click here to change your status</p>");
tt1.setFooter("");
}
}
},setSubject:function(_d5,_d6){
var _d7=getEl((this.tabId?this.tabId:"jive-tab-"+_d6)+"-subject");
if(_d7&&_d7.dom){
_d7.dom.innerHTML=_d5;
}
}});
jive.spank.chat.ChatWindow.getWindow=function(_d8){
return jive.spank.chat.ChatWindow.currentWindow[_d8];
};
jive.spank.chat.ChatWindow.createWindow=function(){
var _d9=spank.loadComponent("chat");
jive.spank.chat.ChatWindow.currentWindow[_d9.id]=_d9;
_d9.dialog.addListener("hide",function(){
delete jive.spank.chat.ChatWindow.currentWindow[_d9.id];
});
return _d9;
};
jive.spank.chat.ChatWindow.destroyWindow=function(_da){
if(jive.spank.chat.ChatWindow.currentWindow[_da]){
jive.spank.chat.ChatWindow.currentWindow[_da].hide();
delete jive.spank.chat.ChatWindow.currentWindow[_da];
}
};
jive.spank.chat.ChatWindow.tabConfObject={north:{initialSize:72},south:{split:true,initialSize:50,minSize:50,maxSize:200,autoScroll:false,collapsible:true},center:{autoScroll:true}};
jive.spank.chat.ChatWindow.chooseMUCConfObject={north:{initialSize:50},center:{autoScroll:true}};
jive.spank.chat.ChatWindow.mucSidebarConfObject={north:{initialSize:51,margins:{top:0,left:0,right:0,bottom:12}},center:{initialSize:49,minSize:50,maxSize:200,autoScroll:true,collapsible:true}};
jive.spank.chat.ChatWindow.mucConfObject={north:{initialSize:51,margins:{top:0,left:0,right:0,bottom:12}},center:{autoScroll:true},south:{split:true,initialSize:50,minSize:50,maxSize:200,autoScroll:false,collapsible:true}};
jive.spank.chat.ChatWindow.currentWindow={};
jive.spank.chat.ChatWindow.focusedJID="";
jive.spank.roster={};
jive.spank.roster.RosterWindow=function(id,_dc){
var _dd=_dc["width"]?_dc["width"]:310;
var _de=_dc["height"]?_dc["height"]:YAHOO.util.Dom.getViewportHeight()-40;
var x=_dc["x"]?_dc["x"]:YAHOO.util.Dom.getViewportWidth()-330;
var y=_dc["y"]?_dc["y"]:20;
var _e1=_dc["resizable"]!="false";
var _e2=_dc["draggable"]!="false";
var _e3=_dc["closable"]!="false";
this.roster=null;
this.groups=null;
this.controls={};
this.controlCount=0;
var _e4={modal:false,width:_dd,height:_de,resizable:_e1,draggable:_e2,proxyDrag:true,shadow:false,minWidth:200,minHeight:150,x:x,y:y,closable:_e3,shim:false,north:{initialSize:50,autoScroll:false},center:{closeOnTab:true,alwaysShowTabs:false,autoTabs:true}};
this.events={"changestatus":true,"setstatusmsgrequest":true,"addcontact":true,"acceptsubscription":true,"denysubscription":true,"renamecontact":true,"renamegroup":true,"removecontact":true,"removegroup":true,"close":true};
jive.spank.roster.RosterWindow.superclass.constructor.call(this,id,"Spark Web",_e4);
var _e5=this.dialog.getLayout();
this.dialog.beginUpdate();
_e5.add("north",new YAHOO.ext.ContentPanel(this.bodyId+"-toppane"));
this.dialog.endUpdate();
this.dialog.close.removeAllListeners();
this.dialog.close.addListener("click",function(){
if(confirm("Are you sure you want to close the connection?\n('OK' to logout, 'Cancel' to stay connected.)")){
this.dialog.hide();
this.fireEvent("close",this);
}
}.bind(this));
};
YAHOO.extend(jive.spank.roster.RosterWindow,jive.spank.Window,{needsUpdate:false,addTab:function(_e6){
var _e7=YAHOO.util.Dom.generateId();
jive.spank.chat.Template.rostertab.append(this.bodyId,{tabId:_e7});
var _e8=this.dialog.getLayout();
this.dialog.beginUpdate();
var _e9=new YAHOO.ext.BorderLayout(_e7+"-layout",{north:{split:false,initialSize:28,autoScroll:false},center:{autoScroll:true}});
_e9.add("center",new YAHOO.ext.ContentPanel(_e7+"-resources"));
jive.spank.chat.Template.roster.append(_e7+"-resources",{rosterId:"jive-roster",groups:""});
_e9.add("north",new YAHOO.ext.ContentPanel(_e7+"-user"));
jive.spank.chat.Template.control_panel.append(_e7+"-user",{tabId:_e7});
this.controlPanel=_e9.regions["north"];
this.controlPanel.hide();
_e8.add("center",new YAHOO.ext.NestedLayoutPanel(_e9,{title:_e6}));
this.dialog.endUpdate();
this.tabs[_e6]=_e7;
},_prepUserStatusPanel:function(_ea,_eb){
var elm=getEl(this.bodyId+"-toppane");
jive.spank.chat.Template.status_panel.append(elm.id,{bodyId:this.bodyId,username:_ea,status:_eb,statusName:_eb.toLowerCase()});
var _ed=new YAHOO.widget.Menu("jive-statusmenu");
_ed.addItems([[{text:"Free to Chat"},{text:"Available"},{text:"On The Road"},{text:"Away"},{text:"On Phone"},{text:"Do Not Disturb"}],[{text:"Set status message...",disabled:true}]]);
_ed.render(document.body);
var _ee=this;
var _ef=function(_f0,_f1,_f2){
this.fireEvent("changestatus",this,_f2);
};
var _f3=function(){
_ee.fireEvent("setstatusmsgrequest",_ee);
};
var _f4;
var _f5=["chat","available","onroad","away","onphone","dnd"];
for(var i=0;i<6;i++){
_f4=_ed.getItem(i);
_f4.element.className+=" roster-contact-"+_f5[i];
_f4.clickEvent.subscribe(_ef,_f5[i],_ee);
}
getEl(this.bodyId+"-statusmenu-ctrl").addListener("click",function(){
getEl(_ed.element).alignTo(this,"bl");
_ed.element.style.zIndex=_ee.dialog.lastZIndex+1;
_ed.show();
});
var _f7=function(){
_ed.hide();
};
this.dialog.header.addListener("click",_f7);
for(var _f8 in jive.spank.chat.ChatWindow.currentWindow){
jive.spank.chat.ChatWindow.currentWindow[_f8].dialog.header.addListener("click",_f7);
}
},setUserInfo:function(_f9,_fa){
var _fb;
if(arguments.length>1){
_fb=_f9;
}else{
_fb=_f9.name;
_fa=(_f9.status?_f9.status:_f9.mode);
}
this.dialog.setTitle("Spark Web - "+_fb);
this._prepUserStatusPanel(_fb,_fa);
},addGroup:function(_fc,_fd){
this.roster.addGroup(_fc,_fd);
},addControl:function(_fe,_ff){
this.controls[_fe]=jive.spank.chat.Control.add(this.tabs["Contacts"]+"-controls",_fe,_ff);
this.controlCount++;
if(!this.controlPanel.isVisible()){
this.controlPanel.show();
}
return this.controls[_fe];
},removeControl:function(_100){
if(this.controls[_100]){
this.controls[_100].remove();
delete this.controls[_100];
}
this.controlCount--;
},setRoster:function(_101){
if(_101==null){
_101=this.fakeRosterStruct;
}
this.roster=new jive.spank.roster.Roster("jive-roster",true);
this.groups=this.roster.groups;
this.roster.setRoster(_101);
this.render();
this.roster.addListener("offlinemoved",function(){
if(!this.isUpdating){
this.render(true);
}else{
this.needsUpdate=true;
}
},this,1);
},getSelectedUser:function(){
return this.roster.getSelectedUser();
},getContactFromID:function(_102){
var _103=_102.split("-");
var cJid=_103.slice(2,_103.length-1).join("");
return jive.spank.roster.Contact.find(this,cJid,_103[_103.length-1]);
},render:function(_105){
var _106=this.tabs["Contacts"];
this.roster.render();
this.needsUpdate=false;
this.dialog.addListener("show",this.finishDisplay,this,true);
if(_105){
this.finishDisplay();
}
},finishDisplay:function(){
this.roster.sortGroups();
this.roster.renderOffline();
this.roster._enableBehaviors();
},addContact:function(_107,_108,_109){
this.roster.addContact(_107,_108,_109);
this.render(true);
},removeContact:function(jid){
this.roster.removeContact(jid);
},changeUserStatus:function(_10b,_10c){
var menu=getEl(this.bodyId+"-statusmenu-ctrl");
var _10e={chat:"Free to Chat",available:"Available",onroad:"On Road",away:"Away",onphone:"On Phone",dnd:"Do Not Disturb"};
menu.dom.childNodes[0].className=menu.dom.childNodes[0].className.replace(/roster-contact-([^ ]*)/,"roster-contact-"+_10b);
menu.getChildrenByTagName("span")[0].dom.innerHTML=(_10c!=null?_10c:_10e[_10b]);
},changeContactStatus:function(jid,_110,_111){
this.roster.changeContactStatus(jid,_110,_111);
},getContactStatus:function(jid){
return this.roster.getContactStatus(jid);
},showAddGroup:function(){
var self=this;
var addg=new jive.spank.chat.Dialog(self,jive.spank.chat.Template.add_group,{title:"Add Group",width:280,height:140,yOffset:125});
addg.dialog.show();
getEl(addg.id+"-creategroup").addListener("click",function(){
self.fireEvent("addgroup",self,$F(addg.id+"-addgroupname"));
addg.dialog.hide();
});
},showAddContact:function(){
var self=this;
var addc=new jive.spank.chat.Dialog(self,jive.spank.chat.Template.add_contact,{title:"Add Contact",width:280,height:155});
addc.dialog.show();
this._autocompGroups(addc,"-addcontact-group");
$(addc.id+"-addusername").focus();
getEl(addc.id+"-createcontact").addListener("click",function(){
self.fireEvent("addcontact",self,$F(addc.id+"-addusername"),$F(addc.id+"-addnickname"),$F(addc.id+"-addcontact-group"));
addc.dialog.hide();
});
},showSubscriptionRequest:function(_117,_118){
var self=this;
var subr=new jive.spank.chat.Dialog(self,jive.spank.chat.Template.sub_request,{title:"Allow "+(_118!=""?_118:_117)+" to add you?",width:440,height:220,templateKeys:{jid:_117,nick:_118}});
subr.dialog.show();
this._autocompGroups(subr,"-subrequest-group");
getEl(subr.id+"-add").addListener("click",function(){
getEls("#"+subr.id+" label").toggleClass("disabled");
getEl(subr.id+"-jid").toggleClass("disabled");
getEl(subr.id+"-nick").dom.disabled=getEl(subr.id+"-subrequest-group").dom.disabled=!getEl(subr.id+"-add").dom.checked;
});
getEl(subr.id+"-acceptsubrequest").addListener("click",function(){
self.fireEvent("acceptsubscription",self,$F(subr.id+"-add"),_117,$F(subr.id+"-nick"),$F(subr.id+"-subrequest-group"));
subr.dialog.hide();
});
getEl(subr.id+"-denysubrequest").addListener("click",function(){
self.fireEvent("denysubscription",self,$F(subr.id+"-add"),_117,$F(subr.id+"-nick"),$F(subr.id+"-subrequest-group"));
subr.dialog.hide();
});
},showRename:function(_11b){
if(_11b==null){
_11b=this.contactMenu.clickedContact;
}
var _11c=new jive.spank.chat.Dialog(self,jive.spank.chat.Template.rename,{title:"Renaming '"+_11b.name+"'",width:250,height:115,templateKeys:{nick:_11b.name}});
_11c.dialog.show();
var self=this;
var _11e=function(){
var _11f=(typeof _11b.jid!="undefined")?"renamecontact":"renamegroup";
self.fireEvent(_11f,self,_11b,$F(_11c.id+"-name"));
getEl(_11c.id+"-rename").removeAllListeners();
_11c.dialog.hide();
};
getEl(_11c.id+"-name").mon("keypress",_11e.createInterceptor(function(evt){
return evt.getKey()==13;
}));
getEl(_11c.id+"-rename").addListener("click",_11e);
},showRemove:function(_121){
this.fireEvent("removecontact",this,_121.jid.toString());
},showGroupRename:function(_122){
var _123=_122();
this.showRename(_123);
},fetchClickedGroup:function(){
return this.groupMenu.clickedGroup;
},showGroupRemove:function(_124){
var _125=_124();
var _126=new jive.spank.chat.Dialog(this,jive.spank.chat.Template.remove_group,{title:"Removing '"+_125.name+"'",width:250,height:100,templateKeys:{name:_125.name}});
_126.dialog.show();
var self=this;
var _128=function(){
self.fireEvent("removegroup",self,_125);
getEl(_126.id+"-remove").removeAllListeners();
_126.dialog.hide();
};
getEl(_126.id+"-remove").addListener("click",_128);
},_autocompGroups:function(dlog,_12a){
var _12b=dlog.id+_12a;
var _12c=_12b+"-menu";
var self=this;
if(getEl(_12c)==null){
var _12e=self.addMenuDiv(_12c);
_12e.className="groups-ac";
}
var _12f=function(_130){
var _131=[];
for(var g in self.roster.groups){
_131.push(g);
}
return self._prepareAutocompArray(_131,_130);
};
var _133=new jive.spank.FlatAutoComplete(_12b,_12c,new YAHOO.widget.DS_JSFunction(_12f),{typeAhead:true,minQueryLength:0});
_133.formatResult=function(_134,_135){
return _134;
};
_133.dataReturnEvent.subscribe(function(type,args){
if(args[2].length==0){
_133.setBody("<div class='empty'>(No matches, will create new)</div>");
}
var _138=getEl(_12c);
_138.alignTo(getEl(_12b),"bl");
_138.dom.style.zIndex=dlog.dialog.lastZIndex+1;
_138.show();
});
getEl(_12b).addListener("blur",function(){
getEl(_12c).hide();
});
getEls("#"+_12c+" li").mon("mousedown",function(evt){
getEl(_12b).dom.value=evt.getTarget().innerHTML;
});
dlog.dialog.addListener("beforehide",function(){
_133.formatResult=Prototype.emptyFunction;
_12f=Prototype.emptyFunction;
getEl(_12c).removeAllListeners();
getEl(_12b).removeAllListeners();
_133.dataReturnEvent.unsubscribeAll();
getEls("#"+_12c+" li").removeAllListeners();
getEl(_12c).remove();
});
return _133;
},contactsForAutocomp:function(_13a){
var _13b=this.roster;
var _13c=[];
for(var g in _13b.groups){
_13b.groups[g].contacts.each(function(_13e){
_13c.push([_13e.name,_13e.jid,_13e.status]);
});
}
return this._prepareAutocompArray(_13c,_13a);
},_prepareAutocompArray:function(_13f,_140){
var _141=typeof _13f[0]!="string";
if(_141&&_13f.length==0){
return _13f;
}
_13f=_13f.sortBy(function(_142){
if(_141){
return _142[0].toLowerCase();
}else{
return _142.toLowerCase();
}
});
if(_13f.length<2||!_140||_140==""){
return _13f;
}else{
var _143=_13f.partition(function(_144){
return (_141?_144[0].indexOf(_140)==0:_144.indexOf(_140)==0);
});
return _143[0].concat(_143[1]);
}
},addMenuDiv:function(_145){
var _146=document.createElement("div");
_146.id=_145;
_146.style.visibility="hidden";
document.body.appendChild(_146);
return _146;
},endUpdate:function(){
if(this.needsUpdate){
this.render(true);
}
jive.spank.roster.RosterWindow.superclass.endUpdate.call(this);
},destroy:function(){
jive.spank.roster.RosterWindow.superclass.destroy.call(this);
}});
jive.spank.menu={};
jive.spank.menu.ContactContext=function(_147,_148){
var id="contact-conmenu";
var _14a=document.createElement("div");
_14a.id=id;
_14a.style.visibility="hidden";
document.body.appendChild(_14a);
this.menu=new YAHOO.widget.Menu(id,{lazyLoad:true});
var _14b=[];
_148.each(function(_14c){
_14b.push({text:_14c.name});
});
this.menu.addItems(_14b);
this.menu.render(document.body);
for(var i=0;i<_14b.length;i++){
this.menu.getItem(i).clickEvent.subscribe(_148[i].action);
}
this.dialog=_147;
};
jive.spank.menu.ContactContext.prototype={show:function(x,y){
this.menu.moveTo(x,y);
this.menu.element.style.zIndex=this.dialog.dialog.lastZIndex+1;
this.menu.show();
},destroy:function(){
this.menu.destroy();
}};
jive.spank.chat.Dialog=function(_150,_151,_152){
this.parentWindow=_150;
var elm=document.createElement("div");
this.id=elm.id=YAHOO.util.Dom.generateId();
document.body.appendChild(elm);
var _154=!_152.constrained;
jive.spank.chat.Dialog.superclass.constructor.call(this,elm.id,{title:_152.title,modal:_152.modal,constraintoviewport:_154,width:_152.width,height:_152.height,shadow:true,proxyDrag:true,resizable:false,draggable:true,x:_152.x?_152.x:(YAHOO.util.Dom.getViewportWidth()/2)-(_152.width>0?(_152.width/2):0),y:_152.y?_152.y:(YAHOO.util.Dom.getViewportHeight()/2)-(_152.height>0?_152.height/2:0),closable:true});
this.dialog=this;
if(_152.templateKeys){
var _155=_152.templateKeys;
_155.id=this.id;
_151.append(this.body.dom,_155);
}else{
_151.append(this.body.dom,{id:this.id});
}
getEls("#"+this.id+" .jive-closedialog").addListener("click",this.hide.bind(this));
this.addListener("hide",this.destroy.bind(this));
};
YAHOO.extend(jive.spank.chat.Dialog,YAHOO.ext.BasicDialog,{destroy:function(){
jive.spank.chat.Dialog.superclass.destroy(this,true);
this.proxy.remove();
this.shadow.remove();
if(this.mask){
this.mask.remove();
}
this.purgeListeners();
}});
jive.spank.dialog={};
jive.spank.dialog.StartChat=function(_156){
var _157=new jive.spank.chat.Dialog(this,jive.spank.chat.Template.start_chat,{title:"Start a chat",width:250,height:105});
_157.dialog.show();
var _158=function(){
var _159=$F(_157.id+"-jid");
if(_159.replace(/^\s+|\s+$/g,"")!=""){
_156(this,{jid:_159});
getEl(_157.id+"-startbtn").removeAllListeners();
_157.dialog.hide();
}else{
$(_157.id).focus();
}
};
$(_157.id+"-jid").focus();
getEl(_157.id+"-startbtn").addListener("click",_158);
};
jive.spank.dialog.CreateConference=function(_15a,_15b){
if(!_15b){
_15b={};
}
_15b=$H(_15b).merge(this._configuration);
jive.spank.dialog.CreateConference.superclass.constructor.call(this,_15a,jive.spank.chat.Template.muccreation,_15b);
this.events=$H(this.events).merge({"muccreated":true});
this.addListener("hide",this.onHide.bind(this));
getEl(this.id+"-private").addListener("click",this._privateCheckboxListener.bind(this));
getEl(this.id+"-createroom").addListener("click",this._createRoomListener.bind(this));
};
YAHOO.extend(jive.spank.dialog.CreateConference,jive.spank.chat.Dialog,{_configuration:{title:"Create a Conference",width:285,height:285},_createRoomListener:function(){
var _15c=getEl(this.id+"-private");
var _15d=$F(this.id+"-roompw");
var _15e=$F(this.id+"-roomconfirm");
if(_15c.dom.checked&&_15d!=_15e){
alert("Sorry, your password and confirmation don't match.");
$(this.id+"-roompw").select();
return false;
}
this.fireEvent("muccreated",this,this.getValues());
},_privateCheckboxListener:function(){
getEls("#"+this.id+" .fieldset label").toggleClass("disabled");
getEl(this.id+"-roompw").dom.disabled=getEl(this.id+"-roomconfirm").dom.disabled=!getEl(this.id+"-private").dom.checked;
},focus:function(){
getEl(this.id+"-roomname").dom.focus();
},getValues:function(){
return {name:$F(this.id+"-roomname"),topic:$F(this.id+"-roomtopic"),isPermanent:$(this.id+"-permanent").checked,isPrivate:$(this.id+"-private").checked,password:$F(this.id+"-roompw"),confirmPassowrd:$F(this.id+"-roomconfirm")};
},onHide:function(){
getEl(this.id+"-private").removeAllListeners();
getEl(this.id+"-createroom").removeAllListeners();
}});
if(window.jive_enable_grid){
jive.spank.dialog.UserSearch=function(_15f,_160,_161){
if(!_161){
_161={};
}
_161.templateKeys={instructions:"Insert your instructions here."};
_161=$H(_161).merge(this._configuration);
var _162=this._createTemplate(_160);
jive.spank.dialog.UserSearch.superclass.constructor.call(this,_15f,_162,_161);
this.events=$H(this.events).merge({"search":true});
this.addListener("hide",this.onHide.bind(this));
this.addListener("show",this.onShow.bind(this));
this._buildSearchGrid([["test","test","test"],["test","test","test"]],this.id+"-search-grid");
this.onShow();
this.searchGrid.render();
};
}
if(window.jive_enable_grid){
YAHOO.extend(jive.spank.dialog.UserSearch,jive.spank.chat.Dialog,{_configuration:{title:"Person Search"},_template:["<div id=\"{id}-person-search\" class=\"dbody personsearch\">","<div class=\"jive-dbody-description\">","<h1>Person Search</h1>","<p>{instructions}</p>","</div>","<div class=\"\">","<fieldset>","<legend>Search Service</legend>","<p><label for=\"service\">Search Service</label>","<select name=\"selectservice\" tabindex=\"{firstTabIndex}\">","</select>","<a href=\"#\">Add Service</a>","</p>","</fieldset>","</div>","<div class=\"\">","<fieldset>","<legend>Person Search Form</legend>","{searchform}","<p class=\"buttons\"><input type=\"submit\" value=\"Search\" tabindex=\"{lastTabIndex}\"/></p>","</fieldset>","</div>","<div id=\"{id}-search-grid\" class=\"jive-grid\">","</div>","</div>"],_createTemplate:function(_163){
_163=["<p><input name=\"Username\" type=\"checkbox\" value=\"Username\" checked","/>Username</p>","<p><label for=\"testdrop\">Test Dropdown</label>","<select id=\"testdrop\" name=\"testdrop\">","<option>test 1</option>","<option>test 2</option>","<option>test 3</option>","</select>","</p>"];
var _164=this._template;
var _165=_164.indexOf("{searchform}");
_164.splice(_165,1,_163.join(""));
return new YAHOO.ext.DomHelper.Template(_164.join(""));
},onHide:function(){
this.searchGrid.destroy();
},onShow:function(){
var _166=getEl(this.id+"-person-search");
var _167=Math.max(this.body.getWidth(),_166.getWidth());
this.resizeTo(500,500);
},_buildSearchGrid:function(_168,_169){
var _16a={fields:["name","muc#roominfo_subject","muc#roominfo_occupants"]};
var _16b=new YAHOO.ext.grid.DefaultDataModel(_168);
var _16c=[{header:"Username",width:240,sortable:true},{header:"Name",width:160,sortable:true},{header:"E-Mail",width:70,sortable:true}];
var _16d=new YAHOO.ext.grid.DefaultColumnModel(_16c);
this.searchGrid=new YAHOO.ext.grid.Grid(_169,{dataModel:_16b,colModel:_16d,selModel:new YAHOO.ext.grid.SingleSelectionModel(),monitorWindowResize:false,stripeRows:false});
return this.searchGrid;
}});
}
jive.spank.dialog.CreateAccount=function(_16e){
this.dialog=new jive.spank.chat.Dialog(null,jive.spank.chat.Template.create_account,{title:"Creating an account",width:250,height:180,modal:true});
var _16f=this.dialog;
this.nameField=getEl(_16f.id+"-name");
this.passwordField=getEl(_16f.id+"-passwd");
this.createButton=getEl(_16f.id+"-submit");
this.verifyCallback=_16e;
getEl(_16f.id+"-confirm").mon("keypress",this._doSubmit.createInterceptor(function(evt){
return evt.getKey()==13;
}));
getEl(_16f.id+"-submit").addListener("click",this._doSubmit.bind(this));
this.nameField.mon("keypress",function(){
this.dom.style.backgroundColor="#fff";
}.bind(this.nameField));
this.passwordField.mon("keypress",function(){
this.dom.style.backgroundColor="#fff";
}.bind(this.passwordField));
this.nameField.dom.focus();
_16f.dialog.show();
};
jive.spank.dialog.CreateAccount.prototype={_doSubmit:function(){
var _171=this.dialog;
var _172=$(_171.id+"-error");
$(_171.id+"-name").style.backgroundColor="#fff";
$(_171.id+"-passwd").style.backgroundColor="#fff";
if($F(_171.id+"-name")==""){
$(_171.id+"-name").style.backgroundColor="#f00";
$(_171.id+"-name").select();
return false;
}
if($F(_171.id+"-passwd")==""){
$(_171.id+"-passwd").style.backgroundColor="#f00";
$(_171.id+"-passwd").select();
return false;
}
if($F(_171.id+"-passwd")!=$F(_171.id+"-confirm")){
$(_171.id+"-passwd").style.backgroundColor="#f00";
$(_171.id+"-passwd").select();
return false;
}
this.createButton.dom.disabled=true;
this.createButton.hide();
jive.spank.Spinner.show({x:this.createButton.getX()-10,y:this.createButton.getY()});
this.verifyCallback({username:$F(_171.id+"-name"),password:$F(_171.id+"-passwd")});
},verify:function(_173){
var _174=this.dialog;
if(verify){
if(verify.name){
$(_174.id+"-name").style.backgroundColor="#f00";
$(_174.id+"-name").select();
return;
}
if(verify.password){
$(_174.id+"-passwd").style.backgroundColor="#f00";
$(_174.id+"-passwd").select();
return;
}
}
getEl(_174.id+"-confirm").removeAllListeners();
getEl(_174.id+"-submit").removeAllListeners();
this.nameField.removeAllListeners();
this.passwordField.removeAllListeners();
this.dialog.hide();
}};
jive.spank.roster.Roster=function(id,_176){
this.el=getEl(id);
this.groups={};
this.closedgroups=[];
this.events={"contactdblclicked":true,"contactrightclicked":true,"offlinemoved":true};
if(_176){
this.offlines="";
this._wrappedClick=null;
}
};
YAHOO.extend(jive.spank.roster.Roster,YAHOO.ext.util.Observable,{addGroup:function(_177,_178){
if(this.groups[_177]){
return this.groups[_177];
}
this.groups[_177]=new jive.spank.roster.RosterGroup(this,_177,_178);
this.el.insertHtml("beforeEnd",this.groups[_177].render(false));
this.groups[_177]._enableBehaviors();
return this.groups[_177];
},addContact:function(_179,_17a,_17b){
var _17c=this.addGroup(_17a,_17b);
_17c.addContact(_179);
},removeContact:function(jid){
var _17e=this.findContact(jid);
var grp=_17e.group;
_17e.remove();
if(grp.contacts.length==0){
grp.remove();
}
},setRoster:function(_180){
var _181;
for(var _182 in _180){
_181=_180[_182];
this.groups[_182]=new jive.spank.roster.RosterGroup(this,_182,_181);
}
},render:function(){
var _183="";
var _184=typeof this.offlines!="undefined";
this._logClosedGroups();
for(var g in this.groups){
_183+=this.groups[g].render(_184);
}
this.el.dom.innerHTML=_183;
return this;
},getSelectedUser:function(){
var _186=$$("ul#"+this.id+" ul.group-list li.selected")[0];
var _187=_186.id.split("-");
var _188=_187[3];
var _189=_187[2];
return this.findContact(_189,_188);
},findContact:function(jid,_18b){
if(_18b){
_18b=_18b.replace(/[^0-9A-Za-z]/,"_");
}
for(var _18c in this.groups){
if(_18b&&_18c.replace(/[^0-9A-Za-z]/,"_")!=_18b){
continue;
}
var _18d=this.groups[_18c].contacts.find(function(_18e){
return _18e.jid==jid;
});
if(_18d){
return _18d;
}
}
return null;
},changeContactStatus:function(jid,_190,_191){
var _192=this.findContact(jid);
if(_192){
_192.changeStatus(_190,_191);
}
},getContactStatus:function(jid){
var _194=this.findContact(jid);
if(_194){
return _194.status;
}
},renderOffline:function(){
var _195=this.groups;
var _196="";
for(var _197 in _195){
this.groups[_197].contacts.each(function(_198){
if(_198.status=="unavailable"){
_196+=_198.render();
}
});
}
if((_196==""||this.offlines!="")&&getEl("group-"+this.offlines)){
getEl("group-"+this.offlines).remove();
}else{
this.offlines="Offline_Group-"+this.el.id;
}
if(_196!=""){
this.el.insertHtml("beforeEnd",jive.spank.chat.Template.roster_group.applyTemplate({id:this.offlines,renderClosed:"open",online:"",groupName:"Offline Group",users:_196}));
var _199=getEl("group-label-"+this.offlines);
_199.unselectable();
this._wrappedClick=_199.getChildrenByTagName("em")[0].mon("click",jive.spank.roster.RosterGroup.toggleGroupVisListener);
jive.spank.roster.RosterGroup.sortContactHTML(this.offlines);
}
},sortGroups:function(){
var _19a=this.el;
if(_19a&&_19a.dom!=null){
var _19b=_19a.getChildrenByClassName("group");
var _19c=_19b.sortBy(function(line){
return line.id.split("-")[1].toLowerCase();
});
_19c.each(function(line){
line.appendTo(_19a.dom);
});
}
for(var g in this.groups){
this.groups[g].sort();
}
},_logClosedGroups:function(){
this.closedgroups=[];
var _1a0=this.el.getChildrenByClassName("closed");
for(var i=0;i<_1a0.length;i++){
if(_1a0[i].firstChild){
this.closedgroups.push(_1a0[i].firstChild.innerHTML);
}
}
},_enableBehaviors:function(_1a2){
for(var g in this.groups){
this.groups[g]._enableBehaviors(_1a2);
}
}});
jive.spank.roster.RosterGroup=function(_1a4,name,_1a6){
this.name=name;
this.cleanName=name.replace(/[^A-Za-z0-9]/,"_");
this._roster=_1a4;
this.contacts=[];
if(_1a6){
this._rebuildContacts(_1a6);
}
this.id=this.cleanName+"-"+this._roster.el.id;
this._wrappedClick=null;
};
jive.spank.roster.RosterGroup.prototype={_rebuildContacts:function(json){
for(var _1a8 in json){
this.contacts.push(new jive.spank.roster.Contact(json[_1a8],this));
}
},addContact:function(_1a9){
var _1aa=new jive.spank.roster.Contact(_1a9,this);
this.contacts.push(_1aa);
var _1ab="group-list-"+this.id;
if(typeof this._roster.offlines!="undefined"&&_1aa.status=="unavailable"){
_1ab="group-list-"+this._roster.offlines;
}
var _1ac=uniqueColorForString(_1aa.name);
jive.spank.chat.Template.contact.append(_1ab,{id:_1aa.id,status:_1aa.status,username:_1aa.name});
this.contacts[this.contacts.length-1]._enableBehaviors();
this.sort();
},removeContact:function(jid){
var _1ae=this.getContactByJID(jid);
if(!_1ae){
return;
}
if(_1ae){
_1ae.remove();
}
},contactIndexByJid:function(jid){
for(var u=this.contacts.length-1;u>=0;u--){
if(this.contacts[u].jid==jid){
return u;
}
}
return -1;
},getContactByJID:function(jid){
var _1b2=this.contactIndexByJid(jid);
if(_1b2>=0){
return this.contacts[_1b2];
}else{
return null;
}
},render:function(_1b3){
var _1b4="open";
var _1b5=this._roster.closedgroups.indexOf(this.name)!=-1;
if(_1b5){
_1b4="closed";
}
var body=this._getMembersHtml(_1b3);
if(body==""&&_1b3){
return "";
}
return jive.spank.chat.Template.roster_group.applyTemplate({id:this.id,renderClosed:_1b4,online:"group-isonline",groupName:this.name,users:body});
},sort:function(){
jive.spank.roster.RosterGroup.sortContactHTML(this.id);
},remove:function(){
var elm=getEl("group-"+this.id);
YAHOO.ext.EventManager.removeListener(elm,"click",this._wrappedClick);
this._wrappedClick=null;
elm.remove();
delete this._roster.groups[this.name];
},_getMembersHtml:function(_1b8){
var _1b9="";
for(var u=0;u<this.contacts.length;u++){
if(!_1b8||this.contacts[u].status!="unavailable"){
_1b9+=this.contacts[u].render();
}
}
return _1b9;
},_enableBehaviors:function(_1bb){
if(_1bb==null){
_1bb=true;
}
var _1bc=getEl("group-label-"+this.id);
if(_1bc&&_1bc.dom){
_1bc.unselectable();
var _1bd=_1bc.getChildrenByTagName("em")[0];
_1bd.unselectable();
if(_1bb){
this._wrappedClick=_1bd.mon("click",jive.spank.roster.RosterGroup.toggleGroupVisListener);
}
}
for(var u=this.contacts.length-1;u>=0;u--){
this.contacts[u]._enableBehaviors();
}
}};
jive.spank.roster.RosterGroup.toggleGroupVisListener=function(evt){
var elm=evt.getTarget().parentNode;
var _1c1=elm.parentNode.childNodes.length;
var _1c2;
for(var i=_1c1-1;i>=0;i--){
if(elm.parentNode.childNodes[i].nodeName=="UL"){
_1c2=elm.parentNode.childNodes[i];
break;
}
}
if(_1c2!=null){
var _1c4=(_1c2.style.display=="none")?"block":"none";
for(var j=_1c2.childNodes.length-1;i>=0;i--){
if(_1c2.childNodes[j].nodeName=="LI"){
_1c2.childNodes[j].style.display=_1c4;
}
}
_1c2.style.display=_1c4;
elm=getEl(elm);
elm.removeClass(_1c4=="block"?"closed":"open");
elm.addClass(_1c4=="block"?"open":"closed");
}
};
jive.spank.roster.RosterGroup.sortContactHTML=function(id){
var _1c7=getEl("group-list-"+id);
if(_1c7&&_1c7.dom!=null){
var _1c8=_1c7.getChildrenByTagName("li");
var _1c9=_1c8.sortBy(function(line){
return line.dom.innerHTML;
});
var line=null;
for(var i=0;i<_1c9.length;i++){
line=_1c9[i];
if(line){
if(line.dom.className.indexOf("even")>-1){
if(i%2==0){
line.replaceClass("even","odd");
}
}else{
if(i%2!=0){
line.replaceClass("odd","even");
}
}
line.appendTo(_1c7.dom);
}
}
}
};
jive.spank.roster.Contact=function(_1cd,_1ce){
this.jid=_1cd.getJID();
this.name=(_1cd.getName&&_1cd.getName()?_1cd.getName():this.jid);
this.status=typeof _1cd!="string"&&_1cd.status?_1cd.status:_1cd.isSubscriptionPending&&_1cd.isSubscriptionPending()?"pending":"unavailable";
this.group=_1ce;
this.id="roster-contact-"+this.jid+"-"+this.group.cleanName;
this.currentMessage="";
this._wrappedClick=null;
this._wrappedDblClick=null;
this.events={"status":true,"offlinemoved":true};
};
YAHOO.extend(jive.spank.roster.Contact,YAHOO.ext.util.Observable,{remove:function(){
var elm=getEl(this.id);
YAHOO.ext.EventManager.removeListener(elm,"click",this._wrappedClick);
this._wrappedClick=null;
YAHOO.ext.EventManager.removeListener(elm,"dblclick",this._wrappedDblClick);
this._wrappedDblClick=null;
YAHOO.ext.EventManager.removeListener(elm,"mouseover",this._wrappedMouseOver);
delete this._wrappedMouseOver;
YAHOO.ext.EventManager.removeListener(elm,"mouseout",this._wrappedMouseOut);
delete this._wrappedMouseOut;
YAHOO.ext.EventManager.removeListener(elm,"contextmenu",this._wrappedContextMenu);
delete this._wrappedContextMenu;
elm.remove();
this.group.contacts.splice(this.group.contactIndexByJid(this.jid),1);
delete this.group;
},changeStatus:function(_1d0,_1d1){
_1d0=_1d0.toLowerCase();
var _1d2=getEl(this.id).dom.childNodes[0];
_1d2.className=_1d2.className.replace("roster-contact-"+this.status,"roster-contact-"+_1d0);
var _1d3=(this.status?this.status:"unavailable");
var _1d4=this.status;
this.status=_1d0;
if(_1d4=="unavailable"||_1d0=="unavailable"){
this.group._roster.fireEvent("offlinemoved");
}
this.fireEvent("status",_1d3,_1d0);
this._changeStatusMsg(_1d1);
return _1d3;
},render:function(){
return jive.spank.chat.Template.contact.applyTemplate({id:this.id,username:this.name,status:this.status,message:this.currentMessage});
},_changeStatusMsg:function(msg){
this.currentMessage=(!msg||msg.strip()==""?"":"- "+msg);
var _1d6=getEl(this.id+"-msg");
_1d6.dom.innerHTML=this.currentMessage;
},_enableBehaviors:function(){
var elm=getEl(this.id);
if(elm){
elm.unselectable();
this._wrappedClick=elm.mon("click",function(id){
var _1d9=getEl(id);
var _1da=_1d9.dom.id;
getEls("ul.jive-roster ul.group-list li").removeClass("selected");
document.getElementById(_1da).className+=" selected";
}.createCallback(this.id));
var self=this;
this._wrappedDblClick=elm.mon("dblclick",function(evt){
evt.stopEvent();
this.group._roster.fireEvent("contactdblclicked",this.group._roster,this);
},this,true);
this._wrappedContextMenu=elm.mon("contextmenu",function(evt){
evt.stopEvent();
var _1de=evt.getTarget();
if(_1de.tagName.toLowerCase()!="li"){
_1de=_1de.parentNode;
}
var _1df=_1de.id;
getEls("ul.jive-roster ul.group-list li").removeClass("selected");
document.getElementById(_1df).className+=" selected";
this.group._roster.fireEvent("contactrightclicked",this.group._roster,this,evt.getPageX(),evt.getPageY());
},this,true);
this._wrappedMouseOver=elm.addManagedListener("mouseover",function(id){
var _1e1=getEl(id);
var _1e2=_1e1.dom.id;
document.getElementById(_1e2).className+=" hover";
}.createCallback(this.id));
this._wrappedMouseOut=elm.addManagedListener("mouseout",function(id){
var elm=getEl(id);
elm.removeClass("hover");
}.createCallback(this.id));
}
}});
jive.spank.roster.Contact.find=function(_1e5,jid,_1e7){
var _1e8=_1e5.groups;
for(var _1e9 in _1e8){
if(_1e7&&_1e9.replace(/[^0-9A-Za-z]/,"_")!=_1e7){
continue;
}
var _1ea=_1e8[_1e9].contacts.find(function(_1eb){
return _1eb.jid==jid;
});
if(_1ea){
return _1ea;
}
}
return null;
};
jive.spank.chat.Control=function(_1ec,_1ed,elm){
elm.id=elm.id||YAHOO.util.Dom.generateId();
this.el=getEl(elm.id);
this.el.appendTo(_1ec);
this.el.setDisplayed("inline").unselectable();
this.events={"click":true,"dblclick":true,"mouseover":true,"mouseout":true,"mousedown":true,"mouseup":true,"mousemove":true};
this._wrappedListeners={};
var self=this;
this._wrappedListeners["click"]=this.el.addManagedListener("click",function(evt){
self.fireEvent("click",evt);
});
this._wrappedListeners["dblclick"]=this.el.addManagedListener("dblclick",function(evt){
self.fireEvent("dblclick",evt);
});
this._wrappedListeners["mouseover"]=this.el.addManagedListener("mouseover",function(evt){
self.fireEvent("mouseover",evt);
});
this._wrappedListeners["mouseout"]=this.el.addManagedListener("mouseout",function(evt){
self.fireEvent("mouseout",evt);
});
this._wrappedListeners["mousedown"]=this.el.addManagedListener("mousedown",function(evt){
self.fireEvent("mousedown",evt);
});
this._wrappedListeners["mouseup"]=this.el.addManagedListener("mouseup",function(evt){
self.fireEvent("mouseup",evt);
});
this._wrappedListeners["mousemove"]=this.el.addManagedListener("mousemove",function(evt){
self.fireEvent("mousemove",evt);
});
this.title=_1ed;
this.panel=_1ec;
};
YAHOO.extend(jive.spank.chat.Control,YAHOO.ext.util.Observable,{fireEvent:function(){
if(!this.el.hasClass("jive-disabled")){
jive.spank.chat.Control.superclass.fireEvent.call(this,arguments[0],self,arguments[1]);
}
},remove:function(){
this.purgeListeners();
for(var _1f7 in this.events){
YAHOO.ext.EventManager.removeListener(_1f7,this.el,this._wrappedListeners[_1f7]);
}
this._wrappedListeners=null;
this.el.remove();
},enable:function(){
this.el.removeClass("jive-disabled");
},disable:function(){
this.el.addClass("jive-disabled");
},toggleEnabled:function(){
this.el.toggleClass("jive-disabled");
}});
jive.spank.chat.Control.add=function(_1f8,_1f9,_1fa){
var body=document.getElementsByTagName("body")[0];
if(typeof _1fa!="function"&&_1fa.elmId!=null){
var _1fc=$(_1fa.elmId);
var elm=_1fc.cloneNode(true);
elm.id="jivectrl-"+_1fc.id;
elm.style.display="none";
body.appendChild(elm);
}else{
if(typeof _1fa!="function"&&_1fa.imgSrc!=null){
var elm=document.createElement("a");
elm.appendChild(document.createElement("img"));
var _1fe=elm.id=YAHOO.util.Dom.generateId();
elm.className="imgbtn";
elm.firstChild.setAttribute("src",_1fa.imgSrc);
if(_1fa.tooltip){
elm.setAttribute("title",_1fa.tooltip);
}
elm.setAttribute("href","#");
body.appendChild(elm);
}else{
var _1ff="autobtn";
var _1fe=YAHOO.util.Dom.generateId();
if(typeof _1fa!="function"&&_1fa.className!=null){
_1ff=_1fa.className;
}
jive.spank.chat.Template.control_btn.append(body,{id:_1fe,cls:_1ff,text:_1f9});
}
}
if(typeof _1fa!="function"&&_1fa.tooltip){
elm.setAttribute("title",_1fa.tooltip);
}
var _200=new jive.spank.chat.Control(getEl(_1f8),_1f9,elm);
if(typeof _1fa=="function"){
_200.addListener("click",_1fa);
}else{
for(var _201 in _1fa.events){
_200.addListener(_201,_1fa.events[_201]);
}
}
return _200;
};
jive.spank.chat.MucInvitation=function(_202){
var _203=new YAHOO.ext.DomHelper.Template(this.template.join(""));
this.onDestroy=[];
_202.id=_202.id||YAHOO.util.Dom.generateId();
this.el=document.createElement("div");
this.el.innerHTML=_203.applyTemplate(_202);
this.el.id=_202.id;
this.config=_202;
};
YAHOO.extend(jive.spank.chat.MucInvitation,YAHOO.ext.util.Observable,{events:{"accepted":true,"declined":true},callback:function(_204){
var _205=this.el.id;
var _206=getEl(_205+"-room").dom.innerHTML;
var _207=getEl(_205+"-inviter").dom.innerHTML;
var join=getEl(_205+"-join");
var _209=join.mon("click",function(_20a,join,_20c){
if(join.id!=_20c.getTarget().id){
return;
}
this.fireEvent("accepted",_204,this.config);
getEl(_20a+"-message").dom.innerHTML="You accepted "+_207+"'s invitation to \""+_206+"\".";
this.destroy();
}.bind(this,_205,join));
this.onDestroy.push(YAHOO.ext.EventManager.removeListener.createDelegate(YAHOO.ext.EventManager,[join,"click",_209]));
var _20d=getEl(_205+"-decline");
_209=_20d.mon("click",function(_20e,_20f){
this.fireEvent("declined",_204,this.config);
getEl(_20e+"-message").dom.innerHTML="You declined "+_207+"'s invitation to \""+_206+"\".";
this.destroy();
}.bind(this,_205));
this.onDestroy.push(YAHOO.ext.EventManager.removeListener.createDelegate(YAHOO.ext.EventManager,[_20d,"click",_209]));
},destroy:function(){
var _210=this.el.id;
this.onDestroy.each(function(func){
func();
});
getEl(_210+"-controls").remove();
this.purgeListeners();
delete this.config;
},template:["<div id=\"{id}-mucinvite\" class=\"jive-mucinvite\">","<p id=\"{id}-message\"><span id=\"{id}-inviter\">{name}</span> has invited you to ","join the conference \"<span id=\"{id}-room\">{chatname}</span>\".</p>","<div id=\"{id}-controls\"><a id=\"{id}-join\" href=\"#\">Accept</a>","<a id=\"{id}-decline\" href=\"#\">Decline</a></div>","</div>"]});
if(window.jive_enable_autocomplete){
jive.spank.AutoComplete=function(_212,_213,_214,_215){
jive.spank.AutoComplete.superclass.constructor.call(this,_212,_213,_214,_215);
};
YAHOO.extend(jive.spank.AutoComplete,YAHOO.widget.AutoComplete);
jive.spank.AutoComplete.prototype._populateList=function(_216,_217,self){
self.autoHighlight=(_217[0][0].indexOf(_216)==0);
jive.spank.AutoComplete.superclass._populateList.call(this,_216,_217,self);
};
jive.spank.AutoComplete.prototype._onTextboxKeyDown=function(v,_21a){
var _21b=v.keyCode;
switch(_21b){
case 9:
if(_21a.delimChar&&(_21a._nKeyCode!=_21b)){
if(_21a._bContainerOpen){
YAHOO.util.Event.stopEvent(v);
}
}
if(_21a._oCurItem){
_21a._selectItem(_21a._oCurItem);
}else{
_21a._toggleContainer(false);
}
break;
case 27:
_21a._toggleContainer(false);
return;
case 39:
_21a._jumpSelection();
break;
case 38:
YAHOO.util.Event.stopEvent(v);
_21a._moveSelection(_21b);
break;
case 40:
YAHOO.util.Event.stopEvent(v);
_21a._moveSelection(_21b);
break;
default:
break;
}
};
jive.spank.FlatAutoComplete=function(_21c,_21d,_21e,_21f){
jive.spank.FlatAutoComplete.superclass.constructor.call(this,_21c,_21d,_21e,_21f);
};
YAHOO.extend(jive.spank.FlatAutoComplete,YAHOO.widget.AutoComplete);
jive.spank.FlatAutoComplete.prototype._populateList=function(_220,_221,self){
self.autoHighlight=(_221[0]&&_221[0].indexOf(_220)==0);
jive.spank.AutoComplete.superclass._populateList.call(this,_220,_221,self);
};
jive.spank.FlatAutoComplete.prototype._updateValue=function(item){
item._sResultKey=item._oResultData;
jive.spank.AutoComplete.superclass._updateValue.call(this,item);
};
}else{
jive.spank.AutoComplete={};
}
jive.spank.Spinner={show:function(_224){
if(_224==null){
_224={};
}
if(!this.isShowing){
var x=_224.x||(YAHOO.util.Dom.getViewportWidth()/2)-60;
var y=_224.y||(YAHOO.util.Dom.getViewportHeight()/2)-20;
var text=_224.text||"Loading...";
this.template.append(document.body,{text:text});
var _228=getEl("jive-spinner");
if(_224.el&&_224.position){
_228.alignTo(_224.el,_224.position);
}else{
_228.moveTo(x,y);
}
_228.setStyle("z-index",20000);
_228.show();
this.isShowing=true;
}
},isShowing:false,hide:function(){
if(this.isShowing){
getEl("jive-spinner").remove();
this.isShowing=false;
}
},template:new YAHOO.ext.DomHelper.Template("<div style=\"visibility: hidden;\" id=\"jive-spinner\">"+"<img src=\"resources/images/progress.gif\" alt=\"\" />{text}</div>")};
jive.spank.chat.Filter=function(name,_22a,_22b){
this.filterPattern=_22a;
this.filterReplacement=_22b;
this.name=name;
};
jive.spank.chat.Filter.prototype.apply=function(_22c){
return _22c.replace(this.filterPattern,this.filterReplacement);
};
jive.spank.chat.Filter.applyAll=function(_22d){
jive.spank.chat.Filter.registeredFilters.each(function(_22e){
_22d=_22e.apply(_22d);
});
return _22d;
};
jive.spank.chat.Filter.add=function(name,_230,_231){
jive.spank.chat.Filter.registeredFilters.push(new jive.spank.chat.Filter(name,_230,_231));
};
jive.spank.chat.Filter.remove=function(_232){
jive.spank.chat.Filter.registeredFilters.each(function(ftr,i){
if(ftr.name==_232){
delete jive.spank.chat.Filter.registeredFilters[i];
throw $break;
}
});
};
jive.spank.chat.Filter.unregisterAll=function(){
for(var t=jive.spank.chat.Filter.registeredFilters.length-1;t>=0;t--){
delete jive.spank.chat.Filter.registeredFilters[t];
}
};
jive.spank.chat.Filter.registeredFilters=[];
jive.spank.notifier={};
jive.spank.notifier.origTitle=null;
jive.spank.notifier.titleMsg="";
jive.spank.notifier.titleInterval=null;
jive.spank.notifier.countNewMsgs=function(){
var _236;
var _237="";
var _238=0;
for(var _239 in jive.spank.chat.ChatWindow.currentWindow){
_236=jive.spank.chat.ChatWindow.currentWindow[_239];
for(var _23a in _236.newMessages){
_238+=_236.newMessages[_23a];
}
}
return _238;
};
jive.spank.notifier.doTitleNotify=function(_23b){
var ct=jive.spank.notifier.countNewMsgs();
if(jive.spank.notifier.titleInterval){
window.clearTimeout(jive.spank.notifier.titleInterval);
jive.spank.notifier.titleInterval=null;
}
if(ct<=0){
if(jive.spank.notifier.origTitle!=null){
document.title=jive.spank.notifier.origTitle;
jive.spank.notifier.origTitle=null;
}
return null;
}else{
jive.spank.notifier.titleMsg="* "+ct+" new chat message"+(ct>1?"s":"");
}
if(jive.spank.notifier.origTitle==null){
jive.spank.notifier.origTitle=document.title;
}
jive.spank.notifier.titleInterval=window.setTimeout(jive.spank.notifier.rotateTitle,2000);
};
jive.spank.notifier.rotateTitle=function(){
document.title=(document.title==jive.spank.notifier.titleMsg)?jive.spank.notifier.origTitle:jive.spank.notifier.titleMsg;
jive.spank.notifier.titleInterval=window.setTimeout(jive.spank.notifier.rotateTitle,2000);
};
jive.spank.chat.Template={add_contact:new YAHOO.ext.DomHelper.Template(["<div class=\"dbody addcontact\">","<table width=\"100%\" cellpadding=\"2\" cellspacing=\"0\" border=\"0\">","<tr><td width=\"35%\">","<label for=\"{id}-addusername\">Username:</label>","</td><td width=\"65%\">","<input type=\"text\" id=\"{id}-addusername\" value=\"\" />","</td></tr>","<tr><td><label for=\"{id}-addnickname\">Nickname:</label>","</td><td><input type=\"text\" id=\"{id}-addnickname\" value=\"\" /></td></tr>","<tr><td><label for=\"{id}-addcontact-group\">Group:</label></td><td>","<input type=\"text\" id=\"{id}-addcontact-group\" value=\"\" />","</td></tr>","<tr><td colspan=\"2\" align=\"center\" class=\"masterctrl\">","<input type=\"button\" class=\"btn createcontact\" id=\"{id}-createcontact\" value=\"Add\" />","<input type=\"button\" class=\"btn jive-closedialog\" id=\"{id}-closeaddcontact\" value=\"Cancel\" />","</td></tr></table>","</div>"].join("")),add_group:new YAHOO.ext.DomHelper.Template(["<div class=\"dbody\">","<table width=\"100%\" cellpadding=\"2\" cellspacing=\"0\" border=\"0\">","<tr><td width=\"25%\" rowspan=\"2\">","</td><td width=\"75%\">","Enter new group name:<br/>","<input type=\"text\" id=\"{id}-addgroupname\" value=\"\" />","</td></tr>","<tr><td>","<input type=\"button\" class=\"btn creategroup\" id=\"{id}-creategroup\" value=\"Add\" />","<input type=\"button\" class=\"btn jive-closedialog\" id=\"{id}-closeaddgroup\" value=\"Cancel\" />","</td></tr></table>","</div>"].join("")),chat_toppane:new YAHOO.ext.DomHelper.Template("<div id=\"{bodyId}-topchat\" class=\"jive-chat-toppane\">"+"<p class=\"avatar\"><img id=\"{bodyId}-avatar\" src=\"../images/sparkweb-avatar.png\" height=\"48\" width=\"48\" alt=\"\" /></p>"+"<h4></h4>"+"<p id=\"{bodyId}-time\">Time: <span></span></p>"+"<div id=\"{bodyId}-controls\" class=\"jive-ctrlbar-topchat\"></div>"+"</div>"),contact:new YAHOO.ext.DomHelper.Template("<li id=\"{id}\" class=\"even\"><span class=\"roster-contact-{status} username\">{username}</span><span id=\"{id}-msg\" class=\"msg\">{message}</span></li>"),control_btn:new YAHOO.ext.DomHelper.Template("<a href=\"#\" class=\"jive-control-btn {cls}\" id=\"{id}\">{text}</a>"),control_panel:new YAHOO.ext.DomHelper.Template("<div id=\"{tabId}-controls\" class=\"jive-ctrlbar\"></div>"),create_account:new YAHOO.ext.DomHelper.Template(["<div class=\"dbody\">","<table border=\"0\" cellpadding=\"0\" cellspacing=\"4\"><tr>","<td><div class=\"{id}-name-label\">Username:</div></td>","<td><input type=\"text\" id=\"{id}-name\" /></td></tr>","<td><div class=\"{id}-passwd-label\">Password:</div></td>","<td><input type=\"password\" id=\"{id}-passwd\" /></td></tr>","<td><div class=\"{id}-confirm-label\">Confirm Password:</div></td>","<td><input type=\"password\" id=\"{id}-confirm\" /></td></tr>","</table>","<p align=\"center\"><input type=\"button\" class=\"btn\" id=\"{id}-submit\" value=\"Submit\" />","<input type=\"button\" class=\"btn jive-closedialog\" id=\"{id}-cancel\" value=\"Cancel\" /></p>","</div>"].join("")),dialog:new YAHOO.ext.DomHelper.Template("<div class=\"ydlg-hd\"><h1>{windowTitle}</h1></div>"+"<div id=\"{bodyId}\" class=\"ydlg-bd\">"+"<div id=\"{bodyId}-toppane\" class=\"ydlg-bd jive-toppane\"></div>"+"</div>"+"<div class=\"ydlg-ft\"><span class=\"powered-by\">Powered By <a href=\"http://www.jivesoftware.com\" title=\"Visit Jive Software\">Jive Software</a></span></div>"),message:new YAHOO.ext.DomHelper.Template("<div class=\"{type}-message from-{from} {mentioned} {consecutive} {action} {msgclass}\"><span class=\"meta\" style=\"color: {color}\"><em>({time})</em>"+"&nbsp;{from}: </span><span class=\"message-content\">{message}</span></div>"),muc_chooser_top:new YAHOO.ext.DomHelper.Template("<div class=\"dhead chooseconf\">Create or join a conference room</div>"+"<div id=\"{tabId}-confcontrols\" class=\"dbody chooseconf\">"+"<div id=\"{tabId}-createconf\" class=\"jive-invite-control\">Create a Conference</div>"+"<div id=\"{tabId}-refresh\" class=\"jive-invite-control\">Refresh List</div>"+"</div>"),muc_controls:new YAHOO.ext.DomHelper.Template("<p>Subject: <span id=\"jive-tab-{jid}-subject\"></span></p>"+"<div class=\"muc-ctrl-frame\">"+"<div id=\"{jid}-changenick\" class=\"jive-invite-control\">Change nickname</div>"+"<div id=\"{jid}-control\" class=\"jive-invite-control\">Invite contact "+"<img align=\"absmiddle\" src=\"resources/images/menutri.gif\" height=\"4\" width=\"7\" alt=\"\" /></div>"+"</div>"),muc_subject:new YAHOO.ext.DomHelper.Template("<p><span id=\"jive-tab-{jid}-subject\"></span></p>"),mucchooser:new YAHOO.ext.DomHelper.Template("<div id=\"{tabId}-layout\" class=\"ylayout-inactive-content\">"+"<div id=\"{tabId}-toppane\" class=\"ydlg-bd jive-toppane\"></div>"+"<div id=\"{tabId}-roomgrid\"></div>"+"</div>"),muccreation:new YAHOO.ext.DomHelper.Template(["<div class=\"dbody\">","<table border=\"0\" cellpadding=\"0\" cellspacing=\"4\"><tr>","<td><label for=\"{id}-roomname\">Room Name:</label></td>","<td><input type=\"text\" id=\"{id}-roomname\" /></td></tr>","<tr><td><label for=\"{id}-roomtopic\">Room Topic:</label></td>","<td><input type=\"text\" id=\"{id}-roomtopic\" /></td></tr>","<tr><td colspan=\"2\"><input type=\"checkbox\" id=\"{id}-permanent\" />","<label for=\"{id}-permanent\"> Make permanent</label></td></tr></table>","<div class=\"fieldset\">","<p class=\"legend\"><span><input type=\"checkbox\" id=\"{id}-private\" />"," Make private</span></p>","<table border=\"0\" cellpadding=\"0\" cellspacing=\"4\"><tr>","<td><label for=\"{id}-roompw\" class=\"disabled\">Password:</label></td>","<td><input type=\"password\" id=\"{id}-roompw\" disabled=\"disabled\" /></td></tr>","<td><label for=\"{id}-roomconfirm\" class=\"disabled\">Confirm Password:</label></td>","<td><input type=\"password\" id=\"{id}-roomconfirm\" disabled=\"disabled\" /></td></tr>","</table></div>","<p align=\"center\"><input type=\"button\" class=\"btn\" id=\"{id}-createroom\" value=\"Create\" />","<input type=\"button\" class=\"btn jive-closedialog\" id=\"{id}-cancel\" value=\"Cancel\" /></p>","</div>"].join("")),mucinvitemenu:new YAHOO.ext.DomHelper.Template("<div id=\"{jid}-container\" class=\"jive-invite-menu\">"+"<input id=\"{jid}-autocomp\" type=\"text\">"+"<div id=\"{jid}-autocomp-menu\"></div>"+"</div>"),mucpassword:new YAHOO.ext.DomHelper.Template(["<div class=\"dbody\">","<p align=\"center\">Enter password:</p>","<p align=\"center\"><input type=\"password\" class=\"btn\" id=\"{id}-passwd\" value=\"\" /></p>","<p align=\"center\"><input type=\"button\" class=\"btn\" id=\"{id}-sendsecret\" value=\"Join\" />","<input type=\"button\" class=\"btn jive-closedialog\" id=\"{id}-cancel\" value=\"Cancel\" /></p>","</div>"].join("")),muctab:new YAHOO.ext.DomHelper.Template("<div id=\"{tabId}-layout\" class=\"ylayout-inactive-content ydlg-tab\">"+"<div id=\"{tabId}-controls\" class=\"jive-muc-ctrl\"></div>"+"<div id=\"{tabId}-history\" class=\"jive-history\"></div>"+"<div id=\"{tabId}-sidebarlayout\" class=\"ylayout-inactive-content ydlg-tab\">"+"<div id=\"{tabId}-sidebar-header\" class=\"jive-muc-sidebar-header\"></div>"+"<div id=\"{tabId}-occupants\" class=\"jive-muc-occupants\"></div>"+"<div id=\"{tabId}-userstatus\" class=\"jive-muc-status\"></div>"+"</div>"+"<textarea id=\"{tabId}-text\" class=\"jive-tab-message\"></textarea>"+"</div>"),remove_group:new YAHOO.ext.DomHelper.Template(["<div class=\"dbody\">","<p align=\"center\">Are you sure you want to remove '{name}'?</p>","<p align=\"center\"><input type=\"button\" class=\"btn\" id=\"{id}-remove\" value=\"Yes\" />","<input type=\"button\" class=\"btn jive-closedialog\" id=\"{id}-cancel\" value=\"No\" /></p>","</div>"].join("")),rename:new YAHOO.ext.DomHelper.Template(["<div class=\"dbody\">","<div style=\"text-align: center; padding: 8px;\">Rename to: ","<input type=\"text\" id=\"{id}-name\" value=\"\" /></div>","<div style=\"text-align: center;\">","<input type=\"button\" class=\"btn\" id=\"{id}-rename\" value=\"OK\" />","<input type=\"button\" class=\"btn jive-closedialog\" id=\"{id}-close\" value=\"Cancel\" />","</div>","</div>"].join("")),roster:new YAHOO.ext.DomHelper.Template("<ul id=\"{rosterId}\" class=\"jive-roster\">{groups}</ul>"),roster_group:new YAHOO.ext.DomHelper.Template("<li id=\"group-{id}\" class=\"group\">"+"<span id=\"group-label-{id}\" class=\"group-label {online} {renderClosed}\"><em>{groupName}</em></span>"+"<ul id=\"group-list-{id}\" class=\"group-list\">{users}</ul>"+"</li>"),rostertab:new YAHOO.ext.DomHelper.Template("<div id=\"{tabId}-layout\" class=\"ylayout-inactive-content\">"+"<div id=\"{tabId}-user\" class=\"jive-controlpanel\"></div>"+"<div id=\"{tabId}-resources\"></div>"+"</div>"),spinnertab:new YAHOO.ext.DomHelper.Template("<div id=\"{tabId}-spinner\" class=\"ylayout-inactive-content ydlg-tab jive-spinnertab\">"+"<div id=\"jive-spinner\"><img src=\"resources/images/progress.gif\" alt=\"\" />{text}</div>"+"</div>"),start_chat:new YAHOO.ext.DomHelper.Template(["<div class=\"dbody\" style=\"text-align: center;\">","<p>Enter an address:</p>","<p><input type=\"text\" id=\"{id}-jid\" /></p>","<p style=\"margin-top: 4px;\"><input type=\"button\" class=\"btn\" id=\"{id}-startbtn\" value=\"Start Chat\" />","<input type=\"button\" class=\"btn jive-closedialog\" id=\"{id}-cancel\" value=\"Cancel\" /></p>","</div>"].join("")),statusMessage:new YAHOO.ext.DomHelper.Template("<div class=\"status-message {customClass}\">{message}</div>"),status_panel:new YAHOO.ext.DomHelper.Template("<div class=\"jive-userstatus\">"+"<p class=\"avatar\"><img id=\"{bodyId}-avatar\" src=\"../images/sparkweb-avatar.png\" height=\"48\" width=\"48\" alt=\"\" /></p>"+"<h4>{username}</h4>"+"<p id=\"{bodyId}-status\" class=\"jive-mystatus\">"+"<a href=\"#\" id=\"{bodyId}-statusmenu-ctrl\" class=\"roster-contact-{statusName}\"><span>{status}</span></a></p>"+"</div>"),sub_request:new YAHOO.ext.DomHelper.Template(["<div class=\"dhead\">{nick} ({jid}) wants to add you as a contact.</div>","<div class=\"dbody fieldset\">","<p class=\"legend\"><span><input type=\"checkbox\" id=\"{id}-add\" checked=\"checked\" />"," Add user to your contacts too</span></p>","<table width=\"100%\" cellpadding=\"2\" cellspacing=\"0\" border=\"0\">","<tr><td width=\"35%\">","<label for=\"addusername\">Username:</label>","</td><td id=\"{id}-jid\" width=\"65%\">{jid}</td></tr>","<tr><td><label for=\"{id}-nick\">Nickname:</label>","</td><td><input type=\"text\" id=\"{id}-nick\" value=\"{nick}\" /></td></tr>","<tr><td><label for=\"{id}-subrequest-group\">Group:</label></td><td>","<input type=\"text\" id=\"{id}-subrequest-group\" value=\"\" />","</td></tr></table></div>","<p align=\"center\">","<input type=\"button\" class=\"btn subrequest\" id=\"{id}-acceptsubrequest\" value=\"Allow\" />","<input type=\"button\" class=\"btn subrequest\" id=\"{id}-denysubrequest\" value=\"Deny\" />","</p>"].join("")),tab:new YAHOO.ext.DomHelper.Template("<div id=\"{tabId}-layout\" class=\"ylayout-inactive-content ydlg-tab\">"+"<div id=\"{tabId}-toppane\" class=\"ydlg-bd jive-toppane\"></div>"+"<div id=\"{tabId}-history\" class=\"jive-history\"></div>"+"<textarea id=\"{tabId}-text\" class=\"jive-tab-message\"></textarea>"+"</div>"),userpane:new YAHOO.ext.DomHelper.Template("<div id=\"{id}-message\">{message}</div>"),userpane_loggedin:new YAHOO.ext.DomHelper.Template("<div>"+"<input class=\"jive-muc-username\" type=\"text\" id=\"{id}-uname\" value=\"{uname}\"></input>"+"<a class=\"jive-muc-username-edit\" id=\"{id}-uname-edit\">change</a>"+"</div>"+"<div class=\"jive-muc-presence-control {presence}\" id=\"{id}-presencecontrol\">{presence}</div>"),userpane_changebtn:new YAHOO.ext.DomHelper.Template("<a id=\"{id}-changenickbtn\" href=\"javascript:void(0);\">Change Nickname</a>"),userstatus:new YAHOO.ext.DomHelper.Template("<div id=\"{tabId}-layout\" class=\"ylayout-inactive-content ydlg-tab\">"+"<div id=\"{tabId}-toppane\" class=\"ydlg-bd jive-toppane\"></div>"+"<div id=\"{tabId}-history\" class=\"jive-history\"></div>"+"<textarea id=\"{tabId}-text\" class=\"jive-tab-message\"></textarea>"+"</div>")};
if(window.jive_enable_grid){
YAHOO.ext.grid.SpankJSONDataModel=function(_23d){
YAHOO.ext.grid.SpankJSONDataModel.superclass.constructor.call(this,YAHOO.ext.grid.LoadableDataModel.JSON);
this.schema=_23d;
};
YAHOO.extendX(YAHOO.ext.grid.SpankJSONDataModel,YAHOO.ext.grid.LoadableDataModel,{loadData:function(data,_23f,_240){
var _241=this.schema.id;
var _242=this.schema.fields;
try{
if(this.schema.totalProperty){
var v=parseInt(eval("data."+this.schema.totalProperty),10);
if(!isNaN(v)){
this.totalCount=v;
}
}
var _244=[];
if(this.schema.root){
var root=eval("data."+this.schema.root);
}else{
var root=data;
}
for(var i in root){
var node=root[i];
var _248=[];
_248.node=node;
_248.id=(typeof node[_241]!="undefined"&&node[_241]!==""?node[_241]:String(i));
for(var j=0;j<_242.length;j++){
var val=node[_242[j]];
if(typeof val=="undefined"){
val="";
}
if(this.preprocessors[j]){
val=this.preprocessors[j](val);
}
_248.push(val);
}
_244.push(_248);
}
if(_240!==true){
this.removeAll();
}
this.addRows(_244);
if(typeof _23f=="function"){
_23f(this,true);
}
this.fireLoadEvent();
}
catch(e){
this.fireLoadException(e,null);
if(typeof _23f=="function"){
_23f(this,false);
}
}
},getRowId:function(_24b){
return this.data[_24b].id;
}});
}
YAHOO.ext.Element.prototype.getParentByClass=function(_24c,_24d){
if(_24d){
_24d=_24d.toLowerCase();
}
function isMatch(el){
if(!el){
return false;
}
if(_24c&&!YAHOO.util.Dom.hasClass(el,_24c)){
return false;
}
return !(_24d&&el.tagName.toLowerCase()!=_24d);
}
var t=this.dom;
if(!t||isMatch(t)){
return t;
}
var p=t.parentNode;
var b=document.body;
while(p&&p!=b){
if(isMatch(p)){
return p;
}
p=p.parentNode;
}
return null;
};
YAHOO.ext.Element.prototype.setSelectable=function(_252){
this.dom.unselectable=_252?"off":"on";
if(!_252){
this.applyStyles("-moz-user-select:none;-khtml-user-select:none;");
}else{
this.applyStyles("-moz-user-select:normal;-khtml-user-select:auto;");
}
return this;
};


jive_groupchat_config_defaults={width:750,height:450,x:0,y:0,fitToParent:"true",constrained:"false",draggable:"false",resizable:"true",closable:"true",bottomPane:"false",mucServer:"conference.localhost",server:"localhost",connectionAddress:"localhost:7080",roomName:"test"};
var jive_prefs={data:{},load:function(){
var _1=document.cookie.split(";");
if(_1[0]){
var _2=unescape(_1[0]);
var _3=_2.split(",");
var _4;
for(var i=0;i<_3.length;i++){
_4=_3[i].split(":");
if(_4[0]&&_4[0].length>0){
this.data[_4[0]]=_4[1];
}
}
}
return this.data;
},save:function(_6,_7){
var d=_6||new Date(2020,2,2);
var p=_7||"/";
var _a="";
for(var _b in this.data){
_a+=(_b+":"+this.data[_b]+",");
}
document.cookie=escape(_a)+";path="+p+";expires="+d.toUTCString();
}};
function enableEmoticons(){
var _c=[["angry",/&gt;:o|&gt;:-o|&gt;:O|&gt;:-O/g],["confused",/\?:\|/g],["cool",/B-\)|8-\)/g],["cry",/:\'\(/g],["devil",/\]:\)/g],["grin",/:-D|:D/g],["happy",/:-\)|:\)/g],["laugh",/:\^0/g],["love",/:x/g],["mischief",/;\\/g],["sad",/:-\(|:\(/g],["silly",/:-p|:-P|:P|:p/g],["wink",/;-\)|;\)/g]];
_c.each(function(_d){
jive.spank.chat.Filter.add(_d[0],_d[1],"<img src=\"groupchat/jive-images/emoticons/"+_d[0]+".gif\" alt=\"\" />");
});
}
function enableAutolinking(){
jive.spank.chat.Filter.add("uri",/\b(\w+?:\/\/[^\s+\"\<\>]+)/ig,"<a href=\"$1\" target=\"_blank\">$1</a>");
jive.spank.chat.Filter.add("webaddress",/(\s|^)(www\.[^\s+\"\<\>]+)/ig,"<a href=\"http://$2\" target=\"_blank\">$2</a>");
}
function jive_configureGroupChat(){
if(!window.jive_groupchat_config){
window.jive_groupchat_config={};
}
for(var _e in jive_groupchat_config_defaults){
if(!jive_groupchat_config[_e]){
jive_groupchat_config[_e]=jive_groupchat_config_defaults[_e];
}
}
if(jive_groupchat_config["fitToParent"]){
jive_groupchat_config["width"]=null;
jive_groupchat_config["height"]=null;
}
}
jive_configureGroupChat();
MessageHandler={subjectUpdated:function(_f,_10,_11){
window.controller.chatWindow.setSubject(_11,_f.jid.toString());
},messageReceived:function(_12){
var _13=_12.getFrom();
var _14=_13.toBareJID();
var _15=_13.getResource();
var _16=_12.getBody();
var _17=window.controller.nickname.toLowerCase()==_15;
_16.mentioned=(_16.body.indexOf(window.controller.nickname.toLowerCase())>-1)?"mentioned":null;
var t=_12.getExtension("x","jabber:x:delay");
if((t||!_17)&&_16){
if(t){
t=new XMPP.DelayInformation(t).getDate().toLocaleTimeString();
}
if(_15){
window.controller.chatWindow.addMessage(_14,_15,_16,_17,t);
}else{
window.controller.chatWindow.addStatusMessage(_14,_16.body);
}
}
}};
controller={chatWindow:null,conf:null,connection:null,connectionSuccessful:function(_19){
this.connection=_19;
_19.login();
window.onbeforeunload=_19.disconnect;
},connectionFailed:function(_1a,_1b){
alert("Error: "+_1b);
},authenticationSuccessful:function(_1c){
this.chatWindow=new jive.spank.chat.ChatWindow("groupchat",window.jive_groupchat_config);
if(window.jive_groupchat_config["fitToParent"]=="true"){
window.resizeHandler();
}
this.chatManager=new org.jive.spank.chat.Manager(_1c,window.jive_groupchat_config["server"],false);
this.mucManager=new org.jive.spank.muc.Manager(_1c,this.chatManager);
this.joinChat();
},joinChat:function(){
this.conf=this.mucManager.createRoom(new XMPP.JID(window.jive_groupchat_config["roomName"]+"@"+window.jive_groupchat_config["mucServer"]));
jive_prefs.load();
this.nickname="Guest"+Math.floor(Math.random()*500);
this.conf.join(this.nickname,"",this,MessageHandler,this.occupantListener);
},authenticationFailed:function(_1d,_1e){
alert("Authentication failed: "+_1e);
},connectionClosed:function(_1f,_20){
},occupantListener:function(_21){
var _22=_21.getRoom();
var _23=window.controller.mucManager.getRoom(new XMPP.JID(_22));
if(!_23||!_23.isJoined){
return;
}
var jid=_21.presence.getFrom();
var tab=window.controller.chatWindow.tabs[_22];
if(!tab){
return;
}
var _26=tab.participants;
if(!_26){
return;
}
var _27=_26.getContactByJID(jid.toString());
var _28;
var _29;
switch(_21.presence.getType()){
case "available":
_28=_21.presence.getMode();
if(!_28){
_28="available";
}
_29=_21.presence.getStatus();
break;
default:
_28="unavailable";
break;
}
if(!_27&&_28!="unavailable"){
_27=_26.addContact({jid:jid,getJID:function(){
return this.jid.toString();
},status:_28,getName:function(){
return _21.getNick();
}});
window.controller.chatWindow.addStatusMessage(_22,_21.getNick()+" has joined the room.","muc-join-message");
}else{
if(_27&&_28=="unavailable"){
_27.changeStatus(_28);
_26.removeContact(jid.toString());
var _2a=_21.presence.getStatus();
if(_2a!=null&&_2a.length>0){
window.controller.chatWindow.addStatusMessage(_22,_21.getNick()+" has left the room, saying "+_2a,"muc-leave-message");
}else{
window.controller.chatWindow.addStatusMessage(_22,_21.getNick()+" has left the room.","muc-leave-message");
}
}else{
if(_27){
_27.changeStatus(_28);
}
}
}
},sendMessage:function(_2b,_2c){
this.completionState={index:0,completed:null,original:null};
if(_2c.indexOf("/clear")==0){
var _2d=this.chatWindow.dialog.getEl().dom.getElementsByClassName("jive-history")[0];
while(_2d.firstChild){
_2d.removeChild(_2d.firstChild);
}
}else{
if(_2c.indexOf("/nick")==0){
if(_2c.length>"/nick".length+2){
this.chatWindow.fireEvent("changenameinmuc",this.chatWindow,this.conf.jid,_2c.replace("/nick ",""));
}
}else{
if(_2c.indexOf("/part")==0){
this.logout(_2c.replace("/part ","").replace("/part",""));
}else{
if(_2c.indexOf("/leave")==0){
this.logout(_2c.replace("/leave ","").replace("/leave",""));
}else{
var jid=new XMPP.JID(this.nickname);
this.conf.sendMessage(_2c,org.jive.spank.x.chatstate.getManager(this.chatManager).setCurrentState("active",jid));
this.chatWindow.addMessage(window.controller.conf.jid,this.nickname,{body:_2c,isLocal:true},true);
}
}
}
}
},completionState:{index:0,completed:null,original:null},completeNick:function(jid,_30,_31){
jid=new XMPP.JID(jid);
var _32=this.mucManager.getRoom(jid);
var _33=_32.getOccupants();
var _34;
var _35=this.completionState;
var _36=0;
if(_35.original==null||_35.completed!=_30){
_35.original=_30;
}
for(var i=_35.index;i<_33.length&&_36<_33.length;i++){
_36++;
_35.index=i+1;
_34=_33[i].getNick();
if(_35.index>=_33.length){
_35.index=0;
i=0;
}
if(_34.indexOf(_35.original)==0&&_35.original.length<_34.length){
_35.completed=_34+": ";
_31.dom.value=_35.completed;
_31.dom.selectionStart=_31.dom.value.length;
_31.dom.selectionEnd=_31.dom.value.length;
return;
}
}
},handleNameChange:function(_38,_39,_3a,_3b){
var _3c=this.conf.getOccupants();
var _3d=false;
for(var i=0;i<_3c.length;i++){
if(_3a.toLowerCase()==_3c[i].getNick().toLowerCase()&&_3a!=this.nickname){
_3a=_3a+"_";
i=0;
_3d=true;
}
}
if(_3d==true){
this.chatWindow.addStatusMessage(this.conf.jid,"Nickname collision with "+_3a+"; a _ has been appended to your nick to make it different.","muc-name-conflict-message");
this.chatWindow.fireEvent("changenameinmuc",this.chatWindow,this.conf.jid,_3a);
return;
}
this.nickname=_3a;
if(_3b!="nosave"){
jive_prefs.data.nickname=_3a;
jive_prefs.save();
}
this.conf.changeNickname(_3a);
},sendTimeStamp:function(){
this.chatWindow.addStatusMessage(this.conf.jid,window.strftime(new Date(),"%1I:%M %p"),"muc-time-message");
window.setTimeout(this.sendTimeStamp.bind(this),300000);
},updateDate:function(){
window.controller.chatWindow.dialog.setTitle("");
var _3f=new Date();
_3f.setMinutes(0);
_3f.setHours(0);
_3f.setSeconds(5);
_3f.setDate(_3f.getDate()+1);
window.setTimeout(window.controller.updateDate,_3f-new Date());
},onSuccess:function(_40){
var _41=window.controller.chatWindow;
var _42=window.controller.conf;
_41.addMUC({name:_42.nickname,jid:_42.jid});
var _43=_42.getOccupants();
for(var i=0;i<_43.length;i++){
window.controller.occupantListener(_43[i]);
}
_41.prepUserPane();
_41.show();
_41.finalizeUserPane(this.nickname,this.mucManager);
_41.setSubject("");
window.controller.updateDate();
getEl(_41.tabId+"-layout").dom.parentNode.style.position="absolute";
enableEmoticons();
enableAutolinking();
_41.addListener("message",this.sendMessage.bind(this));
_41.addListener("nickcomplete",this.completeNick.bind(this));
_41.addListener("changenameinmuc",this.handleNameChange.bind(this));
_41.dialog.addListener("beforeshow",this.joinChat,window.controller,true);
_41.dialog.addListener("beforehide",this.conf.leave.bind(this.conf));
var _45=jive_prefs.data.nickname;
if(!_45){
_45=this.nickname;
}
_41.fireEvent("changenameinmuc",_41,this.conf.jid,_45);
window.setTimeout(window.controller.sendTimeStamp.bind(window.controller),1000);
},logout:function(_46){
window.controller.conf.leave(false);
var _47=new XMPP.Presence();
_47.setType("unavailable");
window.controller.connection.logout(_47);
}};
var resizeHandler=function(){
var _48=window.controller.chatWindow.dialog;
_48.beginUpdate();
_48.getEl().fitToParent();
_48.resizeTo(_48.getEl().getWidth(),_48.getEl().getHeight());
var xy=YAHOO.util.Dom.getXY(_48.getEl().dom.parentNode);
_48.moveTo(xy[0],xy[1]);
_48.endUpdate();
};
var toggleTheme=function(){
getEl(document.body,true).toggleClass("jivetheme-muc");
};
YAHOO.ext.EventManager.onDocumentReady(function(){
window.connection=new XMPPConnection("/http-bind/",window.jive_groupchat_config["connectionAddress"],controller);
connection.connect();
toggleTheme();
});
if(window.jive_groupchat_config["fitToParent"]=="true"){
YAHOO.ext.EventManager.onWindowResize(resizeHandler,window,false);
}


