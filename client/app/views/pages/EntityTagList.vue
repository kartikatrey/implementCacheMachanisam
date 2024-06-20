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
        apiName: `/portal/api/table/entity_tag_list`,
        queryParam: {active:true},
        tableName: "entity_tag_list",
        enableExport:true,
        isRestify: true,
        limit: 10,
         
        addButtonConfig:{path:"/entity-tag-form",name:'Add tag'},
      },
      pageTitle:"Entity tag"
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
.tg-res{
	span{
		height: 100px;
		display: block;
		overflow-y: scroll;
	}
}


</style>


