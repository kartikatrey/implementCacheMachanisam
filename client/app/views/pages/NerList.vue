<template>
<el-main>
    <h1 class="kp-page-title">{{pageTitle}}</h1>
    <training-status-dialog @closeDialog="handleCloseDialog" :title="title" :displayTrainingDialog="displayTrainingDialog"></training-status-dialog>
    <div class="table-wrap">
        <data-table @trainModal="trainModal" :parameters="nerListTableParams" ref="datatable"></data-table>
    </div>
    <div>
        <upload v-if="displayUploadDialog" @closeDialog="closeUploadDialog" :parentTableInfo="nerListTableParams" :data="uploadParams"></upload>
    </div>
    <el-dialog class="kp-modal-wrap" width="30%" title="Select domain" :visible.sync="isDomainSelected">
        <el-row>
            <el-col :span="16">
                <div class="kp-form-input-1 kp-form-field">
                    <div class="kp-form-field-label">Domain</div>
                    <el-select v-model="domain" multiple :default-first-option="true" placeholder="Select" filterable @change="onDomainChange(domain)">
                        <el-option v-for="(value, key) in domains" :key="value.domain" :label="key.domain" :value="value.domain"></el-option>
                    </el-select>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-button class="kp-btn-form-primary" v-on:click="startTrainer" type="primary">Start training</el-button>
                <!-- <el-button v-on:click="handleCloseDialog">Close</el-button> -->
            </el-col>
        </el-row>
    </el-dialog>

</el-main>
</template>

<script>
import DataTable from "@/components/DataTable";
import NerService from "@/services/NerService";
import TrainingService from "@/services/TrainingService";
import Constants from "@/resources/Constants";
import Upload from "@/components/Upload";
import CustomerService from "@/services/CustomerService"
import RoutingService from "@/services/RoutingService"
import TrainingStatusDialog from "../../components/TrainingStatusDialog.vue";
import _ from "lodash";
import {
    Loading
} from "element-ui";
import uuidv4 from "uuid/v4";
import EventBus from "@/EventBus";
import IntentInfoService from "@/services/IntentInfoService";

export default {
    name: "NerList",
    components: {
        DataTable,
        Upload,
        Loading,
        TrainingStatusDialog
    },
    data() {
        return {
            displayTrainingDialog: false,
            isQNACustomer: false,
            pageTitle: "NER",
            uploadParams: {},
            nerListTableParams: {
                apiName: `/portal/api/table/trn_ner_data`,
                queryParam: {
                    active: true,
                    // domain: this.setDefaultDomain()
                },
                tableName: "trn_ner_data",
                modelType: Constants.TRANING_MODEL_TYPES.NER_MODEL_TYPE,
                downloadOptions: {
                    label: "Download Sample File",
                    path: `${window.location.origin}/portal/api/process-file?fileName=NER.csv&alloweDelete=false`
                },
                isRestify: true,
                limit: 10,
                enableImport: true,
                enableExport: true,
                addButtonConfig: {
                    path: "/ner-form",
                    name: "Add NER"
                },
                tableAction: [{
                    label: 'Train model',
                    icon: "el-icon-setting",
                    size: "medium",
                    event: "trainModal"
                }],
            },
            title: "NER",
            domains: [],
            domain: [],
            displayUploadDialog: false,
            exportDataList: [],
            loadingInstance: '',
            isDomainSelected: false
        };
    },
    methods: {
        handleCloseDialog() {
            this.displayTrainingDialog = false
        },
        openNERForm() {
            this.$router.push({
                path: "/ner-form",
                query: {
                    isQNAType: this.isQNACustomer
                }
            });
            //this.$router.push({name:'ner-form', params: { isQNACustomer}})
        },
        onDomainChange(domain) {
            this.domain = domain;
        },
        async getDomain() {
            this.domains = await IntentInfoService.fetchDomainList().catch(
                (error) => {
                    this.notifyError("Error while fetching domains");
                });
        },

        trainModal() {
            if(this.isQNACustomer){
                this.startTrainer();
                return;
            }
            this.isDomainSelected = true;
        },

        async startTrainer() {
            let res = await TrainingService.start(this, this.domain, this.nerListTableParams.modelType).catch((err) => {
                this.isDomainSelected = false;
                this.notifyError("Error while training NER model");
            })
            if (res) {
                this.displayTrainingDialog = true;
            }
        },
        onExport() {
            let queryParam = this.nerListTableParams.queryParam;
            let endPoint = `${
        window.location.origin
      }/portal/api/table/trn_ner_data?exportCsv=true&query=${JSON.stringify(
        queryParam
      )}`;
            window.open(endPoint, "_self");
        },
        setDefaultDomain() {
            return _.values(Constants.DOMAINS)[0];
        },
        closeUploadDialog() {
            this.displayUploadDialog = false;
            EventBus.$emit('refreshTable');
            //this.$refs.datatable.refreshTable();
        },
        openUploadDialog() {
            this.displayUploadDialog = true;
        },
        setDomainForQNAcustomer(queryParam) {
            this.isQNACustomer = true
            this.domain = [Constants.DOMAINS['WA-WF']]
            queryParam.domain = Constants.DOMAINS['WA-WF']
        },
        showLoader(params) {
            this.loadingInstance = Loading.service({
                ...params
            });
        },

        hideLoader() {
            // Loading should be closed asynchronously
            if (this.loadingInstance) {
                this.loadingInstance.close();
                this.loadingInstance = null;
            }
        },

        init() {
            let queryParam = {
                active: true,
                // domain: this.setDefaultDomain()
            };
            this.$setLoader({
                target: '.container'
            })
            let user = this.$store.getters.user
            if (user.type === Constants.TRANING_MODEL_TYPES.QNA_MODEL_TYPE) {
                this.setDomainForQNAcustomer(queryParam)
            }
            Object.assign(this.nerListTableParams, {
                'apiName': `/portal/api/table/trn_ner_data`,
                'queryParam': queryParam
            })
        }
    },

    async beforeMount() {
        this.init()
        this.getDomain()
        setTimeout(() => {
            this.$resetLoader()
            //this.$refs.datatable.refreshTable();
            EventBus.$emit('refreshTable');
        }, 1000)
    },

    beforeDestroy() {
        this.$resetLoader()
    }

}
</script>

<style lang="scss">
@import "../../assets/scss/_variables";

.modal-dropdown {
    margin-bottom: 34px;

    .sub-heading {
        font-weight: 700;
        text-transform: uppercase;
        font-size: 0.875rem;
        display: block;
        margin-bottom: 7px;
    }
}

.taining-modal-container {
    .el-dialog__body {
        text-align: center !important;

        h1 {
            font-size: 44px;
            margin: 0;
        }

        // p {
        //     font-size: 32px;
        //     margin: 0;
        //     margin-bottom: 30px;
        // }
    }
}

.upload-file-container {
    .el-dialog__body {
        text-align: center;

        .file-name-container {
            border: 1px dashed;
            padding: 20px;
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
