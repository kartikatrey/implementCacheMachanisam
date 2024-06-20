<template>
  <el-main>
    <div class="kp-back-to-parent">
      <el-button
        class="kp-btn-back"
        icon="el-icon-back"
        v-on:click="$router.push('customers' )"
      ></el-button>
      <h1 class="kp-page-title">Customers</h1>
    </div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/customers' }">Customers</el-breadcrumb-item>
      <el-breadcrumb-item>{{pageTitle}}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="kp-form-area">
      <div class="kp-form-panel">
        <el-row>
          <el-col>
            <el-form
              :label-position="labelPosition"
              label-width="100px"
              :model="form"
              :rules="formRules"
              ref="form"
            >
            <ConfirmModel ref="model"></ConfirmModel>
              <!-- <p class="form-heading">Basic</p> -->
              <el-row :gutter="72">
                <el-col :span="8">
                  <div class="kp-form-input-1 kp-form-field">
                    <el-form-item
                      class="kp-form-field-label"
                      prop="company_name"
                      label="Company Name"
                    >
                      <el-input v-model="form.company_name" placeholder="E.g. jadeglobal"></el-input>
                    </el-form-item>
                  </div>

                  <div class="kp-form-select-1 kp-form-field">
                    <el-form-item class="kp-form-field-label" prop="domain" label="Domain">
                      <el-input v-model="form.domain" placeholder="E.g. jadeglobal.com"></el-input>
                    </el-form-item>
                  </div>
                  <div class="kp-form-select-1 kp-form-field">
                    <el-form-item class="kp-form-field-label" prop="email" label="Email">
                      <el-input v-model="form.email" placeholder="E.g. headoffice@jadeglobal.com"></el-input>
                    </el-form-item>
                  </div>
                  <div class="kp-form-select-1 kp-form-field">
                    <el-form-item
                      class="kp-form-field-label"
                      prop="systems"
                      label="Systems Registered"
                    >
                      <el-input v-model="form.systems" type="number" placeholder="E.g. 10"></el-input>
                    </el-form-item>
                  </div>
                  <div class="kp-form-select-1 kp-form-field">
                    <el-form-item
                      class="kp-form-field-label"
                      prop="date_formats"
                      label="Date Formats"
                    >
                      <el-select v-model="form.date_formats" placeholder="Select">
                        <el-option
                          v-for="(value, key) in dateFormats"
                          :key="value"
                          :label="key"
                          :value="value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="kp-form-input-1 kp-form-field">
                    <el-form-item
                      class="kp-form-field-label"
                      prop="customer_name"
                      label="Customer Name"
                    >
                      <el-input v-model="form.customer_name" placeholder="E.g. jade"></el-input>
                    </el-form-item>
                  </div>
                  <div class="kp-form-input-1 kp-form-field">
                    <el-form-item
                      class="kp-form-field-label"
                      prop="mobileDomain"
                      label="Mobile Domain"
                    >
                      <el-input v-model="form.mobileDomain" placeholder="E.g. jadeglobal"></el-input>
                    </el-form-item>
                  </div>
                  <div class="kp-form-input-1 kp-form-field">
                    <el-form-item class="kp-form-field-label" prop="address" label="Address">
                      <el-input v-model="form.address" placeholder="E.g. 1/45 Los Angeles US"></el-input>
                    </el-form-item>
                  </div>
                  <div class="kp-form-input-1 kp-form-field">
                    <el-form-item
                      class="kp-form-field-label"
                      prop="subscription"
                      label="Subscriptions"
                    >
                      <el-input v-model="form.subscription" type="number" placeholder="E.g.200"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="72">
                <el-col :span="24">
                  <div class="kp-form-input-1 kp-form-field">
                    <el-form-item class="kp-form-field-label" prop="profile" label="Profile">
                      <codemirror v-model="form.profile" :options="editorOptions"></codemirror>
                    </el-form-item>
                  </div>
                  <el-checkbox
                    v-model="form.is_customer_invited_only"
                  >User Restriction Required</el-checkbox>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <el-button
        v-on:click.once="onSave"
        :key="buttonKey"
        class="kp-btn-form-primary"
        type="primary"
      >Save</el-button>
      <el-button v-on:click="displayList" class="kp-btn-form-outline">Cancel</el-button>
      <div v-if="!isFormValid" class="kp-form-error">* Please check field with errors</div>
    </div>
  </el-main>
