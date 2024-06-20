<template>
    <el-main class="kp-main kp-main-dynamic" v-if="isFormConfigPresent">
      <section class="page-body" v-loading="loading">
        <h2 class="form-title">{{ formConfig.form_title }}</h2>
        <el-row v-if="formMessages && formMessages.length">
          <FormMessages :messages="formMessages" :key="refreshMessages"></FormMessages>
        </el-row>
        <el-row class="dynamic-form">
          <DynamicForm 
          v-if="renderForm"
          @formDataChanged="handleFormDataChanged" 
          @formConfigChange="handleFormConfigChange"
          :formData.sync="formData" 
          :formId="formId" 
          :globalProps="globalProps"
          :documentId="documentId"
          :documentType="document.document_type"
          ref="DynamicForm"
          />
        </el-row>
        <el-row>
          <DocumentAttachments
          v-if="renderForm"
          @updateAttachmentCount="handleAttachmentCountChange"
          :documentId="documentId"
          :documentType="document.document_type"
          :disabled="globalProps && globalProps.disabled"
          :viewType="document.view_type"
          ></DocumentAttachments>
        </el-row>
        <el-row>
          <div class="W9-form-message">
            *In order to proceed, please submit the W-9 form by uploading at least one of the necessary attachments.
          </div>
        </el-row>
        <el-row style="position:sticky"  class="dynamic-form-buttons">
          <el-button v-if="showSaveBtn" type="primary" size="small" v-on:click="saveDraft">Save Draft</el-button>
          <el-button v-if="showSubmitBtn" type="primary" size="small" v-on:click="submitForm">Submit</el-button>
          <el-button v-if="showPublishBtn" type="primary" size="small" v-on:click="publishForm">Publish</el-button>
          <el-button v-if="showSendApprovalBtn" type="primary" size="small" v-on:click="callApprovalWorkflow">Send For Approval</el-button>
          <el-button v-if="showApproveBtn" type="primary" size="small" v-on:click="approveWaitingDocument">Approve</el-button>
          <el-button v-if="showRejectBtn" type="primary" size="small" v-on:click="rejectWaitingDocument">Reject</el-button>
        </el-row>
      </section>
      <div class="send-for-approval-commentMsg">
            <el-dialog
            title="Warning"
            :visible.sync="dialogFormVisible">
            <div>
                <el-form @submit.prevent.native :model="commentMsgForm">
                    <span class="comment-title">Comments</span>
                    <div class="kp-form-group">
                        <el-input  cid="idp-comment-message-dialog" type="textarea" v-model="commentMsgForm.commentMsg" autocomplete="off"></el-input> 
                    </div>
                </el-form>
            </div>
            <el-row class="footer_row">
                <el-button @click="dialogFormVisible = false">Cancel</el-button>
                <el-button size="medium" type="primary" @click="sendForApproval()"
                >Send</el-button
                >
            </el-row>
        </el-dialog>
      </div>
      <!-- Added v-if condition to make sure current document record is retrieved from database and further publish action is taken on current document only. -->
      <publish-dialog v-if="document && document._id" @hide="handlePublishDialogClose" :publishDialogVisible="publishDialogVisible" :documentVueStorePath="formDataVueStorePath"></publish-dialog>
    </el-main>
    <div v-else>
      <!-- to show msg on UI when form config not present -->
        <p class="message-for-null-formconfig">Form Configuration not found.</p>
    </div>
