<template>
  <div class="app-container">
    <el-card
      class="box-card"
      shadow="never"
      style="border:0"
      body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <span>用户列表</span>
        <div style="float: right; margin: -5px 0">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            plain
            @click="handleAdd"
            v-permission="['sys:datasource:add']"
            >新增数据源</el-button
          >
          <el-button
            type="success"
            size="small"
            icon="el-icon-download"
            plain
            v-permission="['sys:datasource:export']"
            >数据源导出</el-button
          >
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
              v-model="datetime"
            >
            </el-date-picker>
          </div>
          <div class="input-item div-box" flex="cross-center">
            <div>
              <el-input
                size="small"
                placeholder="请输入ID或者用户名搜索"
                v-model="search.keyword"
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
              >重置</el-button
            >
          </div>
        </div>
      </div>
      <div class="app-batch" flex="dir:left cross:center">
        <el-button
          size="mini"
          type="danger"
          plain
          icon="el-icon-delete"
          @click="handleDelete"
          v-permission="['sys:datasource:delete']"
          >批量删除</el-button
        >
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
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="编号" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-tag size="small">{{ scope.row.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="类型" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.dbType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="驱动类型">
          <template slot-scope="scope">
            <span>{{ scope.row.driverClass }}</span>
          </template>
        </el-table-column>
        <el-table-column label="连接地址">
          <template slot-scope="scope">
            <span>{{ scope.row.url }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="rowUpdate(scope.row)"
              v-permission="['sys:datasource:edit']"
              >修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="rowDelete(scope.row)"
              v-permission="['sys:datasource:delete']"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="search.current"
        :limit.sync="search.size"
        @pagination="init"
      />
    </div>
    <!-- 新增或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="数据库类型" prop="dbType">
              <el-select
                v-model="form.dbType"
                placeholder="请选择"
                @change="getDicValue"
              >
                <el-option
                  v-for="item in dbDic"
                  :key="item.id"
                  :disabled="item.dictKey === '-1'"
                  :label="item.dictKey"
                  :value="item.dictKey"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入数据源名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="驱动类型" prop="driverClass">
              <el-input
                v-model="form.driverClass"
                placeholder="请输入驱动类型"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="连接地址" prop="url">
              <el-input
                v-model="form.url"
                type="textarea"
                :rows="4"
                placeholder="请输入连接地址"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入密码" />
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
import flex from "@/styles/flex.css";
import { getTree } from "@/api/system/depart";
import { getDictCodeList, getDictValue } from "@/api/system/dict";
import {
  getList,
  getDataSourceById,
  saveOrUpdateDataSource,
  deleteDataSource
} from "@/api/devops/datasource";
// 权限判断指令
import permission from "@/directive/permission/index";

export default {
  directives: { permission },
  data() {
    return {
      data: [],
      //弹窗标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      datetime: undefined,
      selectionList: [],
      roleTree: [],
      dbDic: [],
      // 查询参数
      search: {
        current: 1,
        size: 10,
        account: undefined,
        telephone: undefined,
        status: undefined,
        departId: undefined,
        keyword: undefined,
        keyword: undefined,
        startDate: undefined,
        endDate: undefined
      },
      total: 0,
      rules: {
        name: [
          { required: true, message: "请输入数据源名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        driverClass: [
          { required: true, message: "请输入驱动类型", trigger: "blur" }
        ],
        url: [{ required: true, message: "请输入连接地址", trigger: "blur" }],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.init();
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
    headerCellStyle({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background-color: #fafafa;color: #000;font-weight: 500; text-align: center";
      }
    },
    // 更改表头样式
    cellStyle({ row, column, rowIndex, columnIndex }) {
      // if (columnIndex !== 1 && columnIndex !== 3) {
      return "text-align: center";
      // }
    },
    /** 初始化列表 */
    init() {
      this.fetchData();
    },
    fetchData() {
      this.listLoading = true;
      getList(this.search).then(response => {
        this.data = response.data.records;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getDic();
      this.open = true;
      this.title = "新增用户";
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
    /**获取字典列表**/
    getDic() {
      getDictCodeList("dbtype").then(response => {
        this.dbDic = response.data;
      });
    },
    /**将字典值赋值至driveClass**/
    getDicValue(value) {
      getDictValue("dbtype", value).then(response => {
        this.form.driverClass = response.data;
      });
    },
    toSearch() {
      this.init();
    },
    clearSearch() {
      this.datetime = [];
      this.search.keyword = "";
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
      this.$confirm(
        `确认删除选中的${this.selectionList.length}条数据?`,
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          return deleteDataSource(this.ids);
        })
        .then(() => {
          this.init();
          this.successMsg("删除成功");
        })
        .catch(function() {});
    },
    /** 修改按钮操作 */
    rowUpdate(row) {
      this.reset();
      this.getDic();
      getDataSourceById(row.id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户";
      });
    },
    rowDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return deleteDataSource(row.id);
        })
        .then(() => {
          this.init();
          this.successMsg("删除成功");
        })
        .catch(function() {});
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          saveOrUpdateDataSource(this.form).then(response => {
            if (response.code === 200) {
              this.successMsg("操作成功");
              this.open = false;
              this.init();
            }
          });
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    // 表单重置
    reset() {
      this.form = {
        name: undefined,
        driverClass: undefined
      };
      // this.resetForm("form");
    },
    handleCurrentChange(currentRow, oldCurrentRow) {
      this.selRow = currentRow;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/mate.scss";
</style>
