import tableAPIService from "@/services/TableAPIService";
import constants from "@/resources/Constants";

export default class SystemService {

	constructor() {

	}

	static saveCustomerSystem(formData) {
		return new Promise((resolve, reject) => {
			let tableAPI = new tableAPIService();
			tableAPI.upsert(constants.CUSTOMER_SYSTEM_API_ENDPOINT, formData, (error, response) => {
				(error || (!response || !response.data || !response.data._id)) ? reject(error): resolve(response.data);
			});
		});
	}

	static fetchCustomerSystemById(recordId,selectList=[]) {

		return new Promise((resolve, reject) => {
			let tableAPI = new tableAPIService();
			tableAPI.addSelectColumns(selectList);
			tableAPI.findById(constants.CUSTOMER_SYSTEM_API_ENDPOINT, recordId, (error, response) => {
				error ? reject(error) : resolve(response);
			});

		});
	}

	static fetchCustomerSystemsCount() {
		return new Promise((resolve, reject) => {
			let tableAPI = new tableAPIService();
			tableAPI.addQuery({ active: true });
			tableAPI.countRecord(constants.CUSTOMER_SYSTEM_API_ENDPOINT, (error, response) => {
				error ? reject(error):resolve(response.count);
			});

		});
	}


	static fetchMasterSystemById(recordId,selectList=[]) {
		return new Promise((resolve, reject) => {
			let tableAPI = new tableAPIService();
			tableAPI.addSelectColumns(selectList);
			tableAPI.findById(constants.MASTER_SYSTEM_API_ENDPOINT, recordId, (error, response) => {
				error ? reject(error):resolve(response);              
			});

		});
	}

	static fetchMasterSystems(param={"active":true},selectList=[]) {
		return new Promise((resolve, reject) => {
			let tableAPI = new tableAPIService();
			tableAPI.addQuery(param);
			tableAPI.addSelectColumns(selectList);
			tableAPI.find(constants.MASTER_SYSTEM_API_ENDPOINT, (error, response) => {
				error ? reject(error) : resolve(response);
			});

		});
	}

	static fetchMasterSystemsCount() {
		return new Promise((resolve, reject) => {
			let tableAPI = new tableAPIService();
			tableAPI.addQuery({ active: true });
			tableAPI.countRecord(constants.MASTER_SYSTEM_API_ENDPOINT, (error, response) => {
				error ? reject(error): resolve(response.count);
			});

		});
	}

	static saveMasterSystem(formData) {
		return new Promise((resolve, reject) => {
			let tableAPI = new tableAPIService();
			tableAPI.upsert(constants.MASTER_SYSTEM_API_ENDPOINT, formData, (error, response) => {
				(error || (!response || !response.data || !response.data._id))? reject(error):resolve(response.data);

			});
		});
	}
}


