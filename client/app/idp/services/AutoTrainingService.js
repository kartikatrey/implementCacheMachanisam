import AjaxService from "@/services/AjaxService";
import TableAPIService from "@/services/TableAPIService";
export default class AutoTrainingService {
    static getFileUrl(params) {
        return new Promise((resolve, reject) => {
            AjaxService.getJson("/portal/api/auto-training-file", params, (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(response.data)
            })
        });
    }
    static getMasterModelConfig(masterModelId, params = {}){
        return new Promise((resolve, reject) => {
            let tableAPI = new TableAPIService();
            tableAPI.findById("/portal/api/table/master_model_config", masterModelId, (error, response) => {
				error ? reject(error) : resolve(response);
			});
        });
    }
    static deployModel(payload){
        return new Promise((resolve, reject) => {
            const endpoint = "/portal/api/idp/deploy-model";
            AjaxService.postJson(endpoint, payload, (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(response.data)
            })
        });
    }
}