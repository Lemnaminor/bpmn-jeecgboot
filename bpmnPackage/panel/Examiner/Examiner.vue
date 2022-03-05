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
              dialogType = 'user'
              loadData()
            "
          />
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
              dialogType = 'user'
              loadData()
            "
          />
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
              dialogType = 'role'
              loadData()
            "
          />
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
      <div v-if="dialogType == 'user'" style="padding: 10px 0;">
        <a-form-model
          layout="inline"
          :model="queryParam"
          @keyup.enter.native="loadData()"
        >
          <a-row :gutter="24">
            <a-col
              :xl="6"
              :lg="7"
              :md="8"
              :sm="24"
            >
              <a-form-item label="昵称/部门">
                <a-input
                  placeholder="请输入用户昵称/部门"
                  v-model="queryParam.userDepartName"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :xl="6"
              :lg="7"
              :md="8"
              :sm="24"
            >
              <div>
                <a-button
                  type="primary"
                  icon="search"
                >查询</a-button>
                <a-button
                  type="primary"
                  icon="reload"
                  style="margin-left: 8px"
                >重置</a-button>
              </div>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
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

      dialogType: '',
      queryParam: {},
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
        let value = this.bpmnElement?.businessObject[key] || this.defaultTaskForm[key];
        this.$set(this.userTaskForm, key, value)
      }
    },
    updateElementTask(key) {
      const taskAttr = Object.create(null)
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
        this.userTaskForm[modalType] = selectedRows.length ? selectedRows[0].username : ''
      } else {
        if(this.dialogType === 'user'){
          let arr = selectedRows.map((item) => item.username)
          this.userTaskForm[modalType] = arr.length ? `${this.userTaskForm[modalType]}${this.userTaskForm[modalType] ? ',' : ''}${arr.join(',')}` : this.userTaskForm[modalType]
        }
        if(this.dialogType === 'role'){
          let arr = selectedRows.map((item) => item.roleCode)
          this.userTaskForm[modalType] = arr.length ? `${this.userTaskForm[modalType]}${this.userTaskForm[modalType] ? ',' : ''}${arr.join(',')}` : this.userTaskForm[modalType]
        }
        this.userTaskForm[modalType] = [...new Set(this.userTaskForm[modalType].split(','))].join(',')
      }
      console.log('userTaskForm1:', this.userTaskForm)
      this.updateElementTask(modalType)
      this.selectedRowKeys = []
      this.selectedRows = []
      this.visible = false
    },
    // 对象数组去重
    arrDistinctByProp(arr,prop){
      return arr.filter(function(item,index,self){
          return self.findIndex(el=>el[prop]==item[prop])===index
      })
    },
    // 用户选择
    async loadData() {
      this.visible = true
      const { dialogType } = this;
      if (dialogType === 'user') {
        this.columns = [
          {
            title: '账户',
            dataIndex: 'username',
          },
          {
            title: '昵称',
            dataIndex: 'realname',
          },
          {
            title: '部门',
            dataIndex: 'departName',
          },
        ]
        this.dataSource = [
          {
            uid: 1,
            username: 'admin',
            realname: '管理员',
            departName: '技术部',
          },
          {
            uid: 2,
            username: 'pdx',
            realname: '派大星',
            departName: '财务部',
          },
          {
            uid: 3,
            username: 'zyg',
            realname: '章鱼哥',
            departName: '财务部',
          },
          {
            uid: 4,
            username: 'xlb',
            realname: '蟹老板',
            departName: '运营部',
          },
        ]
      }
      if (dialogType === 'role') {
        this.columns = [
          {
            title: '角色编码',
            dataIndex: 'roleCode',
          },
          {
            title: '角色名称',
            dataIndex: 'roleName',
          },
        ]
        this.dataSource = [
          {
            id: 1,
            roleCode: 'admin',
            roleName: '管理员',
          },
          {
            id: 2,
            roleCode: 'data',
            roleName: '资料员',
          },
          {
            id: 3,
            roleCode: 'code',
            roleName: '开发员',
          }
        ]
      }
      
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
