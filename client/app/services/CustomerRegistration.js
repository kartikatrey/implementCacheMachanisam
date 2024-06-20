import AjaxService from "@/services/AjaxService";
import constants from "@/resources/Constants";

export default class CustomerRegistration {

	constructor() {}


    

    static createCustomer(formData) {
        return new Promise((resolve, reject) => {
            AjaxService.postJson("portal/api/portal-customer", formData, (error, response) => {
                return error ? reject(error) : resolve(response.data.data)	
            		})
		})

    }
    
    static onBoarding(formData) {
        return new Promise((resolve, reject) => {
            AjaxService.postJson(constants.CUSTOMER_ONBOARDING_ENDPOINT, formData, (error, response) => {
                return error ? reject(error) : resolve(response.data.data)	
            		})
		})

	}
   
    

}
