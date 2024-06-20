<template>
  <!-- download dashboard button -->
  <div class="dashboard-container" id="capture">

    <div class="dashboard-header">
      <div class="header-left-side">
        <div class="title">{{title}}</div>
        <!-- Select Document Type -->
        <div class="select-doc-type" v-if="showPageTabs">
          <div class="doc-type-container">
              <el-button v-for="(docTypeLabel, docType) in permittedDashboardPagesMapping" :key="docTypeLabel" :cid="docTypeLabel" class="btn" :class="{'active' : activeTabName == docTypeLabel}" @click="showPageWiseDashboard(docType)">
                <span class="check-box"></span>{{docTypeLabel}}
            </el-button>
          </div>
        </div>
        <el-tag class="sub-tier" type="info" size="medium" effect="plain" v-show="showTierDetails()">Subscription Tier {{ subscriptionData.tier }}: 
          <span class="bold-number">{{ getContractPageCount }}</span>
        </el-tag>
      </div>

    <!-- Select vendor name drop down  -->
    <!-- vendor name selection filter only for operations -->
    <div v-if="currentDashboard == 'operations' && activeTabName==getLabelByDocType('invoice')" class="select-vendor-name" >
        <el-select 
          remote 
          :remote-method="filterVedorNames" 
          :loading="loading" 
          @change="handleChangeVendorName" 
          v-model="selectedVendorNames" 
          popper-class="vendor-dropdown" 
          placeholder="Select Vendor Name" 
          multiple 
          :multiple-limit="15" 
          collapse-tags 
          filterable 
        >
          <el-option  v-for="item in filteredVendorList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </div>

      <!-- Select file type -->
      <!-- file type filter only for operations and fraud -->
      <div v-if="!isVendorUser() && currentDashboard != 'error_analytics'" class="select-file-type" >
          <el-select @change="handleChangeFileType" v-model="selectedFiletype" placeholder="Select File Type" multiple collapse-tags>
            <el-option v-for="(value, key) in filetypeList" :key="key" :label="value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()" :value="value" class="select-filter-option"></el-option>
        </el-select>
      </div>

      <!-- Date DropDown -->
      <div v-if="true" class="idp-list-header-date-picker">
          <daterange-picker cid="idp-doc-list-datepicker" :date_filters="date_filters" @applyDateFilter="applyDateFilter" v-bind:date.sync="clonedDate" :date="date" :subscriptionStartDate="subscriptionStartDate"></daterange-picker>
      </div>

      <!-- Select org  -->
      <div v-if="!isVendorUser() && !dashboard_type.includes(currentDashboard)">
        <div class="slect-org"  v-if="!businessUnitList">
            <org-hierarchy-list :onSelectEventName="onSelectEventName" :hideHigherThanLevel="hideHigherThanLevel" :selectedValue="selectedOrg" ref="orgComp"></org-hierarchy-list>
        </div>
        <!-- Select BU -->
        <div class="slect-org" v-else>
          <el-select @change="handleChangeBU" v-model="selectedBU" clearable placeholder="Select Business Unit">
            <el-option v-for="item in businessUnitList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        </div>
      <!-- Action buttons -->
      <el-dropdown v-if="showHeaderDropdown" @command="handleCommand">
        <el-button cid="idp-doc-list-actions" class="el-dropdown-link vertical-icon idp-dropdown" size="mini"><i
            class="el-icon-more"> </i></el-button>
        <el-dropdown-menu cid="idp-doc-list-action-dropdown" class="kp-action-wrapper-drowdown"
          slot="dropdown">

          <el-dropdown-item cid="idp-doc-list-actions-export" :disabled="!isDashboardLoaded" command="export">
            <span class="mdi mdi-arrow-down-thin-circle-outline"> Export</span>
          </el-dropdown-item>
          <el-dropdown-item cid="idp-doc-list-actions-premittedWidgets" command="widget">
            <SlushBucketPopover :source="widgetsToBeSelected.source" :destination="widgetsToBeSelected.destination"
              label="Widgets" :handleSelection="handleWidgetSelection" :handleSave="saveUserPreference" :isSlushBucketVisible="isSlushBucketVisible" @update-visibility="handleWidgetMenuVisiblity">
            </SlushBucketPopover>
          </el-dropdown-item>

        </el-dropdown-menu>
      </el-dropdown>

    </div>
  </div>
</template>

<script>
import EventBus from "@/EventBus";
import moment from "moment";
import _ from "lodash";
import store from "@/store/store";
import CustomerService from "@/idp/services/CustomerService";
import UserService from "@/idp/services/UserService";
import Constants from "@/resources/Constants";
import DaterangePicker from "../../components/Daterangepicker.vue";
import OrgHierarchyList from "@/idp/components/OrgHierarchyList.vue";
import {mapState} from 'vuex';
import {docTypeLabelMapping} from "@/util/CommonUtil";
import DomainVendorMap from "@/idp/services/DomainVendorMap";
import SlushBucketPopover from "@/idp/main/components/SlushBucketPopover.vue";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import IdpDashboardService from "@/idp/services/IdpDashboardService";
import { getStartDateForCurrentYear } from '@/util/CommonUtil';

