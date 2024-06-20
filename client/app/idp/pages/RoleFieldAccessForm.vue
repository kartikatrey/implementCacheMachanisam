<template>
    <el-main class="role-field-access-form kp-main">
      <section class="page-body back-button">
        <div class="page-title">
          <el-button
            cid="role-field-access-form-header-back"
            icon="mdi mdi-arrow-left-circle-outline"
            v-on:click="backAction"
          ></el-button>
          <span class="page-title-text" v-if="form._id">Edit {{ pageTitle }}</span>
          <span class="page-title-text" v-else>Add {{ pageTitle }}</span>
        </div>
      </section>
      <section class="page-body role-field-access-form-section form-page-container">
          <div class="divider-body">
            <el-divider content-position="left">Role Fields</el-divider>
          </div>
          <div class="panel">
            <div class="panel-body">
              <el-form
                label-position="left"
                :model="form"
                ref="form"
                label-width="120px"
                :rules="formRules"
              >
              <!-- added form label field -->
                <el-row :gutter="40">
                  <el-col :span="12">
                    <div class="kp-form-group">
                      <el-form-item
                          class="control-label col-sm-2"
                          prop="role_label"
                          label="Role Label"
                        >
                        <el-input
                            cid="role-label"
                            v-model ="role_label"
                            :rows="2"
                            placeholder
                            :disabled="isRoleLabelDisabled"
                          ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <!-- added "type" field which will be disabled and set as "fields" -->
                  <el-col :span="12">
                    <div class="kp-form-group">
                      <el-form-item
                          class="control-label col-sm-2"
                          prop="type"
                          label="Type"
                        >
                        <el-input
                            cid="type"
                            v-model ="form.type"
                            :rows="2"
                            placeholder
                            :disabled="isTypeDisabled"
                          ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>
              <!-- added document type field -->
                <el-row :gutter="40">
                  <el-col :span="12">
                    <div class="kp-form-group">
                      <el-form-item
                        class="control-label col-sm-2"
                        prop="document_type"
                        label="Document Type"
                      >
                        <el-select
                          v-model="form.document_type"
                          placeholder="Select Document Type"
                          @change="onDocumentTypeChange"
                        >
                          <el-option
                            v-for="docType in documentTypes"
                            :key="docType.value"
                            :label="docType.label"
                            :value="docType.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </el-col>
                  <!-- added document subtype field with dropdown-->
                  <el-col :span="12">

                    <div class="kp-form-group">
                      <el-form-item
                        class="control-label col-sm-2"
                        prop="document_subtype"
                        label="Document Subtype"
                      >
                        <el-select
                          v-model="form.document_subtype"
                          placeholder="Select Document Subtype"
                          @change="onDocumentSubtypeChange"
                        >
                          <el-option
                            v-for="docType in documentSubtypeList"
                            :key="docType.value"
                            :label="docType.label"
                            :value="docType.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>
              <!-- added slushbucket for fields selection-->
                <el-row :gutter="40" v-if="form.document_type">
                        <el-divider content-position="left">Fields</el-divider>
                          <div class="panel-body">
                          <section>
                              <div class="table-wrap">
                                  <DualListBox
                                      :source="selectionFields.source"
                                      :destination="selectionFields.destination"
                                      label="label"
                                      @onChangeList="(changedData) => {onslushBucketFieldChange(changedData)}"
                                  />
                              </div>
                          </section>
                          </div>
                </el-row>
              
              </el-form> 
            </div>
            <footer>
              <div>
              </div>
              <div>
                <el-button size="small" v-on:click="backAction" >Cancel</el-button>
              </div>
              <div>
                <el-button
                  size="small"
                  id="register-btn"
                  v-on:click="saveForm"
                  type="primary"
                  :disabled="isSaveBtnDisabled"
                  >Save</el-button
                >
              </div>
            </footer>
          </div>
      </section>
    </el-main>
  </template>

<script>
import CustomerConfig from "@/idp/services/DeCustomerConfig";
import UserAccessService from "@/idp/services/UserAccessService";
import DualListBox from "@/idp/components/DualListBox.vue";
import FieldService from "@/idp/services/FieldService";
import SlushBucketService from "@/idp/services/internal/SlushBucketService";

