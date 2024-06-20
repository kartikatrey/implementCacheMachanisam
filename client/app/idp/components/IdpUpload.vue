<template>
<el-dialog :visible.sync="dialogShow" class="idp-upload-dialog-container" :close-on-click-modal="closeModalOnClick" :before-close="handleClose">
    <div class="modal-content">
        <div class="upload-container"> 
            <header class="upload-doctype-container">
                <h3>Upload documents</h3>
                <div class="tab-buttons" v-if="showHeaderTabs">
                    <div class="tabs-container">
                        <el-button v-bind:key="index" v-for="(type, index) in documentTypes" :data-v-step="index" class="btn" :class="{ active: activeTab === index }" v-show="staticMenu.includes(type.label)" v-on:click="handleDocTypeChange(type.value, index)">{{ type.label }}</el-button>
                        <div v-if="showUploadEllipsis">
                            <el-dropdown size="small" @command="setDocTypeActiveTabs">
                                <span class="el-dropdown-link">
                                <i class="mdi mdi-dots-vertical stage-dropdown-icon"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <span v-for="(type, index) in documentTypes" :key="type.value">
                                        <el-dropdown-item v-if="ellipsisMenuItems.includes(type.label)" :command="{type: type.value, index: index, label: type.label}">
                                        {{ type.label }}
                                        </el-dropdown-item>
                                    </span>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                </div>
                <!-- <span>Add one or more documents to process them. You will get notification when processing is done.</span> -->   
            </header>
                        <div class="modal-body">
                <div class="drag-drop-section">
                    <img src="../../assets/images/dragdrop.svg" />
                    <div class="doc-type">
                        <span v-for="ext in extensionList" :key="ext" v-if="ext !== 'msg'"> {{ ext.toUpperCase() }}</span>
                        <p>
                            <file-upload cid="browse-and-upload" :thread="thread" :post-action="endPoint" :multiple="multiple" :size="fileSize" :accept="acceptedFileTypes" v-model="fileList" :data="cloneData" @input-file="getFileOutput" ref="upload" :drop="true">
                                Drag and Drop files of these types here or
                                <a href="#">Browse and upload</a>
                            </file-upload>
                        </p>
                    </div>
                </div>

                <div class="doc-list-wrap">
                    <div class="doc" v-for="file in fileList" :key="file.id">
                        <img class="doc-type-icon" :src="fileIconPath" />
                        <div class="file-name">
                                {{ file.name }}
                        </div>
                        <div class="action-container"> 
                            <i class="mdi mdi-information filetype-error" v-if="file.fileTypeError"></i>
                        <div class="file-name-error" v-if="file.fileTypeError">
                           {{ file.fileTypeError }}
                        </div>
                        <el-button reclass="progress-button" icon="mdi mdi-close" v-if="showRemoveButton(file)" @click="removeUploaded(file)"></el-button>
                        </div>
                        <el-button class="progress-button" v-if="file.success" icon="mdi mdi-check-all done"></el-button>

                        <div class="file-progress" v-if="file.active || file.progress !== '0.00'">
                            <el-progress v-if="file.error" :text-inside="true" :stroke-width="14" :percentage="file.progress" status="exception"></el-progress>
                            <el-progress v-else-if="file.active || file.success" :text-inside="true" :stroke-width="14" :percentage="file.progress" status="success"></el-progress>
                            <el-progress v-else :text-inside="true" :stroke-width="14" :percentage="file.progress"></el-progress>
                        </div>
                    </div>
                </div>
            </div>
            <footer class="modal-footer">
                <div>
                    <el-button cid="idp-upload-remove-all-files" class="btn btn-sm btn-outline-danger" :disabled="fileList.length == 0" @click="removeAllFiles">Remove All files</el-button>
                </div>
                <div>
                    <el-button cid="idp-upload-close" class="btn btn-sm btn-default" @click="closeDialog">Close</el-button>
                </div>
                <div>
                    <el-button cid="idp-upload-add-all-files" class="btn btn-sm btn-primary" :disabled="fileList.length == 0 || isDisabled" @click.prevent="handleUpload">Add all files</el-button>
                </div>
            </footer>
        </div>
    </div>
    <!-- /  Upload document Modal -->
