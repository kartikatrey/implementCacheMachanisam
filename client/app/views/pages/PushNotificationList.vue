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
  name: "PushNotificationList",
  components: { DataTable },

  data() {
    return {
      tableParams: {
		apiName: '/portal/api/table/push_notification',
		showPaginationOptions: true,
        tableName: "push_notification",
        queryParam: {
                    // active: true
                },
        // initialSort :"domain",
        enableExport:true,
        isRestify: true,
        limit: 10
	  },
pageTitle:"Push notification"
	};
  },
};
</script>

