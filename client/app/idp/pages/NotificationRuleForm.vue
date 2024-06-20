<template>
  <el-main class="kp-main">
    <section class="page-body">
      <div class="page-title">
        <el-button cid="form-header-back" class="back-button" icon="mdi mdi-arrow-left-circle-outline" v-on:click="$router.push('/idp/notification-rules')">
        </el-button>
        <span class="page-title-text"> {{ pageTitle }}</span>
        <span> Add New Notification Rule Or Edit Existing </span>
      </div>

      <section class="form-page-container">
        <div class="panel">
          <div class="panel-body">
            <el-form :model="form" :rules="formRules" ref="form" label-position="left" label-width="120px">
              <ConfirmModel ref="model"></ConfirmModel>

              <div class="grouping-tile">General Configuration</div>
              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="name" label="Name">
                      <el-input name="name" cid="notification-rule-form-name" v-model="form.name" placeholder="Notification rule name"></el-input>
                    </el-form-item>
                  </div>
                </el-col>

                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="document_type" label="Document Type">
                      <el-select name="document_type" clearable filterable cid="notification-rule-form-doc-type-select" v-on:change="onDocumentTypeChange" v-model="form.document_type" placeholder="Select">
                        <el-option v-for="(value,index) in doucument_types" :cid="'notification-rule-form-document-type_'+index" :key="value.value" :value="value.value" :label="value.label"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="trigger_type" label="Trigger Type">
                      <el-select name="trigger_type" filterable cid="notification-rule-form-trigger-type-select" v-model="form.trigger_type" placeholder="Select">
                        <el-option label="Event" value="event"></el-option>
                        <el-option label="Schedule" value="schedule"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>

                <el-col :span="12" v-if="form.trigger_type === 'event'">
                  <div class="kp-form-group">
                    <el-form-item prop="trigger" label="Events">
                      <el-select name="trigger" clearable filterable cid="notification-rule-form-trigger-select" v-model="form.trigger" placeholder="Select">
                        <el-option v-for="(value,index) in triggers" :cid="'notification-rule-form-trigger_'+index" :key="value.value" :value="value.value" :label="value.label"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="40" v-if="form.trigger_type === 'schedule' || (form.trigger_type === 'event' && !form.is_advanced)">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="emails" label="Emails">
                      <el-input cid="notification-rule-form-emails" name="emails" v-model="form.emails" placeholder="ex. test1@domain.com, test2@domain.com"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12" v-if="form.trigger_type === 'schedule'">
                  <div class="kp-form-group">
                    <el-form-item prop="email_subject" label="Email Subject">
                      <el-input cid="notification-rule-form-emails" name="email_subject" v-model="form.email_subject" placeholder="Enter the subject for email"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12" v-if="form.trigger_type === 'event'">
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
                      <el-input cid="notification-rule-form-name" name="fromName" v-model="form.from_name" placeholder="eg. Jack"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="40">
                <el-col :span="12" v-if="form.trigger_type === 'schedule'">
                  <div class="kp-form-group">
                    <el-form-item prop="cron_expression" label="Cron Expression">
                      <el-input name="cron_expression" cid="notification-rule-form-cron-expression" v-model="form.cron_expression" placeholder="Cron expression"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="40" v-if="form.trigger_type === 'schedule'">
                <el-col :span="24">
                  <div class="mb-0 kp-form-group">
                    <el-form-item prop="email_html_template" label="Email HTML Template">
                      <KanverseEditor :options="{'width':'100%', 'height':'500px','language': 'businessRule'}" language="html" :content="form.email_html_template" :refreshModel="form._id !== undefined" v-model="form.email_html_template" @onDidChangeModelContent="handleTemplateContentChange">
                      </KanverseEditor>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="40" v-if="form.trigger_type === 'event'">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="emailTemplateNames" label="Email Template">
                      <el-select name="emailTemplateNames" clearable filterable cid="notification-rule-form-email_template-select" v-model="form.email_template" placeholder="Select">
                        <el-option v-for="(value,index) in emailTemplateNames" :cid="'notification-rule-form-email_template'+index" :key="value.name" :value="value.name" :label="value.name"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item label="Advanced Script">
                      <el-checkbox cid="notification-rule-form-advance-script" v-model="form.is_advanced"></el-checkbox>
                    </el-form-item>
                  </div>
                  </el-col>
              </el-row>

              <el-row :gutter="180" v-if="form.trigger_type === 'schedule' || form.is_advanced">
                <el-col :span="24">
                  <div class="mb-0 kp-form-group">
                    <el-form-item prop="script" label="Script">
                      <KanverseEditor :options="{'width':'100%', 'height':'500px','language': 'businessRule'}" :content="form.script" :refreshModel="form._id !== undefined" v-model="form.script" @onDidChangeModelContent="handleContentChange">
                      </KanverseEditor>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <div v-if="form.trigger_type === 'event' && !form.is_advanced">
                <div class="grouping-divide"></div>
                <div class="grouping-tile" >Additional Configuration</div>
                <el-row :gutter="40">
                  <el-col :span="24">
                    <div class="kp-form-group">
                      <el-form-item id="query-builder" prop="rule" label="Rule">
                        <QueryBuilder cid="notification-rule-form-rule" @onQueryChange="onQueryChange" :query="form.rule" :documentType="form.document_type" :dataToShow='["fieldsData", "stageData", "stateData", "fileTypeData"]'></QueryBuilder>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-form>
          </div>
          <footer>
            <div></div>
            <div>
              <el-button v-on:click="$router.push('/idp/notification-rules')" size="small" cid="notification-rule-form-cancel">
                Cancel
              </el-button>
            </div>
            <div>
              <el-button v-if="isSaveActionAllowed" cid="notification-rule-form-save" size="small" id="save-btn" :disabled="disableSave" v-on:click="save" type="primary">
                Save
              </el-button>
            </div>
          </footer>
        </div>
      </section>
    </section>
    <VersionRelatedList v-if="showVersionList" :id="form._id" title="Notification rule versions"></VersionRelatedList>
  </el-main>
