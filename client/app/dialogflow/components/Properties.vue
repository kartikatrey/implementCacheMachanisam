<template>
  <component class="" :is="component"  v-if="component" v-bind="params"/>
</template>

<script>
import EventBus from "@/EventBus";
import Codemirror from "@/components/Codemirror.vue";
import _ from "lodash";
export default {
  props: ["dialogFlowData", "workflowType", "documentTypes"],
  components: { Codemirror },
  data() {
    return {
      component:null,
      params:{}
    };
  },
  methods: {
    subscribeEvents() {
      EventBus.$on("DISPLAY_PROPERTY_WINDOW", currentNode => {
        var componentName=(currentNode.name).replace(/\s/g, '')
        this.importComponent(componentName)
        this.params.dialogFlowData = this.dialogFlowData;
        this.params.workflowType = this.workflowType;
        this.params.documentTypes = this.documentTypes;
        this.params.currentNode = currentNode;
      });
   },
    importComponent(fileName) {
      this.component = () =>import(`@/dialogflow/components/properties/${fileName}`);
      this.params.dialogFlowData = this.dialogFlowData;
      this.params.workflowType = this.workflowType;
    }
  },
  mounted() {
    this.subscribeEvents(); 
    this.importComponent("Properties");
  },
};
</script>
<style lang="scss">
@import "../../assets/scss/_variables";
html,
body {
  height: 100%;
  margin: 0;
}
#d3ne {
  height: 100%;
  position: relative;
}

.socket.data {
  background: rgb(143, 125, 224);
}

.socket.act {
  background: rgb(16, 202, 16);
  border-radius: 0 !important;
  width: 16px !important;
}
.connection {
  overflow: visible !important;
  width: unset;
  height: unset;
  position: absolute;
  z-index: -1;
}

id {
  position: absolute;
  left: -6px;
  top: -6px;
  background: white;
}
// .property-container {
//   border-radius: 5px;
//   -webkit-box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
//   box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
//   background: $color-white;
// }

button.compile {
  z-index: 5;
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>