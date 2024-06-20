<template>
    <div class="action-button-container">
        <el-tooltip class="item" v-for="(action, key) in actions || []" v-bind:key="key" effect="light" :content="action.label || action.name" placement="top">
            <!--
                For inline buttons:
                    1. If action.class present, get hide/show class using getClassNameForAction()
                    2. If action.class not present, checkDisabled()
                    3. If button is visible/enabled, call the on click event handler
            -->
            <el-button
                    v-bind:class="[action.class && getClassNameForAction(action)]"
                    :cid="'idp-table-action_'+action.name+'_'+key"
                    :disabled="!action.class && checkDisabled(action)"
                    v-on:click="processAction(action)" size="mini"
                    :icon="'mdi' + (!action.ellipsis && action.icon ? ` ${action.icon}` : action.class)">
                </el-button>
        </el-tooltip>
    </div>
    </template>

    <script>
    import EventBus from "@/EventBus";
    import _ from "lodash";
    export default {
        name: "Actions",
        props: [
            "actions",
            "rowData",
            "inlineActionButtons",
            "isReviewerOnly"],
        data() {
            return {
                documentType:""
            };
        },
        computed: {
            getActionClass(action) {
                return "" + (action.icon ? ` ${action.icon}` : action.class);
            }
        },
        methods: {
            processAction(action) {
                action.eventName && EventBus.$emit(action.eventName, this.rowData.row);
            },
            /*
                This function determines the class name for an action button based on its visibility conditions.
                Steps:
                1. Check if `visibleCheckKey` is an array.
                2. Process visibility conditions:
                    - If `visibleCheckKey` is an array, process all conditions in an "AND" manner.
                3. Return the class name based on visibility.
                @param {object} action - The action configuration.
                @returns {string} - The class name indicating whether the action should be shown or hidden.
            */
            getClassNameForAction(action) {
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

                    // Step 3: Return class name based on isVisible
                    return isVisible ? 'show-action' : 'hide-action';
                }

                // For single keys, check if the visibleValues includes the row data's value
                return action.visibleValues &&
                    action.visibleValues.includes(this.rowData.row[action.visibleCheckKey])
                    ? 'show-action'
                    : 'hide-action';
            },
            checkDisabled(action) {
                    // Enable the actions, based on file_type
                    const enableFileType = _.get(action, "options.enable.file_type", []);
                    const rowFileType = _.get(this.rowData, "row.file_type", '');
 
                    if (enableFileType.includes(rowFileType)) {
                        return false;
                    }
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
                typeof action === "function" ?
                    action() :
                    EventBus.$emit(action, this.rowData.row);
            }
        },
        beforeMount(){
            if(this.rowData.row && this.rowData.row.document_type){
                this.documentType = this.rowData.row.document_type
            }
        }

    };
    </script>

    <style lang="scss">
    .is-disabled {
        opacity: 0.6;
    }

    .hide-action{
            display: none;
    }
    .show-action{
        display: block;
    }
    </style>