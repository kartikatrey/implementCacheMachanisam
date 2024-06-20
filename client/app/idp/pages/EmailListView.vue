<template>
  <main class="kp-main">

    <!-- HEADER -->
    <idp-list-header :title="emailViewTitleByDocType" :tableProps="tableProps"
      :isReviewerOnly="isReviewerOnly" :filter="filter"></idp-list-header>

    <!-- EMAIL VIEW TABLE -->
    <div class="page-body email-view-page">
      <IdpDataTable ref="insuranceDataTableRef" :tableProps="tableProps" :isReviewerOnly="isReviewerOnly"
        :document_type="document_type"></IdpDataTable>
    </div>

    <!-- EMAIL VIEW DETAILS POP UP -->
    <EmailDetailsDialog :documentType="document_type" :emailRecord="currentSelectedEmail"
      :showEmailDetailsDialog="showEmailDetailsPopUp" @closeDialog="closeEmailDetailsPopup"></EmailDetailsDialog>

  </main>
</template>

<script>
import _ from "lodash";
import EventBus from "@/EventBus";
import IdpDataTable from "../table/IdpDataTable";
import IdpListHeader from "./idpListHeader.vue";
import Constants from "@/resources/Constants";
import IdpTree from "@/idp/components/IdpTree.vue";
import EmailDetailsDialog from "@/idp/components/EmailDetailsPopup.vue";
import DocumentService from "@/idp/services/DocumentService";
import CustomerConfig from "@/idp/services/DeCustomerConfig";

