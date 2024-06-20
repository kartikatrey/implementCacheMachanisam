const _ = require("lodash")

const mixin = {
	methods: {
		isActionEnabled(documentType, jsonPath){
			let result = _.find(window.kan_customer_configurations_all, {"document_type":documentType});
			return _.get(result || {}, jsonPath, true);
          },
		/**
		 * Generic function to check if the current user has permission for a specific item (button, pane, etc.) based on their roles.
		 * @param {string} name - The name of the item to check permission for.
		 * @param {string} itemType - The type of the item ('buttons', 'panes', etc.).
		 * @returns {boolean} - Returns true if the user has permission, otherwise false.
		 */
		hasPermission(name, itemType, permissionType="") {
			const configResponse = this.$store.getters.roleAccessConfig;
			const itemResponse = configResponse && configResponse.find((res) => res.type+''.toLowerCase() === itemType);
			const item = itemResponse && itemResponse[itemType].find(item => item.label === name);
			if(permissionType==="allowed"){
				// If the 'visible' property is not defined for the item, default to true.
				// This allows the user to see the component by default when 'visible' is not specified.
				return item ? item.visible : true;
			}
			return item ? item.disable : false;
		},
			
		/**
		 * Check if the current user has permission for a specific button based on their roles.
		 * @param {string} buttonName - The name of the button to check permission for.
		 * @returns {boolean} - Returns true if the user has permission, otherwise false.
		 */
		hasButtonPermission(buttonName) {
			return this.hasPermission(buttonName, 'buttons');
		},
		  
		/**
		 * Check if the current user has disabled access to a specific pane based on their roles.
		 * @param {string} paneName - The name of the pane to check access for.
		 * @returns {boolean} - Returns true if the user's access is disabled, and otherwise, it returns false. If the user's 
		 * access is marked as "visible," it returns the current result; otherwise, it returns true.
		 */
		isPaneDisabled(paneName) {
			return this.hasPermission(paneName, 'panes', 'disabled');
		},

		isPaneAllowed(paneName) {
			return this.hasPermission(paneName, 'panes', 'allowed');
		},

		/**
		 * Default values for read and write permissions are set to true.
		 * This is because if no fields are present in 'de_role_access' for a user role,
		 * then by default, the user can read and write any fields in the document viewer.
		 */
		isFieldDisabled(fieldConfig) {
			const read = _.get(fieldConfig, 'read', true);
			const write = _.get(fieldConfig, 'write', true);
			const fieldResult = (!read && !write) || (read && !write)
			return fieldResult;
		},

		/**
		 * Check if the current user has permission for a specific column based on their roles.
		 * @param {string} columnName - The name of the column to check permission for.
		 * @returns {boolean} - If the user's access is marked as "visible," it returns the
		 * current result; otherwise, it returns true.
		 */
		hasColumnPermission(columnName){
			return this.hasPermission(columnName, 'columns',"allowed");
		}
	}
};
export default {
	install(Vue, options) {
		Vue.mixin(mixin);
	}
};
