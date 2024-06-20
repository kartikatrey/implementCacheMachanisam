<template>
  <section class="add-businesss-rule-container accordian-container">
    <h3>{{ pageTitle }}</h3>
    <div class="accordian-bar">
      <div class="panel" v-loading="loading">
        <div class="panel-body">
          <el-form
            :model="brForm"
            ref="brForm"
            label-width="150px"
            :rules="formRules"
          >
            <el-row>
              <el-col :span="14">
                <!-- Systems Name -->
                <div class="form-group form-horizontal">
                  <el-form-item
                    class="control-label"
                    prop="system_name"
                    label="System"
                  >
                    <el-select
                      class="select-box"
                      size="large"
                      cid="add-business-rule-form-system-select"
                      @change="getBusinessRulesList"
                      v-model="brForm.system_name"
                      filterable
                      reserve-keyword
                      placeholder="Please select System"
                    >
                      <el-option
                        v-for="(_type, index) in systems"
                        :cid="'add-business-rule-form-system_' + index"
                        :key="_type.system_name"
                        :label="_type.system_name"
                        :value="_type.system_name"
                        label-width="170px"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <!-- Repository : radio Button -->
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <div class="form-group form-horizontal">
                  <el-form-item
                    class="control-label"
                    prop="repository"
                    label="Repository"
                  >
                    <el-radio-group
                      @change="getBusinessRulesList"
                      v-model="brForm.repository"
                      class="multi-radio"
                      :cid="'add-business-rule-form-repo_' + index"
                    >
                      <el-radio
                        cid="add-business-rule-form-custom"
                        label="custom"
                        style="width: auto; padding-right: 0.5rem; margin: 0"
                        >Custom
                      </el-radio>
                      <el-tooltip
                        content="Custom business rules created by you"
                        placement="top"
                        effect="light"
                      >
                        <span class="material-icons icon-error-radio"
                          >error</span
                        >
                      </el-tooltip>
                      <!-- Add tool tip -->
                      <el-radio
                        cid="add-business-rule-form-outofbox"
                        label="outofbox"
                        style="width: auto; padding-right: 0.5rem; margin: 0"
                      >
                        Out of box
                      </el-radio>
                      <el-tooltip
                        content="Prdefined business rules provided by kanverse"
                        placement="top"
                        effect="light"
                      >
                        <span class="material-icons icon-error-radio"
                          >error</span
                        >
                      </el-tooltip>
                      <!-- Add tool tip -->
                    </el-radio-group>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="14">
                <div class="form-group form-horizontal">
                  <el-form-item class="control-label" label="Order">
                    <el-input
                      cid="add-business-rule-form-order"
                      v-model="brForm.order"
                      placeholder=""
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
          </el-form>

          <section class="page-body business-rule-table">
            <!-- <span class="page-title">Business rule</span> -->
            <div>
              <div class="business-rule-form-search-input">
                <el-input v-model="searchText"  
                  @input="getStaticSearchText(searchText)" 
                  class="kp-toolbar-input" 
                  placeholder="Search...">
                </el-input>
              </div>
              
              <div data-v-step="2" class="table-wrap">
                <data-table
                  :parameters="tableParams"
                  ref="addBusinessRuleFromTable"
                ></data-table>
              </div>
            </div>

          </section>
        </div>

        <!-- Business rule table -->

        <!-- Footer -->
        <footer>
          <div></div>
          <div>
            <el-button
              v-on:click="$emit('update:displayAddBRDialog', false)"
              class="btn btn-sm btn-default"
              cid="add-business-rule-form-cancel"
            >
              Cancel
            </el-button>
          </div>
          <div>
            <el-button
              id="save-br"
              cid="add-business-rule-form-save"
              v-on:click="save"
              class="btn btn-sm btn-primary"
            >
              Save
            </el-button>
          </div>
        </footer>
      </div>
    </div>
  </section>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import BusinessRuleService from "@/doc-ex/services/BusinessRule";
import Constants from "@/resources/Constants";
import _ from "lodash";
import CustomerService from "@/idp/services/CustomerService";
import { Loading } from "element-ui";

