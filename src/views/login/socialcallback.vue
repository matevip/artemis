<template>
  <div />
</template>

<script>
  import { getQueryString } from '@/utils/util'
  import request from '@/utils/request'
  export default {
    name: 'SocialCallback',

    created() {
      const url = window.location.href.replace('#/socialcallback', '')
      const code = getQueryString(url, 'code')
      let state = getQueryString(url, 'state')

      const type = code.split('-')[0]
      // state = state.split("-")[0];
      // 登录请求
      if (type === 'github') {
        window.opener.location.href =
          `${window.location.origin}/#/login?state=${state}&code=${code}&time=` +
          new Date().getTime()
        window.close()
      } else {
        //   this.bind(state, code)
      }
    },
  }
</script>

<style></style>
