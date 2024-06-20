<template>
 <el-tooltip open-delay="500" class="item" :disabled="clonedDate.label ? false:true" effect="light" :content="clonedDate.label" placement="left">
  <el-popover
    v-model="showCalendar"
    offset="5"
    popper-class="kp-popover-daterangepicker"
    width="350"
    placement="bottom"
    trigger="click"
  >
    <div class="daterange" v-if="showCalendar">
      <el-row :gutter="10" class="date-legend">
        <el-col :span="12" class="from"> From </el-col>
        <el-col :span="11" class="to"> To </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="24">
          <el-date-picker
            cid="daterange-value"
            @change="handleDateChange"
            v-model="clonedDate.value"
            type="datetimerange"
            range-separator="-"
            start-placeholder="Start month"
            end-placeholder="End month"
          >
          </el-date-picker>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-button
            v-if="date_filters.includes('yesterday')"
            size="small"
            cid="daterange-yesterday"
            :type="clonedDate.name == 'yesterday' ? 'primary' : ''"
            @click="setDate('yesterday')"
            >Yesterday</el-button
          >
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-button
          v-if="date_filters.includes('this_month')"
            size="small"
            cid="daterange-this-month"
            :type="clonedDate.name == 'this_month' ? 'primary' : ''"
            @click="setDate('this_month')"
            >This month</el-button
          >
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-button
          v-if="date_filters.includes('past_month')"
            size="small"
            cid="daterange-past-month"
            :type="clonedDate.name == 'past_month' ? 'primary' : ''"
            @click="setDate('past_month')"
            >Past month</el-button
          >
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-button
          v-if="date_filters.includes('past_3_months')"
            size="small"
            cid="daterange-past-2-month"
            :type="clonedDate.name == 'past_3_months' ? 'primary' : ''"
            @click="setDate('past_3_months')"
            >Past 3 months</el-button
          >
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-button
            v-if="date_filters.includes('all_time')"
            size="small"
            cid="daterange-all-time"
            :type="clonedDate.value == '' ? 'primary' : ''"
            @click="clearDate()"
            >All time</el-button
          >
        </el-col>
      </el-row>

<!-- new added -->
      <el-row :gutter="10">
        <el-col :span="24">
          <el-button
            v-if="date_filters.includes('last_7_days')"
            size="small"
            cid="daterange-last-7-days"
            :type="clonedDate.name == 'last_7_days' ? 'primary' : ''"
            @click="setDate('last_7_days')"
            >Last 7 days</el-button
          >
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-button
            v-if="date_filters.includes('last_30_days')"
            size="small"
            cid="daterange-last-30-days"
            :type="clonedDate.name == 'last_30_days' ? 'primary' : ''"
            @click="setDate('last_30_days')"
            >Last 30 days</el-button
          >
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="date_filters.includes('subscription_to_ytd')">
        <el-col :span="24">
          <el-button
            size="small"
            cid="daterange-subscription-to-ytd"
            :type="clonedDate.name == 'subscription_to_ytd' ? 'primary' : ''"
            @click="setDate('subscription_to_ytd')"
            >Subscription to YTD</el-button
          >
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-button
            v-if="date_filters.includes('last_year')"
            size="small"
            cid="daterange-last-year"
            :type="clonedDate.name == 'last_year' ? 'primary' : ''"
            @click="setDate('last_year')"
            >Last year</el-button
          >
        </el-col>
      </el-row>

    </div>
    <el-button
      class="date-filter"
      size="small"
      slot="reference"
      cid="daterange-show-calender"
      style="display: inline-block"
    >
      <span class="label">{{ clonedDate.label }}</span>
      <div class="arrow-down"></div>
    </el-button>
  </el-popover>
  </el-tooltip>
</template>

