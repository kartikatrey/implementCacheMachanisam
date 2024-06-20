<template>
  <div class="dashboard-cards">
    <!-- Graph Header -->
    <el-row
      v-if="config && config.showGraphTitle"
      type="flex"
      class="graph-toolbar-container"
    >
      <el-col :span="20" class="title-container">
        <div class="header">{{ widgetTitle }}</div>
      </el-col>
    </el-row>

    <el-row
      type="flex"
      class="processing-time-wrapper-container"
      justify="center"
    >
      <el-col>
        <stack-bar-chart
          class="processing-time-wrapper"
          :options="options"
          :name="'stacked-bar-processing-time'"
          @onClick="onClick"
        ></stack-bar-chart>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import StackBarChart from "../charts/StackBarChart.vue";
import Constants from "@/resources/Constants";
import IdpChartService from "@/services/IdpChartService";
import DashboardDrillDownService from "../../services/DashboardDrillDownService";
import IdpDashboardService from "../../services/IdpDashboardService";
import moment from "moment-timezone";
import _ from "lodash";
export default {
  name: "ProcessingTimeWrapper",
  props: {
    "widgetTitle":{
      type: String,
      default: "",
    },
    defaultQuery: {
      type: Object,
      default: () => ({}),
    },
    customer: {
      type: Object,
      default: () => ({}),
    },
    config: {
      type: Object,
      default: () => ({ showGraphTitle: true }),
    },
  },
  data() {
    return {
      options: {
        title: {
          text: "",
          left: "center",
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
            bottom: '10%',
            top: '18%',
        },
        xAxis: {
          type: "category",
          data: [],
        },
        yAxis: {
          type: "value",
          data: [],
        },
        tooltip: {
          textStyle: {
            color: "#718096",
          },
        },
        legend: {
          top: 20,
          data: _.keys(Constants.DOCEX.DOCUMENT_TYPES),
          textStyle: 
            {
              "color": "#4A5468",
              "fontSize": "10px",
              "margin": "10px"
            }
        },
        color: ["#4285F4", "#FB9902", "#EA4335", "#FBBC04"],
      },
      documentTypes: [],
    };
  },
  components: { StackBarChart },
  methods: {
    async setDocumentTypes(result) {
      let documentTypesFromData = await IdpDashboardService.getDocTypes();
      if (!documentTypesFromData.length) {
        documentTypesFromData = _.uniq(_.map(result, "_id.document_type"));
      } else {
        documentTypesFromData.push(Constants.DOCEX.DOCUMENT_TYPES.OTHER);
      }
      const docTypeLabelMap = Constants.DOCEX.IDP_DASHBOARD.DOC_TYPE_LABEL_MAP;
      const allDocTypeList = Constants.DOCEX.DOCUMENT_TYPE_LIST;
      const configuredDocTypes = allDocTypeList.filter((documentType) =>
        documentTypesFromData.includes(documentType.value)
      );
      configuredDocTypes.map((docType) => {
        // Change the label from constant
        if (docTypeLabelMap[docType.value.toLowerCase()]) {
          docType.label = docTypeLabelMap[docType.value.toLowerCase()];
        }
        // Make it upper case
        docType.label = docType.label;
        return docType;
      });
      this.options.legend.data = configuredDocTypes.map(
        (docType) => docType.label
      );
      this.documentTypes = configuredDocTypes;
    },
    onClick(selectedData, name) {
      console.log(selectedData + name);
      const pushParams = DashboardDrillDownService.getNavigationRoute(
        selectedData,
        "document_volume_by_type",
        selectedData.seriesName.toLowerCase()
      );
      console.log("DashboardDrillDownService.getNavigationRoute", pushParams);

      this.$router && this.$router.push(pushParams);
    },
    async getChartData() {
      return await IdpChartService.getChartData({
        chart_name: "ProcessingTimeWrapper",
        query: _.cloneDeep(this.defaultQuery) || {},
        time_zone: moment.tz.guess(),
        customer_id: this.customer._id,
      });
    },

    async renderChartData() {
      try {
        const kanvTheme=this.$store.getters.selectedTheme;
        let dashboardColorMap = Constants.DOCEX.IDP_DASHBOARD[`DOC_TYPE_COLOR_MAP__${kanvTheme}`];
        let result = await this.getChartData();
        await this.setDocumentTypes(result);

        let queryResult = _.map(result, (row) => _.merge({}, row, row._id));
        queryResult = _.sortBy(queryResult, "date");
        let types = this.documentTypes;
        let dates = _.uniq(_.map(queryResult, "date"));
        this.options.xAxis["data"] = dates;
        let modifiedResult = [];
        
        for (let date of dates) {
          let filteredByDate = _.filter(queryResult, {date});
          let countByType = {};
          for (let doc_type of types) {
            let filterByType = _.find(filteredByDate,{document_type: doc_type.value});
            countByType[doc_type.value] = filterByType ? filterByType.count : 0;
          }
          modifiedResult.push(countByType);
        }
        let chartData = [];
        for (let doc_type of types) {
          // Color map
          const color = dashboardColorMap[doc_type.value.toLowerCase()];
          chartData.push({
            name: doc_type.label,
            type: "bar",
            stack: "stack",
            data: _.map(modifiedResult, doc_type.value),
            itemStyle: { color },
          });
        }
        this.options["series"] = chartData;
        DashboardDrillDownService.setProcessingTimeWrapperColor(this.options);
      } catch (e) {
        console.log(e);
      }
      this.$store.commit('dashboardStore/setdashboardComponentStatus','ProcessingTimeWrapper');
    },
  },
  async beforeMount() {
    await this.renderChartData();
  },
};
</script>

<style lang="scss" >
.processing-time-wrapper {
  padding-top: 10px;
  // .echarts {
  //   width: auto !important;
  //   height: 300px !important;
  // }
  // .echarts > div:first-child {
  //     width: auto !important;
  //     height: 280px !important;
  // }
  .echarts {
    width: auto !important;
    height: 22rem !important;
  }
  .echarts {
      canvas {
        // transform: scale(1.05);
      }
  }
}
</style>