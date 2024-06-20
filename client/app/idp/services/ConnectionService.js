import AjaxService from "@/services/AjaxService";
let endPoint = "/portal/api/test-connection";

export default class ConnectionService {
    /** 
     * function that tests connection using server api
     * 
     * @param {Object} params has recordId and connection type so server can query form data
     * @returns {Promise<Object>} connection status
     */
    static testConnection(params) {
        return new Promise(async (resolve, reject) => {
            AjaxService.getJson(endPoint, params, (error, response) => {
                if (error) {
                    reject(error.error);
                    return;
                }
                resolve(response)
            })
        });
    }
}