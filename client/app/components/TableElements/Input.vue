<template>
<div>
    <div v-if="propData.row.editable">
        <el-input :cid="'row-' + propData.column.field + '-'+ propData.index" v-bind="options" v-model="value" @blur="handleBlur()">
        </el-input>
        <span class="error-message" v-if="showError && propData.column.validationOptions.message">{{propData.column.validationOptions.message}}</span>
    </div>
    <div v-else :cid="'row-' + propData.column.field + '-'+ propData.index" v-bind:class="{ellipsis: propData.column.ellipsis }">
        {{propData.formattedRow[propData.column.field]}}
    </div>
</div>
</template>

<script>
import EventBus from "@/EventBus";
import Codemirror from "@/components/Codemirror.vue";
import lodash from "lodash"

export default {
    name: "Input",
    props: ["propData", "options"],
    components: {
        Codemirror
    },
    data() {
        return {
            value: null,
            showError: false,
            validatorMapping: {
                'required': this.validateRequired
            }
        }
    },
    watch: {
        propData: {
            handler: function (val, oldval) {
                var fieldName = val.column.field;
                this.value = val.formattedRow[fieldName]
            },
            immediate: true,
            deep: true
        }

    },
    methods: {
        validateRequired(value) {
            let isValid = !lodash.isEmpty(value) ? true : false
            return isValid
        },

        handleBlur() {
            let params = {
                propData: this.propData,
                value: this.value
            }
            let type = lodash.get(this.propData, 'column.validationOptions.type')
            let isValid = type ? this.validatorMapping[type](this.value) : true
            this.showError = !isValid ? true : false;
            params.valid = isValid
            console.log("handle")
            this.$emit("onDataUpdate", params);
        }

    }
};
</script>

<style lang="scss">
.button-style {
    font-size: 26px !important;
    padding: 0 !important;
}
</style>
