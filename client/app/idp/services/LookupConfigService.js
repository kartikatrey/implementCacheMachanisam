import TableAPIService from "@/services/TableAPIService";
import AjaxService from "@/services/AjaxService";
const RESTSERVICE_ENDPOINT = "/portal/api/lookup-config";
const RESTIFY_ENDPOINT = "/portal/api/table/lookup_configuration";


export default class LookupConfigService {
    static fetchById(recordId) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService()
            restifyService.findById(RESTIFY_ENDPOINT, recordId, (error, response) => {
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
            AjaxService.putJson(RESTSERVICE_ENDPOINT, data, (error, response) => {
                return error || response.status != 200 ? reject(error) : resolve(response.data);
            })
        })
    }

    static save(data) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService();
            restifyService.upsert(RESTIFY_ENDPOINT, data, (error, response) => {
                return error || response.data.errors ? reject(error) : resolve(response)
            })
        })
    }
    static get(params, selectedColumn=[]) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService()
            restifyService.addQuery(params)
            restifyService.addSelectColumns(selectedColumn)
            restifyService.find(RESTIFY_ENDPOINT, (error, response) => {
                if (error) {
                    reject(error);
                    return
                }
                resolve(response)
            });
        })
    }

}

