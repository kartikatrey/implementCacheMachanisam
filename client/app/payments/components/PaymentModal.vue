<template>
  <div class="payment-confirmation">
    <el-dialog custom-class="triggerPayment-dialog" :visible.sync="showPaymentDialog"
      :close-on-click-modal="false">
      <el-row>
        <el-col class="vendor_payment_heading">
          <el-divider content-position="left">
          Payment Confirmation
          </el-divider>
        </el-col>
      </el-row>
      <div v-loading="loader" class="vendor_payment_content" >
        <div class="vendor_payment_showDirect">
          <el-row :gutter="20" class="vendor_payment_item">
            <el-col :span="20">
              <span class="vendor_payment_label">Invoice Number:</span>
            </el-col>
            <el-col :span="20">
              <el-input :readonly="true" :value="document.invoice_number" class="vendor_payment_input"></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="vendor_payment_item">
            <el-col :span="20">
              <span class="vendor_payment_label">Invoice Amount:</span>
            </el-col>
            <el-col :span="20">
              <el-input :readonly="true" :value="docRecord.due_amount" class="vendor_payment_input"></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="vendor_payment_item vendor_payment_accounts">
            <el-col :span="20">
              <span class="vendor_payment_label">Bank Account:</span>
            </el-col>
            <el-col :span="20">
              <el-select v-model="customer.default_account_id" class="vendor_payment_select">
                <el-option class="vendor-payment-option" v-for="bank in customer.accounts" :key="bank.id" :label="prepareBankAccountLabel(bank)"
                  :value="bank.id"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <div class="payment-seperator">
            <el-divider/>
          </div>
          <el-row :gutter="20" class="vendor_payment_item">
            <el-col :span="20">
              <span class="vendor_payment_label">Payee Name:</span>
            </el-col>
            <el-col :span="20">
              <el-input :readonly="true" :value="document.vendor_name" class="vendor_payment_input"></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="vendor_payment_item vendor_payment_accounts">
            <el-col :span="20">
              <span class="vendor_payment_label">Payee Site:</span>
            </el-col>
            <el-col :span="20">
              <template v-if="vendor.sites.length === 1">
                <el-input :readonly="true" :value="vendor.sites[0].site_name" class="vendor_payment_input"></el-input>
              </template>
              <template v-else>
                <el-select v-model="vendor.default_site_id" class="vendor_payment_select" @change="handleChangeInVendorSite">
                  <el-option v-for="item in vendor.sites" :key="item.site_id" :label="item.site_name"
                    :value="item.site_id">
                  </el-option>
                </el-select>
              </template>
            </el-col>
          </el-row>
          <div class="ach-payment" v-if="this.vendor.payment_mode === vendor.payment_mode_options.ACH">
            <el-row :gutter="20" class="vendor_payment_item vendor_payment_accounts">
              <el-col :span="20">
                <span class="vendor_payment_label">Payee Bank Account:</span>
              </el-col>
              <el-col :span="20">
                <el-select v-model="vendor.default_account_id" class="vendor_payment_select custom-select"
                  @change="changeRoutingNumber">
                  <el-option v-for="bank in vendor.accounts" :key="bank.id" :label="prepareBankAccountLabel(bank)" :value="bank.id">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="vendor_payment_item">
              <el-col :span="20">
                <span class="vendor_payment_label">Payee Bank Routing:</span>
              </el-col>
              <el-col :span="20">
                <el-input :readonly="true" :value="vendor.routing_number || 'NA'" class="vendor_payment_input"></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="vendor_payment_item">
              <el-col :span="20">
                <span class="vendor_payment_label">Payee Bank Name:</span>
              </el-col>
              <el-col :span="20">
                <el-input :readonly="true" :value="vendor.bank_name || 'NA'" class="vendor_payment_input"></el-input>
              </el-col>
            </el-row>
          </div>
          <div class="digital-payment" v-if="this.vendor.payment_mode === vendor.payment_mode_options.DIGITAL_CHECK">
            <el-row :gutter="20" class="vendor_payment_item">
              <el-col :span="20">
                <span class="vendor_payment_label">Payee Email:</span>
              </el-col>
              <el-col :span="20">
                <el-input :readonly="true" :value="vendor.user.business_email" class="vendor_payment_input"></el-input>
              </el-col>
            </el-row>
          </div>
          <div class="physical-payment" v-if="this.vendor.payment_mode === vendor.payment_mode_options.PHYSICAL_CHECK">
            <el-row :gutter="20" class="vendor_payment_item">
              <el-col :span="20">
                <span class="vendor_payment_label">Payee Address:</span>
              </el-col>
              <el-col :span="20" class="vendor_payment_address">
                <el-input :readonly="true" :value="vendor.user.street"
                  class="vendor_payment_input vendor_payment_address_field"></el-input>
                <el-row class="vendor_payment_city vendor_payment_address_field">
                  <el-col>
                    <el-input :readonly="true" :value="vendor.user.city" class="vendor_payment_input"></el-input>
                  </el-col>
                  <el-col>
                    <el-input :readonly="true" :value="vendor.user.state" class="vendor_payment_input"></el-input>
                  </el-col>
                </el-row>
                <el-row class="vendor_payment_address_field">
                  <el-input :readonly="true" :value="vendor.user.zip" class="vendor_payment_input"></el-input>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
           <el-divider class="el-divider-button"/>
        <span class="vendor_payment_item" slot="footer">
          <div class="vendor_payment_footer_buttons">
            <el-button size="medium" class="cancel-btn" @click="$emit('close')">Cancel</el-button>
            <el-button size="medium" type="primary" class="proceed-btn" @click="payInvoice" :disabled="shouldDisableProceed">Proceed</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import PaymentService from "@/payments/services/PaymentSevice.js";
