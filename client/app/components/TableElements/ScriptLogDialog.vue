<template>
  <span>
    <el-dropdown-item :cid="'table-action-script-log-dialog-' + propData.index" v-if="type=='dropdown'" :command="getRecords">
        <span :class="icon"></span>View
    </el-dropdown-item>
      
    <!-- | Test dialog -->
      <el-dialog
        title="Test Business Rule"
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
          <el-container style="height: 200px; border: 1px solid #eee;">
            <el-main> 
              <div v-for="(testLog, index) in testLogs" style="margin-bottom: 3px; margin-top: 3px">
                <el-row type="flex" class="row-bg" justify="start" align="top">
                  <div style="white-space:pre">{{ testLogs[index].created_at | formatTime }}</div>
                    <!-- check if data present and show expand option -->

                    <div class="scriptLogDialog" v-if="!testLogs[index].hasData">
                      <el-tag class="message-tag":type="testLogs[index].type" size="mini">
                        {{  testLogs[index].message }}
                      </el-tag>
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
import TestService from "@/idp/services/TestService";
import _ from 'lodash';
import moment from 'moment';

export default {
    name: "ScriptLogDialog",
    props: ["propData", "type"],
    data() {
        return {
          testLogs: [],
          dialogVisible : true,
          displayDialog : false
        };
    },
    methods: {
        async getRecords() {
          this.displayDialog = true;
          let record = _.get(this.propData, "row", "");
          let filter = this. prepareFilter();
          const res = await TestService.getScriptLogs(filter);
          if(_.isEmpty(res)){
            this.notifyError("No logs available");
            return;
          }
          this.testLogs = res;
        },
        prepareFilter(){
          let record = _.get(this.propData, "row", "");
          let filters = _.get(this.propData, "column.scriptOptions.filters", "");
          let ids = _.get(this.propData, "column.scriptOptions.ids", "");
          let modifiedFilter = {};

          filters.forEach((filter, index) => {
            if(record[ids[index]]){  
              modifiedFilter[filter] = record[ids[index]];
            }
          });

          return modifiedFilter;
        },
        cancel(){
          this.testLogs = [];
          this.displayDialog = false;
        }
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
</style>
