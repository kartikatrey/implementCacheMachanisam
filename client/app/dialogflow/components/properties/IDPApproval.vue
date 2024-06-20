<template>
<div class="properties-container">
    <PropertiesHeader :currentNode="currentNode" :dialogFlowData="dialogFlowData" />
    <div class="content-body">
        <el-form :model="form" ref="form" label-width="140px" :rules="formRules">
            <div class="without-tabs-container">

                <el-form-item class="inline-label-item" label="Component Name" prop="component_name">
                    <el-input v-model="form.component_name" placeholder="Enter component name"></el-input>
                </el-form-item> 

                <el-form-item
                    class="inline-label-item"
                    id="query-builder"
                    label="Rule"
                >
                    <QueryBuilder 
                        @onQueryChange="onQueryChange" 
                        cid="action-form-action-condition" 
                        :query="form.condition_builder" 
                        documentType="invoice"
                        documentSubtype="invoice"
                        :dataToShow='["fieldsData"]'>
                    </QueryBuilder>
                </el-form-item>

                 <el-form-item 
                    class="inline-label-item" 
                    label="Action" 
                    prop="action"
                >
                    <el-select 
                        class="idp-approval-property-component-action" 
                        v-model="form.action" 
                        collapse-tags 
                        filterable 
                        placeholder="Select action">
                        <el-option 
                            v-for="item of action_list" 
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item class="inline-label-item" label="Approval level" prop="approval_level">
                    <el-select class="idp-approval-property-component-approval-level-select" v-model="form.approval_level" placeholder="Choose approval level">
                        <el-option v-for="level in 10" :key="level" :label="level" :value="level" ></el-option>
                    </el-select>
                </el-form-item> 

                <el-form-item class="inline-label-item checkbox-item-container"  prop="is_confirmation_required" label="Confirmation required">
                    <toggle-button :sync="true" :color="{
                checked: '#5f8fdf',
                unchecked: '#DCDFE6',
                disabled: '#CCCCCC',
              }" :labels="{ checked: 'YES', unchecked: 'NO' }" cid="doc-assignemnt-is-confirmation-required" v-model="form.is_confirmation_required"></toggle-button>
                </el-form-item>

                <el-form-item 
                    class="inline-label-item" 
                    label="Approver emails" 
                    prop="approver_emails"
                    v-if="form && form.action == 'STATIC'"
                >
                    <el-select class="idp-approval-property-component-emails-select" v-model="form.approver_emails" multiple collapse-tags filterable allow-create placeholder="Choose tags for your article">
                        <el-option v-for="item in userList" :key="item.email" :label="item.email" :value="item.email">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item 
                    class="inline-label-item" 
                    label="Lookup name" 
                    prop="lookup_name"
                    v-if="form && form.action == 'LOOKUP'"
                >
                    <el-select 
                        class="idp-approval-property-component-lookup-name" 
                        v-model="form.lookup_name" 
                        collapse-tags 
                        filterable 
                        placeholder="Select lookup">
                        <el-option 
                            v-for="item in lookup_list" 
                            :key="item.type" 
                            :label="item.type" 
                            :value="item.type"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item 
                    class="inline-label-item" 
                    label="Lookup key" 
                    prop="lookup_key"
                    v-if="form && form.action == 'LOOKUP'"
                >
                    <el-input 
                        v-model="form.lookup_key" 
                        placeholder="Enter name">
                   </el-input>
                </el-form-item> 

                <el-form-item 
                    class="inline-label-item" 
                    label="Lookup value" 
                    prop="lookup_value"
                    v-if="form && form.action == 'LOOKUP'"
                >
                    <el-input 
                        v-model="form.lookup_value" 
                        placeholder="Enter value"
                        >
                    </el-input>
                </el-form-item>

                <el-form-item 
                    class="inline-label-item" 
                    label="Lookup column" 
                    prop="lookup_column"
                    v-if="form && form.action == 'LOOKUP'"
                >
                    <el-input 
                        v-model="form.lookup_column" 
                        placeholder="Enter column to retrive"
                        >
                    </el-input>
                </el-form-item>

                 <el-form-item 
                    class="inline-label-item codemirror-item-container" 
                    prop="advance_script"
                    v-if="form && form.action == 'ADVANCED'"
                >
                    <label class="label-name">Script</label>
                    <codemirror :value="form.advance_script" cid="doc-assignemnt-script" v-model="form.advance_script" :options="editorOptions" :placeholder="placeholder"></codemirror>
                </el-form-item>
            </div>
        </el-form>
    </div>
    <PropertiesFooter :currentNode="currentNode" :form.sync="form" :dialogFlowData="dialogFlowData" :formRef="$refs" />
