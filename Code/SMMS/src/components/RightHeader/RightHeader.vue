<template>
  <div class="right-header">
    <el-row>
      <el-col :span="12">
        <h3>
          <i class="el-icon-s-check"></i>超市后台管理系统
        </h3>
      </el-col>
      <el-col :span="12">
        <el-row>
          <el-col :span="16">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                {{ username }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="Personal">个人中心</el-dropdown-item>
                <el-dropdown-item command="loginOut">退出系统</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
          <el-col :span="8">
              <div class="touxiang">
                  <img :src="avatarUrl" alt="">
              </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
//引入
import {getinfo} from '@/api/account'
import local from '@/utils/local'
export default {
  data(){
    return{
      username:'',
      avatarUrl:''//头像地址
    }
  },
  methods:{
    handleCommand(command){
      if(command==="loginOut"){
        local.remove('myToken');
         this.$message({
          message: '退出系统成功',
          type: 'success'
        });
        setTimeout(()=>{
          this.$router.push('login')
        },1000)
      }else if(command==="Personal"){//个人中心
          this.$router.push('/home/personal')
      }
    },
    getUserInfo(){
      getinfo()
      .then((resp)=>{
        let {data}=resp;
        //获取账号和头像地址
        let {username,avatarUrl}=data[0]
        this.username=username;//渲染账号
        
        this.avatarUrl='http://127.0.0.1:3000'+avatarUrl;
        
      })
      .catch((err)=>{
        console.log(err);
        
      })
    }
  },
  created(){
    this.getUserInfo()
  }

};
</script>

<style lang="less">
.right-header {
  border-bottom: 1px solid #ccc;
  & > .el-row {
    & > .el-col {
      h3 {
        font-size: 20px;
        color: #2d3a4b;
      }
      .el-row{
            .el-col:first-child{
                text-align: right;
            }
            .el-col:last-child{
                .touxiang{
                    width: 50px;
                    height: 50px;
                    margin: 5px auto;
                    border-radius: 50%;
                    img{
                    border-radius: 50%;
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
    }
  }
}
</style>