</template>

<script>
let jsonpath = require("jsonpath");
import Constants from "@/resources/Constants";
import Codemirror from "@/components/Codemirror";
import DataTable from "@/components/DataTable.vue";
import VueQueryBuilder from "vue-query-builder";
import NotificationRuleService from "@/idp/services/NotificationRule";
import FieldService from "@/idp/services/FieldService";
import ConfirmModel from "@/components/ConfirmModel";
import QueryBuilder from "@/idp/pages/QueryBuilder.vue";
import EventBus from "@/EventBus";
import CustomerConfig from "@/idp/services/DeCustomerConfig";
import EmailService from "@/idp/services/EmailsService";
import VersionRelatedList from "@/idp/components/VersionRelatedList.vue";
import KanverseEditor from "@/components/KanverseEditor";
import Validator from "@/services/Validator";
import formMixin from "@/mixins/formMixin.js";

export default {
  name: "NotificationRuleForm",
  mixins: [formMixin],
  components: {
    DataTable,
    Codemirror,
    ConfirmModel,
    VueQueryBuilder,
    QueryBuilder,
    KanverseEditor,
    VersionRelatedList
  },
  data() {
    var QueryBuilderValidator = (rule, value, callback) => {
        if(this.form.is_advanced)
            return callback();
        if(!value.children || !value.children.length){
            callback(new Error("At least one rule is required."))
            return;
        }
        let operatorsToExclude = ["is empty", "is not empty"];
        let rulesInFieldCondition = jsonpath.query(value,'$..children[?(@.type=="query-builder-rule")].query');
        if(!rulesInFieldCondition.length){
            callback(new Error("Rules not found in the provided condition."))
            return;
        }
        //check if rules have operator other than "is empty"and "is not empty" and have no value
        let rulesWithNullVal = _.filter(rulesInFieldCondition, obj => {
            return (!_.includes(operatorsToExclude, obj.operator) && (obj.value == null || obj.value == ""));
        });
        if(rulesWithNullVal.length){
            callback(new Error(`Values cannot be empty for operators other than "is empty"and "is not empty".`))
            return;
        }
        //check if rules have operator "is empty" or "is not empty" and have some value
        let rulesWithVal = _.filter(rulesInFieldCondition, obj => {
            return (_.includes(operatorsToExclude, obj.operator) && obj.value);
        });
        if(rulesWithVal.length){
            callback(new Error(`Value should not be provided for operators "is empty"and "is not empty".`))
            return;
        }
        callback();
    };
    var EmptyValueValidator = (rule, value, callback) => {
      if (value && ("" + value).trim() === "") {
        callback(new Error("Please enter valid label name"));
      } else {
        callback();
      }
    };
    var ScriptValueValidator = (rule, value, callback) => {
      console.log("valueee: ", value)
      if(!(this.form.trigger_type === 'schedule' || this.form.is_advanced))
            return callback();
      if (!value || ("" + value).trim() === "") {
        callback(new Error("Script cannot be empty"));
        return;
      }
      callback();
    };
    var EmailListValidator = (rule, value, callback) => {
      if(!(this.form.trigger_type === 'event' && this.form.is_advanced))
            return callback();
      if (!value || ("" + value).trim() === "") {
        callback(new Error("Emails cannot be empty"));
        return;
      }
      let emails = value.replace(/\s/g,'').split(",");
      let valid = true;
      let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      for (var i = 0; i < emails.length; i++) {
          if( emails[i] == "" || ! regex.test(emails[i])){
              valid = false;
              break;
          }
      }
      valid ? callback() : callback(new Error("Please provide valid emails"))
    };

    return {
      rules: [],
      emailTemplateNames:[],
      form: {
        name: "",
        document_type: "",
        email_template : "",
        trigger:"",
        trigger_type: "event",
        emails:"",
        email_subject:"",
        is_advanced: false,
        rule: {
          logicalOperator: "all",
          children: []
        },
        script: "",
        cron_expression: "",
        email_html_template: "",
        active: true
      },
      cacheDataModal: {
        cachedForm: {},
        isFormEdited: false,
        isInitialized: false,
      },
      fieldDataTypeMapping: {
        string: "text",
        date: "date",
        currency: "currency",
        dropdown: "text"
      },
      editorOptions: {
        mode: "text/javascript",
        theme: "default",
      },
      doucument_types: [],
      triggers: Constants.DOCEX.TRIGGERS_LIST,
      pageTitle: "Notification Rule",
      disableSave: false,
      showVersionList:true,
      isSaveActionAllowed:true,
      formRules: {
        script: [
        {
            validator: ScriptValueValidator,
            trigger: 'blur',
          },
          {
            validator: Validator.scriptValidator,
            trigger: 'blur',
            message: 'Syntax errors found in script.',
          }
        ],
        name: [
          {
            validator: EmptyValueValidator,
            trigger: "blur",
            message: "Please provide notification rule name",
          },
          {
            required: true,
            message: "Please provide notification rule name",
            trigger: "blur",
          },
        ],
        document_type: [
          {
            validator: EmptyValueValidator,
            trigger: "blur",
            message: "Please select document type",
          },
          {
            required: true,
            message: "Please select document type",
            trigger: "blur",
          },
        ],
        emails: [
           {
            required: true,
            validator: EmailListValidator,
            trigger: "blur"
          }
        ],
        email_subject: [
           {
            required: true,
            message: "Please enter the email subjec",
            trigger: "blur"
          }
        ],
        trigger: [
          {
            required: true,
            message: "Please select trigger",
            trigger: "blur",
          },
        ],
        rule: [
          {
            validator: QueryBuilderValidator,
            trigger: "blur"
          }
        ],
        cron_expression: [
          {
            required: true,
            message: "Please provide cron expression",
            trigger: "blur",
          },
        ],
        email_html_template: [
          {
            required: true,
            message: "Please provide email HTML template",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    form: {
      handler(newVal, oldVal) {
        if (this.cacheDataModal.isInitialized) {
          this.cacheDataModal.isFormEdited =
            JSON.stringify(this.cacheDataModal.cachedForm) !=
            JSON.stringify(this.form);
        }
      },
      deep: true,
    },
  },
  methods: {
    handleContentChange(event, content){
      this.form.script = content;  
      console.log("this.form.script: ", this.form.script );  
    },
    handleTemplateContentChange(event, content){
      this.form.email_html_template = content;
    },
    async getDocumentType(){
        const docTypeConfig = await CustomerConfig.getAllDocsCustConfiguration({document_type:{$exists:true}});
        this.doucument_types = CustomerConfig.getDocumentTypeList(docTypeConfig, true);
    },
    async setEmailTemplateNames(){
        this.emailTemplateNames = await EmailService.getEmailsTemplateNames();
    },
    onQueryChange(input){
      this.form.rule = input.val;
    },
    async prepareRulesList(documentType) {
      return true;
    },
    async init(recordId) {
      if (!recordId) {
        this.cacheDataModal.isInitialized = true;
        this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = {
          ...this.form,
        };
        return;
      }
      try {
        let data = await NotificationRuleService.fetchById(recordId);
        this.form = Object.assign({}, this.form, data);
        this.cacheDataModal.isInitialized = true;
        this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = {
          ...this.form,
        };
        await this.prepareRulesList(this.form.document_type);
      } catch (error) {
        this.notifyError("Error");
      }
    },

    registerEvents(){
      EventBus.$on("refresh-version-list", data => this.handleRefreshForm(data));
    },

    async handleRefreshForm(data = {}){
        this.showVersionList = false;
        let recordId = this.$route.query.id;
        await this.init(recordId);
        this.showVersionList = true;
    },

    async save() {
      this.disableSave = true;
      this.showVersionList = false;
      this.$setLoader({
        target: "#save-btn",
        spinner: "el-icon-loading"
       });
      let valid = await this.$refs.form.validate().catch((error) => {});
      if (!valid) {
        this.$resetLoader();
        this.disableSave = false;
        return;
      }
      return this.insertRecord();
    },
    async onDocumentTypeChange(documentType) {
      await this.prepareRulesList(documentType);
    },
    insertRecord() {
      let self = this;
      NotificationRuleService.save(this.form)
        .then((response) => {
          self.form = response.data;
          self.notifySuccess("Record saved successfully");
        })
        .catch((error) => {
          self.notifyError("Error while processing");
        }).finally(() => {
          self.$resetLoader();
          self.disableSave = false;
          self.cacheDataModal.isFormEdited = false;
          this.showVersionList = true;
        })
    },
  },
  async beforeMount() {
    this.isSaveActionAllowed = await this.isSaveActionPermitted('de_notification_rule');
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
    let recordId = this.$route.query.id;
    this.init(recordId);
    this.getDocumentType();
    this.setEmailTemplateNames();
  },
  beforeRouteLeave: function (to, from, next) {
    if (this.cacheDataModal.isFormEdited) {
      return this.$refs.model.open(next);
    } else {
      return next();
    }
  },
};
</script>

<style lang="scss">
@import "../_idpGlobal";

.kp-form-group{
  .from-name-form-tooltip{
    right: 49rem;
    position: absolute;
  }
}
</style>