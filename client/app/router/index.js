import Vue from "vue";
import Router from "vue-router";
import _ from "lodash";
import { Loading } from 'element-ui';

const DocumentList = () =>
	import('@/doc-ex/pages/DocumentList.vue')
const DocumentConfigForm = () =>
	import('@/doc-ex/pages/DocumentConfigForm.vue')
const DocumentConfigList = () => import('@/doc-ex/pages/DocumentConfigList.vue')

const DocumentDebugView = () => import("@/doc-ex/pages/DocumentDebugView.vue");

// import Dashboard from "@/views/apps/Dashboard.vue";
const Dashboard = () =>
	import('@/views/apps/Dashboard.vue')
const QNADashboard = () =>
	import('@/views/apps/QNADashboard.vue')
// import Profile from "@/views/pages/Profile.vue";
const UserProfile = () =>
	import('@/views/pages/UserProfile.vue')
// import Statements from "@/views/pages/Statements.vue";
const Statements = () =>
	import('@/views/pages/Statements.vue')
// import Invoice from "@/views/pages/Invoice.vue";
const Invoice = () =>
	import('@/views/pages/Invoice.vue')
// import CustomersList from "@/views/pages/CustomerList";
const CustomersList = () =>
	import('@/views/pages/CustomerList.vue')
// import Customers from "@/views/pages/Customers";
const Customers = () =>
	import('@/views/pages/Customers.vue')
// import Leads from "@/views/pages/Leads.vue";
const Leads = () =>
	import('@/views/pages/Leads.vue')

// import RegisteredDevices from "@/views/pages/RegisteredDevices";
const RegisteredDevices = () =>
	import('@/views/pages/RegisteredDevices.vue')
// import ServiceConfigForm from "@/views/pages/ServiceConfigForm.vue";
const ServiceConfigForm = () =>
	import('@/views/pages/ServiceConfigForm.vue')
// import ServiceConfigList from "@/views/pages/ServiceConfigList.vue";
const ServiceConfigList = () =>
	import('@/views/pages/ServiceConfigList.vue')
// import NerList from '../views/pages/NerList.vue';
const NerList = () =>
	import('@/views/pages/NerList.vue')
// import NerForm from '../views/pages/NerForm.vue';
const NerForm = () =>
	import('@/views/pages/NerForm.vue')
// import CustomerSystemList from "@/views/pages/CustomerSystemList.vue";
const CustomerSystemList = () =>
	import('@/views/pages/CustomerSystemList.vue')
// import CustomerSystemForm from "@/views/pages/CustomerSystemForm.vue";
const CustomerSystemForm = () =>
	import('@/views/pages/CustomerSystemForm.vue')
// import MasterSystemList from "@/views/pages/MasterSystemList.vue";
const MasterSystemList = () =>
	import('@/views/pages/MasterSystemList.vue')
// import MasterSystemForm from "@/views/pages/MasterSystemForm.vue";
const MasterSystemForm = () =>
	import('@/views/pages/MasterSystemForm.vue')
// import TrainingStatusList from "@/views/pages/TrainingStatusList";
const TrainingStatusList = () =>
	import('@/views/pages/TrainingStatusList.vue')
// import CustomerList from "@/views/pages/CustomerList.vue";
const CustomerList = () =>
	import('@/views/pages/CustomerList.vue')
// import CustomerForm from "@/views/pages/CustomerForm.vue";
const CustomerForm = () =>
	import('@/views/pages/CustomerForm.vue')
// import TransactionList from "@/views/pages/TransactionList.vue";
const TransactionList = () =>
	import('@/views/pages/TransactionList.vue')
// import QAAutomatioForm from "@/views/pages/QAAutomatioForm.vue"
const QAAutomatioForm = () =>
	import('@/views/pages/QAAutomatioForm.vue')
// import ReportedIssues from "@/views/pages/ReportedIssues.vue"
const ReportedIssues = () =>
	import('@/views/pages/ReportedIssues.vue')
// import HelpSectionList from "@/views/pages/HelpSectionList.vue"
const HelpSectionList = () =>
	import('@/views/pages/HelpSectionList.vue')
// import HelpSectionForm from "@/views/pages/HelpSectionForm.vue"
const HelpSectionForm = () =>
	import('@/views/pages/HelpSectionForm.vue')
// import SuggestionList from "@/views/pages/SuggestionList.vue"
const SuggestionList = () =>
	import('@/views/pages/SuggestionList.vue')
// import SuggestionsForm from "@/views/pages/SuggestionsForm.vue"
const SuggestionsForm = () =>
	import('@/views/pages/SuggestionsForm.vue')
// import EntitiesList from "@/views/pages/EntitiesList.vue"
const EntitiesList = () =>
	import('@/views/pages/EntitiesList.vue')
// import EntitiesForm from "@/views/pages/EntitiesForm.vue"
const EntitiesForm = () =>
	import('@/views/pages/EntitiesForm.vue')
// import RoutingDataList from '@/views/pages/RoutingDataList.vue';
const RoutingDataList = () =>
	import('@/views/pages/RoutingDataList.vue')
// import RoutingDataForm from '@/views/pages/RoutingDataForm.vue';
const RoutingDataForm = () =>
	import('@/views/pages/RoutingDataForm.vue')
// import ScriptList from '@/views/pages/ScriptList.vue';
const ScriptList = () =>
	import('@/views/pages/ScriptList.vue')
// import SimilarityCheck from '@/views/pages/SimilarityCheck.vue';
const SimilarityCheck = () =>
	import('@/views/pages/SimilarityCheck.vue')
// import ScriptForm from '@/views/pages/ScriptForm.vue';
const ScriptForm = () =>
	import('@/views/pages/ScriptForm.vue')
// import EntityTagList from '@/views/pages/EntityTagList.vue';
const EntityTagList = () =>
	import('@/views/pages/EntityTagList.vue')
// import EntityTagForm from '@/views/pages/EntityTagForm.vue';
const EntityTagForm = () =>
	import('@/views/pages/EntityTagForm.vue')
// import KnowledgeBase from '@/views/pages/KnowledgeBase.vue';
const KnowledgeBase = () =>
	import('@/views/pages/KnowledgeBase.vue')
// import KnowledgeBaseForm from '@/views/pages/KnowledgeBaseForm';
const KnowledgeBaseForm = () =>
	import('@/views/pages/KnowledgeBaseForm.vue')
