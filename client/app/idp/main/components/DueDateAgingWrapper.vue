<template>
    <div class="due-date-container dashboard-cards">
      <!-- Graph Header -->
      <el-row type="flex" justify="space-between" class="graph-toolbar-container">
        <el-col :span="16" class="title-container">
          <div class="header">Due Date  <i>(in days from today)</i></div>
        </el-col>
      </el-row>
      <stack-bar-chart
        class="due-date-wrapper"
        :options="options"
        :name="'due-date-wrapper'"
        @onClick="onClick"
      ></stack-bar-chart>
    </div>
</template>
  
<script>
import StackBarChart from "../charts/StackBarChart.vue";
import IdpChartService from "@/services/IdpChartService";
import DashboardDrillDownService from "../../services/DashboardDrillDownService";
import Constants from "@/resources/Constants";
import _ from "lodash";
export default {
  name: "DueDateWrapper",
  props: ["defaultQuery"],
  data() {
    return {
      options: {
        title: {
          text: "Due Date",
          show: false,
          textStyle: {
            color: "#718096",
            fontSize: 11,
            fontWeight: 0,
          },
        },
        grid: {
          containLabel: true,
            left: '8%',
            right: '8%',
            bottom: '0%',
            top: '12%',
        },
        tooltip: {
          textStyle: {
              color: "#718096",
          },
        },
        yAxis: {
          type: "value",
        },
        xAxis: {
          type: "category",
          data: [],
        },
        series: [
          {
            type: "bar",
            data: [],
            itemStyle: {
              color: "#0186FC",
            },
          },
        ],
      },
      documentType: null
    };
  },
  components: {
    StackBarChart,
  },
  methods: {
    onClick(selectedData, name) {
      const pushParams = DashboardDrillDownService.getNavigationRoute(
        selectedData,
        "due_date_wrapper",
        null
      );
      // To pass filter with url (bug id:4115)
      this.$router && this.$router.push(pushParams);
    },

    async setChartData() {
      let chartResult = await IdpChartService.getChartData({
          chart_name: "DueDateWrapper",
          query: this.defaultQuery || {}
      });
      chartResult = chartResult["data"];
      // chartResult = {[key:value]}
      let keys = Object.keys(chartResult);
      let counts = [];
      for(let key of keys){
        counts.push({ name: key, value: chartResult[key] })
      }
      this.options.series[0].data = counts;
      this.options.xAxis.data = keys;
      DashboardDrillDownService.setDueDateWrapperColor(this.options);
      this.$store.commit('dashboardStore/setdashboardComponentStatus','DueDateWrapper');
    },
  },

  beforeMount() {
    this.documentType = this.defaultQuery.document_type;
    this.setChartData();
  },
};
</script>
  
<style lang="scss">
@import "../../_idpGlobal";
  .due-date-container {
      .charts-contrainer .echarts {
          height: 20rem;
          width:auto;
          // transform: scale(.8);
      }
  }
</style>
  