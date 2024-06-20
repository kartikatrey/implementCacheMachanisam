<template>
  <el-main>
   <h1 class="kp-page-title">{{pageTitle}}</h1>       
      <div class="table-wrap">
        <DataTable :parameters="requiredParams" :columnTemplate="columnTemplate"></DataTable>
      </div>
  </el-main>
</template>

<script>
import DataTable from "../../components/DataTable.vue";
import AjaxService from "@public/services/AjaxService";

export default {
  name: "ReportedIssues",
  components: { DataTable },
  data() {
    return {
      requiredParams: {
        apiName: "/portal/api/table/reported_issue", //add your API url here
        showPaginationOptions: true, // to show/hide pagination option
        tableName: "reported_issue", // it is use to get headers of table from tableHeaderConfig.js
        enableExport:true,
        queryParam: { 
                    // active: true 
                    },
        isRestify: true,
        initialSort: "-created_on",
        limit: 10 // to limit the number of records to be fetched
      },
      pageTitle:"Reported issue"
    };
  },
  methods: {
    columnTemplate(props) {
      var htmlTemplate = "";
      if (props.row["status"] == "Open") {
        htmlTemplate = `<div data-v-c0ac797e="" class="el-badge mark"><sup class="badge-open">Open</sup></div>`;
      } else if (props.row["status"] == "Resolved") {
        htmlTemplate = `<div data-v-c0ac797e="" class="el-badge mark"><sup class="badge-resolved">Resolved</sup></div>`;
      } else {
        htmlTemplate = `<div data-v-c0ac797e="" class="el-badge mark"><sup class="badge-inprogress">In Progress</sup></div>`;
      }
      return htmlTemplate;
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";
.badge-open {
  background-color: white;
  border-radius: 15px;
  color: red;
  display: inline-block;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid red;
  width: 50px;
}
.badge-inprogress {
  background-color: white;
  border-radius: 15px;
  color: orange;
  display: inline-block;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid orange;
  width: 60px;
}
.badge-resolved {
  background-color: white;
  border-radius: 15px;
  color: rgba(66, 240, 153, 0.7);
  display: inline-block;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid rgba(66, 240, 153, 0.7);
  width: 50px;
}
</style>