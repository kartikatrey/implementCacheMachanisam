<template>
  <el-main class="kp-main">

    <ConnectionLogsDialog :isDialogVisible="isDialogVisible" @onCancelClick="isDialogVisible=false"> </ConnectionLogsDialog>

    <section class="page-body">
      <div class="page-title">
        <el-button
          cid="form-header-back"
          class="back-button"
          icon="mdi mdi-arrow-left-circle-outline"
          v-on:click="$router.push('/idp/customer-system-list')"
        >
        </el-button>
        <span class="page-title-text">Add {{ pageTitle }}</span>
      </div>

      <!-- tabs -->
      <section
        class="form-page-container tabs-page-container"
        v-loading="loading"
      >
        <div class="panel">
          <div class="panel-body">
            <el-form
              class="customer-systems-form"
              label-position="left"
              :model="form"
              :rules="formRules"
              ref="form"
              label-width="150px"
            >
              <!-- Basic -->
              <div class="tab-body">
                <div class="grouping-tile">General configuration</div>
                <el-row :gutter="40">
                  <el-col :span="12">
                    <div class="kp-form-group">
                      <el-form-item prop="master_system_id" label="System">
                        <el-select
                          clearable
                          cid="cust-system-form-systems-select"
                          v-model="form.master_system_id"
                          placeholder="Select"
                        >
                          <el-option
                            v-for="(system, index) in masterSystemList"
                            :label="system.label"
                            :system_name="system.system_name"
                            :cid="'cust-system-form-systems_' + index"
                            v-bind:value="system._id"
                            :key="system._id"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </el-col>

                  <el-col :span="12">
                    <div class="kp-form-group">
                      <el-form-item prop="host" label="Host name">
                        <el-input
                          cid="cust-system-form-host"
                          name="host"
                          v-model="form.host"
                          type="input"
                          :rows="2"
                          placeholder="E.g. jadeglobalchat-dev-ed.my.salesforce.com"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>
                <!--Password expiration days  -->
              <el-row :gutter="40">
                    <el-col :span="12">
                        <div class="kp-form-group">
                          <el-form-item  prop="password_expiration_duration" label="Password expiration days">
                                <el-input cid="system-form-password-expiration-duration" type="number" :min="0" v-model.number="form.password_expiration_duration" placeholder="Days"></el-input>
                          </el-form-item>
                        </div>
                    </el-col>
              </el-row> 
                <el-row :gutter="40">
                  <el-col :span="12">
                    <div class="kp-form-group">
                      <el-form-item prop="auth_type" label="Auth type">
                        <el-select
                          clearable
                          cid="cust-system-form-auth-type-select"
                          v-model="form.auth_type"
                          placeholder="Select"
                          @change="setOauthVersion()"
                        >
                          <el-option
                            v-for="(authtype, index) in authTypes"
                            :cid="'cust-system-form-auth-type_' + index"
                            v-bind:value="authtype.value"
                            :label="authtype.label"
                            v-bind:key="authtype.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div
                      class="kp-form-group"
                      v-if="form.auth_type.toLowerCase() == OAUTH2"
                    >
                      <el-form-item prop="grant_type" label="Grant Type">
                        <el-select
                          clearable
                          cid="cust-system-form-grant-type-select"
                          v-model="form.grant_type"
                          placeholder="Select"
                        >
                          <el-option
                            v-for="(grantType, index) in grantTypes"
                            :cid="'cust-system-form-auth-type_' + index"
                            v-bind:value="grantType.value"
                            :label="grantType.label"
                            v-bind:key="grantType.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div
                      class="kp-form-group"
                      v-if="form.auth_type.toLowerCase() == 'api_key'"
                    >
                      <el-form-item prop="password" label="Key">
                        <el-input
                          cid="cust-system-form-password"
                          v-model="form.password"
                          :value="form.password"
                          type="password"
                          :rows="2"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>

                <el-row
                  :gutter="40"
                  v-if="form.auth_type.toLowerCase() == BASIC || form.auth_type.toLowerCase() == 'bearer_token_username_password'"
                >
                  <el-col :span="12">
                    <div class="kp-form-group">
                      <el-form-item prop="user_name" label="User name">
                        <el-input
                          v-model="form.user_name"
                          type="input"
                          cid="cust-system-form-user-name"
                          :rows="2"
                          placeholder="E.g. kanverse"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="kp-form-group">
                      <el-form-item prop="password" label="Password">
                        <el-input
                          cid="cust-system-form-password"
                          v-model="form.password"
                          :value="form.password"
                          type="password"
                          :rows="2"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>

                <el-row
                  :gutter="40"
                  v-if="form.auth_type.toLowerCase() == 'basic'"
                >
                  <el-col :span="12">
                    <div class="kp-form-group">
                      <el-form-item prop="api_version" label="Api version">
                        <el-input
                          cid="cust-system-form-api-version"
                          v-model="form.api_version"
                          type="input"
                          :rows="2"
                          placeholder="E.g. kanverse"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>
                <div style="display: none" v-show="form.auth_type.toLowerCase() == 'oauth2'">
                  <el-row :gutter="40">
                    <el-col :span="12">
                      <div class="kp-form-group">
                        <el-form-item prop="client_id" label="Client id">
                          <el-input
                            v-model="form.client_id"
                            placeholder="E.g. ec35e1706f883300167f93326c3d8afb"
                          >
                          </el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="kp-form-group">
                        <el-form-item label="Secret key" prop="secret_key">
                          <el-input
                            v-model="form.secret_key"
                            placeholder="E.g. kanverse"
                            type="password"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="kp-form-group"
                      v-if="form.grant_type.toLowerCase() == AUTHORIZATION_CODE">
                        <el-form-item label="Callback Url" prop="callback_url">
                          <el-input
                            v-model="form.callback_url"
                            placeholder="E.g. http://localhost:8080/"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="kp-form-group"
                      v-if="form.grant_type.toLowerCase() == AUTHORIZATION_CODE">
                        <el-form-item
                          label="Auth code host"
                          prop="auth_code_host"
                        >
                          <el-input
                            v-model="form.auth_code_host"
                            placeholder="E.g. https://oauth.kannverse.com"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="kp-form-group">
                        <el-form-item label="Token host" prop="auth_token_host">
                          <el-input
                            v-model="form.auth_token_host"
                            placeholder="E.g. https://oauth.kannverse.com"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <div style="display: none" v-show="form.auth_type.toLowerCase() == 'bearer_token'">
                  <el-row :gutter="40">
                    <el-col :span="12">
                      <div class="kp-form-group">
                        <el-form-item prop="consumer_key" label="Consumer Key">
                          <el-input
                            v-model="form.consumer_key"
                            placeholder="E.g. ec35e1706f883300145667f93326c3d8afb"
                          >
                          </el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="kp-form-group">
                        <el-form-item prop="token" label="Token">
                          <el-input
                            v-model="form.token"
                            placeholder="E.g. 0khft4706f883300145667f93326c3d8afb"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="kp-form-group">
                        <el-form-item prop="consumer_secret" label="Consumer Secret">
                          <el-input
                            v-model="form.consumer_secret"
                            placeholder="E.g. b648dcdd7a36a849483eb9b8aa0a87cac40"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="kp-form-group">
                        <el-form-item label="Token Secret" prop="token_secret">
                          <el-input
                            v-model="form.token_secret"
                            placeholder="E.g. b648dcdd7a360po756343eb9b8aa0a87cac40"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <el-row>
                    <el-col :span="12">
                      <div class="kp-form-group">
                        <el-form-item prop="wsdl_url" label="Wsdl url">
                          <el-input
                            cid="cust-system-form-wsdl_url"
                            name="wsdl_url"
                            v-model="form.wsdl_url"
                            type="input"
                            :rows="2"
                            placeholder="http://example.com/your-service.wsdl"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                </el-row>
                <el-row :gutter="40">
                  <el-col :span="24">
                    <div class="kp-form-group">
                      <el-form-item
                        prop="request_header"
                        label="Request header"
                      >
                        <!-- <codemirror
                          cid="cust-system-form-request-header"
                          :value="form.request_header"
                          v-model="form.request_header"
                          :options="editorOptions"
                        ></codemirror> -->
                        <KanverseEditor
                          :options="{ 'width': '100%', 'height': '500px', 'language': 'businessRule' }"
                          :content="form.request_header"
                          :refreshModel="form._id !== undefined"
                          :language="'json'"
                          v-model="form.request_header"
                          @onDidChangeModelContent="handleRequestHeaderChange">
                        </KanverseEditor>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="40">
                  <el-col :span="24">
                    <div class="kp-form-group">
                      <el-form-item
                        prop="options"
                        label="Options"
                      >
                        <!-- <codemirror
                          cid="cust-system-form-request-header"
                          :value="form.options"
                          v-model="form.options"
                          :options="editorOptions"
                        ></codemirror> -->
                        <KanverseEditor
                          :options="{ 'width': '100%', 'height': '500px', 'language': 'businessRule' }"
                          :content="form.options"
                          :refreshModel="form._id !== undefined"
                          :language="'json'"
                          v-model="form.options"
                          @onDidChangeModelContent="handleOptionsChange">
                        </KanverseEditor>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-form>
          </div>
          <!-- | panel body -->
          <footer>
            <div>
              <div v-if="!isFormValid" class="kp-form-error">
                * Please check field with errors
              </div>
            </div>
            <div v-if="this.$route.query.id">
              <TestConnectionButton :recordId="this.$route.query.id" :connectionType="'system'" @testConnectionRequested="isDialogVisible=true"></TestConnectionButton>
            </div>
            <div>
              <el-button
                v-on:click="$router.push('/idp/customer-system-list')"
                name="cancel"
                size="small"
                cid="cust-system-form-cancel"
              >
                Cancel</el-button
              >
            </div>
            <div>
              <el-button
                cid="cust-system-form-save"
                v-on:click="onSave"
                name="save"
                type="primary"
                size="small"
              >
                Save</el-button
              >
            </div>

            <div>
              <el-button
                cid="cust-system-form-login"
                v-on:click="onLogin"
                name="login"
                type="primary"
                size="small"
              >
                Login</el-button
              >
            </div>
          </footer>
        </div>
        <!-- | panel -->
      </section>
      <!-- | form-page-container -->
    </section>
    <VersionRelatedList
      v-if="showVersionList"
      :id="form._id"
      title="Systems versions"
    ></VersionRelatedList>
  </el-main>
