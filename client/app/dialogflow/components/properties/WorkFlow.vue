<template>
  <el-main v-scroll="onScroll">

    <p class="property-heading">
      {{dialogFlowData.workflow_data.nodes[currentNode.id].name}} Properties
    </p>
    <div class="content-body">

      <el-form>
        <span slot="label">Script</span>
        <div class="content-body">

          <el-form ref="form">
            <el-col>
              <div
                v-if="!formData['isAdvanced']"
                class="form-top-light"
              >
                <el-form-item
                  class="inline-label-item"
                  label="WorkflowName"
                  :rules="[ { required: false, message: 'Please select Tag', trigger: 'blur' } ]"
                >
                  <el-select
                    v-model="formData['workflow_name']"
                    @change="handleNameChange"
                    placeholder="Select"
                  >
                    <el-option
                      v-for="workflow in workFlowList"
                      :label="workflow.name"
                      :value="workflow"
                      :key="workflow._id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <el-col
                :span="24"
                class="webchat-validation"
              >

                <el-checkbox
                  v-model="formData['isAdvanced']"
                  @change="setFlag"
                  class="mt-10"
                ><i>Advanced</i></el-checkbox>

                <!-- <el-checkbox class="webchat-chekboxupdate" v-model="checkedBotUtterence" @change="removeOptionCondition(0)">Advanced</el-checkbox> -->
              </el-col>
              <div v-if="formData['isAdvanced']">
                <label class="label-name">Script</label>
                <codemirror
                  v-model="dialogFlowData.workflow_data.nodes[currentNode.id].data['script']"
                  :value="dialogFlowData.workflow_data.nodes[currentNode.id].data['script']"
                ></codemirror>
              </div>
            </el-col>
          </el-form>
        </div> <!-- // content body -->

      </el-form>
    </div> <!-- // content body -->

  </el-main>
</template>

<script>
import EventBus from "@/EventBus";
import TableAPIService from "@/services/TableAPIService";
import constants from "@/dialogflow/helpers/Constants";
import Rete from "rete";
import * as Socket from "../../sockets";
import DialogFlowService from "@/dialogflow/services/DialogFlowService";
import propertyJSON from "@/dialogflow/helpers/Property";
import Codemirror from "@/components/Codemirror.vue";
import { ContainerMixin, ElementMixin } from "vue-slicksort";

const uuidv4 = require("uuid/v4");
let tableAPI = new TableAPIService();
import _ from "lodash";

export default {
  name: "Workflow",
  props: ["dialogFlowData", "currentNode"],
  components: {
    Codemirror
  },
  data() {
    return {
      formData: {
        workflow_name: "",
        isAdvanced: false
      },
      workFlowList: {}
    };
  },
  methods: {
    async init() {
      this.dialogFlowData.workflow_data.nodes[
        this.currentNode.id
      ] = this.currentNode;
      await this.fetchWorkflowList();
      if (
        _.size(
          this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data
        ) <= 1
      ) {
        this.intializeDataProperties();
      } else {
        this.setProperties();
      }
    },
    intializeDataProperties() {
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "script"
      ] = "";
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "workflow_id"
      ] = "";
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "isAdvanced"
      ] = false;
    },
    async fetchWorkflowList() {
      this.workFlowList = await DialogFlowService.fetchWorkflowList().catch(
        error => {
          this.notifyError("Error while fetching workflowlist!!");
        }
      );
      console.log("workflow List is:::" + JSON.stringify(this.workFlowList));
    },

    setProperties() {
      if (this.workFlowList) {
        let index = _.findIndex(this.workFlowList, {
          _id: this.dialogFlowData.workflow_data.nodes[this.currentNode.id]
            .data["workflow_id"]
        });
        this.formData["workflow_name"] = this.workFlowList[index].name;
        this.formData["isAdvanced"] = this.dialogFlowData.workflow_data.nodes[
          this.currentNode.id
        ].data["isAdvanced"];
        this.formData["script"] = this.dialogFlowData.workflow_data.nodes[
          this.currentNode.id
        ].data["script"];
      }
    },
    handleNameChange(workflowObject) {
      this.formData.workflow_name = workflowObject.name;
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "workflow_name"
      ] = workflowObject.name;
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "workflow_id"
      ] = workflowObject._id;
    },
    setFlag() {
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "isAdvanced"
      ] = this.formData["isAdvanced"];
    }
  },

  mounted() {},
  beforeMount() {
    this.init();
  },
  updated() {
    console.log("inside workFlow updated");
  }
};
</script>

