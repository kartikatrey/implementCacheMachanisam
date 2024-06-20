<template>
<el-main>
    <h1 class="kp-page-title">{{pageTitle}}</h1>
    <div class="table-wrap">
        <data-table :parameters="tableParams" @refreshCount="onTableUpdate" ref="datatable"></data-table>
    </div>
</el-main>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import TableAPIService from "@/services/TableAPIService";
import CommonService from "@/services/CommonService";
import constants from "@/resources/Constants";

export default {
    name: "TrnConfigurationList",
    components: {
        DataTable
    },
    data() {
        return {
            endpoint: constants.TRN_CONFIGURATION_ENDPOINT,
            tableParams: {
                apiName: `/portal/api/table/trn_configuration`,
                queryParam: {
                    active: true
                },
                tableName: "trn_configuration",
                enableExport: true,
                isRestify: true,
                limit: 10,
                addButtonConfig: {
                    path: "/trn-configuration-form",
                    name: 'Add config'
                },
            },
            pageTitle: "Training Configuration"
        };
    },
    methods: {},
    beforeMount() {}
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";
</style>
