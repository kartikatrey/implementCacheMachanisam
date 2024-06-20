import tableAPIService from "@/services/TableAPIService";
import constants from "@/resources/Constants";
import lodash from "lodash";

export default class CustomerService {

	constructor() {

	}

	static fetchById(recordId, params = {}) {
		return new Promise((resolve, reject) => {
			let tableAPI = new tableAPIService();
			if (params.selectColumns) {
				tableAPI.addSelectColumns(params.selectColumns)
			}
			tableAPI.findById(constants.CUSTOMERS_API_ENDPOINT, recordId, (error, response) => {
				error ? reject(error) : resolve(response);
			});

		});
	}

	static fetchCount() {
		return new Promise((resolve, reject) => {
			let tableAPI = new tableAPIService();
			// tableAPI.addQuery({ active: true });
			tableAPI.countRecord(constants.CUSTOMERS_API_ENDPOINT, (error, response) => {
				error ? reject(error) : resolve(response.count);
			});

		});
	}

	static save(formData) {
		return new Promise((resolve, reject) => {
			let tableAPI = new tableAPIService();
			tableAPI.upsert(constants.CUSTOMERS_API_ENDPOINT, formData, (error, response) => {
				if (error || (!response || !response.data || !response.data._id)) {
					let errorResponse = {};
					errorResponse["message"] = lodash.get(response, "data.status") == false ? lodash.get(response, "data.statusMessage") : null;
					return reject(errorResponse);
				}
				resolve(response.data);
			});
		});
	}

	static find(query = {}, columns = []) {
		return new Promise((resolve, reject) => {
	
			let tableAPI = new tableAPIService();
			query["active"]=true;
			tableAPI.addQuery(query);
			const columnList = ["_id", "customer_name"];
			tableAPI.addSelectColumns(columnList);
			tableAPI.find(constants.CUSTOMERS_API_ENDPOINT, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}

	// static findWithFilter(query,) {
	// 	return new Promise((resolve, reject) => {
	// 		let tableAPI = new tableAPIService();
	// 		tableAPI.addQuery({ active: true });
	// 		//   const columnList = ["_id,", "customer_name"];
	// 		//   tableAPI.addSelectColumns(columnList);
	// 		tableAPI.find(constants.CUSTOMERS_API_ENDPOINT, (error, response) => {
	// 			error ? reject(error) : resolve(response);
	// 		});
	// 	});
	// }

	static getConfiguration() {
		return new Promise((resolve, reject) => {
			let tableAPI = new tableAPIService();
			const endpoint = '/portal/api/table/configuration';
			tableAPI.findOne(endpoint, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});

	}

}
