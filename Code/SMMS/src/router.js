import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: () => import('./views/login/login.vue') },
    {
      path: '/home', component: () => import('./views/home/home.vue'),
      redirect: './home/systeminfo',
      children:[
         // 系统信息
         {
          path: '/home/systeminfo',
          component: () => import('./views/SystemInfo/SystemInfo.vue'),
        },
        // 账号管理
        {
          path: '/home/accountmanage',
          component: () => import('./views/AccountManage/AccountManage.vue'),
        },
        {
          path: '/home/accountadd',
          component: () => import('./views/AccountAdd/AccountAdd.vue'),
        },
        {
          path: '/home/passwordmodify',
          component: () => import('./views/PasswordModify/PasswordModify.vue'),
        },
        // 商品管理
        {
          path: '/home/goodsmanage',
          component: () => import('./views/GoodsManage/GoodsManage.vue'),
        },
        {
          path: '/home/goodsadd',
          component: () => import('./views/GoodsAdd/GoodsAdd.vue'),
        },
        // 统计管理
        {
          path: '/home/selltotal',
          component: () => import('./views/SellTotal/SellTotal.vue'),
        },
        {
          path: '/home/stocktotal',
          component: () => import('./views/StockTotal/StockTotal.vue'),
        },
        //个人中心
        {
          path: '/home/personal',
          component: () => import('./views/personal/personal.vue'),
        },
      ]
    },
  ]
})
