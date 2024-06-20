import TableAPIService from "@/services/TableAPIService";
import constants from "@/dialogflow/helpers/Constants";
let endPoint = "/portal/api/table/workflow_log";

export default class WorkflowLog {
	static fetchById(id) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.findById(endPoint, id, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}

	static fetchLogCount() {
		return new Promise((resolve, reject) => {
			let restifyService = new TableAPIService();
			restifyService.countRecord(endPoint, (error, response) => {
				error ? reject(error) : resolve(response.count);
			});
		});
	}

	static prepareWorkflowLog(dialogFlowData,currentNodeId){
		if(!dialogFlowData.workflow_data.nodes[currentNodeId].data.workflow_log){
			return null;
		}
		const workflowLog = {};
		workflowLog["input"] = dialogFlowData.workflow_data.nodes[currentNodeId].data.workflow_log.input.toString();
		workflowLog["status"] = dialogFlowData.workflow_data.nodes[currentNodeId].data.workflow_log.status;
		workflowLog["info_log"] = dialogFlowData.workflow_data.nodes[currentNodeId].data.workflow_log.info_log.toString();
		workflowLog["error_log"] = dialogFlowData.workflow_data.nodes[currentNodeId].data.workflow_log.error_log.toString();
		workflowLog["node_context"] = JSON.stringify(dialogFlowData.workflow_data.nodes[currentNodeId].data.workflow_log.node_context);
		workflowLog["workflow_context"] = JSON.stringify(dialogFlowData.workflow_data.nodes[currentNodeId].data.workflow_log.workflow_context);
		return workflowLog;
	}
}
