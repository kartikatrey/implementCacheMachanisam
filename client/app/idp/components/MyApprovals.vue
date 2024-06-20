<template>
    <div class="my-approval-container" v-if="showApprovals">
        <el-button round text class="my-approval-list-cross" size="small" @click="closeMyApprovalModal"> <i class="mdi mdi-close"></i> </el-button>
        <div class="my-approval-header">
            <!-- My approval title -->
            <p class="approval-list-title my-approval-title">My Approvals</p>
            
            <div class="my-approval-header-actions">
                <!-- Document type selection -->
                <el-select v-model="documentType" placeholder="Select an option" @change="handleDocumentTypeChange"
                class="approval-select" :disabled="myApprovalLoading">
                    <el-option v-for="option in documentTypes" :key="option.value" :label="option.label" :value="option.value"
                    :selected="option.selected"></el-option>
                </el-select>

                <!-- Action buttons -->
                <el-dropdown v-if="hasColumnPermission('Actions')" @command="handleCommand">
                    <el-button cid="idp-doc-list-actions" class="el-dropdown-link vertical-icon idp-dropdown" size="mini" :disabled="myApprovalLoading"><i class="el-icon-more"> </i></el-button>
                    <el-dropdown-menu cid="idp-doc-list-action-dropdown" class="actions-list kp-action-wrapper-drowdown" slot="dropdown">

                        <!-- Refresh button -->
                        <el-dropdown-item 
                            cid="my-approval-refresh" 
                            command="Refresh">

                            <span class="mdi mdi-refresh"></span>
                            Refresh

                        </el-dropdown-item>

                        <!-- Bulk Approve button -->
                        <el-dropdown-item 
                            cid="my-approval-bulk-approve" 
                            command="Approve"
                            >

                            <span class="mdi mdi-playlist-check"></span>
                            Approve

                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <!-- My approvals table -->
        <data-table :key="rerender" :parameters="tableParams" ref="myApprovalTable" v-loading="myApprovalLoading"></data-table>
    </div>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import approvalService from "@/idp/services/ApprovalService";
import DeCustConfigService from "@/idp/services/DeCustomerConfig";
import EventBus from "@/EventBus";
import Constants from "@/resources/Constants";
import _ from "lodash";

