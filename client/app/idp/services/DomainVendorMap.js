import TableAPIService from "@/services/TableAPIService";
let endPoint = "/portal/api/table/de_vendor_info_map";

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
            restifyService.upsert(endPoint, data, (error, response) => {
                return error || response.data.errors ? reject(error) : resolve(response)
            })
        })
    }

    static fetchData(params) {
        return new Promise((resolve, reject) => {
			let restifyService = new TableAPIService()
			if (!params.selectColumns) return reject('selectColumns parameter required');
			restifyService.addSelectColumns(params.selectColumns);
            restifyService.find(endPoint, (error, response) => {
                return error ? reject(error) : resolve(response)
            })
        })
    }

}

