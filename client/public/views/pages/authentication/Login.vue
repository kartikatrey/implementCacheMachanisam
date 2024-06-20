<template>
  <el-container class="login-page">
    <div class="login-form-container">
      <div class="kanverse-branding">
        <span class="red">&nbsp;</span>
        <span class="green">&nbsp;</span>
        <span class="blue">&nbsp;</span>
      </div>

      <el-form :model="form" ref="form" :rules="formRules" label-position="top" @submit.native.prevent>
        <div class="logo">
          <img src="../../../assets/images/logo-ai.svg" />
          <span>Hyperautomation for Enterprises</span>
        </div>

        <div class="login-body">

          <div class="login">
            <p class="title" v-if="!showPassword && !showMfaScreen">Sign in</p>

            <div tabIndex="-1" v-if="isError" ref="errDiv" class="form-validation">
              {{ errMessage }}
            </div>

            <div class="form-input-section" v-if="!showPassword && !showMfaScreen">
              <el-form-item class="input-label" label="" prop="email">
                <el-input class="input-area input-pwd" placeholder="Email address" type="email" v-model.trim="form.email"
                  @keyup.enter.native="loginNext"></el-input>
              </el-form-item>
            </div>

            <!-- Continue button sign in -->
            <div class="button-div">
              <el-button v-if="!showPassword && !showMfaScreen" type="primary" @click="loginNext"
                :disabled="disableContinue">Continue</el-button>
              <router-link v-if="!showPassword && !showMfaScreen" to="/vendor/login"
                class="navigation-link vendor-user-link" tabindex="-1">Login as vendor</router-link>
            </div>

            <!-- Password -->
            <div v-if="showPassword">
              <div v-if="showPassword" class="verify-username">
                <div class="verify-email">
                  <p class="username">
                    <el-button icon="mdi mdi-arrow-left-circle-outline" v-on:click="onBack"></el-button>
                    <span> {{ form.email }} </span>
                  </p>
                </div>
                <p class="title">Enter Password</p>
              </div>
              <div class="form-input-section">
                <el-form-item v-if="showPassword" class="input-label" label="" prop="password">
                  <el-input class="input-area" placeholder="Password" :type="passwordInputType" v-model="form.password">
                  </el-input>
                  <el-button v-if="!visiblePassword" class="icon-eye" v-on:click="showPass()"
                    icon="mdi mdi-eye-outline"></el-button>
                  <el-button v-if="visiblePassword" class="icon-eye" v-on:click="showPass()"
                    icon="mdi mdi-eye-off-outline"></el-button>
                </el-form-item>
                <div style="text-align: right">
                  <router-link to="forgot-password" class="navigation-link" tabindex="-1" v-if="showPassword">Forgot
                    password?</router-link>
                </div>
              </div>
              <div class="form-input-section">
                <captcha ref="captcha" v-if="showPassword" v-on:captchaExpired="() => { captchaKey = false }"
                  v-on:captchaResponse="getCaptchaResponse($event)" />
                <div tabIndex="-1" v-if="showCaptchaErr" ref="errDiv" class="form-validation captcha-err">
                  Please confirm you are not a robot.
                </div>
              </div>
              <div class="form-input-section no-m">
                <el-button v-if="showPassword" :disabled="loginDisable" class="form-button-long login-btn" type="primary"
                  @click="login">Log In</el-button>
              </div>
            </div>

            <!-- OTP -->
            <div v-if="showMfaScreen && !showPassword">
              <div v-if="showMfaScreen" class="verify-username">
                <div class="verify-email">
                  <p class="username">
                    <el-button icon="mdi mdi-arrow-left-circle-outline" v-on:click="onBack"></el-button>
                    <span> {{ form.email }} </span>
                  </p>
                </div>
                <p class="title">Identity Verification</p>
                <p class="info-text">Please choose your preferred authentication method:</p>
              </div>
              <div>
                <el-select :disabled="showMfaDropDown" v-model="authentication_method" @change="handleAuthenticationMethodChange" placeholder="Select"
                  style="background-color: #ffffff" class="authentication_placeholder">
                  <el-option class="authentication-dropdown" v-for="item in authentication_methods" :key="item.value"
                    :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>

              <div v-if="showEmailMfa" class="email-option">
                <p class=" email-info-text">We will send you a One Time Password on your mail.</p>
                <el-button :disabled="otpSubmitDisable" class="form-button-long send-otp-btn" type="primary"
                  @click="sendEmailOTP">Send OTP</el-button>
              </div>
              <!-- otp-input -->
              <div v-if="showEmailOtpScreen" class="email-option">
                <p class="email-info-text">{{ emailOtpMsg }}</p>
                <div class="form-input-section">
                  <OtpInput :inputs="6" @passcode="onChangePasscode($event)" />
                </div>

                <div class="form-input-section no-m">
                  <el-button :disabled="otpSubmitDisable" class="form-button-long login-btn" type="primary"
                    @click="verifyOtp">Submit</el-button>
                  <div>
                    <p class="form-validation">{{ otpErrMessage }}</p>
                    <a :class="{ 'disable-link': disableOtpLink }" class="link-resend" @click="resendOTP">Resend OTP</a>
                  </div>
                </div>
              </div>

              <div v-if="showAuthenticatorMfa" class="authenticator-option">
                <div>
                  <img :src="authenticatorQrCodeUrl" class="qr-code-container">
                </div>
                <p v-if="authenticatorQrCodeMsg" class=" email-info-text">Scan the QR code in Authenticator app & then
                  enter the code
                  below.</p>
                <p v-if="!authenticatorQrCodeMsg" class=" email-info-text">Enter the code from Authenticator app</p>
                <div class="form-input-section">
                  <OtpInput :inputs="6" @passcode="onChangePasscode($event)" />
                </div>
                <p class="form-validation">{{ authErrMessage }}</p>

                <div class="form-input-section no-m">
                  <el-button :disabled="otpSubmitDisable" class="form-button-long login-btn" type="primary"
                    @click="validateAuthenticatorMFACode">Submit</el-button>
                </div>
              </div>
            </div>
            <!-- | login -->
          </div>
        </div>
        <!-- | login body -->
      </el-form>

    </div>
  </el-container>
