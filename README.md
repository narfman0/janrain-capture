Janrain Capture
===============

Configurable support and markup for janrain capture widget/modals

Installation
------------

    npm install -D janrain-capture

Settings
--------

This library will create a JanrainCapture object. The constructor expects some
settings to work.

pubsub: amplify or any other pubsub should work fine

settings: object with tokenUrl, loadoutUrlHttp, and loadoutUrlHttps to inject your javascript

capture: object with appId, captureServer, and clientId

Optional:

modalSelectors: What class names your registration/signin modals should use

useHTML: Should we inject the modals via bundles js, true by default. Change this if you
already have markup embedded on your page.

useCSS: Should we inject the modal styling via js, true by default.

Example
-------

    JanrainCapture({
        pubsub: amplify,
        settings: {
            tokenUrl: 'http://www.yourbrand.com/',
            loadurlHttps: "https://rpxnow.com/load/yourbrand",
            loadurlHttp: "http://widget-cdn.rpxnow.com/load/yourbrand",
        },
        capture: {
            appId: 'asdf1234asd123asd',
            captureServer: 'https://users.yourbrand.com',
            clientId: 'asdlkj123908qwepoi',
        },
    });

License
-------

Copyright (c) 2016 Jon Robison

See included LICENSE for licensing information
