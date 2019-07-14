<template>
  <div class="sell-total">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>销售数据统计</span>
        <el-button type="primary" style="margin-left:30px" size="mini" @click="getData">加载新数据</el-button>
      </div>
      <div>
        <!-- 准备一个容器 -->
        <div id="sellCharts" style="height:400px"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
//引入
import { getSellData } from "@/api/goods";
export default {
  data() {
    return {
      xData: ["06-02", "06-03", "06-04", "06-05", "06-06", "06-07", "06-08"],
      seriesData: [100, 300, 800, 600, 1290, 1330, 1320]
    };
  },
  methods: {
    //重新加载数据
    getData() {
      getSellData()
        .then(resp => {
          let { xData, seriesData } = resp;
          //渲染
          this.xData = xData;
          this.seriesData = seriesData;
          //配置
          var option = {
            xAxis: {
              type: "category",
              data: this.xData
            },
            yAxis: {
              type: "value"
            },
            series: [
              {
                data: this.seriesData,
                type: "bar"
              }
            ]
          };

          //调用
          this.drawCharts(option);
        })
        .catch(err => {
          console.log(err);
        });
    },

    //生成报表
    drawCharts(option) {
      //初始化报表
      var sellCharts = this.echarts.init(document.getElementById("sellCharts"));

      //使用配置生成报表
      sellCharts.setOption(option);
    }
  },
  mounted() {
    //写配置
    var option = {
      //X轴
      xAxis: {
        type: "category",
        data: this.xData
      },
      //Y轴
      yAxis: {
        type: "value"
      },
      //核心数据
      series: [
        {
          data: this.seriesData,
          type: "line"
        }
      ]
    };
    this.drawCharts(option);
  }
};
</script>

<style lang="less">
</style>