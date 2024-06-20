import TableAPIService from "../services/TableAPIService";

export default class AutoCorrectService{

	static saveData(data) {
		return new Promise((resolve,reject)=>{
			let restifyService = new TableAPIService();
			restifyService.upsert("/portal/api/table/de_auto_correct_data", data, (error, response) => {
				return error  ?  reject(error) :  resolve(response);
			});
		});
	}

    static getDataById(id){
		return new Promise((resolve,reject)=>{
			let restifyService = new TableAPIService();
			restifyService.findById("/portal/api/table/de_auto_correct_data" ,id, (error, response) => {
				return error ? reject(error) : resolve(response);
			});
		});
	}
}