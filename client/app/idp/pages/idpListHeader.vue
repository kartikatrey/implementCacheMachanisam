<template>
    <div>
    <div class="idp-list-header page-header">
        <div class="title-tabs-container">
            <!-- <div > -->
            <div class="page-title">
                <span class="page-title-text">{{ title || "" }}</span>
            </div>

            <!-- | title -->
            <div class="tab-buttons" v-show="showTabs">
                <div class="tabs-container">
                    <span v-for="item in staticList"  :key="item.order">
                        <el-button class="btn" :cid="item.code" :class="isActive(item.value)" v-on:click="handleStageClick(item.value)" v-show="selectedStageTabs.includes(item.value)">{{item.label}}<span class="count-tag">{{stageWiseCount[item.value] || 0}}</span></el-button>
                    </span>
                    <el-dropdown @command="handleStageClick" v-show="showStageDropdown">
                        <span class="el-dropdown-link">
                            <el-button class="btn active" :cid="getStageDropDownCid" v-if="dropDownSelectedStage">{{ showStageLabel }}<span class="count-tag">{{dropDownSelectedStage.count || 0}}</span>
                            </el-button>
                            <i class="mdi mdi-dots-vertical stage-dropdown-icon"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown" class="stage-dropdown" cid="idp-tab-dropdown">
                            <span v-for="item in ellipsisMenuItems"  :key="item.order">
                                <el-dropdown-item :cid="item.code" :class="isActive(item.value)" v-show="shouldStageVisible(item.value)" :command="item.value">{{item.label}}<span class="count-tag">{{stageWiseCount[item.value] || 0}}</span></el-dropdown-item>
                            </span>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
            <!-- | tab buttons -->
        </div>

        <!-- Email View Toggle -->
        <div v-if="docTypeConfig.enable_email_view && isEmailDocTypeRoute" class="email-view-toggle-btn">
            <el-tooltip :content="isEmailViewEnabled ? 'Email View' : 'Document View'">
                <ToggleButton
                    :disabled="hasButtonPermission('Email View')"
                    cid="email-view-toggle-button"
                    :labels="{ checked: 'Emails', unchecked: 'Docs' }"
                    :enabled="isEmailViewEnabled"
                    :customClass="'idp-list-header-email-toggle'"
                    @change="toggleEmailView"
                ></ToggleButton>
            </el-tooltip>
        </div>

        <div class="email-form-request-dialog">
            <EmailFormRequestDialog :documentType="selectedDocType" @emailRequestComplete="handleEmailRequestComplete"></EmailFormRequestDialog>
        </div>

        <AdvanceSearchDialog
            v-if="showAdvanceSearchDialog"
            :docType="selectedDocType"
            :advanceSearchEventName="advanceSearchEventName"
            :listViewColumns="columns">
        </AdvanceSearchDialog>

        <!-- Search documents -->
        <div class="search">
            <span class="mdi mdi-magnify search-icon"></span>
            <el-input size="mini" class="kp-toolbar-input" placeholder="All fields" cid="idp-doc-list-global-search" v-model="searchText" @change="onSerachTextChange" clearable></el-input>
            <el-tooltip v-if="isAdvanceSearchEnabled" class="item" effect="light" placement="left" content="Advance Search">
                <el-button
                    @click="showAdvanceSearchPopUp"
                    size="small"
                    cid="table-apply-filter"
                    class="advance-search-filter-btn"
                    >
                    <i class="mdi mdi-filter" :style="advanceSearchIconStyle"></i>
                </el-button>
            </el-tooltip>
            <!-- <span @click="onClearText" class="mdi mdi-close close-button"></span> -->
        </div>

        <!-- Select group -->

        <div v-if="enableMultiStageSelect" class="filter-links-container">
           <el-tooltip open-delay="500" class="item" :disabled="myDocuments ? false:true" effect="light" :content="myDocumentsTooltipContent" placement="left">
            <el-select
                @visible-change="handleStageVisibleChange"
                multiple
                collapse-tags
                v-model="selectedStages"
                :disabled="hasButtonPermission('assign-select')"
                cid="idp-doc-list-assign-select"
                placeholder="Filter"
                @change="handleSelectedStageChange"
                clearable
                @clear="clearAssignedFilter"
            >
                <el-option
                    v-for="(item, index) in docFilterOptions"
                    :cid="'idp-doc-list-assign_' + index"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    class="select-filter-option"
                >
                </el-option>
            </el-select>

            <!-- Moved this functionality to advanced search filter -->
            <!-- <el-select
                v-else
                v-model="myDocuments"
                :disabled="hasButtonPermission('assign-select')"
                cid="idp-doc-list-assign-select"
                placeholder="Filter"
                @change="applyAssignedFilter"
                clearable
                @clear="clearAssignedFilter"
            >
                <el-option
                  v-for="(item,index) in docFilterOptions"
                  :cid="'idp-doc-list-assign_'+index"
                  :key="item.value"
                  :label="item.label"
                  v-bind:value="item.value">
                </el-option>
              </el-select> -->
            </el-tooltip>
        </div>

        <!-- Date range picker -->
        <div class="filter-container" v-show="tableProps.enableCustomerFilter">
            <el-popover offset="5" popper-class="advanced-popover" placement="bottom"  trigger="click">
                <filter-form @setFilterData="setFilterData" :columns="filterColumns"></filter-form>
                <el-tooltip slot="reference" class="item" effect="light" content="Filter" placement="top-start">
                    <el-button data-v-step="3" @click="applyCustomFilter" cid="idp-doc-list-date-filter" class="advanced-filter-btn" style="display: inline-block">
                        <span class="mdi mdi-filter left-icon"></span>
                        Select filter
                        <span class="mdi mdi-menu-down right-icon"></span>
                    </el-button>
                </el-tooltip>
            </el-popover>
        </div>
        <!-- filter -->

        <div v-show="tableProps.enableDateRangeFilter" class="idp-list-header-date-picker">
            <daterange-picker cid="idp-doc-list-datepicker" :date_filters="date_filters" @applyDateFilter="applyDateFilter" v-bind:date.sync="dateFilter"></daterange-picker>
        </div>

        <!-- Action buttons -->
        <el-dropdown v-if="hasColumnPermission('Actions')"  @command="handleCommand">
            <el-button cid="idp-doc-list-actions" class="el-dropdown-link vertical-icon idp-dropdown" size="mini"><i class="el-icon-more"> </i></el-button>
            <el-dropdown-menu cid="idp-doc-list-action-dropdown" class="actions-list kp-action-wrapper-drowdown" slot="dropdown">
                <el-dropdown-item cid="idp-doc-list-actions-refresh" v-show="showBulkAction('refresh')" command="Refresh"><span class="mdi mdi-refresh"></span>Refresh</el-dropdown-item>
                <el-dropdown-item cid="idp-doc-list-actions-publish" v-show="showBulkAction('publish')" :disabled="disablePublishButton" command="Publish"><span class="mdi mdi-publish"></span>Publish</el-dropdown-item>
                <el-dropdown-item cid="idp-doc-list-actions-publish" v-show="showBulkAction('export')" command="Export"><span class="mdi mdi-arrow-down-thin-circle-outline"></span>Export</el-dropdown-item>
                <el-dropdown-item cid="idp-doc-list-actions-delete" v-show="showBulkAction('delete')" :disabled="disableDeleteButton" command="Delete"><span class="mdi mdi-delete"></span>Delete</el-dropdown-item>
                <el-dropdown-item cid="idp-doc-list-actions-assign" v-show="showBulkAction('assign')" :disabled="disableDeleteButton" command="Assign"><span class="mdi mdi-account-plus-outline"></span>Assign</el-dropdown-item>
                <el-dropdown-item cid="idp-doc-list-actions-assign" v-show="showBulkAction('download')" command="bulkDocumentDownload"><span class="mdi mdi-arrow-down-thin-circle-outline"></span>Download</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

    </div>

       <!-- package buttons -->
       <div>
            <el-radio-group
                    v-show="isPackageType"
                    @change="packageTypeChange"
                    v-model="selectedCategoryType"
                    class="inbox-child-stage">
                    <el-radio v-for="(type,index) in packageTypes" :label="type.value" v-bind:key="index+'package_type'" >{{type.label}}</el-radio>
            </el-radio-group>
        </div>
    </div>
