<template>
  <div class="dashboard-cards touched-untouched-published-docs">
    <!-- Graph toolbar container with title and filters -->
    <el-row class="graph-toolbar-container">
      <!-- Title container -->
      <el-col :span="10" class="title-container">
        <el-tooltip effect="light" content="Published documents by modified fields" placement="bottom">
          <a class="header" @click="handleWidgetTitleClick">{{ widgetTitle }}</a>
        </el-tooltip>  
      </el-col>

      <!-- Filter toolbar with a dropdown for selecting business units -->
      <el-col :span="14" class="filter-toolbar">
        <el-select
          v-model="selectedBU"
          multiple
          collapse-tags
          filterable
          placeholder="Select Business unit"
          @change="setChartData"
          popper-class="dashboard-select"
        >
          <el-option
            class="dashboard-select-options"
            v-for="item in businessUnitOptions"
            :key="item.value"
            :label="item.label.length < 17 ? item.label : item.label.substr(0, 17)"
            :value="item.value"
          >
            <span
              v-if="item.label.length < 17"
              class="businessUnit-selection-list-item"
              style="float: left"
            >
              {{ item.label }}
            </span>

            <!-- Popover for long business unit names -->
            <el-popover
              :open-delay="200"
              :close-delay="0"
              popper-class="dropdown-popover"
              placement="left"
              v-else
              trigger="hover"
              :content="item.label"
            >
              <span
                class="businessUnit-selection-list-item"
                style="float: left"
                slot="reference"
              >
                {{ item.label }}
              </span>
            </el-popover>
          </el-option>
        </el-select>
      </el-col>
    </el-row>

    <!-- Chart container -->
    <el-row>
      <el-col>
        <el-dialog
          :visible.sync="isDialogVisible"
          class="publish-doc-wrapper"
        >
          <div class="dialog-content">
            <data-table class="publish-doc-table"
              :parameters="tableParams"
            ></data-table>
          </div>            
        </el-dialog>
        <doughnut-chart
          :options="options"
          :name="'touched-untouched-published-docs'"
          @onClick="handleChartClick"
        ></doughnut-chart>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DoughnutChart from "../charts/DoughnutChart.vue";
import IdpChartService from "@/services/IdpChartService";
import DashboardDrillDownService from "../../services/DashboardDrillDownService";
import Constants from "@/resources/Constants";
import DocumentService from "@/idp/services/DocumentService";
import _ from "lodash";
import DataTable from "../../../components/DataTable.vue";
import IdpDashboardService from "@/idp/services/IdpDashboardService";

