//created new form service for fetching records from de_form table
import constants from "@/resources/Constants";
import TableAPIService from "@/services/TableAPIService";
export default class FormService {
	static getForm(params, projection) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.addQuery(params);
			tableAPI.addSelectColumns(projection);
			tableAPI.find(constants.DE_FORM_ENDPOINT, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}
}
