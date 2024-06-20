<template>
<el-main class="kp-main">
    <div class="table-wrap">
      <DataTable
        :parameters="tableParams"
        componentName="ActiveInactiveButtons"
      ></DataTable>
    </div>
  </el-main>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import EventBus from "@/EventBus";

export default {
  name: "DocumentSetupList",
  components: { DataTable },
  data() {
    return {
      tableParams: {
        apiName: "/portal/api/table/de_customer_configuration",
        showPaginationOptions: true,
        tableName: "idp_document_configuration",
        queryParam: {},
        initialSort: "document_type",
         isRegxSearch:true,
        enableExport: false,
        isRestify: true,
        pageTitle: "All Document Types",
        limit: 10,
        addButtonConfig: { path: "/idp/document-setup", name: "Add Document Type" },
      },
    };
  },
  methods: {},
  beforeMount() {
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
  },
};
</script>



<style lang="scss">
@import "../_idpGlobal.scss";
@import "../_idpVariables.scss";

</style>