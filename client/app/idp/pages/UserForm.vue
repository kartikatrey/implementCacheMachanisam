<template>
  <el-main class="user-form kp-main">
    <section class="page-body">
      <div class="page-title user-form-header">
        <div>
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
        <div v-if="showResendBtn" class="resend-activation-btn">
          <el-button :disabled="isActivationBtnDisabled" v-on:click="resendActivationLink" size="small" type="primary">Resend activation link</el-button>
        </div>
      </div>

      <section class="form-page-container">
        <div class="panel">
          <div class="panel-body" v-loading="loading">
            <el-form
              label-position="left"
              :model="form"
              ref="form"
              label-width="120px"
              :rules="formRules"
            >
              <ConfirmModel ref="model"></ConfirmModel>
              <div class="grouping-tile">General  configuration</div>
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
                        :disabled="form._id"
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
                          v-for="(_role,index) in rolesList"
                          :cid="'user-form-roles_'+index"
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
                        ref="orgComp"
                      ></org-hierarchy-list>
                    </el-form-item>
                  </div>
                </el-col>
              
                <el-col :span="12">
                  <div class="kp-form-group" v-loading="policyLoading">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="policies"
                      label="Policies"
                    >
                      <el-select
                        v-model="form.policies"
                        class="select-box"
                        multiple
                        cid="user-form-policies-select"
                        collapse-tags
                        placeholder="Select Policies"
                      >
                        <el-option
                          v-for="(_policy,index) in policyList"
                          :cid="'user-form-policies_'+index"
                          :key="_policy.value"
                          :label="_policy.label"
                          :value="_policy.value"
                          label-width="170px"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="40" v-if = '!showChangePwBtn'>
                <el-col :span="12">
                    <div class="kp-form-group">
                        <el-form-item prop="new_password" label="New password">
                            <el-input class="b-rad-4" v-model="form.new_password" type="password" auto-complete="off"></el-input>
                            <span :style="{ color: errorMessageColor }" v-if="errorMessages.passwordErrorMessage">
                                <!-- Check if errorMessages.passwordErrorMessage is an array and not empty -->
                                <template v-if="Array.isArray(errorMessages.passwordErrorMessage) && errorMessages.passwordErrorMessage.length > 0">
                                    <div v-for="(errorMessage, index) in errorMessages.passwordErrorMessage" :key="'new_pass_msg_'+index">
                                        <span>{{ errorMessage }}</span>
                                        <br> <!-- Add a line break after each error message -->
                                    </div>
                                </template>
                                <!-- If it's not an array and not empty, render it as a single string -->
                                <template v-else-if="errorMessages.passwordErrorMessage.length">
                                    {{ errorMessages.passwordErrorMessage }}
                                </template>
                            </span>
                        </el-form-item>
                    </div>
                </el-col>
								<el-col :span="12">
									<div class="kp-form-group">
										<el-form-item
											prop="confirm_password"
											label="Confirm password"
										>
											<el-input
												class="b-rad-4"
												v-model="form.confirm_password"
												type="password"
												auto-complete="off"
											></el-input>
                      <span :style="{ color: errorMessageColor }" v-show="errorMessages.confirmPasswordErrorMessage">{{ errorMessages.confirmPasswordErrorMessage }}</span>
										</el-form-item>
									</div>
								</el-col>
							</el-row>

              <!-- // change password -->
              <el-row :gutter="40">
                <el-col :span="12" v-if="isDemoTenantUser">
                    <div class="kp-form-group">
                        <el-button v-if="showChangePwBtn" v-on:click="isChangePasswordClick()" size="small" >Set Password</el-button>
                        <el-button v-else v-on:click="handleCancelBtnClick()" size="small" >Cancel</el-button>
                    </div>
                </el-col>
              </el-row>
              <div class="grouping-divide"></div>
              <div class="grouping-tile">Delegation</div>
              <el-row :gutter="40">
                <el-col :span="12">
                    <div class="kp-form-group">
                      <el-form-item
                        class="control-label col-sm-2"
                        prop="user"
                        label="User"
                      >
                        <el-select
                          v-model="form.delegate.user"
                          class="select-box"
                          cid="user-form-delegate_user-select"
                          collapse-tags
                          placeholder="Select Delegate User"
                          clearable
                        >
                          <el-option
                            v-for="(_delegate_user,index) in delegateUserList"
                            :cid="'user-form-policies_'+index"
                            :key="_delegate_user.value"
                            :label="_delegate_user.label"
                            :value="_delegate_user.value"
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
                    <el-form-item label="Start Date" class="control-label col-sm-2" prop="start_date" >
                      <el-date-picker type="date" placeholder="Pick Start Date" v-model="form.delegate.start_date" style="width: 100%;" :picker-options="pickerOptions" value-format="yyyy-MM-dd" default-time="00:00:00"></el-date-picker>
                    </el-form-item>
                    </div>
                  </el-col>
               
                  <el-col :span="12">
                    <div class="kp-form-group">
                    <el-form-item label="End Date" class="control-label col-sm-2" prop="end_date">
                      <el-date-picker type="date" placeholder="Pick End Date" v-model="form.delegate.end_date" style="width: 100%;" :picker-options="pickerOptions" value-format="yyyy-MM-dd" default-time="00:00:00"></el-date-picker>
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
          
          <!-- | panel body -->
          <footer>
            <div class="user-form-cancel-btn">
              <el-button size="small" v-on:click="onBack">Cancel</el-button>
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
  </el-main>
