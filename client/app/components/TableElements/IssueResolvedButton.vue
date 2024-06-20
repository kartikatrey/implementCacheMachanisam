<template>
  <el-dropdown-item :command="resolveRecord" :cid="'table-action-resolve-' + propData.index" ><i class="mdi mdi-check-circle-outline"></i>Resolve</el-dropdown-item>
</template>


<script>
import TableAPIService from "@/services/TableAPIService";
import AjaxService from "../../services/AjaxService";
import { _ } from "vue-underscore";
let tableApiService = new TableAPIService();
import EventBus from "@/EventBus";

export default {
  name: "IssueResolvedButton",
  props: ["propData"],
  data() {
    return {};
  },
  methods: {
    resolveRecord() {
      let record = this.propData.row;
      let url = "/portal/api/table/reported_issue";
      let updateDate = new Date();
      let data = { status: "Resolved", updated_on: updateDate };
      tableApiService.findByIdAndUpdate(
        url,
        record._id,
        data,
        (error, response) => {
          console.log("error" + JSON.stringify(error));
          console.log("response" + JSON.stringify(response));
          if (_.has(response.data, "_id")) {
            this.$confirm(
              `Are you sure you want to resolve issue for ${record.user_email}?`,
              "Confirmation",
              {
                confirmButtonText: "Send Mail",
                cancelButtonText: "Cancel",
                type: "warning"
              }
            )
              .then(() => {
                this.sendActivationEmail(record.user_email, record._id);
                //this.$parent.$parent.refreshTable();
                EventBus.$emit("refreshTable");
              })
              .catch(() => {});
          } else {
            this.$notify.error({
              title: "Error",
              message: `Error while resolving issue for  user ${record.user_email}`
            });
          }
        }
      );
    },

    sendActivationEmail(email, recordId) {
      let url = "/portal/api/reported-issue-email";
      let userData = { user_email: email, record_id: recordId };
      AjaxService.postJson(url, userData, (error, res) => {
        if (res.data.data.status) {
          this.$notify({
            title: "Success",
            message: res.data.data.message,
            type: "success"
          });
        } else {
          this.$notify.error({
            title: "Error",
            message: res.data.data.message
          });
        }
      });
    }
  }
};
</script>>