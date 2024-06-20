<template>
<div class="dashboard-cards">
    <el-row type="flex"  class="graph-toolbar-container">
        <el-col :span="20" class="title-container">
            <div class="header">Published Count</div>
        </el-col>
    </el-row>
    <el-row type="flex" class="auto-published-count-wrapper">
        <el-col :span="12" v-for="(chart, index) in charts" :key="index">
            <doughnut-chart :options="chart" @onClick="onClick" :name="chart.name"></doughnut-chart>
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
    name: "PublishedCountWrapper",
    props: ["defaultQuery"],
    data() {
        return {
           
            charts: [],
            reload:false,
            options: {
                name:"",
                label: {
                    position: "center",
                },
                title: {
                    text: "Published Count",
                    left: "center",
                    top: "center",
                    show: true,
                    textStyle: {
                        color: "#718096",
                        fontSize: 11,
                        fontWeight: 800
                    },
                },
                
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b} : {c} ({d}%)",
                    textStyle: {
                        color: "#718096",
                    },
                },
                series: [{
                    selectedMode: "single",
                    name: "",
                    type: "pie",
                    radius: ["40%", "60%"],
                    label: {
                        formatter: "{b|{b}} {c|{c}}",
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
                "#FBBC04",
                "#0186FC",
                "#FB9902",
                "#D0EA2B",
                "#4285F4",
                "#66B032",
                "#EA4335",
            ],
        };
    },
    components: {
        DoughnutChart,
    },
    methods: {
        onClick(selectedData, childName) {
            //If drilldown is not allowed for widget then, return
            if(!DashboardDrillDownService.isDrillDownAllowedForWidget()){
                return;
            }
            const pushParams = DashboardDrillDownService.getNavigationRoute(selectedData, "publish_count", childName);
            pushParams.query.filter = JSON.parse(pushParams.query.filter)
            pushParams.query.filter.stage = constants.DOCEX.STAGE.PUBLISHED;
            pushParams.query.filter = JSON.stringify(pushParams.query.filter)
            this.$router && this.$router.push(pushParams);
        },
        setPublishedCountWrapperColor(){
            const kanvTheme=this.$store.getters.selectedTheme;
            if(kanvTheme == constants.DOCEX.THEMES.DARK){
                this.options.tooltip.backgroundColor = "#242729";
                this.options.tooltip.textStyle.color = "#bebebe";
                this.colors = ["#D29E04","#0672D2","#CC7C00","#A6BA26","#2968CF","#58982C","#CB2F22", ];
                this.options.title.textStyle.color = "#bebebe";
                const seriesItem = this.options.series[0].label.rich;
                seriesItem.b.color = "#bebebe";
                seriesItem.c.color = "#bebebe";
            }
        },
        async setChartData() {
            let chartResult;
            try {
                chartResult = await IdpChartService.getChartData({
                    chart_name: "PublishedCountWrapper",
                    query: _.cloneDeep(this.defaultQuery) || {},
                });

                _.each(chartResult, (seriesData, name) => {
                    let chartData = _.cloneDeep(this.options);
                    _.map(seriesData || [], (item, index) => {
                        item.itemStyle = {
                            color: this.colors[index],
                        };
                    });
                    let totalDocuments = seriesData.reduce((prev, next) => prev.value + next.value)
                    chartData.name = name.toLowerCase();
                    chartData.title.text = `${_.startCase(name)}\n${totalDocuments}`;
                    chartData.series[0].data = seriesData || [];
                    this.charts.push(chartData);
                })
                this.$store.commit('dashboardStore/setdashboardComponentStatus','PublishedCountWrapper');

            } catch (exception) {
                this.options.series[0].data = chartResult || [{
                    value: 0,
                    name: "No data found".toUpperCase()
                }, ];
                console.log(exception);
            }
        },
    },
    beforeMount() {
        this.setChartData();
        this.setPublishedCountWrapperColor();
    },
};
</script>

<style lang="scss">
@import "../../_idpGlobal";

.auto-published-count-wrapper {
        // margin-left: 6rem;
    .echarts {
        // height: 250px;
        // width: 400px;
        // color: #0186fc;
          height: 24rem;
          width: auto;
        // margin-top: var(--space-base);
        // width: 400px;


    }
}
</style>
