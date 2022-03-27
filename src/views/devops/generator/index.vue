<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <RouteTree class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <BasicTable @register="registerTable" class="w-3/4 xl:w-4/5" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="error" @click="handleSync">批量生成</a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: IconEnum.PREVIEW,
              tooltip: '预览',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: IconEnum.EDIT,
              tooltip: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: IconEnum.DOWNLOAD,
              tooltip: '下载',
              onClick: handleEdit.bind(null, record),
            },
          ]"
          :dropDownActions="[
            {
              icon: IconEnum.EXPORT,
              label: '生成',
            },
            {
              icon: IconEnum.DELETE,
              label: '删除',
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <ApiDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  // 引入基础组件
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  // 插入数据内容
  import { columns, searchFormSchema } from './api.data';
  // 通过API接口获取日志
  import { page, sync, del } from '/@/api/gateway/api';

  import { useDrawer } from '/@/components/Drawer';
  import ApiDrawer from './ApiDrawer.vue';

  import { useMessage } from '/@/hooks/web/useMessage';
  import RouteTree from './DataSourceTree.vue';
  import { tablePage } from '/@/api/devops/code';
  import { IconEnum } from '/@/enums/artemisEnum';
  const { createMessage } = useMessage();
  const searchInfo = reactive<Recordable>({});

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTable, { reload }] = useTable({
    title: '数据表',
    api: tablePage,
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
    },
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: true,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });

  // function handleCreate() {
  //   openDrawer(true, {
  //     isUpdate: false,
  //   });
  // }
  async function handleSync() {
    await sync();
    handleSuccess();
  }
  function handleEdit(record: Recordable) {
    openDrawer(true, {
      record,
      isUpdate: true,
    });
  }

  async function handleDelete(record: Recordable) {
    await del({ ids: record.id });
    createMessage.success('删除成功!');
    handleSuccess();
  }

  function handleSelect(dsName = '') {
    searchInfo.dsName = dsName;
    reload();
  }

  function handleSuccess() {
    reload();
  }
</script>
