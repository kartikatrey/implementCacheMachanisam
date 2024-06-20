<template v-loading="loading">
    <el-main class="kp-main">
        <section class="page-body">
            <div class="page-title">
                <el-button icon="mdi mdi-arrow-left-circle-outline" cid="form-header-back" v-on:click="onBack"></el-button>
                <span class="page-title-text" v-if="form._id">Edit {{ pageTitle }}
                </span>
                <span class="page-title-text" v-else>Add {{ pageTitle }}</span>
            </div>

            <section class="form-page-container">
                <div class="panel">
                    <div class="panel-body">
                        <el-form :model="form" ref="form" label-width="120px" :rules="formRules">
                            <div class="grouping-tile">
                                General configuration
                            </div>

                            <el-row :gutter="40">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item class="control-label col-sm-2" prop="document_type"
                                            label="Document Type">
                                            <el-select 
                                            :disabled="form.is_platform" 
                                            class="select-box"
                                            @change="handleDocTypeChange" 
                                            size="large" 
                                            v-model="form.document_type"
                                            filterable 
                                            reserve-keyword 
                                            placeholder="Please select document type">
                                                <el-option 
                                                v-for="(_type,index) in documentTypeList" 
                                                :cid="'auto-correct-form-document-type' +index" 
                                                :key="_type.value" 
                                                :label="_type.label" 
                                                :value="_type.value" 
                                                label-width="170px"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item class="control-label col-sm-2" prop="name"
                                            label="Field">
                                            <el-select 
                                            :disabled="form.is_platform" 
                                            class="select-box"
                                            size="large" 
                                            v-model="form.name"
                                            filterable 
                                            reserve-keyword 
                                            placeholder="Please select field">
                                                <el-option 
                                                v-for="(_type,index) in deFieldList" 
                                                :cid="'auto-correct-form-document-type' +index" 
                                                :key="_type.value" 
                                                :label="_type.label" 
                                                :value="_type.value" 
                                                label-width="170px"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>

                            <el-row :gutter="40">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item class="control-label col-sm-2" prop="input_value" label="Input">
                                            <el-input :disabled="form.is_platform" cid="auto-correct-form-input"
                                                class="form-control" prop="input" v-model="form.input_value"
                                                placeholder="Enter the input value"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>

                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item class="control-label col-sm-2" prop="output_value" label="Output">
                                            <el-input :disabled="form.is_platform" cid="auto-correct-form-input"
                                                class="form-control" prop="output" v-model="form.output_value"
                                                placeholder="Enter the output value"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                    <footer>
                        <div></div>
                        <div>
                            <el-button cid="field-config-form-cancel" size="small" v-on:click="onBack">Cancel</el-button>
                        </div>
                        <div>
                            <el-button v-if="isSaveActionAllowed" size="small" v-on:click="saveForm" type="primary">Save</el-button>
                        </div>
                    </footer>
                </div>
            </section>
        </section>
    </el-main>
</template>

<script>
import CustomerConfig from "@/idp/services/DeCustomerConfig";
import AutoCorrectService from "@/services/AutoCorrectService";
import FieldService from "@/idp/services/FieldService";
import formMixin from "@/mixins/formMixin.js";

export default {
	name: "AutoCorrectForm",
    mixins: [formMixin],
	data() {
		return {
			form: {
                document_type: "",
				name: "",
				input_value: "",
				output_value: "",
                active: true
			},
			documentTypeList: [],
            isSaveActionAllowed: true,
			deFieldList: [],
			pageTitle: "Auto Correct",
			loading: false,
			formRules: {
				document_type: [
					{
						required: true,
						trigger: "blur",
						message: "Please select the field"
					}
				],
				name: [
					{
						required: true,
						trigger: "blur",
						message: "Please select the field"
					}
				],

				input_value: [
					{
						required: true,
						trigger: "blur",
						message: "Please select the field"
					}
				],
				output_value: [
					{
						required: true,
						trigger: "blur",
						message: "Please select the field"
					}
				]
			}
		};
	},
	methods: {
		onBack() {
			this.$router.push("/idp/auto-correct-list");
		},
		displayList() {
			this.$router.push({ path: "/idp/auto-correct-list" });
		},
		async saveForm() {
			let valid = await this.$refs.form.validate().catch(error => {});
			if (!valid) {
				return;
			}
			this.showVersionList = false;
			this.loading = true;
			try {
                const autoCorrectResponse = await AutoCorrectService.saveData(this.form);
                if(_.get(autoCorrectResponse, 'data._id')){
                    this.notifySuccess("Data saved succesfully!")
                }else{
                    this.notifyError(_.get(autoCorrectResponse, 'data.message') || "Error while saving data")
                }
				this.displayList();
			} catch (err) {
				this.notifyError("Error while saving data");
			}
			this.loading = false;
		},
		async init() {
			try {
				this.loading = true;
				const recordId = this.$route.query.id;
				await this.fetchDocumentTypes();
				if (recordId) {
					const response = await AutoCorrectService.getDataById(recordId);
					this.form = response;
				}
			} catch (err) {
				this.notifyError(err);
			}
			this.loading = false;
		},
		async fetchDocumentTypes() {
			try {
				let customerConfigurations = await CustomerConfig.getAllDocsCustConfiguration({ document_type: { $exists: true, active: true } });
				this.documentTypeList = CustomerConfig.getDocumentTypeList(customerConfigurations);
			} catch (error) {
				console.error(error);
			}
		},
		async handleDocTypeChange() {
			try {
				const filter = { document_type: this.form['document_type'] };
                const deFields = await FieldService.getFieldByDocumentType(filter, ['label', 'name']);
                this.deFieldList = (deFields || []).map((field) => {
                    return { id: "" + field._id, label: "" + field.label, value:""+ field.name };
                });
			} catch (e) {
				console.error(e);
			}
		}
	},
	async beforeMount() {
        this.isSaveActionAllowed = await this.isSaveActionPermitted('de_auto_correct_data');
		this.$store.commit("setDisplayIdpTree", false);
		this.$store.commit("setDisplayIdpNavbar", true);
		this.init();
	}
};
</script>

<style lang="scss" scoped>
@import "../_idpVariables";
@import "../_idpGlobal";
</style>
