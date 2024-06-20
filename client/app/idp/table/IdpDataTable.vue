<template>
<div  v-show="tableProps" class="idp-table-container">
    <el-table border @current-change="handleRowSelect" ref="tableReference" v-loading="loading" tooltip-effect="light" :fit="true" :default-sort="getDefaultSort" :show-header="true" :highlight-current-row="true" :data="tableData" :multipleSelection="selectedRows" @sort-change="handleSortChange" :max-height="tableProps.minHeight || 600" @selection-change="handleSelectionChange">
        <!-- :row-key="getRowKey"  -->
        <!--    <el-table-column fixed="left" :width="checkboxColumnWidth" v-if="!multiSelect" label="">
            <template slot-scope="props">
                <el-checkbox v-model="checked[props.row.__rowIndex]" :disabled="!canSelectRow(props.row, props.row.__rowIndex)" @change="
              (isSelected) => {
                onRowSelect(isSelected, props.row);
              }
            "></el-checkbox>
            </template>
        </el-table-column>

        <el-table-column fixed="left" type="selection" :width="checkboxColumnWidth" v-if="multiSelect" :selectable="canSelectRow">
        </el-table-column>-->
        <!-- :selectable="canSelectRow" -->

        <el-table-column fixed="left" type="selection" width="50" v-if="tableProps.multiSelect" :selectable="handleSelectable">
        </el-table-column>
        <el-table-column v-if="shouldShowExpandColumn" type="expand" width="20">
            <template slot-scope="props">
                <component v-bind:data="props" v-bind:expandTableParams="tableProps.expandTableParams"  v-bind:tableData="tableData" v-bind:columns="tableProps.expandColumns" v-bind:is="'Expand'" />
            </template>
        </el-table-column>

        <!-- header-align: alignment of the table header, options: left/center/right, default: left -->
        <el-table-column v-for="(column, key) in columnsToShow" :header-align="column.header_align" :key="key" v-bind="column" :prop="column.name" :width="column.width+''">

            <template slot-scope="scope">
                <component v-bind:index="scope.$index" v-bind="$props" :currentRow.sync="currentRow" v-bind:data="scope" v-bind:totalRowCount="totalRowCount" v-bind:options="column.options || {}" v-bind:is="column.cell_component || 'Cell'" />
            </template>

            <template slot="header" slot-scope="header">
                <component v-bind="$props" :currentRow.sync="currentRow" v-bind:data="header" v-bind:options="column.options || {}" v-bind:totalRowCount="totalRowCount" v-bind:is="column.header_component || 'Header'" />
            </template>

        </el-table-column>

        <el-table-column
            v-if="showAction && (tableProps.inlineActionButtons || tableProps.outlineActionButtons)"
            fixed="right"
            label="Actions"
            width="70">
            <template slot-scope="scope">
                    <div class="action-button-container" v-if="hasColumnPermission('Actions')">
                        <ListActions
                        :inlineActionButtons="tableProps.inlineActionButtons"
                        :outlineActionButtons="tableProps.outlineActionButtons"
                        :rowData="scope"
                        v-bind="$props" />
                    </div>
            </template>
        </el-table-column>
    </el-table>

    <div v-if="!loading" class="idp-table-footer-container">
        <el-row>
            <el-col :span="2.6" class="per-page-title">
                <span>Rows per page:</span>
            </el-col>
            <el-col :span="1" class="per-page-count">
                <el-select v-model="pageSize" class="page-count-dropdown-container" placeholder="Select" @change="handlePageSizeChange">
                    <el-option v-for="pageSize in tableProps.paginationSizes" :key="pageSize" :label="pageSize" :value="pageSize">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="16" class="idp-table-pagination">
                <el-pagination layout="prev, pager, next" :page-size="pageSize" :current-page="tableProps.selectedPage" @current-change="handlePageChange" :total="totalRowCount">
                </el-pagination>
            </el-col>
        </el-row>
    </div>
</div>
</template>

<script>
import Cell from "./components/Cell";
import Link from "./components/Link";
import LinkList from "./components/LinkList";
import PdfViewer from "./components/PdfViewer";
import Date from "./components/Date";
import ActionIcon from "./components/ActionIcon";
import Dot from "./components/Dot";
import FileIcon from "./components/FileIcon";
import RadioButton from "./components/RadioButton";
import MessageIndicator from "./components/MessageIndicator";
import Badge from "./components/Badge";
import Icon from "./components/Icon";
import ListIcon from "./components/ListIcon";
import Header from "./components/Header";
import ListActions from "../../idp/components/ListActions.vue";
import StatusWrapper from "./components/StatusWrapper";
import LabelMap from "./components/LabelMap";
import Duration from "./components/Duration";
import Expand from "./components/Expand";
import AjaxService from "@/services/AjaxService";
import flatten from "flat";
import EventBus from "@/EventBus";
import _ from "lodash";
import moment from "moment";
import DocumentService from "@/doc-ex/services/DocumentService";
import Constants from "@/resources/Constants";
import TableAPIService from "@/services/TableAPIService";
import IdpSheetService from "@/idp/services/excel/IdpSheetService";
import CustomerConfig from "@/idp/services/DeCustomerConfig";
import ActionButtonConfig from "../../idp/services/ActionButtonConfig"

