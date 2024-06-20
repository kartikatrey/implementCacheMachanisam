<template>
<div class="kp-docx-input" v-on:click="handleEvent('click', $event);">
    <el-select :disabled="checkIfFieldDisabled"
        :name="props.field_config.name"
        v-model="inputVal"
        :cid="cid"
        :placeholder="placeholder"
        filterable allow-create default-first-option clearable
        @change="handleFocus();handleInput($event);handleEvent('change', $event);"
        @focus="handleFocus();handleEvent('focus', $event);"
        @blur="handleEvent('blur', $event);"
        @clear="handleFocus();handleEvent('clear', $event);"
         >
        <el-option v-for="data in selectOptions" :label="data.key" :value="data.value" :key="data.key"></el-option>
    </el-select>
    <validation-tooltip slot="suffix" v-if="hasValidationMessages" :validationMsgs="props && props.validationMsgs"></validation-tooltip>
</div>
</template>

<script>
import lodash from 'lodash'
import EventBus from "@/EventBus";
import validator from 'validator';
import Constants from "@/resources/Constants";
import ValidationTooltip from "@/idp/components/ValidationTooltip.vue";
import formMixin from "@/mixins/formMixin.js";
import {setTableInputClass} from "@/util/CommonUtil";
import DocumentService from "@/idp/services/DocumentService";

