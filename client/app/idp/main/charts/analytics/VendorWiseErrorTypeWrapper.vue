
<template>
 <el-row class="chart-row">

    <div class="dashboard-analysis-header">
        <h2>Error Analysis</h2>
        <el-select
          v-model="selectedValues"
          multiple
          :multiple-limit="12"
          collapse-tags
          filterable
          placeholder="Select entity name"
          @change="handleValuesSelection"
          popper-class="dashboard-select"
        >
          <el-option
          class="dashboard-select-options"
            v-for="item in entityValuesList"
            :key="item"
            :label="(item < 17) ? item :item.substr(0,17)"
            :value="item"
          >
            <span v-if="item.length < 17" class="vendor-selection-list-item" style="float: left">
              {{ item }}
            </span>

             <el-popover open-delay="200" close-delay="0" popper-class="dropdown-popover"
              placement="left" v-else
              trigger="hover"
              :content="item">
               <span class="vendor-selection-list-item" style="float: left" slot="reference"> {{ item }} </span>
            </el-popover>
          </el-option>
        </el-select>
    </div>


    <!-- Graph Header -->



<el-row :gutter="12" class="analytics-margin">
      <el-col :span="8">
        <div class="dashboard-cards Error-by-type-container">
            <el-row class="graph-toolbar-container">
                <el-col :span="10" class="title-container">
                  <a class="active-header-link" @click="(params)=>onClick(params, null)">Error By Type</a>
                </el-col>
                <!-- <el-col :span="11" class="filter-toolbar"></el-col> -->
            </el-row>
            <stack-bar-chart  @onClick="(params)=>onClick(params, null)" v-if="reRenderCharts" class="vendor-wise-error-chart" :options="errorByTypes" ></stack-bar-chart>
         </div>
      </el-col>


       <el-col :span="8">
          <!-- <div class="center-graph">
            <div class="header">Business Rule Errors</div>
            <stack-bar-chart  @onClick="(params)=>onClick(params, 'ERROR')" v-if="reRenderCharts" class="vendor-wise-error-chart"  :options="notPredictedErrors"></stack-bar-chart>
          </div> -->

           <div class="dashboard-cards Error-by-type-container">
            <el-row class="graph-toolbar-container">
                <el-col :span="10" class="title-container">
                  <a class="active-header-link" @click="(params)=>onClick(params, 'ERROR')">Business Rule Errors</a>
                </el-col>
                <!-- <el-col :span="11" class="filter-toolbar"></el-col> -->
            </el-row>
            <stack-bar-chart  @onClick="(params)=>onClick(params, 'ERROR')" v-if="reRenderCharts" class="vendor-wise-error-chart"  :options="notPredictedErrors"></stack-bar-chart>
         </div>


      </el-col>
      <el-col :span="8" >
          <!-- <div class="center-graph">
            <div class="header">Not Extracted Errors</div>
            <stack-bar-chart   @onClick="(params)=>onClick(params, 'NOT_PREDICTED')" v-if="reRenderCharts" class="vendor-wise-error-chart"  :options="businessRulesErrors"></stack-bar-chart>
          </div> -->
          <div class="dashboard-cards Error-by-type-container">
            <el-row class="graph-toolbar-container">
                <el-col :span="10" class="title-container">
                  <a class="active-header-link" @click="(params)=>onClick(params, 'NOT_PREDICTED')">Not Extracted Errors</a>
                </el-col>
                <!-- <el-col :span="11" class="filter-toolbar"></el-col> -->
            </el-row>
            <stack-bar-chart  @onClick="(params)=>onClick(params, 'NOT_PREDICTED')" v-if="reRenderCharts" class="vendor-wise-error-chart"  :options="businessRulesErrors"></stack-bar-chart>
         </div>

      </el-col>
</el-row>


 </el-row>
</template>

<script>
import StackBarChart from "../StackBarChart.vue";
import _ from "lodash";
import Constants from "@/resources/Constants";
import IdpChartService from "@/services/IdpChartService";
import DashboardDrillDownService from "../../../services/DashboardDrillDownService";
import moment from 'moment-timezone'

