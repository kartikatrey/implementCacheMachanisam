<template>
  <div>
    <div v-if="status == 'Approved' && !res_status" class="container" v-loading="loading">
      <div class="content" id="approvalConfirm" >
        <el-form :model="form" ref="approvalConfirm">
          <h1 class="approve-confirmation">
            <span><i class="fas fa-info"></i></span><br />
            Are you sure to approve the request?
          </h1>
          <div class="confirmation-buttons" >
            <el-form-item
              label=""
               prop="comment"
            >
            <el-input
              type="textarea"
              v-model="form.comment"
              autocomplete="off"
              autosize
            ></el-input>
            </el-form-item>
            <!-- Otp Input Boxes -->
            <OtpInput v-if="enable_approval_passcode" :inputs="6" @passcode="onChangePasscode($event)"/>
             <!-- Alert If Otp is Invalid  -->
            <h3 v-if="invalidOtp" style="color: red;">Invalid Otp</h3>
            <a v-if="enable_approval_passcode" class="resend" @click="resendOtp()">Resend Passcode</a>
            <br/>
            <button
              type="button"
              class="custom-button split-button"
              @click="updateApproval('approve')"
              >Approve</button>
            <!-- <button
              type="reset"
              class="custom-button split-button"
              onclick="window.close()"
            >
              Close
            </button> -->
          </div>
        </el-form>
      </div>
    </div>
    <div v-if="status == 'Approved' && res_status">
      <div class="content" id="approved">
        <h1 v-if="rejection">
          <span><i class="fas fa-exclamation-triangle"></i></span><br />
          {{ message }}
        </h1>
        <h1 v-else>
          <span><i class="fas fa-user-check"></i></span><br />
          Approved
        </h1>
       <span class="align-center">{{default_message}}</span>
        <!-- <button type="reset" onclick="window.close()" class="custom-button">
          Close
        </button> -->
      </div>
    </div>
    <div v-if="status == 'Rejected' && !res_status" class="container" v-loading="loading">
      <div class="content" id="rejectConfirm" >
        <el-form :model="form" ref="rejectConfirm">
          <h1 class="approve-confirmation">
            <span><i class="fas fa-times"></i></span><br />
            Rejection Notes
          </h1>

          <div class="confirmation-buttons">
            <el-form-item
              label=""
              prop="comment"
              :rules="[{ required: true, message: 'Rejection note is required' }]"
            >
              <el-input
                type="textarea"
                v-model="form.comment"
                autocomplete="off"
                autosize
              ></el-input>
            </el-form-item>
            <OtpInput v-if="enable_approval_passcode" :inputs="6" @passcode="onChangePasscode($event)"/>
             <!-- Alert If Otp is Invalid  -->
            <h3 v-if="invalidOtp" style="color: red;">Invalid Otp</h3>
            <a v-if="enable_approval_passcode" class="resend" @click="resendOtp()">Resend Passcode</a>
            <br/>
            <input
              type="button"
              value="Reject"
              class="custom-button split-button"
              @click="updateApproval('reject')"
            />
            <button
              class="custom-button split-button"
              onclick="window.close()"
              type="reset"
              value="Close"
            >
              Close
            </button>
          </div>
        </el-form>
      </div>
    </div>
    <div v-if="status == 'Rejected' && res_status">
      <div class="content" id="rejected">
        <h1 v-if="rejection">
          <span><i class="fas fa-exclamation-triangle"></i></span><br />
          {{ message }}
        </h1>
        <h1 v-else>
          <span><i class="fas fa-user-check"></i></span><br />
          Rejected
        </h1>
       <span class="align-center">{{default_message}}</span>
        <!-- <button type="reset" onclick="window.close()" class="custom-button">
          Close
        </button> -->
      </div>
    </div>
    <div v-if="invalid" class="container">
      <div class="content">
        <h1>
          <span><i class="fas fa-exclamation-triangle"></i></span><br />
          {{ message }}
        </h1>
       <span class="align-center">{{default_message}}</span>
        <!-- <button type="reset" onclick="window.close()" class="custom-button">
          Close
        </button> -->
      </div>
    </div>
  </div>
</template>

<script>
import ApprovalService from "../../services/ApprovalService";
import OtpInput from './authentication/OtpInput'
import _ from "lodash";


