import tableAPIService from "@/services/TableAPIService";
import constants from "@/resources/Constants";

export default class TemplateService {
	constructor() {}
	static fetchFileList() {
		return new Promise((resolve, reject) => {
			let tableAPI = new tableAPIService();
			const columnList = ["_id,", "filename"];
			tableAPI.addSelectColumns(columnList);
			tableAPI.find(constants.KTT_TEMPLATE_FILE_ENDPOINT, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}


}


