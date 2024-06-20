<template>
    <el-main class="workflow-history-main">
        <section class="workflow-history-page-body">
            <div class="page-title">
                <div>
                <el-button 
                    icon="mdi mdi-arrow-left-circle-outline" 
                    cid="form-header-back"
                    v-on:click="onBack"
                    class="workflow-history-back-button"
                    ></el-button>
                <span class="workflow-history-title">Workflow Execution History</span>
                </div>
                <div class="workflow-action-btns">
                    <el-button 
                        type="primary" 
                        :disabled="isResumeDisabled"
                        v-on:click="onResume"
                        cid="workflow-resume-button" 
                        size="small"
                        class="workflow-resume-button"
                        icon="mdi mdi-play"
                    > 
                        Resume 
                    </el-button>
                    <el-button 
                        type="default" 
                        v-on:click="onRetry"
                        :disabled="isRetryDisabled"
                        cid="workflow-retry-button" 
                        size="small"
                        class="workflow-retry-button"
                        icon="mdi mdi-replay"
                    > 
                        Retry 
                    </el-button>
                    <el-button 
                        type="default" 
                        v-on:click="onCancel"
                        :disabled="isCancelDisabled"
                        cid="workflow-cancel-button" 
                        size="small"
                        class="workflow-cancel-button"
                        icon="mdi mdi-cancel"
                    > 
                        Cancel 
                    </el-button>
                </div>
            </div>

            <section class="workflow-editor-container">
                <div>
                    <Canvas 
                        v-loading="loading"
                        :showSlide.sync="showSlide" 
                        :dialogFlowData="dialogFlowData"
                        :workflowType="workflowType" 
                        :showComponentPanel="showComponentPanel"
                        class="rete-container">
                    </Canvas>
                </div>
            </section>
        </section>
    </el-main>

</template>

<script>

import { mapState } from 'vuex';
import Canvas from "@/dialogflow/components/Canvas";
import Constants from "@/resources/Constants";
import WorkflowServices from "@/idp/services/WorkflowService";
import _ from 'lodash';

