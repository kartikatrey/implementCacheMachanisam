<template>
  <el-main class="vendor-site-detail kp-main">
    <section class="page-body back-button">
      <div class="page-title">
        <el-button
          cid="vendor-site-form-header-back"
          icon="mdi mdi-arrow-left-circle-outline"
          v-on:click="onBack"
        ></el-button>
        <span class="page-title-text" v-if="form._id"
          >Edit {{ pageTitle }}
        </span>
         <span class="page-title-text" v-else>Add {{ pageTitle }}</span>
      </div>
    </section>
    <section class="page-body vendor-site-div-body form-page-container">
        <div class="divider-body">
          <el-divider content-position="left">Vendor Site Detail</el-divider>
        </div>
        <div class="panel">
          <div class="panel-body">
            <el-form
              label-position="left"
              :model="form"
              ref="form"
              label-width="120px"
              :rules="formRules"
              @focusout.native="checkIfFormEdited"
            >
              <ConfirmModel ref="model"></ConfirmModel>
              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group vendor-action-btns">
                    <el-form-item
                        class="control-label col-sm-2"
                        prop="site_name"
                        label="Vendor Site Name"
                      >
                      <el-input
                          cid="vendor-site-name"
                          v-bind:class = "[form._id ? 'form-control' : 'form-control modal-vendor-site-name']"
                          v-model ="form.site_name"
                          :rows="2"
                          placeholder
                          :disabled="isVendorSiteNameDisabled"
                        ></el-input>
                        <el-tooltip effect="light" content="Import vendor site from ERP" placement="bottom" v-show="!form._id">
                          <el-button cid="import-vendor-site-name" @click="showVendorSiteModal" class="vendor-site-div-btn">
                              <i class="mdi mdi-plus-circle"></i>
                          </el-button>
                        </el-tooltip>
                        <el-tooltip effect="light" content="Reset" placement="bottom" v-show="!form._id">
                          <el-button cid="reset-vendor-site" @click="resetVendorSiteDetails" class="vendor-site-div-btn">
                              <i class="mdi mdi-refresh"></i>
                          </el-button>
                        </el-tooltip>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="site_id"
                      label="Vendor Site ID"
                    >
                      <el-input
                      cid="vendor-site-id"
                      class="form-control"
                      v-model="form.site_id"
                      :rows="2"
                      placeholder
                      :disabled = "isVendorSiteIdDisabled"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="40" v-show="form._id">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="payment_enabled" label="Payment Site?">
                      <toggle-button :sync="true" :color="{
                          checked: '#5f8fdf',
                          unchecked: '#DCDFE6',
                          disabled: '#CCCCCC',
                        }" :labels="{ checked: 'YES', unchecked: 'NO' }" cid="vendor-site-payment-enable" @change="toggleEnablePayment" v-model="form.payment_enabled"></toggle-button>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="40" v-show="form.payment_enabled">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item class="kp-form-field-label" prop="default" label="Default">
                      <el-switch v-model="form.default"></el-switch>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="40" v-show="form.payment_enabled">
							<el-col :span="12">
								<div class="kp-form-group">
                  <el-form-item prop="default_payment_mode" label="Payment Mode">
                    <el-select v-model="form.default_payment_mode" placeholder="Select default payment mode">
                      <el-option v-for="(option, index) in paymentOptions" :key="index" :label="option.label" :value="option.value"></el-option>
										</el-select>
									</el-form-item>
								</div>
							</el-col>
						  </el-row>
            </el-form>
            <el-form
            label-position="left"
            :model="paymentDetails"
            ref="paymentDetails"
            label-width="120px"
            :rules="paymentDetailsRules"
            @focusout.native="checkIfPaymentFormEdited"
            >
              <el-row :gutter="40" v-show="form.payment_enabled">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      label="Mailing Address"
                      prop="street"
                    >
                      <el-input
                          cid="vemdor-site-street"
                          class="form-control"
                          prop="street"
                          v-model="paymentDetails.street"
                          placeholder="Street"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                      class="control-label col-sm-2"
                      label=""
                    >
                      <el-row :gutter="6">
                        <el-col :span="12"  class="el-col-vendor-site-div">
                          <div class="kp-form-group">
                            <el-form-item
                              class="control-label col-sm-2"
                              prop="city"
                            >
                              <el-input
                                cid="vendor-site-city"
                                class="form-control"
                                prop="city"
                                v-model="paymentDetails.city"
                                placeholder="City"
                              ></el-input>
                            </el-form-item>
                          </div>
                        </el-col>
                        <el-col :span="12"  class="el-col-vendor-site-div" >
                          <div class="kp-form-group">
                            <el-form-item
                            class="control-label col-sm-2"
                              prop="state"
                            >
                            <el-input
                              cid="vendor-site-state"
                              class="form-control"
                              prop="state"
                              v-model="paymentDetails.state"
                              placeholder ="State, Province"
                            ></el-input>
                            </el-form-item>
                          </div>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <el-row :gutter="40">
                      <el-col :span="24">
                        <div class="kp-form-group">
                          <el-form-item
                            class="control-label col-sm-2"
                            prop="zip"
                          >
                            <el-input
                              cid="vendor-site-zip"
                              class="form-control"
                              type="number"
                              prop="zip"
                              v-model="paymentDetails.zip"
                              placeholder="Zip or Postal code"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="business_email"
                      label="Business Email"
                    >
                      <el-input
                        cid="vendor-site-business-email"
                        class="form-control"
                        prop="business_email"
                        v-model="paymentDetails.business_email"
                        placeholder="Business Email"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <footer>
            <div></div>
            <div>
              <el-button size="small" v-on:click="onBack">Cancel</el-button>
            </div>
            <div>
              <el-button
                size="small"
                id="register-btn"
                v-on:click="onSave"
                :disabled="disableSave"
                type="primary"
                >Save</el-button
              >
            </div>
          </footer>
        </div>
    </section>
    <section>
      <el-dialog
        class="vendor-site-dialog"
        title="Import Vendor Site"
        :visible.sync="isVendorSiteDialogVisible"
        :close-on-click-modal="false">
        <div class="vendor-site-modal-body">
            <DataTable id="vendor-site-modal-table" :key="modalDataTableKey" ref="vendor-site-table" class="vendor-site-data-table" :parameters="vendorSiteTableParams"  @selectionChanged="handleSelectionChanged" @dataTableRowClicked="handleRowClick"></DataTable>
        </div>
        <el-divider class="vendor-site-modal-divider"></el-divider>
        <div class="modal-bottom-btns">
          <el-button @click="hideVendorSiteModal"  size="small">Cancel</el-button>
          <el-button @click="importVendorSiteDetails" size="small" type="primary">Import</el-button>
        </div>
        </el-dialog>
    </section>
    <section class="page-body vendor-site-div-body vendor-site-page-table" v-show="form._id">
      <div class="table-wrap">
        <DataTable :parameters="bankAccTableParams" :key="bankAccDataTableKey" :columnTemplate="bankStatusColumnTemplate" ref="refreshBankAccountTable"></DataTable>
      </div>
    </section>
    <section class="page-body vendor-site-page-table" v-show="form._id">
      <div class="table-wrap">
        <DataTable :parameters="tableParams" :key="vendorUserDataTableKey" :columnTemplate="userStatusColumnTemplate"></DataTable>
      </div>
    </section>
  </el-main>
