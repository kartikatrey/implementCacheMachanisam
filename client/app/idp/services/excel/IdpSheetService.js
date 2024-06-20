import _ from "lodash";
import AjaxService from "@/services/AjaxService";
import CustomerConfig from "@/idp/services/DeCustomerConfig";
export default class IdpSheetService {
	static getExcelValidationMsgs(params) {
		return new Promise((resolve, reject) => {
			AjaxService.getJson("/portal/api/excel-messages", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response.data)
			})
		});
	}
	static validate(params) {
        return new Promise((resolve, reject) => {
            AjaxService.putJson(`/portal/api/idp/validate`, params, (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }
              resolve(response.data)
         })
        });
  }

	static processCancelAction(parentDocumentId, action) {
		return new Promise((resolve, reject) => {
			AjaxService.postJson(`/portal/api/idp/cancel?do_not_wrap_response=true&parentDocumentId=${parentDocumentId}&action=${action}`, {}, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response.data)
			})
		});
	}

	static processRetryAction(parentDocumentId) {
		return new Promise((resolve, reject) => {
			AjaxService.postJson(`/portal/api/idp/retry?do_not_wrap_response=true&parentDocumentId=${parentDocumentId}`, {}, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response.data)
			})
		});
	}

	static getExcelStatus(parentDocumentId) {
		return new Promise((resolve, reject) => {
			AjaxService.getJson("/portal/api/idp/excel-status?do_not_wrap_response=true", {parentDocumentId}, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response)
			})
		});
	}
	static getExcelAuditHistory(params) {
		return new Promise((resolve, reject) => {
			AjaxService.getJson("/portal/api/excel-audit-history", params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response.data)
			})
		});
	}

    /**
     * Get selected cells within specified selections and their associated document IDs.
     * @param {Object} sheet - The sheet object containing cell data.
     * @param {Array} selections - An array of selection objects, each specifying row and column ranges.
     * @returns {Object} An object containing unique document IDs and selected cell data.
     */
    static getRangeInfo(sheet, selections) {
        let documentIds = [];
        let selectedCells = [];

        const cellData = sheet.celldata || [];
        if (_.isEmpty(cellData)) {
            return { documentIds: [], selectedCells: [] };
        }

        for (const selection of selections) {
            // Calculate the range of rows based on the selected row range
            // Example - selection.row = [1, 4] i.e 1-4 rows are selected so, we need to get all 1,2,3,4 values of row
            let rowsRange = _.range(selection.row[0], selection.row[1] + 1);

            for (let cell of cellData) {
                // Check if the cell matches the selection criteria i.e column, row number and value
                if (cell.c === selection.column_focus && rowsRange.includes(cell.r) && cell.v) {
                    selectedCells.push(cell);
                    // If the cell has a doc_id value, add it to the documentIds array
                    cell.v.doc_id && documentIds.push(cell.v.doc_id);
                }
            }
        }
        return { documentIds: _.uniq(documentIds), selectedCells };
    }

	// 0th column is document stage 
	static getStageByRowIndex(rowIndex){
		return window.luckysheet.getcellvalue(rowIndex,0);
	}


	/* 
		**params:- file_name,document_type,storage_folder_path,parent_document_id
	*/
	static downloadExcelDocument(params) {
		AjaxService.getJson("/portal/api/download-excel", params, (error, response) => {
			const excelBase64Data = response.data
			var anchorElement = document.createElement('a');
			anchorElement.setAttribute('href', 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + excelBase64Data);
			anchorElement.setAttribute('download', params.file_name);
			anchorElement.click();
		})
	}

	/**
	 * Determines if the given excel configuration corresponds to a excel form setup.
	 *
	 * This function fetches the 'isExcelForm' flag from the provided excel configuration 
	 * and returns it. This flag indicates whether the excel setup is designed for a excel form.
	 *
	 * @param {Object} excelConfig - The configuration object related to the excel setup.
	 * @return {boolean} - Returns true if the setup is for a excel form, otherwise returns false.
	*/
	static isExcelFormType(excelConfig = {}){
		// Extract the 'isExcelForm' flag from the provided excel configuration.
		const isExcelForm = excelConfig.is_excel_form_type;
		// Return the extracted flag.
		return isExcelForm;
	}

	static async getExcelConfig(documentType){
		try{
			const documentConfiguration = await CustomerConfig.getCustConfigByDocType(documentType)
			return _.get(documentConfiguration ,"excel_config",{});
        } catch (e) {
            throw e;
        }
	}

}

