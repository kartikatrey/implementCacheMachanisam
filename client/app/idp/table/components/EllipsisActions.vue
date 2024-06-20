<template>
    <div class="action-buttons-line-dynamic">
        <el-dropdown
        v-if="actions.length>0"
        class="kp-action-wrapper"
        @command="handleCommand"
        trigger="click">
            <el-button type="text" cid="idp-table-action-dropdown" class="el-dropdown-link vertical-icon" size="small"><span class="mdi mdi-dots-horizontal action-btn">
                </span></el-button>
            <el-dropdown-menu class="kp-action-wrapper-drowdown" slot="dropdown">
                <span v-if="shouldRenderAction(action)" v-for="(action,index) in actions"  v-bind:key="action.name">
                    <!--
                        For outline buttons:
                            1. If Action enabled, check if needs to be enabled or disbaled with checkDisabled()
                            2. If enabled, call the command on click trigger of dropdown
                    -->
                    <el-dropdown-item
                        :command="action.eventName || action"
                        :cid="'idp-table-action_'+action.name+'_'+index"
                        :disabled="checkDisabled(action)">
                        <i :class="'mdi ' + action.icon"></i>
                        {{ action.label }}
                    </el-dropdown-item>
                </span>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
import EventBus from "@/EventBus";
import _ from "lodash";

export default {
    name: "Actions",
    props: [
        "actions",
        "isReviewerOnly",
        "rowData"
    ],
        data() {
        return {
            documentType: "",
            actions: []
        };
    },
    methods: {
        /**
         * This function determines the display conditions for an action button based on its visibility conditions.
         * Steps:
         * 1. Check if `visibleCheckKey` is an array.
         * 2. Process visibility conditions:
         *    - If `visibleCheckKey` is an array, process all conditions in an "AND" manner.
         * 3. Return the display conditions based on visibility.
         * @param {object} action - The action configuration.
         * @returns {string} - The class name indicating whether the action should be shown or hidden.
         */
        shouldRenderAction(action) {
            // Step 1: Check if visibleCheckKey is an array or not
            if (_.isArray(action.visibleCheckKey)) {
                // We initially set the button to be visible (isVisible && conditionResult here if false, then didn't work)
                let isVisible = true;

                // Step 2: Check if visibleCheckKey is present in visibleValues
                for (const key of action.visibleCheckKey) {
                    const conditionResult = this.isReviewerOnly || (
                        action.visibleValues[key] && action.visibleValues[key].includes(this.rowData.row[key])
                    );

                    // All provided conditions should be in "AND" condition,
                    // hence preserving result for each condition and applying "&&" to all results
                    isVisible = isVisible && conditionResult;
                }

                // Step 3: Return display conditions based on isVisible
                return isVisible ? true : false;
            }

            // For single keys, check if the visibleValues includes the row data's value
            return action.visibleValues &&
                action.visibleValues.includes(this.rowData.row[action.visibleCheckKey]) ? false : true;
        },
        processAction(action) {
            action.eventName && EventBus.$emit(action.eventName, this.rowData.row);
        },
        checkDisabled(action) {
            if (_.isArray(action.disableCheckKey)) {
                let result = false;
                for (const key of action.disableCheckKey) {
                    result = this.isReviewerOnly || (action.disableValues[key] &&
                        action.disableValues[key].includes(this.rowData.row[key])
                    )
                    if (result) {
                        break;
                    }
                }
                return result

            }
            return action.disableValues &&
                action.disableValues.includes(this.rowData.row[action.disableCheckKey]) ?
                true :
                false;
        },

        handleCommand(action) {
            if (!action.eventName) {
                this.$emit('buttonClick', action)
            }
            typeof action === "function" ?
                action() :
                EventBus.$emit(action, this.rowData.row);
        }
    },
    beforeMount() {
        if (this.rowData.row && this.rowData.row.document_type) {
            this.documentType = this.rowData.row.document_type
        }
    },

};

</script>


<style>
.is-disabled {
    opacity: 0.6;
}
</style>