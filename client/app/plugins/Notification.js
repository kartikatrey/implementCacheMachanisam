const mixin = {
	methods: {
		notifyError(message, title = "Error",cssClass) {			
			this.$notify.error({
				title: title,
				message: this.getMessage(message),
				customClass: cssClass
			});
		},
		notifyInfo(message, title = "Info",cssClass) {			
			this.$notify.info({
				title: title,
				message: this.getMessage(message),
				customClass: cssClass
			});
		},
		notifySuccess(message, title = "Success") {
			this.$notify({
				title: title,
				type: "success",
				message: this.getMessage(message)
			});
		},
		notifyConfirm(message,confirmButtonText,type){
			let confirmDialog = this.$confirm(
				message,
				"Confirmation",
				{
				  confirmButtonText: confirmButtonText||"Confirm",
				  cancelButtonText: "Cancel",
				  type: type||"warning"
				}
			  );
			  return confirmDialog;
		},
		notifyAlert(message, title, confirmButtonText){
			let alertBox = this.$alert(message, title, {
				confirmButtonText: confirmButtonText || 'OK',
			  });
			return alertBox
		},
		notifyPrompt(message, title, confirmButtonText, cancelButtonText, inputPattern, inputErrorMessage){
			let prompt = this.$prompt(message, title, {
                confirmButtonText: confirmButtonText,
                cancelButtonText: cancelButtonText,
                inputPattern: inputPattern,
                inputErrorMessage: inputErrorMessage
            })
			return prompt
		},
        
		showErrorMessage(message){
			return this.$message.error(message);
		},
		showMessage(message, type, showClose=false){
			return this.$message({
				message: message,
				type: type,
				showClose: showClose,
			  });
		},
	  
		getMessage(message) { 
			const span = this.$createElement;
			return span("span", { style: "word-break: break-word" }, message);
		}
		
	}
};
export default {
	install(Vue, options) {
		Vue.mixin(mixin);
	}
};