</template>

<script>
import VendorService from "@/idp/services/VendorService";
import UserService from "@/services/UserService";
import _ from "lodash";
import ConfirmModel from "@/components/ConfirmModel";
import Constants from "@/resources/Constants";
import DataTable from "@/components/DataTable.vue";
import DocumentScriptService from "@/idp/services/DocumentScriptService";
import PaymentService from "../../payments/services/PaymentSevice";
import EventBus from "@/EventBus";
import Validator from "@/services/Validator";
import { getStatusBadge } from "@/util/CommonUtil";

let defaultForm = {
  vendor_id: "",
  default_payment_mode: "",
  default: false,
  hasUserModifiedDefault: true
}

let defaultPaymentDetailsForm = {
  street: "",
  city: "",
  state: "",
  zip: "",
  business_email: ""
}

export default {
name: "VendorUserForm",
components: {
  ConfirmModel,
  DataTable
},
data() {
  return {
    bankAccDataTableKey : 0,
    modalDataTableKey: 0,
    vendorUserDataTableKey: 0,
    //Vendor site modal table
    vendorSiteTableParams: {
      tableMaxHeight: "250px",
      customfilter: false,
      globalSearch: false,
      initialSort: 'value',
      showSortOptions: false,
      limit: 10,
      showSelectOptions: true,
      rows: [],
      columns: [
        {
          label: 'Vendor Site ID',
          field: 'key'
        },
        {
          label: 'Vendor Site Name',
          field: 'value'
        }
      ],
      isStaticTable: true
    },
    tableCurrentRow: {},
    tableSelectedRow: [],
    isVendorSiteDialogVisible: false,
    systemVendorSiteName: '',
    systemVendorSiteId: '',
    disableSearch: false,
    constant:Constants.DOCEX,
    isVendorSiteIdDisabled: false,
    isVendorSiteNameDisabled: false,
    showPaymentToggleBtn: false,
    vendorSiteId: "",
    isPaymentUserCreated: false,
    paymentOptions: Constants.PAYMENTS_CONFIG.PAYMENT_OPTIONS,
    form: { site_id:"", site_name:"", ...defaultForm},
    isFormEdited: false,
    paymentDetails: {...defaultPaymentDetailsForm},
    isPaymentFormEdited: false,
    pageTitle: "Vendor Site",
    vendorsDetails: [],
    disableSave: false,
    formRules: {
      site_id: [
        {
          required: true,
          trigger: ["change"],
          message: "Please enter the vendor site id"
        },
      ],
      site_name: [
        {
          required: true,
          trigger: ["change"],
          message: "Please enter the vendor site name"
        },
      ],
      default_payment_mode: [
        {
          required: false,
          message: "Please select payment mode",
          trigger: ["blur","change"],
        }
      ]
    },
    paymentDetailsRules:{
      business_email: [
          { required: true, message: 'Please enter business email', trigger: 'blur' },
          { type: 'email', message: 'Please provide valid business email', trigger: ['blur', 'change'] }
        ],
      street: [
        {
          required: true,
          message: "Please enter street",
          trigger: "blur",
        }
      ],
      state: [
        {
          required: true,
          message: "Please enter state",
          trigger: "blur",
        }
      ],
      city:[
        {
          required: true,
          message: "Please enter city",
          trigger: "blur",
        }
      ],
      zip:[
        {
          required: true,
          validator: Validator.validateZipCode,
          trigger: "blur",
        }
      ]
    },
    //Vendor users list
    tableParams: {
      apiName: `/portal/api/table/cp_user`,
      queryParam: {
        active: true,
        user_type: Constants.DOCEX.USER_TYPE.VENDOR
      },
      tableName: "vendorIdpUsers",
      pageTitle: "Vendor User",
      isRegxSearch:true,
      initialSort: "-createdAt",
      isRestify: true,
      limit: 10,
      addButtonConfig: true,
      addButtonConfig: {
        path: "/idp/vendor/user-form",
        name: "Add Vendor User",
      },
    },
    bankAccTableParams:{
      apiName: "",
      pageTitle: "Bank Accounts",
      showPaginationOptions: true,
      tableName: "bank_account_details",
      isRestify: false,
      customfilter: false,
      limit: 15,
      tableMode: "static",
      initialSort: "-date",
      showSortOptions: false,
      refreshButton: true,
      fixedHeader: false,
      isRegxSearch:false,
      globalSearch: false,
      enableGroupFilter: false,
      addButtonConfig: true,
      addButtonConfig: {
        path: `/payments/add-bank-account`,
        name: "Add Account"
      },
    }
  };
},
methods: {
  checkIfFormEdited(){
    this.isFormEdited = Object.keys(this.form).some(field => 
    this.form[field] !== defaultForm[field]
    )
  },
  checkIfPaymentFormEdited(){
    this.isPaymentFormEdited = Object.keys(this.paymentDetails).some(field => 
    this.paymentDetails[field] !== defaultPaymentDetailsForm[field]
    )
  },
  // refreshing bank accounts data table after receiving data from server and preparing table params accordingly
  refreshBankAccounts(){
    this.bankAccDataTableKey += 1;
  },
  // refreshing Vendor Sites data table after receiving data from server and preparing table params accordingly
  refreshVendorSites(){
    this.modalDataTableKey += 1;
  },
  // refreshing Vendor User data table after receiving dara from server and preparinf table parama accordingly
  refreshVendorUsers(){
    this.vendorUserDataTableKey += 1;
  },
  async toggleEnablePayment(){
    //If 'payment_enabled' is true, then make 'default_payment_mode' as required field
    if (this.form.payment_enabled) {
      this.isPaymentUserCreated = VendorService.isVendorPaymentUserCreated(this.form);
      if (this.isPaymentUserCreated) {
        if (this.paymentDetails.business_email == '') {
          const receiverUserRes = await VendorService.getReceiverUser(this.form.vendor_id, this.form.site_id)
          this.setReceiverDetailsInFormCtx(receiverUserRes)
        }
      }
      this.formRules.default_payment_mode[0].required = true;
    }
  },
  showVendorSiteModal() {
    this.getVendorSitesByVendorName();
    this.isVendorSiteDialogVisible = true;
  },
  hideVendorSiteModal() {
    this.isVendorSiteDialogVisible = false;
    this.resetVendorSiteModalTable();
  },
  //In import vendor site modal, resets vendor sites list selection as per original selection
  resetVendorSiteModalTable() {
    const vendorSiteTable = this.$refs['vendor-site-table'];
    if(vendorSiteTable && vendorSiteTable.rows){
      for (let index = 0; index < vendorSiteTable.rows.length; index++) {
        if (vendorSiteTable.rows[index].key == this.form.site_id) {
          this.$set(vendorSiteTable.rows[index], 'vgtSelected', true);
        } else {
          this.$set(vendorSiteTable.rows[index], 'vgtSelected', false);
        }
        this.refreshVendorSites();
      }
    }
  },
  handleRowClick(selectedRow) {
    this.tableCurrentRow = selectedRow;
    this.systemVendorSiteId = selectedRow.key;
    this.systemVendorSiteName = selectedRow.value;
  },
  //This is for single row selection
  //Once user tries to make multiple selection last selection only will be maintained
  //Previous selection will be removed
  handleSelectionChanged(selectedRows) {
    for (let index = 0; index < selectedRows.length; index++) {
      //Set the 'vgtSelected' as 'false' for all the rows other than the last selected one
      if (selectedRows && selectedRows.length > 1) {
        if (selectedRows[index].originalIndex != this.tableCurrentRow.originalIndex) {
          this.$set(selectedRows[index], 'vgtSelected', false);
        }
      }
    }
    this.tableSelectedRow = selectedRows;
  },

  // importing vendor site from the ERP
  importVendorSiteDetails() {
    if (this.tableSelectedRow && this.tableSelectedRow.length == 0) {
      this.notifyError("Please select at least one vendor site to import");
      return;
    }
    this.isVendorSiteDialogVisible = false;
    this.form.site_name = this.systemVendorSiteName;
    this.form.site_id = this.systemVendorSiteId;
    if (this.systemVendorSiteId) {
      this.isVendorSiteIdDisabled = true;
    }
    if (this.systemVendorSiteName) {
      this.isVendorSiteNameDisabled = true;
    }
  },
  resetVendorSiteDetails(){
    this.$refs.form.resetFields();
    this.systemVendorSiteId = '';
    this.systemVendorSiteName = '';
    this.isVendorSiteNameDisabled = false;
    this.isVendorSiteIdDisabled = false;
    this.resetVendorSiteModalTable();
  },
  //Get vendor site based on vendor name by running document script
  async getVendorSitesByVendorName(){
    const vendorName = this.$store.getters['vendorStore/getVendorName'];
    if (vendorName) {
      try {
        //In case of vendor user we are processing only document_type as 'invoice'
        //Hence while adding vendor site we are passing document_type as 'invoice'
        const payload = {
          'document_type': 'invoice',
          'field_name': 'vendor_site',
          'field_value': '',
          'payload': {'vendor_name':vendorName},
          'script_type': this.constant.SCRIPT_TYPE.REFERENCE,
          'document_id': '',
          'form': this.form
        }
        if(this.vendorSiteTableParams.rows && this.vendorSiteTableParams.rows.length == 0) {
          const documentScriptResponse = await DocumentScriptService.run(payload);
          if (documentScriptResponse) {
            const scriptResponseData = documentScriptResponse.data.body;
            if (scriptResponseData.isValidVendor) {
              const subsidaryData = scriptResponseData.data && scriptResponseData.data.subsidiary;
              this.vendorSiteTableParams.rows = [{ value: subsidaryData.name, key: subsidaryData.attributes.internalId }];
            }
          }
        }
      } catch (exception) {
        console.log(exception);
      }
    }
  },
  bankStatusColumnTemplate(props) {
    return PaymentService.getBankStatusBadge(props);
  },
  userStatusColumnTemplate(props) {
    return getStatusBadge(props);
  },
  async init(vendorSiteRecordId) {
    this.$store.commit('paymentStore/setPaymentUserType', "vendor");
    this.form.vendor_id = this.$store.getters['vendorStore/getVendorId'];
    try {
      if(vendorSiteRecordId){
        const projection = ['site_name', 'site_id', 'vendor_id', 'payment_enabled', 'default_payment_mode', 'payment_config', 'default'];
        const vendorSiteRecord = await VendorService.fetchVendorSiteDetailsById(vendorSiteRecordId, projection);
        this.$store.commit('vendorStore/setVendorSite', vendorSiteRecord);
        this.isPaymentUserCreated = VendorService.isVendorPaymentUserCreated(vendorSiteRecord);
        this.form = Object.assign({}, this.form, vendorSiteRecord);
        defaultForm = {...this.form}
      }
      //If 'vendor_site' is already present then, disable 'vendor_site_id'
      if (this.form.site_name) {
        this.isVendorSiteIdDisabled = true;
      };
      
      if (this.form.payment_enabled) {
        this.handlePaymentEnabled();
        this.prepareFetchBankAccAPI();
      }
      
      //If vendor site id and vendor is present, refresh vendor user table
      this.addVendorUserTableParams();
      //Updating defaultForm with the latest state of form
    } catch (error) {
      this.notifyError("Error while fetching vendor site record");
    }
  },
  async handlePaymentEnabled() {
    //If 'payment_enabled' is true, then make 'default_payment_mode' as required field
    // this.formRules.default_payment_mode[0].required = true;
    const [paymentDetails] = this.formRules.default_payment_mode;
    paymentDetails.required = true;
    if (this.isPaymentUserCreated) {
      const receiverUserRes = await VendorService.getReceiverUser(this.form.vendor_id, this.form.site_id)
      this.setReceiverDetailsInFormCtx(receiverUserRes)
    }
  },
  prepareFetchBankAccAPI() {
    let payload = { "vendor_id": this.form.vendor_id, "vendor_site_id": this.form.site_id };
    let apiName = `/portal/api/payments?action=getBankAccounts&data=${JSON.stringify(payload)}`;
    this.bankAccTableParams.apiName = apiName;
    this.refreshBankAccounts();
  },
  addVendorUserTableParams() {
    //Pass vendor_id and vendor_site_id to tableParams
    const queryParam = {
      "vendor_id": this.form.vendor_id,
      "vendor_site_id": this.form.site_id
    }
    this.tableParams.queryParam = { ...this.tableParams.queryParam,...queryParam }
    this.refreshVendorUsers();
  },
  checkIfDefaultModifiedByUser(){
    //Compare previous and current default values
    if(defaultForm.default != this.form.default){
      this.form.hasUserModifiedDefault = false;
      return;
    }    
    //This is true when default is NOT modified by user
    this.form.hasUserModifiedDefault = true;
  },
  resetForm(){
    defaultForm = { hasUserModifiedDefault: true };
    this.form = {};
    defaultPaymentDetailsForm = {}
    this.paymentDetails = {};
  },
  onBack() {
    const vendorRecordId = this.$store.getters['vendorStore/getVendorRecordId'];
    if(!vendorRecordId){
      this.$router.push("/idp/vendor/list")
      return;
    }
    this.$router.push(`/idp/vendor/detail?id=${vendorRecordId}`)
  },
  async onSave() {
    let isPaymentDetailsValid = true;
    this.disableSave = true;
    this.$setLoader({
      target: "#register-btn",
      spinner: "el-icon-loading",
    });
    const isFormValid = await this.$refs.form.validate().catch((error) => {});
    if(this.form.payment_enabled){
      isPaymentDetailsValid = await this.$refs.paymentDetails.validate().catch((error) => {});
    }
    if (!isFormValid || !isPaymentDetailsValid) {
      this.$resetLoader();
      this.disableSave = false;
      return;
    }
    return this.upsertRecord();
  },
  async upsertRecord() {
    try {
      let successMessage = '';
      if (this.form.payment_enabled) {
        this.checkIfDefaultModifiedByUser();
        if (!this.isPaymentUserCreated) {
          await VendorService.createReceiverUser(this.form.vendor_id, this.form.site_id, this.form.site_name, this.paymentDetails)
          this.isPaymentUserCreated = true;
          const vendorSiteDetailsResponse = await VendorService.saveVendorSiteDetails(this.form);
          successMessage = "Your payment service enabled successfully. You can now add bank accounts!";
          this.handleSaveSiteSuccessRes(vendorSiteDetailsResponse, successMessage);
          return;
        }
      }

      if (this.isPaymentUserCreated && this.isPaymentFormEdited) {
        await VendorService.updateReceiverUser(this.form.vendor_id, this.form.site_id, this.paymentDetails)
      }

      const vendorSiteDetailsResponse = await VendorService.saveVendorSiteDetails(this.form);
      successMessage = "Vendor site details updated successfully"
      this.handleSaveSiteSuccessRes(vendorSiteDetailsResponse, successMessage);
    } catch (error) {
      this.notifyError(_.get(error, 'response.data.error.message', error))
    } finally {
      this.$resetLoader();
      this.disableSave = false;
    };
  },
  handleSaveSiteSuccessRes(vendorSiteRes, successMessage) {
    this.$store.commit('vendorStore/setVendorSite', vendorSiteRes);
    this.notifySuccess(successMessage);
    //On retoggling of payment enable button, bank account should be fetched
    if (defaultForm.payment_enabled != this.form.payment_enabled) {
      if (this.form.payment_enabled) {
        this.prepareFetchBankAccAPI();
      } else {
        delete this.bankAccTableParams["apiName"];
        this.refreshBankAccounts();
      }
    }
    this.form = vendorSiteRes;
    defaultForm = {...this.form};
    this.isFormEdited = false;
    // maintaining isInitialized key to check and fill data on next edit, here used the following check to check if paymentUser is already created and then details are edited
    if(this.isPaymentUserCreated){
      defaultPaymentDetailsForm = {...this.paymentDetails};
      this.isPaymentFormEdited = false
    }
    //If new vendor site, then redirect back to vendor detail page
    if (!this.$route.query.id) {
      this.onBack();
    }
  },
  async setReceiverDetailsInFormCtx(receiverUserRes) {
    let paymentDetails = {};
    paymentDetails.city = receiverUserRes.data.city;
    paymentDetails.state = receiverUserRes.data.state;
    paymentDetails.zip = receiverUserRes.data.zip;
    paymentDetails.business_email = receiverUserRes.data.business_email;
    paymentDetails.street = receiverUserRes.data.street;
    this.paymentDetails = paymentDetails
    defaultPaymentDetailsForm = {...this.paymentDetails};
  },

  registerEvents() {
    EventBus.$on("refreshBankAccountTable", () => {
      this.refreshBankAccounts();
    });
  },
  destroyBusEvents(){
    const busEvents = [
        "refreshBankAccountTable"
      ];
    EventBus.$off(busEvents);
  },
},
async beforeMount() {
  this.$store.commit("setDisplayIdpTree",false);
  this.$store.commit("setDisplayIdpNavbar",true);
  const vendorSiteId = this.$route.query.id;
  this.init(vendorSiteId);
  this.destroyBusEvents();
  this.registerEvents();
},

beforeRouteLeave: function (to, from, next) {
  //If the payment_enabled is false then show error
  if(to.name == "AddBankAccount"){
    if(!this.form.payment_enabled){
      this.notifyError("Please enable payment to continue to add bank accounts!");
      return;
    }
  }
  if (this.isFormEdited) {
    return this.$refs.model.open(next);
  }
  this.resetForm()
  return next();
},
};
</script>

