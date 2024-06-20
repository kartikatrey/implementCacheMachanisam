import TableAPIService from "@/services/TableAPIService";
import Constants from "@/resources/Constants";
import AjaxService from "@/services/AjaxService";

export default class Message {
	static fetch(query,limit,skip) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.addLimit(limit);
			tableAPI.addSkip(skip);
			tableAPI.addQuery(query);
			tableAPI.find(Constants.DE_MESSAGE_ENDPOINT, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}
	static markMessagesAsRead(params){
		return new Promise((resolve, reject) => {
			AjaxService.putJson("/portal/api/idp/read-document-messages", params, (error, response) => {
				error ? reject(error):resolve(response.data);
			});
		});
	}

	static getFileUploadConfig(filter) {
		return new Promise((resolve, reject) => {
			AjaxService.getJson("/portal/api/file-upload-config", filter, (error, response) => {
				error ? reject(error):resolve(response.data);
			});
		});
	}
   
  
}

