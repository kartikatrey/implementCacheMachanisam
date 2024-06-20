<template>
  <el-container>
      <el-main class="activity-table-container">
        <div class="activity-logger-header">
          <span>Activity Logger</span>
            <el-input
              clearable
              class="kp-toolbar-input"
              v-model="searchText"
              :disabled="disableSearch"
              @keyup.enter.native="onSearch"
              @clear="onSearch"
              placeholder="Search activity logs">
            </el-input>
        </div>
        <el-table
        :data = "activities"
         height="450px">
          <el-table-column  prop="jsonPayload.fields.activity.stringValue" label="Activity" width="600"></el-table-column>
          <el-table-column prop="jsonPayload.fields.activity_type.stringValue" label="Activity Type" width="150"></el-table-column>
          <el-table-column prop="jsonPayload.fields.date_time.stringValue" label="Date"  width="400"></el-table-column>
        </el-table>
        <el-button @click="getActivities({next: true})" v-show="params.nextPageToken" type="primary" class="activity-logger-load-more-btn" size="medium">Next</el-button>
      </el-main>
    </el-container>
</template>

<script>
import ActivityService from "@/idp/services/ActivityService";
const currentISODate = new Date().toISOString();
import _ from "lodash";
export default {
  name: "ActivityViewer",
  data() {
    return {
      activities:[],
      nextPageToken: "",
      loading: true,
      searchText:"",
      documentId: "",
      disableSearch: false,
      oldSearch:"",
      params: {
        sortBy: "jsonPayload.date_time desc",
        pageSize: 150,
        filter :`jsonPayload.document_id="${this.$route.query.documentId}" AND timestamp <= "${currentISODate}"`, // We need to pass timestamp in filter for pagination.
      }
    }
  },

  methods: {
    /**
     * Purpose: To get activities based on search text.
     */
      async onSearch(event) {

          if(event && !event.key == 'Enter') return;

          // Resets the next page token, if search text changes.
          if(this.oldSearch != this.searchText){
            this.params.pageSize = 150;
            this.params.filter = `jsonPayload.document_id="${this.$route.query.documentId}" AND timestamp <= "${currentISODate}"`;
            delete this.params.nextPageToken;
          }
          this.oldSearch = this.searchText;
          this.disableSearch = true;

          await this.getActivities(this.params)
      },

      /**
       * Purpose: To get activity logs based on given params
       */
      async getActivities(params){
      try{

        // Prepare search params
        if(this.searchText){
          this.params.pageSize = 30;
          this.params.filter = `jsonPayload.document_id="${this.documentId}" AND jsonPayload.activity:(${this.searchText}) AND timestamp <= "${currentISODate}"`;
        }

        this.$setLoader({ target: ".activity-table-container" });

        //If routing to next page then use default params
        //Else in case of search, use updated params
        params = params.next ? this.params : params;
        const activityLogResult  = await ActivityService.getActivities(params);

        if(activityLogResult.status){
          this.activities = _.get(activityLogResult, "data.entries")
          this.params.nextPageToken = _.get(activityLogResult, "data.nextPageToken", "");
          this.$resetLoader();
          this.disableSearch = false;

        } else{
          this.notifyError(activityLogResult.message);
        }

        this.loading = false;
      }catch(error){
        this.notifyError("Error while getting activity data");
        console.error(error);
      }
    }
  },
   async beforeMount() {
    this.documentId = this.$route.query.documentId;

    // Calls getActivities to get all (as per pageSize value) logs
    await this.getActivities(this.params);
  },
};

</script>
<style lang="scss">
@import "../_idpVariables";
.label{
  justify-content: center;
}
.activity-close-btn {
    position: absolute;
    border: 0;
    color: var(--dark-03);
    font-size: 1.2rem;
    vertical-align: text-top;
    padding: 0 !important;
    right: 6px;
    top: 6px;
    z-index: 9999;
    transition: .15s all ease-in-out;
    transform-origin: center center;
    background: var(--dark-08);
    width: 25px;
    height: 25px;
    &:hover {
        background: transparent !important;
        transform: scale(1.2);
    }
    span {
        display:block;
    }
  }
  .activity-table-container {
    .activity-logger-header{
      span {
        font-size : 1.33rem;
      }
      .kp-toolbar-input{
        width: 200px;
      }
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 30px;
      margin-bottom: 10px;
    }
    .activity-logger-load-more-btn{
      margin-top: 10px;
    }

    .el-table {
        .el-table__header{
            width: 100% !important;
            // padding-top: 30px;
            margin-top: 15px;
        }
        .el-table__body{
            width: 100% !important;
        }
        .el-table__cell {
            padding: 2px 0;
        }
        .el-table__fixed-right-patch {
            width: auto !important;
        }

        .el-table-column--selection .cell {
            transform: scale(0.75);
        }
    }

    .el-table {
        font-size: var(--font-base);
        border-radius: var(--radius-base) var(--radius-base) 0px 0px;
    }

    .el-table th {
        background-color: var(--dark-07);
    }

    .el-table thead {
        color: #4a5568;
    }

    .el-button--mini {
        padding: 0px;
        // font-size: 12px;
        border-radius: var(--radius-sm);
        background: inherit;
        border: 0px;
    }

    thead {
        th {
            padding: 0px;
            // font-style: normal;
            font-weight: normal;
            // letter-spacing: 0.02rem;
            font-size: var(--font-base);

            .caret-wrapper {
                margin-left: 0.1rem;
            }
        }
    }

    tbody {
        td {
            padding: 5px 0;
        }
    }

    tbody {
        td {
            padding: 2px 0;
        }
    }

    tbody {
        tr:nth-child(even) {
            background-color: var(--dark-09);
        }

        tr:nth-child(odd) {
            background-color: var(--dark-08);
        }
    }

    .current-row{
        background-color: var(--brand-05) !important;
    }
}
</style>