<template>
  <el-main class="kp-main" v-loading="loading">
    <section class="page-body">
      <div class="page-title">
        <el-button
          icon="mdi mdi-arrow-left-circle-outline"
          cid="form-header-back"
          v-on:click="onBack"
        ></el-button>
        <span class="page-title-text" v-if="isEditMode"
          >Edit {{ pageTitle }}
        </span>
        <span class="page-title-text" v-else>Add {{ pageTitle }}</span>
      </div>

      <section class="form-page-container">
        <div class="panel">
          <div class="panel-body">
            <el-form
              :model="form"
              ref="form"
              label-width="120px"
              :rules="formRules"
            >
            <div class="grouping-tile">General configuration</div>
              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="label"
                      label="Label"
                    >
                      <el-input
                        cid="field-config-form-label"
                        @input="handleLabelInput"
                        class="form-control"
                        v-model="form.label"
                        :rows="2"
                        placeholder
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="name"
                      label="Name"
                    >
                      <el-input
                        cid="field-config-form-name"
                        :disabled="form._id"
                        class="form-control"
                        prop="name"
                        v-model="form.name"
                        placeholder
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="field_level"
                      label="Field level"
                    >
                      <el-select
                        class="select-box"
                        size="large"
                        v-model="form.field_level"
                        cid="field-config-form-field-level-select"
                        placeholder="Please select field level"
                        v-on:change="onFieldLevelChange()"
                      >
                        <el-option
                          v-for="(level, index) in fieldLevels"
                          :cid="'field-config-form-field-level' + index"
                          :key="index"
                          v-bind:value="level"
                          label-width="170px"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="order"
                      label="Order"
                    >
                      <el-input
                        class="threshold-input"
                        type="number"
                        :min="1"
                        cid="field-config-form-order"
                        v-model="form.order"
                        placeholder="E.g. 1"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="document_type"
                      label="Document type"
                    >
                      <el-select
                        v-on:change="onDocumentTypeChange"
                        :disabled="isEditMode"
                        class="select-box"
                        size="large"
                        cid="field-config-form-document-type-select"
                        v-model="form.document_type"
                        filterable
                        reserve-keyword
                        placeholder="Please select document type"
                      >
                        <el-option
                          v-for="(_type, index) in documentTypeList"
                          :cid="'field-config-form-document-type_' + index"
                          :key="_type.value"
                          :label="_type.label"
                          :value="_type.value"
                          label-width="170px"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12" v-if="form.field_level!='package'">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="document_subtype"
                      label="Document subtype"
                    >

                      <el-select
                        v-on:change="onDocumentSubtypeChange"
                        class="select-box"
                        size="large"
                        cid="field-config-form-document-type-select"
                        v-model="form.document_subtype"
                        filterable
                        reserve-keyword
                        placeholder="Please select document subtype"
                      >
                        <el-option
                          v-for="(_type, index) in documentSubtypeList"
                          :cid="'field-config-form-document-type_' + index"
                          :key="_type.value"
                          :label="_type.label"
                          :value="_type.value"
                          label-width="170px"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="type"
                      label="Data type"
                    >
                      <el-select
                        class="select-box"
                        size="large"
                        v-model="form.type"
                        filterable
                        cid="field-config-form-data-type-select"
                        reserve-keyword
                        placeholder="Please select data type"
                        @change="onDatatypeChange"
                      >
                        <el-option
                          v-for="(_type, index) in labelTypes"
                          :cid="'field-config-form-data-type_' + index"
                          :key="_type"
                          :label="_type"
                          :value="_type"
                          label-width="170px"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <!-- new check up -->
                <el-row :gutter="0">
                  <el-col :span="20">
                     <div class="kp-form-group">
                    <el-form-item  class="control-label col-sm-2" label="Checkbox options" required v-if="form.type == 'checkbox'">
                      <div v-for="(option, index) in form.checkbox_options" :key="index">
                          <el-row :gutter="5">
                          <el-col :span="7">
                            <div class="kp-form-group">
                                <el-input
                                  v-model="option.label"
                                  :rows="2"
                                  placeholder="label"
                                ></el-input>
                            </div>
                          </el-col>
                          <el-col :span="7">
                            <div class="kp-form-group">
                                  <el-input
                                    v-model="option.value"
                                    :rows="2"
                                    placeholder="value"
                                  ></el-input>
                            </div>
                          </el-col>
                          <el-col :span="4">
                            <div class="add-chekbox-dropdown-container">
                                  <el-button
                                    class="add-remove"
                                      type="text"
                                      @click="removeCheckboxOptions(index)"
                                      :disabled="form.checkbox_options.length == 1"
                                    >
                                    <span class="mdi mdi-delete"></span>
                                    </el-button>
                                    <el-button class="add-btn"
                                        v-if = "index == form.checkbox_options.length-1"
                                        type="primary"
                                        @click="addCheckboxOptions(option)"
                                      >
                                        <span class="mdi mdi-plus"></span>
                                    </el-button>
                              </div>
                          </el-col>
                          </el-row>
                      </div>
                  </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <!-- options configuration (when "dropdown" data type selected)-->
              <el-row :gutter="40" v-if="form.type=='dropdown'">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="placeholder"
                      label="Place holder"
                    >
                    <el-tooltip class="item" effect="dark" content="Used as placeholder in dynamic forms for dropdown fields" placement="right">
                    <el-input
                        cid="field-config-form-placeholder"
                        class="form-control"
                        v-model="form.placeholder"
                        :rows="2"
                      ></el-input>
                      </el-tooltip>
                    </el-form-item>
                  </div>
                </el-col>
                  <el-col :span="20">
                     <div class="kp-form-group">
                    <el-form-item  class="control-label col-sm-2" label="Dropdown options">
                      <div v-for="(option, index) in form.options" :key="index">
                          <el-row :gutter="5">
                          <el-col :span="7">
                            <div class="kp-form-group">
                                <el-input
                                  v-model="option.key"
                                  :rows="2"
                                  placeholder="Frontend Value"
                                ></el-input>
                            </div>
                          </el-col>
                          <el-col :span="7">
                            <div class="kp-form-group">
                                  <el-input
                                    v-model="option.value"
                                    :rows="2"
                                    placeholder="Backend Value"
                                  ></el-input>
                            </div>
                          </el-col>
                          <el-col :span="4">
                            <div class="add-chekbox-dropdown-container">
                                  <el-button
                                    class="add-remove"
                                      type="text"
                                      @click="removeDropdownOptions(index)"
                                    >
                                    <span class="mdi mdi-delete"></span>
                                    </el-button>
                                    <el-button class="add-btn"
                                        v-if = "index == form.options.length-1"
                                        type="primary"
                                        @click="addDropdownOptions"
                                      >
                                        <span class="mdi mdi-plus"></span>
                                    </el-button>
                              </div>
                          </el-col>
                          </el-row>
                      </div>
                  </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="field_type"
                      label="Field type"
                    >
                      <el-select
                        class="select-box"
                        size="large"
                        v-model="form.field_type"
                        filterable
                        reserve-keyword
                        cid="field-config-form-field-type-select"
                        placeholder="Please select field type"
                      >
                        <el-option
                          v-for="(_type, index) in fieldTypes"
                          :cid="'field-config-form-field-type_' + index"
                          :key="_type"
                          :label="_type"
                          :value="_type"
                          label-width="170px"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="40" v-if="form.field_type== 'table'">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="width"
                      label="Width"
                    >
                    <el-tooltip content="Width should be in pixels" placement="top">
                      <el-input
                        class="threshold-input"
                        type="number"
                        :min="1"
                        cid="field-config-form-width"
                        v-model="form.width"
                      ></el-input>
                    </el-tooltip>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="40" v-if="form.field_type== 'header'">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="list_view_column_width"
                      label="List view column width"
                    >
                    <el-tooltip content="Width should be in pixels" placement="top">
                      <el-input
                        class="threshold-input"
                        type="number"
                        :min="1"
                        cid="field-config-form-list-view-column-width"
                        v-model="form.list_view_column_width"
                      ></el-input>
                    </el-tooltip>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="40">
                <el-col :span="10">
                  <div class="kp-form-group">
                    <el-form-item label="Derived field">
                      <el-checkbox
                        cid="field-config-form-derived-field"
                        class="active-input"
                        v-model="form.is_derived_field"
                      ></el-checkbox>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

           <!-- end new check up -->

           <div clss="maptofield" v-if=" form.field_level=='package'">
              <div class="grouping-divide"></div>
              <div class="grouping-tile">Map to field</div>
              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="map_to_document_subtype"
                      label="Document subtype"
                    >
                    <el-select
                        v-on:change="onMapToDocumentSubtypeChange"
                        class="select-box"
                        size="large"
                        v-model="form.map_to_document_subtype"
                        placeholder="Please select document subtype"
                      >
                        <el-option
                          v-for="(_type, index) in documentSubtypeList"
                          :cid="'field-config-form-maptodocument-subtype' + index"
                          :key="_type.value"
                          :label="_type.label"
                          v-bind:value="_type.value"
                          label-width="170px"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="map_to_Subtype_field"
                      label="Field"
                    >
                    <el-select
                        class="select-box"
                        size="large"
                        v-model="form.map_to_Subtype_field"
                        placeholder="Please select field"
                      >
                        <el-option
                          v-for="(_type, index) in mapSubtypeFieldList"
                          :cid="'field-config-form-mapto_field_' + index"
                          :key="_type.name"
                          :label="_type.label"
                          :value="_type.name"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="grouping-divide"></div>
            <!-- <div class="grouping-tile">Criteria</div>
              <div class="grouping-divide"></div> -->

              <div class="grouping-tile">Additional configuration</div>

              <el-row :gutter="40">
                <el-col>
                  <div class="kp-form-group">
                    <el-form-item
                      id="query-builder"
                      prop="field_condition"
                      label="Display condition"
                    >
                      <QueryBuilder
                        cid="field-config-form-disp-condi"
                        @onQueryChange="onQueryChange"
                        :query="form.field_condition"
                        :documentType="form.document_type"
                        :documentSubtype="form.document_subtype"
                        :dataToShow='["fieldsData","fileTypeData"]'
                      ></QueryBuilder>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <!-- <hr class="grouping-divide"> -->


              <!-- For auto complete -->
              <el-row
                :gutter="40"
                v-if="
                  autoCompleteScriptList && autoCompleteScriptList.length > 0
                "
              >
                <el-col :span="12" >
                  <div class="kp-form-group">
                    <el-form-item
                      label="Enable autocomplete"
                    >
                      <el-checkbox
                        cid="field-config-form-autocomplete"
                        v-model="form.enable_autocomplete"
                      ></el-checkbox>
                     <el-col :span="9">
                          <div
                              v-if="form.enable_autocomplete"
                              class="kp-form-group select-box-container"
                            >
                              <el-form-item
                                prop="auto_complete_id"
                              >
                                <el-select
                                  class="select-box"
                                  size="large"
                                  v-model="form.auto_complete_id"
                                  cid="field-config-form-auto-rule-select"
                                  filterable
                                  reserve-keyword
                                  placeholder="Please select autocomplete rule"
                                >
                                  <el-option
                                    v-for="(item, index) in filterAutoCompleteList"
                                    :key="item._id"
                                    :cid="'field-config-form-auto-rule_' + index"
                                    :label="item.name"
                                    :value="item._id"
                                    label-width="170px"
                                  ></el-option>
                                </el-select>
                              </el-form-item>
                            </div>
                      </el-col>

                    </el-form-item>
                  </div>
                </el-col>

                <el-col :span="10">
                  <div class="kp-form-group">
                    <el-form-item label="Flex field">
                      <el-checkbox
                        cid="field-config-form-mandatory"
                        class="active-input"
                        v-model="form.is_flex_field"
                      ></el-checkbox>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <!-- For reference -->
              <el-row
                :gutter="40"
                v-if="autoCompleteScriptList && autoCompleteScriptList.length"
              >
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      label="Enable reference"
                    >
                      <el-checkbox
                        cid="field-config-form-reference"
                        v-model="form.enable_reference"
                      ></el-checkbox>
                           <el-col>
                              <div
                                v-if="form.enable_reference"
                                class="kp-form-group select-box-container"
                              >
                                <el-form-item
                                  prop="reference_id"
                                >
                                  <el-select
                                    class="select-box"
                                    cid="field-config-form-referance-select"
                                    size="large"
                                    v-model="form.reference_id"
                                    filterable
                                    reserve-keyword
                                    placeholder="Please select reference"
                                  >
                                    <el-option
                                      v-for="(item, index) in filterReferenceList"
                                      :cid="'field-config-form-enable-referance_' + index"
                                      :key="item._id"
                                      :label="item.name"
                                      :value="item._id"
                                      label-width="170px"
                                    ></el-option>
                                  </el-select>
                                </el-form-item>
                              </div>
                            </el-col>
                    </el-form-item>
                  </div>
                </el-col>

                <!--Include in approval email?  -->
                <!-- <el-row :gutter="40"> -->
                <el-col :span="10">
                  <div class="kp-form-group">
                    <el-form-item label="Include in approval email?">
                      <el-checkbox
                        cid="field-config-form-mandatory"
                        class="active-input"
                        v-model="form.send_to_approval"
                      ></el-checkbox>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>


              <el-row :gutter="40" v-if="!(form.field_type == 'table'  || form.type == 'checkbox' || form.type == 'date')">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                    prop="is_masked"
                    >
                      <div slot="label" class="sensitive_label">
                        Hide Sensitive?
                        <el-tooltip
                        content="Hide Sensitive information on document"
                        placement="top"
                        effect="light"
                        >
                        <span class="mdi mdi-information-outline"></span>
                      </el-tooltip>
                    </div>
                    <el-switch v-model="form.is_masked"></el-switch>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>


              <el-row :gutter="40" v-if="form.is_flex_field">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="flex_field_name"
                      label="Flex field name"
                    >
                      <el-input
                        cid="field-config-form-flex_field_name"
                        class="form-control"
                        v-model="form.flex_field_name"
                        :rows="2"
                        placeholder="Please enter flex field name"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="flex_field_category"
                      label="Flex field category"
                    >
                      <el-input
                        cid="field-config-form-flex_field_category"
                        class="form-control"
                        v-model="form.flex_field_category"
                        :rows="2"
                        placeholder="Please enter flex field category"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                    label="Enable audit"
                    >
                      <el-checkbox
                        cid="field-config-form-enable-audit"
                        class="active-input"
                        v-model="form.enable_audit"
                      ></el-checkbox>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item label="Enable autocorrect">
                      <el-checkbox
                        cid="field-config-form-enable-auto-correct"
                        class="active-input"
                        v-model="form.enable_autocorrect"
                      ></el-checkbox>
                    </el-form-item>
                  </div>
                  <div class="kp-form-group">
                    <el-form-item label="Add to approval history">
                      <el-checkbox
                        cid="field-config-form-include-approval-history"
                        class="active-input"
                        v-model="form.include_approval_history"
                      ></el-checkbox>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

            <el-row :gutter="40">
              <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item label="Mandatory">
                      <el-checkbox
                        cid="field-config-form-mandatory"
                        class="active-input"
                        v-model="form.is_mandatory"
                      ></el-checkbox>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item label="Move to document">
                      <el-checkbox
                        cid="field-config-form-move-to-doc"
                        class="active-input"
                        v-model="form.move_to_document"
                      ></el-checkbox>
                    </el-form-item>
                  </div>
                </el-col>
            </el-row>

            </el-form>
          </div>
          <!-- | panel body -->
          <footer>
            <div></div>
            <div>
              <el-button
                cid="field-config-form-cancel"
                size="small"
                v-on:click="onBack"
                >Cancel</el-button
              >
            </div>
            <div>
              <el-button
                v-if="isSaveActionAllowed"
                :disabled="disableSave"
                size="small"
                cid="field-config-form-save"
                v-on:click="saveField"
                type="primary"
                >Save</el-button
              >
            </div>
            <!-- <p>Generated output:</p>
              <pre>{{ JSON.stringify(this.form.field_condition, null, 2) }}</pre>-->
          </footer>
        </div>
        <!-- | panel -->
      </section>
      <!-- | form-page-container -->
    </section>
    <section class="page-body">
      <h3 class="page-title" v-if="showDatatable && isEditMode">
        Field Event scripts
      </h3>
      <div v-if="showDatatable && isEditMode" class="grid-content bg-purple">
        <div data-v-step="2" class="table-wrap">
          <data-table :parameters="documentScriptTableParams" ref="datatable"></data-table>
        </div>
      </div>
    </section>
    <section class="page-body">
      <h3 class="page-title" v-if="showDatatable && isEditMode">
        Business rule
      </h3>
      <div v-if="showDatatable && isEditMode" class="grid-content bg-purple">
        <div data-v-step="2" class="table-wrap">
          <data-table :parameters="BusinessRuleTableParams" ref="datatable"></data-table>
        </div>
      </div>
    </section>

    <!--BR mapping Dialogs -->
    <div v-if="displayAddBRDialog">
      <el-dialog
        width="65%"
        :show-close="false"
        :destroy-on-close="true"
        class="folder-modal-container"
        title="Add Business Rule"
        :visible.sync="displayAddBRDialog"
        center
      >
        <AddBusinessRule
          :field="form"
          :displayAddBRDialog.sync="displayAddBRDialog"
        />
      </el-dialog>
    </div>

    <VersionRelatedList v-if="showVersionList" :id="form._id"  title="Field config versions"></VersionRelatedList>
  </el-main>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import Constants from "@/resources/Constants";
