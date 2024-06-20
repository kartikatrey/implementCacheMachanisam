<template>
	<el-main class="kp-main">
		<section class="page-body">
			<div class="page-title">
				<el-button
					cid="form-header-back"
					icon="mdi mdi-arrow-left-circle-outline"
					v-on:click="onBack"
				></el-button>
				<span class="page-title-text" v-if="form._id"
					>Edit {{ pageTitle }}
				</span>
				<span class="page-title-text" v-else>Add {{ pageTitle }}</span>
			</div>
			<section class="form-page-container">
				<div class="panel">
					<div class="panel-body">
						<el-form
							label-position="left"
							:model="form"
							ref="form"
							label-width="120px"
							:rules="formRules"
						>
							<ConfirmModel ref="model"> </ConfirmModel>
							<div class="grouping-tile">
								Menu details
							</div>
							<el-row :gutter="40">
								<el-col :span="12">
									<div class="kp-form-group">
										<el-form-item
											class="control-label col-sm-2"
											prop="label"
											label="Label"
										>
											<el-input
												cid="user-form-name"
												class="form-control"
												v-model="form.label"
												:rows="2"
												placeholder
											></el-input>
										</el-form-item>
									</div>
								</el-col>
								<el-col :span="12">
									<div class="kp-form-group">
										<el-form-item
											class="control-label col-sm-2"
											prop="url"
											label="URL"
										>
											<el-input
												cid="user-form-name"
												class="form-control"
												v-model="form.url"
												:rows="2"
												placeholder
											></el-input>
										</el-form-item>
									</div>
								</el-col>
							</el-row>

							<el-row :gutter="40">
								<el-col :span="12">
									<div class="kp-form-group">
										<el-form-item
											class="kp-form-field-label"
											prop="parent_menu_id"
											label="Parent menu"
										>
											<el-select
												placeholder="Please select Parent Menu"
												v-model="form.parent_menu_id"
											>
												<el-option
													v-for="menu in menuList"
													:key="menu._id"
													:label="menu.label"
													:value="menu._id"
													label-width="170px"
												></el-option>
											</el-select>
										</el-form-item>
									</div>
								</el-col>

								<el-col :span="12">
									<div class="kp-form-group">
										<el-form-item
											class="control-label col-sm-2"
											prop="class"
											label="Class"
										>
											<el-input
												cid="user-form-name"
												class="form-control"
												v-model="form.class"
												:rows="2"
												placeholder
											></el-input>
										</el-form-item>
									</div>
								</el-col>
							</el-row>
							<el-row :gutter="40">
								<el-col :span="12">
									<div class="kp-form-group">
										<el-form-item
										class="control-label col-sm-2"
										prop="order"
										label="Order"
										>
										<el-input
											cid="user-form-order"
											class="form-control"
											v-model="form.order"
											:rows="2"
											placeholder
										>	</el-input>
										</el-form-item>
									</div>
								</el-col>
								<el-col :span="12">
									<div class="kp-form-group">
										<el-form-item
											class="control-label col-sm-2"
											prop="roles"
											label="Roles"
										>
											<el-select
												v-model="form.roles"
												class="select-box"
												cid="user-form-roles-select"
												multiple
												collapse-tags
												placeholder="Select Role"
											>
												<el-option
													v-for="(_role,
													index) in rolesList"
													:cid="
														'user-form-roles_' +
															index
													"
													:key="_role.value"
													:label="_role.label"
													:value="_role.value"
													label-width="170px"
												></el-option>
											</el-select>
										</el-form-item>
									</div>
								</el-col>
							</el-row>
							<el-row :gutter="40">
								<el-col :span="12">
									<el-form-item
										class="control-label col-sm-2"
										prop="hidden"
										label="Hidden"
									>
										<el-switch v-model="form.hidden">
										</el-switch>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<div class="kp-form-group">
										<el-form-item label="Active" prop="active">
										<el-checkbox v-model="form.active"> </el-checkbox>
										</el-form-item>
									</div>
                				</el-col>
							</el-row>
						</el-form>
					</div>
					<footer>
						<div></div>
						<div>
							<el-button size="small" v-on:click="onBack"
								>Cancel</el-button
							>
						</div>
						<div>
							<el-button
								v-if="isSaveActionAllowed" 
								size="small"
								id="register-btn"
								v-on:click="onSave"
								:disabled="disableRegister"
								type="primary"
								>Save</el-button
							>
						</div>
					</footer>
				</div>
			</section>
		</section>
		<VersionRelatedList  :id="form._id"  title="Menus versions"></VersionRelatedList>

	</el-main>
