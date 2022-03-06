<template>
  <div class="panel-tab__content">
    <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="类型">
        <a-select label-in-value placeholder="请选择类型" @change="changeLoopCharacteristicsType">
          <a-select-option value="Null"> 无 </a-select-option>
          <a-select-option value="ParallelMultiInstance"> 并行多重事件 </a-select-option>
          <a-select-option value="SequentialMultiInstance"> 顺序多重事件 </a-select-option>
        </a-select>
      </a-form-model-item>
      <template v-if="loopCharacteristics === 'ParallelMultiInstance' || loopCharacteristics === 'SequentialMultiInstance'">
        <a-form-model-item label="循环基数">
          <a-input v-model="loopInstanceForm.loopCardinality" allowClear @change="updateLoopCardinality(loopInstanceForm.loopCardinality)" />
        </a-form-model-item>
        <a-form-model-item label="集合" key="collection">
          <a-input v-model="loopInstanceForm.collection" allowClear @change="updateLoopBase" />
        </a-form-model-item>
        <a-form-model-item label="元素变量" key="elementVariable">
          <a-input v-model="loopInstanceForm.elementVariable" allowClear @change="updateLoopBase" />
        </a-form-model-item>
        <a-form-model-item label="完成条件" key="completionCondition">
          <a-input v-model="loopInstanceForm.completionCondition" allowClear @change="updateLoopCondition(loopInstanceForm.completionCondition)" />
        </a-form-model-item>
      </template>
    </a-form-model>
    <div
      data-show="true"
      class="ant-alert ant-alert-info ant-alert-with-description ant-alert-no-icon"
    >
      <span class="ant-alert-message">配置说明</span
      ><span class="ant-alert-description"
        ><div>
          1.${flowUtil.stringToList(assigneeUserIdList)},将字符串转换成集合,暴露的SpringBean方法<br />
          2.多实例任务默认会创建3个流程变量,nrOfInstances:实例总数，nrOfActiveInstances:当前活跃的，也就是当前还未完成的，对于顺序的多实例，此值总是1,nrOfCompletedInstances:已完成的实例个数。<br />
          3.不启动多实例,则只会创建一个任务，默认不启动，不启动多实例，配置都无效<br /></div
      ></span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CounterSign',
  props: {
    businessObject: Object,
    type: String,
  },
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },

      loopCharacteristics: '',
      //默认配置，用来覆盖原始不存在的选项，避免报错
      defaultLoopInstanceForm: {
        completionCondition: '',
        loopCardinality: '',
        extensionElements: [],
      },
      loopInstanceForm: {},
    }
  },
  watch: {
    businessObject: {
      immediate: true,
      handler(val) {
        this.bpmnElement = window.bpmnInstances.bpmnElement
        this.getElementLoop(val)
      },
    },
  },
  methods: {
    getElementLoop(businessObject) {
      if (!businessObject.loopCharacteristics) {
        this.loopCharacteristics = 'Null'
        this.loopInstanceForm = {}
        return
      }
      if (
        businessObject.loopCharacteristics.$type ===
        'bpmn:StandardLoopCharacteristics'
      ) {
        this.loopCharacteristics = 'StandardLoop'
        this.loopInstanceForm = {}
        return
      }
      if (businessObject.loopCharacteristics.isSequential) {
        this.loopCharacteristics = 'SequentialMultiInstance'
      } else {
        this.loopCharacteristics = 'ParallelMultiInstance'
      }
      // 合并配置
      this.loopInstanceForm = {
        ...this.defaultLoopInstanceForm,
        ...businessObject.loopCharacteristics,
        completionCondition:
          businessObject.loopCharacteristics?.completionCondition?.body ?? '',
        loopCardinality:
          businessObject.loopCharacteristics?.loopCardinality?.body ?? '',
      }
      // 保留当前元素 businessObject 上的 loopCharacteristics 实例
      this.multiLoopInstance =
        window.bpmnInstances.bpmnElement.businessObject.loopCharacteristics
      // 更新表单
      if (
        businessObject.loopCharacteristics.extensionElements &&
        businessObject.loopCharacteristics.extensionElements.values &&
        businessObject.loopCharacteristics.extensionElements.values.length
      ) {
        this.$set(
          this.loopInstanceForm,
          'timeCycle',
          businessObject.loopCharacteristics.extensionElements.values[0].body
        )
      }
    },
    changeLoopCharacteristicsType(e) {
      const { key: type } = e;
      this.loopCharacteristics = type;
      // this.loopInstanceForm = { ...this.defaultLoopInstanceForm }; // 切换类型取消原表单配置
      // 取消多实例配置
      if (type === 'Null') {
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
          loopCharacteristics: null,
        })
        return
      }
      // 顺序
      if (type === 'SequentialMultiInstance') {
        this.multiLoopInstance = window.bpmnInstances.moddle.create(
          'bpmn:MultiInstanceLoopCharacteristics',
          {
            isSequential: true,
          }
        )
      } else {
        this.multiLoopInstance = window.bpmnInstances.moddle.create(
          'bpmn:MultiInstanceLoopCharacteristics'
        )
      }
      console.log("multiLoopInstance-1:", this.multiLoopInstance);
      console.log("loopCharacteristics-1:", this.loopCharacteristics);
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
        loopCharacteristics: this.multiLoopInstance,
      })
    },
    // 循环基数
    updateLoopCardinality(cardinality) {
      console.log('cardinality:', cardinality)
      let loopCardinality = null
      if (cardinality && cardinality.length) {
        loopCardinality = window.bpmnInstances.moddle.create(
          'bpmn:FormalExpression',
          { body: cardinality }
        )
      }
      window.bpmnInstances.modeling.updateModdleProperties(
        this.bpmnElement,
        this.multiLoopInstance,
        {
          loopCardinality,
        }
      )
    },
    // 完成条件
    updateLoopCondition(condition) {
      let completionCondition = null
      if (condition && condition.length) {
        completionCondition = window.bpmnInstances.moddle.create(
          'bpmn:FormalExpression',
          { body: condition }
        )
      }
      window.bpmnInstances.modeling.updateModdleProperties(
        this.bpmnElement,
        this.multiLoopInstance,
        {
          completionCondition,
        }
      )
    },
    // 直接更新的基础信息
    updateLoopBase() {
      window.bpmnInstances.modeling.updateModdleProperties(
        this.bpmnElement,
        this.multiLoopInstance,
        {
          collection: this.loopInstanceForm.collection || null,
          elementVariable: this.loopInstanceForm.elementVariable || null,
        }
      )
    },
  },
  beforeDestroy() {
    this.multiLoopInstance = null
    this.bpmnElement = null
  },
}
</script>

<style lang="scss" scoped></style>
