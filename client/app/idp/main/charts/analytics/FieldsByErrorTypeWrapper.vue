

<template>
<el-row :gutter="12">
    <el-col :span="8">

                <div class="dashboard-cards top-error-fields-wrap">
                    <el-row class="graph-toolbar-container">
                        <el-col :span="10" class="title-container">
                        <a class="active-header-link" @click="(params)=>onClick(params, 'ERROR')">Business Rules Error Fields</a>
                        </el-col>
                        <!-- <el-col :span="11" class="filter-toolbar"></el-col> -->
                    </el-row>
                    <doughnut-chart v-if="reRenderCharts" :options="brErrorChartOptions" @onClick="(params)=>onClick(params, 'ERROR')"></doughnut-chart>
                </div>
    </el-col>
    <el-col :span="8">


        <div class="dashboard-cards top-error-fields-wrap">
            <el-row class="graph-toolbar-container">
                <el-col :span="10" class="title-container">
                <a class="active-header-link" @click="(params)=>onClick(params, 'NOT_PREDICTED')">Not Extracted Error Fields</a>
                </el-col>
                <!-- <el-col :span="11" class="filter-toolbar"></el-col> -->
            </el-row>
            <doughnut-chart v-if="reRenderCharts" :options="notPredictedChartOptions" @onClick="(params)=>onClick(params, 'NOT_PREDICTED')"></doughnut-chart>
        </div>
    </el-col>
    <el-col :span="8">

        <div class="dashboard-cards top-error-fields-wrap">
            <el-row class="graph-toolbar-container">
                <el-col :span="10" class="title-container">
                <a class="active-header-link" @click="(params)=>onClick(params, 'WARNING')">Alert Fields</a>
                </el-col>
                <!-- <el-col :span="11" class="filter-toolbar"></el-col> -->
            </el-row>
            <doughnut-chart v-if="reRenderCharts" :options="alertChartOptions" @onClick="(params)=>onClick(params, 'WARNING')"></doughnut-chart>
        </div>
    </el-col>
</el-row>
</template>

<script>
import DoughnutChart from "../DoughnutChart.vue";
import _ from "lodash";
import Constants from "@/resources/Constants";
import IdpChartService from "@/services/IdpChartService";
import DashboardDrillDownService from "../../../services/DashboardDrillDownService";
export default {
    name: "FieldsByErrorType",
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
            reRenderCharts: true,
            brErrorChartOptions: {
                grid:{
                    left:'0%',
                    right:'0%',
                    bottom:'0%',
                    top: '20%',
                }
            },
            alertChartOptions: {},
            notPredictedChartOptions: {},
        };
    },
    components: {
        DoughnutChart
    },
    methods: {
        onClick(selectedData, errorType) {
            console.log(selectedData + name);
            const pushParams = DashboardDrillDownService.getNavigationRoute(
                selectedData,
                "error_analytics"
            );
            pushParams.query.filter = JSON.parse(pushParams.query.filter)
            pushParams.query.filter.field_name = _.get(selectedData,"data.id");
            pushParams.query.filter.type = errorType;
            pushParams.query.filter = JSON.stringify(pushParams.query.filter)
            this.$router && this.$router.push(pushParams);
        },
        async setChartData() {
            let apiQuery = {
                chart_name: "topErrorsByFields",
                query: _.cloneDeep(this.defaultQuery) || {}
            };
            const kanvTheme = this.$store.getters.selectedTheme;
            let response = await IdpChartService.getAnalyticsChartData(apiQuery);
            this.brErrorChartOptions = ((_.find(response, {
                'type': 'ERROR'
            })) || {}).options || {};
            this.notPredictedChartOptions = ((_.find(response, {
                'type': 'NOT_PREDICTED'
            })) || {}).options || {};
            this.alertChartOptions = ((_.find(response, {
                'type': 'WARNING'
            })) || {}).options || {};
            this.$nextTick(() => {
                this.reRenderCharts = true
            })
            DashboardDrillDownService.setFieldsByErrorTypeColor(this.brErrorChartOptions);
            DashboardDrillDownService.setFieldsByErrorTypeColor(this.notPredictedChartOptions);
            DashboardDrillDownService.setFieldsByErrorTypeColor(this.alertChartOptions);
        }
    },
    beforeMount() {
        this.setChartData();
    },
};
</script>

<style lang="scss">


.top-error-fields-wrap {
     .echarts{
        height:33rem;
        width: auto;
    }
    .header {
        text-align: center;
        margin-bottom: 2rem;
    }

}
</style>
