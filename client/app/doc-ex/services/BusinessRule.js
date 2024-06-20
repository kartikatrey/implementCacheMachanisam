import TableAPIService from "@/services/TableAPIService";
let endPoint = "/portal/api/table/de_business_rule";
import AjaxService from "@/services/AjaxService";


export default class BusinessRule {
    static fetchById(recordId) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService()
            restifyService.findById(endPoint, recordId, (error, response) => {
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
            restifyService.upsert(endPoint, data, (error, response) => {
                return error || response.data.errors ? reject(error) : resolve(response)
            })
        })
    }

    static get(filter) {
        return new Promise((resolve, reject) => {
            let tableApiService = new TableAPIService();
            tableApiService.addQuery(filter)
            tableApiService.find('/portal/api/idp/de_businessRules', (error, response) => {
                return error || response.data.errors ? reject(error) : resolve(response)
            })
        })
    }


    static create(payload) {
        return new Promise((resolve, reject) => {
            AjaxService.postJson('/portal/api/idp/de_businessRules', payload, (error, response) => {
                return error ? reject(error) : resolve(response)
            })
        });
    }




}

