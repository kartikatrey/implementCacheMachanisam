export default {
	"DOCEX_MODEL_TYPE":[
		{
		"name":"Invoice",
		"value":"Invoice"
		},
	{
		"name":"Po",
		"value":"Po"
	},
	{
		"name":"Custom",
		"value":"Custom"
	}],
	"TABLE_NAMES": {
		MN_TRAIN_DATA: "trn_mn_data",
		QNA_TRAIN_DATA: "trn_qna_data",
		NER_TRAIN_DATA: "trn_ner_data",
		ROUTER_TRAIN_DATA: "trn_router_data",
		TRAINING_STATUS: "trn_status",
		REQUIRED_ENTITIES: "entity",
		INTENT_INFO: "intent_info",
		CUSTOMERS: "customer",
		MASTER_SYSTEM: "master_system",
		ENTITY_TAG_LIST: "entity_tag_list",
		SCRIPTS: "script",
		CUSTOMER_FEEDBACK: "chatlog"
	},
	
	USER_TYPES:{
		"QNA":"QNA"
	},
	// update server side constant files as well
	"DOMAINS": [{
		value: "ITSM-FreshService",
		label: "ITSM-FreshService"
	},
	{
		value: "ITSM-SNOW",
		label: "ITSM-SNOW"
	},
	{
		value: "CRM-SFDC",
		label: "CRM-SFDC"
	},
	{
		value: "GREETING",
		label: "GREETING"
	},
	{
		value: "HR-Policies",
		label: "HR-Policies"
	},
	{
		value: "CHAT-LEADGEN",
		label: "CHAT-LEADGEN"
	},
	{
		value: "AGILE-JIRA",
		label: "AGILE-JIRA"
	},
	{
		value: "AGILE-CONFLUENCE",
		label: "AGILE-CONFLUENCE"
	},

	{
		value: "OFFICE-OFFICE365",
		label: "OFFICE-OFFICE365"
	},
	{
		value: "AGILE-BITBUCKET",
		label: "AGILE-BITBUCKET"
	},
	{
		value: "ERP-ORACLE",
		label: "ERP-ORACLE"
	},

	{
		value: "AGILE-BAMBOO",
		label: "AGILE-BAMBOO"
	},
	{
		value: "ERP-JOSS",
		label: "ERP-JOSS"
	},
	{
		value: "QNA-SALES",
		label: "QNA-SALES"
	},
	{
        value: "ERP-NETSUITE",
        label: "ERP-NETSUITE"
    }
	],
	"REQUIRED_ENTITY": {
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
	},
	"APPROVAL_CONNECTION_LABELS": ["Approve", "Reject"],
	"APPROVAL_ACTIONS":[
		{
			value: "Approve",
			label: "Approve"
		},
		{
			value: "Reject",
			label: "Reject"
		}
	],
	"APPROVAL_SCRIPTS": {
		"Approve": `(() => {
			if (context.nodeContext.get("resume_payload").approval_status == "Approved") {
				done(null, true);
				return
			}
			done(null, false);
		})()`,
		"Reject": `(() => {
			done(null, true);
		})()`
	},

	IDP_APPROVAL_SCRIPTS: {
		Approve: `(() => {
            const approvalInfo = context.nodeContext.get('approval');
            if (approvalInfo && approvalInfo.approval_status == 'Approved') {
                done(null, true);
                return;
            };
            done(null, false);
        })()`,

		Reject: `(() => {
            const approvalInfo = context.nodeContext.get('approval');
            if (approvalInfo && approvalInfo.approval_status == 'Rejected') {
                done(null, true);
                return;
            };
            done(null, false);
        })()`
	},

    IDP_APPROVAL_AWAIT_SCRIPTS: {
        Approve: `(() => {
            let isApproved = false;
            const approvalInfo = context.nodeContext.get('approval');
            if (approvalInfo && approvalInfo.approval_status == 'Approved') {
                isApproved = true;
            };
            return isApproved;
        })()`,

        Reject: `(() => {
            let isRejected = false;
            const approvalInfo = context.nodeContext.get('approval');
            if (approvalInfo && approvalInfo.approval_status == 'Rejected') {
                isRejected = true;
            };
            return isRejected;
        })()`
    },

	"KB_CONNECTION_LABELS": ["Yes", "No"],
	"KB_SCRIPTS": {
		"Yes": `(() => {
			console.log("###################################################");
			if(context.nodeContext.get("USER_INPUT")=='Yes')
			{
				console.log("Kb solved");
				done(null, true);
				return;
			}
			done(null,false);
		})()`,
		"No": `(() => {
			console.log("No it is not solved..")
			done(null, true);
		})()`
	},
	"APPROVAL_ACTION_LIST" : [{
		value: "STATIC",
		label: "STATIC"
	}, {
		value: "LOOKUP",
		label: "LOOKUP"
	}, {
		value: "ADVANCED",
		label: "SCRIPT/CODE"
	}],
};
