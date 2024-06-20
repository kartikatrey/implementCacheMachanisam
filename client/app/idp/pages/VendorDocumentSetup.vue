<template>
    <el-main class="kp-main slushbucket_container">
        <section class="page-body">
            <div class="page-title"  v-if="form._id">
                <el-button  cid="form-header-back" v-on:click="$router.push('/idp/vendor/document-setup-list')" icon="mdi mdi-arrow-left-circle-outline"></el-button>
                <span class="page-title-text">Edit {{pageTitle}}</span>
                <span> Add Document Type Configurations </span>
            </div>
            <section v-loading="loading" class="form-page-container tabs-page-container">
                <div class="panel">
                    <div class="panel-body">
                        <el-form label-position="left" :model="form" ref="form" label-width="120px">
                            <el-tabs v-model="activeTab">
                                <el-tab-pane  label="Vendor List View Config" name="vendor_list_view_table_configuration">
                                    <el-divider content-position="left">Vendor Dynamic Tab Config</el-divider>
                                    <div class="accordian-bar accordian-bar-div">
                                        <div class="panel-body">
                                        <section>
                                            <div class="table-wrap">
                                                <DualListBox
                                                    :source="dynamicTabsSlushBucketData.source"
                                                    :destination="dynamicTabsSlushBucketData.destination"
                                                    label="label"
                                                    @onChangeList="(changedData) => {onDynamicTabsListChange(changedData)}"
                                                />
                                            </div>
                                        </section>
                                        </div>
                                    </div>
                                    <div class="tab-body">
                                        <div data-v-step="2" class="table-wrap" >
                                            <data-table :parameters="vendorListViewTableParams" ref="listViewDatatable"></data-table>
                                        </div>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </el-form>
                    </div>
                    <footer>
                        <div></div>
                        <div>
                            <el-button size="small" cid="doc-setup-form-cancel" v-on:click="$router.push('/idp/vendor/document-setup-list')" name="cancel"> Cancel</el-button>
                        </div>
                        <div>
                            <el-button size="small" cid="doc-setup-form-save" type="primary" v-on:click="onSave" name="save"> Save</el-button>
                        </div>
                    </footer>
                </div> 
            </section>
        </section>    
        <div v-if="displayAddListViewPopupModal">
            <el-dialog
                top="5vh"
                :before-close="closeListColumnDialog"
                width="55%"
                :show-close="false"
                :destroy-on-close="true"
                class="folder-modal-container list-view-model"
                title="List view column config"
                :visible.sync="displayAddListViewPopupModal"
                center
            >
                <AddListColumnDialog 
                    pageTitle = "Vendor List View Column Configuration"
                    :documentType="form.document_type" 
                    :data="form.vendor_list_view_columns" 
                    @updateForm="setAndUpdateForm" 
                    :addListViewPopupModalData="addListViewPopupModalData" 
                    :displayAddListViewPopupModal.sync="displayAddListViewPopupModal" />
                </el-dialog>
        </div>   
        <VersionRelatedList v-if="showVersionList" :id="form._id"  title="Document Type Versions"></VersionRelatedList>
    </el-main>
</template>
    
<style lang="scss">
@import "../_idpGlobal.scss";
@import "../_idpVariables.scss";

.accordian-bar-div{
    margin-bottom: 24px;
}

.slushbucket_container {
   .footer_row {
    margin: 16px 0px 016px 16px;
    float: right;
    }
    div.bulk-action:hover {
    cursor: pointer;
    }
    div.bulk-action {
    .select-all {
        padding: 4px;
        background-color: #5a67d8;
    }
    .deselect-all {
        padding: 4px;
        color: #96989a;
        background: white;
        border-radius: 0px;
    }
    }

    ul.list-box {
    li.list-item.active {
        background-color: #5a67d8 !important;
        color: var(--white);
    }
    li.list-item.active:hover {
        background-color: #5a67d8;
        color: var(--white);
    }
    }

    .el-tab-pane {
    font-family: var(--font-family);
    font-size: var(--font-sm);
    font-weight: normal;
    div.clear-search {
        padding: 0px 4px 0px 4px;
        margin: 4px;
        border: 1px solid;
        border-radius: 10px;
        color: #6c757d;
    }

    .list-box-wrapper {
        .list-box-item {
        border-radius: 0px;
        input {
            background-color:var(--dark-07);
        }
        input:hover {
            border-radius: 0px;
            border: none;
        }
        &::placeholder {
            font-family: var(--font-family);
            font-size: var(--font-sm);
            font-weight: normal;
        }
        }
        .actions {
        div.btn-action {
            background-color: #5a67d8;
            padding: 0px 4px 0px 4px;
            svg {
            height: 1rem;
            width: 1rem;
            }
        }
        }
    }
    }

    .list-box::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px var(--dark-06);
    background-color: var(--white);
    }

    .list-box::-webkit-scrollbar {
    width: 6px;
    background-color: var(--white);
    }

    .list-box::-webkit-scrollbar-thumb {
    background-color: var(--dark-05);
    }
}
</style>
    
<script>
import Constants from "@/resources/Constants";
import EventBus from "@/EventBus";
import _ from "lodash";
import CustomerConfig from "@/idp/services/DeCustomerConfig";
import DataTable from "@/components/DataTable.vue";
import AddListColumnDialog from "@/idp/components/AddListColumnDialog.vue";
import DualListBox from "@/idp/components/DualListBox.vue";
import VersionRelatedList from "@/idp/components/VersionRelatedList.vue";
import DocumentSetupService from "@/idp/services/internal/DocumentSetupService";
    
