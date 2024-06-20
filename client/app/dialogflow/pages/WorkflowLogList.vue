<template>
  <el-main>
    <div class="page-header">
      <h1 class="page-heading">WorkflowLog</h1>
    </div>

    <div class="page-info-strip">
      <div
        class="page-info-container"
        style="width:85px"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <span>All Workflow logs</span>
            <h2>{{count}}</h2>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="grid-content bg-purple">
      <div class="table-wrap">
        <data-table  @refreshCount="refreshCount" :parameters="tableParams"></data-table>
      </div>
    </div>
  </el-main>
</template>
<script>
import DataTable from "@/components/DataTable.vue";
import WorkflowLogService from "@/dialogflow/services/WorkflowLogService";

export default {
  name: "WorkflowLogList",
  components: { DataTable },
  data() {
    return {
      count: 0,
      tableParams: {
		apiName: `/portal/api/table/workflow_log`,
		select : ["name","domain","object"],
        tableName: "workflow_log",
        isRestify: true,
        limit: 10
      }
    };
  },
  methods: {
    fetchLogCount() {
      WorkflowLogService.fetchLogCount()
        .then(count => {
          this.count = count;
        })
        .catch(error => {
          this.notifyError("Error while fetching active service count!!");
        });
    },
      refreshCount() {
          this.fetchLogCount();
     },
  },

  beforeMount() {
    this.fetchLogCount();
  }
};
</script>
