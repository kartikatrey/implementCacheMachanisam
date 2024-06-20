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
                       prop="form_name"
                       label="Form Name"
                     >
                       <el-select
                         class="select-box"
                         size="large"
                         cid="field-config-form-request-type-select"
                         v-model="form.form_name"
                         filterable
                         reserve-keyword
                         placeholder="Please select form name"
                       >
                         <el-option
                           v-for="field in deForm"
                           :key=field.value
                           :label=field.label
                           :value=field.label
                           label-width="170px"
                         ></el-option>
                       </el-select>
                     </el-form-item> 
                   </div>
                 </el-col>
                 
                 <el-col :span="12">
                   <div class="kp-form-group">
                     <el-form-item  
                       class="email-template col-sm-2"
                       prop="email_template_id"
                       label="Email Template"
                       
                     >
                       <el-select
                         class="select-box"
                         size="large"
                         v-model="form.email_template_id"
                         filterable
                         reserve-keyword
                         placeholder="Please select email template" 
                       >
                       <el-option
                            v-for="(_type) in emailTemplate"
                            :key="_type.id"
                            :label="_type.email_template_name"
                            :value="_type.id"
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
                      prop="action_name"
                      label="Request Button Name"
                    >
                      <el-input :disabled="form.is_platform"
                        cid="request_action_config_name"
                        class="form-control"
                        prop="name"
                        v-model="form.action_name"
                        placeholder="Provide Request button name"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>

                 <el-col :span="12">
                   <div class="kp-form-group">
                     <el-form-item
                       class="form-label col-sm-2"
                       prop="roles"
                       label="Form Role"
                     >
                       <el-select 
                         class="select-box"
                         size="large"
                         cid="field-config-form-role-select"
                         v-model="form.roles"
                          filterable
                          reserve-keyword
                          multiple
                          collapse-tags
                         placeholder="Please select form roles"
                       >
                       <el-option
                            v-for="role in formNamesList"
                            :key="role.value"
                            :label="role.label"
                            :value="role.value"
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
                          prop="document_type"
                          label="Document Type"
                        >
                          <el-select   :disabled="form.is_platform"
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

                  <el-col :span="12">
                    <div class="kp-form-group">
                      <el-form-item prop="active"  label="Active">
                        <el-checkbox v-model="form.active" cid="dynamic-button-form-active"></el-checkbox>
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
                <el-button size="small" v-on:click="saveForm" type="primary"
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
    </el-main>
  </template>
  
  <script>
  import EventBus from "@/EventBus";
  import Codemirror from "@/components/Codemirror";
  import CustomerConfig from "@/idp/services/DeCustomerConfig";
  import RequestActionService from "../../../app/services/RequestActionService";
  import UserService from "@/idp/services/UserService";
  import EmailService from "@/idp/services/EmailService";
  import FormService from "@/idp/services/FormService"
  import QueryBuilder from "@/idp/pages/QueryBuilder";
  import VersionRelatedList from "@/idp/components/VersionRelatedList.vue";
  
  export default {
    name: "RequestConfigForm",
    components: {
      QueryBuilder,
      Codemirror,
    VersionRelatedList
    },
    data() {
      return {  
        form: {
          form_name: "",
          form_id: "",
          email_template_id: "",
          email_template_name: "",
          action_name: "",
          roles: [],
          document_type: "",
          email_template_type: "",
        },
        showVersionList:true,  
        deForm: [],
        formNamesList:[],
        emailTemplate:[], 
        documentTypes:[],      
        pageTitle: "Form Trigger Action",
        loading: false,
        formRules: {

          action_name:[
            {
              required: true,
              trigger: "blur",
              message: "Please select the field",
            }
          ],
          form_name: [
            {
              required: true,
              trigger: "blur",
              message: "Please select the field",
            },
          ],
          
          email_template_id: [
            {
              required: true,
              trigger: "blur",
              message: "Please select the field",
            },
          ],
          roles: [
            {
              required: true,
              trigger: "blur",
              message: "Please select the field",
            },
          ],
          document_type: [
            {
              required: true,
              trigger: "blur",
              message: "Please select the field",
            },
          ]
        },
      };
    },
    methods: {
      onBack() {
        this.$router.push("/idp/request-form");
      },
      displayList() {
        this.$router.push({ path: "/idp/request-form" });
      },
      getFormIdByFormName(formName){
        const selectedForm = this.deForm.find(form => form.label === formName);
        return selectedForm ? selectedForm.value : null;
      },
      async saveForm() {
        let valid = await this.$refs.form.validate().catch((error) => {});
        if (!valid) {
          return;
        }
        this.showVersionList = false;
        this.loading = true;
        const selectedEmail = this.emailTemplate.find((email) => email.id === this.form.email_template_id);
        this.form.email_template_name = ""; 
        if (selectedEmail) {
          this.form.email_template_name = selectedEmail.email_template_name;
          this.form.email_template_type = selectedEmail.email_template_type
        }
        try {
          this.form['form_id'] = this.getFormIdByFormName(this.form['form_name'])
          const response = await RequestActionService.saveRequestAction(this.form);
          if (_.get(response, "data.code") === 11000) {
            this.notifyError("Request Form name already exist");
            this.loading = false;
            return;
          }
          this.notifySuccess("Record saved successfully");
          this.displayList();
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
            this.setFormRoles(),
            this.setEmails(),
            this.setFormField(),
            this.setDocumentTypes()
          ]); 
          if (buttonConfigId) {
            const response = await RequestActionService.getRequestAction(buttonConfigId);
            this.form = response;
          }
        } catch (err) {
          this.notifyError(err);
        } finally {
          this.loading = false;
        }
      },
      // to fetch and set emails
      async setEmails() {
        try{
          const emails = await EmailService.getEmails({ active: true}, ["name", "type", "subject"]);
          this.emailTemplate = (emails || []).map((email) => {
           //email._id is referred as 'id' to enable the email name column to be clickable.
           return { id: "" + email._id, email_template_name: "" + email.name, email_template_type:""+ email.type };
        });
        }catch(err){
          console.log("set email error: ");
        }
      },
  
      async setFormRoles() {
        try{
          const roles = await UserService.getRoles({ active: true}, ["label"]);
          this.formNamesList = (roles || []).map((role) => {
            return { value: "" + role._id, label: "" + role.label };
          });
         } 
         catch(error) {
            console.log("error")
         }
      },
      async setDocumentTypes() {
        let customerConfigurations = await CustomerConfig.getAllDocsCustConfiguration({
          document_type: { $exists: true, active: true },
        });
        this.documentTypes = CustomerConfig.getDocumentTypeList(customerConfigurations);
      },
      
    async setFormField(){
        try{
          const deFormFields = await FormService.getForm({ active: true}, ["title"]);
          this.deForm = (deFormFields || []).map((field) => {
            return { value: "" + field._id, label: "" + field.title };
          });
         } 
         catch(error) {
            console.log("error")
         }
      }
    },
    async beforeDestroy() {},
    beforeMount() {
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
  