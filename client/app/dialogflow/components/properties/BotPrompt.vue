<template>
  <el-main v-scroll="onScroll">

    <p class="property-heading">
      {{dialogFlowData.name}} Properties
    </p>

    <el-tabs
      v-if="dialogFlowData.workflow_data.nodes[currentNode.id].data"
      class=""
    >
      <!-- general -->
      <el-tab-pane>
        <span slot="label">General</span>

        <div class="content-body">
          <el-form
            ref="form"
            label-width="110px"
          >
            <el-col>
              <div class="form-top-light">
                <!-- <el-form-item
                  class="inline-label-item"
                  label="Tag"
                  :rules="[ { required: false, message: 'Please select Tag', trigger: 'blur' } ]"
                >
                  <el-input style="display:none"></el-input>
                  <v-select
                    @input="handleTagNameChange"
                    v-model="tagName"
                    :options="tagList"
                  ></v-select>
                </el-form-item> -->
                <el-form-item
                  class="inline-label-item"
                  label="Entities"
                  prop="entities"
                >
                  <entity-tag-list :propData="objectListParam" @change="handleTagNameChange"></entity-tag-list>
            </el-form-item>
              </div>

              <label class="label-name">User Input Required</label>
              <codemirror v-model="dialogFlowData.workflow_data.nodes[currentNode.id].data.general.user_input_required_script"></codemirror>

            </el-col>
          </el-form>
        </div>
      </el-tab-pane>
      <!-- end general -->
      <!-- bot Utterence -->
      <el-tab-pane>
        <span slot="label">Bot Utterence</span>
        <div class="content-body">
          <el-form
            ref="form"
            label-width="130px"
          >

            <!-- bot prompts -->
            <div class="bot-prompt-container add-section">
              <p class="heading">Bot Prompts
                <i
                  v-popover:Promts
                  class="mdi mdi-information"
                ></i>
                <el-popover
                  ref="Promts"
                  placement="right"
                  width="150"
                  trigger="hover"
                >
                  Info goes here Info goes here Info goes here Info goes here
                </el-popover>
              </p>
              <el-row
                v-for="(message,index) in botPrompts"
                :key="index"
                :gutter="5"
              >
                <el-col :span="22">
                  <el-input
                    placehoel-inputlder="Promt 1"
                    v-model="botPrompts[index]"
                    v-on:blur="handleBotPrompts($event.target.value,index)"
                  ></el-input>
                </el-col>
                <el-col :span="2">
                  <el-button
                    v-if="index != 0"
                    v-on:click="removeBotPrompt(index)"
                    class="btn-delete"
                    size="mini"
                    circle
                  >
                    <i class="mdi mdi-delete"></i>
                  </el-button>
                </el-col>
              </el-row>
              <el-button
                class="btn-add"
                v-on:click="addBotPrompt()"
                size="small"
              >+ Add</el-button>
              <el-row>
                <el-col :span="3">
                  <el-checkbox
                    v-model="isSkipEntity"
                    @change="handleSkipEntity"
                    class="mt-10"
                  ><i>Allow Skip</i></el-checkbox>
                </el-col>
              </el-row>
            </div> <!-- bot prompts -->

            <el-form-item
              class="inline-label-item"
              label="User Input Type"
              :rules="[ { required: false, message: 'Please select User Input Type', trigger: 'blur' } ]"
            >
              <!-- <label class="el-form-item__label">User Input Type</label> -->
              <el-select
                v-model="dialogFlowData.workflow_data.nodes[currentNode.id].data['bot_utterence']['user_input_type']"
                @change="handleUserInputChange"
                placeholder="Select Type"
              >
                <el-option
                  v-for="(value,key) in userInputList"
                  :label="key"
                  :value="value"
                  :key="key"
                ></el-option>
              </el-select>
            </el-form-item>
            <div class="divide-dashed mt-20"></div>

            <!--  Attributes -->
            <div
              v-if="!isAdvanced"
              class="attribute-container add-section"
            >

              <p class="heading">Attributes
                <i
                  v-popover:attributes
                  class="mdi mdi-information"
                ></i>
                <el-popover
                  ref="attributes"
                  placement="right"
                  width="150"
                  trigger="hover"
                >
                  Info goes here Info goes here Info goes here Info goes here
                </el-popover>
              </p>
              <el-row
                v-for="(attribute,index) in attributeList"
                :key="attribute"
                :gutter="5"
              >
                <el-col :span="11">
                  <el-input
                    v-model="attribute.key"
                    placeholder="Attribute Nruname"
                    v-on:blur="handleAttributes($event.target.value,index,'key')"
                  ></el-input>
                </el-col>
                <el-col :span="11">
                  <el-input
                    v-model="attribute.value"
                    placeholder="Attribute Value"
                    v-on:blur="handleAttributes($event.target.value,index,'value')"
                  ></el-input>
                </el-col>
                <el-col :span="2">
                  <el-button
                    v-if="index != 0"
                    v-on:click="removeAttribute(index)"
                    class="btn-delete"
                    size="mini"
                    circle
                  >
                    <i class="mdi mdi-delete"></i>
                  </el-button>
                </el-col>
              </el-row>

              <el-button
                class="btn-add"
                v-on:click="addAttribute()"
                size="small"
              >+ Add</el-button>

            </div> <!-- / Attributes -->
            <div
              v-if="!isAdvanced"
              class="divide-dashed mt-10 mb-10"
            ></div>

            <!--  options -->
            <div
              v-if="showOptionBlock()"
              class="options-container add-section"
            >
              <p class="heading">Options
                <i
                  v-popover:options
                  class="mdi mdi-information"
                ></i>
                <el-popover
                  ref="options"
                  placement="right"
                  width="150"
                  trigger="hover"
                >
                  key and value pair of select input
                </el-popover>
              </p>
              <el-row
                v-for="(option,index) in optionList"
                :key="option"
                :gutter="5"
              >
                <el-col :span="11">
                  <el-input
                    v-model="option.key"
                    placeholder="key"
                    v-on:blur="handleOptions($event.target.value,index,'key')"
                  ></el-input>
                </el-col>
                <el-col :span="11">
                  <el-input
                    v-model="option.value"
                    placeholder="value"
                    v-on:blur="handleOptions($event.target.value,index,'value')"
                  ></el-input>
                </el-col>
                <el-col :span="2">
                  <el-button
                    v-if="index != 0"
                    v-on:click="removeOption(index)"
                    class="btn-delete"
                    size="mini"
                    circle
                  >
                    <i class="mdi mdi-delete"></i>
                  </el-button>
                </el-col>
              </el-row>
              <el-button
                class="btn-add"
                v-on:click="addOption()"
                size="small"
              >+ Add</el-button>
            </div> <!-- / options -->

            <!-- option block -->
            <!-- <el-checkbox v-model="isAdvanced" @change="removeOptionCondition(0)" class="mt-10"><i>Advanced</i></el-checkbox>		 -->

            <el-col
              :span="24"
              class="webchat-validation"
            >

              <el-checkbox
                v-model="isAdvanced"
                @change="setFlag"
                class="mt-10"
              ><i>Advanced</i></el-checkbox>

              <!-- <el-checkbox class="webchat-chekboxupdate" v-model="checkedBotUtterence" @change="removeOptionCondition(0)">Advanced</el-checkbox> -->
            </el-col>

            <div
              class="mt-20"
              v-if="isAdvanced"
            >
              <label class="label-name">Option Script</label>
              <codemirror
                v-model="dialogFlowData.workflow_data.nodes[currentNode.id].data['bot_utterence']['option_script']"
                :value="dialogFlowData.workflow_data.nodes[currentNode.id].data['bot_utterence']['option_script']"
              ></codemirror>
            </div>

          </el-form>
        </div>
      </el-tab-pane>
      <!-- bot utterence ended -->
      <!-- validation -->
      <el-tab-pane>
        <span slot="label">Validation</span>
        <div class="content-body">
          <el-form ref="form">
            <codemirror
              v-model="dialogFlowData.workflow_data.nodes[currentNode.id].data['validation']['validation_script']"
              :value="dialogFlowData.workflow_data.nodes[currentNode.id].data['validation']['validation_script']"
            ></codemirror>
          </el-form>
        </div> <!-- // content body -->

      </el-tab-pane>
      <!-- output -->
      <el-tab-pane>
        <span slot="label">Connections</span>

        <div class="content-body">
          <el-form
            ref="form"
            label-width="110px"
          >
            <el-card
              v-for="(output,index) in connectionList"
              :key="index"
              class="box-card "
            >
              <el-button
                v-on:click="removeConnection(output,index)"
                class="btn-delete btn-delete-card"
                size="mini"
                circle
              >
                <i class="mdi mdi-delete"></i>
              </el-button>
              <el-form-item
                class="inline-label-item"
                label="Label"
              >
                <el-input
                  placeholder="label"
                  v-model="output.label"
                  v-on:blur="handleConnections($event.target.value,index)"
                ></el-input>
              </el-form-item>

              <label class="label-name">Script</label>
              <codemirror
                class="mt-10"
                v-model="output.script"
                :value="output.script"
                @onBlur="handleOutputScript(output.script,index)"
              ></codemirror>
            </el-card>
            <el-button
              size="small"
              class="btn-addtag"
              v-on:click="addConnection($event)"
              type="primary"
            >+ ADD CONDITION</el-button>

            <!-- <SortableList lockAxis="y" v-model="connectionList" @input="handleSort(newList)" :addConnection="addConnection">
        <SortableItem v-for="(output,index) in connectionList"  :index="index" :key="index" :output="output" :removeConnection="removeConnection" :handleConnections="handleConnections" :editorProperties="editorProperties" :currentNode="currentNode" />
      </SortableList>   -->
          </el-form>
        </div> <!-- // content body -->
      </el-tab-pane>
      <!-- end connections -->

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
import EntityTagList from "../../../components/EntityTagList"
const uuidv4 = require("uuid/v4");
let tableAPI = new TableAPIService();
import _ from "lodash";

