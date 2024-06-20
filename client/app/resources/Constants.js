let constants = {};
import _ from "lodash";

constants.append = (items, prefix) => {
	_.forEach(items, (item) => {
		let name = item.toUpperCase();
		if (prefix)
			name = prefix + "_" + name;
		constants[name] = item;
	});
};
constants.MODEL_STORE_ACCOUNT_NAME = process.env.MODEL_STORE_ACCOUNT_NAME || 'kanversemodelstorage';
constants.MODEL_STORE_ACCOUNT_KEY = process.env.MODEL_STORE_ACCOUNT_KEY;
constants.SERVER_ENV = process.env.SERVER_ENV
constants.PORTAL_APP_INSIGHTS_INSTRU_KEY = process.env.PORTAL_APP_INSIGHTS_INSTRU_KEY
constants.FRESHDESK_URL = "https://kanverse-org.myfreshworks.com/login/auth/1636523644698?client_id=451980303908285122&redirect_uri=https%3A%2F%2Fkansupport.freshdesk.com%2Ffreshid%2Fcustomer_authorize_callback%3Fhd%3Dsupport.kanverse.ai"
constants.append([
	"REST",
	"SOAP"
], "SERVICE_CONFIG_REQUEST_TYPE");
constants.DOMAINS = {
	"ERP-INV_DATA_EXTRACTION": "ERP-INV_DATA_EXTRACTION",
	"ERP-INV_TABLE_DATA_EXTRACTION": "ERP-INV_TABLE_DATA_EXTRACTION",
	"ITSM-FreshService": "ITSM-FreshService",
	"ITSM-SNOW": "ITSM-SNOW",
	"CRM-SFDC": "CRM-SFDC",
	"GREETING": "GREETING",
	"HR-Policies": "HR-Policies",
	"CHAT-LEADGEN": "CHAT-LEADGEN",
	"AGILE-JIRA": "AGILE-JIRA",
	"AGILE-CONFLUENCE": "AGILE-CONFLUENCE",
	"OFFICE-OFFICE365": "OFFICE-OFFICE365",
	"AGILE-BITBUCKET": "AGILE-BITBUCKET",
	"ERP-ORACLE": "ERP-ORACLE",
	"ERP-JOSS": "ERP-JOSS",
	"AGILE-BAMBOO": "AGILE-BAMBOO",
	"AUTOMATION-FreshService": "AUTOMATION-FreshService",
	"QNA-SALES": "QNA-SALES",
	"WEBQNA-FAQ": "WEBQNA-FAQ",
	"ERP-NETSUITE": "ERP-NETSUITE",
	"WA-WF": "WA-WF",
	"WA-QNA": "WA-QNA",
	"KB_COMMON-NER": "KB_COMMON-NER",
	"OTHER": "OTHER"

},
constants.IDP_TRAINING_DOMAIN=[
	"ERP-INV_DATA_EXTRACTION",
	"ERP-INV_TABLE_DATA_EXTRACTION",
	"ERP-PO_DATA_EXTRACTION",
	"ERP-PO_TABLE_DATA_EXTRACTION",
	"ERP-QUOTE_DATA_EXTRACTION",
	"ERP-QUOTE_TABLE_DATA_EXTRACTION"
],

constants.TRANING_MODEL_TYPES = {
		"NER_MODEL_TYPE": "NER",
		"ROUTER_MODEL_TYPE": "ROUTER",
		"QNA_MODEL_TYPE": "QNA"
	};

constants.LANGUAGES = [
	{
		label: "Afrikaans",
		value: "af",
	},
	{
		label: "Arabic",
		value: "ar",
	},
	{
		label: "Assamese",
		value: "as",
	},
	{
		label: "Bangla",
		value: "bn",
	},
	{
		label: "Bosnian(Latin)",
		value: "bs",
	},
	{
		label: "Bulgarian",
		value: "bg",
	},
	{
		label: "Cantonese(Traditional)",
		value: "yue",
	},
	{
		label: "Catalan",
		value: "ca",
	},
	{
		label: "ChineseSimplified",
		value: "zh-Hans",
	},
	{
		label: "ChineseTraditional",
		value: "zh-Hant",
	},
	{
		label: "Croatian",
		value: "hr",
	},
	{
		label: "Czech",
		value: "cs",
	},
	{
		label: "Dari",
		value: "prs",
	},
	{
		label: "Danish",
		value: "da",
	},
	{
		label: "Dutch",
		value: "nl",
	},
	{
		label: "English",
		value: "en",
	},
	{
		label: "Estonian",
		value: "et",
	},
	{
		label: "Fijian",
		value: "fj",
	},
	{
		label: "Filipino",
		value: "fil",
	},
	{
		label: "Finnish",
		value: "fi",
	},
	{
		label: "French",
		value: "fr",
	},
	{
		label: "French(Canada)",
		value: "fr-ca",
	},
	{
		label: "German",
		value: "de",
	},
	{
		label: "Greek",
		value: "el",
	},
	{
		label: "Gujarati",
		value: "gu",
	},
	{
		label: "HaitianCreole",
		value: "ht",
	},
	{
		label: "Hebrew",
		value: "he",
	},
	{
		label: "Hindi",
		value: "hi",
	},
	{
		label: "HmongDaw",
		value: "mww",
	},
	{
		label: "Hungarian",
		value: "hu",
	},
	{
		label: "Icelandic",
		value: "is",
	},
	{
		label: "Indonesian",
		value: "id",
	},
	{
		label: "Irish",
		value: "ga",
	},
	{
		label: "Italian",
		value: "it",
	},
	{
		label: "Japanese",
		value: "ja",
	},
	{
		label: "Kannada",
		value: "kn",
	},
	{
		label: "Kazakh",
		value: "kk",
	},
	{
		label: "Klingon",
		value: "tlh-Latn",
	},
	{
		label: "Klingon(plqaD)",
		value: "tlh-Piqd",
	},
	{
		label: "Korean",
		value: "ko",
	},
	{
		label: "Kurdish(Central)",
		value: "ku",
	},
	{
		label: "Kurdish(Northern)",
		value: "kmr",
	},
	{
		label: "Latvian",
		value: "lv",
	},
	{
		label: "Lithuanian",
		value: "lt",
	},
	{
		label: "Malagasy",
		value: "mg",
	},
	{
		label: "Malay",
		value: "ms",
	},
	{
		label: "Malayalam",
		value: "ml",
	},
	{
		label: "Maltese",
		value: "mt",
	},
	{
		label: "Maori",
		value: "mi",
	},
	{
		label: "Marathi",
		value: "mr",
	},
	{
		label: "Norwegian",
		value: "nb",
	},
	{
		label: "Odia",
		value: "or",
	},
	{
		label: "Pashto",
		value: "ps",
	},
	{
		label: "Persian",
		value: "fa",
	},
	{
		label: "Polish",
		value: "pl",
	},
	{
		label: "Portuguese(Brazil)",
		value: "pt-br",
	},
	{
		label: "Portuguese(Portugal)",
		value: "pt-pt",
	},
	{
		label: "Punjabi",
		value: "pa",
	},
	{
		label: "QueretaroOtomi",
		value: "otq",
	},
	{
		label: "Romanian",
		value: "ro",
	},
	{
		label: "Russian",
		value: "ru",
	},
	{
		label: "Samoan",
		value: "sm",
	},
	{
		label: "Serbian(Cyrillic)",
		value: "sr-Cyrl",
	},
	{
		label: "Serbian(Latin)",
		value: "sr-Latn",
	},
	{
		label: "Slovak",
		value: "sk",
	},
	{
		label: "Slovenian",
		value: "sl",
	},
	{
		label: "Spanish",
		value: "es",
	},
	{
		label: "Swahili",
		value: "sw",
	},
	{
		label: "Swedish",
		value: "sv",
	},
	{
		label: "Tahitian",
		value: "ty",
	},
	{
		label: "Tamil",
		value: "ta",
	},
	{
		label: "Telugu",
		value: "te",
	},
	{
		label: "Thai",
		value: "th",
	},
	{
		label: "Tongan",
		value: "to",
	},
	{
		label: "Turkish",
		value: "tr",
	},
	{
		label: "Ukrainian",
		value: "uk",
	},
	{
		label: "Urdu",
		value: "ur",
	},
	{
		label: "Vietnamese",
		value: "vi",
	},
	{
		label: "Welsh",
		value: "cy",
	},
	{
		label: "YucatecMaya",
		value: "yua",
	},
];

constants.USER_ROLE = {
	"Developer": "Developer",
	"Management": "Management",
	"Quality Assurance": "Quality Assurance"
};
constants.USER_GUIDE_STEPS = {

	"QNA": [{
		target: "[data-v-step=\"1\"]",
		content: "With this you can teach your digital assistants new Q&As.",
		params: {
			placement: "right" // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
		}
	},
	{
		target: "[data-v-step=\"2\"]",
		content: "Using this you can upload Q&As at once.",
		params: {
			placement: "top" // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
		}
	},
	{
		target: "[data-v-step=\"3\"]",
		content: "Using this you can download the Q&As at once.",
		params: {
			placement: "top" // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
		}
	}
	],
	"DA_CONFIGURATION": [{
		target: "[data-v-step=\"1\"]",
		content: "Use configuration panel to adjust what users see on digital assistants"
	},
	{
		target: "[data-v-step=\"2\"]", // We're using document.querySelector() under the hood
		content: "Use suggestion buttons panel, to add fall back or query fail suggestions."
	}
	],
	"DIGITAL_ASSISTANT": [{
		target: "#assistant-button button:first-child", // We're using document.querySelector() under the hood
		content: "<strong>Hey, You can create new digital assistants here.</strong>!"
	},
	{
		target: "[data-v-step=\"1\"]",
		content: "With setup you can configure your newly created digital assistants.",
		params: {
			placement: "left" // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
		}
	},
	{
		target: "[data-v-step=\"2\"]",
		content: "Here you can test your digital assistants learning.",
		params: {
			placement: "left" // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
		}
	},
	{
		target: "[data-v-step=\"3\"]",
		content: "With this you can inject this bot code to your websites.",
		params: {
			placement: "left" // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
		}
	}
	]
};
constants.EXPORT_COLUMNS = {
	"NER": [{
		label: "Command",
		value: "statement",

	},
	{
		label: "Data",
		value: "data",

	},
	{
		label: "Domain",
		value: "domain",

	},
	{
		label: "Active",
		value: "active",

	}
	],
	"QNA": [{
		label: "question",
		value: "question",

	},
	{
		label: "answer",
		value: "answer",

	}
	],

},
	constants.DATATABLE_REQUIRED_FIELD_MSG = "Please enter required fields";
