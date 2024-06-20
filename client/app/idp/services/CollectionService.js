import TableAPIService from "@/services/TableAPIService";
let endPoint = "/portal/api/table/";


export default class BusinessRule {
    static fetchByTableNameAndId(tableName,recordId) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService()
            restifyService.findById(endPoint+tableName, recordId, (error, response) => {
                if (error) {
                    reject(error);
                    return
                }
                resolve(response)
            });
        })
    }
}
