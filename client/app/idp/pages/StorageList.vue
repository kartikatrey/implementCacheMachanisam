<template>
  <el-main class="kp-main">
    <section class="page-body">
      <div class="table-wrap">
        <DataTable :parameters="requiredParams"></DataTable>
      </div>
    </section>
  </el-main>
</template>

<script>
import DataTable from "../../components/DataTable.vue";
import EventBus from "@/EventBus";

export default {
  name: "StorageList",
  components: {
    DataTable,
  },
  data() {
    return {
      requiredParams: {
        apiName: "/portal/api/table/de_storage_configuration", //add your API url here
        queryParam: {
          active: true,
        },
        showPaginationOptions: true, // to show/hide pagination option
        tableName: "de_storage_configuration", // it is use to get headers of table from tableHeaderConfig.js
        enableExport: true,
        isRestify: true,
        isRegxSearch: true,
        pageTitle: "Storage",
        limit: 10, // to limit the number of records to be fetched
        addButtonConfig: {
          path: "/idp/storage-form",
          name: "Add Storage",
        },
      }
      
    };
  },
  methods: {},
  beforeMount(){
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
  }
};
</script>