// import NotFound from "@/views/pages/NotFound.vue";
const NotFound = () =>
	import('@/views/pages/NotFound.vue')

// import DialogFlowList from "@/dialogflow/pages/DialogFlowList.vue";
const DialogFlowList = () =>
	import('@/dialogflow/pages/DialogFlowList.vue')
// import Editor from "@/dialogflow/pages/Editor.vue";
const Editor = () =>
	import('@/dialogflow/pages/Editor.vue')
const FormViewer = () =>
	import ('@/idp/pages/FormViewer.vue')
const ActivityLogger = () =>
	import ('@/idp/pages/ActivityLogger.vue')
const WorkflowHistory = () =>
	import ('@/idp/components/idpWorkflowHistory.vue')
const CustomerBankAccounts = () =>
	import ('@/payments/pages/CustomerBankAccounts.vue')
const AutoPublishReport = () =>
	import ('@/idp/pages/AutoPublishReport.vue')	
const KsModelConfigList = () =>
	import('@/views/pages/KsModelConfigList.vue')
const KsModelConfigForm = () =>
	import('@/views/pages/KsModelConfigForm.vue')
const NotificationProcessorList = () =>
	import('@/views/pages/NotificationProcessorList.vue')
const NotificationProcessorForm = () =>
	import('@/views/pages/NotificationProcessorForm.vue')
const TrnConfigurationList = () =>
	import('@/views/pages/TrnConfigurationList.vue')
const TrnConfigurationForm = () =>
	import('@/views/pages/TrnConfigurationForm.vue')
const TrnCustomerModelMapList = () =>
	import('@/views/pages/TrnCustomerModelMapList.vue')
const TrnCustomerModelMapForm = () =>
	import('@/views/pages/TrnCustomerModelMapForm.vue')
const OauthClientList = () =>
	import('@/views/pages/OauthClientList.vue')
const OauthClientForm = () =>
	import('@/views/pages/OauthClientForm.vue')
const KttTrainMethodConfigList = () =>
	import('@/views/pages/KttTrainMethodConfigList.vue')
const KttTrainMethodConfigForm = () =>
	import('@/views/pages/KttTrainMethodConfigForm.vue')
const EmailTemplateList = () =>
	import('@/idp/pages/EmailTemplateList.vue')
const EmailTemplateForm = () =>
	import('@/idp/pages/EmailTemplateForm.vue')
const HelpVideoList = () =>
	import('@/views/pages/HelpVideoList.vue')
const HelpVideoForm = () =>
	import('@/views/pages/HelpVideoForm.vue')
const PermissionList = () =>
	import('@/views/pages/PermissionList.vue')
const PermissionForm = () =>
	import('@/views/pages/PermissionForm.vue')
const KsTrnStatusList = () =>
	import('@/views/pages/KsTrnStatusList.vue')
const BannerList = () =>
	import('@/views/pages/BannerList.vue')
const BannerForm = () =>
	import('@/views/pages/BannerForm.vue')
const PushNotificationList = () =>
	import('@/views/pages/PushNotificationList.vue')
const ConfigurationList = () =>
	import('@/views/pages/ConfigurationList.vue')
const UserPreferenceList = () =>
	import('@/views/pages/UserPreferenceList.vue')
const UserPreferenceForm = () =>
	import('@/views/pages/UserPreferenceForm.vue')
const KttTemplateList = () =>
	import('@/views/pages/KttTemplateList.vue')
const KttTemplateForm = () =>
	import('@/views/pages/KttTemplateForm.vue')

const ServiceLog = () =>
	import('@/views/pages/ServiceLog.vue')

const QnAList = () => import('@/views/pages/QnAList.vue')
const DAConfiguration = () => import('@/views/pages/DAConfiguration.vue')
const FieldConfiguration = () => import('@/doc-ex/pages/FieldConfig.vue')
const CustomerOnboarding = () =>
	import('@/views/pages/CustomerOnboarding.vue')

const PaymentHistory = () =>
	import('@/views/pages/PaymentHistory.vue')


const Structure = () =>
	import('@/views/NewPages/Structure.vue')
const BasicForm = () =>
	import('@/views/NewPages/BasicForm.vue')
const DigitalAssistantList = () =>
	import('@/views/pages/DigitalAssistantList.vue')
const ScriptLogList = () =>
	import('@/views/pages/ScriptLogList.vue')

const KbTransactionLog = () =>
	import('@/views/pages/KbTransactionLog.vue')

const IntentInfoList = () =>
	import('@/views/pages/IntentInfoList.vue')
const IntentInfoForm = () =>
	import('@/views/pages/IntentInfoForm.vue')

const KsModelVersion = () =>
	import('@/views/pages/KsModelVersion.vue')

const SubscriptionList = () =>
	import('@/views/pages/SubscriptionList.vue')

const CpUserForm = () =>
	import('@/views/pages/CpUserForm.vue')

const InputChannels = () =>
	import('@/idp/pages/InputChannelList.vue')
const DocumentViewer = () =>
	import('@/idp/pages/DocumentViewer.vue')

const Viewer = () =>
	import('@/idp/pages/Viewer.vue')

const ExcelViewer = () =>
	import('@/idp/pages/ExcelViewer.vue')
const InputChannelForm = () =>
	import('@/idp/pages/InputChannelForm.vue')
const NotificationRuleList = () =>
	import('@/idp/pages/NotificationRuleList.vue')
const NotificationRuleForm = () =>
	import('@/idp/pages/NotificationRuleForm.vue')
const PaymentCards = () =>
import('@/idp/pages/PaymentCards.vue')
const DocumentFields = () =>
	import('@/doc-ex/pages/DocumentFields.vue')
const DocumentAssignmentRuleList = () =>
	import('@/idp/pages/DocumentAssignmentRuleList.vue')
const DocumentAssignmentRuleForm = () =>
	import('@/idp/pages/DocumentAssignmentRuleForm.vue')
const UserGroupForm = () =>
	import('@/idp/pages/UserGroupForm.vue')
const UserGroupList = () =>
	import('@/idp/pages/UserGroupList.vue')

import Approval from "../../public/views/pages/Approval.vue";
import OTP from "../../public/views/pages/Otp.vue";
const BusinessRuleForm = () =>
	import('@/idp/pages/BusinessRuleForm.vue')
