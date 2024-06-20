<template>
  <el-main class="kp-main">
    <section class="page-body">
      <div class="table-wrap">
        <DataTable :parameters="tableParams"></DataTable>
      </div>
      <el-dialog :show-close="false" title="Test results" :visible.sync="displayTestResults">
        <div class="test-result-container">
          <pre>{{ JSON.stringify(test_results, null, 2) }}</pre>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="displayTestResults = false">Close</el-button>
        </span>
      </el-dialog>
      
    </section>
  </el-main>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import EventBus from "@/EventBus";
import _ from "lodash";
import AutoTrainingService from "@/idp/services/AutoTrainingService";

export default {
  name: "TrainRequestList",
  components: {
    DataTable,
  },
  data() {
    return {
      count: 0,
      busEvents: [],
      test_results: "No test resuts found.",
      displayTestResults: false,
      endpoint: `/portal/api/table/trn_request`,
      tableParams: {
        apiName: `/portal/api/table/trn_request`,
        tableName: "trn_request",
        pageTitle: "Train Request",
        initialSort: "-created_at",
        enableExport: true,
        isRestify: true,
        limit: 10,
        actionItems: [
          {
            icon: "el-icon-document-copy",
            name: "Train logs",
            event_name: "view_train_logs",
          },
          {
            icon: "el-icon-document-copy",
            name: "Eval logs",
            event_name: "view_eval_logs",
          },
          {
            icon: "mdi mdi-eye-outline",
            name: "Test results",
            event_name: "view_test_results",
            hideCondition: (propData) =>
                ["Deployment completed"].includes(propData.row.status) ? false : true
          },
          {
            icon: "mdi mdi-cloud-upload-outline",
            name: "Deploy model",
            event_name: "deploy_model",
            inline: true,
            hideCondition: (propData) =>
                [ "Model upload completed", "Deployment failed"].includes(propData.row.status) ? false : true
          }
        ],
        addButtonConfig:true,
        addButtonConfig:{
           path:"/idp/train-request-form",
           name: "Add Request",
        },
        refreshButton:true,
        refreshButton:{
          name: "Refresh",
        }
      },
    };
  },
  methods: {
    registerEvents() {
      this.busEvents = ["view_train_logs", "view_eval_logs", "view_test_results", "deploy_model"];
      EventBus.$on("view_train_logs", async (rows) => {
        const rowData = rows["row"]
        const masterModelConfig = await AutoTrainingService.getMasterModelConfig(rowData["master_model_config_id"]);
        if(!rowData["master_model_config_id"] || !masterModelConfig._id) {
          this.notifyError("Model configuration not found." );
          return;
        }
        const directory = `${masterModelConfig["storage_location"]}/models/${rowData["_id"]}`;
        const fileName = "train.log";
        const fileURLResponse = await AutoTrainingService.getFileUrl({ directory, fileName });
        const fileURl = fileURLResponse["fileUrl"]
        window.open(fileURl, "_blank");
      });

      EventBus.$on("view_eval_logs", async (rows) => {
        const rowData = rows["row"]
        const masterModelConfig = await AutoTrainingService.getMasterModelConfig(rowData["master_model_config_id"]);
        if(!rowData["master_model_config_id"] || !masterModelConfig._id) {
          this.notifyError("Model configuration not found." );
          return;
        }
        const directory = `${masterModelConfig["storage_location"]}/models/${rowData["_id"]}`;
        const fileName = "eval.txt";
        const fileURLResponse = await AutoTrainingService.getFileUrl({ directory, fileName });
        const fileURl = fileURLResponse["fileUrl"]
        window.open(fileURl, "_blank");
      });

      EventBus.$on("view_test_results", async (rows) => {
        const rowData = rows["row"];
        this.test_results = rowData["test_result"];
        this.displayTestResults = true        
      });

      EventBus.$on("deploy_model", async (rows) => {
        this.$confirm(`Are you sure you want to deploy the selected model?`, 'Confirm', {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel'
        })
        .then(async () => {
          const rowData = rows["row"]
          const masterModelConfig = await AutoTrainingService.getMasterModelConfig(rowData["master_model_config_id"]);
          if(!rowData["master_model_config_id"] || !masterModelConfig._id) {
            this.notifyError("Model configuration not found." );
            return;
          }
          let payload = {
            "request_id": rowData["_id"],
            "customer_id": rowData["customer_id"],
            "model_id": rowData["model_id"],
            "storage_location": masterModelConfig["storage_location"]
          }
          const response = await AutoTrainingService.deployModel(payload);
          if(!_.get(response, 'data.status'))
            return this.notifyError(response.message);
          this.notifySuccess(_.get(response, 'data.message'));
          })
        .catch(action => {
        }) 
      });
    }
  },

  beforeMount() {
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
  },

  beforeDestroy() {
    document.removeEventListener("keydown", () => {}, false);
    EventBus.$off(this.busEvents);
  },

  mounted() {
    this.registerEvents();
  }
};
</script>


<style lang="scss">
@import "../_idpGlobal.scss";
@import "../_idpVariables.scss";

.test-result-container{
  height: 500px;
  overflow: auto;
}
</style>