<template>
  <div class="login">

    <el-form class="loginForm"
             :model="loginForm"
             label-width="80px"
             :inline="false"
             size="medium"
             ref="loginForm"
             :rules="loginRules"
    >

      <el-form-item>
        <div class="loginTitle">寰 宇 医 疗 登 录</div>
      </el-form-item>

      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input v-model="loginForm.password" placeholder="请输入密码" show-password></el-input>
      </el-form-item>

      <el-form-item prop="code">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-input v-model="loginForm.code" placeholder="请输入验证码"></el-input>
          </el-col>
          <el-col :span="8">
            <img :src="imgSrc" @click="getImage" class="images" >
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-button class="btn" type="primary" @click="commitBtn()">登录</el-button>
          </el-col>
          <el-col :span="12">
            <el-button class="btn" @click="clearBtn()">重置</el-button>
          </el-col>
        </el-row>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>
//登录请求
import {login} from "@/api/login";
import Cookies from 'js-cookie';
import {setToken,setUserId,setTokenTime} from "@/utils/auth";
import {getImageApi} from "@/api/user"


export default {
  name: "Login",
  data() {
    return {

      //验证码
      imgSrc:"",

      loginForm: {// 登录对象
        username: '',//用户名
        password: '',//用户密码
        code: '',// 验证码
      },// 结束

      loginRules:{//验证对象

        username:[
          {
            required:true,
            trigger:'change',
            message:'请输入用户名'
          }
        ],//

        password:[
          {
            required:true,
            trigger:'change',
            message:'请输入密码'
          }
        ],//

        code:[
          {
            required:true,
            trigger:'change',
            message:'请输入验证码'
          }
        ]//

      }//结束验证

    }//return标签
  },

  created() {
    this.getImage();
  },

  methods:{

    // 获取验证嘛
    // 返回的数据是arraybuffer,需要转换为base64给img标签使用
    // 1.arraybuffer转换二进制
    // 2.将二进制字符转换base64
    async getImage(){
      let res = await getImageApi();
      let array = res.data;
      let imageDate = "data:image/png;base64,"+
          btoa(
              new Uint8Array(array).reduce(
                  (data,byte)=> data + String.fromCharCode(byte),""
              )
          )
      // console.log('res',imageDate)
      this.imgSrc = imageDate
    },

    commitBtn(){//验证通过进行提交表单
      this.$refs.loginForm.validate(async valid =>{
        if(valid){
          Cookies.set('username',this.loginForm.username)
          let res = await login(this.loginForm)
          console.log("res",res)
          if (res.data.code == 200){
            // this.message.success(res.data.msg)
            let datas = res.data;
            // Cookies.set('token',res.data.token)
            //设置token到cookies
            setToken(datas.token)
            //设置用户id到
            setUserId(datas.id)
            //设置token过期时间
            setTokenTime(datas.expireTime)
            this.$router.push("home")
          }else {
            this.$message.error(res.data.msg)
            return;
          }

        }

      })
    },// commitBtn 结束

    clearBtn(){//表单清空
      this.$refs['loginForm'].resetFields()
    },// clearBtn结束

  }// methods 结束
}
</script>

<style scoped>

.login {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loginForm {
  height: 300px;
  width: 370px;
  border-radius: 10px;
  box-shadow: 0 0 25px #cac6c6;
  padding: 20px;
  /*padding: 20px 35px;*/
}

.loginTitle {
  margin-left: -75px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 24px;
}

.el-input {
  margin-left: -40px;
}

.btn {
  margin-left: -40px;
  width: 100%;
}
.images{
  margin-left: -50px;
  height: 36px;
  width: 95px;
}
</style>