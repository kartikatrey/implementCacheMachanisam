<template>
<div class="canvas_cs" :id="'page_number_' + pageNumber" :style="{width:canvasOuterWidth, height:canvasOuterHeight}">
    <div v-if="dialogVisible" class="modal_div update-modal-wrap" :style="{top: dialogTop,left: dialogLeft}">
        <div class="message-pointer"></div>
        <el-button class="btn-delet" icon="el-icon-delete" @click="deleteBBox" circle :disabled="isDocumentReadOnly"></el-button>
        <div class="confirm-modal" v-if="visibleConfirmationContent">
            <h5>Confirm Field Change?</h5>
            <span class="word-break-label" v-if="dialogSelectedField && dialogSelectedField.name == 'new_field'">This field will be replaced by {{modalClickedData.label}}</span>
            <span class="word-break-label" v-else>{{dialogSelectedField.field_config.label}} will be replaced by {{modalClickedData.label}}</span>

            <div class="buttons-container" style="text-align: center; margin: 0">
                <el-button class='kp-btn-form-primary' size="mini" @click="closeConfirmation">No</el-button>
                <el-button class='kp-btn-form-primary' type="primary" size="mini" @click="changeFieldData">Yes</el-button>
            </div>
        </div>
        <div id="modal-box" v-if="!visibleConfirmationContent" class="input_inner">
            <el-dropdown ref="fieldDropDown" class="field-select" trigger="click" v-if="!isTableSelected" :hide-on-click="false">
                <span v-if="dialogSelectedField && dialogSelectedField.name == 'new_field'" class="el-dropdown-link">
                    Select Field
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <span v-else class="el-dropdown-link">
                    {{dialogSelectedField && dialogSelectedField['field_config']['label']}}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </span>

                <el-dropdown-menu class="kp-field-drowdown-docx" slot="dropdown">
                    <el-dropdown-item class="field-search-box">
                        <el-input placeholder="Search fields..." v-model="field_search_text"></el-input>
                    </el-dropdown-item>
                    <el-dropdown-item v-for="field in field_input_filter" :disabled="isDocumentReadOnly" @click.native="handleModalClick(field)">
                        {{field['label']}}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <span class="el-dropdown-link" v-else>{{dialogSelectedField['field_config']['label']}}</span>
            <validation-tooltip v-if="dialogSelectedField && dialogSelectedField['validationMsgs'] && dialogSelectedField['validationMsgs'].length>0" :validationMsgs="dialogSelectedField['validationMsgs']"></validation-tooltip>

            <el-input v-if="dialogSelectedField && dialogSelectedField.name == 'new_field'" v-model="new_val" @input="onInput"> </el-input>
            <component :config="componentConfig" :isDocumentReadOnly="isDocumentReadOnly" v-else-if="dialogSelectedField && dialogSelectedField['field_config']" :props="dialogSelectedField" v-bind:is="componentMapping[dialogSelectedField['field_config']['type']] || 'Input'"></component>
        </div>

    </div>

    <v-stage ref="stage" :config="stageSize" @dblclick="handleOcrDoubleClick" @mouseup="handleMouseUp" @mousemove="HandleMouseMove" @mousedown="handleStageMouseDown">
        <v-layer ref="layer">
            <v-image :config="configBackground" />
            <v-rect v-for="item in predicted_rectangles" :key="item.id" :config="item" @transformend="handleTransformEnd" />
            <v-rect v-for="item in search_rectangles" :key="item.id" :config="item" />
            <v-text v-for="item in debugger_text" :key="item.id" :config="item" />
            <v-rect v-for="item in debugger_rectangles" :key="item.id" :config="item" />
            <v-rect ref="drawn_rect" :config="drawn_rect" @transformend="handleTransformEnd" />
            <v-transformer :config="transformerConfig" ref="transformer" />
        </v-layer>
    </v-stage>
</div>
</template>

<script>
import DocumentService from "@/doc-ex/services/DocumentService";
import EventBus from "@/EventBus";
import Input from "@/doc-ex/components/Input.vue";
import DatePicker from "@/doc-ex/components/DatePicker.vue";
import lodash from "lodash"
import ValidationTooltip from "@/doc-ex/components/ValidationTooltip.vue";
import {
    scroller
} from 'vue-scrollto/src/scrollTo'
import Constants from "@/resources/Constants";
import moment from 'moment'


const scrollTo = scroller()

const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight
const canvasImageDifference = 10;

var options = {
    container: '.kp-left',
    easing: 'ease-in',
    offset: -150,
    force: true,
    cancelable: true,
    x: true,
    y: true
}

