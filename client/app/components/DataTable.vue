<template>
  <div class="">
    <!-- <div class="page-vue-good-table scrollable"> -->
    <!-- header widgit -->
    <div
      v-if="parameters.headerWidget && parameters.headerWidget.length"
      class="kp-top-section-container"
    >
      <div
        v-for="item in parameters.headerWidget"
        :key="item.label"
        class="section-labels"
      >
      {{ isDataLoading }}
        <header-widget :propData="item"
        v-loading="parameters.loadHeaders && isDataLoading"
        ></header-widget>
      </div>
    </div>
    <!-- header widgit end -->

    <!-- table Toolbar -->
    <div class="table-toolbar" v-if="showTableToolbar">
      <div class="page-title">
        <span class="page-title-text">{{ parameters.pageTitle }}</span>
      </div>

      <div class="train-actions">
        <span v-if="enableActionButtonsSection">
          <el-button
            data-v-step="1"
            :disabled="
              parameters.inlineAddButtonConfig &&
              parameters.inlineAddButtonConfig.disable
            "
            class="btn-add ml-0"
            v-if="showAddButton"
            type="primary"
            cid="table-header-add"
            v-on:click="create"
            size="small"
            ><i class="mdi mdi-plus"></i> Add</el-button
          >
          <el-button
            class="ml-0 pl-10 pr-10"
            v-if="showSaveCancel"
            type=""
            cid="table-header-save"
            v-on:click="saveData"
            size="medium"
            ><i class="mdi mdi-content-save"></i> Save</el-button
          >
          <el-button
            class="ml-0 pl-10 pr-10"
            v-if="showSaveCancel"
            type=""
            cid="table-header-cancel"
            v-on:click="cancel"
            size="medium"
            ><i class="mdi mdi-cancel"></i> Cancel</el-button
          >
        </span>

        <el-button
          class="btn-train"
          v-for="button in tableAction"
          v-bind="button"
          v-bind:key="button.id"
          :cid="'table-header-action_'+button.label"
          :disabled="isTableInEditMode || !rows.length"
          :type="button.type"
          @click="emitButtonEvent(button.event)"
          >{{ button.label }}
        </el-button>
        <el-button
          data-v-step="2"
          class="btn-import sec-btn"
          v-if="parameters.enableImport"
          :disabled="isTableInEditMode"
          type="text"
          v-on:click="openUploadDialog"
          ><i class="mdi mdi-import"></i> Import</el-button
        >
      </div>
      <!-- train container -->

      <div
        v-for="button in parameters.extraButtons"
        :key="button.name"
      >
      <div class="support-btn">
          <el-button
            type="primary"
            size="small"
            :cid="button.name"
            :id="button.id"
            :disabled="button.disable"
            v-on:click="
              button.event
                ? emitButtonEvent(button.event)
                : handleAddButtonRoute(button)"
          >
            {{button.name}}
          </el-button>
        </div>
      </div>

      <div class="support-btn">
        <el-button
          v-if="parameters.addButtonConfig"
          type="primary"
          size="small"
          :cid="parameters.addButtonConfig.name"
          v-on:click="
            parameters.addButtonConfig.event
              ? emitButtonEvent(parameters.addButtonConfig.event)
              : handleAddButtonRoute(parameters.addButtonConfig)"
        >
          <i class="el-icon-plus"></i>&nbsp;{{
            parameters.addButtonConfig.name
          }}
        </el-button>
      </div>
      <!-- add documnet -->

       <div class="support-btn">
        <el-button
          v-if="parameters.refreshButton"
          :cid="parameters.refreshButton.name"
          @click="onRefresh"
          class="refreshbtn"
        >
          <i class="mdi mdi-refresh"></i>&nbsp;{{
            parameters.refreshButton.name
          }}
        </el-button>
      </div>
      <!-- Refresh button -->

      <div class="search" v-if="parameters.globalSearch == null ? true : false">
        <span class="mdi mdi-magnify search-icon"></span>
        <el-input
          clearable
          cid="table-global-search"
          @change="onSearch()"
          @clear="onSearch()"
          class="kp-toolbar-input"
          placeholder="Search..."
          v-model="searchText"
        ></el-input>
      </div>
      <!-- search documents -->

      <div
        class="filter-container"
        v-if="parameters.customfilter == null ? true : false"
      >
        <el-popover
          offset="5"
          :popper-class="options && options.header_popover_class?options.header_popover_class:'advanced-popover'"
          :placement="options && options.header_filter_position?options.header_filter_position:'bottom'"
          trigger="click"
        >
          <filter-form
            @setFilterData="setFilterData"
            :columns="filterColumns"
          ></filter-form>
          <el-tooltip
            slot="reference"
            class="item"
            effect="light"
            content="Filter"
            placement="top-start"
          >
            <el-button
              v-if="parameters.customfilter == null ? true : false"
              data-v-step="3"
              @click="applyFilter"
              cid="table-select-filter"
              class="advanced-filter-btn"
              style="display: inline-block"
            >
              <span class="mdi mdi-filter left-icon"></span>
              Select Filter
              <span class="mdi mdi-menu-down right-icon"></span>
            </el-button>
          </el-tooltip>
        </el-popover>
      </div>
      <!-- filter -->

      <div class="export-btn ">
        <el-tooltip
          class="item export"
          effect="light"
          content="Export"
          placement="top-start"
        >
        <el-button
            data-v-step="3"
            v-if="parameters.enableExport"
            cid="table-export"
            :disabled="isTableInEditMode"
            @click="onExport"
            class="kp-btn-toolbar btn-export"
          >
            <span
              class="mdi mdi-arrow-down-thin-circle-outline"
            ></span>
          </el-button>
        </el-tooltip>
      </div>
      <!-- export button -->
    </div>


     <ai-search v-if="parameters.enableAiSearch"
                :searchText="parameters.aiSearchParam.searchText"
                :searchColumn="parameters.aiSearchParam.searchColumn" 
                :collectionType ="parameters.aiSearchParam.collectionType"
                :toggleSearchColumn = "parameters.aiSearchParam.toggleSearchColumn"
                :showToggle = "parameters.aiSearchParam.showToggle"
      ></ai-search>
        

    <div class="vue-good-table-box card-base">
      <vue-good-table
        :max-height="parameters.tableMaxHeight"
        :mode="mode"
        @on-select-all="selectAll"
        @on-cell-click="onCellClick"
        @on-per-page-change="onPerPageChange"
        @on-page-change="onPageChange"
        @on-sort-change="onSortChange"
        @on-column-filter="onColumnFilter"
        @on-selected-rows-change="selectionChanged"
        @on-row-click="onRowClick"
        ref="vgt-table"
        :totalRows="totalRecords"
        :rows="rows"
        :columns="columns"
        :pagination-options="{
          enabled: !isTableInEditMode && parameters.showPaginationOptions,
          perPage: perPage,
          mode: 'records',
          allLabel: 'All',
          setCurrentPage: this.currentPage,
          perPageDropdown: [5, 10, 20, 50, 100],
          dropdownAllowAll: false,
        }"
        :group-options="{
          enabled: parameters.showRowCollapse,
          collapsable: parameters.showRowCollapse,
        }"
        :select-options="{
          enabled: parameters.showSelectOptions,
          selectOnCheckboxOnly: false,
        }"
        :sort-options="{ enabled: shouldSortEnable }"
        :selected-rows="mappedPreSelectedRows"
        :selected-key="preSelectedRows"
        styleClass="vgt-table striped"
        :fixed-header="fixedHeader"
        v-loading="isDataLoading"
        element-loading-spinner="el-"
        :theme="parameters.theme"
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
            <div v-if="props.column.optionalButtons">
              <component
                v-for="button in props.column.optionalButtons"
                v-bind:key="button.no"
                v-bind:is="button.componentName"
                :propData="props"
                :options="button"
              ></component>
            </div>
            <span v-if="props.column.type == 'doc_ex'">
              <span
                v-for="component in props.column.componentName.split(',')"
                v-bind:key="component"
              >
                <component
                  :isDocumentReadOnly="isDocumentReadOnly"
                  :selectedField="selectedField"
                  :isReadOnly="props.column.isReadOnly"
                  :ref="component"
                  v-bind:is="component"
                  :isTable="true"
                  :propData="props"
                  :tableName="parameters.tableName"
                  :documentType="documentType"
                  :props="props.row[props.column.field]"
                ></component>
              </span>
            </span>
            <span
              v-else-if="
                props.column.componentName && props.column.field != 'actions'
              "
            >
              <span
                v-for="component in props.column.componentName.split(',')"
                v-bind:key="component"
              >
                <component
                  ref="component"
                  :isTableInEditMode="isTableInEditMode"
                  @editData="enableSaveCancelButton"
                  v-bind:is="component"
                  :options="props.column.options"
                  @onDataUpdate="handleDataUpdate"
                  :propData="props"
                  :fieldName="props.column.field"
                ></component>
              </span>
            </span>
            <span v-else-if="props.column.field == 'actions' && shouldActionWrapperEnable">
              <action-wrapper
                :propData="props"
                :parameters="parameters"
                :isDocumentReadOnly="isDocumentReadOnly"
              ></action-wrapper>
            </span>
            <!-- Added this span so as to display all of description content
            on hovering description cell of particular record -->
            <span
              v-else-if="props.column.field && props.column.field == 'description'"
              >
              <el-tooltip :content="props.formattedRow.description.length > 1000 ? props.formattedRow.description.substring(0, 1000) : props.formattedRow.description" placement="top" effect="light"  >
                  <div class="ellipsis" >{{ props.formattedRow.description }}</div>
              </el-tooltip>
            </span>
            <span v-else-if="props.column.field && props.column.field == 'guidelines_prompt'">
              <el-tooltip
                :content="props.formattedRow.guidelines_prompt.length > 1000 ? props.formattedRow.guidelines_prompt.substring(0, 1000) : props.formattedRow.guidelines_prompt" placement="top" effect="light"  >
                  <div class="ellipsis" >{{ props.formattedRow.guidelines_prompt }}</div>
              </el-tooltip>
            </span>
            <span v-else-if="props.column.field && props.column.field == 'system_prompt'">
              <el-tooltip
                :content="props.formattedRow.system_prompt.length > 1000 ? props.formattedRow.system_prompt.substring(0, 1000) : props.formattedRow.system_prompt" placement="top" effect="light"  >
                  <div class="ellipsis" >{{ props.formattedRow.system_prompt }}</div>
              </el-tooltip>
            </span>
              <span
              v-else-if="props.column.htmlComponent"
              v-html="columnTemplate(props)"
            ></span>
            <span v-else>
              <div :cid="'row-' + props.column.field + '-'+ props.index">
                {{ props.formattedRow[props.column.field] }}
              </div>
            </span>
          </div>
        </template>
      </vue-good-table>
    </div>
    <div>
      <upload
        v-if="displayUploadDialog"
        @closeDialog="closeUploadDialog"
        :parentTableInfo="parameters"
        :data="uploadParams"
      ></upload>
    </div>
  </div>
