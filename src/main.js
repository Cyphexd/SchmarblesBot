import Vue from 'vue'
import App from './App.vue'
import router from "./router"
import VueSimpleAlert from 'vue-simple-alert';

Vue.config.productionTip = false
Vue.use(VueSimpleAlert);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
