<template>
    <span>
        <el-dropdown-item :disabled="disableButton" :cid="'table-action-dropdown-refresh-' + propData.index"
            v-if="type == 'dropdown'" :command="retryWorkflow">
            <span class="action-btn dropdown-btn" :class="icon"></span>{{ label }}
        </el-dropdown-item>
        <el-button v-else :cid="'table-action-edit-' + propData.index" :disabled="disableButton" v-on:click="retryWorkflow">
            <span class="action-btn" :class="icon"></span>
        </el-button>
    </span>
</template>


<script>
import WorkflowService from "@/idp/services/WorkflowService";
import Constants from "@/resources/Constants";
import EventBus from "@/EventBus";

export default {
    name: "RetryWorkflowButton",
    props: ["propData", "type"],
    data() {
        return {
            label: "Retry",
            icon: "mdi mdi-refresh"
        };
    },
    computed: {
        disableButton(){
              // if publish workflow run and its status is failed then in this scenario retry button will be disable
              if (this.propData.row.workflow_name[0].document.publish_workflow_instance_id) {
                return true;
            }
            if(this.propData.column.retryOptions && this.propData.column.retryOptions.disableStates){
                return this.propData.column.retryOptions.disableStates.includes(this.propData.row.status);
            }
            return false;
        }
    },
    methods: {
        async retryWorkflow() {
            try{
                const record = this.propData.row;
                if(!record){
                    return;
                }
                const payload = {
                    workflow_action: Constants.WORKFLOW.ACTIONS.RETRY,
                    workflow_id: record.workflow_id,
                    document_id: record.document_id,
                    workflow_instance_id: record._id
                }
                this.notifySuccess("Your request to retry the workflow instance is being processed. You will be notified upon completion");
                const workflowResponse = await WorkflowService.action(payload)
                if(workflowResponse && workflowResponse.data && workflowResponse.data.status){
                    this.notifySuccess(_.get(workflowResponse, "data.data.message", "Workflow execution completed successfully."));
                }else{
                    this.notifyError("Error while retrying the execution of workflow instance.");
                }
            } catch(error){
                this.notifyError("Error while retrying the execution of workflow instance.");
            } finally {
                EventBus.$emit("refreshTable");
            }
        }
    },

    beforeMount(){
        this.label = this.propData.column.retryOptions.label || this.label;
        this.icon = this.propData.column.retryOptions.icon || this.icon;
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