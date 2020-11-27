module.exports = {
  webpackBarName: 'artemis',

  webpackBanner: ' build: Artemis \n copyright: pangu 7333791@qq.com \n time: ',
  donationConsole() {
    const chalk = require('chalk')
    console.log(
      chalk.green(
        `> 欢迎使用Artemis（开源地址：https://github.com/matevip/artemis）`
      )
    )
    console.log(
      chalk.green(
        `> 后台使用MateCloud（开源地址：https://github.com/matevip/matecloud）`
      )
    )
    console.log(chalk.green(`> 如果您不希望显示以上信息，可在设置中配置关闭`))
    console.log('\n')
  },
}
