export default {
	namespaced: true,
	state: {
		enablePublishAllButton: false,
		enableCancelButton:false,
		enablePublishButton:false,
		loader:false,
		enableValidationButton:true,
		selectedCellFieldId:null,
		documentIds: [],
		parentDocData: {},
		originalFieldData: [],
		fieldPredictionData: []
	},
	getters: {
		enablePublishAllButton(state, getters){
			return state.enablePublishAllButton;
		},
		enableCancelButton(state,getters){
			return state.enableCancelButton
		},
		enablePublishButton(state, getters){
			return state.enablePublishButton;
		},
		loader(state, getters){
			return state.loader;
		},
		selectedCellFieldId(state, getters){
			return state.selectedCellFieldId;
		},
		setDocumentIds(state, getters){
			return state.documentIds;
		},
		enableValidationButton(state, getters){
			return state.enableValidationButton;
		},
  	},
	actions: {

	},
	mutations: {
		setOriginalFieldData(state, originalFieldData) {
			state.originalFieldData = originalFieldData;
		},
		setEnablePublishAllButton(state, enablePublishAllButton){
			state.enablePublishAllButton = enablePublishAllButton;    
		},
		setEnableCancelButton(state, enableCancelButton){
			state.enableCancelButton = enableCancelButton
		},
		setEnablePublishButton(state, enablePublishButton){
			state.enablePublishButton = enablePublishButton;    
		},
		setLoader(state, loader){
			state.loader = loader;    
		},
		setSelectedCellFieldId(state, selectedCellFieldId){
			state.selectedCellFieldId = selectedCellFieldId;    
		},
		setSelectedCellFieldId(state, documentIds){
			state.documentIds = documentIds;    
		},
		setEnableValidationButton(state, enableValidationButton){
			state.enableValidationButton = enableValidationButton;    
		},
		setParentDocData(state, parentDocData){
			state.parentDocData = parentDocData;
		},
		setFieldPredictionData(state, fieldPredictionData){
			state.fieldPredictionData = fieldPredictionData;
		},
		updateFieldValue(state, params) {
			if (_.isEmpty(_.get(params, 'name'))) {
				return;
			}
			let field = _.find(state.fieldPredictionData, (field) => {
				return (
					field &&
					field.field_config &&
					field.field_config.name == params.name
				);
			});
			field.value = _.get(params, 'value', "");
			field.is_modified = true;
		},
		
  }
};
