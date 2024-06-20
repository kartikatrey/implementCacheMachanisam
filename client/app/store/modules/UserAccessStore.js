export default {
	namespaced: true,
	state: {
       currentRecord:{},
	   emailDocumentView: false,
	},
	getters: {
		getCurrentRecord(state,getters){
            return state.currentRecord;
        },
		getEmailDocumentView(state, getters){
			return state.emailDocumentView;
		}
  	},
	actions: {

	},
	mutations: {
		setCurrentRecord(state, payload){
			state.currentRecord=payload
		},
		
		setEmailDocumentView(state, emailView){
			state.emailDocumentView = emailView;
		},
  }
};
