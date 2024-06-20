<template>
  <el-main class= "editor-el-main" >

    <div class="editor-container card-shadow--medium card-base">
      <div class="fc-toolbar fc-header-toolbar ">
        <div class="fc-right">
          <el-tooltip
            content="Workflow Properties"
            placement="top"
          >
            <el-button
              class="btn-home"
              v-on:click="displayWorkFlowProperites"
            ><i class="mdi mdi-home"></i></el-button>
          </el-tooltip>


        </div>
        <div class="fc-left title">{{dialogFlowData.name}}</div>

        <div class="fc-clear"></div>
      </div>
      <splitpanes
        class="default-theme"
        watch-slots
        style="height: 100%"
      >
        <div
          :splitpanes-size="paneSize"
          style="display: unset"
        >
          <!-- <div style="display: inline">
            <div class="control-btn-wrap">
              <el-button
                circle
                class="btn-minus"
                @click="zoomOut"
              ><i class="mdi mdi-minus"></i></el-button>
              <el-button
                class="btn-plus"
                @click="zoomIn"
                circle
                style="margin-left: 0px;"
              ><i class="mdi mdi-plus"></i></el-button>
            </div>
          </div> -->

          <canvas-container
            v-if="!showElements"
            v-bind:dialogFlowData="dialogFlowData"
            class="rete-container"
          ></canvas-container>

        </div>
        <div :splitpanes-size="100 - paneSize">
          <div class="property-wrapper">
            <properties
              v-if="!showElements"
              v-bind:dialogFlowData="dialogFlowData"
            ></properties>
          </div>
        </div>
      </splitpanes>

    </div>

  </el-main>
</template>


<script>
import CanvasContainer from "@/dialogflow/components/Canvas";
import Properties from "@/dialogflow/components/Properties";
import TableAPIService from "@/services/TableAPIService";
import splitpanes from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import EventBus from "@/EventBus";
import WorkflowLogService from "@/dialogflow/services/WorkflowLogService";
import jsonData from "../data.json"; //workflowJSON
let tableAPI = new TableAPIService();
const uuidv4 = require('uuid/v4');

import JQuery from "jquery";
let $ = JQuery;

export default {
  data() {
    return {
      paneSize: 60,
      showElements:true,
      nodeData:"",
      dialogFlowData:{},
      zoom:1,
    };
  },
  components: {
    splitpanes,
    CanvasContainer,
    Properties
  },
  methods: {
    checkEmpty() {
      this.showElements = _.isEmpty(this.dialogFlowData) ? true : false;
    },
    async init(jsonData) {
      let dialogFlowId = this.getIdFromUrl();
      this.originalDialogFlowData = {};
      if (dialogFlowId) {
        this.dialogFlowData = await WorkflowLogService.fetchById(dialogFlowId).catch(error => {
          this.notifyError("Error while fetching workflow data");
        });

        this.originalDialogFlowData = _.cloneDeep(this.dialogFlowData);
        this.isClone = _.isObject(this.dialogFlowData) ? true : false;
      } else {
        await Object.assign(this.dialogFlowData, jsonData);
      }
      this.dialogFlowData.name = this.dialogFlowData.name ? this.dialogFlowData.name  : this.workFlowName;
              //  this.dialogFlowData= Object.assign( this.dialogFlowData, {name})

      this.$forceUpdate();
    },

    //To display WorkFlowProperties On button click
    displayWorkFlowProperites(){
      EventBus.$emit("DISPLAY_PROPERTY_WINDOW",{name:"Properties"});
    },

    //To get DialogFlowId from routes
    getIdFromUrl() {
      return this.$route.query.id || "";
    },


    zoomIn() {
      let parent = document.getElementById("rete");
      let child = parent.childNodes[0];
      this.zoom = this.zoom + 0.2;
      child.style.transform = "scale(" + this.zoom + ")";
    },
    zoomOut() {
      var parent = document.getElementById("rete");
      var child = parent.childNodes[0];
      this.zoom = this.zoom - 0.2;
      child.style.transform = "scale(" + this.zoom + ")";
    },


  },
  mounted() {
	console.log("editor page mounted");
  },

  beforeMount() {
    this.init(jsonData);
  },
  updated() {
	console.log("editor page Updated");
    this.checkEmpty();
  }
};
</script>
<style lang="scss">
@import "../../assets/scss/_variables";
.begin {
	background: #ffffff !important;
}
.classification {
	background: #ffffff !important;
}
.knowledge-base{
	background: #ffffff !important;
}
.end-with-message{
	background: #ffffff !important;
}
.run-script {
	background: #ffffff !important;
}
.workflow{
	background: #ffffff !important;
}
.entity{
	background: #ffffff !important;
}
.condition{
	background: #ffffff !important;
}
.service-call{
	background: #ffffff !important;
}
.approval{
	background: #ffffff !important;
}
.bot-utterence{
	background: #ffffff !important;
}

