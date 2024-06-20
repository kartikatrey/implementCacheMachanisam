<template>  
    <div class="grid-content bg-purple top-right-graph">
          <div class="dashboard-section-label">API Transactions</div>
          <el-tabs type="border-card">
            <el-tab-pane>
              <span slot="label">Day</span>
              <line-chart  :params="ChartParams.data.day" :label="ChartParams.label" class="stackedBarChart"></line-chart>
            </el-tab-pane>
            <el-tab-pane>
               <span slot="label">Week</span>
              <line-chart  :params="ChartParams.data.week" :label="ChartParams.label" class="stackedBarChart"></line-chart>
            </el-tab-pane>
            <el-tab-pane>
               <span slot="label">Month</span>
              <line-chart :params="ChartParams.data.month" :label="ChartParams.label" class="stackedBarChart"></line-chart>
            </el-tab-pane>
              <el-tab-pane>
               <span slot="label">Year</span>
              <line-chart :params="ChartParams.data.year" :label="ChartParams.label" class="stackedBarChart"></line-chart>
            </el-tab-pane>
          </el-tabs>
        </div>
</template>
<script>
import AjaxService from "../../services/AjaxService";
import LineChart from "../../components/Dashboard/LineChart.vue";

export default {
  name: "TransactionsByTimeChart",
  data() {
    return {
   ChartParams:{'label':'API Transactions','data':''}
  }
  },
  components: {
    LineChart
  },
  methods: {
      getChartData(){
        AjaxService.getJson("/portal/api/transactions-time",null,(error, res) => { 
                if (res) {
                  this.ChartParams  = Object.assign(this.ChartParams , {'data': res.data.response}) ;
            
                } else {
                    console.log("error occured");
                }
                }
            );
        }   
  },

 beforeMount() {
     
    this.getChartData();
  }

}
</script>
<style lang="scss">
// .registered-container {

// }

.el-progress-bar__inner  {
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
		border-radius:5px;
        background: #fff;
        border: .5px solid #A5B4C3;
	}
}

.el-progress.is-success .el-progress-bar__inner {
    background-color:#A1DD70;
}
 </style>


