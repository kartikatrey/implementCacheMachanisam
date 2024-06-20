<template>
  <div class="fraud-by-vendor-container">
    <StackBarChart
      @onClick="onClick"
      class="fraud-by-vendor-wrapper-graph"
      :options="chartOptions"
    ></StackBarChart>
  </div>
</template>

<script>
import _ from "lodash";

import IdpChartService from "@/services/IdpChartService";
import moment from "moment-timezone";
import DashboardDrillDownService from "../../../services/DashboardDrillDownService";
import StackBarChart from "../../charts/StackBarChart.vue";
export default {
  name: "FraudByActivityWrapper",
  components: { StackBarChart },
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
      pushParams.query.filter.vendor_name = [selectedData.name];

      pushParams.query.filter = JSON.stringify(pushParams.query.filter);
      this.$router && this.$router.push(pushParams);
    },
    onSortChange(order) {
      this.setChartData();
    },
    async setChartData() {
      let apiQuery = {
        chart_name: "fraudsByVendor",
        query: _.cloneDeep(this.defaultQuery) || {},
        sort_by: this.sortValue,
        type: "count",
        time_zone: moment.tz.guess(),
      };
      let response = await IdpChartService.getFraudAnalyticsChartData(apiQuery);
      this.chartOptions = response;

      this.chartOptions.tooltip = {
        trigger: "axis",
        position: function (p) {
          return [p[0] + 10, p[1] - 10];
        },
        formatter: (params) => {
          if (params.componentType === "legend") {
            return params.name;
          }
          let res = params[0].data.name;
          for (let i = 0, l = params.length; i < l; i++) {
            res += " <br/>" + params[i].marker + " " + params[i].value;
          }
          DashboardDrillDownService.setFraudByVendorWrapperColor(this.chartOptions);
          return res;
        },
      };
    },
  },
};
</script>

<style lang="scss">
@import "../../../_idpGlobal";

.fraud-by-vendor-container {
  .fraud-by-vendor-wrapper-graph {
    .echarts {
      height: 250px !important;
      width: 100% !important;
    }
  }
}
</style>
