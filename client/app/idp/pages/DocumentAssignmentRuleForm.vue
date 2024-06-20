<template>
  <el-main class="kp-main">
    <section class="page-body">

      <div class="page-title">
        <el-button cid="form-header-back" class="back-button" icon="mdi mdi-arrow-left-circle-outline"  v-on:click="$router.push('/idp/document-assignment-rules')">
        </el-button>
        <span class="page-title-text"> {{ pageTitle }}</span>
        <span> Add new document assignment rule and edit existing </span>
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
              <ConfirmModel ref="model"></ConfirmModel>

               <div class="grouping-tile">General configuration</div>
                <el-row :gutter="40">
                    <el-col :span="12">
                      <div class="kp-form-group">
                        <el-form-item prop="name" label="Name">
                          <el-input
                            name="name"
                            cid="doc-assignemnt-name"
                            v-model="form.name"
                            placeholder="Document Assignment rule name"
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
                              cid="doc-assignemnt-document-type-select"
                              v-model="form.document_type"
                              placeholder="Select"
                            >
                              <el-option
                                v-for="(value,index) in doucument_types"
                                :key="value.value"
                                :cid="'doc-assignemnt-document-type_'+index"
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
                            <el-form-item class="control-label col-sm-2" prop="trigger"  label="Events">
                                <el-select class="select-box" size="large" multiple v-model="form.trigger" filterable collapse-tags cid="doc-assignemnt-invoke-select" reserve-keyword placeholder="Please select trigger action">
                                    <el-option v-for="(_type, index) in invokeActions" :cid="'doc-assignemnt-invoke_' + index" :key="_type.value" :label="_type.label" :value="_type.value" label-width="170px"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>

                 <el-row :gutter="40">
                    <el-col :span="12">
                        <div class="kp-form-group">
                            <el-form-item label="Advanced script" >
                                <el-checkbox cid="doc-assignemnt-is-advanced" v-model="form.is_advanced"></el-checkbox>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>

                 <el-row :gutter="40" v-show="!form.is_advanced">
                    <el-col :span="12">
                         <div class="kp-form-group">
                          <el-form-item prop="assigned_group" label="Assigned group">
                              <el-select clearable class="config-value" filterable v-model="form.assigned_group" placeholder="Select Assigned group" v-on:change="onAssignedGroupChange" cid="doc-assignemnt-group-select">
                                <el-option v-for="(item, index) in assignedGroupList" :cid="'doc-assignemnt-group_'+index" v-bind:value="item._id" :key="item._id" :label="item.name"></el-option>
                            </el-select>
                          </el-form-item>
                        </div>
                    </el-col>

                    <el-col :span="12">
                         <div class="kp-form-group">
                           <el-form-item label="Assigned user" prop="assigned_user">
                            <el-select clearable class="config-value" filterable v-model="form.assigned_user" placeholder="Select Assigned user"  cid="doc-assignemnt-users-select">
                                <el-option v-for="(item, index) in assignedUserList" :cid="'doc-assignemnt-users_'+index" v-bind:value="item._id" :key="item._id" :label="item.full_name"></el-option>
                            </el-select>
                        </el-form-item>
                        </div>
                    </el-col>
                </el-row>

              <div class="grouping-divide" v-show="!form.is_advanced"></div>
              <div class="grouping-tile" v-show="!form.is_advanced">Additional configuration</div>

                 <el-row :gutter="40" v-show="!form.is_advanced">
                    <el-col :span="24">
                         <div class=" kp-form-group">
                            <el-form-item id="query-builder" prop="rule" label="Rule" >
                              <QueryBuilder cid="doc-assignemnt-rule" @onQueryChange="onQueryChange" :query="form.rule" :documentType="form.document_type" :dataToShow='["fieldsData", "messages", "errorCode"]'></QueryBuilder>
                              <!-- <vue-query-builder :rules="rules" v-model="form.rule"></vue-query-builder> -->
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>

                 <el-row :gutter="40"  v-if="form.is_advanced">
                    <el-col :span="24">
                          <div class="mb-0 kp-form-group">
                            <el-form-item
                              prop="script"
                              label="Script"
                            >
                              <!-- <codemirror
                                :value="form.script"
                                cid="doc-assignemnt-script"
                                v-model="form.script"
                                :options="editorOptions"
                                :placeholder="placeholder"
                              ></codemirror> -->
                              <KanverseEditor
                                :options="{ 'width': '100%', 'height': '500px', 'language': 'businessRule' }"
                                :content="form.script"
                                :refreshModel="form._id !== undefined"
                                v-model="form.script"
                                @onDidChangeModelContent="handleContentChange">
                              </KanverseEditor>
                            </el-form-item>
                          </div>
                    </el-col>
                </el-row>
              </el-form>
            </div><!-- | panel body -->
            <footer>
            <div></div>
            <div>
              <el-button
              cid="doc-assignemnt-cancel"
                v-on:click="$router.push('/idp/document-assignment-rules')"
                size="small"
              >
                Cancel
              </el-button>
            </div>
            <div>
              <el-button v-if="isSaveActionAllowed"  size="small" cid="doc-assignemnt-save" id="save-btn" :disabled="disableSave" v-on:click="save" type="primary">
                Save
              </el-button>
            </div>
            </footer>
        </div> <!-- | panel -->
      </section> <!-- | form-page-container -->


    </section>
     <VersionRelatedList v-if="showVersionList" :id="form._id"  title="Assignment rule versions"></VersionRelatedList>
  </el-main>
