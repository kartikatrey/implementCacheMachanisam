import TableAPIService from "../services/TableAPIService";
let endPoint = "/portal/api/table/script";
import constants from "@/resources/Constants";

export default class ScriptService{

    static save(data) {
      return new Promise((resolve,reject)=>{
        let restifyService = new TableAPIService()
        restifyService.upsert(constants.SCRIPT_API_ENDPOINT, data, (error, response) => {
            return error  ?  reject(error) :  resolve(response)
        })
      })
        
    }
  
    static fetchById(recordId){
        return new Promise((resolve,reject)=>{
        let restifyService = new TableAPIService()
        restifyService.findById(constants.SCRIPT_API_ENDPOINT,recordId, (error, response) => {
            if(error){
                reject(error);
                return
            }
            resolve(response)
            });
        })
    }
}