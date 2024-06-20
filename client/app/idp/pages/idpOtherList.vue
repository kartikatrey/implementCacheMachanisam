<template>
  <el-main class="kp-main">
    <section class="page-body">
      <div class="table-wrap"   v-loading="loading">
        <DataTable :parameters="requiredParams"></DataTable>
      </div>
      <el-dialog
        width="21%"
        class="confirmation-box"
        title="Confirmation"
        :before-close="handleCloseDialog"
        :visible.sync="showModal"
      >
        <el-form
          :model="form"
          :rules="rules"
          ref="form"
          label-width="178px"
          class="demo-form"
          label-position="top"
        >

        <el-row :gutter="20">
          <el-col :span="24">
             <div class="kp-form-group">
              <el-form-item label="Document type" prop="document_type">
                <el-select
                  class="config-value"
                  v-model="form.document_type"
                  placeholder="Select document type"
                >
                  <el-option
                    v-for="(item) in document_type_list"
                    v-bind:value="item.value"
                    :key="item.value"
                    :label="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
              </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
             <div class="">
            <el-form-item>
              <el-button
              
                element-loading-spinner="el-icon-loading"
                size="small"
                :disabled="!form.document_type"
                type="primary"
                @click="startProcessingMoveDocument('form')"
                >Confirm</el-button
              >
              <el-button size="small" @click="handleCloseDialog">Close</el-button>
            </el-form-item>
            </div>
          </el-col>
        </el-row>

        </el-form>
      </el-dialog>
    </section>
        <!-- CLassification dialog -->
    <el-dialog 
      custom-class="classification-model"  top="3vh"   :close-on-click-modal="false" center
      width="97%"  title="Classify document" :show-close="true" :destroy-on-close="true" :visible.sync="showClassificationModal">
        <DocTypeConfirmation :documentId="selectedDocumentId" @toggleClassificationDialog="toggleClassificationDialog" @successCB="onPageTypeSelectionSuccess" ></DocTypeConfirmation>
    </el-dialog>
  </el-main>
</template>

<script>
import DataTable from "../../components/DataTable.vue";
import EventBus from "@/EventBus";
import _ from "lodash";
import { Loading } from "element-ui";
import moment from "moment";
import Constants from "@/resources/Constants";
import DocumentService from "@/idp/services/DocumentService";
import CustomerConfig from "@/idp/services/DeCustomerConfig";
import DocTypeConfirmation from "../components/DocTypeConfirmation.vue";

