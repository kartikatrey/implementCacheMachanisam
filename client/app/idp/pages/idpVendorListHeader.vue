<template>
    <div>
    <div class="idp-vendor-list-header page-header">
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
                </div>
    
            </div>
            <!-- | tab buttons -->
        </div>
    
        <!-- Search documents -->
        <div class="search">
            <span class="mdi mdi-magnify search-icon"></span>
            <el-input size="mini" class="kp-toolbar-input" placeholder="All fields" cid="idp-doc-list-global-search" v-model="searchText" @change="onSerachTextChange" clearable></el-input>
            <!-- <span @click="onClearText" class="mdi mdi-close close-button"></span> -->
        </div>    
    
        <!-- Date range picker -->
        <div class="filter-container" v-show="tableProps.enableCustomerFilter">
            <el-popover offset="5" popper-class="advanced-popover" placement="bottom" trigger="click">
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
        <el-dropdown  @command="handleCommand">
            <el-button cid="idp-doc-list-actions" class="el-dropdown-link vertical-icon idp-dropdown" size="mini"><i class="el-icon-more"> </i></el-button>
            <el-dropdown-menu cid="idp-doc-list-action-dropdown" class="actions-list kp-action-wrapper-drowdown" slot="dropdown">
                <el-dropdown-item cid="idp-doc-list-actions-refresh" v-show="showBulkAction('refresh')" command="Refresh"><span class="mdi mdi-refresh"></span>Refresh</el-dropdown-item>
                <!-- <el-dropdown-item cid="idp-doc-list-actions-publish" command="Export"><span class="mdi mdi-arrow-down-thin-circle-outline"></span>Export</el-dropdown-item> -->
            </el-dropdown-menu>
        </el-dropdown>
       
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

    
    export default {
        name: "IdpVendorListHeader",
        props: {
            "filter": {},
            "title": {},
            "tableProps": {},
            "isPackageType":false,
            "isReviewerOnly":false //this flage is used for user role is read only or not
        },
        data() {
            return {
                date_filters:['yesterday','past_month','past_3_months','this_month','all_time'],
                packageTypes:Constants.DOCEX.IDP_DOCUMENT_CATEGORIES,
                myDocuments: "",
                stage: "",
                searchText: "",
                showTabs: true,
                selectedStageTabs: [],
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
                stageLabelMap: Constants.DOCEX.VENDOR_CONFIGURATION.VENDOR_STAGE_LABEL_MAP,
                staticList: [],
                stageMapConfig:{}
            };
        },
        computed: {
               ...mapState({
                selectedDocType: "documentType",         
            })
        },
        methods: {
            //Most of the methods in this file are copied from idpListHeader.vue file
            //Not created a common service because these methods are making changes to "this" context very frequently.
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
            addFilter(filter) {
                // EventBus.$emit("ADD_QUERY",filter)
            },
            refreshTable() {
                EventBus.$emit("REFRESH_TABLE")
            },
            getCommandMap() {
                const commandMap = {
                    "Refresh": this.refreshTable,
                    "Export": this.export
                }
                return commandMap;
            },
            export () {
                EventBus.$emit("IDP_DOCUMENT_EXPORT");
            },
    
            setFilterData(filterData) {
                if (_.keys(filterData).length > 0) {
                    this.tableProps.query = {
                        ...this.tableFilter,
                        ...filterData
                    };
                } else {
                    this.tableProps.query = this.tableFilter;
                }
                this.addFilter(this.tableProps.query);
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
                            $gte: moment(fromDate).startOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
                            $lte: moment(toDate).endOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
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
                        if (stage == Constants.DOCEX.STAGE.PUBLISHED) {
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
            for (let index = 0; index < this.stageMapConfig.length; index++) {
                //Get Display Label which are different from actual label
                if (this.stageLabelMap[this.stageMapConfig[index].value]) {
                    this.stageMapConfig[index].label = this.stageLabelMap[this.stageMapConfig[index].value];
                }
                //Make First Letter as Uppercase
                this.stageMapConfig[index].label = this.stageMapConfig[index].label.replace(/(^\w|\s\w)/g, txt => txt.toUpperCase());
            }
            this.selectedStageTabs = this.stageMapConfig.map((item) => item.value);
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
                const currentStatus = this.stageMapConfig.find(item => item.order == 0).value;
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
            let searchText =
                this.searchText && ("" + this.searchText).trim();
            if (searchText) {
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
        handleTabsList() {
            this.staticList = this.stageMapConfig.slice(0, 4);
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
        }
    },
    components: {
        DaterangePicker,
        FilterForm,
    },
    created() {},
    mounted() {},
    beforeDestroy() {},
    async beforeMount() {
        //Most of the methods in this file are copied from idpListHeader.vue file
        //Not created a common service because these methods are making changes to "this" context very frequently.
        this.findFilter();
        this.columns = this.tableProps.columns;
        this.showTabs = this.tableProps.hasOwnProperty('showTabs') ? this.tableProps.showTabs : this.showTabs
     
        const filter = this.filter;
        this.searchText = filter.searchText || "";
        this.myDocuments = filter.myDocuments || "";
        this.dateFilter.name = filter.dateFilterName;
       
        //Get document Configuration
        const docTypeConfig = await CustomerConfig.getCustConfigByDocType(this.selectedDocType);
        this.stageMapConfig = _.get(docTypeConfig, "vendor_config.vendor_stage_tabs_by_order", []);
        this.stageMapConfig.sort((a, b) => a.order - b.order)

        //Set selected stages for tabs
        this.setSelectedStageTabs();    
      
        //Apply current staus for 'stage and state'
        this.applyCurrentStatus();

        //Apply filters
        this.applyFilters();
        
        //Set static and dropdown stages list
        this.handleTabsList();

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

        .kp-toolbar-input {
            input {
                width: 100%;
            }
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

.idp-vendor-list-header {
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
</style>