import VendorService from "@/idp/services/VendorService.js";
import DocumentService from "@/idp/services/DocumentService.js";
import CustomerService from "@/idp/services/CustomerService.js"
import Constants from "../../resources/Constants";

export default {
  name: "PaymentModal",
  props: {
    showPaymentDialog: {},
    document : {}
  },
  data() {
    return {
      docRecord: {},
      loader : true,
      paymentDialog : false,
      shouldDisableProceed: true,
      customer: {
        default_account_id: "",
        accounts: []
      },

      vendor: {
        default_account_id: "",
        default_site_id: "",
        routing_number: "",
        bank_name: "",
        payment_mode: "",
        payment_mode_options: Constants.PAYMENTS_CONFIG.PAYMENT_MODE_OPTIONS,
        accounts: [],
        sites: [],
        user: {},
      },
      defaultVendorSite : {},
      allVendorSites : []
    };
  },
  async beforeMount() {
    await this.init();
  },

  methods: {
    /* Purpose : Send payment between customer and vendor
    Step 1. Check customer payment enabled
    Step 2. Get Document Record
    Step 3. Check payment site payment is enabled
    Step 4. Payment site payment is not enabled, Get all vendor sites
    Step 5. Show payment POP UP
    Step 6. Set VendorSites and current site payment mode
    Step 7. Get Customer bank Accounts
    Step 8. Show Payment POP UP for current site ( ACH, DIGITAL, PHYSICAL )
    Step 9. Enable Proceed button for Payment
    Step 10. Disable loader if every validations above are fulfilled
    */
    async init() {
      try {
        // Step 1. Check customer payment enabled
        const isCustomerPaymentEnabled = await CustomerService.isCustomerPaymentEnabled();
        if (!isCustomerPaymentEnabled) {
          this.loader=false
          this.notifyError("Please enable payments to proceed.");
          return;
        }

        // Step 2. Get Document Record
        const documentId = this.document._id;
        const projection = ['payment_site_id', 'payment_site', 'vendor_id', 'vendor_name', 'due_amount'];
        this.docRecord = await DocumentService.getDocumentById(documentId, projection);
        const vendorId = this.docRecord.vendor_id;
        const paymentSiteId = this.docRecord.payment_site_id;

        if(!vendorId){
          this.notifyError("Vendor ID not found in the document.");
          return ;
        }

        // Step 3. Check payment site payment enabled
        let vendorPaymentSiteRes = {};

        vendorPaymentSiteRes = await this.isPaymentSitePaymentEnabled(vendorId, paymentSiteId);

        // Step 4. Payment site payment is not enabled, Get all vendor sites
        if(!vendorPaymentSiteRes.status){
          vendorPaymentSiteRes = await this.getVendorSitesByVendorId(vendorId);
        }
        if (!vendorPaymentSiteRes.status) {
          this.notifyError(vendorPaymentSiteRes.message);
          return;
        }

        // Step 5. Show payment POP UP
        this.paymentDialog = true;

        // Step 6. Set VendorSites and current site payment mode
        this.setVendorPaymentDetails();

        // Step 7. Get Customer bank Accounts
        const custBankAccounts = await CustomerService.getBankAccounts();
        this.setCustBankAccountsInFormCtx(custBankAccounts)

        // Step 8. Show Payment POP UP for current site ( ACH, DIGITAL, PHYSICAL )
        await this.showPaymentDialogForSite();

        // Step 9. Enable Proceed button for Payment
        this.shouldDisableProceed = false;

        // Step 10. Disable loader if every validations above are fulfilled
        this.loader = false;

      } catch (error) {
        this.loader = true;
        this.notifyError(_.get(error, 'message') || _.get(error, 'response.data.error.message') || 'Error while completing the request.');
      }
    },

    async isPaymentSitePaymentEnabled(vendorId, paymentSiteId){
      let paymentEnabledRes = { status: false, message: "Payments not enabled for the vendor." };
      if (paymentSiteId) {
        const filter = { site_id: paymentSiteId, vendor_id: vendorId }
        const columns = ['site_name', 'site_id', 'payment_enabled', 'default_payment_mode', 'payment_config'];
        const siteDetails = await VendorService.fetchVendorSiteDetails(filter, columns);
        if(!siteDetails){
          paymentEnabledRes.message = "Invalid vendor payment site Id";
          return paymentEnabledRes;
        }
        this.defaultVendorSite = siteDetails;
        if (this.defaultVendorSite.payment_enabled) {
          paymentEnabledRes.status = true;
          return paymentEnabledRes;
        }
      }
      return paymentEnabledRes;
    },

    async getVendorSitesByVendorId(vendorId) {
      let paymentEnabledRes = { status: false, message: "Payments not enabled for the vendor." };
      const filter = { vendor_id: vendorId };
      const columns = ['site_name', 'site_id', 'payment_enabled', 'default_payment_mode', 'vendor_sites, payment_config', 'default']
      let vendorSites = await VendorService.fetchVendorSitesByVendorId(filter, columns);
      if(!vendorSites.length){
        paymentEnabledRes.message = "No vendor sites found for vendor";
        return paymentEnabledRes;
      }

      vendorSites = vendorSites.filter(site => site.payment_enabled);

      if (!vendorSites.length) {
        paymentEnabledRes.message = "No payment enabled sites configured for vendor.";
        return paymentEnabledRes;
      }
      this.allVendorSites = vendorSites;
      this.defaultVendorSite = vendorSites.find(site => site.default === true);
      if (this.defaultVendorSite && this.defaultVendorSite.payment_enabled) {
        paymentEnabledRes.status = true;
      }
      return paymentEnabledRes;
    },

    async setCustBankAccountsInFormCtx(custBankAccounts) {
      if(!custBankAccounts.length){
        throw new Error("Please add your bank accounts to continue making payment.");
      }
      custBankAccounts = custBankAccounts.filter(bank => bank.status === Constants.PAYMENTS_CONFIG.BANK_ACCOUNT_STATUS.VERIFIED);
      if (!custBankAccounts.length) {
        throw new Error("Please verify your bank account to continue making payment.");
      }
      this.customer.accounts = custBankAccounts;
      const [defaultBank] = _.filter(custBankAccounts, "default");
      if (defaultBank) {
        this.customer.default_account_id = defaultBank.id;
      }
    },

    setVendorPaymentDetails(){
      if (this.docRecord.payment_site_id) {
        this.vendor.sites.push(this.defaultVendorSite);
      }
      else if (this.docRecord.vendor_id) {
        this.vendor.sites = this.allVendorSites;
      }
      this.vendor.default_site_id = this.defaultVendorSite.site_id;
      const defaultPaymentMode = this.defaultVendorSite.default_payment_mode
      this.vendor.payment_mode = defaultPaymentMode;
    },

    async showPaymentDialogForSite() {
      const currentPaymentMode = this.vendor.payment_mode;
      const vendorUserDetails = await VendorService.getReceiverUser(this.docRecord.vendor_id, this.vendor.default_site_id)
      this.setVendorUserDetailsInFormCtx(vendorUserDetails);

      const paymentModeActions = {
        [Constants.PAYMENTS_CONFIG.PAYMENT_MODE_OPTIONS.ACH]: async () => {
          const vendorBankAccounts = await VendorService.getBankAccounts(this.docRecord.vendor_id, this.vendor.default_site_id)
          this.setVendorBankAccountsInFormCtx(vendorBankAccounts)
        },
        [Constants.PAYMENTS_CONFIG.PAYMENT_MODE_OPTIONS.DIGITAL_CHECK]: async () => {},
        [Constants.PAYMENTS_CONFIG.PAYMENT_MODE_OPTIONS.PHYSICAL_CHECK]: async () => {},
      };

      const action = paymentModeActions[currentPaymentMode];
      if (action) {
        await action();
      } else {
        throw new Error("Invalid payment mode configured for site.");
      }
    },

    async setVendorBankAccountsInFormCtx(vendorBankAccounts) {
      vendorBankAccounts = vendorBankAccounts.filter(bank => bank.status === Constants.PAYMENTS_CONFIG.BANK_ACCOUNT_STATUS.VERIFIED);
      if (!vendorBankAccounts.length) {
        throw new Error("No verified bank accounts found for vendor. Please verify atleast one bank account to continue making payment.");
      }
      this.vendor.accounts = vendorBankAccounts;
      const [defaultBank] = _.filter(vendorBankAccounts, "default");
      if (defaultBank) {
        this.vendor.default_account_id = defaultBank.id;
        this.vendor.routing_number = defaultBank.routing;
        this.vendor.bank_name = defaultBank.name;
      }
    },

    async setVendorUserDetailsInFormCtx(vendorUserDetails) {
      this.vendor.user = vendorUserDetails.data;
      this.vendor.user.business_email = vendorUserDetails.data.business_email;
    },

    async handleChangeInVendorSite() {
      const site = this.vendor.sites.find(site => site.site_id === this.vendor.default_site_id);
      this.vendor.payment_mode = site.default_payment_mode;
      await this.showPaymentDialogForSite();
    },

    closePaymentTriggerDialog(){
      this.$emit('close');
      this.showPaymentDialog = false;
    },

    async payInvoice() {
      const currentPaymentMode = this.vendor.payment_mode;
      const paymentModeMap = {
        [Constants.PAYMENTS_CONFIG.PAYMENT_MODE_OPTIONS.ACH] : this.payInvoiceViaACH,
        [Constants.PAYMENTS_CONFIG.PAYMENT_MODE_OPTIONS.DIGITAL_CHECK] : this.payInvoiceViaDigital,
        [Constants.PAYMENTS_CONFIG.PAYMENT_MODE_OPTIONS.PHYSICAL_CHECK] : this.payInvoiceViaPhysical
      };

      const paymentFunction = paymentModeMap[currentPaymentMode];
      if (paymentFunction) {
        await paymentFunction();
      } else {
        this.notifyError("Invalid payment mode configured for site.");
      }
    },

    async payInvoiceViaACH() {
      const vendorBankId = this.vendor.default_account_id;
      const vendorBank = this.vendor.accounts.find(bank => bank.id === vendorBankId);
      const customerBankId = this.customer.default_account_id;

      let payload = {
        payment_details: {
          invoice_id: this.docRecord._id,
          vendor_id : this.docRecord.vendor_id,
          payment_site_id : this.vendor.default_site_id
        },
        data: {
          recipient: this.vendor.user.business_email,
          account_type: vendorBank.type,
          routing_number: vendorBank.routing,
          account_number: vendorBank.account,
          name: this.docRecord.vendor_name,
          amount: this.docRecord.due_amount,
          account: customerBankId
        }
      }
      try {
        await PaymentService.call({ action: "sendPaymentViaACH", data: payload })
        this.notifySuccess("Payment initiated.");
        this.closePaymentTriggerDialog();
      } catch (error) {
        this.notifyError(_.get(error, 'response.data.error.message', 'Error while completing the request.'));
        this.closePaymentTriggerDialog();
      }
    },

    async payInvoiceViaDigital() {
      const customerBankId = this.customer.default_account_id;

      let payload = {
        payment_details: {
          invoice_id: this.docRecord._id,
          vendor_id : this.docRecord.vendor_id,
          payment_site_id : this.vendor.default_site_id
        },
        data: {
          recipient: this.vendor.user.business_email,
          name: this.docRecord.vendor_name,
          amount: this.docRecord.due_amount,
          account: customerBankId
        }
      }
      try {
        await PaymentService.call({ action: "sendPaymentViaMail", data: payload })
        this.notifySuccess("Payment initiated.");
        this.closePaymentTriggerDialog();
      } catch (error) {
        this.notifyError(_.get(error, 'response.data.error.message', 'Error while completing the request.'));
        this.closePaymentTriggerDialog();
      }
    },

    async payInvoiceViaPhysical() {
      const customerBankId = this.customer.default_account_id;

      let payload = {
        payment_details: {
          invoice_id: this.docRecord._id,
          vendor_id : this.docRecord.vendor_id,
          payment_site_id : this.vendor.default_site_id
        },
        data: {
          recipient: {
            line_1: this.vendor.user.street,
            city: this.vendor.user.city,
            state: this.vendor.user.state,
            zip: this.vendor.user.zip
          },
          name: this.docRecord.vendor_name,
          amount: this.docRecord.due_amount,
          account: customerBankId
        }
      }
      try {
        await PaymentService.call({ action: "sendPaymentViaPhysical", data: payload });
        this.notifySuccess("Payment initiated.");
        this.closePaymentTriggerDialog();
      } catch (error) {
        this.notifyError(_.get(error, 'response.data.error.message', 'Error while completing the request.'));
        this.closePaymentTriggerDialog();
      }
    },

    prepareBankAccountLabel(bank) {
      return (bank.name ? bank.name : "NA") + (" (" + bank.account + ")");
    },

    changeRoutingNumber() {
      const selectedBankId = this.vendor.default_account_id;
      const selectedBank = this.vendor.accounts.find(bank => bank.id === selectedBankId);
      this.vendor.routing_number = selectedBank ? selectedBank.routing : 'NA';
    },
  },
};
</script>
<style lang="scss">

