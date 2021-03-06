function JanrainCapture(settings) {
    function init(settings) {
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
            returnExperienceNameMap: {'displayName': 'name'},

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

        settings = settings || {};
        janrain = window && window.janrain ? window.janrain : {};
        janrain.settings = merge_objects(janrainSettingsDefaults, settings.settings || {});
        janrain.settings.pubsub = settings.pubsub;
        janrain.settings.capture = merge_objects(janrainSettingsCaptureDefaults, settings.capture || {});
        janrain.settings.modalSelectors = merge_objects(settings.modalSelectors || {});

        if(!janrain.settings.pubsub && window && window.console && window.console.log){
            console.warn('Pubsub not set, please add pubsub to settings in janrain-capture');
            janrain.settings.pubsub = {
                publish: function(name, data){
                    console.log(name + ' event fired with no pubsub');
                },
                subscribe: function(name, meth){
                    console.log(name + ' event subscribed with no pubsub');
                },
            };
        }
        // copy necessary global level functions to window. These are needed for janrain to function.
        if(window){
            window.janrainReturnExperience = janrainReturnExperience;
            window.janrainCaptureWidgetOnLoad = janrainCaptureWidgetOnLoad;
        }

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

        janrain.settings.pubsub.subscribe('authn-logout', function(){
            janrain.capture.ui.endCaptureSession();
        });
        var janrainModalHTML = { gulp_inject: '../dist/janrain.html' };
        if(settings.useHTML || 1 && typeof janrainModalHTML === "string"){
            document.addEventListener('DOMContentLoaded', function () {
                document.body.innerHTML += janrainModalHTML;
            });
        }
        var janrainModalCSS = { gulp_inject: '../dist/janrain.css' };
        if(settings.useCSS || 1 && typeof janrainModalCSS === "string"){
            document.head.innerHTML += '<style>' + janrainModalCSS + '</style>';
        }
    }

    function merge_objects(obj1, obj2) {
        var obj3 = {};
        for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
        for (var attrnam in obj2) { obj3[attrnam] = obj2[attrnam]; }
        return obj3;
    }

    function janrainReturnExperience() {
        var data = {};
        var userData = janrain.settings.capture.returnExperienceUserData;
        for(var i=0; i<userData.length; i++){
            var datumName = userData[i];
            datumName = janrain.settings.capture.returnExpernienceNameMap[datumName] || datumName;
            data[datumName] = janrain.capture.ui.getReturnExperienceData(datumName);
        }
        janrain.settings.pubsub.publish("authn-login", data);
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
            janrain.settings.pubsub.publish("authn-anonymous");
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
            janrain.settings.pubsub.publish("login-modal-render-complete", janrainModalSelector);
        });

        janrain.events.onModalOpen.addHandler(function() {
            janrain.settings.pubsub.publish("login-modal-open", janrainModalSelector);
        });

        janrain.events.onModalClose.addHandler(function() {
            janrain.settings.pubsub.publish("login-modal-close", janrainModalSelector);
        });

        janrain.capture.ui.start();
        function openRegistrationHandler(evt){
            janrain.capture.ui.modal.open('traditionalRegistration');
        }
        var registrationElements = document.getElementsByClassName(janrain.settings.modalSelectors.registration);
        for(var i=0; i<registrationElements.length; i++){
            registrationElements[i].addEventListener('click', openRegistrationHandler);
            registrationElements[i].addEventListener('touchstart', openRegistrationHandler);
        }
    }

    init(settings);
}
