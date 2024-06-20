<template>
  <div class="doc-by-vendors-wrapper-container dashboard-cards">
    <!-- Graph Header -->
    <el-row type="flex"  class="graph-toolbar-container">
      <el-col :span="14" class="title-container">
        <div class="header">{{ widgetTitle }}</div>
      </el-col>

      <el-col :span="10" class="filter-toolbar">
        <el-select
          v-model="selectedValues"
          multiple
          :multiple-limit="12"
          collapse-tags
          filterable
          placeholder="Select Entity"
          @change="handleValuesSelection"
          popper-class="dashboard-select"
        >
          <el-option
            class="dashboard-select-options"
            v-for="item in options"
            :key="item.value"
            :label="
              item.label.length < 17 ? item.label : item.label.substr(0, 17)
            "
            :value="item.value"
          >
            <span
              v-if="item.label.length < 17"
              class="vendor-selection-list-item"
              style="float: left"
            >
              {{ item.label }}
            </span>

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
                class="vendor-selection-list-item"
                style="float: left"
                slot="reference"
              >
                {{ item.label }}
              </span>
            </el-popover>

            <!-- <el-tooltip open-delay="200" hide-after="1" v-else class="item" effect="light" :content="item.label" placement="left">
                  <span class="vendor-selection-list-item" style="float: left">
                    {{ item.label }}
                  </span>
            </el-tooltip> -->
          </el-option>
        </el-select>
      </el-col>
    </el-row>


    <el-row v-for="(row, index) in charts" :key="index">
      <el-col v-for="(item, index1) in row" :key="index + index1" :span="5">
        <doughnut-chart
          :options="item"
          @onClick="onClick"
          class="vendor-dougnnut"
          :name="item.name"
        ></doughnut-chart>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import DoughnutChart from "../charts/DoughnutChart.vue";
