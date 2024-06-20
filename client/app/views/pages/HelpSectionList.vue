<template>
  	<el-main>
    	<h1 class="kp-page-title">{{pageTitle}}</h1>
       

      <div class="table-wrap">
        <data-table :parameters="tableParams"></data-table>
      </div>

  </el-main>
</template>

<script>
import DataTable from "../../components/DataTable.vue";
import SystemService from "../../services/SystemService";

export default {
  name: "HelpSectionList",
  components: { DataTable },
  data() {
    return {
      count: 0,
      tableParams: {
        apiName: `/portal/api/table/help_query`,
        tableName: "help_query",
		initialSort: "system_name",
        queryParam: {"active":true},
        enableExport:true,
        isRestify: true,
        limit: 10,
        
        addButtonConfig:{path:"/help-section-form",name:'Add query'},
      },
      searchValue: "",
      pageTitle:"Help section"
    };
  },
  methods: {}
};
</script>
<style lang="scss">
</style>


