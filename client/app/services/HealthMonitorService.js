import tableAPIService from "@/services/TableAPIService";
import constants from "@/resources/Constants";

export default class HealthMonitorService {
    constructor() {
	}
	static getLatestHealthLog(){
		return new Promise((resolve, reject) => {
			let tableAPI = new tableAPIService();
            tableAPI.addSortCondition("-created_at");
            tableAPI.addLimit(1)
			tableAPI.find(constants.SYSTEM_HEALTH_LOG_ENDPOINT, (error, response) => {
				error ? reject(error) : resolve(response && response.length ? response : []);
			});
		});
	}
}
