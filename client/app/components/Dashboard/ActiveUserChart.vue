<template>  
    <div class="grid-content bg-purple top-right-graph active-user" v-bind:style="!isAdmin ? 'min-height: 380px;' : '' ">
          <div class="dashboard-section-label">Active Users</div>
          <el-tabs type="border-card">
            <el-tab-pane class="chart-tab">
              <span slot="label">Day</span>
              <line-chart  :params="chartParams.data.day" :label="chartParams.label" class="stackedBarChart"></line-chart>
            </el-tab-pane>
            <el-tab-pane class="chart-tab">
               <span slot="label">Week</span>
              <line-chart  :params="chartParams.data.week" :label="chartParams.label" class="stackedBarChart"></line-chart>
            </el-tab-pane>
            <el-tab-pane class="chart-tab">
               <span slot="label">Month</span>
              <line-chart :params="chartParams.data.month" :label="chartParams.label" class="stackedBarChart"></line-chart>
            </el-tab-pane>
            <el-tab-pane class="chart-tab">
              <span slot="label">Year</span>
              <line-chart :params="chartParams.data.year" :label="chartParams.label" class="stackedBarChart"></line-chart>
            </el-tab-pane>
          </el-tabs>
        </div>
</template>
<script>
import AjaxService from "../../services/AjaxService";
import LineChart from "../../components/Dashboard/LineChart.vue";

export default {
  name: "ActiveUserChart",
  props: ["isAdmin"],
  data() {
    return {
   chartParams:{'data':'', 'label':"Active Users"}
  }
  },
  components: {
    LineChart
  },
  methods: {
      getUserCount(){
         
        AjaxService.getJson("/portal/api/active-users",null,(error, res) => {
          
                if (res) {
                  this.chartParams  = Object.assign(this.chartParams, {'data': res.data.response}) ;
            
                } else {
                    console.log("error occured");
                }
                }
            );
        }   
  },
  computed: {
    myComputedWidth() {
        let status = "success";
        this.remainingCount =  this.allowedUsers - this.activeUsers
        if(this.activeUsers > this.allowedUsers)
        {
               status= "exception";
        }
        let resisterUserPercentage = Math.round((this.activeUsers / this.allowedUsers) * 100) 
        return {registeredUserPercentage :resisterUserPercentage ? resisterUserPercentage:0,
                remaining : Math.round((this.remainingCount / this.allowedUsers) * 100),
                status
        };
    }
},

 beforeMount() {
     
    this.getUserCount();
  }

}
</script>
<style lang="scss">
// .registered-container {

// }

.chart-tab{
  height:284px !important
}

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


