<template>
  <el-main>
    <p class="property-heading">
      {{dialogFlowData.workflow_data.nodes[currentNode.id].name}} Properties
    </p>
    <el-tabs>
	    <el-tab-pane>
		    <span slot="label">On-wait</span>
            <div class="content-body">
                <el-form>
                    <div class="content-body">
                        <el-form ref="form">
                            <codemirror
                            v-model="dialogFlowData.workflow_data.nodes[currentNode.id].data['on_wait']"
                            :value="dialogFlowData.workflow_data.nodes[currentNode.id].data['on_wait']"
                            ></codemirror>
                        </el-form>
                    </div> 
                </el-form>
            </div>
		</el-tab-pane>
        <el-tab-pane>
		    <span slot="label">On-resume</span>
            <div class="content-body">
                <el-form>
                    <div class="content-body">
                        <el-form ref="form">
                            <codemirror
                            v-model="dialogFlowData.workflow_data.nodes[currentNode.id].data['on_resume']"
                            :value="dialogFlowData.workflow_data.nodes[currentNode.id].data['on_resume']"
                            ></codemirror>
                        </el-form>
                    </div> 
                </el-form>
            </div>
		</el-tab-pane>
</el-tabs>
  </el-main>
</template>

<script>
import Codemirror from "@/components/Codemirror.vue";
import _ from "lodash";

export default {
  name: "Wait",
  props: ["dialogFlowData", "currentNode"],
  components: {
    Codemirror
  },
  data() {
    return {
		showLog: false,
	};
  },
  methods: {
    init() {
      this.dialogFlowData.workflow_data.nodes[
        this.currentNode.id
      ] = this.currentNode;
      if (
        _.size(
          this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data
        ) <= 1
      ) {
        this.intializeDataProperties();
      }
    },
    intializeDataProperties() {
    this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
      "on_wait"
    ] = "((state_id)=>{\n\t/*write your code here*/\n\tdone()\n})(state_id)";
    this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data[
      "on_resume"
    ] = "((payload)=>{\n\t/*write your code here*/\n\tdone()\n})(payload)";;
  },
  },

  
  mounted() {},
  beforeMount() {
    this.init();
  },
  updated() {
    console.log("inside wait component updated");
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
//   height : 1000px;
//   overflow: auto;
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