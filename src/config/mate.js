export default {
  clientId: 'mate', // 客户端id
  clientSecret: 'mate_secret', // 客户端密钥
  enableCode: true, //开启验证码模式
  key: 'mate', //配置主键，用于存储
  //配置菜单的属性
  menu: {
    iconDefault: 'iconfont icon-caidan',
    props: {
      label: 'name',
      path: 'path',
      icon: 'source',
      children: 'children',
    },
  },
  /**
   *  api请求基础路径
   */
  apiUrl: {
    //  本地环境接口请求地址
    dev: 'http://localhost:10001',
    //  生产环境接口请求地址
    pro: 'https://gateway.mate.vip',
  },
}
