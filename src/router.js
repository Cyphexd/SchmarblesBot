import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    mode: 'hash',
    routes: [
        {
            path: '/',
            name: 'login',
            component: require('@/components/Login').default
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: require('@/components/Dashboard').default
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
});