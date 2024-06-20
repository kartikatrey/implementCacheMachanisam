<template>
	<el-main class="kp-main">
		<section class="page-body">
			<div class="page-title">
				<el-button cid="role-tab-access-form-header-back" icon="mdi mdi-arrow-left-circle-outline"
					v-on:click="onBack"></el-button>
				<span class="page-title-text" v-if="form._id">Edit {{ pageTitle }}</span>
				<span class="page-title-text" v-else>Add {{ pageTitle }}</span>
			</div>
		</section>
		<section class="page-body section form-page-container role-tab-form">
			<div class="panel">
				<div class="panel-body">
					<el-form label-position="left" :model="form" ref="form" label-width="120px" :rules="formRules">
						<el-row :gutter="40">
							<el-col :span="12">
								<div class="kp-form-group">
									<el-form-item class="control-label col-sm-2" prop="roleLabel" label="Role Label">
										<el-input cid="role-label" v-model="roleLabel" :rows="2" placeholder
											:disabled="isRoleLabelDisabled"></el-input>
									</el-form-item>
								</div>
							</el-col>
							<el-col :span="12">
								<div class="kp-form-group">
									<el-form-item class="control-label col-sm-2" prop="type" label="Type">
										<el-select v-model="form.type" cid="type" collapse-tags placeholder="" :disabled="isTypeDisabled">
											<el-option v-for="(type, index) in typesList" :cid="'type' + index" :key="type.value"
												:label="type.label" :value="type.value"></el-option>
										</el-select>
									</el-form-item>
								</div>
							</el-col>
						</el-row>
						<el-row :gutter="40">
							<el-col :span="12">
								<div class="kp-form-group">
									<el-form-item class="control-label col-sm-2" prop="document_type" label="Document Type">
										<el-select v-model="form.document_type" placeholder="Select Document Type" :disabled="isDocumentTypeDisabled">
											<el-option v-for="docType in documentTypes" :key="docType.value" :label="docType.label"
												:value="docType.value"></el-option>
										</el-select>
									</el-form-item>
								</div>
							</el-col>
						</el-row>
						<el-row :gutter="40">
							<div class="role-tabs-divider">
								<el-divider content-position="left">Tabs</el-divider>
							</div>
							<div class="panel-body">
								<section>
									<div class="table-wrap">
										<DualListBox :source="dynamicTabsSlushBucketData.source"
											:destination="dynamicTabsSlushBucketData.destination" label="label"
											@onChangeList="(changedData) => { onDynamicTabsListChange(changedData) }" />
									</div>
								</section>
							</div>
						</el-row>
					</el-form>
				</div>
				<footer>
					<div></div>
					<div>
						<el-button size="small" v-on:click="onBack">Cancel</el-button>
					</div>
					<div>
						<el-button size="small" id="register-btn" v-on:click="saveRoleTabData" type="primary"
							:disabled="disableAddRoleTabs">Save</el-button>
					</div>
				</footer>
			</div>
		</section>
	</el-main>
</template>

<script>
import DeCustomerConfig from "@/idp/services/DeCustomerConfig";
import UserAccessService from "@/idp/services/UserAccessService";
import DualListBox from "@/idp/components/DualListBox.vue";
import documentSetupService from "@/idp/services/internal/DocumentSetupService";
import Constants from "@/resources/Constants";
import _ from "lodash";

