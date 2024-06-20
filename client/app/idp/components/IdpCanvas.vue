<template>
    <div class="canvas_cs" :id="'page_number_' + pageNumber" :style="{ width: canvasOuterWidth, height: canvasOuterHeight }">
        <div class="loading-container" v-if="!dataLoaded">
            <div class="canvas-loading">
                <div v-loading="!dataLoaded"></div>
            </div>
        </div>

        <div v-if="dataLoaded">
            <div v-bind:key="i" v-for="(field, i) in predicted_rectangles">
                <idp-validation-message :validationMsgs="field['validationMsgs']" :style="{
                top: field.validation_error.top,
                left: field.validation_error.left,
                position: 'absolute',
                'z-index': 500,
              }" v-if="field.validation_error"></idp-validation-message>
            </div>
            <div v-if="dialogVisible && isDebuggerOn && activeOcrWordTag" class="modal_div update-modal-wrap ocr-tag-container" :style="{ top: dialogTop, left: dialogLeft, width:dialogWidth }">
                <div class="message-pointer ocr-tag-pointer"></div>
                <div class="modal-header ocr-tag-content">{{activeOcrWordTag}}</div>
            </div>
            <div v-if="dialogVisible && !isDebuggerOn" class="modal_div update-modal-wrap" id="change-field-modal" :style="{ top: dialogTop, left: dialogLeft, width:dialogWidth }">
                <div class="message-pointer"></div>
                <div class="modal-header">
                    <div class="header-action-container">
                        <el-button-group>
                            <el-button cid="idp-canvas-field-modal-delete" class="header-actions" size="mini" icon="mdi mdi-delete" @click="deleteBBox" circle :disabled="isDocumentReadOnly || isMasked"></el-button>
                            <el-button cid="idp-canvas-field-modal-close" class="header-actions" size="mini" icon="mdi mdi-close" @click="hideFieldModal" circle></el-button>
                        </el-button-group>
                    </div>
                </div>
                <div class="confirm-modal" v-if="visibleConfirmationContent">
                    <h5>Confirm Field Change?</h5>
                    <span class="word-break-label" v-if="
                  dialogSelectedField && dialogSelectedField.name == 'new_field'
                ">This field will be replaced by {{ modalClickedData.label }}</span>
                    <span class="word-break-label" v-else>{{ dialogSelectedField.field_config.label }} will be replaced by
                        {{ modalClickedData.label }}</span>

                    <div class="buttons-container">
                        <el-button cid="idp-canvas-field-modal-confirm" class="kp-btn-form-primary" type="primary" size="mini" @click="changeFieldData">Confirm</el-button>
                        <el-button cid="idp-canvas-field-modal-cancel" class="kp-btn-form-primary" size="mini" type="primary" @click="closeConfirmation">Cancel</el-button>
                    </div>
                </div>
                <div id="modal-box" v-if="!visibleConfirmationContent" class="input_inner">
                    <v-select cid="idp-canvas-modal-select-field" @input="handleModalClick" :disabled="isDocumentReadOnly || isMasked" :options="fieldInputFilter" :clearable="false" v-if="!isTableSelected" placeholder="Search field"
                        :value="dialogSelectedField &&
                        dialogSelectedField['field_config'] &&
                        dialogSelectedField['field_config']['label']
                "></v-select>
                    <div class="table_modal_header" v-else>
                        {{ dialogSelectedField["field_config"]["label"] }}
                    </div>
                    <el-input cid="idp-canvas-modal-select-value" class="field-input" :disabled="isDocumentReadOnly" v-if="
                  dialogSelectedField && dialogSelectedField.name == 'new_field'
                " v-model="new_val" @input="onInput">
                    </el-input>
                    <component
                        v-else-if="dialogSelectedField && dialogSelectedField['field_config'] && selectedField"
                        :config="componentConfig"
                        :isDocumentReadOnly="isDocumentReadOnly"
                        :key="dialogSelectedField['field_config'].name"
                        :props="dialogSelectedField"
                        :isTable="selectedField.is_table"
                        :tableName="selectedField.table_name"
                        :isDialog="true"
                        v-bind:is="componentName">
                    </component>
                </div>
            </div>

            <v-stage ref="stage" :config="stageSize" @dblclick="handleOcrDoubleClick" @click="bboxStageMouseClick" @mouseup="handleMouseUp" @mousemove="HandleMouseMove" @mousedown="handleStageMouseDown">
                <v-layer ref="layer">
                    <v-image :config="configBackground" />

                    <v-rect
                        @mouseover="(e) => {mouseover(e, item.text, item.x, item.y);}"
                        @mouseout="(e) => {mouseout(e, item.text, item.x, item.y);}"
                        :config="item"
                        v-bind:key="'A'+key"
                        v-for="(item, key) in wordBGRectangles"
                    />
                    <v-rect
                        v-bind:key="'G'+key"
                        @mouseover="(e) => { mouseover(e, primaryLanguageEnabled ? item.translatedText : item.primaryText, item.x, item.y);}"
                        @mouseout="(e) => {mouseout(e, primaryLanguageEnabled ? item.translatedText : item.primaryText, item.x, item.y);}"
                        :config="item"
                        v-for="(item, key) in allTransperentRectangles"
                    />

                    <v-rect
                        v-bind:key="'B'+key"
                        :config="item"
                        @transformend="handleTransformEnd"
                        v-for="(item, key) in predicted_rectangles"
                    />
                    <v-rect v-bind:key="'C'+key" v-for="(item, key) in searchRectangleList" :config="item" />
                    <v-text v-bind:key="'D'+key" v-for="(item, key) in debugger_text" :config="item" />
                    <v-rect v-bind:key="'E'+key" v-for="(item, key) in debugger_rectangles" :config="item" />
                    <v-line v-bind:key="'F'+key" v-for="(item, key) in predicted_lines" :config="item" />

                 <v-text v-bind:key="'F'+key" @mouseover="
                  (e) => {
                    mouseover(e, item.text, item.x, item.y);
                  }
                " @mouseout="
                  (e) => {
                    mouseout(e, item.text, item.x, item.y);
                  }
                " v-for="(item, key) in wordTextRectangles" :config="item" />

                    <v-rect v-if="showTooltip" :config="tooltipBGConfig" ref="tooltip_rect" />
                    <v-text v-if="showTooltip" :config="tooltipTextConfig" ref="tooltip_text" />

                    <v-rect ref="drawn_rect" :config="drawn_rect" @transformend="handleTransformEnd" />

                    <v-transformer :config="transformerConfig" ref="transformer" />
                </v-layer>
            </v-stage>
        </div>
    </div>
    </template>

    <script>
    import DocumentService from "@/doc-ex/services/DocumentService";
    import IdpDocumentService from "@/idp/services/DocumentService";
    import EventBus from "@/EventBus";
    import DatePicker from "@/idp/components/DatePicker.vue";
    import Input from "@/idp/components/Input.vue";
    import Checkbox from "@/idp/components/CheckBox.vue";
    import lodash from "lodash";
    import IdpValidationMessage from "@/idp/components/IdpValidationMessage.vue";
    import { scroller } from "vue-scrollto/src/scrollTo";
    import moment from "moment";
    import { forEach } from "underscore";
    import $ from 'jquery';
    import Constants from "@/resources/Constants";

    const scrollTo = scroller();

    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;
    const canvasImageDifference = 8;

    var options = {
        container: ".invoice-wrapper",
        easing: "ease-in",
        offset: -150,
        force: true,
        cancelable: true,
        x: true,
        y: true,
    };

    export default {
        name: "IdpCanvas",
        props: [
            "showTranslatedText",
            "translatedWords",
            "isDocumentReadOnly",
            "loading",
            "isTableSelected",
            "pageNumber",
            "searchText",
            "dateFormat",
            // "selectedField",
            // "debugDataModifiedPages",
            // "componentConfig",
            // "debugData",
            // "shouldTrackChanges",
            // "isMultiTable"
        ],

        components: {
            DatePicker,
            Input,
            Checkbox,
            IdpValidationMessage,
        },
        watch: {
            showTranslatedText: {
                handler: function (newVal, oldVal) {
                    console.log("watcher:idpCanvas:showTranslatedText")
                    this.createWordBGBoxes();
                },
                immediate: true,
                deep: true,
            },
            // translatedWords: {
            //     handler: function (newVal, oldVal) {
            //         // this.createWordBGBoxes();
            //         console.log("handler:translatedWords",newVal)

            //         // this.createAllWordRectangles();
            //     },
            //     immediate: true,
            //     deep: true,
            // },
            isDebuggerOn: {
                handler: function (newVal, oldVal) {
                    console.log("watcher:idpCanvas:isDebuggerOn")
                    if (newVal) {
                        this.predicted_rectangles = [];
                        this.transformerNode && this.transformerNode.detach();
                        this.dialogVisible = false;
                        this.createDebuggingBBoxes();
                        this.createDebuggingText();
                    } else {
                        this.debugger_rectangles = [];
                        this.debugger_text = [];
                        this.createBoundingBoxes();
                    }
                },
            },
            isDocumentReadOnly: {
                handler: function (newVal, oldval) {
                    console.log("watcher:idpCanvas:isDocumentReadOnly")
                    if (newVal) {
                        this.stageSize.listening = false;
                    }
                    else{
                        this.stageSize.listening=true
                        }

                },
                immediate: true,
                deep: true,
            },
            /*
                this watcher is used to search text on image
                */
            searchText: {
                handler: function (oldValue, newValue) {
                    console.log("watcher:idpCanvas:searchText")
                    const searchRectangles = [];
                    lodash.each(this.getOcrPageData(), (ocrResult) => {
                        if (
                            this.searchText &&
                            ocrResult[4]
                            .toLowerCase()
                            .includes(this.searchText.toLowerCase().trim())
                        ) {
                            this.drawSearchedBBox(searchRectangles, ocrResult);
                        }
                    });

                    //this.setActiveItem(searchRectangles[0]);
                    this.searchRectangleList = searchRectangles;
                },
            },
        },
        computed: {
        isMultiTable(){
            return this.$store.getters["documentViewStore/isMultiTable"];
        },
        docTypeConfig(){
            return this.$store.getters["documentViewStore/customerConfiguration"];
        },
        tableIndexNameMap(){
            return  this.$store.getters["documentViewStore/tableIndexNameMap"];
        },
        selectedField(){
            return  this.$store.getters["documentViewStore/selectedField"];
        },
        fieldPredictionData(){
            return this.$store.getters["documentViewStore/fieldPredictionData"];
        },
        debugDataModifiedPages(){
            return this.$store.getters["documentViewStore/debugDataModifiedPages"];
        },
        fieldData(){
            return this.$store.getters["documentViewStore/fieldData"];
        },
        debugData(){
            return this.$store.getters["documentViewStore/debugData"];
        },
        totalPages(){
            return this.$store.getters["documentViewStore/totalPages"];
        },
        isDebuggerOn(){
            return this.$store.getters["documentViewStore/isDebuggerOn"];
        },
        componentConfig(){
            return this.$store.getters["documentViewStore/docxConfig"];
        },
         isAutoLearningEnabled(){
            return this.$store.getters["documentViewStore/isAutoLearningEnabled"];

        },
        shouldTrackChanges(){
            return this.$store.getters["documentViewStore/shouldTrackChanges"];

        },
            // documentData(){
            //    return this.$store.getters["documentViewStore/fieldPredictionData"];
            // },
            isMasked(){
                console.log("computed:idpCanvas:isMasked");
                return !this.canSeePIIData() && lodash.get(this.dialogSelectedField, 'field_config.is_masked')
            },
            dialogWidth(){
               console.log("computed:idpCanvas:dialogWidth")
               return Constants.DOCEX.COMPONENT_REQUIRE_FULL_SPACE.includes(lodash.get(this.dialogSelectedField, 'field_config.type')) ? '265px' : '200px';
            },
            componentName(){
               console.log("computed:idpCanvas:componentName")
               return Constants.DOCEX.FIELD_COMPONENT_MAPPING[this.dialogSelectedField['field_config']['type']];
            },

            fieldInputFilter() {
                console.log("computed:idpCanvas:fieldInputFilter")
                if (this.field_search_text) {
                    return this.computedFieldData.filter((field) =>
                        field.label
                        .toLowerCase()
                        .includes(this.field_search_text.toLowerCase())
                    );
                }
                return this.computedFieldData;
            },
            dialogSelectedField() {
                console.log("computed:idpCanvas:dialogSelectedField")
                return this.selectedField;
            },
            computedFieldData() {
                {
                    console.log("computed:idpCanvas:computedFieldData")
                    let fieldData = lodash.cloneDeep(this.fieldData);
                    let isDateFieldSelected = lodash.get(this.dialogSelectedField, "field_config.type") == "date"

                    return lodash.filter(fieldData,(field)=> {
                        let condition = field.selected && field.field_type =="header" && !field.is_masked
                        return isDateFieldSelected ? condition && (field.type == "date") : condition
                    });
                }
            },
        },
        data() {
            return {
                activeOcrWordTag:"",
                primaryLanguageEnabled: true,
                showTooltip: false,
                allTransperentRectangles: [],
                tooltipTextConfig: {
                    text: "",
                    x: 0,
                    y: 0,
                    fill: "black",
                    fontSize: 14,
                    opacity: 1,
                },
                tooltipBGConfig: {
                    x: 0,
                    y: 0,
                    width: 120,
                    height: 20,
                    fill: "rgba(255,255,255,1)",
                    stroke: "rgba(0, 104,139, 1)",
                    shadowBlur: 2,
                    cornerRadius: 6,
                    strokeWidth: 0.5,
                    draggable: false,
                },
                wordBGRectangles: [],
                wordTextRectangles: [],
                dataLoaded: false,
                field_search_text: "",
                patch: true,
                new_val: "",
                prediction: "",
                preservedFieldValue: null,
                visibleConfirmationContent: false,
                searchRectangleList: [],
                modalClickedData: "",
                posStart: "",
                dialogTop: "",
                dialogLeft: "",
                errorDialogTop: "",
                errorDialogLeft: "",
                dialogVisible: false,
                canvasOuterHeight: "",
                canvasOuterWidth: "",
                posNow: "",
                mode: "",
                stage: "",
                transformerNode: "",
                zoomX: 1,
                zoomY: 1,
                stageSize: {},
                scaleX: "",
                scaleY: "",
                transformerConfig: {
                    rotateEnabled: false,
                    anchorSize: 4,
                    borderStroke: "green",
                    borderDash: [3, 3],
                },
                predicted_rectangles: [],
                predicted_lines: [],
                debugger_rectangles: [],
                debugger_text: [],
                selected_ocr_box: null,
                selectedShapeName: "",
                drawn_rect: {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                    fill: "rgba(180, 255, 205,0.3)",
                    stroke: "rgba(0, 93, 166, 1)",
                    strokeWidth: 0.5,
                },
                configBackground: {},
                selectedFieldChangedEventName:""
            };
        },

        methods: {
            handleSelectedFieldChanged(selectedField) {
                    if (selectedField && selectedField.name == "new_field" && selectedField.bounds) {
                        this.new_val = selectedField.value;
                        return;
                    }
                    this.selectedShapeName =
                    selectedField && selectedField.field_config && selectedField.field_config.name;
                    // this.removeDrawnBox(); // as it is updating this.drawn_rect commented this function call
                    //for polygon type, we have bounds in 'segments' key
                    console.log("watcher:idpCanvas:selectedField before ", selectedField.bounds)
                    selectedField.bounds = selectedField.segments || selectedField.bounds;
                    console.log("watcher:idpCanvas:selectedField after ",  selectedField.bounds)

                    if (lodash.isEmpty(selectedField.bounds)) {
                        this.dialogVisible = false;
                    } else {
                        this.$nextTick(() => {
                            if(selectedField.field_config.type == 'checkbox'){
                                this.handleCheckBox(selectedField);
                            }
                            else{
                                this.updateTransformer();
                            }

                            setTimeout(() => {
                                scrollTo(`#change-field-modal`,200, options);
                            },0);
                        });
                    }
            },
            handleCheckBox(value){
                   let {
                    scaleX,
                    scaleY
                } =  this.ocrScales;;
                let x = value.bounds[0] * scaleX - canvasImageDifference / 2;
                let y = value.bounds[1] * scaleY - canvasImageDifference / 2;
                let width =
                    (value.bounds[2] - value.bounds[0]) * scaleX +
                    canvasImageDifference;
                let height =
                    (value.bounds[3] - value.bounds[1]) * scaleY +
                    canvasImageDifference;
                      this.dialogTop = (y + height) * this.zoomY + 15 + "px";
                    this.dialogLeft = x * this.zoomX + "px";
                    this.dialogVisible = true;
            },
            /*
                this method calls the defination of selected choice from toolbar
                from the document view page.
                */
            onInput() {
                this.dialogSelectedField.value = this.new_val;
                this.updateSelectedField(this.dialogSelectedField);
            },

            mouseover(event, text, x, y) {
                if (!event) {
                    return;
                }
                this.tooltipTextConfig["x"] = x + 8;
                this.tooltipTextConfig["y"] = y - 20 + 4;
                this.tooltipTextConfig["text"] = text;

                const width = ("" + text).length * 9;
                this.tooltipBGConfig["width"] = width > 60 ? width : 60;
                this.tooltipBGConfig["x"] = x;
                this.tooltipBGConfig["y"] = y - 20;
                this.tooltipText = text;
                if (text && ("" + text).trim()) {
                    this.showTooltip = true;
                }
            },

            mouseout() {
                this.showTooltip = false;
            },

            handleToolbarClick(click_id) {
                let click_type = {
                    zoomIn: this.zoomIn,
                    zoomOut: this.zoomOut,
                    expand: this.expand,
                    delete: this.deleteBBox,
                };
                click_type[click_id]();
            },
            /*
                this method is used to pass dialog box selected field data for field change
                and it also use to display popover of confirmation of field change.
                */
            handleModalClick(data) {
                if (
                    lodash.get(this.dialogSelectedField, "field_config.name") ==
                    lodash.get(data, "name")
                ) {
                    return;
                }
                this.visibleConfirmationContent = true;
                this.modalClickedData = data;
                if(!lodash.has(this.$refs, 'fieldDropDown.visible')){return;}
                this.$refs.fieldDropDown.visible = false; // to hide the select dropdown manually
            },
            /*
                this method change the bounding box and data of selected field
                with the field to be changed.
                */
           async changeFieldData() {
                // let documentData = this.$store.getters["documentViewStore/fieldPredictionData"];
                let predictionCloned = lodash.cloneDeep(this.fieldPredictionData.prediction)
                let updatedField = lodash.find(
                    predictionCloned,
                    (field) => {
                        return (
                            lodash.get(field, "field_config.name") ==
                            lodash.get(this.modalClickedData, "name")
                        );
                    }
                );
                //if updatedField is not present then close confirmation box previously it is getting stuck on UI.
                if(!updatedField) {
                    this.closeConfirmation();
                    return;
                }
                let selectedField = lodash.cloneDeep(this.selectedField);
                if (lodash.get(selectedField, "name") !== "new_field") {
                    let currentField = lodash.find(
                        predictionCloned,
                        (field) => {
                            return (
                                lodash.get(field, "field_config.name") ==
                                lodash.get(selectedField, "field_config.name")
                            );
                        }
                    );
                    currentField.bounds = [];
                    currentField.value = "";
                }

                updatedField.bounds = selectedField.bounds;
                //if field getting updated is date type
                if (lodash.get(updatedField, "field_config.type") == "date") {
                    if (lodash.get(selectedField, "field_config.type") == "date") {
                        updatedField.value = selectedField.value;
                    } else {
                        this.formatDate(updatedField, selectedField["value"]);
                    }
                } else {
                    updatedField.value = selectedField.value;
                }
                // updatedField.value = selectedField.value
                updatedField.page_number = selectedField.page_number;
                let rect = (selectedField.name == 'new_field') ? this.getReactngleDimensions(updatedField) : this.predicted_rectangles.find((r) => r.name === selectedField.name);
                const bbox =  this.getOcrBoxes(rect)
                await this.updateDebugData(bbox, updatedField)
                this.$store.commit("documentViewStore/setIsLoadCanvas", false);
                this.$store.commit("documentViewStore/setCurrentActionPageNumber", this.pageNumber);
                this.$store.commit("documentViewStore/setPredictionData",predictionCloned);
                // this.$store.commit("documentViewStore/setFieldPredictionData",this.fieldPredictionData);
                this.updateSelectedField(updatedField);
                this.visibleConfirmationContent = false;

            },

            getReactngleDimensions(field){
                 let {
                        scaleX,
                        scaleY
                    } =  this.ocrScales;;
                 let rect = {
                        x: field.bounds[0] * scaleX - canvasImageDifference / 2,
                        y: field.bounds[1] * scaleY - canvasImageDifference / 2,
                        width: (field.bounds[2] - field.bounds[0]) * scaleX + canvasImageDifference,
                        height: (field.bounds[3] - field.bounds[1]) * scaleY + canvasImageDifference
                  }
                return rect;
            },


            formatDate(updatedField, value) {
                // let documentData = this.$store.getters["documentViewStore/fieldPredictionData"];
                let originalValue= (value && moment(value.replace(/\s/g,'')).isValid() && moment(value.replace(/\s/g,'')).format("MM-DD-YYYY")) || value
                updatedField['original_value'] = originalValue
                const expectedDateFormats = lodash.get(lodash.find(this.fieldPredictionData.prediction, {
                    'name': 'expected_date_formats'
                }), 'value', null);
                const formattedFieldValue = value ? value.replace(/(\s+)|(th)/g, "") : value;
                const isValidFormat = moment(formattedFieldValue, expectedDateFormats, true).isValid()
                const dateValue = isValidFormat ? moment(formattedFieldValue, expectedDateFormats, true) : moment(formattedFieldValue)
                // const systemDateFormat = this.fieldPredictionData.system_date_format ? this.fieldPredictionData.system_date_format : "";
                updatedField['value'] = dateValue._isValid ? dateValue.format("MM-DD-YYYY") : formattedFieldValue

            },

            /*
                this method is use to remove the drawn rectangle from canvas once we clicked outside or set field for it
             */
            removeDrawnBox() {
                this.drawn_rect = {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                    fill: "rgba(180, 255, 205,0.3)",
                    stroke: "rgba(0, 93, 166, 1)",
                    strokeWidth: 0.5,
                };

                this.transformerNode && this.transformerNode.detach();
            },
            handleMoveDialogZoom(rect) {
                this.visiblePopover = false;
                if (rect) {
                    this.dialogTop = (rect.y + rect.height) * this.zoomY + 15 + "px";
                    this.dialogLeft = rect.x * this.zoomX + "px";
                    this.dialogVisible = true;
                }
            },
            /*
                this method push dialog box on the selected rectangle on image
                */
            moveDialogBox(node) {
                this.visiblePopover = false;
                if(_.has(node, 'attrs.points')){
                    const [x, y] = node.attrs.points;
                    const height = node.height();
                    this.dialogTop = (y + height) * this.zoomY + 15 + "px";
                    this.dialogLeft = x * this.zoomX + "px";
                    this.dialogVisible = true;
                }
                else if(node && node.y() && node.height()) {
                    this.dialogTop = (node.y() + node.height()) * this.zoomY + 15 + "px";
                    this.dialogLeft = node.x() * this.zoomX + "px";
                    this.dialogVisible = true;
                }
            },
            handleNextSearch() {
                const currentActiveIndex = lodash.findIndex(this.searchRectangleList, {
                    active: true,
                });
                this.removeActiveItem(this.searchRectangleList[currentActiveIndex]);
                this.setActiveItem(this.searchRectangleList[currentActiveIndex + 1]);
                // this.$nextTick(() => {
                //         scrollTo(`#change-field-modal`, 10, options);
                //  });

            },
            handlePreviousSearch() {
                const currentActiveIndex = lodash.findIndex(this.searchRectangleList, {
                    active: true,
                });
                this.removeActiveItem(this.searchRectangleList[currentActiveIndex]);
                let activeIndex = currentActiveIndex - 1
                if(activeIndex<0) {
                    activeIndex = this.searchRectangleList.length-1
                }
                this.setActiveItem(this.searchRectangleList[activeIndex]);
            },
            setActiveItem(searchRect) {
                if (!lodash.isObject(searchRect)) {
                    return;
                }
                searchRect.active = true;
                searchRect.dash = [0, 0];
                const heightFromTop = this.configBackground.image.height * (this.pageNumber-1)
                searchRect.strokeWidth = 2;
                setTimeout(()=>{
                    const wrapper = $('.invoice-wrapper')
                    wrapper[0].scrollTo({
                        top: heightFromTop+searchRect.y,
                        left: searchRect.x,
                        behavior: 'smooth'
                    })
                }, 0);
            },
            removeActiveItem(searchRect) {
                if (!lodash.isObject(searchRect)) {
                    return;
                }
                searchRect.active = false;
                searchRect.dash = [1, 1];
                searchRect.strokeWidth = 0.5;
            },
            setValidtionErrorPosition(rect) {
                rect.validation_error = {};
                rect.validation_error.top =
                    (rect.y + rect.height) * this.zoomY - 17 + "px";
                rect.validation_error.left =
                    (rect.x + rect.width) * this.zoomX + 17 + "px";
            },

            closeConfirmation() {
                this.visibleConfirmationContent = false;
            },
            /*
                this method is used to zoom in the current stage size of image
                */
            zoomIn() {
                this.zoomX += 0.25;
                this.zoomY += 0.25;
                this.adjustStageSize();
                this.$refs.stage.$forceUpdate();
            },
            /*
                this method is used to zoom out the current stage size of image
                */
            zoomOut() {
                this.zoomX -= 0.25;
                this.zoomY -= 0.25;
                this.adjustStageSize();
                this.$refs.stage.$forceUpdate();
            },
            /*
                this method is used to set stage size to default
                */
            expand() {
                this.zoomX = 1;
                this.zoomY = 1;
                this.adjustStageSize();
                this.$refs.stage.$forceUpdate();
            },

            /*
                this method is used to get data url
                */
            getURI() {
                let stage = this.$refs["stage"].getNode();
                let dataURL = stage.toDataURL({
                    pixelRatio: 3,
                });
                return dataURL;
            },

            hideFieldModal() {
                this.dialogVisible = false;
            },
            /*
                this method is used to delete selected bounding box
                */
           async deleteBBox() {
                this.removeDrawnBox();
                this.dialogVisible = false;
                // this.$store.commit("documentViewStore/selectedField","");
                let predictionCloned = lodash.cloneDeep(this.fieldPredictionData.prediction)
                let field_deleted = lodash.find(
                    predictionCloned,
                    (field) => {
                        return (
                            lodash.get(field, "field_config.name") == this.selectedShapeName
                        );
                    }
                );
                if (!field_deleted) {
                    let tableData = this.getTableRows(predictionCloned,lodash.get(this.selectedField, "field_config.tableIndex"));
                    let table_row_index =
                        tableData[
                            this.selectedField.field_config &&
                            this.selectedField.field_config.index
                        ];
                    field_deleted = lodash.find(table_row_index, (row_cell) => {
                        return (
                            lodash.get(row_cell, "field_config.name") == this.selectedShapeName
                        );
                    });
                }
                if (!field_deleted) {
                    return;
                }
                else {

                    field_deleted.hasOwnProperty("value") ?
                        (field_deleted.value = "") :
                        (field_deleted.value = "");
                }
                const customerConfiguration = this.docTypeConfig
                if(customerConfiguration.is_cuad_type){
                    field_deleted.start_index = "",
                    field_deleted.end_index = ""
                }

                // Emitting an event to set empty values in their respective field widgets.
                const fieldName = field_deleted.field_config.name;
                const value = ""
                EventBus.$emit("InputValueChanged__" + fieldName, value)

                field_deleted.bounds = [];
                const bbox =  this.getOcrBoxesForField(field_deleted.field_config.name);
                await this.updateDebugData(bbox, field_deleted)
                this.$store.commit("documentViewStore/setCurrentActionPageNumber", this.pageNumber);
                this.$store.commit("documentViewStore/setIsLoadCanvas", false);
                this.$store.commit("documentViewStore/setPredictionData",predictionCloned);
                // this.$store.commit("documentViewStore/setFieldPredictionData",this.fieldPredictionData);

                if(lodash.get(field_deleted, 'field_config.field_type') == 'table'){
                        this.$store.commit("documentViewStore/updateTableParams",{field:field_deleted,value:""});

                }

                // Disable b-box popup after deleting b-box
                this.dialogVisible = false;
                // TODO : We should only remove the current selected dropdown, this will re-render all bboxs for current canvas
                this.createBoundingBoxes()
            },

            getOcrBoxesForField(name){
                const rect =  this.predicted_rectangles.find((r) => r.name === name);
                const bbox =  this.getOcrBoxes(rect)
                return bbox
            },
            /*
                this method is used to draw bounding boxes of search text on image
                */
            drawSearchedBBox(searchRectangles, value) {
                let {
                    scaleX,
                    scaleY
                } =  this.ocrScales;;
                searchRectangles.push({
                    x: value[0] * scaleX - canvasImageDifference / 2,
                    y: value[1] * scaleY - canvasImageDifference / 2,
                    width: (value[2] - value[0]) * scaleX + canvasImageDifference,
                    height: (value[3] - value[1]) * scaleY + canvasImageDifference,
                    fill: "rgba(0,154,205,0.3)",
                    stroke: "rgba(0, 104,139, 1)",
                    strokeWidth: 0.5,
                    dash: [2, 2],
                    draggable: false,
                    page:this.pageNumber
                });
            },
            /*
                this method gives ocr page data based on the page number
                */
            getOcrPageData() {
                // let debugData=this.$store.getters["documentViewStore/debugData"];
                if (!this.debugData || !this.debugData.ocr_result || !this.debugData.ocr_result.length) {
                    return [];
                }
                return this.debugData.ocr_result[this.pageNumber - 1]
            },

            /*
                ******************************************
                 Konva related methods for mouse events
                ******************************************
                */

            /*
                this method is called when we change shape of rectangles
                */
            handleTransformEnd(e) {
                /*
                      1) shape is transformed, let us save new attrs back to the node
                      2) find element in our state
                      */
                let rect = this.predicted_rectangles.find(
                    (r) => r.name === this.selectedShapeName
                );

                if (!rect) {
                    rect = this.drawn_rect;
                }

                /*
                      update the state of rectangle according to the transformation
                      */
                rect.x = e.target.x();
                rect.y = e.target.y();
                rect.rotation = e.target.rotation();
                rect.width = rect.width * e.target.scaleX();
                rect.height = rect.height * e.target.scaleY();
                let ocrCoveredBoxes = this.getOcrBoxes(rect);
                rect.value = lodash.map(ocrCoveredBoxes, (box) => {
                       return box[4];
                 }).join(" ");
                /*
                      to change value of input field on expand
                      */

                if (this.selectedField && this.selectedField.name == "new_field") {
                    this.selectedField.value = rect.value;
                    let original_bounds = this.getOriginalBbox(rect);
                    this.selectedField.bounds = [
                        original_bounds.x,
                        original_bounds.y,
                        original_bounds.xmax,
                        original_bounds.ymax,
                    ];
                    this.updateSelectedField(this.selectedField);
                }
                    e.target.scaleX(1);
                    e.target.scaleY(1);

                /*
                      when box is resized we need to change size of box with
                      respect to orinalal size of image
                      */
                this.transformRectangleToOriginal(rect);
            },
            transformRectangleToOriginal(rect) {
                let fieldData = this.getOriginalBbox(rect);
                // let documentData = this.$store.getters["documentViewStore/fieldPredictionData"];
                let predictionCloned = lodash.cloneDeep(this.fieldPredictionData.prediction)
                let field = lodash.find(predictionCloned, (field) => {
                    return lodash.get(field, "field_config.name") == rect.name;
                });
                if (!field) {
                    let tableData = this.getTableRows(predictionCloned,this.selectedField.field_config.tableIndex);
                    let table_row_index = tableData[this.selectedField.field_config.index];
                    field = lodash.find(table_row_index, (row_cell) => {
                        return lodash.get(row_cell, "field_config.name") == rect.name;
                    });
                }

                if (!field) return;
                field.bounds[0] = fieldData.x;
                field.bounds[1] = fieldData.y;
                field.bounds[2] = fieldData.xmax;
                field.bounds[3] = fieldData.ymax;

                // if(lodash.get(field, 'field_config.type') == 'date'){
                //     field.formatted_value = rect.value
                // }
                // else{
                field.hasOwnProperty("value") ?
                    (field.value = rect.value) :
                    (field.value = rect.value);
                //}
                this.$store.commit("documentViewStore/setIsLoadCanvas", false);
                this.$store.commit("documentViewStore/setCurrentActionPageNumber", this.pageNumber);
                this.$store.commit("documentViewStore/setPredictionData",predictionCloned);
                // this.$store.commit("documentViewStore/setFieldPredictionData",this.fieldPredictionData);

                 if(lodash.get(field, 'field_config.field_type') == 'table'){
                    this.$store.commit("documentViewStore/updateTableParams",{field:field,value:field.value});

                }
            },
            /*
                    this method is used fetch original size of box with resped to image
                */
            getOriginalBbox(rect) {
                let {
                    scaleX,
                    scaleY
                } = this.ocrScales;;

                let fieldData = {};
                fieldData.x = (rect.x + canvasImageDifference / 2) / scaleX;
                fieldData.y = (rect.y + canvasImageDifference / 2) / scaleY;
                fieldData.xmax =
                    (rect.width - canvasImageDifference) / scaleX + fieldData.x;
                fieldData.ymax =
                    (rect.height - canvasImageDifference) / scaleY + fieldData.y;
                return fieldData;
            },

            /*
                this method is called when we draw rectangle.
                untill we press mouse up this method changes the position of rectangle
                */
            updateDrag(posIn) {
                this.posNow = {
                    x: posIn.x,
                    y: posIn.y,
                };
                var posRect = this.reverse(this.posStart, this.posNow);
                this.drawn_rect.x = posRect.x1 / this.zoomX;
                this.drawn_rect.y = posRect.y1 / this.zoomY;
                this.drawn_rect.width = (posRect.x2 - posRect.x1) / this.zoomX;
                this.drawn_rect.height = (posRect.y2 - posRect.y1) / this.zoomY;
                this.$refs["stage"].getNode().draw();
            },

            /*
                this method detects the origin of rectangle
                and return us the correct rectangle
                */

            reverse(r1, r2) {
                var r1x = r1.x,
                    r1y = r1.y,
                    r2x = r2.x,
                    r2y = r2.y,
                    d;
                if (r1x > r2x) {
                    d = Math.abs(r1x - r2x);
                    r1x = r2x;
                    r2x = r1x + d;
                }
                if (r1y > r2y) {
                    d = Math.abs(r1y - r2y);
                    r1y = r2y;
                    r2y = r1y + d;
                }
                return {
                    x1: r1x,
                    y1: r1y,
                    x2: r2x,
                    y2: r2y,
                };
            },

            /*
                this method is called until we release mouseup
                it calls updateDrag()
                it also suggest that we are in drawing mode
                */

            HandleMouseMove(e) {
                // Prevent users from creating bounding boxes to change field values when the document is in read-only mode.
                if (this.isDocumentReadOnly) return;
                if (this.mode === "drawing") {
                    this.updateDrag({
                        x: e.evt.layerX,
                        y: e.evt.layerY,
                    });
                }
                if(!this.isDebuggerOn){
                    return
                }

                let ocr_cordinate = this.ocr_text_available();
                if (!ocr_cordinate) return;

                let {
                    scaleX,
                    scaleY
                } =  this.ocrScales;;

                let ocr_rect = {
                    x: ocr_cordinate[0] * scaleX,
                    y: ocr_cordinate[1] * scaleY,
                    width: (ocr_cordinate[2] - ocr_cordinate[0]) * scaleX,
                    height: (ocr_cordinate[3] - ocr_cordinate[1]) * scaleY,
                    name: ocr_cordinate[4],
                    value: ocr_cordinate[4],
                    bounds: [
                        ocr_cordinate[0],
                        ocr_cordinate[1],
                        ocr_cordinate[2],
                        ocr_cordinate[3],
                    ],
                    draggable: false,
                    fill: "rgba(180, 255, 205,0.3)",
                    stroke: "rgba(0, 93, 166, 1)",
                    strokeWidth: 0.5,
                    page_number: this.pageNumber,
                };
                this.selectedShapeName = ""
                this.activeOcrWordTag = `${ocr_cordinate[4]}:${ocr_cordinate[5]} (${ocr_cordinate[7]}%)`
                this.drawn_rect = lodash.cloneDeep(ocr_rect);
                let drawn_rect_ref = this.$refs["drawn_rect"].getNode();
                this.moveDialogBox(drawn_rect_ref);
            },

            /*
                this method draw the new rectangle if the mode is drawing
                */

            handleMouseUp(e) {
                try {
                    if (
                        this.mode == "drawing" &&
                        this.drawn_rect.width > 0 &&
                        this.drawn_rect.height > 0
                    ) {
                        if(this.isMasked){return}
                        let name = "rect_" + this.predicted_rectangles.length + 1;
                        let rect = {
                            x: this.drawn_rect.x,
                            y: this.drawn_rect.y,
                            width: this.drawn_rect.width,
                            height: this.drawn_rect.height,
                            fill: "rgba(180, 255, 205,0.3)",
                            stroke: "rgba(0, 93, 166, 1)",
                            strokeWidth: 0.5,
                            name: name,
                            draggable: false,
                        };
                        let ocrCoveredBoxes = this.getOcrBoxes(rect);
                        let value = lodash.map(ocrCoveredBoxes, (box) => {
                                return box[4];
                         }).join(" ");
                        rect.value = value;
                        let original_bounds = this.getOriginalBbox(rect);
                        rect.bounds = [
                            original_bounds.x,
                            original_bounds.y,
                            original_bounds.xmax,
                            original_bounds.ymax,
                        ];

                        rect.page_number = this.pageNumber;
                        this.selectedShapeName = rect.name;
                        this.drawn_rect = lodash.cloneDeep(rect);
                        this.assignOcrData(ocrCoveredBoxes);
                    }
                } catch (e) {
                    console.log(e);
                } finally {
                    this.mode = null;
                }
            },

            // updateTableMappedField(rect) {

            //     let updatedField;
            //     if (this.isTableSelected) {
            //         let tableData = this.getTableRows()
            //         lodash.each(tableData, (row) => {
            //             updatedField = lodash.find(row, (field) => {
            //                 return field.field_config && field.field_config.name == lodash.get(this.selectedField, 'field_config.name')
            //             })
            //             if (updatedField) return false
            //         });
            //     } else {
            //         updatedField = lodash.find(this.fieldPredictionData.prediction, (field) => {
            //             return field.field_config && field.field_config.name == lodash.get(this.selectedField, 'field_config.name')
            //         });
            //     }
            //     updatedField.bounds = rect.bounds;
            //     updatedField.value = rect.value;
            //     updatedField.page_number = rect.page_number;
            //     this.$emit('update:documentData', this.fieldPredictionData)

            // },

            getTableRows(predictionCloned, tableIndex) {
                // let documentData = this.$store.getters["documentViewStore/fieldPredictionData"];
                // let predictionCloned = lodash.cloneDeep(this.fieldPredictionData.prediction)
                let tableData = lodash.find(predictionCloned, {
                    name: "table",
                });
                if(_.isNumber(tableIndex)){
                    return lodash.get(tableData.data[tableIndex], "content.rows");
                }
                return lodash.get(tableData, "content.rows");
            },

           /**
             * This function is called when the user clicks on a bounding box. It finds the
             * corresponding field of that bbox, changes the selected field, and scrolls to 
             * that field from the table/header section. Additionally, it opens the dialog below the bbox.
             */
            handleStageMouseclick(e){
                this.visibleConfirmationContent = false;
                // let documentData = this.$store.getters["documentViewStore/fieldPredictionData"];
                if (this.isDebuggerOn) {
                    return;
                }

                const clickedOnTransformer =
                    e.target.getParent() &&
                    e.target.getParent().className === "Transformer";
                if (clickedOnTransformer) {
                    return;
                }
                if (this.selectedField && this.selectedField.name == "new_field") {
                    this.$store.commit("documentViewStore/setSelectedField",'');

                }

                const name = e.target.name();
                this.dialogVisible = false;
                const rect = this.predicted_rectangles.find((r) => r.name === name);

                if (rect) {
                    this.selectedShapeName = name;
                    let selectedField = this.findSelectedFieldByRect(rect);
                    if (lodash.get(selectedField, "field_config.name") == lodash.get(this.selectedField, "field_config.name")) {
                       this.updateTransformer();
                    } else {
                        this.updateSelectedField(selectedField)
                        this.removeDrawnBox();
                    }
                }
            },
            /**
             * Added a 100 ms delay to handle the mouse down event on the bounding box.
             * This delay is introduced to address the scenario where the blur event of a widget (e.g., input.vue)
             * and the click event of the current bounding box occur simultaneously.
             * By introducing a delay, we ensure that the blur event is executed first,
             * followed by the click event of the bounding box.
             */
            bboxStageMouseClick(e) {
                setTimeout(() => {
                    this.handleStageMouseclick(e);
                }, 100);
            },
            /**
             * This method is called on mousedown:
             * If it's not a rectangle or transformer, we set the mode to drawing and start
             * drawing a new rectangle.
             */
            handleStageMouseDown(e) {
                this.visibleConfirmationContent = false;
                // let documentData = this.$store.getters["documentViewStore/fieldPredictionData"];
                if (this.isDebuggerOn) {
                    return;
                }

                const clickedOnTransformer =
                    e.target.getParent() &&
                    e.target.getParent().className === "Transformer";
                if (clickedOnTransformer) {
                    return;
                }
                if (this.selectedField && this.selectedField.name == "new_field") {
                    this.$store.commit("documentViewStore/setSelectedField",'');

                }
                this.mode = "drawing";
                this.selectedShapeName = "";
                this.startDrag({
                    x: e.evt.layerX,
                    y: e.evt.layerY,
                });
                this.patch = false;
                this.removeDrawnBox();
                
            },

            /**
             * Find and return the selected field based on the bounding box rectangle.
             *
             * @param {Object} rect - The bounding box rectangle object.
             * @returns {Object} The selected field object.
             */
            findSelectedFieldByRect(rect) {
                const {table_index: tableIndex, name: fieldName, field_type: fieldType} = rect;
                // We can't solely rely on table index checks for multi-table scenarios, as we assign table index 0 for single fields during data preparation in setPredictionData.
                // Therefore, we are introducing an additional check, isMultiTable, to handle multi-table scenarios more accurately.
                const isMultiTableBBox = this.isMultiTable && lodash.isNumber(tableIndex);
                let selectedField;
                if(fieldType == "header"){
                    selectedField = this.findHeaderField(fieldName);
                }else if(isMultiTableBBox){
                    selectedField = this.findMultiTableField(tableIndex, fieldName);
                }else{
                    selectedField = this.findSingleTableField(fieldName);
                }
                return selectedField;
            },

            // Get the header selected field from prediction
            findHeaderField(fieldName){
                const prediction = this.fieldPredictionData.prediction;
                const selectedField = lodash.find(prediction, field => { return field.field_config && field.field_config.name == fieldName});
                return selectedField;
            },
            // Get the multi table selected field
            findMultiTableField(tableIndex, fieldName){
                const tableData = this.getTableDataByIndex(tableIndex);
                const selectedField = this.findTableField(tableData, fieldName);

                // Prepare the event name "InputValueChanged__<tableName>__<fieldname>" for bidirectional updates 
                // from canvas to line and line to canvas. These additional properties are required to prepare this event.
                selectedField.table_name = this.$store.getters["documentViewStore/tableNameByTableIndex"](tableIndex);
                selectedField.table_index = tableIndex;
                selectedField.is_table = true;

                return selectedField;

            },

            // Get table selected field from prediction for single table
            findSingleTableField(fieldName){
                const tableData = this.getTableDataByIndex();
                const selectedField = this.findTableField(tableData, fieldName);
                
                // Prepare the event name "InputValueChanged__<tableName>__<fieldname>" for bidirectional updates 
                // from canvas to line and line to canvas. These additional properties are required to prepare this event.
                selectedField.table_name = "singleLineItem"
                selectedField.is_table = true;
                return selectedField;
            },

            // Get table field using tabledata
            findTableField(tableData, fieldName) {
                let selectedField;
                lodash.each(tableData, (row) => {
                    let localField  = lodash.find(row, (field) => { return field.field_config && field.field_config.name == fieldName });
                    if(localField){
                        selectedField = localField
                        return false;
                    }
                });
                // Field prediction data was getting changed by reference when returning selectedField without cloneDeep
                // It was the root cause of unwanted confirmation box on document viewer
                return lodash.cloneDeep(selectedField);
            },

            updateSelectedField(selectedField){
                        let selectedFieldClone = lodash.cloneDeep(selectedField)
                        let predictionCloned = lodash.cloneDeep(this.fieldPredictionData.prediction)
                        if(lodash.get(selectedField, "field_config.type") == 'checkbox' && !selectedField.is_master_checkbox){
                            selectedFieldClone = _.find(predictionCloned, (field) => {
                            return lodash.get(field, "field_config.name") == selectedField.name && field.is_master_checkbox;
                        });
                        }

                        // Remove the previous page's field dialog to ensure that only one dialog is displayed at a time,
                        // preventing potential issues with multi-page documents where only the dialog for the currently selected field should be shown.
                        const previousSelectedField = this.$store.getters["documentViewStore/selectedField"];
                        if(previousSelectedField){
                            const resetFieldModalEvent = `ResetFieldModal__${previousSelectedField.page_number}`;
                            EventBus.$emit(resetFieldModalEvent);
                        }

                        this.$store.commit("documentViewStore/setSelectedField",selectedFieldClone);
                        this.$emit("scrollToTheField", selectedFieldClone)
                        this.handleSelectedFieldChanged(selectedFieldClone);
                        // Emitting for bidirectional value update
                        
                        const {table_name, is_table }= selectedFieldClone;
                        const params = { 
                            table_name,
                            is_table,
                            name : lodash.get(selectedFieldClone,"field_config.name")
                        };
                        const inputValueChangedEvent = IdpDocumentService.createValueChangeEventName(params);
                        EventBus.$emit(inputValueChangedEvent, selectedFieldClone.value);
             },
            /*
                this method gives the current position to draw the rectangle
                */
            startDrag(posIn) {
                let isSaveActionEnabled =this.$store.getters["actionButtonStore/isSaveActionEnabled"]
                if(isSaveActionEnabled){
                    this.posStart = {
                        x: posIn.x,
                        y: posIn.y,
                    };
                    this.posNow = {
                        x: posIn.x,
                        y: posIn.y,
                    };
                }
            },

            /*
                1) this method attach or detach the transformer node to rectangle
                2) do nothing if selected node is already attached
                3) move the dialog box of field to selected rectangle
            */

            updateTransformer() {
                this.transformerNode =
                    this.$refs.transformer && this.$refs.transformer.getStage();
                const stage = this.transformerNode && this.transformerNode.getStage();
                const {
                    selectedShapeName
                } = this;
                if (!selectedShapeName) {
                    return;
                }

                let selectedNode = stage && stage.findOne("." + selectedShapeName);

                if(selectedNode){
                    this.moveDialogBox(selectedNode)
                }
                else{
                    this.dialogVisible = false
                }

                if (
                    this.transformerNode &&
                    selectedNode === this.transformerNode &&
                    this.transformerNode.node()
                ) {
                    return;
                }
                selectedNode
                    ?
                    this.transformerNode && this.transformerNode.attachTo(selectedNode) :
                    this.transformerNode && this.transformerNode.detach();
                this.transformerNode && this.transformerNode.getLayer().batchDraw();
            },

            createWordRectangle(bounds, index) {
                let {
                    scaleX,
                    scaleY
                } =  this.ocrScales;;

                const obj = {};
                obj.x = (bounds[0] * scaleX - canvasImageDifference / 2) + 2;
                obj.y = (bounds[1] * scaleY - canvasImageDifference / 2) + 2;
                obj.width = ((bounds[2] - bounds[0]) * scaleX + canvasImageDifference) - 2;
                obj.height =
                    ((bounds[3] - bounds[1]) * scaleY + canvasImageDifference) - 2;
                // obj.stroke = "rgba(255,255,255, 1)";
                //   obj.fill = "rgba(255,255,255, 1)";
                //   obj.strokeWidth = 1;
                obj.draggable = false;

                obj.translatedText = null;
                if (this.translatedWords && this.translatedWords.length && this.translatedWords[index]) {
                    obj.translatedText = "" + this.translatedWords[index][4];
                }
                obj.primaryText = "" + bounds[4];
                return obj;
            },

            /*
                this method find out type of bounging box whether it is header or table
                and create the rectangle according to that
                */

            createAllWordRectangles() {
                const ocrData = this.getOcrPageData();
                this.allTransperentRectangles = [];
                if (!ocrData || !ocrData.length) {
                    return;
                }
                this.allTransperentRectangles = ocrData.map((bounds, index) => {
                    return this.createWordRectangle(bounds, index);
                });
            },

            /* here creating bounding boxes page wise
                data: pageData (single page data)
                for eg: [
                    {
                        "bounds" : [
                            755.2394452095032,
                            1447.3600463867188,
                            1172.8097839355469,
                            1740.319091796875
                        ],
                        "bounds_score" : 5.36,
                        "value" : "",
                        "value_score" : NumberInt(99),
                        "name" : "date",
                        "original_value" : "",
                        "from_document" : true,
                        "page_number": 1
                        "index" : NumberInt(0),
                        "config" : [

                        ]
                    },
                ]
            */

            /**
             * Purpose: Create bounding boxes for all fields( header/table ).
             * Steps:
             * 1. Retrieve prediction fields by page from the store fieldPredictionData.
             * 2. Validate the data; if it's invalid, do not draw bounding boxes.
             * 3. Draw bounding boxes for current page for all fields ( table/header)
             */
            createBoundingBoxes() {
                const {flatPredictionDataByPage} = this.fieldPredictionData;
                if(lodash.isEmpty(flatPredictionDataByPage)){
                    return;
                }
                this.predicted_rectangles = [];
                this.drawBBox(flatPredictionDataByPage)
                this.$refs["stage"] && this.$refs["stage"].getNode().cache();
            },


            /**
             * Draws bounding boxes for all  fields(table/header) on the current page using the provided headerData.
             *
             * @param {Object} flatPredictionDataByPage - The data containing all fields for various pages.
             * @example
             * {
             *   1: [field1, field2, ...], // Header & table  fields on page 1
             *   2: [field3, field4, ...], // Header & table fields on page 2
             *   // ...
             * }
             */
            drawBBox(flatPredictionDataByPage) {
                const currentPageFields = flatPredictionDataByPage[this.pageNumber] || []
                for (const predField of currentPageFields) {
                    const hasFieldConfig = predField.field_config && predField.field_config.selected && predField.field_config.active;
                    const hasBounds = lodash.get(predField, 'bounds', true);
                    const isCuadType = this.docTypeConfig && this.docTypeConfig.is_cuad_type
                    if (hasFieldConfig && hasBounds) {
                        if (!isCuadType) {
                            const drawFunction = predField.type === 'polygon' ? this.drawPolygonBoundBox : this.drawPredictedBoundBox;
                            drawFunction(predField);
                        } else {
                            if (predField.bounds) {
                                predField.bounds = [];
                            }
                            const combinedOcrResult = this.debugData.ocr_result.flat();
                            this.drawCuadTypeBoundingBox(predField, combinedOcrResult);
                        }
                    }
                }
            },

            /*
                this method checks whether on mouse click cordinates ocr text is avaiable or not
                */
            ocr_text_available() {
                let pointer_position = this.$refs["stage"].getNode().getPointerPosition();
                let x_value = pointer_position.x / this.zoomX;
                let y_value = pointer_position.y / this.zoomY;

                let {
                    scaleX,
                    scaleY
                } =  this.ocrScales;;

                return lodash.find(this.getOcrPageData(), (value) => {
                    if (!value) {
                        return;
                    }
                    let xmin = value[0] * scaleX;
                    let ymin = value[1] * scaleY;
                    let xmax = value[2] * scaleX;
                    let ymax = value[3] * scaleY;
                    return (
                        x_value > xmin && x_value < xmax && y_value > ymin && y_value < ymax
                    );
                });
            },

            /*
                this method creates the ocr bounding boxes on double click if it is
                inside the bounding box otherwise on single click
                */
            handleOcrDoubleClick() {
                // on double click, value of field is changing even if document is read only, so added isDocumentReadOnly check on double click
                if (this.isDocumentReadOnly) return;
                let ocr_cordinate = this.ocr_text_available();
                if (!ocr_cordinate || this.isMasked) return;

                let {
                    scaleX,
                    scaleY
                } =  this.ocrScales;;

                let ocr_rect = {
                    x: ocr_cordinate[0] * scaleX,
                    y: ocr_cordinate[1] * scaleY,
                    width: (ocr_cordinate[2] - ocr_cordinate[0]) * scaleX,
                    height: (ocr_cordinate[3] - ocr_cordinate[1]) * scaleY,
                    name: ocr_cordinate[4],
                    value: ocr_cordinate[4],
                    bounds: [
                        ocr_cordinate[0],
                        ocr_cordinate[1],
                        ocr_cordinate[2],
                        ocr_cordinate[3],
                    ],
                    draggable: false,
                    fill: "rgba(180, 255, 205,0.3)",
                    stroke: "rgba(0, 93, 166, 1)",
                    strokeWidth: 0.5,
                    page_number: this.pageNumber,
                };

                this.selectedShapeName = ocr_cordinate[4];
                this.drawn_rect = lodash.cloneDeep(ocr_rect);
                this.assignOcrData();
            },

            /**
            * *Helper function : Calculates and returns the accumulated length of sub-arrays in the given array up to the specified selectedIndex.
            *
            * @params {Array} allPageOcr
            * @params {Integer} pageNumber
            */
            getCombinedOcrByPage(allPageOcr, pageNumber) {
                if (pageNumber >= allPageOcr.length || pageNumber < 0) {
                    return 0;
                }
                let sum = 0;

                // Calculating sum
                for (let i = 0; i < pageNumber; i++) {
                    if (Array.isArray(allPageOcr[i])) {
                        sum += allPageOcr[i].length;
                    }
                }

                // Returning sum
                return sum;
            },

            /*
                this method assign the clicked ocr box value to header or
                table value
                */

            async assignOcrData(ocrCoveredBoxes = null) {
                let updatedField;
                // let documentData = this.$store.getters["documentViewStore/fieldPredictionData"];
                let predictionCloned = lodash.cloneDeep(this.fieldPredictionData.prediction)
                if (this.isTableSelected) {
                    let tableData = this.getTableRows(predictionCloned,lodash.get(this.selectedField, "field_config.tableIndex"));
                    // lodash.each(tableData,(table)=>{
                        lodash.each(tableData, (row) => {
                            updatedField = lodash.find(row, (field) => {
                                return (
                                    field.field_config &&
                                    field.field_config.name ==
                                    lodash.get(this.selectedField, "field_config.name")
                                );
                            });
                            if (updatedField) return false;
                        });
                    // })

                }
                else if (lodash.get(this.selectedField, "field_config.type") == "checkbox") {
                     updatedField = lodash.find(
                        predictionCloned,
                        (field) => {
                            return (
                                field.field_config &&
                                field.field_config.name ==
                                `${this.selectedField.name}_${lodash.get(this.selectedField, "selected_checkbox")}`
                            );
                        }
                    );
                    ocrCoveredBoxes && await this.updateDebugData(ocrCoveredBoxes, updatedField, this.selectedField.selected_checkbox);
                }
                else {
                    updatedField = lodash.find(
                        predictionCloned,
                        (field) => {
                            return (
                                field.field_config &&
                                field.field_config.name ==
                                lodash.get(this.selectedField, "field_config.name")
                            );
                        }
                    );
                    ocrCoveredBoxes && await this.updateDebugData(ocrCoveredBoxes, updatedField);
                }
                if (!updatedField) {
                    let drawn_rect_ref = this.$refs["drawn_rect"].getNode();

                    this.$store.commit("documentViewStore/setSelectedField",{
                        name: "new_field",
                        value: this.drawn_rect.value,
                        bounds: this.drawn_rect.bounds,
                        page_number: this.drawn_rect.page_number,
                    });

                    this.moveDialogBox(drawn_rect_ref);
                    this.$nextTick(() => {
                        this.updateTransformer();
                    });
                    return;
                }

                (lodash.get(this.selectedField, "field_config.type") != "checkbox") && (updatedField.value = this.drawn_rect.value);
                if (lodash.get(updatedField, "field_config.type") == "date") {
                    this.formatDate(updatedField, this.drawn_rect.value);
                }

                updatedField.bounds = this.drawn_rect.bounds;
                updatedField.page_number = this.drawn_rect.page_number;
                
                // Prepare the event name "InputValueChanged__<tableName>__<fieldname>" for bidirectional updates 
                // from canvas to line and line to canvas. These additional properties are required to prepare this event.
                updatedField.table_name = this.selectedField.table_name;
                updatedField.table_index = this.selectedField.table_index;
                updatedField.is_table = this.selectedField.is_table;
                this.$store.commit("documentViewStore/setIsLoadCanvas", false);
                this.$store.commit("documentViewStore/setCurrentActionPageNumber", this.pageNumber);
                this.$store.commit("documentViewStore/setPredictionData", predictionCloned);
                // this.$store.commit("documentViewStore/setFieldPredictionData",this.fieldPredictionData);

                this.updateSelectedField(updatedField);
                if (lodash.get(updatedField, 'field_config.field_type') == 'table') {
                    this.$store.commit("documentViewStore/updateTableParams", { field: updatedField, value: updatedField.value });

                };

                // Check if customer had CUAD type of dataset
                if (this.docTypeConfig.is_cuad_type) {

                    // If bounding box is drawn on other than page no 1
                    if (this.pageNumber > 1) {

                        // Add the length of the previous pages ocr lentgh to start_index and end_index
                        const previousPageOcrLength = this.getCombinedOcrByPage(this.debugData.ocr_result, this.pageNumber - 1);
                        updatedField.start_index = ocrCoveredBoxes[0][5] + previousPageOcrLength + 1;
                        updatedField.end_index = ocrCoveredBoxes[ocrCoveredBoxes.length - 1][5] + previousPageOcrLength + 1

                        // If bounding box in drawn on page no 1
                    } else {

                        // Set start index from OcrCoveredBoxes
                        updatedField.start_index = ocrCoveredBoxes[0][5] + 1

                        // Set end index from OcrCoveredBoxes
                        updatedField.end_index = ocrCoveredBoxes[ocrCoveredBoxes.length - 1][5] + 1
                    }

                    this.$store.commit("documentViewStore/setFieldPredictionData",this.fieldPredictionData);

                    // Combine OCR results from all pages into a single array
                    let combinedOcrResult = this.debugData.ocr_result.reduce((result, subarray) => result.concat(subarray), []);

                    // Call the drawCuadTypeBoundingBox  function to draw bounding boxes by characters
                    this.drawCuadTypeBoundingBox (updatedField, combinedOcrResult)

                } else {

                    // Call the drawPredictedBoundBox function to draw bounding boxes
                    this.drawPredictedBoundBox(updatedField)
                }
            },

            updateCurrentBBoxToOther(name, fieldType, value){
            //  let debugData=this.$store.getters["documentViewStore/debugData"]
               let ocrResult = this.debugData.ocr_result
               let rowNum;
               if(fieldType == 'checkbox'){
                    name = name.split('#')[0]
                    rowNum = name.split('#')[1]
               }
               let tagValue = this.getTagValue(fieldType, name, value, rowNum)
               let tagArr = [`B-${tagValue}-VAL`, `M-${tagValue}-VAL`, `E-${tagValue}-VAL`, `I-${tagValue}-VAL`]
               _.each(ocrResult, (ocrData, pageIndex)=>{
                   _.each(ocrData, (bbox)=>{
                       if(!tagArr.includes(bbox[5])){return;}
                       this.updateTag(bbox, `O`, pageIndex+1)
                   })
               })
            },

            getTableDataByIndex(tableIndex) {
                let tableData = lodash.find(this.fieldPredictionData.prediction, {
                    name: "table",
                });
                if (_.isNumber(tableIndex)) {
                    return lodash.get(tableData.data[tableIndex], "content.rows");
                }
                return lodash.get(tableData, "content.rows",[])
            },

            async updateDebugData(newBoundingBox, field, fieldType = null, value = null) {
                let field_type = _.get(field, 'field_config.field_type')
                    if(field_type == 'table'){
                        return
                    }

                    if(_.get(field, 'field_config.is_custom_field',false)){
                        return
                    }
                    let fieldName = _.get(field, 'name');
                    if(this.isAutoLearningEnabled && this.shouldTrackChanges === null && this.debugData.ocr_result){
                       let response = await this.$confirm(`Do you want to track these changes for further training?`, {
                            confirmButtonText: "Confirm",
                            cancelButtonText: "Cancel",
                        })
                        .catch(()=>{
                        this.$store.commit("documentViewStore/shouldTrackChanges",false);
                        });
                        response && this.$store.commit("documentViewStore/shouldTrackChanges",true);
                    }
                    // Retrieve the isRectangleRequested flag from the documentViewStore to check whether the 'Please draw rectangle.' popup has been requested or not.
                    const isRectangleRequested =  this.$store.getters["documentViewStore/isRectangleRequested"];
                    if(this.shouldTrackChanges && _.get(field, 'field_config.field_expected_in_document') && !isRectangleRequested){
                        await this.$alert(`Please draw rectangle.`,{confirmButtonText: 'OK'})
                        this.$store.commit("documentViewStore/setIsRectangleRequested",true);
                    }


                    this.$nextTick(()=>{
                            if(!this.shouldTrackChanges){
                                return;
                            }
                            if(fieldName) {
                                //make current bbox tags to other
                                const bbox = this.updateCurrentBBoxToOther(fieldName, fieldType, value)
                            }
                            //if user drawn bounding boxes selecting any valid header field, update tags
                            this.updateOcrTag(newBoundingBox, fieldName, fieldType, value);
                     })



            },


            updateOcrTag(newBoundingBox, name=null, fieldType, value){
                if(!name){
                     lodash.each(newBoundingBox, (bbox, index)=>{
                         this.updateTag(bbox, `O`, this.pageNumber)
                     })
                     return;
                }
                const bboxLength = newBoundingBox.length;
                const lastIndex = bboxLength-1;
                let rowNum;
                if(fieldType == 'checkbox'){
                    name = name.split('#')[0]
                    rowNum = name.split('#')[1]
                }
                lodash.each(newBoundingBox, (bbox, index)=>{
                    const indexTagMapping = {
                        0 : 'B',
                        [lastIndex]:'E'
                    }
                    const tag = (lastIndex === 0) ? 'B' : (indexTagMapping[[index]] ? indexTagMapping[[index]] : 'M');
                    const tagValue = this.getTagValue(fieldType, name, value, rowNum)
                    const updatedTag = (fieldType == 'checkbox') ? `${tag}-${tagValue}-VAL` : `${tag}-${tagValue}-VAL`
                    this.updateTag(bbox, updatedTag, this.pageNumber)

                })
            },

            updateTag(bbox, updatedTag, pageNumber){
                //  let debugData=this.$store.getters["documentViewStore/debugData"]
                // For performance imporvement we removed 7 element object from prediction
                if( bbox.length == 7){
                    bbox[6] = {...bbox[6], mod_by_cust:true}; // support exisitng document
                } else{
                    bbox.push({"pred":_.clone(bbox[5]), "mod_by_cust": true}); // for new document
                }
                bbox[5]  = updatedTag;

                 this.debugDataModifiedPages.add(pageNumber)
                 this.debugData.modified = true
                this.$store.commit("documentViewStore/setDebugData",this.debugData);
                this.$store.commit("documentViewStore/debugDataModifiedPages",this.debugDataModifiedPages);

            },

            getTagValue(fieldType, name, value, rowNum){
               let tagValue =  (fieldType == 'checkbox') ? `${name.toUpperCase().replace(/_/g, '-')}__${value.toUpperCase()}${rowNum ? rowNum : ''}` : `${name.toUpperCase().replace(/_/g, '-')}`
               return tagValue;
            },

            getOcrDimensions() {
                //  let debugData=this.$store.getters["documentViewStore/debugData"]
                const imageWidth = (this.configBackground && this.configBackground.image && this.configBackground.image.width) || 1;
                const imageHeight = (this.configBackground && this.configBackground.image && this.configBackground.image.height) || 1;

               return this.fieldPredictionData && this.fieldPredictionData.ocr_dimension || Constants.DOCEX.IMAGE_OCR_DIMENSION ||{
                    width: imageWidth,
                    height: imageHeight
                }
                },

            getOcrScales() {
                const ocrDimension = this.getOcrDimensions();
                let scaleX = (canvasWidth * 0.6 + canvasImageDifference) / (ocrDimension.width || 1);
                let scaleY = (canvasHeight + canvasImageDifference) / (ocrDimension.height || 1);
                return {
                    scaleX,
                    scaleY
                };
            },

            /**
             * *Purpose : Draws bounding boxes around characters within a specified field using OCR results.
             *
             * @param {Object} field - The field object containing character indexes and bounds.
             * @param {Array} combinedOcrResult - An array of OCR results for the entire document.
             *
             * * Step 1. Get indexes
             * * Step 2. Extract data from combined ocr result to draw bounding boxes
             * * Step 3. Prepare bounds
             * * Step 4. Draw bounding boxes for each field
             */
             drawCuadTypeBoundingBox(field, combinedOcrResult) {
                    // Step 1. Get indexes
                    const start_index = field.start_index;
                    const end_index = field.end_index;

                    // Step 2. Extract data from combined ocr result to draw bounding boxes
                    const extractedItems = combinedOcrResult.slice(start_index-1, end_index);
                    for (const item of extractedItems) {

                        // Step 3. Prepare bounds
                        field["bounds"] = item.slice(0, 4);

                        // Step 4. Draw bounding boxes for each field
                        this.drawPredictedBoundBox(field);
                        this.removeDrawnBox();
                    }
            },

            /*
                this method draws the selected type of bounding box on image
                parent_value is used in case of table as data is nested
                */

            drawPredictedBoundBox(value) {
                // Check if the value does not have bounds, if so, return.
                if(!value.bounds)return;

                // Check if the field type is 'checkbox' and it's a master checkbox, or if it's an empty checkbox value.
                if((value.field_config && value.field_config.type == 'checkbox' && value.is_master_checkbox ==true) || (value.field_config && value.field_config.type == 'checkbox' && lodash.isEmpty(value.value))) return;

                // Extract the scaleX and scaleY values from the ocrScales object.
                let {
                    scaleX,
                    scaleY
                } = this.ocrScales;

                // Calculate the x and y coordinates of the bounding box and adjust for canvasImageDifference.
                let obj = {};
                obj.x = value.bounds[0] * scaleX - canvasImageDifference / 2;
                obj.y = value.bounds[1] * scaleY - canvasImageDifference / 2;

                // Calculate the width and height of the bounding box and adjust for canvasImageDifference.
                obj.width =
                    (value.bounds[2] - value.bounds[0]) * scaleX +
                    canvasImageDifference;
                obj.height =
                    (value.bounds[3] - value.bounds[1]) * scaleY +
                    canvasImageDifference;

                // Set fill color, stroke color, stroke width, name, draggable, and dash properties.
                obj.fill = "rgba(180, 255, 205,0.3)";
                (obj.stroke = "rgba(0, 93, 166, 1)"),
                (obj.strokeWidth = 0.5),
                (obj.name = value.field_config && value.field_config.name || value.name);
                obj.draggable = false;
                obj.field_type = value.field_config.field_type;
                obj.table_index = value.field_config.tableIndex;
                obj.dash = [2, 2];

                // Check for validation messages and update properties accordingly.
                if (value.validationMsgs && value.validationMsgs.length > 0) {
                    obj.validationMsgs = value.validationMsgs;

                    // Check for ERROR messages and adjust fill and stroke colors.
                    if (
                        !lodash.isEmpty(value.bounds) &&
                        lodash.isObject(
                            lodash.find(value.validationMsgs, {
                                message_type: "ERROR",
                            })
                        )
                    ) {
                        this.setValidtionErrorPosition(obj);

                        // Check for WARNING messages and adjust fill and stroke colors.
                        obj.fill = "rgba(254,215,215,0.5)";
                        obj.stroke = "rgba(155,44,44,1)";
                    } else if (
                        lodash.isObject(
                            lodash.find(value.validationMsgs, {
                                message_type: "WARNING",
                            })
                        )
                    ) {
                        obj.fill = "rgba(254,252,191,0.5)";
                        obj.stroke = "rgba(254,252,191,1)";
                    }
                }
                // To prevent the rerendering of fields when you delete a bounding box and set a `NaN` value in the prediction for the deleted field, you can check the value of each field before rendering and conditionally render it only if it's not `NaN`. This will ensure that only non-`NaN` values are displayed, avoiding unnecessary rerendering of fields with `NaN` values.
                if (!isNaN(obj.x) || !isNaN(obj.y)) {
                    this.predicted_rectangles.push(obj);
                }
            },

            drawPolygoanBoundBox(value) {
                const lineBox = {
                    x: 0,
                    y: 0,
                    points: value.segments,
                    tension: 0.5,
                    closed: true,
                    stroke: "rgba(0, 93, 166, 1)",
                    strokeWidth: 1.0,
                    fill: "rgba(180, 255, 205, 0.2)",
                    dash: [2, 2],
                    name : value.field_config.name
                }
                this.predicted_lines.push(lineBox);
            },

            /*
                this method is used to load image when previw page is called
                */

            loadCanvas() {

                this.configBackground = {
                    image: new Image(),
                };
                const canvasImageURLs = this.$store.getters["documentViewStore/canvasImageURLs"];
                if(!canvasImageURLs[this.pageNumber - 1]) return;
                this.configBackground.image.src = canvasImageURLs[this.pageNumber - 1];
                this.configBackground.image.setAttribute("crossOrigin", "anonymous");
                try {
                    this.configBackground.image.onerror = () => {
                        //this.notifyError(Constants.DOCEX.IMAGE_NOT_FOUND);
                        // reject()
                        this.$emit("showImageLoadingError");
                        this.$emit("update:loading", false);
                    };
                    this.configBackground.image.onload = () => {

                        this.adjustImageSize();
                        this.adjustStageSize();
                        this.ocrScales = this.getOcrScales();
                        this.fieldPredictionData &&
                            this.createBoundingBoxes();
                            this.$nextTick(() => {
                                this.updateTransformer();
                            });
                        this.dataLoaded = true;
                        this.$emit("update:loading", false);
                    };
                } catch (ex) {
                    this.notifyError(Constants.DOCEX.IMAGE_NOT_FOUND);
                    this.dataLoaded = true;
                    this.$emit("update:loading", false);
                }

                // Only emit event when selected field page number and current canvas page number matches
                if(this.dialogSelectedField.page_number == this.pageNumber){
                    this.$store.commit("documentViewStore/setSelectedField",this.dialogSelectedField);
                    const previousSelectedField = this.$store.getters["documentViewStore/selectedField"];
                    this.selectedFieldChangedEventName = "SelectedFieldChangedOnPage__" + this.pageNumber;
                    EventBus.$emit(this.selectedFieldChangedEventName, {previous_selected_field : previousSelectedField ,current_selected_field : this.dialogSelectedField});
                }
            },

            /*
                this method is used to adjust stage size when some change occur
                */

            adjustStageSize() {
                (this.stageSize.width = canvasWidth * 0.6 * this.zoomX),
                (this.stageSize.height = canvasHeight * this.zoomY),
                (this.stageSize.scaleX = this.zoomX);
                this.stageSize.scaleY = this.zoomY;
                this.canvasOuterWidth = canvasWidth * 0.6 * this.zoomX + "px";
                this.canvasOuterHeight = canvasHeight * this.zoomY + "px";
                let rect = this.predicted_rectangles.find(
                    (r) => r.name === this.selectedShapeName
                );
                this.handleMoveDialogZoom(rect);
                this.predicted_rectangles.forEach((rect) => {
                    if (lodash.has(rect, "validation_error")) {
                        this.setValidtionErrorPosition(rect);
                    }
                });
            },

            /*
                this method is used to adjust image size
                */
            adjustImageSize() {
                // Code added by DD for mentain aspect ratio of image height w.r.t width
                const originalWidth = this.configBackground.image.width;
                const originalHeight = this.configBackground.image.height;
                const adjustedHeight =
                    (canvasWidth * originalHeight * 0.6) / originalWidth;
                canvasHeight = adjustedHeight;

                this.scaleX =
                    (canvasWidth * 0.6 + canvasImageDifference) /
                    this.configBackground.image.width;
                this.scaleY =
                    (canvasHeight + canvasImageDifference) /
                    this.configBackground.image.height;
                this.configBackground.image.width =
                    this.configBackground.image.width * this.scaleX;
                this.configBackground.image.height =
                    this.configBackground.image.height * this.scaleY - 5;

                // Existing code from here
                // this.scaleX = ((canvasWidth * 0.60) + canvasImageDifference) / this.configBackground.image.width;
                // this.scaleY = (canvasHeight + canvasImageDifference) / this.configBackground.image.height;
                // this.configBackground.image.width = this.configBackground.image.width * this.scaleX;
                // this.configBackground.image.height = this.configBackground.image.height * this.scaleY - 5;
            },

            /**
             * Helper function to calculate the intersection percentage between two bounding boxes.
             *
             * @param {Object} a - The first bounding box represented as { xmin, ymin, xmax, ymax }.
             * @param {Object} b - The second bounding box represented as { xmin, ymin, xmax, ymax }.
             * @returns {number} The intersection percentage between the two bounding boxes.
             */
            intersection_bounding_box(a, b) {
                let word_area = (b.xmax - b.xmin) * (b.ymax - b.ymin);
                if (
                    !(
                        a.xmin < b.xmax &&
                        a.xmax > b.xmin &&
                        a.ymin < b.ymax &&
                        a.ymax > b.ymin
                    )
                )
                    return 0;
                let dx = Math.min(a.xmax, b.xmax) - Math.max(a.xmin, b.xmin);
                let dy = Math.min(a.ymax, b.ymax) - Math.max(a.ymin, b.ymin);
                let intersection_area = dx * dy;
                if (word_area == 0) return 0;
                return (intersection_area / word_area) * 100;
            },
            /*
                  this method is used to find out text inside the drawn rectangle
                */

            getOcrBoxes(rect) {
                let rectDrawn = {
                    xmin: rect.x,
                    ymin: rect.y,
                    xmax: rect.x + rect.width,
                    ymax: rect.y + rect.height,
                };
                return this.getOcrCoverBoxes(rectDrawn);
            },

            /**
            * * Purpose: This function returns the OCR coordinates of the bounding covered boxes.
            *
            * @param {Array} rectDrawn - The rectangle drawn on the canvas.
            * @returns {Array} An array of OCR covered boxes, each represented as [ocr_xmin, ocr_ymin, ocr_xmax, ocr_y_max, index].
            *
            * * Step 1. Get ocr scales as per width and height of the canvas.
            * * Step 2. Iterate over orc page wise data and prepare orc rectangle box
            * * Step 3. If found intersection bounding box, push index of the ocr to ocr box
            * * Step 4. Return the ocr covered boxes array
            @example
            * getOcrCoverBoxes(rectDrawn):
            *  Returns:
            *  [
            *    [ocr_xmin, ocr_ymin, ocr_xmax, ocr_y_max, index],
            *    [112, 122, 123, 124, 1]
            *  ]
            */
            getOcrCoverBoxes(rectDrawn) {

                // Step 1. Get ocr scales as per width and height of the canvas.
                let { scaleX, scaleY } = this.ocrScales;;
                let ocrCoveredBoxes = [];

                // Step 2. Iterate over orc page wise data and prepare orc rectangle box
                lodash.each(this.getOcrPageData(), (ocrBox, index) => {
                    let ocrRect = {
                        xmin: ocrBox[0] * scaleX,
                        ymin: ocrBox[1] * scaleY,
                        xmax: ocrBox[2] * scaleX,
                        ymax: ocrBox[3] * scaleY,
                    };

                    let intersection = this.intersection_bounding_box(rectDrawn, ocrRect);

                    if (intersection > 70) {

                        // Step 3. If found intersection bounding box, add index of the ocr to ocr box
                        ocrBox.push(index);
                        ocrCoveredBoxes.push(ocrBox);
                    }
                });

                // Step 4. Return the ocr covered boxes array
                return ocrCoveredBoxes;
            },

            createWordBgBox(bounds) {
                let {
                    scaleX,
                    scaleY
                } =  this.ocrScales;;

                const obj = {};
                obj.x = bounds[0] * scaleX - canvasImageDifference / 2;
                obj.y = bounds[1] * scaleY - canvasImageDifference / 2;
                obj.width = (bounds[2] - bounds[0]) * scaleX + canvasImageDifference;
                obj.height =
                    (bounds[3] - bounds[1]) * scaleY + canvasImageDifference;
                obj.stroke = "rgba(255,255,255, 1)";
                obj.fill = "rgba(255,255,255, 1)";
                obj.strokeWidth = 1;
                obj.draggable = false;
                obj.text = "" + bounds[4];
                return obj;
            },

            createWordTextBox(bounds) {
                const calculateFontSize = (height) => 10;
                const obj = {};

                let {
                    scaleX,
                    scaleY
                } =  this.ocrScales;;

                obj.text = bounds[4];
                obj.x = bounds[0] * scaleX - canvasImageDifference / 2 + 4;
                obj.y = bounds[1] * scaleY - canvasImageDifference / 2 + 4;
                obj.fill = "black";
                obj.fontSize = calculateFontSize(bounds[3] - bounds[1]);
                obj.opacity = 1;
                return obj;
            },

            createWordBGBoxes() {
                this.wordBGRectangles = [];
                this.wordTextRectangles = [];
                if (this.showTranslatedText && this.translatedWords && this.translatedWords.length) {
                    this.primaryLanguageEnabled = false;
                    this.wordBGRectangles = this.translatedWords.map(this.createWordBgBox);
                    this.wordTextRectangles = this.translatedWords.map(
                        this.createWordTextBox
                    );
                } else {
                    this.primaryLanguageEnabled = true;
                }
            },

            /**
             * Creates debugging bounding boxes for tables and other elements.
             * 
             * This function fetches debugging data from the DocumentService, processes it, 
             * and creates bounding boxes for visualization.
             */
            async createDebuggingBBoxes() {
                this.debugger_rectangles = [];
                this.$emit("update:loading", true);

                try {
                    const debug_data = await DocumentService.findDebugData(
                        { doc_id: this.debugData.doc_id },
                        ["_id", "prediction", "masked_ocr_result", "table_original_data"]
                    );

                    // Extract actual predictions and table original data from the fetched debug data
                    const actual = debug_data && debug_data[0] && debug_data[0]['prediction']['actual'];
                    const tableOriginalData = debug_data && debug_data[0] && debug_data[0]['table_original_data'];

                    // Update loading state
                    this.$emit("update:loading", false);

                    // Draw debugging bounding boxes for tables if table original data is present
                    if (!_.isEmpty(tableOriginalData)) {
                        this.drawTableDebugBoxes(tableOriginalData);
                    }

                    // Draw bounding boxes for header fields
                    lodash.each(actual, (pred_value) => {
                        if (this.pageNumber == pred_value.page_number && pred_value.name != "table" && pred_value.od_bounds) {
                            this.drawDebugginBBox(pred_value);
                        }
                    });
                } catch (error) {
                    console.log("Error while creating debugging bounding boxes - ", error);
                    this.$emit("update:loading", false);
                }
            },

            /**
             * Calculates the bounding box dimensions (x, y, width, height) based on the provided coordinates and scaling factors.
             *
             * This function is used to transform the original bounding box coordinates by scaling them
             * according to the provided scale factors (`scaleX` and `scaleY`). The function also adjusts
             * the dimensions by a fixed `canvasImageDifference` to account for any required offset or padding.
             *
             * @param {Array<number>} bounds - The bounding box coordinates in the format [x1, y1, x2, y2].
             * @param {number} scaleX - The scaling factor in the X direction.
             * @param {number} scaleY - The scaling factor in the Y direction.
             */
            calculateDebugBBox(bounds, scaleX, scaleY) {
                // Calculate the x-coordinate of the top-left corner with scaling and adjustment
                const x = bounds[0] * scaleX - canvasImageDifference / 2;
                
                // Calculate the y-coordinate of the top-left corner with scaling and adjustment
                const y = bounds[1] * scaleY - canvasImageDifference / 2;
                
                // Calculate the width of the bounding box with scaling and adjustment
                const width = (bounds[2] - bounds[0]) * scaleX + canvasImageDifference;
                
                // Calculate the height of the bounding box with scaling and adjustment
                const height = (bounds[3] - bounds[1]) * scaleY + canvasImageDifference;

                // Return the calculated bounding box dimensions as an object
                return { x, y, width, height };
            },

            /*
                  this method is used to draw debugger data bounding boxes
                */
            drawDebugginBBox(value, index) {
                const { scaleX, scaleY } = this.ocrScales;
                
                const obj = this.calculateDebugBBox(value.od_bounds, scaleX, scaleY);
                obj.stroke = "rgba(0, 93, 166, 1)";
                (obj.strokeWidth = 1), (obj.draggable = false);
                obj.name = value.name;
                obj.text = value.predicted_key ? value.name + "(" + value.predicted_key + ")" : value.name;
                obj.predicted_score = value.value_score;
                this.debugger_rectangles.push(obj);
            },

            /**
             * Draws debugging bounding boxes for table original data.
             * @param {Array} tableOriginalData - Array of original table data.
             */
            drawTableDebugBoxes(tableOriginalData) {
                try {
                    // Filter table data for the current page number
                    const pageTableOriginalData = tableOriginalData.filter(tableData => _.get(tableData, "page_number") == this.pageNumber);
                    
                    // If no table data is found for the current page, log a message and return
                    if (_.isEmpty(pageTableOriginalData)) {
                        console.log("No table debug data found, not creating table debug boxes");
                        return;
                    }
                    
                    const { scaleX, scaleY } = this.ocrScales;

                    for (const pageTableData of pageTableOriginalData) {
                        const rows = _.get(pageTableData, "rows", []);
                        const columns = _.get(pageTableData, "columns", []);
                        const tables = _.get(pageTableData, "tables", []);
                        const tableBoxes = [...rows, ...columns, ...tables];

                        for (const box of tableBoxes) {

                            const obj = this.calculateDebugBBox(box, scaleX, scaleY);
                            obj.draggable = true;
                            obj.name = box[5];
                            obj.text = "";
                            obj.predicted_score = box[4];

                            // Set stroke color and width based on the type of box (table, row, column)
                            if (box[5] === "table") {
                                obj.stroke = "rgba(0, 74, 133, 1)"; // Dark Blue
                                obj.strokeWidth = 2.5;
                            } else if (box[5] === "row") {
                                obj.stroke = "rgba(139, 0, 0, 1)"; // Dark Green
                                obj.strokeWidth = 2;
                            } else if (box[5] === "column") {
                                obj.stroke = "rgba(0, 100, 0, 1)"; // Dark Red
                                obj.strokeWidth = 2;
                            }
                            
                            // Add the object to the debugger rectangles array
                            this.debugger_rectangles.push(obj);
                        }
                    }
                } catch (error) {
                    console.log("Error while creating table debug bounds - ", error);
                }
            },

            createDebuggingText() {
                lodash.each(this.debugger_rectangles, (value) => {
                    let obj = {};
                    obj.text = value.text;
                    obj.x = value.x;
                    obj.y = value.y - 8;
                    obj.fill = "red";
                    obj.fontSize = 8;
                    obj.opacity = 0.75;
                    this.debugger_text.push(obj);
                });
            },
            registerEvents() {
                EventBus.$on("handle_toolbar_click", (clickId) => {
                    this.handleToolbarClick(clickId);
                });
                EventBus.$on("handle_next_search", () => {
                    this.handleNextSearch();
                });
                EventBus.$on("handle_previous_search", () => {
                    this.handlePreviousSearch();
                });

                // If a user focuses on a field while working on a multi-page document,
                // the field from the previous page should be automatically hidden to prevent any confusion or overlapping information.
                const resetFieldModalEvent = `ResetFieldModal__${this.pageNumber}`;
                EventBus.$on(resetFieldModalEvent, () => {
                    this.hideFieldModal()
                });
                // Rather than utilizing a watcher, we have established individual events for each field name corresponding to their respective page numbers.
                this.selectedFieldChangedEventName = "SelectedFieldChangedOnPage__" + this.pageNumber
                window.documentInputComponents.push(this.selectedFieldChangedEventName);
                EventBus.$on(this.selectedFieldChangedEventName, (params) => {
                    const  { previous_selected_field: previousSelectedField, current_selected_field: currentSelectedField } = params;

                    // Remove the previous page's field dialog to ensure that only one dialog is displayed at a time,
                    // preventing potential issues with multi-page documents where only the dialog for the currently selected field should be shown.
                    const resetFieldModalEvent = `ResetFieldModal__${previousSelectedField.page_number}`;
                    EventBus.$emit(resetFieldModalEvent);

                    this.$store.commit("documentViewStore/setSelectedField", currentSelectedField)
                    this.handleSelectedFieldChanged(currentSelectedField);
                });
                // Hide the selected dialog on the canvas if it was active before. Orgin - Input.vue, Dropdown.vue
                // It requires for custom fields which don't have page number
                window.documentInputComponents.push("ResetSelectedDialog");
                EventBus.$on("ResetSelectedDialog", () => {
                    this.hideFieldModal();
                });
            },
        },
        beforeMount() {
            this.registerEvents();
            this.loadCanvas()
        },
        beforeDestroy(){
            const resetFieldModalEvent = `ResetFieldModal__${this.pageNumber}`;
            const events = [
                    resetFieldModalEvent, 
                    this.selectedFieldChangedEventName,
                    "handle_toolbar_click",
                    "handle_next_search",
                    "handle_previous_search"]
            EventBus.$off(events);
        },
        updated(){
            console.log("IdpCanvas::updated")
        }
    };
    </script>

    <style lang="scss">
    @import "../_idpVariables";
    @import "../_idpGlobal";

    .kp-field-drowdown-docx::-webkit-scrollbar {
        width: 4px;
    }

    .loading-container {
        width: 816px;
        margin-left: 54px;
        padding: 20px;
        padding-top: 0px;
        padding-bottom: 0px;

        .canvas-loading {
            height: 480px;
            background-color: var(--white);
            padding-top: 240px;
        }
    }

    .kp-field-drowdown-docx::-webkit-scrollbar-track {
        border-radius: 50px;
        background-color: #f5eded;
    }

    .kp-field-drowdown-docx::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px #d0d0d0;
    }

    .kp-field-drowdown-docx {
        height: 180px !important;
        overflow-y: auto !important;
    }

    .field-search-box {
        .el-input__inner {
            margin-top: 10px;
        }
    }

    .update-modal-wrap.ocr-tag-container{
        .ocr-tag-pointer{
            position: absolute;
            top: -6px;
            width: 0;
            left: -80px;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 8px solid #5a67d8 !important;
            margin: 0 100px;
        }
        .ocr-tag-content{
            height: auto !important;
            border-radius: 0.25rem;
            padding: .5rem !important;
            background: #5a67d8 !important;
            border: none;
            color:#fff;
            text-align:"center";

        }
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

        .kp-date-view {
            position: unset;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
            text-align: center;
        }

        .table_modal_header {
            color: var(--white);
            margin-bottom: 7px;
            text-align: left;
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

        .error-info {
            color: red;
        }

        .title {
            color: #ffffff;
            font-weight: bold;
        }

        .el-button.is-circle {
            i {
                font-size: var(--font-base);
                font-weight: 700;
            }
        }

        .el-input__prefix {
            display: none;
        }

        .el-dropdown {
            margin-bottom: 5px;
        }

        // confirmation
    }

    // end upload modal wrap

    .el-icon-arrow-down {
        font-size: var(--font-base);
    }

    .canvas_cs {
        // overflow-x: auto;
        // overflow-y: auto;
        position: relative;
        padding: 20px;
    }
    </style>
