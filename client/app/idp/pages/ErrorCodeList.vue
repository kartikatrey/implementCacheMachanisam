<template>
  <el-main class="kp-main">
    <section class="page-body">
      <div class="table-wrap">
        <DataTable :parameters="tableParams"></DataTable>
      </div>
    </section>
  </el-main>
</template>

<script>
import EventBus from "@/EventBus";
import DataTable from "../../components/DataTable.vue";

export default {
  name: "ErrorCode",
  components: {
    DataTable
  },
  data() {
    return {
      count: 0,
      tableParams: {
        apiName: `/portal/api/table/de_code`,
        queryParam: {
          active: true
        },
        showPaginationOptions: true, // to show/hide pagination option
        tableName: "de_code",
        enableExport: false,
        isRegxSearch:true,
        isRestify: true,
        limit: 10,
        addButtonConfig: true,
        pageTitle: "Error Code",
        addButtonConfig: {
          path: "/idp/error-code-form",
          name: "Add Error Code"
        }      
      },
    };
  },
  methods: {
  },
  beforeMount() {
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
  },
};
</script>
