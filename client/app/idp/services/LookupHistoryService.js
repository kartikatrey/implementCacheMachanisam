import TableAPIService from "@/services/TableAPIService";
let endPoint = "/portal/api/table/lookup_history";
import Constants from "@/resources/Constants";


export default class LookupHistoryService {
	static fetchById(id) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.findById(endPoint, id, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}
	static fetchVersionsByRecordId(recordId, projection) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			const filter = { record_id: recordId };
			tableAPI.addQuery(filter);
			tableAPI.addSelectColumns(projection);
			tableAPI.find(endPoint, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}
	static fetchCurrentVersionByRecordId(recordId, projection = []) {
		const queryParam = {
			record_id: recordId,
			status: Constants.LOOKUP.HISTORY_STATUS.CURRENT
		}
		let tableAPI = new TableAPIService();
		tableAPI.addQuery(queryParam)
		tableAPI.addSelectColumns(projection)
		return new Promise((resolve, reject) => {
			tableAPI.find(endPoint, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			});
		})
	}
}
