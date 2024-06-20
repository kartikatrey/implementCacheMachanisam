<template>
  <el-row style="overflow: scroll;">
    <!-- Main Container -->
    <el-col :span="24">
      <el-row class="kp-header">
        <!-- Header Container -->
        <el-col>
          <el-header>
            <el-row>
              <el-col :span="16" :offset="4">
                <el-menu
                  :default-active="'1'"
                  class="kp-el-menu"
                  mode="horizontal"
                  @select="handleSelect"
                >
                  <img class="kp-logo" src="@/assets/images/logo-ai.svg" alt />

                  <el-menu-item class="kp-nav-item" index="3">
                    <a class="nav-link" href="/register-customer">Register</a>
                  </el-menu-item>
                  <el-menu-item class="kp-nav-item" index="3">
                    <a class="nav-link" :href="web_host+'/contact.html'">Contact</a>
                  </el-menu-item>

                  <el-menu-item class="kp-nav-item" index="3">
                    <a class="nav-link" :href="web_host+'/index.html#resources'">Resources</a>
                  </el-menu-item>
                  <el-submenu index="3" class="solution-submenu">
                    <template slot="title">Solutions</template>
                    <el-menu-item index="3-1" class="submenu-item">
                      <a
                        class="nav-link"
                        :href="web_host+'/enterprise-virtual-assistant.html'"
                      >Enterprise Virtual Assistant</a>
                    </el-menu-item>
                    <el-menu-item index="3-2" class="submenu-item">
                      <a
                        class="nav-link"
                        :href="web_host+'/intelligent-it-service-desk.html'"
                      >Intelligent IT Service Desk</a>
                    </el-menu-item>
                    <el-menu-item index="3-3" class="submenu-item">
                      <a
                        class="nav-link"
                        :href="web_host+'/ai-ocr.html'"
                      >AI Document Data Extraction</a>
                    </el-menu-item>
                  </el-submenu>
                  <el-menu-item class="kp-nav-item" index="3">
                    <a class="nav-link" :href="web_host+'/platform.html'">Platform</a>
                  </el-menu-item>
                </el-menu>
              </el-col>
            </el-row>
          </el-header>
        </el-col>
      </el-row>
      <!-- Main Container Ends -->
      <el-row id="email_confirmation_alert" class="kp-email-confirmation-alert">
        <el-col :span="16" :offset="4" v-if="confirmation_email">
          <h2>
            Confirmation Email has been sent to
            <span>{{confirmation_email}}</span>
          </h2>
        </el-col>
      </el-row>

      <el-row class="kp-banner">
        <!-- Banner Container Ends -->
        <el-col :span="6" :offset="4">
          <div class="kp-banner-text">
            <h2>{{trial_period}} Days Free Trial</h2>
            <span>Get the right fit with Kanverse for</span>
            <br />
            <span>your business</span>
          </div>
        </el-col>
      </el-row>
      <!-- Banner Container Ends -->

      <!-- Main Content Start-->
      <el-row id="section1" class="section1 kp-register-main-content">
        <el-col :span="16" :offset="4">
          <el-row>
            <el-col :span="16">
              <!-- Image Container -->
              <img src="@/assets/images/bot.png" alt="avatar" />
              <!-- Image Container Ends-->
            </el-col>

            <el-col :span="8">
              <!-- Form Container -->
              <div class="register-form-page-header">Get Started</div>

              <el-form
                :model="form"
                :rules="formRules"
                ref="form"
                class="contact-form"
                id="customerRegisterForm"
              >
                <!-- First Name -->
                <el-row>
                  <el-form-item prop="full_name">
                    <label for>FULL NAME *</label>
                    <el-input v-model="form.full_name" placeholder="Full Name"></el-input>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item prop="email">
                    <label for>EMAIL *</label>
                    <el-input v-model="form.email" type="email" placeholder="Email Id"></el-input>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item prop="contact">
                    <label for>PHONE *</label>
                    <vue-tel-input
                      v-model="form.contact"
                      :maxLen=15
                      autocomplete="off"
                      mode="international"
                      validCharactersOnly
                      placeholder="Contact Number"
                      required
                    ></vue-tel-input>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item prop="company_name">
                    <label for>COMPANY *</label>
                    <el-input v-model="form.company_name" placeholder="Company Name"></el-input>
                  </el-form-item>
                </el-row>
                <!-- <el-row>
                  <el-form-item prop="role">
                    <label for>ROLE</label>
                    <br />
                    <el-select v-model="form.role" placeholder="Choose a Role">
                      <el-option
                        v-for="role in role_map"
                        :key="role.value"
                        :label="role.label"
                        :value="role.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-row>-->
                <el-row :gutter="6">
                  <el-button
                    v-loading="loading"
                    element-loading-text="Loading..."
                    element-loading-spinner="el-"
                    element-loading-background="#148ad9"
                    class="btn-save"
                    id="submitCustomerDetails"
                    type="primary"
                    @click="saveCustomerDetails"
                  >SUBMIT</el-button>
                </el-row>
              </el-form>
            </el-col>
            <!-- Image Container Ends-->
          </el-row>
        </el-col>
      </el-row>
      <!-- Main Content End-->

      <!-- Payment Content Start-->
      <el-row id="section2" class="section2 kp-payment-main-content">
        <el-col :span="16" :offset="4">
          <!-- Products Container -->

          <el-row>
            <el-col :span="16">
              <el-radio-group v-model="price_id" size="medium" class="plans">
                <el-row
                  v-for="(plan_Type,key) in product_plans"
                  :key="plan_Type.id"
                  style="margin-bottom: 32px"
                >
                  <div class="plan-title">{{key}}</div>
                  <el-col class="plan" v-for="plan in plan_Type" :span="6" :key="'one'+plan.id">
                    <div class="plan-card" v-on:click="showCardDetails(plan)">
                      <span class="plan-card-label1">{{plan.metadata.display_name}}</span>
                      <br />
                      <span
                        class="plan-card-label2"
                      >${{ plan.unit_amount /100}}/{{plan.recurring.interval}}</span>
                      <el-radio :label="plan.id" class="plan-radio"></el-radio>
                    </div>
                  </el-col>
                </el-row>
              </el-radio-group>
              <!-- Products Container Ends-->
              <br />
              <!-- Products Description-->
              <el-card class="plan-details">
                <div v-if="plan_details" class="text item plan-detils-list-item">
                  <div
                    class="plan-details-title"
                  >{{plan_details.display_name}} {{plan_details.plan_type}}</div>
                  <span v-for="feature in plan_details.features" :key="feature">
                    {{feature}}
                    <br />
                  </span>
                </div>
              </el-card>
              <!-- Products Description Ends-->
            </el-col>

            <el-col :span="8">
              <!-- Credit Card -->
              <div
                class="kp-charge-message"
              >Your credit card will not be charged during trial period.</div>
              <div class="credit-card-title">Credit card info</div>
              <el-form :model="cc_form" id="payment-form" :rules="cardFormRules" ref="cc_form">
                <el-row>
                  <el-form-item prop="name_on_card">
                    <label for="name">CARDHOLDER NAME *</label>
                    <br />
                    <el-input v-model="cc_form.name_on_card" placeholder="Name on card"></el-input>
                  </el-form-item>
                </el-row>
                <el-row>
                  <label for="card-element">CREDIT CARD *</label>
                  <div id="card-element" class="form-control">
                    <!-- A Stripe Element will be inserted here. -->
                  </div>
                </el-row>

                <!-- Used to display form errors. -->
                <el-row class="credit-card-error-row">
                  <div id="card-errors" role="alert"></div>
                </el-row>
                <el-row>
                  <el-button
                    v-loading="loading"
                    element-loading-text="Loading..."
                    element-loading-spinner="el-"
                    element-loading-background="#148ad9"
                    class="btn-save"
                    id="submit"
                    v-on:click="save"
                    type="primary"
                  >Start {{trial_period}} days free trial</el-button>
                </el-row>

                <!-- <input type="submit" id="submit" value="Submit Payment"/> -->
              </el-form>
              <!-- Credit Card Ends -->
            </el-col>
          </el-row>

          <!-- Products Description Ends-->
        </el-col>
      </el-row>
      <!-- Payment Content End-->

      <!-- Success Content Start-->
      <el-row id="section3" class="section3 success-main-content">
        <el-col :span="16" :offset="4">
          <el-row>
            <el-col :span="16" :offset="4">
              <div class="success-block">
                <img class="kp-success-icon" src="@/assets/images/correct.svg" alt />
                <div>
                  <span class="kp-success-heading">Success</span>
                </div>
                <p class="success-message">
                  Your trial period is now active. We have sent confirmation on your
                  <br />email address
                </p>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <!-- Success Content End-->
    </el-col>
  </el-row>
  <!-- Main Container End -->
