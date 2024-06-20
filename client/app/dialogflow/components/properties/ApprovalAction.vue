<template>
   <div class="properties-container" v-loading="loading">
    <PropertiesHeader
      :currentNode="currentNode"
      :dialogFlowData="dialogFlowData"
    />
    <div class="content-body">
      <el-form ref="form" label-width="110px" :model="form" :rules="formRules" class="content-body">
        <div class="without-tabs-container">
          <el-form-item class="inline-label-item" label="Component Name" prop="component_name">
            <el-input v-model="form.component_name" placeholder="Enter component name"></el-input>
          </el-form-item>
          <el-form-item class="inline-label-item" label="Approval action" prop="approval_action">
            <el-select
              v-model="form.approval_action"
              placeholder="Select approval action"
              cid="doc-assignemnt-users-select"
            >
              <el-option
                v-for="(item, index) in approval_actions"
                v-bind:value="item.value"
                :key="index"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <PropertiesFooter
      :currentNode="currentNode"
      :form.sync="form"
      :dialogFlowData="dialogFlowData"
      :formRef="$refs"
    />
  </div>
</template>
<script>
import constants from "@/dialogflow/helpers/Constants";
import Codemirror from "@/components/Codemirror.vue";
import PropertiesFooter from "./PropertiesFooter.vue";
import wfDirty from "@/mixins/wfDirty.js";
import PropertiesHeader from "@/dialogflow/components/properties/PropertiesHeader.vue";
import _ from "lodash";

export default {
  name: "Approval Action",
  props: ["dialogFlowData", "currentNode"],
  mixins: [wfDirty],
  components: {
    Codemirror,
    PropertiesHeader,
    PropertiesFooter,
  },
  data() {
    return {
      loading:false,
      approval_actions: constants.APPROVAL_ACTIONS,
      userList: "",
      form: {
        component_name:"",
      },
      formRules: {
        approval_action: [
          { trigger: "blur", required: true, message: "Please select approval action" },
        ]
      }  
    };
  },
  methods: {
    init() {
      let nodeData = JSON.parse(JSON.stringify(this.currentNode.data));
      this.form = {
        node_id: nodeData["node_id"],
        ...this.form,
      };
      _.size(nodeData) > 1 ? (this.form = nodeData) : null;
      this.$nextTick(()=>{this.clonedForm = JSON.parse(JSON.stringify(this.form))})	
    },
  },
  async beforeMount() {
    this.init();
  },
};
</script>

<style lang="scss">
</style>