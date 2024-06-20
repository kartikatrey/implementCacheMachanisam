<template>
<div>
    <div v-show="showVisualisationPage" class="document-container" v-loading="loading">
    <el-dialog
        class="document-visualisation-container"
        title="testing"
         @close="closeVisualisationDialog"
        :visible.sync="showVisualisationPage">
        <LossRunVisualisation ></LossRunVisualisation>
        <span slot="footer" class="dialog-footer">
    <el-button @click="closeVisualisationDialog">Close</el-button>
  </span>
    </el-dialog>
    </div>
    <div v-show="!showVisualisationPage" class="document-container" v-loading="loading">

        <splitpanes v-if="isInitialized" class="default-theme" style="height: 100%" v-on:resize="resizeMainPane" >
        <!-- <splitpanes class="default-theme" style="height: 100%" v-on:resize="resizeMainPane" v-if="isInitialized"> -->
            <pane size="70">
                <splitpanes horizontal style="height: 100%">
                      <pane v-if="showDocumentMessagesFlag && isPaneAllowed('DocumentMessages')" v-bind:class="[isPublishError ? 'document-message-published-pane' :'document-message-pane']" min-size="4" max-size="25" :size="documentMessagePaneSize">
                        <DocumentMessages/>
                    </pane>

                    <pane id="canvas_container" :size="canvasPaneSize" :min-size="50" class="canvas-container">
                        <div class="next-pre-btn">
                            <!-- <el-button size="mini" :disabled="currentIndex == 0" @click="openPrevDocument()"  type="primary"><i class="mdi mdi-chevron-left"></i>Previous</el-button>
                            <el-button size="mini" :disabled="currentIndex == paginationResponseLength - 1" @click="openNextDocument()" type="primary" >Next<i class="mdi mdi-chevron-right"></i></el-button> -->

                            <el-button size="small" class="mdi mdi-arrow-left-circle btn-icon" :disabled="currentIndex == 0 && paginationNo == 1 || hasButtonPermission('Previous')" @click="openPrevDocument()"  type="text"></el-button>
                            <el-button size="small" class="mdi mdi-arrow-right-circle btn-icon" :disabled="disableNextButton() || hasButtonPermission('Next')" @click="openNextDocument()" type="text" ></el-button>
                        </div>

                            <el-tooltip
                                class="item export"
                                effect="light"
                                content="Debug mode"
                                placement="top-start"
                             >
                             <el-switch class="debugger-button"  v-if="isDeveloper()" v-model="isDebuggerOn" @change="toggleDebugger()"></el-switch>

                            </el-tooltip>

                            <el-button type="text" :disabled="hasButtonPermission('visualisation-button')"  key="test" class="visualisation-button" v-if="showVisualisationToggle()" @click="toggleVisualisation" icon="mdi mdi-chart-areaspline"></el-button>
\
                        <div v-if="visible_searchbar" class="search-doc">
                            <div>
                                <el-input class="input-search-text" size="mini" circleprefix-icon="mdi mdi-magnify" placeholder="Search in document" v-model="search_text" clearable></el-input>
                            </div>
                            <div class="search-actions">
                                <el-button icon="mdi mdi-chevron-up" circle @click="handlePreviousSearch"></el-button>
                                <el-button icon="mdi mdi-chevron-down" circle @click="handleNextSearch"></el-button>
                                <el-button icon="mdi mdi-close" @click="closeSearchBox" circle></el-button>
                            </div>
                        </div> <!-- kp searchbar -->

                        <div class="invoice-container">
                            <div class="invoice-actions">
                                <el-button :disabled="hasButtonPermission('Idp Canvas Back')" cid="idp-canvas-back" class="back-button" icon="mdi mdi-undo" circle @click="goToDocListPage"></el-button>
                                <div class="invoice-toolbar-wrap">
                                    <div class="toolbar">
                                        <el-button cid="idp-canvas-zoom-in" class="toolbar-button" id="zoomIn" icon="mdi mdi-plus-circle-outline" title="Zoom In" circle @click="handleToolbarClick"></el-button>
                                        <el-button cid="idp-canvas-set-default" class="toolbar-button" id="expand" icon="mdi mdi-record-circle-outline" title="Set Default" circle @click="handleToolbarClick"></el-button>
                                        <el-button cid="idp-canvas-zoom-out" class="toolbar-button" id="zoomOut" icon="mdi mdi-minus-circle-outline" title="Zoom Out" circle @click="handleToolbarClick"></el-button>
                                        <el-button cid="idp-canvas-search" class="toolbar-button" id="search" icon="mdi mdi-magnify" title="Search" circle @click="showSearchBox"></el-button>
                                        <el-button cid="idp-canvas-translate" class="toolbar-button" v-if="docLanguage !=customerPrefferedLanguage" id="translate" :icon="'mdi '+ getTranslateIcon()" title="Translate" circle @click="onTranslateButtonClick"></el-button>
                                        <el-button cid="idp-canvas-undo" class="toolbar-button" icon="mdi mdi-undo-variant" :disabled="isDocumentReadOnly || cantUndo" title="Undo" circle @click="undo"></el-button>
                                        <el-button cid="idp-canvas-redo" class="toolbar-button" icon="mdi mdi-redo-variant" :disabled="isDocumentReadOnly || cantRedo" title="Redo" circle @click="redo"></el-button>
                                    </div>
                                    <!-- translation confirmation box -->
                                    <div v-if="showTranslationConfirmationDialog" class="language-translation-confirmation-box">
                                        <p class="language-translation-message">
                                            {{languageTranslationMessage}}
                                        </p>
                                        <el-button cid="idp-canvas-translate-to-lang" @click="translateLanguage" class="language-translation-translate-btn">Translate</el-button>
                                        <el-button cid="idp-canvas-translate-close" class="close-btn" icon="mdi mdi-close" @click="closeDialog" circle></el-button>
                                    </div> <!-- translation confirmation box -->
                                </div>

                                <div class="document-navigation">
                                    <div class="toolbar">
                                        <el-button cid="idp-canvas-prev-page" icon="mdi mdi-arrow-up" title="Next" @click="previousPage"></el-button>
                                        <el-input cid="idp-canvas-page-number-text" v-model="pageNumber" @keyup.enter.native="scrollToPage()"></el-input>
                                        <p>of {{totalPages}}</p>
                                        <el-button cid="idp-canvas-next-page" icon="mdi mdi-arrow-down" title="Previous" @click="nextPage"></el-button>
                                    </div>
                                </div>
                            </div>
                            <div class="invoice-wrapper">
                                <idp-canvas
                                    @showImageLoadingError="showImageLoadingError"
                                    @scrollToTheField="scrollToTheField"
                                    :showTranslatedText="showTranslatedText"
                                    :translatedWords="translatedWords[index]"
                                    v-for="(item,index) in canvasImageURLs"
                                    :ref="'page_number_'+ index"
                                    :id="getCanvasSelector(index)"
                                    :pageNumber="index+1"
                                    :searchText="search_text"
                                    :isDocumentReadOnly="isCanvasDisabled"
                                    :isTableSelected="isTableSelected"
                                    v-bind:loading.sync="loading"
                                    :key="'AB'+index"
                                    ></idp-canvas>
                            </div>
                        </div>
                        <!-- <PackageViewer /> -->
                    </pane>
                    <pane class="line-item-pane" min-size="4.5" :size="lineItemPaneSize" max-size="70">
                      <IdpLineTableWrapper
                        ref="IdpLineTableWrapper"
                        :isDocumentReadOnly="isDocumentReadOnly" 
                        :handleSetFieldConfigForRows="mergeData"
                        :reloadBoundingBox="reloadBBoxesByPage"
                        :key="lineItemsRefreshKey"
                        @refreshLineItem="mapFieldValue"
                      />
                    </pane>
                </splitpanes>
            </pane>

            <!-- fileds -->
            <pane size="30" :class="fieldsDefaultClass" max-size="38" min-size="19">
                <properties ref="properties"
                    :docSelectedLanguage="docSelectedLanguage"
                    @onLanguageChange="onLanguageSelectionChange"
                    @refreshPage="refreshPage"
                    @openDocument="openDocument"
                    @openNextDocument="openNextDocument"
                    :searchText="searchText"
                    v-bind:loading.sync="loading"
                    :isDocumentReadOnly="isDocumentReadOnly"
                    class="kp-docx-input"
                   ></properties>

            </pane>
            <!-- | fileds -->
</splitpanes>

        <!-- Details info popup -->
        <div v-if="displayDetailsInfo">
          <!-- <hsc-window-style-metal >
            <hsc-window positionHint="60 / 35" class="po-details-gragable-component" title="PO details" :minWidth="800"  :minHeight="300" :maxWidth="1100" :maxHeight="700" :isScrollable="false" :closeButton="true" :resizable="true" :isOpen.sync="displayDetailsInfo">
                <DetailsInfoPopup :displayDetailsInfo.sync="displayDetailsInfo" :data="displayInfoPopupData" />
             </hsc-window>
            </hsc-window-style-metal> -->
        </div>
        <!-- po mapper info popup -->
        <div v-if="displayPOMapperInfo">
          <hsc-window-style-metal >
            <hsc-window positionHint="60 / 35" class="po-details-gragable-component" :title="'Purchase Order - '+displayPOMapperData.field_value" :minWidth="minWidth"  :minHeight="minHeight" :maxWidth="1300" :maxHeight="600" :isScrollable="true" :closeButton="true" :resizable="true" :isOpen.sync="displayPOMapperInfo">
                <!-- <el-dialog width="80%" top="6vh" :show-close="false" :destroy-on-close="true" title="Add Business Rule" :visible.sync="displayPOMapperInfo" center> -->
                <POMapperPopup :displayPOMapperInfo.sync="displayPOMapperInfo" :data="displayPOMapperData" />
                <!-- </el-dialog> -->
             </hsc-window>
            </hsc-window-style-metal>
        </div>
    </div>
</div>
</template>

    <script>
    import LossRunVisualisation from "./LossRunVisualisation.vue";
    import FieldCard from "@/idp/components/FieldCard.vue";
    import IdpCanvas from "@/idp/components/IdpCanvas.vue";
    import FieldService from "@/idp/services/FieldService";
    import DocumentService from "@/idp/services/DocumentService";
    import LanguageTranslationService from "@/idp/services/LanguageTranslationService";
    import _ from "lodash";
    import DatePicker from "@/idp/components/DatePicker.vue";
    import CustomerConfig from "@/idp/services/DeCustomerConfig";
    import EventBus from "@/EventBus";
    import undoRedo from "@/idp/mixins/undoRedo";
    import Constants from "@/resources/Constants";
    import Validator from "@/services/Validator";
    import $ from "jquery";
    import POMapperPopup from '../components/POMapperPopup.vue'
    import DocumentPackageService from "@/idp/services/DocumentPackageService";
    // import PackageViewer from '../components/PackageViewer.vue'

    import {Splitpanes,Pane} from "splitpanes";
    import "splitpanes/dist/splitpanes.css";
    import DataTable from "../../components/DataTable.vue";
    import {scroller} from "vue-scrollto/src/scrollTo";
    import {jsPDF} from "jspdf";
    import Properties from "../components/Properties.vue";
    import DocumentMessages from "@/idp/pages/DocumentMessages";
    import IdpLineTableWrapper from "@/idp/components/IdpLineTableWrapper";
    import {getQueryFilter, setTableInputClass} from "@/util/CommonUtil";
    import DetailsInfoPopup from '../components/DetailsInfoPopup.vue'
    import ActionButtonConfig from "@/idp/services/ActionButtonConfig";
    import { mapState } from "vuex";
