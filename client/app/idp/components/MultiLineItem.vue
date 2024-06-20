<template>
  <div class='line-item-section Insurance-package'>
    <el-tabs type="border-card" :value="lineItemActiveTab">
      <el-tab-pane  v-for="(tableData ,index) in lineItemTableParams" 
        :key="index" 
        :label="tableData.table_label || tableData.tableName" 
        :name="tableData.tableName"
        class="line-item-tab" >
        <div class="import-export-multitable-link-grp" style="height: fit-content !important">
          <a :class="{ 'disabled-link': !isDisableLink || hasButtonPermission('Delete all')}" @click.prevent="deleteAllLineItems({ row_count : tableData.rows.length, tableIndex : index })">Delete all</a>
          <span></span>
          <a :class="{ 'disabled-link': !isDisableLink || hasButtonPermission('Add row')}" @click.prevent="addRowInLineItemTable(index)">Add row</a>
          <span></span>
          <a :class="{ 'disabled-link': !isDisableLink || hasButtonPermission('Export')}" @click.prevent="exportLineItem(tableData, index)">Export</a>
          <span></span>
          <a :class="{ 'disabled-link': !isDisableLink || hasButtonPermission('Import')}" @click.prevent="importLineItem(tableData)" >Import</a>
        </div>
        <div :v-if="tableData.rows" >
          <IdpLineTable 
            :class="[tableData.tableName, 'line-table' ]" 
            :parameters="tableData" 
            :key="tableData.tableName"
            :isDocumentReadOnly="docData.isDocumentReadOnly" 
            :documentType="docData.documentType" 
            @delete-idp-row="deleteRow"
            @clone-idp-row="cloneRow"
            @add-idp-row-above="addRowAbove"
            @add-idp-row-below="addRowBelow"
            ref="MultiDataTables">
          </IdpLineTable>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import IdpLineTable from "@/components/IdpLineTable.vue";
import DocumentService from "@/idp/services/DocumentService";
import _ from "lodash";
import EventBus from "@/EventBus";

