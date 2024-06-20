<template>
  <el-main class="kp-main">
    <section class="page-body">

      <div class="page-title">
          <el-button cid="form-header-back" class="back-button" icon="mdi mdi-arrow-left-circle-outline"  v-on:click="onBack">
          </el-button>
          <span class="page-title-text"> {{ pageTitle }}</span>
          <span>  Add new script and edit existing </span>
      </div>

       <section class="form-page-container">
          <div class="panel">
            <div class="panel-body">
              <el-form
                :model="form"
                :rules="formRules"
                ref="form"
                label-position="left"
                label-width="110px"
              >
                <div class="grouping-tile">General  configuration</div>
                <el-row :gutter="40">
                    <el-col :span="12">
                        <div class="kp-form-group">
                          <el-form-item prop="script_name" label="Name">
                            <el-input
                              name="script_name"
                              cid="doc-script-form-name"
                              v-model="form.script_name"
                              placeholder="script name..."
                            ></el-input>
                          </el-form-item>
                        </div>
                    </el-col>

                    <el-col :span="12" v-if="['export','after_extraction', 'after_classification'].includes(form.type)">
                        <div class="kp-form-group">
                            <el-form-item prop="file_type" label="File Type">
                                <el-select cid="script-form-file-type" v-model="form.file_type" placeholder="Select">
                                    <el-option v-for="(item,index) in fileTypes" :cid="'form.file_type_'+index" :key="item.value" :value="item.value" :label="item.label"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>

                <el-row v-if="['export','after_extraction', 'after_classification'].includes(form.type)" :gutter="40">
                    <el-col :span="12">
                        <div class="kp-form-group">
                            <el-form-item prop="document_type" label="Document Type">
                                <el-select cid="script-form-document-type" v-model="form.document_type" placeholder="Select">
                                    <el-option v-for="(item,index) in documentTypes" :cid="'form.document_type_'+index" :key="item.value" :value="item.value" :label="item.label"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>

                    <el-col :span="12">
                        <div class="kp-form-group">
                            <el-form-item prop="document_subtype" label="Document Subtype">
                            <el-input name="document_subtype" cid="script-form-document-subtype" v-model="form.document_subtype" placeholder="Document Subtype..."></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>

                <el-row v-if="form.type==='export'" :gutter="40">
                    <el-col :span="12">
                        <div class="kp-form-group" v-if="form.type==='export'" >
                            <el-form-item prop="script_type" label="Script Type">
                                <el-select cid="script-form-script-type" v-model="form.script_type" placeholder="Select">
                                    <el-option v-for="(item,index) in scriptTypeOptions" :cid="'form.script_type_'+index" :key="item.value" :value="item.value" :label="item.label"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="24">
                        <div class="kp-form-group">
                          <el-form-item prop="script" label="Script">
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
                    v-on:click="$router.push('/idp/script')"
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
     <VersionRelatedList v-if="showVersionList" :id="form._id"  title="Script rule versions"></VersionRelatedList>
  </el-main>
</template>

<script>
import Codemirror from "@/components/Codemirror";
import ScriptService from "@/idp/services/ScriptService";
import EventBus from "@/EventBus";
import CustomerConfig from "@/idp/services/DeCustomerConfig";
import VersionRelatedList from "@/idp/components/VersionRelatedList.vue";
import Constants from "@/resources/Constants";
import KanverseEditor from "@/components/KanverseEditor";
import Validator from "@/services/Validator";
import formMixin from "@/mixins/formMixin.js";

export default {
  name: "ScriptForm",
  mixins: [formMixin],
  components: {
    Codemirror,
    VersionRelatedList,
    KanverseEditor,
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
      form: {
        script_name: "",
        active: true,
        script: "",
        type:'',
        document_type:'',
        script_type:'',
      },
      editorOptions: {
        mode: "text/javascript",
        theme: "default",
      },
      fileTypes: [
        {label: "EXCEL", value: "excel"},
        {label: "PDF", value: "pdf"}
      ],
      scriptTypeOptions: Constants.DOCEX.EXPORT_SCRIPT_TYPES,
      documentTypes: [],
      fields_message_mapping: {
        name: "Please provide Name",
        script: "Script cannot be empty",
        document_type: "Please provide document type"

      },
      pageTitle: "Script",
      disableSave: false,
      rules: {},
      showVersionList:true,
      isSaveActionAllowed:true,
      formRules: {
        script_name: [
          {
            validator: EmptyValueValidator,
            trigger: "blur",
            message: "Please provide Name",
          },
          {
            required: true,
            message: "Please provide Name",
            trigger: "blur",
          },
        ],

        script: [
          {
            validator: Validator.scriptValidator,
            trigger: "blur",
            message: "Syntax errors found.",
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
            ],
        script_type: [
          {
            validator: this.EmptyValueValidator,
            trigger: "blur",
            message: "Please select script type",
          },
          {
            required: true,
            message: "Please select script type",
            trigger: "blur",
          },
        ]
      },
    };
  },

  methods: {
    async init(recordId) {
      try {
        let brData = await ScriptService.fetchById(recordId);
        this.form = Object.assign({}, this.form, brData);
      } catch (error) {
        this.notifyError("Error");
      }
    },

    handleContentChange(event, content){
      this.form.script = content;
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
      ScriptService.save(this.form)
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
    async getDocumentType(){
      const docTypeConfig = await CustomerConfig.getAllDocsCustConfiguration({document_type:{$exists:true}});
      this.documentTypes = CustomerConfig.getDocumentTypeList(docTypeConfig);
    },
    addDocumentTypeValidation() {
      this.$set(this.formRules, "document_type", [{
              validator: this.EmptyValueValidator,
              trigger: "blur",
              message: "Please provide document type",
          },
          {
              required: true,
              message: "Please provide document type",
              trigger: "blur",
          },
      ])
    },
    removeDocumentTypeValidation() {
      this.$delete(this.formRules, "document_type")
    },
    onBack(){
      let url = "/idp/script";
      if ( this.form && this.form.type ){
        let type = this.form.type;
        url = `${url}?type=${type}`;
      }
      this.$router.push(url);
    }  
  },
  created(){
    let routeParams = this.$route.query;
    if( routeParams && routeParams.type ){
      this.form.type = routeParams.type;
    }
  },
  async beforeMount() {
    this.isSaveActionAllowed = await this.isSaveActionPermitted('script');
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
    let recordId = this.$route.query.id;
    this.addFormRules();
    this.getDocumentType();
    if (recordId) this.init(recordId);
  },
};
</script>

<style lang="scss">
@import "../_idpGlobal";
</style>
