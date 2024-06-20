<template>
  <div class="fraud-by-code-container">
    <DoughnutChart
     @onClick="onClick"
      class="fraud-by-code-wrapper-graph"
      name="fraud-by-code-wrapper-graph"
      :options="chartOptions"
    ></DoughnutChart>
  </div>
</template>

<script>
import _ from "lodash";

import IdpChartService from "@/services/IdpChartService";
import moment from "moment-timezone";
import DashboardDrillDownService from "../../../services/DashboardDrillDownService";
import DoughnutChart from "../../charts/DoughnutChart.vue";
import Constants from "@/resources/Constants";
export default {
  name: "FraudByCodeWrapper",
  components: { DoughnutChart },
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
        this.renderChartData();
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
      const pushParams = DashboardDrillDownService.getNavigationRoute(selectedData,"error_analytics");
      pushParams.query.filter = JSON.parse(pushParams.query.filter);

      pushParams.query.filter.code = selectedData.data.code;
      pushParams.query.filter.analytics_type = this.constant.DOCEX.FRAUD_CODES.FRAUD;

      pushParams.query.filter = JSON.stringify(pushParams.query.filter);
      this.$router && this.$router.push(pushParams);
    },
    onSortChange(order) {
      this.renderChartData();
    },
    getAPIQuery(){
      return {
        chart_name: "fraudsByCode",
        query: _.cloneDeep(this.defaultQuery) || {},
        sort_by: this.sortValue,
        type: "count",
        time_zone: moment.tz.guess(),
      };
    },
    setChartData(){
      this.chartOptions.tooltip = {
        position: function (p) {
          return [p[0] + 10, p[1] - 10];
        },
        formatter: (params) => {
          if (params.componentType === "legend") {
            return params.name;
          }
          let res = params.data.label;
          DashboardDrillDownService.setFraudByCodeWrapperColor(this.chartOptions);
          res += " <br/>" + params.marker + " " + params.value;

          return res;
        },
      };
    },
    async renderChartData() {
      let apiQuery = this.getAPIQuery()
      this.chartOptions = await IdpChartService.getFraudAnalyticsChartData(apiQuery);
      this.setChartData()
      this.$store.commit('dashboardStore/setdashboardComponentStatus','FraudByCodeWrapper');
    },
  },
};
</script>

<style lang="scss">
@import "../../../_idpGlobal";

.fraud-by-code-container {
  .fraud-by-code-wrapper-graph {
    .echarts {
      height: 250px !important;
      width: 100% !important;
    }
  }
}
</style>
