<template>
<div v-if="showAssignmentModel" class="kp-body-scroll-timeline" v-bar="{ useScrollbarPseudo: true }">
    <el-dialog title="Assignment" :close-on-click-modal="false" width="17%" class="confirmation-box assignment-container" :visible.sync="showAssignmentModel">
        <div class="header">
            Assignment
        </div>

        <div class="assignment-body">
            <div v-if="isTryItUser()">
                <h4>Do you wish to get the full access to Kanverse.ai features? </h4>
                <h5>Please request for a demo, and a Kanverse expert will be on the way to help you with that. </h5>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <div class="assign-button-group">
                            <el-button cid="document-assign-close" size="small" @click="handleCloseDialog">Close</el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>

            <el-form v-else :model="form" ref="form" label-width="178px" class="demo-form" label-position="top">
                <el-row v-loading="dialogueLoading" :gutter="20">
                    <el-col :span="24">
                        <div class="kp-form-group kp-form-vertical">
                            <el-form-item label="Assigned group" prop="assigned_group">
                                <el-select cid="document-assign-group-select" class="config-value" clearable filterable v-model="form.assigned_group" placeholder="Select Assigned group" v-on:change="onAssignedGroupChange">
                                    <el-option v-for="(item, index) in assignedGroupList" :cid="'document-assign-group_'+index" v-bind:value="item._id" :key="item._id" :label="item.name"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="kp-form-group kp-form-vertical">
                            <el-form-item label="Assigned user" prop="assigned_user">
                                <el-select cid="document-assign-user-select" class="config-value" clearable filterable v-model="form.assigned_user" placeholder="Select Assigned user">
                                    <el-option v-for="(item, index) in assignedUserList" :cid="'document-assign-user_'+index" v-bind:value="item._id" :key="item._id" :label="item.full_name"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="24">
                        <div class="assign-button-group">
                            <el-button cid="document-assign-close" size="small" @click="handleCloseDialog">Close</el-button>
                                <el-button cid="document-assign-submit" v-loading="loading" element-loading-spinner="el-icon-loading" size="small" type="primary" @click="submitForm('form')">Submit</el-button>

                        </div>
                    </el-col>
                </el-row>

            </el-form>
        </div>
    </el-dialog>
</div>
</template>

<script>
import {
    Loading
} from "element-ui";
import DocumentService from "@/idp/services/DocumentService";
import UserGroupService from "@/idp/services/UserGroupService";
import UserService from "@/idp/services/UserService";
import _ from "lodash";
import EventBus from "@/EventBus";
import documentAssignment  from "@/idp/services/DocumentAssignmentRule"

