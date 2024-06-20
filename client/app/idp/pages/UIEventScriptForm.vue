<template>
  <el-main class="kp-main">
    <section class="page-body">

      <div class="page-title">
          <el-button cid="form-header-back" class="back-button" icon="mdi mdi-arrow-left-circle-outline"  v-on:click="getRoute()">
          </el-button>
          <span class="page-title-text"> {{ pageTitle }}</span>
          <span>  Add new UI event script and edit existing </span>
      </div>

       <section class="form-page-container">
          <div class="panel">
            <div class="panel-body">
              <el-form
                :model="form"
                :rules="formRules"
                ref="form"
                label-position="left"
                label-width="150px"
              >

                <el-row :gutter="20">
                    <el-col :span="10">
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
                </el-row>


             <el-row :gutter="20">
                    <el-col :span="10">
                                <div class="kp-form-group">
                                    <el-form-item prop="document_type" label="Document type">
                                        <el-select cid="doc-script-form-doc-type-select" name="document_type" clearable filterable v-model="form.document_type" placeholder="Select">
                                            <el-option v-for="(value,index) in doucument_types" :cid="'doc-script-form-doc-type_'+index" :key="value.value" :value="value.value" :label="value.label"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </el-col>
             </el-row>
             <el-row :gutter="20">
                    <el-col :span="10">
                          <div class="kp-form-group">
                            <el-form-item prop="system" label="UI event">
                              <el-select
                                name="ui_event"
                                clearable
                                filterable
                                cid="doc-script-form-ui-event-select"
                                v-model="form.event"
                                placeholder="Select"
                              >
                                <el-option
                                  v-for="(value,index) in ui_events"
                                  :cid="'doc-script-form-ui-event'+index"
                                  :key="value.value"
                                  :value="value.value"
                                  :label="value.label"
                                ></el-option>
                              </el-select>
                            </el-form-item>
                          </div>
                    </el-col>
                </el-row>
                <!-- <el-row :gutter="20">
                    <el-col :span="10">
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
                </el-row> -->
                <el-row :gutter="20">
                    <el-col :span="24">
                        <div class="kp-form-group">
                          <el-form-item
                            prop="script"
                            label="Before Event"
                          >
                           <el-tooltip
                                content="This script will be excuted in browser before calling server script"
                                placement="top"
                                effect="light"
                            >
                              <span style="margin-left: -70px;" class="material-icons icon-error-radio">error</span>
                            </el-tooltip>
                            <!-- <codemirror
                            cid="doc-script-form-script"
                              :value="form.pre_script"
                              v-model="form.pre_script"
                              :options="editorOptions"
                            ></codemirror> -->
                            <KanverseEditor
                              :options="{ 'width': '100%', 'height': '500px', 'language': 'businessRule' }"  
                              :content="form.pre_script" 
                              :refreshModel="form._id !== undefined"
                              v-model="form.pre_script" 
                              @onDidChangeModelContent="handleContentChangeBefore">
                            </KanverseEditor>
                          </el-form-item>
                        </div>
                    </el-col>
                </el-row>

                 <el-row :gutter="20">
                    <el-col :span="24">
                        <div class="kp-form-group">
                          <el-form-item
                            prop="script"
                            label="Server Script"
                          >
                           <el-tooltip
                                content="This is a server script, which will be executed at server side"
                                placement="top"
                                effect="light"
                            >
                              <span style="margin-left: -70px;" class="material-icons icon-error-radio">error</span>
                            </el-tooltip>
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
                              @onDidChangeModelContent="handleContentChangeServer">
                            </KanverseEditor>
                          </el-form-item>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <div class="kp-form-group">
                          <el-form-item
                            prop="script"
                            label="After Event"
                          >
                           <el-tooltip
                                content="This script will be excuted in browser after calling server script"
                                placement="top"
                                effect="light"
                            >
                              <span style="margin-left: -70px;" class="material-icons icon-error-radio">error</span>
                            </el-tooltip>
                            <!-- <codemirror
                            cid="doc-script-form-script"
                              :value="form.post_script"
                              v-model="form.post_script"
                              :options="editorOptions"
                            ></codemirror> -->
                            <KanverseEditor
                              :options="{ 'width': '100%', 'height': '500px', 'language': 'businessRule' }"  
                              :content="form.post_script" 
                              :refreshModel="form._id !== undefined"
                              v-model="form.post_script" 
                              @onDidChangeModelContent="handleContentChangeAfter">
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
                    v-on:click="getRoute()"
                    cid="doc-script-form-cancel"
                    size="small"
                  >
                    Cancel
                  </el-button>
                </div>
                <div>
                  <el-button cid="doc-script-form-save" id="save-btn" :disabled="disableSave" v-on:click="save"   size="small" type="primary">
                    Save
                  </el-button>
                </div>
              </footer>
          </div> <!-- | panel -->
      </section> <!-- | form-page-container -->

    </section>
  </el-main>
