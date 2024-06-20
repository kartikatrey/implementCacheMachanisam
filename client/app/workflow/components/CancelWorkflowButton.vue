<template>
    <span>
        <el-dropdown-item :disabled="disableButton" :cid="'table-action-dropdown-cancel-' + propData.index"
            v-if="type == 'dropdown'" :command="cancelWorkflow">
            <span class="action-btn dropdown-btn" :class="icon"></span>{{ label }}
        </el-dropdown-item>
        <el-button v-else :cid="'table-action-edit-' + propData.index" :disabled="disableButton" v-on:click="cancelWorkflow">
            <span class="action-btn" :class="icon"></span>
        </el-button>
    </span>
</template>

<script>
import WorkflowService from "@/idp/services/WorkflowService";
import Constants from "@/resources/Constants";
import EventBus from "@/EventBus";
export default {
    name: "CancelWorkflowButton",
    props: ["propData", "type"],
    data() {
        return {
            label: "Cancel",
            icon: "mdi mdi-cancel"
        };
    },
    computed: {
        disableButton(){
            if(this.propData.column.cancelOptions && this.propData.column.cancelOptions.disableStates){
                return this.propData.column.cancelOptions.disableStates.includes(this.propData.row.status) || false;
            }
            return false;
        }
    },
    methods: {
        async cancelWorkflow() {
            try{
                const record = this.propData.row;
                if(!record){
                    return;
                }
                const payload = {
                    workflow_action: Constants.WORKFLOW.ACTIONS.CANCEL,
                    workflow_id: record.workflow_id,
                    document_id: record.document_id,
                    workflow_instance_id: record._id,
                    action: Constants.WORKFLOW.ACTIONS.CANCEL
                }
                this.notifySuccess("Your request to cancel the workflow instance is being processed. You will be notified upon completion");
                const workflowResponse = await WorkflowService.action(payload)
                if(workflowResponse && workflowResponse.data && workflowResponse.data.status){
                    this.notifySuccess(_.get(workflowResponse, "data.data.message", "Workflow execution cancelled successfully."));
                }else{
                    this.notifyError("Error while cancelling the execution of workflow instance.");
                }
            } catch(error){
                this.notifyError("Error while cancelling the execution of workflow instance.");
            } finally {
                EventBus.$emit("refreshTable");
            }
        }
    },

    beforeMount(){
        this.label = this.propData.column.cancelOptions.label || this.label;
        this.icon = this.propData.column.cancelOptions.icon || this.icon;
    }
};
</script>

<style lang="scss">
.button-style {
    font-size: 26px !important;
    padding: 0 !important;
}

.edit-delete-button-container {
    .el-button {
        padding: 12px;
        border: 0;
    }
}
</style>