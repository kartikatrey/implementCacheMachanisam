import constants from "@/resources/Constants";
import AjaxService from "@/services/AjaxService";
import _ from "lodash";

export default class CustomerService {

	constructor() {

	}

	static activate(payload) {
		return new Promise((resolve, reject) => {
			AjaxService.postJson(constants.CUSTOMER_ONBOARDING_ENDPOINT, payload, (error, response) => {
				if (!_.get(response, 'data.data.status')) {

					reject(_.get(response, 'data.data.message') || "Error")
					return
				}
				resolve(_.get(response, 'data.data.message') || "Success")


			})
		})
	}

	static fetchCount() {
		return new Promise((resolve, reject) => {
        
            AjaxService.getJson(constants.CUSTOMER_ONBOARDING_ENDPOINT, {}, (error, response) => {
                if (_.get(response, 'data.status')) {
                   resolve(response)
                }
                reject("Error while fetching count")

            })

		})
	}



}
