import TableAPIService from "@/services/TableAPIService";
import AjaxService from "@/services/AjaxService";
const RESTIFY_ENDPOINT = "/portal/api/table/de_code";


export default class ErrorCodeService {
    static fetchById(recordId, selectList = []) {
        return new Promise((resolve, reject) => {
            const restifyService = new TableAPIService()
            restifyService.addSelectColumns(selectList)
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
            restifyService.upsert(RESTIFY_ENDPOINT, data, (error, response) => {
                return error || response.data.errors ? reject(error) : resolve(response)
            })
        })
    }
    static get(params,columns) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService()
            restifyService.addQuery(params)
            restifyService.addSelectColumns(columns)
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

