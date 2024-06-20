<template>
  <div class="">
    <div class="vue-good-table-box card-base">
      <vue-good-table
        :max-height="parameters.tableMaxHeight"
        mode="records"
        ref="vgt-table"
        :totalRows="totalRecords"
        :rows="rows"
        :columns="columns"
        :pagination-options="{
          enabled: parameters.showPaginationOptions,
          perPage: perPage,
          mode: 'records',
          allLabel: 'All',
          setCurrentPage: this.currentPage,
          perPageDropdown: [5, 10, 20, 50, 100],
          dropdownAllowAll: false,
        }"
        :sort-options="{ enabled: false }"
        styleClass="vgt-table striped"
        :fixed-header="fixedHeader"
        v-loading="isDataLoading"
        element-loading-spinner="el-"
        :theme="parameters.theme"
        @on-page-change="onPageChange"
      >
        <template slot="table-column" slot-scope="props">
          <div :class="props.column.headerClass">
            <span v-if="props.column.html">
              <span v-html="props.column.label"></span>
            </span>
            <component
              v-if="props.column.headerComponent"
              v-bind:is="props.column.headerComponent"
              :propData="props"
              :tableIndex="parameters.table_index"
              :isDocumentReadOnly="isDocumentReadOnly"
            ></component>
            <span v-if="!props.column.headerComponent && !props.column.html">
              {{ props.column.label }}
            </span>
          </div>
        </template>
        <template slot="table-row" slot-scope="props">
          <div :class="props.column.cellClass">
            <span v-if="props.column.type == 'doc_ex'">
              <span v-for="component in props.column.componentName.split(',')" v-bind:key="component" >
                <component
                  :isDocumentReadOnly="isDocumentReadOnly"
                  :isReadOnly="props.column.isReadOnly"
                  :ref="component"
                  v-bind:is="component"
                  :isTable=true
                  :propData="props"
                  :tableName="parameters.tableName"
                  :documentType="documentType"
                  :props="props.row[props.column.field]"
                  @updateTableFieldValue="updateTableFieldValue"
                ></component>
              </span>
            </span>
            <span v-if="rows.length > 0 && props.column.field == 'actions'">
              <action-wrapper
                :propData="props"
                :parameters="parameters"
                :isDocumentReadOnly="isDocumentReadOnly"
              ></action-wrapper>
            </span>
          </div>
        </template>
      </vue-good-table>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import ActionWrapper from "@/components/TableElements/ActionWrapper";
import Input from "@/components/TableElements/Input.vue";
import DocExInput from "@/idp/components/Input.vue";
import DocExDropdown from "@/doc-ex/components/Dropdown.vue";
import Dropdown from "@/components/TableElements/Dropdown.vue";
import HeaderSelect from "@/components/TableElements/HeaderSelect.vue";
import EventBus from "@/EventBus";
import Constants from "@/resources/Constants";
import {scroller} from "vue-scrollto/src/scrollTo";
const scrollTo = scroller();

let tableScrollToOptions = {
    container: ".line-table .vgt-responsive",
    easing: "ease-in",
    offset: -60,
    force: true,
    cancelable: true,
    x: true,
    y: true,
};

