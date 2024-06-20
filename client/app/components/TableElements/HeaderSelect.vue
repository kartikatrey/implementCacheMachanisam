<template>
  <div class="line-header-select">
    <el-tooltip
      class="item"
      effect="light"
      :content="propData.column.label"
      placement="top"
    >
      <span class="selected text" v-if="selectedValue == propData.column.field">
        {{ displayValue }}
      </span>
      <span
        class="unselected text"
        v-if="selectedValue != propData.column.field"
      >
        {{ displayValue }}
      </span>
    </el-tooltip>

    <el-tooltip
      class="item"
      effect="light"
      :content="tooltipContent"
      placement="top"
    >
      <el-select
        v-model="selectedValue"
        filterable
        placeholder="Select Column"
        :disabled="isHeaderSelectDisabled"
        @change="(data) => { handleSelect(data, propData.column);}"
      >
        <el-option
          v-for="(item,index) in dropdownOptions"
          :key="index"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-tooltip>
  </div>
</template>

<script>
import EventBus from "@/EventBus";
import Constants from "@/resources/Constants";

export default {
  name: "HeaderSelect",
  props: [
        "propData",
        "fieldName",
        "isDocumentReadOnly",
        "tableIndex"
      ],
  data() {
    return {
      selectedValue: null,
      displayValue: "",
    };
  },
  watch: {
    propData: {
      handler: function (newVal, oldval) {
        newVal && this.initialize(newVal);
      },
      immediate: true,
      deep: true,
    },
  },
  computed:{
    /**
     * Purpose -: This computed property is introduced to disable the headerSelect for "ap_contributor".
     * While we could rely on the "isDocumentReadOnly" flag for this, there's a specific requirement to
     * allow one field to be writable for "ap_contributor." Hence, we've incorporated this additional 
     * condition to cater to our specific needs.
     */
    isHeaderSelectDisabled(){
        return this.isDocumentReadOnly ||  _.get(this.$store.getters.user, 'roles', []).includes(Constants.DOCEX.ROLES_MAP.AP_CONTRIBUTOR)
    },
    /**
     * Purpose: Performance Improvement - Rather than passing dropdown options for each field as a parameter, 
     * we are now retrieving them from the selected table parameters. These options remain consistent across different fields.
     * Step 1. Get tableparams from documentViewStore
     * Step 2. Check if the request is of multi table using tableIndex
     * Step 3. if multiTable then get the options using tableIndex
     * Step 4. If single table then return options directly from tableparams

     * */ 
    
    dropdownOptions() {
        const tableParams = this.$store.getters["documentViewStore/tableParams"]
        let dropdownOptions = [];
        if(_.isNumber(  this.tableIndex)){
          dropdownOptions = _.get(tableParams[this.tableIndex], "header_dropdown_options", []);
        } else{
          dropdownOptions = _.get(tableParams, "header_dropdown_options", []);
        }
        return dropdownOptions
    },
    tooltipContent(){
      if (this.selectedValue) {
        const field = _.find(this.dropdownOptions, {value: this.selectedValue});
        return field.label;
      }
      return "Select column";
    }
  },

  methods: {
    handleSelect(data, columnName) {
      EventBus.$emit(
        "IDP_LINE_HEDER_SELECTION_CHANGED",
        _.find(this.dropdownOptions, { value: data }),
        columnName
      );
      this.selectedValue = data;
    },

    initialize(propData) {
      if (propData && propData.column) {
        this.selectedValue = null;
        if (
          (this.dropdownOptions || [])
            .map((o) => o.value)
            .includes(propData.column.field)
        ) {
          this.selectedValue = propData.column.field;
        }

        this.displayValue = propData.column.label;
      }
    },
  },

  beforeMount() {},
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";
@import "../../idp/_idpVariables";

.vue-good-table-box .vgt-table thead th {
  background: var(--main-bg-color);
  border-right: 1px solid var(--dark-07);
  font-size: var(--font-base);
  // position: relative;
  .line-header-select {
    .text {
      text-overflow: ellipsis;
      overflow: hidden;
      display: inline-block;
      white-space: nowrap;
      width: 70%;
    }

    .text.selected {
      color: var(--dark-02);
    }
    .text.unselected {
      color: var(--dark-05);
    }
  }
}
</style>
