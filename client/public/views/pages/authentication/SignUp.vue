<template>
  <el-container class="login-page">
    <el-aside>
      <div class="signup-img"></div>
    </el-aside>
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="24">
            <div class="login-header">
              <p>Already have an account?</p>
              <router-link to="login">LOGIN</router-link>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="({span:14,offset:5})" :xl="({span:8,offset:7})">
            <el-form :model="form" :rules="formRules" ref="form" label-position="top">
              <div class="grid-content form-area">
                <h1 class="form-heading">Sign Up</h1>
                <span class="form-subtitle">Enter your details below</span>
                <div tabIndex=-1 v-if="isError" ref="errDiv" class="form-validation">{{ errMessage }}</div>
                <div class="form-input-section">
                  <el-form-item
                   class="input-label"
                    label="Name"
                    prop="name"
                  >
                    <el-input class="input-area" placeholder="Name" type="text" v-model="form.name"></el-input>
                  </el-form-item>
                </div>
                <div class="form-input-section">
                  <el-form-item
                    label="Email"
                    prop="email"
                    class="input-label"
                  >
                    <el-input
                      class="input-area"
                      placeholder="Email"
                      type="email"
                      v-model.trim="form.email"
                    ></el-input>
                  </el-form-item>
                </div>
                <div class="form-input-section">
                  <el-form-item
                    label="Contact"
                    class="input-label"
                    prop="contact"
                  >
                    <el-input
                      class="input-area"
                      placeholder="Contact Number"
                      type="number"
                      v-model="form.contact"
                      @keypress.native="isNumber($event)"
      
                    ></el-input>
                  </el-form-item>
                </div>
                <captcha v-on:captchaResponse="getCaptchaResponse($event)"/>
                <div class="form-input-section">
                  <element-alert></element-alert>
                  <el-button
                    class="form-button-long btn-dark"
                    v-bind:disabled="signupDisabled"
                    type="submit"
                    @click="signUp"
                  >SIGN UP</el-button>
                </div>
              </div>
            </el-form>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import captcha from "../../../components/Captcha.vue";
import AjaxService from "../../../services/AjaxService.js";

export default {
    name: "SignUp",
    data() {
        return {
            form: {
                name: "",
                email: "",
                contact: ""
            },
            formRules: {
                name: [{
                    required: true,
                    message: 'Please enter name',
                    trigger: 'blur'
                }],
                email: [{
                        required: true,
                        message: 'Please enter email',
                        trigger: 'blur'
                    },
                    {
                        type: 'email',
                        message: 'Please input correct email address',
                        trigger: ['blur', 'change']
                    }
                ],
                contact: [{
                    required: false,
                    message: 'Please enter contact number',
                    trigger: 'blur'
                }]
            },
            signupDisabled: true,
            isError: false,
            errMessage: ""
        };
    },
    components: {
        captcha
    },
    mounted() {
        window.addEventListener('keyup', (event) => {
            this.isError = false;
        });
    },
    methods: {
        getCaptchaResponse(response) {
            if (!response.success) {
                this.$notify.warning({
                    title: "Captcha Error",
                    message: response.responseDesc,
                    type: "Error"
                });
                return;
            }
            this.signupDisabled = false;
        },
        signUp() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    let userData = {
                        full_name: this.form.name,
                        email: this.form.email,
                        contact: this.form.contact

                    };
                    AjaxService.postJson(
                        "/portal/api/customer-registration",
                        userData,
                        (err, response) => {
                            if (!response.data.data.status) {
                                this.showError(response.data.data.message);
                                return;
                            }
                            this.$router.push({
                                name: "register",
                                params: {
                                    email: userData.email
                                }
                            });
                        }
                    );
                }
            });
        },

        showError(message) {
            if (message) {
                this.isError = true;
                this.errMessage = message;
                setTimeout(() => {
                    this.$refs.errDiv.scrollIntoView();
                }, 0)

            }
        },

        isNumber: function(evt) {
            console.log("I am in  is Nymbetec chec" + evt)
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
                evt.preventDefault();;
            } else {
                return true;
            }
        }
    }
};
</script>

<style lang="scss">
@import "../../../assets/scss/_variables";

.layout-container {
  .container {
    .view,
    .main {
      padding-left: 0;
      padding-right: 0;
      padding-bottom: 0;
    }
    .main {
      padding-top: 0;
    }
  }
}

input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
}

input[type=number] {
  -moz-appearance: textfield;
}


// @media (min-width: 1320px) {
//   .login-page {
//     .form-area {
//       margin-top: 128px;
//     }
//   }
// }
</style>