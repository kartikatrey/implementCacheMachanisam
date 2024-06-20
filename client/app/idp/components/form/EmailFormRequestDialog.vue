<template>
  <section>
    <div class="form-request-button">
    <el-button
    v-for="deFormActionRecord in deRequestFormActionRecords"
    :key="deFormActionRecord._id"
    type="primary"
    size="small"
    @click="handleButtonClick(deFormActionRecord)"
    >
      {{ deFormActionRecord.action_name }}
    </el-button>
  </div>
  <el-dialog
    title="Email Request"
    width="32%"
    :visible.sync="isDialogVisible"
    :close-on-click-modal="false"
    @close="onClose"
  >
  <el-divider content-position="left">Email Request Form</el-divider>
    <div class="form-container" v-loading="loading">
      <el-form ref="form" :model="form" :rules="formRules" label-width="55px" @keydown.enter.prevent.native>
        <el-form-item label="Email" prop="email">
          <el-input placeholder="Please enter a valid email" v-model="form.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-divider></el-divider>
        <div class="button-container">
          <el-button size="small" @click="isDialogVisible = false" class="kp-btn-form-outline">Cancel</el-button>
          <el-button type="primary" :disabled="!form.email" size="small" @click="submitForm">Submit</el-button>
        </div>
      </span>
    </div>
  </el-dialog>
 </section>
</template>
<script>
import RequestActionService from '../../../services/RequestActionService';
import RequestFormService from '../../../services/requestFormService';
import Validator from "@/services/Validator";
  
export default {
  name: "EmailFormRequestDialog",
  props: ['documentType'],
  data() {
    return {
        loading: false,
        isDialogVisible: false,
        selectedActionRecord: {},
        deRequestFormActionRecords: {},
        deActionRecords: [],
        form: {
            email: ''
        },
        formRules: {
          email: [
            {
              validator: Validator.emailValidator,
              required: true,
              type: 'email',
            }
          ]
        },
    };
  },
  methods: {
    /**
     * PURPOSE: To send the form request on registered email
     * Step 1: Validate the email address
     * Step 2: Prepare the payload required for sending the request form on email
     * Step 3: Initiate the process of sending the request form
     * Step 4: Reset the form fields
     */
    async submitForm() {
      try{
        let isValid = true;
        this.$refs.form.validate((valid) => {
          if (!valid) {
            isValid = false;
            return;
          }
        })
        if(!isValid) return;
        this.loading = true; 

        const payload = {
          form_id: this.selectedActionRecord['form_id'],
          roles: this.selectedActionRecord['roles'],
          email_template: this.selectedActionRecord['email_template_name'],
          email: this.form['email'],
          document_type: this.selectedActionRecord['document_type']
        }
        this.loading = false;
        this.$refs['form'].resetFields();
        this.isDialogVisible = false;
        this.notifySuccess("Your request is being processed. You will be notified once it is completed.");

        const requestFormResponse = await RequestFormService.sendFormRequest(payload.form_id, payload);
        if(requestFormResponse.status){
          this.notifySuccess(_.get(requestFormResponse, "", "Registration link has been successfully sent to registered email"))
          this.$emit("emailRequestComplete", null, requestFormResponse);
        }else {
          this.notifyError(_.get(requestFormResponse,"", "Something went wrong while sending the registration link"))
          this.$emit("emailRequestComplete", true, requestFormResponse);
        } 
      }catch(error){
        this.notifyError(_.get(error, "", "Something went wrong while sending the registration link"))
        this.$emit("emailRequestComplete", error, null);
      }
    },
    onClose() {
      this.$refs['form'].resetFields();
      this.isDialogVisible = false;
    },
    handleButtonClick(deActionRecord) {
      this.selectedActionRecord = deActionRecord;
      this.isDialogVisible = true
    }
  },
  async beforeMount() {
    try {
      const filter = {document_type: this.documentType, active: true};
      //Get all request form action buttons based on document type from de_request_form_action
      const requestFormActionRecordResponse = await RequestActionService.getRequestFormActions(filter)
      if(Array.isArray(requestFormActionRecordResponse) && requestFormActionRecordResponse.length > 0){
        this.deRequestFormActionRecords =  requestFormActionRecordResponse;
      }
    }catch(error) {
      console.error('Failed to get action buttons', error.toString());
    }
  }
};
</script>
    
  <style lang="scss">
  .button-container {
    display: flex;
    justify-content: end;
  }
  </style>
    