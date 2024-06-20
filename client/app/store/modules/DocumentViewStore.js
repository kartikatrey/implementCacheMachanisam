import Constants from "@/resources/Constants";
import _ from "lodash";
import Validator from "@/services/Validator";
import EventBus from "@/EventBus";
import DocumentService from "@/idp/services/DocumentService";



// private helper functions, these are to make the code more moduler


function getTableData(state){
	let tableData = _.find(state.fieldPredictionData.prediction, {
		name: "table",
	});
	if (state.documentData.is_multi_table) {
		return _.get(tableData, "data");
	}else{
		return tableData ? [tableData] : []
	}
}
// when we want the updated table data from component.(this is temporary)
function getTableDataFromPrediction(state,prediction){
	let tableData = _.find(prediction, {
		name: "table",
	});
	if (state.documentData.is_multi_table) {
		return _.get(tableData, "data");
	}else{
		return tableData ? [tableData] : []
	}
}

function getHeaderPredictionData(predictionData){
	const  headerData = _.filter(predictionData,(pred)=>{return pred.name != "table"})
	return headerData;
}
//find table field in the tableData by name & index
function findTableField(state, name, rowIndex, tableIndex) {
	let tableData = getTableData(state);
	if (tableIndex) { // if index then change pointer to provided index table data
		tableData = tableData[tableIndex];
	}else{
		tableData = tableData[0]; // if table index is not provided then it is not multi table data
	}
	let field = _.find(tableData.content.rows[rowIndex], (col) => {
		return (
			col && col.field_config && col.field_config.name == name
		);
	});
	return field;
}

function updateTableFieldValue(state, params) {
	let field = findTableField(state, params.name, params.index, params.table_index);
	if (!field) return;
	field.value = _.get(params, 'value', "");
	state.selectedField.value = _.get(params, 'value', "");
	const inputValueChangedEvent = DocumentService.createValueChangeEventName(params);
	EventBus.$emit(inputValueChangedEvent, field.value)
}

function setBusinessRulesError(state,predictedField, index, fieldName) {
	let documentData=state.documentData;
	const field_configurations = documentData.br_field_config || [];
	const businessRuleMsgs = _.cloneDeep(documentData.messages) || [];
	const fieldType =
		_.get(predictedField, "field_config.field_type") == "table" ?
		"LINE" :
		"HEADER";
	const field_name = fieldName || _.get(predictedField, "field_config.name");
	predictedField.validationMsgs = [];
	predictedField["config"] = [];
	_.each(businessRuleMsgs, (message) => {
		if (fieldType == "LINE" && index == message.row) {
			message.field_name = message.field_name + `_${index}`;
		}
		if (
			(message.field_type == fieldType || message.field_type == "TABLE") &&
			message.field_name == field_name
		) {
			predictedField.validationMsgs.push(message);
		}
	});
	_.each(field_configurations, (config) => {
		if (
			config.field_type == fieldType &&
			config.field_name == _.get(predictedField, "name")
		) {
			predictedField["config"].push(config.config);
			return;
		}
	});
}

function mergeCheckBoxFieldValue(state,prediction, field) {

	let field_config = _.cloneDeep(field)
	let predictedFields = _.filter(prediction, (predictedField) => {
		return predictedField.name == field.name && !predictedField.is_master_checkbox
	})
	//if(_.isEmpty(predictedField))return;
	let checkedValues = _.compact(_.map(predictedFields, (field) => {
		if (!_.isEmpty(field.value)) { return field.value }
	}));
	let masterField = _.find(prediction, (predField) => {
		return predField.is_master_checkbox && predField.name == field_config.name
	})
	if (masterField) {
		masterField.value = checkedValues
	}
	else {
		let masterCheckBoxField = _.find(predictedFields, (field) => {
			return field.bounds;
		})
		let master =
		{
			"name": field_config.name,
			"bounds": null,
			"page_number": 1,
			"value": null,
			"field_config": field_config,
			"original_value": null
		}
		masterCheckBoxField = _.cloneDeep(masterCheckBoxField) || _.cloneDeep(predictedFields[0]) || master
		setBusinessRulesError(state,masterCheckBoxField, null, field_config.name)
		masterCheckBoxField = _.cloneDeep(masterCheckBoxField)

		masterCheckBoxField["field_config"] = _.cloneDeep(field_config);
		masterCheckBoxField.value = checkedValues;
		masterCheckBoxField.is_master_checkbox = true;
		masterCheckBoxField.validationMsgs = [];
		prediction.push(masterCheckBoxField);
		setBusinessRulesError(state,masterCheckBoxField, null)
	}
	let checkboxValues = _.map(field_config.options, (option) => option.value.toLowerCase());
	_.each(checkboxValues, (value) => {
		let fieldPredicted = _.find(predictedFields, (field) => {
			return field.value == value;
		})
		if (fieldPredicted) {
			fieldPredicted["field_config"] = _.cloneDeep(field_config);
			fieldPredicted["field_config"].name = fieldPredicted.name + '_' + fieldPredicted.value;
		} else {
			let fieldA = _.find(predictedFields, (field) => {
				return _.get(field, 'field_config.name') == field.name + '_' + value;
			})
			if (!fieldA) {
				let newField =
				{
					"name": field_config.name,
					"bounds": null,
					"page_number": 1,
					"value": null,
					"field_config": field_config,
					"original_value": null
				}
				newField["field_config"] = _.cloneDeep(field_config);
				newField["field_config"].name = field_config.name + '_' + value;
				prediction.push(newField);
			}

		}
	})
}


