<template>
    <section class="field-container" :key="renderKey">
        <header>
            <div class="title">
                <span class="title-name"> {{ parentDocument.file_name }} </span>
            </div>
                <ExcelStatus v-if="parentDocument && !excelConfig.is_excel_form_type" :documentId="parentDocumentId" :document="parentDocument" />
            <!-- </el-tooltip> -->
            <div class="actions">
                <el-button @click="downloadFile" type="text" >
                    <span class="mdi mdi-arrow-down-thin-circle-outline"></span>
                </el-button>
            </div>
        </header>

        <div class="tabs-container">
            <el-tabs v-model="activeTab">
                 <el-tab-pane v-if="excelConfig.is_excel_form_type"  label="Document fields" name="fields">
                <span cid="document_fields" slot="label">
                    DOCUMENT FIELDS</span>
                <div class="insurance-fields-container">
                    <div class="insurance-field-scroll field-scroll">
                            <div v-bind:key="fieldDataIndex" v-for="(fieldData, fieldDataIndex) in documentFields" class="block-container">
                            <div v-bind:key="fieldKey" v-for="(field, fieldKey) in fieldData" :class="getFieldClass(field)">
                                <field-card :props="field" :isFieldVisible="true" :key="field.name"></field-card>
                            </div>
                        </div>
                    </div>
                </div>

            </el-tab-pane>
                <el-tab-pane  label="Errors" name="validation_messages">
                    <span cid="Validation messages" slot="label">Errors</span>
                    <ExcelValidationMessages ref="ValidationMessage" v-if="renderValidationMsgsComponent"
                        :fieldNameToLabelMap="fieldNameToLabelMap"
                        :docType="parentDocument.document_type"
                        :docId="isExcelForm ? parentDocumentId : documentIds[0]"
                        :isExcelForm="isExcelForm"
                        :parentDocId="parentDocumentId">
                    </ExcelValidationMessages>
                </el-tab-pane>
                <el-tab-pane  label="Messages" name="message">
                    <span cid="Messages" slot="label">Messages <el-badge v-if="!isTabActive('message') && unreadCount>0" :value="unreadCount" class="item unread-msg-count" type="primary"></el-badge></span>
                    <message @updateCount="updateUnreadCount" v-if="renderMessageComponent" :isTabActive="isTabActive('message')" :org="parentDocument && parentDocument.org" :documentId="parentDocumentId" :fileType = "parentDocument.file_type"></message>
                </el-tab-pane>
                <el-tab-pane  label="History" name="history">
                    <span cid="History" slot="label">History</span>
                    <ExcelHistory v-if="renderHistory" :docId="documentIds[0]" :fieldId="selectedCellFieldId" :docType="parentDocument.document_type"></ExcelHistory>
                </el-tab-pane>
                <el-tab-pane  :label="commentLabel" name="comments" :disabled="isPaneDisabled('Attachments')">
                <span :cid="commentLabel" slot="label" :class="totalCommentCount.length > 0 ? 'properties-pane-tab-label' : ''">{{ commentLabel }}</span>

                <comment-attachment :docType="parentDocument.document_type" :isDocumentReadOnly="isDocumentReadOnly" ></comment-attachment>
                </el-tab-pane>
                <el-tab-pane  v-if="parentDocument && parentDocument.input_channel && parentDocument.input_channel.toLowerCase()=='email'"  label="EmailDetails" name="Email Details">
                    <span cid="EmailDetails" slot="label">Email Details </span>
                    <email-details :messageId="parentDocument && parentDocument.email && parentDocument.email.id" :docIds="parentDocument._id" :parentDocId="parentDocument.parent_document_id">  </email-details>
                </el-tab-pane>
            </el-tabs>
        </div>

        <footer>
            <div class="footer-inner">
                <div class="right-actions" >
                    <el-button :icon=validateIcon v-if="isActionEnabled(parentDocument.document_type,'excel_config.enable_validation')" id="validate-btn" class="btn-publish excel-btn-class" cid="validate" :disabled='!enableValidationButton' type="primary" size="small" @click="validate()">Revalidate</el-button>
                    <el-button  v-if="!excelConfig.publish_all" class="btn-publish excel-btn-class" :disabled='!enablePublishButton' cid="publish" type="primary" size="small" @click="publish()">Publish</el-button>
                    <el-button :icon=publishIcon v-if="excelConfig.publish_all" :disabled='!enablePublishAllButton' class="btn-publish excel-btn-class"  cid="publish" type="primary" size="small" @click="publish()">Publish</el-button>
                    <el-button :icon=cancelIcon v-if ="isActionEnabled(parentDocument.document_type,'excel_config.enable_cancel_publish')" type="primary" size="small" :disabled='!enableCancelButton'  cid="Cancel" class="btn-publish excel-btn-class"  @click="processCancelAction('publish')">Cancel</el-button>
                    <el-button :icon=saveDraftIcon v-if ="excelConfig.is_excel_form_type" type="primary" size="small" cid="save-draft" class="btn-save-draft-btn-class"  @click="processSaveAction()">Save Draft</el-button>
                </div>
            </div>
        </footer>
    </section>
