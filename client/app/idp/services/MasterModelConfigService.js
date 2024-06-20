import TableAPIService from "@/services/TableAPIService";
import constants from "@/resources/Constants";

export default class MasterModelConfigService {
    static get(filter,column = [] ) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.addQuery(filter);
			tableAPI.addSelectColumns(column);
			tableAPI.find(constants.MASTERMODEL_CONFIG_ENDPOINT, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}
}