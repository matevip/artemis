<template>
  <el-form
    ref="loginForm"
    class="login-form"
    status-icon
    :rules="loginRules"
    :model="loginForm"
    label-width="0"
  >
    <el-form-item prop="mobile">
      <el-input
        v-model="loginForm.mobile"
        auto-complete="off"
        placeholder="请输入手机号码"
        @keyup.enter.native="handleLogin"
      >
        <svg-icon
          slot="prefix"
          icon-class="mobile"
          class="el-input__icon input-icon"
        />
      </el-input>
    </el-form-item>
    <el-form-item prop="code">
      <el-input
        v-model="loginForm.code"
        auto-complete="off"
        placeholder="请输入验证码"
        @keyup.enter.native="handleLogin"
      >
        <svg-icon
          slot="prefix"
          icon-class="validCode"
          class="el-input__icon input-icon"
        />
        <template slot="append">
          <span
            class="msg-text"
            :class="[{ display: msgKey }]"
            @click="handleSend"
          >
            {{ msgText }}
          </span>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        size="medium"
        type="primary"
        style="width: 100%"
        @click.native.prevent="handleLogin"
      >
        登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  const MSGINIT = '发送验证码'
  // const MSGERROR = '验证码发送失败'
  const MSGSCUCCESS = '${time}秒后重发'
  const MSGTIME = 60
  import { isPhone } from '@/utils/validate'
  import { getMobileCode } from '@/api/login'

  export default {
    // name: 'mobileLogin',
    data() {
      const validatemobile = (rule, value, callback) => {
        if (isPhone(value)[0]) {
          callback(new Error(isPhone(value)[1]))
        } else {
          callback()
        }
      }
      const validateCode = (rule, value, callback) => {
        if (value.length !== 4) {
          callback(new Error('请输入4位数的验证码'))
        } else {
          callback()
        }
      }
      return {
        msgText: MSGINIT,
        msgTime: MSGTIME,
        msgKey: false,
        loginForm: {
          mobile: '18810001000',
          code: '',
        },
        loginRules: {
          mobile: [
            { required: true, trigger: 'blur', validator: validatemobile },
          ],
          code: [{ required: true, trigger: 'blur', validator: validateCode }],
        },
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
    methods: {
      handleSend() {
        getMobileCode(this.loginForm.mobile).then((response) => {
          if (response.data.data) {
            this.$message.success('验证码发送成功')
          } else {
            this.$message.error(response.data.msg)
          }
        })
        if (this.msgKey) return
        this.msgText = MSGSCUCCESS.replace('${time}', this.msgTime)
        this.msgKey = true
        const time = setInterval(() => {
          this.msgTime--
          this.msgText = MSGSCUCCESS.replace('${time}', this.msgTime)
          if (this.msgTime === 0) {
            this.msgTime = MSGTIME
            this.msgText = MSGINIT
            this.msgKey = false
            clearInterval(time)
          }
        }, 1000)
      },
      handleLogin() {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.$store
              .dispatch('user/loginByMobile', this.loginForm)
              .then((res) => {
                const routerPath =
                  this.redirect === '/404' || this.redirect === '/402'
                    ? '/'
                    : this.redirect
                this.$router.push(routerPath).catch(() => {})
                this.loading = false
              })
              .catch(() => {
                this.loading = false
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

<style>
  .code {
    display: block;
    margin-top: 8px;
  }
  .msg-text {
    display: block;
    width: 60px;
    font-size: 12px;
    text-align: center;
    cursor: pointer;
  }
  .msg-text.display {
    color: #ccc;
  }
</style>
