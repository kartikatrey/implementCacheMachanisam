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
	name: "CpMenuList",
	components: {
		DataTable
	},
	data() {
		return {
			count: 0,
			tableParams: {
				apiName: "/portal/api/table/cp_menu",
				queryParam: {
					active: true
				},
				pageTitle: "Menu List",
				tableName: "cp_menu",
				enableExport: false,
				isRegxSearch:true,
				initialSort: "-created_at",
				isRestify: true,
				limit: 10,
				addButtonConfig: true,
				addButtonConfig: {
					path: "/idp/menu_form",
					name: "Add Menu"
				}
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