export default {
  name: "VendorWiseErrorWrapper",
  props: {
    "defaultQuery":{
        type: Object,
        default:null
      },
    "customer":{
        type: Object,
        default:()=> ({})
      },
      "config":{
         type:Object,
         default:()=>({showGraphTitle:true}),
      }
  },
  data() {
    return {
      vendorOptions: [],
      selectedValues: [],
      notPredictedErrors: {
            grid: {
              left: '15%',
              right: '10%',
              bottom: '10%',
              top: '20%',
            }
      },
      businessRulesErrors: {
            grid: {
              left: '15%',
              right: '10%',
              bottom: '10%',
              top: '20%',
            }
      },
      errorByTypes:{
            grid: {
              left: '15%',
              right: '10%',
              bottom: '10%',
              top: '20%',
            }
      },

      reRenderCharts:true,
      docTypeEntityMapping: {
          "invoice" : "vendor_name",
          "po": "customer_name"
      }
    };
  },
  computed: {
    entityValuesList:{
        get() {
            return this.$store.state.dashboardStore.error_analytics.entityValuesList;
        }
    },
  },
  watch:
  {
    defaultQuery: {
            handler: function (newVal, oldval) {
                   if(newVal == null)return;
                   this.setChartData();
            },
            deep: true,
            immediate:true
        }
  },
  components: { StackBarChart },
  methods: {
     onClick(selectedData, errorType) {
      console.log(selectedData + name);
      const pushParams = DashboardDrillDownService.getNavigationRoute(
        selectedData,
        "error_analytics"
      );
      const documentType = this.defaultQuery["document_type"];
      const entityKey= this.docTypeEntityMapping[documentType];
      pushParams.query.filter = JSON.parse(pushParams.query.filter)
      errorType && (pushParams.query.filter.field_name = selectedData.seriesId);
      pushParams.query.filter[entityKey] = this.selectedValues;
      pushParams.query.filter.type = errorType || selectedData.seriesId;
      pushParams.query.filter = JSON.stringify(pushParams.query.filter)
      this.$router && this.$router.push(pushParams);
    },

    formatterFunction(params) {
      let value = `${params.name} : ${params.data.value} Field(s) out of ${params.data.total}`
      return value;
    },

    async setChartData() {
      const documentType = this.defaultQuery["document_type"];
      const entityKey= this.docTypeEntityMapping[documentType];
      const kanvTheme = this.$store.getters.selectedTheme;
      let apiQuery = {
        chart_name: "errorDetailsByVendor",
        query: _.cloneDeep(this.defaultQuery) || {},
        time_zone:moment.tz.guess()
      };
      if (this.selectedValues.length) {
        apiQuery["query"][entityKey] = { $in: _.cloneDeep(this.selectedValues)};
      }else{
        delete apiQuery["query"][entityKey];
      }
      let response = await IdpChartService.getAnalyticsChartData(apiQuery);
      let op =  response[0];
      op.tooltip.formatter = this.formatterFunction; //eval(op.tooltip.formatter);
      this.errorByTypes  = op;
      DashboardDrillDownService.setErrorByTypesColor(this.errorByTypes);
      this.notPredictedErrors = response[1]
      DashboardDrillDownService.setVendorWiseErrorWrapperColor(this.notPredictedErrors);
      this.businessRulesErrors = response[2]
      DashboardDrillDownService.setVendorWiseErrorWrapperColor(this.businessRulesErrors);
    },
      handleValuesSelection(selected) {

          this.$nextTick(() => {
            this.setChartData();
      })
    }
  }
};
</script>

<style lang="scss">
@import "../../../_idpGlobal";

.analytics-margin {
  margin-bottom: 1rem;
}

.Error-by-type-container {
    .echarts {
        height: 22rem;
        left: 3%;
        width: auto;
        margin-top: 5%;
    }
}






</style>