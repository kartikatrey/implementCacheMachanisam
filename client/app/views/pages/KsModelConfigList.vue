<template>
<el-main>
    <h1 class="kp-page-title">{{pageTitle}}</h1>
    <div class="table-wrap">
        <data-table :parameters="tableParams" ref="datatable"></data-table>
    </div>

</el-main>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import CommonService from "@/services/CommonService";
import constants from "@/resources/Constants";
export default {
    name: "ksModelConfigList",
    components: {
        DataTable
    },
    data() {
        return {
            endpoint: constants.KS_MODEL_ENDPOINT,
            tableParams: {
                apiName: `/portal/api/table/ks_model`,
                queryParam: {
                    active: true
                },
                tableName: "ks_model",
                enableExport: true,
                isRestify: true,
                initialSort:"-createdAt",
                limit: 10,
                addButtonConfig: {
                    path: "/ks-model-config-form",
                    name: 'Add model'
                },
            },
            pageTitle: "KS model"
        };
    },
    methods: {},
    beforeMount() {}
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";
</style>
