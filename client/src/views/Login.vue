<template>
  <div class="login">
    <el-form :model="loginUser" status-icon :rules="rules" ref="loginUser" label-width="80px" class="login_form">
      <div class="login_title">用户登陆</div>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="loginUser.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="loginUser.password" @keyup.enter.native="submitLogin('loginUser')" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitLogin('loginUser')">登陆</el-button>
        <el-button type="success">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import jwt_decode from 'jwt-decode';

export default {
  name: 'login',
  components: {},
  data() {
    return {
      loginUser: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          {required: true, type:'email',message: '请输入邮箱！',trigger: 'blur'}
        ],
        password: [
          {required: true,message: '请输入密码！', trigger: 'blur'}
        ]
      }
    }
  },
   methods: {
    //  登陆
      submitLogin(loginUser) {
        this.$refs[loginUser].validate((valid) => {
          if (valid) {
            this.$axios.post('/api/users/login',this.loginUser)
            .then(res => {
              console.log(res)
              const {token} = res.data
              // console.log(token)
              // 存储token
              localStorage.setItem('pantoken',token)
              // 解析token
              const decoded = jwt_decode(token)
              // console.log(decoded)
              // 存储到vuex中
              this.$store.dispatch("setAuthenticated",!this.isEmpty(decoded))
              this.$store.dispatch("setUser",decoded)
            })
            // 登陆跳转
            this.$router.push('/')
          }
         
        });
        
      },
      isEmpty(value) {
          return (
            value == undefined ||
            value == null ||
            (typeof value === "object" && Object.keys(value).length === 0) ||
            (typeof value === "string" && value.trim().length === 0)
          )
      }
    },
}
</script>
<style scoped>
.login_form{
  width: 400px;
  margin: 0 auto;
  padding: 100px 20px;
  border: 1px sild #666666;
  box-shadow: 3px 2px 3px 5px #e8e8e8;
  margin-top: 100px;
}
.login_title{
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: 600;
}
</style>

