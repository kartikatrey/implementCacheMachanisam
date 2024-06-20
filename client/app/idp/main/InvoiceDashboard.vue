<template>
<main class="idp-dashboard operations-dashboard">
    <div class="dashboard-container">
        <div class="dahboard-header">
            <DashboardHeader :title="title" @updateWidgetGroups ="updateWidgetGroups" :widgetConfig ="widgetConfig" :permittedWidgets="permittedWidgets" :userPreferenceWidgets="userPreferenceWidgets"/>
        </div>
        <div class="dashboard-body" id="dashboard-body">
            <el-row class="chart-row" :gutter="12" v-for="widgetGroup in widgetGroups" :key="widgetGroup">
                <el-col v-for="widget in widgetGroup" :key="widget" :span="getColSize(widget)">
                    <component :is="widget" v-bind="getProps()" :widgetTitle="getWidgetTitle(widget)"></component>
                </el-col>
            </el-row>
        </div>
    </div>
</main>
</template>

<script>
import AverageTimeChart from "./charts/AverageTimeChart.vue";
import DocumentsProcessedBySystem from "./components/DocumentsProcessedBySystem.vue"
import ProcessingCycleTimeChart from "./charts/ProcessingCycleTimeChart.vue";
import AutomationLeverWrapper from "./components/AutomationLeverWrapper.vue";
import ExtractionBucketChart from "./charts/analytics/ExtractionBucketChart.vue";
import TotalDocumentCountWrapper from "./components/TotalDocumentCountWrapper.vue";
import PublishedCountWrapper from "./components/PublishedCountWrapper.vue";
import ProcessingTimeWrapper from "./components/ProcessingTimeWrapper.vue";
import DocumentByChannelWrapper from "./components/DocumentByChannelWrapper.vue";
import AvgProcessingTimePerVendorWrapper from "./components/AvgProcessingTimePerVendorWrapper.vue";
import DocumentByEntityWrapper from "./components/DocumentByEntityWrapper.vue";
import VolumeByEntityWrapper from "./components/VolumeByEntityWrapper.vue";
import AverageApproveTimeWrapper from "./components/AverageApproveTimeWrapper.vue";
import StackedLineChartWrapper from "./components/StackedLineChartWrapper.vue";
import DocumentsByClassificationWrapper from "./components/DocumentsByClassificationWrapper.vue";
import DueDateWrapper from "./components/DueDateAgingWrapper.vue";
import PaidStatusWrapper from "./components/PaidStatusWrapper.vue"
import EarlyDiscountWrapper from "./components/EarlyDiscountAgingWrapper.vue";
import ApprovalPendingWrapper from "./components/ApprovalPendingWrapper.vue";
import FinancialMetricsWrapper from "./components/FinancialMetricsWrapper.vue";
import InvoiceInProgressWrapper from "./components/InvoiceInProgressWrapper.vue";
import InvoiceProcessedWrapper from "./components/InvoiceProcessedWrapper.vue";

import _ from "lodash";
import {mapState} from 'vuex';
import IdpDashboardService from "@/idp/services/IdpDashboardService";
import DashboardHeader from "@/idp/main/components/DashboardHeader.vue";
import PublishedTouchedUntouchedDocuments from "./components/PublishedTouchedUntouchedDocuments.vue";


