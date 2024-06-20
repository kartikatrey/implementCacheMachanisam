<template>
  <el-main>
<h1 class="kp-page-title">{{pageTitle}}</h1>

      <div class="table-wrap">
        <data-table
          :parameters="tableParams"
          :actionsTemplate="handleActions"
          @refreshCount="refreshCount"
        ></data-table>
      </div>

  </el-main>
</template>

<script>
import DataTable from "../../components/DataTable.vue";
import TableAPIService from "../../services/TableAPIService";
import AjaxService from "../../services/AjaxService";

let tableApiService = new TableAPIService();

import { _ } from "vue-underscore";
export default {
  name: "Leads",
  components: { DataTable },
  data() {
    return {
      allLeads: 0,
      pageTitle:"Leads",
      tableParams: {
        apiName: "/portal/api/table/cp_user",
        queryParam: { customer_id: { $exists: false } },
        tableName: "leadUser",
        enableExport:true,
        initialSort: "-createdAt",
        isRestify: true,
        limit: 10
      }
    };
  },
  methods: {
    getCount() {
      AjaxService.getJson("/portal/api/user-detail", {}, (error, res) => {
        this.allLeads = res.data.response[0].all_leads;
      });
    },
    refreshCount() {
      this.getCount();
    }
  },
  beforeMount() {
    this.getCount();
  }
};
</script>

