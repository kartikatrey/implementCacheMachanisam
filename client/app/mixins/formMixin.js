import ScriptService from "@/idp/services/ScriptExecutionService";
import CommonService from "@/services/CommonService";
const _ = require("lodash");

export default {
	methods: {
        /**
         * * Purpose : To prepare data to process action button scripts

         * @param {Object} vueInstance An object containing all instance data
         * @param {String} uniqueId A unique identification string (field_id or action_id)
         * @param {String} eventType A type of event
         * @param {Object} event An  object containing event data
         *
         * * Step 1 : Guard block : handeling missing uniqueId
         * * Step 2 : Fetch formData from action button store
         * * Step 3 : Fetch documentId and documentType
         * * Step 4 : Guard block : handeling missing uniqueId : handling missing window instance
         */
        handleScript: async function(vueInstance, uniqueId, eventType, event){
            // Step 1 : Guard block : handeling missing uniqueId
            if(!uniqueId){
                console.error("No uniqueid found, skipping script execution")
                return;
            }

            // Step 2 : Fetch formData from action button store
            const recordData = vueInstance.$store.getters["actionButtonStore/getDocumentData"]

            // Step 3 : Fetch documentId and documentType
            const documentId = recordData._id || vueInstance.$store.getters["documentViewStore/documentId"]
            const documentType = recordData.document_type || vueInstance.$store.getters["documentViewStore/documentType"]

            // Step 4 : Guard block : handling missing window instance
            if(window[`kan_event_${documentType}_${uniqueId}_${eventType}_before`])
            {
                await ScriptService.processScript(vueInstance, documentType, documentId, eventType, event)
            }

        },
        /**
         * Purpose of this function determines whether the current user roles have permission to modify/update any 
         * configuration menu records. If the user lacks write permissions for those records, the Save button in
         * the menu will be hidden. It takes the resource name as input and returns a boolean indicating 
         * whether the save action is permitted.
         * 
         * @param {*} resourceName : name of the collection
         * @returns 
         */
        isSaveActionPermitted : async function(resourceName){
            const permissionsResponse = await CommonService.getWritePermissions(resourceName);
            return !_.isEmpty(permissionsResponse);
        }

	},
	data() {
		return {
        }
	}
};
