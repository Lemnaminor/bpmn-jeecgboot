<template>
  <div class="panel-tab__content">
    <a-table
      :rowKey="(r, i)=>{return i.toString()}"
      :columns="columns"
      :data-source="dataSource"
      bordered
      size="small"
    >
      <template
        slot="action"
        slot-scope="text, record, index"
      >
        <a-icon
          type="delete"
          @click="onDelete(index)"
        />
      </template>
    </a-table>
    <!-- 监听弹窗 -->
    <a-modal
      v-model="visible"
      width="50%"
      cancelText="取消"
      okText="确认"
      @ok="saveListenerConfig"
    >
      <a-tabs default-active-key="1">
        <a-tab-pane
          key="1"
          tab="自定义全局监听器"
        >
          <a-form-model
            ref="ruleForm"
            :model="form"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-form-model-item
              label="监听类型"
              prop="listenerType"
            >
              <a-select
                v-model="form.listenerType"
                placeholder="请选择监听类型"
              >
                <a-select-option value="class">类</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item
              label="值"
              prop="class"
            >
              <a-input v-model="form.class" />
            </a-form-model-item>
          </a-form-model>
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </div>
</template>
<script>
import { createListenerObject, updateElementExtensions } from "../../utils";
import { initListenerType, initListenerForm, listenerType } from "../utilSelf";

export default {
  name: "AllMonitor",
  props: {
    id: String,
    type: String,
  },
  inject: {
    prefix: "prefix",
  },
  data() {
    return {
      columns: [
        {
          title: "值",
          dataIndex: "class",
          width: "75%",
          customRender: (t) => (<j-ellipsis value={t} length={20}/>)
        },
        {
          title: "操作",
          align: "center",
          width: "25%",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataSource: [],
      // 监听弹窗
      visible: false,
      // 表单
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        listenerType: "class",
      },
      rules: {
        class: [
          { required: true, message: "请输入值", trigger: ["change", "blur"] },
        ],
      },
    };
  },
  watch: {
    id: {
      immediate: true,
      handler(val) {
        val && val.length && this.$nextTick(() => this.resetListenersList());
      },
    },
  },
  methods: {
    resetListenersList() {
      this.bpmnElement = window.bpmnInstances.bpmnElement;
      this.otherExtensionList = [];
      this.bpmnElementListeners =
        this.bpmnElement.businessObject?.extensionElements?.values?.filter(
          (ex) => ex.$type === `${this.prefix}:EventListener`
        ) ?? [];
      this.dataSource = this.bpmnElementListeners.map((listener) =>
        initListenerType(listener)
      );
    },
    // 删除列
    onDelete(index) {
      this.dataSource.splice(index, 1);
      this.bpmnElementListeners.splice(index, 1);
      updateElementExtensions(
        this.bpmnElement,
        this.otherExtensionList.concat(this.bpmnElementListeners)
      );
    },
    // 保存监听器配置
    saveListenerConfig() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const listenerObject = createListenerObject(
            this.form,
            false,
            this.prefix,
            1
          );
          this.bpmnElementListeners.push(listenerObject);
          this.dataSource.push(this.form);
          // 保存其他配置
          this.otherExtensionList =
            this.bpmnElement.businessObject?.extensionElements?.values?.filter(
              (ex) => ex.$type !== `${this.prefix}:EventListener`
            ) ?? [];
          updateElementExtensions(
            this.bpmnElement,
            this.otherExtensionList.concat(this.bpmnElementListeners)
          );
          // 重置表单数据
          this.form = {
            listenerType: "class",
          };
          this.visible = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
