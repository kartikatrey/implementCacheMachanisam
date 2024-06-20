import TableAPIService from "@/services/TableAPIService";
let endPoint = "/portal/api/table/cp_group";


export default class UserGroupService {
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

    static get(params, selectedColumn = []) {
        return new Promise((resolve, reject) => {
            let endPoint='/portal/api/table/cp_group'
            let restifyService = new TableAPIService()
            restifyService.addQuery(params)
            restifyService.addSelectColumns(selectedColumn)
            restifyService.find(endPoint, (error, response) => {
                if (error) {
                    reject(error);
                    return
                }
                resolve(response)
            });
        })
    }
   

}

