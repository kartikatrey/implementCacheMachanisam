<template>
  <main class="kp-main">
    <idp-list-header title="Invoices" :tableProps="tableProps" :filter="filter" :isReviewerOnly="isReviewerOnly"></idp-list-header>
    <div class="page-body">
      <IdpDataTable v-show="showDatatable" title="" v-bind="tableProps" :isReviewerOnly="isReviewerOnly"></IdpDataTable>
    </div>
   <DocumentAssign  title="Assignment" @closeAssignmentDialogue="handleCloseAssignmentDialog" v-show="showAssignModal" :assignModalProps="assignModalProps"></DocumentAssign>
   <!-- for the approver column's -- ApprovalList -->
   <el-dialog title="Approver" :visible.sync="showContents" width="60%" class="approvalList-modal">
      <p class="approval-list-title">
        <el-button round text class="approval-list-back" size="small" @click="closeDialog"> <i class="mdi mdi-close"></i> </el-button>
        Approval History </p>
      <approval-list :documentId="documentId"></approval-list>
    </el-dialog>
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
import IdpSheetService from "@/idp/services/excel/IdpSheetService";
import DocumentAssign from "@/idp/components/DocumentAssign.vue";
import ApprovalList from "@/idp/components/ApprovalList";

export default {
  name: "IdpInvoiceList",
  data() {
    return {
      allBusEvents: [],
      isReviewerOnly:false,
      loading:false,
      showContents: false,
      documentId: "",
      showAssignModal:false,
      showDatatable: true,
      assignModalProps:{},
      filter: {
        stage: {'$in': [Constants.DOCEX.STAGE.UPLOADED,Constants.DOCEX.STAGE.EXTRACTED ]},
      },
      tableProps: {  
        multiSelect: true,
        enableDateRangeFilter: true,
        enableCustomerFilter: false,
        enableGroupFilter:true,
        minHeight: 600,
        paginationSizes:[5, 15, 25,50],
        tableName: "de_document",
        tableIdentifier: "idp_invoice_list",
        apiName:'/portal/api/table/de_document',
        sortColumn: "-created_at",
        select : this.selectCols(),
        excludeFields: [
          "prediction",
          "ocr_result",
          "workflow_data",
          "messages",
          "br_field_config",
          "display_fields",
        ],
        query: {
          // stage:{'$in': [Constants.DOCEX.STAGE.UPLOADED,Constants.DOCEX.STAGE.EXTRACTED ]},
          active: true,
          document_type: Constants.DOCEX.DOCUMENT_TYPES.INVOICE,
          storage_folder_path: { $regex: ".*/*$" }
          ,
          is_excel_child : {$ne:true}
        },
        bulkActions:['delete','publish','refresh'],
        actions: [
                {
            name: "assign",
            label: "Assign",
            icon: "mdi mdi-account-plus-outline",
            class: null,
            eventName: "IDP_ASSIGN_DOCUMENT",
            disableCheckKey: ["state","stage","is_multi_documents_present","is_data_deleted"],
            disableValues: {state:["In progress", "Extracted","Requested","Queued","Pending","Publish in progress","Publish started"],stage:["Published","Deleted"],"is_multi_documents_present":[true],"is_data_deleted":[true]},
            outline :true
          },
          {
            name: "cancel_extraction",
            label: "Cancel extraction",
            icon: "mdi mdi-stop-circle-outline",
            class: null,
            eventName: "IDP_CANCEL_EXTRACTION",
            checkStatus:'excel_config.enable_cancel_extraction',
            disableCheckKey: ["state","stage","file_type"],
            disableValues: {state:["Success"],stage:["Published", "Cancelled"], "file_type":["pdf"]},
            outline :true
          },
          {
            name: "excel_retry",
            label: "Retry",
            icon: "mdi mdi-reload",
            class: null,
            eventName: "IDP_EXCEL_RETRY",
            disableCheckKey: ["state","stage","file_type"],
            disableValues: {state:["In progress","Publish in progress", "Requested"], stage:["Published", "Extracted", "Approved", "Errored", "Deleted", "Uploaded"], "file_type":["pdf"]},
            outline :true
          },
          {
            name: "download",
            label: "Download",
            icon: "mdi mdi-arrow-down-thin-circle-outline",
            class: null,
            eventName: "IDP_DOWNLOAD_DOCUMENT",
            disableCheckKey: ["state","stage"],
            disableValues: {state:["In progress", "Requested","Queued","Pending"],stage:["Deleted"]},
          },
          {
            name: "delete",
            label: "Delete",
            icon: "mdi mdi-delete",
            class: null,
            eventName: "IDP_DELETE_DOCUMENT",
            disableCheckKey: ["state","is_multi_documents_present","is_data_deleted"],
            disableValues: {state:["In progress", "Requested","Queued","Pending","Publish in progress","Extracted","Publish started"],"is_multi_documents_present":[true],"is_data_deleted":[true]},
            outline :true
          },                   
          {
            name: "mark_published",
            label: "Mark as published",
            icon: "mdi mdi-publish",
            class: null,
            eventName: "IDP_DOCUMENT_MARK_PUBLISHED",
            disableCheckKey: ["state","is_multi_documents_present","stage", "publish_failure_reason"],
            disableValues: {state:["In progress","Requested","Queued","Pending","Publish in progress","Extracted","Publish started", "Success"],"is_multi_documents_present":[true], stage:["Published"], publish_failure_reason:[null, "", undefined]},
            outline :true
          }     
        ],
        columns: [
           
        ],
        expandColumns: [
          {
            name: "po_number",
            label: "PO number",
            header_component: null,
            cell_component: null,
          },
          {
            name: "invoice_number",
            label: "Invoice no.",
            header_component: null,
            cell_component: null,
          },
          {
            name: "invoice_date",
            label: "Invoice date",
            header_component: null,
            cell_component: null,
          },
          {
            name: "due_amount",
            label: "Due amount",
            header_component: null,
            cell_component: null,
            width: "130",
          },
          {
            name: "vendor_name",
            label: "Vendor",
            header_component: null,
            cell_component: null,
          },
        ],
      },
     
    };
  },
  computed: {
    getTabClass(tabName) {},
  },
  methods: {
    selectCols(){
      const projection = [
              "has_errors",
              "messages",
              "invoice_number",
              "invoice_date",
              "po_number",
              "file_icon",
              "Link dot",
              "file_name",
              "created_at",
              "created_by",
              "vendor_name",
              "due_amount",
              "assigned_group_name",
              "assigned_user_name",
              "due_date",
              "updated_at",
              "updated_by",
              "published_by",
              "state",
              "file_type",
              "cancelled_on",
              "cancelled_on_stage",
              "has_collab_messages",
              "original_file_name","is_multi_documents_present","parent_document_id","fraud_detected","storage_folder_path",
              "is_data_deleted","stage","publish_failure_reason","extraction_failure_reason","published_at","document_link","is_link_verified"]
      return projection.toString()
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

    closeDialog() {
      this.documentId = "";
      this.showContents = false;
    },

    async setTableColumns() {
      console.log("filter issS:",this.filter)
        if (!this.isPackageType) {
          this.selectedCategoryType = "documents";
        }
        var queryParams = {
          document_type: Constants.DOCEX.DOCUMENT_TYPES.INVOICE,
          stage:this.filter.stage || this.filter.state || Constants.DOCEX.STAGE.UPLOADED,
          category: this.selectedCategoryType,
        };
        console.log("queryParams::::",queryParams)
        const columnsData = await DocumentService.getTableConfig(queryParams)
      
        this.tableProps.columns = columnsData.columns.data;
        this.reRenderTable();
    },

    reRenderTable() {
      this.showDatatable = false;
      this.$nextTick(() => {
        this.showDatatable = true;
      });
    },

    renderColumns() {
      if (this.filter.stage == Constants.DOCEX.STAGE.PUBLISHED) {
        this.tableProps.sortColumn = "-published_at";        
      }
      if (this.filter.stage == Constants.DOCEX.STAGE.REJECTED) {
        const ignoreColumn = ['due_date'];
        this.tableProps.columns = this.tableProps.columns.filter(item=>!ignoreColumn.includes(item.name));
      }
      if(this.filter.state == Constants.DOCEX.STATE_ERRORED.FAILED){
          this.tableProps.columns = _.unionBy(
          this.tableProps.columns,
          this.addErroredColumn(),
          "name"
        );
      }
      // Add status column at the end of column 
      this.tableProps.columns = this.tableProps.columns.filter((item) => item.name !== 'state');
      this.tableProps.columns.splice(this.tableProps.columns.length, 0,  {
            name: "state",
            label: "Status",
            width: '70',
            header_component: null,
            cell_component: "StatusWrapper",
            className:'idp-status-col-container',
            fixed: "right",
            filterOptions: {
              enable: true,
            },
            showTooltipWhenOverflow: false,
            options: {
              eventName: "IDP_RETRY",
              disableCheckKey: ["is_data_deleted"],
              disableValues: {is_data_deleted:[true]},
            },
      })
    },
    
    
  
    initColumnFilters(searchText) {
      let columnFilter = DocumentService.getTableColumnFilters({
        searchText,columns:this.tableProps.columns
      });
      //adding search column as $and condition to support excel query
      columnFilter = { $and: [columnFilter] }      
      this.tableProps.query = {
        ...columnFilter,
        ...(this.tableProps.query || {}),
      }; 
    },

    handleCloseAssignmentDialog(isTableRefreshRequired){
      this.showAssignModal = false;
      if(!isTableRefreshRequired) return;
      this.showDatatable = false;
      this.$nextTick(()=>{
        this.showDatatable = true;
      })
    },

    registerEvents(){
      this.allBusEvents = ["IDP_APPROVAL_DOCUMENT", "IDP_CANCEL_EXTRACTION", "IDP_EXCEL_RETRY", "HIDE_LOADING", "IDP_ASSIGN_DOCUMENT"];
      EventBus.$on("IDP_APPROVAL_DOCUMENT", async (documentId) => {
        this.loading = true;
        this.showContents = true;
        this.documentId = documentId;
      });

      EventBus.$on("IDP_CANCEL_EXTRACTION", async (row) => {
        await this.$confirm('Do you want cancel extraction process', 'Confirm', {
            confirmButtonText: 'Proceed',
            cancelButtonText: 'Cancel'
        }).catch((error)=>{});
        const response = await IdpSheetService.processCancelAction(row._id, "extraction");        
        // Need to move current document to cancelled tab 
        if(response.status){
          this.notifySuccess(response.message) 
          EventBus.$emit("REFRESH_TABLE")
          return;
        }
        this.notifyError(response.message) 
      });

      EventBus.$on("IDP_EXCEL_RETRY", async (row) => {
        const res = await this.$confirm('Do you want to retry', 'Confirm', {
            confirmButtonText: 'Proceed',
            cancelButtonText: 'Cancel'
        }).catch((error)=>{});
        if (!res) {
            return;
        }
        const response = await IdpSheetService.processRetryAction(row._id);
        if(response.status){
          EventBus.$emit("REFRESH_TABLE");
          this.notifySuccess(response.message);
          return;
        } 
        this.notifyError(response.message) 
      });

      EventBus.$on("HIDE_LOADING", async (hide_loader) => {
        this.loading = !hide_loader;
      });

      EventBus.$on("IDP_ASSIGN_DOCUMENT", async (row) => {
        this.showAssignModal=true
        this.assignModalProps=row
      });
    },

    deRegisterEvents(){
      EventBus.$off(this.allBusEvents);
    },

    updateTableProps(){
      if(this.filter.stage){
        this.tableProps.query.stage =this.filter.stage;
      } else if (this.filter.state) {
          this.tableProps.query.state = this.filter.state;
      } else{
        this.tableProps.query.stage = {'$in': [Constants.DOCEX.STAGE.UPLOADED,Constants.DOCEX.STAGE.EXTRACTED ]};
      }
      if(this.filter.state == Constants.DOCEX.STATE_ERRORED.FAILED){
        this.tableProps.query && delete this.tableProps.query.stage
      }
      // Update sortFilter
      const sortColumn = _.get(this.filter[this.tableProps.tableIdentifier],'sortColumn');
      if(sortColumn) this.tableProps.sortColumn = sortColumn;
      this.filter.invoice_type && (this.tableProps.query.invoice_type = this.filter.invoice_type);
      this.tableProps.query.storage_folder_path =      
          this.filter && this.filter.folderPath
            ? Constants.DOCEX.DOCUMENT_TYPES.INVOICE + this.filter.folderPath : undefined
      if(this.filter && this.filter.myDocuments ){
        this.tableProps.query.myDocuments = this.filter.myDocuments
      }
      this.tableProps.query = {
        ...(this.tableProps.query || {}),
        ...(this.filter.secondary || {}),
      };
      let searchText = this.filter.searchText && ("" + this.filter.searchText).trim();
      if (searchText) this.initColumnFilters(searchText);
    }
  },
  components: { IdpDataTable, IdpListHeader, IdpTree, DocumentAssign, ApprovalList},
  created() {},
  mounted() {},
  async beforeDestroy() { 
    this.deRegisterEvents();
  },

  async beforeMount() {
    const user = this.$store.getters.user;
    this.isReviewerOnly= _.get(user,"is_reviewer_only") // return true, if user role is revieweronly
    this.$store.commit("setDocumentType", Constants.DOCEX.DOCUMENT_TYPES.INVOICE);
    this.$store.commit("setDisplayIdpTree",true);
    this.$store.commit("setDisplayIdpNavbar",false);
    const shouldShowApptour = this.$store.getters.shouldShowApptour;
    if (shouldShowApptour && user.is_first_login_attempt) {
      this.$store.commit("setShowApptour", false);
      EventBus.$emit("show_upload_apptour");
    }
    this.registerEvents();   
    this.findFilter();
    await this.setTableColumns();
    this.updateTableProps();        
  }
};
</script>

<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";
.approvalList-modal  {
    .el-dialog {
      padding: 1.7rem;
      .vue-good-table-box {
        height: 360px;
        overflow: auto;
      }
      .el-dialog__body {
        
      }
      .vue-good-table-box .vgt-table tbody tr td {
        text-align: left;
      }
      .export-btn  {
        display: none;
      }
       .table-toolbar {
            margin-right: 3rem;
       }
    }
    .table-toolbar .support-btn .refreshbtn {
      span {
          transform: scale(1.4);
          display: block;
      }
    }
   
  }
  

.approval-list-title {
    margin:0 0 -2rem 0;
    font-style: normal;
    font-weight: 600;
    font-size: 1.286rem;
    line-height: 27px;
    letter-spacing: 0.01em;
    color: var(--dark-02);
    position: relative;
}
 .approval-list-back {
    position: absolute;
    border: 0;
    color: var(--dark-03);
    font-size: 1.2rem;
    vertical-align: text-top;
    // padding: 0 .7rem 0 .4rem;
    padding: 0 !important;
    right: -10px;
    top: -10px;
    z-index: 9999;
    transition: .15s all ease-in-out;
    transform-origin: center center;
    background: var(--dark-08);
    width: 25px;
    height: 25px;
      &:hover {
        background: transparent !important;
        transform: scale(1.2);
      }
  }
  .idp-icon-container span.view-list {
    font-size: 1.5rem;
    transition: .25s all ease-in-out;
    cursor: pointer;
      &:hover {
        font-size: 1.69rem;
        color: var(--green-05);
      }
  }
</style>
