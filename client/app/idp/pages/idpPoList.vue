<template>
  <main class="kp-main">
    <idp-list-header title="Sales Order" :tableProps="tableProps" :filter="filter"></idp-list-header>
    <div class="page-body">
      <IdpDataTable v-bind="tableProps"></IdpDataTable>
    </div>
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

export default {
  name: "IdpPoList",
  data() {
    return {
      filter: {
        stage: Constants.DOCEX.STAGE.UPLOADED,
      },

      tableProps: {
        multiSelect: true,
         enableDateRangeFilter: true,
                enableCustomerFilter: false,
        minHeight: 600,
        apiName:'/portal/api/table/de_document',
        tableName: "de_document",
        tableIdentifier: "idp_po_list",
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
          active: true,
          document_type: Constants.DOCEX.DOCUMENT_TYPES.PO,
          storage_folder_path: { $regex: ".*/*$" },
        },
        bulkActions:['delete','publish','refresh'],
        actions: [
          {
            name: "download",
            label: "Download",
            icon: "mdi mdi-arrow-down-thin-circle-outline",
            class: null,
            eventName: "IDP_DOWNLOAD_DOCUMENT",
            disableCheckKey: ["state","stage"],
            disableValues: {state:["In progress", "Requested"],stage:["Deleted"]},
          },
           {
            name: "delete",
            icon: "mdi mdi-delete",
            class: null,
            eventName: "IDP_DELETE_DOCUMENT",
            disableCheckKey: ["state","is_multi_documents_present","is_data_deleted"],
            disableValues: {state:["In progress", "Requested","Queued","Pending","Publish in progress","Extracted"],"is_multi_documents_present":[true],"is_data_deleted":[true]},
          
          },
        ],
        columns: [
          {
            header_component: null,
            cell_component: "Dot",
            name: 'Link dot',
            sortable: false,
            width: "10",
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
            width: '160',
            showTooltipWhenOverflow: true,
             filterOptions: {
              enable: true,
              filterType: "input",
            },
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
            name: "customer_name",
            label: "Customer name",
            header_component: null,
            cell_component: null,
             filterOptions: {
              enable: true,
              filterType: "input",
            },
            sortable: true,
            width: '150',
            showTooltipWhenOverflow: true,
          },
          {
            name: "total",
            label: "Total amount",
            header_component: null,
             filterOptions: {
              enable: true,
              filterType: "input",
            },
            cell_component: null,
            sortable: true,
            width: '130',
            showTooltipWhenOverflow: true,
          },
          {
            name: "po_date",
            label: "Order date",
            header_component: null,
            cell_component: null,
            sortable: true,
            width: '140',
            showTooltipWhenOverflow: true,
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
             filterOptions: {
              enable: true,
              filterType: "input",
            },
            cell_component: null,
            sortable: true,
            width: '130',
            showTooltipWhenOverflow: true,
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
            fixed: "right",
            label: "Status",
            header_component: null,
            cell_component: "StatusWrapper",
            sortable: true,
             filterOptions: {
              enable: true,
              filterType: "input",
            },
            showTooltipWhenOverflow: false,
            className:'idp-status-col-container',
            options: {
              retryEvent: "IDP_RETRY",
              detailsEvent: "IDP_DETAILS",
              disableCheckKey: ["is_data_deleted"],
              disableValues: {is_data_deleted:[true]},
            },
          },
        ],
        expandColumns: [
          {
            name: "po_number",
            label: "PO number",
            header_component: null,
            cell_component: null,
          },
          {
            name: "due_amount",
            label: "Due amount",
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
    renderColumns() {
      if (this.filter.stage == Constants.DOCEX.STAGE.CONFIRMED) {
        this.tableProps.columns = _.unionBy(
          this.tableProps.columns,
          this.getConfirmedColumns(),
          "name"
        );
        return;
      }
      if (this.filter.stage == Constants.DOCEX.STAGE.PUBLISHED) {
        this.tableProps.columns = _.unionBy(
          this.tableProps.columns,
          this.getPublishedColumns(),
          "name"
        );
        return;
      }
      if (this.filter.stage == Constants.DOCEX.STAGE.APPROVAL_REJECTED) {
        this.tableProps.columns = _.unionBy(
          this.tableProps.columns,
          this.getRejectedColumns(),
          "name"
        );
      }
      if(this.filter.state == Constants.DOCEX.STATE_ERRORED.FAILED){
          this.tableProps.columns = _.unionBy(
          this.tableProps.columns,
          this.addStageColumn(),
          "name"
        );
        return;
      }
    },
    getPublishedColumns() {
      return [
        {
          name: "reviewed_by",
          label: "Reviewer",
          header_component: null,
           filterOptions: {
              enable: true,
              filterType: "input",
            },
          cell_component: null,
          sortable: true,
          width:'130',
          showTooltipWhenOverflow: true,
        },
        {
          name: "published_by",
          label: "Publisher",
           filterOptions: {
              enable: true,
              filterType: "input",
            },
          header_component: null,
          cell_component: null,
          sortable: true,
          width:'130',
          showTooltipWhenOverflow: true,
        },
      ];
    },
       getRejectedColumns(){
       return [
       
        {
          name: "rejected_by",
          label: "Rejected by",
          header_component: null,
          cell_component: null,
          sortable: true,
          width:'130',
          showTooltipWhenOverflow: true,
          filterOptions: {
            enable: true,
            filterType: "input",
          },
        },
         {
          name: "rejected_at",
          label: "Rejected date",
          width:'140',
          header_component: null,
            cell_component: "Date",
          sortable: true,
          showTooltipWhenOverflow: true
        },
      ];
    },
     addStageColumn(){
      return[
          {
            name: "stage",
            label: "Stage",
            header_component: null,
            cell_component: null,
            sortable: true,
            width:'130',
            filterOptions: {
              enable: true,
            },
            showTooltipWhenOverflow: true
          }
      ]
    },
    getConfirmedColumns() {
      return [
        {
          name: "approval_status",
          label: "Approval status",
           filterOptions: {
              enable: true,
              filterType: "input",
            },
          header_component: null,
          cell_component: null,
          sortable: true,
          width:'140',
          showTooltipWhenOverflow: true,
        },
        {
          name: "approved_at",
          label: "Approved date",
          header_component: null,
          cell_component: null,
          sortable: true,
          width:'130',
          showTooltipWhenOverflow: true,
        },
        {
          name: "approved_by",
          label: "Approver",
           filterOptions: {
              enable: true,
              filterType: "input",
            },
          width:'130',  
          header_component: null,
          cell_component: null,
          sortable: true,
          showTooltipWhenOverflow: true,
        },
      ];
    },
    initColumnFilters(searchText) {
      const columnFilter = DocumentService.getTableColumnFilters({
        searchText,columns:this.tableProps.columns
      });
      this.tableProps.query = {
        ...columnFilter,
        ...(this.tableProps.query || {}),
      };
    },
  },
  components: { IdpDataTable, IdpListHeader, IdpTree },
  created() {},
  mounted() {},
  beforeDestroy() {},
  beforeMount() {
    this.$store.commit("setDocumentType", Constants.DOCEX.DOCUMENT_TYPES.PO);
    this.$store.commit("setDisplayIdpTree",true);
    this.findFilter();
    console.log("beforeMount ", this.filter);
    
    if (
      this.filter.stage == Constants.DOCEX.STAGE.CONFIRMED ||
      this.filter.stage == Constants.DOCEX.STAGE.PUBLISHED ||
      this.filter.stage == Constants.DOCEX.STAGE.APPROVED ||
      this.filter.stage == Constants.DOCEX.STAGE.WAITING_FOR_APPROVAL ||
      this.filter.state == Constants.DOCEX.STATE_ERRORED.FAILED ||
      this.filter.stage == Constants.DOCEX.STAGE.APPROVAL_REJECTED
    ) {
      this.renderColumns();
    }
    
    if(this.filter.stage && this.filter.state != Constants.DOCEX.STATE_UPLOADED.FAILED){
      this.tableProps.query.stage =this.filter.stage;
    } else if (this.filter.state) {
        this.tableProps.query.state = this.filter.state;
    } else{
      this.tableProps.query.stage = {'$in': [Constants.DOCEX.STAGE.UPLOADED,Constants.DOCEX.STAGE.EXTRACTED ]};
    }

     if(this.filter.state == Constants.DOCEX.STATE_ERRORED.FAILED){
      this.tableProps.query && delete this.tableProps.query.stage
    }
    
   this.tableProps.query.storage_folder_path =      
        this.filter && this.filter.folderPath
          ? Constants.DOCEX.DOCUMENT_TYPES.PO + this.filter.folderPath : undefined


    this.tableProps.query = {
      ...(this.tableProps.query || {}),
      ...(this.filter.secondary || {}),
    };

   let searchText =
      this.filter.searchText && ("" + this.filter.searchText).trim();
    if (searchText) this.initColumnFilters(searchText);
  },
};
</script>

<style lang="scss" scoped>
@import "../_idpVariables";
@import "../_idpGlobal";
</style>
