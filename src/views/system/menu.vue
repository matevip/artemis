<template>
  <div class="app-container">

    <el-card class="box-card" shadow="never" style="border:0"
             body-style="background-color: #f3f3f3;padding: 10px 0 0;">
      <div slot="header">
        <span>菜单列表</span>
        <div style="float: right; margin: -5px 0">
          <el-button type="primary" size="small" plain>添加菜单</el-button>
          <el-button type="success" size="small" plain>菜单导出</el-button>
        </div>
      </div>
    </el-card>

    <div class="table-body">
      <div class="app-search">
        <div class="search-box" flex="dir:left cross-center">
<!--          <div class="div-box">-->
<!--            <el-button size="small">分类筛选</el-button>-->
<!--            <el-button size="small">清除分类</el-button>-->
<!--          </div>-->
          <div class="div-box" flex="dir:left">
            <div flex="cross:center" style="height: 32px;">添加时间：</div>
            <el-date-picker
              size="small"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <div class="input-item div-box" flex="cross-center">
            <div>
              <el-input size="small" placeholder="请输入ID或者名称搜索"
                        clearable
              >
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </div>
          </div>
          <div class="div-box clear-where" flex="cross:center">
            <el-button class="filter-item" size="small" icon="el-icon-refresh-left">重置</el-button>
          </div>
        </div>
      </div>
      <el-table
        :data="data"
        :header-cell-style="tableHeaderColor"
        border
        highlight-current-row
        ref="multipleTable"
        size="small"
        stripe="true">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="菜单ID" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="菜单名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="图标">
          <template slot-scope="scope">
            <span>{{scope.row.icon}}</span>
          </template>
        </el-table-column>
        <el-table-column label="组件路径">
          <template slot-scope="scope">
            <span>{{scope.row.path}}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <span>{{scope.row.type}}</span>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">
            <span>{{scope.row.sort}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import flex from '@/styles/flex.css'
  import {getList} from '@/api/system/menu'

  export default {

    data() {
      return {
        data: [],
        multipleSelection: [],
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        this.fetchData()
      },
      // 更改表头样式
      tableHeaderColor ({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === 0) {
          return 'background-color: #fafafa;color: #000;font-weight: 500; text-align: center'
        }
      },
      fetchData() {
        this.listLoading = true
        getList().then(response => {
          this.data = response.data
          this.listLoading = false
        })
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    }
  }
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
    color: #419EFB;
    cursor: pointer;
  }
</style>
