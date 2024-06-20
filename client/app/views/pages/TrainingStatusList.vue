<template>
<el-main>
    <h1 class="kp-page-title">{{pageTitle}}</h1>
        <div class="table-wrap">
            <data-table :parameters="tableParams" :columnTemplate="columnTemplate" ref="datatable"></data-table>
        </div>

</el-main>
</template>

<script>
import DataTable from "../../components/DataTable.vue";
import TableAPIService from "../../services/TableAPIService";
import AjaxService from "../../services/AjaxService";
import {
    Loading
} from "element-ui";
import CustomerService from "@/services/CustomerService"
import lodash from 'lodash'
import Constants from "@/resources/Constants";
import EventBus from "@/EventBus";
let tableApiService = new TableAPIService();
let tblData = {};

import {
    _
} from "vue-underscore";
export default {
    name: "TrainingStatusList",
    components: {
        DataTable,
        Loading
    },

    data() {
        return {
            allLeads: 0,
            pageTitle:"Training status",
            tableParams: {
                apiName: null,
                queryParam: null,
                showPaginationOptions: true,
                tableName: "trn_status",
                initialSort: "-created_on",
                enableExport: true,
                isRestify: true,
                limit: 10
            },
            loadingInstance: null
        };
    },
    methods: {
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

        hideRouterData(queryParam) {
            queryParam = {
                'model_type': {
                    '$ne': 'ROUTER'
                }
            }
        }
    },

    async beforeMount() {
        let apiName = '/portal/api/table/trn_status'
        let queryParam = {}
        this.showLoader({
            target: '.container'
        })
        let user = this.$store.getters.user
        if (user.type === Constants.TRANING_MODEL_TYPES.QNA_MODEL_TYPE) {
            queryParam = {
                'model_type': {
                    '$ne': 'ROUTER'
                }
            }
        }
        Object.assign(this.tableParams, {
            'apiName': apiName,
            'queryParam': queryParam
        })
        this.hideLoader();
        EventBus.$emit('refreshTable');
        //this.$refs.datatable.refreshTable();

    },

    beforeDestroy() {
        this.hideLoader()
    }

};
</script>
