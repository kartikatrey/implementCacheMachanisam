import TableAPIService from "@/services/TableAPIService";
import constants from "@/resources/Constants";

export default class TrainRequestService {
	static save(formData) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.upsert(constants.TRN_REQUEST_ENDPOINT, formData , (error, response) => {
				(error || (!response || !response.data || !response.data._id)) ? reject(error) : resolve(response.data);
				console.log('Save Error********************************************' ,error);
			});
		});
	}
}