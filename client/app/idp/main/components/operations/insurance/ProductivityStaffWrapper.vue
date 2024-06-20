<template>
    <div class="productivity-wrapper-container dashboard-cards">
      <!-- Graph Header -->
        <el-row type="flex" justify="space-between" class="graph-toolbar-container">
            <el-col :span="16" class="title-container">
                <div class="header">Productivity Staff</div>
            </el-col>    
        </el-row>
        <stack-bar-chart class="productivity-chart" :name="'productivity-chart'" :options="option" @onClick="onClick"></stack-bar-chart>
    </div>
</template>
  
<script>
import StackBarChart from "../../../charts/StackBarChart.vue";
import IdpChartService from "@/services/IdpChartService";
import DashboardDrillDownService from "../../../../services/DashboardDrillDownService";
import _ from "lodash";
import moment from 'moment-timezone';
import Constants from "@/resources/Constants";

export default {
    name: "ProductivityStaffWrapper",
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
                        res =
                            params.name +
                            " <br/>" +
                            params.seriesName +
                            " : " +
                            params.value;
                        return res;
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
                    // data: ["Closed", "Published", "Errored", "Inbox", "Confirmed", "Deleted", "Pending approval", "Approved", "Rejected"],
                    data: _.keys(Constants.DOCEX.IDP_DASHBOARD.STAGE_COLOR_MAP),
                    top: 10,
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
                        name: "Closed",
                        type: "bar",
                        stack: "stack",
                        data:[],
                        itemStyle: {
                            color: "#0186FC",
                        },
                    },
                    {
                        value: 0,
                        name: "Errored",
                        type: "bar",
                        stack: "stack",
                        itemStyle: {
                            color: "#FE2712",
                        },
                        data:[],
                    },
                    {
                        value: 0,
                        name: "Inbox",
                        type: "bar",
                        stack: "stack",
                        itemStyle: {
                            color: "#0147FE",
                        },
                        data:[],
                    },
                    {
                        value: 0,
                        name: "Confirmed",
                        type: "bar",
                        stack: "stack",
                        itemStyle: {
                            color: "#16a085",
                        },
                        data:[],
                    },
                    {
                        value: 0,
                        name: "Deleted",
                        type: "bar",
                        stack: "stack",
                        itemStyle: {
                            color: "#EA4335",
                        },
                        data:[],
                    },
                    {
                        value: 0,
                        name: "Pending approval",
                        type: "bar",
                        stack: "stack",
                        itemStyle: {
                            olor: "#FB9902",
                        },
                        data:[],
                    },
                    {
                        value: 0,
                        name: "Approved",
                        type: "bar",
                        stack: "stack",
                        itemStyle: {
                            color: "#D0EA2B",
                        },
                        data:[],
                    },
                    {
                        value: 0,
                        name: "Rejected",
                        type: "bar",
                        stack: "stack",
                        itemStyle: {
                            color: "#e74c3c",
                        },
                        data:[],
                    },
                    {
                        value: 0,
                        name: "Published",
                        type: "bar",
                        stack: "stack",
                        itemStyle: {
                            color: "#66B032",
                        },
                        data:[],
                    },
                    {
                        value: 0,
                        name: "Uploaded",
                        type: "bar",
                        stack: "stack",
                        data:[],
                        itemStyle: {
                            color: "#0147FE",
                        },
                    },
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
                "productivity_staff",
                null,
            );
            console.log("DashboardDrillDownService.getNavigationRoute in ProductivityStaffWrapper", pushParams);
            this.$router && this.$router.push(pushParams);
        },
        async setChartData() {
            let chartResult = await IdpChartService.getChartData({
                chart_name: "ProductivityStaffWrapper",
                query: _.cloneDeep(this.defaultQuery) || {},
            });
            let values = _.uniq(_.map(chartResult, 'assignedTo'));
            values = values.map((value) => 
                value.length >=20 ? value.substring(0, 20)+"..." : value
            );
            this.option.yAxis.data = values;

            for (let [index,series] of this.option.series.entries()){
                _.map(chartResult, (item)=>{
                    if(this.option.series[index].name == item.stage){
                        this.option.series[index].data.push({name:item.assignedTo, value: item.total})
                    }
                });
            }
            this.$store.commit('dashboardStore/setdashboardComponentStatus','ProductivityStaffWrapper');
        },
    },
    beforeMount() {
        this.documentType = this.defaultQuery.document_type;
        this.setChartData();
    }
}
</script>
  
<style lang="scss">
@import "../../../../_idpGlobal";
    .productivity-wrapper-container {
        .charts-contrainer .echarts {
            height: 20rem;
            width:auto;
            // transform: scale(.88);
        }
    }
</style>
  