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
import DashboardHeader from "@/idp/main/components/DashboardHeader.vue";
import ExtractionBucketChart from "./charts/analytics/ExtractionBucketChart.vue";
import TotalDocumentCountWrapper from "./components/TotalDocumentCountWrapper.vue";
import PublishedCountWrapper from "./components/PublishedCountWrapper.vue";
import ProcessingTimeWrapper from "./components/ProcessingTimeWrapper.vue";
import DocumentByChannelWrapper from "./components/DocumentByChannelWrapper.vue";
import AvgProcessingTimePerVendorWrapper from "./components/AvgProcessingTimePerVendorWrapper.vue";
import DocumentByEntityWrapper from "./components/DocumentByEntityWrapper.vue";
import VolumeByEntityWrapper from "./components/VolumeByEntityWrapper.vue";
import StackedLineChartWrapper from "./components/StackedLineChartWrapper.vue";
import DocumentsByClassificationWrapper from "./components/DocumentsByClassificationWrapper.vue";

import _ from "lodash";
import {mapState} from 'vuex';
import store from "@/store";
import IdpDashboardService from "@/idp/services/IdpDashboardService";

export default {
    name: "PODashboard",
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

        getWidgetTitle(widgetName){
            return this.widgetConfig[widgetName].widgetTitle;
        },

        updateWidgetGroups(updatedWidgetGroup){
            this.widgetGroups = updatedWidgetGroup;
        },

        initFilter() {
            const dashboardFilters = IdpDashboardService.getCurrentDashboardFilters();
            this.documentType = dashboardFilters.document_type;
            this.query = {...dashboardFilters};
        },

        getColSize(resource) {
            return this.widgetConfig[resource]["col_size"];
        },
        
        initWidgetConfig() {
            this.widgetConfig = {
                "TotalDocumentCountWrapper": {
                    col_size: 9,
                    class: "",
                    widgetTitle: "All SO By Stage"
                },
                "AverageTimeChart": {
                    col_size: 9,
                    class: ""
                },
                "ProcessingTimeWrapper": {
                    col_size: 12,
                    class: "",
                    widgetTitle: "SO By Volumes"
                    
                },
                "DocumentByChannelWrapper": {
                    col_size: 6,
                    class: "",
                    widgetTitle: "SO By Channels"
                },
                "DocumentsByClassificationWrapper": {
                    col_size: 8,
                    class: ""
                },
                "AvgProcessingTimePerVendorWrapper": {
                    col_size: 12,
                    class: ""
                },
                "DocumentByEntityWrapper": {
                    col_size: 12,
                    class: "",
                    widgetTitle: "SO By Entity"
                },
                "VolumeByEntityWrapper": {
                    col_size: 16,
                    class: ""
                },
                "StackedLineChartWrapper": {
                    col_size: 12,
                    class: ""
                },
                "PublishedCountWrapper": {
                    col_size: 12,
                    class: ""
                },
                "ExtractionBucketChart":{
                    col_size: 24,
                    class: "",
                    widgetTitle: ""
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
        ProcessingTimeWrapper,
        DocumentByChannelWrapper,
        AvgProcessingTimePerVendorWrapper,
        DocumentByEntityWrapper,
        VolumeByEntityWrapper,
        StackedLineChartWrapper,
        DocumentsByClassificationWrapper,
        PublishedCountWrapper
    },
    created() {},
    mounted() {},
    beforeMount() {
        this.$store.commit('dashboardStore/setCurrentDashboard', "operations");
        this.$store.commit('dashboardStore/setOperationsDocType', "po");
        this.init();
    },
};
</script>

<style lang="scss">
@import "../_idpGlobal";

</style>
