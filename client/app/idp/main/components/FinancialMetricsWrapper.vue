<template>
   <!-- <div class="avg-time-chart-container dashboard-cards"> -->
   <div class="dashboard-cards">
     <el-row type="flex" class="graph-toolbar-container">
        <el-col :span="20" class="title-container">
          <div class="header">Financial Metrics</div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
            <div class="financial-metrics-wrap">
              <ul>
                <li>
                  <div>
                    <span class="title">Total Invoice Amount</span>
                    <p class="value">{{ totalInvoiceAmt.value }}</p>
                  </div> 
                  <!-- <div class="currency">$</div> -->
                </li>
                <li v-if="isVendorUser()">
                  <div>
                    <span class="title">Total Paid Amount</span>
                    <p class="value">{{ totalPaidAmt.value }}</p>
                  </div> 
                  <!-- <div class="currency">$</div> -->
                </li>
                <li v-if="!isVendorUser()" class="potential-dis">
                  <div>
                    <span class="title">Potential Discount Amount</span>
                    <p class="value">{{ totalInboxDiscountAmount.value }}</p>
                  </div> 
                  <!-- <div class="currency">$</div> -->
                </li>
                <li v-if="!isVendorUser()">
                  <div>
                    <span class="title">Realized Discount Amount</span>
                    <p class="value">{{ totalPublishedDiscountAmount.value }}</p>
                  </div> 
                  <!-- <div class="currency">$</div> -->
                </li>
              </ul>
            </div>
        </el-col>
      </el-row>
   

    <!-- <div class="financial-metrics-graph" >
      <el-row class="first-row">
        <el-col :span="8" class="processing-time">
          <span class="title">Total Invoice Amount</span>
          <h1 class="content average-processing-value">
            {{ totalInvoiceAmt.value }}
          </h1>
        </el-col>

        <el-col :span="8" class="processing-time">
          <span class="title">Potential Discount Amount</span>
          <h1 class="content average-processing-value">
            {{ totalInboxDiscountAmount.value }}
          </h1>
        </el-col>

        <el-col :span="8" class="processing-time">
          <span class="title">Realized Discount Amount</span>
          <h1 class="content average-processing-value">
            {{ totalPublishedDiscountAmount.value }}
          </h1>
        </el-col>
      </el-row>
    </div> -->

  </div>
</template>

<script>
import IdpChartService from "@/services/IdpChartService";
import { formatToUSDCurrency } from "@/util/CommonUtil";
import _ from "lodash";
import store from "@/store/store";

export default {
  name: "FinancialMetricsWrapper",
  data() {
    return {
      totalInvoiceAmt: {value:""},
      totalPaidAmt: {value:""},
      totalInboxDiscountAmount: {value:""},
      totalPublishedDiscountAmount: {value:""},
    };
  },
  props: ["span","defaultQuery"],
  computed: {},
  methods: {
    async init(){
      const chartResult = await IdpChartService.getChartData({
          chart_name: "FinancialMetricsWrapper",
          query: this.defaultQuery || {}
      });
      const totalInvoiceAmount = _.get(chartResult, "total_invoice_amount[0].totalInvoiceAmount", 0);
      // currencyFormat convert 120000 to 12K
      this.totalInvoiceAmt = { value : formatToUSDCurrency(totalInvoiceAmount) };

      const totalPaidAmount = _.get(chartResult, "total_paid_amount[0].paidInvoiceAmount", 0);
      // currencyFormat convert 120000 to 12K
      this.totalPaidAmt = { value : formatToUSDCurrency(totalPaidAmount) };

      const inboxDiscountAmount = _.get(chartResult, "total_discount_amount.data.inInbox", 0);
      this.totalInboxDiscountAmount = { value : formatToUSDCurrency(inboxDiscountAmount) };
      
      const publishedDiscountAmount = _.get(chartResult, "total_discount_amount.data.inPublish", 0);
      this.totalPublishedDiscountAmount = { value : formatToUSDCurrency(publishedDiscountAmount) };
      this.$store.commit('dashboardStore/setdashboardComponentStatus','FinancialMetricsWrapper');
    }
  },
  components: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
  beforeMount() {
    this.init();
  },
};
</script>

<style lang="scss">
@import "../../_idpGlobal";

.financial-metrics-wrap {
  padding: var(--space-base) var(--space-xl);
    ul {
      list-style: none;
      padding: 0;
        li {
          // border-bottom: 1px dashed var(--dark-05-5);
          display:flex;
          justify-content:flex-end;
          align-items: center;
          padding: 0.5rem 0;
          margin: var(--space-xs) 0;
            div:first-child {
                margin-right:auto;
            }
            .title {
              font-size: var(--font-base);
              color: var(--dark-04);
              display: block;
              line-height: 1.4;
            }
            .value {
              font-weight: 700;
              // font-size: var(--font-xxxl);
              font-size: 4rem;
              color: var(--green-03);
              margin: 0;
              padding: 0;
              line-height: 1;
              display: flex;
              align-items: baseline;
                span {
                  font-size: var(--font-lg-max);
                  font-weight: 500;
                  margin-left: var(--space-sm);
                }
            }
            .currency {
              background: var(--green-09);
              color: var(--green-03);
              font-weight: 500;
              font-size: 1.5rem;
              border-radius: var(--radius-round);
              width: 2.9rem;
              height: 2.9rem;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            &:last-child {
              border: 0;
            }
        }
        li.potential-dis {
            color: var(--red-03);
              .title, .value {
                color: var(--red-03);
              }
              .currency {
                background: var(--red-09);
                color: var(--red-03);
              }
        }
    }
}
</style>