<%@page contentType="text/html; charset=UTF-8" %>
<%
    String xmppDomain = application.getInitParameter("xmpp-domain");
    boolean debug = false;
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Converse.js</title>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Converse.js: An XMPP chat client which can be integrated into any website" />
    <meta name="author" content="JC Brand" />
    <meta name="keywords" content="xmpp chat webchat converse.js" />
    <link rel="stylesheet" type="text/css" media="screen" href="https://cdn.conversejs.org/5.0.1/dist/converse.min.css">
    <script src="https://cdn.conversejs.org/3rdparty/libsignal-protocol.min.js"></script>
    <script src="https://cdn.conversejs.org/5.0.1/dist/converse.min.js" charset="utf-8"></script>

    <style>
        .converse-container {
            height: 558px;
        }
    </style>
</head>

<body id="page-top" data-spy="scroll">
    <div class="converse-container">
        <div id="conversejs" class="theme-concord"></div>
    </div>
</body>

<script>
    var nickColors = {}, avatars = {}, videoRecorder = null, _converse = null;   

    window.addEventListener("load", function()
    {    
        setupPlugins();

        converse.initialize({
            authentication: 'anonymous',
            auto_login: true,
            auto_join_rooms: [
                'open_chat@conference.igniterealtime.org',
            ],
            bosh_service_url: 'https://igniterealtime.org/http-bind/',
            jid: 'igniterealtime.org',
            muc_fetch_members: false,
            singleton: true,
            theme: 'concord',        
            view_mode: 'embedded',
            whitelisted_plugins: ["ignite"]        
        });
    });
  
    //-------------------------------------------------------
    //
    //  Functions
    //
    //-------------------------------------------------------
  
    function setupPlugins()
    {
        var Strophe = converse.env.Strophe, dayjs = converse.env.dayjs;

        converse.plugins.add("ignite", {
            dependencies: [],

            initialize: function () {
                _converse = this._converse;   
                
                _converse.api.listen.on('renderToolbar', function(view)
                {
                    console.debug('ingite - renderToolbar', view.model);                    
                    var id = view.model.get("box_id"); 
                    var jid = view.model.get("jid");
                    
                    var scrolldown = addToolbarItem(view, id, "ignite-scrolldown-" + id, '<a class="fa fa-angle-double-down" title="Scroll to the bottom"></a>');                       

                    scrolldown.addEventListener('click', function(evt)
                    {                   
                        evt.stopPropagation();
                        view.viewUnreadMessages()

                    }, false); 
                    
                    var jitsimeet = addToolbarItem(view, id, "ignite-jitsimeet-" + id, '<a class="fas fa-video" title="JitsiMeet at where hope springs eternal"></a>');  
                    
                    jitsimeet.addEventListener('click', function(evt)
                    {  
                        evt.stopPropagation();                    
                        doVideo(view, id, jid);
                        
                    }, false);  
                    
                    var screencast = addToolbarItem(view, id, "ignite-screencast-" + id, '<a class="fa fa-desktop" title="ScreenCast. Click to here to start and click here again to stop"></a>');                    
                    
                    screencast.addEventListener('click', function(evt)
                    {  
                        evt.stopPropagation();                    
                        toggleScreenCast(view);
                        
                    }, false);                     
                });
                
                console.log("ignite plugin is ready");
            },

            overrides: {
                MessageView: {

                    renderChatMessage: async function renderChatMessage()
                    { 
                        if (this.model.vcard)
                        {
                            var nick = this.model.getDisplayName();

                            if (nick && _converse.DEFAULT_IMAGE == this.model.vcard.attributes.image)
                            {
                                var dataUri = createAvatar(nick);
                                var avatar = dataUri.split(";base64,");
                                
                                this.model.vcard.attributes.image = avatar[1];
                                this.model.vcard.attributes.image_type = "image/png";
                            }
                        } 
                        
                        await this.__super__.renderChatMessage.apply(this, arguments);                        
                    }
                }                    
            }
        });                
    }
    
    function createAvatar (nickname, width, height, font)
    {
        nickname = nickname.toLowerCase();

        if (avatars[nickname])
        {
            return avatars[nickname];
        }

        if (!width) width = 32;
        if (!height) height = 32;
        if (!font) font = "16px Arial";

        var canvas = document.createElement('canvas');
        canvas.style.display = 'none';
        canvas.width = width;
        canvas.height = height;
        document.body.appendChild(canvas);
        var context = canvas.getContext('2d');
        context.fillStyle = getRandomColor(nickname);
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = font;
        context.fillStyle = "#fff";

        var first, last, pos = nickname.indexOf("@");
        if (pos > 0) nickname = nickname.substring(0, pos);

        var name = nickname.split(" ");
        if (name.length == 1) name = nickname.split(".");
        if (name.length == 1) name = nickname.split("-");
        var l = name.length - 1;

        if (name && name[0] && name.first != '')
        {
            first = name[0][0];
            last = name[l] && name[l] != '' && l > 0 ? name[l][0] : null;

            if (last) {
                var initials = first + last;
                context.fillText(initials.toUpperCase(), 3, 23);
            } else {
                var initials = first;
                context.fillText(initials.toUpperCase(), 10, 23);
            }
            var data = canvas.toDataURL();
            document.body.removeChild(canvas);
        }
        
        var dataUrl = canvas.toDataURL();
        avatars[nickname] = dataUrl;
        return dataUrl;
    }

    function getRandomColor (nickname)
    {
        if (nickColors[nickname])
        {
            return nickColors[nickname];
        }
        else {
            var letters = '0123456789ABCDEF';
            var color = '#';

            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            nickColors[nickname] = color;
            return color;
        }
    } 
    
    function __newElement (el, id, html, className)
    {
        var ele = document.createElement(el);
        if (id) ele.id = id;
        if (html) ele.innerHTML = html;
        if (className) ele.classList.add(className);
        document.body.appendChild(ele);
        return ele;
    }

    function addToolbarItem (view, id, label, html)
    {
        var placeHolder = view.el.querySelector('#place-holder');

        if (!placeHolder)
        {
            var smiley = view.el.querySelector('.toggle-smiley.dropup');
            smiley.insertAdjacentElement('afterEnd', __newElement('li', 'place-holder'));
            placeHolder = view.el.querySelector('#place-holder');
        }
        var newEle = __newElement('li', label, html);
        placeHolder.insertAdjacentElement('afterEnd', newEle);
        return newEle;
    }  
    
    function doVideo (view, id, jid)
    {
        var div = view.el.querySelector(".box-flyout");

        if (div)
        {
            var url = "https://meet.jit.si/WhereHopeSpringsEternal#config.startWithVideoMuted=true"
            div.innerHTML = '<iframe src="' + url + '" id="jitsimeet" allow="microphone; camera;" frameborder="0" seamless="seamless" allowfullscreen="true" scrolling="no" style="z-index: 2147483647;width:100%;height:-webkit-fill-available;height:-moz-available;"></iframe>';

            var jitsiDiv = div.querySelector('#jitsimeet');
            var firstTime = true;

            jitsiDiv.addEventListener("load", function ()
            {
                console.debug("doVideo - load", this);

                if (!firstTime) // meeting closed and root url is loaded
                {
                    view.close();
                    _converse.api.rooms.open(jid);
                }

                if (firstTime) firstTime = false;   // ignore when jitsi-meet room url is loaded

            });
        }    
    }
    
    function toggleScreenCast (view)
    {
        if (videoRecorder == null)
        {
            getDisplayMedia().then(stream =>
            {
                handleStream(stream, view);

            }, error => {
                handleError(error)
            });

        } else {
            videoRecorder.stop();
        }

        return true;
    }

    function getDisplayMedia ()
    {
        if (navigator.getDisplayMedia) {
          return navigator.getDisplayMedia({video: true});
        } else if (navigator.mediaDevices.getDisplayMedia) {
          return navigator.mediaDevices.getDisplayMedia({video: true});
        } else {
          return navigator.mediaDevices.getUserMedia({video: {mediaSource: 'screen'}});
        }
    }

    function handleStream (stream, view)
    {
        navigator.mediaDevices.getUserMedia({audio: true, video: false}).then((audioStream) => handleAudioStream(stream, audioStream, view)).catch((e) => handleError(e))
    }

    function handleAudioStream (stream, audioStream, view)
    {
        console.debug("handleAudioStream - seperate", stream, audioStream);

        stream.addTrack(audioStream.getAudioTracks()[0]);
        audioStream.removeTrack(audioStream.getAudioTracks()[0]);

        console.debug("handleAudioStream - merged", stream);

        var video = document.createElement('video');
        video.playsinline = true;
        video.autoplay = true;
        video.muted = true;
        video.srcObject = stream;
        video.style.display = "none";

        setTimeout(function()
        {
            videoRecorder = new MediaRecorder(stream);
            videoChunks = [];

            videoRecorder.ondataavailable = function(e)
            {
                console.debug("handleStream - start", e);

                if (e.data.size > 0)
                {
                    console.debug("startRecorder push video ", e.data);
                    videoChunks.push(e.data);
                }
            }

            videoRecorder.onstop = function(e)
            {
                console.debug("handleStream - stop", e);

                stream.getTracks().forEach(track => track.stop());

                var blob = new Blob(videoChunks, {type: 'video/webm;codecs=h264'});
                var file = new File([blob], "screencast-" + Math.random().toString(36).substr(2,9) + ".webm", {type: 'video/webm;codecs=h264'});
                view.model.sendFiles([file]);
                videoRecorder = null;
            }

            videoRecorder.start();
            console.debug("handleStream", video, videoRecorder);

        }, 1000);
    }

    function handleError (e)
    {
        console.error("ScreenCast", e)
    }
</script>
</html>
