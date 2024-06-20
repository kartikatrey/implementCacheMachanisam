<template>
<div class='kp-question-wrap'>
    <div v-for="(question, index) in questionArray" class="qna-question kp-form-input-1 kp-form-field">
        <div v-if="!question.isEditable" class="kp-question">
            <span>{{question.value}}</span>
            <span class="kp-input-buttons">
                <el-button class="btn-edit" slot="append" @click="editQuestion(question, index)" icon="el-icon-edit"></el-button>
                <el-button class="btn-close" v-if="questionArray.length > 1" name="remove-question" @click="removeQuestion(index)" slot="append" icon="el-icon-error"></el-button>
            </span>
        </div>
        <div v-else class="qna-input-wrap">
            <div v-if="!question.isValid">
                <span class="error-message">{{question.errorMessage}}</span>
                <div class="error-message-pointer"></div>
            </div>
            <el-input v-bind:class="{'qna-field-error' : !question.isValid}" class="input-with-select kp-add-question" :ref="'input'+index" :placeholder="(index == 0) ? 'Add question':'Add alternate question'" @input="handleInput(index, question)" @keyup.enter.native="saveQuestion(question, index)" style="margin-bottom:5px" v-model="question.value" @blur="handleBlur(question, index)">
                <el-button class="btn-check" type="primary" :disabled="!question.value.trim()" name="add-question" slot="append" icon="el-icon-success" @mousedown.native="saveQuestion(question, index)"></el-button>
                <el-button class="btn-close" v-if="questionArray.length > 1 && index != questionArray.length-1" name="remove-question" @mousedown.native="removeQuestion(index)" slot="append" icon="el-icon-error"></el-button>
            </el-input>
        </div>

    </div>
</div>
</template>

<script>
import EventBus from "@/EventBus";
import lodash from "lodash";
import Constants from "@/resources/Constants";
export default {
    name: "QnaQuestion",
    props: ["propData", "options"],
    data() {
        return {
            questionArray: [],
            defaultInput: {
                value: '',
                isEditable: true,
                default: true,
                isValid: true,
                errorMessage: ''
            }
        }
    },
    watch: {
        propData: {
            handler: function (newVal, oldVal) {
                let fieldName = newVal.column.field;
                let questionArr = lodash.cloneDeep(newVal.formattedRow[fieldName]);
                questionArr = this.processData(questionArr)
                let isDefaultInputPresent = lodash.some(questionArr, {
                    default: true
                });
                !isDefaultInputPresent ? questionArr.push({
                    ...this.defaultInput,
                }) : null
                this.questionArray = questionArr;

            },
            immediate: true
        }

    },
    methods: {
        processData(questionArr) {
            !lodash.isEmpty(questionArr) ? lodash.map(questionArr, (ele, index, array) => {
                ele.isEditable = lodash.isBoolean(ele.isEditable) ? ele.isEditable : false;
                ele.isValid = lodash.isBoolean(ele.isValid) ? ele.isValid : true;
                ele.errorMessage = ele.errorMessage;
            }) : questionArr = [{
                ...this.defaultInput,
            }];
            return questionArr
        },

        validate() {
            _.each(this.questionArray, (question, index, arr) => {
                (!this.isAlternateQuestion(index) && lodash.isEmpty(question.value)) ? this.setValidationFlag(question): null
            })
            this.updateDatatable()
            let isDataInvalid = lodash.some(this.questionArray, (question) => {
                return question.isValid == false
            })
            let isValid = isDataInvalid ? false : true;
            return isValid
        },

        editQuestion(question, index) {
            question['isEditable'] = true
            this.$nextTick(()=>{this.focusInput(index)});
            this.updateDatatable()
        },
        removeQuestion(index) {
            this.questionArray.splice(index, 1);
            this.updateDatatable()
        },
        saveQuestion(question, index) {
            if (lodash.isEmpty(question.value.trim())) {
                this.setError(question, index)
                return
            }
            //add alternate question if last question is saved
            if (index === this.questionArray.length - 1) {
                this.addAlternateQuestion()
            }
            question['isEditable'] = false
            this.resetError(question);
            this.$nextTick(() => {this.focusInput(this.questionArray.length - 1)})       
        },

        addAlternateQuestion() {
            this.questionArray.push({
                ...this.defaultInput
            });
        },

        focusInput(index) {
                this.$refs[`input${index}`][0].focus();
        },
        handleBlur(question, index) {
            (lodash.isEmpty(question.value.trim()) && !this.isAlternateQuestion(index)) ? this.setError(question, index) : this.resetError(question)
        },

        setError(question, index) {
            this.focusInput(index)
            this.setValidationFlag(question)
            this.updateDatatable();

        },

        setValidationFlag(question) {
            question['isValid'] = false
            question['errorMessage'] = Constants.DATATABLE_REQUIRED_FIELD_MSG
        },

        resetError(question) {
            question['isValid'] = true
            this.updateDatatable()
        },

        isAlternateQuestion(index) {
            return (this.questionArray.length > 1 && index == this.questionArray.length - 1)
        },

        handleInput(index, question) {
            if (!this.isAlternateQuestion(index) && !lodash.isEmpty(question.value.trim())) {
                this.resetError(question)
                return;
            }
            this.updateDatatable()
        },
        updateDatatable() {

            let params = {
                propData: this.propData,
                value: this.questionArray
            }
            this.$emit("onDataUpdate", params);
        }
    },

};
</script>

<style lang="scss">
.qna-input-wrap {
    position: relative;

    .error-message {
        position: absolute;
        right: 0;
        top: -20px;
        background-color: red;
        color: white;
        font-size: 10px;
        padding: 2px 5px 2px 5px;
        border-radius: 3px;
    }

    .error-message-pointer {
        position: absolute;
        top: -3px;
        right: 7px;
        width: 0;
        height: 0;
        border-left: 3px solid transparent;
        border-right: 3px solid transparent;
        border-top: 3px solid red;
    }
}

.qna-field-error {
    border: 1.5px solid red;
}

 .qna-question {
    padding-right: 30px;
 }

.kp-form-field {
    // margin-bottom: 7px !important;
}

.kp-question-wrap {
    padding: 20px 20px 20px 0px;
    min-width: 280px;
    width:100%;
    .el-input-group__append {
        padding: 0px !important
    }

    .el-input{
        padding-top: 0px !important;
    }
    input{
            height: auto !important
    }

    .btn-close {
        color: red !important;
    }

    .kp-add-question {
        .btn-close {
            padding-left: 10px;
            border-radius: 0px;
            border-left: 1px solid #e8d7d7 !important;
        }

        button {
            color: #00A7E0 !important;
            padding-right: 10px;
            padding-left: 10px;
            margin: 0px
        }
    }
}

.kp-question {
    word-wrap: break-word;
    min-height: 21px;
    border: 1px solid #dcdfe6;
    border-radius: 5px;
    padding: 3px 3px 3px 7px;
    position: relative;
    margin-bottom: 7px;
    padding-right: 65px;

    .btn-edit {
        position: absolute;
        right: 31px;
        top: 2px;
        color: #00A7E0;
        padding: 5px;
        border: 0;
    }

    .btn-close {
        position: absolute;
        right: 5px;
        top: 2px;
        padding: 5px;
        border: 0;
        margin: 0;
    }
}

.kp-add-question {
    .el-icon-circle-plus {
        color: #00A7E0;
        font-size: 16px;
    }
}
</style>
