import TableAPIService from "@/services/TableAPIService";
let endPoint = "/portal/api/table/cp_role";


export default class RoleService {
    static fetchById(id, projection=[]) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService();
            restifyService.addSelectColumns(projection);
            restifyService.findById(endPoint, id, (error, response) => {
                if (error) {
                    reject(error);
                    return
                }
                resolve(response)
            });
        })
    }
    static fetchRecords(params) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.addQuery(params);
			tableAPI.find(endPoint, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}
    static save(data) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService();
            restifyService.upsert(endPoint, data, (error, response) => {
                return error || response.data.errors ? reject(error) : resolve(response)
            })
        })
    }
   

}

