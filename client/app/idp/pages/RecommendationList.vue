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
  name: "RecommendationList",
  components: {
    DataTable,
  },
  data() {
    return {
      count: 0,
      tableParams: {
        apiName: `/portal/api/table/recommendation_config`,
        queryParam: { 
          active: true
        },
        tableName: "recommendation_config",
        isRegxSearch:true,
        pageTitle: "Recommendation Services",
        initialSort: "created_at",
        isRestify: true,
        limit: 10,
        select:[],
        addButtonConfig: {
          path: "/idp/recommendations-form",
          name: "Add Service",
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
