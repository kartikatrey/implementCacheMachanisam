let config = {

	FRAUD_DETECTIONS: [{
			label: "Spike in volume",
			key: 'spike_in_volume',
			description: 'Monitoring vendor invoice volume is one way to alert you to abnormal behavior. Rapid invoice volume increases may indicate a legitimate increase in business, but also may indicate that a fraudster has become more confident in stealing money. Either way, the increase may warrant further investigation. Suppose a vendor has 2 invoices one month and 70 the next – you may want to know why even if the reason is not a fraudulent one',
			default: {
				"enable": true
			}
		},
		{
			label: 'Duplicate payments',
			key: 'duplicate_payments',
			description: "Many software packages have some controls over duplicate invoices, but it usually takes some in-depth querying to find all duplicates. For example, many accounting packages do a duplicate invoice check and prevent you from keying in a duplicate invoice number for the same vendor. But just add an “A” to the invoice number or change a penny and you are on your way to a duplicate payment. Another common mistake is found in vendor files; duplicate vendor numbers for the same vendor are the number one cause of duplicate payments.",
			default: {
				"enable": true
			}
		}, {
			label: "Anomaly detection",
			key: 'anomaly_detection',
			description: 'Identify invoices that are way above average for a particular vendor. Suppose a vendor normally has invoices ranging from $1,000 to $3,000; suddenly an invoice shows up for $25,000. You may want to investigate this abnormality and can do so using this alert pattern.',
			default: {
				"enable": true
			}
		},
		// {
		// 	label: "Unusual payment date",
		// 	key: 'unusual_payment_date',
		// 	description: 'Turn on to handle Unusual payment date',
		// 	default: {
		// 		"enable": true
		// 	}
		// },
		{
			label: "Just below approval limit",
			key: 'just_below_approval_limit',
			description: 'People who commit fraud say, an A/P clerk knows the different dollar thresholds for management approval. For example, a supervisor may only be allowed to approve invoices of $3,000 or less, while a manager may be allowed to approve invoices of $10,000 or less, and so on.Suppose this A/P clerk and a manager decide to skim off some extra dollars together. Create an invoice just below the approval level of that manager: $9,998 when the approval level is $10,000; or $2,978 when the approval level is $3,000',
			default: {
				"enable": true,
				"approval_limit": 3000
			}
		},
		{
			label: "Phantom vendor",
			key: 'phantom_vendor',
			description: 'Cross-check your vendor and employee files to see if perhaps an employee has set up a fictitious vendor. Try merging your vendor file and employee file by the following variables: Address, Tax ID Number, Phone Number, Bank Routing Numbe',
			default: {
				"enable": false
			}
		}
	]
};

// {
// 	label: 'Benfords law',
// 	key: 'benfords_law',
// 	description: 'to enable benfords law',
// 	default: {
// 		"enable": true
// 	}
// },

export default config;
