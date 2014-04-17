(function ($, MM) {
    var config = {
        appid: '0627e108ccbc4ae191009296ea38235f34778405',
        onInit: onMMInit
    };
    // Initialize MM SDK
    MM.init(config);


    function onMMInit () {
        // Set the token to user token obtained from getToken() call below with userid setTopBoxClient
        MM.setToken('79edf2b66de3bd88b99481688f2a9998e4715fea',
            function onTokenValid () {
                console.log('token valid');
                MM.setActiveSessionID('84223'); // Session Id for demo
                MM.setActiveUserID('1514'); // Android Client User ID
                MM.activeSession.subscribe('ChangeChannel', onChangeChannel, onSubscribeChangeChannel);
            },
            function onTokenInvalid() {
                console.log('token invalid');
            }
        );
    }

    /**
     * Callback when we have successfully subscribed to 'ChangeChannel' event
     */
    function onSubscribeChangeChannel () {
        console.log('subscribed to ChangeChannel event');
    }

    /**
     * Callback fired when 'ChangeChannel' is published. onChangeChannel()
     * updates the currently playing channel text and sets a new background
     * color to the div based on channel name
     *
     * @param channelName
     */
    function onChangeChannel (channelName) {
        var channelColor = getBackgroundColorFromName(channelName);
        $('.channel').css('background-color', channelColor);
        $('#channelText').text(channelName);
        console.log('received ChangeChannel event with channel: ' + JSON.stringify(channelName));
    }

    /**
     * Generate a unique RGB hex value for each channel name. We first get an integer
     * hash code of the channel name, capture RGB values from the hash, and return
     * a hex color to style the channel background
     *
     * @param name
     * @return string
     */
    function getBackgroundColorFromName (name) {
        function hashCode (string) {
            var hash = 0, i, chr, len;
            if (string.length == 0) return hash;
            for (i = 0, len = string.length; i < len; i++) {
                chr   = string.charCodeAt(i);
                hash  = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        }

        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }

        function rgbToHex(r, g, b) {
            return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
        }

        var hash = hashCode(name);
        var r = (hash & 0xFF0000) >> 16;
        var g = (hash & 0x00FF00) >> 8;
        var b = hash & 0x0000FF;

        return rgbToHex(r, g, b);
    }

}(jQuery, MM));