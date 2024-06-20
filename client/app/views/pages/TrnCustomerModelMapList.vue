<template>
	<el-main>
		<h1 class="kp-page-title">{{pageTitle}}</h1>
      

      <div class="table-wrap">
        <data-table :parameters="tableParams" @refreshCount="onTableUpdate" ref="datatable"></data-table>
      </div>
  </el-main>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import CommonService from "@/services/CommonService";
import constants from "@/resources/Constants";
import TableAPIService from "@/services/TableAPIService";

export default {
  name: "TrnCustomerModelMapList",
  components: { DataTable },
  data() {
    return {
      endpoint: constants.TRN_CUSTOMER_MODEL_MAP_ENDPOINT,
      tableParams: {
        apiName: `/portal/api/table/trn_customer_model_map`,
        queryParam: {active:true},
        tableName: "trn_customer_model_map",
        enableExport:true,
        isRestify: true,
        limit: 10,
        addButtonConfig:{path:"/trn-customer-model-map-form",name:'Add mapping'},
      },
      pageTitle:"Training history "
    };
  },
  methods: {
  },
  beforeMount() {
  }
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";

</style>


