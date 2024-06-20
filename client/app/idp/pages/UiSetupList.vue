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
import constants from "@/resources/Constants";
export default {
  name: "UiSetupList",
  components: { DataTable },
  data() {
    return {
     
      tableParams: {
        apiName: "/portal/api/table/customer_configuration",
        tableName: "customer_configuration",
        queryParam: {  
        },
        isRegxSearch: true,
        enableExport: false,
        isRestify: true,
        pageTitle: "UI Setup", 
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