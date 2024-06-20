<template>
<el-main>
		<h1 class="kp-page-title">{{pageTitle}}</h1>
        
	
		<div class="table-wrap">
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
	name: 'Transactions',
	components:{DataTable},
	data() {
    return {
		totalCount:0,
		successCount:0,
		failureCount:0,
requiredParam:{
	apiName:"/portal/api/table/ks_transaction",
	showPaginationOptions:true,
	initialSort :"-start_time",
	showHeader:false,
	queryParam: {
          // "active":true
          },
	tableName:"ks_transaction",
	enableExport:true,
	isRestify:true,
	limit:10,
		headerWidget:[],	
},
pageTitle:"Transaction"
	}
	},

	methods: {

    	columnTemplate(props) {

			var className = `badge-${props.row["status"]}`
					var template =	`<div data-v-c0ac797e="" class="el-badge mark"><sup class=${className}>${props.row["status"]}</sup></div>`

			return template;
        },
        getCount(){
			AjaxService.getJson("/portal/api/transactions-detail", {}, (error, res) => {
				this.successCount = res.data.response.success || 0;
				this.failureCount = res.data.response.null || 0;//res.data.response.failure + res.data.response.null;
				this.totalCount = this.successCount + this.failureCount;
			});

			this.requiredParam.headerWidget=[
				{
					label:"All Transactions",
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
				
			]

		},
		refreshCount() {
			this.getCount();
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
	max-width: 420px;
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

.badge-Failure{
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
.req-res{
	span {
		height: 100px;
		display: block;
		overflow-y: scroll;
		// width: 400px;
	}

}

</style>