</el-dialog>
</template>

<script>
import VueUploadComponent from "vue-upload-component";
import DataTable from "@/components/DataTable.vue";
import _ from "lodash";
import NerService from "@/services/NerService";
import UploadService from "@/services/UploadService";
import Constants from "@/resources/Constants";
import {
    Loading
} from "element-ui";
import EventBus from "@/EventBus";
import documentConfigService from "@/idp/services/DeCustomerConfig";
import {docTypeLabelMapping} from "@/util/CommonUtil";
const lightIcon= require('@/assets/images/icons/icon-file.svg');
const darkIcon= require('@/assets/images/icons/icon-file-dark.svg');

export default {
    name: "IdpUpload",
    props: {
        data: {
            type: Object,
        },
        accept: {
            type: String,
        },
        multiple: {
            default: false,
            type: Boolean,
        },
        parentTableInfo: {},
        handler: {
            default: null,
            type: String,
        },
        showHeaderTabs: {
            default: false,
            type: Boolean
        },
    },
    components: {
        FileUpload: VueUploadComponent,
        DataTable,
        Loading,
    },
    watch: {
        data: {
            handler: function (newVal, oldVal) {
                this.cloneData = _.cloneDeep(newVal);
                this.setActiveTab();
            },
            immediate: true,
            deep: true,
        },
        // Watcher for changes in the fileList array to monitor successful file uploads.
        // It checks if all 'success' keys in the fileList array have been updated to true.
        fileList: {
            handler(newFileListVal, oldFileListVal) {
            //when no document is there to upload then we will not check further
            if(!newFileListVal.length){
                return 
            }  
            //checking if all files are uploaded  
            if (newFileListVal.every((file) => file.success)) {
                // If all files are successfully uploaded, close the dialog
                this.closeDialog();
            }
            },
        },
    },

    data() {
        return {
            staticMenu: [],
            ellipsisMenuItems: [],
            documentTypes:[],
            acceptedFileTypes:[],
            fileList: [],
            isExcelEnabled:false,
            thread: 2,
            dialogShow: true,
            closeModalOnClick: false,
            cloneData: "",
            fileError: false,
            outputData: [],
            fileSize: 0, // 0 means no limit
            endPoint: "/portal/api/process-file",
            isDisabled: false,
            activeTab: 0,
            documentConfigurations:[],
            constant:Constants,
            isDialogOpen:false,
            extensionList:[],
            showUploadEllipsis: false
        };
    },
    computed: {
        fileIconPath() {
            const kanvTheme = this.$store.getters.selectedTheme;
            let icon;
            switch (kanvTheme) {
                case Constants.DOCEX.THEMES.DARK:
                    icon = darkIcon;
                    break;
                default:
                    icon = lightIcon;
            }
            return icon;
        },
    },
    methods: {
        // limit the active Document type tabs
        limitDocTypeActiveTabs(documentTypes){
            let allTypes = []
            for(let i=0;i<documentTypes.length;i++){
                allTypes.push(documentTypes[i].label)
            }
            if(documentTypes.length > 4){
                this.showUploadEllipsis = true
            }
            this.staticMenu = allTypes.slice(0, 4)
            this.ellipsisMenuItems = allTypes.slice(4, allTypes.length)            
        },
        // set the Document type tabs in the visible active tabs list
        setDocTypeActiveTabs(data){
            let headerType = data.label
            let index = data.index
            let headerValue = data.type
            let oldStaticValue = this.staticMenu.pop();
            this.ellipsisMenuItems = this.ellipsisMenuItems.filter(item => item !== headerType);
            this.ellipsisMenuItems.push(oldStaticValue);
            this.staticMenu.push(headerType);
            this.handleDocTypeChange(headerValue, index)
        },
        handleDocTypeChange(type, index) {
            this.fileList.length > 0 ? this.checkDocTypeChange(type, index) : this.setDocumentType(type, index)
        },
        checkDocTypeChange(type, index) {
            let message = 'Selected File(s) will be discarded. Are you sure you want to continue?'
            this.$confirm(message, "Confirm", {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel',
                })
                .then(() => {
                    this.fileList = []
                    this.setDocumentType(type, index)
                })
                .catch((action) => {});
        },
        setDocumentType(type, index, label) {
            //after reload setting the active document type tab
            if(label && this.ellipsisMenuItems.includes(label)){
                const data = {type: type, index: index, label: label};
                this.setDocTypeActiveTabs(data)
            }
            this.cloneData.document_type = type;
            this.cloneData.classify_document = this.shouldClassifyDocument(type)
            this.activeTab = index;
            this.getExtensionList(type)
            this.isExcelProcessEnable(type)
        },
        shouldClassifyDocument(type) {
            const documentConfig = _.find(this.documentConfigurations, (doc) => {return doc.document_type == type})
            const shouldClassify = documentConfig && documentConfig.classification_enable_on_manual_upload
            return shouldClassify
        },
        async setActiveTab() {
            await this.getConfiguration();
            if (this.cloneData.document_type != Constants.DOCEX.DOCUMENT_TYPES.OTHER) {
                const index = this.documentTypes.map((doc) => doc.value).indexOf(this.cloneData.document_type);
                const label = this.documentTypes[index].label
                return this.setDocumentType(this.cloneData.document_type, index, label);
            }

            // Setting invoice document type when user click on upload from other menu
            const index = 0;
            const documentType = this.documentTypes[index]["value"]
            this.setDocumentType(documentType, index, label);
        },
        handleUpload() {
            let uploadLimit = Constants.DOCEX.UPLOAD_LIMIT;
            //this.handler is an for attachment, in attachment scenario there is no limitation
            //to upload documents and also there is no restrication for file types
            if(!this.handler && (this.fileList).length > uploadLimit){
                this.notifyError(`Maximum document limit to upload is ${uploadLimit}`);
                return;
            }
          if (!this.handler) {
                _.some(this.fileList, (file) => {
                    const fileName = _.get(file, 'name')
                    const fileExtension = fileName.split('.').pop().toLowerCase();
                    if (fileName && fileName.endsWith(".msg")) {
                        file['type'] = "application/vnd.ms-outlook";
                    }

                    // Since the library may not return a valid MIME type for .xlsm files,
                    // we are temporarily skipping MIME type validation for these files.
                    if(file.type =="" && ["xlsm"].includes(fileExtension.toLowerCase())){
                        return;
                    }

                    /*
                     * Here we add this condition because in some case of file type is not comes with file so for that add !file.type check
                     * and for extension list first we need to check coming file extension is present in supported extension list or not and also 
                     * need to check coming file mimetype is present in our extension mapping or not, If file is Invalid so we avoid server call
                     */
                    if(!file.type || !(this.extensionList.includes(fileExtension) && Constants.DOCEX.FILE_EXT_MIMETYPE_MAPPING[fileExtension]||''.toLowerCase()===file.type.toLowerCase())) {
                        file["fileTypeError"] = "Invalid file type",
                        this.fileError = true;
                        this.$refs.upload.update(file, {
                                error: 'abort',
                                success:false,
                                active: false,
                                progress: "100.00",
                            })
                    }
                })
            }
            if (this.handler) {
                EventBus.$emit(`upload_clicked_${this.handler}`);
                return;
            }
            this.$refs.upload.active = true;
        },

        showRemoveButton(file) {
            //show remove button initially
            if (file.success == false && file.active == false && this.fileError == false) {
                return true;
            }
            //if error and either upload is success or upload still in progress
            if ((file.success || file.active) && this.fileError) {
                return true;
            }
            //if error and upload is not success
            if (file.success == false && this.fileError) {
                return true;
            }
            return false;
        },
        handleCommand(itemAction) {
            /*0 => function reference   1 => Object as function parameter*/
            itemAction[0](itemAction[1]);
        },
        retryUpload(file) {
            this.$refs.upload.update(file, {
                active: true,
                error: "",
                progress: "0.00",
            });
        },
        removeUploaded(file) {
            this.$refs.upload.remove(file);
            this.fileError = false;
        },
        removeAllFiles() {
            this.fileList = [];
            this.isDisabled = false;
            this.fileError = false;
        },
        // abortUpload(file){
        //   this.$refs.upload.update(file, {active: false})
        // },
        // cancelUpload(file){
        //   this.$refs.upload.update(file, {error: 'cancel'})
        // },
        handleClose(done) {
            if (this.$refs.upload.uploaded) {
                done();
                this.$emit("closeDialog");
                EventBus.$emit("REFRESH_TABLE", 1);
                return;
            }
            this.$confirm(
                    'This may terminate uploading for "In progress" files. Are you sure to close this dialog?'
                )
                .then((_) => {
                    this.outputData = [];
                    this.fileList = [];
                    this.$emit("closeDialog");
                    done();
                })
                .catch((_) => {});
        },
        closeDialog() {
            if (this.$refs.upload.uploaded) {
                this.$emit("closeDialog");
                EventBus.$emit("REFRESH_TABLE", 1);
                // Display this message when all files have been successfully uploaded and the dialog is auto-closed.
                if(this.fileList.length && !this.fileError){
                    this.notifySuccess("File(s) uploaded successfully");
                }
                this.outputData = [];
                this.fileList = [];
                return;
            }
        if(!this.isDialogOpen){
            // this.isDialogOpen=true;    
            this.$confirm(
                    'This may terminate uploading for "In progress" files. Are you sure to close this dialog?'
                )
                .then((_) => {
                    this.$emit("closeDialog");
                    this.outputData = [];
                    this.fileList = [];
                })
                .catch((_) => {});
            }
        },
        getFileOutput(file, oldFile) {
            const fileResponse = _.get(file, "response.data.result");
            const defaultErrMsg = "Error while uploading document.";
            if (file) {
                if (file.active) {
                    this.isDisabled = true;
                }
                this.filename = _.get(file, "name");
                if (_.get(file, "response.status") == 500 && !file.active) {
                    this.isDisabled = false;
                    this.notifyError(_.get(file, "response.error", defaultErrMsg));
                    return;
                }
                /*  
                    In case of API upload multiple files can be send at once     
                    so in that case response will be array of multiple object,          
                    but when we are uploading multiple files manually from UI at a time then fileuploadService api           
                	is getting called multiple time and response will return as array of single file object            
                  	so thats why we are using fileResponse.data[0] for each file response    
                */
                if (
                    _.get(file, "response.statusCode") == 200 &&
                    !_.get(fileResponse, "data[0].status") && 
                    file.success&&
                    !file.active
                ) {
                    // if (this.$refs.upload.uploaded) {
                        this.$resetLoader();
                        this.fileError = true;
                        this.$refs.upload.update(file, {
                               error: 'abort',
                               success:false
                        })
                        this.isDisabled = false;
                        const errorMsg=_.get(fileResponse, "data[0].message");
                        this.$notify.error({
                            title: "Error",
                            dangerouslyUseHTMLString: true,
                            message: errorMsg
                        });
                        return;
                    //}
                }
                if (
                    _.get(file, "response.statusCode") == 200 &&
                   _.get(fileResponse, "data[0].status")
                ) {
                    this.fileError = false;
                    this.isDisabled = false;
                    this.$resetLoader();
                }
                if (_.get(file, "response.statusCode") == 200) {
                    if (_.get(file, "response.data.status")) {
                        this.isDisabled = false;
                    }
                }
            }
        },

        save() {
            if (!this.isUploadedDataValid()) {
                return;
            }
            UploadService.save(this.parentTableInfo.tableName, this.outputData)
                .then((response) => {
                    response && this.notifySuccess("Data saved successfully.");
                    this.closeDialog();
                })
                .catch((error) => {
                    this.notifyError("Error while saving data");
                });
        },

        isUploadedDataValid() {
            let isValid = true;
            _.each(this.outputData, (item, index) => {
                // loop for table data
                let keys = _.keys(item); // get keys object
                let values = _.values(item); // get values of object
                if (keys.length != _.compact(values).length) {
                    // check size of key array and value array. if valye is undefiend, empty or null then return false
                    this.notifyError(`Error at row ${index + 1}`);
                    isValid = false;
                    return false;
                }
            });
            return isValid;
        },

        downloadFile() {
            window.open(this.parentTableInfo.downloadOptions.path, "_self");
        },
        async getConfiguration(){
            this.documentConfigurations = await documentConfigService.getAllDocsCustConfiguration({document_type:{$exists:true}});
            const documentTypes =documentConfigService.getDocumentTypeList(this.documentConfigurations);
            _.map(documentTypes , (docType)=>{
                // Added to chnage label of document type for eg. po-> sales order
                if(docTypeLabelMapping(docType.value)){
                    docType['label'] = docTypeLabelMapping(docType.value)
                }
                return docType
            });
            this.documentTypes = documentTypes;
            this.limitDocTypeActiveTabs(this.documentTypes);
            this.getExtensionList(this.documentConfigurations[0].document_type)
            this.isExcelProcessEnable(this.documentConfigurations[0].document_type)
        },
        isExcelProcessEnable(documentType){
            let documentConfig = _.find(this.documentConfigurations,(doc)=>{return doc.document_type==documentType})
            this.isExcelEnabled = documentConfigService.isExcelProcessEnable(documentConfig)
            if(this.isExcelEnabled){
                this.acceptedFileTypes = this.acceptedFileTypes +','+ Constants.DOCEX.EXCEL.EXCEL_FILE_TYPE
            }
        },
        getExtensionList(docType){
            let documentConfig = _.find(this.documentConfigurations, (doc) => {
            return doc.document_type == docType;
            });
            this.extensionList = documentConfig.supported_files || [];
            //In case of attachment upload allow all default extensions
            if(this.handler){
               this.extensionList = _.keys(Constants.DOCEX.FILE_EXT_MIMETYPE_MAPPING)
            }
            let mimeTypeList = this.extensionList.map((ext)=>{
                return Constants.DOCEX.FILE_EXT_MIMETYPE_MAPPING[ext]
            })
            this.acceptedFileTypes = this.accept || mimeTypeList.join(',')
        }
    },
    async beforeMount() {
       await this.getConfiguration();
    },
};
</script>

