<template>
  <div class="app-container">
    <el-card
      class="box-card"
      shadow="never"
      style="border: 0"
      body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <span>部门列表</span>
        <div style="float: right; margin: -5px 0">
          <el-button
            v-permission="['sys:depart:add']"
            type="primary"
            size="small"
            icon="el-icon-plus"
            plain
            @click="handleAdd"
          >
            新增部门
          </el-button>
          <el-button
            v-permission="['sys:depart:export']"
            type="success"
            size="small"
            icon="el-icon-download"
            plain
            @click="handleExport"
          >
            部门导出
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
                placeholder="请输入ID或者用户名搜索"
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
          v-permission="['sys:depart:delete']"
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
        <el-table-column label="名称" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="部门编号">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-permission="['sys:depart:edit']"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="rowUpdate(scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-permission="['sys:depart:add']"
              size="mini"
              type="text"
              icon="el-icon-plus"
              @click="handleAdd(scope.row)"
            >
              新增子项
            </el-button>
            <el-button
              v-permission="['sys:depart:delete']"
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
    </div>
    <!-- 新增或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级部门" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :options="departOptions"
                :normalizer="normalizer"
                :load-options="loadDepartOptions"
                placeholder="选择上级部门"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="账户" prop="name">
              <el-input v-model="form.name" placeholder="请输入账户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="创建日期" prop="createTime">
              <el-date-picker
                v-model="form.createTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
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
    getList,
    getTree,
    saveOrUpdateUser,
    getDepartById,
    deleteDepart,
    exportDepart,
  } from '@/api/system/depart'
  // 权限判断指令
  import permission from '@/directive/permission/index'
  import { downloadFile } from '@/utils'

  export default {
    components: { Treeselect },
    directives: { permission },
    data() {
      return {
        data: [],
        //弹窗标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 表单参数
        form: {},
        datetime: undefined,
        selectionList: [],
        // 查询参数
        search: {
          keyword: undefined,
          startDate: undefined,
          endDate: undefined,
        },
        departOptions: [],
        keyword: undefined,
        rules: {
          name: [
            { required: true, message: '请输入部门名称', trigger: 'blur' },
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'blur',
            },
          ],
          parentId: [
            { required: true, message: '请选择上级部门', trigger: 'change' },
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
        getList(this.search).then((response) => {
          this.data = response.data
          this.listLoading = false
        })
      },
      /** 新增按钮操作 */
      handleAdd(row) {
        this.reset()
        this.open = true
        this.loadDepartOptions()
        if (row != null) {
          this.form.parentId = row.id
        }
        this.title = '新增部门'
      },
      loadDepartOptions() {
        getTree().then((response) => {
          this.departOptions = []
          const menu = { id: -1, title: '顶级部门', children: [] }
          menu.children = response.data
          this.departOptions.push(menu)
        })
      },
      //后台返回的数据如果和Vue Treeselect要求的数据结构不同，需要进行转换
      normalizer(node) {
        //将里面children=[]为空的时候去掉（如果不加的这句的话 如果里面children属性值为空 数状选择器里就给他默认有下一层  可里面没有所以显示空数据）
        if (node.children && !node.children.length) {
          delete node.children
        }
        // 将后台传来的数组进行修改
        return {
          id: node.id,
          label: node.title,
          children: node.children,
        }
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
            return deleteDepart(this.ids)
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
        this.loadDepartOptions()
        getDepartById(row.id).then((response) => {
          this.form = response.data
          this.open = true
          this.title = '修改部门'
        })
      },
      rowDelete(row) {
        this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(function () {
            return deleteDepart(row.id)
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
            saveOrUpdateUser(this.form).then((response) => {
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
          // menuId: undefined,
          // menuName: undefined,
          sort: 1,
          // orderNum: undefined,
          // status: "0",
          name: undefined,
        }
        // this.resetForm("form");
      },
      handleCurrentChange(currentRow, oldCurrentRow) {
        this.selRow = currentRow
      },
      handleExport() {
        exportDepart().then((response) => {
          downloadFile(response, 'depart', 'xlsx')
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/mate.scss';
</style>
