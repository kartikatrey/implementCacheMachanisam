<template>
	<div>
		<el-tag
			:type="tagType"
			effect="plain"
			size="small"
			class="worflow-instance-status"
		>
			{{ workflowInstanceStatus }}
		</el-tag>
	</div>
</template>

<script>
import Constants from "@/resources/Constants.js";
import _ from "lodash";

export default {
	name: "WorkflowInstanceStatus",

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
			tagType: "",
			workflowInstanceStatus: "",
			fieldName: ""
		};
	},

	methods: {
		setFieldName() {
			this.fieldName = _.get(this.$props.propData, "column.field");
		},

		setStatus() {
			this.workflowInstanceStatus = _.get(
				this.$props.propData,
				`row.${this.fieldName}`
			);
		},

		setTagType() {

            const worflowInstanceStatusMap = {
                [Constants.WORKFLOW.STATUS.COMPLETED] : "success",
                [Constants.WORKFLOW.STATUS.SUSPENDED] : "warning",
                [Constants.WORKFLOW.STATUS.FAILED] : "danger",
                [Constants.WORKFLOW.STATUS.CANCELLED] : "danger",
                [Constants.WORKFLOW.STATUS.RESUMED] : "info",
                [Constants.WORKFLOW.STATUS.IN_PROGRESS] : "", // Empty string represents the blue color for el-tags
            }
            if(this.workflowInstanceStatus){
                this.tagType = worflowInstanceStatusMap[this.workflowInstanceStatus];
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
.worflow-instance-status {
	border-radius: 30px !important;
}
</style>
