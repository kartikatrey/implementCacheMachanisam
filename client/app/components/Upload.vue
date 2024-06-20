<template>
<el-dialog class="upload-lookup-data-wrap" :title="parameters.title" :visible.sync="dialogShow" :close-on-click-modal="closeModalOnClick" :before-close="handleClose">
    <table border="0" class="lookup-list" width="100%"  cellspacing="0" cellpadding="0">
        <thead>
            <tr>
                <th width="80%">Name</th>
                <th  width="20%">Status</th>
                <!-- <th  width="10%">Size</th>
                <th  width="10%">Speed</th> -->
            </tr>
        </thead>
        <tbody>
            <tr v-if="!fileList.length">
                <td colspan="5">There is no file selected yet.</td>
            </tr>
             <tr v-else v-for="file in fileList" :key="file.id">
            <td>
                <div class="filename">{{file.name}}</div>
                <div class="progress" v-if="file.active || file.progress !== '0.00'">
                    <el-progress v-if="file.error" :text-inside="true" :stroke-width="14" :percentage="file.progress" status="exception"></el-progress>
                    <el-progress v-else-if="file.active || file.success" :text-inside="true" :stroke-width="14" :percentage="file.progress" status="success"></el-progress>
                    <el-progress v-else :text-inside="true" :stroke-width="14" :percentage="file.progress"></el-progress>
                </div>
            </td>
            <!-- <td>{{file.size | formatSize}}</td>
            <td>{{file.speed | formatSize}}</td> -->
            <td v-if="file.error">{{file.error}}</td>
            <td v-else-if="file.success">Success</td>
            <td v-else-if="file.active">Active</td>
            <td v-else></td>
        </tr>

         </tbody>
    </table>
    <div slot="footer" class="dialog-footer">
        <!-- <el-row> -->
            <!-- <el-col :span="12"> -->
                <div>
                    <file-upload class="file-name-container" :thread="thread" :post-action="uplodEndpoint" :multiple="multiple" :size="fileSize" :accept="accept" v-model="fileList" :data="data" @input-file="getFileOutput" ref="upload">Select File</file-upload>
                    <el-button v-if="parentTableInfo && parentTableInfo.downloadOptions" @click="downloadFile">{{parentTableInfo && parentTableInfo.downloadOptions.label}}</el-button>
                    <el-button type="primary" v-if="fileList.length>0" id="upload-file" @click.prevent="handleUpload">Start Upload</el-button>
                </div>
                 <el-button  size="small" @click="closeDialog">Close</el-button>
            <!-- </el-col> -->
            <!-- <el-col :span="12" class="buttons-right">
                <el-button  @click="closeDialog">Close</el-button>
            </el-col> -->
        <!-- </el-row> -->
    </div>
</el-dialog>
</template>

