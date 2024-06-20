<template>
  <el-main id="container">
    <div class="kp-back-to-parent">
        <el-button class="kp-btn-back" icon="el-icon-back" v-on:click="displayList"></el-button>
        <h1 class="kp-page-title">{{pageTitle}}</h1>
    </div>
       <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/customer-system-list' }">Customer systems</el-breadcrumb-item>
        <el-breadcrumb-item>{{pageTitle}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :model="form" :rules="formRules" ref="form" :label-position="labelPosition" label-width="100px">
      <ConfirmModel ref="model"></ConfirmModel>
      <div class="kp-form-area kp-tabs">
          <el-tabs class="kp-form-tabs-panel" type="card"  v-model="tabIndex">
            <el-tab-pane class="kp-tabs-body" label="Basic">
              <el-row>
                <el-col>
                  <el-row :gutter="180">
                    <el-col :span="8">
                      <div class="kp-form-input-1 kp-form-field">
                        <el-form-item class="kp-form-field-label" prop="master_system_id" label="System">
                        <el-select clearable v-model="form.master_system_id" placeholder="Select">
                          <el-option
                            v-for="system in masterSystemList"
                            :label="system.system_name"
                            v-bind:value="system._id"
                            :key="system._id"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="kp-form-input-1 kp-form-field">
                         <el-form-item class="kp-form-field-label" prop="host" label="Host name">
                              <el-input
                                v-model="form.host"
                                placeholder="E.g. jadeglobalchat-dev-ed.my.salesforce.com"
                              ></el-input>
                          </el-form-item>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="180">
                    <el-col :span="8">
                      <div class="kp-form-input-1 kp-form-field">
                            <el-form-item class="kp-form-field-label" prop="url" label="Login URL">
                              <el-input v-model="form.url" placeholder="E.g. https://www.salesforce.com/login"></el-input>
                          </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="kp-form-input-1 kp-form-field">
                         <el-form-item class="kp-form-field-label" prop="domain" label="Domain URL">
                          <el-input v-model="form.domain" placeholder="E.g. ERP-JOSS"></el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="180">
                    <el-col :span="8">
                      <div class="kp-form-input-1 kp-form-field">
                        <el-form-item class="kp-form-field-label" prop="threshold" label="Threshold">
                          <el-input v-model="form.threshold" type="number" min="0" placeholder="E.g. 12"></el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="Auth">
              <el-row>
                <el-col>
                  <el-row :gutter="180">
                    <el-col :span="8">
                      <div class="kp-form-input-1 kp-form-field">
                        <el-form-item class="kp-form-field-label" prop="auth_type" label="Auth type">
                        <el-select clearable v-model="form.auth_type" placeholder="Select" @change="setOauthVersion()">
                        <el-option
                        v-for="authtype in authTypes"
                        v-bind:value="authtype.value"
                        :label="authtype.label"
                        v-bind:key="authtype.value"
                      ></el-option>
                    </el-select>
                    </el-form-item>
                     </div>
                    </el-col>
                   </el-row>
               <div style="display:none;" v-show="form.auth_type =='oauth1' || form.auth_type =='oauth2'">
                    <el-row :gutter="180">
                    <el-col :span="8">
                      <div class="kp-form-input-1 kp-form-field">
                       <el-form-item class="kp-form-field-label" prop="consumer_key" label="Consumer Key">
                        <el-input
                        v-model="form.consumer_key"
                        placeholder="E.g. ec35e1706f883300167f93326c3d8afb">
                        </el-input>
                    </el-form-item>
                    </div>
                   </el-col>
                   <el-col :span="8">
                    <div class="kp-form-input-1 kp-form-field">
                    <el-form-item class="kp-form-field-label" label="Secret key" prop="secret_key">
                      <el-input v-model="form.secret_key" placeholder="E.g. kanverse"></el-input>
                    </el-form-item>
                     </div>
                </el-col>
                <el-col :span="8">
                  <div class="kp-form-input-1 kp-form-field">
                  <el-form-item class="kp-form-field-label" label="Callback URL" prop="callback_url">
                    <el-input
                      v-model="form.callback_url"
                      placeholder="E.g. http://localhost:8080/SNOW/oauthLoader"
                    ></el-input>
                  </el-form-item>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="kp-form-input-1 kp-form-field">
                   <el-form-item class="kp-form-field-label" label="Auth Code Endpoint" prop="auth_code_endpoint">
                      <el-input v-model="form.auth_code_endpoint" placeholder="E.g. /oauth_auth.do"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="8">
                   <div class="kp-form-input-1 kp-form-field">
                   <el-form-item class="kp-form-field-label" label="Auth Token Eendpoint" prop="auth_token_endpoint">
                      <el-input v-model="form.auth_token_endpoint" placeholder="E.g. /oauth_auth.do"></el-input>
                    </el-form-item>
                   </div>
                </el-col>
              </el-row>
              </div>
              <div v-show="form.auth_type =='oauth1'">
                <el-row :gutter="180">
                  <el-col :span="8">
                    <div class="kp-form-input-1 kp-form-field">
                    <el-form-item class="kp-form-field-label" label="Signature Method" prop="signature_method" >
                      <el-input v-model="form.signature_method" placeholder="E.g. RSA-SHA1"></el-input>
                    </el-form-item>
                    </div>
                  </el-col>

                  <el-col :span="8">
                    <div class="kp-form-input-1 kp-form-field">
                    <el-form-item class="kp-form-field-label" label="Auth Request Token Endpoint" prop="auth_request_token_endpoint">
                      <el-input
                        v-model="form.auth_request_token_endpoint"
                        placeholder="E.g. /plugins/servlet/oauth/request-token"
                      ></el-input>
                    </el-form-item>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <el-row :gutter="180">
                <el-col :span="8">
                  <!-- api key authentication parameters -->
                  <div class="kp-form-input-1 kp-form-field" v-show="form.auth_type =='api_key'">
                    <el-form-item class="kp-form-field-label" prop="api_key" label="Api Key">
                      <el-input v-model="form.api_key" placeholder="E.g. 44D976E71DE96697F3A8D523B6492"></el-input>
                    </el-form-item>
                  <!-- end api key authentication parameters -->
                  </div>
                </el-col>
              </el-row>
               <el-row :gutter="180">
                 <el-col :span="8">
                    <!-- basic authentication parameters -->
                    <div class="kp-form-input-1 kp-form-field" v-show="form.auth_type =='basic'">
                    <el-form-item class="kp-form-field-label" label="Endpoint" prop="endpoint" >
                      <el-input
                        v-model="form.endpoint"
                        placeholder="E.g. /plugins/servlet/oauth/request-token"
                      ></el-input>
                    </el-form-item>
                    <!--end basic authentication parameters -->
                    </div>
                </el-col>
                </el-row>
                <el-row :gutter="180">
                 <el-col :span="8">
                   <div class="kp-form-input-1 kp-form-field">
                   <el-form-item class="kp-form-field-label" label="System API Key" >
                    <el-input v-model="form.system_api_key" placeholder="E.g. Y2XNKNijJKNKJKNKJNKKIIjn"></el-input>
                  </el-form-item>
                   </div>
                </el-col>
                </el-row>
               <el-row :gutter="180">
                 <el-col :span="24">
                    <div class="kp-form-input-1 kp-form-field">
                    <el-form-item prop="login_headers" class="request_header mb-10" label="Login Header">
                    <codemirror v-model="form.login_headers" :value="form.login_headers"></codemirror>
                  </el-form-item>
                    </div>
                </el-col>
               </el-row>
                 <el-col :span="8">
                   <el-checkbox class="kp-form-field-checkbox1" v-model="form.login_hint">Login Hint</el-checkbox>
                 </el-col>
                </el-col>
              </el-row>
            </el-tab-pane>

          <el-tab-pane label="Headers">
              <el-row>
                <el-col>
                  <el-row :gutter="180">
                    <el-col :span="24">
                      <div class="kp-form-input-1 kp-form-field">
                        <el-form-item class="kp-form-field-label" label="Request Header" prop="request_header"></el-form-item>
                        <codemirror v-model="form.request_header" :value="form.request_header" :options="editorOptions">
                        </codemirror>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-tab-pane>  

 <!-- Tag field start -->
            <el-tab-pane label="Tag Field Mapping">
         <!-- <el-row>
                <el-col> -->
                  <el-row :gutter="180">
                    <el-col :span="8">
                    <div class="kp-form-input-1 kp-form-field">
                    <el-row :gutter="72">
                      <el-col :span="24">
                        <el-input class="kp-form-field-label" ref="newObject" v-model.trim="newObjectName"  placeholder="E.g. INCIDENT"></el-input>
                        <p ref="newObjectError" class='error-msg'></p>
                      </el-col>
                      <el-col :span="10">
                        <el-button class="kp-btn-primary" type="primary" v-on:click="addObject">
                        <i class="el-icon-plus"></i> Add Object
                        </el-button>
                        <!-- <el-button class="btn-addtag" type="primary" size="small" v-on:click="addObject">+ ADD OBJECT</el-button> -->
                      </el-col>
                      </el-row>
                           </div>
                       </el-col>
                    </el-row>
                    <el-row :gutter="180">
                      <el-col :span="22">
                          <field-tag-mapping-card
                          ref="mappingCard"
                          v-for="(objectMapping, index) in fieldTagObjectMapping"
                          :objectMapping="objectMapping"
                          :fieldTagObjectMapping="fieldTagObjectMapping"
                          :key="index"
                          :objectIndex="index"
                          @deleteObjectMapping="deleteObjectMapping"
                          @addErrorFields="addErrorFields"
                          @removeErrorFields = "removeErrorFields">
                          </field-tag-mapping-card>
                    </el-col>
              </el-row>
            </el-tab-pane>

 <!-- Tag field end -->

            <el-tab-pane label="Web Chat Enable Config">
              <el-row>
                <el-col>
                  <el-row :gutter="180">
                    <el-col :span="8">
                      <div class="kp-form-input-1 kp-form-field">
                        <el-checkbox
                          class="webchat-chekboxupdate kp-form-field-checkbox1"
                          v-model="enableWebchatValidation"
                          @change="onEnableWebchatValidation()"
                        >Enable webchat validation config</el-checkbox>
                      </div>
                    </el-col>
                  </el-row>
                  <div v-if="enableWebchatValidation" :gutter="10">
                      <el-row :gutter="180">
                        <el-col :span="8">
                         <div class="kp-form-input-1 kp-form-field">
                            <el-form-item class="kp-form-field-label" label="URL">
                              <el-input v-model="form.web_chat_conf.validation_url" placeholder="E.g. json"></el-input>
                            </el-form-item>
                         </div>
                          </el-col>

                         <el-col :span="8">
                           <div class="kp-form-input-1 kp-form-field">
                            <el-form-item class="kp-form-field-label" label="Parameters">
                              <el-input v-model="form.web_chat_conf.validation_params" placeholder="E.g. json"></el-input>
                            </el-form-item>
                           </div>
                          </el-col>
                      </el-row>
                      <el-row :gutter="180">
                          <el-col :span="8">
                            <div class="kp-form-input-1 kp-form-field">
                            <el-form-item class="kp-form-field-label" label="Action">
                              <el-input v-model="form.web_chat_conf.validation_action" placeholder="E.g. json"></el-input>
                            </el-form-item>
                            </div>
                          </el-col>
                         </el-row>
                          <el-row :gutter="180">
                          <el-col :span="24">
                            <div class="kp-form-input-1 kp-form-field">
                            <el-form-item
                              class="request_header kp-form-field-label"
                              prop="web_chat_conf.validation_headers"
                              label="Headers">
                            <codemirror v-model="form.web_chat_conf.validation_headers"></codemirror>
                            </el-form-item>
                            </div>
                          </el-col>
                        </el-row>
                        </div>
                       <!-- / web chat enable config -->
                        </el-col>
                    </el-row>
               </el-tab-pane>
          </el-tabs>
        </div>
       <!-- sticky button -->

       <el-button class="kp-btn-form-disabled" id="btPrev" @click="prevButton">Previous</el-button>
          <el-button class="kp-btn-form-outline" id="btNext" @click="nextButton">Next</el-button>

          <el-button v-if="isSaveActionAllowed" class="kp-btn-form-primary" v-on:click="save" :key="buttonKey" type="primary">
           Save</el-button>
           <el-button v-on:click="displayList" class="kp-btn-form-outline">Cancel</el-button>
           <div  v-if="!isFormValid" class="kp-form-error">
            * Please check field with errors
           </div>
    </el-form>
  </el-main>
</template>

<script>
import FieldTagMappingCard from "@/views/pages/FieldTagMappingCard.vue";
import _ from "lodash";
import Codemirror from "../../components/Codemirror.vue";
import SystemService from "@/services/SystemService";
import constants from "@/resources/Constants";
import ConfirmModel from "@/components/ConfirmModel";
import Json from "@/util/Json";
import formMixin from "@/mixins/formMixin.js";

export default {
  name: "CustomerSystemForm",
  mixins: [formMixin],
  components: {
    FieldTagMappingCard,
    Codemirror,
    ConfirmModel
  },
  data() {
    return {
      form: {},
      fieldTagObjectMapping: [],
      pageTitle: "",
      tabIndex: 0,
      errorFlag: 0,
      masterSystemList: [],
      enableWebchatValidation: "",
      errorFields: [],
      newObjectName: "",
      buttonKey: 1,
      cacheDataModal: {
        cachedForm: {},
        isFormEdited: false,
        isEditForm: false,
        isNewForm: false,
        watcherAlreadyCalled: true
      },
      isFormValid: true,
      isSaveActionAllowed: true,
      labelPosition: "top",
      formRules: {
        master_system_id: [
          {
            required: true,
            message: "Please select system",
            trigger: "change"
          }
        ],
        host: [
          {
            required: true,
            message: "Please enter host",
            trigger: "change"
          }
        ],
        url: [
          {
            required: true,
            message: "Please enter login url",
            trigger: "change"
          }
        ],
        domain: [
          {
            required: true,
            message: "Please enter domain",
            trigger: "change"
          }
        ],
      threshold: [{
            // required: true,
            pattern: /^0*([0-9]|[1-8][0-9]|9[0-9]|100)$/,
            message: "Enter threshold between 0 and 100",
            trigger: "blur"
        }],
        consumer_key: [
          {
            validator: this.validateAuthAttributes,
            trigger: "change",
            required: true
          }
        ],
        callback_url: [
          {
            validator: this.validateAuthAttributes,
            trigger: "change",
            required: true
          }
        ],

        auth_request_token_endpoint: [
          {
            validator: this.validateAuthAttributes,
            trigger: "change",
            required: true
          }
        ],

        auth_code_endpoint: [
          {
            validator: this.validateAuthAttributes,
            trigger: "change",
            required: true
          }
        ],

        auth_token_endpoint: [
          {
            validator: this.validateAuthAttributes,
            trigger: "change",
            required: true
          }
        ],

        secret_key: [
          {
            validator: this.validateAuthAttributes,
            trigger: "change",
            required: true
          }
        ],

        endpoint: [
          {
            validator: this.validateAuthAttributes,
            trigger: "change"
          }
        ],
        api_key: [
          {
            validator: this.validateAuthAttributes,
            trigger: "change"
          }
        ],
        auth_type: [
          {
            required: true,
            message: "Please select auth type",
            trigger: "change"
          }
        ],
        request_header: [
          {
            validator: this.validateJson,
            required: true,
            trigger: "change"
          }
        ],
        login_headers: [
          {
            validator: this.validateJson,
            required: true,
            trigger: "change"
          }
        ]
      },

      authTypes: constants.AUTH_TYPES
    };
  },
  watch: {
    form: {
      handler(newVal, oldVal) {
        if (this.cacheDataModal.isNewForm || this.cacheDataModal.isEditForm) {
          // if (this.cacheDataModal.cachedForm == null) {
          //   this.cacheDataModal.isFormEdited = false;
          //   this.cacheDataModal.cachedForm = { ...this.form };
          //   // this.cacheDataModal.cachedForm.system_domain = `${this.cacheDataModal.cachedForm.domain}-${this.cacheDataModal.cachedForm.system_name}`;
          // } else {
            
          // }

          this.cacheDataModal.isFormEdited =
              JSON.stringify(this.cacheDataModal.cachedForm) !=
              JSON.stringify(this.form);
        }
      },
      deep: true
    }
  },
  methods: {
    addErrorFields(fieldIndex) {
      this.errorFields = _.uniq(_.concat(this.errorFields, fieldIndex));
    },

    removeErrorFields(fieldsToRemove) {
      this.errorFields = _.filter(this.errorFields, errorField => {
        return !_.startsWith(errorField, fieldsToRemove);
      });
    },

    validateJson(rule, value, callback) {
      Json.isJson(value)
        ? callback()
        : callback(new Error("Please input correct JSON format"));
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
    addObject() {
      let error = this.validateObjectName();
      if (error) {
        this.addErrorForObject(error);
        return;
      }
      this.removeErrorForMessage();
      this.fieldTagObjectMapping.unshift({
        objectName: this.newObjectName,
        tagFieldMapping: [{}]
      });
      this.newObjectName = "";
      this.addDefaultErrorForTagFieldMapping();
    },

    addDefaultErrorForTagFieldMapping() {
      let rowIndex = this.fieldTagObjectMapping.length - 1;
      let tagIndex = `${rowIndex}_0_tag`;
      let fieldIndex = `${rowIndex}_0_field`;
      this.errorFields.push(tagIndex, fieldIndex);
    },
    addErrorForObject(error) {
      this.$refs["newObjectError"].innerText = error;
      this.$refs["newObject"]["$el"].classList.add("error-border");
    },

    removeErrorForMessage() {
      this.$refs["newObjectError"].innerText = "";
      this.$refs["newObject"]["$el"].classList.remove("error-border");
    },

    validateObjectName() {
      let error;
      if (!_.isEmpty(this.newObjectName)) {
        if (
          _.countBy(
            _.map(this.fieldTagObjectMapping, fieldTagObject => {
              return fieldTagObject.objectName.toUpperCase();
            })
          )[this.newObjectName.toUpperCase()] > 0
        )
          error = "Object name already exist";
      } else {
        error = "Object name can not be empty";
      }
      return error;
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          this.isFormValid = valid;
          if (!valid) {
            return;
          }
          if (!_.isEmpty(this.errorFields)) {
            return reject("Please validate Field tag mapping");
          }
          let isObjectModified = this.isObjectModified();
          if (isObjectModified) {
            return reject("Please save the modified object");
          }
          resolve();
        });
      });
    },

    prevButton() {
      //  console.log(document.getElementById("tab-1"));

      // var tab = document.getElementById("tab-"+this.tabIndex);
      var bt = document.getElementById("btPrev");
      if (this.tabIndex == 0) {
        bt.disabled = true;
        return;
      }
      this.tabIndex--;
      // debugger;

      if (this.tabIndex >= 0) {
        //  this.tabIndex--;
        //  document.getElementById(tab).click();
        bt.disabled = false;
        document.getElementById("tab-" + this.tabIndex).click();
        var nextBtn = document.getElementById("btNext");

        nextBtn.disabled = false;
      } else {
        bt.disabled = true;
      }
    },
    nextButton() {
      var index = this.tabIndex;
      var bt = document.getElementById("btNext");
      // var tab = document.getElementById("tab-"+this.tabIndex);
      index++;
      if (document.getElementById("tab-" + index) == null) {
        bt.disabled = true;
        return;
      }
      this.tabIndex++;
      //  debugger;

      if (document.getElementById("tab-" + this.tabIndex) != null) {
        bt.disabled = false;
        document.getElementById("tab-" + this.tabIndex).click();
        var preBtn = document.getElementById("btPrev");
        preBtn.disabled = false;
      } else {
        bt.disabled = true;
      }
    },

    async save() {
      // this.isFormValid = valid;
      try {
        await this.validate();

        this.transformToDBStructure();
        this.cacheDataModal.isFormEdited = false;
        let response = SystemService.saveCustomerSystem(this.form);
        this.form._id = response._id;
        this.notifySuccess("record saved successfully");
        this.$router.push({ path: "/customer-system-list" });

        this.buttonKey++;
      } catch (err) {
        this.isFormValid = false;
        let errorMessage=_.isString(err)?err:"There is an error in saving customer system data"
        this.notifyError(errorMessage);
      }
    },

    deleteObjectMapping(objectMapping, objectIndex) {
      this.fieldTagObjectMapping.splice(objectIndex, 1);
      this.removeErrorFields(objectIndex);
    },

    displayList() {
      this.$router.push({ path: "/customer-system-list" });
    },
    onEnableWebchatValidation() {
      this.$set(this.form, "web_chat_conf", null);
      if (this.enableWebchatValidation) {
        this.$set(this.form, "web_chat_conf", {});
      }
    },
    setOauthVersion() {
      this.form.oauth_version = _.find(this.authTypes, [
        "value",
        this.form.auth_type
      ]).oauth_version;
    },

    handleResponse(response) {
      this.form = _.defaultsDeep(response, this.form);
      this.cacheDataModal.isEditForm = true;
        this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = { ...this.form };
      this.fieldTagObjectMapping = this.transformToRenderingStructure(
        response.field_tag_mapping
      );
      this.enableWebchatValidation = !_.isEmpty(response.web_chat_conf);
      this.pageTitle = "Edit customer system";
    },

    transformToRenderingStructure(fieldTagMapping) {
      /*
                  SAMPLE INPUT: fieldTagMapping
                    "OPPORTUNITY" : {                         //objectName
                        "I-SELF" : {                          //Tag
                            "column" : "Owner.Id",            //Field
                            "operator" : "="
                        },
                        "I-LOB" : {
                            "column" : "Primary_LOB__c",
                            "operator" : "like"
                        }
                    }
                  
                  */
      let fieldTagMappingTemp = [];
      //Checking negative condition because we need to return an array from this function even if input(an object) is empty.
      if (_.isEmpty(fieldTagMapping)) {
        return fieldTagMappingTemp;
      }

      return _.transform(
        fieldTagMapping,
        (fieldTagMappingArray, tagFieldMapping, objectName) => {
          let fieldTagMapping = _.transform(
            tagFieldMapping,
            (tagFieldMappingArray, field, tag) => {
              tagFieldMappingArray.push({
                tag: tag,
                field: JSON.stringify(field)
              });
            },
            []
          );
          fieldTagMappingArray.push({
            objectName: objectName,
            tagFieldMapping: fieldTagMapping
          });
        },
        []
      );
    },

    transformToDBStructure() {
      let fieldTagObjectMapping = {};
      this.form.field_tag_mapping = _.transform(
        this.fieldTagObjectMapping,
        (tag_field_mapping, objectMapping) => {
          tag_field_mapping[
            objectMapping.objectName.toUpperCase()
          ] = _.transform(
            objectMapping.tagFieldMapping,
            (tagFieldMapping, tagFieldMappingObject) => {
              tagFieldMapping[
                tagFieldMappingObject.tag.toUpperCase()
              ] = JSON.parse(tagFieldMappingObject.field);
            },
            {}
          );
        },
        {}
      );

      return;
    },

    isObjectModified() {
      let isObjectModified = _.some(this.$refs.mappingCard, objetCard => {
        return objetCard._data.objectModified;
      });
      return isObjectModified;
    },

    fetchRecordId() {
      return this.$route.query.id;
    },
    populateMasterSystmList() {
      SystemService.fetchMasterSystems()
        .then(res => {
          this.masterSystemList = res;
        })
        .catch(err => {
          console.log(err);
        });
    },
    async init() {
      this.populateMasterSystmList();
      let recordId = this.fetchRecordId();
      if (recordId) {
        let response = await SystemService.fetchCustomerSystemById(
          recordId
        ).catch(error => {
          this.notifyError(
            "There is an error in fetching customer system data"
          );
        });
        
        this.handleResponse(response);
        return;
      } else {
        debugger;
        this.cacheDataModal.isNewForm = true;
        this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = { ...this.form };
      }

      this.pageTitle = "New customer system";
    }
  },
  async beforeMount() {
    this.isSaveActionAllowed = await this.isSaveActionPermitted('customer_system');
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

// .CodeMirror-focused .cm-matchhighlight {
//   background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFklEQVQI12NgYGBgkKzc8x9CMDAwAAAmhwSbidEoSQAAAABJRU5ErkJggg==);
//   background-position: bottom;
//   background-repeat: repeat-x;
// }

.kp-attribute-wrap {
  .kp-title {
    background: #fafafa;
    border-top: 0.5px solid rgba(196, 196, 196, 0.5);
    border-bottom: 0.5px solid rgba(196, 196, 196, 0.5);
    margin-bottom: 16px;
    span {
      font-weight: 700;
      font-size: 14px;
      display: inline-block;
      padding: 10px;
    }
    button {
      display: inline-block;
      padding: 12px 8px;
      margin: 0;
    }
  }
  .tagname-container {
    border: 1.5px solid #d8dbe6;
    width: 60%;
    padding: 20px;
    border-radius: 7px;
    .codemirror-wrap {
      .kp-full-indicator {
        font-size: 11px;
        position: absolute;
        right: 0;
        right: 0;
        top: 5px;
        color: #868686;
      }
    }

    .codemirror-container {
      margin: 0;
    }
  }
}
.kp-form-field {
  margin-bottom: 22px;
  input,
  select {
    background: #f5f6fa;
  }
}
.kp-form-field-label {
  position: relative;
  color: #77787b;
  font-size: 14px;
  margin-bottom: 8px;
}
.kp-command-title {
  font-weight: 700;
  color: #212121;
  clear: both;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    height: 0.5px;
    width: 77%;
    top: 9px;
    left: 110px;
    background: #a8a8a8;
  }
  .el-icon-delete {
    float: right;
    padding: 7px;
    margin-top: -5px;
  }
}
</style>


