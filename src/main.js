import Vue from 'vue'
import VueRouter from 'vue-router'
import 'element-ui/lib/theme-default/index.css'
import Log from './page/Log'
import Perf from './page/Perf'
import Login from './page/Login'
import './style/theme/index.css';
import './style/index.scss';
import '../node_modules/font-awesome/scss/font-awesome.scss';
import ElementUI from 'element-ui'

Vue.use(VueRouter)

Vue.use(ElementUI)

const routes = [
  { path: '/log/:page', name: 'log', component: Log },
  { path: '/perf/index', name: 'perfIndex', component: Perf },
  { path: '/login', name: 'login', component: Login },
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
    mode: 'history',
    routes
})

Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = binding.value
  }
})

new Vue({
    router
}).$mount('#app')
