<template>
  <div class="login">
    <div class="login-wrap">
      <h3>
        <i class="el-icon-user-solid"></i>超市管理系统-登陆
      </h3>
      <el-form
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

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
//引入正则
import { pwdreg } from "@/utils/reg.js";
import { checklogin } from "@/api/login.js";
import local from '@/utils/local'

export default {
  data() {
    //自定义函数验证密码
    var passworda = (rule, value, callback) => {
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
    //验证确认密码
    var confirmPwd = (rule, value, callback) => {
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
        checkPass: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }
        ],
        password: [{ required: true, validator: passworda, trigger: "blur" }],
        checkPass: [{ required: true, validator: confirmPwd, trigger: "blur" }]
      }
    };
  },
  methods: {
    //登陆
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            username: this.ruleForm.username,
            password: this.ruleForm.password
          };
          checklogin(params)
            .then(resp => {
              let { code, msg,token } = resp;
              
              if (code === 0) {
                //把token存入本地
                
               local.set('myToken',token)
                this.$message({
                  message: msg,
                  type: "success"
                });
                this.$router.push('/home')
              } else {
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="less">
@import "./login.less";
</style>