<template>
  <div class="app-container">

    <el-card class="box-card" shadow="never" style="border:0"
             body-style="background-color: #f3f3f3;padding: 10px 0 0;">
      <div slot="header">
        <span>菜单列表</span>
        <div style="float: right; margin: -5px 0">
          <el-button type="primary" size="small" icon="el-icon-plus" plain @click="handleAdd">添加菜单</el-button>
          <el-button type="success" size="small" icon="el-icon-download" plain>菜单导出</el-button>
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
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changeDate"
              v-model="datetime">
            </el-date-picker>
          </div>
          <div class="input-item div-box" flex="cross-center">
            <div>
              <el-input size="small" placeholder="请输入ID或者名称搜索"
                        v-model="search.keyword"
                        clearable
                        @clear="toSearch"
                        @keyup.enter.native="toSearch"
              >
                <el-button slot="append" icon="el-icon-search" @click="toSearch"></el-button>
              </el-input>
            </div>
          </div>
          <div class="div-box clear-where" flex="cross:center">
            <el-button class="filter-item" size="small" icon="el-icon-refresh-left" @click="clearSearch">重置</el-button>
          </div>
        </div>
      </div>
      <div class="app-batch" flex="dir:left cross:center">
        <!--        <el-checkbox @change="checkedChange" v-model="isAllChecked" style="margin-right: 10px;">修改全部</el-checkbox>-->
        <template>
          <el-button size="mini" icon="el-icon-unlock" @click="handleStatus('0')">启用</el-button>
        </template>
        <template>
          <el-button size="mini" icon="el-icon-lock" @click="handleStatus('1')">禁用</el-button>
        </template>
        <el-button size="mini" type="primary" icon="el-icon-delete" @click="handleDelete">批量删除</el-button>
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
        <!--        <el-table-column label="菜单ID" sortable>-->
        <!--          <template slot-scope="scope">-->
        <!--            <span>{{scope.row.id}}</span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column label="菜单名称" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="图标">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon"/>
          </template>
        </el-table-column>
        <el-table-column label="组件路径">
          <template slot-scope="scope">
            <span>{{scope.row.path}}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <el-tag size="small">{{scope.row.typeName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope" width="30">
            <span>{{scope.row.sort}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       icon="el-icon-edit"
                       @click="rowUpdate(scope.row)"
                       v-hasPermi="['system:menu:edit']"
            >修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-plus"
              @click="handleAdd(scope.row)"
              v-hasPermi="['system:menu:add']"
            >新增子项
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="rowDelete(scope.row)"
              v-hasPermi="['system:menu:remove']"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="菜单类型" prop="type">
              <el-radio-group v-model="form.type" size="mini" style="width: 178px">
                <el-radio-button label="0">目录</el-radio-button>
                <el-radio-button label="1">菜单</el-radio-button>
                <el-radio-button label="2">按钮</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.type != 2" label="菜单图标">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected"/>
                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 32px;width: 16px;"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon"/>
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.name" placeholder="请输入菜单名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number v-model="form.sort" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
<!--          <el-col :span="12">-->
<!--            <el-form-item v-if="form.type != 2" label="是否外链">-->
<!--              <el-radio-group v-model="form.isFrame" size="mini">-->
<!--                <el-radio-button label="0">是</el-radio-button>-->
<!--                <el-radio-button label="1">否</el-radio-button>-->
<!--              </el-radio-group>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="12">
            <el-form-item v-if="form.type != 2" label="路由地址" prop="path">
              <el-input v-model="form.path" placeholder="请输入路由地址"/>
            </el-form-item>
          </el-col>
<!--          <el-col :span="12" v-if="form.type == 1">-->
<!--            <el-form-item label="组件路径" prop="component">-->
<!--              <el-input v-model="form.component" placeholder="请输入组件路径"/>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="12">
            <el-form-item v-if="form.type != 0" label="权限标识">
              <el-input v-model="form.permission" placeholder="请权限标识" maxlength="50"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单状态">
              <el-radio-group v-model="form.status" size="mini">
                <el-radio-button label="0">启用</el-radio-button>
                <el-radio-button label="1">禁用</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import flex from '@/styles/flex.css'
  import {getList, saveOrUpdateMenu, getAsyncList, getSysMenuById, deleteMenu, statusMenu} from '@/api/system/menu'
  import Treeselect from '@riophae/vue-treeselect'
  import IconSelect from "@/components/IconSelect";
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  export default {
    components: {Treeselect, IconSelect},
    data() {
      return {
        data: [],
        menuOptions: [],
        selectionList: [],
        permission: {
          add: ['admin', 'system:menu:add'],
          edit: ['admin', 'menu:edit'],
          del: ['admin', 'menu:del']
        },
        // 查询参数
        search: {
          keyword: undefined,
          startDate: undefined,
          endDate: undefined
        },
        datetime: undefined,
        //弹窗标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 表单参数
        form: {},
        // 显示状态数据字典
        visibleOptions: [],
        // 菜单状态数据字典
        statusOptions: [],
        multipleSelection: [],
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
      init() {
        this.fetchData()
      },
      // 选择图标
      selected(name) {
        this.form.icon = name;
      },
      // 更改表头样式
      headerCellStyle({row, column, rowIndex, columnIndex}) {
        if (rowIndex === 0) {
          return 'background-color: #fafafa;color: #000;font-weight: 500; text-align: center'
        }
      },
      // 更改表头样式
      cellStyle({row, column, rowIndex, columnIndex}) {
        if (columnIndex !== 1 && columnIndex !== 3) {
          return 'text-align: center'
        }
      },
      fetchData() {
        this.listLoading = true
        getList(this.search).then(response => {
          this.data = response.data
          this.listLoading = false
        })
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          // menuId: undefined,
          menuOptions: [],
          parentId: 0,
          // menuName: undefined,
          icon: undefined,
          type: 0,
          sort: 1,
          // orderNum: undefined,
          isFrame: "1",
          visible: "0",
          status: "0"
        };
        // this.resetForm("form");
      },
      /** 新增按钮操作 */
      handleAdd(row) {
        this.reset();
        // this.getTreeSelect();
        this.loadMenuOptions();
        if (row != null) {
          this.form.parentId = row.id;
        }
        this.open = true;
        this.title = "添加菜单";
      },
      async loadMenuOptions(){
        getAsyncList().then(response => {
          this.menuOptions = [];
          const menu = {id: -1, name: '主类目', children: []};
          menu.children = response.data;
          this.menuOptions.push(menu);
        })
      },
      //后台返回的数据如果和Vue Treeselect要求的数据结构不同，需要进行转换
      normalizer(node){
        //将里面children=[]为空的时候去掉（如果不加的这句的话 如果里面children属性值为空 数状选择器里就给他默认有下一层  可里面没有所以显示空数据）
        if(node.children && !node.children.length){
          delete node.children;
        }
        // 将后台传来的数组进行修改
        return {
          id: node.id,
          label:node.name,
          children:node.children
        }
      },
      /** 修改按钮操作 */
      rowUpdate(row) {
        this.reset();
        this.loadMenuOptions();
        getSysMenuById(row.id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改菜单";
        });
      },
      rowDelete(row){
        this.$confirm('是否确认删除名称为"' + row.menuName + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return deleteMenu(row.id);
        }).then(() => {
          this.init();
          this.successMsg("删除成功");
        }).catch(function() {});
      },
      /** 批量删除操作 */
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择大于一条数据");
          return;
        }
        this.$confirm('是否确认删除所选择的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          return deleteMenu(this.ids);
        }).then(() => {
          this.init();
          this.successMsg("删除成功");
        }).catch(function() {});
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs["form"].validate(valid => {
          if (valid) {
            saveOrUpdateMenu(this.form).then(response => {
              if (response.code === 200) {
                this.successMsg("操作成功");
                this.open = false;
                this.init();
              }
            })
          }
        });
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      handleStatus(status){
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择大于一条数据");
          return;
        }
        let statusName = ""
        if (status == '0'){
          statusName = "启用"
        } else if (status == '1'){
          statusName = "禁用"
        }
        this.$confirm('是否确认'+statusName+'所选择的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          return statusMenu(this.ids, status);
        }).then(() => {
          this.init();
          this.successMsg("操作成功");
        }).catch(function() {});
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
      clearSearch(){
        this.datetime = [];
        this.search.keyword = '';
        this.search.endDate = null;
        this.search.startDate = null;
        this.init();
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