</template>

<script>
import TableAPIService from "../services/TableAPIService";
import { _ } from "vue-underscore";
import lodash from "lodash";
import AjaxService from "../services/AjaxService";
import Button from "@/components/TableElements/Button";
import ThumbsUpDownButtons from "@/components/TableElements/ThumbsUpDownButtons";
import DateTimeFormatter from "@/components/TableElements/DateTimeFormatter";
import ActionWrapper from "@/components/TableElements/ActionWrapper";
import ViewIcon from "@/components/TableElements/ViewIcon";
import Json from "@/util/Json";
import Upload from "@/components/Upload";
import HeaderWidget from "@/components/HeaderWidget";
import AiSearch from "@/components/AiSearch";
import FilterForm from "../components/Filter";
import $ from "jquery";
import "daterangepicker/daterangepicker.js";
import "daterangepicker/daterangepicker.css";
import moment from "moment";

import statusBadge from "@/components/TableElements/statusBadge";
import WorkflowInstanceStatus from "@/workflow/components/WorkflowInstanceStatus";
import statusBadgeTransations from "@/components/TableElements/statusBadgeTransactions";
import subscriptionStatusBadge from "@/components/TableElements/subscriptionStatusBadge";
import DataTableService from "../services/DataTableService";
import DataTableCodemirror from "@/components/TableElements/DataTableCodemirror.vue";
import HeaderSelect from "@/components/TableElements/HeaderSelect.vue";
import Input from "@/components/TableElements/Input.vue";
import DocExInput from "@/idp/components/Input.vue";
import DocExDropdown from "@/doc-ex/components/Dropdown.vue";
import TestCaseStatus from "@/components/TableElements/TestCaseStatus.vue";

import QnaQuestion from "@/components/TableElements/QnaQuestion.vue";
import Dropdown from "@/components/TableElements/Dropdown.vue";
import Editor from "@/components/TableElements/Editor.vue";
import EventBus from "@/EventBus";
import { Loading } from "element-ui";

import QnaButton from "@/components/TableElements/QnaButton.vue";
import Constants from "@/resources/Constants";
import CreditCard from "@/components/TableElements/CreditCard.vue";
import LinkButton from "@/components/TableElements/LinkButton.vue";
import StatusIcon from "@/components/TableElements/StatusIcon.vue";
import NestedField from "@/components/TableElements/NestedField.vue";
import LabelMap from "@/idp/table/components/LabelMap";
import LinkArray from "@/components/TableElements/LinkArray.vue";
import ViewLog from "@/components/TableElements/ViewLog.vue";
import ViewArray from "@/components/TableElements/ViewArray.vue";

import TextColor from "@/components/TableElements/TextColor";
import BucketItemLink from "@/components/TableElements/BucketItemLink";
import DocumentService from "@/idp/services/DocumentService";