import FieldService from "@/idp/services/FieldService";
import _ from "lodash";
import VueQueryBuilder from "vue-query-builder";
let jsonpath = require("jsonpath");
import EventBus from "@/EventBus";
import AddBusinessRule from "@/idp/components/AddBusinessRule.vue";
import QueryBuilder from "@/idp/pages/QueryBuilder.vue";
import DocumentScriptService from "@/idp/services/DocumentScriptService";
import CustomerConfig from "@/idp/services/DeCustomerConfig";
import VersionRelatedList from "@/idp/components/VersionRelatedList.vue";
import formMixin from "@/mixins/formMixin.js";

export default {
  name: "FieldConfigForm",
  components: {
    DataTable,
    VueQueryBuilder,
    QueryBuilder,
    AddBusinessRule,
    VersionRelatedList
    },
    mixins: [formMixin],
  watch: {
    displayAddBRDialog(val) {
      if (!val) {
        //$refs.datatable.refreshTable();
        this.reRenderDatatable();
      }
    },
  },
  computed: {
    filterAutoCompleteList() {
      return this.autoCompleteScriptList.filter(
        (list) => list.type == this.constants.SCRIPT_TYPE.AUTO_COMPLETE
      );
    },
    filterReferenceList() {
      return this.autoCompleteScriptList.filter(
        (list) => list.type == this.constants.SCRIPT_TYPE.REFERENCE
      );
    },
    BusinessRuleTableParams() {
      return {
        aggregation: true,
        defaultData: {
          de_field_id: this.form._id,
          document_type: this.form.document_type,
          active: true,
        },
        apiName: `/portal/api/business-rule-field-map?document_type=${this.form.document_type}&de_field_id=${this.form._id}`,
        saveAPI: `/portal/api/table/de_business_rule_field_map`,
        tableName: "field_business_rule_map",
        tableHeaderConfigParams: {
          document_type: this.form.document_type,
        },
        isRestify: false,
        queryParam: {
          active: true,
          de_field_id: this.form._id || null,
          document_type: this.form.document_type
        },
        limit: 10,
        allowInline: true,
        hideAddButton: true,
        inlineAddButtonConfig: {
          disable: this.isEditMode ? false : true,
        },

        addButtonConfig: {
          event: "add-business-rule-from",
          name: "Add rule",
        },
      };
    },
    documentScriptTableParams() {
      return {
        aggregation: true,
        defaultData: {
          field_id: this.form._id,
          document_type: this.form.document_type,
          active: true,
        },
        apiName: `/portal/api/table/de_document_script`,
        tableName: "de_document_script_ui_event",
        tableHeaderConfigParams: {
          document_type: this.form.document_type,
        },
        isRestify: true,
        queryParam: {
          active: true,
          field_id: this.form._id || null,
          document_type: this.form.document_type
        },
        limit: 10,
        allowInline: true,
        hideAddButton: true,
        inlineAddButtonConfig: {
          disable: this.isEditMode ? false : true,
        },

        addButtonConfig: {
          path: `/idp/ui-event-script-form?field_id=${this.form._id}&document_type=${this.form.document_type}`,
          name: "Add UI Event Script",
        },
      };
    },
  },
  data() {
    var validateLabel = (rule, value, callback) => {
      if (value && value.trim() === "") {
        callback(new Error(`Please enter valid ${rule.field}`));
      } else {
        callback();
      }
    };
    var QueryBuilderValidator = (rule, value, callback) => {
      if (!value.children || !value.children.length) {
        callback();
        return;
      }
      let operatorsToExclude = ["is empty", "is not empty"];
      let rulesInFieldCondition = jsonpath.query(
        value,
        '$..children[?(@.type=="query-builder-rule")].query'
      );
      if (!rulesInFieldCondition.length) {
        callback(new Error("Rules not found in the provided condition."));
        return;
      }
      //check if rules have operator other than "is empty"and "is not empty" and have no value
      let rulesWithNullVal = _.filter(rulesInFieldCondition, (obj) => {
        return (
          !_.includes(operatorsToExclude, obj.operator) && obj.value == null
        );
      });
      if (rulesWithNullVal.length) {
        callback(
          new Error(
            `Values in rules cannot be empty for operators other than "is empty"and "is not empty".`
          )
        );
        return;
      }
      //check if rules have operator "is empty" or "is not empty" and have some value
      let rulesWithVal = _.filter(rulesInFieldCondition, (obj) => {
        return _.includes(operatorsToExclude, obj.operator) && obj.value;
      });
      if (rulesWithVal.length) {
        callback(
          new Error(
            `Values provided in rules for operators "is empty"and "is not empty".`
          )
        );
        return;
      }
      callback();
    };
    var flexFieldNameValidator = (rule, value, callback) => {
      if (!this.form.is_flex_field) return callback();
      if (!value || ("" + value).trim() === "") {
        callback(new Error("Flex field name cannot be empty"));
        return;
      }
      callback();
    };
    var flexFieldCategoryValidator = (rule, value, callback) => {
      if (!this.form.is_flex_field) return callback();
      if (!value || ("" + value).trim() === "") {
        callback(new Error("Flex field category cannot be empty"));
        return;
      }
      callback();
    };
    var checkboxOptionsValidator = (rule, value, callback) => {
      if (!this.form.checkbox_options) return callback();
      if (!value || ("" + value).trim() === "") {
        callback(new Error("Flex field category cannot be empty"));
        return;
      }
      callback();
    };
    return {
      showVersionList:true,
      rules: [],
      disableSave: false,
      constants: Constants.DOCEX,
      displayAddBRDialog: false,
      displayAddUIScriptDialog: false,
      isSaveActionAllowed: true,
      fieldDataTypeMapping: {
        string: "text",
        date: "date",
        currency: "currency",
        dropdown: "text",
      },
      isEditMode: false,
      labelTypes: Constants.DOCEX.LABEL_TYPE,
      fieldLevels: Constants.DOCEX.FIELD_LEVEL,
      loading:false,
      form: {
        move_to_document: false,
        width:'',
        list_view_column_width:'',
        field_condition: {
          logicalOperator: "all",
          children: [],
        },
        field_level:"document",
        map_to_Subtype_field:"",
        map_to_document_subtype:"",
        is_masked: false,
        checkbox_options: [{}],
        placeholder:"",
        options:[{}],
        is_derived_field : false,
        include_approval_history: false
      },
      pageTitle: "field configuration",
      formRules: {
        label: [
          {
            validator: validateLabel,
            trigger: "blur",
          },
          {
            required: true,
            message: "Please enter label",
            trigger: "blur",
          },
        ],
        name: [
          {
            validator: validateLabel,
            trigger: "blur",
          },
          {
            required: true,
            message: "Please enter name",
            trigger: "blur",
          },
        ],
        field_type: [
          {
            required: true,
            message: "Please select field type",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "Please select data type",
            trigger: "blur",
          },
        ],
        document_type: [
          {
            required: true,
            message: "Please select document type",
            trigger: "blur",
          },
        ],
        field_condition: [
          {
            validator: QueryBuilderValidator,
            trigger: "blur",
          },
        ],
        flex_field_name: [
          {
            validator: flexFieldNameValidator,
            trigger: "blur",
          },
        ],
        flex_field_category: [
          {
            validator: flexFieldCategoryValidator,
            trigger: "blur",
          },
        ],
      },
      fieldTypes: Constants.DOCEX.FIELD_TYPE,
      documentTypeList: [],
      documentSubtypeList: [],
      showDatatable: true,
      deBRParam: {},
      autoCompleteScriptList: [],
    };
  },
  methods: {
    async onMapToDocumentSubtypeChange(){
      this.form.map_to_Subtype_field = null;
      if(this.form.field_level=="package" && this.form.document_type)
      {
        this.loading = true;
        let params = {
          "document_type":this.form.document_type,
          "document_subtype":this.form.map_to_document_subtype
        }
        let projection = {label:1,field_level:1,_id:1}
        let fieldResponse = await FieldService.getFieldsList(params,projection);
        this.mapSubtypeFieldList = fieldResponse;
        this.loading = false;
      }
    },
    async onFieldLevelChange(){
      await this.getDocumentSubtypes();

    },
    addCheckboxOptions() {
      this.form.checkbox_options.push({
        label: "",
        value: "",
      });
    },
    removeCheckboxOptions(_index) {
      this.form.checkbox_options.splice(_index, 1);
    },
    async getDocumentTypes() {
      const docTypeConfig = await CustomerConfig.getAllDocsCustConfiguration({document_type: { $exists: true}});
      this.documentTypeList = CustomerConfig.getDocumentTypeList(docTypeConfig);
    },
    async getDocumentSubtypes() {
      let customerConfigurations = await CustomerConfig.getAllDocsCustConfiguration();
      let self = this;

        let customerConfiguration = _.find(
          customerConfigurations,
          function (config) {
            return config.document_type === self.form.document_type;
          }
        );
       if(this.form.field_level!="Package"){
        this.documentSubtypeList = _.map(
          customerConfiguration["document_subtype_list"],
          function (item) {
            return { label: item, value: item };
          }
        );
      }
    },
    onQueryChange(input) {
      this.form.field_condition = input.val;
    },

    onBack() {
      let redirectUrl = this.$route.query.redirect_url;
      let documentId = this.$route.query.document_id;
      if (redirectUrl && documentId) {
        this.$router.push({
          path: redirectUrl,
          query: {
            id: documentId,
          },
        });
        return;
      }
      //to check if we have come back frmo "UIEventScript" page
      const redirectedPath=this.$route.query.fromPage;
      //when redirectedPath is "UIEventScript" that means we have moved back from "UIEventScript" page, now on "BACK" click we DON'T want to
      //move again to "UIEventScript" page so now on click on back we will move to "/field-configuration" list view page
      if(redirectedPath=="UIEventScript"){
        this.$router.push("/idp/field-configuration");
      }
      else if(window.history.length > 2){
        this.$router.back()
      }else{
        this.$router.push("/idp/field-configuration");
      }
    },

    handleLabelInput() {
      if (this.form._id) {
        return;
      }
      let name = (this.form["label"] || "").trim().replace(/\s+/g, "_");
      name = name ? `c_${name.toLowerCase()}` : "";
      this.$set(this.form, "name", name);
      if (name) {
        this.$refs["form"].clearValidate(["name"]);
      }
    },

    reRenderDatatable() {
      this.showDatatable = false;
      this.$nextTick(() => {
        this.showDatatable = true;
      });
    },
    async onDocumentTypeChange(documentType) {
      await this.prepareRulesList(documentType);
      await this.getDocumentSubtypes();
    },
    async onDocumentSubtypeChange(documentType) {},

    async saveField() {
      this.showVersionList = false;
      this.disableSave = true;
      let isValid = await this.$refs.form.validate().catch((error) => {});
      if (!isValid) {
        this.disableSave = false;
        return;
      }

      // empty respective id if enable is false
      !this.form.enable_autocomplete && delete this.form.auto_complete_id;
      !this.form.enable_reference && delete this.form.reference_id;
      !this.form.is_flex_field && delete this.form.flex_field_name;
      !this.form.is_flex_field && delete this.form.flex_field_category;

      let res = await FieldService.save(this.form).catch((errorMessage) => {
        this.notifyError(errorMessage);
      });
      if (res) {
        this.form = res;
        this.reRenderDatatable();
        this.notifySuccess("Records saved successfully");
      }
      this.disableSave = false;
      this.showVersionList = true;
    },
    async prepareRulesList(documentType) {
      // this.$setLoader({
      //   target: "#query-builder",
      //   spinner: "el-icon-loading",
      // });
      // let rules = [];
      // let fieldListParams = {
      //   field_type: "header",
      //   document_type: documentType,
      // };
      // let fieldsListData = await FieldService.getFieldsList(
      //   fieldListParams
      // ).catch((err) => {
      //   console.log("Error encountered while getting Fields list: ", err);
      //   return false;
      // });
      // fieldsListData = _.sortBy(fieldsListData, "name");
      // _.map(fieldsListData, (fieldData) => {
      //   let type = this.fieldDataTypeMapping[fieldData.type] || "text";
      //   let ruleObj = {
      //     type: _.includes(["date", "currency"], type) ? "custom" : type,
      //     id: fieldData.name,
      //     label: fieldData.label,
      //   };
      //   type == "date" &&
      //     ((ruleObj["inputType"] = "date"),
      //     (ruleObj["operators"] = [
      //       "is equals",
      //       "is before",
      //       "is after",
      //       "is same or before",
      //       "is same or after",
      //     ]));
      //   type == "currency" &&
      //     ((ruleObj["inputType"] = "number"),
      //     (ruleObj["operators"] = ["=", ">=", "<=", "<", ">"]));
      //   rules.push(ruleObj);
      // });
      // this.rules = rules;
      // this.$resetLoader();
      return true;
    },
    async init() {
       this.loading=true
    let list = await DocumentScriptService.get({ active: true });
    if (list) {
      this.autoCompleteScriptList = list;
    }
    await this.getDocumentTypes();
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
    this.registerEvents();
    let fieldId = this.$route.query.id;
    if (!fieldId) {
      this.loading=false;
      return};
    this.isEditMode = true;
      EventBus.$on("onChange", async (selectedField) => {
        this.deBRParam[selectedField.field] = selectedField.value;
        let de_br_field = _.find(this.$refs.datatable._data.columns, {
          field: "de_business_rule_id",
        });
        let new_de_br_field_options = await FieldService.getBusinessRule(
          this.deBRParam,
          this.form.document_type
        );
        console.log(new_de_br_field_options);
        if (new_de_br_field_options)
          de_br_field.filterOptions.options = new_de_br_field_options;
      });

      let response = await FieldService.fetchById(fieldId).catch((error) => {
        this.notifyError("Error while fetching field data");
      });
      this.form =
        (response && _.defaultsDeep(response, this.form)) || this.form;
      await this.prepareRulesList(this.form.document_type);
      this.$nextTick(() => {
        this.reRenderDatatable();
      });
             this.loading=false
    },

    registerEvents() {
      EventBus.$on("add-business-rule-from", async (value) => {
        this.displayAddBRDialog = true;
      });
      EventBus.$on("refresh-version-list", data => this.handleRefreshForm(data));
    },

    async handleRefreshForm(data = {}){
          //this.$forceUpdate();
        this.showVersionList = false;
        await this.init();
        this.showVersionList = true;
     },
     //method to add dropdown options in key value format
    addDropdownOptions() {
      this.form.options.push({
        key: "",
        value: "",
      });
    },
    //method to remove option when clicked on option-delete btn
    removeDropdownOptions(_index){
      this.form.options.splice(_index, 1);
    },
    //method clear options when data type changed
    onDatatypeChange(){
      this.form.options=[{}]
    },
  },
  beforeDestroy() {
    EventBus.$off(["add-business-rule-from", "onChange","refresh-version-list"]);
  },
  async beforeMount() {
    this.isSaveActionAllowed = await this.isSaveActionPermitted('de_field');
    this.init();
  },
};
</script>

