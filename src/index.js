var pubsub = require('pubsub-js');

module.exports = {
    hello: function() {
        return 'Hello, world!';
    },
    init: function(settings, captureSettings) {
        var janrainSettingsDefaults = {
            packages: ['login', 'capture', 'share'],
            appUrl: '',
            language: 'en-US',
            tokenUrl: '',
            tokenAction: 'event',
            borderColor: '#000000',
            fontFamily: 'sans-serif',
            width: 400,
            actionText: ' ',
            providers: ['facebook', 'twitter', 'googleplus', 'yahoo'],
            providersPerPage: '4',
            format: 'one column',
            loadurlHttps: "",
            loadurlHttp: "",
        };

        var janrainSettingsCaptureDefaults = {
            appId: '',
            captureServer: '',
            redirectUri: 'http://localhost/',
            clientId: '',
            registerFlow: 'socialRegistration',
            setProfileCookie: false,
            modalCloseHtml: '<span class="authn-close-modal">x</span>',
            noModalBorderInlineCss: true,
            keepProfileCookieAfterLogout: false,
            flowVersion: 'HEAD',
            responseType: 'token',
            returnExperienceUserData: ['displayName', 'email', 'uuid'],

            federate: false,
            federateServer: '',
            federateXdReceiver: '',
            federateLogoutUri: '',
            federateLogoutCallback: function() {},
            federateEnableSafari: false,

            recaptchaPublicKey: 'abcdefghijklmnopqrstuvwxyz1234567890ABCD',
            flowName: 'standard_newspaper',
            mobileStylesheets: [],
            setProfileData: '',
            stylesheets: [],
            confirmModalClose: '',
        };

        janrain.settings = merge_objects(janrainSettingsDefaults, settings || {});
        janrain.settings.capture = merge_objects(janrainSettingsCaptureDefaults, captureSettings || {});

        var e = document.createElement('script');
        e.type = 'text/javascript';
        e.id = 'janrainAuthWidget';
        if (document.location.protocol === 'https:') {
            e.src = janrain.settings.loadurlHttps;
        } else {
            e.src = janrain.settings.loadurlHttp;
        }
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(e, s);

        pubsub.subscribe('authn-logout', function(){
            janrain.capture.ui.endCaptureSession();
        });
    }
};

function janrainReturnExperience() {
    var data = {
        'name': janrain.capture.ui.getReturnExperienceData("displayName"),
        'email': janrain.capture.ui.getReturnExperienceData("email"),
        'uuid': janrain.capture.ui.getReturnExperienceData("uuid"),
    };
    pubsub.publish("authn-login", data);
}

function merge_objects(obj1, obj2) {
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}

function janrainCaptureWidgetOnLoad() {
    var janrainModalSelector = "#janrainModal";

    janrain.events.onCaptureLoginSuccess.addHandler(function(result) {
        janrain.capture.ui.modal.close();
        if (window.console && window.console.log)
            console.log('janrain.onCaptureLoginSuccess: ' + result) ;
        janrainReturnExperience();
    });

    janrain.events.onCaptureSessionFound.addHandler(function(result) {
        janrain.capture.ui.modal.close();
        if (window.console && window.console.log)
            console.log('janrain.onCaptureSessionFound: ' + result);
        janrainReturnExperience();
    });

    janrain.events.onCaptureSessionNotFound.addHandler(function(result) {
        pubsub.publish("authn-anonymous");
    });

    janrain.events.onCaptureRegistrationSuccess.addHandler(function(result) {
        janrain.capture.ui.modal.close();
        if (window.console && window.console.log)
            console.log('janrain.onCaptureRegistrationSuccess: ' + result);
    });

    janrain.events.onCaptureScreenShow.addHandler(function(result) {
        if (window.console && window.console.log)
            console.log('janrain.onCaptureScreenShow: ' + result);
        if (result.screen == "returnTraditional") {
            janrainReturnExperience();
        }
    });

    janrain.events.onCaptureRenderComplete.addHandler(function(result) {
        if (window.console && window.console.log)
            console.log('janrain.onCaptureRenderComplete: ' + result);
        pubsub.publish("login-modal-render-complete", janrainModalSelector);
    });

    janrain.events.onModalOpen.addHandler(function() {
        pubsub.publish("login-modal-open", janrainModalSelector);
    });

    janrain.events.onModalClose.addHandler(function() {
        pubsub.publish("login-modal-close", janrainModalSelector);
    });

    janrain.capture.ui.start();
    function openRegistrationHandler(evt){
        janrain.capture.ui.modal.open('traditionalRegistration');
    }
    var registrationElements = document.getElementsByClassName("capture_modal_registration");
    for(var i=0; i<registrationElements.length; i++){
        registrationElements[i].addEventListener('click', openRegistrationHandler);
        registrationElements[i].addEventListener('touchstart', openRegistrationHandler);
    }
}