export default {
  name: "DataTable",
  props: [
    "parameters",
    "columnTemplate",
    "data",
    "isDocumentReadOnly",
    "selectedField",
    "documentType",
    "preSelectedRows"
  ],
  components: {
    ViewArray,
    LinkArray,
    LabelMap,
    Button,
    DateTimeFormatter,
    statusBadge,
    statusBadgeTransations,
    subscriptionStatusBadge,
    ThumbsUpDownButtons,
    DataTableCodemirror,
    Input,
    Dropdown,
    Upload,
    Loading,
    QnaQuestion,
    QnaButton,
    Editor,
    HeaderWidget,
    AiSearch,
    FilterForm,
    CreditCard,
    ActionWrapper,
    StatusIcon,
    NestedField,
    WorkflowInstanceStatus,
    LinkButton,
    DocExInput: DocExInput,
    DocExDropdown: DocExDropdown,
    HeaderSelect,
    ViewLog,
    TextColor,
    BucketItemLink,
    ViewIcon,
    TestCaseStatus,
  },
  computed: {
    mappedPreSelectedRows(){
      if (_.isEmpty(this.rows) || _.isEmpty(this.preSelectedRows)) return [];
      // Ensure that vgtSelected is set to true for rows included in preSelectedRows
      this.rows.forEach(row => {
        if (this.preSelectedRows.includes(row._id)) {
          this.$set(row, 'vgtSelected', true);
        } else {
          // Ensure that vgtSelected is set to false for rows not included in preSelectedRows
          this.$set(row, 'vgtSelected', false);
        }
      });
      return this.rows;
    },
    // If you want to hide the action column in any datatable, set the following flag 
    // in tableParams. By default, the action column will be visible unless this flag is explicitly set to false.
    shouldActionWrapperEnable(){
      return _.get(this.parameters, 'shouldActionWrapperEnable', true)
    },
    shouldSortEnable() {
      let sort = this.parameters.showSortOptions;
      if (this.isTableInEditMode) {
        sort = false;
      }
      return sort;
    },

    isTableInEditMode() {
      let flag = lodash.some(this.rows, {
        editable: true,
      });
      this.$store.commit("setTableEditMode", flag);
      return flag;
    },

    enableActionButtonsSection() {
      return (
        this.allowInline || this.tableAction || this.parameters.enableExport
      );
    },
    showAddButton(){
      if(this.parameters.hideAddButton){
        return  false
      }
      return(this.allowInline || this.parameters.enableAddButton)
    },
  },
  watch: {
    "parameters.showTableToolbar": {
      handler: function (newVal, oldval) {
          _.isBoolean(newVal)
            ? (this.showTableToolbar = this.parameters.showTableToolbar)
            : (this.showTableToolbar = true);
      },
      immediate: true,
      deep: true,
    },
    rows(val) {
      this.performActionOnRowChange();
    },
    parameters: {
      handler: function (newVal, oldval) {
          if(!newVal)return;
          if (newVal.isStaticTable) {
            this.rows = newVal.rows;
            this.columns = newVal.columns;
            this.getFilterColumns();
            this.renderTableWithStaticData();
            return;
          }
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      options:{},
      columns: [],
      selectedRows: [],
      showTableToolbar: true,
      fixedHeader: (this.parameters || {}).fixedHeader,
      tableAPI: "",
      activeTabName: "",
      rows: this.data || [],
      totalRecords: 0,
      rowsToBeExported: [],
      searchTerm: "",
      perPage: this.parameters.limit,
      currentPage: 1,
      /* Modes in vue-good-table
        * 1) static - sorting, filtering, pagination are done on client side 
        * 2) remote - All sorting, filtering, pagination are done on server side 
        *             table will show data got from server only.
      */ 
      mode: this.parameters.tableMode || "remote",
      getcomponent: true,
      componentList: "",
      serverParams: {
        columnFilters: {},
        sort: {
          field: "",
          type: "",
        },
        page: 1,
        perPage: this.parameters.limit,
      },
      calenderMounted: false,
      isStaticInfo: false,
      showSaveCancel: false,
      allowInline: this.parameters.allowInline,
      tableAction: this.parameters.tableAction,
      showCreate: false,
      displayUploadDialog: false,
      loadingInstance: null,
      uploadParams: {
        service_name: "training",
        model_type: this.parameters.modelType,
        table_name: this.parameters.tableName,
      },
      skip: 0,
      isFilter: false,
      filterColumns: [],
      globalSearchColumns: [],
      searchText: "",
      isDataLoading: false,
      tableFilter: this.parameters.queryParam,
      refreshEventName: this.parameters.refreshEventName || "",
    };
  },
  methods: {
    /**In case of multiple tables on same page,
     * When we emit event here,always event was getting listened for second table
     * Hence instead of emitting event we are calling function directly*/
    onRefresh(){
      this.refreshTable();
    },
   
    handleAddButtonRoute(config){
        this.$router.push({
          path: config.path,
          query: config.params,
        });
    },
    updateStaticRows(rows) {
      this.rows = rows || [];
    },
    emitButtonEvent(eventName) {
      EventBus.$emit(eventName, {});
      this.$emit(eventName);
    },
    applyFilter() {
      this.isFilter = !this.isFilter;
    },
    
    // debounce(function (searchText) {
    onSearch(searchText) {
      let condition = {};
      if (this.parameters.isRegxSearch) {
        condition = this.getGlobalSearchQuery(searchText || this.searchText);
      } else {
        condition = !_.isEmpty(searchText || this.searchText)
          ? { $text: { $search: searchText || this.searchText } }
          : {};
      }
      this.setFilterData(condition);
    },
    // , 1000),
    globalSearch(searchText) {
      let condition = {};
      if (this.parameters.isRegxSearch) {
        condition = this.getGlobalSearchQuery(searchText);
      } else {
        condition = !_.isEmpty(searchText || this.searchText)
          ? { $text: { $search: searchText || this.searchText } }
          : {};
      }
      this.setFilterData(condition);
    },
    getGlobalSearchQuery(searchText) {
      let conditions = [];
      let globalSearchColumns = this.globalSearchColumns;
      for (let i = 0; i < globalSearchColumns.length; i++) {
        if (
          lodash.get(
            globalSearchColumns[i],
            "globalSearchOptions.filterType"
          ) == "calender"
        )
          continue;
        let condition = {};
        let col_val = "(" + searchText + ")";
        condition[globalSearchColumns[i].field] = {
          $regex: col_val,
          $options: "i",
        };
        conditions.push(condition);
      }
      return { $or: conditions };
    },
    getGlobalSearchColumns() {
      this.globalSearchColumns = lodash.filter(
        this.columns,
        "globalSearchOptions.enable"
      );
      return this.globalSearchColumns;
    },
    deleteRow(index) {
      this.rows.splice(index, 1);
    },
    performAction() {
      EventBus.$emit("performAction");
    },
    openUploadDialog() {
      this.$stopTour();
      this.displayUploadDialog = true;
    },
    closeUploadDialog() {
      this.displayUploadDialog = false;
      this.refreshTable();
    },
    handleDataUpdate(params) {
      this.enableSaveCancelButton(params.propData.index);
      lodash.set(
        this.rows[params.propData.index],
        params.propData.column.field,
        params.value
      );
      // this.$set(this.rows, params.propData.index, updatedData)
    },
    enableSaveCancelButton(index) {
      this.$set(this.rows[index], "editable", true);
      this.showSaveCancel = true;
    },
    showLoader(params) {
      this.loadingInstance = Loading.service({
        ...params,
      });
    },
    hideLoader() {
      if (!this.loadingInstance) {
        return;
      }
      this.loadingInstance.close();
      this.loadingInstance = null;
    },
    performActionOnRowChange() {
      this.hideFilter();
    },

    hideFilter() {
      if (this.isTableInEditMode) {
        $("thead > tr:nth-child(2)").hide();
        return;
      }
      $("thead > tr:nth-child(2)").show();
    },
    async saveData() {
      if (this.validateTable().includes(false)) {
        this.notifyError(Constants.TABLE_VALIDATION_ERROR);
        return;
      }
      let apiName
      if (this.$props.parameters.saveAPI){
        apiName = this.$props.parameters.saveAPI
      }
      else{
        apiName = this.$props.parameters.apiName
      }
      let res = await DataTableService.save(this.rows,apiName)
      .catch(() => {
        this.notifyError(Constants.TABLE_DATA_SAVE_ERROR);
      });
      if (res) {
        this.notifySuccess(Constants.TABLE_DATA_SAVE_SUCCESS);
      }
      this.refreshTable();
      this.showSaveCancel = false;
    },

    validateTable() {
      let validationStatusArray = [];
      lodash.forEach(this.$refs.component, (ele) => {
        let status = ele.validate ? ele.validate() : "";
        validationStatusArray.push(status);
      });
      return validationStatusArray;
    },

    editRow(propsData) {
      this.$set(this.rows[propsData.index], "editable", true);
      this.showSaveCancel = true;
    },

    isDataInvalid() {
      return lodash.some(this.rows, (row) => {
        return lodash.values(row["validation"]).includes(false);
      });
    },
    cancel() {
      this.showSaveCancel = false;
      this.refreshTable();
    },
    create() {
      this.$stopTour();
      if (!this.allowInline) {
        return this.$router.push(this.parameters.enableAddButton.routeParams);
      }
      let defaultData = {
        editable: true,
        active: true,
        ...this.parameters.defaultData,
      };
      this.rows.unshift(defaultData);
      this.showSaveCancel = true;
    },

    onCellClick(params) {
      //pass
    },
    setFilterData(filterData) {
      if (_.keys(filterData).length > 0) {
        this.parameters.queryParam = { ...this.tableFilter, ...filterData };
      } else {
        this.parameters.queryParam = this.tableFilter;
      }
      this.isFilter = false;
      this.skip = 0;
      this.currentPage = 1;
      this.refreshTable();
    },
    updateTableFiler(filter) {
      this.tableFilter = { ...this.tableFilter, ...filter };
    },
    setQueryParam(filter) {
      this.parameters.queryParam = { ...this.tableFilter, ...filter };
      this.skip = 0;
      this.currentPage = 1;
      this.refreshTable();
    },
    refreshTable() {
      this.tableAPI.setQuery(this.parameters.queryParam);
      this.$emit("refreshCount");
      this.getRecords();
      this.showSaveCancel = false;
      this.hideLoader();
    },
    getRecordCount() {
      return this.rows.length;
    },

    async getTableHeaders() {
      var queryParams = {
        tableName: this.parameters.tableName,
        ...this.parameters.tableHeaderConfigParams,
      };
      const tableConfigResponse=await DocumentService.getTableConfig(queryParams);
      this.columns= tableConfigResponse.columns.columns;
      this.options = tableConfigResponse.columns.options;
    },
    getFilterColumns() {
      this.filterColumns = lodash.filter(this.columns, "filterOptions.enable");
      return this.filterColumns;
    },
    getCount() {
      var self = this;
      this.tableAPI.countRecord(this.parameters.apiName, (error, response) => {
        if (response) {
          self.totalRecords = response.count;
          self.parameters.count_event
            ? EventBus.$emit(self.parameters.count_event, {
                index: self.parameters.index,
                count: self.totalRecords,
                key: self.parameters.count_event,
              })
            : "";
        } else {
          console.log("error occured");
        }
      });
    },
    /*
     * Description:Event called when click on selectAll checkbox
     * @method selectAll
     * -selected  boolean  indicates whether select all was selected or unselected
     * -selectedRows selectedRows contains data of all selected rows
     */
    selectAll(params) {
      if (params.selected) {
        this.rowsToBeExported = params.selectedRows;
      } else {
        this.rowsToBeExported = this.rows;
      }
    },

    /*
     * Description:Event called when click on single row checkbox
     * @method toggleSelectRow
     * -params  contains data of selected row.
     */
    toggleSelectRow(params) {
      var pageIndex = [];
      console.log(params.pageIndex);
      if (params.selected) {
        pageIndex.push(params.pageIndex);
        this.rowsToBeExported.push(params.row);
      } else {
        for (let i = 0; i < pageIndex.length; i++) {
          if (i == params.pageIndex) {
            this.rowsToBeExported = _.without(
              this.rowsToBeExported,
              this.rowsToBeExported[params.pageIndex]
            );
          }
        }
      }
    },

    /*
     * Description:To update
     * @method updateParams
     * -selected  boolean  indicates whether select all was selected or unselected
     * -selectedRows selectedRows contains data of all selected rows
     */

    onPageChange(params) {
      this.skip = params.currentPerPage * (params.currentPage - 1);
      this.perPage = params.currentPerPage;
      this.currentPage = params.currentPage;
      this.getRecords();
      // Reset the scroll position of the Vue Good Table container of line items to the top
      this.$refs['vgt-table'].$el.querySelector('.vgt-responsive').scrollTop = 0
    },

    onPerPageChange(params) {
      this.skip = 0;
      this.perPage = params.currentPerPage;
      this.getRecords();
    },

    onExport() { 
    /**
    * This 'if' block is added to handle exporting CSV data with additional logic.
    * The existing export CSV functionality didn't support data export using aggregation queries,
    * requiring a different export method each time.
    * To streamline this, we introduced a new key, 'customExportEndpoint'.
    * If 'customExportEndpoint' is provided, we call the specified API where the export logic is implemented,
    * centralizing the export process.
    */
    if (this.parameters.customExportEndpoint) {
    let exportQuery = this.parameters.queryParam || {};
    let endPoint = `${window.location.origin}${this.parameters.customExportEndpoint}?query=${JSON.stringify(exportQuery)}`;
    window.open(endPoint, "_self");
    return;
    } 
     /**
     * This is default functionality to handle exporting CSV data with default logic
     * If REST export endpoint is provided, we call the REST API where the export logic is implemented
     */   
      let queryParam = this.parameters.queryParam || {};
      let endPoint =
        `${window.location.origin}` +
        this.parameters.apiName +
        `?exportCsv=true&query=${JSON.stringify(queryParam)}`;
      window.open(endPoint, "_self");
    },

    onSortChange(params) {
      if(this.parameters.isStaticTable)return false;
      this.rows = [];
      console.log("params in sort are::" + JSON.stringify(params));
      var sortField =
        params[0].type == "asc" ? params[0].field : "-" + params[0].field;

      // If current table is using restify then add sort condition in table api service
      if (this.parameters.isRestify) {
        this.tableAPI.addSortCondition(sortField);
      } else { // If current table is using ajaxService (custom rest endpoint) then include sort condition in queryParam 
        this.parameters.queryParam.sort = sortField;
      }
      // this.tableAPI.addLimit(this.parameters.limit);
      this.getRecords();
    },

    onColumnFilter(params) {
      let columns = [];
      var self = this;
      params.columnFilters = lodash.omitBy(params.columnFilters, (val) => {
        return val == "";
      });
      _.each(params.columnFilters, function (value, key) {
        var currentCol = lodash.filter(self.columns, {
          field: key,
        })[0];
        if (lodash.has(currentCol["filterOptions"], "filterFn")) {
          var getConditionsFunc = new Function(
            "return " + currentCol["filterOptions"].filterFn
          )();
          var condition = getConditionsFunc(value, moment, key);
          console.log(JSON.stringify(condition));
          columns.push(condition);
        } else {
          let col_val = "(" + value + ")";
          let filterColumn = lodash.has(
            currentCol["filterOptions"],
            "filterColumn"
          )
            ? currentCol["filterOptions"]["filterColumn"]
            : key;
          columns.push({
            [filterColumn]: {
              $regex: col_val,
              $options: "i",
            },
          });
        }
      });
      if (!_.isEmpty(columns)) {
        this.tableAPI.addQuery({
          $and: columns,
        });
        this.parameters.queryParam = lodash.extend(this.parameters.queryParam, {
          $and: columns,
        });
      } else {
        this.tableAPI.removeQuery("$and");
        delete this.parameters.queryParam["$and"];
      }
      // this.tableAPI.addLimit(this.parameters.limit);
      console.log(this.parameters.queryParam);
      this.skip = 0;
      this.getRecords();
    },

    selectionChanged(params) {
      // this.rowsToBeExported=params.
      this.selectedRows = params.selectedRows;
      console.log("params in selectionChanged::::" + JSON.stringify(params));
      this.$emit("selectionChanged",this.selectedRows)
    },

    //Get currently clicked row's data
    onRowClick(params){
      this.$emit("dataTableRowClicked",params.row)
    },

    getRecords() {
            if (!_.isEmpty(this.parameters.rows)) {
        this.isStaticInfo = true;
        this.renderTableWithStaticData();
      } else if (this.parameters.isRestify) {
        this.getRecordsUsingRestify();
      } else {
        this.getRecordsUsingAjax();
      }
    },
    getRecordsUsingRestify() {
      this.isDataLoading = true;
      this.tableAPI.addSkip(this.skip);
      this.tableAPI.addLimit(this.perPage);

      if (this.parameters.aggregation) {
        this.tableAPI.addAggregation(this.parameters.aggregation);
      }

      this.rows = [];
      this.getCount(); //get count of totalRecords
      var self = this;
      if (this.parameters.select) {
        this.tableAPI.addSelectColumns(this.parameters.select);
      }
      this.tableAPI.find(this.parameters.apiName, (error, response) => {
        this.isDataLoading = false;

        if(!response){
          return;
        }
        if (lodash.isPlainObject(response) && response.status === 403) {
            return this.notifyError(lodash.get(response, "message", "Error while fetching data"));
        }
          self.rows = response;
          if(this.parameters.isApproval){
            this.$store.commit("setShowLoader",false);

          }
          this.$emit("refreshCount");
          return;
      });
    },
    getCountForAjax() {
      var self = this;
      let params = {
        skip: 0,
        sendCount: true,
      };
      AjaxService.getJson(
        this.parameters.apiName,
        params,
        (error, response) => {
          this.isDataLoading = false;
          if (response && response.data) {
            self.totalRecords = response.data.count;
          } else {
            console.log("error occured");
          }
        }
      );
    },

    getRecordsUsingAjax() {
      var self = this;
      //changes for pagination for ajax
      //this.getCountForAjax();
      this.isDataLoading = true;
      const params =  {
        tableName: this.parameters.tableName,
        skip: this.skip,
        limit: this.perPage,
        queryParam : this.parameters.queryParam
      };
      AjaxService.getJson(
        this.parameters.apiName,
        params,
        (error, response) => {
          this.isDataLoading = false;
          if (response) {
            console.log("response::",response)
            //adding total record count to vue-good-table for pagination
            self.totalRecords = response.data.count;
            let rows = []
            if (response.data) {
              if (response.data.hasOwnProperty('status') && !response.data.status) {
                response.data.hasOwnProperty('message') && this.notifyError(response.data.message)
                console.error(response.data)
              }
              rows = response.data.response;
            } else {
              rows = response;
            }

            /**
             * Purpose: This block checks if the 'formatDataBeforeRender' function is provided as a parameter to the DataTable component.
             * If available and valid, it modifies the rows' data accordingly; otherwise, it keeps the original data intact.
             *
             * Note: The 'formatDataBeforeRender' key is passed from the parent component to enable data modification.
             */
            if (self.parameters && self.parameters.formatDataBeforeRender && typeof (self.parameters.formatDataBeforeRender) == 'function') {
              self.rows = self.parameters.formatDataBeforeRender(rows);
            } else {
              self.rows = rows;
            }
            this.$emit("refreshCount");
          } else {
            console.log("error occured");
          }
        }
      );
    },
    refreshRow(response, index) {
      this.$set(this.rows, index, response);
    },
    loadConfiguration() {
      var self = this;
      var arr = ["showPaginationOptions", "showSortOptions"];
      arr.forEach((val, index, arr) => {
        self.parameters[val] =
          self.parameters[val] == null ? true : self.parameters[val];
      });
    },

    mountDatepicker() {
      let inputs = ['input[placeholder="YYYY-MM-DD"]'];
      const enterKeyEvent = new KeyboardEvent("keyup", {
        bubbles: true,
        cancelable: true,
        keyCode: 13,
      });
      for (let index = 0; index < inputs.length; index++) {
        if ($(inputs[index])) {
          $(inputs[index]).daterangepicker({
            timePicker: true,
            autoApply: true,
            autoclose: true,
            autoUpdateInput: false,
            opens: "left",
            locale: {
              cancelLabel: "Clear",
            },
          });
          $(inputs[index]).on("apply.daterangepicker", function (ev, picker) {
            $(this).val(
              picker.startDate.format("YYYY-MM-DD HH:mm") +
                " to " +
                picker.endDate.format("YYYY-MM-DD HH:mm")
            );
            this.dispatchEvent(enterKeyEvent);
          });

          $(inputs[index]).on("cancel.daterangepicker", function (ev, picker) {
            $(this).val("");
            this.dispatchEvent(enterKeyEvent);
            // $(inputs[index]).trigger('keyup');
            // Materialize.updateTextFields();
          });
        }
      }
    },
    renderTableWithStaticData() {
      this.totalRecords = this.parameters.rows && this.parameters.rows.length;
      let records = lodash.slice(
        this.parameters.rows,
        this.skip,
        this.totalRecords
      );
      this.rows = lodash.slice(records, 0, this.perPage);
    },
    destroyBusEvents(){
      let busEvents = [
          "refreshTable",
          "deleteRow",
          "editRow",
          "tableLoader",
          "tableLoader",
          "updateTable",
          `${"refreshTable__" + this.refreshEventName}`
        ];
      EventBus.$off(busEvents);
    },
    init() {
      let that = this;
      this.destroyBusEvents();
      window.addEventListener("beforeunload", this.preventNav);
      this.$once("hook:beforeDestroy", () => {
        window.removeEventListener("beforeunload", this.preventNav);
      });
      EventBus.$on("refreshTable", () => {
        this.refreshTable();
      });
      //When two or more data tables are present on the same page, an event named 'refreshTable' will be emitted.
      //This event includes a parameter called 'refreshEventName' which serves the purpose of triggering a specific data table to refresh.
      EventBus.$on("refreshTable__" + this.refreshEventName, () => {
        this.refreshTable();
      });
      EventBus.$on("deleteRow", (index) => {
        this.deleteRow(index);
      });
      EventBus.$on("editRow", (propData) => {
        this.editRow(propData);
      });
      EventBus.$on("tableLoader", function (data) {
        data.loading
          ? (this.isDataLoading = true)
          : (this.isDataLoading = false);
      });
      EventBus.$on("updateTable" + this.parameters.event_name, (data) => {
        if (that.rows.length <= 0) return;
        let row;
        if (data.index != undefined) {
          row = that.rows[data.index];
        } else {
          if (!data._id) return;
          row = _.find(that.rows, (row) => row._id == data._id);
        }
        for (var key in data.updateProperty) {
          row[data.updateProperty[key]] =
            data.response[data.updateProperty[key]];
        }
      });
    },
    preventNav(event) {
      if (!this.$store.state.isTableInEditMode) return;
      event.preventDefault();
      event.returnValue = "";
    },
  },

  created() {
    this.loadConfiguration();
  },
  async beforeMount() {
    console.log("Datatable::beforemount ", this.parameters.tableName)
        _.isBoolean(this.parameters.showTableToolbar)
      ? (this.showTableToolbar = this.parameters.showTableToolbar)
      : (this.showTableToolbar = true);
    this.getComponent = true;
    if (this.parameters.isStaticTable) {
      this.rows = this.parameters.rows;
      this.getFilterColumns();
      this.getGlobalSearchColumns();

      // Render records for provided page Number
      const pageChangeEvent = `pageChange__${this.parameters.tableName}`;
      EventBus.$on(pageChangeEvent, (pageNumber) => {
        // Render only if the current page number and the input page number are different
        if(pageNumber == this.currentPage){
          return;
        }
        this.currentPage = pageNumber;
      });
      return;
    }
    this.init();
    this.tableAPI = new TableAPIService();
    await this.getTableHeaders();
    this.getFilterColumns();
    this.getGlobalSearchColumns();
    this.tableAPI.addLimit(this.parameters.limit);
    console.log(this.parameters.queryParam);
    this.tableAPI.addQuery(this.parameters.queryParam);
    if (this.parameters["initialSort"]) {
      this.tableAPI.addSortCondition(this.parameters["initialSort"]);
    }
    this.getRecords(); // getrecords on loading
    return;
    // }
    // Added new property 'data'
    this.parameters.rows = this.rows;
  },
  beforeDestroy() {
    const pageChangeEvent = `pageChange__${this.parameters.tableName}`;
    const eventsToDestory = [pageChangeEvent]
    EventBus.$off(eventsToDestory);
  },
  beforeRouteLeave: function (to, from, next) {
    alert();
  },
  updated() {
    this.mountDatepicker();
    this.$emit("on-updated", this.rows);
    console.log("Datatable::updated " + this.parameters.tableName);
  },
};
</script>

<style lang="scss">
// CSS Vraibles - Keep here temporaray
// @import "../idp/_idpGlobal";
@import "../idp/_idpVariables";
@import "../idp/_idpGlobal.scss";
.table-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--space-base);
  .train-actions{
    button{
      // height: 2.5rem;
      // padding: 7px 10px;
      font-size: 12px;
      height: auto !important;
      padding: 0.533rem 1rem !important;
    }
  }
   .kp-toolbar-input {
     .el-input__suffix{
       top:-5px
     }
   }
  .page-title {
    margin-left: 0 !important;
    margin-right: auto !important;
    .page-title-text {
      font-style: normal;
      font-weight: 600;
      font-size: var(--font-lg) !important;
      line-height: 27px;
      color: #4a5568 !important;
    }
  } // | Page title

  .support-btn {
    .el-button {
      font-weight: 400;
      margin-left: 12px;
      height: auto !important;
      padding: 0.533rem 1rem !important;
    }
    .refreshbtn{
      background-color: var(--dark-07);
      color: var(--dark-04);
      font-size: var(--font-base);
          i.mdi {
            font-size: 1rem;
          }
    }
  } // Support btn

  .search {
    position: relative;
    width: 13rem;
    margin-left: 1rem;
    .search-icon {
      position: absolute;
      z-index: 1;
      color: #a0aec0;
      left: 6px;
      top: 1px;
      bottom: 17px;
      font-size: 18px;
    }
    input {
      background-color: var(--dark-07);
      padding: var(--space-sm) 2.5rem var(--space-sm) 2.5rem;
      color: var(--dark-02);
      border-radius: var(--radius-base);
      border: 0;
      font-size: var(--font-base);
      outline: none;
      height: 26px;
      line-height:20px;
      &::placeholder {
        color: var(--dark-05);
        font-weight: normal;
        font-size: 12px;
      }
    }
  } // | Search

  .filter-container {
    margin-left: 1rem;
    width: 13rem;
    .advanced-filter-btn {
      padding: 0;
      width: 100%;
      height: 26px;
      display: inline-block;
      padding-left: 34px;
      text-align: left;
      background-color: var(--dark-07);
      border: 0.5px solid #ebedf8;
      font-weight: 400;
      position: relative;
      font-size: 12px;
      color: var(--dark-04);
      position: relative;
      display: flex;
      justify-content: flex-end;
      .left-icon {
        position: absolute;
        left: 0.8rem;
        color: var(--dark-04);
         font-size: var(--font-md);
      }
      .right-icon {
        position: absolute;
        right: 0.6rem;
        font-size: 1.8rem;
        top: 0px;
        color: var(--dark-04);
      }
    }
  } // | filter

  .export-btn {
    margin-left: 1rem;
    .el-button {
      background-color: var(--dark-07);
      font-size: 1.55rem;
      border: 0;
      padding: 0.34rem 0.5rem;
      color: var(--dark-04);
    }
  }
} // | table toolbar