//   const SortableList = {
//   mixins: [ContainerMixin],
//   props:['addConnection'],
//   template: `
//       <el-form ref="form" label-width="110px">
//        <slot />
//             <el-button size="small" class="btn-addtag" v-on:click="addConnection($event)" type="primary">+ ADD CONDITION</el-button>

//           </el-form>
//   `,
// };

// const SortableItem = {
//   mixins: [ElementMixin],
//   props: ['output','removeConnection','handleConnections','editorProperties','currentNode'],
//    components: {
//       Codemirror},
//   template: `
//      <el-card class="box-card ">
//               <el-button  v-on:click="removeConnection(output,index)" class="btn-delete btn-delete-card" size="mini" circle>
//                 <i class="mdi mdi-delete"></i>
//               </el-button>
//             <el-form-item class="inline-label-item" label="Label">
//               <el-input  placeholder="label" v-model="output.label" v-on:blur="handleConnections($event.target.value,index)"></el-input>
//             </el-form-item>
//             {{editorProperties[currentNode.id].data['connections'][index]['script']}}
//              <label class="label-name">Script</label>
//               <codemirror
//                 class="mt-10"
//                  v-model="output.script"
//             :value="output.script"
//             @onBlur="handleOutputScript(output.script,index)"
//               ></codemirror>
//             </el-card>
//         </el-card>
//   `,
// };
export default {
  name: "BotPrompt",
  props: ["dialogFlowData", "currentNode"],
  components: {
    Codemirror,
    EntityTagList
  },

  data() {
    return {
      entityObject: {},
      tagList: "",
      userInputList: "",
      tagName: "",
      userInput: "",
      checkedGeneral: "",
      checkedOutput: "",
      isAdvanced: false,
      allowSkip: false,
      counter: 1,
      botPrompts: [""],
      attributeList: [{}],
      optionList: [{}],
      connectionList: [],
      objectListParam:{multiple:false}
    };
  },
  methods: {
    init() {
      this.dialogFlowData.workflow_data.nodes[
        this.currentNode.id
      ] = this.currentNode;
      const nodeData = this.dialogFlowData.workflow_data.nodes[
        this.currentNode.id
      ].data
      this.tagName = _.has(nodeData,"general")? this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data["general"]["tag_name"] : "";
      _.size(
        this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data
      ) <= 1
        ? this.intializeDataProperties()
        : this.setProperties();
      console.log(
        "this.dialogFlowData.workflow_data.nodes" +
          JSON.stringify(this.dialogFlowData.workflow_data.nodes)
      );
      this.getTagList();
      this.getUserInputList();
    },

    intializeDataProperties() {
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "general"
      ] = {};
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "general"
      ]["tag_name"] = "";
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "bot_utterence"
      ] = {};
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "bot_utterence"
      ]["bot_prompts"] = [];
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "bot_utterence"
      ]["user_input_type"] = "";

      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "bot_utterence"
      ]["attributes"] = [{}];
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "bot_utterence"
      ]["options"] = [{}];
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "bot_utterence"
      ]["isAdvanced"] = false;
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "bot_utterence"
      ]["option_script"] = "";
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "validation"
      ] = {};
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "validation"
      ]["validation_script"] = "";
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "connections"
      ] = [];

      // let general = this.editorProperties[this.currentNode.id].data["general"];
      // let botUtterence = this.editorProperties[this.currentNode.id].data["bot_utterence"];
      // let botPrompts = this.editorProperties[this.currentNode.id].data["bot_utterence"]["bot_prompts"];
      // let attributes =  this.editorProperties[this.currentNode.id].data["bot_utterence"]["attributes"] ;
      // let options = this.editorProperties[this.currentNode.id].data["bot_utterence"]["options"];
      // let isAdvanced =this.editorProperties[this.currentNode.id].data["bot_utterence"]["isAdvanced"];
      // let optionScript = this.editorProperties[this.currentNode.id].data["bot_utterence"]["option_script"];
      // let validation = this.editorProperties[this.currentNode.id].data["validation"] ;
      // let connections = this.editorProperties[this.currentNode.id].data["connections"];
      // let connectionScript = this.editorProperties[this.currentNode.id].data["connections"]["script"];

      // this.editorProperties[this.currentNode.id].data["general"] = _.isEmpty(general)?{}:general;
      //  this.editorProperties[this.currentNode.id].data["general"]["tag_name"] = _.isEmpty(general)?"":general["tag_name"];
      // this.editorProperties[this.currentNode.id].data["bot_utterence"] = _.isEmpty(botUtterence)?{}:botUtterence;
      // this.editorProperties[this.currentNode.id].data["bot_utterence"]["bot_prompts"]= _.isEmpty(botPrompts)?[]:botPrompts;
      // this.editorProperties[this.currentNode.id].data["bot_utterence"]["attributes"]= _.isEmpty(attributes)?[]:attributes;
      // this.editorProperties[this.currentNode.id].data["bot_utterence"]["options"]= _.isEmpty(options)?[]:options;
      // this.editorProperties[this.currentNode.id].data["bot_utterence"]["isAdvanced"]= _.isEmpty(isAdvanced)?false:isAdvanced;
      // this.editorProperties[this.currentNode.id].data["bot_utterence"]["option_script"]= _.isEmpty(optionScript)?"":optionScript;
      // this.editorProperties[this.currentNode.id].data["validation"] = _.isEmpty(validation)?{}:validation;
      // this.editorProperties[this.currentNode.id].data["connections"]= _.isEmpty(connections)?[]:connections;
      // this.editorProperties[this.currentNode.id].data["connections"]["script"]= _.isEmpty(connectionScript)?"":connectionScript;
    },
    setProperties() {
      this.botPrompts = this.dialogFlowData.workflow_data.nodes[
        this.currentNode.id
      ].data["bot_utterence"]["bot_prompts"];
      this.attributeList = this.dialogFlowData.workflow_data.nodes[
        this.currentNode.id
      ].data["bot_utterence"]["attributes"];
      this.optionList = this.dialogFlowData.workflow_data.nodes[
        this.currentNode.id
      ].data["bot_utterence"]["options"];
      this.isAdvanced = this.dialogFlowData.workflow_data.nodes[
        this.currentNode.id
      ].data["bot_utterence"]["isAdvanced"];
      this.connectionList = this.dialogFlowData.workflow_data.nodes[
        this.currentNode.id
      ].data["connections"];
    },

    handleTagNameChange(value) {
      this.tagName = value;
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "general"
      ]["tag_name"] = value;
      this.currentNode.update();
      this.$forceUpdate();
    },
    handleUserInputChange(value) {
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "bot_utterence"
      ]["user_input_type"] = value;
      this.$forceUpdate();
    },
    handleBotPrompts(value, index) {
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "bot_utterence"
      ]["bot_prompts"][index] = value;
    },
    handleConnections(value, index) {
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "connections"
      ].push({});
      if (value) {
        this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
          "connections"
        ][index]["label"] = value;
        if (
          this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
            "connections"
          ][index]["name"]
        ) {
          this.currentNode.update();
          return;
        }
        const name = uuidv4();
        this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
          "connections"
        ][index]["name"] = name;
        this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
          "connections"
        ][index]["output"] = new Rete.Output(
          name,
          value,
          this.currentNode.inputs.get("act").socket
        );
        this.dialogFlowData.workflow_data.nodes[this.currentNode.id].addOutput(
          this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
            "connections"
          ][index]["output"]
        );
        this.currentNode.update();
      }
    },
    handleOutputScript(value, index) {
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "connections"
      ][index]["script"] = value;
    },
    handleOptions(value, index, key) {
      if (key == "key") {
        this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
          "bot_utterence"
        ]["options"][index]["key"] = value;
      } else {
        this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
          "bot_utterence"
        ]["options"][index]["value"] = value;
      }
    },
    handleAttributes(value, index, key) {
      if (key == "key") {
        this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
          "bot_utterence"
        ]["attributes"][index]["key"] = value;
      } else {
        this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
          "bot_utterence"
        ]["attributes"][index]["value"] = value;
      }
    },
    showOptionBlock() {
      let userInputType = this.dialogFlowData.workflow_data.nodes[
        this.currentNode.id
      ].data["bot_utterence"].user_input_type;

      if (
        !this.isAdvanced &&
        _.includes(["SELECT", "MULTISELECT", "BUTTONS"], userInputType)
      ) {
        return true;
      }
      return false;
    },

    addAttribute() {
      this.attributeList.push({});
    },
    removeAttribute(index) {
      this.attributeList.splice(index, 1);
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "bot_utterence"
      ]["attributes"].splice(index, 1);
    },
    addOption() {
      this.optionList.push({});
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "bot_utterence"
      ]["options"].push({});
    },
    removeOption(index) {
      this.optionList.splice(index, 1);
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "bot_utterence"
      ]["options"].splice(index, 1);
    },

    addConnection(event) {
      this.connectionList.push({});
    },
    removeConnection(output, index) {
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].removeOutput(
        new Rete.Output(
          output.name,
          output.value,
          this.currentNode.inputs.get("act").socket
        )
      );
      this.currentNode.update();
      this.connectionList.splice(index, 1);
    },
    addBotPrompt() {
      this.botPrompts.push("");
      this.$forceUpdate();
    },
    removeBotPrompt(index) {
      this.botPrompts.splice(index, 1);
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "bot_utterence"
      ]["bot_prompts"].splice(index, 1);
    },
    setFlag() {
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "bot_utterence"
      ]["isAdvanced"] = this.isAdvanced;
    },
    handleSkipEntity() {
      this.allowSkip = this.allowSkip ? false : true;
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "bot_utterence"
      ]["allow_skip"] = this.allowSkip;
    },
    async getTagList() {
      if (this.dialogFlowData) {
        this.tagList = await EntityService.fetchTagListByDomain(
          this.dialogFlowData.domain
        ).catch(error => {
          this.notifyError("Error while fetching tags!!");
        });
        this.tagList.sort();
      } else {
        this.tagList = [];
      }
    },
    getUserInputList() {
      this.userInputList = constants.REQUIRED_ENTITY.ACTION_TYPES;
    }
  },
  mounted() {
    const payload = {
        system_name:this.dialogFlowData.domain
      }
      if(this.dialogFlowData._id){
        payload.entities = this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data["general"]["tag_name"] || "" 
      }
      
      EventBus.$emit("ASSIGN_ENTITIES", payload);
  },
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