</template>

<script src="https://js.stripe.com/v3/"></script><script>
import Constants from "@/resources/Constants";
import async from "async";
import _ from "lodash";
import AjaxService from "@/services/AjaxService";
import PaymentService from "@/services/PaymentService";
import CustomerRegistration from "@/services/CustomerRegistration";
import { VueTelInput } from "vue-tel-input";
const stripe = Stripe("placeholder");
export default {
  name: "RegisterCustomer",
  components: {
    VueTelInput,
  },
  data() {
    return {
      form: {
        full_name: "",
        email: "",
        contact: "",
        company_name: "",
        // role: "",
      },
      // role_map: Constants.CUSTOMER_ROLE_MAPPING,
      registration_id: false,
      loading: false,
      price_id: "",
      activeIndex: 0,
      card: "",
      userData: {},
      plan_type: "",
      web_host: Constants.KANVERSE_WEBSITE_HOST,
      confirmation_email: "",
      cc_form: { name_on_card: "" },
      customer_id: "",
      trial_period: "30",
      product_plans: [],
      plan_details: {},
      handleSelect: () => {},
      cardFormRules: {
        name_on_card: [
          {
            required: true,
            message: "Please enter name on card",
            trigger: "blur",
          },
          //   {
          //   pattern: /^[a-zA-Z_ ]*$/,
          //   message: 'Name should contain alphabates only',
          //   trigger: 'blur'
          // }
        ],
      },
      formRules: {
        full_name: [
          {
            required: true,
            message: "Please enter full name",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "Please enter email",
            trigger: "blur",
          },
          {
            type: "email",
            message: "Please input correct email address",
            trigger: ["blur", "change"],
          },
        ],
        contact: [
          {
            required: true,
            message: "Please enter contact number",
            trigger: "blur",
          },
          // {
          //   pattern: /^\d*$/,
          //   message: "Contact number should contain numbers only",
          //   trigger: "blur"
          // }
        ],
        company_name: [
          {
            required: true,
            message: "Please enter company name",
            trigger: "blur",
          },
        ],
      },
    };
  },

  methods: {
    saveCustomerDetails() {
      this.confirmation_email = "";
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }
        let formData = this.prepareCustomerRegistrationData();
        this.loading = true;
        CustomerRegistration.createCustomer(formData)
          .then((response) => {
            this.loading = false;
            if (!response.status) {
              return this.$notify.error({
                title: "Error",
                message: response.message,
              });
              return;
            }
            this.registration_id = response.registration_id;
            var section1 = document.getElementById("section1");
            var section2 = document.getElementById("section2");
            var email_confirmation_alert = document.getElementById(
              "email_confirmation_alert"
            );
            section1.style.display = "none";
            section2.style.display = "block";
            email_confirmation_alert.style.display = "block";
          })
          .catch((error) => {
            this.loading = false;
            console.log("Error occured while creating customer");
            return this.$notify.error({
              title: "Error",
              message: "Error occured while creating customer",
            });
          });
      });
    },

    prepareCustomerRegistrationData() {
      this.confirmation_email = this.form.email;
      return {
        full_name: this.form.full_name,
        email: this.form.email,
        contact: this.form.contact,
        company_name: this.form.company_name,
        status: "Requested",
        // country_code: "91", // $("#countryCode option:selected").val(),
        created_on: new Date()
        // role: this.form.role,
      };
    },
    save(event) {
      event.preventDefault();
      this.$refs.cc_form.validate((valid) => {
        if (!valid) {
          return;
        }
        if (this.loading) return;
        this.loading = true;

        stripe
          .createToken(this.card, {
            name: this.cc_form.name_on_card,
          })
          .then((result) => {
            this.loading = false;
            if (result.token) {
              // Send the token to your server.
              this.customerOnboarding(result.token.id);
              return;
            }
            // Inform the user if there was an error.
            var errorElement = document.getElementById("card-errors");
            errorElement.textContent = result.error.message;
          });
      });
    },
    showCardDetails(plan) {
      this.price_id = plan.id;
      this.plan_details = plan.metadata;
    },
    customerOnboarding(token) {
      this.loading = true;
      this.token_data = {
        source: token,
        price_id: this.price_id,
        formData: this.form,
        registration_id: this.registration_id,
      };
      CustomerRegistration.onBoarding(this.token_data)
        .then((response) => {
          this.loading = false;
          if (!response.status) {
            this.$notify.error({
              title: "Error",
              message: response.message,
            });
            return;
          }

          var section2 = document.getElementById("section2");
          var section3 = document.getElementById("section3");
          var email_confirmation_alert = document.getElementById(
            "email_confirmation_alert"
          );
          section2.style.display = "none";
          section3.style.display = "block";
          email_confirmation_alert.style.display = "none";
        })
        .catch((error) => {
          this.loading = false;
          console.log("Error occured while creating customer");
          this.$notify.error({
            title: "Error",
            message: "Registration failed, please try again later",
          });
          return;
        });
    },
    init() {
      var elements = stripe.elements();
      let style = {
        base: {
          "::placeholder": {
            color: "#aab7c4",
          },
        },
      };
      // Create an instance of the card Element.
      this.card = elements.create("card", {
        hidePostalCode: true,
        style: style,
      });

      // Add an instance of the card Element into the `card-element` <div>.
      this.card.mount("#card-element");

      // Handle real-time validation errors from the card Element.
      this.card.addEventListener("change", function (event) {
        var displayError = document.getElementById("card-errors");
        displayError.textContent = event.error ? event.error.message : "";
      });
    },
    getProductPlans() {
      PaymentService.getPrices({ product_code: "QNA" })
        .then((response) => {
          this.product_plans = response.prices;
          this.price_id = response.default_selected.id;
          this.plan_details = response.default_selected.metadata;
          this.trial_period =
            response.default_selected.recurring.trial_period_days;
        })
        .catch((error) => {
          console.log("error occured while getting product plans");
          return;
        });
    },
    login() {
      window.location.replace("/app");
    },
  },
  mounted() {
    this.init();
  },
  beforeMount() {
    this.getProductPlans();
  },
};
</script>


