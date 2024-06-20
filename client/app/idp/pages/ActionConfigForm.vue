<template v-loading="loading">
  <el-main class="kp-main">
    <section class="page-body">
      <div class="page-title">
        <el-button
          icon="mdi mdi-arrow-left-circle-outline"
          cid="form-header-back"
          v-on:click="onBack"
        ></el-button>
        <span class="page-title-text" v-if="form._id"
          >Edit {{ pageTitle }}
        </span>
        <span class="page-title-text" v-else>Add {{ pageTitle }}</span>
      </div>

      <section class="form-page-container">
        <div class="panel">
          <div class="panel-body">
            <el-form
              :model="form"
              ref="form"
              label-width="120px"
              :rules="formRules"
            >
              <div class="grouping-tile">General configuration</div>
              <el-row :gutter="40">

                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="label"
                      label="Label"
                    >
                      <el-input
                        cid="dynamic_button_config_form"
                        class="form-control"
                        prop="label"
                        @input="handleLabelInput"
                        v-model="form.label"
                        placeholder="Provide label"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="document_type"
                      label="Document type"
                    >
                      <el-select
                      :disabled="form.is_platform"
                        class="select-box"
                        size="large"
                        v-model="form.document_type"
                        filterable
                        reserve-keyword
                        placeholder="Please select document type"
                      >
                        <el-option
                          v-for="(_type, index) in documentTypes"
                          :cid="'field-config-form-document-type_' + index"
                          :key="_type.value"
                          :label="_type.label"
                          :value="_type.value"
                          label-width="170px"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="name"
                      label="Name"
                    >
                      <el-input :disabled="form.is_platform"
                        cid="dynamic_button_config_form"
                        class="form-control"
                        prop="name"
                        v-model="form.name"
                        placeholder="Provide name"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
               <el-col :span="12">
                 <div class="kp-form-group">
                   <el-form-item
                     class="control-label col-sm-2"
                     prop="button_type"
                     label="Button type"
                   >
                     <el-select :disabled="form.is_platform"
                       class="select-box"
                       size="large"
                       cid="field-config-form-document-type-select"
                       v-model="form.button_type"
                       filterable
                       reserve-keyword
                       placeholder="Please select button type"
                     >
                       <el-option
                         v-for="btn in buttonType"
                         :key=btn.value
                         :label=btn.label
                         :value=btn.value
                         label-width="170px"
                       >
                      </el-option>
                     </el-select>
                   </el-form-item>
                 </div>
               </el-col>
             </el-row>

             <el-row :gutter="40">
              <el-col :span="12" v-if="form.button_type !== 'list'">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="order"
                      label="Order"
                    >
                      <el-input
                        class="threshold-input"
                        type="number"
                        :min="1"
                        cid="field-config-form-order"
                        v-model="form.order"
                        placeholder="E.g. 1"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>

                <el-col :span="12">
                  <div class="kp-form-group">
                      <el-form-item
                      label="Platform"
                      >
                          <el-switch
                              :disabled="isPlatform"
                              v-model="form.is_platform">
                          </el-switch>
                      </el-form-item>
                  </div>
              </el-col>
             </el-row>
              <el-row :gutter="40">

                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="view_name"
                      label="Location"
                    >
                      <el-select :disabled="form.is_platform"
                        class="select-box"
                        size="large"
                        cid="field-config-form-document-type-select"
                        v-model="form.view_name"
                        filterable
                        reserve-keyword
                        placeholder="Please select view"
                      >
                        <el-option
                          v-for="(_type) in viewList"
                          :key="_type.value"
                          :label="_type.label"
                          :value="_type.value"
                          label-width="170px"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>

                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                    prop="icon"
                    label="Icon">
                      <el-input
                      :disabled="form.is_platform"
                        cid="dynamic_button_icon"
                        class="form-control"
                        prop="icon"
                        v-model="form.icon"
                        placeholder="Please provide icon"
                      ></el-input>
                      <a
                      href="https://pictogrammers.github.io/@mdi/font/5.0.45/"
                      target="_blank">Choose Icon</a>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-4"
                      prop="roles"
                      label="Roles"
                    >
                      <el-select
                        class="select-box"
                        size="large"
                        v-model="form.roles"
                        filterable
                        reserve-keyword
                        multiple
                        collapse-tags
                        placeholder="Please select user roles"
                      >
                        <el-option
                          v-for="userRole in rolesList"
                          :key="userRole.value"
                          :label="userRole.label"
                          :value="userRole.value"
                          label-width="170px"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

                <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="active"  label="Active">
                      <el-checkbox v-model="form.active" cid="dynamic-button-form-active"></el-checkbox>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

                <el-row :gutter="40">
                <el-col :span="24">
                  <div class="kp-form-group">
                    <el-form-item id="action-query-builder" prop="action_condition" label="Display condition">
                    <QueryBuilder
                      @onQueryChange="onQueryChange"
                      cid="action-form-action-condition"
                      :query="form.action_condition"
                      :documentType="form.document_type"
                      :dataToShow='["fieldsData", "stageData", "stateData", "fileTypeData"]'>
                    </QueryBuilder>
                  </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <!-- <el-row :gutter="40">
                <el-col :span="12">
                    <div class="kp-form-group">
                      <el-form-item
                      class="control-label col-sm-2"
                      prop="action_type"
                      label="Action Type"
                      >
                      <el-select
                      :disabled="form.is_platform"
                          class="select-box"
                          size="large"
                          cid="field-config-form-document-type-select"
                          v-model="form.action_type"
                          placeholder="Please select action type"
                        >
                          <el-option
                            v-for="(_type) in actionTypes"
                            :key="_type.value"
                            :label="_type.label"
                            :value="_type.value"
                            label-width="170px"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </el-col>
              </el-row> -->

              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="workflow_id"
                      label="Workflow"
                      :hidden="form.is_platform"
                    >
                      <el-select
                        class="select-box"
                        size="large"
                        v-model="form.workflow_id"
                        filterable
                        reserve-keyword
                        placeholder="Please select field type"
                      >
                        <el-option
                          v-for="wf in workflowList"
                          :key="wf._id"
                          :label="wf.name"
                          :value="wf._id"
                          label-width="170px"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="40">
                <el-col :span="24">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label"
                      prop="script"
                      label="Condition Script">
                      <!-- <codemirror
                        id="codemirror"
                        cid="business-rule-form-script"
                        v-model="form.advanced_script"
                      ></codemirror> -->
                      <KanverseEditor
                          :options="{ 'width': '100%', 'height': '500px', 'language': 'businessRule' }"
                          :content="form.advanced_script"
                          :refreshModel="form._id !== undefined"
                          v-model="form.advanced_script"
                          @onDidChangeModelContent="handleAdvanceScriptChange">
                        </KanverseEditor>
                    </el-form-item>
                  </div>
                  <div class="kp-form-group">
                    <el-form-item
                        class="control-label"
                        prop="pre_script"
                        label=" Pre Script"
                        :hidden="form.is_platform">
                      <KanverseEditor
                          :options="{ 'width': '100%', 'height': '500px', 'language': 'businessRule' }"
                          :content="form.pre_script"
                          :refreshModel="form._id !== undefined"
                          v-model="form.pre_script"
                          @onDidChangeModelContent="handlePreScriptChange">
                        </KanverseEditor>

                      </el-form-item>
                    </div>

                    <div class="kp-form-group">
                      <el-form-item
                        class="control-label"
                        prop="post_script"
                        label=" Post Script"
                        :hidden="form.is_platform">
                        <!-- <codemirror
                          id="codemirror_postscript"
                          cid="business-rule-form-postscript"
                          v-model="form.post_script"
                        ></codemirror> -->
                        <KanverseEditor
                          :options="{ 'width': '100%', 'height': '500px', 'language': 'businessRule' }"
                          :content="form.post_script"
                          :refreshModel="form._id !== undefined"
                          v-model="form.post_script"
                          @onDidChangeModelContent="handlePostScriptChange">
                        </KanverseEditor>
                      </el-form-item>
                    </div>

                    <div class="kp-form-group">
                      <el-form-item
                        class="control-label"
                        prop="server_script"
                        label=" Server Script"
                        :hidden="form.is_platform">
                        <!-- <codemirror
                          id="codemirror_serverscript"
                          cid="business-rule-form-serverscript"
                          v-model="form.server_script"
                        ></codemirror> -->
                        <KanverseEditor
                          :options="{ 'width': '100%', 'height': '500px', 'language': 'businessRule' }"
                          :content="form.server_script"
                          :refreshModel="form._id !== undefined"
                          v-model="form.server_script"
                          @onDidChangeModelContent="handleServerScriptChange">
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
                cid="field-config-form-cancel"
                size="small"
                v-on:click="onBack"
                >Cancel</el-button
              >
            </div>
            <div>
              <el-button v-if="isSaveActionAllowed" size="small" v-on:click="saveForm" type="primary"
                >Save</el-button
              >
            </div>
            <!-- <p>Generated output:</p>
              <pre>{{ JSON.stringify(this.form.field_condition, null, 2) }}</pre>-->
          </footer>
        </div>
        <!-- | panel -->
      </section>
      <!-- | form-page-container -->
    </section>
        <VersionRelatedList v-if="showVersionList" :id="form._id"  title="Business rule versions"></VersionRelatedList>

  </el-main>
