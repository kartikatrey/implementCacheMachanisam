<template>
  <div class="idp-page">
    <div class="idp-page-body">
      <idp-admin-toolbar v-if="isLoggedInAsKanAdmin()" :documentType="selectedDocType"></idp-admin-toolbar>
      <idp-toolbar  :documentType="selectedDocType" v-else> </idp-toolbar>
      <idp-navbar v-if="enableIdpNavbar && menuList && menuList.length" :menus="menuList" />
      <IdpTree v-if="enableIdpTree" :document_type="selectedDocType" />
      <router-view :key="$route.fullPath" class="view box grow" />
      <publish-dialog
        @hide="handlePublishDialogClose"
        :publishDialogVisible="publishDialogVisible"
        :documentId="retryPublishData.document_id"
        :documentType="retryPublishData.document_type"
      ></publish-dialog>
      <DocumentAssign
      v-if="showAssignmentModel"
        title="Assignment"
        @closeAssignmentDialogue="handleCloseAssignmentDialog"
        :documentType="selectedDocType"
        :showAssignmentModel="showAssignmentModel"
        :assignModalProps="assignModalProps"
      ></DocumentAssign>
    </div>
  </div>
</template>

<script>
import IdpToolbar from "@/idp/toolbar/idpToolbar.vue";
import IdpAdminToolbar from "@/idp/toolbar/idpAdminToolbar.vue";
import IdpNavbar from "@/idp/navbar/idpNavbar.vue";
import IdpTree from "@/idp/components/IdpTree.vue";
import EventBus from "@/EventBus";
import DocumentService from "@/doc-ex/services/DocumentService";
import PublishDialog from "@/idp/components/PublishDialog.vue";
import DocumentAssign from "@/idp/components/DocumentAssign.vue";
import Constants from "@/resources/Constants";
import MenuService from "@/services/MenuService";
import {getQueryFilter} from "@/util/CommonUtil";
import _ from "lodash";
import IdpSheetService from "@/idp/services/excel/IdpSheetService";
import CustomerConfig from "@/idp/services/DeCustomerConfig";
import WorkflowService from "@/idp/services/WorkflowService";
import {mapState} from 'vuex';