</template>

<script>
import MenuService from "@/services/MenuService";
import _ from "lodash";
import ConfirmModel from "@/components/ConfirmModel";
import VersionRelatedList from "@/idp/components/VersionRelatedList.vue";
import formMixin from "@/mixins/formMixin.js";

export default {
	name: "UserForm",
	mixins: [formMixin],
	components: {
		ConfirmModel,
		VersionRelatedList
	},
	data() {
		return {
			loading: false,
			form: {
				label: "",
				url: "",
				class: "",
				roles: [],
				order: "",
				parent_menu_id: null,
				hidden: false
			},
			pageTitle: "menu",
			rolesList: [],
			menuList: [],
			cp_menu: {},
			disableRegister: false,
			isSaveActionAllowed: true,
			requiredParam: {},
			cacheDataModal: {
				cachedForm: {},
				isFormEdited: false,
				isInitialized: false
			},
			formRules: {
				label: [
					{
						required: true,
						message: "Please input label",
						trigger: "change"
					}
				],
				url: [
					{
						required: true,
						message: "Please input url",
						trigger: "change"
					}
				],
				class: [
					{
						required: true,
						message: "Please input class",
						trigger: "change"
					}
				],
				roles: [
					{
						required: false,
						message: "Please input roles",
						trigger: "change"
					}
				],
				parent_menu_id: [
					{
						required: false,
						message: "Please select parent menu",
						trigger: "change"
					}
				],
				order: [
					{
						required: false,
						message: "Please input order",
						trigger: "change"
					}
				]
			}
		};
	},
	watch: {},
	methods: {
		onBack() {
			this.$router.push("/idp/menu_lists");
		},
		async onSave() {
			this.disableRegister = true;
			this.$setLoader({
				target: "#register-btn",
				spinner: "el-icon-loading"
			});
			let valid = await this.$refs.form.validate().catch(error => {});
			if (!valid) {
				this.$resetLoader();
				this.disableRegister = false;
				return;
			}
			return this.insertRecord();
		},
		displayList() {
			this.$router.push({
				path: "/idp/menu_lists"
			});
		},

		insertRecord() {
			let self = this;
			MenuService.saveMenu(this.form)
				.then(response => {
					let successMessage = this.form._id
						? "Menu updated successfully!!"
						: "Menu saved successfully!!";
					this.form = response;
					self.notifySuccess(successMessage);
					this.$router.push({ path: "/idp/menu_lists" });
				})
				.catch(error => {
					self.notifyError(error);
				})
				.finally(() => {
					self.$resetLoader();
					self.disableRegister = false;
				});
		},
		async fetchRoles() {
			try {
				const roles = await MenuService.getRoles({
					active: true
				});
				this.rolesList = (roles || []).map(role => {
					return { value: "" + role._id, label: "" + role.label };
				});
			} catch (e) {
				console.error(e);
			}
		},

		async fetchDropdownOptions() {
			this.loading = true;
			await Promise.all([this.fetchRoles()]);
			this.loading = false;
		},

		async fetchMenuList() {
			this.menuList = await MenuService.fetchMenuList().catch(error => {
				this.notifyError("Error while fetching menu list");
			});
		},

		async init(recordId) {
			this.fetchDropdownOptions();
			if (!recordId) {
				return;
			}
			try {
				let data = await MenuService.fetchById(recordId);
				this.form = Object.assign({}, this.form, data);
			} catch (error) {
				this.notifyError("Error");
			}
		}
	},

	async beforeMount() {
		this.isSaveActionAllowed = await this.isSaveActionPermitted('cp_menu');
		this.fetchMenuList();
		this.$store.commit("setDisplayIdpTree",false);
		this.$store.commit("setDisplayIdpNavbar",true);
		let recordId = this.$route.query.id;
		this.init(recordId);
	},
	beforeRouteLeave: function(to, from, next) {
		next();
	}
};
</script>

<style lang="scss">
@import "../_idpGlobal";

.kp-form-group {
	.vue-tel-input {
		height: 22px;
		background-color: var(--dark-10);
		input {
			background-color: var(--dark-10);
			font-size: var(--font-sm);
		}
	}

		.el-input__prefix,
		.el-input__suffix {
			top: -6px !important;
		}
}
</style>
