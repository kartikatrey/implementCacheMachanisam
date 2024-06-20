import TableAPIService from "../services/TableAPIService";
import AjaxService from "@/services/AjaxService";
let endPoint = `/portal/api/table/` 
import constants from "@/resources/Constants";

export default class UploadService {

	static save(tableName, data) {
		let tableAPIService = new TableAPIService()
		return new Promise((resolve, reject) => {
			tableAPIService.upsert(endPoint+tableName, data, (error, response) => {
				return error || response.data.errors ? reject(error) : resolve(response)
			})
		})
	}
	static getSampleDocuments(documentType) {
		return new Promise((resolve, reject) => {
			AjaxService.getJson(constants.SAMPLE_DOCS_ENDPOINT, {document_type: documentType}, (error, response) => {
                return error ? reject(error) : resolve(response.data)
            })
		});
	}
	static uploadSampleDocuments(data) {
		return new Promise((resolve, reject) => {
			AjaxService.postJson(constants.SAMPLE_DOCS_ENDPOINT, data, (error, response) => {
                return error ? reject(error) : resolve(response.data)
            })
		});
	}
}
