<template>
  <div class="dashboard-container" id="dashboard">
    <div class="dashboard-text">欢迎光临: {{name}} </div>

    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card">
          <el-col :span="12">
            <svg-icon icon-class="dou" ></svg-icon>
          </el-col>
          <el-col :span="12" >
            <div class="card-panel-text">在线文档</div>
            <div class="card-panel-num">
              <a href="http://doc.mate.vip" target="_blank">Document</a>
            </div>
          </el-col>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <el-col :span="12">
            <svg-icon  icon-class="view" ></svg-icon>
          </el-col>
          <el-col :span="12" >
            <div class="card-panel-text">新增用户</div>
            <div class="card-panel-num">1024</div>
          </el-col>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <el-col :span="12">
            <svg-icon  icon-class="message" ></svg-icon>
          </el-col>
          <el-col :span="12" >
            <div class="card-panel-text">未处理消息</div>
            <div class="card-panel-num">100</div>
          </el-col>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <el-col :span="12">
            <svg-icon  icon-class="mall" ></svg-icon>
          </el-col>
          <el-col :span="12" >
            <div class="card-panel-text">营业收入</div>
            <div class="card-panel-num">100,000</div>
          </el-col>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'Dashboard',
    name: '首页',
    computed: {
      ...mapGetters([
        'name'
      ])
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-row{
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .dashboard {
    &-container {
      padding: 15px;
      background-color: #f0f2f5;
    }
    &-text {
      font-size: 14px;
      line-height: 30px;
      padding-bottom:15px;
    }
  }
  .box-card{
    height:108px;
  }
  .chart{
    height: 350px;
  }
  .section{
    padding:20px;
    background-color: white;
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }

  .box-card > div >div > .svg-icon {
    width: 4em;
    height: 4em;
    color:#34bfa3;
  }
  .card-panel-text{
    padding-top:10px;
    font-size:16px;
    color:gray;
  }
  .card-panel-num{
    padding-top:10px;
    font-size:20px;
    font-weight: bold;
  }
</style>
