<template>
    <el-main class="kp-main lookup-config-form-container">
        <section class="page-body" v-loading="loading">
            <div class="page-title">
                <el-button cid="form-header-back" icon="mdi mdi-arrow-left-circle-outline" v-on:click="onBack"></el-button>
                <span class="page-title-text" v-if="isEditMode">Edit Lookup </span>
                <span class="page-title-text" v-else>Add Lookup</span>
            </div>

            <section class="form-page-container">
                <div class="panel">
                    <div class="panel-body">
                        <el-form :model="form" ref="form" label-width="120px" :rules="formRules">
                            <el-row :gutter="40">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item class="control-label col-sm-2" prop="label" label="Label">
                                            <el-input @input="handleLookupLabel" cid="lookup-config-form-type" class="form-control" prop="label" v-model="form.label" placeholder></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item class="control-label col-sm-2" prop="type" label="Type">
                                            <el-input disabled cid="lookup-config-form-type" class="form-control" prop="type" v-model="form.type" placeholder></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>
                             <el-row :gutter="40">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item class="control-label col-sm-2" prop="active" label="Active">
                                            <el-checkbox cid="lookup-config-form-active" v-model="form.active"></el-checkbox>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row :gutter="40">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item class="control-label col-sm-2" prop="description" label="Description">
                                            <el-input rows="2" type="textarea" cid="lookup-config-form-description" class="form-control" prop="description" v-model="form.description" placeholder></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item class="control-label col-sm-2" prop="uniqueColumns">
                                            <template slot="label">
                                                <div>
                                                    <span> Unique columns </span>
                                                    <span>
                                                        <el-tooltip
                                                        content="Records added with same unique columns will be replaced"
                                                        placement="top"
                                                        effect="light"
                                                        >
                                                            <span class="mdi mdi-information-outline"></span>
                                                        </el-tooltip>
                                                    </span>
                                                </div>
                                            </template>
                                            <el-select class="select-box" size="large" multiple v-model="form.unique_columns" filterable collapse-tags reserve-keyword placeholder="Please select unique columns">
                                                <el-option v-for="(col, index) in tableParams.columns" :key="col.name" :label="col.label" :value="col.name" label-width="170px"></el-option>
                                            </el-select>
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
                            <el-button size="small" cid="lookup-config-form-cancel" v-on:click="onBack">Cancel</el-button>
                        </div>
                        <div>
                            <el-button v-if="isSaveActionAllowed" :disabled="disableSave" size="small" cid="lookkup-config-form-save" v-on:click="saveLookupConfig" type="primary">Save</el-button>
                        </div>
                    </footer>
                </div>
            </section>
        </section>
        <section class="page-body lookup-wrap">
            <div v-if="showSpreadsheet && isEditMode" class="grid-content bg-purple">
                <div data-v-step="2" class="table-wrap">
                    <spread-sheet @editColumn="handleEditColumn" @insertColumn="handleAddColumn" :parameters="tableParams" :isDeleteAllAllowed="!isLookupDataVersion" ref="spreadsheet"></spread-sheet>
                </div>

                <el-dialog :title="editColumnDataIndex != null ? `Edit column`:`Add column`" custom-class="lookup-config-wrap" :visible.sync="updateColumnDialogVisible" :close-on-click-modal="false" width="30%" center>
                    <div class="inner-body">
                        <!-- <h3>Add column</h3> -->
                        <el-form :model="lookupForm" ref="lookupForm" label-width="100px" :rules="lookupFormRules">
                            <el-row>
                                <div class="kp-form-group">
                                    <el-form-item class="control-label col-sm-2" prop="label" label="Label">
                                        <el-input cid="lookup-config-form-type" class="form-control" prop="label" v-model="lookupForm.label" @input="handleLabelInput" placeholder="Label"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="kp-form-group">
                                    <el-form-item class="control-label col-sm-2" prop="name" label="Name">
                                        <el-input disabled cid="lookup-config-form-description" class="form-control" prop="name" v-model="lookupForm.name" placeholder="Name"></el-input>
                                    </el-form-item>
                                </div>
                            </el-row>
                            <el-row>
                                <div class="kp-form-group">
                                    <el-form-item class="control-label col-sm-2" prop="datatype" label="Data type">
                                        <el-select :disabled="editColumnDataIndex != null" style="padding-left:0px" class="select-box" size="large" v-model="lookupForm.datatype" filterable reserve-keyword cid="lookup-config-form-data-type-select" placeholder="Select data type">
                                            <el-option v-for="(_type,index) in dataTypes" :cid="'lookup-config-form-data-type_'+index" :key="_type.value" :label="_type.label" :value="_type.value" label-width="170px"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </el-row>
                            <el-row>
                                <div class="kp-form-group">
                                    <el-form-item class="control-label col-sm-2" prop="index" label="Index">
                                        <el-checkbox v-model="lookupForm.index">
                                        </el-checkbox>
                                    </el-form-item>
                                </div>
                            </el-row>
                        </el-form>
                    </div>
                    <footer id="add-user-footer">
                         <el-button size="small" :disabled="disableAddColumnButton" cid="lookup-config-form-add" @click="updateLookupConfig" type="primary">Save</el-button>
                        <el-button size="small" cid="lookup-config-form-done"   @click="closeUpdateColumnDialog">Close</el-button>

                    </footer>
                </el-dialog>
            </div>
            <upload v-if="showUploadDialog" :data="fileUploadData" :parameters="fileUploadParameters" :dialogShow="showUploadDialog" :multiple="isMultipleFileUploadAllowed" @closeDialog="closeUploadDialog"></upload>
        </section>
        <VersionRelatedList :id="form._id" :collectionName="'lookup_configuration'" title="Lookup configuration version"></VersionRelatedList>
        <LookupHistoryDataList v-if="isLookupDataVersion" :type="form.type" title="Lookup audit history" :key="reRenderTable"></LookupHistoryDataList>
    </el-main>
    </template>

    <script>
    import EventBus from "@/EventBus";
    import LookupConfigService from "@/idp/services/LookupConfigService";
    import LookupService from "@/idp/services/LookupService";
    import _ from "lodash";
    import SpreadSheet from "../../components/SpreadSheet.vue";
    import Upload from "../../components/Upload";
    import Constants from "@/resources/Constants";
    import VersionRelatedList from "@/idp/components/VersionRelatedList.vue";
    import LookupHistoryDataList from "@/idp/components/LookupHistoryDataList.vue";
    import CustomerService from "@/idp/services/CustomerService";
    import formMixin from "@/mixins/formMixin.js";

    export default {
        name: "LookupConfigForm",
        mixins: [formMixin],
        components: {
            SpreadSheet,
            Upload,
            VersionRelatedList,
            LookupHistoryDataList
        },
        computed: {
            fileUploadData() {
                return {
                    type: this.form.type,
                    // Including config record ID to verify user role access for updating records on the server
                    "record_id": this.form._id,
                    "isDataVersioning": this.isLookupDataVersion
                }
            }
        },
        data() {
            const validateLookupConfigLabel = (rule, value, callback) => {
                if (value && value.trim() === "") {
                    callback(new Error(`Please enter valid ${rule.field}`));
                } else {
                    callback();
                }
            };
            const validateLookupColumnLabel = (rule, value, callback) => {
                if (value && value.trim() === "") {
                    callback(new Error(`Please enter valid ${rule.field}`));
                } else {
                    if(_.find(this.form.columns, (column, index)=>{
                       return (column.label+'').toLowerCase().trim() == (value+'').toLowerCase().trim() && index!=this.editColumnDataIndex;
                })){
                    callback(new Error(`Label already exist.`));
                  }
                  else
                  {
                     callback();
                 }

                }
            };
            return {
                isLookupDataVersion: false,
                reRenderTable: 1,
                disableAddColumnButton:false,
                showUploadDialog: false,
                isMultipleFileUploadAllowed: false,
                showSpreadsheet: false,
                isEditMode: false,
                isSaveActionAllowed: true,
                savedUniqueColumns: [],
                form: {
                    active : true
                },
                lookupForm: {},
                disableSave: false,
                updateColumnDialogVisible: false,
                loading: false,
                options: [],
                fileUploadParameters: {
                    endpoint: Constants.LOOKUP_ENDPOINT,
                    title:"Upload lookup data",
                    valid_file_types:Constants.DOCEX.SPREADSHEET_VALID_FILETYPES
                },
                formRules: {
                    label: [{
                            validator: validateLookupConfigLabel,
                            trigger: "blur",
                        },
                        {
                            required: true,
                            message: "Please enter label",
                            trigger: "blur",
                        },
                    ],
                    name: [{
                            validator: validateLookupConfigLabel,
                            trigger: "blur",
                        },
                        {
                            required: true,
                            message: "Please enter name",
                            trigger: "blur",
                        },
                    ]
                },
                lookupFormRules: {
                    label: [{
                            validator: validateLookupColumnLabel,
                            trigger: "blur",
                        },
                        {
                            required: true,
                            message: "Please enter label",
                            trigger: "blur",
                        },
                    ],
                    // name: [{
                    //         validator: validateLookupColumnLabel,
                    //         trigger: "blur",
                    //     },
                    //     {
                    //         required: true,
                    //         message: "Please enter name",
                    //         trigger: "blur",
                    //     },
                    // ],
                    datatype: [{
                        required: true,
                        message: "Please select data type",
                        trigger: "change",
                    }, ]
                },
                displayUploadDialog: false,
                dataTypes: Constants.DOCEX.LOOKUP_DATATYPES,
                tableParams: {
                    title:`Lookup data`,
                    apiName: `/portal/api/table/lookup`,
                    aggregation: true,
                    columns: [],
                    rows: [],
                    select: [],
                    filters: true,
                    tableOverflow: true,
                    defaultColWidth: 150,
                    sortField:"-updated_at",
                    search: true,
                    sampleFileData:[],
                    addButtonConfig: {
                        event: "ADD_COLUMN_DIALOGUE_VISIBLE",
                        name: "Add colum",
                    },
                },
                editColumnDataIndex : null,
                addColumnDataIndex : null
            };
        },
        methods: {

            hasRowModified() {
                   if(!_.has(this.$refs,'spreadsheet.rowModifiedList')) return false;
                   let idList = Array.from(this.$refs.spreadsheet.rowModifiedList)
                   return !_.isEmpty(idList)
            },

            async handleColumnDelete(columnIndex){
                let column = _.map(columnIndex, index =>this.form.columns[index])
                let payload = {
                        type: this.form.type,
                        record:column,
                        action:'delete'
                }
                let response = await LookupConfigService.upsert(payload);
                if (!response || _.get(response, 'data.status') == false) {
                    this.notifyError(_.get(response, 'data.data.message') || "Error while deleting column(s)");
                    return;
                }
                this.notifySuccess("Selected column(s) deleted successfully")
                this.$set(this.tableParams, 'columns', response.data.data.columns)
                this.$set(this.form, 'columns', response.data.data.columns)
                this.addSampleFileHeaders()
               // this.reRenderSpreadsheet();
            },

            handleLookupLabel(){
                if(this.$route.query.id){return;}
                const type = (this.form["label"] || "").trim().replace(/[\s\.]/g, "_").toLowerCase();
                this.$set(this.form, 'type', type);
                if (type) {
                    this.$refs['form'].clearValidate(['type']);
                }
            },

            handleDeleteAll() {
                  this.$confirm(`Are you sure you want to delete all rows.`, 'Confirm', {
                        confirmButtonText: 'Confirm',
                        cancelButtonText: 'Cancel'
                  })
                  .then(async () => {
                        this.handleRowsDelete(null);
                  })
                  .catch(action => {
                   })
            },

            handleEditColumn(colIndex) {
                this.lookupForm = _.cloneDeep(this.form.columns[colIndex]);
                this.editColumnDataIndex = colIndex
                this.updateColumnDialogVisible = true;
            },

            async handleBulkUpload(){
                // Confirm dialog warns user that duplicate rows will get deleted
                await this.$confirm(
                    "Duplicate rows will get replaced if found.",
                    "Upload?", {
                        confirmButtonText: "Confirm",
                        cancelButtonText: "Cancel",
                        type: "warning"
                    }
                ).then(() => {
                    this.showUploadDialog = true;
                }).catch(() => {
                    return;
                })
            },

            async handleBulkDownload(){
                try {
                    //get here this.query from vue store which is store from spreadsheet component
                    const queryParam = this.$store.getters.getSpreadsheetQuery;
                    let sortColumnName = this.$store.getters.getSortColumnName
                    sortColumnName = sortColumnName ? sortColumnName : this.tableParams.sortField
                    let downloadLookupEndpoint = '/api/download-lookup'
                    // encodeURIComponent() encodes special characters in a URI for safe transmission. For example, you cannot send '&' directly in a query.
                    let endPoint =`${window.location.origin}` + downloadLookupEndpoint + `?exportCsv=true&query=${encodeURIComponent(JSON.stringify(queryParam))}&sort=${sortColumnName}`;
                    window.open(endPoint, "_self");
                } catch (err) {
                    this.notifyError(Constants.DATA_DOWNLOAD_ERROR);
                }
            },

            handleAddColumn(colIndex){
                if(colIndex>=0){
                    this.addColumnDataIndex = colIndex+1
                }
                this.updateColumnDialogVisible = true;
                this.lookupForm = {label:'', name:'', datatype:'', index:false};
                this.$nextTick(()=>{
                    this.$refs["lookupForm"] && this.$refs["lookupForm"].resetFields()
                })
            },

            async handleRowsDelete(idsToDelete = null) {
                try {
                    let payload = {
                        type: this.form.type,
                        // Including config record ID to verify user role access for updating records on the server
                        "record_id": this.form._id
                    }
                    idsToDelete ? payload.ids_to_delete = idsToDelete : null;
                    const lookupResponse = await LookupService.delete(payload)
                    if (!lookupResponse || !_.get(lookupResponse, "data.data.status")) {
                        this.notifyError(_.get(lookupResponse, "data.data.message", Constants.DATA_DELETE_ERROR));
                        return;
                    }
                    this.notifySuccess(Constants.DATA_DELETE_SUCCESS);
                    this.reRenderSpreadsheet()
                } catch (err) {
                    this.notifyError(Constants.DATA_DELETE_ERROR);
                }

            },

            handleLabelInput() {
                if(this.editColumnDataIndex!==null){return;}
                //Replace all special characters from label to form name
                const name = (this.lookupForm["label"] || "").trim().replace(/[ -\/:-@\[-\`{-~]/g, "_").toLowerCase();
                this.$set(this.lookupForm, 'name', name);
                if (name) {
                    this.$refs['lookupForm'].clearValidate(['name']);
                }
            },
            closeUploadDialog(shouldTableRefresh = false) {
                this.reRenderSpreadsheet();
                this.showUploadDialog = false
            },

            reRenderSpreadsheet() {
                this.showSpreadsheet = false
                this.reRenderTable++;
                this.$nextTick(() => {
                    this.showSpreadsheet = true;
                })
            },

            onBack() {
                return this.$router.push("/idp/lookup-config");
            },
            async updateLookupConfig() {
                try {
                    this.disableAddColumnButton = true;
                    let isValid = await this.$refs.lookupForm.validate().catch((error) => {});
                    if (!isValid) {
                        this.disableAddColumnButton = false;
                        return;
                    }
                    let payload = {
                        type: this.form.type,
                        record: _.cloneDeep(this.lookupForm)
                    }
                    payload.action  = this.editColumnDataIndex !== null ? 'update' : 'insert';
                    payload.index = this.addColumnDataIndex !== null ? this.addColumnDataIndex : 0
                    let response = await LookupConfigService.upsert(payload);
                    if (!response || _.get(response, 'data.status') == false) {
                        this.notifyError(_.get(response, 'data.data.message') || `Error while  ${payload.action == 'insert'?'inserting':'updating'} column`);
                        this.disableAddColumnButton = false;
                        return;
                    }
                    this.notifySuccess(`Column ${payload.action == 'insert'?'inserted':'updated'} successfully`);
                    this.$set(this.tableParams, 'columns', response.data.data.columns)
                    this.$set(this.form, 'columns', response.data.data.columns)
                    this.addSampleFileHeaders();
                    //pthis.reRenderSpreadsheet();
                    this.closeUpdateColumnDialog();
                } catch (error) {
                    this.notifyError("Error while displaying record");
                }
            },

            closeUpdateColumnDialog() {
                this.disableAddColumnButton = false;
                this.updateColumnDialogVisible = false;
                this.$refs["lookupForm"] && this.$refs["lookupForm"].resetFields();
                this.lookupForm = {};
                this.editColumnDataIndex = null;
                this.addColumnDataIndex = null;
            },
            async saveLookupConfig() {
                try {
                        if(this.hasRowModified()){
                               this.$notify({
                                title: "Warning",
                                type: "warning",
                                message: "Please save the spreadsheet data."
                            });
                            return;
                        }
                        this.disableSave = true;
                        let isValid = await this.$refs.form.validate().catch((error) => {});
                        if (!isValid) {
                            this.disableSave = false;
                            return;
                        }

                        // checking if saving unique columns configuration causes any duplicates
                        let payload = {
                            unique_columns: this.form.unique_columns,
                            type: this.form.type,
                        }
                        let duplicateDataRes = await LookupService.checkForDuplicateRecords(payload);
                        if (_.get(duplicateDataRes, 'queryResult.noOfDuplicates') > 0) {
                            this.disableSave = false;
                            // reset unique_columns to previous saved value if failed to save
                            this.form.unique_columns = this.savedUniqueColumns;
                            this.notifyError("Duplicate data already exists for selected unique columns");
                            return;
                        }

                        let res = await LookupConfigService.save(this.form)
                        this.disableSave = false;
                        if(res && _.get(res, 'data.code') == 11000)
                        {
                            this.notifyError("Lookup configuration with same label/type already exist.");
                            return
                        }
                        this.form = res;
                        this.$router.push("/idp/lookup-config");
                        this.notifySuccess("Records saved successfully");
                }
                catch(err) {
                    this.notifyError("Error while saving data.");
                }

            },

            registerEvents() {
                EventBus.$on("DELETE_SPREADSHEET_ROWS", (idsToDelete) => {
                    this.handleRowsDelete(idsToDelete)
                });

                EventBus.$on("DELETE_SPREADSHEET_COLUMNS", (columndIndexs) => {
                    this.handleColumnDelete(columndIndexs)
                });


                EventBus.$on("UPSERT_DATA", (rowData) => {
                    this.upsertData(rowData)
                });

                EventBus.$on("ADD_COLUMN", () => {
                    this.handleAddColumn()
                });

                EventBus.$on("DELETE_ALL", () => {
                    this.handleDeleteAll()
                });

                EventBus.$on("BULK_UPLOAD", () => {
                    this.handleBulkUpload()
                });
                EventBus.$on("BULK_DOWNLOAD", () => {
                    this.handleBulkDownload()
                });
            },

            async init(recordId) {
                try {
                    let data = await LookupConfigService.fetchById(recordId);
                    this.form = Object.assign({}, this.form, data);
                    this.tableParams["columns"] = this.form["columns"];
                    this.tableParams["query"] = {__type:this.form.type };
                    const [customerConfiguration] = await CustomerService.getCustomerConfiguration({selectColumns: "lookupConfig"});
                    this.isLookupDataVersion = _.get(customerConfiguration, "enable_lookup_history", []).includes(this.form.type);
                    this.addSampleFileHeaders();
                    this.showSpreadsheet = true;
                    this.savedUniqueColumns=_.get(this.form, 'unique_columns', []);
                } catch (error) {
                    this.notifyError("Error while displaying record");
                }
                this.loading = false;
            },

            addSampleFileHeaders(){
                    let sampleFileData = []
                    if(_.isEmpty(this.form["columns"])){
                        this.$set(this.tableParams, 'sampleFileData', null);
                        return;
                    }
                    let headerObj = _.map(this.form["columns"], column=>column.label).reduce((obj, key) => Object.assign(obj, {[key]: ""}), {});
                    sampleFileData.push(headerObj);
                    this.$set(this.tableParams, 'sampleFileData', sampleFileData);
            },

            async upsertData(rowData) {
                _.each(rowData, (item, index) => {
                    if (item["_id"] == "") {
                        delete item["_id"]
                    }
                })
                let res = await LookupService.upsert({
                    "type":this.form.type,
                    "records": rowData,
                    // Including config record ID to verify user role access for updating records on the server
                    "record_id": this.form._id,
                    "isDataVersioning": this.isLookupDataVersion
                });
                if (!res || _.get(res, 'data.data.status') == false) {
                    this.notifyError(_.get(res, 'data.data.message') || "Error while updating record");
                    return;
                }

                if (_.get(res, 'data.data.modifiedCount')>0) {
                    // Notify duplicate columns replaced
                    this.notifySuccess("Records saved successfully. Duplicate records replaced");
                }
                else {
                    this.notifySuccess("Records saved successfully")
                }
                this.reRenderSpreadsheet();
            }

        },
        beforeDestroy() {
            EventBus.$off(["DELETE_SPREADSHEET_ROWS","DELETE_SPREADSHEET_COLUMNS", "UPSERT_DATA", "BULK_UPLOAD", "DELETE_ALL", "ADD_COLUMN"])
            this.$store.commit('setSortColumnForLookup','');
        },

        beforeRouteLeave: function (to, from, next) {
            if (this.hasRowModified()) {
                    this.$confirm(
                    `Changes you made may not be saved.`,
                    "Leave page?", {
                        confirmButtonText: "Confirm",
                        cancelButtonText: "Cancel",
                        type: "warning"
                    }
                ).
                then(() => {
                        next();
                    })
                    .catch((err) => {
                        next(false)
                    })
            } else {
                return next();
            }
        },

        async beforeMount() {
            this.isSaveActionAllowed = await this.isSaveActionPermitted('lookup_configuration');
            let recordId = this.$route.query.id;
            if (!recordId) return;
            this.loading = true;
            this.isEditMode = true;
            await this.init(recordId);
            this.registerEvents();
            this.$store.commit("setDisplayIdpTree",false);
            this.$store.commit("setDisplayIdpNavbar",true);
        },
    };
    </script>

    <style lang="scss">
    @import "../_idpGlobal";

    .lookup-config-wrap {
         padding:0;
        .el-dialog {
            padding:0;
        }
         .el-dialog__header {
                display: block;
                    padding: 1rem 2eem;
                    .el-dialog__title {
                        font-size: 1.286rem;
                        margin: 0;
                        color: rgba(45, 55, 72, 1);
                        display: inline-block;
                        font-weight: normal;
                        margin-right: 1rem;
                    }
                    .el-dialog__headerbtn {
                        top: 14px;
                    }
            }
              .el-dialog__body {
                    padding:0 !important;
                    .inner-body {
                        padding:1.5rem !important;
                    }
              }
               #add-user-footer {
                   padding: 1.2rem 1.8rem !important;
                       border-top: .5px solid #E4E7ED;
                       text-align: right;
                       .dialog-footer {
                               display: flex;
                                justify-content: flex-end;

                                 div:first-child {
                                    margin-left: 0;
                                    margin-right: auto;
                                }
                                .file-uploads {
                                    background: rgba(90, 103, 216, 1);
                                    color: #ffffff;
                                    padding: 3px 13px;
                                    border: 1px solid #5f8fdf;
                                    margin-left: 0;
                                    margin-right: auto;
                                    display: inline-block;
                                    margin-right: 10px;
                                    border-radius: 3px;
                                    label {
                                        cursor: pointer;
                                    }
                            }
                            #upload-file {
                                font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                                white-space: unset;
                                display: flex;
                                padding: 5px 13px;
                                font-size: 1rem;
                                background: rgba(90, 103, 216, 1);
                            }
                       }

            } // footer
    } // lookup dialog


    .lookup-wrap {
        margin-top: var(--space-space);
        // overflow: auto;
    }

    .lookup-wrap::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px var(--dark-06);
        background-color: var(--white) !important;
    }

    .lookup-wrap::-webkit-scrollbar {
        width: 6px !important;
        height: 14px;
        background-color: var(--white) !important;
    }

    .lookup-wrap::-webkit-scrollbar-thumb {
        background-color: var(--dark-05) !important;
    }

    .jexcel,
    .jexcel td,
    .jexcel_corner {
        // background: var(--dark-10);
        background: var(--dark-09);
    }

    .jexcel>thead>tr>td {
        background-color: var(--dark-10) !important;
        color: var(--dark-01);
        border-top: 1px solid var(--dark-08);
        border-left: 1px solid var(--dark-08);
    }

    .jexcel>tbody>tr>td:first-child {
        background-color: var(--dark-10) !important;
        color: var(--dark-01);
    }

    .jexcel>tbody>tr>td {
        color: var(--dark-02);
    }

    .jexcel_search {
        background: var(--dark-10);
        border: 0;
        height: 2rem;
        width: 16rem;
        color: var(--dark-02);
        border-radius: var(--radius-sm);
        font-size: var(--font-sm);
        padding: 0 0.5rem;
    }

    .jexcel_pagination>div>div {
        text-align: center;
        width: 28px !important;
        height: 28px !important;
        line-height: 27px !important;
        border: 1px solid var(--dark-09);
        box-sizing: border-box;
        margin-left: 2px;
        border-radius: 3px;
        cursor: pointer;
    }

    .jexcel_page_selected {
        background-color: var(--dark-10) !important;
    }
    .lookup-config-form-container{
        .page-title-text {
            font-style: normal;
            font-weight: 600;
            font-size: var(--font-lg);
            line-height: 27px;
            color: var(--dark-03);
            margin: 0;
            position: sticky;
            left: 0;
            top: 34px;
            display:inline-block;
            margin-right:3rem;
        }
        .form-horizontal .el-textarea .el-textarea__inner, .kp-form-group .el-textarea .el-textarea__inner {
            height: 10rem;
        }

    }

    .jexcel_content {}

    .jexcel_content::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px var(--dark-06);
        background-color: var(--white) !important;
    }

    .jexcel_content::-webkit-scrollbar {
        width: 6px !important;
        height: 12px;
        background-color: var(--white) !important;
    }

    .jexcel_content::-webkit-scrollbar-thumb {
        background-color: var(--dark-05) !important;
    }

    // .jexcel_pagination {
    //     display: unset !important;
    // }
    // .jexcel_pagination > div {
    //   display: inline-block !important;
    // }
    .jexcel_pagination {
        position: relative;
    }

    .jexcel_pagination>div:last-child {
        padding-right: 10px;
        padding-top: 10px;
        position: sticky;
        bottom: 0;
        right: 0;
    }

    .jexcel_pagination>div:first-child {
        position: sticky;
        top: 0;
        left: 0;
    }

    .jexcel_filter>div:last-child {
        position: sticky;
        top: 0;
        right: 0;
    }

    // .form-page-container {
    //   .script-container {
    //     display: flex;

    //     .select-box-container {
    //       .el-form-item__content {
    //         margin-left: 0px !important;
    //       }
    //     }
    //   }
    // }
    // .lookup-config {
    //   padding: 0px !important;
    // }

    </style>
