<template>
  <el-container class="register-container">
   <div class="kanverse-branding">
        <span class="red">&nbsp;</span>
        <span class="green">&nbsp;</span>
        <span class="blue">&nbsp;</span>
      </div>

    <div class="inner">
        <el-row>

          <el-col :span="16">
              <el-form
              :model="form"
              :rules="formRules"
              ref="form"
              label-position="top"
              autocomplete="off"
            >
                <div class="register-body">
                   <div class="register">
                
                 <div class="logo">
                  <img @click="redirectToKanverseWeb" class="logo-img" src="../../../assets/images/logo-ai.svg" />
                  <span>Hyperautomation for Enterprises</span>
                </div>


                 <p class="title">Let’s start your free trial now</p>
                <div
                  tabIndex="-1"
                  v-if="isError"
                  ref="errDiv"
                  class="form-validation"
                >
                  {{ errMessage }}
                </div>
                <div class="form-input-section" style="margin-top:1rem">
                  <span class="valid-star">*</span>
                  <el-form-item
                    class="input-label"
                    prop="name" 
                    label=""
                  >
                    <el-input
                      class="input-area"
                      placeholder="Your name"
                      type="text"
                      v-model="form.name"
                      v-on:keyup.native.enter="tryItRegister"
                    ></el-input>
                  </el-form-item>
                </div>
                  <div class="form-input-section">
                  <el-form-item
                    label=""
                    class="input-label"
                    prop="contact"
                  >
                    <el-input
                      class="input-area"
                      placeholder="Contact number"
                      type="number"
                      v-model="form.contact"
                      @keypress.native="isNumber($event)"
                      v-on:keyup.native.enter="tryItRegister"
                    ></el-input>
                  </el-form-item>
                </div>
                <div class="form-input-section">
                   <span class="valid-star">*</span>
                  <el-form-item label="" prop="email" class="input-label">
                    <el-input
                      class="input-area"
                      placeholder="Business email"
                      type="email"
                      v-model.trim="form.email"
                      v-on:keyup.native.enter="tryItRegister"
                    ></el-input>
                  </el-form-item>
                </div>
                <div class="form-input-section create-pwd-wrap">
                   <span class="valid-star">*</span>
                  <el-form-item label="" prop="password" class="input-label">
                    <el-input
                      class="input-area"
                      placeholder="Create password"
                      type="password"
                      v-model.trim="form.password"
                      v-on:keyup.native.enter="tryItRegister"
                    ></el-input>
                  </el-form-item>
                  <!-- <i class="mdi mdi-eye-outline"></i> -->
                 <span class="pwd-instuction"> Password must have at least 8 characters </span>
                </div>
              
                <div>
                  <el-button
                  class="btn-continue"
                     type="primary"
                    v-bind:disabled="tryItRegisterDisabled"
                    @click="tryItRegister"
                    >Continue</el-button
                  >
                </div>
              </div>
                </div>
            </el-form>
          </el-col> <!-- | left side -->

          <el-col :span="8" class="right-panel">
            <div class="right-panel-wrap">
                  <!-- <el-button class="btn-back" type="text"><i class="mdi mdi-arrow-left"></i> Back</el-button> -->
                  <h1>AI that learns. Witness Auto-Learning with Kanverse IDP</h1>
                  <ul>
                    <li><img src="../../../assets/images/icons/register-points-icon.svg" /> Zero Touch Document processing with Kanverse Hyperautomation</li>
                    <li><img src="../../../assets/images/icons/register-points-icon.svg" /> Up to 99.5% data extraction accuracy from documents</li>
                    <li><img src="../../../assets/images/icons/register-points-icon.svg" /> Up to 98% reduction in cycle time</li>
                    <li><img src="../../../assets/images/icons/register-points-icon.svg" /> Up to 80% reduction in operational costs</li>
                  </ul>
            </div>
           
          </el-col>
        </el-row>

</div>
  </el-container>

  
</template>

<script>
import _ from "lodash";
import TryItService from "@/services/TryItService";
import Constants from "@/resources/Constants";

export default {
  name: "TryItRegister",
  data() {
    var EmailDomainValidator = (rule, value, callback) => {
      var check_email =
        "[a-zA-Z0-9]{0,}([.]?[a-zA-Z0-9]{1,})[@](gmail.com|hotmail.com|yahoo.com|outlook.com)";
      var patt = new RegExp(check_email);
      var result = patt.test(value.toLowerCase());
      if (result) {
        callback(new Error("Please use business email address"));
      } else {
        callback();
      }
    };
    var PasswordLengthValidator = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error("Your password must be at least 8 characters"));
      } else {
        callback();
      }
    };
    return {
      form: {
        name: "",
        email: "",
        contact: "",
        password: ""
      },
      formValid: true,
      formRules: {
        name: [
          {
            required: true,
            message: "Please enter name",
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
          {
            validator: EmailDomainValidator,
            trigger: "blur",
            message: "Please use business email address",
          }
        ],
        password: [
          {
            required: true,
            message: "Please enter password",
            trigger: "blur",
          },
          {
            validator: PasswordLengthValidator,
            trigger: "blur",
            message: "Your password must be at least 8 characters",
          },
        ],
        contact: [
          {
            required: false,
            message: "Please enter contact number",
            trigger: "blur",
          },
        ],
      },
      tryItRegisterDisabled: false,
      isError: false,
      errMessage: "",
    };
  },
  methods: {
    async tryItRegister() {
      this.$refs.form.validate(async (valid) => {
        if (valid && this.formValid) {
          let userData = {
            name: this.form.name,
            email: this.form.email,
            contact: this.form.contact,
            password: this.form.password
          };
          let response = await TryItService.registerUser(userData);
          if(!response.data.status){
            if(response.data.code == "too_many_try_requests"){
              return this.$router.push("/too-many-try-requests")
            }
            return this.$notify({
                title: 'Error',
                type: "error",
                message: response.data.message
            });
          }
          this.$router.push({
            path: "/try-it-otp",
            query: {
                email: _.get(userData, "email", "").toLowerCase()
            }
          });
        }
      });
    },
    redirectToKanverseWeb(){
      window.location.href = Constants.KAN_MARKETING_WEBSITE;
    }
  },
};
</script>

