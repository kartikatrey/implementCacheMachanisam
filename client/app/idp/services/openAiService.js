import AjaxService from "@/services/AjaxService";
import _ from "lodash";

export default class OpenAiService {

    static testPrompt(params) {
        return new Promise((resolve, reject) => {
            AjaxService.postJson("/portal/api/extract/email", params, (error, response) => {
                if(error){
                    const err = _.get(error, "response.data.error");
                    reject(err);
                }
                resolve(response);
            });
        });
    }
    
}