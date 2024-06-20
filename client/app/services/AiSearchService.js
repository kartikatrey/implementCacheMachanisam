import _ from "lodash";
import AjaxService from "@/services/AjaxService";


export default class DataTableService {

	constructor() {

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
