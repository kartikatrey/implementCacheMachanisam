<template>
    <el-main class="kp-main">
        <div class="table-wrap">
          <DataTable :parameters="customerConfigParams"></DataTable>
        </div>
    </el-main>
 </template>
    
<script>
import DataTable from "@/components/DataTable.vue";

export default {
    name: "VendorDocumentSetupList",
    components: { DataTable },
    data() {
        return {
            customerConfigParams: {
                apiName: "/portal/api/table/de_customer_configuration",
                showPaginationOptions: true,
                tableName: "idp_document_configuration",
                queryParam: { document_type: 'invoice'},
                initialSort: "document_type",
                select: ["document_type", "created_at", "created_by", "updated_at", "updated_by"],
                isRegxSearch: true,
                enableExport: false,
                isRestify: true,
                pageTitle: "All Document Types",
                limit: 10
            },
        };
    },
    methods: {},
    beforeMount() {
        this.$store.commit("setDisplayIdpTree", false);
        this.$store.commit("setDisplayIdpNavbar", true);
    },
};
</script>
      
<style lang="scss">
@import "../_idpGlobal.scss";
@import "../_idpVariables.scss";
</style>