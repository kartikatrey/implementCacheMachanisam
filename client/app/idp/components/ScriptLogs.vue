<template>
  <div v-if="queryId" class="scriptLog">
    <div class="testcase-title-container">
      <span class="title section-title">Logs</span>
      <span v-if="showRefreshButton" class="testcase-refresh-button">
		    <el-button type="plain" :icon="isRefreshing? 'el-icon-loading': 'el-icon-refresh-left'" v-on:click="handleRefreshClicked" size="small">Refresh</el-button>
      </span>
    </div>
    <el-container title="Script logs" style="height: 300px; width: 100%; border: 1px solid; overflow-y: auto;" v-loading="logsLoading">
      <el-main>
      <div v-if="!testLogs || testLogs.length === 0">
        <el-row type="flex" class="row-bg" justify="start" align="top">
          <el-tag class="message-tag" size="mini">
            No logs available
          </el-tag>
        </el-row>
      </div>

      <div v-else>
        <div v-for="(testLog, index) in testLogs" :key="index" style="margin-bottom: 3px; margin-top: 3px">
          <el-row type="flex" class="row-bg" justify="start" align="top">
            <el-row style="white-space: pre">{{ testLog.created_at | formatTime }}</el-row>
            <el-tag class="message-tag" :type="testLog.type" size="mini">
              {{ testLog.message }}
            </el-tag>
            <el-button class="view-link" size='small' v-if="testLog.file_id" type="text" @click="viewDocument(testLog.file_id)">
              View Document
            </el-button>
          </el-row>
        </div>
      </div>
    </el-main>
    </el-container>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  props: {
    showRefreshButton: {
      type: Boolean,
      default() {
        return false;
      }
    },
    queryId: String,
    testLogs: Array,
    logsLoading: Boolean,
  },
  filters: {
    formatTime(value) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss') + ' ';
    }
  },
  methods: {
    handleRefreshClicked() {
      this.$emit('scriptLogsRefreshed');
    },
    viewDocument(file_id){      
      const documentPath = "/idp/document-view";
      const url = this.$router.resolve({ path: documentPath, query: { id : file_id } }).href;
      window.open(url, '_blank');
    }
  }
};
</script>

<style lang="scss">
@import "../_idpGlobal";
@import "../_idpVariables";

.scriptLog{
  margin-bottom: 1rem;
  .message-tag{
    height: auto;
    overflow-wrap: break-word;
    word-wrap: break-word;
    white-space: normal;
    max-width: inherit;
  }
  .view-link{
    color: blue;
    text-decoration: underline;
  }
  
  .testcase-title-container{
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    .section-title{
      visibility: hidden;
    }
    .testcase-refresh-button{
      // right: 2rem;
      position: relative;

      span{
        display: inline;
      }
    }
  }
}
</style>
