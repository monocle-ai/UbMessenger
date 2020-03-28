import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)


import Login from '@/components/Login.vue'
import ConversationsList from '@/components/ConversationsList.vue'
import ConversationView from '@/components/ConversationView.vue'

import Settings from '@/components/Settings.vue'
import ConvSettings from '@/components/ConvSettings.vue'

const routes = [
  {
    path: '/Login',
    name: 'Login',
    //render: h => h(Login),
    component: Login
  },
  {
    path: '/',
    name: 'ConvList',
    component: ConversationsList
  },
  {
    path: '/ConvView',
    name: 'ConvView',
    component: ConversationView
  },
  {
    path: '/Settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/ConvSettings',
    name: 'ConvSettings',
    component: ConvSettings
  }
]

export default new VueRouter({
  routes // short for `routes: routes`
})
