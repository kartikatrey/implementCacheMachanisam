<template>
	<el-main class="kp-main">
		<section class="page-body">
			<div class="table-wrap">
				<DataTable :parameters="tableParams"></DataTable>
			</div>
		</section>
	</el-main>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import EventBus from "@/EventBus";

export default {
	name: "ResourcePermission",
	components: {
		DataTable
	},
	data() {
		return {
			count: 0,
			tableParams: {
				apiName: `/portal/api/table/cp_permission`,
				tableName: "cp_permission",
				pageTitle: "Resource permission",
				initialSort: "resource_name",
				enableExport: true,
				isRegxSearch:true,
				isRestify: true,
				limit: 10,
				queryParam: {
					active: true
				},
				addButtonConfig: true,
				addButtonConfig: {
					path: "/idp/resource-permission-form",
					name: "Add resource permission"
				}
			}
		};
	},

	beforeMount() {
		this.$store.commit("setDisplayIdpTree",false);
		this.$store.commit("setDisplayIdpNavbar",true);
	}
};
</script>
