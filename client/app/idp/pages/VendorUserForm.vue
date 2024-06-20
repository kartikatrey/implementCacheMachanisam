<template>
    <el-main class="vendor-user-form kp-main">
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
                @focusout.native="checkIfFormEdited"
              >
                <ConfirmModel ref="model"></ConfirmModel>
                <el-row :gutter="40">
                  <el-col :span="12">
                    <div class="kp-form-group">
                      <el-form-item
                          class="control-label col-sm-2"
                          prop="vendor_name"
                          label="Vendor"
                        >
                        <el-autocomplete 
                          class="autoCompleteInput"
                          v-model="form.vendor_name"
                          :cid="user-form-vendor-name"
                          :fetch-suggestions="getVendorNameList"
                          :trigger-on-focus="false"
                          name="vendor_name"
                          popper-class="autocomplete-dropdown"
                          @blur="handleVendorBlurEvent"
                          @select="getVendorSiteByVendorName"
                          :disabled = "true"
                          >
                          <template slot-scope="{ item }">
                            <div v-if="item.value.length > 10">
                              <el-tooltip
                                class="item"
                                effect="light"
                                :content="item.value"
                                placement="left"
                              >
                                <div class="auto-complete-item-list">{{ item.value }}</div>
                              </el-tooltip>
                            </div>
                            <div v-else>
                              <div class="auto-complete-item-list">{{ item.value }}</div>
                            </div>
                          </template>
                        </el-autocomplete>
                      </el-form-item>     
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="kp-form-group" v-loading="vendorSiteLoading">
                      <el-form-item
                        class="control-label col-sm-2"
                        prop="vendor_site"
                        label="Vendor Site"
                      >
                        <el-select
                          v-model="form.vendor_site"
                          class="select-box"
                          cid="user-form-vendor-site-select"
                          collapse-tags
                          placeholder="Select Vendor Site"
                          disabled
                          clearable
                        >
                          <el-option
                            v-for="(_vendor_site,index) in vendorSiteList"
                            :cid="'user-form-vendor-site_'+index"
                            :key="_vendor_site.value"
                            :label="_vendor_site.label"
                            :value="_vendor_site.value"
                            label-width="170px"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="40">
                  <el-col :span="12">
                    <div class="kp-form-group">
                      <el-form-item
                        class="control-label col-sm-2"
                        prop="full_name"
                        label="Name"
                      >
                        <el-input
                        cid="user-form-name"
                        class="form-control"
                        v-model="form.full_name"
                        :rows="2"
                        placeholder
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="kp-form-group">
                      <el-form-item prop="contact" label="Contact">
                        <vue-tel-input
                        class="form-control"
                          v-model="form.contact"
                          :maxLen="17"
                          cid="user-form-contact"
                          autocomplete="off"
                          mode="international"
                          validCharactersOnly
                          placeholder="Contact Number"
                          required
                          @validate="onContactValidate"
                          invalidMsg="Please enter valid contact number"
                          defaultCountry="US"
                        ></vue-tel-input>
                      </el-form-item>
                    </div>
                  </el-col>  
                </el-row>
                <el-row :gutter="40">
                  <el-col :span="12">
                    <div class="kp-form-group">
                      <el-form-item
                        class="control-label col-sm-2"
                        prop="email"
                        label="Email"
                      >
                        <el-input
                          cid="user-form-email"
                          class="form-control"
                          prop="email"
                          v-model="form.email"
                          placeholder
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="kp-form-group">
                      <el-form-item
                        class="control-label col-sm-2"
                        prop="org"
                        label="Select Hierarchy"
                      >
                        <org-hierarchy-list
                          :onSelectEventName="onSelectEventName"
                          cid="user-form-hierarchy"  
                          :hideHigherThanLevel="hideHigherThanLevel"
                          :selectedValue="form.org"
                          v-model="form.org"
                        ></org-hierarchy-list>
                      </el-form-item>
                    </div>
                  </el-col>  
                </el-row>
                <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="locked" label="Locked">
                      <toggle-button :sync="true" :color="{
                        checked: '#5f8fdf',
                        unchecked: '#DCDFE6',
                        disabled: '#CCCCCC',
                      }" :labels="{ checked: 'YES', unchecked: 'NO' }" cid="user-form-user-locked" v-model="form.locked"></toggle-button>
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
import { VueTelInput } from "vue-tel-input";
import UserService from "@/idp/services/UserService";
import _ from "lodash";
import ConfirmModel from "@/components/ConfirmModel";
import Constants from "@/resources/Constants";
import DocumentScriptService from "@/idp/services/DocumentScriptService";
import OrgHierarchyList from "@/idp/components/OrgHierarchyList.vue";
import EventBus from "@/EventBus";
import store from "@/store/store";
import Validator from "@/services/Validator";
let defaultForm = {
  vendor_name:"",
  vendor_id: "",
  vendor_site:"",
  full_name: "",
  contact: "",
  email: "",
  org:"",
  locked: false,
  user_type: Constants.DOCEX.USER_TYPE.VENDOR
}

