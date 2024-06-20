<template>
  <el-container class="login-page">
    <el-aside >
      <div class="signup-img"></div>
    </el-aside>
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="24">
            <div class="login-header">
              <p>Already have an account?</p>
              <a href="#" @click="login">LOGIN</a>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="({span:14,offset:5})" :xl="({span:8,offset:7})">
            <div class="grid-content form-area">
              <h1 class="form-heading">Sign Up</h1>

              <h2 class="success-heading">SUCCESS
                <i class="el-icon-circle-check"></i>
              </h2>

              <div class="form-success-section">
                <div class="success-label">You have completed the sign up process. You will be notified once your registration is approved.
                  <br>
                </div>                
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
        email: "",
    };
  },
  methods: {
    login() {
      // this.$store.commit('setLogin')
      this.$router.push('login');
    }
  },
  created(){
	  this.email = this.$route.params.email;
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

.login-page {
  // background: $white;

  .signup-img {
    // width: 100%;
    height: 100%;
    // background-image: url('../../../assets/images/placeholderdog.jpg');
    background-position: auto;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .login-header {
    float: right;
    margin-top: 16px;
    margin-right: 32px;
    display: block;
    p {
      display: inline-block;
      font-size: $font-size-14;
    }
    a {
      margin-left: 5px;
      font-size: $font-size-14;
      font-weight: 700;
      text-decoration: none;
    }
  }

  .el-main {
    padding-top: 0;
  }

  .form-area {
    span {
      display: inline-block;
    }

    .form-heading {
      font-size: $font-size-28;
      font-weight: 400;
      margin-bottom: 8px;
      margin-top: 8px;
    }

    .form-subtitle {
      font-size: $font-size-default;
      margin-bottom: 48px;
      color: $text-color-light;
    }

    .form-validation {
      margin-bottom: 16px;
      font-weight: 700;
      color: $text-color-danger;
    }

    .form-input-section {
      margin-bottom: 32px;
      .input-label {
        font-size: $font-size-12;
        font-weight: 700;
        margin-bottom: 8px;
      }

      .form-input-actions {
        font-size: $font-size-14;
        text-decoration: none;
        float: right;
        color: $text-color-light;
      }

      .input-area {
        input {
          height: 50px;
        }
      }

      // .validation-border {
      // 	border: 1px solid $text-color-danger;
      // 	border-radius: 5px;
      // }

      .input-validation {
        font-size: $font-size-14;
        color: $text-color-danger;
        margin-top: 6px;
        // display: none;
      }

      .form-button-long {
        width: 100%;
        font-weight: 700;
        height: 50px;
        background: $text-color-info;
        color: $white;
      }
    }

    // SUCCESS CSS

    .success-heading {
      font-size: $font-size-58;
      font-weight: 700;
      margin-bottom: 32px;
      margin-top: 0;
      i {
        margin-left: 32px;
        font-size: $font-size-58;
        color: $text-color-light;
      }
    }

    .success-label {
      font-weight: 700;
      margin-bottom: 8px;
      span {
        font-weight: 400;
      }
    }

    .success-email {
      color: $text-color-light;
      margin-top: 32px;
    }
    .success-email-link {
      font-size: $font-size-12;
      text-decoration: none;
      font-weight: 700;
      margin-left: 60px;
    }
  }
}

// @media (min-width: 1320px) {
//   .login-page {
//     .form-area {
//       margin-top: 128px;
//     }
//   }
// }
</style>
