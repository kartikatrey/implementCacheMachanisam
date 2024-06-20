<template>
<main class="idp-dashboard operations-dashboard">
    <div class="dashboard-container">
        <div class="dahboard-header">
            <DashboardHeader :title="title" @updateWidgetGroups ="updateWidgetGroups" :widgetConfig ="widgetConfig" :permittedWidgets="permittedWidgets" :userPreferenceWidgets="userPreferenceWidgets"/>
        </div>
        <div class="dashboard-body" id="dashboard-body">
            <el-row :gutter="12" class="chart-row" v-for="widgetGroup in widgetGroups" :key="widgetGroup">
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
import ProcessingCycleTimeChart from "./charts/ProcessingCycleTimeChart.vue";
import AutomationLeverWrapper from "./components/AutomationLeverWrapper.vue";
import ExtractionBucketChart from "./charts/analytics/ExtractionBucketChart.vue";
import TotalDocumentCountWrapper from "./components/TotalDocumentCountWrapper.vue";
import PublishedCountWrapper from "./components/PublishedCountWrapper.vue";
import ProcessingTimeWrapper from "./components/ProcessingTimeWrapper.vue";
import DocumentByChannelWrapper from "./components/DocumentByChannelWrapper.vue";
import VolumeByEntityWrapper from "./components/VolumeByEntityWrapper.vue";
import AvgProcessingTimePerVendorWrapper from "./components/AvgProcessingTimePerVendorWrapper.vue";
import DocumentByEntityWrapper from "./components/DocumentByEntityWrapper.vue";
import StackedLineChartWrapper from "./components/StackedLineChartWrapper.vue";
import DocumentsByClassificationWrapper from "./components/DocumentsByClassificationWrapper.vue";
import PublishedTouchedUntouchedDocuments from "./components/PublishedTouchedUntouchedDocuments.vue";

import _ from "lodash";
import IdpDashboardService from "@/idp/services/IdpDashboardService";
import DashboardHeader from "@/idp/main/components/DashboardHeader.vue";

export default {
    name: "IdpDashboard",
    data() {
        return {
            title:"Operations Dashboard",
            permittedWidgets: [],
            userPreferenceWidgets: '',
            widgetGroups: [],
            query: {},
            documentType: "",
            widgetConfig: {}
        };
    },
    methods: {
        getProps() {
            return { defaultQuery: this.query };
        },

        initFilter() {
            let dashboardFilters = IdpDashboardService.getCurrentDashboardFilters();
            this.documentType = dashboardFilters.document_type;
            dashboardFilters = _.omit(dashboardFilters, ["document_type"]);  // remove doctype - summary
            this.query = {...dashboardFilters};
        },

        getColSize(resource) {
            return this.widgetConfig[resource]["col_size"];
        },

        getWidgetTitle(widgetName){
            return this.widgetConfig[widgetName].widgetTitle;
        },

        initWidgetConfig() {
            this.widgetConfig = {
                "TotalDocumentCountWrapper": {
                    col_size: 9,
                    class: "",
                    widgetTitle: "All Documents By Stage"
                },
                "AverageTimeChart": {
                    col_size: 9,
                    class: "",
                    widgetTitle: ""
                },
                "ProcessingTimeWrapper": {
                    col_size: 12,
                    class: "",
                    widgetTitle: "Documents By Volume (Bar)"
                },
                "DocumentByChannelWrapper": {
                    col_size: 6,
                    class: "",
                    widgetTitle: "Documents By Channels"
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
                    widgetTitle: "Documents By Entity"
                },
                "VolumeByEntityWrapper": {
                    col_size: 16,
                    class: "",
                    widgetTitle: ""
                },
                "StackedLineChartWrapper": {
                    col_size: 12,
                    class: "",
                    widgetTitle: ""
                },
                "PublishedCountWrapper": {
                    col_size: 16,
                    class: "",
                    widgetTitle: ""
                },
                "ExtractionBucketChart":{
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
        },
        updateWidgetGroups(updatedWidgetGroup){
            this.widgetGroups = updatedWidgetGroup;
        }
    },
    components: {
        ExtractionBucketChart,
        DashboardHeader,
        AverageTimeChart,
        TotalDocumentCountWrapper,
        ProcessingTimeWrapper,
        DocumentByChannelWrapper,
        AvgProcessingTimePerVendorWrapper,
        DocumentByEntityWrapper,
        VolumeByEntityWrapper,
        StackedLineChartWrapper,
        DocumentsByClassificationWrapper,
        PublishedCountWrapper,
        AutomationLeverWrapper,
        ProcessingCycleTimeChart,
        PublishedTouchedUntouchedDocuments
    },
    created() {},
    mounted() {},
    beforeMount() {
        this.$store.commit('dashboardStore/setCurrentDashboard', "operations");
        this.$store.commit('dashboardStore/setOperationsDocType', "summary");
        this.init();
    },
};
</script>

<style lang="scss">
@import "../_idpGlobal";

</style>
