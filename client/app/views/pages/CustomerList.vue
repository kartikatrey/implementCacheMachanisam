<template>
	<el-main>
		<h1 class="kp-page-title">{{pageTitle}}</h1>       

		<div class="table-wrap">
      		<DataTable :parameters="tableParams" componentName="ActiveInactiveButtons" @refreshCount="refreshCount"></DataTable>
		</div>
  </el-main>
</template>

<script>
import DataTable from "../../components/DataTable.vue";
import CustomerService from '../../services/CustomerService'

export default {
    name: "CustomerList",
    components: { DataTable },
    data() {
        return {
            count: 0,
            tableParams: {
				apiName: '/portal/api/table/customer',
				showPaginationOptions: true,
                tableName: "customer",
                queryParam: { 
                    // active: true 
                    },
                initialSort: "customer_name",
                enableExport:true,
                isRestify: true,
                limit: 10,
                 addButtonConfig:{path:"/customer-form",name:'Add customer'},
            },
            pageTitle:"All customers"
		};
    },
    methods: {
        getCount() {
            CustomerService.fetchCount()
                .then((count) => {
                    this.count = count;
                })
                .catch((error) => {
                    this.notifyError("There is an error in fetching customer count");
                })
        },

        refreshCount() {
            this.getCount();
        }
    },
    beforeMount() {
        this.getCount()
    }
}
</script>



