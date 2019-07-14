<template>
  <div class="leftnav">
    <h3 class="title">
      <i class="el-icon-s-check"></i>
      后台管理系统
    </h3>
    <el-menu
      :default-active="$route.path"
      unique-opened
      active-text-color="rgb(64, 158, 255)"
      background-color="rgb(8, 3, 70)"
      router
    >
      <!-- 导航1 -->
      <el-submenu :index="(i+1)+'' " v-for="(v,i) in leftnav" :key="i">
        <template slot="title">
          <i :class="v.iconCls"></i>
          <span>{{v.navTitle}}</span>
        </template>

        <el-menu-item :index="v.path" v-for="(v,i) in v.children" :key="i">{{v.navSubTitle}}</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
//引入
import { getRole } from "@/api/account";
export default {
  data() {
    return {
      leftnav: []
    };
  },
  created() {
    getRole()
      .then(resp => {
        let { role } = resp;
        let nav = [
          //导航1
          {
            iconCls: "el-icon-location",
            navTitle: "账号管理",
            role: ["超级管理员"],
            children: [
              { path: "/home/accountmanage", navSubTitle: "账号管理" },
              { path: "/home/accountadd", navSubTitle: "账号添加" },
              { path: "/home/passwordmodify", navSubTitle: "密码修改" }
            ]
          },
          //导航2
          {
            iconCls: "el-icon-location",
            navTitle: "商品管理",
            role: ["超级管理员", "普通用户"],
            children: [
              { path: "/home/goodsmanage", navSubTitle: "商品管理" },
              { path: "/home/goodsadd", navSubTitle: "商品添加" }
            ]
          },
          //导航3
          {
            iconCls: "el-icon-location",
            navTitle: "统计管理",
            role: ["超级管理员"],
            children: [
              { path: "/home/selltotal", navSubTitle: "销售统计" },
              { path: "/home/stocktotal", navSubTitle: "进货统计" }
            ]
          },
          //导航4
          {
            iconCls: "el-icon-location",
            navTitle: "系统管理",
            role: ["超级管理员", "普通用户"],
            children: [{ path: "/home/systeminfo", navSubTitle: "系统信息" }]
          }
        ];
        this.leftnav=nav.filter(v=>v.role.includes(role))
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style lang="less">
@import "leftnav.less";
</style>