<template>
    <div class="document-by-subtype-container dashboard-cards">
      <!-- Graph Header -->
      <el-row type="flex" justify="space-between" class="graph-toolbar-container">
        <el-col :span="16" class="title-container">
          <div class="header">{{ widgetTitle }}</div>
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
        class="document-by-subtype-wrapper"
        :options="options"
        :name="'document-by-subtype-wrapper'"
        @onClick="onClick"
      ></stack-bar-chart>
    </div>
</template>
  
  <script>
  import StackBarChart from "../../../charts/StackBarChart.vue";
  import IdpChartService from "@/services/IdpChartService";
  import DashboardDrillDownService from "../../../../services/DashboardDrillDownService";
  import {capitalizeFirstLetter} from "@/util/CommonUtil";
  import _ from "lodash";
  export default {
    name: "DocumentBySubtypeWrapper",
    props: ["defaultQuery","widgetTitle"],
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
            text: "Document By Subtype",
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
          "document_by_subtype",
          null,
          options
        );
        console.log("DashboardDrillDownService.getNavigationRoute", pushParams);
  
        this.$router && this.$router.push(pushParams);
      },
      onSortChange() {
        this.setChartData();
      },
      async setChartData() {
          let chartResult = await IdpChartService.getChartData({
              chart_name: "DocumentBySubtypeWrapper",
              query: _.cloneDeep(this.defaultQuery) || {},
              sort_order : this.sortValue
          });
  
        let values = _.map(chartResult, 'document_subtype');
        values= values.map((value) => {
          value = capitalizeFirstLetter(value);
          value.length >=20 ? value.substring(0, 20)+"..." : value
          return value
        });
  
        let counts = [];
         _.map(chartResult, (item)=>{counts.push({
          name:item['document_subtype'],value: _.round(item.total, 2) 
        })});
        this.options.series[0].data = counts;
        this.options.yAxis.data = values;
        this.$store.commit('dashboardStore/setdashboardComponentStatus','DocumentBySubtypeWrapper');
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
  
  
      .document-by-subtype-container {
          .charts-contrainer .echarts {
              height: 20rem;
              width:auto;
              // transform: scale(.8);
          }
      }
  
  
  </style>
  