.ellipsis {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 200px;
  //Adding Max Width, so that only description in list view is shown partially(ellipsis)
  max-width: 200px;
}

.page-vue-good-table {
  .CodeMirror {
    height: 100px;
    width: 300px;
  }
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
}

/////////////////////////////////// NEW CSS ////////////////////////////////////////////////////

// top section

.kp-top-section-container {
  margin-top: 20px;
  .section-labels {
    display: inline-block;
    width: 19%;
    margin: 0 10px 0 0;
    background: #fff;
    box-shadow: 0 0px 20px rgba(0, 32, 52, 0.05);
    padding: 16px;
    border-radius: 5px;
    &:last-child {
      margin: 0 0px 0 0;
    }
    h2,
    p {
      margin: 0;
    }
    h2 {
      font-weight: normal;
      font-size: 16px;
      color: rgba(33, 33, 33, 0.6);
    }
    p {
      font-weight: bold;
      color: #212121;
      font-size: 28px;
    }
    .label-icon {
      display: inline-block;
      float: right;
      border-radius: 100px;
      padding: 10px;
      font-size: 18px;
    }
    .kp-label-info1 {
      color: #00a7e0;
      background: #e3f5fc;
    }
    .kp-label-info2 {
      color: #006c0a;
      background: #d5ffd8;
    }
    .kp-label-info3 {
      color: #945707;
      background: #ffedd5;
    }
    .kp-label-info4 {
      color: #ee3b3b;
      background: #ffd5d5;
    }
  }
}
// end top section

