<template>
<div>
    <div v-if="propData.row.editable">
        <el-select filterable class="datatable-dropdown" v-model="value" @change="handleBlur()">
            <el-option v-for="data in propData.column.filterOptions.options" :label="data.label" :value="data.value" :key="data.value"></el-option>
        </el-select>
    </div>
    <div v-else v-bind:class="{ellipsis: propData.column.ellipsis }">
        {{getLabel}}
    </div>
</div>
</template>

<script>
import EventBus from "@/EventBus";
import Codemirror from "@/components/Codemirror.vue";
import lodash from "lodash"

export default {
    name: "Dropdown",
    props: ["propData"],
    components: {
        Codemirror
    },
    computed: {
        getLabel() {
            let value = this.propData.formattedRow[this.propData.column.field]
            let object = lodash.find(this.propData.column.filterOptions.options, {
                'value': value
            });
            let label = lodash.has(object, 'label') ? object['label'] : ''
            return label
        }
    },
    data() {
        return {
            value: ''
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
        handleBlur() {
            let params = {
                propData: this.propData,
                value: this.value
            }
            this.$emit("onDataUpdate", params);
            EventBus.$emit("onChange",{field:this.propData.column.field,value:this.value});
        }

    }
};
</script>

<style lang="scss">
.datatable-dropdown {
    width: 160px
}

.button-style {
    font-size: 26px !important;
    padding: 0 !important;
}
</style>
