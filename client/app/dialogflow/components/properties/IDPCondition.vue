<template>
  <div class="properties-container" v-loading="loading">
    <PropertiesHeader
      :currentNode="currentNode"
      :dialogFlowData="dialogFlowData"
    />
    <div class="content-body">
      <el-form :model="form" ref="form" label-width="110px" :rules="formRules">
          <div class="without-tabs-container">
            <div
              v-for="(output, index) in form.connections"
              :key="index"
              class="add-condition-container"
            >
              <el-form-item
                class="inline-label-item"
                :rules="[
                          {
                            validator: validator.EmptyValueValidator,
                            trigger: 'blur',
                            message: 'Please provide valid name',
                          },
                          {
                            required: true,
                            message: 'Name is required',
                            trigger: 'blur',
                          },
                        ]"
                :prop="'connections.' + index + '.label'"
                label="Name"
              >
                <el-input
                  name="name"
                  cid="doc-assignemnt-name"
                  v-model="output.label"
                  placeholder="Condition name"
                ></el-input>
              </el-form-item>

              <el-form-item class="inline-label-item" label="Component Name" prop="component_name">
                <el-input v-model="form.component_name" placeholder="Enter component name"></el-input>
              </el-form-item>

              <el-form-item   :rules="{
                  required: true,
                  message: 'Document type is required',
                  trigger: 'blur',
                }"  class="inline-label-item" :prop="'connections.' + index + '.document_type'" label="Document type">
                    <!-- v-on:change="onTypeChange" -->
                    <el-select v-on:change="onDocumentTypeChange(index)" clearable filterable v-model="output.document_type" placeholder="Document type">
                            <el-option v-for="option in documentTypes" :key="option.value" :value="option.value" :label="option.label"></el-option>
                    </el-select>
              </el-form-item>

              <el-form-item
                class="inline-label-item"
                :prop="'connections.' + index + '.is_advanced'"
                label="Advanced script"
              >
                <toggle-button
                  cid="doc-assignemnt-is-advanced"
                  v-model="output.is_advanced"
                  :sync="true"
                  :color="{
                    checked: '#5f8fdf',
                    unchecked: '#DCDFE6',
                    disabled: '#CCCCCC',
                  }"
                  :labels="{ checked: 'YES', unchecked: 'NO' }"
                ></toggle-button>
              </el-form-item>

              <el-form-item
                class="inline-label-item"
                id="query-builder"
                :prop="'connections.' + index + '.rule'" 
                label="Rule"
                :rules="{
                  validator: validator.QueryBuilderValidator,
                  trigger: 'blur',
                }">
                <QueryBuilder
                  cid="doc-assignemnt-rule"
                  @onQueryChange="onQueryChange"
                  :query="output.rule"
                  :documentType="output.document_type"
                  :documentSubtype="output.document_subtype"
                  :index="index"
                  :dataToShow='["fieldsData"]'
                ></QueryBuilder>
                <!-- <vue-query-builder :rules="rules" v-model="form.rule"></vue-query-builder> -->
              </el-form-item>

              <el-form-item
                class="inline-label-item codemirror-item-container"
                v-if="output.is_advanced"                
                :prop="'connections.' + index + '.script'"
              >
                <label class="label-name">Script</label>
                <codemirror
                  :value="output.script"
                  cid="doc-assignemnt-script"
                  v-model="output.script"
                  :options="editorOptions"
                  :placeholder="placeholder"
                ></codemirror>
              </el-form-item>

              <el-form-item
                class="inline-label-item"
                :rules="{
                  required: true,
                  message: 'Order is required',
                  trigger: 'blur',
                }"
                :prop="'connections.' + index + '.order'"
                label="Order"
              >
                <el-input
                  type="number"
                  name="order"
                  cid="doc-assignemnt-name"
                  v-model="output.order"
                  placeholder="order"
                ></el-input>
              </el-form-item>
              <div class="notification-delete-container">
                <el-button
                  v-on:click="removeConnection(item, index)"
                  class="btn-delete btn-delete-card"
                  size="mini"
                  >Remove
                  <!-- <i class="mdi mdi-delete"></i> -->
                </el-button>
              </div>
            </div>
            <el-button size="small" v-on:click="addRules($event)" type="primary"
              >+ ADD rule</el-button
            >
          </div>
      </el-form>
    </div>
    <PropertiesFooter
      :currentNode="currentNode"
      :form.sync="form"
      :dialogFlowData="dialogFlowData"
      :formRef="$refs"
      :loading.sync="loading"
    />
  </div>
</template>

<script>
import Codemirror from "@/components/Codemirror.vue";
import VueQueryBuilder from "vue-query-builder";
import ConfirmModel from "@/components/ConfirmModel";
import QueryBuilder from "@/idp/pages/QueryBuilder.vue";
import EventBus from "@/EventBus";
import _ from "lodash";
import PropertiesFooter from "@/dialogflow/components/properties/PropertiesFooter.vue";
import PropertiesHeader from "@/dialogflow/components/properties/PropertiesHeader.vue";
const uuidv4 = require("uuid/v4");
import Rete from "rete";
import DialogFlowService from "@/dialogflow/services/DialogFlowService";
import * as Socket from "../../sockets";
import wfDirty from "@/mixins/wfDirty.js";
import Constants from "@/resources/Constants";
import Validator from "@/services/Validator";

export default {
  name: "IDP Condition",
  props: ["dialogFlowData", "currentNode", "documentTypes"], 
  components: {
    Codemirror,
    ConfirmModel,
    VueQueryBuilder,
    QueryBuilder,
    PropertiesFooter,
    PropertiesHeader
  },
  mixins: [wfDirty],
  data() {
    return {
      validator:Validator,
      doucument_types: Constants.DOCEX.DOCUMENT_TYPE_LIST,   
      placeholder: ``,
      form: {
        connections: [
          {
            label: "",
            component_name:"",
            document_type: "",
            document_subtype: "",
            order: 0,
            is_advanced: false,
            rule: {
              logicalOperator: "all",
              children: [],
            },
            script: Constants.WORKFLOW.GENERIC_SCRIPT || "",
            active: true,
          },
        ],
      },
    };
  },

  methods: {   
    onDocumentTypeChange(index) {
      this.form.connections[index].document_subtype = this.form.connections[index].document_type;
    },
    removeConnection(output, index) {
      this.form.connections.splice(index, 1);
    },
    addRules(event) {
      this.form.connections.push({
        label: "",
        document_type: "",
        document_subtype: "",
        order: 0,
        is_advanced: false,
        rule: {
          logicalOperator: "all",
          children: [],
        },
        script: Constants.WORKFLOW.GENERIC_SCRIPT || "",
        active: true,
      });
      this.$forceUpdate();
    },

    onQueryChange(input) {
      this.form.connections[input.index].rule = input.val;
    },
    async init(recordId) {
      let nodeData = JSON.parse(JSON.stringify(this.currentNode.data));
      this.form = {
        node_id: nodeData["node_id"],
        connections: this.form.connections
      };
      _.size(nodeData) > 1 ? (this.form = nodeData) : null;
      this.$nextTick(()=>{this.clonedForm = JSON.parse(JSON.stringify(this.form))})	

    },

   postProcessing() {
            DialogFlowService.addOutput(this.currentNode, this.form);
            return true
        },
  },
  mounted() {},
  async beforeMount() {
    this.init();
  },
};
</script>

<style lang="scss">
    .vue-slideout-content {
        overflow: auto;
    }
</style>