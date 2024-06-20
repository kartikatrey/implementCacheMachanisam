<template>
    <div class="kp-docx-input">
        <el-input :name="getElementName" :readonly="isDocumentReadOnly || isReadOnly" :class="inputClass" v-model="inputVal" @input="handleInput" @focus="handleFocus">
            <!-- <el-tooltip class="details-icon" slot="suffix" v-if ="props && props.field_config && props.field_config.enable_reference && !props.validationMsgs.length && inputVal" placement="left">
                <span  slot="content"> Details</span>
                 <span class="mdi mdi-file-document-outline" @click="handleEnableReference()"></span>
            </el-tooltip> -->
    
            <el-tooltip class="details-icon" slot="suffix" v-if ="props && props.field_config && props.field_config.enable_reference && !props.validationMsgs.length && inputVal" placement="left">
                <span  slot="content"> PO Mapper</span>
                <!-- mdi-chart-timeline-variant -->
                 <span class="mdi mdi-file-document-outline" @click="handlePOMapper()"></span>
            </el-tooltip>
    
            <validation-tooltip slot="suffix" v-if="isTable && props && props.validationMsgs && props.validationMsgs.length>0" :validationMsgs="props && props.validationMsgs"></validation-tooltip>
        </el-input>
    </div>
    </template>
    
    <script>
    import moment from 'moment'
    import lodash from 'lodash'
    import Constants from "@/resources/Constants";
    import EventBus from "@/EventBus";
    import validator from 'validator';
    import ValidationTooltip from "@/doc-ex/components/ValidationTooltip.vue";
    
    export default {
        name: 'DocExInput',
        components:{ValidationTooltip},
        props: ["props", 'isTable', 'propData', 'isDocumentReadOnly', 'selectedField','isReadOnly'],
        watch: {
            props: {
                handler: function (newVal, oldval) {
                    if (newVal) {
                        let value = newVal.hasOwnProperty('value') ? lodash.cloneDeep(newVal.value) : lodash.cloneDeep(newVal.value)
                        this.inputVal = value ? value : ''
                        // this.validateField();
                        // if (!lodash.isEqual(lodash.cloneDeep(this.validationMsgs).sort(), lodash.cloneDeep(newVal.validationMsgs).sort())) this.updatePredictionData();
                    }
                },
                immediate: true,
                deep: true
            }
        },
        computed: {
            inputClass() {
                if(this.isTable && (lodash.get(this.selectedField, 'field_config.field_type') == 'table') && (lodash.get(this.selectedField, 'field_config.name') == this.props.field_config.name)){
                    if(lodash.size(this.props.validationMsgs) > 0){
                        return 'input-error-border'
                    }
                    return 'input-border'
                }
                return ''
            },
            getElementName(){
                       return lodash.get(this.props, 'field_config.name');
           }
        },
    
        data() {
            return {
                validationMsgs: [],
                inputVal: ''
            };
        },
        methods: {
            handleEnableReference(){
               EventBus.$emit('document-details-info', {...this.props.field_config,...{name:this.props.name},...{value:this.inputVal}});
            },
            handlePOMapper(){
               EventBus.$emit('po-mapper', {...this.props.field_config,...{name:this.props.name},...{value:this.inputVal}});
            },
            handleInput() {
                this.updatePredictionData()
            },
    
            updatePredictionData() {
                let params = {
                    'value': this.inputVal,
                    'name': lodash.get(this.props, 'field_config.name'),
                    'index': this.props.field_config.index,
                    'table_index':this.props.field_config.tableIndex,
                    'field_type': this.props.field_config.field_type,
                    'field_config' : this.props.field_config
                }
                EventBus.$emit('update-field-value', params)
            },
    
            handleFocus() {
                if (this.propData) {
                    this.$store.commit("documentViewStore/setSelectedField",this.props);
                }
            },
    
        }
    };
    </script>
    
    <style lang="scss" scoped>
    .field-error {
        border: 1.5px solid red;
    }
    
    .kp-docx-input {
        input {
            background: transparent;
            border: none;
            color: #212121;
            font-weight: 10px;
            text-align: left;
    
        }
    
        .details-icon{
            margin-top:4px;
            vertical-align:-webkit-baseline-middle;
            color: #808080;
        }
    
        .input-border {
            border: 2px solid #00a7e0;
        }
    
        .input-error-border {
            border: 2px solid #C53030
        }
        .el-input{
            font-size:12px !important
        }
        .el-input__inner:not(#add-user-select){
            height:23px;
        }
    
    }
    </style>
    