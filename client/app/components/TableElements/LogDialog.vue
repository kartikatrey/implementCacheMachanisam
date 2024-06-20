<template>
  <span>
    <el-dropdown-item :cid="'table-action-log-dialog-' + propData.index" v-if="type=='dropdown'" :command="getRecords">
        <span :class="icon"></span>View
    </el-dropdown-item>
      
    <!-- | Test dialog -->
      <el-dialog
        title="Logs"
        v-if="displayDialog"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        width="50%"
        center
        :append-to-body="true"
      >
        <div style="display: flex; flex-direction: column;">
          <!-- New div for displaying test logs -->
          <div>
          <el-container style="height: 400px; border: 1px solid #eee;">
            <el-main> 
              <div v-for="(testLog, index) in testLogs" style="margin-bottom: 3px; margin-top: 3px">
                <el-row type="flex" class="row-bg" justify="start" align="top">
                  <div style="white-space:pre">{{ testLogs[index].updated_at | formatTime }}</div>
                    <!-- check if data present and show expand option -->

                    <div class="logDialog">
                      <el-tag class="message-tag":type="testLogs[index].type" size="mini">
                        {{  testLogs[index].message }}
                      </el-tag>
                      <el-button class="view-link" size='small' v-if="testLog.file_id" type="text" @click="viewDocument(testLog.file_id)">
                        View Document
                      </el-button>
                    </div>
                </el-row>
              </div>
            </el-main>
          </el-container>
        </div>
          <!--  -->
          <div style="margin-top: 10px; align-self: flex-end;">
            <el-button
              v-on:click="cancel"
              size="small"
            >
              Cancel
            </el-button>
          </div>
        </div>
      </el-dialog>
  </span>
</template>

<script>
import LogService from "@/idp/services/LogService";
import _ from 'lodash';
import moment from 'moment';

export default {
    name: "LogDialog",
    props: ["propData", "type"],
    data() {
        return {
          testLogs: [],
          logOptions: _.get(this.propData, "column.logOptions", ""),
          dialogVisible : true,
          displayDialog : false
        };
    },
    methods: {
        async getRecords(){
          this.displayDialog = true;
          const endpoint = _.get(this.logOptions, "endpoint", "");
          const outputKey = _.get(this.logOptions, "output_key", "");
          const filter = this.prepareFilter();
          
          try{
            const logResponse = await LogService.getLogs(endpoint, filter);
            if(_.isEmpty(logResponse[0][outputKey])){
              this.notifyError(`No logs available`);
              return
            }
            let logs = logResponse[0][outputKey].map((data) => {
              return {
                message: data.message? data.message: data,
                type: data.type? data.type: "info",
                updated_at: logResponse[0].updated_at
              }
            });
            if(logResponse[0].doc_id){
              logs[0]['file_id'] = logResponse[0].doc_id
            }
            this.testLogs = logs;
          }catch(error){
            console.log(`error while getting records ${error}`);
            this.notifyError(error);
          }                    
        },

        prepareFilter(){
          const record = _.get(this.propData, "row", "");
          const filters = _.get(this.logOptions, "filters", "");
          let modifiedFilter = {}

          filters.forEach((filter, index) => {
            if(record[filter]){
              modifiedFilter[filter] = record[filter];
            }
          });

          return modifiedFilter;
        },
        viewDocument(file_id){      
          const documentPath = "/idp/document-view";
          const url = this.$router.resolve({ path: documentPath, query: { id : file_id } }).href;
          window.open(url, '_blank');
        },
        cancel(){
          this.testLogs = [];
          this.displayDialog = false;
        }
    },
    beforeMount(){
    },
    filters: {
    formatTime(value) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss') + ' ';
    }
  }
};
</script>

<style lang="scss">
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
</style>
