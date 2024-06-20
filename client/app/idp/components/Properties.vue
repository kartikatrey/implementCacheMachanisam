<template>
<section class="field-container">
    <DocumentActiveUsers></DocumentActiveUsers>
    <header>
        <div class="title">
            <span class="title-name"> {{ fieldPredictionData.fileName }} </span>

            <el-tag type="info" size="mini" effect="plain">
                {{stageLabelMap[fieldPredictionData.stage]?stageLabelMap[fieldPredictionData.stage]:fieldPredictionData.stage}}
            </el-tag>
            <el-tag type="info" size="mini" effect="plain" v-if="actionTaken">
                {{actionTaken}}
            </el-tag>

        </div>
        <div class="actions">
                  <el-tooltip
                            class="item export"
                            effect="light"
                            :content="`Training mode ${cloneShouldTrackChanges?'ON':'OFF'}`"
                            placement="top-start"
                         >
                         <div style="display:inline">
                             <toggle-button  width="44" height="16" font-size="10" v-if="isAutoLearningEnabled" @change="onToggle" :sync="true" :color="{
                                checked: '#5f8fdf',
                                unchecked: '#DCDFE6',
                                disabled: '#CCCCCC',
                             }"  :labels="{ checked: 'ON', unchecked: 'OFF' }"  v-model="cloneShouldTrackChanges"></toggle-button>
                         </div>
              </el-tooltip>


              <el-button @click="downloadFile" type="text">
                <span class="mdi mdi-arrow-down-thin-circle-outline"></span>
              </el-button>

            <div class="kp-view-code-btn">
                <router-link v-if="showDebugButton" target="_blank" :to="{
              path: '/idp/document-debug-view',
              query: { doc_id: documentData._id },
            }">
                    View
                </router-link>
            </div>
        </div>
    </header>

    <div class="tabs-container">
        <el-tabs v-model="activeTab" >
            <el-tab-pane  label="Extracted fields" name="fields">
                <span cid="Extracted fields" slot="label">
                    EXTRACTED FIELDS</span>
                <div class="field-operation-container">
                    <!-- <div class="language_selection_container">
              <el-select
                v-model="selectedLanguage"
                filterable
                @change="onLanguageChange"
                placeholder="Translate"
              >
                <el-option
                  v-for="language in languages"
                  :key="language.value"
                  :label="language.label"
                  :value="language.value"
                >
                </el-option>
              </el-select>
            </div> -->

                    <div class="search_fields_container">
                        <el-input cid="extract-field-search-text" placeholder="" v-model="searchText"></el-input>
                        <span class="mdi mdi-magnify"></span>
                    </div>
                    <div v-if="isAdmin">
                        <div class="select_fields_container" v-if="originalFieldData">
                            <SlushBucket class="fields_slushbucket" :data="selectionFields" selectedGroup="header" buttonText="Select fields" title="Select fields" buttonType="primary" :isDocumentReadOnly="isDocumentReadOnly || hasButtonPermission('Select fields')" @onClose="onFieldSelectionClose" @onSave="onFieldSelectionChange" />
                            <!-- buttonIcon="mdi mdi-arrow-down-thin-circle-outline" -->
                        </div>
                    </div>
                </div>
                <!-- | add filed -->
                <div class="insurance-fileds-container">
                    <div v-if="isDocumentTypeInsurance" class="insurance-fileds-header">
                        <h2>Package Fields</h2>
                        <el-button round  icon="mdi mdi-chevron-up-circle" v-if="!isPackageFieldVisible" @click="showPackageField"></el-button>
                        <el-button round  icon="mdi mdi-chevron-down-circle" v-if="isPackageFieldVisible" @click="hidePackageField"></el-button>
                    </div>
                    <div class="insurance-field-scroll field-scroll" v-if="packageLevelFieldsVisible">
                        <div v-bind:key="k" v-for="(fieldData, k) in packageFields" class="block-container">
                            <div v-bind:key="key" v-for="(field, key) in fieldData" :class="getFieldClass(field)">
                                <field-card :isDocumentReadOnly="isDocumentReadOnly" :props="field" :isFieldVisible="packageLevelFieldsVisible" :key="field.name"></field-card>
                            </div>
                        </div>
                    </div>

                    <div v-if="isDocumentTypeInsurance" class="insurance-fileds-header">
                        <h2>Form Fields</h2>
                        <el-button round  icon="mdi mdi-chevron-up-circle" v-if="!isFormFieldVisible" @click="showFormField"></el-button>
                        <el-button round  icon="mdi mdi-chevron-down-circle" v-if="isFormFieldVisible"  @click="hideFormField"></el-button>
                    </div>

                    <div class="insurance-field-scroll field-scroll" v-if="formLevelFieldsVisible">
                            <div v-bind:key="k" v-for="(fieldData, k) in documentFields" class="block-container">
                            <div v-bind:key="key" v-for="(field, key) in fieldData" :class="getFieldClass(field)">
                                <field-card :isDocumentReadOnly="isDocumentReadOnly" :props="field" :isFieldVisible="formLevelFieldsVisible" :key="field.name"></field-card>
                            </div>
                        </div>
                    </div>
                </div>

            </el-tab-pane>
            <el-tab-pane  label="Messages" name="message" :disabled="isPaneDisabled('Messages')">
                <span cid="Messages" slot="label">Collaboration <el-badge v-if="!isTabActive('message') && unreadCount>0" :value="unreadCount" class="item unread-msg-count" type="primary"></el-badge></span>
                <message @updateCount="updateUnreadCount" v-if="renderMessageComponent" :isTabActive="isTabActive('message')" :org="documentData && documentData.org" :documentId="documentId"></message>
            </el-tab-pane>
            <el-tab-pane  :label="commentLabel" name="comments" :disabled="isPaneDisabled('Attachments')">
                <span :cid="commentLabel" slot="label" :class="totalCommentCount.length > 0 ? 'properties-pane-tab-label' : ''">{{ commentLabel }}</span>

                <comment-attachment :docType="documentData.document_type" :isDocumentReadOnly="isDocumentReadOnly" ></comment-attachment>
            </el-tab-pane>
              <el-tab-pane  v-if="documentData && documentData.input_channel && documentData.input_channel.toLowerCase()=='email'"  label="EmailDetails" name="Email Details">
                <span cid="EmailDetails" slot="label">Email Details </span>
                   <email-details :messageId="documentData && documentData.email && documentData.email.id" :docIds="documentData._id" :parentDocId="documentData.parent_document_id">  </email-details>
            </el-tab-pane>

        </el-tabs>
    </div>
    <!-- | tabs container -->

    <footer>
        <div class="footer-inner">
            <div class="right-actions" >

            <ActionButtons :documentId="documentData._id"
                :isDocumentReadOnly="isDocumentReadOnly"
                :documentData="documentData"
                source="Properties"
                @publish="publish"
                @handleFraud="handleFraud"
                @duplicateDocument="duplicateDocument"
                @deleteDocument="deleteDocument"
                @approveRejectWaitingDocument="approveRejectWaitingDocument"
                @save="save"
                @confirm="confirm"
                @moveToInbox="moveToInbox"
                @submit="submit"
                @reject="reject"
                @callApprovalWorkflow="callApprovalWorkflow"
                @restore="restoreDocument"
                @markAsReviewed="markAsReviewed"  />
            </div>
        </div>
    </footer>
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
            <el-button @click="closeMsgDialogForm()">Cancel</el-button>
            <el-button size="medium" type="primary" @click="sendForApproval()"
            >Send</el-button
            >
        </el-row>
    </el-dialog>
    </div>
    <publish-dialog @hide="handlePublishDialogClose" :publishDialogVisible="publishDialogVisible"  ></publish-dialog>

    <reject-doc-dialog @hide="handleRejectDialogClose" @refreshPage="refreshPage" :isDocumentReadOnly="isDocumentReadOnly" :rejectDialogVisible="rejectDialogVisible"></reject-doc-dialog>


    <email-approval-dialog ref="email_upload_dialogue" :approvalDialogVisible="approvalDialogVisible" :emailList="approverSelectedList" @onConfirm="callApproval" @hide="handleApprovalDialogClose" @notRequiredAction="approvalNotRequired" :isApprover="isDirectPublish" />

    <DocumentAssign @closeAssignmentDialogue="handleCloseAssignmentDialog" title="" v-if="showAssignModal" :assignModalProps="assignModalProps">
    </DocumentAssign>
</section>
</template>

<script>
import CommentAttachment from "../components/CommentAttachment.vue";
import DocumentActiveUsers from "@/idp/components/DocumentActiveUsers";
import Constants from "@/resources/Constants";
import PublishDialog from "../components/PublishDialog.vue";
import RejectDocDialog from "../components/RejectDocDialog.vue";
import Validator from "@/services/Validator";
import DocumentService from "@/idp/services/DocumentService";
import UserService from "@/idp/services/UserService";
import ApprovalService from "@/idp/services/ApprovalService";
import FieldCard from "../components/FieldCard.vue";
import SlushBucket from "../components/SlushBucket.vue";
import EventBus from "@/EventBus";
import FieldService from "@/idp/services/FieldService";
import _ from "lodash";
import {
    getQueryFilter ,isFieldPresentInPrediction,isLineFieldPresentInPrediction
} from "@/util/CommonUtil";
import EmailApprovalDialog from "../components/EmailApprovalDialog.vue";
import Message from "../components/Message.vue";
import DocumentAssign from "../components/DocumentAssign.vue";
import ActionButtons from "@/idp/components/ActionButtons";
import EmailDetails from "@/idp/components/EmailDetails";
import { mapState } from "vuex";
import moment from 'moment-timezone';

