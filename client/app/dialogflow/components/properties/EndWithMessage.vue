<template>
  <div>
    <el-form ref="form" label-width="120px">
      <el-form-item label="Message">
        <el-input v-model="message"  v-on:blur="handleMessage($event.target.value)"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import EventBus from "@/EventBus";
import propertyJSON from "@/dialogflow/helpers/Property";

import _ from "lodash";
export default {
  name:"EndWithMessage",
   props: ["dialogFlowData", "currentNode"],
  data() {
    return {
  message:""
    };
  },
  methods: {
    init() {
       this.dialogFlowData.workflow_data.nodes[this.currentNode.id] = this.currentNode;
        this.message = (_.size( this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data) <= 1) ? "" : this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data['message']
         },
   
    handleMessage(value){
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data['message']=value
    }
  },
  mounted() {
    this.init();
  }
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