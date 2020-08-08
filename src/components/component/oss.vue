<template>
  <div>
    <el-table
      :data="data"
      :header-cell-style="headerCellStyle"
      :cell-style="cellStyle"
      row-key="id"
      border
      ref="multipleTable"
      size="small"
    >
      <el-table-column label="存储位置" sortable>
        <template slot-scope="scope">
          <span>{{scope.row.oss}}</span>
        </template>
      </el-table-column>
      <el-table-column label="默认存储">
        <template slot-scope="scope">
          <el-switch
            @change="handleEnable(scope.row)"
            active-value="1"
            inactive-value="0"
            v-model="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="238">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="rowUpdate(scope.row)"
            v-permission="['sys:client:edit']"
          >修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增或修改客户端对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="存储服务URL" prop="endpoint">
              <el-input v-model="form.endpoint" placeholder="请输入存储服务URL" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="自定义域名" prop="customDomain">
              <el-input v-model="form.customDomain" placeholder="请输入自定义域名" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="AccessKey" prop="accessKey">
              <el-input v-model="form.accessKey" placeholder="请输入AccessKey" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="SecretKey" prop="secretKey">
              <el-input v-model="form.secretKey" placeholder="请输入SecretKey" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="空间名" prop="bucketName">
              <el-input v-model="form.bucketName" placeholder="请输入空间名" />
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
import { getConfigByCode, saveConfigOss } from "@/api/system/config";
export default {
  data() {
    return {
      data: [
        {
          code: "alioss",
          oss: "阿里云OSS",
        },
        {
          code: "qiniuoss",
          oss: "七牛云OSS",
        },
        {
          code: "miniooss",
          oss: "本地Minio存储",
        },
      ],
      title: "",
      open: false,
      form: {
        code: undefined,
      },
    };
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
    /** 修改按钮操作 */
    rowUpdate(row) {
      //   this.reset();

      getConfigByCode(row.code).then((response) => {
        this.form = response.data;
        this.form.code = row.code;
        this.open = true;
        this.title = row.oss + "配置编辑";
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          saveConfigOss(this.form).then((response) => {
            if (response.code === 200) {
              this.successMsg("操作成功");
              this.open = false;
              this.init();
            }
          });
        }
      });
    },
  },
};
</script>

<style>
</style>