.view-good-table-toolbar-container {
  .view-good-table-toolbar {
    padding: 0px;
    margin-bottom: 8px;
    margin: 10px;
    // box-shadow: 0 0px 20px rgba(0, 32, 52, 0.05);

    .search-container {
      margin-top: 9px;
      .search {
        padding-top: 8px;
        padding: 0px;
        margin-left: 16px;

        .el-input__suffix {
          top: -5px;
        }
        .search-icon {
          position: absolute;
          z-index: 1;
          color: #a0aec0;
          padding: 6px 0px 0px 3px;
          font-size: 14px;
        }
      }
    }
    input {
      height: 28px;
    }

    .left-block {
      .kp-page-title {
        color: #4a5568;
        font-size: 20px;
        font-weight: 600;
        font-style: normal;
        margin-top: 8px;
        padding-left: 0px;
      }
    }

    .right-block {
      button {
        margin: 8px 0px 0px 16px;
      }

      .kp-toolbar-input {
        input {
          background-color: #f1f3fb;
          border: none;
          height: 28px;
          border: 0.5px solid #ebedf8;
          width: 100%;
        }
        input::placeholder {
          color: #a0aec0;
          font-size: 12px;
          font-weight: normal;
        }
      }

      .advanced-filter-btn {
        width: 13rem;
        display: inline-block;
        height: 28px;
        background-color: #f1f3fb;
        border: 0.5px solid #ebedf8;
        margin: 8px 0px 0px 16px;
        position: relative;
        span.right-icon {
          position: absolute;
          top: 2px;
          right: 4px;
          font-size: 24px;
          color: #718096;
        }
        span.left-icon {
          position: absolute;
          top: 6px;
          left: 8px;
          font-size: 16px;
          color: #718096;
        }
      }

      .export {
        button {
          padding: 2px;
          margin: 8px;
          background-color: var(--dark-07);
          margin-right: 16px;
        }
      }

      .kp-btn-toolbar {
        border: none;
        color: #718096;
        border: none;
        font-size: 17px;
        padding: 2px;
        margin: 8px;
        background-color: var(--dark-07);
        margin-right: 16px;
      }
    }
  }

  .space-toolbar {
    font-size: 0.1px;
    display: inline-block;
  }
  .kp-btn-primary {
    background: #005da6;
    color: #ffffff;
    i {
      color: #ffffff;
      font-size: 16px;
    }
  }

  .btn-export {
    transform: rotate(-90deg);
    display: inline-block;
  }
}

