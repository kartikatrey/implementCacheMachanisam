
<template>
  <main class="idp-admin-dashboard">
    <div class="idp-admin-dashboard-container">
      <div class="dashboard-header-container">
        <idpAdminDashboardHeader
          :config="idpHeaderConfig"
          :activeName="activeTabName"
        />
      </div>
      <div class="dashboard-body" style="padding:0">
        <!-- Total aggregated cards -->
         <div class="idp-total-count-container">
          <el-row :gutter="35">
            <el-col v-for="(card, index) in adminCards" :key="index" :span="card.span">
              <el-card shadow="always" class="box-card idp-card-container idp-total-count">
                <div slot="header" class="clearfix idp-card-header total-card-header">
                  <span class="idp-card-title">{{ card.label }}</span>
                   <div class="last-update"> 
                     <i class="mdi mdi-clock-outline"></i>
                      Last updated : {{lastUpdated}}</div>
                </div>
                <div>
                  <component
                    :is="card.widget_name"
                    :config="cardConfig"
                    v-bind="getCardQuery()"
                  >
                  </component>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        <!-- Subscription cards -->
        <div class="idp-admin-subscription-container">
          <el-row :gutter="35">
            <el-col v-for="(card, index) in subscriptionCards" :key="index" :span="card.span">
              <el-card shadow="always" class="box-card idp-card-container idp-total-count">
                <div slot="header" class="clearfix idp-card-header total-card-header">
                  <span class="idp-card-title">{{ card.label }}</span>
                  <div class="idp-dashboard-header-subscription-container">
                    <div class="last-update"> 
                      <i class="mdi mdi-clock-outline"></i>
                        Last updated : {{subscriptionDataLastUpdated}}
                    </div>
                    <div v-show="card.widget_name == 'CustomerMontlyProcessingCard'"  class="subscription-customer-list">
                      <el-select
                        v-model="selectedCustomerForSubscription"
                        filterable
                        placeholder="Select customer"
                        @change="customerSelectionForSubscription"
                      >
                        <el-option
                          v-for="item in subscriptionCustomers"
                          :key="item._id"
                          :label="item.customer_name"
                          :value="item._id"
                        >
                          <span>
                            {{ item.customer_name }}
                          </span>
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <component :is="card.widget_name" :ref="'Subscription_Cards__'+card.widget_name"></component>
              </el-card>
            </el-col>
          </el-row>
        </div>
        <div class="idp-admin-customer-container">
        <!-- Customer cards header -->
         <div class="idp-admin-customer-wise-card-header-container">
            <!-- <div class="idp-admin-customer-wise-card-header"> -->
              <div class="title">Customers</div>
              <div class="dashboard-tabs">
                <!-- Customer List -->
                <span>
                  <el-select
                    class="idp-dashboard-header-customer-container"
                    v-model="selectedDropDownCustomer"
                    multiple
                    :multiple-limit="10"
                    collapse-tags
                    filterable
                    placeholder="Select customer"
                    @change="customerSelection"
                    popper-class="idp-header-customer-selection"
                  >
                    <el-option
                      class="idp-header-customer-select-options"
                      v-for="item in customers"
                      :key="item._id"
                      :label="item.customer_name"
                      :value="item._id"
                    >
                      <span>
                        {{ item.customer_name }}
                      </span>
                    </el-option>
                  </el-select>
                </span>
              <!-- </div> -->
            </div>
         </div>

        <div>
          <el-row :gutter="35">
            <el-col
              :span="8"
              v-for="(cust, index) in selectedCustomer"
              :key="index + '_' + cust._id"
            >
              <el-card shadow="always" class="box-card idp-card-container">
                <div slot="header" class="clearfix idp-card-header">
                  
                  <span class="idp-card-title"><i class="mdi mdi-chart-timeline-variant"></i> {{ cust.customer_name }}</span>
                  <el-tooltip content="View dashboard" placement="top" effect="light">
                    <el-button class="open-dashboard-link" type="text"  @click="impersonateToCustomer(cust)">
                          <span class="mdi mdi-view-dashboard-outline"></span>
                    </el-button>
                 </el-tooltip>
                </div>
                <div>
                  <el-tabs
                    v-model="customerTabSelection[`${cust.customer_name}_${index}`]"
                  >
                    <el-tab-pane
                      v-for="(custCard, i) in customerWiseCards"
                      :key="cust._id + '_' + i"
                      :label="custCard.label"
                      :name="custCard.value"
                    >
                      <component
                        :is="custCard.value"
                        :customer="cust"
                        :config="customerCardConfig"
                        v-bind="getProps()"
                      ></component>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        </div>

      </div>
    </div>
  </main>
