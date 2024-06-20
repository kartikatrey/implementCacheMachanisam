import TableAPIService from "@/services/TableAPIService";
import AjaxService from "@/services/AjaxService";
let endPoint = "/portal/api/table/de_document";
import Constants from "@/resources/Constants";
import _ from "lodash"



export default class DocumentService {
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
	static async downloadBulkDocuments(params) {
		const docIds = JSON.stringify(params.document_ids);
		const enCodeddocIds = encodeURIComponent(docIds);
		const filter = JSON.stringify(params.filter || {});
		// If the number of document IDs exceeds the configured limit or no document IDs are selected,
		// initiate the ZIP creation process in the background and immediately return the response.
		if (params.document_ids.length >= Constants.DOCEX.DOCUMENT_DOWNLOAD_LIMIT || !params.document_ids.length) {
            // Start the bulk download in the background
			params["query"] = filter;
			params["document_ids"] = docIds;
			params["action"] = "bulk_email_download";
			return new Promise((resolve, reject) => {
				AjaxService.getJson("/portal/api/document/bulk-email-download", params, (error, response) => {
					if (error) {
						reject(error);
						return;
					}
					resolve(response.data)
				})
			});
        } else {
			const downloadURL = `${window.location.origin}/portal/api/document/download?requester=${params.requester}&action=${params.action}&document_ids=${enCodeddocIds}&query=${filter}`;
			window.open(downloadURL, "_self");
		}
	}
	static getFileUrl(params) {
		return new Promise((resolve, reject) => {
			AjaxService.getJson("/portal/api/docex-file-url", params, (error, response) => {
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
				AjaxService.putJson("/portal/api/delete-document", params, (error, response) => {
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

	static fetchById(documentId) {
		return new Promise((resolve, reject) => {
			let tableApiService = new TableAPIService();
			tableApiService.findById("/portal/api/table/de_document", documentId, (error, response) => {
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

	static find(queryParam, sortField) {
		let tableAPI = new TableAPIService();
		tableAPI.addQuery(queryParam)
		sortField ? tableAPI.addSortCondition(sortField) : ''
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

	static fetchDocumentData(param,skip,limit,sort_column) {
		return new Promise((resolve, reject) => {
			let tableApiService = new TableAPIService();
			tableApiService.addQuery(param)
			tableApiService.addSkip(skip);
			tableApiService.addLimit(limit);
			tableApiService.addSortCondition(sort_column)

			tableApiService.find("/portal/api/table/de_document", (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}
	static fetchCount(queryParams,tableName) {
		return new Promise((resolve, reject) => {
			let tableApiService = new TableAPIService();
			tableApiService.addQuery(queryParams);
			tableApiService.countRecord(`/portal/api/table/${tableName}`, (error, response) => {
				error ? reject(error) : resolve(response.count);

			});
		});
	}

   static exportData(exportType, documentId){
	const endPoint = `${window.location.origin}/portal/api/document-publish?exportType=${exportType}&id=${documentId}`;
	window.open(endPoint, '_self');
   }

	static findDebugData(queryParam) {
		let tableAPI = new TableAPIService();
		tableAPI.addQuery(queryParam)
		return new Promise((resolve, reject) => {
			tableAPI.find('/portal/api/table/de_document_debug_data', (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			});
		})
	}

	static async sendApproval(documentId,emails){
		let params = {
			'workflow_id': Constants.DOCEX.APPROVAL_WORKFLOW_ID,
			'id': documentId,
			'approval_workflow' : true
		}

		params["approver_list"] = emails
		params["doc_link"] = `<a href ="${process.env.CUSTOMER_PORTAL_ADDRESS}/document/invoice}?id=${documentId}">Click here</a>`
		params["summary_data"] = summary;
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

	static getApproverEmailList(document_type){
		return new Promise((resolve, reject) => {
			let tableApiService = new TableAPIService();
			tableApiService.addQuery({document_type})
			tableApiService.addSelectColumns(["email_notifications"])
			tableApiService.find("/portal/api/table/de_customer_configuration", (error, response) => {
				error ? reject(error) : resolve(response[0]["email_notifications"] && response[0]["email_notifications"]["approver"] || "");
			});
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



	static getDocumentAttachments(params) {
		let tableAPI = new TableAPIService();
		tableAPI.addQuery(params)
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

}