const RunHistoryList = () =>
	import('@/idp/pages/RunHistoryList.vue')
const DocumentScriptList = () =>
	import('@/idp/pages/DocumentScriptList.vue')
const UIEventScriptList = () =>
	import('@/idp/pages/UIEventScriptList.vue')
const DocumentScriptForm = () =>
	import('@/idp/pages/DocumentScriptForm.vue')
const UIEventScriptForm = () =>
	import('@/idp/pages/UIEventScriptForm.vue')
const ResourcePermissionList=()=>
	import('@/idp/pages/ResourcePermissionList.vue')

const ResourcePermissionForm=()=>
	import('@/idp/pages/ResourcePermissionForm.vue')
const IDPUserList = () =>
	import('@/idp/pages/UserList.vue')
const IDPVendorsList = () =>
	import('@/idp/pages/VendorsList.vue')
const IDPVendorDetail = () =>
	import('@/idp/pages/VendorDetail.vue')
const IDPVendorSiteDetail = () =>
	import('@/idp/pages/VendorSiteDetail.vue')
const AllCustomerList = () =>
	import('@/idp/pages/CustomerList.vue')
const AllCustomerForm = () =>
	import('@/idp/pages/CustomerForm.vue')

const IDPUserForm = () =>
	import('@/idp/pages/UserForm.vue')

const IDPVendorForm = () =>
	import('@/idp/pages/VendorForm.vue')

const IDPVendorUserForm = () =>
	import('@/idp/pages/VendorUserForm.vue')

const BusinessRuleList = () =>
	import('@/idp/pages/BusinessRuleList.vue')

const BusinessRuleLibrary = () =>
	import('@/idp/pages/BusinessRuleLibrary.vue')

const DomainVendorMapList = () =>
	import('@/idp/pages/DomainVendorMapList.vue')

const PromptForm = () =>
	import('@/idp/pages/PromptForm.vue')
const PromptList = () =>
	import('@/idp/pages/PromptList.vue')

const RolesList = () =>
	import('@/idp/pages/RolesList.vue')
const RolesForm = () =>
	import('@/idp/pages/RolesForm.vue')
const OrgHierarchy = () =>
	import('@/idp/pages/OrgHierarchy.vue')

const IdpDialogFlowList = () =>
	import('@/idp/pages/DialogFlowList.vue')

import layouts from "@/layout";

import store from "@/store/store";

const IdpDashboard = () =>
	import('@/idp/main/dashboard.vue')

const analyticsDashboard = () =>
	import('@/idp/main/analyticsDashboard.vue')
const fraudDashboard = () =>
	import('@/idp/main/fraudDashboard.vue')

const IdpAdminDashboard = () =>
	import('@/idp/main/idpAdminDashboard.vue')


const DocumentSetup = () =>
	import('@/idp/pages/DocumentSetup.vue')
const VendorDocumentSetup = () =>
	import('@/idp/pages/VendorDocumentSetup.vue')
const PermissionsList = () =>
	import('@/idp/pages/PermissionList.vue')
const PermissionsForm = () =>
	import('@/idp/pages/CpPermissionForm.vue')

const BusinessRuleFieldMapList = () =>
	import('@/idp/pages/BusinessRuleFieldMapList.vue')
const BusinessRuleFieldMapForm = () =>
	import('@/idp/pages/BusinessRuleFieldMapForm.vue')
const CpMenuList = () =>
	import('@/idp/pages/MenuList.vue')
const DocumentSetupList = () =>
	import('@/idp/pages/DocumentSetupList.vue')

const AddBankAccount = () =>
	import('@/payments/components/AddBankAccount.vue')
const VerifyBankAccount = () =>
	import('@/payments/components/VerifyBankAccount.vue')

const VendorDocumentSetupList = () =>
	import('@/idp/pages/VendorDocumentSetupList.vue')
const BillingForm = () =>
	import('@/idp/pages/BillingForm.vue')
const PolicyForm = () =>
	import('@/idp/pages/PolicyForm.vue')
const BillingList = () =>
	import('@/idp/pages/BillingList.vue')
const RejectReasonsList = () =>
	import('@/idp/pages/RejectReasonsList.vue')
const WebhookList = () =>
	import('@/idp/pages/WebhookList.vue')

const WebhookForm = () =>
	import('@/idp/pages/WebhookForm.vue')
const PolicyList = () =>
	import('@/idp/pages/PolicyList.vue')

const FieldConfigForm = () =>
	import('@/idp/pages/FieldConfigForm.vue');
const FieldConfigList = () =>
	import('@/idp/pages/FieldConfigList.vue');

const idpNerList = () =>
	import('@/idp/pages/NerList.vue')
const idpNerForm = () =>
	import('@/idp/pages/NerForm.vue')

const IdpInvoiceList = () =>
	import('@/idp/pages/idpInvoiceList.vue')

const IdpDocumentList = () =>
	import('@/idp/pages/idpDocumentList.vue')

const IdpPackageList = () =>
	import('@/idp/pages/idpPackageList.vue')

const IdpVendorDocumentList = () =>
	import('@/idp/pages/idpVendorDocumentList.vue')
const IdpAllDocumentsList = () =>
	import('@/idp/pages/idpAllDocuments.vue')

const IdpInsuranceList = () =>
	import('@/idp/pages/IdpInsuranceList.vue')

const EmailListView = () =>
	import('@/idp/pages/EmailListView.vue')

const IdpOtherList = () =>
	import('@/idp/pages/idpOtherList.vue')

const IdpDownloadDocument = () =>
	import('@/idp/pages/idpDownloadDocument.vue')
Vue.use(Router);

const CustomerSystemsList = () =>
	import('@/idp/pages/CustomerSystemsList.vue');

const CustomerSystemsForm = () =>
	import('@/idp/components/CustomerSystemsForm.vue')

const StorageList = () =>
	import('@/idp/pages/StorageList.vue');

const StorageForm = () =>
	import('@/idp/pages/StorageForm.vue')

const LookupConfigList = () =>
	import('@/idp/pages/LookupConfigList.vue')

const LookupConfigForm = () =>
	import('@/idp/pages/LookupConfigForm.vue')

const DEScriptList = () =>
	import('@/idp/pages/ScriptList.vue')