export default {
  name: "PublishedTouchedUntouchedDocuments",
  props: {
    widgetTitle: {
      type: String,
      default: "",
    },
    defaultQuery: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      businessUnitOptions: [],
      selectedBU: [],
      documentCountByModifiedFields:[],
      isDialogVisible: false,
      tableParams: {
        apiName: "/portal/api/documents-by-modified-fields?action=getTableData",
        showPaginationOptions: false,
        tableName: "documentsByModifiedFields",
        isRestify: false,
        tableMode: "static",
        showSortOptions: false,
        customfilter: false,
        enableGroupFilter: false,
        enableExport: true,
        globalSearch: false,
        pageTitle: "Published Documents By Modified Fields",
        queryParam: {},
        customExportEndpoint: "/portal/api/documents-by-modified-fields"
      },
      options: {
        label: {
          position: "center",
        },
        title: {
          text: "",
          left: "center",
          top: "center",
          show: true,
          textStyle: {
            color: "#718096",
            fontSize: 10,
            fontWeight: 800,
          },
        },
        grid: {
          left: "8%",
          right: "8%",
          bottom: "0%",
          top: "12%",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
          textStyle: {
            color: "#718096",
          },
        },
        series: [
          {
            selectedMode: "single",
            name: "",
            type: "pie",
            radius: ["40%", "60%"],
            center: ["50%", "50%"],
            label: {
              formatter: "{b|{b}}   {c|{c}}",
              rich: {
                a: {
                  color: "#999",
                  lineHeight: 22,
                  align: "center",
                  fontSize: 10,
                },
                b: {
                  fontSize: 10,
                  lineHeight: 33,
                  color: "#718096",
                },
                c: {
                  fontSize: 10,
                  lineHeight: 33,
                  fontWeight: 900,
                  color: "#4A5568",
                },
                pear: {
                  as: "{per|o} ",
                  fontWeight: 900,
                  fontSize: 10,
                  borderRadius: 1000,
                },
              },
            },
            data: [],
          },
        ],
      },
    };
  },
  components: {
    DoughnutChart,DataTable
  },
  methods: {
    // Display Modified field's dialog on click of widget title
    async handleWidgetTitleClick(){
      this.isDialogVisible=true
      let dashboardFilters = IdpDashboardService.getCurrentDashboardFilters();
      // remove doctype - summary
      if (dashboardFilters.document_type =="summary") { dashboardFilters = _.omit(dashboardFilters, ["document_type"]); } 
      // Adding dashboard filters to the tableparams
      this.tableParams.queryParam = { ...dashboardFilters };
      // Add business unit filter if business units are selected
      if (this.selectedBU.length > 0) {
          this.tableParams.queryParam = {
              ...this.tableParams.queryParam,
              business_unit: { $in: this.selectedBU }
          };
      }
    },

    // Handle drill-down for the chart
    handleChartClick(selectedData) {
      // Check if drill down is allowed for the widget
      if (!DashboardDrillDownService.isDrillDownAllowedForWidget()) {
        return;
      }
      // Get navigation route parameters for drill down
      const pushParams = DashboardDrillDownService.getNavigationRoute(
        selectedData,
        "published_touched_untouched_documents"
      );
      // Add business unit filter if business units are selected
      if (this.selectedBU.length > 0) {
        pushParams.query.filter = JSON.parse(pushParams.query.filter);
        pushParams.query.filter["secondary"]["business_unit"] = {
          $in: this.selectedBU,
        };
        pushParams.query.filter = JSON.stringify(pushParams.query.filter);
      }
      // Navigate to the drill down route
      this.$router && this.$router.push(pushParams);
    },

    // Fetch unique business units
    async getBusinessUnits() {
      const payload = { action: "get_unique_bu" };
      const uniqueBusinessUnits = await DocumentService.getBusinessUnit(payload);
      this.prepareOptions(uniqueBusinessUnits);
    },

    // Prepare options for the business units dropdown
    prepareOptions(businessUnits) {
      // By default all business units will be selected
      this.selectedBU = businessUnits;
      this.businessUnitOptions = businessUnits.map((businessUnit) => {
        return {
          value: businessUnit,
          label: businessUnit,
        };
      });
    },

    // Fetch and set chart data
    async setChartData() {
      let chartData = [];
      let apiQuery = {
        chart_name: "PublishedTouchedUntouchedDocuments",
        query: _.cloneDeep(this.defaultQuery) || {},
      };
      // Add business unit filter in the query if business units are selected in the dropdown
      if (this.selectedBU.length) {
        apiQuery.query.business_unit = { $in: this.selectedBU };
      }

      const chartResult = await IdpChartService.getChartData(apiQuery);

      // Color map for the dark theme
      const kanvTheme = this.$store.getters.selectedTheme;
      const docProcessedSystemColorMap =
        Constants.DOCEX.IDP_DASHBOARD[
          `PUBLISHED_TOUCHED_UNTOUCHED_DOC_COLOR__${kanvTheme}`
        ];

      // Handle the case when no chart data is returned
      if (!chartResult) {
        chartData = [{ value: 0, name: "No data found" }];
        this.options.title.text = `Total\n0`;
        this.options.series[0].data = chartData;
        return;
      }

      // Set the total count in the chart title
      const totalCount = chartResult.totalCount || 0;
      this.options.title.text = `Total\n${totalCount.toString()}`;

      // Prepare the chart data with touched and untouched documents
      ["touched", "untouched"].forEach((key) => {
        const value = chartResult[key] || 0;
        const label = key;
        const name = key === "touched" ? "Touched" : "Untouched";
        const color = docProcessedSystemColorMap[name] || "";
        chartData.push({ value, label, name, itemStyle: { color } });
      });

      this.options.series[0].data = chartData;

      // Set the chart colors 
      DashboardDrillDownService.setPublishedTouchedUntouchedDocumentsColor(
        this.options
      );
      this.$store.commit(
        "dashboardStore/setdashboardComponentStatus",
        "PublishedTouchedUntouchedDocuments"
      );
    },
  },
  beforeMount() {
    // Fetch and set chart data and business units before mounting the component
    this.setChartData();
    this.getBusinessUnits();
  },
};
</script>

<style lang="scss">
.touched-untouched-published-docs {

  .publish-doc-wrapper{
    .el-dialog{
      width: 800px;
      padding: 1rem 2rem 2rem 2rem;
    }
  }

  .dialog-content {
    max-height: 500px; /* Fixed height for the dialog content */
    // overflow-y: auto; /* Enable vertical scrollbar when content exceeds the height */

    .publish-doc-table{
      max-height: 500px; /* Fixed height for the dialog content */
      .vue-good-table-box{
        max-height: 400px; /* Fixed height for the dialog content */
        overflow-y: auto;
      }
    }
  }

  .echarts {
      /* Add necessary styles for your chart container */
      height: 23.5rem;
      width: auto;
  }

  .header {
      text-align: center;
  }

  .graph-toolbar-container .filter-toolbar .el-input__inner {
      border: 1px solid var(--dark-07);
  }

  .graph-toolbar-container .filter-toolbar input {
      border: 0px;
      font-size: var(--font-base);
      text-align: left;
      color: var(--dark-04);
      font-weight: 400;
  }

  .graph-toolbar-container .filter-toolbar input::placeholder {
      color: var(--dark-04);
  }

  .graph-toolbar-container .filter-toolbar .el-select__caret {
      color: var(--dark-01);
  }

  .graph-toolbar-container .filter-toolbar .el-input--suffix .el-input__inner {
      padding-right: 23px;
      height: 26px !important;
  }

  .dashboard-select .businessUnit-selection-list-item {
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 14rem;
  }

}
</style>
