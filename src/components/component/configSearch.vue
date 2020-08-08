<template id="config-search">
  <div class="config-search">
    <el-tabs v-if="tabs.length > 0" v-model="activeName">
      <el-tab-pane v-for="(item, index) in tabs" :key="index" :label="item.name" :name="item.value"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "ConfigSearch",
      activeName: "oss",
    };
  },
  props: {
    tabs: {
      type: Array,
      default: function () {
        return [
          {
            name: "文件存储设置",
            value: "oss",
          },
          {
            name: "短信设置",
            value: "sms",
          },
          {
            name: "其他设置",
            value: "other",
          },
        ];
      },
    },
    newActiveName: {
      type: String,
      default: "oss",
    },
  },
  methods: {
    handleClick(res) {

    },
  },
  created() {
  },
};
</script>

<style>
</style>