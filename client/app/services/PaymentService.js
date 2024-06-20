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
			AjaxService.putJson('/portal/api/payment-cards', tokenData, (error, response) => {
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
			AjaxService.postJson('/portal/api/payment-cards', tokenData, (error, response) => {
				return error ? reject(error) : resolve(response.data)
			})
		})
	}

	static addDefaultCard(tokenData) {
		return new Promise((resolve, reject) => {
			AjaxService.postJson('/portal/api/default-card', tokenData, (error, response) => {
				return error ? reject(error) : resolve(response)
			})
		})
	}

	static deleteCard(recordId) {
		return new Promise((resolve, reject) => {
			AjaxService.deleteJson("/portal/api/payment-cards" + "/" + recordId, (error, response) => {
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

}
