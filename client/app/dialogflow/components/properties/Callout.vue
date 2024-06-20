<template>
  <div class="properties-container" v-loading="loading">
    <PropertiesHeader
      :currentNode="currentNode"
      :dialogFlowData="dialogFlowData"
    />
    <div class="content-body">
      <el-form :model="form" ref="form" label-width="110px" :rules="formRules">
        <el-tabs v-if="dialogFlowData.workflow_data.nodes[currentNode.id].data">
          <!-- general -->
          <el-tab-pane>
            <span slot="label">General</span>
            <el-form-item class="inline-label-item" label="Component Name" prop="component_name">
              <el-input v-model="form.component_name" placeholder="Enter component name"></el-input>
            </el-form-item>
            <el-form-item
              class="inline-label-item"
              label="Endpoint"
              prop="endpoint"
            >
              <el-input
                v-model="form.endpoint"
                placeholder="Please enter endpoint..."
              ></el-input>
            </el-form-item>

            <el-form-item
              class="inline-label-item"
              label="Document type"
              prop="document_type"
            >            
            <el-select  clearable filterable v-model="form.document_type" placeholder="Document type">
                            <el-option v-for="option in documentTypes" :key="option.value" :value="option.value" :label="option.label"></el-option>
             </el-select>
              
            </el-form-item>

            <el-form-item
              class="inline-label-item codemirror-item-container"
              prop="query_params"
            >
              <label class="label-name">Query Params</label>
              <codemirror v-model="form.query_params" :options="editorOptions">
              </codemirror>
            </el-form-item>

            <el-form-item
              class="inline-label-item codemirror-item-container"
              prop="request_headers"
            >
              <label class="label-name">Headers</label>
              <codemirror
                v-model="form.request_headers"
                :options="editorOptions"
              >
              </codemirror>
            </el-form-item>

            <el-form-item
              class="inline-label-item codemirror-item-container"
              prop="request_template"
            >
              <label class="label-name">Request Template(Payload)</label>
              <codemirror
                v-model="form.request_template"
                :options="editorOptions"
              >
              </codemirror>
            </el-form-item>

            <label class="label-name">Response Template</label>

            <el-form-item
              class="inline-label-item"
              label="Variable Name"
              prop="response_variable_name"
            >
              <el-input
                v-model="form.response_variable_name"
                placeholder="Please enter response variable name..."
              ></el-input>
            </el-form-item>

            <el-form-item
              class="inline-label-item codemirror-item-container"
              prop="response_template"
            >
              <codemirror
                v-model="form.response_template"
                :options="editorOptions"
              >
              </codemirror>
            </el-form-item>
          </el-tab-pane>
          <!-- advance -->
          <el-tab-pane>
            <span slot="label">Advance</span>

            <el-form-item
              class="inline-label-item codemirror-item-container"
              prop="advanced_script"
            >
              <label class="label-name">Script</label>
              <codemirror
                v-model="form.advanced_script"
                :options="editorOptions"
              >
              </codemirror>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
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
import _ from "lodash";
import Codemirror from "@/components/Codemirror.vue";
import PropertiesFooter from "@/dialogflow/components/properties/PropertiesFooter.vue";
import CustomerConfig from "@/idp/services/DeCustomerConfig";
import PropertiesHeader from "@/dialogflow/components/properties/PropertiesHeader.vue";
import wfDirty from "@/mixins/wfDirty.js";
import Validator from "@/services/Validator";
import Constants from "@/resources/Constants";

export default {
  name: "Callout",
  mixins: [wfDirty],
  props: ["dialogFlowData", "currentNode", "documentTypes"],
  components: { PropertiesHeader, Codemirror, PropertiesFooter },
  data() {
    return {
      editorOptions: {
        mode: "text/javascript",
        theme: "default",
      },
      form: {
        endpoint: "",
        component_name:"",
        document_type: "",
        query_params: JSON.stringify({}, null, 4),
        request_headers: JSON.stringify({}, null, 4),
        request_template: JSON.stringify({}, null, 4),
        response_template: JSON.stringify({}, null, 4),
        response_variable_name: `var_${this.currentNode.id || 1}`,
        advanced_script: Constants.WORKFLOW.GENERIC_SCRIPT || "",
      },
      document_type_list: [],
      formRules: {
        endpoint: [
          {
            validator: Validator.EmptyValueValidator,
            trigger: "blur",
            message: "Please provide valid endpoint",
          },
          { trigger: "blur", required: true, message: "Please enter endpoint" },
        ],
        document_type: [
          {
            trigger: "blur",
            required: true,
            message: "Please select document type",
          },
        ],
        query_params: [
             {
            validator: Validator.EmptyValueValidator,
            trigger: "blur",
            message: "Please provide valid query params",
          },
          {
            trigger: "blur",
            required: true,
            message: "Please enter query params",
          },
        ],
        request_headers: [
           {
            validator: Validator.EmptyValueValidator,
            trigger: "blur",
            message: "Please provide valid request headers",
          },
          {
            trigger: "blur",
            required: true,
            message: "Please enter request headers",
          },
        ],
        request_template: [
            {
            validator: Validator.EmptyValueValidator,
            trigger: "blur",
            message: "Please provide valid request template",
          },
          {
            trigger: "blur",
            required: true,
            message: "Please enter request template",
          },
        ],
        response_template: [
           {
            validator: Validator.EmptyValueValidator,
            trigger: "blur",
            message: "Please provide valid response template",
          },
          {
            trigger: "blur",
            required: true,
            message: "Please enter response template",
          },
        ],
        response_variable_name: [
           {
            validator: Validator.EmptyValueValidator,
            trigger: "blur",
            message: "Please provide valid variable name",
          },
          {
            trigger: "blur",
            required: true,
            message: "Please enter response variable name",
          },
        ],
        advanced_script: [
           {
            validator: Validator.EmptyValueValidator,
            trigger: "blur",
            message: "Please provide valid advanced script",
          },
          {
            trigger: "blur",
            required: true,
            message: "Please enter advanced script",
          },
        ],
      },
    };
  },
  methods: {
    async init() {
      this.document_type_list = await this.getDocumentType();

       let nodeData = JSON.parse(JSON.stringify(this.currentNode.data));
      this.form = {
        node_id: nodeData["node_id"],
        ...this.form,
      };
      _.size(nodeData) > 1 ? (this.form = nodeData) : null;
        this.$nextTick(()=>{this.clonedForm = JSON.parse(JSON.stringify(this.form))})	
     },


    async getDocumentType() {
      let document_types = await CustomerConfig.getDocumentTypes();
      return document_types;
      // const domain_document_map = await CustomerConfig.getDocumentTypes(); //Constants.DOCEX.DOCUMENT_TYPE_LIST;
      // (domain_document_map || []).map((list) => {
      //   document_types = _.uniq([
      //     ...document_types,
      //     ...(list.document_type || []),
      //   ]);
      // });
      // return document_types.filter((type) => type.toLowerCase() != "other");
    },
  },

  beforeMount() {
    this.init();
  },
  mounted(){}
};
</script>
<style>
/* html,
body {
  height: 100%;
  margin: 0;
}

button.compile {
  z-index: 5;
  position: absolute;
  top: 10px;
  left: 10px;
} */
</style>