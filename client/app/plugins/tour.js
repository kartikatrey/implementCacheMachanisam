const mixin = {
	methods: {
		$startTour() {
			this.$tours['userGuide'].start();
			this.$store.commit("startTutorial");
		},
		$stopTour() {
			this.$tours && this.$tours['userGuide'] && this.$tours['userGuide'].finish();
			this.$store.commit("finishTutorial", this.$route.name);
		}
    }
}

export default {
	// The install method will be called with the Vue constructor as the first argument, along with possible options
	install(Vue, options) {
		Vue.mixin(mixin);
	}
}
