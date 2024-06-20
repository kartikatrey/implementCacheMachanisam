import TableAPIService from "@/services/TableAPIService";
let endpoint = "/portal/api/table/de_test_case_files";

export default class TestCaseFilesService {
    static fetchAllFiles() {
        return new Promise((resolve, reject) => {
            let tableApiService = new TableAPIService();
            const columnList = ["file_name", "_id", "document_type"];
            tableApiService.addSelectColumns(columnList);
            tableApiService.addQuery({active: true});
            tableApiService.addSortCondition('-created_at');
            tableApiService.find(endpoint, (error, response) => {
                if (error) 
                    reject(error);
                else    
                    resolve(response);
            })
        })
    }
    static getTestCaseFileDataById(id){
        return new Promise((resolve, reject) => {
            let tableApiService = new TableAPIService();
            const columnList = ["_id", "file_name", "mime_type", "file"];
            tableApiService.addSelectColumns(columnList);
            tableApiService.findById(endpoint, id,  (error, response) => {
                if (error) 
                    reject(error);
                else    
                    resolve(response);
            })
        })
    }
}
