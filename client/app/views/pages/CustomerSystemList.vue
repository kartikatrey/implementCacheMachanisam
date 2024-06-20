<template>
<el-main>
		<h1 class="kp-page-title">{{pageTitle}}</h1>
        
 
      <div class="table-wrap">
        <data-table @refreshCount="refreshCount" :parameters="tableParams"></data-table>
      </div>
  </el-main>
</template>

<script>
import DataTable from "../../components/DataTable.vue";
import SystemService from "../../services/SystemService";
import EventBus from "@/EventBus";

export default {
  name: "CustomerSystemLists",
  components: { DataTable },
  data() {
    return {
      count: 0,
      tableParams: {
        apiName: `/portal/api/table/customer_system`,
        tableName: "customer_system",
        queryParam: {  active:true},
        enableExport:true,
        isRestify: true,
        limit: 10,
        
        addButtonConfig:{path:"/customer-system-form",name:' Add customer system'},
     
      },
      searchValue: "",
      pageTitle:"Customer systems"
    };
  },
  methods: {
    getCount() {
      SystemService.fetchCustomerSystemsCount()
        .then(count => {
          this.count = count;
        })
        .catch(error => {
          this.notifyError("There is an error in fetching customer system count");
        });
    },

    refreshCount() {
      this.getCount();
    }
  },
  beforeMount() {
    this.getCount();
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
  }
};
</script>

<style lang="scss">
</style>


