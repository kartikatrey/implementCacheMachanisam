<template>
  <main class="idp-dashboard operations-dashboard">
    <div class="dashboard-container">
        <div class="dahboard-header">
            <DashboardHeader :title="title" :updateWidgetGroup="updateWidgetGroup" :permittedWidgets="permittedWidgets" :userPreferenceWidgets="userPreferenceWidgets"/>
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
  import TotalDocumentCountWrapper from "./components/TotalDocumentCountWrapper.vue";
  import DocumentByChannelWrapper from "./components/DocumentByChannelWrapper.vue";
  import AverageTimeChart from "./charts/AverageTimeChart.vue"; 
  import GaugeChartWrapper from "./components/GaugeChartWrapper.vue";
  import DocumentBySubtypeWrapper from "./components/operations/insurance/DocumentBySubtypeWrapper.vue";
  import OrphanDocsBySubtypeWrapper from "./components/operations/insurance/OrphanDocsBySubtypeWrapper.vue";
  import ProductivityStaffWrapper from "./components/operations/insurance/ProductivityStaffWrapper.vue";
  import SubmissionsOnlineOfflineWrapper from "./components/operations/insurance/SubmissionsOnlineOfflineWrapper.vue";
  import SubmissionLobWiseWrapper from "./components/operations/insurance/SubmissionLobWiseWrapper.vue";
  import SubmissionsPendingWrapper from "./components/operations/insurance/SubmissionsPendingWrapper.vue";
  
  import _ from "lodash";
  import store from "@/store";
  import IdpDashboardService from "@/idp/services/IdpDashboardService";
  import DashboardHeader from "@/idp/main/components/DashboardHeader.vue";

export default {
    name: "InsuranceDashboard",
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
    methods: {
        getProps() {
            return { defaultQuery: this.query };
        },

        getWidgetTitle(widgetName){
            return this.widgetConfig[widgetName].widgetTitle;
        },

        getColSize(resource) {
            return this.widgetConfig[resource]["col_size"];
        },

        initWidgetConfig() {
            this.widgetConfig = {
                "TotalDocumentCountWrapper": {
                    col_size: 9,
                    class: "",
                    widgetTitle: "All Forms By Stage"
                },
                "AverageTimeChart": {
                    col_size: 9,
                    class: "",
                    widgetTitle: ""
                },            
                "DocumentByChannelWrapper": {
                    col_size: 6,
                    class: "",
                    widgetTitle: "Forms By Channels"
                },      
               "GaugeChartWrapper": {
                    col_size: 8,
                    class: "",
                    widgetTitle: ""
                },
               "DocumentBySubtypeWrapper": {
                    col_size: 8,
                    class: "",
                    widgetTitle: "Forms By Subtype"
                },
               "OrphanDocsBySubtypeWrapper": {
                    col_size: 8,
                    class: "",
                    widgetTitle: "Forms Orphaned"
                },
                "ProductivityStaffWrapper": {
                    col_size: 12,
                    class: "",
                    widgetTitle: ""
                },
                "SubmissionLobWiseWrapper": {
                    col_size: 12,
                    class: "",
                    widgetTitle: ""
                },
                "SubmissionsOnlineOfflineWrapper": {
                    col_size: 12,
                    class: "",
                    widgetTitle: ""
                },
                "SubmissionsPendingWrapper":{
                    col_size: 12,
                    class: "",
                    widgetTitle: ""
                }
            };
        },

        initFilter() {  
            const dashboardFilters = IdpDashboardService.getCurrentDashboardFilters();
            this.query = {...dashboardFilters};
            this.documentType = dashboardFilters.document_type;
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
        GaugeChartWrapper,
        AverageTimeChart,
        DocumentBySubtypeWrapper,
        OrphanDocsBySubtypeWrapper,
        ProductivityStaffWrapper,
        SubmissionsOnlineOfflineWrapper,
        SubmissionLobWiseWrapper,
        SubmissionsPendingWrapper
    },
    created() {},
    mounted() {},
    beforeMount() {
        this.$store.commit('dashboardStore/setCurrentDashboard', "operations");
        this.$store.commit('dashboardStore/setOperationsDocType', "insurance");
        this.init();
    },
}
</script>

<style>

</style>