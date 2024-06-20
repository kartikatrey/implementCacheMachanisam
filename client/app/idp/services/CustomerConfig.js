import TableAPIService from "@/services/TableAPIService";
const endPoint = "/portal/api/table/customer_configuration";

export default class CustomerConfiguration {
    static save(data){
        return new Promise((resolve,reject)=>{
        let restifyService = new TableAPIService()
        restifyService.upsert(endPoint, data, (error, response) => {
            return error || response.data.errors ?  reject(error) : resolve(response)         
            })
        })
    }

    static getCustomerConfig(){
        return new Promise((resolve, reject) => {
            const tableAPI = new TableAPIService();
            tableAPI.find('/portal/api/table/customer_configuration', (error, response) => {
                if (error) {
                    reject(error)
                    return;
                } 
                resolve(response);
            });
        });
    } 
}