<template>
  <span class="idp-date-container">
    {{ showFormattedDate }}
  </span>
</template>

<script>
import moment from "moment";
export default {
  name: "Date",
  props: ["data", "options"],
  computed: {
    showFormattedDate() {
      try {
        if(!this.value) return '';
        let now = moment();
        let dateValue = moment(this.value);
        return dateValue.format("DD MMM YYYY") != now.format("DD MMM YYYY")
          ? dateValue.format("ddd,DD MMM YYYY hh:mm A")
          : `Today ${dateValue.format("hh:mm A")}`;
      } catch (err) {
        return "Invalid date";
      }
    },
  },
  data() {
    return { columnName: null, row: null, value: "" };
  },
  beforeMount() {
    this.columnName =
      this.data && this.data["column"] && this.data["column"]["property"];
    this.row = this.data && this.data["row"];
    this.value = this.row[this.columnName];

    //If we have nested date column then set "is_nested_field" option to true and adjust column name to set value
    if (_.get(this.options, "is_nested_field")) {
      const nestedColumnName = this.columnName.split('.');
      this.value = _.get(this.row, nestedColumnName);
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.idp-date-container {
  color: var(--dark-02);
}
</style>
