<template>
  <div class="app-container">
    <el-card class="box-card" shadow="never" style="border:0"
             body-style="background-color: #f3f3f3;padding: 10px 0 0;">
      <div slot="header">
        <span>代码生成</span>
        <div style="float: right; margin: -5px 0">
          <el-button type="primary"
                     size="small"
                     icon="el-icon-plus" plain
                     @click="handleAdd"
                     v-permission="['sys:datasource:add']"
          >新增数据源</el-button>
          <el-button type="success" size="small" icon="el-icon-download" plain v-permission="['sys:datasource:export']">数据源导出</el-button>
        </div>
      </div>
    </el-card>
    <div class="table-body">
      <div class="app-search">
        <div flex="wrap:wrap cross:center">
          <div class="item-box" flex="dir:left cross:center">
            <div class="label">数据源:</div>
            <el-select style="width: 120px;" size="small" v-model="search.datasourceId" @change="toTableList">
              <el-option
                v-for="item in optionList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>

      <div class="app-batch" flex="dir:left cross:center">
        <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="handleDelete" v-permission="['sys:datasource:delete']">批量删除</el-button>
      </div>
      <el-table
        :data="data"
        :header-cell-style="headerCellStyle"
        :cell-style="cellStyle"
        row-key="id"
        border
        ref="multipleTable"
        size="small"
        @selection-change="selectionChange"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="序号" type="index" width="50">

        </el-table-column>
        <el-table-column label="数据表" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据表名称">
          <template slot-scope="scope">
            <span>{{scope.row.comment}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       icon="el-icon-paperclip"
                       @click="rowGen(scope.row)"
                       v-permission="['sys:datasource:edit']"
            >生成代码
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="包名" prop="name">
              <el-input v-model="form.packageName" placeholder="请输入包名"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="表前缀" prop="driverClass">
              <el-input v-model="form.prefix" placeholder="请输入表前缀"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="模块名称" prop="url">
              <el-input v-model="form.modelName"  placeholder="请输入模块名称"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">代码生成</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import flex from '@/styles/flex.css'
  import {getTableList, genCode} from "@/api/devops/generator";
  // 权限判断指令
  import permission from '@/directive/permission/index'
  import {optionList} from "@/api/devops/datasource";
  import { downloadFile } from '@/utils'

  export default {
    directives: { permission },
    data() {
      return {
        data: [],
        //弹窗标题
        title: "",
        // 是否显示弹出层
        open: false,
        optionList: [],
        // 表单参数
        form: {
          packageName: undefined,
          prefix: undefined,
          modelName: undefined,
          datasourceId: undefined,
          tableName: undefined
        },
        // 查询参数
        search: {
          datasourceId: undefined
        },
      }
    },
    created() {
      this.init()
    },
    computed:{
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    methods: {
      // 更改表头样式
      headerCellStyle({row, column, rowIndex, columnIndex}) {
        if (rowIndex === 0) {
          return 'background-color: #fafafa;color: #000;font-weight: 500; text-align: center'
        }
      },
      // 更改表头样式
      cellStyle({row, column, rowIndex, columnIndex}) {
        if (columnIndex !== 2) {
          return 'text-align: center'
        }
      },
      /** 初始化列表 */
      init() {
        this.fetchData()
      },
      fetchData() {
        this.listLoading = true
        optionList().then(response =>{
          this.optionList = response.data;
        })
      },
      /** 新增按钮操作 */
      handleAdd(){
        this.reset();
        this.open = true;
        this.title = "生成配置信息";
      },
      rowGen(row){
        this.reset();
        this.open = true;
        this.title = "生成配置信息";
        this.form.tableName = row.name
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      changeDate(){
        if(this.datetime){
          this.search.startDate = this.datetime[0];
          this.search.endDate = this.datetime[1];
        } else {
          this.search.startDate = null;
          this.search.endDate = null;
        }
        this.init();
      },
      toSearch(){
        this.init();
      },
      /** 修改按钮操作 */
      rowUpdate(row) {
        this.reset();
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs["form"].validate(valid => {
          this.form.datasourceId = this.search.datasourceId;
          if (valid) {
            genCode(this.form).then(data => {
              downloadFile(data, this.form.tableName, 'zip')
            })
          }
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
      },
      // 表单重置
      reset() {
        this.form = {
          packageName: "vip.mate",
          prefix: "mate_",
          modelName: "模块"
        };
        // this.resetForm("form");
      },
      handleCurrentChange(currentRow, oldCurrentRow) {
        this.selRow = currentRow
      },
      toTableList() {
        getTableList(this.search.datasourceId).then(resp => {
          this.data = resp.data;
        })
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

  .app-search .tabs {
    margin-top: 20px;
  }

  .app-search .label {
    margin-right: 10px;
  }

  .app-search .item-box {
    margin-bottom: 10px;
    margin-right: 15px;
  }

  .app-search .clear-where {
    color: #419EFB;
    cursor: pointer;
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
    color: #419EFB;
  }

  .app-batch .confine-box .label {
    margin-right: 10px;
  }

  .app-batch .goods-price .el-input-group__prepend {
    width: 80px;
  }
</style>
