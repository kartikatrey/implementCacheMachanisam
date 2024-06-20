import AjaxService from "@/services/AjaxService";

export default class ActivityService {
	static getActivities(params) {
		return new Promise((resolve, reject) => {
			AjaxService.getJson("/portal/api/idp/activity", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response.data)
			})
		});
	}
}