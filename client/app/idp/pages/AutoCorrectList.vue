<template>
  <el-main class="kp-main">
   <section class="page-body">
     <div class="table-wrap">
       <DataTable :parameters="tableParams"></DataTable>
     </div>
     <upload v-if="showUploadDialog" :parameters="fileUploadParameters" :dialogShow.sync="showUploadDialog" @closeDialog="closeDialog">
    </upload>
   </section>
 </el-main>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import EventBus from "@/EventBus";
import Upload from "@/components/Upload";
import Constants from "@/resources/Constants";

export default {
 name: "AutoCorrectList",
 components: {
   DataTable,
   Upload
 },
 data() {
   return {
     count: 0,
     showUploadDialog: false,
     tableParams: {
       apiName: `/portal/api/table/de_auto_correct_data`,
       queryParam: { active: true },
       tableName: "de_auto_correct_data",
       pageTitle: "Auto Correct",
       initialSort: "-created_at",
       enableExport: true,
       isRegxSearch:true,
       isRestify: true,
       limit: 10,
       allBusEvents : [],
       addButtonConfig: true,
       addButtonConfig: {
         path: "/idp/auto-correct-form",
         name: "Add Auto Correct",
       },
       extraButtons :[
        {
          event: "import_auto_correct",
          id: "import-btn",
          name: "Import",
        },          
      ],
     },
     fileUploadParameters: {
      endpoint: "/api/auto-correct", 
      title:"Upload",
      valid_file_types:Constants.DOCEX.SPREADSHEET_VALID_FILETYPES
     }
   };
 },
 methods: {
    importDialog() {
      this.showUploadDialog = true;
    },
    closeDialog(){
      this.showUploadDialog = false;
      this.refreshTable();
    },
    refreshTable() {
      EventBus.$emit("refreshTable");
    },
    registerEvents() {
      this.allBusEvents = ['import_auto_correct', 'REFRESH_TABLE'];
      console.log("Event triggerd")
      EventBus.$on("import_auto_correct",()=>{
        this.importDialog();
      })
    }
 },

 beforeMount() {
   this.$store.commit("setDisplayIdpTree",false);
   this.$store.commit("setDisplayIdpNavbar",true);
   this.registerEvents();
 },
};
</script>
