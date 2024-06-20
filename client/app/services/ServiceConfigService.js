import TableAPIService from "@/services/TableAPIService";
import AjaxService from "@/services/AjaxService";
let endPoint = "/portal/api/table/service";

export default class ServiceConfig {

	static save(serviceData) {
		return new Promise((resolve, reject) => {
			let restifyService = new TableAPIService();
			restifyService.upsert(endPoint, serviceData, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}

	static fetchById(serviceId) {
		return new Promise((resolve, reject) => {
			let restifyService = new TableAPIService();
			restifyService.findById(endPoint, serviceId, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}

	static fetchActiveCount() {
		return new Promise((resolve, reject) => {
			let restifyService = new TableAPIService();
			restifyService.addQuery({"active":true});
			restifyService.countRecord(endPoint, (error, response) => {
				error ? reject(error) : resolve(response.count);
			});
		});
	}
}