export default {
  name: "IdpLineTable",
  props: [
    "parameters",
    "isDocumentReadOnly",
    "documentType"
  ],
  components: {
    Input,
    Dropdown,
    ActionWrapper,
    DocExInput,
    DocExDropdown,
    HeaderSelect
  },
  data() {
    return {
      options: {},
      selectedRows: [],
      showTableToolbar: this.parameters.showTableToolbar,
      fixedHeader: (this.parameters || {}).fixedHeader,
      activeTabName: "",
      totalRecords: 0,
      perPage: this.parameters.limit,
      currentPage: 1,
      mode: this.parameters.tableMode || "remote",
      tableAction: this.parameters.tableAction,
      loadingInstance: null,
      skip: 0,
      isFilter: false,
      isDataLoading: false,
      refreshEventName: this.parameters.refreshEventName || "",
      busEvents : [],
    };
  },
  methods: {
    /**
     * Updates row keys and index after adding a new row in-between.
     * It ensures all rows reflect their new positions and updates field configurations.
     * @param {Array} clonedRows - Array of rows, including the newly added one.
    */
    adjustRowPositions(clonedRows) {
      clonedRows.forEach((row, i) => {
        for (let column in row) {
          if (typeof row[column] === 'object') {
            row[column].name = column;
            row[column].index = i;
            row[column].field_config && (row[column].field_config.name = `${column}_${i}`);
            row[column].field_config && (row[column].field_config.index = i);
          }
        }
        row.id = i;
      });
      this.$set(this.parameters, 'rows', clonedRows);
    },
    /**
     * Resets the values and properties of a newly added row to empty or default values.
     * @param {Object} row - The newly added row to be initialized.
    */
    initializeEmptyRow(row, resetField) {
      for (let column in row) {
        if (typeof row[column] === 'object') {  
          if (resetField) {
            row[column].value = '';
            row[column].validationMsgs = [];
          }
          row[column].bounds = null;
          row[column].bounds_score = null;
          row[column].from_document = false;
          row[column].original_value = false;
        }
      }
    },
    cloneIdpRow(data) {
      const index = data.row.id;
      let clonedRows = _.cloneDeep(this.parameters.rows);
      const newRow = _.cloneDeep(clonedRows[index]);
      const resetValues = false;
      this.initializeEmptyRow(newRow, resetValues);
      clonedRows.splice(index + 1, 0, newRow);
      this.adjustRowPositions(clonedRows);
      this.parameters.rows = clonedRows;

      this.$nextTick(() => {
        this.handleScrollToRow(index + 1);
      });
    },
    addIdpRowAbove(data) {
      const index = data.row.id;
      const resetValues = true;
      let clonedRows = _.cloneDeep(this.parameters.rows);
      let newRow = _.cloneDeep(clonedRows[index]);
      this.initializeEmptyRow(newRow, resetValues);
      clonedRows.splice(index, 0, newRow);
      this.adjustRowPositions(clonedRows);
      this.parameters.rows = clonedRows;
      
      this.$nextTick(() => {
        this.handleScrollToRow(index + 1);
      });
    },
    addIdpRowBelow(data) {
      const index = data.row.id;
      const resetValues = true;
      let clonedRows = _.cloneDeep(this.parameters.rows);
      let newRow = _.cloneDeep(clonedRows[index]);
      this.initializeEmptyRow(newRow, resetValues);
      clonedRows.splice(index + 1, 0, newRow);
      this.adjustRowPositions(clonedRows);
      this.parameters.rows = clonedRows;
      
      this.$nextTick(() => {
        this.handleScrollToRow(index + 1);
      });
    },
    deleteIdpRow(data) {
      const index = data.row.id;
      let clonedRows = _.cloneDeep(this.parameters.rows);
      clonedRows.splice(index, 1);
      this.adjustRowPositions(clonedRows);
      this.parameters.rows = clonedRows;
      
      this.$nextTick(() => {
        this.handleScrollToRow(index);
      });
    },
    /**
     * Adds a new row to the table, above the first row or at the beginning,
     * 
     * @remarks This function is called from SingleLineItem or MultiLineItem components to manage row additions. 
     * If there are no existing rows, it Reinitializes the data table with the new data.
   */
    addRowInLineItem() {
      // When rows length is 0 then logic is handled in single and multi line items components
      if (this.parameters.rows.length === 0) {
        return;
      }
      const index = 0;
      const resetValues = true;
      let clonedRows = _.cloneDeep(this.parameters.rows);
      let newRow = _.cloneDeep(clonedRows[index]);
      this.initializeEmptyRow(newRow, resetValues);
      clonedRows.splice(index, 0, newRow);
      this.adjustRowPositions(clonedRows);
      this.parameters.rows = clonedRows;
      
      this.$nextTick(() => {
        this.handleScrollToRow(index + 1);
      });
    },
    /**
     * Clears all rows from the table, effectively resetting it to an empty state.
     * This function is called from SingleLineItem or MultiLineItem components.
    */
    deleteAllRows() {
      this.parameters.rows = [];
      this.rows = [];
    },
    getRecordCount() {
      return this.parameters.rows.length;
    },
    handleScrollToRow(scrollToRowIndex) {
      let scrollToElement = `.${this.parameters.tableName} tr:nth-child(${scrollToRowIndex})`;
      scrollTo(scrollToElement, 800, tableScrollToOptions);
    },
    updateTableFieldValue(params) {

      // Do not execute below code if pagination is off as it will refresh all other components
      if(!this.parameters.showPaginationOptions){
        return;
      }
      const rowIndex = params.index;
      const updatedValue = params.value;

      const row = this.parameters.rows[rowIndex];

      let field = _.find(row, (col) => {
        return (
          col && col.field_config && col.field_config.name == params.name
        );
      });
      field.value = updatedValue;
      // console.log(`Field value updated @IdpLineTable ${this.parameters.tableName} ${field.name} ${field.value}`);
    },
    onPageChange(params) {
      /**
       * We're deactivating only line items components events when page change is occured
       * So when user comes to same page again all required events are registred again
       */
      const inputComponentsEvents = window.documentInputComponents.filter(item => item.startsWith("InputValueChanged__"));
      EventBus.$off(inputComponentsEvents);
      _.remove(window.documentInputComponents, item => item.startsWith("InputValueChanged__"));

      this.skip = params.currentPerPage * (params.currentPage - 1);
      this.perPage = params.currentPerPage;
      this.currentPage = params.currentPage;
      this.renderLineTable();
      // Reset the scroll position of the Vue Good Table container of line items to the top
      this.$refs['vgt-table'].$el.querySelector('.vgt-responsive').scrollTop = 0
    },
    renderLineTable() {
      this.totalRecords = this.parameters.rows && this.parameters.rows.length;
      const clonedRows = _.cloneDeep(this.parameters.rows);
      let records = _.slice(
        clonedRows,
        this.skip,
        this.totalRecords
      );
      this.rows = _.slice(records, 0, this.perPage);
      this.columns = _.cloneDeep(this.parameters.columns);
    },
    /**
     * ActionHandlersMap and associates action events from the actionItems in table_params
     * with corresponding functions and triggers them when the respective event is fired.
    */
    triggerActionItem(eventName, Propdata) {
      const ACTION_ITEMS_EVENTS = Constants.LINE_TABLE.LINE_TABLE_ACTION_EVENTS;
      const actionHandlersMap = {
        [ACTION_ITEMS_EVENTS.DELETE_IDP_ROW]: this.deleteIdpRow,
        [ACTION_ITEMS_EVENTS.CLONE_IDP_ROW]: this.cloneIdpRow,
        [ACTION_ITEMS_EVENTS.ADD_IDP_ROW_ABOVE]: this.addIdpRowAbove,
        [ACTION_ITEMS_EVENTS.ADD_IDP_ROW_BELOW]: this.addIdpRowBelow,
      };
      actionHandlersMap[eventName](Propdata);
    },

    /* 
      Purpose : triggerActionEvent serves as an intermediary for handling action events. 
      It first calls the corresponding action handler function, and then emits the event
      to the parent component (e.g.SingleLineItem or MultiLineItem) using $emit to update data in store 
    */
    triggerActionEvent(actionItem, Propdata) {
      this.triggerActionItem(actionItem.table_event, Propdata);
      this.$emit(actionItem.table_event, Propdata);
    },

    /* 
      Registers event listeners for actions within a static table. When an action event is triggered,
      it calls the 'triggerActionEvent' function to handle the action with associated data. 
    */
    registerActionItemsEvents() {
      for (const actionItem of this.parameters.actionItems) {
        this.busEvents.push(actionItem.event_name);
        EventBus.$on(actionItem.event_name, (Propdata) => {
          this.triggerActionEvent(actionItem, Propdata);
        });
      }
    },
    registerEvents() {
      this.busEvents = [
        `pageChange__${this.parameters.tableName}`,
        "updateTableFieldValue"
      ];

      this.registerActionItemsEvents();

      EventBus.$on("updateTableFieldValue", (data) => {
        this.updateTableFieldValue(data);
      });

      const pageChangeEvent = `pageChange__${this.parameters.tableName}`;
      EventBus.$on(pageChangeEvent, (pageNumber) => {
        if (pageNumber == this.currentPage) {
          return;
        }
        this.currentPage = pageNumber;
      });
    }
  },
  computed: {
    rows(){
      console.log(`Computed :: IdpLineTable ${this.parameters.tableName} - rows`);
      return this.parameters.rows;
    },
    columns() {
      console.log(`Computed :: IdpLineTable ${this.parameters.tableName} - columns`);
      return this.parameters.columns;
    }
  },
  updated() {
    console.log("IdpLineTable:: updated", this.parameters.tableName);
    this.$nextTick(() => {
      const pageSizeDropdown = document.querySelector(".line-table .footer__row-count");
      if (pageSizeDropdown) {
        pageSizeDropdown.parentNode.removeChild(pageSizeDropdown);
      }
    });
  },
  mounted() {
    console.log("IdpLineTable::mounted ", this.parameters.tableName);
    this.registerEvents();
    this.renderLineTable();
  },
  beforeDestroy() {
    console.log("IdpLineTable:: Before destroy " + this.parameters.tableName);
    EventBus.$off(this.busEvents);
  }
};
</script>

<style lang="scss">
@import "../idp/_idpVariables";
@import "../idp/_idpGlobal.scss";

.ellipsis {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 200px;
  //Adding Max Width, so that only description in list view is shown partially(ellipsis)
  max-width: 200px;
}

.vgt-responsive {
  width: unset;
  overflow-x: auto;
  position: unset;
}

.command {
  width: 300px !important;
}

.table-data-belt {
  margin-bottom: 40px;
}

.btn-export {
  display: inline;
}

.vgt-selection-info-row {
  display: none;
}

.page-vue-good-table {
  .table-buttons-wrap {
    border-radius: 6px;
    padding: 8px 0px 5px 0px;
    border: 0px solid #dcdfe6;
    border-bottom: 0px;
    background: linear-gradient(#f4f5f8, #f1f3f6);

    .edit-table-buttons {
      float: left;
    }

    .table-action-buttons-wrap {
      float: right;

      .action-button {
        margin-left: 13px;
      }
    }
  }

  .table-buttons-wrap::after {
    display: block;
    content: "";
    clear: both;
  }

  .qna-header {
    color: #00a7e0 !important;
    padding: 12px;
  }
}</style>
