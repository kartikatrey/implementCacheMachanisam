<template>
<el-main>
    <h1 class="kp-page-title">{{pageTitle}}</h1>
    <div class="table-wrap">
        <data-table :parameters="tableParams"></data-table>
    </div>
</el-main>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import DialogFlowService from "@/dialogflow/services/DialogFlowService";
export default {
    name: "ServiceConfigList",
    components: {
        DataTable
    },
    data() {
        return {
            count: 0,
            tableParams: {
                apiName: `/portal/api/table/workflow`,
                queryParam: {
                    active: true
                },
                tableName: "workflow",
                enableExport: true,
                isRestify: true,
                limit: 10,
                addButtonConfig: true,
                addButtonConfig: {
                    path: "/idp/workflow",
                    name: 'Add Workflow'
                },
            },
            pageTitle: "Workflow"
        };
    },
    methods: {},

    beforeMount() {}
};
</script>
