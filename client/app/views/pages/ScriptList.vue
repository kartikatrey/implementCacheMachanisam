<template>
  <el-main>
    	<h1 class="kp-page-title">{{pageTitle}}</h1>
    
  		<div class="table-wrap">
      <data-table
        :parameters="tableParams"
        ref="datatable"
      ></data-table>
			</div>
  </el-main>
</template>

<script>

import DataTable from "../../components/DataTable.vue";
import Constants from "@/resources/Constants";

export default {
  name: "ScriptList",
  components: { DataTable },
  data() {
    return {
     tableParams: {
        apiName: `/portal/api/table/script`,
       queryParam: {"active":true},
        tableName: "script",
        enableExport:true,
        isRestify: true,
        limit: 10,
         
        addButtonConfig:{path:"/script-form",name:'Script'},
      },
      pageTitle:"Script",
    };
  }
}
</script>

<style lang="scss">
@import "../../assets/scss/_variables";
.modal-dropdown {
    margin-bottom: 34px;
        .sub-heading {
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.875rem;
            display: block;
            margin-bottom: 7px;
        }
}


</style>


