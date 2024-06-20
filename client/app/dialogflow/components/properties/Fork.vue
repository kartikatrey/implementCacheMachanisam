<template>
 
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
import UserService from "@/idp/services/UserService";

const uuidv4 = require("uuid/v4");
let tableAPI = new TableAPIService();
import _ from "lodash";

export default {
  name: "Fork",
  props: ["dialogFlowData", "currentNode"],
  components: {
    Codemirror
  },
  data() {
    return {
     
    form:{
      }
    };
  },
  methods: {

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
    },

   
  
   

    intializeDataProperties() {
      this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data = this.form
    },

    setProperties() {
      this.form= this.dialogFlowData.workflow_data.nodes[
        this.currentNode.id
      ].data
    },
  },
  mounted() {},
  async beforeMount() {

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