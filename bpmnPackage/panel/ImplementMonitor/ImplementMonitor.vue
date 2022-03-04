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
        slot="listenerType"
        slot-scope="text"
      >
        <j-ellipsis :value="listenerTypeObject[text]" :length="3"></j-ellipsis>
      </template>
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
      <a-tabs
        :default-active-key="tabKeys"
        @change="(key) => {tabKeys = key}"
      >
        <a-tab-pane
          key="1"
          tab="内置执行监听器"
        >
          <a-table
            :rowKey="(r, i)=>{return i.toString()}"
            :columns="columnsListener"
            :data-source="dataSourceListener"
            :row-selection="{
              type: 'checkbox',
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
            bordered
            size="small"
          >
            <template
              slot="listenerType"
              slot-scope="text"
            >
              {{listenerTypeObject[`${text}Listener`]}}
            </template>
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
        </a-tab-pane>
        <a-tab-pane
          key="2"
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
              label="事件类型"
              prop="event"
            >
              <a-select
                v-model="form.event"
                placeholder="请选择事件类型"
              >
                <a-select-option value="start">start</a-select-option>
                <a-select-option value="take">take</a-select-option>
                <a-select-option value="end">end</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item
              label="监听类型"
              prop="listenerType"
            >
              <a-select
                v-model="form.listenerType"
                placeholder="请选择监听类型"
                @change="(value) => form.listenerType = value"
              >
                <a-select-option
                  v-for="i in Object.keys(listenerTypeObject)"
                  :key="i"
                  :value="i"
                >{{listenerTypeObject[i]}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item
              v-if="form.listenerType === 'classListener'"
              label="Java类"
              prop="class"
            >
              <a-input v-model="form.class" />
            </a-form-model-item>
            <a-form-model-item
              v-if="form.listenerType === 'expressionListener'"
              label="表达式"
              prop="expression"
            >
              <a-input v-model="form.expression" />
            </a-form-model-item>
            <a-form-model-item
              v-if="form.listenerType === 'delegateExpressionListener'"
              label="代理表达式"
              prop="delegateExpression"
            >
              <a-input v-model="form.delegateExpression" />
            </a-form-model-item>
          </a-form-model>
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </div>
</template>
<script>
import { createListenerObject, updateElementExtensions } from "../../utils";
import { initListenerType, listenerType } from "../utilSelf";

export default {
  name: "ImplementMonitor",
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
          title: "事件",
          dataIndex: "event",
          width: "25%",
        },
        {
          title: "类型",
          dataIndex: "listenerType",
          width: "25%",
          scopedSlots: { customRender: "listenerType" },
        },
        {
          title: "值",
          dataIndex: "value",
          width: "25%",
          customRender: (t) => (<j-ellipsis value={t} length={6}/>)
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
        event: "start",
        // listenerType: "class",
      },
      rules: {
        listenerType: [
          {
            required: true,
            message: "请选择监听类型",
            trigger: ["change", "blur"],
          },
        ],
        class: [
          { required: true, message: "请输入值", trigger: ["change", "blur"] },
        ],
        expression: [
          { required: true, message: "请输入值", trigger: ["change", "blur"] },
        ],
        delegateExpression: [
          { required: true, message: "请输入值", trigger: ["change", "blur"] },
        ],
      },
      listenerTypeObject: listenerType,
      // 内置监听器数据
      tabKeys: "1",
      selectedRowKeys: [],
      selectedRows: [],
      columnsListener: [
        {
          title: "名称",
          dataIndex: "listenername",
          width: "20%",
          customRender: (t) => (<j-ellipsis value={t} length={9}/>)
        },
        {
          title: "事件",
          dataIndex: "listenereven",
          width: "15%",
        },
        {
          title: "类型",
          dataIndex: "listenertype",
          width: "15%",
          scopedSlots: { customRender: "listenerType" },
        },
        {
          title: "值",
          dataIndex: "listenervalue",
          width: "50%",
          customRender: (t) => (<j-ellipsis value={t} length={50}/>)
        },
      ],
      dataSourceListener: [
        {
          id: "1177167770459070465",
          listenereven: "start",
          listenername: "子流程会签开始监听",
          listenertype: "class",
          listenervalue:
            "org.jeecg.modules.extbpm.listener.execution.SubProcessHqStartListener",
          state: "closed",
        },
        {
          id: "1285419790048247810",
          listenereven: "end",
          listenername: "公文收文分发",
          listenertype: "expression",
          listenervalue:
            "org.jeecg.modules.listener.easyoa.ReveicedStartListener",
          state: "closed",
        },
        {
          id: "1286113066426388482",
          listenereven: "start",
          listenername: "公文表单监听",
          listenertype: "delegateExpression",
          listenervalue:
            "org.jeecg.modules.listener.easyoa.OaOfficialdocStartListener1",
          state: "closed",
        },
        {
          id: "64d675c1a3adcb514ea5f9835093c29b",
          listenereven: "start",
          listenername: "子流程开始监听",
          listenertype: "class",
          listenervalue:
            "org.jeecg.modules.extbpm.listener.execution.SubProcessStartListener",
          state: "closed",
        },
      ],
    };
  },
  watch: {
    id: {
      immediate: true,
      handler(val) {
        val && val.length && this.$nextTick(() => this.resetListenersList());
      },
    },
    visible: {
      immediate: true,
      handler(val) {
        if (val) {
          this.selectedRowKeys = [];
          this.selectedRows = [];
        }
      },
    },
  },
  methods: {
    resetListenersList() {
      this.bpmnElement = window.bpmnInstances.bpmnElement;
      this.otherExtensionList = [];
      this.bpmnElementListeners =
        this.bpmnElement.businessObject?.extensionElements?.values?.filter(
          (ex) => ex.$type === `${this.prefix}:ExecutionListener`
        ) ?? [];
      this.dataSource = this.bpmnElementListeners.map((listener) => {
        // console.log("listener:", listener);
        // listener.listenerType = this.listenerTypeObject[listener.listenerType];
        if (listener.class) {
          listener["value"] = listener.class;
        }
        if (listener.expression) {
          listener["value"] = listener.expression;
        }
        if (listener.delegateExpression) {
          listener["value"] = listener.delegateExpression;
        }
        return initListenerType(listener);
      });
      console.log("dataSource-1:", this.dataSource);
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
      let { tabKeys } = this;
      if (tabKeys == "1") {
        let arr = [];
        this.selectedRows.forEach((item) => {
          let obj = {
            event: item.listenereven,
            listenerType: `${item.listenertype}Listener`,
            value: item.listenervalue,
          };
          if (item.listenertype == "class") {
            obj["class"] = item.listenervalue;
          }
          if (item.listenertype == "expression") {
            obj["expression"] = item.listenervalue;
          }
          if (item.listenertype == "delegateExpression") {
            obj["delegateExpression"] = item.listenervalue;
          }
          console.log("obj-1:", obj);
          arr.push(initListenerType(obj));
          // 更新bpmn标签
          const listenerObject = createListenerObject(obj, false, this.prefix);
          this.bpmnElementListeners.push(listenerObject);
          updateElementExtensions(
            this.bpmnElement,
            this.otherExtensionList.concat(this.bpmnElementListeners)
          );
        });
        this.dataSource = [...this.dataSource, ...arr];
        this.visible = false;
        console.log("dataSource:", this.dataSource);
      } else {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            const listenerObject = createListenerObject(
              this.form,
              false,
              this.prefix
            );
            this.bpmnElementListeners.push(listenerObject);
            // this.form.listenerType =
            //   this.listenerTypeObject[this.form.listenerType];
            if (this.form.class) {
              this.form["value"] = this.form.class;
            }
            if (this.form.expression) {
              this.form["value"] = this.form.expression;
            }
            if (this.form.delegateExpression) {
              this.form["value"] = this.form.delegateExpression;
            }
            this.dataSource.push(this.form);
            console.log("form-1:", this.form);
            // 保存其他配置
            this.otherExtensionList =
              this.bpmnElement.businessObject?.extensionElements?.values?.filter(
                (ex) => ex.$type !== `${this.prefix}:ExecutionListener`
              ) ?? [];
            updateElementExtensions(
              this.bpmnElement,
              this.otherExtensionList.concat(this.bpmnElementListeners)
            );
            // 重置表单数据
            this.form = {
              event: "start",
              // listenerType: "class",
            };
            this.visible = false;
          }
        });
      }
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log("selectedRowKeys changed: ", selectedRowKeys);
      console.log("selectedRows: ", selectedRows);
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
  },
};
</script>

<style lang="scss" scoped></style>