export default {
    name: "RoleFieldAccessForm",
    //Using slushbucket component for field selection
    components: {
      DualListBox 
    },
    data(){
      return {
      pageTitle: "Role Field Access",
      role_label: "",
      form: {
        role_id:"", 
        type:"fields",
        document_type: "",
        document_subtype:"",
        fields: [],
      },
      selectionFields:{
        source:[],
        destination:[]
      },
      roleRecord:"",
      roleID:"",
      //disabled "role label" and "type" field. 
      isRoleLabelDisabled: true,
      isTypeDisabled:true,
      documentTypes: [],
      fieldOptions: [],
      documentSubtypeList:[],
      docTypeConfiguration:"",
      isSaveBtnDisabled:true,
      //defined rules for mandatory fields
      formRules: {
        document_type: [{ required: true, message: 'Please select Document Type', trigger: 'blur' }],
      },
    };
  },
  methods:{
    //method to perform inital actions like setting role label, document_type, fetching fields depending on document_type selected,  
    init(){
      const currentRecordId = this.$route.query.id;
      // using vue store to get roleRecord which was created in roles-form page
      this.roleRecord=this.$store.getters['userAccessStore/getCurrentRecord']
      this.roleID=this.roleRecord._id;
      this.setFormRoleName();
      this.setDocumentTypes();
      //edit case
      if(currentRecordId){
       this.setCurrentRecordOnEdit(currentRecordId);
      }    
    },
    //method to save form:
    async saveForm() {
      //saving fields-name based on selection of fields in slushbucket.
      this.form.fields= this.selectionFields.destination.map(field=>{ return {field_name:field.name }});
      const valid = await this.$refs.form.validate().catch((error) => {});
      if (!valid) {
        console.log("not valid");
        return;
      }
      try {
        //calling service for saving data in de_role_access table
        const saveFieldAccessServiceResponse = await UserAccessService.saveRoleFieldDetails(this.form);
        if (_.get(saveFieldAccessServiceResponse, "data.status") == 400) {
					this.notifyError((_.get(saveFieldAccessServiceResponse, "data.message")) || "Record already exists!");
					return;
				}
        this.notifySuccess("Record saved successfully");

      } catch (err) {
        this.notifyError("Error while saving data");
        return;
      }
      this.$router.push(`/idp/roles-form?id=${this.roleID}`);
    },
    // method to fetch document_types: 
    async setDocumentTypes() {
         this.docTypeConfiguration = await CustomerConfig.getAllDocsCustConfiguration({
          document_type: { $exists: true, active: true },
        });
        this.documentTypes = CustomerConfig.getDocumentTypeList(this.docTypeConfiguration);
    },
    //method to set document subtypes based on document_types
    setDocumentSubtypes(){      
      let self = this;
      //keeping data related to current doc_type only(so that now we will have doc_subtype data for current doc_type only)
      let docSubTypes = _.find(
        self.docTypeConfiguration,
        function (config) {
          return config.document_type === self.form.document_type;
        }
      );
      this.documentSubtypeList = _.map(
        docSubTypes["document_subtype_list"],
        function (item) {
          return { label: item, value: item };
        }
      );
    },
    // method to set role id and role name.
    setFormRoleName() {
        this.form.role_id= this.roleID;
        this.role_label = this.roleRecord.label;
    },
    /* method to set fields in form dropdown which are dependent on document_type selected. So, called 
    this method after onchange on "document_type" */
    onDocumentTypeChange() {
      if (this.form.document_type) {
        this.form.document_subtype="";
        this.setDocumentSubtypes();
        this.setFields();
      }
    },
    //method to fetch fields based on document_subtype
     onDocumentSubtypeChange(){
       this.setFields();
    },
    /* purpose: to fetch and set fields depending upon: document_type, document_subtype, and "type":"fields".
    step 1. reset previous selected fields
    step 2: add filter and projection to fetch fields based on document_type
    step 3: if document_subtype is present then add it to filter
    step 4: after getting field list, prepared slushbucket having source:all fields, destination:current fields.
    step 5: return fields.
    */
   //this function will called on change of document_type/document_subtype 
    async setFields(){
        this.form.fields = [];
        const projection = ["label", "name"];
        const fieldListParams = {
          document_type: this.form.document_type,
        };
        const docSubtype=this.form.document_subtype
        docSubtype && (fieldListParams["document_subtype"]=docSubtype);
        try {
          const fieldsVal = await FieldService.getFieldsList(fieldListParams, projection);
          if(fieldsVal.length){
            this.fieldOptions = fieldsVal.map((field) => {
            return { value: field.name, label: field.label };
           });
          }else{
            this.fieldOptions=[];
          }
          //prepare slushbucket fields based on fields fetched.
          const fieldValues = this.form.fields.map(field => field.field_name);

          this.selectionFields = SlushBucketService.prepareSlushbucketFieldsData(this.fieldOptions || [], fieldValues || []) ;
          //if not getting response for selectionfields, then again defining them in format required for slushbucket 
          if(!this.selectionFields){
              this.selectionFields = {
                source: [],
                destination: [],
              };
          }
                 
        } catch (error) {
          console.log("Error while getting fields:", error);
        }
    },
    //method to redirect page
    backAction(){
      //redirect to roles-form page when roleID is set. 
      if(this.roleID){
        this.$router.push(`/idp/roles-form?id=${this.roleID}`);
      } 
    },
    //method to handle dynamic selection of source and destination fields
    onslushBucketFieldChange({ source, destination }) {
            this.$set(this.selectionFields, "source", source);
            this.$set(this.selectionFields, "destination", destination);
            //enabled save btn only after fields are selected
            if(this.selectionFields.destination && this.selectionFields.destination.length){
              this.isSaveBtnDisabled=false;
            } 
    },
    //method to set record data after edit action choosen
    async setCurrentRecordOnEdit(currentRecordId){
       //for edit action: id is passed to service, to fetch the data for given id.
          const projection=["document_type", "document_subtype", "fields"]
          const roleFieldDetailsResponse = await UserAccessService.fetchRoleFieldDetailsById(currentRecordId, projection);
          this.form._id=roleFieldDetailsResponse._id;
          this.form.document_type = roleFieldDetailsResponse.document_type || "";
          this.form.document_subtype=roleFieldDetailsResponse.document_subtype || "";
          // to set fields after document_type and subtype(if present) selected.
          await this.setFields();
          const newFields = this.fieldOptions
          const selectedFieldNames = roleFieldDetailsResponse.fields.map((field) => field.field_name);
          const mappedFields=[];
          //code to set destination fields based on response-fields, then assign destination-fields data to form.fields 
          for (const fieldValue of newFields) {
            const isFieldInResponse = selectedFieldNames.includes(fieldValue.value);
            if (isFieldInResponse) {
              const mappedField = {
                value: fieldValue.value,
                label: fieldValue.label
              };
              mappedFields.push(mappedField);
            }
          }
          this.form.fields = mappedFields.map(field=>{ return {field_name:field.name }});
          //when editing form slushbucket will have data in destination:mappedFields already so passing it and all Fields(newFields) as parameter.
          this.selectionFields = SlushBucketService.prepareSlushbucketFieldsData(newFields, mappedFields);
    }
  },
  async beforeMount() {
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
    await this.init();
  },
}
</script>