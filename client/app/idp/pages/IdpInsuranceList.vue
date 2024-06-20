<template>
  <main class="kp-main">
    <idp-list-header
      v-if="stageTabConfig"
      title="Insurance Forms"
      :tableProps="tableProps"
      :isPackageType ="customerConfiguration.view==='package'"
      @onCategoryChange="setCategoryParams"
      :selectedCategoryType="selectedCategoryType"
      :filter="filter"
      :isReviewerOnly="isReviewerOnly"
      :stageTabConfig="stageTabConfig"
    ></idp-list-header>    
    <div
      class="page-body package-wrap"
      :class="[
        selectedCategoryType == 'packages' ? 'package-wrap' : 'form_class',
      ]"
    >
      <IdpDataTable
        ref="insuranceDataTableRef"
        :tableProps="tableProps"
        :isReviewerOnly="isReviewerOnly"
        :document_type = "document_type"
      ></IdpDataTable>
    </div>

    <DocumentSelectList
      v-if="displayDocumentSelectDialog"
      :buttonOptions="addToPackageDialogOptions"
      @addDocument="handleAddForm"
      @closeDialog="closeDialog"
      :extraQueryParam="extraQueryParams"
    >
      <div style="text-align: center">
        ---------------------------------- OR -------------------------------
      </div>
      <br />
      <PackageForm
        @closeDialog="closeDialog"
        :customerConfiguration="customerConfiguration"
        :document="selectedForm"
      ></PackageForm>
    </DocumentSelectList>
    <DocumentSubtypeChange
      :params="docSubtypeChangeParams"
      v-if="displayDocSubtypeChageDialog"
      @closeDialog="closeDocSubtypeChangeDialog"
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
import {mapState} from 'vuex';

import DocumentService from "@/idp/services/DocumentService";
import DocumentSelectList from "@/idp/components/DocumentSelectList";
import DocumentSubtypeChange from "@/idp/components/DocumentSubtypeChange";

import PackageForm from "@/idp/components/PackageForm";
import CustomerConfig from "@/idp/services/DeCustomerConfig";
import DocumentPackageService from "@/idp/services/DocumentPackageService";
import UserAccessService from "@/idp/services/UserAccessService";

