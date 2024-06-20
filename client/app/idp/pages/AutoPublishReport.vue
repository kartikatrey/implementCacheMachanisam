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
  name: "AutoPublishReport",
  components: {
    DataTable,
  },
  data() {
    return {
      tableParams: {
        apiName: `/portal/api/table/de_document`,
        tableName: "auto_publish_report",
        enableExport: true,
        limit: 10,
        aggregation: true,
        isRegxSearch:true,
        isRestify: true,
        pageTitle:"Auto Publish Failure Report",
        customExportEndpoint  : "/api/autoPublishReport",
        queryParam : {
          autoPublishReport : true,
        }
      },
    };
  },
};
</script>

<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";
</style>