<style lang="scss">
@import "../../../../app/idp/_idpGlobal";



.register-container {
  background: url("../../../assets/images/otp-bg.jpg") no-repeat;
  // background-position: 25% 75%;
  // background: red;
  background-position: 0% 100%;
  background-size: cover;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  height: 100%;

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
      width: 100% !important;
          // width: 1110px !important;
          margin: 0 auto !important;
        }
       
        .right-panel {
          // background: #808080;
          height: 100%;
             .right-panel-wrap {
                background: url("../../../assets/images/register-right-bg.jpg") no-repeat;
                background-size: cover;
                height: 100%;
                width: 100%;
                box-sizing: border-box;
                padding: 7rem 3rem 0 3rem;
                .btn-back {
                  color: var(--dark-04);
                }
                  h1 {
                      margin: 1rem 0 2rem 0;
                      color: var(--dark-06);
                      font-size: var(--font-md);
                      font-weight: 500;
                  }
                  ul {
                    list-style: none;
                    padding: 0;
                      li {
                        font-size: var(--font-base);
                        color: var(--dark-06);
                        font-weight: 300;
                        margin-bottom: 1.2rem;
                        padding:0rem;
                        display: flex;
                          img {
                            margin-right: 1rem;
                          }
                      }
                  }
                  .more {
                        display: block;
                         margin-left: 2.3rem;
                         color: var(--dark-04);
                         font-size: var(--font-sm);
                  }

              }
        } // right-panel
        .el-row {
          height: 100%;
        }

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
    // padding: 0;
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
  .btn-continue {
    margin-top: 1rem;
  }
}
.logo {
  margin-bottom: var(--space-xl);
  img {
    height: 27px;
  }

  .logo-img {
    cursor: pointer;
  }

  span {
    font-size: var(--font-base);
    color: #808080;
    display: block;
    font-weight: 350;
    padding-left: 2.2rem;
  }
}
.register-body {
  display: flex;
  width: 500px;
  margin: 5rem auto 0 auto;
align-items: center;
  .register {
    width: 100%;
    .form-validation {
      color: var(--red-03);
      font-size: var(--font-base);
      margin-top: var(--space-base);
     
    }
    .title {
      font-size: var(--font-lg);
      margin: 0;
      font-weight: 500;
       -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-image: linear-gradient(45deg, #FE2712, #0147FE, #66B032);
    }
    .is-success .el-input__inner {
      background-color: var( --dark-07-1) !important;
    }
    .create-pwd-wrap {
      position: relative;
        .pwd-instuction {
          font-size: var(--font-sm);
          color: var(--dark-05);
          font-weight: 400;
          display: block;
          padding-left: 1rem;
        }
        .mdi {
          position: absolute;
          right: 1rem;
          top: 0.5rem;
           color: #5D7084;
          font-size: var(--font-base);
        }
    }
    .is-disabled {
        .el-input__inner { 
          background: var( --dark-07-1) !important;
           color: var(--dark-04) !important;
           border: 0 !important;
            &::placeholder {
              color: var(--dark-04) !important;
            }
        }
    }
    .el-input__inner {
      height: 38px;
      border: 1px solid var(--dark-03) !important;
      border-radius: 0;
      background-color: var(--white) !important;
      color: var(--dark-02);
      border-radius: var(--radius-base);
        &::placeholder {
          color: var(--dark-02);
          opacity: 1;
          font-weight: 400;
        }
    }
    .is-error
        .el-input__inner {
          border: 1px solid var(--red-03) !important;
          border-radius: 0;
          background-color: var(--red-09) !important;
          color: var(--red-02);
          border-radius: var(--radius-base);
            &::placeholder {
              color: var(--red-02) !important;
             
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
   

  }

  .form-input-section {
    margin-bottom: .5rem;
        // margin-top: .3rem;
    position: relative;
      .valid-star {
        color: var(--red-05);
        position: absolute;
        display: inline-block;
        left: -.7rem;
        top: 0;
      }
    
   
  }
  .el-form-item {
    // margin-top: var(--space-sm);
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
    margin-bottom: 0rem;
    margin-left: 1rem;
  }

}


</style>