<style lang="scss">
// *********************************************************************************************************************************************************************

@import "../../assets/scss/_variables";

// KP Banner start
.submenu-item {
  font-size: 16px;
  border: 0;
  color: #005da6 !important;
  border-top: 1px solid #e9ecef;
}
.el-menu-item a {
  text-decoration: none;
}
.kp-el-menu {
  .kp-logo {
    float: left;
    height: 60px;
    line-height: 60px;
    margin: 0;
    width: 190px;
  }

  .solution-submenu {
    float: right;
    .el-submenu__title {
      font-size: 16px;
      border: 0;
      font-weight: bold;
      color: #005da6 !important;
      border-top: 1px solid #e9ecef;
    }
  }

  .el-menu--popup {
    border-radius: 5px;
    -webkit-box-shadow: 0 12px 32px 0 rgba(0, 0, 0, 0.17);
    box-shadow: 0 12px 32px 0 rgba(0, 0, 0, 0.17);
    background-color: #ffffff;
  }
}
.el-menu-item.kp-nav-item.is-active {
  border-bottom: none;
}
.el-menu--horizontal > .el-menu-item {
  float: right;
}

.kp-nav-item {
  font-size: 16px;
  color: #005da6 !important;
  font-weight: bold;
}

.kp-header .el-header {
  background: #ffffff;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  -webkit-box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  padding-left: 0;
  padding-right: 0;
}

