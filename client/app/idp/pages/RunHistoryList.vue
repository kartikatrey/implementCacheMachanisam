<template>
  <el-main class="kp-main">
    <section class="testcase-page-body">
      <el-radio-group v-model="activeTab" @change="handleTestCaseTabChange">
        <el-radio label="runTestCase">Run History</el-radio>
        <el-radio label="fileUpload">Files</el-radio>
        <el-radio label="extractionTestCases">Extraction Test Cases</el-radio>
        <el-radio label="businessRuleTestCases">Business Rule Test Cases</el-radio>
      </el-radio-group>

      <!-- Tab for all test cases list  -->
      <div v-if="activeTab === 'runTestCase'" class="testcase-page-run-test-case">
        <AllTestCasesList></AllTestCasesList>
      </div>

      <!-- Content for File Upload tab -->
      <div v-if="activeTab === 'fileUpload'" class="testcase-page-file-upload">
        <div class="test-case-file-upload">
          <!-- select document type -->
          <el-dialog :visible.sync="selectDocumentDialog" title="Select Document Type">
            <p class="advance-search-title-filter">
              <el-button round text class="advance-search-back" size="small" @click="cancelUploadAction">
                <i class="mdi mdi-close"></i>
              </el-button>
            </p>

            <el-divider class="section-title custom-filter-title" content-position="left">Select Document Type</el-divider>
            <div class="select-document-type-wrapper">
              <el-select class="select-document-dropdown" v-model="selectedDocumentType.document_type"
                placeholder="Select document type" @change="onDocTypeChange" width="50%">
                <el-option v-for="(item, index) in documentTypes" :key="index" :label="item" :value="item"></el-option>
              </el-select>
               <el-select class="select-document-dropdown" v-model="channelForUpload" placeholder="Select Channel" @change="onInputChannelChange" width="50%">
                          <el-option v-for="(channel) in uploadChannelList" :key="channel.id" :label="channel.label" :value="channel.id"></el-option>
                </el-select>
            </div>

            <div class="select-document-type-wrapper-footer">
              <el-button size="small" @click="cancelUploadAction">Cancel</el-button>
              <el-button size="small" type="primary" @click="confirmDocumentType">Confirm</el-button>
            </div>
          </el-dialog>
          <!-- upload dialog render -->
          <upload
            v-if="displayUploadDialog"
            :parameters="fileUploadParameters"
            :data="dataParamsToUpload"
            :dialogShow.sync="displayUploadDialog"
            @closeDialog="closeUploadDialog"
          ></upload>
          <!-- upload button in datatable and show file_name, created_by, and created_at in datatable -->
          <data-table :parameters="fileUploadTableParams" ref="datatable"></data-table>
        </div>
      </div>

      <!-- Extraction & Business rule test case list view -->
      <div v-if="activeTab === 'extractionTestCases' || activeTab === 'businessRuleTestCases'" class="test-case-table">
        <TestCaseList :key="testCaseListState" :referenceType="activeReferenceType" ></TestCaseList>
      </div>

      <!-- Test case history by test case type -->
      <div v-if="activeTab !== 'runTestCase'" class="test-case-history-table">
        <DataTable :parameters="testHistoryTableParams"></DataTable>
      </div>
    </section>
  </el-main>
