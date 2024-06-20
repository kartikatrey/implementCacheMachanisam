import TableAPIService from "@/services/TableAPIService";
import _ from 'lodash';


export default class LogService{
  static getLogs(endpoint, params){
    return new Promise((resolve, reject) => {
      const restifyService = new TableAPIService();
      restifyService.addQuery(params);
      restifyService.find(endpoint, (error, response) => {
        if (error) {
            reject(error);
            return
        }
        resolve(response)  
      });
    });
  }
}