<style lang="scss">
@import "../_idpGlobal";

.vendor-site-detail {
  .el-input__prefix, .el-input__suffix {
    top: -6px !important;
  }
  .page-title {
    margin-left: 0 !important;
    margin-right: auto !important;
    .page-title-text {
      font-style: normal;
      font-weight: 600;
      font-size: var(--font-lg) !important;
      line-height: 27px;
      color: #4a5568 !important;
    }
  }

  .vendor-action-btns{
    .col-sm-2{
      .el-form-item__content{
        display: flex;
        align-items: center;        
      }
    }
  }
}

.table-wrap.form.payment_enable{
  padding: 0px 0px 30px 0px !important;
}

.vendor-site-div-body{
  margin-bottom: 5rem;
}
.back-button{
  margin-bottom: 2rem;
}
.divider-body{
  padding: 8px 36px 0px;
}
.el-col-vendor-site-div{
  margin-top: 0.571rem !important;
}
.kp-form-group {
  .el-input.is-disabled .el-input__inner{
    background-color: var(--dark-10) !important;
    color: var(--dark-04) !important;
  }
}
.vendor-site-div-btn{
  padding: 6px;
  margin-left: 2px !important;
}
.modal-vendor-site-name{
  width: 80% !important;
}
.vendor-site-page-table{
  .table-toolbar .export-btn{
    margin-left: 0rem;
  }
}
.vendor-site-dialog{
  .el-dialog {
    padding: 0rem;
  }
  .el-dialog__headerbtn{
    display: none;
  }
  .el-dialog__header {
    display: block !important;
    padding: 14px 18px;
  }
  .modal-bottom-btns{
    padding: 14px 18px;
  }
  .el-dialog__title {
    font-size: 16px;
    font-weight: 600;
  }
  .vendor-site-modal-divider{
    margin-top: 14px !important;
    margin-bottom: 0px !important;
  }
  .vendor-site-modal-body{
    margin: 14px 18px;
    .vendor-site-data-table{
      .table-toolbar{
        margin-bottom: 0rem;
      }
    }
  }
}
</style>
