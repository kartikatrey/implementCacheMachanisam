import Constants from "@/resources/Constants";
import _ from 'lodash';

const mixin = {
	data() {
		return {
			idpUserLoggedRoles:_.get(this.$store, 'getters.user.roles', [])
		}
	},
	methods: {
		/**
		 * Purpose : Check logged in User having below roles or not, if any one role present then true.
		 */
        canEditIdpData() {	
			const roles = [
				Constants.DOCEX.ROLES_MAP.IDP_PUBLISHER,
				Constants.DOCEX.ROLES_MAP.IDP_CUSTOMER_ADMIN,
				Constants.DOCEX.ROLES_MAP.IDP_ADMIN,
				Constants.DOCEX.ROLES_MAP.IDP_DEVELOPER
			]
			return roles.some(role => this.idpUserLoggedRoles.includes(role));
		},
		isSuperAdmin() { 
			return this.idpUserLoggedRoles.some(role => Constants.DOCEX.SYSTEM_ADMIN_ROLES.includes(role));
		},
		isIdpUser(user) {
			return user.is_idp || false
		},
		isIdpAdmin() {
			return _.includes(this.idpUserLoggedRoles, "idp_admin");
		},
		isTryItUser() {
			const user = _.get(this.$store, 'getters.user', {});
			return user.customer_id == Constants.DOCEX.TRY_IT.CUSTOMER_ID;        
		},
		isVendorUser() {
			return _.get(this.$store, 'getters.isVendorUser', false);
		},
		isSystemAdmin() {
			return _.includes(this.idpUserLoggedRoles, "admin")
		},
		isLoggedInAsKanAdmin() {
			return this.isIdpAdmin() && (this.$store.getters.isImpersonate == false);
		},
		isLoggedInAsKanCustomer() {
			return this.isIdpAdmin() && (this.$store.getters.isImpersonate == true);
		},
		canSeePIIData(){
			return !this.idpUserLoggedRoles.includes(Constants.DOCEX.ROLES_MAP.IDP_PII_RESTRICTOR)
		},

		isDeveloper(){
			return this.idpUserLoggedRoles.includes(Constants.DOCEX.ROLES_MAP.IDP_DEVELOPER)
		}
	}
};
export default {
	install(Vue, options) {
		Vue.mixin(mixin);
	}
};
