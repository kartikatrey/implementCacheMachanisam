import constants from "@/resources/Constants";
import TableAPIService from "@/services/TableAPIService";

export default class EmailsService {
	static getEmailsTemplates() {
        const params={
            active:true
        }
		return new Promise((resolve, reject) => {
			AjaxService.getJson(constants.EMAILS_ENDPOINT, params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			})
		});
	}
	static getEmailsTemplateNames() {
		return new Promise((resolve, reject) => {
			const params={
				active:true
			}
			let restifyService = new TableAPIService();
			const columnList = ["name"];
			restifyService.addSelectColumns(columnList);
			restifyService.addQuery(params);
			restifyService.find(constants.EMAILS_ENDPOINT, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}

	static getEmailsTemplatesByFilter(params, columnList) {
		return new Promise((resolve, reject) => {
			let restifyService = new TableAPIService();
			restifyService.addSelectColumns(columnList);
			restifyService.addQuery(params);
			restifyService.find(constants.EMAILS_ENDPOINT, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}
}