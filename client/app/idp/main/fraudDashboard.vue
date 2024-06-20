<template>
  <main class="idp-dashboard fraud-analytics-dashboard-container operations-dashboard">
    <div class="dashboard-container ">
      <div class="dahboard-header">
        <DashboardHeader
          :title="title"
          :showWidgetDrpodown="false"
          :permittedWidgets="[]"
          :userPreferenceWidgets="''"
        />
        
      </div>

          <!-- Fraudulent activity -->
          <el-row style="total-fraud-values-container">
            <FraudulentActivity :defaultQuery="query" />
          </el-row>

          <div class="dashboard-analysis-header">
              <h2>Trends</h2>
          </div>




      <!-- trends graph -->
      <el-row
        :gutter="12"
        type="flex"
        class="trends-graph-container"
        justify="start"
      >
        <el-col :span="6" class="by-fraud-container">
            <div class="dashboard-cards">
               <el-row type="flex" class="graph-toolbar-container">
                  <el-col :span="20" class="title-container">
                    <div class="header">By Activity</div>
                  </el-col>
              </el-row>
              <FraudByActivityWrapper :defaultQuery="query" />
            </div>
        
        </el-col>
        <el-col :span="6" class="by-fraud-container">
            <div class="dashboard-cards">
                <el-row type="flex" class="graph-toolbar-container">
                  <el-col :span="20" class="title-container">
                    <div class="header">By Amount</div>
                  </el-col>
                </el-row>
              <FraudByAmountWrapper :defaultQuery="query" />
            </div>
        </el-col>
        <el-col :span="6" class="by-fraud-container">
            <div class="dashboard-cards">
              <el-row type="flex" class="graph-toolbar-container">
                <el-col :span="20" class="title-container">
                  <div class="header">By Vendor</div>
                </el-col>
              </el-row>
              <FraudByVendorWrapper :defaultQuery="query" />
            </div>
        </el-col>
        <el-col :span="6" class="by-fraud-container">
            <div class="dashboard-cards">
              <el-row type="flex" class="graph-toolbar-container">
                <el-col :span="20" class="title-container">
                  <div class="header">By Type</div>
                </el-col>
              </el-row>
              <FraudByCodeWrapper :defaultQuery="query" />
            </div>
        </el-col>
      </el-row>
    </div>
  </main>
</template>

<script>
import FraudulentActivity from "./components/fraud/FraudulentActivity.vue";
import FraudByActivityWrapper from "./components/fraud/FraudByActivityWrapper.vue";
import FraudByAmountWrapper from "./components/fraud/FraudByAmountWrapper.vue";
import FraudByVendorWrapper from "./components/fraud/FraudByVendorWrapper.vue";
import FraudByCodeWrapper from "./components/fraud/FraudByCodeWrapper.vue";

import DashboardHeader from "@/idp/main/components/DashboardHeader.vue";
import Constants from "@/resources/Constants";
import IdpDashboardService from "@/idp/services/IdpDashboardService";

export default {
  name: "IdpDashboard",
  provide() {
    return {
        constant:Constants
    }
  },
  data() {
    return {
      title: "Fraud Analytics Dashboard",
      query: null
    };
  },
  computed: {},
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
  },
  components: {
    FraudulentActivity,
    DashboardHeader,
    FraudByAmountWrapper,
    FraudByActivityWrapper,
    FraudByVendorWrapper,
    FraudByCodeWrapper,
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  async beforeMount() {
    this.$store.commit('dashboardStore/setCurrentDashboard', "fraud_analytics");
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
