import TableAPIService from "@/services/TableAPIService";
import AjaxService from "@/services/AjaxService";
const endPoint = "/portal/api/table/de_webhook";
export default class Webhook {
	static fetchById(id) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.findById(endPoint, id, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}
	static save(data) {
		return new Promise((resolve, reject) => {
			let restifyService = new TableAPIService();
			restifyService.upsert(endPoint, data, (error, response) => {
				return error || response.data.errors ? reject(error) : resolve(response)
			})
		})
	}

}
