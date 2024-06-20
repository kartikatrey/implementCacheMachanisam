<template>
<div class="block docx-datepicker">
    <el-date-picker @focus="handleFocus()" :format="datePickerFormat" :value-format="datePickerFormat" :readonly="isDocumentReadOnly" v-model="dateValue" @change="handleValueChange" type="date" placeholder="select valid date">       
    </el-date-picker>
</div>
</template>

<script>
import moment from 'moment'
import EventBus from "@/EventBus";
import Constants from "@/resources/Constants";
import lodash from 'lodash'

export default {
    name: 'DatePicker',
    props: ["props", "isDocumentReadOnly","config"],
    watch: {
        props: {
            handler: function (newVal, oldval) {
                if (newVal && newVal.hasOwnProperty('value')) {
                    let formatMapping = this.config.MOMENT_DATEPICKER_MAPPING
                    this.datePickerFormat = formatMapping[[newVal.field_config.system_date_format]] ? formatMapping[[newVal.field_config.system_date_format]] : 'MM/dd/yyyy'
                    this.momentFormat = this.props.field_config.system_date_format
                    let res = moment(newVal.value, this.momentFormat, false)
                    if (!res._isValid) {
                        this.dateValue = ""
                        return;
                    }
                    this.dateValue = res.format(this.momentFormat)
                }

            },
            deep: true,
            immediate: true
        }

    },
    data() {
        return {
            dateValue: null,
            validationMapping: {
                'future_date_not_allowed': this.validateFutureDate,
                'past_date_not_allowed': this.validatePastDate
            },
            validationMsgs: [],
            momentFormat: '',
            datePickerFormat: ''
        };
    },
    methods: {
        handleValueChange() {
            //this.validateField()
            this.updatePredictionData()
        },

        updatePredictionData() {
            let params = {
                'value': this.dateValue ? this.dateValue : "",
                'name': this.props.field_config.name
            }
            EventBus.$emit('update-field-value', params)
        },

        validateField() {
            this.validationMsgs = []
            let self = this
            if (!lodash.get(this.props, 'field_config.validation')) return;
            lodash.each(this.props.field_config.validation, (val, key) => {
                let methodName = self[[val]] 
                if (typeof methodName !== 'function') return;
                let res = methodName();
                if(!res) 
                {
                    this.validationMsgs.push(`Value should be ${key.toLowerCase()}`)
                }
            })
        },

        handleInvalidDate() {
            this.dateValue = '';
            let params = {
                'value': this.props.value,
                'name': this.props.field_config.name,
                'validation': this.validationMsgs
            }
            EventBus.$emit('update-field-value', params)
        },

        isPast() {
           let isValid =  moment(this.dateValue, this.momentFormat) > moment() ? false : true
           return isValid
        },
        isFuture() {
          let isValid =   moment(this.dateValue, this.momentFormat) < moment() ? false : true
          return isValid
        },

        handleFocus() {
            if (this.propData) {
                this.$store.commit("documentViewStore/setFieldData",this.props);
                // EventBus.$emit('selected-field', this.props);
            }
        },
        //incorrect date is not allowed in datepicker

    },
    beforeMount() {
        //this.init()
    }
};
</script>

<style lang="scss">
.docx-datepicker {
    position: relative;

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
            // right: 1rem !important;
        }
    }
    .el-input__prefix {
        width: 100%;
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
}
</style>
