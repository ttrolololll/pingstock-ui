import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import moment from 'moment'

Vue.use(Buefy)
Vue.config.productionTip = false
Vue.prototype.$http = axios

Vue.filter('humanizedLocalTimeShort', function (value) {
  if (!value) return ''
  return moment(value).format('D MMM YYYY HH:mm:ss')
})

Vue.filter('toLocalTime', function (value) {
  if (!value) return ''
  return moment.utc(value).local()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
