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
        <ConfigSearch :tabs="tabs" :new-active-name="newActiveName"></ConfigSearch>
        <Oss/>
    </div>
  </div>
</template>

<script>
import ConfigSearch from "@/components/component/configSearch";
import Oss from "@/components/component/oss";
export default {
  components: {
    ConfigSearch,
    Oss,
  },
  data: {
    activeName: "oss",
    newActiveName: 'oss',
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
};
</script>

<style lang="scss" scoped>
.app-container {
  background-color: rgb(243, 243, 243);
}

.block {
  padding: 10px 0px;
}

.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.table-body {
  padding: 20px;
  background-color: #fff;
}

.table-body .edit-sort-img {
  width: 14px;
  height: 14px;
  margin-left: 5px;
  cursor: pointer;
}

.app-search .search-box {
  margin-bottom: 10px;
}

.app-search .div-box {
  margin-right: 10px;
}

.app-search .input-item {
  display: inline-block;
  width: 250px;
}

.app-search .input-item .el-input__inner {
  border-right: 0;
}

.app-search .input-item .el-input__inner:hover {
  border: 1px solid #dcdfe6;
  border-right: 0;
  outline: 0;
}

.app-search .input-item .el-input__inner:focus {
  border: 1px solid #dcdfe6;
  border-right: 0;
  outline: 0;
}

.app-search .input-item .el-input-group__append {
  background-color: #fff;
  border-left: 0;
  width: 10%;
  padding: 0;
}

.app-search .input-item .el-input-group__append .el-button {
  padding: 0;
}

.app-search .input-item .el-input-group__append .el-button {
  margin: 0;
}

.app-search .clear-where {
  color: #419efb;
  cursor: pointer;
}

.app-batch {
  height: 50px;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  padding: 0 22px;
  margin-bottom: 10px;
}

.app-batch .batch-box {
  margin-left: 10px;
}

.app-batch .batch-remark {
  margin-top: 5px;
  color: #999999;
  font-size: 14px;
}

.app-batch .select-count {
  font-size: 14px;
  margin-left: 10px;
}

.app-batch .batch-title {
  font-size: 18px;
}

.app-batch .batch-box-left {
  width: 120px;
  border-right: 1px solid #e2e2e2;
  padding: 0 20px;
}

.app-batch .batch-box-left div {
  padding: 5px 0;
  margin: 5px 0;
  cursor: pointer;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
}

.app-batch .batch-div-active {
  background-color: #e2e2e2;
}

.app-batch .el-dialog__body {
  padding: 15px 20px;
}

.app-batch .batch-box-right {
  padding: 5px 20px;
}

.app-batch .express-dialog .el-dialog {
  min-width: 250px;
}

.app-batch .add-express-rule {
  margin-left: 20px;
  cursor: pointer;
  color: #419efb;
}

.app-batch .confine-box .label {
  margin-right: 10px;
}

.app-batch .goods-price .el-input-group__prepend {
  width: 80px;
}
</style>