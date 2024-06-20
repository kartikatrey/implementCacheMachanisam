<template>
	<div>
		<el-dropdown-item
			:cid="'table-action-script-dialog-' + propData.index"
			v-if="type == 'dropdown'"
			:command="compareRecord"
		>
			<span :class="icon"></span>Compare
		</el-dropdown-item>

		<!-- Dialog for displaying script details -->
		<div v-if="loader">
			<el-dialog
				width="1100px"
				v-if="displayDialog"
				:close-on-click-modal="false"
				:show-close="false"
				:destroy-on-close="true"
				class="folder-modal-container version-compare-dialog"
				:visible.sync="dialogVisible"
				:append-to-body="true"
				center
			>
			<el-divider class="version-compare-dialog-title" content-position="left">Compare Version</el-divider>
				<div>
					<div class="select-compare-version-wrapper">
						<div>
							<span class="label">Compare with :</span>
							<el-radio-group
								v-model="compareWith"
								size="mini"
								@change="compareRecord"
							>
								<el-radio label="current">Current version</el-radio>
								<el-radio label="other">Other version</el-radio>
							</el-radio-group>
						</div>

						<!-- Select version dropdown -->
						<div v-if="compareWith == 'other'" class="select-version-wrapper">
							<div class="select-version-label">Select version :</div>
							<el-select
								name="select_version"
								v-model="targetVersionId"
								placeholder="Select version to compare with"
								@change="compareRecord"
							>
								<el-option
									v-for="(version, index) in versionIdLabelMap"
									:key="version._id"
									:label="version.label"
									:value="version._id"
								></el-option>
							</el-select>
						</div>
					</div>

					<!-- Display selected and compared versions -->
					<div style="display: flex">
						<div class="selected-script">
							Selected Version : {{ selectedVersionLabel }}
						</div>
							<div class="target-script">
								Compare With : {{ targetVersionLabel }}
							</div>
					</div>

					<div class="dark-mode-switch">
						Dark Theme
						<el-switch v-model="isDarkTheme" @change="handleThemeChange">
						</el-switch>
					</div>
					<!-- Code editor container -->
					<div
						ref="container"
						style="height: 320px; width: 100%;"
					></div>

					<!-- Footer buttons -->
					<footer>
						<div class="compare-version-close-btn">
							<el-button
								v-on:click="cancel"
								class="btn btn-sm btn-default"
								cid="compare-version-close"
							>
								Close
							</el-button>
						</div>
					</footer>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
import dedent from "dedent";
import VersionService from "@/idp/services/VersionService";
import LookupHistoryService from "@/idp/services/LookupHistoryService";
import * as monaco from "monaco-editor";
import moment from "moment";

