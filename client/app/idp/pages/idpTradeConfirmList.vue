<template>
  <main class="kp-main">
    <idp-list-header title="Trade Confirms" :tableProps="tableProps" :filter="filter" :isReviewerOnly="isReviewerOnly"></idp-list-header>
    <div class="page-body">
      <IdpDataTable v-if="showDatatable" title="" v-bind="tableProps" :isReviewerOnly="isReviewerOnly"></IdpDataTable>
    </div>
   <DocumentAssign  title="Assignment" @closeAssignmentDialogue="handleCloseAssignmentDialog" v-if="showAssignModal" :assignModalProps="assignModalProps"></DocumentAssign>
   <!-- for the approver column's -- ApprovalList -->
   <el-dialog title="Approver" :visible.sync="showContents" width="60%" class="approvalList-modal">
      <p class="approval-list-title">
        <el-button round text class="approval-list-back" size="small" @click="closeDialog"> <i class="mdi mdi-close"></i> </el-button>
        Approval History </p>
      <approval-list :documentId="documentId" v-loading="loading"></approval-list>
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
import DocumentAssign from "@/idp/components/DocumentAssign.vue";
import ApprovalList from "@/idp/components/ApprovalList";

export default {
  name: "IdpTradeConfirmList",
  data() {
    return {
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
        tableIdentifier: "idp_trade_confirm_list",
        apiName:'/portal/api/table/de_document',
        sortColumn: "-created_at",
        excludeFields: [
          "prediction",
          "ocr_result",
          "workflow_data",
          "messages",
          "br_field_config",
          "display_fields",
        ],
        query: {
          stage: {'$in': [Constants.DOCEX.STAGE.UPLOADED,Constants.DOCEX.STAGE.EXTRACTED ]},
          active: true,
          document_type: Constants.DOCEX.DOCUMENT_TYPES.TRADE_CONFIRM,
          storage_folder_path: { $regex: ".*/*$" }
          ,
          "$or": [{file_type: {$ne: Constants.DOCEX.DOCUMENT_FILETYPES.EXCEL}},{"$and":[{file_type: Constants.DOCEX.DOCUMENT_FILETYPES.EXCEL  },{parent_document_id :{$exists : false}}]}]
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
           {
            name: "messages",
            header_component: null,
            className:'message-indicator-wrapper',
            cell_component: "MessageIndicator",
            sortable: false,
            width: "20"
          },
          {
            name: "file_icon",
            header_component: null,
            className:'file-icon-wrapper',
            cell_component: "FileIcon",
            sortable: false,
            width: "20"
          },
          {
            header_component: null,
            cell_component: "Dot",
            name: 'Link dot',
            sortable: false,
            width: "15",
            options: {
                groupParentKey: 'is_multi_documents_present',
                groupChildKey: 'parent_document_id',
                errorPointCheck: [{
                    key: 'has_errors',
                    value: true,
                    class: "error-dot"
                }, {
                    key: 'fraud_detected',
                    value: true,
                    class: "fraud-dot"
                }]
            },
          },                
          {
            name: "file_name",
            label: "Document name",
            header_component: null,
            cell_component: "LinkList",
            sortable: true,
            width: '260',
            filterOptions: {
              enable: true,
              filterType: "input",
            },
            showTooltipWhenOverflow: true,
            options: {
              eventName: "IDP_OPEN_DOCUMENT",
              disableCheckKey: ["state","is_data_deleted","is_multi_documents_present"],
              disableValues: {
                state:[
                  Constants.DOCEX.STATE_UPLOADED.REQUESTED,
                  Constants.DOCEX.STATE_UPLOADED.PENDING,
                  Constants.DOCEX.STATE_UPLOADED.QUEUED,
                  Constants.DOCEX.STATE_UPLOADED.IN_PROGRESS,
                  Constants.DOCEX.STATE_UPLOADED.EXTRACTED,
                  Constants.DOCEX.STATE_PUBLISHED.PUBLISH_IN_PROGRESS,                
                  Constants.DOCEX.STATE_PUBLISHED.PUBLISH_STARTED],
                is_data_deleted:[true],is_multi_documents_present:[true]},
            },
          },
          {
            name: "created_at",
            label: "Upload date",
            header_component: null,
            cell_component: "Date",
            sortable: true,
            width: '140',
            showTooltipWhenOverflow: true,
          },
          
          {
            name: "created_by",
            label: "Uploaded by",
            header_component: null,
            cell_component: null,
            sortable: true,
            width: '130',
            showTooltipWhenOverflow: true,
            filterOptions: {
              enable: true,
              filterType: "input",
            },
          },
          {
            name: "updated_at",
            label: "Updated date",
            header_component: null,
            cell_component: "Date",
            sortable: true,
            width: '140',
            showTooltipWhenOverflow: true,
          },
          {
            name: "updated_by",
            label: "Updated by",
            header_component: null,
            cell_component: null,
            sortable: true,
            width: '130',
            showTooltipWhenOverflow: true,
            filterOptions: {
              enable: true,
              filterType: "input",
            },
          },
          {
            name: "state",
            label: "Status",
            width: '70',
            className:'idp-status-col-container',
            header_component: null,
            cell_component: "Status",
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
          }
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
      publishedDateColumn:{
        name: "published_at",
        label: "Published date",
        header_component: null,
        cell_component: "Date",
        sortable: true,
        width: '140',
        showTooltipWhenOverflow: true,
      }
    };
  },
  computed: {
    getTabClass(tabName) {},
  },
  methods: {
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
    renderColumns() {
      if (this.filter.stage == Constants.DOCEX.STAGE.CONFIRMED || this.filter.stage == Constants.DOCEX.STAGE.APPROVED ) {
        this.tableProps.columns = _.unionBy(
          this.tableProps.columns,
          this.getConfirmedColumns(),
          "name"
        );
      }
      if(this.filter.stage == Constants.DOCEX.STAGE.WAITING_FOR_APPROVAL){
        this.tableProps.columns = _.unionBy(
          this.tableProps.columns,
          this.getPendingApprovalColumns(),
          "name"
        );
      }
      if (this.filter.stage == Constants.DOCEX.STAGE.PUBLISHED) {
        this.tableProps.columns = _.unionBy(
          this.tableProps.columns,
          this.getPublishedColumns(),
          "name"
        );
        this.tableProps.columns.splice(3,0,this.publishedDateColumn);
        const ignoreColumn = ['due_amount','due_date','updated_at','updated_by'];
        this.tableProps.columns = this.tableProps.columns.filter(item=>!ignoreColumn.includes(item.name));

        
        this.tableProps.sortColumn = "-published_at";
        
      }
       if (this.filter.stage == Constants.DOCEX.STAGE.APPROVAL_REJECTED) {
        this.tableProps.columns = _.unionBy(
          this.tableProps.columns,
          this.getApprovalRejectedColumns(),
          "name"
        );
      }

      if (this.filter.stage == Constants.DOCEX.STAGE.REJECTED) {
            this.tableProps.columns = _.unionBy(
            this.tableProps.columns,
            this.getRejectedColumns(),
            "name"
            );
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
            cell_component: "Status",
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
    addErroredColumn(){
      return[
          {
            name: "stage",
            label: "Stage",
            header_component: null,
            cell_component: null,
            sortable: true,
            width: '100',
            filterOptions: {
              enable: true,
            },
            showTooltipWhenOverflow: true
          },
           {
          name: "reviewed_by",
          label: "Reviewer",
          header_component: null,
          cell_component: null,
          sortable: true,
          width: '130',
          showTooltipWhenOverflow: true,
          filterOptions: {
            enable: true,
            filterType: "input",
          },
        }
      ]
    },
    getPublishedColumns() {
      return [
        {
          name: "is_link_verified",
          label: "Attachment verified",
          header_component: null,
          cell_component: "Icon",
          sortable: false,
          width: '130',
          filterOptions: {
          enable: false
          },
          options: {
            successValues: [true],
            failedValues: [false,'',null],
          },
        },
        //  {
        //   name: "approved_by",
        //   label: "Approver",
        //   header_component: null,
        //   cell_component: null,
        //   sortable: true,
        //   width: '130',
        //   showTooltipWhenOverflow: true,
        //   filterOptions: {
        //     enable: true,
        //     filterType: "input",
        //   },
        // },
        // {
        //   name: "approved_at",
        //   label: "Approved date",
        //   header_component: null,
        //   cell_component: "Date",
        //   width: '140',
        //   sortable: true,
        //   showTooltipWhenOverflow: true
        // },
        {
          name: "reviewed_by",
          label: "Reviewer",
          header_component: null,
          cell_component: null,
          sortable: true,
          width: '130',
          showTooltipWhenOverflow: true,
          filterOptions: {
            enable: true,
            filterType: "input",
          },
        },
        {
          name: "published_by",
          label: "Publisher",
          header_component: null,
          cell_component: null,
          sortable: true,
          width: '130',
          showTooltipWhenOverflow: true,
          filterOptions: {
            enable: true,
            filterType: "input",
          },
        },
         {
          name: "approved_by",
          label: "Approvals",
          header_component: null,
          cell_component: "Icon",
          width: '80',
          filterOptions: {
            enable: false
          },
          showTooltipWhenOverflow: false,
          fixed: "right",
          options: {
            iconClass: "mdi mdi-eye-outline view-list",
            iconColorClass: [true],
            eventName: "IDP_APPROVAL_DOCUMENT",
          }
        },
      ];
    },
    getApprovalRejectedColumns(){
       return [
        // {
        //   name: "rejected_by",
        //   label: "Approval rejected by",
        //   header_component: null,
        //   cell_component: null,
        //   sortable: true,
        //   width: '130',
        //   showTooltipWhenOverflow: true,
        //   filterOptions: {
        //     enable: true,
        //     filterType: "input",
        //   },
        // },
        {
          name: "approved_by",
          label: "Approvals",
          header_component: null,
          cell_component: "Icon",
          width: '80',
          filterOptions: {
            enable: false
          },
          showTooltipWhenOverflow: false,
          fixed: "right",
          options: {
            iconClass: "mdi mdi-eye-outline view-list",
            iconColorClass: [true],
            eventName: "IDP_APPROVAL_DOCUMENT",
          }
        },
        //  {
        //   name: "rejected_at",
        //   label: "Approval rejected date",
        //   header_component: null,
        //   cell_component: "Date",
        //   width: '150',
        //   sortable: true,
        //   showTooltipWhenOverflow: true
        // },
      ];
    },
    getRejectedColumns(){
       return [
        //  {
        //   name: "rejected_by",
        //   label: "Rejected by",
        //   header_component: null,
        //   cell_component: null,
        //   sortable: true,
        //   width: '130',
        //   showTooltipWhenOverflow: true,
        //   filterOptions: {
        //     enable: true,
        //     filterType: "input",
        //   },
        // },
        {
          name: "approved_by",
          label: "Approvals",
          header_component: null,
          cell_component: "Icon",
          width: '80',
          filterOptions: {
            enable: false
          },
          showTooltipWhenOverflow: false,
          fixed: "right",
          options: {
            iconClass: "mdi mdi-eye-outline view-list",
            iconColorClass: [true],
            eventName: "IDP_APPROVAL_DOCUMENT",
          }
        },
        //  {
        //   name: "rejected_at",
        //   label: "Rejected date",
        //   header_component: null,
        //   cell_component: "Date",
        //   width: '140',
        //   sortable: true,
        //   showTooltipWhenOverflow: true
        // },
      ];
    },
    getConfirmedColumns() {
      return [
        // {
        //   name: "approval_status",
        //   label: "Approval status",
        //   header_component: null,
        //   cell_component: null,
        //   sortable: true,
        //   width: '140',
        //   showTooltipWhenOverflow: true,
        //   filterOptions: {
        //     enable: true,
        //     filterType: "input",
        //   },
        // },
        // {
        //   name: "approved_at",
        //   label: "Approved date",
        //   header_component: null,
        //   cell_component: "Date",
        //   sortable: true,
        //   width: '135',
        //   showTooltipWhenOverflow: true,
        // },
        // {
        //   name: "approved_by",
        //   label: "Approver",
        //   header_component: null,
        //   cell_component: null,
        //   sortable: true,
        //   width: '130',
        //   showTooltipWhenOverflow: true,
        //   filterOptions: {
        //     enable: true,
        //     filterType: "input",
        //   },
        // },
         {
          name: "approved_by",
          label: "Approvals",
          header_component: null,
          cell_component: "Icon",
          width: '80',
          filterOptions: {
            enable: false
          },
          showTooltipWhenOverflow: false,
          fixed: "right",
          options: {
            iconClass: "mdi mdi-eye-outline view-list",
            iconColorClass: [true],
            eventName: "IDP_APPROVAL_DOCUMENT",
          }
        },
      ];
    },
    getPendingApprovalColumns() {
      return [
        // {
        //   name: "approved_at",
        //   label: "Approved date",
        //   header_component: null,
        //   cell_component: "Date",
        //   sortable: true,
        //   width: '135',
        //   showTooltipWhenOverflow: true,
        // },
         {
          name: "approved_by",
          label: "Approvals",
          header_component: null,
          cell_component: "Icon",
          width: '80',
          filterOptions: {
            enable: false
          },
          showTooltipWhenOverflow: false,
          fixed: "right",
          options: {
            iconClass: "mdi mdi-eye-outline view-list",
            iconColorClass: [true],
            eventName: "IDP_APPROVAL_DOCUMENT",
          }
        },
      ];
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
    }
  },
  components: { IdpDataTable, IdpListHeader, IdpTree, DocumentAssign, ApprovalList},
  created() {},
  mounted() {},

  async beforeDestroy(){
      //EventBus.$off(["IDP_APPROVAL_DOCUMENT"]); --
    },
  beforeMount() {
    const user = this.$store.getters.user;
    this.isReviewerOnly= _.get(user,"is_reviewer_only") // return true, if user role is revieweronly
    EventBus.$emit("SET_DOCUMENT_TYPE", Constants.DOCEX.DOCUMENT_TYPES.TRADE_CONFIRM);
    EventBus.$emit("SET_DISPLAY_IDP_TREE", true);
    EventBus.$emit("SET_DISPLAY_IDP_NAVBAR", false);
    const shouldShowApptour = this.$store.getters.shouldShowApptour;
    if (shouldShowApptour && user.is_first_login_attempt) {
      console.log("First login attempt, showing upload apptour!!")
      this.$store.commit("setShowApptour", false);
      EventBus.$emit("show_upload_apptour");
    }
    EventBus.$on("IDP_APPROVAL_DOCUMENT", async (documentId) => {
      this.loading = true;
      this.showContents = true;
      this.documentId = documentId;
    });
    EventBus.$on("HIDE_LOADING", async (hide_loader) => {
        this.loading = !hide_loader;
    });
    EventBus.$on("IDP_ASSIGN_DOCUMENT", async (row) => {
      console.log("IDP_ASSIGN_DOCUMENT event called--->")
      this.showAssignModal=true
      this.assignModalProps=row
   });
    this.findFilter();
    console.log("beforeMount ", this.filter);

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

    this.tableProps.query.storage_folder_path = {
      $regex:
        this.filter && this.filter.folderPath
          ? ".*" + this.filter.folderPath + "$"
          : ".*/*$",
      $options: "i",
    };
    if(this.filter && this.filter.myDocuments ){
       this.tableProps.query.myDocuments = this.filter.myDocuments
    }
    this.tableProps.query = {
      ...(this.tableProps.query || {}),
      ...(this.filter.secondary || {}),
    };

    let renderColumnStages = [Constants.DOCEX.STAGE.CONFIRMED,
                                Constants.DOCEX.STAGE.PUBLISHED,
                                Constants.DOCEX.STAGE.APPROVED,
                                Constants.DOCEX.STAGE.WAITING_FOR_APPROVAL,
                                Constants.DOCEX.STATE_ERRORED.FAILED,
                                Constants.DOCEX.STAGE.APPROVAL_REJECTED,
                                Constants.DOCEX.STAGE.REJECTED
                            ];

    if (renderColumnStages.includes(this.filter.stage) || renderColumnStages.includes(this.filter.state)) {
        this.renderColumns();
    }

     let searchText =
      this.filter.searchText && ("" + this.filter.searchText).trim();
    if (searchText) this.initColumnFilters(searchText);
  },
};
</script>

<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";
.approvalList-modal  {
    .el-dialog {
      padding: 1.7rem;
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
