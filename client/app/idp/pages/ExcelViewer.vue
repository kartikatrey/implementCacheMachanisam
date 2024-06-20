<template>
  <div class="excel-container" v-loading="loading">
    <splitpanes
      class="default-theme"
      style="height: 100%"
      v-on:resize="resizeMainPane"
    >
      <pane size="70" >
        <div v-if="dialogVisible" class="modal_div update-modal-wrap" id="change-field-modal" :style="{ top: dialogTop, left: dialogLeft, width:'235px', 'z-index': '1000', position: 'relative'}">
          <div class="message-pointer"></div>
          <div class="modal-header">
              <div class="header-action-container">
                  <el-button-group>
                      <el-button cid="idp-canvas-field-modal-close" class="header-actions" size="mini" icon="mdi mdi-close" @click="hideFieldModal"></el-button>
                  </el-button-group>
              </div>
          </div>
          <div id="modal-box" v-if="!visibleConfirmationContent" class="input_inner" ref="modalBox">
            <v-select
              cid="idp-canvas-modal-select-field"
              @input="handleModalClick"
              :options="fieldInputFilter"
              :clearable="false"
              placeholder="Search field"
              :value = selectedFieldName
            >
            </v-select>
          </div>
          <div class="confirm-modal" v-if="visibleConfirmationContent">
                <h5>Confirm Field Change?</h5>
                <span class="word-break-label"> will be replaced by {{ modalClickedData.label }}</span>
                <div class="buttons-container">
                    <el-button cid="idp-canvas-field-modal-confirm" class="kp-btn-form-primary" type="primary" size="mini" @click="changeFieldData">Confirm</el-button>
                    <el-button cid="idp-canvas-field-modal-cancel" class="kp-btn-form-primary" size="mini" type="primary" @click="closeConfirmation">Cancel</el-button>
                </div>
            </div>
        </div>
        <IdpExcel
          title="Excel Viewer "
          :width="excelWidth"
          :data="excelData"
          :allowUpdate = true
          :updateUrl="updateUrl"
          :loadUrl="loadUrl"
          :gridKey="parentDocumentId"
          :handleCellEditBefore="handleCellEditBefore"
          :showsheetbarConfig="showsheetbarConfig"
          :cellRightClickConfig="cellRightClickConfig"
          :sheetRightClickConfig="sheetRightClickConfig"
          :enableAddRow="enableAddRow"
          :enableAddBackTop="enableAddBackTop"
          :showtoolbarConfig="showtoolbarConfig"
          :sortConfig = "sortConfig"
          @rangeSelect = "handleRangeSelect"
          @sheetActivate = "handleSheetActivate"
          @cooperativeMessage ="handleCooperativeMessage">
        </IdpExcel>
      </pane>
      <pane size="30" max-size="30" min-size="20">
        <IdpExcelProperties
          v-if="isExcelConfigInitialized && isParentDataInitialized"
          ref="IdpExcelProperties"
          :excelData="excelData"
          :publishableDocIds="publishableDocIds"
          :childDocIds="childDocumentIds"
          :documentIds="documentIds"
          :fieldId="selectedCellFieldId"
          :parentDocument="parentDocument"
          :parentDocumentId="parentDocumentId"
          :fieldNameToLabelMap="nameToLabelMap"
          :excelConfig="excelConfig"
          :publishTo="publishTo"
          @updateRenderKey ="getParentDocData"
          :renderKey="renderKey"
          :isDocumentReadOnly="isDocumentReadOnly">

        </IdpExcelProperties>
      </pane>
    </splitpanes>

  </div>
</template>
<script>
import IdpExcel from "@/idp/components/IdpExcel.vue";
import IdpExcelProperties from "@/idp/components/IdpExcelProperties.vue";
import DocumentService from "@/idp/services/DocumentService";
import IdpSheetService from "@/idp/services/excel/IdpSheetService";
import CustomerConfig from "@/idp/services/DeCustomerConfig";
import Constants from "@/resources/Constants";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import EventBus from "@/EventBus";
import {isArrayContainsArrayElement} from "@/util/CommonUtil";
import _ from "lodash";
import FieldService from "@/idp/services/FieldService";

