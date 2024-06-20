import TableAPIService from "../services/TableAPIService";
// let endPoint = "/portal/api/table/script";
// import constants from "@/resources/Constants";
import AjaxService from "@/services/AjaxService";
export default class CommonService{

	static save(endpoint,data) {
		return new Promise((resolve,reject)=>{
			let restifyService = new TableAPIService();
			restifyService.upsert(endpoint, data, (error, response) => {
				return error  ?  reject(error) :  resolve(response);
			});
		});
        
	}
  
	static fetchById(endpoint,recordId){
		return new Promise((resolve,reject)=>{
			let restifyService = new TableAPIService();
			restifyService.findById(endpoint ,recordId, (error, response) => {
				return error ? reject(error) : resolve(response);
			});
		});
	}

	static fetchActiveCount(endpoint) {
		return new Promise((resolve, reject) => {
			let restifyService = new TableAPIService();
			restifyService.addQuery({ "active": true });
			restifyService.countRecord(endpoint, (error, response) => {
				error ? reject(error) : resolve(response.count);
			});
		});
	}

	static fetchRecord(endpoint,params){
		return new Promise((resolve,reject)=>{
			let restifyService = new TableAPIService();
			restifyService.addQuery(params);
			restifyService.find(endpoint , (error, response) => {
				return error ? reject(error) : resolve(response);
			});
		});

	}
	static fetchConfigCollectionList() {
		return new Promise((resolve, reject) => {
			AjaxService.getJson("/portal/api/db-collections", null, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			})
		});
	}

	static getWritePermissions(resourceName) {
		return new Promise((resolve, reject) => {
			const params = {
				resource_name: resourceName,
				active : true,
				add_user_roles_in_filter : true,
				operation: "write",
				resource_type: "table"
			}
			const restifyService = new TableAPIService();
			restifyService.addQuery(params);
			restifyService.find("/portal/api/table/cp_permission" , (error, response) => {
				return error ? reject(error) : resolve(response);
			});
		});
	}

}