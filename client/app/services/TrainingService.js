import TableAPIService from "../services/TableAPIService";
let endPoint = "/portal/api/table/trn_status";
import Constants from "@/resources/Constants";
import uuidv4 from "uuid/v4";
import _ from "lodash";
import {
	Loading
} from "element-ui";

export default class TrainingService {

	static save(data) {

		return new Promise((resolve, reject) => {
			let restifyService = new TableAPIService()
			restifyService.upsert(endPoint, data, (error, response) => {
				return error || response.data.status == false ? reject(error) : resolve(response)
			})
		})

	}


	static fetchCount(queryParams) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.addQuery(queryParams);
			tableAPI.countRecord(endPoint, (error, response) => {
				error ? reject(error) : resolve(response.count);

			});
		});
	}

	static getModelConfig(queryParams) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.addQuery(queryParams);
			tableAPI.find("/portal/api/table/ks_model", (error, response) => {
				error ? reject(error) : resolve(response);

			});
		});
	}
	static async isRouterTrainingRecordExist() {
		let queryParam = {
			status: "New",
			model_type: Constants.TRANING_MODEL_TYPES.ROUTER_MODEL_TYPE,
			domain: Constants.DOMAINS.OTHER
		}
		let status = true
		let count = await this.fetchCount(queryParam).catch((err) => {
			console.log(err)
		})
		status = count > 0 ? true : false
		return status
	}

	static async start(self, domain, modelType) {
		return new Promise(async (resolve, reject) => {
			// self.$confirm(
			// 		`Are you sure you want to continue with training?`,
			// 		"Confirmation", {
			// 			confirmButtonText: "Confirm",
			// 			cancelButtonText: "Cancel",
			// 			type: "warning"
			// 		}
			// 	)
			// 	.then(async () => {
					let loading = Loading.service()
					let requestData = [];
					let modelType=[]
					let modelTypeMapping={}
					let domainList = !_.isArray(domain) ? [domain] : domain;
					let transaction_id = uuidv4();
					let modelConfig=await this.getModelConfig({"domain": { $in: domainList},"active":true})
					for(const model of modelConfig){
					
						requestData.push({
							model_type: model["model_type"],
							domain: model["domain"],
							transaction_id: transaction_id
						});
					// });
					}
					if(!_.includes(Constants.IDP_TRAINING_DOMAIN, domain)){
					// Constants.EXCLUDE_ROUTER_TRAINING_DOMAIN
					//check if router training record with 'New' status already exist 
					let status = await this.isRouterTrainingRecordExist()
					if (!status) {
						requestData.push({
							model_type: Constants.TRANING_MODEL_TYPES.ROUTER_MODEL_TYPE,
							domain: Constants.DOMAINS.OTHER,
							transaction_id: transaction_id
						})
					}
				}
					let res = await this.save(requestData).catch((err) => {
						reject(err)
					});
					loading.close()
					if (res) {
						return resolve(res)
					}
				// })
				// .catch(() => {})
		})
	}
}
