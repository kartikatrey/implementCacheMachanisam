<template>
    <div>
      <doughnut-chart
        class="documents-processed-by-system-card"
        :options="options"
        :name="documents-processed-by-system"
      ></doughnut-chart>
    </div>
  </template>
  
  <script>
  import DoughnutChart from "../../charts/DoughnutChart.vue";
  import IdpDashboardService from "@/idp/services/IdpDashboardService";
  import Constants from "@/resources/Constants";
  import DashboardDrillDownService from "../../../services/DashboardDrillDownService";
  import _ from "lodash";
  
  export default {
    name: "DocumentsProcessedBySystemCard",
    props: {
        "defaultQuery":{
            type: Object,
            default:()=> ({})
        },
        //Duration props for admin dashboard filter
        "durationFilter":{
            type: String,
            default: () => ('2'),
        },
    },
    data() {
      return {
        options: {
          label: {
            position: "center",
          },
          title: {
            text: "",
            left: "center",
            top: "center",
            show: true,
            textStyle: {
                color: "#718096",
                fontSize: 10,
                fontWeight: 800
            },
          },
          grid: {
            left: '8%',
            right: '8%',
            bottom: '0%',
            top: '12%',
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)",
            textStyle: {
                color: "#718096",
            },
          },
          series: [
            {
              selectedMode: "single",
              name: "",
              type: "pie",
              radius: ["42%", "62%"],
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
              data: [],
            },
          ],
        },
      };
    },
    components: { DoughnutChart },
    methods: {
        async getChartData() {
            let chartData = [];
            const chartResults = await IdpDashboardService.getCardData({
              chart_name: "DocumentsProcessedBySystemCard",
              query: _.cloneDeep(this.defaultQuery) || {},
              durationFilter: this.durationFilter
            });

            //Color map for dark theme
            const kanvTheme = this.$store.getters.selectedTheme;
            const docProcessedSystemColorMap = Constants.DOCEX.IDP_DASHBOARD[`DOC_SYSTEM_COLOR_MAP__${kanvTheme}`];

            if (!chartResults || !chartResults.status || !chartResults.result) {
              chartData = [{ value: 0, name: "No data found" }];
              this.options.title.text = `Total\n0`;
              this.options.series[0].data = chartData;
              return;
            }

            const chartResult = chartResults.result;

            const totalCount = chartResult.totalCount || 0;
            this.options.title.text = `Total \n${totalCount.toString()}`;

            ['cusPubDoc', 'kanDocCount'].forEach(key => { 
              const value = chartResult[key] || 0; 
              const label = key; 
              const name = key == 'cusPubDoc' ? 'ERP' : 'Kanverse'; 
              const color = docProcessedSystemColorMap[name] || ''; 
              chartData.push({ value, label, name, itemStyle: { color } });
            });

            this.options.series[0].data = chartData;
            DashboardDrillDownService.setDocumentsProcessedBySystemColor(this.options);
            this.$store.commit('dashboardStore/setdashboardComponentStatus', 'DocumentsProcessedBySystemCard');
        }
    },
    beforeMount() {
      this.getChartData();
    },
  };
  </script>
  
  <style lang="scss" >
  .documents-processed-by-system-card {
    .echarts {
      height: 260px;
      width: 108% !important;
    }
  }
  </style>