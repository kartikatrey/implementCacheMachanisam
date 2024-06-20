<template>
	<el-main class="kp-main">
		<section class="page-body">
			<div class="page-title">
				<span class="page-title-text"> {{ pageTitle }}</span>
			</div>
			<section class="form-page-container">
				<div class="panel">
					<div class="panel-body">
						<el-form
							class="setup-form"
							label-position="left"
							:model="form"
							ref="form"
							:rules="formRules"
							label-width="200px"
						>
							<el-row :gutter="40">
								<el-col :span="12">
									<el-form-item
										prop="mfa_enabled"
										label="Enable MFA"
									>
										<el-switch
											v-model="form.mfa_enabled"
										>
										</el-switch>
									</el-form-item>
								</el-col>
							</el-row>

							<el-row :gutter="40">
								<el-col :span="12">
									<el-form-item
										label="Session Timeout(Minutes)"
									>
										<el-input
											cid="cust-policies-form-session-timeout"
											name="host"
											v-model="form.session_timeout"
											type="input"
											:rows="2"
											placeholder="Enter Session Timeout(Minutes)"
										></el-input>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row :gutter="40">
                                <el-col :span="12">
                                    <div class="kp-form-group">
										<el-form-item label="Enable Custom Password Policies" prop="password_policies.enable_custom_password_policies">
											<el-switch v-model="form.password_policies.enable_custom_password_policies"></el-switch>
										</el-form-item>
									</div>
                                </el-col>
							</el-row>
							<div v-show = "form.password_policies.enable_custom_password_policies">
								<el-row :gutter="40" v-for="(field,index) in passwordPolicyOptions">
									<el-col :span="7">
										<div  class="kp-form-group">
											{{field.label}}
											<el-tooltip :content="field.description">
												<i class="el-icon-question"></i>
											</el-tooltip>
										</div>
									</el-col>
									<el-col :span="5">
										<div  class="kp-form-group">
											<el-switch type cid="doc-setup-form-enable-approval" v-model="form.password_policies.custom_policies[field.key]['enable']" :value="field.default"></el-switch>
										</div>
									</el-col>
									<el-col :span="6" v-if="field.key == 'password_minimum_length' && form.password_policies.custom_policies['password_minimum_length']['enable']">
										<el-form-item label="Enter Password Minimum Length"></el-form-item>
									</el-col>
									<el-col :span="5"  v-if="field.key == 'password_minimum_length' && form.password_policies.custom_policies['password_minimum_length']['enable']">
										<div  class="kp-form-group">
											<el-input type="number" v-model="form.password_policies.custom_policies.password_minimum_length.value"></el-input>
										</div>
									</el-col>
								</el-row>
							</div>

							 <!--OCR configuration options-->
                            <el-row :gutter="40">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item label="OCR Type">
                                            <el-select
                                                name="ocr type"
                                                clearable
                                                filterable
                                                cid="customer-configuration-ocr-type"
                                                v-model="form.ocr_type"
                                                placeholder="Select"
                                            >
                                                <el-option
                                                    v-for="(ocrType, index) in ocrTypes"
                                                    :key="ocrType.value"
                                                    :cid="
                                                        'customer-configuration-ocr-type_' +
                                                            index
                                                    "
                                                    :value="ocrType.value"
                                                    :label="ocrType.label"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </el-col>

                                <el-col v-if="form.ocr_type == 'document_ai'" :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item label="Native PDF parsing">
                                            <el-checkbox cid="customer-configuration-documentai-pdf-parsing" v-model="form.documentai_pdf_parsing"></el-checkbox>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>
						 <!-- CC email field -->
						 <el-row>
                            <el-col :span="12" v-if="isDemoTenantUser">
                                <div class="kp-form-group">
                                    <el-form-item prop="cc_emails" cid="form-cc-mail" label="CC Email" :rules="formRules.cc_emails"  v-if="isDemoTenantUser">
                                     <el-input  cid="configuration-cc-mail " v-model="form.cc_emails" type="textarea" placeholder="E.g. john@demo.com"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                         </el-row>

						 <el-row :gutter="40" >
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item label="Enable Lookup History">
                                                    <el-select
                                                class="select-box"
                                                size="large"
                                                name="type"
                                                multiple
                                                collapse-tags
                                                v-model="form.enable_lookup_history"
                                                placeholder="Please select lookup type"
                                                >
                                                <el-option
                                                    v-for="(item, index) in lookup_types"
                                                    :key="item"
                                                    :label="item.type"
                                                    :cid="'lookup-type-tab_'+index"
                                                    v-bind:value="item.type"
                                                ></el-option>
                                                </el-select>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                    </el-row>
				       </el-form>
					</div>
					<footer>
						<div></div>
						<div class="footer-container">
							<el-button
								v-if="isSaveActionAllowed"
								cid="customer-policies-form-save"
								size="small"
								v-on:click="onSave"
								type="primary"
								>Save</el-button
							>
						</div>
					</footer>
				</div>
			</section>
		</section>
	</el-main>