export default {
    name: "Properties",
    props: [
        "docSelectedLanguage",
        "props",
        "isDocumentReadOnly",
        "paginationResponse",
        "loading",
        // "selectedField"
    ],
    watch: {

        shouldTrackChanges:{
            handler: function (newVal, oldVal) {
                console.log("watcher:properties:shouldTrackChanges")
                this.cloneShouldTrackChanges = newVal
            },
            immediate: true,
            deep: true,
        },
          totalCommentCount:{
            handler: function (newVal, oldVal) {
                console.log("watcher:properties:totalCommentCount")
                this.totalCommentCount = newVal
            },
            immediate: true,
            deep: true,
        },

        documentId: {
            handler: function (newVal, oldVal) {
                console.log("watcher:properties:documentId")
                if(!newVal){return;}
                this.setApprovalData();

            },
            immediate: true,
            deep: true,
        },
        docSelectedLanguage: {
            handler: function (newVal, oldVal) {
                console.log("watcher:properties:docSelectedLanguage")
                this.selectedLanguage = newVal
            },
        },
        documentData: {
            handler: async function (newVal, oldVal) {
                  console.log("watcher:properties:documentData")
                if (!newVal) return;
                const approvalEnabled = _.get(this.customerConfiguration.config, "enable_approval", false)
                if(approvalEnabled && (!this.approvalData || this.approvalData.length == 0))
                    this.setApprovalData();
                this.setModifiedFieldsData()
            },
        },
        originalFieldData: {
            handler: function (newVal, oldVal) {
                console.log("watcher:properties:originalFieldData")
                if (!newVal) return;

                this.prepareSelectionFields();


            },
        },
        fieldData: {
            handler: function (newVal, oldVal) {
                console.log("watcher:properties:fieldData")
                if (!newVal) return;
                this.prepareSelectionFields();
                this.fieldsVisible()

            },
        },

        fieldPredictionData: {
            handler: async function (newVal, oldVal) {
                console.log("watcher:properties:fieldPredictionData")
                if (!newVal) return;
                this.fieldsVisible()

            },
              immediate: true,
            deep: true,
        },

    },
    data() {
        return {
            predData:{},
            // fieldPredictionData:{},
            isPackageFieldVisible:true,
            isFormFieldVisible:true,
            formLevelFieldsVisible:true,
            packageLevelFieldsVisible:false,
            isDocumentTypeInsurance:false,
            isReviewerOnly:false,
            showLoader:false,
            emailDialogVisible:false,
            emailResponse:{},
            approvalData:[],
            unreadCount: 0,
            renderMessageComponent: true,
            activeTab: "fields",
            allModifiedFields: [],
            newModifiedFields:[],
            unpredictedFields:[],
            selectedLanguage: this.docSelectedLanguage || null,
            languages: Constants.LANGUAGES,
            approverList: [],
            approverSelectedList: [],
            selectionFields: [],
            fieldSearchText: "",
            approvalDialogVisible: false,
            // customerConfiguration:{},
            // totalCommentCount: 0,
            constants: Constants,
            publishDialogVisible: false,
            rejectDialogVisible: false,
            approverEmailList: "",
            isReviewer: false,
            isPublisher: false,
            isPublisherOnly: false,
            // isDeveloper: false,
            isAdmin: false,
            activityLogs: [],
            approvalForm: {
                emails: "",
            },
            commentMsgForm: {
                commentMsg: ""
            },
            dialogFormVisible:false,
            paginationResponseLength: "",
            currentIndex: "",
            // totalPages: "",
            approvalFormRules: {
                emails: [{
                    trigger: "change",
                    validator: Validator.emailValidator,
                    allowEmpty: true,
                }, ],
            },
            searchText: "",
            showAssignButton: true,
            showAssignModal: false,
            assignModalProps: {},
            stageLabelMap:Constants.DOCEX.STAGE_LABEL_MAP,
            cloneShouldTrackChanges:false,
            actionButtonList:[],
            actionTaken: false
        };
    },

    computed: {
         ...mapState("documentViewStore",{
            selectedField: state => state.selectedField,
            propData: state =>state.propData,
            documentData: state =>state.documentData,
            clonedPrediction: state =>state.clonedPrediction,
            originalFieldData: state =>state.originalFieldData,
            documentId: state =>state.documentId,
            debugData: state =>state.debugData,
            debugDataModifiedPages: state =>state.debugDataModifiedPages,
            fieldData: state =>state.fieldData,
            tableData: state =>state.tableData,
            totalPages : state => state.totalPages,
            isDebuggerOn : state => state.isDebuggerOn,
            config : state => state.config,
            shouldTrackChanges : state => state.shouldTrackChanges,
            totalCommentCount :state => state.totalCommentCount,
            customerConfiguration :state => state.customerConfiguration
        }),
        fieldPredictionData(){
            return this.$store.getters["documentViewStore/fieldPredictionData"];
        },
        isAutoLearningEnabled(){
            return this.$store.getters["documentViewStore/isAutoLearningEnabled"];
        },
        showDocumentApproveReject(){
            return this.approvalData && this.documentData.stage == this.constants.DOCEX.STAGE.WAITING_FOR_APPROVAL
        },
        commentLabel() {
            return `Attachments(${this.totalCommentCount})`;
        },
        isDirectPublish() {
            return this.isPublisher && _.includes(
                [this.constants.DOCEX.STAGE.UPLOADED,this.constants.DOCEX.STAGE.EXTRACTED, this.constants.DOCEX.STAGE.APPROVAL_REJECTED],
                this.documentData.stage
            );
        },
        isDocApproved() {
            return _.includes(
                [this.constants.DOCEX.STAGE.APPROVED, this.constants.DOCEX.STAGE.CONFIRMED],
                this.documentData.stage
            );
        },
        isDocApprovalRejected() {
            return _.includes(
                [this.constants.DOCEX.STAGE.APPROVAL_REJECTED],
                this.documentData.stage
            );
        },
          isDocInInbox() {
            return (!(_.get(this.customerConfiguration.config, "enable_approval", false) &&
               this.customerConfiguration.approval_workflow_id) || isFieldPresentInPrediction(this.documentData,'po_number') || isLineFieldPresentInPrediction(this.documentData,'po_line_number'))&& _.includes(
                [this.constants.DOCEX.STAGE.UPLOADED,this.constants.DOCEX.STAGE.EXTRACTED],
                this.documentData.stage
            );
        },

        showDraftButton() {
            if (this.isPublisherOnly) return false;
            return (
                this.documentData &&
                !_.includes(
                    [this.constants.DOCEX.STAGE.FRAUD_FLAGGED, this.constants.DOCEX.STAGE.FRAUD_CONFIRMED,this.constants.DOCEX.STAGE.APPROVED],
                    this.documentData.stage
                ) &&
                _.get(this.documentData,"resubmitted_after_rejection",false) ||
                (_.includes(
                    [this.constants.DOCEX.STAGE.UPLOADED,
                    this.constants.DOCEX.STAGE.EXTRACTED,
                    this.constants.DOCEX.STAGE.CONFIRMED,
                    this.constants.DOCEX.STAGE.REJECTED,
                    this.constants.DOCEX.STAGE.APPROVAL_REJECTED
                    ],
                    this.documentData.stage
                ||
                (this.documentData.stage == this.constants.DOCEX.STAGE.PUBLISHED &&
                this.documentData.state == this.constants.DOCEX.STATE.FAILED
                )
                ))
            );
        },

        showConfirmFraudButton(){
           return (
                (this.isReviewer || this.isPublisher || this.isAdmin) &&
                _.includes(
                    [this.constants.DOCEX.STAGE.FRAUD_FLAGGED],
                    this.documentData.stage
                )
            );
        },

        showRejectFraudButton(){
           return (
                (this.isReviewer || this.isPublisher || this.isAdmin) &&
                _.includes(
                    [this.constants.DOCEX.STAGE.FRAUD_FLAGGED],
                    this.documentData.stage
                )
            );
        },

        showConfirmButton() {
            if ((this.isPublisher || this.isPublisherOnly || this.isAdmin)) return false;
            return (
                this.documentData &&
                 _.includes(
                    [this.constants.DOCEX.STAGE.UPLOADED,
                    this.constants.DOCEX.STAGE.APPROVAL_REJECTED,
                    this.constants.DOCEX.STAGE.ACK_SYSTEM,
                    this.constants.DOCEX.STAGE.EXTRACTED
                    ],
                    this.documentData.stage
                )

            );
        },

        showDebugButton() {
            return this.isDeveloper;
        },

        showPublishButton() {
            return (
                this.documentData && !this.isDocApprovalRejected &&
                (this.isPublisher || this.isPublisherOnly || this.isAdmin) && this.isDocumentProcessed() && !this.isAlreadyPublished() &&
                (this.isDocInInbox || this.isDocApproved)
            );
        },
        showSendForApprovalButton() {
           return (
               _.get(this.customerConfiguration.config, "enable_approval", false) &&
               this.customerConfiguration.approval_workflow_id &&
                (this.isPublisher || this.isPublisherOnly || this.isAdmin) &&
                _.includes(
                    [this.constants.DOCEX.STAGE.UPLOADED, this.constants.DOCEX.STAGE.CONFIRMED,this.constants.DOCEX.STAGE.EXTRACTED],
                    this.documentData.stage
                ) && !isFieldPresentInPrediction(this.documentData,'po_number')
            );
        },
        showRejectButton() {
            return (
                (this.isReviewer || this.isPublisher || this.isAdmin) && !this.isTryItUser() &&
                _.includes(
                    [this.constants.DOCEX.STAGE.UPLOADED, this.constants.DOCEX.STAGE.CONFIRMED,this.constants.DOCEX.STAGE.EXTRACTED],
                    this.documentData.stage
                )
            );
        },

        showDuplicateButton() {
            return (
                (this.isReviewer || this.isPublisher || this.isAdmin) &&
                _.includes(
                    [this.constants.DOCEX.STAGE.UPLOADED, this.constants.DOCEX.STAGE.CONFIRMED,this.constants.DOCEX.STAGE.EXTRACTED],
                    this.documentData.stage
                )
            );
        },

        showMoveToReceivedButton() {
            //isPublisher/isPublisherOnly
            //doc confirmed--->approved/not required
            //OR
            // stage if published and state failed
            let response = (this.isPublisher || this.isPublisherOnly || this.isAdmin) && this.isDocApproved;
            if (!_.isEmpty(this.documentData.state)) {
                if (this.documentData.state == this.constants.DOCEX.STATE_PUBLISHED.FAILED)
                    return response && this.handlePublishedFailed;
            }
            return response && this.documentData.stage == this.constants.DOCEX.STAGE.CONFIRMED;
        },


        packageFields() {
            return this.groupedFieldData(this.constants.DOCEX.FIELD_LEVEL.PACKAGE,this.fieldData, this.originalFieldData)
        },
        documentFields() {
            return this.groupedFieldData(this.constants.DOCEX.FIELD_LEVEL.DOCUMENT,this.fieldData, this.originalFieldData)
        },
    },

    methods: {
        // Handles the functionality of multiple submit buttons on the server side.
        // This function is designed to handle various submission actions triggered by submit buttons.
        // For example:
        // 1) In collaboration stories, it sends an email notification upon clicking the submit button.
        // 2) In vendor onboarding (not used in the provided code, but for reference), it would save the form.

        async submit(params){
            try {
                if (this.hasDataChanged()) return this.notifyError("Please save the data before proceeding");
                params.document_id = this.documentId;
                params.document_type = this.documentData.document_type;
                const actionResponse = await DocumentService.processAction(params)
                if(_.get(actionResponse,"data.data.status")!==false){
                    this.notifySuccess("Document submitted successfully");
                    this.$router.push({path: `/idp/document/${params.document_type}`});
                    return
                }
                this.notifyError("Error while processing submit action");
            }
            catch(error){
                console.error("",error);
                this.notifyError("Error while processing submit action");
            }
        },
        fieldsVisible(){

                if(this.$route.query.view == Constants.DOCEX.FIELD_LEVEL.PACKAGE){
                    this.packageLevelFieldsVisible = true
                    this.isDocumentTypeInsurance=true
                }
                else{
                    this.packageLevelFieldsVisible=false
                    this.isDocumentTypeInsurance=false
                }
        },
        async sendForApproval(){
            try{
                this.dialogFormVisible = false
                this.$emit("update:loading", true);
                const comment = this.commentMsgForm.commentMsg||""
                const response = await DocumentService.callApprovalWorkflow(this.documentData._id,comment);
                if (response.data && _.get(response,"data.status")){
                    this.notifySuccess("Approval workflow triggered successfully.");
                    this.$emit("update:loading", false);
                    setTimeout(() => {
                        try {
                            this.refreshPage();
                        } catch (e) {
                            console.error(e);
                        }
                    }, 0);

                }
                // If L1 is not found in the lookup, notify with a warning message set in the bot reponse.
                else if(response.data.data && !response.data.data.status){
                    this.$notify({
                        title: 'Warning',
                        message: _.get(response.data,"data.message"),
                        type: 'warning'
                    });
                }
                else{
                    this.notifyError(_.get(response,"data.message"));
                }
            } catch (e) {
                console.error("",e);
                this.notifyError("Error while processing.");
            }
            finally {
                this.$emit("update:loading", false);
                this.commentMsgForm.commentMsg=""
                // Added temp refreshPage() call if need to refresh the page after added the message in de_document_data
                // this.refreshPage()
            }
        },
        closeMsgDialogForm(){
            this.dialogFormVisible = false
            this.commentMsgForm.commentMsg=""
        },
        groupedFieldData(level,newfieldData,newFieldPredictionData) {
            let groupedData = [];
        //    this.fieldPredictionData=this.$store.getters["documentViewStore/fieldPredictionData"];
            let fieldData = this.fieldPredictionData.prediction || [];
            fieldData = _.sortBy(fieldData, (field) => {
                return _.get(field, "field_config.order");
            });
            if (this.searchText) {
                fieldData = this.filterData(fieldData);
            }
            _.each(fieldData, (field)=>{
                if(_.get(field, 'field_config.type') == 'checkbox' && !field.is_master_checkbox)
                {
                    return;
                }
                let fieldLevel= _.get(field, 'field_config.field_level','document')
                if (_.get(field, 'field_config.selected')&&fieldLevel==level) {
                    if (Constants.DOCEX.COMPONENT_REQUIRE_FULL_SPACE.includes(field.field_config.type)) {
                        groupedData.push([field]);
                        return;
                    }
                    if (_.isEmpty(groupedData)) {
                        groupedData.push([field]);
                        return;
                    }
                    let index = this.getAvailableSpaceIndex(groupedData);
                    index >= 0 ? groupedData[index].push(field) : groupedData.push([field]);
                }
            })
            let index = _.findIndex(groupedData, (field, index) => {
                return (field.length == 1 && !_.includes(Constants.DOCEX.COMPONENT_REQUIRE_FULL_SPACE, _.get(field[0], 'field_config.type')) == 1 && index !== groupedData.length - 1)
            })
            index >= 0 && groupedData.push(groupedData.splice(index, 1)[0]);
            return groupedData;
        },
        hideFormField(){
            this.isFormFieldVisible= !this.isFormFieldVisible
            this.formLevelFieldsVisible = false
        },
        showFormField(){
            this.isFormFieldVisible= !this.isFormFieldVisible
            this.formLevelFieldsVisible = true
        },
        hidePackageField(){
            this.isPackageFieldVisible= !this.isPackageFieldVisible
            this.packageLevelFieldsVisible = false
        },
        showPackageField(){
            this.isPackageFieldVisible= !this.isPackageFieldVisible
            this.packageLevelFieldsVisible = true
        },
        onToggle(){
            this.$store.commit("documentViewStore/shouldTrackChanges",this.cloneShouldTrackChanges);

        },

        setModifiedFieldsData(){
            this.newModifiedFields = [];
            this.allModifiedFields = this.documentData.modified_fields || [];
            this.unpredictedFields = this.documentData.unpredicted_fields || [];
        },
        async setApprovalData(){

            let approvalRequest =  await ApprovalService.getApprovalRequest({documentId:this.documentId});
            this.$nextTick(() => {
                approvalRequest = _.get(approvalRequest,'data.data');
                this.approvalData = approvalRequest
                this.$forceUpdate()
            })
        },
        async approveRejectWaitingDocument(params){ //status,action
            try{
                let confirmModal = await this.$confirm(`Are you sure you want to  ${params.action} ?`, "Confirmation", {
                        confirmButtonText: "Confirm",
                        cancelButtonText: "Cancel",
                        type: "warning"
                   }).catch(e=>{
                        console.error(e)
                });
                if(!confirmModal)return;

                let comment = "";
                if(params.stage === this.constants.DOCEX.APPROVAL_STATUS.REJECTED ||params.stage === this.constants.DOCEX.APPROVAL_STATUS.APPROVED){
                    let approveRejectNotePrompt = await this.$prompt('Please enter note', '', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        inputType:'textarea',
                        closeOnClickModal: false,
                        customClass:'document-approve-reject-popup',
                        inputValidator: (value) => {
                            if(status === this.constants.DOCEX.APPROVAL_STATUS.REJECTED){
                               return  value ? true:'Rejection note is required.'
                            }
                        },
                        }).catch(e=>{
                            console.error(e)
                        });
                    if(!approveRejectNotePrompt || approveRejectNotePrompt.action != 'confirm')return ;
                    comment = approveRejectNotePrompt.value;
                }

                let data = {
                    status: params.stage,
                    approval_id: this.approvalData._id,
                    comment: comment,
                    action:params.action,
                    document_id:this.documentId,
                };
                this.$emit("update:loading", true);
                const approvalResponse =  await ApprovalService.processApproval(data);
                if(_.get(approvalResponse,'data.data.success')){
                    this.notifySuccess("Document " + params.action  + " successfully");
                    this.setApprovalData();
                    this.refreshPage();
                    return
                }
                console.log(approvalResponse);
                this.notifyError("Error while processing");

            }catch(e){
                console.error(e)
                this.notifyError("Error while processing");
            }finally{
                this.$emit("update:loading", false);
            }
        },
        getAvailableSpaceIndex(groupedData) {
            return _.findIndex(groupedData, (group) => {
                return (group.length == 1 && !(Constants.DOCEX.COMPONENT_REQUIRE_FULL_SPACE.includes(group[0].field_config.type)))
            })
        },
        updateUnreadCount(count) {
            this.unreadCount = count;
        },
        isAlreadyPublished() {
            return (this.documentData.stage == Constants.DOCEX.STAGE.PUBLISHED && this.documentData.state == Constants.DOCEX.STATE_PUBLISHED.SUCCESS)
        },
        isDocumentIsApproved() {
            if(this.customerConfiguration.enable_approval)
            return (_.get(this.customerConfiguration.config, "enable_approval", false) && this.documentData.stage == Constants.DOCEX.STAGE.APPROVED)
        },
        isDocumentProcessed() {
            const state = Constants.DOCEX.STATE_UPLOADED;
            const publishNotAllowedStates = [state.EXTRACTED,
                state.REQUESTED, state.QUEUED,
                state.PENDING, state.IN_PROGRESS
            ]
            if (_.includes(publishNotAllowedStates, this.documentData.state)) {
                return false
            }
            return ((this.documentData.state !== state.FAILED) || ((this.documentData.state == state.FAILED && !_.isEmpty(this.documentData.publish_failure_reason))))
        },
        showAssignmentDialogue() {
            this.showAssignModal = true
            this.assignModalProps = this.documentData
        },
        isTabActive(tab) {
            return tab === this.activeTab;
        },
        handleApprovalDialogClose() {
            this.approvalDialogVisible = false
            this.approverSelectedList = []
        },
        async onLanguageChange(language) {
            this.selectedLanguage = language;
            this.$emit("onLanguageChange", language);
        },
        onFieldSelectionClose(selectedFields) {
            this.prepareSelectionFields();
        },

        onFieldSelectionChange(selectedFields) {
            console.log("selectedFields", selectedFields);
            let packageFields = selectedFields.package
            this.fieldData = this.fieldData.map((field) => {
                if (!field || !field.field_type || !field._id) {
                    return field;
                }
                field["selected"] = !!(
                    field.field_type &&
                    (selectedFields[field.field_type] || []).includes("" + field._id)
                );
                if(field.field_level == Constants.DOCEX.FIELD_LEVEL.PACKAGE){
                    field["selected"] = !!(packageFields).includes("" + field._id);
                }
                return field;
            });

            this.originalFieldData = this.originalFieldData.map((field) => {
                if (!field || !field.field_type || !field._id) {
                    return field;
                }
                field["selected"] = !!(field.field_type &&
                    (selectedFields[field.field_type] || []).includes("" + field._id)
                );
                if(field.field_level == Constants.DOCEX.FIELD_LEVEL.PACKAGE){
                    field["selected"] = !!(packageFields).includes("" + field._id);
                }
                return field;
            });
            this.$store.commit("documentViewStore/setFieldData",this.fieldData);
            this.$store.commit("documentViewStore/setOriginalFieldData",this.originalFieldData );

            this.prepareSelectionFields();
            const payload = {
                document_type: this.documentData["document_type"],
                document_subtype:this.documentData["document_subtype"],
                selected_fields: [
                    ...(selectedFields || {})["header"],
                    ...((selectedFields || {})["table"] || []),
                ].filter((f) => f),
            };
            if(packageFields && packageFields.length != 0){
                Object.assign(payload, {"packageFields":packageFields});
            }
            FieldService.saveSelectedFields(payload)
                .then((response) => {
                    if(response.data && !_.get(response,"data.status"))
                    {
                        this.notifyError(_.get(response,"data.message"));
                        return;
                    }
                    this.notifySuccess("Data saved successfully");
                    EventBus.$emit("IDP_FIELD_SELECTION_CHANGED", this.fieldData);
                })
                .catch((errorMessage) => {
                    console.error("errorMessage", errorMessage);
                    this.notifyError("Error while saving");
                });

        },

        prepareSelectionFields() {
            if (!this.originalFieldData || !this.originalFieldData.length) {
                return;
            }
            const headerFields = {
                name: "header",
                label: "Header Fields",
                source: [],
                destination: [],
            };
            const lineFields = {
                name: "table",
                label: "Line Fields",
                source: [],
                destination: [],
            };
            const packageFields = {
                name: "package",
                label: "Package Fields",
                source: [],
                destination: [],
            };
            const prepareBucketField = (field) => {
                return {
                    name: field.label,
                    code: "" + field._id,
                    order: !isNaN(field.order) ? field.order : 9999
                };
            };
            const isMultiTable = this.documentData["is_multi_table"];

            const addField = (field) => {
                if (!field || !field._id) {
                    return;
                }

                const tabName = field.selected ? "destination" : "source";
                if (field.field_level == "package") {
                    packageFields[tabName].push(prepareBucketField(field));
                }
                else
                {
                    if (field.field_type == "header") {
                        headerFields[tabName].push(prepareBucketField(field));
                    }

                    else if (!isMultiTable && field.field_type == "table") {
                        lineFields[tabName].push(prepareBucketField(field));
                    }
                }
            };

            this.originalFieldData.map(addField);
            this.$store.commit("documentViewStore/setOriginalFieldData",this.originalFieldData );

            // Sort fields depending on order given
            lineFields.destination.sort((a, b) => a.order - b.order)
            headerFields.destination.sort((a, b) => a.order - b.order)
            lineFields.source.sort((a, b) => a.order - b.order)
            headerFields.source.sort((a, b) => a.order - b.order)
            const selectionFields = [headerFields];
            // For multi tables we're not showing line fields in slush bucket
            if(!isMultiTable){
                selectionFields.push(lineFields);
            }
            //here if packageviewer document open then only add package field tab for selected fields option
            if( this.$route.query.view ==Constants.DOCEX.FIELD_LEVEL.PACKAGE){
                selectionFields.push(packageFields)
            }
            this.selectionFields = selectionFields;
        },

        addField() {
            this.$router.push({
                path: "/idp/field-config-form",
                query: {
                    redirect_url: "/idp/document-view",
                    document_id: this.documentData._id,
                },
            });
        },

        filterData(fieldData) {
            fieldData = fieldData.filter((field) => {
                if (
                    !(
                        field["field_config"] &&
                        field["field_config"]["selected"] &&
                        field["field_config"]["active"]
                    )
                )
                    return false;

                const labelValue = _.get(field, "field_config.label");
                if (
                    labelValue && _.isString(labelValue) &&
                    labelValue.toLowerCase().includes(this.searchText.toLowerCase())
                )
                    return true;
                const fieldPredictedValue = _.get(field, "value");
                if (
                    fieldPredictedValue && _.isString(fieldPredictedValue) &&
                    fieldPredictedValue.toLowerCase().includes(this.searchText.toLowerCase())
                )
                    return true;

                return false;
            });
            return fieldData;
        },


        async downloadFile() {
            this.$emit("update:loading", true);
            let params = {
                file_name: this.documentData.original_file_name,
                document_type: this.documentData.document_type,
                storage_folder_path: this.documentData.storage_folder_path,
                file_type: _.get(this.documentData, 'file_type'), //Added for downloading html file
                original_file_name: _.get(this.documentData, 'file_name')  //Added for downloading html file
            };
            try {
                let directoryResponse = await DocumentService.downloadDocument(params);
            } catch (e) {
                this.notifyError("Something went wrong.");
            } finally {
                this.$emit("update:loading", false);
            }
        },

        handlePublishedFailed() {
            return _.includes(
                    [this.constants.DOCEX.STAGE.UPLOADED,this.constants.DOCEX.STAGE.EXTRACTED],
                    this.documentData.stage
                ) ?
                false :
                true;
        },

        getFieldClass(field) {
            return Constants.DOCEX.COMPONENT_REQUIRE_FULL_SPACE.includes(field.field_config.type) ? "block-100" : "block-50";
        },

        hasDataChanged() {
            let hasDataChanged = true;
            if (_.isEqual(this.clonedPrediction, this.fieldPredictionData.prediction))
                hasDataChanged = false;
            return hasDataChanged;
        },
        isDocumentContainErrors() {
            if ((this.documentData["messages"] || []).filter((message) => message && message.message_type === "ERROR").length)
                return true;
            return false
        },
        isActionAllowedWithError(currentAction) {
            let allowedActions = [this.constants.DOCEX.TRIGGER_ACTION.DRAFT, this.constants.DOCEX.TRIGGER_ACTION.MOVE_TO_RECIEVED];
            if (allowedActions.includes(currentAction)) {
                return true;
            }
            return false;
        },
        async save(params) {
            //ACTION: SAVE DRAFT
            try {
                let debugDataModifiedPages = Array.from(this.debugDataModifiedPages)
                if (this.debugData.modified) {
                    params.debug_data_modified = true
                    const payload = {
                        _id: this.debugData._id,
                        modified: true,
                        prediction: this.debugData.prediction,
                        ocr_result: this.debugData.ocr_result,
                        ...((debugDataModifiedPages.length>0) && {modified_pages:debugDataModifiedPages.sort()})
                    };
                    DocumentService.saveDebugData(payload)
                }
                await this.saveData(params)
                this.refreshPage()
            }
            catch(err){
                let msg = err || this.constants.DOCEX.DATA_SAVE_ERROR;
                this.notifyError(msg);
            }
            return;
        },

        async confirm(params){
            //ACTION: CONFIRM
            if (!this.isActionAllowedWithError(params.action)) {
                if (this.hasDataChanged())
                    return this.notifyError("Please save the data before proceeding");
                else if (this.isDocumentContainErrors())
                    return this.notifyError("Please resolve the errors before proceeding");
            }
            if (!_.get(this.documentData, 'resubmitted_after_rejection') && this.documentData.approval_status &&
                this.documentData.approval_status == this.constants.DOCEX.APPROVAL_STATUS.WAITING_FOR_APPROVAL
            ) {
                return this.notifyError("You can not update awaiting approval document");
            }
            // In case enable_approval is true in customer configuration, stage should be WAITING_FOR_APPROVAL
            if (_.get(this.customerConfiguration.config, "enable_approval", false)) {
                this.approvalDialogVisible = true;
                this.$nextTick(()=>{this.$refs.email_upload_dialogue.loadEmails = true});
                try {
                    const response = await Promise.all([
                        DocumentService.getApproverEmailList({
                            document_id: this.documentData._id,
                            document_type: this.documentData.document_type,
                            trigger: this.constants.DOCEX.TRIGGER_TYPES.APPROVER,
                            trigger_key: "approver", //for key in customer configuration
                        }),
                        UserService.getUserEmails({roles: this.constants.DOCEX.ROLES_MAP.IDP_APPROVER}),
                    ]);

                    let tempSelectedList = response[0];
                    let approverRoleUserListResponse = response[1];
                    if (approverRoleUserListResponse.statusCode == "200" && approverRoleUserListResponse.data[0].emails.length) {
                        let approverEmails = [];
                        approverRoleUserListResponse.data[0].emails.map(
                            (approver) => approver && approverEmails.push(approver)
                        );
                        tempSelectedList = tempSelectedList.concat(approverEmails);
                        tempSelectedList = _.uniq(tempSelectedList);
                    }
                    this.approverSelectedList = tempSelectedList;
                } catch (error) {
                    console.error(err);
                } finally {
                    this.$refs.email_upload_dialogue.loadEmails = false;
                    return;
                }
            }
            //in case enable_approval is false in customer configuration, stage should be CONFIRMED
            else {
                const message = "Are you sure you want to confirm the data?";
                const confirmButtonText = "Confirm";
                const cancelButtonText = "Discard";
                const alertMessage = this.constants.DOCEX.DATA_CONFIRMED;
                this.showConfirm(params, confirmButtonText, cancelButtonText, message, alertMessage);
            }
        },

        async moveToInbox(params){
            //ACTION: MOVE TO RECEIVED
           this.$prompt("Please enter reason for moving to Inbox", "Confirmation", {
                confirmButtonText: "Move to Inbox",
                cancelButtonText: "Cancel",
                inputPattern: /[^\\s+$]/,
                inputErrorMessage: "Reason can not be blank.",
            }).then(async ({
                value
            }) => {
                params.stage = this.constants.DOCEX.STAGE.EXTRACTED;
                params.state = this.constants.DOCEX.STATE_UPLOADED.SUCCESS;
                params.move_to_inbox_reason = "Move to inbox reason : "+value;
                try {
                    this.$emit("update:loading", true);
                    let response = await this.saveData(params).catch((err) => {
                        let msg = err || this.constants.DOCEX.DATA_SAVE_ERROR;
                        this.notifyError(msg);
                    });
                    if (response) {
                        this.refreshPage();
                        this.notifySuccess("Document moved to Inbox Successfully.");
                        return;
                    }
                } catch (e) {
                    console.log(e);
                    this.$emit("update:loading", false);
                    this.notifyError("Error while processing ..");
                }
            });
        },

        sendApproval(e) {
            e.stopPropagation();
            e.preventDefault();
            this.callApproval();
        },

        async callApprovalWorkflow(){
            if (this.isDocumentContainErrors()) {
                return this.notifyError("Please resolve the errors before proceeding for approval");
            }
            this.dialogFormVisible = true
        },
        async callApproval(emails) {
            this.approvalDialogVisible = false;
            const approverEmails = emails.toString();
            const params = {
                stage: this.constants.DOCEX.STAGE.WAITING_FOR_APPROVAL,
                approval_status: this.constants.DOCEX.APPROVAL_STATUS.WAITING_FOR_APPROVAL,
                approved_by: approverEmails,
                action: this.constants.DOCEX.TRIGGER_ACTION.CONFIRM_WITH_APPROVAL,
            };
            const res = await this.saveData(params).catch((err) => {
                let msg = err || this.constants.DOCEX.DATA_SAVE_ERROR;
                this.notifyError(msg);
            });
            if (!res) return;
            this.refreshPage()
            DocumentService.sendApproval(this.documentData._id, _.get(this.documentData, 'parent_document_id', ''), approverEmails);
            this.notifySuccess("Document successfully sent for approval.");
            this.refreshPage();
        },

        async approvalNotRequired(params) {
            this.approvalDialogVisible = false;
            params["approval_status"] = "Not required";
            params["stage"] = this.constants.DOCEX.STAGE.CONFIRMED;
            params["action"] = this.constants.DOCEX.TRIGGER_ACTION.CONFIRM_WITHOUT_APPROVAL;
            const res = await this.saveData(params).catch((err) => {
                let msg = err || this.constants.DOCEX.DATA_SAVE_ERROR;
                this.notifyError(msg);
            });
            this.refreshPage()
        },

        showConfirm(params, confirmButtonText, cancelButtonText, message, alertMessage) {
            this.$confirm(message, "Confirm", {
                    confirmButtonText: confirmButtonText,
                    cancelButtonText: cancelButtonText,
                })
                .then(async () => {
                    if (params.action == this.constants.DOCEX.STAGE.DRAFT) {
                        let res = await this.saveData(params).catch((err) => {
                            let msg = err || this.constants.DOCEX.DATA_SAVE_ERROR;
                            this.notifyError(msg);
                        });
                        this.refreshPage()
                        return;
                    }
                    if (
                        !(
                            this.documentData.approval_status ==
                            this.constants.DOCEX.APPROVAL_STATUS.REJECTED
                        )
                    )
                        this.approvalNotRequired(params);
                })
                .catch((action) => {});
        },
        confirmPublishForPublisher() {
            this.$confirm("Do you want to send for Approval?", "Confirm", {
                    confirmButtonText: 'Send for approval',
                    distinguishCancelAndClose: true,
                    cancelButtonText: 'Not required'
                })
                .then(async (info) => {
                    // Send for approval. Open the approval dialog
                    this.confirm({
                        stage: this.constants.DOCEX.STAGE.CONFIRMED,
                        action: this.constants.DOCEX.TRIGGER_ACTION.CONFIRM
                    })
                })
                .catch((action) => {
                    if (action == 'cancel') {
                        // publish the document
                        this.publishDialogVisible = true;
                    }
                });
        },

        async markAsReviewed() {
            try {
                const confirmResult = await this.$confirm(`Are you sure you want to "Mark as Reviewed"?`, "Confirmation", {
                    confirmButtonText: "Confirm",
                    cancelButtonText: "Cancel",
                    type: "warning",
                });

                if (confirmResult) {
                    const updatePayload = {action: Constants.DOCEX.ACTIONS.REVIEWED};
                    const document_id = this.documentData._id;
                    const action = Constants.DOCEX.TRIGGER_ACTION.MARK_AS_REVIEWED
                    const response = await DocumentService.processAction({ payload: updatePayload, document_id, action });
                    if (_.get(response, "data.status")) {
                        this.actionTaken = Constants.DOCEX.ACTIONS.REVIEWED
                        this.notifySuccess('Record "Marked as Reviewed".');
                    } else {
                        this.notifyError(_.get(response, "data.message") || "Error while marking as Reviewed.");
                    }
                    return;
                }
            } catch (error) {
                // In the event of a confirmation popup, if the user clicks on "cancel," it will trigger an exception with the action name set to "Cancel." In this scenario, we are handling the exception silently.
                if(error == "cancel"){
                    return
                }
                console.error(error);
                this.notifyError("Error while marking as Reviewed.");
            }
        },


        handleFraud(action){

            this.$confirm(`Are you sure you want to ${action} the fraud?`, "Confirmation", {
                confirmButtonText: "Confirm",
                cancelButtonText: "Cancel",
                type: "warning",
            }).then(async () => {
                const stage = action==="confirm" ? this.constants.DOCEX.STAGE.FRAUD_CONFIRMED : this.constants.DOCEX.STAGE.EXTRACTED;
                const state = action==="confirm" ? this.constants.DOCEX.STATE_FRAUD.SUCCESS : this.constants.DOCEX.STATE_UPLOADED.SUCCESS;
                const fraud_detected = action ==="confirm" ? true : false;
                try {
                    this.$emit("update:loading", true);
                    let response = await DocumentService.processAction({
                        payload: {stage, state, fraud_detected},
                        action:`fraud_${action}`,
                        document_id: this.documentData._id,
                    });
                    if (_.get(response, "data.status")) {
                        this.notifySuccess(`Fraud ${action}ed successfully.`);
                        this.refreshPage();
                        return;
                    }
                    if (_.get(response, "data.message")){
                        this.notifyError(response.data.message);
                        this.$emit("update:loading", false);
                        return;
                    }
                    this.notifyError(`Error while ${action}ing fraud..`);
                    this.$emit("update:loading", false);

                } catch (e) {
                    console.log(e);
                    this.$emit("update:loading", false);
                    this.notifyError("Error while processing ..");
                }
            });
        },

         navigate(stage) {
            const filter = getQueryFilter();
            filter["stage"] = stage;
            this.$store.commit("setDisplayIdpTree",true);
            this.$router.push({
                path: `/idp/document/${this.documentData.document_type ? this.documentData.document_type : "invoice"}`,
                query: {
                    filter: JSON.stringify(filter || {}),
                },
            });
        },

        duplicateDocument() {
            this.$confirm(`Are you sure you want to mark as duplicate ?`, "Confirmation", {
                confirmButtonText: "Confirm",
                cancelButtonText: "Cancel",
                type: "warning",
            }).then(async () => {
                let user = this.$store.getters.user;

                let updatePayload = {
                    stage: Constants.DOCEX.STAGE.DUPLICATE,
                    state: Constants.DOCEX.STATE_UPLOADED.FAILED
                };
                try {
                    this.$emit("update:loading", true);
                    let response = await DocumentService.processAction({
                        action: Constants.DOCEX.TRIGGER_ACTION.DUPLICATE,
                        payload: updatePayload,
                        document_id: this.documentData._id

                    });
                    if (_.get(response, "data.status")) {
                        this.refreshPage();
                        this.notifySuccess("Document marked duplicate successfully.");
                        return;
                    }
                    this.notifyError("Error while processing ..");
                } catch (e) {
                    console.log(e);
                    this.$emit("update:loading", false);
                    this.notifyError("Error while processing ..");
                }
            });
        },
         /**
             * STEP 1. Ask for confirmation to restore the document
        */

        async restoreDocument(){

            this.$confirm(`Are you sure you want to restore record?`, "Confirmation", {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "warning",
        })
          .then(async() => {
            try {
              let updatePayload = {
                state: Constants.DOCEX.STATE_UPLOADED.SUCCESS,
                stage: Constants.DOCEX.STAGE.EXTRACTED,
                soft_deleted:false
              };
              const response = await DocumentService.processAction({payload: updatePayload, filter: { _id: this.documentData._id }, document_id : this.documentData._id, action: Constants.DOCEX.TRIGGER_ACTION.RESTORE});
              if (_.get(response, "data.status")) {
                    this.notifySuccess("Record restored successfully.")
                    this.$router.push({
                    path: `/idp/document/${this.documentData.document_type}`
                    });
                    return;
              }
               this.notifyError(_.get(response, "data.message")||"Error while restoring record.");
            }
            catch(error){
              console.error(error);
              this.notifyError("Error while restoring record.");
            }
          })
        },

        async deleteDocument(){
            /**
             * STEP 1. Ask for confirmation to delete the document
             * STEP 2. Call rest api "/portal/api/idp-remove-document"(existing endpoint) to delete the current document
             * STEP 3. On Success response, call parent's "openNextDocument" method to navigate to the immediate next document
             * this.$emit("openNextDocument");
             */

            //STEP 1. Ask for confirmation to delete the document
            this.$confirm(`Are you sure you want to delete this document ?`, "Confirmation", {
                confirmButtonText: "Confirm",
                cancelButtonText: "Cancel",
                type: "warning",
            }).then(async () => {
                try {
                    this.$emit("update:loading", true);
                    //STEP 2. Call rest api "/portal/api/idp-remove-document"(existing endpoint) to delete the current document
                    const response = await DocumentService.removeDocument({document_id : this.documentData._id, action: "delete"});
                    if (response.data && _.get(response, "data.status") === true) {
                        this.notifySuccess("Record deleted")
                        //STEP 3. navigate to the immediate next document
                        //true is the value for isDocDeleted param
                        this.$emit("openNextDocument", true);
                        return;
                    }
                    this.notifyError(_.get(response,"data.data.message")||"Error while deleting record!");
                } catch (e) {
                    console.error(e);
                    this.$emit("update:loading", false);
                    this.notifyError("Error while processing ..");
                }
            });
        },

        refreshPage() {
            this.$emit("refreshPage");
        },

        async publish() {
            // Check if data changed
            if (this.hasDataChanged()) return this.notifyError("Please save the data before proceeding");
            // Check if document has errors
            if (this.isDocumentContainErrors()) return this.notifyError("Please resolve the errors before proceeding");
            // Dont allow to send for approval. direct publish
            //if (this.isDirectPublish && _.get(this.customerConfiguration.config, "enable_approval", false)) return this.confirmPublishForPublisher();
            if (this.isDirectPublish && _.get(this.customerConfiguration.config, "enable_approval", false) && !_.get(this.customerConfiguration, "approval_workflow_id", null)) return this.confirmPublishForPublisher();

            this.publishDialogVisible = true;
        },

        handlePublishDialogClose(params) {
            this.publishDialogVisible = false;
            params ? this.refreshPage() : "";
        },
        async reject() {

            /**
             * This action specifically handles document rejection based on user interaction:
             * - If the user clicks 'No', the document gets rejected.
             * - Clicking 'Yes' opens the Rejection Mail Dialog.
             * - Clicking outside the confirm dialog closes it without any action.
             *
             * For more details, refer to the documentation: https://element.eleme.io/#/en-US/component/message-box#distinguishing-cancel-and-close
             */
            this.$confirm('Do you want to send an email to the vendor?', 'Confirmation', {
                distinguishCancelAndClose: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                type: "warning"
            }).then(() => {
                this.rejectDialogVisible = true;
            }).catch(async (action) => {
                if (action === 'cancel') {
                    const payload = {
                        stage: Constants.DOCEX.STAGE.REJECTED,
                        _id: this.documentId,
                        rejected_by: _.get(this.$store.getters.user, 'full_name'),
                        rejected_at: moment().format()
                    }
                    const rejectDocResponse= await DocumentService.update(payload);
                    if (rejectDocResponse.status == 200 || rejectDocResponse.status == 201) {
                        this.notifySuccess("Document rejected successfully")
                    } else {
                        this.notifyError("An error occurred while rejecting the document");
                    }
                    EventBus.$emit("refresh_page")
                }
            })
        },
       handleEmailDialogClose() {
            this.emailDialogVisible = false;
        },
        handleRejectDialogClose() {
            this.rejectDialogVisible = false;
        },

        async saveData(params = {}) {
            this.$emit("update:loading", true);
            let updatedDocResponse = this.updatePrediction();
            params.document_id = this.documentId;
            params.prediction = updatedDocResponse.prediction;
            params.modified_fields = this.newModifiedFields;
            params.unpredicted_fields = this.$store.getters["documentViewStore/unpredictedFields"];

            return new Promise((resolve, reject) => {
                Promise.all([
                    DocumentService.processAction(params)
                ])
                .then((res) => {
                    _.get(res[0], "data.status") ?
                        resolve(true) :
                        reject(_.get(res[0], "data.message"));
                })
                .catch((err) => {
                    reject(false);
                })
                .finally(() => {
                    this.$emit("update:loading", false);
                });
            });
        },

        getRequiredFields() {
            let response = _.map(this.fieldData, (field) => {
                if (field.selected) return field._id;
            });

            let params = {
                documentType: this.documentData.document_type,
                requiredFields: _.compact(response),
            };
            return params;
        },

        removeMasterCheckbox(updatedPrediction){
            _.remove(updatedPrediction, (field)=>{
                   return field.is_master_checkbox || (_.get(field, 'field_config.type') == 'checkbox' && _.isEmpty(field.value));
             })
        },
        updateSingleTablePrediction(updatedTablePrediction) {
            const tablePrediction = this.clonedPrediction.find((item) => item.name === "table");

            for (let rowIndex = 0; rowIndex < updatedTablePrediction.content.rows.length; rowIndex++) {
                const row = updatedTablePrediction.content.rows[rowIndex];

                for (const field of row) {
                    this.cleanAndUpdateData(tablePrediction.content.rows[rowIndex], field);
                    // Removing unwanted keys from the field after cleaning and updating data for field
                    this.removeUnwantedKeys(field);
                }
            }
        },

        updateMultiTablePrediction(updatedTablePrediction) {
            const tablePredictionForMultiTable = updatedTablePrediction.data;

            for (let tableIndex = 0; tableIndex < tablePredictionForMultiTable.length; tableIndex++) {
                const tableData = tablePredictionForMultiTable[tableIndex];

                for (let rowIndex = 0; rowIndex < tableData.content.rows.length; rowIndex++) {
                    const row = tableData.content.rows[rowIndex];
                // Check if 'row' is an array before iterating over its elements
                    if(_.isArray(row)){
                        for (const field of row) {
                            this.cleanAndUpdateData(row, field);
                            // Removing unwanted keys from the field after cleaning and updating data for field
                            this.removeUnwantedKeys(field);
                        }
                    }

                }
            }
        },

        updateHeaderPrediction(updatedPrediction) {
            for (const field of updatedPrediction) {
                if (field.name !== "table") {
                    this.cleanAndUpdateData(this.clonedPrediction, field);
                    // Removing unwanted keys from the field after cleaning and updating data for field
                    this.removeUnwantedKeys(field);
                }
            }
        },
        /*
            The function adjusts the data based on the presence of multiple tables and removes the master checkbox. It then constructs a response object with the document ID and updated prediction, returning it.

            This function updates the document viewer's prediction data. It uses:
            - clonedPrediction: The original Vuex store prediction data.
            - updatedPrediction: The modified prediction data.
            - updatedTablePrediction: The modified table data.
        */
        updatePrediction() {
            try {
                let response = {};
                this.clonedPrediction = this.$store.getters["documentViewStore/clonedPrediction"];
                let updatedPrediction = this.fieldPredictionData.prediction;
                let updatedTablePrediction = _.find(updatedPrediction, { name: "table" });

                this.removeMasterCheckbox(updatedPrediction);
                this.updateHeaderPrediction(updatedPrediction);
                if (this.documentData.is_multi_table) {
                    this.updateMultiTablePrediction(updatedTablePrediction);
                } else {
                    this.updateSingleTablePrediction(updatedTablePrediction);
                }
                response.document_id = this.documentData._id;
                response.prediction = updatedPrediction;
                return response;
            } catch (e) {
                console.error(e);
            }
            response.document_id = this.documentData._id;
            response.prediction = updatedPrediction;
            return response;
        },

        removeUnwantedKeys(field) {
            ['field_config', 'validationMsgs'].forEach(key => delete field[key]);
        },

        cleanAndUpdateData(data = [], updatedField) {
            try {
                if (!_.get(updatedField, "field_config.selected")) return;
                //add flage for package fields only
                if (_.get(updatedField, "field_config.field_level") == Constants.DOCEX.FIELD_LEVEL.PACKAGE) {
                    updatedField.packageField = true;
                }
                let PredictedField = _.find(data, {
                    name: updatedField.name,
                });
                const PredictedFieldValue = _.get(PredictedField, "value")
                if (PredictedField && PredictedFieldValue != updatedField.value && _.get(updatedField, "field_config.selected") == true) {
                    updatedField.is_modified = true;
                    let modifiedField = { 'field_name': updatedField.name, 'label':PredictedField.field_config.label, 'old_val': PredictedFieldValue, 'field_type': PredictedField.field_config.field_type, 'index': updatedField.field_config.index }
                    if (_.get(updatedField, "field_config.field_level") == Constants.DOCEX.FIELD_LEVEL.PACKAGE) {
                        modifiedField['packageField'] = true;
                    }
                    this.newModifiedFields.push(modifiedField);
                    if (!this.allModifiedFields.includes(updatedField.name)) {
                        this.$store.commit("documentViewStore/addUnpredictedFields", updatedField.name);
                    }
                }
            } catch (e) {
                console.error("error in clean and update data::", e)
            }
        },

        handleCloseAssignmentDialog(isTableRefreshRequired) {
            this.showAssignModal = false;
            if (!isTableRefreshRequired) return;
            // this.showDatatable = false;
            // this.$nextTick(()=>{
            //   this.showDatatable = true;
            // })
        }

    },
    components: {
        FieldCard,
        CommentAttachment,
        PublishDialog,
        RejectDocDialog,
        SlushBucket,
        EmailApprovalDialog,
        Message,
        DocumentAssign,
        ActionButtons,
        EmailDetails,
        DocumentActiveUsers
    },
    created() {

    },
    mounted() {
        this.prepareSelectionFields()
    },
    updated(){
        console.log("Properties:: Updated");
    },
    beforeDestroy() {},
    async beforeMount() {

        let user = this.$store.getters.user;
        // this.customerConfiguration= window.kan_customer_configuration['document_type'] == this.documentData.document_type
        const documentRecord = this.$store.getters["documentViewStore/documentRecord"]
        this.actionTaken = _.get(documentRecord, 'action')

        if (user.roles.includes(this.constants.DOCEX.ROLES_MAP.IDP_REVIEWER)) {
            this.isReviewer = true;
        }
        if (user.roles.includes(this.constants.DOCEX.ROLES_MAP.IDP_PUBLISHER)) {
            this.isPublisher = true;
        }
        if (user.roles.includes(this.constants.DOCEX.ROLES_MAP.IDP_PUBLISHER_ONLY)) {
            this.isPublisherOnly = true;
        }
        if (user.roles.includes(this.constants.DOCEX.ROLES_MAP.IDP_DEVELOPER)) {
            this.isDeveloper = true;
        }
        if (user.roles.includes(this.constants.DOCEX.ROLES_MAP.IDP_CUSTOMER_ADMIN)) {
            this.isAdmin = true;
        }
        if (user.roles.includes(this.constants.DOCEX.ROLES_MAP.IDP_REVIEWER_ONLY)) {
            this.isReviewerOnly = true;
        }
    },
};
</script>

