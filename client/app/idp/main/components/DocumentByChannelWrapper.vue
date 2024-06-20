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
            @onClick="onClick"
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
import {capitalize} from "@/util/CommonUtil";
import _ from "lodash";

export default {
  name: "DocumentByChannelWrapper",
  props: ["defaultQuery","widgetTitle"],
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
              fontWeight: 800
          },
        },
        grid: {
          left: '8%',
          right: '8%',
          bottom: '0%',
          top: '12%',
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
    onClick(selectedData, name) {
      //If drilldown is not allowed for widget then, return
      if(!DashboardDrillDownService.isDrillDownAllowedForWidget()){
        return;
      }
      console.log(selectedData + name);
      const pushParams = DashboardDrillDownService.getNavigationRoute(
        selectedData,
        "document_count_by_channel",
        null
      );
      console.log("DashboardDrillDownService.getNavigationRoute", pushParams);

      this.$router && this.$router.push(pushParams);
    },
    async setChartData() {
      let chartResult = await IdpChartService.getChartData({
        chart_name: "DocumentByChannelWrapper",
        query: _.cloneDeep(this.defaultQuery) || {},
      });

      let chartData = [];

       // Constant values
      const kanvTheme=this.$store.getters.selectedTheme;
      let docChannelColorMap = Constants.DOCEX.IDP_DASHBOARD[`DOC_CHANNEL_COLOR_MAP__${kanvTheme}`];
      if (!chartResult.length)
        chartData = [{ value: 0, name: "No data found" }];
       let totalDocuments = 0;  
      _.map(chartResult, (row, index) => {

        // Color map
        const color = docChannelColorMap[row.channel];
        chartData.push({
          value: row.documents,
          label: row.channel,
          name: row.channel && capitalize(row.channel),
          itemStyle: {color},
        });
        
        totalDocuments = totalDocuments + (row.documents || 0)
        this.options.title.text = `Total\n${totalDocuments.toString()}`;
        this.options.series[0].data = chartData;
        DashboardDrillDownService.setDocumentByChannelWrapperColor(this.options);
      });
      this.$store.commit('dashboardStore/setdashboardComponentStatus','DocumentByChannelWrapper');
    },
  },
  beforeMount() {
    this.setChartData();
  },
};
</script>

<style lang="scss">
// @import "../../_idpVariables";
// .document-by-channel-container {
//   .title-container {
//     .header {
//       font-size:14px;
//       text-align: center;
//     }
//   }
// }
.document-by-channel-wrapper {
  .echarts {
    height: 24rem;
    width: auto;
  }
}
</style>
