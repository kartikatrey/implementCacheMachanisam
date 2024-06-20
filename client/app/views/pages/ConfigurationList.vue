<template>
<el-main>
		<h1 class="kp-page-title">{{pageTitle}}</h1>
       
        
		<div class="table-wrap">
    		<data-table :parameters="tableParams" :columnTemplate="columnTemplate"></data-table>
    	</div>

  </el-main>
</template>

<script>
import DataTable from "../../components/DataTable.vue";

export default {
  name: "ConfigurationList",
  components: { DataTable },

  data() {
    return {
      tableParams: {
		  apiName: '/portal/api/table/configuration',
		  showPaginationOptions: true,
        tableName: "configuration",
        enableExport:true,
        queryParam: { 
                    // active: true 
                    },
        // initialSort :"domain",
        isRestify: true,
        limit: 10
    },
    pageTitle:"Configuration"

	};
  },
};
</script>