<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";

.tabs-container {
    background-color: var(--dark-08);

    .el-tabs__nav-wrap {
        border-bottom: 1px solid var(--dark-06);

    }

    .el-tabs__header {
        margin: 0;
        background: var(--dark-07);
        padding-top: var(--space-base);
        // margin: 0 var(--space-base);
    }

    .el-tabs__nav-wrap {
        // margin-top: var(--space-sm);
        padding: 0 var(--space-base);
        height: 37px;
        overflow: visible;

        &::after {
            display: none;
            height: var(--border-base);
            background-color: var(--dark-07);
        }

        .properties-pane-tab-label {
            &::after {
                position: relative;
                display: inline-block;
                content: "";
                border-radius: 0.375rem;
                height: 5px;
                width: 5px;
                margin-right: 0.5rem;
                background-color: #38a169;
                top: -4px;
                left: 2px;
            }
        }

        #tab-fields {
            margin-left: 0 !important;
        }

        .el-tabs__item {
            font-size: var(--font-sm);
            text-transform: uppercase;
            color: var(--dark-02);
            height: 3rem;
            padding: 0 1rem !important;
            background: transparent;
            border-radius: .3rem .3rem 0 0;
            margin: 0 .25rem;

            &::after {
                height: 3px;
                background-color: var(--dark-06);
                width: 100%;
                position: absolute;
                content: '';
                bottom: -2px;
                left: 0;
            }
        }

        .el-tabs__item:not(.is-active) {
            color: var(--dark-04);

            //background-color:white;
            &:hover {
                color: var(--dark-02);
            }
        }

        .el-tabs__item.is-active {
            border: 1px solid var(--dark-06);
            background: var(--dark-08);
            border-bottom: 0;
            color: var(--brand-05);

            &::after {
                height: 3px;
                background-color: var(--dark-08);
                width: 100%;
                position: absolute;
                content: '';
                bottom: -2px;
                left: -0.5;
            }
        }

        // .el-tabs__item.is-active {
        //   color: var(--dark-05);
        //   background-color:#edf2f7;
        // }

        .el-tabs__active-bar {
            display: none;
        }

        .properties-pane-tab-label {}

        #tab-second {
            // background: url(../app/idp/assets/icon-comments.svg);
        }
    }
}

