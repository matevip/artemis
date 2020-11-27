<template>
  <div class="app-container">
    <el-card
      class="box-card"
      shadow="never"
      style="border: 0"
      body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <span>字典列表</span>
        <div style="float: right; margin: -5px 0">
          <el-button
            v-permission="['sys:dict:add']"
            type="primary"
            size="small"
            icon="el-icon-plus"
            plain
            @click="handleAdd"
          >
            新增字典
          </el-button>
          <el-button
            v-permission="['sys:dict:export']"
            type="success"
            size="small"
            icon="el-icon-download"
            plain
            @click="handleExport"
          >
            字典导出
          </el-button>
        </div>
      </div>
    </el-card>
    <div class="table-body">
      <div class="app-search">
        <div class="search-box" flex="dir:left cross-center">
          <div class="div-box" flex="dir:left">
            <div flex="cross:center" style="height: 32px">创建时间：</div>
            <el-date-picker
              v-model="datetime"
              size="small"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changeDate"
            ></el-date-picker>
          </div>
          <div class="input-item div-box" flex="cross-center">
            <div>
              <el-input
                v-model="search.keyword"
                size="small"
                placeholder="请输入ID或者客户端标识搜索"
                clearable
                @clear="toSearch"
                @keyup.enter.native="toSearch"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="toSearch"
                ></el-button>
              </el-input>
            </div>
          </div>
          <div class="div-box clear-where" flex="cross:center">
            <el-button
              class="filter-item"
              size="small"
              icon="el-icon-refresh-left"
              @click="clearSearch"
            >
              重置
            </el-button>
          </div>
        </div>
      </div>
      <div class="app-batch" flex="dir:left cross:center">
        <el-button
          v-permission="['sys:dict:delete']"
          size="mini"
          type="danger"
          icon="el-icon-delete"
          @click="handleDelete"
        >
          批量删除
        </el-button>
      </div>
      <el-row :gutter="15">
        <!--角色管理-->
        <el-col
          :xs="24"
          :sm="24"
          :md="12"
          :lg="12"
          :xl="12"
          style="margin-bottom: 10px"
        >
          <el-card class="dict-card" shadow="never">
            <div slot="header">
              <span class="role-span">字典列表</span>
            </div>
            <el-table
              ref="multipleTable"
              :data="data"
              :header-cell-style="headerCellStyle"
              :cell-style="cellStyle"
              row-key="id"
              border
              size="small"
              :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
              @selection-change="selectionChange"
              @current-change="handleCurrentChange"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column label="字典ID">
                <template slot-scope="scope">
                  <span>{{ scope.row.id }}</span>
                </template>
              </el-table-column>
              <el-table-column label="字典编号" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <span>{{ scope.row.code }}</span>
                </template>
              </el-table-column>
              <el-table-column label="字典名称">
                <template slot-scope="scope">
                  <span>{{ scope.row.dictValue }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="238">
                <template slot-scope="scope">
                  <el-button
                    v-permission="['sys:dict:edit']"
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="rowUpdate(scope.row)"
                  >
                    修改
                  </el-button>
                  <el-button
                    v-permission="['sys:dict:add']"
                    size="mini"
                    type="text"
                    icon="el-icon-plus"
                    @click="handleDictAdd(scope.row)"
                  >
                    新增子项
                  </el-button>
                  <el-button
                    v-permission="['sys:dict:delete']"
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="rowDelete(scope.row)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-pagination
              v-show="total > 0"
              background
              :current-page="search.current"
              :page-size="search.size"
              :layout="layout"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-card class="dict-card" shadow="never">
            <div slot="header">
              <span class="role-span">>>字典项</span>
            </div>
            <el-table
              ref="multipleTable"
              :data="dictData"
              :header-cell-style="headerCellStyle"
              :cell-style="cellStyle"
              row-key="id"
              border
              size="small"
            >
              <el-table-column label="字典ID" sortable>
                <template slot-scope="scope">
                  <span>{{ scope.row.id }}</span>
                </template>
              </el-table-column>
              <el-table-column label="字典编号" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <span>{{ scope.row.code }}</span>
                </template>
              </el-table-column>
              <el-table-column label="字典KEY">
                <template slot-scope="scope">
                  <span>{{ scope.row.dictKey }}</span>
                </template>
              </el-table-column>
              <el-table-column label="字典值">
                <template slot-scope="scope">
                  <span>{{ scope.row.dictValue }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="238">
                <template slot-scope="scope">
                  <el-button
                    v-permission="['sys:client:edit']"
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="rowUpdate(scope.row)"
                  >
                    修改
                  </el-button>
                  <el-button
                    v-permission="['sys:client:delete']"
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="rowDelete(scope.row)"
                  >
                    删除
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
              <el-input
                v-model="form.code"
                placeholder="请输入字典编号"
                :disabled="form.parentId != 0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              v-if="form.parentId != 0"
              label="字典KEY"
              prop="dictKey"
            >
              <el-input v-model="form.dictKey" placeholder="请输入字典Key" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              v-if="form.parentId != 0"
              label="字典值"
              prop="dictValue"
            >
              <el-input v-model="form.dictValue" placeholder="请输入字典名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              v-if="form.parentId == 0"
              label="字典名称"
              prop="dictValue"
            >
              <el-input v-model="form.dictValue" placeholder="请输入字典名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="字典备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入字典备注" />
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
  import {
    getDictList,
    getDictListValue,
    getDictById,
    saveOrUpdateDict,
    deleteDict,
  } from '@/api/system/dict'
  import { downloadFile } from '@/utils'
  // 权限判断指令
  import permission from '@/directive/permission/index'

  export default {
    directives: { permission },
    data() {
      return {
        data: [],
        //弹窗标题
        title: '',
        // 是否显示弹出层
        open: false,
        resetPwd: false,

        // 表单参数
        form: {
          code: undefined,
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
          endDate: undefined,
        },
        total: 0,
        menuOptions: [],
        layout: 'total, sizes, prev, pager, next, jumper',
        rules: {
          code: [
            { required: true, message: '请输入字典编号', trigger: 'blur' },
            {
              min: 1,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'blur',
            },
          ],
          dictKey: [
            { required: true, message: '请输入字典KEY', trigger: 'blur' },
            {
              min: 1,
              max: 30,
              message: '长度在 2 到 30 个字符',
              trigger: 'blur',
            },
          ],
          dictValue: [
            { required: true, message: '请输入字典值', trigger: 'blur' },
            {
              min: 1,
              max: 50,
              message: '长度在 2 到 50 个字符',
              trigger: 'blur',
            },
          ],
        },
      }
    },
    computed: {
      ids() {
        let ids = []
        this.selectionList.forEach((ele) => {
          ids.push(ele.id)
        })
        return ids.join(',')
      },
    },
    created() {
      this.init()
    },
    methods: {
      // 更改表头样式
      headerCellStyle({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === 0) {
          return 'background-color: #fafafa;color: #000;font-weight: 500; text-align: center'
        }
      },
      // 更改表头样式
      cellStyle({ row, column, rowIndex, columnIndex }) {
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
        getDictList(this.search).then((response) => {
          this.data = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
        if (this.dictData.length != 0) {
          getDictListValue(this.dictData[0].code).then((response) => {
            this.dictData = response.data
          })
        }
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.open = true
        this.title = '新增字典'
      },
      /** 新增字典项操作 */
      handleDictAdd(row) {
        this.reset()
        this.form.code = row.code
        this.form.parentId = row.id
        this.form.dictKey = ''
        this.open = true
        this.title = '新增字典项'
      },
      selectionChange(list) {
        this.selectionList = list
      },
      changeDate() {
        if (this.datetime) {
          this.search.startDate = this.datetime[0]
          this.search.endDate = this.datetime[1]
        } else {
          this.search.startDate = null
          this.search.endDate = null
        }
        this.init()
      },
      toSearch() {
        this.init()
      },
      clearSearch() {
        this.datetime = []
        this.search.keyword = ''
        this.search.endDate = null
        this.search.startDate = null
        this.init()
      },
      /** 批量删除操作 */
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning('请选择大于一条数据')
          return
        }
        this.$confirm(
          `此操作将删除字典及对应的字典项所有数据，确认删除选中的${this.selectionList.length}条数据?`,
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(() => {
            return deleteDict(this.ids)
          })
          .then(() => {
            this.init()
            this.$baseMessage('删除成功', 'success')
          })
          .catch(function () {})
      },
      /** 修改按钮操作 */
      rowUpdate(row) {
        this.reset()
        getDictById(row.id).then((response) => {
          this.form = response.data
          this.open = true
          this.title = '修改字典'
        })
      },
      rowDelete(row) {
        this.$confirm('是否确认删除名称为"' + row.code + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(function () {
            return deleteDict(row.id)
          })
          .then(() => {
            this.init()
            this.$baseMessage('删除成功', 'success')
          })
          .catch(function () {})
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            saveOrUpdateDict(this.form).then((response) => {
              if (response.code === 200) {
                this.$baseMessage('操作成功', 'success')
                this.open = false
                this.init()
              }
            })
          }
        })
        if (this.dictData != undefined) {
          getDictListValue(this.dictData[0].code).then((response) => {
            this.dictData = response.data
          })
        }
      },
      // 取消按钮
      cancel() {
        this.open = false
      },
      // 表单重置
      reset() {
        this.form = {
          dictKey: -1,
          parentId: 0,
          code: undefined,
        }
      },
      // handleCurrentChange(currentRow, oldCurrentRow) {
      //   this.dictData = []
      //   this.selRow = currentRow
      //   getDictListValue(this.selRow.code).then((response) => {
      //     this.dictData = response.data
      //   })
      // },
      handleExport() {
        exportClient().then((response) => {
          downloadFile(response, 'client', 'xlsx')
        })
      },
      handleSizeChange(val) {
        this.search.size = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.search.current = val
        this.dictData = []
        this.selRow = val
        getDictListValue(this.selRow.code).then((response) => {
          this.dictData = response.data
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/mate.scss';
  .dict-card ::v-deep .el-card__header {
    padding: 12px 14px;
    font-size: 14px;
  }
</style>
