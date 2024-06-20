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
import EventBus from "@/EventBus";
export default {
    
    name: "CustomerList",
    components: {
        DataTable,
    },
    data() {
    return {
            tableParams: {
            apiName: `/portal/api/table/customer`,
            queryParam: {
                active: true
            },
            tableName: "allCustomer",
            pageTitle: "Customer List",
            isRegxSearch:true,
            initialSort: "updated_at",
            enableExport: true,
            isRestify: true,
            limit: 10,
            addButtonConfig: true,
            addButtonConfig: {
              path: "/idp/customerform",
              name: "Add Customer",
            },
        }
    };  
},
 beforeMount() {
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
  },
}
</script>