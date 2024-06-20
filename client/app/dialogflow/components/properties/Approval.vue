<template>
  <el-main v-scroll="onScroll">
    <p class="property-heading">{{dialogFlowData.name}} Properties</p>
    <el-tabs v-if="dialogFlowData.workflow_data.nodes[currentNode.id].data" class>
      <!-- Approver's data -->
      <el-tab-pane>
        <span slot="label">General</span>
        <div class="content-body">
          <el-form ref="form" label-width="130px">
            <!-- Approver's List -->
            <div class="bot-prompt-container add-section" v-if="!isAdvanced">
              <p class="heading">
                Approver Options
                <i v-popover:Approvers class="mdi mdi-information"></i>
                <el-popover
                  ref="Approvers"
                  placement="right"
                  width="150"
                  trigger="hover"
                >Enter the list of approvers here</el-popover>
              </p>
              <el-row v-for="(message,index) in approvers" :key="index" :gutter="5">
                <el-col :span="22">
                  <el-input
                    placehoel-inputlder="Approver 1"
                    v-model="approvers[index]"
                    v-on:blur="handleApproversList($event.target.value,index)"
                  ></el-input>
                </el-col>
                <el-col :span="2">
                  <el-button
                    v-if="index != 0"
                    v-on:click="removeApprover(index)"
                    class="btn-delete"
                    size="mini"
                    circle
                  >
                    <i class="mdi mdi-delete"></i>
                  </el-button>
                </el-col>
              </el-row>
              <el-button class="btn-add" v-on:click="addApprover()" size="small">+ Add</el-button>
            </div>
            <!-- Approver's List End -->
            <!-- Dash Seperator -->
            <div class="divide-dashed mt-20" v-if="!isAdvanced"></div>
            <!-- Dash Seperator End -->
            <!-- Advanced Option Script -->
            <el-col :span="24" class="webchat-validation">
              <el-checkbox v-model="isAdvanced" @change="setFlag" class="mt-10">
                <i>Advanced</i>
              </el-checkbox>
            </el-col>
            <div class="mt-20" v-if="isAdvanced">
              <label class="label-name">Approvers Option Script</label>
              <codemirror
                v-model="dialogFlowData.workflow_data.nodes[currentNode.id].data['general']['approvers_option_script']"
                :value="dialogFlowData.workflow_data.nodes[currentNode.id].data['general']['approvers_option_script']"
              ></codemirror>
            </div>
            <!-- Advanced Option Script End -->
          </el-form>
        </div>
      </el-tab-pane>
      <!-- Approver's data End-->
      <!-- Notifications Information -->
      <el-tab-pane>
        <span slot="label">Notifications</span>
        <div class="content-body">
          <el-form ref="form" label-width="130px">
            <!-- Email Notification -->
            <div class="bot-prompt-container add-section">
              <p class="heading">
                Email Notification
                <i v-popover:Email class="mdi mdi-information"></i>
                <el-popover
                  ref="Email"
                  placement="right"
                  width="150"
                  trigger="hover"
                >Email Notification Information</el-popover>
              </p>
              <div>
                <label class="label-name">Email Subject</label>
                <el-row>
                  <el-col :span="22">
                    <el-input
                      placeholder="Email Subject"
                      v-model="email_subject"
                      v-on:blur="handleText($event.target.value,'email_subject')"
                    ></el-input>
                  </el-col>
                </el-row>
              </div>
              <div class="mt-20">
                <label class="label-name">Email Body</label>
                <codemirror
                  v-model="dialogFlowData.workflow_data.nodes[currentNode.id].data['notification_info']['email_template_script']"
                  :value="dialogFlowData.workflow_data.nodes[currentNode.id].data['notification_info']['email_template_script']"
                ></codemirror>
              </div>
            </div>
            <!-- Email Notification End-->
            <!-- Dash Seperator -->
            <div class="divide-dashed mt-20"></div>
            <!-- Dash Seperator End -->
            <!-- App Notification -->
            <div class="bot-prompt-container add-section" v-if="enableAppNotification()">
              <p class="heading">
                App Notification
                <i v-popover:Notification class="mdi mdi-information"></i>
                <el-popover
                  ref="Notification"
                  placement="right"
                  width="150"
                  trigger="hover"
                >App Notification Information</el-popover>
              </p>
              <div>
                <label class="label-name">App Notification Subject</label>
                <el-row>
                  <el-col :span="22">
                    <el-input
                      placeholder="Notification Subject"
                      v-model="app_notification_subject"
                      v-on:blur="handleText($event.target.value,'app_notification_subject')"
                    ></el-input>
                  </el-col>
                </el-row>
              </div>
              <div class="mt-20">
                <label class="label-name">App Notification Body</label>
                <codemirror
                  v-model="dialogFlowData.workflow_data.nodes[currentNode.id].data['notification_info']['app_notification_template_script']"
                  :value="dialogFlowData.workflow_data.nodes[currentNode.id].data['notification_info']['app_notification_template_script']"
                ></codemirror>
              </div>
            </div>
            <!-- App Notification End -->
          </el-form>
        </div>
      </el-tab-pane>
      <!-- Notifications Information End-->
      <!-- Connections -->
      <el-tab-pane v-if="showConnections">
        <span slot="label">Connections</span>
        <div class="content-body">
          <el-form ref="form" label-width="110px">
            <el-card v-for="(output,index) in connectionList" :key="output" class="box-card">
              <el-form-item class="inline-label-item" label="Label">
                <el-input
                  placeholder="label"
                  v-model="output.label"
                  v-on:blur="handleBlur($event.target.value,index)"
                ></el-input>
              </el-form-item>
              <label class="label-name">Script</label>
              <codemirror
                class="mt-10"
                v-model="dialogFlowData.workflow_data.nodes[currentNode.id].data['connections'][index]['script']"
                :value=" dialogFlowData.workflow_data.nodes[currentNode.id].data['connections'][index]['script']"
              ></codemirror>
            </el-card>
          </el-form>
        </div>
      </el-tab-pane>
      <!-- Connections End -->
    </el-tabs>
  </el-main>
