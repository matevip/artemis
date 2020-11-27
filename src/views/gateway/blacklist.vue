<template>
  <div class="app-container">
    <el-card
      class="box-card"
      shadow="never"
      style="border: 0"
      body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <span>黑名单列表</span>
        <div style="float: right; margin: -5px 0">
          <el-button
            v-permission="['gw:bl:add']"
            type="primary"
            size="small"
            icon="el-icon-plus"
            plain
            @click="handleAdd"
          >
            新增黑名单
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
                placeholder="请输入ID或者拦截路径"
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
          v-permission="['gw:bl:status']"
          size="mini"
          type="primary"
          icon="el-icon-unlock"
          @click="handleStatus('0')"
        >
          启用
        </el-button>
        <el-button
          v-permission="['gw:bl:status']"
          size="mini"
          type="primary"
          icon="el-icon-lock"
          @click="handleStatus('1')"
        >
          禁用
        </el-button>
        <el-button
          v-permission="['gw:bl:del']"
          size="mini"
          type="danger"
          icon="el-icon-delete"
          @click="handleDelete"
        >
          批量删除
        </el-button>
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
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="IP地址" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.ip == null ? '*' : scope.row.ip }}</span>
          </template>
        </el-table-column>
        <el-table-column label="请求地址" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.requestUri }}</span>
          </template>
        </el-table-column>
        <el-table-column label="请求方法">
          <template slot-scope="scope">
            <span>{{ scope.row.requestMethod }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag size="small" :type="scope.row.status == 0 ? '' : 'danger'">
              {{ scope.row.status == 0 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="238">
          <template slot-scope="scope">
            <el-button
              v-permission="['gw:bl:edit']"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="rowUpdate(scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-permission="['gw:bl:del']"
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
    </div>
    <!-- 新增或修改客户端对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="IP地址" prop="ip">
              <el-input v-model="form.ip" placeholder="请输入IP地址" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="请求地址" prop="requestUri">
              <el-input
                v-model="form.requestUri"
                placeholder="请输入请求地址,支持通配符"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="请求方法" prop="requestMethod">
              <el-select
                v-model="form.requestMethod"
                value=""
                placeholder="请选择请求方法"
                style="width: 100%"
              >
                <el-option
                  v-for="item in methods"
                  :key="item.id"
                  :label="item.name"
                  :value="String(item.name)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="时间范围" prop="range">
              <el-time-picker
                v-model="form.startTime"
                arrow-control
                :picker-options="{
                  selectableRange: '00:00:00 - 23:59:59',
                }"
                placeholder="开始时间"
              ></el-time-picker>
              &nbsp;
              <el-time-picker
                v-model="form.endTime"
                arrow-control
                :picker-options="{
                  selectableRange: '00:00:00 - 23:59:59',
                }"
                placeholder="结束时间"
              ></el-time-picker>
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
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {
    getBlackListList,
    getBlacklistById,
    saveOrUpdateBlacklist,
    deleteBlacklist,
    statusBlacklist,
  } from '@/api/gateway/blacklist'
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
        startTime: undefined,
        endTime: undefined,

        // 表单参数
        form: {},
        methods: [
          { id: 1, name: 'GET' },
          { id: 2, name: 'POST' },
          { id: 3, name: 'ALL' },
        ],
        datetime: undefined,
        selectionList: [],
        roleTree: [],
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
          requestUri: [
            { required: true, message: '请输入请求地址', trigger: 'blur' },
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'blur',
            },
          ],
          requestMethod: [
            { required: true, message: '请选择请求方法', trigger: 'change' },
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
        getBlackListList(this.search).then((response) => {
          this.data = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.open = true
        this.title = '新增客户端'
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
      handleStatus(status) {
        if (this.selectionList.length === 0) {
          this.$message.warning('请选择大于一条数据')
          return
        }
        let statusName = ''
        if (status == '0') {
          statusName = '启用'
        } else if (status == '1') {
          statusName = '禁用'
        }
        this.$confirm(
          `确认${statusName}选中的${this.selectionList.length}条数据?`,
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(() => {
            return statusBlacklist(this.ids, status)
          })
          .then(() => {
            this.init()
            this.$baseMessage('操作成功', 'success')
          })
          .catch(function () {})
      },
      /** 批量删除操作 */
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning('请选择大于一条数据')
          return
        }
        this.$confirm(
          `确认删除选中的${this.selectionList.length}条数据?`,
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(() => {
            return deleteBlacklist(this.ids)
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
        getBlacklistById(row.id).then((response) => {
          this.form = response.data
          this.open = true
          this.title = '修改黑名单'
        })
      },
      rowDelete(row) {
        this.$confirm(
          '是否确认删除名称为"' + row.requestUri + '"的数据项?',
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(function () {
            return deleteBlacklist(row.id)
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
            saveOrUpdateBlacklist(this.form).then((response) => {
              if (response.code === 200) {
                this.$baseMessage('操作成功', 'success')
                this.open = false
                this.init()
              }
            })
          }
        })
      },
      // 取消按钮
      cancel() {
        this.open = false
      },
      // 表单重置
      reset() {
        this.form = {
          sort: 1,
          status: '0',
        }
      },
      // handleCurrentChange(currentRow, oldCurrentRow) {
      //   this.selRow = currentRow
      // },
      handleSizeChange(val) {
        this.search.size = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.search.current = val
        this.fetchData()
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/mate.scss';
</style>
