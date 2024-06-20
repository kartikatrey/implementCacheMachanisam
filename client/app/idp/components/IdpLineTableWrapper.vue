<template>
  <div class='line-item-section Insurance-package'>

    <span class="mdi mdi-alert-circle-outline line-item-error-icon"   v-if="errorCount>0"></span>
    <p class="line-item-error"  v-if="errorCount">{{errorMessage}}</p>

    <el-button class="line-item-button" icon="mdi mdi-chevron-up" v-if="!isLineItemVisible" @click="showLineItems"></el-button>
    <el-button class="line-item-button" icon="mdi mdi-chevron-down" v-if="isLineItemVisible" @click="hideLineItems"></el-button>

    <el-tabs type="border-card" @tab-click="handleTabClick">
      <el-tab-pane :label="lineItemTitle" v-if="!isMultiTable" class="line-item-tab" >
        <SingleLineItem
          :lineItemTableParams="lineItemTableParams"
          :docData="docData"
          :key="LineItemsState"
          @handleImportLineItems="importLineItem"
          @handleExportLineItems="exportLineItem"
          @setFieldConfigsForRows="handleSetFieldConfigForRows"
          @reloadBoundingBox="reloadBoundingBox"
          ref="SingleLineItem"
        />
      </el-tab-pane>

      <el-tab-pane  v-if="isMultiTable" :label="lineItemTitle" class="line-item-tab" >
          <MultiLineItem
            :lineItemTableParams="lineItemTableParams"
            :docData="docData"
            :key="LineItemsState"
            @handleImportLineItems="importLineItem"
            @handleExportLineItems="exportLineItem"
            @setFieldConfigsForRows="handleSetFieldConfigForRows"
            @reloadBoundingBox="reloadBoundingBox"
            ref="MultiLineItem"
          />
      </el-tab-pane>
      <el-tab-pane :label="auditLogsLabel" :disabled="isPaneDisabled('activity')" class="line-item-tab" v-if="showAuditAndActivityTabs">
        <div>
          <data-table
            :class="line-table"
            :key="'auditLogsTable'"
            :isDocumentReadOnly="isDocumentReadOnly"
            :parameters="auditLogsTable"
            ref="auditLogsTable">
          </data-table>
        </div>
      </el-tab-pane>

      <el-tab-pane :label="approvalTabLabel" :disabled="isPaneDisabled('approval-tab')" v-if="isApprovalEnable" class="line-item-tab">
        <approval-list
          ref="approvalList"
          :documentId="documentId"
          :className="'line-table'" >
        </approval-list>
      </el-tab-pane>

      <el-tab-pane :label="assignmentHistoryLabel" :disabled="isPaneDisabled('assignment-history')" class="line-item-tab">
        <AssignmentHistoryList
          ref="assignmentHistoryList"
          :documentId="documentId"
          :className="'line-table'"
        />
      </el-tab-pane>

      <el-tab-pane :label="activityTabLabel" class="line-item-tab" name="activityLogger" v-if="showAuditAndActivityTabs">
      </el-tab-pane>
    </el-tabs>
    <upload
      v-if="showUploadDialog"
      @uploadCompleted="handleUploadCompleted"
      :parameters="fileUploadParameters"
      :data="lineItemUploadParams"
      :dialogShow.sync="showUploadDialog"
      @closeDialog="showUploadDialog = false">
    </upload>
  </div>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import MultiLineItem from "@/idp/components/MultiLineItem";
import SingleLineItem from "@/idp/components/SingleLineItem"
import ApprovalList from "@/idp/components/ApprovalList";
import AssignmentHistoryList from "@/idp/components/AssignmentHistoryList";
import _ from "lodash";
import Constants from "@/resources/Constants";
import { mapState } from "vuex";
import Upload from "@/components/Upload";