.kp-email-confirmation-alert {
  background: #150035;
  color: #ffffff;
  display: none;
  h2 {
    text-align: center;
    font-size: 14px;
    font-weight: normal;
    span {
      font-weight: bold;
    }
  }
}

.el-row .kp-banner {
  background: url("../../assets/images/QnA-Banner.png");
  background-repeat: no-repeat;
  background-size: cover;
  margin-top: 0 !important;
  height: 220px;

  .kp-banner-text {
    margin-top: 42px;
    h2 {
      font-size: 38px;
      margin-bottom: 10px;
      margin-top: 51px;
      letter-spacing: -1px;
      color: #150035;
    }
    span {
      font-size: 20px;
      color: #ffffff;
    }
  }
}

.kp-register-main-content,
.kp-payment-main-content {
  margin-top: 42px;
  margin-bottom: 32px;

  img {
    margin-top: 64px;
    width: 80%;
    height: auto;
  }

  .register-form-page-header {
    font-weight: bold;
    font-size: 28px;
    color: #005da6;
    margin-bottom: 12px;
  }

  .el-form {
    label {
      font-weight: bold;
      color: #2699fb;
    }
    .el-form-item {
      margin-bottom: 10px;
      .vue-tel-input:focus-within {
        box-shadow: none;
        border-color: #5f8fdf;
      }
    }
    .vue-tel-input {
      height: 40px;
      border: 1px solid #dcdfe6;
    }
    .el-select {
      width: 100%;
    }

    .el-button {
      width: 100%;
      margin-top: 12px;
      font-weight: bold;
      background: #150035;
      &:hover {
        background: #2699fb;
      }
    }
  }
}

