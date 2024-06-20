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
import EventBus from "@/EventBus";
import DataTable from "../../components/DataTable.vue";
import DialogFlowService from "@/dialogflow/services/DialogFlowService";
import FieldService from "../../idp/services/FieldService"
export default {
  name: "UserGroups",
  components: {
    DataTable
  },
  data() {
    return {
      count: 0,
      tableParams: {
        apiName: `/portal/api/table/cp_group`,
        queryParam: {
          active: true
        },
        showPaginationOptions: true, // to show/hide pagination option
        tableName: "user_groups",
        enableExport: false,
        isRegxSearch:true,
        isRestify: true,
        limit: 10,
        addButtonConfig: true,
        pageTitle: "All User Groups",
        addButtonConfig: {
          path: "/idp/user-group-form",
          name: "Add Group"
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
    // async deleteField(field){  
    //   let record = field.row;      
    //   let params = {
    //     _id: record._id, 
    //     name: record.name,
    //     is_custom_field: record.is_custom_field,
    //     document_type: record.document_type
    //   };
    //   let response = await FieldService.deleteField(record._id, params).catch((err)=>{
    //     this.notifyError("Error deleting field. Please inactivate the business rules for field(if any) and try again.");          
    //     return;
    //   });   
    //   if(response){
    //     this.notifySuccess("Record deleted successfully.");
    //     EventBus.$emit("refreshTable");
    //     EventBus.$emit("tableRecordDeleted", record);
    //   }
    // }
  },
  beforeMount() {
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
  },
};
</script>