export default {
	name: "RoleTabAccessForm",
	components: {
		DualListBox
	},
	data() {
		return {
			pageTitle: "Role Tab Access",
			disableAddRoleTabs: false,
			dynamicTabsSlushBucketData: {
				source: [],
				destination: []
			},
			allListStages: Constants.DOCEX.ALL_LIST_STAGES,
			typesList: [Constants.DOCEX.ROLE_ACCESS_TYPES_MAP.TABS],
			//Initially disabled "roleLabel" and "type" field. 
			isRoleLabelDisabled: true,
			isTypeDisabled: true,
			isDocumentTypeDisabled: false,
			roleRecord: "",
			roleId: "",
			roleLabel: "",
			documentTypes: [],
			form: {
				role_id: "",
				type: "",
				document_type: "",
				tabs: [],
			},
			formRules: {
				document_type: [{ required: true, message: 'Please select Document Type', trigger: ['blur', 'change'] }],
				tabs: [{ required: true, message: 'Please select at least one tab' }],
			}
		};
	},
	methods: {
		async init() {
			//Set form type value
			this.form.type = this.typesList && this.typesList[0].value;

			//Set roleRecord from userAccessStore which was stored from RolesForm page
			this.setRoleRecord();

			//Set document types
			this.setDocumentTypes();

			const roleTabRecordId = this.$route.query.id;
			//If roleTabRecordId is already present then, fetch the data for given id
			if (roleTabRecordId) {
				const roleTabRecordResponse = await UserAccessService.fetchRoleFieldDetailsById(roleTabRecordId);
				this.updateFormWithRoleTabData(roleTabRecordResponse);
			}

			//Configure stage tabs
			const stageConfig = this.form.tabs;
			this.dynamicTabsSlushBucketData = documentSetupService.prepareDynamicTabsSlushBucketData(this.allListStages, stageConfig)
		},
		//Get currentRecord from store and set roleId and roleLabel
		async setRoleRecord() {
			this.roleRecord = this.$store.getters['userAccessStore/getCurrentRecord'];
			if (this.roleRecord) {
				this.roleLabel = this.roleRecord.label;
				this.roleId = this.roleRecord._id;
				this.form.role_id = this.roleId;
			}
		},
		//Get customer_configuration and set document_types 
		async setDocumentTypes() {
			const customerConfigurations = await DeCustomerConfig.getAllDocsCustConfiguration({
				document_type: { $exists: true }
			});
			this.documentTypes = DeCustomerConfig.getDocumentTypeList(customerConfigurations);
		},
		//Update form with role tab record response
		async updateFormWithRoleTabData(roleTabRecordResponse) {
			if (_.isEmpty(roleTabRecordResponse)) {
				return;
			}
			this.form._id = roleTabRecordResponse._id;
			this.form.document_type = roleTabRecordResponse.document_type;
			this.form.tabs = roleTabRecordResponse.tabs;
			this.isDocumentTypeDisabled = true;
		},
		/**
		 * This function updates the dynamicTabsSlushBucketData object with the source and destination 
		 * for the change event in a dynamic tabs list. 
		 */
		onDynamicTabsListChange({ source, destination }) {
			this.$set(this.dynamicTabsSlushBucketData, "source", source);
			this.$set(this.dynamicTabsSlushBucketData, "destination", destination);
		},
		/**
		 * Purpose - Validates the role tab data 
		 * It checks if role tab data is valid or not
		 * If data is valid it returns true otherwise, it returns false
		 */
		async validateRoleTabData() {
			//Check if tabs list is empty or not
			if (documentSetupService.isEmptyDynamicTabsList(this.form.tabs)) {
				this.notifyError("Tabs list should have at least one tab value");
				return false;
			}
			const isFormValid = await this.$refs.form.validate().catch((error) => { });
			if (!isFormValid) {
				this.$resetLoader();
				this.disableAddRoleTabs = false;
				return false;
			}
			return true;
		},
		//Save role tab data
		async saveRoleTabData() {
			try {
				this.form.tabs = documentSetupService.getDestinationTabs(this.allListStages, this.dynamicTabsSlushBucketData.destination);
				const isRoleTabDataValid = await this.validateRoleTabData();
				//If role tab data is not valid then return, otherwise save data
				if(!isRoleTabDataValid){
					return;
				}
				this.disableAddRoleTabs = true;
				this.$setLoader({
					target: "#save-subscrption-btn",
					spinner: "el-icon-loading",
				});
				const saveFieldAccessServiceResponse = await UserAccessService.saveRoleFieldDetails(this.form);
				if (_.get(saveFieldAccessServiceResponse, "data.status") == 400) {
					this.notifyError((_.get(saveFieldAccessServiceResponse, "data.message")) || "Record already exists!");
					return;
				}
				this.notifySuccess("Record saved successfully");
				this.$router.push(`/idp/roles-form?id=${this.roleId}`);
			} catch (err) {
				this.notifyError("Error while saving role tab record");
			}
			finally {
				this.$resetLoader();
				this.disableAddRoleTabs = false;
			};
		},
		//Redirect to roles form page
		onBack() {
			if (this.roleId) {
				this.$router.push(`/idp/roles-form?id=${this.roleId}`);
			}
		},
	},
	beforeMount() {
		this.$store.commit("setDisplayIdpTree", false);
		this.$store.commit("setDisplayIdpNavbar", true);
		this.init();
	},
}
</script>

<style lang="scss">
@import "../_idpGlobal";

.role-tab-form{
	.kp-form-group {
		.el-input.is-disabled .el-input__inner {
			background-color: var(--dark-10);
			color: var(--dark-04);
		}
		.el-select{
			height: 30px !important; 
		}
	}
}

.role-tabs-divider {
	margin-left: 20px;
	margin-right: 20px;
}
</style>
