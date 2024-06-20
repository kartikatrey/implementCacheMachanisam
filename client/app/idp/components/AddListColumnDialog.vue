<template>
  <section class="add-list-column-dialog-container">
    <div class="approval-list-title my-approval-title"> {{ pageTitle }}
        <el-button round text class="approval-list-back" size="small" v-on:click="hideDialog"> <i class="mdi mdi-close"></i> </el-button>
    </div>
    <div class="add-list-wrap" v-loading="loading">
      <el-form :model="form" ref="form" label-width="90px" :rules="formRules">
        <el-row>
          <el-col :span="14">
            <div class="form-group form-horizontal form-vertical">
              <el-form-item class="control-label" prop="stage" label="Stage">
                <el-select
                  class="select-box"
                  size="large"
                  :disabled="isEditMode"
                  cid="add-business-rule-form-system-select"
                  v-model="form.stage"
                  filterable
                  reserve-keyword
                  placeholder="Please select stage"
                >
                  <el-option
                    v-for="(item, index) in stages"
                    :key="item.value + 'stage' + index"
                    :label="item.label"
                    v-bind:value="item.value"
                    :disabled="item.disabled"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="14">
            <div class="form-group form-horizontal">
              <el-form-item class="control-label" prop="category" label="Category">
                <el-select
                  class="select-box"
                  size="large"
                  cid="add-business-rule-form-system-select"
                  :disabled="isEditMode"
                  v-model="form.category"
                  filterable
                  reserve-keyword
                  placeholder="Please select System"
                >
                  <el-option
                    v-for="(item, index) in documentCategories"
                    :key="'category' + index"
                    :label="item.label"
                    v-bind:value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="14">
            <div class="form-group form-horizontal">
              <el-form-item class="control-label" prop="sort_by" label="Sort by">
                <el-input v-model="form.sort_by"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <section class="list-view-dual-box" v-if="slushBucketData.source">
        <div data-v-step="2" class="table-wrap">
          <DualListBox
            :source="slushBucketData.source"
            :destination="slushBucketData.destination"
            label="label"
            @onChangeList="(changedData) => {onChangeList(changedData, slushBucketData);}"
          />
        </div>
      </section>
  </div>
    <footer><!-- Footer -->
      <div>
        <el-button
          v-on:click="hideDialog"
          class="btn btn-sm btn-default"
          cid="list-column-dialog-cancel"
        > Cancel </el-button>
      </div>
      <div>
        <el-button
          id="save-br"
          cid="list-column-dialog-save"
          v-on:click="save"
          class="btn btn-sm btn-primary"
        > Save </el-button>
      </div>
    </footer>
  </section>
</template>

<script>
import _ from "lodash";
import Constants from "@/resources/Constants";
import FieldService from "@/idp/services/FieldService";
import DualListBox from "./DualListBox.vue";
// import { constants } from 'fs';

