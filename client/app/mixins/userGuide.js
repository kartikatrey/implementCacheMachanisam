import EventBus from "@/EventBus";
export default {
	methods: {
		setupGuide: function () {
			let user = this.$store.getters.user
			if (user.is_first_login_attempt && !this.$store.state.userGuide[this.$route.name]) {
				this.$startTour()
			}
		},
		handleTutorialCompletion() {
			this.$store.commit("finishTutorial", this.$route.name);
		}
	},
	data() {
		return {
			callbacks: {
				onSkip: this.handleTutorialCompletion,
				onFinish: this.handleTutorialCompletion,
				onStop:this.handleTutorialCompletion
			},
			options: {
				highlight: true,
				stopOnTargetNotFound: true
			}
		}
	}
};
