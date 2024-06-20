<template>
  <div>
     <!-- Graph Header -->
    <el-row type="flex" justify="center" class="graph-toolbar-container">
      <el-col :span="20" class="title-container">
        <div class="header">CLASSIFIED DOCUMENTS</div>
      </el-col>
    </el-row>

    <doughnut-chart
      class="document-by-classification-wrapper"
      :options="options"
      @onClick="onClick"
      :name="'document-by-classification-wrapper'"
    ></doughnut-chart>
  </div>
</template>

<script>
import DoughnutChart from "../charts/DoughnutChart.vue";
import IdpChartService from "@/services/IdpChartService";
import DashboardDrillDownService from "../../services/DashboardDrillDownService";
import _ from "lodash";

export default {
  name: "DocumentsByClassificationWrapper",
  props: ["defaultQuery"],
  data() {
    return {
      options: {
        label: {
          position: "center",
        },
        title: {
          text: "Total documents \n 0 ",
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
            selectedMode: "single",
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
      console.log(selectedData + name);
      const pushParams = DashboardDrillDownService.getNavigationRoute(
        selectedData,
        "document_by_classification",
        selectedData.name.toLowerCase()
      );
      console.log("DashboardDrillDownService.getNavigationRoute", pushParams);

      this.$router && this.$router.push(pushParams);
    },
    async setChartData() {
      let chartResult = await IdpChartService.getChartData({
        chart_name: "DocumentsByClassificationWrapper",
        query: _.cloneDeep(this.defaultQuery) || {},
      });

      let chartData = [];
      if (!chartResult.length)
        chartData = [{ value: 0, name: "No data found" }];

      let totalDocuments = 0;
      _.map(chartResult, (row, index) => {
        totalDocuments+= row.documents;
        chartData.push({
          value: row.documents,
          name: row.document_type.toUpperCase(),
          itemStyle: {
            color: this.colors[index],
          },
        });
      });
      this.options.title.text = `Total documents \n ${totalDocuments}`;
      this.options.series[0].data = chartData;
    },
  },
  beforeMount() {
    this.setChartData();
  },
};
</script>

<style lang="scss">
.graph-toolbar-container{
  .title-container{
    .header{
      text-align: center;
    }
  }

}
.document-by-classification-wrapper {
  .echarts {
    height: 23.5rem;
    width: auto;
    color: #0186FC;
  }
}
</style>