</template>

<script>
import CustomerService from "../../services/CustomerService";
import CommonService from "@/services/CommonService";
import lodash from "lodash";
import Codemirror from "../../components/Codemirror.vue";
import Json from "@/util/Json";
import constants from "@/resources/Constants";
import ConfirmModel from "@/components/ConfirmModel";
import Validator from "@/services/Validator";

export default {
  name: "CustomerForm",
  components: {
    Codemirror,
    ConfirmModel
  },
  data() {
    return {
      labelPosition: "top",
      isFormValid: true,
      form: {
        // date_formats: []
      },
      dateFormats: constants.DATE_FORMATS,
      buttonKey: 1,
      endpoint: constants.CUSTOMERS_API_ENDPOINT,
      cacheDataModal: {
        cachedForm: {},
        isFormEdited: false
      },
      editorOptions: {
        mode: "text/javascript",
        theme: "default",
        value:"{}"
      },
      formRules: {
        company_name: [
          {
            required: true,
            message: "Please enter company name",
            trigger: "change"
          }
        ],
        customer_name: [
          {
            required: true,
            message: "Please enter customer name",
            trigger: "change"
          }
        ],
        domain: [
          {
            required: true,
            message: "Please enter domain",
            trigger: "change"
          }
        ],
        mobileDomain: [
          {
            required: true,
            message: "Please enter mobile domain",
            trigger: "change"
          }
        ],
        email: [
          {
            required: true,
            message: "Please input email address",
            trigger: "change"
          },
          {
            type: "email",
            message: "Please input correct email address",
            trigger: ["blur", "change"]
          }
        ],
        address: [
          {
            required: true,
            message: "Please enter address",
            trigger: "change"
          }
        ],
        systems: [
          {
            required: true,
            message: "Please enter system numbers",
            trigger: "change"
          }
        ],
        // date_formats: [
        //   {
        //     required: true,
        //     message: "Please select date formats",
        //     trigger: "change"
        //   }
        // ],
        profile: [
          {
            required: true,
            message: "Please enter profile",
            validator: Validator.scriptValidator,            
            trigger: "change"
          }
        ],
        subscription: [
          {
            required: true,
            message: "Please enter subscription number",
            trigger: "change"
          }
        ]
      }
    };
  },
  watch: {
    form: {
      handler(newVal, oldVal) {
        let cachedForm = _.pickBy(this.cacheDataModal.cachedForm, _.identity);
        let form = _.pickBy(this.form, _.identity);
        cachedForm = JSON.stringify(cachedForm).replace(/\\n|\\t|\\r/g, "");
        form = JSON.stringify(form).replace(/\\n|\\t|\\r/g, "");
        this.cacheDataModal.isFormEdited = cachedForm != form;


         console.log("data 1",cachedForm);
         console.log("data 21111",form);


      },
      deep: true
    }
  },
  methods: {
    validateJson(rule, value, callback) {
      if (lodash.isEmpty(value)) {
        callback();
      }
      Json.isJson(value)
        ? callback()
        : callback(new Error("Please input correct JSON format"));
    },
    async onSave() {
      this.cacheDataModal.isFormEdited = false;
      let isValid = await this.$refs.form.validate().catch(error => {});
      this.isFormValid = isValid;
      let form =
        isValid &&
        CommonService.save(this.endpoint, this.form).catch(error => {
          this.isFormValid = false;
          this.notifyError("There is an error in saving customer data");
        });
      if (form) {
        this.form._id = form._id; // add service id after first request to existing service object to avoid duplicate service entries
        this.notifySuccess("record saved successfully!!");
        this.displayList();
      }
      this.buttonKey++;
    },
    displayList() {
      this.$router.push({
        path: "/customers"
      });
    },
    async init() {
      let recordId = this.fetchRecordId();
      if (recordId) {
        let response = await CustomerService.fetchById(recordId).catch(
          error => {
            this.notifyError("There is an error in fetching customer data");
          }
        );
        this.form =
          (response && _.defaultsDeep(response, this.form)) || this.form;

        this.pageTitle = response && `Edit ${this.form.customer_name}`;
        this.cacheDataModal.cachedForm = _.cloneDeep(this.form);
        return;
      } else {
        this.cacheDataModal.cachedForm = _.cloneDeep(this.form);
      }
      this.pageTitle = "New Customer";
    },
    fetchRecordId() {
      return this.$route.query.id;
    }
  },
  beforeMount() {
    let user = this.$store.getters.user;
    if (user.roles.includes("admin")) {
      this.showList = true;
    }
    this.init();
    window.addEventListener("beforeunload", event => {
      if (!this.cacheDataModal.isFormEdited) return;
      event.preventDefault();
      event.returnValue = "";
    });
  },
  beforeRouteLeave: function(to, from, next) {
    if (this.cacheDataModal.isFormEdited) {
      //    return window.confirm('Do you really want to leave? you have unsaved changes!')
      return this.$refs.model.open(next);
    } else {
      return next();
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";

// .el-breadcrumb {
//   line-height: 21px;

//   .el-breadcrumb__inner.is-link,
//   .el-breadcrumb__inner a {
//     color: #bcbec0;
//     font-weight: 300;

//     &:hover {
//       color: #000;
//     }
//   }

//   span {
//     color: #bcbec0;

//     .el-breadcrumb__inner {
//       color: #bcbec0 !important;
//     }
//   }
// }

// // end breadcome style

// .kp-back-to-parent {
//   margin-bottom: 8px;
//   margin-top: 32px; // Temporary

//   .kp-page-title {
//     margin-left: 8px;
//     vertical-align: middle;
//   }
// }

// .kp-btn-back {
//   background: transparent;
//   border-color: #005da6;
//   color: #005da6;
//   padding: 12px;
// }

// // .kp-page-title {
// //   font-size: 28px;
// //   color: #005da6;
// //   margin: 0;
// //   display: inline-block;
// // }

// .kp-form-panel {
//   background: #fff;
//   padding: 32px;
//   border-radius: 7px;
//   margin-top: 32px;
//   box-shadow: 0 0px 6px 1px rgba(0, 0, 0, 0.1);
//   margin-bottom: 32px;
// }

// .kp-from-actions {
//   margin-top: 40px;
// }

// .kp-blank-btn {
//   border: none;
//   background: transparent;
// }

// .kp-form-field {
//   margin-bottom: 22px;
//   input,
//   select {
//     background: #f5f6fa;
//   }
// }

// .kp-form-field-label {
//   color: #77787b;
//   font-size: 14px;
//   margin-bottom: 8px;

//   &:before {
//     content: "";
//   }
// }

// .kp-btn-form-primary {
//   background: #005da6;
//   color: #ffffff;
//   font-weight: bold;
// }

// .kp-btn-form-outline {
//   background: transparent;
//   border-color: #005da6;
//   color: #005da6;
// }

// .kp-form-error {
//   display: inline-block;
//   margin-left: 16px;
//   color: #ff4343;
//   font-size: 14px;
// }

// .kp-form-field-invalid {
//   input,
//   select {
//     border: 1px solid #ff4343;
//   }

//   .kp-form-field-invalid-label {
//     color: #ff4343;
//     font-size: 12px;
//     margin-top: 4px;

//     &:before {
//       content: "* ";
//     }
//   }
// }
// .kp-form-field-checkbox1 {
//   .el-checkbox__inner {
//     width: 22px;
//     height: 22px;
//     background: #f5f6fa;
//   }

//   .el-checkbox__label {
//     color: #77787b;
//   }
// }
// // Codemirror STyle
// .CodeMirror {
//   position: relative;
//   overflow: hidden;
//   border: 1px solid #ebebeb;
//   background: #f5f6fa;
// }
// .CodeMirror-gutters {
//   //height: 39px;
//   left: 0px;
//   background: rgb(216, 219, 230);
// }
// // / Codemirror STyle
</style>


