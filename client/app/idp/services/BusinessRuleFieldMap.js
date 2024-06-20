import TableAPIService from "@/services/TableAPIService";
let endPoint = "/portal/api/table/de_business_rule_field_map";


export default class BusinessRuleFieldMap {
    static isBRMappedToFields(queryParam) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService();
            restifyService.addQuery(queryParam)
            restifyService.find(endPoint,(error, response) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(response)
            })
        })
    }
}



