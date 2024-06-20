<template>
  <!-- Toolbar Filters -->

  <div class="kp-toolbar-filter filter-popover">
    <div>
      <el-row>
        <el-col>
          <el-form :model="form"
          @keydown.native.enter.prevent="applyFilter"
          >
            <el-row :gutter="0">
              <div
                v-for="column in columns"
                :key="column.name"
                v-bind:label="column.label"
                v-bind:field="column.field"
              >
                <el-col :span="24">
                  <div
                    v-if="column.filterOptions.filterType == 'input'"
                    class="kp-form-input-1 kp-form-field"
                  >
                    <el-form-item
                      :label="column.label"
                      :prop="column.field"
                      class="kp-form-field-label"
                    >
                      <el-input
                        v-model="form[column.field]"
                        placeholder=""
                        :cid="column.label"
                      ></el-input>
                    </el-form-item>
                  </div>
                  <el-checkbox
                    v-if="column.filterOptions.filterType == 'checkbox'"
                    class="kp-form-field-checkbox11"
                    v-model="form[column.field]"
                    :cid="column.label"
                    >{{ column.label }}</el-checkbox
                  >
                </el-col>
                <el-col :span="24">
                  <div
                    v-if="column.filterOptions.filterType == 'select'"
                    class="kp-form-select-1 kp-form-field"
                  >
                    <el-form-item
                      :prop="column.field"
                      :label="column.label"
                      class="kp-form-field-label"
                    >
                      <el-select
                        placeholder=""
                        v-model="form[column.field]"
                        filterable
                        :cid="column.label"
                        :multiple="column.filterOptions.multiselect || false"
                        clearable
                      >
                        <el-option
                          v-for="(item,index) in column.filterOptions.options"
                          :cid="column.label +'_'+ index"
                          :value="item.value"
                          :key="item.value"
                          :label="item.text"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                  <div
                    v-if="column.filterOptions.filterType == 'calender'"
                    class="kp-form-input-1 kp-form-field"
                  >
                    <el-form-item
                      class="kp-form-field-label"
                      :label="column.label"
                      :prop="column.field"
                    >
                      <calender
                        :value="form[column.field]"
                        v-model="form[column.field]"
                        :cid="column.label"
                        :type="column.filterOptions.type"
                        rangeSeparator="to"
                        :placeholder="column.filterOptions.placeholder"
                      ></calender>
                    </el-form-item>
                  </div>
                </el-col>
              </div>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div class="kp-btn-row">
      <el-button
        v-on:click="applyFilter"
        size="small"
       cid="table-apply-filter"
        type="primary"
        >Apply filter</el-button
      >
      <el-button
        v-on:click="resetFilter"
        size="small"
        cid="table-reset-filter"
        class="kp-btn-form-outline"
        >Reset filter</el-button
      >
    </div>
  </div>
</template>

<script>
import lodash from "lodash";
import Calender from "@/components/Calender";
import moment from "moment";
import Constants from "@/resources/Constants"

export default {
  name: "Filter",
  components: {
    Calender,
  },
  props: ["columns", "options"],
  data() {
    return {
      form: {},
      showFilter: true,
    };
  },
  methods: {
    init() {
      this.form = this.form;
    },
    applyFilter() {
      this.filterParams = _.clone(this.form);
      this.updatedFilterParams = {}
      this.formatFilterQuery();
      // If we discover that we have a field for which 'allowEmptyValue' is true and has some default value.
      // Then, we should emit the 'setFilterData' event with the updated filter parameters.
      if(!_.isEmpty(this.updatedFilterParams)){
        this.$emit("setFilterData", this.updatedFilterParams)
      }else{
        this.$emit("setFilterData", this.filterParams);
      }
    },
    hasAssignedDefaultValueForField(key) {
      return Constants.EMPTY_FILTER_FIELDS_MAP.hasOwnProperty(key) 
              ? Constants.EMPTY_FILTER_FIELDS_MAP[key] 
              : false;
    },

    resetFilter() {
      this.form = {};
      this.$emit("setFilterData", this.form);
    },
    /**
     * *Purpose: To format the filter query based on the columns and provided filterOptions
     * 
     * The function's purpose is to format a filter query based on columns and their filter options. 
     * It introduces :
     *   - "allowEmptyValue" key to handle empty values or the values which are not present in the db, 
     *   - That column should be present in filterParams
     * If "allowEmptyValue" is not in filter options, and the field is empty and not false, delete the field.
     * 
     * Otherwise, handle filter types based on the column's types (input/select/calendar).
     */
    formatFilterQuery() {
      let mapping = {};
      let self = this;
      
      for (const column of self.columns) {
        if (
          !(column.filterOptions.hasOwnProperty('allowEmptyValue') &&
            column.filterOptions.allowEmptyValue && 
              self.filterParams.hasOwnProperty(column.field)) &&

                _.isEmpty(self.filterParams[column.field]) && !_.isBoolean(self.filterParams[column.field])
        ) {
          delete self.filterParams[column.field];
        } else {
          mapping = {
            input: self.handleInput,
            select: self.handleSelect,
            calender: self.handleCalender,
          };
          mapping[column.filterOptions.filterType](column);
        }
      }
    },

    handleInput(column) {
      let condition = {};
      let col_val = "(" + this.filterParams[column.field] + ")";
      condition[column.field] = {
        $regex: col_val,
        $options: "i",
      };
      return (this.filterParams[column.field] = condition[column.field]);
    },

    handleCalender(column) {
      let condition = {};
      if (column.filterOptions.type == "datetimerange") {
        condition[column.field] = {
          $gte: new Date(this.filterParams[column.field][0]),
          $lte: new Date(this.filterParams[column.field][1]),
        };
      } else {
        condition[column.field] = new Date(this.filterParams[column.field]);
      }
      return (this.filterParams[column.field] = condition[column.field]);
    },

    handleSelect(column) {
      let condition = {};
      let filterParams = {}
      //If "allowEmptyValue" is true in a column's filter options, 
      //it means we want to display values in the list view even if the field is not exists in the database record. Hence, We've prepared a query to handle this scenario.
      //Scenario: If, for any field 'allowEmptyValue' is true and there could be possibility that we could have assigned some default value while creating the db record,
      //Hence to address this scenario, we have to check that does we have assigned default value to such fields. if so, add it into filterParams
      if (!this.filterParams[column.field] && column.filterOptions.allowEmptyValue) {
        const defaultFieldValue = this.hasAssignedDefaultValueForField(column.field);
        if(defaultFieldValue){
          filterParams['$or']= [
                                  { [column.field]: { $exists: false } },  
                                  { [column.field]: defaultFieldValue }      
                                ]
          return this.updatedFilterParams = filterParams
        }else{
          condition[column.field] = {
            $exists: false
          };
        }
      } else {
        condition[column.field] = {
          $in: column.filterOptions.multiselect
            ? this.filterParams[column.field]
            : [this.filterParams[column.field]],
        };
      }
      return (this.filterParams[column.field] = condition[column.field]);
    },
  },
  beforeMount() {
    // this.init();
  },
};
</script>

<style lang="scss">

.el-date-editor .el-range__icon {
  position: absolute;
  top: -2px;
}
.advanced-popover {
   .popper__arrow {
         border-bottom-color: blue;
             left: 50% !important;
          &::after {
            display: none !important;
            
          }
   }
}
</style>
