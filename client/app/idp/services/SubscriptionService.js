import Constants from "@/resources/Constants";
import TableAPIService from "@/services/TableAPIService";
import _ from "lodash";

export default class SubscriptionService {
    static fetchById(recordId, projection) {
        return new Promise((resolve, reject) => {
            let tableAPI = new TableAPIService();
            tableAPI.addSelectColumns(projection);
            tableAPI.findById(Constants.SUBSCRIPTIONS_ENDPOINT, recordId, (error, response) => {
                if (error) {
                    reject(error);
                    return
                }
                resolve(response)
            });
        })
    }
    static saveSubscriptionDetails(subscriptionData) {
        return new Promise((resolve, reject) => {
            let tableAPI = new TableAPIService();
            tableAPI.upsert(Constants.SUBSCRIPTIONS_ENDPOINT, subscriptionData, (error, response) => {
                if (error || (!response || !response.data || !response.data._id)) {
                    let errorMessage = ''
                    //error code 11000 is returned when the duplicate record is being created, based on the database index 
                    if (_.get(response, "data.code") == 11000)
                        errorMessage = "It seems subscription record is already present";
                    else
                        errorMessage = error && error.toString() || _.get(response, "data.message", "Error while saving subscription record");
                    return reject(errorMessage);
                }
                resolve(response.data);
            })
        })
    }
    static find(filter, params={}) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.addQuery({ active: true, ...(filter || {}) });
			params.sortBy && tableAPI.addSortCondition(params.sortBy);
			params.select && tableAPI.addSelectColumns(params.select);
			tableAPI.find(Constants.SUBSCRIPTIONS_ENDPOINT, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}	
}