import TableAPIService from "@/services/TableAPIService";
const endpoint="/portal/api/table/de_form";
export default class FormBuilderService {
    //method to save data in de_form table
    static saveFormData(data) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService();
            restifyService.upsert(endpoint, data, (error, response) => {
                return error || response.data.errors ? reject(error) : resolve(response)
            })
        })
    } 
    //method to fetch data from de_form using id and projection
    static getFormDataById(recordId, projection=[]){
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService();
            restifyService.addSelectColumns(projection);
            restifyService.findById(endpoint, recordId, (error, response) => {
                if (error) {
                reject(error);
                } else {
                resolve(response);
                }
            });
        })
    } 
}