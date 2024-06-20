<template>
  <el-dropdown-item
    :disabled="refreshInProgress"
    :command="refreshStatus"
  ><i class="el-icon-refresh"></i>Refresh</el-dropdown-item>
</template>
<script>
import TableAPIService from "@/services/TableAPIService";
import _ from "lodash";
import { Loading } from "element-ui";
export default {
  name: "RefreshTraningStatusButton",
  components: {
    Loading
  },
  props: ["propData"],
  data() {
    return {
      loadingInstance: "",
      refreshInProgress: false
    };
  },
  methods: {
    async refreshStatus() {
      try {
        this.refreshInProgress = true;
        this.showLoader();
        let record = await this.getTrainingData(this.propData.row["_id"]);
        let updatedStatus = await this.getModelDetails(record);
        if (record.model_id) {
          await this.updateTrainingStatus(updatedStatus);
        }

        this.propData.row["status"] = updatedStatus;
        this.propData.row["training_end_time"] = record["training_end_time"];
        this.propData.row["training_start_time"] =
          record["training_start_time"];

        this.propData.row["failure_reason"] = record["failure_reason"];
        this.propData.row["statistics"] = record["statistics"];
        // this.hideLoader();
      } catch (err) {
        console.log(err);
        this.showError("Error while refreshing the model status.");
      } finally {
        this.hideLoader();
        this.refreshInProgress = false;
      }
    },
    async getTrainingData(id) {
      let response = await this.getRecord("/portal/api/table/trn_status", {
        _id: id
      });
      return response;
    },
    async getModelDetails(record) {
      let column = this.propData.column;
      let endpoint = "";
      let query = {};
      if (record.model_id) {
        endpoint = column.refreshOptions.ks_model_endpoint;
        query = { _id: record.model_id };
      } else {
        endpoint = column.refreshOptions.trn_status_endpont;
        query = { _id: record._id };
      }
      let response = await this.getRecord(endpoint, query);
      return response["status"];
    },
    getRecord(endpoint, query) {
      return new Promise((resolve, reject) => {
        let tableApiService = new TableAPIService();
        tableApiService.addQuery(query);

        tableApiService.findOne(endpoint, (error, response) => {
          if (error) {
            reject(error);
            return;
          }
          let responseData = _.isArray(response) ? response[0] : response;
          resolve(responseData);
        });
      });
    },

    updateTrainingStatus(updatedStatus) {
      let record = this.propData.row;
      let column = this.propData.column;
      let endpoint = column.refreshOptions.trn_status_endpont;
      let data = {
        _id: record._id,
        status: updatedStatus
      };
      return new Promise((resolve, reject) => {
        let tableApiService = new TableAPIService();
        tableApiService.upsert(endpoint, data, (error, response) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(response.data);
        });
      });
    },

    showLoader() {
      this.loadingInstance = Loading.service({
        spinner: "el-icon-loading",
        target: `tbody tr:nth-child(${this.propData.index + 1}) .status`
      });
    },

    hideLoader() {
      this.loadingInstance && this.loadingInstance.close();
      this.loadingInstance = null;
    },

    showError(message) {
      this.$notify.error({
        title: "Error",
        message: message
      });
    }
  }
};
</script>
<style lang="scss">
.button-style {
  font-size: 26px !important;
  padding: 0 !important;
}

.refresh-button-container {
  .el-button {
    padding: 5px;
    border: 0;
  }
}
</style>
