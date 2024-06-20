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

    static updateBRRules(params) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService();
            restifyService.upsert(endPoint, params, (error, response) => {
                return error || response.data.errors ? reject(error) : resolve(response)
            });
        });
    }
    
    static findByIdAndUpdate(data,id){
        return new Promise((resolve, reject) => {
            let tableApiService = new TableAPIService();
            tableApiService.findByIdAndUpdate(endPoint,id,data, (error, response) => {
                error ? reject(error) : resolve(response);
            });
        });
    }

    static getSystemBusinessRule(api,param) {
		//let data = [];  //for bulk save
		return new Promise((resolve, reject) => {
			AjaxService.getJson(api, param, (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(response.data.response)
            })

		});
	}

}