// .custom-th-class {
//   background: #f7f7f7;
//   color: #00a7e0;
//   font-weight: 300;
//   vertical-align: top;
// }

///////////////////////////////// New STyle

// table.vgt-table {
//     font-size: 16px;
//     border-collapse: collapse;
//     background-color: #F7F7F7;
//     width: 100%;
//     max-width: 100%;
//     table-layout: fixed;
//     border: 1px solid #DCDFE6;
// }
// .vue-good-table-box {
//     box-shadow: 0 0px 20px rgba(0, 32, 52, 0.05);
//     border-radius:5px;
//     overflow: hidden;
// }
// .scrollable.only-y {
//     padding: 20px;
// }
// .vgt-wrap {

// }
// .vgt-table thead th {
//     font-size: 13px;
//     background: #f7f7f7;
//     color: #00a7e0;
//     font-weight: 700;
//     vertical-align: top;
// }
// .vgt-table tbody tr {
//    border-bottom: .1px solid #EAEAEA;
//    border: thin;
// }
// .vgt-table tbody td {
//          font-size: 13px;
//          padding: .4em .4em .4em .9em !important;
// }
// table.vgt-table td {
//     vertical-align: top;
//     border-right: .1px solid #EAEAEA;
// }

// .vgt-table thead th.sorting-asc, .vgt-table thead th.sorting-desc {
//         color: #00a7e0;
// }
// .vgt-table tbody tr:nth-child(odd) {
//         background: #ffffff;
// }
// .vgt-responsive {
//    overflow-x:auto;
//     overflow-y:visible;
//     width:100%;
// }

