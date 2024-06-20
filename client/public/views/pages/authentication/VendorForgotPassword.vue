<template>
<div class="forgot-pwd">

    <div class="kanverse-branding">
        <span class="red">&nbsp;</span>
        <span class="green">&nbsp;</span>
        <span class="blue">&nbsp;</span>
    </div>

    <div class="logo">
        <img src="../../../assets/images/logo-ai.svg" />
        <span>Hyperautomation for Enterprises</span>
    </div>

    <span id="errorMessage" style="color:red;font-size:0.87rem;"></span>
    <div v-if="enableForm">
        <p class="title">Reset password</p>
        <el-form  :model="form" ref="form" label-position="top" @submit.prevent.native>
            <div class="form-input-section">
                <el-form-item label="" prop="customer_code" :rules="[ { required: true, message: 'Please enter customer code', trigger: 'blur' } ]">
                    <el-input class="input-area" placeholder="Customer code" type="text" id="customer_code" v-model.trim="form.customer_code"></el-input>
                </el-form-item>
            </div>
            <div class="form-input-section">
                <el-form-item label="" prop="email" :rules="[ { required: true, message: 'Please enter email', trigger: 'blur' } ]">
                    <el-input class="input-area" placeholder="Email address" type="email" id="email" v-model.trim="form.email"></el-input>
                </el-form-item>
            </div>
            <div style="margin-bottom:9px" class="form-input-section">
                <captcha ref="captcha" style="margin-botton:0px " v-on:captchaExpired="()=>{captchaKey = null}" v-on:captchaResponse="getCaptchaResponse($event)" />
                <span v-if="showCaptchaErr" class="captcha-err el-form-item__error" style="color:red">Please confirm you are not a robot.</span>
            </div>
            <div style="margin-top:2px" class="form-input-section">
                <el-button type="primary" v-loading="loading" @click="sendResetEmail" element-loading-spinner="el-icon-loading">Send reset link</el-button>
            </div>
        </el-form>
    </div>

    <div class="success" id="successMessage" hidden>
        <p class="title"> <i icon="mdi mdi-check-circle"></i> Email has been sent</p>
        <p class="success-label">Follow the directions in the email to reset your password!</p>
        <i icon="mdi mdi-eye-outline"></i>
        <el-button type="primary" @click="backToLogin()" element-loading-spinner="el-icon-loading">Back to login</el-button>
    </div>

</div>
</template>

<script>
import AjaxService from "../../../services/AjaxService";
import JQuery from "jquery";
let $ = JQuery;
import captcha from "../../../components/Captcha.vue";

export default {
    name: "ForgotPassword",
    data() {
        return {
            enableForm: true,
            loading: false,
            form: {
                customer_code: "",
                email: ""
            },
            showCaptchaErr:false,
            captchaKey:null
        };
    },
    components: {
        captcha
    },
    methods: {
        resetRecaptcha() {
          this.$refs.captcha.resetRecaptcha();
          this.captchaKey = null;
        },
        getCaptchaResponse(response) {
            this.captchaKey = response
            this.showCaptchaErr = false
        },
        sendResetEmail() {
            let errorMessage = document.getElementById("errorMessage");
            if(!this.captchaKey){
                 this.showCaptchaErr = true;   
                 return;
            }
            this.showCaptchaErr = false;  
            this.loading = true;
            $("#customer_code").keyup(function () {
                errorMessage.innerHTML = " ";
            });
            $("#email").keyup(function () {
                errorMessage.innerHTML = " ";
            });
            this.$refs.form.validate(valid => {
                if (!valid) {
                    this.loading = false;
                    return;
                }

                let userData = {
                    customer_code: this.form.customer_code,
                    user_email: this.form.email,
                    captcha_key: this.captchaKey
                };
                AjaxService.postJson("/portal/api/user-email", userData, {}, (err, res) => {
                    if (res.data.data.status) {                        
                        this.enableForm = false;
                        $(".success").attr("hidden", false);
                        $(".form-box").attr("hidden", true);

                    } else {
                        errorMessage.innerHTML = res.data.data.message;
                        $(".success").attr("hidden", true);
                        $(".form-box").attr("hidden", false);
                    }
                     this.resetRecaptcha();
                    this.loading = false;
                });

            });
        },
        backToLogin() {
            this.$router.push("/vendor/login");
        }
    }
};
</script>

<style lang="scss">
@import "../../../assets/scss/_variables";
@import "../../../../app/idp/_idpGlobal";

.captcha-err{
    position: unset !important;
}

.main {
    width: 100% !important;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: url("../../../assets/images/login-bg.jpg");
    background-position: bottom;
    background-size: cover;
   

}

.layout-container {
    background: transparent;

    .forgot-pwd {
        width: 418px;
        background: var(--white);
        border-radius: var(--radius-lg);
        padding: var(--space-xxxl) var(--space-xxl) !important;
        border: 1px solid var( --dark-07-1);
        flex: unset !important;
        -webkit-box-flex: unset !important;
        position: relative;
        overflow: hidden;
        border-top: 0 !important;

        .kanverse-branding {
            position: absolute;
            border-top: 0;
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

        .el-loading-spinner {
            margin-top: -18px !important;

            i {
                color: #4a4343;
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

        .title {
            font-size: 1.35rem;
            color: #082341;
            margin-bottom: var(--space-sm);
            font-weight: 500;
        }

        .form-button {
            width: 100%;
            font-weight: 500;
        }

        .el-input__inner {
            height: 38px;
            border: 0;
            border-radius: 0;
            background-color: var( --dark-07-1) !important;
            color: var(--dark-02);
            border-radius: var(--radius-base);

            &::placeholder {
                color: #697A8C;
                opacity: 1;
            }
        }

        .el-form-item {
            margin-bottom: 1rem;
        }

        a {
            font-size: 14px;
            color: $text-color-accent;
            text-decoration: none;
            font-weight: 500;
        }

        .image-logo {
            width: 80px;
            margin: 0px auto;
            margin-bottom: 50px;
            display: block;
        }

        .send-btn {
            width: 160px;
        }
    }

    //form-wrapper

}

.el-form-item__error {
    position: unset;
}

.forgot-password-page {
    margin-left: -30px;
    margin-right: -30px;

    .success-heading {
        font-size: $font-size-28;
        font-weight: 700;
        width: 100%;
        max-width: 420px;
        padding: 0px 0px 10px 0px;
        box-sizing: border-box;
        margin: 0px auto;
        margin-top: 20px;

        i {
            margin-right: 1rem;
        }
    }

    .success-label {
        margin: 0;
        font-weight: normal;
        display: block;

    }

    .success {
        width: 100%;
        max-width: 420px;
        padding: 30px;
        box-sizing: border-box;
        margin: 20px auto;
        margin-top: 20px;
        text-align: center;

        i {
            font-size: 1.9rem;
            vertical-align: text-top;
        }

        .el-button {
            margin-top: 1.8rem;
        }
    }

    // .form-button-long {
    //   text-transform: uppercase;
    //   width: 70%;
    //   font-weight: 700;
    //   height: 50px;
    //   background-color: #14a8df !important;
    //   box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
    //   border: 0;
    //   color: #fff;
    //   margin-top: 14px;
    //   border: none;
    //   border-radius: 4px;
    //   margin-top: 10px;
    // }
    // .form-input-section {
    //   .form-button {
    //     width: 100%;
    //   }
    // }
}

// @media (max-width: 768px) {
//   .layout-container .container .view.forgot-password-page {
//     margin-left: -5px;
//     margin-right: -5px;
//     max-width: calc(100% + 10px);
//   }
// }
</style>
