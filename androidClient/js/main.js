(function ($, MM) {

    var config = {
        appid: '0627e108ccbc4ae191009296ea38235f34778405',
        onInit: onMMInit
    };

    var lastTextEntryID = null;
    var lastTranscript = null;

    // Initialize MM SDK
    MM.init(config);

    function onMMInit () {
        // Set the token to user token obtained from getToken() call below with userid androidClient
        MM.setToken('20ab1c1d23e9f0f2df5842c0edac688d1afdfd82',
            function onTokenValid () {
                console.log('token valid');
                MM.setActiveUserID('1511'); // Android Client User ID
                MM.setActiveSessionID('84223'); // Session ID for demo
                MM.activeSession.entities.onUpdate(onEntitiesUpdate, onSubscribedToEntityUpdates);
                initializeMicrophone();
        //        addUserToSession();
            },
            function onTokenInvalid() {
                console.log('token invalid');
            }
        );
    }

    /**
     * Callback fired when speech has been converted to text
     *
     * @param result
     */
    function onVoiceResult (result) {
        var transcript = result.transcript; // speech-to-text result
        lastTranscript = transcript;
    
        if (result.final) {
            $('#confirmed').append(' <span class="tran">' + transcript + '</span>');
            $('#pending').text('');
        }
        else {
            $('#pending').text(transcript);
        }

    }

    /**
     * Show status messages
     * @param message
     */
    function logResultMessage (message) {
        $('#resultMessage').empty();
        $('#resultMessage').append('<span class="resultText">' + message + '</span>');
    }

    /**
     * Callback fired when we have successfully subscribed
     * to updates on the entities collection
     */
    function onSubscribedToEntityUpdates () {
        console.log('subscribed to entity updates');
    }

    /**
     * Record posted text entry IDs
     *
     * @param response
     */
    function onTextEntryPosted (response) {
        lastTextEntryID = response.data.textentryid;
        console.log('text entry posted: ' + response.data.textentryid);
        logResultMessage('interpreting now...');
    }

    /**
     * Called when entities have been extracted for our text entry. We are now ready to
     * get the most relevant documents
     */
    function onEntitiesUpdate () {
        console.log('entities updated, getting docs');
        var queryParams = {
            textentryids: lastTextEntryID
        };

        // wait a half second because documents may not be ready :(
        setTimeout(
            function getDocuments () {
                MM.activeSession.documents.get( queryParams,
                    onGetDocuments,
                    function error (error) {
                        console.log('error fetching documents: ' + error.message);
                    }
                );
            },
            1000
        );
    }

    /**
     * Once we have received a list of documents, we'll assume the top result is the best answer,
     * show the matched channel, and fire a push event to the set top box with the new channel
     */
    function onGetDocuments () {
        var documents = MM.activeSession.documents.json();
        if (documents.length > 0) { // Found the channel!
            var channelDocument = documents[0];
            var channelName = channelDocument.title;
            logResultMessage('Matched transcript to  channel ' + channelName);
            MM.activeSession.publish('ChangeChannel', channelName);
        }
        else {
            logResultMessage('no channel matching "' + lastTranscript + '" found');
        }

    }

    /**
     * Initialize MM speech-to-text capabilities + handle click on mic icon
     */
    function initializeMicrophone () {

        // Set listener to not listen continuously in background
        // and don't return interim results
        // Docs here: https://developer.expectlabs.com/docs/sdks/js/referenceDocs/MM.activeSession.html#setListenerConfig
        MM.activeSession.setListenerConfig({
            continuous: false,
            interimResults: true,
            onResult: onVoiceResult,
            onTextEntryPosted: onTextEntryPosted,
            onStart: onStartListening,
            onEnd: onEndListening,
            onError: onError
        });

        $('#microphone').click(onClickMicrophone);

    }

    /**
     * Start/stop MM listener on mic click
     */
    function onClickMicrophone () {
        if (MM.activeSession.listener.listening) {
            MM.activeSession.listener.stop();
        }
        else {
            MM.activeSession.listener.start();
        }
    }


    /**
     * Empty transcript and result fields on start listening and
     * start microphone animation
     */
    function onStartListening () {
        $('#confirmed').empty();
        $('#pending').empty();
        $('#resultMessage').empty();
        $('#microphone').addClass('pulsing');
        lastTextEntryID = null;
        lastTranscript = null;
        console.log('now listening');
    }

    /**
     * Stop microphone animation when listening stops
     */
    function onEndListening () {
        $('#microphone').removeClass('pulsing');
        console.log('end listening');
    }

    function onError () {
        console.log('listener error');
    }


    // Example code

    // Example code to get user tokens
    function getToken () {
        // get user token
        var credentials = {
            appsecret: 'ecbc4e2a5bf3a874818cafcc96c266b7d96156cc',
            simple: {
                userid: 'setTopBoxClient',
                name: 'Liberty Global Set Top Box Client'
            }
        };
        MM.getToken(credentials,
            function (response) {
                var token = response.token;
                var userId = response.user.userid;
            }
        );
    }

    // Example code to create a session
    function createSession () {
        var newSessionData = {
            name: 'Change Set Top Box Channel',
            privacymode: 'inviteonly'
        };
        MM.activeUser.sessions.post(newSessionData,
            function onSessionCreated (response) {
                var sessionId = response.data.sessionid;
            },
            function onSessionCreatedError (error) {
                console.log('error creating session: ' + error.message);
            }
        )
    }

    // Example code to add a user to a session
    function addUserToSession () {
        var newInvitedUserData = {
            provider: 'simple',
            userid: 'setTopBoxClient',
            name: 'Liberty Global Set Top Box Client'
        };
        MM.activeSession.invitedusers.post(newInvitedUserData,
            function onUserInvited (response) {
                var invitedMindMeldUserId = response.data.userid;
            },
            function onUserInvitedError (error) {
                console.log('error inviting user: ' + error.message);
            }
        );
    }

}(jQuery, MM));