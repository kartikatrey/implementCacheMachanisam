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
    import ExtractionBucketChart from "./charts/analytics/ExtractionBucketChart.vue";
    import TotalDocumentCountWrapper from "./components/TotalDocumentCountWrapper.vue";
    import PublishedCountWrapper from "./components/PublishedCountWrapper.vue";
    import ProcessingTimeWrapper from "./components/ProcessingTimeWrapper.vue";
    import DocumentByChannelWrapper from "./components/DocumentByChannelWrapper.vue";
    import SubmissionEmails from "./components/SubmissionEmails.vue";
    import AvgProcessingTimePerVendorWrapper from "./components/AvgProcessingTimePerVendorWrapper.vue";
    
    import _ from "lodash";
    import {mapState} from 'vuex';
    import IdpDashboardService from "@/idp/services/IdpDashboardService";
    import DashboardHeader from "@/idp/main/components/DashboardHeader.vue";
    
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
                        widgetTitle: "All Forms By Stage"
                    },
                    "DocumentByChannelWrapper": {
                        col_size: 6,
                        class: "",
                        widgetTitle: "Invoices By Channels"
                    },
                    "SubmissionEmails": {
                        col_size: 6,
                        class: "",
                        widgetTitle: "Submission Emails"
                    },
                   
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
            DashboardHeader,
            TotalDocumentCountWrapper,
            DocumentByChannelWrapper,
            SubmissionEmails
        },
        created() {},
        mounted() {},
        beforeMount() {
            this.$store.commit('dashboardStore/setCurrentDashboard', "operations");
            this.$store.commit('dashboardStore/setOperationsDocType', "sov");
            this.init();
        },
    };
    </script>
    
    <style lang="scss">
    @import "../_idpGlobal";
    
    </style>
    