import TableAPIService from "../services/TableAPIService";
let endPoint = "/portal/api/table/entity_tag_list";

export default class EntityTagListService {

	static save(data) {
			return new Promise((resolve, reject) => {
				try {
					let restifyService = new TableAPIService()
					restifyService.upsert(endPoint, data, (error, response) => {
						return error ? reject(error) : resolve(response)
					})
				} catch (error) {}

			})

		}

		static fetchById(recordId) {
			return new Promise((resolve, reject) => {
				let restifyService = new TableAPIService()
				restifyService.findById(endPoint, recordId, (error, response) => {
					if (error) {
						reject(error);
						return
					}
					resolve(response)
				});
			})
		}

		static fetchTagListByDomain(domain) {
			let queryParams = {
				domain,
				active: true
			};
			let restifyService = new TableAPIService();
			return new Promise((resolve, reject) => {
				restifyService.addQuery(queryParams);
				restifyService.find(endPoint, (error, response) => {
					if (!error && response[0]) {
						resolve(response[0])
					}
					reject(error)
				});
			});
		}
}
