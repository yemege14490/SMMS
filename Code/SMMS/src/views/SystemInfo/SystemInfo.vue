<template>
  <div class="system-info">
    <el-card class="box-card">
      <!-- 头部信息 -->
      <div slot="header" class="clearfix">
        <h3>系统信息</h3>
      </div>
      <!-- 提示信息 -->
      <div class="item">
        <el-alert title="消息提示的文案" type="info" show-icon></el-alert>
        <el-alert title="成功提示的文案" type="success" show-icon></el-alert>
      </div>
      <!-- 左右 表格 -->
      <el-row :gutter="30">
        <!-- 左面板 -->
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <h3>销售排行</h3>
            </div>
            <div>
              <el-table :data="salesRank" style="width: 100%">
                <el-table-column prop="goodsName" label="商品名称" width="360"></el-table-column>
                <el-table-column prop="salesNum" label="销量" ></el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-col>
        <!-- 右面板 -->
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <h3>缺货的商品</h3>
            </div>
            <div>
                <el-table :data="Shortage" style="width: 100%">
                <el-table-column prop="goodsName" label="商品名称" width="200"></el-table-column>
                <el-table-column prop="salesNum" label="销量" ></el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
    data(){
        return{
            salesRank:[
                {goodsName:'零食',salesNum:10},
                {goodsName:'饮品',salesNum:20},
                {goodsName:'百货',salesNum:13},
                {goodsName:'酒水',salesNum:30},

            ],
            Shortage:[
                {goodsName:'我的优乐美',salesNum:0},

            ]
        }
    }
};
</script>

<style lang="less">
.system-info {
  .box-card {
    .el-card__header {
      background: #f1f1f1;
    }
    .el-card__body {
      .item {
        .el-alert {
          margin: 20px 0;
        }
      }
    }
  }
}
</style>