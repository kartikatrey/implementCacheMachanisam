<template>
  <span :cid="cid">
    {{ data | displayValue }}
  </span>
</template>

<script>

import _ from "lodash";
import {isPlainArray} from "@/util/CommonUtil";

export default {
  name: "Cell",
  props: ["data"],
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
  },
  filters: {
    displayValue: function (value) {
      const columnName = value && value["column"] && value["column"]["property"];
      let row = value && value["row"];
      const currentCell=_.get(row, columnName, "");
      //If cell contains array of values then change it as comma seperated values.
      if (isPlainArray(currentCell)) {
          row[columnName] = currentCell.join(', ');
      }
      const inboxArr = ["Extracted", "Uploaded"];

      if (columnName && columnName.toLowerCase() === "stage" && inboxArr.includes(row.stage)) {
        return "Inbox";
      }

      return currentCell;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
</style>