// | tabs container

.field-container {
    background: var(--dark-08);
    position: relative;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;

    .tabs-container {
        height: 100%;
        flex: 1;
        overflow: auto;

    }

    .el-tabs {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .el-tabs__content {
        flex: 1;
        overflow: auto;
        // background: #edf2f7;
    }

    // scroll
    .field-scroll::-webkit-scrollbar {
        width: 6px;
        background-color: var(--white);
    }

    .field-scroll::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px var(--dark-06);
        background-color: var(--white);
    }

    .field-scroll::-webkit-scrollbar-thumb {
        background-color: var(--dark-05);
    }

    // | scroll

    .el-tabs__content::-webkit-scrollbar {
        width: 6px;
        background-color: var(--white);
    }

    .el-tabs__content::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px var(--dark-06);
        background-color: var(--white);
    }

    .el-tabs__content::-webkit-scrollbar-thumb {
        background-color: var(--dark-05);
    }

    .el-tab-pane {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    header {
        display: flex;
        justify-content: flex-end;
        padding: 0.7rem;
        background: var(--dark-08);

        // z-index: 99;
        // height: 2rem;
        // overflow: hidden;
        .title {
            margin-left: 0;
            margin-right: auto;
            font-weight: 700;
            font-size: var(--font-lg);
            color: var(--dark-03);
            padding: 0;
            border-bottom: 0px;

            span.title-name {
                display: inline-block;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 17rem;
                vertical-align: bottom;
            }
        }

        .actions {
            padding-top: var(--space-xs);
            display: flex;
            gap:4%;
            .v-switch-button{
                width: 11px;
                height: 11px;
            }

            .v-switch-label{
                line-height: 18px;
                font-size: 10px;
            }
            .el-button {
                padding: 0;
                margin: 0;

                span {
                    font-size: 1.428rem;
                    color: var(--dark-03);
                }
            }
        }
    }

    // | Header

    footer {
        border-top: var(--dark-06) solid var(--border-base);
        padding: var(--space-base) var(--space-base) var(--space-base) var(--space-base);
        // margin-top: var(--space-sm);
        width: 100%;
        // position: sticky;
        // bottom: 35px;
        // width: 100%;
        background: var(--dark-08);

        .footer-inner {
            display: flex;
            justify-content: flex-end;
            overflow: hidden;
            white-space: nowrap;
            margin-right: 0;
            .right-actions {
                margin-right: 0rem;
                overflow: auto;
                margin-left: .6rem;
                padding-bottom: 0.1rem;
                 .action-buttons {
                    span {
                        .el-button {
                            margin-right: var(--space-xs);
                        }
                    }
                    .el-button {
                            margin-right: var(--space-xs);
                        }
                        span:last-child {
                            .el-button {
                                margin-right: 0;
                            }
                        }
                }
                ::-webkit-scrollbar {
                    height: 2px;
                }


                ::-webkit-scrollbar-track {
                    background: transparent;
                }


                ::-webkit-scrollbar-thumb {
                    background: #CBD5E0;
                }
            }
        }
    }

    // | footer
    div.field-operation-container {
        display: flex;
        justify-content: flex-end;
        margin: 1rem;

        .language_selection_container {
            padding: 0px 16px 0px 16px;

            .el-select {
                background: var(--dark-07);
            }
        }

        .search_fields_container {
            position: relative;

            div.el-input {
                width: 10rem;

                input {
                    padding-left: 20px;
                    background-color: var(--dark-07);
                    font-size: var(--font-sm);
                    border-radius: 0;
                    height: 2rem;
                }

                &::placeholder {
                    font-size: var(--font-xs);
                }
            }

            span {
                position: absolute;
                top: 4px;
                left: 8px;
            }
        }

        .select_fields_container {
            margin-left: 16px;

            button {
                line-height: 1;
                padding: 6px 8px 6px 8px;
                font-weight: 500;
                font-size: 11px;
            }

            button.field-opener-button {
                color: #5a67d8;
                background-color: var(--dark-08);
                border: 1px solid #5a67d8;
            }

            span {}
        }
    }

    .add-filed {
        padding: var(--space-base) var(--space-base);
        display: flex;
        justify-content: flex-end;

        .el-button {
            padding: var(--space-md);
        }

        div:first-child {
            position: relative;
            margin-right: var(--space-sm);

            span {
                position: absolute;
                top: 0.2rem;
                left: 0.3125rem;
                color: var(--dark-05);
                font-size: 1.25rem;
            }
        }

        .el-input__inner {
            background: var(--dark-07);
            border: var(--border-base) solid var(--dark-06);
            font-size: var(--font-sm);
            border-radius: 0;
            padding-left: var(--space-sm);
            height: 2rem;

            &::placeholder {
                font-size: var(--font-xs);
            }
        }
    }
     // for insurance
     .insurance-fileds-container {
        overflow: auto;
                 .insurance-fileds-header {
                    padding: var(--space-xxs-5) var(--space-lg) 0 var(--space-lg);
                    display: flex;
                    margin-top: var(--space-base);

                    // margin-left: 0;
                    h2 {
                        font-weight: 500;
                        color: var(--dark-02);
                        padding: 0;
                        margin: 0;
                        font-size: var(--font-base-1);
                        margin:0 auto 0 0;
                    }
                    .el-button {
                        padding: 0;
                        border: 0;
                        font-size: 1.6rem;
                        color: var(--brand-05);
                        background: transparent;
                        box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px;
                        margin-right: .7rem;
                    }
                }
                .insurance-field-scroll {
                    overflow: auto;
                    height: auto !important;
                }
       }
    // add filed

    .field-scroll {
        flex: 1;
        overflow: auto;
        padding: 0 var(--space-sm);
        height: 100%;

        .el-checkbox-group {
            padding: 5px;
            background: var(--dark-09);
            border: 0;
            font-size: var(--font-base);
            border-radius: var(--radius-sm);
            padding-left: var(--space-sm);
            color: var(--dark-01);
            font-weight: 500;

            &::placeholder {
                color: var(--dark-04);
            }
        }

        .el-textarea__inner{
            padding: 0px;
            margin:0px;
            background: var(--dark-09);
            color: var(--dark-01);
            font-size: var(--font-base);
            border-radius: var(--radius-sm);
            font-weight: 500;
            padding: 0px 15px 0px 6px;
            &::placeholder {
                    color: var(--dark-04);
                }
        }

        .el-input {
            height: auto;

            .el-input__inner {
                background: var(--dark-09);
                border: 0;
                font-size: var(--font-base);
                border-radius: var(--radius-sm);
                padding-left: var(--space-sm);
                height: 2.585rem;
                color: var(--dark-01);
                font-weight: 500;

                &::placeholder {
                    color: var(--dark-04);
                }
            }
        }
    }


    // field scroll
}