export default {
  name: "VendorUserForm",
  components: {
    ConfirmModel,
    VueTelInput,
    OrgHierarchyList
  },
  data() {
    const user = store.getters["user"];
    const userOrg = user && user["org"];

    const validateContact = (rule, value, callback) => {
      if (!value) {
        callback();
        return;
      }
      this.isValidContact
        ? callback()
        : callback(new Error(`Please enter valid contact`));
    };

    return {
      constant:Constants.DOCEX,
      form: {...defaultForm},
      isFormEdited: false,
      hideHigherThanLevel: userOrg,
      isValidContact: false,
      isValidVendorName: false,
      pageTitle: "Vendor User",
      vendorSiteList:[],
      vendorsDetails: [],
      disableRegister: false,
      vendorSiteLoading: false,
      formRules: {
        full_name: [
          {
            required: true,
            message: "Please enter name",
            trigger: "blur",
          },
        ], 
        email: [
          {
            validator: Validator.emailValidator,
            trigger: "blur",
            required: true
          }
        ],
        contact: [
          {
            validator: validateContact,
            trigger: "change",
          },
        ],
        vendor_name: [
          {
            required: true,
            message: "Please select vendor name",
            trigger: "blur",
          },
        ],
        vendor_site: [
          {
            required: true,
            trigger: "blur",
          },
        ],
        org: [
          {
            required: true,
            message: "Please provide org hierarchy",
            trigger: "change",
          },
        ]
      },
      onSelectEventName : "VENDOR_USER_FORM"
    };
  },
  methods: {
    checkIfFormEdited(){
      this.isFormEdited = Object.keys(this.form).some(field => 
      this.form[field] !== defaultForm[field]
      )
    },
    async getVendorNameList(queryString, cb) {
      try {
        //In case of vendor user we are processing only document_type as 'invoice'
        const payload = {
          'document_type': 'invoice',
          'field_name': 'vendor_name',
          'field_value': queryString,
          'script_type':  this.constant.SCRIPT_TYPE.AUTO_COMPLETE,
          'document_id': '',
          'form': this.form
        }
        const docScriptResponse = await DocumentScriptService.run(payload);
        const data = docScriptResponse.data.body;
        this.vendorsDetails = data;
        cb(data || []);
      } catch (exception) {
        console.log(exception);
        cb([])
      }
    },
    handleVendorBlurEvent(){
      if(!this.form.vendor_name){
        this.form.vendor_site = ''
        this.vendorSiteList = []
      }
    },
    //Get vendor site based on  vendor name by running document script
    async getVendorSiteByVendorName(){
      if (this.form.vendor_name) {
        const vendorRecord = _.find(this.vendorsDetails, {
          value: this.form.vendor_name,
        })
        this.form.vendor_id = vendorRecord.key;
        this.vendorSiteLoading = true;
        try {
          //In case of vendor user we are processing only document_type as 'invoice'
          const payload = {
            'document_type': 'invoice',
            'field_name': 'vendor_name',
            'field_value': this.form.vendor_name,
            'script_type': this.constant.SCRIPT_TYPE.REFERENCE,
            'document_id': '',
            'form': this.form
          }
          const documentScriptResponse = await DocumentScriptService.run(payload);
          const scriptResponseData = documentScriptResponse.data.body;
          const subsidaryData =  scriptResponseData.data.subsidiary;
          this.vendorSiteList = [{ label: subsidaryData.name, value: subsidaryData.name }];
        } catch (exception) {
          console.log(exception);
        }
        this.vendorSiteLoading = false;
      }
    },
    initializeForm(){
      this.form.vendor_id =  this.$store.getters['vendorStore/getVendorId'];
      this.form.vendor_name = this.$store.getters['vendorStore/getVendorName'];
      this.form.vendor_site_id= this.$store.getters['vendorStore/getVendorSiteId'];
      this.form.vendor_site= this.$store.getters['vendorStore/getVendorSiteName'];
      // After leaving the route, we reset this form, but then we fail to add the required key for user_type as "vendor_user.
      // Hence adding that key
      this.form.user_type = Constants.DOCEX.USER_TYPE.VENDOR
    },
    async init(userRecordId) {
      //save vendor_id, vendor_name, vendor_site_id, vendor_site while saving users
      this.initializeForm();
      if (!userRecordId) {
        defaultForm = {...this.form};
        this.isFormEdited = false;
        return;
      }
      try {
        const projection = [
          'full_name', 
          'email', 
          'contact', 
          'vendor_id', 
          'vendor_name', 
          'vendor_site_id', 
          'vendor_site', 
          'org',
          'locked',
          'roles'
        ]        
        const userRecord = await UserService.fetchById(userRecordId, projection);
        this.form = Object.assign({}, this.form, userRecord);
        defaultForm = {...this.form};
        this.isFormEdited = false;
      } catch (error) {
        this.notifyError("Error while fetching user record");
      }
    },
    onContactValidate(data) {
      this.isValidContact = data.isValid;
    },
    onBack() {
      const vendorSiteRecordId = this.$store.getters['vendorStore/getVendorSiteRecordId'];
      this.$router.push(`/idp/vendor/vendor-site-detail?id=${vendorSiteRecordId}`)
    },
    resetForm(){
      this.form = {};
      this.initializeForm();
      defaultForm = {...this.form}
    },
    async onSave() {
      this.disableRegister = true;
      this.$setLoader({
        target: "#register-btn",
        spinner: "el-icon-loading",
      });
      const isFormValid = await this.$refs.form.validate().catch((error) => {});
      if (!isFormValid) {
        this.$resetLoader();
        this.disableRegister = false;
        return;
      }
      return this.insertRecord();
    },
    async insertRecord() {
      const self = this;
      try{
        const userResponse = await UserService.saveUser(this.form);
        if(userResponse){
          const successMessage = this.form._id
            ? "Vendor user data saved successfully."
            : "Vendor user created successfully. Activation link has been sent to user on registered email.";
          this.form = userResponse;
          self.notifySuccess(successMessage);
          self.isFormEdited = false;
          this.onBack();
        }
      }catch(error){
        self.notifyError(error);
      }finally{
          self.$resetLoader();
          self.disableRegister = false;
        };
    }
  },

  async beforeMount() {
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
    const recordId = this.$route.query.id;
    this.init(recordId);
    EventBus.$on("ON_SELECT_ORG_HIERARCHY_"+this.onSelectEventName, (data) => {
      this.form.org = (data && data.org) || '';
      //After selecting org this event gets emitted,then we need to validate form rules
      this.$refs.form.validate().catch((error) => {});
    });
  },

  beforeDestroy() {
    EventBus.$off(["ON_SELECT_ORG_HIERARCHY_"+this.onSelectEventName]);
  },

  beforeRouteLeave: function (to, from, next) {
    if (this.isFormEdited) {
      return this.$refs.model.open(next);
    }
    this.resetForm();
    return next();
  },
};
</script>

<style lang="scss">
@import "../_idpGlobal";

.vendor-user-form {
  .el-input__prefix, .el-input__suffix {
    top: -6px !important;
  }
}

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
    color: var(--dark-04) !important;
  }
}

.autoCompleteInput{
  width: 100%;
}
</style>
