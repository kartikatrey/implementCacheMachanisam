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
export default {
  name: "BannerList",
  components: {
    DataTable
  },
  data() {
    return {
      activeBannerCount: 0,
      endpoint: constants.BANNER_ENDPOINT,
      tableParams: {
        apiName: `/portal/api/table/banner`,
        queryParam: {
          active: true
        },
        tableName: "banner",
        enableExport: true,
        isRestify: true,
        limit: 10,
        addButtonConfig: { path: "/banner-form", name: "Add banner" },
      },
      pageTitle: "Banner"
    };
  },
  methods: {
    fetchActiveCount() {
      CommonService.fetchActiveCount(this.endpoint)
        .then(activeBannerCount => {
          this.activeBannerCount = activeBannerCount;
        })
        .catch(error => {
          this.notifyError("Error while fetching active banner count!!");
        });
    },
    onTableUpdate() {
      this.fetchActiveCount();
    }
  },
  beforeMount() {
    this.fetchActiveCount();
  }
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";

</style>
