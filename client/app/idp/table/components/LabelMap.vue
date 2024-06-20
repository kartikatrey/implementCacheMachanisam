<template>
    <span>{{mappedValue}}</span>
</template>

<script>
const _ = require('lodash');
export default {
  name: "LabelMap",
  props: ["propData","options", "data"],
  computed: {
     mappedValue() {
      const columnName = _.get(this.data, 'column.property') || _.get(this.propData,'column.field'); 
      const value = _.get(this.data, `row.${columnName}`) || _.get(this.propData, `row.${columnName}`);
      const mapping = this.options && this.options.mapping
      return mapping[value] || value;
    }
  }
};
</script>

