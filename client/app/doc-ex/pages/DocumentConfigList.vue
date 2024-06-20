<template>
  <el-main>
    <h1 class="kp-page-title">{{pageTitle}}</h1>

    <div class="table-wrap">
      <DataTable
        :parameters="tableParams"
        componentName="ActiveInactiveButtons"
      ></DataTable>
    </div>
  </el-main>
</template>

<script>
import DataTable from "../../components/DataTable.vue";
import EventBus from "@/EventBus";

export default {
  name: "DocumentConfigList",
  components: { DataTable },
  data() {
    return {
      tableParams: {
        apiName: "/portal/api/table/de_customer_configuration",
        showPaginationOptions: true,
        tableName: "de_customer_configuration",
        queryParam: {},
        initialSort: "document_type",
        enableExport: false,
        isRestify: true,
        limit: 10,
        addButtonConfig: { path: "/document-form", name: "Add document" },
      },
      pageTitle: "All documents",
    };
  },
  methods: {},
  beforeMount() {
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
  },
};
</script>



