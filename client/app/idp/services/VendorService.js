import constants from "@/resources/Constants";
import TableAPIService from "@/services/TableAPIService";
import AjaxService from "@/services/AjaxService";
import PaymentService from "../../payments/services/PaymentSevice";
import _ from "lodash";

export default class VendorService {
    static saveVendorDetails(vendorData) {
        return new Promise((resolve, reject) => {
            let tableAPI = new TableAPIService();
            tableAPI.upsert(constants.AP_VENDORS_ENDPOINT, vendorData, (error, response) => {
                if (error || (!response || !response.data || !response.data._id)) {
                    let errorMessage = ''
                    //error code 11000 is returned when the duplicate record is being created, based on the database index 
                    if (_.get(response, "data.code") == 11000)
                        errorMessage = "It seems vendor is already registered with us";
                    else
                        errorMessage = error && error.toString() || _.get(response, "data.message", "Error while saving vendor data");
                    return reject(errorMessage);
                }
                resolve(response.data);
            })
        })
    }
    static saveVendorSiteDetails(vendorSiteData) {
        return new Promise((resolve, reject) => {
            let tableAPI = new TableAPIService();
            tableAPI.upsert(constants.AP_VENDOR_SITES_ENDPOINT, vendorSiteData, (error, response) => {
                if (error || (!response || !response.data || !response.data._id)) {
                    let errorMessage = ''
                    ////error code 11000 is returned when the duplicate record is being created, based on the database index 
                    if (_.get(response, "data.code") == 11000)
                        errorMessage = "It seems vendor site is already registered with us";
                    else
                        errorMessage = error && error.toString() || _.get(response, "data.message", "Error while saving vendor site data");
                    return reject(errorMessage);
                }
                resolve(response.data);
            })
        })
    }
    static fetchVendorDetailsById(id, projection) {
        return new Promise((resolve, reject) => {
            let tableAPI = new TableAPIService();
            tableAPI.addSelectColumns(projection);
            tableAPI.findById(constants.AP_VENDORS_ENDPOINT, id, (error, response) => {
                error ? reject(error) : resolve(response);
            });
        });
    }
    static fetchVendorSiteDetailsById(id, projection) {
        return new Promise((resolve, reject) => {
            let tableAPI = new TableAPIService();
            tableAPI.addSelectColumns(projection);
            tableAPI.findById(constants.AP_VENDOR_SITES_ENDPOINT, id, (error, response) => {
                error ? reject(error) : resolve(response);
            });
        });
    }
    static fetchVendorSiteDetails(filter, projection = []) {
        return new Promise((resolve, reject) => {
            let tableAPI = new TableAPIService();
            tableAPI.addQuery(filter);
            tableAPI.addSelectColumns(projection);
            tableAPI.find(constants.AP_VENDOR_SITES_ENDPOINT, (error, response) => {
                error ? reject(error) : resolve(response[0]);
            });
        });
    }
    static fetchVendorSitesByVendorName(payload) {
        return new Promise((resolve, reject) => {
            AjaxService.getJson("/portal/api/payments/sites", payload, (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(response.data)
            })
        });
    }
    static fetchVendorSitesByVendorId(filter, columns = []) {
        return new Promise((resolve, reject) => {
            let tableAPI = new TableAPIService();
            tableAPI.addQuery(filter);
            tableAPI.addSelectColumns(columns);
            tableAPI.find(constants.AP_VENDOR_SITES_ENDPOINT, (error, response) => {
                error ? reject(error) : resolve(response);
            });
        });
    }
    static isVendorPaymentUserCreated(vendorSiteRecord) {
        let isPaymentUserCreated = false;
        if (vendorSiteRecord.payment_enabled &&
            vendorSiteRecord.payment_config &&
            vendorSiteRecord.payment_config.user &&
            vendorSiteRecord.payment_config.user.user_id) {
            isPaymentUserCreated = true;
        }
        return isPaymentUserCreated;
    }

    static async getReceiverUser(vendorId, vendorSiteId) {
        try {
            const response = await PaymentService.call({
                action: "getReceiverUser",
                data: {
                    vendor_id: vendorId,
                    vendor_site_id: vendorSiteId
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    static async createReceiverUser(vendorId, vendorSiteId, siteName, paymentUserData) {
        try {
            await PaymentService.call({
                action: "createReceiverUser",
                data: {
                    ...paymentUserData,
                    vendor_id: vendorId,
                    vendor_site_id: vendorSiteId,
                    site_name: siteName
                }
            });
        } catch (error) {
            throw error;
        }
    }

    static async updateReceiverUser(vendorId, vendorSiteId, paymentUserData) {
        try {
            await PaymentService.call({
                action: "updateReceiverUser",
                data: {
                    ...paymentUserData,
                    vendor_id: vendorId,
                    vendor_site_id: vendorSiteId
                }
            });
        } catch (error) {
            throw error;
        }
    }

    static async getBankAccounts(vendorId, vendorSiteId){
		try{
			const response = await PaymentService.call({ 
				action: "getBankAccounts", 
				data: JSON.stringify({ 
					vendor_id: vendorId, vendor_site_id: vendorSiteId
				}) 
			}) 
			const banks = _.get(response, "data.response", []);
			return banks;
		} catch (error) {
            throw error;
        }
    }

    static createImportedVendors(params){
    	return new Promise((resolve, reject) => {
           AjaxService.postJson("/portal/api/idp/vendors", params, (error, response) => {
				error ? reject(error):resolve(response.data);
			});
		});
	}
}