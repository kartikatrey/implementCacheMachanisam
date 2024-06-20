<template>
    <div class="action-buttons-line-dynamic">

        <Actions
        v-bind="$props"
        @buttonClick="handleClick"
        :rowData="rowData"
        :actions="inlineActionButtons"
        :isReviewerOnly="isReviewerOnly"
        />

        <EllipsisActions
        v-bind="$props"
        @buttonClick="handleClick"
        :rowData="rowData"
        :actions="outlineActionButtons"
        :isReviewerOnly="isReviewerOnly"
        />

    </div>
</template>

<script>
import formMixin from "@/mixins/formMixin.js";
import EllipsisActions from "../table/components/EllipsisActions.vue";
import Actions from "../table/components/Actions.vue";
import EventBus from "@/EventBus";
import _ from "lodash";
import WorkflowService from "@/idp/services/WorkflowService";


export default {
    name: "ListActions",
    mixins: [formMixin],
    props: [
        "outlineActionButtons",
        "inlineActionButtons",
        "rowData",
        "isReviewerOnly"
        ],
    data() {
        return {
            buttons: [],
            actionData: {}
        }
    },

    components :{
        EllipsisActions,
        Actions
    },

    methods: {

        /**
         * Purpose : To handle click event on button click
         * @param {object} actionData contains all data of action
         *
         * * Step 1: Emit an event to execute an action for platform buttons
         * * Step 2 : If action button has workflow associated with it, then we will execte the workflow first
         * * Step 3 : Set action data
         * * Step 4 : Call handleScript of formMixin and pass vueInstance and event details
         */
        async handleClick(actionData) {

            // Step 1: Emit an event to execute an action for platform buttons
            if (actionData.is_platform) {
                EventBus.$emit(`INLINE_ACTION__${actionData.name}`, this.rowData.row);
                return;
            }
            // Step 2 : if action button has workflow associated with it, then we will execte the workflow first
            if(actionData.workflow_id){
                try {
                    const workflowExecutionResponse = await WorkflowService.runWorkflow({document_id: this.rowData.row._id, workflow_id: actionData.workflow_id})
                    workflowExecutionResponse.data.status
                    ? this.notifySuccess("Workflow executed", "Success")
                    : this.notifyError("Error in execution", "Error");
                } catch (error) {
                    console.log(error);
                }
                return
            }

            // Step 3 : Set action data
            this.actionData = actionData;
            const uniqueId = actionData._id
            const eventType = 'click'
            this.$store.commit("actionButtonStore/setDocumentData", this.rowData.row);

            // Step 4 : Call handleScript of formMixin and pass vueInstance and event details
            this.handleScript(this, uniqueId, eventType);

        }
    },
    }
</script>

<style lang="scss">
</style>