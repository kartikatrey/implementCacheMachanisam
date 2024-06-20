<template>
    <el-main class="kp-debug-view">
      <h1 class="kp-page-title">{{ pageTitle }}</h1>
      <div class="kp-json-wrap" v-loading="loading">
        <el-button
          class="btn-copy"
          type="primary"
          @click="copyCodeToClipBoard"
          icon="mdi mdi-content-copy"
        >
          Copy to clipboard
        </el-button>
        <vue-json-pretty
            :data="debugData"
            :showLength="true"
            :showLineNumber="true"
            :showKeyValueSpace="true"
            :collapsedOnClickBrackets="true"
            :deep="4"
            :setPathCollapsible="true"
        ></vue-json-pretty>
      </div>
    </el-main>
  </template>
  

  <style lang="scss">
  @import "../../assets/scss/_variables";
  
  .kp-debug-view {
    margin-top: 20px;
  }
  
  .kp-json-wrap {
    position: relative;
    overflow: auto;
    margin-top: 20px;
    height: 76vh;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 10px;
  }
  
  .kp-json-wrap::-webkit-scrollbar {
    width: 12px;
  }
  
  .kp-json-wrap::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px #d0d0d0;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .kp-json-wrap::-webkit-scrollbar-track {
    border-radius: 10px;
  }
  
  .kp-json-wrap::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .kp-json-wrap pre {
    font-size: 14px;
    line-height: 1.5;
    color: #333;
  }
  
  .vue-json-pretty .string { 
    color: #22863a; 
  }
  
  .vue-json-pretty .name { 
    color: #005cc5; 
  }
  
  .vue-json-pretty .number { 
    color: #6f42c1; 
  }
  </style>


<script>
import _ from "lodash";
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css';
import DocumentService from "@/doc-ex/services/DocumentService";

export default {
    name: "DocumentDebugView",
    components: {
        VueJsonPretty
    },
    data() {
        return {
            pageTitle: "Document Debug View",
            debugData: '',
            loading: false,
        }
    },
    methods: {
        async getDebugDocumentResponse() {
            try {
                const docId = this.$route.query.doc_id;
                const queryParam = { doc_id: docId };
                const debugDataResponse = await DocumentService.findDebugData(queryParam);
                this.debugData = _.get(debugDataResponse, "[0].prediction", {});
            } catch (err) {
                console.log(err);
                this.notifyError("Error while fetching debug data - ", err);
            } finally {
                this.loading = false;
            }
        },
        copyCodeToClipBoard() {
            const textArea = document.createElement("textarea");
            textArea.textContent = JSON.stringify(this.debugData, null, 4);
            document.body.append(textArea);
            textArea.select();
            document.execCommand("copy");
            textArea.remove();
            this.notifySuccess("Copied to clipboard");
        }
    },
    beforeMount() {
        this.loading = true;
        this.getDebugDocumentResponse();
    }
};
</script>