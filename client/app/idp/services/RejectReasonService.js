import TableAPIService from "@/services/TableAPIService";
import AjaxService from "@/services/AjaxService";
let endPoint = "/portal/api/reject-reason";
export default class BusinessRule {
	static get(query) {
		return new Promise((resolve, reject) => {
			let tableAPIService = new TableAPIService()
			tableAPIService.addQuery(query);
			tableAPIService.find(endPoint, (error, response) => {
				if (error) {
					reject(error);
					return
				}
				resolve(response)
			});
		})
	}
	static upsert(data) {
		return new Promise((resolve, reject) => {
			let restifyService = new TableAPIService();
			restifyService.upsert(endPoint, data, (error, response) => {
				return error || response.data.errors ? reject(error) : resolve(response.data)
			})
		})
	}
	static delete(params) {
		return new Promise((resolve, reject) => {
			AjaxService.deleteJson(endPoint, params, (error, response) => {
				return error ? reject(error) : resolve(response.data)
			})
		})
	}
	static put(params) {
		return new Promise((resolve, reject) => {
			AjaxService.putJson(endPoint, params, (error, response) => {
				return error ? reject(error) : resolve(response.data)
			})
		})
	}
}
