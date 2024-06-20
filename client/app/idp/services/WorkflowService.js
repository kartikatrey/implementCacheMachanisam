import AjaxService from "@/services/AjaxService";
import TableAPIService from "@/services/TableAPIService";
import constants from "@/resources/Constants";

export default class WorkflowService {
	static getWorkflowExecutionData(params) {
		return new Promise((resolve, reject) => {
            AjaxService.getJson("/api/workflow-execution", params, (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(response)
            })
		});
	}

    static getWorkflowInstanceData(params) {
		return new Promise((resolve, reject) => {
			const tableAPI = new TableAPIService();
			tableAPI.addQuery(params);
			tableAPI.find(constants.WORKFLOW_INSTANCE_ENDPOINT, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}

    static runWorkflow(params) {
		return new Promise((resolve, reject) => {
            AjaxService.postJson("/api/workflow-execution", params, (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(response.data)
            })
		});
	}

    static action(params) {
		return new Promise((resolve, reject) => {
            AjaxService.postJson("/api/workflow-action", params, (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(response.data)
            })
		});
	}
}