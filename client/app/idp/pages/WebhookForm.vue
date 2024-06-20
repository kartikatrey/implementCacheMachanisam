<template>
	<el-main class="kp-main webhook-form-container">
		<section class="page-body">
			<div class="page-title">
				<el-button
					cid="form-header-back"
					class="back-button"
					icon="mdi mdi-arrow-left-circle-outline"
					v-on:click="$router.push('/idp/webhook/list')"
				>
				</el-button>
				<span class="page-title-text"> {{ pageTitle }}</span>
				<span>
					Add new document assignment rule and edit existing
				</span>
			</div>

			<section class="form-page-container" id="webhook-form">
				<div class="panel">
					<div class="panel-body">
						<el-form
							:model="form"
							:rules="formRules"
							ref="form"
							label-position="left"
							label-width="120px"
						>
						<div class="grouping-tile">General  configuration</div>
							<!-- Name -->
							<el-row :gutter="40">
								<el-col :span="12">
									<div class="kp-form-group">
										<el-form-item prop="name" label="Name">
											<el-input
												name="name"
												cid="webhook-name"
												v-model="form.name"
												placeholder="Webhook name"
											></el-input>
										</el-form-item>
									</div>
								</el-col>
						
								<el-col :span="12">
									<div class="kp-form-group">
										<el-form-item
											label="Events"
											class="inline-label-item"
											prop="events"
										>
											<el-select
												v-model="form.events"
												class="select-box"
												multiple
												cid="webhook-events"
												collapse-tags
												placeholder="Select events"
											>
												<el-option
													v-for="(item,
													index) in stages"
													:key="item"
													:label="item"
													:cid="
														'doc-setup-form-stage-tab_' +
															index
													"
													v-bind:value="item"
												></el-option>
											</el-select>
										</el-form-item>
									</div>
								</el-col>
							</el-row>
							
							<!-- Username -->
							<el-row :gutter="40">
								<el-col :span="12">
									<div class="kp-form-group">
										<el-form-item
											prop="username"
											label="Username"
										>
											<el-input
												name="username"
												cid="webhook-user-name"
												v-model="form.basic_auth_username"
												placeholder="Enter username"
											></el-input>
										</el-form-item>
									</div>
								</el-col>
							
								<el-col :span="12">
									<div class="kp-form-group password-item">
										<el-form-item
											prop="password"
											label="Password"
										>
											<el-input
												name="password"
												:type="passwordInputType"
												cid="webhook-password"
												v-model="form.basic_auth_password"
												placeholder="Enter password"
											>
												<el-button
													slot="suffix"
													class="icon-eye password-button"
													v-if="!visiblePassword"
													v-on:click="showPass()"
													icon="mdi mdi-eye-outline"
												></el-button>
												<el-button
													slot="suffix"
													class="password-button"
													v-if="visiblePassword"
													v-on:click="showPass()"
													icon="mdi mdi-eye-off-outline"
												></el-button>
											</el-input>
										</el-form-item>
									</div>
								</el-col>
							</el-row>

								<!-- URL -->
							<el-row :gutter="40">
								<el-col :span="12">
									<div class="kp-form-group">
										<el-form-item prop="url" label="URL">
											<el-input
												name="url"
												cid="webhook-name"
												v-model="form.url"
												placeholder="Enter URL"
											></el-input>
										</el-form-item>
									</div>
								</el-col>
							</el-row>

							<!-- Is Enaled -->
							<el-row :gutter="40">
								<el-col :span="12">
									<div class="kp-form-group">
										<el-form-item
											class="inline-label-item toggle-switch"
											prop="active"
											label="Active"
										>
											<toggle-button
												:sync="true"
												:labels="{
													checked: 'YES',
													unchecked: 'NO'
												}"
												cid="webhook-active"
												v-model="form.active"
											></toggle-button>
										</el-form-item>
									</div>
								</el-col>
							</el-row>

						
							<!-- Custom headers -->
							<el-row :gutter="40">
								<el-col :span="24">
									<div class="kp-form-group">
										<el-form-item
											prop="custom_headers"
											label="Custom headers"
										>
											<KeyValueInput
												v-model="form.custom_headers"
												:options="keyValueInputOptions"
											>
											</KeyValueInput>
										</el-form-item>
									</div>
								</el-col>
							</el-row>
						</el-form>
					</div>
					<!-- | panel body -->
					<footer>
						<div></div>
						<div>
							<el-button
								cid="doc-assignemnt-cancel"
								v-on:click="$router.push('/idp/webhook/list')"
								size="small"
							>
								Cancel
							</el-button>
						</div>
						<div>
							<el-button
								size="small"
								cid="doc-assignemnt-save"
								v-on:click="save"
								type="primary"
							>
								Save
							</el-button>
						</div>
					</footer>
					<section v-if="recordId">
						<div class="table-wrap">
							<data-table :parameters="tableParams"></data-table>
						</div>
					</section>
				</div>
				<!-- | panel -->
			</section>
			<!-- | form-page-container -->
		</section>
	</el-main>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import EventBus from "@/EventBus";