constants.EDITOR_TOOLBAR = [
	["bold", "italic", "underline"], // toggled buttons
	[{
		list: "ordered"
	}, {
		list: "bullet"
	}, {
		list: "check"
	}],
	["link"], // dropdown with defaults from theme
	["image"]
];
constants.WELCOME_MESSAGE = "Hi! I am Ethan, here are some of the things that I can help you with.";
constants.TABLE_VALIDATION_ERROR = "Data validation error!";
constants.TABLE_DATA_SAVE_SUCCESS = "Records saved successfully";
constants.TABLE_DATA_SAVE_ERROR = "Error while saving data!";
constants.RECOMMENDATION_MESSAGE = "I could not find anything in the system for this query. Did you mean?";
constants.CUSTOMER_SYSTEM_API_ENDPOINT = "/portal/api/table/customer_system";
constants.DE_ACTION_ENDPOINT = "/portal/api/table/de_action";
constants.DE_REQUEST_ACTION_ENDPOINT = "/portal/api/table/de_request_form_action";
constants.MASTER_SYSTEM_API_ENDPOINT = "/portal/api/table/master_system";
constants.CUSTOMERS_API_ENDPOINT = "/portal/api/table/customer";
constants.HELPSECTION_API_ENDPOINT = "/portal/api/table/help_query";
constants.SUGGESTIONS_API_ENDPOINT = "/portal/api/table/suggestion";
constants.ENTITIES_API_ENDPOINT = "/portal/api/table/entity";
constants.DOMAIN_API_ENDPOINT = "/portal/api/table/domains";
constants.SCRIPT_API_ENDPOINT = "/portal/api/table/script";
constants.CHECK_SIMILARITY_ENDPOINT = "/portal/api/similarity-check";
constants.LOGIN_CUSTOMER = "login-with-customer";
constants.ENTITY_TAG_LIST_ENDPOINT = "/portal/api/table/entity_tag_list";
constants.KNWOLEDGE_BASE_ENDPOINT = "/portal/api/table/knowledge_base";
constants.KS_MODEL_ENDPOINT = "/portal/api/table/ks_model";
constants.TRN_CONFIGURATION_ENDPOINT = "/portal/api/table/trn_configuration";
constants.NOTIFICATION_PROCESSOR_ENDPOINT = "/portal/api/table/notification_processor";
constants.TRN_CUSTOMER_MODEL_MAP_ENDPOINT = "/portal/api/table/trn_customer_model_map";
constants.KTT_TRAIN_METHOD_CONFIG_ENDPOINT = "/portal/api/table/ktt_train_method_config";
constants.EMAIL_TEMPLATE_ENDPOINT = "/portal/api/table/email_template";
constants.EMAILS_ENDPOINT = "/portal/api/table/emails";
constants.DE_FORM_ENDPOINT ="/portal/api/table/de_form";
constants.SCHEDULAR_ENDPOINT = "/portal/api/table/schedular";
constants.DBCLUSTER_ENDPOINT = "/portal/api/table/db_cluster";
constants.HELP_VIDEO_ENDPOINT = "/portal/api/table/help_video";
constants.OAUTH_CLIENT_ENDPOINT = "/portal/api/table/oauth_client";
constants.RESOURCE_PERMISSION_ENDPOINT = "/portal/api/table/cp_permission";
constants.MENU_ENDPOINT = "/portal/api/table/cp_menu";
constants.BANNER_ENDPOINT = "/portal/api/table/banner";
constants.USER_PREFERENCE_ENDPOINT = "/portal/api/table/user_preference";
constants.KTT_TEMPLATE_ENDPOINT = "/portal/api/table/ktt_template";
constants.KTT_TEMPLATE_FILE_ENDPOINT = "/portal/api/table/ktt_template_storage.files";
constants.CUSTOMER_CONFIGURATION = "/portal/api/table/customer_configuration";
constants.CUSTOMER_ONBOARDING_ENDPOINT = "/portal/api/customer-onboarding";
constants.HOST_ADDRESS_ENDPOINT = "/portal/api/table/host_address";
constants.QNA_API_ENDPOINT = "/portal/api/qna-data";
constants.CP_USER_ENDPOINT = "/portal/api/table/cp_user";
constants.CUSTOMER_REGISTRATION_ENDPOINT = "/portal/api/table/customer_registration";
constants.DE_FIELD_ENDPOINT = "/portal/api/table/de_field";
constants.WORKFLOW_INSTANCE_ENDPOINT = "/portal/api/table/workflow_instance";
constants.CP_ROLE_ENDPOINT = "/portal/api/table/cp_role";
constants.DE_POLICY_ENDPOINT = "/portal/api/table/de_policy";
constants.IDP_CHART_DATA_ENDPOINT = "/portal/api/idp/dashboard/chart"
constants.ERROR_ANALYTICS_CHART_DATA_ENDPOINT = "/portal/api/idp/dashboard/error-analytics"
constants.CUSTOMER_HIERARCHY = "/portal/api/customer-hierarchy";
constants.PAYMENT_PUBLISHABLE_KEY = process.env.PAYMENT_PUBLISHABLE_KEY;
constants.KANVERSE_WEBSITE_HOST = process.env.KANVERSE_WEBSITE_HOST;
constants.DOCUMENT_SCRIPT_ENDPOINT = "/portal/api/table/de_document_script";
constants.REPORT_ISSUE_ENDPOINT = "/portal/api/report-issue";
constants.TRY_IT_REQUEST_DEMO_ENDPOINT = "/portal/api/request-demo";
constants.TRY_IT_RESEND_OTP_ENDPOINT = "/portal/api/resend-otp";
constants.TRY_IT_USER_ID_ENDPOINT = "/portal/api/try-it-user-id";
constants.TRY_IT_REGISTER_USER_ENDPOINT = "/portal/api/try-it-registration";
constants.SAMPLE_DOCS_ENDPOINT = "/portal/api/idp/sample-docs";
constants.SYSTEM_HEALTH_LOG_ENDPOINT = "/portal/api/table/de_system_health_log";
constants.DE_MESSAGE_ENDPOINT = "/portal/api/table/de_message";
constants.DE_DOCUMENT_DEBUG_DATA_ENDPOINT = "/portal/api/table/de_document_debug_data";
constants.SCRIPT_ENDPOINT = "/portal/api/table/script";
constants.KSMODEL_ENDPOINT = "/portal/api/table/ks_model";
constants.KS_SERVER_ENDPOINT = "/portal/api/table/ks_server";
constants.SYSTEM_HEALTH_CHECK_INTERVAL = 300000;
constants.LOOKUP_ENDPOINT = "/api/lookup";
constants.MASTERMODEL_CONFIG_ENDPOINT = "/portal/api/table/master_model_config"; // renamed ks_model as master_model_config
constants.TRN_REQUEST_ENDPOINT = "/portal/api/table/trn_request";
constants.AP_VENDORS_ENDPOINT = "/portal/api/table/ap_vendors";
constants.AP_VENDOR_SITES_ENDPOINT = "/portal/api/table/ap_vendor_sites";
constants.SUBSCRIPTIONS_ENDPOINT = "/portal/api/table/subscriptions";
constants.KAN_MARKETING_WEBSITE = "https://www.kanverse.ai/";
constants.PROMPT_ENDPOINT = "/portal/api/table/prompt";
constants.EXTRACTION_LLM_ENDPOINT = "/portal/api/table/de_extraction_llm";
constants.ROLE_FIELD_ACCESS_ENDPOINT = "/portal/api/table/de_role_access";
constants.TEST_HISTORY_ENDPOINT = "/portal/api/table/test_history";
constants.SCRIPT_LOG_ENDPOINT = "/portal/api/table/script_log";
constants.UNIT_TEST_CASE_FILES_ENDPOINT = "/portal/api/table/de_test_case_files";
constants.TEST_CASE_MENU_ENDPOINT = "/idp/unit-test-cases";
constants.DE_TEST_CASE_ENDPOINT = "/portal/api/table/de_test_case";
constants.TEST_CASE_API_ENDPOINT = "/portal/api/test-cases";
constants.TEST_CASE_HISTORY_ENDPOINT = "/portal/api/table/de_test_history";
constants.DOWNLOAD_TEST_RUN_HISTORY_ENDPOINT = "/api/download-run-history";
constants.TEST_CASE_FORM_ENDPOINT = "/idp/test-case-form";
constants.TF_HOST = "http://tf_serving_container:8501";
constants.KSMODEL_MOVE_MODEL = "/portal/api/move-model";
constants.KSMODEL_DEPLOY_MODEL = "/portal/api/deploy/model";
constants.BILLING = {
	INVOICE_STATUS: {
		DRAFT: "Draft",
		CONFIRMED: "Confirmed", //Store PDF on Azure storage
		ISSUED: "Issued", // Send emails
		PAID: "Paid"
	},
	INVOICE_STATUS_LABEL_MAPPING : {
		"Confirmed": 'Generated',
		"Confirm": 'Generate'
	},
	PRICING: {
		PAGE: "page",
		CLASSIFICATION: "classification",
		STORAGE: "storage"
	},
	INV_STORAGE_DIR: "Billing Invoices"
}
constants.LINE_TABLE = {
	LINE_TABLE_ACTION_EVENTS : {
		DELETE_IDP_ROW : "delete-idp-row",
		CLONE_IDP_ROW : "clone-idp-row",
		ADD_IDP_ROW_ABOVE : "add-idp-row-above",
		ADD_IDP_ROW_BELOW : "add-idp-row-below"
	}
}
constants.GRANT_TYPE_MAP = {
	"AUTHORIZATION_CODE" : "authorization_code",
	"CLIENT_CREDENTIALS" : "client_credentials"
}
constants.GRANT_TYPES_LIST = [
	{
		label: "Authorization Code",
		value: "authorization_code"
	},
	{
		label: "Client Credentials",
		value: "client_credentials"
	},
]
constants.AUTH_TYPE_MAP = {
	"OAUTH2" : "oauth2",
	"BASIC" : "basic",
	"API_KEY" : "api_key",
	"BEARER_TOKEN":"bearer_token",
	"BEARER_TOKEN_USERNAME_PASSWORD" : "bearer_token_username_password"
}
constants.AUTH_TYPES_LIST = [
	/*{
		label: "OAuth1",
		value: "oauth1",
		requiredAttributes: ["consumer_key", "signature_method", "callback_url", "auth_request_token_endpoint", "auth_code_endpoint", "auth_token_endpoint", "secret_key"],
		oauth_version: "1.0"

	},*/
	{
		label: "Oauth2",
		value: "OAUTH2",
		requiredAttributes: ["client_id","secret_key", "callback_url", "auth_token_host", "auth_code_host"],
		oauth_version: "2.0"
	},
	{
		label: "Basic",
		value: "BASIC",
		requiredAttributes: ["endpoint"],
		oauth_version: null
	},
	{
		label: "API key",
		value: "API_KEY",
		requiredAttributes: ["API_KEY"],
		oauth_version: null

	},
	{
		label: "Bearer Token",
		value: "BEARER_TOKEN",
		requiredAttributes: ["consumer_key","token", "consumer_secret", "token_secret"]
	},
	{
		label: "Bearer Token Username & Password",
		value: "BEARER_TOKEN_USERNAME_PASSWORD",
		requiredAttributes: ["username", "password"]
	}
	/*,{
		label: "JWT",
		value: "token_url",
		requiredAttributes: ["token_url"],
		oauth_version: "JWT"

	}*/
];
constants.CUSTOMER_ROLE_MAPPING = [{
	value: "Developer",
	label: "Developer"
}, {
	value: "Manager",
	label: "Manager"
}, {
	value: "Student",
	label: "Student"
}],
constants.DATE_FORMATS = {
	"Do MMM YYYY": "Do MMM YYYY",
	"MMM Do, YYYY": "MMM Do, YYYY",
	"M/D/YYYY": "M/D/YYYY",
	"M/D/YY": "M/D/YY",
	"MMM Do": "MMM Do",
	"MMMM Do": "MMMM Do",
	"Do MMM": "Do MMM",
	"Do MMMM": "Do MMMM",
	"D MMM": "D MMM",
	"D MMMM": "D MMMM"
};
constants.CUSTOMER_TYPE=[{
	value: "IDP",
	label: "IDP"
}, {
	value: "QNR",
	label: "QNR"
}];
constants.attribute_type = {
	"Text": "Text",
	"Number": "Number",
	"Date": "Date",
	"Dropdown": "Dropdown"
};

