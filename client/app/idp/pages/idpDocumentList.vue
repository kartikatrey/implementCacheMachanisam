<template>
  <main class="kp-main">

      <!-- Idp List Headers -->
        <idp-list-header
            v-if="isIdpListHeaderMounted"
            :title="getTitle"
            :key="tableProps.tableConfigLoaded"
            :tableProps="tableProps"
            :filter="filter"
            :isReviewerOnly="isReviewerOnly"
            :stageTabConfig="stageTabConfig"
            :advanceSearchProps="advanceSearchProps"
		></idp-list-header>
      <!-- Idp Data Table -->
      <div class="page-body"> <IdpDataTable title="" :tableProps="tableProps" :isReviewerOnly="isReviewerOnly"></IdpDataTable> </div>

      <!-- Document Assignment Component -->
      <DocumentAssign
        v-if="showAssignmentModel"
        title="Assignment"
        @closeAssignmentDialogue="handleCloseAssignmentDialog"
        :documentType="document_type"
        :showAssignmentModel="showAssignmentModel"
        :assignModalProps="assignModalProps"
      ></DocumentAssign>

      <!-- ApprovalListDialog - for approver column -->
      <ApprovalListDialog :documentId="documentId" :visible.sync="showApprovalHistory"></ApprovalListDialog>

      <!-- Trigger Payment Pop up -->
      <PaymentModal v-if="showPaymentDialog" @close="handleClosePaymentDialog" :showPaymentDialog = "showPaymentDialog" :document = "currentDocument"></PaymentModal>

      <!-- Trigger Reject document dialog -->
      <RejectDocDialog
      @hide="handleRejectDialogClose"
      :rejectDialogVisible="rejectDialogVisible"
      />

  </main>
</template>

<script>
import IdpDataTable from "../table/IdpDataTable";
import IdpListHeader from "./idpListHeader.vue";
import Constants from "@/resources/Constants";
import IdpTree from "@/idp/components/IdpTree.vue";
import EventBus from "@/EventBus";
import _ from "lodash";
import DocumentService from "@/idp/services/DocumentService";
import CustomerService from "@/idp/services/CustomerService";
import DocumentAssign from "@/idp/components/DocumentAssign.vue";
import CustomerConfig from "@/idp/services/DeCustomerConfig";
import ApprovalListDialog from '@/idp/components/ApprovalListDialog';
import PaymentModal from "@/payments/components/PaymentModal.vue"
import moment from 'moment-timezone';
import UserAccessService from "@/idp/services/UserAccessService";
import ActionButtonConfig from "@/idp/services/ActionButtonConfig";
import RejectDocDialog from "@/idp/components/RejectDocDialog.vue";

