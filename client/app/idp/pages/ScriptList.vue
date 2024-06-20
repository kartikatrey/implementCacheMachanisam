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
  name: "ScriptList",
  components: {
    DataTable,
  },
  data() {
    return {
      count: 0,
      tableParams: {
        apiName: `/portal/api/table/script`,
        queryParam: {
          active:true
        },
        tableName: "script",
        pageTitle: "All Scripts",
        initialSort: "-created_at",
        enableExport: true,
        isRestify: true,
        isRegxSearch:true,
        limit: 10,
        addButtonConfig: {
          path: "/idp/script-form",
          name: "Add Script",
        },
      }
    };
  },
  methods: {},
  created(){
    let routeParams = this.$route.query;
    if(routeParams){
      let type = routeParams.type;
      // Since we previously displayed scripts of all types in the scripts menu, now that the export scripts menu has been created, 
      // we only display scripts of type export in the export scripts menu, so here we explicitly check whether the type is export or not. 
      // This should not change the current flow, which includes displaying all other script types in the scripts menu.
      if(['export','after_extraction', 'after_classification'].includes(type)){
        this.tableParams.queryParam.type = type;
        this.tableParams.addButtonConfig.path = `/idp/script-form?type=${type}`
      }
      else{
        this.tableParams.queryParam.type = { $nin : ['export','after_extraction', 'after_classification'] };
      }
    }
  },
  beforeMount() {
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
  },
};
</script>
