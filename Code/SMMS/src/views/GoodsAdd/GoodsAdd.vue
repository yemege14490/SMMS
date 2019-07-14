<template>
  <div class="goods-add">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h3>商品添加</h3>
      </div>
      <div class="item">
        <el-form
          style="width:400px"
          :model="goodsAddForm"
          status-icon
          :rules="rules"
          ref="goodsAddForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="所属分类" prop="category">
            <el-select v-model="goodsAddForm.category" placeholder="请选择分类">
              <el-option label="电子类" value="电子类"></el-option>
              <el-option label="食品类" value="食品类"></el-option>
              <el-option label="烟酒类" value="烟酒类"></el-option>
              <el-option label="蔬菜类" value="蔬菜类"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="tiaoxing" label="商品条形码" prop="barCode">
            <el-input v-model.number="goodsAddForm.barCode"></el-input>
            <!-- <el-button type="success">生成条形码</el-button> -->
          </el-form-item>

          <el-form-item label="商品名称" prop="goodsName">
            <el-input type="text" v-model="goodsAddForm.goodsName"></el-input>
          </el-form-item>

          <el-form-item label="商品售价" prop="salePrice">
            <el-input type="text" v-model="goodsAddForm.salePrice"></el-input>
          </el-form-item>

          <el-form-item label="市场价" prop="marketPrice">
            <el-input type="text" v-model="goodsAddForm.marketPrice"></el-input>
          </el-form-item>

          <el-form-item label="商品进价" prop="costPrice">
            <el-input type="text" v-model="goodsAddForm.costPrice"></el-input>
          </el-form-item>

          <el-form-item label="入库数量" prop="stockCount">
            <el-input type="text" v-model="goodsAddForm.stockCount"></el-input>
          </el-form-item>

          <el-form-item label="商品重量" prop="goodsWeight">
            <el-input type="text" v-model="goodsAddForm.goodsWeight"></el-input>
          </el-form-item>

          <el-form-item label="商品单位" prop="goodsUnit">
            <el-input type="text" v-model="goodsAddForm.goodsUnit"></el-input>
          </el-form-item>

          <el-form-item label="会员优惠" prop="vipDiscount">
            <el-radio-group v-model="goodsAddForm.vipDiscount">
              <el-radio label="享受"></el-radio>
              <el-radio label="不享受"></el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="是否促销" prop="promotion">
            <el-radio-group v-model="goodsAddForm.promotion">
              <el-radio label="启用"></el-radio>
              <el-radio label="禁止"></el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="商品简介" prop="goodsDesc">
            <el-input type="textarea" v-model="goodsAddForm.goodsDesc"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="success" @click="submitForm('goodsAddForm')">立即创建</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
//引入
import {goodsAdd} from '@/api/goods'
export default {
  data() {
    return {
      goodsAddForm: {
        category: "",
        barCode: "",
        goodsName: "",
        salePrice: "",
        marketPrice: "",
        costPrice: "",
        stockCount: "",
        goodsWeight: "",
        goodsUnit: "",
        vipDiscount: "",
        promotion: "",
        goodsDesc: ""
      },
      rules: {
        category: [{ required: true, message: "不能为空", trigger: "change" }],
        barCode: [{ required: true, message: "不能为空", trigger: "blur" }],
        goodsName: [{ required: true, message: "不能为空", trigger: "blur" }],
        salePrice: [{ required: true, message: "不能为空", trigger: "blur" }],
        marketPrice: [{ required: true, message: "不能为空", trigger: "blur" }],
        costPrice: [{ required: true, message: "不能为空", trigger: "blur" }],
        stockCount: [{ required: true, message: "不能为空", trigger: "blur" }],
        goodsWeight: [{ required: true, message: "不能为空", trigger: "blur" }],
        goodsUnit: [{ required: true, message: "不能为空", trigger: "blur" }],
        vipDiscount: [
          { required: true, message: "不能为空", trigger: "change" }
        ],
        promotion: [{ required: true, message: "不能为空", trigger: "change" }],
        goodsDesc: [{ required: true, message: "不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //收集参数
          let params = {
            category: this.goodsAddForm.category,
            barCode: this.goodsAddForm.barCode,
            goodsName: this.goodsAddForm.goodsName,
            salePrice: this.goodsAddForm.salePrice,
            marketPrice: this.goodsAddForm.marketPrice,
            costPrice: this.goodsAddForm.costPrice,
            stockCount: this.goodsAddForm.stockCount,
            goodsWeight: this.goodsAddForm.goodsWeight,
            goodsUnit: this.goodsAddForm.goodsUnit,
            vipDiscount: this.goodsAddForm.vipDiscount,
            promotion: this.goodsAddForm.promotion,
            goodsDesc: this.goodsAddForm.goodsDesc
          };
          //发送请求
          goodsAdd(params)
            .then(resp => {
              let { code, msg } = resp;
              if (code === 0) {
                this.$message({
                  message: msg,
                  type: "success"
                });
                this.$router.push('/home/goodsmanage')
              } else {
                this.$message.error(msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less">
.goods-add {
  .box-card {
    .el-card__header {
      background: #f1f1f1;
    }
    .el-card__body {
      .item {
        .el-form {
          .tiaoxing {
            .el-button {
              display: inline-block !important;
              margin-left: 20px;
            }
            .el-form-item__content {
              width: 440px;
              .el-input {
                width: 300px;
              }
            }
          }
        }
      }
    }
  }
}
</style>