<template>
  <div class="dashboard-cards">
    <!-- <gauge-chart class="charts-contrainer" :options="chartOptions" /> -->

  <el-row type="flex"  class="graph-toolbar-container">
    <el-col :span="20" class="title-container">
      <div class="header">Overall Accuracy</div>
    </el-col>
  </el-row>

  <el-row type="flex" class="charts-contrainer-container" justify="center">
    <el-col>
      <gauge-chart class="charts-contrainer" :options="chartOptions" />
    </el-col>
  </el-row>
  </div>


</template>

<script>
import GaugeChart from "../charts/GaugeChart.vue";
import IdpChartService from "@/services/IdpChartService";
import _ from "lodash";
export default {
  name: "GaugeChartWrapper",
  props: ["defaultQuery"],
  components: {
    GaugeChart,
  },
  data() {
    return {
      chartOptions: {
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%",
        },
        title: {
          text: "",
          left: 'center',
          show: false,
          x: "center",
          y: "left",
          textStyle: {
            fontSize: "12",
            fontWeight: "normal",
            fontStyle: "normal",
            color: "#2D3748",
            fontFamily: "Segoe UI",
          },
        },
        textStyle: {
          fontSize: 7,
        },
        series: [
          {
            name: "",
            type: "gauge",
            radius:"100%",
            detail: {
              formatter: "{value}%",
              textStyle: {
                fontSize: 20,
              },
            },
            data: [],

            axisLine: {
              lineStyle: {
                color: [
                  [0.2, "#FD5308"],
                  [0.8, "#FB9902"],
                  [1, "#66B032"],
                ],
                width: 10,
              },
            },
            pointer: {
              width: 5,
            },
            title: {
              textStyle: {
                fontSize: 11,
              },
              offsetCenter: ["10%", -40],
            },
          },
        ],
      },
    };
  },
  methods: {
    async setChartData() {
      let result = await IdpChartService.getChartData({
        chart_name: "GaugeChartWrapper",
        query: _.cloneDeep(this.defaultQuery) || {},
      });

      this.chartOptions.series[0]["data"] = [
        {
          value: result[0].average_accuracy.toFixed(2),
          name: "",
        },
      ];

    },
  },
  mounted() {},
  beforeMount() {
    this.setChartData();
  },
};
</script>

<style lang="scss" >
@import "../../_idpGlobal";
.charts-contrainer-container {
  .title-container {
    .header {
      font-size:14px;
      text-align: center;

    }
  }
}
</style>
