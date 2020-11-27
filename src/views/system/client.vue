<template>
  <div class="app-container">
    <el-card
      class="box-card"
      shadow="never"
      style="border: 0"
      body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <span>客户端列表</span>
        <div style="float: right; margin: -5px 0">
          <el-button
            v-permission="['sys:client:add']"
            type="primary"
            size="small"
            icon="el-icon-plus"
            plain
            @click="handleAdd"
          >
            新增客户端
          </el-button>
          <el-button
            v-permission="['sys:client:export']"
            type="success"
            size="small"
            icon="el-icon-download"
            plain
            @click="handleExport"
          >
            客户端导出
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
          v-permission="['sys:client:status']"
          size="mini"
          icon="el-icon-unlock"
          type="primary"
          @click="handleStatus('0')"
        >
          启用
        </el-button>
        <el-button
          v-permission="['sys:client:status']"
          size="mini"
          icon="el-icon-lock"
          type="primary"
          @click="handleStatus('1')"
        >
          禁用
        </el-button>
        <el-button
          v-permission="['sys:client:status']"
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
        <el-table-column label="客户端ID">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户端标识" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.clientId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户端密钥">
          <template slot-scope="scope">
            <span>{{ scope.row.clientSecret }}</span>
          </template>
        </el-table-column>
        <el-table-column label="授权类型">
          <template slot-scope="scope">
            <span>{{ scope.row.authorizedGrantTypes }}</span>
          </template>
        </el-table-column>
        <el-table-column label="授权范围">
          <template slot-scope="scope">
            <el-tag size="small">{{ scope.row.scope }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="令牌过期秒数">
          <template slot-scope="scope">
            <span>{{ scope.row.accessTokenValidity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="刷新令牌过期秒数">
          <template slot-scope="scope">
            <el-tag size="small">{{ scope.row.refreshTokenValidity }}</el-tag>
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
          <el-col :span="12">
            <el-form-item label="客户端标识" prop="clientId">
              <el-input
                v-model="form.clientId"
                placeholder="请输入客户端标识"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户端密钥" prop="clientSecret">
              <el-input
                v-model="form.clientSecret"
                placeholder="请输入客户端密钥"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="授权类型" prop="authorizedGrantTypes">
              <el-input
                v-model="form.authorizedGrantTypes"
                type="textarea"
                value="refresh_token,password,authorization_code"
                placeholder="请输入授权类型"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="授权范围" prop="scope">
              <el-input
                v-model="form.scope"
                value="all"
                placeholder="请输入授权范围"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="过期秒数" prop="accessTokenValidity">
              <el-input
                v-model="form.accessTokenValidity"
                placeholder="请输入令牌过期秒数"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="刷新秒数" prop="refreshTokenValidity">
              <el-input
                v-model="form.refreshTokenValidity"
                placeholder="请输入刷新秒数"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="回调地址" prop="webServerRedirectUri">
              <el-input
                v-model="form.webServerRedirectUri"
                placeholder="请输入刷新秒数"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="附加说明" prop="additionalInformation">
              <el-input
                v-model="form.additionalInformation"
                placeholder="请输入附加说明"
              />
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
    getClientList,
    statusClient,
    getClientById,
    deleteClient,
    saveOrUpdateClient,
    exportClient,
  } from '@/api/system/client'
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
        form: {},
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
          account: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'blur',
            },
          ],
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'blur',
            },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            {
              min: 6,
              max: 20,
              message: '长度在 6 到 20 个字符',
              trigger: 'blur',
            },
          ],
          departId: [
            { required: true, message: '请选择部门', trigger: 'change' },
          ],
          roleId: [
            { required: true, message: '请选择角色', trigger: 'change' },
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
        getClientList(this.search).then((response) => {
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
            return statusClient(this.ids, status)
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
            return deleteClient(this.ids)
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
        getClientById(row.id).then((response) => {
          this.form = response.data
          this.open = true
          this.title = '修改客户端'
        })
      },
      rowDelete(row) {
        this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(function () {
            return deleteClient(row.id)
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
            saveOrUpdateClient(this.form).then((response) => {
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
        this.fetchData()
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/mate.scss';
</style>
