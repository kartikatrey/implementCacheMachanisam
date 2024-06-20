import TableAPIService from "../services/TableAPIService";
import AjaxService from "@/services/AjaxService";
let endPoint = `/portal/api/table/trn_ner_data`
export default class NerService{    
    static save(data){
        return new Promise((resolve,reject)=>{
        let restifyService = new TableAPIService()
        restifyService.upsert(endPoint, data, (error, response) => {
            return error || response.data.errors ?  reject(error) : resolve(response)         
            })
        })
    }
    static fetchAll(params){
        return new Promise((resolve,reject)=>{
            let restifyService = new TableAPIService()
            restifyService.addQuery(params)
            restifyService.find(endPoint, (error, response) => {
                  return  error ? reject(error) :resolve(response)
            })
        })    
    }
    static fetchPrediction(params){
        let endPoint = `/portal/api/ner-service`;  
        return new Promise((resolve,reject)=>{
            AjaxService.getJson(endPoint, params, (error, response) => {
                    error ? reject(error) :  resolve(response.data)
                
                });
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
   static exportCsv(params){
    let endPoint =`${endPoint}?exportCsv=true`;  
    return new Promise((resolve,reject)=>{
        AjaxService.getJson(endPoint, params, (error, response) => {
            if(error ){
                reject(error);
                return
            }
            resolve(response)
            });
    })
   }
}


   