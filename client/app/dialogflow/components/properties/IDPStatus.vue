<template>
  <div class="properties-container" v-loading="loading">
    <PropertiesHeader
      :currentNode="currentNode"
      :dialogFlowData="dialogFlowData"
    />
    <div class="content-body">
      <el-form :model="form" ref="form" label-width="110px" :rules="formRules">
        <div class="without-tabs-container">
          <el-form-item class="inline-label-item" label="Component Name" prop="component_name">
            <el-input v-model="form.component_name" placeholder="Enter component name"></el-input>
          </el-form-item>
          <el-form-item
            label="Document stage"
            class="inline-label-item"
            prop="stage"
          >
            <el-select
              class="idp-approval-property-component-emails-select"
              v-model="form.stage"
              placeholder="Select Document Stage"
              cid="doc-assignemnt-users-select"
            >
              <el-option
                v-for="(item, index) in stage_list"
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
import Constants from "@/resources/Constants";

import Codemirror from "@/components/Codemirror.vue";
import wfDirty from "@/mixins/wfDirty.js";
import PropertiesFooter from "./PropertiesFooter.vue";
import PropertiesHeader from "@/dialogflow/components/properties/PropertiesHeader.vue";

import _ from "lodash";

export default {
  name: "IDP Status",
  props: ["dialogFlowData", "currentNode"],
  components: {
    Codemirror,
    PropertiesFooter,
    PropertiesHeader,
  },
  mixins: [wfDirty],
  data() {
    return {
      loading: false,
      stage_list: [],
      form: {
        component_name:"",
        stage:""
      },
      formRules: {
        stage: [          
          {
            required: true,
            message: "Please select stage",
            trigger: "blur",
          }
        ]
      }  
    };
  },
  methods: {
    init() {
      // this.stage_list = Object.keys(Constants.DOCEX.STAGE).map((e) => {
      //   STAGE[e] = _.isArray(STAGE[e]) ? STAGE[e][0] : STAGE[e];
      //   return { label: STAGE[e], value: STAGE[e] };
      // });
      const allStages = Constants.DOCEX.STAGE 
      for(let stage in allStages){
        this.stage_list.push({ label: stage, value: allStages[stage] })
      }
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
