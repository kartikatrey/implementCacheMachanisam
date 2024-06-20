<template>
<div class="properties-container" v-loading="loading">
    <PropertiesHeader :currentNode="currentNode" :dialogFlowData="dialogFlowData" />
    <div class="content-body">
        <el-form ref="form" :model="form" label-position="left" label-width="110px">
            <div class="without-tabs-container">
                <div v-for="(output, index) in form.assignmentRuleList" :key="index" class="add-condition-container">
                    <el-form-item class="inline-label-item" :rules="[
                            {
                                validator: validator.EmptyValueValidator,
                                trigger: 'blur',
                                message: 'Please provide valid name',
                            },
                            {
                                    required: true,
                                    message: 'Name is required',
                                    trigger: 'blur',
                            },]"
                            :prop="'assignmentRuleList.' + index + '.name'" label="Name">
                        <el-input name="name" cid="doc-assignemnt-name" v-model="output.name" placeholder="Document Assignment rule name"></el-input>
                    </el-form-item>
                    <el-form-item class="inline-label-item" label="Component Name" prop="component_name">
                        <el-input v-model="form.component_name" placeholder="Enter component name"></el-input>
                    </el-form-item>
                    <el-form-item :rules="[
                            {
                                required: true,
                                message: 'Document type is required',
                                trigger: 'change',
                            },
        ]" class="inline-label-item" :prop="'assignmentRuleList.' + index + '.document_type'" label="Document type">
                        <!-- v-on:change="onTypeChange" -->
                        <el-select v-on:change="onDocumentTypeChange(index)" clearable filterable v-model="output.document_type" placeholder="Document type">
                            <el-option v-for="option in documentTypes" :key="option.value" :value="option.value" :label="option.label"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item class="inline-label-item" :prop="'assignmentRuleList.' + index + '.is_advanced'" label="Advanced script">
                        <toggle-button :sync="true" :color="{
                                  checked: '#5f8fdf',
                                  unchecked: '#DCDFE6',
                                  disabled: '#CCCCCC',
                                }" :labels="{ checked: 'YES', unchecked: 'NO' }" cid="doc-assignemnt-is-advanced-script" v-model="output.is_advanced"></toggle-button>
                    </el-form-item>

                    <el-form-item :rules="{
                                required: true,
                                message: 'Assignment group is required',
                                trigger: 'change',
                              }" v-if="!output.is_advanced" class="inline-label-item" :prop="'assignmentRuleList.' + index + '.assigned_group'" label="Assigned group">
                        <el-select clearable class="config-value" filterable v-model="output.assigned_group" placeholder="Select Assigned group" v-on:change="onAssignedGroupChange(index)" cid="doc-assignemnt-group-select">
                            <el-option v-for="(item, index) in assignedGroupList" :cid="'doc-assignemnt-group_' + index" v-bind:value="item._id" :key="item._id" :label="item.name"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item v-if="!output.is_advanced" class="inline-label-item" :rules="{
                                required: true,
                                message: 'User name is required',
                                trigger: 'change',
                              }" label="Assigned user" :prop="'assignmentRuleList.' + index + '.assigned_user'">
                        <el-select clearable class="config-value" filterable v-model="output.assigned_user" placeholder="Select Assigned user" cid="doc-assignemnt-users-select">
                            <el-option v-for="(item, index) in assignedUserList" :cid="'doc-assignemnt-users_' + index" v-bind:value="item._id" :key="item._id" :label="item.full_name"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item v-if="!output.is_advanced" :rules="{
                                  validator: validator.QueryBuilderValidator,
                                  trigger: 'blur',
                                }" class="inline-label-item" id="query-builder" :prop="'assignmentRuleList.' + index + '.rule'" label="Rule">
                        <QueryBuilder cid="doc-assignemnt-rule" @onQueryChange="onQueryChange" :query="output.rule" :documentType="output.document_type" :documentSubtype="output.document_subtype" :index="index" :dataToShow='["fieldsData"]'></QueryBuilder>
                        <!-- <vue-query-builder :rules="rules" v-model="form.rule"></vue-query-builder> -->
                    </el-form-item>

                    <el-form-item v-if="output.is_advanced" class="inline-label-item codemirror-item-container"  :prop="'assignmentRuleList.' + index + '.script'">
                        <label class="label-name">Script</label>
                        <codemirror :value="output.script" cid="doc-assignemnt-script" v-model="output.script" :options="editorOptions"></codemirror>
                    </el-form-item>
                    <div class="notification-delete-container">
                        <el-button v-on:click="removeConnection(item, index)" class="btn-delete btn-delete-card" size="mini">Remove
                            <!-- <i class="mdi mdi-delete"></i> -->
                        </el-button>
                    </div>
                </div>
                <el-button size="small" v-on:click="addRules($event)" type="primary">+ ADD rule</el-button>
            </div>
        </el-form>
    </div>
    <PropertiesFooter :currentNode="currentNode" :form.sync="form" :dialogFlowData="dialogFlowData" :formRef="$refs" :loading.sync="loading" />
