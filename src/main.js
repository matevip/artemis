import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import XEAjax from 'xe-ajax'
import './plugins'
import '@/layouts/export'
import '@/icons' // icon
import './plugins/utils'
import './plugins/table'

/**
 * @author pangu 7333791@qq.com
 * @description 生产环境默认都使用mock，如果正式用于生产环境时，记得去掉
 */

Vue.config.productionTip = false

new Vue({
  el: '#artemis',
  router,
  store,
  render: (h) => h(App),
})
