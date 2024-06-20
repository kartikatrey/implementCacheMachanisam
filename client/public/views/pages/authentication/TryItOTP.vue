<template>
  <el-container class="otp-container">
      <div class="kanverse-branding">
        <span class="red">&nbsp;</span>
        <span class="green">&nbsp;</span>
        <span class="blue">&nbsp;</span>
      </div>
    <div class="otp-body">
        <div class="inner">
        <div class="logo">
          <img src="@/assets/images/logo-ai.svg" />
          <span>Hyperautomation for Enterprises</span>
        </div>
      <h1>Please enter the One Time Password to verify your account</h1>
      <p class="otp-email-details">A One Time Password has been sent to <span>{{userEmail}}</span></p>
      <p class="otp-expire">Check your spam folder in case you did not receive the OTP. This OTP will expire in 24 hours.</p>
      <el-form :model="form" ref="form" :rules="formRules" label-position="top" @submit.native.prevent >
        <div class="validation-indicates" id="validation-indicates"> <!-- validation-success    validation-error  -->
            <div class="validation-otp ">
              <span class="otp-inst"> <i class="mdi mdi-arrow-down"></i> Enter OTP below</span>
                <div class="int-group" :disabled="disableOTP">
                      <el-input
                        v-for="(item,index) in Object.keys(form)"
                        :key="item"
                        :ref="item" 
                        min="0"
                        max="9"
                        maxlength="1" 
                        @input="(e)=>handleOnClick(e, index+1)"
                        v-model="form[item]">
                      </el-input>
                      <i class="mdi mdi-checkbox-marked-circle success-icon"></i>
                      <i class="mdi mdi-alert-circle error-icon"></i>
                  </div>
            </div>
            <p class="validation-msg validatation-success">OTP verified successfully</p>
            <p class="validation-msg validatation-error">{{errMessage}}</p>
            <a :class="{'disable-link' : disableLink}" class="link-resend" @click="resendOTP">Resend OTP</a>
            <p v-if="resendOTPmsg">{{resendOTPmsg}}</p>
        </div>
 
      </el-form>
      </div>
      </div>
  </el-container>
</template>

