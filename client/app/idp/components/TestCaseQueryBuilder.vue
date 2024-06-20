<template>
	<el-col :span="24">
		<div class="kp-form-group">
			<el-form-item v-if="testCaseType == 'extraction'" class="kp-form-field-label"
				label="Classification Assertions">
				<el-row>
					<!-- Add new test case button -->
					<el-button size="small" class="btn-add-new-test-case" @click="createNewClassificationTestCase">
						Add
					</el-button>
				</el-row>
				<el-row class="test-case-tables">
					<!-- Classification form -->
					<el-table :data="classificationForm">
						<!-- Assertion No. column -->
						<el-table-column prop="assertion_no" label="Page #" width="120" align="center">
						</el-table-column>
						<!-- Field name column -->
						<el-table-column prop="page_type" label="Page type" width="240">
							<template slot-scope="scope">
								<el-select name="expected_value" clearable filterable cid="test-case-form-query-expected_value"
									v-model="classificationForm[scope.$index].expected_value" placeholder="Select"
									@change="emitQueryChanged">
									<el-option v-for="(value, index) in classificationFields" :key="value.value"
										:cid="'classification-page-type_' + index" :value="value.value"
										:label="value.label"></el-option>
								</el-select>
							</template>
						</el-table-column>

						<!-- Action button column  -->
						<el-table-column width="120">
							<template slot-scope="scope">

								<div class="testcase-rows-action-btns">
									<!-- Delete Button -->
									<el-button @click.native.prevent="deleteClassificationFormRow(scope.$index)" type="text" size="medium"
										class="header-test-case-row-buttons">
										<i class="mdi mdi-delete"></i>
									</el-button>

									<!-- Copy Button -->
									<el-button @click.native.prevent="cloneClassificationFormRow(scope.$index)" type="text" size="medium"
										class="header-test-case-row-buttons">
										<i class="mdi mdi-content-copy"></i>
									</el-button>
								</div>
							</template>
						</el-table-column>
					</el-table>
				</el-row>
				<br />
			</el-form-item>
			<el-form-item class="kp-form-field-label" label="Header Fields">
				<el-row>
					<!-- Add new test case button -->
					<el-button
						size="small"
						class="btn-add-new-test-case"
						@click="createNewHeaderTestCase"
					>
						Add
					</el-button>
				</el-row>
				<el-row class="test-case-tables">
					<!-- Table -->
					<el-table :data="headerForm">
						<!-- Assertion No. column -->
						<el-table-column prop="assertion_no" label="Assertion #" width="120" align="center">
						</el-table-column>
						<!-- Field name column -->
						<el-table-column prop="field_name" label="Field Name" width="240">
							<template slot-scope="scope">
								<el-select
									name="field_name"
									clearable
									filterable
									cid="test-case-form-query-name-select"
									v-model="headerForm[scope.$index].field_name"
									placeholder="Select"
									@change="emitQueryChanged"
								>
									<el-option
										v-for="(value, index) in headerFields"
										:key="value.value"
										:cid="
											'business-rule-form-document-type_' +
												index
										"
										:value="value.value"
										:label="value.label + (value.document_type? ` (${value.document_type})`: '')"
									></el-option>
								</el-select>
							</template>
						</el-table-column>

						<!-- Field type column -->
						<el-table-column
							prop="field_type"
							label="Type"
							width="140"
						>
							<template slot-scope="scope">
								<el-select
									name="field_type"
									clearable
									filterable
									cid="test-case-form-query-type-select"
									v-model="headerForm[scope.$index].field_type"
									placeholder="Select"
									@change="emitQueryChanged"
								>
									<el-option
										v-for="(value, index) in testCaseTypes"
										:key="value.value"
										:cid="
											'business-rule-form-document-type_' +
												index
										"
										:value="value.value"
										:label="value.label"
									></el-option>
								</el-select>
							</template>
						</el-table-column>

						<!-- Operator column -->
						<el-table-column
							prop="operator"
							label="Operation"
							width="180"
						>
							<template slot-scope="scope">
								<el-select
									name="operator"
									clearable
									filterable
									cid="test-case-form-operator-select"
									v-model="headerForm[scope.$index].operator"
									placeholder="Select"
									@change="emitQueryChanged"
								>
									<el-option
										v-for="(value, index) in operations"
										:key="value.value"
										:cid="
											'business-rule-form-document-type_' +
												index
										"
										:value="value.value"
										:label="value.label"
									></el-option>
								</el-select>
							</template>
						</el-table-column>

						<!-- Expected value column -->
						<el-table-column
							prop="expected_value"
							label="Expected Value"
						>
							<template slot-scope="scope">
								<el-input
									v-model="headerForm[scope.$index].expected_value"
									@change="emitQueryChanged"
								></el-input>
							</template>
						</el-table-column>

						<!-- Action button column  -->
						<el-table-column fixed="right" width="120">
							<template slot-scope="scope">

								<div class="testcase-rows-action-btns">
									<!-- Delete Button -->
								<el-button
									@click.native.prevent="deleteRow(scope.$index)"
									type="text"
									size="medium"
									class="header-test-case-row-buttons"
								>
									<i class="mdi mdi-delete"></i>
								</el-button>

								<!-- Copy Button -->
								<el-button
									@click.native.prevent="cloneRow(scope.$index)"
									type="text"
									size="medium"
									class="header-test-case-row-buttons"
								>
									<i class="mdi mdi-content-copy"></i>
								</el-button>
								</div>
							</template>
						</el-table-column>
					</el-table>
				</el-row>
				<br/>
			</el-form-item>
			<el-divider></el-divider>

			<!-- Multi table -->
			<el-form-item v-if="isMultiTable" class="kp-form-field-label" label="Table Fields">
				<section class="test-case-form-add-new-table-section">
					<el-button size="small" @click="handleAddTableClick">Add Table</el-button>

					<div v-if="showAddTableDropdown" class="test-case-form-table-name-input">
						<el-select 
							cid="multi-table-test-case-table-names" 
							name="multi_table_test_case_table_names" 
							v-model="selectedTableName" 
							placeholder="Select Table Name..." 
							filterable 
							clearable
						>
							<el-option v-for="(option, index) of tableNames"
								:cid="'multi-table-test-case-table-names-' + index" 
								:key="option.value" 
								:value="option.value" 
								:label="option.label">
							</el-option>
						</el-select>

						<div class="buttons-group">
							<el-button size="small" @click="handleCancelNewTable">Cancel</el-button>
							<el-button size="small" type="primary" @click="handleTableSelectChange()" :disabled="!selectedTableName">Create</el-button>
						</div>
					</div>
				</section>
				<section>
					<div v-for="(table, tableIndex) in tableForm" class="test-case-tables" :key="tableIndex">
						<div class="line-multi-table-add-buttons">
							<span class="label test-case-form-table-name">{{ getTableLabel(table.table_name) }}</span>
							<div class="multi-table-action-btns">
								<el-button size="small" class="btn-add-new-table-test-case add-new-row-btn"
									@click="addMultiTableRow(tableIndex)">Add
									Row</el-button>
								<el-dropdown>
									<el-button size="small" class="add-new-row-btn">
										Add column<i class="el-icon-arrow-down el-icon--right"></i>
									</el-button>
									<el-dropdown-menu slot="dropdown" class="select-column-dropdown">
										<el-checkbox-group v-model="tableWiseSelectedColumns[tableIndex]"
											class="vertical-checkbox-group"
											@change="handleTableColumnChange(tableIndex)">
											<el-checkbox v-for="(item, index) in tableFields" :key="index"
												:label="item">
												{{ item.label }}
											</el-checkbox>
										</el-checkbox-group>
									</el-dropdown-menu>
								</el-dropdown>
								<div class="test-case-form-delete-table-btn">
									<el-button type="text" size="medium" @click="deleteMultiTable(tableIndex)">
										<i class="mdi mdi-delete"></i>
									</el-button>
								</div>
							</div>
						</div>
						<el-row>
							<template>
								<div class="table-container">
									<el-table :data="table.data" style="width: 100%">
										<el-table-column label="Assertion #" width="120">
											<template slot-scope="scope">
												<span>{{ scope.$index + 1 }}</span>
											</template>
										</el-table-column>
										<el-table-column
											v-for="(value, columnIndex) in tableWiseSelectedColumns[tableIndex]"
											:key="columnIndex" :label="value.label" :min-width="'200px'">
											<template slot-scope="scope">
												<div v-if="table.data[scope.$index][columnIndex]">
													<el-input
														v-model="table.data[scope.$index][columnIndex].expected_value"
														@change="" :max-width="'150px'">
													</el-input>
												</div>
												<div v-else>
													Data not available
												</div>
											</template>
										</el-table-column>
										<el-table-column fixed="right" width="120" label="Actions">
											<template slot-scope="scope">
												<div class="testcase-rows-action-btns">
													<el-button type="text" size="medium"
														@click="deleteMultiTableRow(tableIndex, scope.$index)">
														<i class="mdi mdi-delete"></i>
													</el-button>
													<el-button type="text" size="medium"
														@click="cloneMultiTableRow(tableIndex, scope.$index)"
														class="copy-icon">
														<i class="mdi mdi-content-copy"></i>
													</el-button>
												</div>
											</template>
										</el-table-column>
									</el-table>
								</div>
							</template>
						</el-row>
					</div>
				</section>
			</el-form-item>

			<!-- Single table -->
			<el-form-item v-else class="kp-form-field-label" label="Table Fields">
				<!-- Add row button for table fields -->
				<div class="line-table-add-buttons">
					<el-button
						size="small"
						class="btn-add-new-table-test-case"
						@click="createTableTestCase"
					>
						Add Row
					</el-button>

					<!-- dropdown for select column for table fields -->
					<el-dropdown>
						<el-button size="small">
							Add column<i class="el-icon-arrow-down el-icon--right"></i>
						</el-button>
						<el-dropdown-menu slot="dropdown" class="select-column-dropdown">
    					<el-checkbox-group v-model="tableSelectedColumns" class="vertical-checkbox-group" @change="emitQueryChanged">
        				<el-checkbox v-for="(item, index) in tableFields" :key="index" :label="item" > {{ item.label + (item.document_type? ` (${item.document_type})`: '') }}</el-checkbox>
      				</el-checkbox-group>
						</el-dropdown-menu>
					</el-dropdown>
				</div>

				<!-- line item test case table -->
				<el-row class="test-case-tables">
					<template>
						<div class="table-container">
							<el-table :data="tableForm" style="width: 100%">
								<el-table-column label="Assertion #" width="120">
									<template slot-scope="scope">
										<span>{{ scope.$index + 1 }}</span>
									</template>
								</el-table-column>
								<el-table-column v-for="(value, index) in tableSelectedColumns" :key="index" :label="value.label" :min-width="'200px'">
									<template slot-scope="scope">
										<div>
											<el-input v-model="tableForm[scope.$index][index].expected_value" @change="emitQueryChanged" :max-width="'150px'"></el-input>
										</div>
									</template>
								</el-table-column>

								<!-- Action buttons for table fields  -->
								<el-table-column fixed="right" width="120" label="Actions">
									<template slot-scope="scope">
										<div class="testcase-rows-action-btns">
											<el-button type="text" size="medium" @click="deleteTableFormRow(scope.$index)"><i class="mdi mdi-delete"></i></el-button>
											<el-button type="text" size="medium" @click="cloneTableFormRow(scope.$index)" class="copy-icon"><i class="mdi mdi-content-copy"></i></el-button>
										</div>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</template>
				</el-row>
			</el-form-item>
		</div>
	</el-col>
