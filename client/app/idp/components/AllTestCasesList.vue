<template>
	<div>
		<DataTable :parameters="tableParams"></DataTable>
	</div>
</template>

<script>
import TestCaseService from "@/idp/services/TestCaseService.js";
import DataTable from "@/components/DataTable.vue";
import EventBus from "@/EventBus";
import Constants from "@/resources/Constants.js";

export default {
	name: "AllTestCasesList",

	components: {
		DataTable
	},

	data: function() {
		return {
			tableParams: {
				apiName: "/portal/api/test-cases-list",
				tableName: "AllTestCasesList",
				limit: 10,
				refreshButton: true,
				globalSearch: false,
				customfilter: false,
				extraButtons: [
					{
						name: "Run All",
						id: "0",
						event: "runAllTests"
					}
				],
				actionItems: [
					{
						icon: "mdi mdi-arrow-down-thin-circle-outline",
						name: "Download",
						event_name: "exportTestResult",
						inline: true
					}
				]
			}
		};
	},

	methods: {
		// Run all test cases after run button clicked
		async handleRunButtonClicked() {
			this.notifySuccess("Running test case, Please refresh");
			try {
				await TestCaseService.runAllTestCases();
			} catch (error) {
				this.notifyError("Error while running test cases");
			}
		},

		// Export detailed data of a specific test run
		async handleExportButtonClicked(rowData) {
			let endPoint =
				`${window.location.origin}` +
				Constants.DOWNLOAD_TEST_RUN_HISTORY_ENDPOINT +
				`?exportCsv=true&run_id=${encodeURIComponent(
					_.get(rowData, "row._id")
				)}`;

			window.open(endPoint, "_self");
		},

		destroyBusEvents() {
			let busEvents = [
				"runAllTests",
				"exportTestResult"
			];
			EventBus.$off(busEvents);
		},

		registerEvents() {
			this.destroyBusEvents();
			EventBus.$on("runAllTests", async () => {
				await this.handleRunButtonClicked();
			});

			EventBus.$on("exportTestResult", async rowData => {
				await this.handleExportButtonClicked(rowData);
			});
		}
	},

	beforeMount() {
		this.registerEvents();
	}
};
</script>

<style lang="scss"></style>
