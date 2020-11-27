<template>
  <div class="app-container">
    <el-card
      class="box-card"
      shadow="never"
      style="border: 0"
      body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <span>API列表</span>
        <div style="float: right; margin: -5px 0">
          <el-button
            v-permission="['gw:api:sync']"
            type="success"
            size="small"
            icon="el-icon-refresh-right"
            plain
            @click="handleSync"
          >
            同步API
          </el-button>
        </div>
      </div>
    </el-card>
    <div v-cloak id="app" class="dialog">
      <div flex="box:first" style="min-height: 68vh; margin-bottom: 10px">
        <div style="margin-right: 15px; border: 1px solid #e3e3e3">
          <el-menu
            v-loading="groupListLoading"
            class="group-menu"
            mode="vertical"
          >
            <el-scrollbar style="width: 100%; height: 635px">
              <el-menu-item index="all" @click="switchRoute(-1)">
                <i class="el-icon-box"></i>
                <span>全部</span>
              </el-menu-item>
              <template v-for="(item, index) in routeItem">
                <el-menu-item
                  :key="index"
                  :index="'' + index + ''"
                  @click="switchRoute(item.name)"
                >
                  <div flex="dir:left box:last">
                    <div style="overflow: hidden; text-overflow: ellipsis">
                      <i class="el-icon-box"></i>
                      <span>{{ item.name }}</span>
                    </div>
                  </div>
                </el-menu-item>
              </template>
            </el-scrollbar>
          </el-menu>
        </div>

        <div flex="dir:top" class="box">
          <div class="box-right">
            <div class="app-search">
              <div class="search-box" flex="dir:left cross-center">
                <div class="div-box" flex="dir:left">
                  <div flex="cross:center" style="height: 32px; color: #000">
                    创建时间：
                  </div>
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
                      placeholder="请输入code或者路径"
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
                v-permission="['gw:api:del']"
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
              <el-table-column label="编码" sortable>
                <template slot-scope="scope">
                  <span>{{ scope.row.code }}</span>
                </template>
              </el-table-column>
              <el-table-column label="服务ID" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <span>{{ scope.row.serviceId }}</span>
                </template>
              </el-table-column>
              <el-table-column label="名称" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="路径">
                <template slot-scope="scope">
                  <span>{{ scope.row.path }}</span>
                </template>
              </el-table-column>
              <el-table-column label="方法">
                <template slot-scope="scope">
                  <span>{{ scope.row.method }}</span>
                </template>
              </el-table-column>
              <el-table-column label="认证校验">
                <template slot-scope="scope">
                  <el-tag
                    size="small"
                    :type="scope.row.auth == 1 ? 'success' : 'danger'"
                  >
                    {{ scope.row.auth == 1 ? '身份认证' : '忽略认证' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope">
                  <el-tag
                    size="small"
                    :type="scope.row.status == 1 ? '' : 'danger'"
                  >
                    {{ scope.row.status == 1 ? '启用' : '禁用' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    v-permission="['gw:api:edit']"
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="rowUpdate(scope.row)"
                  >
                    修改
                  </el-button>
                  <el-button
                    v-permission="['gw:api:del']"
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
        </div>
      </div>
    </div>

    <!-- 新增或修改客户端对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="编码" prop="code">
              <el-input v-model="form.code" placeholder="请输入编码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="服务ID" prop="serviceId">
              <el-input v-model="form.serviceId" placeholder="请输入服务Id" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="路径" prop="path">
              <el-input v-model="form.path" placeholder="请输入路径" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="请求方法" prop="method">
              <el-select
                v-model="form.method"
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
            <el-form-item label="认证检验">
              <el-radio-group v-model="form.auth" size="mini">
                <el-radio-button label="1">身份认证</el-radio-button>
                <el-radio-button label="0">忽略认证</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="类名" prop="className">
              <el-input v-model="form.className" placeholder="请输入类名" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="notes">
              <el-input v-model="form.notes" placeholder="请输入类名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="API状态">
              <el-radio-group v-model="form.status" size="mini">
                <el-radio-button label="1">启用</el-radio-button>
                <el-radio-button label="0">禁用</el-radio-button>
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
    getApiList,
    getApiById,
    saveOrUpdateApi,
    deleteApi,
    statusApi,
    syncApi,
  } from '@/api/gateway/api'
  import { listRoute } from '@/api/gateway/route'
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
        startTime: undefined,
        endTime: undefined,
        groupListLoading: false,

        // 表单参数
        form: {},
        methods: [
          { id: 1, name: 'GET' },
          { id: 2, name: 'POST' },
        ],
        datetime: undefined,
        selectionList: [],
        routeItem: [],
        // 查询参数
        search: {
          current: 1,
          size: 10,
          status: undefined,
          keyword: undefined,
          startDate: undefined,
          endDate: undefined,
          serviceId: '-1',
        },
        total: 0,
        menuOptions: [],
        layout: 'total, sizes, prev, pager, next, jumper',
        rules: {
          code: [
            { required: true, message: '请输入编码', trigger: 'blur' },
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'blur',
            },
          ],
          serviceId: [
            { required: true, message: '请输入服务ID', trigger: 'blur' },
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'blur',
            },
          ],
          name: [
            { required: true, message: '请输入API名称', trigger: 'blur' },
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'blur',
            },
          ],
          path: [
            { required: true, message: '请输入路径', trigger: 'blur' },
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
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
        this.loadList()
      },
      fetchData() {
        this.listLoading = true
        getApiList(this.search).then((response) => {
          this.data = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      },
      /**　查询路由列表 */
      loadList() {
        this.groupListLoading = true
        listRoute().then((response) => {
          this.groupListLoading = false
          this.routeItem = response.data
        })
      },
      /** 根据serviceId切换路由 */
      switchRoute(serviceId) {
        this.search.serviceId = serviceId
        this.fetchData()
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
        if (status == '1') {
          statusName = '启用'
        } else if (status == '0') {
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
            return statusApi(this.ids, status)
          })
          .then(() => {
            this.init()
            this.$baseMessage('操作成功', 'success')
          })
          .catch(function () {})
      },
      handleSync() {
        this.$confirm(
          `确认同步API数据么，同步后所有API数据将会进行新增和更新?`,
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(() => {
            return syncApi(this.ids, status)
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
            return deleteApi(this.ids)
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
        getApiById(row.id).then((response) => {
          this.form = response.data
          this.open = true
          this.title = '修改黑名单'
        })
      },
      rowDelete(row) {
        this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(function () {
            return deleteApi(row.id)
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
            saveOrUpdateApi(this.form).then((response) => {
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
          status: '1',
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
  .box {
    background: #fff;
    border: 1px solid #e3e3e3;
  }

  .box .el-scrollbar__wrap {
    overflow-y: hidden;
  }
  .dialog {
    display: -webkit-box;
    margin-top: 0px;
    margin-right: auto;
    overflow: hidden;
    font-size: 13px;
    color: #fff;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
  .box-right {
    margin: 20px;
  }
  @import '@/styles/mate.scss';
</style>
