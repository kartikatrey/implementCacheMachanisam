<template>
    <!--
        To address a non-functional datepicker causing exceptions
        (e.g., encountering errors like 'getHours()/getMinutes() is not a function'),
        it's crucial to verify whether the de_document_data contains the appropriate date format.
    -->
    <div class="block docx-datepicker">
        <el-date-picker
        @focus="handleFocus()"
        @change="handleFocus();handleValueChange()"
        :cid="cid"
        :disabled="isFieldDisabled(props.field_config)"
        :format="datePickerFormat"
        :readonly="isDocumentReadOnly"
        value-format="MM-dd-yyyy"
        v-model="dateValue"
        type="date"
        placeholder="select valid date">
        </el-date-picker>
        <span  v-bind:class="[
          (selectedField && selectedField.name == props.field_config.name) ? 'card-focus' : '',
        ]" class="field-date-format">{{momentFormat}}</span>
    </div>
</template>

<script>
    import moment from 'moment';
    import EventBus from "@/EventBus";
    import lodash from 'lodash';
    import DocumentService from "@/idp/services/DocumentService";

    export default {
        name: 'DatePicker',
        props: [
            "props",
            'isTable',
            "selectedField",
            "propData",
            "tableName",
            "isDocumentReadOnly",
            "config",
            'isDialog' // "Set to `true` when the request is intended for the Canvas Field Dialog, eliminating the need to create a separate `cid` (identifier) for the table field and dialog field, which is used to focus on the table field."
        ],
        data() {
            return {
                dateValue: null,
                inputFormat:'',
                offset:' 00:00:00',
                momentFormat: '',
                datePickerFormat: 'MM-dd-yyyy',
                inputValueChangedEventName:""
            };
        },
        watch:{
            "props.value":{
                handler: function (newVal, oldVal){
                    if(newVal !== oldVal){
                        // console.log("Date picker watcher :: ", this.props.field_config.name);
                        this.dateValue = newVal;
                    }
                }
            }
        },
        computed: {
            cid(){
                return DocumentService.createFieldCid(this.props, this.tableName, this.isDialog)
            }
        },
        methods: {
            getDatepickerFormat(systemDateFormat){
                if(!systemDateFormat){
                    return "MM-dd-yyyy"
                }
                let datePickerFormat = lodash.cloneDeep(systemDateFormat)
                datePickerFormat = datePickerFormat.replace(/D/g ,"d")
                datePickerFormat = datePickerFormat.replace(/Y/g, "y")
                return datePickerFormat;
            },
            handleValueChange() {
                this.updatePredictionData()
            },
            updatePredictionData() {

                let params = {
                    'value': this.dateValue,
                    'name': lodash.get(this.props, 'field_config.name'),
                    'index': lodash.get(this.props, 'field_config.index', ""),
                    'table_index':lodash.get(this.props, 'field_config.tableIndex', ""),
                    'field_type': lodash.get(this.props, 'field_config.field_type', ""),
                    'field_config' : this.props.field_config,
                    'is_table': this.isTable,
                    'table_name': this.tableName
                }
                EventBus.$emit('update-field-value', params)
                // This will update new value in IdpLineTable
                this.$emit('updateTableFieldValue', params);
            },
            handleFocus() {
                const previousSelectedField = this.$store.getters["documentViewStore/selectedField"];
                if (this.propData) {
                    this.$store.commit("documentViewStore/setSelectedField",this.props)
                    const params =   { previous_selected_field: previousSelectedField, current_selected_field: this.props };
                    EventBus.$emit("SelectedFieldChangedOnPage__"+ this.props.page_number, params)
                }
            },
            convertDateToCalenderFormat(inputDate){
                if (!inputDate) {
                    return;
                }
                this.datePickerFormat = this.getDatepickerFormat(lodash.get(this.props, 'field_config.system_date_format'))
                this.momentFormat = this.props.field_config.system_date_format
                let res = moment(inputDate).format(this.momentFormat)
                if (!res || res=="Invalid date" ) {
                    this.dateValue = ""
                    return;
                }
                this.dateValue = inputDate;
            },
        },
        beforeMount() {
            this.convertDateToCalenderFormat(this.props.value);
             /**
             * Implement the InputValueChanged__<field_name> event registration, which facilitates a two-way value synchronization mechanism.
             * For instance, when modifying a header field's value within the field card,
             * this event ensures that the corresponding focused field value on the canvas also updates seamlessly.
             **/
            const params = { table_name : this.tableName, is_table : this.isTable, name : this.props.field_config.name };
            this.inputValueChangedEventName = DocumentService.createValueChangeEventName(params);
            EventBus.$on(this.inputValueChangedEventName, (inputDate)=>{
                // If the user clears the date input field, there's no need to convert or format the date;
                // you can simply set it as an empty date or `null` to indicate that no date is selected.
                if(!inputDate){
                    this.dateValue = "";
                    return;
                }
                this.convertDateToCalenderFormat(inputDate);
            })

        },
        beforeDestroy() {
            
        },
        updated(){
            // console.log("Datepicker::updated")
        },

    };
</script>


<style lang="scss">
    .docx-datepicker {
        position: relative;
        .field-date-format{
            font-size: 0.9rem;
            margin-left: 2px;
        }
        input {
            padding-right: 15px !important;
        }
        .el-input__icon {
            right: 0.5rem;
            position: absolute;
            top: 0;
            line-height: 0rem;
        }
        .el-input__suffix {
            .el-input__icon {
                right: 1.5rem !important;
            }
        }
        .el-input__prefix {
            width:  3.785rem;
            right: 0;
            left: auto;
        }
        .kp-date-view {
           position: absolute;
            right: 54px;
            top: 22px;
            width: 100%;
            font-size: 11px;
            color: #cacaca;
            white-space: nowrap;
            overflow: hidden;
            -o-text-overflow: ellipsis;
            text-overflow: ellipsis;
            text-align: right;
        }
        .card-focus{
            color:white;
        }
    }
</style>