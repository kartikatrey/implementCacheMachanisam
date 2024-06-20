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
  
  export default {
    name: "KsModel",
    components: {
      DataTable,
    },
    data() {
      return {
        count: 0,
        tableParams: {
          apiName: `/portal/api/table/ks_model`,
          queryParam: {
            active: true,
          },
          pageTitle: "Models",
          tableName: "ks_model",
          isRegxSearch: true,
          initialSort: "-updated_at",
          enableExport: true,
          isRestify: true,
          limit: 10,
          addButtonConfig: true,
          addButtonConfig: {
            path: "/idp/model-form",
            name: "Add Model",
          },
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
  