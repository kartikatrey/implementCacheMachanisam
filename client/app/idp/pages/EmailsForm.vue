<template>
  <el-main class="kp-main">
    <section class="page-body">
      <div class="page-title">
        <el-button class="back-button" cid="form-header-back" icon="mdi mdi-arrow-left-circle-outline"
          v-on:click="$router.push('/idp/emails-list')">
        </el-button>
        <span class="page-title-text"> {{ pageTitle }}</span>
      </div>

      <section class="form-page-container">
        <div class="panel" v-loading="loading">
          <div class="panel-body">
            <el-form :model="email_template" :rules="validationRules" ref="ruleForm" label-position="left"
              label-width="120px">
              <div class="grouping-tile">General configuration</div>
              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="name" label="Name">
                      <el-input cid="emails-form-name" name="name" v-model="email_template.name"
                        placeholder=""></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="4"><div class="kp-form-group"></div></el-col>
                <el-col :span="8">
                  <div class="kp-form-group">
                    <el-form-item prop="type" label="Type">
                      <el-input cid="emails-form-type" name="type" v-model="email_template.type"
                        placeholder=""></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="subject" label="Subject">
                      <el-input id="emailSubject" cid="emails-form-subject" v-model="email_template.subject" placeholder=""></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="kp-form-group">  
                      <el-select
                        filterable
                        v-model="emailSubjectPlaceHolder"
                        placeholder="Add place holder"
                        @change="onChangeEmailSubject"
                      >
                        <el-option
                          v-for="value in placeHolderList"
                          :key="value.value"
                          :value="value.value"
                          :label="value.label"
                        ></el-option>
                      </el-select>
                  </div>
                </el-col>  
                <el-col :span="8">
                  <div class="kp-form-group">
                    <el-form-item label="Active" prop="active">
                      <el-checkbox v-model="email_template.active"> </el-checkbox>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item label="From Name">
                      <template slot="label">
                        <span>
                          From Name
                          <el-tooltip content="This is the name that recipients will identify as the sender of the email." placement="top">
                            <i class="el-icon-question"></i>
                          </el-tooltip>
                        </span>
                      </template>
                      <el-input
                        cid="email-template-form-name"
                        name="from_name"
                        v-model="email_template.from_name"
                        placeholder="eg. Jack"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="40">
                <el-col :span="16">
                  <div class="kp-form-group">
                    <el-form-item label="Body" prop="template">
                      <TextEditor ref="textEditor" :sourceData="email_template.template" > </TextEditor>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="kp-form-group">
                      <el-select
                        filterable
                        v-model="emailBodyPlaceHolder"
                        placeholder="Add Place holder"
                        @change="onChangeEmailBody"
                      >
                        <el-option
                          v-for="value in placeHolderList"
                          :key="value.value"
                          :value="value.value"
                          :label="value.label"
                        ></el-option>
                      </el-select>
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <!-- | panel body -->
          <footer>
            <div></div>
            <div>
              <el-button cid="policy-form-cancel" size="small" v-on:click="displayList">Cancel</el-button>
            </div>
            <div>
              <el-button v-if="isSaveActionAllowed" cid="policy-form-save" size="small" v-on:click="save" type="primary">Save</el-button>
            </div>
          </footer>
        </div>
        <!-- | panel -->
      </section>

      <!-- |  form-page-container  -->

      <!-- | form-page-container -->
    </section>
  </el-main>
</template>
  
<style lang="scss">
@import "../_idpGlobal.scss";
</style>
  
<script>
import _ from "lodash";
import CommonService from "@/services/CommonService";
import constants from "@/resources/Constants";
import ConfirmModel from "@/components/ConfirmModel";
import EventBus from "@/EventBus";
import TextEditor from '@/idp/components/TextEditor'
import Validator from "@/services/Validator";
import formMixin from "@/mixins/formMixin.js";


