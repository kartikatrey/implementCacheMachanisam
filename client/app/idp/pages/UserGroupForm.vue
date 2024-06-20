<template>
<el-main class="kp-main">
    <section class="page-body">
        <div class="page-title">
            <el-button cid="form-header-back"  icon="mdi mdi-arrow-left-circle-outline" v-on:click="onBack"></el-button>
            <span class="page-title-text" v-if="isEditMode">Edit Group
            </span>
            <span class="page-title-text" v-else>Add Group</span>
        </div>

        <section class="form-page-container">
            <div class="panel">
                <div class="panel-body">
                    <el-form :model="form" ref="form" label-width="80px" :rules="formRules">
                        <div class="grouping-tile">General  configuration</div>
                        <el-row :gutter="40">
                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item class="control-label col-sm-2" prop="name" label="Name">
                                        <el-input cid="user-group-form-name" class="form-control" prop="name" v-model="form.name" placeholder></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>

                    </el-form>
                </div>
                <!-- | panel body -->
                <footer>
                    <div></div>
                    <div>
                        <el-button size="small" cid="user-group-form-cancel" v-on:click="onBack">Cancel</el-button>
                    </div>
                    <div>
                        <el-button :disabled="disableSave" size="small" cid="user-group-form-save" v-on:click="saveGroup" type="primary">Save</el-button>
                    </div>

                </footer>
            </div>
        </section>
    </section>

    <section class="page-body">
        <h3 class="page-title" v-if="showDatatable && isEditMode">
            Attached users
        </h3>
        <div v-if="showDatatable && isEditMode" class="grid-content bg-purple">
            <div data-v-step="2" class="table-wrap">
                <data-table  :parameters="tableParams" ref="datatable" :columnTemplate="columnTemplate"></data-table>
            </div>
        </div>
    </section>
    <el-dialog title="Add user" custom-class="user-group" :visible.sync="dialogVisible" :close-on-click-modal="false" width="40%" :show-close="false" center>
        <div style="background-color:white" id="add-user" class="add-user">
            <h3>Add user</h3>
            <el-select id="add-user-select" cid="user-group-form-users-select" ref="userSelect" v-model="selectedUsers" multiple filterable popper-class="user-list" clearable remote reserve-keyword placeholder="Enter name" :remote-method="remoteMethod" :loading="loading" @change="resetSelect">
                <el-option v-for="(user,index) in options" :cid="'user-group-form-users_'+index" :key="user._id" :label="user.full_name || user.username" :value="user._id">
                    <avatar v-bind="prepareAvatarObject(user)" :disablePopover="true" :showStatus="false"></avatar>
                    {{ user.full_name || user.username }}
                </el-option>
            </el-select>

            <footer id="add-user-footer">
                <el-button cid="user-group-form-add" class="btn btn-sm btn-primary" @click="addUser" type="primary">Add</el-button>
                <el-button cid="user-group-form-done" class="btn btn-sm btn-cancel" @click="closeDialog">Cancel</el-button>
            </footer>

        </div>
    </el-dialog>

</el-main>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import _ from "lodash";
import EventBus from "@/EventBus";
import UserGroupService from "@/idp/services/UserGroupService";
import UserService from "@/idp/services/UserService";
import Avatar from "@/idp/components/chat/components/Avatar.vue";

