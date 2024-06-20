import AjaxService from "@/services/AjaxService";
import constants from "@/resources/Constants";
import TableAPIService from "@/services/TableAPIService";
import PaymentService from "../../payments/services/PaymentSevice";

export default class CustomerService {
	static validateCustomerCode(data){
		return new Promise((resolve, reject) => {
            AjaxService.getJson("/portal/api/vendor/customer-code", data, (error, response) => {
                return error ? reject(error) : resolve(response)
            })
		});
	}

	static getHierarchy(params) {
		return new Promise((resolve, reject) => {
			AjaxService.getJson(constants.CUSTOMER_HIERARCHY, params, (error, response) => {
				return error || response.data.status == false ? reject(error) : resolve(response.data)
			})
		})
	}

	static saveHierarchy(params) {
		return new Promise((resolve, reject) => {
			AjaxService.putJson(constants.CUSTOMER_HIERARCHY, params, (error, response) => {
				console.log("Updation result : ", response);
				return error || response.data.status == false ? reject(error) : resolve(response.data)
			})
		})
	}
	static getLogInCustomer() {
		return new Promise((resolve, reject) => {
			AjaxService.getJson("/portal/api/admin-login-with-customer", {}, (error, response) => {
				return  error ? reject(error) :resolve(response.data)
			});
		});
	}
	static loginWithCustomer(params) {
		return new Promise((resolve, reject) => {
			AjaxService.postJson(
				"/portal/api/admin-login-with-customer", params, (error, response) => {
					return error ? reject(error) : resolve(response.data)
				}
			)
		});
	}
	static createCustomer(params)
	{
		return new Promise((resolve, reject) => {
			AjaxService.postJson("/portal/api/Customer", params, (error, response) => {
					return error ? reject(error) : resolve(response.data)
				}
			)
		});
	}
	static UpdateCustomer(params){
        return new Promise((resolve,reject)=>{
            AjaxService.putJson("/portal/api/Customer",params,(error,response)=>{
				return error ? reject(error) : resolve(response.data)
            })
        })
    }
	static find(filter, params={}) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.addQuery({ active: true, ...(filter || {}) });
			params.sortBy && tableAPI.addSortCondition(params.sortBy);
			params.select && tableAPI.addSelectColumns(params.select);
			tableAPI.find(constants.CUSTOMERS_API_ENDPOINT, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}
	static getConfiguration(params){
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			params.select && tableAPI.addSelectColumns(params.select || []);
			const endpoint = '/portal/api/table/configuration';
			tableAPI.findOne(endpoint, (error, response) => {
				if (error) return reject(error);
                resolve(response);
			});
		});
	}

	static getCustomerConfiguration(params = {}) {
        return new Promise((resolve, reject) => {
			//check if selectedColumns is present in window.kan_cust_config, then resolve
			const selectedColumns = params.selectColumns;
			if (window.kan_cust_config && window.kan_cust_config.length &&window.kan_cust_config[0][selectedColumns]) {
                return resolve(window.kan_cust_config)
            };
			let restifyService = new TableAPIService()
			if (!selectedColumns) return reject('selectColumns parameter required');
			restifyService.addSelectColumns(selectedColumns);
			restifyService.addQuery({type: "general"});
            restifyService.findOne(constants.CUSTOMER_CONFIGURATION, (error, response) => {
				if (error) {
                    reject(error)
                    return;
                }
                window.kan_cust_config = response;
                resolve(response);
            })
        })
    }

	static async saveCustomerConfiguration(data) {
		return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService();
            restifyService.upsert(constants.CUSTOMER_CONFIGURATION, data, (error, response) => {
				if (error || response.data.errors) {
					reject(error);
				} else {
					resolve(response.data);
				}
			});
	    }).then((response) => {
			// Clear the window.kan_cust_config array after successfully saving the configuration,
			// so that new data will be fetched from the database in the getCustomerConfiguration() function.
			window.kan_cust_config = null
			return response;
		});
    }

	static async isCustomerPaymentEnabled() {
		const params = { selectColumns: ['payment_enabled'] };
		let customerConfRecord = await this.getCustomerConfiguration(params)
		const isPaymentEnabled = _.get(customerConfRecord[0], 'payment_enabled', false);
		return isPaymentEnabled;
	}

	static async getBankAccounts(){
		try{
			const response = await PaymentService.call({action: "getBankAccounts"});
			const banks = _.get(response, "data.response", []);
			return banks;
		} catch (error) {
            throw error;
        }
    }
   /*
	* Purpose: This code snippet is responsible for adding configured customer systems to the system list on UI
	* whenever we need to use or configure a third-party customer system in our portal or configuration. It serves
	* the purpose of managing and integrating various customer systems seamlessly.
	*/
	static getCustomerSystemNames() {
        return new Promise((resolve, reject) => {
            let tableAPI = new TableAPIService();
            tableAPI.addQuery({active: true});
			const columnList = ["system_name"];
			tableAPI.addSelectColumns(columnList);
            tableAPI.find("/portal/api/table/customer_system", (error, customerSystems) => {
				if (error) {
					reject(error);
				} else {
					customerSystems.push({ system_name: "INTERNAL" });
					resolve(customerSystems);
				}
        });
    });
    }
}