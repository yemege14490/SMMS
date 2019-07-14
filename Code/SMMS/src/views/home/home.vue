<template>
  <div class="home">
    <el-container>
      <!-- 左侧栏 -->
      <el-aside width="200px">
        <!-- 引入 -->
        <leftnav></leftnav>
      </el-aside>
      <!-- 右侧栏 -->
      <el-container>
        <!-- 上 -->
        <el-header>
            <RightHeader ref="header"></RightHeader>
        </el-header>
        <!-- 中 -->
        <el-main>
          <!-- 路由出口 -->
          <router-view @a="b"></router-view>
        </el-main>
        <!-- 下 -->
        <el-footer>
          <RightFooter></RightFooter>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import RightHeader from '@/components/RightHeader/RightHeader.vue'
import RightFooter from '@/components/RightFooter/RightFooter.vue'
import leftnav from '@/components/leftnav/leftnav.vue'
export default {
  components:{
    leftnav,
    RightFooter,
    RightHeader
  },
  methods:{
    b(){
      this.$refs.header.getUserInfo()
    }
  }
};
</script>

<style lang="less">
@import "./home.less";
</style>