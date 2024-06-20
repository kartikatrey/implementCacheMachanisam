<template>
  <div class="dashboard-cards">
    <!-- Graph Header -->
      <el-row type="flex"  class="graph-toolbar-container">
        <el-col :span="20" class="title-container">
          <div class="header">Documents By Stage</div>
        </el-col>
      </el-row>

      <el-row type="flex" class="document-wise-count-wrapper-container" justify="center">
        <el-col :span="graphSpan" v-for="(chart, index) in charts" :key="index">
          <doughnut-chart
            :options="chart"
            class="document-wise-count-wrapper"
            :name="documentTypes[index]"
            @onClick="onClick"
          ></doughnut-chart>
        </el-col>
      </el-row>
  </div>
</template>

<script>
import DoughnutChart from "../charts/DoughnutChart.vue";
import IdpChartService from "@/services/IdpChartService";
import DashboardDrillDownService from "../../services/DashboardDrillDownService";
import IdpDashboardService from "../../services/IdpDashboardService";
import {capitalize} from "@/util/CommonUtil";
import _ from "lodash";
import Constants from "@/resources/Constants";
import {mapState} from 'vuex';

export default {
  name: "DocumentWiseCountWrapper",
  props: ["defaultQuery"],
  data() {
    return {
      graphSpan:6,
      options: {
        title: {
          text: "Invoices\n0",
          left: "center",
          top: "center",
          show: true,
          textStyle: {
            color: "#718096",
            fontSize: 10,            
            fontWeight: 800
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["57%", "85%"],
            center: ["50%", "50%"],
            label: {
              normal: {
                formatter: "{c|{c}}",
                position: "inside",
                rich: {
                  c: {
                    fontSize: 9,
                    color: "white",
                    lineHeight: 3,
                  },
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
            ],
          },
        ],
      },
      documentTypes: ["invoice", "po", "quote"],
      charts: [],
      documentType:"",
    };
  },
  computed: {
     ...mapState("dashboardStore", {
            dashBoardFilters : state => state.dashBoardFilters
      })
  },
  beforeMount() {
    this.getChartData();
    this.initGraphSpan();
  },
  components: { DoughnutChart },
  methods: {
    async getConfiguredDocTypes(){
      const documentTypes = await IdpDashboardService.getDocTypes();
      if(!documentTypes.length){
        documentTypes = _.map(window.kan_customer_configurations || [],'document_type');
      }
      return documentTypes;
    },
    async initGraphSpan(){
      const colSizeMap = {
        '1':18,
        '2':9,
        '3':6
      };
      const configuredDocTypes = await this.getConfiguredDocTypes();
      this.graphSpan = colSizeMap[configuredDocTypes.length +''] || 6 ;
    },
    onClick(selectedData, name) {
      const pushParams = DashboardDrillDownService.getNavigationRoute(
        selectedData,
        "document_count_by_stages",
        name
      );
      console.log("DashboardDrillDownService.getNavigationRoute", pushParams);
      this.$router && this.$router.push(pushParams);
    },

    async getChartData() {
      let chartResult = await IdpChartService.getChartData({
        chart_name: "DocumentWiseCountWrapper",
        query: _.cloneDeep(this.defaultQuery) || {},
      });
      
      if(this.defaultQuery['document_type']){
        this.processGraphOptions(_.filter(chartResult, { document_type: this.defaultQuery['document_type'] }),this.defaultQuery['document_type']);
        return;
      }

      // set customer doc types
      let documentTypes = this.getConfiguredDocTypes();
      let sortedDocTypes = [];
      _.map(this.documentTypes,(doc)=>{
          if(documentTypes.includes(doc))sortedDocTypes.push(doc);
      });
      this.documentTypes = sortedDocTypes;
      if (chartResult.length) {
        this.updateChartByDocumentType(chartResult);
        return
      } 
      //else {
      //converted foreach to for loop & removed else block
      for (let docType of this.documentTypes ){
          this.processGraphOptions(
          _.filter([], { document_type: docType }),
          docType
        );
      }
      this.$store.commit('dashboardStore/setdashboardComponentStatus','DocumentWiseCountWrapper');
      return;
    },

    updateChartByDocumentType(graphData) {
        //converted foreach to for loop
        for(let docType of this.documentTypes){
            this.processGraphOptions(
            _.filter(graphData, { document_type: docType }),
            docType
          );
        }
    },

    processGraphOptions(chartResult, docType) {
      const groupedByStages = _.groupBy(chartResult, "stage");
      let seriesData = [];
      // Constant values
      const dashboardColorMap = Constants.DOCEX.IDP_DASHBOARD.STAGE_COLOR_MAP;
      const stageLabelMap =  Constants.DOCEX.IDP_DASHBOARD.STAGE_LABEL_MAP;
      const ALL_STAGE = this.getStagesByDocumentType(docType)
      ALL_STAGE.map(stageLabel =>{
          let stage = stageLabel;
            // Change value to actual stage name stored in DB
          if(stageLabelMap[stage]){stage = stageLabelMap[stage]};   
          // If stage not configured return
          if(!ALL_STAGE.includes(stageLabel))return;
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
    
      let chartData = _.cloneDeep(this.options);
      chartData.title.text = this.getGraphTitle(
        chartResult,
        docType
      );
      chartData.series[0].data = seriesData;
      this.charts.push(chartData);
    },

    getStagesByDocumentType(document_type){
      const user = this.$store.getters.user;
      //get selected stage tabs for customer based on current document type
      const userStageConfiguration = user.selected_stage_tabs ? _.find(user.selected_stage_tabs, {document_type}) : {};
      const selectedStageTabs = _.get(userStageConfiguration, "stage_tabs", []);
      //if no selected stage tabs, show all the stage tabs
      return selectedStageTabs.length ? selectedStageTabs : Constants.DOCEX.DASHBOARD_WIDGET_STAGES;
    },

    getDocumentCount(groupedByStages, stage) {
      let value = 0;
      value = groupedByStages[stage].reduce(function (prev, cur) {
        return prev + cur.documents;
      }, 0);
      return value;
    },

    getGraphTitle(chartData, docType) {
      let totalDocuments = 0;
      for (let doc of chartData){
        totalDocuments += doc.documents;
      }
      return capitalize(`${docType}\n${totalDocuments}`);
    },
  },
};
</script>

<style lang="scss" >
.document-wise-count-wrapper-container {
  margin-top: 4.5rem;
  .el-col {
    padding-right: 10px;
  }
  .document-wise-count-wrapper {
    .echarts {
      height: 180px;
      width:100%;
    }
  }
}
.graph-toolbar-container{
  .title-container{
    .header{
     font-size:14px; 
    }
    
  }

}
</style>