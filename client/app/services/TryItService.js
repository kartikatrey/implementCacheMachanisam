import AjaxService from "@/services/AjaxService";
import constants from "@/resources/Constants";
import _ from "lodash";

export default class TryItService {
	constructor() {}
	static registerUser(payload) {
		return new Promise((resolve, reject) => {
			AjaxService.postJson(constants.TRY_IT_REGISTER_USER_ENDPOINT, payload, (error, response) => {
                return error ? reject(error) : resolve(response.data)
            })
		});
	}
	static requestDemo(payload) {
		return new Promise((resolve, reject) => {
			AjaxService.postJson(constants.TRY_IT_REQUEST_DEMO_ENDPOINT, payload, (error, response) => {
                return error ? reject(error) : resolve(response.data)
            })
		});
	}
	static resendOTP(payload) {
		return new Promise((resolve, reject) => {
			AjaxService.postJson(constants.TRY_IT_RESEND_OTP_ENDPOINT, payload, (error, response) => {
                return error ? reject(error) : resolve(response.data)
            })
		});
	}
}
