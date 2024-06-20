<template>
<el-main class="kp-main">
    <ConnectionLogsDialog :isDialogVisible="isDialogVisible" @onCancelClick="isDialogVisible=false"> </ConnectionLogsDialog>

    <section class="page-body" v-loading="loading">

        <div class="page-title">
            <el-button cid="form-header-back" v-on:click="$router.push('/idp/customer-storage')" icon="mdi mdi-arrow-left-circle-outline"></el-button>
            <span class="page-title-text">Storage</span>
            <span>Add new storage and edit existing</span>
        </div>

        <section class="form-page-container">

            <div class="panel">
                <div class="panel-body">
                    <el-form label-position="left" :model="form" :rules="formRules" ref="form" label-width="120px">
                        <ConfirmModel ref="model"></ConfirmModel>
                        <!-- basic content -->
                        <div class="grouping-tile">General  configuration</div>
                        <el-row :gutter="40">
                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="type" label="Type">
                                        <el-select clearable cid="storage-type-select" filterable v-model="form.type" v-on:change="onTypeChange" placeholder="Select">
                                            <el-option v-for="(value,index) in customer_storage" :cid="'storage-type_'+index" :key="value.value" :value="value.value" :label="value.label"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </el-col>
                        
                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="name" label="Name">
                                        <el-input cid="storage-name" class="name-input" prop="name" v-model="form.name" placeholder="Provide storage name..."></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>

                        </el-row>

                        <el-row :gutter="40" v-if="form.type=='aws'">
                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="access_key" label="Access key">
                                        <el-input cid="storage-access-key" class="host-input" prop="key" v-model="form.access_key" placeholder="Provide access key..."></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="secret_access_key" label="Secret Access Key">
                                        <el-input cid="storage-secret-access-key" class="port-input" prop="secret_access_key_input" v-model="form.secret_access_key" placeholder="Provide Secret Access Key..."></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>

                        <el-row :gutter="40" v-if="form.type=='ftp'">
                            <el-col :span="12">
                                <div class="kp-form-group">

                                    <el-form-item prop="host" label="Host">
                                        <el-input cid="storage-host" class="host-input" prop="host" v-model="form.host" placeholder="Provide host..."></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                       
                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="port" label="Port">
                                        <el-input cid="storage-port" class="port-input" prop="post" type="number" v-model="form.port" placeholder="Provide port..."></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                     
                        <el-row :gutter="40" v-if="form.type=='azure'">
                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="account_name" label="Account Name">
                                        <el-input cid="storage-account-name" class="port-input" prop="account_name" v-model="form.account_name" placeholder="Provide Account Name..."></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        
                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="account_key" label="Account Key">
                                        <el-input cid="storage-account-key" class="port-input" prop="account_key" v-model="form.account_key" placeholder="Provide Account Key..."></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>

                        </el-row>
                        <el-row :gutter="40" v-if="form.type=='azure'">
                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="share_name" label="Share Name">
                                        <el-input cid="storage-share-name" class="port-input" prop="share_name" v-model="form.share_name" placeholder="Provide Share name..."></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>

                        </el-row>
                        <el-row :gutter="40" v-if="form.type=='sharepoint'">
                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="site_url" label="Site url">
                                        <el-input cid="storage-site-url" class="port-input" prop="site_url" v-model="form.site_url" placeholder="Provide site url..."></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>

                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="auth_type" label="Authorization Type">
                                        <el-select cid="storage-form-auth-type-select" clearable filterable v-model="form.auth_type" placeholder="Select">
                                            <el-option v-for="(value,index) in auth_type_list"  :cid="'storage-form-auth-type_'+index" :key="value.value" :value="value.value" :label="value.label"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </el-col>

                        </el-row>
                        <el-row :gutter="40" v-if="form.type=='google_drive'">
                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="client_email" label="Client Email">
                                        <el-input cid="storage-client-email" class="port-input" prop="client_email" v-model="form.client_email" placeholder="Provide Client Email"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>

                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="project_id" label="Project ID">
                                        <el-input cid="storage-project-id" class="port-input" prop="project_id" v-model="form.project_id" placeholder="Provide Project ID"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>

                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="private_key_id" label="Private Key ID">
                                        <el-input cid="storage-private-key-id" class="port-input" prop="private_key_id" v-model="form.private_key_id" placeholder="Provide Private Key ID"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>

                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="client_id" label="Client ID">
                                        <el-input cid="storage-client-id" class="port-input" prop="client_id" v-model="form.client_id" placeholder="Provide Client ID"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>

                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="client_x509_cert_url">
                                        <span slot="label">
                                            Client Cert URL
                                            <el-tooltip
                                                content="Client X509 Cert URL"
                                                placement="top"
                                                effect="light"
                                            >
                                            <span class="mdi mdi-information-outline"></span>
                                            </el-tooltip>
                                        </span>
                                        <el-input cid="storage-client-x509-cert-url" class="port-input" prop="client_x509_cert_url" v-model="form.client_x509_cert_url" placeholder="Provide Client Cert URL"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>

                        </el-row>
                        <el-row :gutter="40" v-if="form.type=='sharepoint' && form.auth_type=='oauth2'">
                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="tenant_id" label="Tenant Id">
                                        <el-input cid="storage-form-tenant-id" class="tenant_id-input" prop="tenant_id" v-model="form.tenant_id" placeholder="Provide tenant id..."></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>

                        </el-row>

                        <el-row :gutter="180" v-if="form.type=='sharepoint' && form.auth_type=='oauth2'">
                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="client_id" label="Client Id">
                                        <el-input cid="storage-form-client-id" class="client_id-input" prop="client_id" v-model="form.client_id" placeholder="Provide client id..."></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>

                      
                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="client_secret" label="Client secret">
                                        <el-input cid="storage-form-client-secret" type="password" class="client_secret-input" prop="client_secret" v-model="form.client_secret" placeholder="Provide client secret..."></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>

                        <el-row :gutter="40" v-if="['sharepoint','ftp'].includes(form.type)">
                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="username" label="Username">
                                        <el-input cid="storage-form-username" class="port-input" prop="username" v-model="form.username" placeholder="Provide Username..."></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>

                        </el-row>
                        <el-row :gutter="40" v-if="['sharepoint','ftp'].includes(form.type) && form.auth_type!='oauth2'">
                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="password" label="Password">
                                        <el-input cid="storage-form-password" class="port-input" prop="password" type="password" v-model="form.password" placeholder="Provide Password..."></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>

                      
                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="password_expiration_duration" label="Password expiration time">
                                        <el-input cid="storage-form-password-expiration-duration" type="number" v-model="form.password_expiration_duration" placeholder="Days"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>


                        <el-row :gutter="40">
                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="storage_type" label="Storage type">
                                        <el-select clearable cid="storage-type-select" filterable v-model="form.storage_type" v-on:change="onStorageTypeChange" placeholder="Select">
                                            <el-option v-for="(value,index) in storage_type" :cid="'storage-type_'+index" :key="value.value" :value="value.value" :label="value.label"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>

                        <el-row :gutter="40">
                            <el-col :span="24">
                                <div class="kp-form-group">
                                <el-form-item
                                    class="kp-form-field-label code-mirror"
                                    prop="script"
                                    label="Storage path processor"
                                >
                                    <!-- <codemirror
                                    cid="storage-form-script"
                                    :value="form.script"
                                    v-model="form.script"
                                    :options="editorOptions"
                                    ></codemirror> -->

                                    <KanverseEditor
                                        :options="{ 'width': '100%', 'height': '500px', 'language': 'businessRule' }"  
                                        :content="form.script" 
                                        :refreshModel="form._id !== undefined"
                                        v-model="form.script" 
                                        @onDidChangeModelContent="handleContentChange">
                                    </KanverseEditor>
                                </el-form-item>
                                </div>
                            </el-col>
                        </el-row>

               

                        <!-- </div> -->
                    </el-form>
                </div> <!-- | panel body -->
                <footer>
                    <div>
                    </div>
                    <div v-if="this.$route.query.id">
                        <TestConnectionButton :recordId="this.$route.query.id" :connectionType="'storage'" @testConnectionRequested="isDialogVisible=true"></TestConnectionButton>
                    </div>
                    <div>
                        <el-button size="small" cid="storage-form-cancel" v-on:click="$router.push('/idp/customer-storage')">Cancel</el-button>
                    </div>
                    <div>
                        <el-button v-if="isSaveActionAllowed" size="small" cid="storage-form-submit" type="primary" v-on:click="save">Submit</el-button>
                    </div>
                </footer>
            </div> <!-- | panel -->

        </section> <!-- | form-page-container -->

    </section>
 <VersionRelatedList v-if="showVersionList" :id="form._id"  title="Storage versions"></VersionRelatedList>
