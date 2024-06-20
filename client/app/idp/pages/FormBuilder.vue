<template>
    <el-main class="form-builder-ui-form kp-main">
      <section class="page-body back-button">
        <div class="page-title">
          <el-button
            cid="form-builder-form-header-back"
            icon="mdi mdi-arrow-left-circle-outline"
            v-on:click="backAction"
          ></el-button>
          <span class="page-title-text" v-if="form._id">Edit {{ pageTitle }}</span>
          <span class="page-title-text" v-else>Create {{ pageTitle }}</span>
        </div>
      </section>
      <section class="page-body form-builder-section form-page-container" v-loading="formLoading">
          <div class="panel">
            <div class="panel-body">
              <el-form
                label-position="left"
                :model="form"
                ref="form"
                label-width="120px"
                :rules="formRules"
              >
              <ConfirmModel ref="model"></ConfirmModel>
              <!-- added form title, form name field -->
                <el-row :gutter="40">
                  <el-col :span="12">
                    <div class="kp-form-group">
                      <el-form-item
                          class="control-label col-sm-2"
                          prop="title"
                          label="Title"
                        >
                        <el-input
                            cid="form-title"
                            v-model ="form.title"
                            :rows="2"
                            placeholder="Enter Title"
                          ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="kp-form-group">
                      <el-form-item
                          class="control-label col-sm-2"
                          prop="name"
                          label="Name"
                        >
                        <el-input
                            cid="form-name"
                            v-model ="form.name"
                            :rows="2"
                            placeholder="Enter Name"
                          ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>
              <!-- added document type field with dropdown -->
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
                <el-row :gutter="40">
                    <el-col :span="8">
                        <div class="kp-form-group group_name_main_div">
                          <!-- to take group name input -->
                            <el-form-item
                                class="control-label col-sm-2"
                                prop="group_name"
                            >
                                <el-input
                                cid="group-name"
                                :rows="2"
                                v-model="group_name"
                                placeholder="Enter group name here"
                                ></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="add-group-btn">
                            <el-button
                                size="small"
                                id="group-btn"
                                v-on:click="addGroup"
                                type="primary"
                                :disabled="isGroupDisabled"
                            >Add Group</el-button>
                      </div>
                    </el-col>
                    <el-col :span="4">
                    <div class="kp-form-group">
                      <el-form-item prop="active"  label="Active">
                        <el-checkbox v-model="form.active" cid="dynamic-button-form-active"></el-checkbox>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>
                  <!-- Render rectangle-box with content like-group name, delete group icon, edit group field, add field btn,
                     respetive draggable fields for each group etc. -->
                    <div v-for="(group, index) in groups" :key="index" class="group-rectangle">
                      <div class="group-label">
                        <el-divider>{{ group.group_name }}</el-divider>
                        <el-tooltip content="Click here to delete group" placement="bottom" effect="light">
                          <el-button
                            size="mini"
                            class="delete-group-button"
                            @click="deleteGroup(index)"
                            icon="el-icon-close"
                            type="danger"
                          ></el-button>
                        </el-tooltip>
                      </div>  
                      <!-- Repeatable groups -->
                        <el-row :gutter="40" class="dynamic-form-builder-group kp-form-group">
                          <el-col :span="24">
                          <el-form-item class="control-label col-sm-2" label="Enable Repetition">
                            <el-tooltip content="Check to allow multiple entries of this section." placement="top" effect="light">
                              <el-checkbox v-model="group.repeatable" @change=handleRepeatableChange(group)></el-checkbox> 
                            </el-tooltip>
                          </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row :gutter="40" class="dynamic-form-builder-group kp-form-group">
                          <el-col :span="12">
                            <el-form-item  label="Allow duplicate">
                              <el-tooltip :content="!group.repeatable ? 'Please enable repeatation to edit duplicate check.' : 'Enable to allow duplicate entries in the section'"  placement="bottom" effect="light" >
                                <div class="allow-duplicate-toggle" :class="{ 'allow-duplicate-disabled': !group.repeatable }">
                                  <toggle-button 
                                    :sync="true" 
                                    cid="allow-duplicate-toggle" 
                                    :color="{ checked: '#5f8fdf', unchecked: '#DCDFE6', disabled: '#CCCCCC'}" 
                                    :labels="{ checked: 'YES', unchecked: 'NO' }"
                                    :disabled="!group.repeatable"
                                    v-model="group.allow_duplicate">
                                  </toggle-button>
                                </div>
                              </el-tooltip>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                          <el-form-item class="control-label col-sm-2" label="Enter button name: " :rules="[group.repeatable ? { required: true, trigger: 'blur' } : {}]">
                            <el-tooltip :content="group.repeatable ? 'The repetition button is visible in the section.' : 'Please enable repeatation to edit button name.'" placement="bottom" effect="light">
                              <el-input 
                              placeholder="Repeatable section button name" 
                              class="duplicate-section-button dynamic-form-builder-group-input" 
                              v-model="group.buttonName"
                              :disabled="!group.repeatable"
                              >
                            </el-input> 
                            </el-tooltip>
                          </el-form-item>
                          </el-col>
                        </el-row>
                      <!-- giving edit/delete option for group> -->
                      <el-row :gutter="40" class="dynamic-form-builder-group kp-form-group">
                        <el-col :span="12">
                        <el-form-item
                          class="control-label col-sm-2"
                          label="Edit Group Name: ">
                            <el-input
                              v-model="group.group_name"
                              @change="updateGroupName(group)"
                            ></el-input>
                        </el-form-item>
                        </el-col>
                       <!--added field to insert order for groups  -->
                       <el-col :span="12">
                          <el-form-item
                            class="control-label col-sm-2"
                            label="Order of group"
                          >
                            <el-input
                              type="number"
                              :min="1"
                              v-model="group.order"
                              @change="updateGroupOrder(group)"
                              placeholder="E.g. 1"
                            ></el-input>
                          </el-form-item>
                          </el-col>
                        </el-row>  
                          <!-- After clicking on this btn dialog of slushbucket will come for selecting fields -->
                        <div class="add-field-btn">
                            <el-button
                                size="small"
                                id="group-btn"
                                v-on:click="selectFieldsForGroup(group)"
                                type="primary"
                            >Add Field</el-button>
                        </div>
                    <!-- draggable component is used to make field draggable and dropable and to maintain sequence of fields also -->
                        <draggable v-model="group.fields" :options="draggableOptions" class="draggable-component">
                        <div class="list-group-item" v-for="(element) in group.fields" :key="element">
                          {{ element }}
                        </div>
                      </draggable>
                    </div>
                <el-row>
                    </el-row>
                    <!-- dialog containing slushbucket for selecting fields -->
                    <el-dialog 
                      class="form-field-selection-dialogue"
                      title="Select Fields" 
                      :visible.sync="showSlushBucketModal"
                      :close-on-click-modal="false">
                      <div class="form-field-modal-body">
                        <DualListBox
                        :source="fieldSelection.source"
                        :destination="fieldSelection.destination"
                        label="label"
                        @onChangeList="(changedData) => {onFieldsChange(changedData)}"/>
                      </div>
                      <el-divider class="field-modal-divider"></el-divider>
                      <div class="modal-bottom-btns">
                        <el-button @click="hideFieldModal"  size="small">Cancel</el-button>
                        <el-button @click="saveFieldModal" size="small" type="primary">Save</el-button>
                      </div>      
                    </el-dialog>

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
import FieldService from "@/idp/services/FieldService";
import draggable from 'vuedraggable';
import DualListBox from "@/idp/components/DualListBox.vue";
import SlushBucketService from "@/idp/services/internal/SlushBucketService";
import FormBuilderService from "@/idp/services/FormBuilderService";
import Constants from '@/resources/Constants';
import ConfirmModel from "@/components/ConfirmModel";
import _ from "lodash";
export default {
    name: "FormBuilder",
    components: {
      ConfirmModel,
        draggable,
        DualListBox,
    },
    data(){
      return {
        draggableOptions: {
        animation: 100, // Animation duration (milliseconds)
        group: 'fields', // Group identifier for the draggable items
      },
      pageTitle: "Form",
      defaultForm:{
        title:"",
        name:"", 
        document_type: "",
        document_subtype:"",
        schema:[]
      },
      form:{
        title:"",
        name:"", 
        document_type: "",
        document_subtype:"",
        schema:[],
        active:true
      },
      documentTypes: [],
      documentSubtypeList:[],
      docTypeConfiguration:"",
      headerFields : [],
      tableFields : [],
      isGroupDisabled:true,
      group_name:"",
      //removed "Default Group" as currenlty we dont have any provision written to add fields at root level directly in schema.
      groups: [],
      fieldSelection:{
        source:[],
        destination:[]
      },
      activeGroup:"",
      showSlushBucketModal:false,
      isFormEdited: false,
      saveAction:false,
      //defined rules for mandatory fields
      formRules: {
        title: [{ required: true, message: 'Please enter title', trigger: 'blur' }],
        name: [{ required: true, message: 'Please enter name', trigger: 'blur' }],
        document_type: [{ required: true, message: 'Please select Document Type', trigger: 'blur' }],
      },
      formLoading : false
    };
  },
  methods:{
    /*method to perform initial required actions like: setting document_type and subtype, setFields based on that
     and also setting all data based on response for -> edit action */
    async init(){
      this.formLoading = true;
      const currentRecordId = this.$route.query.id;
      await this.setDocumentTypes();

      if(currentRecordId){ // Handled when creating new form
        await this.setCurrentRecordOnEdit(currentRecordId);
      }

      this.setDocumentSubtypes();
      this.formLoading = false;
    },
    /* purpose of method: to set response data for current id */
    async setCurrentRecordOnEdit(currentRecordId){
      //for edit action: id is passed to service, to fetch the data for given id.
      const projection=["name","title","document_type", "document_subtype", "schema", "active"]
          const FormDataResponse = await FormBuilderService.getFormDataById(currentRecordId, projection);
          Object.assign(this.form, FormDataResponse);
          //add group btn sould be enabled after we have document_type present in response!
          this.isGroupDisabled=false;

          this.setFields(); // we don't need to wait for fields we need all fields while saving the form 

          /* now we have to prepare "groups" array based on schema: 
          Iterate through the schema and add fields to the groups
           */
          this.form.schema.forEach((item) => {
            if (item.type === 'group') {
              // If it's a group, create a new group object
              const group = {
                group_name: item.label,
                order:item.order || 1,
                fields: [],
                buttonName : item["add-label"] || "",
                repeatable : item.repeatable || false,
                allow_duplicate : item.allow_duplicate
              };
              // Add the group to the groups array
              this.groups.push(group);
              // Iterate through the children of the group(to get fields for given group)
              item.children && item.children.forEach((childItem) => {
                // Add the field label to the group's fields array
                group.fields.push(childItem.label);
              });
            }
          });
          this.defaultForm = { ...this.form };
    },
    /**
     * Purpose : Show field data in slush bucket
     * @param { Object } group
     * Usage : Set selected fields and unSelected fields in the slush bucket
     */
    selectFieldsForGroup(group) {
      const isGrpRepeatable = group.repeatable;
      const selectedFields = group.fields || [];

      // Convert the selectedFields array into the expected format for slushbucket
      const selectedFieldsNames = selectedFields.map((fieldLabel) => {
        return { label: fieldLabel };
      });

      //prepared source and destination data for slushbucket(dual-listbox)
      if(isGrpRepeatable){
        this.fieldSelection = SlushBucketService.prepareSlushbucketFieldsData(this.tableFields, selectedFieldsNames);
      } else {
        this.fieldSelection = SlushBucketService.prepareSlushbucketFieldsData(this.headerFields, selectedFieldsNames);
      }

      this.activeGroup = group;
      this.showSlushBucketModal = true;
    },
    async handleRepeatableChange(group){
      // If the user sets 'repeatable' to true, display a warning message explaining that group configurations will be reset.
      // This reset is necessary because, when 'repeatable' is unchecked, the fields configured in the group are of 'header' type.
      // However, when 'repeatable' is checked, the user needs to configure fields of 'table' type.
      if(group.fields && group.fields.length){
        const isConfirm = await this.notifyConfirm("Group configurations will be erased out. Are you sure you want to continue?", "Confirm", "warning")
        if(isConfirm){
          group.fields = []
        }
      }
      group.buttonName = "";
    },
    //method to hide modal after clicking on cancel btn in dialog box 
    hideFieldModal() {
      this.fieldSelectionStatus = false;
      this.showSlushBucketModal = false;
    },
    //method to set field dynamiclly and save data after saving action on dialog-box of slushbucket
    saveFieldModal(){
      this.showSlushBucketModal = false;
      /* we have already set activeGroup when we clicked on "Add field", now we will use this to set
       fields for current-activeGroup only*/
      
      // Find the group in this.groups with the matching group_name
      const groupIndex = this.groups.findIndex((group) => group.group_name === this.activeGroup.group_name);
      if (groupIndex !== -1) {
        // Update the fields property of the found group with fieldSelection
        this.groups[groupIndex].fields = this.fieldSelection.destination.map((field)=>{return field.label});
      }

    },    
    // method to fetch document_types and then set it in form: 
    async setDocumentTypes() {
      const docTypeConfig = await CustomerConfig.getAllDocsCustConfiguration({
        document_type: { $exists: true },
      });
      this.docTypeConfiguration = docTypeConfig;
      this.documentTypes = CustomerConfig.getDocumentTypeList(this.docTypeConfiguration);
    },
     //method to get document subtypes based on document_types and then set it in form
    setDocumentSubtypes() {
      if (this.form.document_type) {
        //keeping data related to current doc_type only(so that now we will have doc_subtype data for current doc_type only)
        let docConfig = _.find(this.docTypeConfiguration, (config) => config.document_type === this.form.document_type);
        if (docConfig["document_subtype_list"]) {
          this.documentSubtypeList = _.map(
            docConfig["document_subtype_list"], (item) => {
              return { label: item, value: item }
            }
          )
        }
      }
    },
    //method to enable add group action only if document type is there and to set docSubtype based on docType, then set fields based on both
    async onDocumentTypeChange(){
        if (this.form.document_type) {
        this.isGroupDisabled=false;
        this.groups=[],
        this.form.document_subtype="";
        this.setDocumentSubtypes();
        await this.setFields();
      }
    },
    //set field based on changed document subtype
    async onDocumentSubtypeChange(){
        this.groups=[],
        await this.setFields();
    },
    //method to fetch and then set field based on document type 
    async setFields() {
      try {
        const projection = ["_id", "label", "field_type", "name", "type", "placeholder", "options"];
        const filter = { document_type: this.form.document_type };
        const FIELD_TYPES = Constants.DOCEX.FIELD_TYPES;
        if(this.form.document_subtype){
          filter["document_subtype"] = this.form.document_subtype;
        }
        const allFields = await FieldService.getFieldsList(filter, projection);
        this.headerFields = allFields.filter(field => field.field_type === FIELD_TYPES.HEADER);
        this.tableFields = allFields.filter(field => field.field_type === FIELD_TYPES.TABLE);
      } catch (error) {
        console.log("Error while getting fields:", error);
        this.notifyError("Error while getting field data");
      }
    },
    //method to redirect page
    backAction(){ 
        this.$router.push('/idp/form-list');
    },
    /**
     * @Purpose : Get field from allFields by label name
     * @usage : By isGrpRepeatable key we return field from table or header field
     */
    getFieldByLabel(fieldLabel, isGrpRepeatable) {
      let field = null;
      const FIELD_TYPES = Constants.DOCEX.FIELD_TYPES;
      if (isGrpRepeatable) {
        field = this.tableFields.find((field) => field.label === fieldLabel && field.field_type === FIELD_TYPES.TABLE);
      } else {
        field = this.headerFields.find((field) => field.label === fieldLabel && field.field_type === FIELD_TYPES.HEADER);
      }
      return field;
    },
    /**
     * Purpose : Converts select field options into a key-value object.
     * @example
     * Input : [ { key: "1", value: "Primary" }, { key: "2", value: "Secondary" } ]
     * Output : { "1": "Primary", "2": "Secondary" }
    */
    getSelectOptions(selectField) {
      return selectField.options.reduce((acc, option) => {
        acc[option.key] = option.value;
        return acc;
      }, {});
    },
    /**
     * @Purpose : Vue formulate libaray field types are different for some fields
     * So we mapped that field types and save that field type in the de_form
     */
    getFieldType(fieldType) {
      const fieldTypeMap = {
        "string" : "text",
        "dropdown" : "select",
      }
      // If our type are differents then return from map else return as it is
      return fieldTypeMap[fieldType] || fieldType;
    },
    /**
     * @Purpose : Create schema of the form to store in db
     * @Usage : 
     *  Step 1. We checked if repeatable group is checked and button name is not entered then we return
     *  Stpe 2. Create group level schema with form data
     *  Step 3. At last push each group in schema object
     *  Step 4. Set schema in the form 
     */
    createSchema() {
      const schema = [];
      // Iterate through each group in the groups array
      this.groups.forEach((group) => {
        const isGrpRepeatable = group.repeatable;
        const groupSchema = {
          type: 'group',
          order: group.order,
          name: group.group_name.toLowerCase().trim().replace(/\s+/g, "_"),
          label: group.group_name,
          allow_duplicate : group.allow_duplicate,
          children: [],
          repeatable : isGrpRepeatable, // Vue formulate key for repeatable sections
          "add-label" : isGrpRepeatable && group.buttonName // Vue formulate button name for repeatable sections
        };
        // Iterate through the fields in the group
        group.fields.forEach((fieldLabel) => {
          const field = this.getFieldByLabel(fieldLabel, isGrpRepeatable);
          if(!field) {
            return ;
          }
          const fieldSchema = {
            label: fieldLabel,
            name: field.name,
            placeholder : field.placeholder || "",
          };

          fieldSchema.type = this.getFieldType(field.type);

          // For select type field make options in key value pair
          if (fieldSchema.type == "select" && field.options) {
            fieldSchema.options = this.getSelectOptions(field);;
          }
          groupSchema.children.push(fieldSchema);
        });
        schema.push(groupSchema);

      });
      // Set the generated schema to the form data
      this.form.schema = schema;
    },
    async validateForm(){
      let isValid = false;
      isValid = await this.$refs.form.validate().catch((error) => {});
      this.groups.forEach((group) => {
        if(group.repeatable && !group.buttonName){
          isValid = false;
          return;
        }
      });
      
      return isValid;
    },

    async saveForm(){
      this.saveAction=true;
      const valid = await this.validateForm();
      if (!valid) {
        this.notifyError("Please fill all the required fields in the form.");
        return;
      }
      //preparing schema in required format before saving it.
      this.createSchema();
      //if any group is not added then show msg as we need atleast 1 group
      if(_.isEmpty(this.form.schema)){
        this.notifyError("Please add atleast 1 group");
        return;
      }
      try {
        //calling service for saving data in de_role_access table
        const saveFormDataResponse = await FormBuilderService.saveFormData(this.form);
        if (_.get(saveFormDataResponse, "data.code") === 11000) {
          this.notifyError("Record already exists! Please update the existing record.");
          return;
        }

        this.notifySuccess("Record saved successfully");
        this.backAction();
      } catch (err) {
        console.log(err);
        this.notifyError("Error while saving data");
        return;
      }
    },
    //method to add a new group in groups array 
    addGroup() {
      if (this.group_name.trim() !== '') {
        const newGroup = {
          group_name: this.group_name,
          buttonName : "",
          repeatable : false,
          allow_duplicate : false,
          "add-label" : "",
          fields: [],
        };
        this.groups.push(newGroup);
        this.group_name = ''; // Clear the input field
      }
    },
    /* method to delete group after clicking close-icon, here we are passing index
    to find record with given index for deletion */
    deleteGroup(index) {
      // Check if the group index is valid
      if (index >= 0 && index < this.groups.length) {
        // Remove the group at the specified index
        this.groups.splice(index, 1);
      }
    },
    //set source and destination after changing fields in slushbucket
    onFieldsChange({ source, destination }){
      this.$set(this.fieldSelection, "source", source);
      this.$set(this.fieldSelection, "destination", destination);
    },
    //method to update grop name dynamically on edit group action
    updateGroupName(group) {
      // Update the group name in the groups array
      const index = this.groups.indexOf(group);
      if (index !== -1) {
        this.groups[index].group_name = group.group_name;
      }
    },
    // Method to update the "order" and then sort groups.
    updateGroupOrder(group) {
      const index = this.groups.indexOf(group);
      const orderValue = parseInt(group.order);
      this.groups[index].order = orderValue;
      this.sortGroups()
    },

    // Method to sort the groups based on their "order" property
    sortGroups() {
      this.groups.sort((a, b) => a.order - b.order);
    },
  },
  async beforeMount() {
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
    await this.init();
  },
  //for edit action: confirming to discard or maintain current changes in form, before leaving the page(used existing confirmModal dialog)
  beforeRouteLeave: function (to, from, next) {
    this.createSchema();
    //find if default form and current edited form are different, if yes then we can show confirm-dialog before leaving page
    this.isFormEdited = Object.keys(this.form).some(field =>{ 
      if(this.form[field] !== this.defaultForm[field]){
        return true;
      }
    })
    if (this.isFormEdited && !this.saveAction) {
      return this.$refs.model.open(next);
    } else{
      return next();
    }
  },
 
}
</script>

