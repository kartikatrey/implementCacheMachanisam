import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import ExcelViewStore from "./modules/ExcelViewStore";
import ActionButtonStore from "./modules/ActionButtonStore"
import DocumentViewStore from "./modules/DocumentViewStore"
import DashboardStore from "./modules/DashboardStore"
import DynamicFormStore from "./modules/DynamicFormStore"
import VendorStore from "./modules/VendorStore"
import PaymentStore from "./modules/PaymentStore"
import FormViewStore from "./modules/FormViewStore"
import WorkflowStore from "./modules/WorkflowStore"
import UserAccessStore from "./modules/UserAccessStore"
import BusinessRuleStore from "./modules/BusinessRuleStore"

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
	modules :{
		excelViewStore : ExcelViewStore,
		actionButtonStore : ActionButtonStore,
		documentViewStore : DocumentViewStore,
		dashboardStore: DashboardStore,
		dynamicFormStore:DynamicFormStore,
		vendorStore: VendorStore,
		paymentStore: PaymentStore,
		workflowStore: WorkflowStore,
		formViewStore : FormViewStore,
		//created mapping for new store
		userAccessStore: UserAccessStore,
		businessRuleStore:BusinessRuleStore

	},
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
		wfDirtyFlag:false,
		documentType:"",
		documentId:"",
		displayIdpTree:false,
		displayIdpNavbar:false,
		showApprovalHistory:false,
        showAdvanceSearchDialog: false,
        currentAdvanceFilter: {},
        showWfExecution:false,
        dialogFlowData: {},
		documentConfig: {},
		showLoader:false,
		selectedTheme: null,
		uiConfig:{
			mainColor:"",
			logo:"",
			subColor1:"",
			subColor2:"",
			fabIcon:""
		},
		spreadsheetQuery: null,
		sortColumnName: '',
		roleAccessConfig: null
	},
	mutations: {
		setSelectedTheme(state,newTheme){
			state.selectedTheme=newTheme;
		},
		setSpreadsheetQuery(state, query) {
			state.spreadsheetQuery = query;
		},
		setRoleAccessConfig(state, configResponse) {
			state.roleAccessConfig = configResponse;
		},
		setSortColumnForLookup(state, columnName) {
			state.sortColumnName = columnName;
		},
		setShowLoader(state, showLoader){
			state.showLoader = showLoader
		},
		setDisplayApprovalHistory(state, payload){
			state.showApprovalHistory = payload.showApprovalHistory
			state.documentId = payload.documentId
		},
		setShowAdvanceSearchDialog(state, displayDialog) {
			state.showAdvanceSearchDialog = displayDialog
		},
		setAdvanceSearchParams(state, params) {
			state.showAdvanceSearchDialog = params.showAdvanceSearchDialog;
			state.currentAdvanceFilter = params.currentAdvanceFilter;
		},
		setWfExecutionData(state, payload){
			state.showWfExecution = payload.showWfExecution
            state.documentId = payload.documentId
            state.dialogFlowData = payload.wfExecutionData
		},
		setDisplayIdpTree(state, displayIdpTree){
			state.displayIdpTree = displayIdpTree
		},
		setDisplayIdpNavbar(state, displayIdpNavbar){
			state.displayIdpNavbar = displayIdpNavbar
		},
		setDocumentType(state, documentType){
			state.documentType = documentType
		},
		setDocumentConfig(state, documentConfig){
			state.documentConfig = documentConfig
		},
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
		setUidefault(state){
			state.uiConfig.mainColor =  ""
			state.uiConfig.subColor1 =  ""
			state.uiConfig.subColor2 =  ""
			state.uiConfig.logo =  ""
			state.uiConfig.fabIcon =  ""
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
		},
		setUiConfig(state,payload){
			state.uiConfig.mainColor = payload.mainColor || ""
			state.uiConfig.subColor1 = payload.subColor1|| ""
			state.uiConfig.subColor2 = payload.subColor2 || ""
			state.uiConfig.logo = payload.logo|| ""
			state.uiConfig.fabIcon = payload.fabIcon || ""
		},
	},
	actions: {

	},
	getters: {
		getDocumentConfig(state, getters) {
			return state.documentConfig
		},
		selectedTheme(state,getters){
			return state.selectedTheme;
		},
		getSortColumnName(state, getters) {
			return state.sortColumnName;
		},
		getSpreadsheetQuery(state, query) {
			return state.spreadsheetQuery;
		},
		roleAccessConfig(state, getters) {
			return state.roleAccessConfig;
		},
		documentType(state, getters){
			return state.documentType
		},
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
		isVendorUser(state, getters) {
			return state.user.is_vendor_user;
		},
		splashScreen(state, getters) {
			return state.splashScreen;
		},
		user(state,getters){
			return state.user
		},
		userEmail(state, getters){
			return state.user.email;
		},
		customerId(state, getters){
			return state.customerId
		},
		uiConfig(state,getters){
			return state.uiConfig
		},
		displayIdpTree(state, getters){
			return state.displayIdpTree
		},
		displayIdpNavbar(state, getters){
			return state.displayIdpNavbar
		},
		showAdvanceSearchDialog(state, getters) {
			return state.showAdvanceSearchDialog
		},
		currentAdvanceFilter(state, getters) {
			return state.currentAdvanceFilter
		}
	},
	plugins: [createPersistedState({paths: ["shouldShowApptour","selectedTheme","isImpersonate","layout","userGuide","customerId","user","notification","uiConfig","documentType","displayIdpNavbar","displayIdpTree"]})],
	strict: debug
});