const DEScriptForm = () =>
	import('@/idp/pages/ScriptForm.vue')
const ErrorCodeList = () =>
	import('@/idp/pages/ErrorCodeList.vue')
const ErrorAnalyticsList = () =>
	import('@/idp/pages/ErrorAnalyticsList.vue')
const ErrorCodeForm = () =>
	import('@/idp/pages/ErrorCodeForm.vue')
const TrainRequestList = () =>
	import('@/idp/pages/TrainRequestList.vue')
const IDPTrainRequestForm = () =>
	import('@/idp/pages/TrainRequestForm.vue')
const SchedularList = () =>
	import('@/idp/pages/SchedularList.vue')
const customerConfiguration = () =>
	import('@/idp/pages/customerConfiguration.vue')	
const DbCluster = () =>
	import('@/idp/pages/DbCluster.vue')
const SchedularForm = () =>
	import('@/idp/pages/SchedularForm.vue')
const DbClusterForm = () =>
	import('@/idp/pages/DbClusterForm.vue')
const ActionConfigForm = () =>
	import('@/idp/pages/ActionConfigForm.vue')
const ActionButtonList = () =>
	import('@/idp/pages/ActionButtonList.vue') 

const RequestConfigForm = () =>
	import('@/idp/pages/RequestConfigForm.vue')
const RequestFormList = () =>
	import('@/idp/pages/RequestFormList.vue') 

const EmailsList = () =>
	import('@/idp/pages/EmailsList.vue')
const EmailForm = () =>
	import('@/idp/pages/EmailsForm.vue')
const BucketForm = () =>
	import('@/idp/pages/BucketForm.vue')
const BucketList = () =>
	import('@/idp/pages/BucketList.vue')
const ModelDiscovery = () =>
	import('@/idp/pages/ModelDiscovery.vue')
const NoAccess = () =>
	import('@/idp/pages/NoAccess.vue')
const HelpMenuPage = () =>
import('@/idp/pages/HelpMenuPage.vue')

const IdpWorkflowInstance = () =>
import('@/idp/pages/WorkflowInstance.vue')

const MenuList = () =>
import('@/idp/pages/MenuList.vue')

const MenuForm=()=>
import('@/idp/pages/MenuForm.vue')

const InvoiceDashboard = () =>
	import('@/idp/main/InvoiceDashboard.vue');

const InsuranceQuotationDashboard = () =>
	import('@/idp/main/InsuranceQuotationDashboard.vue');

const PODashboard = () =>
	import('@/idp/main/PODashboard.vue');

const InsuranceDashboard = () =>
	import('@/idp/main/InsuranceDashboard.vue');

const SOVDashboard = () =>
	import('@/idp/main/SOVDashboard.vue');

const VendorDashboard = () =>
	import('@/idp/main/VendorDashboard.vue')

	const IdpKsModel = () =>
import('@/idp/pages/KsModel.vue')

 const IdpKsModelForm = () =>
import('@/idp/pages/KsModelForm.vue')
const UiSetupList = () =>
	import('@/idp/pages/UiSetupList.vue')
const UiSetupForm = () =>
	import('@/idp/pages/UiSetupForm.vue')

const RecommendationList = () =>
	import('@/idp/pages/RecommendationList.vue')

const RecommendationForm = () =>
import('@/idp/pages/RecommendationForm.vue')

const RoleTabAccessForm = () =>
	import('@/idp/pages/RoleTabAccessForm.vue')

const RoleFieldAccessForm = () =>
	import('@/idp/pages/RoleFieldAccessForm.vue')
	
const CustomerSubscriptionList = () =>
	import('@/idp/pages/SubscriptionList.vue')

const CustomerSubscriptionForm = () =>
	import('@/idp/pages/SubscriptionForm.vue')

const SSOConfigurationList = () =>
	import('@/idp/pages/SSOConfigList.vue')
const SSOConfigurationForm = () =>
	import('@/idp/pages/SSOConfigForm.vue')

const AutoCorrectForm = () =>
	import('@/idp/pages/AutoCorrectForm.vue')
const AutoCorrectList = () =>
	import('@/idp/pages/AutoCorrectList.vue')

const FormList = () =>
	import('@/idp/pages/FormList.vue')
const FormBuilder = () =>
	import('@/idp/pages/FormBuilder.vue') 
const SetupForm = () =>
	import('@/idp/components/SetupForm.vue')
const LLMSetupList = () => import('@/idp/pages/LLMSetupList.vue');
const LLMSetupForm = () => import('@/idp/pages/LLMSetupForm.vue');

const TestCaseForm = () =>
	import('@/idp/pages/TestCaseForm.vue')
Vue.use(Router);

import UserService from "@/services/UserService";
import layout from "../layout";




