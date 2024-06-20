<template>
  <div class="properties-container" v-loading="loading">
    <PropertiesHeader
      :currentNode="currentNode"
      :dialogFlowData="dialogFlowData"
    />
    <div class="content-body">
      <el-form ref="form" :model="form" :rules="formRules" class="content-body">
        <div class="without-tabs-container">
          <el-form-item class="inline-label-item" label="Component Name" prop="component_name">
            <el-input v-model="form.component_name" placeholder="Enter component name"></el-input>
          </el-form-item>
          <el-form-item
            class="inline-label-item codemirror-item-container"
            prop="run_script"
          >
            <label class="label-name">Run script</label>
            <codemirror v-model="form.run_script"></codemirror>
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
import TableAPIService from "@/services/TableAPIService";

import Codemirror from "@/components/Codemirror.vue";

const uuidv4 = require("uuid/v4");
let tableAPI = new TableAPIService();
import _ from "lodash";
import Validator from "@/services/Validator";
import PropertiesFooter from "./PropertiesFooter.vue";
import wfDirty from "@/mixins/wfDirty.js";
import Constants from "@/resources/Constants";
import PropertiesHeader from "@/dialogflow/components/properties/PropertiesHeader.vue";

export default {
  name: "IDP RunScript",
  props: ["dialogFlowData", "currentNode"],
  components: {
    Codemirror,
    PropertiesFooter,
    PropertiesHeader,
  },
  mixins: [wfDirty],
  data() {
    const form = {
      run_script: Constants.WORKFLOW.GENERIC_SCRIPT || "",
      component_name:"",
    };
    return {
      loading:false,
      form: {
        ...form,
      },
      formRules: {
        run_script: [
          {
            validator: Validator.EmptyValueValidator,
            trigger: "blur",
            message: "Please provide script",
          },
          {
            required: true,
            message: "Please provide script",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
      init() {
            let nodeData = JSON.parse(JSON.stringify(this.currentNode.data));
            this.form = {
                node_id: nodeData['node_id'],
                ...this.form,
            };
            _.size(nodeData) > 1 ? (this.form = nodeData) : null;
                  this.$nextTick(()=>{this.clonedForm = JSON.parse(JSON.stringify(this.form))})	

        }
  },
  mounted() {},
  beforeMount() {
    this.init();
  },
  updated() {
    console.log("inside runScript updated");
  },
};
</script>

<style lang="scss">
    .vue-slideout-content {
        overflow: auto;
    }
</style>