constants.REQUIRED_ENTITY = {
	ACTION_TYPES: {
		BUTTON: "BUTTONS",
		CALENDER: "CALENDER",
		TEXT: "TEXT",
		DATEPICKER: "DATEPICKER",
		TIMEPICKER: "TIMEPICKER",
		DURATIONPICKER: "DURATIONPICKER",
		SELECT: "SELECT",
		MULTISELECT: "MULTISELECT",
		MAIL: "MAIL",
		DATATABLE: "DATATABLE",
		UPLOAD_ACTIONSHEET: "UPLOAD_ACTIONSHEET",
		CALENDARDATEPICKER: "CALENDARDATEPICKER"
	},
	ACTIONS: [{
		value: "CREATE",
		label: "CREATE"
	},
	{
		value: "UPDATE",
		label: "UPDATE"
	},
	{
		value: "DELETE",
		label: "DELETE"
	},
	{
		value: "GET",
		label: "GET"
	},
	{
		value: "MERGE",
		label: "MERGE"
	},
	{
		value: "COPY",
		label: "COPY"
	},
	{
		value: "APPROVE",
		label: "APPROVE"
	},
	{
		value: "SUBMIT",
		label: "SUBMIT"
	}
	],
	TYPE: [{
		value: "SELECT",
		label: "select"
	},
	{
		value: "TEXT",
		label: "text"
	},
	{
		value: "DATE",
		label: "date"
	},
	{
		value: "TELEPHONE",
		label: "tel"
	},
	{
		value: "EMAIL",
		label: "email"
	}
	],
	OPERATOR: [{
		value: ">",
		label: "greater than"
	},
	{
		value: "<",
		label: "less than"
	},
	{
		value: "==",
		label: "equal to"
	},
	{
		value: "!=",
		label: "not equal to"
	},
	{
		value: ">=",
		label: "greater than equal to"
	},
	{
		value: "<=",
		label: "less than equal to"
	}
	],
};
constants.TEST_CASE_QUERY_BUILDER = {
	ACTIONS: [
		{
			value: "equals",
			label: "Equals"
		},
		{
			value: "does not equal",
			label: "Does not equal"
		},
		{
			value: "contains",
			label: "Contains"
		},
		{
			value: "does not contain",
			label: "Does not contain"
		},
		{
			value: "begins with",
			label: "Begins with"
		},
		{
			value: "ends with",
			label: "Ends with"
		},
		{
			value: ">=",
			label: "Greater Equal (number)"
		},
		{
			value: "<=",
			label: "Lesser Equal (number)"
		},
		{
			value: ">",
			label: "Greater Than (number)"
		},
		{
			value: "<",
			label: "Lesser Than (number)"
		},
		{
			value: "=",
			label: "Equals To (number)"
		}
	],
	FIELD_TYPES: [
		{
			value: "value",
			label: "Value"
		},
		{
			value: "message",
			label: "Message"
		}
	],
	CLASSIFICATION_FIELDS: [
		{
			key : "OTHER",
			value : "OTHER"
		},
		{
			key : "INVOICE",
			value : "INVOICE"
		},
		{
			key : "DEBIT MEMO",
			value : "DEBIT MEMO"
		},
		{
			key : "CREDIT MEMO",
			value : "CREDIT MEMO"
		},
		{
			key : "LOGO",
			value : "LOGO"
		},
		{
			key : "SALES ORDER",
			value : "SALES ORDER"
		},
	]
}

constants.SCRIPT_TYPE = {
	"Predictor": "predictor",
	"Connector": "connector"
};

constants.QNA_CUSTOMER = {
	domain: "WA",
	system: "WF"

};

constants.DE_EXPORTS_OPTIONS = [{
	value: "json",
	label: "JSON"
}, {
	value: "xl",
	label: "Excel"
}, {
	value: "system",
	label: "Systems"
}];

constants.AUTH_TYPES = {
	SAML: "SAML"
}

