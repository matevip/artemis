<template>
  <div class="app-container">
    <el-card class="box-card" shadow="never" style="border:0"
             body-style="background-color: #f3f3f3;padding: 10px 0 0;">
      <div slot="header">
        <span>字典列表</span>
        <div style="float: right; margin: -5px 0">
          <el-button type="primary"
                     size="small"
                     icon="el-icon-plus" plain
                     @click="handleAdd"
                     v-permission="['sys:dict:add']"
          >新增字典
          </el-button>
          <el-button
            type="success"
            size="small"
            icon="el-icon-download" plain
            v-permission="['sys:dict:export']"
            @click="handleExport"
          >字典导出
          </el-button>
        </div>
      </div>
    </el-card>
    <div class="table-body">
      <div class="app-search">
        <div class="search-box" flex="dir:left cross-center">
          <div class="div-box" flex="dir:left">
            <div flex="cross:center" style="height: 32px;">创建时间：</div>
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
              <el-input size="small" placeholder="请输入ID或者客户端标识搜索"
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
        <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="handleDelete"
                   v-permission="['sys:dict:delete']">批量删除
        </el-button>
      </div>
      <el-row :gutter="15">
        <!--角色管理-->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="margin-bottom: 10px">
          <el-card class="dict-card" shadow="never">
            <div slot="header">
              <span class="role-span">字典列表</span>
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
              @current-change="handleCurrentChange"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column label="字典ID">
                <template slot-scope="scope">
                  <span>{{scope.row.id}}</span>
                </template>
              </el-table-column>
              <el-table-column label="字典编号" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <span>{{scope.row.code}}</span>
                </template>
              </el-table-column>
              <el-table-column label="字典名称">
                <template slot-scope="scope">
                  <span>{{scope.row.dictValue}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="238">
                <template slot-scope="scope">
                  <el-button size="mini"
                             type="text"
                             icon="el-icon-edit"
                             @click="rowUpdate(scope.row)"
                             v-permission="['sys:dict:edit']"
                  >修改
                  </el-button>
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-plus"
                    @click="handleDictAdd(scope.row)"
                    v-permission="['sys:dict:add']"
                  >新增子项
                  </el-button>
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="rowDelete(scope.row)"
                    v-permission="['sys:dict:delete']"
                  >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="search.current"
              :limit.sync="search.size"
              @pagination="init"
            />
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-card class="dict-card" shadow="never">
            <div slot="header">
              <span class="role-span">>>字典项</span>
            </div>
            <el-table
              :data="dictData"
              :header-cell-style="headerCellStyle"
              :cell-style="cellStyle"
              row-key="id"
              border
              ref="multipleTable"
              size="small">
              <el-table-column label="字典ID" sortable>
                <template slot-scope="scope">
                  <span>{{scope.row.id}}</span>
                </template>
              </el-table-column>
              <el-table-column label="字典编号" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <span>{{scope.row.code}}</span>
                </template>
              </el-table-column>
              <el-table-column label="字典KEY">
                <template slot-scope="scope">
                  <span>{{scope.row.dictKey}}</span>
                </template>
              </el-table-column>
              <el-table-column label="字典值">
                <template slot-scope="scope">
                  <span>{{scope.row.dictValue}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="238">
                <template slot-scope="scope">
                  <el-button size="mini"
                             type="text"
                             icon="el-icon-edit"
                             @click="rowUpdate(scope.row)"
                             v-permission="['sys:client:edit']"
                  >修改
                  </el-button>
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="rowDelete(scope.row)"
                    v-permission="['sys:client:delete']"
                  >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>

        </el-col>
      </el-row>

    </div>
    <!-- 新增或修改字典对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="字典编号" prop="code">
              <el-input v-model="form.code" placeholder="请输入字典编号" :disabled="form.parentId != 0"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.parentId != 0" label="字典KEY" prop="dictKey">
              <el-input v-model="form.dictKey" placeholder="请输入字典Key"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.parentId != 0" label="字典值" prop="dictValue">
              <el-input v-model="form.dictValue" placeholder="请输入字典名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.parentId == 0" label="字典名称" prop="dictValue">
              <el-input v-model="form.dictValue" placeholder="请输入字典名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="字典备注" prop="remark">
              <el-input v-model="form.remark"
                        placeholder="请输入字典备注"/>
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
  import {getDictList, getDictListValue, getDictById, saveOrUpdateDict, deleteDict} from "@/api/system/dict";
  import {downloadFile} from '@/utils'
  // 权限判断指令
  import permission from '@/directive/permission/index'

  export default {
    directives: {permission},
    data() {
      return {
        data: [],
        //弹窗标题
        title: "",
        // 是否显示弹出层
        open: false,
        resetPwd: false,

        // 表单参数
        form: {
          code: undefined
        },
        datetime: undefined,
        selectionList: [],
        dictData: [],
        // 查询参数
        search: {
          current: 1,
          size: 10,
          status: undefined,
          keyword: undefined,
          startDate: undefined,
          endDate: undefined
        },
        total: 0,
        menuOptions: [],
        rules: {
          code: [
            {required: true, message: '请输入字典编号', trigger: 'blur'},
            {min: 1, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
          ],
          dictKey: [
            {required: true, message: '请输入字典KEY', trigger: 'blur'},
            {min: 1, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur'}
          ],
          dictValue: [
            {required: true, message: '请输入字典值', trigger: 'blur'},
            {min: 1, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur'}
          ],
        }
      }
    },
    created() {
      this.init()
    },
    computed: {
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
        // if (columnIndex !== 1 && columnIndex !== 3) {
        return 'text-align: center'
        // }
      },
      /** 初始化列表 */
      init() {
        this.fetchData()
      },
      fetchData() {
        this.listLoading = true
        getDictList(this.search).then(response => {
          this.data = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
        if (this.dictData.length != 0) {
          getDictListValue(this.dictData[0].code).then(response => {
            this.dictData = response.data
          })
        }
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "新增字典";
      },
      /** 新增字典项操作 */
      handleDictAdd(row) {
        this.reset();
        this.form.code = row.code;
        this.form.parentId = row.id;
        this.form.dictKey = '';
        this.open = true;
        this.title = "新增字典项";
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      changeDate() {
        if (this.datetime) {
          this.search.startDate = this.datetime[0];
          this.search.endDate = this.datetime[1];
        } else {
          this.search.startDate = null;
          this.search.endDate = null;
        }
        this.init();
      },
      toSearch() {
        this.init();
      },
      clearSearch() {
        this.datetime = [];
        this.search.keyword = '';
        this.search.endDate = null;
        this.search.startDate = null;
        this.init();
      },
      /** 批量删除操作 */
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择大于一条数据");
          return;
        }
        this.$confirm(`此操作将删除字典及对应的字典项所有数据，确认删除选中的${this.selectionList.length}条数据?`, "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          return deleteDict(this.ids);
        }).then(() => {
          this.init();
          this.successMsg("删除成功");
        }).catch(function () {
        });
      },
      /** 修改按钮操作 */
      rowUpdate(row) {
        this.reset();
        getDictById(row.id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改字典";
        });
      },
      rowDelete(row) {
        this.$confirm('是否确认删除名称为"' + row.code + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return deleteDict(row.id);
        }).then(() => {
          this.init();
          this.successMsg("删除成功");
        }).catch(function () {
        });
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs["form"].validate(valid => {
          if (valid) {
            saveOrUpdateDict(this.form).then(response => {
              if (response.code === 200) {
                this.successMsg("操作成功");
                this.open = false;
                this.init();
              }
            })
          }
        });
        if (this.dictData != undefined) {
          getDictListValue(this.dictData[0].code).then(response => {
            this.dictData = response.data
          })
        }
      },
      // 取消按钮
      cancel() {
        this.open = false;
      },
      // 表单重置
      reset() {
        this.form = {
          dictKey: -1,
          parentId: 0,
          code: undefined, 
        };
      },
      handleCurrentChange(currentRow, oldCurrentRow) {
        this.dictData = []
        this.selRow = currentRow
        getDictListValue(this.selRow.code).then(response => {
          this.dictData = response.data;
        })
      },
      handleExport() {
        exportClient().then(response => {
          downloadFile(response, "client", 'xlsx')
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

  .dict-card ::v-deep .el-card__header {
    padding: 12px 14px;
    font-size: 14px;
  }
</style>