</el-main>
</template>

<script>
import Constants from "@/resources/Constants";
import navigation from "@/mixins/navigation.js";
import $ from "jquery";
import StorageService from "@/idp/services/StorageService";
import ConfirmModel from "@/components/ConfirmModel";
import EventBus from "@/EventBus";
import Codemirror from "@/components/Codemirror.vue";
import VersionRelatedList from "@/idp/components/VersionRelatedList.vue";
import TestConnectionButton from "@/idp/components/TestConnectionButton.vue";
import ConnectionLogsDialog from "@/idp/components/ConnectionLogsDialog.vue";
import KanverseEditor from "@/components/KanverseEditor";
import Validator from "@/services/Validator";
const lodash = require("lodash");
import formMixin from "@/mixins/formMixin.js";

export default {
    name: "StorageForm",
    mixins: [formMixin],
    components: {
        ConfirmModel,
        Codemirror,
        VersionRelatedList,
        TestConnectionButton,
        ConnectionLogsDialog,
        KanverseEditor,
    },
    data() {
        var EmptyValueValidator = (rule, value, callback) => {
            if (value && ("" + value).trim() === "") {
                callback(new Error("Please enter valid label name"));
            } else {
                callback();
            }
        };
        return {
            pageTitle: "input channel",
            editorOptions: {
                mode: "text/javascript",
                theme: "default",
            },
            loading:false,
            isDialogVisible: false,
            isSaveActionAllowed: true,
            form: {
                name: "",
                type: "",
                access_key: "",
                secret_access_key: "",
                account_name: "",
                account_key: "",
                file_path: "",
                share_name: "",
                username: "",
                password: "",
                site_url: "",
                old_password:"",
                script: ["(async()=>{", "\t__logInfo('Welcome !!!')", "})()"].join("\n"),


            },
            cacheDataModal: {
                cachedForm: {},
                isFormEdited: false,
                isInitialized: false,
            },

            customer_storage: Constants.DOCEX.CUSTOMER_STORAGE,
            auth_type_list: Constants.DOCEX.AUTH_TYPE,
            storage_type : Constants.DOCEX.STORAGE_TYPE,
            showVersionList:true,
            formRules: {
                name: [{
                        validator: EmptyValueValidator,
                        trigger: "blur",
                        message: "Please provide storage name",
                    },
                    {
                        required: true,
                        message: "Please provide storage name",
                        trigger: "blur",
                    },
                ],

                type: [{
                        validator: EmptyValueValidator,
                        trigger: "blur",
                        message: "Please provide type",
                    },
                    {
                        required: true,
                        message: "Please provide storage type",
                        trigger: "blur",
                    },
                ],
                storage_type: [{
                        validator: EmptyValueValidator,
                        trigger: "blur",
                        message: "Please provide type",
                    },
                    {
                        required: true,
                        message: "Please provide storage type",
                        trigger: "blur",
                    },
                ],

                access_key: [{
                        validator: EmptyValueValidator,
                        trigger: "blur",
                        message: "Please provide access key",
                    },
                    {
                        required: true,
                        message: "Please provide access key",
                        trigger: "blur",
                    },
                ],
                secret_access_key: [{
                        validator: EmptyValueValidator,
                        trigger: "blur",
                        message: "Please provide secret access key",
                    },
                    {
                        required: true,
                        message: "Please provide secret access key",
                        trigger: "blur",
                    },
                ],
                upload_file_on: [{
                        validator: EmptyValueValidator,
                        trigger: "blur",
                        message: "Please select an option",
                    },
                    {
                        required: true,
                        message: "Please select an option",
                        trigger: "blur",
                    },
                ],

                advanced_script: [
                    {
                        validator: Validator.scriptValidator,
                        trigger: "blur",
                        message: "Syntax errors found.", // This message replaced with actual sytanx error 
                    },
                    {
                        required: true,
                        message: "Script cannot be empty",
                        trigger: "blur",
                    },
                ],
                script: [{
                        validator: EmptyValueValidator,
                        trigger: "blur",
                        message: "Please provide script",
                    },
                    {
                        required: true,
                        message: "Please provide script",
                        trigger: "blur"
                    },
                ],
                host : [{
                        validator: EmptyValueValidator,
                        trigger: "blur",
                        message: "Please provide host",
                    },
                    {
                        required: true,
                        message: "Please provide host",
                        trigger: "blur"
                    },
                ],
                port: [{
                        validator: EmptyValueValidator,
                        trigger: "blur",
                        message: "Please provide port",
                    },
                    {
                        required: true,
                        message: "Please provide port",
                        trigger: "blur"
                    },
                ],
                share_name: [{
                        validator: EmptyValueValidator,
                        trigger: "blur",
                        message: "Please provide azure share name",
                    },
                    {
                        required: true,
                        message: "Please provide azure share name",
                        trigger: "blur"
                    },
                ],
                account_name: [{
                        validator: EmptyValueValidator,
                        trigger: "blur",
                        message: "Please provide azure name",
                    },
                    {
                        required: true,
                        message: "Please provide azure name",
                        trigger: "blur"
                    },
                ],
                account_key: [{
                        validator: EmptyValueValidator,
                        trigger: "blur",
                        message: "Please provide azure account key",
                    },
                    {
                        required: true,
                        message: "Please provide azure account key",
                        trigger: "blur"
                    },
                ],
                username: [{
                        validator: EmptyValueValidator,
                        trigger: "blur",
                        message: "Please provide username",
                    },
                    {
                        required: true,
                        message: "Please provide username",
                        trigger: "blur"
                    },
                ],
                password: [{
                        validator: EmptyValueValidator,
                        trigger: "blur",
                        message: "Please provide password",
                    },
                    {
                        required: true,
                        message: "Please provide password",
                        trigger: "blur"
                    },
                ],
                site_url: [{
                        validator: EmptyValueValidator,
                        trigger: "blur",
                        message: "Please provide site url",
                    },
                    {
                        required: true,
                        message: "Please provide site url",
                        trigger: "blur"
                    },
                ],
                client_id: [{
                        validator: EmptyValueValidator,
                        trigger: "blur",
                        message: "Please provide client id",
                    },
                    {
                        required: true,
                        message: "Please provide client id",
                        trigger: "blur",
                    },
                ],
                tenant_id: [{
                        validator: EmptyValueValidator,
                        trigger: "blur",
                        message: "Please provide tenan id",
                    },
                    {
                        required: true,
                        message: "Please provide Please tenan id",
                        trigger: "blur",
                    }
                ],
                client_secret: [{
                        validator: EmptyValueValidator,
                        trigger: "blur",
                        message: "Please provide client secret",
                    },
                    {
                        required: true,
                        message: "Please provide client secret",
                        trigger: "blur",
                    }
                ],
                auth_type: [{
                        validator: EmptyValueValidator,
                        trigger: "blur",
                        message: "Please provide authorization type",
                    },
                    {
                        required: true,
                        message: "Please provide authorization type",
                        trigger: "blur",
                    }
                ],
                project_id: [{
                        validator: EmptyValueValidator,
                        trigger: "blur",
                        message: "Please provide project id",
                    },
                    {
                        required: true,
                        message: "Please provide project id",
                        trigger: "blur",
                    }
                ],
                private_key_id: [{
                        validator: EmptyValueValidator,
                        trigger: "blur",
                        message: "Please provide private key id",
                    },
                    {
                        required: true,
                        message: "Please provide private key id",
                        trigger: "blur",
                    }
                ],
                private_key: [{
                        validator: EmptyValueValidator,
                        trigger: "blur",
                        message: "Please provide private key",
                    },
                    {
                        required: true,
                        message: "Please provide private key",
                        trigger: "blur",
                    }
                ],
                client_email: [{
                        validator: EmptyValueValidator,
                        trigger: "blur",
                        message: "Please provide client email",
                    },
                    {
                        required: true,
                        message: "Please provide client email",
                        trigger: "blur",
                    }
                ],
                client_x509_cert_url: [{
                        validator: EmptyValueValidator,
                        trigger: "blur",
                        message: "Please provide client cert url",
                    },
                    {
                        required: true,
                        message: "Please provide client cert url",
                        trigger: "blur",
                    }
                ],

            },
        };
    },
    watch: {
        form: {
            handler(newVal, oldVal) {
                if (this.cacheDataModal.isInitialized) {
                    this.cacheDataModal.isFormEdited =
                        JSON.stringify(this.cacheDataModal.cachedForm) !=
                        JSON.stringify(this.form);
                }
            },
            deep: true,
        },
    },
    methods: {
        onStorageTypeChange(){},
        async init(recordId) {
            this.loading = true;
            if (!recordId) {
                this.cacheDataModal.isInitialized = true;
                this.cacheDataModal.isFormEdited = false;
                this.cacheDataModal.cachedForm = {
                    ...this.form,
                };
                this.loading = false;
                return;
            }
            try {
                let storage = await StorageService.fetchById(recordId);
                this.form = Object.assign({}, this.form, storage);
                this.form.old_password = this.form.password;
                this.cacheDataModal.isInitialized = true;
                this.cacheDataModal.isFormEdited = false;
                this.cacheDataModal.cachedForm = {
                    ...this.form,
                };
                this.loading = false;
            } catch (error) {
                this.notifyError("Error");
                this.loading = false;
            }
        },
        handleContentChange(event, content){
            this.form.script = content;
        },
        async save() {
            if (!this.form.script) {
                this.form.script = ["(async()=>{", "\t__logInfo('Welcome !!!')", "})()"].join("\n");
            }
            let valid = await this.$refs.form.validate().catch((error) => {
                // this.notifyError(error);
            });
            if (!valid) {
                return;
            }
            return this.insertRecord();

        },

        insertRecord() {
            this.cacheDataModal.isFormEdited = false;
            StorageService.save(this.form)
                .then((response) => {
                    if (
                        _.get(response, "data.name") == "MongoError" &&
                        _.get(response, "data.errmsg").includes("duplicate key")
                    ) {
                        return this.notifyError("Storage name is already present. ");
                    }
                    if (response.status == 200 || response.status == 201) {
                        this.notifySuccess("Record saved successfully");
                        this.cacheDataModal.isFormEdited = false;
                        this.$router.push({
                            path: "/idp/customer-storage",
                        });
                        return;
                    }
                    this.notifyError("Something went wrong.");
                })
                .catch((error) => {
                    this.notifyError("Error while processing");
                });
        },

        // addFormRules() {
        //     let rules = {};
        //     _.each(this.fields_message_mapping, (message, field) => {
        //         let ruleArr = [];
        //         ruleArr.push({
        //             validator: this.EmptyValueValidator,
        //             trigger: "blur",
        //             message: message,
        //         });
        //         ruleArr.push({
        //             required: true,
        //             message: message,
        //             trigger: "blur",
        //         });
        //         rules[field] = ruleArr;
        //     });
        //     this.rules = rules;
        // },
        onTypeChange() {
            let form = this.form
            this.form = {}

            this.$set(this.form, "name", form.name);
            this.$set(this.form, "file_path", form.file_path);
            this.$set(this.form, "type", form.type);
            form._id && this.$set(this.form, "_id", form._id);
        }
    },
    async beforeMount() {
        this.isSaveActionAllowed = await this.isSaveActionPermitted('de_storage_configuration');
        this.$store.commit("setDisplayIdpTree",false);
        this.$store.commit("setDisplayIdpNavbar",true);
        let recordId = this.$route.query.id;
        // this.addFormRules();

        this.init(recordId);

        window.addEventListener("beforeunload", (event) => {
            if (!this.cacheDataModal.isFormEdited) return;
            event.preventDefault();
            event.returnValue = "";
        });
    },

    beforeRouteLeave: function (to, from, next) {
        if (this.cacheDataModal.isFormEdited) {
            //    return window.confirm('Do you really want to leave? you have unsaved changes!')
            return this.$refs.model.open(next);
        } else {
            return next();
        }
    },
};
</script>

<style lang="scss">
@import "../_idpGlobal";
</style>
