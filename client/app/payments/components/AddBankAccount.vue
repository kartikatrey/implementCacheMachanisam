<template>
	<el-main class="kp-main">
		<section class="page-body">
			<div class="page-title">
				<el-button
					cid="form-header-back"
					icon="mdi mdi-arrow-left-circle-outline"
					v-on:click="onBack"
				></el-button>
				<span class="page-title-text" v-if="form.id"
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
								Bank Details
							</div>
							<el-row :gutter="40">
								<el-col :span="12">
									<div class="kp-form-group">
										<el-form-item
											class="control-label col-sm-2"
											prop="account"
											label="Account Number"
										>
											<el-input
												cid="user-form-name"
												class="form-control"
												v-model="form.account"
												:rows="2"
												placeholder
												:disabled="form.id"
											></el-input>
										</el-form-item>
									</div>
								</el-col>
								<el-col :span="12">
									<div class="kp-form-group">
										<el-form-item
											class="control-label col-sm-2"
											prop="routing"
											label="Routing Number"
										>
											<el-input
												cid="user-form-name"
												class="form-control"
												v-model="form.routing"
												:rows="2"
												placeholder
												:disabled="form.id"
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
											prop="type"
											label="Type"
										>
											<el-select
												placeholder="Please Select Account Type"
												v-model="form.type"
											>
												<el-option
													v-for="_type in typeList"
													:key="_type"
													:label="_type"
													:value="_type"
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
											prop="name"
											label="Name"
										>
											<el-input
												cid="user-form-name"
												class="form-control"
												v-model="form.name"
												:rows="2"
												placeholder
											></el-input>
										</el-form-item>
									</div>
								</el-col>
							</el-row>
<!------------------------------------- Slider Button Starts here ------------------------------------->
		<el-row :gutter="40">
      <el-col :span="12">
        <div class="kp-form-group">
          <el-form-item class="kp-form-field-label" prop="default" label="Default">
            <el-switch v-model="form.default"></el-switch>
          </el-form-item>
        </div>
      </el-col>

      <!-- <el-col :span="12">
        <div class="kp-form-group">
          <el-form-item class="control-label col-sm-2" prop="billing" label="Billing">
            <el-switch v-model="form.billing"></el-switch>
          </el-form-item>
        </div>
      </el-col>-->
    </el-row>
<!------------------------------------- Slider Button Ends here ------------------------------------->
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
	</el-main>
</template>

<script>
import _ from "lodash";
import ConfirmModel from "@/components/ConfirmModel";
import PaymentService from "@/payments/services/PaymentSevice.js";
import Constants from "../../resources/Constants";
let defaultForm = {
	account: "",
	routing: "",
	name: "",
	type:"",
	default: "false",
	vendor_id: '',
	vendor_site_id: '',
}

export default {
	name: "AddBankAccount",
	components: {
		ConfirmModel,
	},
	data() {
		return {
			paymentUserType:"",
			vendorRecordId :"",
			loading: false,
      		typeList: Constants.PAYMENTS_CONFIG.ACCOUNT_TYPE,
			form: {...defaultForm},
			pageTitle: "Bank Details",
			disableRegister: false,
			requiredParam: {},
			formRules: {
				account: [
					{
						required: true,
						message: "Please input Account Number",
						trigger: "change"
					}
				],
				routing: [
					{
						required: true,
						message: "Please input Routing Number",
						trigger: "change"
					}
				],
				name: [
					{
						required: true,
						message: "Please input Bank Name",
						trigger: "change"
					}
				],
				type: [
					{
						required: true,
						message: "Please select Type",
						trigger: "change"
					}
				],
				default: [
					{
						required: false,
						message: "Please set Default Status",
						trigger: "change"
					}
				],
				billing: [
					{
						required: false,
						message: "Please set Billing Status",
						trigger: "change"
					}
				],
			}
		};
	},
	watch: {},
	methods: {

		onBack() {
			this.handleRouting();
		},
		async onSave() {
			this.disableRegister = true;
			this.$setLoader({
				target: "#register-btn",
				spinner: "el-icon-loading"
			});
			let valid = await this.$refs.form.validate().catch(error => {});
			if (!valid) {
				this.resetLoading();
				return;
			}
			let recordId = this.$route.query.id;
			if(recordId){
				return this.updateRecord();
			}
			return this.insertRecord();
		},

		async insertRecord() {
			const self = this;
			try {
				await PaymentService.call({ action: "addBankAccount", data: this.form });
				const successMessage = this.form._id ?
					"Bank account details added successfully!!" :
					"Bank account details saved successfully!!";
				self.notifySuccess(successMessage);
				self.handleRouting();
			} catch (error) {
				self.notifyError(_.get(error, 'response.data.error.message', 'Error while completing the request.'));
			}
			self.resetLoading();
		},

		resetLoading(){
			this.$resetLoader();
			this.disableRegister = false;
		},


		async updateRecord() {
			const self = this;
			(this.paymentUserType == 'vendor') && this.initVendorIdAndSiteData();
			try {
				const response = await PaymentService.call({ action: "updateBankAccount", data: this.form });
				const successMessage = this.form._id
					? "Bank account details updated successfully!!"
					: "Bank account details saved successfully!!";
				this.form = response;
				self.notifySuccess(successMessage);
				this.handleRouting();
			} catch (error) {
				self.notifyError(error);
			}
			self.$resetLoader();
			self.disableRegister = false;
		},

		handleRouting() {
			if(this.paymentUserType == Constants.PAYMENTS_CONFIG.USER_TYPES.VENDOR){
				this.vendorRecordId = this.$store.getters['vendorStore/getVendorSiteRecordId'];
				this.$router.push(`/idp/vendor/vendor-site-detail?id=${this.vendorRecordId}`);
			}
			else{
				this.$router.push({ path: "/payments/payment-mode" });
			}
		},

		initVendorIdAndSiteData(){			
			this.form.vendor_id = this.$store.getters['vendorStore/getVendorId'];
			this.form.vendor_site_id = this.$store.getters['vendorStore/getVendorSiteId'];			
		}
	},

	async beforeMount() {
		this.paymentUserType = this.$store.getters['paymentStore/getPaymentUserType'];
		(this.paymentUserType == 'vendor') && this.initVendorIdAndSiteData();
		this.$store.commit("setDisplayIdpTree",false);
		this.$store.commit("setDisplayIdpNavbar",true);
		let recordId = this.$route.query.id;
		if(recordId){
			const bankAccountsPayload = {id: recordId, vendor_id: this.form.vendor_id, vendor_site_id: this.form.vendor_site_id}
			let response = await PaymentService.call({action: "getBankAccount", data : bankAccountsPayload});
    		this.form = response.data;
		}
	},

	beforeRouteLeave: function(to, from, next) {
		next();
	}
};
</script>

<style lang="scss">
@import "../../idp/idpGlobal";

.kp-form-group {
  .vue-tel-input {
    height: 28px;
    border: 1px solid #4A5468;
    background-color: var(--dark-10);
    input {
      background-color: none !important;
      font-size: var(--font-sm);
    }
  }
  .el-input.is-disabled .el-input__inner{
    background-color: var(--dark-10) !important;
    border-color: var(--dark-10) !important;
    color: var(--dark-04) !important;
  }

  .el-input__prefix,
  .el-input__suffix {
  	top: -6px !important;
  }
}
</style>
