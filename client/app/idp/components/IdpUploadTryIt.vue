<template>
<el-dialog :visible.sync="dialogShow" class="idp-upload-dialog-container" :close-on-click-modal="closeModalOnClick" :before-close="handleClose">
    <div class="modal-content">
        <div class="upload-container">
             <div class="branding-circle">
                        <div class="circle circle-red"></div>
                        <div class="circle circle-blue"></div>
                        <div class="circle circle-green"></div>
                </div>
            <header>
                <div class="left-side">
                    <h3><span v-if="!isSampleDocsUploading">Upload Documents</span> <span v-if="isSampleDocsUploading">Upload Sample Documents</span></h3>
                </div>
                <div class="right-side">
                     <el-button @click="closeDialog" class="btn-close" size="mini" circle><i class="mdi mdi-close"></i> </el-button>
                </div>
            </header>
            <div class="modal-body" v-loading="isLoading">                 
                <div class="drag-drop-section" v-if="!isSampleDocsUploading">
                    <file-upload class="file-upload-area tryitupload" cid="browse-and-upload" :thread="thread" :post-action="endPoint" :multiple="multiple" :size="fileSize" :accept="accept" v-model="fileList" :data="uploadData" @input-file="getFileOutput" ref="upload" :drop="true">
                    <img src="../../assets/images/dragdrop.svg" />
                    <div class="doc-type">
                        <span>JPG</span>
                        <span>PNG</span>
                        <span>PDF</span>
                        <span>JPEG</span>
                        <span>BMP</span>
                        <span>TIFF</span>

                        <div class="dragdrop-info">
                            Drag and Drop files of these types here or
                            <span>Browse and Upload</span>
                        </div>
                    </div>
                    </file-upload>
                </div>             
                <div class="doc-list-wrap browse-doc-list-wrap" v-if="!isSampleDocsUploading">
                    <div class="doc" v-for="file in fileList" :key="file.id">
                        <img class="doc-type-icon" src="../../assets/images/icons/icon-file.svg" />
                        {{ file.name }}
                        <el-button reclass="progress-button" icon="mdi mdi-close" v-if="showRemoveButton(file)" @click="removeUploaded(file)"></el-button>
                        <el-button class="progress-button" v-if="file.success" icon="mdi mdi-check-all done"></el-button>

                        <div class="file-progress" v-if="file.active || file.progress !== '0.00'">
                            <el-progress v-if="file.error" :text-inside="true" :stroke-width="14" :percentage="file.progress" status="exception"></el-progress>
                            <el-progress v-else-if="file.active || file.success" :text-inside="true" :stroke-width="14" :percentage="file.progress" status="success"></el-progress>
                            <el-progress v-else :text-inside="true" :stroke-width="14" :percentage="file.progress"></el-progress>
                        </div>
                    </div>
                       <div class="browse-upload-btn" style="margim-top:2rem">                        
                        <div>
                            <el-button size="small" type="primary" v-if="selectedSampleDocs.length == 0" cid="idp-upload-add-all-files" class="" :disabled="fileList.length == 0 || disableAddAllFilesBtn" @click.prevent="handleUpload">Add all files</el-button>
                        </div>
                        <div>
                            <el-button  size="small" cid="idp-upload-remove-all-files" class="btn-outline-danger" :disabled="fileList.length == 0" @click="removeAllFiles">Remove all files</el-button>
                        </div>                      
                    </div>
                </div>            

                <div class="sample-doc-sec" v-if="isTryItUser()">                    
                    <div class="or-wrap" v-if="!isSampleDocsUploading">
                        <div class="or"> OR </div>
                    </div>
                    <el-button type="primary" size="medium" cid="idp-upload-sample-docs" class="btn-sample" v-if="!isSampleDocsUploading" @click="getSampleDocuments()"><i class="mdi mdi-plus-circle"></i> Use Sample Documents</el-button>
                </div>

                <div class="sample-doc-wrap" v-if="isSampleDocsUploading">
                    <div class="sample-doc-list-wrap">
                        <el-checkbox-group v-model="selectedSampleDocs">
                            <el-checkbox class="browse-upload-container" v-for="file in sampleDocuments" :key="file" :label="file">
                                <div class="">
                                    <div class="thumbnail-container">
                                        <img class="" src="../../assets/images/sample-thmbnail-A.svg" />
                                        <div class="thumb-icon"><i class="mdi mdi-cloud-upload "></i></div>
                                    </div>
                                    <span class="file-name">{{file}}</span>
                                </div>
                            </el-checkbox>                        
                        </el-checkbox-group>
                    </div>

                    <div class="sample-footer">
                        <div class="back-container" v-if="isTryItUser()">
                            <el-button cid="idp-browse-and-upload" class="btn-back" size="small" v-if="isSampleDocsUploading" @click="handleBrowseAndUpload()"><i class="mdi mdi-arrow-left"></i> Go back</el-button>
                        </div>
                        <div class="btn-upload-container">
                            <el-button cid="idp-upload-add-all-files" type="primary" size="medium" class="btn-upload" :disabled="isLoading || selectedSampleDocs.length == 0" @click="handleSampleFileUpload">Upload</el-button>
                        </div>
                         
                    </div>
                    <div>
                    </div>
                </div>

            </div> <!-- | model body -->
           
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
export default {
    name: "IdpUploadTryIt",
    props: {
        data: {
            type: Object,
        },
        accept: {
            default: Constants.DOCEX.VALID_FILE_TYPES.join(','),
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
                this.uploadData = _.cloneDeep(newVal);
                this.setActiveTab();
            },
            immediate: true,
            deep: true,
        },
    },

    data() {
        return {
            documentTypes:[],
            fileList: [],
            sampleDocuments:[],
            selectedSampleDocs:[],
            selectedSampleFile:null,
            isSampleDocsUploading: false,
            isLoading: false,
            thread: 2,
            dialogShow: true,
            closeModalOnClick: false,
            uploadData: "",
            fileError: false,
            outputData: [],
            fileSize: 0, // 0 means no limit
            endPoint: "/portal/api/process-file",
            disableAddAllFilesBtn: false,
            activeTab: 0,
            constant:Constants
        };
    },
    methods: {
        handleDocTypeChange(type, index) {
            this.fileList.length > 0 ? this.checkDocTypeChange(type, index) : this.setDocumentType(type, index)
        },
        checkDocTypeChange(type, index) {
            let message = 'Selected File(s) will be discarded. Are you sure you want to continue?'
            this.$confirm(message, "ConfircloneDatam", {confirmButtonText: 'Confirm', cancelButtonText: 'Cancel'})
                .then(() => {
                    this.fileList = []
                    this.setDocumentType(type, index)
                })
                .catch((action) => {});
        },
        setDocumentType(type, index) {
            this.uploadData.document_type = type;
            this.activeTab = index;
        },
        setActiveTab() {
            if (this.uploadData.document_type != Constants.DOCEX.DOCUMENT_TYPES.OTHER) {
                const index = Constants.DOCEX.DOCUMENT_TYPE_LIST.map((doc) => doc.value).indexOf(this.uploadData.document_type || Constants.DOCEX.DOCUMENT_TYPES.INVOICE);
                return this.setDocumentType(this.uploadData.document_type || Constants.DOCEX.DOCUMENT_TYPES.INVOICE, index);;
            }

            // Setting invoice document type when user click on upload from other menu
            const index = Constants.DOCEX.DOCUMENT_TYPE_LIST.map((doc) => doc.value).indexOf(Constants.DOCEX.DOCUMENT_TYPES.INVOICE);
            this.setDocumentType(Constants.DOCEX.DOCUMENT_TYPES.INVOICE, index);
        },
        checkIfUploadLimitExceed(){
            const uploadLimit = Constants.DOCEX.UPLOAD_LIMIT;
            return !this.handler && ((this.fileList).length > uploadLimit || (this.selectedSampleDocs.length > uploadLimit))
        },
        checkIfAnyInvalidFile(){
            let isAnyFileInvalid = _.some(this.fileList, (file) => {return !_.includes(Constants.DOCEX.VALID_FILE_TYPES, _.get(file, 'type'))});
            return isAnyFileInvalid;
        },
        handleUpload() {
            if(this.checkIfUploadLimitExceed()){
                this.notifyError(`Maximum document limit to upload is ${uploadLimit}`);
                return;
            } 
            if(this.checkIfAnyInvalidFile()){
                this.notifyError("Invalid file type");
                return;
            } 
            if (this.handler) {
                EventBus.$emit(`upload_clicked_${this.handler}`);
                return;
            }
            this.$refs.upload.active = true;
        },
        async handleSampleFileUpload(){
            this.isLoading = true;
            this.uploadData.files = this.selectedSampleDocs
            let response = await UploadService.uploadSampleDocuments(this.uploadData);
            this.isLoading = false;
            this.$emit("closeDialog");
            EventBus.$emit("REFRESH_TABLE", 1);
            this.selectedSampleDocs = []
            if(response.statusCode != 200){
                this.notifyError("Error encountered while uploading file(s).");
                return;
            }
            let failedUpload = _.find(response.data.data, {"status": false} )
            if(failedUpload){
                this.notifyError(failedUpload.message);
                return;
            }
            this.notifySuccess("File(s) uploaded successfully");
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
        removeUploaded(file) {
            this.$refs.upload.remove(file);
            this.fileError = false;
        },
        removeAllFiles() {
            this.fileList = [];
            this.fileError = false;
        },
        handleClose(done) {
            if (this.$refs.upload.uploaded) {
                done();
                this.$emit("closeDialog");
                EventBus.$emit("REFRESH_TABLE", 1);
                this.isLoading = false;
                return;
            }
            this.$confirm(
                    'This may terminate uploading for "In progress" files. Are you sure to close this dialog?'
                )
                .then((_) => {
                    this.outputData = [];
                    this.fileList = [];
                    this.$emit("closeDialog");
                    this.isLoading = false;
                    done();
                })
                .catch((_) => {});
        },
        closeDialog() {
            if (this.isSampleDocsUploading && !this.isLoading) {
                this.handleCloseDialog()
                this.isSampleDocsUploading = false;
                this.selectedSampleDocs = [];
                return;
            }
            if (this.$refs.upload && this.$refs.upload.uploaded && !this.isLoading) {
                this.handleCloseDialog()
                this.outputData = [];
                this.fileList = [];
                return;
            }
            this.$confirm('This may terminate uploading for "In progress" files. Are you sure to close this dialog?')
                .then((_) => {
                    this.handleCloseDialog()
                    this.outputData = [];
                    this.fileList = [];
                })
                .catch((_) => {});
        },

        handleCloseDialog(){
            this.$emit("closeDialog");
            this.isLoading = false;
            EventBus.$emit("REFRESH_TABLE", 1);
        },

        resetFlags(){
            this.fileError = true;
            this.disableAddAllFilesBtn = false;
            this.$resetLoader();
        },

        getFileOutput(file, oldFile) {
            if(!file){
                return;
            }

            if (file.active == true) {
                this.disableAddAllFilesBtn = true;
            }
            this.filename = file && file.name;

            if(_.get(file, "response.status") == 500 && file.active == false) {
                this.disableAddAllFilesBtn = false;
                this.notifyError(file.response.error);
                return;
            }

            if(_.get(file, "response.statusCode") == 200 && !file.response.data.result.status &&  file.success == true && file.active == false) {
                this.resetFlags();
                this.$refs.upload.update(file, {error: 'abort', success:false });
                this.notifyError(file.response.data.result.message);    
                return;
            }

            if( _.get(file, "response.statusCode") == 200 && file.response.data.result.status ) {
                this.resetFlags()
            }

            if(_.get(file, "response.statusCode") == 200 && file.response.data.status ) {
                this.disableAddAllFilesBtn = false;
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
        async getDocTypeConfig(){
            const documentTypeConfig = await documentConfigService.getAllDocsCustConfiguration({document_type:{$exists:true}});
            return documentTypeConfig;
        },
        handleBrowseAndUpload(){
            this.isSampleDocsUploading = false;
            this.selectedSampleDocs = [];
        },
        async getSampleDocuments(){
            this.removeAllFiles();
            this.isSampleDocsUploading = true;
            let res = await UploadService.getSampleDocuments(this.uploadData.document_type)
            this.sampleDocuments = res.fileNames;
            this.selectedSampleDocs = [this.sampleDocuments[0]]
        }
    },
    beforeMount() {
        this.getDocTypeConfig(); // setting config in window object so calling it which is required in other area 
        // documentTypes we are not using anywhere in this component 
        // this.documentTypes = DocumentTypeService.getDocumentTypeList(documentTypeConfig);
    },
};
</script>

<style lang="scss">
@import "../_idpGlobal.scss";
@import "../_idpVariables.scss";

// .v-modal {
//     background: #ffffff !important;
//     opacity: 0.8 !important;
// }
// .v-modal[target=_blank] {
//   background-color: yellow;
// }

.sample-doc-wrap {
     .sample-footer {
                  display: flex;
                  justify-content:flex-end;
                  row-gap: 10px;
                  padding: 2rem 3rem;

               
                            .btn-upload-container {
                                text-align: center;
                                flex: 1;
                                margin-right: 4rem;
                                    .btn-upload {
                                        height: auto;
                                        padding: 7px 17px;
                                        font-weight: 400;
                                    }
                            }
                     
                            .back-container {
                                    margin-right: auto;
                                    margin-left: 0;
                                    
                                        .btn-back {
                                            color: var(--brand-05);
                                            font-weight: 400;
                                            border: 0;
                                            font-size: var(--font-md);
                                            padding: .8rem 7px 7px 0 ;
                                            height: auto;
                                            background: transparent;
                                            
                                                &:hover {
                                                    background: transparent;
                                                    text-decoration: underline;
                                                }
                            }
                    }
                   
                  
                    


                    .or-wrap {
                        text-align: center;
                        margin: 0 .5rem;
                            padding-top: 0.4rem;
                        .or {
                            display: inline-block;
                            width: 21px;
                            margin: 0 .7rem !important;
                            text-align: center;
                            position: relative;
                            color: var(--dark-05);
                            text-transform: uppercase;
                            font-size: var(--font-base);
                                &::before {
                                    content: '';
                                    position: absolute;
                                    width: 8px !important;
                                    height: 1px;
                                    background: var(--dark-07);
                                    z-index: 9;
                                    left: 8px !important;
                                    top: -5px !important;
                                    transform: rotate(90deg);
                                }
                                &::after {
                                    content: '';
                                    position: absolute;
                                    width: 8px !important;
                                    height: 1px;
                                    background: var(--dark-07);
                                    z-index: 9;
                                    right: 5px !important;
                                    bottom: -5px !important;
                                    top: auto !important;
                                     transform: rotate(90deg);
                                }
                        }
                    }
            }
    h2 {
            font-size: var(--font-md);
            margin: 2rem 0 1rem 0;
            color: var(--dark-03);
            display: inline-block;
            font-weight: normal;
            margin-right: 1rem;
            font-weight: 400;
    }
    .sample-doc-list-wrap {
        background: var(--dark-09);
        margin-top: 2rem;
        
        .browse-upload-container {
            cursor: pointer !important;
                &:hover {
                    // box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
                    //   background: var(--dark-08);
                }
        }
        .el-checkbox-group {
            display: flex;
               padding: 0 1.8rem;
        }
        .el-checkbox.is-bordered.is-checked {
            background: transparent !important;
             .file-name {
                color: var(--brand-05);
                font-weight: 500;
            }
            .thumbnail-container {
                border: .12rem dashed var(--brand-05);
                box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;
                .thumb-icon {
                      i {
                          color: var(--brand-05);
                      }
                }
            }
             .el-checkbox__input {
                    .el-checkbox__inner {
                         border: 1px solid var(--brand-05);
                    }
            }
        } // checked

        .el-checkbox.is-bordered {
            margin: 0 0 1.4rem 0;
            border: 0;
            height: auto;
            display: block;
             box-sizing: border-box;
            position: relative;
            border-radius: 0;
            padding: 30px 15px 20px 15px;
            width: 25%;
            .el-checkbox__label {
                font-size: var(--font-base);
                color: var(--dark-02);
                font-weight: 400;
                padding: 0;
            }
            .el-checkbox__input {
                position: absolute;
                top: -10px;
                left:50%;
                    .el-checkbox__inner {
                        border-radius: 100px;
                         border: 1px solid var(--dark-03);
                         outline: #ffffff solid 5px;
                        
                    }
            }
            .thumbnail-container {
                background: var(--white);
                border:1px solid var(--dark-08);
                padding: .7rem;
                border-radius: .3rem;
                margin-bottom: 1.6rem;
                position: relative;
                img {
                    display: block;
                    width: 100%;
                }
                &:hover {
                    box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;
                }
                .thumb-icon {
                    position: absolute;
                    bottom: -8px;
                    left: 38%;
                    font-size: 2.2rem;
                    background: #fff;
                    border-radius: 100px;
                           
                         i {
                             color: var(--dark-05);
                        }
                }
               
            }
          
             
            .file-name {
                display: block;
                text-align: center;
                font-size: var(--font-base);
                text-align: center;
                font-weight: 500;
                color: var(--dark-03);
                white-space: nowrap;
                width: 145px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
             
            
        }


        .el-checkbox.is-bordered + .el-checkbox.is-bordered {
            margin-left: 0px;
        }
        .el-checkbox.is-bordered.is-checked {
            border: 0px solid var(--brand-04);
            background: var(--brand-09);
                 .el-checkbox__label { 
                     font-weight: 500;
                 }
        }
    }
}

.browse-doc-list-wrap {
        width: 70% !important;
    margin: 0 auto !important;
            
}

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
.idp-upload-dialog-container .modal-content .modal-body {
    padding: 0;
}
.file-uploads.tryitupload {
    background: var(--dark-09);
    color: #ffffff;
    border-radius: 5px;
    padding: var(--space-lg);
    cursor: pointer;
    display: block !important;
    box-sizing: border-box;
    display: block;
    width: 100%;
    float: unset;
    border: 0;
    transition: all ease-in-out .2s;
        &:hover {
            background: var(--dark-08);
           box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        }

}
.file-uploads.file-uploads-html5 label {
    // font-size: 2rem !important;
    cursor: pointer;
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

.browse-upload-btn {
    display: flex;
    justify-content: flex-end;
    margin-top: 1.5rem;
    
    .el-button {
        height: auto;
        font-weight: 400 !important;
         padding: 7px 15px;
         margin-left: .5rem;
    }

      button.is-disabled {
                background: #ffffff;
                color: #ebeef5;
                border-color: #ebeef5;
                display: none;
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
        padding: 7px 15px;
        border-radius: var(--radius-base);
        border: var(--border-lg) solid var(--red-05);
        height: auto;
    }
}

.idp-upload-dialog-container {
    .el-dialog {
            padding: 0;
            width: 55% !important;
            box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 0px;
            border: 0 !important;
        }
    .modal-content {
        background-color: #fefefe;
        border-radius: var(--radius-base);
        position: relative;

        .upload-container {
            // padding: 2.5rem 3rem;
            // padding-bottom: 2rem;
            // padding: 0;
            position: relative;
                 .branding-circle {
                    display: inline-block;
                    position: absolute;
                    top: 1.2rem;
                    display: flex;
                    left: 3.4rem;
                      opacity: .7;
                    .circle {
                        width: 5.5px;
                        height: 5.5px;
                        border-radius: var(--radius-round);
                        margin-right: .3rem;
                    }
                    .circle-red {
                        background: #FE2712;
                    }
                    .circle-blue {
                        background: #0147FE;
                    }
                    .circle-green {
                        background: #66B032;
                    }
                }

                .browse-upload-btn {
                    display: flex;
                    justify-content: flex-end;
                }
                

        }
        
        .sample-doc-sec {
            text-align: center;
            padding-bottom: 2rem;
                .subinfo-sample-doc {
                    font-size: var(--font-md);
                    color: var(--dark-05);
                    font-weight: 300;
                    margin-top: .5rem;
                    margin-bottom: 0;
                        span {
                            font-weight: 400;
                        }
                }
                .btn-sample {
                    padding: 5px 17px; 
                    font-weight: 400;
                        i {
                            font-size: 1.6rem;
                            vertical-align: text-top;
                            display: inline-block;
                            margin-right: .5rem;
                        }
                }
        }

        .or-wrap {
            text-align: center;
            .or {
                display: inline-block;
                width: 21px;
                // height: 25px;
                margin: 2rem auto 1.5rem auto;
                text-align: center;
                position: relative;
                color: var(--dark-05);
                text-transform: uppercase;
                font-size: var(--font-base);
                    &::before {
                        content: '';
                        position: absolute;
                        width: 40px;
                        height: 1px;
                        background: var(--dark-07);
                        z-index: 9;
                        left: -45px;
                        top: 7px;
                    }
                     &::after {
                        content: '';
                        position: absolute;
                        width: 40px;
                        height: 1px;
                         background: var(--dark-07);
                        z-index: 9;
                        right: -45px;
                        top: 7px;
                    }
            }
        }

     

         .tab-buttons {
             
                  
                    margin-left: 24px;
                    margin-left: 0px;
                    margin-right: auto;

                    .tabs-container {
                        background: var(--dark-07);
                        border-radius: var(--radius-sm);
                        padding: var(--space-xxs);
                        display: inline-block;
                        margin-right: 3rem;
                        
                    }

                    button {
                        background: transparent;
                        border: 0;
                        font-size: var(--font-base);
                        padding: var(--space-sm) var(--space-base);
                        border-radius: var(--radius-sm);
                        outline: 0;
                        color: var(--dark-05);
                        box-sizing: border-box;
                        font-weight: 400;
                        text-transform: capitalize;
                            span {
                                font-size: 1rem;
                            }
                    }

                    button.active {
                        background: var(--white);
                        color: var(--brand-04);
                            span {
                                font-size: 1rem;
                            }
                    }
                }
        
        header {
            display: block;
            // padding: var(--space-lg) var(--space-xl);
                padding: 2.5rem 3rem 0 3rem;
            background: var(--white);
            display: flex;
            justify-content:flex-end;
            // span {
            //     font-size: 1rem;
            // }
            .left-side {
                margin-left: 0;
                margin-right: auto;
                     h3 {
                        font-size: var(--font-lg-max);
                        margin: 0;
                        color: var(--dark-03);
                        display: inline-block;
                        font-weight: normal;
                        margin-right: var(--space-base);
                            span {
                                font-size: inherit;
                                color:unset;
                            }
                    }
                    .submsg {
                        font-size: var(--font-md);
                        color: var(--dark-05);
                        font-weight: 300;
                        margin-top: .2rem;
                            span {
                                font-weight: 400;
                                // color: var(--dark-04);
                            }
                    }
            }
            .right-side {
                display: flex;
                position: relative;
              
                    .btn-close {
                        position: absolute;
                          right: -3px;
                        top: -10px;
                        background: var(--dark-08);
                        border: 0;
                        color: var(--dark-04);
                        font-size: 1.2rem;
                        transition: .2s all ease-in-out;
                            span {
                                   font-size: 1.2rem;
                            }
                            &:hover {
                                 background: var(--dark-09);
                                  color: var(--dark-05);
                                  transform: scale(1.3);
                            }
                    }
            }
            
           
           
        } // header end

        .drag-drop-section {
            border: var(--border-lg) dashed var(--brand-05);
            border-radius: var(--radius-base);
            text-align: center;
            background: var(--dark-09);
            margin: 1.2rem 3rem 0 3rem;
            padding: 0;
                &:hover {
                    cursor: pointer;
                }

            img {
                height: 9rem;
                margin-left: 5.6rem;
            }
            .dragdrop-info {
                font-size: var(--font-md);
                 color: var(--dark-05);
                 font-weight: 300 !important;
                 margin-top: .5rem;
                    span {
                        color: var(--brand-05) !important;
                        font-weight: 500 !important;
                        font-size: var(--font-md) !important;
                        background: transparent !important;
                        margin: 0 !important;
                        text-decoration: underline;
                        cursor: pointer;
                    }
            }

            .doc-type {
                padding-top: var(--space-lg);

                span {
                    font-size: var(--font-base);
                    background: var(--dark-08);
                    padding: var(--space-xs) var(--space-sm);
                    color: var(--dark-04);
                    display: inline-block;
                    margin: 0 var(--space-xs);
                    border-radius: var(--radius-sm);
                    font-weight: 350;
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
            .doc {
                font-size: var(--font-sm);
                color: var(--dark-03);
                position: relative;
                clear: both;
                padding: var(--space-sm) 0;
                border-bottom: var(--border-base) solid var(--dark-05);
                margin: var(--space-base) 0 0 0;
                line-height: 180%;

                .doc-type-icon {
                    vertical-align: middle;
                    font-size: var(--font-base);
                    font-weight: normal;
                    height: 1rem;
                    vertical-align: text-bottom;
                    display: inline-block;
                    margin-right: var(--space-xs);
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
        }
    }

    // end modal
}

</style>
