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
            <p class="title"  v-if="!showEmailAndPassword">Sign in</p>

            <div class="form-input-section" v-if="!showEmailAndPassword">
              <el-form-item class="input-label" label="" prop="customer_code">
                <el-input
                  class="input-area"
                  placeholder="Customer Code"
                  v-model.trim="form.customerCode"
                  @keyup.enter.native="validateCustomerCode"
                ></el-input>
              </el-form-item>
            </div>

             <!-- after verify customer code -->
             <div v-if="showEmailAndPassword" class="verify-username">
              <div class="verify-email"> 
                <p class="username">
                  <el-button icon="mdi mdi-arrow-left-circle-outline" v-on:click="onBack"></el-button>
                  <span> {{ form.customerCode }} </span>
                </p>
              </div>
                <p class="title">Enter Email</p>
            </div>

            <div
              tabIndex="-1"
              v-if="isError"
              ref="errDiv"
              class="form-validation"
            >
              {{ errMessage }}
            </div>

            <div class="form-input-section"  v-if="showEmailAndPassword">
              <el-form-item class="input-label" label="" prop="email">
                <el-input
                  class="input-area input-pwd"
                  placeholder="Email address"
                  type="email"
                  v-model.trim="form.email"
                ></el-input>
              </el-form-item>
            </div>        

            <div class="form-input-section">
              <el-form-item
              v-if="showEmailAndPassword"
              class="input-label"
              label=""
              prop="password"
              >
                <p class="title">Enter Password</p>
                <el-input
                  class="input-area"
                  placeholder="Password"
                  :type="passwordInputType"
                  v-model="form.password"
                >
                </el-input>
                <el-button v-if="!visiblePassword" class="icon-eye" v-on:click="showPass()" icon="mdi mdi-eye-outline"></el-button>
                <el-button v-if="visiblePassword" class="icon-eye" v-on:click="showPass()" icon="mdi mdi-eye-off-outline"></el-button>
              </el-form-item>
              <div style="text-align: right">
                <router-link
                  to="/vendor/forgot-password"
                  class="forgot-password"
                  tabindex="-1"
                  v-if="showEmailAndPassword"
                  >Forgot Password?</router-link
                >
              </div>
            </div>
            <div class="form-input-section">
             <captcha ref="captcha" v-if="showEmailAndPassword" v-on:captchaExpired="()=>{captchaKey = false}" v-on:captchaResponse="getCaptchaResponse($event)"/>
              <div
              tabIndex="-1"
              v-if="showCaptchaErr"
              ref="errDiv"
              class="form-validation captcha-err"
            >
              Please confirm you are not a robot.
            </div>
            </div>
            <div class="form-input-section no-m">
              <el-button
                v-if="showEmailAndPassword"
                :disabled="loginDisable"
                class="form-button-long login-btn"
                type="primary"
                @click="login"
                >Log In</el-button
              >
              <el-button
                v-if="!showEmailAndPassword"
                type="primary"
                @click="validateCustomerCode"
                :disabled="disableContinue"
                >Continue</el-button
              >
            </div>
          </div>
          <!-- | login -->
        </div>
        <!-- | login body -->
      </el-form>
    
    </div>
  </el-container>
</template>

<script>
import AjaxService from "../../../services/AjaxService";
import UserService from "@/services/UserService";
import IDPUserService from "@/idp/services/UserService";
import CustomerService from "@/idp/services/CustomerService";
import captcha from "../../../components/Captcha.vue";
import Constants from "@/resources/Constants";

export default {
  name: "Login",
  data() {
    return {
      form: {
        customerCode: "",
        email: "",
        password: "",
        customer_id: "",
      },
      loginDisable:false,
      passwordInputType:'password',
      isError: false,
      showEmailAndPassword: false,
      visiblePassword:false,
      captchaKey:null,
      showCaptchaErr: false,
      disableContinue:false,
      captchaResponse:'',
      isCaptchaValid : false,
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
      }
    };
  },
  components: {
       captcha
  },
  methods: {
    getCaptchaResponse(response) {
          this.captchaKey = response;
          this.showCaptchaErr = false;  
          this.isCaptchaValid = true;
    },

    onBack(){
      this.showEmailAndPassword = false;
      this.form.password = '';
      this.passwordInputType = 'password';
      this.visiblePassword = false;
      this.showCaptchaErr = false;
      this.captchaKey = null

    },
    showPass(){
      this.visiblePassword = !this.visiblePassword;
      this.visiblePassword ? this.passwordInputType = 'text':this.passwordInputType = 'password';
    },
    async login() {
      this.loginDisable = true;
      const captchaDisableEnvs = Constants.CAPTCHA_DISABLED_ENVS;
      const serverEnv = Constants.SERVER_ENV;
      if(!captchaDisableEnvs.includes(serverEnv.toUpperCase()) && !this.captchaKey){
        this.showCaptchaErr = true;
        this.loginDisable = false;
        return;
      }
      this.showCaptchaErr = false
      this.$refs.form.validate(async (valid) => {
        if (!valid) {// return if not valid form
          this.loginDisable = false;
          return;
        }
        let userData = {
          customer_code: this.form.customerCode, //jadeglobal.com
          email: this.form.email, //hrishi@jade.com',
          password: this.form.password, // 'Admin@123',
          customer_id: this.form.customer_id,
          captcha_key: this.captchaKey
        };
        try {
          const { user } = await IDPUserService.loginWithLocalStrategy(userData);
          UserService.routeUserAfterLogin(user);
        } catch (err) {
          this.loginDisable = false;
          this.showError(_.get(err, 'response.data.error.message') || 'Oops! Invalid credential');
          this.resetRecaptcha();
        }
      });
    },

    resetRecaptcha() {
          this.$refs.captcha.resetRecaptcha();
          this.captchaKey = null;
    },

    async validateCustomerCode() {
      this.disableContinue = true;
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          this.disableContinue = false;
          return;
        }
        let data = { customer_code: this.form.customerCode };
        const validationRes = await CustomerService.validateCustomerCode(data);
        if(!validationRes || !validationRes.data.status){
          this.showError("Invalid customer code provided.");
          this.disableContinue = false;
          return;
        }
        this.form.customer_id = validationRes.data._id;
        this.showEmailAndPassword = true;
        this.disableContinue = false;
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
    });
  },
};
</script>

<style lang="scss">
@import "../../../../app/idp/_idpGlobal";
@import "../../../../app/idp/_idpVariables";

 .captcha-err{
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
    border: 1px solid var( --dark-07-1);
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
      background-color: var( --dark-07-1) !important;
    }
    .el-input__inner {
      height: 38px;
      border: 0 !important;
      border-radius: 0;
      background-color: var( --dark-07-1) !important;
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
        top:0;
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
  .forgot-password {
    font-size: var(--font-base);
    color: var(--brand-04);
    display: inline;
    text-align: right;
    text-decoration: none;
    font-weight: 350;
    line-height: 1.8rem;
    outline: none;
    padding-right: 1rem;
    border: 0;
      &:hover {
        text-decoration: underline;
      }
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
</style>