.triggerPayment-dialog{
  width: 40%;
  margin-top: 10vh !important;
  padding: 0 !important;
}
.vendor_payment_content {
  display: flex;
  flex-direction: column;
}

.vendor_payment_footer_buttons {
  .cancel-btn{
    border-color: #5a67d8;
		font-weight: 600;
    font-size: 1rem;
  }
  .proceed-btn{
    border-color: #5a67d8;
		font-weight: 600;
    font-size: 1rem;
  }
}

.vendor_payment_heading {
    font-weight: 700;
		margin-bottom: 0.3rem;
    padding: 0.833rem 2.5rem;
    .el-divider__text.is-left {
       color: #606266 !important;
       font-size: 1.333rem !important;
    }
}

.vendor_payment_item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 1rem;
  padding: 0 30px 0 30px;
  margin-bottom: 15px;
}

.vendor_payment_label {
  font-weight: normal;
}

.el-divider--horizontal {
		display: block;
		height: 1px;
		margin-top: 2rem;
		margin-bottom: 2rem;
		padding: 0;
}

.el-divider-button {
      margin-bottom: 0;
      margin-top: 1rem;
}

.el-dialog__footer .vendor_payment_item {
    padding: 0.833rem;
    justify-content: end;
    margin-bottom: 0;
}

.el-dialog__footer {
    padding: 0.833rem 1.667rem;
}

.vendor_payment_select>.el-input--suffix .el-input__inner {
  background-color: #ffffff;
  font-weight: 400;
  border-color: #CBD5E0;
  font-size: 1rem;
}

.custom-select .el-select-dropdown__item {
     background-color: #ffffff !important;
}

.vendor_payment_input>.el-input__inner {
  background-color: #E2E8F0;
  font-weight: 600;
  border-color: #CBD5E0;
  font-size: 1rem;
}

.payment-seperator {
    padding: 0 2.5rem;
}

</style>