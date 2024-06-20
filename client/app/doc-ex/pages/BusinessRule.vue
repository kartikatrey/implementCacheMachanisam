<template>
  <el-main>
    <h1 class="kp-page-title">{{ pageTitle }}</h1>
    <div class="table-wrap">
      <data-table :parameters="tableParams"></data-table>
    </div>
  </el-main>
</template>

<script>
import DataTable from "@/components/DataTable.vue";

export default {
  name: "BusinessRule",
  components: {
    DataTable,
  },
  data() {
    return {
      count: 0,
      tableParams: {
        apiName: `/portal/api/table/de_business_rule`,
        queryParam: {
          active: true
        },
        tableName: "de_business_rule",
        enableExport: true,
        isRestify: true,
        limit: 10,
        addButtonConfig: true,
        addButtonConfig: {
          path: "/business-rule-form",
          name: "Add Business Rule",
        },
      },
      pageTitle: "Business Rules",
    };
  },
  methods: {},

  beforeMount() {},
};
</script>
