import TableAPIService from "@/services/TableAPIService";

export default class AutoCorrectService{

	static saveConfiguration(data) {
		return new Promise((resolve,reject)=>{
			let restifyService = new TableAPIService();
			restifyService.upsert("/portal/api/table/customer_sso_config", data, (error, response) => {
				return error  ?  reject(error) :  resolve(response);
			});
		});
	}

    static getConfigurationById(id){
		return new Promise((resolve,reject)=>{
			let restifyService = new TableAPIService();
			restifyService.findById("/portal/api/table/customer_sso_config" ,id, (error, response) => {
				return error ? reject(error) : resolve(response);
			});
		});
	}
}