function updateHeaderFieldValue(state, params) {
	let name = params.name;
	let field = _.find(state.fieldPredictionData.prediction, (field) => {
		return (
			field &&
			field.field_config &&
			field.field_config.name == params.name
		);
	});

	field.value = _.get(params, 'value', "");
	state.selectedField.value = _.get(params, 'value', "");
	if (params.data_type == 'checkbox') {
		let checkboxField = _.filter(state.fieldPredictionData.prediction, (field) => {
			return (_.get(field, 'field_config.type') == 'checkbox' && field.name == name && !field.is_master_checkbox);
		});
		if (_.isEmpty(field.value)) {
			_.each(state.fieldPredictionData.prediction, (field) => {
				if ((_.get(field, 'field_config.type') == 'checkbox') && (field.name == params.name) && !field.is_master_checkbox) {
					field.value = null;
				}
			})
		} else {
			_.each(field.value, (value) => {
				let checkBox = _.find(checkboxField, (fieldVal) => {
					return (_.get(fieldVal, 'field_config.name') == (fieldVal.name + '_' + value))
				})
				if (!checkBox) {
					state.fieldPredictionData.prediction.push({
						"name": params.name,
						"bounds": null,
						"page_number": 1,
						"value": value,
						"original_value": value
					})
				} else {
					checkBox.value = value;
				}
				_.each(state.fieldPredictionData.prediction, (field) => {
					if (!params.value.includes(field.value) && (_.get(field, 'field_config.type') == 'checkbox') && (field.name == params.name) && !field.is_master_checkbox) {
						field.value = null;
					}
				})
			})
		}
		field.selected_checkbox = params.selected_checkbox
		let pred = state.fieldPredictionData.prediction;
		mergeCheckBoxFieldValue(state,pred, field);
		state.selectedField = field;
	}
}
// To remove validation messages
function removeMessages(state, param){
	let messages = _.filter(state.allErrorMessages[state.documentId],(msg)=>{
		// if index is present this means its a table field
		if(param.index || param.index === 0){
			if(!(msg.field_name == param.field_name && msg.row == param.index)){
				return msg
			}
		}
		// otherwise it will be header field
	    else{
			 if(!(msg.field_name == param.field_name)) {
				return msg
			 }
		}

	});
	return messages
}

/*
This function is called from setFieldValue and getFieldValue functions

Purpose :To fetch table field object of particular index in prediction data.

Step 1. Find the table data in the prediction based on the field name "table"
Step 2. Check if the document has multiple tables
Step 3. Find the specific table within the tableData based on the table name
Step 4. Get the row at the specified rowIndex within the table
Step 5. Get the row at the specified rowIndex from the tableData
Step 6. Find the object within the row that has the matching fieldName

@params is object containing field_name, row_index and table_name

*/
function findTableFieldByIndex(state, prediction, params) {
	let row;
	let tableName;
	const { field_name: fieldName, row_index: rowIndex } = params;

	if(params.hasOwnProperty("table_name")){
		tableName = params.table_name
	}

	//Step 1. Find the table data in the prediction based on the field name "table"
	const tableData = _.find(prediction, (field) => {
		return (
			field &&
			field.name == 'table'
		);
	});

	//Step 2. Check if the document has multiple tables
	if (state.documentData.is_multi_table) {

		//Step 3. Find the specific table within the tableData based on the table name
		const table = _.find(tableData.data, { table_name: tableName });

		//Step 4. Get the row at the specified rowIndex within the table
		row = _.get(table, `content.rows[${rowIndex}]`, []);
	} else {

		//Step 5. Get the row at the specified rowIndex from the tableData
		row = _.get(tableData, `content.rows[${rowIndex}]`, []);
	}

	//Step 6. Find the object within the row that has the matching fieldName
	return _.find(row, { name: fieldName });
}

/*
This function is called form setField Value and getFieldValue functions

Purpose : To fetch header field from prediction data

Step 1. Find and returns the objext which matches fieldName received in params

@fieldName is string which contains field to be find out

*/
function findFieldByName(state, fieldName) {

	// Find and returns the objext which matches fieldName received in params
	return _.find(state.fieldPredictionData.prediction, (field) => {
		return (
			field &&
			field.field_config &&
			field.field_config.name == fieldName
		);
	});
};

function prepareLinesData(rows) {
	return rows.map(row => {
		let formattedRow = {};
		row.forEach(col => {
			formattedRow[col.name] = col.value;
		});
		return formattedRow;
	});
}