<script>
import _ from "lodash";
import lodash from "lodash";
import moment from "moment";
export default {
  name: "DaterangePicker",
  props: ["date","date_filters","subscriptionStartDate", "isCustomTime"],
  data() {
    return {
      showCalendar: false,
      clonedDate: {
        name: "",
        label: "",
        value: "",
      },
      dateFormat: "YYYY-MM-DDTHH:mm:ss",
      durationToDayMapping: {
        yesterday: {
          label: "Yesterday",
          value: 1,
          start_date: moment()
            .subtract(1, "day")
            .startOf("day")
            .utc()
            .format(this.dateFormat),
          end_date: moment()
            .subtract(1, "day")
            .endOf("day")
            .utc()
            .format(this.dateFormat),
        },
        past_month: {
          label: "Past month",
          value: 30,
          start_date: moment()
            .subtract(1, "months")
            .startOf("months")
            .startOf("day")
            .utc()
            .format(this.dateFormat),
          end_date: moment()
            .subtract(1, "months")
            .endOf("month")
            .endOf("day")
            .utc()
            .format(this.dateFormat),
        },
        past_3_months: {
          label: "Past 3 months",
          value: 90,
          start_date: moment()
            .subtract(3, "months")
            .startOf("months")
            .startOf("day")
            .utc()
            .format(this.dateFormat),
          end_date: moment()
            .subtract(1, "months")
            .endOf("month")
            .endOf("day")
            .utc()
            .format(this.dateFormat),
        },
        this_month: {
          label: "This month",
          start_date: moment()
            .startOf("month")
            .startOf("day")
            .utc()
            .format(this.dateFormat),
          end_date: moment().utc().format(this.dateFormat),
        },
        last_7_days: {
          label: "Last 7 days",
          value: 7,
          start_date: moment()
            .subtract(7, "days")
            .startOf("day")
            .utc()
            .format(this.dateFormat),
          end_date: moment()
            .endOf("day")
            .utc()
            .format(this.dateFormat),
        },
        last_30_days: {
          label: "Last 30 days",
          value: 30,
          start_date: moment()
            .subtract(30, "days")
            .startOf("day")
            .utc()
            .format(this.dateFormat),
          end_date: moment()
            .endOf("day")
            .utc()
            .format(this.dateFormat),
        },
        subscription_to_ytd : {
          label: "Subscription to YTD",
          value: "",
          start_date: "",
          end_date: moment()
            .endOf("day")
            .utc()
            .format(this.dateFormat),
        },
        last_year: {
          label: "Last year",
          value: 365,
          start_date: moment()
            .subtract(1, "year")
            .startOf("day")
            .utc()
            .format(this.dateFormat),
          end_date: moment()
            .endOf("day")
            .utc()
            .format(this.dateFormat),
        },
      },
    };
  },
  computed: {
    currentDashboard:{
      get() {
        return this.$store.state.dashboardStore.currentDashboard;
      }
    },
  },
  methods: {
    clearDate() {
      this.clonedDate = {
        name: "",
        label: "All time",
        value: "",
      };
      this.updateValue();
    },

    setDate(name) {
      this.setLabelAndValue(name);
      this.updateValue();
    },

    setLabelAndValue(name) {
      // this.clonedDate.value = _.isArray(name) ? name : this.getDateRange(name);
      if (_.isArray(name)) {
        this.clonedDate.value = this.getDateRange(name);
        this.clonedDate.label = "Custom range";
        this.clonedDate.name = name;
        return;
      }
      this.clonedDate.value = this.getClonedDateValue(name);
      this.clonedDate.label = this.durationToDayMapping[[name]].label;
      this.clonedDate.name = name;
    },

    getClonedDateValue(name) {
      let startDate = this.durationToDayMapping[name].start_date;
      //If current filter is "Subscription to YTD" then, startDate would be subscriptionStartDate
      if (name == "subscription_to_ytd") {
        startDate = this.subscriptionStartDate;
      }
      return [
        startDate,
        this.durationToDayMapping[name].end_date,
      ];
    },

    getDateRange(duration) {
      if (!duration || !duration.length) {
        return [
          moment().subtract(1, "day"),
          moment().endOf("day")
        ];
      }
      return [
        moment(duration[0]),
        moment(duration[1])
      ];
    },

    updateValue() {
      this.showCalendar = false;
      this.$emit("update:date", this.clonedDate);
      this.$emit("applyDateFilter");
    },

    handleDateChange() {
      if (lodash.isEmpty(this.clonedDate.value)) {
        this.clearDate();
        return;
      }
      this.clonedDate.label = "Custom range";
      this.clonedDate.name = this.clonedDate.value;
      this.updateValue();
    },
  },

  mounted() {
    let name = this.date.name;
    this.clonedDate = lodash.cloneDeep(this.date);
    !_.isEmpty(this.clonedDate.name)
      ? this.setLabelAndValue(name)
      : (this.clonedDate = {
          name: "",
          label: "All time",
          value: "",
        });
  },
};
</script>

<style lang="scss">
.daterange {
  div.date-legend {
    padding: 0px;
    margin: 0px;

    .from {
      text-align: left;
      padding: 0px 0px 0px 0px;
      margin: 0px 0px 4px 4px;
    }

    .to {
      text-align: left;
      padding: 0px 0px 0px 0px;
      margin: 0px 0px 4px 4px;
    }
  }

  .el-date-editor {
    padding: 0px;
    border: none;

    i {
      display: none;
    }

    span.el-range-separator {
      padding: 0 2px;
      // padding: 0px 4px 0px 4px;
      text-align: center;
    }

    .el-range-input {
      line-height: 1;
      width:50%;
      box-shadow: 1px;
      border: 1px solid #dcdfe6;
      padding: 0px;
      padding-left: 5px;
      padding-right: 5px;
      border-radius: 4px;
      height: 2rem;
    }
  }

  button {
    width: 100%;
  }

  .el-row {
    margin-bottom: 8px;
    text-align: center;
  }

  .el-date-editor .el-range-separator {
    padding: 0px 8px 8px 8px;
  }
}
</style>
