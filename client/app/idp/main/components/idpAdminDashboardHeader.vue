<template>
  <div class="idp-admin-dashboard-header">
    <div class="title">Dashboard</div>
    <div class="dashboard-tabs">
      <el-tabs
        v-model="activeName"
        class="dashboarder-header-tab-container"
        @tab-click="handleClick"
      >
        <el-tab-pane label="Last day" name="0"></el-tab-pane>
        <el-tab-pane label="Last 7 days" name="1"></el-tab-pane>
        <el-tab-pane label="Last 30 days" name="2"></el-tab-pane>
        <el-tab-pane label="Last year" name="3"></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "IdpAdminDashboardHeader",
  data() {
    return {
     
    };
  },
  watch: {
    
  },
  computed: {},
  props: {
   
    activeName: {
      default: () => "2",
    },
    config: {
      type: Object,
      default: () => ({}),
    }
  },
  methods: {
    applyFilter(filter) {
      let url = window && window.location && "" + window.location.pathname;
      let splitted = url.split("/app");
      url = splitted.length > 1 ? splitted[1] : url;
      this.$router &&
        this.$router.push({
          path: url,
          query: {
            filter: JSON.stringify(filter || {}),
          },
        });
    },

    applyFilters() {
      let filter = this.findFilter();
      filter["active"] = this.activeName;
      this.applyFilter(filter);
    },

    handleClick(tab) {
      console.log("Tab ", tab);
      if (!tab) {
        this.activeName = "4";
        return;
      }
      this.activeName = tab.name;
      this.applyFilters();
    },

    findFilter() {
      try {
        this.filter = JSON.parse(
          (this.$route && this.$route.query && this.$route.query.filter) || "{}"
        );
      } catch (err) {
        this.filter = {};
      }
      return this.filter;
    },

    initFilter() {
      this.findFilter();
    },
  },
  components: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
  beforeMount() {
    this.initFilter();
  },
};
</script>

<style lang="scss">
@import "../../_idpVariables";

// KP Main

.idp-admin-dashboard-header {
  display: flex;
  justify-content: flex-end;
  border-bottom: var(--border-base) solid var(--dark-07);
  margin-top: var(--space-base);
  .title {
    margin-right: auto;
    padding: 0;
    border: 0;
    font-weight: 600;
    font-size: var(--font-pagetile);
    color: var(--dark-02);
  }
  .dashboard-tabs {
    display: inherit;
    margin-left: 1rem;

    .dashboarder-header-tab-container {
      margin-top: 0.6rem;
    }
    .idp-dashboard-header-customer-container {
      width: 25rem;
      margin-top: 7px;
    }
    .custom-date-picker-container {
      width: 154px;
      border: 0px;
      border-radius: 0px;
      padding: 0px;
      height: 1.9rem;
      margin-top: 0.9rem;
      background: white;

      .el-icon-date {
        display: none;
      }
      .el-range__close-icon {
        margin-bottom: 0.9rem;
      }
      .el-range-separator {
        background: white;
        margin-bottom: 1rem;
      }
      i {
        background: white;
      }
      input {
        width: 40%;
        font-size: var(--font-base);
      }
    }
    .el-tabs__header {
      margin: 0;
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
  } // | tabs
  .more-button {
    margin-left: var(--space-sm);
    position: relative;
    &::before {
      content: "";
      position: absolute;
      height: 32px;
      background: var(--white);
      width: 170%;
      bottom: -2px;
      left: -10px;
    }
    .el-button {
      background: var(--dark-07);
      border-radius: var(--radius-base);
      border: 0;
      font-size: 1.28rem;
      padding: 0.4rem 0.37rem;
      position: relative;
      color: var(--dark-03);
    }
  }
}

.widget-dashboard-select-container {
  z-index: 9999 !important;
  top: 80px !important;
  .el-select__tags {
    max-width: none !important;
  }
}
</style>