export default {
	name: "CompareVersions",
	props: ["propData", "type"],
	data() {
		return {
			icon: "mdi mdi-compare action-btn dropdown-btn compare-btn",
			loader: false,
			dialogVisible: true,
			displayDialog: false,
			targetVersionData: "",
			selectedVersionData: "",
			compareWith: "current",
			allVersions: [],
			targetVersionId: "",
			versionIdLabelMap: [],
			selectedVersionLabel: "",
			targetVersionLabel: "",
			isDarkTheme: false,
			selectedTheme: 'vs'
		};
	},
	methods: {
		// Get service to fetch version data
		getService(table){
			return table? LookupHistoryService: VersionService;
		},

		async compareRecord() {
			// Get the compare table name
			this.table = _.get(this.propData, "column.compareOptions.table_name");

			// If the comparison type is 'other' and there's no target version ID selected, return.
			if (this.compareWith === "other" && !this.targetVersionId) return;

			// Set loader
			this.$setLoader({
				target: "#mdi-compare",
				spinner: "el-icon-loading"
			});
			this.displayDialog = true;
			let record = this.propData.row;

			// Fetch selected version data
			let selectedVersionData = await this.getService(this.table).fetchById(record._id);
			this.selectedVersionLabel = this.getVersionLabel(selectedVersionData);
			// Format selectedVersionData like replace /t with "  "
			selectedVersionData = this.formatCode(
				JSON.parse(selectedVersionData.record || "{}")
			);
			// dedent is used to remove leading whitespace from multiline strings or single-line strings for improved code readability and consistency.
			this.selectedVersionData = dedent(
				`${JSON.stringify(selectedVersionData, null, 2)}`
			);

			// Every time we change the version for comparison, all version names are fetched. With large data, this takes a lot of time.
			// So we are checking if we have previously fetched records in the 'allVersions' array.
			// If yes, then use the same data. If the array is empty, then fetch new data.
			if(_.isEmpty(this.allVersions)){
				await this.fetchVersionsNames();
			}

			let targetVersionData;
			// Compare with other version
			if (this.compareWith == "other") {
				// Get version data of target version to compare data with
				targetVersionData = await this.getService(this.table).fetchById(this.targetVersionId);
				this.targetVersionLabel = this.getVersionLabel(targetVersionData);
			}
			// Compare with current version
			else {
				const recordId = _.get(this.propData,"row.record_id");
				const projection = ["record", "created_by", "created_at"]
				// Fetch current version by the record Id
				targetVersionData = await this.getService(this.table).fetchCurrentVersionByRecordId(recordId, projection);
				targetVersionData = targetVersionData[0] || "{}"
				this.targetVersionLabel = this.getVersionLabel(targetVersionData);
			}
			targetVersionData = JSON.parse(targetVersionData["record"] || "{}");
			// Format target version data
			targetVersionData = this.formatCode(targetVersionData);
			this.targetVersionData = dedent(
				`${JSON.stringify(targetVersionData, null, 2)}`
			);

			if (this.selectedVersionData && this.targetVersionData) {
				this.$resetLoader();
				this.loader = true;
			}

			// Render code comparison
			this.createDiffEditor()
		},

		// Function to create a diff editor for displaying differences between two versions of code.
		createDiffEditor() {
			// Wait for the next tick to ensure the DOM is updated before creating the editor.
			this.$nextTick(() => {
				// Create models for the original and modified code.
				const originalModel = monaco.editor.createModel(
					this.selectedVersionData,
					"javascript"
				);
				const modifiedModel = monaco.editor.createModel(
					this.targetVersionData,
					"javascript"
				);

				// Dispose the existing diff editor, if any.
				if (this.diffEditor) {
					this.diffEditor.dispose();
				}

				// Create a new diff editor instance to display the difference between versions
				this.diffEditor = monaco.editor.createDiffEditor(
					this.$refs.container,
					{
						readOnly: true, // Set editor to read-only mode
						theme: this.selectedTheme || 'vs' // Set editor theme (default to 'vs')
					}
				);

				// Set the models for the original and modified code in the diff editor.
				this.diffEditor.setModel({
					original: originalModel,
					modified: modifiedModel
				});
			});
		},

		cancel() {
			this.displayDialog = false;
			this.compareWith = "current";
			this.targetVersionId = "";
			this.selectedTheme = 'vs';
			if(this.loader === true){
				this.loader = false;
			}
		},

		// Function to format code in a collection by replacing tabs with spaces and ensuring consistent quotation marks.
		formatCode(collectionData) {
			try {
				let value = "";
				for (let key in collectionData) {
					value = collectionData[key];
					if (
						value != null &&
						typeof value === "string" &&
						value.includes("\t")
					) {
						value = value.replaceAll("\t", "  ");
						value = value.replaceAll('"', "'");
						collectionData[key] = value;
					}
				}
				return collectionData;
			} catch (error) {
				this.notifyError("Error while formatting code!!");
				console.error(error);
			}
		},

		async fetchVersionsNames() {
			const recordId = _.get(this.propData,"row.record_id");
			const projection=["_id", "created_by", "created_at"];
			// Fetch all versions associated with the record ID.
			this.allVersions = await this.getService(this.table).fetchVersionsByRecordId(recordId, projection);
			// Generate a mapping of version IDs to their corresponding labels for select version dropdown.
			this.versionIdLabelMap = this.allVersions.map(version => {
				return {
					_id: version._id,
					label: this.getVersionLabel(version)
				};
			});
		},

		/**
			Function to generate a label for display in the select version dropdown.
			The label format includes the creator, creation date, and time.
			Format: "<created_by> <created_at> (in format Do MMM YYYY h:mm A)"
			Example: "Document Publisher 2nd May 2024 5:27 PM"
		*/
		getVersionLabel(version) {
			const formattedDate = moment(version.created_at).format("Do MMM YYYY h:mm A") || "";
			return `${version.created_by} ${formattedDate}`;
		},

		// Create diff editor according to selected theme.
		handleThemeChange(){
			this.selectedTheme = this.isDarkTheme ? "vs-dark" : "vs";
			this.createDiffEditor()
		},

	}
};
</script>

<style lang="scss">
@import "../../idp/_idpVariables";
.version-compare-dialog{
	display: flex;
	align-items: center;

	.el-dialog{
		margin-top: 0px !important;
		padding: 1rem 2.5rem 1.5rem 2.5rem;

		.version-compare-dialog-title{
			margin-bottom: 2.5rem;
			.el-divider__text {
				font-weight: 600;
				font-size: 16px;
			}
		}

		.el-dialog__body{
			.select-compare-version-wrapper{
				display: flex;
				gap: 14.75rem;
				margin-bottom: 1rem;
			}
			.select-version-wrapper{
				display: -webkit-box;
				.select-version-label{
					margin-right: 1rem;
				}
				.el-select{
					min-width: 306px;
				}
			}
		}

		.compare-version-close-btn {
				display: flex;
				justify-content: end;
				align-items: center;
				padding-top: 1.5rem;
				border-top: 1px solid var(--dark-06);
				margin-top: 1.5rem;
		}
		.selected-script {
			flex-grow: 1;
			padding-bottom: 0;
			margin-bottom: 0;
			font-weight: 600;
			margin-top: 1.33em;
		}
		.target-script {
			flex-grow: 1;
			padding-left: 3.5rem;
			padding-bottom: 0;
			margin-bottom: 0;
			font-weight: 600;
			margin-top: 1.33em;
		}
		.dark-mode-switch{
			display: flex;
			justify-content: end;
			gap: 6px;
		}
	}
}
</style>
