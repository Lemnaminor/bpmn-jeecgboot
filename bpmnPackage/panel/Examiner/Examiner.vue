<template>
  <div class="panel-tab__content">
    <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="处理人">
        <a-input
          v-model="userTaskForm.assignee"
          placeholder="请选择处理人"
          allow-clear
          :disabled="false"
          @change="updateElementTask('assignee')"
        >
          <a-icon
            slot="addonAfter"
            type="user"
            @click="
              modalType = 'assignee'
              checkboxType = 'radio'
              getData()
            "
          />
          <!-- <a-divider slot="addonAfter" type="vertical" />
          <a-icon
            slot="addonAfter"
            type="calculator"
            @click="
              modalType = 'assignee'
              checkboxType = 'radio'
              getData2()
            "
          /> -->
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="候选用户">
        <a-input
          v-model="userTaskForm.candidateUsers"
          placeholder="请选择候选用户"
          allow-clear
          :disabled="false"
          @change="updateElementTask('candidateUsers')"
        >
          <a-icon
            slot="addonAfter"
            type="user"
            @click="
              modalType = 'candidateUsers'
              checkboxType = 'checkbox'
              getData()
            "
          />
          <!-- <a-divider slot="addonAfter" type="vertical" />
          <a-icon
            slot="addonAfter"
            type="calculator"
            @click="
              modalType = 'candidateUsers'
              checkboxType = 'radio'
              getData2()
            "
          /> -->
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="候选角色">
        <a-input
          v-model="userTaskForm.candidateGroups"
          placeholder="请选择候选角色"
          allow-clear
          :disabled="false"
          @change="updateElementTask('candidateGroups')"
        >
          <a-icon
            slot="addonAfter"
            type="user"
            @click="
              modalType = 'candidateGroups'
              checkboxType = 'checkbox'
              getData()
            "
          />
          <!-- <a-divider slot="addonAfter" type="vertical" />
          <a-icon
            slot="addonAfter"
            type="calculator"
            @click="
              modalType = 'candidateGroups'
              checkboxType = 'radio'
              getData2()
            "
          /> -->
        </a-input>
      </a-form-model-item>
    </a-form-model>
    <!-- 选择弹窗 -->
    <a-modal
      v-model="visible"
      title="用户选择"
      width="70%"
      cancelText="取消"
      okText="确认"
      @ok="handleOk"
    >
      <a-table
        ref="table"
        :rowKey="(r, i)=>{return i.toString()}"
        :columns="columns"
        :data-source="dataSource"
        :row-selection="{
          type: checkboxType,
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        bordered
      >
      </a-table>
    </a-modal>
  </div>
</template>
<script>
export default {
  name: 'Examiner',
  props: {
    id: String,
    type: String,
  },
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      defaultTaskForm: {
        assignee: '',
        candidateUsers: '',
        candidateGroups: '',
      },
      userTaskForm: {},
      visible: false,

      // 用户选择
      modalType: '',
      checkboxType: 'checkbox',
      selectedRowKeys: [],
      selectedRows: [],
      columns: [],
      dataSource: [],
    }
  },
  watch: {
    id: {
      immediate: true,
      handler() {
        this.bpmnElement = window.bpmnInstances.bpmnElement
        this.$nextTick(() => this.resetTaskForm())
      },
    },
  },
  methods: {
    resetTaskForm() {
      for (let key in this.defaultTaskForm) {
        let value
        // if (key === 'candidateUsers' || key === 'candidateGroups') {
        //   value = this.bpmnElement?.businessObject[key]
        //     ? this.bpmnElement.businessObject[key].split(',')
        //     : []
        // } else {
        //   value =
        //     this.bpmnElement?.businessObject[key] || this.defaultTaskForm[key]
        // }
        value =
          this.bpmnElement?.businessObject[key] || this.defaultTaskForm[key]
        this.$set(this.userTaskForm, key, value)
      }
    },
    updateElementTask(key) {
      const taskAttr = Object.create(null)
      // if (key === 'candidateUsers' || key === 'candidateGroups') {
      //   taskAttr[key] =
      //     this.userTaskForm[key] && this.userTaskForm[key].length
      //       ? this.userTaskForm[key].join(',')
      //       : null
      // } else {
      //   taskAttr[key] = this.userTaskForm[key] || null
      // }
      taskAttr[key] = this.userTaskForm[key] || null
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, taskAttr)
    },
    // 用户选择
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      console.log('selectedRows: ', selectedRows)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleOk() {
      const { modalType, selectedRows, checkboxType } = this
      if (checkboxType === 'radio') {
        this.userTaskForm[modalType] = this.columns[0].dataIndex === 'id' ? (selectedRows.length ? selectedRows[0].id : '') : (selectedRows.length ? selectedRows[0].expression : '')
      } else {
        let arr = selectedRows.map((item) => {
          return this.columns[0].dataIndex === 'id' ? item.id : item.expression;
        })
        this.userTaskForm[modalType] = arr.length ? `${this.userTaskForm[modalType]}${this.userTaskForm[modalType] ? ',' : ''}${arr.join(',')}` : this.userTaskForm[modalType]
      }
      console.log('userTaskForm1:', this.userTaskForm)
      this.updateElementTask(modalType)
      this.selectedRowKeys = []
      this.selectedRows = []
      this.visible = false
    },
    getData() {
      this.visible = true
      this.columns = [
        {
          title: '账户',
          dataIndex: 'id',
        },
        {
          title: '昵称',
          dataIndex: 'firstName',
        },
      ]
      this.dataSource = [
        {
          firstName: '管理员',
          id: 'admin',
          state: 'closed',
        },
        {
          firstName: 'JEECG用户',
          id: 'jeecg',
          state: 'closed',
        },
        {
          firstName: 'qinfeng',
          id: 'qinfeng',
          state: 'closed',
        },
        {
          firstName: 'test',
          id: 'test',
          state: 'closed',
        },
      ]
    },
    getData2() {
      this.visible = true
      this.columns = [
        {
          title: '描述',
          dataIndex: 'name',
        },
        {
          title: '表达式',
          dataIndex: 'expression',
        },
      ]
      this.dataSource = [
        {
          createBy: 'jeecg',
          createTime: 1644829757000,
          expression: '${a}',
          id: '1493150337735852033',
          name: 'aaa',
          updateBy: 'jeecg',
          updateTime: 1644909986000,
        },
        {
          createBy: 'jeecg',
          createTime: 1644910032000,
          expression: '${you}',
          id: '1493487037641129986',
          name: '发起人',
        },
      ]
    },
  },
  beforeDestroy() {
    this.bpmnElement = null
  },
}
</script>

<style lang="scss" scoped>
::v-deep .ant-input-disabled {
  color: rgba(0, 0, 0, 0.65)!important;
  background: #fff!important;
}
</style>