constants.BULK_DATA_UPLOAD_SUCCESS = "Data uploaded successfully";
constants.BULK_DATA_UPLOAD_ERROR = 'Error while uploading/validating data';
constants.DATA_DELETE_SUCCESS = "Data deleted successfully";
constants.DATA_DELETE_ERROR = 'Error while deleting data';
constants.DATA_DOWNLOAD_ERROR = 'Error while downloading data';
constants.DE_CUSTOMER_CONFIGURATION = "/portal/api/de-customer-configuration";
constants.SYSTEM_CUSTOMER_ID = '5ece6b4b248b6a9d49c829e8';
constants.DOCEX = {
	DOCUMENT_DOWNLOAD_LIMIT: 20,
	DOCUMENT_EMAIL_DOWNLOAD_LIMIT: 2000,
	THEMES:{
		DARK : "dark",
		LIGHT: "light"
	},
	IMAGE_OCR_DIMENSION:{
               width: 2550,
                height: 3300
           },
	DE_DOCUMENT_FIELDS_LIST_VIEW:[
		{
			name: "email.subject",
			label: "Email Subject",
			code : "22",
			order : "22",
			list_view_column_width : "260"
		},
		{
			name: "email.from_email",
			label: "Email Sender",
			code : "23",
			order : "23",
			list_view_column_width : "200"
		},
		{
			name: "email.received_date",
			label: "Email Date",
			code : "24",
			order : "24"
		},
		{
		  label:"Upload Date",
		  name:"created_at",
		  code:"2",
		  type:'date',
		  order:"2"
		},{
		  label:"Uploaded By",
		  name:"created_by",
		   code:"3",
		   order:"3"
		},
		{
		  label:"Assigned Group",
		  name:"assigned_group_name",
		   code:"4",
		   order:"4"
		},
		{
		  label:"Assigned User",
		  name:"assigned_user_name",
		   code:"5",
		   order:"5"
		},
		  {
		  label:"Updated Date",
		  name:"updated_at",
		  code:"6",
		  type:'date',
		  order:"6"
		  },
			{
		  label:"Updated By",
		  name:"updated_by",
		   code:"7",
		   order:"7"
		},
		{
		  label:"Stage",
		  name:"stage",
		   code:"8",
		   order:"8"
		},
		 {
		  label:"Reviewer",
		  name:"reviewed_by",
		   code:"9",
		   order:"9"
		},
		 {
		  label:"Published Date",
		  name:"published_at",
		   code:"10",
		   type:'date',
		   order:"10"
		},
		{
		  label:"Document Subtype",
		  name:"document_subtype",
		   code:"11",
		   order:"11"
		},
		{
		  label:"File Type",
		  name:"file_type",
		   code:"12",
		   order:"12"
		},
		{
		  label:"Approval Status",
		  name:"approval_status",
		   code:"13",
		   order:"13"
		},
		{
		  label:"Approved At",
		  name:"approved_at",
		   code:"14",
		  type:'date',
		  order:"14"
		},
		{
		  label:"Approved By",
		  name:"approved_by",
		   code:"15",
		   order:"15"
		},
		{
		  label:"Rejected By",
		  name:"rejected_by",
		   code:"16",
		   order:"16"
		},
		{
		  label:"Rejected At",
		  name:"rejected_at",
		   code:"17",
		  type:'date',
		  order:"17"
		},
		{
		  label:"Rejection Note",
		  name:"rejection_note",
		   code:"18",
		   order:"18"
		},
		{
		  label:"Extraction Failure Reason",
		  name:"extraction_failure_reason",
		   code:"19",
		   order:"19"
		},
		{
		  label:"Publish Failure Reason",
		  name:"publish_failure_reason",
		   code:"10",
		   order:"20"
		},
		{
		 label:"Published By",
		 name:"published_by",
		  code:"11",
		  order:"21"
	   },
	   {
		label:"Approval Request Sent Date",
		name:"approval_request_sent_date",
		type:'date',
	   },
	   {
		label:"Approval Reminder Status",
		name:"approval_reminder_status"
	   },
	   {
		label:"Approver Level",
		name:"approver_level"
	   }
	],
	OTHER_DOC_TYPES: ['other','logo'],
	DOC_TYPE_ROUTE_MAP: {
		"invoice": "/idp/document/invoice",
		"po": "/idp/document/po",
		"quote": "/idp/document/quote",
		"insurance": "/idp/insurance-document-list"
	},
	EXCEL: {
        STAGE_MAP: {
            "UPLOADED_FAILED": "Extraction failed",
            "UPLOADED_SUCCESS": "Extraction in progress",
            "UPLOADED_EXTRACTED": "Extraction in progress",
            "EXTRACTED_EXTRACTED": "Extraction in progress",
            "EXTRACTED_SUCCESS": "Extracted",
            "EXTRACTED": "Extracted",
			"ERROR": "Error",
            "EXTRACTED_PUBLISH IN PROGRESS": "Publish in progress",
            "EXTRACTED_FAILED": "Publish failed",
            "FRAUD FLAGGED_FAILED": "Publish failed",
            "FRAUD FLAGGED_SUCCESS": "Published",
            "PUBLISHED_SUCCESS": "Published"
        },
		EXCEL_FILE_TYPE:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		PUBLISH_STAGE_STATE_MAP:{
			"EXTRACTED_PUBLISH IN PROGRESS": "Publish in progress",
			"EXTRACTED_FAILED": "Publish failed",
			"PUBLISHED_SUCCESS": "Published"
		},
		FONT_FAMILY: [
			"Segoe UI",
			"Times New Roman",
			"Arial",
			"Tahoma",
			"Verdana",
			"Microsoft Yahei",
			"Song",
			"ST Heiti",
			"ST Kaiti",
			"ST FangSong",
			"ST Song",
			"Chinese New Wei",
			"Chinese Xingkai",
			"Chinese Lishu"
		]
    },
	DOCUMENT_FILETYPES:{
		"EXCEL":"excel",
		"PDF":"pdf",
		"IMAGE":"image",
		"DOC":"doc",
		"HTML":"html",
		"NULL":null,
		"FORM":"form"
	},
	FILE_EXT_MIMETYPE_MAPPING : {
		"pdf":  "application/pdf",
		"zip":  "application/zip",
		"jpg":  "image/jpeg",
		"png":  "image/png",
		"jpeg":  "image/jpeg",
		"tiff":  "image/tiff",
		"tif":  "image/tiff",
		"bmp":  "image/bmp",
		"doc": "application/msword",
		"docx" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"xls" : "application/vnd.ms-excel",
		"xlsm" : "application/vnd.ms-excel.sheet.macroEnabled.12",
		"xlsx":  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		"html":  "text/html"
	},
	TRY_IT: {
		CUSTOMER_ID : '623184bcb03f4ee8373ef3d4'
	},
	IDP_DOCUMENT_CATEGORIES : [{ label: 'Packages', value: 'packages' }, { label: 'Documents', value: 'documents' }],
	IDP_DOCUMENT_CATEGORIES_FILTERS: {
		packages: { type: 'package',  parent_document_id: { $exists: false } },
		documents: { type: { $ne: 'package' }}
	},
	PACKAGE_EXCLUDE_COLUMNS : ["Link dot"],
	ALL_FILE_TYPES: [
		{
			label:"Excel",
			value:"excel",
		},
		{
			label:"PDF",
			value:"pdf",
		},
		{
			label:"Image",
			value:"image",
		},
		{
			label:"Null",
			value:null,
		}
	],
	ALL_LIST_STAGES: [
		{
			label:"Inbox",
			value:"Uploaded",
		},
		{
			label:"Confirmed",
			value:"Confirmed",
		},
		{
			label:"Rejected",
			value:"Rejected",
		},
		{
			label:"Deleted",
			value:"Deleted",
		},
		{
			label:"Pending approval",
			value:"Waiting for approval",
		},
		{
			label:"Approved",
			value:"Approved",
		},
		{
			label:"Approval rejected",
			value:"Approval rejected",
		},
		{
			label:"Published",
			value:"Published",
		},
		{
			label:"Errored",
			value:"Failed",
		},
		{
			label:"Fraud flagged",
			value:"Fraud flagged",
		},
		{
			label:"Fraud confirmed",
			value:"Fraud confirmed",
		},
		{
			label:"Paid",
			value:"Paid",
		},
		{
			label:"Cancelled",
			value:"Cancelled",
		},
		{
			label:"Closed",
			value:"Closed",
		},
		{
			label:"Ready for payment",
			value:"Ready for payment"
		},
		{
			label:"Payment in process",
			value:"Payment in process"
		},
		{
			label:"Payment on hold",
			value:"Payment on hold"
		},
		{
			label:"Payment failed",
			value:"Payment failed"
		},
		{
			label:"All",
			value:"All"
		},
		{
			label:"Action pending",
			value:"Action pending"
		}
	],
	SPREADSHEET_VALID_FILETYPES : ['application/vnd.ms-excel','csv', 'text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.ms-excel'],
	SYSTEM_ADMIN_ROLES : ["admin", "idp_admin"],
	DOC_GROUP_OPTIONS:[{
		value: "myAssignedDocs",
		label: 'My $DOC_TYPE'
	  },
	  {
		value: "myGroupDocs",
		label: 'My Group $DOC_TYPE'
	  },
	  {
		value: "myRejectedPendingDocs",
		label: '$DOC_TYPE Pending Review',
		// Add the tab names(Label) which is rendered on the list view
		allowedTabs: ['Rejected']
	  }
	],
	ALL_LIST_STAGE_MAP: {
        'Uploaded': 'Inbox',
        'Confirmed': 'Confirmed',
        'Rejected': 'Rejected',
        'Deleted': 'Deleted',
        'Waiting for approval': 'Pending approval',
        'Approved': 'Approved',
        'Approval rejected': 'Approval rejected',
        'Published': 'Published',
        'Fraud flagged': 'Fraud flagged',
        'Fraud confirmed': 'Fraud confirmed',
        'Paid': 'Paid',
        'Cancelled': 'Cancelled',
        'Closed': 'Closed'
    },
	UPLOAD_LIMIT: process.env.IDP_UPLOAD_LIMIT || 10,
	DOCUMENT_AUTO_PUBLISH: "System",
	SCRIPT_FILTER_MAP: {
		"AUTO_COMPLETE": "auto_complete_id",
		"REFERENCE": "reference_id",
		"PO_MAPPER" : "po_mapper_id",
		"UI_EVENT_SCRIPT":"ui_script",
	},
	DEFAULT_DATE_FORMAT: "MM/DD/YYYY",
	CLASSIFICATION_INPUT_CHANNELS: ['EMAIL', 'FTP', 'API'],
	APPROVAL_WORKFLOW_ID: "64be555c3146bcf9e62e9740",
	STORAGE_SHARE_NAME: process.env.STORAGE_DOCEX_SHARE_NAME || "docex-dev",
	MARKETING_TEAM_EMAIL: process.env.MARKETING_TEAM_EMAIL || "khushboo.mulani@jadeglobal.com",
	PUBLISH_CHANNEL_LIST: [{
		label: "JSON",
		value: "json"
	}, {
		label: "CSV",
		value: "csv"
	},{
		label: "SYSTEM",
		value: "system"
	},{
		label: "EXCEL",
		value: "excel"
	},{
		label: "EMAIL",
		value: "email"
	}],
	EXPORT_SCRIPT_TYPES: [
		{
            label: "CSV",
            value: "csv"
        },
        {
            label:"JSON",
            value:"json"
        },
		{
            label:"EXCEL",
            value:"excel"
        }
	],
    LLM_MODEL_MAP: {
        "llm_o": [
            { label:"GPT-4 Vision Preview", value:"gpt-4-vision-preview" },
			{ label: "GPT-4 Omni", value: "gpt-4o"}
        ],
        "llm_a": [
            { label:"GPT-4 Vision Preview", value:"gpt-4-vision-preview" }
        ],
        "llm_g": [
            { label:"Gemini Pro Vision", value:"gemini-pro-vision" },
            { label:"Claude 3 Opus", value:"claude-3-opus@20240229" }
        ]
    },
    LLM_TYPES: [
		{ label: "LLM-O", value: "llm_o" },
		{ label: "LLM-A", value: "llm_a" },
		{ label:"LLM-G", value:"llm_g" },
    ],
	PROCESSOR_TYPES: [
		{ label: "LLM", value: "llm" },
		{ label: "Google Invoice Processor", value: "gip"}
	],
	ALL_STAGES : [
		"Inbox",
		"Confirmed",
		"Rejected",
		"Deleted",
		"Pending approval",
		"Approved",
		"Approval rejected",
		"Published",
		"Errored",
		"Fraud flagged",
		"Fraud confirmed",
		"Cancelled",
		"Paid"
	],
	DASHBOARD_WIDGET_STAGES: [
		"Inbox",
		"Confirmed",
		"Rejected",
		"Deleted",
		"Pending approval",
		"Approved",
		"Approval rejected",
		"Published",
		"Errored",
		"Paid",
		"Fraud confirmed",
		"Cancelled"
	],
	VENDOR_DASHBOARD_WIDGET_STAGES: [
		"Pending unpaid",
		"Paid"
	],
	DOCUMENT_TYPE_LIST: [{
		label: "Invoice",
		value: "invoice"
	},
	{
		label: "Sales Order",
		value: "po"
	},
	{
		label: "Quote",
		value: "quote"
	},

	{
		label: "Other",
		value: "other"
	},
	{
		label: "Insurance",
		value: "insurance"
	},
	{
		label: "Trade Confirm",
		value: "trade_confirm"
	},
	{
		label: "Meter Reading",
		value: "meter_reading"
	}
	],
	LOOKUP_DATATYPES:[{
        label:'Text',
        value:'text'
    },
	{
        label:'Boolean',
        value:'boolean'
    },{
        label:'Date',
        value:'date'
    },
	{
        label:'Number',
        value:'number'
    }],
	DE_DOCUMENT_FIELDS: [
		{
			name: "vendor_name",
			label: "Vendor name",
			filterOptions : {'enable':true}
		},
		{
			name: "due_amount",
			label: "Due amount",
			filterOptions : {'enable':true}
		},
	    {
			name: "invoice_number",
			label: "Invoice number",
			filterOptions : {'enable':true}
		},
		{
			name: "invoice_date",
			label: "Invoice date",
			filterOptions : {'enable':true}
		},
		{
			name: "po_number",
			label:"Po number",
			filterOptions : {'enable':true}
		},
		{
			name: "total_amount",
			label: "Total amount",
			filterOptions : {'enable':true}
		}
	],
	TRIGGER_TYPES: {
		REVIEWER: "Received",
		APPROVER: "Sent to approver",
		PUBLISHER: "Ready to publish",
		AUTO_PUBLISHED: "Auto-published",
		CLASSIFIED_AS_OTHER: "Classified as other",
		ERRORED: "Errored",
        PUBLISHED: "Published"
	},
	TRIGGERS_LIST: [
		{
			label: "Received",
			value: "Received"
		},
		{
			label: "Ready to publish",
			value: "Ready to publish"
		},
		{
			label: "Auto-published",
			value: "Auto-published"
		},
		{
			label: "Classified as other",
			value: "Classified as other"
		},
		{
			label: "Errored",
			value: "Errored"
		},
		{
			label: "Sent to approver",
			value: "Sent to approver"
		},
		{
			label: "Published",
			value: "Published"
		}
	],
	SYSTEM_NAME_LIST: [{
		label: "JOSS",
		value: "JOSS"
	},
	{
		label: "ORACLE-EBS",
		value: "ORACLE-EBS"
	},
	{
		label: "ORACLE-FUSION",
		value: "ORACLE-FUSION"
	},
	{
		label: "GENERIC",
		value: "INTERNAL"
	},
		{
			label: "ERP-NETSUITE",
			value: "ERP-NETSUITE"
		},
		{
            label: "MAJESCO",
            value: "MAJESCO"
        }
	],
	UI_EVENTS_LIST:[
		{
			label: "on-change",
			value:"on-change"
		},
		{
			label: "on-focus",
			value:"on-focus"
		},
		{
			label: "on-blur",
			value:"on-blur"
		},
		{
			label: "on-select",
			value:"on-select"
		}
	],
	SCRIPT_TYPE_LIST: [
		{
			label: "AUTO COMPLETE",
			value: "AUTO_COMPLETE"
		},
		{
			label: "REFERENCE",
			value: "REFERENCE"
		}
	],

	SCRIPT_TYPE: {
		"AUTO_COMPLETE": "AUTO_COMPLETE",
		"REFERENCE": "REFERENCE",
		"PO_MAPPER" : "PO_MAPPER",
		"UI_EVENT_SCRIPT" : "UI_EVENT_SCRIPT",
		"ACTION_BUTTON" : "ACTION_BUTTON"
	},
	DOCUMENT_TYPES: {
		"INVOICE": "invoice",
		"PO": "po",
		"QUOTE": "quote",
		"OTHER": "other",
		"INSURANCE": "insurance",
		"TRADE_CONFIRM":"trade_confirm",
		"METER_READING":"meter_reading",
		"VENDOR_ONBOARDING":"vendor_onboarding",
		"SERVICE_CONTRACT" : "service_contract",
	},
	UPLOAD_STORAGE_LIST: [{
		label: "Inline attachment with system",
		value: "inline_attachment"
	},
	{
		label: "Kanverse storage",
		value: "kanverse_storage"
	},
	{
		label: "Custom storage",
		value: "customer_storage"
	}
	],
	BUSINESS_RULE_TYPES: [
		{
			label: "BR",
			value: "business_rule"
		},
		{
			label: "Auto Publish",
			value: "auto_publish_rule"
		}
	],
	LABEL_TYPE: ['string', 'date', 'currency', 'dropdown','checkbox','textarea','number','multiselect'],
	FIELD_TYPE: ['table', 'header'],
	FIELD_LEVEL: {
		PACKAGE:"package",
		DOCUMENT:"document"
	},
    VIEW: {
		PACKAGE: "package",
		DOCUMENT: "document"
    },
	INVOKE_ACTION :  [
		{
			label: "File upload",
			value: "file_upload"
		},
		{
			label: "Save",
			value: "save"
		},
		{
			label: "Approve",
			value: "approve"
		},
		{
			label: "Reject",
			value: "reject"
		},
		{
			label: "Before Publish",
			value: "publish"
		},
		{
			label: "After Publish",
			value: "after_publish"
		},
	    {
			label: "Duplicate",
			value: "duplicate"
		},
		{
			label: "Move to inbox",
			value: "move_to_recieved"
		},
		{
			label: "Fraud confirmed",
			value: "fraud_confirm"
		},
		{
			label: "Fraud rejected",
			value: "fraud_reject"
		},
		{
			label: "Delete document",
			value: "delete"
		},
		//added new triggers related to action buttons: 1. Actions(list view), 2. Confirm(document viewer)
		{
			label: "Document assignment",
			value: "document_assignment"
		},
		{
			label: "Confirm",
			value: "confirm_without_approval"
		}
	],
	DOCUMENT_NOT_FOUND: "No next document to show, redirecting to list view.",
	IMAGE_NOT_FOUND: "Error while displaying image",
	DATA_SAVED: "Data saved successfully",
	DATA_CONFIRMED: "Data confirmed successfully",
	DATA_SAVE_ERROR: "Error while saving data",
	BULK_PUBLISH_ALL_INVALID :"All document(s) selected have errors or are not ready to publish. Please resolve errors before publishing.",
	BULK_PUBLISH_PARTIAL_INVALID : "One or more document(s) have errors or are not ready to publish. Do you still want to submit rest of the document(s)?",
	BULK_PUBLISH_CONFIRMATION : "Are you sure you want to publish?",
	TRIGGER_ACTION: {
		DRAFT: "save",
		FORM_SAVE: "form_save",
		CONFIRM: "confirm",
		CONFIRM_WITH_APPROVAL: 'confirm_with_approval',
		CONFIRM_WITHOUT_APPROVAL: 'confirm_without_approval',
		MOVE_TO_RECIEVED: "move_to_recieved",
		DUPLICATE:'duplicate',
		PUBLISH:'publish',
		FILE_UPLOAD:'file_upload',
        RESTORE:"restore",
		PAYMENT_ON_HOLD: "Payment on hold",
		MARK_AS_REVIEWED: "mark_as_reviewed",
		COLLABORATION_SUBMIT: "collaboration_submit",
		FORM_SUBMIT: "form_submit"
	},
	FIELD_COMPONENT_MAPPING: {
		'date': 'DatePicker',
		'dropdown': 'Dropdown' ,
		'checkbox': 'Checkbox',
		'string': 'Input' ,
		'currency': 'Input',
		'textarea':'Input',
		'multiselect':'MultiSelect'
	 },
	COMPONENT_REQUIRE_FULL_SPACE: ["textarea", "checkbox","multiselect"],
	STAGE: {
		UPLOADED: "Uploaded",
		EXTRACTED: "Extracted",
		CONFIRMED: "Confirmed",
		PUBLISHED: "Published",
		INVALID: ["Duplicate"],
		DUPLICATE: "Duplicate",
		DRAFT: "Draft",
		APPROVED: "Approved",
		REJECTED: "Rejected",
		DELETED:"Deleted",
		APPROVAL_REJECTED: "Approval rejected",
		WAITING_FOR_APPROVAL: "Waiting for approval",
		FRAUD_FLAGGED: "Fraud flagged",
        FRAUD_CONFIRMED: "Fraud confirmed",
		ACK_SYSTEM	:"Ack System",
		CLOSED:"Closed",
		PAID:"Paid",
		CANCELLED:"Cancelled",
		VENDOR_PENDING:"Pending unpaid",
		VENDOR_PAID:"Paid",
		READY_FOR_PAYMENT: "Ready for payment",
		PAYMENT_IN_PROCESS: "Payment in process",
		PAYMENT_ON_HOLD: "Payment on hold",
		PAYMENT_FAILED: "Payment failed"
	},
	ERROR_TYPES:[
        { label: "WARNING", value: "WARNING" },
        { label: "ERROR", value: "ERROR" },
        { label: "FRAUD", value: "FRAUD" },
        { label: "NOT_PREDICTED", value: "NOT_PREDICTED" }
    ],
	DOC_DELETED:"Deleted",
	STATE_UPLOADED: {
		REQUESTED: "Requested",
		PENDING: "Pending",
		QUEUED: "Queued",
		IN_PROGRESS: "In progress",
		SUCCESS: "Success",
		EXTRACTED: "Extracted",
		FAILED: "Failed"
	},
	STATE_PUBLISHED: {
		SUCCESS: "Success",
		FAILED: "Failed",
		PUBLISH_IN_PROGRESS:"Publish in progress",
		PUBLISH_STARTED:"Publish started"
	},
	STATE_ERRORED: {
		FAILED: "Failed"
	},
	STATE_FRAUD: {
		SUCCESS: "Success",
		FAILED: "Failed"
	},
	FRAUD_CODES: {
		FRAUD:"FRAUD"
	},
	BR_REPOSITORY:{
		OUT_OF_BOX:"outofbox",
		CUSTOM:"custom"
	},
	INSTANCE_TYPE:{
		CUSTOMER: "customer",
		TEMPLATE: "template",
		DEMO: "demo"
	},
	APPROVAL_STATUS: {
		REQUESTED : "Requested",
		NOT_REQUIRED: "Not required",
		WAITING_FOR_APPROVAL: "Waiting for approval",
		APPROVED: "Approved",
		REJECTED: "Rejected"
	},

	VALIDATION_MESSAGE: {
		NUMBER: "Value should be number",
		DATE: "Incorrect date format",
		FUTURE_DATE_NOT_ALLOWED: "Future date is not allowed",
		PAST_DATE_NOT_ALLOWED: "Past date is not allowed"
	},
	ACTIONS: {
		REVIEWED: "Reviewed"
	},
	EXTRACTION_REFRESH_TIME: 60000,
	PUBLISH_REFRESH_TIME:60000,
	MAX_NUMBER_OF_ATTACHMENT_PER_DOC: 5,
	MAX_ATTACHMENT_SIZE_PER_DOC: 10, //MB
	INPUT_CHANNEL_LIST: [{
		label: "FTP",
		value: "FTP"
	},
	{
		label: "Email",
		value: "EMAIL"
	},
	{
		label: "Sharepoint",
		value: "SHAREPOINT"
	},
	{
		label: "API",
		value: "API"
	}
	],
	AUTH_TYPE: [{
		label: "Basic",
		value: "BASIC"
	},
	{
		label: "Oauth2",
		value: "oauth2"
	},
	{
		label: "Api Key",
		value: "api_key"
	}
	],
	MAIL_SERVICE_PROVIDER: [{
		label: "Outlook",
		value: "outlook"
	}, {
		label: "Gmail",
		value: "gmail"
	},
	{
		label: "Yahoo",
		value: "yahoo"
	},
	{
		label: "Other",
		value: "other"
	}
	],
	ACTION_ON_EMAIL: [{
		label: "Move to other folder",
		value: "move_to_folder"
	}, {
		label: "Mark as read",
		value: "mark_as_read"
	}
	],

	EMAIL_HOST_PORT_MAPPING: {
		"outlook": {
			host: "outlook.office365.com",
			port: 993
		},
		"gmail": {
			host: "imap.gmail.com",
			port: 993
		},
		"yahoo": {
			host: "imap.mail.yahoo.com",
			port: 993
		}
	},
	ROLES_MAP: {
		IDP_PUBLISHER: "idp_publisher",
		IDP_PUBLISHER_ONLY: "idp_publisher_only",
		IDP_REVIEWER: "idp_reviewer",
		IDP_DEVELOPER: "idp_developer",
		IDP_CUSTOMER_ADMIN: "idp_customer_admin",
		IDP_APPROVER: "idp_approver",
		IDP_ADMIN: "idp_admin",
		IDP_PII_RESTRICTOR:"idp_pii_restrictor",
		IDP_REVIEWER_ONLY:"idp_reviewer_only",
		IDP_VENDOR: "idp_vendor",
		IDP_VENDOR_ONBOARDING : "idp_vendor_onboarding",
		AP_CONTRIBUTOR : "ap_contributor"
	},
	ROLES: [
		{
			value: "idp_reviewer",
			label: "Docex reviewer"
		}, {
			value: "idp_publisher",
			label: "Docex publisher"
		},
		{
			value: "idp_publisher_only",
			label: "Docex publisher only"
		},
		{
			value: "idp_developer",
			label: "Developer"
		},
		{
			value: "idp_customer_admin",
			label: "Admin"
		},
		{
			value: "idp_approver",
			label: "Approver"
		}
	],
	ROLE_ACCESS_TYPES_MAP: {
		FIELDS: { label : "Fields", value: "fields" },
		TABS: { label : "Tabs", value: "tabs" }
	},
	FIELD_TYPES : {
		HEADER : "header",
		TABLE : "table"
	},
	EXPAND_COLUMNS: [
		{
			name: "vendor_name",
			label: "Vendor Name",
			filterOptions: { 'enable': true }
		},
		{
			name: "due_amount",
			label: "Due Amount",
			filterOptions: { 'enable': true }
		},
		{
			name: "po_number",
			label: "Po Number",
			filterOptions: { 'enable': true }
		},
		{
			name: "invoice_number",
			label: "Invoice Number",
			filterOptions: { 'enable': true }
		},
		{
			name: "invoice_date",
			label: "Invoice Date",
			filterOptions: { 'enable': true }
		},
		{
			name: "total_amount",
			label: "Total Amount",
			filterOptions: { 'enable': true }
		},
		{
			name: "due_date",
			label: "Due Date",
			filterOptions: { 'enable': true }
		}
	],
	DASHBOARD_WIDGET_MAP: {
        "TotalDocumentCountWrapper": "All Documents By Stage",
        "DocumentWiseCountWrapper": "Documents By Stage",
        "AverageTimeChart": "Process Metrics",
        "ProcessingTimeWrapper": "Documents By Volume (Bar)",
        "DocumentByChannelWrapper": "Documents By Channels",
        "SubmissionEmails": "Submission Emails",
        "AutoPublishFailureCountWrapper": "Auto Publish Failure Count",
		"DocumentsProcessedBySystem": "Documents Processed By System",
        "AvgProcessingTimePerVendorWrapper": "Average Processing Time",
        "DocumentByEntityWrapper": "Documents By Entity",
        "GaugeChartWrapper": "Overall Accuracy",
        "AccurcyByVendorsWrapper": "Accuracy By Entity",
        "VolumeByEntityWrapper": "Volume By Entity",
		"AverageApproveTimeWrapper": "Average Approver Time",
        "DocumentBySubtypeWrapper": "Documents By Subtype",
        "OrphanDocsBySubtypeWrapper": "Documents Orphaned",
        "ProductivityStaffWrapper": "Productivity Staff",
		"SubmissionsOnlineOfflineWrapper":"Submissions Online Offline Wrapper",
        "StackedLineChartWrapper": "Documents By Volume (Line)",
        "DocumentsByClassificationWrapper": "Classified Documents",
        "PublishedCountWrapper": "Published Count",
		"SubmissionLobWiseWrapper": "Submissions LOB Wise",
		"SubmissionsPendingWrapper": "Submissions Pending Actions",
		"DueDateWrapper": "Due Date Bucket",
		"PaidStatusWrapper":"Paid Status",
		"EarlyDiscountWrapper": "Early Discount Bucket",
		"InvoiceProcessedWrapper": "Invoice Processed",
		"InvoiceInProgressWrapper": "Invoice In Progress",
		"ApprovalPendingWrapper": "Approval Pending Wrapper",
		"FinancialMetricsWrapper": "Financial Metrics",
		"ExtractionBucketChart": "Extraction Metrics",
		"ProcessingCycleTimeChart":"Processing Cycle Time",
		"AutomationLeverWrapper":"Automation Metrics",
		"PublishedTouchedUntouchedDocuments":"Touched vs Non touched"
    },
    COLLECTION_TO_FORM_MAP:{
        "de_business_rule":"business-rule-form",
		"de_notification_rule":"notification-rule-form",
		"customer_system":"customer-system-form",
		"de_document_assignment_rule":"document-assignment-rule-form",
		"de_document_script":"document-script-form",
		"script":"script-form",
        "input_channel":"input-channels-form",
		"de_customer_configuration":"document-setup",
		"de_customer_storage":"storage-form",
		"customer_system":"customer-system-form",
		"workflow":"workflow",
		"de_field":"field-config-form"
	},
	IDP_DASHBOARD: {
		STAGE_COLOR_MAP__light: {
			"Uploaded":"#0147FE",
			"Inbox":"#0147FE",
			"Confirmed": "#16a085",
			"Deleted":"#E53E3E",
			"Published":"#66B032",
			"Duplicate":"",
			"Fraud confirmed":"#FED8B1",
			"Draft":"",
			"Approved":"#D0EA2B",
			"Rejected":"#E75454",
			"Approval Rejected":"",
			"Waiting for approval": "#FB9902",
			"Failed":"#FE2712",
			"Errored":"#FE2712",
			"Closed": "#FE2712",
			"Cancelled":"#E75454",
			"Pending unpaid": "#FB9902",
			"Paid": "#66B032"
		},
		STAGE_COLOR_MAP__dark: {
			"Uploaded":"#0037C7",
			"Inbox":"#0037C7",
			"Confirmed": "#16A085",
			"Deleted":"#BF2D2D",
			"Published":"#58982C",
			"Duplicate":"",
			"Fraud confirmed":"#DDAE7E",
			"Draft":"",
			"Approved":"#A6BA26",
			"Rejected":"#CF4848",
			"Approval Rejected":"",
			"Waiting for approval": "#CC7C00",
			"Failed":"#DB210F",
			"Errored":"#DB210F",
			"Closed": "#DB270F",
			"Cancelled":"#CF4848",
			"Pending unpaid": "#CC7C00",
			"Paid": "#58982C"
		},
		DOC_TYPE_COLOR_MAP__light: {
			'other': '#ca67ca',
			'invoice': '#4285F4',
			'po': '#FB9902',
			'quote':'#EA4335',
			'trade_confirm':'#4285F4'
		},
		DOC_TYPE_COLOR_MAP__dark: {
			'other': '#A94DA9',
			'invoice': '#2968CF',
			'po': '#CC7C00',
			'quote':'#CB2F22',
			'trade_confirm':'#2968CF'
		},
		// { UI value : DB value}
		STAGE_LABEL_MAP: { 'Errored': 'Failed', 'Inbox': 'Uploaded','Pending approval':'Waiting for approval', "Cancelled": "Cancelled" },
		DOC_TYPE_LABEL_MAP: { 'other': 'other' },
		DOC_CHANNEL_COLOR_MAP__light: { 'EMAIL': '#66B032', 'FTP': "#D0EA2B", 'API': "#FB9902", 'PORTAL': "#FBBC04", 'SHAREPOINT': "#0186FC"},
		DOC_CHANNEL_COLOR_MAP__dark: { 'EMAIL': "#58982C", 'FTP': "#A6BA26", 'API': "#CC7C00", 'PORTAL': "#D29E04", 'SHAREPOINT': "#0672D2"},
		SUBMISSION_EMAILS__light: { 'PUBLISHED': "#D0EA2B", 'NON PUBLISHED': "#FB9902"},
		SUBMISSION_EMAILS__dark: {'PUBLISHED': "#A6BA26", 'NON PUBLISHED': "#CC7C00"},
		DOC_SYSTEM_COLOR_MAP__light: { 'Kanverse': '#0186FC', 'ERP': "#FBBC04" },
		DOC_SYSTEM_COLOR_MAP__dark: { 'Kanverse': '#0672D2', 'ERP': "#D29E04" },
		PUBLISHED_TOUCHED_UNTOUCHED_DOC_COLOR__light: { 'Touched': '#0186FC', 'Untouched': "#FBBC04" },
		PUBLISHED_TOUCHED_UNTOUCHED_DOC_COLOR__dark: { 'Touched': '#0186FC', 'Untouched': "#FBBC04" },
		PAID_STATUS_COLOR_MAP__light: { 'Published': '#FB9902', 'Paid': "#66B032"},
		PAID_STATUS_COLOR_MAP__dark: { 'Published': '#CC7C00', 'Paid': "#58982C"},
		SUBMISSIONS_ONLINE_OFFLINE_COLOR_MAP__light: { 'CLOSED': '#66B032', 'PUBLISHED': "#D0EA2B" },
		SUBMISSIONS_ONLINE_OFFLINE_COLOR_MAP__dark: { 'CLOSED': '#58982C', 'PUBLISHED': "#A6BA26" },
		CUSTOMER_WISE_CARDS: [
			{
				label: "Total Document Count",
				value: "TotalDocumentCountWrapper"
			},
			{
			  label: "Document by volume",
			  value: "ProcessingTimeWrapper",
			}
		],
		ADMIN_CARDS:[
			{label: 'TOTAL DOCUMENT COUNT', span: 8,widget_name: 'TotalDocumentCountCard'},
			{label: 'DOCUMENT BY VOLUME (Last 12 months)', widget_name: 'DocumentByVolumeCard', span: 16},
			{label: 'CUSTOMERS TREND', widget_name: 'TotalDocumentCountByCustomerWrapper', span: 24}
		],
		SUBSCRIPTION_CARDS: [
			{ label: 'CUSTOMER THRESHOLD', widget_name: 'CustomerThresholdCard', span: 9 },
			{ label: 'CUSTOMER MONTHLY PAGE PROCESSING', widget_name: 'CustomerMontlyProcessingCard', span: 15 },
			{ label: 'ALL CUSTOMERS MONTHLY PROCESSING', widget_name: 'AllCustomersMonthlyProcessingCard', span: 24 }
		]
	},
	STAGE_LABEL_MAP: {'Waiting for approval':'Pending approval',"Fraud confirmed":"Suspected Fraud", "Cancelled": "Cancelled"},
	STORAGE_TYPE : [{
		label:"Publish",
		value:"publish"
	},
	{
		label:"Attachment",
		value:"attachment"
	}
	],
	CUSTOMER_STORAGE: [{
		label: "AWS",
		value: "aws"
	},
	{
		label: "Sharepoint",
		value: "sharepoint"
	},
	{
		label: "Azure",
		value: "azure"
	},
	{
		label: "Ftp",
		value: "ftp"
	},
	{
        label: "Google Drive",
        value: "google_drive"
    }
	],
	VALID_FILE_TYPES: [
		"image/png",
		"image/jpeg",
		"application/pdf",
		"application/zip",
		"image/jpg",
		"image/bmp",
		"image/tiff",
		"image/x-ms-bmp",
		"message/rfc822",
		"application/vnd.ms-outlook",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"text/html"
	],
	ATTACHMENT_PATH: "attachment",
	SPREADSHEET_WHO_COLUMNS : [
	{
		"title" : "Updated by",
		"name" : "updated_by",
		"type" : "text",
		"readOnly":true
	},
	{
		"title" : "Updated at",
		"name" : "updated_at",
		"type" : "date",
		"readOnly":true
	}],
	SPREADSHEET_DATATYPE_MAPPING:{
		"text" : "text",
		"number" : "numeric",
		"boolean" : "checkbox",
		"date": "calendar"
	},
	DISPLAY_DATE_FORMAT:"Do MMM YYYY hh:mm A",
	INSURANCE_SUBTYPE_MAPPING : {
		'acord101': 'ACORD 101',
		'acord125': 'ACORD 125',
		'acord126': 'ACORD 126',
		'acord127': 'ACORD 127',
		'acord129': 'ACORD 129',
		'acord131': 'ACORD 131',
		'acord137': 'ACORD 137',
		'acord139': 'ACORD 139',
		'acord140': 'ACORD 140',
		'acord141': 'ACORD 141',
		'acord146': 'ACORD 146',
		'acord152': 'ACORD 152',
		'renewalupdate' : 'Renewal update',
		'ani#10' : 'Ani 10',
		'ani#1' : 'Ani 1',
		'ani#2' : 'Ani 2',
		'ani#3' : 'Ani 3',
		'ani#4' : 'Ani 4',
		'ani#5' : 'Ani 5',
		'ani#6' : 'Ani 6',
		'ani#7' : 'Ani 7',
		'ani#8' : 'Ani 8',
		'ani#9' : 'Ani 9',
		'niac#10' : 'Niac 10',
		'niac#1' : 'Niac 1',
		'niac#2' : 'Niac 2',
		'niac#3' : 'Niac 3',
		'niac#4' : 'Niac 4',
		'niac#5' : 'Niac 5',
		'niac#6' : 'Niac 6',
		'niac#7' : 'Niac 7',
		'niac#8' : 'Niac 8',
		'niac#9' : 'Niac 9',
	},
	VIEW_LIST:[{
		value:"Properties",
		label:'Property window'
	},{
		value:'PackageBar',
		label:'Package viewer'
	}],
	VENDOR_CONFIGURATION :{
		//to show label for stage tabs on document list view page
		VENDOR_STAGE_LABEL_MAP: { 'Pending unpaid': 'Pending unpaid', 'Paid': 'Paid' },
		//to show all possible values (master values) of stage tabs on vendor list view config page
		VENDOR_ALL_LIST_STAGES: [
			{
				label: "Pending unpaid",
				value: "Pending unpaid",
			},
			{
				label: "Paid",
				value: "Paid",
			},
		],
	},
	USER_TYPE:{
        VENDOR: 'vendor_user',
        CUSTOMER: 'customer_user'
    },
	VIEW_TYPE: {
		FORM : "form",
		DOCUMENT : "document"
	},
	UNSAVED_CHANGES : "You have unsaved changes, save and proceed?",
	SUBSCRIPTION: {
		TIER_LIST: [1, 2, 3, 4],
		BILLING_CYCLE: ["Month", "Quarter", "Year"],
		CONTRACT_PAGE_COUNT: [{
			tier: 1,
			contract_page_count: 36000
		}, {
			tier: 2,
			contract_page_count: 60000
		}, {
			tier: 3,
			contract_page_count: 90000
		}, {
			tier: 4,
			contract_page_count: 120000
		}
		]
	}
};
constants.WORKFLOW = {
	ACTIONS: {
		RETRY : "retry",
		CANCEL : "cancel",
		RESUME : "resume"
	},
	STATUS:{
		COMPLETED : "Completed",
		FAILED : "Failed",
		SUSPENDED : "Suspended",
		RESUMED : "Resumed",
		IN_PROGRESS : "In Progress",
		CANCELLED : "Cancelled"
	},
	NODES_WITHOUT_PROPERTY_WINDOW: ["Human Intervention", "Join", "Fork"],
	TYPESLIST: [
        { label: "Document Extraction", value: "docex" },
        { label: "QNA", value: "QNA" },
        { label: "Digital Assistant", value: "DA" }
    ],
	TYPE: {
		"QNA": "QNA",
		"DA": "DA",
		"DOCEX": "docex"
	},
    PRE_SCRIPT: {
        EXTRACTION: "(async () => {\n    // *******************************\n    // Business logic goes here.\n    // *******************************\n    // Sample payload -\n    // $file - To use file in classfication\n    // $ocr - To use ocr in classfication\n    // payload = {\n    //     \"file\": \"$file\",\n    //     \"ocr\": \"$ocr\"\n    // };\n    // return payload;\n})();",
        ASSIGNMENT: "(async () => {\n    // ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **\n    // Business logic go here.In last set Assigned User / Assigned Group values in context as shown below **\n    // ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **\n    // context.setAssignedUser('Test user') or '$loggedInUser' for current logged in user\n    // context.setAssignedUserGroup('TestGroup')or 'loggedInUserGroup' for current logged in group\n})();",
    },
    POST_SCRIPT: {
        EXTRACTION: "(async () => {\n    // *******************************\n    // Business logic goes here.\n    // *******************************\n    // Response will be stored as \"$output\"\n    // context.workflowContext.setAttribute(key, value) to set attribute \n    // Example -\n    // const response = $output;\n    // const key = \"sample_response\";\n    // context.workflowContext.setAttribute(key, response);\n    // return;\n})();"
    },
    GENERIC_SCRIPT: "(async () => {\n    // *******************************\n    // Business logic goes here.\n    // *******************************\n})();"
};