</template>

<script>
import constants from "@/resources/Constants";
import _ from "lodash";
import EventBus from "@/EventBus";
import deCustomerConfig from "@/idp/services/DeCustomerConfig";

export default {
	name: "TestCaseQueryBuilder",

	props: {
		initFormData: Array,
		headerFields: Array,
		tableFields: Array,
		testCaseType: String,
		documentType: String,
	},

	data: function() {
		return {
			headerAssertionCount: 1,
			classificationAssertionCount: 1,
			fieldValue: '',
			headerForm: [],
			tableForm: [],
			classificationForm: [],
			selectedValues: [],
			isMultiTable: null,
			tableNames: [],
			testCaseTypes: constants.TEST_CASE_QUERY_BUILDER.FIELD_TYPES,
			operations: constants.TEST_CASE_QUERY_BUILDER.ACTIONS,
			tableSelectedColumns: [],
			newTableNameInput: "",
			showTableNameInput: false,
			tableWiseSelectedColumns: [],
			tableTypesConfig : [],
			selectedTableName: "",
			showAddTableDropdown: false,
			classificationFields: constants.TEST_CASE_QUERY_BUILDER.CLASSIFICATION_FIELDS,
		};
	},

	computed:  {
		headerForm() {
			return _.filter(this.form, (data) => data.field_name !== "table" && data.field_name !== "classification");
		}
	},

	watch: {
		tableSelectedColumns: {
				handler(newValues, oldValues) {
					// Iterate through each row in tableForm
					this.tableForm.forEach(row => {
						newValues.forEach(column => {
							if (!row.some(obj => obj.field_name === column.value)) {
								row.push({ field_name: column.value, field_type: 'value', expected_value: '', operator: 'equals' });
							}
						});

						// Iterate backwards through the properties of row
						for (let i = row.length - 1; i >= 0; i--) {
							if (!newValues.some(obj => obj.value === row[i].field_name)) {
								row.splice(i, 1);
							}
						}
					});

					// if all columns are unchecked remove the added rows.
					if(_.isEmpty(newValues)){
						this.tableForm = [];
					}
				},
		deep: true
		},
		tableFields(newVal, oldVal){
			if(newVal == oldVal){
				return ;
			}
			this.initializeTableFields();
		},
		async documentType(newVal, oldVal){
			if(newVal !== oldVal && oldVal !== undefined) {
				const isConfirmed = await this.confirm(`You're changing the document type from ${oldVal} to ${newVal} for the current test case. This will empty all the data of the current test case. Are you sure you want to change the document type?`);
				if(isConfirmed){
					this.headerForm = [];
					this.tableForm = [];
					this.classificationForm = [];
					this.classificationAssertionCount = 1;
					this.headerAssertionCount = 1;
				}
			}
			this.initializeTableFields();
		},
	},
	methods: {
		// Add a row for line item table test case.
		createTableTestCase() {
			const newRow = [];
			this.tableSelectedColumns.forEach(column => {
				newRow.push({ field_name: column.value, field_type: 'value', expected_value: '', operator: 'equals' });
					});
			this.tableForm.push(newRow);
		},

		// Delete the row for the following index.
		deleteTableFormRow(index) {
			this.tableForm.splice(index, 1);
			this.emitQueryChanged();
    	},
		
		updateClassificationAssertionCount() {
			this.classificationForm.forEach((item, index) => {
				item.assertion_no = index + 1;
			});
		},

		createNewClassificationTestCase(){
			this.classificationForm.push({
				assertion_no: 0,
				expected_value: "",
				operator: "equals"
			})
    		this.updateClassificationAssertionCount();
		},

		deleteClassificationFormRow(index){
			this.classificationForm.splice(index, 1);
    		this.updateClassificationAssertionCount();
		},

		cloneClassificationFormRow(index){
			const newRow = _.cloneDeep(this.classificationForm[index]);
			this.classificationForm.splice(index + 1, 0, newRow);
    		this.updateClassificationAssertionCount();
		},
		/**
		 * Purpose: Copies row data and create new row below
		 */
		cloneTableFormRow(index) {
			const newRow = _.cloneDeep(this.tableForm[index]);

			// 2. Insert the copied row below the original row
			this.tableForm.splice(index + 1, 0, newRow);
			this.emitQueryChanged();
		},

		// Add a new row to the test case table
		createNewHeaderTestCase() {
			this.headerForm.push({
				assertion_no: this.headerAssertionCount++,
				field_name: "",
				field_type: "",
				operator: "",
				expected_value: ""
			});
		},

		// createTableTestCase
		emitQueryChanged() {
			this.$emit("queryChanged", [
				...this.headerForm, 				
				{field_name: this.isMultiTable ? 'multi_table' : "table", data: this.tableForm}	,
				{field_name: 'classification', data: this.classificationForm},
			]);
		},

		deleteRow(index) {
			// Decrement assertion numbers for rows after the deleted row
			for (let i = index + 1; i < this.headerForm.length; i++) {
				this.headerForm[i].assertion_no--;
			}

			this.headerForm.splice(index, 1);

			// Update current assertion number if there are remaining rows
			if(this.headerForm.length>0 && this.headerAssertionCount > 1){
				this.headerAssertionCount--;
			}
			this.emitQueryChanged();
		},

		/**
		 * Purpose: Copy row data and add new row below
		 * @param {number} index - Index of the row to be cloned
		 */
		cloneRow(index) {
			const newRow = {...this.headerForm[index]};
			const newIndex = index + 1;

			// Insert the copied row below the original row and increase count
			this.headerForm.splice(newIndex, 0, {...newRow, assertion_no: newIndex + 1});

			// update the assertion numbers of subsequent rows, if any row is added in between
			this.updateAssertionNumbers(newIndex);
			this.emitQueryChanged();
		},

		addNewMultiTable(tableName){
			const currentIndex = this.tableForm.length;
			this.tableForm[currentIndex] = {
				table_name : tableName,
				data: [],
			};
			this.tableWiseSelectedColumns.push([]);
		},
		handleTableSelectChange(){
			const tableName = this.selectedTableName;

			const isTableAlreadyPresent = this.tableForm.find((table) => table.table_name == tableName);
			if(isTableAlreadyPresent){
				this.notifyError(`The ${this.getTableLabel(tableName)} table is already present in the table form. Please select another table.`);
				return ;
			}

			this.addNewMultiTable(tableName);
			this.emitQueryChanged();
			this.showAddTableDropdown = false;
			this.selectedTableName = "";
		},
		cloneMultiTableRow(tableIndex, rowIndex){
			const newRow = _.cloneDeep(this.tableForm[tableIndex].data[rowIndex]);
			this.tableForm[tableIndex].data.splice(rowIndex + 1, 0, newRow);
			this.emitQueryChanged();
		},
		
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

		getTableLabel(tableName) {
			const table = this.tableNames.find(item => item.value === tableName);
			return table ? table.label : tableName;
		},

		deleteMultiTableRow(tableIndex, index){
			this.tableForm[tableIndex].data.splice(index, 1);
			this.emitQueryChanged();
		},
		async deleteMultiTable(tableIndex){
			if(this.tableForm[tableIndex] && this.tableForm[tableIndex].data.length > 0){
				const confirmed = await this.confirm(`Are you sure want to delete ${this.tableForm[tableIndex].table_name} data?`);
				if(!confirmed){
					return ;
				}
			}
			this.tableForm.splice(tableIndex, 1);
			this.tableWiseSelectedColumns[tableIndex] = [];
			this.emitQueryChanged();
		},
		addMultiTableRow(tableIndex){
			const newRow = [];
			this.tableWiseSelectedColumns[tableIndex].forEach(column => {
				newRow.push({
					"field_name": column.value,
					"field_type": "value",
					"expected_value": '',
					"operator": 'equals'
				});
			});
      		this.tableForm[tableIndex].data.push(newRow);
			this.emitQueryChanged();
		},
		handleTableColumnChange(tableIndex) {
			const tableData = this.tableForm[tableIndex].data;
			const tableSelectedColumns = this.tableWiseSelectedColumns[tableIndex];

			if(tableData.length == 0){
				this.addMultiTableRow(tableIndex);
				return ;
			}
			tableData.forEach(row => {
				tableSelectedColumns.forEach(column => {
					const isFieldPresentInRow = row.find((col) => col.field_name == column.value);
					if (!isFieldPresentInRow) {
						row.push({
							"field_name": column.value,
							"field_type": 'value',
							"expected_value": '',
							"operator": 'equals'
						});
					}
				});
				// Remove deselected columns from the row
				for (let col = row.length - 1; col >= 0; col--) {
					const isFieldSelected = tableSelectedColumns.find(column => column.value === row[col].field_name);
					if (!isFieldSelected) {
						row.splice(col, 1);
					}
				}
			});
			this.emitQueryChanged();
		},

		handleAddTableClick() {
			this.showAddTableDropdown = true;
		},
		handleCancelNewTable() {
			this.showAddTableDropdown = false;
			this.newTableNameInput = '';
		},

		/**
		 * Update assertion numbers of rows starting from a given index
		 * @param {number} startIndex - Index from which to start updating assertion numbers
		 */
		updateAssertionNumbers(startIndex) {
			let count = startIndex + 1;
			for (const row of this.headerForm.slice(startIndex)) {
				row.assertion_no = count++;
			}
		},

		async initializeTableFields() {
			let tableFields = this.tableFields;
			if(this.isMultiTable){
				this.tableTypesConfig = await deCustomerConfig.getTableTypeConfig(this.documentType);
				this.tableNames = this.tableTypesConfig.map((tableConfig) => {
					return { label : tableConfig.label, value : tableConfig.key }
				});
				let tableWiseSelectedColumns = [];
				this.tableForm.forEach(table => {
					const tableSelectedColumns = new Set();
					table.data.forEach(row => {
						row.forEach((col) => {
							const matchingField = tableFields.find(field => field.value === col.field_name);
							matchingField && tableSelectedColumns.add(matchingField);
						})
					});
					
					tableWiseSelectedColumns.push(Array.from(tableSelectedColumns));
				});
				this.tableWiseSelectedColumns = tableWiseSelectedColumns;
			} else if(this.tableForm.length > 0){
				this.tableSelectedColumns = this.tableForm[0].map(field => {
					return tableFields.find(item => item.value === field.field_name);
				});
			}
		},

		initializeForm(formData){
			this.headerForm = formData.filter(item => item.field_name !== 'table' && item.field_name !== 'multi_table' && item.field_name !== 'classification');
			this.headerAssertionCount = this.headerForm.length + 1;

			const tableFormData = formData.find(item => item.field_name === 'table' || item.field_name === 'multi_table');
			this.tableForm = tableFormData ? tableFormData.data : [];

			const classificationFormData = formData.find(item => item.field_name === 'classification');
			this.classificationForm = classificationFormData ? classificationFormData.data : [];
			this.classificationAssertionCount = this.classificationForm.length + 1;
		},
		registerEvents(){
			EventBus.$on("testCaseForm_isMultiTable", (val) => {
				if(this.isMultiTable !== null && this.isMultiTable !== val){
					this.tableForm = [];
				}
				this.isMultiTable = val;
				this.initializeTableFields();
			})
		}
	},

	beforeMount() {
		this.registerEvents();

		if(!_.isEmpty(this.$props.initFormData)){
			this.initializeForm(this.$props.initFormData);
		}

		this.$nextTick(() => {
			this.initializeTableFields();
		})
	}
};
</script>

