<template>
<el-main id="container">

     <div class="kp-back-to-parent">
      <el-button class="kp-btn-back" icon="el-icon-back" v-on:click="displayList"></el-button>
      <h1 class="kp-page-title">{{pageTitle}}</h1>
    </div>

    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/user-preference-list' }">User preferences</el-breadcrumb-item>
      <el-breadcrumb-item>{{pageTitle}}</el-breadcrumb-item>
    </el-breadcrumb>
 <div class="kp-form-area">
      <div class="kp-form-panel">
        <el-row>
          <el-col>
            <el-form
              :label-position="labelPosition"
              label-width="100px"
              :model="user_preference"
              :rules="validationRules"
              ref="ruleForm"
            >
        <ConfirmModel ref="model"></ConfirmModel>


            <el-row :gutter="72">
                <el-col :span="8">
                  <div class="kp-form-select-1 kp-form-field">
                    <el-form-item class="kp-form-field-label" label="User" prop="user_id">
                      <el-input v-model="user_preference.user_id" placeholder=""></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
            <el-row :gutter="72">
                <el-col :span="12">
                  <div class="kp-form-select-1 kp-form-field">
                    <el-form-item class="kp-form-field-label" label="Preferences" prop="preferences">
                      <codemirror v-model="user_preference.preferences" :value="user_preference.preferences" :options="editorOptions"></codemirror>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
            </el-form>
        </el-col>
        </el-row>
        </div>
        <el-button
            v-on:click.once="save"
            :key="buttonKey"
            class="kp-btn-form-primary"
            type="primary"
        >Save</el-button>
      <el-button v-on:click="displayList" class="kp-btn-form-outline">Cancel</el-button>
      <!-- <div v-if="!isFormValid" class="kp-form-error">* Please check field with errors</div> -->
    </div>


</el-main>
</template>

<script>
import _ from "lodash";
import Json from "@/util/Json";
import Codemirror from "@/components/Codemirror";
import CommonService from "@/services/CommonService";
import constants from "@/resources/Constants";
import ConfirmModel from "@/components/ConfirmModel";

