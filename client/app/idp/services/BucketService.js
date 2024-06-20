import TableAPIService from "@/services/TableAPIService";
let endPoint = "/portal/api/table/bucket";
import AjaxService from "@/services/AjaxService";


export default class Bucket {
    static fetchById(recordId) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService()
            restifyService.findById(endPoint, recordId, (error, response) => {
                if (error) {
                    reject(error);
                    return
                }
                resolve(response)
            });
        })
    }
    static save(data) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService();
            console.log(data)
            restifyService.upsert(endPoint, data, (error, response) => {
                return error || response.data.errors ? reject(error) : resolve(response)
            })
        })
    }
    static commit(params){        
        return new Promise((resolve, reject) => {
            AjaxService.postJson("/portal/api/bucket", params, (error, response) => {
                error ? reject(error):resolve(response.data)
            })
        });
    }
    
    static getAllBucket(){
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService()
            restifyService.addQuery({status:"closed"})
            restifyService.find(endPoint, (error, response) => {
                if (error) {
                    reject(error);
                    return
                }
                resolve(response)
            });
        })
    }
    static async exportBucket(bucketList){
        let content = await getBucketRecords(bucketList)
        content = JSON.stringify(content,null,2)
        var a = document.createElement("a");
        var file = new Blob([content], {type: 'text/plain'});
        a.href = URL.createObjectURL(file);
        a.download = "bucket.json";
        a.click();
    }
    static async deployBucket(data){
        let params = {}
        params["data"] = data
        params["action"] = "deploy"
        return new Promise((resolve, reject) => {
            AjaxService.postJson("/portal/api/bucket", params, (error, response) => {
                error ? reject(error):resolve(response.data)
            })
        });
    }
    static processBucketAction(params){      
        return new Promise((resolve, reject) => {
            AjaxService.postJson("/portal/api/bucket", params, (error, response) => {
                error ? reject(error):resolve(response.data)
            })
        });
    }
}

function getBucketRecords(bucketList){
    let params = {}
    params["bucketIds"] = bucketList
    return new Promise((resolve, reject) => {
        AjaxService.getJson("/portal/api/bucket", params, (error, response) => {
            error ? reject(error):resolve(response.data)
        })
    });

}

