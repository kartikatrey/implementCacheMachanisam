<template>
  <el-dialog title="Shipping address" :visible.sync="visible" width="90%" :close-on-click-modal="false">
    <el-button round text size="small" class="activity-close-btn" @click="closeModal"> <i class="mdi mdi-close"></i> </el-button>
    <el-container>
      <el-main class="activity-table-container">
        <el-table :data="activities" v-loading="loading" height="450px">
          <el-table-column  prop="jsonPayload.fields.activity.stringValue" label="Activity" width="600"></el-table-column>
          <el-table-column prop="jsonPayload.fields.activity_type.stringValue" label="Activity Type" width="150"></el-table-column>
          <el-table-column prop="jsonPayload.fields.date_time.stringValue" label="Date"  width="400"></el-table-column>
        </el-table>
        <el-button @click="getActivities" v-show="nextPageToken" type="primary" style="margin:0 auto; display:block" size="medium">Load More</el-button>
      </el-main>
    </el-container>
  </el-dialog>  
</template>
<script>
import ActivityService from "@/idp/services/ActivityService";
const currentISODate = new Date().toISOString(); 
export default {
  name: "ActivityViewer",
  props: [ "documentId", "visible"],
  data() {
    return {
      activities:[],
      nextPageToken: "",
      loading: true
    }
  },
  
  methods: {
    closeModal(){
      this.visible = false;
      this.$emit("onActivitViewerClosed");
    },
    async getActivities(){
      try{

        this.loading = true; 
        // Need to pass same filter for each pagination request. If we don't pass timestamp manually pagination will not work 
        const params = {"sortBy": "jsonPayload.date_time desc", "pageSize": 50, "nextPageToken": this.nextPageToken, "filter": `jsonPayload.document_id="${this.documentId}" AND timestamp <= "${currentISODate}"`}
        const result  = await ActivityService.getActivities(params);
        if(result.status){
          const activities = result.data.entries
          this.nextPageToken = result.data.nextPageToken || "";
          this.activities = [...this.activities, ...activities]; 
        } else{
          this.notifyError(result.message);
        }
        this.loading = false;
      }catch(error){
        this.notifyError("Error while getting activity data");
        console.error(error);
      }
    }
  },
  async beforeMount() {
    this.getActivities();
  }
};
</script>
<style lang="scss">
@import "../_idpVariables";
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
    .el-table {
        .el-table__header{
            width: 100% !important;
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