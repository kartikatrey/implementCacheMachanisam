export default {

	watch: {
		form: {
			handler: function (newVal, oldVal) {
				if (_.isEmpty(this.clonedForm) || _.isEmpty(newVal)) return;
				const isDirty = (JSON.stringify(this.form) !== JSON.stringify(this.clonedForm));
				this.$store.commit("setWfDirtyFlag", isDirty);
			},
			immediate: true,
			deep: true,
		}
	},

	data() {
		return {
			clonedForm: {}
		}
	}
}
