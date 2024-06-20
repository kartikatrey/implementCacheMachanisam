<template>
<main class="error-code-by-vendor-container most-common-errors-by-vendor">
    <!-- Graph Header -->

    <div class="dashboard-analysis-header">
        <h2>{{ title }}</h2>
         <el-select v-model="selectedValues" multiple :multiple-limit="15" collapse-tags filterable placeholder="Select entity names" @change="handleValuesSelection" popper-class="dashboard-select">
                <el-option class="dashboard-select-options" v-for="item in entityValuesList" :key="item" :label="(item < 17) ? item :item.substr(0,17)" :value="item">
                    <span v-if="item.length < 17" class="vendor-selection-list-item" style="float: left">
                        {{ item }}
                    </span>

                    <el-popover open-delay="200" close-delay="0" popper-class="dropdown-popover" placement="left" v-else trigger="hover" :content="item">
                        <span class="vendor-selection-list-item" style="float: left" slot="reference"> {{ item }} </span>
                    </el-popover>
                </el-option>
            </el-select>
    </div>


    <el-row class="analytics-margin" v-for="(row, index) in charts" :key="index" :gutter="12">
        <el-col v-for="(item, index1) in row" :key="index+index1" :span="8" >
            <div class="dashboard-cards">
                <doughnut-chart @onClick="(params)=>onClick(params)" :options="item" :name="item.name"></doughnut-chart>
            </div>
        </el-col>
    </el-row>
</main>
</template>

<script>
import DoughnutChart from "../DoughnutChart.vue";
import IdpChartService from "@/services/IdpChartService";
import DashboardDrillDownService from "../../../services/DashboardDrillDownService";
import Constants from "@/resources/Constants";
import _ from 'lodash';

export default {
    name: "VendorWiseErrorCodeWrapper",
    props: {
        "defaultQuery": {
            type: Object,
            default: null
        },
        "chartName": {
            type: String
        },
        "title": {
            type: String,
            default: "",
        }
    },
    data() {
        return {
            selectedValues: this.entityValuesList,
            charts: [],
            docTypeEntityMapping: {
                "invoice" : "vendor_name",
                "po": "customer_name"
            }
        };
    },
    computed: {
        entityValuesList:{
            get() {
                return this.$store.state.dashboardStore.error_analytics.entityValuesList;
            }
        },
    },
    watch: {
        defaultQuery: {
            handler: function (newVal, oldval) {
                if (newVal == null) return;
                this.setChartData();
            },
            deep: true,
            immediate: true
        }
    },
    components: {
        DoughnutChart
    },
    methods: {
        onClick(selectedData) {
            const pushParams = DashboardDrillDownService.getNavigationRoute(
                selectedData,
                "error_analytics"
            );
            const documentType = this.defaultQuery["document_type"];
            const entityKey= this.docTypeEntityMapping[documentType] || "vendor_name";
            pushParams.query.filter = JSON.parse(_.get(pushParams,"query.filter",{}))
            pushParams.query.filter.code = _.get(selectedData,"data.id");
            pushParams.query.filter[entityKey] = [selectedData.data.vendor_name];
            pushParams.query.filter = JSON.stringify(pushParams.query.filter)
            this.$router && this.$router.push(pushParams);
        },
        async setChartData() {
            const documentType = this.defaultQuery["document_type"];
            const entityKey= this.docTypeEntityMapping[documentType] || "vendor_name";
            let apiQuery = {
                chart_name: this.chartName,
                query: _.cloneDeep(this.defaultQuery) || {},
            };
            if (this.selectedValues.length) {
                apiQuery["query"][entityKey] = {
                    $in: this.selectedValues
                };
            }
            let response = this.selectedValues.length? await IdpChartService.getAnalyticsChartData(apiQuery): [];
            this.charts = response;
            DashboardDrillDownService.setVendorWiseErrorCodeWrapperColor(this.chartOptions);
            this.reRenderCharts = false
            this.$nextTick(() => {
                this.reRenderCharts = true
            })
        },
        handleValuesSelection(selected) {
            this.$nextTick(() => {
                this.setChartData();
            })
        },
    }
};
</script>

<style lang="scss">
@import "../../../_idpGlobal";

.error-code-by-vendor-container {
    .echarts {
        height: 250px;
    }
}
.error-code-by-vendor-container.most-common-errors-by-vendor {
    .dashboard-analysis-header {
        margin-top: 2rem;
    }
}


.error-code-by-vendor-container {
    .vendor-dougnnut {
        .echarts {
            height: 100px !important;
            width: 175px !important;
        }
    }

    .graph-toolbar-container {
        margin-bottom: 4.2rem;

        .title-container {
            width: 100%;
            margin: auto;
        }



        .filter-toolbar {

            .el-input__inner {
                border: 0px solid var(--dark-07);
                height: 21px;
            }

            input {
                border: 0px;
                font-size: var(--font-base);
                text-align: left;
                color: var(--dark-04);
                font-weight: 400;

                &::placeholder {
                    color: var(--dark-04);
                }
            }

            .el-select__caret {
                color: var(--dark-01);
            }

            .el-input--suffix .el-input__inner {
                padding-right: 23px;
            }
        }
    }
}

.dashboard-select {
    z-index: 9 !important;

    .vendor-selection-list-item {
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 14rem;
    }
}
</style>
