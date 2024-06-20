<template>
<div class="kp-docx-input">
       <el-tooltip  placement="top" :disabled="!showValueTooltip" :content="tooltipContent" effect="light">

    <el-select
        :disabled="checkIfFieldDisabled"
        :cid="cid"
        :placeholder="placeholder"
        v-model="inputVal"
        filterable 
        clearable
        @change="handleInput($event); handleEvent('change', $event);"
        @focus="handleFocus(); handleEvent('focus', $event);"
        @clear="handleFocus(); handleEvent('clear', $event);">
        <el-option v-for="data in selectOptions" :label="data.key" :value="data.value" :key="data.key"></el-option>
    </el-select>
        </el-tooltip>

</div>
</template>

<script>
import _ from 'lodash'
import EventBus from "@/EventBus";
import ValidationTooltip from "@/idp/components/ValidationTooltip.vue";
import DocumentService from "@/idp/services/DocumentService";
import formMixin from "@/mixins/formMixin.js";
export default {
    name: 'Dropdown',
    mixins: [formMixin],
    components: {
        ValidationTooltip
    },
    props: [
        "props",
        'propData',
        'isTable',
        "tableName",
        'isDocumentReadOnly',
        'isDialog', // "Set to `true` when the request is intended for the Canvas Field Dialog, eliminating the need to create a separate `cid` (identifier) for the table field and dialog field, which is used to focus on the table field."
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
            return this.isDocumentReadOnly || this.isMasked || this.isFieldDisabled(this.props.field_config)
        },
        cid(){
            return DocumentService.createFieldCid(this.props, this.tableName, this.isDialog)
        },
         isMasked(){
             return !this.canSeePIIData() && _.get(this.props, 'field_config.is_masked')
        },
        showValueTooltip(){
            try{
                let showToolTip=false
                const valueLength = this.inputVal ? this.inputVal.length:0;
                if(valueLength>0){
                    showToolTip= true;
                    this.tooltipContent = this.getTooltipContent();
                }
                return showToolTip;
            }catch(e){
                console.log(e)
                return showToolTip;
            }
        },
    },

    data() {
        return {
            validationMsgs: [],
            inputVal: this.props.value,
            selectOptions: [],
            inputValueChangedEventName:"",
            tooltipContent : ""
        };
    },
    methods: {

        /**
        *Purpose : This function is called to get the key value of selected option for tooltip.
        */
        getTooltipContent() {
            let tooltipContent = "";
            const tooltipContentObj = (this.selectOptions && this.selectOptions.length) ? this.selectOptions.find(obj => obj.value === this.inputVal) : {};
            // Check if an object with the specified value was found
            if (tooltipContentObj && tooltipContentObj.key) {
                tooltipContent = tooltipContentObj.key;
            }
            return tooltipContent;
        },

        /**
        *Purpose : This function is called to handle any event related to UI Event Script.

        *It executes the handleScript from formmixin which further conducts flow of UI Event Script

        *@eventType A string indicating the name of event
        *@event An object refers to the event object that is passed to an event handler function when an event is triggered
        */
        async handleEvent(eventType, event){
            const fieldId = _.get(this.props,"field_config._id")
           this.handleScript(this,fieldId, eventType, event)
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
                'name': _.get(this.props, 'field_config.name'),
                'index': this.props.field_config.index,
                'table_index':this.props.field_config.tableIndex,
                'field_type': this.props.field_config.field_type,
                'field_config' : this.props.field_config,
                'is_table': this.isTable,
                'table_name': this.tableName
            }
            EventBus.$emit('update-field-value', params)
            // This will update new value in IdpLineTable
            this.$emit('updateTableFieldValue', params);
        },

        handleFocus() {
            if (this.props) {
                const previousSelectedField = this.$store.getters["documentViewStore/selectedField"];
                this.$store.commit("documentViewStore/setSelectedField",this.props);
                if(this.props.page_number){
                    const params =   { previous_selected_field: previousSelectedField, current_selected_field: this.props };
                    EventBus.$emit("SelectedFieldChangedOnPage__"+ this.props.page_number, params)
                } else{
                    EventBus.$emit("ResetSelectedDialog") // Hide the selected dialog on the canvas if it was active before.
                }
            }
        },
        // Set dropdown options and default selected value 
        setDropdownOptions(fieldData){
            //in case of dropdown set through field's configuration we get options under field_config key.
            this.selectOptions = _.get(fieldData, "options") || _.get(fieldData, "field_config.options", []);
            this.inputVal = _.get(fieldData, "value", "")
        },
    },
    beforeMount() {
        /**
         * Implement the InputValueChanged__<field_name> event registration, which facilitates a two-way value synchronization mechanism.
         * For instance, when modifying a header field's value within the field card, 
         * this event ensures that the corresponding focused field value on the canvas also updates seamlessly. 
         **/
        this.setDropdownOptions(this.props);
        const params = { table_name : this.tableName, is_table : this.isTable, name : this.props.field_config.name };
        this.inputValueChangedEventName = DocumentService.createValueChangeEventName(params);
        EventBus.$on(this.inputValueChangedEventName, (value)=>{
            this.inputVal = value;
        })
    },
    beforeDestroy() {
        
    },
    updated(){
        // console.log("Dropdown::updated")
    },
};
</script>

