<template>
  <div class="personal">
    <h1>个人中心</h1>
    <h2>用户ID:{{userInfo.id}}</h2>
    <h2>账号:{{userInfo.username}}</h2>
    <h2>密码:{{userInfo.password}}</h2>
    <h2>用户组:{{userInfo.userGroup}}</h2>
    <h2>创建时间:{{userInfo.ctime | filterCtime}}</h2>
    <div style="margin-top:30px">
      <el-upload
        class="avatar-uploader"
        action="#"
        :http-request="uploadAvatar"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
  </div>
</template>

<script>
//引入
import { getinfo } from "@/api/account";
import moment from "moment";
//引入axios
import axios from "axios";
export default {
  data() {
    return {
      userInfo: {},
      imageUrl: ""
    };
  },
  methods: {
    //上传函数
    uploadAvatar(file) {
      // 创建formData实例对象
      let formData = new FormData();
      //把文件信息添加进对象
      formData.append('file',file.file)
      //发送文件信息给后端
      axios.post('/account/uploadavatar',formData)
      .then((resp)=>{
        let {avatarUrl}=resp.data
        this.imageUrl='http://172.16.12.143:3000'+avatarUrl
        //触发父组件方法

        this.$emit('a')

      })
      .catch((err)=>{
        console.log(err);
        
      })
      
    },
    //获取用户信息
    getUserInfo() {
      getinfo()
        .then(resp => {
          let { data } = resp;
          this.userInfo = data[0];
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取上传头像
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    //上传头像之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  },
  filters: {
    filterCtime(ctime) {
      return moment(ctime).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  created() {
    this.getUserInfo();
  }
};
</script>

<style lang="less">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>