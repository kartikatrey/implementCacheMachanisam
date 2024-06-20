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
  name: "DocumentAssignmentRuleList",
  components: {
    DataTable,
  },
  data() {
    return {
      count: 0,
      tableParams: {
        apiName: `/portal/api/table/de_document_assignment_rule`,
        queryParam: {
          active: true
        },
        tableName: "de_document_assignment_rule",
        pageTitle: "Document Assignment Rules",
        initialSort: "-created_at",
        enableExport: true,
        isRegxSearch:true,
        isRestify: true,
        limit: 10,
        addButtonConfig: true,
        addButtonConfig: {
          path: "/idp/document-assignment-rule-form",
          name: "Add Document Assignment Rule",
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
