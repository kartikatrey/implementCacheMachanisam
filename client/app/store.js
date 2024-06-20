import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
	state: {
		layout: {
			navPos: "left", //top, bottom, left, right, false
			toolbar: "top", //top, bottom, false
			footer: true, //above, below, false
			boxed: false, //true, false
			roundedCorners: false, //true, false
			viewAnimation: "fade-top" // fade-left, fade-right, fade-top, fade-top-in-out, fade-bottom, fade-bottom-in-out, fade, false
		},
		userGuide:{},
		isTutorialInProgress : false,
		customerId : null,
		splashScreen: true,
		logged: true,
		isTableInEditMode:false,
		user:{},
		isAppInBackground: false,
		isImpersonate:false,
		shouldShowApptour:false,
		wfDirtyFlag:false
	},
	mutations: {
		setImpersonate(state, payload) {
			state.isImpersonate = payload;
		},
		setShowApptour(state, payload){
			state.shouldShowApptour = payload;
		},
		setLayout(state, payload) {
			if(payload && payload.navPos !== undefined)
				state.layout.navPos = payload.navPos;

			if(payload && payload.toolbar !== undefined)
				state.layout.toolbar = payload.toolbar;
				
			if(payload && payload.footer !== undefined)
				state.layout.footer = payload.footer;
		
			if(payload && payload.boxed !== undefined)
				state.layout.boxed = payload.boxed;

			if(payload && payload.roundedCorners !== undefined)
				state.layout.roundedCorners = payload.roundedCorners;

			if(payload && payload.viewAnimation !== undefined)
				state.layout.viewAnimation = payload.viewAnimation;
		},
		setLogin(state, payload) {
			state.logged = true;
		},
		setTableEditMode(state, flag) {
			state.isTableInEditMode = flag;
		},
		setLogout(state, payload) {
			state.layout.navPos = null;
			state.layout.toolbar = null;
			state.logged = false;
		},
		setSplashScreen(state, payload) {
			state.splashScreen = payload;
		},
		finishTutorial(state, page) {
			state.userGuide[[page]] = true,
			state.isTutorialInProgress = false;
		},
		startTutorial(state){
			state.isTutorialInProgress = true;
		},
		setCustomerId(state, payload){
			state.customerId = payload;
		},
		setUser(state,payload){
			state.user =payload
		},
		setVisibility(state,payload){
			state.isAppInBackground = payload
		},
		setWfDirtyFlag(state,payload){
			state.wfDirtyFlag = payload
		}
	},
	actions: {

	},
	getters: {
		isImpersonate(state, getters) {
			return state.isImpersonate;
		},
		shouldShowApptour(state, getters) {
			return state.shouldShowApptour;
		},
		layout(state, getters) {
			return state.layout;
		},
		navPos(state, getters) {
			return state.layout.navPos;
		},
		toolbar(state, getters) {
			return state.layout.toolbar;
		},
		footer(state, getters) {
			return state.layout.footer;
		},
		boxed(state, getters) {
			return state.layout.boxed;
		},
		roundedCorners(state, getters) {
			return state.layout.roundedCorners;
		},
		viewAnimation(state, getters) {
			return state.layout.viewAnimation;
		},
		isLogged(state, getters) {
			return state.logged;
		},
		splashScreen(state, getters) {
			return state.splashScreen;
		},
		user(state,getters){
			return state.user
		},
		customerId(state, getters){
			return state.customerId
		},
	},
	plugins: [createPersistedState({paths: ["shouldShowApptour","isImpersonate","layout","userGuide","customerId","user","notification"]})],
	strict: debug
});
