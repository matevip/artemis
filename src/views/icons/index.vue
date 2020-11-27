<template>
  <div class="icons-container">
    <aside>
      <a
        href="https://panjiachen.github.io/vue-element-admin-site/guide/advanced/icon.html"
        target="_blank"
      >
        Add and use
      </a>
    </aside>
    <el-tabs type="border-card">
      <el-tab-pane label="Icons">
        <div class="grid">
          <div v-for="item of svgIcons" :key="item">
            <el-tooltip placement="top">
              <div slot="content">
                {{ generateIconCode(item) }}
              </div>
              <div class="icon-item">
                <svg-icon :icon-class="item" class-name="disabled" />
                <span>{{ item }}</span>
              </div>
            </el-tooltip>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Element-UI Icons">
        <div class="grid">
          <div v-for="item of elementIcons" :key="item">
            <el-tooltip placement="top">
              <div slot="content">
                {{ generateElementIconCode(item) }}
              </div>
              <div class="icon-item">
                <i :class="'el-icon-' + item" />
                <span>{{ item }}</span>
              </div>
            </el-tooltip>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import svgIcons from './svg-icons'
  import elementIcons from './element-icons'

  export default {
    name: 'Icons',
    data() {
      return {
        svgIcons,
        elementIcons,
      }
    },
    methods: {
      generateIconCode(symbol) {
        return `<svg-icon icon-class="${symbol}" />`
      },
      generateElementIconCode(symbol) {
        return `<i class="el-icon-${symbol}" />`
      },
    },
  }
</script>

<style lang="scss" scoped>
  .icons-container {
    margin: 10px 20px 0;
    overflow: hidden;

    .grid {
      position: relative;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }

    .icon-item {
      float: left;
      width: 100px;
      height: 85px;
      margin: 20px;
      font-size: 30px;
      color: #24292e;
      text-align: center;
      cursor: pointer;
    }

    span {
      display: block;
      margin-top: 10px;
      font-size: 16px;
    }

    .disabled {
      pointer-events: none;
    }
  }
</style>
