import Vue from 'vue'
import VueRouter from 'vue-router'
import 'element-ui/lib/theme-default/index.css'
import Log from './page/Log'
import PerfList from './page/Perf/List'
import PerfUser from './page/Perf/User'
import PerfDataNameList from './page/Perf/Data/NameList'
import Login from './page/Login'
import './style/theme/index.css';
import './style/index.scss';
import '../node_modules/font-awesome/scss/font-awesome.scss';
import ElementUI from 'element-ui'
import UserService from 'service/user';

Vue.use(VueRouter)

Vue.use(ElementUI)

const routes = [
  { path: '/log/:page', name: 'log', component: Log },
  { path: '/log', name: 'logIndex', component: Log },
  { path: '/login', name: 'login', component: Login },
  { path: '/perf/list', name: 'perfList', component: PerfList },
  { path: '/perf/detail/:id/user', name: 'PerfUser', component: PerfUser },
  { path: '/perf/detail/:id/data/namelist', name: 'PerfDataNameList', component: PerfDataNameList },
]

// 3. 创建 router 实例，然后传 `routes` 配置
const router = new VueRouter({
    mode: 'history',
    routes
})

router.beforeEach((to, from, next) => {
  if (to.name === 'login' || UserService.User) {
     next();
  } else {
    next('login');    
  }
})

Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = binding.value
  }
})

new Vue({
    router
}).$mount('#app')
