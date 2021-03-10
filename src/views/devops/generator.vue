<template>
  <div class="app-container">
    <el-card
      class="box-card"
      shadow="never"
      style="border: 0"
      body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <span>代码生成</span>
      </div>
    </el-card>
    <div class="table-body">
      <div class="app-search">
        <div flex="wrap:wrap cross:center">
          <div class="item-box" flex="dir:left cross:center">
            <div class="label">数据源:</div>
            <el-select
              v-model="search.datasourceId"
              style="width: 120px"
              size="small"
              @change="toTableList"
            >
              <el-option
                v-for="item in optionList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>

      <div class="app-batch" flex="dir:left cross:center">
        <el-button
          v-permission="['devops:gen']"
          size="mini"
          type="danger"
          icon="el-icon-delete"
          @click="handleGen"
        >
          代码生成
        </el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="data"
        :header-cell-style="headerCellStyle"
        :cell-style="cellStyle"
        row-key="name"
        border
        size="small"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column label="数据表" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据表名称">
          <template slot-scope="scope">
            <span>{{ scope.row.comment }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-permission="['devops:gen']"
              size="mini"
              type="text"
              icon="el-icon-paperclip"
              @click="rowGen(scope.row)"
            >
              生成代码
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
              <el-input v-model="form.packageName" placeholder="请输入包名" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="表前缀" prop="driverClass">
              <el-input v-model="form.prefix" placeholder="请输入表前缀" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="模块名称" prop="url">
              <el-input v-model="form.modelName" placeholder="请输入模块名称" />
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
  import { getTableList, genCode } from '@/api/devops/generator'
  // 权限判断指令
  import permission from '@/directive/permission/index'
  import { optionList } from '@/api/devops/datasource'
  import { downloadFile } from '@/utils'

  export default {
    directives: { permission },
    data() {
      return {
        data: [],
        //弹窗标题
        title: '',
        // 是否显示弹出层
        open: false,
        optionList: [],
        // 表单参数
        form: {
          packageName: undefined,
          prefix: undefined,
          modelName: undefined,
          datasourceId: undefined,
          tableName: undefined,
        },
        // 查询参数
        search: {
          datasourceId: undefined,
        },
      }
    },
    computed: {
      ids() {
        let ids = []
        this.selectionList.forEach((ele) => {
          ids.push(ele.name)
        })
        console.log(ids.join('--'))
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
        optionList().then((response) => {
          this.optionList = response.data
        })
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.open = true
        this.title = '生成配置信息'
      },
      rowGen(row) {
        this.reset()
        this.open = true
        this.title = '生成配置信息'
        this.form.tableName = row.name
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
      /** 修改按钮操作 */
      rowUpdate(row) {
        this.reset()
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs['form'].validate((valid) => {
          this.form.datasourceId = this.search.datasourceId
          if (valid) {
            genCode(this.form).then((data) => {
              downloadFile(data.data, 'code', 'zip')
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
          packageName: 'vip.mate',
          prefix: 'mate_',
          modelName: '模块',
          tableName: undefined,
        }
        // this.resetForm("form");
      },
      handleCurrentChange(currentRow, oldCurrentRow) {
        this.selRow = currentRow
      },
      toTableList() {
        getTableList(this.search.datasourceId).then((resp) => {
          this.data = resp.data
        })
      },
      handleGen() {
        this.reset()
        this.open = true
        this.title = '生成配置信息'
        this.form.tableName = this.ids
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/mate.scss';
  .app-search .label {
    margin-right: 10px;
  }
  .app-search .item-box {
    margin-right: 15px;
    margin-bottom: 10px;
  }
</style>
