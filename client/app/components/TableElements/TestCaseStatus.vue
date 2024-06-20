<template>
	<div>
		<el-tag
			:type="tagType"
			effect="plain"
			size="small"
			class="test-case-status"
		>
			{{ testCaseStatus }}
		</el-tag>
	</div>
</template>

<script>
import Constants from "@/resources/Constants.js";
import _ from "lodash";

export default {
	name: "TestCaseStatus",

	props: ["propData", "options"],

	watch: {
		// propData changes when refreshed
		propData(newVal, oldVal) {
			this.propData = newVal;
			this.setFieldName();
			this.setStatus();
			this.setTagType();
		}
	},

	data() {
		return {
			tagType: "info",
			testCaseStatus: "",
			fieldName: ""
		};
	},

	methods: {
		// Sets status text from given props
		setFieldName() {
			this.fieldName = _.get(this.$props.propData, "column.field");
		},

		// Sets status from given props
		setStatus() {
			this.testCaseStatus = _.get(
				this.$props.propData,
				`row.${this.fieldName}`
			);
		},

		// Sets el-tag from testCaseStatus
		setTagType() {
			if (this.testCaseStatus == Constants.TEST_CASE_STATUS.PASS) {
				this.tagType = "success";
			} else if (this.testCaseStatus == Constants.TEST_CASE_STATUS.FAIL) {
				this.tagType = "danger";
			} else {
				this.tagType = "";
			}
		}
	},

	beforeMount() {
		this.setFieldName();
		this.setStatus();
		this.setTagType();
	}
};
</script>

<style lang="scss">
.test-case-status {
	border-radius: 30px !important;
}
</style>