</template>


<script>

import AjaxService from "../../../services/AjaxService";
import UserService from "@/services/UserService";
import IdpUserService from "@/idp/services/UserService";
import captcha from "../../../components/Captcha.vue";
import Constants from "@/resources/Constants";
import OtpInput from "./OtpInput.vue";
import moment from 'moment-timezone'


export default {
  name: "Login",
  data() {
    return {
      form: {

        email: "",
        password: "",
        customer_id: "",
        otp: ""
      },
      loginDisable: false,
      otpSubmitDisable: false,
      passwordInputType: 'password',
      isError: false,
      showPassword: false,
      visiblePassword: false,
      captchaKey: null,
      showCaptchaErr: false,
      disableContinue: false,
      captchaResponse: '',
      otpErrMessage: null,
      emailOTPmsg: null,
      authErrMessage: null,
      showMfaScreen: false,
      showEmailMfa: true,
      showEmailOtpScreen: false,
      showAuthenticatorMfa: false,
      disableOtpLink: false,
      passcode: '',
      showMfaDropDown:false,
      authenticatorQrCodeUrl: null,
      authenticatorQrCodeMsg: false,
      isCaptchaValid: false,
      isCaptchaDisable: false,
      formRules: {
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
        password: [
          {
            required: false,
            message: "Please enter password",
            trigger: "blur",
          },
        ],

      },
      authentication_method: 'email',
      authentication_methods: [

        {
          label: "Email",
          value: "email"
        }, {
          label: "Authenticator App",
          value: "authenticator"

        },
      ]
    };
  },
  components: {
    captcha,
    OtpInput
  },
  methods: {

    // Function to handle changes in the selected authentication method
    handleAuthenticationMethodChange(value) {
      // On change of authentication method set auth and otp error message as null  
      this.authErrMessage = null;
      this.otpErrMessage = null;
      // Update the selected authentication method
      this.authentication_method = value;
      
      // If the selected method is 'email', show the email Multi-Factor Authentication (MFA) screen
      if (value === 'email') {
        this.showEmailMfa = true;
        this.showAuthenticatorMfa = false; // Hide the authenticator MFA screen
      } else if (value === 'authenticator') {
        // If the selected method is 'authenticator', hide the email MFA screen and any email One-Time Password (OTP) screens
        this.showEmailMfa = false;
        this.showEmailOtpScreen = false;
        // Call the 'handleAuthenticator()' function to perform additional actions related to the authenticator MFA
        this.handleAuthenticator();
      }
    }
    ,
    getCaptchaResponse(response) {
      this.captchaKey = response;
      this.showCaptchaErr = false;
      // this.isCaptchaValid = true;
    },

    onBack() {
      this.showPassword = false;
      this.form.password = '';
      this.passwordInputType = 'password';
      this.visiblePassword = false;
      this.showCaptchaErr = false;
      this.captchaKey = null
      this.showMfaScreen = false

    },
    onChangePasscode(value) {
      this.form.otp = value;
    },
    showPass() {
      this.visiblePassword = !this.visiblePassword;
      this.visiblePassword ? this.passwordInputType = 'text' : this.passwordInputType = 'password';
    },
    login() {
      this.loginDisable = true;
      this.$refs.form.validate(async (valid) => {
        if (!valid) {// return if not valid form
          this.loginDisable = false;
          return;
        }
        let userData = {
          email: this.form.email,
          password: this.form.password,
          customer_id: this.form.customer_id,
          captcha_key: this.captchaKey
        };
        try {
          const response = await IdpUserService.loginWithLocalStrategy(userData);

          if (_.get(response, 'is_mfa_enabled')) {
            let qrUrl = _.get(response, 'qrUrl')
            this.displayMfaFields(qrUrl)
            return
          }
          let user = _.get(response, 'user');
          UserService.routeUserAfterLogin(user);
        }
        catch (err) {
          console.log(err)
          this.showError(_.get(err, 'response.data.error.message') || 'Oops! Invalid credential');
          this.resetRecaptcha();
          this.loginDisable = false;
        }
      });

    },

    displayMfaFields(qrUrl) {
      this.showPassword = false
      this.showMfaScreen = true
      this.authenticatorQrCodeUrl = qrUrl
    },
    resetRecaptcha() {
      this.$refs.captcha.resetRecaptcha();
      this.captchaKey = null;
    },
    // showMfaDropDown:true variable allows user to not select any value from dropdown while we resent otp
    async resendOTP() {
      // Disable the link/button to prevent multiple requests
      this.disableOtpLink = true;
      this.otpSubmitDisable = true;

      try {
        this.showMfaDropDown = true
        this.otpErrMessage = null
        // Send a request to the server to resend OTP
        const response = await IdpUserService.sendEmailOtp({ "action": "resend-otp" });

        if (!response.success) {
          // Handle the case of a failed OTP resend
          this.emailOtpMsg = "Error while resending OTP. Please try again later.";
        } else {
          // Display success message and re-enable the link/button after 15 seconds
          this.emailMsg = false
          this.emailOtpMsg = response.message;

          setTimeout(() => {
            this.disableOtpLink = false;
          }, 15000);
          this.showMfaDropDown = false
          this.otpSubmitDisable = false;
        }
      } catch (error) {
        // Handle any errors that occur during the OTP resend request
        console.error("Error while resending OTP:", error);
        this.emailOtpMsg = "Error while resending OTP. Please try again later.";
        this.showMfaDropDown = false
        this.otpSubmitDisable = false;

      }

      // Re-enable the link/button
      this.disableOtpLink = false;
    }
    ,
    // Function to send email OTP
    // showMfaDropDown:true variable allows user to not select any value from dropdown while email is being send
    async sendEmailOTP() {
      this.showMfaDropDown = true
      this.otpSubmitDisable = true; // Disable the OTP submit button
      try {
        const emailResponse = await IdpUserService.sendEmailOtp(); // Send OTP via email
        this.otpSubmitDisable = false; // Enable the OTP submit button

        if (!emailResponse.success) {
          return; // If sending OTP fails, return
        }

        // OTP sent successfully
        this.showEmailMfa = false; // Hide the email MFA screen
        this.showEmailOtpScreen = true; // Show the email OTP screen
        this.emailOtpMsg = `An One-Time-Password has been sent to ${this.form.email}. Please enter the code below.`; // Set the OTP message
        this.showMfaDropDown = false
      } catch (error) {
        this.otpSubmitDisable = false; // Enable the OTP submit button
        console.error("Error while sending OTP:", error); // Log the error while sending OTP
        this.showMfaDropDown = false
      }
    }
    ,
    // Function to handle authenticator MFA
    async handleAuthenticator() {
      if (this.authenticatorQrCodeUrl) {
        // If the QR code URL for the authenticator is available,
        // set the 'authenticatorQrCodeMsg' flag to true.
        this.authenticatorQrCodeMsg = true;
      }
      // Set the 'showAuthenticatorMfa' flag to true,
      // indicating that the Authenticator MFA option should be displayed.
      this.showAuthenticatorMfa = true;
    },
    // Function to validate the Authenticator MFA code
    //showMfaDropDown:true variable allows user to not select any value from dropdown while we validate authenticator code
    async validateAuthenticatorMFACode() {
      // Disable the OTP submission button
      this.otpSubmitDisable = true;
      this.showMfaDropDown = true

      // Call the backend API to validate the Authenticator MFA code
      let response = await await IdpUserService.validateAuthenticatorMFACode({ "action": "validate-authenticator", "otp": this.form.otp });

      if (response.statusCode != 200) {
        // Handle the case of a failed OTP validation
        this.authErrMessage = response.message || "Invalid or expired OTP. Please try again or enter a new OTP.";
        this.otpSubmitDisable = false;
        this.showMfaDropDown = false
        return;
      }

      // If the OTP validation is successful, retrieve the user data from the response
      let user = response.data.user;

      // Route the user to the appropriate page after login
      UserService.routeUserAfterLogin(user);
    },
    // Function to verify the OTP
    async verifyOtp() {
      // Clear any previous error message
      this.emailOtpMsg = null;
      this.otpSubmitDisable = true;
      this.showMfaDropDown = true

      try {
        // Send a request to the server to validate the OTP
        const response = await IdpUserService.validateEmailOtp({ action: "validate-email", otp: this.form.otp });

        if (response.statusCode != 200) {
          // Handle the case of a failed OTP validation
          this.otpErrMessage = response.message;
          this.otpSubmitDisable = false;
          this.showMfaDropDown = false
          return;
        }
        // Perform the necessary actions after successful OTP verification
        let user = response.data.user;
        UserService.routeUserAfterLogin(user);
      } catch (error) {
        // Handle any errors that occur during the OTP validation request
        console.error("Error while verifying OTP:", error);
        this.otpSubmitDisable = false;
        this.showMfaDropDown = false;
        // Perform error handling or show an appropriate error message to the user
      }
    }

    ,
    loginNext() {
      this.disableContinue = true;
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.disableContinue = false;
          return;
        }
        let userData = {
          email: this.form.email,
          time_zone: moment.tz.guess()
        };
        AjaxService.getJson("/auth/type", userData, "", (err, res={}) => {
          if(err || res.status === false){
            /*
              if res.status false, show user error message from res.message
              if api call failed/excepation show message from err.
              - res.message used for invalid credentials and network access policy which return by auth api.
            */ 
            const message = res.message || err.message
            this.showError(message);
            this.disableContinue = false;
            return;
          }
          if (res.auth_type == "SAML") {
            const urlParams = new URLSearchParams(window.location.search);
            const rURL = encodeURIComponent(urlParams.get("rURL"));
            //Added user email for passing to okta login
            window.location.href = "/sso/login/" + res._id + "?rURL=" + rURL+"&email="+userData.email;

          } else {
            this.form.customer_id = res._id;
            this.showPassword = true;
            this.disableContinue = false;
            this.isCaptchaDisable = res.is_captcha_disable;
          }
        });
      });
    },
    showError(message) {
      if (message) {
        this.isError = true;
        this.errMessage = message;
        setTimeout(() => {
          this.$refs.errDiv.scrollIntoView();
        }, 0);
      }
    }
  },
  mounted() {
    window.addEventListener("keyup", (event) => {
      this.isError = false;
      // if (event.keyCode === 13) {
      //   this.login();
      // }
    });
  },
};
</script>

