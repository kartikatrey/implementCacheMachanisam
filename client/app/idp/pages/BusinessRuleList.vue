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
import EventBus from "@/EventBus";

export default {
  name: "BusinessRuleList",
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
        pageTitle: "Business Rules",
        initialSort: "-updated_at",
        enableExport: true,
        isRegxSearch:true,
        isRestify: true,
        limit: 10,
        addButtonConfig: true,
        addButtonConfig: {
          path: "/idp/business-rule-form",
          name: "Add Business Rule",
        },
      }
    };
  },
  methods: {},

  beforeMount() {
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
  },
};
</script>
