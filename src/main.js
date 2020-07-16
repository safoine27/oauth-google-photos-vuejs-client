import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import GAuth from 'vue-google-oauth2'
// import GAuth from './plugins/gAuth'
import installElement from './components/google-photos/libs/element/installElement.js'

Vue.config.productionTip = false

Vue.use(installElement)
console.log(process.env.VUE_GOOGLE_API_KEY);

Vue.use(GAuth, {
  clientId: process.env.VUE_APP_GOOGLE_API_KEY, scope: process.env.VUE_APP_GOOGLE_API_SCOPE, prompt: 'consent', fetch_basic_profile: false
})

new Vue({
  render: h => h(App),
}).$mount('#app')
