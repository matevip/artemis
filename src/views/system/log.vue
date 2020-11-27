<template>
  <div class="app-container">
    <el-card
      class="box-card"
      shadow="never"
      style="border: 0"
      body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <span>日志列表</span>
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
                placeholder="请输入ID或者标题搜索"
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
          v-permission="['sys:log:delete']"
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
        @sort-change="sortChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="日志编号">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="TRACEID">
          <template slot-scope="scope">
            <span>{{ scope.row.traceId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.createBy }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行方法">
          <template slot-scope="scope">
            <el-tag size="small">{{ scope.row.method }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="请求路径">
          <template slot-scope="scope">
            <el-tag size="small">{{ scope.row.url }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="IP地址">
          <template slot-scope="scope">
            <span>{{ scope.row.ip }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地区">
          <template slot-scope="scope">
            <span>{{ scope.row.location }}</span>
          </template>
        </el-table-column>
        <el-table-column label="耗时">
          <template slot-scope="scope">
            <span>{{ scope.row.executeTime }}ms</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" sortable="custom">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="238">
          <template slot-scope="scope">
            <el-button
              v-permission="['sys:log:detail']"
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="rowView(scope.row)"
            >
              详细日志
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
    <!-- 查看 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="请求参数" prop="params">
              <el-input v-model="params" type="textarea" :rows="6" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="返回结果" prop="operation">
              <el-input v-model="operation" type="textarea" :rows="12" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import flex from '@/styles/flex.css'
  import { getLogList, deleteLog } from '@/api/system/log'
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
        params: '',
        operation: '',

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
      /** 排序列表 */
      sortChange(column, prop, order) {
        if (column.prop != null && column.order != null) {
          this.search.prop = column.prop
          this.search.order = column.order === 'ascending' ? 'asc' : 'desc'
        }
        this.fetchData()
      },
      fetchData() {
        this.listLoading = true
        getLogList(this.search).then((response) => {
          this.data = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
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
          `确认删除选中的${this.selectionList.length}条数据?`,
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(() => {
            return deleteLog(this.ids)
          })
          .then(() => {
            this.init()
            this.$baseMessage('删除成功', 'success')
          })
          .catch(function () {})
      },
      rowDelete(row) {
        this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(function () {
            return deleteLog(row.id)
          })
          .then(() => {
            this.init()
            this.$baseMessage('删除成功', 'success')
          })
          .catch(function () {})
      },
      rowView(row) {
        this.open = true
        this.title = '查看详细日志'
        this.params = row.params
        this.operation = row.operation
      },
      handleSizeChange(val) {
        this.search.size = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.search.current = val
        this.fetchData()
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
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/mate.scss';
</style>