export default {
  components: {
    IdpExcel,
    IdpExcelProperties,
    Splitpanes,
    Pane,
  },
  name: "ExcelViewer",
  data() {
    return {
      parentDocData : {},
      fieldInputFilter:[],
      busEvents: [],
      orgFieldInputFilter : [],
      dialogVisible: false,
      dialogLeft : "",
      dialogTop : "",
      scrollTop : 0,
      scrollLeft : 0,
      renderKey : 0,
      visibleConfirmationContent : false,
      modalClickedData: "",
      selectedFieldName : "",
      loading: false,
      publishTo: null,
      excelWidth: 70,
      idpExcelProperties: {},
      nameToLabelMap:{},
      parentDocumentId:null,
      excelData: null,
      parentDocument:{},
      excelConfig:{},
      isExcelForm: false,
      documentConfiguration:{
        max_attachment_size_per_doc:""
      },
      customerConfiguration: {},
      isDocumentReadOnly:false,
      showMessageDialog:false,
      messageDialogTop:null,
      messageDialogLeft:null,
      messageDialogDisplay:'none',
      documentIds:[],
      publishableDocIds:[],
      childDocumentIds:[],
      selectedCellFieldId: null,
      showsheetbarConfig:{
        add: false,
        menu: true,
        // sheet: false,
      },
      showtoolbarConfig:{
        mergeCell: false,
        frozenMode: false,
        function:false
      },

      // Disable sheet right click menu's
      sheetRightClickConfig: {
        delete: false,
        copy: false,
        rename: false,
        color: false,
        hide: false,
        move: false,
	  },

      cellRightClickConfig: {
        deleteRow: false,
	      deleteColumn: false,
        insertRow: false,
	      insertColumn: false,
        hideRow: false,
        hideColumn: false,
        sort: false   //This Value will be either 'true/false' to 'show/hide' sort option for excel column
      },
      enableAddRow: false,
      enableAddBackTop: false,
      sortConfig:{
       showAscendingSort: false,
       showDescendingSort: false,
       showCustomSort: false
       }
    };
  },
  /**
   * This 'provide' function allows sharing the getDocumentConfiguration method
   * with all child components in the component tree, making it available for use.
   */
  provide(){
        return {
          getDocumentConfiguration:this.getDocumentConfiguration,
      }
  },
  computed : {
    isExcelConfigInitialized(){
      return this.parentDocument.hasOwnProperty('_id') && !_.isEmpty(this.excelConfig)
    },
    /**
     * Checks whether the parentDocData is initialized based on the document type.
     * If the document type is 'excelForm', the idpexcelProperties component should not render
     * until the parentDocData is initialized. For normal excel there is no need to wait
     * for parentDocData initialization, so it returns true.
     */
    isParentDataInitialized(){
      return this.isExcelForm ? !_.isEmpty(this.parentDocData) : true;
    }
  },

  methods: {
    /**
     * Processes the cell(s) selected for editing, and determines whether editing should be allowed or not.
     *
     * When a cell is selected for editing, this function:
     * 1. Retrieves information about the currently active sheet using the library (luckysheet).
     * 2. Extracts the relevant document IDs and cell details based on the selected range.
     * 3. Stores these document IDs and selected cells for potential further use.
     * 4. Checks if editing should be allowed based on the number of selected cells and document configuration.
     *
     * @param {Array} selections - Represents the selected cell range(s) in the sheet.
     * @returns {boolean} - True if editing action is permitted; otherwise, returns False.
    */
    handleCellEditBefore(selections){
      // Fetch details of the currently active sheet
      const sheet = window.luckysheet.getSheet()
      // Extract relevant details such as document IDs and selected cell information from the sheet based on the user's selection.
      const {documentIds,selectedCells} = IdpSheetService.getRangeInfo(sheet, selections);
      // Store the extracted document IDs and selected cell details for potential future reference or usage.
      this.documentIds = documentIds;
      this.selectedCells = selectedCells;

      // If only one cell is selected for editing:
      if(this.selectedCells.length ==1){
        // For a excel form configuration, determine if editing is allowed for the selected cell in a single-document context.
        if(this.isExcelForm){
          return this.isEditActionEnabledForExcelForm(this.selectedCells[0])
        }
         // Otherwise, determine if editing is allowed for the selected cell in a general context.
        return this.isEditActionEnabled(this.selectedCells[0])
      }
      // If multiple cells are selected, default to allowing the editing action.
      return true;
    },

    /**
     * Determines if the editing action is permitted for the given cell within the context of a excel form.
     *
     * This function evaluates:
     * 1. The stage and state of the parent document.
     * 2. If the current stage/state is among the restricted stages/states for editing.
     * 3. If the specific cell is allowed to be edited based on any additional criteria or configurations.
     *
     * @param {Object} cell - Represents the cell details being evaluated for edit permissions.
     * @returns {boolean} - True if editing action is permitted for the cell in the single-document context; otherwise, returns False.
    */
    isEditActionEnabledForExcelForm(cell){
      // Extract the stage and state of the parent document.
      const docStage = this.parentDocument["stage"];
      const docState = this.parentDocument["state"];
      // Define the stages and states that restrict cell editing.
      const restrictedStates = [ Constants.DOCEX.STATE_PUBLISHED.PUBLISH_IN_PROGRESS ];
      const restrictedStages = [ Constants.DOCEX.STAGE.PUBLISHED ];

      // If doc stage is published and cell edit action is enabled after publish, return true
      if (restrictedStages.includes(docStage) && _.get(this.excelConfig, "allow_cell_edit_after_publish")) {
        return true;
      }

      // If the current document's stage or state is among those that restrict editing, or if the specific cell is not
      // allowed to be edited, disallow the editing action.
      if(restrictedStages.includes(docStage) || restrictedStates.includes(docState) || !this.isCellAllowedToEdit(cell)){
        return false;
      }
      // If none of the restricting conditions apply, allow the editing action.
      return true;
    },

    isEditActionEnabled(cell){
      return this.isStageAllowedToEdit(cell) &&  this.isStageColumnEdit(cell) && this.isHeaderRowEdit(cell) && this.isCellAllowedToEdit(cell)
    },

    isStageAllowedToEdit(cell){
      const stage = IdpSheetService.getStageByRowIndex(cell.r)
      const restrictedStages = [
        Constants.DOCEX.EXCEL.STAGE_MAP["UPLOADED_EXTRACTED"],
        Constants.DOCEX.EXCEL.STAGE_MAP["EXTRACTED_EXTRACTED"],
        Constants.DOCEX.EXCEL.STAGE_MAP["EXTRACTED_PUBLISH IN PROGRESS"],
        Constants.DOCEX.EXCEL.STAGE_MAP["FRAUD FLAGGED_SUCCESS"],
        Constants.DOCEX.EXCEL.STAGE_MAP["PUBLISHED_SUCCESS"]
      ];
      return !_.includes(restrictedStages, stage);
    },

    isStageColumnEdit(cell){
      return cell.c != 0
    },

    isHeaderRowEdit(cell){
      return cell.r != 0
    },

    isCellAllowedToEdit(cell){
      return !cell.v.rs;
    },

    //called when any action taken on cell, say, click, update
    handleCooperativeMessage(message){
      if(message.type != 2) return;
      const receivedCell = JSON.parse(message.data)
      if(receivedCell.t != "v") return;
      //getting doc_id for cell being updated, so as to rerender document messages on RHS
      const recievedCellDocId = _.get(receivedCell, "v.doc_id");
      this.documentIds = (recievedCellDocId && [recievedCellDocId]) || [];
      // this.refreshValidationMessages(recievedCellDocId)
    },

    refreshValidationMessages(docId){
      if (docId) {
        const params = { document_id: docId };
        this.$refs.IdpExcelProperties.$refs.ValidationMessage.getValidationMessages(params);
      }
    },

    /**
     * Determines whether the 'Publish' action/button should be enabled for a excel form.
     *
     * The function checks:
     * 1. The current stage and state of the parent document.
     * 2. Whether the document's current stage/state falls within the predefined restricted stages or states for publishing.
     *
     * If the document's current stage/state is restricted for publishing, the function will disable the 'Publish' button;
     * otherwise, it will enable the 'Publish' button.
    */
    enablePublishActionForExcelForm(){
      // Initialize the flag to enable the Publish button by default.
      let enablePublishButton = true;

      // For publish to other than 'system', document can be published multiple times
      // hence, publish button will be enabled at all times.
      if(['csv', 'json', 'excel', 'email'].includes(this.publishTo)){
        this.$store.commit("excelViewStore/setEnablePublishAllButton", enablePublishButton);
        return;
      }

      // For publish to 'system', once document is published, it cannot be published again.
      // Extract the current stage and state of the parent document.
      const docStage = this.parentDocument["stage"];
      const docState = this.parentDocument["state"];
      // Define the stages and states in which publishing is restricted.
      const restrictedStates = [ Constants.DOCEX.STATE_PUBLISHED.PUBLISH_IN_PROGRESS ];
      const restrictedStages = [ Constants.DOCEX.STAGE.PUBLISHED ];
      // If the document's current stage or state is among those that restrict publishing, set the flag to disable the Publish button.
      if(restrictedStages.includes(docStage) || restrictedStates.includes(docState)){
        enablePublishButton = false;
      }
      // Update the Vuex store's state to either enable or disable the Publish button based on the above conditions.
      this.$store.commit("excelViewStore/setEnablePublishAllButton", enablePublishButton);
    },

    handleRangeSelectForExcelForm(sheet, selections){
      this.selectedCells = []
      const {selectedCells} = IdpSheetService.getRangeInfo(sheet, selections);
      this.publishableDocIds = this.parentDocument["_id"];
      this.excelData = sheet.celldata;
      this.documentIds = [this.parentDocument["_id"]];
      this.selectedCells = selectedCells;
      this.setSelectedCellFieldId()
      this.enablePublishActionForExcelForm()
      this.renderMessageBox(this.selectedCells, selections);
      this.openChangeFieldModal(this.selectedCells, selections)
    },

    async handleRangeSelect(sheet, selections){
      if(this.isExcelForm){
          return this.handleRangeSelectForExcelForm(sheet, selections)
      }
      this.selectedCells = []
      const {documentIds,selectedCells} = IdpSheetService.getRangeInfo(sheet, selections);
      const publishableDocIds = this.getPublishableDocIds(sheet, selectedCells);
      this.excelData = sheet.celldata;
      this.publishableDocIds = publishableDocIds;
      this.documentIds = documentIds;
      this.selectedCells = selectedCells;
      this.setSelectedCellFieldId()
      this.enablePublishAction()
      this.renderMessageBox(this.selectedCells, selections);
      await this.renderErrorMsg(documentIds[0])
    },

    async renderErrorMsg(documentId) {
      await this.$refs.IdpExcelProperties.$refs.ValidationMessage.setSheetValidationMessages("", documentId);
    },

    /**
     * Handles the activation of a sheet and fetches sheet-wise validation messages for the activated sheet.
     * @param {number} sheetIndex - The index of the sheet that has been activated.
     */
    async handleSheetActivate(sheetIndex) {
        // Call the 'setSheetValidationMessages' method on the 'IdpExcelProperties' component to fetch
        // sheet validation messages for the activated sheet.
        this.loading = true;
        await this.$refs.IdpExcelProperties.$refs.ValidationMessage.setSheetValidationMessages(sheetIndex,this.parentDocumentId);
        this.loading = false;
    },

    getPublishableDocIds(sheet, selectedCells){
      let publishableDocIds = []
      for(const cell of selectedCells){
        const stage = IdpSheetService.getStageByRowIndex(cell.r)
        const permittedStages = [
          Constants.DOCEX.EXCEL.STAGE_MAP["EXTRACTED_SUCCESS"],
          Constants.DOCEX.EXCEL.STAGE_MAP["EXTRACTED_FAILED"],
          Constants.DOCEX.EXCEL.STAGE_MAP["FRAUD FLAGGED_FAILED"],
          Constants.DOCEX.EXCEL.STAGE_MAP["EXTRACTED"]
        ];
         if(_.includes(permittedStages, stage)){
            publishableDocIds.push(cell.v.doc_id)
         }
      }
      publishableDocIds = _.uniq(publishableDocIds)
      return publishableDocIds ;
    },

    setSelectedCellFieldId(){
      const selectedCellFieldId = this.selectedCells.length == 1 ? this.selectedCells[0].v.field_id : null;
      this.$store.commit("excelViewStore/setSelectedCellFieldId", selectedCellFieldId);
    },

    enablePublishAction(){
      this.$store.commit("excelViewStore/setEnablePublishButton", !_.isEmpty(this.publishableDocIds));
    },
    async changeFieldData() {
      this.visibleConfirmationContent = false;
      this.dialogVisible = false;
      const selectedCell = this.selectedCells[0]

      //update all required keys to update excel cell.
      selectedCell.v["new_field_id"] = this.modalClickedData._id
      selectedCell.v["new_field_name"] = this.modalClickedData.name
      selectedCell.v["doc_id"] = this.parentDocumentId
      selectedCell.v["field_type"] = this.modalClickedData.field_type

      const rowId = selectedCell.r
      const colId = selectedCell.c

      //update fieldId for server side update with new_field_id
      window.luckysheet.setCellValue(rowId, colId, selectedCell.v)
      this.selectedCells[0].v["field_id"] = this.modalClickedData._id
    },
    closeConfirmation() {
        this.visibleConfirmationContent = false;
    },
    hideFieldModal() {
        this.dialogVisible = false;
        this.visibleConfirmationContent = false;
    },
    openChangeFieldModal(selectedCells, selections){
        this.dialogVisible = false;
        if(!selectedCells.length)return
        if(selectedCells[0].v.t_id && !selectedCells[0].v.is_table_header){
          //if selected cell is row cell, dont show modal
            return
        }
        this.selectedFieldName = ""
        this.visibleConfirmationContent = false;
        //filter fields based on field type.
        if(selectedCells[0].v.ft == "h" || !selectedCells[0].v.t_id){
          this.fieldInputFilter = _.filter(this.orgFieldInputFilter,(field)=>{
            return field.field_type == "header"
          })
        }
        else if(selectedCells[0].v.ft == "t" || selectedCells[0].v.t_id){
          this.fieldInputFilter = _.filter(this.orgFieldInputFilter,(field)=>{
            return field.field_type == "table"
          })
        }
        else{
          this.fieldInputFilter = this.orgFieldInputFilter
        }
        // get field object for selected field name
        const fieldObj = _.find(this.fieldInputFilter,(field)=>{
          return field._id == (selectedCells[0] && selectedCells[0].v && selectedCells[0].v.field_id)
        })
        if(fieldObj && fieldObj.label){
          this.selectedFieldName = fieldObj.label
        }

        //set location for dialogbox
        this.dialogTop = ((selections[0].top + selections[0].height + 123) - this.scrollTop ) + "px"
        this.dialogLeft = ((selections[0].left + 40) - this.scrollLeft) + "px"
        this.dialogVisible = true;
    },
    onScroll(event) {
      const target = event.target;
      const isModalBoxContains = this.$refs && this.$refs.modalBox && this.$refs.modalBox.contains(target); //If a scroll event occurs on the <v-select> options, we don't hide the options on scroll. To prevent that, this check is needed.
      if (!isModalBoxContains) {
        this.dialogVisible = false;
      }
      this.visibleConfirmationContent = false
      this.scrollTop = document.getElementById("luckysheet-scrollbar-y").scrollTop /* or: e.target.documentElement.scrollTop */
      this.scrollLeft = document.getElementById("luckysheet-scrollbar-x").scrollLeft
    },
    renderMessageBox(selectedCells, selections){
        if(selectedCells.length != 1)return;
        // Get the value current selected range
        const selectedCellValue = window.luckysheet.getRangeValue()
        let selectedCellMsgs = _.get(selectedCellValue[0][0], "msg", [])
        let msgHtml="";
        for(const message of selectedCellMsgs){
          msgHtml = msgHtml + "<div>" + this.wrapMsgInHtml(message) + "</div>";
        }
        if(!msgHtml)return;
        $("#luckysheet-cell-main").append("<div id='luckysheet-dataVerification-showHintBox'></div>");
        $("#luckysheet-dataVerification-showHintBox").html( msgHtml).show().css({
              'left': selections[0].left,
              'top': selections[0].top + selections[0].height,
              'z-index': 10000
          });
    },

    wrapMsgInHtml(message){
      let msg  = message.m;
      if(message.fname){
        const name = `${message.fname}_${message.ftype.toLowerCase()}`
        msg = this.nameToLabelMap[name] ? this.nameToLabelMap[name] + ": " + message.m : message.m
      }
      const messageTypeHtmlMap = {
        "ERROR":'<span class="mdi mdi-alert-circle-outline error-info-icon document-error-message"></span><p class="document-error-message">'+ msg + '</p>',
        "WARNING":'<span class="mdi mdi-alert-circle-outline warning-info"></span><p class="document-warning-message">' +  msg + '</p>',
        "INFO":'<span class="mdi mdi-information information-icon"></span>' + msg,
        "FRAUD":'<span class="mdi mdi-alert warning-info"></span><p class="document-warning-message">' +  msg + '</p>',
        "SUCCESS":'<span class="mdi mdi mdi-checkbox-marked-circle success-icon"></span><p class="document-success-message">' +  msg + '</p>'
      }

      return  messageTypeHtmlMap[message.t];
    },

    resizeMainPane(event) {
      if (event && event[0]) {
        this.excelWidth = event[0].size;
      }
    },
    async getParentDocument(parentDocumentId){
      try {
        this.parentDocument= await DocumentService.getDocument({"_id":parentDocumentId},["-excel_data"]);
              } catch(error){
        console.error(error)
      }
    },
    async getParentDocData(render=false){
      try {
        const projection = ["_id", "prediction", "messages", "modified_fields", "br_field_config"];
        this.parentDocData = await DocumentService.getDocumentDataByDocId(this.parentDocumentId, projection);
        this.$store.commit("excelViewStore/setParentDocData", this.parentDocData);
        if(render){
          this.renderKey += 1;
        }
      } catch(error){
        console.error(error)
      }
    },

    async getExcelConfig(){
      const documentType = this.parentDocument.document_type ;
      const documentConfiguration = await CustomerConfig.getCustConfigByDocType(documentType)
      this.customerConfiguration = documentConfiguration
      this.publishTo = documentConfiguration.publish_to;
      return _.get(documentConfiguration ,"excel_config",{});
    },

    getNameToLabelMap(){
      let nameToLabelMap = {}
      if (!_.isEmpty(_.first(this.excelConfig.template))) {
        for(const template of this.excelConfig.template){
            nameToLabelMap[`${template.fname.toLowerCase()}_${template.ftype.toLowerCase() == "table" ? "line" : template.ftype.toLowerCase()}`] = template.label;
        }
    }
      return nameToLabelMap;
    },

    setEnablePublishAllButton(){
      if(this.parentDocument.state== Constants.DOCEX.STATE_PUBLISHED.PUBLISH_IN_PROGRESS || this.parentDocument.stage==Constants.DOCEX.STAGE.PUBLISHED || this.parentDocument.state == Constants.DOCEX.STATE_UPLOADED.IN_PROGRESS){
        this.$store.commit("excelViewStore/setEnablePublishAllButton",false);
      }
      else{
        this.$store.commit("excelViewStore/setEnablePublishAllButton", true);
      }
    },

    setEnableCancelButton(){
      if(this.parentDocument.stage != Constants.DOCEX.STAGE.CANCELLED && (this.parentDocument.state== Constants.DOCEX.STATE_PUBLISHED.PUBLISH_IN_PROGRESS || this.parentDocument.state == Constants.DOCEX.STATE_UPLOADED.IN_PROGRESS)){
        this.$store.commit("excelViewStore/setEnableCancelButton", true);
      }
      else{
        this.$store.commit("excelViewStore/setEnableCancelButton", false);
      }
    },
    setEnableValidateButton(){
      if(this.parentDocument.state== Constants.DOCEX.STATE_PUBLISHED.PUBLISH_IN_PROGRESS || this.parentDocument.state == Constants.DOCEX.STATE_UPLOADED.IN_PROGRESS || this.parentDocument.stage==Constants.DOCEX.STAGE.PUBLISHED){
        this.$store.commit("excelViewStore/setEnableValidationButton", false);
      }
      else{
        this.$store.commit("excelViewStore/setEnableValidationButton", true);
      }
    },
    handleModalClick(data) {
        this.visibleConfirmationContent = true;
        this.modalClickedData = data;
    },
    getDocumentConfiguration(){
        return this.customerConfiguration || {};
    },
    async getFieldConfig(){
      try{
        const params = {documentType: this.parentDocument.document_type,document_subtype : this.parentDocument.document_subtype}
        let fieldResponse = await FieldService.get(params);
        this.orgFieldInputFilter = fieldResponse.data.fieldsConfiguration
        this.$store.commit("excelViewStore/setOriginalFieldData",this.orgFieldInputFilter );
      }
      catch(e){
        console.log(e)
        this.orgFieldInputFilter = []
        this.fieldInputFilter = []
      }
    },
    registerEvents() {
        this.busEvents = [
            "update-field-value",
        ];
        EventBus.$on("update-field-value", (params) => {
            this.updateFieldValue(params);
        });
    },
    async updateFieldValue(params) {
        this.$store.commit("excelViewStore/updateFieldValue",params);
    },

  },
  mounted(){
    this.registerEvents();
    window.addEventListener("scroll", this.onScroll,true)

  },
  async beforeMount() {
    // This code is used to maintain a record of event names generated when values change.
    window.documentInputComponents = [];
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",false);
    //added for soket validation msgs
    let user = this.$store.getters.user;
    let payload={
        user_id:user.id,
        document_id:this.$route.query.id,
        insert:true
    }
    //This socket event adds user to the users list for the current document, When user opens/views a document.
    this.$socket.emit(Constants.SOCKET_EVENTS.ADD_OR_REMOVE_USERID_IN_DOCUMENT, payload);
    this.parentDocumentId = this.$route.query.id;
    // Storing parentDocumentId in document view store to get the attachments based on docId
    this.$store.commit("documentViewStore/documentId", this.parentDocumentId);
    this.loadUrl="/portal/api/excel-document/"+ this.parentDocumentId+"?do_not_wrap_response=true";
    // For all environments other than DEV
    if(process.env.NODE_ENV == "production"){
      this.updateUrl = `wss://${window.location.hostname}/wss/excel-update`;
    } else {
      // For environment DEV
      this.updateUrl = `ws://${window.location.hostname}:3000/wss/excel-update`;
    }

    await this.getParentDocument(this.parentDocumentId)
    this.excelConfig = await this.getExcelConfig();
    this.isExcelForm = IdpSheetService.isExcelFormType(this.excelConfig)
    this.nameToLabelMap = this.getNameToLabelMap();

    this.setEnableCancelButton()
    this.setEnableValidateButton()
    if(this.excelConfig.publish_all){
          this.setEnablePublishAllButton()
    }
    if(this.isExcelForm){
      //prepare field config list for change field modal
      await this.getFieldConfig()
      this.enablePublishActionForExcelForm()

      //Retrieve the prediction data for the Excel form to display undocument fields in the viewer.
      await this.getParentDocData();

      this.documentIds = [this.parentDocumentId]
    }
  },

  beforeDestroy(){
       window.luckysheet && window.luckysheet.destroy();
      window.removeEventListener("scroll", this.onScroll,true)
      EventBus.$off(this.busEvents);
	}
};
</script>
<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";

