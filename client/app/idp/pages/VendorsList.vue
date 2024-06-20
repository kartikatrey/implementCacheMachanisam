<template>
    <el-main class="kp-main">
     <section class="page-body">
       <div class="table-wrap vendor-list-table">
         <DataTable :parameters="tableParams"></DataTable>
       </div>
     </section>
   </el-main>
 </template>
 
 <script>
 import DataTable from "@/components/DataTable.vue";
 import DocumentScriptService from "@/idp/services/DocumentScriptService";
 import EventBus from "@/EventBus";
 import Constants from "@/resources/Constants";
 import VendorService from "@/idp/services/VendorService";

 export default {
   name: "VendorsList",
   components: {
     DataTable,
   },
   computed: {
     tableParams() {
       return {
         apiName: `/portal/api/table/ap_vendors`,
         tableName: "ap_vendors",
         pageTitle: "Vendors",
         isRegxSearch:true,
         initialSort: "-created_at",
         isRestify: true,
         limit: 10,
         addButtonConfig: true,
         addButtonConfig: {
           path: "/idp/vendor/vendor-form",
           name: "Add Vendor",
         },
         extraButtons :[
          {
            event: "importAllVendors",
            name: "Import",
            disable: this.disableImportBtn
          }       
        ]
       }
     }
   },
   data() {
     return {
       allBusEvents:[],
       disableImportBtn: false
     };
   },
   methods: {
    registerEvents(){
      this.allBusEvents = ["importAllVendors"];
      EventBus.$on("importAllVendors",()=>{
        this.importAllVendors()
      })
    },
    deRegisterEvents() {
      EventBus.$off(this.allBusEvents);
    },
    async importAllVendors() {
      try {
        this.disableImportBtn = true; 
        //We are using AUTO_COMPLETE script, to get all vendors from ERP
        //if we don't pass anything in search params in that script, it returns all the data
        //Here in this case it will return all vendors from ERP as we have not passed anything in search params
        const payload = {
          'document_type': 'invoice',
          'field_name': 'vendor_name',
          'field_value': '',
          'script_type': Constants.DOCEX.SCRIPT_TYPE.AUTO_COMPLETE, 
          'document_id': '',
          'form': {}
        }
        const importedVendorsResponse = await DocumentScriptService.run(payload);
        if(importedVendorsResponse.statusCode == 200){
          this.disableImportBtn = false;
        }
        const importedVendorsData = _.get(importedVendorsResponse,'data.body',[]);
        if (!importedVendorsData.length) {
          this.notifyError("Error occured while fetching vendors from ERP");
          return;
        }
        let importedVendors = [];
        for (let vendorData of importedVendorsData) {
          importedVendors.push({ vendor_id: vendorData.key, name: vendorData.value })
        }
        //createImportedVendors saves all imported vendors from ERP into Kanverse DB
        const vendorImportRes = await VendorService.createImportedVendors({ data: importedVendors });
        if (vendorImportRes) {
          const successMessage = "Vendors imported successfully."
          this.notifySuccess(successMessage);
          EventBus.$emit('refreshTable');
        }
      } catch (error) {
        this.disableImportBtn = false;
        this.notifyError(error);
      }
    }
   },
   beforeMount() {
     this.$store.commit("setDisplayIdpTree",false);
     this.$store.commit("setDisplayIdpNavbar",true);
     this.registerEvents();
   },
   beforeDestroy() {
      this.deRegisterEvents();
   }
 };
 </script>
 
 <style lang="scss">
  @import "../_idpGlobal";
  .vendor-list-table{
    .table-toolbar .export-btn{
      margin-left: 0rem;
    }
  }
 </style>
