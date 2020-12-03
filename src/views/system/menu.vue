<template>
  <div class="app-container">
    <el-card
      class="box-card"
      shadow="never"
      style="border: 0"
      body-style="background-color: #f3f3f3;padding: 3px 0 0;"
    >
      <div slot="header">
        <span>菜单列表</span>
        <div style="float: right; margin: -5px 0">
          <el-button
            v-permission="['sys:menu:add']"
            type="primary"
            size="small"
            icon="el-icon-plus"
            plain
            @click="handleAdd"
          >
            新增菜单
          </el-button>
          <el-button
            v-permission="['sys:menu:export']"
            type="success"
            size="small"
            icon="el-icon-download"
            plain
            @click="handleExport"
          >
            菜单导出
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
                placeholder="请输入ID或者名称搜索"
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
          v-permission="['sys:menu:enable']"
          size="mini"
          type="primary"
          icon="el-icon-unlock"
          @click="handleStatus('0')"
        >
          启用
        </el-button>
        <el-button
          v-permission="['sys:menu:disable']"
          size="mini"
          type="primary"
          icon="el-icon-lock"
          @click="handleStatus('1')"
        >
          禁用
        </el-button>
        <el-button
          v-permission="['sys:menu:delete']"
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
        <el-table-column label="菜单名称" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图标">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column label="组件路径">
          <template slot-scope="scope">
            <span>{{ scope.row.path }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <el-tag size="small">{{ scope.row.typeName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope" width="30">
            <span v-if="!isEdit" @click="editSort(scope.row)">
              {{ scope.row.sort }}
            </span>
            <el-input
              v-if="isEdit"
              v-model="scope.row.sort"
              style="width: 60px"
            ></el-input>
            <el-button
              v-if="!isEdit"
              class="edit-sort"
              type="text"
              @click="editSort(scope.row)"
            >
              <svg-icon icon-class="edit"></svg-icon>
            </el-button>
            <el-button
              v-if="isEdit"
              class="edit-sort"
              type="text"
              @click="submitSort(scope.row)"
            >
              <svg-icon icon-class="add"></svg-icon>
            </el-button>
          </template>
          <div style="display: flex; align-items: center">
            <el-input
              v-model="sort"
              style="min-width: 70px"
              type="number"
              size="mini"
              class="change"
              autocomplete="off"
            ></el-input>
            <el-button
              class="change-quit"
              type="text"
              style="padding: 0 5px; color: #f56c6c"
              icon="el-icon-error"
              circle
              @click="quit()"
            ></el-button>
            <el-button
              class="change-success"
              type="text"
              style="padding: 0 5px; margin-left: 0; color: #67c23a"
              icon="el-icon-success"
              circle
              @click="changeSortSubmit(scope.row)"
            ></el-button>
          </div>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-permission="['sys:menu:edit']"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="rowUpdate(scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-permission="['sys:menu:add']"
              size="mini"
              type="text"
              icon="el-icon-plus"
              @click="handleAdd(scope.row)"
            >
              新增子项
            </el-button>
            <el-button
              v-permission="['sys:menu:delete']"
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
            <el-form-item label="上级菜单" prop="parentId">
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
              <el-radio-group
                v-model="form.type"
                size="mini"
                style="width: 178px"
              >
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
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input
                  slot="reference"
                  v-model="form.icon"
                  placeholder="点击选择图标"
                  readonly
                >
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="width: 16px; height: 32px"
                  />
                  <i
                    v-else
                    slot="prefix"
                    class="el-icon-search el-input__icon"
                  />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number
                v-model="form.sort"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.type != 2" label="路由地址" prop="path">
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.type != 0" label="权限标识">
              <el-input
                v-model="form.permission"
                placeholder="请权限标识"
                maxlength="50"
              />
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
          <el-col :span="12">
            <el-form-item label="是否隐藏">
              <el-radio-group v-model="form.hidden" size="mini">
                <el-radio-button label="0">显示</el-radio-button>
                <el-radio-button label="1">隐藏</el-radio-button>
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
  import {
    getList,
    saveOrUpdateMenu,
    getAsyncList,
    getSysMenuById,
    deleteMenu,
    statusMenu,
    exportMenu,
  } from '@/api/system/menu'
  import { downloadFile } from '@/utils'
  import Treeselect from '@riophae/vue-treeselect'
  import IconSelect from '@/components/IconSelect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  // 权限判断指令
  import permission from '@/directive/permission/index'

  export default {
    components: { Treeselect, IconSelect },
    directives: { permission },
    data() {
      return {
        data: [],
        menuOptions: [],
        selectionList: [],
        // 查询参数
        search: {
          keyword: undefined,
          startDate: undefined,
          endDate: undefined,
        },
        datetime: undefined,
        //弹窗标题
        title: '',
        // 是否显示弹出层
        open: false,
        sort: 0,
        // 表单参数
        form: {},
        // 显示状态数据字典
        visibleOptions: [],
        // 菜单状态数据字典
        statusOptions: [],
        multipleSelection: [],
        isEdit: false,
        rules: {
          name: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' },
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'blur',
            },
          ],
          parentId: [
            { required: true, message: '请选择上级菜单', trigger: 'change' },
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
      init() {
        this.fetchData()
      },
      // 选择图标
      selected(name) {
        this.form.icon = name
      },
      // 更改表头样式
      headerCellStyle({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === 0) {
          return 'background-color: #fafafa;color: #000;font-weight: 500; text-align: center'
        }
      },
      // 更改表头样式
      cellStyle({ row, column, rowIndex, columnIndex }) {
        if (columnIndex !== 1 && columnIndex !== 3) {
          return 'text-align: center'
        }
      },
      fetchData() {
        this.listLoading = true
        getList(this.search).then((response) => {
          this.data = response.data
          this.listLoading = false
        })
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
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
          isFrame: '1',
          visible: '0',
          status: '0',
          hidden: '0',
        }
      },
      /** 新增按钮操作 */
      handleAdd(row) {
        this.reset()
        // this.getTreeSelect();
        this.loadMenuOptions()
        if (row != null) {
          this.form.parentId = row.id
        }
        this.open = true
        this.title = '新增菜单'
      },
      async loadMenuOptions() {
        getAsyncList().then((response) => {
          this.menuOptions = []
          const menu = { id: -1, label: '主类目', children: [] }
          menu.children = response.data
          this.menuOptions.push(menu)
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
          label: node.label,
          children: node.children,
        }
      },
      /** 修改按钮操作 */
      rowUpdate(row) {
        this.reset()
        this.loadMenuOptions()
        getSysMenuById(row.id).then((response) => {
          this.form = response.data
          this.open = true
          this.title = '修改菜单'
        })
      },
      rowDelete(row) {
        this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(function () {
            return deleteMenu(row.id)
          })
          .then(() => {
            this.init()
            this.$baseMessage('删除成功', 'success')
          })
          .catch(function () {})
      },
      /** 批量删除操作 */
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$baseMessage('请选择大于一条数据', 'error')
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
            return deleteMenu(this.ids)
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
            saveOrUpdateMenu(this.form).then((response) => {
              if (response.code === 200) {
                this.$baseMessage('操作成功', 'success')
                this.open = false
                this.init()
              }
            })
          }
        })
      },
      selectionChange(list) {
        this.selectionList = list
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
            return statusMenu(this.ids, status)
          })
          .then(() => {
            this.init()
            this.$baseMessage('操作成功', 'success')
          })
          .catch(function () {})
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
      handleIcon(item) {
        this.icon = item
      },
      handleExport() {
        exportMenu().then((response) => {
          downloadFile(response, 'menu', 'xlsx')
        })
      },
      editSort(row) {
        this.sort = row.sort
        this.isEdit = true
      },
      submitSort(row) {
        saveOrUpdateMenu(row).then((response) => {
          if (response.code === 200) {
            this.$baseMessage('操作成功', 'success')
            this.init()
            this.isEdit = false
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/mate.scss';
</style>