<script>
import VueUploadComponent from "vue-upload-component";
import DataTable from "@/components/DataTable.vue";
import _ from "lodash";
import NerService from "@/services/NerService";
import UploadService from "@/services/UploadService";
import {
    Loading
} from "element-ui";
import EventBus from "@/EventBus";
import Constants from "@/resources/Constants";
export default {
    name: "Upload",
    props: {
        dialogShow: {
            type: Boolean
        },
        data: {
            type: Object
        },
        accept: {
            default: ".csv,.xlsx",
            type: String
        },
        multiple: {
            default: false,
            type: Boolean
        },
        parameters: {
            type: Object
        },
        isModelFile: {
            default: false,
            type: Boolean
        },
        parentTableInfo: {},
        openLogDialogEventName: { type: String }
    },
    components: {
        FileUpload: VueUploadComponent,
        DataTable
    },
    data() {
        return {
            fileList: [],
            thread: 5,
            closeModalOnClick: false,
            outputData: [],
            fileSize: 0, // 0 means no limit
            endPoint: "/portal/api/process-file"
        };
    },
    computed: {
        uplodEndpoint() {
            return this.isModelFile ? "" : (this.parameters.endpoint || this.endpoint); 
        }
    },
    filters: {
        formatSize(size) {
            if (size > 1024 * 1024 * 1024 * 1024) {
                return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB'
            } else if (size > 1024 * 1024 * 1024) {
                return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB'
            } else if (size > 1024 * 1024) {
                return (size / 1024 / 1024).toFixed(2) + ' MB'
            } else if (size > 1024) {
                return (size / 1024).toFixed(2) + ' KB'
            }
            return size.toString() + ' B'
        }
    },
    methods: {
          handleUpload() {
            let isAnyFileInvalid =   !_.includes(this.parameters.valid_file_types, _.get(this.fileList[0], 'type'))
            if (isAnyFileInvalid) {
                this.notifyError("Invalid file type");
                return;
            }

            if (this.isModelFile) {
                EventBus.$emit("openLogDialog__" + this.openLogDialogEventName, this.fileList);
                return;
            }

            // starts the file upload process for the vue-upload-component
            this.$refs.upload.active = true;

            // This event is used to open connection log dialog on click of file upload 
            EventBus.$emit("openLogDialog__" + this.openLogDialogEventName);
        },

        handleCommand(itemAction) {
            /*0 => function reference   1 => Object as function parameter*/
            itemAction[0](itemAction[1]);
        },
        retryUpload(file) {
            this.$refs.upload.update(file, {
                active: true,
                error: '',
                progress: '0.00'
            })
        },
        removeUploaded(file) {
            this.$refs.upload.remove(file)
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
                this.$emit("closeDialog", true);
                return;
            }
            this.$confirm('This may terminate uploading for "In progress" files. Are you sure to close this dialog?')
                .then(_ => {
                    this.outputData = [];
                    this.fileList = [];
                    this.$emit("closeDialog", true);
                    done();
                })
                .catch(_ => {});
        },
        closeDialog() {
            if (this.$refs.upload.uploaded) {
                this.$emit("closeDialog", true);
                this.outputData = [];
                this.fileList = [];
                return;
            }
            this.$confirm('This may terminate uploading for "In progress" files. Are you sure to close this dialog?')
                .then(_ => {
                    this.$emit("closeDialog", true);
                    this.outputData = [];
                    this.fileList = [];
                })
                .catch(_ => {});
        },
        getFileOutput(file, oldFile) {
            if (file) {
                if (!this.$loadingInstance && file.active == true) {
                    this.$setLoader({
                        target: "#upload-file",
                        spinner: "el-icon-loading"
                    });
                }
                this.filename = file && file.name;
                if (_.get(file, "response.status") == 500 && file.active == false) {
                    this.$resetLoader();
                    this.notifyError(file.response.error);
                    return;
                }
                if (_.get(file, "response.statusCode") == 200 && file.active) {
                    this.$resetLoader();
                    if (file.response.data && file.response.data.status) {    
                         this.notifySuccess(Constants.BULK_DATA_UPLOAD_SUCCESS)   
                         this.$emit('uploadCompleted',file.response.data)                  
                        return;
                    }
                    const errorMessage = _.get(file, 'response.data.message') || _.get(file, 'response.data.result.message', Constants.BULK_DATA_UPLOAD_ERROR);
                    this.notifyError(errorMessage);
                }
            }
        },

        save() {
            if (!this.isUploadedDataValid()) {
                return;
            }
            UploadService.save(this.parentTableInfo.tableName, this.outputData)
                .then(response => {
                    response && this.notifySuccess("Data saved successfully.");
                    this.closeDialog();
                })
                .catch(error => {
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
        }
    }
};
</script>

<style lang="scss">
// @import "_idpGlobal";
@import "../idp/_idpVariables";


.upload-lookup-data-wrap {
    font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;

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


        .el-dialog {
            padding:0;
        }
        .el-dialog__body {
            padding: 1.5rem !important;
                .lookup-list {
                    text-align: left;
                    overflow: hidden;
                    border-radius: .3rem;
                    font-size: 1rem;
                    thead th {
                        background-color:var(--dark-07) !important;
                        color: rgba(26, 32, 44, 1);
                        font-weight: 400;
                        text-align: left;
                            border-bottom: 1px solid #EBEEF5;
                            padding:.4rem;
                             
                    }
                    tbody tr:nth-child(odd) {
                        background-color: var(--dark-08) !important;
                    }
                    tbody tr {
                            background-color:var(--dark-09) !important;
                                td {
                                    padding:.4rem;
                                       .progress {
                                             margin-top: .5rem;
                                        }
                                }
                    }
                   
                }
        }
        .el-dialog__footer {
               padding: 1.2rem 1.8rem !important;
                   border-top: .5px solid #E4E7ED;
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

} // upload-lookup-data-wrap








#upload-file {
    background: #005da6;
    color: #ffffff;
}

.filename {
    font-size: 11px;
}

.el-progress-bar {
    width: 95%;

    .el-progress-bar__inner {
        line-height: 0;

        .el-progress-bar__innerText {
            font-size: 11px;
        }
    }
}

// .document-list {
//     border-collapse: collapse;
//     width: 100%;

//     td {
//         border-top: 1px solid #f1f1f1;
//         text-align: left;
//         padding: 10px;
//     }

//     th:first-child {
//         width: 50%;
//     }

//     th {
//         font-weight: normal;
//         padding: 10px;
//         color: #00a7e0;
//         text-align: left;
//     }

//     .el-dropdown-link {
//         border-radius: 100px;
//         width: 30px;
//         height: 30px;
//         display: inline-block;
//         /* padding: 3px 0 !important; */
//         padding: 6px 2px !important;
//         box-sizing: border-box;
//     }

//     td:last-child,
//     th:last-child {
//         background: #ffffff !important;
//         position: -webkit-sticky;
//         position: sticky;
//         right: 0;
//         width: 50px !important;
//     }
// }


.buttons-right {
    .el-button {
        float: right;
        margin-left: 10px;
    }
}



.el-loading-spinner {
    margin-top: -7px !important;
}

.upload-file-container {
    text-align: center;

    .el-dialog {
        border-radius: 5px;
        top: 100px;
    }

    .el-dialog__body {
        text-align: center;

        .file-name-container {
            border: 1px dashed;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }

        .inner {
            width: 70%;
            margin: 0 auto;
            margin-bottom: 30px;

            .el-button {
                width: 100%;
            }
        }

        .modal-bottom-btns {
            text-align: right;
        }
    }
}
</style>