</template>

<script>
import { VueTelInput } from "vue-tel-input";
import Constants from "@/resources/Constants";
import UserService from "@/idp/services/UserService";
import _ from "lodash";
import ConfirmModel from "@/components/ConfirmModel";
import EventBus from "@/EventBus";
import OrgHierarchyList from "@/idp/components/OrgHierarchyList.vue";
import formMixin from "@/mixins/formMixin.js";

export default {
  name: "UserForm",
  mixins: [formMixin],
  components: {
    ConfirmModel,
    VueTelInput,
    OrgHierarchyList,
  },
  data() {
    const storage = JSON.parse(localStorage.getItem("vuex"));
    const userOrg =
      storage["user"] && storage["user"]["org"] ? storage["user"]["org"] : null;

    
    var EmptyValueValidator = (rule, value, callback) => {
      if (value && value.trim() === "") {
        callback(new Error(`Please enter valid label name`));
        return;
      }
      callback();
    };
    let self = this;
    let validateContact = (rule, value, callback) => {
      if (!value) {
        callback();
        return;
      }
      self.isContactValid
        ? callback()
        : callback(new Error(`Please enter valid contact`));
    };

    let validateEmail = (rule, value, callback) => {
      if (!value || ("" + value).trim() === "") {
        callback(new Error("Email cannot be empty"));
        return;
      }
      let valid = true;
      let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      valid = regex.test(value);
      valid ? callback() : callback(new Error("Please provide valid email"));
    };

    return {
      loading: false,
      showChangePwBtn: true, // This flag is a toggle for the "Set Password" and "Cancel" buttons.
      isDemoTenantUser : false, // This flag is used to determine whether the "Set Password" button should be displayed or hidden.
      errorMessages : {},
      errorMessageColor: "red",
      hideHigherThanLevel: userOrg,
      policyLoading: false,
      isSaveActionAllowed: false,
      form: {
        full_name: "",
        contact: "",
        roles: [],
        policies: [],
        email: "",
        org: "",
        locked: false,
        delegate: this.getDelegateUserObject(),
        confirm_password:"",
        new_password:"",
      },
      isContactValid: false,
      countriesHeight: 10,
      pageTitle: "user",
      rolesList: [],
      policyList: [],
      delegateUserList:[],
      disableRegister: false,
      cacheDataModal: {
        cachedForm: {},
        isFormEdited: false,
        isInitialized: false,
      },
      formRules: {
        full_name: [
          {
            validator: EmptyValueValidator,
            trigger: "blur",
          },
          {
            required: true,
            message: "Please enter name",
            trigger: "blur",
          },
        ],
        org: [
          {
            validator: EmptyValueValidator,
            trigger: "blur",
            message: "Please select org hierarchy",
          },
          {
            required: true,
            message: "Please provide org hierarchy",
            trigger: "blur",
          },
        ],
        roles: [
          {
            required: true,
            message: "Please select role",
            trigger: "change",
          },
        ],
        contact: [
          {
            validator: validateContact,
            trigger: "change",
          },
        ],
        email: [
          {
            validator: validateEmail,
            trigger: "blur",
          },
          {
            required: true,
            message: "Please enter email",
            trigger: "blur",
          },
        ],
      },
      pickerOptions: {
        /*
          Determines if a date should be disabled based on whether it is before the current date.
          Subtracting 8.64e7 (number of milliseconds in a day) ensures dates earlier than TODAY are disabled.
        */
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      onSelectEventName : "USER_FORM",
      isActivationBtnDisabled : false,
      showResendBtn : false,
    };
  },
  watch: {
    form: {
      handler(newVal, oldVal) {
        if (this.cacheDataModal.isInitialized) {
          this.cacheDataModal.isFormEdited =
            JSON.stringify(this.cacheDataModal.cachedForm) !=
            JSON.stringify(this.form);
        }
      },
      deep: true,
    },
    },
  methods: {
    isChangePasswordClick() {
      this.showChangePwBtn = !this.showChangePwBtn;
    },
    handleCancelBtnClick() {
      this.showChangePwBtn = true;
      this.form.new_password = "";
      this.form.confirm_password = "";
      this.errorMessages = {}; // on cancel removing error messages.
    },
    onContactValidate(data) {
      this.isContactValid = data.isValid;
    },
    onBack() {
      this.$router.push("/idp/users");
    },
    async onSave() {
      this.disableRegister = true;
      this.errorMessages = {};
      let self = this;
      UserService.saveUser(this.form)
        .then(async (response) => {
          if (!_.isEmpty(response.data && response.data.errorMessages)) {
            this.errorMessages.passwordErrorMessage = response.data.errorMessages.passwordErrorMessage;
            this.errorMessages.confirmPasswordErrorMessage = response.data.errorMessages.confirmPasswordErrorMessage;
            return;
          }
          this.$setLoader({
            target: "#register-btn",
            spinner: "el-icon-loading",
          });
          let valid = await this.$refs.form.validate().catch((error) => { });
          if (!valid) {
            this.$resetLoader();
            this.disableRegister = false;
            return;
          }
          let successMessage = this.form._id
            ? "User data saved successfully."
            : "User created successfully. Activation link has been sent to user on registered email.";
          this.form = response;
          self.notifySuccess(successMessage);
          self.cacheDataModal.isFormEdited = false;
          this.$router.push({ path: "/idp/users" });
        })
        .catch((error) => {
          self.notifyError(error);
        })
        .finally(() => {
          self.$resetLoader();
          self.disableRegister = false;
        });
    },
    getDelegateUserObject() {
            return {
                user: "",
                start_date:new Date(),
                end_date: new Date(),
            };
        },
    async resendActivationLink() {
      try {
        this.$setLoader({
          target: ".form-page-container",
          spinner: "el-icon-loading",
        });

        this.isActivationBtnDisabled = true;
        const payload = { user_email: this.form.email };
        const response = await UserService.sendActivationLink(payload);

        if (_.get(response, "statusCode") == 200) {
          this.notifySuccess("Activation link has been sent to user on registered email.");
        }

      } catch (error) {
        this.notifyError(error.message);
      }
      
      this.$resetLoader();
      this.isActivationBtnDisabled = false;
    },
    async fetchRoles() {
      try {
        let roles = await UserService.getRoles({active:true,is_idp:true}) || [];
        
        // Kanverse admin role is created for kanverse developers only and should not be available in roles dropdown
        // If anyone needs this role, it can only be added from backend
        roles = roles.filter(role => role.name != "idp_kanverse_admin");

        this.rolesList = (roles || []).map((role) => {
          return { value: "" + role._id, label: "" + role.label };
        });
      } catch (e) {
        console.error(e);
      }
    },

    async fetchDelegateUser() {
      try {
         const delegateuser = await UserService.fetch({
            active: true,
        });
        //const delegateuser = await UserService.getUserEmails({active:true});
        this.delegateUserList = (delegateuser || []).map((role) => {
          return { value: "" + role.email, label: "" + role.full_name };
        });
      } catch (e) {
        console.error(e);
      }
    },

    async fetchPolicies() {
      this.policyLoading = true;
      try {
        if (!this.form.org) {
          throw new Error("Org is not selected");
        }
        let iteratedVal = "";
        const params = {
          active:true,
          org: {
            $in: ("" + this.form.org).split("/").map((current) => {
              iteratedVal = iteratedVal ? iteratedVal + "/" + current : current;
              return iteratedVal;
            }),
          },
        };
        const policies = await UserService.getPolicies(params);
        this.policyList = (policies || []).map((policy) => {
          return { value: "" + policy._id, label: "" + policy.name };
        });
      } catch (e) {
        console.error(e);
      }
      this.policyLoading = false;
    },

    async fetchDropdownOptions() {
      this.loading = true;
      await Promise.all([this.fetchRoles(), this.fetchDelegateUser()]);
      this.loading = false;
    },
    /**
       * Removes specific properties from user data and returns the modified data.
       *
       * @param {Object} data - The user data object from which properties will be removed.
       * @returns {Object} - The modified user data with specified properties removed.
    */
    copyUserAndExcludeFields(data) {
      // Create a copy of the input data to avoid modifying the original object
      const modifiedData = { ...data };

      // List of properties to remove
      const propertiesToRemove = [
        "_id",
        "created_at",
        "created_by",
        "updated_at",
        "updated_by",
        "full_name",
        "email",
        "updatedAt",
        "createdAt",
        "otpCreatedAt",
        "verified",
        "socket_ids"
      ];

      // Remove specified properties from the data object
      propertiesToRemove.forEach(property => {
        if (modifiedData.hasOwnProperty(property)) {
          delete modifiedData[property];
        }
      });

      return modifiedData;
    },
    async init(recordId, userCloningEnabled) {
      this.fetchDropdownOptions();
      console.log("recordId:::",recordId)
      this.isDemoTenantUser = this.$store.getters.user.is_demo_tenant;
      if (!recordId) {
        this.cacheDataModal.isInitialized = true;
        this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = {
          ...this.form,
        };
        return;
      }
      try {
        let data = await UserService.fetchById(recordId);
        if (userCloningEnabled == "true") {
          data = this.copyUserAndExcludeFields(data)
        }
        this.form = Object.assign({}, this.form, data);

        // when clone user is enabled then we verified key is undefined
        if(this.form.verified !== undefined){
          this.showResendBtn = this.form.verified ? false : true;
        }
        this.cacheDataModal.isInitialized = true;
        this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = {
          ...this.form,
        };
        this.fetchPolicies();
      } catch (error) {
        this.notifyError("Error");
      }
    }
  },
  beforeDestroy() {
    EventBus.$off(["ON_SELECT_ORG_HIERARCHY_"+this.onSelectEventName]);
  },
  async beforeMount() {
    this.isSaveActionAllowed = await this.isSaveActionPermitted('cp_user');
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
    let recordId = this.$route.query.id;

    // Extract the user cloning enablement status from the current route's query parameters
    const userCloningEnabled = this.$route.query.clone;
    await this.init(recordId, userCloningEnabled);
    EventBus.$on("ON_SELECT_ORG_HIERARCHY_" + this.onSelectEventName, (data) => {
      this.form.org = data && data.org;
      // this.form.roles =[];
      this.form.policies = [];
      this.fetchPolicies();
    });
  },

  beforeRouteLeave: function (to, from, next) {
    if (this.cacheDataModal.isFormEdited) return this.$refs.model.open(next);
    else return next();
  },
};
</script>

<style lang="scss">
@import "../_idpGlobal";

.user-form {
  .el-input__prefix, .el-input__suffix {
    top: -6px !important;
  }
}
.user-form-header{
  display: flex;
  justify-content: space-between;
}

.kp-form-group {
  .vue-tel-input {
    height: 22px;
    background-color: var(--dark-10);
    input {
      background-color: var(--dark-10);
      font-size: var(--font-sm);
    }
  }
}
.vti__dropdown,
.vti__selection {
  outline: none;
  border: 0;
}
.vti__dropdown-list {
  height: 160px;
}
.vti__dropdown-list {
  z-index: 99 !important;
}

.user-form-cancel-btn{
  margin: auto !important;
  margin-right: inherit !important;
}

.resend-activation-btn{
  .el-button{
    display : flex;
    align-items : center;
    justify-content : center;
    padding : 0 1rem !important;
    font-family: var(--font-family);
    span{
      color: var(--white) !important;
    }
  }
}
</style>