<style lang="scss">
.btn-add-new-test-case {
	margin-bottom: 10px !important;
}


.line-table-add-buttons {
	display: flex;
	justify-content: flex-start;
	gap: .5rem;
	align-items: center;
	margin-bottom: 10px !important;
}

.vertical-checkbox-group {
	display: flex;
	flex-direction: column;
}

.table-container {
	overflow-x: auto;

	.mdi-delete {
		font-size: 20px;
	}
}

.header-test-case-row-buttons {
	overflow-x: auto;

	.mdi-delete {
		font-size: 20px;
		margin-left: 10px;
	}
}

.select-column-dropdown {
	max-height: 200px;
	padding: 1rem;
	overflow-y: auto;
}

.testcase-rows-action-btns {
	display: flex;
	align-items: center;
}

.test-case-form-add-new-table-section {
	display: flex;
	justify-content: space-between;

	.test-case-form-table-name-input {
		width: 30rem;

		.buttons-group {
			display: flex;
			align-items: center;
			justify-content: end;
			margin-top: 1rem;
		}
	}
}

.test-case-tables {
	padding: 1rem;
	background-color: #E4EFFF;
	border-radius: .5rem;
	margin-top: 1rem;

	.line-multi-table-add-buttons {
		display: flex;
		justify-content: space-between;
		gap: .5rem;
		align-items: center;
		margin-bottom: 10px !important;
	}

	.test-case-form-table-name {
		font-weight: 500;
		font-size: 14px;
	}

	.multi-table-action-btns {
		display: flex;
		align-items: center;
		gap: .5rem;

		.mdi-delete {
			font-size: 18px;
		}
	}
}
</style>
