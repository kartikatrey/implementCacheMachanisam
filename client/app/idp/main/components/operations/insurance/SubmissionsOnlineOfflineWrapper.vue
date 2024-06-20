<template>
  <div class="submission-online-offline-container dashboard-cards">
    <!-- Graph Header -->
    <el-row type="flex" justify="space-between" class="graph-toolbar-container">
      <el-col :span="16" class="title-container">
        <div class="header">Submissions Online/Offline</div>
      </el-col>
    </el-row>
    <stack-bar-chart
      class="submission-online-offline-wrapper"
      :options="options"
      :name="'submission-online-offline-wrapper'"
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
  name: "SubmissionsOnlineOfflineWrapper",
  props: ["defaultQuery"],
  data() {
    return {
      options: {
        title: {
          text: "Submissions Online/Offline",
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
        "submissions_online_offline_wrapper",
        null,
        options
      );
      console.log("DashboardDrillDownService.getNavigationRoute", pushParams);

      this.$router && this.$router.push(pushParams);
    },
    async setChartData() {
        const stageLabelMap = {
          "Published": "Published Online",
          "Closed": "Handled Offline"
        }
        let chartResult = await IdpChartService.getChartData({
            chart_name: "SubmissionsOnlineOfflineWrapper",
            query: _.cloneDeep(this.defaultQuery) || {}
        });
        let keys = [];  
        let counts = [];  
        _.map(chartResult, (row, index) => { 
          let stage = stageLabelMap[row.stage] || row.stage;
          keys.push(stage)
          counts.push({name: stage, value: row.count})
        });
        this.options.series[0].data = counts;
        this.options.xAxis.data = keys;
        this.$store.commit('dashboardStore/setdashboardComponentStatus','SubmissionsOnlineOfflineWrapper');
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


    .submission-online-offline-container {
        .charts-contrainer .echarts {
            height: 20rem;
            width:auto;
            // transform: scale(.8);
        }
    }


</style>