export default {
    name: 'IdpWorkflowHistory',
    components: { Canvas },
    props: { },
    computed: {
        ...mapState("workflowStore", {
            showWfExecution:  state => state.wfHistory.showWfExecution,
            dialogFlowData: state => state.wfHistory.dialogFlowData
        }),
    },

    data() {
        return {
            workflowType: "docex",
            showSlide: false,
            showComponentPanel: false,
            workflowRecords: null,
            workflowInstanceId: null,
            workflowStatus: null,
            isRetryDisabled: true,
            isResumeDisabled: true,
            isCancelDisabled: true,
            loading: false
        };
    },
    methods: {
        disableRetryButton() {
            // If workflowStatus is Failed or Cancelled, the retry button should be enabled
            return !_.includes([
                Constants.WORKFLOW.STATUS.FAILED, 
                Constants.WORKFLOW.STATUS.CANCELLED
            ], this.workflowStatus);
        },

        disableResumeButton() {
            // If workflowStatus is Suspended, the resume button should be enabled
            return this.workflowStatus !== Constants.WORKFLOW.STATUS.SUSPENDED;
        },

        disableCancelButton() {
            // If the workflowStatus is Suspended or Resumed, the cancel button should be enabled
            return !_.includes([
                Constants.WORKFLOW.STATUS.SUSPENDED, 
                Constants.WORKFLOW.STATUS.RESUMED
            ], this.workflowStatus);
        },

        toggleButtons() {
            this.isRetryDisabled = this.disableRetryButton();
            this.isResumeDisabled = this.disableResumeButton();
            this.isCancelDisabled = this.disableCancelButton();
        },

        async handleWorkflowAction(action) {
            let errorMessage = "";
            try {
                this.loading = true;
                const workflowRecord = this.getWorkflowRecord();
                if(!workflowRecord) return;
                let payload = {
                    workflow_action: action,
                    workflow_id: workflowRecord.workflow_id,
                    document_id: workflowRecord.workflow_context && workflowRecord.workflow_context.document_id,
                };

                switch (action) {
                    case Constants.WORKFLOW.ACTIONS.RESUME:
                        const processedNodeLength = workflowRecord && workflowRecord.processed_nodes && workflowRecord.processed_nodes.length;
                        if(!processedNodeLength) break;
                        const nodeId = workflowRecord.processed_nodes[processedNodeLength - 1] || null;
                        payload.setp_id = 0;
                        payload.node_id = nodeId
                        errorMessage = "Error while resuming the workflow execution";
                        this.notifySuccess("Your request to resume the workflow instance is being processed. You will be notified upon completion");
                        break;
                    case Constants.WORKFLOW.ACTIONS.RETRY:
                        payload.workflow_instance_id = this.workflowInstanceId;
                        errorMessage = "Error while retrying the workflow execution";
                        this.notifySuccess("Your request to retry the workflow instance is being processed. You will be notified upon completion");
                        break;
                    case Constants.WORKFLOW.ACTIONS.CANCEL:
                        payload.workflow_instance_id = this.workflowInstanceId;
                        payload.action = Constants.WORKFLOW.ACTIONS.CANCEL;
                        errorMessage = "Error while cancelling the workflow execution";
                        this.notifySuccess("Your request to cancel the workflow instance is being processed. You will be notified upon completion");
                        break;
                    default:
                        throw new Error("Invalid action");
                }

                await this.callWorkflowAction(payload);
            } catch (error) {
                console.error(error);
                this.notifyError(errorMessage);
            } finally {
                this.loading = false;
            }
        },

        async onResume() {
            await this.handleWorkflowAction(Constants.WORKFLOW.ACTIONS.RESUME);
        },

        async onRetry() {
            await this.handleWorkflowAction(Constants.WORKFLOW.ACTIONS.RETRY);
        },

        async onCancel() {
            await this.handleWorkflowAction(Constants.WORKFLOW.ACTIONS.CANCEL);
        },

        getWorkflowRecord() {
            if (this.workflowRecords && this.workflowRecords.length > 0) {
                return this.workflowRecords[0];
            }
            throw new Error("No active workflow instance found");
        },

        async callWorkflowAction(payload) {
            const response = await WorkflowServices.action(payload);
            if (response && response.data && response.data.status) {
                const successMessage = response && response.data && response.data.data && response.data.data.message
                this.notifySuccess(successMessage);
                return
            }
            throw new Error("Workflow action failed");
        },

        getPath(documentType) {
            const routeMap = {
                "insurance": "/idp/insurance-document-list"
            }
            return routeMap[documentType] || "";
        },

        // Prepare the redirection url after clicking on back button
        prepareRedirectionUrl(filter){
            const documentType = filter && filter.document_type && filter.document_type.replace(/ /g, "_");
            const customerConfiguration = this.$store.getters["documentViewStore/customerConfiguration"];
            const view = customerConfiguration && customerConfiguration.view || "document"
            const path = this.getPath(documentType) || `/idp/${view}/${documentType}`;
            return {
                path,
                query: {
                    filter: JSON.stringify(filter || {})
                }
            }
        },
        onBack() {
            const wfExecutionData = {
                "showWfExecution": false,
                "wfExecutionData": {}
            };
            this.$store.commit("workflowStore/setWfHistory", wfExecutionData);

            // Get the selected document config which has been set into the store at the time of event trigger
            const selectedDocumentConfig = this.$store.getters["getDocumentConfig"] || {};
            // If the selected document configuration is present then prepare the redirection url using the selected document and its stage configuration
            // Else redirect to the workflow instance list view
            const url = !_.isEmpty(selectedDocumentConfig) ? this.prepareRedirectionUrl(selectedDocumentConfig) : { path: "/idp/workflow-instance-list" };

            this.$store.commit("setDocumentConfig", {});
            this.$router.push(url);
        },

    },
    async beforeMount() {
        this.$store.commit("setDisplayIdpTree",false);
        this.$store.commit("setDisplayIdpNavbar",false);
        this.workflowRecords = await WorkflowServices.getWorkflowInstanceData({ _id: this.$route.query.id, active: true }, ["node_contexts", "workflow_id", "workflow_context"]);
        this.workflowStatus = this.workflowRecords && this.workflowRecords[0] && this.workflowRecords[0].status;
        this.toggleButtons();
        if(this.$route.query.id){
            this.workflowInstanceId = this.$route.query.id;
            await this.$store.dispatch("workflowStore/commitWfHistory", this.workflowInstanceId);
        }
    }
};
</script>

