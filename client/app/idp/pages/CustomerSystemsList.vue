<template>
  <el-main class="kp-main">
    <div class="table-wrap">
      <DataTable :parameters="tableParams"></DataTable>
    </div>
  </el-main>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import EventBus from "@/EventBus";
export default {
  name: "CustomerSystemLists",
  components: { DataTable },
  data() {
    return {
      count: 0,
      tableParams: {
        apiName: `/portal/api/table/customer_system`,
        tableName: "customer_system",
        queryParam: { active: true },
        enableExport: true,
        isRestify: true,
        limit: 10,
        pageTitle: "Systems",
        isRegxSearch:true,
        addButtonConfig: {
          path: "/idp/customer-system-form",
          name: " Add System",
        },
      },
      searchValue: "",
      pageTitle: "Systems",
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