</template>

<script>
// Services
import CustomerService from "@/idp/services/CustomerService";
import SubscriptionService from "@/idp/services/SubscriptionService";
import DashboardDrillDownService from "@/idp/services/DashboardDrillDownService";
import TotalDocumentCountByCustomerWrapper from "./components/TotalDocumentCountByCustomerWrapper.vue";
import idpAdminDashboardHeader from "@/idp/main/components/idpAdminDashboardHeader.vue";

import TotalDocumentCountWrapper from "./components/TotalDocumentCountWrapper.vue";
import ProcessingTimeWrapper from "./components/ProcessingTimeWrapper.vue";

// Cards
import TotalDocumentCountCard from "./components/card/TotalDocumentCountCard.vue";
import DocumentByVolumeCard from "./components/card/DocumentByVolumeCard.vue";
import CustomerThresholdCard from "./components/card/CustomerThresholdCard.vue";
import CustomerMontlyProcessingCard from "./components/card/CustomerMontlyProcessingCard.vue";
import AllCustomersMonthlyProcessingCard from "./components/card/AllCustomersMonthlyProcessingCard.vue";

import _ from "lodash";
import Constants from "@/resources/Constants";
import moment from 'moment';

export default {
  name: "IdpAdminDashboard",
  data() {
    return {
      activeTabName: "2",
      lastUpdated:moment().fromNow(),
      subscriptionDataLastUpdated:"",
      selectedCustomer: [],
      selectedCustomerForSubscription: [],
      subscriptionCustomers: [],
      selectedDropDownCustomer: [],
      customerCardConfig: { showGraphTitle: false },
      idpHeaderConfig: {
        showWidgetDropdownOption: false,
        showCustomDateOption: false,
        showCustomerList: true,
      },
      cardConfig: { showGraphTitle: false },
      activeName: "2",
      customer_id: "",
      permittedWidgets: [],
      userPreferenceWidgets: "",
      widgetGroups: [],
      query: {},
      customers: [],
      subscriptions:[],
      customerWiseCards: [], // change
      customerTabSelection: {},
      adminCards: Constants.DOCEX.IDP_DASHBOARD.ADMIN_CARDS, // change
      subscriptionCards: Constants.DOCEX.IDP_DASHBOARD.SUBSCRIPTION_CARDS
    };
  },
  // Removed user domain dependancy
  // provide() {
  //   return {
  //     getDocTypeByUserDomains:this.getDocTypeByUserDomains
  //   }
  // },
  computed: {},
  methods: {
    hideLeftBar() {
            this.$store.commit("setDisplayIdpTree",false);
            this.$store.commit("setDisplayIdpNavbar",false);
            
    },
    // Removed user domain dependancy
    // getDocTypeByUserDomains(){
    //   let domainList = _.get(this.$store,'state.user.user_domains',[]) ;
    //   let docTypes = [];
    //   domainList.map(domain=>{
    //     docTypes = docTypes.concat(_.get(domain, 'document_type',[]));
    //   });
    //   return _.uniq(docTypes);
    // },
    handleClick() {},
    customerSelection() {
      this.selectedCustomer = _.filter(this.customers, (customer) =>
        _.includes(this.selectedDropDownCustomer, customer._id)
      );
      this.processCardTabSelection();
    },
    customerSelectionForSubscription(value) {
      this.selectedCustomerForSubscription = value;
      //Call the 'Customer Monthly Processing' Card method using ref
      const customerMonthlyProcessingRef = this.$refs["Subscription_Cards__CustomerMontlyProcessingCard"];
      if(customerMonthlyProcessingRef && customerMonthlyProcessingRef.length > 0){
        customerMonthlyProcessingRef[0].getChartData(this.selectedCustomerForSubscription);
      }
    },
    getProps() {
      return {
        defaultQuery: this.query,
        durationFilter: this.activeTabName,
      };
    },
    getCardQuery() {
      return {
        defaultQuery: {},
        durationFilter: this.activeTabName,
      };
    },
    getActiveTabFilter() {
      return DashboardDrillDownService.findDateRangeByActiveTab(this.activeTabName);
    },
    findFilter() {
      try {
        this.filter = JSON.parse((this.$route && this.$route.query && this.$route.query.filter) || "{}");
      } catch (err) {
        this.filter = {};
      }
      return this.filter;
    },
    initFilter() {
      const filter = this.findFilter();
      this.activeTabName = filter["active"] || "2";
      this.query = this.getActiveTabFilter();
    },
    async impersonateToCustomer(customer) {
      const selectedCustomer = _.find(this.customers, {_id : customer._id});
      if (!selectedCustomer) return;
      localStorage.setItem("customer_name", selectedCustomer.customer_name);
      localStorage.setItem("customerName", selectedCustomer.customer_name);
      let params = { customer_id: selectedCustomer._id };
      let response = await CustomerService.loginWithCustomer(params);

      this.$store.commit("setCustomerId", selectedCustomer._id);
      this.$store.commit("setImpersonate", response.data.is_impersonate);

      let user = this.$store.getters.user;
      user["permitted_dashboard_pages"] = response.data.permitted_dashboard_pages || [];
      user["permitted_widgets"] = response.data.permitted_widgets || [];

      this.$store.commit("setUser", user);
      window.location.replace("/app/idp");
    },
    async getCustomerData() {
      try {
        const durationFilterKeyMap = {
              0: 'last_day',
              1: 'last_7_days',
              2: 'last_30_days',
              3: 'last_year'
        };
        const sortBy = '-dashboard_data.total_document_count.' + durationFilterKeyMap[this.activeTabName];
        this.customers = await CustomerService.find({type:"IDP"},{sortBy,select:['customer_name','dashboard_data.total_document_count','dashboard_data.last_updated']});
        this.lastUpdated = moment(_.get(this.customers, '[0].dashboard_data.last_updated') || new Date()).fromNow();

        this.selectedCustomer = this.customers.slice(0, 10);
        this.selectedDropDownCustomer = _.map(this.selectedCustomer, "_id");
        this.processCardTabSelection();
        this.getSubscriptionData(this.customers);
      } catch (e) {
        console.log(e);
      }
    },
    async getSubscriptionData(customersList) {
      //Get list of all subscription customers which are active
      const subscriptionsList = await SubscriptionService.find({ sortBy: '-updated_at' }, { select: ['updated_at', 'customer_id'] });
      this.subscriptionDataLastUpdated = moment(_.get(subscriptionsList, '[0].updated_at') || new Date()).fromNow();

      //Get list of customers which are having subscriptions
      this.subscriptionCustomers = this.getSubscriptionCustomers(customersList, subscriptionsList);
      this.selectedCustomerForSubscription = this.subscriptionCustomers && this.subscriptionCustomers[0]._id;
      
      //Call the 'Customer Monthly Processing Card' method using ref
      const customerMonthlyProcessingRef = this.$refs["Subscription_Cards__CustomerMontlyProcessingCard"];
      if(customerMonthlyProcessingRef && customerMonthlyProcessingRef.length > 0){
        customerMonthlyProcessingRef[0].getChartData(this.selectedCustomerForSubscription);
      }
    },
    /**
     * Purpose - In this method, we don't need to perform another query on the customer table
     * to retrieve a list of customers, as we have already obtained the list of customers
     * in the previous function.
     * @param {*} customersList - List of customers with filter type:"IDP" 
     * @param {*} subscriptionsList - List of subscription records
     * returns list of customers ordered by subscription
     */
    getSubscriptionCustomers(customersList, subscriptionsList){
      const sortedCustomers = [];
      if (subscriptionsList && subscriptionsList.length) {
        for (const subscription of subscriptionsList) {
          const customer = customersList && customersList.find(cust => cust._id == subscription.customer_id);
          customer && sortedCustomers.push(customer);
        }
      }
      return sortedCustomers;
    },
    processCardTabSelection() {
      const customerWiseCards = Constants.DOCEX.IDP_DASHBOARD.CUSTOMER_WISE_CARDS;
      this.selectedCustomer.map((cust, custIndex) => {
        this.customerTabSelection[`${cust.customer_name}_${custIndex}`] = customerWiseCards[0].value;
      });
      this.customerWiseCards = customerWiseCards;
    },
    async init() {
      this.initFilter();
      this.getCustomerData();
      this.hideLeftBar();
    },
  },
  components: {
    TotalDocumentCountCard,
    DocumentByVolumeCard,
    idpAdminDashboardHeader,
    TotalDocumentCountWrapper,
    ProcessingTimeWrapper,
    TotalDocumentCountByCustomerWrapper,
    CustomerThresholdCard,
    CustomerMontlyProcessingCard,
    AllCustomersMonthlyProcessingCard
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  beforeMount() {
    this.init();
  },
};
</script>

<style lang="scss">
@import "../_idpGlobal.scss";
.idp-admin-dashboard-header .dashboard-tabs .el-tabs__item {
  line-height: 1.5rem;
}
.idp-total-count {
  .el-card__header {
      text-align: center;
  }
}
.idp-admin-customer-wise-card-header-container {
  display: flex;
  justify-content: flex-end;
  border-bottom: var(--border-base) solid var(--dark-07);
  margin-top: var(--space-base);
    margin-bottom: 3rem;
    padding-bottom:var(--space-base);
    position: sticky;
    top: 0px;
    z-index: 999;
    background: var(--white);
        padding-top: 1rem;
    .title {
      margin-right: auto;
      padding: 0;
      border: 0;
      font-weight: 600;
      font-size: var(--font-pagetile);
      color: var(--dark-02);
      margin-left: 0;
    }
    .dashboard-tabs {
          background: #f3f7fa;
        border-color: #fff;
        padding: .2rem;
    }
}


.idp-admin-dashboard {
  height: calc(100% - 2.7rem);
  width: 100%;
  margin-top: 2.7rem;

  overflow: auto;
  box-sizing: border-box;

  .idp-admin-dashboard-container {
    display: flex;
    flex-direction: column;
    height: 100%;

    .dashboard-header-container {
      padding-left: var(--space-xl);
      padding-right: var(--space-xl);
      z-index: 999;
      position: relative;
      background: white;
    }
   
    .dashboard-body {
      flex: 1;
      margin-top: 0rem;
      overflow: auto;
      padding: 0;

      .idp-total-count-container {
         padding: var(--space-xl) var(--space-xl) 0 var(--space-xl);
         background:var(--dark-09);
      }
      .idp-admin-subscription-container{
        padding: var(--space-xl) var(--space-xl) 0 var(--space-xl);
        background:var(--dark-09);
      }
      .idp-admin-customer-container {
         padding: 0 var(--space-xl);
      }
      .chart-row {
        margin-top: 20px;
      }
      .box-card {
        margin-bottom: 14px;
        // margin-left: 7px;
        // margin-right: 7px;
      }
      .idp-card-container:hover  {
          box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
               .idp-card-header { 
                   .idp-card-title { 
                      color: var(--brand-05);
                        i {
                           color: var(--brand-05);
                        }
                   }
               }
                .el-tabs__item.is-active {
                    color: var(--brand-05) !important;
                }
                 .el-tabs__active-bar {
                  background-color:  var(--brand-05);
                }
      }




      .idp-card-container {
        box-shadow: none;
        border:1px solid var(--dark-08);
        margin-bottom: 3rem;
        padding:1.5rem 2rem 2rem 2rem;

        .total-card-header {
          display: flex;
          justify-content: flex-start;
            .idp-card-title {

            }
            .last-update {
              margin-left: auto;
              font-size: var(--font-sm);
              color: var(--dark-06);
                i {
                  color: var(--dark-06);
                }
            }
            .idp-dashboard-header-subscription-container{
              margin-left: auto;
              text-align: right;
              .subscription-customer-list{
                width: 30rem;
                padding-top: 1rem;
              }
            }
        }
        .el-tabs__header {
            .el-tabs__item {
                font-size: var(--font-base);
                color: var(--dark-05);
                font-weight: 400;
                  text-transform: uppercase;
                      line-height: 3rem;
            }
            .el-tabs__item.is-active {
                color: var(--dark-02);
            }
        }
          .el-tabs__nav-wrap::after {
              height: 1px;
              background-color: var(--dark-08);
          }
          .el-tabs__active-bar {
             background-color:  var(--dark-05);
          }

        .el-card__header {
          border-bottom: 1px;
          padding: 0;
          padding-bottom: 2rem;
        }
    
        .idp-card-header {
          padding: 0;
          border: 0;
          display: flex;
          justify-content: start;
          .idp-card-title {
            font-size: var(--font-lg);
            color: var(--dark-03);
            font-weight: 500;
              i {
                    font-size: 1.8rem;
                    display: inline-block;
                    padding-right: .5rem;
                    color: var(--dark-04);
                    position: relative;
                    top: 3px;
              }
          }
          .open-dashboard-link {
            margin-left: auto;
            padding: 0;
              span {
                font-size: 1.5rem;
                color: var(--dark-05);
              }
          }
          .open-dashboard-link:hover {
             transform: scale(1.1); 
              span {
                color: var(--brand-05);
              }
          }
          .idp-card-open-action {
            float: right;
            font-size: 1.5rem;
            cursor: pointer;
          }
        }
        .el-card__body {
          padding: 0;
        }
      }
      .idp-admin-customer-wise-card-header-container{

          // .el-card__body{
          //     padding:10px
          // }
          .idp-admin-customer-wise-card-header {
            display: flex;
            justify-content: flex-end;
            // border-bottom: var(--border-base) solid var(--dark-07);
            // margin-top: var(--space-base);
            .title {
              margin-right: auto;
              padding: 0;
              border: 0;
              font-weight: 600;
              font-size: 1.5rem;
              color: var(--dark-02);
              line-height: 2;
            }
            .dashboard-tabs {
              display: inherit;
              margin-left: 1rem;

              .dashboarder-header-tab-container {
                margin-top: 0.6rem;
              }
              .idp-dashboard-header-customer-container {
                width: 30rem;
                margin-top: 7px;
              }
            
           
              .el-tabs__nav-wrap::after {
                background-color: transparent;
              }
              .el-tabs__item {
                font-size: var(--font-base);
                color: var(--dark-03);
                font-weight: 400;
                height: 2.25rem;
                line-height: 2.25rem;
              }
              .el-tabs--top .el-tabs__item.is-top:last-child {
                padding-right: 1.25rem;
              }
              .el-tabs__active-bar {
                background-color: var(--brand-04);
              }
            } 
          }

            .idp-dashboard-header-customer-container {
                width: 30rem;
                // margin-top: 7px;
              }
      }
    }
    .dashboard-body::-webkit-scrollbar {
      width: 6px;
      background-color: var(--white);
    }

    .dashboard-body::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px var(--dark-06);
      background-color: var(--white);
    }

    .dashboard-body::-webkit-scrollbar-thumb {
      background-color: var(--dark-05);
    }
  }

  .total-doc-count-wrapper-component {
    margin-top: -2rem;
    margin-bottom: -3rem;
  }
  .processing-time-wrapper-container{
    .echarts {
      height: 260px;
      width: 100%;
    }
  }

  .processing-time-document-by-vendor {
    margin-bottom: 1.5rem;
  }

}

</style>
