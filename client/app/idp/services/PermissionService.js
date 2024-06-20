import TableAPIService from "@/services/TableAPIService";
import constants from "@/resources/Constants";
const endpoint= constants.RESOURCE_PERMISSION_ENDPOINT;

export default class PermissionService{

static fetchById(recordId){
    return new Promise((resolve,reject)=>{
        let restifyService = new TableAPIService();
        
        restifyService.findById(endpoint ,recordId, (error, response) => {
            return error ? reject(error) : resolve(response);
        });
    });
}

static save(data) {
    return new Promise((resolve,reject)=>{
        let restifyService = new TableAPIService();
        restifyService.upsert(endpoint, data, (error, response) => {
            return error  ?  reject(error) :  resolve(response);
        });
    });
    
}
}