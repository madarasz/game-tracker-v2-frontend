import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Select Group',
      component: () => import(/* webpackChunkName: "selectGroup" */ './views/SelectGroup.vue')
    },
    {
      path: '/profile/:id/:username',
      name: 'Profile',
      component: () => import(/* webpackChunkName: "profile" */ './views/Profile.vue')
    },
    {
      path: '/group/:id/:groupname',
      name: 'Group details',
      component: () => import(/* webpackChunkName: "groupDetails" */ './views/GroupDetails.vue')
    },
    {
      path: '/group/:groupid/:groupname/:gameid/:gamename',
      name: 'Game details',
      component: () => import(/* webpackChunkName: "groupDetails" */ './views/GameDetails.vue')
    },
  ]
})
