<template>
  <el-main class="kp-main">
    <div class="table-wrap">
      <DataTable
        :parameters="tableParams"
        componentName="ActiveInactiveButtons"
      ></DataTable>
    </div>
  </el-main>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import EventBus from "@/EventBus";
import BillingService from "@/idp/services/IdpBillingService";
import AjaxService from "@/services/AjaxService";

export default {
  name: "Policies",
  components: { DataTable },
  data() {
    const user = this.$store.getters.user;
    const authorizedAccess = (user["roles"] || []).includes("admin")
      ? true
      : false;
    const storage = JSON.parse(localStorage.getItem("vuex"));
    const userOrg =
      storage["user"] && storage["user"]["org"] ? storage["user"]["org"] : null;
    return {
      authorizedAccess: authorizedAccess,
      tableParams: {
        apiName: "/portal/api/table/de_policy",
        queryParam: {
          org: { $regex: `^${userOrg}` },
        },
        pageTitle: "Policies",
        showPaginationOptions: true,
        isRegxSearch:true,
        tableName: "de_policy",
        initialSort: "-created_at",
        enableExport: false,
        isRestify: true,
        limit: 10,
        addButtonConfig: { path: "/idp/policy-form", name: "Create New" },
        actionItems: [],
      },
      pageTitle: "Policies",
    };
  },
  methods: {},
  beforeMount() {
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
  },
};
</script>
