import AjaxService from "@/services/AjaxService";
import TableAPIService from "@/services/TableAPIService";
import constants from "@/resources/Constants";

export default class DocumentScriptService {

    static run(params) {
        return new Promise((resolve, reject) => {
            AjaxService.postJson("/portal/api/document-script", params, (error, response) => {
                error ? reject(error):resolve(response.data)
            })
        });
    }

    static fetchById(recordId, selectList = []) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService()
            restifyService.addSelectColumns(selectList)
            restifyService.findById(constants.DOCUMENT_SCRIPT_ENDPOINT, recordId, (error, response) => {
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
            restifyService.upsert(constants.DOCUMENT_SCRIPT_ENDPOINT, data, (error, response) => {
                return error || response.data.errors ? reject(error) : resolve(response)
            })
        })
    }
    static get(filter) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.addQuery(filter);
			tableAPI.find(constants.DOCUMENT_SCRIPT_ENDPOINT, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}
}