export default {
    name: "IdpDataTable",
    props: {
        "tableProps": {},
        "isReviewerOnly":false,
        "document_type" : "",
    },
    watch: {
        "tableProps": {
            handler: function (newVal, oldVal) {
                if(!newVal.tableConfigLoaded) return;
                this.clonedQuery = newVal.query
                this.init()
            },
            deep: true,
            immediate:true
        },
        currentRow:{
             handler: function (newVal, oldVal) {
                if(!newVal)return;
                this.$emit('handleRowSelect', newVal)
            },
            deep: true,
            immediate:true
        }
    },
    components: {
        Cell,
        Header,
        Expand,
        Link,
        Date,
        Dot,
        ActionIcon,
        FileIcon,
        MessageIndicator,
        ListActions,
        StatusWrapper,
        Icon,
        ListIcon,
        Duration,
        LabelMap,
        Badge,
        RadioButton,
        LinkList,
        PdfViewer
    },
    computed: {
        shouldShowExpandColumn() {
            const { expandColumns, expandTableParams } = this.tableProps;
            return (
                (expandColumns && expandColumns.length > 0) ||
                (expandTableParams && (expandTableParams.type === 'packages' || expandTableParams.type === 'email'))
            );
        },

        getDefaultSort() {
            let sortColumn = this.tableProps.sortColumn || "_id";
            let order = (sortColumn + "").startsWith("-") ?
                "descending" :
                "ascending";
            sortColumn =
                order == "descending" ?
                sortColumn.substring(1, sortColumn.length) :
                sortColumn;
            return {
                prop: this.tableProps.sortColumn,
                order: order,
            };
        },
        showExportButton(){
            return this.stage == Constants.DOCEX.STAGE.PUBLISHED;
        }
    },
    data() {
        return {
            clonedQuery:{},
            checked: [],
            checkboxColumnWidth: 50,
            loading: true,
            selectedRow: null,
            selectedRows: [],
            selectedPage: 1,
            pageSize: this.tableProps.defaultPageSize || 15,
            totalRowCount: 0,
            searchText: "",
            filter: {},
            visibleColumns: [],
            tableData: [],
            multable: false,
            showAction: true,
            extractionInterval: "",
            publishInterval:"",
            currentRow : null,
            columnsToShow:[],
            customerConfiguration : {}
        };
    },
    sockets: {
        connect: function () {},
        disconnect: function () {},
        //This socket event receives the document's data from server after stage/state update of document
        [Constants.SOCKET_EVENTS.DOCUMENT.STATE_UPDATE]: function (documentData) {
            console.log("check socket event for STATE_UPDATE");
           //Check if document is present in DataTable list
            const updatedDocStageData = _.find(this.tableData, {
                _id: documentData._id
            });

            console.log("check updatedDocStageData",updatedDocStageData);


            //if updated document found in DataTable list
            if (updatedDocStageData) {
                console.log("check documentData.stage",documentData.stage)
                if (documentData.stage == 'Published') {
                    /**Publish Event
                     * if updated document stage is 'Published', refresh DataTable
                    */
                    this.refreshTable();
                } else {
                    /**Extraction Event
                     * 1. If the modified document has children or if current view is package/orphan, then refresh the whole table
                     * 2. Otherwise update row data
                    */
                    console.log("check inside extraction")
                    if (this.checkIfTableDataChanged(documentData)) {
                        this.refreshTable();
                    }
                    else {
                        console.log("call updateTableRow")
                        this.updateTableRow(documentData);
                    }
                }
            }

            console.log("end for socket event")
        }
    },
    methods: {
        //If the modified document has children or if current view is package/orphan, then refresh the whole table
        checkIfTableDataChanged(document) {
            return document["is_multi_documents_present"] == true || document["document_type"] == Constants.DOCEX.DOCUMENT_TYPES.OTHER ||  document["type"] == Constants.DOCEX.FIELD_LEVEL.PACKAGE;
        },

        tableExpand(row) {
            row.isPackageOpen ? (row.isPackageOpen = false) : (row.isPackageOpen = true);
        },

        handleRowSelect(val) {
           this.currentRow = val;
        },

        export() {
            let queryParam = this.getApiQuery() || {};
            //for pending approval document used lookupquery to get list of approvers
            if (typeof queryParam.query.stage == "string" && queryParam.query.stage == Constants.DOCEX.STAGE.WAITING_FOR_APPROVAL) {
                queryParam.query = {
                    ...queryParam.query,
                    lookupKey: {
                        lookup: {
                            from: "approval",
                            let: { "docId": "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: [ "$document_id", "$$docId" ] },
                                                { $eq: [ "$approval_status", "Requested" ] }
                                            ]
                                        }
                                    }
                                }
                            ],
                            as: "approvalDocData"
                        },
                        addFields: {
                            "pending_approvar_emails": {
                                $reduce: {
                                    input: "$approvalDocData.email",
                                    initialValue: "",
                                    in: {
                                        $concat: [
                                            "$$value",
                                            {
                                                $cond: {
                                                    if: {
                                                        $eq: [
                                                            "$$value",
                                                            ""
                                                        ]
                                                    },
                                                    then: "",
                                                    else: ", "
                                                }
                                            },
                                            "$$this"
                                        ]
                                    }
                                }
                            },
                            "pending_approval_time": {
                                $arrayElemAt: [ "$approvalDocData.updated_time", 0 ]
                            },
                            "approval_level": {
                                $concat: [
                                    "L",
                                    {
                                        $toString: {
                                            $arrayElemAt: [ "$approvalDocData.approval_level", 0 ]
                                        }
                                    }
                                ]
                            },

                        },
                        project: { "approvalDocData": 0 }
                    }
                }
            }

            const apiName = this.tableProps.apiName;
            const query = JSON.stringify(queryParam.query);
            const endPoint = `${window.location.origin}${apiName}?exportCsv=true&query=${query}&sort=${queryParam.sort}`;
            window.open(endPoint, "_self");
        },
        getApiQuery() {
            return {
                limit: this.pageSize,
                sort: this.tableProps.sortColumn,
                skip: (this.tableProps.selectedPage - 1) * this.pageSize,
                query: {
                    ...(this.clonedQuery || {}),
                    active: true
                },
                select : this.tableProps.select
            };

        },
        getDataApiQuery() {
            let query = this.getApiQuery();
            return query;
        },

        getDataApi() {
            return `/portal/api/table/${this.tableProps.tableName}`;
        },
        async getRecordsUsingAjax() {
            let response={}
            try{
            // let skip = (this.selectedPage - 1) * this.pageSize
            response = await Promise.all([
                    this.getdocumentRecord(),
                   // DocumentService.fetchDocumentData(this.clonedQuery,skip,this.pageSize,this.sortColumn),
                    DocumentService.fetchCount(JSON.parse(JSON.stringify(this.clonedQuery)), this.tableProps.tableName),
                ])
            }catch(e){
                console.log("Error occured while getting data.",e)
            }
            finally{
                return response;
            }

        },

        getdocumentRecord() {
            return new Promise((resolve, reject) => {
                AjaxService.getJson(
                    this.getDataApi(),
                    this.getApiQuery(),
                    (error, response) => {
                        if (error || !response) {
                            reject(error || new Error("Data fetching failed"));
                            return;
                        }
                        resolve(response.data ? response.data.response : response);
                    }
                );
            });
        },

        handleSortChange(params) {
            let sort = params.order == "ascending" ? params.prop : "-" + params.prop;
            if (!params.order) {
                params.prop.includes(this.tableProps.sortColumn.replace('-', '')) ? sort = params.prop : '';
            }
            if (sort == this.tableProps.sortColumn) return;
            this.tableProps.sortColumn = sort;
            this.applyFilters();
        },
        showAllColumns() {
            this.visibleColumns = this.tableProps.columns.map((col) => {
                return col.name;
            });
            this.columnsToShow = this.tableProps.columns.filter((col) =>
                this.visibleColumns.includes(col.name)
            );
        },
        onColumnSelectionClick(event) {
            this.visibleColumns.pop();
            this.applyFilters();
            this.$emit && this.$emit("onColumnSelectionClick", event);
            console.log("On gear click", event);
        },

        setFilter() {
            try {
                if(!this.tableProps.readParamsFromUrl)
                {
                    return;
                }
                this.filter = this.getParamsFromURL();
            } catch (err) {
                console.log(err)
            }
        },

        getParamsFromURL(){
             const urlParams = new URLSearchParams(window.location.search);
             const filterString = urlParams.get("filter");
             return (JSON.parse(filterString || "{}"));
        },

        applyFilter() {
            if(!this.tableProps.readParamsFromUrl){
                this.init();
                return;
            }
            this.pushQueryParams();
        },

        pushQueryParams(){
            let url = window && window.location && "" + window.location.pathname;
            let splitted = url.split("/app");
            url = splitted.length > 1 ? splitted[1] : url;
            this.$router &&
                this.$router.push({
                    path: url,
                    query: {
                        filter: JSON.stringify(this.filter || {}),
                    },
                });
        },

        applyFilters() {
            this.setFilter();
            const currentFilters = this.filter[this.tableProps.tableIdentifier] || {};
            currentFilters["selectedPage"] = this.selectedPage;
            currentFilters["pageSize"] = this.pageSize;
            currentFilters["searchText"] = this.searchText;
            currentFilters["visibleColumns"] = this.visibleColumns;
            currentFilters["sortColumn"] = this.tableProps.sortColumn;
            this.filter[this.tableProps.tableIdentifier] = currentFilters;
            this.applyFilter();
        },

        async getConfiguration() {
            let documentType=this.tableProps.query && this.tableProps.query.document_type
            this.customerConfiguration = await CustomerConfig.getCustConfigByDocType(documentType);
        },
        initByFilter(pageNumber) {
            this.setFilter();

            //Retrive page size value from window object against docType
            let documentListPageSize = 0;
            const docType = `idp_${this.tableProps.query.document_type}_list`;
            if(window[docType + "_page_size"]){
                documentListPageSize = window[docType + "_page_size"];
            }
            const currentFilters = this.filter[this.tableProps.tableIdentifier] || {};
            this.tableProps.selectedPage = pageNumber || currentFilters["selectedPage"] || 1;
            this.pageSize = currentFilters["pageSize"] || documentListPageSize || this.tableProps.defaultPageSize || 15;
            this.searchText = currentFilters["searchText"] || "";
            this.tableProps.sortColumn =
                currentFilters["sortColumn"] || this.tableProps.sortColumn || "_id";

            const dateFilter = {};
            const dateFormat = "YYYY-MM-DDTHH:mm:ss";
            if (this.filter["dateFilter"]) {
                for (const [key, range] of Object.entries(
                        this.filter["dateFilter"] || {}
                    )) {
                    dateFilter[key] = {
                        $gte: moment(range["$gte"]).utc().format(dateFormat),
                        $lte: moment(range["$lte"]).utc().format(dateFormat)
                    };
                }
            }

            // If the Inbox is chosen and a filter, such as "My Invoice," is applied, the filter value is stored in the URL parameter 'filter'.
            // If the user then clicks on 'All' Stage, the previously applied filter values remain in the url 'filter'.
            // To address this, we check if the current stage is set to 'All,' and if so, we update the 'myDocuments' value to 'allStageDocuments'.
            if(_.get(this.filter, "stage") === "All") {
                this.clonedQuery.myDocuments = "allStageDocuments"
            }

            this.clonedQuery = {
                ...(this.clonedQuery || {}),
                ...dateFilter,
            };
            this.showAllColumns();
            if(this.tableProps.pushFilterToUrl){
                this.filter[this.tableProps.tableIdentifier] = currentFilters;
                this.applyFilter();
            }

        },

        async fetchData() {
            this.loading = true;
            this.tableData = [];
            let result = await this.getRecordsUsingAjax().catch((err) => {console.log("idpdatatable: Error while getting data",err)});
            if (!result || !result.length) {
                this.tableData = [];
                this.totalRowCount = 0;
                this.loading = false;
                return;
            }

            let data = result[0];
            /**
                As groupDocumentsByParent() iterated over data, so excute only when data is not empty, else it is causing error:
                we encountered an issue where 'tableData' is not iterable as we get continuous loader.
             */
            data = !_.isEmpty(data) && this.groupDocumentsByParent(data);
            if (this.tableProps.sortColumn.includes('created_at') || this.tableProps.sortColumn.includes('updated_at')) {
                this.tableData = this.updateRecordsForToDots(data)
            } else {
                this.tableData = data;
            }
            this.totalRowCount = result[1] || 0;
            clearInterval(this.extractionInterval);
            clearInterval(this.publishInterval);

            this.extractionInterval = setInterval(() => {
                this.checkExtractionStatus();
            }, Constants.DOCEX.EXTRACTION_REFRESH_TIME);
             this.publishInterval = setInterval(() => {
                this.checkPublishStatus();
            }, Constants.DOCEX.PUBLISH_REFRESH_TIME);

            this.loading = false;
        },
        async checkExtractionStatus() {
            // Check if Any progress extraction
            const documentProcessStates = [Constants.DOCEX.STATE_UPLOADED.REQUESTED,
                                            Constants.DOCEX.STATE_UPLOADED.QUEUED,
                                            Constants.DOCEX.STATE_UPLOADED.PENDING,
                                            Constants.DOCEX.STATE_UPLOADED.IN_PROGRESS,
                                            Constants.DOCEX.STATE_UPLOADED.EXTRACTED];

            let inProgressExtraction = _.filter(this.tableData, (item) => {
                if (documentProcessStates.includes(item.state))
                    return item;
            });

            if (inProgressExtraction.length) {
                // Get all Updated Records
                let response = await DocumentService.getExtractedDocument({
                    _id: {
                        $in: _.map(inProgressExtraction, "_id")
                    },
                },['-excel_data']);

                // Get all Extraction completed records
                let extractedDocument = _.filter(response, (item) => {
                    if (!documentProcessStates.includes(item.state))
                        return item;
                });

                // update __rowIndex

                _.forEach(extractedDocument, (doc) => {
                    let __rowIndex = _.find(this.tableData, {
                        _id: doc._id
                    }).__rowIndex;
                    doc.__rowIndex = __rowIndex;
                });

                function isRefresTable(document) {
                    return document.is_multi_documents_present === true || document["document_type"] == "other" || document.stage == Constants.DOCEX.STAGE.PUBLISHED || document.type == 'package';
                }

                // Update in Datatable of extracted records
                for (var key in extractedDocument) {
                    this.updateTableRow(extractedDocument[key]);
                    if (isRefresTable(extractedDocument[key]))
                        this.init()
                }
            }
        },
        async checkPublishStatus() {
            // Check if Any publish in progress
            let inPublishProgress = _.filter(this.tableData, (item) => {
                if (item.state == Constants.DOCEX.STATE_PUBLISHED.PUBLISH_IN_PROGRESS)
                    return item;
            });

            if (inPublishProgress.length) {                // Get all Updated Records
                let response = await DocumentService.getExtractedDocument({
                    _id: {
                        $in: _.map(inPublishProgress, "_id")
                    },
                });

                // Get all publish completed records
                let publishedDocument = _.filter(response, (item) => {
                    if (item.state != Constants.DOCEX.STATE_PUBLISHED.PUBLISH_IN_PROGRESS)
                        return item;
                });

                // update __rowIndex

                _.forEach(publishedDocument, (doc) => {
                    let rowData = _.find(this.tableData, {
                        _id: doc._id
                    });
                    doc.__rowIndex = rowData.__rowIndex
                    this.$set(this.tableData, rowData.__rowIndex, doc)
                    if(doc.stage == Constants.DOCEX.STAGE.PUBLISHED){
                        this.init()
                    }
                });
            }
        },
        updateRecordsForToDots(tableData) {
            if(this.customerConfiguration.show_doc_relation == Constants.DOCUMENT_RELEATIONS.EMAIL){
                this.groupDocumentsByEmail(tableData)
                return tableData
            }
            let docId = "";
            let doc_stages = [Constants.DOCEX.STATE_UPLOADED.SUCCESS, Constants.DOCEX.STATE_UPLOADED.EXTRACTED,
                Constants.DOCEX.STATE_UPLOADED.REQUESTED, Constants.DOCEX.STATE_UPLOADED.QUEUED,
                Constants.DOCEX.STATE_UPLOADED.PENDING, Constants.DOCEX.STATE_UPLOADED.IN_PROGRESS,
                Constants.DOCEX.STATE_PUBLISHED.PUBLISH_IN_PROGRESS,Constants.DOCEX.STATE_PUBLISHED.FAILED
            ]
            try {
                _.each(tableData, (doc, index) => {
                    if(doc.file_type == Constants.DOCEX.DOCUMENT_FILETYPES.EXCEL){
                        doc.expand_message = 'No data to display';
                    }
                    if (doc.is_multi_documents_present && _.get(tableData[index + 1], 'parent_document_id') == doc._id &&
                        _.includes(doc_stages, tableData[index + 1].state)
                    ) {
                        doc.dot_line_class = "start-line";
                        let childCount = _.filter(tableData, child => {
                            if (child.parent_document_id == doc._id) return child
                        }).length;
                        let countMessage = childCount > 1 ? 'are ' + childCount : 'is ' + childCount;
                        doc.expand_message = `This is parent. There ${countMessage} extracted document.`;
                        docId = doc._id;
                        return;
                    }
                    tableData = this.filterOutParentsWithoutChildren(tableData, index);
                    if (docId == doc.parent_document_id) {
                        if (
                            tableData[index + 1] &&
                            tableData[index + 1].parent_document_id == docId
                        ) {
                            doc.dot_line_class = "middle-line";
                            doc.dot_class = "child-dot";
                        } else {
                            doc.dot_line_class = "end-line";
                            doc.dot_class = "child-dot";
                        }
                    } else {
                        docId = "";
                    }
                });
                return tableData;
            } catch (e) {
                console.log(e)
                return tableData;
            }
        },

        /*
        This function determines whether there are any children for a parent document to display in the parent-child hierarchy;
        if not, the parent document is not displayed in list view.
        */
        filterOutParentsWithoutChildren(tableData, index){
            // first condition checks whether document is parent or not
            // second condition checks whether the parent_document_id of the next document is equal to the _id of the current document.
            if( _.get(tableData[index],'is_multi_documents_present') &&
                _.get(tableData[index + 1], 'parent_document_id') != _.get(tableData[index], '_id') )
            {
                tableData.splice(index,1);
            }
            return tableData;
        },

        /**
         * function that groups document rows by their parents, maintaining the sorted order
         *
         * Step 1. Make a map of {key: parent, value: array of children belonging to parent}
         * Step 2. Append newTableData array the values present in map, in the same order as inserted
         *
         * @param {Object} tableData ungrouped document rows
         * @returns {Object} grouped document rows
         */
        groupDocumentsByParent(tableData) {
            // Step 1. Make a map of kvp(key value pair): {key: parent row id, value: array of children belonging to parent}
            const tableDataMap = new Map();
            for (let row of tableData) {
                // add parent/single row to map
                if (!row.parent_document_id) {
                    // if map already has row id key
                    // happens when child row already created a kvp in map for current row
                    if (tableDataMap.has(row._id)) {
                        // adding the parent row at the start of the array so that it displays first
                        tableDataMap.get(row._id).unshift(row);
                    }
                    // if map doesnt have row id key then add a new kvp
                    else {
                        tableDataMap.set(row._id, []);
                        tableDataMap.get(row._id).push(row);
                    }
                }
                // add child row to map
                else {
                    // if row's parent id key is already present in map then push back to that kvp
                    if (tableDataMap.has(row.parent_document_id)) {
                        tableDataMap.get(row.parent_document_id).push(row);
                    }
                    // if parent id key is not present in map then add a new kvp
                    else {
                        tableDataMap.set(row.parent_document_id, []);
                        tableDataMap.get(row.parent_document_id).push(row);
                    }
                }
            }

            // Step 2. Append newTableData array the values present in map, in the same order as inserted
            let groupedTableData = [];
            tableDataMap.forEach((val, key) => {
                for (let row of val) {
                    // update the row indexes of the new rows and flatten the object
                    row["__rowIndex"] = groupedTableData.length;
                    groupedTableData.push(row);
                }
            })

            // return the grouped document rows
            return groupedTableData;
        },

        groupDocumentsByEmail(tableData){
            try {
                let conversationId = ""
                for(let [index,doc] of tableData.entries()){
                    if(!conversationId && _.get(doc,'email.conversationId') && _.get(tableData[index + 1], "email.conversationId")){
                        doc.dot_line_class = "start-line";
                        doc.dot_class = "child-dot"
                        conversationId = _.get(doc,'email.conversationId')
                        continue
                    }
                    if(conversationId && conversationId == _.get(doc,'email.conversationId')){
                        if (tableData[index + 1] && tableData[index + 1]["email.conversationId"]) {
                            doc.dot_line_class = "middle-line";
                            doc.dot_class = "child-dot";
                        } else {
                            doc.dot_line_class = "end-line";
                            doc.dot_class = "child-dot";
                        }
                    } else {
                        conversationId = "";
                    }
                }
                return tableData;
            } catch (e) {
                console.log(e)
                return tableData;
            }
        },

        onRowSelect(isSelected, row) {
            this.selectedRow ?
                (this.checked[this.selectedRow.__rowIndex] = false) :
                "";
            if (isSelected) {
                this.checked[row.__rowIndex] = true;
                this.selectedRow = row;
                this.selectedRows = [this.selectedRow];
            } else {
                this.selectedRow = null;
                this.selectedRows = [];
            }
        },
        handlePageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.selectedPage = 1;
            this.applyFilters();
        },
        handlePageChange(pageNumber) {
            this.selectedPage = pageNumber;
            this.applyFilters();
        },
        handleSelectable(row, index) {
            let result = false;
            const deleteAction = _.find(this.tableProps.outlineActionButtons, {
                name: "delete"
            })
            if (deleteAction && _.isArray(deleteAction.disableCheckKey)) {
                for (const key of deleteAction.disableCheckKey) {
                    result = deleteAction.disableValues[key] && deleteAction.disableValues[key].includes(row[key])
                    if (result) {
                        break;
                    }
                }
            }
            return !result
        },
        canSelectRow() {
            this.showAction = !_.includes([Constants.DOCEX.STAGE.DELETED], this.filter.stage)
            return !_.includes([Constants.DOCEX.STAGE.DELETED, Constants.DOCEX.STAGE.PUBLISHED], this.filter.stage)

        },
        getRowKey(row) {
            console.log("row iss:", row)
            // this.showAction=!_.includes([Constants.DOCEX.STAGE.DELETED], row.stage)
            // this.multable=!_.includes([Constants.DOCEX.STAGE.DELETED, Constants.DOCEX.STAGE.PUBLISHED], row.stage)
        },
        deleteRow(index, rows) {
            rows.splice(index, 1);
        },

        handleSelectionChange(val) {
            this.selectedRows = val;
        },
        // Single Delete
        deleteDocument(row) {
            return new Promise((resolve, reject) => {
                this.tableAPI.findByIdAndUpdate(
                    `/portal/api/table/de_document`,
                    "" + row._id, {
                        active: false
                    },
                    (error, response) => {
                        if (error || !response) {
                            reject(error);
                            return;
                        }
                        resolve(response.data);
                    }
                );
            });
        },
        deleteSelected() {
            if (_.isEmpty(this.selectedRows)) {
                this.$notify({
                    title: "Warning",
                    message: "Please select documents",
                    type: "warning",
                });
                return;
            }
            EventBus.$emit("IDP_DELETE_DOCUMENT", this.selectedRows);
        },
        assignSelectedDocuments(){
             if (_.isEmpty(this.selectedRows)) {
                this.$notify({
                    title: "Warning",
                    message: "Please select documents",
                    type: "warning",
                });
                return;
            }
            EventBus.$emit("IDP_ASSIGN_DOCUMENTS", this.selectedRows);
        },

        bulkDocumentDownload(){
            // Adding date filter in query to download documents based on selected date
            let clonedQuery = _.cloneDeep(this.tableProps.query);
            if(this.filter.dateFilterName && this.filter.dateFilter){
                clonedQuery = { ...clonedQuery, ...this.filter.dateFilter}
            }
            EventBus.$emit("IDP_DOWNLOAD_DOCUMENT", { rows:this.selectedRows, query: clonedQuery, totalRowCount : this.totalRowCount });
        },

        validateDocuments() {
            const state = Constants.DOCEX.STATE_UPLOADED
            const publishNotAllowedStates = [state.EXTRACTED,
                state.REQUESTED, state.QUEUED,
                state.PENDING, state.IN_PROGRESS ]

            _.each(this.selectedRows, (row) => {
                    if (row.has_errors|| _.includes(publishNotAllowedStates, row.state)) {
                        row.ready_to_publish = false;
                        return;
                    }
                    row.ready_to_publish = ((row.state !== state.FAILED) || ((row.state == state.FAILED && !_.isEmpty(row.publish_failure_reason)))) ? true : false;
                })
        },
        removeInvalidDocuments() {
            _.remove(this.selectedRows, (row) => {
                return this.isDocumentInvalid(row)
            })
        },
        async handleBulkPublish() {
            try {
                let selectedRows = _.cloneDeep(this.selectedRows)
                this.selectedRows = []
                this.$refs.tableReference.clearSelection();
                const result = await Promise.all(selectedRows.map((row) => {
                    if (row.is_multi_documents_present) {
                        return;
                    }
                    let rowData = _.find(this.tableData,{"_id":row._id});
                    rowData.state = Constants.DOCEX.STATE_PUBLISHED.PUBLISH_STARTED;
                    return DocumentService.publish({
                        document_id: row._id
                    })
                }))
                for (let i = 0; i < result.length; i++) {
                    const data = _.get(result[i], 'data.data')
                    if (!data.status) {
                        let errorMsg = data.message ? `${data.message}` : `Something went wrong while publishing the document.`;
                        this.$notify.error({
                            title: "Error",
                            dangerouslyUseHTMLString: true,
                            message: errorMsg
                        });
                    } else {
                        this.$notify({
                            title: "Success",
                            type: "success",
                            dangerouslyUseHTMLString: true,
                            message: data.message || "Document published successfully."
                        });
                    }
                    await new Promise(resolve => setTimeout(resolve, 500));
                };
                this.init();
            } catch (err) {
                throw new Error()
            }
        },
        async publishSelected() {
            if (_.isEmpty(this.selectedRows)) {
                this.$notify({
                    title: "Warning",
                    message: "Please select documents",
                    type: "warning",
                });
                return;
            }
            try {
                this.validateDocuments();
                this.checkErrorsAndPublish();
            } catch (error) {
                this.notifyError("Error while publishing record(s)!");
            }
        },

        async checkErrorsAndPublish() {
            try {
                let message = Constants.DOCEX.BULK_PUBLISH_CONFIRMATION
                if (_.every(this.selectedRows, (row) => {
                        return !row.ready_to_publish
                    })) {
                    this.$notify({
                        title: "Warning",
                        message: Constants.DOCEX.BULK_PUBLISH_ALL_INVALID,
                        type: "warning",
                        dangerouslyUseHTMLString: true
                    });
                    return;
                }
                if (_.some(this.selectedRows, row =>
                        !row.ready_to_publish
                    )) {
                    message = Constants.DOCEX.BULK_PUBLISH_PARTIAL_INVALID
                }

                const response = await this.$confirm(message, "Confirmation", {
                    confirmButtonText: "Confirm",
                    cancelButtonText: "Cancel",
                    type: "warning",
                    dangerouslyUseHTMLString: true
                }).catch((err) => {})
                if (!response) {
                    return;
                }
                _.remove(this.selectedRows, (row) => {
                    return !row.ready_to_publish
                });
                this.notifySuccess("Request to publish the document(s) has been submitted successfully.");
                this.handleBulkPublish()
            } catch (err) {
                throw new Error()
            }

        },

        updateTableRow(row) {
            let updateRowIndex = -1;
            for (let index = 0; index < this.tableData.length; index++) {
                if ("" + this.tableData[index]._id == "" + row._id) {
                    updateRowIndex = index;
                    break;
                }
            }

            if (updateRowIndex < 0) {
                return;
            }

            row["__rowIndex"] = this.tableData[updateRowIndex]["__rowIndex"];
            this.tableData[updateRowIndex] = row;
            if (this.tableProps.sortColumn.includes('created_at') || this.tableProps.sortColumn.includes('updated_at')) {
                this.tableData = this.updateRecordsForToDots(this.tableData)
            } else {
                this.tableData = data;
            }
            this.tableData = JSON.parse(JSON.stringify(this.tableData));
            console.log("Row Updated", row, updateRowIndex);
        },
        registerEvents() {
            this.tableAPI = new TableAPIService();
            EventBus.$on("IDP_BULK_DELETE_DOCUMENT", (row) => {
                this.deleteSelected();
            });

            EventBus.$on("IDP_BULK_ASSIGN_DOCUMENTS", (row) => {
                this.assignSelectedDocuments();
            });

            EventBus.$on("IDP_BULK_DOC_DOWNLOAD", (row) => {
                this.bulkDocumentDownload();
            });

            EventBus.$on("IDP_BULK_PUBLISH_DOCUMENT", (row) => {
                this.publishSelected();
            });

            EventBus.$on("IDP_DOCUMENT_EXPORT", (row) => {
                this.export();
            });

            EventBus.$on("REFRESH_TABLE", (pageNumber) => {
                this.init(pageNumber);
            });

            EventBus.$on("ADD_QUERY", (filter) => {
                this.clonedQuery = filter
                this.init();
            });

            EventBus.$on("IDP_UPDATE_TABLE_ROW", (row) => {
                if (!row || !row._id) {
                    return;
                }
                this.updateTableRow(row);
            });

               EventBus.$on(
                Constants.BUS_EVENTS.PUSH_MESSAGE_IN_TRAY,
                (messageData, notify = false) => {
                    let rowData = _.find(this.tableData, {"_id":messageData.document_id});
                    rowData && (rowData.has_collab_messages = true)
                    this.$set(this.tableData,_.findIndex(this.tableData, {"_id":messageData.document_id}), rowData)
                }

            );
            EventBus.$on("IDP_CANCEL_EXTRACTION", async (row) => {
                await this.$confirm('Do you want cancel extraction process', 'Confirm', {
                    confirmButtonText: 'Proceed',
                    cancelButtonText: 'Cancel'
                }).then(async() => {
                    const response = await IdpSheetService.processCancelAction(row._id, "extraction");
                    // Need to move current document to cancelled tab
                    if(response.status){
                    this.notifySuccess(response.message)
                    this.refreshTable();
                    return;
                    }
                    this.notifyError(response.message)
                }).catch((error)=>{});
            });

            EventBus.$on("IDP_EXCEL_RETRY", async (row) => {
                const res = await this.$confirm('Do you want to retry', 'Confirm', {
                    confirmButtonText: 'Proceed',
                    cancelButtonText: 'Cancel'
                }).catch((error)=>{});
                if (!res) {
                    return;
                }
                const response = await IdpSheetService.processRetryAction(row._id);
                if(response.status){
                this.refreshTable();
                this.notifySuccess(response.message);
                return;
                }
                this.notifyError(response.message)
            });
        },

        deRegisterEvents() {
            EventBus.$off([
                "IDP_UPDATE_TABLE_ROW",
                "IDP_BULK_DELETE_DOCUMENT",
                "REFRESH_TABLE",
                "IDP_BULK_PUBLISH_DOCUMENT",
                "IDP_DOCUMENT_EXPORT",
                "IDP_CANCEL_EXTRACTION",
                "IDP_EXCEL_RETRY",
                "IDP_BULK_ASSIGN_DOCUMENTS",
                "IDP_BULK_DOC_DOWNLOAD",
            ]);
        },

        async init(pageNumber) {
            await this.getConfiguration()
            this.initByFilter(pageNumber);
            this.fetchData();
        },
        refreshTable(){
            this.init();
        }
    },
    beforeDestroy() {
        this.deRegisterEvents();
        clearInterval(this.extractionInterval);
        clearInterval(this.publishInterval);
        this.extractionInterval = null
        this.publishInterval = null
    },
    // beforeMount() {
    //     console.log("idpdatatable:: inside beforemount")
    //     this.init();
