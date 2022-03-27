<template>
  <div class="bg-white m-4 mr-0 overflow-hidden">
    <BasicTree
      title="数据源"
      toolbar
      search
      :clickRowToExpand="false"
      :treeData="treeData"
      :replaceFields="{ key: 'title' }"
      @select="handleSelect"
    />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';

  import { BasicTree, TreeItem } from '/@/components/Tree';
  import { optionList } from '/@/api/devops/datasource';
  const emit = defineEmits(['select']);

  const treeData = ref<TreeItem[]>([]);

  async function fetch() {
    treeData.value = (await optionList()) as unknown as TreeItem[];
  }

  function handleSelect(keys: string) {
    emit('select', keys[0]);
  }

  onMounted(() => {
    fetch();
  });
</script>
