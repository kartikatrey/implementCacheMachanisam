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
	getJson: function (url, params, callback) {
		const strHeaders = getRequestHeader();
		axios.get(url, {
			headers: strHeaders,
			params: params
		}).then(function (response) {
			if (handleError(response)) {
				callback(null, response.data);
			} else { callback(null, response); }

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
	postJson(url, data, callback) {
		const strHeaders = getRequestHeader();
		axios.post(url, data, {
			headers: strHeaders
		}).then(function (response) {
			if (handleError(response)) {
				callback(null, response);
			}
		}).catch(function (error) {
			callback(error);
		});
	},
	/*
	 * putJson method to make Put API calls
	 * params: -url, data, callback
	 */
	putJson(url, data, callback) {
		const strHeaders = getRequestHeader();
		axios.put(url, data, {
			headers: strHeaders
		}).then(function (response) {
			if (handleError(response)) {
				callback(null, response);
			}
		}).catch(function (error) {
			callback(error);
		});
	},
	/*
	 * deleteJson method to make Delete API calls
	 * params :- url,callback
	 */
	deleteJson(url, param, callback) {
		axios.delete(url, { params: param }).then(function (response) {
			try {
				if (handleError(response)) {
					callback(null, response);
				}
			} catch (e) {
				console.log(e);
			}
		}).catch(function (error) {
			callback(error);
		});
	},

	getFile: function (url, params, callback) {
		const strHeaders = getRequestHeader();
		axios.get(url, {
			headers: strHeaders,
			params: params,
			responseType: 'blob'
		}).then(function (response) {
			var fileURL = window.URL.createObjectURL(new Blob([response.data]));
			var fileLink = document.createElement('a');
			fileLink.href = fileURL;
			// Added to support html file type
			let file_name=params.file_type=="html" ?params.original_file_name:params.file_name;
            fileLink.setAttribute('download', file_name);
			document.body.appendChild(fileLink);
			fileLink.click();
			callback();
		}).catch(function (error) {
			console.log(error);
			if (error) {
				callback(error);
			}
		});
	},
};

/*
 * getRequestHeader method to make request header
 */
function getRequestHeader() {
	let strHeaders = {};
	strHeaders = {
		"Content-Type": "application/json"
	};
	return strHeaders;

}

/* 
*	handleError method to verify user session is active or not
*/

function handleError(response) {
	/**
	 * If the current user roles lack permissions to read/write records, we check permissions 
	 * for those roles and the record IDs associated with config resources on the server side.
	 * If the permissions are not allowed, an alert message is displayed to the user.
	 */
	if (response.data.err_code === "forbidden") {
		alert(response.data.message);
		return false;
	}
	if (response.data.status === "error") {
		if (window.session_expired) {
			return false;
		}
		window.session_expired = true;
		if (response.data.err_code === "invalid_session") {
			alert("Your session got expired, redirecting to login page");
			window.location = "/login";
			return false;
		}
		if (response.data.err_code === "access_denied") {
			alert(response.data.message);
			return false;
		}
	}
	return true;
}