export default {
  name: "UserPreferenceFrom",
  components: {
    Codemirror,
    ConfirmModel
  },
  data() {
    return {
      labelPosition: "top",
      requiredParam: {},
      // pageTitle: "New Banner",
      editorOptions: {
        mode: "text/javascript",
        theme: "default"
      },
      cacheDataModal: {
        cachedForm: {},
        isFormEdited: false,
        isEditForm: false,
        isNewForm: false,
      },
      user_preference: {},
      customers: [],
      buttonKey: 1,
      endpoint: constants.USER_PREFERENCE_ENDPOINT,
      validationRules: this.setValidationRules()
    };
  },
  watch: {
    user_preference: {
      handler(newVal, oldVal) {
        if (this.cacheDataModal.isNewForm || this.cacheDataModal.isEditForm) {
          this.cacheDataModal.isFormEdited =
            JSON.stringify(this.cacheDataModal.cachedForm) !=
            JSON.stringify(this.user_preference);
        }
      },
      deep: true
    }
  },
  methods: {
    async init() {
      const preferenceId = this.getIdFromUrl();
      if (preferenceId) {
        let user_preference = await CommonService.fetchById(
          this.endpoint,
          preferenceId
        ).catch(error => {
          this.notifyError("Error while fetching user preference data");
        });
        this.user_preference =
          (user_preference &&
            _.defaultsDeep(user_preference, this.user_preference)) ||
          this.user_preference;
        this.cacheDataModal.isEditForm = true;
        this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = { ...this.user_preference };
        this.pageTitle = "Edit user preference";
      } else {
        this.cacheDataModal.isNewForm = true;
        this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = { ...this.user_preference };
      }
    },
    getIdFromUrl() {
      return this.$route.query.id || "";
    },

    async save() {
      let isValid = await this.$refs.ruleForm.validate().catch(error => {});
      this.cacheDataModal.isFormEdited = false;
      let user_preference =
        isValid &&
        (await CommonService.save(this.endpoint, this.user_preference).catch(
          error => {
            this.notifyError("Error while saving user preference data!!");
          }
        ));
      if (user_preference) {
        this.user_preference._id = user_preference._id; // add service id after first request to existing service object to avoid duplicate service entries
        this.notifySuccess("User preference saved successfully!!");
        this.displayList();
      }
      this.buttonKey++;
    },

    displayList() {
      this.$router.push({
        path: "/user-preference-list"
      });
    },
    setValidationRules() {
      return {
        // name: [{
        //     required: true,
        //     message: "Please input name",
        //     trigger: "blur"
        // }],
        // ends_on: [{
        //     required: true,
        //     message: "Please input schedular ends on",
        //     trigger: "blur"
        // }],
        // schedule_format: [{
        //     required: true,
        //     message: "Please input schedule format",
        //     trigger: "blur"
        // }],
        // script: [{
        //     required: true,
        //     message: "Please input script",
        //     trigger: "blur"
        // }],
      };
    },
    validateRequestHeader(rule, value, callback) {
      if (_.isEmpty(value)) {
        callback();
      }
      Json.isJson(value)
        ? callback()
        : callback(new Error("Please input correct JSON format!!"));
    }
  },

  beforeMount() {
    let user = this.$store.getters.user;
    if (user.roles.includes("admin")) {
      this.showList = true;
    }
    this.init();
    window.addEventListener("beforeunload", event => {
      if (!this.cacheDataModal.isFormEdited) return;
      event.preventDefault();
      event.returnValue = "";
    });
  },
  beforeRouteLeave: function(to, from, next) {
    if (this.cacheDataModal.isFormEdited) {
      //    return window.confirm('Do you really want to leave? you have unsaved changes!')
      return this.$refs.model.open(next);
    } else {
      return next();
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";

.el-tabs__active-bar {
  height: 4px !important;
}

.el-tabs__nav-wrap {
  margin-bottom: 0px !important;
}

.section-id {
  height: 42px;
}

.el-tabs__content {
  padding: 0 0 0 15px !important;
}

.service-config-container {
  position: sticky;
  width: 100%;
  top: 0px;
  z-index: 999;

  .el-tabs__header {
    margin-bottom: 25px !important;
    padding: 0 !important;

    background: #f3f7fa;
    overflow: hidden;
    font-weight: 700;
  }

  .el-tabs__nav-wrap {
    a {
      text-decoration: none;
      color: #4a596a;
    }
  }
}

// form section
.form-section {
  padding: 10px;
  margin-bottom: 10px;

  .codemirror {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }

  .el-input,
  .el-radio__label,
  .el-form-item__label,
  .el-select-dropdown__item,
  .el-button {
    font-size: $font-size-12;
  }

  .el-row {
    margin-bottom: 0px;
  }

  .form-heading {
    border-bottom: 1px solid #ebeef5;
    height: 15px;
    line-height: 15px;
    font-size: $font-size-12;
    font-weight: 500;
    font-weight: 700;
    text-transform: uppercase;
    padding: 0 16px;
    margin-top: 0;
    padding-bottom: 10px;
  }

  .el-select {
    width: 100%;
  }

  .el-form-item {
    margin-bottom: 0px;
  }

  .el-input__inner {
    height: 30px;
    line-height: 30px;
  }

  .el-form-item__error {
    position: relative;
    padding-top: 0px;
  }

  // Default Condition
  .el-tabs__content,
  .el-tabs__header {
    padding: 15px;
  }

  .object-container {
    background: $color-white;
    overflow: hidden;
    margin-bottom: 10px;

    .btn-addtag {
      margin-bottom: 20px;
    }

    .obj-name {
      background: #f3f7fa;
      padding: 5px 16px;
      margin: 0;
      font-weight: bold;
      text-transform: uppercase;
      font-size: $font-size-14;
    }

    .obj-name-container {
      i {
        cursor: pointer;
      }

      .obj-noneditable {
        font-weight: bold;
        font-size: $font-size-14;
        display: inline-block;
        line-height: 28px;
      }

      .right-icon-set {
        span {
          cursor: pointer;
          font-size: 17px;
          padding: 0 5px;
        }

        display: inline-block;
        float: right;
        padding: 4px;
      }
    }

    .el-button--text {
      font-weight: bold;
    }

    .object-body {
      padding: 16px;

      .el-form-item {
        margin-bottom: 10px;
      }

      .tagname-container {
        border-bottom: 1px solid #dcdfe6;
        padding: 10px 0;
        margin-bottom: 10px;

        .el-input {
          width: auto;
          margin-right: 20px;
        }

        .tagname-code-area-container {
          // background: #e4e7ed;
          padding: 15px;
          min-height: 100px;
          vertical-align: top;
          width: 55%;
          display: inline-block;
          margin-left: 20px;

          .enter-code-indicator {
            opacity: 0.5;
          }
        }
      }
    }
  }

  // Default Condition
}

// end form section
</style>