</template>

    <script>
    import _ from "lodash";
    import Constants from "@/resources/Constants";
    import DocumentService from "@/idp/services/DocumentService";
    import IdpSheetService from "@/idp/services/excel/IdpSheetService";
    import Message from "../components/Message.vue";
    import ExcelValidationMessages from "./ExcelValidationMessages.vue";
    import ExcelHistory from "./ExcelHistory.vue";
    import ExcelStatus from "@/idp/table/components/ExcelStatus";
    import {mapState} from 'vuex';
    import {getQueryFilter} from "@/util/CommonUtil";
    import EmailDetails from "@/idp/components/EmailDetails";
    import FieldCard from "@/idp/components/FieldCard";
    import CommentAttachment from "../components/CommentAttachment.vue";

    export default {
        name: "IdpExcelProperties",
        props: [
            "renderKey",
            "parentDocumentId",
            "parentDocument",
            "documentIds",
            "publishableDocIds",
            "childDocIds",
            "refreshMessages",
            "excelData",
            "excelConfig",
            "fieldNameToLabelMap",
            "publishTo",
            "isDocumentReadOnly"
        ],
        watch: {
            documentIds: {
                handler: function (newVal, oldVal) {
                    if(this.documentIds.length <= 1){
                        // if length 0 then fetch all document messages
                        // if length 1 then fetch selected document messages
                        this.renderValidationMsgsComponent = true;
                        this.renderHistory = true;
                        // this.activeTab = "validation_messages"
                    }
                },
                deep: true,
                immediate:true
            }
        },
        computed:{
            ...mapState("excelViewStore",{
                enablePublishAllButton : state => state.enablePublishAllButton,
                enablePublishButton : state => state.enablePublishButton,
                enableCancelButton : state => state.enableCancelButton,
                selectedCellFieldId : state => state.selectedCellFieldId,
                enableValidationButton :state => state.enableValidationButton,
                loader : state => state.loader,
                parentDocData : state => state.parentDocData,
                originalFieldData: state =>state.originalFieldData,
                fieldPredictionData: state =>state.fieldPredictionData,

            }),
            // The document store is used here because it keeps track of the total attachment count within the commentAttachment component.
            // In this snippet, we retrieve the totalCommentCount from the document view store.
            ...mapState("documentViewStore",{
                totalCommentCount :state => state.totalCommentCount
            }),
            documentFields() {
                return this.groupedFieldData(Constants.DOCEX.FIELD_LEVEL.DOCUMENT)
            },
            commentLabel() {
                return `Attachments(${this.totalCommentCount})`;
            },
        },
        data() {
            return {
                unreadCount: 0,
                renderMessageComponent: true,
                renderValidationMsgsComponent: false,
                renderHistory: false,
                activeTab: "",
                constants: Constants,
                excelSummary:'',
                validateIcon : '',
                publishIcon : '',
                saveDraftIcon : '',
                cancelIcon : '',
                inProgressStates:[  Constants.DOCEX.STATE_UPLOADED.IN_PROGRESS,
                                    Constants.DOCEX.STATE_PUBLISHED.PUBLISH_IN_PROGRESS,
                                    Constants.DOCEX.STATE_UPLOADED.REQUESTED
                                ],
                isExcelForm: false
            };
        },

        sockets: {
            //This socket event receives the excel document's stage#state and shows the buttons on excel viewer accordingly.
            [Constants.SOCKET_EVENTS.EXCEL_VIEWER.EXCEL_VIEWER_EXCEL_STATUS]: function (excelStatusData) {
                 if(excelStatusData.parentDocumentId == this.parentDocumentId){
                    window.luckysheet.hideLoadingProgress()
                    this.cancelIcon = ""
                    this.publishIcon = ""
                    this.validateIcon = ""
                    const [currentStage, currentState] = excelStatusData.actionData.split("#"); // we are storing stage and state with # seperated
                    if(currentState == Constants.DOCEX.STATE_UPLOADED.SUCCESS && currentStage != Constants.DOCEX.EXCEL.PUBLISH_STAGE_STATE_MAP.PUBLISHED_SUCCESS){
                        this.$store.commit("excelViewStore/setEnablePublishAllButton",true)
                        this.$store.commit("excelViewStore/setEnableValidationButton",true);
                    }
                    if([Constants.DOCEX.EXCEL.PUBLISH_STAGE_STATE_MAP.PUBLISHED_SUCCESS,Constants.DOCEX.EXCEL.PUBLISH_STAGE_STATE_MAP.EXTRACTED_FAILED].includes(currentStage)){
                        this.$store.commit("excelViewStore/setEnableCancelButton",false);
                    }
                 }
            }
        },

        methods: {
            intializeActiveTab(){
                this.activeTab = this.excelConfig && this.excelConfig.is_excel_form_type ? "fields" : "validation_messages"
            },
            getFieldClass(field) {
                return field.field_config && Constants.DOCEX.COMPONENT_REQUIRE_FULL_SPACE.includes(field.field_config.type) ? "block-100" : "block-50";
            },
            /**
             * Group the field data based on the specified level.
             * @param {string} level - The level at which the fields should be grouped.
             * @returns {Array} - An array containing the grouped field data.
             */
            groupedFieldData(level) {
                let groupedData = [];

                // Include selected fields from de_customer_configuration in the prediction,
                // ensuring they are displayed on the field card and were not present before.
                const fieldData = this.mergeSelectedFieldsIntoPrediction();


                // Set the prepared field data in the store
                this.$store.commit("excelViewStore/setFieldPredictionData",fieldData);

                // If no matching data is found, return the default index
                const DEFAULT_INDEX = -1;
                _.each(fieldData, (field)=>{
                    let fieldLevel= _.get(field, 'field_config.field_level','document')
                    if (_.get(field, 'field_config.selected') && fieldLevel==level) {
                        // Adding validationMsgs to the field
                        field["validationMsgs"] = []
                        const validationMsgs = _.get(this.parentDocData, "messages", []);
                        validationMsgs.forEach(message => {
                            if (message.field_name === field.name) {
                                field["validationMsgs"].push(message);
                            }
                        });
                        if (_.isEmpty(groupedData)) {
                            groupedData.push([field]);
                            return;
                        }
                        let index = this.getAvailableSpaceIndex(groupedData, DEFAULT_INDEX);
                        index >= 0 ? groupedData[index].push(field) : groupedData.push([field]);
                    }
                })
                let isSingleLength = (field) => field.length == 1;
                let isFullSpaceComponent = (field) => !_.includes(Constants.DOCEX.COMPONENT_REQUIRE_FULL_SPACE, _.get(field[0], 'field_config.type'));
                let isNotLastIndex = (index, length) => index !== length - 1;

                let index = _.findIndex(groupedData, (field, index) => {
                    return isSingleLength(field) && isFullSpaceComponent(field) && isNotLastIndex(index, groupedData.length);
                }, DEFAULT_INDEX);

                index >= 0 && groupedData.push(groupedData.splice(index, 1)[0]);
                return groupedData;
            },
            /**
             * Merge selected header fields from originalFieldData into fieldPredictionData.
             * If a field with the same name exists in parentDocData.prediction, update its field_config;
             * otherwise, add a new object to fieldPredictionData.
             * @returns {Array} - Merged fieldPredictionData containing selected header fields.
             */
            mergeSelectedFieldsIntoPrediction(){
                let fieldPredictionData = []
                // Check if originalFieldData is empty then return
                if(!this.originalFieldData.length){
                    return fieldPredictionData;
                }
                this.originalFieldData.forEach((deField) => {
                    // Check if the field is selected, a header, and a derived field
                    if (deField.selected && deField.field_type === "header" && deField.is_derived_field) {
                        // Find an existing object with the same name in parentDocData.prediction
                        let predObj = _.find(this.parentDocData && this.parentDocData.prediction, { name : deField.name })
                        if(predObj){
                            // If it exists, update its field_config with a deep clone of deField
                            predObj.field_config = _.cloneDeep(deField)
                            fieldPredictionData.push(predObj)
                            return;
                        } else {
                            // If it doesn't exist, add a new object to fieldPredictionData
                            fieldPredictionData.push({
                                name: deField.name,
                                value: "",
                                field_config: _.cloneDeep(deField),
                                bounds : null,
                                value : null
                            });
                        }
                    }
                });
                return fieldPredictionData;
            },
            getAvailableSpaceIndex(groupedData, DEFAULT_INDEX) {
                return _.findIndex(groupedData, (group) => {
                    const isFullSpaceComponent = !Constants.DOCEX.COMPONENT_REQUIRE_FULL_SPACE.includes(group[0].field_config.type);
                    return group.length == 1 && isFullSpaceComponent;
                }, DEFAULT_INDEX);
            },
            updateUnreadCount(count) {
                this.unreadCount = count;
            },

            /**
             * Checks if the currently selected sheet is valid for publishing.
             *
             * @param {Object} parentDoc - The parent document object contains information about valid sheet indexes.
             * @param {number} sheetIndex - The index of the current sheet to be checked.
             * @return {boolean} - Returns true if the current sheet is valid for publishing, otherwise returns false.
            */
            checkIfCurrentSheetValid(parentDoc, sheetIndex){
                let isValidSheet = true; // Default to valid sheet
                // Check if the parentDoc has property 'valid_sheet_indexes'
                if(parentDoc && parentDoc.hasOwnProperty("valid_sheet_indexes")){
                    // If the current sheetIndex is not in the list of valid sheet
                    if (!parentDoc.valid_sheet_indexes.includes(sheetIndex)) {
                        // Construct error message and display it to the user
                        const msg = `Please select valid ${this.parentDocument.document_type} sheet to publish records.`;
                        this.showPublishErrorMessage(msg);
                        // Mark the sheet as invalid
                        isValidSheet = false;
                    }
                }
                return isValidSheet; // Return the validity status of the current sheet
            },

            /**
             * Handles the system publishing process for a list of documents.
             * This function attempts to publish a list of documents and manages the UI response based on the outcome.
             *
             * @param {Array<string>} docIds - An array of document IDs to be published.
             * @returns {void} - This function doesn't return anything.
            */
            async publishToSystemPlatform(docIds){
                // Set up parameters for the publish request. These parameters provide necessary information
                // about which documents to publish and some additional context (e.g., file type, bulk publish flag).
                const params = {
                    document_ids: docIds,
                    parent_document_id: this.parentDocumentId,
                    file_type: "excel",
                    bulk_publish: true,
                    document_type: this.parentDocument.document_type
                }
                // Make a call to the DocumentService to publish the provided documents.
                const response = await DocumentService.publish(params);
                // Extract data from the response.
                const data = response && response.data && response.data.data;
                if (data.status) {
                    this.showSuccessMessage(data.message)
                    // Update the UI state to reflect the successful publish action.
                    this.$store.commit("excelViewStore/setEnablePublishAllButton",false);
                    this.$store.commit("excelViewStore/setEnableCancelButton",true);
                    // Update the document state if provided in the response.
                    if(data.state) this.parentDocument.state = data.state
                    return;
                }
                // If the publishing attempt did not succeed, reset and update the UI to reflect this.
                // Hide any loading or progress indications.
                window.luckysheet.hideLoadingProgress()
                // Reset the publish icon and update UI buttons' states
                this.publishIcon = "";
                this.$store.commit("excelViewStore/setEnablePublishAllButton",true);
                this.$store.commit("excelViewStore/setEnableCancelButton",false);
                this.$store.commit("excelViewStore/setEnableValidationButton",true);
                // Notify the user about the error during publishing.
                this.$notify.error({
                    title: "Error",
                    dangerouslyUseHTMLString: true,
                    message: data.message
                });
            },

            /**
             * Handles the process of publishing data to either CSV or JSON format.
             * This function first validates the provided document for errors. If there are no errors, it will attempt
             * to publish the document in the desired format and manage the UI response accordingly.
             *
             * @param {Object} parentDoc - The parent document object containing metadata and potential error flags.
             * @param {number} sheetIndex - The index of the current sheet to be published.
             * @returns {void} - This function doesn't return anything.
            */
            async publishToDataFormat(parentDoc, sheetIndex){
                // Extract the error flag from the provided document.
                const docHasErrors = _.get(parentDoc, "has_errors", false);
                // Check for any errors in the document.
                // If there are errors, notify the user and stop the publishing process.
                if (docHasErrors) {
                    throw new Error("Please resolve the errors before publishing.")
                }
                const paylaod = {
                    customer_id: this.parentDocument.customer_id,
                    document_ids: JSON.stringify([this.parentDocumentId]),
                    document_type: this.parentDocument.document_type,
                    document_subtype: this.parentDocument.document_subtype,
                    sheet_index: sheetIndex,
                    export_type: this.publishTo,
                    file_name: this.parentDocument.file_name,
                    file_type: this.parentDocument.file_type,
                    is_excel_form: this.isExcelForm
                }
                // Inform the user about the export process initiation.
                const message = `Data is being exported as ${this.publishTo}.`;
                this.showSuccessMessage(message);
                // Initiate the data export process.
                DocumentService.exportData(paylaod);
                // Reset the UI to the default state after the publishing attempt.
                this.publishIcon = ""; // Clear the publishing icon
                window.luckysheet.hideLoadingProgress(); // Hide loading indicators
                this.$store.commit("excelViewStore/setLoader", false); // Disable the main loader
                this.$store.commit("excelViewStore/setEnablePublishAllButton", false); // Disable the publish button
            },

            /**
             * Handles the publishing process of a excel form to either CSV or JSON format.
             * This function validates the document for potential errors before attempting to export.
             * Once validated, it sends a request to the DocumentService to export the document and manages UI responses accordingly.
             *
             * @param {number} sheetIndex - The index of the current sheet to be published.
             * @returns {void} - This function doesn't return anything.
            */
            async publishExcelFormToDataFormat(paylaod){
                // Inform the user about the export process initiation.
                const message = `Data is being exported as ${this.publishTo}.`;
                this.showSuccessMessage(message);
                // Initiate the data export process.
                DocumentService.exportData(paylaod);
                // Reset the UI to the default state after the publishing attempt.
                this.publishIcon = "";
            },

            /**
             * Manages the publishing process of a excel form.
             * This function identifies the type of publishing required (CSV or JSON) and delegates the task
             * to the appropriate handler. It also ensures that the document is valid for publishing
             * by checking against a list of valid sheets and whether the document contains errors.
             *
             * @returns {void} - The function doesn't return anything.
            */
            async publishExcelFormDocument(){
                // Activate the loader to indicate a processing state in the UI
                this.$store.commit("excelViewStore/setLoader",true);
                // Retrieve the index of the currently active sheet.
                const sheetIndex = window.luckysheet.sheetmanage.getCurSheet();
                // Fetch the parent document to retrieve its error status and the list of valid sheets.
                const parentDoc = await DocumentService.getDocumentById(this.parentDocumentId, ["has_errors", "valid_sheet_indexes"]);
                // Validate whether the current sheet is among the list of valid sheets for publishing.
                const isValidSheet = this.checkIfCurrentSheetValid(parentDoc, sheetIndex)
                if(!isValidSheet) { return };
                // this pay load will be used by Document Service.
                const paylaod = {
                    customer_id: this.parentDocument.customer_id,
                    document_ids: JSON.stringify([this.parentDocumentId]),
                    document_type: this.parentDocument.document_type,
                    document_subtype: this.parentDocument.document_subtype,
                    sheet_index: sheetIndex,
                    export_type: this.publishTo,
                    file_name: this.parentDocument.file_name,
                    file_type: this.parentDocument.file_type,
                    is_excel_form: this.isExcelForm,
                    email_id: this.parentDocument.email && this.parentDocument.email.id
                }
                // If it is being published to email, use the Document Service to facilitate the email publication process.
                if (this.publishTo == "email") {
                    this.$store.commit("excelViewStore/setEnablePublishAllButton", false); // Disable the publish button
                    paylaod.parent_document_id = this.parentDocumentId //Required to retrieve document data in the publishService.
                    this.validateDocument(parentDoc);
                    const response = await DocumentService.publish(paylaod);
                    //Hnadling the document service response whether it is published or got an error
                    if (response && response.data && response.data.data && response.data.data.status) {
                        this.showSuccessMessage(response.data.data.message)
                    } else {
                        this.$notify.error({
                            title: "Error",
                            dangerouslyUseHTMLString: true,
                            message: response.data.data.message
                        });
                    }
                    // remove loading icon from the publish button.
                    this.publishIcon = "";
                    this.$store.commit("excelViewStore/setEnablePublishAllButton", true); // enable the publish button
                } else {
                    this.validateDocument(parentDoc);
                    // Check the desired publishing format and delegate to the appropriate handler.
                    await this.publishExcelFormToDataFormat(paylaod);
                }
                // Deactivate the loader once the publishing process is done, returning the UI to its normal state.
                this.$store.commit("excelViewStore/setLoader", false);
            },
            validateDocument(parentDoc){
                // Extract the error flag from the provided document.
                const docHasErrors = _.get(parentDoc, "has_errors", false);
                // Check for any errors in the document.
                // If there are errors, notify the user and stop the publishing process.
                if (docHasErrors) {
                    throw new Error("Please resolve the errors before publishing.")
                }
            },
            initializePublishing() {
                // Display a loading icon to indicate the publishing process is in progress.
                this.publishIcon = "el-icon-loading";
                window.luckysheet.showLoadingProgress();
                // Check if the document configuration is set to treat the document as a single entity.
                this.isExcelForm = IdpSheetService.isExcelFormType(this.excelConfig);
            },

            disableButtonsAndInitializeDocs(){
                // Disable validation and publish buttons to prevent further actions during publishing.
                this.$store.commit("excelViewStore/setEnableValidationButton", false);
                this.$store.commit("excelViewStore/setEnablePublishAllButton", false);
                // Prepare a list of document IDs for publishing.
                let docIds = []
                if (!this.excelConfig.publish_all) {
                    docIds = this.publishableDocIds;
                    if (!docIds.length) {
                        this.$notify.error({
                            title: "Error",
                            dangerouslyUseHTMLString: true,
                            message: "No valid documents to publish"
                        });
                        return;
                    }
                }

                // Activate the loader to indicate a processing state in the UI.
                this.$store.commit("excelViewStore/setLoader", true);
            },

            async fetchParentDocument() {
                return await DocumentService.getDocumentById(this.parentDocumentId, ["has_errors", "valid_sheet_indexes"]);
            },

            async delegatePublish(parentDoc, sheetIndex) {
                switch (this.publishTo) {
                    case "csv":
                    case "json":
                    case "excel":
                        await this.publishToDataFormat(parentDoc, sheetIndex);
                        break;

                    default:
                        await this.publishToSystemPlatform(this.publishableDocIds);
                }
            },

            /**
             * Manages the entire document publishing process based on the specified format (CSV, JSON, etc.).
             * This function ensures that all preliminary checks are met before attempting to publish.
             * It considers both scenarios of publishing a excel form and multiple documents.
             * If errors occur during the publishing process, they are caught and communicated to the user.
             *
             * @returns {void} - The function doesn't return anything.
            */
            async publish() {
                try {
                    // Set initial configurations and display loading indicators for publishing.
                    this.initializePublishing();

                    // If the document is an Excel form type, handle its publishing separately.
                    if (this.isExcelForm) {
                        await this.publishExcelFormDocument();
                        // Hide the loading progress after publishing the Excel form.
                        window.luckysheet.hideLoadingProgress();
                        return;
                    }

                    // If not an Excel form, disable certain UI elements to prevent interference during publishing.
                    // Also, initialize document IDs for publishing.
                    this.disableButtonsAndInitializeDocs();

                    // Fetch the index of the active sheet to be published.
                    const sheetIndex = window.luckysheet.sheetmanage.getCurSheet();
                    // Retrieve details of the parent document to aid the publishing process.
                    const parentDoc = await this.fetchParentDocument();

                    // Check if the current sheet is valid for publishing.
                    // If invalid, halt the publishing process.
                    if (!this.checkIfCurrentSheetValid(parentDoc, sheetIndex)) { return; }

                    // Depending on the desired output format or target, delegate the publishing task.
                    await this.delegatePublish(parentDoc, sheetIndex);
                } catch (e) {
                    // If any errors occur during the publishing process, display an error message.
                    this.showPublishErrorMessage(e.toString());
                    window.luckysheet.hideLoadingProgress()
                }
            },

            showPublishErrorMessage(msg) {
                this.publishIcon = "";
                window.luckysheet.hideLoadingProgress();
                this.showErrorMessage(msg);
                this.$store.commit("excelViewStore/setEnableValidationButton", true);
                this.$store.commit("excelViewStore/setEnablePublishAllButton", true);
            },

            async validate(){
                this.validateIcon = "el-icon-loading"
                window.luckysheet.showLoadingProgress()
                try{
                    const confirmRes = await this.$confirm(`This will rerun all the validations and will take few minutes to complete. Do you want to proceed?`, "Confirmation", {
                        confirmButtonText: "Yes",
                        cancelButtonText: "No",
                        type: "warning",
                    })
                    if(confirmRes){
                        this.$store.commit("excelViewStore/setEnableValidationButton",false);
                        this.$store.commit("excelViewStore/setEnablePublishAllButton",false)
                        const params= { "parentDocumentId": this.parentDocumentId,
                                        "fileType": "excel",
                                        "action":"validate"}
                        let ValidationRes =  await IdpSheetService.validate(params);
                        ValidationRes = ValidationRes.data
                        if(ValidationRes.state) this.parentDocument.state = ValidationRes.state
                        if (ValidationRes.status) {
                            this.notifySuccess(ValidationRes.message);
                            this.goToDocListPage();
                            return;
                        }
                        this.notifyError(ValidationRes.message);
                    }
                }catch (e) {
                    window.luckysheet.hideLoadingProgress()
                    this.validateIcon = ""
                    console.error("Error in validate::",e)
                }
                finally{ }
            },

            goToDocListPage() {
                const filter = getQueryFilter();
                const path = `/idp/document/${this.parentDocument.document_type}`;
                try{
                    this.$router.push({
                        path,
                        query: !_.isEmpty(filter) && {
                            filter: JSON.stringify(filter || {})
                        }
                    });
                }catch(e){
                    console.log(e)
                }
            },

            async processCancelAction(action){
                try{
                    const res = await this.$confirm('Do you want to cancel publish process', 'Confirm', {
                        confirmButtonText: 'Proceed',
                        cancelButtonText: 'Cancel'
                    }).catch((error)=>{});
                    if(res){
                        this.cancelIcon = "el-icon-loading"
                        window.luckysheet.showLoadingProgress()
                        this.$store.commit("excelViewStore/setEnableCancelButton",false);
                        const response = await IdpSheetService.processCancelAction(this.parentDocumentId, action);
                        if(response.state) this.parentDocument.state = response.state
                        response.status ? this.notifySuccess(response.message) :this.notifyError(response.message)
                    }
                }catch(error){
                    console.error("Error while processCancelAction:",error)
                }finally{

                }
            },
            /**
             * Update headerPredictionData with non-document(BR) fields from fieldPredictionData.
             * If a field with the same name exists in headerPredictionData, replace it; otherwise, add it.
             * @param {Array} headerPredictionData - Array to be updated with non-document fields.
             * @returns {Array} - Updated headerPredictionData.
             */
            updatePredictionWithNonDocFields(headerPredictionData){
                // Check if headerPredictionData is provided
                if(!headerPredictionData){
                    return
                }
                // Check if fieldPredictionData exists
                if (this.fieldPredictionData) {
                    this.fieldPredictionData.forEach((fieldPredData) => {
                        // Find the index of the object with the same name in headerPredictionData
                        const indexToUpdate = headerPredictionData.findIndex((predData) => predData.name === fieldPredData.name);
                        // Check if the name exists in headerPredictionData
                        if (indexToUpdate !== -1) {
                            // Replace the object in headerPredictionData with the one from fieldPredictionData
                            headerPredictionData[indexToUpdate] = fieldPredData;
                        } else {
                            // If the name doesn't exist, add the fieldPredictionData object to headerPredictionData
                            headerPredictionData.push(fieldPredData);
                        }
                    });
                }
                // Return the updated headerPredictionData
                return headerPredictionData;
            },
            
            getModifiedFields(prediction) {
                const modifiedFields = [];
                for (const field of prediction) {
                    if (field.is_modified) {
                        const modifiedFieldPayload = {
                            'field_name': field.name,
                            'label': _.get(field, "field_config.label"),
                            'old_val': field.value,
                            'field_type': _.get(field, "field_config.field_type"),
                            'index': _.get(field, "field_config.index")
                        }
                        modifiedFields.push(modifiedFieldPayload);
                        delete field.is_modified;
                    }
                }
                return modifiedFields || [];
            },

            async processSaveAction(){
                try {
                    this.saveDraftIcon = "el-icon-loading"
                    // Clone the prediction data for modification
                    const clonePredictionData = this.parentDocData ? [...this.parentDocData.prediction] : [];
                    // Get user modified fields
                    const modifiedFields = this.getModifiedFields(clonePredictionData);
                    // Prepare header data from the cloned prediction data
                    let headerPredictionData = DocumentService.getHeaderPredictionData(clonePredictionData)

                    // Update here predictionData with non doc fields values
                    headerPredictionData = this.updatePredictionWithNonDocFields(headerPredictionData)

                    // Removing validation messages from prediction object before saving in DB
                    headerPredictionData = this.removeValidationMsgs(headerPredictionData)

                    const params = {
                        action : "save",
                        modified_fields: modifiedFields,
                        prediction: headerPredictionData,
                        document_id : this.parentDocumentId,
                        isExcelFormType : true
                    }
                    const response = await DocumentService.processAction(params);
                    if(_.get(response,"data.status")){
                        this.showSuccessMessage("Document saved successfully")
                        this.saveDraftIcon = "";
                        this.$emit('updateRenderKey', true)
                    }
                    
                    // This block of code is executed exclusively for Excel forms.
                    // The page is reloaded to ensure that any new sheets added or old sheets deleted using BR are reflected in the Excel viewer.
                    // Simply reloading the data was insufficient to update the Excel viewer, hence the entire page is reloaded.
                    window.location.reload();
                } catch(error){
                    console.error("Error in processSaveAction:", error);
                    this.showErrorMessage("Failed to save document");
                    this.saveDraftIcon = "";
                }
            },

            removeValidationMsgs(headerPredictionData){
                headerPredictionData.forEach(predData => {
                // Check if 'validationMsg' property exists and delete it
                    if (_.has(predData, "validationMsgs")) {
                        delete predData.validationMsgs;
                    }
                });
                return headerPredictionData
            },

            showSuccessMessage(message){
                this.$notify({
                    title: "Success",
                    type: "success",
                    dangerouslyUseHTMLString: true,
                    message: message
                });
            },

            showErrorMessage(message){
                this.$notify({
                    title: "Error",
                    type: "error",
                    dangerouslyUseHTMLString: true,
                    message: message
                });
            },

            isTabActive(tab) {
                return tab === this.activeTab;
            },

            async downloadFile() {
                this.$store.commit("excelViewStore/setLoader", true);
                const params = {
                    file_name: this.parentDocument.original_file_name,
                    document_type: this.parentDocument.document_type,
                    storage_folder_path: this.parentDocument.storage_folder_path,
                    parent_document_id : this.parentDocument._id
                };
                try {
                    IdpSheetService.downloadExcelDocument(params);
                } catch (e) {
                    this.notifyError("Something went wrong.");
                } finally {
                    this.$store.commit("excelViewStore/setLoader", false);
                }
            }
        },
        components: {
            Message,
            ExcelValidationMessages,
            ExcelHistory,
            ExcelStatus,
            EmailDetails,
            FieldCard,
            CommentAttachment

        },
        created() {},
        mounted() {},
        beforeMount(){
            this.intializeActiveTab()
        },
    };
    </script>

    <style lang="scss">
    @import "../_idpVariables";
    @import "../_idpGlobal";

    .el-button--primary.is-disabled{
        background-color : #a0cfff !important;
    }
    .tabs-container {
        .insurance-fields-container{
            overflow: auto
        }
        .btn-publish{
            line-height:.5 !important;
        }
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

            .el-tabs__nav-scroll {
                overflow: visible;
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
                    background-color: var(--dark-08);
                    width: 100%;
                    position: absolute;
                    content: '';
                    bottom: -4px;
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
                    bottom: -3px;
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
            padding: var(--space-lg) var(--space-base) .5rem var(--space-base);
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

                .right-actions {
                    margin-right: 1.25rem;
                    overflow: auto;
                    margin-left: 1.25rem;
                    padding-bottom: 0.1rem;
                    display: flex;
                    align-items: center;
                    .el-button{
                        line-height: 0;
                        font-weight: 400;
                        margin-left: var(--space-xs);
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
            margin: 1rem 2rem 1rem 0rem;

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
                    background-color:var(--dark-08);
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
    .publish-notifications {
        margin-right: var(--space-md);
        font-size: 1.5rem;
    }
    .publish-in-progress {
        color: var(--green-03);
        width: 18.2px;
        height: 18.2px;
        transform-origin: center;
        margin-top:0.2rem;
    }
    .publish-info {
        color: var(--yellow-05);
    }
    .publish-success {
        color: var(--green-05);
    }
    .excel-btn-class{
        display: flex !important;
        align-items: center;
    }
    </style>
