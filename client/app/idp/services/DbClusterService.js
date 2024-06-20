import TableAPIService from "@/services/TableAPIService";
import constants from "@/resources/Constants";

export default class DbClusterService {
    static fetchDbClusterById(recordId) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService()
            restifyService.findById(constants.DBCLUSTER_ENDPOINT, recordId, (error, response) => {
                if (error) {
                    reject(error);
                    return
                }
                resolve(response)
            });
        })
    }
    static saveDbCluster(data) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService();
            restifyService.upsert(constants.DBCLUSTER_ENDPOINT, data, (error, response) => {
                return error || response.data.errors ? reject(error) : resolve(response)
            })
        })
    }
}