import constants from "@/resources/Constants";
import AjaxService from "@/services/AjaxService";

export default class ReportIssueService{

    constructor() {}

    static save(formData){
        return new Promise((resolve, reject) => {
            AjaxService.postJson(constants.REPORT_ISSUE_ENDPOINT,formData, (error, response) => {
                return error ? reject(error) : resolve(response.data)
            })
        })
    }
}