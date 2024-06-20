import Constants from "@/resources/Constants";


export default {
	namespaced: true,
	state: {
        formData : {}

	},
	getters: {
        getFormData(state, getters){
            return state.formData
        }
  	},
	actions: {

	},
	mutations: {
        setFormData(state, formData){
            state.formData = formData
        }

  }
};
