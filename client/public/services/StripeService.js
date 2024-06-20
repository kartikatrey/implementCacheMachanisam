let AjaxService = require("./AjaxService");

export default class PaymentService {

    constructor() { }

   
    static createStripeCustomer() {
        return new Promise((resolve, reject) => {
            AjaxService.postJson('/portal/api/stripe-customer', {}, (error, stripeCustomer) => {
                return error ? reject(error) : resolve(stripeCustomer.data.data)	
            		})
		})
      
    }


    static getPrices(params){
        return new Promise((resolve,reject)=>{
            AjaxService.getJson('/portal/api/product-plans',params, (error, response) => {
                return error ? reject(error) : resolve(response.data)	
            		})
        })
    }

}