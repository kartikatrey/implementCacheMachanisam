import AjaxService from "@/services/AjaxService";
import _ from "lodash";
export default class RequestFormService {

    static sendFormRequest(formId, payload) {
        return new Promise((resolve, reject) => {
            const endPoint = `/portal/api/idp/form/request/${formId}`
            AjaxService.postJson(endPoint, payload, (err, res)=>{
                if(err){
                    console.log("Error while sending the form request", err);
                    reject(err)
                    return;
                }
                resolve(res.data.data);
            })
        });
    }
	
	static validateUrlAndSendOTP (payload) {
		return new Promise((resolve,reject)=>{
            AjaxService.postJson("/auth/request-form", payload, (err,res)=>{
                if(err){
                    console.log("Error in validateRequestFormService:: Validate URL and Send OTP",err)
                    reject(err)
                    return;
                }
                resolve(res.data)
            })
        })
	}
	
	static validateOTP (payload) {
		return new Promise((resolve, reject)=>{
			AjaxService.postJson("/auth/otp", payload, (err, res) => {
				if(err) {
					console.log("Error in validateRequestFormService:: Validate OTP",err)
                    reject(err)
                    return;
				}
                resolve(res.data)
			})
		})
	}

}
