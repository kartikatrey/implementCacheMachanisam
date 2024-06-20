<template>
    <el-main class="kp-main">
        <ConnectionLogsDialog ref="connectionLogsDialogRef" :isDialogVisible="isDialogVisible" :logLoader="logLoader" :uploadProgress="uploadProgress" :loaderIndex="loaderIndex" @onCancelClick="isDialogVisible=false"> </ConnectionLogsDialog>
        <section class="page-body">
            <div class="page-title">
                <el-button cid="form-header-back" v-on:click="$router.push('/idp/model')"
                    icon="mdi mdi-arrow-left-circle-outline"></el-button>
                <span class="page-title-text">{{ pageTitle }}</span>
                <span>Add new model or edit existing</span>
            </div>

            <section class="form-page-container">
                <div class="panel">
                    <div class="panel-body">
                        <el-form label-position="left" :model="form" :rules="formRules" ref="form" label-width="120px" v-loading="loader">
                            <ConfirmModel ref="model"></ConfirmModel>
                            <!-- basic content -->

                            <div class="grouping-tile">General configuration</div>

                            <el-row :gutter="40">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="model_name" label="Model Name">
                                            <el-input v-model="form.model_name" cid="ks-model-form-model-name"
                                                placeholder="Provide model name..."></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="serving_method" label="Serving Method">
                                            <el-select cid="ks-model-form-serving-method" v-model="form.serving_method" @change="handleTypeChange" placeholder="Select Serving Method" :disabled="$route.query.id">
                                                <el-option v-for="(item,index) in servingMethodOptions" :cid="'model_serving_method_'+index" :key="item.value" :value="item.value" :label="item.label"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>

                            <el-row :gutter="40">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item label="Description">
                                            <el-input v-model="form.usecase" cid="ks-model-form-usecase" type="textarea"
                                                placeholder="Provide usecase..."></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="doc_type" label="Document Type">
                                            <el-select cid="ks-model-form-doc-type" v-model="form.doc_type" @change="handleTypeChange" placeholder="Select Document Type">
                                                <el-option v-for="(item,index) in docTypes" :cid="'model_Doc_Type'+index" :key="item.value" :value="item.value" :label="item.label"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </el-col>       
                            </el-row>

                            <el-row :gutter="40">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="is_file_type_excel" label="File Type Excel">
                                            <el-checkbox v-model="form.is_file_type_excel" :true-value="true" :false-value="false" @change="handleTypeChange"></el-checkbox> 
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="model_subtype" label="Model Type">
                                            <el-select cid="ks-model-form-model-subtype" v-model="form.model_subtype" placeholder="Select Model Type">
                                                <el-option v-for="(item,index) in modelTypes" :cid="'form.model_subtype_'+index" :key="item.value" :value="item.value" :label="item.label"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row :gutter="40">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="domain" label="Domain" v-if="form.serving_method=='tensorflow'">
                                            <el-input v-model="form.domain" cid="ks-model-form-domain"
                                                placeholder="Provide domain ..."></el-input>
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
                            <el-button size="small" cid="ks-model-form-cancel" v-on:click="$router.push('/idp/model')">Cancel</el-button>
                        </div>
                        <div v-if="$route.query.id">
                            <el-button size="small" type="primary" cid="ks-model-form-move-mode" v-on:click=restoreModel>Restore</el-button>
                        </div>
                        <div v-if="$route.query.id">
                            <el-dropdown size="small" type="primary" @command="moveModel">
                                <el-button size="small" type="primary">
                                    Move Model<i class="el-icon-arrow-down el-icon--right"></i>
                                </el-button>
                                <el-dropdown-menu size="small" slot="dropdown">
                                    <el-dropdown-item 
                                        v-for="env in envList" 
                                        :key="env.label" 
                                        :command="env.value">
                                        {{ env.label }}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                        <div>
                            <el-button size="small" type="primary" cid="ks-model-form-deploy" @click="showUploadModal('deploy')">Deploy</el-button>
                        </div>
                        <div>
                            <el-button size="small" type="primary" cid="ks-model-form-submit" :disabled="saveClicked" v-on:click="save">Submit</el-button>
                        </div>
                    </footer>
                    <upload v-if="showModal"
                        :isModelFile=true
                        :parameters="fileUploadParameters"
                        :data="uploadParams"
                        :accept="getValidFileTypes"
                        :dialogShow.sync="showModal"
                        :openLogDialogEventName="openLogDialogEventName"
                        @closeDialog="showModal=false"
                    ></upload>
                </div>
                <!-- | panel -->
            </section>
            <!-- | form-page-container -->
        </section>
        <VersionRelatedList v-if="showVersionList" :id="form._id"  title="Model versions"></VersionRelatedList>
    </el-main>
