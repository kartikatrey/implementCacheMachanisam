<template>
  <div>
    <stack-bar-chart
      class="processing-time-card-wrapper"
      :options="options"
      :name="'stacked-bar-processing-time'"
    ></stack-bar-chart>
  </div>
</template>
<script>
import StackBarChart from "../../charts/StackBarChart.vue";
import IdpDashboardService from "@/idp/services/IdpDashboardService";
import DashboardDrillDownService from "../../../services/DashboardDrillDownService";
import _ from "lodash";
export default {
  name: "DocumentByVolumeCard",
  props: {
    defaultQuery: {
      type: Object,
      default: () => ({}),
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
        title: {
          text: "DOCUMENTS BY VOLUME (Bar)",
          left: "center",
          show: false,
          textStyle: {
            color: "#718096",
            fontSize: 11,
            fontWeight: 0,
          },
        },
        grid: {
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: [],
        },
        yAxis: {
          type: "value",
          data: [],
        },
        tooltip: {},
        legend: {
          bottom: "10",
          data: [],
          textStyle: {
            fontSize: "9",
            fontWeight: "normal",
            fontStyle: "normal",
            fontFamily: "Segoe UI",
          },
        },
        color: ["#4285F4", "#FB9902", "#EA4335", "#FBBC04"],
      },
      documentTypes: [],
    };
  },
  components: { StackBarChart },
  methods: {
    async setChartData() {
      try {
        let chartResult = await IdpDashboardService.getCardData({
          chart_name: "DocumentByVolumeCard",
          query: _.cloneDeep(this.defaultQuery) || {},
        });

        if (_.get(chartResult, "result.status")) {
          this.options["series"] = chartResult.result.cardData;
          this.options.xAxis["data"] = chartResult.result.xAxis;
          this.options.legend.data = chartResult.result.docTypes.map(
            (docType) => docType.toUpperCase()
          );
          DashboardDrillDownService.setDocumentByVolumeCardColor(this.options);
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {},
  async beforeMount() {
    await this.setChartData();
  },
};
</script>

<style lang="scss" >

</style>