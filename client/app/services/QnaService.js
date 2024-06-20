import tableAPIService from "@/services/TableAPIService";
import constants from "@/resources/Constants";
const endPoint = "/portal/api/table/trn_qna_data"
import AjaxService from "@/services/AjaxService";
export default class QnaService {

    constructor() {

	}

	static fetchCount() {
        return new Promise((resolve, reject) => {
            let tableAPI = new tableAPIService();
            tableAPI.addQuery({ active: true });
            tableAPI.countRecord(endPoint, (error, response) => {
                error ? reject(error) : resolve(response.count);

            });

        })
    }
    

    static save(data) {
		return new Promise((resolve, reject) => {
			let restifyService = new tableAPIService()
			restifyService.upsert(endPoint, data, (error, response) => {
				return error || response.data.status == false ? reject(error) : resolve(response)
			})
		})

    }
    
    
    static deleteAll(domain) {
		return new Promise((resolve, reject) => {
			AjaxService.postJson(constants.QNA_API_ENDPOINT, {'domain':domain}, (error, response) => {
				return error || response.data.status == false ? reject(error) : resolve(response)
			})
		})

	}

	static fetchAll(params,selectList){
        return new Promise((resolve,reject)=>{
			let restifyService = new tableAPIService()
			restifyService.addQuery(params)
			restifyService.addSelectColumns(selectList)
            restifyService.find(endPoint, (error, response) => {
                  return  error ? reject(error) :resolve(response)
            })
        })    
    }
}