export default {
  name: "EmailListView",
  data() {
    return {
      isReviewerOnly: false,
      showEmailDetailsPopUp: false,
      currentSelectedEmail: null,
      busEvents: [],
      document_type: "",
      tableProps: {
        tableConfigLoaded: false,
        readParamsFromUrl: true,
        enableDateRangeFilter: false,
        enableCustomerFilter: false,
        paginationSizes: [5, 15, 25, 50],
        minHeight: 600,
        apiName: `/portal/api/table/de_processed_email`,
        tableName: "de_processed_email",
        tableIdentifier: "idp_document_list",
        pushFilterToUrl: true,
        sortColumn: "-created_at",
        isRestify: true,
        query: {
          subject: { $exists: true }
        },
        columns: [],
        expandColumns: [],
        inlineActionButtons: [
          {
            name: "emailView",
            label: "Email Details",
            icon: "mdi-email-outline",
            class: null,
            eventName: "IDP_VIEW_EMAIL_DETAILS",
          }
        ],
        outlineActionButtons: [],
        expandTableParams: {
          type: "email",
          extraFilter : {
             "$or": [{ file_type: { $ne: Constants.DOCEX.DOCUMENT_FILETYPES.EXCEL }, document_type: { $nin: Constants.DOCEX.OTHER_DOC_TYPES } }, { "$and": [{ file_type: Constants.DOCEX.DOCUMENT_FILETYPES.EXCEL }, { parent_document_id: { $exists: false } }] }]
          },
          document_type: this.document_type || Constants.DOCEX.DOCUMENT_TYPES.INVOICE,
          change_reference_column_to : "email.id",
          parameters: {
            paginationSizes: [5, 15, 25, 50],
            limit : 10,
            readParamsFromUrl: false,
            multiSelect: false,
            enableDateRangeFilter: false,
            enableCustomerFilter: false,
            query: {},
            tableName: "de_document",
            tableIdentifier: "idp_expand_document_list",
            sortColumn: "-created_at",
            actions: [],
            rows: [],
          },
        }
      },
    };
  },
  components: {
    IdpDataTable,
    IdpListHeader,
    IdpTree,
    EmailDetailsDialog,
  },
  computed: {
    emailViewTitleByDocType(){
      return _.startCase(this.document_type) + " - Emails";
    }
  },
  methods: {
    initColumnFilters(searchText) {
      let columnFilter = DocumentService.getTableColumnFilters({
        searchText,
        columns: _.get(this.tableProps, "columns",[])
      });
      columnFilter = { $and: [columnFilter] }
      this.tableProps.query = {
        ...columnFilter,
        ...(this.tableProps.query || {}),
      };
    },

    async setExpandColumns() {
      const queryParams = {
        document_type: this.document_type,
        stage: Constants.DOCEX.STAGE.UPLOADED,
        category: "documents",
      }
      const columnsData = await DocumentService.getTableConfig(queryParams)
      let tableProps = _.cloneDeep(this.tableProps);
      tableProps.expandTableParams.parameters.columns = _.get(columnsData, "columns.data", []);
      this.tableProps = tableProps;

    },

    async setTableColumns() {
      var queryParams = {
        document_type: this.document_type,
        stage: Constants.DOCEX.STAGE.UPLOADED,
        tableName: "de_processed_email"
      };
      const tableConfigResponse = await DocumentService.getTableConfig(queryParams);
      let columns = _.get(tableConfigResponse, "columns.columns", []);
      this.tableProps.columns = columns;
      let searchText = _.get(this.filter, "searchText", "").trim();
      if (searchText){
        this.initColumnFilters(searchText);
      }
      await this.setExpandColumns();
    },

    initBulkActions(){
      let bulkActions = ['refresh'];
      this.tableProps.bulkActions = bulkActions;
    },

    // Setting the type in expandTableParams to retrieve the document after
    // clicking on the expand icon, based on the email ID.
    setTableProps() {
      this.tableProps.expandTableParams.type = "email"
    },

    setUrlFilter() {
      try {
        this.filter = JSON.parse((this.$route && this.$route.query && this.$route.query.filter) || "{}");
      } catch (err) {
        this.filter = {};
      }
    },

    /**
     * Initializes the component by setting up necessary configurations, filters, and table columns.
     * This function is typically called when the component is created or when its state needs to be refreshed.
     */
    async init() {
      // Initialize bulk actions for the table.
      this.initBulkActions();

      // Set filters based on the URL query parameters.
      this.setUrlFilter();

      // Set up the table properties, including expandable table parameters.
      this.setTableProps();

      // Fetch and set the table columns based on the document type and stage.
      await this.setTableColumns();

      // Mark that the table configuration is loaded, allowing the component to render.
      this.tableProps.tableConfigLoaded = true;
    },

    closeEmailDetailsPopup() {
      this.showEmailDetailsPopUp = false;
    },

    registerEvents() {
      this.busEvents = ["IDP_VIEW_EMAIL_DETAILS"];

      EventBus.$on("IDP_VIEW_EMAIL_DETAILS", (selectedEmailRecord) => {
        this.showEmailDetailsPopUp = true;
        this.currentSelectedEmail = selectedEmailRecord;
      })
    },

    destroyEvents() {
      EventBus.$off(this.busEvents);
    }
  },
  async beforeMount(){
    // Extract the document type from the route parameters, defaulting to "invoice" if not specified.
    this.document_type = this.$route.params.documentType || "invoice"

    const docTypeConfig = await CustomerConfig.getCustConfigByDocType(this.document_type);

    // Check if the email view is enabled for the current document type
    const isEmailViewEnabled = _.get(docTypeConfig, "enable_email_view");

    // If the user navigated from the email view and the email view feature is disabled,
    // clicking on invoices should render the invoice page after a refresh.
    // Therefore, check here if the email view is disabled; if so, render the invoice list only.
    if(!isEmailViewEnabled){
      this.$router.push({ path:`/idp/document/${this.document_type}` });
      return;
    }
  },
  async mounted() {
    this.isReviewerOnly = _.get(this.$store.getters.user, "is_reviewer_only");
    this.registerEvents();
    await this.init();
    this.$store.commit("setDocumentType", this.document_type);
    this.$store.commit("setDisplayIdpTree", true);
  },
  beforeDestroy() {
    this.destroyEvents();
  },
};
</script>

<style lang="scss">

@import "../_idpVariables";
@import "../_idpGlobal";

.email-view-page{
  .expand-container{
    .idp-table-container{
      left: 16px;
      position: relative;
    }
  }
}
</style>
