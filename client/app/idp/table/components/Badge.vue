<template>
    <span :cid="cid" class="idp-status-badge">
        <el-tag :type="tagType">{{ data | displayValue }}</el-tag>
    </span>
  </template>

  <script>

  import _ from "lodash";

  export default {
    name: "Cell",
    props: ["data", "options"],
    data() {
      return {};
    },
    computed: {
      cid(){
        let columnName =
          this.data && this.data["column"] && this.data["column"]["property"];
        let row = this.data && this.data["row"];
        return `idp-row-${columnName}_${this.data.$index}`
      },
      
      // Determine the tag type based on the options(badge_type_enum) provided in the table header config of the respective table
      tagType() {
        const badgeTypeEnum = _.get(this.options, "badge_type_enum");
        const value = this.data;
        const columnName = value && value["column"] && value["column"]["property"];

        if (badgeTypeEnum && columnName) {
          return badgeTypeEnum[value["row"][columnName]];
        } else {
          return "success";
        }
      }
    },
    filters: {
      displayValue: function (value) {
        const columnName = value && value["column"] && value["column"]["property"];
        const row = value && value["row"];
        const inboxArr = ["Extracted", "Uploaded"];

        if (columnName && columnName.toLowerCase() === "stage" && inboxArr.includes(row.stage)) {
          return "Inbox";
        }

        return _.get(row, columnName, "");
      },
    },
  };
  </script>

  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style lang="scss">
.idp-status-badge{

  .el-tag--warning{
    background-color: white !important;
  	border-radius: 16px !important;
  	color: rgba(242, 205, 91, 1) !important;
  	display: inline-block !important;
  	font-size: 12px !important;
  	padding: 0 6px !important;
  	text-align: center !important;
  	white-space: nowrap !important;
  	border: 1px solid rgba(242, 205, 91, 0.7) !important;

  }

  .el-tag--success{
  	background-color: white !important;
  	border-radius: 16px !important;
  	color: rgba(66, 240, 153, 0.7) !important;
  	display: inline-block !important;
  	font-size: 12px !important;
  	padding: 0 6px !important;
  	text-align: center !important;
  	white-space: nowrap !important;
  	border: 1px solid rgba(66, 240, 153, 0.7) !important;
  }

  .el-tag--info{
  	background-color: white !important;
  	border-radius: 16px !important;
  	color: rgba(90, 103, 216, 1) !important;
  	display: inline-block !important;
  	font-size: 12px !important;
  	// height: 18px !important;
  	// line-height: 18px !important;
  	padding: 0 6px !important;
  	text-align: center !important;
  	white-space: nowrap !important;
  	border: 1px solid rgba(90, 103, 216, 0.7) !important;
  	// width: auto !important;
  	// max-width: 10rem !important;
  	// white-space: nowrap !important;
  	// text-overflow: ellipsis !important;
  	// overflow: hidden !important;
  }

  .el-tag--danger{
      	background-color: white !important;
    	border-radius: 16px !important;
    	// color: rgba(66, 240, 153, 0.7);
    	display: inline-block !important;
    	font-size: 12px !important;
    	padding: 0 6px !important;
    	text-align: center !important;
    	white-space: nowrap !important;
    	// border: 1px solid rgba(66, 240, 153, 0.7);
  }

  .el-tag.el-tag--light{
    min-width: 66px;
  }
}
  </style>