<script>
import AjaxService from "../../../services/AjaxService";
import UserService from "@/services/UserService";
import TryItService from "@/services/TryItService";
import _ from 'lodash';
export default {
  name: "TryItOTP",
  watch:{
    "form":{
            handler: function (newVal, oldVal) {
                if(!newVal)return;
                const {input1, input2, input3, input4} = newVal;
                if(!input1 && !input2 && !input3 && !input4){
                  this.errMessage = "OTP required"                  
                }
                if(input1 && input2 && input3 && input4){
                  const otpValue = "" + input1 + input2 + input3 + input4
                  this.verifyOtp(otpValue)
                }
                if(input1 || input2 || input3 || input4){
                  this.resendOTPmsg = null;
                }
            },
            deep: true,
            immediate:true
        },
  },
  data() {
    return {      
      form: {
        input1: "",
        input2: "",
        input3: "",
        input4: "",
      },
      disableLink:false,
      originalEmail: "",
      disableOTP: false,
      errMessage: null,
      resendOTPmsg: null,
      formRules: {
        input1: [
          {
            required: true,
            message: "Please enter valid OTP",
            trigger: "blur",
          },
        ],
        input2: [
          {
            required: true,
            message: "Please enter valid OTP",
            trigger: "blur",
          },
        ],
        input3: [
          {
            required: true,
            message: "Please enter valid OTP",
            trigger: "blur",
          },
        ],
        input4: [
          {
            required: true,
            message: "Please enter valid OTP",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    async resendOTP(){
      this.disableLink = true;
      if(!this.userEmail){
        this.showError("Missing user email");
        return;
      } 
      let response = await TryItService.resendOTP({"email": this.userEmail})
      if(!_.get(response, "data.status")){
        this.resendOTPmsg = _.get(response, "data.message", "Error while resending OTP.. please try again later")
        this.disableLink = false;
        return;
      }
      setTimeout(()=>{
        this.disableLink = false;
      }, 15000)
      this.resendOTPmsg = "OTP sent successfully to your registered email account. This OTP will expire in 24 hours."      
    },

    verifyOtp(otpValue) {
      this.resendOTPmsg = null;
      this.disableOTP = true;
      if(!this.userEmail){
        this.showError("Missing user email");
        return;
      }      
      AjaxService.postJson("/auth/try-it-otp", { email: this.userEmail, otp: otpValue }, {}, (err, res) => {
        if (err) {
          this.disableOTP = false;
          this.showError(_.get(err, 'response.data.error.message') || 'Oops! Invalid credential');
          return;
        }
        document.getElementById("validation-indicates").classList.remove('validation-error');
        document.getElementById("validation-indicates").classList.add('validation-success');
        let user = res.data.data.user;
        UserService.routeUserAfterLogin(user);
      });
    },

    showError(message) {
      if (message) {
        this.errMessage = message;
        document.getElementById("validation-indicates").classList.add('validation-error');
      }
    },

    handleOnClick(value, index){
        if(!value)return;
        const nextRef = `input${index+1}`
        this.$refs[nextRef][0].focus();
    }
  },

  mounted(){    
    this.$refs['input1'][0].focus();
  },

  beforeMount() {
    this.userEmail = this.$route.query.email || "";
  }
};
</script>

<style lang="scss">
@import "../../../../app/idp/_idpGlobal";
@import url("https://use.typekit.net/zka8vue.css");

.disable-link{
    color: grey;
    opacity: .4;
    pointer-events: none; 
    cursor: default; 
}

.container {
  background: #fff;
}

.otp-container {
    display: block !important;
    height: 100%;
    // background: #fff;
    background: url("../../../assets/images/otp-bg.jpg") no-repeat;
    background-size: cover;

        
    .kanverse-branding {
        position: absolute;
        top: 180px !important;
        left: 0;
        width: 10px !important;
        height: 50% !important; 
        display: flex;
          flex-direction:column;
        span {
          width: 3px !important;
          height: 33.33% !important;
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

        .inner {
          width: 1110px !important;
          margin: 0 auto !important;
        }
        
        .logo {
          margin-bottom: var(--space-xxl) !important;
          text-align: left;
          img {
            height: 27px;
          }
          span {
            font-size: 1rem;
            color: #808080;
            display: block;
            font-weight: 350;
            padding-left: 2.2rem;
            line-height: 12px;
          }
        }
        .otp-body {
          padding-top: 7rem;
              h1 {
                font-weight: 500;
                margin: 0;
                color: #3B3B3B;
                font-size: 26px;
                line-height: 46px;

                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-image: linear-gradient(45deg, #FE2712, #0147FE, #66B032);
              }
              .otp-email-details {
                margin: 0;
                font-weight: 400;
                font-size: 18px;
                color: var(--dark-02);
                  span {
                    font-weight: 600;
                  }
              }
              .otp-expire {
                color: var(--dark-05);
                  margin: 0;
                font-weight: 400;
                font-size: var(--font-base);
                line-height: 26px;
                margin-top: .2rem;
              }


              .validation-indicates {
                .validation-msg {
                  display: none;
                }
                  .validation-otp {
                    margin-top: 45px;
                    margin-bottom: 16px;
                    .otp-inst {
                      color: var(--dark-05);
                      font-size: var(--font-xs);
                      display: inline-block;
                      margin-bottom: .5rem;
                    }
                      .int-group {
                        display: flex;
                        // justify-content: center;
                        width: 100%;
                        // height: 65px;
                        i {
                          align-self: center;
                          font-size: 22px;
                          
                          display: none;
                        }
                        .el-input {
                          margin-right: 8px;
                          width: 50px;
                          height: 50px;
                            .el-input__inner {
                              height: 100%;
                              font-size: 26px;
                              background: #ffffff;
                              border: 1px solid var(--dark-03);
                              color: var(--dark-02);
                              text-align: center;
                            }
                        }
                        
                      } // | int group
                  } // | validation otp
              }// validation-indicates

              .validation-success {
                        .el-input__inner {
                          background: #FAFFF6 !important;
                          border-color: #66B032 !important;
                           color: #66B032 !important;
                        }
                          .success-icon {
                            display: block !important;
                            color: #66B032;
                          }
                          .link-resend { 
                            display: none !important;
                          }
                          .validation-msg.validatation-success {
                            text-align: left;
                            font-weight: 400;
                            margin: 0;
                            color: #66B032;
                            display: block !important;
                          }
              } // | validation Success

              .validation-error {
                        .el-input__inner {
                          background: #FFF5F5 !important;
                          border-color: #FF5959 !important;
                           color: #FF5959 !important;
                        }
                          .error-icon {
                            display: block !important;
                            color: #FF5959;
                          }
                        
                          .validation-msg.validatation-error {
                            font-weight: 400;
                            margin: 0;
                            color: #FF5959;
                            display: block !important;
                          }
              } // | validation Success

              
                .link-resend {
                  text-decoration: underline;
                  font-size: 16px;
                  color: #0147FE;
                  margin: 15px 0 0 0;
                  display: block;
                    &:hover {
                      text-decoration: none;
                    }
                }

              } // | otp body


  }



</style>