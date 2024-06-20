<template>
	<el-main class="kp-main">
		<section class="page-body">
			<!-- Title and back button -->
			<div class="page-title">
				<el-button
					class="back-button"
					cid="form-header-back"
					icon="mdi mdi-arrow-left-circle-outline"
					v-on:click="$router.push(prevRoute.fullPath)"
				>
				</el-button>
				<span class="page-title-text"> {{ pageTitle }}</span>
				<span> Add a new test case or edit existing test case </span>
			</div>

			<!-- Form -->
			<section class="form-page-container">
				<div class="panel">
					<div class="panel-body" v-loading="testCaseFormLoading">
						<el-form
							:model="form"
							:rules="formRules"
							ref="form"
							label-position="left"
							label-width="120px"
						>
							<div class="grouping-tile">
								General configuration
							</div>
							<el-row :gutter="40">
								<el-col :span="12">
									<div class="kp-form-group">
										<el-form-item prop="name" label="Name">
											<el-input
												name="name"
												cid="test-case-form-name"
												v-model="form.name"
												placeholder="Test case name"
											></el-input>
										</el-form-item>
									</div>
								</el-col>

								<el-col :span="12">
									<div class="kp-form-group">
										<el-form-item
											prop="test_case_file_id"
											label="Test Document"
										>
											<el-select
												name="Test Document"
												clearable
												filterable
												cid="test-case-form-test-document-select"
												v-model="selectedTestCaseFile"
												@change="onTestCaseFileChange"
												placeholder="Select"
											>
												<el-option
													v-for="(value,
													index) in deTestCaseFilesList"
													:key="value.label + index"
													:cid="
														'test-case-form-document_' +
															index
													"
													:value="value"
													:label="value.label"
												></el-option>
											</el-select>
										</el-form-item>
									</div>
								</el-col>
							</el-row>

							<el-row :gutter="40">
								<el-col>
									<div class="kp-form-group">
										<el-form-item
											prop="description"
											label="Description"
										>
											<el-input
												name="description"
												cid="test-case-description"
												v-model="form.description"
												type="textarea"
												:autosize="{
													minRows: 6,
													maxRows: 6
												}"
												placeholder="Test case description"
											></el-input>
										</el-form-item>
									</div>
								</el-col>
							</el-row>

							<el-row :gutter="40">
								<el-col :span="12">
									<div class="kp-form-group">
										<el-form-item
											prop="isAdvanced"
											label="Advanced Script"
										>
											<toggle-button
												:sync="true"
												:color="{
													checked: '#5f8fdf',
													unchecked: '#DCDFE6',
													disabled: '#CCCCCC'
												}"
												:labels="{
													checked: 'YES',
													unchecked: 'NO'
												}"
												cid="test-case-form-is-advanced-script"
												v-model="form.is_advanced"
											></toggle-button>
										</el-form-item>
									</div>
								</el-col>
							</el-row>

							<el-row v-if="!form.is_advanced" :gutter="40">
								<el-col :span="12">
									<div class="kp-form-group">
										<el-form-item
											prop="isMultiTable"
											label="Is Multi Table"
										>
                                        <el-checkbox 
											class="is-multi-table" 
											prop="isMultiTable" 
											v-model="form.is_multi_table"
											@change="confirmChangeMultiTable()"
										>
										</el-checkbox>
										</el-form-item>
									</div>
								</el-col>
							</el-row>

							<!-- QUERY BUILDER NEEDS TO CHANGE -->
							<el-row v-if="showTestCaseForm && !form.is_advanced" :gutter="40">
								<TestCaseQueryBuilder
									:initFormData="form.rule"
									:documentType="form.document_type"
									:headerFields="headerFields"
									:tableFields="tableFields"
									:testCaseType="form.reference_type"
									@queryChanged="handleQueryChanged"
								></TestCaseQueryBuilder>
							</el-row>

							<el-row v-if="form.is_advanced" :gutter="40">
								<el-col :span="24">
									<div class="kp-form-group">
										<el-form-item
											class="kp-form-field-label code-mirror"
											prop="script"
											label="Script"
										>
											<KanverseEditor
												:options="{
													width: '100%',
													height: '500px',
													language: 'businessRule'
												}"
												:content="form.script"
												:refreshModel="
													form._id !== undefined
												"
												v-model="form.script"
												@onDidChangeModelContent="
													handleContentChange
												"
											>
											</KanverseEditor>
										</el-form-item>
									</div>
								</el-col>
							</el-row>
						</el-form>
					</div>

					<!-- | panel body -->
					<!-- Only show run button when the form is saved  -->
					<footer>
						<div></div>

						<div v-if="this.$route.query.id">
							<el-dropdown split-button @command="handleRunClicked" @click="handleRunClicked('run_as_file_upload')" size="small" cid="test-case-form-run-btn" class="test-case-form-run-btn">{{selectedCommandText}}
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item command="run_as_new_file" >Run As New File</el-dropdown-item>
									<!-- <el-dropdown-item command="run_as_save_draft" >Run As Save Draft</el-dropdown-item> -->
								</el-dropdown-menu>
							</el-dropdown>
						</div>

						<div>
							<el-button
								v-on:click="$router.push(prevRoute.fullPath)"
								size="small"
								cid="test-case-form-cancel"
							>
								Cancel
							</el-button>
						</div>

						<div>
							<el-button
								id="save-btn"
								:disabled="disableSave"
								v-on:click="save"
								size="small"
								cid="test-case-form-save"
								type="primary"
							>
								Save
							</el-button>
						</div>
					</footer>
				</div>
				<!-- | panel -->
			</section>
			<!-- | form-page-container -->
		</section>


		<section class="br-test-case-form-list" v-if="this.$route.query.id">
			<el-tabs v-if="this.$route.query.id" class="br-test-case-tabs" v-model="activeTab"  v-loading="testCaseFormLoading">
				<el-tab-pane label="Test Case History" name="RunHistory">
					<data-table
						v-if="this.$route.query.id"
						:parameters="tableParams"
						ref="datatable"
					></data-table>
				</el-tab-pane>
				<el-tab-pane label="Test Case Logs" name="TestCaseLogs">
					<ScriptLogs
						:queryId="$route.query.id"
						:testLogs="testCaseLogs"
						:logsLoading="logsLoading"
						:showRefreshButton="true"
						@scriptLogsRefreshed="handleScriptLogsRefresh"
					>
					</ScriptLogs>
				</el-tab-pane>
			</el-tabs>
		</section>
	</el-main>