constants.ROLES = [{
	value: "admin",
	label: "Admin"
},
{
	value: "user",
	label: "User"
},
{
	value: "customer",
	label: "Customer"
},
{
	value: "guest",
	label: "Guest"
},
{
	value: "qna",
	label: "QNA"
},
{
	value: "idp_reviewer",
	label: "Docex reviewer"
}, {
	value: "idp_publisher",
	label: "Docex publisher"
},
{
	value: "idp_publisher_only",
	label: "Docex publisher only"
}

];

constants.SOCKET_EVENTS = Object.freeze({
	"USER_ADDED_IN_ROOM": "USER_ADDED_IN_ROOM",
	"MESSAGE_SENT_BY_USER": "MESSAGE_SENT_BY_USER",
	"MESSAGE_READ_BY_USER": "MESSAGE_READ_BY_USER",
	"USER_JOINED_ROOM": "USER_JOINED_ROOM",
	"USER_LEFT_ROOM":"USER_LEFT_ROOM",
	"ERROR": "ERROR",
	"UPDATE_MESSAGES":"UPDATE_MESSAGES",
	"EXCEL_VIEWER":{
		"EXCEL_VIEWER_VALIDATION_MESSAGES":"EXCEL_VIEWER__VALIDATION_MESSAGES",
		"EXCEL_VIEWER_EXCEL_STATUS": "EXCEL_VIEWER__EXCEL_STATUS",
		"EXCEL_VIEWER_ON_STATUS_UPDATE": "EXCEL_VIEWER__ON_STATUS_UPDATE"
	},
	"ADD_OR_REMOVE_USERID_IN_DOCUMENT": "ADD_OR_REMOVE_USERID_IN_DOCUMENT",
	"DOCUMENT":{
        "STATE_UPDATE": "STATE_UPDATE",
        "DOCUMENT_JOIN_EVENT" : "DOCUMENT_JOIN_EVENT",
        "DOCUMENT_LEAVE_EVENT" : "DOCUMENT_LEAVE_EVENT",
        "SYNC_DOCUMENT_ROOM_USERS" : "SYNC_DOCUMENT_ROOM_USERS",
    },
	"UPDATE_SYSTEM_HEALTH_STATUS": "UPDATE_SYSTEM_HEALTH_STATUS",
	"ADD_CONNECTION_LOG": "ADD_CONNECTION_LOG"
})

