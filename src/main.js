import Vue from 'vue'
import VueRouter from 'vue-router'
import 'element-ui/lib/theme-default/index.css'
import Log from './page/Log'
import './style/theme/index.css';
import './style/index.scss';
import '../node_modules/font-awesome/scss/font-awesome.scss';
import ElementUI from 'element-ui'

Vue.use(VueRouter)

Vue.use(ElementUI)

const routes = [
  { path: '/log/:page', name: 'log', component: Log },
 
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
    mode: 'history',
    routes // （缩写）相当于 routes: routes
})

new Vue({
    router
}).$mount('#app')
