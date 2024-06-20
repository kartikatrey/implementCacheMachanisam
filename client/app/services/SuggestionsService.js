import TableAPIService from "@/services/TableAPIService";
import constants from "@/resources/Constants";

export default class SuggestionsService {

    constructor() { }

    static save(formData) {
        return new Promise((resolve, reject) => {
            let tableAPI = new TableAPIService();
            tableAPI.upsert(constants.SUGGESTIONS_API_ENDPOINT, formData, (error, response) => {
                (error || (!response || !response.data || !response.data._id)) ? reject(error) : resolve(response.data);

            })
        })
    }

    static fetchAllCustomer() {
        return new Promise((resolve, reject) => {          
            let restifyService = new TableAPIService();
            const columnList = ["_id,", "customer_name"];
            restifyService.addSelectColumns(columnList);
            restifyService.find(constants.CUSTOMERS_API_ENDPOINT, (error, response) => {
                error ? reject(error) : resolve(response);
            });
        });
    }

    static fetchRecordById(recordId) {
        return new Promise((resolve, reject) => {
            let tableAPI = new TableAPIService();
            tableAPI.findById(constants.SUGGESTIONS_API_ENDPOINT, recordId, (error, response) => {
                error ? reject(error) : resolve(response);
            });
        })
    }

}