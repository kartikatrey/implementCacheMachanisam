<template>
  <el-main v-scroll="onScroll">

<h1 class="kp-page-title">{{pageTitle}}</h1>
  <!-- <div class="table-data-belt ph-10 pv-10 card-shadow--medium">
			<div class="flex">
					<div class="box"> -->
						<!-- <el-button type="text" v-on:click="$router.push('routing-form')"> + Statement</el-button> -->
             <!-- <el-button type="text" @click="startTrainer"><i class="mdi mdi-access-point"></i> Train model</el-button>
					</div>
				<div class="box center">&nbsp;</div>
					<div class="box right-sec">
				 -->
						<!-- <el-button type="text" @click="onExport"> <i class ="mdi mdi-arrow-collapse-down" ></i> Export</el-button>  -->
            
					<!-- </div>
			</div>
		</div> -->
    <training-status-dialog @closeDialog="handleCloseDialog" :title="title" :displayTrainingDialog="displayTrainingDialog"></training-status-dialog>
			<div class="table-wrap">
      <data-table
        @startTrainer="startTrainer"
        :parameters="tableParams"
        ref="datatable"
      ></data-table>
			</div>
   <!-- <el-dialog class="taining-modal-container" title="Statements Training" :visible.sync="displayTrainingDialog">
          <h1>Training has been Started</h1>

          <el-button @click="displayTrainingDialog =false">Close</el-button>
          <el-button v-on:click="$router.push('training-status-list')">Training Status</el-button>
      </el-dialog> -->
  </el-main>
</template>

<script>

import DataTable from "../../components/DataTable.vue";
import TrainingService from "@/services/TrainingService";
import Constants from "@/resources/Constants";
import TrainingStatusDialog from "../../components/TrainingStatusDialog.vue";

export default {
  name: "RoutingDataList",
  components: { DataTable, TrainingStatusDialog },
  data() {
    return {
     tableParams: {
        apiName: `/portal/api/table/trn_router_data`,
        queryParam: {"active":true},
        tableName: "trn_router_data",
        enableExport:true,
        isRestify: true,
        limit: 10,
         addButtonConfig:{path:"/routing-form",name:'Statement'},
         trainButtonConfig:{},
          tableAction: [{
                    label: 'Train model',
                    icon: "el-icon-setting",
                    size: "medium",
                    event: "startTrainer"
                }],
      },
      displayTrainingDialog: false,
      modelType : Constants.TRANING_MODEL_TYPES.ROUTER_MODEL_TYPE,
      pageTitle:"Router",
      title: "Statements training"

    };
  },
  methods:{
           handleCloseDialog() {
            this.displayTrainingDialog = false
        },
           async startTrainer(){
                try{
                  let trainingStatus = await TrainingService.save([{"model_type":this.modelType}])
                  this.displayTrainingDialog = true
                }catch(e){
                  this.notifyError("Error while training router model"); 
                }   
           },
            onExport(){
              let queryParam = this.tableParams.queryParam
              let  endPoint = `${window.location.origin}/portal/api/table/trn_router_data?exportCsv=true&query=${JSON.stringify(queryParam)}`
              window.open(endPoint,'_self')
          },
  }
}
</script>