export default {
    name: "DocexCanvas",
    props: ["documentData", "selectedField", "isDocumentReadOnly", "fieldData", "loading", "tableData", "isTableSelected", "totalPages", "pageNumber", "searchText", "dateFormat", "componentConfig", "isDebuggerOn"],

    components: {
        Input,
        DatePicker,
        ValidationTooltip
    },
    watch: {
        isDebuggerOn: {
            handler: function (newVal, oldVal) {
                if (newVal) {
                    this.predicted_rectangles = []
                    this.transformerNode && this.transformerNode.detach();
                    this.dialogVisible = false
                    this.createDebuggingBBoxes()
                    this.createDebuggingText()
                } else {
                    this.debugger_rectangles = []
                    this.debugger_text = []
                    this.createBoundingBoxes(this.documentDataClone.prediction)
                }
            }
        },
        isDocumentReadOnly: {
            handler: function (newVal, oldval) {
                if (newVal) {
                    this.stageSize.listening = false
                }
            },
            immediate: true,
            deep: true
        },
        documentData: {
            handler: function (newVal, oldval) {
                this.documentDataClone = lodash.cloneDeep(newVal)
                if (!(newVal && newVal.prediction)) return;
                this.createBoundingBoxes(this.documentDataClone.prediction);
            },
            immediate: true,
            deep: true,
        },
        selectedField: {
            handler: function (newVal, oldval) {
                if (!newVal || (newVal.page_number !== this.pageNumber)) {
                    this.dialogVisible = false
                    return
                }
                if (newVal && newVal.name == "new_field" && newVal.bounds) {
                    this.new_val = newVal.value
                    return;
                }

                this.selectedShapeName = newVal && newVal.field_config && newVal.field_config.name;
                this.removeDrawnBox()
                if (lodash.isEmpty(newVal.bounds)) {
                    this.dialogVisible = false
                } else {
                    this.$nextTick(() => {
                        this.updateTransformer()
                        this.$nextTick(() => {
                            scrollTo(`#modal-box`, 10, options)
                        })
                    });
                }
            },
            immediate: true,
            deep: true,
        },
    },
    computed: {
        field_input_filter() {
            if (this.field_search_text) {
                return this.computedFieldData.filter(field => field.label.toLowerCase().includes(this.field_search_text.toLowerCase()));
            }
            return this.computedFieldData;
        },
        /*
        this property is used to search text on image
        */
        search_rectangles() {
            let search_rect_array = [];
            lodash.each(this.getOcrPageData(), (value) => {
                if (this.searchText && value[4].toLowerCase().includes(this.searchText.toLowerCase().trim())) {
                    this.drawSearchedBBox(search_rect_array, value)
                }
            });

            return search_rect_array
        },
        dialogSelectedField() {
            return lodash.cloneDeep(this.selectedField)
        },
        computedFieldData() {
            {
                let fieldData = lodash.cloneDeep(this.fieldData)
                let filter;
                if (lodash.get(this.dialogSelectedField, 'field_config.type') == 'date') {
                    filter = {
                        type: 'date'
                    }
                }
                return lodash.filter(fieldData, {
                    selected: true,
                    field_type: "header",
                    ...filter
                })
            }
        }
    },
    data() {
        return {
            field_search_text: '',
            patch: true,
            new_val: "",
            documentDataClone: '',
            prediction: '',
            preservedFieldValue: null,
            visibleConfirmationContent: false,
            componentMapping: {
                string: "Input",
                date: "DatePicker",
            },
            modalClickedData: "",
            posStart: "",
            dialogTop: "",
            dialogLeft: "",
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
            debugger_rectangles: [],
            debugger_text: [],
            selected_ocr_box: null,
            selectedShapeName: "",
            drawn_rect: {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                fill: 'rgba(180, 255, 205,0.3)',
                stroke: "rgba(0, 93, 166, 1)",
                strokeWidth: 0.5

            },
            configBackground: {},
        };
    },

    methods: {
        /*
        this method calls the defination of selected choice from toolbar
        from the document view page.
        */
        onInput() {
            this.dialogSelectedField.value = this.new_val
            this.$emit('update:selectedField', this.dialogSelectedField)
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

            if (lodash.get(this.dialogSelectedField, 'field_config.name') == lodash.get(data, 'name')) {
                return
            }
            this.visibleConfirmationContent = true
            this.modalClickedData = data;
            this.$refs.fieldDropDown.visible = false; // to hide the select dropdown manually

        },
        /*
        this method change the bounding box and data of selected field
        with the field to be changed.
        */
        changeFieldData() {
            let updatedField = lodash.find(this.documentDataClone.prediction, (field) => {
                return lodash.get(field, 'field_config.name') == lodash.get(this.modalClickedData, 'name')
            });

            let selectedField = lodash.cloneDeep(this.selectedField)
            if (lodash.get(selectedField, 'name') !== 'new_field') {
                let currentField = lodash.find(this.documentDataClone.prediction, (field) => {
                    return lodash.get(field, 'field_config.name') == lodash.get(selectedField, 'field_config.name')
                })
                currentField.bounds = []
                currentField.value = ''
            }

            updatedField.bounds = selectedField.bounds
            //if field getting updated is date type
            if (lodash.get(updatedField, 'field_config.type') == 'date') {

                if (lodash.get(selectedField, 'field_config.type') == 'date') {
                    updatedField.value = selectedField.value
                } else {
                    updatedField['original_value'] = selectedField['value']
                    let countryDateFormat = this.documentDataClone.country_date_format
                    let dateValue;
                    if (countryDateFormat) {
                        dateValue = moment(selectedField['value'], countryDateFormat, false)
                        dateValue = (!dateValue._isValid) ? moment(selectedField['value']) : dateValue
                    } else {
                        dateValue = moment(selectedField['value'])
                    }
                    let systemDateFormat = this.documentDataClone.system_date_format ? this.documentDataClone.system_date_format : countryDateFormat;
                    updatedField['value'] = dateValue._isValid ? dateValue.format(systemDateFormat) : selectedField['value']
                }

            } else {
                updatedField.value = selectedField.value
            }
            // updatedField.value = selectedField.value
            updatedField.page_number = selectedField.page_number
            this.$emit('update:selectedField', updatedField)
            this.$emit('update:documentData', this.documentDataClone)
            this.visibleConfirmationContent = false
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
                fill: 'rgba(180, 255, 205,0.3)',
                stroke: "rgba(0, 93, 166, 1)",
                strokeWidth: 0.5
            };

            this.transformerNode && this.transformerNode.detach();
        },
        /*
        this method push dialog box on the selected rectangle on image
        */
        moveDialogBox(rect) {
            this.visiblePopover = false
            if (rect) {
                this.dialogTop = (rect.y() + rect.height()) * this.zoomY + 30 + 'px'
                this.dialogLeft = (rect.x() * this.zoomX) + 'px'
                this.dialogVisible = true
            }

        },

        closeConfirmation() {
            this.visibleConfirmationContent = false
        },
        /*
        this method is used to zoom in the current stage size of image
        */
        zoomIn() {
            this.zoomX += 0.25;
            this.zoomY += 0.25;
            this.adjustStageSize()
            this.$refs.stage.$forceUpdate();
        },
        /*
        this method is used to zoom out the current stage size of image
        */
        zoomOut() {
            this.zoomX -= 0.25;
            this.zoomY -= 0.25;
            this.adjustStageSize()
            this.$refs.stage.$forceUpdate();
        },
        /*
        this method is used to set stage size to default
        */
        expand() {
            this.zoomX = 1;
            this.zoomY = 1;
            this.adjustStageSize()
            this.$refs.stage.$forceUpdate();
        },

        /*
        this method is used to get data url
        */
        getURI() {
            let stage = this.$refs["stage"].getNode()
            let dataURL = stage.toDataURL({ pixelRatio: 3 });
            return dataURL;
        },
        /*
        this method is used to delete selected bounding box
        */
        deleteBBox() {
            this.removeDrawnBox()
            this.dialogVisible = false
            this.$emit('update:selectedField', '');
            let field_deleted = lodash.find(this.documentDataClone.prediction, (field) => {
                return lodash.get(field, 'field_config.name') == this.selectedShapeName
            })

            if (!field_deleted) {
                let tableData = this.tableDataClone()
                let table_row_index = tableData[this.selectedField.field_config && this.selectedField.field_config.index]
                field_deleted = lodash.find(table_row_index, (row_cell) => {
                    return lodash.get(row_cell, 'field_config.name') == this.selectedShapeName;
                })
            }
            if (!field_deleted) {
                return
            }
            // if(lodash.get(field_deleted, 'field_config.type') == 'date')
            // {
            //     field_deleted.formatted_value = ''
            // }
            else {
                field_deleted.hasOwnProperty("value") ? field_deleted.value = '' : field_deleted.value = ''
            }
            field_deleted.bounds = []
            this.$emit('update:documentData', this.documentDataClone)
        },
        /*
        this method is used to draw bounding boxes of search text on image
        */
        drawSearchedBBox(search_rect_array, value) {
            search_rect_array.push({
                x: value[0] * this.scaleX - (canvasImageDifference / 2),
                y: value[1] * this.scaleY - (canvasImageDifference / 2),
                width: (value[2] - value[0]) * this.scaleX + canvasImageDifference,
                height: (value[3] - value[1]) * this.scaleY + canvasImageDifference,
                fill: 'rgba(255, 255, 36, 0.3)',
                stroke: 'rgba(43, 43, 43, 1)',
                draggable: false,

            });
        },
        /*
        this method gives ocr page data based on the page number
        */
        getOcrPageData() {
            return  this.documentDataClone.ocr_result[this.pageNumber - 1]
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
                rect = this.drawn_rect
            }

            /*
            update the state of rectangle according to the transformation
            */
            rect.x = e.target.x();
            rect.y = e.target.y();
            rect.rotation = e.target.rotation();
            rect.width = rect.width * e.target.scaleX();
            rect.height = rect.height * e.target.scaleY();
            rect.value = this.drawn_bounding_box_text(rect)

            /*
            to change value of input field on expand
            */

            if (this.selectedField && this.selectedField.name == 'new_field') {
                this.selectedField.value = rect.value
                let original_bounds = this.getOriginalBbox(rect)
                this.selectedField.bounds = [original_bounds.x, original_bounds.y, original_bounds.xmax, original_bounds.ymax]
                this.$emit('update:selectedField', this.selectedField);
            }
            e.target.scaleX(1);
            e.target.scaleY(1);

            /*
            when box is resized we need to change size of box with
            respect to orinalal size of image
            */
            this.transformRectangleToOriginal(rect)

        },
        transformRectangleToOriginal(rect) {
            let fieldData = this.getOriginalBbox(rect)
            let field = lodash.find(this.documentDataClone.prediction, (field) => {
                return lodash.get(field, 'field_config.name') == rect.name
            })
            if (!field) {
                let tableData = this.tableDataClone()
                let table_row_index = tableData[this.selectedField.field_config.index]
                field = lodash.find(table_row_index, (row_cell) => {
                    return lodash.get(row_cell, 'field_config.name') == rect.name;
                })
            }

            if (!field) return;
            field.bounds[0] = fieldData.x
            field.bounds[1] = fieldData.y
            field.bounds[2] = fieldData.xmax
            field.bounds[3] = fieldData.ymax

            // if(lodash.get(field, 'field_config.type') == 'date'){
            //     field.formatted_value = rect.value
            // }
            // else{
            field.hasOwnProperty('value') ? field.value = rect.value : field.value = rect.value
            //}
            this.$emit('update:documentData', this.documentDataClone)

        },
        /*
            this method is used fetch original size of box with resped to image
        */
        getOriginalBbox(rect) {
            let fieldData = {}
            fieldData.x = (rect.x + (canvasImageDifference / 2)) / this.scaleX
            fieldData.y = (rect.y + (canvasImageDifference / 2)) / this.scaleY
            fieldData.xmax = ((rect.width - canvasImageDifference) / this.scaleX) + fieldData.x
            fieldData.ymax = ((rect.height - canvasImageDifference) / this.scaleY) + fieldData.y
            return fieldData
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
            this.drawn_rect.x = posRect.x1 / this.zoomX
            this.drawn_rect.y = posRect.y1 / this.zoomY
            this.drawn_rect.width = (posRect.x2 - posRect.x1) / this.zoomX
            this.drawn_rect.height = (posRect.y2 - posRect.y1) / this.zoomY
            this.$refs["stage"].getNode().draw()
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
            if (this.mode === "drawing") {
                this.updateDrag({
                    x: e.evt.layerX,
                    y: e.evt.layerY,
                });
            }
        },

        /*
        this method draw the new rectangle if the mode is drawing
        */

        handleMouseUp(e) {
            try {
                if (this.mode == "drawing" && this.drawn_rect.width > 0 && this.drawn_rect.height > 0) {
                    let name = "rect_" + this.predicted_rectangles.length + 1;
                    let rect = {
                        x: this.drawn_rect.x,
                        y: this.drawn_rect.y,
                        width: this.drawn_rect.width,
                        height: this.drawn_rect.height,
                        fill: 'rgba(180, 255, 205,0.3)',
                        stroke: "rgba(0, 93, 166, 1)",
                        strokeWidth: 0.5,
                        name: name,
                        draggable: false
                    }
                    let value = this.drawn_bounding_box_text(rect)
                    rect.value = value
                    let original_bounds = this.getOriginalBbox(rect)
                    rect.bounds = [original_bounds.x,
                        original_bounds.y,
                        original_bounds.xmax,
                        original_bounds.ymax
                    ]

                    rect.page_number = this.pageNumber
                    this.selectedShapeName = rect.name
                    this.drawn_rect = lodash.cloneDeep(rect)
                    this.assignOcrData()

                }
            } catch (e) {
                console.log(e)
            } finally {
                this.mode = null;
            }
        },

        updateTableMappedField(rect) {
            let tableData = this.tableDataClone()
            let updatedField;
            lodash.each(tableData, (row) => {
                updatedField = lodash.find(row, (field) => {
                    return field.field_config && field.field_config.name == lodash.get(this.selectedField, 'field_config.name')
                })
                if (updatedField) return false
            });
            updatedField.bounds = rect.bounds;
            updatedField.value = rect.value;
            updatedField.page_number = rect.page_number;
            this.$emit('update:documentData', this.documentDataClone)

        },

        tableDataClone() {
            let tableData = _.find(this.documentDataClone.prediction, {
                'name': 'table'
            })
            return _.get(tableData, 'content.rows')
        },

        /*
        this method is called on mousedown
        1) when transformer is clicked we do nothing
        2) when rectangle is clicked we find its name if its a rectangle
           then we change value to right hand side to the clicked rectangle
        3) if its not rect or tranform then we set mode to drawing and start
           drawing new rectangle
        */

        handleStageMouseDown(e) {

            if (this.isDebuggerOn) {
                return
            }
            const clickedOnTransformer = e.target.getParent() && e.target.getParent().className === "Transformer";
            if (clickedOnTransformer) {
                return;
            }
            if (this.selectedField && this.selectedField.name == "new_field") {
                this.$emit('update:selectedField', '')
            }

            const name = e.target.name();
            this.dialogVisible = false
            const rect = this.predicted_rectangles.find((r) => r.name === name);
            let ocr_cordinate = this.ocr_text_available()

            if (rect) {
                this.selectedShapeName = name;
                let selectedField = lodash.find(this.documentDataClone.prediction, (field) => {
                    return field.field_config && field.field_config.name == this.selectedShapeName
                })

                if (!selectedField) {
                    lodash.each(this.tableData, (row) => {
                        let selected = lodash.find(row, (field) => {
                            return field.field_config && field.field_config.name == this.selectedShapeName
                        })
                        if (selected) {
                            selectedField = selected
                            return false
                        }
                    })
                }
                if (selectedField.field_config.name == this.selectedField.field_config.name) {
                    this.updateTransformer()
                } else {
                    this.$emit('update:selectedField', selectedField)
                    this.removeDrawnBox()
                }

            } else if (ocr_cordinate) {
                if (ocr_cordinate[4] == this.drawn_rect.name) {
                    return
                }
                this.handleOcrDoubleClick()
            } else {
                this.mode = "drawing";
                this.selectedShapeName = "";
                this.startDrag({
                    x: e.evt.layerX,
                    y: e.evt.layerY,
                });
                this.patch = false
                this.removeDrawnBox()

            }
        },

        /*
        this method gives the current position to draw the rectangle
        */
        startDrag(posIn) {
            this.posStart = {
                x: posIn.x,
                y: posIn.y,
            };
            this.posNow = {
                x: posIn.x,
                y: posIn.y,
            };
        },

        /*
        1) this method attach or detach the transformer node to rectangle
        2) do nothing if selected node is already attached
        3) move the dialog box of field to selected rectangle
        */

        updateTransformer() {
            this.transformerNode = this.$refs.transformer && this.$refs.transformer.getStage();
            const stage = this.transformerNode && this.transformerNode.getStage();
            const {
                selectedShapeName
            } = this;

            if (!selectedShapeName) {
                return
            }

            let selectedNode = stage && stage.findOne("." + selectedShapeName);
            selectedNode ? this.moveDialogBox(selectedNode) : this.dialogVisible = false

            if (this.transformerNode && (selectedNode === this.transformerNode) && this.transformerNode.node()) {
                return;
            }
            selectedNode ? this.transformerNode && this.transformerNode.attachTo(selectedNode) : this.transformerNode && this.transformerNode.detach();
            this.transformerNode && this.transformerNode.getLayer().batchDraw();
        },

        /*
        this method find out type of bounging box whether it is header or table
        and create the rectangle according to that
        */

        createBoundingBoxes(data) {
            if (lodash.isEmpty(data)) return;
            this.predicted_rectangles = [];
            lodash.each(data, (pred_value) => {
                if (this.pageNumber == pred_value.page_number &&
                    pred_value.name != "table" && pred_value.field_config &&
                    pred_value.field_config.selected &&
                    pred_value.bounds &&
                    pred_value.field_config.active) {
                    this.drawPredictedBoundBox(pred_value)

                } else {
                    if (pred_value.name == "table") {
                        lodash.each(pred_value.content.rows, (row_value) => {
                            lodash.each(row_value, (r_value) => {
                                if (!(this.pageNumber == r_value.page_number &&
                                        r_value.field_config &&
                                        r_value.bounds &&
                                        r_value.field_config.selected)) return;
                                this.drawPredictedBoundBox(r_value)
                            });
                        });
                    }
                }

            });
            this.$refs["stage"] && this.$refs["stage"].getNode().cache();
        },

        /*
        this method checks whether on mouse click cordinates ocr text is avaiable or not
        */
        ocr_text_available() {
            let pointer_position = this.$refs["stage"].getNode().getPointerPosition()
            let x_value = pointer_position.x / this.zoomX
            let y_value = pointer_position.y / this.zoomY
            return lodash.find(this.getOcrPageData(), (value) => {
                if (!value) {
                    return
                }
                let xmin = (value[0] * this.scaleX)
                let ymin = (value[1] * this.scaleY)
                let xmax = (value[2] * this.scaleX)
                let ymax = (value[3] * this.scaleY)
                return (x_value > xmin && x_value < xmax && y_value > ymin && y_value < ymax)
            })
        },

        /*
        this method creates the ocr bounding boxes on double click if it is
        inside the bounding box otherwise on single click
        */
        handleOcrDoubleClick() {
            let ocr_cordinate = this.ocr_text_available()
            if (!ocr_cordinate) return
            let ocr_rect = {
                x: (ocr_cordinate[0] * this.scaleX),
                y: (ocr_cordinate[1] * this.scaleY),
                width: ((ocr_cordinate[2] - ocr_cordinate[0]) * this.scaleX),
                height: ((ocr_cordinate[3] - ocr_cordinate[1]) * this.scaleY),
                name: ocr_cordinate[4],
                value: ocr_cordinate[4],
                bounds: [ocr_cordinate[0], ocr_cordinate[1], ocr_cordinate[2], ocr_cordinate[3]],
                draggable: false,
                fill: 'rgba(180, 255, 205,0.3)',
                stroke: "rgba(0, 93, 166, 1)",
                strokeWidth: 0.5,
                page_number: this.pageNumber
            }

            this.selectedShapeName = ocr_cordinate[4]
            this.drawn_rect = lodash.cloneDeep(ocr_rect)
            this.assignOcrData()

        },

        /*
        this method assign the clicked ocr box value to header or
        table value
        */

        assignOcrData() {
            if (this.isTableSelected) {
                this.updateTableMappedField(this.drawn_rect);
            } else {
                let drawn_rect_ref = this.$refs["drawn_rect"].getNode()
                this.$emit('update:selectedField', {
                    'name': 'new_field',
                    'value': this.drawn_rect.value,
                    'bounds': this.drawn_rect.bounds,
                    'page_number': this.drawn_rect.page_number
                });
                this.moveDialogBox(drawn_rect_ref)
                this.$nextTick(() => {
                    this.updateTransformer()
                });
            }
        },

        /*
        this method draws the selected type of bounding box on image
        parent_value is used in case of table as data is nested
        */

        drawPredictedBoundBox(value) {
            let obj = {};
            obj.x = value.bounds[0] * this.scaleX - (canvasImageDifference / 2);
            obj.y = value.bounds[1] * this.scaleY - (canvasImageDifference / 2);
            obj.width =
                (value.bounds[2] - value.bounds[0]) * this.scaleX + canvasImageDifference;
            obj.height =
                (value.bounds[3] - value.bounds[1]) * this.scaleY + canvasImageDifference;
            obj.fill = 'rgba(180, 255, 205,0.3)'
            obj.stroke = "rgba(0, 93, 166, 1)",
                obj.strokeWidth = 0.5,
                obj.name = value.field_config.name;
            obj.draggable = false;
            this.predicted_rectangles.push(obj);
        },

        /*
        this method is used to load image when previw page is called
        */

        loadImage() {
            return new Promise((resolve, reject) => {
                this.configBackground = {
                    image: new Image()
                }
                this.configBackground.image.src = this.documentDataClone.canvas_image_url[this.pageNumber - 1];
                // this.configBackground.image.src =require("./1.jpg");
                // this.configBackground.image.src ="https://kanverseqastorage.file.core.windows.net/docex/596e1ff30ae976279c1cb97f/invoice/Acctest/Invoice-3104-Nyati-2020APRRen000011-03.04.2020_-_6th_floor_phase_II_1604658031614_1.jpg?st=2020-11-06T11%3A00%3A44Z&se=2020-11-06T12%3A00%3A44Z&sp=r&sv=2018-03-28&sr=f&sig=UslGfY6FTcyrBEmK782N3lPs%2F5lUNvkM96k%2FHFbot0s%3D";
                this.configBackground.image.setAttribute('crossOrigin', 'anonymous');
                try {
                    this.configBackground.image.onerror = () => {
                        // this.$emit('update:loading', false)
                        this.notifyError(Constants.DOCEX.IMAGE_NOT_FOUND);
                        reject()
                    }
                    this.configBackground.image.onload = () => {
                        this.adjustImageSize()
                        this.adjustStageSize()
                        this.documentDataClone && this.createBoundingBoxes(this.documentDataClone.prediction);
                        this.$nextTick(() => {
                            this.updateTransformer()
                        });
                        resolve()
                    }
                } catch (ex) {
                    this.notifyError(Constants.DOCEX.IMAGE_NOT_FOUND);
                    reject()
                }
            })

        },

        /*
        this method is used to adjust stage size when some change occur
        */

        adjustStageSize() {
            (this.stageSize.width = (canvasWidth * 0.60) * this.zoomX),
            (this.stageSize.height = canvasHeight * this.zoomY),
            (this.stageSize.scaleX = this.zoomX);
            this.stageSize.scaleY = this.zoomY;
            this.canvasOuterWidth = (canvasWidth * 0.60 * this.zoomX) + 'px'
            this.canvasOuterHeight = (canvasHeight * this.zoomY) + 'px'
        },

        /*
        this method is used to adjust image size
        */
        adjustImageSize() {
            this.scaleX = ((canvasWidth * 0.60) + canvasImageDifference) / this.configBackground.image.width;
            this.scaleY = (canvasHeight + canvasImageDifference) / this.configBackground.image.height;
            this.configBackground.image.width = this.configBackground.image.width * this.scaleX;
            this.configBackground.image.height = this.configBackground.image.height * this.scaleY - 5;
        },

        /*
        this method is used to find out interaction area between drawn rectangle and ocr text box
        */

        intersection_bounding_box(a, b) {
            let word_area = (b.xmax - b.xmin) * (b.ymax - b.ymin)
            if (!((a.xmin < b.xmax) && (a.xmax > b.xmin) && (a.ymin < b.ymax) && (a.ymax > b.ymin)))
                return 0
            let dx = Math.min(a.xmax, b.xmax) - Math.max(a.xmin, b.xmin)
            let dy = Math.min(a.ymax, b.ymax) - Math.max(a.ymin, b.ymin)
            let intersection_area = dx * dy
            if (word_area == 0)
                return 0
            return (intersection_area / word_area) * 100
        },
        /*
          this method is used to find out text inside the drawn rectangle
        */

        drawn_bounding_box_text(rect) {
            let ocr_covered_boxes = []
            let rect_drawn = {
                xmin: rect.x,
                ymin: rect.y,
                xmax: (rect.x + rect.width),
                ymax: (rect.y + rect.height),
            }
            lodash.each(this.getOcrPageData(), (ocr_box) => {
                let ocr_rect = {
                    xmin: (ocr_box[0] * this.scaleX),
                    ymin: (ocr_box[1] * this.scaleY),
                    xmax: (ocr_box[2] * this.scaleX),
                    ymax: (ocr_box[3] * this.scaleY),
                }

                let intersection = this.intersection_bounding_box(rect_drawn, ocr_rect)
                if (intersection > 70) {
                    ocr_covered_boxes.push(ocr_box)
                }
            })

            return lodash.map(ocr_covered_boxes, (box) => {
                return box[4]
            }).join(' ')
        },
        createDebuggingBBoxes() {
            this.debugger_rectangles = [];
            lodash.each(this.documentDataClone.prediction, (pred_value) => {
                if (this.pageNumber == pred_value.page_number &&
                    pred_value.name != "table" &&
                    pred_value.od_bounds) {
                    this.drawDebugginBBox(pred_value)

                } else {
                    if (pred_value.name == "table" && pred_value.page_number == this.pageNumber) {
                        this.drawDebugginBBox(pred_value)
                        lodash.each(pred_value.content.headers, (header_value) => {
                            if (!(this.pageNumber == header_value.page_number && header_value.od_bounds)) return;
                            header_value.name = 'header'
                            this.drawDebugginBBox(header_value)

                        });

                        lodash.each(pred_value.content.rows, (row_value) => {
                            lodash.each(row_value, (r_value) => {
                                if (!(this.pageNumber == r_value.page_number &&
                                        r_value.od_bounds)) return;

                                r_value.name = 'cell'
                                this.drawDebugginBBox(r_value)
                            });
                        });
                    }
                }

            });
        },
        /*
          this method is used to draw debugger data bounding boxes
        */
        drawDebugginBBox(value, index) {
            let obj = {};
            obj.x = value.od_bounds[0] * this.scaleX - (canvasImageDifference / 2);
            obj.y = value.od_bounds[1] * this.scaleY - (canvasImageDifference / 2);
            obj.width =
                (value.od_bounds[2] - value.od_bounds[0]) * this.scaleX + canvasImageDifference;
            obj.height =
                (value.od_bounds[3] - value.od_bounds[1]) * this.scaleY + canvasImageDifference;
            obj.stroke = "rgba(0, 93, 166, 1)"
            obj.strokeWidth = 1,
                obj.draggable = false;
            obj.name = value.name
            obj.text = value.predicted_key ? value.name + '(' + value.predicted_key + ')' : value.name
            obj.predicted_score = value.value_score
            this.debugger_rectangles.push(obj);
        },
        createDebuggingText() {
            _.each(this.debugger_rectangles, (value) => {
                let obj = {};
                obj.text = value.text
                obj.x = value.x
                obj.y = value.y - 8
                obj.fill = 'red'
                obj.fontSize = 8
                obj.opacity = 0.75
                this.debugger_text.push(obj);
            })
        },
        registerEvents() {
            EventBus.$on("handle_toolbar_click", (clickId) => {
                this.handleToolbarClick(clickId)
            });
        }
    },
    beforeMount() {
        this.registerEvents();
    }

};
</script>

