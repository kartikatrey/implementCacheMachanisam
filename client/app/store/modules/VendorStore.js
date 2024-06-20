export default {
	namespaced: true,
	state: {
		vendor: {},
		vendorSite: {}
	},	
	getters: {
		getVendorRecordId(state, getters){
			return state.vendor._id;
		},
		getVendorId(state, getters){
			return state.vendor.vendor_id;
		},
		getVendorName(state,getters){
			return state.vendor.name;
		},
		getVendorSiteRecordId(state,getters){
			return state.vendorSite._id;
		},
		getVendorSiteId(state, getters){
			return state.vendorSite.site_id;
		},
		getVendorSiteName(state,getters){
			return state.vendorSite.site_name;
		},
		getIsVendorPaymentEnabled(state,getters){
			return state.vendorSite.payment_enabled;
		}
  	},
	actions: {

	},
	mutations: {
		setVendor(state, vendor){
			state.vendor = vendor;    
		},
		setVendorSite(state, vendorSite){
			state.vendorSite = vendorSite
		}
  }
};
