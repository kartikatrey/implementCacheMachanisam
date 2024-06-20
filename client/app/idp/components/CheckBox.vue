<template>
    <div class="kp-docx-input">
        <el-checkbox-group v-model="inputVal">
             <el-checkbox v-for="data in checkboxOptions"  
                @change="handleInputChange" :label="(data.value+'').toLowerCase()" 
                :key="(data.value+'').toLowerCase()">
                {{data.label}}
             </el-checkbox>
        </el-checkbox-group>
    </div>
</template>
    
    <script>
    import _ from 'lodash'
    import EventBus from "@/EventBus";
    import ValidationTooltip from "@/idp/components/ValidationTooltip.vue";
    import DocumentService from "@/idp/services/DocumentService";

    export default {
        name: 'Checkbox',
        components: {
            ValidationTooltip
        },
        props: [
            "props",
            'propData', 
            'isTable',
            "tableName",
            'isDocumentReadOnly'
        ],
        computed: {
            checkboxOptions() {    
               return  _.get(this.props, 'field_config.options',[])
            }
        },
        watch:{
            "props.value":{
                handler: function (newVal, oldVal){
                    if(newVal !== oldVal){
                        // console.log("Checkbox watcher :: ", this.props.field_config.name);
                        this.inputVal = newVal;
                    }
                }
            }
        },
        data() {
    
            return {
                inputVal:this.props.value,
                inputValueChangedEventName: ""
            };
        },
        methods: {
            handleInputChange(value, event){
                /**
                 * Using the same event name for all fields would lead to unintended event listening by other instances of Dropdown.vue/Input.vue
                 * Hence, we've devised distinct events for each field to prevent such interference.
                **/               
                EventBus.$emit(this.inputValueChangedEventName, this.inputVal)
                this.updatePredictionData(event.target.value, value) 
            },
    
            updatePredictionData(selectedField, value) {
                const predData = {
                    'value': this.inputVal,
                    'name': _.get(this.props, 'field_config.name'),
                    'index': this.props.field_config.index,
                    'table_index':this.props.field_config.tableIndex,
                    'field_type': this.props.field_config.field_type,
                    'data_type':'checkbox',
                    'selected_checkbox':selectedField,
                    'label': (_.find(this.checkboxOptions, {value:selectedField}) || {}).label,
                    'is_table': this.isTable,
                    'table_name': this.tableName
                }
                EventBus.$emit('update-field-value', predData)
                // This will update new value in IdpLineTable
                this.$emit('updateTableFieldValue', predData);
            },
        },
        beforeMount(){
            this.inputVal = this.props.value
            /**
             * Implement the InputValueChanged__<field_name> event registration, which facilitates a two-way value synchronization mechanism.
             * For instance, when modifying a header field's value within the field card, 
             * this event ensures that the corresponding focused field value on the canvas also updates seamlessly. 
             **/
            const params = { tableName : this.tableName, isTable : this.isTable, fieldName : this.props.field_config.name };
            this.inputValueChangedEventName = DocumentService.createValueChangeEventName(params);
            EventBus.$on(this.inputValueChangedEventName, (value)=>{
                this.inputVal = value;
            })
            
        },
        beforeDestroy() {
            
        },
      
    };
    </script>
    
    <style lang="scss" scoped>
    .field-error {
        border: 1.5px solid red;
    }
    
    //safari input bug fix
    .kp-docx-input {
        input {
            background: transparent;
            border: none;
            color: #212121;
            font-weight: 10px;
            text-align: left;
            line-height: 23px !important;
    
        }
    
        .details-icon {
            margin-top: 4px;
            vertical-align: -webkit-baseline-middle;
            color: #808080;
        }
    
        .input-border {
            border: 2px solid #00a7e0;
        }
    
        .input-error-border {
            border: 2px solid #C53030
        }
    
        .el-input {
            font-size: 12px !important
        }
    
        .el-input__inner:not(#add-user-select) {
            height: 23px;
        }
    
        .el-autocomplete {
            width: 100%;
    
        }
    
        .el-autocomplete-suggestion li {
            font-size: var(--font-sm) !important;
            padding: 0px 5px !important;
        }
    
        .auto-complete-item-list {
            font-size: 11px;
        }
    
    }
    
    .autocomplete-dropdown {
        li {
            font-size: var(--font-sm) !important;
            padding: 0px 5px !important;
        }
    
        .auto-complete-item-list {
            font-size: 11px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
    
    }
    </style>
    