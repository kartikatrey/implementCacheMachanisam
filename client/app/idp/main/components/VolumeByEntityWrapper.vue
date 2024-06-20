<template>
  <div class="volume-by-entity-container dashboard-cards">
    <!-- Graph Header -->
    <el-row type="flex" justify="space-between" class="graph-toolbar-container">
      <el-col :span="16" class="title-container">
        <div class="header">Volume By Entity</div>
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
      class="volume-by-entity-wrapper"
      :options="options"
      :name="'volume-by-entity-wrapper'"
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
  name: "VolumeByEntityWrapper",
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
      documentType: null,
      docTypeEntityMapping: {
        invoice: "vendor_name",
        po: "customer_name",
      },
    };
  },
  components: {
    StackBarChart,
  },
  methods: {
    onClick(selectedData, name) {
      console.log(selectedData + name);
      let options = { entityKey : this.docTypeEntityMapping[this.documentType] }
      const pushParams = DashboardDrillDownService.getNavigationRoute(
        selectedData,
        "volume_by_entity",
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
          chart_name: "VolumeByEntityWrapper",
          query: _.cloneDeep(this.defaultQuery) || {},
          sort_order : this.sortValue
      });

      let values = _.map(chartResult, 'field_key');
      values= values.map((value) => value.substring(0, 9)+"...");
      let volumes = [];
       _.map(chartResult, (item)=>{volumes.push({
        name:item['field_key'],value: _.round(item.volume, 2) 
      })});
      this.options.series[0].data = volumes;
      this.options.yAxis.data = values;
      DashboardDrillDownService.setWrapperColor(this.options);
      this.$store.commit('dashboardStore/setdashboardComponentStatus','VolumeByEntityWrapper');
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


    .volume-by-entity-container {
        .charts-contrainer .echarts {
            height: 20rem;
            width:auto;
            // transform: scale(.8);
        }
    }


</style>
