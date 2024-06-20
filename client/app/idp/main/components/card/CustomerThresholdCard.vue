<template>
  <div>
    <doughnut-chart
      class="customer-threshold-card"
      :options="options"
      :name="cutomer-threshold"
    ></doughnut-chart>
  </div>
</template>

<script>
import DoughnutChart from "../../charts/DoughnutChart.vue";
import IdpDashboardService from "@/idp/services/IdpDashboardService";
import DashboardDrillDownService from "../../../services/DashboardDrillDownService";
import _ from "lodash";

export default {
  name: "CustomerThresholdCard",
  props: {},
  data() {
    return {
      options: {
        label: { position: "center" },
        title: {
          text: "Total Customers \n 0",
          left: "center",
          top: "center",
          show: true,
          textStyle: {
            color: "#718096",
            fontSize: 10,
          },
        },
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            let message = `${params.name} : ${params.value} <br/>`;
            if (params && params.data && params.data.tooltipContent) {
              for (const [index,title] of params.data.tooltipContent.entries()) {
                message = message + `${index + 1} . ${title} <br/>`
              }
            }
            return message;
          }
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["42%", "60%"],
            center: ["50%", "50%"],
            label: {
              formatter: "{b|{b}}   {c|{c}}",
              rich: {
                b: {
                  fontSize: 10,
                  lineHeight: 33,
                  color: "#718096",
                },
                c: {
                  fontSize: 10,
                  lineHeight: 33,
                  fontWeight: 900,
                  color: "#4A5568",
                }
              },
            },
            data: [
              {
                value: 0,
                name: "Below Threshold",
                itemStyle: {
                  color: "#FE2712",
                },
              },
              {
                value: 0,
                name: "Above Threshold",
                itemStyle: {
                  color: "#66B032",
                },
              }
            ],
          },
        ],
      },
    };
  },
  components: { DoughnutChart },
  methods: {
    async getChartData() {
      let chartResult = await IdpDashboardService.getCardData({
        chart_name: "CustomerThresholdCard"
      });

      if (_.get(chartResult, "result.cardData", []).length) {
        this.options.series[0].data = _.get(chartResult, "result.cardData",{}) 
        this.options.title.text = _.get(chartResult, "result.title","") 
      }
    },
  },
  beforeMount() {
    this.getChartData();
    DashboardDrillDownService.setCustomerThresholdCardColor(this.options);
  },
};
</script>

<style lang="scss" >
.customer-threshold-card {
  .echarts {
    height: 260px;
    width: 108% !important;
  }
}
</style>