const router = new Router({
	mode: "history",
	base: "/app",
	routes: [
		{
			path: "/idp/other-documents",
			alias: "/idp/other-documents",
			name: "idp_other_list",
			component: IdpOtherList,
			meta: {
			}
		},
		{
			path: "/idp/download-document",
			alias: "/idp/download-document",
			name: "idp_download_document",
			component: IdpDownloadDocument,
			meta: {
			}
		},
		{
			path: "/idp/all-document-list",
			alias: "/idp/all-document-list",
			name: "idp_all_docs_list",
			component: IdpAllDocumentsList,
			meta: {
				documentType: "all"
			}
		},
		{
			path: "/idp/document/:documentType",
			alias: "/idp/document/:documentType",
			name: "idp_document_list",
			component: IdpDocumentList
		},
		{
			path: "/idp/document/:documentType/email-view",
			alias: "/idp/document/:documentType/email-view",
			name: "email_list_view",
			component: EmailListView
		},
		{
			path: "/idp/package/:documentType",
			alias: "/idp/package/:documentType",
			name: "idp_package_list",
			component: IdpPackageList
		},
		{
			path: "/idp/document/vendor/:documentType",
			alias: "/idp/document/vendor/:documentType",
			name: "idp_vendor_document_list",
			component: IdpVendorDocumentList
		},
		{
			path: "/idp/analytics-dashboard",
			alias: "/idp/analytics-dashboard",
			name: "analytics-dashboard",
			component: analyticsDashboard,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["app"]
			}
		},
		{
			path: "/idp/fraud-dashboard",
			alias: "/idp/fraud-dashboard",
			name: "fraud-dashboard",
			component: fraudDashboard,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["app"]
			}
		},
		{
			path: "/idp/operations-dashboard",
			alias: "/idp/operations-dashboard",
			name: "operations-dashboard",
			component: IdpDashboard,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["app"]
			}
		},
		{
			path: "/idp/invoice-dashboard",
			alias: "/idp/invoice-dashboard",
			name: "InvoiceDashboard",
			component: InvoiceDashboard,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["app"]
			}
		},
		{
			path: "/idp/insurance-quoatation-dashboard",
			alias: "/idp/insurance-quoatation-dashboard",
			name: "InsuranceQuotationDashboard",
			component: InsuranceQuotationDashboard,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["app"]
			}
		},
		{
			path: "/idp/po-dashboard",
			alias: "/idp/po-dashboard",
			name: "PODashboard",
			component: PODashboard,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["app"]
			}
		},
		{
			path: "/idp/insurance-dashboard",
			alias: "/idp/insurance-dashboard",
			name: "InsuranceDashboard",
			component: InsuranceDashboard,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["app"]
			}
		},
		{
			path: "/idp/sov-dashboard",
			alias: "/idp/sov-dashboard",
			name: "SOVDashboard",
			component: SOVDashboard,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["app"]
			}
		},
		{
			path: "/idp/insurance-document-list",
			alias: "/idp/insurance-document-list",
			name: "idp_insurance_list",
			component: IdpInsuranceList,
			meta: {
				documentType: "insurance"
			}
		},
		{
			path: "/idp",
			alias: "/dashboard",
			name: "dashboard",
			component: IdpDashboard,
			meta: {
			},
			beforeEnter(to, from, next) {
				next(UserService.getRouteParamForIdpDashboard());
			}
		},
		{
			path: "/",
			alias: "/dashboard",
			name: "dashboard",
			component: Dashboard,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["app"]
			},
			beforeEnter: (to, from, next) => {
				console.log("in before enter of / or /dashboard alias")
				let routeParam = true;
				let qnaChild = localStorage.getItem("qnaChild");
				let user = store.getters.user;
				if (qnaChild) {
					routeParam = { name: "da-configuration" };
				} else if (user.type == "QNA") {
					routeParam = { name: "qna-dashboard" };
				} else if(_.includes(user.roles, "ap_contributor")){
					next(UserService.routeUserAfterLogin(user));
				}
				else {
					routeParam = UserService.getRouteParamForIdpDashboard();
				}
				next(routeParam);
			}
		},
		{
			path: "/idp-admin-dashboard",
			alias: "/idp-admin-dashboard",
			name: "idp-admin-dashboard",
			component: IdpAdminDashboard,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["app"]
			}
		},
		{
			path: "/login/success",
			name: "login_success",
			meta: {
			},
			beforeEnter: (to, from, next) => {
				console.log("in before enter of login success ")
				UserService.getLoggedInUserInfo()
					.then((user) => {
						console.log("user info in before enter of login success")
						UserService.routeUserAfterLogin(user);
						next();
					}).catch((err) => {
						console.log(err);
						console.error("User not found");
					});

			}
		},
		{
			path: "/",
			alias: "/",
			name: "qna-dashboard",
			component: QNADashboard,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["app"]
			}
		},
		{
			path: "/process-approval",
			name: "approval",
			component: Approval,
			meta: {
				layout: layouts.contenOnly
			}
		},
		{
			path: "/auth/request-form",
			name: "OTP",
			component: OTP,
			meta: {
				layout: layouts.contenOnly
			}
		},
		{
			path: "/subscriptions",
			alias: "subscriptions",
			name: "subscriptions",
			component: SubscriptionList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["app"]
			}
		},
		{
			path: "/commands",
			name: "commands",
			component: Statements,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["app"]
			}
		},
		{
			path: "/invoice",
			name: "invoice",
			component: Invoice,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/field-form",
			name: "field",
			component: FieldConfiguration,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/leads",
			name: "leads",
			component: Leads,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/logout",
			meta: {
				layout: layouts.navLeft
			},
			beforeEnter(to, from, next) {
				auth.logout();
			}
		},
		{
			path: "/customers",
			name: "customers",
			component: CustomersList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				title: "Customers",
				tags: ["ui"]
			}
		},
		{
			path: "/customer-users",
			name: "customers user",
			component: Customers,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				title: "Customer Users",
				tags: ["ui"]
			}
		},
		{
			path: "/idp/field-config-form",
			alias: "/field-config-form",
			name: "FieldConfigForm",
			component: FieldConfigForm,
			meta: {
			}
		},
		{
			path: "/idp/field-configuration",
			alias: "/field-configuration",
			name: "FieldConfigList",
			component: FieldConfigList,
			meta: {
			}
		},
		{
			path: "/user-profile",
			name: "UserProfile",
			component: UserProfile,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/cp-user-form",
			name: "customers user form",
			component: CpUserForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				title: "Customer Users",
				tags: ["ui"]
			}
		},
		{
			path: "*",
			name: "not-found",
			component: NotFound,
			meta: {
				layout: layouts.contenOnly
			}
		},
		{
			path: "/registered-devices",
			name: "registered-devices",
			component: RegisteredDevices,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/service-config-form",
			name: "service-config-form",
			component: ServiceConfigForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/service-config-list",
			name: "service-config-list",
			component: ServiceConfigList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/customer-system-list",
			name: "customer-system-list",
			component: CustomerSystemList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/customer-system-form",
			name: "customer-system-form",
			component: CustomerSystemForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/training-status-list",
			name: "training-status-list",
			component: TrainingStatusList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/master-system-list",
			name: "master-system-list",
			component: MasterSystemList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/master-system-form",
			name: "master-system-form",
			component: MasterSystemForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/customer-list",
			name: "customer-list",
			component: CustomerList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/customer-form",
			name: "customer-form",
			component: CustomerForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/ner-list",
			name: "NER",
			component: NerList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/ner-list",
			name: "New NER",
			component: idpNerList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/ner-form",
			name: "New NER form",
			component: idpNerForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/routing-list",
			name: "Routing",
			component: RoutingDataList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/ner-form",
			name: "Add NER",
			component: NerForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/workflow-list",
			name: "workflow-list",
			component: DialogFlowList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/workflows",
			name: "workflow-list",
			component: IdpDialogFlowList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/workflow",
			name: "workflow",
			component: Editor,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/customer-system-list",
			name: "customer-system-list",
			component: CustomerSystemsList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/customer-system-form",
			name: "customer-systems-form",
			component: CustomerSystemsForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/user-profile",
			name: "UserProfile",
			component: UserProfile,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/qa-test-automation",
			name: "QA Automation",
			component: QAAutomatioForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/test-cases",
			name: "Run history list",
			component: RunHistoryList,
			meta: {
				auth: true,
				layout: layouts.navLeft, 
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/transactions-list",
			name: "Transactions List",
			component: TransactionList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},

		{
			path: "/reported-issues",
			name: "ReportedIssues",
			component: ReportedIssues,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/help-section-list",
			name: "HelpSectionList",
			component: HelpSectionList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/help-section-form",
			name: "HelpSectionform",
			component: HelpSectionForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/suggestions-list",
			name: "SuggestionList",
			component: SuggestionList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/suggestions-form",
			name: "SuggestionsForm",
			component: SuggestionsForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/entities-list",
			name: "EntitiesList",
			component: EntitiesList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/entities-form",
			name: "EntitiesForm",
			component: EntitiesForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/routing-form",
			name: "Routing",
			component: RoutingDataForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/script-list",
			name: "Script",
			component: ScriptList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/script-form",
			name: "Script",
			component: ScriptForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/similarity-check",
			name: "Similarity Check",
			component: SimilarityCheck,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/entity-tag-form",
			name: "Tag form",
			component: EntityTagForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/entity-tag-list",
			name: "entity tag list",
			component: EntityTagList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/knowledge-base",
			name: "knowledge base",
			component: KnowledgeBase,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/knowledge-base-form",
			name: "knowledge base form",
			component: KnowledgeBaseForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/ks-model-config-list",
			name: "ks model config list",
			component: KsModelConfigList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/ks-model-config-form",
			name: "ks model config form",
			component: KsModelConfigForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/notification-processor-list",
			name: "notification processor-list",
			component: NotificationProcessorList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/notification-processor-form",
			name: "notification processor-form",
			component: NotificationProcessorForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/trn-configuration-list",
			name: "trn configuration list",
			component: TrnConfigurationList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/trn-configuration-form",
			name: "trn configuration form",
			component: TrnConfigurationForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/trn-customer-model-map-list",
			name: "trn customer model map list",
			component: TrnCustomerModelMapList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/trn-customer-model-map-form",
			name: "trn customer model map form",
			component: TrnCustomerModelMapForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/schedular-list",
			name: "schedular list",
			component: SchedularList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/customer-configuration",
			name: "customer configuration",
			component: customerConfiguration,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/db_cluster",
			name: "DB Clusters",
			component: DbCluster,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/schedular-form",
			name: "schedular form",
			component: SchedularForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/db-cluster-form",
			name: "DB Cluster form",
			component: DbClusterForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/oauth-client-list",
			name: "oauth client list",
			component: OauthClientList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/oauth-client-form",
			name: "oauth client form",
			component: OauthClientForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/ktt-train-method-config-list",
			name: "ktt train method config list",
			component: KttTrainMethodConfigList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/ktt-train-method-config-form",
			name: "ktt train method config form",
			component: KttTrainMethodConfigForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/email-template-list",
			name: "email template list",
			component: EmailTemplateList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/email-template-form",
			name: "email template form",
			component: EmailTemplateForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/help-video-list",
			name: "help video list",
			component: HelpVideoList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/help-video-form",
			name: "help video form",
			component: HelpVideoForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/menu-list",
			name: "menu list",
			component: MenuList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/menu-form",
			name: "menu form",
			component: MenuForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},

		{
			path: "/intent-info-list",
			name: "intent info list",
			component: IntentInfoList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/intent-info-form",
			name: "intent info form",
			component: IntentInfoForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},

		{
			path: "/permission-list",
			name: "permission list",
			component: PermissionList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/permission-form",
			name: "permission form",
			component: PermissionForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/ks-trn-status-list",
			name: "ks trn status list",
			component: KsTrnStatusList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/banner-list",
			name: "banner list",
			component: BannerList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/banner-form",
			name: "banner form",
			component: BannerForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/push-notification-list",
			name: "push notification list",
			component: PushNotificationList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/configuration-list",
			name: "configuration list",
			component: ConfigurationList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/user-preference-list",
			name: "user preference list",
			component: UserPreferenceList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/user-preference-form",
			name: "user preference form",
			component: UserPreferenceForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/ktt-template-list",
			name: "ktt template list",
			component: KttTemplateList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/ktt-template-form",
			name: "ktt template form",
			component: KttTemplateForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/pending-customers",
			name: "customer-onboarding",
			component: CustomerOnboarding,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				title: "Customer Registration",
				tags: ["ui"]
			}
		},
		{
			path: "/trn-qna-data",
			name: "trn-qna-data",
			component: QnAList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"],
				enableHelp: true
			}
		},
		{
			path: "/da-configuration",
			name: "da-configuration",
			component: DAConfiguration,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"],
				enableHelp: true
			}
		},
		{
			path: "/Structure",
			name: "Structure",
			component: Structure,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/digital-assistant-list",
			name: "digital-assistant-list",
			component: DigitalAssistantList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"],
				enableHelp: true
			}
		},
		{
			path: "/script-log",
			name: "Script Log",
			component: ScriptLogList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/service-log",
			name: "Service Log",
			component: ServiceLog,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/kb-transaction-log",
			name: "Kb Transaction Log",
			component: KbTransactionLog,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/ks_model_version",
			name: "Ks Model Version",
			component: KsModelVersion,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/billing",
			name: "payment history",
			component: PaymentHistory,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				title: "Customers",
				tags: ["ui"]
			}
		},
		{
			path: "/idp/document-view",
			name: "Document view",
			component: Viewer,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path : "/idp/activity-logger",
			name : "ActivityLogger",
			component : ActivityLogger,
		},
		{
			path : "/idp/workflow-execution-history",
			name : "IdpWorkflowHistory",
			component : WorkflowHistory,
		},
		{
			path : "/payments/payment-mode",
			name : "CustomerBankAccounts",
			component : CustomerBankAccounts,
		},
		{
			path : "/idp/auto-publish-report",
			name : "AutoPublishReport",
			component : AutoPublishReport,
		},
		{
			path: "/idp/excel-view",
			name: "Document view",
			component: ExcelViewer,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/script-log",
			name: "Script Log",
			component: ScriptLogList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/document-form",
			name: "Document Configuration",
			component: DocumentConfigForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/documents",
			name: "Setup",
			component: DocumentConfigList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/document-setup",
			name: "Setup",
			component: DocumentSetup,
			meta: {

			}
		},
		{
			path: "/idp/vendor/document-setup",
			name: "VendorSetup",
			component: VendorDocumentSetup,
			meta: {

			}
		},
		{
			path: "/idp/document-setup-list",
			name: "Document config list",
			component: DocumentSetupList,
			meta: {

			}
		},
		{
			path: "/payments/add-bank-account",
			name: "AddBankAccount",
			component: AddBankAccount,
			meta: {

			}
		},
		{
			path: "/idp/vendor/add-bank-account",
			name: "AddBankAccount",
			component: AddBankAccount,
			meta: {

			}
		},
		{
			path: "/payments/verify-bank-account",
			name: "VerifyBankAccount",
			component: VerifyBankAccount,
			meta: {

			}
		},
		{
			path: "/idp/vendor/verify-bank-account",
			name: "VerifyBankAccount",
			component: VerifyBankAccount,
			meta: {

			}
		},
		{
			path: "/idp/vendor/document-setup-list",
			name: "Vendor Document config list",
			component: VendorDocumentSetupList,
			meta: {
			}
		},
		{
			path: "/idp/billing/list",
			name: "Invoice list",
			component: BillingList,
			meta: {

			}
		},
		{
			path: "/idp/reject-reasons",
			name: "Reject reasons",
			component: RejectReasonsList,
			meta: {

			}
		},
		{
			path: "/idp/webhook/list",
			name: "Webhook list",
			component: WebhookList,
			meta: {

			}
		},
		{
			path: "/idp/webhook/add",
			name: "Webhook list",
			component: WebhookForm,
			meta: {

			}
		},
		{
			path: "/idp/webhook/edit",
			name: "Webhook list",
			component: WebhookForm,
			meta: {

			}
		},
		{
			path: "/idp/policy/list",
			name: "Policies",
			component: PolicyList,
			meta: {

			}
		},
		{
			path: "/idp/billing/add",
			name: "New Invoice",
			component: BillingForm,
			meta: {
			}
		},
		{
			path: "/idp/policy-form",
			name: "New Policy",
			component: PolicyForm,
			meta: {
			}
		},
		{
			path: "/idp/input-channels",
			name: "Channel",
			component: InputChannels,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},

		{
			path: "/idp/input-channels-form",
			name: "Channel form",
			component: InputChannelForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/prompt-list",
			name: "Prompt List",
			component: PromptList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/prompt-form",
			name: "Prompt Form",
			component: PromptForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/llm-setup-list",
			name: "LLM List",
			component: LLMSetupList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/llm-setup-form",
			name: "LLM Setup Form",
			component: LLMSetupForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/notification-rules",
			name: "Notification Rules",
			component: NotificationRuleList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/notification-rule-form",
			name: "Notification rule form",
			component: NotificationRuleForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/payment-cards",
			name: "Payment cards",
			component: PaymentCards,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/document-assignment-rules",
			name: "Document assignment Rules",
			component: DocumentAssignmentRuleList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/document-assignment-rule-form",
			name: "Document assignment rule form",
			component: DocumentAssignmentRuleForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/user-groups",
			name: "Document assignment Rules",
			component: UserGroupList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/lookup-config",
			name: "Lookup configuration",
			component: LookupConfigList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/lookup-config-form",
			name: "Lookup configuration",
			component: LookupConfigForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/error-code",
			name: "Error code",
			component: ErrorCodeList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/error-analytics",
			name: "Error analytics",
			component: ErrorAnalyticsList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/error-code-form",
			name: "Error code",
			component: ErrorCodeForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/user-group-form",
			name: "Document assignment rule form",
			component: UserGroupForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/field",
			name: "Document Fields",
			component: DocumentFields,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/business-rules",
			name: "Business Rule",
			component: BusinessRuleList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},	{
			path: "/idp/business-rule-Library",
			name: "Repository",
			component: BusinessRuleLibrary,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/business-rule-form",
			name: "Business Rule",
			component: BusinessRuleForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/test-case-form",
			name: "Test case form",
			component: TestCaseForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/domain-vendor-map",
			name: "Vendor domain",
			component: DomainVendorMapList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		
		{
			path: "/idp/roles",
			name: "Roles",
			component: RolesList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},

		{
			path: "/idp/roles-form",
			name: "Vendor domain",
			component: RolesForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/recommendations",
			name: "Recommendations",
			component: RecommendationList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/recommendations-form",
			name: "Recommendations",
			component: RecommendationForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/role-tab-access-form",
			name: "RoleTabAccessForm",
			component: RoleTabAccessForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/subscription-list",
			name: "CustomerSubscriptionList",
			component: CustomerSubscriptionList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/subscription-form",
			name: "CustomerSubscriptionForm",
			component: CustomerSubscriptionForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},

		{
			path: "/idp/org/hierarchy",
			name: "Organization Hierarchy",
			component: OrgHierarchy,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/document-script",
			name: "Document Script",
			component: DocumentScriptList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/ui-event-script",
			name: "UI Event Script",
			component: UIEventScriptList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},

		{
			path: "/idp/document-script-form",
			name: "Document Script",
			component: DocumentScriptForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/ui-event-script-form",
			name: "Document Script",
			component: UIEventScriptForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/users",
			name: "Users list",
			component: IDPUserList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/request-form",
			name: "Request form list",
			component: RequestFormList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/request-config-form",
			name: "Request form",
			component: RequestConfigForm, 
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/vendor/list",
			name: "Vendors list",
			component: IDPVendorsList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/vendor/detail",
			name: "Vendor Detail",
			component: IDPVendorDetail,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/vendor/vendor-site-detail",
			name: "Vendor Site Detail",
			component: IDPVendorSiteDetail,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/customer-list",
			name: "Customer list",
			component: AllCustomerList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/customerform",
			name: "Customer Form",
			component: AllCustomerForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/permission-list",
			name: "permission list",
			component: PermissionsList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/permission-form",
			name: "permission form",
			component: PermissionsForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/business-rule-field-map-list",
			name: "permission form",
			component: BusinessRuleFieldMapList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/business-rule-field-map-form",
			name: "permission form",
			component: BusinessRuleFieldMapForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path:"/idp/menu_lists",
			name:"Menu",
			component: CpMenuList,
			meta:{
				auth:true,
				layout:layout.navLeft,
				searchable:true,
				tags:["pages"]
			}

		},
		{
			path:"/idp/menu_form",
			name:"Menu Form",
			component:MenuForm,
			meta:{
				auth:true,
				layout:layout.navLeft,
				searchable:true,
				tags:["pages"]
			}
		},
		{
			path: "/idp/user-form",
			name: "User Form",
			component: IDPUserForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/vendor/vendor-form",
			name: "Vendor Form",
			component: IDPVendorForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/vendor/user-form",
			name: "Vendor User Form",
			component: IDPVendorUserForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/document-debug-view",
			name: "DocumentDebugView",
			component: DocumentDebugView,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},

		{
			path: "/idp/customer-storage",
			name: "StorageList",
			component: StorageList

		},
		{
			path: "/idp/storage-form",
			name: "StorageForm",
			component: StorageForm
		},
		{
			path: "/idp/script",
			name: "Script",
			component: DEScriptList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/script-form",
			name: "Script",
			component: DEScriptForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/train-requests",
			name: "Error analytics",
			component: TrainRequestList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/train-request-form",
			name: "Train Request Form",
			component: IDPTrainRequestForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/action-button-config-form",
			name: "Action button",
			component: ActionConfigForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/buttons",
			name: "Buttons",
			component: ActionButtonList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/emails-list",
			name: "Email list",
			component: EmailsList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/email-form",
			name: "email form",
			component: EmailForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/bucket-list",
			name: "Bucket",
			component: BucketList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},

		{
			path: "/idp/bucket-form",
			name: "Channel form",
			component: BucketForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/model-discovery",
			name: "Model Discovery",
			component: ModelDiscovery,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/limited-access-:afterUser(.*)",
			name: "limited-access",
			component: NoAccess,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/vendor-dashboard",
			name: "vendor-dashboard",
			component: VendorDashboard,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/no-access-dashboard",
			name: "no-access-dashboard",
			component: NoAccess,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/try-it-register",
			name: "try-it-register",
			component: IdpInvoiceList,
			meta: {
				layout: layouts.contenOnly
			},
			beforeEnter(to, from, next) {
				next(UserService.getRouteParamForTryItUser("try-it-register"));
			}
		},
		{
			path: "/try-it-otp",
			name: "try-it-otp",
			component: IdpInvoiceList,
			meta: {
				layout: layouts.contenOnly
			},
			beforeEnter(to, from, next) {
				next(UserService.getRouteParamForTryItUser("try-it-otp"));
			}
		},
		{
			path: "/idp/help-page",
			name: "Help Page",
			component: HelpMenuPage,
			meta: {
					}
		},
		{
			path: "/idp/resource-permission-list",
			name: "resource-permission-list",
			component: ResourcePermissionList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},

		{
			path: "/idp/resource-permission-form",
			name: "resource-permission-form",
			component: ResourcePermissionForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/workflow-instance-list",
			name: "workflow-instance-list",
			component: IdpWorkflowInstance,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/model",
			name: "ks-model",
			component: IdpKsModel,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/model-form",
			name: "ks-model",
			component: IdpKsModelForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/ui-setup",
			name: "UI Setup",
			component: UiSetupList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/ui-setup-form",
			name: "UI Setup",
			component: UiSetupForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/form-view",
			name: "FormViewer",
			component: FormViewer
		},
		{
			path: "/idp/role-field-access-form",
			name: "Role Field Access",
			component: RoleFieldAccessForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/form-list",
			name: "Form List",
			component: FormList,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
        {
			path: "/idp/form-builder",
			name: "Form Builder",
			component: FormBuilder,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/auto-correct-form",
			name: "Auto Correct Form",
			component: AutoCorrectForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/auto-correct-list",
			name: "Auto Correct List",
			component: AutoCorrectList
		},
		{
			path: "/idp/sso-config-form",
			name: "SSO Config form",
			component: SSOConfigurationForm,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				tags: ["pages"]
			}
		},
		{
			path: "/idp/sso-config-list",
			name: "SSO Config List",
			component: SSOConfigurationList,
		},
		{
			path: "/idp/setup-form",
			name: "Setup Form",
			component: SetupForm
		},

	]
});


