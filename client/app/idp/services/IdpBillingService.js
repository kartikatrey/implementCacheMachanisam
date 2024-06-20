import constants from "@/resources/Constants";
import AjaxService from "@/services/AjaxService";
import DocumentService from "@/doc-ex/services/DocumentService";
import TableAPIService from "@/services/TableAPIService";
export default class IdpBillingService {


    static getLineItemsInitialData(params) {
        return new Promise((resolve, reject) => {
            const endpoint = "/portal/api/idp/billing/init-lines";
            AjaxService.getJson(endpoint, params, (error, response) => {
                console.log("response ", response);
                return error || response.statusCode != 200 ? reject(error) : resolve(response.data);
            })
        });
    }

    static deleteLine(params) {
        return new Promise((resolve, reject) => {
            const endpoint = "/portal/api/idp/billing/lines";
            AjaxService.deleteJson(endpoint, params, (error, response) => {
                console.log("response lines", response);
                return error || response.status != 200 ? reject(error) : resolve(response.data["line_items"]);
            })
        });
    }

    static getLineItems(params) {
        return new Promise((resolve, reject) => {
            const endpoint = "/portal/api/idp/billing/lines";
            AjaxService.getJson(endpoint, params, (error, response) => {
                console.log("response lines", response);
                return error || response.statusCode != 200 ? reject(error) : resolve(response.data["line_items"]);
            })
        });
    }

    static getInvoice(params) {
        return new Promise((resolve, reject) => {
            const endpoint = "/portal/api/idp/billing/invoice";
            AjaxService.getJson(endpoint, params, (error, response) => {
                console.log("response ", response);
                return error || response.statusCode != 200 ? reject(error) : resolve(response.data);
            })
        });
    }

    static createInvoice(params) {
        return new Promise((resolve, reject) => {
            const endpoint = "/portal/api/idp/billing/invoice";
            AjaxService.postJson(endpoint, params, (error, response) => {
                console.log("response ", response);
                return error || response.status != 200 ? reject(error) : resolve(response.data);
            })
        });
    }

    static updateInvoice(params) {
        return new Promise((resolve, reject) => {
            const endpoint = "/portal/api/idp/billing/invoice";
            AjaxService.putJson(endpoint, params, (error, response) => {
                console.log("response ", response);
                return error || response.status != 200 ? reject(error) : resolve(response.data);
            })
        });
    }

    static downloadInvoice(rec) {
        let params = {
            file_name: "" + rec.invoice_no.replace(/\//g, "_") + ".pdf",
            storage_folder_path: constants.BILLING.INV_STORAGE_DIR
        };
            DocumentService.downloadDocument(params).catch((err)=>{
                
                this.notifyError("Something went wrong while downloading the invoice.");
            });        
    }

    static deleteInvoice(id, params){
        return new Promise((resolve, reject) => {
            let tableAPI = new TableAPIService();
			tableAPI.delete("/portal/api/table/de_invoice", id, params, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
    }
    static sendInvoice(params) {
        return new Promise((resolve, reject) => {
            const endpoint = "/portal/api/idp/billing/invoice";
            AjaxService.postJson(endpoint, params, (error, response) => {
                console.log("response ", response);
                return error || response.status != 200 ? reject(error) : resolve(response.data);
            })
        });
    }
}