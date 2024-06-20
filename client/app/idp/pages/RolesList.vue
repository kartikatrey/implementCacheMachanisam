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
  name: "DomainVendorMapList",
  components: {
    DataTable,
  },
  data() {
    return {
      count: 0,
      tableParams: {
        apiName: `/portal/api/table/cp_role`,
        queryParam: { 
          active: true,
          is_idp:true
        },
        tableName: "cp_roles",
        isRegxSearch:true,
        pageTitle: "All Roles",
        initialSort: "created_at",
        isRestify: true,
        limit: 10,
        select:["label","name","updated_by","updated_at"]
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
