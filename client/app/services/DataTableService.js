import tableAPIService from "@/services/TableAPIService";
import _ from "lodash";

export default class DataTableService {

	constructor() {

	}


	static save(rows,api) {
		//let data = [];  //for bulk save
		return new Promise((resolve, reject) => {
			_.forEach(rows,(row)=>{
				if(row.editable){
					//data.push(row); //for bunl save
					let payload = _.cloneDeep(row)
					delete payload.editable
					let tableAPI = new tableAPIService();
					tableAPI.upsert(api, payload, (error, response) => {
						(error || (!response || !response.data || !response.data._id)) ? reject(error) : resolve(response.data);
					});
				}
			});

			//for bulk save // not working.. mongo duplicate key error
			// let tableAPI = new tableAPIService();
			// tableAPI.upsert(api, data, (error, response) => {
			// 	(error || (!response || !response.data || !response.data._id)) ? reject(error) : resolve(response.data);
			// });

		});
	}
	static getAiSearchData(params) {
		//let data = [];  //for bulk save
		return new Promise((resolve, reject) => {
			AjaxService.getJson("/portal/api/recommendation", params, (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(response.data.result)
            })

		});
	}

}
