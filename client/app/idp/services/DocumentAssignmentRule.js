import TableAPIService from "@/services/TableAPIService";
let endPoint = "/portal/api/table/de_document_assignment_rule";
import AjaxService from "@/services/AjaxService";

export default class DocumentAssignmentRule {
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
    static find(query) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService()
            restifyService.addQuery(query)

            restifyService.find(endPoint, (error, response) => {
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

    static delete(id) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService();
            restifyService.delete(endPoint, id, null, (error, response) => {
                return error || response.data.errors ? reject(error) : resolve(response)
            })
        })
    }

}