import _ from "lodash";
import KeyValueInput from "../components/KeyValueInput.vue";
import WebhookService from "@/idp/services/WebhookService.js";
import Constants from "@/resources/Constants";
export default {
	name: "DocumentAssignmentRuleForm",
	components: { KeyValueInput, DataTable },
	data() {
		var EmptyValueValidator = (rule, value, callback) => {
			if (value && ("" + value).trim() === "") {
				callback(new Error("Please enter valid label name"));
			} else {
				callback();
			}
		};
		var validateKeyValuePair = (rule, value, callback) => {
			if (value.length == 0) {
				return callback();
			}
			setTimeout(() => {
				if (value.constructor === Array && value.length > 0) {
					const isEmpty = _.find(value, item => {
						if (!item.key || !item.value) {
							return true;
						}
					});
					if (isEmpty) {
						return callback(
							new Error("Please enter custom headers")
						);
					}
					callback();
				} else {
					callback(new Error("Please enter custom headers"));
				}
			}, 1000);
		};

		return {
			stages: Constants.DOCEX.ALL_STAGES,
			visiblePassword: false,
			passwordInputType: "password",
			disableSave: false,
			form: {
				active: true,
				custom_headers: []
			},
			pageTitle: "Webhook",
			formRules: {
				name: [
					{
						validator: EmptyValueValidator,
						trigger: "blur",
						message: "Please provide document assignment rule name"
					},
					{
						required: true,
						message: "Please provide document assignment rule name",
						trigger: "blur"
					}
				],
				active: [
					{
						validator: EmptyValueValidator,
						trigger: "blur"
					}
				],
				events: [
					{
						validator: EmptyValueValidator,
						trigger: "change",
						message: "Please select events"
					},
					{
						required: true,
						message: "Please select events",
						trigger: "change"
					}
				],
				url: [
					{
						validator: EmptyValueValidator,
						trigger: "blur",
						required: true,
						message: "Please enter URL"
					},
					{
						required: true,
						message: "Please enter url",
						trigger: "blur"
					}
				],
				basic_auth_username: [
					{
						validator: EmptyValueValidator,
						trigger: "blur",

						message: "Please enter username"
					}
				],
				basic_auth_password: [
					{
						validator: EmptyValueValidator,
						trigger: "blur",

						message: "Please enter password"
					}
				],
				custom_headers: [
					{
						validator: validateKeyValuePair,
						trigger: "blur",

						message: "Please enter values"
					}
				]
			},
			keyValueInputOptions: {
				addButtonTitle: "Add header"
			},
			recordId: ""
		};
	},
	watch: {},
	computed: {
		tableParams() {
			return {
				apiName: `/portal/api/table/de_webhook_log`,
				queryParam: {
					webhook_id: this.recordId
				},
				customfilter: false,
				pageTitle: "Logs",
				tableName: "de_webhook_log",
				enableExport: false,
				isRestify: true,
				limit: 10,
				addButtonConfig: false
			};
		}
	},
	methods: {
		showPass() {
			this.visiblePassword = !this.visiblePassword;
			this.visiblePassword
				? (this.passwordInputType = "text")
				: (this.passwordInputType = "password");
		},
		async save() {
			try {
				this.disableSave = true;
				let valid = await this.$refs.form.validate().catch(error => {});
				if (!valid) {
					// this.$resetLoader();
					this.disableSave = false;
					return;
				}
				this.$setLoader({
					target: "#webhook-form",
					spinner: "el-icon-loading"
				});
				const headers = [];
				this.form.custom_headers = _.each(
					this.form.custom_headers,
					item => {
						if (item.key && item.value) {
							headers.push(item);
						}
					}
				);
				this.form.custom_headers = headers;
				const response = await WebhookService.save(this.form);
				if (response.status == 200 || response.status == 201) {
					this.form = response.data;
					this.notifySuccess("Webhook saved successfully");
				} else {
					this.notifyError("Webhook not saved !");
				}
				this.$router.push('/idp/webhook/list')
			} catch (e) {
				console.log(e);
			} finally {
				this.$resetLoader();
			}
		},
		async initByRecordId() {
			this.$setLoader({
				target: "#webhook-form",
				spinner: "el-icon-loading"
			});
			try {
				let data = await WebhookService.fetchById(this.recordId);
				this.form = Object.assign({}, this.form, data);
			} catch (e) {
				console.log(e);
			} finally {
				this.$resetLoader();
			}
		}
	},
	async beforeMount() {
		this.$store.commit("setDisplayIdpTree",false);
		this.$store.commit("setDisplayIdpNavbar",true);
		this.recordId = this.$route.query.id;
		if (!this.recordId) return;
		this.isEditMode = true;
		this.initByRecordId();
	}
};
</script>

<style lang="scss">
@import "../_idpGlobal";

.kp-main {
	.badge-Success {
		background-color: white;
		border-radius: 10px;
		color: rgba(66, 240, 153, 0.7);
		display: inline-block;
		font-size: 12px;
		height: 18px;
		line-height: 18px;
		padding: 0 6px;
		text-align: center;
		white-space: nowrap;
		border: 1px solid rgba(66, 240, 153, 0.7);
		width: 45px;
	}
}

.webhook-form-container {
	.form-page-container {
		.toggle-switch {
			.vue-js-switch .v-switch-label.v-right {
				right: 56px;
			}
		}
		.password-item {
			.password-button {
				padding: 0px;
				border: none;
				background: transparent;
			}
		}
		.table-wrap {
			padding: 2rem;
			border-top: var(--border-lg) solid var(--brand-05);
		}
	}
}
</style>
