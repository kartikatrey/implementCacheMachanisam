<template>
    <el-main class="kp-main">
        <span v-for="button in actionButtons" :key="button.name">
            <el-button type="primary" size="small" @click="handleClick('click', button)">
                {{ button.name }}
            </el-button>
        </span>
    </el-main>
</template>

<script>
import ActionButtonConfig from "../../idp/services/ActionButtonConfig";
import formMixin from "@/mixins/formMixin.js";

export default {
    name: "DynamicActionButton",
    mixins: [formMixin],
    props: ["dynamicButtonProps"],
    data() {
        return {
            actionButtons: [],
            actionData: {}
        }
    },

    methods: {

        /**
         * Pupose : To get action buttons as per their documentTypes and view_names
         *
         * * Step 1 : Prepare payload from props data
         * * Step 2 : Fetch all actions buttons as per their documentType and view_name
         * * Step 3 : Iterate over the reponse and push buttons into actionButtons array
         */
        async setActionButtons() {

            // Step 1 : Prepare payload from props data
            const payload = {
                active: true,
                view_name: this.dynamicButtonProps.view_type,
                document_type: this.dynamicButtonProps.document_type,
                document_id: this.dynamicButtonProps.documentId,
            }
            const projection = [
                "_id",
                "view_name",
                "document_type",
                "advanced_script",
                "roles",
                "name",
                "is_platform",
            ]

            // Step 2 : Fetch all actions buttons as per their documentType and view_name
            const actionButtonresponse = await ActionButtonConfig.getActions(payload, projection);

            //  Step 3 : Iterate over the reponse and push buttons into actionButtons array
            if (actionButtonresponse.status) {
                for (const action of actionButtonresponse.action_list) {
                    this.actionButtons.push(action)
                }
            }
        },

        /**
         * Purpose : To handle click event on button click
         * @param {object} event contains all the information about click event
         * @param {object} actionData contains all data of action
         *
         * * Step 1 : To set action data into this
         * * Step 2 : call handleScript of formMixin and pass vueInstance and event details
         */
        handleClick(eventType, actionData) {

            // Step 1 : To set action data into this
            this.actionData = actionData;
            const uniqueId = actionData._id;

            // Step 2 : call handleScript of formMixin and pass vueInstance and event details
            this.handleScript(this, uniqueId, eventType);
        }
    },

    async mounted() {
        await this.setActionButtons()
    },
}
</script>

<style lang="scss">
.el-button--small {
    height: 2rem;
    padding: 3px 1rem;
    align-content: space-between;
    margin-left: 15px;
}
</style>