export default {
    name: "DocumentAssign",
    components: {
        Loading
    },
    props: ["assignModalProps", "showAssignmentModel", 'documentType'],
    data: () => ({
        showModal: true,
        form: {
            "assigned_group": "",
            "assigned_user": ""
        },
        assignedGroupList: [],
        users: [],
        assignedUserList: [],
        groupUserMapping: {},
        dialogueLoading:false,
        loading:false

    }),
    
    mounted() {
    // Append the DocumentAssign component's element to the document body when it's mounted, so that it will append on the top of all the components
    document.body.appendChild(this.$el);
    },
    beforeDestroy() {
    // Remove the DocumentAssign component's element from the document body when it's destroyed
    document.body.removeChild(this.$el);
   },

    async beforeMount() {
        this.$nextTick(()=>{this.dialogueLoading = true;});
        const cpGroupProj = ["name","_id"]
        this.assignedGroupList = await UserGroupService.get({active:true}, cpGroupProj)
        this.assignedGroupList.push({"name":"", "_id":null});
        const cpUserProj = ["group_id", "_id", "full_name", "email"]
        this.users = await UserService.fetch({active:true}, cpUserProj)
        this.assignedUserList = this.users;


        _.each(this.users,(user)=>{
            _.each(user.group_id,(group)=>{
                if(this.groupUserMapping[group]){
                this.groupUserMapping[group].push(user)
                }else{
                this.groupUserMapping[group]=[user]
                }
            })
        })
        this.form.assigned_group = (_.find(this.assignedGroupList, (group)=>{return group._id == this.assignModalProps.assigned_group}) || {})._id;
        this.form.assigned_user = (_.find(this.users, (user)=>{return user._id == this.assignModalProps.assigned_user}) || {})._id;
        this.setassignedUserList();
        this.dialogueLoading = false;
    },
    methods: {
        onAssignedGroupChange() {
            this.form.assigned_user = "";
            this.setassignedUserList();
        },

        setassignedUserList() {
            if (!this.form.assigned_group) {
                this.assignedUserList = this.users;
                return;
            }
            this.assignedUserList = this.groupUserMapping[this.form.assigned_group];
        },

        handleCloseDialog() {
            this.$emit('closeAssignmentDialogue')

        },
        resetDialog() {
            this.$refs["form"] && this.$refs["form"].resetFields();
            this.form = {};
        },
        async submitForm(form) {
            const loggedUser = this.$store.getters.user;
            this.loading = true;

            let groupObj = this.form.assigned_group ? this.assignedGroupList.find(item => item._id === this.form.assigned_group) : null;
            let userObj = this.form.assigned_user ? this.users.find(item => item._id === this.form.assigned_user) : null;

            // Display a warning message if a user is not selected from the assignment component dropdown to prevent potential exceptions.
            if(!groupObj && !userObj){
                this.$notify({
                    title: 'Warning',
                    message: "Please select user",
                    type: 'warning'
                });
                this.loading = false;
                return;
            }

            try {
                // For single document assignment, use the documentService to update a single record.
                if (!Array.isArray(this.assignModalProps)) {
                    const result = await this.handleSingleDocumentAssignment(groupObj, userObj, loggedUser);
                    if (result) {
                        EventBus.$emit("REFRESH_TABLE");
                        return this.notifySuccess("Assignment changed succesfully");
                    }
                }
                // For bulk document assignment, use the bulkDocumentService to update multiple records with a single assigned user.
                else {
                    const docIds = this.assignModalProps.map(assignModalProp => assignModalProp._id);
                    const result = await this.handleBulkDocumentAssignment(groupObj, userObj, loggedUser, docIds);
                    if (result) {
                        EventBus.$emit("REFRESH_TABLE");
                        return this.notifySuccess("Assignment changed succesfully");
                    }
                }
            } catch (error) {
                this.notifyError("Something went wrong while changing Assignment");
            } finally {
                this.loading = false;
                this.$emit("closeAssignmentDialogue", true);
                // Below refresh event will be listed on document viewer when +Assign action triggered.
                EventBus.$emit("refresh_page")
            }
        },

        /**
         * Purpose: Handle assignment of a single document.
         * This function is responsible for assigning a single document to a group or user by sending an update payload to the server.
         *
         * @param {Object} groupObj - The group to which the document is assigned.
         * @param {Object} userObj - The user to whom the document is assigned.
         * @param {Object} loggedUser - Information about the user who is making the assignment.
         * @returns {boolean} - Indicates whether the assignment was successful.
         */
        async handleSingleDocumentAssignment(groupObj, userObj, loggedUser) {
            let updatePayload = {
                action: "document_assignment", // We pass an 'action' parameter here, which is handled on the server-side to execute various dynamic actions.
                document_id: this.assignModalProps._id,
                assigned_group: groupObj && groupObj._id,
                assigned_user: userObj && userObj._id,
                assigned_group_name: groupObj && groupObj.name,
                assigned_user_name: userObj && userObj.full_name,
                assigned_user_email: userObj && userObj.email,
                assigned_by: loggedUser.email,
                document_type: this.documentType,
            };
            const result = await DocumentService.processAction(updatePayload);
            return result.data && _.get(result, "data.status") === true;
        },

        /**
         * Purpose: Handle bulk assignment of documents to a group or user.
         * This function is responsible for bulk assigning multiple documents to a group or user by sending an update payload to the server.
         *
         * @param {Object} groupObj - The group to which the documents are assigned.
         * @param {Object} userObj - The user to whom the documents are assigned.
         * @param {Object} loggedUser - Information about the user who is making the assignment.
         * @param {Array} docIds - An array of document IDs to be assigned in bulk.
         * @returns {boolean} - Indicates whether the bulk assignment was successful.
         */
        async handleBulkDocumentAssignment(groupObj, userObj, loggedUser, docIds) {
            const updatePayload = {
                action: "bulk_assign",
                document_ids: docIds,
                assigned_group: groupObj && groupObj._id,
                assigned_user: userObj && userObj._id,
                assigned_group_name: groupObj && groupObj.name,
                assigned_user_name: userObj && userObj.full_name,
                assigned_user_email: userObj && userObj.email,
                assigned_by:  loggedUser.email,
                document_type: this.documentType,
            };
            const response = await DocumentService.updateRecords(updatePayload);
            return response.data && _.get(response, "data.status") === true;
        }
    }

};
</script>

<style  lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal.scss";
.assignment-container {
.kp-form-vertical {
        margin-bottom: .5rem !important;
        .el-form-item__label {
            line-height: 2rem !important;
        }
        .el-form-item {
                margin-bottom: 0;
        }
    }
    .el-dialog {
            padding: 0;
    }
    .assignment-body {
        padding: 1rem 1.5rem 1.5rem 1.5rem;
    }
        .assign-button-group {
                margin-top: 1rem;
                text-align: right;
        }
        .header {
            border-bottom: 1px solid var(--dark-06);
            padding: .7rem 1.4rem;
            margin-bottom: 0;
            color: var(--dark-02);
            font-size: var(--font-base);
        }
}

/* .kp-body-scroll-timeline {
   .assign-button-group {
     float:right;
     margin-bottom:0px !important;
   }
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
    padding-right: 10px;

} */
</style>
