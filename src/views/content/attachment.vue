<template>
  <div class="app-container">
    <el-card
      class="box-card"
      shadow="never"
      style="border:0"
      body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <span>文件管理</span>
        <div style="float: right; margin: -5px 0">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            plain
            @click="handleAdd"
            v-permission="['sys:attach:add']"
          >文件上传</el-button>
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
            ></el-date-picker>
          </div>
          <div class="input-item div-box" flex="cross-center">
            <div>
              <el-input
                size="small"
                placeholder="请输入ID或者标题搜索"
                v-model="search.keyword"
                clearable
                @clear="toSearch"
                @keyup.enter.native="toSearch"
              >
                <el-button slot="append" icon="el-icon-search" @click="toSearch"></el-button>
              </el-input>
            </div>
          </div>
          <div class="div-box clear-where" flex="cross:center">
            <el-button
              class="filter-item"
              size="small"
              icon="el-icon-refresh-left"
              @click="clearSearch"
            >重置</el-button>
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
          v-permission="['sys:attach:delete']"
        >批量删除</el-button>
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
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="编号" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="显示" sortable>
          <template slot-scope="scope">
            <el-avatar
              v-if="scope.row.type == 1 "
              shape="square"
              :size="100"
              fit="scale-down"
              :src="scope.row.url"
            ></el-avatar>
            <span v-if="scope.row.type != 1 ">{{scope.row.url}}</span>
          </template>
        </el-table-column>
        <el-table-column label="大小" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{scope.row.size}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="rowDelete(scope.row)"
              v-permission="['sys:attach:delete']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="search.current"
        :limit.sync="search.size"
        @pagination="init"
      />
    </div>
    <!-- 上传对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="400px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <el-upload class="file-upload" drag :action="uploadUrl" :file-list="form.fileList" multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
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
import request from "@/utils/request";

import { getAttachmentList, deleteAttachment } from "@/api/content/attachment";
import { downloadFile } from "@/utils";
// 权限判断指令
import permission from "@/directive/permission/index";
import mate from "@/config/mate"

export default {
  directives: { permission },
  data() {
    return {
      data: [],
      //弹窗标题
      title: "",
      // 是否显示弹出层
      open: false,
      uploadUrl: mate.apiUrl.pro + '/mate-component/sys-attachment/upload',

      // 表单参数
      form: {},
      datetime: undefined,
      selectionList: [],
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
    };
  },
  created() {
    this.init();
  },
  computed: {
    ids() {
      let ids = [];
      this.selectionList.forEach((ele) => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
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
      getAttachmentList(this.search).then((response) => {
        this.data = response.data.records;
        this.total = response.data.total;
        this.listLoading = false;
      });
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
          type: "warning",
        }
      )
        .then(() => {
          return deleteLog(this.ids);
        })
        .then(() => {
          this.init();
          this.successMsg("删除成功");
        })
        .catch(function () {});
    },
    rowDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return deleteLog(row.id);
        })
        .then(() => {
          this.init();
          this.successMsg("删除成功");
        })
        .catch(function () {});
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    // 表单重置
    reset() {
      this.form = {
        sort: 1,
        status: "0",
      };
    },
    handleCurrentChange(currentRow, oldCurrentRow) {
      this.selRow = currentRow;
    },
    handleExport() {
      exportClient().then((response) => {
        downloadFile(response, "client", "xlsx");
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "文件上传";
    },
    rowDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return deleteAttachment(row.id);
        })
        .then(() => {
          this.init();
          this.successMsg("删除成功");
        })
        .catch(function () {});
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
          type: "warning",
        }
      )
        .then(() => {
          return deleteAttachment(this.ids);
        })
        .then(() => {
          this.init();
          this.successMsg("删除成功");
        })
        .catch(function () {});
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        console.log(this.form)
        this.init();
        this.open = false;
      });
    },
    // uploadUrl: function () {
    //   return "/mate-component/sys-attachment/upload";
    // },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  background-color: rgb(243, 243, 243);
}

.block {
  padding: 10px 0px;
}

.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.table-body {
  padding: 20px;
  background-color: #fff;
}

.table-body .edit-sort-img {
  width: 14px;
  height: 14px;
  margin-left: 5px;
  cursor: pointer;
}

.app-search .search-box {
  margin-bottom: 10px;
}

.app-search .div-box {
  margin-right: 10px;
}

.app-search .input-item {
  display: inline-block;
  width: 250px;
}

.app-search .input-item .el-input__inner {
  border-right: 0;
}

.app-search .input-item .el-input__inner:hover {
  border: 1px solid #dcdfe6;
  border-right: 0;
  outline: 0;
}

.app-search .input-item .el-input__inner:focus {
  border: 1px solid #dcdfe6;
  border-right: 0;
  outline: 0;
}

.app-search .input-item .el-input-group__append {
  background-color: #fff;
  border-left: 0;
  width: 10%;
  padding: 0;
}

.app-search .input-item .el-input-group__append .el-button {
  padding: 0;
}

.app-search .input-item .el-input-group__append .el-button {
  margin: 0;
}

.app-search .clear-where {
  color: #419efb;
  cursor: pointer;
}

.app-batch {
  height: 50px;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  padding: 0 22px;
  margin-bottom: 10px;
}

.app-batch .batch-box {
  margin-left: 10px;
}

.app-batch .batch-remark {
  margin-top: 5px;
  color: #999999;
  font-size: 14px;
}

.app-batch .select-count {
  font-size: 14px;
  margin-left: 10px;
}

.app-batch .batch-title {
  font-size: 18px;
}

.app-batch .batch-box-left {
  width: 120px;
  border-right: 1px solid #e2e2e2;
  padding: 0 20px;
}

.app-batch .batch-box-left div {
  padding: 5px 0;
  margin: 5px 0;
  cursor: pointer;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
}

.app-batch .batch-div-active {
  background-color: #e2e2e2;
}

.app-batch .el-dialog__body {
  padding: 15px 20px;
}

.app-batch .batch-box-right {
  padding: 5px 20px;
}

.app-batch .express-dialog .el-dialog {
  min-width: 250px;
}

.app-batch .add-express-rule {
  margin-left: 20px;
  cursor: pointer;
  color: #419efb;
}

.app-batch .confine-box .label {
  margin-right: 10px;
}

.app-batch .goods-price .el-input-group__prepend {
  width: 80px;
}
</style>