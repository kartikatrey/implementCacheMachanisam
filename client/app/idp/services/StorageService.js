import TableAPIService from "@/services/TableAPIService";
let endPoint = "/portal/api/table/de_storage_configuration";


export default class StorageService {
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
    static save(data){
        return new Promise((resolve,reject)=>{
        let restifyService = new TableAPIService()
        restifyService.upsert(endPoint, data, (error, response) => {
            return error || response.data.errors ?  reject(error) : resolve(response)         
            })
        })
    }

         static getAll(params){
        return new Promise((resolve,reject)=>{
            let restifyService = new TableAPIService()
            restifyService.addQuery(params)
            restifyService.find(endPoint, (error, response) => {
                  return  error ? reject(error) :resolve(response)
            })
        })    
    }
}

