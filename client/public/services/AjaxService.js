/* Name: AjaxService.py
    purpose: Used to make HTTP requests 
    Date: 02/07/19
*/

const axios = require("axios");
module.exports = {
	/*
	 * getJson method to make get API calls
	 * params :- url,params, callback
	 */
	getJson: function (url, params,headers={},callback) {
		const strHeaders = getRequestHeader(headers);
		axios.get(url, {
			headers: strHeaders,
			params: params
		}).then(function (response) {
			callback(null, response.data);

		}).catch(function (error) {
			console.log(error);
			if (error) {
				callback(error);
			}
		});
	},
	/*
	 * postJson method to make Post API calls
	 * params: -url, data, callback
	 */
	postJson(url, data,headers={},callback) {
		const strHeaders = getRequestHeader(headers);
		axios.post(url, data, {
			headers: strHeaders
		}).then(function (response) {
			callback(null, response);
		}).catch(function (error) {
			callback(error);
		});
	},
	/*
	 * putJson method to make Put API calls
	 * params: -url, data, callback
	 */
	putJson(url, data,headers={},callback) {

		const strHeaders = getRequestHeader(headers);
		axios.put(url, data, {
			headers: strHeaders
		}).then(function (response) {
			callback(null, response);
		}).catch(function (error) {
			callback(error);
		});
	},
	/*
	 * deleteJson method to make Delete API calls
	 * params :- url,callback
	 */
	deleteJson(url,headers={},callback) {
		axios.put(url).then(function (response) {
			try {
				callback(null, response);
			} catch (e) {
				console.log(e);
			}
		}).catch(function (error) {
			callback(error);
		});
	}
};

/*
 * getRequestHeader method to make request header
 */
function getRequestHeader(headers) {
	let strHeaders = {};
	strHeaders = {
		"Content-Type": "application/json",
	};
	strHeaders={...strHeaders, ...headers}
	return strHeaders;

}
