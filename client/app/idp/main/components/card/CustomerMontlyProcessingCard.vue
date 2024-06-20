<template>
    <div>
        <stacked-line-chart class="charts-contrainer" :options="chartOptions" />
    </div>
</template>
  
<script>
import _ from "lodash";
import IdpDashboardService from "@/idp/services/IdpDashboardService";
import StackedLineChart from "../../charts/StackedLineChart.vue";
import DashboardDrillDownService from "../../../services/DashboardDrillDownService";

export default {
    name: "CustomerMontlyProcessingCard",
    components: { StackedLineChart },
    data() {
        return {
            chartOptions : {},
            options: {
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        return params[0].name + ': ' + params[0].data;
                    },
                },
                xAxis: {},
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}',
                    },
                },
                series: [],
            }
        };
    },
    methods: {
        async getChartData(customerId) {
            const chartResult = await IdpDashboardService.getCardData({
                chart_name: "CustomerMonthlyProcessingCard",
                customer_id: customerId
            });
            if (_.get(chartResult, "status")) {
                this.options["series"] = chartResult.result.cardData;
                this.options["xAxis"] = chartResult.result.xAxisData;
            }
            this.chartOptions = this.options;
            DashboardDrillDownService.setCustomerThresholdCardColor(this.chartOptions);
        }
    }
};
</script>
  
<style lang="scss">
</style>
  