<style scoped lang="scss">
.add-group-btn{
  padding:2px;
  margin: 5px;
}
.group-rectangle {
  display: flex;
  flex-direction: column; 
  background-color: #ffffff;
  padding: 20px;
  margin-bottom: 15px; 
  border: 1px solid #ccc;
  position: relative; /* Required for absolute positioning of delete button */
}
.draggable-component{
    cursor: move; 
    background-color: #f5f5f5; 
    padding: 5px; 
    margin: 5px 0; 
}
.group-label {
  display: flex;
  justify-content: space-between; 
  /* Center vertically */
  align-items: center; 
  margin-bottom: 1rem;
}
.delete-group-button {
  cursor: pointer;
  background-color: #ffffff;
  border: none;
  font-size: 18px;
  color: #eb4d4d; 
}
/* we require 2 fields in 1 row so added this css for it */
.list-group-item {
  display: inline-block;
  width: 40%; 
  box-sizing: border-box;
  border: 1px solid;
  background-color:#dfd7d7;
  padding:1%;
  margin: 1%;
}
.dynamic-form-builder-group {
  /* width:40%; */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-tooltip.dynamic-form-builder-group-input.el-input.is-disabled{
  background-color: #f1f1f1;
}
.allow-duplicate-toggle{
  width : 25%;
}
.allow-duplicate-disabled{
  cursor: not-allowed;
}
</style>
