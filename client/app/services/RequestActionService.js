// Purpose: contains services related to de_request_action_form 
// RequestActionService service is only related to form actions(ex. publish, save, draft, etc.). While requestFormService is related to Request Form containing services like(get and set request forms, validate and send OTP etc.)
import TableAPIService from "@/services/TableAPIService";
import constants from "@/resources/Constants";
export default class RequestActionService {

    static getRequestFormActions(params){
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService();
            restifyService.addQuery(params);
            restifyService.find(constants.DE_REQUEST_ACTION_ENDPOINT, (error, response) => {
                if(error){
                    reject(error);
                    return;
                }
                resolve(response);
            });
        });
    }
    //service to get record from de_request_action_form
    static getRequestAction(params) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService()
            restifyService.findById(constants.DE_REQUEST_ACTION_ENDPOINT, params, (error, response) => {
                if (error) {
                    reject(error);
                    return
                }
                resolve(response)
            });
        })
    }
    //service to save form trigger actions
    static saveRequestAction(payload) {
            return new Promise((resolve, reject) => {
                let restifyService = new TableAPIService();
                restifyService.upsert(constants.DE_REQUEST_ACTION_ENDPOINT, payload, (error, response) => {
                    return error || response.data.errors ? reject(error) : resolve(response)
                })
            })
    }
    //for deletion of particular record.
    static deleteRequestAction(id, params) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.delete(constants.DE_REQUEST_ACTION_ENDPOINT, id, params, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}
}