<style lang="scss">
// @import "../../../assets/scss/_variables";
// .el-main {
//   padding: 0;
// }
// .content-body .el-select {
//   display: inline-block;
// }
// .el-tabs__header {
//   margin-bottom: 0;
// }

// .el-form-item {
//   margin-top: 16px;
// }

// .CodeMirror {
//   border: 1px solid #dcdfe6;
// }

// .inline-label-item {
//   margin-bottom: 10px;
//   .el-form-item__content {

//     .el-select .el-input .el-input__icon {
//        line-height: 30px !important;
//     }
   
       
//   }


//   .el-form-item__label {
//     width: 110px;
//     background: #e8f0ff;
//     height: 30px;
//     line-height: 30px;
//     // font-weight:700;
//     padding-left: 5px;
//     columns: #879caf;
//     text-align: left;
//     padding-left: 10px;
//   }
//   .el-input__inner {
//     height: 30px;
//     line-height: 30px;
//     border-top-left-radius: 0;
//     border-bottom-left-radius: 0;
//   }
//   .el-form-item__content {
//     line-height: 28px;
//   }
//   .el-input__suffix {
//     top: 0 !important;
//   }
// } // inline label style
// .label-name {
//   padding: 3px 0;
//   font-size: $font-size-12;
//   font-weight: 700;
// }
// .el-tabs__content {
//   padding: 0 0 0 0 !important;
// }

// .add-section {
//   .el-row {
//     margin-bottom: 10px;
//   }

//   .heading {
//     font-weight: 700;
//     font-size: $font-size-14;
//     margin: 5px 0;
//   }
// } // add section
// .add-btn-circle {
//   color: $text-color-success;
//   font-size: 1.8rem;
// }
// .btn-add {
//   color: $text-color-success;
// }
// .btn-delete {
//   i {
//     color: $text-color-danger;
//   }
// }

// .attribute-container {
//   // background: #FAFAFA;
//   padding: 10px 0;
// }
// .divide-dashed {
//   border-top: 1px dashed #b7b7b7;
//   height: 1px;
//   width: 100%;
// }

// .el-card {
//   background: #fcfcfc;
//   border: 1px solid #e8e8e8;
//   box-shadow: none !important;
//   margin-bottom: 10px;
//   position: relative;
//   overflow: visible;
//   .el-card__body {
//     padding: 10px;
//   }
//   .btn-delete-card {
//     position: absolute;
//     right: 10px;
//     top: -12px;
//     i {
//       color: $text-color-danger;
//     }
//   }
// } // end card
// .el-popover {
//   font-size: $font-size-12;
// }
// .el-tabs__header {
//   // background: #F3F3F3;
//   padding-left: 16px;
//   .el-tabs__item {
//     padding: 0px 12px;
//   }
//   .el-tabs__active-bar {
//     height: 2px !important;
//   }
// }
// .CodeMirror {
//   height: 150px;
// }
</style>




<!--<template>
  <div>
    <el-form ref="form" label-width="120px">
      <el-form-item label="Entity name">
        <el-input v-model="entity.domain"></el-input>
      </el-form-item>
      <el-form-item label="Tag">
        <el-input v-model="entity.tagName"></el-input>
      </el-form-item>
      <el-form-item label="Bot Utterance">
        <el-input v-model="entity.bot_utterance"></el-input>
      </el-form-item>
      <el-form-item label="Options Script">
        <codemirror v-model="entity.optionsScript"></codemirror>
      </el-form-item>
      <el-form-item label="Required Script">
        <codemirror v-model="entity.requiredScript"></codemirror>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-on:click="update">Update</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import EventBus from "@/EventBus";
  import propertyJSON from "@/dialogflow/helpers/Property";
  import Codemirror from "@/components/Codemirror.vue";
  
  import _ from "lodash";
  export default {
    name: "Entity",
    props: ["currentNode"],
    components: {
      Codemirror
    },
    data() {
      return {
        entity: {}
      };
    },
    methods: {
      init() {
        this.entity = _.defaultsDeep(this.currentNode, propertyJSON.entity);
      },
      update() {
        EventBus.$emit("NODE_DATA_UPDATED", this.entity);
      }
    },
    mounted() {
      this.init();
    }
  };
</script>

<style>
  html,
  body {
    height: 100%;
    margin: 0;
  }
  
  button.compile {
    z-index: 5;
    position: absolute;
    top: 10px;
    left: 10px;
  }
</style>-->