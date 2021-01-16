<template>
  <el-form
    ref="loginForm"
    :model="loginForm"
    :rules="loginRules"
    class="login-form"
    auto-complete="on"
    label-position="left"
  >
    <el-form-item prop="username">
      <el-input
        v-model="loginForm.username"
        type="text"
        auto-complete="off"
        placeholder="账号"
      >
        <svg-icon
          slot="prefix"
          icon-class="user"
          class="el-input__icon input-icon"
        />
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="loginForm.password"
        type="password"
        auto-complete="off"
        placeholder="密码"
        @keyup.enter.native="handleLogin"
      >
        <svg-icon
          slot="prefix"
          icon-class="password"
          class="el-input__icon input-icon"
        />
      </el-input>
    </el-form-item>
    <el-form-item prop="code">
      <el-input
        v-model="loginForm.code"
        auto-complete="off"
        placeholder="验证码"
        style="width: 60%"
        @keyup.enter.native="handleLogin"
      >
        <svg-icon
          slot="prefix"
          icon-class="validCode"
          class="el-input__icon input-icon"
        />
      </el-input>
      <div class="login-code">
        <img :src="codeUrl" @click="getCode" />
      </div>
    </el-form-item>
    <el-form-item style="width: 100%">
      <el-button
        :loading="loading"
        size="medium"
        type="primary"
        style="width: 100%"
        @click.native.prevent="handleLogin"
      >
        <span v-if="!loading">登 录</span>
        <span v-else>登 录 中...</span>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { getCodeImg } from '@/api/login'
  export default {
    name: 'Login',
    data() {
      return {
        codeUrl: '',
        loginForm: {
          username: 'admin',
          password: 'matecloud',
          key: '',
          grantType: 'captcha',
        },
        loginRules: {
          username: [
            { required: true, trigger: 'blur', message: '用户名不能为空' },
          ],
          password: [
            { required: true, trigger: 'blur', message: '密码不能为空' },
          ],
          code: [
            { required: true, trigger: 'change', message: '验证码不能为空' },
          ],
        },
        loading: false,
        redirect: undefined,
      }
    },
    watch: {
      $route: {
        handler: function (route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true,
      },
    },
    created() {
      this.getCode() //获取验证码
    },
    methods: {
      getCode() {
        getCodeImg().then((res) => {
          this.codeUrl = res.data.codeUrl
          this.loginForm.key = res.data.key
        })
      },
      handleLogin() {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.loading = true
            this.$store
              .dispatch('user/loginByUsername', this.loginForm)
              .then(() => {
                const routerPath =
                  this.redirect === '/404' || this.redirect === '/401'
                    ? '/'
                    : this.redirect
                this.$router.push(routerPath).catch(() => {})
                this.loading = false
              })
              .catch(() => {
                this.loading = false
                this.getCode()
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
    },
  }
</script>
