<template>
  <div class="fraud-by-activity-container">
    <stacked-line-chart
      @onClick="onClick"
      class="charts-contrainer"
      :options="chartOptions"
    />
  </div>
</template>

<script>
import _ from "lodash";

import IdpChartService from "@/services/IdpChartService";
import moment from "moment-timezone";
import DashboardDrillDownService from "../../../services/DashboardDrillDownService";
import StackedLineChart from "../../charts/StackedLineChart.vue";
import Constants from "@/resources/Constants";
export default {
  name: "FraudByAmountWrapper",
  components: { StackedLineChart },
    inject:['constant'],
  props: {
    chartName: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    enableSort: {
      type: Boolean,
      default: false,
    },
    defaultQuery: {
      type: Object,
      default: null,
    },
  },
  watch: {
    defaultQuery: {
      handler: function (newVal, oldval) {
        if (newVal == null) return;
        this.setChartData();
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      chartOptions: {},
      sortValue: 1,
      grid: {
          left: '10%',
          // right: '10%',
          bottom: '0%',
          // top: '10%',
        },

      reRenderCharts: true,
    };
  },
  methods: {
    onClick(selectedData, errorType) {
      console.log(selectedData + name);
      const pushParams = DashboardDrillDownService.getNavigationRoute(
        selectedData,
        "error_analytics"
      );
      pushParams.query.filter = JSON.parse(pushParams.query.filter);

      pushParams.query.filter.analytics_type = this.constant.DOCEX.FRAUD_CODES.FRAUD;

      pushParams.query.filter = JSON.stringify(pushParams.query.filter);
      this.$router && this.$router.push(pushParams);
    },
    onSortChange(order) {
      this.setChartData();
    },
    async setChartData() {
      let apiQuery = {
        chart_name: "frauds",
        query: _.cloneDeep(this.defaultQuery) || {},
        sort_order: this.sortValue,
        filter_by: "amount",
        time_zone: moment.tz.guess(),
      };
      let response = await IdpChartService.getFraudAnalyticsChartData(apiQuery);
      this.chartOptions = response;
      DashboardDrillDownService.setFraudByAmountWrapperColor(this.chartOptions);
    },
  },
};
</script>

<style lang="scss">
@import "../../../_idpGlobal";

.fraud-by-activity-container {
  .charts-contrainer {
    .echarts {
      height: 21rem ;
      width: auto;
    }
  }
}
</style>
