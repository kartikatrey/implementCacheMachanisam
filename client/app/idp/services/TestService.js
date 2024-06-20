import AjaxService from "@/services/AjaxService";
import TableAPIService from "@/services/TableAPIService";
import constants from "@/resources/Constants";
import _ from 'lodash';
let endpoint = '/portal/api/test';

export default class TestService{
  static test(params){
    return new Promise(async (resolve, reject) => {
        AjaxService.getJson(endpoint, params, (error, response) => {
            if (error) {
                reject(error.error);
                return;
            }
            resolve(response)
        })
    });
  }

  // function to get latest test entry from the test_history collection for the given br_id;
  static getRecentTestEntry(params){
    return new Promise((resolve, reject) => {
      const restifyService = new TableAPIService();
      restifyService.addQuery(params);
      restifyService.addSortCondition({_id: -1});
      restifyService.addLimit(1);
      restifyService.find(constants.TEST_HISTORY_ENDPOINT, (error, response) => {
        if (error) {
            reject(error);
            return
        }
        resolve(response)  
      });
    });
  }

  // function to add entry to the test_history collection.
  static save(params) {
		return new Promise((resolve, reject) => {
      const restifyService = new TableAPIService();
      restifyService.upsert(constants.TEST_HISTORY_ENDPOINT, params, (error, response) => {
        if (error) {
            reject(error);
            return
        }
        resolve(response)
      });
		});
	}

  // function to get logs from script_log.
  static getScriptLogs(params){
    return new Promise(async (resolve, reject) => {
      let restifyService = new TableAPIService();
      restifyService.addQuery(params);
      restifyService.addSortCondition('created_at');
      restifyService.find(constants.SCRIPT_LOG_ENDPOINT, (error, response) => {
        if (error) {
            reject(error.error);
            return;
        }
        resolve(response)
      })
    });
  }
}