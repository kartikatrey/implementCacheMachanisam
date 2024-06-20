import AjaxService from "@/services/AjaxService";
import _ from "lodash";
export default class ApprovalService {
    static getApprovalRequest(params){
        return new Promise((resolve,reject)=>{
            AjaxService.getJson("/api/document-approval-request",params,(err,res)=>{
                if(err){
                    console.log("Error in getApprovalRequest::",err)
                    reject(err)
                }
                resolve(res)
            })
        })
    }

    static processApproval(params){
        return new Promise((resolve,reject)=>{
            AjaxService.putJson("/api/de-approval",params,(err,res)=>{
                if(err){
                    console.log("Error in approvalRequest::",err)
                    reject(err)
                }
                resolve(res)
            })
        })
    }
}