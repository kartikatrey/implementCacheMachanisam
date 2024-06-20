<template>
    <div class="approval-pending-container dashboard-cards">
      <!-- Graph Header -->
      <el-row type="flex" justify="space-between" class="graph-toolbar-container">
        <el-col :span="16" class="title-container">
          <div class="header">Approval Pending</div>
        </el-col>
      </el-row>
      <stack-bar-chart
        class="approval-pending-wrapper"
        :options="options"
        :name="'approval-pending-wrapper'"
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
    name: "ApprovalPendingWrapper",
    props: ["defaultQuery"],
    data() {
      return {
        options: {
          title: {
            text: "ApprovalPendingWrapper",
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
              color: '#718096',
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
          "approval_pending_wrapper",
          null,
          {stage: Constants.DOCEX.STAGE.WAITING_FOR_APPROVAL}
        );
  
        this.$router && this.$router.push(pushParams);
      },
      async setChartData() {
        let chartResult = await IdpChartService.getChartData({
            chart_name: "ApprovalPendingWrapper",
            query: this.defaultQuery || {}
        });
        chartResult = chartResult["data"];
        let keys = Object.keys(chartResult);
        let counts = [];
        for(let key of keys){
          counts.push({ name: key, value: chartResult[key] })
        }
        this.options.series[0].data = counts;
        this.options.xAxis.data = keys;
        DashboardDrillDownService.setWrapperColor(this.options);
        this.$store.commit('dashboardStore/setdashboardComponentStatus','ApprovalPendingWrapper');
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
    .approval-pending-container {
        .charts-contrainer .echarts {
            height: 20rem;
            width:auto;
            // transform: scale(.8);
        }
    }
  </style>
  