<template>
  <div class="app-container">
    <el-card
      class="box-card"
      shadow="never"
      style="border:0"
      body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <span>组件管理</span>
        <div style="float: right; margin: -5px 0"></div>
      </div>
    </el-card>
    <div class="table-body">
      <ConfigSearch
        :tabs="tabs"
        :new-active-name="newActiveName"
      ></ConfigSearch>
      <Oss />
    </div>
  </div>
</template>

<script>
import ConfigSearch from "@/components/component/configSearch";
import Oss from "@/components/component/oss";
export default {
  components: {
    ConfigSearch,
    Oss
  },
  data() {
    return {
      data: {
        activeName: "oss",
        newActiveName: "oss"
      }
    };
  },
  props: {
    tabs: {
      type: Array,
      default: function() {
        return [
          {
            name: "文件存储设置",
            value: "oss"
          },
          {
            name: "短信设置",
            value: "sms"
          },
          {
            name: "其他设置",
            value: "other"
          }
        ];
      }
    },
    newActiveName: {
      type: String,
      default: "oss"
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/mate.scss";
</style>
