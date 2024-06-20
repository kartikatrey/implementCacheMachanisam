<template>
  <div class="properties-container" v-loading="loading">
    <PropertiesHeader
      :currentNode="currentNode"
      :dialogFlowData="dialogFlowData"
    />
    <div class="content-body">
      <el-form ref="form" :rules="formRules" :model="form">
            <div class="without-tabs-container">
            <el-form-item class="inline-label-item" label="Component Name" prop="component_name">
              <el-input v-model="form.component_name" placeholder="Enter component name"></el-input>
            </el-form-item>
            <el-form-item
              class="inline-label-item"
              id="query-builder"
              prop="client_query"
              label="Match condition"
            >
              <vue-query-builder
                :rules="rules"
                v-model="form.client_query"
                :labels="labels"
              ></vue-query-builder>
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
import Codemirror from "@/components/Codemirror.vue";
import VueQueryBuilder from "vue-query-builder";
import IDPWaitQueryBuilder from "../config/IDPWaitQueryBuilder.json";
import _ from "lodash";
import Validator from "@/services/Validator";
import wfDirty from "@/mixins/wfDirty.js";
import PropertiesFooter from "./PropertiesFooter.vue";
import PropertiesHeader from "@/dialogflow/components/properties/PropertiesHeader.vue";

export default {
  name: "IDP Wait",
  props: ["dialogFlowData", "currentNode"],
  components: {
    Codemirror,
    VueQueryBuilder,
    PropertiesFooter,
    PropertiesHeader,
  },
  mixins: [wfDirty],
  data() {
    return {
      loading: false,
      showLog: false,
      queryLoading: false,
      form: {
        client_query: "",
        component_name:'',
      },
      rules: IDPWaitQueryBuilder,
      formRules: {
        client_query: [
          {
            validator: Validator.QueryBuilderValidator,
            trigger: "blur",
          },
        ],
      },
      labels: {
        matchType: "",
        matchTypes: [
          {
            id: "all",
            label: "All should match",
          },
          {
            id: "any",
            label: "Atleast one should match",
          },
        ],
        addRule: "Add rule",
        removeRule: "&times;",
        addGroup: "Add Group",
        removeGroup: "&times;",
        textInputPlaceholder: "value",
      },
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

  mounted() {},
  beforeMount() {
    this.init();
  },
};
</script>