</template>



<script>
import SystemService from "@/services/SystemService";

import Constants from "@/resources/Constants";
import EventBus from "@/EventBus";
import _ from "lodash";
import Json from "@/util/Json";
import { Loading } from "element-ui";

import DataTable from "@/components/DataTable.vue";
import Codemirror from "@/components/Codemirror";
import VersionRelatedList from "@/idp/components/VersionRelatedList.vue";
import TestConnectionButton from "@/idp/components/TestConnectionButton.vue";
import ConnectionLogsDialog from "@/idp/components/ConnectionLogsDialog.vue";
import KanverseEditor from "@/components/KanverseEditor";
import Validator from "@/services/Validator";

export default {
  name: "CustomerSystemsForm",
  components: {
    DataTable,
    Codemirror,
    KanverseEditor,
    Loading,
    VersionRelatedList,
    TestConnectionButton,
    ConnectionLogsDialog
  },
  computed: {},
  data() {
    return {
      showVersionList: true,
      activeTab: "basic",
      isDialogVisible: false,
      masterSystemList: [],
      authTypes: Constants.AUTH_TYPES_LIST,
      grantTypes : Constants.GRANT_TYPES_LIST,
      OAUTH2 : Constants.AUTH_TYPE_MAP.OAUTH2,
      BASIC : Constants.AUTH_TYPE_MAP.BASIC,
      AUTHORIZATION_CODE : Constants.GRANT_TYPE_MAP.AUTHORIZATION_CODE,
      form: {
        master_system_id: "",
        host: "",
        domain: "",
        auth_type: "",
        user_name: "",
        api_version: "",
        request_header: "{}",
        password: "",
        system_name: "",
        grant_type : "",
        label: "",
        options:  "{}",
        wsdl_url : "",
        old_password: ""
      },
      formRules: {
        request_header: [
          {
            validator: this.validateJson,
            trigger: "blur",
            message: "Please provide valid request header",
          },
        ],
        options: [
          {
            validator: this.validateJson,
            trigger: "blur",
            message: "Please provide valid options",
          },
        ],
        master_system_id: [
          {
            required: true,
            message: "Please select master system id",
            trigger: "blur",
          },
        ],
        host: [
          {
            required: true,
            message: "Please enter host",
            trigger: "blur",
          },
        ],
        domain: [
          {
            required: true,
            message: "Please enter domain",
            trigger: "blur",
          },
        ],
        auth_type: [
          {
            required: true,
            message: "Please select auth type",
            trigger: "blur",
          },
        ],
        user_name: [
          {
            required: true,
            message: "Please enter user name",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "Please enter Password",
            trigger: "blur",
          },
        ],
        api_version: [
          {
            required: false,
            message: "Please enter api version",
            trigger: "blur",
          },
        ],
        consumer_key: [
          {
            validator: this.validateAuthAttributes,
            message: "Please enter consumer key",
            trigger: "change",
            required: true,
          }
        ],
        token: [
          {
            validator: this.validateAuthAttributes,
            message: "Please enter token",
            trigger: "blur",
            required: true,
          }
        ],
        consumer_secret: [
        {
            validator: this.validateAuthAttributes,
            message: "Please enter consumer secret",
            trigger: "blur",
            required: true,
          },
        ],
        token_secret: [
        {
            validator: this.validateAuthAttributes,
            message: "Please enter token secret",
            trigger: "blur",
            required: true,
          },
        ],
        password_expiration_duration:[
        {
            validator: this.handlePwdExpDays,
            message: "Please enter valid duration",
            trigger: "blur",
            required: false,
          },
        ],
        // callback_url: [
        //   {
        //     validator: this.validateAuthAttributes,
        //     trigger: "change",
        //     required: true,
        //   },
        // ],
        // secret_key: [
        //   {
        //     validator: this.validateAuthAttributes,
        //     trigger: "change",
        //     required: true,
        //   },
        // ],

        // endpoint: [
        //   {
        //     validator: this.validateAuthAttributes,
        //     trigger: "change",
        //   },
        // ],
        api_key: [
          {
            validator: this.validateAuthAttributes,
            trigger: "change",
          },
        ],
        // login_headers: [
        //   {
        //     validator: this.validateJson,
        //     required: false,
        //     trigger: "change",
        //   },
        // ],
      },
      editorOptions: {
        mode: "text/javascript",
        theme: "default",
      },
      isFormValid: true,

      pageTitle: "System",
      loading: false,
    };
  },
  methods: {
    populateMasterSystmList() {
      let columnList = ["_id", "label", "system_name"];
      SystemService.fetchMasterSystems({ active: true }, columnList)
        .then((res) => {
          this.masterSystemList = res;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleRequestHeaderChange(event, content){
      this.form.request_header = content;
    },
    handleOptionsChange(event, content){
      this.form.options = content;
    },
    validateAuthAttributes(rule, value, callback) {
      let authType = this.form.auth_type;
      if (authType) {
        let authAttributes = _.find(this.authTypes, ["value", authType]);
        if (
          _.includes(authAttributes["requiredAttributes"], rule.field) &&
          _.isEmpty(value)
        ) {
          callback(new Error(`Please enter ${rule.field}`));
          return;
        }
        callback();
        return;
      }
      callback();
    },
    setOauthVersion() {
      this.form.oauth_version = _.find(this.authTypes, [
        "value",
        this.form.auth_type,
      ]).oauth_version;
    },
    validateJson(rule, value, callback) {
      if (!rule.required) if (!value) return callback();
      Json.isJson(value)
        ? callback()
        : callback(new Error("Please input correct JSON format"));
    },
    // checking pssword expiredays field value
    handlePwdExpDays(rule, value, callback) {
        // Check if the entered value is negative
        if (value < 0) {
            callback(new Error("Please enter a positive number"));     
        } else {
            callback();
        }
    },

    async onSave() {
      let isValid = await this.$refs.form.validate().catch((error) => {});

      this.isFormValid = isValid;
      if (!isValid) {
        return;
      }

      try {
        this.loading = true;
        this.masterSystemList.forEach((masterSystem) => {
          if (masterSystem["_id"] == this.form["master_system_id"]) {
            this.form["system_name"] = masterSystem["system_name"]
            this.form["label"] = masterSystem["label"] ||  masterSystem["system_name"]
          }
        });
        let response = await SystemService.saveCustomerSystem(this.form);
        this.loading = false;
        if (_.get(response, "_id")) {
          this.notifySuccess("Record saved successfully.");
          this.$router.push("/idp/customer-system-list");
        }
      } catch (e) {
        console.log(e);
        this.loader = false;
        this.notifyError("There is an error in saving data.");
      }
    },
    async onLogin() {
      let isValid = await this.$refs.form.validate().catch((error) => {});
      this.isFormValid = isValid;
      if (!isValid) {
        return;
      }
      try {
        let systemName= this.form.system_name
        let popup = window.open('/cust/oauth/login-url?system_name='+systemName, 'login', 'height=450,width=600');
        if (window.focus) {
            popup.focus();
        }
      } catch (e) {
        console.error(e);
        this.loader = false;
        this.notifyError("There is an error while login.");
      }
    },
    async init(recordId) {
      // check record id
      if (!recordId) {
        return;
      }
      try {
        let excludeColumns = [
          "-updated_at",
          "-updated_by",
          "-created_by",
          "-created_at",
        ];
        let cusromerSystem = await SystemService.fetchCustomerSystemById(
          recordId,
          excludeColumns
        );
        this.form = Object.assign({}, this.form, cusromerSystem);
        //  Assigning the value of the current password to 'old_password' key to track updates-
        //  in basic authentication type within hooks
        this.form.old_password = this.form.password;
    }
      catch (error) {
        this.notifyError("Error");
      }
    },
    handleClick(tab, event) {},
  },
  beforeMount() {
    this.$store.commit("setDisplayIdpTree", false);
    this.$store.commit("setDisplayIdpNavbar", true);
    this.populateMasterSystmList();

    let recordId = this.$route.query.id;
    if (recordId) this.init(recordId);
  },
};
</script>



<style lang="scss">
@import "../_idpGlobal.scss";
</style>