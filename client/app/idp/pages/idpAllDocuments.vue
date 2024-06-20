<template>
    <main class="kp-main">
        <idp-list-header :key="tableProps.tableConfigLoaded" title="All Documents" :tableProps="tableProps" :filter="filter" :isReviewerOnly="isReviewerOnly" :stageTabConfig="stageTabConfig"></idp-list-header>
        <div class="page-body">
            <IdpDataTable title="" :tableProps="tableProps" :isReviewerOnly="isReviewerOnly"></IdpDataTable>
        </div>
        <DocumentAssign
        title="Assignment"
        @closeAssignmentDialogue="handleCloseAssignmentDialog"
        :documentType="document_type"
        :showAssignmentModel="showAssignmentModel"
        :assignModalProps="assignModalProps"
        ></DocumentAssign>
        <ApprovalListDialog :documentId="documentId"></ApprovalListDialog>
    </main>
</template> 
    
    <script>
    import IdpDataTable from "../table/IdpDataTable";
    import IdpListHeader from "./idpListHeader.vue";
    import Constants from "@/resources/Constants";
    import IdpTree from "@/idp/components/IdpTree.vue";
    import EventBus from "@/EventBus";
    import _ from "lodash";
    import DocumentService from "@/idp/services/DocumentService";
    import DocumentAssign from "@/idp/components/DocumentAssign.vue";
    import ApprovalListDialog from '@/idp/components/ApprovalListDialog';
    import IdpDashboardService from "@/idp/services/IdpDashboardService";
    import UserAccessService from "@/idp/services/UserAccessService";
    
    export default {
        name: "IdpAllDocumentList",
        data() {
            return {
                isReviewerOnly:false,
                showAssignmentModel:false,
                assignModalProps:{},
                allBusEvents: [],
                filter: {
                    stage: {},
                },
                tableProps: {
                    tableConfigLoaded:false,
                    readParamsFromUrl: true,
                    lookups: [],
                    multiSelect: true,
                    minHeight: 600,
                    tableName: "de_document",
                    tableIdentifier: "idp_all_docs_list",
                    sortColumn: "-created_at",
                    paginationSizes:[5, 15, 25,50],
                    apiName: `/portal/api/table/de_document`,
                    enableDateRangeFilter: true,
                    enableCustomerFilter: false,
                    enableGroupFilter:true,
                    select : '',
                    query: {
                        "page_count":{"$exists":true},
                        "storage_folder_path": {
                            $regex: ".*/*$"
                        },
                        "is_excel_parent" : {$ne:true},
                        active: true,
                    },
                    bulkActions: ['delete', 'publish', 'refresh', 'export'],
                    actions: [{
                            name: "assign",
                            label: "Assign",
                            icon: "mdi mdi-account-plus-outline",
                            class: null,
                            eventName: "IDP_ASSIGN_DOCUMENT",
                            disableCheckKey: ["state", "stage", "is_multi_documents_present", "is_data_deleted"],
                            disableValues: {
                                state: ["In progress", "Extracted", "Requested", "Queued", "Pending", "Publish in progress", "Publish started"],
                                stage: ["Published", "Deleted"],
                                "is_multi_documents_present": [true],
                                "is_data_deleted": [true]
                            },
                            outline: true
                        }, {
                            name: "download",
                            label: "Download",
                            icon: "mdi mdi-arrow-down-thin-circle-outline",
                            class: null,
                            eventName: "IDP_DOWNLOAD_DOCUMENT",
                            disableCheckKey: ["state", "stage"],
                            disableValues: {
                                state: ["In progress", "Requested", "Queued", "Pending"],
                                stage: ["Deleted"]
                            }
                        },
                        {
                            name: "cancel_extraction",
                            label: "Cancel extraction",
                            icon: "mdi mdi-stop-circle-outline",
                            class: null,
                            eventName: "IDP_CANCEL_EXTRACTION",
                            checkStatus:'excel_config.enable_cancel_extraction',
                            disableCheckKey: ["state","stage","file_type"],
                            disableValues: {state:["Success"],stage:["Published", "Cancelled"], "file_type":["pdf"]},
                            outline :true
                        },
                        {
                            name: "excel_retry",
                            label: "Retry",
                            icon: "mdi mdi-reload",
                            class: null,
                            eventName: "IDP_EXCEL_RETRY",
                            disableCheckKey: ["state","stage","file_type","is_excel_child"],
                            disableValues: {state:["In progress",  "Publish in progress", "Requested"], stage:["Published", "Extracted", "Approved", "Errored", "Deleted", "Uploaded"], "file_type":["pdf"],is_excel_child : [true]},
                            outline :true
                        },
                        {
                            name: "delete",
                            label: "Delete",
                            icon: "mdi mdi-delete",
                            class: null,
                            eventName: "IDP_DELETE_DOCUMENT",
                            disableCheckKey: ["state", "is_multi_documents_present", "is_data_deleted","soft_deleted"],
                            disableValues: {
                                state: ["In progress", "Requested", "Queued", "Pending", "Publish in progress", "Extracted", "Publish started"],
                                "is_multi_documents_present": [true],
                                "is_data_deleted": [true],
                                "soft_deleted":[true]
                            },
                            outline: true
                        },
                        {
                            name: "mark_published",
                            label: "Mark as published",
                            icon: "mdi mdi-publish",
                            class: null,
                            eventName: "IDP_DOCUMENT_MARK_PUBLISHED",
                            disableCheckKey: ["state", "is_multi_documents_present", "stage", "publish_failure_reason"],
                            disableValues: {
                                state: ["In progress", "Requested", "Queued", "Pending", "Publish in progress", "Extracted", "Publish started", "Success"],
                                "is_multi_documents_present": [true],
                                stage: ["Published"],
                                publish_failure_reason: [null, "", undefined]
                            },
                            outline: true
                        },
                        {
                            name: "restore",
                            label: "Restore",
                            icon: "mdi mdi-restore",
                            class: null,
                            eventName: "IDP_DOCUMENT_RESTORE",
                            disableCheckKey: ["stage","soft_deleted"],
                            disableValues: { stage:["In progress","Requested","Queued","Pending","Publish in progress","Published","Extracted","Publish started", "Success","Failed"],soft_deleted:[false,null,undefined,""]},
                            outline :true
                        },
                        {
                            name: "move_to_inbox",
                            label: "Move to inbox",
                            icon: "mdi mdi-folder-move",
                            class: null,
                            eventName: "IDP_DOCUMENT_MOVE_TO_INBOX",
                            disableCheckKey: ["stage","state"],
                            disableValues: { stage: ["Rejected", "Fraud flagged", "Fraud confirmed","Approval rejected", "Published", "Extracted", "Errored", "Deleted", "Uploaded", "Paid"], state:["Failed"]},
                            outline :true
                        }
                    ],
                    columns: [],
                    expandColumns: []
                },
                publishedDateColumn: {
                    name: "published_at",
                    label: "Published date",
                    header_component: null,
                    cell_component: "Date",
                    sortable: true,
                    width: '140',
                    showTooltipWhenOverflow: true,
                },
                stageTabConfig: []
            };
        },
        computed: {
            getTabClass(tabName) {},
       },
        methods: {
            deRegisterEvents(){
                EventBus.$off(this.allBusEvents);
            },
            registerEvents() {
                this.allBusEvents = ["IDP_ASSIGN_DOCUMENT"];
                //this is used in table action so currently not removing this event
                EventBus.$on("IDP_ASSIGN_DOCUMENT", async (row) => {
                    this.showAssignmentModel = true
                    this.assignModalProps = row
                });
            },
            handleCloseAssignmentDialog(isTableRefreshRequired){
                this.showAssignmentModel = false;
                if(!isTableRefreshRequired) return;
            },

            initColumnFilters(searchText) {
                const columnFilter = DocumentService.getTableColumnFilters({
                    searchText,
                    columns: this.tableProps.columns
                });
                this.tableProps.query = {
                    ...columnFilter,
                    ...(this.tableProps.query || {}),
                };
             this.tableProps.tableConfigLoaded = true;
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
             
            //to set columns
            async setTableColumns() {
            //getting stage from url filter else getting it from constant.
                var queryParams = {
                document_type:Constants.DOCEX.DOCUMENT_TYPES.INVOICE,
                stage: this.filter.stage || this.filter.state || Constants.DOCEX.STAGE.UPLOADED,
                category: "documents",
                isExpandColumns:true

                };
                const tableConfigResponse = await DocumentService.getTableConfig(queryParams);
                // to set table headers columns
                this.tableProps.columns = tableConfigResponse.columns.data;
                // to set expand columns
                this.tableProps.expandColumns = tableConfigResponse.expand_columns.data;
                //Get all column Names
                let allColumnsNames  = tableConfigResponse.projection_columns_names;

                this.tableProps.select = allColumnsNames.toString();

            }
        },
        components: {
            IdpDataTable,
            IdpListHeader,
            IdpTree,
            DocumentAssign,
            ApprovalListDialog
        },
        created() {},
        mounted() {},
        async beforeDestroy() {
            this.deRegisterEvents();
        },
        async beforeMount() {
            this.registerEvents();
            //If current document_type is not 'summary' then, set current document_type 
            //Otherwise set current document_type as 'invoice'
            const dashboardFilters = IdpDashboardService.getCurrentDashboardFilters();
            let currentDocType = Constants.DOCEX.DOCUMENT_TYPES.INVOICE;
            if (dashboardFilters["document_type"] != "summary") {
                currentDocType = dashboardFilters["document_type"];
            }
            this.$store.commit("setDocumentType", currentDocType);
            this.$store.commit("setDisplayIdpTree",true);
            
            //Get tab configuration based on document type
            this.stageTabConfig = await UserAccessService.getTabConfig(currentDocType);
       
            this.findFilter();
            //To get dynamic table columns with expand columns
            await this.setTableColumns();
            const user = this.$store.getters.user;
            this.isReviewerOnly= _.get(user,"is_reviewer_only") // return true, if user role is revieweronly
            //for extraction accuracy bucket chart remove active and folder path
            if(this.filter.extr_acc_bucket)        
            {
                this.$set(this.tableProps, 'query', {active: true,
                        extr_acc_bucket:this.filter.extr_acc_bucket,
                        ...(this.filter.vendor_name && {vendor_name:this.filter.vendor_name})
                });
            } 
    
            if (this.filter.stage) {
                this.tableProps.query.stage = this.filter.stage;
            } else if (this.filter.state) {
                this.tableProps.query.state = this.filter.state;
            } else {
                this.tableProps.query.stage = { '$in': [Constants.DOCEX.STAGE.UPLOADED,Constants.DOCEX.STAGE.EXTRACTED ]};
            }
    
            !this.filter.extr_acc_bucket && (this.tableProps.query.storage_folder_path = {
                $regex: this.filter && this.filter.folderPath ?
                    ".*" + this.filter.folderPath + "$" : ".*/*$",
            });
    
            this.filter.invoice_type && (this.tableProps.query.invoice_type = this.filter.invoice_type)
            this.tableProps.lookups = this.filter.lookups || [];

            // Removing created_at if landing form drilldown 
            const secondaryQuery = _.omit(this.filter.secondary, ["created_at"]);

            // Merge original and secondary query for drilldown
            this.tableProps.query = { ...(this.tableProps.query || {}), ...(secondaryQuery || {}) };

            // tableConfigLoaded is added to load datatable when all configuration is loaded.
            this.tableProps.tableConfigLoaded = true;
            let searchText =
                this.filter.searchText && ("" + this.filter.searchText).trim();
            if (searchText) this.initColumnFilters(searchText);
        },
    };
    </script>
    
    <style lang="scss" scoped>
    @import "../_idpVariables";
    @import "../_idpGlobal";
    </style>
    