</template>

<script>
let jsonpath = require("jsonpath");
import Constants from "@/resources/Constants";
import Codemirror from "@/components/Codemirror";
import DataTable from "@/components/DataTable.vue";
import VueQueryBuilder from "vue-query-builder";
import DocumentAssignmentRuleService from "@/idp/services/DocumentAssignmentRule";
import FieldService from "@/idp/services/FieldService";
import ConfirmModel from "@/components/ConfirmModel";
import QueryBuilder from "@/idp/pages/QueryBuilder.vue";
import EventBus from "@/EventBus";
import DocumentConfig from "@/idp/services/DeCustomerConfig";
import UserGroupService from "@/idp/services/UserGroupService";
import UserService from "@/idp/services/UserService";
import _ from "lodash";
import VersionRelatedList from "@/idp/components/VersionRelatedList.vue";
import KanverseEditor from "@/components/KanverseEditor";
import Validator from "@/services/Validator";
import formMixin from "@/mixins/formMixin.js";

export default {
  name: "DocumentAssignmentRuleForm",
  mixins: [formMixin],
  components: {
    DataTable,
    Codemirror,
    ConfirmModel,
    VueQueryBuilder,
    QueryBuilder,
    VersionRelatedList,
    KanverseEditor
  },
  data() {
    var QueryBuilderValidator = (rule, value, callback) => {
        if(this.form.is_advanced)
            return callback();
        if(!value.children || !value.children.length){
            callback(new Error("Atleast one rule is required."))
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
      if(!this.form.is_advanced)
            return callback();
      if (!value || ("" + value).trim() === "") {
        callback(new Error("Script cannot be empty"));
        return;
      }
      callback();
    };
    let EmailListValidator = (rule, value, callback) => {
      if(this.form.is_advanced)
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
      placeholder:`/*(() => {
    **
    ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
    Business logic go here.In last set Assigned User / Assigned Group values in context as shown below **
    ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
    context.setAssignedUser('Test user') or '$loggedInUser' for current logged in user
    context.setAssignedUserGroup('TestGroup')or 'loggedInUserGroup' for current logged in group
})();*/`,
      isSaveActionAllowed : true,
      assignedGroupList: [],
      users: [],
      assignedUserList: [],
      groupUserMapping: {},
      rules: [],
      form: {
        name: "",
        document_type: "",
        assigned_group:"",
        assigned_user:"",
        is_advanced: false,
        rule: {
          logicalOperator: "all",
          children: []
        },
        script: "",
        active: true,
        trigger:[Constants.DOCEX.TRIGGER_ACTION.FILE_UPLOAD]
      },
      // invokeActions: Constants.DOCEX.INVOKE_ACTION,
      // At present, we only support file upload and save draft action. In the future, 
      // when we introduce support for additional actions, we'll use INVOKE_ACTION.
      invokeActions: [{
        label: "File upload",
        value: "file_upload"
      },
      {
        label: "Save",
        value: "save"
      }],
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
      triggers:Constants.DOCEX.TRIGGERS_LIST,
      pageTitle: "Document assignment rule",
      disableSave: false,
      showVersionList:true,
      formRules: {
        name: [
          {
            validator: EmptyValueValidator,
            trigger: "blur",
            message: "Please provide document assignment rule name",
          },
          {
            required: true,
            message: "Please provide document assignment rule name",
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
            validator: EmailListValidator,
            trigger: "blur"
          }
        ],
        rule: [
          {
            validator: QueryBuilderValidator,
            trigger: "blur"
          }
        ],
        script: [
          {
            validator: ScriptValueValidator,
            trigger: "blur",
            message: "Syntax errors found.", // This message replaced with actual sytanx error
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
    onAssignedGroupChange() {
        this.form.assigned_user = "";
        this.setAssignedUserList();
        },

    setAssignedUserList() {
            if (!this.form.assigned_group) {
                this.assignedUserList = this.users;
                return;
            }
            this.assignedUserList = this.groupUserMapping[this.form.assigned_group];
            console.log("this.assignedUserList after--------------->",this.assignedUserList)

        },
    async getDocumentType(){
        let docTypeConfig = await DocumentConfig.getAllDocsCustConfiguration({document_type:{$exists:true}});
        this.doucument_types = DocumentConfig.getDocumentTypeList(docTypeConfig,true);
    },
    handleContentChange(event, content){
      this.form.script = content;
    },
    onQueryChange(input){
      this.form.rule = input.val;
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
        let data = await DocumentAssignmentRuleService.fetchById(recordId);
        this.cacheDataModal.isInitialized = true;
        Object.assign(this.form,data);
                this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = {
          ...this.form,
        };

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

    insertRecord() {
      let self = this;
      let groupObj = this.form.assigned_group ? this.assignedGroupList.find(item => item._id === this.form.assigned_group) : null
      let userObj = this.form.assigned_user ? this.users.find(item => item._id === this.form.assigned_user) : null
      this.form["assigned_group_name"]=groupObj && groupObj.name
      this.form["assigned_user_name"]=userObj && userObj.full_name
      this.form["assigned_group"]=groupObj && groupObj._id
      this.form["assigned_user"]=userObj && userObj._id
      DocumentAssignmentRuleService.save(this.form)
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
    this.isSaveActionAllowed = await this.isSaveActionPermitted('de_document_assignment_rule');
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
    let recordId = this.$route.query.id;
    this.init(recordId);
    this.getDocumentType();

    const cpGroupProj = ["name","_id"]
    this.assignedGroupList = await UserGroupService.get({active:true}, cpGroupProj)
    const cpUserProj = ["group_id", "_id", "full_name"]
    this.users = await UserService.fetch({active:true}, cpUserProj)
    this.assignedUserList = this.users;
    let groupId=this.form.assigned_group
    let userId=this.form.assigned_user
    for (let user of this.users){
      if( !user.group_id ){ continue; }
      for(let group of user.group_id){
          if(this.groupUserMapping[group]){
            this.groupUserMapping[group].push(user)
          }else{
            this.groupUserMapping[group]=[user]
          }
        }
    }
    this.form.assigned_group= (_.find(this.assignedGroupList, (group)=>{return group._id == groupId}) || {})._id;
    this.form.assigned_user = (_.find(this.users, (user)=>{return user._id == userId}) || {})._id;
    this.setAssignedUserList();

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
</style>
