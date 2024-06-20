
import AjaxService from "@/services/AjaxService";
import TableAPIService from "@/services/TableAPIService";
let endPoint = "/portal/api/table/version";

export default class VersionService {
    static fetchById(id) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.findById(endPoint, id, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}
    static restoreRecord(params){
        return new Promise((resolve, reject) => {
            AjaxService.postJson("/portal/api/version", params, (error, response) => {
                error ? reject(error):resolve(response.data);
            });
        });
    }
    static fetchVersionsByRecordId(recordId, projection) {
        return new Promise((resolve, reject) => {
            let tableAPI = new TableAPIService();
            const filter = { record_id: recordId, active: true };
			tableAPI.addQuery(filter);
            tableAPI.addSelectColumns(projection);
            tableAPI.find(endPoint, (error, response) => {
                error ? reject(error) : resolve(response);
            });
        });
    }
    static fetchCurrentVersionByRecordId(recordId, projection){
        return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
            const filter = { record_id: recordId, status: "current", active: true};
			tableAPI.addQuery(filter);
            tableAPI.addSelectColumns(projection);
			tableAPI.find(endPoint, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
    }
}
   