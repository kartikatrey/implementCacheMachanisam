import _ from 'lodash';
import idpSheetService from "@/idp/services/excel/IdpSheetService";
import store from "@/store/store";
import Constants from "../../resources/Constants";
import EventBus from "@/EventBus";

export function context(vueInstance,fieldData,documentId) {
       return {
            "uniqueId":  _.get(vueInstance.props, "field_config._id") || _.get(vueInstance,"actionData._id"),// field_config_id in case of UI and action_id in case of buttons
            "index": fieldData && _.get(fieldData.field_config, "index", ""),
            "fieldName": fieldData && _.get(fieldData, "name", ""), //To emit line validation messages event
            'document': vueInstance.$store.getters["actionButtonStore/getDocumentData"],
            'documentId': documentId,
            'stages': Constants.DOCEX.STAGE,
            'states': {
                ...Constants.DOCEX.STATE_UPLOADED,
                ...Constants.DOCEX.STATE_PUBLISHED
            },
            "validate": validate,
            "confirm": confirm(vueInstance),
            "alert": alert(vueInstance),
            "prompt": prompt(vueInstance),
            "notifySuccess": notifySuccess(vueInstance),
            "notifyError": notifyError(vueInstance),
            "notifyInfo": notifyInfo(vueInstance),
            "errorMessage": errorMessage(vueInstance),// To show error type of message
            "message": message(vueInstance),// To show message on UI
            "addMessage":addMessage,
            "removeMessage":removeMessage,
            "setValue":setFieldValue,
            "getValue":getFieldValue
      }
}

// To validate BR of a perticular field
async function validate(params){
    params['action']="validate"
    let validationRes =  await idpSheetService.validate(params);
    if(validationRes.data){
        store.commit("documentViewStore/setMessagesData",validationRes.data.message && validationRes.data.message.validation_messages)
        let fieldType = null;
        let fieldName = null
        if(params.hasOwnProperty("index")){
            fieldType = getFieldType(params.index);
        }
        if(params.hasOwnProperty("field_name")){
            fieldName = params.field_name;
        }
        removeMessage(fieldName, params.index)
        // renderMessages(fieldType)
        //Emit line validation messages 
        // emitLineValidationMessages(fieldName, params.index)
    }
     return validationRes
}

//This patch gl code validation
function getFieldType(fieldTypeIndex){
    let fieldTypeValue = fieldTypeIndex >-1 ? "LINE" : "HEADER"
    return fieldTypeValue;
}

//To add validation messages from document viewer
function addMessage(message,type,fieldName,index){
        let messageFormat ={
            "field_name" : fieldName,
            "message" : message,
            "message_type" : type,
            "field_type" : (index !== null)? "LINE" : "HEADER",
            "row" : index,
            "br_map_id" : "",
            "sub_type" : null,
            "level" : "document"
        }
        store.commit("documentViewStore/addValidationMessage",messageFormat)
        renderMessages(messageFormat.field_type);
        //Emit line validation messages 
        emitLineValidationMessages(fieldName, index)
}

//To remove validation messages from document viewer
function removeMessage (fieldName,index){
    let fieldType = index>-1 ? "LINE" : "HEADER"
    store.commit("documentViewStore/removeValidationMessage",{
        "field_name" : fieldName,
        "index" : index,
    })
    renderMessages(fieldType)
    //Emit line validation messages 
    emitLineValidationMessages(fieldName, index)
}

/**
 * Emits validation messages for a specific line identified by index and field name.
 * @param {string|null} fieldName - The name of the field.
 * @param {number|null} index - The index of the line.
 */
function emitLineValidationMessages(fieldName = null, index = null) {
    // If the index is less than 0 or it's null, it indicates a header field. In that case, there's no need to proceed.
    if (index < 0 || index == null) {
        return;
    }

    const params = { "field_name": fieldName, "row_index": index}
    // Get field details from document view store
    const predictedField = store.getters["documentViewStore/getFieldDetails"](params);
    if (!predictedField) {
        return;
    }
    store.commit("documentViewStore/updateValidationMsgs",{
        "field" : predictedField,
        "value" : predictedField && predictedField.value,
        "index" : index
    })
}