export default {
  name: "IdpLineTableWrapper",
  props: [ "isDocumentReadOnly", "handleSetFieldConfigForRows", "reloadBoundingBox" ],
  components: {
    DataTable,
    SingleLineItem,
    MultiLineItem,
    ApprovalList,
    Upload,
    AssignmentHistoryList
  },

  data() {
    return {
      docData: {
        isDocumentReadOnly: this.isDocumentReadOnly,
        documentId: this.documentId,
        documentType: this.documentType
      },
      activityTabLabel:"ACTIVITY LOGGER",
      assignmentHistoryLabel: "ASSIGNMENT HISTORY",
      auditLogsTable: {
        apiName: `/portal/api/table/de_audit_log`,
        queryParam: {
          document_id: this.$store.getters["documentViewStore/documentId"],
        },
        tableName: "audit_logs",
        enableExport: false,
        tableMaxHeight: "140px",
        showPaginationOptions: false,
        showTableToolbar: false,
        showSortOptions: false,
        fixedHeader: false,
        theme: "mytheme",
        isRestify: true,
        limit: 50,
        headerWidget: [],
      },
      auditLogsLabel: "AUDIT HISTORY",
      approvalTabLabel: "APPROVALS",
      showUploadDialog: false,
      fileUploadParameters: {
        endpoint: "/portal/api/import-line-item",
        title: "Upload",
        valid_file_types: Constants.DOCEX.SPREADSHEET_VALID_FILETYPES
      },
      lineItemUploadParams: {},
      LineItemsState : 0
    }
  },
  computed: {
    ...mapState("documentViewStore", {
      isLineItemVisible: state => state.isBottomPaneVisible,
      isApprovalEnable: state => state.isApprovalEnable,
      isLineItemRefreshed: state => state.isLineItemRefreshed,
      documentId: state => state.documentId
    }),

    documentType(){
      console.log("computed::IdpLineTableWrapper:documentType");
      return this.$store.getters["documentViewStore/documentType"];
    },

    documentSubtype(){
      console.log("computed::IdpLineTableWrapper:documentSubtype");
      return this.$store.getters["documentViewStore/documentSubtype"];
    },

    lineItemTableParams(){
      console.log("computed::IdpLineTableWrapper:LineItemTableParams");
      return this.$store.getters["documentViewStore/tableParams"];
    },

    isMultiTable() {
      console.log("computed::IdpLineTableWrapper:isMultiTable");
      return this.$store.getters["documentViewStore/isMultiTable"];
    },

    errorCount() {
      console.log("computed:IdpLineTableWrapper:errorCount")
      return this.lineItemTableParams.error_count;
    },

    errorMessage() {
      console.log("computed:IdpLineTableWrapper:errorMessage")
      if (this.errorCount > 0) {
        return `There are ${this.errorCount} errors. Please fix them.`;
      }
      return `There is ${this.errorCount} error. Please fix them.`;
    },

    lineItemTitle() {
      console.log("computed:IdpLineTableWrapper:lineItemTitle")
      if (this.isMultiTable) {
        return `LINE ITEMS`
      }
      let recordCount = 0;
      if (_.isArray(this.lineItemTableParams.rows)) {
        recordCount = this.lineItemTableParams.rows.length
      }
      return `LINE ITEMS (${recordCount})`;
    },

    showAuditAndActivityTabs() {
      console.log("computed:IdpLineTableWrapper:showAuditAndActivityTabs")
      let isDeveloper = false
      let user = this.$store.getters.user;
      if (user.roles.includes(Constants.DOCEX.ROLES_MAP.IDP_DEVELOPER)) {
        isDeveloper = true;
      }
      return isDeveloper;
    }

  },
  updated() {
    console.log("IdpLineTableWrapper:: updated")
  },
  methods: {
    /* Refresh Vue good tables */
    refreshLineItems() {
      const { is_multi_table : isMultiTable, table_index : tableIndex } = this.lineItemUploadParams;
      if (isMultiTable && _.isNumber(tableIndex)) {
        this.$refs.MultiLineItem.refreshDataTable(tableIndex);
      } else {
        this.$refs.SingleLineItem.refreshDataTable();
      }
    },
    handleUploadCompleted(response) {
      this.$store.commit("documentViewStore/setIsLoadCanvas", false);
      this.$store.commit("documentViewStore/setPredictionData", response.updatedPredictionData);

      this.$emit('refreshLineItem');

      /* Refresh Line Items after tableParams are committed in the store */
      this.$nextTick(()=>{
        this.showUploadDialog = false;
      })
    },
    async importLineItem(tableData) {
      try {
        if (this.hasDataChanged()) {
          await this.notifyConfirm("You have changed something and data will be lost. Do you want to continue?", "Yes")
        }
        this.showUploadDialog = true;
        this.lineItemUploadParams.document_id = this.documentId;
        this.lineItemUploadParams.doc_type = this.documentType;
        this.lineItemUploadParams.doc_subtype = this.documentSubtype;
        // Set the table_name and is_multi_table parameter in lineItemUploadParams to the current tableData's table_name
        if (this.isMultiTable) {
          this.lineItemUploadParams.table_name = tableData.tableName;
          this.lineItemUploadParams.is_multi_table = true;
          this.lineItemUploadParams.table_index = tableData.table_index;
        }
      } catch (error) {
        console.error(error.message);
      }
    },
    async exportLineItem(params) {
      if (this.hasDataChanged()) {
        return this.notifyError("Please save the data before proceeding");
      }

      let downloadURL = "";
      if (this.isMultiTable) {
        const { tableName, tableIndex } = params;
        downloadURL = `${window.location.origin}/portal/api/export-line-item?document_id=${this.documentId}&doc_type=${this.documentType}&doc_subtype=${this.documentSubtype}&table_index=${tableIndex}&table_name=${tableName}&is_multi_table=${true}`;
      }
      else {
        downloadURL = `${window.location.origin}/portal/api/export-line-item?document_id=${this.documentId}&doc_type=${this.documentType}`;
      }
      window.open(downloadURL, "_self");
    },
    addLineItemRow(data) {
      this.$emit('addRow', data);
    },
    deleteAllLineItems(data) {
      this.$emit('deleteLineItemsInTable', data);
    },
    hasDataChanged() {
      return this.$store.getters["documentViewStore/hasDataChanged"];
    },
    toggleImportExportLinks() {
      /*
        First condition : If there are action buttons & action button should be 'save draft' than only can able to export/import.
        Second condition : Is there are rows in line item table or there are headers without rows ie-columns than can able to export/import.
        If there are only column will export empty excel file just with columns that user can import it with rowdata.
      */
      if (this.lineItemTableParams.rows.length > 0 || this.lineItemTableParams.columns.length > 1) {
        return this.$store.getters["actionButtonStore/isSaveActionEnabled"]
      }
      return false;
    },
    refreshAuditAndActivityTab() {
      //  this.$refs.activityTable && this.$refs.activityTable.refreshTable();
      this.$refs.auditLogsTable && this.$refs.auditLogsTable.refreshTable();
      this.$refs.brLogTable && this.$refs.brLogTable.refreshTable();
      this.$refs.approvalList && this.$refs.approvalList.refreshApprovalList();
      this.$refs.assignmentHistoryList && this.$refs.assignmentHistoryList.refreshAssignmentHistoryList();
    },
    hideLineItems() {
      this.$store.commit("documentViewStore/minimizeLineItem");
    },
    showLineItems() {
      this.$store.commit("documentViewStore/maximizeLineItem");
    },
    handleTabClick(tab, event) {
      this.showActivityViewer = false;
      if(tab.name == "activityLogger"){
        this.showActivityViewer = true;
        const location = `${window.location.origin}/idp/activity-logger`;
        window.open(`${location}?documentId=${this.documentId}`, "_blank");
        return;
      }
      this.$store.commit("documentViewStore/maximizeLineItem");
    }
  },
};
</script>