<style lang="scss">
@import "../_idpGlobal.scss";
@import "../_idpVariables.scss";

.document-list {
    border-collapse: collapse;
    width: 100%;

    td {
        border-top: 1px solid #f1f1f1;
        text-align: left;
        padding: 10px;
    }

    th:first-child {
        width: 50%;
    }

    th {
        font-weight: normal;
        padding: 10px;
        color: #00a7e0;
        text-align: left;
    }

    .el-dropdown-link {
        border-radius: 100px;
        width: 30px;
        height: 30px;
        display: inline-block;
        /* padding: 3px 0 !important; */
        padding: 6px 2px !important;
        box-sizing: border-box;
    }

    td:last-child,
    th:last-child {
        background: #ffffff !important;
        position: -webkit-sticky;
        position: sticky;
        right: 0;
        width: 50px !important;
    }
}

.modal-content .doc-list-wrap .doc button span {
    font-size: 1rem;
    font-weight: normal;
    position: absolute;
    margin: -3px;
}
.modal-content .doc-list-wrap .doc .action-container { 
    display: flex; 
    align-items: center; 
}

.file-uploads {
    background: #005da6;
    float: left;
    color: #ffffff;
    border-radius: 5px;
    padding: 8px 20px;
    border: 1px solid #5f8fdf;
    cursor: pointer;
    display: inline-block;
    margin-right: 10px;
          &:hover {
                background: transparent;
            box-shadow: none;
            }
}

