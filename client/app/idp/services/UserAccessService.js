import constants from "@/resources/Constants";
import TableAPIService from "@/services/TableAPIService";
import _ from "lodash";
import store from "@/store/store";
import DeCustomerConfig from "@/idp/services/DeCustomerConfig";

export default class RoleFieldAccessService {
	 //method to save data in de_role_access table
    static saveRoleFieldDetails(data) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService();
            restifyService.upsert(constants.ROLE_FIELD_ACCESS_ENDPOINT, data, (error, response) => {
                return error ? reject(error) : resolve(response)
            })
        })
    }
    //method to fetch data based on "id" 
    static fetchRoleFieldDetailsById(id, projection=[]) {
        return new Promise((resolve, reject) => {
            let tableAPI = new TableAPIService();
            tableAPI.addSelectColumns(projection);
            tableAPI.findById(constants.ROLE_FIELD_ACCESS_ENDPOINT, id, (error, response) => {
                error ? reject(error) : resolve(response);
            });
        });
    } 

	/* Purpose: It returns document stages configuration
	 * If role based tabs configuration is present then return that
	 * Otherwise return default tabs configuration  
	*/
	static async getTabConfig(documentType){
		let stageMapConfig = [];

		//Get document type configuration
		const docTypeConfig = await DeCustomerConfig.getCustConfigByDocType(documentType);

		//If the logged-in user has 'customer admin' role then, apply default configuration
		//'default configuration' - the default tabs configuration stored against document type
		const user = _.get(store, 'getters.user', {});
		if (user.roles.includes(constants.DOCEX.ROLES_MAP.IDP_CUSTOMER_ADMIN)){
			stageMapConfig = docTypeConfig.stage_tabs_by_order || [];
			stageMapConfig && stageMapConfig.sort((a, b) => a.order - b.order);
			return stageMapConfig;
		} 

		//Get role based tabs
		const tabsQueryParams = { document_type: documentType, type: "tabs", active: true, filter_type: "tabs" };
		const roleBasedTabs = await this.getRoleBasedTabs(tabsQueryParams)
		
		if (roleBasedTabs && roleBasedTabs.length) {
				//If role based tabs configuration is present then, apply that configuration
			stageMapConfig = roleBasedTabs;
		}
		else {
				//If role based tabs configuration is not present then, apply default configuration
			stageMapConfig = docTypeConfig.stage_tabs_by_order || [];
		}
		stageMapConfig && stageMapConfig.sort((a, b) => a.order - b.order);
		return stageMapConfig;
	}

	/* Purpose: Fetches all the allowed tabs based on current logged in user's all the roles
	 * If user_role_cofiguration is already present in window object then skip api call
	 * Otherwise call api  
	*/
	static getRoleBasedTabs(params = {}) {
		const documentType = params.document_type;
		return new Promise((resolve, reject) => {
			if (window.hasOwnProperty('kan_user_role_configuration')) {
				let tabsList = [];
				if (window.kan_user_role_configuration[documentType]) {
					tabsList = getTabsByOrder(window.kan_user_role_configuration[documentType]);
				}
				return resolve(tabsList);
			}
			let tableAPI = new TableAPIService();
			tableAPI.addQuery(params);
			tableAPI.find("/portal/api/table/de_role_access", (error, response) => {
				if (error) {
					reject(error)
				} else {
					if (response && response.length) {
						window.kan_user_role_configuration = window.kan_user_role_configuration || {};
						window.kan_user_role_configuration[documentType] = response;
						const tabsList = getTabsByOrder(response);
						return resolve(tabsList);
					}
					window.kan_user_role_configuration = {}
					resolve([]);
				}
			});
		});
	}

	 //Purpose -: We need to give access on platform buttons based on user roles
	 static getRoleBasedButtons(params={}, projection){
        return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.addQuery(params);
			tableAPI.addSelectColumns(projection);
			tableAPI.find("/portal/api/table/de_role_access", (error, response) => {
				if (error) {
					reject(error)
				} else {
					if (response && response.length > 0) {
						resolve(response)
						return;
					}
					resolve([]);
				}
			});
		});
    }

	//Purpose -: We need to give access on platform items ex, buttons, panes, el-tab based on user roles
    static getRoleAccessConfig(roleIds){
		const params = {
			role_id: { $in: roleIds },
		}
		const projection = ["role_id","document_type","document_subtype","type","panes","buttons","fields","tabs","columns"]
        return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.addQuery(params);
			tableAPI.addSelectColumns(projection);
			tableAPI.find("/portal/api/table/de_role_access", (error, response) => {
				if (error) {
					reject(error)
				} else {
					if (response && response.length > 0) {
						resolve(response)
						return;
					}
					resolve([]);
				}
			});
		});
    }
}

function getTabsByOrder(tabsList) {
	// Merge the objects in tabsList into a single array
	const mergedTabs = [];
	for (const obj of tabsList) {
		if (!obj.hasOwnProperty('tabs')) {
			continue;
		}
		mergedTabs.push(...obj.tabs);
	}

	// Sort the mergedTabs based on the "order" property
	mergedTabs && mergedTabs.sort((a, b) => a.order - b.order);

	// Use uniqueBy to create a final array without duplicate values based on the "code" property
	const finalTabsList = _.uniqBy(mergedTabs, 'code');
	return finalTabsList;
}