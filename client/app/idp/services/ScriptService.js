import AjaxService from "@/services/AjaxService";
import TableAPIService from "@/services/TableAPIService";
import constants from "@/resources/Constants";

export default class DeScriptService {


    static fetchById(recordId) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService()
            restifyService.findById(constants.SCRIPT_ENDPOINT, recordId, (error, response) => {
                if (error) {
                    reject(error);
                    return
                }
                resolve(response)
            });
        })
    }
    static save(data) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService();
            console.log(data)
            restifyService.upsert(constants.SCRIPT_ENDPOINT, data, (error, response) => {
                return error || response.data.errors ? reject(error) : resolve(response)
            })
        })
    }
    static get(filter) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.addQuery(filter);
			tableAPI.find(constants.SCRIPT_ENDPOINT, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}
}