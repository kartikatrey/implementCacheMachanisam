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
import CommonService from "@/services/CommonService";
import constants from "@/resources/Constants";

export default {
    name: "KttTrainMethodConfigList",
    components: {
        DataTable
    },
    data() {
        return {
            endpoint: constants.KTT_TRAIN_METHOD_CONFIG_ENDPOINT,
            tableParams: {
                apiName: `/portal/api/table/ktt_train_method_config`,
                queryParam: {
                    active: true
                },
                tableName: "ktt_train_method_config",
                enableExport: true,
                isRestify: true,
                limit: 10,
                addButtonConfig: {
                    path: "/ktt-train-method-config-form",
                    name: 'Add configuration'
                },
            },
            pageTitle: "Training Configuration "
        };
    },
    methods: {
    },
    beforeMount() {
    }
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";
</style>