<style lang="scss">
@import "../../../../app/idp/_idpGlobal";
@import "../../../../app/idp/_idpVariables";

.captcha-err {
  margin-top: 0px !important;
}

.main {
  width: 100%;
  height: 100%;
  background-position: bottom;
  background-size: cover;
  font-family: "Segoe UI", "Roboto", "Helvetica Neue", sans-serif;
}

.login-page {
  background: url("../../../assets/images/login-bg.jpg") no-repeat;
  // background-position: 25% 75%;
  background-position: 0% 100%;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  .kanverse-branding {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    span {
      width: 33.33%;
      height: 3px;
      margin: 0;
      display: inline-block;
      float: left;
    }

    span.red {
      background: #FE2712;
    }

    span.green {
      background: #0147FE;
    }

    span.blue {
      background: #66B032;
    }
  }

  .login-form-container {
    overflow: hidden;
    background: var(--white);
    border-radius: var(--radius-lg);
    padding: var(--space-xxxl) var(--space-xxl);
    border: 1px solid var(--dark-07-1);
    position: relative;
    width: 320px;
    border-top: 0;
  }

  .form-area {
    margin-top: 0;
  }

  .login-header {
    float: none;
    position: absolute;
    top: 0;
    right: 0;
    color: var(--white);

    p {
      margin-bottom: 0;
      font-size: var(--font-base);
      color: var(--white);
    }

    a {
      color: var(--white);
    }
  }
}

