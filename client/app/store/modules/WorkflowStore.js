import WorkflowService from "@/idp/services/WorkflowService";

export default {
	namespaced: true,
	state: {
        wfHistory: {
            showWfExecution: false,
            dialogFlowData: false
        }
	},
	getters: {

    },
	actions: {
        async commitWfHistory(context, wfInstanceId) {
            const params = {workflow_instance_id: wfInstanceId} 
            const wfExecutionData = await WorkflowService.getWorkflowExecutionData(params);
            const executionData = wfExecutionData && wfExecutionData.data && wfExecutionData.data.data;
            const storeData = {
                showWfExecution: true,
                dialogFlowData: executionData || {}
            }
            context.commit("setWfHistory", storeData);
        }
	},
	mutations: {
		setWfHistory(state, payload){
            state.wfHistory = payload
		}	
    }
};
