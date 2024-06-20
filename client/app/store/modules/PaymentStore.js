export default {
	namespaced: true,
	state: {
        bankAccountRow : {},
		paymentUserType :{},
	},
	getters: {
        getBankAccountId(state, getters){
			return state.bankAccountRow.id;
		},
        getPaymentUserType(state, getters){
			return state.paymentUserType;
		},

  	},
	actions: {

	},
	mutations: {
        setBankAccountRow(state, bankAccountRow){
			state.bankAccountRow = bankAccountRow;
		},
        setPaymentUserType(state, paymentUserType){
			state.paymentUserType = paymentUserType;
		}
  }
};
