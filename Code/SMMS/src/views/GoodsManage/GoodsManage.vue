<template>
  <div class="goods-manage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h3>商品管理</h3>
      </div>
      <div class="item">
        <!-- 头部 -->
        <el-form :inline="true" size="small" :model="searchFrom" class="demo-form-inline">
          <el-form-item label="所属分类">
            <el-select v-model="searchFrom.category" placeholder="请选择分类">
              <el-option label="全部分类" value="全部分类"></el-option>
              <el-option label="电子类" value="电子类"></el-option>
              <el-option label="食品类" value="食品类"></el-option>
              <el-option label="烟酒类" value="烟酒类"></el-option>
              <el-option label="服装类" value="服装类"></el-option>
              <el-option label="蔬菜类" value="蔬菜类"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="关键字">
            <el-input v-model="searchFrom.keyword" placeholder="商品名称或条形码"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <!-- 表格 -->
        <el-table ref="goodsTableData" :data="goodsTableData" style="width: 100%"  @selection-change="selectChange">
          <!-- 选择框 -->
          <el-table-column type="selection" width="55"></el-table-column>
          <!-- 条形码 -->
          <el-table-column prop="barCode" label="商品条形码"></el-table-column>
          <!-- 名称 -->
          <el-table-column prop="goodsName" label="商品名称"></el-table-column>
          <!-- 所属分类 -->
          <el-table-column prop="category" label="所属分类"></el-table-column>
          <!-- 售价 -->
          <el-table-column prop="salePrice" label="售价"></el-table-column>
          <!-- 是否促销 -->
          <el-table-column prop="promotion" label="是否促销"></el-table-column>
          <!-- 日期 -->
          <el-table-column label="日期" width="120">
            <template slot-scope="scope">{{ scope.row.ctime | ctimefilter }}</template>
          </el-table-column>
          <!-- 管理 -->
          <el-table-column label="管理">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row.id)"></el-button>

              <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>

        <!-- 批量删除和取消 -->
        <div style="margin-top: 20px">
          <el-button type="danger" @click="batchDel">批量删除</el-button>
          <el-button type="success" @click="deselect">取消选择</el-button>
        </div>
        <!-- 编辑修改模态框 -->
        <el-dialog title="修改商品" width="440px" :visible.sync="visible">
          <el-form ref="editForm" :model="editForm" style="width:316px" :rules="rules">
            <el-form-item label="商品条形码" prop="barCode" label-width="120px">
              <el-input v-model="editForm.barCode" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="商品名称" prop="goodsName" label-width="120px">
              <el-input v-model="editForm.goodsName" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="所属分类" prop="category" label-width="120px">
              <el-select v-model="editForm.category" placeholder="请选择分类">
                <el-option label="全部分类" value="全部分类"></el-option>
                <el-option label="电子类" value="电子类"></el-option>
                <el-option label="食品类" value="食品类"></el-option>
                <el-option label="烟酒类" value="烟酒类"></el-option>
                <el-option label="服装类" value="服装类"></el-option>
                <el-option label="蔬菜类" value="蔬菜类"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="售价" prop="salePrice" label-width="120px">
              <el-input v-model="editForm.salePrice" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="是否促销" prop="promotion" label-width="120px">
              <el-radio-group v-model="editForm.promotion">
                <el-radio label="启用"></el-radio>
                <el-radio label="禁止"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="saveEdit">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