export default {
    name: "UserGroupForm",

    components: {
        DataTable,
        Avatar
    },

    computed: {
        tableParams() {
            return {
                apiName: `/portal/api/table/cp_user`,
                aggregation: true,
                tableName: "groupUser",
                isRestify: true,
                queryParam: {
                    active: true,
                    group_id: {"$in":[this.$route.query.id]},
                },
                limit: 100,
                allowInline: true,
                hideAddButton: true,
                inlineAddButtonConfig: {
                    disable: this.isEditMode ? false : true,
                },
                addButtonConfig: {
                    event: "ADD_USER_DIALOGUE_VISIBLE",
                    name: "Add User",
                },
                actionItems: [{
                    icon: "mdi mdi-delete",
                    name: "Delete",
                    event_name: "unlink_group",
                    inline: true,
                }, ]
            };
        },
    },
    data() {
        var validateLabel = (rule, value, callback) => {
            if (value && value.trim() === "") {
                callback(new Error(`Please enter valid ${rule.field}`));
            } else {
                callback();
            }
        };
        return {
            selectedUsers: [],
            showDatatable: true,
            disableSave: false,
            isEditMode: false,
            form: {},
            options: [],
            dialogVisible: false,
            formRules: {
                name: [{
                        validator: validateLabel,
                        trigger: "blur",
                    },
                    {
                        required: true,
                        message: "Please enter group name",
                        trigger: "blur",
                    },
                ]
            }

        }
    },

    methods: {
       reRenderDatatable(){
                this.showDatatable = false
                this.$nextTick(()=>{
                   this.showDatatable = true
                })
        },

      async closeDialog(){
            this.dialogVisible = false;
            this.resetSelect();
        },

        async addUser() {
            const payload = {
                user_group: this.$route.query.id,
                user_ids: this.selectedUsers,
            };
            try {
                let response = await UserService.updateUserGroup(payload)
                
                this.notifySuccess("Users added to the group succesfully");
            } catch (error) {
                console.log(error)
                this.notifyError("Error while adding group to the user");
            }
            this.selectedUsers = [];
            this.dialogVisible = false;
            this.reRenderDatatable();
            this.resetSelect();
        },

        resetSelect(){
            if(this.$refs['userSelect']){
                    this.$refs['userSelect'].query = ""
                    this.$refs['userSelect'].previousQuery = ""
            }
            this.options = []
        },


        prepareAvatarObject(user) {
            return {
                userId: user._id,
                username: user.full_name || user.username,
                src: user.avatar,
                size: 30
            };
        },
        columnTemplate(props) {
            var htmlTemplate = "";
            if (props.row["active"]) {
                htmlTemplate = `<div data-v-c0ac797e="" class="el-badge mark"><sup class="badge-active">Active</sup></div>`;
            } else {
                htmlTemplate = `<div data-v-c0ac797e="" class="el-badge mark"><sup class="badge-pending">Inactive</sup></div>`;
            }
            return htmlTemplate;
        },
        async saveGroup() {
            this.disableSave = true;
            let isValid = await this.$refs.form.validate().catch((error) => {});
            if (!isValid) {
                this.disableSave = false;
                return;
            }
            let res = await UserGroupService.save(this.form).catch((errorMessage) => {
                this.notifyError(errorMessage);
            });
            if (res) {
                 if (
                        _.get(res, "data.name") == "MongoError" &&
                        _.get(res, "data.errmsg").includes("duplicate key")
                    ) {
                        
                       this.notifyError("User group is already present. ");
                    }
                else{
                this.form = res;
                this.$router.push("/idp/user-groups");
                this.notifySuccess("Records saved successfully");
                }
            }
            this.disableSave = false;
        },

        async init(recordId) {
            try {
                let data = await UserGroupService.fetchById(recordId);
                this.form = Object.assign({}, this.form, data);
            } catch (error) {
                this.notifyError("Error while displaying record");
            }
        },

        async remoteMethod(query) {
            this.options = [];
            if (query == "") {
                return;
            }
            this.loading = true;
            const searchQuery = {
                full_name: {
                    $regex: query,
                    $options: "i",
                },
                active: true,
                group_id:{
				             	$ne: this.$route.query.id
			          	}
            };
            let list = await UserService.fetch(searchQuery);
            this.options = list
            this.loading = false;
        },

        onBack() {
            let redirectUrl = this.$route.query.redirect_url;
            let groupId = this.$route.query.id;
            if (redirectUrl && id) {
                this.$router.push({
                    path: redirectUrl,
                    query: {
                        id: groupId,
                    },
                });
                return;
            }

            this.$router.push("/idp/user-groups");
        },
        async unlinkGroup(user) {
            let userId = user.row._id
            if (!userId) return;
            let payload = {
                user_ids: [userId],
                user_group: this.$route.query.id,
                delete_group:true
            }
            try {
                let response = await UserService.updateUserGroup(payload)
                this.notifySuccess("User detached from group succesfully");
                this.reRenderDatatable();
            } catch (error) {
                console.log(error)
                this.notifyError("Error while removing group from user");
            } 

        }
    },

    async beforeDestroy(){
      EventBus.$off(["ADD_USER_DIALOGUE_VISIBLE","unlink_group"]);
    },

    async beforeMount() {
        this.$store.commit("setDisplayIdpTree",false);
        this.$store.commit("setDisplayIdpNavbar",true);
        let recordId = this.$route.query.id;
        if (!recordId) return;
        this.isEditMode = true;
        this.init(recordId);
        EventBus.$on("unlink_group", (user) => {
            this.unlinkGroup(user);
        });
        EventBus.$on("ADD_USER_DIALOGUE_VISIBLE", async (value) => {
            this.dialogVisible = true;
        });
    }

}
</script>

<style lang="scss">
@import "../_idpGlobal";

.form-page-container {
    .script-container {
        display: flex;

        .select-box-container {
            .el-form-item__content {
                margin-left: 0px !important;
            }

        }
    }

}
.user-group{
     padding: 0px !important;
}
</style>
