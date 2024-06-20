<template>
    <el-main class="kp-main">
        <section class="page-body">
            <div class="table-wrap">
                <DataTable :parameters="tableParams"></DataTable>
            </div>
        </section>
    </el-main>
</template>
  
<script>
import DataTable from "@/components/DataTable.vue";
import EventBus from "@/EventBus";

export default {
    name: "EmailsList",
    components: {
        DataTable,
    },
    data() {
        return {
            tableParams: {
                apiName: `/portal/api/table/emails`,
                queryParam: {
                    active: true
                },
                tableName: "emails",
                pageTitle: "Email",
                enableExport: false,
                isRestify: true,
                isRegxSearch:true,
                addButtonConfig: true,
                addButtonConfig: {
                    path: "/idp/email-form",
                    name: "Add Email Template",
                },
            },
        };
    },
    beforeMount() {
        this.$store.commit("setDisplayIdpTree",false);
        this.$store.commit("setDisplayIdpNavbar",true);
    },
};
</script>

  