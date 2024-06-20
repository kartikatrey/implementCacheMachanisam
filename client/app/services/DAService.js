import tableAPIService from "@/services/TableAPIService";
import constants from "@/resources/Constants";
import AjaxService from "@/services/AjaxService";


export default class DAService {
    constructor() { }
    static save(formData) {
        return new Promise((resolve, reject) => {
            let tableAPI = new tableAPIService();
            tableAPI.upsert(constants.CUSTOMER_CONFIGURATION, formData, (error, response) => {
                (error || (!response || !response.data || !response.data._id)) ? reject(error) : resolve(response.data);
            })
        })
    }   
    static fetchById(recordId) {
        return new Promise((resolve, reject) => {
            let tableAPI = new tableAPIService()
            tableAPI.findById(constants.CUSTOMER_CONFIGURATION, recordId, (error, response) => {
                if (error) {
                    reject(error);
                    return
                }
                resolve(response)
            });
        })
    }
    static get() {
        return new Promise((resolve, reject) => {
            let restifyService = new tableAPIService()
            restifyService.addSelectColumns([
                "_id",
                "da_config"
            ])
            restifyService.findOne(constants.CUSTOMER_CONFIGURATION, (error, response) => {
                return error ? reject(error) : resolve(response)
            })
        })
    }

    static find() {
		return new Promise((resolve, reject) => {
			let restifyService = new tableAPIService();
			// const columnList = ["ui_config.logo "];
			// restifyService.addSelectColumns(columnList);
			restifyService.find(constants.CUSTOMER_CONFIGURATION, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}
    static createDA(params){ 
        return new Promise((resolve, reject) => {
            AjaxService.postJson("/portal/api/digital-assistant-customer", params, (error, response) => {
                return error ? reject(error) : resolve(response.data.data)	
            		})
		})

      }

    static setup(params) { 
        return new Promise((resolve, reject) => {
            AjaxService.postJson("/portal/api/digital-assistance-setup", params, (error, response) => {
                return error ? reject(error) : resolve(response.data)	
            		})
		})
    }


}




