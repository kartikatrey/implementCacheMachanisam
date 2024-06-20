<template>
<div v-bind:style="{ pointerEvents: isDocumentReadOnly? 'none':''}">
    <span v-if="inlineComponent">
        <component v-for="component in inlineComponent" v-bind:is="component" :options="propData.column.options" :propData="propData" :fieldName="propData.column.field" :parameters="parameters" v-bind:key="component"></component>
    </span>
    <span v-for="actionItem in inlineActionItems" v-bind:key="actionItem.name">
        <el-button :cid="'table-action-' +actionItem.name + '-' + propData.index" class="action-item-btn" @click="handleCommand(actionItem.event_name)" v-if="!hideActionItem(actionItem)"><i :class="actionItem.icon"></i>
            <!-- {{actionItem.name}} -->
        </el-button>
    </span>
    <el-dropdown v-if="outlineComponent.length>0 || outlineActionItems.length>0" :cid="'table-action-dropdown_' + propData.index" class="kp-action-wrapper" @command="handleCommand" trigger="click">
        <el-button :cid="'table-action-dropdown-' + propData.index" class="el-dropdown-link vertical-icon" size="small"><span class="mdi mdi-dots-horizontal action-btn">
            </span></el-button>
        <el-dropdown-menu class="kp-action-wrapper-drowdown" slot="dropdown">
            <span v-if="outlineComponent">
                <component type="dropdown" v-for="component in outlineComponent" v-bind:is="component" :options="propData.column.options" :propData="propData" :fieldName="propData.column.field" :parameters="parameters" v-bind:key="component"></component>
            </span>
            <span v-for="actionItem in outlineActionItems" v-bind:key="actionItem.name">
                <el-dropdown-item :cid="'table-action-' +actionItem.name + '-' + propData.index" :command="actionItem.event_name" v-if="!hideActionItem(actionItem)"><i :class="actionItem.icon"></i>
                    {{actionItem.name}}
                </el-dropdown-item>
            </span>
        </el-dropdown-menu>
    </el-dropdown>
</div>
</template>

<script>
import TableAPIService from "@/services/TableAPIService";
let tableApiService = new TableAPIService();
import EventBus from "@/EventBus";
import _ from "lodash"

import ApproveRejectButtons from "@/components/TableElements/ApproveRejectButtons";
import ActiveInactiveButtons from "@/components/TableElements/ActiveInactiveButtons";
import DeleteButton from "@/components/TableElements/DeleteButton";
import ResumeWorkflowButton from "@/workflow/components/ResumeWorkflowButton";
import CancelWorkflowButton from "@/workflow/components/CancelWorkflowButton";
import RetryWorkflowButton from "@/workflow/components/RetryWorkflowButton";
import WFInstanceHistory from "@/components/TableElements/WFInstanceHistory"
import EditButton from "@/components/TableElements/EditButton";
import ImportButton from "@/components/TableElements/ImportButton";
import VerifyPaymentButton from "@/payments/components/VerifyPaymentButton.vue";
import RefreshTraningStatusButton from "@/components/TableElements/RefreshTraningStatusButton";
import IssueResolvedButton from "@/components/TableElements/IssueResolvedButton";
import ViewButton from "@/components/TableElements/ViewButton";
import RefreshRecordButton from "@/components/TableElements/RefreshRecordButton";
import ScriptDialog from "@/components/TableElements/ScriptDialog";
import LogDialog from "@/components/TableElements/LogDialog";
import ScriptLogDialog from "@/components/TableElements/ScriptLogDialog";
import CompareBucketItem from "@/components/TableElements/CompareBucketItem";
import DeleteBankAccountButton from "@/payments/components/DeleteBankAccountButton.vue";
import CloneButton from "@/components/TableElements/CloneButton";
import CompareVersions from "@/components/TableElements/CompareVersions";


export default {
    name: "ActionWrapper",
    props: ["propData", "parameters","isDocumentReadOnly"],
    computed: {
        inlineComponent() {
            if (!_.isArray(this.propData.column.componentName)) return []
            let arr = _.filter(this.propData.column.componentName, (item) => {
                return item.inline == true
            })
            return _.map(arr, "name")
        },
        inlineActionItems() {
            return _.filter(this.parameters.actionItems, (item) => {
                return item.inline == true
            })
        },
        outlineComponent() {
            if(!_.get(this.propData,'column.componentName' )) return [];
            if (!_.isArray(this.propData.column.componentName)) return this.propData.column.componentName && this.propData.column.componentName.split(',')
            let arr = _.filter(this.propData.column.componentName, (item) => {
                return item.inline != true
            })
            return _.map(arr, "name")

        },
        outlineActionItems() {
            return _.filter(this.parameters.actionItems, (item) => {
                return item.inline !== true
            })
        }

    },
    components: {
        ApproveRejectButtons,
        ActiveInactiveButtons,
        DeleteButton,
        ResumeWorkflowButton,
        CancelWorkflowButton,
        RetryWorkflowButton,
        DeleteBankAccountButton,
        EditButton,
        ImportButton,
        VerifyPaymentButton,
        WFInstanceHistory,
        RefreshTraningStatusButton,
        IssueResolvedButton,
        ViewButton,
        RefreshRecordButton,
        ScriptDialog,
        LogDialog,
        ScriptLogDialog,
        CompareBucketItem,
        CloneButton,
        CompareVersions
            },
    data() {
        return {};
    },
    methods: {
        handleCommand(action) {
            this.parameters.table_index>=0 ? this.propData.table_index=this.parameters.table_index: ''
            typeof action === "function" ?
                action() :
                EventBus.$emit(action, this.propData);
        },

        // hideCondition is configuration function to hide show the action item. if not then by default item is visible
        hideActionItem(actionItem) {
            return typeof actionItem.hideCondition === "function" ?
                actionItem.hideCondition(this.propData) :
                false;
        }
    }
};
</script>

<style lang="scss">
.kp-action-wrapper-drowdown {
    overflow: hidden !important;
    padding: 0px !important;

    li {
        display: block;

        i {
            margin-right: 5px;
        }
    }
}

.el-popper[x-placement^="bottom"] {
    margin-top: 0;
}

.button-style {
    font-size: 26px !important;
    padding: 0 !important;
}

.edit-delete-button-container {
    .el-button {
        padding: 5px;
        border: 0;
    }
}

// .action-btn{
//       font-size: 16px !important;
// }
.dropdown-btn{
      margin-right: 10px;
}
</style>
