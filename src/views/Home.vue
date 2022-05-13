<template>
  <div class="fullscreen">
    <bpmn-page :bpmnId="bpmnId" @eventClose="eventClose" @eventSave="eventSave" />
  </div>
</template>

<script>
import bpmnPage from '@/components/bpmnPackage/bpmnPage.vue'

export default {
  name: 'Home',
  components: {
    bpmnPage,
  },
  data() {
    return {
      bpmnId: 'xxx',
    }
  },
  methods: {
    eventClose() {},
    eventSave(param) {
      console.log('参数：', param)
    }
  },
}
</script>

<style lang="scss" scoped>
.fullscreen {
  width: 100%;
  height: 100vh;
}
</style>