</template>

<script>
import DataTable from "@/components/DataTable";
import Constants from "@/resources/Constants";
import KanverseEditor from "@/components/KanverseEditor";
import TestCaseQueryBuilder from "@/idp/components/TestCaseQueryBuilder";
import TestCaseService from "@/idp/services/TestCaseService.js";
import TestCaseFilesService from "@/idp/services/TestCaseFilesService.js";
import FieldService from "@/idp/services/FieldService.js";
import LogService from "@/idp/services/LogService.js";
import ScriptLogs from "@/idp/components/ScriptLogs.vue";
import TestService from "@/idp/services/TestService.js";
import EventBus from "@/EventBus";
import $ from "jquery";
import _ from "lodash";
let prevRoute = null;

export default {
	name: "TestCaseForm",

	components: {
		KanverseEditor,
		TestCaseQueryBuilder,
		DataTable,
		ScriptLogs
	},

	data: function() {
		return {
			activeTab: "RunHistory",
      		prevRoute: prevRoute,
			referenceRoute: "",
			recordsId: "",
			pageTitle: "Test case",
			deTestCaseFilesList: [],
			disableSave: false,
			isRefreshing: false,
			currentRunId: "",
			testCaseLogs: [],
			logsLoading: false,
			headerFields: [],
			tableFields: [],
			selectedTestCaseFile: null,
			testCaseFormLoading: false,
			showTestCaseForm: false,
			tableParams: {
				apiName: Constants.TEST_CASE_HISTORY_ENDPOINT,
				aggregation: true,
				tableName: "de_test_history",
				pageTitle: "",
				tableHeaderConfigParams: {},
				isRestify: true,
				isRegxSearch: true,
				limit: 10,
				hideAddButton: true,
				initialSort: "-created_at",
				refreshButton: true,
				customfilter: true,
				queryParam: {
					test_case_id: this.$route.query.id
				},
				select: [
					"name",
					"file_name",
					"created_at",
					"updated_at",
					"created_by",
					"status",
					"test_case_id",
					"run_id"
				],
				tableHeaderConfigParams: {},
				isRestify: true,
				queryParam: {
					test_case_id: this.$route.query.id
				},
				isRegxSearch: true,
				limit: 10,
				hideAddButton: true,
				initialSort: "-created_at",
				refreshEventName: "test_case_history_table",
			},
			form: {
				name: "",
				test_case_file_id: "",
				description: "",
				is_advanced: false,
				rule: [],
				script: `(()=> {\n\t// Return true/false to pass/fail test case\n\treturn true;\n})();`,
				reference_type: "",
				reference_id: null,
				document_type: "",
				is_multiTable: false,
			},
			formRules: {
				name: [
					{
						required: true,
						trigger: "blur",
						message: "Please provide test case name"
					}
				],
				test_case_file_id: [
					{
						required: true,
						trigger: "blur",
						message: "Please provide test case file"
					}
				],
				description: [
					{
						required: true,
						trigger: "blur",
						message: "Please provide description"
					}
				]
			},
			selectedCommandText: "Run As File Upload"
		};
	},

	watch: {
		form: {
			handler(newVal, oldVal) {
				this.form = newVal;
			}
		},
	},

	methods: {
		async confirm(message) {
			try {
				await this.$confirm(message,'Confirm', {
					closeOnClickModal: false,
					confirmButtonText: 'Yes',
					cancelButtonText: 'No'
				});
				return true;
			} catch (error) {
				return false;
			}
		},
		async confirmChangeMultiTable() {
			let tableFormData = this.form.rule.find(item => item.field_name === 'table' || item.field_name === 'multi_table');
			if (_.isEmpty(tableFormData) || (tableFormData && tableFormData.data.length === 0)) {
				EventBus.$emit("testCaseForm_isMultiTable", this.form.is_multi_table);
				return;
			}
			const isConfirmed = await this.confirm('Changing the table mode will result in clearing the current data. Are you sure you want to proceed?');
			if(isConfirmed){
				this.form.rule = this.form.rule.filter(item => item.field_name !== 'table' && item.field_name !== 'multi_table');
			} else {
				this.form.is_multi_table = !this.form.is_multi_table;
			}
			EventBus.$emit("testCaseForm_isMultiTable", this.form.is_multi_table);
		},
		async onTestCaseFileChange(){
			if(!this.selectedTestCaseFile){
				this.form.test_case_file_id = "";
				return;
			}
			this.form.test_case_file_id = this.selectedTestCaseFile.value;
			this.form.document_type = this.selectedTestCaseFile.document_type;
			await this.getFields();
		},
		// Fetches all test case files for the dropdown
		async getDeTestCaseFiles() {
			try {
				let testCaseFiles = [];
				const testCaseFilesData = await TestCaseFilesService.fetchAllFiles();
				_.forEach(testCaseFilesData, testFileConfig => {
					testCaseFiles.push({
						label: testFileConfig.file_name,
						value: testFileConfig._id,
						document_type: testFileConfig.document_type
					});
				});

				this.deTestCaseFilesList = testCaseFiles;

				return true;
			} catch (error) {
				return false;
			}
		},

		// Fetches fields for test case file's document type
		async getFields() {
			let query = {
				active: true
			}

			if (this.form.document_type) {
				query['document_type'] = this.form.document_type;
			}

			const fields = await FieldService.getFieldsList(
				query,
				["_id", "label", "name", "field_type", "document_type"]
			);
			const tableFields = [];
			const headerFields = [];

			for (const field of fields) {
				if (field.field_type == "header") {
					headerFields.push({
						_id : field._id + "",
						label: field.label,
						value: field.name,
						document_type: (this.form.document_type? "": field.document_type)
					});
				}
				else if (field.field_type == "table") {
					tableFields.push({
						_id : field._id + "",
						label: field.label,
						value: field.name,
						document_type: (this.form.document_type? "": field.document_type)
					})
				}
			}

			headerFields.sort((a, b) => a.label.localeCompare(b.label));
			tableFields.sort((a, b) => a.label.localeCompare(b.label));

			this.tableFields = tableFields;
			this.headerFields = headerFields;
		},

		// Change form rule when testCaseQueryBuilder changes the rule
		async handleQueryChanged(query) {
			this.form.rule = query;
		},
		async handleRunAsNewFile(){
			this.selectedCommandText = "Run As New File"
			const runType = Constants.TEST_CASE_RUN_TYPES.NEW_FILE;
			const testCaseRes = await this.runTestCase(runType);
			return testCaseRes;
		},
		async handleRunAsFileUpload(){
			this.selectedCommandText = "Run As File Upload"
			const runType = Constants.TEST_CASE_RUN_TYPES.FILE_UPLOAD;
			const testCaseRes = await this.runTestCase(runType);
			return testCaseRes;
		},
		async handleRunAsSaveDraft(){
			this.selectedCommandText = "Run As Save Draft"
			const runType = Constants.TEST_CASE_RUN_TYPES.SAVE_DRAFT;
			const testCaseRes = await this.runTestCase(runType);
			return testCaseRes;
		},
		notifyMessagesToUser(data){
			let errorMessage = "";
			data.forEach(item => {
				if (item.status == false) {
					errorMessage += `File: ${item.file_name}, Message: ${item.message}\n`;
				}
			});

			if (errorMessage) {
				this.notifyError(errorMessage);
			} else {
				this.notifySuccess("Test case run successfully");
			}
		},
		/**
		 * Purpose: To handle run test cases flow
		 * @param {Boolean} runAsNew  A boolean value to perform test case execution
		 */
		async handleRunClicked(command) {
			if(!command){
				return;
			}
			const commandToActionMap = {
				"run_as_new_file": this.handleRunAsNewFile,
				"run_as_file_upload": this.handleRunAsFileUpload,
				"run_as_save_draft": this.handleRunAsSaveDraft
			}
			
			const runTestCaseResponse = await commandToActionMap[command]();
			
			// Test case form is not valid not proceeding further
			if(!runTestCaseResponse){
				this.selectedCommandText = "Run As File Upload";
				return ;
			}

			this.disableSave = true;

			if(command == "run_as_file_upload"){
				this.activeTab = "TestCaseLogs";
				this.logsLoading = true;
			}

			this.currentRunId = _.get(runTestCaseResponse, "data.run_id");
			const data  = _.get(runTestCaseResponse, "data.data");

			this.logsLoading = false;
			this.disableSave = false;

			// if action is save draft then open document in new tab
			if(command == "run_as_save_draft"){
				const documentPath = "/idp/document-view";
				const url = this.$router.resolve({ path: documentPath, query: { id : documentId } }).href;
				window.open(url, '_blank');
			} else if(command == "run_as_new_file"){
				this.notifySuccess(`File is being uploaded on ${this.form.document_type} List view. You can refresh the test case logs after extraction of document is completed.`);
			} else {
				this.activeTab = "TestCaseLogs";
				this.notifyMessagesToUser(data);
				await this.handleScriptLogsRefresh();
			}
			this.selectedCommandText = "Run As File Upload";

		},
		isFormEmpty(){
			// Check header fields are present or not
			let isFormEmpty = true;

			if (this.form.rule && this.form.rule.length) {
				isFormEmpty = !this.form.rule.some(rule => rule.field_name !== 'table' && rule.field_name !== 'classification');
			}  
			// Check for table and classification fields
			this.form.rule.some(rule => {
				if (rule.data && rule.data.length) {
					isFormEmpty = false;
					return true;
				}
			});
			return isFormEmpty;
		},
		async runTestCase(runType){
			try {
				if (this.isFormEmpty() && !this.form.is_advanced){
					this.notifyError("Please fill the test case form to run the test case");
					return false;
				}

				this.notifySuccess("Test case execution is in progress, Logs tab will auto-refresh upon completion.");
				this.$setLoader({
					target: ".test-case-form-run-btn",
					spinner: "el-icon-loading",
				});

				const payload = { runType : runType, referenceType: this.form.reference_type };
				let response = await TestCaseService.runTestCase(this.recordId, payload);

				this.$resetLoader();
				return response;
			} catch (error) {
				this.$resetLoader();
				this.notifyError("Error while running test case");
				console.log("Error while running test case", error);
			}
		},

		// Fetch new script logs by current run id when refresh button clicked
		async handleScriptLogsRefresh() {
			if (this.currentRunId) {
				const filter = {run_id: this.currentRunId}
				const logResponse = await LogService.getLogs(Constants.TEST_CASE_HISTORY_ENDPOINT, filter);
				
				EventBus.$emit("refreshTable__test_case_history_table"); // Refresh the Test Case History table

				if(_.isEmpty(logResponse[0].logs)){
					return
				}
				let logs = logResponse[0].logs.map((data) => {
					return {
						message: data.message? data.message: data,
						type: data.type? data.type: "info",
						updated_at: logResponse[0].updated_at
					}
				});
				logs[0]['file_id'] = logResponse[0].doc_id
        		this.testCaseLogs = logs;
			}
		},

		// Change form script when script component updates
		handleContentChange(event, content) {
			this.form.script = content;
		},

		// Insert new test case to de_test_case
		async save() {
			this.disableSave = true;
			try {
				let valid = await this.$refs.form.validate().catch(error => {
					return false;
				});
				if (!valid) {
					console.log(JSON.stringify(this.form, null, 4));
					console.log("not valid");
					this.disableSave = false;
					return;
				}

				if (!this.recordId || this.isCloningEnabled) {
					const response = await TestCaseService.save(this.form);
					if (!response.data || !response.data._id) {
						throw new Error("Error while saving");
					}
					this.notifySuccess("Test case added successfully");
					this.$router.push({
						path:
							Constants.TEST_CASE_FORM_ENDPOINT +
							`?id=${_.get(response, "data._id")}`
					});
				} else {
					const response = await TestCaseService.findByIdAndUpdate(
						this.form,
						this.recordId
					);
					if (!response.data || !response.data._id) {
						throw new Error("Error while saving");
					}
					this.notifySuccess("Test case updated successfully");
				}
			} catch (error) {
				this.notifyError("Error while saving data");
			} finally {
				this.disableSave = false;
			}
		},
		formatClonedData(testCaseData) {
			
			let modifiedForm = { ...testCaseData };

			// List of keys to remove
			const keysToRemove = [
				"_id",
				"created_at",
				"created_by",
				"updated_at",
				"updated_by",
			];

			// Remove specified keys from the formData object
			keysToRemove.forEach(key => {
				if (modifiedForm.hasOwnProperty(key)) {
					delete modifiedForm[key];
				}
			});

			// Update the name as Copy of <original file name>
			modifiedForm.name = `Copy of ${modifiedForm.name}`;
			return modifiedForm;
		},
		// Get saved form data if present
		async init() {
			try {				
				let testCaseData = await TestCaseService.fetchById(
					this.recordId
				);
				 this.isCloningEnabled = this.$route.query.clone;
				if(this.isCloningEnabled){
					testCaseData = this.formatClonedData(testCaseData)
				}
				this.form = Object.assign({}, this.form, testCaseData);
				this.selectedTestCaseFile = {
					document_type: testCaseData.document_type,
					label: testCaseData.test_case_file_name,
					value: testCaseData.test_case_file_id
				}
			} catch (error) {
				this.notifyError("Error while fetching data");
			}
		}
	},

	async beforeMount() {
		this.testCaseFormLoading = true;

		this.$store.commit("setDisplayIdpTree", false);
		this.$store.commit("setDisplayIdpNavbar", true);

		this.recordId = this.$route.query.id;
		if (this.recordId) {
			await this.init();
		} else {
			this.form.reference_type = this.$route.query.referenceType;
			this.form.reference_id = this.$route.query.referenceId;
			this.form.document_type = this.$route.query.documentType;
		}

		await this.getDeTestCaseFiles();
		await this.getFields();
		this.testCaseFormLoading = false;
		this.showTestCaseForm = true;

		this.$nextTick(() => {
			EventBus.$emit("testCaseForm_isMultiTable", this.form.is_multi_table);
		})
	},

	beforeRouteEnter(to, from, next) {
		prevRoute = from;
		next();
  	},
	
	beforeDestroy(){
		EventBus.$off("testCaseForm_isMultiTable");
	}
};
</script>

<style lang="scss">
@import "../_idpGlobal";

.form-page-container {
	.br-test-case-status {
		display: flex;
		align-items: center;

		.el-button {
			border: none;
		}
		.br-test-case-status-icon {
			margin-left: 5.5rem;
		}
		.br-test-case-status-text {
			margin-left: 0.75rem;
		}
	}
	margin-bottom: 2.5rem;

	.test-case-form-run-btn{
		.el-loading-mask{
			margin-left: 0px;
			opacity: 75%;
		}
	}
}
</style>
