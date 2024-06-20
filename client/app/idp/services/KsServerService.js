import constants from "@/resources/Constants";
import TableAPIService from "@/services/TableAPIService";

export default class KsServerService {

    static find(params={},cols=[]) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.addQuery(params);
			tableAPI.addSelectColumns(cols)
			tableAPI.find(constants.KS_SERVER_ENDPOINT, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}
}