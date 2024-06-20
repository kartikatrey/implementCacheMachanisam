<template>
  <div>
    <stacked-line-chart
      @onClick="onClick"
      class="charts-contrainer"
      :options="chartOptions"
    />
  </div>
</template>

<script>
import _ from "lodash";

import IdpDashboardService from "@/idp/services/IdpDashboardService";
import DashboardDrillDownService from "../../services/DashboardDrillDownService";
import StackedLineChart from "../charts/StackedLineChart.vue";
import constants from "@/resources/Constants";

export default {
  name: "TotalDocumentCountByCustomerWrapper",
  components: { StackedLineChart },
  props: {
  defaultQuery: {
      type: Object,
      default: () => ({}),
    },
    durationFilter:{
      type: String,
      default: () => ('2'),
    },
    customer: {
      type: Object,
      default: () => ({}),
    },
    config: {
      type: Object,
      default: () => ({ showGraphTitle: true }),
    },
  },
  data() {
    return {
      chartOptions: {},
      sortValue: 1,
      options :  {
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
        },
        tooltip: {
            trigger: 'item' // to display line chart data tooltip item wise
        },
        grid: {
            // top: '3%',
            left: '4%',
            right: '2%',
            bottom: '3%',
            containLabel: true
        },
        legend: {
            type: 'scroll',
            // padding: [100, 60],
            itemWidth: 14,
            itemHeight: 12,
            itemGap: 15,
            textStyle: {
                "color": "#4A5468",
                "fontSize": "10px",
                "margin": "10px"
            }
        },
        yAxis: {
            type: 'value'
        },
        // color: ["#ca67ca", "#4285F4", "#FB9902", "#EA4335"],
        series: [{
            data: [],
            type: 'line',
            areaStyle: {
                color: "#0186FC"
            },
            lineStyle: {
                color: '#1958FE'
            }
        }]
    },
      reRenderCharts: true,
    };
  },
  methods: {
    onClick(selectedData, errorType) {
      const pushParams = DashboardDrillDownService.getNavigationRoute(
        selectedData,
        "error_analytics"
      );
      pushParams.query.filter = JSON.parse(pushParams.query.filter);

      pushParams.query.filter.analytics_type = constants.DOCEX.FRAUD_CODES.FRAUD;

      pushParams.query.filter = JSON.stringify(pushParams.query.filter);
      this.$router && this.$router.push(pushParams);
    },
    onSortChange(order) {
      this.setChartData();
    },
    async setChartData() {
        let chartResult = await IdpDashboardService.getCardData({
          chart_name: "TotalDocumentCountByCustomerWrapper",
          query: _.cloneDeep(this.defaultQuery) || {},
          durationFilter: this.durationFilter
        });

        if (_.get(chartResult, "result.status")) {
          this.options["series"] = chartResult.result.cardData;
          this.options.xAxis["data"] = chartResult.result.xAxis;
        }
        this.chartOptions = this.options;  
        DashboardDrillDownService.setTotalDocumentCountByCustomerWrapperColor(this.chartOptions);
    },
  },
  beforeMount(){
    this.setChartData();
  }
};
</script>

<style lang="scss">
@import "../../_idpGlobal";
</style>