export default {
  name: "AddListColumnDialog",
  props: ["addListViewPopupModalData", "data", "documentType", "pageTitle"],
  components: { DualListBox },
  data() {
    return {
      loading: false,
      stages: Constants.DOCEX.ALL_LIST_STAGES,
      documentCategories: Constants.DOCEX.IDP_DOCUMENT_CATEGORIES,
      isEditMode: false,
      form: {
        stage: "",
        category: "",
        document_type: this.documentType,
        sort_by : ""
      },
      formRules: {
        stage: [
          {
            required: true,
            message: "Please select stage",
            trigger: "change",
          },
        ],
        document_type: [
          {
            required: true,
            message: "Please select document type",
            trigger: "change",
          },
        ],
        category: [
          {
            required: true,
            message: "Please select stage",
            trigger: "blur",
          },
        ],
      },
      slushBucketData: { source: [], destination: [] },
    };
  },
  methods: {
    hideDialog() {
      this.addListViewPopupModalData = "";
      this.$emit("update:displayAddListViewPopupModal", false);
    },

    onChangeList: function ({ source, destination }, tabData) {
      tabData["source"] = source;
      tabData["destination"] = destination;
    },

    async save() {
      if (this.isDuplicateColumnConfigPresent()) {
        this.notifyError("This configuration is already present. please select different stage and category");
        return;
      }
      let valid = await this.$refs.form.validate().catch((error) => {});
      if (!valid) return;
      this.form.fields = this.slushBucketData.destination;
      this.$emit("updateForm", { isEditMode: this.isEditMode, data: this.form });
      this.hideDialog();
    },

    isDuplicateColumnConfigPresent() {
      return (
        !this.isEditMode &&
        _.find(this.data, {
          stage: this.form.stage,
          category: this.form.category,
        })
      );
    },

    prepareSelectionFields(allFields) {
      const headerFields = {
        source: [],
        destination: [],
      };
      const selectedFields = _.get(this.addListViewPopupModalData, "fields", []);
      const prepareBucketField = (field) => {
        return {
          label: field.label.substring(0, 30),
          name: field.name.substring(0, 30),
          code: "" + field._id,
          type: field.type,
          order: !isNaN(field.order) ? field.order : 9999,
          width : field.list_view_column_width
        };
      };
      const isSelectedField = (field) => {
        return selectedFields.find((item) => {
          return item.label == field.label});
      };

      // Prepare souce fields which are not selected.
      const addSourceField = (field) => {
        !isSelectedField(field) ? headerFields['source'].push(prepareBucketField(field)): "";
       
      };

      // Prepare destination fields which are selected by user.
       const addDestinationField = (field) => {
        headerFields['destination'].push(prepareBucketField(field));
       
      };
      
      allFields.map(addSourceField);
      selectedFields.map(addDestinationField)
      this.slushBucketData = headerFields;
      
    },

    async getFields() {
      this.loading = true;
      //get de_fields
      const fields = await FieldService.getFieldsList({ active: true, field_type: "header", document_type: this.documentType,
      }, ["_id", "label","name","type", "order","list_view_column_width"]);
      //get de_document_field
      const deDocumentFields = Constants.DOCEX.DE_DOCUMENT_FIELDS_LIST_VIEW
      //merge de_fields and de_document_fields to show on UI
      const finalFields = [...deDocumentFields, ...fields];
      this.prepareSelectionFields(finalFields);
      this.loading = false;
    },

    setFormData() {
      if (this.addListViewPopupModalData) {
        this.form = this.addListViewPopupModalData;
        this.isEditMode = true;
      } else {
        this.isEditMode = false;
        this.form.stage = this.stages[0].value;
        this.form.category = this.documentCategories[0].value;
      }
    },

    async init() {
      await this.getFields();
      this.setFormData();
    }
  },

  async beforeMount() {
    this.init();
  }

};
</script>

<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";
.list-view-model {
  .el-dialog {
      padding: 0;
    }
    .add-list-wrap {
        margin-top: 0rem;
        padding: 1rem 2rem 1rem 2rem;
          .list-view-dual-box {
            margin-top: 1rem;
          }
          .clear-search {
                color: var(--dark-06);
                border: 0;
                line-height: .8;
                margin: 0;
                font-size: 2rem;
                padding: 0;
                font-weight: 300;
                margin-right: 0.5rem;
          }
    }
    .approval-list-title.my-approval-title {
        margin:0;
        font-style: normal;
        font-weight: 600;
        font-size: var(--font-lg);
        line-height: 1;
        padding: 2rem 2rem;
        color: var(--dark-02);
        position: relative;
        text-transform: capitalize;

    .approval-list-back {
        position: absolute;
        border: 0;
        color: var(--dark-03);
        font-size: 1.2rem;
        vertical-align: text-top;
        padding: 0 !important;
        right: 1.4rem;
        top: 1.4rem;
        z-index: 9999;
        transition: .1s all ease-in-out;
        transform-origin: center center;
        background: var(--dark-08);
        width: 25px;
        height: 25px;
        &:hover {
            background: transparent !important;
            transform: scale(1.2);
        }
        span {
            display:block;
        }
        }
  } // title end
   .form-vertical {
        display: block;
    }
    .search-box input {
      height: 2.5rem;
    }
    footer {
        border-top: var(--border-base) solid var(--dark-06);
        display: flex;
        justify-content: flex-end;
        gap: var(--space-base);
        padding: 1.2rem 2rem;
        margin-top: var(--space-base);
        .btn  {
              line-height: .3;
              font-size: var(--font-base);
        }
          .btn-default {
              border: 1px solid #DCDFE6;
          }
          .btn-primary { 
              background: var(--brand-04);
              border: 0;
                &:hover {
                  color: var(--white);
                   background: var(--brand-03);
                }
          }
    }
    .list-box-wrapper .list-box-item .bulk-action .select-all {
      background-color: var(--brand-05) !important;
    }
    .table-wrap {
        span {
          display: block;
          font-size: var(--font-base);
          color: var(--dark-03);
          line-height: 1;
          margin-bottom: var(--space-sm);
        }
    }
} // list view model end
</style>