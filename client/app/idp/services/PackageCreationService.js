import AjaxService from "@/services/AjaxService";
import Constants from "@/resources/Constants";
import _ from "lodash";

export default class PackageCreationService {
	static create(payload) { 
		return new Promise((resolve, reject) => {
			AjaxService.postJson(
				Constants.CREATE_PACKAGE_API_ENDPOINT, payload, (error, response) => {
					return error ? reject(error) : resolve(response.data)
				}
			)
		});
	}
}
