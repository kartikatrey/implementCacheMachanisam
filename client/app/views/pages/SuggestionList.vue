<template>

  	<el-main>
    	<h1 class="kp-page-title">{{pageTitle}}</h1>
      
 

      <div class="table-wrap">
        <DataTable :parameters="requiredParams"></DataTable>
      </div>
  </el-main>
</template>


<script>
import DataTable from "../../components/DataTable.vue";
import AjaxService from "@public/services/AjaxService";

export default {
  name: "SuggestionList",
  components: { DataTable },
  data() {
    return {
      requiredParams: {
        apiName: "/portal/api/table/suggestion", //add your API url here
        queryParam: {"active":true},

        showPaginationOptions: true, // to show/hide pagination option
        tableName: "suggestion", // it is use to get headers of table from tableHeaderConfig.js
        enableExport:true,
        isRestify: true,
        limit: 10 ,// to limit the number of records to be fetched
      
       addButtonConfig:{path:"/suggestions-form",name:'Add suggestions'},
      },  
      pageTitle:"Suggestion"
    };
  },
  methods: {}
};
</script>

<style lang="scss">
@import '../../assets/scss/_variables';
.tg-res{
	span{
		height: 100px;
		display: block;
		overflow-y: scroll;
		// width: 400px;
	}
}
</style>
