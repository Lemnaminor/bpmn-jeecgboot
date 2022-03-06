<template>
  <div class="process-panel__container">
    <a-collapse
      accordion
      :activeKey="1"
    >
      <a-collapse-panel
        key="1"
        header="基本设置"
      >
        <base-info
          ref="BaseInfo"
          :id-edit-disabled="idEditDisabled"
          :business-object="elementBusinessObject"
          :type="elementType"
          :id="elementId"
        />
      </a-collapse-panel>
      <a-collapse-panel
        v-if="elementType.indexOf('Task') !== -1"
        key="2"
        header="审核者"
      >
        <examiner
          :id="elementId"
          :type="elementType"
        />
      </a-collapse-panel>
      <a-collapse-panel
        v-if="elementType.indexOf('Task') !== -1"
        key="3"
        header="会签配置"
      >
        <counter-sign
          :business-object="elementBusinessObject"
          :type="elementType"
        />
      </a-collapse-panel>
      <a-collapse-panel
        v-if="elementType.indexOf('Task') !== -1"
        key="4"
        header="任务监听"
      >
        <a-icon
          slot="extra"
          type="plus"
          @click.stop="childrenShowModal('TaskMonitor')"
        />
        <task-monitor
          ref="TaskMonitor"
          :id="elementId"
          :type="elementType"
        />
      </a-collapse-panel>
      <a-collapse-panel
        v-if="conditionFormVisible"
        key="5"
        header="流转条件"
      >
        <a-icon
          slot="extra"
          type="plus"
          @click.stop="childrenShowModal('ImplementMonitor')"
        />
        <flow-condition
          :business-object="elementBusinessObject"
          :type="elementType"
        />
      </a-collapse-panel>
      <a-collapse-panel
        v-if="elementType.indexOf('ExclusiveGateway') === -1"
        key="6"
        header="执行监听"
      >
        <a-icon
          slot="extra"
          type="plus"
          @click.stop="childrenShowModal('ImplementMonitor')"
        />
        <implement-monitor
          ref="ImplementMonitor"
          :id="elementId"
          :type="elementType"
        />
      </a-collapse-panel>
      <a-collapse-panel
        v-if="elementType === 'Process'"
        key="7"
        header="全局监听"
      >
        <a-icon
          slot="extra"
          type="plus"
          @click.stop="childrenShowModal('AllMonitor')"
        />
        <all-monitor
          ref="AllMonitor"
          :id="elementId"
          :type="elementType"
        />
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script>
import BaseInfo from "./BaseInfo/BaseInfo";
import Examiner from "./Examiner/Examiner";
import CounterSign from "./CounterSign/CounterSign";
import TaskMonitor from "./TaskMonitor/TaskMonitor";
import FlowCondition from "./FlowCondition/FlowCondition";
import ImplementMonitor from "./ImplementMonitor/ImplementMonitor";
import AllMonitor from "./AllMonitor/AllMonitor";

import Log from "../Log";
/**
 * 侧边栏
 * @Author MiyueFE
 * @Home https://github.com/miyuesc
 * @Date 2021年3月31日18:57:51
 */
export default {
  name: "MyPropertiesPanel",
  components: {
    BaseInfo,
    Examiner,
    CounterSign,
    TaskMonitor,
    FlowCondition,
    ImplementMonitor,
    AllMonitor,
  },
  componentName: "PropertiesPanel",
  props: {
    bpmnModeler: Object,
    prefix: {
      type: String,
      default: "camunda",
    },
    width: {
      type: Number,
      default: 480,
    },
    idEditDisabled: {
      type: Boolean,
      default: false,
    },
  },
  provide() {
    return {
      prefix: this.prefix,
      width: this.width,
    };
  },
  data() {
    return {
      activeTab: "base",
      elementId: "",
      elementType: "",
      elementBusinessObject: {}, // 元素 businessObject 镜像，提供给需要做判断的组件使用
      conditionFormVisible: false, // 流转条件设置
      formVisible: false, // 表单配置
    };
  },
  watch: {
    elementId: {
      handler() {
        this.activeTab = "base";
      },
    },
  },
  created() {
    console.log("Panel!");
    this.initModels();
  },
  methods: {
    initModels() {
      // 初始化 modeler 以及其他 moddle
      if (!this.bpmnModeler) {
        // 避免加载时 流程图 并未加载完成
        this.timer = setTimeout(() => this.initModels(), 10);
        return;
      }
      if (this.timer) clearTimeout(this.timer);
      window.bpmnInstances = {
        modeler: this.bpmnModeler,
        modeling: this.bpmnModeler.get("modeling"),
        moddle: this.bpmnModeler.get("moddle"),
        eventBus: this.bpmnModeler.get("eventBus"),
        bpmnFactory: this.bpmnModeler.get("bpmnFactory"),
        elementFactory: this.bpmnModeler.get("elementFactory"),
        elementRegistry: this.bpmnModeler.get("elementRegistry"),
        replace: this.bpmnModeler.get("replace"),
        selection: this.bpmnModeler.get("selection"),
      };
      this.getActiveElement();
    },
    getActiveElement() {
      // 初始第一个选中元素 bpmn:Process
      this.initFormOnChanged(null);
      this.bpmnModeler.on("import.done", () => {
        this.initFormOnChanged(null);
      });
      // 监听选择事件，修改当前激活的元素以及表单
      this.bpmnModeler.on("selection.changed", ({ newSelection }) => {
        this.initFormOnChanged(newSelection[0] || null);
      });
      this.bpmnModeler.on("element.changed", ({ element }) => {
        // 保证 修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
        if (element && element.id === this.elementId) {
          this.initFormOnChanged(element);
        }
      });
    },
    // 初始化数据
    initFormOnChanged(element) {
      console.log("element:", element);
      let activatedElement = element;
      if (!activatedElement) {
        activatedElement =
          window.bpmnInstances.elementRegistry.find(
            (el) => el.type === "bpmn:Process"
          ) ??
          window.bpmnInstances.elementRegistry.find(
            (el) => el.type === "bpmn:Collaboration"
          );
      }
      if (!activatedElement) return;
      Log.printBack(
        `select element changed: id: ${activatedElement.id} , type: ${activatedElement.businessObject.$type}`
      );
      Log.prettyInfo("businessObject", activatedElement.businessObject);
      window.bpmnInstances.bpmnElement = activatedElement;
      this.bpmnElement = activatedElement;
      this.elementId = activatedElement.id;
      this.elementType = activatedElement.type.split(":")[1] || "";
      this.elementBusinessObject = JSON.parse(
        JSON.stringify(activatedElement.businessObject)
      );
      console.log("elementBusinessObject:", this.elementBusinessObject);
      this.conditionFormVisible = !!(
        this.elementType === "SequenceFlow" &&
        activatedElement.source &&
        activatedElement.source.type.indexOf("StartEvent") === -1
      );
      this.formVisible =
        this.elementType === "UserTask" || this.elementType === "StartEvent";
    },
    beforeDestroy() {
      window.bpmnInstances = null;
    },
    // 全局监听弹窗显隐
    childrenShowModal(name) {
      this.$refs[name].visible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .ant-layout-sider {
  height: calc(100% - 52px);
  margin-top: 52px;
  background: #f8f8f8 !important;
  overflow-y: auto;
}
.process-panel__container {
  height: calc(100% - 52px);
  margin-top: 52px;
  background: #f8f8f8 !important;
}
::v-deep .ant-form-item {
  margin-bottom: 5px !important;
}
</style>