export default {
  name: "EmailTemplateFrom",
  components: {
    ConfirmModel,
    TextEditor
  },
  mixins: [formMixin],
  data() {
    return {
      labelPosition: "top",
      loading: false,
      requiredParam: {},
      isFormValid: true,
      pageTitle: "New template",
      isSaveActionAllowed : true,
      email_template: {
        type: "User",
        active: true,
        template: "",
        subject: "",
        from_name: "",
      },
      emailBodyPlaceHolder:"",
      emailSubjectPlaceHolder:"",
      placeHolderList:constants.EMAIL_TEMPLATE_STRINGS,
      endpoint: constants.EMAILS_ENDPOINT,
      validationRules: this.setValidationRules(),
    };
  },
  methods: {
    async init() {
      const templateId = this.getTemplateIdFromUrl();
      if (templateId) {
        const email_template = await CommonService.fetchById(this.endpoint, templateId).catch(error => {
          this.notifyError("Error while fetching template data");
        });

        this.email_template =
          (email_template &&
            _.defaultsDeep(email_template, this.email_template)) ||
          this.email_template;
        this.pageTitle = "Edit template";
      }

    },
    async save() {
      this.Loading = true;
      let valid = await this.$refs.ruleForm.validate().catch(error => {
      });
      if (!valid) {
        this.Loading = false;
      }

      this.isFormValid = valid;
      if (this.email_template.customer_id === "")
        this.email_template.customer_id = null;
      let email_template = valid &&
        (await CommonService.save(this.endpoint, this.email_template).catch(
          error => {
            this.isFormValid = false;
            this.notifyError("Error while saving template data");
          }
        ));
      if (email_template) {
        this.notifySuccess("Template saved successfully");
        this.displayList();
      }

    },
    getTemplateIdFromUrl() {
      return this.$route.query.id || "";
    },
    displayList() {
      this.$router.push({
        path: "/idp/emails-list"
      });
    },
    setValidationRules() {
      return {
        subject: [
          {
            validator: Validator.EmptyValueValidator,
            trigger: "blur",
            message: "Please input subject",
          },
          {
            required: true,
            message: "Please input subject",
            trigger: "change"
          }
        ],
        name: [
          {
            validator: Validator.EmptyValueValidator,
            trigger: "blur",
            message: "Please input type",
          },
          {
            required: true,
            message: "Please input type",
            trigger: "blur"
          }
        ],
        template: [
           {
            validator: Validator.EmptyValueValidator,
            trigger: "blur",
            message: "Please input body",
          },
          {
            required: true,
            message: "Please input body",
            trigger: "blur",
          },
        ]
      };
    },
    registerEvents() {
			EventBus.$on("editedBody", (value) => {
				this.email_template.template = value;
			});
	  },
    /* 
     * In the email form, we display a list of variables as placeholders. 
     * This function is triggered when the user selects a placeholder field from 
     * the dropdown. It appends the selected field, enclosed in "${ }", to the
     * existing email template/email subject so that all the variables will be replaced with actual
     * values while converting the template to string.
     */
    //Here inserting placeholder in the email body
    onChangeEmailBody(placeHolderField){
      this.$refs.textEditor.insertPlaceholder(placeHolderField);
      this.emailBodyPlaceHolder = ""
    },
    //Here inserting placeholder in the email subject
    onChangeEmailSubject(placeHolderField){
      let curPos = document.getElementById("emailSubject").selectionStart;
      this.email_template.subject=this.email_template.subject.slice(0, curPos) + " ${"+placeHolderField+"} " + this.email_template.subject.slice(curPos)
      this.emailSubjectPlaceHolder=''
    }
  },
  async beforeMount() {
    this.isSaveActionAllowed = await this.isSaveActionPermitted('emails');
    this.$store.commit("setDisplayIdpTree",false);
		this.$store.commit("setDisplayIdpNavbar",true);
    this.init();
  },
  mounted() {
		this.registerEvents();
	},
  beforeDestroy() {
      EventBus.$off("editedBody");
  }
}
</script>
  
<style lang="scss">
@import "../_idpGlobal.scss";
@import "../_idpVariables.scss";
</style>
  