// },
mounted() {
    this.registerEvents();
        },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss">
@import "../_idpVariables";

.idp-table-container {
    .el-table {
        .el-table__body .el-table__expanded-cell {
                // background-color: var(--dark-09);
                border-bottom: 2px solid var(--dark-07);
                background-image: linear-gradient( var(--dark-09)0%, var(--dark-09) 0%,  #EBF4FF 100%);
                box-shadow: -5px -5px 7px rgba(0, 0, 0, .05) inset;
                    &:hover {
                    //    box-shadow: -5px -5px 10px rgba(0, 0, 0, .10) inset;
                    }
        }
        .el-table__header{
            width: 100% !important;
        }
        .el-table__body{
            width: 100% !important;
        }
        .el-table__cell {
            padding: 2px 0;
        }
        .el-table__fixed-right-patch {
            width: auto !important;
        }

        .el-table-column--selection .cell {
            transform: scale(0.75);
        }
    }

    .el-table__header-wrapper {
        .el-table_1_column_1 {

            .el-checkbox__input {
                padding-left: 3px;
            }
        }
    }

    .el-table {
        font-size: var(--font-base);
        border-radius: var(--radius-base) var(--radius-base) 0px 0px;
    }

    .el-table th {
        background-color: var(--dark-07);
    }

    .el-table thead {
        color: #4a5568;
    }

    .el-button--mini {
        padding: 0px;
        // font-size: 12px;
        border-radius: var(--radius-sm);
        background: inherit;
        border: 0px;
    }

    .el-button--mini:hover {
        color: var(--brand-04);
    }

    thead {
        th {
            padding: 0px;
            // font-style: normal;
            font-weight: normal;
            // letter-spacing: 0.02rem;
            font-size: var(--font-base);

            .caret-wrapper {
                margin-left: 0.1rem;
            }
        }
    }

    .el-checkbox__inner {
        border: 1px solid #718096;
        border-radius: var(--radius-sm);
        background-color: inherit;
    }

    .el-checkbox__input.is-disabled .el-checkbox__inner {
        border-color: #95a2b6 !important;
    }

    tbody {
        td {
            padding: 5px 0;
        }
    }

    .el-table__expand-column {
        .cell {
            padding-left: 0;
            padding-right: 0;
        }
    }

    .el-checkbox__inner {
        border: 1px solid #718096;
        border-radius: var(--radius-sm);
        background-color: inherit;
    }

    tbody {
        td {
            padding: 2px 0;
        }
    }

    tbody {
        tr:nth-child(even) {
            background-color: var(--dark-09);
        }

        tr:nth-child(odd) {
            background-color: var(--dark-08)
        }
    }

    .idp-table-footer-container {
        background: var(--dark-07);
        border-bottom-left-radius: var(--radius-lg);
        border-bottom-right-radius: var(--radius-lg);

        .el-input__inner {
            width: 100px
        }

        .el-input__suffix {
            padding-left: 5px;
        }

        .per-page-title {
            margin-top: var(--space-sm);
            margin-right: var(--space-xs);

            span {
                padding-left: 1.5rem;
                color: #718096;
                font-size: var(--font-sm);
            }
        }

        .per-page-count {
            .el-input {
                line-height: 2.5rem;
                color: #718096;
            }

            input {
                background: inherit;
                border: 0px;
                padding-left: 0px;
                font-size: var(--font-sm);
            }

            .el-input__suffix {
                left: 0.5rem;
                line-height: 1rem;
                font-weight: bold;
                color: #718096;
            }

            span {
                i {
                    font-weight: bold;
                    color: #718096;
                }
            }
        }

        .idp-table-pagination {
            text-align: center;

            .el-pagination {
                button {
                    background: inherit;
                }

                ul {
                    li {
                        background: inherit;
                        color: #718096;
                    }

                    .active {
                        color: #1dc0fc !important;
                    }
                }
            }
        }
    }

    .current-row{
        background-color: var(--brand-05) !important
    }

//    .document-select-list .datatable .el-table__body tr.current-row > td {
//         &:first-child {
//            border-left : 2px solid var(--brand-05);
//         }
//         background-color: var(--brand-07);
//     }
}

// Page drop down background color

.el-scrollbar__view .el-select-dropdown__list {
    background-color:var(--dark-08) !important;
}

.el-select-dropdown__list {
    background-color:var(--dark-08)!important;
}

i.el-icon-loading {
    color: var(--green-05);
    font-size: 16px;
    font-weight: 600;
}

.el-table--fluid-height .el-table__fixed,
.el-table--fluid-height .el-table__fixed-right {
    bottom: 0 !important;
    background: var(--dark-08);
    z-index: 1000;
}

.el-table__body-wrapper {
    width: calc(100%) !important;
}

.el-table__body-wrapper::-webkit-scrollbar {
    height: 10px !important;
}

// scroll
.el-table--scrollable-x .el-table__body-wrapper::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px var(--dark-06);
    background-color: var(--white);
}

