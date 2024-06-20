import _ from "lodash";
import Constants from "@/resources/Constants";
import TableAPIService from "@/services/TableAPIService";

export default class UserPreferenceService {
	static getAllSavedAdvanceQueryByDocType(docType){
		return new Promise((resolve, reject) => {
			const tableApiService = new TableAPIService();
            const filter = { type: "advance_search_query", document_type: docType, active: true };
            const columns = ["_id", "name", "query", "user_id", "shared", "created_by"];
			tableApiService.addQuery(filter);
			tableApiService.addSelectColumns(columns);
			tableApiService.find(Constants.USER_PREFERENCE_ENDPOINT, (error, response) => {
                return error ? reject(error) : resolve(response)
			})
		})
	}

	static upsertAdvanceSearchQuery(payload){
		return new Promise((resolve, reject) => {
			let tableApiService = new TableAPIService();
            payload.type = "advance_search_query";
			tableApiService.upsert(Constants.USER_PREFERENCE_ENDPOINT, payload, (error, response) => {
				if (error) {
					reject(error);
				} else {
					resolve(response);
				}
			});
		});
	}
}
