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
  import constants from "@/resources/Constants";
  
  export default {
   name: "LLM Setup",
   components: {
     DataTable,
   },
   data() {
     return {
       count: 0,
       tableParams: {
         apiName: constants.EXTRACTION_LLM_ENDPOINT,
         queryParam: {},
         tableName: "de_extraction_llm",
         pageTitle: "LLM List",
         enableExport: true,
         initialSort: "-updated_at",
         isRegxSearch:true,
         isRestify: true,
         limit: 10,
         addButtonConfig: true,
         addButtonConfig: {
           path: "/idp/llm-setup-form",
           name: "Add LLM",
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
  

<style lang="scss">
@import "../_idpGlobal.scss";
@import "../_idpVariables.scss";

</style>