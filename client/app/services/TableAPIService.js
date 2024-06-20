let AjaxService = require("./AjaxService");
let _ = require("lodash");
function TableAPIService() {
	this.params = {};
}

TableAPIService.prototype = {

	/* find() retrieve all record from Particular collection.
	We can pass QUERY also to get that specific record
	params: -endpoint, qs */

	find: function (endpoint, callback) {
		AjaxService.getJson(endpoint, this.params, (error, response) => {
			callback(error, response);
		});

	},

	/* findById() is used to fetched record from 
	             schema based on your mongo Id.
	params: -endpoint, qs */

	findOne: function (endpoint, callback) {
		AjaxService.getJson(endpoint, this.params, (error, response) => {
			callback(error, response);
		});

	},
	findById: function (endpoint, id, callback) {
		AjaxService.getJson(endpoint + "/" + id, this.params, (error, response) => {
			callback(error, response);
		});

	},

	/*insert() is used to insert a record in collection.
	multple records are inserted if data is sent in array of Json
	params: -endpoint, qs */

	upsert: function (endpoint, data, callback) {
		let apiEndPoint = data._id ? `${endpoint}/${data._id}` : endpoint;
		AjaxService.postJson(apiEndPoint, data, (error, response) => {
			callback(error, response);
		});

	},

	delete: function (endpoint, id, params, callback) {	
		AjaxService.deleteJson(endpoint+ "/" + id, params, (error, response) => {
			callback(error, response);
		});
	},

	/*findByIdAndUpdate() method is used to update record based on Id
	params: -endpoint, qs */

	findByIdAndUpdate: function (endpoint, id, data, callback) {
		AjaxService.putJson(endpoint + "/" + id, data, (error, response) => {
			callback(error, response);
		});

	},

	/*countRecord() method is used to update record based on Id
    params: -endpoint, qs */

	countRecord: function (endpoint, callback) {
		let params = {};
		params["skip"] = 0;
		params["query"] = this.params["query"];
		AjaxService.getJson(endpoint + "/count", params, (error, response) => {
			callback(error, response);
		});

	},

	/*addLimit() method is used to pass limit to fetch record
	params: limit (- for desc)*/

	addLimit: function (limit) {
		this.params.limit = limit;
	},

	/*addSortCondition() method is used set sort condtions to fetch record
	params: column */

	addSortCondition: function (column) {
		this.params.sort = column;
	},

	/*addQuery() method is used to pass condition on which record is to fetched
	params: obj */

	addQuery: function (obj) {
		this.params["query"] = _.extend(this.params["query"]||{},obj );    // append new filter to existing filter
	},

	setQuery:function(obj){
		this.params["query"] = obj;
	},

	removeQuery : function(queryParam){
		_.has(this.params["query"], queryParam);
		{
			this.params["query"] = _.omit(this.params["query"], queryParam);
		}
		
	},

	/*addSelectColumns() method is used to fetch specific column to fetched
	params: columnList */
	addSelectColumns: function (columnList) {
		if (_.isArray(columnList)) {
			this.params["select"] = _.toString(columnList);
		}
	},


	/*buildParams() method is used to build api params
	 */

	addSkip: function (skip) {
		this.params.skip = skip;
	},
	/*search() method is used to search with like op
		key : column name
		value : search value
	 */
	search: function (endpoint, columnFilters, limit, callback) {
		let params = {};
		let columns = [];
		_.each(columnFilters, function (value, key) {
			let col_val = "(" + value + ")";
			columns.push({
				[key]: {
					"$regex": col_val,
					"$options": "i"
				}
			});

		});
		params["query"] = {
			$and: columns
		};
		params["limit"] = limit;
		AjaxService.getJson(endpoint, params, (error, response) => {
			callback(null, response);
		});
	},

	addAggregation: function (aggregation) { 
		this.params.aggregation = aggregation;
	}

	
};
module.exports = TableAPIService;
