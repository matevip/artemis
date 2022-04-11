<template>
  <PageWrapper :title="getTitle" @back="goBack" contentFullHeight fixedHeight contextBackground>
    <template #extra>
      <space size="middle">
        <a-button @click="showData" type="primary">获取数据</a-button>
      </space>
    </template>
    <template #footer>
      <Tabs v-model:activeKey="currentKey" @change="handleModeChange">
        <TabPane v-for="(item, index) in codeList" :key="index" :tab="item.name" />
      </Tabs>
    </template>
    <CodeEditor v-model:value="codeValue" :mode="codeMode" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref, h, unref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { Modal, Space, Tabs, TabPane } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { DataMode } from '/@/api/devops/model/codeModel';
  import { CodeEditor, JsonPreview } from '/@/components/CodeEditor';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useGo } from '/@/hooks/web/usePage';
  import { tablePreview } from '/@/api/devops/code';

  const currentKey = ref(0);
  const getTitle = ref('');
  const codeMode = ref<DataMode>(DataMode.VM);
  const codeValue = ref('');
  const route = useRoute();
  const { setTitle } = useTabs();
  const codeList = ref([]);
  const go = useGo();

  onMounted(() => {
    create();
  });

  async function create() {
    const tableName = route.query.tableName as string;
    const comment = route.query.comment as string;
    codeList.value = await tablePreview(tableName);
    getTitle.value = comment;
    handleModeChange();
    setTitle('生成预览：' + getTitle.value);
  }

  function showData() {
    if (unref(codeMode) === DataMode.JSON) {
      Modal.info({
        title: '编辑器当前值',
        content: h(JsonPreview, { data: JSON.parse(codeValue.value) }),
      });
    } else {
      Modal.info({ title: '编辑器当前值', content: codeValue.value });
    }
  }
  function handleModeChange() {
    codeMode.value = codeList.value[currentKey.value].language as DataMode;
    codeValue.value = codeList.value[currentKey.value]?.template;
  }
  /** 返回代码生成页 */
  function goBack() {
    // useUserStore().getRoutePath('-1');
    go('/devops/generator');
  }
</script>