//引入moment
import moment from "moment";
import {
  getDataByPage,
  goodsedit,
  saveedit,
  goodsdel,
  batchDeletion
} from "@/api/goods";
export default {
  data() {
    return {
      rules: {
        category: [{ required: true, message: "不能为空", trigger: "change" }],
        barCode: [{ required: true, message: "不能为空", trigger: "blur" }],
        goodsName: [{ required: true, message: "不能为空", trigger: "blur" }],
        salePrice: [{ required: true, message: "不能为空", trigger: "blur" }],
        promotion: [{ required: true, message: "不能为空", trigger: "change" }]
      },
      goodsTableData: [],
      searchFrom: {
        category:"",
        keyword:""
      },
      editForm: {
        barCode: "",
        goodsName: "",
        category: "",
        salePrice: "",
        promotion: ""
      },
      delIdArr: [],
      editId: "",
      visible: false,
      currentPage: 1,
      total: 0, //数据总条数
      pageSize: 5 //每页多少条
    };
  },
  methods: {
    //取消批量删除
    deselect() {
      this.$refs.goodsTableData.clearSelection();
    },
    //批量删除
    batchDel() {
      //如果没选中
      if (this.delIdArr.length === 0) {
        this.$message.error("请选择删除信息");
        return false;
      }
      // 弹出模态框
      this.$confirm("确认批量删除该文件吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //发送请求
          batchDeletion({ idArr: this.delIdArr })
            .then(resp => {
              let { code, msg } = resp;
              if (code === 0) {
                this.$message({
                  message: msg,
                  type: "success"
                });
                this.getdata();
              } else {
                this.$message.error(msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 选项发生改变时
    selectChange(selectData) {
      this.delIdArr = selectData.map(v => v.id);
    },
    //编辑
    handleEdit(id) {
      //保留ID
      this.editId = id;
      //弹出模态框
      this.visible = true;
      //发送请求
      goodsedit({ id })
        .then(resp => {
          let { data } = resp;

          //回调表单
          this.editForm.barCode = data[0].barCode;
          this.editForm.goodsName = data[0].goodsName;
          this.editForm.category = data[0].category;
          this.editForm.salePrice = data[0].salePrice;
          this.editForm.promotion = data[0].promotion;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //保存
    saveEdit() {
      this.$refs.editForm.validate(valid => {
        // 所有前端验证通过 valid:true, 否则valid: false
        if (valid) {
          //隐藏模态框
          this.visible = false;
          //收集数据
          let params = {
            barCode: this.editForm.barCode,
            goodsName: this.editForm.goodsName,
            category: this.editForm.category,
            salePrice: this.editForm.salePrice,
            promotion: this.editForm.promotion,
            id: this.editId
          };
          saveedit(params)
            .then(resp => {
              let { code, msg } = resp;
              if (code === 0) {
                this.$message({
                  message: msg,
                  type: "success"
                });
                this.getdata();
              } else {
                this.$message.error(msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          return false;
        }
      });
    },
    //删除
    handleDelete(id) {
      this.$confirm("确认删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          goodsdel({ id }).then(resp => {
            let { code, msg } = resp;
            if (code === 0) {
              this.$message({
                message: msg,
                type: "success"
              });
              this.getdata();
            } else {
              this.$message.error(msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 查询
    onSubmit() {
      this.getdata()
    },
    //pagesize每页条数改变
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getdata();
    },
    //currentPage当前页改变
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getdata();
    },
    //分页函数
    getdata() {
      //获取参数
      let params = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        category:this.searchFrom.category,
        keyword:this.searchFrom.keyword
      };
      //发送请求
      getDataByPage(params)
        .then(resp => {
          let { data, total } = resp;
          //渲染
          this.total = total;
          this.goodsTableData = data;
          //判断
          if(this.goodsTableData.length===0&&this.currentPage!==1){
            this.currentPage -= 1;
            this.getdata()
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.getdata();
  },
  filters: {
    ctimefilter(ctime) {
      return moment(ctime).format("YYYY-MM-DD");
    }
  }
};
</script>

<style lang="less">
.goods-manage {
  .box-card {
    .el-card__header {
      background: #f1f1f1;
    }
    .el-card__body {
      .item {
        .el-table {
          border-top: 2px solid #ccc;
          margin-bottom: 20px;
        }
        .el-row {
          margin-bottom: 20px;
        }
      }
    }
  }
}
</style>