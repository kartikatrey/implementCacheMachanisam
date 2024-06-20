import AjaxService from "@/services/AjaxService";
import TableAPIService from "@/services/TableAPIService";
import constants from "@/resources/Constants.js";
let endPoint = constants.DE_TEST_CASE_ENDPOINT;
let apiEndpoint = constants.TEST_CASE_API_ENDPOINT;

export default class TestCaseService {
	static save(data) {
		return new Promise((resolve, reject) => {
			let restifyService = new TableAPIService();
			restifyService.upsert(endPoint, data, (error, response) => {
				return error || response.data.errors
					? reject(error)
					: resolve(response);
			});
		});
	}

	static findByIdAndUpdate(data, id) {
		return new Promise((resolve, reject) => {
			let tableApiService = new TableAPIService();
			tableApiService.findByIdAndUpdate(
				endPoint,
				id,
				data,
				(error, response) => {
					error ? reject(error) : resolve(response);
				}
			);
		});
	}

	static fetchById(recordId) {
		return new Promise((resolve, reject) => {
			let tableApiService = new TableAPIService();
			tableApiService.findById(endPoint, recordId, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response);
			});
		});
	}

	static getAllTestCases() {
		return new Promise((resolve, reject) => {
			let tableApiService = new TableApiService();
			tableApiService.find(endPoint, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response);
			});
		});
	}

	static runTestCase(testCaseId, params) {
		return new Promise((resolve, reject) => {
			let payload = {
				testCaseId: testCaseId,
				runType: params.runType,
				referenceType: params.referenceType,
			};
			AjaxService.getJson(apiEndpoint, payload, (error, response) => {
				if (error) reject(error.response.data.error);
				else resolve(response);
			});
		});
	}
	static runTestCasesByFile(fileId, runType) {
		return new Promise((resolve, reject) => {
			let payload = {
				testCaseFileId: fileId,
				runType: runType
			};
			AjaxService.getJson(apiEndpoint, payload, (error, response) => {
				if (error) reject(error.response.data.error);
				else resolve(response);
			});
		});
	}

	static runAllTestCasesOfReferenceType(referenceType) {
		return new Promise((resolve, reject) => {
			let payload = {
				referenceType: referenceType,
				runType: constants.TEST_CASE_RUN_TYPES.REFERENCE_ALL
			};
			AjaxService.getJson(apiEndpoint, payload, (error, response) => {
				if (error) reject(error.response.data.error);
				else resolve(response);
			});
		});
	}

	static runAllTestCases() {
		return new Promise((resolve, reject) => {
			let payload = {
				runType: constants.TEST_CASE_RUN_TYPES.ALL
			};
			AjaxService.getJson(apiEndpoint, payload, (error, response) => {
				if (error) reject(error.response.data.error);
				else resolve(response);
			});
		});
	}
}
