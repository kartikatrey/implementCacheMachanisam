import AjaxService from "@/services/AjaxService";
import _ from "lodash"



export default class LanguageTranslationService {

	static translate(params) {
		return new Promise((resolve, reject) => {
			AjaxService.getJson("/portal/api/idp/lang/translate", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			})
		});
	}	

	static detectLanguage(params) {
		return new Promise((resolve, reject) => {
			AjaxService.getJson("/portal/api/idp/lang/detect", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			})
		});
	}	
}
