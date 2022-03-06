<template>
  <div class="panel-tab__content">
    <a-form-model
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <template v-if="elementBaseInfo.$type === 'bpmn:Process'">
        <a-form-model-item label="流程类型">
          <a-select
            label-in-value
            :default-value="{key: tabkeys}"
            placeholder="请选择流程类型"
            @change="(e) => {tabkeys = e.key}"
          >
            <a-select-option value="test">
              测试流程
            </a-select-option>
            <a-select-option value="oa">
              OA办公
            </a-select-option>
            <a-select-option value="business">
              业务办理
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="流程key">
          <a-input
            v-model="elementBaseInfo.id"
            placeholder="请输入流程key"
            allow-clear
            disabled
          >
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="流程名称">
          <a-input
            v-model="elementBaseInfo.name"
            placeholder="请输入流程名称"
            allow-clear
            @change="updateBaseInfo('name')"
          >
          </a-input>
        </a-form-model-item>
      </template>
      <template v-if="elementBaseInfo.$type !== 'bpmn:Process'">
        <a-form-model-item label="节点key">
          <a-input
            v-model="elementBaseInfo.id"
            placeholder="请输入节点key"
            allow-clear
            @change="updateBaseInfo('id')"
          >
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="节点名称">
          <a-input
            v-model="elementBaseInfo.name"
            placeholder="请输入节点名称"
            allow-clear
            @change="updateBaseInfo('name')"
          >
          </a-input>
        </a-form-model-item>
        <a-form-model-item
          v-if="elementBaseInfo.$type === 'bpmn:StartEvent'"
          label="发起人"
        >
          <a-input
            v-model="elementBaseInfo.initiator"
            placeholder="请输入发起人"
            allow-clear
            @change="updateBaseInfo('initiator')"
          >
          </a-input>
        </a-form-model-item>
      </template>
      <a-form-model-item label="描述">
        <a-textarea
          v-model="documentation"
          placeholder="请输入描述"
          allow-clear
          @input="updateDocumentation"
          @blur="updateDocumentation"
        >
        </a-textarea>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script>
export default {
  name: "ElementBaseInfo",
  props: {
    businessObject: Object,
    type: String,
    idEditDisabled: {
      type: Boolean,
      default: true,
    },
    id: String
  },
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      elementBaseInfo: {},
      documentation: "",
      tabkeys: "test"
    };
  },
  watch: {
    businessObject: {
      immediate: false,
      handler: function (val) {
        if (val) {
          this.$nextTick(() => this.resetBaseInfo());
        }
      },
    },
    id: {
      immediate: true,
      handler: function(id) {
        if (id && id.length) {
          this.$nextTick(() => {
            const documentations = window.bpmnInstances.bpmnElement.businessObject?.documentation;
            this.documentation = documentations && documentations.length ? documentations[0].text : "";
          });
        } else {
          this.documentation = "";
        }
      }
    }
  },
  methods: {
    resetBaseInfo() {
      this.bpmnElement = window?.bpmnInstances?.bpmnElement;
      this.elementBaseInfo = JSON.parse(
        JSON.stringify(this.bpmnElement.businessObject)
      );
      console.log('elementBaseInfo-2:', this.elementBaseInfo)
    },
    updateBaseInfo(key) {
      const attrObj = Object.create(null);
      attrObj[key] = this.elementBaseInfo[key];
      if (key === "id") {
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
          id: this.elementBaseInfo[key],
          di: { id: `${this.elementBaseInfo[key]}_di` },
        });
      } else {
        window.bpmnInstances.modeling.updateProperties(
          this.bpmnElement,
          attrObj
        );
      }
    },
    updateDocumentation() {
      (this.bpmnElement && this.bpmnElement.id === this.id) || (this.bpmnElement = window.bpmnInstances.elementRegistry.get(this.id));
      const documentation = window.bpmnInstances.bpmnFactory.create("bpmn:Documentation", { text: this.documentation });
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
        documentation: [documentation]
      });
    }
  },
  beforeDestroy() {
    this.bpmnElement = null;
  },
};
</script>

<style lang="scss" scoped>
</style>