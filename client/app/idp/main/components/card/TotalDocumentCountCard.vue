<template>
  <div>
    <doughnut-chart
      class="total-document-count-Card"
      :options="options"
      :name="'one'"
    ></doughnut-chart>
  </div>
</template>

<script>
import DoughnutChart from "../../charts/DoughnutChart.vue";
import IdpDashboardService from "@/idp/services/IdpDashboardService";
import DashboardDrillDownService from "../../../services/DashboardDrillDownService";
import _ from "lodash";

export default {
  name: "TotalDocumentCountCard",
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
      options: {
        label: { position: "center" },
        title: {
          text: "Total Documents \n 0 \n\n Total Pages \n 0",
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
          formatter: "{a} <br/>{b} : {c} ({d}%)",
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
                a: {
                  color: "#999",
                  lineHeight: 22,
                  align: "center",
                  fontSize: 10,
                },
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
                },
                pear: {
                  as: "{per|o} ",
                  fontWeight: 900,
                  fontSize: 10,
                  borderRadius: 1000,
                },
              },
            },
            data: [
              {
                value: 0,
                name: "Errored",
                itemStyle: {
                  color: "#FE2712",
                },
              },
              {
                value: 0,
                name: "Inbox",
                itemStyle: {
                  color: "#0147FE",
                },
              },
              {
                value: 0,
                name: "Confirmed",
                itemStyle: {
                  color: "#16a085",
                },
              },
              {
                value: 0,
                name: "Deleted",
                itemStyle: {
                  color: "#EA4335",
                },
              },
              {
                value: 0,
                name: "Pending approval",
                itemStyle: {
                  color: "#FB9902",
                },
              },
              {
                value: 0,
                name: "Approved",
                itemStyle: {
                  color: "#D0EA2B",
                },
              },
              {
                value: 0,
                name: "Rejected",
                itemStyle: {
                  color: "#e74c3c",
                },
              },
              {
                value: 0,
                name: "Published",
                itemStyle: {
                  color: "#66B032",
                },
              },
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
        chart_name: "TotalDocumentCountCard",
        query: _.cloneDeep(this.defaultQuery) || {},
        durationFilter: this.durationFilter,
      });

      if (_.get(chartResult, "result.cardData", []).length) {
        this.options.series[0].data = _.get(chartResult, "result.cardData",{}) 
        this.options.title.text = _.get(chartResult, "result.title","") 
      }
    },
  },
  beforeMount() {
    this.getChartData();
    DashboardDrillDownService.setTotalDocumentCountCardColor(this.options);
  },
};
</script>

<style lang="scss" >
.total-document-count-Card {
  .echarts {
    height: 24rem;
    width: 108% !important;
  }
}

.graph-toolbar-container {
  // margin-bottom: 15px;
  .title-container {
    .header {
      text-align: center;
    }
  }
}
</style>