constants.BUS_EVENTS = Object.freeze({
	"PUSH_MSG_ON_CHATSCREEN": "PUSH_MSG_ON_CHATSCREEN",
	"PUSH_MESSAGE_IN_TRAY": "PUSH_MESSAGE_IN_TRAY",
	"REMOVE_CHAT_NOTIFICATION":"REMOVE_CHAT_NOTIFICATION",
	"RENDER_MSG_COMPONENT":"RENDER_MSG_COMPONENT"
});

constants.SOCKET_MESSAGES = Object.freeze({
	STATUS: {
		READ: "Read",
		UNREAD: "Unread"
	},
	TYPE: {
		TEXT: "Text",
		IMAGE: "Image",
		PDF: "Pdf"
	}
})
constants.UI_EVENT_MAP = {
	"change":"ON-CHANGE",
	"focus":"ON-FOCUS",
	"blur" : "ON-BLUR",
	"input" : "ON-INPUT",
	"click" : "ON-CLICK"
}
constants.PERMISSION_RESOURCE_TYPES = {
    TABLE: "table",
    WIDGET: "widget",
    DOCUMENT_TYPE: "document_type",
	RECORD: "record"
}
constants.BUCKET_STATUS = [{
	value: "Open",
	label: "Open"
},
{
	value: "Closed",
	label: "Closed"
},
{
	value: "Pending review",
	label: "Pending review"
},
{
	value: "Reverted",
	label: "Reverted"
},
],
constants.DEFAULT_BUCKET = "61c18697e977c52fd58274a2",

