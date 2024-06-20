import AjaxService from "@/services/AjaxService";

export default class IdpPolicyService {

    static getPolicy(policyId) {
        return new Promise((resolve, reject) => {
			const endpoint = "/portal/api/idp/policy";
            AjaxService.getJson(endpoint,{_id: policyId}, (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(response.data)
            });
		});
    }

    static getPolicyMeta(params) {
        return new Promise((resolve, reject) => {
            const endpoint = "/portal/api/idp/policy-meta";
            AjaxService.getJson(endpoint, params, (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(response.data)
            })
        });
    }

    static addPolicy(params) {
        return new Promise((resolve, reject) => {
            const endpoint = "/portal/api/idp/policy";
            AjaxService.postJson(endpoint, params, (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(response.data)
            })
        });
    }

    static updatePolicy(params) {
        return new Promise((resolve, reject) => {
            const endpoint = "/portal/api/idp/policy";
            AjaxService.putJson(endpoint, params, (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(response.data)
            })
        });
    }
}