.btn-publish {
  line-height: .5 !important;
}
#add-user-footer {
.btn {
    line-height: .5;
    font-weight: 400;
  }
}

.el-message-box__btns{
  .el-button{
        line-height: 0;
        font-weight: 400;
        margin-left: var(--space-xs);
    }
}
.excel-container {
  .document-warning-message {
      display: contents;
      color: var(--yellow-04);
  }
  .document-error-message {
      display: contents;
      color: var(--red-04);
  }
  .document-success-message {
      display: contents;
      color: var(--green-04);
  }
  .success-icon{
        color: var(--green-04);
  }

  .splitpanes.default-theme .splitpanes__splitter:after,
  .splitpanes.default-theme .splitpanes__splitter:before {
    border: solid 2px !important;
    border-radius: 10px !important;
    cursor: pointer !important;
    z-index: 1 !important;
    color: #a0aec0 !important;
  }

  height: calc(100% - 2.457rem);
  margin-top: 2.457rem;

  .default-theme {
    height: 100%;
    // padding-bottom: 1.5rem;
    box-sizing: border-box;

    .splitpanes--vertical > .splitpanes__splitter {
      background: var(--dark-06);
      width: 0.3125rem;
    }

    .splitpanes__splitter {
      background: var(--dark-06);
      // height: 0.4125rem;
    }

    .splitpanes--horizontal > .splitpanes__splitter {
      background: var(--dark-06);
      height: 0.4125rem;
    }

    .default-theme.splitpanes--vertical > .splitpanes__splitter,
    .default-theme .splitpanes--vertical > .splitpanes__splitter {
      background: var(--dark-06);
      width: 0.4125rem;
    }

    .default-theme.splitpanes--horizontal > .splitpanes__splitter,
    .default-theme .splitpanes--horizontal > .splitpanes__splitter {
      background: var(--dark-06);
      height: 0.4125rem;
    }

    .splitpanes--horizontal:first-child .document-message-pane {
      border: 0.2rem solid #cb0000 !important;
      box-sizing: border-box;
      width: 99.99%;
    }

    .splitpanes--horizontal:first-child .document-message-published-pane {
      border: 0.2rem solid #bda82d !important;
      box-sizing: border-box;
      width: 99.99%;
    }
  }

  .luckysheet-sheet-area div.luckysheet-sheet-container {
    max-width: initial !important;
  }
  .luckysheet-sheet-area{
    z-index: 1000;
  }
  .luckysheet-stat-area{
    z-index: 1000;
  }
  .update-modal-wrap {
    background: var(--brand-05);
    border-radius: var(--space-xs);
    position: absolute;
    z-index: 600;
    text-align: center;
    box-shadow: 0 0px 24px #b2bbca;
    .vs__selected{
        clear: both;
        display: inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 135px;
        overflow: hidden;
    }
    .el-checkbox-group{
         background-color: var(--white) !important;
         padding:5px;
         text-align: left;
    }

    .el-textarea__inner{
         padding:0px;
         margin:0px;
         background-color: var(--white) !important;
         padding: 0px 15px 0px 6px;
    }
    .message-pointer {
        position: absolute;
        top: -6px;
        width: 0;
        left: -80px;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 8px solid var(--brand-03);
        margin: 0 100px;
    }

    .modal-header {
        background: var(--brand-03);
        height: var(--space-xl);
        border: none;
        border-top-left-radius: var(--space-xs);
        border-top-right-radius: var(--space-xs);

        .header-action-container {
            float: right;
        }

        .el-button-group {
            float: right;
        }

        .header-actions {
            border: 0;
            background: var(--brand-03);
            color: var(--white);
            height: var(--space-xxs);
        }
    }

    .confirm-modal {
        background: transparent;
        border: 0;
        text-align: center;
        border-radius: 7px;
        width: 100%;
        color: var(--white);
        overflow: visible;

        span {
            font-size: var(--font-sm);
        }

        .buttons-container {
            text-align: center;
            margin-top: var(--space-sm);
            margin-bottom: var(--space-xs);

            .el-button {
                background: var(--brand-03);
            }
        }

        p {
            color: #ffffff;
            margin: 7px 0;
            font-size: 12px;
        }

        h5 {
            margin: 5px 0;
            color: #ffffff;
            font-size: var(--font-base);
        }
    }


    .input_inner {
        padding: var(--space-base);
        .el-input__inner {
            height: var(--space-xl) !important;
            color: var(--dark-04);
            background: var(--dark-07);
            border-radius: var(--space-xxs);
            font-size: var(--font-sm);
        }

        .el-input__inner:focus {
            background: var(--dark-09);
        }

        .el-input__inner::placeholder {
            color: var(--dark-04);
            opacity: 1;
        }
    }
    .el-input__prefix {
        display: none;
    }
    .el-dropdown {
        margin-bottom: 5px;
    }
}
//   .luckysheet-sheet-area .luckysheet-sheets-item, .luckysheet-sheet-area {
//     display: block !important;
//   }

}
</style>
