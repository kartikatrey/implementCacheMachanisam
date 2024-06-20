<template>
<div>
 <el-col :span="24">
                    <div class="grid-content bg-purple count-container DA">

                        <div class="top-left-values">
                            <div class="dashboard-section-label center-align">
                                Commands (Digital Assistant)
                            </div>
                            <div class="users-count center-align"> <span class="counter">{{allStatement}}</span></div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="24">
                    <el-row :gutter="10">
                        <el-col :span="12">
<div class="grid-content bg-purple count-container">

                        <div class="top-left-values">
                            <div class="dashboard-section-label">
                                Week
                            </div>
                            <div class="users-count"> <span class="counter"> {{oneWeek}} </span></div>
                        </div>
                    </div>
                        </el-col>
                         <el-col :span="12">
<div class="grid-content bg-purple count-container">

                        <div class="top-left-values">
                            <div class="dashboard-section-label">
                                Month
                            </div>
                            <div class="users-count"> <span class="counter"> {{oneMonth}} </span></div>
                        </div>
                    </div>
                        </el-col>
                    </el-row>
                </el-col>



</div>
        
</template>
<script>
import AjaxService from "../../services/AjaxService";

export default {
  name: "StatementsByCustomer",
  data() {
    return {
        allStatement: '',
        oneWeek:'',
        oneMonth:''
    
  }
  },
  methods: {
      getStatementCustomerCount(){
        AjaxService.getJson("/portal/api/statements-customers",null,(error, res) => {
                if (res) {
                    let sysData =res.data
                    this.allStatement = sysData.all_statement || 0,
                    this.oneWeek = sysData.week_count || 0,
                    this.oneMonth = sysData.month_count || 0

                } else {
                    console.log("error occured");
                }
                }
            );
        }   
  },
   beforeMount() {
    this.getStatementCustomerCount();
  }
}
</script>
<style lang="scss">
// @import '../assets/scss/_variables';
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
    background: #56F19A;
	color: #ffffff;
  }
  .bg-oranges-2 {
    background: #A1DD70;
	color: #ffffff;
  }
  .bg-oranges-3 {
    background: #97CF6A;
	color: #ffffff;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 5px;
    min-height: 327px;
	box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .grid-content-sub {
		border-radius: 5px;
		min-height: 36px;
		box-shadow: 0 5px 20px rgba(0,0,0,0.1);
	}

	.top-left-values {
		height: 85px;
	}
	.top-left-values-big {
		height: 213px;
	}

	.dashboard-section-label {
		font-weight: 700;
		padding-left: 16px;
		padding-top: 8px;
    margin-bottom: 15px;
  }
  .statments-wrap {
    height:100%;
  }
.statemants-container {
  height: 220px !important;
    .el-row {
      padding-top:20px;
    }
  	.counter { 
      float: left;
    }
}
  .all-statments {
    background:rgba(255, 255, 255, .15);
    height: 100%;
    padding-right: 5px;
    margin-right: 0;
      padding-right: 10px;
      .dashboard-section-label {
        padding-left:0 !important;
        font-size:18px;
        margin-bottom:-2px !important;
      }
  }
  .weekly {
  margin-left: 0;
  width: 100%;
  	.counter { 
      font-weight: normal !important;
    }
      i {
          position: absolute;
          top: 10px;
          right: 30px;
          font-size: 60px;
      }
  }
	.counter {
		font-size: 38px;
		font-weight: bold;
		padding-left: 16px;
    // margin-top: 10px;

      span {
        font-weight: normal;
        font-size: 14px;
        display:block;
      }
	}
</style>


