<template>
  <div class="account-add">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h3>账号添加</h3>
      </div>
      <div class="frombox">
        <el-form
          style="width:400px"
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="选择用户组" prop="userGroup">
            <el-select v-model="ruleForm.userGroup" placeholder="选择用户组">
              <el-option label="超级管理员" value="超级管理员"></el-option>
              <el-option label="普通用户" value="普通用户"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm()">提交</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
//引入工具函数
import { pwdreg } from "@/utils/reg.js";
import { accountAdd, checkUser } from "@/api/account";
export default {
  data() {
    //账号验证
    const checkUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("账号不能为空"));
      } else {
        checkUser({ username: value })
          .then(resp => {
            let { code, msg } = resp;
            if (code === 1) {
              callback(new Error("账号已存在"));
            } else if (code === 0) {
              callback();
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    };
    //密码验证
    const checkPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else if (!pwdreg(value)) {
        callback(new Error("长度8~16位,至少1个大写字母，1个小写字母和1个数字"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    //确认密码
    const confirmPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        username: "",
        password: "",
        checkPass: "",
        userGroup: ""
      },
      rules: {
        username: [
          { validator: checkUsername, required: true, trigger: "blur" }, // 非空验证
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" } // 长度验证
        ],
        password: [{ required: true, validator: checkPwd, trigger: "blur" }],
        checkPass: [{ required: true, validator: confirmPwd, trigger: "blur" }],
        userGroup: [
          { required: true, message: "请输入账号", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        // 所有前端验证通过 valid:true, 否则valid: false
        if (valid) {
          //收集数据
          let params = {
            username: this.ruleForm.username,
            password: this.ruleForm.password,
            userGroup: this.ruleForm.userGroup
          };
          accountAdd(params)
            .then(resp => {
              let { code, msg } = resp;

              if (code === 0) {
                this.$message({
                  message: msg,
                  type: "success"
                });
                this.$router.push("/home/accountmanage");
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
    resetForm() {
      this.$refs.ruleForm.resetFields(); // 调用表单重置方法
    }
  }
};
</script>

<style lang="less">
.account-add {
  .box-card {
    .el-card__header {
      background: #f1f1f1;
    }
    // .el-card__body {
    // }
  }
}
</style>