// .vgt-table thead tr th {
//         overflow:hidden;
// }
// .vgt-table tbody tr td {
//         div{
//             word-break: break-all;
//         }
// }

// .vgt-table tbody tr td.action-col:last-child,
// .vgt-table thead tr th.action-col:last-child {
//      background: #ffffff !important;
//     position: sticky;
//     right: 0;
//      box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
//      width:50px !important;
//      z-index:99;
// }
// .el-dropdown-link {
//     border: 0;
//     padding: 5px !important;
//      i {
//          font-size: 16px;
//      }
// }
/* table action fixed */

// custam Theme for table

// .mytheme{
//     thead{
//         tr {
//              &:first-child{
//                   th {
//                       background: #F0F0F0;
//                     animation-name: line-item;
//                       animation-duration: .7s ;
//                       transition-timing-function: ease-in-out;
//                   }
//             }
//             td {
//                 span {
//                     font-weight: 300;
//                     color: #212121;
//                 }
//             }
//         }
//     }
//     tbody {
//         tr {
//             &:hover {
//                 background: #DCEBFF;
//             }
//             td {
//                 padding: 0 !important;
//             }
//         }
//     }
// }

// @keyframes line-item {
//     from {background-color: #065aa1;}
//     to {background-color: #F0F0F0;}
// }

.error-info {
  color: #d33d3d;
}
.vgt-left-align {
  .el-input__suffix {
    // line-height: 2.2;
  }
}

.line-table {
  .vgt-wrap__footer {
    position: absolute !important;
    z-index: 99;
    width: 100%;
    bottom: 38px;
    border-top: 4px solid var(--white)  !important;
  }
  .vue-good-table-box {
    .vgt-table {
      .el-input__suffix {
        right: 0 !important;
      }
      thead th {
        padding: 0px;
        input {
          font-size: 0.9rem;
          padding: 0 0.4rem;
          border: 0;
          border-radius: 2px;
          height: 1.5rem;
          margin-bottom: 4px;
          line-height:16px !important;
        }

        .selected-cell {
          span.text {
            // color:var(--white);
            text-align: center;
          }
          input {
            // color: var(--dark-03);
          }
        }
        .unselected-cell {
          span.text {
            text-align: center;
            color: #a0b9cf;
            background-color: #e2e2e2;
          }
        }
      }

      tbody tr td {
        padding: 0px !important;
      }

      .selected-cell {
        // background: var(--brand-04);
        padding: 0px 0.5rem;
        input {
          // color : var(--white)
        }
        span {
          // color : var(--white)
        }
      }

      .unselected-cell {
        // background: var(--dark-06);
        padding: 0px 0.5rem;
        input {
          color: #a0b9cf;
        }
        background-color: #e2e2e2;
      }

    }
  }
      .vgt-responsive::-webkit-scrollbar {
          height: 10px !important;
          border-radius: 100px !important;
          -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3) !important;
      }
}

.po-details-popup{
  height:100%;
  .vue-good-table-box{
    height:100%;
    .vgt-wrap {
    height:100%;
      .vgt-inner-wrap{
        height:100%;

        .vgt-responsive{
          max-height: unset !important;
          height: 100%;
        }
        .vgt-responsive::-webkit-scrollbar {
          height: 10px !important;
          border-radius: 100px !important;
          -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3) !important;
        }
      }
    }
  }


  .vue-good-table-box .vgt-table thead th{
    font-size: 12px;
  }
}

// Variable Style
.vue-good-table-box {
  .vgt-table {
    border: 0;
    background: var(--dark-09);

    thead {
      th {
        background: var(--dark-07);
        color: var(--dark-01);
        font-weight: 400;
        font-size: var(--font-sm);
        border: 0;
        padding: var(--space-sm) var(--space-sm) var(--space-sm) var(--space-base);
      }
       th.action-col  {
          position: sticky !important;
          right: 0;
        }
        th.view-action-col  {
          position: sticky !important;
          right: 4.35rem;
        }
      th.sortable:before {
        border-left: 0.4rem solid transparent;
        border-right: 0.4rem solid transparent;
        // border-top: 0.4rem solid var(--dark-05);
      }
    }
    tbody {
      tr:hover {
        background: var(--dark-08);
      }
      tr {
        td {
          border: 0;
          font-size: var(--font-base);
          padding: var(--space-sm) var(--space-sm) var(--space-sm)
            var(--space-base) !important;
          color: var(--dark-03);
          vertical-align: unset;
        }
        td.action-col {
          width: 4.5rem;
          background: var(--dark-09);
          position: -webkit-sticky;
          position: sticky;
          right: 0;
          padding-right: 0  !important;
          -webkit-box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
          box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
          z-index: 99;
          .el-button {
            border-radius: var(--radius-round);
            border: 0px;
            color: var(--dark-03);
            // padding:.3rem .3rem;
             padding: .2rem;
            background: transparent;
            font-size: 1.2rem;
          }
          .el-button:hover {
            color: var(--brand-04);
          }
        }
        td.view-action-col {
          width: 4.35rem;
          background: var(--dark-09);
          position: -webkit-sticky;
          position: sticky;
          right: 4.35rem;
          padding-right: 0  !important;
          -webkit-box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
          box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
          z-index: 99;
          .el-button {
            border-radius: var(--radius-round);
            border: 0px;
            color: var(--dark-03);
            padding: .2rem;
            background: transparent;
            font-size: 1.2rem;
          }
          .el-button:hover {
            color: var(--brand-04);
          }
        }
        td.action-col.single-action-col {
          width: 3.5rem !important;
        }
      }
    }
  } // | vgt-table

  .vgt-wrap__footer {
    background: var(--dark-07);
    color: var(--dark-03);
    border: 0;
    padding: var(--space-sm) var(--space-base);
    font-size: var(--font-sm);
    .footer__row-count__label {
      font-size: var(--font-sm);
    }
    .footer__row-count__select {
      color: var(--dark-04);
      font-weight: 400;
      font-size: var(--font-sm);
    }
    .footer__navigation {
      font-size: var(--font-sm);
      font-weight: 400;
      color: var(--dark-04);
      span {
        font-weight: 400;
        color: var(--dark-04);
      }
    }

    .footer__navigation__page-btn {
      .chevron.right::after {
        border-left: 0.375rem solid var(--dark-04);
      }
      .chevron.left::after {
        border-right: 0.375rem solid var(--dark-04);
      }
    }
  } // | vgt-table footer
}
.no-p {
  button {
    padding-left: 5px !important;
    padding-right: 5px !important;
  }
}
// | Variable Style

