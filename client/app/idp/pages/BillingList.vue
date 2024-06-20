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
import _ from 'lodash'
import Constants from "@/resources/Constants";

export default {
  name: "BillingList",
  components: { DataTable },
  data() {
    const user = this.$store.getters.user;
    let authorizedAccess = false;
    
    const authorizedUser =  _.filter(['admin','idp_admin'],(role)=>(user["roles"] || []).includes(role));
    authorizedAccess = authorizedUser.length  ? true  : false;

    let queryParam = { active: true };
    if (!authorizedAccess) {
      queryParam.status = {
        $in: [
          Constants.BILLING.INVOICE_STATUS.ISSUED,
          Constants.BILLING.INVOICE_STATUS.PAID,
        ],
      };
    }
    return {
      authorizedAccess: authorizedAccess,
      tableParams: {
        apiName: "/portal/api/table/de_invoice",
        pageTitle: "Billing",
        showPaginationOptions: true,
        tableName: "de_invoice",
        queryParam,
        initialSort: "-invoice_no",
        enableExport: false,
        isRestify: true,
        limit: 10,
        addButtonConfig: { path: "/idp/billing/add", name: "Create New" },
        isRegxSearch:true,
        actionItems: [
          {
            icon: "mdi mdi-arrow-down-thin-circle-outline",
            name: "Download",
            event_name: "downloadInvoice",
            hideCondition: (propData) => propData.row.status == "Draft",
            inline: true,
          },
          {
            icon: "mdi mdi-pencil",
            name: "Edit",
            event_name: "editInvoice",
            hideCondition: (propData) => !this.isSuperAdmin(),
            inline: true,
          },
          {
            icon: "mdi mdi-delete",
            name: "Delete",
            event_name: "deleteInvoice",
            hideCondition: (propData) => !this.isSuperAdmin(),
            inline: true,
          },
        ],
      },
      pageTitle: "Invoices",
    };
  },
  methods: {
    markPaid(rowData) {
      alert("Marked paid - " + rowData.invoice_no);
    },
    downloadInvoice(rowData) {
      BillingService.downloadInvoice(rowData);
    },
    async deleteInvoice(data) {
      let confirmText = `Are you sure you want to delete?`;
      this.$confirm(confirmText, "Confirmation", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(async () => {
        let delRes = await BillingService.deleteInvoice(data._id, {
          active: false,
        }).catch((err) => {
          this.notifyError(`Error deleting invoice ${data.invoice_no}`);
          return;
        });
        EventBus.$emit("refreshTable");
        EventBus.$emit("tableRecordDeleted", data);
        delRes &&
          this.notifySuccess(
            `Invoice ${data.invoice_no} deleted successfully.`
          );
      });
    },
    editInvoice(data) {
      this.$router.push({ path: "/idp/billing/add", query: { id: data._id } });
    },
    viewInvoice(data) {
      this.$router.push({ path: "/idp/billing/add", query: { id: data._id } });
    },
    deRegisterEvents() {
      EventBus.$off(["downloadInvoice", "viewInvoice", "editInvoice", "deleteInvoice"]);
    },
  },
  beforeMount() {
    if (!this.authorizedAccess) {
      this.tableParams["addButtonConfig"] = null;
    }
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
    EventBus.$on("markPaid", (propData) => {
      this.markPaid(propData.row);
    });
    EventBus.$on("downloadInvoice", (propData) => {
      this.downloadInvoice(propData.row);
    });
    EventBus.$on("viewInvoice", (data) => {
      this.viewInvoice(data);
    });
    EventBus.$on("editInvoice", (propData) => {
      this.editInvoice(propData.row);
    });
    EventBus.$on("deleteInvoice", (propData) => {
      this.deleteInvoice(propData.row);
    });
  },
  beforeDestroy() {
    this.deRegisterEvents();
  },
};
</script>
