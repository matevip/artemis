<!-- @author zhengjie -->
<template>
  <div class="icon-body">
    <el-input
      v-model="name"
      style="position: relative"
      clearable
      placeholder="请输入图标名称"
      @clear="filterIcons"
      @input.native="filterIcons"
    >
      <i slot="suffix" class="el-icon-search el-input__icon" />
    </el-input>
    <div class="icon-list">
      <div
        v-for="(item, index) in iconList"
        :key="index"
        @click="selectedIcon(item)"
      >
        <svg-icon :icon-class="item" style="width: 16px; height: 30px" />
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>
<script>
  import icons from './requireIcons'
  export default {
    name: 'IconSelect',
    data() {
      return {
        name: '',
        iconList: icons,
      }
    },
    methods: {
      filterIcons() {
        this.iconList = icons
        if (this.name) {
          this.iconList = this.iconList.filter((item) =>
            item.includes(this.name)
          )
        }
      },
      selectedIcon(name) {
        this.$emit('selected', name)
        document.body.click()
      },
      reset() {
        this.name = ''
        this.iconList = icons
      },
    },
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .icon-body {
    width: 100%;
    padding: 10px;
    .icon-list {
      height: 200px;
      overflow-y: scroll;
      div {
        float: left;
        width: 33%;
        height: 30px;
        margin-bottom: -5px;
        line-height: 30px;
        cursor: pointer;
      }
      span {
        display: inline-block;
        overflow: hidden;
        vertical-align: -0.15em;
        fill: currentColor;
      }
    }
  }
</style>
