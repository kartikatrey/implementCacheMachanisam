<template>
<el-main class="kp-main">
    <div class="table-wrap">
        <data-table :parameters="tableParams"></data-table>
    </div>
</el-main>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import Constants from "@/resources/Constants";
import EventBus from "@/EventBus";
export default {
    name: "DialogFlowList",
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
                pageTitle: "Workflows",
                isRegxSearch:true,
                tableName: "workflow",
                enableExport: true,
                isRestify: true,
                limit: 10,
                addButtonConfig: true,
                addButtonConfig: {
                    path: "/idp/workflow",
                    name: 'Add workflow',
                    params:{workflowType: Constants.WORKFLOW.TYPE.DOCEX}
                },
            },
            
        };
    },
    methods: {},

    beforeMount() {
            this.$store.commit("setDisplayIdpTree",false);
            this.$store.commit("setDisplayIdpNavbar",true);
    }
};
</script>
