<template>
<el-main>
    <h1 class="kp-page-title">{{pageTitle}}</h1>
        <div class="table-wrap">

            <data-table :parameters="tableParams" :columnTemplate="columnTemplate" ref="customer"></data-table>
        </div>
    </div>
    <div>
        <el-dialog width="38%" class="confirmation-box" title="Confirmation" :before-close="handleCloseDialog" :visible.sync="showConfirmationDialog">
            <el-form :model="form" :rules="rules" ref="form" label-width="178px" class="demo-form">
                <el-form-item label="Tensorflow serving host" prop="tf_host">
                    <el-select class="config-value" v-model="form.tf_host" placeholder="Select tensorflow host">
                        <el-option v-for="(item, index) in config.tf_host" v-bind:value="item" :key="item" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Kanverse serving host" prop="serving_host">
                    <el-select class="config-value" v-model="form.serving_host" placeholder="Select kanverse serving host">
                        <el-option v-for="(item, index) in config.serving_host" v-bind:value="item" :key="item" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('form')">Confirm</el-button>
                    <el-button @click="handleCloseDialog">Close</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
    <!-- </div> -->
</el-main>
</template>

<script>
import DataTable from "../../components/DataTable.vue";
import TableAPIService from "../../services/TableAPIService";
import AjaxService from "../../services/AjaxService";
import lodash from "lodash";
let tableApiService = new TableAPIService();
import EventBus from "@/EventBus";
import cutomerOnboardingService from "../../services/CustomerOnboardingService";
import configService from "../../services/ConfigService";
import {
    Loading
} from "element-ui";

export default {
    name: "CustomerOnboarding",
    components: {
        DataTable,
        Loading
    },
    data() {
        return {
            abc: true,
            totalRegistrations: 0,
            pendingRegistrations: 0,
            activeRegistrations: 0,
            config: {
                tf_host: [],
                serving_host: []
            },
            form: {
                tf_host: '',
                serving_host: ''
            },
            rules: {
                tf_host: [{
                    required: true,
                    message: 'Please select tensorflow host',
                    trigger: 'change'
                }],
                serving_host: [{
                    required: true,
                    message: 'Please select kanverse serving host',
                    trigger: 'change'
                }]
            },
            tableParams: {
                apiName: `/portal/api/table/customer_registration`,
                queryParam: {},
                tableName: "customer_onboarding",
                
                enableExport: true,
                initialSort: "-created_on",
                isRestify: true,
                limit: 10,
                headerWidget:[]               
            },
            pageTitle:"Pending registrations",
            tf_host: null,
            serving_host: null,
            loadingInstance: null,
            showConfirmationDialog: false,

        };
    },
    methods: {

        handleCloseDialog() {
            this.showConfirmationDialog = false;
            this.resetDialogBoxForm()
        },

        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.showConfirmationDialog = false
                    this.sendActivationLink()
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        columnTemplate(props) {
            var htmlTemplate = "";
            if (props.row["active"]) {
                htmlTemplate = `<div data-v-c0ac797e="" class="el-badge mark"><sup class="badge-active">Active</sup></div>`;
            } else {
                htmlTemplate = `<div data-v-c0ac797e="" class="el-badge mark"><sup class="badge-pending">Pending</sup></div>`;
            }
            return htmlTemplate;
        },
        // refreshCount() {
        //     // this.getCount();
        // },
        getCount() {

            cutomerOnboardingService.fetchCount()
                .then((response) => {
                    this.totalRegistrations = _.get(response, 'data.response.totalRegistrations[0]["count"]') || 0
                    this.pendingRegistrations = _.get(response, 'data.response.pendingRegistrations[0]["count"]') || 0;
                    this.activeRegistrations = _.get(response, 'data.response.activeRegistrations[0]["count"]') || 0;

                    this.tableParams.headerWidget = [
                    {
                        label:"Total Registrations",
                        value:this.totalRegistrations
                    },
                    {
                        label:"Active Registrations",
                        value:this.activeRegistrations
                    },
                    {
                        label:"Pending Registrations",
                        value:this.pendingRegistrations
                    }
                ]
                })
                .catch((errorMessage) => {
                    this.$notify.error({
                        title: errorMessage
                    });

                })
        },

        sendActivationLink() {
            this.showConfirmationDialog = false
            let payload = this.data.row
            let index = this.data.index
            payload['tf_host'] = this.form.tf_host
            payload['serving_host'] = this.form.serving_host
            let requestData = {
                payload
            }
            this.showLoader({
                target: `tr:nth-child(${index+1}) #approve-button`,
                spinner: 'el-icon-loading'
            })
            cutomerOnboardingService.activate(requestData)
                .then((successMessage) => {
                    this.$notify({
                        title: successMessage,
                        type: "success"
                    });
                    //this.$refs["customer"].refreshTable();
                    EventBus.$emit('refreshTable');
                })
                .catch((errorMessage) => {
                    this.$notify.error({
                        title: errorMessage
                    });
                })
                .finally(() => {
                    this.data = null
                    this.resetDialogBoxForm()
                    this.hideLoader()
                })

        },
        resetDialogBoxForm() {
            this.$refs['form'].resetFields();
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
        async init() {
            EventBus.$on('approveRequest', (data) => {
                this.data = data
                this.showConfirmationDialog = true
            })
            let res = await configService.fetch()
            this.config = {
                'tf_host': res.tf_host,
                'serving_host': res.serving_host
            }
        }
    },
    async beforeMount() {
        this.init()
        this.getCount()
    },

    beforeDestroy() {
        EventBus.$off('approveRequest')
    }
}
</script>

<style lang="scss">
@import "../../assets/scss/_variables";

.confirmation-box {
    el-row {
        margin-bottom: 5px
    }

    .config-value {
        width: 241px
    }

    .label {
        text-align: right;
        top: 9px;
        position: relative;
    }
}

.badge-active {
    background-color: white;
    border-radius: 10px;
    color: rgba(66, 240, 153, 0.7);
    display: inline-block;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    padding: 0 6px;
    text-align: center;
    white-space: nowrap;
    border: 1px solid rgba(66, 240, 153, 0.7);
    width: 45px;
}

.badge-pending {
    background-color: white;
    border-radius: 10px;
    color: rgba(242, 205, 91, 1);
    display: inline-block;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    padding: 0 6px;
    text-align: center;
    white-space: nowrap;
    border: 1px solid rgba(242, 205, 91, 0.7);
    width: 45px;
}



</style>
