<html lang="en">
<head>
        <meta charset="utf-8">
	<title>Support - Group Chat</title>
        <link rel="stylesheet" type="text/css" href="candy-1.7.1/res/default.css" />
        <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        <script type="text/javascript" src="candy-1.7.1/libs/libs.min.js"></script>
        <script type="text/javascript" src="candy-1.7.1/candy.min.js"></script>
	<meta name="body-id" content="support" />

	<script type="text/javascript">
                $(document).ready(function() {
                        Candy.init('/http-bind/', {
                                core: {
                                        debug: false,
                                        autojoin: ['open_chat@conference.igniterealtime.org']
                                },
                                view: { resources: 'candy-1.7.1/res/' }
                        });

                        Candy.Core.connect('igniterealtime.org');

                });

	</script>
	
</head>
<body>
<div id="candy"></div>
</body>
</html>
