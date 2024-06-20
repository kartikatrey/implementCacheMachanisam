import AjaxService from "@/services/AjaxService";

export default class DynamicFormService {
	static getFormConfigById(formId, params = {}) {
		return new Promise((resolve, reject) => {
			const endPoint = `/portal/api/idp/form/config/${formId}`
			AjaxService.getJson(endPoint, params, (error, response) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(response.data)
			})
		});
	}
	static convertRowsToPredictionRows(formRows){
		return formRows.map((row) => {
			return Object.entries(row).map(([fieldName, fieldValue]) => {
				return { name: fieldName, value: fieldValue };
			});
		}) || [];
	}
	/**
	 * Converts formData to prediction.
	 * 
	 * @param {object} formData - The form data object with field names and values.
	 * @param {object} schema - The form structure.
	 * @returns {Array} - The array of prediction objects.
	 * 
	 * Example:
	 * 
	 * @FormData
	 * {
	 *     "personal_info": [
	 *         { "name": "John Doe", "age": 30 }
	 *     ],
	 *     "addresses": [
	 *         { "city": "New York", "zip": "10001" },
	 *         { "city": "Los Angeles", "zip": "90001" }
	 *     ]
	 * }
	 * 
	 * @predcition
	 * [
	 *     { "group": "personal_info", "name": "name", "page_number": 1, "value": "John Doe" },
	 *     { "group": "personal_info", "name": "age", "page_number": 1, "value": "30" },
	 *     {
	 *         "group": "addresses",
	 *         "name": "table",
	 *         "content": {
	 *             "rows": [
	 *                 [{ "name": "city", "value": "New York" }, { "name": "zip", "value": "10001" }],
	 *                 [{ "name": "city", "value": "Los Angeles" }, { "name": "zip", "value": "90001" }]
	 *             ]
	 *         }
	 *     }
	 * ]
	*/
	static convertFormDataToPrediction(formData, schema) {
		const prediction = [];

		for (const group of schema) {
			// If the group is marked as repeatable, and data is present in the group, 
			// then convert the rows to prediction rows.
			if (group.repeatable && !_.isEmpty(formData[group.name])) {
				const rows = this.convertRowsToPredictionRows(formData[group.name]);
				const tablePrediction = {
					group: group.name,
					name: 'table',
					content: {
						rows: rows,
					},
				};
				prediction.push(tablePrediction);
			} else {
				for (const field of group.children) {
					// Get the value from formData of current field
					const fieldValue = formData[group.name] ? formData[group.name][0][field.name] : undefined;
					const fieldPrediction = {
						group: group.name,
						name: field.name,
						page_number: 1,
						value: fieldValue || '',
					};
					prediction.push(fieldPrediction);
				}
			}
		}

		return prediction;
	}

	/**
	 * Converts prediction data into a form data structure.
	 * 
	 * Given a prediction array, this function creates a structured object 
	 * that groups fields by their designated groups or maps them directly if they don't belong to any group.
	 * 
	 * Example:
	 * 
	 * @Prediction
	 * [
	 *     { "group": "personal_info", "name": "name", "page_number": 1, "value": "John Doe" },
	 *     { "group": "personal_info", "name": "age", "page_number": 1, "value": "30" },
	 *     {
	 *         "group": "addresses",
	 *         "name": "table",
	 *         "content": {
	 *             "rows": [
	 *                 [{ "name": "city", "value": "New York" }, { "name": "zip", "value": "10001" }],
	 *                 [{ "name": "city", "value": "Los Angeles" }, { "name": "zip", "value": "90001" }]
	 *             ]
	 *         }
	 *     }
	 * ]
	 * 
	 * @formData
	 * {
	 *     "personal_info": [
	 *         { "name": "John Doe", "age": 30 }
	 *     ],
	 *     "addresses": [
	 *         { "city": "New York", "zip": "10001" },
	 *         { "city": "Los Angeles", "zip": "90001" }
	 *     ]
	 * }
	 * 
	 * 
	 * @param {Array} prediction - The prediction data to be transformed.
	 * @returns {Object} A structured object representing form data.
	 */
	static convertPredictionToFormData(prediction) {
		const formData = {};

		prediction.forEach(item => {
			const { group, name, value, content } = item;

			if (name === 'table' && group) {
				// set empty array in the form data if current group is not initialized
				if (!formData[group]) {
					formData[group] = [];
				}

				content.rows.forEach(row => {
					const rowObj = {};
					for (const field of row) {
						rowObj[field.name] = field.value;
					}
					formData[group].push(rowObj);
				});
			} else if (group) {
				// set object within array to store each field with its value in the group
				if (!formData[group]) {
					formData[group] = [{}];
				}

				// If group is non repeatable then all fields are in 0th array
				formData[group][0][name] = value;
			}
		});

		return formData;
	}
}