<template>
<div class="qna-text-editor">
    <div v-if="!data.isEditable" class="kp-editor-readonly-wrap">
        <el-button type="text" class="editor-btn-edit" slot="append" @click="handleEdit" icon="el-icon-edit"></el-button>
        <div class="kp-editor-readonly" v-html="data.value">
        </div>
    </div>
    <div v-else class="qna-input-wrap">
        <div v-if="!data.isValid">
            <span class="error-message">{{data.errorMessage}}</span>
            <div class="error-message-pointer"></div>
        </div>
        <el-button class="kp-editor-save" :disabled="!data.value.trim()" name="add-answer" slot="append" icon="el-icon-circle-check" @mousedown.native="saveValue()"></el-button>
        <vue-editor :id="editorId" :editorOptions="editorOption" :ref="editorId" v-bind:class="{'qna-field-error': !data.isValid}" :editorToolbar="customToolbar" @input="handleInput" class="kp-editor" v-model="data.value"></vue-editor>
    </div>
</div>
</template>

<script>
import EventBus from "@/EventBus";
import lodash from "lodash"
import $ from 'jquery'
import {
    VueEditor
} from "vue2-editor";
import Constants from "@/resources/Constants";
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import {
    quillEditor,
    Quill
} from 'vue-quill-editor'
import {
    htmlEditButton
} from "@/script/quillHtmlEdit.js";
Quill.register("modules/htmlEditButton", htmlEditButton);

export default {
    name: "Editor",
    props: ["propData", "options"],
    components: {
        VueEditor,
        quillEditor
    },
    data() {
        return {
            data: {},
            customToolbar: Constants.EDITOR_TOOLBAR,
            editorId: `editor_${this.propData.index}`,
            editorOption: {
                modules: {
                    // ...
                    htmlEditButton: {
                        debug: true ,// logging, default:false
                        msg: "Edit the content in HTML format", //Custom message to display in the editor, default: Edit HTML here, when you click "OK" the quill editor's contents will be replaced
                        okText: "Ok", // Text to display in the OK button, default: Ok,
                        cancelText: "Cancel" // Text to display in the cancel button, default: Cancel
                    }
                }
            }
        }
    },
    computed: {
        getId() {
            return `editor` + this.propData.index
        }
    },
    watch: {
        propData: {
            handler: function (val, oldval) {
                let fieldName = val.column.field;
                let fieldValue = lodash.cloneDeep(val.formattedRow[fieldName])
                this.data = {
                    'value': fieldValue['value'] || '',
                    'isEditable': lodash.isEmpty(fieldValue['value']) ? true : (fieldValue['isEditable'] || false),
                    'isValid': lodash.isBoolean(fieldValue['isValid']) ? fieldValue['isValid'] : true,
                    'errorMessage': fieldValue['errorMessage'] ? fieldValue['errorMessage'] : ''
                }
            },
            immediate: true,
            deep: true
        },

        'data.isEditable': {
            handler: function (val, oldval) {
                val ? this.bindBlurEvent() : this.unbindBlurEvent()
            },
            immediate: true,
            deep: true
        },

    },
    methods: {

        validate() {
            lodash.isEmpty(this.data.value.trim()) ? this.setError() : this.data.isValid = true
            this.updateDatatable()
            return this.data.isValid
        },

        setError() {
            this.data.isValid = false
            this.data.errorMessage = Constants.DATATABLE_REQUIRED_FIELD_MSG
        },

        handleBlur(event) {
            console.log(event)
            if (lodash.isEmpty(this.data.value.trim())) {
                this.setError()
                //this.setFocus()
                this.updateDatatable()
            }
        },

        setFocus() {
            this.$refs[this.editorId].quill.focus();
        },

        saveValue() {
            this.data.isValid = true;
            this.data.isEditable = false;
            this.updateDatatable()
        },
        handleEdit() {
            this.data.isEditable = true
            this.setFocus()
        },

        handleInput() {
            if (!lodash.isEmpty(this.data.value.trim()) && !this.data.isValid) {
                this.data.isValid = true;
            }
            this.updateDatatable()
        },

        updateDatatable() {
            let params = {
                propData: this.propData,
                value: this.data
            }
            this.$emit("onDataUpdate", params);
        },

        bindBlurEvent() {
            this.$nextTick(() => {
                let selector = this.getQuillEditorSelector()
                $(selector).off("blur").on("blur", (event) => {
                    this.handleBlur(event)
                });
            })

        },

        unbindBlurEvent() {
            let selector = this.getQuillEditorSelector()
            $(selector).off("blur");
        },

        getQuillEditorSelector() {
            return `#${this.editorId} .ql-editor`
        }

    }

};
</script>

<style lang="scss">
.ql-html-overlayContainer {
    background: #0000007d;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
}

.ql-html-popupContainer {
    background: #ddd;
    position: absolute;
    top: 5%;
    left: 5%;
    right: 5%;
    bottom: 5%;
    border-radius: 10px;
}

.ql-html-textContainer {
    position: relative;
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    padding: 20px;
}

.ql-html-textArea {
    position: absolute;
    left: 15px;
    width: calc(100% - 45px);
    height: calc(100% - 116px);
}

.ql-html-buttonCancel {
    margin-right: 20px;
}

.ql-html-popupTitle {
    margin: 0;
    display: block;
}

.ql-html-buttonGroup {
    position: absolute;
    bottom: 20px;
    transform: scale(1.5);
    left: calc(50% - 60px);
}

//-------class given to td
.qna-answer {
    width: 350px;
}

//-------------------------
.qna-text-editor {
    padding: 20px 20px 20px 0px;
    position: relative;

    .kp-editor-save {
        padding-left: 12px;
        padding-right: 12px;
        position: absolute;
        right: 7px;
        top: 2px;
        height: 45px;
        color: #00A7E0;
        background-color: #fcfcfc;
        border: none;
        border-radius: 0px;
        border-left: 1px solid #ded9d9;
    }

    .kp-editor-readonly-wrap {
        position: relative;
    }

    .editor-btn-edit {
        position: absolute;
        top: 1px;
        right: 15px;
        color: #00A7E0;
    }

    .kp-editor-readonly {
        word-break: break-all;
        background-color: #D2D7EA;
        // width: auto;
        // max-width: 350px;
        height: auto;
        max-height: 135px;
        overflow-y: auto;
        padding: 30px 32px 20px 20px;
        border: 1px solid #dcdfe6;
        background-color: #f5f7fa;
        color: #909399;
        border-radius: 10px;

        p {
            margin: 0;
        }
    }

    .kp-editor-readonly::-webkit-scrollbar {
        width: 7px;
    }

    .kp-editor-readonly::-webkit-scrollbar-track {
        border-radius: 50px;
        background-color: #f5eded;
        ;
    }

    .kp-editor-readonly::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px #d0d0d0;
    }

    .kp-editor {
        width: 100%;
    }

}
</style>