</template>
<script>
  import DataTable from "@/components/DataTable";
  import constants from "@/resources/Constants";
  import Upload from "@/components/Upload";
  import EventBus from "@/EventBus";
  import FileSaver from 'file-saver';
  import IdpListHeader from "./idpListHeader";
  import AllTestCasesList from "@/idp/components/AllTestCasesList";
  import TestCaseFilesService from '@/idp/services/TestCaseFilesService';
  import TestCaseList from '@/idp/components/TestCaseList.vue';
  import ScriptLogs from '@/idp/components/ScriptLogs.vue'
  import LogService from '@/idp/services/LogService.js';
  import DeCustomerConfig from '@/idp/services/DeCustomerConfig.js';
  import DocumentService from '@/idp/services/DocumentService.js';
  import TestCaseService from "@/idp/services/TestCaseService.js";
  import InputChannelService from "@/idp/services/InputChannel";

  import _ from 'lodash';
  export default {
    name: "UnitTestCases",
    components: {
      DataTable,
      Upload,
      IdpListHeader,
      AllTestCasesList,
      TestCaseList,
      ScriptLogs
    },
    data() {
      return {
        activeTab: 'fileUpload',
        testCaseListState:0,
        activeTab: 'runTestCase',
        testCaseHistoryTab: 'RunHistory',
        activeTestCaseTab : "",
        activeReferenceType: "",
        selectDocumentDialog: false,
        displayUploadDialog: false,
        testCaseLogs: [],
        currentRunId: "",
        fileUploadTableParams: {
          apiName: constants.UNIT_TEST_CASE_FILES_ENDPOINT,
          aggregation: true,
          tableName: "de_test_case_files",
          select: ["file_name", "document_type", "created_at", "created_by", "channel_name"],
          refreshEventName: 'testCaseFileEvent',
          tableHeaderConfigParams: {
          },
          isRestify: true,
          queryParam: {
            active: true
          },
          isRegxSearch:true,
          limit: 10,
          initialSort : "-created_at",
          addButtonConfig: true,
          addButtonConfig: {
            event: "show-upload-dialog",
            name: "File Upload"
          },
          actionItems:[
            {
              icon: "mdi mdi-arrow-down-thin-circle-outline",
              name: "Download",
              event_name: "DOWNLOAD_TEST_FILE",
            },
            {
              icon: "mdi mdi-play-circle-outline",
              name: "Run",
              event_name: "RUN_TEST_FILE",
              inline: true,
            }
          ]
        },
        testHistoryTableParams: {
          apiName: constants.TEST_CASE_HISTORY_ENDPOINT,
          tableName: "de_test_history",
          isRestify : true,
          pageTitle: "",
          tableHeaderConfigParams: {},
          isRegxSearch: true,
          limit: 10,
          hideAddButton: true,
          initialSort: "-created_at",
          refreshButton: true,
          customfilter: true,
          refreshEventName: 'testHistoryTableEvent',
          queryParam: {
          },
          select: [
            "name",
            "file_name",
            "created_at",
            "updated_at",
            "created_by",
            "status",
            "test_case_id",
            "run_id"
          ]
        },
        documentTypes: [],
        selectedDocumentType: {
          document_type: ''
        },
        fileUploadParameters: {
          endpoint: "/api/test-case-file",
          title:"Test Case Files",
          valid_file_types: [
            "application/pdf", 
            "image/png",
            "image/jpeg",
            "image/tiff",
            "image/bmp",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.ms-excel.sheet.macroEnabled.12",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/html"
          ],
        },
        uploadChannelList:[],
        channelForUpload : "",
        dataParamsToUpload : {channel_id : '', channel_name : '', document_type : ''}
      };
    },
    methods: {
      //get channels based on selected document type
      async onDocTypeChange(){
        const projection = ['upload_folder_path', '_id']
        this.channelForUpload = "";
        try {
         let inputChannels = await InputChannelService.getChannelsByDocType(this.selectedDocumentType.document_type, projection)
         this.uploadChannelList = inputChannels.map(channel => {
              return {
                  label: channel.upload_folder_path,
                  id: channel._id
              };
          });
          this.dataParamsToUpload = {channel_id: "", channel_name : "", document_type: this.selectedDocumentType.document_type}

        } catch (error) {
          console.log("Error while getting channels");
        }
      },
      //Update upload components' data after folder path selection.
      onInputChannelChange(){
        this.dataParamsToUpload.channel_id = this.channelForUpload;
        const selectedChannel = this.uploadChannelList.find(channel => channel.id === this.channelForUpload);
        this.dataParamsToUpload.channel_name = selectedChannel.label;

      },
      // Handle Tab Change
      handleTestCaseTabChange(val) {
        this.activeTab = val;
        if(val == "extractionTestCases"){
          this.activeTestCaseTab = "Extraction";
          this.activeReferenceType = "extraction";
          this.testHistoryTableParams.pageTitle = this.activeTestCaseTab + " Test Case History";
          this.testHistoryTableParams.queryParam["reference_type"] = "extraction";
        } else if(val == "fileUpload"){
          this.activeTestCaseTab = "All";
          this.testHistoryTableParams.queryParam = {};
          this.testHistoryTableParams.pageTitle = this.activeTestCaseTab + " Test Case History";
        } else if(val == "businessRuleTestCases"){
          this.activeTestCaseTab = "Business Rule";
          this.activeReferenceType = "business_rule";
          this.testHistoryTableParams.pageTitle = this.activeTestCaseTab + " Test Case History";
          this.testHistoryTableParams.queryParam["reference_type"] = "business_rule";
        }
        this.testCaseListState += 1;
        this.$nextTick(() => {
          EventBus.$emit("refreshTable__testHistoryTableEvent");
        })
      },
      async openUploadDialog(){
        this.selectDocumentDialog = true;
        this.documentTypes = await DeCustomerConfig.getDocumentTypes();
      },
      confirmDocumentType(){
       if(!this.selectedDocumentType.document_type){
        this.notifyError("Please select document type");
        return;
       }
        this.selectDocumentDialog = false;
        this.displayUploadDialog = true;
      },
      cancelUploadAction(){
        this.selectDocumentDialog = false;
        this.clearChannelAndDocTypeField();
      },
      closeUploadDialog(){
        this.clearChannelAndDocTypeField();
        this.displayUploadDialog = false;
        this.refreshTable();
      },
      clearChannelAndDocTypeField(){
        this.uploadChannelList = [];
        this.selectedDocumentType.document_type = '';
        this.channelForUpload = '';
      },
      refreshTable(){
        const tableName =  this.activeTab == 'fileUpload' ? this.fileUploadTableParams.refreshEventName : this.testHistoryTableParams.refreshEventName; 
        EventBus.$emit(`refreshTable__${tableName}`); 
      },
      registerEvents(){
        EventBus.$on("show-upload-dialog", () => this.openUploadDialog());
        EventBus.$on("DOWNLOAD_TEST_FILE", (document) => this.downloadFile(document));
        EventBus.$on("RUN_TEST_FILE", (document) => this.runTestCasesByFile(document));
        EventBus.$on("runIdChanged", (runId) => {
          this.handleRunIdChanged(runId);
        });
      },
      async handleRunIdChanged(newRunId) {
        this.currentRunId = newRunId;
        await this.handleScriptLogsRefresh();
      },
      async handleScriptLogsRefresh() {
        if (this.currentRunId) {
          this.testCaseLogs=[];
          const filter = {run_id: this.currentRunId}
          const res = await LogService.getLogs(constants.TEST_CASE_HISTORY_ENDPOINT, filter);
          if(res){
            res.forEach(testCase => {
              let logs = testCase.logs;
              logs = logs.map((data) => {
                return {
                  message: data.message? data.message: data,
                  type: data.type? data.type: "info"
                }
              });
              (logs.length) && (logs[0]['file_id'] = testCase.doc_id) ;
              this.testCaseLogs = this.testCaseLogs.concat(logs);
            })
          }
        }
      },
      async downloadFile(document){
        try{
          const fileId = _.get(document, 'row._id', '');
          const fileData = await TestCaseFilesService.getTestCaseFileDataById(fileId);
          if(!fileData._id){
            this.notifyError('Invalid file data received');
            return;
          }
          const binaryData = atob(fileData.file);
          var blob = new Blob([new Uint8Array([...binaryData].map(char => char.charCodeAt(0)))], {type: fileData.mime_type});
          FileSaver.saveAs(blob, fileData.file_name);
          return ;
        }catch(err){
          console.log('Error downloading file', err);
          return this.notifyError(`Something went wrong while downloading file`);
        }
      },
      async runTestCasesByFile(document){
        //Run test cases for current file
        const fileId = _.get(document, 'row._id', '');
        this.notifySuccess("Test cases are running for current file, Please wait for a moment.");
        try {
          const runType = "File all";
          const runTestCasesByFileResponse = await TestCaseService.runTestCasesByFile(fileId, runType);
          this.currentRunId = _.get(runTestCasesByFileResponse, "data.run_id")
          await this.handleScriptLogsRefresh();
          EventBus.$emit("refreshTable__testHistoryTableEvent");
        } catch (error) {
          this.notifyError("Error while running test case: " + error.message); 
        }
      }
    },
    async mounted(){
      this.registerEvents()
    },
    beforeDestroy() {
      EventBus.$off('DOWNLOAD_TEST_FILE');
      EventBus.$off('show-upload-dialog');
      EventBus.$off('RUN_TEST_FILE');
      EventBus.$off('runIdChanged');
    }
  };
