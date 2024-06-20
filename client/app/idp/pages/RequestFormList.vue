<template>
    <el-main class="kp-main">
      <section class="page-body">
        <div class="table-wrap" v-if="isLoaded">
          <DataTable :parameters="tableParams">{{ tableParams }}</DataTable>
        </div>
      </section>
    </el-main>
  </template>
  
  <script>
  import EventBus from "@/EventBus";
  import DataTable from "../../components/DataTable.vue";
  import CustomerConfig from "@/idp/services/DeCustomerConfig";
  import RequestActionService from "../../../app/services/RequestActionService";
  export default {
    name: "RequestFormList",
    components: {
      DataTable
    },
    data() {
      return {
        isLoaded:false,
        tableParams: {
          apiName: `/portal/api/table/de_request_form_action`,
          queryParam: {
            active: true
          },
          aggregation: true,
          showPaginationOptions: true,
          tableName: "request_form_action",
          isRegxSearch:true,
          isRestify: true,
          limit: 10,
          showSortOptions: true,
          initialSort: "-created_at",
          customfilter: false,
          pageTitle: "All Form Trigger Actions",
          addButtonConfig: {
            path: "/idp/request-config-form",
            name: "Add Form Trigger Action"
          },
          actionItems: [
              {
                icon: "mdi mdi-delete",
                name: "Delete",
                inline: true,
                event_name: "delete_request_form_action",
                hideCondition: (propData) =>
                  propData.row.is_custom_field ? false : true
              }
          ]        
        },
      };
    },
    methods: {
      //method for deleting particular row 
      async deleteField(field){  
        const record = field.row; 
        const params = {
          _id: record._id, 
          name: record.name,
          is_custom_field: record.is_custom_field,
          document_type: record.document_type
        };
        const response = await RequestActionService.deleteRequestAction(record._id, params).catch((err)=>{
          this.notifyError("Error while deleting field!");          
          return;
        });   
        if(response){
          this.notifySuccess("Record deleted successfully.");
          EventBus.$emit("refreshTable");
          EventBus.$emit("tableRecordDeleted", record);
        }
      },
      //method to initialize document_type
      async initializeDocumentTypes(){
        const customerConfigurations = await CustomerConfig.getAllDocsCustConfiguration({document_type:{$exists:true}});
        const documentTypes =CustomerConfig.getDocumentTypeList(customerConfigurations);
        const types = documentTypes.map(doc=>doc.value);
        this.tableParams.queryParam.document_type = {$in:types};
        this.isLoaded = true;
      }
    },
    async beforeMount() {
       this.$store.commit("setDisplayIdpTree",false);
       this.$store.commit("setDisplayIdpNavbar",true);
       await this.initializeDocumentTypes();
       EventBus.$on("delete_request_form_action", field => {
         this.deleteField(field);
       });
    },
    beforeDestroy() {
     EventBus.$off(["delete_request_form_action"]);
    }
  };
  </script>