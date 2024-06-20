<template>
    <div class="invoice-processed-wrapper-container dashboard-cards">
      <!-- Graph Header -->
        <el-row type="flex" justify="space-between" class="graph-toolbar-container">
            <el-col :span="16" class="title-container">
                <div class="header">Invoices In Progress</div>
            </el-col>    
        </el-row>
        <stack-bar-chart class="invoice-processed-chart" :name="'invoice-processed-chart'" :options="option" @onClick="onClick"></stack-bar-chart>
    </div>
</template>
  
<script>
import StackBarChart from "../charts/StackBarChart.vue";
import IdpChartService from "@/services/IdpChartService";
import DashboardDrillDownService from "../../services/DashboardDrillDownService";
import _ from "lodash";
import moment from 'moment-timezone';
import Constants from "@/resources/Constants";

export default {
    name: "InvoiceInProgressWrapper",
    props: ["defaultQuery"],
    data(){
        return{
            option: {
                grid: {
                    containLabel: true,
                    left: '8%',
                    right: '8%',
                    bottom: '0%',
                    top: '12%',
                },
                tooltip: {
                    formatter: (params) => {
                        if (params.componentType === "legend") {
                        return params.name;
                        }
                        let res = params;
                        if(params.seriesName == "Extracted") { params.seriesName = "In Progess Invoices"}
                        res =
                            params.name +
                            " <br/>" +
                            params.seriesName +
                            " : " +
                            params.value;
                        return res;
                    },
                    textStyle: {
                        color: "#718096",
                    },
                },
                xAxis: {
                    type: "value",
                    name: "Y-Axis",
                    nameLocation: "middle",
                    nameGap: "50",
                },
                yAxis: {
                    type: "category",
                    data: [],
                },
                dataZoom: [
                    {
                        type: "inside",
                    },
                ],
                legend: {
                    data: ["Extracted"],
                    top: 'auto',
                    type: 'scroll',
                    padding: [10, 40],
                    itemWidth: 14,
                    itemHeight: 12,
                    itemGap: 15,
                    textStyle: {
                        "color": "#4A5468",
                        "fontSize": "10px",
                        "margin": "10px"
                    }
                },
                series: [
                    {
                        value: 0,
                        name: "Extracted",
                        type: "bar",
                        stack: "stack",
                        data:[],
                        itemStyle: {
                            color: "#0186FC",
                        },
                    }
                ],
            },
            documentType: null
        };
    },
    components: { StackBarChart },
    methods: {
        onClick(selectedData, name) {
            const pushParams = DashboardDrillDownService.getNavigationRoute(
                selectedData,
                "invoice_in_progress_per_employee",
                null, 
            );
            this.$router && this.$router.push(pushParams);
        },
        async setChartData() {
            let chartResult = await IdpChartService.getChartData({
                chart_name: "InvoiceInProgressWrapper",
                query: this.defaultQuery || {},
            });
            this.setYAxisValues(chartResult);
            //  set X-axis value
             for (let item of chartResult){
                this.option.series[0].data.push({name:item.assignedUser, value: item.total})
            }
            DashboardDrillDownService.setWrapperColor(this.option);
            this.$store.commit('dashboardStore/setdashboardComponentStatus','InvoiceInProgressWrapper');
        },
        async setYAxisValues(chartResult) {
            let values = _.uniq(_.map(chartResult, 'assignedUser'));
            // remove null value
            values = values.map((value) => {
                if(value){
                    return value.length >=20 ? value.substring(0, 20)+"..." : value
                }
            });
            this.option.yAxis.data = values;
        },
    },
    beforeMount() {
        this.documentType = this.defaultQuery.document_type;
        this.setChartData();
    },
   
}
</script>
  
<style lang="scss">
@import "../../_idpGlobal";
    .invoice-processed-wrapper-container {
        .charts-contrainer .echarts {
            height: 20rem;
            width:auto;
            // transform: scale(.88);
        }
    }
</style>