<template>
  <div class="dashboard-cards">
    <!-- Graph Header -->
    <el-row type="flex" class="graph-toolbar-container">
      <el-col :span="20" class="title-container">
        <div class="header">{{ widgetTitle }}</div>
      </el-col>
    </el-row>

    <el-row type="flex" class="document-by-channel-container" justify="center">
      <el-col>
        <doughnut-chart
          class="document-by-channel-wrapper"
          :options="options"
          :name="'document-by-channel-wrapper'"
        ></doughnut-chart>
      </el-col>
    </el-row>
  </div>
</template>
  
  
  
  <script>
import DoughnutChart from "../charts/DoughnutChart.vue";
import IdpChartService from "@/services/IdpChartService";
import DashboardDrillDownService from "../../services/DashboardDrillDownService";
import Constants from "@/resources/Constants";
import { capitalize } from "@/util/CommonUtil";
import _ from "lodash";

export default {
  name: "SubmissionEmails",
  props: ["defaultQuery", "widgetTitle"],
  data() {
    return {
      options: {
        label: {
          position: "center",
        },
        title: {
          text: "",
          left: "center",
          top: "center",
          show: true,
          textStyle: {
            color: "#718096",
            fontSize: 10,
            fontWeight: 800,
          },
        },
        grid: {
          left: "8%",
          right: "8%",
          bottom: "0%",
          top: "12%",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
          textStyle: {
            color: "#718096",
          },
        },
        series: [
          {
            selectedMode: "single",
            name: "",
            type: "pie",
            radius: ["42%", "62%"],
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
            data: [],
          },
        ],
      },
      colors: [
        "#66B032",
        "#D0EA2B",
        "#4285F4",
        "#FBBC04",
        "#EA4335",
        "#0186FC",
        "#FB9902",
      ],
    };
  },
  
  components: {
    DoughnutChart,
  },

  methods: {
    async setChartData() {
      let chartResult = await IdpChartService.getChartData({
        chart_name: "SubmissionEmails",
        query: _.cloneDeep(this.defaultQuery) || {},
      });

      let chartData = [];
      // Constant values for light and dark theme
      const kanvTheme = this.$store.getters.selectedTheme;
      let docChannelColorMap = Constants.DOCEX.IDP_DASHBOARD[`SUBMISSION_EMAILS__${kanvTheme}`];

      if (!chartResult.length)  {
        chartData = [{ value: 0, name: "No data found" }];
      }

      let totalDocuments = 0;
      _.map(chartResult, (row, index) => {
        // Color map based on stage - Published or Non Published
        const color = docChannelColorMap[row.stage];
        chartData.push({
          value: row.total,
          label: row.stage,
          name: row.stage && capitalize(row.stage),
          itemStyle: { color },
        });

        totalDocuments = totalDocuments + (row.total || 0);
        this.options.title.text = `Total\n${totalDocuments.toString()}`;
        this.options.series[0].data = chartData;
      });
      this.$store.commit(
        "dashboardStore/setdashboardComponentStatus",
        "SubmissionEmails"
      );
    },
  },

  beforeMount() {
    this.setChartData();
  }
};
</script>
  
<style lang="scss">
  .document-by-channel-wrapper {
    .echarts {
      height: 24rem;
      width: auto;
    }
  }
</style>
  