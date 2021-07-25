<template>
  <i-frame :src="url" />
</template>
<script>
  import iFrame from '@/components/iFrame/index'
  export default {
    name: 'Druid',
    components: { iFrame },
    data() {
      return {
        url: 'http://doc.mate.vip',
      }
    },
  }
</script>
