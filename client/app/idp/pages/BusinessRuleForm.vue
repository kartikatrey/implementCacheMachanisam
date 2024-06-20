<template>
  <el-main class="kp-main">
    <section class="page-body">
      <div class="page-title">
        <el-button
          class="back-button"
          cid="form-header-back"
          icon="mdi mdi-arrow-left-circle-outline"
          v-on:click="isSystemBR ? $router.push(`/idp/business-rule-library?search=true`) : $router.push('/idp/business-rules')"
        >
        </el-button>
        <span class="page-title-text"> {{ pageTitle }}</span>
        <span> Add new business rule and edit existing </span>
      </div>

      <section class="form-page-container">
        <div class="panel">
          <div class="panel-body">
            <el-form
              :model="form"
              :rules="formRules"
              ref="form"
              label-position="left"
              label-width="120px"
            >

            <div class="grouping-tile">General configuration</div>
              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="name" label="Name">
                      <el-input
                        name="name"
                        cid="business-rule-form-name"
                        v-model="form.name"
                        placeholder="Business rule name"
                        v-bind:readonly="isSystemBR"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>

                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="document_type" label="Document type">
                      <el-select
                        name="document_type"
                        clearable
                        filterable
                        :disabled="isSystemBR"
                        cid="business-rule-form-document-type-select"
                        v-model="form.document_type"
                        placeholder="Select"
                        @change="getDeFields()"
                      >
                        <el-option
                          v-for="(value,index) in doucument_types"
                          :key="value.value"
                          :cid="'business-rule-form-document-type_'+index"
                          :value="value.value"
                          :label="value.label"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="system_name" label="System name">
                      <el-select
                        name="system_name"
                        clearable
                        filterable
                        :disabled="isSystemBR"
                        cid="business-rule-form-system-name-select"
                        v-model="form.system_name"
                        placeholder="Select"
                      >
                        <el-option
                          v-for="(item,index) in system_names"
                          :key="item.system_name"
                          :value="item.system_name"
                          :cid="'business-rule-form-system-name_'+index"
                          :label="item.system_name"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>

                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="repository" label="Repository">
                      <el-select
                        name="repository"
                        clearable
                        filterable
                        :disabled="isSystemBR"
                        cid="business-rule-form-system-name-select"
                        v-model="form.repository"
                        placeholder="Select"
                        @change="onRepositoryChange()"
                      >
                        <el-option
                          v-for="item in repositories"
                          :key="item.value"
                          :value="item.value"
                          :label="item.label"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="type" label="Type">
                      <el-select
                        name="type"
                        clearable
                        filterable
                        cid="business-rule-form-type-select"
                        v-model="form.type"
                        :disabled="isSystemBR"
                        placeholder="Select"
                      >
                        <el-option
                          v-for="value in br_type_list"
                          :key="value.value"
                          :value="value.value"
                          :cid="'business-rule-form-type_'+index"
                          :label="value.label"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>

                <el-col :span="12">
                    <div class="kp-form-group">
                      <el-form-item prop="active"  label="Active">
                        <el-checkbox v-model="form.active" cid="business-rule-form-active"  @change="checkBoxClicked($event)" :disabled="isSystemBR"></el-checkbox>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>

              <el-row :gutter="40">
                    <el-col :span="12">
                      <div class="kp-form-group">
                        <el-form-item prop="package"  label="Package type">
                          <el-checkbox v-model="form.is_package" cid="business-rule-form-is_package"></el-checkbox>
                        </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="12">
                            <div class="kp-form-group">
                                <el-form-item class="control-label col-sm-2" prop="trigger"  label="Events">
                                    <el-select class="select-box" size="large" multiple v-model="form.trigger" filterable collapse-tags cid="field-config-form-invoke-select" reserve-keyword placeholder="Please select trigger action">
                                        <el-option v-for="(_type, index) in invokeActions" :cid="'field-config-form-invoke_' + index" :key="_type.value" :label="_type.label" :value="_type.value" label-width="170px"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </el-col>
                  </el-row>

              <el-row :gutter="40">
                  <el-col :span="24">
                    <div class="kp-form-group">
                      <el-form-item prop="run_condition" label="Run condition">
                        <QueryBuilder @onQueryChange="onQueryChange" cid="business-rule-form-run-condition" :query="form.run_condition" :documentType="form.document_type" :dataToShow='["fieldsData", "fileTypeData"]'></QueryBuilder>
                      </el-form-item>
                    </div>
                  </el-col>
              </el-row>

              <!-- Additional Description field added -->
              <el-row :gutter="40">
                  <el-col>
                    <div class="kp-form-group">
                      <el-form-item prop="description" label="Description">
                        <el-input
                          name="description"
                          cid="business-rule-desc"
                          v-model="form.description"
                          type="textarea"
                          v-bind:readonly="isSystemBR"
                          :autosize="{ minRows: 6, maxRows: 6 }"
                          placeholder="Business rule description"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>


               <div class="grouping-divide"></div>
              <div class="grouping-tile">Additional configuration</div>

              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="isAdvanced" label="Advanced script">
                      <toggle-button :sync="true" :color="{
                        checked: '#5f8fdf',
                        unchecked: '#DCDFE6',
                        disabled: '#CCCCCC',
                      }" :labels="{ checked: 'YES', unchecked: 'NO' }" cid="business-rule-assignemnt-is-advanced-script" v-model="form.is_advanced"></toggle-button>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>


              <el-row v-if="!form.is_advanced" :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="action" label="Action">
                      <el-select
                        name="action"
                        clearable
                        filterable
                        cid="business-rule-form-action-select"
                        v-model="form.action"
                        placeholder="Select"
                        @change="resetAction"
                      >
                        <el-option
                          v-for="item in actions"
                          :key="item.value"
                          :value="item.value"
                          :label="item.label"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row v-if="!form.is_advanced" :gutter="40">
                <el-col :span="12" v-if="!form.is_advanced && form.action == 'addError'">
                  <div class="kp-form-group">
                    <el-form-item prop="action" label="Error code">
                      <el-select
                        name="error_code"
                        clearable
                        filterable
                        cid="business-rule-form-field-select"
                        v-model="form.action_payload.error_code"
                        placeholder="Select"
                      >
                        <el-option
                          v-for="item in de_code_list"
                          :key="item.value"
                          :value="item.value"
                          :label="item.label"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>

                <el-col :span="12" v-if="!form.is_advanced && form.action == 'addMessage'">
                  <div class="kp-form-group">
                    <el-form-item prop="action" label="Message type">
                      <el-select
                        name="messageType"
                        clearable
                        filterable
                        cid="business-rule-form-message-type-select"
                        v-model="form.action_payload.message_type"
                        placeholder="Select"
                      >
                        <el-option
                          v-for="item in message_types"
                          :key="item.value"
                          :value="item.value"
                          :label="item.label"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>

                <el-col :span="12" v-if="!form.is_advanced && form.action == 'addMessage'">
                  <div class="kp-form-group">
                    <el-form-item prop="action" label="Message">
                      <el-input name="message" v-model="form.action_payload.message" type="textarea" :rows=3 placeholder="Message"></el-input>
                    </el-form-item>
                  </div>
                </el-col>

                <el-col :span="12" v-if="!form.is_advanced && form.action == 'setFieldValue'" :gutter="40">
                  <div class="kp-form-group">
                    <el-form-item prop="action" label="Field">
                      <el-select
                        name="field"
                        clearable
                        filterable
                        cid="business-rule-form-field-select"
                        v-model="form.action_payload.field"
                        placeholder="Select"
                      >
                        <el-option
                          v-for="item in de_field_list"
                          :key="item.value"
                          :value="item.value"
                          :label="item.label"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>

                <el-col :span="12" v-if="!form.is_advanced && form.action == 'setFieldValue'" :gutter="40">
                  <div class="kp-form-group">
                    <el-form-item prop="action" label="Value">
                      <el-input name="value" v-model="form.action_payload.value" placeholder="Value"></el-input>
                    </el-form-item>
                  </div>
                </el-col>

                <el-col :span="12" v-if="!form.is_advanced && form.action == 'applyRegex'" :gutter="40">
                  <div class="kp-form-group">
                    <el-form-item prop="action" label="regex">
                      <el-input name="regex" v-model="form.action_payload.regex" placeholder="Regex"></el-input>
                    </el-form-item>
                  </div>
                </el-col>

                <el-col :span="12" v-if="!form.is_advanced && form.action == 'applyRegex'" :gutter="40">
                  <div class="kp-form-group">
                    <el-form-item prop="action" label="Replace string">
                      <el-input name="regex" v-model="form.action_payload.replace_with" placeholder="string"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row v-if="form.is_advanced" :gutter="40">
                <el-col :span="24">
                  <div class="kp-form-group">
                    <el-form-item
                      class="kp-form-field-label code-mirror"
                      prop="advanced_script"
                      label="Script"
                    >
                      <KanverseEditor
                        :options="{'width':'100%', 'height':'500px','language': 'businessRule'}"
                        :content="form.advanced_script"
                        :refreshModel="form._id !== undefined"
                        v-model="form.advanced_script"
                        @onDidChangeModelContent="handleContentChange">
                      </KanverseEditor>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </div>
                    <!-- | panel body -->
          <footer>
            <div></div>
            <div>
              <el-button
                :disabled="this.isSystemBR"
                v-on:click="$router.push('/idp/business-rules')"
                size="small"
                cid="business-rule-form-cancel"
              >
                Cancel
              </el-button>
            </div>
            <!-- | save button -->
            <div v-if="isSaveActionAllowed && !isSystemBR">
              <el-button
                id="save-btn"
                :disabled="disableSave"
                v-on:click="save"
                size="small"
                cid="business-rule-form-run-save"
                type="primary"
              >
                Save
              </el-button>
            </div>

            <!-- | Test button to test business rule -->
            <el-dropdown v-if="$route.query.id && !isSystemBR" size="small" type="primary" @command="handleDocumentChange">
              <el-button size="small" type="primary">
                Run<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu size="small" slot="dropdown" class="br-run-button-list-view">
                <el-dropdown-item 
                v-for="doc in documentList" 
                :key="doc._id" 
                :command="doc._id">
                {{ doc | formatDocData }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <!-- | run last test button -->
            <div v-if="$route.query.id && !isSystemBR">
              <el-button
                id="run-last-test-btn"
                v-on:click="runLastTest"
                size="small"
                cid="business-rule-run-last-test"
                type="primary"
                :disabled="disableRunLastTest"
              >
                Run Last
              </el-button>
            </div>
          </footer>
        </div>
        <!-- | panel -->
      </section>
      <!-- | form-page-container -->
    </section>

    <section class="br-test-case-form-list" v-if="this.$route.query.id && !this.isSystemBR">
      <el-tabs v-if="this.$route.query.id" v-model="activeTab" @tab-click="handleTabClick" class="br-test-case-tabs">
        <el-tab-pane label="Test Cases" name="TestCases">
          <div v-if="activeTab === 'TestCases'" class="test-case-list">
            <TestCaseList :referenceType="'business_rule'" :referenceId="this.$route.query.id" :documentType="this.form.document_type"></TestCaseList>
          </div>
        </el-tab-pane>

        <el-tab-pane label="Test Case History" name="TestCaseHistory">
          <div v-if="activeTab === 'TestCaseHistory'" class="test-case-history-list">
            <TestCaseHistoryList :referenceId="this.$route.query.id"></TestCaseHistoryList>
          </div>
        </el-tab-pane>

        <el-tab-pane label="Test Case Logs" name="TestCaseLogs">
          <div v-if="activeTab === 'TestCaseLogs'" class="test-case-logs">
            <ScriptLogs :queryId="$route.query.id" :testLogs="testCaseLogs" :logsLoading="testCaseLogsLoading" :showRefreshButton="true" @scriptLogsRefreshed="handleScriptLogsRefresh"></ScriptLogs>
          </div>
        </el-tab-pane>

        <el-tab-pane label="Business Rule Logs" name="BusinessRuleLogs">
          <div v-if="activeTab === 'BusinessRuleLogs'" class="business-rule-logs">
            <ScriptLogs :queryId="$route.query.id" :testLogs="testLogs" :logsLoading="logsLoading"></ScriptLogs>
          </div>
        </el-tab-pane>

        <el-tab-pane label="BR Run History" name="RunHistory">
          <div v-if="activeTab === 'RunHistory'" class="business-rule-run-history">
            <TestHistoryList :id="form._id"></TestHistoryList>
          </div>
        </el-tab-pane>

        <el-tab-pane label="Version List" name="VersionList">
          <div v-if="activeTab === 'VersionList'" class="Business-rule-version-list">
            <VersionRelatedList v-if="showVersionList" :id="form._id" title="Business rule versions"></VersionRelatedList>
          </div>
        </el-tab-pane>
      </el-tabs>
    </section>
  </el-main>
</template>

<script>
import Constants from "@/resources/Constants";
import navigation from "@/mixins/navigation.js";
import Codemirror from "@/components/Codemirror";
import BusinessRuleService from "@/idp/services/BusinessRule";
import CustomerService from "@/idp/services/CustomerService";
import BRFieldMapService from "@/idp/services/BusinessRuleFieldMap";
import $ from "jquery";
import EventBus from "@/EventBus";
import QueryBuilder from "@/idp/pages/QueryBuilder.vue";
import CustomerConfig from "@/idp/services/DeCustomerConfig";
import FieldService from "@/idp/services/FieldService";
import Validator from "@/services/Validator";
import ErrorCodeService from "@/idp/services/ErrorCodeService";
import TestHistoryList from "@/idp/components/TestHistoryList.vue";
import VersionRelatedList from "@/idp/components/VersionRelatedList.vue";
import KanverseEditor from "@/components/KanverseEditor";
import DocumentService from "@/idp/services/DocumentService"
import TestService from "@/idp/services/TestService";
import LogService from "@/idp/services/LogService";
import ScriptLogs from "@/idp/components/ScriptLogs.vue";
import _ from "lodash";
import TestCaseList from "@/idp/components/TestCaseList.vue";
import TestCaseHistoryList from "@/idp/components/TestCaseHistoryList.vue";
import formMixin from "@/mixins/formMixin.js";

export default {
  name: "BusinessRuleForm",
  mixins: [formMixin],
  components: {
    Codemirror,
    KanverseEditor,
    QueryBuilder,
    VersionRelatedList,
    TestHistoryList,
    ScriptLogs,
    TestCaseList,
    TestCaseHistoryList
  },
  data() {
    var EmptyValueValidator = (rule, value, callback) => {
      if (value && ("" + value).trim() === "") {
        callback(new Error("Please enter valid label name"));
      } else {
        callback();
      }
    };
    return {
      activeTab: 'TestCases',
      instanceType: "",
      disableRunLastTest: false,
      logsLoading: false,
      popupVisible: false,
      testLogs: [],
      documentList:[],
      document_name: "",
      selectedDocumentId: "",
      testHistoryId: "",
      testCaseLogs: [],
      testCaseLogsLoading: false,
      currentRunId: "",
      isSystemBR:false,
      isSaveActionAllowed:true,
      form: {
        name: "",
        document_type: "",
        type: "",
        // Added the description feild
        description: "",
        system_name: "",
        run_condition:null,
        active: true,
        advanced_script:  ["(async()=>{", "\t__logInfo('Welcome !!!')", "})()"].join("\n"),
        is_package : false,
        repository: "",
        trigger:[Constants.DOCEX.TRIGGER_ACTION.DRAFT, Constants.DOCEX.TRIGGER_ACTION.FILE_UPLOAD]
      },
      invokeActions: Constants.DOCEX.INVOKE_ACTION,
      repositories:[],
      actions:[{
        label: "Add message",
        value : "addMessage"
      },{
        label: "Add error",
        value : "addError"
      },
      {
        label: "Set field",
        value : "setFieldValue"
      },{
        label: "Apply regex",
        value : "applyRegex"
      }],
      message_types:[{
        label: "Info",
        value : "INFO"
      },{
        label: "Warning",
        value : "WARNING"
      },{
        label: "Error",
        value: "ERROR"
      }],
      de_field_list : [],
      de_code_list : [],
      editorOptions: {
        mode: "text/javascript",
        theme: "default",
      },
      system_names: [],
      doucument_types: [],
      br_type_list: Constants.DOCEX.BUSINESS_RULE_TYPES,
      fields_message_mapping: {
        name: "Please provide Business Rule Name",
        document_type: "Please select Document Type",
        type: "Please select  Business Rule Type",
        advanced_script: "Script cannot be empty",
      },
      pageTitle: "Business rule",
      disableSave: false,
      rules: {},
      showVersionList:true,

      formRules: {
        name: [
          {
            validator: EmptyValueValidator,
            trigger: "blur",
            message: "Please provide Business Rule Name",
          },
          {
            required: true,
            message: "Please provide Business Rule Name",
            trigger: "blur",
          },
        ],

        document_type: [
          {
            validator: EmptyValueValidator,
            trigger: "blur",
            message: "Please select Document Type",
          },
          {
            required: true,
            message: "Please select Document Type",
            trigger: "blur",
          },
        ],
        trigger: [
          {
            validator: EmptyValueValidator,
            trigger: "blur",
            message: "Please select trigger action",
          },
          {
            required: true,
            message: "Please select trigger action",
            trigger: "blur",
          },
        ],
        type: [
          {
            validator: EmptyValueValidator,
            trigger: "blur",
            message: "Please select Business Rule Type",
          },
          {
            required: true,
            message: "Please select Business Rule Type",
            trigger: "blur",
          },
        ],
        system_name: [
          {
            validator: EmptyValueValidator,
            trigger: "blur",
            message: "Please select System Name",
          },
          {
            required: true,
            message: "Please select System Name",
            trigger: "blur",
          },
        ],
         repository: [
          {
            validator: EmptyValueValidator,
            trigger: "blur",
            message: "Please select repository",
          },
          {
            required: true,
            message: "Please select repository",
            trigger: "blur",
          },
        ],
        advanced_script: [
          {
            validator: Validator.scriptValidator,
            trigger: "blur",
            message: "Syntax errors found.", // This message replaced with actual sytanx error
          },
          {
            required: true,
            message: "Script cannot be empty",
            trigger: "blur",
          },
        ],
        //FormRules for description were added so that it wouldn't be empty upon saving.
        description:[
        {
            validator: EmptyValueValidator,
            trigger: "blur",
            message: "Please provide Business Rule Description",
          },
          {
            required: true,
            message: "Please provide Business Rule Description",
            trigger: "blur",
          },
        ]
      },
    };
  },
  methods: {
    handleTabChange(val){
      this.activeTab = val;
    },
    /**
    * Enables the save button when a change in the repository is detected.
    */
    onRepositoryChange() {
      this.handleSaveButtonVisibility();
    },
    
    /**
     * There are two scenarios:
     * 1. If the instance type is set to 'template' and the repository is set to 'custom',
     *    users should not be allowed to save business rules (BR).
     * 2. If the instance type is set to 'customer/demo' and the repository is set to 'out of box',
     *    users should not be allowed to save business rules (BR).
    */
    handleSaveButtonVisibility() {
      const isTemplateInstance = (this.instanceType === Constants.DOCEX.INSTANCE_TYPE.TEMPLATE);
      const isOutOfBoxRepository = (this.form.repository === Constants.DOCEX.BR_REPOSITORY.OUT_OF_BOX);
      const isCustomRepository = (this.form.repository === Constants.DOCEX.BR_REPOSITORY.CUSTOM)
      if((!isTemplateInstance && isOutOfBoxRepository) || (isTemplateInstance && isCustomRepository)){
        this.disableSave = true;
      }
      else{
        this.disableSave = false;
      }
    },

    /**
     * Purpose: To fetch "instance_type" column from "customer_configuration" table and assign value to instanceType variable
     */
    async fetchConfiguration(){ 
      const configurationResponse = await CustomerService.getCustomerConfiguration({selectColumns:['instance_type']});
      this.instanceType = _.get(configurationResponse[0],'instance_type') || Constants.DOCEX.INSTANCE_TYPE.CUSTOMER;
    },
    
    /**
      * Check if the instance type is a template
      * If yes, provide both options "Out of box" and "Custom"
      * If no, check if it's a new instance
      *   If yes, provide option as "Custom"
      *   If no (editing), provide both options, on save it should become "Custom"
    */
    populateRepositoryOptions() {
      const recordId = this.$route.query.id;
      const isTemplateInstance = (this.instanceType == Constants.DOCEX.INSTANCE_TYPE.TEMPLATE);
      if (isTemplateInstance) {
          this.repositories.push(
            {
              label: "Out of box",
              value: "outofbox",
            }
          );  
      }
      else{
        this.repositories.push(
        {
          label: "Custom",
          value: "custom",
        });
      }

    },

    /**
     * Purpose: To allocate the document_id to the that is selected from the dropdown and run business rule.
     * @param {string} command - document_id representing the changed document. 
     *  
     * */ 
    handleDocumentChange(command){
      this.selectedDocumentId = command;
      this.testBusinessRule();
    },
    
    /**
     * Purpose: run recent last executed test for the business_rule_id.
     */
    async runLastTest(){

      // fetches recent record from test_history.
      this.disableRunLastTest = true;
      if(!this.selectedDocumentId){
        const params = {"reference_id": this.form._id};

        // gets the latest selectedDocumentId from test_history.
        const response = await TestService.getRecentTestEntry(params);

        // checks if the response is empty array or has a recent test record in test_history collection.
        if(!_.isEmpty(response)){
          this.selectedDocumentId = response[0].document_id;
        }else{
          this.notifyError("No Previous test available to run");
          this.disableRunLastTest = false;
          return;
        }
      }
      // if the test record exist it runs the business rule for the following response[0].document_id.
      this.testBusinessRule();
    },

    /**
     * Purpose: executes the business rule for the br_id and selected_document_id.
     * 
     * Step1: set testLogs to empty and create a new testHistoryId.
     * Step2: Execute the business rule for the selected_document from dropdown.
     * Step3: If business rule executed successfully fetch logs from script_log
     * using testHistoryId as filter.
     */
    async testBusinessRule(){
      try{
        this.activeTab = 'BusinessRuleLogs';
        this.logsLoading = true;
        this.testLogs = [];
        // Adds the record in the test_history collection.
        const testHistoryRes = await TestService.save({
          reference_id: this.form._id,
          reference_type: "business_rule",
          document_id: this.selectedDocumentId,
        });

        // checks if the testHistoryId is created or not.
        if(testHistoryRes.data._id){
          this.testHistoryId = testHistoryRes.data._id;
        }else{
          this.notifyError("Error while creating test history");
          return;
        }
        const params = {
          documentId: this.selectedDocumentId, 
          recordId: _.get(this.form, "_id", ""),
          type: "business_rule", 
          event:Constants.DOCEX.TRIGGER_ACTION.DRAFT, 
          testHistoryId: this.testHistoryId
        };
        // call to execute the business rule.
        const response = await TestService.test(params);
        // if the business rule is processed successfully then getScriptLogs from the script_log collection.
        if (response.data.status) {
          // gets the logs array for the test_history_id from the script_log.
          const scriptLogs = await TestService.getScriptLogs({"test_history_id": this.testHistoryId});

          // if no logs in res then notify no logs available for this test_history_id.
          if(_.isEmpty(scriptLogs)){
            this.notifyError("No logs available");
            return;
          }
          this.testLogs = scriptLogs;
        }else{
          this.notifyError(response.data.message);
        }
      }catch(err){
        console.error(err);
        this.notifyError("Something went wrong.");
      }finally{
        this.logsLoading = false;
        this.disableRunLastTest = false;
      }
    },
    handleContentChange(event, content){
      this.form.advanced_script = content;
    },
    /**
     * Purpose: to get the latest 20 documents from de_document.
     * Restify Issue: When restify is used the filter is modified in hooks and it fetches documents for all stages.
     */
    async getRecentDocuments(){

      this.documentList = [];
      const params = {
        filter : {document_type: this.form.document_type, stage: Constants.DOCEX.STAGE.EXTRACTED, state : Constants.DOCEX.STATE_UPLOADED.SUCCESS},
        projection : {_id: 1, file_name: 1, updated_at: 1},
        sort: {_id:-1},
        limit : 20
      }
      try {
        const result = await DocumentService.getRecentDocuments(params);
        this.documentList = result.data;
      } catch (error) {
        console.error("Error in getRecentDocuments:", error);
      }
    },
    async getDeFields(){
        try{
            this.getRecentDocuments();
            this.de_field_list = []
            let fieldsListData = await FieldService.getFieldsList({
                field_type: "header",
                document_type: this.form.document_type,
            })
            _.forEach(fieldsListData,(obj)=>{
              this.de_field_list.push({label:obj.label,value:obj.name})
            })
        } catch(error) {
            console.log("Error encountered while getting Fields list: ", error);
            return false;
        }
    },
    async getDocumentType(){
        const docTypesConfig = await CustomerConfig.getAllDocsCustConfiguration({document_type:{$exists:true},active:true});
        this.doucument_types = CustomerConfig.getDocumentTypeList(docTypesConfig);
    },
    async getSystemNames(){
      this.loader=true;
      this.system_names = await CustomerService.getCustomerSystemNames();
      this.loader=false;
    },
    resetAction(){
      this.$set(this.form,"action_payload",{})
    },
    onQueryChange(input) {
      this.form.run_condition = input.val;
    },
    async checkBoxClicked(event){
      if(event){
        this.disableSave = false;
        return;
      }

      let payload ={
        'document_type':this.form.document_type,
        'de_business_rule_id':this.$route.query.id
      }
      this.disableSave = true;
      let response = await BRFieldMapService.isBRMappedToFields(payload);
      response && response.length > 0 ? this.notifyError(`This business rule is mapped to some field(s). please clear the field mapping before inactivating it.`)
                                      : this.disableSave = false
    },

    registerEvents(){
      EventBus.$on("refresh-version-list", data => this.handleRefreshBRForm(data));
      EventBus.$on("runIdChanged", (runId) => {
        this.handleRunIdChanged(runId);
      });
    },

    async handleRunIdChanged(newRunId) {
      this.currentRunId = newRunId;
      await this.handleScriptLogsRefresh();
    },

    async handleScriptLogsRefresh() {
      if (this.currentRunId) {
        this.testCaseLogs=[];
        const filter = {run_id: this.currentRunId}
				const res = await LogService.getLogs(Constants.TEST_CASE_HISTORY_ENDPOINT, filter);
        if(res){
          res.forEach(testCase => {
            let logs = testCase.logs;
            logs = logs.map((data) => {
                return {
                  message: data.message? data.message: data,
                  type: data.type? data.type: "info"
                }
              });
            this.testCaseLogs = this.testCaseLogs.concat(logs);
          })
        }
      }
    },

    async handleRefreshBRForm(data = {}){
          //this.$forceUpdate();
        this.showVersionList = false;
        let recordId = this.$route.query.id;
        await this.init(recordId);
        this.showVersionList = true;
     },

    async init(recordId) {
      try {
        let brData ={}
        if(this.isSystemBR){
          brData = await BusinessRuleService.getSystemBusinessRule('/portal/api/business-rule-library',{"id":recordId});          
        }else{
          brData = await BusinessRuleService.fetchById(recordId);
        }
        this.form = Object.assign({}, this.form, brData);

        this.handleSaveButtonVisibility();
        // This ensures that the method is invoked only when 'this.form' is defined and not null or undefined.
        this.form && await this.getRecentDocuments();
      } catch (error) {
        this.notifyError("Error");
      }
    },
    async save() {
      this.disableSave = true;
      this.showVersionList = false;
      this.$setLoader({
        target: "#save-btn",
        spinner: "el-icon-loading",
      });
      try {
        let valid = await this.$refs.form.validate().catch((error) => {
          // this.notifyError(error);
        });
        if (!valid) {
          this.$resetLoader();
          this.disableSave = false;
          return;
        }
        if (!this.form._id) {
          const response = await BusinessRuleService.save(this.form);
          if (!response.data || !response.data._id) {
            throw new Error("Error while saving");
          }
          this.notifySuccess("BR added successfully");
          this.$router.push("/idp/business-rule-form?id=" + response.data._id);
        } else {
          const response = await BusinessRuleService.updateBRRules(this.form);
  
          if (!response.data || !response.data._id) {
            throw new Error("Error while saving");
          }

          this.notifySuccess("BR updated successfully!");
          this.showVersionList = true;
          this.$resetLoader();
          this.disableSave = false
          // this.$router.push({ path: "/idp/business-rules" });
        }
      } catch (e) {
        this.notifyError("Error while saving data");
        console.error("Error ", e);
      }
    },
    addFormRules() {
      let rules = {};
      _.each(this.fields_message_mapping, (message, field) => {
        let ruleArr = [];
        ruleArr.push({
          validator: this.EmptyValueValidator,
          trigger: "blur",
          message: message,
        });
        ruleArr.push({
          required: true,
          message: message,
          trigger: "blur",
        });
        rules[field] = ruleArr;
      });
      this.rules = rules;
    },
  },
  /**
   * Purpose: to print document_name with date in the run dropdown button.
   */
  filters: {
    formatDocData: function (doc) {
      const date = new Date(doc.updated_at).toLocaleDateString('en-GB');
      return `${doc.file_name}  (${date})`;
    }
  },
  async mounted(){
    this.registerEvents()
  },
  async beforeMount() {
    this.isSaveActionAllowed = await this.isSaveActionPermitted('de_business_rule');
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
    let recordId = this.$route.query.id;
    let options = _.get(this.$route, "query.options") ? JSON.parse(this.$route.query.options) : {};
    this.isSystemBR = _.get(options, "isSystemBR");
    this.addFormRules();
    this.getDocumentType();
    this.getSystemNames();
    await this.fetchConfiguration();
    this.populateRepositoryOptions();
    // This ensures that the initialization occurs only when a valid 'recordId' is available.
    if (recordId) await this.init(recordId);
    let errorCodesData = await ErrorCodeService.get({active:true},["code,name"]).catch((err) => {
      console.log("Error encountered while getting Error codes: ", err);
      return false;
    });
    _.forEach(errorCodesData,(obj)=>{
      this.de_code_list.push({label:obj.name,value:obj.code})
    })
  },
  beforeDestroy(){
    EventBus.$off(["refresh-version-list"]);
    EventBus.$off(["runIdChanged"]);
  }
};
</script>

<style lang="scss">
@import "../_idpGlobal";
@import "../_idpVariables";
.br-run-button-list-view{
  height: 400px;
  overflow-y: auto;
}
.scriptLog{
  .title {
      margin-right: auto;
      padding: 0;
      border: 0;
      font-weight: 600;
      font-size: var(--font-pagetile);
      color: #4a5568;
    }
  .message-tag{
    height: auto;
    overflow-wrap: break-word;
    word-wrap: break-word;
    white-space: normal;
    max-width: inherit;
  }
}

.scriptLogDialog{
  .message-tag{
    height: auto;
    overflow-wrap: break-word;
    word-wrap: break-word;
    white-space: normal;
    max-width: inherit;
  }
}
.br-test-case-form-list {
  // padding-top: 50px !important;
  // padding-bottom: 50px !important;
  width: 98% !important;

  .br-test-case-radio-btn{
    position: relative;
    top: 2.5rem;
  }

  .el-tabs__nav-wrap{
    margin-top: 2rem;
  }

  .test-case-logs{
    .scriptLog{
      .testcase-title-container{
        .section-title{
          visibility: hidden;
        }

        .testcase-refresh-button{
          top: 0.5rem;
        }
      }
    }
  }
}
.br-test-case-form-list{
  .el-radio__input {
    display: none !important;
  }
  label {
    vertical-align: middle;
    line-height: 2;
  }
  .is-checked {
    // width: 100px;
    height: 30px;
    border-top: 2px solid #5a67d8;
    background: var(--dark-07);
  }
  .el-radio {
    margin-right: 0;
    margin-bottom: 2.7rem;
  }
  .el-radio__label {
    padding: 0 1.5rem;
    font-size: var(--font-md);
    font-weight: 400 !important;
    // color: var(--dark-04);
  }
  .el-radio__input.is-checked + .el-radio__label {
    color: var(--dark-01) !important;
  }
  .table-toolbar{
    margin-bottom: 0.583rem;
  }
}
</style>
