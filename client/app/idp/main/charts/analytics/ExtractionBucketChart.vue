

<template>
 <div>
<!-- Graph Header -->
<el-row :gutter="12">
      <el-col >
          <div class="dashboard-cards">
            <el-row class="graph-toolbar-container">
                <el-col :span="20" class="title-container">
                  <div class="header">Extraction Metrics</div>
                </el-col>
                <el-col :span="4" class="filter-toolbar">
                  <!-- commenting dropDown as per discussion  -->
                       <!-- <el-select
                          v-model="selectedValues"
                          multiple
                          :multiple-limit="12"
                          collapse-tags
                          filterable
                          placeholder="Select vendor name"
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
                        </el-select>  -->
                </el-col>
            </el-row>
            <stack-bar-chart   @onClick="(params)=>onClick(params, 'NOT_PREDICTED')" v-if="reRenderCharts" class="vendor-wise-error-chart"  :options="chartOptions"></stack-bar-chart>
         </div>

      </el-col>
  </el-row>
 </div>
</template>

<script>
import StackBarChart from "../StackBarChart.vue";
import _ from "lodash";
import Constants from "@/resources/Constants";
import IdpChartService from "@/services/IdpChartService";
import DashboardDrillDownService from "../../../services/DashboardDrillDownService";
import moment from 'moment-timezone'
import IdpDashboardService from "@/idp/services/IdpDashboardService";

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
      chartOptions:{
        grid:{
          left:'25%',
          right:'25%',
          bottom:'0%',
          // top:'20%',
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
                    this.renderChartData();
            },
            deep: true,
            immediate:true
        }
  },
  components: { StackBarChart },
  methods: {
     onClick(selectedData, errorType) {
        //If request is coming from dashboard then, only we are not allowing the drilldown 
        const dashboardFilters = IdpDashboardService.getCurrentDashboardFilters();
        if (dashboardFilters["document_type"]) {
            return;
        }
      const pushParams = DashboardDrillDownService.getNavigationRoute(
        selectedData,
        "document_by_extraction_bucket"
      );

      pushParams.query.filter = JSON.parse(pushParams.query.filter)
      pushParams.query.filter.extr_acc_bucket = selectedData.seriesId;
      if(this.selectedValues.length>0){
        const documentType = this.defaultQuery["document_type"];
        const entityKey= this.docTypeEntityMapping[documentType];
        pushParams.query.filter[entityKey] = {$in:this.selectedValues};
      }
      pushParams.query.filter.stage = "Published";
      pushParams.query.filter = JSON.stringify(pushParams.query.filter)
      this.$router && this.$router.push(pushParams);
    },

    formatterFunction(params) {
      let value = `${params.name} : ${params.data.value} Document(s) out of ${params.data.total}`
      return value;
    },

    async renderChartData() {
      const documentType = this.defaultQuery["document_type"];
      const entityKey= this.docTypeEntityMapping[documentType];
      let apiQuery = {
        chart_name: "extractionBucket",
        query: _.cloneDeep(this.defaultQuery) || {},
        time_zone:moment.tz.guess()
      };
      if (this.selectedValues.length) {
        apiQuery["query"][entityKey] = { $in: _.cloneDeep(this.selectedValues)};
        return;
      }
      delete apiQuery["query"][entityKey];
      let response = await IdpChartService.getAnalyticsChartData(apiQuery);
      response.tooltip.formatter = this.formatterFunction; //eval(response.tooltip.formatter);
      this.chartOptions = response;
      DashboardDrillDownService.setExtractionBucketColor(this.chartOptions);
      this.reRenderCharts = false
      this.$store.commit('dashboardStore/setdashboardComponentStatus','ExtractionBucketChart');
      this.$nextTick(()=>{this.reRenderCharts = true})
    },
    handleValuesSelection(selected) {
          this.$nextTick(() => {
            this.renderChartData();
      })
    },
  }
  // beforeMount() {
  //   this.renderChartData();
  // },
};
</script>

<style lang="scss">
@import "../../../_idpGlobal";


</style>