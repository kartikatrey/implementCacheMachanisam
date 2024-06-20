<template>
    <span>
        <el-dropdown-item :disabled="disableButton" :cid="'table-action-dropdown-resume-' + propData.index"
            v-if="type == 'dropdown'" :command="resume">
            <span class="action-btn dropdown-btn" :class="icon"></span>{{ label }}
        </el-dropdown-item>
        <el-button v-else :cid="'table-action-edit-' + propData.index" :disabled="disableButton" v-on:click="resume">
            <span class="action-btn" :class="icon"></span>
        </el-button>
    </span>
</template>

<script>

import WorkflowService from "@/idp/services/WorkflowService";
import Constants from "@/resources/Constants";
import EventBus from "@/EventBus";

export default {
    name: "ResumeWorkflowButton",
    props: ["propData", "type"],
    data() {
        return {
            label: "Resume",
            icon: "mdi mdi-play-circle"
        };
    },
    computed: {
        disableButton(){
            if(this.propData.column.resumeOptions && this.propData.column.resumeOptions.disableStates){
                return this.propData.column.resumeOptions.disableStates.includes(this.propData.row.status) || false;;
            }
            return false;
        }
    },
    methods: {
        async resume() {
            try{
                const record = this.propData.row;
                if(!record || !record.node_contexts) return;
                const nodeKey = Object.keys(record.node_contexts)[0];
                
                const payload = {
                    document_id: record.document_id, 
                    workflow_id: record.workflow_id,
                    workflow_action: Constants.WORKFLOW.ACTIONS.RESUME,
                    step_id: 0,
                    node_id: record && record.node_contexts && record.node_contexts[nodeKey] && record.node_contexts[nodeKey].data 
                            ? record.node_contexts[nodeKey].data.node_id 
                            : null
                };
                this.notifySuccess("Your request to resume the workflow instance is being processed. You will be notified upon completion");
                const response = await WorkflowService.action(payload);
                if(response && response.data.status){
                    this.notifySuccess(_.get(response, "data.data.message", "Workflow execution resumed successfully."));
                }else{
                    this.notifyError("Error while resuming the execution of workflow instance.");
                }
            } catch (error){
                console.error("Error while resuming workflow:", error);
                this.notifyError("Error while resuming workflow!")
            } finally {
                EventBus.$emit("refreshTable");
            }
        }
    },

    beforeMount(){
        this.label = this.propData.column.resumeOptions.label || this.label;
        this.icon = this.propData.column.resumeOptions.icon || this.icon;
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