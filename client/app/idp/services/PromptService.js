import TableAPIService from "@/services/TableAPIService";
import Constants from "@/resources/Constants";


export default class PromptService {
	
	static getAllPrompts(filter, columns){
		return new Promise((resolve, reject) => {
			const tableApiService = new TableAPIService();
			tableApiService.addQuery(filter);
			tableApiService.addSelectColumns(columns);
			tableApiService.find(Constants.PROMPT_ENDPOINT, (error, response) => {
                return error ? reject(error) : resolve(response)
			})
		})
	}

    static findPromptbyId(recordId){
		return new Promise((resolve, reject) => {
			let tableApiService = new TableAPIService();
			tableApiService.findById(Constants.PROMPT_ENDPOINT, recordId, (error, response) => {
			if (error) {
				reject(error);
			} else {
				resolve(response);
				}
			});
		});
	}

	static upsertPrompt(payload){
		return new Promise((resolve, reject) => {
			let tableApiService = new TableAPIService();
			tableApiService.upsert(Constants.PROMPT_ENDPOINT, payload, (error, response) => {
				if (error) {
					reject(error);
				} else {
					resolve(response);
				}
			});
		});
	}

}
