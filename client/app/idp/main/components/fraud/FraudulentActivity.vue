<template>
  <div class="fraudulent-activity-container">
    <el-row :gutter="12" type="flex" justify="space-between" class="activity-container">
      <el-col :span="5">
        <div class="activity-box-container">
          <div class="activity-box-icon invoices-flaggd-pending-icon">
            <span class="mdi mdi-text-box-remove action-btn"></span>
          </div>
          <div class="activity-box-label-value-container">
            <label class="label">Invoices Flagged</label>
            <div class="value">{{ activityValues.invoice_flagged }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="activity-box-container">
          <div class="activity-box-icon invoices-flaggd-pending-icon">
            <span class="mdi mdi-text-box-search action-btn"></span>
          </div>
          <div class="activity-box-label-value-container">
            <label class="label">Pending Review</label>
            <div class="value">{{ activityValues.invoice_pending_review }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="activity-box-container">
          <div class="activity-box-icon invoices-processed-icon">
            <span class="mdi mdi-text-box-check action-btn"></span>
          </div>
          <div class="activity-box-label-value-container">
            <label class="label">Invoices Processed</label>
            <div class="value">{{ activityValues.invoice_processed }}</div>
          </div>
        </div>
      </el-col>

      <el-col :span="5">
        <div class="activity-box-container">
          <div class="activity-box-rejected-icon">
            <doughnut-chart
              class="rejected-fraud-invocie-graph-container"
              :options="invoice_rejected_graph_options"
              :name="'rejected-fraud-invocie-graph-container'"
            ></doughnut-chart>
          </div>
          <div class="activity-box-label-value-container">
            <label class="label">Invoices Rejected</label>
            <div class="value">{{ activityValues.invoice_rejected }}</div>
          </div>
        </div>
      </el-col>

      <el-col :span="5">
        <div class="activity-box-container">
          <div class="activity-box-icon invoices-activity-membership-icon">
            <span class="mdi mdi-currency-usd action-btn"></span>
          </div>
          <div
            class="
              activity-box-label-value-container
              invoices-activity-membership-info
            "
          >
            <label class="label">Fraud Activity</label>
            <div class="value">
              {{ activityValues.growth_in_fraud }} %
              <span
                class="mdi"
                v-bind:class="[getPercentageValueArrowClass(activityValues.growth_in_fraud)]"
              ></span>
            </div>
          </div>
        </div>
      </el-col>

    </el-row>
  </div> 
</template>

<script>
import _ from "lodash";

import IdpChartService from "@/services/IdpChartService";
import moment from "moment-timezone";
import DashboardDrillDownService from "../../../services/DashboardDrillDownService";
import DoughnutChart from "../../charts/DoughnutChart.vue";
import Constants from "@/resources/Constants";

import "echarts/lib/chart/pie";
import "echarts/lib/component/title";

export default {
  components: { DoughnutChart },
  name: "FraudulentActivity",
  props: {
    chartName: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    enableSort: {
      type: Boolean,
      default: false,
    },
    defaultQuery: {
      type: Object,
      default: null,
    },
  },
  watch: {
    defaultQuery: {
      handler: function (newVal, oldval) {
        if (newVal == null) return;
        this.setChartData();
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      chartOptions: {},
      sortValue: 1,
      activityValues: {
        growth_in_fraud: 0,
        growth_in_memberships: 0,
        invoice_flagged: 0,
        invoice_pending_review: 0,
        invoice_processed: 0,
        invoice_rejected: 0,
      },
      reRenderCharts: true,
      invoice_rejected_graph_options: {
        tooltip: {
          show: false,
        },
        title: {
          text: "0 %",
          left: "center",
          top: "center",
          show: true,
          textStyle: {
            color: "#718096",
            fontSize: 9,
          },
        },
        series: [
          {
            label: {
              show: false,
            },

            type: "pie",
            radius: ["80%", "70%"],
            data: [
              {
                value: 0,
                itemStyle: {
                  color: "red",
                },
              },
              {
                value: 100,

                itemStyle: {
                  color: "lightgrey",
                },
              },
            ],
          },
        ],
      },
    };
  },
  methods: {
    getPercentageValueArrowClass(value){
      if(value ==0)return '';
      return value > 0 ? 'mdi-arrow-up': 'mdi-arrow-down';
    },
    onClick(selectedData, errorType) {
      console.log(selectedData + name);
      const pushParams = DashboardDrillDownService.getNavigationRoute(
        selectedData,
        "error_analytics"
      );
      pushParams.query.filter = JSON.parse(pushParams.query.filter);
      if (this.chartName == "topErrorByVendor") {
        pushParams.query.filter.vendor_name = [selectedData.data.name];
      }
      if (this.chartName == "errorsByType") {
        pushParams.query.filter.type = selectedData.data.id;
      }
      pushParams.query.filter = JSON.stringify(pushParams.query.filter);
      this.$router && this.$router.push(pushParams);
    },
    onSortChange(order) {
      this.setChartData();
    },
    setRejectPercentage() {
      this.invoice_rejected_graph_options.series[0].data = [
        {
          value: this.activityValues.percentageRejected,
          itemStyle: {
            color: "red",
          },
        },
        {
          value: 100 - this.activityValues.percentageRejected,
          itemStyle: {
            color: "lightgrey",
          },
        },
      ];
      this.invoice_rejected_graph_options.title.text =
        this.activityValues.percentageRejected + "%";
    },
    async setChartData() {
      let apiQuery = {
        chart_name: "fraudulentActivity",
        query: _.cloneDeep(this.defaultQuery) || {},
        sort_order: this.sortValue,
        time_zone: moment.tz.guess(),
      };
      let response = await IdpChartService.getFraudAnalyticsChartData(apiQuery);
      this.activityValues = { ...this.activityValues, ...response };
      this.setRejectPercentage();
      this.$store.commit('dashboardStore/setdashboardComponentStatus','fraudulentActivity');
    },
  },
};
</script>

<style lang="scss">
@import "../../../_idpGlobal";

.fraudulent-activity-container {
  margin-top: var(--space-xl);

  .fraudelent-activity-bloack-heading {
    background: whitesmoke;
    margin-bottom: 2rem;
    margin-top: 2rem;
  }

  .activity-container {
    .activity-box-container {
      background: var(--white);
			border-radius: var(--radius-lg);
			box-shadow: rgba(99, 99, 99, 0.05) 0px 2px 8px 0px;
			height: 4.5rem;
      padding: var(--space-base);
    }
    // .el-col {

      
    // }
    .activity-box-container {
      display: flex;
      padding: 0.5rem;

      .rejected-fraud-invocie-graph-container {
        .echarts {
          height: 50px;
          width: 50px;
          margin-right: .7rem;
        }
      } 

      .activity-box-icon {
        border-radius: 23px;
        font-size: 1.9rem;
        border-width: 1rem;
        border: 0px solid var(--dark-07);
            height: 5rem;
        width: 5rem;
        border-radius: var(--radius-round);
      }
      .activity-box-rejected-icon {
        flex: 2;
      }
      .invoices-flaggd-pending-icon {
        color: var(--brand-05);
        font-size: 2.6rem;
        line-height: 4.5rem;
      }
      .invoices-activity-membership-icon {
        color: var(--red-04);
        font-size: 2.6rem;
        line-height: 4.5rem;
      }
      .invoices-processed-icon {
        color: var(--green-04);
        font-size: 2.6rem;
        line-height: 4.5rem;
      }
      .activity-box-label-value-container {
        flex: 7;
        text-align: left;
        margin-left: .7 !important;

        .label {
          font-size: var(--font-base-1);
          color: var(--dark-04);

          margin-top: .7rem;
          display: block;
        }
        .value {
          font-size: var(--font-lg-max);
          font-weight: 700;
          color: var(--dark-03);
          line-height: 1.4rem;
        }
      }
      .invoices-activity-membership-info {
        .label {
          font-size: var(--font-base-1);
          color: var(--dark-04);
        }
        .value {
          // font-size: var(--font-lg);
          font-weight: 700;
        }
      }
    }
  }
  .heading {
    text-align: center;
    font-size: 1.6rem;
  }
  .activity-container {
    text-align: center;
    font-size: 1.2rem;
  }
  .trends-container {
    text-align: center;
    font-size: 1.2rem;
  }
}
</style>
