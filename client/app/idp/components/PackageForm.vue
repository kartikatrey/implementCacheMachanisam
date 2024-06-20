<template>
	<section v-loading="loading" class="form-page-container">
		<div class="panel">
			<div class="panel-body">
				<el-form
					:model="form"
					ref="form"
					label-position="left"
					label-width="150px"
				>
					<el-row :gutter="180">
						<el-col
							:span="12"
							:key="column.name"
							v-for="column in columns"
						>
							<div class="kp-form-group">
								<el-form-item
									:rules="[
										{
											required: column.is_mandatory,
											message: `${column.label} is required`,
											trigger: 'blur'
										}
									]"
									:prop="column.name"
									:label="column.label"
								>
									<el-input
										v-if="column.type === 'string'"
										v-model="form[column.name]"
										:placeholder="
											'Please enter ' + column.label
										"
									></el-input>
									<el-select
										v-if="column.type === 'dropdown'"
										v-model="form[column.name]"
									>
										<el-option
											v-for="data in column.options"
											:label="data.label"
											:value="data.name"
											:key="data.name"
										></el-option>
									</el-select>
								</el-form-item>
							</div>
						</el-col>
					</el-row>
					<el-row style="text-align: center">
						<el-button
							size="small"
							v-on:click="createPackage"
							type="primary"
							>Create Package</el-button
						>
					</el-row>
				</el-form>
			</div>
		</div>
	</section>
</template>

<script>
import _ from "lodash";
import CustomerConfig from "@/idp/services/DeCustomerConfig";
import DocumentPackageService from "@/idp/services/DocumentPackageService";
import FieldService from "@/idp/services/FieldService";

export default {
	name: "PackageForm",
	props: ["document", "customerConfiguration"],
	data() {
		return {
			columns: [],
			form: {},
			loading: false
		};
	},
	computed: {},
	methods: {

		async createPackage() {
			this.disableSave = true;
			const isValidPackageType = DocumentPackageService.isValidFormSubtype(this.customerConfiguration, this.form.package_type, this.document.document_subtype);
			if(!isValidPackageType){
				this.notifyError('Selected document is not allowed to be added in this package as per config.Please change subtype of document if you still want to add in this package.');
				return;
			}
			let isValid = await this.$refs.form.validate().catch(error => {});
			if (!isValid) {
				this.disableSave = false;
				return;
			}
			const payload = {
				child_doc_ids:[this.document._id],
				document_type:this.document.document_type,
				fields:this.form,
				storage_folder_path:this.document.storage_folder_path
			}
			DocumentPackageService.create(payload);
			this.notifySuccess('Package creation request has been submitted.')
			this.$emit('closeDialog')
		},

		setDefaultValue() {
			for(const column of this.columns ){
				const columnName = column.name;
				if (!this.document[columnName]) {
					return;
				}
				this.$set(this.form, columnName, this.document[columnName]) ;
			}
		},

		async init() {
			this.loading = true;
			try {
				// const response = await CustomerConfig.getAllDocsCustConfiguration({});
				// const configuration = response.find(config => config.document_type === this.document.document_type);
				const configuration = await CustomerConfig.getCustConfigByDocType(this.document.document_type);
				const packageCreationColumns = _.get(configuration, 'package_config.creation_columns');
				const configuredColumns = await FieldService.getFieldsList({ _id: { $in: packageCreationColumns } }, ["name", "label", "type", "is_mandatory", "options"]);
				this.columns = configuredColumns;
				this.setDefaultValue();
			} catch (err) {
				console.log(err);
			}
			this.loading = false;
		}
	},

	beforeMount() {
		this.init();
	}
};
</script>

<style lang="scss">
.action-buttons {
	display: inline;
	margin: 10px;
	button {
		height: 2rem;
		padding-top: 3px;
	}
}
</style>