export default {
	namespaced: true,
	state: {
		isLineItemRefreshed: false,
		currentActionPageNumber:0, //this stores the current page number whenever deleteField, changeField action is done.
		items: [{ label: "Traning Mode" }],
		tableParams: [],
		minWidth: 1200,
		minHeight: 300,
		paginationResponseLength: "",
		currentIndex: "",
		displayDetailsInfo: false,
		displayPOMapperInfo: false,
		displayInfoPopupData: {},
		displayPOMapperData: {},
		showTranslationConfirmationDialog: false,
		languageTranslationMessage: "",
		docLanguage: "",
		customerPrefferedLanguage: "",
		docSelectedLanguage: null,
		translatedWords: [],
		showTranslatedText: false,
		fieldsDefaultClass: "",
		documentMessagePaneSize: 0,
		canvasPaneSize: 70,
		tableIndexNameMap: {},
		lineItemPaneSize: 30,

		pageNumber: 1,
		rejectionNote: "",
		documentMessages: [],
		searchText: "",

		showDocumentMessagesFlag: false,

		propData: null,
		selected_field_search_text: "",
		field_search_text: "",
		showDebugDialog: false,
		state: "",
		isDebuggerOn: false,
		paneSize: 100,
		docxConfig: {},
		busEvents: [],
		lineItemFlag: false,
		showForm: false,
		loading: false,
		linesLoading: false,
		documentData: {
			messages :[],
		},
		newModifiedFields:[],
		documentName: "",
		customerConfiguration: {},
		search_text: "",
		fieldData: "",
		originalFieldData: [],
		resetDefaultData: null,
		visible_searchbar: false,
		prediction: null,
		showDialog: false,
		labelTypes: ["string", "date"],
		form: {},
		fieldPredictionData: {
			prediction :[]
		},
		history: "",
		componentMapping: {
			string: "Input",
			date: "DatePicker"
		},
		selectedField: "",
		defaultValues: {
			errorMsg: ""
		},
		publishDialogVisible: false,
		isReviewer: false,
		isPublisher: false,
		isPublisherOnly: false,
		approvalStatus: "",
		pagination: {
			prev_doc_id: "",
			next_doc_id: ""
		},
		autoLearningEnable: false,
		documentId: "",
		filter: "",
		documentType: "",
		documentSubtype: "",
		stage: "",
		tableData: "",
		displayFields: [],
		paginationResponseLength: "",
		currentIndex: "",
		totalPages: "",
		isDownloadReadOnly: false,
		approvalDialogVisible: false,
		approverEmailList: "",
		approvalForm: {
			emails: ""
		},
		isApprovalEnable: false,
		approvalFormRules: {
			emails: [
				{
					trigger: "change",
					validator: Validator.emailValidator
				}
			]
		},
		clonedPrediction: "",
		isBottomPaneVisible: true,
		showBottomPane: null,
		previousSelectedFieldName: "",
		documentRecord: null,
		debugData: {},
		showError: true,
		isAutoLearningEnabled:false,
		shouldTrackChanges: null,
		debugDataModifiedPages: new Set(),
		tableDebugDataModified: false,
		tableScrollToOptions: {
			container: ".line-table .vgt-responsive",
			easing: "ease-in",
			offset: -60,
			force: true,
			cancelable: true,
			x: true,
			y: true,
		},
		totalCommentCount: 0,
		isLoadCanvas:false,
		allErrorMessages:{},
		packageFormData :[],
		uiEventScripts:[],
		idpListcolumnFilter:{},
		canvasImageURLs:[],
		isRectangleRequested:false, // added this flag to show 'Please draw a rectangle.' pop-up once on document view.
		showVisualisationPage:false

	},
	getters: {
		/*
		Purpose : To get field value against row_index or field_name

		Step 1. Check is row_index is present which concludes we need to use table prediction data
		Step 2. Call findTableFieldByIndex which returns object with matching field_name in particular row_index against table_name
		Step 3. Return only the value of field from the whole object
		Step 4. This condition is executed when row_index is not present which concludes header field finding
		Step 5. Call findFieldByName which returns the object matching the field_name received in params
		Step 6. Returns only the value against the field_name

		@params: An object containing field_name, row_index, and table_name.
		*/
		getFieldValue: (state) => (params) => {
			let tableIndexObject;

			// Step 1. Check is row_index is present which concludes we need to use table prediction data
			if (params.row_index) {
				const prediction = state.fieldPredictionData.prediction;

					//Step 2. Call findTableFieldByIndex which returns object with matching field_name in particular row_index against table_name
					 tableIndexObject = findTableFieldByIndex(state, prediction, params)

					//Step 3. Return only the value of field from the whole object
					return tableIndexObject.value;

			//Step 4. This condition is executed when row_index is not present which concludes header field finding
			}else {

				//Step 5. Call findFieldByName which returns the object matching the field_name received in params
				const field = findFieldByName(state, params.field_name);

				if(!field){
					return null;
				}
				//Step 6. Returns only the value against the field_name
				return field.value
			}
		},

		/*
		Purpose : To retrieve field details based on the field name and to consider the row index when dealing with line fields.
  
		Step 1. Check is field_name is present or not
		Step 2. Check is row_index is present which concludes we need to use table prediction data
		Step 3. If row_index is present then, call findTableFieldByIndex which returns object with matching field_name in particular row_index against table_name
		Step 4. Returns that whole line field object
		Step 5. This condition is executed when row_index is not present which concludes header field finding, call findFieldByName which returns the object matching the field_name received in params
		Step 6. Returns that whole header field object

		@params: An object containing field_name, row_index, and table_name.
		*/
		getFieldDetails: (state) => (params) => {
			// Step 1. Check is field_name is present or not
			if (!params.hasOwnProperty("field_name")) {
				return;
			}

			// Step 2. Check is row_index is present which concludes we need to use table prediction data
			if (params.hasOwnProperty("row_index")) {
				const prediction = state.fieldPredictionData && state.fieldPredictionData.prediction;
				// Step 3. If row_index is present then, call findTableFieldByIndex which returns object with matching field_name in particular row_index against table_name
				const tableField = findTableFieldByIndex(state, prediction, params);
				// Step 4. Returns that whole line field object
				return tableField;
			}

			// Step 5. This condition is executed when row_index is not present which concludes header field finding, call findFieldByName which returns the object matching the field_name received in params
			const headerField = findFieldByName(state, params.field_name);
			// Step 6. Returns that whole header field object
			return headerField;
		},
		canvasImageURLs(state) {
			return state.canvasImageURLs;
		},
		allErrorMessages(state,getters){
			return state.allErrorMessages
		},
		getRefreshLineItem(state, getters) {
			return state.isLineItemRefreshed;
	    },
		packageFormData(state,getters){
			return state.packageFormData;
		},
		showVisualisationPage(state,getters){
			return state.showVisualisationPage;
		},
		currentActionPageNumber(state, getters) {
			return state.currentActionPageNumber
		},
		totalCommentCount(state, getters) {
			return state.totalCommentCount
		},
		documentMessagePaneSize(state, getters) {
			return state.documentMessagePaneSize
		},
		isBottomPaneVisible(state, getters) {
			return state.isBottomPaneVisible
		},
		showBottomPane(state, getters) {
			return state.showBottomPane
		},
		// documentMessagePaneSize(state, getters) {
		// 	return state.documentMessagePaneSize
		// },
		isApprovalEnable(state, getters) {
			return state.isApprovalEnable
		},
		propData(state, getters) {
			return state.propData
		},
		debugDataModifiedPages(state, getters) {
			return state.debugDataModifiedPages
		},
		selectedField(state, getters) {
			return state.selectedField
		},
		isDebuggerOn(state, getters) {
			return state.isDebuggerOn
		},
		autoLearningEnable(state, getters) {
			return state.autoLearningEnable
		},
		totalPages(state, getters) {
			return state.totalPages;
		},
		canvasPaneSize(state, getters) {
			return state.canvasPaneSize;
		},
		lineItemPaneSize(state, getters) {
			return state.lineItemPaneSize;
		},
		docxConfig(state, getters) {
			return state.docxConfig;
		},
		customerConfiguration(state, getters) {
			return state.customerConfiguration;
		},
		shouldTrackChanges(state, getters) {
			return state.shouldTrackChanges
		},
		documentData(state, getters) {
			return state.documentData;
		},
		documentRecord(state, getters) {
			return state.documentRecord;
		},
		debugData(state, getters) {
			return state.debugData;
		},
		fieldPredictionData(state, getters) {
			return state.fieldPredictionData;
		},
		clonedPrediction(state, getters) {
			return state.clonedPrediction;
		},
		tableIndexNameMap(state, getters){
			return state.tableIndexNameMap
		},
		originalFieldData(state, getters) {
			return state.originalFieldData;
		},
		fieldData(state, getters) {
			return state.fieldData;
		},
		// tableData(state, getters) {
		// 	return state.tableData;
		// },
		rejectionNote(state, getters) {
			return state.documentData.rejection_note;
		},
		documentId(state, getters) {
			return state.documentData._id;
		},
		documentType(state, getters) {
			return state.documentType;
		},
		documentSubtype(state, getters){
			return state.documentSubtype;
		},
		stage(state, getters) {
			return state.documentData.stage;
		},
		tableNameByTableIndex: (state) => (tableIndex) => {
			let tableName = "";
		
			if(state.documentData.is_multi_table){
				tableName = state.tableIndexNameMap[tableIndex];
			} else{
				tableName = "singleLineItem"
			}
			return tableName;
		},
		isMultiTable(state, getters) {
			return state.documentData.is_multi_table;
		},
		tableParams(state, getters) {
			return state.tableParams
		},
		isDocumentRejected(state, getters) {
			return false;
			// return (state.documentData.rejection_note &&
			//   (_.includes(
			//           [Constants.DOCEX.STAGE.UPLOADED, Constants.DOCEX.STAGE.EXTRACTED],
			//           state.documentData.stage
			//       ) ||
			//       state.documentData.approval_status ==
			//       Constants.DOCEX.APPROVAL_STATUS.REJECTED))
		},
		documentMessages(state, getters) {
			let messages = _.get(state.documentData, "messages", []);
			return messages;
		},
		publishFailedReason(state, getters) {
			return state.documentRecord.publish_failure_reason;
		},
		showDocumentMessagesFlag(state, getters) {
			return state.showDocumentMessagesFlag
		},
		getPredictionFieldByName: (state) => (name) => {
			return _.find(state.fieldPredictionData.prediction, (field) => {
				return (
					field &&
					field.field_config &&
					field.field_config.name == name
				);
			});
		},
		isAutoLearningEnabled(state) {
			return _.get(state.customerConfiguration, 'auto_learning.enable') &&
				!_.includes(
					[Constants.DOCEX.STAGE.FRAUD_FLAGGED,
					Constants.DOCEX.STAGE.FRAUD_CONFIRMED,
					Constants.DOCEX.STAGE.PUBLISHED,
					Constants.DOCEX.STAGE.WAITING_FOR_APPROVAL,
					Constants.DOCEX.STAGE.REJECTED],
					state.documentData.stage
				) &&
				(Constants.DOCEX.STAGE.UPLOADED ||
					Constants.DOCEX.STAGE.EXTRACTED ||
					Constants.DOCEX.STAGE.CONFIRMED ||
					// Constants.DOCEX.STAGE.REJECTED ||
					(Constants.DOCEX.STAGE.PUBLISHED && Constants.DOCEX.STATE.FAILED))
		},
		tableData(state) {
			return getTableData(state);
		},
		unpredictedFields(state){
			return state.documentData.unpredicted_fields;
		},
		newModifiedFields(state){
			return state.newModifiedFields;
		},
		moveToInboxReason(state, getters) {
			return state.documentRecord.move_to_inbox_reason;
		},
		hasDataChanged(state){
            let clonedPrediction = state.clonedPrediction;
            let fieldPredictionData = state.fieldPredictionData;
			const data = fieldPredictionData.prediction;
			let hasValueChange = false;
			data.forEach(obj => {
				if (obj.original_value !== obj.value && obj.name != 'table') {
					hasValueChange = true;
					return;
				}
			});
			const hasDataChanged = !_.isEqual(clonedPrediction, data);
			return (hasValueChange && hasDataChanged);
        },
		uiEventScripts(state){
			return state.uiEventScripts
		},
		// To get current document data edited by user (this data is not saved anywhere)
		getDocumentForm(state) {
			let formData = {
				header: {},
				lines: []
			};
			const data = state.fieldPredictionData
			data.prediction.map((item) => {
				if (item.name != 'table') {
					formData.header[item.name] = item.value
				}
				else
				{
					if (!state.documentData.is_multi_table) {
						// Single table
						let rows = _.get(item, "content.rows");
						formData.lines = prepareLinesData(rows);
					} else {
						formData.lines = {};
						// For Multi table prepare lines with table name and table lines
						const multiTableData = item.data;
						for (const table of multiTableData) {
							formData.lines[table.table_name] = prepareLinesData(table.content.rows);
						}
					}
				}
			});
			return formData;
		},
   	// To get current document filter applied at document list view
	   getIdpListcolumnFilter(state){
		return state.idpListcolumnFilter;
	},
	isRectangleRequested(state) {
		return state.isRectangleRequested;
	},
	},
	actions: {},
	mutations: {
		/*
		Purpose : To set field value against row_index or field_name

			Step 1. Check if row_index is present to determine to carry actions against table prediction data
			Step 2. Call findTableFieldByIndex which returns the object against the matching field_name
			Step 3. Returns only the value against the particular field_name
			Step 4. Execute else conditions to find header field
			Step 5. Call FindFieldByName which returns the object matching against particular field_name
			Step 6. Returns only the value against the object returned

		@inputField: An object containing row_index, field_name, table_name, and value.
		*/
		setFieldValue(state, inputField) {
			let tableField;
			let inputWidgetEvent = ""; // Listener in input.vue / dropdown.vue etc
			//Step 1. Check if row_index is present to determine to carry actions against table prediction data
			if (inputField.row_index) {
				const { value,  field_name: fieldName} = inputField;
				const prediction = state.fieldPredictionData.prediction;
				// Step 2. Call findTableFieldByIndex which returns the object against the matching field_name
				tableField = findTableFieldByIndex(state, prediction, inputField);

				// Step 3. Returns only the value against the particular field_name
				tableField.value = value;
				inputWidgetEvent  = `InputValueChanged__${fieldName}_${inputField.row_index}`
				//Step 4. Execute else conditions to find header field
			} else {

				// Step 5. Call FindFieldByName which returns the object matching against particular field_name
				const field = findFieldByName(state, inputField.field_name);

				if(!field){
					return null;
				}
				// Step 6. Returns only the value against the object returned
				field.value = inputField.value;
				inputWidgetEvent  = `InputValueChanged__${inputField.field_name}`
			}
			// Displaying field values updated at runtime through scripts on the UI
			EventBus.$emit(inputWidgetEvent, inputField.value)
		},
		setChildComponentEventNames(state, childComponentEvent){
			state.childComponentEventNames.push(childComponentEvent);
		},
		setShowVisualisationPage(state, showVisualisationPage){
			state.showVisualisationPage = showVisualisationPage;
		},
		setDocumentType(state, documentType){
			state.documentType = documentType;
		},
		setDocumentSubtype(state, documentSubtype){
			state.documentSubtype = documentSubtype;
		},
		setPackageFormData(state,packageFormData){
			state.packageFormData = packageFormData;
		},
		setAllErrorMessages(state,message){
			state.allErrorMessages = message
		},
		setCurrentActionPageNumber(state,currentActionPageNumber){
			state.currentActionPageNumber = currentActionPageNumber;
		},
		addUnpredictedFields(state,fieldName){
			state.documentData.unpredicted_fields.push(fieldName);
		},
		addNewModifiedFields(state,field){
			if(field){
			state.newModifiedFields.push(field);
			}
		},
		addRow(state, payload){
			let index = payload.index
			let tableIndex = payload.tableIndex
			let tableData = getTableData(state);
			tableIndex = tableIndex == undefined ? 0 : tableIndex; // if table index is undefined then table data is not of multi table type
			tableData[tableIndex].content.rows.splice(index, 0, []);
		},
		rowClone(state, payload){
			let index = payload.index
			let tableIndex = payload.tableIndex
			let tableData = getTableData(state);
			tableIndex = tableIndex == undefined ? 0 : tableIndex; // if table index is undefined then table data is not of multi table type
			let clonedData=_.cloneDeep(tableData[tableIndex].content.rows[index]);
			_.forEach(clonedData, function (row, index) {
				row['bounds']=null
			});
			tableData[tableIndex].content.rows.splice(index+1, 0, clonedData);
		},
		deleteLineItemRow(state, payload){
			let index = payload.index
			let tableIndex = payload.tableIndex
			let tableData = getTableData(state);
			tableIndex = tableIndex == undefined ? 0 : tableIndex; // if table index is undefined then table data is not of multi table type
			tableData[tableIndex].content.rows.splice(index, 1);
            tableData.length == 0 ? tableData.push([]) : "";
		},
		deleteAllLineItems(state, payload){
			let tableIndex = payload.tableIndex == undefined ? 0 : payload.tableIndex;
			let tableData = getTableData(state);
			tableData[tableIndex].content.rows = [];
			tableData.length == 0 ? tableData.push([]) : "";
		},
		/**
		 * Purpose : When any operation is performed IdpLineTable then move error messages to correct index
		 * when user added new row in any index we've to shift that old message to new index
		 *
		 * @param {store state} state
		 * @param {object} payload
		 */
		moveErrorMessages(state, payload) {
			const index = payload.index;
			const tableIndex = payload.tableIndex;

			let documentData = state.documentData;

			for (let i = 0; i < documentData.messages.length; i++) {
				const message = documentData.messages[i];
				if (!message) continue;

				if (message.field_type === "LINE" && message.row >= index && message.table_index >= tableIndex) {
					message.row += 1;
				} else if (message.field_type === "LINE" && message.row >= index) {
					message.row += 1;
				}
			}

			state.documentData = documentData;
		},
		/**
		 * Purpose : When user clicks on "delete all" delete all the messages of line items from the store
		 *
		 * @param {store state} state
		 * @param {Interger} rowCount
		 */
		deleteAllErrorMessages(state, rowCount) {
			let documentData = state.documentData;
			let messages = _.cloneDeep(documentData.messages)
			for (let i = 0; i < rowCount; i++) {
			  _.remove(messages, { field_type: "LINE", row: i });
			}
			documentData['messages'] = messages
			state.documentData = documentData;
		},
		deleteErrorMessage(state, payload) {
			const index = payload.index;
			let documentData = state.documentData;
			let messages = _.cloneDeep(documentData.messages);

			// Remove the messages with the specified index
			for (let i = messages.length - 1; i >= 0; i--) {
			  if (messages[i].field_type === "LINE" && messages[i].row === index) {
				messages.splice(i, 1);
			  }
			}

			// Update row numbers for messages after the deleted index
			for (let i = 0; i < messages.length; i++) {
			  if (messages[i].field_type === "LINE" && messages[i].row >= index) {
				messages[i].row -= 1;
			  }
			}
			documentData.messages = messages;
			state.documentData = documentData;
		},
		documentId(state, documentId) {
			state.documentId = documentId;
		},
		totalCommentCount(state, totalCommentCount) {
			state.totalCommentCount = totalCommentCount;
		},
		minimizeLineItem(state) {
			state.documentMessagePaneSize = state.showDocumentMessagesFlag ? state.documentMessagePaneSize : 0;
			state.lineItemPaneSize = 4.5;
			// this.$store.commit("documentViewStore/showDocumentMessagesFlag",true)

			state.canvasPaneSize =
				100 - (state.documentMessagePaneSize + state.lineItemPaneSize);
			state.isBottomPaneVisible = false;
			state.showBottomPane = false;
		},
		maximizeLineItem(state) {
			state.documentMessagePaneSize = state.showDocumentMessagesFlag ? state.documentMessagePaneSize : 0;
			state.lineItemPaneSize = 30;
			state.canvasPaneSize =
				100 - (state.documentMessagePaneSize + state.lineItemPaneSize);
			state.isBottomPaneVisible = true;
			state.showBottomPane = true;
		},
		isApprovalEnable(state, isApprovalEnable) {
			state.isApprovalEnable = isApprovalEnable;
		},
		debugDataModifiedPages(state, debugDataModifiedPages) {
			state.debugDataModifiedPages = debugDataModifiedPages;
		},
		setSelectedField(state, selectedField) {
			state.selectedField = selectedField;
		},
		isDebuggerOn(state, isDebuggerOn) {
			state.isDebuggerOn = isDebuggerOn;
		},
		totalPages(state, totalPages) {
			state.totalPages = totalPages;
		},
		docxConfig(state, docxConfig) {
			state.docxConfig = docxConfig;
		},
		setDocumentData(state, documentData) {
			state.documentData = documentData;
		},
		setDebugData(state, debugData) {
			state.debugData = debugData;
		},
		setDocumentRecord(state, documentRecord) {
			state.documentRecord = documentRecord;
		},
		tableParams(state, tableParams) {
			state.tableParams = tableParams;
		},

		/**
		* Incase of multitable data be like,
		*
		*  - If row data present
		* ................
		* ................
		*  "rows": [
					[
						{
							"bounds": [],
							"bounds_score": 99.76,
							"value": "2021-22",
							"value_score": NumberInt(99),
							"page_number": NumberInt(1),
							"vision_bounds": [],
							"name": "policy_yr",
							"original_value": "2021-22",
							"from_document": true,
							"od_bounds": []
						}
					],
				],
				...............
				...............


			* -If row data not present
			..............
			..............
			"rows": [{}],
			..............
			..............
			*	if one of the table do not have any row data, in that case rowDataByPage value is [{}] and this value is used in createBoundingBoxes() method to create bounding boxes,
			* 	because of the empty object existing boundin boxes are getting overridden/removed. To prevent this value getting added in rowDataByPage added below check.

		*/
		/**
		 * Sets the prediction data in the application state and prepares flatPredictionDataByPage,
		 * including both table and header fields.
		 * @param {Object} state - The application state object.
		 * @param {Object} predictionData - The prediction data to be set.
		 */
		setPredictionData(state, predictionData) {
			let flatAllPredictionData = [];
			// Extract header and table data
			let headerData = getHeaderPredictionData(predictionData);
			let tableData = getTableDataFromPrediction(state, predictionData);
			let tableIndexNameMap = {};

			// Flatten and concatenate header and table data
			flatAllPredictionData = flatAllPredictionData.concat(headerData);

			if (_.isArray(tableData)) {
				//Adding a tableIndex to all table fields for improved traceability when a user clicks on a bounding box, enabling easy identification of the selected table field.
				for (let tableIndex = 0; tableIndex < tableData.length; tableIndex++) {
					const table = tableData[tableIndex];

					if(state.documentData.is_multi_table){
						tableIndexNameMap[tableIndex] = table.table_name;
					}
					let flatTableFieldsArray = table.content.rows.flat(1);
					flatAllPredictionData = flatAllPredictionData.concat(flatTableFieldsArray);
				}
			}
			// Group prediction data by page number
			const flatPredictionDataByPage = {};

			for (const predField of flatAllPredictionData) {
				if(!predField){
					continue;
				}
				const { page_number: pageNumber } = predField;

				if (pageNumber) {
					if (flatPredictionDataByPage[pageNumber]) {
						flatPredictionDataByPage[pageNumber].push(predField);
					} else {
						flatPredictionDataByPage[pageNumber] = [predField];
					}
				}
			}

			// Update the application state with the prepared data
			state.fieldPredictionData.flatPredictionDataByPage = flatPredictionDataByPage;
			state.fieldPredictionData.prediction = predictionData;
			state.tableIndexNameMap = tableIndexNameMap;
		},

		setMessagesData(state, messages) {
			//state.documentData.prediction = predictionData;
			state.documentData.messages = messages;
		},
		setPropsData(state, propData) {
			state.propData = propData;
		},
		setClonedPredictionData(state, predictionData) {
			state.clonedPrediction = predictionData;
		},
		setPredictionDataAttrs(state, attrs) {

			attrs.forEach((attr) => {
				state.fieldPredictionData[attr.name] = attr.value;
			});
		},
		setCanvasImageURLs(state, canvasImageURLs) {
			state.canvasImageURLs = canvasImageURLs;
		},
		setIsLoadCanvas(state, isLoadCanvas) {
			state.isLoadCanvas=isLoadCanvas
			state.fieldPredictionData.isLoadCanvas = isLoadCanvas;
		},
		setOcrDimension(state, ocrDimension) {
			state.fieldPredictionData.ocr_dimension = ocrDimension;
		},
		setFieldData(state, fieldData) {
			state.fieldData = fieldData;
		},
		setFieldPredictionData(state, fieldPredictionData) {
			state.fieldPredictionData = fieldPredictionData;
			state.fieldPredictionData.isLoadCanvas = state.isLoadCanvas;
			let tableData = getTableData(state);
			_.each(tableData,(table,tableIndex)=>{
				_.each(table.content.rows, (row, index) => {
					_.each(row, (field, idx) => {
						field.index=index; // set row index to all the table fields, this is require to get the easy access to the table fields
					})
				})
			});

		},
		showDocumentMessagesFlag(state, showDocumentMessagesFlag) {
			state.showDocumentMessagesFlag = showDocumentMessagesFlag
		},
		setOriginalFieldData(state, originalFieldData) {
			state.originalFieldData = originalFieldData;
		},
		setTableData(state) {
			let tableData = _.find(state.fieldPredictionData.prediction, {
				name: "table",
			});
			if (state.documentData.is_multi_table) {
				state.tableData = _.get(tableData, "data");
				return
			}

			state.tableData = tableData;
		},
		// setTableData(state, tableData){
		// 	state.tableData = tableData;
		//   },
		setTablePredictionData(state, prediction) {
			for (let [ind, pred] of state.fieldPredictionData.prediction.entries()) {
				if (pred.name == "table") {
					state.fieldPredictionData.prediction[ind] = prediction
				}
			}

		},
		setUIEventScripts(state,scripts){
			state.uiEventScripts = scripts
		},
		customerConfiguration(state, customerConfiguration) {
			state.customerConfiguration = customerConfiguration;
		},
		toggleMessageSection(state, showDocumentMessages) {
			if (showDocumentMessages) {
				state.documentMessagePaneSize = 30;
				return;
			}
			if (state.showDocumentMessagesFlag) {
				state.documentMessagePaneSize = 4;
				// this.lineItemPaneSize = 4;
				state.canvasPaneSize = 100 - (state.documentMessagePaneSize + state.lineItemPaneSize);
				return;
			}
			state.documentMessagePaneSize = 4;
			state.lineItemPaneSize = 4.5;
			state.canvasPaneSize = 92;
			100 - (state.documentMessagePaneSize + state.lineItemPaneSize);
		},
		shouldTrackChanges(state, shouldTrackChanges) {
			state.shouldTrackChanges = shouldTrackChanges
		},
		updateValidationMsgs(state, params) {
			const tableIndex = _.get(params['field'], 'field_config.tableIndex', null);
			const rowIndex = _.get(params['field'], 'field_config.index');
			
			if (tableIndex != null) {
				_.set(state.tableParams, `[${tableIndex}].rows[${rowIndex}][${params.field.name}].value`, params.value);
				_.set(state.tableParams, `[${tableIndex}].rows[${rowIndex}][${params.field.name}].validationMsgs`, params.field.validationMsgs);
			} else {
				_.set(state.tableParams, `rows[${rowIndex}][${params.field.name}].value`, params.value);
				_.set(state.tableParams, `rows[${rowIndex}][${params.field.name}].validationMsgs`, params.field.validationMsgs);
			}
		},

		updateTableParams(state, params) {
			// params, value
			let tableParamsClone = _.cloneDeep(state.tableParams);
			const tableIndex = _.get(params['field'], 'field_config.tableIndex', null);
			const rowIndex = _.get(params['field'], 'field_config.index');
			if (tableIndex != null) {
				_.set(tableParamsClone, `[${tableIndex}].rows[${rowIndex}][${params.field.name}].value`, params.value);
			} else {
				_.set(tableParamsClone, `rows[${rowIndex}][${params.field.name}].value`, params.value);
			}
			state.tableParams = tableParamsClone;
		},

		isPublishError(state) {
			if (_.find(state.documentData.messages, {
				message_type: "ERROR"
			})) return false;

			if (_.get(state.documentRecord, 'publish_failure_reason', null)) return true;

			return false;
		},
		updateFieldValue(state, params) {
			// if there is no name in the parameters, then nothing is there to update
			state.isLoadCanvas = false
			state.fieldPredictionData.isLoadCanvas = state.isLoadCanvas;
			if (_.isEmpty(_.get(params, 'name'))) {
				return;
			}
			if (params.field_type == "table") {
				updateTableFieldValue(state, params);
			} else {
				updateHeaderFieldValue(state,params);
			}
		},
		updatePredictionField(state, payload){
			state.isLoadCanvas = false
			state.fieldPredictionData.isLoadCanvas = state.isLoadCanvas;
			let field =  _.find(state.fieldPredictionData.prediction, (field) => {
				return (
					field &&
					field.field_config &&
					field.field_config.name == payload.field_name
				);
			});
			let dataToupdate = payload.dataToupdate
			for(let key in dataToupdate){
				field[key] = dataToupdate[key];
			}
		},

		setOcrBBoxToOther(state, tagName) {
			let debugData = state.debugData
			let ocrResult = debugData.ocr_result
			//   let rowNum;
			//   if(fieldType == 'checkbox'){
			// 	   name = name.split('#')[0]
			// 	   rowNum = name.split('#')[1]
			//   }
			//   let tagValue = this.getTagValue(fieldType, name, value, rowNum)
			let tagArr = [`B-${tagName}-VAL`, `M-${tagName}-VAL`, `E-${tagName}-VAL`, `I-${tagName}-VAL`]
			_.each(ocrResult, (ocrData, pageIndex) => {
				_.each(ocrData, (bbox) => {
					if (!tagArr.includes(bbox[5])) { return; }
					//   this.updateTag(bbox, `O`, pageIndex+1)
					if (bbox.length == 7) {
						bbox[6] = { ...bbox[6], mod_by_cust: true }; // support exisitng document
					} else {
						bbox.push({ "pred": _.clone(bbox[5]), "mod_by_cust": true }); // for new document
					}
					bbox[5] = updatedTag;

					state.debugDataModifiedPages.add(pageNumber)
					state.debugData.modified = true
				})
			})
			//    this.$store.commit("documentViewStore/setDebugData",debugData);
			// this.createAllWordRectangles();


		},
		addBusinessRulesError(state, params) {
			setBusinessRulesError(state,params.predictedField, params.index, params.field_name)
	   },
	   addValidationMessage(state, message){
			let messages=removeMessages(state,{field_name:message.field_name, index: message.row})
			messages.push(message)
			state.allErrorMessages[state.documentId] = messages
			state.documentData.messages=messages

	   },
	   /**
		* Purpose : This method sets whether to refresh LineItem or not
		* @param {*} state
		* @param {*} params is boolean value
		*/
		setRefreshLineItem(state, params) {
			state.isLineItemRefreshed = params
	   },
	   removeValidationMessage(state, param){
			let messages=removeMessages(state,param)
			state.allErrorMessages[state.documentId] = messages
			state.documentData.messages=messages
	   },
	    // Setting the current global filter applied at document level.
		setIdpListcolumnFilter(state, filters) {
			state.idpListcolumnFilter = filters;
		},

		// scrollToTheField(state,selectedField){
		// 	const fieldName = (_.get(selectedField,'field_config.type') == 'checkbox') ? _.get(selectedField,'name') : _.get(selectedField,'field_config.name')
		// 	if(_.get(selectedField, 'field_config.field_type') == 'header')
		// 	{
		// 		 this.$nextTick(() => {
		// 				scrollTo(`div[id="${fieldName}"]`, 800, kpLeftScrollOptions);
		// 		 });
		// 		 return;
		// 	}
		// 	const tableIndex = _.get(selectedField, 'field_config.tableIndex');
		// 	let tdIndex=0
		// 	if (tableIndex>=0){
		// 		tdIndex = _.findIndex(state.tableParams[tableIndex].columns,
		// 						function (column) {
		// 							return column.field == selectedField.name;
		// 						}
		// 					);
		// 	}
		// 	else{
		// 		tdIndex = _.findIndex(state.tableParams.columns,
		// 						function (column) {
		// 							return column.field == selectedField.name;
		// 						}
		// 					);
		// 	}
		// 	const trIndex = _.get(selectedField, 'field_config.index');
		// 	// multi-line-item-tab
		// 	scrollTo( `.line-table tr:nth-child(${trIndex + 1})>td:nth-child(${tdIndex + 1})`,800,state.tableScrollToOptions);
		// 	//  scrollTo( `.Insurance-package .el-tabs__nav-scroll #tab-${tableIndex+1} .is-active .line-table tr:nth-child(${trIndex + 1})>td:nth-child(${tdIndex + 1})`,800,tableScrollToOptions);

		// },
		setIsRectangleRequested(state, isRectangleRequested){
			state.isRectangleRequested = isRectangleRequested;
		},
	},
	// plugins: [createPersistedState({paths: ['fieldPredictionData']})],

};
