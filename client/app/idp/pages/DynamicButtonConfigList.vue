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
import Constants from "@/resources/Constants";


export default {
  name: "DynamicButtonConfig",
  components: {
    DataTable,
  },
  data() {
    return {
      count: 0,
      tableParams: {
        apiName:Constants.DE_ACTION_ENDPOINT,
        queryParam: { 
          active: true
        },
        tableName: "dynamic_action_button_config",
        pageTitle: "Dynamic button list",
        initialSort: "-created_at",
        enableExport: true,
        isRestify: true,
        limit: 10
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