</template>

<script>
import Constants from "@/resources/Constants";
import CustomerService from "@/idp/services/CustomerService";
import PasswordPolicyConfig from "@/resources/PasswordPolicyConfig";
import UserService from "@/idp/services/UserService";
import formMixin from "@/mixins/formMixin.js";
import LookupConfigService from "@/idp/services/LookupConfigService";

export default {
	name: "CustomerPoliciesForm",
	computed: {},
	mixins: [formMixin],
	data() {

		var customPasswordPolicyValidator = (rule, value, callback) => {
			// if custome policies not enabled then dont validte
			const customPolicies = this.form.password_policies.custom_policies;
			if (value && !isAnyPasswordPolicyEnabled(customPolicies)) {
				callback(new Error('Please enable at least one policy.'));
				this.notifyError("You have enabled the custom password policy option, but you have not enabled any policy.");
			};
			callback();
		};

		// Function to check if at least one policy is enabled.
		function isAnyPasswordPolicyEnabled(customPolicies) {
			for (const key in customPolicies) {
				if (customPolicies.hasOwnProperty(key) && customPolicies[key].enable) {
					return true; // If any enable key is true, return true
				}
			}
			return false;
		}

		return {
			pageTitle: "Setup",
			enable_lookup_history: [],
			lookup_types: [],
			ocrTypes: Constants.OCR_TYPES,
			isSaveActionAllowed: true,
			isDemoTenantUser: false,
			form: {
				session_timeout: "",
				mfa_enabled: false,
				password_policies: {
					enable_custom_password_policies: false,
					custom_policies: this.getPasswordPolicyDefaultValues()
				},
				ocr_type: "",
				documentai_pdf_parsing: false,
				cc_emails: ''
			},
			formRules: {
				'password_policies.enable_custom_password_policies': [
					{ validator: customPasswordPolicyValidator, trigger: 'change' }
				],
				ocrTypes: [
					{ label: "G-Vision", value: "vision" },
					{ label: "D-AI", value: "document-ai" }
				],
				cc_emails: [
					{
						required: false,
						validator: this.validateEmail,
						trigger: "blur",
					}
				]
			},
			passwordPolicyOptions: PasswordPolicyConfig,
		};
	},
	methods: {
		onSave() {
			this.$refs.form.validate(async valid => {
				try {
					if (!valid) {
						return;
					}
					let response = await CustomerService.saveCustomerConfiguration(this.form);
					if (_.get(response, "_id")) {
						this.notifySuccess("Record saved successfully.");
					}
				} catch (e) {
					console.log(e);
					this.notifyError("There is an error in saving data.");
				}
			});
		},

		async getLookupTypes(){
			this.lookup_types = await LookupConfigService.get({}, ["type"])
		},

		async init() {
			try {
				this.getUserDetails();
				let selectColumns = ["session_timeout","mfa_enabled","type","password_policies", "ocr_type","cc_emails", "enable_lookup_history"]
				const [custConfigData] = await CustomerService.getCustomerConfiguration({selectColumns:selectColumns});
				this.form = Object.assign({}, this.form, custConfigData);
				this.$refs.form.validate();
				this.getLookupTypes();
			} catch (error) {
				console.log(error);
				this.notifyError("Error while fetching data");
			}
		},
		getPasswordPolicyDefaultValues() {
			let defaultValues = {};
			const passwordPolicies = PasswordPolicyConfig;
			for (let index in passwordPolicies) {
				defaultValues[passwordPolicies[index].key] = passwordPolicies[index].default;
			};
			return defaultValues;
		},
		validateEmail(rule, value, callback) {
			// check empty value
			if (!this.form.cc_emails) {
				callback();
			}
			// Split input into individual email addresses and trim whitespace
			const delimiters = /[,\s]+/;
			const ccEmails = this.form.cc_emails.split(delimiters).map(email => email.trim()).filter(email => email !== '');
			// Validate each email address
			const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			const invalidEmails = ccEmails ? ccEmails.filter(email => !regex.test(email)) : []
			// Handle validation result
			if (invalidEmails.length === 0) {
				callback();
			}
			else {
				// error message for invalid emails
				const errorMessage = `Invalid email(s): ${invalidEmails.join(', ')}`;
				callback(new Error(errorMessage));
			}
		},
		getUserDetails() {
			// get is_demo_tenant key from vue store using userservice
			const user = UserService.getUserFromStore();
			this.isDemoTenantUser = (user && user.is_demo_tenant) || false;
		}
	},
	async beforeMount() {
		this.isSaveActionAllowed = await this.isSaveActionPermitted('customer_configuration');
		this.init();
	}
};
</script>

<style lang="scss">
@import "../_idpGlobal.scss";
.setup-form .el-form-item {
    margin-bottom: 0;
      .el-form-item__label {
        font-size: 12px;
        line-height: 28px;
      }
      .el-input {
        height: 28px;
      }
}

</style>
