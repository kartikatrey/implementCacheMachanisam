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
import EventBus from "@/EventBus";
import DataTable from "../../components/DataTable.vue";

export default {
  name: "LookupConfiguration",
  components: {
    DataTable
  },
  data() {
    return {
      count: 0,
      tableParams: {
        apiName: `/portal/api/table/lookup_configuration`,
        queryParam: {},
        showPaginationOptions: true, // to show/hide pagination option
        tableName: "lookup_configuration",
        enableExport: false,
        isRegxSearch:true,
        isRestify: true,
        limit: 10,
        addButtonConfig: true,
        pageTitle: "Lookup Configuration",
        addButtonConfig: {
          path: "/idp/lookup-config-form",
          name: "Add Lookup"
        }      
      },
    };
  },
  methods: {
  },
  beforeMount() {
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
  },
};
</script>