export default {
  name: "IdpInsuranceList",
  data() {
    return {
      workflowType: "docex",
      showSlide: false,
      showComponentPanel: false,
      document_type : Constants.DOCEX.DOCUMENT_TYPES.INSURANCE,
      isReviewerOnly:false, // this flage is used to check user role is reviwer only or nott
      selectedCategoryType: "documents",
      customerConfiguration: {},
      packageList: {},
      extraQueryParams: {
        type: "package",
        parent_document_id: { $exists: false },
      },
      packageStageMap: {},
      displayDocSubtypeChageDialog: false,
      docSubtypeChangeParams: { selectedId: "", docSubtype: "" },
      documentSubtype: "",
      createPackageForm: {},
      formRules: {
        customer_name: [
          {
            required: true,
            message: "Please enter customer name",
            trigger: "blur",
          },
        ],
        product_name: [
          {
            required: true,
            message: "Please select package name",
            trigger: "change",
          },
        ],
      },
      addToPackageDialogOptions: {
        title: "Select package",
        subTitle: "select package and add to existing forms.",
        submitButtonText: "Add to package",
      },
      displayDocumentSelectDialog: false,
      selectedForm: "",
      bus_events: [
        "open_document_package_form",
        "delete_document_package_item",
        "download_document_package_item",
        "ADD_PACKAGE_ITEM",
      ],
      tableProps: {
        tableConfigLoaded:false,
        readParamsFromUrl: true,
        enableDateRangeFilter: true,
        enableCustomerFilter: false,
        paginationSizes: [5, 15, 25, 50],
        minHeight: 600,
        apiName: `/portal/api/table/de_document`,
        tableName: "de_document",
        tableIdentifier: "idp_insurance_list",
        pushFilterToUrl:true,
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
          document_type: Constants.DOCEX.DOCUMENT_TYPES.INSURANCE,
          storage_folder_path: { $regex: ".*/*$" },
          type: "package",
        },
        bulkActions: ["delete", "publish", "refresh", 'export'],
        actions: [],
        columns: [],
        expandColumns: [],
        inlineActionButtons: [],
        outlineActionButtons: [],
        expandTableParams: {
          type: "package",
          document_type : Constants.DOCEX.DOCUMENT_TYPES.INSURANCE,
          change_reference_column_to : "parent_document_id",
          parameters: {
            readParamsFromUrl: false,
            multiSelect: false,
            enableDateRangeFilter: false,
            enableCustomerFilter: false,
            query: {},
            tableName: "de_document",
            tableIdentifier: "idp_expand_insurance_list",
            sortColumn: "-created_at",
            actions: [
              {
                icon: "mdi mdi-arrow-down-thin-circle-outline",
                eventName: "IDP_DOWNLOAD_DOCUMENT",
                inline: true,
                label: "Download",
                disableCheckKey: ["state", "stage"],
                disableValues: {
                  state: ["In progress", "Requested"],
                  stage: ["Deleted"],
                },
              },
            ],
            rows: [],
          },
        },
        stageTabConfig: []
      },
    };
  },
  computed: {
    isPackageType() {
      const packageStages = [Constants.DOCEX.STAGE.UPLOADED,Constants.DOCEX.STAGE.PUBLISHED,Constants.DOCEX.STAGE.CLOSED];
      return packageStages.includes(this.tableProps.query.stage);
    },
  },
  methods: {
    initActionButtons(){
      let outlineActions = [];
      let inlineActions = [];
      const downloadBtn =  {
        name: "download",
        label: "Download",
        icon: "mdi mdi-arrow-down-thin-circle-outline",
        class: null,
        eventName: "IDP_DOWNLOAD_DOCUMENT",
        disableCheckKey: ["state", "stage"],
        disableValues: { state: ["In progress", "Requested"],stage: ["Deleted"] },
      };
      inlineActions.push(downloadBtn);
      const deleteBtn = {
        name: "delete",
        icon: "mdi mdi-delete",
        label: "Delete document",
        class: null,
        eventName: "IDP_DELETE_DOCUMENT",
        disableCheckKey: ["state","is_multi_documents_present","type","is_data_deleted",],
        disableValues: {
          state: ["In progress","Requested","Queued","Pending","Publish in progress","Extracted",],
          "is_multi_documents_present": [true],
          "type": ["package"],
          "is_data_deleted": [true],
        },
        outline: true,
      }
      outlineActions.push(deleteBtn);
      const changeSubtypeBtn = {
        name: "change_subtype",
        label: "Change subtype",
        icon: "mdi mdi-clipboard-edit-outline",
        class: null,
        eventName: "IDP_CHANGE_SUBTYPE",
        disableCheckKey: ["state","is_multi_documents_present","type","is_data_deleted",],
        disableValues: {
          state: ["In progress","Requested","Queued","Pending","Publish in progress","Extracted"],
          is_multi_documents_present: [true],
          type: ["package"],
          is_data_deleted: [true],
        },
        outline: true,
      }
      outlineActions.push(changeSubtypeBtn);
      this.tableProps.inlineActionButtons = inlineActions;
      this.tableProps.outlineActionButtons = outlineActions;
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

    closeDocSubtypeChangeDialog() {
      this.displayDocSubtypeChageDialog = false;
    },

    closeDialog() {
      this.displayDocumentSelectDialog = false;
      this.$refs.createPackageForm &&
      this.$refs.createPackageForm.resetFields();
    },
    handleClose() {},
    async handleAddForm(document) {
      try {
        const isValidFormSubtype = DocumentPackageService.isValidFormSubtype(
          this.customerConfiguration,
          document.package_type,
          this.selectedForm.document_subtype
        );
        if (!isValidFormSubtype) {
          this.notifyError(
            "Selected document is not allowed to be added in this package as per config.Please change subtype of document if you still want to add in this package."
          );
          return;
        }

        let flag = await this.$confirm(
          `Are you sure you want to add selected form to package ${document.file_name}?`,
          "Confirmation",
          {
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        ).catch((error) => false);
        if (!flag) return;
        //do we need to change applicant_name as well?
        const payload = {
          parent_document_id: document._id, // child
          _id: this.selectedForm._id,
          type: "package",
        };
        const resp = await DocumentService.find({
          parent_document_id: document._id,
          type: "package",
          document_subtype: this.selectedForm.document_subtype,
        });
        if ((resp || []).length > 0) {
          this.notifyError(
            `Form with subtype ${this.selectedForm.document_subtype} alreadty exist.`
          );
          return;
        }
        await DocumentService.update(payload);
        this.displayDocumentSelectDialog = false;
        this.notifySuccess("Document added succesfully");
      } catch (err) {
        console.log(err);
      }
    },
  
    setUrlFilter() {
      try {
        this.filter = JSON.parse((this.$route && this.$route.query && this.$route.query.filter) || "{}");
      } catch (err) {
        this.filter = {};
      }
      return this.filter;
    },
    initColumnFilters(searchText) {
      let columnFilter = DocumentService.getTableColumnFilters({
        searchText,
        columns: this.tableProps.columns,
      });
      columnFilter = { $and: [columnFilter] }    
      this.tableProps.query = {
        ...columnFilter,
        ...(this.tableProps.query || {}),
      };
    },
    handleCloseAssignmentDialog(isTableRefreshRequired) {
      this.showAssignModal = false;
      if (!isTableRefreshRequired) return;
      this.showDatatable = false;
      this.$nextTick(() => {
        this.showDatatable = true;
      });
    },
    handleDocumentPackageDialog(showDialog) {
      this.displayDocumentSelectDialog = showDialog;
      // If dialog is hidden then empty addPackageData
      if (!showDialog) {
        this.selectedForm = "";
      }
    },
    registerEvents() {
      EventBus.$on("ADD_PACKAGE_ITEM", async (row) => {
        this.selectedForm = row;
        this.handleDocumentPackageDialog(true);
      });

      EventBus.$on("IDP_CHANGE_SUBTYPE", async (row) => {
        this.handleSubtypeChange(row);
      });
    },

    handleSubtypeChange(row) {
      this.displayDocSubtypeChageDialog = true;
      this.docSubtypeChangeParams = {
        selectedId: row._id,
        docSubtype: row.document_subtype,
      };
    },

    deRegisterEvents() {
      EventBus.$off(this.bus_events);
    },
    async getConfiguration() {
      this.customerConfiguration = await CustomerConfig.getCustConfigByDocType(Constants.DOCEX.DOCUMENT_TYPES.INSURANCE);
      this.packageList = this.customerConfiguration.package;
    },
    async setTableColumns() {
      if (!this.isPackageType) {
        this.selectedCategoryType = "documents";
      }
      var queryParams = {
        document_type: Constants.DOCEX.DOCUMENT_TYPES.INSURANCE,
        stage: this.tableProps.query.stage || this.tableProps.query.state,
        category: this.selectedCategoryType,
      };
      const tableConfigResponse = await DocumentService.getTableConfig(queryParams);
      let columns = tableConfigResponse.columns.data;
      if (this.selectedCategoryType == "packages") {
        columns = this.filterPackageColumns(columns);
      }
      this.tableProps.columns = columns;
      this.selectedCategoryType == "packages" && await this.setExpandColumns();
    },

    filterPackageColumns(columns) {
      delete this.tableProps["actions"];
      // This removes the actions colums from IDPDataTable, as we don't need
      // action buttons in case of packages
      delete this.tableProps.inlineActionButtons;
      delete this.tableProps.outlineActionButtons;
      const filteredColumns = columns.filter((col) => !Constants.DOCEX.PACKAGE_EXCLUDE_COLUMNS.includes(col.name));
      return filteredColumns;
    },

    async setExpandColumns() {
      const queryParams =  {
          document_type: Constants.DOCEX.DOCUMENT_TYPES.INSURANCE,
          stage: this.tableProps.query.stage || this.tableProps.query.state,
          category: "documents",
      }
      const columnsData = await DocumentService.getTableConfig(queryParams)
      let tableProps = _.cloneDeep(this.tableProps);
      tableProps.expandTableParams.parameters.columns = columnsData.columns.data;
      this.tableProps = tableProps;

    },

    async init() {
      //Get tab configuration based on document type
      this.stageTabConfig = await UserAccessService.getTabConfig(this.document_type);
      this.setTableProps();
      await this.setTableColumns();
      this.tableProps.tableConfigLoaded = true;
    },

    setTableProps() {
      this.setUrlFilter();
      if (
        this.filter.stage &&
        this.filter.state != Constants.DOCEX.STATE_UPLOADED.FAILED
      ) {
        this.tableProps.query.stage = this.filter.stage;
      } else if (this.filter.state) {
        this.tableProps.query.state = this.filter.state;
      } else {
        this.tableProps.query.stage = Constants.DOCEX.STAGE.UPLOADED;
      }
      if (this.filter.state == Constants.DOCEX.STATE_ERRORED.FAILED) {
        this.tableProps.query && delete this.tableProps.query.stage;
      }

     this.tableProps.query.storage_folder_path =      
        this.filter && this.filter.folderPath
          ? Constants.DOCEX.DOCUMENT_TYPES.INSURANCE + this.filter.folderPath : undefined

      this.tableProps.query = {
        ...(this.tableProps.query || {}),
        ...(this.filter.secondary || {}),
      };

      let searchText =
        this.filter.searchText && ("" + this.filter.searchText).trim();
      if (searchText){
        this.initColumnFilters(searchText);
      }

      if (this.isPackageType) {
        const category = this.filter.category;
        this.isMultiSelect = category == "documents" ? true : false;
        this.tableProps.multiSelect = this.isMultiSelect;
        this.setCategoryParams(category);
        return;
      }
      this.clearTableProps();
    },

    clearTableProps() {
      this.tableProps.query && delete this.tableProps.query.type;
    },

    setCategoryParams(selectedType) {
      delete this.tableProps.query.parent_document_id;
      const categoryType =
        selectedType ||
        _.get(this.filter[this.tableProps.tableIdentifier], "packageType") ||
        "packages";
      categoryType
        ? (this.tableProps.expandTableParams.type = categoryType)
        : (this.tableProps.expandTableParams.type = "packages");
      this.selectedCategoryType = this.tableProps.expandTableParams.type;
      const selectedPackageType =
        Constants.DOCEX.IDP_DOCUMENT_CATEGORIES_FILTERS[categoryType] ||
        Constants.DOCEX.IDP_DOCUMENT_CATEGORIES_FILTERS["packages"];
      this.tableProps.query = {
        ...this.tableProps.query,
        ...selectedPackageType,
      };
    },
  },
  components: {
    DocumentSelectList,
    IdpDataTable,
    IdpListHeader,
    IdpTree,
    PackageForm,
    DocumentSubtypeChange,
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  beforeMount() {
    this.isReviewerOnly= _.get(this.$store.getters.user,"is_reviewer_only") // return true, if user role is revieweronly
    // IMPORTANT: this initActionButtons is temporary and will be replaced by dynamic actions and buttons
    this.initActionButtons()
    this.init();
    this.registerEvents();
    this.getConfiguration();
    this.$store.commit("setDocumentType", Constants.DOCEX.DOCUMENT_TYPES.INSURANCE);
    this.$store.commit("setDisplayIdpTree",true);
  },
};
</script>

<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";

.package-wrap {
  .el-table--enable-row-transition .el-table__body td.el-table__expanded-cell {
    border: 2px solid var(--brand-05) !important;
    border-top: 0 !important;
    // .doc-package-icon-container {

    // }
  }
  .el-table--enable-row-transition .el-table__body tr.expanded td {
    background: var(--white) !important;
    border-top: 2px solid var(--brand-05) !important;
    border-bottom: 0 !important;
    // border-radius: 0 0 var(--radius-base) var(--radius-base) !important;col
    .folder-closed {
      color: var(--brand-06);
    }
  }
  .el-table--enable-row-transition .el-table__body tr.expanded td:first-child {
    border-left: 2px solid var(--brand-05) !important;
  }
  .el-table--enable-row-transition .el-table__body tr.expanded td:last-child {
    border-right: 2px solid var(--brand-05) !important;
  }
}

.saperator {
  display: flex;
  flex-direction: row;
  width: 150px;
  margin: 0 auto;
  font-weight: 100;
  padding: 1.5rem 0;
}

.saperator:before,
.saperator:after {
  content: "";
  flex: 1 1;
  border-bottom: 1px solid var(--dark-08);
  margin: auto;
}
.saperator:before {
  margin-right: 10px;
}
.saperator:after {
  margin-left: 10px;
}

.inbox-child-stage {
  text-align: center;
  margin-top: 1rem;

  .el-radio__input {
    display: none !important;
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
}

.insurance-document-dialog {
  .create-package-button {
    margin-left: 7%;
    margin-top: 0.7%;
  }
  .dialog-title {
    font-size: var(--font-pagetile);
    color: var(--dark-01);
    font-weight: normal;
    margin-left: 1.2rem;
    display: inline-block;
  }
  .dialog-subtitle {
    color: var(--dark-05);
    margin-left: 1.5rem;
    font-size: 1.15rem;
    font-weight: 300;
  }
}
.create-package-form-wrap {
  margin-top: 1rem;
}
</style>