</template>
  
  <script>
  import DynamicForm from '@/idp/components/form/DynamicForm';
  import FormMessages from '@/idp/components/form/FormMessages';
  import DocumentAttachments from '@/idp/components/DocumentAttachments';
  import PublishDialog from "@/idp/components/PublishDialog";
  import DocumentService from '@/idp/services/DocumentService';
  import ApprovalService from "@/idp/services/ApprovalService";
  import DynamicFormService from '@/idp/services/DynamicFormService';
  import DeCustConfigService from "@/idp/services/DeCustomerConfig";
  import Constants from '@/resources/Constants';
  import _ from "lodash";

  export default {
    name:"FormViewer",
    components: {
        DynamicForm,
        FormMessages,
        DocumentAttachments,
        PublishDialog
    },
    data() {
      return {
        "documentId": null,
        "document": null,
        "documentData" : null,
        "approvalData" : [],
        "formDisabled": false,
        "customerConfiguration" : {},
        "refreshMessages":0,
        "formMessages": null,
        "formData":{},
        "renderForm" : false,
        "formId": null,
        "globalProps": {disabled: false},
        "loading" : false,
        "userRoles" : [],
        "formConfig":{},
        "documentType": null,
        "dialogFormVisible" : false,
        "commentMsgForm": {
          commentMsg: ""
        },
        "showSaveBtn" : false,
        "showSubmitBtn" : false,
        "showPublishBtn" : false,
        "showSendApprovalBtn" : false,
        "showApproveBtn" : false,
        "showRejectBtn" : false,
        "isFormSaved" : false,
        "isApprovalEnabled":false,
        "publishDialogVisible": false,
        "formDataVueStorePath" : "formViewStore/getFormData",
        "initialFormData": {},
        "isFormConfigPresent":true,
        "attachmentCount": 0
      }
    },
    methods: {
      isFormDataChanged() {
      return !_.isEqual(this.formData, this.initialFormData);
      },
      toggleButtons() {
        if(this.document.stage == Constants.DOCEX.STAGE.PUBLISHED){
          return ;
        }
        this.showSaveBtn = this.showSaveButton();
        this.showSubmitBtn = this.showSubmitButton();
        this.showPublishBtn = this.showPublishButton();
        this.showSendApprovalBtn = this.showSendApprovalButton();
        this.showApproveBtn = this.showDocumentApproveReject(Constants.PLATFORM_ACTION_BUTTON.APPROVE);
        this.showRejectBtn = this.showDocumentApproveReject(Constants.PLATFORM_ACTION_BUTTON.REJECT);
      },
      /*
      * Visible for VENDOR ONBOARDING, PUBLISHER, CUSTOMER-ADMIN, AND REVIEWER ROLES.
      * Visible if the document stage is CONFIRMED, EXTRACTED, or REJECTED
      * Visible If Document is Publish failed
      */
      showSaveButton() {
        const documentStagesMap = Constants.DOCEX.STAGE;
        const isBtnEnabledBasedOnUserRole = this.isButtonEnabledForUserRole(Constants.PLATFORM_ACTION_BUTTON.SAVE);
        return isBtnEnabledBasedOnUserRole && 
              (this.isVendorUser() && this.document.stage == documentStagesMap.EXTRACTED) || 
              (this.isAdminUser() && (_.includes([documentStagesMap.EXTRACTED, documentStagesMap.CONFIRMED, documentStagesMap.APPROVAL_REJECTED], this.document.stage) || this.isDocPublishFailed()));
      },
      /*
      * Visible only when the user role contains VENDOR ONBOARDING and the document stage is EXTRACTED.
      */
      showSubmitButton() {
        const isBtnEnabledBasedOnUserRole = this.isButtonEnabledForUserRole(Constants.PLATFORM_ACTION_BUTTON.SUBMIT);
        return isBtnEnabledBasedOnUserRole && _.includes([Constants.DOCEX.STAGE.EXTRACTED], this.document.stage);
      },
      /*
      *   Publish - Visible when

      * - User role contains PUBLISHER, CUSTOMER-ADMIN, AND PUBLISHER-ONLY ROLES.
      * - The document is in confirmed stage but approval is not enabled
      * - The document is in approved stage
      * - The document is publish failed
      */
      showPublishButton() {
        const isBtnEnabledBasedOnUserRole = this.isButtonEnabledForUserRole(Constants.PLATFORM_ACTION_BUTTON.PUBLISH);
        return (
          this.document && isBtnEnabledBasedOnUserRole && (this.isStageConfirmedWithoutApproval() || this.isDocApproved() || this.isDocPublishFailed())
        );
      },
      /*
      * Visible when the user role contains PUBLISHER AND CUSTOMER-ADMIN ROLES and the document stage is CONFIRMED or APPROVAL_REJECTED.
      */
      showSendApprovalButton(){
        const documentStagesMap = Constants.DOCEX.STAGE;
        const isBtnEnabledBasedOnUserRole = this.isButtonEnabledForUserRole(Constants.PLATFORM_ACTION_BUTTON.SEND_FOR_APPROVAL)
        return this.isApprovalEnabled && isBtnEnabledBasedOnUserRole && _.includes([documentStagesMap.CONFIRMED, documentStagesMap.APPROVAL_REJECTED], this.document.stage);
      },
      /*
      * Visible when there is approval data, user role contain APPROVER ROLE, and the document stage is WAITING_FOR_APPROVAL.
      */
      showDocumentApproveReject(buttonType){
        const isBtnEnabledBasedOnUserRole = this.isButtonEnabledForUserRole(buttonType)
        return this.approvalData && isBtnEnabledBasedOnUserRole && _.includes([Constants.DOCEX.STAGE.WAITING_FOR_APPROVAL], this.document.stage);
      },
      isDocPublishFailed() {
        return (this.document.state == Constants.DOCEX.STATE_PUBLISHED.FAILED && !_.isEmpty(this.document.publish_failure_reason))
      },
      isStageConfirmedWithoutApproval(){
        return _.includes(Constants.DOCEX.STAGE.CONFIRMED, this.document.stage) && !this.isApprovalEnabled;
      },
      isDocApproved() {
        return _.includes(
            [Constants.DOCEX.STAGE.APPROVED],
            this.document.stage
        );
      },
      isButtonEnabledForUserRole(buttonType){
        const userRolesMap = Constants.DOCEX.ROLES_MAP;
        const actionButtonsMap = Constants.PLATFORM_ACTION_BUTTON;
        const actionButtonRolesMap = {
          [ actionButtonsMap.SUBMIT ] : [ userRolesMap.IDP_VENDOR_ONBOARDING ],
          [ actionButtonsMap.SAVE ] : [ userRolesMap.IDP_VENDOR_ONBOARDING, userRolesMap.IDP_PUBLISHER, userRolesMap.IDP_CUSTOMER_ADMIN, userRolesMap.IDP_REVIEWER ],
          [ actionButtonsMap.PUBLISH ] : [ userRolesMap.IDP_PUBLISHER, userRolesMap.IDP_CUSTOMER_ADMIN, userRolesMap.IDP_PUBLISHER_ONLY ],
          [ actionButtonsMap.SEND_FOR_APPROVAL ] : [ userRolesMap.IDP_PUBLISHER, userRolesMap.IDP_CUSTOMER_ADMIN ],
          [ actionButtonsMap.APPROVE ] : [ userRolesMap.IDP_APPROVER ],
          [ actionButtonsMap.REJECT ] : [ userRolesMap.IDP_APPROVER ]
        }
        const allowedRoles = actionButtonRolesMap[buttonType];
        return allowedRoles.some(role => this.userRoles.includes(role));
      },
      isDocumentContainErrors() {
        if (this.formMessages.filter((message) => message && message.message_type === "ERROR").length)
            return true;
        return false
      },
      isAdminUser(){
        return _.includes(this.userRoles, Constants.DOCEX.ROLES_MAP.IDP_CUSTOMER_ADMIN);
      },
      isVendorUser(){
        return _.includes(this.userRoles, Constants.DOCEX.ROLES_MAP.IDP_VENDOR_ONBOARDING);
      },
      handleFormDataChanged(formData){
        // triggerd when any data changed in form  
        this.formData = formData
      },
      handleFormConfigChange(configData){
        // triggerd when any data changed in form  
        //purpose: we get status:true when form config is present 
        this.isFormConfigPresent=_.get(configData, 'status') || false;
        this.formConfig = configData.formConfig
        this.formMessages = configData.formMessages
        this.refreshMessages += 1
      },
      handleAttachmentCountChange(attachmentCount){
        this.attachmentCount=attachmentCount
      },
      /**
       * Determines whether the form should be disabled based on the document stage and user roles.
       * @param {string} stage - The current document stage.
       * 1) Intially form will be disabled 
       * 2) If current user contains ADMIN ROLE ->
       *    document stage is "Extracted" or "Confirmed" or "Approval Rejected" OR Form is publish failed - Form will be editable
       * 3) If current user contains VENDOR ROLE and document stage is "Extracted" - Form will be editable 
       */
      isFormDisabled(stage) {
        const documentStagesMap = Constants.DOCEX.STAGE;

        this.formDisabled = true;
        if (this.isAdminUser() && (stage === documentStagesMap.EXTRACTED ||
                                   stage === documentStagesMap.CONFIRMED || 
                                   stage === documentStagesMap.APPROVAL_REJECTED || 
                                   this.isDocPublishFailed())) {
          this.formDisabled = false; // Form will be editable
        }
        if(this.isVendorUser() && stage === documentStagesMap.EXTRACTED){
          this.formDisabled = false; // Form will be editable
        }
        // Set the disabled property in globalProps, to be used in Dynamic Form.
        this.globalProps["disabled"] = this.formDisabled;
      },

      /**
       * Saves the form data as a prediction in document_data and run the validation 
       */
      async saveDraft(){
        try{
          if(!this.isFormDataChanged()){
            this.notifyError("No changes were made on the form");
            return;
          }
          
          const hasDuplicates = this.$refs.DynamicForm.checkForDuplicateSections();
          if(hasDuplicates){
            this.notifyError("Duplicate sections found in the form please review them.");
            return ;
          }
          
          this.loading = true;
          // Convert the form data to doc data prediction 
          const prediction = DynamicFormService.convertFormDataToPrediction(this.formData, this.formConfig.schema);
  
          // Prepare the params for saving the document
          const params = {
            prediction,
            document_id: this.documentId,
            action: Constants.DOCEX.TRIGGER_ACTION.FORM_SAVE,
            document_type: _.get(this.document, "document_type")
          };
          
          // Save the document and run the validation
          await DocumentService.processAction(params);
          this.notifySuccess("Vendor data saved successfully")
          await this.refreshComponent();
        } catch(error) {
          console.log(error);
          this.notifyError("Something went wrong while saving the vendor data")
        }
        this.loading = false;
        this.isFormSaved = true;
      },
      async submitForm() {
        const isConfirm = await this.notifyConfirm("Are you sure you want to submit this form ?", "Submit", "warning");
        if (!isConfirm) return;
        // If attachment is uploaded and form data is updated or if form is getting submitted without saving the data, show error message
        if (this.attachmentCount && this.isFormDataChanged() || !this.isFormSaved) {
          return this.notifyError("Please save the data before proceeding");
        }
        if (this.isDocumentContainErrors()) {
          return this.notifyError("Please resolve the errors before proceeding");
        }
        if(this.attachmentCount==0){
          return this.notifyError("Please upload at least one attachment");
        }
        try {
          this.loading = true;
          // Mark stage of document to Confirmed
          const data = {
            payload: { stage: Constants.DOCEX.STAGE.CONFIRMED },
            action: Constants.DOCEX.TRIGGER_ACTION.FORM_SUBMIT,
            document_id: this.documentId,
            document_type: this.document.document_type,
            view_type: this.document.view_type,
            form_id: this.formId
          };
          const response = await DocumentService.processAction(data);
          this.notifySuccess(_.get(response, "message", "Form submitted successfully"));
          await this.refreshComponent();
        } catch (error) {
          console.log(error);
          this.notifyError("Error while submitting the form");
        }
        this.loading = false;
      },
      publishForm() {
        if (this.isDocumentContainErrors()) {
            return this.notifyError("Please resolve the errors before proceeding with the publish");
        }
        if(this.isFormDataChanged()){
          this.notifyError("Please save the data before proceeding");
          return;
        }
        this.publishDialogVisible = true;
      },
      async callApprovalWorkflow() {
        if(this.isFormDataChanged()){
          this.notifyError("Please save the data before proceeding");
          return;
        }
        if (this.isDocumentContainErrors()) {
            return this.notifyError("Please resolve the errors before proceeding for approval");
        }
        this.dialogFormVisible = true
      },
      async sendForApproval() {
        try {
          this.dialogFormVisible = false;
          this.loading = true;
          const comment = this.commentMsgForm.commentMsg || ""
          const response = await DocumentService.callApprovalWorkflow(this.documentId, comment);
          if (response.data && _.get(response, "data.status")) {
            this.notifySuccess("Request sent for approval successfully.");
          } else {
            this.notifyError(_.get(response, "data.message"));
          }
        } catch (e) {
          console.error("", e);
          this.notifyError("Error while processing.");
        }
        this.loading = false;
        this.commentMsgForm.commentMsg = "";
        await this.refreshComponent();
      },
      async approveWaitingDocument() {
        const params = {status:"Approved", action:"approve"};
        await this.approveRejectWaitingDocument(params);
      },
      async rejectWaitingDocument() {
        const params = {status:"Rejected", action:"reject"};
        await this.approveRejectWaitingDocument(params);
      },
      async setApprovalData() {
        let approvalRequest = await ApprovalService.getApprovalRequest({ documentId: this.documentId });
        this.$nextTick(() => {
          approvalRequest = _.get(approvalRequest, 'data.data');
          this.approvalData = approvalRequest
        })
      },
      async getApproveRejectNotePrompt(status) {
        try {
          return await this.$prompt('Please enter note', '', {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            inputType: 'textarea',
            closeOnClickModal: false,
            customClass: 'document-approve-reject-popup',
            inputValidator: (value) => {
              if (status === Constants.DOCEX.APPROVAL_STATUS.REJECTED) {
                return value ? true : 'Rejection note is required.';
              }
            },
          }).catch(e => {
            console.error(e);
          });
        } catch (error) {
          console.error(error);
          return null;
        }
      },
      async approveRejectWaitingDocument(params) { //status,action
        const approvalStatusKey = Constants.DOCEX.APPROVAL_STATUS;
        try {
          let confirmModal = await this.$confirm(`Are you sure you want to  ${params.action} ?`, "Confirmation", {
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            type: "warning"
          }).catch(e => {
            console.error(e)
          });
          if (!confirmModal) return;

          let comment = "";
          if (params.status === approvalStatusKey.REJECTED || params.status === approvalStatusKey.APPROVED) {
            const approveRejectNotePrompt = await this.getApproveRejectNotePrompt(params.status);
            if (!approveRejectNotePrompt || approveRejectNotePrompt.action != 'confirm') return;
            comment = approveRejectNotePrompt.value;
          }

          this.loading = true;
          let data = {
            status: params.status,
            approval_id: this.approvalData._id,
            comment: comment,
            action: params.action,
            document_id: this.documentId,
          };
          const response = await ApprovalService.processApproval(data);
          this.showRejectBtn = false;
          this.showApproveBtn = false;
          this.loading = false;
          const responseStatus = _.get(response, "data.data.success");
          if(responseStatus){
            this.notifySuccess( _.capitalize(params.action) + " action completed successfully");
          } else {
            this.notifyError("Error while processing the request");
          }
        } catch (error) {
          console.error(error)
          this.notifyError("Error while processing the request");
        }
      },
      handlePublishDialogClose(params) {
        this.publishDialogVisible = false;
        params ? this.refreshComponent() : "";
      },
      /**
       * Initializes the component by fetching document data and setting up form parameters.
       * Step 1. Get logged in user roles and formId from URL
       * Step 2. Get de_document and de_document_data for current form
       * Step 3. Check if form is disabled on basis of document stage ( e.g stage : "Published" form is disabled for all users )
       * Step 4. Get all customer configuration for approval of form
       * Step 5. If approval is enabled then fetch approval data from approval table
       * Step 6. Configure all the buttons for form based on form stage and user roles
       * Step 7. Convert form prediction to vue formulate schema
       * Step 8. Show Form to user
       */
      async init(){
        try {
          this.loading = true;
          const { roles } = this.$store.getters.user;
          this.documentId = this.$route.query.id;
          this.formId = this.$route.query.formId;
          this.userRoles = roles;

          const docProjection = ['stage', "state", "document_type","publish_failure_reason", "view_type"];
          this.document = await DocumentService.getDocument({ _id: this.documentId }, docProjection);
          this.$store.commit("formViewStore/setFormData",this.document);

          const docStage = _.get(this.document, "stage");
          this.isFormDisabled(docStage);
          
          this.documentData = await this.getDocDataByDocId(this.documentId);

          const documentType = _.get(this.document, "document_type");
          this.customerConfiguration = await DeCustConfigService.getCustConfigByDocType(documentType);
          this.isApprovalEnabled = _.get(this.customerConfiguration.config, "enable_approval", false)
          if(this.isApprovalEnabled && (!this.approvalData || this.approvalData.length == 0))
              await this.setApprovalData();

          this.toggleButtons();

          const prediction = _.get(this.documentData, "prediction");
          this.formData = DynamicFormService.convertPredictionToFormData(prediction);
          this.initialFormData = _.cloneDeep(this.formData);
          this.renderForm = true;
        } catch(error){
          console.error("Something went wrong " + error.message);
        }
        this.loading = false;
      },
      async getDocDataByDocId(documentId) {
        const projection = ["_id", "prediction", "approval_status", "stage", "state"];
        const docData = await DocumentService.getDocumentDataByDocId(documentId, projection);
        return docData;
      },
      /*
        For Refresh component we're passing renderForm variable to child components
        So we can refersh them as well when needed 
      */
      async refreshComponent() {
        this.renderForm = false;
        await this.init();
        this.refreshMessages += 1;
        this.renderForm = true;
      }
    },
    async beforeMount(){
      this.$store.commit("setDisplayIdpTree",false);
      await this.init();  
    }
  };
  </script>
  <style lang="scss">
    .kp-main-dynamic{
      padding-left: 8.5rem !important;
      padding-right: 8.5rem !important;
    }
    .dynamic-form {
    	> div {
        .form-title{
          margin: 1.25rem 0;
        }
    		width: inherit !important;
    		.formulate-form{
    			margin-bottom: 2rem;
    			overflow: auto;
    			padding: 1rem 2rem;
			
    			.formulate-input .formulate-input-element{
    				max-width: none;
            min-width: 260px;
					
    				.formulate-input-group-repeatable{
    					display: flex;
    					flex-wrap: wrap;
    					justify-content: space-between;
    				}
    				.formulate-input-group-repeatable > *{
    					width: 45%;	
              gap: 15px;
    				}
    			}
          .formulate-input .required-field::after {
            content: ' *';
            color: red;
          }
    			.formulate-input[data-classification='group'] > .formulate-input-wrapper > .el-divider--horizontal {
    				margin-bottom: 2.5rem;
            margin-top: 3rem;
            .el-divider__text{
    				  font-size: 1.3rem;
    				  text-transform: capitalize;
            }
    			} 
          .formulate-input .formulate-input-label{
            font-size: 12px;
            text-transform: capitalize;
          }
          .formulate-input[data-classification='text'] input:focus{
              outline: 0;
              border: 1px solid #5a67d8;
            }
          .formulate-input[data-classification='select'] select:focus{
              outline: 0;
              border: 1px solid #5a67d8;
            }
            .formulate-input[data-classification='text'] input {
                outline: 0;
                border: 1px solid #4A5468;
              }
            .formulate-input[data-classification='select'] select {
                outline: 0;
                border: 1px solid #4A5468;
              }
    		}
    	}
    }
    .dynamic-form-buttons{
      display: flex;
      justify-content: end;
    }
    .send-for-approval-commentMsg{
        .el-dialog {
            width: 40rem;
            height: 12rem;
            .footer_row {
                float: right;
                padding-top: 10px;
                .el-button{
                    line-height: 1;
                    padding: 6px 8px 6px 8px;
                    font-weight: 500;
                    font-size: 11px;
                }
            }
            .comment-title{
                font-weight: 500
            }
            .textarea {
                height: 6rem;
            }
        }
    }
    .formulate-input-group-repeatable .formulate-input-wrapper{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .message-for-null-formconfig{
      display:flex;
      font-size: 2rem;
      color:black;
      justify-content: center;
      align-items:center;
      margin-top:100px;
    }
    .W9-form-message{
      color:red;
      padding-left: 25px;
    }
  </style>
  