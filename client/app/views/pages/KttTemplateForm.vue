<template>
<el-main id="container">
    <div class="kp-back-to-parent">
        <el-button class="kp-btn-back" icon="el-icon-back" v-on:click="displayList"></el-button>
        <h1 class="kp-page-title">{{pageTitle}}</h1>
    </div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/ktt-template-list' }">Training template</el-breadcrumb-item>
        <el-breadcrumb-item>{{pageTitle}}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Form  Page -->

    <div class="kp-form-area">
        <div class="kp-form-panel">
            <el-row>
                <el-col>
                    <el-form class="el-form--label-top" :label-position="labelPosition" :model="ktt_template" :rules="validationRules" ref="ruleForm" label-width="100px">

                        <ConfirmModel ref="model"></ConfirmModel>
                        <el-row :gutter="72">
                            <el-col :span="8">

                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" label="Name">
                                        <el-input v-model="ktt_template.name" placeholder="name"></el-input>
                                    </el-form-item>
                                </div>

                            </el-col>
                            <el-col :span="8">
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" prop="train_file" label="Train file">
                                        <el-select clearable @change="onTrainFileChange" placeholder="Please select train file" v-model="ktt_template.train_file">
                                            <el-option v-for="file in files" :value="file._id" :key="file._id" :label="file.filename"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="72">
                            <el-col :span="8">
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" prop="test_file" label="Test file">
                                        <el-select clearable @change="onTestFileChange" placeholder="Please select test file" v-model="ktt_template.test_file">
                                            <el-option v-for="file in files" :value="file._id" :key="file._id" :label="file.filename"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="72">
                            <el-col :span="24">
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" label="Train file info" prop="train_file_info"></el-form-item>
                                    <codemirror v-model="ktt_template.train_file_info" :value="ktt_template.train_file_info" :options="editorOptions"></codemirror>
                                </div>
                            </el-col>
                            <el-col :span="24">
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" label="Test file info" prop="test_file_info"></el-form-item>
                                    <codemirror v-model="ktt_template.test_file_info" :value="ktt_template.test_file_info" :options="editorOptions"></codemirror>
                                </div>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
        </div><!-- / basic content -->
        <el-button v-on:click.once="onSave" :key="buttonKey" class="kp-btn-form-primary" type="primary">Save</el-button>
        <el-button v-on:click="displayList" class="kp-btn-form-outline">Cancel</el-button>
        <div v-if="!isFormValid" class="kp-form-error">
            * Please check field with errors
        </div>
    </div>
    <!-- end sticky button -->
</el-main>
</template>

<script>
import _ from "lodash";
import Json from "@/util/Json";
import Codemirror from "@/components/Codemirror";
import TemplateService from "@/services/TemplateService";
import CommonService from "@/services/CommonService";
import constants from "@/resources/Constants";
import Validator from "@/services/Validator";
import ConfirmModel from "@/components/ConfirmModel";

export default {
  name: "KttTemplateFrom",
  components: {
    Codemirror,
    ConfirmModel
  },
  data() {
    return {
      requiredParam: {},
      pageTitle: "New template",
      editorOptions: {
        mode: "text/javascript",
        theme: "default"
      },
      ktt_template: {},
      endpoint: constants.KTT_TEMPLATE_ENDPOINT,
      isFormValid: true,
      cacheDataModal: {
        cachedForm: {},
        isFormEdited: false,
        isEditForm: false,
        isNewForm: false
      },
      files: [],
      buttonKey: 1,
      validationRules: this.setValidationRules()
    };
  },
  watch: {
    ktt_template: {
      handler(newVal, oldVal) {
        if (this.cacheDataModal.isNewForm || this.cacheDataModal.isEditForm) {
          this.cacheDataModal.isFormEdited =
            JSON.stringify(this.cacheDataModal.cachedForm) !=
            JSON.stringify(this.ktt_template);
        }
      },
      deep: true
    }
  },
  methods: {
    async init() {
      const templateId = this.getTemplateIdFromUrl();
      if (templateId) {
        let ktt_template = await CommonService.fetchById(
          this.endpoint,
          templateId
        ).catch(error => {
          this.notifyError("Error while fetching template data");
        });
        this.ktt_template =
          (ktt_template && _.defaultsDeep(ktt_template, this.ktt_template)) ||
          this.ktt_template;

        this.cacheDataModal.isEditForm = true;
        this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = { ...this.ktt_template };
        this.pageTitle = "Edit template";
      } else {
        this.cacheDataModal.isNewForm = true;
        this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = { ...this.ktt_template };
      }
    },
    getTemplateIdFromUrl() {
      return this.$route.query.id || "";
    },

    async fetchFiles() {
      this.files = await TemplateService.fetchFileList().catch(error => {
        this.notifyError("Error while fetching files");
      });
    },
    onTrainFileChange(file_id) {
      let file = _.find(this.files, {
        _id: file_id
      });
      this.ktt_template.train_file_name = file.filename;
    },
    onTestFileChange(file_id) {
      let file = _.find(this.files, {
        _id: file_id
      });
      this.ktt_template.test_file_name = file.filename;
    },

    async onSave() {
      this.cacheDataModal.isFormEdited = false;
      let isValid = await this.$refs.ruleForm.validate().catch(error => {});
      this.isFormValid = isValid;
      let ktt_template =
        isValid &&
        (await CommonService.save(this.endpoint, this.ktt_template).catch(
          error => {
            this.isFormValid = false;
            this.notifyError("Error while saving template data!!");
          }
        ));
      if (ktt_template) {
        this.ktt_template._id = ktt_template._id;
        this.notifySuccess("Template saved successfully!!");
        this.displayList();
      }
      this.buttonKey++;
    },

    displayList() {
      this.$router.push({
        path: "/ktt-template-list"
      });
    },
    setValidationRules() {
      return {
        // model_name: [{
        //     required: true,
        //     message: "Please input model name",
        //     trigger: "blur"
        // }],
        // request_body: [{
        //     required: true,
        //     message: "Please input request body",
        //     trigger: "blur"
        // }],
        // response_body: [{
        //     required: true,
        //     message: "Please input response body",
        //     trigger: "blur"
        // }],
        // config: [{
        //     validator: this.validateRequestHeader,
        //     trigger: "blur"
        // }],
        // train_config: [{
        //     validator: this.validateRequestHeader,
        //     trigger: "blur"
        // }]
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
    this.fetchFiles();
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

.el-form--label-top .el-form-item__label {
  float: none;
  display: inline-block;
  text-align: left;
  // padding: 0 0 10px 0;
}

.el-form-item__content {
  margin-left: 0 !important;
}

// end form section
</style>
