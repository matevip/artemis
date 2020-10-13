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
            v-permission="['sys:user:add']"
            >新增用户</el-button
          >
          <el-button
            type="success"
            size="small"
            icon="el-icon-download"
            plain
            v-permission="['sys:user:export']"
            @click="handleExport"
            >用户导出</el-button
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
        <template>
          <el-button
            size="mini"
            icon="el-icon-unlock"
            @click="handleStatus('0')"
            v-permission="['sys:user:enable']"
            >启用</el-button
          >
        </template>
        <template>
          <el-button
            size="mini"
            icon="el-icon-lock"
            @click="handleStatus('1')"
            v-permission="['sys:user:disable']"
            >禁用</el-button
          >
        </template>
        <el-button
          size="mini"
          type="danger"
          plain
          icon="el-icon-delete"
          @click="handleDelete"
          v-permission="['sys:user:delete']"
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
        @sort-change="sortChange"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="用户编号" prop="id" sortable="custom">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="账号" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.account }}</span>
          </template>
        </el-table-column>
        <el-table-column label="昵称">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色">
          <template slot-scope="scope">
            <el-tag size="small">{{ scope.row.roleName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="部门">
          <template slot-scope="scope">
            <el-tag size="small">{{ scope.row.departName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="手机号码">
          <template slot-scope="scope">
            <span>{{ scope.row.telephone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag size="small">{{ scope.row.statusName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="238">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="rowUpdate(scope.row)"
              v-permission="['sys:user:edit']"
              >修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-key"
              @click="rowReset(scope.row)"
              v-permission="['sys:user:edit']"
              >重置密码
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="rowDelete(scope.row)"
              v-permission="['sys:user:delete']"
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
          <el-col :span="12">
            <el-form-item label="账户" prop="account">
              <el-input v-model="form.account" placeholder="请输入账户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col v-if="!form.id" :span="12">
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="请输入密码"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="!form.id" :span="12">
            <el-form-item label="确认密码" prop="rePassword">
              <el-input
                v-model="form.rePassword"
                type="password"
                placeholder="请输入确认密码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" size="mini">
              <el-radio-group v-model="form.sex">
                <el-radio-button label="0">未知</el-radio-button>
                <el-radio-button label="1">男</el-radio-button>
                <el-radio-button label="2">女</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="telephone">
              <el-input v-model="form.telephone" placeholder="请输入手机号码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="roleId">
              <el-select v-model="form.roleId" placeholder="请选择">
                <el-option
                  v-for="item in roleTree"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="departId">
              <treeselect
                v-model="form.departId"
                placeholder="选择部门"
                :options="menuOptions"
                :normalizer="normalizer"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="出生日期">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="form.birthday"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户状态">
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

    <!-- 新增或修改菜单对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="resetPwd"
      width="600px"
      append-to-body
    >
      <el-form ref="pwdForm" :model="pwdForm" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="pwdForm.password"
                type="password"
                placeholder="请输入密码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="确认密码" prop="resetPassword">
              <el-input
                v-model="pwdForm.resetPassword"
                type="password"
                placeholder="请输入确认密码"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPwdForm">确 定</el-button>
        <el-button @click="pwdCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import flex from "@/styles/flex.css";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {
  getList,
  statusUser,
  getUserById,
  deleteUser,
  saveOrUpdateUser,
  savePwdUser,
  exportUser
} from "@/api/system/user";
import { getTree } from "@/api/system/depart";
import { getRoleTree } from "@/api/system/role";
import { downloadFile } from "@/utils";
// 权限判断指令
import permission from "@/directive/permission/index";

export default {
  components: { Treeselect },
  directives: { permission },
  data() {
    const rePassword = (rule, value, callback) => {
      if (value) {
        if (this.form.password !== value) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      } else {
        callback(new Error("请再次输入密码"));
      }
    };
    const resetPassword = (rule, value, callback) => {
      if (value) {
        if (this.pwdForm.password !== value) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      } else {
        callback(new Error("请再次输入密码"));
      }
    };
    return {
      data: [],
      //弹窗标题
      title: "",
      // 是否显示弹出层
      open: false,
      resetPwd: false,

      // 表单参数
      form: {
        password: "",
        rePassword: "",
        departId: "",
        roleId: ""
      },
      pwdForm: {
        id: ""
      },
      datetime: undefined,
      selectionList: [],
      roleTree: [],
      // 查询参数
      search: {
        current: 1,
        size: 10,
        keyword: undefined,
        prop: undefined,
        sort: undefined,
        startDate: undefined,
        endDate: undefined
      },
      total: 0,
      menuOptions: [],
      rules: {
        account: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        rePassword: [
          { required: true, validator: rePassword, trigger: "blur" }
        ],
        resetPassword: [
          { required: true, validator: resetPassword, trigger: "blur" }
        ],
        departId: [
          { required: true, message: "请选择部门", trigger: "change" }
        ],
        roleId: [{ required: true, message: "请选择角色", trigger: "change" }]
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
    /** 排序列表 */
    sortChange(column, prop, order) {
      if (column.prop != null && column.order != null) {
        this.search.prop = column.prop;
        this.search.order = column.order === "ascending" ? "asc" : "desc";
      }
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
      this.loadMenuOptions();
      this.getRoleTree();
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
    handleStatus(status) {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择大于一条数据");
        return;
      }
      let statusName = "";
      if (status == "0") {
        statusName = "启用";
      } else if (status == "1") {
        statusName = "禁用";
      }
      this.$confirm(
        `确认${statusName}选中的${this.selectionList.length}条数据?`,
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          return statusUser(this.ids, status);
        })
        .then(() => {
          this.init();
          this.successMsg("操作成功");
        })
        .catch(function() {});
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
          return deleteUser(this.ids);
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
      this.loadMenuOptions();
      this.getRoleTree();
      getUserById(row.id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户";
      });
    },
    /** 重置密码操作 */
    rowReset(row) {
      this.pwdReset();
      this.pwdForm.id = row.id;
      this.resetPwd = true;
    },
    rowDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return deleteUser(row.id);
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
          saveOrUpdateUser(this.form).then(response => {
            if (response.code === 200) {
              this.successMsg("操作成功");
              this.open = false;
              this.init();
            }
          });
        }
      });
    },
    /** 提交密码重置按钮 */
    submitPwdForm: function() {
      this.$refs["pwdForm"].validate(valid => {
        if (valid) {
          savePwdUser(this.pwdForm).then(response => {
            if (response.code === 200) {
              this.successMsg("操作成功");
              this.resetPwd = false;
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
    // 取消按钮
    pwdCancel() {
      this.resetPwd = false;
    },
    // 表单重置
    reset() {
      this.form = {
        // menuId: undefined,
        // menuName: undefined,
        password: undefined,
        sort: 1,
        // orderNum: undefined,
        status: "0",
        sex: "0",
        id: "0"
      };

      // this.resetForm("form");
    },
    pwdReset() {
      this.pwdForm = {
        password: undefined,
        resetPassword: undefined
      };
    },
    handleCurrentChange(currentRow, oldCurrentRow) {
      this.selRow = currentRow;
    },
    async loadMenuOptions() {
      getTree().then(response => {
        this.menuOptions = [];
        const menu = { id: -1, title: "主类目", children: [] };
        menu.children = response.data;
        this.menuOptions.push(menu);
      });
    },
    getRoleTree() {
      getRoleTree().then(response => {
        this.roleTree = response.data;
      });
    },
    //后台返回的数据如果和Vue Treeselect要求的数据结构不同，需要进行转换
    normalizer(node) {
      //将里面children=[]为空的时候去掉（如果不加的这句的话 如果里面children属性值为空 数状选择器里就给他默认有下一层  可里面没有所以显示空数据）
      if (node.children && !node.children.length) {
        delete node.children;
      }
      // 将后台传来的数组进行修改
      return {
        id: node.id,
        label: node.title,
        children: node.children
      };
    },
    handleExport() {
      exportUser().then(response => {
        downloadFile(response, "user", "xlsx");
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/mate.scss";
</style>