</template>

<script>
import Constants from "@/resources/Constants";
// import IdpTree from "@/idp/components/IdpTree.vue";
import EventBus from "@/EventBus";
import _ from "lodash";
// import DocumentService from "@/idp/services/DocumentService";
// import DocumentAssign from "@/idp/components/DocumentAssign.vue";
import Codemirror from "@/components/Codemirror";
import CustomerConfig from "@/idp/services/DeCustomerConfig";
import ActionButtonConfig from "@/idp/services/ActionButtonConfig";
import DialogFlowService from "@/dialogflow/services/DialogFlowService";
import UserService from "@/idp/services/UserService";
import QueryBuilder from "@/idp/pages/QueryBuilder";
import KanverseEditor from "@/components/KanverseEditor";
import VersionRelatedList from "@/idp/components/VersionRelatedList.vue";
import Validator from "@/services/Validator";
import formMixin from "@/mixins/formMixin.js";

export default {
  name: "ActionConfigForm",
  mixins: [formMixin],
  components: {
    QueryBuilder,
	Codemirror,
  VersionRelatedList,
    KanverseEditor
  },
  data() {
    return {

      form: {
		  action_condition:null,
      ellipsis: false
	  },
    isPlatform: false,
     showVersionList:true,
     isSaveActionAllowed:true,
      viewList: Constants.DOCEX.VIEW_LIST,
      buttonType: [{
        value: 'list',
        label: 'List'
        }, {
          value: 'form',
          label: 'Form'
        },
      ],
      actionTypes:[{
        value:"script",
        label:"Script"
      },
      {
        value:"workflow",
        label:"Workflow"
      }
    ],
      workflowList: [],
      rolesList: [],
      documentTypes: [],
      pageTitle: "action button",
      loading: false,
      //added new script sandboxes
      pre_script:[],
      post_script:[],
      server_script:[],
      formRules: {
        advanced_script: [
          {
            validator: Validator.scriptValidator,
            trigger: "blur",
            message: "Syntax errors found.", // This message replaced with actual sytanx error
          },
        ],
        pre_script: [
          {
            validator: Validator.scriptValidator,
            trigger: "blur",
            message: "Syntax errors found.", // This message replaced with actual sytanx error
          },
        ],
        post_script: [
          {
            validator: Validator.scriptValidator,
            trigger: "blur",
            message: "Syntax errors found.", // This message replaced with actual sytanx error
          },
        ],
        server_script: [
          {
            validator: Validator.scriptValidator,
            trigger: "blur",
            message: "Syntax errors found.", // This message replaced with actual sytanx error
          },
        ],
        name: [
          {
            required: true,
            trigger: "blur",
            message: "Please enter button name",
          },
        ],
        label: [
          {
            required: true,
            trigger: "blur",
            message: "Please enter button label",
          },
        ],
        document_type: [
          {
            required: true,
            trigger: "blur",
            message: "Please select document type",
          },
        ],
        workflow_id: [
          {
            // required: true,
            trigger: "blur",
            message: "Please select workflow id",
          },
        ],
        roles: [
          {
            required: true,
            trigger: "blur",
            message: "Please select roles",
          },
        ],
      },
    };
  },
  computed: {
    getTabClass(tabName) {},
  },
  methods: {
    handleAdvanceScriptChange(event, content){
      this.form.advanced_script = content;
    },
    handlePreScriptChange(event, content){
      this.form.pre_script = content;
    },
    handlePostScriptChange(event, content){
      this.form.post_script = content;
    },
    handlesServerScriptChange(event, content){
      this.form.server_script = content;
    },
    handleLabelInput() {
      if (this.form._id) {
        return;
      }
      let name = (this.form["label"] || "").trim().replace(/\s+/g, "_");
      name = name ? `${name.toLowerCase()}` : "";
      this.$set(this.form, "name", name);
      if (name) {
        this.$refs["form"].clearValidate(["name"]);
      }
    },
	   onQueryChange(input) {
      this.form.action_condition = input.val;

    },
    setEllipsis(form){
      if(form.button_type == 'list'){
        this.form.ellipsis = true
        return;
      }
    },
    onBack() {
      this.$router.push("/idp/buttons");
    },
    async saveForm() {
      let valid = await this.$refs.form.validate().catch((error) => {});
      if (!valid) {
        return;
      }
      this.showVersionList = false;
      this.loading = true;
      try {

        if(!this.form.advanced_script){
          this.form.advanced_script = "(()=>{return true})"
        }
        this.setEllipsis(this.form);
        const response = await ActionButtonConfig.save(this.form);
        if (_.get(response, "data.code") === 11000) {
          this.notifyError("Action name already exist");
          this.loading = false;
          return;
        }
        this.notifySuccess("Record saved successfully");
       this.$router.push("/idp/buttons");
      } catch (err) {
        this.notifyError("Error while saving data");
      }
      this.loading = false;
    },

    async init() {
      try {
        this.loading = true;
        const buttonConfigId = this.$route.query.id;
        await Promise.all([
          this.setDocumentTypes(),
          this.setWorkflowList(),
          this.setUserRoles(),
        ]);
        if (buttonConfigId) {
          let response = await ActionButtonConfig.fetchById(buttonConfigId);
          if (!response.action_condition) { response.action_condition = null }
          // if(response.is_platform){
          //   response["action_type"]="script"
          // }
          this.isPlatform =  _.get(response, 'is_platform', false);
          this.form = response;
        }
      } catch (err) {
        this.notifyError(err);
      } finally {
        this.loading = false;
      }
    },

    async setWorkflowList() {
      this.workflowList = await DialogFlowService.fetchWorkflowList();
    },

    async setDocumentTypes() {
      let customerConfigurations = await CustomerConfig.getAllDocsCustConfiguration({
        document_type: { $exists: true },
      });
      this.documentTypes = CustomerConfig.getDocumentTypeList(
        customerConfigurations
      );
    },

    async setUserRoles() {
      const roles = await UserService.getRoles({
        active: true,
        is_idp: true,
      });
      this.rolesList = (roles || []).map((role) => {
         return { value: "" + role._id, label: "" + role.label };
      });
    }
  },
  created() {},
  mounted() {},

  async beforeDestroy() {},
  async beforeMount() {
    this.isSaveActionAllowed = await this.isSaveActionPermitted('de_action');
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "../_idpVariables";
@import "../_idpGlobal";
</style>
