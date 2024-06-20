import TableAPIService from "@/services/TableAPIService";
import AjaxService from "@/services/AjaxService";
let endPoint = "/portal/api/table/de_document";
import Constants from "@/resources/Constants";
import _ from "lodash"
import { generateHash } from "@/util/CommonUtil";


export default class DocumentService {
	static getStageWiseCount(params) {
		return new Promise((resolve, reject) => {
			AjaxService.getJson("/portal/api/stage-wise-count", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response.data)
			})
		});
	}

	static getDirectories(params) {
		return new Promise((resolve, reject) => {
			AjaxService.getJson("/portal/api/storage-directories", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			})
		});
	}

	static getPrediction(params) {
		return new Promise((resolve, reject) => {
			AjaxService.getJson("/portal/api/doc-prediction-data", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			})
		});
	}

	static renameFolder(params) {
		return new Promise((resolve, reject) => {
			AjaxService.putJson("/portal/api/storage-directories", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			})
		});
	}

	static deleteEmptyFolder(params) {
		return new Promise((resolve, reject) => {
			AjaxService.deleteJson("/portal/api/storage-directories", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			})
		});
	}
	static deleteDocument(params) {
		return new Promise((resolve, reject) => {
			AjaxService.deleteJson("/portal/api/storage-files", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			})
		});
	}
	static removeDocument(params) {
		return new Promise((resolve, reject) => {
			AjaxService.putJson("/portal/api/document", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response.data);
			});
		});
	}
	static downloadDocument(params) {
		return new Promise((resolve, reject) => {
			AjaxService.getFile("/portal/api/storage-files", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			})
		});
	}
	static getFileUrl(params) {
		return new Promise((resolve, reject) => {
			AjaxService.getJson("/portal/api/idp-file-url", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response.data)
			})
		});
	}
	static createFolder(params) {
		return new Promise((resolve, reject) => {
			AjaxService.postJson("/portal/api/storage-directories", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			})
		});
	}

	static retry(params) {
		return new Promise((resolve, reject) => {
			AjaxService.postJson("/portal/api/retry-extraction", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			})
		});
	}

	static documentBulkDelete(params){

			return new Promise((resolve, reject) => {
				AjaxService.putJson("/portal/api/bulk-document", params, (error, response) => {
					if (!_.get(response, 'data.data.status')) {
						reject(error);
						return;
					}
					resolve(response)
				})
			});

	}

	static login(params) {
		return new Promise((resolve, reject) => {
			AjaxService.postJson("/portal/api/system-login", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			})
		});
	}

	static processAction(params) {
		return new Promise((resolve, reject) => {
			AjaxService.putJson("/portal/api/document", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response.data);
			});
		});
	}
	static savePrediction(params) {
		return new Promise((resolve, reject) => {
			let tableApiService = new TableAPIService();
			AjaxService.putJson("/portal/api/document", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response.data);
			});
		});
	}

	static update(payload) {
		return new Promise((resolve, reject) => {
			let tableApiService = new TableAPIService();
			tableApiService.upsert("/portal/api/table/de_document", payload, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		})
	}

	/**
 * Retrieves the latest documents using an Ajax request to the specified API endpoint.
 *
 * @param {*} params - Additional parameters for the request.
 * @returns {Promise} A Promise that resolves with the response data or rejects with an error.
 */
static getRecentDocuments(params) {
	return new Promise((resolve, reject) => {
			// Make an Ajax request to the "/portal/api/document" endpoint with the provided parameters
			AjaxService.getJson("/portal/api/document", params, (error, response) => {
					// If there is an error, reject the Promise with the error
					// Otherwise, resolve the Promise with the response (or an empty object if response is falsy)
					error ? reject(error) : resolve(response || {});
			});
	});
}



	static getDocument(params, selectColumn=null) {
		return new Promise((resolve, reject) => {
			let tableApiService = new TableAPIService();
			tableApiService.addQuery(params);
			if(selectColumn){
				tableApiService.addSelectColumns(selectColumn)
			}
			tableApiService.find("/portal/api/table/de_document", (error, response) => {
				// error ? reject(error) : resolve(response);
				error ? reject(error) : resolve(_.isArray(response) && response[0] || {})
			});
		});
	}

	/**
	 * Fetches the document data by document ID.
	 * @param {string} docId - The document ID.
	 * @param {string|null} selectColumn - Optional. The column to select from the document data.
	 * @returns {Promise<Object>} - The document data.
	 */
	static async getDocumentDataByDocId(docId, selectColumn=null) {
		const filter = { document_id: docId };
		const [documentData] = await this.fetchDocumentData(filter, selectColumn);
		return documentData;
	}

	static fetchDocumentData(param, selectColumn=null) {
		return new Promise((resolve, reject) => {
			let tableApiService = new TableAPIService();
			if(selectColumn){
				tableApiService.addSelectColumns(selectColumn)
			}
			tableApiService.addQuery(param)
			tableApiService.find("/portal/api/table/de_document_data", (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}

	static publish(params) {
		return new Promise((resolve, reject) => {
			AjaxService.postJson("/portal/api/docex/publish", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response);
			})
		});
	}

	static callWorkflow(params) {
		return new Promise((resolve, reject) => {
			AjaxService.postJson("/portal/api/de-workflow", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			})
		});
	}

	static deleteDocumentRecord(id) {
		let tableAPI = new TableAPIService();
		return new Promise((resolve, reject) => {
			tableAPI.delete(endPoint, id, null, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			});
		})
   	}

	   static find(queryParam, sortField, selectList=[], skip, limit) {
		let tableAPI = new TableAPIService();
		tableAPI.addQuery(queryParam)
		limit ? tableAPI.addLimit(limit) : '';
		skip ? tableAPI.addSkip(skip) : '';
		sortField ? tableAPI.addSortCondition(sortField) : '';
		tableAPI.addSelectColumns(selectList)
		return new Promise((resolve, reject) => {
		tableAPI.find(endPoint, (error, response) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(response)
		});
	  })
	}

	static getEmailInfo(queryParam, sortField, selectList=[]) {
		let tableAPI = new TableAPIService();
		tableAPI.addQuery(queryParam)
		sortField ? tableAPI.addSortCondition(sortField) : ''
		tableAPI.addSelectColumns(selectList)
		return new Promise((resolve, reject) => {
		tableAPI.findOne("/portal/api/table/de_processed_email", (error, response) => {
			if (error) {
				reject(error);
				return;
			}
			let responseData = _.isArray(response) && response[0] || {};
			resolve(responseData)
		});
	  })
	}

	static getDocIdsByEmailId(emailId, documentType) {
		let tableAPI = new TableAPIService();
		const filter = {
			"document_type" : documentType,
			"created_by": "EMAIL",
			"email.id" : emailId
		}
		tableAPI.addQuery(filter);
		tableAPI.addSelectColumns([ "_id" ]);

		return new Promise((resolve, reject) => {
			tableAPI.find("/portal/api/table/de_document", (error, response) => {
				if(error) {
					reject(error);
					return;
				}
				resolve(response.map(doc => doc._id));
			})
		})
	}

	static updateDocument(params) {
		return new Promise((resolve, reject) => {
			AjaxService.putJson("/portal/api/document-publish", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			})
		});
	}

 	static getExtractedDocument(queryParam,projection=[]) {
		let tableAPI = new TableAPIService();
		tableAPI.addQuery(queryParam)
		tableAPI.addSelectColumns(projection)
		return new Promise((resolve, reject) => {
			tableAPI.find('/portal/api/table/de_document', (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			});
		})
	}

	static getDocumentById(id, projection=[]) {
		const queryParam = { _id : id }
		let tableAPI = new TableAPIService();
		tableAPI.addQuery(queryParam)
		tableAPI.addSelectColumns(projection)
		return new Promise((resolve, reject) => {
			tableAPI.findOne('/portal/api/table/de_document', (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response[0])
			});
		})
	}

    /**
     * Here we are exporting data in csv and json format using configured script in script table with type as export
     */
    static exportData(params) {
        const { export_type: exportType ,
			document_ids: documentIds,
			document_type: docType,
			document_subtype: docSubtype,
			sheet_index: sheetIndex,
			file_name: fileName,
			file_type: fileType,
			is_excel_form: isExcelForm,
			email_id : emailId
		} = params;

        let urlParams = `export_type=${exportType}&document_ids=${documentIds}&document_type=${docType}&file_name=${fileName}&file_type=${fileType}&is_excel_form=${isExcelForm}&email_id=${emailId}`;
        // If sheet index is found, add it to url params as we are deciding whether file is type of excel or pdf
		sheetIndex && (urlParams = `${urlParams}&sheet_index=${sheetIndex}`);
		docSubtype && (urlParams = `${urlParams}&document_subtype=${docSubtype}`);
        const endPoint = `${window.location.origin}/portal/api/document-publish?${urlParams}`;
        window.open(endPoint, '_self');
    }

	static findDebugData(queryParam,selectList) {
		let tableAPI = new TableAPIService();
		tableAPI.addQuery(queryParam)
		if(selectList && selectList.length){
			tableAPI.addSelectColumns(selectList)
		}
		return new Promise((resolve, reject) => {
			tableAPI.find(Constants.DE_DOCUMENT_DEBUG_DATA_ENDPOINT, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			});
		})
	}



	static saveDebugData(payload) {
		return new Promise((resolve, reject) => {
			let tableApiService = new TableAPIService();
			tableApiService.upsert(Constants.DE_DOCUMENT_DEBUG_DATA_ENDPOINT, payload, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}


	static async sendApproval(documentId,parentDocumentId,emails){
		let params = {
			'workflow_id': Constants.DOCEX.APPROVAL_WORKFLOW_ID,
			'id': documentId,
			'approval_workflow' : true,
			'parent_document_id': parentDocumentId
		}

		params["approver_list"] = emails
		params["doc_link"] = `<a href ="${process.env.CUSTOMER_PORTAL_ADDRESS}/document/invoice?id=${documentId}">Click here</a>`
		return new Promise((resolve, reject) => {
			AjaxService.postJson("/portal/api/document-approval-request", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			})
		});
	}

	static getApproverEmailList(params){
		return new Promise((resolve, reject) => {
			AjaxService.getJson("/portal/api/idp/email-recipients", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response.data)
			})
		})
	}
	static move(params) {
		return new Promise((resolve, reject) => {
			AjaxService.postJson("/portal/api/move-file", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			})
		});
	}

	static getDocumentAttachments(params, selectList = []) {
		let tableAPI = new TableAPIService();
		tableAPI.addQuery(params)
		selectList.length && tableAPI.addSelectColumns(selectList)
		tableAPI.addSortCondition('created_on')
		return new Promise((resolve, reject) => {
			tableAPI.find('/portal/api/table/de_document_attachments', (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			});
		})
	}
	static removeDocumentAttachments(id, params){
		let tableAPI = new TableAPIService();
		return new Promise((resolve, reject) => {
			tableAPI.delete('/portal/api/table/de_document_attachments',id,params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			});
		})
	}
	static getActivityLogs(params) {
		let tableAPI = new TableAPIService();
		// params['document_id']=ObjectId(params['_id'])
		tableAPI.addQuery(params)
		tableAPI.addSortCondition("date_time")
		return new Promise((resolve, reject) => {

			tableAPI.find('/portal/api/table/de_activity', (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			});
		});
	}
	// payload = {columns,searchText}
	static getTableColumnFilters(payload) {
		let conditions = [];
		// Escape the all prenthesis
		payload.searchText = payload.searchText.replace(new RegExp('\\(', 'g'), '\\(');
		payload.searchText = payload.searchText.replace(new RegExp('\\)', 'g'), '\\)');
		let columns = payload.columns; // to add all the dynamic columns in filter condition
		// let columns = _.unionBy(payload.columns, Constants.DOCEX.DE_DOCUMENT_FIELDS, 'name');
		for (let i = 0; i < columns.length; i++) {
		  if (_.get(columns[i], "filterOptions.enable") == true || _.get(columns[i], "globalSearchOptions.enable") == true  ) {
			let condition = {};
			let col_val = "(" + payload.searchText + ")";
			condition[columns[i].name] = {
			  $regex: col_val,
			  $options: "i",
			};
			conditions.push(condition);
		  }
		}
		return { $or: conditions };
	}

	static getURLFilter() {
		try {
			const urlParams = new URLSearchParams(window.location.search);
			const filterString = urlParams.get("filter");
			this.filter = JSON.parse(filterString || "{}");
		} catch (err) {
			this.filter = {};
		}
		return this.filter;
	}

	static getSupportedDocumentTypes() {
		return new Promise((resolve, reject) => {
			let tableApiService = new TableAPIService();
			tableApiService.find("/portal/api/table/de_customer_configuration", (error, response) => {
				error ? reject(error) : resolve(response);
			});
		})
	}

	static storeFolderStructure(payload) {
		return new Promise((resolve, reject) => {
			let tableApiService = new TableAPIService();
			tableApiService.upsert("/portal/api/table/de_folder", payload, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		})
	}


	static getFolderStructure(params) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.addQuery(params)
			tableAPI.find('/portal/api/table/de_folder', (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			});
		});
	}

	static rejectDocument(payload){
		return new Promise((resolve, reject) => {
			AjaxService.postJson("/portal/api/idp-reject-document", payload, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response.data.data)
			})
		});
	}

	static findByIdAndUpdate(updatePayload){
		return new Promise((resolve, reject) => {
			let tableApiService = new TableAPIService();
			tableApiService.upsert("/portal/api/table/de_document",updatePayload, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		})

	}

	static async callApprovalWorkflow(documentId,comment){
		let params = {
			'document_id': documentId,
			'comment':comment
		}
		return new Promise((resolve, reject) => {
			AjaxService.postJson("/portal/api/approval-workflow", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response.data)
			})
		});
	}

	static getTableConfig(queryParams){
		return new Promise((resolve, reject) => {
			let generatedKey = generateHash(queryParams);
			//if window object contains hash for cobinations of queryParams then retrieve data from window object instead of API call
			if(window[generatedKey]){
				return resolve(window[generatedKey])
			}
			AjaxService.getJson("/portal/api/tableConfig",queryParams,(error, response) => {
				if (error) {
					reject(error);
					return;
				}
				let tableConfigResponse=response.data
				//store result in window object for generted hash for cobinations of queryParams
				window[generatedKey]=tableConfigResponse
				resolve(tableConfigResponse);
			  }
			);
		});
	}

	static getEmailAttachments(queryParams){
		return new Promise((resolve,reject)=>{
			AjaxService.getJson("/portal/api/upload-attachment",queryParams,(error,response)=>{
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			})
		});
	}
	/**
	 * Creates a unique CID (Component ID) for a field based on its properties.
	 *
	 * @param {Object} field - The field object.
	 * @param {boolean} isDialogField - Indicates if it's a dialog field.
	 * @param {string} tableName - The name of the table, if applicable.
	 * @returns {string} The generated CID.
	 */
	static createFieldCid(field, tableName, isDialogField) {
		const fieldName = _.get(field, 'field_config.name');
		let cid = isDialogField ? `dialog__${fieldName}` : fieldName;
		if (tableName) {
		  cid = isDialogField ? `dialog__${tableName}__${fieldName}` : `${tableName}__${fieldName}`;
		}
		return cid;
	}

	/*
	 * Create an event name for input value changes, especially for tables with multiple instances.
	 *
	 * @param {Object} params - An object containing parameters for creating the event name.
	 * @param {boolean} params.isTable - Indicates if the event is for a table.
	 * @param {string} params.tableName - The name of the table (if applicable).
	 * @param {string} params.fieldName - The name of the field or input.
	 *
	 * @returns {string} - Event name for input value changes, customized for tables if needed.
	 *
	 * This function generates a unique event name to handle input value changes. For tables, it includes the table name
	 * in the event name to differentiate events from multiple table instances. The generated event name is added to the
	 * 'documentInputComponents' array for reference.
	 */
	static createValueChangeEventName(params) {
		let inputValueChangedEvent = "InputValueChanged__";
		if (params.is_table) {
			inputValueChangedEvent += params.table_name + "__";
		}
		inputValueChangedEvent += params.name;
		window.documentInputComponents.push(inputValueChangedEvent);
		return inputValueChangedEvent;
	}

	/**
	 * Purpose: To perform bulk document assignment or updates, we introduced a new service called 'bulkDocumentService.'
	 * This service enables us to assign or update documents in bulk because the RESTify API does not provide a direct
	 * method for bulk updates using the table API service.
	 */
	static updateRecords(params) {
		return new Promise((resolve, reject) => {
			AjaxService.putJson("/portal/api/bulk-document", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response.data)
			})
		});
	}

	/**
	 * Purpose: Get page number from the row.
	 * @param {Object} row - The row containing information about columns in line items.
	 *
	 * Steps:
	 * 1. Loop through the columns of the row until a page number is found.
	 * 2. If a page number is found in any column, return that page number.
	 */
	static getPageNumberFromRow(row) {
		const columns = Object.keys(row);

		for (const column of columns) {
			if (row[column] && row[column].page_number) {
				return row[column].page_number;
			}
		}
	}

	/**
	 * Purpose: Extract header data from document prediction data.
	 *
	 * @param {Object} predictionData - The row containing information about columns in line items.
	 *
	 * Steps:
	 * 1. Filter out elements not related to tables.
	 * 2. Return the final prepared header prediction data.
	 */
	static getHeaderPredictionData(predictionData){
		if(!predictionData){
			return;
		}
		// Filter out elements with the name "table"
		predictionData = predictionData.filter((data) => data.name !== "table");
		return predictionData;
	}

 	/**
	 * Purpose: Function to fetch unique business units to display in dropdown for Touched vs Non touched Widget.
	 * @param {object} params - contains {action: "get_unique_bu"} for API call to server to fetch business units.
	 */
	static getBusinessUnit(params) {
		return new Promise((resolve, reject) => {
			AjaxService.getJson("/portal/api/document", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response.data);
			});
		});
	}
}