export default {
  name: "idpOtherList",
  components: {
    DataTable,
    Loading,
    DocTypeConfirmation
  },
  data() {
    return {
      selectedDocumentId:'',
      showClassificationModal:false,
      requiredParams: {
        apiName: "/portal/api/table/de_document", //add your API url here
        queryParam: {
          document_type:  { '$in': Constants.DOCEX.OTHER_DOC_TYPES }
        },
        showPaginationOptions: true, // to show/hide pagination option
        tableName: "other_document_list", // it is use to get headers of table from tableHeaderConfig.js
        enableExport: true,
        isRestify: true,
        initialSort: "-created_at",
        isRegxSearch: true,
        limit: 10,
        actionItems: [
          {
            icon: "mdi mdi-file-move-outline",
            name: "Move",
            event_name: "move_document",
            inline: true,
            hideCondition: (propData) =>
                { return propData.row.stage === Constants.DOCEX.STAGE.DELETED || propData.row.action == Constants.DOCEX.ACTIONS.REVIEWED}
          },
          {
              icon: "el-icon-check",
              name: "Mark as Reviewed",
              event_name: "mark_as_reviewed",
              hideCondition: (propData) =>
              //If the document is already "Reviewed" or the document is being deleted already then hide the button
              { return propData.row.action == Constants.DOCEX.ACTIONS.REVIEWED || propData.row.stage === Constants.DOCEX.STAGE.DELETED }
          },
        ],
      },
      pageTitle: "Other Documents",
      document_type_list: [],
      showModal: false,
      form: { document_type: "" },
      rules: {
        document_type: [
          {
            required: true,
            message: "Please select document type",
            trigger: "change",
          },
        ],
      },
      document: {},
      loading: false,
    };
  },
  methods: {        
    toggleClassificationDialog(){
            this.showClassificationModal = !this.showClassificationModal;
    },
    async showDocumentMoveDialog(document) {
      this.showModal = true
      this.document =document.row;
    },
    handleCloseDialog() {
      this.showModal = false;
      this.resetDialog()
    },
     resetDialog() {
      this.$refs["form"] && this.$refs["form"].resetFields();
      this.form = {};
    }, 
    async getDocumentType(){
      const docTypeConfig = await CustomerConfig.getAllDocsCustConfiguration({document_type:{$exists:true}});
      this.document_type_list = CustomerConfig.getDocumentTypeList(docTypeConfig);
    },
    async openDocument(document) {
      let params = {
        file_name: document.original_file_name,
        document_type: document.document_type,
        storage_folder_path: document.storage_folder_path,
        parent_document_id : document._id,
        file_type: _.get(document, "file_type"), 
        original_file_name: _.get(document, "file_name") 
      };
      await DocumentService.downloadDocument(params)
    },
    async onPageTypeSelectionSuccess(data){
        this.moveDocument();    
    },
    async startProcessingMoveDocument(formName) {
       this.showModal = false;
      //   let showPageTypeSelection = await this.$confirm('Do you want to track these changes for further training?', 'Warning', {
      //           confirmButtonText: 'OK',
      //           cancelButtonText: 'Cancel',
      //           type: 'warning'
      //           }).catch(()=>false);
      // if(showPageTypeSelection){
      //     this.selectedDocumentId = this.document._id;
      //     this.showClassificationModal = true;
      //     return;
      // }
      if(this.$refs.form){
        let formData = await this.$refs.form.validate().catch((e)=>e);
        this.moveDocument();
      }
    },
    async markDocumentAsReviewed(document){
      try{
        let payload = { action: Constants.DOCEX.ACTIONS.REVIEWED };
        const document_id = document.row._id
        const action = Constants.DOCEX.TRIGGER_ACTION.MARK_AS_REVIEWED
        const response = await DocumentService.processAction({payload, document_id, action});
        if (_.get(response, "data.status")) {
          EventBus.$emit("refreshTable");
          this.notifySuccess('Record "Marked as Reviewed".')
          return;
        }
        this.notifyError(_.get(response, "data.message") || "Error while marking as Reviewed.");
      }
      catch(error){
        console.error(error);
        this.notifyError("Error while marking as Reviewed.");
      }
    },
    async moveDocument(){
      let params = {
        storage_folder_path: this.document.storage_folder_path,
          document_id: this.document._id,
          document_type: this.form.document_type,
          file_name: this.document.original_file_name,
          input_channel_id: this.document.input_channel_id,
          file_type: this.document.file_type,
          uploaded_file_path : this.document.uploaded_file_path,

      };
        try {
        this.loading = true;
          let response = await DocumentService.move(params);
          EventBus.$emit("refreshTable");
          this.showModal = false;
          this.form.document_type = "";
        } catch (error) {
           this.notifyError(
            `looks like document type ${this.form.document_type} is not configured.`
          );
        } finally{
          this.loading = false;
        }
    },
    findFilter() {
      try {
          this.filter = JSON.parse(
          (this.$route && this.$route.query && this.$route.query.filter) || "{}"
          );
      } catch (err) {
          this.filter = {};
      }
      return this.filter;
    },
  },
  beforeMount() {

    this.findFilter();
    const dateFilter = {};
    const dateFormat = "YYYY-MM-DDTHH:mm:ss";
    if (this.filter["dateFilter"]) {
        for (const [key, range] of Object.entries(
                this.filter["dateFilter"] || {}
            )) {
            dateFilter[key] = {
                $gte: moment(range["$gte"]).format(dateFormat),
                $lte: moment(range["$lte"]).format(dateFormat),
            };
        }
    }

		//document_type overwritten in filter.secondary, so queryParam document_type should be considered
    if(_.get(this.filter,"secondary.document_type")){
      delete this.filter.secondary.document_type
    }

    this.requiredParams.queryParam = {
    ...(this.requiredParams.queryParam || {}),
    ...(this.filter.secondary || {}),
    ...(dateFilter || {}),
    };
    this.getDocumentType();
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",false);
    EventBus.$on("openDocumentInTab", (document) => {
      this.openDocument(document);
    });
    EventBus.$on("move_document", (document) => {
      //here we check, user having rights to take action on move document.(base on roles)
      if (!this.canEditIdpData()) return
      this.showDocumentMoveDialog(document);
    });
    EventBus.$on("mark_as_reviewed", async (document) => {
      try {
        const confirmResult = await this.$confirm(`Are you sure you want to "Mark as Reviewed"?`, "Confirmation", {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "warning",
        });

        if (confirmResult) {
          await this.markDocumentAsReviewed(document);
        }
      } catch (error) {
        console.log(error);
      }
    });

   
  },
  beforeDestroy() {
    EventBus.$off(["openDocumentInTab", "move_document", "mark_as_reviewed"]);
  },
};
</script>
<style lang="scss">
@import "../_idpGlobal.scss";
@import "../_idpVariables.scss";

.classification-model {
  padding: 0;
  height:94%;
  .el-dialog {
    padding: 0;
  }
  .el-dialog__header {
    display: block;
    padding: 1rem 2eem;
    .el-dialog__title {
      font-size: 1.286rem;
      margin: 0;
      color: rgba(45, 55, 72, 1);
      display: inline-block;
      font-weight: normal;
      margin-right: 1rem;
    }
    .el-dialog__headerbtn {
      top: 14px;
    }
  }
  .el-dialog__body {
    padding: 0 !important;
    height:92%;
    .document-type-confirmation{
      
    .inner-body {
          height:91%;   
      }
    }
  }
  #add-user-footer {
    padding: 1.2rem 1.8rem !important;
    border-top: 0.5px solid #e4e7ed;
    text-align: right;
    .dialog-footer {
      display: flex;
      justify-content: flex-end;

      div:first-child {
        margin-left: 0;
        margin-right: auto;
      }
      .file-uploads {
        background: rgba(90, 103, 216, 1);
        color: #ffffff;
        padding: 3px 13px;
        border: 1px solid #5f8fdf;
        margin-left: 0;
        margin-right: auto;
        display: inline-block;
        margin-right: 10px;
        border-radius: 3px;
        label {
          cursor: pointer;
        }
      }
      #upload-file {
        font-family: "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Fira Sans",
          "Droid Sans", "Helvetica Neue", sans-serif;
        white-space: unset;
        display: flex;
        padding: 5px 13px;
        font-size: 1rem;
        background: rgba(90, 103, 216, 1);
      }
    }
  } // footer
}

.confirmation-box .el-form-item {
    margin-bottom: 0;
      .el-form-item__label {
        font-size: var(--font-base);
        line-height: 28px;
      }
      .el-input {
        height: 28px;
      }
}
</style>