export default {
  name: "IdpDocumentList",
  data() {
      return {
          rejectDialogVisible: false,
          workflowType: "docex",
          showSlide: false,
          showComponentPanel: false,
          allBusEvents: [],
          isReviewerOnly: false,
          showAssignmentModel: false,
          assignModalProps: {},
          showPaymentDialog : false,
          docTypeConfig:{},
          filter: {
              stage: { '$in': [Constants.DOCEX.STAGE.UPLOADED, Constants.DOCEX.STAGE.EXTRACTED] },
          },
          tableProps: {
              tableConfigLoaded: false,
              readParamsFromUrl: true,
              multiSelect: true,
              enableDateRangeFilter: true,
              enableCustomerFilter: false,
              enableGroupFilter: true,
              minHeight: 600,
              paginationSizes: [5, 15, 25, 50],
              tableName: "de_document",
              tableIdentifier: "idp_" + this.document_type + "_list",
              pushFilterToUrl:true,
              apiName: '/portal/api/table/de_document',
              sortColumn: "-created_at",
              select: '',

              excludeFields: [
                  "prediction",
                  "ocr_result",
                  "workflow_data",
                  "messages",
                  "br_field_config",
                  "display_fields",
              ],
              query: {
                  stage: { '$in': [Constants.DOCEX.STAGE.UPLOADED, Constants.DOCEX.STAGE.EXTRACTED] },
                  active: true,
                  document_type: this.document_type,
                  storage_folder_path: { $regex: ".*/*$" }
                  ,
                  "$or": [{ file_type: { $ne: Constants.DOCEX.DOCUMENT_FILETYPES.EXCEL } }, { "$and": [{ file_type: Constants.DOCEX.DOCUMENT_FILETYPES.EXCEL }, { parent_document_id: { $exists: false } }] }]
              },
              bulkActions: [],
              inlineActionButtons: [],
              outlineActionButtons: [],
              customActionButtons: [],
              columns: [],
              expandColumns: [],
              expandTableParams: null,
              isIdpListHeaderMounted: false
          },
          currentDocument : {},
          stageTabConfig: [],
          advanceSearchProps: {
            enableAdvanceSearch: true
          }
      };
  },
  computed: {
    getTitle() {
        let title = "";
        title = this.document_type
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        return title;
    },
  },
methods: {
        handleRejectDialogClose() {
            this.rejectDialogVisible = false;
            this.$emit("refresh")
            EventBus.$emit("REFRESH_TABLE")
        },

    registerEvents(){
        this.allBusEvents = ["IDP_ASSIGN_DOCUMENT", "IDP_TRIGGER_PAYMENT", "IDP_MARK_PAYMENT_ON_HOLD", "PLATFORM_ACTIONS", "INLINE_ACTION__Reject"];

            EventBus.$on("INLINE_ACTION__Reject",  async (document) => {

                const isStageInvalid = _.includes([
                    Constants.DOCEX.STAGE.PUBLISHED,
                    Constants.DOCEX.STAGE.REJECTED,
                    Constants.DOCEX.STAGE.PAID,
                    Constants.DOCEX.STAGE.VENDOR_PENDING,
                    Constants.DOCEX.STAGE.READY_FOR_PAYMENT,
                    Constants.DOCEX.STAGE.PAYMENT_IN_PROCESS,
                    Constants.DOCEX.STAGE.PAYMENT_ON_HOLD,
                    Constants.DOCEX.STAGE.PAYMENT_FAILED,

                ], document.stage);

                const isDocInProgress = _.includes([
                    Constants.DOCEX.STATE_UPLOADED.REQUESTED,
                    Constants.DOCEX.STATE_UPLOADED.PENDING,
                    Constants.DOCEX.STATE_UPLOADED.QUEUED,
                    Constants.DOCEX.STATE_UPLOADED.IN_PROGRESS,
                    Constants.DOCEX.STATE_UPLOADED.EXTRACTED
                ], document.state);

                const isParentDocument = document.is_multi_documents_present;

                let confirmMessage = 'Do you want to send an email to the vendor?';

                if (isStageInvalid || isParentDocument) {
                    this.notifyError(`This document cannot be Rejected`)
                    return;
                }

                if(isDocInProgress){
                    confirmMessage = `This document is in progress. ${confirmMessage}`
                }

                this.$confirm(confirmMessage, 'Confirmation', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    type:"warning"
                })
                    .then(() => {
                        this.rejectDialogVisible = true;
                        this.$store.commit("documentViewStore/setDocumentData", document);
                    })
                    .catch(async (action) => {
                        if(action === 'cancel'){
                            const payload = {
                                _id: document._id,
                                stage: Constants.DOCEX.STAGE.REJECTED,
                                rejected_by: _.get(this.$store.getters.user, 'full_name'),
                                rejected_at: moment().format()
                            }
                            const RejectDocResponse = await DocumentService.update(payload);
                            if (RejectDocResponse.status == 200 || RejectDocResponse.status == 201) {
                                this.notifySuccess("Document rejected successfully")
                            } else {
                                this.notifyError("An error occurred while rejecting the document");
                            }
                            EventBus.$emit("REFRESH_TABLE")
                        }
                    })
            });

        //this is used in table action so currently not removing this event
        EventBus.$on("IDP_ASSIGN_DOCUMENT", async (row) => {
            this.showAssignmentModel=true
            this.assignModalProps=row
        });

        EventBus.$on("IDP_TRIGGER_PAYMENT", (selectedDocRecord) => {
            this.showPaymentDialog = true;
            this.currentDocument = selectedDocRecord;
        });

        //Adding the Mark on hold event
        EventBus.$on("IDP_MARK_PAYMENT_ON_HOLD", async (data) => {
            let message = "Are you sure you want to put Payment on hold for this document?";
            let confirmButtonText = "Confirm";
            this.notifyConfirm(message, confirmButtonText)
            .then(async () => {
                try {
                    let updatePayload = {
                        stage: Constants.DOCEX.STAGE.PAYMENT_ON_HOLD,
                    };
                    const response = await DocumentService.processAction({ payload: updatePayload, filter: { _id: data._id }, document_id: data._id, action: Constants.DOCEX.TRIGGER_ACTION.PAYMENT_ON_HOLD });
                    if (_.get(response, "data.status")) {
                        EventBus.$emit("REFRESH_TABLE");
                        this.notifySuccess("Document put on hold for payment.")
                        return;
                    }
                    this.notifyError(_.get(response, "data.message") || "Error encountered while marking payment on hold");
                }
                catch (error) {
                    console.error(error);
                    this.notifyError("Error encountered while marking payment on hold");
                }
            })
        });

    },

  async init() {
      const user = this.$store.getters.user;
      this.document_type = this.$route.params.documentType || "invoice";
      this.docTypeConfig = await CustomerConfig.getCustConfigByDocType(this.document_type);
      this.tempTableProps.query.document_type = this.document_type;

      this.isReviewerOnly= _.get(user,"is_reviewer_only") // return true, if user role is revieweronly
      this.$store.commit("setDocumentType", this.document_type);
      this.$store.commit("setDisplayIdpTree",true);
      this.$store.commit("setDisplayIdpNavbar",false);

      /**
         * If email view is enabled and user sets preference to email view, then user should redirected to the email view.
         * This helps improve the user experience by automatically directing them to their preferred view.
      */
      const isEmailViewEnabled = _.get(this.docTypeConfig, "enable_email_view");
      const emailViewPreference = this.$store.getters['userAccessStore/getEmailDocumentView'];

      if(isEmailViewEnabled && emailViewPreference){
        this.routeUserToEmailView();
        return;
      }

      const shouldShowApptour = this.$store.getters.shouldShowApptour;
      if (shouldShowApptour && user.is_first_login_attempt) {
          this.$store.commit("setShowApptour", false);
          EventBus.$emit("show_upload_apptour");
      }

      //Get tab configuration based on document type
      this.stageTabConfig = await UserAccessService.getTabConfig(this.document_type);
  },

  routeUserToEmailView(){
    const currentPath = this.$route.path;
    let newPath = `${currentPath}/email-view`;

    this.$router.push({
        path: newPath,
        query: this.$route.query,
    });
  },

  setQuery(){
      // Update filter stage & state in table prop query
      this.tempTableProps.tableIdentifier = `idp_${this.document_type}_list`;
      
	  // Add advance search (query builder) filter to query.
      if (this.filter.advanceSearchFilter) {
		  this.tempTableProps.query.advanceSearchFilter = this.filter.advanceSearchFilter.query;
          this.advanceSearchProps.filterId = _.get(this.filter, "advanceSearchFilter.filterId");
          this.advanceSearchProps.query = _.get(this.filter, "advanceSearchFilter.query");
          this.advanceSearchProps.filterStyle = "color: rgba(90, 103, 216)";
          this.advanceSearchProps.filterName = this.filter.advanceSearchFilter.name || "Unsaved filter";
      }

      if(this.filter.stage) {
          this.tempTableProps.query.stage = this.filter.stage;
        }     
      else if (this.filter.state) {
          this.tempTableProps.query.state = this.filter.state;
      }

      // On page load, set stage from stage map config
      else if(this.stageTabConfig && this.stageTabConfig[0]) {
          this.tempTableProps.query.stage = this.stageTabConfig[0]["value"];
      }
      else {
          this.tempTableProps.query.stage = {'$in': [Constants.DOCEX.STAGE.UPLOADED, Constants.DOCEX.STAGE.EXTRACTED ]};
      }
      if(this.filter.state == Constants.DOCEX.STATE_ERRORED.FAILED) {
          this.tempTableProps.query && delete this.tempTableProps.query.stage
      }
      //Update invoice type in tableprop query
      this.filter.invoice_type && (this.tempTableProps.query.invoice_type = this.filter.invoice_type);
      this.tempTableProps.query.storage_folder_path =
          this.filter && this.filter.folderPath
          ? this.document_type + this.filter.folderPath : undefined

      if (this.filter && this.filter.myDocuments ) {
          this.tempTableProps.query.myDocuments = this.filter.myDocuments
      }
      // If the user is an 'ap_contributor,' display only the documents assigned to that user.
      const userRoles = _.get(this.$store.getters.user, 'roles', [])
      if (this.filter && (userRoles.length == 1 && userRoles[0] === Constants.DOCEX.ROLES_MAP.AP_CONTRIBUTOR)) {
          this.tempTableProps.query.myDocuments = "myAssignedDocs"
      }
      this.tempTableProps.query = { ...(this.tempTableProps.query || {}), ...(this.filter.secondary || {}) };
    },

  findFilter() {
      try {
          this.filter = JSON.parse((this.$route && this.$route.query && this.$route.query.filter) || "{}");
        /** 
        * We call the `router.push` function twice: once in `idpToolbar.vue` when the user clicks on the menu, and again in 
        * `idpDataTable.vue` to push query parameters to the URL. This results in rendering the same component multiple times,
        *  leading to UI issues. To address this, we introduced the "m=y" query parameter when the user clicks on the menu.
        */
        //   const isMenuRoute = _.get(this.$route, "query.m") == "y";
        //   this.tableProps.pushFilterToUrl = isMenuRoute != true;

          // Define docType
          const docType = `idp_${this.document_type}_list`;
          // Check if 'pageSize' is specified in the 'filter' object for the 'docType'.
          const pageSize = this.filter[docType] ? this.filter[docType].pageSize : 0;
          // Store the determined 'pageSize' value in the window object using a key derived from 'docType'.
          // This allows you to access the page size later using 'window[docType + "_page_size"]'.
          if (pageSize) {
            window[docType + "_page_size"] = pageSize;
          }

          // We have common tab for extracted and uploaded stages ie. Inbox
          if (this.filter.stage && this.filter.stage == Constants.DOCEX.STAGE.EXTRACTED) {
              this.filter.stage = Constants.DOCEX.STAGE.UPLOADED
          }
      } catch (err) {
          this.filter = {};
      }
      return this.filter;
  },

  closeWfProgressDialog() {
      this.documentId = "";
      this.showWfExecution = false;
      this.dialogFlowData = {};
      const wfExecutionData = {
          "showWfExecution": false,
          "documentId": "",
          "wfExecutionData": {}
      };
      this.$store.commit("setWfExecutionData", wfExecutionData);
  },
  //to set columns
  async setTableColumns() {
      // getting stage from url filter or stage map config else getting it from constant.
      const queryParams = {
          document_type: this.document_type,
          stage: this.filter.stage || this.filter.state || this.stageTabConfig && this.stageTabConfig[0]["value"] || Constants.DOCEX.STAGE.UPLOADED,
          category: "documents",
          isExpandColumns:true,
          time_zone: moment.tz.guess() // Setting user time-zone which can be used in subsequent flows, like data export
      };
      const tableConfigResponse = await DocumentService.getTableConfig(queryParams);
      // to set table headers columns
      this.tempTableProps.columns = tableConfigResponse.columns.data;
      // to set expand columns
      this.tempTableProps.expandColumns = tableConfigResponse.expand_columns.data;
      //Get all column Names
      let allColumnsNames  = tableConfigResponse.projection_columns_names;
      this.tempTableProps.select = allColumnsNames.toString();
  },

  initColumnFilters(searchText) {
    let columnFilter = DocumentService.getTableColumnFilters({
      searchText,columns:this.tempTableProps.columns
    });

    //adding search column as $and condition to support excel query
    columnFilter = { $and: [columnFilter] }

    this.tempTableProps.query = {
      ...columnFilter,
      ...(this.tempTableProps.query || {}),
    };

  },
  handleCloseAssignmentDialog(isTableRefreshRequired){
    this.showAssignmentModel = false;
    if(!isTableRefreshRequired) return;
  },

  handleClosePaymentDialog(){
    this.showPaymentDialog = false
    EventBus.$emit("REFRESH_TABLE");
  },

  deRegisterEvents(){
    EventBus.$off(this.allBusEvents);
  },

  async isActionInCustomerConfig(path){
    //Default value kept as false
    //For scenario like if payment_enabled key not found in customer_configuration,
    //then too Payment related buttons should not be visible
    const custConfig = await CustomerService.getCustomerConfiguration({selectColumns:[path]});
    return _.get(custConfig[0] || {}, path, false);
  },

  async isActionInCustConfigByDocType(path){
    //Default value kept as true
    //For scenario like if enable_delete_button key not found in de_customer_configuration,
    //then too Delete button should be visible
        const docTypeConfig = await CustomerConfig.getCustConfigByDocType(this.document_type);
    return _.get(docTypeConfig || {}, path, true);
      },

   //IMPORTANT: this initActionButtons is temporary and will be replaced by dynamic actions and buttons
   async initActionButtons(){
    let outlineActions = [];
    let inlineActions = [];
    const showPaymentBtns = await this.isActionInCustomerConfig('payment_enabled')
    const showCancelExtractionBtn = await this.isActionInCustConfigByDocType('excel_config.enable_cancel_extraction')
    const showDeleteBtn = await this.isActionInCustConfigByDocType('enable_delete_button')
    const assignBtn = {
        name: "assign",
        label: "Assign",
        icon: "mdi-account-plus-outline",
        class: null,
        eventName: "IDP_ASSIGN_DOCUMENT",
        // These conditions are temporary set here and will be moved to dynamic buttons eventually
        // These buttons should be disabled for vendor onboarding document type
        disableCheckKey: ["state", "stage", "is_multi_documents_present", "is_data_deleted", "document_type"],
        disableValues: { state: ["In progress", "Extracted", "Requested", "Queued", "Pending", "Publish in progress", "Publish started"], stage: ["Published", "Deleted", "Ready for payment", "Payment on hold", "Payment in process", "Paid", "Payment failed"], "is_multi_documents_present": [true], "is_data_deleted": [true], "document_type": ["vendor_onboarding"] },
    };
    outlineActions.push(assignBtn)
    const cancelExtractionBTn = {
        name: "cancel_extraction",
        label: "Cancel Extraction",
        icon: "mdi-stop-circle-outline",
        class: null,
        eventName: "IDP_CANCEL_EXTRACTION",
        disableCheckKey: ["state", "stage", "file_type"],
        disableValues: { state: ["Success","Publish in progress"], stage: ["Published", "Cancelled", "Deleted"], "file_type": ["pdf", "image"] },
    };
    showCancelExtractionBtn && outlineActions.push(cancelExtractionBTn)
    const retryExcelBtn = {
        name: "excel_retry",
        label: "Retry",
        icon: "mdi-reload",
        class: null,
        eventName: "IDP_EXCEL_RETRY",
        // These conditions are temporary set here and will be moved to dynamic buttons eventually
        // These buttons should be disabled for vendor onboarding document type
        disableCheckKey: ["state", "stage", "file_type", "document_type"],
        disableValues: { state: ["In progress", "Publish in progress", "Requested"], stage: ["Published", "Extracted", "Approved", "Errored", "Deleted", "Uploaded"], "file_type": ["pdf"], document_type: ["vendor_onboarding"] }
    }
    outlineActions.push(retryExcelBtn)
    if(showPaymentBtns){
        const payActionButton = {
            name: "pay",
            label: "Pay",
            icon: "mdi-cash-multiple",
            class: "hide_show_action",
            eventName: "IDP_TRIGGER_PAYMENT",
            //Pay button will always be visible only on "invoice" document type
            visibleCheckKey: ["stage", "document_type"],
            visibleValues: {stage:["Published","Approved","Ready for payment","Payment on hold","Payment failed"], document_type:["invoice"]},
        };
        inlineActions.push(payActionButton)
        const paymentOnHoldActionButton = {
            name: "payment_on_hold",
            label: "Payment on Hold",
            icon: "mdi-gesture-tap-hold",
            class: "hide_show_action",
            eventName: "IDP_MARK_PAYMENT_ON_HOLD",
            visibleCheckKey: ["stage", "document_type"],
            visibleValues: {stage:["Published", "Ready for payment","Approved","Payment failed"], document_type:["invoice"]}
        };
        outlineActions.push(paymentOnHoldActionButton);
    }
    const downloadBtn =  {
        name: "download",
        label: "Download",
        icon: "mdi-arrow-down-thin-circle-outline",
        class: null,
        eventName: "IDP_DOWNLOAD_DOCUMENT",
        options: {
            enable: {
                file_type: ["excel"]
            }
        },
        disableCheckKey: ["state", "stage", "document_type"],
        disableValues: { state: ["In progress", "Requested", "Queued", "Pending"], stage: ["Deleted", "Ready for payment", "Payment in process", "Payment on hold", "Paid", "Payment failed"], document_type: ["vendor_onboarding"]},
    };
    inlineActions.push(downloadBtn);
    const deleteBtn = {
        name: "delete",
        label: "Delete",
        icon: "mdi-delete",
        class: null,
        eventName: "IDP_DELETE_DOCUMENT",
        disableCheckKey: ["state", "is_multi_documents_present", "is_data_deleted", "soft_deleted", "stage"],
        disableValues: {
            stage:["Ready for payment", "Payment on hold", "Payment in process", "Paid", "Payment failed", "Published"],
            state: ["In progress", "Requested", "Queued", "Pending", "Publish in progress", "Extracted", "Publish started"], "is_multi_documents_present": [true], "is_data_deleted": [true],
            "soft_deleted": [true]
        }
    }
    showDeleteBtn && outlineActions.push(deleteBtn);
    const markAsPublishedButton = {
        name: "mark_published",
        label: "Mark as Published",
        icon: "mdi-publish",
        class: null,
        eventName: "IDP_DOCUMENT_MARK_PUBLISHED",
        disableCheckKey: ["state", "is_multi_documents_present", "stage"],
        disableValues: { state: ["In progress", "Requested", "Queued", "Pending", "Extracted", "Publish started", "Success"], "is_multi_documents_present": [true], stage: ["Published", "Deleted"] },
    }
    outlineActions.push(markAsPublishedButton);
    const markAsReviewedButton = {
        name: "mark_reviewed",
        label: "Mark as Reviewed",
        icon: "mdi-check",
        class: null,
        eventName: "IDP_DOCUMENT_MARK_REVIEWED",
        disableCheckKey: ["stage", "state", "action", "document_type"],
        disableValues: {
            action: ["Reviewed"],
            state: ["Pending", "Extracted"],
            document_type: ["vendor_onboarding"],
            stage: ["Fraud flagged", "Fraud confirmed", "Approved", "Confirmed", "Approval rejected", "Published", "Extracted", "Errored", "Deleted", "Uploaded", "Paid", "Ready for payment", "Payment on hold", "Payment in process", "Payment failed", "Waiting for approval"]
        },
    }
    outlineActions.push(markAsReviewedButton);
    const restoreBtn = {
        name: "restore",
        label: "Restore",
        icon: "mdi-restore",
        class: null,
        eventName: "IDP_DOCUMENT_RESTORE",
        disableCheckKey: ["stage", "soft_deleted"],
        disableValues: { stage: ["In progress", "Requested", "Queued", "Pending", "Publish in progress", "Extracted", "Publish started", "Published", "Success", "Failed"], soft_deleted: [false, null, undefined, ""] },
    }
    outlineActions.push(restoreBtn);
    const moveToInboxBtn = {
        name: "move_to_inbox",
        label: "Move to Inbox",
        icon: "mdi-folder-move",
        class: null,
        eventName: "IDP_DOCUMENT_MOVE_TO_INBOX",
        // These conditions are temporary set here and will be moved to dynamic buttons eventually
        // These buttons should be disabled for vendor onboarding document type
        disableCheckKey: ["stage", "state", "document_type"],
        disableValues: { stage: ["Rejected", "Fraud flagged", "Fraud confirmed", "Approval rejected", "Published", "Extracted", "Errored", "Deleted", "Uploaded", "Paid", "Ready for payment", "Payment on hold", "Payment in process", "Payment failed"], document_type: ["vendor_onboarding"] },
    }
    outlineActions.push(moveToInboxBtn);
    this.tempTableProps.inlineActionButtons = inlineActions;
    this.tempTableProps.outlineActionButtons = outlineActions;
  },


  async initBulkActions(){
    let bulkActions = ['refresh', 'assign', 'export', 'download'];
    const showDeleteBtn = await this.isActionInCustConfigByDocType('enable_delete_button')
    const showPublishBtn = await this.isActionInCustConfigByDocType('enable_multi_publish_button');
    showDeleteBtn && bulkActions.push('delete');
    showPublishBtn && bulkActions.push('publish');
    this.tempTableProps.bulkActions = bulkActions;
  },
  async getCustomActionButtons(){
    // Here we are fetching all action buttons (custom made) and will display those buttons in list view
    // These action-buttons will be associated with pre-script
    // On-click of these buttons pre-script will decide whether action is allowed or not
    // This was implemented in order to improve performance of portal while implementing dynamic inline buttons
    const filter = {
        active: true,
        button_type: 'list',
        document_type: this.$route.params.documentType || "invoice"
    }
    const projection = [
        "document_type",
        "advanced_script",
        "roles",
        "name",
        "is_platform",
    ]
    const actionButtonsResponse = await ActionButtonConfig.getActions(filter, projection);
    actionButtonsResponse.action_list  && this.tempTableProps.outlineActionButtons.push(...actionButtonsResponse.action_list)
  }

},
components: {
    IdpDataTable,
    IdpListHeader,
    IdpTree,
    DocumentAssign,
    ApprovalListDialog,
    PaymentModal,
    RejectDocDialog
},
created() {},
mounted() {
    this.isIdpListHeaderMounted = true
},

async beforeDestroy() {
  this.deRegisterEvents();
},
async beforeMount() {
  this.tempTableProps =_.cloneDeep(this.tableProps)

  // To initialise document type, store,event
  await this.init();

  // To register event of extraction cancellation and retry
  this.registerEvents();

  // To find filters added in routes
  this.findFilter();

  // To get dynamic table columns with expand columns
  await this.setTableColumns();

  // To set tableprops query filter like stage & state
  this.setQuery();

  // Update sortFilter
  const sortColumn = _.get(this.filter[this.tempTableProps.tableIdentifier],'sortColumn');
  if (sortColumn) {
      this.tempTableProps.sortColumn = sortColumn;
  }

  // Update searchtext if any
  let searchText = this.filter.searchText && ("" + this.filter.searchText).trim();
  if (searchText) {
      this.initColumnFilters(searchText);
  }

  //IMPORTANT: this initActionButtons is temporary and will be replaced by dynamic actions and buttons
  await this.initActionButtons();
  await this.initBulkActions();
  await this.getCustomActionButtons();
  this.tempTableProps.tableConfigLoaded = true
  this.tableProps = this.tempTableProps
},
};
</script>

<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";
</style>
