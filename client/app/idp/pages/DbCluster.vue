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
   import EventBus from "@/EventBus";
   export default {
       name: "DbCluster",
       components: {
           DataTable
       },
       data() {
           return {
               endpoint: constants.SCHEDULAR_ENDPOINT,
               tableParams: {
                   apiName: `/portal/api/table/db_cluster`,
                   initialSort: "-updated_at",
                   tableName: "dbCluster",
                   pageTitle: "DB Clusters",
                   isRegxSearch:true,
                   enableExport:true,
                   isRestify: true,
                   limit: 10,
                   addButtonConfig: true,
                   addButtonConfig:{path:"/idp/db-cluster-form",name:'Add cluster'},
               },       
               pageTitle:"DB Clusters"
           };
       },
       methods: {
          
       },
       beforeMount() {
           this.$store.commit("setDisplayIdpTree",false);
           this.$store.commit("setDisplayIdpNavbar",true);
          
       }
   };
   </script>
   
   <style lang="scss">
   @import "../../assets/scss/_variables";
   
   </style>
   