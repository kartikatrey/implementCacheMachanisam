<template>
	<DataTable v-if="showTestCaseListView" :parameters="tableParams"></DataTable>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import TestCaseService from "@/idp/services/TestCaseService.js";
import EventBus from "@/EventBus";
import _ from "lodash";

export default {
	name: "TestCaseList",

	props: {
		referenceType: String,
		referenceId: String,
		documentType: String
	},

	watch: {
		documentType(newVal) {
			this.$props.documentType = newVal;
			this.tableParams.addButtonConfig.params.documentType = newVal;
		}
	},

	components: {
		DataTable
	},

	data: function() {
		return {
			showTestCaseListView : false,
			formattedReferenceType : "",
			tableParams: {
				apiName: `/portal/api/table/de_test_case`,
				tableName: "de_test_case",
				initialSort: "-updated_at",
				isRegxSearch: true,
				isRestify: true,
				limit: 10,
				showTableToolbar: true,
				customfilter: true,
				refreshEventName: 'refreshExtractionTestCase',
				queryParam: {
					active: true,
					reference_type: this.$props.referenceType,
					reference_id: this.$props.referenceId
				},
				extraButtons: [
					{
						name: "Run All",
						id: "0",
						event: "handleRunAllTestCases",
					}
				]
			}
		};
	},

	methods: {
		// Run all test cases of reference type when run button is clicked
		async runAllTestCasesByReferenceType() {
			let response = null;
			try {
				this.notifySuccess(`Running '${this.formattedReferenceType}' test cases. Please wait for some time and check test cases logs.`);

				response = await TestCaseService.runAllTestCasesOfReferenceType(
					this.$props.referenceType,
					this.$props.referenceId
				);

				EventBus.$emit("runIdChanged", _.get(response, "data.run_id"));
				if(response.error){
					this.notifyError(`Error while running all ${this.formattedReferenceType} test cases. ${response.error.message}`);
					return;
				}

				this.notifySuccess(`Execution of run all '${this.formattedReferenceType}' test cases completed.`);
			} catch (error) {
				const errorMessage = error.message;
				this.notifyError(`Error while running all ${this.formattedReferenceType} test cases. ${errorMessage}`);
				console.log(`Error while running all ${this.formattedReferenceType} test cases.`, error);
				console.log(`Error while running all ${this.formattedReferenceType} test cases.`, response);
			}
		},

		refreshTable(){
			const tableName =  this.tableParams.refreshEventName; 
			EventBus.$emit(`refreshTable__${tableName}`); 
    },

		destroyBusEvents() {
			let busEvents = ["handleRunAllTestCases"];
			EventBus.$off(busEvents);
		},

		registerEvents() {
			this.destroyBusEvents();
			EventBus.$on("handleRunAllTestCases", async () => {
				this.$confirm(`Are you sure want to run all '${this.formattedReferenceType}' test cases?`, 'Confirm', {
					confirmButtonText: 'Yes',
					cancelButtonText: 'No'
				})
				.then(async () => {
					await this.runAllTestCasesByReferenceType();
				})
				.catch(error => {});
			});
		},

		addExtractionTestCaseButtons(){
			// Add new test case button
			this.tableParams["addButtonConfig"] = {
				path: "/idp/test-case-form",
				name: "Add",
				params: {
					referenceType: this.$props.referenceType,
					referenceId: this.$props.referenceId,
					documentType: this.$props.documentType
				}
			}
		},
	},

	beforeMount() {
		const businessRuleId = this.$route.query.id;
		this.registerEvents();
		this.formattedReferenceType = _.startCase(this.referenceType);
		if (this.referenceType == "extraction" || businessRuleId) {
			this.addExtractionTestCaseButtons();
		}
		this.showTestCaseListView = true;
	}
};
</script>

<style lang="scss"></style>