.buttons-right {
    .el-button {
        float: right;
        margin-left: 10px;
    }
}

.el-dialog__footer {
    text-align: left;
}

.el-loading-spinner {
    margin-top: -7px !important;
}

.modal-footer {
    .btn {
        font-family: var(--font-family);
        background: none;
        border: 0;
    }

    .btn-sm {
        font-size: var(--font-sm);
        height: 2rem;
    }

    .btn-lg {
        font-size: var(--font-base);
    }

    .btn-primary {
        background: var(--brand-05);
        color: var(--white);
        padding: var(--space-sm) var(--space-base);
        border-radius: var(--radius-base);
        border: 0.125rem solid var(--brand-05);
    }

    .btn-danger {
        background: var(--red-04);
        color: var(--white);
        padding: var(--space-sm) var(--space-base);
        border-radius: var(--radius-base);
    }

    .btn-default {
        background: var(--white);
        color: var(--brand-05);
        padding: var(--space-sm) var(--space-base);
        border-radius: var(--radius-base);
        border: var(--border-lg) solid var(--brand-05);
    }

    .btn-outline-danger {
        background: var(--white);
        color: var(--red-04);
        padding: var(--space-sm) var(--space-base);
        border-radius: var(--radius-base);
        border: var(--border-lg) solid var(--red-05);
        line-height: .5;
    }
}