<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";

.workflow-history-main {
    height: calc(100% - 2.7rem);
    width: 100%;
    padding-left: 1.5rem;
    margin-top: 2.7rem;
    overflow: hidden;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding-top: 1.5rem;
}

.workflow-history-page-body {
    width: 100%;
    overflow: visible;

    .page-title{
        display: flex;
        justify-content: space-between;

        .workflow-action-btns{
            margin-right: 2rem;
        }
    }
}

.workflow-history-back-button {
    background: transparent;
    font-size: 1.714rem;
    border: 0;
    padding: 0;
    margin-right: .35rem;
    color: rgb(45, 55, 72);
    vertical-align: text-top;

}
.workflow-history-title {
    margin: 0 0 -2rem 0;
    font-style: normal;
    font-weight: 600;
    font-size: 1.286rem;
    line-height: 27px;
    letter-spacing: 0.01em;
    color: var(--dark-02);
    position: relative;
}

.workflow-history-close {
    position: absolute;
    border: 0;
    color: var(--dark-03);
    font-size: 1.2rem;
    vertical-align: text-top;
    // padding: 0 .7rem 0 .4rem;
    padding: 0 !important;
    right: -10px;
    top: -10px;
    z-index: 9999;
    transition: .15s all ease-in-out;
    transform-origin: center center;
    background: var(--dark-08);
    width: 25px;
    height: 25px;

    &:hover {
        background: transparent !important;
        transform: scale(1.2);
    }
}

.idp-icon-container span.view-list {
    font-size: 1.5rem;
    transition: .25s all ease-in-out;
    cursor: pointer;

    &:hover {
        font-size: 1.69rem;
        color: var(--green-05);
    }
}

.workflow-editor-container {
    height: 100%;

    .context-menu {
        overflow: hidden;
        border-radius: 5px;
        padding: 0 !important;
        width: 145px !important;
        box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.2);

        .search {
            display: none;
        }

        .item[data-v-99007bda],
        .item .subitems .subitem[data-v-99007bda] {
            color: #fff;
            border-bottom: none;
            background-color: rgba(3, 168, 224, 0.9);

            cursor: pointer;
            width: 100%;
            position: relative;
            padding: 4px 10px;
        }
    }

    .control-btn-wrap {
        display: inline-block;
        right: 0;
        margin: 10px;
        float: right;
        position: relative;
        z-index: 9999;

        .btn-plus,
        .btn-minus {
            i {
                font-size: 1.1rem;
            }
        }
    }

    .splitpanes--vertical {
        .node-editor {
            // background: #aaa url(../../assets/images/workflow-bg.png) !important;
            height: 900px;
            overflow-y: hidden !important;
        }

        .splitpanes__pane {
            background: #fff !important;
            overflow-y: auto;
        }

        .splitpanes__splitter {
            background: rgba(0, 0, 0, 0.1);
            // background: rgba(255, 255, 255, 0.5);
            border: 0;

            &:before,
            &:after {
                background: #8a8a8a !important;

                height: 70px !important;
                border-radius: 10px;
                width: 2px;
            }
        }
    }

    .default-theme.splitpanes--vertical>.splitpanes__splitter:after,
    .default-theme .splitpanes--vertical>.splitpanes__splitter:after,
    .default-theme.splitpanes--vertical>.splitpanes__splitter:before,
    .default-theme .splitpanes--vertical>.splitpanes__splitter:before {
        background: #fff;
    }

    .el-input,
    .el-radio__label,
    .el-form-item__label,
    .el-select-dropdown__item,
    .el-button {}

    .el-form-item {
        margin-bottom: 0px;
    }

    .el-input__inner {
        height: 30px;
        line-height: 30px;
    }

    .blue-icon {
        color: #667EEA !important;
    }

    .red-icon {
        color: #FE2712 !important;
    }

    .orange-icon {
        color: #FB9902 !important;
    }

    .green-icon {
        color: #66B032 !important;
    }
}
</style>