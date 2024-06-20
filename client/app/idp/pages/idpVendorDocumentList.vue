<template>
  <main class="kp-main vendor-kp-main">
    <idp-vendor-list-header :title="getTitle" :key="tableProps.tableConfigLoaded" :tableProps="tableProps" :filter="filter"></idp-vendor-list-header>
    <div class="page-body">
      <IdpDataTable title="" :tableProps="tableProps"></IdpDataTable>
    </div>
  </main>
</template>

<script>
import IdpDataTable from "../table/IdpDataTable";
import IdpVendorListHeader from "./idpVendorListHeader.vue";
import Constants from "@/resources/Constants";
import _ from "lodash";
import DocumentService from "@/idp/services/DocumentService";
import {mapState} from 'vuex';

export default {
  name: "IdpVendorDocumentList",
  data() {
    return {
      filter: {
        stage: Constants.DOCEX.STAGE.VENDOR_PENDING,
      },
      tableProps: {  
        tableConfigLoaded: false,
        readParamsFromUrl: true,
        // multiSelect: true,
        enableDateRangeFilter: true,
        enableCustomerFilter: false,
        enableGroupFilter:true,
        minHeight: 600,
        paginationSizes:[5, 15, 25,50],
        tableName: "de_document",
        tableIdentifier: "idp_"+this.document_type+"_list",
        apiName:'/portal/api/table/de_document',
        sortColumn: "-invoice_date",
        select : '',
        excludeFields: [
          "prediction",
          "ocr_result",
          "workflow_data",
          "messages",
          "br_field_config",
          "display_fields",
        ],
        query: {
          stage: Constants.DOCEX.STAGE.VENDOR_PENDING,
          active: true,
          document_type: this.document_type,
          storage_folder_path: { $regex: ".*/*$" }
          ,
          "$or": [{file_type: {$ne: Constants.DOCEX.DOCUMENT_FILETYPES.EXCEL}},{"$and":[{file_type: Constants.DOCEX.DOCUMENT_FILETYPES.EXCEL  },{parent_document_id :{$exists : false}}]}]
        },
        bulkActions:['refresh', 'export'],
        actions: [
          {
            name: "download",
            label: "Download",
            icon: "mdi mdi-arrow-down-thin-circle-outline",
            class: null,
            eventName: "IDP_DOWNLOAD_DOCUMENT",
            disableCheckKey: ["state", "stage"],
            disableValues: { state: ["In progress", "Requested", "Queued", "Pending"], stage: ["Deleted", "Published", "Paid"] },
          }
        ],
        columns: [],
        expandColumns: [],
        expandTableParams:{}
      },
     
    };
  },
  computed: {
      ...mapState({
            documentId : "documentId",
            loading : "showLoader"
            }),
      getTitle(){
            let title= "";
            title = this.document_type && this.document_type.charAt(0).toUpperCase() + this.document_type.slice(1)
            return title;
        },
  },
  methods: {
     
    init() {
        this.document_type = this.$route.params.documentType || "invoice";
        this.tempTableProps.query.document_type = this.document_type;

        this.$store.commit("setDocumentType", this.document_type);
        this.$store.commit("setDisplayIdpTree",false);
        this.$store.commit("setDisplayIdpNavbar",false);
    },
    setQuery(){
        // Update filter stage & state in table prop query
        this.tempTableProps.tableIdentifier = `idp_${this.document_type}_list`;

        if(this.filter.stage) {
            this.tempTableProps.query.stage = this.filter.stage;
        } 
        else if (this.filter.state) {
            this.tempTableProps.query.state = this.filter.state;
        }
        else {
            this.tempTableProps.query.stage = Constants.DOCEX.STAGE.VENDOR_PENDING;
        }
        if(this.filter.state == Constants.DOCEX.STATE_ERRORED.FAILED) {
            this.tempTableProps.query && delete this.tempTableProps.query.stage
        }
        //Update invoice type in tableprop query
        this.filter.invoice_type && (this.tempTableProps.query.invoice_type = this.filter.invoice_type);
        this.tempTableProps.query.storage_folder_path =      
            this.filter && this.filter.folderPath
            ? this.document_type + this.filter.folderPath : undefined

        this.tempTableProps.query = { ...(this.tempTableProps.query || {}), ...(this.filter.secondary || {}) };
    },

    findFilter() {
        try {
            this.filter = JSON.parse((this.$route && this.$route.query && this.$route.query.filter) || "{}");
        } catch (err) {
            this.filter = {};
        }
        return this.filter;
    },        

    //to set columns
    async setTableColumns() {
        // getting stage from url filter or stage map config else getting it from constant.
        const queryParams = {
            document_type: this.document_type,
            stage: this.filter.stage || this.filter.state || Constants.DOCEX.STAGE.VENDOR_PENDING,
            category: "documents",
        };
        const columnsData = await DocumentService.getTableConfig(queryParams);
        this.tempTableProps.columns = columnsData.columns.data;
        //Get all column Names
        let allColumnsNames  = columnsData.projection_columns_names;
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
 
    }
  },
  components: { IdpDataTable, IdpVendorListHeader},
  async beforeMount() {
    this.tempTableProps =_.cloneDeep(this.tableProps)
    
    // To initialise document type, store,event
    this.init();

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
    this.tempTableProps.tableConfigLoaded = true
    this.tableProps = this.tempTableProps
  },
};
</script>

<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";
  .idp-icon-container span.view-list {
    font-size: 1.5rem;
    transition: .25s all ease-in-out;
    cursor: pointer;
      &:hover {
        font-size: 1.69rem;
        color: var(--green-05);
      }
  }

  .vendor-kp-main {
	  padding-left: 2.3rem !important;
  }
</style>
