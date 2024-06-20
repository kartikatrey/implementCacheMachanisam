<template>
    <div>
        <el-tooltip  placement="top" :disabled="showToolTip" :content="content" effect="light">
        	<el-select 
                class="el-drop-down"  
                :disabled="checkIfFieldDisabled" v-model="inputVal" 
                :cid="cid"
                @focus="onFocus()" 
                @change="onChange()" 
                filterable
                clearable 
                multiple >
            	<el-option  v-for="data in optionsList" :label="data.key" :value="data.value" :key="data.key"></el-option>
        	</el-select>
        </el-tooltip>
    </div>
</template>
    
<script>
import _ from 'lodash'
import EventBus from "@/EventBus";
import DocumentService from "@/idp/services/DocumentService";

export default {
    name: 'MultiSelect',
    props: [
        'props',
        'isTable',
        "tableName",
        'isDocumentReadOnly',
        'isDialog' // "Set to `true` when the request is intended for the Canvas Field Dialog, eliminating the need to create a separate `cid` (identifier) for the table field and dialog field, which is used to focus on the table field."
    ],
    computed:{
        checkIfFieldDisabled(){
            return this.isDocumentReadOnly || this.isFieldDisabled(this.props.field_config)
        }
    },
    watch:{
        "props.value":{
            handler: function (newVal, oldVal){
                if(newVal !== oldVal){
                    // console.log("Multi select watcher :: ", this.props.field_config.name);
                    this.inputVal = newVal;
                }
            }
        }
    },
    data() {
        return {
            inputVal: '',
            optionsList: [],
            content:'',
            showToolTip: true,
            inputValueChangedEventName:""
        };
    },
    methods: {
        onFocus() {
            if (this.props) {
                const previousSelectedField = this.$store.getters["documentViewStore/selectedField"];
                this.$store.commit("documentViewStore/setSelectedField",this.props);
                if(this.props.page_number){
                    const params = { previous_selected_field: previousSelectedField, current_selected_field: this.props };
                    EventBus.$emit("SelectedFieldChangedOnPage__"+ this.props.page_number, params)
                } else{
                    EventBus.$emit("ResetSelectedDialog")
                }
            }
        },

        onChange() {
            this.handleToolTip();
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
                'isTable': this.isTable,
                'is_table': this.isTable,
                'table_name': this.tableName
            }
            EventBus.$emit('update-field-value', params);
            // This will update new value in IdpLineTable
            this.$emit('updateTableFieldValue', params);
        },

        handleToolTip() {
            if (this.inputVal && this.inputVal.length > 0) {
                this.showToolTip = false;
                this.handleTooltipContent();
            }else{
                this.showToolTip = true;
            }
        },

        handleTooltipContent() {
            if (Array.isArray(this.inputVal)) {
                this.content = this.inputVal.toString();
            }
            else {
                this.content = this.inputVal
            }
        },
    },
    beforeMount() {
        const fieldValue = this.props.hasOwnProperty('value') ? this.props.value : [];
        const fieldOptions = this.props.hasOwnProperty('options') ? this.props.options : [];
        this.optionsList = fieldOptions.length ? fieldOptions : [];
        this.inputVal = fieldValue;
        const params = { table_name : this.tableName, is_table : this.isTable, name : this.props.field_config.name };
        this.inputValueChangedEventName = DocumentService.createValueChangeEventName(params);
        EventBus.$on(this.inputValueChangedEventName, (value)=>{
            this.inputVal = value;
        })
        this.handleToolTip();
    },
    beforeDestroy() {

    },
};
</script>

<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";
.el-drop-down{
    .el-input__inner:not(#add-user-select) {
        height: auto;   
     }
}
</style>
   
