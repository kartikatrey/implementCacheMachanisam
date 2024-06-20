import TableAPIService from "../services/TableAPIService";
let endPoint = "/portal/api/table/trn_router_data";
import constants from "@/resources/Constants";

export default class RoutingService{

    static save(data) {
      return new Promise((resolve,reject)=>{
        let restifyService = new TableAPIService()
        restifyService.upsert(endPoint, data, (error, response) => {
            return error  ?  reject(error) :  resolve(response)
        })
      })
        
    }
    static fetchById(recordId){
        return new Promise((resolve,reject)=>{
        let restifyService = new TableAPIService()
        restifyService.findById(endPoint,recordId, (error, response) => {
            if(error){
                reject(error);
                return
            }
            resolve(response)
            });
        })
    }
}