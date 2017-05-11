import Vue from 'vue'
import VueRouter from 'vue-router'
import 'element-ui/lib/theme-default/index.css'
import Log from './page/Log'
import Perf from './page/Perf'
import PerfList from './page/Perf/List'
import PerfUser from './page/Perf/User'
import PerfDataTargetList from './page/Perf/Data/TargetList'
import PerfDataTargetTable from './page/Perf/Data/TargetTable'
import PerfDataTargetData from './page/Perf/Data/TargetData'
import PerfDataQuickTable from './page/Perf/QuickTables'
import PerfInfo from './page/Perf/Info'
import Login from './page/Login'
import './style/theme/index.css';
import './style/index.scss';
import '../node_modules/font-awesome/scss/font-awesome.scss';
import ElementUI from 'element-ui'
import UserService from 'service/user';

Vue.use(VueRouter)

Vue.use(ElementUI)

const routes = [{
  path: '/',
  redirect: {
    name: 'log'
  }
},
{
  path: '/log/:page',
  name: 'log',
  component: Log
},
{
  path: '/log',
  name: 'logIndex',
  component: Log
},
{
  path: '/login',
  name: 'login',
  component: Login
},
{
  path: '/register',
  name: 'register',
  component: Login
},
{
  path: '/perf/detail/:id/index',
  name: 'Perf',
  component: Perf
},
{
  path: '/perf/list',
  name: 'perfList',
  component: PerfList
},
{
  path: '/perf/detail/:id/user',
  name: 'PerfUser',
  component: PerfUser
},
{
  path: '/perf/detail/:id/targetList',
  name: 'PerfDataTargetList',
  component: PerfDataTargetList
},
{
  path: '/perf/detail/:id/targetTable',
  name: 'PerfDataTargetTable',
  component: PerfDataTargetTable
},
{
  path: '/perf/detail/:id/TargetData',
  name: 'PerfDataTargetData',
  component: PerfDataTargetData
},
{
  path: '/perf/detail/:id/quickTable',
  name: 'PerfDataQuickTable',
  component: PerfDataQuickTable
},
{
  path: '/perf/detail/:id/info',
  name: 'PerfInfo',
  component: PerfInfo
},
]

// 3. 创建 router 实例，然后传 `routes` 配置
const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name === 'login' || to.name === 'register' || UserService.User) {
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

window.addEventListener('load', () => {
  const response = performance.timing.responseEnd - performance.timing.responseStart;
  console.log('timing.response', response);
  const load = performance.timing.loadEventStart - performance.timing.navigationStart;
  console.log('timing.load', load, performance.timing.loadEventStart, performance.timing.navigationStart);
})
