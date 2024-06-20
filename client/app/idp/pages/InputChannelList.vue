<template>
  <el-main class="kp-main">
    <section class="page-body">
      <div class="table-wrap">
        <DataTable :parameters="requiredParams" :columnTemplate="columnTemplate"></DataTable>
      </div>
    </section>
  </el-main>
</template>

<script>
import DataTable from "../../components/DataTable.vue";
import EventBus from "@/EventBus";
import { getStatusBadge } from "@/util/CommonUtil";

export default {
  name: "InputChannelList",
  components: {
    DataTable,
  },
  data() {
    return {
      requiredParams: {
        apiName: "/portal/api/table/input_channel", //add your API url here
        queryParam: {},
        showPaginationOptions: true, // to show/hide pagination option
        tableName: "input_channel", // it is use to get headers of table from tableHeaderConfig.js
        enableExport: true,
        isRestify: true,
        isRegxSearch: true,
        pageTitle: "Input Channels",
        limit: 10, // to limit the number of records to be fetched
        addButtonConfig: {
          path: "/idp/input-channels-form",
          name: "Add Channel",
        },
      }
      
    };
  },
  methods: {
    columnTemplate(props) {
      return getStatusBadge(props);
    }
  },
  beforeMount(){
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
  }
};
</script>
