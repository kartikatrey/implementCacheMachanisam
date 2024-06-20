import TableAPIService from "@/services/TableAPIService";
import constants from "@/dialogflow/helpers/Constants";
let endPoint = "/portal/api/table/workflow";
import EventBus from "@/EventBus";
import Rete from "rete";
import * as Socket from "../sockets";
const uuidv4 = require("uuid/v4");

export default class DialogFlow {
	static fetchById(id) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.findById(endPoint, id, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}

	static fetchActiveCount() {
		return new Promise((resolve, reject) => {
			let restifyService = new TableAPIService();
			restifyService.addQuery({ active: true });
			restifyService.countRecord(endPoint, (error, response) => {
				error ? reject(error) : resolve(response.count);
			});
		});
	}

	static save(data) {
		//let  data_object=(data['object']+"").split(",");	
        //data['object']=data_object;
		return new Promise((resolve, reject) => {
			let tableService = new TableAPIService();
			tableService.upsert(endPoint, data, (error, response) => {
				error ? reject(error) : resolve(response.data);
			});

		});
	}

	static fetchDomains() {
		return new Promise((resolve, reject) => {
			let endPoint = "/portal/api/table/Domains";
			let restifyService = new TableAPIService();
			restifyService.find(endPoint, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}

	static getActions() {
		return constants.REQUIRED_ENTITY.ACTIONS;
	}

	static fetchServicesByCriteria(criteria) {
		return new Promise((resolve, reject) => {
			let endPoint = "/portal/api/table/service";
			let restifyService = new TableAPIService();
			const columnList = ["service_name"];
			restifyService.addSelectColumns(columnList);
			restifyService.addQuery(criteria);
			restifyService.find(endPoint, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}

	static fetchWorkflowList(){
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.find(endPoint, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}
	
	static addOutput(currentNode, form){
		Array.from(currentNode.outputs.entries()).forEach((output, index) => {        
			if(_.get(form, `connections[${index}][label]`) == output[1].name) return;
			output[1].connections.map((connection) =>
			  EventBus.$emit("REMOVE_CONNECTION", connection)
			);
		  });
		  // Remove all existing connections
		  _.each(currentNode.data.connections, (connections, index) => {
			if(_.get(form, `connections[${index}][label]`) == connections.label) return;
			currentNode.removeOutput(
			  new Rete.Output(
				connections.name,
				connections.label,
				currentNode.inputs.get("act").socket
			  )
			);
		  });
	
		  _.each(form.connections, (connection, index) => {
			if( _.get(currentNode.data, `connections[${index}][label]`) == connection.label){return};
			connection.name = uuidv4();
			currentNode.addOutput(
			  new Rete.Output(
				connection.name,
				connection.label,
				Socket.anyTypeSocket
			  )
			);
		  });
		  currentNode.update();
		  EventBus.$emit("UPDATE_NODE", currentNode);
		  return true;
	}
}