constants.DOCUMENT_SUB_TYPE = [
	'acord101','acord125','acord126','acord127','acord131','acord139','acord141','acord152',
	'ani#10','ani#1','ani#2','ani#3','ani#5','ani#8','renewalupdate',
	'niac#10','niac#1','niac#3','niac#4','niac#6','niac#8','niac#9'
],

constants.PLATFORM_ACTION_BUTTON= {
	SAVE: "Save Draft",
	APPROVE: "Approve",
	REJECT: "Reject",
	REJECT_DOCUMENT: "Reject Document",
	CONFIRM: "Confirm",
	PUBLISH: "Publish",
	DUPLICATE: "Duplicate",
	MOVE_TO_INBOX: "Move to Inbox",
	FRAUD_CONFIRMED: "Confirm fraud",
	FRAUD_REJECTED:"Reject Fraud",
	SEND_FOR_APPROVAL:"Send for Approval",
	DELETE: "Delete",
	RESTORE:"Restore",
	SUBMIT: "Submit",
	MARK_AS_REVIEWED: "mark_as_reviewed"
}

constants.DOCUMENT_RELEATIONS = {
	"EMAIL":"email"
},

constants.FTP_PROTOCOLS = [
	{
		value: "SFTP",
		label: "SFTP"
	},
	{
		value: "FTPS",
		label: "FTPS"
	},
	{
		value: "FTP",
		label: "FTP"
	}]

