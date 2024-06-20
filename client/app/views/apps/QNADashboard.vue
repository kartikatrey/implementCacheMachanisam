<template>
  <div class="page-dashboard">
    <el-row class="system-count-container" :gutter="20">
      <el-col :span="24">
        <el-row :span="24">
          <command-chart :customers="customers" :isAdmin="false"></command-chart>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="grid-content bg-purple count-container">
          <div class="top-left-values">
            <div class="dashboard-section-label">Commands (Digital assistant)</div>
            <div class="users-count">
              <span class="counter">{{allStatement}}</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple count-container">
          <div class="top-left-values">
            <div class="dashboard-section-label">Week</div>
            <div class="users-count">
              <span class="counter">{{oneWeek}}</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple count-container">
          <div class="top-left-values">
            <div class="dashboard-section-label">Month</div>
            <div class="users-count">
              <span class="counter">{{oneMonth}}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import AjaxService from "../../services/AjaxService";
import commandChart from "../../components/Dashboard/CommandChart.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import _ from "lodash";

export default {
  name: "Dashboard",
  data() {
    return {
      allStatement: "",
      oneWeek: "",
      oneMonth: "",
      customers: [],
      isAdmin: true
    };
  },
  computed: {},
  components: {
    commandChart,
    VuePerfectScrollbar
  },
  methods: {
    getStatementCount(customers) {
      let params = { ids: [] };
      for (let customer in customers) {
        if (customers[customer]._id != "all")
          params.ids.push(customers[customer]._id);
      }

      AjaxService.getJson(
        "/portal/api/statements-customers",
        params,
        (error, res) => {
          if (error) return;
          let sysData = res.data;
          this.allStatement = sysData.all_statement || 0;
          this.oneWeek = sysData.week_count || 0;
          this.oneMonth = sysData.month_count || 0;
        }
      );
    },
    getCustomers() {
      AjaxService.getJson(
        "/portal/api/digital-assistant-customer",
        null,
        (error, res) => {
          if (error) return;
          let customers = res.data.response || [];
          customers.unshift({ _id: "all", customer_name: "All" });
          this.customers = customers;
          this.getStatementCount(customers);
        }
      );
    }
  },
  beforeMount() {
    // call the api and get all the data and populate
    this.getCustomers();
  }
};
</script>

<style lang="scss">
.DA {
  margin-bottom: 12px;
}

.system-count-container {
  margin-bottom: 2px !important;
  .el-row {
    margin-bottom: 12px !important;
  }
}
.center-align {
  text-align: center;
}
.page-dashboard {
  overflow-y: auto !important;
}

.transaction-chart {
  height: 375px;
}

.barChart canvas {
  width: 100% !important;
  height: 300px !important;
  position: relative;
}

.stackedBarChart {
  height: 300px;
}

.stackedBarChart canvas {
  width: 100% !important;
  height: 300px !important;
  position: relative;
}

.doughnutChart canvas {
  width: 100% !important;
  position: relative;
  height: 278px !important;
}

.commands-nalysis-container {
  .stackedBarChart canvas {
    width: 100% !important;
    height: 315px !important;
    position: relative;
    // margin-left: -27px !important;
  }
}

.radio-switcher {
  display: inline-block;
  float: right;
  margin-right: 16px;

  .el-radio-button__inner {
    padding: 6px;
    font-size: 12px;
  }
}

.page-dashboard {
  .chart-container,
  .registrations-container,
  .topUsers-container {
    .page-vue-good-table {
      box-shadow: none !important;
    }

    .vue-good-table-box {
      padding: 16px;
    }

    // th {
    //   color: #56a6f1 !important;
    // }
  }

  .el-row {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #ffffff;
  }

  .bg-oranges {
    background: #56f19a;
    color: #ffffff;
  }

  .bg-oranges-2 {
    background: #a1dd70;
    color: #ffffff;
  }

  .bg-oranges-3 {
    background: #97cf6a;
    color: #ffffff;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 5px;
    min-height: 84px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    position: relative;
  }

  .registered-container {
    min-height: 135px !important;

    .users-count {
      margin-top: -12px;
    }
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .grid-content-sub {
    border-radius: 5px;
    min-height: 36px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  }

  .systems-container {
    height: 135px !important;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  }

  .top-left-values {
    // height: 97px;
  }

  .top-left-values-big {
    height: 190px;
  }

  .dashboard-section-label {
    font-weight: 700;
    padding-left: 16px;
    padding-top: 8px;
  }

  .counter {
    font-size: 31px;
    font-weight: bold;
    padding-left: 16px;
    margin-top: 10px;
  }

  .vb-content {
    padding: 0 20px;
    box-sizing: border-box !important;
    margin-top: -5px;
    margin-left: -20px;
    margin-right: -20px;
    height: calc(100% + 15px) !important;
    width: calc(100% + 40px) !important;
  }

  canvas {
    // position: relative;
  }

  .top-right-graph {
    position: relative;
  }

  //Active users style
  .command-system-container {
    overflow: hidden;

    .stackedBarChart {
      margin-top: -16px;
    }
  }

  .el-tabs--border-card {
    border: 0;
    box-shadow: none;
    overflow: hidden;

    .el-tabs__header {
      position: absolute;
      right: 16px;
      top: 10px;
      background-color: #fff;
      border-bottom: 0;

      .el-tabs__nav {
        overflow: hidden;
      }

      .el-tabs__nav {
        border: 0.5px solid rgba(112, 112, 112, 0.5);
        border-radius: 3px;
      }

      .el-tabs__item {
        pointer-events: auto;
        height: 25px;
        line-height: 25px;
        padding: 0 12px;
        font-size: 12px;
        border-left: 0;
        border-right: 0;
      }

      .is-active {
        background-color: rgba(0, 93, 166, 1) !important;
        color: #fff !important;
        border-left: 0;
        border-right: 0;
      }
    }
  }

  // endActive users style

  .commands-container {
    canvas#doughnut-chart {
      height: 278px !important;
    }
  }
}

@media (max-width: 768px) {
  .page-dashboard {
    .vb-content {
      padding: 0 5px !important;
      margin: -5px;
      width: calc(100% + 10px) !important;
    }
  }
}
</style>
