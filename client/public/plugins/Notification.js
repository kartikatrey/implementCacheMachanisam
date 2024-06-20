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
