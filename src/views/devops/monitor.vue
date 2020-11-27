<template>
  <div class="app-container">
    <el-col v-for="(i, index) in pages" :key="index" :xs="12" :sm="6">
      <el-card
        class="box-card"
        :style="{ background: i.bgc }"
        @click.native="open(i.url)"
      >
        <div class="text item">
          <div class="left">
            <svg-icon :icon-class="i.icon" />
          </div>
          <div class="right">
            <span class="header" :style="{ color: i.c }">{{ i.name }}</span>
            <br />
            <span>{{ i.description }}</span>
          </div>
        </div>
      </el-card>
    </el-col>
  </div>
</template>

<script>
  import Logo from '@/icons/svg/nacos.svg'
  export default {
    name: 'MonitorDashboard',
    data() {
      return {
        logo: Logo,
        pages: [
          {
            icon: 'nacos',
            name: 'Nacos控制台',
            url: 'http://gateway.mate.vip:8848/nacos',
            description: 'Nacos，微服务注册中心&配置中心',
            c: '#1890ff',
            bgc: 'rgba(236,251,252,0.3)',
          },
          {
            icon: 'sentinel',
            name: 'Sentinel控制台',
            url: '#',
            description: '高可用流量管理框架,待上线',
            c: '#1890ff',
            bgc: 'rgba(236,251,252,0.3)',
          },
          {
            icon: 'rocketmq',
            name: 'RocketMQ控制台',
            url: '#',
            description: '消息队列管理和查看，待上线',
            c: '#1890ff',
            bgc: 'rgba(236,251,252,0.3)',
          },
          {
            icon: 'dubbo',
            name: 'Dubbo控制台',
            url: '#',
            description: 'Dubbo业务管理后台，待上线',
            c: '#1890ff',
            bgc: 'rgba(236,251,252,0.3)',
          },
          {
            icon: 'swagger',
            name: 'Swagger控制台',
            url: 'http://gateway.mate.vip/doc.html',
            description: 'Knife4j，微服务API接口文档中心',
            c: '#1890ff',
            bgc: 'rgba(236,251,252,0.3)',
          },
          {
            icon: 'admin',
            name: 'Spring Boot Admin面板',
            url: 'http://gateway.mate.vip:30001',
            description: 'Admin，基于SBA的微服务监控中心',
            c: '#1890ff',
            bgc: 'rgba(236,251,252,0.3)',
          },
          {
            icon: 'skywalking',
            name: '链路跟踪控制台',
            url: '#',
            description: '采用skywalking实现链路跟踪，待上线',
            c: '#1890ff',
            bgc: 'rgba(236,251,252,0.3)',
          },
          {
            icon: 'elk',
            name: 'ELK面板',
            url: '#',
            description: '统一日志管理业务，待上线',
            c: '#1890ff',
            bgc: 'rgba(236,251,252,0.3)',
          },
        ],
      }
    },
    methods: {
      resolveIcon(icon) {
        return `./icons/svg/${icon}`
      },
      open(url) {
        window.open(url, '_blank')
      },
    },
  }
</script>
<style scoped>
  .svg-icon {
    width: 3.4rem;
    height: 3.4rem;
  }
  .item {
    display: flex;
    flex-wrap: wrap;
  }
  .app-container {
    display: inline-block;
    width: 98.6%;
  }
  .box-card {
    margin: 13px;
    cursor: pointer;
  }
  .header {
    display: inline-flex;
    margin-bottom: 8px;
    font-size: 1rem;
    font-weight: 600;
  }
  .left {
    height: 100%;
  }
  img {
    display: inline-block;
    width: 3.4rem;
  }
  .right {
    margin-left: 10px;
  }
</style>
