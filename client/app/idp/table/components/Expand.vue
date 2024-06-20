<template>
	<div v-if="isUploadFailed()">
		<div class="column-title">{{ stateFailMessage }}</div>
	</div>
	<div v-else-if="data.row.expand_message">
		<div class="column-title">{{ data.row.expand_message }}</div>
	</div>
	<div v-else-if="columns.length > 0">
		<div
			v-for="(column, key) in columnsChunks"
			v-bind:key="key"
			class="expand-container"
		>
			<el-row>
				<el-col v-if="column[0]" :span="6">
					<div class="column-title">
						{{ column[0] && column[0].label }}
					</div>
					<div
						v-bind:class="[
							column[0].custom_class
								? 'custom_class'
								: 'column-value'
						]"
					>
						{{ (column[0] && currentRow[column[0].name]) || "-" }}
					</div>
				</el-col>
				<el-col v-if="column[1]" :span="12">
					<div class="column-title">
						{{ column[1] && column[1].label }}
					</div>
					<div
						v-bind:class="[
							column[1].custom_class
								? 'custom_class'
								: 'column-value'
						]"
					>
						{{ (column[1] && currentRow[column[1].name]) || "-" }}
					</div>
				</el-col>
			</el-row>
		</div>
	</div>
	<div
		class="expand-container"
		v-else-if="expandTableParams.type"
		v-loading="loader"
	>
		<DataTable
			v-if="showExpandTable"
			:tableProps="parameters"
		></DataTable>
		<span v-else> No data found.</span>
	</div>
	<div v-else>
		Something went wrong !
	</div>
</template>

<script>
import _ from "lodash";
import constants from "@/resources/Constants";
import DataTable from "../IdpDataTable.vue";
import DocumentPackageService from "@/idp/services/DocumentPackageService";
export default {
	name: "Expand",
	props: ["data", "columns", "tableData","expandTableParams"],
	components: {
		DataTable:() => import('../IdpDataTable.vue')
	},
	data() {
		return {
			loader: true,
			showExpandTable:false,
			stateFailMessage: "Error in extracting the data please retry",
			row: {},
			columnsChunks: [],
			currentRow: {},
			parameters: {...this.expandTableParams.parameters,
			 tableConfigLoaded: true,
			}
		};
	},
	methods: {
		prepareData(data, column) {
			let newData = data || {};
			newData["column"] = { property: column.name };
			return newData;
		},
		isUploadFailed() {
			return (
				constants.DOCEX.STATE_UPLOADED.FAILED == this.currentRow.state
			);
		},
		renderExpandTable(queryParam) {
			this.parameters.query = queryParam;
			this.showExpandTable = true;
			this.loader = false;
		},
	},
	beforeMount() {
		 if (this.expandTableParams) {
			const changeReferenceColumnTo = this.expandTableParams.change_reference_column_to; //example -: "email.id", "parent_document_id"
			const queryParam = { [changeReferenceColumnTo] : this.data.row._id , ...this.expandTableParams.extraFilter }
			this.renderExpandTable(queryParam);
			return;
		}
		this.currentRow = _.find(this.tableData, { _id: this.data.row._id });
		this.columnsChunks = _.cloneDeep(_.chunk(this.columns, 2));
		if (
			_.get(this.data, "row.stage") != constants.DOCEX.STAGE.UPLOADED ||
			_.get(this.data, "row.stage") != constants.DOCEX.STAGE.EXTRACTED
		)
			this.stateFailMessage =
				_.get(this.data, "row.publish_failure_reason") ||
				"Error in publishing the data please retry";
		if (_.get(this.data, "row.stage") == constants.DOCEX.STAGE.DUPLICATE)
			this.stateFailMessage = `An invoice with the same invoice no ${this.currentRow.invoice_number} is already present in the system.`;
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../_idpVariables";
@import "../../_idpGlobal";

.expand-container {	
	width: 95%;
	.el-row {
		padding-bottom: 5px;
		margin-bottom: 1rem;
		.column-title {
			color: #718096;
			font-weight: 350;
		}
		.column-value {
			font-size: var(--font-xl);
			color: var(--black);
			font-weight: 600;
			word-wrap: break-word;
		}
		.custom_class {
			color: var(--black);
			word-wrap: break-word;
		}
	}
	.el-col:nth-child(2) {
		padding-left: 20px;
	}
}
</style>
