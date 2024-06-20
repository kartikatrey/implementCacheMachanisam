import TableAPIService from "../services/TableAPIService";
let endPoint = "/portal/api/table/intent_info";

export default class IntentInfoService {

	
	static save(data) {
		console.log("sdsddsdd",data);
		return new Promise((resolve, reject) => {
			try {
				let restifyService = new TableAPIService()
				restifyService.upsert(endPoint, data, (error, response) => {
					return error ? reject(error) : resolve(response)

				})
			} catch (error) {
				console.log("sdsddsdd",error);
			}

		})

	}


		static fetchById(recordId) {
			return new Promise((resolve, reject) => {
				let restifyService = new TableAPIService();
				restifyService.findById(endPoint, recordId, (error, response) => {
					if (error) {
						reject(error);
						return;
					}
					resolve(response);
				});
			})
		}
		static fetchDomainList() {
			return new Promise((resolve, reject) => {
				let endPoint = "/portal/api/table/customer_system";
				let restifyService = new TableAPIService();
				const columnList = ["domain"];
				restifyService.addQuery({"domain":{"$nin":[null,""]}})
				restifyService.addSelectColumns(columnList);
				restifyService.find(endPoint, (error, response) => {
					error ? reject(error) : resolve(response);
				});
			});
	
	
		}
		static fetchByDomain(domain) {
			let queryParams = {
				domain: domain,
			};
			let restifyService = new TableAPIService();
			return new Promise((resolve, reject) => {
				restifyService.addQuery(queryParams);
				restifyService.find(endPoint, (error, response) => {
					console.log(response);
					if(response.length == 0){
						resolve(null);
					}
					else if (!error && response[0]) {
						resolve(response[0])
					}
					reject(error)
				});
			});
		}

	// static fetchAllIntentInfo() {
	// 	return new Promise((resolve, reject) => {
	// 		let restifyService = new TableAPIService();
	// 		restifyService.find(endPoint, (error, response) => {
	// 			error ? reject(error) : resolve(response);
	// 		});
	// 	});
	// }
}