.editor-el-main{
  width : 1030px;
}
.editor-container {
  .context-menu {
    overflow: hidden;
    border-radius: 5px;
    padding: 0 !important;
    width: 145px !important;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.2);
    .search {
      display: none;
    }
    .item[data-v-99007bda],
    .item .subitems .subitem[data-v-99007bda] {
      color: #fff;
      border-bottom: none;
      background-color: rgba(3, 168, 224, 0.9);

      cursor: pointer;
      width: 100%;
      position: relative;
      font-size: $font-size-14;
      padding: 4px 10px;
    }
  }
  .btn-home {
    padding: 7px 10px !important;
    margin: 0px 0 0 0;
    vertical-align: bottom;
    i {
      color: #5f8fdf;
      font-size: 1.19rem !important;
    }
  }

  .control-btn-wrap {
    display: inline-block;
    right: 0;
    margin: 10px;
    float: right;
    position: relative;
    z-index: 9999;
    .btn-plus,
    .btn-minus {
      i {
        font-size: 1.1rem;
      }
    }
  }

  .splitpanes--vertical {
    // .splitpanes__pane:first-child {
    //   background: #aaa url(../../assets/images/workflow-bg.png) !important;
    //   height: 900px;
    //   overflow-y: hidden !important;
    // }
    .splitpanes__pane {
      background: #fff !important;
      overflow-y: auto;
    }
    .splitpanes__splitter {
      background: rgba(0, 0, 0, 0.1);
      // background: rgba(255, 255, 255, 0.5);
      border: 0;
      &:before,
      &:after {
        background: #8a8a8a !important;

        height: 70px !important;
        border-radius: 10px;
        width: 2px;
      }
    }
  }
  .default-theme.splitpanes--vertical > .splitpanes__splitter:after,
  .default-theme .splitpanes--vertical > .splitpanes__splitter:after,
  .default-theme.splitpanes--vertical > .splitpanes__splitter:before,
  .default-theme .splitpanes--vertical > .splitpanes__splitter:before {
    background: #fff;
  }

  .fc-toolbar.fc-header-toolbar {
    background: #ffffff;
    padding: 15px;
    margin-bottom: 0;
    border-bottom: 1px solid #f0f0f0;
    .title {
      font-weight: bold;
      padding-top: 10px;
      font-size: 18px;
      font-family: sans-serif;
      color: #005da6;
    }
  }

  .el-input,
  .el-radio__label,
  .el-form-item__label,
  .el-select-dropdown__item,
  .el-button {
    font-size: $font-size-12;
  }
  .el-form-item {
    margin-bottom: 0px;
  }
  .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
} //editor container

.property-wrapper {
  border-radius: 5px;
  width: 100%;
}
.el-tabs__item {
  padding: 0 10px;
}
.splitpanes.default-theme .splitpanes__pane {
  background: $color-white;
}
</style>



