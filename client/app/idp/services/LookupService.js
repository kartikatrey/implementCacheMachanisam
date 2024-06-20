import TableAPIService from "@/services/TableAPIService";
import AjaxService from "@/services/AjaxService";
import Constants from "@/resources/Constants";

let RESTIFY_ENDPOINT = "/portal/api/table/lookup";
let CHECK_DUPLICATE_RECORDS_REST_ENDPOINT = "/portal/api/lookup-duplicate-records";

export default class LookupService {
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
    static save(data) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService();
            console.log(data)
            restifyService.upsert(RESTIFY_ENDPOINT, data, (error, response) => {
                return error || response.data.errors ? reject(error) : resolve(response)
            })
        })
    }

    static upsert(data) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService();
            console.log(data)
            AjaxService.putJson(Constants.LOOKUP_ENDPOINT, data, (error, response) => {
                return error || response.data.errors ? reject(error) : resolve(response)
            })
        })
    }
    static getLookUpData(data) {
        return new Promise((resolve, reject) => {
            AjaxService.getJson(Constants.LOOKUP_ENDPOINT, data, (error, response) => {
                return error || response.data.errors ? reject(error) : resolve(response.data)
            })
        })
    }
    static fetch(query, selectedColumn=[]) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService()
            restifyService.addQuery(query)
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
   
    static update(params) {
        return new Promise((resolve, reject) => {
            AjaxService.putJson(RESTIFY_ENDPOINT, params, (error, response) => {
                console.log("response ", response);
                return error || response.status != 200 ? reject(error) : resolve(response.data);
            })
        });
    }
   
    static delete(params) {
        return new Promise((resolve, reject) => {
            AjaxService.deleteJson(Constants.LOOKUP_ENDPOINT, params, (error, response) => {
                return error || response.data.errors ? reject(error) : resolve(response)
            })
        });
    }

    static checkForDuplicateRecords(data) {
       return new Promise((resolve, reject) => {
            AjaxService.getJson(CHECK_DUPLICATE_RECORDS_REST_ENDPOINT, data, (error, response) => {
                return error || (response.status != 200 && response.statusCode != 200) ? reject(error) : resolve(response.data);
            })
       }) 
    }
}

