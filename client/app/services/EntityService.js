import TableAPIService from "../services/TableAPIService";
import constants from "@/resources/Constants";
import AjaxService from "@/services/AjaxService";

import _ from "lodash";
export default class EntityService {

	static fetchTagListByDomain(domain) {
		let endPoint = "/portal/api/table/entity_tag_list";
		let queryParams = {
			domain,
			active:true
		};
		let restifyService = new TableAPIService();
		return new Promise((resolve, reject) => {
			restifyService.addQuery(queryParams);
			restifyService.find(endPoint, (error, response) => {
				return error ? reject(error) : resolve(_.has(response[0], "ENTITY_LIST") ? response[0].ENTITY_LIST : []);
			});
		});
	}

	static fetchObjectsByDomain(domain) {
		return new Promise((resolve, reject) => {
			let endPoint = "/portal/api/table/intent_info";
			let restifyService = new TableAPIService();
			let params = {
				domain
			};
			restifyService.addQuery(params);
			restifyService.find(endPoint, (error, response) => {
				return error ? reject() : resolve(_.has(response[0], "OBJECT_LIST") ? Object.keys(response[0].OBJECT_LIST) : []);
			});
		});
	}

	static fetchObjectList(params) {
		return new Promise((resolve, reject) => {
			let endPoint = "/portal/api/table/intent_info";
			let tableAPI = new TableAPIService();
			// let params = {
			// 	domain
			// };
			const columnList = ["OBJECT_LIST"];
			if (params)
			   tableAPI.addQuery(params);
			tableAPI.addSelectColumns(columnList);
			tableAPI.find(endPoint, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}

	static saveObjectList(id,formData) {		
		return new Promise((resolve, reject) => {
			let endPoint = "/portal/api/table/intent_info";
			let tableAPI = new TableAPIService();
			tableAPI.findByIdAndUpdate(endPoint, id, formData, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}

	static save(formData) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.upsert(constants.ENTITIES_API_ENDPOINT, formData, (error, response) => {
				(error || (!response || !response.data || !response.data._id)) ? reject(error) : resolve(response.data);

			});
		});
	}

	static fetchAllCustomer() {
		return new Promise((resolve, reject) => {
			let restifyService = new TableAPIService();
			const columnList = ["_id,", "customer_name"];
			restifyService.addSelectColumns(columnList);
			restifyService.find(constants.CUSTOMERS_API_ENDPOINT, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}

	static fetchRecordById(recordId) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.findById(constants.ENTITIES_API_ENDPOINT, recordId, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}

	static fetchDomains() {
		return new Promise((resolve, reject) => {
			let restifyService = new TableAPIService();
			restifyService.find(constants.DOMAIN_API_ENDPOINT, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}

	static getActions() {
		return constants.REQUIRED_ENTITY.ACTIONS;
	}

	static getActionsType() {
		return constants.REQUIRED_ENTITY.ACTION_TYPES;
	}


	static getInputType() {
		return constants.REQUIRED_ENTITY.TYPE;
	}

	


}
