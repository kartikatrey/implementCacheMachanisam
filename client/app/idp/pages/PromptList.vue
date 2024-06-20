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
 name: "PromptList",
 components: {
   DataTable,
 },
 data() {
   return {
     count: 0,
     tableParams: {
       apiName: constants.PROMPT_ENDPOINT,
       queryParam: {},
       tableName: "prompt",
       pageTitle: "Prompt List",
       initialSort: "-updated_at",
       enableExport: true,
       isRegxSearch:true,
       isRestify: true,
       limit: 10,
       addButtonConfig: true,
       addButtonConfig: {
         path: "/idp/prompt-form",
         name: "Add Prompt",
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
