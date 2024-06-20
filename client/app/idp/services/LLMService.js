import TableAPIService from "@/services/TableAPIService";
const endpoint = "/portal/api/table/de_extraction_llm";

export default class LLMService {

    static getLLMRecordById(recordId){
		return new Promise((resolve, reject) => {
			let tableApiService = new TableAPIService();
			tableApiService.findById(endpoint, recordId, (error, response) => {
			if (error) {
				reject(error);
			} else {
				resolve(response);
				}
			});
		});
	}

	static upsertLLMRecrod(payload){
		return new Promise((resolve, reject) => {
			let tableApiService = new TableAPIService();
			tableApiService.upsert(endpoint, payload, (error, response) => {
				if (error) {
					reject(error);
				} else {
					resolve(response);
				}
			});
		});
	}

}