export default {
    name: "VendorDocumentConfigForm",
    components: {
        DataTable, DualListBox, AddListColumnDialog, VersionRelatedList
    },
    data() {
        return {
            configId : this.$route.query.id || '',
            pageTitle: "Document Type",
            activeTab:'vendor_list_view_table_configuration',
            form: {
                vendor_config:{
                    vendor_stage_tabs_by_order:[]
                },
                vendor_list_view_columns:[]
            },
            dynamicTabsSlushBucketData:{
                source:[],
                destination:[]
            },
            vendorListViewTableParams: {
                isStaticTable: true,
                showPaginationOptions: false,
                showTableToolbar: true,
                showSelectOptions: false,
                showSortOptions: false,
                fixedHeader: false,
                globalSearch:false,
                customfilter:false,
                theme: "mytheme",
                rows: [],
                columns: [
                    {
                        label: "Stage",
                        field: "stage",
                        width: "300px",
                        filterOptions: {
                            enable: false
                        },
                    },
                    {
                        label: "Category",
                        field: "category",
                        filterOptions: {
                            enable: false
                        },
                    },
                    {
                        label: "Actions",
                        field: "actions",
                        sortable: false,
                        tdClass: "action-col",
                        thClass: "action-col",
                        width: "7%",
                    }
                ],
                actionItems: [
                    {
                        icon: "mdi mdi-pencil",
                        name: "Edit",
                        event_name: "edit_list_view_column",
                        inline: true,
                    }
                ],
            },
            slushBucketDestination : {},
            allListStages: Constants.DOCEX.VENDOR_CONFIGURATION.VENDOR_ALL_LIST_STAGES,
            loading: false,
            displayAddListViewPopupModal:false,
            addListViewPopupModalData:'',
            showVersionList:true
        };
    },
    methods: {
        async init() {
            this.loading = true;
            try {
                if (this.configId) {
                    const documentConfig = await CustomerConfig.getCustomerConfigurationById(this.configId);
                    this.form = _.merge({}, this.form, documentConfig);
                    this.vendorListViewTableParams.rows = _.get(documentConfig , 'vendor_list_view_columns');
                }
                const vendorStageConfig = this.form.vendor_config.vendor_stage_tabs_by_order;
                this.dynamicTabsSlushBucketData = DocumentSetupService.prepareDynamicTabsSlushBucketData(this.allListStages, vendorStageConfig)
                this.slushBucketDestination = this.dynamicTabsSlushBucketData.destination;
             } catch (err) {
                this.notifyError("Error occured while getting data.");
                console.log(err.message);
            } finally {
                this.loading = false;
            }
        },
        async handleRefreshForm() {
            this.showVersionList = false;
            await this.init(this.configId);
            this.showVersionList = true;
        },
        registerEvents(){
            EventBus.$on("edit_list_view_column", async(data)=>{
                this.displayAddListViewPopupModal = true;
                this.addListViewPopupModalData = data.row;
            });
            EventBus.$on("add-list-view-column-from", async(data)=>{
                this.displayAddListViewPopupModal = true;
                this.addListViewPopupModalData = '';
            })  
            EventBus.$on("refresh-version-list", () => this.handleRefreshForm());
        },
        onDynamicTabsListChange({ source, destination }) {
            this.$set(this.dynamicTabsSlushBucketData, "source", source);
            this.$set(this.dynamicTabsSlushBucketData, "destination", destination);
            this.slushBucketDestination = this.dynamicTabsSlushBucketData.destination;    
        },       
        closeListColumnDialog(){
            this.addListViewPopupModalData = '';
        },
        setAndUpdateForm(data){
            if(data.isEditMode){
                this.form.vendor_list_view_columns[data.data.originalIndex].fields = data.data.fields
            }else{
                const { fields, stage, category } = data.data;
                this.form.vendor_list_view_columns.push({ fields, stage, category });
            }
            this.onSave()
        },
        async onSave() { 
            this.form.vendor_config.vendor_stage_tabs_by_order = DocumentSetupService.getDestinationTabs(this.allListStages, this.slushBucketDestination);
            this.showVersionList = false;
          
            //Check if dynamic tabs list is empty or not
            if(DocumentSetupService.isEmptyDynamicTabsList(this.form.vendor_config.vendor_stage_tabs_by_order)){
                this.notifyError("Dynamic tabs list should have at least one tab value");
                return;
            }
            
            //If form is valid save form data and show loader 
            this.loading = true;
            
            CustomerConfig.save(this.form)
                .then((response) => {
                    this.loading = false;
                    this.notifySuccess("Record saved successfully.");
                    this.form = response.data;
                    this.vendorListViewTableParams.rows = _.get(this.form, 'vendor_list_view_columns'); 
                })
                .catch((error) => {
                    this.loading = false;
                    this.notifyError("There is an error in saving data.");
                }).finally(()=>{
                    this.showVersionList = true;
                })
        }
    },
    beforeDestroy() {
        const busEvents= [
            "edit_list_view_column",
            "add-list-view-column-from",
            "refresh-version-list"
        ]
        EventBus.$off(busEvents)
    },
    beforeMount() {
        this.$store.commit("setDisplayIdpTree",false);
        this.$store.commit("setDisplayIdpNavbar",true);
        this.init();
        this.registerEvents();
    },
};
</script>
    