import { LexRuntime } from 'aws-sdk';
    const scrollTo = scroller();
    let kpLeftScrollOptions = {
        container: ".insurance-fileds-container",
        easing: "ease-in",
        offset: -60,
        force: true,
        cancelable: true,
        x: false,
        y: true,
    };
    let tableScrollToOptions = {
        container: ".line-table .vgt-responsive",
        easing: "ease-in",
        offset: -60,
        force: true,
        cancelable: true,
        x: true,
        y: true,
    };

    var canvas_options = {
        container: ".invoice-wrapper",
        easing: "ease-in-out",
        force: false,
        y: true,
    };

    export default {
        name: "DocumentView",
        components: {
            IdpCanvas,
            DocumentMessages,
            Splitpanes,
            Pane,
            FieldCard,
            DataTable,
            DatePicker,
            Properties,
            IdpLineTableWrapper,
            DetailsInfoPopup,
            POMapperPopup,
            LossRunVisualisation
            // PackageViewer
        },
        props: ['id'],
        mixins: [undoRedo],
        provide(){
             return {
                getDocumentConfiguration:this.getDocumentConfiguration,
                goToDocListPage:this.goToDocListPage
            }
        },
        watch: {
            "id":{
                handler: async function (newVal, oldVal) {
                    console.log("watcher:documentViewver:id")
                    if(!newVal || (newVal == oldVal)){return;}
                    this.isInitialized = false;
                    await this.init();
                    this.isInitialized = true;
                     // this code was getting called before initialisation so added here to initilize pageNumber change after DOM initialisation.
                    this.registerPageChangeOnScroll()
                },
                deep: true,
                immediate:true
            },
            "fieldPredictionData": {
                handler: function (newVal, oldval) {
                    console.log("watcher:documentViewer:fieldPredictionData.prediction")
                    !this.undoOrRedoInProgress && newVal && this.checkpoint();
                },
                deep: true,
            },
            // When any selected field data changed then we're calling mapFieldValue function
             fieldData: {
                handler: function (newVal, oldval) {
                    console.log("watcher:documentViewver:fieldData")
                    newVal && this.mapFieldValue();
                },
                immediate: true,
                deep: true,
            },
        },
        computed: {
            /**
             * Purpose: To disable the canvas component when the user has the role of "ap_contributor."
             * This is necessary to prevent the user from altering field values by creating bounding boxes.
             * An additional condition has been added to handle this specific role.
             */
            isCanvasDisabled(){
                return this.isDocumentReadOnly ||  _.get(this.$store.getters.user, 'roles', []).includes(Constants.DOCEX.ROLES_MAP.AP_CONTRIBUTOR)
            },

            // isAutoLearningEnabled(){
            //     let documentData=this.$store.getters["documentViewStore/documentData"];
            //     return _.get(this.customerConfiguration, 'auto_learning.enable') &&
            //     !_.includes(
            //             [Constants.DOCEX.STAGE.FRAUD_FLAGGED,
            //             Constants.DOCEX.STAGE.FRAUD_CONFIRMED,
            //             Constants.DOCEX.STAGE.PUBLISHED,
            //             Constants.DOCEX.STAGE.WAITING_FOR_APPROVAL,
            //             Constants.DOCEX.STAGE.REJECTED],
            //             documentData.stage
            //         ) &&
            //         (Constants.DOCEX.STAGE.UPLOADED ||
            //          Constants.DOCEX.STAGE.EXTRACTED ||
            //          Constants.DOCEX.STAGE.CONFIRMED ||
            //          (Constants.DOCEX.STAGE.PUBLISHED && Constants.DOCEX.STATE.FAILED))
            // },

            isDocumentReadOnly() {
                 console.log("computed:documentViewver:isDocumentReadOnly")
                 let documentData=this.$store.getters["documentViewStore/documentData"];
                // this condition should always first(required), to check user role is reviveronly(read only) or not
                if (this.isReviewerOnly || this.isPublisherOnly){
                    return true;
                }
                if (_.get(documentData, 'resubmitted_after_rejection')) {
                return false;
                }
                return ((_.get(documentData, 'is_multi_documents_present')) ||
                       (this.stage == Constants.DOCEX.STAGE.PUBLISHED &&
                        this.state == Constants.DOCEX.STATE_PUBLISHED.SUCCESS) || [Constants.DOCEX.STAGE.DUPLICATE, Constants.DOCEX.STAGE.WAITING_FOR_APPROVAL, Constants.DOCEX.STAGE.FRAUD_CONFIRMED, Constants.DOCEX.STAGE.FRAUD_FLAGGED,Constants.DOCEX.STAGE.APPROVED].includes(this.stage)
                );
            },
            // tableData() {
            //      return this.$store.getters["documentViewStore/tableData"]
            //        },
            //   tableData() {
            //     console.log(" in tableData ");
            //     let fieldPredictionData = this.$store.getters["documentViewStore/fieldPredictionData"];
            //     let tableData = _.find(fieldPredictionData.prediction, {
            //         name: "table",
            //     });
            //     let isMultiTable = this.$store.getters["documentViewStore/isMultiTable"];
            //     if(isMultiTable){
            //         return _.get(tableData, "data");
            //     }
            //     return tableData

            // },
            isTableSelected() {
                console.log("computed:documentViewver:isTableSelected")
                let selectedField=this.$store.getters["documentViewStore/selectedField"]

                let isTableFieldSelected =
                    _.get(selectedField, "field_config.field_type") == "table" ?
                    true :
                    false;
                let selectedFieldName = _.get(selectedField, "name");

                if (selectedFieldName === this.previousSelectedFieldName) {
                    return isTableFieldSelected;
                }
                this.previousSelectedFieldName = selectedFieldName;

                if (isTableFieldSelected ) {
                    this.$store.commit("documentViewStore/maximizeLineItem");
                    this.showBottomPane = null;
                    return isTableFieldSelected;
                }
                //   isTableFieldSelected ? (this.paneSize = 100) : (this.paneSize = 40);
                //   try {
                //     // if table is selected show the split pane controller if not hide.
                //     let splitPaneDOMObject = $(".pane-left .splitpanes__splitter");
                //     if (splitPaneDOMObject && !_.get(splitPaneDOMObject[0], "style"))
                //       return;
                //     isTableFieldSelected
                //       ? (splitPaneDOMObject[0].style.display = "initial")
                //       : (splitPaneDOMObject[0].style.display = "none");
                //   } catch (ex) {
                //     console.log(ex);
                //   }
                return isTableFieldSelected;
            },
              ...mapState("documentViewStore",{
                showDocumentMessagesFlag : state => state.showDocumentMessagesFlag,
                documentMessagePaneSize : state => state.documentMessagePaneSize,
                canvasPaneSize : state => state.canvasPaneSize,
                lineItemPaneSize : state => state.lineItemPaneSize,
                canvasImageURLs: state => state.canvasImageURLs,
                shouldTrackChanges : state => state.shouldTrackChanges,
                // fieldPredictionData: state => state.fieldPredictionData,
                // tableData : state => state.tableData,
                fieldData : state => state.fieldData
                // documentData : state => state.documentData
                // selectedField : state => state.isBottomPaneVisible,
                // showBottomPane : state => state.showBottomPane,
            }),
            isPublishError(){
                  return this.$store.getters["documentViewStore/isPublishError"];
              },
            selectedField(){
                    return this.$store.getters["documentViewStore/selectedField"];
                },
            fieldData(){
                    return this.$store.getters["documentViewStore/fieldData"];
                }



            //    selectedField(){
            //       return this.$store.getters["documentViewStore/selectedField"];
            //   },





        },
        data() {
            return {
                // New data properties
                isInitialized:false,
                showVisualisationPage:false,

                // Old data properties
                items: [
                    {  label: 'Traning Mode' },
                ],
                showProperties:false,
                minWidth:1200,
                minHeight:300,
                paginationResponseLength: 1,
                currentIndex: 0,
                displayDetailsInfo: false,
                displayPOMapperInfo: false,
                displayInfoPopupData: {},
                displayPOMapperData:{},
                totalErrorCount:0,
                totalWarningCount:0,
                tableErrorFields:[],
                showTranslationConfirmationDialog: false,
                languageTranslationMessage: "",
                docLanguage: "",
                customerPrefferedLanguage: "",
                docSelectedLanguage: null,
                translatedWords: [],
                showTranslatedText: false,
                fieldsDefaultClass: '',
                pageNumber: 1,
                totalRowCount:0,
                paginationNo:1,
                rejectionNote: "",
                documentMessages: [],
                searchText: "",
                selected_field_search_text: "",
                field_search_text: "",
                showDebugDialog: false,
                state: "",
                isDebuggerOn: false,
                paneSize: 100,
                docxConfig: {},
                busEvents: [],
                lineItemFlag: false,
                showForm: false,
                loading: false,
                linesLoading: false,
                // documentData: {},
                documentName: "",
                customerConfiguration: {},
                search_text: "",
                // fieldData: "",
                originalFieldData: [],
                resetDefaultData: null,
                visible_searchbar: false,
                prediction: null,
                showDialog: false,
                labelTypes: ["string", "date"],
                form: {},
                history: "",
                componentMapping: {
                    string: "Input",
                    date: "DatePicker",
                },
                // selectedField: '',
                defaultValues: {
                    errorMsg: "",
                },
                publishDialogVisible: false,
                isReviewer: false,
                isPublisher: false,
                isReviewerOnly:false, //this flage is use for reviver_only role
                isPublisherOnly: false,
                approvalStatus: "",
                pagination: {
                    prev_doc_id: "",
                    next_doc_id: "",
                },
                documentId: "",
                filter: "",
                documentType: "",
                stage: "",
                displayFields: [],
                isDownloadReadOnly: false,
                approvalDialogVisible: false,
                approverEmailList: "",
                approvalForm: {
                    emails: "",
                },
                approvalFormRules: {
                    emails: [{
                        trigger: "change",
                        validator: Validator.emailValidator,
                    }, ],
                },

                previousSelectedFieldName: "",
                // documentRecord: null,

                showError:true,
                // shouldTrackChanges:null,

                tableDebugDataModified:false,
                  parentDocumentId:null,
                packageFieldPredictionData:{},
                lineItemsRefreshKey : 0
            };
        },

        methods: {
            showVisualisationToggle(){
                if(this.customerConfiguration.show_visualisation_toggle){
                    return true;
                }
                return false;
            },
            disableNextButton(){
                /*
                Disable next button in folliwing scenarios:
                1: if pagination has 1 page & the document is last document
                2: if pagination has multiple pages then on last page if last document is open then disable the button
                */
                let shouldDisableNextButton = false
                if(this.paginationResponseLength == 0 || (this.paginationNo == 1 && this.totalRowCount == this.currentIndex+1)){
                    shouldDisableNextButton= true
                }
                else if (this.paginationNo > 1 && this.totalRowCount-(this.pageSize*(this.paginationNo-1)) == this.currentIndex+1){
                    shouldDisableNextButton = true
                }
                return shouldDisableNextButton
            },
            toggleDebugger(){
                this.$store.commit("documentViewStore/isDebuggerOn",this.isDebuggerOn);
                return this.isDebuggerOn
            },
            toggleVisualisation(){
                this.showVisualisationPage = true
                return true
            },
             async getActionButtons(){
                    const response = await ActionButtonConfig.getActions(
                        {
                            active: true,
                            view_name: "Properties",
                            document_type: this.documentType,
                            // roles: { $in: roles },
                            document_id: this.documentId,
                        },
                        [
                            "view_name",
                            "document_type",
                            "advanced_script",
                            "roles",
                            "name",
                            "is_platform",
                        ]
                        );
                        return response.status ? response.action_list : [];
            },
            /**
             * ** Purpose: Get Count of error and warning message count and table error fields
             *  ** Step 1. Initialize the counters and get documentdata from store
             *  ** Step 2. Iterate over prediction data
             *  ** Step 3. Get the message info based on the field type
             *  ** step 4. Return the message info
             */
            errorCount() {
                this.totalErrorCount = 0;
                this.totalWarningCount = 0;
                this.tableErrorFields = [];
                for(const field of this.fieldPredictionData.prediction) {
                    // header incremented message count
                    if (field.name != "table") {
                        this.incrementMessagesCount(field);
                    }else {
                        this.setTableMessagesCount(field)
                    }
                }
                return {
                    totalErrorCount: this.totalErrorCount,
                    totalWarningCount: this.totalWarningCount,
                    tableErrorFields: this.tableErrorFields
                };
            },

            /**
             * ** Purpose: this method is used to set error/warning msgs at table level
             * ** First we are checking whether it is a multitable or single table.
             * ** then incrementing message count accordingly.
            */
            setTableMessagesCount(field){
                const documentData = this.$store.getters["documentViewStore/documentData"];
                if(documentData.is_multi_table){
                    // In case of multi table we get the table data under field.data
                    this.incrementTableMessagesCount(field.data);
                }else{
                    // In case of single table we get the table data under field.content.rows so converting it array to reuse the function
                    this.incrementTableMessagesCount([field]);
                }
            },

            incrementTableMessagesCount(tables){
                for( const table of tables) {
                    if(table.content){
                        for( const row in table.content.rows) {
                            for( const tableField of row) {
                                this.incrementMessagesCount(tableField, true);
                            }
                        }
                    }
                }
            },

            incrementMessagesCount(field, isTable = false){
                if (!_.get(field, "field_config.selected")) return;
                let validationMsgs = _.get(field, "validationMsgs") || [];
                const errorMsgs = _.filter(validationMsgs, {message_type:"ERROR"});
                const warningMsgs = _.filter(validationMsgs, {message_type:"WARNING"});
                if(isTable){
                    errorMsgs.length && this.tableErrorFields.push(field);
                }
                this.totalErrorCount = this.totalErrorCount + errorMsgs.length;
                this.totalWarningCount = this.totalWarningCount + warningMsgs.length;
            },

            showImageLoadingError(){
                   this.showError && this.notifyError(Constants.DOCEX.IMAGE_NOT_FOUND);
                   this.showError = false;
            },
            setTableParams(){
                let documentData=this.$store.getters["documentViewStore/documentData"];
                if(documentData.is_multi_table){
                    return this.setTableParamsForMultiTable()
                }
                return this.setTableParamsForSingleTable()
            },

            /**
             * Purpose: Get only current table selected fields and additional prediction fields apart from selected field
             * Step 1. Get Table type configuration from document configuration
             * Step 2. Get selected fields for current table from table type config
             * Step 3. Filter allFields and get only selected fields from it
             * Step 4. Return filtered fields
             * 
             */
            getTableFields(tableName, allfields) {
                const tableTypesConfig = _.get(this.customerConfiguration, "table_types_config");
                let filter = {key: tableName}
                //filter tables config based on document subtype
                if(this.documentSubtype){
                    filter["document_subtype"] = this.documentSubtype
                }
                const tableConfig = _.find(tableTypesConfig, filter);
                const tableSelectedFields = _.get(tableConfig, "selected_fields", []);
                const filteredFields = allfields.filter(field => tableSelectedFields.includes(field._id))
                const selectedTableFields = filteredFields.map(field=>({...field, selected: true}));
                return selectedTableFields;
            },
            /**
             * Purpose: Create table to table field map. Required in multiple places
             * Step 1. Initaliaze tableFieldMap object which stores the table mapping
             * Step 2. Iterate over each table data
             * Step 3. Get table name using table index
             * Step 4. Get the table selected fields using tablename.
             * Step 5. Store selectedTableFields in map object against the table name
             */
            createTableFieldMap(multiTableData, allFields){
                const tableFieldMap = {}
                for(let index = 0; index < multiTableData.length; index++){
                    const [tableName] = this.getTableInfo(index);
                    const tableFields = this.getTableFields(tableName, allFields);
                    tableFieldMap[tableName] = tableFields;
                }
                return tableFieldMap;
            },

            /**
             * Purpose: Returns table header dropdown options array
             * Step 1. Iterate over current tableFields and create new array which contains new option object
             * Step 2. Return newly created sorted array with dropdown options (sorted by label name)
             */
            getHeaderDropdownOptions(tableFields){
                let headerDropdownOptions = tableFields.map(field => ({
                        label: field.label,
                        width: field.width,
                        value: field.name,
                }));
                // Sorting the result in ascending order based on field label
                headerDropdownOptions = _.orderBy(headerDropdownOptions, [option => option.label.toLowerCase()], ['asc']);
                return headerDropdownOptions;
            },
            /**
             * Purpose: Removes duplicate columns from columns array and return the unique columns
             */
            removeDuplicateColumns(columns=[]){
                const uniqueColumns = [];
                const addedColumns = [];
                for(const column of columns){
                    if (column && !addedColumns.includes(column["field"])) {
                        uniqueColumns.push(column);
                        addedColumns.push(column["field"]);
                    }
                }
                return uniqueColumns;
            },

            setTableParamsForMultiTable() {
              try{
                let {
                    tableRows: multiTableData,
                    tableFields: allTableFields,
                    tableHeaders
                } = this.rawData();
                let multiTableParams=[]
                // Prepare Column order
                let customer_config = this.customerConfiguration;
                const tableFieldMap = this.createTableFieldMap(multiTableData, allTableFields);

                const getHeaderLabel = (name,tableHeader) => {
                    const header = _.find((tableHeader || []), (h) => (h && (h.name == name)));
                    return header ? header.value : "";
                }

                const getCellClass = (name, isVisible,tableHeader) => {
                    const header = _.find((tableHeader || []), (h) => (h && (h.name == name)));
                    const field = _.find((this.originalFieldData || []), (f) => {
                        const self = this;
                        return (f && (f.field_type == "table") && (f._id) && f.selected && _.includes(self.displayFields, f.name) && (f.name == name));
                    })
                    return (header && field) ? "selected-cell" : "unselected-cell";
                }

                // prepare datatable params for multiple table
                for(let tableIndex = 0; tableIndex < multiTableData.length; tableIndex++){
                    let tableData = multiTableData[tableIndex];
                    const [tableName,tableLabel] = this.getTableInfo(tableIndex)
                    // Get current table selected fields from allTableFields
                    const tableFields = tableFieldMap[tableName];

                    // Unpredicted selected fields were marked as unselected cells and grayed out on the UI if they were not present in the headers. 
                    // Therefore, we are adding these selected fields to the headers if not present.
                    tableHeaders[tableIndex]=this.addTableHeaderIfNotExists(tableFields,tableHeaders[tableIndex])

                    const headerDropdownOptions = this.getHeaderDropdownOptions(tableFields);
                    let headerFromDoc = this.getSortedLineItemColumn(tableHeaders[tableIndex]);

                    let columnsFromDocUnsorted = {};
                    let columnsFromDocSorted = [];
                    const hiddenColumn = _.map(_.filter(tableHeaders[tableIndex],item=>item.display == false),'name');
                    let columns = [];
                    _.each(tableFields, (item) => {
                        let componentName =
                            item.type == "dropdown" ? "DocExDropdown" : "DocExInput";
                        const cssClass = getCellClass(item.name, item.selected,tableHeaders[tableIndex]);
                        if(hiddenColumn.includes(item.name))return;
                        // Add unselected and not predicted fields at the last
                        if(customer_config.sortTableColumn == false && headerFromDoc.includes(item.name) && cssClass == 'unselected-cell'){
                            var popUnselectedField = headerFromDoc.splice(headerFromDoc.indexOf(item.name),1)
                            headerFromDoc.push(popUnselectedField[0])
                        }
                        if (item.selected) {
                            let columnConfig = {
                                label: getHeaderLabel(item.name,tableHeaders[tableIndex]) || "",
                                field: item.name,
                                headerClass: cssClass,
                                cellClass: cssClass,
                                type: "doc_ex",
                                width: item.width ?  item.width+'px' : "100px",
                                // width: "100px",
                                html: false,
                                isReadOnly: item.is_read_only || false,
                                headerComponent: "HeaderSelect",
                                thClass: "vgt-left-align",
                                tdClass: "text-left",
                                componentName: componentName,
                                order: item.order
                            }

                            if (headerFromDoc.includes(item.name)) {
                                columnsFromDocUnsorted[item.name] = columnConfig;
                            } else {
                                columns.push(columnConfig);
                            }

                        }
                    });
                    headerFromDoc.map((headerName) => {
                        columnsFromDocSorted.push(columnsFromDocUnsorted[headerName]);
                    });
                    // Update the header column label
                    const {tableErrorFields, totalErrorCount, totalWarningCount } = this.errorCount();
                    _.each(columns, (column) => {
                        let columnErrorCount = 0;
                        _.find(tableErrorFields, (field) => {
                            if (
                                field.name == column.field &&
                                field.validationMsgs &&
                                field.validationMsgs.length
                            )
                                columnErrorCount++;
                        });
                        columnErrorCount
                            ?
                            (column.label =
                                column.label + '   <i class="el-icon-warning error-info"></i>') :
                            "";
                    });
                    //here "columnAction" params push if user role is not reviver only
                    let columnAction = {};
                    if(!this.isReviewerOnly){
                        columnAction = {label: "Actions", field: "actions", sortable: false, tdClass: "action-col", thClass: "action-col", width: "7%"}
                    }
                    columns.push(columnAction);

                    columns = (columnsFromDocSorted.concat(columns)).filter(c => c);
                    columns = this.removeDuplicateColumns(columns);
                    // Prepare Row
                    var rows = [];

                    _.each(tableData, (rowData, index) => {
                        if(_.isEmpty(rowData)){
                            return ;
                        }
                        let prepareRow = {};
                        prepareRow["id"] = index;
                        _.each(columns, (col_values) => {
                            let matchedCellData = _.find(rowData, (value) => {
                                col_values.config = value && value.config && value.config[0];
                                return col_values.field == value.name;
                            });
                            prepareRow[col_values.field] = matchedCellData;
                        });
                        rows.push(prepareRow);
                    });
                    // return tableSampleData

                    const tableParams = {
                        tableMaxHeight: "140px",
                        isStaticTable: true,
                        showPaginationOptions: false,
                        showTableToolbar: false,
                        showSortOptions: false,
                        fixedHeader: false,
                        customfilter:false,
                        globalSearch:false,
                        header_dropdown_options: headerDropdownOptions,
                        actionItems: [{
                                icon: "el-icon-delete",
                                name: "Delete",
                                event_name: `${tableName}_delete_line_item`,
                                table_event:"delete-idp-row",
                                inline: true,
                            },
                            {
                                icon: "el-icon-document-copy",
                                name: "Clone row",
                                event_name: `${tableName}_clone_row`,
                                table_event : "clone-idp-row"
                            },
                            {
                                icon: "el-icon-plus",
                                name: "Add above",
                                event_name: `${tableName}_add_row_above`,
                                table_event : "add-idp-row-above"
                            },
                            {
                                icon: "el-icon-plus",
                                name: "Add below",
                                event_name: `${tableName}_add_row_below`,
                                table_event : "add-idp-row-below"
                            },
                        ],
                        theme: "mytheme",
                        rows,
                        columns,
                        tableName:tableName,
                        table_label : tableLabel,
                        table_index:tableIndex,
                        error_count: tableErrorFields.length,
                    };
                    const enablePaginationOn = _.get(this.customerConfiguration,"form_view_config.enable_pagination_on", 50);
                    if(rows.length > enablePaginationOn ) {
                        const pageSize = _.get(this.customerConfiguration,"form_view_config.page_size", 50);
                        tableParams["showPaginationOptions"] = true,
                        tableParams["limit"] = pageSize;
                    }
                    multiTableParams.push(tableParams)
                }
                this.$store.commit("documentViewStore/tableParams", multiTableParams);
                }
                catch(e){
                    console.log("error iss::::::",e)
                }
            },

            addTableHeaderIfNotExists(tableFields,tableHeaders){
                tableFields.forEach((tableField) => {
                    // Find the index of a matching header in the tableHeaders array for the current tableField.
                    const matchingHeaderIndex = tableHeaders.findIndex((tableHeader) => tableHeader.name === tableField.name);

                    // If no matching header is found, add a new header to the tableHeaders array.
                    if(matchingHeaderIndex === -1){
                        tableHeaders.push({ name: tableField.name, value: tableField.label });
                    }
                });
                return tableHeaders
            },

            getTableInfo(index) {
                let documentData = this.$store.getters["documentViewStore/documentData"];
                let tablePrediction = _.find(documentData.prediction, { name: "table" }) || { data: [] };
                // Get table type configuration
                const tableTypeConfig = _.get(this.customerConfiguration, 'table_types_config', []);
                
                // Check if tablePrediction.data[index] is valid
                if (!tablePrediction.data[index]) {
                    return ["", ""];
                }
                const tableName = tablePrediction.data[index].table_name || "";
                let tableLabel = tablePrediction.data[index].table_label || "";
                // Set the line item table title from the table type config
                _.forEach(tableTypeConfig, (config) => {
                    if (config.key === tableName) {
                        tableLabel = config.label;
                    }
                });
                return [tableName, tableLabel];
            },

            setTableParamsForSingleTable() {
                let {
                    tableRows,
                    tableFields,
                    tableHeaders
                } = this.rawData();
                // Prepare Column order
                let tableParams;
                let headerFromDoc = this.getSortedLineItemColumn(tableHeaders);

                let customer_config = this.customerConfiguration;

                let columnsFromDocUnsorted = {};
                let columnsFromDocSorted = [];
                let headerDropdownOptions = this.getHeaderDropdownOptions(tableFields)

                const getHeaderLabel = (name) => {
                    const header = _.find((tableHeaders || []), (h) => (h && (h.name == name)));
                    return header ? header.value : "";
                }

                const getCellClass = (name, isVisible) => {
                    const header = _.find((tableHeaders || []), (h) => (h && (h.name == name)));
                    const field = _.find((this.originalFieldData || []), (f) => {
                        const self = this;
                        return (f && (f.field_type == "table") && (f._id) && f.selected && _.includes(self.displayFields, f.name) && (f.name == name));
                    })
                    return (header && field) ? "selected-cell" : "unselected-cell";
                }

                // Unpredicted selected fields were marked as unselected cells and grayed out on the UI if they were not present in the headers. 
                // Therefore, we are adding these selected fields to the headers if not present.
                tableHeaders=this.addTableHeaderIfNotExists(tableFields,tableHeaders)

                const hiddenColumn = _.map(_.filter(tableHeaders,item=>item.display == false),'name');
                let columns = [];
                _.each(tableFields, (item) => {
                    let componentName =
                        item.type == "dropdown" ? "DocExDropdown" : "DocExInput";
                    const cssClass = getCellClass(item.name, item.selected);
                     if(hiddenColumn.includes(item.name))return;
                    // Add unselected and not predicted fields at the last
                    if(customer_config.sortTableColumn == false && headerFromDoc.includes(item.name) && cssClass == 'unselected-cell'){
                        var popUnselectedField = headerFromDoc.splice(headerFromDoc.indexOf(item.name),1)
                        headerFromDoc.push(popUnselectedField[0])
                    }

                    if (item.selected) {
                        let columnConfig = {
                            label: getHeaderLabel(item.name) || "",
                            field: item.name,
                            headerClass: cssClass,
                            cellClass: cssClass,
                            type: "doc_ex",
                            width: item.width ?  item.width+'px' : "100px",
                            // width:"100px",
                            html: false,
                            isReadOnly: item.is_read_only || false,
                            headerComponent: "HeaderSelect",
                            thClass: "vgt-left-align",
                            tdClass: "text-left",
                            componentName: componentName,
                            order: item.order
                        }

                        if (headerFromDoc.includes(item.name)) {
                            columnsFromDocUnsorted[item.name] = columnConfig;
                        } else {
                            columns.push(columnConfig);
                        }

                    }
                });

                headerFromDoc.map((headerName) => {
                    columnsFromDocSorted.push(columnsFromDocUnsorted[headerName]);
                });

                const {tableErrorFields, totalErrorCount, totalWarningCount } = this.errorCount();

                // Update the header column label
                _.each(columns, (column) => {
                    let columnErrorCount = 0;
                    _.find(tableErrorFields, (field) => {
                        if (
                            field.name == column.field &&
                            field.validationMsgs &&
                            field.validationMsgs.length
                        )
                            columnErrorCount++;
                    });
                    columnErrorCount
                        ?
                        (column.label =
                            column.label + '   <i class="el-icon-warning error-info"></i>') :
                        "";
                });
                if(!this.isReviewerOnly){
                    let columnAction = {label: "Actions", field: "actions", sortable: false, tdClass: "action-col", thClass: "action-col", width: "7%"}
                    columns.push(columnAction);
                }

                columns = (columnsFromDocSorted.concat(columns)).filter(c => c);
                columns = this.removeDuplicateColumns(columns);

                // Prepare Row
                var rows = [];
                _.each(tableRows, (rowData, index) => {
                    if(_.isEmpty(rowData)){
                        return ;
                    }
                    let prepareRow = {};
                    prepareRow["id"] = index;
                    _.each(columns, (col_values) => {
                        let matchedCellData = _.find(rowData, (value) => {
                            col_values.config = value && value.config && value.config[0];
                            return _.get(col_values, "field", "").toLowerCase() == _.get(value, "name", "").toLowerCase();
                        });
                        prepareRow[col_values.field] = matchedCellData;
                    });
                    rows.push(prepareRow);
                });

                // tableSampleData.error_count = 3

                // return tableSampleData
                tableParams =  {
                    tableName:"singleLineItem",
                    tableMode: "static",
                    tableMaxHeight: "140px",
                    isStaticTable: true,
                    showPaginationOptions: false,
                    showTableToolbar: false,
                    showSortOptions: false,
                    fixedHeader: false,
                    customfilter:false,
                    globalSearch:false,
                    header_dropdown_options: headerDropdownOptions,
                    actionItems: [{
                            icon: "el-icon-delete",
                            name: "Delete row",
                            event_name: "singleLineItem__delete_line_item",
                            table_event:"delete-idp-row",
                            inline: true,
                        },
                        {
                            icon: "el-icon-document-copy",
                            name: "Clone row",
                            event_name: "singleLineItem__clone_row",
                            table_event:"clone-idp-row",
                        },
                        {
                            icon: "el-icon-plus",
                            name: "Add above",
                            event_name: "singleLineItem__add_row_above",
                            table_event:"add-idp-row-above",
                        },
                        {
                            icon: "el-icon-plus",
                            name: "Add below",
                            event_name: "singleLineItem__add_row_below",
                            table_event:"add-idp-row-below",
                        },
                    ],
                    theme: "mytheme",
                    rows,
                    columns,
                    error_count: tableErrorFields.length,
                };
                const enablePaginationOn = _.get(this.customerConfiguration,"form_view_config.enable_pagination_on", 50);
                if(rows.length > enablePaginationOn ){
                    const pageSize = _.get(this.customerConfiguration,"form_view_config.page_size", 50);
                    tableParams["showPaginationOptions"] = true,
                    tableParams["limit"] = pageSize;
                }
                this.$store.commit("documentViewStore/tableParams",tableParams);

            },

               scrollToTheField(selectedField) {
                    let tableParams = this.$store.getters["documentViewStore/tableParams"];

                    const fieldName = (_.get(selectedField,'field_config.type') == 'checkbox') ? _.get(selectedField,'name') : _.get(selectedField,'field_config.name')
                   if(!fieldName) return;
                   if(_.get(selectedField, 'field_config.field_type') == 'header')
                    {
                         this.$nextTick(() => {
                                scrollTo(`div[id="${fieldName}"]`, 800, kpLeftScrollOptions);
                         });
                         return;
                    }
                    const tableIndex = _.get(selectedField, 'field_config.tableIndex');
                    // In case of multi table we need to active the selected table tab and then scroll
                    let activeTabName="" // table_name and tab names are same
                    const isMultiTable = this.$store.getters["documentViewStore/isMultiTable"];
                    if(isMultiTable && _.isNumber(tableIndex)){
                        activeTabName = tableParams[tableIndex].tableName;
                        EventBus.$emit("setLineItemActiveTab", activeTabName);
                    }else{
                        activeTabName = tableParams.tableName;
                    }

                    let tdIndex=0
                    if (tableIndex>=0){
                        tdIndex = _.findIndex(tableParams[tableIndex].columns,
                                        function (column) {
                                            return column.field == selectedField.name;
                                        }
                                    );
                    }
                    else{
                        tdIndex = _.findIndex(tableParams.columns,
                                        function (column) {
                                            return column.field == selectedField.name;
                                        }
                                    );
                    }
                    const trIndex = _.get(selectedField, 'field_config.index');
                    const enablePaginationOn = _.get(this.customerConfiguration,"form_view_config.enable_pagination_on", 50);

                    if(tableParams[tableIndex] > enablePaginationOn) {
                        const tablePageNo = this.calculateCurrentPage(trIndex);
                        const pageChangeEvent = `pageChange__${tableParams.tableName}`;
                        EventBus.$emit(pageChangeEvent, tablePageNo);
                    }
                    // Adding a delay to account for scenarios where the element might not be immediately available, such as in pagination.
                    setTimeout(()=>{
                        // scroll element for single table
                        let scrollToElement = `.line-table tr:nth-child(${trIndex + 1})>td:nth-child(${tdIndex + 1})`;

                        // scroll element for multi table
                        if(activeTabName) {
                            scrollToElement = `.${activeTabName}.line-table tr:nth-child(${trIndex + 1})>td:nth-child(${tdIndex + 1})`
                        }
                        scrollTo(scrollToElement, 800,tableScrollToOptions);
                        setTableInputClass(selectedField, activeTabName)
                    }, 1500);
               },


               // If pagination enabled then calculate the page number using page size
               calculateCurrentPage(recordIndex){
                    if (recordIndex < 0 ) {
                        return 1; // Invalid record index then return first page
                    }
                    // Calculate the current page number (page indexing starts from 1)
                    const pageSize = _.get(this.customerConfiguration,"form_view_config.page_size", 50);
                    const currentPage = Math.floor(recordIndex / pageSize) + 1;
                    return currentPage;
               },

               async openPrevDocument() {
                    this.loading = true;
                    //if current document is at 1st position
                    if (this.currentIndex == 0 && this.paginationNo == 1 ) {
                        this.loading = false;
                        this.notifyError(Constants.DOCEX.DOCUMENT_NOT_FOUND);
                        return;
                    }
                    const filter = getQueryFilter();
                    let skipDocuments = this.calculateSkipDocuments(filter,true)// to skip current record & take previous record
                    let paginationResponse = await this.getPaginationResponse(skipDocuments);
                    // if the document in response if parent document look for later one.
                    if(!_.isEmpty(paginationResponse) && paginationResponse[0] && paginationResponse[0].is_multi_documents_present == true){
                        skipDocuments -= 1;
                        paginationResponse = await this.getPaginationResponse(skipDocuments);
                    }
                    //If No prev document present, redirect to list view
                    if (!paginationResponse.length) {
                      this.redirectToListView(filter);
                    }
                    this.currentIndex = this.currentIndex == 0 ? this.currentIndex  : this.currentIndex - 1
                    this.loading = false;
                    this.prepareFilterForPagination(filter, skipDocuments, true)
                    const documentPath= ( paginationResponse[0]["file_type"] == Constants.DOCEX.DOCUMENT_FILETYPES["EXCEL"]) ? "/idp/excel-view":"/idp/document-view";
                    this.$router.push({
                        path: documentPath,
                        query: {
                        id: paginationResponse[0]["_id"],
                        document_index: this.currentIndex == 0 && this.paginationNo != 1 ? this.pageSize : this.currentIndex,
                        total_row_count: this.totalRowCount,
                        filter: JSON.stringify(filter || {}),
                        ...(this.$route.query.view == 'package' && {
                            view:'package'
                            })
                        },
                    });
                    },
                    calculateSkipDocuments(filter,is_prev){
                        /*here  this.paginationNo = current list view page
                                this.pageSize = current page size default is 15
                                this.currentIndex = current document index which is open (it starts from 0)
                        Logic for Previous document:
                                suppose we have opened first page fifth document so
                                this.currentIndex = 4 (as index starts from 0)
                                this.pageSize = 15
                                this.paginationNo = 1
                            then using this formula  (this.pageSize*( this.currentIndex-1)) + this.paginationNo - 1
                                (15*(1-1)+4-1)=>(15*(0)+3)=>(0+3)=> 3
                                so skip will be 3 & it ill pick 3rd document
                        Logic for Next document:
                                suppose we have opened first page fifth document so
                                this.currentIndex = 4 (as index starts from 0)
                                this.pageSize = 15
                                this.paginationNo = 1
                            then using this formula  (this.pageSize*( this.paginationNo-1)) + this.currentIndex + 1
                                (15*(1-1)+4+1)=>(15*(0)+5)=>(0+5)=> 5
                                so skip will be 5 & it will pick 5th document
                        */
                            const tableIdentifier = filter && filter[`idp_${this.documentType}_list`];
                            this.paginationNo = _.get(tableIdentifier, "selectedPage",1)
                            this.pageSize = _.get(tableIdentifier, "pageSize",15);
                            return is_prev ? (this.pageSize*( this.paginationNo-1)) + this.currentIndex - 1 :   (this.pageSize*( this.paginationNo-1)) + this.currentIndex + 1;
                    },

                async openNextDocument(isDocDeleted) {
                    this.loading = true;
                    //if current document is deleted, subtract the currentIndex by 1
                    //since deleted document will be removed from paginationResponse
                    this.currentIndex = isDocDeleted ? this.currentIndex - 1 : this.currentIndex;
                    let filter = getQueryFilter();
                    let skipDocuments = this.calculateSkipDocuments(filter, false)// to skip current record & take Next record
                    let paginationResponse = await this.getPaginationResponse(skipDocuments);
                    // if the document obtained is parent then look for next document
                    if(!_.isEmpty(paginationResponse) && paginationResponse[0] && paginationResponse[0].is_multi_documents_present == true){
                        skipDocuments += 1;
                        paginationResponse = await this.getPaginationResponse(skipDocuments);
                    }
                    //No next document present, redirect to list view if no next document present
                    if (!paginationResponse.length) {
                        this.redirectToListView(filter);
                    }

                    this.prepareFilterForPagination(filter, skipDocuments)
                    this.loading = false;
                    this.currentIndex = this.currentIndex + 1;
                    const documentPath= ( paginationResponse[0]["file_type"] == Constants.DOCEX.DOCUMENT_FILETYPES["EXCEL"]) ? "/idp/excel-view":"/idp/document-view";
                    this.$router.push({
                        path: documentPath,
                        query: {
                        id: paginationResponse[0]["_id"],
                        document_index: skipDocuments == this.pageSize ? 0 : this.currentIndex,
                        total_row_count: this.totalRowCount,
                        filter: JSON.stringify(filter || {}),
                         ...(this.$route.query.view == 'package' && {
                             view:'package'
                    })
                        },
                    });
                },

            prepareFilterForPagination(filter,skipDocuments,isPrev = false){
                    /*
                        In first page filter is empty for this we are adding filter in route from here to handle pagination
                        In case of open previous document
                            if skipDocument == this.pagesize
                                that means we have to open next page || open prev page if isPrev is true
                            else
                                open document from same page
                    */
                    let currentPage;
                    if(_.isEmpty(filter)){
                        if(skipDocuments == this.pageSize){
                            currentPage = isPrev ? this.paginationNo - 1 : this.paginationNo + 1
                        }else{
                            currentPage = this.paginationNo
                        }
                        filter[[`idp_${this.documentType}_list`]]={
                                    "selectedPage":currentPage,
                                    "pageSize": this.pageSize
                                    }

                    }else{
                        /*
                            If we open document from other than first page then we are modifying the filter param as per condition
                            In case of open previous document
                                if skipDocument == this.pagesize
                                     that means we have to open next page || open prev page if isPrev is true
                                else
                                    open document from same page
                        */
                        if(skipDocuments == this.pageSize){
                            currentPage = isPrev ? this.paginationNo - 1 : this.paginationNo + 1
                        }else{
                            currentPage = this.paginationNo
                        }
                        if(filter[`idp_${this.documentType}_list`]){
                        filter[`idp_${this.documentType}_list`]['selectedPage'] = currentPage
                        filter[`idp_${this.documentType}_list`]['pageSize'] = this.pageSize
                        }else{
                             filter[[`idp_${this.documentType}_list`]]={
                                    "selectedPage":currentPage,
                                    "pageSize": this.pageSize
                                    }
                        }
                    }
            },

             redirectToListView(filter){
                    let documentData=this.$store.getters["documentViewStore/documentData"];
                    const documentPath = `/idp/document/${documentData.document_type}`;
                        this.loading = false;
                        this.notifyInfo(Constants.DOCEX.DOCUMENT_NOT_FOUND);
                        this.$router.push({
                            path: documentPath,
                            query: {
                                filter: JSON.stringify(filter || {}),
                                ...(this.$route.query.view == 'package' && {
                                    view:'package'
                                })
                            }
                        })
                        return;
             },
             getCurrentTab(){
                const filter = getQueryFilter();
           //  getting current   tab  name from  list view  based on  document state or stage 
                return filter.stage ||  filter.state ||"Uploaded"
             },

             async getPaginationResponse(skip) {
                const currentTab = this.getCurrentTab()
                let documentData=this.$store.getters["documentViewStore/documentData"];
                let parentFolder = _.has(documentData, "storage_folder_path") ?
                    documentData.storage_folder_path.split(
                        documentData.document_type + "/"
                    )[1] :
                    "";

                let queryParam = {
                    stage: documentData.stage,
                    active: true,
                    document_type: documentData.document_type,
                    "$or": [{file_type: {$ne: Constants.DOCEX.DOCUMENT_FILETYPES.EXCEL}},{"$and":[{file_type: Constants.DOCEX.DOCUMENT_FILETYPES.EXCEL  },{parent_document_id :{$exists : false}}]}],
                    ...(this.$route.query.view == 'package' && {
                             type:'package',
                             parent_document_id:{"$exists":false}
                    }),
                    current_tab: currentTab
                };

                let urlFilter = DocumentService.getURLFilter();
                // If there is searchText in fileter, apply at document level as well.
                if (_.get(urlFilter, "searchText")) {
                    let idpListcolumnFilter = this.$store.getters["documentViewStore/getIdpListcolumnFilter"]||{};
                    //console.log("*****idpListcolumnFilter***********", JSON.stringify(idpListcolumnFilter))
                    queryParam={...queryParam,...idpListcolumnFilter};
                    //console.log("*****queryParam***********", JSON.stringify(queryParam))
                }
                if (_.get(urlFilter, "folderPath")) {
                    queryParam.storage_folder_path = {
                        $regex: `.*${_.get(urlFilter, "folderPath")}$`,
                        $options: "i",
                    };
                } else {
                    queryParam.storage_folder_path = {
                        $regex: ".*/*$",
                        $options: "i"
                    };
                }

                if (_.get(urlFilter, "approval_status"))
                queryParam.approval_status = _.get(urlFilter, "approval_status") ;
                const tableIdentifier = urlFilter[`idp_${this.documentType}_list`];
                let paginationResponse = await DocumentService.find(
                    queryParam,
                    _.get(tableIdentifier, "sortColumn","-created_at"),
                    ["_id","file_type", "is_multi_documents_present"], skip ,1
                ).catch((err) => {
                    console.log(err);
                });
                this.paginationResponseLength = paginationResponse.length;
                return paginationResponse;
            },

            updateTableParams(params, value) {
                    let tableParams = this.$store.getters["documentViewStore/tableParams"];
                    // let tableParamsClone = _.cloneDeep(this.tableParams);
                    const tableIndex  = _.get(params, 'field_config.tableIndex',null);
                    const rowIndex  = _.get(params, 'field_config.index');
                    if(tableIndex != null){
                    tableParams[tableIndex].rows[rowIndex][params.name].value = value
                    }
                    else{
                    tableParams.rows[rowIndex][params.name].value = value

                    }
                    this.$store.commit("documentViewStore/tableParams",tableParams);
            },
            // openDetailsDialog(field) {
            //     this.displayInfoPopupData = {
            //         field_config: field
            //     };
            //     this.displayInfoPopupData.document_type = this.documentData.document_type;
            //     this.displayInfoPopupData.document_id = this.documentId;
            //     this.displayInfoPopupData.script_type =  Constants.DOCEX.SCRIPT_TYPE.REFERENCE;

            //     this.displayInfoPopupData.field_value = field.value;
            //     this.displayInfoPopupData.field_name = field.name;
            //     this.displayInfoPopupData.form = this.getDocumentForm();

            //     this.displayDetailsInfo = true;
            // },
            openPOMapperDialog(field) {
                let documentData=this.$store.getters["documentViewStore/documentData"];
                this.displayPOMapperData = {
                    field_config: field,
                    document_type : documentData.document_type,
                    document_id : this.documentId,
                    script_type :  Constants.DOCEX.SCRIPT_TYPE.REFERENCE,
                    field_value : field.value,
                    field_name : field.name,
                    table_name: field.table_name,
                    is_table: field.is_table,
                    form : this.$store.getters["documentViewStore/getDocumentForm"]
                };
                let canvas_container = document.getElementById('canvas_container')
                this.minWidth = canvas_container.offsetWidth + 150;
                this.minHeight = canvas_container.offsetHeight
                this.displayPOMapperInfo = true;
            },
            getSortedLineItemColumn(tableHeaders) {

                let customer_config = this.customerConfiguration;
                // let {
                //     tableHeaders
                // } = this.rawData();
                // let fieldData=this.$store.getters["documentViewStore/fieldData"];

                function isValidOrder(order){
                    if(order == undefined || order == null)return false;
                    return true;
                }

                let headerFromDoc = [];
                // sortTableColumn false : It will sort by fields order
                // sortTableColumn true : It will sort by invoice order
                if (customer_config && !customer_config.sortTableColumn) {

                    // headerFromDoc = _.map(tableHeaders, (column) => {
                    //     return (column.name + '').replace(' ', '_');
                    // }).filter(c=>c);
                    let allTableFields = [];
                    tableHeaders.map(item => {
                        let field = _.find(this.fieldData, {
                            name: item.name,
                            field_type: 'table'
                        });
                        if (field) allTableFields.push({
                            ...item,
                            ...{
                                order: isValidOrder(field.order) ? field.order : 9999
                            }
                        })
                    });
                    allTableFields.sort((a, b) => a.order - b.order)
                    allTableFields.forEach(item => {
                        headerFromDoc.push(item.name)
                    });
                    return headerFromDoc;
                }

                headerFromDoc = _.map(tableHeaders, (column) => {
                    if (column.from_document) {
                        return (column.name + '').replace(' ', '_');
                    }
                    return null;
                }).filter(c => c);

                let sortedOtherTableFields = [];
                let unsortedOtherTableFields = _.filter(tableHeaders, h => {
                    if (!h.from_document) return true
                })

                unsortedOtherTableFields.map(item => {
                    let field = _.find(this.fieldData, {
                        name: item.name,
                        field_type: 'table'
                    });
                    if (field) sortedOtherTableFields.push({
                        ...item,
                        ...{
                            order: isValidOrder(field.order) ? field.order : 9999
                        }
                    })
                });

                sortedOtherTableFields.sort((a, b) => a.order - b.order)
                sortedOtherTableFields.forEach(item => {
                    headerFromDoc.push(item.name)
                });

                return headerFromDoc;

            },
            resizeMainPane(event) {
                if (event && event[1] && event[1].size <= 25) {
                    this.fieldsDefaultClass = 'full-width-field-class';
                }
                // else if(event&& event[1] && event[1].size >=40) {
                //      this.fieldsDefaultClass = 'divide-width-field-class';
                // }
                else {
                    this.fieldsDefaultClass = '';
                }

            },

             getSearchTextPages(){
                 let pageArray = []
                  _.forEach(this.canvasImageURLs ,(val,index)=>{
                      let ref = 'page_number_'+ index
                      length = this.$refs[ref][0].searchRectangleList.length
                      length>0 ? pageArray.push(index) : null
                 })
                 return pageArray
            },

            removeActiveItem(ref, activeIndex){
                 let rect = this.$refs[ref][0].searchRectangleList[activeIndex]
                 this.$refs[ref][0].removeActiveItem(rect)
              },

              getCurrentActiveIndex(pageNumber){
                let pageNumberRef = 'page_number_'+ pageNumber
                    let list = this.$refs[pageNumberRef][0].searchRectangleList
                    let activeIndex = _.findIndex(list, {
                         active: true,
                     });
                  return {pageNumberRef, activeIndex}
               },
            handlePreviousSearch() {
                 let currentActiveIndex = 0;
                 let pageArray = this.getSearchTextPages()
                 let page = pageArray[0];
                _.forEach(pageArray, (pageNumber,index)=>{
                    let {pageNumberRef, activeIndex} = this.getCurrentActiveIndex(pageNumber)
                    if(activeIndex == -1){ return;}
                    this.removeActiveItem(pageNumberRef, activeIndex)
                    if(activeIndex == 0)
                    {
                        page =  (index == 0) ? pageArray[pageArray.length-1] : pageArray[index-1]
                        let pgNumber =  'page_number_'+ page
                        currentActiveIndex = this.$refs[pgNumber][0].searchRectangleList.length - 1
                        return false;
                    }
                    currentActiveIndex = activeIndex - 1
                    page = pageNumber
                    return false;
                })
                 this.setActiveItem(page, currentActiveIndex);
            },
            handleNextSearch() {
                 let currentActiveIndex = 0;
                 let pageArray = this.getSearchTextPages()
                 let page = pageArray[0];
                _.forEach(pageArray, (pageNumber,index)=>{
                    let {pageNumberRef, activeIndex} = this.getCurrentActiveIndex(pageNumber)
                    if(activeIndex == -1){return;}
                    this.removeActiveItem(pageNumberRef, activeIndex)
                    if(activeIndex == (this.$refs[pageNumberRef][0].searchRectangleList.length-1))
                    {
                        currentActiveIndex = 0
                        page =  (index == pageArray.length-1) ? pageArray[0] : pageArray[index+1] ;
                        return false;
                    }
                    currentActiveIndex = activeIndex+1
                    page = pageNumber
                    return false;
                })
                this.setActiveItem(page, currentActiveIndex);
            },

            setActiveItem(page, currentActiveIndex){
                let ref = 'page_number_'+ page
                let search = this.$refs[ref][0].searchRectangleList[currentActiveIndex]
                this.$refs[ref][0].setActiveItem(search)
            },

            showDocumentMessages() {
                let documentData=this.$store.getters["documentViewStore/documentData"];
                const {tableErrorFields, totalErrorCount, totalWarningCount } = this.errorCount();
                const allErrorMessage = this.$store.getters["documentViewStore/allErrorMessages"];
                const isContainsMessages = !_.isEmpty(documentData.messages) ||
                !_.isEmpty(allErrorMessage.PackageLevelMessage) ||
                    _.get(documentData, 'publish_failure_reason') ||
                    _.get(documentData, "rejection_note") ||
                    _.get(documentData, "move_to_inbox_reason") ||        // Checking if there is Move to inbox comment for the document
                    totalErrorCount ||
                    totalWarningCount;

                if (isContainsMessages) {
                    this.$store.commit("documentViewStore/showDocumentMessagesFlag",true)
                    this.$store.commit("documentViewStore/toggleMessageSection",false);
                } else {
                    this.$store.commit("documentViewStore/showDocumentMessagesFlag",false);
                    this.$store.commit("documentViewStore/maximizeLineItem");

                    // this.showLineItems();
                }
            },
            toggleMessageSection(showDocumentMessages) {
                if (showDocumentMessages) {
                    this.documentMessagePaneSize = 30;
                    this.canvasPaneSize =
                        100 - (this.documentMessagePaneSize + this.lineItemPaneSize);
                    return;
                }
                if (this.showDocumentMessagesFlag) {
                    this.documentMessagePaneSize = 4;
                    this.canvasPaneSize = 100 - (this.documentMessagePaneSize + this.lineItemPaneSize);
                    return;
                }
                this.documentMessagePaneSize = 4;
                this.lineItemPaneSize = 4.5;
                this.canvasPaneSize = 92;
                100 - (this.documentMessagePaneSize + this.lineItemPaneSize);
            },
            handleApprovalDialogClose(action) {
                if (action == "cancel") {
                    this.approval;
                }
            },
            fieldAllSelect() {
                // let fieldData=this.$store.getters["documentViewStore/fieldData"];
                _.map(this.fieldData, (item) => {
                    return (item.selected = this.fields_select_all_checkbox);
                });
                this.$store.commit("documentViewStore/setFieldData",this.fieldData);
                this.fields_select_all_checkbox ? (this.field_search_text = "") : "";
            },
            rawData(){
                let documentData=this.$store.getters["documentViewStore/documentData"];
                if(documentData.is_multi_table){
                    return this.rawDataForMultiTable()
                }
                return this.rawDataForSingleTable()
            },
            rawDataForMultiTable() {
                this.fieldPredictionData=this.$store.getters["documentViewStore/fieldPredictionData"];
                let documentData=this.$store.getters["documentViewStore/documentData"];
                let prediction = this.fieldPredictionData.prediction ?
                    _.cloneDeep(this.fieldPredictionData.prediction) :
                    _.cloneDeep(documentData.prediction);
                prediction = _.isEmpty(prediction) ? [] : prediction;
                let fields = _.cloneDeep(this.fieldData);
                let tablePrediction = _.find(prediction, {
                    name: "table",
                });

                let tableFields = _.sortBy(
                    _.filter(fields, {
                        field_type: "table",
                    }),
                    (field) => {
                        return field.order;
                    }
                );
                let tableRows=[];
                let tableHeaders=[];
                let tableHeaderNames=[];
                _.each((tablePrediction.data || []), (tableData) => {
                    tableRows.push(_.get(tableData, "content.rows"))
                    tableHeaders.push(_.get(tableData, "content.headers") || []);
                    tableHeaderNames.push((_.get(tableData, "content.headers")).map(header => header.name));
                })


               try{
                _.each((tableHeaderNames || []), (tableHeader,index) => {
                _.each((fields || []), (field) => {
                    if (field.field_type == "table" && field.selected && !tableHeader.includes(field.name)) {
                        tableHeaders.push({
                            "value": "",
                            "name": field.name,
                            "is_additional_config_header": true
                        });
                    }
                })
                })
               }
               catch(e){
                   console.log("err in rawdata",e)
               }
                return {
                    prediction,
                    fields,
                    tableHeaders,
                    tableRows,
                    tableFields
                };
            },
            rawDataForSingleTable() {
                let documentData=this.$store.getters["documentViewStore/documentData"];
               this.fieldPredictionData=this.$store.getters["documentViewStore/fieldPredictionData"];
            //    this.fieldData=this.$store.getters["documentViewStore/fieldData"];
               this.$store.commit("documentViewStore/setTableData");
                let prediction = this.fieldPredictionData.prediction ?
                    _.cloneDeep(this.fieldPredictionData.prediction) :
                    _.cloneDeep(documentData.prediction);
                prediction = _.isEmpty(prediction) ? [] : prediction;
                let fields = _.cloneDeep(this.fieldData);
                let tablePrediction = _.find(prediction, {
                    name: "table",
                });
                let tableFields = _.sortBy(
                    _.filter(fields, {
                        field_type: "table",
                    }),
                    (field) => {
                        return field.order;
                    }
                );
                let tableRows = _.get(tablePrediction, "content.rows");
                let tableHeaders = _.get(tablePrediction, "content.headers") || [];
                const tableHeaderNames = tableHeaders.map(header => header.name);

                _.each((fields || []), (field) => {
                    if (field.field_type == "table" && field.selected && !tableHeaderNames.includes(field.name)) {
                        tableHeaders.push({
                            "value": "",
                            "name": field.name,
                            "is_additional_config_header": true
                        });
                    }
                })

                return {
                    prediction,
                    fields,
                    tableHeaders,
                    tableRows,
                    tableFields
                };
            },
            getCanvasSelector(index) {
                return `page-${index + 1}`;
            },
            scrollDocument() {
                scrollTo(`#page-${parseInt(this.pageNumber)}`, 10, canvas_options);
            },
            nextPage() {
                if (
                    this.canvasImageURLs &&
                    _.isArray(this.canvasImageURLs) &&
                    this.pageNumber < this.canvasImageURLs.length
                ) {
                    this.pageNumber++;
                    this.scrollDocument();
                }
            },
            previousPage() {
                if (this.pageNumber > 1) {
                    this.pageNumber--;
                    this.scrollDocument();
                }
            },
            scrollToPage() {
                this.$nextTick(() => {
                    this.scrollDocument();
                });
            },

            updateFieldOptions(params){
                if (_.isEmpty(_.get(params, 'name'))) {
                    return;
                }
                let field;
                let tableData=this.$store.getters["documentViewStore/tableData"]
                if (params.field_type == "table") {
                    field = _.find(tableData[params.index], (col) => {
                        return (
                            col && col.field_config && col.field_config.name == params.name+"_"+params.index
                        );
                    });
                    if (!field) return;
                    field.config = []
                    field.options = _.get(params, 'options', [])
                    field.value = field.options.length ?  field.options[0]["value"] : ""
                    this.$set(this.fieldPredictionData, 'prediction', this.fieldPredictionData.prediction)
                    this.$store.commit("documentViewStore/setPredictionData",this.fieldPredictionData.prediction);

                    this.$nextTick(() => {
                        this.setTableParams()
                    });
                }
            },
            /*
                Purpose : "To display the 'Do you want to track these changes for further training?' and 'Please draw a rectangle.' pop-up messages when a document is opened or when a page is loaded and also set shouldTrackChanges flag for autolearning."

                    Step 1. Retrieve a field from the documentViewStore prediction to check if the field is expected in the document.
                    Step 2. Retrieve the isRectangleRequested flag from the documentViewStore to check whether the 'Please draw rectangle.' popup has been requested or not.
                    Step 3. Retrieve the autoLearningEnable flag from the documentViewStore to determine whether to display the 'Do you want to track these changes for further training?' popup.
                    Step 4. Display 'Do you want to track these changes for further training?' if the condition matches.
                    Step 5. Set shouldTrackChanges flag to true on 'Confirm'.
                    Step 6. Display 'Please draw a rectangle.' if the condition matches.


                @params: An object containing field values 'inputVal', 'name', 'index', 'table_index', 'field_type', and 'field_config'.
            */
            async autoLearningConfirmation(params){
                // Step 1. Retrieve a field from the documentViewStore prediction to check if the field is expected in the document.
                let field =  this.$store.getters["documentViewStore/getPredictionFieldByName"](params.name);
                // Step 2. Retrieve the isRectangleRequested flag from the documentViewStore to check whether the 'Please draw rectangle.' popup has been requested or not.
                let isRectangleRequested =  this.$store.getters["documentViewStore/isRectangleRequested"];
                // Step 3. Retrieve the autoLearningEnable flag from the documentViewStore to determine whether to display the 'Do you want to track these changes for further training?' popup.
                let autoLearningEnable = this.$store.getters["documentViewStore/isAutoLearningEnabled"];
                if (autoLearningEnable && this.shouldTrackChanges === null && !_.get(params, 'field_config.is_custom_field', false)) {
                    // set this flag to false to show 'Please draw a rectangle.' pop-up on page refresh.
                    isRectangleRequested = false;
                    // Step 4. Display 'Do you want to track these changes for further training?' if the condition matches.
                    let response = await this.$confirm(`Do you want to track these changes for further training?`, {
                        confirmButtonText: "Confirm",
                        cancelButtonText: "Cancel",
                    })
                    .catch(()=>{
                        this.$store.commit("documentViewStore/shouldTrackChanges",false);
                    });
                    // Step 5. Set shouldTrackChanges flag to true on 'Confirm'.
                    response && this.$store.commit("documentViewStore/shouldTrackChanges",true);
                }

                let dataToUpdate = {}
                if (this.shouldTrackChanges && _.get(field, 'field_config.field_expected_in_document') && !isRectangleRequested) {
                    // Step 6. Display 'Please draw a rectangle.' if the condition matches.
                    this.$alert(`Please draw rectangle.`, { confirmButtonText: 'OK' })
                    this.$store.commit("documentViewStore/setIsRectangleRequested",true);
                }
            },
            async updateFieldValue(params) {
                if (params.field_type != "table") {
                    this.autoLearningConfirmation(params);
                }
                this.$store.commit("documentViewStore/updateFieldValue",params);
            },
            getCheckBoxFields(name){
                return _.filter(this.fieldPredictionData.prediction, (field)=>{
                        return (_.get(field, 'field_config.type') == 'checkbox' && field.name == name && !field.is_master_checkbox);
                    })
            } ,
            getRequiredFields() {
                let documentData=this.$store.getters["documentViewStore/documentData"];
                // let fieldData=this.$store.getters["documentViewStore/fieldData"];
                let response = _.map(this.fieldData, (field) => {
                    if (field.selected) return field._id;
                });

                let params = {
                    documentType: documentData.document_type,
                    requiredFields: _.compact(response),
                };
                return params;
            },

            closePage() {
                this.$emit("update:showDocumentView", false);
                // this.$router.push('/invoice-document-list')
            },
            resetPage() {
                let message = "Are you sure you want to discard the changes?";
                this.$confirm(message, {
                        confirmButtonText: "Confirm",
                        cancelButtonText: "Cancel",
                    })
                    .then(() => {
                        this.fieldPredictionData.prediction = null;
                        this.$store.commit("documentViewStore/setPredictionData",null);

                        this.mapFieldValue();
                        this.resetStack();
                    })
                    .catch();
            },

            setCloneData() {
                this.$nextTick(() => {
                    let clonedPrediction = _.cloneDeep(
                        this.fieldPredictionData.prediction
                    );
                 this.$store.commit("documentViewStore/setClonedPredictionData",clonedPrediction );

                });
            },
            onTranslateButtonClick() {
                if (this.translatedWords && this.translatedWords.length) {
                    this.showTranslatedText = !this.showTranslatedText;
                    return;
                }
                this.toggleTranslateDialog()
            },
            toggleTranslateDialog() {
                this.showTranslationConfirmationDialog = !this.showTranslationConfirmationDialog;
            },
            getTranslateIcon() {
                return this.showTranslatedText ? "mdi-translate-off active" : "mdi-translate inactive";
            },
            showOriginal() {
                // this.translatedWords =[];
                this.showTranslatedText = false;
                this.closeDialog()
            },
            closeDialog() {
                this.showTranslationConfirmationDialog = false;
            },
            closeVisualisationDialog(){
                this.showVisualisationPage = false;
            },
            async translateLanguage() {
                this.onLanguageSelectionChange(this.customerPrefferedLanguage);
                this.closeDialog();
            },

            async onLanguageSelectionChange(language) {
                this.loading = true;
                try {
                    if (!this.translatedWords || !this.translatedWords.length) {
                        const params = {
                            language,
                            document_id: this.documentId
                        };
                        const translationResponse = await LanguageTranslationService.translate(params);
                        if (!translationResponse || !translationResponse.data || !translationResponse.data.response) {
                            throw new Error("Invalid response");
                        }
                        this.translatedWords = translationResponse.data.response;
                    }
                    this.showTranslatedText = true;
                } catch (err) {
                    console.error("Error in translation ", err);
                    this.showTranslatedText = false;
                    this.notifyError("Something went wrong while translation");
                }
                this.loading = false;
            },
            async refreshPage() {
                console.time("refreshpage")
                this.loading = true;
                // this.fieldPredictionData.prediction = "";
                this.showProperties=false;
                //projection on new line
                this.$store.commit("documentViewStore/setCurrentActionPageNumber", this.pageNumber); // toload complete Canvas on refresh
                let data =  await DocumentService.getDocument({"_id":this.documentId},
                            ["_id","org","ocr_dimension","document_type","document_subtype","storage_folder_path","status","rejection_note",
                            "approval_status","publish_failure_reason","file_type","file_name","stage","email",
                            "state","is_multi_table","is_multi_documents_present","original_file_name","parent_document_id","input_channel","modified_fields","unpredicted_fields","move_to_inbox_reason"]);
                let documentRecord = data;
                this.$store.commit("documentViewStore/setDocumentRecord",documentRecord);
                // data = _.omit(data, ["messages","prediction"]);
                let documentData = await DocumentService.fetchDocumentData({"document_id": this.documentId },
                                    ["display_fields","document_type","messages","modified_fields",
                                    "prediction","system_date_format","br_field_config","excel_data"]);
                        /**
                * here packagefield prediction data merger into document prediction data for common used purposed
                * and this data should be merger before prepareDocumentData() call
                */
                if(this.$route.query.view == Constants.DOCEX.FIELD_LEVEL.PACKAGE)
                {
                    let parentDocumentData = await DocumentService.fetchDocumentData({"document_id": this.parentDocumentId},
                                             ["display_fields","document_type","messages","modified_fields",
                                             "prediction","system_date_format","br_field_config","excel_data"])
                    documentData[0]["prediction"].unshift(...parentDocumentData[0]['prediction'])
                    let errorMessages =  await DocumentPackageService.get({ "id":this.parentDocumentId,"getErrorMessage":true })
                    let packageErrorMessage = {}
                    packageErrorMessage["PackageLevelMessage"] = parentDocumentData[0]['messages'] || []
                    Object.assign(errorMessages, packageErrorMessage)

                    this.$store.commit("documentViewStore/setAllErrorMessages",errorMessages)
                    let packageFormData = this.$store.getters["documentViewStore/packageFormData"];
                    for(let packages of packageFormData){
                        if(packages["id"]){
                            packages["messages"] = errorMessages[packages["id"]]
                        }
                    }
                    this.$store.commit("documentViewStore/setPackageFormData",packageFormData)
                }else{
                        let errorMessage = {}
                        errorMessage["PackageLevelMessage"] = [];
                        errorMessage[this.documentId] = documentData[0]["messages"]
                        this.$store.commit("documentViewStore/setAllErrorMessages",errorMessage)
                }
                documentData = this.prepareDocumentData(data, documentData[0])
                this.$store.commit("documentViewStore/setDocumentData",documentData);
                this.$store.commit("documentViewStore/setOcrDimension",documentData.ocr_dimension);
                this.$store.commit("documentViewStore/setPredictionData",documentData.prediction);
                this.showDocumentMessages();
                this.stage = documentData.stage;
                this.state = documentData.state;
                this.displayFields = documentData.display_fields;
                this.documentType = documentData.document_type;
                this.$store.commit("documentViewStore/setDocumentType", this.documentType);
                this.documentSubtype= documentData.document_subtype
                this.$store.commit("documentViewStore/setDocumentSubtype", this.documentSubtype);
                this.rejectionNote = documentData.rejection_note;
                this.approvalStatus = documentData.approval_status;
                const actionButtons=await this.getActionButtons()
                this.$store.commit("actionButtonStore/setPropertiesActionButtons", actionButtons);
                // this.loadDebugdata()
                this.mapFieldValue();
                this.setCloneData();
                this.updatePredictionData(documentData)
                this.assignSelectedField()
                this.setPageNumber();

                // To accommodate the difference in the starting index between IdpCanvas's page_number and this.pageNumber,
                // you can use this.pageNumber - 1 when recreating bounding boxes. This adjustment will ensure that the bounding boxes are correctly associated with the pages.
                // Redraw bounding boxes after refresh as previous may have errors
                const canvasPageRef = this.$refs["page_number_"+(this.pageNumber-1)]
                if(!_.isEmpty(canvasPageRef)){
                    canvasPageRef[0].createBoundingBoxes();
                }
                /* Refresh Line items after the DOM update cycle */
                this.lineItemsRefreshKey += 1;
                console.timeEnd("refreshpage")
                this.loading = false;
            },

            reloadBBoxesByPage(pageNumber){
                if(!pageNumber) { return; }

                const canvasPageRef = this.$refs["page_number_" + (pageNumber - 1) ];
                if(!_.isEmpty(canvasPageRef)){
                    canvasPageRef[0].createBoundingBoxes();
                }
            },

            goToDocListPage() {
                const filter = getQueryFilter();
                const view = this.customerConfiguration && this.customerConfiguration.view || "document";
                const path = this.getPath(this.documentType) || `/idp/${view}/${this.documentType}`;
                this.$router.push({
                    path,
                    query: {
                        filter: JSON.stringify(filter || {})
                    }
                });
            },
            // route map for static list pages
            getPath(documentType) {
                const routeMap = {
                    "insurance": "/idp/insurance-document-list"
                }
                return routeMap[documentType];
            },
            closeSearchBox() {
                this.visible_searchbar = false;
                this.search_text = "";
            },
            handleToolbarClick(e) {
                EventBus.$emit("handle_toolbar_click", e.currentTarget.id);
            },
            openDialog() {
                this.showDialog = true;
            },
            handleDialogClose() {
                this.showDialog = false;
            },
            showSearchBox() {
                if (this.visible_searchbar) {
                    this.search_text = "";
                    this.visible_searchbar = false;
                    return;
                }
                this.visible_searchbar = true;
            },

            downloadFile() {
                this.isDownloadReadOnly = true;
                let documentData=this.$store.getters["documentViewStore/documentData"];
                let pdf = new jsPDF("portrait", "pt", "a4", true);
                for (let i = 0; i < this.totalPages; i++) {
                    let uri = this.$refs["page_number_" + i][0].getURI();
                    pdf.addImage(uri, "JPEG", 10, 70, 550, 700);
                    pdf.addPage();
                }
                let pageCount = pdf.internal.getNumberOfPages();
                pdf.deletePage(pageCount);
                pdf.save(documentData.file_name);
                this.isDownloadReadOnly = false;
            },
            makeDocPresentTableHeaderVisible(fieldData) {
                const {
                    tableHeaders
                } = this.rawData();
                let documentData=this.$store.getters["documentViewStore/documentData"];
                if(documentData.is_multi_table){
                    _.each(tableHeaders, (tableHeader) => {
                                const headerNames = (tableHeaders || []).filter(h => !h["is_additional_config_header"]).map((header) => header.name);
                                fieldData = fieldData.map((field) => {
                                    if (field && field["field_type"] == "table" && headerNames.includes((field.name + '').replace(' ', '_'))) {
                                        field["selected"] = true;
                                    }
                                    return field;
                                });
                                });
                }
                else{
                    const headerNames = (tableHeaders || []).filter(h => !h["is_additional_config_header"]).map((header) => header.name);
                        fieldData = fieldData.map((field) => {
                            if (field && field["field_type"] == "table" && headerNames.includes((field.name + '').replace(' ', '_'))) {
                                field["selected"] = true;
                            }
                            return field;
                });
                }
                this.$store.commit("documentViewStore/setFieldData",fieldData);
                return fieldData;
            },

            // makeDocPresentTableHeaderVisible(fieldData) {
            //     const {
            //         tableHeaders
            //     } = this.rawData();
            //     const headerNames = (tableHeaders || []).filter(h => !h["is_additional_config_header"]).map((header) => header.name);
            //     fieldData = fieldData.map((field) => {
            //         if (field && field["field_type"] == "table" && headerNames.includes((field.name + '').replace(' ', '_'))) {
            //             field["selected"] = true;
            //         }
            //         return field;
            //     });
            //     return fieldData;
            // },
            addTableHeadersToFieldData(fieldDataParam) {
                let fieldData = _.cloneDeep(fieldDataParam);
                let documentData=this.$store.getters["documentViewStore/documentData"];
                let {
                    tableHeaders
                } = this.rawData();
               if(documentData.is_multi_table){
                       _.each(tableHeaders, (tableHeader) => {
                _.each(tableHeader, (column) => {
                    let field = _.find(fieldData, (field) => {
                        return field.name == (column.name + '').replace(' ', '_')
                    })

                    if (field || column["is_additional_config_header"] && column["selection_changed_value"] != "NOT_SELECTED") {
                        return;
                    }
                    // if(column && column["selection_changed_value"] == "NOT_SELECTED"){ return; }

                    if (column.name && _.isString(column.name)) {
                        fieldData.push({
                            active: true,
                            field_type: "table",
                            label: column.value,
                            name: (column.name + '').replace(' ', '_'),
                            selected: true,
                            type: "string",
                            validation: null,
                            isDummyField: true
                        })
                    }
                });
                });
               }
               else{
                       _.each(tableHeaders, (column) => {
                    let field = _.find(fieldData, (field) => {
                        return field.name == (column.name + '').replace(' ', '_')
                    })

                    if (field || column["is_additional_config_header"] && column["selection_changed_value"] != "NOT_SELECTED") {
                        return;
                    }
                    // if(column && column["selection_changed_value"] == "NOT_SELECTED"){ return; }

                    if (column.name && _.isString(column.name)) {
                        fieldData.push({
                            active: true,
                            field_type: "table",
                            label: column.value,
                            name: (column.name + '').replace(' ', '_'),
                            selected: true,
                            type: "string",
                            validation: null,
                            isDummyField: true
                        })
                    }
                });
               }

                return fieldData;
            },

            // addTableHeadersToFieldData(fieldDataParam) {
            //     let fieldData = _.cloneDeep(fieldDataParam);
            //     let {
            //         tableHeaders
            //     } = this.rawData();

            //     _.each(tableHeaders, (column) => {
            //         let field = _.find(fieldData, (field) => {
            //             return field.name == (column.name + '').replace(' ', '_')
            //         })

            //         if (field || column["is_additional_config_header"] && column["selection_changed_value"] != "NOT_SELECTED") {
            //             return;
            //         }
            //         // if(column && column["selection_changed_value"] == "NOT_SELECTED"){ return; }

            //         if (column.name) {
            //             fieldData.push({
            //                 active: true,
            //                 field_type: "table",
            //                 label: column.value,
            //                 name: (column.name + '').replace(' ', '_'),
            //                 selected: true,
            //                 type: "string",
            //                 validation: null,
            //                 isDummyField: true
            //             })
            //         }
            //     });

            //     return fieldData;
            // },
    
            updateTableSelectedField(table_index){
                let selectedField=this.$store.getters["documentViewStore/selectedField"]
                 let tableParams = this.$store.getters["documentViewStore/tableParams"];
    
                if(_.get(selectedField, 'field_config.field_type') == 'table'){
                    let selected;
                    let rows= ''
                    if(table_index!= null){
                      rows=tableParams[table_index].rows
                    }
                    else{
                        rows=tableParams.rows
                    }
                    _.each(rows, (row, trIndex) => {
                            selected = _.find(row, (field) => {
                            return (_.get(field, "field_config.name") == selectedField.field_config.name)
                    })
                    if(selected)
                        {
                            return false;
                        }
                    });
                        // this.selectedField = selected;
                        this.$store.commit("documentViewStore/setSelectedField",selected)
                        this.$store.commit("documentViewStore/tableParams",tableParams)
    
                    }        
                // if(_.get(this.selectedField, 'field_config.field_type') == 'table'){
                //      let selected; 
                //  _.each(this.tableParams, (table, Index) => {
                //      _.each(table.rows, (row, trIndex) => {
                //             selected = _.find(row, (field) => {
                //                    return (_.get(field, "field_config.name") == this.selectedField.field_config.name)
                //              })
                //              if(selected)
                //              {
                //                  return false;
                //              }
                //      });
                // });
                    //  this.selectedField = selected;
                // }
            },
    
            mapFieldValue() {
                this.showProperties=false;
                let fieldValueData = this.mergeData();
                this.fieldPredictionData.prediction = fieldValueData;
                this.$store.commit("documentViewStore/setPredictionData",fieldValueData);
                this.setTableParams();
                this.showProperties=true;
                this.$store.commit("documentViewStore/setRefreshLineItem",false)
            },
        mergePredictionData(prediction,tableRows,displayFields){
                let documentData=this.$store.getters["documentViewStore/documentData"];
                _.each(displayFields, (field) => {
                        if (field.field_type == "header") {
                            this.setFieldConfig(prediction, field);
                            return;
                        }
                        if (!tableRows) {
                            return;
                        }
                        if(documentData.is_multi_table){
                            _.each((tableRows || []), (rowData,tableIndex) => {
                                _.each(rowData, (rowPredictedData, rowIndex) => {
                                    //in multi table case: if row data not present for any table then its value is empty object
                                    //  to prevent setFieldConfig() call in that case added below check.
                                    if (!Array.isArray(rowPredictedData)) { return; }
                                    this.setFieldConfig(rowPredictedData, field, rowIndex,tableIndex);
                                });
                            });
                        }else{
                                _.each(tableRows, (rowPredictedData, rowIndex) => {
                                this.setFieldConfig(rowPredictedData, field, rowIndex);
                                });
                        }

                    });

                this.$store.commit("documentViewStore/setPredictionData",prediction);
                // this.$store.commit("documentViewStore/setTableData");


            },
            mergeData() {
                let {
                    prediction,
                    fields,
                    tableRows,
                    tableHeaders
                } = this.rawData();
                let displayFields;
                //for package level field, do not check if there not part of display fields
                if( this.$route.query.view == Constants.DOCEX.FIELD_LEVEL.PACKAGE){
                    displayFields = _.filter(fields, {field_level:"package"});
                    this.mergePredictionData(prediction,tableRows,displayFields)
                }
                displayFields = _.filter(fields, (field) => {
                    return ((this.displayFields && this.displayFields.includes(field.name)) || field.isDummyField);
                });
                this.mergePredictionData(prediction,tableRows,displayFields)

                return prediction;
            },
            // mergeData() {
            //     console.log("merge data called")
            //     let {
            //         prediction,
            //         fields,
            //         tableRows,
            //         tableHeaders
            //     } = this.rawData();
            //     let displayFields = _.filter(fields, (field) => {
            //         return ((this.displayFields && this.displayFields.includes(field.name)) || field.isDummyField);
            //     });

            //     _.each(displayFields, (field) => {
            //         if (field.field_type == "header") {
            //             this.setFieldConfig(prediction, field);
            //             return;
            //         }
            //         if (!tableRows) {
            //             return;
            //         }
            //         _.each(tableRows, (rowPredictedData, rowIndex) => {
            //            this.setFieldConfig(rowPredictedData, field, rowIndex);
            //         });
            //     });
            //     return prediction;
            // },

            changeHeaderValue(headers, prevColumn, newColumn) {
                const prevLabel = prevColumn["label"];
                const prevValue = prevColumn["field"];
                const nextLabel = newColumn["label"];
                const nextValue = newColumn["value"];
                const random = () => Math.floor(1000 + Math.random() * 9000);

                let changedHeaderLabel = null;
                let changedHeaderValue = null;

                const newHeaders = headers.map((header) => {
                    if (header && header.name == nextValue) {
                        changedHeaderValue = (header["name"] + "_" + random()).replace(" ", "_") + "DUMMY$";
                        changedHeaderLabel = "Not selected";
                        header["name"] = changedHeaderValue;
                        delete header["headerClass"];
                        delete header["cellClass"];
                        if(header["is_additional_config_header"]){
                          header["value"] = nextLabel;
                        }
                        header["is_modified"] = true;
                        header["selection_changed_value"] = "NOT_SELECTED";
                    }

                    if (header && header.name == prevValue) {
                        header["name"] = nextValue;
                        header["headerClass"] = "selected-cell";
                        header["cellClass"] = "selected-cell";
                        // if(header["is_additional_config_header"]){
                        //   header["value"] = nextLabel;
                        // }
                        header["is_modified"] = true;
                        delete header["selection_changed_value"];
                    }
                    return header;
                });
                return {
                    newHeaders,
                    changedHeaderLabel,
                    changedHeaderValue
                };
            },

            changeCellHeader(rows, prevHeaderValue, newHeaderValue, replacedHeaderValue) {
                const usedHeaders = [];
                const newRows = rows.map((row) => {
                    row = row.map((cell) => {
                        if (cell && cell.name == newHeaderValue) {
                            cell["name"] = replacedHeaderValue;
                            cell["is_modified"] = true;
                            delete cell["field_config"];
                        }

                        if (cell && cell.name == prevHeaderValue) {
                            cell["name"] = newHeaderValue;
                            cell["is_modified"] = true;
                            delete cell["field_config"];
                        }
                        usedHeaders.push(cell["name"]);
                        return cell;
                    });
                    return row;
                });

                return {
                    newRows,
                    usedHeaders
                };
            },

            removeCellsNotInHeaders(rows, headers) {
                const headerNames = (headers || []).map((header) => header.name);
                const newRows = (rows || []).map((row) => {
                    row = row.map((cell) => {
                        if (!cell || !headerNames.includes(cell.name)) {
                            return null;
                        }
                        return cell;
                    }).filter(c => c);
                    return row;
                }).filter(r => r);
                return newRows;
            },

            removeUnusedDummyHeaders(newHeaders, usedHeaders) {
                const headers = []
                newHeaders.map((header) => {
                    if (usedHeaders.includes(header.name)) {
                        headers.push(header);
                    }
                });
                return headers;
            },

            changeTableColumn(columnPrevValue, columnNextValue) {
                if (!this.fieldPredictionData || !_.isObject(this.fieldPredictionData)) {
                    return;
                }

                const prediction = _.cloneDeep((this.fieldPredictionData || {})["prediction"] || []);
                const tableIndex = _.findIndex(prediction, function (field) {
                    return field && (field.name == "table")
                });
                if (tableIndex < 0) {
                    return;
                }
                const tableField = prediction[tableIndex] || {};
                const headers = (tableField["content"] || {})["headers"] || [];
                const rows = (tableField["content"] || {})["rows"] || [];

                const {
                    newHeaders,
                    changedHeaderLabel,
                    changedHeaderValue
                } = this.changeHeaderValue(headers, columnPrevValue, columnNextValue);
                const {
                    newRows,
                    usedHeaders
                } = this.changeCellHeader(rows, columnPrevValue["field"], columnNextValue["value"], changedHeaderValue);
                const finalRows = newRows; //this.removeCellsNotInHeaders(newRows, newHeaders);

                tableField["content"] = tableField["content"] || {};
                tableField["content"]["headers"] = newHeaders;
                tableField["content"]["rows"] = finalRows;

                prediction[tableIndex] = tableField;
                this.fieldPredictionData["prediction"] = prediction;
                this.$store.commit("documentViewStore/setPredictionData", prediction);

                this.updateTableNerData(columnPrevValue.field, columnNextValue.value)
            },



            async setFieldConfig(prediction, field, rowIndex,tableIndex) {
                let field_config = _.cloneDeep(field)
                if (field_config.type == "checkbox") {
                       this.mergeCheckBoxFieldValue(prediction, field)
                       return;
                }
                let predictedField = _.find(prediction, {
                    // prediction from model
                    name: field.name,
                });

                if (field_config && field_config.type == "date") {
                    field_config.system_date_format = this.fieldPredictionData.system_date_format;
                }

                if (predictedField) {
                    predictedField["field_config"] = field_config;
                    rowIndex != undefined ?
                        ((predictedField["field_config"].index = rowIndex),
                            (predictedField["field_config"].name =
                                predictedField["field_config"].name + "_" + rowIndex)) :
                        "";
                    tableIndex != undefined ? predictedField["field_config"].tableIndex = tableIndex : "";
                    predictedField["validationMsgs"] = predictedField.validationMsgs || [];
                    predictedField["config"] = predictedField["config"] || [];
                    this.$store.commit("documentViewStore/addBusinessRulesError",{'predictedField': predictedField, 'index': rowIndex});

                    return;
                }
                if (field_config.selected !== true) return;
                let field_update_value = {};
                if (rowIndex != undefined) {
                    field_update_value.index = rowIndex;
                    field_update_value.name = field_config.name + "_" + rowIndex;
                    _.isNumber(tableIndex) ? field_update_value.tableIndex = tableIndex : "";
                }
                let fieldNotInPrediction = {
                    name: field_config.name,
                    bounds: null,
                    ...(field_config.field_type != "table" && {
                        value: "",
                    }),
                    value: "",
                    ...(field_config.type == "date" && {
                        formatted_value: "",
                    }),
                    field_config: {
                        ...field_config,
                        ...field_update_value,
                    },
                };

                this.$store.commit("documentViewStore/addBusinessRulesError",{'predictedField': fieldNotInPrediction, 'index': rowIndex});

                prediction.push(fieldNotInPrediction);
            },
             mergeCheckBoxFieldValue(prediction, field){
                   let field_config = _.cloneDeep(field)
                   let predictedFields =  _.filter(prediction, (predictedField)=>{
                        return predictedField.name == field.name && !predictedField.is_master_checkbox
                   })
                  //if(_.isEmpty(predictedField))return;
                   let checkedValues = _.compact(_.map(predictedFields, (field)=>{
                        if(!_.isEmpty(field.value)){return field.value}
                   }));
                   let masterField =  _.find(prediction, (predField)=>{
                       return predField.is_master_checkbox && predField.name == field_config.name
                    })
                    if(masterField){
                        masterField.value = checkedValues
                    }
                    else{
                        let masterCheckBoxField = _.find(predictedFields, (field)=>{
                           return field.bounds;
                        })
                        let master =
                           {
                                "name" : field_config.name,
                                "bounds" :null,
                                "page_number" : 1,
                                "value" :null,
                                "field_config":field_config,
                                "original_value" : null
                        }
                        masterCheckBoxField = _.cloneDeep(masterCheckBoxField) || _.cloneDeep(predictedFields[0]) || master
                        this.$store.commit("documentViewStore/addBusinessRulesError",{'predictedField': masterCheckBoxField, 'index': null,"field_name":field_config.name});
                        masterCheckBoxField = _.cloneDeep(masterCheckBoxField )

                        masterCheckBoxField["field_config"] = _.cloneDeep(field_config);
                        masterCheckBoxField.value = checkedValues;
                        masterCheckBoxField.is_master_checkbox = true;
                        masterCheckBoxField.validationMsgs = [];
                        prediction.push(masterCheckBoxField);
                        this.$store.commit("documentViewStore/addBusinessRulesError",{'predictedField': masterCheckBoxField, 'index': null});

                    }
                let checkboxValues = _.map(field_config.options, (option)=>option.value.toLowerCase());
                _.each(checkboxValues, (value)=>{
                       let fieldPredicted = _.find(predictedFields, (field)=>{
                          return field.value == value;
                       })
                       if(fieldPredicted){
                           fieldPredicted["field_config"] = _.cloneDeep(field_config);
                           fieldPredicted["field_config"].name = fieldPredicted.name+'_'+fieldPredicted.value;
                       }else{
                          let fieldA = _.find(predictedFields, (field)=>{
                                    return _.get(field, 'field_config.name') == field.name+'_'+value;
                          })
                          if(!fieldA){
                                let newField =
                           {
                                "name" : field_config.name,
                                "bounds" :null,
                                "page_number" : 1,
                                "value" :null,
                                "field_config":field_config,
                                "original_value" : null
                            }
                           newField["field_config"] = _.cloneDeep(field_config);
                           newField["field_config"].name = field_config.name+'_'+value;
                           prediction.push(newField);
                            }

                       }
                })
            },
                prepareInitialTableData(tableData){
                    if(tableData.data){
                        return this.prepareInitialTableDataForMultiTable(tableData.data)
                    }
                        return this.prepareInitialTableDataForSingleTable(tableData)
                },
            prepareInitialTableDataForMultiTable(tableData) {
                try{
                _.each(tableData,(table,i)=>{
                   tableData[i]["name"] = tableData[i]["name"] || "table",
                    tableData[i]["value"] = tableData[i]["value"] || "",
                    tableData[i]["content"] = tableData[i]["content"] || {};
                tableData[i]["page_number"] = tableData[i]["page_number"] || 1;
                tableData[i]["content"]["rows"] = (!tableData[i]["content"]["rows"] || !_.isArray(tableData[i]["content"]["rows"])) ? [] : tableData[i]["content"]["rows"];
                tableData[i]["content"]["headers"] = (!tableData[i]["content"]["headers"] || !_.isArray(tableData[i]["content"]["headers"])) ? [] : tableData[i]["content"]["headers"];
                tableData[i]["content"]["footers"] = (!tableData[i]["content"]["footers"] || !_.isArray(tableData[i]["content"]["footers"])) ? [] : tableData[i]["content"]["footers"];

                })
                }
                catch(err){
                    console.log("errr is::",err)
                }

                 return tableData;
            },
             prepareInitialTableDataForSingleTable(tableData) {
                tableData["name"] = tableData["name"] || "table",
                    tableData["value"] = tableData["value"] || "",
                    tableData["content"] = tableData["content"] || {};
                tableData["page_number"] = tableData["page_number"] || 1;
                tableData["content"]["rows"] = (!tableData["content"]["rows"] || !_.isArray(tableData["content"]["rows"])) ? [] : tableData["content"]["rows"];
                tableData["content"]["headers"] = (!tableData["content"]["headers"] || !_.isArray(tableData["content"]["headers"])) ? [] : tableData["content"]["headers"];
                tableData["content"]["footers"] = (!tableData["content"]["footers"] || !_.isArray(tableData["content"]["footers"])) ? [] : tableData["content"]["footers"];
                return tableData;
            },

            prepareInitialPredictionData(predictionData) {
                const defaultTableFormat = {
                    "name": "table",
                    "value": "",
                    "content": {
                        "rows": [],
                        "headers": [],
                        "footers": [],
                        "page_number": 1
                    }
                }

                if (!predictionData || !_.isArray(predictionData) || !predictionData.length) {
                    return [defaultTableFormat];
                }

                const indexOfTable = _.findIndex(predictionData, (field) => field && (field["name"] == "table"));
                if (indexOfTable < 0) {
                    // let tabledata=_.find(predictionData, {name: "table" });
                    // _.each(tabledata.data,(table)=>{
                        if(this.documentType == 'insurance'){
                            defaultTableFormat['data']=[{ "content": {
                        "rows": [],
                        "headers": [],
                        "footers": [],
                        "page_number": 1
                    }
                    }]
                            predictionData.push(defaultTableFormat);

                        }else{
                            predictionData.push(defaultTableFormat);

                        }
                    // })

                } else {
                    if(predictionData[indexOfTable].data){
                            predictionData[indexOfTable].data = this.prepareInitialTableData(predictionData[indexOfTable]);

                    }else{
                         predictionData[indexOfTable] = this.prepareInitialTableData(predictionData[indexOfTable]);
                    }
                }
                return predictionData;
            },

            prepareDocumentData(document, documentData) {
                document['prediction'] = this.prepareInitialPredictionData(documentData['prediction']);
                document['messages'] = documentData['messages'] || [];
                document['display_fields'] = documentData['display_fields'] || [];
                document['br_field_config'] = documentData['br_field_config'] || [];
                document['data'] = documentData['data'] || {};
                document['modified_fields'] = document['modified_fields'] || [];
                document['unpredicted_fields'] = document['unpredicted_fields'] || [];
                document['system_date_format'] = documentData['system_date_format'] || this.customerConfiguration['date_format']
                // document['country_date_format'] = documentData['country_date_format'] || ""
                document['is_multi_table'] = document['is_multi_table']
                return document
            },




            async populateFields() {
                let fieldResponse = await FieldService.get({
                    documentType: this.documentType,
                    documentSubtype: this.documentSubtype
                });
                // let fieldData=this.$store.getters["documentViewStore/fieldData"];
                let fieldData = _.merge(this.fieldData,
                    fieldResponse.data.fieldsConfiguration
                );
                fieldData = this.addTableHeadersToFieldData(fieldData)
                fieldData = this.makeDocPresentTableHeaderVisible(fieldData);
                return;
            },
            registerEvents() {
                this.busEvents = [
                    "populate-fields",
                    "update-field-value",
                    "refresh_page",
                    "IDP_LINE_HEDER_SELECTION_CHANGED",
                    "IDP_FIELD_SELECTION_CHANGED",
                    "check-field-disability",
                    "addRowInEmptyTable",
                    "setLineItemActiveTab"
                ];

                EventBus.$on("IDP_FIELD_SELECTION_CHANGED", (selectedFields) => {
                    // let fieldData=this.$store.getters["documentViewStore/fieldData"]
                    let fieldData = this.addTableHeadersToFieldData(this.fieldData);
                    fieldData = this.makeDocPresentTableHeaderVisible(fieldData);


                });

                EventBus.$on("addRowInEmptyTable", () => {
                    this.mapFieldValue();
                })
                
                EventBus.$on("IDP_LINE_HEDER_SELECTION_CHANGED", (selected, columnName) => {
                    this.$setLoader({ target: ".line-item-table" });
                    setTimeout(() => {
                        try {
                            this.$store.commit("documentViewStore/setIsLoadCanvas", false);
                            this.changeTableColumn(columnName, selected);
                            // let fieldData=this.$store.getters["documentViewStore/fieldData"]
                            let fieldData = this.addTableHeadersToFieldData(this.fieldData);
                            fieldData = this.makeDocPresentTableHeaderVisible(fieldData);
                            // this.$store.commit("documentViewStore/setFieldData",fieldData);

                        } catch (e) {
                            console.error(e);
                        }
                        this.$nextTick(() => {
                            this.$resetLoader();
                        });
                    }, 300);
                });

                // EventBus.$on("selected-field", (selectedField) => {
                //     // this.selectedField = selectedField;
                //     // console.log("this.selectedField event :::",this.selectedField)
                //     this.$store.commit("documentViewStore/setSelectedField",selectedField)

                // });
                EventBus.$on("populate-fields", () => {
                    this.populateFields();
                });
                EventBus.$on("update-field-value", (params) => {
                    this.updateFieldValue(params);
                });
                EventBus.$on("update-field-options", (params) => {
                    this.updateFieldOptions(params);
                });
                EventBus.$on("delete_all_line_items", (payload) => {
                    this.deleteAllLineItems(payload);
                })
                EventBus.$on("update_selected_field", (field) => {
                    this.updateSelectedField(field);
                });
                EventBus.$on("refresh_page", () => {
                    this.refreshPage();
                });
                EventBus.$on("document-details-info", (field) => {
                    this.openPOMapperDialog(field);
                });
                // EventBus.$on("select_active_tab", (tab) => {
                //    comnsole.log("selected_tab isss::::",tab)
                // })
                // EventBus.$on("po-mapper", (field) => {
                //     console.log("po mapper on")
                //     this.openPOMapperDialog(field);
                // });
            },
            updateSelectedField(field) {
                // this.selectedField = field;
                this.$store.commit("documentViewStore/setSelectedField",field)
            },
            updatePredictionData(document) {
                // this.$set(this.fieldPredictionData, "country_date_format", document.country_date_format);
                // this.$set(this.fieldPredictionData, "system_date_format", document.system_date_format || this.customerConfiguration.date_format ||Constants.DOCEX.DEFAULT_DATE_FORMAT);
                this.state = document.state;
                // this.$set(this.fieldPredictionData, "stage", document.stage);
                this.displayFields = document.display_fields;
                // this.$set(this.fieldPredictionData, "fileName", document.file_name);
                      this.$store.commit("documentViewStore/setPredictionDataAttrs",[{
                    name:"fileName",
                    value:document.file_name
                },{
                    name:"system_date_format",
                    value:document.system_date_format
                },{
                    name:"stage",
                    value:document.stage
                }]);
            },
            getLanguageLabel(language) {
                const languages = {}
                Constants.LANGUAGES.map((lang) => {
                    languages[lang["value"]] = lang["label"];
                });
                return languages[language] || "";
            },

            detectLanguage(){
                LanguageTranslationService.detectLanguage({
                    "document_id": this.documentId
                }).then((detectResponse) => {
                    if (!detectResponse || !detectResponse.data || !detectResponse.data.response) {
                        return;
                    }
                    const responseData = detectResponse.data.response;
                    this.docLanguage = responseData["language"];
                    this.customerPrefferedLanguage = responseData["customer_preffered_language"] || this.docLanguage;
                    if (responseData["customer_preffered_language"] && (responseData["customer_preffered_language"] != responseData["language"])) {
                        this.languageTranslationMessage = `This document is in ${this.getLanguageLabel(this.docLanguage)} language.\n Do you want to translate it in ${this.getLanguageLabel(this.customerPrefferedLanguage)}`;
                        this.showTranslationConfirmationDialog = true;
                    }

                }).catch((err) => {
                    console.error("Detection Error ", err)
                });
            },

            setPropsData(documentData){
                this.propData = {
                    id: documentData._id,
                    documentType: documentData.document_type,
                    storagePath: documentData.storage_folder_path,
                    status: documentData.status,
                    rejection_note: documentData.rejection_note,
                    approval_status: documentData.approval_status,
                };
                this.$store.commit("documentViewStore/setPropsData",this.propData);


                this.documentType = this.propData.documentType;
                this.stage = documentData.stage;
                this.state = documentData.state;
                this.rejectionNote = this.propData.rejection_note;
                this.approvalStatus = this.propData.approval_status;
                let user = this.$store.getters.user;

            },
            async loadData() {
                try {
                    const viewType = this.$route.query.view;
                    const docProjection = ["_id","org","ocr_dimension","document_type","document_subtype","storage_folder_path","status","rejection_note","approval_status","publish_failure_reason","file_type","file_name","stage","state","is_multi_documents_present","input_channel","is_multi_table","original_file_name","parent_document_id","modified_fields","unpredicted_fields","email","move_to_inbox_reason", "action"]
                    const docDataProjection = ["display_fields","document_type","messages","modified_fields","prediction","system_date_format","br_field_config","excel_data"];
                    // Get document, document_data, fields and canvas images in parallel
                    const promiseArray = [
                        DocumentService.getDocument({"_id":this.documentId}, docProjection),
                        DocumentService.fetchDocumentData({"document_id": this.documentId}, docDataProjection),
                        FieldService.get({"document_id": this.documentId}),
                        this.loadImages()
                    ];

                    const response = await Promise.all(promiseArray);
                    const [deDocumentRecord, deDocumentDataRecords, fieldConfig] = response;
                    let deFieldRecords = fieldConfig.data.fieldsConfiguration;
                    // Combining package prediction and package fields with document fields and prediction data to create a unified dataset.
                    // This will allow us to access and analyze all relevant information for packages and documents together
                    const [deDocumentDataRecord] = deDocumentDataRecords
                    if(viewType == Constants.DOCEX.FIELD_LEVEL.PACKAGE) {
                        // Merging package data into child
                        deFieldRecords = [...deFieldRecords, ...this.packageFieldPredictionData["fieldData"]];
                        deDocumentDataRecord.prediction = [...deDocumentDataRecord.prediction, ...this.packageFieldPredictionData["prediction"]];
                    }
                    this.documentType = deDocumentRecord.document_type;
                    this.documentSubtype= deDocumentRecord.document_subtype;
                    // We are doing another promise all as we require document_type for all these calls
                    const [deActionRecords, documentConfigRecord] = await Promise.all([
                        this.getActionButtons(),
                        this.setConfiguration(deDocumentRecord),
                        this.loadUiEventScripts()
                    ])

                    this.setPropsData(deDocumentRecord);
                    this.setPageNumber()
                    let documentData = this.prepareDocumentData(deDocumentRecord, deDocumentDataRecord)

                    this.$store.commit("documentViewStore/setOcrDimension",documentData.ocr_dimension);
                    this.$store.commit("documentViewStore/setDocumentData",documentData);
                    this.$store.commit("documentViewStore/setPredictionData",documentData.prediction);
                    this.$store.commit("documentViewStore/setDocumentRecord",deDocumentRecord);

                    /**here we set document error message on store with respective docId */
                    let errorMessage = {}
                    errorMessage[deDocumentRecord._id] = documentData.messages
                    errorMessage["PackageLevelMessage"] = this.packageFieldPredictionData["messages"] || []
                    this.$store.commit("documentViewStore/setAllErrorMessages",errorMessage)
                    // this.$store.commit("documentViewStore/setPredictionData",this.documentData.prediction);

                    let fieldData = deFieldRecords;
                    fieldData = this.addTableHeadersToFieldData(fieldData)
                    this.originalFieldData = _.cloneDeep(fieldData);
                    fieldData = this.makeDocPresentTableHeaderVisible(fieldData);

                    this.$store.commit("documentViewStore/setDocumentType", this.documentType);
                    this.$store.commit("documentViewStore/setDocumentSubtype", this.documentSubtype);
                    this.$store.commit("actionButtonStore/setPropertiesActionButtons", deActionRecords);

                    this.fieldData = fieldData;
                    this.$store.commit("documentViewStore/setFieldData", this.fieldData);
                    this.$store.commit("documentViewStore/setOriginalFieldData",this.originalFieldData );
                    this.setCloneData();
                    this.docxConfig = fieldConfig.data.docxConfig || {};
                    this.$store.commit("documentViewStore/docxConfig",this.docxConfig);
                    this.updatePredictionData(documentData);
                    this.mapFieldValue();
                    this.showDocumentMessages();
                    this.assignSelectedField();

                }catch(error){
                    console.error("@DocViewer :: loadData() ", error.message)
                    console.error(error)
                }
            },
            async loadUiEventScripts(){
                    if(window['ui_scripts_loaded'] && window['ui_scripts_loaded'][this.documentType]){
                        return;
                    }
                    let ui_script = document.createElement('script');///scripts
                    ui_script.setAttribute('ui_script', "ui_script");
                    ui_script.setAttribute("type","text/javascript")
                    ui_script.setAttribute('async', "");
                    ui_script.setAttribute('src',`/api/scripts?documentType=${this.documentType}`);
                    document.head.appendChild(ui_script);
                    window['ui_scripts_loaded']={[this.documentType]:true}

            },

            assignSelectedField() {
                _.each(this.fieldPredictionData.prediction, (field) => {
                    if (field && field.field_config && field.field_config.selected) {
                        // this.selectedField = field;
                        this.$store.commit("documentViewStore/setSelectedField",field)

                        return false;
                    }
                });
            },

            async openDocument(id) {
                this.documentId = id;
                this.$store.commit("documentViewStore/documentId", this.documentId);
                // Added isLoadCanvas flag to load canvas after All data is updated in fieldPredictionData, initially set it false.
                this.$store.commit("documentViewStore/setIsLoadCanvas", false);
                await this.loadData();
                await this.loadImages()
                this.loadDebugdata()
                this.$store.commit("documentViewStore/setIsLoadCanvas", true);


            },

            dialogClose(e) {
                if (!e) {
                    this.field_search_text = "";
                }
            },
            handleKeydown(event) {
                if (event.ctrlKey && event.keyCode == 70) {
                    event.preventDefault();
                    this.showSearchBox();
                }
            },
            // Retrieving images and storing them in the store, as utilized within the context of IdpCanvas.vue.
            async loadImages() {
                try {
                    let fileURLs = await DocumentService.getFileUrl({id: this.documentId})
                    this.$store.commit("documentViewStore/setCanvasImageURLs", fileURLs);
                    this.totalPages = fileURLs && fileURLs.length;
                    this.$store.commit("documentViewStore/totalPages",this.totalPages);
                } catch (err) {
                    console.log('error in load images of doc viewer', err)
                }
            },
            async loadDebugdata() {
                await DocumentService.findDebugData({
                    doc_id: this.documentId
                },["_id","doc_id","ocr_result","masked_ocr_result","prediction", "modified_pages","modified"]).then((debugRecord) => {
                    let data = (debugRecord && debugRecord[0]) || {};
                    this.debugDataModifiedPages = new Set(data.modified_pages);
                    this.$store.commit("documentViewStore/debugDataModifiedPages",this.debugDataModifiedPages);
                    let debugData = {
                        ocr_result:  data.ocr_result,
                        modified:data.modified,
                        prediction : data.prediction || {},
                        doc_id: data.doc_id,
                        _id:data._id
                    }
                     this.$store.commit("documentViewStore/setDebugData",debugData);
                 })
            },
            async setConfiguration(documentData){
                this.customerConfiguration = await CustomerConfig.getCustConfigByDocType(documentData.document_type);
                let enableApproval = _.get(this.customerConfiguration, 'config.enable_approval', false)
                this.$store.commit("documentViewStore/isApprovalEnable",enableApproval);
                this.$store.commit("documentViewStore/customerConfiguration", this.customerConfiguration);
            },
            getDocumentConfiguration(){
                return this.customerConfiguration || {};
            },
            //To set current page number of list view
            //This is used to hide prev button on first page first document
            setPageNumber(){
                let filter = getQueryFilter();
                const tableIdentifier = filter[`idp_${this.documentType}_list`];
                this.paginationNo = _.get(tableIdentifier, "selectedPage",1)
                this.pageSize = _.get(tableIdentifier, "pageSize",15);

            },
            async init() {
                this.loading = true;
                this.isReviewerOnly = _.get(this.$store.getters.user,"is_reviewer_only");
                this.$store.commit("documentViewStore/setCurrentActionPageNumber", 0); // toload complete Canvas on refresh
                this.$store.commit("setDisplayIdpTree",false);
                this.$store.commit("setDisplayIdpNavbar",false);
                document.addEventListener("keydown", this.handleKeydown, false);
                // const documentId = this.$route.query.id;
                this.documentId = this.id;
                // Added setIsLoadCanvas flag to load canvas after All data is updated in fieldPredictionData, initially set it false.
                this.$store.commit("documentViewStore/setIsLoadCanvas", false);
                this.fieldPredictionData ={}
                this.$store.commit("documentViewStore/documentId", this.documentId);
                await this.loadData();
                this.loadDebugdata();
                this.$store.commit("documentViewStore/setIsLoadCanvas", true);
                let user = this.$store.getters.user;
                if (user.roles.includes(Constants.DOCEX.ROLES_MAP.IDP_PUBLISHER_ONLY)) {
                    this.isPublisherOnly = true;
                }
          },

         async updateTableNerData(prevValue, newValue) {
            try{
                let isAutoLearningEnabled= this.$store.getters["documentViewStore/isAutoLearningEnabled"];
                if(isAutoLearningEnabled && this.shouldTrackChanges === null){
                       let response = await this.$confirm(`Do you want to track these changes for further training?`, {
                            confirmButtonText: "Confirm",
                            cancelButtonText: "Cancel",
                        })
                        .catch(()=>{
                          this.shouldTrackChanges = false;
                          this.$store.commit("documentViewStore/shouldTrackChanges",false);

                        });
                        response && (this.shouldTrackChanges = true);
                        this.$store.commit("documentViewStore/shouldTrackChanges",true);

                }

                this.$nextTick(()=>{
                        if(!this.shouldTrackChanges)return;
                        let debugData=this.$store.getters["documentViewStore/debugData"];
                        let debugDataClone = _.cloneDeep(debugData);
                        let tableDebugData = debugDataClone.prediction.actual.find(obj=>obj.name=='table');
                        let tableHeadersDebugData = tableDebugData.content.headers;
                        const fieldToChange = tableHeadersDebugData.find(
                            header => header.predicted_key == prevValue
                        ); // description object
                        if(!fieldToChange)return;
                        debugDataClone.modified = true;
                        this.updateTableNer(tableHeadersDebugData);
                        this.updateOldTagToOther(newValue, tableHeadersDebugData);
                        const nerObj = (fieldToChange.ner || [])[0]; // ner objetc containign original and value
                        const fieldValue = fieldToChange.value; //actual value of header field "description descrition"
                        const modByCustObj = this.getTags(fieldValue, newValue);
                        nerObj["mod_by_cust"] = modByCustObj;
                        this.$store.commit("documentViewStore/setDebugData",debugDataClone);
                })

            }catch(err){
                console.log(err)
            }

            },

            updateOldTagToOther(val, headers = []) {
                const tagValue = val.toUpperCase().replace(/_/g, "-");
                const tagArr = [
                    `B-LINE-${tagValue}`,
                    `M-LINE-${tagValue}`,
                    `E-LINE-${tagValue}`,
                    `I-LINE-${tagValue}`
                ];
                headers.forEach(header => {
                    const modByCustomer = _.get(header, "ner[0].mod_by_cust",[]);
                    modByCustomer.forEach(tagValue => {
                        const tag = tagArr.find(tag =>
                            tagValue.hasOwnProperty(tag)
                        );

                        if (!tag) return;
                        let value = tagValue[tag];
                        delete tagValue[tag];
                        tagValue["O"] = value;
                    });
                });
            },

            getTags(fieldValue, changedTagValue) {
                const wordArray = fieldValue.split(" ");
                const lastIndex = wordArray.length - 1;
                const modByCusObj = wordArray.map((word, index) => {
                    const indexTagMapping = {
                        0: "B",
                        [lastIndex]: "E"
                    };
                    const tag =
                        lastIndex === 0
                            ? "B"
                            : indexTagMapping[[index]]
                            ? indexTagMapping[[index]]
                            : "M";
                    const key = `${tag}-LINE-${changedTagValue
                        .toUpperCase()
                        .replace(/_/g, "-")}`;
                    return { [key]: word };
                });
                return modByCusObj;
            },

            updateTableNer(headers) {
                const filteredHeaders = headers.filter(
                    header => !_.has(header, "ner[0]mod_by_cust")
                );
                if (filteredHeaders.length == 0) return;
                filteredHeaders.forEach(header => {
                    if(!_.has(header, 'ner[0]')){return;}
                    let nerObj = header.ner[0];
                    nerObj["mod_by_cust"] = _.cloneDeep(nerObj["original"]);
                });
            },
            registerPageChangeOnScroll(){
                let self = this
                this.$nextTick(() => {
                    $(".invoice-wrapper").on("scroll", () => {
                        let scrollOffset = $(".invoice-wrapper").height() * 0.4;
                        let div_diff = $(".invoice-wrapper").offset().top;
                        let scroll_pages_cordinates = _.map(
                            new Array(self.totalPages),
                            (value, index) => {
                                return $("#page-" + (index + 1)).offset().top - div_diff;
                            }
                        );
                        let reverse_scroll_pages_cordinates = _.reverse(
                            scroll_pages_cordinates
                        );
                        _.each(reverse_scroll_pages_cordinates, (value, index) => {
                            if (scrollOffset >= value) {
                                self.pageNumber = reverse_scroll_pages_cordinates.length - index;
                                return false;
                            }
                        });
                    });
                });
            }
        },
        beforeMount(){
	        window.documentInputComponents = [];
        },
        beforeDestroy() {
            EventBus.$off(window.documentInputComponents);
            document.removeEventListener("keydown", () => {}, false);
            EventBus.$off(this.busEvents);
            window.documentInputComponents = [];
        },
        updated(){
            console.log("Documentviewer::updated")
        },

        mounted() {
            this.registerEvents();

            if (this.$route.query.filter && JSON.parse(this.$route.query.filter).propertiesActiveTab) {

                this.$refs['properties'].activeTab = JSON.parse(this.$route.query.filter).propertiesActiveTab;
            };
            //current document index used for navigation prev/next document
            this.currentIndex = this.$route.query.document_index && parseInt(this.$route.query.document_index);
            this.totalRowCount = this.$route.query.total_row_count && parseInt(this.$route.query.total_row_count);
            this.parentDocumentId = this.$route.query.id;
            if(this.$route.query.view == Constants.DOCEX.FIELD_LEVEL.PACKAGE)
            {
                    Promise.all([
                        FieldService.getPackageFields({"document_id": this.parentDocumentId}),
                        DocumentService.fetchDocumentData({"document_id": this.parentDocumentId})
                    ])
                    .then(async (response) => {
                        this.packageFieldPredictionData["fieldData"]  = response[0].data
                        this.packageFieldPredictionData["prediction"] = response[1][0]['prediction'];
                        this.packageFieldPredictionData["messages"] = response[1][0]['messages'];
                    })
                    .catch((err) => {console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ",err)})
                    .finally(() => {
                    });
            }

        }
    };
    </script>

    <style lang="scss">
    @import "../_idpVariables";
    @import "../_idpGlobal";




    .debugger-button{
        position:absolute;
        top:10px;
        z-index: 999;
        right:40px
    }
    .visualisation-button{
        position:absolute;
        z-index: 999;
        right:100px
    }

    button.el-button.visualisation-button.el-button--text {
        font-size: 22px;
        line-height: 0.2;
        color: rgb(113, 128, 150);

        :hover{
            color: var(--brand-03) !important;
        }
    }

    .full-width-field-class {
        .block-container {
            display: block !important;

            .block-50 {
                width: 100%;
                margin-bottom: var(--space-base);
                padding-right: 0;
            }

            .block-50:last-child {
                margin-bottom: 0 !important;
            }
        }
    }

    .training-mode {
        background: var(--red-05);
        color: #ffffff;
        border-radius: var(--radius-round);
        border:0;
        position: absolute;
        right: var(--space-xl);
        top: .3rem;
            .vue-js-switch .v-switch-core[data-v-25adc6c0] {
                // box-shadow: rgb(0 0 0 22%) 0px 0px 6px 0px inset !important;
            }
    }
      .next-pre-btn {
            margin-left: 0;
            margin-right: auto;
            text-align: center;
            padding: 5px 0px 5px 0px;
            position: absolute;
            // left: 50%;
            z-index: 999;
            width: 100%;
            .el-button {
              padding: 0.3rem;
              background:transparent !important;
              border-radius: 3px;
              border: 0;
              color: var(--dark-04);
              font-size: 1.8rem;
                margin: 0;
                padding: 0;
            }
          }

    // .divide-width-field-class {
    //     .block-container {
    //         display: inline-block;
    //         width: 33.33%;
    //     }
    //      .block-50 {
    //          width: 100%;
    //          padding-right: 0;
    //      }
    // }
.invoice-container{
    .invoice-wrapper {
        overflow: auto;
        height: 100%;
        margin-top: 0;
        #page-1.canvas_cs {
            padding-top: 0;
        }
    }
}

    .invoice-wrapper::-webkit-scrollbar {
        height: 10px !important;
        border-radius: 100px !important;
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3) important;
    }

    .invoice-actions {
        position: absolute;
        z-index: 999;
        margin-top: 0;
    }

    .document-container {
        .document-visualisation-container{
           margin-left: -490px;
           max-width: 2360px;
           width: 2360px;

        }

        .splitpanes.default-theme .splitpanes__splitter:after,
        .splitpanes.default-theme .splitpanes__splitter:before {
            border: solid 2px !important;
            border-radius: 10px !important;
            cursor: pointer !important;
            z-index: 1 !important;
            color: #A0AEC0 !important;
        }

        height: 100%;
        margin-top: 2.457rem;

        .default-theme {
            height: 100%;
            // padding-bottom: 1.5rem;
            box-sizing: border-box;

            .splitpanes--vertical>.splitpanes__splitter {
                background: var(--dark-06);
                width: 0.3125rem;
            }

            .splitpanes__splitter {
                background: var(--dark-06);
                // height: 0.4125rem;
            }

            .splitpanes--horizontal>.splitpanes__splitter {
                background: var(--dark-06);
                height: 0.4125rem;
            }

            .default-theme.splitpanes--vertical>.splitpanes__splitter,
            .default-theme .splitpanes--vertical>.splitpanes__splitter {
                background: var(--dark-06);
                width: 0.4125rem;
            }

            .default-theme.splitpanes--horizontal>.splitpanes__splitter,
            .default-theme .splitpanes--horizontal>.splitpanes__splitter {
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

            .canvas-container {
                background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAAAJiS0dEAP+Hj8y/AAAAB3RJTUUH5AsJCiMCFukeNAAAAAFvck5UAc+id5oAAABYSURBVGje7dgxCgAgDAPAKK7+/7n6Ax1EdLiuJXB0CbSkZzljvU7JWb7m8QAAAAAAAAC0232/yz+/AAAAAAAAAEC73ff+AwAAAAAAAN8D/AcAAAAAAAAAJtXOCJJpFhjdAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTExLTA5VDEwOjMxOjA2KzAwOjAw650KQQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0xMS0wOVQxMDozMTowNiswMDowMJrAsv0AAAAASUVORK5CYII=");
                background-repeat: repeat;
                // overflow: auto;
                position: relative;
                box-sizing: border-box;

                .language-translation-confirmation-box {
                    position: absolute;
                    top: 10.2rem;
                    left: 5rem;
                    color: white;
                    width: 28rem;
                    z-index: 10000;
                    padding: var(--space-base);
                    border-radius: var(--radius-base);
                    background: var(--dark-04);
                    border-radius: var(--radius-base);
                    text-align: left;

                    .language-translation-message {
                        text-align: left;
                        padding: 0;
                        margin: 0;
                        padding-right: 4rem;
                        position: relative;
                    }

                    .language-translation-message:before {
                        content: '';
                        display: block;
                        width: 0;
                        height: 0;
                        position: absolute;
                        border-top: 8px solid transparent;
                        border-bottom: 8px solid transparent;
                        border-right: 8px solid #718096;
                        left: -20px;
                        top: 32px;
                    }

                    .close-btn {
                        border: 0;
                        color: var(--white);
                        padding: 0;
                        font-size: 1.4rem;
                        position: absolute;
                        right: 1rem;
                        top: 1rem;
                    }

                    .input-search-text {
                        margin-left: 0;
                        margin-top: 0;
                        height: 100%;

                        input {
                            height: 100%;
                            border-radius: var(--radius-sm);
                            padding: 0 var(--space-base);
                        }
                    }

                    .language-translation-translate-btn {
                        font-size: 1rem;
                        color: var(--dark-01);
                        padding: .7rem 1.2rem;
                        margin-top: var(--space-lg);
                        background: var(--white);
                        border: 0;

                        &:hover {
                            color: black;
                            background: var(--dark-10);
                        }
                    }
                }

                .search-doc {
                    position: sticky;
                    left: 7.5rem;
                    top: 1em;
                    z-index: 10000;
                    padding: var(--space-xs);
                    border-radius: var(--radius-base);
                    background: var(--dark-04);
                    border-radius: var(--radius-base);
                    display: inline-flex;

                    .input-search-text {
                        margin-left: 0;
                        margin-top: 0;
                        height: 100%;

                        input {
                            height: 100%;
                            border-radius: var(--radius-sm);
                            padding: 0 var(--space-base);
                        }
                    }

                    .search-actions {
                        width: 100%;
                        text-align: center;
                        padding: var(--space-xs) var(--space-sm);
                        ;

                        .el-button {
                            width: 16px;
                            height: 22px;
                            background: transparent;
                            border: 0;
                            color: var(--white);
                            padding: 0;
                            font-size: 1.4rem;
                            margin: 0;
                        }
                    }
                }

                //  Search doc

                .input-search-text {
                    border-radius: 0;
                    margin-left: var(--space-sm);
                    margin-top: 2px;
                    width: 180px;
                    font-size: var(--font-sm);

                    input {
                        border-radius: 0;
                        height: 22px;
                    }

                    input::placeholder {
                        font-size: var(--font-sm);
                        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                        font-weight: normal;
                    }

                    .el-input__prefix {
                        top: -2px;
                        font-size: var(--font-md);
                    }
                }

                .el-input__inner {
                    height: var(--space-xl);
                    line-height: 38px;
                    border: 0;
                    color: var(--dark-04);
                    font-size: var(--font-sm);
                    text-align: left;
                    padding-left: var(--space-sm);
                    background: var(--brand-09);

                    &::placeholder {
                        font-weight: normal;
                        color: var(--dark-05);
                        opacity: 1;
                        font-size: var(--font-base);
                    }
                }
            }

            // end searhbar
            .canvas_cs {
                margin: 0 auto;
            }

            .konvajs-content {
                box-shadow: 0px 0px 2px 2px var(--dark-06);
            }

            .invoice-container {
                // margin-top: -325px;
                position: relative;
                height: 100%;
                // overflow: auto;
                padding-top: 2.7rem;
                padding-bottom:0rem;
            }

            .back-button {
                border-radius: var(--space-xs);
                transform: rotate(35deg);
                border: 0px solid  var(--dark-04);
                width: 32x;
                height: 32px;
                border-radius: 100px;
                z-index: 999;
                margin-left: 1.4rem;
                margin-top: 0;
                top: 14px;
                background: transparent;
                font-size: 1.8rem;
                display: block;
                color: var(--dark-04);
                padding: var(--space-xs);

            }

            .invoice-toolbar-wrap {
                background: var(--dark-05);
                border-radius: var(--space-xs);
                // position: sticky;
                top: 5.2rem;
                z-index: 999;
                text-align: center;
                display: block;
                width: 21px;
                margin-left: var(--space-lg);
                margin-top: 0;

                .toolbar {
                    display: inline-grid;
                    background: var(--dark-05);
                    border-radius: var(--space-xs);
                    padding: var(--space-xxs);
                    width: 30px;

                    i.active {
                        color: rgba(90, 103, 216, 1);
                    }

                    .toolbar-button {
                        width: 30px;
                    }

                    .el-button {
                        background: transparent;
                        border: 0;
                        padding: var(--space-xs);
                        color: var(--white);
                        font-size: 18px;
                        margin-left: var(----space-xxs);
                    }
                }

                // searchbar
                .arrow_box {
                    position: relative;
                    background: #88b7d5;
                    border: 4px solid #c2e1f5;
                }

                .arrow_box:after,
                .arrow_box:before {
                    top: 38px;
                    left: 50%;
                    border: solid transparent;
                    content: " ";
                    height: 0;
                    width: 0;
                    position: absolute;
                    pointer-events: none;
                }

                .arrow_box:before {
                    border-color: transparent;
                    border-top-color: rgba(0, 0, 0, 0.7);
                    border-width: 12px;
                    margin-left: -31px;
                }
            }

            .document-navigation {
                background: var(--dark-05);
                border-radius: var(--space-xs);
                // position: sticky;
                top: 19.2rem;
                z-index: 999;
                text-align: center;
                display: block;
                margin-left: var(--space-lg);
                margin-top: var(--space-lg);
                overflow: hidden;
                padding: var(--space-xxs);
                width: 30px;

                .toolbar {
                    background: var(--dark-05);
                    border-radius: var(--space-xs);

                    p {
                        color: var(--white);
                        font-size: 10px;
                        margin: 0;
                    }

                    .el-button {
                        background: transparent;
                        border: 0;
                        padding: var(--space-xs);
                        color: var(--white);
                        font-size: 18px;
                        margin-left: var(----space-xxs);
                        padding: var(--space-xs) 0;
                    }

                    .el-input {
                        width: 26px;

                        .el-input__inner {
                            padding: 0;
                            margin: 0;
                            text-align: center;
                            border-radius: 1px;
                        }
                    }
                }
            }
        }

        ::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px var(--dark-06);
            background-color: var(--white);
        }

        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
            background-color: var(--white);
        }

        ::-webkit-scrollbar-thumb {
            background-color: var(--dark-05);
        }

        .vue-js-switch{
             z-index:1000
        }
    }

    .filed-container {
        background: var(--dark-08) !important;
    }

    .po-details-gragable-component{
        z-index: 1100 !important;
        .draggable-handle{
            padding-bottom: 0px;
            background: #f9f9f9;
            .button{
                cursor:pointer;
                color: var(--dark-04);
                font-size: 24px;
            }
        }
        .title{
            font-size: 1.2rem;
            margin-left: 10px;
            margin-top: 6px;
        }
        .draggable-handle{
          background: var(--dark-09) !important;
        }
        .content{
          border-top: 1px solid #e0d4d4;
          background: white;
          border-radius: 0px 0px 5px 5px;
        }

    }
        // .po-details-gragable-component div:last-child {
        //    right:-16px !important;
        // }


    </style>
