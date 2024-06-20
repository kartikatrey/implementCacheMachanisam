<template>
  <el-main class="kp-main">
    <section class="page-body">

      <div class="page-title">
          <el-button cid="form-header-back" class="back-button" icon="mdi mdi-arrow-left-circle-outline"  v-on:click="backRoute">
          </el-button>
          <span class="page-title-text"> {{ pageTitle }}</span>
          <span>  Add new script and edit existing</span>
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
                <div class="grouping-tile">General  configuration</div>
                <el-row :gutter="40">
                    <el-col :span="12">
                        <div class="kp-form-group">
                          <el-form-item prop="name" label="Name">
                            <el-input
                              name="name"
                              cid="doc-script-form-name"
                              v-model="form.name"
                              placeholder="name..."
                            ></el-input>
                          </el-form-item>
                        </div>
                    </el-col>
             
                    <el-col :span="12">
                          <div class="kp-form-group">
                            <el-form-item prop="system" label="System name">
                              <el-select
                                name="system"
                                clearable
                                filterable
                                cid="doc-script-form-system-select"
                                v-model="form.system"
                                placeholder="Select"
                              >
                                <el-option
                                  v-for="(value,index) in system_names"
                                  :cid="'doc-script-form-system_'+index"
                                  :key="value.system_name"
                                  :value="value.system_name"
                                  :label="value.system_name"
                                ></el-option>
                              </el-select>
                            </el-form-item>
                          </div>
                    </el-col>
                </el-row>

             <el-row :gutter="40">
                  <el-col :span="12">
                      <div class="kp-form-group">
                          <el-form-item prop="document_type" label="Document type">
                              <el-select cid="doc-script-form-doc-type-select" name="document_type" clearable filterable v-model="form.document_type" placeholder="Select">
                                  <el-option v-for="(value,index) in doucument_types" :cid="'doc-script-form-doc-type_'+index" :key="value.value" :value="value.value" :label="value.label"></el-option>
                              </el-select>
                          </el-form-item>
                      </div>
                  </el-col>
          
                    <el-col :span="12">
                          <div class="kp-form-group">
                            <el-form-item prop="type" label="Type">
                              <el-select
                                name="type"
                                clearable
                                filterable
                                cid="doc-script-form-type-select"
                                v-model="form.type"
                                placeholder="Select"
                              >
                                <el-option
                                  v-for="(value,index) in script_types"
                                  :cid="'doc-script-form-type_'+index"
                                  :key="value.value"
                                  :value="value.value"
                                  :label="value.label"
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
                            prop="script"
                            label="Script"
                          >
                            <!-- <codemirror
                            cid="doc-script-form-script"
                              :value="form.script"
                              v-model="form.script"
                              :options="editorOptions"
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
                    v-on:click="backRoute"
                    cid="doc-script-form-cancel"
                    size="small"
                  >
                    Cancel
                  </el-button>
                </div>
                <div>
                  <el-button v-if="isSaveActionAllowed" cid="doc-script-form-save" id="save-btn" :disabled="disableSave" v-on:click="save"   size="small" type="primary">
                    Save
                  </el-button>
                </div>
              </footer>
          </div> <!-- | panel -->
      </section> <!-- | form-page-container -->

    </section>
    <VersionRelatedList v-if="showVersionList" :id="form._id"  title="UI Script rule versions"></VersionRelatedList>
  </el-main>
</template>

<script>
import Constants from "@/resources/Constants";
import Codemirror from "@/components/Codemirror";
import DocumentScriptService from "@/idp/services/DocumentScriptService";
import EventBus from "@/EventBus";
import CustomerConfig from "@/idp/services/DeCustomerConfig";
import SystemService from "../../services/SystemService";
import CustomerService from "@/idp/services/CustomerService";
import VersionRelatedList from "@/idp/components/VersionRelatedList.vue";
import KanverseEditor from "@/components/KanverseEditor";
import Validator from "@/services/Validator";
import formMixin from "@/mixins/formMixin.js";

