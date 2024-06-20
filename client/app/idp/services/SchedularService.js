import TableAPIService from "@/services/TableAPIService";
import constants from "@/resources/Constants";
import AjaxService from "@/services/AjaxService";

export default class SchedularService {
    static fetchById(recordId) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService()
            restifyService.findById(constants.SCHEDULAR_ENDPOINT, recordId, (error, response) => {
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
            restifyService.upsert(constants.SCHEDULAR_ENDPOINT, data, (error, response) => {
                return error || response.data.errors ? reject(error) : resolve(response)
            })
        })
    }
    static get(filter,column = [] ) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.addQuery(filter);
			tableAPI.addSelectColumns(column);
			tableAPI.find(constants.SCHEDULAR_ENDPOINT, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}

    static runSchedulerById(schedulerId) {
        return new Promise((resolve, reject) => {
            const params = { scheduler_id: schedulerId };
            AjaxService.postJson("/portal/api/schedular", params, (error, response) => {
                error ? reject(error):resolve(response.data)
            })
        });
    }
}