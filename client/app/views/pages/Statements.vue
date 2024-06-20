<template>
	<el-main>
		<h1 class="kp-page-title">{{pageTitle}}</h1>

		<div class="table-wrap" id="res">
			<DataTable :parameters="requiredParam" :columnTemplate="columnTemplate" @refreshCount="refreshCount"></DataTable>
		</div>
	</el-main>
</template>

<script>
import moment from 'moment-timezone'
import $ from 'jquery'
import DataTable from '../../components/DataTable.vue'
import AjaxService from "@public/services/AjaxService";

export default {
	name: 'Statements',
	components:{DataTable},
	data() {
    return {
		totalCount:0,
		successCount:0,
		failureCount:0,
		cancelled: 0,
	requiredParam:{
	apiName:"/portal/api/table/chat_log",
	showPaginationOptions:true,
	initialSort :"-created_on",
	showHeader:false,
	tableName:"chatlog",
	isRestify:true,
	limit:10,
	headerWidget:[],	
	enableExport:true,	
	},
	pageTitle:"Commands",
	}
	},

	methods: {

    //  columnTemplate(props) {

    //    var className = `badge-${props.row["query_status"]}`
	// 		 var template =	`<div data-v-c0ac797e="" class="el-badge mark"><sup class=${className}>${props.row["query_status"]}</sup></div>`



    //   return template;
	//     },
         getCount(){
		AjaxService.getJson("/portal/api/statement-status", {}, (error, res) => {
			this.successCount = res.data.response.success?   res.data.response.success : this.successCount 
			this.failureCount = res.data.response.failed ?  res.data.response.failed : this.failureCount
			this.cancelled = res.data.response.cancelled ?  res.data.response.cancelled :this.cancelled 
			this.totalCount = res.data.response.total ?  res.data.response.total :this.total 
			  });
			this.requiredParam.headerWidget=[
				{
					label:"All commands",
					value:this.totalCount
				},
				{
					label:"Success",
					value:this.successCount
				},
				{
					label:"Failure",
					value:this.failureCount
				},
				{
					label:"Cancelled",
					value:this.cancelled
				}
			]
			  
			

		 },
		 refreshCount(){
			this.getCount()
		 }

	},


	beforeMount(){
	this.getCount()
 },
}
</script>

<style lang="scss">
@import '../../assets/scss/_variables';

.page-info-container {
	border-radius: 5px;
    -webkit-box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
	max-width: 1000px;
    width: 100%;
	padding: 16px;
	background:$color-white;
		.el-col {
			border-right: .5px solid #bbbbbb;
			border-radius:0;
				&:last-child {
					border-right:0;
				}
		}
}

.badge-Success{
	background-color: white;
	border-radius: 10px;
	color : rgba(66, 240, 153, 0.7);
	display: inline-block;
	font-size: 12px;
	height: 18px;
	line-height: 18px;
	padding: 0 6px;
	text-align: center;
	white-space: nowrap;
	border: 1px solid rgba(66, 240, 153, 0.7);
	width: 45px;
}

.badge-Failed{
	background-color: white;
	border-radius: 10px;
	color :rgba(254, 144, 151, 1);
	display: inline-block;
	font-size: 12px;
	height: 18px;
	line-height: 18px;
	padding: 0 6px;
	text-align: center;
	white-space: nowrap;
	border: 1px solid rgba(254, 144, 151, 0.7);
	width: 45px;
}

.mid-res{
	span {
		height: 100px;
		display: block;
		overflow-y: scroll;
		width: 400px;
	}

}

#res table.vgt-table{
	max-width: none !important;
	width: 300% !important;
}

.kp-page-title {
  font-size: 28px;
  color: #005da6;
  margin: 0;
  display: inline-block;
}

</style>