const l = {
	contenOnly() {
		store.commit("setLayout", layouts.contenOnly);
	},
	navLeft() {
		store.commit("setLayout", layouts.navLeft);
	},
	navRight() {
		store.commit("setLayout", layouts.navRight);
	},
	navTop() {
		store.commit("setLayout", layouts.navTop);
	},
	navBottom() {
		store.commit("setLayout", layouts.navBottom);
	},
	set(layout) {
		store.commit("setLayout", layout);
	}
};

//insert here login logic
const auth = {
	loggedIn() {
		return store.getters.isLogged;
	},
	logout() {
		store.commit("setLogout");
		window.location.replace("/logout");
	}
};

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    if (err && err.name !== 'NavigationDuplicated') throw err
  });
}

let loading;
router.beforeEach((to, from, next) => {
	loading = Loading.service({
		lock: true,
		background: 'rgba(237, 242, 247)'
	});
	let authrequired = false;
	if (to && to.meta && to.meta.auth)
		authrequired = true;
	if (authrequired && !auth.loggedIn()) {
		if (to.name !== "login") {
			window.location.href = "/login";
			return false;
		}
		next();
	}
	if (auth.loggedIn()) {
		if (to.name === "login") {
			window.location.href = "/";
			return false;
		}
		else {
			next();
		}
	}
	if (to && to.meta && to.meta.layout) {
		l.set(to.meta.layout);
	}
});

router.afterEach((to, from) => {
	loading.close();
	store.commit("setSplashScreen", false);
});

export default router;
