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
      children: 'children'
    }
  },
}