</template>

<script>
import EventBus from "@/EventBus";
import TableAPIService from "@/services/TableAPIService";
import constants from "@/dialogflow/helpers/Constants";
import Rete from "rete";
import * as Socket from "../../sockets";
import DialogFlowService from "@/dialogflow/services/DialogFlowService";
import EntityService from "@/services/EntityService";
import propertyJSON from "@/dialogflow/helpers/Property";
import Codemirror from "@/components/Codemirror.vue";
import { ContainerMixin, ElementMixin } from "vue-slicksort";

const uuidv4 = require("uuid/v4");
let tableAPI = new TableAPIService();
import _ from "lodash";

export default {
  name: "Approval",
  props: ["dialogFlowData", "currentNode"],
  components: {
    Codemirror
  },
  data() {
    return {
      isAdvanced: false,
      approvers: [""],
      connectionList: [],
      email_subject: "",
      app_notification_subject: "",
      showConnections: false
    };
  },
  methods: {
    enableAppNotification(){
      let user = this.$store.getters.user
      return user.type!=constants.USER_TYPES.QNA
    },
    init() {
      this.dialogFlowData.workflow_data.nodes[
        this.currentNode.id
      ] = this.currentNode;
      _.size(
        this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data
      ) <= 1
        ? this.intializeDataProperties()
        : this.setProperties();
      console.log(
        "this.dialogFlowData.workflow_data.nodes" +
          JSON.stringify(this.dialogFlowData.workflow_data.nodes)
      );
      this.setOutputConnections();
    },

    handleText(value, key) {
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "notification_info"
      ][key] = value;
    },

    handleBlur(updatedLabel, index) {
      if (updatedLabel) {
        this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
          "connections"
        ][index]["label"] = updatedLabel;
        if (
          this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
            "connections"
          ][index]["name"]
        ) {
          console.log(
            "=======node should update for new label ====== ",
            updatedLabel
          );
          this.currentNode.update();
          this.connectionList = this.dialogFlowData.workflow_data.nodes[
            this.currentNode.id
          ].data["connections"];
          console.log("=======node updated======");
        }
      }
    },

    setOutputConnections() {
      let connections = this.dialogFlowData.workflow_data.nodes[
        this.currentNode.id
      ].data["connections"];
      if (_.isEmpty(connections)) {
        console.log("====No data in connections found====");
        let labels = constants.APPROVAL_CONNECTION_LABELS;
        for (let index = 0; index < 2; index++) {
          let label = labels[index];
          let name = uuidv4();
          this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
            "connections"
          ][index] = {};
          this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
            "connections"
          ][index]["name"] = name;
          this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
            "connections"
          ][index]["label"] = label;
          this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
            "connections"
          ][index]["script"] = constants.APPROVAL_SCRIPTS[label];
          this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
            "connections"
          ][index]["output"] = new Rete.Output(
            name,
            labels[index],
            this.currentNode.inputs.get("act").socket
          );
          this.dialogFlowData.workflow_data.nodes[
            this.currentNode.id
          ].addOutput(
            this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
              "connections"
            ][index]["output"]
          );
          this.currentNode.update();
        }
      } else {
        this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
          "connections"
        ] = connections;
      }
      this.connectionList = this.dialogFlowData.workflow_data.nodes[
        this.currentNode.id
      ].data["connections"];
      console.log("connection list updated: ", this.connectionList);
    },

    intializeDataProperties() {
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "general"
      ] = {};
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "general"
      ]["options"] = [];
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "general"
      ]["isAdvanced"] = false;
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "notification_info"
      ] = {};
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "connections"
      ] = [];
    },

    setProperties() {
      this.approvers = this.dialogFlowData.workflow_data.nodes[
        this.currentNode.id
      ].data["general"]["options"];
      this.isAdvanced = this.dialogFlowData.workflow_data.nodes[
        this.currentNode.id
      ].data["general"]["isAdvanced"];
      this.email_subject = this.dialogFlowData.workflow_data.nodes[
        this.currentNode.id
      ].data["notification_info"]["email_subject"];
      this.app_notification_subject = this.dialogFlowData.workflow_data.nodes[
        this.currentNode.id
      ].data["notification_info"]["app_notification_subject"];
    },

    handleApproversList(value, index) {
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "general"
      ]["options"][index] = value;
    },

    addApprover() {
      this.approvers.push("");
      this.$forceUpdate();
    },

    removeApprover(index) {
      this.approvers.splice(index, 1);
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "general"
      ]["options"].splice(index, 1);
    },

    setFlag() {
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "general"
      ]["isAdvanced"] = this.isAdvanced;
    }
  },
  mounted() {},
  beforeMount() {
    this.init();
  },
  updated() {
    console.log("inside entity updated");
  }
};
</script>

<style lang="scss">
// @import "../../../assets/scss/_variables";
// .el-main {
//   padding: 0;
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
//   .el-input__icon {
//     line-height: 30px;
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