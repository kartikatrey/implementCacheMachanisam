
import AjaxService from "@/services/AjaxService";
import constants from "@/resources/Constants";
import TableAPIService from "@/services/TableAPIService";
import _ from "lodash";

export default class DeCustomerConfigService {
    static getAllDocsCustConfiguration(params) {
        return new Promise((resolve, reject) => {
            if (window.kan_customer_configurations_all) {
                return resolve(window.kan_customer_configurations_all)
            };
            const tableAPI = new TableAPIService();
            tableAPI.addQuery(params)
            tableAPI.find('/portal/api/table/de_customer_configuration', (error, response) => {
                if (error) {
                    reject(error)
                    return;
                } 
                window.kan_customer_configurations_all = response;
                resolve(response);
            });
        });
    }

    static getSystemConfig(params) {
        return new Promise((resolve, reject) => {
            AjaxService.getJson("/portal/api/de-system-configuration", params, (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(response)
            })
        });
    }

    static getDocumentTypeList(docTypeConfigList = []) {
        const docTypes = []
        for(const docTypeConfig of docTypeConfigList){
            let docType = docTypeConfig.document_type;
            docTypes.push({ label: getDocumentLabel(docType), value: docType })
        }
        return docTypes;
    }

    static isExcelProcessEnable(customerConfiguration){
        let excelConfig = customerConfiguration && customerConfiguration.excel_config
        return excelConfig && excelConfig.active || false
    }

    static getCustConfigByDocType(documentType) {
        return new Promise((resolve, reject) => {
            if (window.kan_customer_configuration && window.kan_customer_configuration[documentType]) {
                resolve(window.kan_customer_configuration[documentType]);
                return
            }
            let tableAPI = new TableAPIService();
            tableAPI.addQuery({document_type: documentType});
            tableAPI.findOne("/portal/api/table/de_customer_configuration", (error, response) => {
                if (error) {
                    reject(error)
                } else {
                    if(response.length > 0){
                        let [documentConfig] = response;
                        window.kan_customer_configuration=window.kan_customer_configuration ||{}
                        window.kan_customer_configuration[documentType] = documentConfig
                        resolve(documentConfig)
                        return;
                    }
                    resolve(response);
                }
			});
		}); 
    }

    static getCustomerConfigurationById(id) {
        return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.findById("/portal/api/table/de_customer_configuration", id, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
    }
    
    static getSystemConfigurations(params) {
        return new Promise((resolve, reject) => {
            let tableAPI = new TableAPIService();
            tableAPI.addQuery(params);
            tableAPI.find("/portal/api/configuration", (error, response) => {
				error ? reject(error) : resolve(_.get(response, 'data.data'));
			});
		});
    }

    static getCustomerSystemList(params) {
        return new Promise((resolve, reject) => {
            AjaxService.getJson("/portal/api/de-workflow", params, (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(response)
            })
        });
    }

    static getWorkflowList(params) {
        return new Promise((resolve, reject) => {
            AjaxService.getJson("/portal/api/de-workflow", params, (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(response)
            })
        });
    }

    static save(payload) {
        return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.upsert("/portal/api/table/de_customer_configuration",payload, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
    }

    static getDocumentTypes() {
        let docTypes = [];
        let cust_config = [];
        return new Promise((resolve, reject) => {
            cust_config = window.kan_customer_configurations_all;
            if (cust_config) {
                docTypes = _.compact(_.map(cust_config || [], (config) => {
                    if (config['document_type'] != 'form') {
                        return config['document_type']
                    }
                }))
                return resolve(docTypes);
            };
            const tableAPI = new TableAPIService();
            tableAPI.addQuery()
            tableAPI.find('/portal/api/table/de_customer_configuration', (error, response) => {
                if (error) {
                    reject(error)
                    return;
                } 
                cust_config = response;
                window.kan_customer_configurations_all = response;
                docTypes = _.compact(_.map(cust_config || [], (config) => {
                    if (config['document_type'] != 'form') {
                        return config['document_type']
                    }
                }))
                return resolve(docTypes);
            });
        });
    }

    static getTableTypeConfig(documentType){
        return new Promise((resolve, reject) => {
            let all_cust_config = window.kan_customer_configurations_all;
            if (all_cust_config) {
                const { table_types_config } = all_cust_config.find((cust_config) => cust_config.document_type == documentType);

                return resolve(table_types_config);
            };
            all_cust_config = this.getAllDocsCustConfiguration();
            const { table_types_config } = all_cust_config.find((cust_config) => cust_config.document_type == documentType);

            return resolve(table_types_config);
        });
    }
}

/**
 * It split the input docType by underscores, capitalize the first letter of each word,
 * and then join the words with spaces to form a label
 * @param {*} docType The document type string to convert (e.g., "trade_confirm")
 * @returns Label with capitalized words (e.g., "Trade Confirm")
 */
function getDocumentLabel(docType) {
    if (!docType) {
        return;
    }
    return docType
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
