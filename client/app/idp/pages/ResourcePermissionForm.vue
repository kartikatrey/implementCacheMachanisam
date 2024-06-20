<template>
	<el-main class="kp-main">
		<section class="page-body">
			<h1 class="page-title">{{ pageTitle }}</h1>

			<div class="kp-form-area">
				<div class="kp-form-panel">
					<el-form :label-position="labelPosition" label-width="100px" :model="form" :rules="formRules"
						ref="ruleForm">
						<el-row :gutter="72">
							<el-col :span="8">
								<el-form-item label="Permission name" prop="permission_name">
									<el-input v-model="form.permission_name" placeholder></el-input>
								</el-form-item>

								<el-form-item label="Resource name" prop="resource_name">
									<el-input v-model="form.resource_name" placeholder></el-input>
								</el-form-item>

								<el-form-item class="control-label col-sm-2" prop="roles" label="Roles">
									<el-select v-model="form.roles" class="select-box" cid="resource-permission-roles-select"
										multiple collapse-tags placeholder="Select Role">
										<el-option v-for="(_role, index) in rolesList" :cid="'resource-permission-roles_' + index"
											:key="_role.value" :label="_role.label" :value="_role.value"
											label-width="170px"></el-option>
									</el-select>
								</el-form-item>

								<el-form-item label="Operation" prop="operation">
									<el-select v-model="form.operation" placeholder="Select" label="Operation">
										<el-option label="Read" value="read"></el-option>
										<el-option label="Write" value="write"></el-option>
									</el-select>
								</el-form-item>

							</el-col>
						</el-row>
					</el-form>

					<el-button v-on:click.once="onSave">Save</el-button>
					<el-button>Cancel</el-button>
				</div>
			</div>
		</section>
	</el-main>
</template>

<script>

import constants from "@/resources/Constants";
import Roles from "@/idp/services/RoleService";
import EventBus from "@/EventBus";
import PermissionService from "@/idp/services/PermissionService";
// import CommonService from "@/services/CommonService";

export default {
	name: "ResourcePermissionForm",
	beforeMount() {
		this.$store.commit("setDisplayIdpTree",false);
		this.$store.commit("setDisplayIdpNavbar",true);
		this.init();
	},

	data() {
		const EmptyValueValidator = (rule, value, callback) => {
			if (value && ("" + value).trim() === "") {
				callback(new Error("Please enter valid label name"));
			} else {
				callback();
			}
		};
		return {
			pageTitle: "New resource permission",
			labelPosition: "top",
			endpoint: constants.RESOURCE_PERMISSION_ENDPOINT,
			form: {
				permission_name: "",
				resource_name: "",
				roles: [],
				operation: "",
				column_name: ""
			},
			rolesList: [],
			formRules: {
				permission_name: [
					{
						validator: EmptyValueValidator,
						trigger: "blur",
						message: "Please input permission name"
					},
					{
						required: true,
						message: "Please input permission name",
						trigger: "change"
					}
				],
				resource_name: [
					{
						validator: EmptyValueValidator,
						trigger: "blur",
						message: "Please select trigger action"
					},
					{
						required: true,
						message: "Please input resource name",
						trigger: "change"
					}
				],
				roles: [
					{
						required: true,
						message: "Please input roles",
						trigger: "blur"
					}
				],
				operation: [
					{
						required: true,
						message: "Please input operation",
						trigger: "change"
					}
				]
			}
		};
	},

	methods: {
		async onSave() {
			const isValid = await this.$refs.ruleForm
				.validate()
				.catch(error => { });

			const form =
				isValid &&
				(await PermissionService.save(this.form).catch(error => { this.notifyError("Error while saving data")}
				));
			if (form) {
				this.form._id = form._id;
				this.notifySuccess("Record saved successfully!!");
			}
		},

		async init() {
			await this.fetchRoles();
			const recordId = this.getIdFromUrl();

			if (recordId) {
				try {
					let permissionData = await PermissionService.fetchById(recordId);
					this.form = Object.assign({}, this.form, permissionData);
				} catch (error) {
					this.notifyError("Error while fetching roles data");
				}
			}
		},

		async fetchRoles() {
			try {
				const roles = await Roles.fetchRecords({
					active: true,
					is_idp: true
				});
				this.rolesList = (roles || []).map(role => {
					return { value: "" + role._id, label: "" + role.label };
				});
			} catch (e) {
				console.error(e);
			}
		},

		getIdFromUrl() {
			return this.$route.query.id || "";
		}
	}
};
</script>