</template>

<script>
    import Constants from "@/resources/Constants";
    import DaterangePicker from "../components/Daterangepicker.vue";
    import _ from "lodash";
    import moment from "moment";
    import EventBus from "@/EventBus";
    import FilterForm from "../../components/Filter";
    import DocumentService from "../services/DocumentService"
    import {mapState} from 'vuex';
    import CustomerConfig from "@/idp/services/DeCustomerConfig";
    import EmailFormRequestDialog from "../components/form/EmailFormRequestDialog";
    import ToggleButton from "../components/ToggleButton";
    import AdvanceSearchDialog from "@/idp/components/AdvanceSearchDialog";

    export default {
        name: "IdpListHeader",
        props: {
            "filter": {},
            "title": {},
            "tableProps": {},
            "isPackageType":false,
            "selectedCategoryType":{},
            "isReviewerOnly":false, //this flage is used for user role is read only or not,
            "stageTabConfig":[],
            "advanceSearchProps": {}
        },
        data() {
            return {
                date_filters:['yesterday','past_month','past_3_months','this_month','all_time'],
                packageTypes:Constants.DOCEX.IDP_DOCUMENT_CATEGORIES,
                docFilterOptions: [],
                myDocuments: "",
                stage: "",
                showAdvanceSearchDialog: false,
                searchText: "",
                isStageValueChanged : false,
                showTabs: true,
                enableMultiStageSelect: false,
                selectedStageTabs: [],
                selectedStages: [],
                stageWiseCount:{},
                selectedStatus: "Uploaded",
                showCalendar: false,
                isFilter: false,
                filterColumns: [],
                columns: "",
                tableFilter: this.tableProps.query,
                dateFilter: {
                    value: "",
                    label: "",
                    name: "",
                },
                dropDownStages: [],
                stageLabelMap: Constants.DOCEX.STAGE_LABEL_MAP,
                staticList: [],
                ellipsisMenuItems: [],
                docTypeConfig : {},
                visibleStageCount: 1,
                documentTypeList: [],
                advanceSearchEventName: "listHeaderAdvanceSearchEvent",
                advanceSearchIconStyle: ""
            };
        },
        computed: {
            // Determine whether to show the email toggle button based on the current route
            isEmailDocTypeRoute(){
                const currentPath = this.$route.path;
                // Construct the path for the document list of the selected document type
                let docPath = `document/${this.selectedDocType}`
                // Check if the current path includes the document path
                // If true, it implies that the email toggle button should be shown
                return currentPath.includes(docPath);
            },
               ...mapState({
                selectedDocType: "documentType",
            }),
            showStageLabel(){
                return  this.stageTabConfig.find(item=>item.value == this.dropDownSelectedStage.value).label;
            },
            getStageDropDownCid(){
                return  this.stageTabConfig.find(item=>item.value == this.dropDownSelectedStage.value).code;
            },
            showStageDropdown() {
                return _.some(this.selectedStageTabs, stage => this.dropDownStages.includes(stage));
            },
            dropDownSelectedStage() {
                 if (this.dropDownStages.includes(this.stage || this.state)) return {
                    value: this.stage ? this.stage : this.state,
                    count: this.stageWiseCount[this.stage ? this.stage : this.state]
                };
            },
            myDocumentsTooltipContent() {
                if (this.myDocuments) {
                    const foundItem = _.find(this.docFilterOptions, { value: this.myDocuments });
                    return foundItem ? foundItem.label : "";
                }
            },
            disableDeleteButton() {
                const stages = Constants.DOCEX.STAGE;
                return this.isReviewerOnly || _.includes([stages.PUBLISHED, stages.DELETED], this.stage);
            },
            disablePublishButton() {
                if(this.isReviewerOnly){
                    return true
                }
                const stages = Constants.DOCEX.STAGE;
                const isDocumentReadyForPublish = _.includes(
                    [stages.APPROVED, stages.CONFIRMED, stages.UPLOADED,stages.EXTRACTED, stages.APPROVAL_REJECTED],
                    this.stage
                );
                const user = this.$store.getters.user;
                const publisherAccessRoles = [Constants.DOCEX.ROLES_MAP.IDP_PUBLISHER, Constants.DOCEX.ROLES_MAP.IDP_PUBLISHER_ONLY, Constants.DOCEX.ROLES_MAP.IDP_CUSTOMER_ADMIN]
                const hasPublishAccess = (publisherAccessRoles.filter(role => user.roles.includes(role))).length !== 0;
                const enablePublish = hasPublishAccess && isDocumentReadyForPublish
                return !enablePublish;
            },
            isEmailViewEnabled(){
                const currentPath = this.$route.path;
                return currentPath.includes('/email-view');
            },
            isAdvanceSearchEnabled() {
                return _.get(this.advanceSearchProps, "enableAdvanceSearch") || false;
            }
        },
        methods: {
            toggleEmailView(toggleEnabled) {
                if (this.isEmailViewEnabled == toggleEnabled)
                    return;

                const currentPath = this.$route.path;
                let newPath;

                if (toggleEnabled) {
                    this.$store.commit("userAccessStore/setEmailDocumentView", true);
                    newPath = `${currentPath}/email-view`;
                } else {
                    this.$store.commit("userAccessStore/setEmailDocumentView", false);
                    newPath = currentPath.replace('/email-view', '');
                }

                this.$router.push({
                    path: newPath,
                    query: this.$route.query,
                });
            },

            showAdvanceSearchPopUp() {
                this.showAdvanceSearchDialog = true;
                this.$store.commit("setShowAdvanceSearchDialog", true);
            },

            handleEmailRequestComplete(err, data) {
                this.refreshTable();
            },
            sendForm() {
                EventBus.$emit('sendFormEvent');
            },
            packageTypeChange(){
                const filter = this.processStatusFilters('','',this.selectedCategoryType);
                this.applyFilter(filter);
                // this.$emit("onCategoryChange",this.selectedCategoryType);
            },
            shouldStageVisible(stage) {
            return this.selectedStageTabs.includes(stage) && (this.dropDownSelectedStage ? this.dropDownSelectedStage.value != stage : true);
            },
            clearAssignedFilter() {
                delete this.filter["myDocuments"]
                this.applyAssignedFilter()
            },
            applyAssignedFilter() {
                this.findFilter();
                let filter = this.filter;
                !_.isEmpty(("" + this.myDocuments).trim()) ?
                    (filter["myDocuments"] = this.myDocuments) :
                    delete filter["myDocuments"];
                this.applyFilter(filter);
                this.setFilterData(filter);
            },
            handleStageClick(value) {
                if (value == "Failed") {
                    this.filterByStatus("", value);
                } else {
                    this.filterByStatus(value)
                }
            },
            showBulkAction(action) {
                return _.includes(_.get(this.tableProps, 'bulkActions'), action)
            },

            isActive(itemState) {
                // For validating state
                if (this.state) {
                    return itemState == this.state ? "active" : "";
                }

                // For validating stage
                return itemState == this.stage ? "active" : "";
            },
            handleCommand(command) {
                this.getCommandMap()[command]();
            },
            deleteDocuments() {
                EventBus.$emit("IDP_BULK_DELETE_DOCUMENT")
            },
            bulkDocumentAssignment(){
                EventBus.$emit("IDP_BULK_ASSIGN_DOCUMENTS")
            },
            bulkDocumentDownload(){
                EventBus.$emit("IDP_BULK_DOC_DOWNLOAD")
            },
            addFilter(filter) {
                // EventBus.$emit("ADD_QUERY",filter)
            },
            refreshTable() {
                EventBus.$emit("REFRESH_TABLE")
            },
            getCommandMap() {
                const commandMap = {
                    "Delete": this.deleteDocuments,
                    "Refresh": this.refreshTable,
                    "Publish": this.bulkPublish,
                    "Export": this.export,
                    "Assign": this.bulkDocumentAssignment,
                    "bulkDocumentDownload": this.bulkDocumentDownload
                }
                return commandMap;
            },
            bulkPublish() {
                EventBus.$emit("IDP_BULK_PUBLISH_DOCUMENT")
            },
            export () {
                EventBus.$emit("IDP_DOCUMENT_EXPORT");
            },

            setFilterData(filterData) {
                if (_.keys(filterData).length > 0) {
                    this.tableProps.query = {
                        ...this.tableFilter,
                        ...filterData,
                        // Adding allStageDocuments to identify on the server to get the selected stages from the dropdown to get accurate data from the DB
                        allStageDocuments: _.get(this.tableProps,'query.allStageDocuments', {}),
                    };
                } else {
                    this.tableProps.query = {
                        ...this.tableFilter,
                        allStageDocuments: _.get(this.tableProps,'query.allStageDocuments', {})
                    };
                }
                // this.applyFilter(this.tableProps.query)
                // this.skip = 0;
                // this.currentPage = 1;
                this.addFilter(this.tableProps.query);
                // this.isFilter = false;
            },
            applyDateFilter() {
                this.findFilter();
                let filter = this.filter;
                //setting skip to 0 for date filter
                if (_.get(filter, 'idp_invoice_list.selectedPage')) {
                    filter.idp_invoice_list.selectedPage = 0;
                }

                if (_.isArray(this.dateFilter.value)) {
                    filter["dateFilterName"] = this.dateFilter.name;
                    let fromDate = this.dateFilter.value[0]
                    let toDate = this.dateFilter.value[1]
                    filter["dateFilter"] = {
                        created_at: {
                            $gte: moment(fromDate).utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
                            $lte: moment(toDate).utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
                        },
                    };
                } else {
                    delete filter["dateFilterName"];
                    delete filter["dateFilter"];
                }
                this.applyFilter(filter);
            },
            applyCustomFilter() {
                this.isFilter = !this.isFilter;
            },

            onClearText() {
                this.searchText = "";
                this.handleOnSearch();
            },

            applyFilter(filter) {
                let url = window && window.location && "" + window.location.pathname;
                let splitted = url.split("/app");
                url = splitted.length > 1 ? splitted[1] : url;
                this.$router.push({
                    path: url,
                    query: {
                        filter: JSON.stringify(filter || {}),
                    },
                });
            },
            getSortByColumn(stage){
                const category = this.docTypeConfig.view == "package" ? "package" : "documents"
                const filteredColumn = _.find(this.docTypeConfig.list_view_columns,(colObj)=>{return colObj.stage == stage && colObj.category == category})
                const sortByColumn = filteredColumn && filteredColumn.sort_by
                return sortByColumn
            },
            processStatusFilters(stage, state = "", category) {
                this.findFilter();
                let filter = this.filter;
                if(category){
                    filter.category = category;
                    delete filter.idp_insurance_list
                    return filter;
                }
                delete filter.category;
                if (stage) {
                    this.stage = stage;
                    filter["stage"] = stage;
                    delete filter["state"];
                }
                if (state) {
                    this.state = state;
                    filter["state"] = state;
                    delete filter["stage"];
                }
                if (this.tableProps && this.tableProps.tableIdentifier) {
                    if (filter[this.tableProps.tableIdentifier]) {
                        filter[this.tableProps.tableIdentifier].selectedPage = 1;
                        const sortByColumn = this.getSortByColumn(stage || state, filter)
                        if(sortByColumn){
                            filter[this.tableProps.tableIdentifier].sortColumn = sortByColumn;
                        }else if (stage == Constants.DOCEX.STAGE.PUBLISHED) {
                            filter[this.tableProps.tableIdentifier].sortColumn = "-published_at";
                        }else if(stage == Constants.DOCEX.STAGE.DELETED){
                            filter[this.tableProps.tableIdentifier].sortColumn = "-updated_at";
                        } else {
                            delete filter[this.tableProps.tableIdentifier].sortColumn;
                        }
                    }
                    // from dashboard drilldown
                    if (_.get(filter, 'secondary.state')) {
                        if (state == Constants.DOCEX.STATE_UPLOADED.FAILED) {
                            filter.secondary.state = Constants.DOCEX.STATE_UPLOADED.FAILED;
                        } else {
                            filter.secondary.state = {
                                '$ne': Constants.DOCEX.STATE_UPLOADED.FAILED
                            };
                        }
                        if (this.tableProps.query.state) {
                            this.tableProps.query.state = filter.secondary.state;
                        }
                        if (filter.myDocuments) {
                            this.tableProps.query.myDocuments = filter.myDocuments;
                        }
                    }
                }
                return filter;
            },
            filterByStatus(stage, state = "") {
                const filter = this.processStatusFilters(stage, state);
                this.applyFilter(filter);
            },

            handleOnSearch() {
                this.findFilter();
                let filter = this.filter;
                // Reset page size filter on text search
                if (filter[this.tableProps.tableIdentifier]) {
                    delete filter[this.tableProps.tableIdentifier].selectedPage
                }!_.isEmpty(("" + this.searchText).trim()) ?
                    (filter["searchText"] = this.searchText) :
                    delete filter["searchText"];

                if (_.get(filter, "advanceSearchFilter")) {
                    delete filter.advanceSearchFilter;

                    // Reset the Advance search filter dialog
                    const advanceSearchParams = {
                        showAdvanceSearchDialog: true,
                        currentAdvanceFilter: {}
                    }
                    this.$store.commit("setAdvanceSearchParams", advanceSearchParams);
                }

                this.applyFilter(filter);
                this.setFilterData(filter);
            },

            onSerachTextChange(value) {
                this.handleOnSearch();
            },

        async getStageWiseCount(stageWiseCountQuery) {
            this.stageWiseCount = await DocumentService.getStageWiseCount(stageWiseCountQuery)
        },

        getFilterColumns() {
            this.filterColumns = _.filter(this.columns, "filterOptions.enable");
            return this.filterColumns;
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
        setSelectedStageTabs() {
            if(!this.stageTabConfig){
                return;
            }
            for (let index = 0; index < this.stageTabConfig.length; index++) {
                //Get Display Label which are different from actual label
                if (this.stageLabelMap[this.stageTabConfig[index].value]) {
                    this.stageTabConfig[index].label = this.stageLabelMap[this.stageTabConfig[index].value];
                }
                //Make First Letter as Uppercase
                this.stageTabConfig[index].label = this.stageTabConfig[index].label.replace(/(^\w|\s\w)/g, txt => txt.toUpperCase());
            }
            this.selectedStageTabs = this.stageTabConfig.map((item) => item.value);
        },
        applyCurrentStatus() {
            const filter = this.filter;
            if (filter.stage) {
                this.stage = this.filter.stage;
            } else if (filter.state) {
                this.state = this.filter.state;
            } else if (filter.isDrilldown) {
                if (filter._extraParams) {
                    this.stage = filter._extraParams.selected_stage;
                    //deleting "_extraParams" from filter to avoid break in dashboard query
                    delete filter["_extraParams"];
                } else {
                    this.stage = 'Uploaded';
                }
            } else {
                //set default stage and state
                const currentStatus = this.stageTabConfig && this.stageTabConfig.find(item => item.order == 0).value;
                if (currentStatus) {
                    if (currentStatus == 'Failed') {
                        this.state = currentStatus;
                    } else {
                        this.stage = currentStatus;
                    }
                } else {
                    this.stage = Constants.DOCEX.STAGE.UPLOADED;
                }
            }
            this.processStatusFilters(this.stage, this.state)
        },
        applyFilters() {
            if (this.filter && this.filter.myDocuments) {
                this.tableProps.query.myDocuments = this.filter.myDocuments
            }

            const isDrilldown = this.filter.isDrilldown ? {
                isDrilldown: true
            } : {};

            //Add searchText to query
            let searchText = this.searchText && ("" + this.searchText).trim();

            // In case of advance search we add the filter name on search input box
            // we don't want to filter list view for advance search filter name
            // note - if no filter name is there for advance seach we add default name "Unsaved filter"
            if (searchText && searchText != _.get(this.advanceSearchProps, "filterName")) {
                this.initColumnFilters(searchText);
            }

            this.showTabs && this.getStageWiseCount({
                "query": {
                    ...(this.tableProps.query || {}),
                    ...(this.filter.dateFilter || {}),
                    ...isDrilldown
                }
            })
            this.getFilterColumns();
        },
        // Limits the visible tabs to a specified number and adds the remaining tabs to a dropdown list.
        setActiveTabs() {
            this.staticList = this.stageTabConfig && this.stageTabConfig.slice(0, this.visibleStageCount);
            this.ellipsisMenuItems = this.stageTabConfig && this.stageTabConfig.slice(this.visibleStageCount, this.stageTabConfig.length);
        },
        initColumnFilters(searchText) {
            let columnFilter = DocumentService.getTableColumnFilters({
                searchText, columns: this.tableProps.columns
            });

            //adding search column as $and condition
            columnFilter = { $and: [columnFilter] }

            /*
             * merging 'this.tableProps.query' with 'columnFilter' in this order
             * so that newly prepared 'columnFilter' can be replaced in final 'this.tableProps.query'
            */
            this.tableProps.query = {
                ...(this.tableProps.query || {}),
                ...columnFilter
            };
            //Setting the applied glober filter at document viewer level. It will be used when user click on next prev button
            this.$store.commit("documentViewStore/setIdpListcolumnFilter",columnFilter)
        },
        /**
         * *Purpose: To filter out the filterOptions based on the document type and the selected tab
         * Step 1: Find the selected document type.
         * Step 2: Add options to docFilterOptions if they have an allowedTabs array and the selectedTab is present.
         * Step 3: Map option values and labels based on the selected document type.
         */
         updateDocFilterOptionsByTab(selectedTab){
            if(selectedTab.toLowerCase()=="all" || this.tableProps.query.stage === "All"){
                this.enableMultiStageSelect = true
                return this.updateFilterOptionsForAllStage()
            }
            const docFilterOptions = Constants.DOCEX.DOC_GROUP_OPTIONS;
            //finding mapped value for current doc_type, for ex. for "po" doc_type we should have "Sales Order" label
            const mappedDocument = this.documentTypeList.find(item => item.value === this.selectedDocType);
            const selectedDocumentType = mappedDocument && mappedDocument.label;
            return docFilterOptions
                .filter(option => !option.allowedTabs || option.allowedTabs.includes(selectedTab))
                .map(option => {
                    return {
                        value: option.value,
                        label: option.label.replace('$DOC_TYPE', selectedDocumentType)
                    };
                });
        },
        /**
         * Purpose: Update filter options for all stages in the document explorer
         * Steps:
         * 1. Set the query to fetch all documents from all stages.
         * 2. Convert filter options to a format suitable for dropdowns.
         * 3. Initialize selectedStages with all values from docFilterOptions on first load.
         * 4. Set the query for allStageDocuments to the initially selected documents.
         * 5. Remove duplicate options based on label (if any).
         *
         * @returns {Array} Updated document filter options.
         * Ex, [ { label : "Inbox", value: "Extracted" }, { label : Published , value: "Published"}]
         */
        updateFilterOptionsForAllStage(){
            const allStageFilterOptions = Constants.DOCEX.ALL_LIST_STAGE_MAP;
            this.tableProps.query.myDocuments = "allStageDocuments"
            let docFilterOptions = Object.entries(allStageFilterOptions).map(([key, value]) => {
                return {
                    label: value,
                    value: key
                };
            });

            const docFilterOptionValues = docFilterOptions.map(item => item.value);
            // Check if 'allStageDocuments' is present in the filter parameters
            // If present, get the latest selected values; if not, select all values by default
            const filteredStages = _.get(this.filter, "allStageDocuments")
            ? docFilterOptionValues.filter(item => this.filter.allStageDocuments.includes(item))
            : docFilterOptionValues;

            this.selectedStages = filteredStages;
            this.tableProps.query.allStageDocuments = this.selectedStages
            docFilterOptions = _.uniqBy(docFilterOptions, 'label')
            return docFilterOptions;
        },
        handleStageVisibleChange(status){
            // If 'status' is true, the All Stage dropdown is opened, but no stage has been selected/unselected,
            // so there's no need to render the idpDataTable.
            if(status){
                this.isStageValueChanged = false;
            }
            // If 'status' is false, the dropdown has disappeared, and if 'isStageValueChanged' is true,
            // it means values have been selected/unselected from the dropdown.
            // In this case, render idpDataTable and fetch the latest data based on the filter.
            if(!status && this.isStageValueChanged){
                this.findFilter();
                let filter = this.filter;
                filter["allStageDocuments"] = this.selectedStages
                this.applyFilter(filter);
            }
        },
        /**
         * Updates the 'allStageDocuments' in the query with the updated 'selectedStages'
         * to ensure correct results and applies the assigned filter.
         */
        handleSelectedStageChange() {
            this.isStageValueChanged = true;
        },

        handleAdvanceSearch(advanceSearchFilter) {
            // In case if no fields is selected in query builder, do not refresh table
            if (_.isEmpty(_.get(advanceSearchFilter, "query.children"))) {
                return;
            }

            const currentFilter = this.findFilter();
            if (_.get(currentFilter, "advanceSearchFilter.query") == JSON.stringify(advanceSearchFilter.query)) {
                console.log("Filter Already applied...");
                return;
            }

            currentFilter["advanceSearchFilter"] = {
                query: JSON.stringify(advanceSearchFilter.query),
                name: advanceSearchFilter.name,
                filterId: advanceSearchFilter.filterId
            };
            this.applyFilter(currentFilter);
        },

        registerEvents() {
            EventBus.$on(`advanceSearchQuery__${this.advanceSearchEventName}`, (advanceSearchFilter) => {
                this.handleAdvanceSearch(advanceSearchFilter);
            });
        },

        deRegisterEvents() {
            const busEvents = [`advanceSearchQuery__${this.advanceSearchEventName}`]
            EventBus.$off(busEvents);
        },

        storeCurrentAdvanceFilter() {
            if (_.get(this.advanceSearchProps, "query")) {
                const advanceSearchParams = {
                    showAdvanceSearchDialog: true,
                    currentAdvanceFilter: this.advanceSearchProps
                }
                this.$store.commit("setAdvanceSearchParams", advanceSearchParams);
            }

        }
    },
    components: {
        DaterangePicker,
        FilterForm,
        EmailFormRequestDialog,
        ToggleButton,
        AdvanceSearchDialog
    },
    created() {},
    mounted() {},
    beforeDestroy() {
        this.deRegisterEvents();
    },
    async beforeMount() {
        this.findFilter();
        this.registerEvents();
        this.columns = this.tableProps.columns;
        this.showTabs = this.tableProps.hasOwnProperty('showTabs') ? this.tableProps.showTabs : this.showTabs

        const filter = this.filter;
        this.searchText = filter.searchText || _.get(this.advanceSearchProps, "filterName") || "";
        this.advanceSearchIconStyle = _.get(this.advanceSearchProps, "filterStyle") || "";
        this.myDocuments = filter.myDocuments || "";
        this.dateFilter.name = filter.dateFilterName;

        // Fetching document types based on document_type from de customer configurations table
        const customerConfigs = await CustomerConfig.getAllDocsCustConfiguration({}, ['document_type']);
        // Transforming document types into label and value
        this.documentTypeList = CustomerConfig.getDocumentTypeList(customerConfigs);

        //Get document Configuration
        const documentType = this.selectedDocType;
        // Retrieve the current stage
        const currentStage = this.filter.stage;
        // Determine the current tab based on the current stage.
        // If a mapping is available in STAGE_LABEL_MAP, use the mapped value; otherwise, keep the original stage name.
        // Additionally, capitalize the first letter of each word in the tab name.
        let currentTab = _.startCase(Constants.DOCEX.STAGE_LABEL_MAP[currentStage] || currentStage)
        //set group options based on current tab
        this.docFilterOptions=this.updateDocFilterOptionsByTab(currentTab)
        this.docTypeConfig = await CustomerConfig.getCustConfigByDocType(documentType);
        this.visibleStageCount = _.get(this.docTypeConfig,"list_view_config.visible_stage_count", 4)

        //Set selected stages for tabs
        this.setSelectedStageTabs();

        //Apply current staus for 'stage and state'
        this.applyCurrentStatus();

        //Apply filters
        this.applyFilters();

        //Set static and dropdown stages list
        this.setActiveTabs();

        //Add drop down stages
        this.dropDownStages = this.selectedStageTabs && this.selectedStageTabs.slice(this.visibleStageCount , this.selectedStageTabs.length);

        // Store the current applied filter, In case of reload get the filter from URL and display on query builder
        this.storeCurrentAdvanceFilter();
    },
};
</script>

<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";

.page-header {
    div.page-title {
        button {
            padding: 0px;
            vertical-align: middle;
        }
    }

    .filter-container {
        margin-left: 1rem;
        width: 13rem;
        padding-right: 12px;

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
                top: 4px;
                color: var(--dark-04);
            }
        }
    }

    // | filter

    .search {
        width: 12rem;

        .el-input__inner{
            padding: 0.571rem 38px 0.571rem 2.3rem !important;
        }

        .kp-toolbar-input {
            input {
                width: 100%;
            }
        }

        .el-input__icon.el-icon-circle-close.el-input__clear{
            right: 8px;
            position: absolute;
        }

        .close-button {
            position: absolute;
            right: 3px;
            top: 5px;
            cursor: pointer;
        }
    }

    // kp-action-wrapper-drowdown {
    //   vertical-align: text-bottom;
    // }

    button.idp-dropdown {
        background-color:var(--dark-07);
    }

    .idp-list-header-date-picker {
        width: 8rem;
        margin: 0 var(--space-base) 0 0;

        .date-filter {
            width: 100%;
            font-weight: normal;
            padding: 0 7px !important;
            height: 100%;
            background-color: var(--dark-07);
            text-align: left;
            // line-height: 1.5rem;
            height: 26px;
            color: var(--dark-04);

            .label {
                overflow: hidden;
                display: inline-block;
                width: 81%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }

    .stage-dropdown-icon {
        cursor: pointer;
    }

}

.actions-list {
    li {
        span {
            padding: 2px 3px 5px 5px;
            vertical-align: middle;
        }
    }
}

.idp-dropdown {
    padding: 6px !important;
}

.kp-popover-daterangepicker {
    width: 235px !important;
}

.arrow-down {
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid #909399;
    float: right;
    margin-top: 4px;
}

.idp-list-header {
    .page-title {
        padding-top: 0px !important;
        .page-title-text {
            font-style: normal;
            font-weight: 600;
            font-size: var(--font-lg) !important;
            line-height: 27px;
            /* identical to box height */

            letter-spacing: 0.01em;

            /* Gray:700 */

            color: #4a5568 !important;
        }
    }
}


.search-icon {
    position: absolute;
    z-index: 1;
    color: #a0aec0;
    left: 6px;
    top: 1px;
    bottom: 17px;
    font-size: 18px;
}
.email-form-request-dialog{
    margin-right: 1rem;
}

.vendor-button {
    margin-right: 10px
}

.filter-links-container {
	width: 12rem !important;
	.el-select__tags {
		max-width: none !important;
	}

	.el-select {
		.el-tag.el-tag--info:first-child {
			width: 50%;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			padding-right: 1.5rem;
		}

		.el-tag.el-tag--info:not(:only-child) {
			max-width: 60%;
		}
	}

	.el-tag__close.el-icon-close {
		position: absolute;
		top: 8px;
		right: 70px;
	}
}

.el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after{
    right: 10px !important;
}

.email-view-toggle-btn {
    .vue-js-switch .v-switch-label.v-left{
        left: 5px !important;
    }

    .vue-js-switch .v-switch-core{
        background-color: rgb(95, 143, 223) !important;
    }
}
.advance-search-filter-btn{
    display: flex;
    justify-content: center;
    align-items: baseline;
    left: 130px !important;
    width: 0px !important;
    height: 0px !important;
}
.advance-search-filter-btn:hover{
    .mdi-filter{
        color: var(--brand-05) !important;
    }
}
</style>