export default {
  name: "DashboardHeader",
  data(){
    const storage = JSON.parse(localStorage.getItem("vuex"));
    const userOrg = storage["user"] && storage["user"]["org"] ? storage["user"]["org"] : null;
    return {
      widgetsToBeSelected: {
        source: [],
        destination: []
      },
      isSlushBucketVisible:false,
      previousSelectedWidgets: [],
      isUserPreferenceUpdated: false,
      dashboard_type: ["error_analytics", "fraud_analytics"],
      showPageTabs: true,
      hideHigherThanLevel: userOrg,
      date_filters:['last_7_days', 'last_30_days', 'last_year'],
      filetypeList:"",
      businessUnitList:[],
      widgetFilterPopoverModel:false,
      selectedWidgets:[],
      clonedDate: {
        name: "",
        label: "",
        value: [
          moment().startOf("year").format("DD MMM YY"),
          moment().format("DD MMM YY"),
        ],
      },
      permittedDashboardPages: [],
      permittedDashboardPagesMapping: {},
      pagePathMapping: {
        "invoice": "InvoiceDashboard",
        "insurance_quotation": "InsuranceQuotationDashboard",
        "sov": "SOVDashboard",
        "po": "PODashboard",
        "insurance": "InsuranceDashboard",
        "summary": "operations-dashboard"
      },
      vendorList:[],
      filteredVendorList : [],
      onSelectEventName : "DASHBOARD_HEADER",
      subscriptionData: {},
      subscriptionStartDate: ""
    };
  },
  props:{
    "title":{default:""},
    "permittedWidgets":{default:()=>([])},
    "userPreferenceWidgets":{default:()=>([])},
    "updateWidgetGroup":{default:()=>({})},
    "widgetConfig":{default:()=>({})},
  },
  watch: {
    //get the updated widgets 
    permittedWidgets: {
      handler: function (newVal, oldval) {
        if (newVal || oldval) {
          if (this.userPreferenceWidgets.length) {
            this.selectedWidgets = this.userPreferenceWidgets;
          }
          else {
            this.selectedWidgets = _.map(newVal, 'value') || _.map(oldval, 'value');
          }
          // filter selected and unselected widgets, and assign it to slush bucket.
          this.widgetsToBeSelected.source = this.permittedWidgets.filter((field) => !(this.selectedWidgets.includes(field.value)));
          this.widgetsToBeSelected.destination = this.permittedWidgets.filter((field) => (this.selectedWidgets.includes(field.value)));
          // select at least one widget
          if (!this.widgetsToBeSelected.destination.length && this.widgetsToBeSelected.source.length) {
            //The shift() method removes the first item of an array and changes the original array. The shift() method returns the shifted element. 
            this.widgetsToBeSelected.destination = [this.widgetsToBeSelected.source.shift()]
            //get new Widget Group based on current selection
            const widgetGroups = IdpDashboardService.updateWidgetGroup(this.permittedWidgets, this.widgetsToBeSelected.source[0].value, this.widgetConfig);
            this.$emit("updateWidgetGroups", widgetGroups)
            //Store user preferences
            this.updateUserPreference();
          }
        }
      },
      immediate: true,
      deep: true,
    }
  },
  computed: {
    //This function is used to format a 'contract page count' using the numbering system (X,XX,XXX)
    getContractPageCount() {
      return this.subscriptionData.hasOwnProperty('contract_page_count') && this.subscriptionData.contract_page_count.toLocaleString();
    },
    selectedVendorNames:{
      get() {
        return this.$store.state.dashboardStore.headerFilters[this.currentDashboard].selectedVendors;
      },
      set(value) {
        this.currentDashboard == "operations" && this.$store.commit('dashboardStore/setOperationsVendorNames', value);
      }
    },
    currentDashboard:{
      get() {
        return this.$store.state.dashboardStore.currentDashboard;
      }
    },
    isDashboardLoaded(){
        return this.$store.getters["dashboardStore/isDashboardLoaded"]
    },
    selectedFiletype: {
      get() {
        let fileType =  this.$store.state.dashboardStore.headerFilters[this.currentDashboard].file_type;
        return fileType;
      },
      set(value) {
        this.currentDashboard == "operations" && this.$store.commit('dashboardStore/setOperationsFileType', value);
        this.currentDashboard == "fraud_analytics" && this.$store.commit('dashboardStore/setFraudFileType', value);
      }
    },
    selectedBU:{
      get() {
        return this.$store.state.dashboardStore.headerFilters[this.currentDashboard].business_unit;
      },
      set(value) {
        this.currentDashboard == "operations" && this.$store.commit('dashboardStore/setOperationsBusinessUnit',value);
        this.currentDashboard == "error_analytics" && this.$store.commit('dashboardStore/setErrorBusinessUnit', value);
        this.currentDashboard == "fraud_analytics" && this.$store.commit('dashboardStore/setFraudBusinessUnit', value);
      }
    },
    selectedOrg:{
      get() {
        const storage = JSON.parse(localStorage.getItem("vuex"));
        const userOrg = storage["user"] && storage["user"]["org"] ? storage["user"]["org"] : null;
        return this.$store.state.dashboardStore.headerFilters[this.currentDashboard].org || userOrg;
      },
      set(value) {
        this.currentDashboard == "operations" && this.$store.commit('dashboardStore/setOperationsOrg',value);
        this.currentDashboard == "error_analytics" && this.$store.commit('dashboardStore/setErrorOrg', value);
        this.currentDashboard == "fraud_analytics" && this.$store.commit('dashboardStore/setFraudOrg', value);
        this.applyFilter();
      }
    },
    activeTabName:{
      get(){
        let docType = this.$store.state.dashboardStore.headerFilters[this.currentDashboard].document_type;
        docType = docTypeLabelMapping(docType); // lable mapping according to document type
        return docType ? docType : "Summary";
      }
    },
    date:{
      get() {
        let dateFilterName = this.$store.state.dashboardStore.headerFilters[this.currentDashboard].dateFilterName;
        return dateFilterName ? { name: dateFilterName, label: "", value: "" } : { name: "last_30_days", label: "", value: "" }
      },
    },
    orgHierarchy:{
      get() {
        const orgHierarchy = this.$store.getters['dashboardStore/getOrgHierarchy']; ;
        return orgHierarchy;
      },
    },
    showHeaderDropdown: {
      get() {
        const allowedDashboards = ['operations', 'vendor']
        return allowedDashboards.includes(this.currentDashboard)
      },
    }
  },
  methods: {
    showTierDetails() {
      let isTierDetailsVisible = false;
      const dateFilterName = this.$store.getters['dashboardStore/getCurrentDashboardDateFilterName'];
      if (dateFilterName == 'subscription_to_ytd') {
        isTierDetailsVisible = true;
      }
      return isTierDetailsVisible;
    },
    filterVedorNames(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.filteredVendorList = this.vendorList.filter(item => {
              return item && item.toLowerCase().indexOf(query) > -1;
            });
        }, 200);
      } else {
        this.filteredVendorList = [];
      }
    },
    handleCommand(command) {
      const func = this.getCommandMap(command);
      func && func();
    },
    getCommandMap(command) {
      const commandMap = {
        "export": this.exportDashboardData,
        "widget": this.handleWidgetMenuClick
      }
      return commandMap[command];
    },
    handleWidgetMenuClick(){
      this.isSlushBucketVisible = true;
    },
    handleWidgetMenuVisiblity(value){
      this.isSlushBucketVisible = value;
    },
    // get the selected file type from dropdown
    getSelectedFiletypes(){
        const fileTypeListLength = Object.values(this.filetypeList).length;
        const selectedFiletypes = (this.selectedFiletype && this.selectedFiletype.length == fileTypeListLength)  ? "All" : this.selectedFiletype;
        return selectedFiletypes;
    },

    // get the selected BU or Org from dropdown
    getSelectedBUOrg(){
      let selectedBUOrg = "All"
      
      if (this.selectedOrg) {
        //while exporting dashboard for every selected org we have unique org value(ex."pJkLM"), but we need actual label of selected org and that label assigning here.
        selectedBUOrg = this.orgHierarchy
      }
      if (this.selectedBU) {
        selectedBUOrg = this.selectedBU
      }
      return selectedBUOrg;
    },

    // get the selected date filter from dropdown
    getSelectedDateFilter(){
      const selectedDateFilter = this.date;
      // selectedDateFilter can be custom or default - custom is a array of from and to date , while default date is object
      let dateFrom, dateTo, fixedDate;
        if(_.isArray(selectedDateFilter.name)){
          dateFrom = selectedDateFilter.name[0].toISOString() ;
          dateTo = selectedDateFilter.name[1].toISOString() ;
        dateFrom = dateFrom.substr(0, dateFrom.indexOf('T')) || "";
        dateTo = dateTo.substr(0, dateTo.indexOf('T')) || "";
        }else{
        // fixedDate - ex: last_30_days
        fixedDate = selectedDateFilter.name.toUpperCase()
        fixedDate = fixedDate.replace(/_/g, " ") || "";
      }
        return {dateFrom, dateTo, fixedDate};
    },

    // this method to get all the filter which are applied and then export dashboard with data
    exportDashboardData(){
        const selectedDoctype = this.activeTabName && this.activeTabName == "Summary" ? "All" : this.activeTabName;
        const selectedVendor = this.selectedVendorNames && this.selectedVendorNames.length > 0 ? this.selectedVendorNames : "All";
        const selectedFiletypes = this.getSelectedFiletypes()
        const selectedBUOrg = this.getSelectedBUOrg()
        const {dateFrom, dateTo, fixedDate} = this.getSelectedDateFilter()

      // after collecting all filters will generate Pdf
      const filters = {
          selectedDoctype : selectedDoctype, 
          selectedFiletype : selectedFiletypes, 
          selectedVendor : selectedVendor, 
          selectedBUOrg : selectedBUOrg, 
          dateFrom : dateFrom, 
          dateTo : dateTo, 
          fixedDate : fixedDate
      }
      this.generatePdf(filters);
    },

    /*Steps
      1. Get the dashobard DOM container
      2. Convert html to pdf using jspdf
      3. Add filters on exported pdf 
      4. Download html as pdf 
    */
    async generatePdf(filters) {
      // Step 1 : Get the dashobard DOM container
      const [dashboardContainer] = document.getElementsByClassName(
        "dashboard-container"
      );
      // while exporting dashboard due to default height can't able to download the full page so have to set it to auto
      dashboardContainer.style.height = "auto";

      var htmlWidth = $(".dashboard-body").width();
      var htmlHeight = $(".dashboard-body").height();
      var pdfWidth = htmlWidth + (15 * 2);
      var pdfHeight = (pdfWidth * 1.5) + (15 * 2);
      // Step 2: Convert html to pdf using jspdf
      var pdf = new jsPDF('p', 'pt', [pdfWidth, pdfHeight]);

      var pageCount = Math.ceil(htmlHeight / pdfHeight) - 1;
      // step 3 : Add filters on exported pdf 
      // formatting text on exported DB. All the co-ordinates are dashboard specific
      pdf.setFontSize(20);
      pdf.text("Filters", 10, 20)
        pdf.line(10,25,70,25)

      pdf.setTextColor(45, 55, 72)
      pdf.setFont("Segoe UI");

      pdf.setFontSize(17);
      // _.startCase function changing the date format of dateTo and dateFrom(ex.2023-03-13 to 2023 03 13) to avoid that omiting those values.
      const dashboardFilters = _.omit(filters,['dateTo','dateFrom']);
      //capitalize the first letter of every word of filter values(ex:"excel pdf image doc = Excel Pdf Image Doc").
      for (const key in dashboardFilters) {
        let value = dashboardFilters[key]
        if (value && typeof value === "string") {
          value = value.toLowerCase();
          dashboardFilters[key] = _.startCase(value);
        } else if (Array.isArray(value) && !_.isEmpty(value)) {
          dashboardFilters[key] = _.map(value, (val) => { 
            if(val){ val = val.toLowerCase() }
            return _.startCase(val) 
          });
        }
      };
      filters = {...filters, ...dashboardFilters};
      const coordinates = [{ x: 10, y: 90 }, { x: 10, y: 110 }]
      //setting positions dynamically for selectedVendor and selectedFiletype only if their value is not equal to All
      let coordinate = coordinates.shift();
      if (this.checkIfVendorFilterApplicable(filters)) {
        pdf.text("Vendors: " + filters.selectedVendor, coordinate.x, coordinate.y)
        coordinate = coordinates.shift();
      }
      if (filters.selectedFiletype && filters.selectedFiletype !== "All") {
        pdf.text("File type: " + filters.selectedFiletype, coordinate.x, coordinate.y)
      }
      if (filters.selectedBUOrg){
        pdf.text("BU/ORG: " + filters.selectedBUOrg, 10, 70)
      }
      // if fixedDate like - last 30 days or custom range
      if (filters.fixedDate) {
        pdf.text("Date: " + filters.fixedDate, 10, 50)
      } else if (filters.dateFrom && filters.dateTo) {
        pdf.text("Date: " + filters.dateFrom + " To " + filters.dateTo, 10, 50)
      }
      pdf.line(0,145,1340,145)
      // ************************************************************
      // step 4 : Download html as pdf 
      html2canvas($(".dashboard-body")[0], { allowTaint: true }).then(function(canvas) {
        canvas.getContext('2d');
        var image = canvas.toDataURL("image/png", 1.0); // 1.0 is the quality of image
        pdf.addImage(image, 'PNG', 15, 150, htmlWidth, htmlHeight);

        for (var i = 1; i <= pageCount; i++) {
          // multi page pdf , here we add pages in pdf if there are n number of widgets
          pdf.addPage(pdfWidth.toString(), pdfHeight.toString());
          pdf.addImage(image, 'PNG', 15, -(pdfHeight * i)+150, htmlWidth, htmlHeight);
        }

        pdf.save("dashboard_download.pdf");
      });
      // back to orignal style which is applied globally
      dashboardContainer.style.height = "100%";
    },


    async getvendorNameList(){
      const vendorData = await DomainVendorMap.fetchData({selectColumns:['-_id','vendor_name']});
      if(vendorData){
        this.vendorList = _.map(vendorData, (item)=>{
          return item.vendor_name;
        });
      }
    },

    // moving file list assignment code from computed methods to one time before mount,
    // to avoid initilizing on each change in computed property
    initSelectFileType(){
      const fileTypes =  this.$store.state.dashboardStore.headerFilters[this.currentDashboard].file_type;
      if(fileTypes.length){
        return
      }
      const currentDashboard = this.$store.state.dashboardStore.currentDashboard
      let selectFiletype = Object.values(Constants.DOCEX.DOCUMENT_FILETYPES);
      // Filter out the 'null' element from the selectFiletype array, 
      // If there is null then empty value was getting selected from select file type drop down.
      const elementToRemove = Constants.DOCEX.DOCUMENT_FILETYPES.NULL;
      selectFiletype = selectFiletype.filter(item => item !== elementToRemove);
      currentDashboard == "operations" && this.$store.commit('dashboardStore/setOperationsFileType', selectFiletype);
      currentDashboard == "fraud_analytics" && this.$store.commit('dashboardStore/setFraudFileType', selectFiletype);
    },

    async getBusinessUnitData(){
      const response = await CustomerService.getCustomerConfiguration({selectColumns:['idp']});
      this.businessUnitList = _.get(response[0],'idp.business_units');
    },

    getFiletypeList(){
      this.filetypeList = Constants.DOCEX.DOCUMENT_FILETYPES;
      this.filetypeList = _.omit(this.filetypeList, ["NULL"]);
    },

    checkIfVendorFilterApplicable(filters) {
      return this.currentDashboard == 'operations' && this.activeTabName == this.getLabelByDocType(Constants.DOCEX.DOCUMENT_TYPES.INVOICE) && filters.selectedVendor && filters.selectedVendor !== "All";
    },

    showPageWiseDashboard(page){
      const documentType = page;
      if(this.currentDashboard == "fraud_analytics"){
        this.$store.commit('dashboardStore/setFraudDocType', documentType);
        this.applyFilter();
        return;
      }
      if(this.currentDashboard == "error_analytics"){
        this.$store.commit('dashboardStore/setErrorDocType', documentType);
        this.applyFilter();
        return;
      }
      if(this.currentDashboard == "operations"){
        this.$store.commit('dashboardStore/setOperationsDocType', documentType);
        const path = this.pagePathMapping[page] || null;
        path && this.applyFilter(path);
        return;
      }
    },

    applyDateFilter() {
      if (_.isArray(this.clonedDate.value)) {
        const dateFilterName = this.clonedDate.name;
        let fromDate = this.clonedDate.value[0]
        let toDate = this.clonedDate.value[1]
          const dateFilter  = {
              created_at: {
                  $gte: moment(fromDate).startOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
                  $lte: moment(toDate).endOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
              },
          };
          this.currentDashboard == "operations" && this.$store.commit('dashboardStore/setOperationsDateFilterName', dateFilterName);
          this.currentDashboard == "operations" && this.$store.commit('dashboardStore/setOperationsDateFilter', dateFilter);
          this.currentDashboard == "fraud_analytics" && this.$store.commit('dashboardStore/setFraudDateFilterName', dateFilterName);
          this.currentDashboard == "fraud_analytics" && this.$store.commit('dashboardStore/setFraudDateFilter', dateFilter);
          this.currentDashboard == "error_analytics" && this.$store.commit('dashboardStore/setErrorDateFilterName', dateFilterName);
          this.currentDashboard == "error_analytics" && this.$store.commit('dashboardStore/setErrorDateFilter', dateFilter);
          this.currentDashboard == "vendor" && this.$store.commit('dashboardStore/setVendorDateFilterName', dateFilterName);
          this.currentDashboard == "vendor" && this.$store.commit('dashboardStore/setVendorDateFilter', dateFilter);
      }
      this.applyFilter();
    },

    async updateUserPreference(){
      const params = {
        preference_type: `widgets.selected.${this.documentType}`,
        data: this.selectedWidgets
      };
      const response = await UserService.updateUserPreference(params);
      if (response.data.status) {
        UserService.commitUserPreferencesInStore(params.preference_type, params.data);
      }
    },
    // handle selected widgets and show widgets accordingly
    handleWidgetSelection({ source, destination }) {
      this.isUserPreferenceUpdated = true;
      //storing previous selected widgets to check selected list is updated or not
      this.previousSelectedWidgets = this.widgetsToBeSelected.source;
      this.widgetsToBeSelected.source = source;
      this.widgetsToBeSelected.destination = destination;
      if (_.isEqual(this.previousSelectedWidgets, source)) {
        this.isUserPreferenceUpdated = false;
        return;
      }
      // Let user select at least one widget
      if (!destination.length && source.length) {
        //The shift() method removes the first item of an array and changes the original array. The shift() method returns the shifted element. 
        this.widgetsToBeSelected.destination = [source.shift()]
      }
    },
    saveUserPreference() {
      //handleWidgetSelection atleast once call before saveUserPreference in order to initialize all variables and work its associate logic.
      if (!this.isUserPreferenceUpdated) { return }
      //if user preference list not updated then it will not update Widget Group and User Preferences.
      if (_.isEqual(this.previousSelectedWidgets, this.widgetsToBeSelected.source)) { return }
      this.previousSelectedWidgets = this.widgetsToBeSelected.source;
      this.isUserPreferenceUpdated = false;
      this.selectedWidgets = _.map(this.widgetsToBeSelected.destination, (field) => field.value)
      //get new Widget Group based on current selection
      const widgetGroups = IdpDashboardService.updateWidgetGroup(this.permittedWidgets, this.selectedWidgets, this.widgetConfig);
      this.$emit("updateWidgetGroups", widgetGroups)
      //Store user preferences
      this.updateUserPreference();
    },

    getPermittedDashboardPages() {
      const user = UserService.getUserFromStore();
      this.permittedDashboardPages = user["permitted_dashboard_pages"] || [];
      this.documentType = this.$store.state.dashboardStore.headerFilters[this.currentDashboard].document_type;
      if(this.permittedDashboardPages.length == 1){
        this.documentType = this.permittedDashboardPages[0]
        this.showPageWiseDashboard(this.documentType)
        this.showPageTabs = false
        return;
      }

      let permittedDashboardPagesMapping = {};
      _.map(this.permittedDashboardPages, (docType) => {
        permittedDashboardPagesMapping[docType] = docTypeLabelMapping(docType)
      });
      this.permittedDashboardPagesMapping = permittedDashboardPagesMapping;
    },

    // moving refresh page logic from computed methods to event specific method, to avoid mutliple call on change
    handleChangeBU(){
      this.applyFilter()
    },
    handleChangeVendorName(){
      this.applyFilter()
    },
    handleChangeFileType(data){
      this.applyFilter()
    },
    applyFilter(path) {
      let filter = this.findFilter();
      const dashboardFilters = this.$store.state.dashboardStore.headerFilters[this.currentDashboard];
      filter = {...filter , ...dashboardFilters};
      this.$router.push({name: path || this.$route.name, query: {
          filter: JSON.stringify(filter || {}),
      }});
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

    init(){
      this.getFiletypeList();
      this.getPermittedDashboardPages();
      this.getBusinessUnitData();
      this.getvendorNameList();
      this.initSelectFileType();
      this.addSubscriptionDateFilter();
    },

    addSubscriptionDateFilter() {
      const user = this.$store.getters.user;
      if (!user || !user.roles) {
        return;
      }
      const isCustomerAdmin = user.roles.includes(Constants.DOCEX.ROLES_MAP.IDP_CUSTOMER_ADMIN)
      //If currrent user has 'Customer admin' role and current dashboard is 'operations' then, 
      //only show 'subscription' date filter
      if (isCustomerAdmin && this.currentDashboard == "operations") {
        this.subscriptionData = user.subscription || {};
        if(!_.isEmpty(this.subscriptionData)){
          this.date_filters.push("subscription_to_ytd")
          const subscriptionStartDate = getStartDateForCurrentYear(user.subscription.start_date);
          this.subscriptionStartDate = subscriptionStartDate && moment(subscriptionStartDate).toISOString();
        }
      }
    },

    getLabelByDocType(docType){
      let docLabel = docTypeLabelMapping(docType);
      return docLabel
    },
  },
  components: {
    DaterangePicker,
    OrgHierarchyList,
    SlushBucketPopover
  },
  created() {},
  mounted() {
    //listening  orgHierarchyDetails event form this vue life cycle bcz when listening from beforeMount life cycle its not working.
    EventBus.$on("ON_SELECT_ORG_HIERARCHY_"+this.onSelectEventName, (data) => {
      this.selectedOrg = data && data.org;
    });
  },
  beforeDestroy() {
    EventBus.$off(["ON_SELECT_ORG_HIERARCHY_"+this.onSelectEventName]);
  },
  beforeMount() {
    this.init();
  },
};
</script>