export default {
  name: "MultiLineItem",
  components: { IdpLineTable },
  data() {
    return {
      lodash: _ ,
      lineItemActiveTab : _.get(this.lineItemTableParams, '[0].tableName', null)
    }
  },
  watch: {},
  computed: {
    isDisableLink() {
      return this.$store.getters["actionButtonStore/isSaveActionEnabled"]
    }
  },
  props: [
    "lineItemTableParams",
    "docData",
  ],
  updated() {
    console.log("MultiLineItem:: Updated");
  },
  methods: {
    refreshDataTable(tableIndex){
      this.$refs.MultiDataTables[tableIndex].refreshTable();
    },
    async exportLineItem(tableData, tableIndex) {
      if (!tableData.rows.length) {
        const formattedTableName = tableData.tableName.split('_').join(' ');
        this.notifyError(`No data found for ${formattedTableName} table. Please add data to export the CSV file.`);
        return;
      }
      const params = { tableName : tableData.tableName, tableIndex };
      this.$emit("handleExportLineItems", params);
    },
    async importLineItem(tableData) {
      this.$emit("handleImportLineItems", tableData);
    },
    hideLineItems() {
      this.$store.commit("documentViewStore/minimizeLineItem");
    },
    showLineItems() {
      this.$store.commit("documentViewStore/maximizeLineItem");
    },
    addRowAbove(tableData) {
      let index = tableData.row.id;
      const tableIndex = tableData.table_index;
      const payload = { index : index, tableIndex : tableIndex };
      this.$store.commit("documentViewStore/addRow", { index: tableData.index, tableIndex: tableIndex});
      this.$emit("setFieldConfigsForRows");
      this.$nextTick(()=>{
        /**
         * Purpose: Refresh bounding boxes in the canvas.
         * When operations are performed on line items, refreshing is required for highlighting.
         * field_config.name are used to highlight line items, so changing a field's name requires updating the bounds.
        */
        if(tableData && tableData.formattedRow){
          const pageNumber = DocumentService.getPageNumberFromRow(tableData.formattedRow);
          this.$emit("reloadBoundingBox", pageNumber);
        }
        this.$store.commit("documentViewStore/moveErrorMessages", payload);
      })
    },

    addRowBelow(tableData) {
      let index = tableData.row.id;
      const tableIndex = tableData.table_index;
      const payload = { index : index, tableIndex : tableIndex };
      index++;
      this.$store.commit("documentViewStore/addRow", { index: index, tableIndex: tableIndex });
      this.$emit("setFieldConfigsForRows");
      this.$nextTick(()=>{
        /**
         * Purpose: Refresh bounding boxes in the canvas.
         * When operations are performed on line items, refreshing is required for highlighting.
         * field_config.name are used to highlight line items, so changing a field's name requires updating the bounds.
        */
        if(tableData && tableData.formattedRow){
          const pageNumber = DocumentService.getPageNumberFromRow(tableData.formattedRow);
          this.$emit("reloadBoundingBox", pageNumber);
        }
        this.$store.commit("documentViewStore/moveErrorMessages", payload);
      })
    },

    cloneRow(tableData) {
      const index = tableData.row.id;
      const tableIndex = tableData.table_index;
      const payload = { index : index, tableIndex : tableIndex };
      this.$store.commit("documentViewStore/rowClone", { index: index, tableIndex: tableIndex });
      this.$emit("setFieldConfigsForRows");
      this.$nextTick(()=>{
        /**
         * Purpose: Refresh bounding boxes in the canvas.
         * When operations are performed on line items, refreshing is required for highlighting.
         * field_config.name are used to highlight line items, so changing a field's name requires updating the bounds.
        */
        if(tableData && tableData.formattedRow){
          const pageNumber = DocumentService.getPageNumberFromRow(tableData.formattedRow);
          this.$emit("reloadBoundingBox", pageNumber);
        }
        this.$store.commit("documentViewStore/moveErrorMessages", payload);
      })
    },

    deleteRow(tableData) {
      const index = tableData.row.id;
      const tableIndex = tableData.table_index;
      this.$store.commit("documentViewStore/deleteLineItemRow", { index: index, tableIndex: tableIndex });
      this.$nextTick(()=>{
        /**
         * Purpose: Refresh bounding boxes in the canvas.
         * When operations are performed on line items, refreshing is required for highlighting.
         * field_config.name are used to highlight line items, so changing a field's name requires updating the bounds.
        */
        if(tableData && tableData.formattedRow){
          const pageNumber = DocumentService.getPageNumberFromRow(tableData.formattedRow);
          this.$emit("reloadBoundingBox", pageNumber);
        }
        this.$store.commit("documentViewStore/deleteErrorMessage", index);
      })
    },
    addRowInLineItemTable(tableIndex) {
      const index = 0;
      this.scrollToRowIndex = 0;
      const data = { row : { id : index } };
      const payload = { index : index, tableIndex : tableIndex };

      /*
        We're adding one empty array "[]", when "delete all" is clicked OR any table rows length is zero
        and when user clicks on "add row" then we're using that empty array in "mapFieldValue" to add all selected columns in that row
        and again we're refreshing tableParams that passed to each table
        In multi tables that table refersh Table function will called using refs
      */
      if(this.lineItemTableParams[tableIndex].rows.length === 0){
        this.$store.commit("documentViewStore/addRow", { index : 0, tableIndex : tableIndex });
        this.$nextTick(() => {
          EventBus.$emit("addRowInEmptyTable");
          this.$refs.MultiDataTables[tableIndex].refreshTable();
        })
        return ;
      }

      this.$refs.MultiDataTables[tableIndex].addRowInLineItem(data);
      this.$store.commit("documentViewStore/addRow", { index: index, tableIndex : tableIndex });
      this.$emit("setFieldConfigsForRows");
      this.$nextTick(()=>{
        /**
         * Purpose: Refresh bounding boxes in the canvas.
         * When operations are performed on line items, refreshing is required for highlighting.
         * field_config.name are used to highlight line items, so changing a field's name requires updating the bounds.
        */
        if(this.lineItemTableParams[tableIndex] && this.lineItemTableParams[tableIndex].rows.length){
          const pageNumber = DocumentService.getPageNumberFromRow(this.lineItemTableParams[tableIndex].rows[0]);
          this.$emit("reloadBoundingBox", pageNumber);
        }
        this.$store.commit("documentViewStore/moveErrorMessages", payload);
      })
    },
    async deleteAllLineItems(tableData) {
      const tableIndex = tableData.tableIndex;
      const rowCount = this.$refs.MultiDataTables[tableIndex]._props.parameters.rows.length;

      if (rowCount === 0) {
        return;
      }
      
      let deleteConfirm = await this.$confirm(`Are you sure you want to delete all ${rowCount} line items?`, "Confirmation", {
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        type: "warning"
      }).catch(e => {
        console.error(e)
      });

      if (!deleteConfirm) { return; }

      // We passed table params using cloneDeep so we need to make empty that rows also
      this.$refs.MultiDataTables[tableIndex].deleteAllRows();

      // Update prediction in the store
      this.$store.commit("documentViewStore/deleteAllLineItems", tableData);

      this.$nextTick(()=>{
        this.$store.commit("documentViewStore/deleteAllErrorMessages", rowCount);
      })
    },
    registerEvents(){
      EventBus.$on("setLineItemActiveTab", (activeTab) => {
        this.lineItemActiveTab = activeTab;
      })
    }
  },
  mounted() { },
  beforeMount() {
    console.log("MultiLineItem:: Before Mount");
    this.registerEvents();
  }
};
</script>

<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";



.line-item-section{
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
  
    .import-export-multitable-link-grp {
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
.line-item-button{
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
    height: calc(100% - 70px) !important;
    padding-bottom: 0 !important;
}
.heading{
    width: --vsa-min-width;

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
  .vsa-list {
    --vsa-max-width: auto; 
    --vsa-min-width: auto;
    --vsa-heading-padding: 0rem 0rem;
    --vsa-text-color: #373737;
    --vsa-highlight-color: #57a;
    --vsa-bg-color: #fff;
    --vsa-border-color: rgba(0,0,0,0.2);
    --vsa-border-width: 1px;
    --vsa-border-style: solid;
    --vsa-border: var(--vsa-border-width) var(--vsa-border-style) var(--vsa-border-color);
    --vsa-content-padding: 0rem 0rem;
    --vsa-default-icon-size: 1;
    display: block;
    max-width: var(--vsa-max-width);
    min-width: var(--vsa-min-width);
    width: 100%;
    padding: 0;
    margin: 0;
    list-style: none;
    border: var(--vsa-border);
    color: var(--vsa-text-color);
    background-color: var(--vsa-bg-color);
}
</style>
