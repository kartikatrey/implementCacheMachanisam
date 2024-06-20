<template>
<div class="top-error-fields-wrap">
    <div class="header">{{ title }}</div>
    <doughnut-chart :options="chartOptions" @onClick="onClick"></doughnut-chart>
</div>
</template>

<script>
import DoughnutChart from "../DoughnutChart.vue";
import _ from "lodash";
import Constants from "@/resources/Constants";
import IdpChartService from "@/services/IdpChartService";
export default {
    name: "HorizontalBarChart",
    props: {
        "chartName": {
            type: String,
            default: ""
        },
         "title": {
            type: String,
            default: ""
        },
        "defaultQuery": {
            type: Object,
            default: () => ({})
        }
    },
    watch: {
        defaultQuery: {
            handler: function (newVal, oldval) {
                if (!newVal) return;
                this.setChartData();
            },
            deep: true
        }
    },
    data() {
        return {
            chartOptions: {},
            reRenderCharts: true
        };
    },
    components: {
        DoughnutChart
    },
    methods: {
        async setChartData() {
            let apiQuery = {
                chart_name: this.chartName,
                query: _.cloneDeep(this.defaultQuery) || {}
            };
            let response = await IdpChartService.getAnalyticsChartData(apiQuery);
            this.chartOptions = response;
            const kanvTheme = this.$store.getters.selectedTheme;
                if(kanvTheme === Constants.DOCEX.THEMES.DARK){
                    this.chartOptions.tooltip.backgroundColor = "#242729";
                    this.chartOptions.tooltip.textStyle.color = "#bebebe";
                    this.chartOptions.title.textStyle.color = "#bebebe";
                }
            this.$nextTick(() => {
                this.reRenderCharts = true
            })
        }
    },
    beforeMount() {
        this.setChartData();
    },
};
</script>

<style lang="scss">


.top-error-fields-wrap {
 

        .header {
            text-align: center;   
            margin-bottom: 2rem;
        }

}
</style>
