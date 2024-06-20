<template>
    <span>
        <el-dropdown-item :cid="'table-action-script-dialog-' + propData.index" v-if="type=='dropdown'" :command="editRecord">
            <span :class="icon"></span>View
        </el-dropdown-item>
        <!-- <el-button :cid="'table-action-script-dialog-' + propData.index"  v-on:click="editRecord">
            <span class="action-btn" :class="icon"></span>View
        </el-button> -->
        <!-- Dialogs -->

          <el-dialog
            width="65%"
            v-if="displayDialog"
            :close-on-click-modal="false"
            :show-close="false"
            :destroy-on-close="true"
            class="folder-modal-container"
            title="Script details"
            :visible.sync="dialogVisible"
            :append-to-body="true"
            center
          >
            <section class="accordian-container">
                <h3>{{pageTitle}}</h3>
                <el-row v-if="propData && propData.row">
                <el-col class="header-fields"
                    :span="12"
                    v-for="(field, index) in fieldsToShow"
                    v-bind:key="index"
                >
                    <div class="form-group form-horizontal">
                    <div class="filed-label">{{ field.label }} : </div>
                        <component v-if="field.componentName" v-bind:is="field.componentName"  :data="{column:{property:field.key},row:{[field.key]:propData.row[field.key]}}"  v-bind:key="field.componentName"></component>
                        <span v-else>
                                {{ propData.row[field.key]}}
                        </span>
                    </div>
                </el-col>
                </el-row>
                <div class="accordian-bar">
                    <div class="panel">
                        <div class="panel-body">
                            <!-- <codemirror
                            id="codemirror"
                            cid="business-rule-form-script"
                            v-model="versionRecord"
                            :options="editorOptions"
                          ></codemirror> -->
                          <KanverseEditor
                              v-if="versionRecord"
                              :options="{ 'width': '100%', 'height': '500px', 'language': 'businessRule' }"
                              :content="versionRecord"
                              v-model="versionRecord"
                              :language="'json'"
                              @onDidChangeModelContent="handleContentChange">
                            </KanverseEditor>
                        </div>

                        <!-- Footer -->
                        <footer>
                            <div></div>
                            <div>
                                <el-button
                                    v-if="restoreBtn"
                                    v-on:click="cancel"
                                    class="btn btn-sm btn-default"
                                    cid="add-business-rule-form-cancel"
                                    >
                                Cancel
                                </el-button>
                            </div>
                            <div id="restore-button">
                                <el-button
                                    v-if="restoreBtn"
                                    cid="add-business-rule-form-restore"
                                    v-on:click="restore"
                                    class="btn btn-sm btn-primary"
                                    >
                                Restore
                                </el-button>
                            </div>
                            <div>
                                <el-button
                                    v-if="!restoreBtn"
                                    v-on:click="cancel"
                                    class="btn btn-sm btn-default"
                                    cid="add-business-rule-form-cancel"
                                    >
                                Close
                                </el-button>
                            </div>
                        </footer>
                    </div>
                </div>
            </section>
          </el-dialog>

    </span>
    </template>

    <script>
    import TableAPIService from "@/services/TableAPIService";
    import Codemirror from "@/components/Codemirror";
    import EventBus from "@/EventBus";
    import VersionService from "@/idp/services/VersionService";
    // import LookupHistoryService from "@/idp/services/LookupHistoryService";
    import Date from "@/idp/table/components/Date";
    import KanverseEditor from "@/components/KanverseEditor";

    export default {
        name: "ScriptDialog",
        props: ["propData", "type"],
        components: {
            Codemirror,
            Date,
            KanverseEditor
        },
        data() {
            return {
                dialogVisible:true,
                fieldsToShow:[{key:'created_at',label:'Created At',componentName:'Date'},
                {key:'status',label:'Status'},{key:'created_by',label:'Created By'}],
                label: "Edit",
                icon: "mdi mdi-script action-btn dropdown-btn",
                displayDialog : false,
                pageTitle : "Script",
                versionRecord : "",
                editorOptions: {
                    theme: "default",
                    mode: {
                        name: "javascript",
                        json: true,
                        statementIndent: 2
                    },
                    readOnly:true
                },
                recordId : "",
                buttonLoader:false,
                restoreBtn : false
            };
        },
        methods: {
            // // Get service to fetch version data
            // getService(table){
            //     return table? LookupHistoryService: VersionService;
            // },
            handleContentChange(content) {
                this.versionRecord = content;
            },
            async getRecords() {
                const _id = this.propData.column.scriptOptions._id;
                // const table = this.propData.column.scriptOptions.table_name;
                let record = this.propData.row;
                this.recordId = record[_id];
                let result = await VersionService.fetchById(this.recordId);
                record = JSON.stringify(JSON.parse(result.record), null, 2);
                this.versionRecord = record;
            },
            editRecord(){
                this.displayDialog = true;
                this.getRecords();
            },
            async restore() {
                this.$confirm(`Are you sure you want to restore?`, "Confirmation", {
                    confirmButtonText: "Confirm",
                    cancelButtonText: "Cancel",
                    type: "warning"
                }).then(async () => {
                    let collectionName = this.propData.row.collection_name
                    let res = await VersionService.restoreRecord({record_id:this.recordId,collection_name:collectionName});
                    this.displayDialog = false
                    if(_.get(res,"data.status")){
                        this.notifySuccess("Record restored successfully");
                        EventBus.$emit("refresh-version-list",{})
                        return
                    }
                    this.notifyError("Error while restoring");

                }).catch((e) => {
                    console.log("Error while restoring record :",e)
                });


            },
            cancel(){
                this.displayDialog = false
            }
        },

        async beforeMount(){
            this.restoreBtn = this.propData.column.scriptOptions.restore || false
            if (this.restoreBtn) {
                this.getRecords();
            }
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

    .folder-modal-container{
        .accordian-container{
            .form-horizontal{
                display:flex;
                .filed-label{
                    font-weight:600;
                    margin-right:8px;
                }
            }
        }
    }
    </style>
