<template>
  <div>{{ value }}</div>
</template>

<script>
import _ from "lodash";
import flatten from "flat";

export default {
  name: "NestedField",
  props: ["propData", "options"],
  watch: {
    propData() {},
  },
  computed: {},
  methods: {},
  data() {
    return {
      value: "",
    };
  },
  beforeMount() {},
  mounted() {
    console.log("this.propData.row", this.propData.row);
    console.log("==========> this.options.key", this.options.key);
    this.value =
      this.propData && this.propData.row
        ? flatten(this.propData.row)[this.options.key]
        : null;
  },
};
</script>
<style lang="scss">
</style>
