<template>
  <div class="dashboard-cards">
    <!-- Graph Header -->
    <el-row v-if="config && config.showGraphTitle" type="flex"  class="graph-toolbar-container">
      <el-col :span="20" class="title-container">
        <div class="header">All Documents By Stage</div>
      </el-col>
    </el-row>

    <doughnut-chart
      v-if="reRenderChart"
      class="total-document-count-wrapper"
      :options="options"
      :name="'one'"
      @onClick="onClick"
    ></doughnut-chart>
  </div>
</template>

<script>
import DoughnutChart from "../charts/DoughnutChart.vue";
import IdpChartService from "@/services/IdpChartService";
import DashboardDrillDownService from "../../services/DashboardDrillDownService";
import _ from "lodash";
import Constants from "@/resources/Constants";
import store from "@/store/store";

export default {
  name: "TotalDocumentCountWrapper",
  props: {
    "defaultQuery":{
        type: Object,
        default:()=> ({})
      },
    "customer":{
        type: Object,
        default:()=> ({})
      },
      "config":{
         type:Object,
         default:()=>({showGraphTitle:true}),
      }
  },
  data() {
    return {
      reRenderChart:true,
      options: {
        label: { position: "center" },
        title: {
          text: "Total documents\n0\n\nTotal pages\n0",
          left: "center",
          top: "center",
          show: true,
          textStyle: {
            color: "#718096",
            fontSize: 10,
            textTransform: "capitalize"
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
          textStyle: {
            color: "#718096",
          }
        },
        series: [
          {
            name: "",
            type: "pie",
            // radius: ["42%", "60%"],
            // center: ["50%", "50%"],
            radius: ["55%", "80%"],
            center: ["50%", "50%"],
            label: {
              formatter: "{b|{b}}   {c|{c}}",
              rich: {
                a: {
                  color: "#999",
                  lineHeight: 22,
                  align: "center",
                  fontSize: 10,
                },
                b: {
                  fontSize: 10,
                  lineHeight: 33,
                  color: "#718096",
                },
                c: {
                  fontSize: 10,
                  lineHeight: 33,
                  fontWeight: 900,
                  color: "#4A5568",
                },
                pear: {
                  as: "{per|o} ",
                  fontWeight: 900,
                  fontSize: 10,
                  borderRadius: 1000,
                },
              },
            },
            data: [
              {
                value: 0,
                name: "Errored",
                itemStyle: {
                  color: "#FE2712",
                },
              },
              {
                value: 0,
                name: "Inbox",
                itemStyle: {
                  color: "#0147FE",
                },
              },
              {
                value: 0,
                name: "Confirmed",
                itemStyle: {
                  color: "#16a085",
                },
              },
               {
                value: 0,
                name: "Deleted",
                itemStyle: {
                  color: "#EA4335",
                },
              },
              {
                value: 0,
                name: "Pending approval",
                itemStyle: {
                  color: "#FB9902",
                },
              },
              {
                value: 0,
                name: "Approved",
                itemStyle: {
                  color: "#D0EA2B",
                },
              },
              {
                value: 0,
                name: "Rejected",
                itemStyle: {
                  color: "#e74c3c",
                },
              },
              {
                value: 0,
                name: "Published",
                itemStyle: {
                  color: "#66B032",
                },
              },
              {
                value: 0,
                name: "Paid",
                itemStyle: {
                  color: "#66B032",
                },
              },  
              {
                value: 0,
                name: "Cancelled",
                itemStyle: {
                  color: "#e74c3c",
                },
              }
            ],
          },
        ],
      },
    };
  },
  components: { DoughnutChart },
  methods: {
    onClick(selectedData, name) {
      //If drilldown is not allowed for widget then, return
      if(!DashboardDrillDownService.isDrillDownAllowedForWidget()){
        return;
      }
      const pushParams = DashboardDrillDownService.getNavigationRoute(
        selectedData,
        "total_document_count_by_stages",
        null
      );
      console.log("DashboardDrillDownService.getNavigationRoute", pushParams);

      this.$router && this.$router.push(pushParams);
    },
    async getChartData() {
      let chartResult = await IdpChartService.getChartData({
        chart_name: "TotalDocumentCountWrapper",
        query: _.cloneDeep(this.defaultQuery) || {},
        customer_id:this.customer._id
      });
      const titleInfo = chartResult["titleInfo"]
      chartResult = chartResult["docs"]
      if (chartResult.length) {
        this.processGraphOptions(chartResult);
        this.setGraphTitle(titleInfo);
      }
      this.$store.commit('dashboardStore/setdashboardComponentStatus','TotalDocumentCountWrapper');
    },
    processGraphOptions(chartResult) {
      const kanvTheme = this.$store.getters.selectedTheme;
      const docType = this.defaultQuery.document_type;
      const groupedByStages = _.groupBy(chartResult, "stage");
      let seriesData = [];

      // Constant values
      let dashboardColorMap = Constants.DOCEX.IDP_DASHBOARD[`STAGE_COLOR_MAP__${kanvTheme}`];
      const stageLabelMap =  Constants.DOCEX.IDP_DASHBOARD.STAGE_LABEL_MAP;
      const ALL_STAGE = this.getStagesByDocumentType(docType)
      ALL_STAGE.map(stageLabel =>{
          let stage = stageLabel;

          // Change value to actual stage name stored in DB
          if(stageLabelMap[stage]){stage = stageLabelMap[stage]};
          
          // Color map
          const color = dashboardColorMap[stage];
          const label = _.get(Constants.DOCEX.STAGE_LABEL_MAP,stageLabel,stageLabel)

          const graphSeries = {
                  value: groupedByStages[stage] ? this.getDocumentCount(groupedByStages, stage):0,
                  name:label,
                  stage,
                  itemStyle: {color}
          };
          seriesData.push(graphSeries)
      })

      let clonedOptions = _.cloneDeep(this.options)
      clonedOptions.series[0].data = seriesData;
      this.options = _.cloneDeep(clonedOptions)
      this.reRenderChart = false
      this.$nextTick(()=>this.reRenderChart = true)
    },
    getStagesByDocumentType(document_type){
      let widgetStages = []
      const user = this.$store.getters.user;
      //get selected stage tabs for customer based on current document type
      const userStageConfiguration = user.selected_stage_tabs ? _.find(user.selected_stage_tabs, {document_type}) : {};
      const selectedStageTabs = _.get(userStageConfiguration, "stage_tabs", []);
      //if no selected stage tabs, show all the stage tabs for vendor user or other user
      if(selectedStageTabs.length) widgetStages = selectedStageTabs;
      else if(this.isVendorUser()) widgetStages = Constants.DOCEX.VENDOR_DASHBOARD_WIDGET_STAGES
      else widgetStages = Constants.DOCEX.DASHBOARD_WIDGET_STAGES
      return widgetStages;
    },
    getDocumentCount(groupedByStages, stage) {
      let value = 0;
      value = groupedByStages[stage].reduce(function (prev, cur) {
        return prev + cur.count;
      }, 0);
      return value;
    },
    setGraphTitle(titleInfo) {
      let title = `Total Documents\n${titleInfo.documents || 0}\n\nTotal Pages\n${titleInfo.pages || 0}`;
      if(this.defaultQuery.document_type === "insurance"){
        title = `Total Packages\n${titleInfo.packages}\n\n${title}`
      }
      this.options.title.text = title;
      console.log(this.options.title.text);
    }
  },
  beforeMount() {
    this.getChartData();
    DashboardDrillDownService.setTotalDocumentCountWrapperColor(this.options);
  },
};
</script>

<style lang="scss" >
@import "../../_idpGlobal";
.total-document-count-wrapper {
  margin-top: var(--space-xl);
    .echarts {
        height: 250px;
        width: 108% !important;
        transform: scale(.92);
    }
}
</style>