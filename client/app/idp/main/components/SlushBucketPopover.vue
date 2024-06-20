<template>
	<span>
		<el-popover popper-class="popover-container" v-model="isSlushBucketVisible">
			<div class="slush-bucket-outer-container">
				<div class="slush-bucket-inner-container">
					<div class="slush-bucket-label-container">Widgets</div>
					<DualListBox :source="source" :destination="destination" label="label"
						@onChangeList="handleSelection" />
					<el-divider />
					<div class="slush-bucket-button-container">
						<el-button size="medium" class="cancel-btn" @click="hideSlushBucket">Cancel</el-button>
						<el-button size="medium" type="primary" class="save-btn" @click="handleSlushSave">Save</el-button>
					</div>
				</div>
			</div>
			<span slot="reference" class="mdi mdi-widgets-outline parent"> {{label}}</span>
		</el-popover>
	</span>
</template>

<script>
import DualListBox from "@/idp/components/DualListBox.vue";
export default {
	name: "slushBucketPopover",
	data() {
		return {};
	},
	props: {
		isSlushBucketVisible: { type: Boolean, default: false },
		source: { type: Array, default: [] },
		destination: { type: Array, default: [] },
		label: { type: String, default: "" },
		handleSelection: { default: () => [] },
		handleSave: { default: () => [] }
	},
	methods: {
		hideSlushBucket() {
			this.$emit('update-visibility', false);
		},
		handleSlushSave() {
			this.handleSave();
			this.$emit('update-visibility', false);
		},
		
	},
	components: {
		DualListBox
	}
};
</script>
<style lang="scss">
.popover-container {
	transform-origin: center top !important;
	z-index: 2026 !important;
	height: 100% !important;
	width: 100% !important;
	position: absolute !important;
	top: 0 !important;
	left: 0 !important;
	margin: 0px !important;
	padding: 0px !important;
	border: none !important;
	background-color: rgba(0, 0, 0, 0.2) !important;

	.slush-bucket-inner-container {
		width: 56.5rem;
		background-color: white;
		padding: 2rem 2.5rem;
		border-radius: 0.5rem;
	}

	.slush-bucket-outer-container {
		width: 100%;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0;
		padding: 0;
	}

	.slush-bucket-label-container {
		font-weight: 600;
		margin-bottom: 2rem;
	}

	.list-box-wrapper .actions {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.list-box-wrapper .actions .btn-action {
		margin-bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
			box-shadow 0.15s ease-in-out;
		border-color: none;
	}

	.list-box-wrapper .actions div.btn-action {
		padding: 4px;
	}

	.list-box-wrapper .list-box-item {
		border-radius: 0.25rem;
		border: solid 1px #dcdfe6;
		width: 23rem;
		box-shadow: 2px 3px 6px 0px rgba(0, 0, 0, 0.2);
		.clear-search{ 
			height: 1rem;
			width: 1rem; border-radius: 50%;
			display: flex; 
			justify-content: center; 
			align-items: center;
			margin-top: 0.5rem;
			padding: 0.25rem; 
			padding-bottom: 0.5rem; 
		}
	}

	.list-box-wrapper .list-box-item .bulk-action {
		border-top: solid 1px #dcdfe6;
		font-weight: 600;
		font-size: 1rem;
	}

	.list-box-wrapper .list-box-item .bulk-action .select-all {
		border-bottom-left-radius: 0.25rem;
		background-color: #5a67d8;
	}

	.list-box-wrapper .list-box-item .bulk-action .deselect-all {
		border-bottom-right-radius: 0.25rem;
		border-left: 1px solid #dcdfe6;
	}

	.slush-bucket-button-container {
		float: right;
	}

	.slush-bucket-button-container .cancel-btn {
		border-color: #5a67d8;
		font-weight: 600;
	}

	.slush-bucket-button-container .save-btn {
		font-weight: 600;
	}

	.slush-bucket-button-container .el-button--medium {
		font-size: 1rem;
	}

	.list-box-wrapper .list-box-item .list-group {
		border: none;
	}

	.el-divider--horizontal {
		display: block;
		height: 1px;
		width: 109.7%;
		margin-top: 2.8rem;
		margin-bottom: 1.2rem;
		padding: 0;
		right: 2.5rem;
	}

	.list-box-wrapper .list-box-item .search-box {
		border-bottom: solid 1px #dcdfe6;
	}

	.list-box-wrapper .list-box-item .list-box {
		height: 18.4rem;
	}
}
</style>
