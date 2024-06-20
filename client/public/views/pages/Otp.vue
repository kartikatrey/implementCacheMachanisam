<template>
    <div class="otp-wrapper" v-loading="loading">
        <div v-if="isValid" class="otp-verification">
            <div class="confirmation-buttons">
                <h1 class="heading-large approve-confirmation">OTP Verification</h1>
                <p class="otp-description-text">Please enter the 4-digit OTP sent to your email.</p>
                <OtpInput :inputs="4" @passcode="onChangePasscode($event)" ref="otpInputRef" />
                <h3 v-if="message.length" class="error-message">{{ message }}</h3>
                <el-button :disabled="isProceedEnabled" size="medium" type="primary" @click="verifyOTP()">Proceed</el-button>
                <p class="otp-description-text-resend">Didn't receive the OTP?</p>
                <div class="resend">
                    <a class="resend-link" @click="resendOTP()">Resend OTP</a>
                </div>
            </div>
        </div>
        <div v-if="invalid" class="invalid">
            <div class="content">
                <h1>{{ message }}</h1>
                <span class="align-center">You can close the browser.</span>
            </div>
        </div>
    </div>
</template>
  
<script>
import RequestFormService from "../../../app/services/requestFormService";
import OtpInput from "./authentication/OtpInput";
import UserService from "../../../app/services/UserService";
import _ from "lodash";

/* 
    Purpose : to verify form with otp functionality
    Step 1 : We get token ( Request_id ) and cid ( customer_id ) from URL 
    Step 2 : Validate that url and send otp to user
    Step 3 : Verify OTP
*/
export default {
    name: "Otp",
    data() {
        return {
            loading: false,
            token: "",
            cid : "",
            isValid : false,
            message: "",
            invalid: false,
            passcode: "",
            isProceedEnabled : true
        };
    },
    components: {
        OtpInput
    },
    async beforeMount() {
        await this.init();
    },
    methods: {
        async init () {
            this.loading = true;
            // Step 1 : We get token ( Request_id ) and cid ( customer_id ) from URL 
            let url = new URL(window.location.href);
            const token = url.searchParams.get("token");
            const cid = url.searchParams.get("cid");
            
            if (!token || !cid) {
                this.message = "Invalid request";
                this.invalid = true;
                return;
            }
            this.cid = cid;
            this.token = token;
            let data = {
                token: this.token,
                cid : this.cid
            }
            
            // Step 2 : Validate that url and send otp to user
            try {
                const validateReqResponse = await RequestFormService.validateUrlAndSendOTP(data)
                if (validateReqResponse && validateReqResponse.status) {
                    this.isProceedEnabled = false;
                    this.isValid = true;
                } else {
                    this.invalid = true;
                    this.isValid = false;
                    this.message = "The request is no longer valid or expired.";
                }
            } catch(err) {
                this.notifyError("Error while validating URL");
            };
            this.loading = false;
        },
        // Step 3 : Verify OTP
        async verifyOTP() {
            this.loading = true;
            try {
                const data = {
                    token: this.token,
                    cid: this.cid,
                    otp: this.passcode
                }
                const response = await RequestFormService.validateOTP(data)
                const { success, message } = response;
    
                if(!success && message) {
                    this.message = message
                } else if (!success) {
                    this.message = message || "Something went wrong, please try again later"
                    this.isValid = false;
                } else {
                    /* routeUserAfterLogin is using window.location.search => gives all params from the URL
                       So we're appending rURL into current URL 
                    */
                    const url = new URL(window.location.href);
                    url.searchParams.append("rURL", response.rURL);
                    window.history.replaceState({}, "", url.href);
                    UserService.routeUserAfterLogin(response.user);
                }
                this.loading = false;
            }
            catch(err) {
                this.notifyError("Error while validating OTP");
                this.loading = false;
            };
        },
        async resendOTP(){
            this.message = "";
            this.$refs.otpInputRef.clearInput();
            await this.init();
            this.notifySuccess("OTP sent successfully");
        },
        onChangePasscode(value) {
            this.passcode = value;
        },

    }
};
</script>
  
<style lang="scss">
@import "../../assets/scss/_variables";
@import "../../assets/scss/_mixins";

.heading-large approve-confirmation {
    font-size: 3rem;
}

.otp-description-text{
    font-weight: 500;
    font-size: 1.333rem;
}

.otp-description-text-resend{
    font-weight: 500;
    font-size: 1.333rem;
    margin-bottom: 0;
}

.otp-wrapper {
  display: flex;
  justify-content: center;
  align-items: baseline !important;
  height: 100vh;
}

.otp-verification {
  margin: 20px;
  padding: 20px;
  text-align: center;

    .otp{
        display:flex;
        justify-content: center;

        > div[is-input-num="true"] {
            gap: 0.5rem;
        }

        .otp-input{
            width: 3rem;
        }
    }
}

.otp-input {
  margin: 20px auto;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.resend {
  margin-top: 10px;
}

.invalid {
  margin: 20px;
}

.align-center {
  text-align: center;
}

</style>
  
  