.el-switch {
    .el-switch__core {
        top: -4px;
        background: var(--dark-05);
    }
}

.el-switch.is-checked .el-switch__core {
    border-color: var(--brand-04) !important;
    background-color: var(--brand-04) !important;
}

// list view UI
.add-approval-dialog-container {
    .el-dialog {
        padding: 1.5rem 2rem;
        width: 35% !important;
    }

    .title {
        font-size: var(--font-lg);
        margin: 0;
        color: var(--dark-02);
        display: inline-block;
        font-weight: normal;
        padding-bottom: 1.2rem;
    }

    .el-checkbox__label {}

    .input-email-form {
        .el-input__inner {
            border: 0px solid;
            background: var(--dark-07);
            color: #727070;
            height: 3.3rem;
        }

        .el-input-group__append {
            background: var(--dark-07);
            padding-right: 6px;

            .el-button {
                background: var(--brand-04);
                height: 2rem;
                margin: 0px;
                padding-left: 1rem;
                padding-right: 1rem;
                line-height: 0;
                color: white;
                font-size: 13px;
            }
        }
    }

    .btn-close {
        position: absolute;
        right: 1rem;
        top: 0.7rem;
        border: 0;
    }

    // scroll
    .approver-list-box-container::-webkit-scrollbar {
        width: 6px;
        background-color: var(--white);
    }

    .approver-list-box-container::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px var(--dark-06);
        background-color: var(--white);
    }

    .approver-list-box-container::-webkit-scrollbar-thumb {
        background-color: var(--dark-05);
    }

    // | scroll

    .approver-list-box-container {
        max-height: 200px;
        overflow-y: auto;
        overflow-x: hidden;

        label:last-child {
            border-bottom: 0;
        }

        label {
            width: 100%;
            clear: both;
            border-bottom: 1px solid #dcdfe6;
            padding: 0.8rem 1.5rem 0rem 0;
            margin: 0;
            font-size: var(--font-base);
            margin-left: 9px;

            .el-checkbox__input {
                line-height: 3;
            }

            .el-checkbox__label {
                // float: left;
                font-weight: 400;
                width: 90%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }

    .add-approval {
        border: 0.125rem dotted var(--dark-07);
        border-radius: var(--radius-base);
        padding: 0.1rem;
        margin-bottom: var(--space-xl);
        overflow: hidden;

        .el-form-item__error {
            margin-left: 13px;
            margin-top: 3px;
        }
    }

    .el-dialog__footer {
        padding: 0;
    }
}

// end .add-approval-dialog-container
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

.el-message-box__headerbtn {
    display: inherit !important;
}

.unread-msg-count {
    sup {
        font-size: 9px !important;
        height: 13px !important;
        line-height: 11px !important;
    }
}

.document-approve-reject-popup{
    .el-textarea__inner{
        margin:0px;
    }
}
</style>