export default {
  name: "AddBusinessRule",
  data() {
    return {
      searchText: "",
      systems: [],
      loading: false,
      pageTitle:"Add Business rule",
      formRules: {
        system_name: [
          {
            required: true,
            message: "Please enter system name",
            trigger: "blur",
          },
        ],
        repository: [
          {
            required: true,
            message: "Please select repository",
            trigger: "blur",
          }]
      },    
      brForm: {},
      tableParams: {
        tableMaxHeight: "160px",
        isStaticTable: true,
        showPaginationOptions: false,
        showTableToolbar: false,
        showSelectOptions: true,
        showSortOptions: false,
        fixedHeader: false,
        theme: "mytheme",
        rows: [],
        columns: [
          {
            label: "Name",
            field: "name",
            width: "300px",
            filterOptions: {
              enable: false,
            },
          },
          { 
            label: "Description",
            field: "description",
            filterOptions: {
              enable: false,
            },
          },
        ],
      },
    };
  },
  created: function () { 
},
  components: { DataTable, Loading },
  props: ["displayAddBRDialog", "field","isDocumentLevel"],
  beforeMount() {
    console.log(this.displayAddBRDialog);
    this.pageTitle= this.isBREdit ? "Edit Business rule" : this.pageTitle;

  },
  methods: {
    /**
     * Function is used to search text in rows from Business Rule Table
     */
    getStaticSearchText(searchText) {
      if (searchText) {
        const businessRules = this.tableParams.rows;
        const filteredBusinessRule = businessRules.filter(row => row.name.toLowerCase().includes(searchText.toLowerCase())
        );
        this.$refs.addBusinessRuleFromTable.updateStaticRows(filteredBusinessRule);
      }
      this.$refs.addBusinessRuleFromTable.updateStaticRows(businessRules);
    },

    async getBusinessRulesList() {
      this.loading = true;
      let valid = await this.$refs.brForm.validate().catch((error) => {});
      this.loading = false;
      if (!valid) {
        return;
      }
      try {
        this.loading = true;
        let param = {
          repository: this.brForm.repository,
          system_name: this.brForm.system_name,
        };
        let brData = await BusinessRuleService.get(param);
        this.loading = false;
        if (_.get(brData, "data.status")) {
          this.tableParams.rows = _.get(brData, "data.data") || [];
          this.$refs.addBusinessRuleFromTable.updateStaticRows(this.tableParams.rows);
        }
       
      } catch (error) {
        this.loading = false;
        this.notifyError("Error");
      }
    },

    escapeHtml(string) {
          const charMap = {
              '<': ' < '
          };
          return String(string).replace(/</g, (s) => {
              return charMap[s];
          });
    },
    
    async save() {
      let isValid = await this.$refs.brForm.validate().catch((error) => {});
      if (!isValid) return;      
      let selectedBR = this.$refs.addBusinessRuleFromTable.selectedRows;
      if (selectedBR && selectedBR.length == 0) {
        return this.notifyError("Please select atleast one business rule");
      }
      // Prepare business rule
      let businessRules = [];
      //Commenting this forloop as it's not required and we can maintain businessRule list also in next loop itself
      
      /*businessRules = _.forEach(selectedBR, (br) => {
        // Delete unwanted properties
        delete br.originalIndex;
        delete br.updated_at;
        delete br.vgt_id;
        delete br.vgtSelected;
        delete br.originalIndex;
        delete br.created_at;
        br.repository = this.brForm.repository;
        return br;
      });*/

      if(this.isDocumentLevel) delete this.field._id;

      // Prepare Business rule map
      let businessRuleMaps = [];
      _.forEach(selectedBR, (br) => {
        let brMap = {
          de_field_id: this.field._id,
          document_type: this.field.document_type,
          de_business_rule_id: br._id,
          order: this.brForm.order,
          name:br.name,
          system_name:br.system_name,
          //repository:br.repository,
          repository: this.brForm.repository,
          //customer_id: br.customer_id,
        };
        businessRuleMaps.push(brMap);
        br.advanced_script = this.escapeHtml(br.advanced_script);
        businessRules.push(br)
      });

      try {
        this.loading = true;
        let response = await BusinessRuleService.create({
          businessRules,
          businessRuleMaps,
        });
        this.loading = false;

        if (_.get(response, "data.data.status")) {
          this.$notify({
            title: "Success",
            message: "Business rule added successfully.",
            type: "success",
          });
          this.$emit("update:displayAddBRDialog", false);
          return;
        }
        console.log(response);
      } catch (error) {
        this.loading = false;
        this.notifyError("Error");
      }
    },
    async fetchCustomerSystems() {
      try {
        this.loading = true;
        this.systems = await CustomerService.getCustomerSystemNames();
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.notifyError("Error");
      }
    },
  },
  mounted() {
    this.fetchCustomerSystems();
    console.log('isDocumentLevel')
    console.log(this.isDocumentLevel)
  },
};
</script>



<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";

.add-businesss-rule-container {
  h3 {
    margin: 0;
    font-weight: normal;
    color: var(--dark-01);
    font-weight: 600;
  }
  .el-radio-group {
    label {
      vertical-align: super;
    }
    .el-radio__label {
      font-weight: normal;
      font-size: var(--font-base);
      vertical-align: inherit;
    }
  }
  // .material-icons {
  //   font-size: var(--font-sm);
  // }
  .business-rule-table {
    // .page-title {
    //   margin-left: -710px;
    // }
    // .table-wrap {
    //   margin-left: 6%;
    //   margin-right: 5%;
    //   padding-bottom: 3%;
    // }
  }
  .page-body.business-rule-table{
    // Styling for search option for Business Rule
    .business-rule-form-search-input {
      .kp-toolbar-input.el-input{
        width: 170px;
        margin-left: auto;
      }
      margin-top: 30px;
      margin-bottom: 10px;
      text-align: right;
    }
  }
}

// .panel {
//   display: block !important;
// }

.el-form-item__label {
  text-align: left !important;
}
</style>