<style lang="scss">
@import "../../_idpVariables";
@import "../../_idpGlobal";

.tab-buttons {
  margin-left: 0;
  margin-right: auto;
}

.tabs-container {
  background: var(--dark-07);
  border-radius: var(--radius-sm);
  padding: var(--space-xxs);

}
.dashboard-container {
button {
  background: transparent;
  border: 0;
				margin-left:0;
  font-size: var(--font-base);
  padding: var(--space-sm) var(--space-base);
  border-radius: var(--radius-sm);
  outline: 0;
  color: var(--dark-02);
  box-sizing: border-box;
  span {
    display: flex;
  }
  .count-tag {
    background: var(--brand-04);
    border-radius: var(--radius-round);
    color: var(--white);
    font-size: var(--font-xs);
    display: inline-block;
    padding: .06rem .3rem;
    margin-left: var(--space-xs);
  }
}

button.active {
  background: var(--white);
  color: var(--brand-04);
}
}
.el-dropdown-link {
  padding: .5rem .35rem;
  font-size: 1.2rem;
}
.el-dropdown {
  .count-tag {
    background: var(--brand-04);
    border-radius: var(--radius-round);
    color: var(--white);
    font-size: var(--font-xs);
    display: inline-block;
    padding: .06rem .3rem;
    margin-left: var(--space-xs);
  }
}