.kp-payment-main-content {
  .plans {
    .plan-radio {
      float: right;
    }
    .plan-title {
      color: #1975d3;
      font-size: 17.5px;
      font-weight: bold;
      text-transform: capitalize;
      margin-bottom: 6px;
    }
    .plan {
      cursor: pointer;
      background: #1b4877;
      border-radius: 8px;
      margin-right: 12px;
      margin-bottom: 12px;
      &:hover {
        background: #2664a5;
      }

      .plan-card {
        background: transparent;
        margin: 10%;
        color: white;
        margin-right: 32px;
        &:hover {
          // background: #2664a5;
        }

        .plan-card-label1 {
          text-transform: capitalize;
          font-weight: bold;
          font-size: 16px;
        }
        .plan-card-label2 {
          text-transform: capitalize;
          font-size: 14px;
        }
      }
    }
  }

  .plan-details {
    background: transparent;
    border: 1px solid #bce0fd;
    padding: 16px;
    color: #1b4877;
    width: 74%;
    box-shadow: none;
    line-height: 32px;
    .plan-details-title {
      font-weight: bold;
      font-size: 32px;
      margin-bottom: 20px;
    }
  }
  .el-radio-group {
    display: block;
    line-height: inherit;
    vertical-align: unset;
    font-size: inherit;
  }

  .el-radio__input.is-checked .el-radio__inner {
    border-color: #f7ba2a;
    border-width: 0px;
    background: #f7ba2a;
  }
}

.kp-charge-message {
  border: 1px solid #1975d3;
  font-size: 14px;
  color: #150035;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.credit-card-title {
  color: #1975d3;
  font-size: 20px;
  font-weight: bold;
  text-transform: capitalize;
  margin-bottom: 30px;
}

#payment-form {
  label {
    font-weight: bold;
    color: #2699fb;
    font-size: 14px;
    line-height: 40px;
  }
}

// Stripe Classes
#card-errors {
  color: #f82533;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: 100%;
  left: 0;
}

#card-element {
  background: white;
  border: 1px solid #dcdfe6;
  padding: 11px 15px;
  border-radius: 4px;
}

.__PrivateStripeElement {
  margin: 8px !important;
}

.credit-card-error-row {
  margin-bottom: 32px;
}

// Success Section

.success-block {
  .kp-success-icon {
    position: absolute;
    width: 42px;
    height: auto;
    left: 47%;
    top: -30px;
    border: 1px solid #bfddfc;
    padding: 12px;
    border-radius: 100px;
    background: white;
  }

  position: relative;
  border: 1px solid #bfddfc;
  padding: 60px 22px 22px 22px;
  border-radius: 7px;
  text-align: center;
  color: #0c76e5;
  margin-top: 158px;

  .kp-success-heading {
    font-size: 40px;
    margin-bottom: 22px;
    margin-top: 132px;
    font-weight: bold;
  }

  .success-message {
    font-size: 20px;
  }

  .kp-login-button {
    margin: 0 auto;
    display: block;
    margin-top: 60px;
    width: 300px;
    margin-bottom: 60px;
  }
}

.el-loading-mask {
  line-height: 2.3;
}

// Helper

.section1 {
  // display: none;
}
.section2 {
  display: none;
}
.section3 {
  display: none;
  text-align: center;
}

.email_confirmation_alert {
  display: none;
}

.el-radio__label {
  display: none;
}

// Loading
.el-loading-spinner i {
  color: white;
}
.el-loading-spinner .el-loading-text {
  color: white;
}
</style>
