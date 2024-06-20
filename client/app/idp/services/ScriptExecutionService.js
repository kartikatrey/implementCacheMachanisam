import _ from 'lodash';
import {context} from "@/idp/context/ScriptContext";
import ActionButtonConfig from "@/idp/services/ActionButtonConfig";
import DocumentScriptService from "@/idp/services/DocumentScriptService";
import Constants from "@/resources/Constants";
export default class ScriptExecutionService {


    /**
     * * Purpose : To initiate execution of client-side and server-side scripts
     *
     * @param {Object} vueInstance An object containing all instance data
     * @param {String} docType A string containing document type
     * @param {String} docId A string containing document id
     * @param {String} eventType A string containing event type
     *
     * * Step 1 : Create context for script execution
     * * Step 2 : Execute client-side pre-script and store its response
     * * Step 3 : Guard Block : handling if beforeEventRes is undefined
     * * Step 4 : Execute server-side scripts if client-side response is positive
     * * Step 5 : Execute client-side posr-script with server-side message passing to it
     *
     */
    static async processScript(vueInstance, docType, docId, eventType) {
        let fieldData = vueInstance.props || vueInstance.actionData._id
        let beforeEventRes = {}
        let eventScriptRes = {}
        let afterScriptRes = {}

        // Step 1 : Create context for script execution
        let ctx = context(vueInstance, fieldData, docId)

        //  Step 2 : Execute client-side pre-script and store its response
        beforeEventRes = await runClientScript({}, ctx, eventType, docType) || {}

        // Step 3 : Guard Block : handling if beforeEventRes is undefined
        if (!beforeEventRes.status)
            return;

        // Step 4 : Execute server-side scripts if client-side response is positive
        eventScriptRes = await runServerScript(vueInstance, fieldData, docType, docId, eventType)

        // Step 5 : Execute client-side posr-script with server-side message passing to it
        afterScriptRes = await runClientScript(eventScriptRes, ctx, eventType, docType)

    }


}
/**
 * * Puprose : To execute client-side script (pre-script and post-scripts)
 *
 * @param {Object} server_response An object containing server_response (after execution of server scripts)
 * @param {Object} context An object containing context required for script execution
 * @param {String} eventType A string containing name of the event
 * @param {String} docType A string containing name of document type
 * @returns Response of the client-side execution script
 *
 * * Step 1 : Execute pre-script if there is no server_response
 * * Step 2 : Execute post-script if there is server_response
 *
 */
async function runClientScript(server_response={}, context={}, eventType, docType){
    let clientScriptResponse = {status:false}
    if(_.isEmpty(server_response)){

        // Step 1 : Execute pre-script if there is no server_response
        clientScriptResponse = window[`kan_event_${docType}_${context.uniqueId}_${eventType}_before`](context);
                return clientScriptResponse
    }

    // Step 2 : Execute post-script if there is server_response
    clientScriptResponse = window[`kan_event_${docType}_${context.uniqueId}_${eventType}_after`](server_response,context);
       return clientScriptResponse
}

/**
 *
* @param {Object} vueInstance An object containing all instance data
* @param {String} documentType A string containing document type
* @param {String} documentId A string containing document id
* @param {String} eventType A string containing event type
 * @returns Data from server-script execution response to further execute client post-script
 *
 */
async function runServerScript(vueInstance, fieldData, documentType, documentId, eventType) {
    let payload;
    let response;
    payload = {
        'document_type': documentType,
        'document_id': documentId,
        'event': Constants.UI_EVENT_MAP[eventType].toLowerCase(),

    }

    if (vueInstance.actionData) {
        payload = {
            ...payload,
            ...{
                'button_name': _.get(vueInstance, "actionData.name"),
                'button_type': _.get(vueInstance, "actionData.button_type"),
                'script_type': Constants.DOCEX.SCRIPT_TYPE.ACTION_BUTTON,
                'form': vueInstance.$store.getters["actionButtonStore/getDocumentData"] || vueInstance.$store.getters["formViewStore/getFormData"]
            }
    }
    response = await ActionButtonConfig.run(payload);
} else {
    payload = {
        ...payload,
        ...{
            'field_name': fieldData.field_config.field_type == "table" ? fieldData.field_config.name.split(/_([^_]*)$/)[0] : fieldData.field_config.name,
            'field_value': fieldData.value,
            'script_type': Constants.DOCEX.SCRIPT_TYPE.UI_EVENT_SCRIPT,
            'form': vueInstance.$store.getters["documentViewStore/getDocumentForm"]
        }
    }
    response = await DocumentScriptService.run(payload);
}
return response.data;
}