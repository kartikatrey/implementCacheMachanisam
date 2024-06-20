//created new client service for fetching emails
import constants from "@/resources/Constants";
import TableAPIService from "@/services/TableAPIService";
export default class EmailService {
	static getEmails(params, projection) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.addQuery(params);
			tableAPI.addSelectColumns(projection);
			tableAPI.find(constants.EMAILS_ENDPOINT, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}
}
