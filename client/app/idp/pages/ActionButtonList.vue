<template>
  <el-main class="kp-main">
    <section class="page-body">
      <div class="table-wrap" v-if="isLoaded">
        <DataTable :parameters="tableParams"></DataTable>
      </div>
    </section>
  </el-main>
</template>

<script>
import EventBus from "@/EventBus";
import DataTable from "../../components/DataTable.vue";
import CustomerConfig from "@/idp/services/DeCustomerConfig";
import FieldService from "../../idp/services/FieldService"
export default {
  name: "DocumentFields",
  components: {
    DataTable
  },
  data() {
    return {
      count: 0,
      isLoaded:false,
      tableParams: {
        apiName: `/portal/api/table/de_action`,
        queryParam: {},
        showPaginationOptions: true, // to show/hide pagination option
        tableName: "de_action",
        enableExport: true,
        isRegxSearch:true,
        isRestify: true,
        limit: 10,
        addButtonConfig: true,
        pageTitle: "All Action Buttons",
        addButtonConfig: {
          path: "/idp/action-button-config-form",
          name: "Add Action"
        },
        actionItems: [
            {
              icon: "mdi mdi-delete",
              name: "Delete",
              inline: true,
              event_name: "delete_field",
              hideCondition: (propData) =>
                propData.row.is_custom_field ? false : true
            }
        ]        
      },
    };
  },
  methods: {
    async deleteField(field){  
      let record = field.row;      
      let params = {
        _id: record._id, 
        name: record.name,
        is_custom_field: record.is_custom_field,
        document_type: record.document_type
      };
      let response = await FieldService.deleteField(record._id, params).catch((err)=>{
        this.notifyError("Error deleting field. Please inactivate the business rules for field(if any) and try again.");          
        return;
      });   
      if(response){
        this.notifySuccess("Record deleted successfully.");
        EventBus.$emit("refreshTable");
        EventBus.$emit("tableRecordDeleted", record);
      }
    },
  async getConfiguration(){
      let customerConfigurations = await CustomerConfig.getAllDocsCustConfiguration({document_type:{$exists:true}});
      const documentTypes =CustomerConfig.getDocumentTypeList(customerConfigurations);
      const types = documentTypes.map(doc=>doc.value);
      this.tableParams.queryParam.document_type = {$in:types};
      this.isLoaded = true;
    }
  },
  async beforeMount() {
    await this.getConfiguration();
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
  }
//   beforeDestroy() {
//     EventBus.$off(["delete_field"]);
//   }
};
</script>