<style lang="scss">
@import "../_idpGlobal";
.add-chekbox-dropdown-container {

  .kp-form-group {
    display: inline-block;
    // width: 109px;
     width: 16%;
    margin-left: .4rem;
  }
  .el-button {
    line-height: 0;
  }
  .add-btn {
    border: 1px solid var(--brand-05);
    padding: 12px 5px;
    line-height: 0;
    margin: 0;
    display: inline-block;
    font-size:1.1rem;

    vertical-align: middle;
  }
  .add-remove {
     border: 1px solid var(--red-06);
      padding: 12px 5px;
      line-height: 0;
      margin: 0;
      display: inline-block;
      color: var(--red-05);
       font-size:1.1rem;

    vertical-align: middle;
  }
  .label {
    	width: 8rem;
      font-size: var(--font-sm);
      color: var(--dark-04);
      line-height: 220%;
  }
}


.el-select-dropdown{
      width: 150px;
}
.form-page-container {
  .checkbox_input{
    width: auto;
    height: 100%;
    line-height: 120%;
  }
  .script-container {
    display: flex;
    .select-box-container {
      .el-form-item__content {
        margin-left: 0px !important;
      }
    }
  }
  .sensitive_label {
    display: flex;
    width: max-content;
    align-items: center;
    span {
      margin-left: 5px;
      font-size: 14px;
      color: var(--dark-05);
    }
  }
}
</style>
