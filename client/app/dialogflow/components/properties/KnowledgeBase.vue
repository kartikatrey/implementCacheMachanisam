<template>
  <el-main >

    <p class="property-heading">
      {{dialogFlowData.name}} Properties
    </p>

    <el-tabs
      v-if="dialogFlowData.workflow_data.nodes[currentNode.id].data"
      class=""
    >

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

      <!-- output -->

    </el-tabs>

  </el-main>
</template>

<script>
import Rete from "rete";
import * as Socket from "../../sockets";
import KnowledgeBaseService from "@/services/KnowledgeBaseService";
import Codemirror from "@/components/Codemirror.vue";
import _ from "lodash";
import constants from "@/dialogflow/helpers/Constants";
const uuidv4 = require("uuid/v4");



export default {
  name: "KnowledgeBase",
  props: ["dialogFlowData", "currentNode"],
  components: {
    Codemirror
    //   SortableItem,
    // SortableList
  },
  data() {
    return {
      kbList: "",
      userInputList: "",
	  botPrompts: [""],
	  botPromptsPreText: [""],
      attributeList: [{}],
      optionList: [{}],
	  connectionList: [],
	  kb  : "",
	  showConnections : false,
	  isExternal: false,
	  extUrl : "",
    };
  },
  methods: {
    init() {
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id] = this.currentNode;
	  _.size(this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data) <= 1
	  	? this.intializeDataProperties()
        : this.setProperties();

	  console.log("this.dialogFlowData.workflow_data.nodes",this.dialogFlowData.workflow_data.nodes);
	  this.getKBList();
	  this.getUserInputList();
	  this.setOutputConnections();




    },

    intializeDataProperties() {
		console.log("initializing kb...")
		this.botPrompts = [];
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "general"
	  ] = {};

	  this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "general"
	  ]["knowledgeBase"] = {};

      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "bot_utterence"
	  ] = {};

      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "bot_utterence"
	  ]["bot_prompts"] = [];

	  this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "bot_utterence"
	  ]["pre_text"] = [];

	   this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "connections"
	  ] = [];

	  this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "general"
      ]["extUrl"] = "";
    },
    setProperties() {
		this.kb = this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data['general']['knowledgeBase'].title;

      this.botPrompts = this.dialogFlowData.workflow_data.nodes[
        this.currentNode.id
	  ].data["bot_utterence"]["bot_prompts"];

	  this.botPromptsPreText = this.dialogFlowData.workflow_data.nodes[
        this.currentNode.id
	  ].data["bot_utterence"]["pre_text"];

	  this.extUrl = this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "general"
	  ]["extUrl"];

	  this.isExternal = this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "general"
      ]["isExternal"];
    },

    handleKBChange(value) {
		console.log("kbchange ",value);
		this.kb = value.title;
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "general"
      ]["knowledgeBase"] = value;
      this.currentNode.update();
      this.$forceUpdate();
	},

    handleBotPrompts(value, index) {
	    this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "bot_utterence"
      ]["bot_prompts"][index] = value;
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


	handleBotPromptsPreText(value, index) {
	    this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "bot_utterence"
      ]["pre_text"][index] = value;
	},
    addBotPromptPreText() {
      this.botPromptsPreText.push("");
      this.$forceUpdate();
    },
    removeBotPromptPreText(index) {
      this.botPromptsPreText.splice(index, 1);
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "bot_utterence"
      ]["pre_text"].splice(index, 1);
	},


    async getKBList() {
      if (this.dialogFlowData) {
		this.kbList = await KnowledgeBaseService.fetchKBList()
		.catch(error => {
          this.notifyError("Error while fetching KnowledgeBase List!!");
		});
		console.log("KB list ",this.kbList);
      } else {
        this.kbList = [];
      }
	},

	getUserInputList() {
      this.userInputList = constants.REQUIRED_ENTITY.ACTION_TYPES;
	},

	addAttribute() {
      this.attributeList.push({});
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

	setFlag() {
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "general"
      ]["isExternal"] = this.isExternal;
	},

	handleExtUrl(value, index){
		this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
        "general"
      ]["extUrl"] = this.extUrl;
	},

	setOutputConnections() {
      let connections = this.dialogFlowData.workflow_data.nodes[
        this.currentNode.id
      ].data["connections"];
      if (_.isEmpty(connections)) {
        console.log("====No data in connections found====");
        let labels = constants.KB_CONNECTION_LABELS;
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
		  ][index]["script"] = constants.KB_SCRIPTS[label];

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

</style>


