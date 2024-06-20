<template>
  <div
    class="grid-content bg-purple top-right-graph active-user"
    v-bind:style="!isAdmin ? 'min-height: 380px;' : '' "
  >
    <el-row :gutter="20">
      <el-col :span="10">
        <div class="dashboard-section-label">Commands</div>
      </el-col>
      <el-col class="customer-select" :span="8">
        <el-select placeholder="Select Bot" v-model="customer_id" @change="onSelect($event)">
          <el-option
            v-for="customer in customers"
            v-bind:value="customer._id"
            :key="customer._id"
            :label="customer.customer_name"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>

    <el-tabs type="border-card">
      <el-tab-pane class="chart-tab">
        <span slot="label">Day</span>
        <line-chart
          :params="chartParams.data.day"
          :label="chartParams.label"
          class="stackedBarChart"
        ></line-chart>
      </el-tab-pane>
      <el-tab-pane class="chart-tab">
        <span slot="label">Week</span>
        <line-chart
          :params="chartParams.data.week"
          :label="chartParams.label"
          class="stackedBarChart"
        ></line-chart>
      </el-tab-pane>
      <el-tab-pane class="chart-tab">
        <span slot="label">Month</span>
        <line-chart
          :params="chartParams.data.month"
          :label="chartParams.label"
          class="stackedBarChart"
        ></line-chart>
      </el-tab-pane>
      <el-tab-pane class="chart-tab">
        <span slot="label">Year</span>
        <line-chart
          :params="chartParams.data.year"
          :label="chartParams.label"
          class="stackedBarChart"
        ></line-chart>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import AjaxService from "../../services/AjaxService";
import LineChart from "../../components/Dashboard/LineChart.vue";
import { _ } from "vue-underscore";

export default {
  name: "CommandChart",
  props: ["isAdmin", "customers"],
  data() {
    return {
      customer_id: "all",
      chartParams: { data: "", label: "Command Users" }
    };
  },
  components: {
    LineChart
  },
  methods: {
    onSelect() {
      this.getCommands();
    },
    getCommands() {
      let params = { ids: [this.customer_id] };

      if (this.customer_id == "all") {
        params.ids = [];
        for (let customer in this.customers) {
          if (this.customers[customer]._id != "all")
            params.ids.push(this.customers[customer]._id);
        }
      }

      AjaxService.getJson(
        "/portal/api/customer-commands",
        params,
        (error, res) => {
          if (error) return;
          this.chartParams = Object.assign(this.chartParams, {
            data: res.data.response
          });
        }
      );
    }
  },
  watch: {
    customers: {
      handler: function(newVal, oldval) {
        if (newVal && newVal.length) {
          this.getCommands();
          return;
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    myComputedWidth() {
      let status = "success";
      this.remainingCount = this.allowedUsers - this.activeUsers;
      if (this.activeUsers > this.allowedUsers) {
        status = "exception";
      }
      let resisterUserPercentage = Math.round(
        (this.activeUsers / this.allowedUsers) * 100
      );
      return {
        registeredUserPercentage: resisterUserPercentage
          ? resisterUserPercentage
          : 0,
        remaining: Math.round((this.remainingCount / this.allowedUsers) * 100),
        status
      };
    }
  },
  created() {},
  beforeMount() {}
};
</script>
<style lang="scss">
// .registered-container {

// }

.chart-tab {
  height: 284px !important;
}

.el-progress-bar__inner {
  border-radius: 0 !important;
}

.progress-bar {
  padding-left: 18px;
  padding-right: 18px;
  box-sizing: border-box;
  // position: absolute;
  // bottom: 40px;
  width: 100%;
  .el-progress-bar__outer {
    border-radius: 5px;
    background: #fff;
    border: 0.5px solid #a5b4c3;
  }
}

.el-progress.is-success .el-progress-bar__inner {
  background-color: #a1dd70;
}

.customer-select {
  text-align: right;
  .el-select {
    padding-top: 10px;

    input {
      height: 26px;
    }
    i {
      margin-top: 7px;
    }
  }
}
</style>


