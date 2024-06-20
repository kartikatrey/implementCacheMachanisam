
export default {
	namespaced: true,
	state: {
      BusinessRuleSearchData:[],
      AiSearchText:""
	},
	getters: {
        BusinessRuleSearchData(state){
            return state.BusinessRuleSearchData
        },
        AiSearchText(state){
            return state.AiSearchText
        },
    },
	actions: {
       
	},
	mutations: {
		setBusinessRuleSearchData(state, data){
            state.BusinessRuleSearchData = data
		},
        setAiSearchText(state, data){
            state.AiSearchText = data
		}	
    }
};
