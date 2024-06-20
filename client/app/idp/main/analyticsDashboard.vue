<template>
<main class="idp-dashboard error-analytics operations-dashboard">
    <div class="dashboard-container">
        <div class="dahboard-header">
            <DashboardHeader :title="title" :showWidgetDrpodown="false"/>
        </div>
        <div class="dashboard-body">
            <div class="VendorWiseErrorWrapper">
                <VendorWiseErrorTypeWrapper :defaultQuery="query" />
            </div>
            <div>
                <FieldsByErrorType :defaultQuery="query" />
            </div>

            <div class="inner-dashboard-wrapper">
                    <el-row class="chart-row" :gutter="12">
                        <el-col :span="8">
                            <div class="dashboard-cards">
                               <BarChart title="Top Error Vendors" :defaultQuery="query" :enableSort="true" chartName="topErrorByVendor" />
                            </div>

                        </el-col>
                        <div class="error-cards">
                            <el-col :span="8">
                                <div class="dashboard-cards">
                                    <BarChart title="Error Types" :defaultQuery="query" :enableSort="false" chartName="errorsByType" @chart-click="handleChartClick" />
                                </div>
    
                            </el-col>
                            <el-col :span="8">
                                <div class="dashboard-cards">
                                    <BarChart title="Average Error Rate" :defaultQuery="query" :enableSort="false" chartName="errorsByTime" />
                                </div>
                            </el-col>
                        </div>
                    </el-row>

                    <el-row :gutter="12" class="chart-row">
                        <el-col :span="24">
                            <VendorWiseErrorCodeWrapper title="Most Common Errors by Vendor" :defaultQuery="query" chartName="commonErrorByVendor" />
                        </el-col>

                    </el-row>
            </div>

        </div>
    </div>
</main>
</template>

<script>
import VendorWiseErrorTypeWrapper from "./charts/analytics/VendorWiseErrorTypeWrapper.vue";
import VendorWiseErrorCodeWrapper from "./charts/analytics/VendorWiseErrorCodeWrapper.vue";
import BarChart from "./charts/analytics/BarChart.vue";
import DougnutChart from "./charts/analytics/DoughnutChart.vue";
import FieldsByErrorType from "./charts/analytics/FieldsByErrorTypeWrapper.vue";
import IdpChartService from "@/services/IdpChartService";
import DashboardHeader from "@/idp/main/components/DashboardHeader.vue";
import IdpDashboardService from "@/idp/services/IdpDashboardService";

export default {
    name: "IdpDashboard",
    data() {
        return {
            title:"Error Analytics Dashboard",
            query: null,
        };
    },
    methods: {
        initFilter() {
            let dashboardFilters = IdpDashboardService.getCurrentDashboardFilters();
            this.documentType = dashboardFilters.document_type;
            if(this.documentType =="summary"){ dashboardFilters = _.omit(dashboardFilters, ["document_type"]); } // remove doctype - summary
            this.query = {...dashboardFilters};
        },

        init() {
            this.initFilter();
            IdpDashboardService.hideLeftBar();
        },

        async getEntityValuesList(){
            const entityValuesList = await IdpChartService.getAnalyticsChartData({
                chart_name: "vendorList",
                "query": {document_type: this.documentType}
            });
            this.$store.commit('dashboardStore/setErrorEntityValuesList',entityValuesList);
        }
    },
    components: {
        VendorWiseErrorTypeWrapper,
        DashboardHeader,
        BarChart,
        DougnutChart,
        VendorWiseErrorCodeWrapper,
        FieldsByErrorType
    },
    created() {},
    mounted() {},
    beforeDestroy() {},
    async beforeMount() {
        this.$store.commit('dashboardStore/setCurrentDashboard', "error_analytics");
        this.init();
        this.getEntityValuesList();
    }
};
</script>

<style lang="scss">
@import "../_idpGlobal";

.extraction-metrics {
    margin: var(--space-base) 0;
}
.inner-dashboard-wrapper .chart-row {
    .echarts {
        width: 100%;
        height: 27rem;
	}
}
// KP Main
.idp-dashboard {
    height: calc(100% - 2.7rem);
    width: 100%;
    margin-top: 2.7rem;

    overflow: auto;
    box-sizing: border-box;

    .header-underline {
        color: red;
    }

    .total-doc-count-wrapper-component {
        margin-top: -2rem;
        margin-bottom: -3rem;
    }

    .processing-time-document-by-vendor {
        margin-bottom: 1.5rem;
    }
}

.error-analytics{
	.echarts {
	//   width: 100% !important;
	  // height: 26rem;
	}
    .dashboard-body {
        padding: 0 var(--space-xl);
    }
    .header {
      font-size:14px;
      text-align: center;
    }
  }

  .error-cards{
    .charts-contrainer{
        padding-top: 10px;
    }
  }
</style>