export default {
    name: "InvoiceDashboard",
    data() {
        return {
            title:"Operations Dashboard",
            documentType:"",
            permittedWidgets: [],
            userPreferenceWidgets: '',
            widgetGroups: [],
            query: {},
            widgetConfig: {}
        };
    },
    computed: {
        ...mapState("dashboardStore", {
            operations : state => state.headerFilters.operations,
        })
    },
    methods: {
        getProps() {
            return { defaultQuery: this.query };
        },

        initFilter() {
            const dashboardFilters = IdpDashboardService.getCurrentDashboardFilters();
            this.query = {...dashboardFilters};
            this.documentType = dashboardFilters.document_type;
        },

        getColSize(resource) {
            return this.widgetConfig[resource]["col_size"];
        },

        getWidgetTitle(widgetName){
            return this.widgetConfig[widgetName].widgetTitle;
        },

        updateWidgetGroups(updatedWidgetGroup){
            this.widgetGroups = updatedWidgetGroup;
        },

        initWidgetConfig() {
            this.widgetConfig = {
                "TotalDocumentCountWrapper": {
                    col_size: 9,
                    class: "",
                    widgetTitle: "All Invoices By Stage"
                },
                "AverageTimeChart": {
                    col_size: 9,
                    class: "",
                    widgetTitle: ""
                },
                "DocumentsProcessedBySystem": {
                    col_size: 9,
                    class: "",
                    widgetTitle: "Document Processed By System"
                },
                "ProcessingTimeWrapper": {
                    col_size: 12,
                    class: "",
                    widgetTitle: "Invoices By Volumes"
                },
                "DocumentByChannelWrapper": {
                    col_size: 6,
                    class: "",
                    widgetTitle: "Invoices By Channels"
                },
                "DocumentsByClassificationWrapper": {
                    col_size: 8,
                    class: "",
                    widgetTitle: ""
                },
                "AvgProcessingTimePerVendorWrapper": {
                    col_size: 12,
                    class: "",
                    widgetTitle: ""
                },
                "DocumentByEntityWrapper": {
                    col_size: 12,
                    class: "",
                    widgetTitle: "Invoices By Entity"
                },
                "VolumeByEntityWrapper": {
                    col_size: 16,
                    class: "",
                    widgetTitle: ""
                },
                "AverageApproveTimeWrapper": {
                    col_size: 24,
                    class: "",
                    widgetTitle: ""
                },
                "StackedLineChartWrapper": {
                    col_size: 12,
                    class: "",
                    widgetTitle: ""
                },
                "PublishedCountWrapper": {
                    col_size: 18,
                    class: "",
                    widgetTitle: ""
                },
                "DueDateWrapper": {
                    col_size: 13,
                    class: "",
                    widgetTitle: ""
                },
                "EarlyDiscountWrapper": {
                    col_size: 11,
                    class: "",
                    widgetTitle: ""
                },
                "ApprovalPendingWrapper": {
                    col_size: 12,
                    class: "",
                    widgetTitle: ""
                },
                "FinancialMetricsWrapper": {
                    col_size: 6,
                    class: "",
                    widgetTitle: ""
                },
                "InvoiceInProgressWrapper": {
                    col_size: 12,
                    class: "",
                    widgetTitle: ""
                },
                "InvoiceProcessedWrapper": {
                    col_size: 12,
                    class: "",
                    widgetTitle: ""
                },
                "PaidStatusWrapper": {
                    col_size: 6,
                    class: "",
                    widgetTitle: ""
                },
                "ExtractionBucketChart":{
                    col_size: 24,
                    class: "",
                    widgetTitle: ""
                },
                  "AutomationLeverWrapper": {
                    col_size: 24,
                    class: "",
                    widgetTitle: "Automation Lever"
                },
                    "ProcessingCycleTimeChart": {
                    col_size: 24,
                    class: "",
                    widgetTitle: ""
                },
                "PublishedTouchedUntouchedDocuments": {
                    col_size: 8,
                    class: "",
                    widgetTitle: "Touched vs Non touched"
                }
            };
        },
        init() {
            this.initFilter();
            this.initWidgetConfig();
            this.permittedWidgets = IdpDashboardService.getPermittedWidgets(this.documentType);
            this.userPreferenceWidgets = IdpDashboardService.getUserPreferenceWidgets(this.documentType, this.permittedWidgets);
            this.widgetGroups = IdpDashboardService.updateWidgetGroup(this.permittedWidgets, this.userPreferenceWidgets, this.widgetConfig);
            // Flatten the nested array and create a Set to get unique values
            const uniqueWidegetList= [...new Set(this.widgetGroups.flat())];
            this.$store.commit('dashboardStore/setPermittedDashboardComponentStatus', uniqueWidegetList);
            IdpDashboardService.hideLeftBar();
        }
    },
    components: {
        ExtractionBucketChart,
        DashboardHeader,
        TotalDocumentCountWrapper,
        AverageTimeChart,
        DocumentsProcessedBySystem,
        ProcessingTimeWrapper,
        DocumentByChannelWrapper,
        AvgProcessingTimePerVendorWrapper,
        DocumentByEntityWrapper,
        // AccurcyByVendorsWrapper,
        VolumeByEntityWrapper,
        StackedLineChartWrapper,
        DocumentsByClassificationWrapper,
        PublishedCountWrapper,
        DueDateWrapper,
        PaidStatusWrapper,
        EarlyDiscountWrapper,
        ApprovalPendingWrapper,
        FinancialMetricsWrapper,
        InvoiceInProgressWrapper,
        InvoiceProcessedWrapper,
        AverageApproveTimeWrapper,
        AutomationLeverWrapper,
        ProcessingCycleTimeChart,
        PublishedTouchedUntouchedDocuments
    },
    created() {},
    mounted() {},
    beforeMount() {
        this.$store.commit('dashboardStore/setCurrentDashboard', "operations");
        this.$store.commit('dashboardStore/setOperationsDocType', "invoice");
        this.init();
    },
};
</script>

<style lang="scss">
@import "../_idpGlobal";

</style>
