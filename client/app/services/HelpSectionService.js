import TableAPIService from "@/services/TableAPIService";
import constants from "@/resources/Constants";

export default class HelpSectionService{

    constructor() {}

    static save(formData){
        return new Promise((resolve, reject)=>{
            let tableAPI = new TableAPIService();
            tableAPI.upsert(constants.HELPSECTION_API_ENDPOINT, formData,(error, response)=>{
                (error || (!response || !response.data || !response.data._id)) ? reject(error) : resolve(response.data); 

            }) 
        })
    }

    static fetchAllCustomerSystems(){
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService();
            const columnList = ["_id,","system_name", "customer_id"];
            restifyService.addSelectColumns(columnList);
            restifyService.find(constants.CUSTOMER_SYSTEM_API_ENDPOINT, (error, response) => {
                error ? reject(error) : resolve(response);
            });
        });
    }

    static fetchRecordById(recordId){
        return new Promise ((resolve, reject)=>{
            let tableAPI = new TableAPIService();
            tableAPI.findById(constants.HELPSECTION_API_ENDPOINT, recordId, (error, response) => {
                error ? reject(error) : resolve(response);
            });
        })
    }

}