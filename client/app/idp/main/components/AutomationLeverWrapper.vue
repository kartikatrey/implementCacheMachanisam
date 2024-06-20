<template>
<div class="max-height-none dashboard-cards">
    <el-row type="flex"  class="graph-toolbar-container">
        <el-col :span="20" class="title-container">
            <div class="header">Automation Metrics</div>
        </el-col>
    </el-row>
    <el-row type="flex" class="ap-automation-wrapper">
        <el-col :span="20" v-for="(chart, index) in charts" :key="index" class="ap-automation-chart">
            <doughnut-chart :options="chart" :name="chart.name"></doughnut-chart>
            <div class="ap-automation-chart-text"  v-html="chart.name"></div>
        </el-col>
    </el-row>
</div>
</template>

<script>
import constants from "@/resources/Constants";
import DoughnutChart from "../charts/DoughnutChart.vue";
import IdpChartService from "@/services/IdpChartService";
import DashboardDrillDownService from "../../services/DashboardDrillDownService";
import _ from "lodash";

export default {
    name: "AutomationLeverWrapper",
    props: ["defaultQuery"],
    data() {
        return {
            
            charts: [],
            reload:false,
            options: {
                name:"",
                label: {
                    position: "bottom",
                },    
                title: {
                    text: "Published Count",
                    top: "center",
                    left:"center",
                    show: true,
                    textStyle: {
                        color: "#718096",
                        fontSize: 13,
                        fontWeight: 800
                    },
                },
                
                tooltip: {
                    trigger: "item",
                    position: 'right',
                    textStyle: {
                        color: "#718096",
                    },
                    formatter: function (params) {
                            let message = '';
                            if(params && params.data && params.data.tooltip_content){
                            Object.entries(params.data.tooltip_content).forEach(([key, value]) => {
                            message += `<br/>${ key} : ${value}`;
                        });
                    }else{
                        // in some widgets we dont need to show any lable so showing only percentage id name is not present
                        if(params.data.name){
                            message= `${params.data.name}:${params.value} % <br />`
                        }
                        else{
                            message= `${params.value} % <br />`
                        }
                        
                    }
            
                return message;
                }
                },
                series: [{
                    selectedMode: "single",
                    name: "",
                    type: "pie",
                    radius: ["40%", "55%"],
                    label: {
                        formatter: "{b|{b}} {c|{c}}",
                        show : false,
                        rich: {
                            b: {
                                fontSize: 12,
                                lineHeight: 33,
                                color: "#718096",
                            },
                            c: {
                                fontSize: 11,
                                lineHeight: 33,
                                fontWeight: 900,
                                color: "#4A5568",
                            },
                            pear: {
                                as: "{per|o} ",
                                fontWeight: 900,
                                fontSize: 11,
                                borderRadius: 1000,
                            },
                        },
                    },
                    data: [],
                }, ],
            },
            colors: [
                "#66B032",
                "#FE2712"
                
            ],
        };
    },
    components: {
        DoughnutChart,
    },
    methods: {
        // onClick(selectedData, childName) {
        //     childName = childName.replace("<br>"," ")
        //     const pushParams = DashboardDrillDownService.getNavigationRoute(selectedData, "automation_lever", childName);
        //     this.$router && this.$router.push(pushParams);
        // },
        /*
            setChartData functions Response structure:
            The function modifies the 'this.charts' array and 'this.options' object.
            The 'this.charts' array will contain chart data objects with the following structure:
            [
            {
                name: string,
                title: {
                text: string
                },
                series: [
                {
                    data: []
                }
                ]
            },
            ...
            ]

            The 'this.options' object has the following structure:
            {
            series: [
                {
                data: []
                }
            ]
            }
        */
        async setChartData() {
            let chartResult;
            try {
                // Get chart data from IdpChartService
                chartResult = await IdpChartService.getChartData({
                chart_name: "AutomationLeverWrapper",
                query: _.cloneDeep(this.defaultQuery) || {},
                });
                // Iterate through each series data in chartResult
                _.each(chartResult, (seriesData, name) => {
                let chartData = _.cloneDeep(this.options);
                // Assign color to each series item
                _.each(seriesData || [], (item, index) => {
                    if(item.percentage || item.percentage == 0){
                        item.itemStyle = {
                            color: this.colors[0],
                            };
                    }
                    else{
                        item.itemStyle = {
                        color: this.colors[1],
                        };
                    }
                    item.value = item.value && Number(item.value).toFixed(2)
                });
                // Find totalDocuments and calculate percentage if available
                let totalDocuments = seriesData.find(item => {
                    if (_.has(item, "percentage")) {
                    return item;
                    }
                });
                let percentage = totalDocuments && totalDocuments.percentage && `${Number(totalDocuments.percentage).toFixed(2)}%`;
                // Set chart data properties
                chartData.name = name;
                chartData.title.text = percentage;
                chartData.series[0].data = seriesData || [];

                // Push chartData to charts array
                this.charts.push(chartData);
                });
                const kanvTheme = this.$store.getters.selectedTheme;
                if(kanvTheme == constants.DOCEX.THEMES.DARK){
                    this.options.tooltip.backgroundColor = "#242729";
                    this.options.tooltip.textStyle.color = "#bebebe";
                    this.colors = ["#58982C", "#DB210F"];
                    this.options.title.textStyle.color = "#bebebe";

                    // Loop through the charts
                    if(!this.charts){
                        return;
                    }
                    for (const chart of this.charts) {
                        chart.title.textStyle.color = "#bebebe";
                        chart.tooltip.backgroundColor = "#242729";
                        chart.tooltip.textStyle.color = "#bebebe";
                        
                        chart.series[0].label.rich.b.color = "#bebebe";
                        chart.series[0].label.rich.c.color = "#bebebe";
                        for (let dataItemIndex = 0; dataItemIndex < 2; dataItemIndex++) {
                            if (chart.series && chart.series[0].data && chart.series[0].data[dataItemIndex] && chart.series[0].data[dataItemIndex].itemStyle) {
                                chart.series[0].data[dataItemIndex].itemStyle.color = this.colors[dataItemIndex];
                            }
                        }
                    }
                }
                this.$store.commit('dashboardStore/setdashboardComponentStatus','AutomationLeverWrapper');
            } catch (exception) {
                // Handle exception and set default data if chartResult is empty
                this.options.series[0].data = chartResult || [{
                value: 0,
                name: "No data found".toUpperCase(),
                }];
                console.log(exception);
            }
    }
    },
    beforeMount() {
        this.setChartData();
    }, 
};
</script>

<style lang="scss">
@import "../../_idpGlobal";

 .max-height-none {
	max-height: none !important;
 }

.ap-automation-wrapper {
        flex-wrap: wrap;
        padding-bottom: 4rem;
        .ap-automation-chart {
            width: 19.5%;
            .ap-automation-chart-text {
                font-weight: 700;
                text-align: center;
                margin-top: -45px;
            }
        }
        
    .echarts {
          height: 24rem;
          width: auto;
    }
}
</style>
