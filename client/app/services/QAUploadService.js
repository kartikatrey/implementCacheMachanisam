import TableAPIService from "../services/TableAPIService";
let endPoint = `/portal/api/table/customer`

export default class QAUploadService {

    static getCustomer(){
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService()
            restifyService.addSelectColumns(["_id","customer_name"])
            restifyService.addQuery({})
            restifyService.find(endPoint, (error, response) => {
                  return  error ? reject(error) :resolve(response)
            })
		})
    }
}
