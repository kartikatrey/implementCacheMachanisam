
import AjaxService from "@/services/AjaxService";
import constants from "@/resources/Constants";
import TableAPIService from "@/services/TableAPIService";

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
    
    static save(payload) {
		return new Promise((resolve, reject) => {
            AjaxService.postJson(constants.DE_CUSTOMER_CONFIGURATION, payload, (error, response) => {
				return error ? reject(error) : resolve(response)
			})
		});
  }

    static getSystemConfig(params) {
      return new Promise((resolve, reject) => {
               AjaxService.getJson("/portal/api/de-system-configuration", params, (error, response) => {
                  if (error) {
                      reject(error);
                      return;
                  }
                  resolve(response)
              })
      });
      }
}
