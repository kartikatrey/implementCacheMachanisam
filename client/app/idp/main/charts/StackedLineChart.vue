<template>
  <div class="charts-contrainer">
    <v-chart
      :option="options"
      @click="onClick"
      class="stacked-line-chart"
      autoresize
    />
  </div>
</template>

<script>
import "echarts/lib/chart/line";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/tooltip";

export default {
  name: "StackedLineChart",
  props: ["options"],
  data() {
    return {
      auto: true,
    };
  },
  methods: {
    onClick(data) {
      if (this.isLoggedInAsKanAdmin()) return;
      this.$emit("onClick", data, this.name);
    },
  },
  mounted() {},
};
</script>
<style lang="scss" >

</style>


