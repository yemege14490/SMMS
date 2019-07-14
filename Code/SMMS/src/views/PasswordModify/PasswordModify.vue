<template>
  <div class="password-modify">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h3>修改账号密码</h3>
      </div>
      <div class="item">
        <el-form
          style="width:400px"
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <!-- 原密码 -->
          <el-form-item label="原密码" prop="oldPassword">
            <el-input type="password" v-model="ruleForm.oldPassword" autocomplete="off"></el-input>
          </el-form-item>
          <!-- 新密码 -->
          <el-form-item label="新密码" prop="newPass">
            <el-input type="password" v-model="ruleForm.newPass" autocomplete="off"></el-input>
          </el-form-item>
          <!-- 确认新密码 -->
          <el-form-item label="确认新密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm()">确认修改</el-button>
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
import { checkOldPwd, modifyPassword } from "@/api/account";
import local from  '@/utils/local'
export default {
  data() {
    //原密码
    let oldPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("原密码不能为空"));
      } else if (!pwdreg(value)) {
        callback(new Error("长度8~16位,至少1个大写字母，1个小写字母和1个数字"));
      } else {
        //把旧密码发送给后端
        checkOldPwd({ oldPwd: value })
          .then(resp => {
            let { code, msg } = resp;
            if (code === 1) {
              callback(new Error(msg));
            } else if (code === 0) {
              callback();
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    };
    //新密码
    let newPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("新密码不能为空"));
      } else if (!pwdreg(value)) {
        callback(new Error("长度8~16位,至少1个大写字母，1个小写字母和1个数字"));
      } else if (value === this.ruleForm.oldPassword) {
        callback(new Error("新密码不能和原密码相同"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    //确认密码
    let checkPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.ruleForm.newPass) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        oldPassword: "",
        newPass: "",
        checkPass: ""
      },
      rules: {
        oldPassword: [{ required: true, validator: oldPass, trigger: "blur" }],
        newPass: [{ required: true, validator: newPass, trigger: "blur" }],
        checkPass: [{ required: true, validator: checkPass, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          //发送请求
          modifyPassword({ newPass: this.ruleForm.newPass })
            .then(resp => {
              let { code, msg } = resp;
              if (code === 0) {
                this.$message({
                  message: msg,
                  type: "success"
                });
                //清除token 跳转到登陆页面
                local.remove('myToken')
                this.$router.push('/login')
              } else if (code === 1) {
                 this.$message.error(msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("前端验证不通过!!");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    }
  },
  create() {}
};
</script>

<style lang="less">
.password-modify {
  .box-card {
    .el-card__header {
      background: #f1f1f1;
    }
  }
}
</style>