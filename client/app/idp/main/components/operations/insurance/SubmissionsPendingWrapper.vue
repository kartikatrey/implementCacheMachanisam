<template>
    <div class="submission-pending-container dashboard-cards">
      <!-- Graph Header -->
      <el-row type="flex" justify="space-between" class="graph-toolbar-container">
        <el-col :span="16" class="title-container">
          <div class="header">Submissions Pending Action</div>
        </el-col>
      </el-row>
      <stack-bar-chart
        class="submission-pending-wrapper"
        :options="options"
        :name="'submission-pending-wrapper'"
        @onClick="onClick"
      ></stack-bar-chart>
    </div>
</template>
  
  <script>
  import StackBarChart from "../../../charts/StackBarChart.vue";
  import IdpChartService from "@/services/IdpChartService";
  import DashboardDrillDownService from "../../../../services/DashboardDrillDownService";
  import _ from "lodash";
  export default {
    name: "SubmissionsPendingWrapper",
    props: ["defaultQuery"],
    data() {
      return {
        options: {
          title: {
            text: "Submissions Pending Action",
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
        console.log(selectedData + name);
        let options = { }
        const pushParams = DashboardDrillDownService.getNavigationRoute(
          selectedData,
          "submissions_pending_actions",
          null,
          options
        );
        console.log("DashboardDrillDownService.getNavigationRoute", pushParams);
  
        this.$router && this.$router.push(pushParams);
      },
      async setChartData() {
          let chartResult = await IdpChartService.getChartData({
              chart_name: "SubmissionsPendingWrapper",
              query: _.cloneDeep(this.defaultQuery) || {}
          });
        chartResult = chartResult["data"]
        let keys = Object.keys(chartResult)  
        let counts = [];
         _.map(keys, (key)=>{counts.push({
            name: key, value: chartResult[key] 
        })});
        this.options.series[0].data = counts;
        this.options.xAxis.data = keys;
        this.$store.commit('dashboardStore/setdashboardComponentStatus','SubmissionsPendingWrapper');
      },
    },
    beforeMount() {
      this.documentType = this.defaultQuery.document_type;
      this.setChartData();
    },
  };
  </script>
  
  <style lang="scss">
  @import "../../../../_idpGlobal";
  
  
      .submission-pending-container {
          .charts-contrainer .echarts {
              height: 20rem;
              width:auto;
              // transform: scale(.8);
          }
      }
  
  
  </style>
  