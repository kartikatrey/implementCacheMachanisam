import AjaxService from "../services/AjaxService"
export default class ApprovalService {


    static validateApprovalRequest(params){
        return new Promise((resolve,reject)=>{
            let headers={"authorization":"token "+params.token}
            AjaxService.postJson("/auth/approval/token",params,headers,(err,res)=>{
                if(err){
                    console.log("Error in validateApprovalRequest::",err)
                    reject(err)
                    return;
                }
                resolve(res.data.data)
            })
        })
    }
    static updateApprovalByAction(params){
        return new Promise((resolve,reject)=>{
            let headers={"authorization":"token "+params.token}
            AjaxService.putJson("/api/de-approval", params,headers, (err, res) => {
                if(err){
                    console.log("Error in validateApprovalRequest::",err)
                    reject(err)
                    return;
                }
                
                resolve(res.data.data)
            })
        })
    }
}