export default {
  name: "DocumentScriptForm",
  mixins: [formMixin],
  components: {
    Codemirror,
    KanverseEditor,
    VersionRelatedList
  },
  data() {
    var emptyValueValidator = (rule, value, callback) => {
        value && ("" + value).trim() === "" ? callback(new Error("Please enter valid label name")) : callback();
    };
    return {
      form: {
        name: "",
        system:"",
        active: true,
        script: "",
        type:'',
        document_type:''
      },
      editorOptions: {
        mode: "text/javascript",
        theme: "default",
      },
      system_names:Constants.DOCEX.SYSTEM_NAME_LIST,
      doucument_types: [],//Constants.DOCEX.DOCUMENT_TYPE_LIST,
      script_types:Constants.DOCEX.SCRIPT_TYPE_LIST,
      fields_message_mapping: {
        name: "Please provide Name",
        script: "Script cannot be empty",
        document_type: "Please provide document type"

      },
      pageTitle: "Script",
      disableSave: false,
      showVersionList:true,
      isSaveActionAllowed:true,
      formRules: {
        name: [
          {
            validator: emptyValueValidator,
            trigger: "blur",
            message: "Please provide Name",
          },
          {
            required: true,
            message: "Please provide Name",
            trigger: "blur",
          },
        ],

         system: [
          {
            validator: emptyValueValidator,
            trigger: "blur",
            message: "Please select System Name",
          },
          {
            required: true,
            message: "Please select System Name",
            trigger: "blur",
          },
        ],
         type: [
          {
            validator: emptyValueValidator,
            trigger: "blur",
            message: "Please select type",
          },
          {
            required: true,
            message: "Please select type",
            trigger: "blur",
          },
        ],
        script: [
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
        script: [
          {
            validator: emptyValueValidator,
            trigger: "blur",
            message: "Script cannot be empty",
          },
          {
            required: true,
            message: "Script cannot be empty",
            trigger: "blur",
          },
        ],
        document_type: [{
                    validator: this.EmptyValueValidator,
                    trigger: "blur",
                    message: "Please select document type",
                },
                {
                    required: true,
                    message: "Please select document type",
                    trigger: "blur",
                },
            ]
      },
    };
  },

  methods: {
    async init(recordId) {
      try {
        let brData = await DocumentScriptService.fetchById(recordId, ["-updated_by","-updated_at","-created_by","-created_at"]);
        this.form = Object.assign({}, this.form, brData);
      } catch (error) {
        this.notifyError("Error");
      }
    },
    async save() {
      this.disableSave = true;
      this.showVersionList = false;
      this.$setLoader({target: "#save-btn", spinner: "el-icon-loading"});
      let valid = await this.$refs.form.validate().catch((error) => {});
      if (!valid) {
        this.$resetLoader();
        this.disableSave = false;
        return;
      }
      return this.insertRecord();
    },
    handleContentChange(event, content){
      this.form.script = content;
    },
    insertRecord() {
      DocumentScriptService.save(this.form)
        .then((response) => {
          this.form = response.data;
          this.notifySuccess("Record saved successfully");
        })
        .catch((error) => {
          this.notifyError("Error while processing");
        }).finally(() => {
          this.$resetLoader();
          this.disableSave = false;
          this.showVersionList = true;
        })
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
    async getDocumentType(){
          const docTypeConfig = await CustomerConfig.getAllDocsCustConfiguration({document_type:{$exists:true}});
          this.doucument_types = CustomerConfig.getDocumentTypeList(docTypeConfig);
    },
    async getCustomerSystemNames(){
          /* 
           * Purpose: This code snippet is responsible for adding configured customer systems to the existing system list
           * whenever we need to use or configure a third-party customer system in our portal or configuration. It serves
           * the purpose of managing and integrating various customer systems seamlessly.
           */
          this.system_names = await CustomerService.getCustomerSystemNames();
    },
    backRoute(){
      this.$router.push(`/idp/document-script?type=${this.form.type}`)
    }
  },
  async beforeMount() {
    this.isSaveActionAllowed = await this.isSaveActionPermitted('de_document_script');
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
    let recordId = this.$route.query.id;
    this.getDocumentType();
    this.getCustomerSystemNames();
    if (recordId) this.init(recordId);
  },
};
</script>

<style lang="scss">
@import "../_idpGlobal";
</style>
