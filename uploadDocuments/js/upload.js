(function (MM, _, CHANNELS) {

    var config = {
        appid: '0627e108ccbc4ae191009296ea38235f34778405',
        onInit: onMMInit
    };
    // Initialize MM SDK
    MM.init(config);


    function onMMInit () {
        MM.setToken('1f9920e8a07a714ce14522b686c97844ff993f35',
            function onTokenValid () {
                console.log('token valid');
        //       uploadDocuments(CHANNELS);
            },
            function onTokenInvalid() {
                console.log('token invalid');
            }
        );
    }

    function uploadDocuments (documents) {
        console.log('preparing to upload ' + documents.length + ' documents');
        _.forEach(documents,
            function (document) {
                MM.callApi('POST', 'documents', document,
                    function success (response) {
                        console.log('uploaded document with id: ' + response.data.documentid);
                    },
                    function error (error) {
                        console.log('error uploading document: ' + JSON.stringify(error));
                    }
                );
            }
        );
    }

}(MM, _, CHANNELS));