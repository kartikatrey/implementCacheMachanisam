import AjaxService from "@/services/AjaxService";
const endPoint = "/portal/api/table/de_document";
import TableAPIService from "@/services/TableAPIService";
import _ from 'lodash';
export default class DocumentPackageService {

    static get(params) {
        return new Promise((resolve, reject) => {
            AjaxService.getJson("/portal/api/idp/document/package", params, (error, response) => {
                error ? reject(error):resolve(response.data.data)
            })
        });
    }

    static getPackageForms(id,columns) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService()
            restifyService.addQuery({parent_document_id:id})
            restifyService.addSelectColumns(columns)
            restifyService.find(endPoint, (error, response) => {
                error ? reject(error) : resolve(response);
            });
        })
    }

    static create(params) { 
        return new Promise((resolve, reject) => {
            AjaxService.postJson("/portal/api/idp/document/package", params, (error, response) => {
                error ? reject(error):resolve(response.data.data)
            })
        });
    }

    
	static isValidFormSubtype(customerConfig, formType, documentSubtype){
		const packageList = _.get(customerConfig, 'package_config.form_mapping');
		const _package = _.find(packageList, _package=>_package.name === formType);
        if(!_package){
            return false;
        }
		const forms = _package.forms;
		const isValidFormSubtype = forms.some(form=>form.name === documentSubtype);
		return isValidFormSubtype;
	}
}