import IdpChartService from "@/services/IdpChartService";
import UserService from "@/idp/services/UserService";
import DashboardDrillDownService from "../../services/DashboardDrillDownService";
import Constants from "@/resources/Constants";
import EventBus from "@/EventBus";
export default {
  name: "DocumentByEntityWrapper",
  props: ["defaultQuery","widgetTitle"],

  data() {
    return {
      doughnutData: {
        title: {
          text: "Invoices \n 0",
          left: "center",
          top: "center",
          show: true,
          textStyle: {
            color: "#718096",
            fontSize: 8,
          },
        },
        tooltip: {
          trigger: "item",
          textStyle: {
              color: "#718096",
          },
          formatter: "{a} <br/>{b} : {c} ({d}%)",
          position: function (point, params, dom, rect, size) {
            return [point[0], point[1]];
          },
        },

        position: function (point, params, dom, rect, size) {
          return [point[0], "10%"];
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["53%", "85%"],
            center: ["50%", "50%"],
            label: {
              normal: {
                formatter: "{c}",
                position: "inside",
              },
            },
            data: [],
          },
        ],
      },
      options: [],
      allCharts: [],
      selectedValues: [],
      colors: ["#FE2712", "#0147FE", "#FB9902", "#D0EA2B", "#66B032"],
      charts: [],
      documentType: null,
      docTypeEntityMapping: {
        "invoice" : "vendor_name",
        "po": "customer_name"
      }
    };
  },

  components: { DoughnutChart },
  methods: {
    onClick(selectedData, name) {
      let entityKey = this.docTypeEntityMapping[this.documentType];
      let options = { entityKey }
      console.log(selectedData + name);
      const pushParams = DashboardDrillDownService.getNavigationRoute(
        selectedData,
        "entity_document_count_by_stages",
        name,
        options
      );
      console.log("DashboardDrillDownService.getNavigationRoute", pushParams);

      this.$router && this.$router.push(pushParams);
    },
    async handleValuesSelection(selected) {
      console.log("selected", selected);
      console.log("selectedValues", this.selectedValues);
      let entityKey = this.docTypeEntityMapping[this.documentType];
      if(!this.selectedValues.length){
         this.selectedValues = _.get(this.defaultQuery, `${entityKey}.$in`, []);
      }
      const params = {
          preference_type: `widgets.DocumentByEntityWrapper.${this.documentType}`,
          data: this.selectedValues
      };
      const response = await UserService.updateUserPreference(params);
      if (response.data.status) {
          UserService.commitUserPreferencesInStore(params.preference_type, params.data);
      }    
      
      this.$nextTick(() => {
        this.setChartData();
      });
    },
    prepareOptions(values) {
      this.options = values.map((value) => {
        return {
          value: value,
          label: value,
        };
      });
    },
    async setChartData() {
      const kanvTheme = this.$store.getters.selectedTheme;
      let entityKey = this.docTypeEntityMapping[this.documentType];
      let apiQuery = {
        chart_name: "DocumentByEntityWrapper",
        query: _.cloneDeep(this.defaultQuery) || {},
        entity_key: entityKey
      };
      if (this.selectedValues.length) {
        apiQuery["query"][entityKey] = { $in: this.selectedValues };
      } else {
        // Set last selected one other show all
        this.selectedValues = _.get(apiQuery, `query.${entityKey}.$in`, []);
      }
      let result = await IdpChartService.getChartData(apiQuery);
      let chartResult = result["grouped_result"];
      this.prepareOptions(result["values"]);
      let values = _.uniq(_.map(chartResult, entityKey));
      let allCharts = [];
      _.map(values, (val) => {
        let stagesByEntityKey = _.filter(chartResult, {
          [entityKey]: val,
        });
        let totalDocuments = _.sum(_.map(stagesByEntityKey, "count"));
        let chartData = [];
        // Constant values
        const kanvTheme = this.$store.getters.selectedTheme;
        let dashboardColorMap = Constants.DOCEX.IDP_DASHBOARD[`STAGE_COLOR_MAP__${kanvTheme}`];
        const stageLabelMap = Constants.DOCEX.IDP_DASHBOARD.STAGE_LABEL_MAP;
        const allStages = Constants.DOCEX.ALL_STAGES;
        allStages.map((stageLabel, index) => {
          let stage = stageLabel;
          // Change value to actual stage name stored in DB
          if (stageLabelMap[stage]) {
            stage = stageLabelMap[stage];
          }
          // Color map
          const color = dashboardColorMap[stage];
          let filtered = stagesByEntityKey.filter(
            (stageInfoFromServer) => stageInfoFromServer.stage === stage
          );
          if (!filtered.length) {
            chartData.push({
              value: 0,
              name: stageLabel,
              itemStyle: { color },
              label: {
                fontSize: 9,
              },
            });
          } else {
            chartData.push({
              value: filtered[0].count,
              name: stageLabel,
              itemStyle: { color },
              label: {
                fontSize: 9,
              },
            });
          }
        });
        
        let chartDetails = _.cloneDeep(this.doughnutData);
        chartDetails.name = "" + val;
        val = val ? val.substr(0, 9) : val;
        chartDetails.title.text = `${val}. \n${totalDocuments}`;
        chartDetails.series[0].data = chartData;
        allCharts.push(chartDetails);
      });
      this.allCharts = allCharts;
      this.charts = _.chunk(allCharts, 4);
      if(kanvTheme == Constants.DOCEX.THEMES.DARK){
        this.doughnutData.tooltip.backgroundColor = "#242729";
        this.doughnutData.tooltip.textStyle.color = "#bebebe";
        this.colors = ["#DB210F", "#0037C7", "#CC7C00", "#A6BA26", "#58982C"];
        this.doughnutData.title.textStyle.color = "#bebebe";
        const rows = this.charts.length;
        const color = "#bebebe";

        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            const columns = this.charts[rowIndex].length;
            for (let colIndex = 0; colIndex < columns; colIndex++) {
                this.charts[rowIndex][colIndex].title.textStyle.color = color;
                this.charts[rowIndex][colIndex].tooltip.backgroundColor = "#242729";
                this.charts[rowIndex][colIndex].tooltip.textStyle.color = "#bebebe";
            }
        }
      }
      this.$store.commit('dashboardStore/setdashboardComponentStatus','DocumentByEntityWrapper');
    },

    setWidgetPreferance(){
      this.selectedValues = UserService.getUserPreferencesFromStore(`widgets.DocumentByEntityWrapper.${this.documentType}`) || [];
    }
  },
  async beforeMount() {
    this.documentType = this.defaultQuery.document_type;
    this.setWidgetPreferance();
    await this.setChartData();
    if(!this.selectedValues.length){
      this.selectedValues = _.map(this.allCharts, "name");
    }
  },
};
</script>>

<style lang="scss" >
@import "../../_idpGlobal";
@import "../../_idpVariables";

div.el-select-dropdown {
  ul.el-select-dropdown__list {
    background-color: inherit;
    // background-color: #f3f7fa;
    border-radius: 0px;
    li.el-select-dropdown__item {
      font-size: 11px;
      padding: 0px 8px 0px 16px;
      height: 24px;
      line-height: 24px;
    }
  }
}

.doc-by-vendors-wrapper-container {
  .vendor-dougnnut {
    .echarts {
      height: 92px !important;
      // width: 175px !important;
        width: 140px !important;
    }
  }

  .graph-toolbar-container {
    margin-bottom: 1rem;

    .filter-toolbar {
      // .el-select .el-input.is-focus .el-input__inner {

      // }
      .el-input__inner {
        border: 1px solid var(--dark-07);
      }
      input {
        border: 0px;
        font-size: var(--font-base);
        text-align: left;
        color: var(--dark-04);
        font-weight: 400;
        //  background: var(--dark-09);

        &::placeholder {
          color: var(--dark-04);
        }
      }
      .el-select__caret {
        color: var(--dark-01);
      }
      .el-input--suffix .el-input__inner {
        padding-right: 23px;
      }
    }
  }
}

.dashboard-select {
  z-index: 9 !important;

  .vendor-selection-list-item {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 14rem;
  }
}
</style>
