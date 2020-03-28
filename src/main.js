
import Vue from 'vue'
import App from './App.vue'
import router from './router'

import Client from "@/js/client.js";

import './../node_modules/bulma/css/bulma.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faLock, faCog, faImage, faCheck, faCommentAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

//import Client from '@/js/client.js'

library.add(faUser, faLock, faCog, faImage, faCheck, faCommentAlt)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = true

// set version :
localStorage.version = "beta_1.8.0";
window.canUseCordova = false;

// add device ready event
document.addEventListener("deviceready", onDeviceReady, false);

new Vue({
    el: '#app',
    render: h => h(App),
    router,
    components: { App },
    templat: '<App/>'
}).$mount('#app')



router.push('Login');

function onDeviceReady() {

    // now we can use cordova...
    window.canUseCordova = true;
    console.log("device is ready");

    try {
        // download update if needed
        window.codePush.sync();
    }
    catch (ex) {
        console.error(ex);
    }



    const push = window.PushNotification.init({
        android: {
            forceShow: true,
            sound: true,
            vibrate: true,
        },
        ios: {
            alert: "true",
            badge: "true",
            sound: "true"
        },
        windows: {}
    });


    // error reporting ...

    var Sentry = window.cordova.require("sentry-cordova.Sentry");
    Sentry.init({
        dsn: 'https://dda71e2808bc446bbc6106d5aef89a95@sentry.io/4954703',
        release: 'cchatvue@' + localStorage.version
    });



    push.on('notification', (data) => {
        console.log("data :", data);
        // data.message,
        // data.title,
        // data.count,
        // data.sound,
        // data.image,
        // data.additionalData

        window.cordova.plugins.notification.local.schedule({
            title: data.title,
            text: data.message,
            foreground: true
        });
    });

    push.on('registration', (data) => {
        // data.registrationId
        localStorage.firebaseID = data.registrationId;
        if (localStorage.getItem("username") !== null) {
            console.log("Registration id push : " + data.registrationId + " for " + localStorage.username);
            Client.connect(data.registrationId);
            window.AppCenter.Analytics.trackEvent('Registration : ', { ID: data.registrationId, type: data.registrationType });
        }
    });

    push.on('error', function (e) {
        console.log(e.message)
        window.AppCenter.Analytics.trackEvent('Push error : ', { error: e });
    });

    // app center analytics result
    var success = function () {
        console.log("Event tracked : AppCenter is correctly enabled !!");
    }

    var error = function (error) {
        console.error(error);
    }

    // Track app started event (check if app center is working ...)
    window.AppCenter.Analytics.trackEvent('App started', { User: localStorage.username, version: localStorage.version }, success, error);


    console.log("Device ready end");
}