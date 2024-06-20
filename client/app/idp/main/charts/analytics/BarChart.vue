

<template>
<div class="graph-toolbar-container ">
    <el-row v-if="enableSort" type="flex" justify="space-between">
        <!-- <el-col :span="3"></el-col> -->
        <el-col :span="9">
            <a class="active-header-link" @click="onClick({widgetHeaderDrilldown: true})">{{title}}</a>
         </el-col>
        <el-col :span="15" class="filter-toolbar">
            <el-select v-model="sortValue" @change="onSortChange" placeholder="Select">
                <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </el-col>
    </el-row>
    <a v-if="!enableSort" class="active-header-link" @click="onClick({widgetHeaderDrilldown: true})">{{title}}</a>
    <stack-bar-chart @onClick="(params)=>onClick(params)" v-if="reRenderCharts" :options="chartOptions"></stack-bar-chart>
</div>
</template>

<script>
import StackBarChart from "../StackBarChart.vue";
import _ from "lodash";
import IdpChartService from "@/services/IdpChartService";
import moment from 'moment-timezone'
import DashboardDrillDownService from "../../../services/DashboardDrillDownService";


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
        "enableSort": {
            type: Boolean,
            default: false
        },
        "defaultQuery": {
            type: Object,
            default: null
        }
    },
    watch: {
        defaultQuery: {
            handler: function (newVal, oldval) {
                 if(newVal == null)return;
                this.setChartData();
            },
            deep: true,
            immediate:true
        }
    },
    data() {
        return {
            chartOptions: {
                grid: {
                        left: '10%',
                        right: '10%',
                        bottom: '10%',
                        top: '10%',
                    }
            },
            sortValue: 1,
            selectOptions: [{
                    value: 1,
                    label: "Sort ascending",
                },
                {
                    value: -1,
                    label: "Sort descending",
                },
            ],
            reRenderCharts: true,
            docTypeEntityMapping: {
                "invoice" : "vendor_name",
                "po": "customer_name"
            },

        };
    },
    components: {
        StackBarChart
    },
    methods: {
        /**
         * Purpose: Performs actions when bar-chart or header is clicked
         * @param {Object} selectedData - Contains selected data in case of bar-chart or widgetHeaderDrilldown key in case of header
         * @param {*} errorType
         */
          onClick(selectedData, errorType) {
            // Check if action is performed on header or not
            const isWidgetHeaderDrilldown = _.get(selectedData, "widgetHeaderDrilldown", false);

            console.log(selectedData + name);
            const pushParams = DashboardDrillDownService.getNavigationRoute(
                selectedData,
                "error_analytics"
            );
            pushParams.query.filter = JSON.parse(pushParams.query.filter)
            if(this.chartName =='topErrorByVendor') {
                const documentType = this.defaultQuery["document_type"];
                const entityKey= this.docTypeEntityMapping[documentType];
                pushParams.query.filter[entityKey] = [_.get(selectedData, "data.name")];

                // If action is performed on header, then prepare selected data from chart-data
                if(isWidgetHeaderDrilldown){
                    const entityData = _.get(this.chartOptions, "series[0].data")
                    selectedData = entityData.map(obj => obj.name);
                    pushParams.query.filter[entityKey] = selectedData ;
                }
            }
            if(this.chartName =='errorsByType'){
                pushParams.query.filter.type = _.get(selectedData,"data.id")
            }
            pushParams.query.filter = JSON.stringify(pushParams.query.filter)
            this.$router && this.$router.push(pushParams);
        },
        onSortChange(order) {
            this.setChartData();
        },
        async setChartData() {
            let apiQuery = {
                chart_name: this.chartName,
                query: _.cloneDeep(this.defaultQuery) || {},
                sort_order: this.sortValue,
                time_zone:moment.tz.guess()
            };
            let response = await IdpChartService.getAnalyticsChartData(apiQuery);
            this.chartOptions = response;
            DashboardDrillDownService.setErrorColor(this.chartOptions);
            // this.reRenderCharts = false
            // this.$nextTick(() => {
            //     this.reRenderCharts = true
            // })
        }
    }
};
</script>

<style lang="scss">
@import "../../../_idpGlobal";

</style>