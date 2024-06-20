<template>
  <div class="accurcy-by-vendor-container dashboard-cards">
    <!-- Graph Header -->
    <el-row type="flex"  class="graph-toolbar-container">
      <el-col :span="10" class="title-container">
        <div class="header">Accuracy By Entity</div>
      </el-col>
      <el-col :span="11" class="filter-toolbar">
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
      class="accurcy-by-vendor-wrapper"
      :options="options"
      :name="'accurcy-by-vendor-wrapper'"
      @onClick="onClick"
    ></stack-bar-chart>
  </div>
</template>

<script>
import StackBarChart from "../charts/StackBarChart.vue";
import IdpChartService from "@/services/IdpChartService";
import DashboardDrillDownService from "../../services/DashboardDrillDownService";
import _ from "lodash";
export default {
  name: "AccurcyByVendorsWrapper",
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
    };
  },
  components: {
    StackBarChart,
  },
  methods: {
    onClick(selectedData, name) {
      console.log(selectedData + name);
      const pushParams = DashboardDrillDownService.getNavigationRoute(
        selectedData,
        "accurcy_by_vendor",
        null
      );
      console.log("DashboardDrillDownService.getNavigationRoute", pushParams);

      this.$router && this.$router.push(pushParams);
    },
    onSortChange(order) {
      this.setChartData();
    },
    async setChartData() {
      let chartResult = await IdpChartService.getChartData({
        chart_name: "AccurcyByVendorsWrapper",
        query: _.cloneDeep(this.defaultQuery) || {},
        sort_order : this.sortValue
      });

      let vendors = _.map(chartResult, "vendor_name");
      vendors= vendors.map((vendor) => vendor.substr(0, 9)+"...");

      let accuracies = [];
       _.map(chartResult, (item)=>{accuracies.push({
        name:item.vendor_name,value: _.round(item.average_accuracy, 2) 
      })});
      this.options.series[0].data = accuracies;
      this.options.yAxis.data = vendors;
      this.$store.commit('dashboardStore/setdashboardComponentStatus','AccurcyByVendorsWrapper');
    },
  },
  beforeMount() {
    this.setChartData();
  },
};
</script>

<style lang="scss">
@import "../../_idpGlobal";
.accurcy-by-vendor-container {
  .graph-toolbar-container {
    margin-bottom: 0px;
     .title-container {
      width: 100%;
      margin: auto;
      .header{
        font-size:14px;
      }
    }

    .filter-toolbar {
      input {
        border: 0px;
        font-size: var(--font-base);
        text-align: left;
        color: var(--dark-04);
        font-weight: 400;
      }
      .el-select__caret {
         color: var(--dark-01);
      }
      .el-input--suffix .el-input__inner {
        padding-right: 23px;
      }
    }
  }
  .accurcy-by-vendor-wrapper {
    .echarts {
      height: 23rem;
      width: auto;
      transform: scale(1.03);
    }
  }
}
</style>