const idpComponent = {
  name: "Idp",
  data() {
    return {
      showAssignmentModel: false,
      assignModalProps: {},
      isReadOnly:false,

      menuList: [],
      publishDialogVisible: false,
      retryPublishData: {},
    };
  },

  computed: {

     ...mapState({
            selectedDocType: "documentType",
            enableIdpTree:"displayIdpTree",
            enableIdpNavbar:"displayIdpNavbar"
        })
         },


  methods: {
    handleCloseAssignmentDialog(isTableRefreshRequired){
        this.showAssignmentModel = false;
        if(!isTableRefreshRequired) return;
    },
    applyTreeFilter(filter) {
      let url = window && window.location && "" + window.location.pathname;
      let splitted = url.split("/app");
      url = splitted.length > 1 ? splitted[1] : url;
      if(filter.selectedPage) {
        filter.selectedPage = 1 // Reset pagination to 1 if user select the folder from tree
      }
      this.$router.push({path: url, query: {filter: JSON.stringify(filter || {})}});
    },
    handlePublishDialogClose() {
      this.publishDialogVisible = false;
    },
    getChildMenus(menus) {
      let path =  this.$route.path == '/' ? location.pathname.replace('/app',''):this.$route.path;
      this.menuList = MenuService.getChildMenusByUrl(menus,path);
    },

    async showWfExecutionHistory(document) {
      const wfInstanceId = document && document.workflow_instance_id;
      const {document_type = "", stage = "", state = ""} = document;
      // If the document_type, stage and state is present in the document means, the event is triggered from the document list view.
      // In this case, we are setting the selected route configuration in store
      if(document && document_type && stage && state){
        const filter = this.$route && this.$route.query && this.$route.query.filter
        const selectedDocTypeAndStageConfig = JSON.parse(filter)
        selectedDocTypeAndStageConfig.document_type = document_type;
        this.$store.commit("setDocumentConfig", selectedDocTypeAndStageConfig || {});
      }
      await this.$store.dispatch("workflowStore/commitWfHistory", wfInstanceId);
      this.$router.push({
          path: "/idp/workflow-execution-history",
          query: {
              id: wfInstanceId
          },
      })
    },

    async showWorkflowExecution(document) {
      const wfInstanceId = document && document.workflow_instance_id;
      const params = { document_id: document._id, workflow_instance_id: wfInstanceId };
      const wfExecutionData = await WorkflowService.getWorkflowExecutionData(params);
      if (!wfExecutionData.data.status){
        this.notifyError("Workflow execution data not found");
        return;
      }
      const executionData = wfExecutionData && wfExecutionData.data.data;
      const storeData = {
        showWfExecution: true,
        documentId: document._id,
        wfExecutionData: executionData || {}
      }
      this.$store.commit("setWfExecutionData", storeData);
    },

    registerEvents() {
      EventBus.$on("IDP_APPROVAL_DOCUMENT", (document) => {
        this.$store.commit("setDisplayApprovalHistory", {
            showApprovalHistory: true,
            documentId: document._id
        });
      });

      EventBus.$on("SHOW_WORKFLOW_EXECUTION_PROGRESS", (document) => {
        this.showWfExecutionHistory(document)
      });

      EventBus.$on("DISPLAY_IDP_NAVBAR", (menus, route, defaultRoute) => {
        const user = this.$store.getters.user;
        this.menuList = menus;
        this.enableIdpNavbar = true;
        this.enableIdpTree = false;
        this.$store.commit("setDisplayIdpTree",false);
        this.$store.commit("setDisplayIdpNavbar",true);
        let navigationRoute = route || defaultRoute;
        if(user.customer_id === Constants.DOCEX.TRY_IT.CUSTOMER_ID){
          navigationRoute = "/idp/limited-access-configurations"
        }
        this.$router.push(navigationRoute);
      });

      EventBus.$on("GET_MENUS", (menus) => {
        this.getChildMenus(menus);
      });

      EventBus.$on("SET_DISPLAY_IDP_TREE", (status) => {
        this.enableIdpTree = status || false;
      });



      EventBus.$on("IDP_APPLY_TREE_FILTER", (filter) => {
        this.applyTreeFilter(filter || {});
      });

      EventBus.$on("IDP_OPEN_DOCUMENT", (row) => {
        let filter = getQueryFilter();
        this.$store.commit("setDisplayIdpTree",false);
        let query = {
            view:row.type,
            id: "" + row._id,
            filter: JSON.stringify(filter || {}),
        };
        // If view is package the add id to parent document id and default is is clicked package id
        if(query.view=='package' && row.parent_document_id){
          query.id = row.parent_document_id;
          query.defaultId = row._id;
        }
        let docPath = `/idp/document-view`
        if(row.file_type == Constants.DOCEX.DOCUMENT_FILETYPES.EXCEL){
          docPath = `/idp/excel-view`
          if(row.parent_document_id){
            query.id = row.parent_document_id;
          }
        }
        this.$router.push({path: docPath,query});
      });
      /**
       * Event listener for handling document download requests.
       * 
       * Purpose:
       * This event listener handles various types of document download requests:
       * - Single document download
       * - Multiple document download as a zip
       * - Directly opening a published document link in a new browser tab
       * 
       * Steps:
       * 1. Determine the selected document(s) based on the structure of downloadParams:
       *    - In case of multiple doc download, downloadParams should be an object with query and an array of rows
       *    - In case of single download, downloadParams should be a single row representing the selectedDocument
       * 2. Check if the selected document is in a published stage and its data is deleted:
       *    - If yes, check if the document link is available and open it in a new browser tab
       * 3. Check if the selected document is an array, indicating multiple documents to be downloaded as a zip:
       *    - Extract document IDs from the selected documents
       *    - Trigger the bulk download of documents using DocumentService.downloadBulkDocuments
       * 4. If the selected document is not an array, it is a single file to be downloaded directly:
       *    - Prepare parameters for the single document download
       *    - Trigger the download of the single document using either DocumentService.downloadDocument or IdpSheetService.downloadExcelDocument
       * 
       * @param {Object} downloadParams - The parameters for the document download request.
       */
      EventBus.$on("IDP_DOWNLOAD_DOCUMENT", async (downloadParams) => {
        const selectedDocument = downloadParams.rows || downloadParams;
        // Check if the selected document is in a published stage and its data is deleted
        if (selectedDocument.stage === Constants.DOCEX.STAGE.PUBLISHED && selectedDocument.is_data_deleted) {
          // Check if the document link is available and open it in a new browser tab
          if (!selectedDocument.document_link) {
            return this.notifyError("Link not available.");
          }
          window.open(selectedDocument.document_link, "_blank");
        }
        // Check if the selected document is an array, indicating multiple documents to be downloaded as a zip
        if (_.isArray(selectedDocument)) {
          // Extract document IDs from the selected documents
          const documentIds = selectedDocument.map((doc) => doc._id);
          let params = {
            document_ids: documentIds,
            action: "bulk_download",
            requester : "browser"
          };
          // If no document IDs are found, it indicates a download of all documents based on the download filter
          if(!documentIds.length && downloadParams.query){
            params["filter"] = downloadParams.query
          }
          try {
            if(!documentIds.length && downloadParams.totalRowCount >= Constants.DOCEX.DOCUMENT_EMAIL_DOWNLOAD_LIMIT){
              return this.$notify({
                title: "Warning",
                message: "Download limit: 2000 docs. Apply more filters.",
                type: "warning",
              });
            }
            // Trigger the bulk download of documents
            const downloadResponse = await DocumentService.downloadBulkDocuments(params);
            if(_.get(downloadResponse, "status", false)){
              this.notifySuccess("Your export is being prepared. You will be notified by email.");
            }
            EventBus.$emit("REFRESH_TABLE");
          } catch (error) {
            console.error(error);
            this.notifyError("Error while exporting the data");
          }
        } 
        else {
          // If the selected document is not an array, it is a single file to be downloaded directly
          if (!selectedDocument.is_data_deleted) {
            let params = {
              file_name: selectedDocument.original_file_name,
              document_type: selectedDocument.document_type,
              storage_folder_path: selectedDocument.storage_folder_path,
              parent_document_id: selectedDocument._id,
              file_type: _.get(selectedDocument, "file_type"), //Added for downloading html file
              original_file_name: _.get(selectedDocument, "file_name") //Added for downloading html file
            };
            try {
              selectedDocument.file_type != Constants.DOCEX.DOCUMENT_FILETYPES.EXCEL ? await DocumentService.downloadDocument(params) : IdpSheetService.downloadExcelDocument(params)
            } catch (e) {
              console.error(e);
            }
          }
        }
      });
      EventBus.$on("IDP_RETRY", async (row) => {
        if(this.isReadOnly)return;
          this.retryExraction(row)
      });

      EventBus.$on("IDP_DOCUMENT_MARK_PUBLISHED", async (data) => {
         this.$confirm(`Are you sure you want to mark as published?`, "Confirmation", {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "warning",
        })
          .then(async() => {
            try {
              let updatePayload = {
                state: Constants.DOCEX.STATE_PUBLISHED.SUCCESS,
                publish_failure_reason: "",
                stage: Constants.DOCEX.STAGE.PUBLISHED
              };
              const response = await DocumentService.processAction({payload: updatePayload, filter: { _id: data._id }, document_id : data._id, action: Constants.DOCEX.TRIGGER_ACTION.PUBLISH});
              if (_.get(response, "data.status")) {
                    EventBus.$emit("REFRESH_TABLE");
                    this.notifySuccess("Record marked as published.")
                    return;
              }
               this.notifyError(_.get(response, "data.message")||"Error while marking as published.");
            }
            catch(error){
              console.error(error);
              this.notifyError("Error while marking as published.");
            }
          })
      });
      
      EventBus.$on("IDP_DOCUMENT_MARK_REVIEWED", async (data) => {
        try {
          const confirmResult = await this.$confirm(`Are you sure you want to "Mark as Reviewed"?`, "Confirmation", {
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            type: "warning",
          });

          if (confirmResult) {
            let updatePayload = { action: Constants.DOCEX.ACTIONS.REVIEWED };
            const document_id = data._id
            const action = Constants.DOCEX.TRIGGER_ACTION.MARK_AS_REVIEWED;
            const response = await DocumentService.processAction({ payload: updatePayload, document_id, action });
            if (_.get(response, "data.status")) {
              EventBus.$emit("REFRESH_TABLE");
              this.notifySuccess('Record "Marked as Reviewed".');
              return;
            }
            this.notifyError(_.get(response, "data.message") || "Error while marking as Reviewed.");
          }
        } catch (error) {
          console.log(error);
        }
      });


      EventBus.$on("IDP_DELETE_DOCUMENT", async (selectedDocument) => {
        try {
            const confirm = await this.$confirm(`Are you sure you want to delete?`, "Confirmation", {
              confirmButtonText: "Confirm",
              cancelButtonText: "Cancel",
              type: "warning",
            }).catch((error) => {
              console.error(error);
            });;

            if(!confirm){
              return;
            }

            if (_.isArray(selectedDocument)) {
              const documentIds = selectedDocument.map((doc) => doc._id);
              const params = {
                document_ids: documentIds,
                action: "bulk_delete",
              };
              const response = await DocumentService.updateRecords(params);

              if (response.data && _.get(response, "data.status") !== true) {
                return this.notifyError("Error while deleting record(s)");
              }
              EventBus.$emit("REFRESH_TABLE");
              return this.notifySuccess("Record(s) deleted");
            } else {
              const params = {
                document_id: selectedDocument._id,
                action: "delete",
              };
              const response = await DocumentService.removeDocument(params);

              if (response.data && _.get(response, "data.status") !== true) {
                return this.notifyError(_.get(response, "data.data.message") || "Error while deleting record");
              }
              EventBus.$emit("REFRESH_TABLE");
              return this.notifySuccess("Record deleted");
            }
          } catch (error) {
            console.error(error);
            this.notifyError("Error while deleting record(s)!");
          }
      });

      EventBus.$on("IDP_ASSIGN_DOCUMENTS", async (data) => {
          this.showAssignmentModel = true,
          this.assignModalProps = data
      });

      EventBus.$on("IDP_DOCUMENT_RESTORE", async (data) => {
         this.$confirm(`Are you sure you want to restore record?`, "Confirmation", {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "warning",
        })
          .then(async() => {
            try {
              let updatePayload = {
                state: Constants.DOCEX.STATE_UPLOADED.SUCCESS,
                soft_deleted:false
              };
              const response = await DocumentService.processAction({payload: updatePayload, filter: { _id: data._id }, document_id : data._id, action: Constants.DOCEX.TRIGGER_ACTION.RESTORE});
              if (_.get(response, "data.status")) {
                    EventBus.$emit("REFRESH_TABLE");
                    this.notifySuccess("Document has been successfully restored")
                    return;
              }
               this.notifyError(_.get(response, "data.message")||"Error while restoring record.");
            }
            catch(error){
              console.error(error);
              this.notifyError("Error while restoring record.");
            }
          })
      });

      EventBus.$on("IDP_DOCUMENT_MOVE_TO_INBOX", async (data) => {
        const confirmRes = await this.$confirm(`Are you sure you want to move document to inbox?`, "Confirmation", {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "warning",
        })
        if(!confirmRes){
          return
        }
        try {
          const params = {
            action: Constants.DOCEX.TRIGGER_ACTION.MOVE_TO_RECIEVED,
            document_id : data._id
          };
          const response = await DocumentService.processAction(params);
          if (_.get(response, "data.status")) {
                EventBus.$emit("REFRESH_TABLE");
                this.notifySuccess("Document moved. Please check Inbox tab")
                return;
          }
            this.notifyError(_.get(response, "data.message")||"Error while moving document to inbox.");
        }
        catch(error){
          console.error(error);
          this.notifyError("Error while moving document to inbox");
        }
      });


    },

    async retryExraction(row) {
      let params = {
        storage_folder_path: row.storage_folder_path,
        original_file_name: row.original_file_name,
        id: row._id,
        document_type: row.document_type,
      };
      try {
        let retryResponse = await DocumentService.retry(params);
        if (!retryResponse || !_.get(retryResponse, "data.data.data")) {
          this.notifyError("Something went wrong while retrying");
          return;
        }
        this.notifySuccess("Retry request initiated");
        retryResponse &&
          EventBus.$emit("IDP_UPDATE_TABLE_ROW",_.get(retryResponse, "data.data.data"));
      } catch (e) {
        console.error(e);
      }
    },
    retryPublish(row) {
      this.retryPublishData.document_id = row._id;
      this.retryPublishData.document_type = row.document_type;
      this.publishDialogVisible = true;
    },
    deRegisterEvents() {
      EventBus.$off([
        "IDP_APPLY_TREE_FILTER",
        "IDP_OPEN_DOCUMENT",
        "IDP_DOWNLOAD_DOCUMENT",
        "IDP_DELETE_DOCUMENT",
        "SET_DOCUMENT_TYPE",
        "IDP_ASSIGN_DOCUMENT",
        "IDP_APPROVAL_DOCUMENT",
        "HIDE_LOADING",
        "IDP_CANCEL_EXTRACTION",
        "IDP_EXCEL_RETRY",
        "IDP_ASSIGN_DOCUMENTS",
        "IDP_TRIGGER_PAYMENT",
        "IDP_MARK_PAYMENT_ON_HOLD",
        "IDP_DOCUMENT_MARK_PUBLISHED",
        "IDP_DOCUMENT_RESTORE",
        "IDP_DOCUMENT_MOVE_TO_INBOX",
      ]);
    },
    //We are using this configuration to enable and disable buttons in child components
    //So getting this while initialzing the app
    async getDocTypeConfigurations() {
      CustomerConfig.getAllDocsCustConfiguration({ document_type: { $exists: true } });
    }
  },
  components: { IdpAdminToolbar,IdpToolbar, IdpNavbar, IdpTree, PublishDialog, DocumentAssign },
  created() {},
  mounted() {
            if(this.$route.path.includes("/idp/other-documents")){
                this.menuList = [];
            }
  },
  beforeDestroy() {
    this.deRegisterEvents();
  },
  beforeMount() {
    this.registerEvents();
    this.getDocTypeConfigurations();
  },
};
export default idpComponent;
</script>

<style lang="scss" scoped>
@import "./_idpVariables";
@import "./_idpGlobal";
</style>
