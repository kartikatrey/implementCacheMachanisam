import constants from "@/resources/Constants";
import AjaxService from "@/services/AjaxService";
export default class IdpChartService {


	static getChartData(params) {
		return new Promise((resolve, reject) => {
			AjaxService.getJson(constants.IDP_CHART_DATA_ENDPOINT, params, (error, response) => {

				return error || response.data.status == false ? reject(error) : resolve(response.data.result)
			})
		})


	}

	static getAnalyticsChartData(params) {
		return new Promise((resolve, reject) => {
			AjaxService.getJson(constants.ERROR_ANALYTICS_CHART_DATA_ENDPOINT, params, (error, response) => {
				return error || response.data.status == false ? reject(error) : resolve(response.data.result)
			})
		})
	}

    static getFraudAnalyticsChartData(params) {
		return new Promise((resolve, reject) => {
			// constants.FRAUD_ANALYTICS_CHART_DATA_ENDPOINT = 
			AjaxService.getJson("/portal/api/idp/dashboard/fraud-analytics", params, (error, response) => {
				return error || response.data.status == false ? reject(error) : resolve(response.data.result)
			})
		})
	}

}