</div>
</template>

<script>
import Codemirror from "@/components/Codemirror.vue";
import moment from "moment";
import Constants from "@/resources/Constants";
import VueQueryBuilder from "vue-query-builder";
import IDPWaitQueryBuilder from "../config/IDPWaitQueryBuilder.json";
import DocumentAssignmentRuleService from "@/idp/services/DocumentAssignmentRule";
import FieldService from "@/idp/services/FieldService";
import ConfirmModel from "@/components/ConfirmModel";
import QueryBuilder from "@/idp/pages/QueryBuilder.vue";
let jsonpath = require("jsonpath");
import EventBus from "@/EventBus";
import UserGroupService from "@/idp/services/UserGroupService";
import UserService from "@/idp/services/UserService";
import _ from "lodash";
import PropertiesFooter from "@/dialogflow/components/properties/PropertiesFooter.vue";
import PropertiesHeader from "@/dialogflow/components/properties/PropertiesHeader.vue";
import Validator from "@/services/Validator";
import wfDirty from "@/mixins/wfDirty.js";

export default {
    name: "Assignment",
    props: ["dialogFlowData", "currentNode", "documentTypes"],
    mixins: [wfDirty],
    components: {
        Codemirror,
        ConfirmModel,
        VueQueryBuilder,
        QueryBuilder,
        PropertiesFooter,
        PropertiesHeader,
    },
    data() {
        return {
            loading: false,
            validator: Validator,
            assignedGroupList: [],
            users: [],
            assignedUserList: [],
            groupUserMapping: {},
            rules: [],
            form: {
                assignmentRuleList: [{
                    name: "",
                    component_name:"",
                    document_type: "",
                    document_subtype: "",
                    assigned_group: "",
                    assigned_user: "",
                    order: 0,
                    is_advanced: false,
                    rule: {
                        logicalOperator: "all",
                        children: [],
                    },
                    script: Constants.WORKFLOW.PRE_SCRIPT.ASSIGNMENT || "",
                    active: true,
                }, ],
            },
            triggers: Constants.DOCEX.TRIGGERS_LIST,
            pageTitle: "Document assignment rule",
            disableSave: false,
        };
    },

    methods: {
        removeConnection(output, index) {
            this.form.assignmentRuleList.splice(index, 1);
        },
        addRules(event) {
            this.form.assignmentRuleList.push({
                name: "",
                document_type: "",
                document_subtype: "",
                assigned_group: "",
                assigned_user: "",
                order: 0,
                is_advanced: false,
                rule: {
                    logicalOperator: "all",
                    children: [],
                },
                script: Constants.WORKFLOW.PRE_SCRIPT.ASSIGNMENT || "",
                active: true,
            });
            this.$forceUpdate();
        },

        onAssignedGroupChange(index) {
            this.form.assignmentRuleList[index].assigned_user = "";
            this.setAssignedUserList(index);
        },

        setAssignedUserList(index = null) {
            // console.log("this.form.assigned_group--------------->",this.assignmentRuleList[index].assigned_group)
            if (!index || !this.form.assignmentRuleList[index].assigned_group) {
                this.assignedUserList = this.users;
                console.log(
                    "this.assignedUserList--------------->",
                    this.assignedUserList
                );
                return;
            }
            this.assignedUserList =
                this.groupUserMapping[
                    this.form.assignmentRuleList[index].assigned_group
                ];
            console.log(
                "this.assignedUserList after--------------->",
                this.assignedUserList
            );
        },

        onQueryChange(input) {
            this.form.assignmentRuleList[input.index].rule = input.val;
        },

        onDocumentTypeChange(index) {
            this.form.assignmentRuleList[index].document_subtype = this.form.assignmentRuleList[index].document_type;
        },

        async init(recordId) {
            let nodeData = JSON.parse(JSON.stringify(this.currentNode.data));
            this.form = {
                node_id: nodeData["node_id"],
                assignmentRuleList: this.form.assignmentRuleList
            };
            try {
                if (recordId) {
                    let assignmentRuleList =
                        await DocumentAssignmentRuleService.find({
                            workflow_id: recordId,
                            workflow_node_id: this.currentNode.id,
                        });

                    if (!_.isEmpty(assignmentRuleList)) {
                        this.form.assignmentRuleList = assignmentRuleList
                    }
                }
            } catch (error) {
                this.notifyError("Error");
            }
        },
        async save() {
            return this.insertRecord();
        },

        async postProcessing() {
            let self = this;
            let group = null;
            let user = null;
            let res = [];
            _.each(this.form.assignmentRuleList, async (rule, index) => {
                let groupObj = rule.assigned_group ?
                    this.assignedGroupList.find(
                        (item) => item._id === rule.assigned_group
                    ) :
                    null;
                let userObj = rule.assigned_user ?
                    this.users.find((item) => item._id === rule.assigned_user) :
                    null;
                rule["assigned_group_name"] = groupObj && groupObj.name;
                rule["assigned_user_name"] = userObj && userObj.full_name;
                rule["assigned_group"] = groupObj && groupObj._id;
                rule["assigned_user"] = userObj && userObj._id;
                rule["order"] = index;
                rule["workflow_id"] = this.dialogFlowData._id;
                rule["workflow_node_id"] = this.currentNode.id;
                rule["active"] = true;
                res.push(DocumentAssignmentRuleService.save(rule))
            });

            await Promise.all(res)
            let deleteMethodArr = _.compact(_.map(this.clonedForm.assignmentRuleList, (rule) => {
                if (!_.find(this.form.assignmentRuleList, {
                        "_id": rule._id
                    })) {
                    return DocumentAssignmentRuleService.delete(rule._id)
                }
            }))

            if (!_.isEmpty(deleteMethodArr)) {
                await Promise.all(deleteMethodArr)
            }
            return true;
        },
    },

    mounted() {},
    async beforeMount() {
        // EventBus.$emit("SET_DISPLAY_IDP_TREE", false);
        // EventBus.$emit("SET_DISPLAY_IDP_NAVBAR", false);
        let recordId = this.$route.query.id;
        await this.init(recordId);

        // this.getDocumentType();
        const cpGroupProj = ["name","_id"]
        this.assignedGroupList = await UserGroupService.get({active: true}, cpGroupProj);

        const cpUserProj = ["group_id", "_id", "full_name"]
        this.users = await UserService.fetch({active: true}, cpUserProj);
        this.assignedUserList = this.users

        _.each(this.form.assignmentRuleList, (rule) => {
            let groupId = rule.assigned_group;
            let userId = rule.assigned_user;
            _.each(this.users, (user) => {
                _.each(user.group_id, (group) => {
                    if (this.groupUserMapping[group]) {
                        this.groupUserMapping[group].push(user);
                    } else {
                        this.groupUserMapping[group] = [user];
                    }
                });
            });
            rule.assigned_group = (
                _.find(this.assignedGroupList, (group) => {
                    return group._id == groupId;
                }) || {}
            )._id;
            rule.assigned_user = (
                _.find(this.users, (user) => {
                    return user._id == userId;
                }) || {}
            )._id;
            this.groupUserMapping = _.groupBy(this.users, "group_id");
        });

        this.setAssignedUserList();
        this.clonedForm = JSON.parse(JSON.stringify(this.form));
    },
};
</script>

<style lang="scss">
    .vue-slideout-content {
        overflow: auto;
    }
</style>