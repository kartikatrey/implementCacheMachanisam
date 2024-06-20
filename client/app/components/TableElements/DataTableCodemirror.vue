<template>
<div v-if="isCodemirrorRequired">
    <div v-if="propData.row.editable" class="datatable-codemirror">
        <codemirror :value="value"  @onBlur="handleBlur" :placeholder="placeholder"></codemirror>
        <span class="error-message" v-if="showError && propData.column.validationOptions.message">{{propData.column.validationOptions.message}}</span>
    </div>
    <div v-else v-bind:class="{ellipsis: propData.column.ellipsis }">
        {{propData.formattedRow[propData.column.field]}}
    </div>
</div>
</template>

<script>
import EventBus from "@/EventBus";
import Codemirror from "@/components/Codemirror.vue";
import Json from "@/util/Json"
import lodash from "lodash"

export default {
    name: "DataTableCodemirror",
    props: ["propData"],
    components: {
        Codemirror
    },

    data() {
        return {
            value: null,
            showError: false,
            validatorMapping: {
                'json': this.validateJSON
            },
            placeholder:'for eg: [{"key":"View timesheet","value":"View timesheet"}]'
        }
    },
    computed: {
        isCodemirrorRequired() {
            let codemirrorRequiredScript = lodash.get(this.propData, 'column.codemirrorRequiredScript')
            return  codemirrorRequiredScript ? eval(codemirrorRequiredScript) : true
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

        validateJSON(value) {
            let isValid = !lodash.isEmpty(value) ? Json.isJson(value) : true
            return isValid
        },

        handleBlur(value) {
            let params = {
                propData: this.propData,
                value
            }
            let type = lodash.get(this.propData, 'column.validationOptions.type')
            let isValid = type ? this.validatorMapping[type](value) : true
            this.showError = !isValid ? true : false;
            params.valid = isValid
            this.$emit("onBlur", params);

        }
    }
}
</script>

<style lang="scss">
.datatable-codemirror {
    .CodeMirror-scroll {
        background-color: #f3f3f3;
    }
}

.error-message {
    color: red;
   
}

</style>
