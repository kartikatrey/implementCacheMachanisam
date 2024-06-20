const PasswordPolicies = [
	{
		label: "Password Minimum Length",
		key: 'password_minimum_length',
		description: 'If you enable the "Password Minimum Length" option, you can add a minimum length requirement for passwords.',
		default: {
			"enable": true,
			"value": 6
		}
	},
	{
			label: "Include Uppercase Letters",
			key: 'include_upper_case',
			description: 'If you enable the "Include Uppercase Letters" option, Password must contain at least one uppercase character(e.g. A-Z).',
			default: {
				"enable": true
			}
		},
		{
			label: "Include Lowercase Letters",
			key: 'include_lower_case',
			description: 'If you enable the "Include Lowercase Letters" option, Password must contain at least one lowercase letter(e.g. a-z).',
			default: {
				"enable": true
			}
		},
		{
			label: 'Include Numbers',
			key: 'include_numbers',
			description: "If you enable the 'Include Numbers' option, Password must contain at least one number(e.g. 0-9).",
			default: {
				"enable": true
			}
		}, {
			label: "Include  Special characters",
			key: 'include_special_character',
			description: 'If you enable the "Include  Special characters" option, Password must contain at least one special character(e.g., ! @ # $ % ^ &).',
			default: {
				"enable": true
			}
		},
	]

export default PasswordPolicies;