.line-table {
  .vue-good-table-box {
    .el-input__inner {
      font-size: var(--font-base);
    }
  }
  .vue-good-table-box .vgt-table tbody tr td {
    border-right: 1px solid var(--dark-07) !important;
    padding: 0rem 0.5rem 0rem 1rem;
    font-size: var(--font-base);
    &.action-col {
      display: block !important;
      background: var(--white);
      position: sticky;
      text-align: right;
      right: 0;
      -webkit-box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
      box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
      z-index: 99;
      .el-button {
        border-radius: var(--radius-round);
        padding: var(--space-xxs);
        border: 0px;
      }
    } // | action-col
    .kp-docx-input {
      display: flex;
      .el-input__inner {
        padding: 0 21px 0 var(--space-md);
        &::placeholder {
          color: var(--dark-02);
          opacity: 1;
        }
      }
    }
  }

  .vue-good-table-box .vgt-table thead th {
    background: var(--main-bg-color);
    border-right: 1px solid var(--dark-07);
    font-size: var(--font-base);
    position: relative;
    text-align: center;
    span span {
      // text-overflow: ellipsis;
      // overflow: hidden;
      // display: inline-block;
      // white-space: nowrap;
      // width: 70%;
      // color: var(--dark-02);
    }
  }

  .vue-good-table-box .vgt-table thead th:hover {
    span {
      // position: absolute;
      // overflow: visible;
      // top: .5px;
      // left: 3.5px;
      // width: 100px;
      // background: #edf2f7;
      // padding: 5px;
      // border-radius: 1px;
      // z-index: 99;
    }
  }

  .vue-good-table-box .vgt-table tbody tr:nth-child(even) {
    background: var(--dark-08);
  }
  .vue-good-table-box .vgt-table tbody tr:nth-child(odd) {
    background: #ffffff;
  }
  .vue-good-table-box .vgt-table tbody tr{
    border-bottom:1px solid #eaeaea;
  }
} // | Line Item

// Popover

.el-popover.kp-popover-daterangepicker {
  background: var(--white) !important;
  border: 0 !important;
  border-radius: var(--radius-base) !important;
  position: relative;
  // top: 11% !important;
  // left: 78.5% !important;
  top: 6.2rem !important;
  right: 4.5rem !important;
  left: auto !important;
  overflow: visible !important;
  width: 21rem !important;
  .popper__arrow {
    display: none;
  }
  .daterange {
    .el-button {
      font-weight: 500;
      height: 2.4rem;
      border: 1px solid var(--brand-08);
    }
    .el-date-editor {
      background: transparent;
      .el-range-input {
        border: 1px solid var(--brand-08);
        height: 2.6rem;
        font-size: var(--font-base) !important;
        color: var(--brand-03);
        width: 48%;
        box-sizing: border-box;
        &::placeholder {
          color: var(--brand-07);
          font-size: var(font-sm) !important;
        }
      }
    }
    .from,
    .to {
      font-size: var(--font-md);
    }
  }
}
.el-popover.kp-popover-daterangepicker::before {
  content: "";
  border-bottom: 12x solid #cc0000 !important;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  position: absolute;
  top: -20px;
}
// Popover


// linetable popover
div.line-popover {
  background: var(--white) !important;
  border: 0 !important;
  border-radius: var(--radius-base) !important;
  position: relative;
  // top: 6.2rem !important;

  overflow: visible !important;
  padding: var(--space-lg);
  z-index: 9999 !important;
  width: 22rem;
  .kp-form-field {
    margin-bottom: 0.5rem;
    .el-form-item__label {
      line-height: unset;
      font-size: var(--font-base);
      color: var(--dark-04);
    }
  }
  .el-input {
    font-size: var(--font-base);
    .el-input__inner {
      height: 28px;
      background: var(--dark-07);
      border: 0;
    }
  }
  .el-button {
    line-height: 0;
    // padding: 14px 15px;
    font-size: 12px;
    font-weight: 400;
  }
}


// advance popover
div.advanced-popover {
  background: var(--white) !important;
  border: 0 !important;
  border-radius: var(--radius-base) !important;
  position: relative;
  right: 3rem !important;
  left: auto !important;
  overflow: visible !important;
  padding: var(--space-lg);
  z-index: 9999 !important;
  width: 22rem;
  .kp-form-field {
    margin-bottom: 0.5rem;
    .el-form-item__label {
      line-height: unset;
      font-size: var(--font-base);
      color: var(--dark-04);
    }
  }
  .el-input {
    font-size: var(--font-base);
    .el-input__inner {
      height: 28px;
      background: var(--dark-07);
      border: 0;
    }
  }
  .el-button {
    line-height: 0;
    // padding: 14px 15px;
    font-size: 12px;
    font-weight: 400;
  }
}
// | advance popover

.vgt-table.striped tbody tr:nth-of-type(odd) {
  background-color: var(--dark-08) !important;
}

//Setting Width of the tooltip, that displays after we hover over description cell
.el-tooltip__popper.is-light{
  max-width:  100rem;
}

.search-container-ai {
  position: relative;
  margin-bottom: 1rem;

  // form {
    // display: flex;
    // align-items: center;
    // gap: 5px;

    button {
      padding: 14px;
      // padding-left: 0.55rem;
      // padding-right: 0.5rem;
      height: 1.8rem;
      width: 2.167rem;
    }

    input {
      // border-radius: 0px;
      padding-left: 2rem;
    }
  // }

  .search-icon {
    position: absolute;
    color: var(--dark-04-5);
    left: var(--space-sm);
    top: 7px;
    font-size: 18px;
    z-index: 100;
  }

  input[type="text"] {
    font-size: var(--font-base);
    border: var(--border-base) solid var(--dark-06);
    padding-left: 2.4rem;
    background: var(--white);
    display: inline-block;
    height: 3.15rem;
    line-height: 20px;
    border-radius: .3rem;
    color: var(--dark-02);

    &::placeholder {
      color: var(--dark-04-5);
      opacity: 1;
      font-size: var(--font-base);
    }

    &:focus {
      border: 1.5px solid var(--brand-05);
    }
  }


    span {
      font-size: var(--font-lg);
      // color: var(--dark-03);
    }

    .el-button{

      position: absolute;
      right: 4px;
      top: 3px;
      font-size: 18px;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: var(--space-xxs);

    //   .mdi-magnify{
    //     color: var(--white);
    //   }
    }
    .el-input--suffix .el-input__inner{
      padding-right: 5rem;
    }
    .el-icon-circle-close{
      position: absolute;
      right: 2.5rem;
    }

    .code-tag-btn.el-button--default{
      background: transparent;
      border: none;

    }

    .code-tag-btn.el-button--default:hover{
      background: rgb(237, 242, 247);
      // border: 0.0625rem solid #cbd5e0 !important;
    }

    .code-tag-btn{
      border: none;
      i {
          // color: var(--dark-03);
          font-size: 20px;
        }
    }

  }
</style>