.el-table--scrollable-x .el-table__body-wrapper::-webkit-scrollbar {
    height: 6px;
    background-color: var(--white);
}

.el-table--scrollable-x .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: var(--dark-05);
}

// scroll
.el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px var(--dark-06);
    background-color: var(--white);
}

.el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
    width: 6px;
    background-color: var(--white);
}

.el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: var(--dark-05);
}

//safari datatable fix
.el-table .cell.el-tooltip {
    white-space: nowrap;
    // min-width: 50px;
    // max-width: 140px;
}

.idp-status-col-container{
    .cell{
        padding-left: 10px;
        padding-right: 0px;
    }
}

.message-indicator-wrapper {
    .cell{
       padding:0px;
    }
 }

.file-icon-wrapper {
    .cell{
        padding:0px !important;
        display: flex;
        justify-content: center;
    }
 }
.center-class {
    text-align: center;
}
.el-table--border td {
    border-right: 0px solid #EBEEF5;
}
.is-disabled {
    opacity: 0.6;
}

.action-button-container {
    text-align: left;
    display: flex;
    justify-content: center;

    .action-buttons-line-dynamic{
        display:flex;
    }

    .el-button {
        font-size: 1.4rem;
        color: var(--dark-03);
        padding: 0 !important;
        margin-left: 5px !important;

        .mdi-cash-multiple::before {
            display: block;
            margin-top: -1px;
        }
    }
}
</style>