</div>
</template>

<script>
import TableAPIService from "@/services/TableAPIService";
import constants from "@/dialogflow/helpers/Constants";
import Rete from "rete";
import PropertiesHeader from "@/dialogflow/components/properties/PropertiesHeader.vue";
import Codemirror from "@/components/Codemirror.vue";
import PropertiesFooter from "@/dialogflow/components/properties/PropertiesFooter.vue";
import UserService from "@/idp/services/UserService";
import wfDirty from "@/mixins/wfDirty.js";
const uuidv4 = require("uuid/v4");
import _ from "lodash";
import EventBus from "@/EventBus";
import Validator from "@/services/Validator";
import Constants from "@/resources/Constants";
import QueryBuilder from "@/idp/pages/QueryBuilder.vue";
import LookupConfigService from "@/idp/services/LookupConfigService";

export default {
    mixins: [wfDirty],
    name: "IDP Approval",
    props: ["dialogFlowData", "currentNode"],
    components: {
        Codemirror,
        PropertiesHeader,
        PropertiesFooter,
        QueryBuilder
    },
    data() {
        return {
            approvers: [""],
            userList: [],
            lookup_list : [],
            action_list : [],
            form: {
                approver_emails: [],
                component_name:"",
                is_confirmation_required: false,
                
                advance_script: Constants.WORKFLOW.GENERIC_SCRIPT || "",
                approval_level:1,   //default 1 level
                condition_builder : null,
                lookup_name : "",
                lookup_key : "",
                lookup_value : "",
                lookup_column : ""
            },
            formRules: {
                approver_emails: [{
                    trigger: "change",
                    required: true,
                    message: "Please enter email",
                }],
                advance_script: [{
                    validator: Validator.EmptyValueValidator,
                    trigger: "blur",
                    message: "Please provide valid script",
                },{
                    trigger: "blur",
                    required: true,
                    message: "Script is required",
                }]
            },
        };
    },
    methods: {
        init() {
            let nodeData = JSON.parse(JSON.stringify(this.currentNode.data));
            this.form = {
                node_id: nodeData["node_id"],
                ...this.form,
            };
            _.size(nodeData) > 1 ? (this.form = nodeData) : null;
            this.$nextTick(() => {
                this.clonedForm = JSON.parse(JSON.stringify(this.form))
            })

        },
        onQueryChange(input) {
            this.form.condition_builder = input.val;
        },

        postProcessing() {
            let connections = this.form["connections"];
            !connections ? (this.form["connections"] = []) : null;
            if (_.isEmpty(connections)) {
                let actions = constants.APPROVAL_CONNECTION_LABELS;
                for (let index = 0; index < 2; index++) {
                    let action = actions[index];
                    let name = uuidv4();
                    let script = this.getScriptByActionType(action);
                    this.form["connections"][index] = { name, label: action, script };
                    this.currentNode.addOutput(new Rete.Output(name, action, this.currentNode.inputs.get("act").socket));
                    this.currentNode.update();
                    EventBus.$emit("UPDATE_NODE", this.currentNode);
                }
            } else {
                this.form["connections"] = connections;
            }
            return true;
        },

        /**
         * Retrieve a script based on the given label and workflow version.
         * @param {string} action - The action (Approve/Reject) to retrieve script.
         * @returns - The script associated with the given action and wf version.
         */
        getScriptByActionType(action) {
            let script = {};
            
            // Get the workflow version from the dialogFlowData object, default is 2 if no version is provided.
            const wfVersion = _.get(this.dialogFlowData, "workflow_version", 2);
            
            // Check if the workflow version is greater than or equal to 3
            if (wfVersion >= 3) {
                // In case of V3 workflow we execute script in async/await style
                // There for getting await script from constants
                script = constants.IDP_APPROVAL_AWAIT_SCRIPTS[action];
            } else {
                // In case of V2 workflow we execute script in callback style with done()
                // There for getting default V2 script from constants
                script = constants.IDP_APPROVAL_SCRIPTS[action];
            }
            
            return script;
        }
    },

    async beforeMount() {
        this.userList = await UserService.fetch({
            active: true,
        });
        this.lookup_list = await LookupConfigService.get({},["type"])
        this.action_list = constants.APPROVAL_ACTION_LIST
        this.init();
    },
    mounted() {},
};
</script>
