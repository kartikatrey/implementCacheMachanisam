import Constants from "@/resources/Constants";


export default {
	namespaced: true,
	state: {
		propertiesActionButtons: [],
		packageBarActionButtons: [],
		docData : {}
	},
	getters: {
		getDocumentData(state, getters){
			return state.docData
		},
		packageBarActionButtons(state, getters){
			return state.packageBarActionButtons;
		},
		propertiesActionButtons(state, getters){
			return state.propertiesActionButtons;
		},
		isSaveActionEnabled(state, getters){
			const actionBtns = state.propertiesActionButtons
			if(actionBtns.length > 0 ){
				for(let actionBtn of actionBtns){
					if(actionBtn.name == Constants.PLATFORM_ACTION_BUTTON.SAVE){
					  return true;
					}
				}
			}
			return false ;
		},

  	},
	actions: {

	},
	mutations: {
		setDocumentData(state, docData){
			state.docData = docData
		},
		setPropertiesActionButtons(state, actionButtons){
			state.propertiesActionButtons = actionButtons
		},
		setPackageBarActionButtons(state, actionButtons){
			state.packageBarActionButtons = actionButtons
		},

  }
};