export default {
    name: 'DocExDropdown',
    components: {
        ValidationTooltip,
    },
    mixins: [formMixin],
    props: [
        "props",
        'isTable',
        "tableName",
        'propData',
        'isDocumentReadOnly',
        'selectedField',
        'documentType',
        'isDialog' // "Set to `true` when the request is intended for the Canvas Field Dialog, eliminating the need to create a separate `cid` (identifier) for the table field and dialog field, which is used to focus on the table field."
    ],
    watch:{
        "props.value":{
            handler: function (newVal, oldVal){
                if(newVal !== oldVal){
                    // console.log("Dropdown watcher :: ", this.props.field_config.name);
                    this.inputVal = newVal;
                }
            }
        }
    },
    computed: {
        // In some fields, we don't want to add a custom placeholder or display a placeholder, e.g., GL Code.
        // Adding a default value like "Select" makes no sense because we intend to add a new value to that dropdown.
        placeholder() {
            let placeholder = "Select";
            if(_.has(this.props.field_config, "placeholder")){
                placeholder =  this.props.field_config.placeholder
            }
            return placeholder;
        },
        checkIfFieldDisabled(){
            return this.isDocumentReadOnly || this.isFieldDisabled(this.props.field_config)
        },
        hasValidationMessages(){
            this.updateValidationStyles();
            return this.isTable && this.props && this.props.validationMsgs && this.props.validationMsgs.length > 0;
        },
        
        cid(){
            return DocumentService.createFieldCid(this.props, this.tableName, this.isDialog)
        },
        showValueTooltip(){
            try{
                let showToolTip=false
                const valueLength = this.inputVal ? this.inputVal.length:0;
                if(valueLength>0){
                    showToolTip= true;
                }
                return showToolTip;
            }catch(e){
                console.log(e)
                return showToolTip;
            }
        },
        showSelectedValue(){
            for(let i=0;i<this.selectOptions.length;i++){
                if(this.selectOptions[i]['value']==this.inputVal){
                    return this.selectOptions[i]['key']
                }
            }
        },
    },

    data() {
        return {
            validationMsgs: [],
            inputVal: this.props.value,
            constant:Constants.DOCEX,
            selectOptions:[],
            inputValueChangedEventName:""
            };
    },
    methods: {
        /**
         * Purpose: This function updates the border style of an input element based on the presence of validation messages.
         * If validation messages are present, it applies an error border style; otherwise, it applies the default border style.
         */
        updateValidationStyles(){
            const element = document.querySelector(`[cid="${this.cid}"]`);
             if (!element) return;

            const hasValidationMsgs = this.props && this.props.validationMsgs && this.props.validationMsgs.length > 0;
            if (hasValidationMsgs) {
                element.classList.add("input-error-border");
            } else {
                element.classList.remove('input-error-border');
            }
        },
        /**
        *Purpose : This function is called to handle any event related to UI Event Script.

        *It executes the handleScript from formmixin which further conducts flow of UI Event Script

        *@eventType A string indicating the name of event
        *@event An object refers to the event object that is passed to an event handler function when an event is triggered
        */
        async handleEvent(eventType, event) {
            const fieldId = _.get(this.props, "field_config._id")
            this.handleScript(this, fieldId, eventType, event)
        },

        handleInput(event) {
            this.inputVal = event
            /**
             * Using the same event name for all fields would lead to unintended event listening by other instances of Dropdown.vue/Input.vue
             * Hence, we've devised distinct events for each field to prevent such interference.
             **/
            EventBus.$emit(this.inputValueChangedEventName, this.inputVal)
            this.updatePredictionData()
        },


        updatePredictionData() {
            let params = {
                'value': this.inputVal,
                'name': this.props.field_config && this.props.field_config.name,
                'validation': this.validationMsgs,
                'index': this.props.field_config && this.props.field_config.index,
                'table_index':this.props.field_config && this.props.field_config.tableIndex,
                'field_type': this.props.field_config && this.props.field_config.field_type,
                'is_table': this.isTable,
                'table_name': this.tableName
            }
            EventBus.$emit('update-field-value', params)
            // This will update new value in IdpLineTable
            this.$emit('updateTableFieldValue', params);
        },
        isNumber(params) {
            let isValid = /^-?\d+\.?\d*$/.test(this.inputVal) ? true : false;
            return isValid;
        },
        isFieldNotEmpty(params) {
            let isValid = validator.isEmpty(params) ? false : true;
            return isValid;
        },
        handleFocus() {
            if (this.propData) {
                const previousSelectedField = this.$store.getters["documentViewStore/selectedField"];
                this.$store.commit("documentViewStore/setSelectedField",this.props);
                if(this.props.page_number){
                    const params =   { previous_selected_field: previousSelectedField, current_selected_field: this.props };
                    EventBus.$emit("SelectedFieldChangedOnPage__"+ this.props.page_number, params)
                } else{
                    EventBus.$emit("ResetSelectedDialog")
                }
            }
            /* Removed inputClass computed property as it is getting called multiple times when selectedField is changed, due to this table performance was slow.
                Whenever user changes selectedField handleFocus is called, so we are changing inputClass property in handleFocus instead of computed property to set focus on new field(element).
                Added to mark perticular field as selected
            */
            setTableInputClass(this.props, this.tableName)
        },
        setDropdownSelectOptions(){
            // Check for options in this.props; if not found, default to null.
            // If options are not found in the first check or if its default value is an empty array or object,
            // the second condition will never be executed due to the truthy nature of empty arrays and objects.
            this.selectOptions = lodash.get(this.props, 'options', null) || lodash.get(this.propData, 'column.config.select_options', []);
            this.selectOptions = this.selectOptions.filter(option => option && option.key && option.value);
        },
    },
    
    beforeMount() {
        this.inputVal = this.props.value;
        /**
         * Implement the InputValueChanged__<field_name> event registration, which facilitates a two-way value synchronization mechanism.
         * For instance, when modifying a header field's value within the field card, 
         * this event ensures that the corresponding focused field value on the canvas also updates seamlessly. 
         **/
        const params = { table_name : this.tableName, is_table : this.isTable, name : this.props.field_config.name };
        this.inputValueChangedEventName = DocumentService.createValueChangeEventName(params);
        EventBus.$on(this.inputValueChangedEventName, (value)=>{
            this.inputVal = value;
        })    
        this.setDropdownSelectOptions()
    },
    beforeDestroy() {},
    updated(){
        // console.log("DropdownDocEX::updated" + this.props.name)
    },

};
</script>

<style lang="scss">
.field-error {
    border: 1.5px solid red;
}

.kp-docx-input {
    .el-select{
        .el-input__inner {
            height: 30px !important;
        }
    }
    input {
        background: transparent;
        border: none;
        color: #212121;
        text-align: left;
    }

    .input-border {
        border: 2px solid #00a7e0;
    }

    .input-error-border {
            border: 2px solid #C53030 !important;
    }
}

</style>
