<template>
  <main class="idp-dashboard fraud-analytics-dashboard-container operations-dashboard">
    <div class="dashboard-container ">
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
import DashboardHeader from "@/idp/main/components/DashboardHeader.vue";
import IdpDashboardService from "@/idp/services/IdpDashboardService";

import TotalDocumentCountWrapper from "./components/TotalDocumentCountWrapper.vue";
import FinancialMetricsWrapper from "./components/FinancialMetricsWrapper.vue";
import DueDateWrapper from "./components/DueDateAgingWrapper.vue";

export default {
  name: "IdpDashboard",
  data() {
    return {
      title: "Vendor Dashboard",
      widgetConfig: {},
      query: null,
      permittedWidgets: [],
      userPreferenceWidgets: "",
      widgetGroups: []
    };
  },
  computed: {},
  methods: {
    getProps() {
      return {
          defaultQuery: this.query,
      };
    },
    updateWidgetGroups(updatedWidgetGroup) {
      this.widgetGroups = updatedWidgetGroup;
    },

    initFilter() {
      let dashboardFilters = IdpDashboardService.getCurrentDashboardFilters();
      this.documentType = dashboardFilters.document_type;
      this.query = {...dashboardFilters};
    },

    initWidgetConfig() {
      this.widgetConfig = {
          "TotalDocumentCountWrapper": {
              col_size: 6,
              class: "",
              widgetTitle: "All Invoices By Stage"
          },
          "FinancialMetricsWrapper": {
              col_size: 6,
              class: "",
              widgetTitle: ""
          },   
          "DueDateWrapper": {
              col_size: 12,
              class: "",
              widgetTitle: ""
          }                     
      }
    },

    getColSize(resource) {
      return this.widgetConfig[resource]["col_size"];
    },
    
    getWidgetTitle(widgetName){
      return this.widgetConfig[widgetName].widgetTitle;
    },

    init() {
      this.initFilter();
      this.initWidgetConfig();
      this.permittedWidgets = IdpDashboardService.getPermittedWidgets(this.documentType);
      this.userPreferenceWidgets = IdpDashboardService.getUserPreferenceWidgets(this.documentType, this.permittedWidgets);
      this.widgetGroups = IdpDashboardService.updateWidgetGroup(this.permittedWidgets, this.userPreferenceWidgets, this.widgetConfig);
      IdpDashboardService.hideLeftBar();
    }
  },

  components: {
    DashboardHeader,
    TotalDocumentCountWrapper,
    FinancialMetricsWrapper,
    DueDateWrapper
  },

  created() {},
  mounted() {},
  beforeDestroy() {},
  async beforeMount() {
    this.$store.commit('dashboardStore/setCurrentDashboard', "vendor");
    this.$store.commit('dashboardStore/setVendorDocType', "invoice");
    this.init();
  },
};
</script>

<style lang="scss">
@import "../_idpGlobal";


.inner-dashboard-wrapper {
  // padding: 0 var(--space-xl) 0 var(--space-xl);
  padding:0;
}

.fraud-analytics-dashboard-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  .dashboard-analysis-header { 
      margin-top: var(--space-xl);
      margin-bottom: var(--space-md);
  }
  
  .total-fraud-values-container {
    padding: 1rem;
    background: #f4f4f4;
  }

  .dashboard-container {
    padding-left: var(--space-xl);
    padding-right: var(--space-xl);

    z-index: 999;
    position: relative;
    background: white;
  }

  .dashboard-container {
    flex: 1;
    padding-left: var(--space-xl);
    padding-right: var(--space-xl);

    .chart-row {
      margin-top: 20px;
    }
  }

  .dashboard-container::-webkit-scrollbar {
    width: 6px;
    background-color: var(--white);
  }

  .dashboard-container::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px var(--dark-06);
    background-color: var(--white);
  }

  .dashboard-container::-webkit-scrollbar-thumb {
    background-color: var(--dark-05);
  }

  .row-border {
    border-bottom: var(--border-base) solid var(--dark-07);
    padding: var(--space-lg) 0;
  }
}

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

//  new CSS

.fraud-analytics-dashboard-container {
  .trends-graph-container {
    .echarts {
      margin-top: var(--space-lg);
    }
    .trends-graph-title {
      text-transform:capitalize;
      text-align: left;
      font-size: 1.3rem;
      font-weight: 600;
      padding-bottom: 14px;
    }
    .by-fraud-container {

      .el-card__body {
        padding: 12px;
      }
    }
  }
  .trends-graph-heading {
    // background: whitesmoke;
    margin-bottom: 1rem;
    margin-top: 2rem;
    .heading {
      text-align: left;
      font-size: 1.6rem;
    }
  }
}
</style>