</template>

<script>
const _ = require("lodash");
import Constants from "@/resources/Constants";
import EventBus from "@/EventBus";
import Upload from "@/components/Upload";
import ConfirmModel from "@/components/ConfirmModel";
import KsModelService from "@/idp/services/KsModelService";
import VersionRelatedList from "@/idp/components/VersionRelatedList.vue";
import ConnectionLogsDialog from "@/idp/components/ConnectionLogsDialog.vue";
import CustomerConfig from "@/idp/services/DeCustomerConfig";

export default {
    name: "KsModelForm",
    components: { ConfirmModel, Upload, ConnectionLogsDialog, VersionRelatedList },
    data() {
        var EmptyValueValidator = (rule, value, callback) => {
            if (value && ("" + value).trim() === "") {
                callback(new Error("Please enter valid label name"));
            } else {
                callback();
            }
        };
        return {
            pageTitle: "Model",
            showModal: false,
            showVersionList: true,
            isDialogVisible: false,
            uploadParams: {},
            model_request: "",
            fileUploadParameters: {
                endpoint: "/portal/api/deploy/model",
                title: "Upload",
                valid_file_types: ["application/zip", "application/x-zip-compressed"]
            },
            logLoader: false,
            uploadProgress: 0,
            loaderIndex: 0,
            loader: false,
            saveClicked: false,
            documentTypeMap: {
                INVOICE: 'DOCEX',
                PO: 'DOCEX',
                QUOTE: 'INSURANCE',
                INSURANCE: 'INSURANCE',
                CLAIM_IMAGE: 'CLAIM',
                SERVICE_CONTRACT: 'SQUAD',
                SOV: 'INSURANCE',
                INSURANCE_QUOTATION: 'EXCEL'
            },
            form: {
                domain: "",
                model_name: "",
                model_subtype: "",
                model_type: "",
                usecase: "",
                serving_method: "",
                controller: "",
                subtype: "",
                tf_host: "",
                model_url: "",
                doc_type: "",
                config: {
                    model_path: ""
                },
                is_file_type_excel: false
            },
            openLogDialogEventName: "ks_model_form",
            docTypes: [],
            servingMethodOptions: [
                {
                    label: "Pytorch",
                    value: "pytorch"
                },
                {
                    label: "Tensorflow",
                    value: "tensorflow"
                }
            ],
            modelTypes: [],
            envList: [],
            moveModelEnvs: {
                "DEV": [{label: "QA", value:"VM1"}],
                "QA": [{label: "TEST", value:"VM1"}],
                "TEST": [{label: "VM1", value: "VM1"}, {label: "VM2", value: "VM2"}]
            },
            formRules: {
                model_name: [
                    {
                        validator: EmptyValueValidator,
                        trigger: "blur",
                        message: "Please provide model name",
                    },
                    {
                        required: true,
                        message: "Please provide model name",
                        trigger: "blur",
                    }
                ],
                serving_method: [
                    {
                        validator: EmptyValueValidator,
                        trigger: "blur",
                        message: "Please select serving method",
                    },
                    {
                        required: true,
                        message: "Please select serving method",
                        trigger: "blur",
                    }
                ],
                doc_type: [
                    {
                        validator: EmptyValueValidator,
                        trigger: "blur",
                        message: "Please select document type"
                    },
                    {
                        required: true,
                        message: "Please select document type",
                        trigger: "blur"
                    }
                ],
                model_subtype: [
                    {
                        validator: EmptyValueValidator,
                        trigger: "blur",
                        message: "Please select model type"
                    },
                    {
                        required: true,
                        message: "Please select model type",
                        trigger: "blur"
                    }
                ]
            },
        };
    },
    methods: {
        async handleFileSelected(file) {
            let msg = {}
            try {
                // Prepare params to generate sas uri. 
                const modelId = _.get(this.$route.query, "id");
                const params = { model_id: modelId, serving_method: this.form.serving_method};

                // Step 1: Generate SAS token for the specified sharename, directory.
                const sasResponse = await KsModelService.generateSasToken(params)
                
                if(!sasResponse.status){
                    msg = { message: sasResponse.message, type: 'danger'};
                    this.$refs.connectionLogsDialogRef.addLog(msg);
                    return;
                }
                
                msg = {message: 'Please wait, The file upload is underway, and this may take a few minutes'}
                this.$refs.connectionLogsDialogRef.addLog(msg);

                // show the loader index in logs for the upload.
                this.logLoader = true;
                this.loaderIndex = 1;

                // Step 2: Upload the file to azure storage for generated sas token. 
                const sasToken = sasResponse.sas_token;
                const storageFilePath = sasResponse.storage_file_path;            
                const uploadResponse = await KsModelService.uploadFileToAzure(file, sasToken, storageFilePath);

                msg = uploadResponse.msg; 
                this.$refs.connectionLogsDialogRef.addLog(msg);
                // this will close the upload dialog.
                this.showModal = false;

                if(!uploadResponse.status){
                    this.notifyError('Error while uploading file');
                    return;
                }
                
                params['model_request'] = this.model_request;
                params['storage_file_path'] = uploadResponse.storage_file_path;
                // step 3: Deploy model to serving.
                const deployResponse = await KsModelService.deployModel(params);

                if(deployResponse.data && deployResponse.data.status){
                    this.notifySuccess('Model deployed successfully');
                }else{
                    this.notifyError('Error while deploying model');
                }
            } catch (error) {
                msg = {message: 'Error deploying model', type: 'danger', data: error}
                this.$refs.connectionLogsDialogRef.addLog(msg);
                this.notifyError('Error while uploading file');
            }
        },
        getValidFileTypes() {
            return ".zip"
        },
        async init(recordId) {
            try {
                this.loader = true;
                let ksModelData = await KsModelService.fetchById(recordId);
                this.form = Object.assign({}, this.form, ksModelData);
                await this.getDocumentTypes();
                this.handleModelTypeChange();
                this.loader = false;
            } catch (error) {
                this.loader = false;
                this.notifyError("Error");
            }
        },
        async getDocumentTypes() {
            let result = await CustomerConfig.getDocumentTypes();
            this.docTypes = result.map(doctype => ({
                label: doctype.toUpperCase(), 
                value: doctype.toUpperCase()
            }));
        },
        handleTypeChange(){
            this.form.domain = '';
            this.form.model_subtype = '';
            this.handleModelTypeChange();
        },
        handleModelTypeChange(){
            // if the user has not selected document type don't fetch the models return from here.
            if(!this.form.serving_method && !this.form.doc_type){
                return;
            }
            
            let modelDocType = _.get(this.documentTypeMap, this.form.doc_type, '');
            // if doc type not found in documentTypeMap set default docex.
            if(!modelDocType){
                modelDocType = 'DOCEX';
            }
            // if excel file type is true then use excel model types.
            if(this.form.is_file_type_excel){
                modelDocType = 'EXCEL';
            }

            this.modelTypes = Constants.MODEL_SUBTYPES[this.form.serving_method][modelDocType];
        },
        showUploadModal(req) {
            const modelId = _.get(this.$route.query, "id");
            if (!modelId) {
                this.notifyError("Please save model details before uploading the model.");
                return;
            }
            this.model_request = req
            this.showModal = true;
            this.$forceUpdate()
        },
        closeDialog() {
            this.showModal = false;
            this.$refs.upload.$refs.upload.fileList = [];
            this.$refs.upload.$refs.upload.outputData = [];
        },
        // step 1: check for the serving_method pytorch or tensorflow.
        // step 2: prepare the required parameters for pytorch or tensorflow models.
        async save() {
            console.log("inside save fun");
            this.saveClicked = true;
            this.$setLoader({
                target: "#ks-model-form-submit",
                spinner: "el-icon-loading",
            });
            let valid = await this.$refs.form.validate().catch((error) => { });
            if (!valid) {
                this.$resetLoader();
                this.saveClicked = false;
                return;
            }
            console.log("outside valid if block");

            // checks if model present with given subtype.
            const modelExist = await this.checkModelExist();
            if(!this.$route.query.id && modelExist){
                this.notifyError('Model Already Exist');
                this.$resetLoader();
                this.saveClicked = false;
                return;
            }

            // In case of tensflow model we need customer id in model record.
            // Fetching the cutsomer id from user record.
            const params = {
                'tensorflow': this.prepareTensorflowParams,
                'pytorch': this.preparePytorchParams
            }
            
            const user = this.$store.getters.user;
            this.form.customer_id = user.customer_id;

            const prepareParams = params[this.form.serving_method];
            prepareParams.call(this);
            return this.insertRecord();
        },

        async checkModelExist(){
            const subtype = `${this.form.model_subtype}_${this.form.doc_type}`;
            const params = {subtype: subtype, domain: this.form.domain};
            const modelResponse = await KsModelService.get(params);
            return _.isEmpty(modelResponse) ? false : true;
        },
        // for pytorch parameters preparation below function
        // required parameters:
        /**
         * step 1: controller: create mapping
         * step 2: create subtype using model_subtype and document_type
         */
        preparePytorchParams() {
            this.form.controller = Constants.MODEL_SUBTYPES.CONTROLLER[this.form.model_subtype];
            this.form.subtype = `${this.form.model_subtype}_${this.form.doc_type}`;
            this.form.model_store = 'ptserving_model_store_new';
        },

         /**
          * function: for tensorflow model
          * step 1: customer_id, controller: da_tensorflow, tf_host
          * step 2: create subtype using model_subtype and document_type
          * step 3: include model_type either router for table classification and nerv2 for others.
          */

        prepareTensorflowParams(){
            this.form.controller = "da_tensorflow";
            this.form.tf_host = Constants.TF_HOST;
            if(this.form.model_subtype.includes('TABLE_CLASSIFICATION')){
                this.form.model_type = 'ROUTER';
            }else{
                this.form.model_type = 'NERV2';
            }
            this.form.subtype = `${this.form.model_subtype}_${this.form.doc_type}`;
        },
        async moveModel(command){
            const modelId = _.get(this.$route.query, "id");
            if (!modelId) {
                this.notifyError("Model details are not present please update details");
                return;
            }
            this.isDialogVisible = true;
            const msg = { message: "Initiating model deployment.."};
            this.$refs.connectionLogsDialogRef.addLog(msg);
            const params = { model_id: modelId, vm_option: command};
            const modelResponse =  await KsModelService.moveModel(params);
            if(modelResponse.data&& modelResponse.data.status){
                this.notifySuccess('Model moved successfully');
            }else{
                this.notifyError('Error while moving model');
            }
        },
        async restoreModel(){
            const modelId = _.get(this.$route.query, "id");
            if (!modelId) {
                this.notifyError("No model entry found for restoration");
                return;
            }
            this.isDialogVisible = true;
            const msg = { message: "Restoring Model...."};
            this.$refs.connectionLogsDialogRef.addLog(msg);
            const params = { model_id: modelId, serving_method: this.form.serving_method, model_request: "restore"};
            const modelResponse =  await KsModelService.restoreModel(params);
            if(modelResponse.data&& modelResponse.data.status){
                this.notifySuccess('Model restored successfully');
            }else{
                this.notifyError('Error while restoring model');
            }
        },
        insertRecord() {
            console.log("inside insert record!");
            KsModelService.save(this.form)
                .then((response) => {
                    if (response.status == 200 || response.status == 201) {
                        if (!response.data.status && response.data.statusMessage) {
                            return this.handleError(response.data.statusMessage);
                        }
                        this.$resetLoader();
                        this.notifySuccess("Record saved successfully!");
                        this.$router.push({ path: "/idp/model" });
                        return;
                    }
                    this.handleError("Something went wrong.");
                })
                .catch((error) => {
                    this.handleError("Error while processing");
                });
        },
        handleError(message) {
            this.$resetLoader();
            this.saveClicked = false;
            this.notifyError(message);
        },
    },
    beforeMount() {
        // This event is used to open connection log dialog when start upload button is clicked from upload component.
        EventBus.$on("openLogDialog__" + this.openLogDialogEventName, (fileList) => {
            this.isDialogVisible = true;
            const msg = { message: "Initiating model deployment.."};
            this.$refs.connectionLogsDialogRef.addLog(msg);
            if (fileList) {
                this.handleFileSelected(fileList);
            }
        });
        EventBus.$on('upload-progress', (progress) => {
            this.uploadProgress = progress;
            if (progress >= 100) {
                this.logLoader = false;
                this.uploadProgress = 0;
            }
        });
        this.envList = this.moveModelEnvs[Constants.SERVER_ENV]
        this.$store.commit("setDisplayIdpTree", false);
        this.$store.commit("setDisplayIdpNavbar", true);
        let recordId = this.$route.query.id;
        console.log("query.id : ", recordId);
        recordId ? this.init(recordId) : this.getDocumentTypes();
    },
    beforeDestroy() {
        EventBus.$off("openLogDialog__" + this.openLogDialogEventName);
    }
};
</script>