// KP Main

.dashboard-header {
  display: flex;
  justify-content: flex-end;
  // border-bottom: var(--border-base) solid var(--dark-07);
  background: var(--dark-09);
   padding: var(--space-lg ) var(--space-lg) var(--space-base) var(--space-lg);

  .header-left-side {
    margin-left: 0;
    margin-right: auto;
    display: flex;

  }

  .title {
    padding: 0;
    border: 0;
    margin-right: var(--space-lg);
    font-size: var(--font-lg);
    font-weight: 500;
    color: var(--dark-02);
  }


  .select-doc-type {
    margin-left: 0;
    margin-right: auto;

    .doc-type-container {
      background: var(--dark-07);
      border-radius: var(--radius-sm);
      padding: var(--space-xxs);

    }
    .el-tag.el-tag--info {
      background-color: var(--white);
    }

    button {
      background: transparent;
      line-height: var(--space-base);
      border: 0;
				margin-left:.1rem;
      font-size: var(--font-base);
      padding: var(--space-md-5) var(--space-base);
      border-radius: var(--radius-sm);
      outline: 0;
      color: var(--dark-02);
      box-sizing: border-box;
      &:hover {
        background: var(--white);
        color: var(--brand-04);
      }
      &.active {
        background: var(--white);
        color: var(--brand-04);
        box-shadow: none;
        .check-box {
          border: var(--border-base) solid var(--brand-04);
          // border-color: var(--brand-05);
                  box-shadow:0px 0px 0px .28rem var(--brand-04) inset;
        }
      }
      span {
        display: flex;
      }
      .count-tag {
        background: var(--brand-04);
        border-radius: var(--radius-round);
        color: var(--white);
        font-size: var(--font-xs);
        display: inline-block;
        padding: .06rem .3rem;
        margin-left: var(--space-xs);
      }
      .check-box {
        height: .9rem;
        width: .9rem;
        margin-right: var(--space-md-5);
        border-radius: 100px;
        border-radius: var(--radius-round);
        border: var(--border-base) solid var(--dark-06);
        background: var(--white);
      }
    }


    .el-dropdown-link {
      padding: .5rem .35rem;
      font-size: 1.2rem;
    }
    .el-dropdown {
      .count-tag {
        background: var(--brand-04);
        border-radius: var(--radius-round);
        color: var(--white);
        font-size: var(--font-xs);
        display: inline-block;
        padding: .06rem .3rem;
        margin-left: var(--space-xs);
      }
    }
		} // | select doc type


  .slect-org {
    width: 11.2rem;
    .vue-treeselect__control {
      background-color: var(--dark-07);
      border: var(--border-base) solid var(--dark-06);
      border-radius: var(--radius-base);
      .vue-treeselect__control-arrow {
        color: var(--dark-05);
      }
      &:hover {
        background-color: var(--dark-06);
        color: var(--dark-03);
                .vue-treeselect__control-arrow, .vue-treeselect__placeholder {
          color: var(--dark-04);
        }
      }
      .vue-treeselect__placeholder {
        font-size: var(--font-base);
        color: var(--dark-04);
      }
      .vue-treeselect__input {
        &::placeholder {
          color: var(--dark-01);
          opacity: 1;
          font-size: var(--font-lg);
        }
      }
    }
  }

  // select vendor name
  .select-vendor-name {
  width:18rem;
  margin-right:var(--space-md);
    .el-select {
      .el-tag.el-tag--info:first-child {
        padding-right: 1.5rem;
        max-width: 85%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .el-tag.el-tag--info:not(:only-child){
          max-width: 60%;
      }
      .el-tag.el-tag--info {
        background-color: #fff;
        margin-left: 0.2rem;
        max-width : 130px;
        overflow:hidden;
        display:inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: relative;

        .el-tag__close {
              position:absolute;
              top:.5rem;
              right:.3rem;
          color: var(--white);
        }
      }
      .el-input--suffix .el-input__inner {
        height: 26px !important;
      }
    }
  }

.select-file-type, .select-vendor-name {
    width: 12rem;
    margin-left:var(--space-sm-5);
    .el-select .el-select__tags {
      margin-left: .2rem;
      .el-select__input {
        margin-left: 5px !important;
      }
      span {
        margin-left: .2rem;
        // .el-tag.el-tag--info:first-child {

        // }
        .el-tag.el-tag--info {
          color: var(--brand-04);
          background-color: var(--white);
          margin-right: .4rem;
          margin-left: 0;
          .el-tag__close {
            color: var(--dark-08);
          }
        }
      }
    }
    .el-select__caret {
      color: var(--dark-04) !important;
    }


    .el-select:hover {
      .el-input__inner {
        background: var(--dark-06) !important;
        color: var(--dark-02);
        .el-select__caret {
          color: var(--dark-03) !important;
        }
      }
    }

  }

  .select-vendor-name {
    width: 20rem;
  }

.select-file-type, .slect-org, .select-vendor-name {
    height: 26px;
    margin-left: var(--space-md-5);
    border: 0;
    .vue-treeselect__single-value {
      color: var(--dark-04);
      font-size: var(--font-base);
      line-height: 2rem;
    }
    .el-select {
      .el-input--suffix {
        .el-input__inner {
          background-color: var(--dark-07);
          color: var(--dark-04);
          border-radius: var(--radius-base);
          height: 26px;
          line-height: 20px;
          font-size: var(--font-base);
          padding-right: 2rem;
          padding-left: .6rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          &::placeholder {
            color: var(--dark-04);
            font-weight: normal;
            font-size: var(--font-base);
          }

        }
      }
    }
} // | select file type


  .dashboard-tabs {
    display: inherit;
    margin-left: 1rem;

    .dashboarder-header-tab-container {
      margin-top: 0.6rem;
    }
    .idp-dashboard-header-customer-container{
      width: 25rem;
      margin-top: 7px;
    }
    .custom-date-picker-container {
      width: 154px;
      border: 0px;
      border-radius: 0px;
      padding: 0px;
      height: 1.9rem;
      margin-top: 0.9rem;
      background: white;

      .el-icon-date {
        display: none;
      }
      .el-range__close-icon {
        margin-bottom: 0.9rem;
      }
      .el-range-separator {
        background: white;
        margin-bottom: 1rem;
      }
      i {
        background: white;
      }
      input {
        width: 40%;
        font-size: var(--font-base);
      }
    }
    .el-tabs__header {
      margin: 0;
    }
    .el-tabs__nav-wrap::after {
      background-color: transparent;
    }
    .el-tabs__item {
      font-size: var(--font-base);
      color: var(--dark-03);
      font-weight: 400;
      height: 2.25rem;
      line-height: 2.25rem;
    }
    .el-tabs--top .el-tabs__item.is-top:last-child {
      padding-right: 1.25rem;
    }
    .el-tabs__active-bar {
      background-color: var(--brand-04);
    }
  } // | tabs
  .more-button {
    margin-left: var(--space-lg);
    position: relative;
    height: 26px;
    width: 26px;
    border-radius: var(--radius-round);

    .el-button {
      background: var(--dark-07);
      border-radius: var(--radius-round);
      border: 0;
      font-size: 1.28rem;
      padding: 0.45rem 0.45rem;
      position: relative;
      color: var(--dark-03);
      &:hover {
        background: var(--dark-06);
      }
    }
  }
}

.widget-dashboard-select-container{
  z-index: 9999 !important;
  top: 8rem !important;
  background: var(--white) !important;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px !important;
  border-radius: var(--radius-base) !important;
  border: 0 !important;
  // right:2rem !important;
  // border: 0 !important;
  .el-select__tags{
    max-width: none  !important;
  }
  .popper__arrow {
    display: none;
  }
}

.idp-list-header-date-picker {
  width: 8rem;
  margin: 0 var(--space-md) 0 var(--space-sm-5);

  .date-filter {
    width: 100%;
    font-weight: normal;
    padding: 7px 7px !important;
    height: 100%;
    // background-color: #e2e8f0;
    background: var(--dark-07);
    text-align: left;
    height: 26px;
    color: var(--dark-04);
    &:hover {
      background: var(--dark-06);
      color: var(--dark-02);
    }

    .label {
      overflow: hidden;
      display: inline-block;
      width: 81%;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
.vendor-dropdown {
    width : 28rem;
    overflow:hidden;
    display:inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
}
button.idp-dropdown {
    background-color:var(--dark-07);
  padding: 4.5px !important;
  margin-left: 10px;
}
.sub-tier{
  font-size: 12px !important;
  margin-left: 20px !important;
  background-color: #feffc2 !important;
  color: #344060 !important;
}
.bold-number{
  font-weight: 700;
}

.el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after {
  right: 10px !important;
}
</style> 