//To render message on document viewer
function renderMessages(fieldType = null){
    let fieldPredictionData=store.getters["documentViewStore/fieldPredictionData"];
    let documentData=store.getters["documentViewStore/documentData"];
    _.each(documentData.display_fields, (field) => {
            let predictedField = _.find(fieldPredictionData.prediction, {
                // prediction from model
                name: field,
            });
            if (predictedField) {
                predictedField["validationMsgs"] = predictedField.validationMsgs || [];
                predictedField["config"] = predictedField["config"] || [];
                store.commit("documentViewStore/addBusinessRulesError",{'predictedField': predictedField, 'index': null});
                return;
            }
            let tablePrediction = _.find(fieldPredictionData.prediction, {
                name: "table",
            });
            if(tablePrediction){
                _.each(tablePrediction.content.rows, (rowPredictedData, rowIndex) => {
                    let predictedField = _.find(rowPredictedData, {
                        name: field,
                    });
                    if(predictedField){
                        predictedField["validationMsgs"] = predictedField.validationMsgs || [];
                        predictedField["config"] = predictedField["config"] || [];
                        store.commit("documentViewStore/addBusinessRulesError",{'predictedField': predictedField, 'index': rowIndex});
                        return;
                    }

                    });
            }

    })
     //For each LineItem validation we need to store validation and refresh LineItem accrodingly
     if(fieldType == "LINE"){
        store.commit("documentViewStore/setRefreshLineItem",true)
    }
}


// to add confirm popover
const confirm = function(vueInstance){
   return async function (message,confirmButtonText) {
            return await vueInstance.notifyConfirm(message, confirmButtonText)
    }
}

// to add alert popover
const alert = function(vueInstance){
    return async function (message, title, confirmButtonText) {
             return await vueInstance.notifyAlert(message, title, confirmButtonText)
     }
 }

// to add alert popover
const prompt = function(vueInstance){
    return async function (message, title, confirmButtonText, cancelButtonText, inputPattern, inputErrorMessage) {
             return await vueInstance.notifyPrompt(message, title, confirmButtonText, cancelButtonText, inputPattern, inputErrorMessage)
     }
 }

// to add success notification
const notifySuccess = function(vueInstance){
    return async function (message, title) {
             return await vueInstance.notifySuccess(message, title)
     }
 }

// to add error notification
const notifyError = function(vueInstance){
    return async function (message, title, cssClass) {
             return await vueInstance.notifyError(message, title, cssClass)
     }
 }

 // to add info notification
const notifyInfo = function(vueInstance){
    return async function (message, title, cssClass) {
             return await vueInstance.notifyInfo(message, title, cssClass)
     }
 }

// to add error message
const errorMessage = function(vueInstance){
    return async function (message) {
             return await vueInstance.showErrorMessage(message)
     }
 }

 // to add message alert
const message = function(vueInstance){
    return async function (message, type, showClose) {
             return await vueInstance.showMessage(message, type, showClose)
     }
 }

/*
In the UI Event Script context, the setValue function is added.
This function is triggered when the setValue function is called from the context via UI Event Script.
Purpose: To update the value of the prediction field.
It updates the value of the prediction field with the value received in the params.

@params: An object containing the following properties - value, field_name, row_index, and table_name.
*/
function setFieldValue(params){
    return store.commit("documentViewStore/setFieldValue",params);
  }

 /*
  In UI Event Script context setValue  is added
  This function is triggered when getValue is called from the context vua UI Event Script
  Purpose : To fetch the value of field_name from prediction data

 @params: An object containing the following properties - field_name, row_index, and table_name
 */
 function getFieldValue(params){
    return store.getters["documentViewStore/getFieldValue"](params);
  }
