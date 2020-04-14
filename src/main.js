
import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './../node_modules/bulma/css/bulma.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faLock, faCog, faImage, faCheck, faCommentAlt, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

//import Client from '@/js/client.js'

library.add(faUser, faLock, faCog, faImage, faCheck, faCommentAlt, faSearch)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = true

// set version :
localStorage.version = "beta_1.0.6";
window.canUseCordova = false;

// add sentry
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

Sentry.init({
  dsn: 'https://ddb005b4671e4d48a842a640c1bf9511@o365101.ingest.sentry.io/5199799',
  integrations: [new Integrations.Vue({Vue, attachProps: true, logErrors:true})],
});

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
}