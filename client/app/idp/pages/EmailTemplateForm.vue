<template>
	<el-main class="kp-main slushbucket_container">
		<section class="page-body">
			<div class="page-title">
				<el-button cid="form-header-back" v-on:click="displayList" icon="mdi mdi-arrow-left-circle-outline">
				</el-button>
				<span class="page-title-text">{{ pageTitle }}</span>
			</div>
			<section v-loading="loading" class="form-page-container tabs-page-container">
				<div class="panel">
					<div class="panel-body" v-loading="loading">
						<el-row>
							<el-col>
								<el-form :label-position="labelPosition" label-width="100px" :model="email_template"
									:rules="validationRules" ref="ruleForm">
									<ConfirmModel ref="model"></ConfirmModel>
									<el-row :gutter="72">
										<el-col :span="8">
											<div class="kp-form-group">
												<el-form-item class="control-label col-sm-2" label="Subject"
													prop="subject">
													<el-input v-model="email_template.subject" class="form-control"
														placeholder="">
													</el-input>
												</el-form-item>
											</div>
											<div class="kp-form-group">
												<el-form-item class="control-label col-sm-2" label="Type" prop="type">
													<el-input v-model="email_template.type" placeholder=""></el-input>
												</el-form-item>
											</div>
										</el-col>
										<el-col :span="8">
											<div class="kp-form-select-1 kp-form-group">
												<el-form-item class="control-label col-sm-2" prop="customer_id"
													label="Customer">
													<el-select placeholder="Please select customer"
														v-model="email_template.customer_id" clearable>
														<el-option v-for="customer in customers" :value="customer._id"
															:key="customer._id" :label="customer.customer_name">
														</el-option>
													</el-select>
												</el-form-item>
											</div>
										</el-col>
									</el-row>
									<el-row :gutter="72">
										<el-col :span="16">
											<div class="kp-form-group">
												<el-form-item class="control-label col-sm-2" label="Body"
													prop="template">
													<TextEditor :sourceData="email_template.template">
													</TextEditor>
												</el-form-item>
											</div>
										</el-col>
									</el-row>
								</el-form>
							</el-col>
						</el-row>
					</div>
					<footer>
						<div></div>
						<div>
							<el-button size="small" v-on:click="displayList">Cancel</el-button>
						</div>
						<div>
							<el-button size="small" id="register-btn" v-on:click="save" type="primary">Save
							</el-button>
						</div>
					</footer>
				</div>
			</section>
		</section>
		<VersionRelatedList :id="email_template._id"  title="Email template versions"></VersionRelatedList>
	</el-main>
</template>

<script>
import _ from "lodash";
import CustomerService from "@/idp/services/CustomerService";
import CommonService from "@/services/CommonService";
import constants from "@/resources/Constants";
import ConfirmModel from "@/components/ConfirmModel";
import EventBus from "@/EventBus";
import TextEditor from '@/idp/components/TextEditor'
import VersionRelatedList from "@/idp/components/VersionRelatedList.vue";
export default {
	name: "EmailTemplateFrom",
	components: {
		ConfirmModel,
		TextEditor,
		VersionRelatedList
	},
	data() {
		return {
			labelPosition: "top",
			loading: false,
			cacheDataModal: {
				cachedForm: {},
				isFormEdited: false,
				isEditForm: false,
				isNewForm: false
			},
			requiredParam: {},
			isFormValid: true,
			pageTitle: "New template",
			email_template: {},
			customers: [],
			endpoint: constants.EMAIL_TEMPLATE_ENDPOINT,
			validationRules: this.setValidationRules(),
		};
	},
	watch: {
		email_template: {
			handler(newVal, oldVal) {
				if (this.cacheDataModal.isNewForm || this.cacheDataModal.isEditForm) {
					this.cacheDataModal.isFormEdited =
						JSON.stringify(this.cacheDataModal.cachedForm) !==
						JSON.stringify(this.email_template);
				}
			},
			deep: true,
		}
	},
	methods: {
		async init() {
			const templateId = this.getTemplateIdFromUrl();
			if (templateId) {
				let email_template = await CommonService.fetchById(
					this.endpoint,
					templateId
				).catch(error => {
					this.notifyError("Error while fetching template data");
				});

				this.email_template =
					(email_template &&
						_.defaultsDeep(email_template, this.email_template)) ||
					this.email_template;

				this.cacheDataModal.isEditForm = true;
				this.cacheDataModal.isFormEdited = false;
				this.cacheDataModal.cachedForm = { ...this.email_template };
				this.pageTitle = "Edit template";
			} else {
				this.cacheDataModal.isNewForm = true;
				this.cacheDataModal.isFormEdited = false;
				this.cacheDataModal.cachedForm = { ...this.email_template };
			}
		},
		async fetchCustomers() {
			let customers = await CustomerService.find().catch(error => {
				this.notifyError("Error while fetching customer!!");
			});
			this.customers = _.sortBy(customers, "customer_name");
		},
		async save() {
			let isValid = await this.$refs.ruleForm.validate().catch(error => {
				this.notifyError("Please resolve the errors before proceeding");
			});
			this.isFormValid = isValid;
			if (this.email_template.customer_id === "")
				this.email_template.customer_id = null;
			let email_template =
				isValid &&
				(await CommonService.save(this.endpoint, this.email_template).catch(
					error => {
						this.isFormValid = false;
						this.notifyError("Error while saving template data");
					}
				));
			if (email_template) {
				this.cacheDataModal.isFormEdited = false;
				this.notifySuccess("Template saved successfully");
				this.displayList();
			}

		},
		getTemplateIdFromUrl() {
			return this.$route.query.id || "";
		},
		displayList() {
			this.$router.push({
				path: "/idp/email-template-list"
			});
		},
		setValidationRules() {
			return {
				subject: [
					{
						required: true,
						message: "Please input subject",
						trigger: "blur"
					}
				],
				type: [
					{
						required: true,
						message: "Please input type",
						trigger: "blur"
					}
				],
				template: [
					{
						required: true,
						message: "Please input body",
						trigger: "blur"
					}
				]
			};
		},
		registerEvents() {
			EventBus.$on("editedBody", (value) => {
				this.email_template.template = value;
			});
		},
	},
	beforeMount() {
		this.$store.commit("setDisplayIdpTree",false);
		this.$store.commit("setDisplayIdpNavbar",true);
		let user = this.$store.getters.user;
		if (user.roles.includes("admin")) {
			this.showList = true;
		}
		this.init();
		this.fetchCustomers();
		window.addEventListener("beforeunload", event => {
			if (!this.cacheDataModal.isFormEdited) return;
			event.preventDefault();
			event.returnValue = "";
		});
	},
	mounted() {
		this.registerEvents();
	},
	beforeRouteLeave: function (to, from, next) {
		if (this.cacheDataModal.isFormEdited) {
			return this.$refs.model.open(next);
		} else {
			return next();
		}
	}
};
</script>

<style lang="scss" >
@import "../_idpGlobal";
@import "../../assets/scss/_variables";
@import '../../../../node_modules/vue-wysiwyg/dist/vueWysiwyg.css';

.kp-form-group {
	input {
		background-color: var(--dark-10);
		font-size: var(--font-sm);
	}
}
</style>
