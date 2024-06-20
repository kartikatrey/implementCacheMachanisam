<template>
  <div class="average-processing-time-per-vendor-container dashboard-cards">
    <!-- Graph Header -->
    <el-row type="flex" class="graph-toolbar-container">
      <el-col :span="17" class="title-container">
        <div class="header">Average Processing Time(Hours) Per Entity</div>
      </el-col>
      <el-col :span="7" class="filter-toolbar">
        <el-select
          @change="onSortChange"
          v-model="sortValue"
          placeholder="Select"
        >
          <el-option
            v-for="item in selectoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <stack-bar-chart
      class="average-processing-time-per-vendor-wrapper"
      :options="options"
      :name="'average-processing-time-per-vendor-wrapper'"
    ></stack-bar-chart>
  </div>
</template>

<script>
import StackBarChart from "../charts/StackBarChart.vue";
import IdpChartService from "@/services/IdpChartService";
import moment from "moment";
import Constants from "@/resources/Constants";
import DashboardDrillDownService from "../../services/DashboardDrillDownService";
import "moment-duration-format";
import _ from "lodash";
export default {
  name: "AvgProcessingTimePerVendorWrapper",
  props: ["defaultQuery"],
  data() {
    return {
      entityKey: "",
      options: {
        title: {
          text: "AVERAGE PROCESSING TIME PER ENTITY",
          left: "center",
          show: false,
          textStyle: {
            color: "#718096",
            fontSize: 11,
            fontWeight: 0,
          },
        },
        tooltip: {
          trigger: "axis",
          textStyle: {
            color: "#718096",
          },
          position: function (p) {
            return [p[0] + 10, p[1] - 10];
          },
          formatter: (params) => {
            if (params.componentType === "legend") {
              return params.name;
            }
            let res = params[0].data[this.entityKey];
            for (let i = 0, l = params.length; i < l; i++) {
              res +=
                " <br/>" +
                params[i].marker +
                params[i].seriesName +
                " : " +
                params[i].value;
            }
            return res;
          },
        },
        xAxis: [
          {
            type: "value",
            name: "Y-Axis",
            nameLocation: "middle",
            nameGap: "50",
          },
        ],

        yAxis: {
          type: "category",
          data: [],
        },
        dataZoom: [
          {
            type: "inside",
          },
        ],

        grid: {
          containLabel: true,
          left: '8%',
          right: '8%',
          bottom: '0%',
          top: '12%',
        },
        legend: {
          data: ["Inbox", "Approval Time", "Publish Time"],
          top: 10,
          textStyle: 
          {
            "color": "#4A5468",
            "fontSize": "10px",
            "margin": "10px"
          }
        },
        series: [
          {
            name: "Inbox",
            type: "bar",
            field: "inbox_time",
            stack: "stack",
            data: [],
            itemStyle: {
              color: "#0186FC",
            },
          },
          {
            name: "Approval Time",
            type: "bar",
            stack: "stack",
            field: "review_time",
            data: [],
            itemStyle: {
              color: "#FB9902",
            },
          },
          {
            name: "Publish Time",
            type: "bar",
            stack: "stack",
            field: "publish_time",
            data: [],
            itemStyle: {
              color: "#D0EA2B",
            },
          },
        ],
      },
      selectoptions: [
        {
          value: "asc",
          label: "Sort Ascending",
        },
        {
          value: "desc",
          label: "Sort Descending",
        },
      ],
      sortValue: "desc",
      labelMap: {
        "Waiting for approval": "Approval Time",
        "Waiting for publish": "Publish Time",
      },
      documentType: null,
      docTypeEntityMapping: {
        invoice: "vendor_name",
        po: "customer_name",
      },
    };
  },
  methods: {
    onSortChange() {
      this.renderChartData();
    },
    async getChartData() {
      return await IdpChartService.getChartData({
        chart_name: "AvgProcessingTimePerVendorWrapper",
        query: _.cloneDeep(this.defaultQuery) || {},
        sort_order: this.sortValue,
        entity_key: this.entityKey,
      });
    },
    async renderChartData() {
      this.entityKey = this.docTypeEntityMapping[this.documentType];
      let chartResult = await this.getChartData();
      let values = _.uniq(_.map(chartResult, this.entityKey));
      this.options.yAxis.data = values.map((value) => value.substring(0, 9) + "...");

      for (let [index,series] of this.options.series.entries()){
        const seriesName = this.labelMap[series.name] ? this.labelMap[series.name] : series.name;
        this.options.series[index].data = _.map(_.map(chartResult, (item) => {
            let value = parseFloat(
              moment.duration(item[series.field], "seconds").format("h.mm", { trim: false }).replace(/,/g, "")
            );
            return { [this.entityKey]: item[this.entityKey], name: seriesName, value };
          })
        );
      }
      DashboardDrillDownService.setAvgProcessingTimePerVendorWrapperColor(this.options);
      this.$store.commit('dashboardStore/setdashboardComponentStatus','AvgProcessingTimePerVendorWrapper');
    },
  },
  components: {
    StackBarChart,
  },
  beforeMount() {
    this.documentType = this.defaultQuery.document_type;
    this.renderChartData();
  },
};
</script>

<style lang="scss">
@import "../../_idpGlobal";

.average-processing-time-per-vendor-container {
  // .graph-toolbar-container {

    // .average-processing-time-per-vendor-wrapper {
    //     margin-top: var(--space-base);
    .average-processing-time-per-vendor-wrapper {
          height: 23rem;
          margin-top: -1.3rem;
    }
        .echarts {
            height: 25.5rem;
            width:auto;
            transform: scale(.88);
        }
    // }

  // }

}
</style>
