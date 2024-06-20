<template>
  <el-main class="kp-main">
    <section class="page-body">
      <div class="page-title">
        <el-button cid="form-header-back" icon="mdi mdi-arrow-left-circle-outline" v-on:click="onBack"></el-button>
        <span class="page-title-text" v-if="brForm._id">Edit {{ pageTitle }}
        </span>
        <span class="page-title-text" v-else>Add {{ pageTitle }}</span>
      </div>
      <section class="form-page-container">
        <div class="panel" v-loading="loading">
          <div class="panel-body">
            <el-form :model="brForm" ref="brForm" label-width="150px">
              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item class="control-label" label="Name">
                      <el-input cid="add-business-rule-form-name" v-model="brForm.name" placeholder=""
                        disabled></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item class="control-label" label="Order">
                      <el-input cid="add-business-rule-form-order" v-model="brForm.order" placeholder=""
                        disabled></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="40">
                <el-col :span="12">
                  <!-- Systems Name -->
                  <div class="kp-form-group">
                    <el-form-item class="control-label" prop="system_name" label="System">
                      <el-select class="select-box" size="large" cid="add-business-rule-form-system-select"
                        v-model="brForm.system_name" filterable reserve-keyword placeholder="Please select System"
                        disabled>
                        <el-option v-for="(_type, index) in systems" :cid="'add-business-rule-form-system_' + index"
                          :key="_type.system_name" :label="_type.system_name" :value="_type.system_name"
                          label-width="170px"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12">
                  <!-- Systems Name -->
                  <div class="kp-form-group">
                    <el-form-item class="control-label" label="Field">
                      <el-input cid="add-business-rule-form-field" v-model="brForm.deField" placeholder=""
                        disabled></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item class="control-label" prop="repository" label="Repository">
                      <el-radio-group v-model="brForm.repository" class="multi-radio" disabled>
                        <el-radio cid="add-business-rule-form-custom" label="custom"
                          style="width: auto; padding-right: 0.5rem; margin: 0">Custom
                        </el-radio>
                        <el-tooltip content="Custom business rules created by you" placement="top" effect="light">
                          <span class="material-icons icon-error-radio">error</span>
                        </el-tooltip>
                        <!-- Add tool tip -->
                        <el-radio cid="add-business-rule-form-outofbox" label="outofbox"
                          style="width: auto; padding-right: 0.5rem; margin: 0">
                          Out of box
                        </el-radio>
                        <el-tooltip content="Predefined business rules provided by kanverse" placement="top"
                          effect="light">
                          <span class="material-icons icon-error-radio">error</span>
                        </el-tooltip>
                        <!-- Add tool tip -->
                      </el-radio-group>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </section>
    </section>
    <VersionRelatedList :id="brForm._id" title="Field mapping versions"></VersionRelatedList>
  </el-main>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import Constants from "@/resources/Constants";
import CommonService from "@/services/CommonService";
import _ from "lodash";
import VersionRelatedList from "@/idp/components/VersionRelatedList.vue";
import CustomerService from "@/idp/services/CustomerService";

export default {
  name: "AddBusinessRule",
  data() {
    return {
      systems: [],
      deFieldList: [],
      loading: false,
      pageTitle: "Business rule field map  ",
      brForm: {},
      endpoint: "/portal/api/table/de_business_rule_field_map"
    };
  },
  components: { DataTable, VersionRelatedList },
  props: ["displayAddBRDialog", "field", "isDocumentLevel"],
  async beforeMount() {
    let recordId = this.$route.query.id;
    this.fetchCustomerSystems(),
      await this.fetchDeFields(),
      this.init(recordId)
  },
  methods: {
    async init(recordId) {
      this.loading = true;
      try {
        let deBuisnessRuleFieldMappingData = await CommonService.fetchRecord(this.endpoint, { "_id": recordId }).catch(error => {
          this.notifyError("Error while fetching business rule field mapping data");
        });
        if (deBuisnessRuleFieldMappingData && deBuisnessRuleFieldMappingData[0].de_field_id) {
          let deField = (this.deFieldList).find(obj => obj._id === deBuisnessRuleFieldMappingData[0].de_field_id);
          this.brForm.deField = deField && deField.label || ""
        } else {
          this.brForm.deField = "Document"
        }
        this.brForm = Object.assign({}, this.brForm, deBuisnessRuleFieldMappingData[0]);
      } catch (error) {
        console.error(error);
        this.notifyError("Error while displaying record");
      }
      this.loading = false;
    },
    async fetchCustomerSystems() {
      try {
        this.loading = true;
        this.systems = await CustomerService.getCustomerSystemNames();

        this.loading = false;
      } catch (error) {
        console.error(error);
        this.loading = false;
      }
    },
    async fetchDeFields() {
      try {
        const deFields = await CommonService.fetchRecord(Constants.DE_FIELD_ENDPOINT, {});
        this.deFieldList = deFields || []
      } catch (e) {
        console.error(e);
      }
    },
    onBack() {
      this.$router.push("/idp/business-rule-field-map-list");
    },
  },
  mounted() { },
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
}

// .panel {
//   display: block !important;
// }

.el-form-item__label {
  text-align: left !important;
}
</style>