.idp-upload-dialog-container {
    z-index: 100000;
    .el-dialog {
            padding: 0;
        }
    .modal-content {
        background-color: #fefefe;
        border-radius: var(--radius-base);
        position: relative;

        .modal-body {
            padding: 0 var(--space-xl);
        }
        
        header {
            display: block;
            padding: var(--space-lg) var(--space-xl);
            background: var(--white);

            h3 {
                font-size: var(--font-lg);
                margin: 0;
                color: var(--dark-02);
                display: inline-block;
                font-weight: normal;
                margin-right: var(--space-base);
            }

            span {
                font-size: 1.2rem;
                color: var(--dark-04);
            }
        }

        .drag-drop-section {
            border: var(--border-lg) dashed var(--brand-05);
            border-radius: var(--radius-base);
            padding: var(--space-base);
            text-align: center;

            img {
                height: 9rem;
                display: inline-block;
            }

            .doc-type {
                padding-top: var(--space-lg);

                span {
                    font-size: var(--font-sm);
                    background: var(--dark-08);
                    padding: var(--space-xs);
                    color: var(--dark-03);
                    display: inline-block;
                    margin: 0 var(--space-sm);
                    border-radius: var(--radius-sm);
                }

                p {
                    font-size: var(--font-sm);
                    color: var(--dark-03);

                    span {
                        float: none;
                        border: 0;
                        background: transparent;
                    }

                    a {
                        color: var(--brand-05);
                    }
                }
            }
        }

        // | drag-drop-section

        .doc-list-wrap {
            padding: 0 3.5rem;
            .doc {
                font-size: var(--font-sm);
                color: var(--dark-03);
                position: relative;
                clear: both;
                padding: var(--space-sm) 0;
                border-bottom: var(--border-base) solid var(--dark-05);
                margin: var(--space-base) 0 0 0;
                line-height: 180%;
                display: flex;
                align-items: center;

                .file-name {
                    width: 100%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .file-name-error {
                    color: red;
                    width: 100%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
               .filetype-error {
                    -webkit-transform: rotate(180deg); 
                    vertical-align: middle; 
                    font-size: 1.1rem; 
                    font-weight: normal; 
                    height: 1rem; 
                    vertical-align: text-bottom; 
                    display: inline-block; 
                    margin: 0.667rem var(--space-xs) 0 0;
                    color: #F82533; 
                 }

                button {
                    padding: 5px;
                    border: 0;
                    background: none;
                    vertical-align: middle;
                    float: right;
                    color: var(--dark-05);
                    cursor: pointer;

                    span {
                        font-size: var(--font-base);
                        font-weight: normal;
                    }

                    .done {
                        color: var(--green-05);
                    }
                }

                .file-progress {
                    width: 100%;
                    height: 0.375rem;
                    background: var(--white);
                    bottom: 0;
                    left: 0;
                    position: absolute;
                    margin: 0;
                    bottom: 0.125rem;

                    .el-progress-bar__outer {
                        height: 0.125rem !important;

                        .el-progress-bar__inner {
                            width: 100%;
                           // background: var(--green-05);

                            .el-progress-bar__innerText {
                                display: none;
                            }
                        }
                    }
                }
            }
        }

        .modal-footer {
            display: flex;
            justify-content: flex-end;
            margin-top: var(--space-lg);
            border-top: var(--border-base) solid var(--dark-06);
            padding: var(--space-base) var(--space-xl);
            background: var(--white);

            div:first-child {
                margin-left: 0;
                margin-right: auto;
            }

            div {
                margin-left: var(--space-lg);
            }
        }

        .close {
            color: var(--dark-04);
            float: right;
            font-size: var(--font-xl);
            font-weight: normal;
            position: absolute;
            top: 1rem;
            right: 1rem;
        }

        .close:hover,
        .close:focus {
            color: var(--black);
            text-decoration: none;
            cursor: pointer;
        }

        .upload-container {
            .upload-doctype-container {
                display: inline-flex;

                .tab-buttons {
                    width: auto;
                    margin-left: 24px;
                    margin-left: 0px;
                    margin-right: auto;

                    .tabs-container {
                        background: var(--dark-07);
                        border-radius: var(--radius-sm);
                        padding: var(--space-xxs);
                        margin: 0;
                        display: inline-flex;
                        align-items: center;                    
                    }

                    button {
                        background: transparent;
                        border: 0;
                        font-size: var(--font-sm);
                        padding: var(--space-sm) var(--space-base);
                        border-radius: var(--radius-sm);
                        outline: 0;
                        color: var(--dark-02);
                        box-sizing: border-box;
                    }

                    button.active {
                        background: var(--white);
                        color: var(--brand-04);
                    }
                }

                // | Tab buttons
            }

            button.is-disabled {
                background: #ffffff;
                color: #ebeef5;
                border-color: #ebeef5;
            }
        }
    }

    // | model content
    .modal-footer {
        width: auto !important;

        .btn {
            font-family: var(--font-family);
            background: none;
            border: 0;
        }

        .btn-sm {
            font-size: var(--font-sm);
            height: 2rem;
        }

        .btn-lg {
            font-size: var(--font-base);
        }

        .btn-primary {
            background: var(--brand-05);
            color: var(--white);
            padding: var(--space-sm) var(--space-base);
            border-radius: var(--radius-base);
            border: 0.125rem solid var(--brand-05);
              line-height: .5;
        }

        .btn-danger {
            background: var(--red-04);
            color: var(--white);
            padding: var(--space-sm) var(--space-base);
            border-radius: var(--radius-base);
        }

        .btn-default {
            background: var(--white);
            color: var(--brand-05);
            padding: var(--space-sm) var(--space-base);
            border-radius: var(--radius-base);
            border: var(--border-lg) solid var(--brand-05);
            line-height: .5;
        }

        .btn-outline-danger {
            background: var(--white);
            color: var(--red-04);
            padding: var(--space-sm) var(--space-base);
            border-radius: var(--radius-base);
            border: var(--border-lg) solid var(--red-05);
            line-height: .5;
        }
    }

    // end modal
}
 .el-message-box__wrapper{
        z-index: 10000000 !important;
        background: rgba(0, 0, 0, .3);
    }
   // .upload-file-container {
//     text-align: center;

//     .el-dialog {
//         border-radius: 5px;
//         top: 100px;
//     }

//     .el-dialog__body {
//         text-align: center;

//         .file-name-container {
//             border: 1px dashed;
//             padding: 15px;
//             border-radius: 5px;
//             margin-bottom: 20px;
//         }

//         .inner {
//             width: 70%;
//             margin: 0 auto;
//             margin-bottom: 30px;

//             .el-button {
//                 width: 100%;
//             }
//         }

//         .modal-bottom-btns {
//             text-align: right;
//         }
//     }
// }
</style>