<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";

.disabled-link{
        cursor: not-allowed;
        opacity: 0.5;
        pointer-events: none;
        text-decoration: none;
        color: grey;
}

.el-link.el-link--default {
    color: #5f8fdf;
}
.line-item-section{
  .line-item-button{
    color: rgb(76, 81, 191);
    border-radius: 0.25rem;
    font-weight: 400;
    border: 0;
    float: right;
    position: absolute;
    top: 0;
    padding: 0px;
    right: 0;
    z-index: 99;
    background: var(--white);
    font-size: 1.9rem;
    background: transparent;
    &:hover {
      background:transparent;
    }
}
  width: 100%;
  position:relative;
  height: 100%;
  background: var(--white);
    .el-tabs--border-card .el-tabs__header .el-tabs__item.is-active {
      color: var(--brand-04);
    }
    .el-tabs__nav-scroll {
      height: var(--space-xl);
    }
    .el-tabs__nav {
      padding-left: 0.75rem;
    }
    .el-tabs__item {
      top:-0.25rem;
      color:var(--black);
      padding:0 0.75rem;
    }
     .el-tabs__item:first-child {
       border-left: 0;
       padding-left: .4rem;
     }

    .el-tabs__nav-wrap{
      background:  var(--white);
    }
    .el-tabs--border-card > .el-tabs__content {
      padding: 0;
    }
    .el-tabs--border-card{
      width: 100%;
      box-shadow: unset;

      .el-tabs__header .el-tabs__item{
        height: 31px;
        line-height: 31px;
        color: black;
            font-size: var(--font-sm);;

      }
    }
    .import-export-link-grp
      {
        display: flex;
        justify-content: right;
        padding-right:5px;
        padding-bottom: 2px;
        span {
          border-right: 0.1rem solid #c6bebe;
        }
        a {
          padding-right: 4px;
          padding-left: 4px;
        }
      }

}



.line-item-error{
  position: absolute;
  float: right;
  top: -9px;
  z-index: 99;
  right: 2.375rem;
  color: var(--red-03);

}
.line-item-error-icon{
  position: absolute;
  float: right;
  top: 0.1875rem;
  z-index: 99;
  right: 18.3125rem;
  color:var(--red-03);

}
.line-item-section .el-tabs .el-tabs__content .el-tab-pane > div .line-table.br-tab .vue-good-table-box .vgt-wrap .vgt-inner-wrap .vgt-responsive {
    padding-bottom: 0 !important;
}
.line-table{
   height: calc(100% - 18px) !important;
  .vgt-wrap__footer{
    position: relative !important;
  }
}
 .vgt-responsive::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px var(--dark-06) ;
    background-color: var(--white);
  }

   .vgt-responsive::-webkit-scrollbar {
    width: 6px;
    background-color: var(--white);
  }

  .vgt-responsive::-webkit-scrollbar-thumb {
    background-color: var(--dark-05);
  }
</style>
