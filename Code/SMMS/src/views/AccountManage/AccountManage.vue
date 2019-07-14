<template>
  <div class="account-manage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h3>账号管理</h3>
      </div>
      <div class="formTable">
        <!-- 表格 -->
        <el-table
          ref="tableData"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="selectChange"
        >
          <!-- 选择框 -->
          <el-table-column type="selection" width="55"></el-table-column>
          <!-- 账号 -->
          <el-table-column prop="username" label="账号"></el-table-column>
          <!-- 用户组 -->
          <el-table-column prop="userGroup" label="用户组"></el-table-column>
          <!-- 日期 -->
          <el-table-column label="日期">
            <template slot-scope="scope">{{ scope.row.ctime | filterCtime }}</template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- 编辑 -->
              <el-button size="mini" type="primary" @click="handleEdit(scope.row.id)">
                <i class="el-icon-edit"></i>
                编辑
              </el-button>
              <!-- 删除 -->
              <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">
                <i class="el-icon-delete"></i>
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div style="margin-top:20px">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[3, 5, 7, 9]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
        <!-- 批量删除和取消 -->
        <div style="margin-top: 20px">
          <el-button type="danger" @click="batchDel">批量删除</el-button>
          <el-button type="success" @click="deselect">取消选择</el-button>
        </div>
        <!-- 编辑修改模态框 -->
        <el-dialog title="修改账号" width="440px" :visible.sync="visible">
          <el-form ref="editForm" :model="editForm" style="width:316px" :rules="rules">
            <el-form-item label="账号" prop="username" label-width="120px">
              <el-input v-model="editForm.username" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="用户分组" prop="userGroup" label-width="120px">
              <el-select v-model="editForm.userGroup" placeholder="请选择用户分组">
                <el-option label="超级管理员" value="超级管理员"></el-option>
                <el-option label="普通用户" value="普通用户"></el-option>
              </el-select>
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
//引入
import moment from "moment";
import {batchDeletion,accountedit,saveedit,accountdel,accountlistByPage} from '@/api/account'
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      total: 0, //数据总条数
      pageSize: 3, //每页多少条
      visible: false,
      editId: "",
      editForm: {
        username: "",
        userGroup: ""
      },
      delIdArr: [],

      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" }, // 非空验证
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" } // 长度验证
        ]
      }
    };
  },
  methods: {
    //批量删除
    batchDel() {
      //如果没选中
      if(this.delIdArr.length===0){
         this.$message.error('请选择删除信息');
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
          batchDeletion({idArr: this.delIdArr})
            .then(resp => {
              let { code, msg } = resp;
              if (code === 0) {
                this.$message({
                  message: msg,
                  type: "success"
                });
                this.getaccountByPage()
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
    //取消批量删除
    deselect() {
      this.$refs.tableData.clearSelection();
    },
    // 编辑
    handleEdit(id) {
      //保留ID
      this.editId = id;
      //弹出模态框
      this.visible = true;
      //发送请求
     accountedit({id})
        .then(resp => {
          let { data } = resp;
          
          //回调表单
          this.editForm.username = data[0].username;
          this.editForm.userGroup = data[0].userGroup;
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
            username: this.editForm.username,
            userGroup: this.editForm.userGroup,
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
                this.getaccountByPage();
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
          accountdel({id})
            .then(resp => {
              let { code, msg } = resp;
              if (code === 0) {
                this.$message({
                  message: msg,
                  type: "success"
                });
                this.getaccountByPage();
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
    //pagesize每页条数改变
    handleSizeChange(pageSize) {
      this.pageSize=pageSize;
      this.getaccountByPage()
    },
    //currentPage当前页改变
    handleCurrentChange(currentPage) {
      this.currentPage=currentPage;
      this.getaccountByPage()
      
    },
    //按照分页请求数据
    getaccountByPage(){
      //收集参数
      let params={
            pageSize:this.pageSize,
            currentPage:this.currentPage
      }
      accountlistByPage(params)
        .then(resp => {
          //接收后端响应数据
          let {data,total}=resp;
          //渲染
          this.total=total;
          this.tableData=data
          
          //判断
          if(this.tableData.length===0&&this.currentPage!==1){
            this.currentPage -= 1;
            this.getaccountByPage()
          }

        })
        .catch(err => {
          console.log(err);
        });
    }
    //刷新
    // getaccount() {
    //   this.axios
    //     .get("http://127.0.0.1:3000/account/accountlist")
    //     .then(resp => {
    //       var { data } = resp.data;
    //       this.tableData = data;
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // }
  },
  created() {
    this.getaccountByPage();
  },
  filters: {
    filterCtime(ctime) {
      return moment(ctime).format("YYYY-MM-DD hh:mm:ss");
    }
  }
};
</script>

<style lang="less">
.account-manage {
  .box-card {
    .el-card__header {
      background: #f1f1f1;
    }
    // .el-card__body{

    // }
  }
}
</style>