export default {
    name: 'MyApprovals',
    props : [ "closeMyApprovalModal" ],
    components: {
        DataTable
    },
    data() {
        return {
            documentType : "",
            documentTypes: [],
            rerender : 0,
            showApprovals : false,
            myApprovalLoading : false,
            tableParams: {
                /**
                * Purpose: here we pass isMyapproval param, for getting myApprovals Record
                */
                apiName: '/portal/api/de-approval?getMyApprovals=' + true,
                tableName: "",
                queryParam : {},
                isRestify: false,
                customfilter: false,
                showSelectOptions : true,
                tableMode: "static",
                showSortOptions: false,
                fixedHeader: false,
                globalSearch: false,
                enableGroupFilter: false
            },
        };
    },
    methods: {
        handleCommand(command){
            const commandMap = {
                "Refresh": this.refreshTable,
                "Approve": this.bulkApprove
            }
            commandMap[command]();
        },
        refreshTable(){
            this.rerender += 1;
        },
        /**
         * @Purpose : To Bulk approve docs
         * @Usage : 
         *  Step 1. Check wheather multiple docs are selected or not
         *  Step 2. Take confirmation from the user
         *  Step 3. Validate docs on basis of "stage" and "approval_status"
         *  Step 4. Call approval endpoint
         */
        async bulkApprove(){
            try {
                // Step 1. If no docs then do not proceed
                const selectedRows = this.$refs.myApprovalTable.$data.selectedRows;
                if (selectedRows && selectedRows.length === 0) {
                    this.notifyWarnMessage("Please select documents");
                    this.myApprovalLoading = false;
                    return;
                }

                // Step 2. Take confirmation from the user
                const userConfirmation = await this.$confirm(
                    `Are you sure want to approve ${selectedRows.length} documents?`,
                    {
                        confirmButtonText: "Confirm",
                        cancelButtonText: "Cancel",
                        type: "warning",
                    }
                    ).catch((err) => {});
                if (!userConfirmation) {
                    return;
                }

                // Step 3. Validate selected documents
                this.myApprovalLoading = true;
                const validDocs = this.validateSelectedDocs(selectedRows);
                
                // if the selected and validated document counts don't match, don't proceed and notify user.
                if (_.size(selectedRows) !== _.size(validDocs)) {
                    this.myApprovalLoading = false;
                    return;
                }
                const params = {
                    documents : validDocs,
                    action : "bulkApprove",
                    status : Constants.DOCEX.APPROVAL_STATUS.APPROVED
                }

                // Step 4. Call approval endpoint
                const bulkResponse = await approvalService.processApproval(params);

                // Step 5. Show success / Error message on UI
                this.notifySuccess("Bulk approval for selected documents completed successfully");

                // Step 6. Disable loader to process further actions
                this.myApprovalLoading = false;
                this.refreshTable();

                this.$nextTick(() => {
                    const bulkRejectedDocs = _.get(bulkResponse, "data.data.bulk_rejected_docs");
                    if (_.size(bulkRejectedDocs)) {
                        const errorMessage = bulkResponse.bulk_rejected_docs.map((doc, index) => `${index + 1}. Document '${doc}'`).join('\n');
                        this.notifyError(`Bulk approval documents failed: ${errorMessage}\n`);
                    }
                })
            } catch (error){
                this.refreshTable();
                this.myApprovalLoading = false;
                console.log("Error in bulkApproveDocs::",error);
                const errorMsg = _.get(error, "response.data.error.message") || error;
                this.notifyError(errorMsg || "Error while bulk approving documents");
            }
        },
        /**
         * @purpose : Validate selected docs
         * @Usage : 
         *  If doc stage is "waiting for approval" and "approval_status" is Requested
         *  Then add that document in valid docs array
         * @return : Valid docs
         */
        validateSelectedDocs(selectedRows) {
            const invalidDocs = selectedRows.filter(doc => doc.stage !== Constants.DOCEX.STAGE.WAITING_FOR_APPROVAL);

            if (invalidDocs.length > 0) {
                const invalidDocNames = invalidDocs.map(doc => doc.file_name).join(', ');
                const message = `Validation failed for ${invalidDocs.length} documents: ${invalidDocNames}. Selected documents must be in the 'Waiting for Approval' stage. Please review and try again.`;
                this.notifyWarnMessage(message);
            }

            const validDocs = selectedRows.filter(doc => doc.stage === Constants.DOCEX.STAGE.WAITING_FOR_APPROVAL);

            return validDocs.map(doc => ({
                document_id: doc.document_id,
                approval_id: doc.approval_id
            }));
        },
        notifyWarnMessage(message){
            this.$notify({
                title: "Warning",
                message: message,
                type: "warning",
            });
        },
        registerEvents(){
            EventBus.$on("openDocInViewer", (document) => {
                this.openDocInViewer(document);
            });
        },
        openDocInViewer(document) {
			const formId = document.form_id;
			const documentId = document.document_id;
            const viewType = document.view_type || "document";
			
			const ViewlinkMap = {
              [Constants.DOCEX.VIEW_TYPE.FORM] : `/idp/form-view?id=${documentId}&formId=${formId}`,
			  [Constants.DOCEX.VIEW_TYPE.DOCUMENT] : `/idp/document-view?id=${documentId}`
			};
			
			const path = ViewlinkMap[viewType];
            this.closeMyApprovalModal();
            this.$router.push(path);
		},
        setTableParams() {
            const approvaltableNameMap = {
                [ Constants.DOCEX.DOCUMENT_TYPES.INVOICE ] : "myApprovalInvoiceTab",
                [ Constants.DOCEX.DOCUMENT_TYPES.VENDOR_ONBOARDING ] : "myApprovalVendorOnboardingTab" 
            }
            this.tableParams.queryParam.document_type = this.documentType;
            this.tableParams.tableName = approvaltableNameMap[this.documentType];
        },
        handleDocumentTypeChange(){
            this.setTableParams();
            this.rerender += 1;
        },
        /*
        Purpose: Get all document types where approval is enabled
                * Get all doc types from window object 
                * Make label and value for each doc type
                * If no document types close this dialog
        */
        async getApprovalEnabledDocumentTypes() {
            const docTypeConfig = await DeCustConfigService.getAllDocsCustConfiguration();

            const docTypes = docTypeConfig
                .filter(doc => doc.config.enable_approval === true)
                .map(doc => {
                    const modifiedLabel = _.capitalize(doc.document_type.replace(/_/g, ' '));

                    return {
                        label: modifiedLabel,
                        value: doc.document_type
                    };
                });
            if(!docTypes.length){
                this.closeMyApprovalModal();
                this.notifyError("Approval is not enabled.");
                return null;
            }
            this.documentType = docTypes[0].value;
            return docTypes;
        }
    },
    async beforeMount() {
        this.documentTypes = await this.getApprovalEnabledDocumentTypes();
        if(this.documentTypes){
            this.setTableParams();
            this.registerEvents();
            this.showApprovals = true;
        }
    },
    beforeDestroy() {
        this.showApprovals = false;
        EventBus.$off("openDocInViewer");
    }
};
</script>


<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";

.my-approval-container{

    .approval-list-title.my-approval-title {
        margin: 0;
        font-style: normal;
        font-weight: 600;
        font-size: 1.286rem;
        line-height: 27px;
        letter-spacing: 0.01em;
        color: var(--dark-02);
        position: relative;
    }
    
    .my-approval-list-cross {
        position: absolute;
        border: 0;
        color: var(--dark-03);
        font-size: 1.2rem;
        vertical-align: text-top;
        padding: 0 !important;
        right: -8px;
        top: -8px;
        z-index: 9999;
        transition: .15s all ease-in-out;
        transform-origin: center center;
        background: var(--dark-08);
        width: 25px;
        height: 25px;
    
        &:hover {
            transform: scale(1.2);
        }
    
        span {
            display: block;
        }
    }
    
    .my-approval-header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .approval-select{
            width: 80%;
        }

        .my-approval-header-actions{
            display: flex;
            align-items: center;
            justify-content: space-around;

            .el-dropdown-link.vertical-icon.idp-dropdown{
                height: 27px;
                width: 29px;
            }
        }
    }
    
}

</style>