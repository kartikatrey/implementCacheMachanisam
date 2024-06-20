<template>
<div >
    <!-- <stacked-line-chart class="charts-contrainer" :options="chartOptions" /> -->

  <el-row type="flex" justify="center" class="charts-contrainer-container">
        <el-col :span="20" class="title-container">
          <div class="header">Documents By Volume (Line)</div>
        </el-col>
      </el-row>

      <el-row type="flex" class="charts-contrainer-container stacked-line-chart" justify="center">
        <el-col>
           <stacked-line-chart class="charts-contrainer" :options="chartOptions" />
        </el-col>
      </el-row>

</div>
</template>

<script>
import StackedLineChart from "../charts/StackedLineChart.vue";
import Constants from "@/resources/Constants";
import IdpChartService from "@/services/IdpChartService";
import IdpDashboardService from "../../services/IdpDashboardService";
import DashboardDrillDownService from "../../services/DashboardDrillDownService";
import moment from 'moment-timezone';
import _ from "lodash";
export default {
    name: "StackedLineChartWrapper",
    props: ["defaultQuery"],
    components: {
        StackedLineChart
    },
    data() {
        return {
             chartOptions: {
        title: {
          text: "DOCUMENTS BY VOLUME (Line)",
          left: 'center',
          show: false,
          x: "10",
          y: "0",
          textStyle: {
            fontSize: "12",
            fontWeight: "normal",
            fontStyle: "normal",
            color: "#2D3748",
            fontFamily: "Segoe UI",
          },
        },
        tooltip: {
          trigger: "axis",
          textStyle: {
            color: "#718096",
          },
        },
        legend: {
          // x: "90", // 'center' | 'left' | {number},
          // y: "30", // 'center' | 'bottom' | {number}
          data: [],
          // textStyle: {
          //   fontSize: "9",
          //   fontWeight: "normal",
          //   fontStyle: "normal",
          //   fontFamily: "Segoe UI",
          // },
        },

        calculable: true,
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: [],
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        color: ["#0186FC", "#FB9902", "#D0EA2B", "#66B032"],
      }
        };
    },
    methods: {
    async setDocumentTypes(result){
      let documentTypesFromData = await IdpDashboardService.getDocTypes();
      if(!documentTypesFromData.length){
        documentTypesFromData = _.uniq(_.map(result,'_id.document_type'));
      }else{
        documentTypesFromData.push(Constants.DOCEX.DOCUMENT_TYPES.OTHER)
      }

      const docTypeLabelMap =  Constants.DOCEX.IDP_DASHBOARD.DOC_TYPE_LABEL_MAP;
      const allDocTypeList = Constants.DOCEX.DOCUMENT_TYPE_LIST;
      const configuredDocTypes = allDocTypeList.filter(documentType=>documentTypesFromData.includes(documentType.value))
      configuredDocTypes.map(docType=>{
        // Change the label from constant 
          if(docTypeLabelMap[docType.value.toLowerCase()]){
            docType.label = docTypeLabelMap[docType.value.toLowerCase()];
          };
          // Make it upper case
          docType.label = docType.label; 
          return docType
        });
      this.chartOptions.legend.data = configuredDocTypes.map(docType=>docType.label);
      this.documentTypes = configuredDocTypes;
    },
       async setChartData() {
            try {
            let dashboardColorMap;
            const kanvTheme=this.$store.getters.selectedTheme;
            kanvTheme == Constants.DOCEX.THEMES.DARK ? dashboardColorMap = Constants.DOCEX.IDP_DASHBOARD.DOC_TYPE_COLOR_MAP_DARK : dashboardColorMap = Constants.DOCEX.IDP_DASHBOARD.DOC_TYPE_COLOR_MAP;
             let result =  await IdpChartService.getChartData({
                        chart_name: "StackedLineChartWrapper",
                        query: _.cloneDeep(this.defaultQuery) || {},
                        time_zone:moment.tz.guess()
                    });
                    await this.setDocumentTypes(result);
                     let queryResult = _.map(result, (row) => _.merge({}, row, row._id))
                        let types = this.documentTypes;
                     queryResult = _.sortBy(queryResult,"date")
                        let dates = _.uniq(_.map(queryResult, "date"))
                        this.chartOptions.xAxis[0]["data"]=dates
                        DashboardDrillDownService.setStackedLineChartWrapperColor(this.chartOptions);
                        let modifiedResult = []
                        _.map(dates, (date) => {
                            let filteredByDate = _.filter(queryResult, {
                                "date": date
                            })
                            let countByType = {}
                            _.map(types, (doc_type, key) => {
                                let filterByType = _.find(filteredByDate, {
                                    "document_type": doc_type.value
                                })
                                countByType[doc_type.value] = filterByType ? filterByType.count : 0
                            })
                            modifiedResult.push(countByType)
                        });
                        let chartData = []

                        _.map(types, (doc_type, key) => {
                            // Color map
                            const color = dashboardColorMap[doc_type.value.toLowerCase()];
                            chartData.push({
                                name: doc_type.label,
                                type: "line",
                                stack: "stack",
                                areaStyle: {},
                                itemStyle: {color},
                                data: _.map(modifiedResult, doc_type.value)
                            })
                        })
                        this.chartOptions["series"] = chartData
            } catch (e) {
                console.log(e)
            }

          
        }
    },
    mounted() {

    },
    async beforeMount() {       
        await this.setChartData()
    }

};
</script>

<style lang="scss" >

.stacked-line-chart{
      padding-top:10px
    }

.charts-contrainer-container {
  .title-container {
    .header {
      text-align: center;
      font-size:14px;
    }
  }
}
</style>
