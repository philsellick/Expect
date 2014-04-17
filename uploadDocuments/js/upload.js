(function (MM, _, CHANNELS) {

    var config = {
        appid: '367b243585deec5d6c5b6444d43f0c495fa7d0df',
        onInit: onMMInit
    };
    // Initialize MM SDK
    MM.init(config);


    function onMMInit () {
        MM.setToken('66c59105e576c254aff23332ff881bc17ab413fa',
            function onTokenValid () {
                console.log('token valid');
//                uploadDocuments(CHANNELS);
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