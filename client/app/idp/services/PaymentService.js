import AjaxService from "@/services/AjaxService";
import constants from "@/resources/Constants";

export default class PaymentService {

	constructor() {}

	static getStripeCustomer(customerId) {
		return new Promise((resolve, reject) => {
			AjaxService.getJson('/api/payment/customer/' + customerId, {}, (error, response) => {
				error ? reject(error) : resolve(response)
			})
		})
	}


	static createStripeCustomer(tokenData) {
		return new Promise((resolve, reject) => {
			AjaxService.postJson('/portal/api/stripe-customer', tokenData, (error, stripeCustomer) => {
				return error ? reject(error) : resolve(stripeCustomer.data.data)
			})
		})

	}

	static updateCardDetails(tokenData) {
		return new Promise((resolve, reject) => {
			AjaxService.putJson('/portal/api/idp/payment-cards', tokenData, (error, response) => {
				return error ? reject(error) : resolve(response.data)
			})
		})
	}

	static getPrices(params) {
		return new Promise((resolve, reject) => {
			AjaxService.getJson('/portal/api/product-plans', params, (error, response) => {
				return error ? reject(error) : resolve(response.data)
			})
		})
	}

	static addCard(tokenData) {
		return new Promise((resolve, reject) => {
			AjaxService.postJson('/portal/api/idp/payment-cards', tokenData, (error, response) => {
				return error ? reject(error) : resolve(response.data)
			})
		})
	}

	static addDefaultCard(tokenData) {
		return new Promise((resolve, reject) => {
			AjaxService.postJson('/portal/api/idp/default-card', tokenData, (error, response) => {
				return error ? reject(error) : resolve(response)
			})
		})
	}

	static deleteCard(params) {
		return new Promise((resolve, reject) => {
			AjaxService.deleteJson("/portal/api/idp/payment-cards", params, (error, response) => {
				return error ? reject(error) : resolve(response.data)
			})
		})
	}

	static fetchSubscriptions() {
		return new Promise((resolve, reject) => {
			AjaxService.getJson('/portal/api/subscriptions', {}, (error, response) => {
				return error ? reject(error) : resolve(response.data)
			})
		})
	}

	static createSubscription(params) {
		return new Promise((resolve, reject) => {
			AjaxService.postJson('/portal/api/subscriptions', params, (error, response) => {
				return error ? reject(error) : resolve(response.data.data)
			})
		})

	}

	static cancelSubscription(params) {
		return new Promise((resolve, reject) => {
			AjaxService.putJson('/portal/api/subscriptions', params, (error, response) => {
				return error ? reject(error) : resolve(response)
			})
		})

	}

	static updateSubscription(params) {
		return new Promise((resolve, reject) => {
			AjaxService.putJson('/portal/api/subscriptions', params, (error, response) => {
				return error ? reject(error) : resolve(response)
			})
		})

	}
	static getCustomerBalance(params) {
		return new Promise((resolve, reject) => {
			AjaxService.getJson('/portal/api/customer-balance', params, (error, response) => {
				return error ? reject(error) : resolve(response.data)
			})
		})

	}
	static createPaymentIntent(params) {
		return new Promise((resolve, reject) => {
			AjaxService.postJson('/portal/api/idp/payment', params, (error, response) => {
				return error ? reject(error) : resolve(response.data)
			})
		})
	}
	static getCardsList(params){
		return new Promise((resolve, reject) => {
			AjaxService.getJson('/portal/api/idp/payment-cards', params, (error, response) => {
				return error ? reject(error) : resolve(response.data)
			})
		})
	}

}
