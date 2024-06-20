<template>
	<DataTable :parameters="tableParams"></DataTable>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import TestCaseService from "@/idp/services/TestCaseService.js";
import EventBus from "@/EventBus";
import constants from "@/resources/Constants.js";

export default {
	name: "TestCaseHistoryList",

	props: {
		referenceId: String
	},

	components: {
		DataTable
	},

	data: function() {
		return {
			tableParams: {
        apiName: constants.TEST_CASE_HISTORY_ENDPOINT,
        aggregation: true,
        tableName: "de_test_history",
        select: ["name", "file_name", "created_at", "updated_at", "created_by", "status", "test_case_id", "run_id"],
        tableHeaderConfigParams: {
        },
        isRestify: true,
        queryParam: {
          reference_id: this.$props.referenceId,
        },
        isRegxSearch:true,
        limit: 10,
        hideAddButton: true,
        initialSort : "-created_at",
		refreshButton: true,
		customfilter: true,
      }
		};
	},

	methods: {
		
	},

	created() {},
	mounted() {},
	beforeDestroy() {},
	beforeMount() {
		this.registerEvents();
	}
};
</script>

<style lang="scss"></style>
