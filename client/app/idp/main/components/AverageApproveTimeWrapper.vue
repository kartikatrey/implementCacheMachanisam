<template>
    <div class="Average-Approver-Time-container dashboard-cards">
      <!-- Graph Header -->
      <el-row type="flex" justify="space-between" class="graph-toolbar-container">
        <el-col :span="16" class="title-container">
          <div class="header">Average Approver Time (in hours)</div>
        </el-col>
        <el-col :span="5" class="filter-toolbar">
          <el-select v-model="sortValue" @change="onSortChange" placeholder="Select">
            <el-option
              v-for="item in selectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <stack-bar-chart
        :options="options"
      ></stack-bar-chart>
    </div>
</template>
  
  <script>
  import StackBarChart from "../charts/StackBarChart.vue";
  import IdpChartService from "@/services/IdpChartService";
  import Constants from "@/resources/Constants";
  import DashboardDrillDownService from "../../services/DashboardDrillDownService";
  import _ from "lodash";
  export default {
    name: "AverageApproveTimeWrapper",
    props: ["defaultQuery"],
    data() {
      return {
        sortValue: 1,
        selectOptions: [
          {
            value: 1,
            label: "Sort Ascending",
          },
          {
            value: -1,
            label: "Sort Descending",
          },
        ],
        options: {
          title: {
            text: "Accuracy By Entity",
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
          xAxis: {
            type: "value",
          },
          yAxis: {
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
      };
    },
    components: {
      StackBarChart,
    },
    methods: {
      onSortChange() {
        this.setChartData();
      },
      //Set The Average Approver Time Widget Data
      async setChartData() {
        let chartResult = await IdpChartService.getChartData({
            chart_name: "AverageApproveTimeWrapper",
            query: (this.defaultQuery) || {},
        });
        let volumes=[]
        chartResult.forEach((approver)=>{
            volumes.push({name: approver._id, value: approver.numOfHours})
        })
        if(this.sortValue === 1){
          volumes.sort((a, b) => b.value - a.value);
        }else{
          volumes.sort((a, b) => a.value - b.value);
        }
        let values = []
        volumes.forEach((approver)=>{
            values.push(approver.name.substring(0,9) + "...")
        })
        this.options.series[0].data = volumes;
        this.options.yAxis.data = values;
        DashboardDrillDownService.setWrapperColor(this.options);
        this.$store.commit('dashboardStore/setdashboardComponentStatus','AverageApproveTimeWrapper');
      },
    },
    beforeMount() {
      this.setChartData();
    },
  };
  </script>
  
  <style lang="scss">
  @import "../../_idpGlobal";
  
  
      .Average-Approver-Time-container {
          .charts-contrainer .echarts {
              height: 20rem;
              width:auto;
              // transform: scale(.8);
          }
      }
  
  
  </style>
  