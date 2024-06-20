export default class MessageService {
	static prepareErrorMessage(message) {
		return '<span class="mdi mdi-alert-circle-outline error-info-icon"></span>' + message;
	}  

	static prepareWarningMessage(message) {
		return '<span class="mdi mdi-alert-circle-outline warning-info"></span> <p class="document-warning-message">' + message + '</p>';
	}    

	static prepareInfoMessage(message) {
		return '<span class="mdi mdi-information information-icon"></span>' + message;
	}    

	static prepareFraudMessage(message) {
		return '<span class="mdi mdi-alert warning-info"></span>' +
        '<p class="document-warning-message">' + message + '</p>'
	}   

	static prepareInfoMessage(message) {
		return '<span class="mdi mdi-information information-icon"></span>' + message;
	}   

	static prepareSuccessMessage(message) {
		return '<span class="mdi mdi mdi-checkbox-marked-circle success-icon"></span>' +
        '<p class="document-success-message">' + message + '</p>'
	}    

	static getMessageBasedOnType(messageType, message){
		const messageTypeMap = {
			"error" : this.prepareErrorMessage(message),
			"warning" : this.prepareWarningMessage(message),
			"info" : this.prepareInfoMessage(message),
			"fraud" : this.prepareFraudMessage(message),
			"success" : this.prepareSuccessMessage(message),
		}
		return messageTypeMap[messageType];
	}


}

