<template>
	<el-main class="kp-main">
		<div class="table-wrap">
			<data-table :parameters="tableParams"></data-table>
		</div>
	</el-main>
</template>

<script>
import DataTable from "@/components/DataTable.vue";

export default {
	name: "WorkflowInstance",
	components: {
		DataTable
	},
	data() {
		return {
			count: 0,
			tableParams: {
				apiName: `/portal/api/table/workflow_instance`,
				queryParam: {
					active: true
				},
				pageTitle: "Workflow Instances",
				tableName: "workflow_instance",
				initialSort: "-created_at",
				aggregation: true,
				refreshEventName: "workflow_instance",
				enableExport: false,
				isRegxSearch:true,
				refreshButton: true,
				isRestify: true,
				limit: 10
			}
		};
	},
	methods: {},
	beforeMount() {
		this.$store.commit("setDisplayIdpTree",false);
		this.$store.commit("setDisplayIdpNavbar",true);
	}
};
</script>