export default {
  name: "Approval",
  data() {
    return {
      loading: false,
      status: "",
      token: "",
      approval_id: "",
      comment: "",
      res_status: false,
      message: "",
      invalid: false,
      rejection:false,
      form: { comment: "" },
      passcode:"",
      invalidOtp: false,
      enable_approval_passcode: false,
      document_type:"",
      document_id:"",
      default_message:"You can close the browser."  // this message is temporary    
    };
  },
  components: {
    OtpInput
  },
  methods: {
    async updateApproval(actionVal) {
      let valid = this.status === "Rejected" ? await this.$refs.rejectConfirm.validate() : true;
      if (valid) {
        this.loading = true;
        const data = {
          status: this.status,
          token: this.token,
          approval_id: this.approval_id,
          comment: this.form.comment,
          customer_id: this.customer_id,
          passcode: this.passcode,
          document_type: this.document_type,
          action: actionVal
        }
        //updating the data to the approval db and verify the otp
        const approvalResponse = await ApprovalService.updateApprovalByAction(data).catch((err) => {
          console.log("Error while updateApproval:: ", err);
          this.loading = false;
        });
        const {code, status, success, stage} = approvalResponse;
        if (stage) {
          this.message ="Document cannot be approved or rejected in it's current stage";
          this.invalid = true;
          this.status = "";
          return;
        }
        
        //checking if Otp is Valid
        if ( code == "invalid_otp" && !success) {
              this.invalidOtp = true;
              this.res_status = false;
        } else if(!success){
              this.message= "Something went wrong, please try again later"
              this.res_status = false;
        } else{
              this.res_status = true;
        }
        this.loading = false;
      }
    },

    /**
     * initiating the resend otp
     */
    async resendOtp() {
      const data = {
        token: this.token,
        approval_id: this.approval_id,
        customer_id: this.customer_id,
        document_id: this.document_id,
        action: "resend_otp",
        document_type:this.document_type
      }
      const otpResponse = await ApprovalService.updateApprovalByAction(data).catch((err) => {
        console.log("Error while resending otp");
        this.notifyError("Error while resending OTP");
        this.loading = false;
        return;
      });
      const otpResponseStatus = _.get(otpResponse,"status",false)
      //notifing user if the otp is sent successfully
      if(otpResponseStatus){
         this.notifySuccess("OTP resent successfully to your email");
      }else{
         this.notifyError("Error while resending OTP");
      }
    },

    onChangePasscode(value){
      this.passcode = value;
    },
    
  },
  async beforeMount() {
    let url = new URL(window.location.href);
    let status = url.searchParams.get("status");
    this.token = url.searchParams.get("token");
    this.customer_id = url.searchParams.get("customer_id");
    this.approval_id = url.searchParams.get("row_id");
    this.document_type = url.searchParams.get("document_type") || "invoice";
    this.status = status;
    if (!status || !this.token || !this.approval_id) {
      this.message = "Invalid request";
      this.invalid = true; 
      this.status = "";
      return;
    }
    let params={
     approval_id:this.approval_id,
     token:this.token,
     customer_id:this.customer_id,
     document_type: this.document_type
    }
    
    const validateReqResponse = await ApprovalService.validateApprovalRequest(params);
    if(validateReqResponse && validateReqResponse.success){
      const {enable_approval_passcode: passcodeEnabled, document_id:docId,otp_sent:otpSent}  = validateReqResponse.data;
      this.document_id = docId
      this.enable_approval_passcode = passcodeEnabled
      if(passcodeEnabled && otpSent){
        this.notifySuccess("OTP sent successfully to your email");
      }
    }
    else{
      this.message = validateReqResponse.message || "Invalid request";
      this.invalid = true;
      this.status = "";
      return;
    }
  },
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";
@import "../../assets/scss/_mixins";

.msg-box {
  max-width: 240px;
  margin: 50px auto;

  h1 {
    @include text-bordered-shadow();
  }
}

@import url("https://fonts.googleapis.com/css?family=Montserrat:400i,600,700&display=swap");
body {
  margin: 0;
  font-family: "Montserrat", sans-serif;
  background: #ffffff;
}

.container {
  width: 100vw;
  height: 100vh;
  // background: #d4d4d4;
}

.content {
  width: 80%;
  margin: 0 auto;
}

.align-center {
  display: block;
  text-align: center;
}

.content h1,
.content .approve-confirmation {
  text-align: center;
  font-size: 2rem;
  padding: 81px 16px 16px 16px;
  font-weight: 700;
  color: #55595b;
}

.content i {
  font-size: 4rem;
  margin: 0 auto;
  color: #588fc7;
  padding-bottom: 16px;
}

.content .custom-button:hover {
  cursor: pointer;
  background: #4fb2f4;
  color: #fff;
}

.content .custom-button,
.content .split-button {
  cursor: pointer;
  display: block;
  margin: 0 auto;
  background: transparent;
  width: 180px;
  padding: 4px 0;
  outline: none;
  border: none;
  color: #4fb2f4;
  text-transform: uppercase;
  font-size: 1rem;
  font-weight: bold;
  padding: 8px;
  width: 110px;
  border-radius: 5px;
  letter-spacing: 1px;
  border: 2px solid #4fb2f4;
}

.content .split-button {
  display: inline-block;
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 24px;
}

.content button:hover,
.content button:active {
  background: #4fb2f4;
  color: #fff;
}

/* Confirmations------------- */

.content forms {
  display: block;
}

.content .confirmation-buttons {
  width: 100%;
  text-align: center;
  display: block;
  margin: 0 auto;
  textarea {
    width: 50%;
    height:171px !important;
    margin: 0px auto 12px;
  }
}

textarea {
  margin: 32px auto;
  display: block;
  border-radius: 5px;
  width: 400px;
  padding: 16px;
}

.resend{
  font-size: 15px;
  text-align: center; 
  font-weight: 600; 
  color: rgba(10, 10, 136, 0.767);
  padding: 10px;
  
}


</style>