constants.PAYMENTS_CONFIG= {
	BANK_ACCOUNT_STATUS: {
		DEPOSIT_ONLY: "DEPOSIT_ONLY",
		PENDING: "PENDING",
		VERIFIED: "VERIFIED"
	},
	ACCOUNT_TYPE: ["CHECKING", "SAVINGS", "BUSINESS"],
	USER_TYPES: {
		CUSTOMER: "customer",
		VENDOR: "vendor"
	},
	PAYMENT_MODE_OPTIONS: {
		ACH: "ach",
		DIGITAL_CHECK: "digital_check",
		PHYSICAL_CHECK: "physical_check"
	},
	PAYMENT_OPTIONS : [
		{
			value: "ach",
			label: "ACH"

		},
		{
			value: "digital_check",
			label: "Digital Check"
		},
		{
			value: "physical_check",
			label: "Physical Check"
		}
	]
}
constants.NAVBAR_MENU_COUNT = 3

constants.EMAIL_TEMPLATE_STRINGS=[
	{
		value: 'HEADER_DATA["INVOICE_NUMBER"]',
		label: "Invoice Number"
	},
	{
		value: 'HEADER_DATA["VENDOR_NAME"]',
		label: "Vendor Name"
	},
	{
		value: 'HEADER_DATA["PO_NUMBER"]',
		label: "PO Number"
	},
	{
		value: 'HEADER_DATA["INVOICE_DATE"]',
		label: "Invoice Date"
	},
	{
		value: 'HEADER_DATA["BUSINESS_UNIT"]',
		label: "Business Unit"
	},
	{
		value: 'REJECTED_BY',
		label: "Rejected by",
	},
	{
		value: 'APPROVE_URL',
		label: "Approve URL",
	},
	{
		value: 'REJECT_URL',
		label: "Reject URL",
	},
	{
		value: 'DOCEX_URL',
		label: "DOCEX URL",
	},
	{
		value: 'PREVIOUS_APPROVAL',
		label: "Previous Approval",
	},
	{
		value: 'HEADER_FIELDS',
		label: "Header Fields",
	},
	{
		value: 'TABLE_FIELDS',
		label: "Table Fields",
	},
	{
		value: 'CLIENT_NAME',
		label: "Client Name",
	},
	{
		value: 'REGISTRATION_URL',
		label: "Registration URL",
	},
	{
		value: 'FILE_NAME',
		label: "File Name",
	},
	{
		value: 'UNIQUE_ID',
		label: "Unique ID"
	},
],
constants.FIELD_TYPE_VUE_FORMULATE_MAPPING= {
	"dropdown": "select",
	"string":"text"
}
constants.CAPTCHA_DISABLED_ENVS = ["TEST", "QA", "DEV"];
constants.EMPTY_FILTER_FIELDS_MAP = {
	"action": "Not Reviewed"
}
constants.TEST_CASE_STATUS = {
	NOT_RUN: "Not run",
	PENDING: "Pending",
	READY_TO_RUN: "Ready",
	PASS: "Pass",
	FAIL: "Fail"
}
constants.TEST_CASE_RUN_TYPES = {
    ALL: "All",
    REFERENCE_ALL: "Reference all",
    INDIVIDUAL: "Individual",
	NEW_FILE: "New File",
    SAVE_DRAFT: "Save Draft",
    FILE_UPLOAD: "File Upload"
}
constants.OCR_TYPES = [
	{
		value: "vision",
		label: "Google Vision"
	},
	{
		value: "document_ai",
		label: "Google DocumentAI"
	}
]
constants.JSON_QUERY_OPERATORS = {
    DATE: [
        "is equals",
        "is before",
        "is after",
        "is same or before",
        "is same or after",
        "is not empty",
        "is empty",
        "is before current",
        "is after current"
    ],

    TEXT: [
        'equals',
        'in',
        'not in',
        'does not equal',
        'contains',
        'does not contain',
        'is empty',
        'is not empty',
        'begins with',
        'ends with'
    ],

    CURRENCY: [
        "=",
        ">=",
        "<=",
        "<",
        ">",
        "is not empty",
        "is empty",
    ]
}

constants.MODEL_SUBTYPES = {
	pytorch: {
		DOCEX: [
			{
				label: "Vision Header Extraction L",
				value: "DOCUMENT_EXTRACTION_NER_LAYOUTLM_HEADER"
			},
			{
				label: "Header Detection",
				value: "DOCUMENT_EXTRACTION_DETECTORS_HEADER"
			},
			{
				label: "Table Detection",
				value: "DOCUMENT_EXTRACTION_DETECTRON_TABLE"
			},
			{
				label: "Rows Detection",
				value: "DOCUMENT_EXTRACTION_DETECTRON_TABLE_WITH_ROWS"
			},
			{
				label: "Columns Detection",
				value: "DOCUMENT_EXTRACTION_DETECTRON_TABLE_WITH_COLUMNS"
			},
			{
				label: "Common Table Detection",
				value: "DOCUMENT_EXTRACTION_DETECTRON_COMMON_TABLE"
			}
		],
		CLAIM: [
			{
				label: "Claim Classification",
				value: "CLAIM_CLASSIFICATION"
			}
		],
		INSURANCE: [{
				label: "Vision Header Extraction L",
				value: "DOCUMENT_EXTRACTION_LAYOUTLMV2"
			},
			{
				label: "Header Detection",
				value: "DOCUMENT_EXTRACTION_DETECTORS_HEADER"
			},
			{
				label: "Table Detection",
				value: "DOCUMENT_EXTRACTION_DETECTRON_TABLE"
			},
			{
				label: "Rows Detection",
				value: "DOCUMENT_EXTRACTION_DETECTRON_TABLE_WITH_ROWS"
			},
			{
				label: "Columns Detection",
				value: "DOCUMENT_EXTRACTION_DETECTRON_TABLE_WITH_COLUMNS"
			}
		],
		EXCEL: [
			{
				label: "Vision Header Extraction L",
				value: "EXCEL_EXTRACTION_LAYOUTLM_HEADER"
			},
			{
				label: "Header Detection",
				value: "EXCEL_EXTRACTION_DETECTORS_HEADER"
			},
			{
				label: "Table Detection",
				value: " EXCEL_EXTRACTION_DETECTRON_TABLE"
			},
			{
				label: "Rows Detection",
				value: "EXCEL_EXTRACTION_DETECTRON_TABLE_WITH_ROWS"
			},
			{
				label: "Columns Detection",
				value: "EXCEL_EXTRACTION_DETECTRON_TABLE_WITH_COLUMNS"
			},
			{
				label: "Vision Header Extraction LI",
				value: "EXCEL_EXTRACTION_LILT"
			}
		],
		SQUAD: [
			{
				label: "Header Extraction",
				value: "DOCUMENT_EXTRACTION_HEADER"
			},
			{
				label: "Base Header Extraction",
				value: "BASE_DOCUMENT_EXTRACTION_HEADER"
			}
		]
	},
	tensorflow: {
		DOCEX: [
			{
				label: "Table Classification",
				value: "DOCUMENT_EXTRACTION_TABLE_CLASSIFICATION"
			},
			{
				label: "Table Header Extraction",
				value: "DOCUMENT_EXTRACTION_NER_TABLE"
			},
			{
				label: "Header Extraction",
				value: "DOCUMENT_EXTRACTION_NER_HEADER"
			},
			{
				label: "Address Extraction",
				value: "DOCUMENT_EXTRACTION_NER_ADDRESS"
			}
		],
		INSURANCE: [
			{
				label: "Table Classification",
				value: "DOCUMENT_EXTRACTION_TABLE_CLASSIFICATION"
			},
			{
				label: "Table Header Extraction",
				value: "DOCUMENT_EXTRACTION_NER_TABLE"
			},
			{
				label: "Table Cell Extraction",
				value: "DOCUMENT_EXTRACTION_NER_TABLE_CELL"
			}
		],
		EXCEL: [
			{
				label: "Table Classification",
				value: "EXCEL_EXTRACTION_TABLE_CLASSIFICATION"
			},
			{
				label: "Table Header Extraction",
				value: "EXCEL_EXTRACTION_NER_TABLE"
			},
			{
				label: "Header Extraction",
				value: "EXCEL_EXTRACTION_NER_HEADER"
			},
			{
				label: "Table Cell Extraction",
				value: "EXCEL_EXTRACTION_NER_TABLE_CELL"
			}
		]
	}
}

constants.MODEL_SUBTYPES.CONTROLLER = {
	"DOCUMENT_EXTRACTION_NER_LAYOUTLM_HEADER": "layoutlmv2",
	"DOCUMENT_EXTRACTION_DETECTORS_HEADER": "mmdetection",
	"DOCUMENT_EXTRACTION_DETECTRON_TABLE": "pytorch_detectron2_table_v2",
	"DOCUMENT_EXTRACTION_DETECTRON_TABLE_WITH_ROWS": "pytorch_detectron2_table_v2",
	"DOCUMENT_EXTRACTION_DETECTRON_TABLE_WITH_COLUMNS": "pytorch_detectron2_table",
	"DOCUMENT_EXTRACTION_DETECTRON_COMMON_TABLE": "pytorch_detectron2_common_table",
	"CLAIM_CLASSIFICATION": "document_classification",
	"DOCUMENT_EXTRACTION_LAYOUTLMV2": "layoutlmv2",
	"EXCEL_EXTRACTION_LAYOUTLM_HEADER": "layoutlmv2",
	"EXCEL_EXTRACTION_DETECTORS_HEADER": "mmdetection",
	"EXCEL_EXTRACTION_DETECTRON_TABLE": "pytorch_detectron2_table_v2",
	"EXCEL_EXTRACTION_DETECTRON_TABLE_WITH_ROWS": "pytorch_detectron2_table_v2",
	"EXCEL_EXTRACTION_DETECTRON_TABLE_WITH_COLUMNS": "pytorch_detectron2_table",
	"EXCEL_EXTRACTION_LILT": "lilt",
	"DOCUMENT_EXTRACTION_HEADER": "struct",
	"BASE_DOCUMENT_EXTRACTION_HEADER": "struct"
}

constants.LOOKUP = {
    HISTORY_STATUS: {
        NEW: "new",
        CURRENT: "current",
        PREVIOUS: "previous",
        REMOVED: "removed"
    }
}

export default constants;