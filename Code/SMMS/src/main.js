import Vue from 'vue'
import App from './App.vue'
import router from './router'
//引入element
import ElementUI from 'element-ui';
//引入样式
import 'element-ui/lib/theme-chalk/index.css';

//引入重置样式
import './assets/reset.css';
import './assets/common.css';
//引入 echarts
import echarts from 'echarts'
 
Vue.prototype.echarts=echarts;
//引入样式
import axios from 'axios'
import Qs from 'qs'
import local from '@/utils/local'

Vue.prototype.axios=axios;
Vue.prototype.Qs=Qs;

//路由守卫 拦截所有路由
router.beforeEach((to,from,next)=>{
//获取token
let token=local.get("myToken");
if(token){
  next()//如果有token 放行
}else{
  if(to.path==='/login'){
      next()
  }else{
    next({path:'/login'})//如果去的是其他页面，直接跳转到登录页面。
  }
}

})

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
