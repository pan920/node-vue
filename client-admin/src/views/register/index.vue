<template>
  <div class="register">
    <el-form ref="registerUser" :model="registerUser" status-icon :rules="rules" label-width="80px" class="register_form">
      <div class="register_title">用户注册</div>
      <el-form-item label="用户名" prop="name">
        <el-input v-model="registerUser.name" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="registerUser.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="registerUser.password" type="password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item label="确认密码" prop="password2">
        <el-input v-model="registerUser.password2" type="password" placeholder="请确认密码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitRegister('registerUser')">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { registerApi } from '@/api/user'
export default {
  name: 'Register',
  components: {},
  data() {
    // 验证密码是否一致
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.registerUser.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      registerUser: {
        name: '',
        email: '',
        password: '',
        password2: '',
        identity: 'user'
      },
      loading: false,
      fullscreenLoading: false,
      rules: {
        name: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            max: 20,
            message: '用户名长度过长！',
            trigger: 'blur'
          }
        ],
        email: [{ type: 'email', required: true, message: '请输入邮箱', trigger: 'blur' }],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 30,
            message: '长度在6到30之间',
            trigger: 'blur'
          }
        ],
        password2: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 注册用户
    submitRegister(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.$axios.post('./api/users/register',this.registerUser)
          registerApi(this.registerUser)
            .then(res => {
              // 注册成功

              this.$message({
                message: '账号注册成功！！',
                type: 'success'
              })
            })
          this.$router.push('/login')
        }
      })
    }
  }
}
</script>
<style scoped>
.register_form{
  width: 400px;
  margin: 0 auto;
  padding: 40px;
  border: 1px sild #666666;
  box-shadow: 3px 2px 3px 5px #e8e8e8;
  margin-top: 100px;
}
.register_title{
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: 600;
}
</style>