<style lang="scss">
//update-

.message-pointer {
    position: absolute;
    top: -6px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #005DA6;
}

.kp-field-drowdown-docx::-webkit-scrollbar {
    width: 4px;
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

.el-dropdown-menu {

    .field-search-box:not(.is-disabled):hover,
    .el-dropdown-menu__item:focus {
        background: white;
    }
}

.update-modal-wrap {
    width: 200px;
    padding: 12px;
    background: #005DA6;
    border-radius: 10px;
    position: absolute;
    z-index: 100;
    text-align: center;
    box-shadow: 0 0px 24px #b2bbca;

    .kp-date-view {
        position: unset;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        text-align: center;
    }

    .input_inner .el-input__inner {
        padding-left: 0px !important;
        padding-right: 0px !important;
        height: 21px !important;
    }

    .error-info {
        color: red;
    }

    .title {
        color: #FFFFFF;
        font-weight: bold;
    }

    .el-button.is-circle {
        i {
            font-size: 16px;
            font-weight: 700;
        }
    }

    .el-input__inner::placeholder {
        color: #FFFFFF;
        opacity: 1;
    }

    .el-input__prefix {
        display: none;
    }

    .el-input__inner {
        text-align: center !important;
    }

    .el-input.is-disabled .el-input__inner {
        background-color: transparent;

        color: #131313;
        border: 0;
        cursor: not-allowed;

        &::placeholder {
            color: #FFFFFF;
            opacity: 1;
        }
    }

    .el-dropdown {
        margin-bottom: 5px;
    }

    .el-dropdown-link {
        cursor: pointer;
        color: #FFFFFF;
        font-weight: bold;
        border: 0;
    }

    .btn-delet {
        border: 0;
        position: absolute;
        top: 0;
        right: -16px;
        z-index: 999;
        background: #005DA6;
        color: #FFFFFF;
    }

    .confirm-modal {
        background: transparent;
        border: 0;
        text-align: center;
        border-radius: 7px;
        width: 100%;
        color: #FFFFFF;
        overflow: visible;

        p {
            color: #FFFFFF;
            margin: 7px 0;
        }

        .buttons-container {
            margin-top: 12px;
        }

    }

    // confirmation

}

// end upload modal wrap

.el-dropdown-link {
    cursor: pointer;
    // color: #409EFF;
}

.el-icon-arrow-down {
    font-size: 12px;
}

.input_inner {

    .el-input__inner {
        height: 30px;
        background: transparent !important;
        border: none !important;
        color: #FFFFFF !important;
        font-weight: bold;
        padding-left: 0px !important;
        // text-align: right !important;
    }

}

.canvas_cs {
    // overflow-x: auto;
    // overflow-y: auto;
    position: relative;
    padding: 20px;
}
</style>