.logo {
  margin-bottom: var(--space-xl);

  img {
    height: 27px;
  }

  span {
    font-size: var(--font-base);
    color: #808080;
    display: block;
    font-weight: 350;
    padding-left: 2.2rem;
  }
}

.login-body {
  display: flex;

  .visual {
    padding-right: 4.5rem;
    flex: 1;

    img {
      height: 300px;
    }
  }

  .login {
    width: 100%;

    .form-validation {
      color: var(--red-03);
      font-size: var(--font-base);
      margin-top: var(--space-base);

    }

    .title {
      font-size: 1.35rem;
      color: #082341;
      margin: 0;
      font-weight: 500;
    }

    .is-success .el-input__inner {
      background-color: var(--dark-07-1) !important;
    }

    .el-input__inner {
      height: 38px;
      border: 0 !important;
      border-radius: 0;
      background-color: var(--dark-07-1) !important;
      color: var(--dark-02);
      border-radius: var(--radius-base);

      &::placeholder {
        color: #697A8C;
        opacity: 1;
      }
    }

    .icon-eye {
      position: absolute;
      right: 0;
      top: 0;
      text-decoration: none;
      color: var(--dark-02);
      font-weight: 350;
      color: #5D7084;
      font-size: var(--font-base);
      background: transparent;
      border: 0;
      opacity: .6;
    }


    .verify-username {
      .verify-email {
        margin-bottom: var(--space-base);

        .username {
          margin: 0;
          font-size: var(--font-base);

          span {
            color: #415366;
          }

          .el-button {
            font-size: 1.4rem;
            padding: 0 .3rem 0 0;
            vertical-align: text-top;
            color: #798898;
            border: 0;
            background: transparent;
          }
        }
      }

      .el-input__inner {
        background: transparent !important;
        padding: 0 !important;
        color: #415366 !important;
      }

      .el-input {
        width: 80% !important;
      }

      .el-button {
        border: 0;
        background: transparent;
      }
    }
  }

  .form-input-section {
    margin-bottom: var(--space-base);

    .otp {
      margin-left: 0;
    }

  }

  .el-form-item {
    margin-top: var(--space-sm);
    margin-bottom: 0;
  }

  .el-form-item__error {
    color: var(--red-05);
    font-size: var(--font-sm);
    padding-top: 0;
    position: unset;
    top: 100%;
    left: 0;
    text-align: left;
    line-height: 1.2rem;
  }

  .navigation-link {
    font-size: var(--font-base);
    color: var(--brand-04);
    display: inline;
    text-align: right;
    text-decoration: none !important;
    font-weight: 400;
    line-height: 1.8rem;
    outline: none;
    padding-right: 0rem;
    border: 0;

    &:hover {
      text-decoration: underline !important;
    }
  }

  .vendor-user-link {
    padding-top: 0.25rem;
  }

  .button-div {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
  }

  .login-btn {
    font-size: var(--font-sm);
    font-weight: 400;
  }
}

.help-Support {
  font-size: var(--font-xs);
  color: var(--white);
  text-decoration: underline;
  position: absolute;
  right: 0;
  bottom: -30px;
  background: transparent;
  border: 0;

  &:hover {
    background: transparent;
    color: var(--white);
    text-decoration: none;
  }
}

.info-text {
  font-size: 14px;
  font-weight: 500;
}

.email-info-text {
  font-size: 14px;
  font-weight: 500;
}

.resend-otp-link {
  font-size: 14px !important;
}

.otp-disclaimer {
  color: #A0AEC0;
  font-size: 14px;
  margin-top: 1rem;
}

.authentication-dropdown {
  // background-color: #ffffff !important;
  font-weight: 500 !important;
  border-color: #CBD5E0 !important;
  font-size: 0.875rem !important;
  font-family: "Segoe UI", "Roboto", "Helvetica Neue", sans-serif !important;
}

.authentication_placeholder {
  background-color: #ffffff !important;
  font-weight: 400 !important;
  border-color: #CBD5E0 !important;
  font-size: 1rem !important;
}

// .qr-code-container {
//   height: 1rem !important;
//   width: 1rem !important;
//   background-color: #D9D9D9;
// }

</style>