</script>

<style lang="scss">
@import "../_idpGlobal";
@import "../_idpVariables";

.test-case-history-table {
  .el-tabs__nav {
    margin-top: 30px
  }
}

.test-case-file-upload{
  .select-document-dropdown{
    width: 50%;
  }
}

.testcase-page-body{
  gap: 18px;
  display: flex;
  flex-direction: column;

  .el-radio__input {
    display: none !important;
  }

  .test-case-history-table{
    .test-case-history-tabs.el-tabs.el-tabs--top{
      background: var(--white);
      z-index: 1;
      position: relative;
    }
  }
  label {
    vertical-align: middle;
    line-height: 2;
  }
  .is-checked {
    // width: 100px;
    height: 30px;
    border-top: 2px solid #5a67d8;
    background: var(--dark-07);
  }
  .el-radio {
    margin-right: 0;
  }
  .el-radio__label {
    padding: 0 1.5rem;
    font-size: var(--font-md);
    font-weight: 400 !important;
    color: var(--dark-04);
  }
  .el-radio__input.is-checked + .el-radio__label {
    color: var(--dark-01) !important;
  }
  .el-radio-group{
    position: absolute;
    // margin-top: 0.5rem;
  }
  .table-toolbar{
    margin-bottom: 0.583rem;
  }

  .el-divider__text {
    margin-bottom: 1.5rem;
    font-weight: 600;
  }

  .el-dialog{
    padding: 2.8rem 2.8rem 1.5rem 2.8rem;

    .el-dialog__footer{
      padding-bottom: 0px;
      padding-right: 0px;
    }

    .select-document-type-wrapper{
      display: flex;
      align-items: center;
      justify-content: space-between;
      // margin-bottom: 1.5rem;
      margin-top: 3rem;
      gap: 1rem;
    }

    .select-document-type-wrapper-footer{
      display: flex;
      justify-content: flex-end;
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--dark-06);
    }
  }
}
</style>