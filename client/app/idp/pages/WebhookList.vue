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
    name: "webhookList",
    components: {
        DataTable
    },
    data() {
        return {
            count: 0,
            tableParams: {
                apiName: `/portal/api/table/de_webhook`,
                queryParam: {
                    active: true
                },
                pageTitle: "Webhook",
                tableName: "de_webhook",
                enableExport: false,
                isRestify: true,
                limit: 10,
                isRegxSearch:true,
                addButtonConfig: true,
                addButtonConfig: {
                    path: "/idp/webhook/add",
                    name: 'Add Webhook'
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
