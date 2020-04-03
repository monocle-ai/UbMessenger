
import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './../node_modules/bulma/css/bulma.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faLock, faCog, faImage, faCheck, faCommentAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

//import Client from '@/js/client.js'

library.add(faUser, faLock, faCog, faImage, faCheck, faCommentAlt)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = true

// set version :
localStorage.version = "beta_1.0.4";
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
}