</template>

<script>
import Constants from "@/resources/Constants";
import navigation from "@/mixins/navigation.js";
import Codemirror from "@/components/Codemirror";
import DocumentScriptService from "@/idp/services/DocumentScriptService";
import $ from "jquery";
import EventBus from "@/EventBus";
import KanverseEditor from "@/components/KanverseEditor";
import CustomerConfig from "@/idp/services/DeCustomerConfig";
import Validator from "@/services/Validator";


export default {
  name: "DocumentScriptForm",
  components: {
    Codemirror,
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
        name: "",
        field_id:"",
        active: true,
        script: "",
        event:"",
        post_script:"",
        pre_script: "",
        type:"Field",
        document_type: ""
      },

      editorOptions: {
        mode: "text/javascript",
        theme: "default",
      },
      ui_events : Constants.DOCEX.UI_EVENTS_LIST,
      doucument_types: [],//Constants.DOCEX.DOCUMENT_TYPE_LIST,
      script_types:Constants.DOCEX.SCRIPT_TYPE_LIST,
      fields_message_mapping: {
        name: "Please provide Name",
        script: "Script cannot be empty",
        document_type: "Please provide document type"

      },
      pageTitle: "UI script",
      disableSave: false,
      rules: {},

      formRules: {
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
        pre_script: [
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
        post_script: [
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
        name: [
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


         type: [
          {
            validator: EmptyValueValidator,
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
            validator: EmptyValueValidator,
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
        let brData = await DocumentScriptService.fetchById(recordId);
        this.form = Object.assign({}, this.form, brData);
      } catch (error) {
        this.notifyError("Error");
      }
    },
    async save() {
      this.disableSave = true;
      this.$setLoader({
        target: "#save-btn",
        spinner: "el-icon-loading"
       });
      let valid = await this.$refs.form.validate().catch((error) => {
        // this.notifyError(error);
      });
      if (!valid) {
        this.$resetLoader();
        this.disableSave = false;
        return;
      }
      return this.insertRecord();
    },
    handleContentChangeBefore(event, content){
      this.form.pre_script = content;
    },
    handleContentChangeServer(event, content){
      this.form.script = content;
    },
    handleContentChangeAfter(event, content){
      this.form.post_script = content;
    },
    getRoute(){
        this.$router.push(`/idp/field-config-form?id=${this.form.field_id}&fromPage=UIEventScript`)
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
            this.doucument_types = CustomerConfig.getDocumentTypeList(docTypeConfig);
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
  },
  beforeMount() {
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
    let recordId = this.$route.query.id;
    this.addFormRules();
    this.getDocumentType();
    this.form.field_id = this.$route.query.field_id;
    this.form.document_type = this.$route.query.document_type;
    if (recordId) this.init(recordId);
  },
};
</script>

<style lang="scss">
@import "../_idpGlobal";
</style>
