import AjaxService from "@/services/AjaxService";
import constants from "@/resources/Constants";
import TableAPIService from "@/services/TableAPIService";
import lodash from 'lodash'

export default class FieldService {
	static get(params) {
		return new Promise((resolve, reject) => {
			AjaxService.getJson("/portal/api/doc-extraction-fields", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			})
		});
	}
	static getPackageFields(params) {
		params["packageFields"] = true;
		return FieldService.get(params)
	}
	static saveSelectedFields(payoad) {
		return new Promise((resolve, reject) => {
			AjaxService.putJson(
				"/portal/api/doc-extraction-fields", payoad,
				(err, res) => {
					err ? reject(error) : resolve(res.data);
				}
			);
		});
	}

	static getFieldsList(params, selectList = []) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.addQuery(params);
			tableAPI.addSelectColumns(selectList);
			tableAPI.addSortCondition("name");
			tableAPI.find(constants.DE_FIELD_ENDPOINT, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}

	static save(payload) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.upsert(constants.DE_FIELD_ENDPOINT, payload, (error, response) => {				
				if (error || (!response || !response.data || !response.data._id) || _.get(response, "data.name") == "MongoError") {
					let errorMessage = "Error while updating field";
					if(_.get(response, "data.errmsg").includes("unique_name_idx")) errorMessage = "Name already exists";
					return reject(errorMessage);
				}
				resolve(response.data);
			})
		});
	}

	static fetchById(id) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.findById(constants.DE_FIELD_ENDPOINT, id, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}

	static deleteField(id, params) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.delete(constants.DE_FIELD_ENDPOINT, id, params, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}
	static getAutoCompleteRule(filter) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.addQuery(filter);
			tableAPI.find(constants.AUTO_COMPLETE_ENDPOINT, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}
	static getFieldByDocumentType(filter,column = []) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.addQuery(filter);
			tableAPI.addSelectColumns(column);
			tableAPI.find('/portal/api/table/de_field', (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}
}
