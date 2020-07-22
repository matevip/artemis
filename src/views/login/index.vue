<template>
  <div class="login-container" :style="'background-image:url('+ Background +');'">
    <div class="login-border  animated fadeInRight">
      <div class="login-main">
        <h4 class="title">迈特云微服务系统登录</h4>
        <el-tabs v-model="activeName">
          <el-tab-pane label="用户密码" name="user">
            <span slot="label"><i slot="prefix" class=""><svg-icon icon-class="user" /></i> 用户密码</span>
            <userLogin></userLogin>
          </el-tab-pane>
          <el-tab-pane label="短信验证码" name="code">
            <span slot="label"><i slot="prefix" class=""><svg-icon icon-class="mobile" /></i> 短信验证码</span>
            <mobileLogin></mobileLogin>
          </el-tab-pane>
        </el-tabs>
        <div class="third-login">
          <div class="third-way">
            <span>第三方登录：</span>
            <span class="third-icon" @click="handleSocial()">
              <svg-icon slot="prefix" icon-class="wechat" class="el-input__icon login-icon"/>
            </span>
            <span class="third-icon" @click="handleSocial()">
              <svg-icon slot="prefix" icon-class="qq" class="el-input__icon login-icon"/>
            </span>
            <span class="third-icon" @click="handleSocial()">
              <svg-icon slot="prefix" icon-class="alipay" class="el-input__icon login-icon"/>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!--  底部  -->
    <div v-if="$store.state.settings.showFooter" id="el-login-footer" class="login-footer">
      <span v-html="$store.state.settings.footerText"/>
      <span> ⋅ </span>
      <a href="http://www.beian.miit.gov.cn" target="_blank">{{ $store.state.settings.caseNumber }}</a>
    </div>
  </div>
</template>

<script>
  import userLogin from './userLogin'
  import mobileLogin from './mobileLogin'
  import {mapGetters} from 'vuex'
  import Background from '@/assets/images/background.jpg'

  export default {
    name: 'login',
    components: {
      userLogin,
      mobileLogin
    },
    data() {
      return {
        activeName: 'user',
        Background: Background,
      }
    },
    created() {
    },
    mounted() {
    },
    computed: {
      ...mapGetters(['website'])
    },
    props: [],
    methods: {
      handleSocial(){
        this.$message.error("敬请期待")
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-size: cover;
  }

  .login-main {
    border-radius: 6px;
    background: #ffffff;
    width: 385px;
    padding: 25px 25px 5px 25px;
  }

  .title {
    font-size: 20px;
    color: rgba(0, 0, 0, .85);
    margin: 10px auto 40px auto;
    text-align: center;
    font-weight: 700;
  }

  .login-form {


    .el-input {
      height: 38px;

      input {
        height: 38px;
      }
    }

    .input-icon {
      height: 39px;
      width: 14px;
      margin-left: 2px;
    }
  }

  .login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
  }

  .login-code {
    width: 38%;
    display: inline-block;
    height: 38px;
    float: right;

    img {
      cursor: pointer;
      vertical-align: middle
    }
  }

  .login-footer {
    position: fixed;
    bottom: 1rem;
    width: 100%;
    text-align: center;
    color: white;
    font-size: .9rem;
    line-height: 1rem;
    height: 1rem;
    font-weight: 600;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }


  .third-login {
    margin: 10px 0 30px 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .third-icon {
    cursor: pointer;
    margin-left: 10px;
    fill: rgba(0, 0, 0, .2);
  }

  .third-icon:hover {
    fill: rebeccapurple;
  }

  .third-login .third-way {
    font-size: 14px;
    color: #515a6e;
    width: calc(100% - 56px)
  }
</style>
