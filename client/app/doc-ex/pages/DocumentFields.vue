<template>
  <el-main>
    <h1 class="kp-page-title">{{ pageTitle }}</h1>
    <div class="table-wrap">
      <data-table :parameters="tableParams"></data-table>
    </div>
  </el-main>
</template>

<script>
import EventBus from "@/EventBus";
import DataTable from "@/components/DataTable.vue";
import DialogFlowService from "@/dialogflow/services/DialogFlowService";
import FieldService from "../services/FieldService"
export default {
  name: "DocumentFields",
  components: {
    DataTable,
  },
  data() {
    return {
      count: 0,
      tableParams: {
        apiName: `/portal/api/table/de_field`,
        queryParam: {
          active: true,
        },
        tableName: "de_field",
        enableExport: true,
        isRegxSearch:true,
        isRestify: true,
        limit: 10,
        addButtonConfig: true,
        addButtonConfig: {
          path: "/field-form",
          name: "Add Field",
        },
        actionItems: [
            {
              icon: "el-icon-delete",
              name: "Delete",
              event_name: "delete_field",
              hideCondition: (propData) =>
                propData.row.is_custom_field ? false : true
            }
        ]
      },
      pageTitle: "Fields",
    };
  },
  methods: {
    async deleteField(field){        
      let params = {
        _id: field.row._id, 
        customer_id: field.row.customer_id, 
        name: field.row.name,
        is_custom_field: field.row.is_custom_field,
        document_type: field.row.document_type
      };
      let response = await FieldService.deleteField(field.row._id, params).catch((err)=>{
        this.notifyError("Error while deleting field");          
        return;
      });   
      this.notifySuccess("Record deleted successfully.");
      EventBus.$emit("refreshTable");
    }
  },

  beforeMount() {
    EventBus.$on("delete_field", field => {
      this.deleteField(field);
    });
  },
  beforeDestroy() {
    EventBus.$off(["delete_field"]);
  }
};
</script>
