import TableAPIService from "@/services/TableAPIService";
import Constants from "@/resources/Constants";
import AjaxService from "@/services/AjaxService";

export default class DynamicButtonConfig {
    static fetchById(recordId) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService()
            restifyService.findById(Constants.DE_ACTION_ENDPOINT, recordId, (error, response) => {
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
            restifyService.upsert(Constants.DE_ACTION_ENDPOINT, data, (error, response) => {
                return error || response.data.errors ? reject(error) : resolve(response)
            })
        })
    }

    static fetchAll(query, selectList) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService();
            restifyService.addQuery(query);
            restifyService.addSelectColumns(selectList);
            restifyService.find(Constants.DE_ACTION_ENDPOINT, (error, response) => {
                if (error) {
                    reject(error);
                    return
                }
                resolve(response)
            });
        })
    }
    static callActionHandler(payload){
        return new Promise((resolve, reject) => {
            AjaxService.postJson("/portal/api/document/action", payload, (error, response) => {
                error ? reject(error):resolve(response.data)
            })
        });
    }

    static getActions(payload,selectList=[]){
        return new Promise((resolve, reject) => {
            AjaxService.getJson("/portal/api/document/action", payload, (error, response) => {
                error ? reject(error):resolve(response.data)
            })
        });
    }

    static run(params) {
        return new Promise((resolve, reject) => {
            AjaxService.postJson("/portal/api/actionButton-script-run", params, (error, response) => {
                error ? reject(error):resolve(response.data)
            })
        });
    }

}

