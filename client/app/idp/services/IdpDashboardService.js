import AjaxService from "@/services/AjaxService";
import UserService from "./UserService";
import store from "@/store/store";
let _ = require('lodash');
import Constants from "@/resources/Constants";
import CustomerConfigService from "./DeCustomerConfig";

export default class IdpDashboardService {

	static getCardData(params) {
		return new Promise((resolve, reject) => {
			AjaxService.getJson('/portal/api/dashboard/cards', params, (error, response) => {
				return error || response.data.status == false ? reject(error) : resolve(response.data)
			})
		})
	}

	// static async getDocTypeByUserDomains() {
	static async getDocTypes() {
		let docTypeConfig = await CustomerConfigService.getAllDocsCustConfiguration({document_type: {$exists: true}});
		const documentTypes = _.compact(_.map(docTypeConfig || [], (config) => {
			if (config['document_type'] != 'form') {
				return config['document_type']
			}
		}))

		// let domainList = _.get(store, 'state.user.user_domains', []);
		// let docTypes = [];
		// domainList.map(domain => {
		// 	docTypes = docTypes.concat(_.get(domain, 'document_type', []));
		// });
		// docTypes = _.uniq(docTypes);
		// If it has some domain assigned
		// if (docTypes.length) {
			// return _.filter(documentTypes, configDocType => docTypes.includes(configDocType));
		// } else {
			// Return configured doc
			return documentTypes
		// }
	}

	static hideLeftBar() {
		store.commit("setDisplayIdpTree",false);
		store.commit("setDisplayIdpNavbar",false);
	}

	static getCurrentDashboardFilters(){
		return store.getters['dashboardStore/getCurrentDashboardFilters']
	}

	static getPermittedWidgets(documentType) {
		const user = _.get(store, 'state.user', {});
        let permittedWidgets = user["permitted_widgets"] || {};
        permittedWidgets = permittedWidgets[documentType] || [];
        const dashboardWidgetMap = Constants.DOCEX.DASHBOARD_WIDGET_MAP;
        const mappedWidget = [];
        for (const widget of permittedWidgets) {
            if(dashboardWidgetMap[widget] != undefined){
                mappedWidget.push({
                    value: widget,
                    label: dashboardWidgetMap[widget]
                })
            }
        }
        return mappedWidget;
    }

	static getUserPreferenceWidgets(documentType, permittedWidgets) {
		let userPreferences = UserService.getUserPreferencesFromStore(`widgets.selected.${documentType}`)
		if(!userPreferences){
			userPreferences = _.map(permittedWidgets, 'value')
		}
		return userPreferences;
	}

	static updateWidgetGroup(permittedWidgets, userPreferenceWidgets, widgetConfig) {
		const sortedWidget = [];
		for (const widget of permittedWidgets) {
			_.includes(userPreferenceWidgets, widget.value) && sortedWidget.push(widget.value);
		}
		return createWidgetGroups(sortedWidget, widgetConfig, permittedWidgets)
	}
}

/**
 * Creates widget groups based on the provided parameters, ensuring that each group's total column size
 * does not exceed 24. The function takes a list of sorted widgets, widget configurations, and a list of
 * permitted widgets. It returns an array of arrays, where each inner array represents a group of widgets
 * that fit within the specified column size constraints.
 *
 * @param {Array} sortedWidgets - An array of user preference widgets.
 * @param {Object} widgetConfig - Configuration object containing information about each widget, including its column size.
 * @param {Array} permittedWidgets - An array of permitted widgets, each represented by a value.
 * @returns {Array} An array of widget groups, where each group is an array of widget values.
 */
function createWidgetGroups(sortedWidgets, widgetConfig, permittedWidgets) {
	let colSum = 0;
	let widgetRow = [];
	let widgetGroups = []
	let visibleWidgets = sortedWidgets.length ? sortedWidgets : _.map(permittedWidgets, 'value');
	for (const index in visibleWidgets) {
		if (!widgetConfig[visibleWidgets[index]]) continue;
		colSum += widgetConfig[visibleWidgets[index]]["col_size"];
		if (colSum <= 24) {
			widgetRow.push(visibleWidgets[index])
			continue;
		}
		widgetGroups.push(widgetRow);
		widgetRow = [];
		colSum = widgetConfig[visibleWidgets[index]]["col_size"];
		widgetRow.push(visibleWidgets[index])
	}
	if (!_.isEmpty(widgetRow)) {
		widgetGroups.push(widgetRow);
	}
	return widgetGroups;
}
