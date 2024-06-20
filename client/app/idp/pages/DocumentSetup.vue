<template>
    <el-main class="kp-main slushbucket_container">
    <section class="page-body">
          <div class="page-title"  v-if="form._id">
            <el-button  cid="form-header-back" v-on:click="$router.push('/idp/document-setup-list')" icon="mdi mdi-arrow-left-circle-outline"></el-button>
            <span class="page-title-text">Edit {{pageTitle}}</span>
            <span> Add document type configurations </span>
          </div>

          <div class="page-title"  v-if="!form._id">
            <el-button  cid="form-header-back" v-on:click="$router.push('/idp/document-setup-list')" icon="mdi mdi-arrow-left-circle-outline"></el-button>
            <span class="page-title-text">Add {{pageTitle}}</span>
            <span> Add document type configurations</span>
          </div>

            <section  v-loading="loading" class="form-page-container tabs-page-container">
                 <div class="panel">
                    <div class="panel-body">
                        <el-form label-position="left" :model="form" :rules="formRules" ref="form" label-width="120px">

                            <el-tabs v-model="activeTab" @tab-click="handleClick">
                                <el-tab-pane label="General" name="general">
                                <div class="tab-body">

                                    <el-divider content-position="left">General configuration</el-divider>

                                    <el-row :gutter="40">
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item prop="document_type" label="Document type">
                                                    <!-- <el-select cid="doc-setup-form-document-type-select" name="document_type" v-model="form.document_type" placeholder="Select document type"  v-on:change="onDocumentTypeChange">
                                                        <el-option v-for="(type,index) in document_type_list" :cid="'doc-setup-form-document-type_'+index" :key="type" :label="type" :value="type"></el-option>
                                                    </el-select> -->
                                                    <el-input v-model="form.document_type" cid="kp-form-document-type" placeholder="Provide document type"></el-input>
                                                </el-form-item>
                                            </div>
                                       </el-col>

                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <!-- <el-form-item prop="domain" label="Domain">
                                                    <el-select disabled name="domain" cid="doc-setup-form-domain-type-select" v-model="form.domain" placeholder="Select domain type" >
                                                        <el-option v-for="(domain,index) in options" :cid="'doc-setup-form-domain-type_'+index" :key="domain._id" :label="domain.name" :value="domain._id"></el-option>
                                                    </el-select>
                                                </el-form-item> -->
                                                <el-form-item prop="view" label="View">
                                                <el-radio-group  v-model="form.view">
                                                        <el-radio label="document" >Document view</el-radio>
                                                        <el-radio label="package" >Package view</el-radio>
                                                </el-radio-group>
                                                </el-form-item>
                                            </div>
                                       </el-col>
                                    </el-row>

                                     <el-row :gutter="40">
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item prop="classification_model_id" label="Classification Model">
                                                    <el-select name="classification_model_id" cid="doc-setup-form-domain-type-select" v-model="form.classification_model_id" placeholder="Select Classification Model type" >
                                                        <el-option v-for="(model,index) in classification_model_options" :cid="'doc-setup-form-domain-type_'+index" :key="model._id" :label="model.model_name" :value="model._id"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </div>
                                       </el-col>

                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                    <el-form-item  prop="max_attachment_size_per_doc"
                                                    label="Max document size(MB)">
                                                    <el-input cid="doc-setup-form-max-document-size" name="approver"  v-model="form.max_attachment_size_per_doc"
                                                    type="input" :rows=2 placeholder="Max accepted size of document in MB"></el-input>
                                                    </el-form-item>
                                            </div>
                                            </el-col>
                                        </el-row>

                                    <el-row :gutter="40">
                                        <el-col :span="12">
                                        <div class="kp-form-group">
                                                <el-form-item  prop="max_number_of_attachments_per_doc"
                                                label="No of attachment">
                                                <el-input cid="doc-setup-form-max_attachments_per_doc" name="approver" v-model="form.max_number_of_attachments_per_doc"
                                                type="input" :rows=2 placeholder="Max no of attachment for document type"></el-input>
                                                </el-form-item>
                                        </div>
                                        </el-col>

                                        <el-col :span="12">
                                        <div class="kp-form-group">
                                                <el-form-item prop="dateFormat" label="Date format">
                                                    <el-select cid="doc-setup-form-date-format-select" name="dateformat" clearable filterable v-model="form.date_format" placeholder="Select date format">
                                                        <el-option v-for="(item,index) in dateFormats" :cid="'doc-setup-form-date_'+index" :key="item" :label="item" v-bind:value="item"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                        </div>
                                        </el-col>
                                    </el-row>

                                    <el-row :gutter="40">
                                        <el-col :span="12">
                                        <div class="kp-form-group">
                                                <el-form-item
                                        class="kp-form-field-label"
                                        prop="language"
                                        label="Preffered language"
                                      >
                                        <el-select
                                          name="language"
                                          filterable
                                          cid="doc-setup-form-lng-select"
                                          v-model="form.language"
                                          placeholder="Select language"
                                        >
                                          <el-option
                                            v-for="(language,index) in languages"
                                            :key="language.value"
                                            :cid="'doc-setup-form-lng_'+index"
                                            :label="language.label"
                                            :value="language.value"
                                          ></el-option>
                                        </el-select>
                                      </el-form-item>
                                        </div>
                                        </el-col>
                                       <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item
                                        class="control-label col-sm-2"
                                        prop="supported_files"
                                        label="Supported files"
                                        >
                                        <el-select
                                            v-model="form.supported_files"
                                            class="select-box"
                                            cid="doc-setup-form-file-supported-files"
                                            multiple
                                            collapse-tags
                                            placeholder="Select supported files"
                                        >
                                            <el-option
                                            v-for="(file,index) in supportedFiles"
                                            :cid="'doc-setup-form-file-supported-files'+index"
                                            :key="file"
                                            :label="file"
                                            :value="file"
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
                                                <el-form-item prop="page_type_mapping" label="Page Type Mapping">
                                                    <el-input v-model="form.page_type_mapping" placeholder="Enter Page Types" @change="handlePageTypeMappingChange"/>
                                                </el-form-item>
                                            </div>
                                        </el-col>

                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item label="Document sub types">
                                                    <el-select
                                                        v-model="form.document_subtype_list"
                                                        multiple
                                                        filterable
                                                        allow-create
                                                        collapse-tags
                                                        default-first-option
                                                        placeholder="Add New Document SubType">
                                                        <el-option
                                                            v-for="(subType, index) in form.document_subtype_list"
                                                            :key="index"
                                                            :label="subType"
                                                            :value="subType">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="40" >
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item label="Multi document">
                                                    <el-switch v-model="form.multi_document"></el-switch>
                                                </el-form-item>
                                            </div>
                                        </el-col>

                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item label="Enable email view">
                                                    <el-switch v-model="form.enable_email_view"></el-switch>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <!-- This feature is specific to the service_contract, so it will only appear in the service_contract document type configuration. -->
                                    <el-row :gutter="40" >
                                        <el-col :span="12" v-if="isServiceContract()">
                                            <div class="kp-form-group">
                                                <el-form-item>
                                                    <span slot="label">
                                                        CUAD Dataset
                                                    <el-tooltip content="Toggling this feature will assign the dataset as a Contract Understanding Atticus Dataset (CUAD) type for the user and enable the rendering of word-by-word bounding boxes in the Document Viewer.">
                                                        <i class="el-icon-question"></i>
                                                    </el-tooltip>
                                                    </span>
                                                    <el-switch v-model="form.is_cuad_type"></el-switch>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                    </el-row>

                                    <el-divider content-position="left">Criteria</el-divider>

                                    <el-row :gutter="40">
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item  prop="enable_approval" label="Enable approval">
                                                    <el-checkbox cid="doc-setup-form-enable-approval" v-model="form.config.enable_approval" @change="deSelectWorkFlow($event)"></el-checkbox>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                        <el-col :span="12">
                                            <div
                                                v-if="form.config.enable_approval"
                                                class="kp-form-group select-box-container"
                                            >
                                                <el-form-item
                                                    class="control-label col-sm-2"
                                                    prop="approval_workflow_id"
                                                    label="Approval workflow"
                                                >
                                                    <el-select
                                                    class="select-box"
                                                    size="large"
                                                    v-model="form.approval_workflow_id"
                                                    cid="field-config-form-workflows-select"
                                                    placeholder="Please select work flow"
                                                    clearable
                                                    >
                                                    <el-option
                                                        v-for="(item, index) in enable_approval_workflow_list"
                                                        :key="item._id"
                                                        :cid="'field-config-form-workflows_' + index"
                                                        :label="item.name"
                                                        :value="item._id"
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
                                                <el-form-item  label="Enable Approval Passcode">
                                                     <toggle-button :sync="true" :color="{
                                                        checked: '#5f8fdf',
                                                        unchecked: '#DCDFE6',
                                                        disabled: '#CCCCCC',
                                                    }" :labels="{ checked: 'ON', unchecked: 'OFF' }" cid="doc-setup-form-enable-passcode" v-model="form.config.enable_approval_passcode"></toggle-button>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item  prop="show_confidence_score" label="Show confidence score">
                                                    <el-checkbox cid="doc-setup-form-enable-approval" v-model="form.config.show_confidence_score"></el-checkbox>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                    </el-row>

                                    <!-- <el-row :gutter="40">

                                    </el-row> -->

                                    <el-row :gutter="40">

                                    </el-row>

                                    <el-row :gutter="40">
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item prop="auto_publish_enabled" label="Enable autopublish">
                                                    <el-checkbox cid="doc-setup-form-enable-autopublish" v-model="form.auto_publish_enabled"></el-checkbox>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                        <!-- added  classification_enable_on_manual_upload flag for configuration -->
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                            <el-form-item prop="classification_enable_on_manual_upload"  label="Classification enable on manual upload">
                                                <el-checkbox v-model="form.classification_enable_on_manual_upload" cid="classification_enable_on_manual_upload_config"></el-checkbox>
                                            </el-form-item>
                                            </div>
                                        </el-col>
                                    </el-row>

                                    <el-divider content-position="left">Auto Learning</el-divider>

                                    <el-row :gutter="40">
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item  label="Enable autolearning">
                                                     <toggle-button :sync="true" :color="{
                                                        checked: '#5f8fdf',
                                                        unchecked: '#DCDFE6',
                                                        disabled: '#CCCCCC',
                                                    }" :labels="{ checked: 'ON', unchecked: 'OFF' }" cid="doc-setup-form-enable-auto-learning" v-model="form.auto_learning.enable"></toggle-button>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="40">
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item
                                                class="control-label col-sm-2"
                                                label="Trigger stages"
                                                prop="trigger_stages"
                                            >
                                            <el-select
                                                class="select-box"
                                                size="large"
                                                name="trigger_stages"
                                                multiple
                                                collapse-tags
                                                v-model="form.auto_learning.trigger_stages"
                                                placeholder="Please select stage"
                                                >
                                                <el-option
                                                    v-for="(item, index) in triggerStages_List"
                                                    :key="item"
                                                    :label="item"
                                                    :cid="'stage-tab_'+index"
                                                    v-bind:value="item"
                                                ></el-option>
                                                </el-select>
                                            </el-form-item>
                                            </div>
                                        </el-col>
                                    </el-row>

                                    <el-divider content-position="left">Extraction</el-divider>
                                    <el-row :gutter="40">
                                        <!-- LLM extraction enable option -->
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item prop="enable_llm_extraction" label="Enable LLM extraction">
                                                    <el-checkbox
                                                        cid="doc-setup-form-enable-llm-extraction"
                                                        v-model="form.enable_llm_extraction"
                                                    >
                                                    </el-checkbox>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                        <!-- Prediction horizontal distance -->
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item prop="prediction_horizontal_distance" label="Prediction horizontal distance">
                                                    <el-input
                                                        type="number"
                                                        cid="doc-setup-form-prediction-horizontal-distance"
                                                        v-model="form.prediction_horizontal_distance"
                                                        :step="0.1"
                                                    >
                                                    </el-input>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="40">
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item prop="extraction_threshold_enabled" label="Enable extraction threshold">
                                                    <el-checkbox cid="doc-setup-form-enable-autopublish" v-model="extraction_threshold_enabled"></el-checkbox>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                        <el-col :span="12">
                                            <div v-if="extraction_threshold_enabled" class="kp-form-group select-box-container">
                                                <el-form-item class="control-label col-sm-2" prop="extraction_threshold" label="Enter threshold">
                                                   <el-input cid="doc-setup-form-document_restoration-input" type="number" v-model="form.extraction_threshold"></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <!-- Email extraction enable option -->
                                    <el-row :gutter="40">
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item prop="extraction_threshold_enabled" label="Enable email extraction">
                                                    <el-checkbox
                                                        cid="doc-setup-form-enable-email-extraction"
                                                        v-model="form.enable_email_extraction"
                                                        @change="form.email_extraction_prompt_name = ''"
                                                    >
                                                    </el-checkbox>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item prop="ignore_remit_address">
                                                    <span slot="label">
                                                        Ignore remit address
                                                        <el-tooltip effect="light" content="Toggling this feature will ignore vendor name from the remit address">
                                                            <i class="el-icon-question"></i>
                                                        </el-tooltip>
                                                    </span>
                                                        
                                                        <el-checkbox
                                                            cid="doc-setup-form-ignore-remit-address"
                                                            v-model="form.ignore_remit_address"
                                                        >
                                                        </el-checkbox>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                        <el-col :span="12">
                                            <div v-if="form.enable_email_extraction" class="kp-form-group select-box-container">
                                                <el-form-item class="control-label col-sm-2" prop="extraction_threshold" label="Select prompt">
                                                    <el-select
                                                        cid="doc-setup-form-email-extraction-prompt"
                                                        class="select-box"
                                                        size="large"
                                                        name="prompts"
                                                        collapse-tags
                                                        v-model="form.email_extraction_prompt_name"
                                                        placeholder="Please select prompt"
                                                    >
                                                        <el-option
                                                            v-for="(prompt, index) in promptList"
                                                            :key="prompt.name"
                                                            :label="prompt.label"
                                                            :cid="'prompt_' + index"
                                                            :value="prompt.name"
                                                        ></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                    </el-row>

                                    <el-row :gutter="40">
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                            <el-form-item prop="ignore_vision_address" label="Ignore vision address">
                                                    <el-checkbox
                                                        cid="doc-setup-form-ignore-vision-address"
                                                        v-model="form.ignore_vision_address"
                                                    >
                                                    </el-checkbox>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item prop="process_document_sequentially_after_extraction" label="Process Document Sequentially After Extraction?">
                                                    <el-checkbox
                                                        cid="doc-setup-form-process-document-sequentially-after-extraction"
                                                        v-model="form.process_document_sequentially_after_extraction"
                                                    >
                                                    </el-checkbox>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item prop="use_header_ner" label="Use header NER">
                                                    <el-checkbox
                                                        cid="doc-setup-form-use-header-ner"
                                                        v-model="form.use_header_ner"
                                                    >
                                                    </el-checkbox>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                    </el-row>

                                    <!-- Secondary OCR Vendors -->
                                    <el-divider content-position="left">Secondary OCR Vendors</el-divider>
                                    <el-row v-for="(vendorArray, vendorName, index) in clonedSecondaryOcrVendors" :key="secondaryOCRState" :gutter="40" class="secondary-ocr-vendors">

                                        <!-- Vendor name -->
                                        <el-col :span="8">
                                            <div class="kp-form-group" style="margin-right: 48px">
                                                <el-form-item label="Name" label-width="60px">
                                                    <div class="el-input">
                                                        <input class="el-input__inner" :value="vendorName" placeholder="Enter vendor name here." @change="handleOCRVendorNameInput(index, $event)">
                                                        </input>
                                                    </div>
                                                </el-form-item>
                                            </div>
                                        </el-col>

                                        <!-- Vendor name alias -->
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item label="Alias" label-width="60px">
                                                    <el-tag
                                                        v-for="(vendorAlias, aliasIndex) in vendorArray"
                                                        :key="vendorAlias"
                                                        closable
                                                        :disable-transitions="true"
                                                        @close="handleCloseVendorAlias(vendorArray, aliasIndex)">
                                                        {{vendorAlias}}
                                                    </el-tag>
                                                    <el-input
                                                        class="vendor-name-input-new-tag"
                                                        v-if="activeOCRVendor === vendorName && showVendorAliasInputBox"
                                                        v-model="vendorAliasInputValue"
                                                        ref="vendorAliasInputRef"
                                                        @keyup.enter.native="handleVendorAliasInputConfirm(vendorArray)"
                                                        @blur="handleVendorAliasInputConfirm(vendorArray)"
                                                    >
                                                    </el-input>
                                                    <el-button v-else class="vendor-name-button-new-tag" size="small" @click="showVendorAliasInput(vendorName)">+ New Alias</el-button>
                                                </el-form-item>
                                            </div>
                                        </el-col>

                                        <!-- Add or delete button -->
                                        <el-col :span="2">
                                            <div class="add-chekbox-container del-add-btn">
                                                <el-button class="add-remove" :disabled="Object.keys(clonedSecondaryOcrVendors).length === 1" @click="removeSecondaryOCRVendor(vendorName)">
                                                    <span class="mdi mdi-delete"></span>
                                                </el-button>

                                                <el-button class="add-btn" type="primary" @click="addSecondaryOCRVendor">
                                                    <span class="mdi mdi-plus"></span>
                                                </el-button>
                                            </div>
                                        </el-col>

                                    </el-row>
                                </div>
                                </el-tab-pane>

                                <el-tab-pane label="Publish settings" name="publish_setting">
                                    <div class="tab-body">
                                        <el-divider content-position="left">General configuration</el-divider>
                                        <el-row :gutter="40">
                                            <el-col :span="12">
                                                <div class="kp-form-group">
                                                    <el-form-item  prop="publish_to" label="Publish channel">
                                                        <el-select cid="doc-setup-form-publish-channel-select" name="publish_to" clearable filterable v-model="form.publish_to" v-on:change="onPublishToChange" placeholder="Select">
                                                            <el-option v-for="(value,index) in publish_to_list" :cid="'doc-setup-form-publish-channel_'+index" :key="value.value" :value="value.value" :label="value.label"></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </div>
                                            </el-col>
                                            <el-col :span="12" v-if="form.publish_to != 'system'">
                                                <div class="kp-form-group">
                                                    <el-form-item prop="customer_publish_storage_id" label='Publish storage'>
                                                        <el-select cid="doc-setup-form-publish-storage-select" name="Customer storage" clearable filterable v-model="form.customer_publish_storage_id" placeholder="Select customer storage">
                                                            <el-option v-for="(item,index) in customer_publish_storages" :cid="'doc-setup-form-publish-storage_'+index" :key="item._id" :label="item.name" v-bind:value="item._id"></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </div>
                                            </el-col>
                                        </el-row>
                                        <el-row :gutter="40">
                                            <div v-if="form.publish_to == 'email'">
                                                <el-col :span="12">
                                                    <div class="kp-form-group">
                                                        <el-form-item prop="publish_to_email_config.email_publish_to_format" label="Output file format">
                                                            <el-select cid="doc-setup-form-Output-file-format-select" name="email_publish_to_format" v-model="form.publish_to_email_config.email_publish_to_format" placeholder="Select output file format from dropdown..." filterable clearable>
                                                                <el-option v-for="(value, index) in exportScriptTypes" :cid="'doc-setup-form-Output-file-format_' + index" :key="value.value" :value="value.value" :label="value.label"></el-option>
                                                            </el-select>
                                                        </el-form-item>
                                                    </div>
                                                </el-col>

                                                <el-col :span="12">
                                                    <div class="kp-form-group">
                                                        <el-form-item prop="publish_to_email_config.email_publish_to_recipient" label="Email ids">
                                                            <el-input cid="doc-setup-form-email-publish-to-format" name="email_publish_to_recipient" v-model="form.publish_to_email_config.email_publish_to_recipient" type="text" :rows="2" placeholder="ex.xy@gm.com, xz@gm.com"></el-input>
                                                        </el-form-item>
                                                    </div>
                                                </el-col>
                                            </div>
                                        </el-row>
                                        <el-row :gutter="40">
                                            <div v-if="form.publish_to == 'email'">
                                                <el-col :span="12">
                                                    <div class="kp-form-group">
                                                        <el-form-item prop="publish_to_email_config.email_publish_to_template" label="Email template">
                                                            <el-select cid="doc-setup-form-email-publish-to-template-select" name="email_publish_to_template" v-model="form.publish_to_email_config.email_publish_to_template" placeholder="Select Email template from dropdown..." filterable clearable>
                                                                <el-option v-for="(value, index) in emailTemplateNames" :cid="'doc-setup-form-email-publish-to-template_' + index" :key="value.name" :value="value.name" :label="value.name"></el-option>
                                                            </el-select>
                                                        </el-form-item>
                                                    </div>
                                                </el-col>

                                                <el-col :span="6">
                                                    <div class="kp-form-group">
                                                        <el-form-item label='Eml file'>
                                                            <el-checkbox cid="doc-setup-form-attach-original-email" v-model="form.publish_to_email_config.attach_original_email"></el-checkbox>
                                                        </el-form-item>
                                                    </div>
                                                </el-col>

                                                <el-col :span="6">
                                                    <div class="kp-form-group">
                                                        <el-form-item v-show="form.publish_to_email_config.attach_original_email" prop="include_email_attachment" label='Include email attachment'>
                                                            <el-checkbox cid="doc-setup-form-include-email-attachment" v-model="form.publish_to_email_config.include_email_attachment"></el-checkbox>
                                                        </el-form-item>
                                                    </div>
                                                </el-col>
                                            </div>
                                        </el-row>
                                        <el-row :gutter="40">
                                            <el-col :span="12">
                                                <div class="kp-form-group" >
                                                    <el-form-item prop="workflow" label='Workflow'>
                                                        <el-select name="workflow" cid="doc-setup-form-workflow-select" clearable filterable v-model="form.workflow_id" placeholder="Select workflow">
                                                            <el-option v-for="(item, index) in workflow_list" :cid="'doc-setup-form-workflow_' + index" :key="item._id" :label="item.name" v-bind:value="item._id"></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </div>
                                            </el-col>
                                        </el-row>
                                         <el-row :gutter="40" v-if="form.publish_to == 'system'">
                                            <el-col :span="12" >
                                                <div class="kp-form-group" >
                                                        <el-form-item  prop="system" label="System">
                                                            <el-select name="system" cid="doc-setup-form-system-select" clearable filterable v-model="form.customer_system_id" placeholder="Select system" v-on:change="onSystemChange">
                                                                <el-option v-for="(system,index) in system_list" :cid="'doc-setup-form-system_'+index" :key="system.customer_system_id" :label="system.system_name" v-bind:value="system.customer_system_id"></el-option>
                                                            </el-select>
                                                        </el-form-item>
                                                </div>
                                            </el-col>
                                        </el-row>
                                        <el-row :gutter="40">
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                 <el-form-item prop="storage_type" label='Attachment Type'>
                                                            <el-select cid="doc-setup-form-attach-type-select" name="workflow" clearable filterable v-model="form.storage_type"  v-on:change="onUploadStorageSelect" placeholder="Select storage">
                                                                <el-option v-for="(item,index) in upload_storage_list" :cid="'doc-setup-form-attach-type_'+index" :key="item.value" :label="item.label" v-bind:value="item.value"></el-option>
                                                            </el-select>
                                                        </el-form-item>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="40">
                                                <el-col :span="12">
                                        <!-- <el-col :span="12" v-if="form.storage_type ==='customer_storage'"> -->
                                            <div class="kp-form-group" v-if="isStorageVisible">
                                                 <el-form-item prop="customer_storage_id" label='Attachment storage'>
                                                            <el-select cid="doc-setup-form-storage-select" name="Customer storage" clearable filterable v-model="form.customer_storage_id" placeholder="Select customer storage">
                                                                <el-option v-for="(item,index) in customer_storages" :cid="'doc-setup-form-storage_'+index" :key="item._id" :label="item.name" v-bind:value="item._id"></el-option>
                                                            </el-select>
                                                        </el-form-item>
                                            </div>
                                        </el-col>
                                        </el-row>
                                     <el-row :gutter="40" v-if="form.publish_to == 'system'">
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                 <el-form-item prop="allow_duplicate_attachment" label='Allow duplicate attachment'>
                                                        <el-checkbox cid="doc-setup-form-allow-duplicate-attach" v-model="form.allow_duplicate_attachment"></el-checkbox>

                                                        </el-form-item>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <!-- </el-row> -->
                                    <el-row :gutter="40" v-if="form.publish_to == 'system'">
                                            <el-col :span="12">
                                                <div class="kp-form-group">
                                                    <el-form-item prop="allow_attachments" label='Allow attachment'>
                                                        <el-checkbox cid="doc-setup-form-allow-duplicate-attach" v-model="form.allow_attachments"></el-checkbox>
                                                    </el-form-item>
                                                </div>
                                            </el-col>
                                    </el-row>

                                    </div>

                                </el-tab-pane>

                                <el-tab-pane label="Notifications" name="notifications">
                                    <div class="tab-body">
                                        <el-row :gutter="40">
                                            <el-col :span="12">
                                                <div class="kp-form-group">
                                                    <el-form-item  prop="enable_assignment_notification" label="Enable assignment notification">
                                                        <el-checkbox cid="doc-setup-form-enable-assignment-notification" v-model="form.email_notifications.enable_assignment_notification" @change="handleEnableAssignmentNotificationChange"></el-checkbox>
                                                    </el-form-item>
                                                </div>
                                            </el-col>
                                            <el-col :span="12">
                                                <div
                                                    v-if="form.email_notifications.enable_assignment_notification"
                                                    class="kp-form-group select-box-container"
                                                >
                                                    <el-form-item prop="emailTemplateNames" label="Email Template">
                                                        <el-select
                                                        name="emailTemplateNames"
                                                        clearable
                                                        filterable
                                                        cid="doc-setup-form-assignment_email_template_id-select"
                                                        v-model="form.email_notifications.assignment_email_template_id"
                                                        placeholder="Select"
                                                        @clear="handleClearEmailTemplate"
                                                        >
                                                        <el-option
                                                            v-for="(value,index) in emailTemplateNames"
                                                            :cid="'doc-setup-form-assignment_email_template_id'+index"
                                                            :key="value._id"
                                                            :value="value._id"
                                                            :label="value.name"
                                                        ></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </div>
                                            </el-col>
                                        </el-row>
                                        <el-row :gutter="40">
                                            <el-col :span="12">
                                                <div class="kp-form-group">
                                                    <el-form-item  prop="ap_team_mail" label="Email for AP Team Notifications">
                                                        <el-input cid="doc-setup-form-ap_team_mail" name="ap_team_mail"  v-model="form.email_notifications.ap_team_mail" type="textarea" :rows=2 placeholder="user@kanverse.com"></el-input>
                                                    </el-form-item>
                                                </div>
                                            </el-col>
                                        </el-row>
                                        <el-row :gutter="40">
                                            <el-col :span="18">
                                                <div class="kp-form-group">
                                                        <el-form-item  label="Reviewer emails">
                                                            <el-input cid="doc-setup-form-reviewer-email" name="reviewer"  v-model="form.email_notifications.reviewer" type="textarea" :rows=2 placeholder="admin@kanverse.com, user@kanverse.com"></el-input>
                                                        </el-form-item>
                                                </div>
                                            </el-col>

                                            <el-col :span="18">
                                                <div class="kp-form-group">
                                                        <el-form-item  label="Approver emails">
                                                            <el-input cid="doc-setup-form-approver-emails" name="approver" v-model="form.email_notifications.approver" type="textarea" :rows=2 placeholder="admin@kanverse.com, user@kanverse.com"></el-input>
                                                        </el-form-item>
                                                </div>
                                           </el-col>
                                        </el-row>

                                         <el-row :gutter="40">
                                            <el-col :span="18">
                                                <div class="kp-form-group">
                                                        <el-form-item  label="Publisher emails">
                                                            <el-input cid="doc-setup-form-publisher-emails" name="publisher" v-model="form.email_notifications.publisher" type="textarea" :rows=2 placeholder="admin@kanverse.com, user@kanverse.com"></el-input>
                                                        </el-form-item>
                                                </div>
                                            </el-col>
                                        </el-row>

                                    </div>

                                </el-tab-pane>
                                 <el-tab-pane label="Data retention" name="data_retention">
                                    <div class="tab-body">
                                          <el-row :gutter="40">
                                            <el-col :span="12">
                                               <div class="kp-form-group">
                                                <el-form-item prop="Remove Document" label="Remove Document">
                                                    <!-- <el-radio v-model="form.remove_document_post_polling"></el-radio> -->
                                                <el-checkbox-group cid="doc-setup-form-remove-document-checkbox" v-model="select_remove_after">
                                                            <el-checkbox cid="doc-setup-form-remove-document_0" label="remove_document_post_polling">After polling</el-checkbox>
                                                            <el-checkbox cid="doc-setup-form-remove-document_1" label="remove_document_post_publish">After publish</el-checkbox>
                                                </el-checkbox-group>
                                                </el-form-item>
                                            </div>
                                            </el-col>
                                        </el-row>
                                        <el-row :gutter="40">
                                        <el-col :span="6">
                                            <div class="kp-form-group">
                                                <el-form-item  prop="document_restoration" label="Document Restoration">
                                                    <el-checkbox cid="doc-setup-form-document-restoration-checkbox" v-model="form.data_retention_policies.document_restoration" @change="hideShowDocumentRestorationInput($event)"></el-checkbox>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                        <el-col :span="6" v-if="form.data_retention_policies.document_restoration">
                                                <div class="kp-form-group" >
                                                    <el-form-item prop="max_document_restoration_days" label="Max document restoration for (n) days">
                                                        <el-input cid="doc-setup-form-document_restoration-input" type="number" name="documentRetaintion" v-model="form.data_retention_policies.max_document_restoration_days"></el-input>
                                                    </el-form-item>
                                                </div>
                                            </el-col>
                                    </el-row>
                                        <el-row :gutter="40">
                                            <el-col :span="6">
                                                <div class="kp-form-group" >
                                                    <el-form-item prop="messages_retain_for_days" label="Messages Retained">
                                                        <el-input cid="doc-setup-form-messages-retains-input" type="number" name="messageRetention" v-model="form.data_retention_policies.messages_retain_for_days"></el-input>
                                                    </el-form-item>
                                                </div>
                                            </el-col>
                                        </el-row>
                                        <el-row :gutter="40">
                                            <el-col :span="24">
                                                <div class="kp-form-group" >
                                                    <el-divider content-position="left">Delete fields after publish</el-divider>
                                                    <DualListBox
                                                    :source="fieldsToBeRemoved.source"
                                                    :destination="fieldsToBeRemoved.destination"
                                                    label="label"
                                                    @onChangeList="(changedData) => {onFieldToBeRemovedChange(changedData)}"
                                                    />
                                                </div>
                                            </el-col>
                                        </el-row>
                                    </div>

                                </el-tab-pane>
                                <!-- Fraud detection tab -->
                                 <el-tab-pane label="Fraud detection" name="fraud_detection" class="fraud-detection-wrap">
                                    <div class="tab-body">
                                        <el-row :gutter="40" v-for="(field,index) in fraudDetectionConfig" v-bind:key="'fraud_detection_key_'+index">
                                                <el-col :span="24">
                                                    <div class="kp-form-group">
                                                        <el-row>

                                                            <el-col :span="20">
                                                                <!-- <el-form-item  prop="fraud_detection"> -->
                                                                    <div  class="fraud_detection_label">
                                                                        {{field.label}}
                                                                        <el-tooltip
                                                                            :content="field.description"
                                                                            placement="top"
                                                                            effect="light"
                                                                        >
                                                                            <span class="material-icons icon-error-radio">error</span>
                                                                        </el-tooltip>
                                                                    </div>
                                                                    <el-switch type cid="doc-setup-form-enable-approval" v-model="form.fraud_detection[field.key]['enable']" :value="field.default"></el-switch>
                                                                <!-- </el-form-item> -->
                                                            </el-col>

                                                        </el-row>
                                                        <el-row :gutter="40" style="margin-top:20px" v-if="field.key == 'just_below_approval_limit' && form.fraud_detection['just_below_approval_limit']['enable']">
                                                            <el-col :span="20">
                                                                <el-form-item label="Approval amount">
                                                                    <el-input placeholder="10000" type="number" v-model="form.fraud_detection.just_below_approval_limit.approval_limit"></el-input>
                                                                </el-form-item>
                                                            </el-col>
                                                        </el-row>
                                                        <el-row :gutter="40" style="margin-top:20px" v-if="field.key == 'spike_in_volume' && form.fraud_detection['spike_in_volume']['enable']">
                                                            <el-col :span="20">
                                                                <el-form-item label="Volume threshold in %">
                                                                    <el-input placeholder="200" type="number" v-model="form.fraud_detection.spike_in_volume.volume_threshold"></el-input>
                                                                </el-form-item>
                                                            </el-col>
                                                        </el-row>

                                                        <el-row>
                                                            <span class="fraud_detection_msg" v-if="field.key == 'phantom_vendor' && form.fraud_detection['phantom_vendor']['enable']">
                                                                *Make sure "Fraud detection - Phantom vendor" business rule is active and mapped.
                                                            </span>
                                                        </el-row>
                                                    </div>
                                                </el-col>
                                        </el-row>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane label="Business rule" name="business_rule">
                                    <div class="tab-body">
                                        <!-- <section class="form-page-container" > -->
                                            <!-- <h3 class="br-list-page-title" >
                                                <span >
                                                    Business rule
                                                </span>
                                            </h3> -->
                                            <div data-v-step="2" class="table-wrap" v-if="showDatatable">
                                                <data-table :parameters="tableParams" ref="datatable"></data-table>
                                            </div>
                                        <!-- </section> -->
                                    </div>
                                </el-tab-pane>
                                 <el-tab-pane  label="List view config" name="list_view_table_configuration">
                                    <el-divider content-position="left">General</el-divider>
                                    <div>
                                        <el-row :gutter="40">
                                            <el-col :span="12">
                                                <div class="kp-form-group">
                                                    <el-form-item prop="visible_stage_count" label="Visible Table Tabs">
                                                        <el-input v-model="form.list_view_config.visible_stage_count" cid="kp-form-stage-count" placeholder="Provide Visible Tab Count"></el-input>
                                                    </el-form-item>
                                                </div>
                                            </el-col>
                                        </el-row>
                                    </div>
                                    <el-divider content-position="left">Dynamic Tab Config</el-divider>
                                    <div class="accordian-bar accordian-bar-div">
                                        <div class="panel-body">
                                        <section>
                                            <div class="table-wrap">
                                                <DualListBox
                                                    :source="dynamicTabsSlushBucketData.source"
                                                    :destination="dynamicTabsSlushBucketData.destination"
                                                    label="label"
                                                    @onChangeList="(changedData) => {onDynamicTabsListChange(changedData)}"
                                                />
                                            </div>
                                        </section>
                                        </div>
                                    </div>
                                    <div class="tab-body">
                                        <div data-v-step="2" class="table-wrap" >
                                            <data-table :parameters="listViewTableParams" ref="listViewDatatable"></data-table>
                                        </div>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane  label="Form view config" name="form_view_configuration">
                                    <el-divider content-position="left">Line Item</el-divider>
                                    <div>
                                        <el-row :gutter="40">
                                            <el-col :span="12">
                                                <div class="kp-form-group">
                                                    <el-form-item prop="enable_pagination_on" label="Enable pagination on (n) lines">
                                                        <el-input v-model.number="form.form_view_config.enable_pagination_on"  placeholder="Provide enable pagination on (n) lines"></el-input>
                                                    </el-form-item>
                                                </div>
                                                <div class="kp-form-group">
                                                    <el-form-item prop="page_size" label="Records per page">
                                                        <el-select v-model.number="form.form_view_config.page_size" placeholder="Provide records per page">
                                                            <el-option
                                                                v-for=" (size, index) in  [5, 10, 20, 50, 100]"
                                                                :key="size"
                                                                :cid="'page_size_'+ index"
                                                                :label="size"
                                                                :value="size"
                                                            ></el-option>
                                                        </el-select>
                                                        <!-- <el-input v-model="form.form_view_config.page_size" placeholder="Provide records per page"></el-input> -->
                                                    </el-form-item>
                                                </div>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane v-if="displayPackageCreationTab" label="Package creation" name="package_creation">
                                    <div class="tab-body">
                                        <el-col :span="12">
                                            <el-form-item label="Package name">
                                                <el-input v-model="form.package_config.name"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <DualListBox label="name" :source="slushBucketData.source" :destination="slushBucketData.destination" @onChangeList="(changedData) => {onChangeList(changedData);}"/>
                                    </div>
                                </el-tab-pane>
                                <!-- Table type config -->
                                <el-tab-pane label="Table type config" name="table_type_config">
                                    <div class="table-type-config-table-title">
                                        <span class="section-title">Table Type config</span>
                                        <el-button class="add-btn"
                                            type="primary"
                                            @click="addTableTypeConfig(option)"
                                            size="small"
                                            >
                                            Add Multi Table Config<span class="mdi mdi-plus"></span>
                                        </el-button>
                                    </div>
                                    <el-table :data="form.table_types_config" style="width: 100%">
                                        <!-- Column for Row Index -->
                                        <el-table-column label="Row #" width="80">
                                            <template slot-scope="scope">
                                                <span>{{ scope.$index + 1 }}</span>
                                            </template>
                                        </el-table-column>

                                        <!-- Column for Table Title -->
                                        <el-table-column label="Table Title" width="200">
                                            <template slot-scope="scope">
                                                <el-input
                                                    v-model="scope.row.label"
                                                    placeholder="Label">
                                                </el-input>
                                            </template>
                                        </el-table-column>

                                        <!-- Column for Table Key -->
                                        <el-table-column label="Table Key" width="200">
                                            <template slot-scope="scope">
                                                <el-input
                                                    v-model="scope.row.key"
                                                    placeholder="Key">
                                                </el-input>
                                            </template>
                                        </el-table-column>

                                        <!-- Column for Document Subtype -->
                                        <el-table-column label="Doc Subtype" width="200">
                                            <template slot-scope="scope">
                                                <el-select 
                                                    v-model="scope.row.document_subtype" 
                                                    clearable 
                                                    filterable 
                                                    placeholder="Select Document SubType..."
                                                >
                                                    <el-option
                                                        v-for="(subType, subTypeIndex) in form.document_subtype_list"
                                                        :label="subType"
                                                        :value="subType" 
                                                        :key="subTypeIndex">
                                                    </el-option>
                                                </el-select>
                                            </template>
                                        </el-table-column>

                                        <!-- Column for Select Fields -->
                                        <el-table-column label="Select Fields" width="300">
                                            <template slot-scope="scope">
                                                <el-select 
                                                    v-model="scope.row.selected_fields" 
                                                    multiple 
                                                    collapse-tags 
                                                    placeholder="Select Fields For Table..." 
                                                    filterable
                                                >
                                                    <el-option 
                                                        v-for="(field, index) in getFilteredFieldsData(scope.$index, scope.row.document_subtype)" 
                                                        :key="index"
                                                        :label="field.label"
                                                        :value="field._id">
                                                    </el-option>
                                                </el-select>
                                            </template>
                                        </el-table-column>

                                        <!-- Action Column for Delete Button -->
                                        <el-table-column label="Actions" width="100" fixed="right">
                                            <template slot-scope="scope">
                                                <el-button
                                                    type="text"
                                                    @click="removeTableTypeConfig(scope.$index)"
                                                >
                                                    <i class="mdi mdi-delete"></i>
                                                </el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>


                                </el-tab-pane>
                                <!-- Table type config endsss here -->

                                <el-tab-pane label="Excel settings" name="excel_config">
                                    <el-divider content-position="left">General</el-divider>
                                    <el-row :gutter="40">
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item  prop="realtime_validation" label="Enable Excel" label-width="200px">
                                                    <el-checkbox v-model="form.excel_config.active"></el-checkbox>
                                                </el-form-item>

                                                <el-form-item  prop="realtime_validation" label="Realtime Validation" label-width="200px">
                                                    <el-checkbox v-model="form.excel_config.realtime_validation"></el-checkbox>
                                                </el-form-item>

                                                <el-form-item  prop="publish_all" label="Publish All" label-width="200px" v-if="!form.excel_config.is_excel_form_type">
                                                    <el-checkbox v-model="form.excel_config.publish_all"></el-checkbox>
                                                </el-form-item>

                                                <el-form-item  prop="check_mandatory_fields" label="Check Mandatory Fields" label-width="200px" v-if="!form.excel_config.is_excel_form_type">
                                                    <el-checkbox v-model="form.excel_config.check_mandatory_fields"></el-checkbox>
                                                </el-form-item>

                                                <el-form-item  prop="enable_cancel_extraction" label="Enable Cancel Extraction" label-width="200px" v-if="!form.excel_config.is_excel_form_type">
                                                    <el-checkbox v-model="form.excel_config.enable_cancel_extraction" :disabled = "form.excel_config.is_excel_form_type"></el-checkbox>
                                                </el-form-item>

                                                <el-form-item  prop="publish_batch_size"
                                                    label="Publish Batch Size" label-width="200px" v-if="!form.excel_config.is_excel_form_type">
                                                    <el-input-number cid="publish_batch_size" name="approver" :controls=false v-model="form.excel_config.publish_batch_size" :disabled = "form.excel_config.is_excel_form_type"></el-input-number>
                                                </el-form-item>

                                                <el-form-item  prop="notification_email_recipients" label="Notification Email Recipients" label-width="200px" style="margin-bottom: 5px">
                                                    <el-input name="Notification Email Recipients" placeholder="Please Enter Notification Email Recipients" v-model="form.excel_config.notification_email_recipients" cid="notification_email_recipients" ></el-input>
                                                </el-form-item>

                                                <el-form-item prop="group_creation_fields" label-width="200px" v-if="form.excel_config.is_excel_form_type">
                                                    <template slot="label">
                                                        <span>Group Creation Fields</span>
                                                    </template>
                                                    <div class="select-container">
                                                        <el-select v-model="selectedSubtype" @change="onGroupFieldChange" placeholder="Select Document Type" style="width: 180px;">
                                                            <el-option v-for="(value, index) in page_type_mapping" :key="index" :label="value" :value="value">
                                                            </el-option>
                                                        </el-select>
                                                        <el-select v-model="selectedGroupedFields" name="Fields" placeholder="Select Fields" style="width: 180px;" multiple filterable class="read-only-fields-label" v-if="hasGroupCreationFields">
                                                            <el-option v-for="(item) in tableFields" :key="item.field_id" :label="item.label" :value="item.field_name"></el-option>
                                                        </el-select>
                                                    </div>
                                                </el-form-item>

                                                <el-form-item  prop="rows_limit"
                                                    label="Extraction Rows limit" label-width="200px" v-if="form.excel_config.is_excel_form_type">
                                                    <el-input-number cid="rows_limit" :controls=false v-model="form.excel_config.rows_limit" ></el-input-number>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                        <el-col :span="12">
                                        <div class="kp-form-group">
                                            <el-form-item  prop="is_excel_form_type" label="Excel Form" label-width="200px">
                                                    <el-checkbox v-model="form.excel_config.is_excel_form_type" @change="onChangeIsExcelFormType"></el-checkbox>
                                            </el-form-item>

                                            <el-form-item  prop="auto_publish_enabled" label="Autopublish Enabled" label-width="200px">
                                                <el-checkbox v-model="form.excel_config.auto_publish_enabled"></el-checkbox>
                                            </el-form-item>

                                            <el-form-item  prop="enable_fraud_detection" label="Enable fraud detection" label-width="200px" v-if="!form.excel_config.is_excel_form_type">
                                                <el-checkbox v-model="form.excel_config.enable_fraud_detection"></el-checkbox>
                                            </el-form-item>

                                            <el-form-item  prop="enable_validation" label="Enable Validate" label-width="200px" v-if="!form.excel_config.is_excel_form_type">
                                                <el-checkbox v-model="form.excel_config.enable_validation"></el-checkbox>
                                            </el-form-item>

                                            <el-form-item  prop="enable_cancel_publish" label="Enable Cancel Publish" label-width="200px" v-if="!form.excel_config.is_excel_form_type">
                                                <el-checkbox v-model="form.excel_config.enable_cancel_publish" :disabled = "form.excel_config.is_excel_form_type"></el-checkbox>
                                            </el-form-item>

                                            <el-form-item v-if="!form.excel_config.is_excel_form_type" prop="post_extraction_batch_size"
                                                label="Post Extraction Batch Size" label-width="200px">
                                                <el-input-number cid="post_extraction_batch_size" name="approver" :controls=false v-model="form.excel_config.post_extraction_batch_size"></el-input-number>
                                            </el-form-item>

                                            <el-form-item  prop="valid_row_column_threshold" label="Valid Row Column Threshold" label-width="200px" v-if="form.excel_config.is_excel_form_type">
                                                <el-input-number cid="valid_row_column_threshold" name="valid_row_column_threshold" :controls=false v-model="form.excel_config.valid_row_column_threshold"></el-input-number>
                                            </el-form-item>

                                            <el-form-item  prop="allow_cell_edit_after_publish" label="Allow Cell Edit After Publish" label-width="200px" v-if="form.excel_config.is_excel_form_type">
                                                    <el-checkbox v-model="form.excel_config.allow_cell_edit_after_publish"></el-checkbox>
                                            </el-form-item>
                                            <el-form-item  prop="read_only_fields" label="Read only Fields" label-width="200px" v-if="!form.excel_config.is_excel_form_type">
                                                <el-select v-model="form.excel_config.read_only_fields" name="Fields" placeholder="Select read only fields" multiple filterable class="read-only-fields-label">
                                                    <el-option v-for="(item) in de_fields" :key="item.field_id" :label="item.label" :value="item.field_name"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>
                                        </el-col>
                                    </el-row>

                                    <el-divider content-position="left">Classification</el-divider>
                                    <el-row :gutter="40">
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item prop="excel_classification_model_id" label="Select Classification Model" label-width="200px" style="margin-bottom: 5px">
                                                    <el-select name="excel_classification_model_id" cid="setup-form-excel-classification-model-select" v-model="form.excel_config.excel_classification_model_id" placeholder="Select Classification Model type" >
                                                        <el-option v-for="(model, index) in classification_model_options" :cid="'doc-setup-form-domain-excel-classification-model_' + index" :key="model._id" :label="model.model_name" :value="model._id"></el-option>
                                                    </el-select>
                                                </el-form-item>

                                                <el-form-item prop="ocr_dimension" label="OCR Dimensions" label-width="200px" v-if="form.excel_config.is_excel_form_type">
                                                    <el-input name="ocr_dimension" cid="ocr_dimension" placeholder="Enter Dimensions" :controls=false v-model="form.excel_config.ocr_dimension"/>
                                                </el-form-item>

                                                <el-form-item  prop="classification_rows_limit" label="Classification Rows Limit" label-width="200px" v-if="form.excel_config.is_excel_form_type">
                                                    <el-input-number cid="classification_rows_limit" name="classification_rows_limit" :controls=false v-model="form.excel_config.classification_rows_limit"></el-input-number>
                                                </el-form-item>

                                                <el-form-item  prop="classification_threshold" label="Classification Threshold" label-width="200px" v-if="form.excel_config.is_excel_form_type">
                                                    <el-input-number cid="classification_threshold" name="classification_threshold" :controls=false v-model="form.excel_config.classification_threshold"></el-input-number>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                    <el-form-item prop="rename_target_sheet_as" label-width="200px" v-if="form.excel_config.is_excel_form_type">
                                                        <template slot="label" class="change-sheet-name-label">
                                                            <span>Change Sheet Name</span>
                                                                    <el-tooltip
                                                                        content="Rename the sheet title to include classification, for instance, if the original name was 'Kanverse' and you changed it to 'invoice', the new name would be 'Kanverse(invoice)."
                                                                        placement="top"
                                                                        effect="light"
                                                                    >
                                                                        <span class="mdi mdi-information-outline info-icon"></span>
                                                                    </el-tooltip>
                                                        </template>
                                                        <el-input name="rename_target_sheet_as" placeholder="Change Sheet Name" v-model="form.excel_config.rename_target_sheet_as" cid="rename_target_sheet"></el-input>
                                                    </el-form-item>
                                                    <el-form-item  prop="classification_batch_size" label="Classification Batch Size" label-width="200px" v-if="form.excel_config.is_excel_form_type">
                                                        <el-input-number cid="classification_batch_size" name="classification_batch_size" :controls=false v-model="form.excel_config.classification_batch_size"></el-input-number>
                                                    </el-form-item>
                                                    <el-form-item  prop="prediction_threshold" label="Prediction Threshold" label-width="200px" v-if="form.excel_config.is_excel_form_type">
                                                        <el-input-number cid="prediction_threshold" name="prediction_threshold" :controls=false v-model="form.excel_config.prediction_threshold"></el-input-number>
                                                    </el-form-item>

                                            </div>
                                        </el-col>
                                    </el-row>
                                    <el-divider content-position="left" v-if="form.excel_config.is_excel_form_type">Formatting</el-divider>
                                    <el-row :gutter="40">
                                       <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item  prop="headers_bg_color" label="Table Header Background Color" label-width="200px" v-if="form.excel_config.is_excel_form_type">
                                                    <el-input name="headers_bg_color" placeholder="Table Header Background Color" :controls=false v-model="form.excel_config.formatting.headers_bg_color" cid="doc-setup-form-headers-bg-color" ></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-col>

                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item prop="remove_data_verification" label="Remove Data Verification" label-width="200px" v-if="form.excel_config.is_excel_form_type">
                                                    <el-checkbox v-model="form.excel_config.formatting.remove_data_verification"></el-checkbox>
                                                </el-form-item>
                                            </div>
                                       </el-col>
                                    </el-row>

                                    <el-row :gutter="40">
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item  prop="bg_color" label="Background Color" label-width="200px" v-if="form.excel_config.is_excel_form_type">
                                                    <el-input name="bg_color" placeholder="Background Color" :controls=false v-model="form.excel_config.formatting.bg_color" cid="doc-setup-form-bg-color" ></el-input>
                                                </el-form-item>
                                            </div>
                                       </el-col>

                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item  prop="remove_borders" label="Remove Borders" label-width="200px" v-if="form.excel_config.is_excel_form_type">
                                                    <el-checkbox v-model="form.excel_config.formatting.remove_borders"></el-checkbox>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                    </el-row>

                                    <el-row :gutter="40">
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item prop="font_face" label="Font Face" label-width="200px" v-if="form.excel_config.is_excel_form_type">
                                                    <el-select name="font_face" cid="doc-setup-form-font-face" v-model="form.excel_config.formatting.font_face" placeholder="Select Font Family" >
                                                        <el-option v-for="(option,index) in supportedFontFamilies" :cid="'doc-setup-form-font-face_'+index" :key="option" :label="option" :value="option"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </div>
                                       </el-col>

                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item prop="bold" label="Bold" label-width="200px" v-if="form.excel_config.is_excel_form_type">
                                                    <el-checkbox v-model="form.excel_config.formatting.bold"></el-checkbox>
                                                </el-form-item>
                                            </div>
                                       </el-col>
                                    </el-row>

                                    <el-row :gutter="40">
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item prop="font_size" label="Font Size" label-width="200px" v-if="form.excel_config.is_excel_form_type">
                                                    <el-input-number name="font_size" placeholder="Font Size" :controls=false v-model="form.excel_config.formatting.font_size" cid="doc-setup-form-font-size" ></el-input-number>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                    </el-row>

                                    <el-divider content-position="left" v-if="!form.excel_config.is_excel_form_type">Primary key columns</el-divider>
                                    <DualListBox v-if="!form.excel_config.is_excel_form_type" label="name" :source="primaryKeyColumns_slushBucketData.source" :destination="primaryKeyColumns_slushBucketData.destination" @onChangeList="(changedData) => {onChangePrimaryKeyColumn(changedData);}"/>
                                        <el-tabs @tab-click="handleClick">
                                    <el-tab-pane v-if="!form.excel_config.is_excel_form_type">
                                    <div class="tab-body" v-for="(option, index) in form.excel_config.template" :key="index">
                                        <el-row :gutter="40">
                                            <el-col :span="6">
                                                <div class="kp-form-group">
                                                    <el-form-item label="Label" label-width="60px">
                                                        <el-input
                                                            v-model="option.label"
                                                            :rows="2"
                                                            placeholder="Label">
                                                        </el-input>
                                                    </el-form-item>
                                                </div>
                                            </el-col>
                                            <el-col :span="8">
                                                <div class="kp-form-group">
                                                    <el-form-item>
                                                        <el-select v-model="option.field_id" name="Fields" placeholder="Select invoice fields" filterable @change="handleTemplateChange($event,option)" v-if="!form.excel_config.is_excel_form_type">
                                                            <el-option v-for="(item) in de_fields" :key="item.field_id" :label="item.label" :value="item.field_id"></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </div>
                                            </el-col>
                                            <el-col :span="6">
                                                <div class="kp-form-group">
                                                    <el-form-item label="Color" label-width="60px">
                                                        <el-input
                                                            v-model.trim="option.color"
                                                            :rows="2"
                                                            placeholder="#A0AEC0">
                                                        </el-input>
                                                    </el-form-item>
                                                </div>
                                            </el-col>
                                            <el-col :span="4">
                                                <div class="add-chekbox-container">
                                                    <el-button
                                                    class="add-remove"
                                                    type="text"
                                                    @click="removeExcelTemplate(index)"
                                                    :disabled="form.excel_config.template.length == 1"
                                                    >
                                                    <span class="mdi mdi-delete"></span>
                                                    </el-button>
                                                    <el-button class="add-btn"
                                                    type="primary"
                                                    @click="addExcelTemplate(option)"
                                                    >
                                                    <span class="mdi mdi-plus"></span>
                                                    </el-button>
                                                </div>
                                            </el-col>
                                        </el-row>
                                    </div>
                                    </el-tab-pane>
                                    </el-tabs>
                                </el-tab-pane>

                            </el-tabs>
                        </el-form>
                    </div><!-- | panel body -->
                    <footer v-if="activeTab != 'business_rule'">
                        <div>
                        </div>
                        <div>
                            <el-button size="small" cid="doc-setup-form-cancel" v-on:click="$router.push('/idp/document-setup-list')" name="cancel"> Cancel</el-button>
                        </div>
                        <div>
                            <el-button v-if="isSaveActionAllowed" size="small" cid="doc-setup-form-save" type="primary" v-on:click="onSave" name="save"> Save</el-button>
                        </div>
                    </footer>
                </div> <!-- | panel -->
            </section><!-- |  form-page-container  -->
    </section>

     <!-- Dialogs -->
        <div v-if="displayAddBRDialog">
            <el-dialog
              width="55%"
              :show-close="false"
              :destroy-on-close="true"
              class="folder-modal-container"
              title="Add Business Rule"
              :visible.sync="displayAddBRDialog"
              center
            >
              <AddBusinessRule :field="form" :isDocumentLevel="true" :displayAddBRDialog.sync="displayAddBRDialog" />
           </el-dialog>
        </div>

        <div v-if="displayAddListViewPopupModal">
            <el-dialog
              top="5vh"
              :before-close="closeListColumnDialog"
              width="55%"
              :show-close="false"
              :destroy-on-close="true"
              class="folder-modal-container list-view-model"
              title="List view column config"
              :visible.sync="displayAddListViewPopupModal"
              center
            >
              <AddListColumnDialog pageTitle = "List view column configuration" :documentType="form.document_type" :data="form.list_view_columns" @updateForm="setAndUpdateForm" :addListViewPopupModalData="addListViewPopupModalData" :displayAddListViewPopupModal.sync="displayAddListViewPopupModal" />
           </el-dialog>
        </div>


     <VersionRelatedList v-if="showVersionList" :id="form._id"  title="Document type versions"></VersionRelatedList>
    </el-main>
</template>

<style lang="scss">
        @import "../_idpGlobal.scss";
        @import "../_idpVariables.scss";

        .secondary-ocr-vendors{
            display: flex;
            align-items: center;

            .kp-form-group{
                .el-form-item{
                    display: flex;
                    align-items: center;
                }
            }

            .del-add-btn{
                display: flex;
                gap: .5rem;
            }

            .vendor-name-button-new-tag{
                height: 32px;
                line-height: 30px;
            }

            .vendor-name-input-new-tag{
                width: 90px;
            }

            .el-tag{
                margin : 3px;
            }

            .el-form-item__content{
                width : 100%;
            }
        }

        .accordian-bar-div{
            margin-bottom: 24px;
        }

        .el-form-item__label{
            // margin-top: 5px;
            padding: 4px 12px 0 0;
        }

        .add-chekbox-container {
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

        .form-page-container{
                .br-list-page-title{
                        margin-bottom: 0px;
                        margin-left: 17px;
                }
                .table-type-config-table-title{
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                }
                .fraud-detection-wrap {
                    .el-form-item__content {
                        margin-left: 2.8rem !important;
                    }
                    .el-form-item {
                        display: flex;
                    }
                    .el-form-item__label {
                        width: 160px !important;
                    }
                }
                .fraud_detection_label{
                    display: inline-block;
                    width:192px;
                    font-size: var(--font-base);
                    align-items: center;
                    span{
                        margin-left: 5px;
                        // font-size: 14px;
                        color: var(--dark-05);
                    }
                }
                .fraud_detection_msg{
                    margin-left: 15px;
                    font-size: 10px;
                    color: rgb(255, 0, 0)
                }
        }

        .slushbucket_container {
        //   width: 48rem;
        //   height: 36rem;
        //   padding: 2rem;
          .footer_row {
            margin: 16px 0px 016px 16px;
            float: right;
          }
          div.bulk-action:hover {
            cursor: pointer;
          }
          div.bulk-action {
            .select-all {
              padding: 4px;
              background-color: #5a67d8;
            }
            .deselect-all {
              padding: 4px;
              color: #96989a;
              background: white;
              border-radius: 0px;
            }
          }

          ul.list-box {
            li.list-item.active {
              background-color: #5a67d8 !important;
              color: var(--white);
            }
            li.list-item.active:hover {
              background-color: #5a67d8;
              color: var(--white);
            }
          }

          .el-tab-pane {
            font-family: var(--font-family);
            font-size: var(--font-sm);
            font-weight: normal;
            div.clear-search {
              padding: 0px 4px 0px 4px;
              margin: 4px;
              border: 1px solid;
              border-radius: 10px;
              color: #6c757d;
            }

            .list-box-wrapper {
              .list-box-item {
                .search-box{
                    .clear-search{
                        height: 1rem;
                        width: 1rem; border-radius: 50%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin-top: 0.5rem;
                        padding: 0.25rem;
                        padding-bottom: 0.5rem;
                    }
                }
                border-radius: 0px;
                input {
                  background-color:var(--dark-07);
                //   height: 2rem;
                }
                input:hover {
                  border-radius: 0px;
                  border: none;
                }
                &::placeholder {
                  font-family: var(--font-family);
                  font-size: var(--font-sm);
                  font-weight: normal;
                }
              }
              .actions {
                div.btn-action {
                  background-color: #5a67d8;
                  padding: 4px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  svg {
                    height: 1rem;
                    width: 1rem;
                  }
                }
              }
            }
          }

          .list-box::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px var(--dark-06);
            background-color: var(--white);
          }

          .list-box::-webkit-scrollbar {
            width: 6px;
            background-color: var(--white);
          }

          .list-box::-webkit-scrollbar-thumb {
            background-color: var(--dark-05);
          }
          .el-tab-pane {
            .el-form-item__content{
                .approver-list-box-container{
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 2px 2em;
                    align-content: stretch;
                    justify-content: space-between;
                    justify-items: stretch;
                }
            }
          }
      }
      .read-only-fields-label{
        input.el-input__inner[style]{
            height: 28px !important;
        }
    }
    .info-icon {
        font-size: 18px;
    }
    .change-sheet-name-label {
        display: flex;
    }

    div.el-select-dropdown {
        ul.el-select-dropdown__list {
            background-color: inherit;
            // background-color: #f3f7fa;
            border-radius: 0px;
            li.el-select-dropdown__item {
            font-size: 11px;
            padding: 0px 8px 0px 16px;
            height: 24px;
            line-height: 24px;
            }
        }
    }

    </style>

<script>
    import Constants from "@/resources/Constants";
    import FraudDetectionConfig from "@/resources/FraudDetectionConfig";
    import CustomerConfig from "@/idp/services/DeCustomerConfig";
    import KsModelService from "@/idp/services/KsModelService";
    import DataTable from "@/components/DataTable.vue";
    import AddBusinessRule from "@/idp/components/AddBusinessRule.vue";
    import AddListColumnDialog from "@/idp/components/AddListColumnDialog.vue";
    import StorageService from "@/idp/services/StorageService";
    import EventBus from "@/EventBus";
    import _ from "lodash";
    import FieldService from "@/idp/services/FieldService";
    import DualListBox from "@/idp/components/DualListBox.vue";
    import VersionRelatedList from "@/idp/components/VersionRelatedList.vue";
    import documentSetupService from "@/idp/services/internal/DocumentSetupService";
    import EmailService from "@/idp/services/EmailsService";
    import SlushBucketService from "@/idp/services/internal/SlushBucketService";
    import PromptService from "@/idp/services/PromptService";
    import formMixin from "@/mixins/formMixin.js";

    export default {
        name: "DocumentConfigForm",
        mixins: [formMixin],
        components: {
            DataTable,AddBusinessRule,DualListBox, AddListColumnDialog,VersionRelatedList
        },
        watch:{
          displayAddBRDialog(val){
            if(!val){
                this.$refs.datatable.refreshTable();
            }
           },
        },
        computed: {
            hasGroupCreationFields() {
                return !_.isEmpty(this.selectedSubtype);
            },
            displayPackageCreationTab(){
                let shoulDisplayPackageCreationTab = false;
                if(_.get(this.form, 'view') == Constants.DOCEX.VIEW.PACKAGE) {
                    shoulDisplayPackageCreationTab = true;
                }
                return shoulDisplayPackageCreationTab;
            },

            displayListViewTab(){
                let shoulDisplayListViewTab = false;
                if(_.get(this.form, 'view') == Constants.DOCEX.VIEW.PACKAGE) {
                    shoulDisplayListViewTab = true;
                }
                return shoulDisplayListViewTab;
            },

            tableParams() {
                return {
                    apiName: `/portal/api/business-rule-field-map?document_type=${this.form.document_type}`,
                    saveAPI: `/portal/api/table/de_business_rule_field_map`,

                    defaultData: {
                        de_field_id: null,
                        document_type: this.form.document_type,
                        active: true,
                    },
                    tableName: "field_business_rule_map",
                    tableHeaderConfigParams: {
                        document_type: this.form.document_type,
                    },
                    isRestify: false,
                    isRegxSearch:true,
                    customfilter: false,
                    tableMode:"remote",
                    queryParam: {
                        active: true,
                        de_field_id: null,
                        document_type: this.form.document_type,
                    },
                    limit: 10,
                    allowInline: true,
                    inlineAddButtonConfig: {
                        disable: this.isEditMode ? false : true
                    },
                    hideAddButton:true,
                    addButtonConfig: {
                        event: "add-business-rule-from",
                        name: "Add rule",
                    },
                };
            },
        },
        data() {
            var validateEnablePaginationOn = (rule, value, callback) => {
                value = this.form.form_view_config.enable_pagination_on;
                if (isNaN(value) || value < 20 || value > 500) {
                    callback(new Error(`Pagination is enabled for value ranges between 20 and 500`));
                    return;
                }
                callback();
            }

            var validateVisibleStageCount = (rule, value, callback) => {
                value = this.form.list_view_config.visible_stage_count;
                if (isNaN(value) || value < 1 || value > 4) {
                    callback(new Error(`Visible stage count should be a number between 1 and 4.`));
                }else {
                    callback();
                }
            };

            var DocumentRestorationValueValidator = (rule, value, callback) => {
                value = this.form.data_retention_policies.max_document_restoration_days && parseInt(this.form.data_retention_policies.max_document_restoration_days)
                this.form.data_retention_policies.max_document_restoration_days = value
                if (rule.field == 'max_document_restoration_days' && (value > 90)) {
                    callback(new Error(`Max document restoration for (n) days should be less than or equal to 90 days`));
                }else {
                    callback();
                }
            };
            var DataRetainValueValidator = (rule, value, callback) => {
                value = this.form.data_retention_policies.messages_retain_for_days && parseInt(this.form.data_retention_policies.messages_retain_for_days)
                this.form.data_retention_policies.messages_retain_for_days = value
                if (rule.field == 'messages_retain_for_days' && (value > 730)) {
                    callback(new Error(`Messages retain for (n) days should be less than or equal to 730 days`));
                }else {
                    callback();
                }
            };

            var EmptyValueValidator = (rule, value, callback) => {
                if (value && ("" + value).trim() === "") {
                    callback(new Error("Please enter valid label name"));
                } else {
                    callback();
                }
            };

            var validateCustomerStorage = (rule, value, callback) => {
                if(this.form.storage_type !=='customer_storage')
                    return callback();
                if(this.form.publish_to == "system" && this.form.storage_type =='customer_storage' && !value)
                    return callback(new Error(`Please select valid storage`));
                callback();
            };
            var validateDocument = (rule, value, callback) => {
                    if ((rule.field == 'max_number_of_attachments_per_doc' || rule.field == 'max_attachment_size_per_doc') &&
                        ((!/^([+-]?[1-9]\d*|0)$/.test(value)))) {
                    callback(new Error(`Attachment Number must be an Integer`));
                    }else if (rule.field == 'max_attachment_size_per_doc' &&
                        (parseInt(value) > Constants.DOCEX.MAX_ATTACHMENT_SIZE_PER_DOC)) {
                    callback(new Error(`Maximum attachment size per file should be less than or equal to ${Constants.DOCEX.MAX_ATTACHMENT_SIZE_PER_DOC} MB`));
                    }
                    else if (rule.field == 'max_number_of_attachments_per_doc' &&
                        (parseInt(value) > Constants.DOCEX.MAX_NUMBER_OF_ATTACHMENT_PER_DOC)) {
                        callback(new Error(`Maximum ${Constants.DOCEX.MAX_NUMBER_OF_ATTACHMENT_PER_DOC} attachments are allowed per document`));
                    } else {
                    callback();
                    }
                };
            return {
                fieldsToBeRemoved:{
                    source:[],
                    destination:[]
                },
                slushBucketData:{
                    source:[],
                    destination:[]
                },
                dynamicTabsSlushBucketData:{
                    source:[],
                    destination:[]
                },
                primaryKeyColumns_slushBucketData:{
                    source:[],
                    destination:[]
                },
                isExcelFormType: false,
                isSaveActionAllowed: true,
                displayAddListViewPopupModal:false,
                addListViewPopupModalData:false,
                enableListViewTable:true,
                listViewTableParams: {
                    isStaticTable: true,
                    showPaginationOptions: false,
                    showTableToolbar: true,
                    showSelectOptions: false,
                    showSortOptions: false,
                    fixedHeader: false,
                    globalSearch:false,
                    customfilter:false,
                    theme: "mytheme",
                    rows: [],
                    columns: [
                        {
                            label: "Stage",
                            field: "stage",
                            width: "300px",
                            filterOptions: {
                                enable: false
                            },
                        },
                        {
                            label: "Category",
                            field: "category",
                            filterOptions: {
                                enable: false
                            },
                        },
                        {
                            label: "Actions",
                            field: "actions",
                            sortable: false,
                            tdClass: "action-col",
                            thClass: "action-col",
                            width: "7%",
                        }
                    ],
                    hideAddButton:true,
                    addButtonConfig: {
                        event: "add-list-view-column-from",
                        name: "Add",
                    },
                    actionItems: [
                        {
                            icon: "mdi mdi-pencil",
                            name: "Edit",
                            event_name: "edit_list_view_column",
                            inline: true,
                        }
                    ],
                },
                activeTab:'general',
                visible:false,
                displayAddBRDialog:false,
                showDatatable: true,
                languages: Constants.LANGUAGES,
                fraudDetectionConfig:FraudDetectionConfig.FRAUD_DETECTIONS,
                dateFormats: [],
                pageTitle: "document type",
                labelPosition: "top",
                showSelectOptions: true,
                isStorageVisible : true,
                // document_type_list: [],
                // options:[],
                classification_model_options:[],
                template_ner_model_options:[],
                // domain_document_map:{},
                publish_to_list: Constants.DOCEX.PUBLISH_CHANNEL_LIST,
                exportScriptTypes: Constants.DOCEX.EXPORT_SCRIPT_TYPES,
                system_list: [],
                workflow_list: [],
                enable_approval_workflow_list: [],
                loading: false,
                mail_provider: Constants.DOCEX.MAIL_SERVICE_PROVIDER,
                host_port_mapping: Constants.DOCEX.EMAIL_HOST_PORT_MAPPING,
                dateFormat: Constants.DOCEX.DATE_FORMAT_MAPPING,
                upload_storage_list:Constants.DOCEX.UPLOAD_STORAGE_LIST,
                triggerStages_List:Constants.DOCEX.STAGE,
                customer_storages : [],
                customer_publish_storages : [],
                moveToDocumentFields:[],
                select_remove_after:[],
                supportedFiles:_.keys(Constants.DOCEX.FILE_EXT_MIMETYPE_MAPPING),
                select_options:"",
                emailTemplateNames:[],
                promptList : [],
                page_type_mapping: [],
                selectedGroupedFields: [],
                selectedSubtype: [],
                tableFields: [],
                form: {
                    table_types_config : [],
                    document_subtype_list: [],
                    list_view_config: {
                        visible_stage_count: 4
                    },
                    form_view_config:{
                        enable_pagination_on:40,
                        page_size: 20
                    },
                    config: {
                        enable_approval: false,
                        enable_approval_passcode:false,
                    },
                    document_type: "",
                    data_retention_policies : {
                    messages_retain_for_days: 30,
                    document_restoration : false,
                    max_document_restoration_days: 15
                    },
                    publish_to: "",
                    customer_system_id: null,
                    workflow_id: null,
                    approval_workflow_id:null,
                    date_format: "",
                    input_channel_id: [],
                    supported_files: [],
                    multi_document:false,
                    enable_email_view:false,
                    is_cuad_type:false,
                    max_number_of_attachments_per_doc:'',
                    page_type_mapping: "",
                    max_attachment_size_per_doc: '',
                    email_notifications: this.getNotificationObject(),
                    auto_publish_enabled: false,
                    fields_to_be_removed:[],
                    fraud_detection:this.getFraudDetectionDefaultValues(),

                    language: null,
                    is_document_attachment_required:false,
                    storage_type:"",
                    customer_storage_id:null,
                    customer_publish_storage_id:null,
                    allow_duplicate_attachment:false,
                    allow_attachments:true,
                    stage_tabs_by_order:[],
                    classification_model_id:null,
                    auto_learning:{
                        enable:false,
                        trigger_stages:[],
                    },
                    enable_email_extraction : false,
                    ignore_vision_address : false,
                    ignore_remit_address: false,
                    enable_llm_extraction : false,
                    process_document_sequentially_after_extraction: false,
                    email_extraction_prompt_name : "",
                    package_config:{},
                    list_view_columns:[],
                    secondry_ocr_vendors: {},
                    view:"",
                    excel_config:{
                        "active":false,
                        is_excel_form_type: false,
                        "template":[{}],
                        is_templateless:false,
                        "primary_key_columns":[],
                        realtime_validation:false,
                        post_extraction_batch_size:'',
                        publish_batch_size:'',
                        check_mandatory_fields:false,
                        enable_fraud_detection:false,
                        auto_publish_enabled:false,
                        notification_email_recipients:"",
                        enable_validation: false,
                        enable_cancel_extraction: false,
                        enable_cancel_publish: false,
                        allow_cell_edit_after_publish: false,
                        formatting: {
                            font_face: "",
                            font_size: 10,
                            remove_borders: true,
                            bold: false,
                            bg_color: "",
                            headers_bg_color: "",
                            remove_data_verification: false,
                        },
                        excel_classification_model_id:null,
                        classification_threshold: null,
                        ocr_dimension: "",
                        valid_row_column_threshold: null,
                        prediction_threshold: null,
                        group_creation_fields:{},
                        template_ner_model_id:null,
                        rename_target_sheet_as:"",
                        rows_limit: null
                    },
                    extraction_threshold : 2,
                    classification_enable_on_manual_upload:false,
                    publish_to_email_config: {},
                    prediction_horizontal_distance:"",
                    use_header_ner: true
                },
                extraction_threshold_enabled : true,
                de_fields:[],
                supportedFontFamilies: Constants.DOCEX.EXCEL.FONT_FAMILY,
                idToFieldMap:{},
                showVersionList:true,
                formRules: {
                    enable_pagination_on: [{
                        validator: validateEnablePaginationOn,
                        trigger: "blur",
                        message: "Pagination is enabled for value ranges between 20 and 500",
                    }],
                    visible_stage_count: [{
                        validator: validateVisibleStageCount,
                        trigger: "blur",
                        message: "Visible stage count should be a number between 1 and 4.",
                    }],
                    approval_amount:[
                        {
                            required: true,
                            trigger: "blur",
                            message: "Please enter approval amount",
                        }
                    ],
                    messages_retain_for_days: [{validator: DataRetainValueValidator, trigger: 'blur'}],
                    max_document_restoration_days: [{validator: DocumentRestorationValueValidator, trigger: 'blur'}],
                    document_type: [{
                            validator: EmptyValueValidator,
                            trigger: "blur",
                            message: "Please select document type",
                        },
                       {
                            required: true,
                            message: "Please select document type",
                            trigger: "blur",
                        },
                    ],
                     max_number_of_attachments_per_doc: [{
                        required: true,
                        message: "Please choose maximum attachment per document",
                        trigger: "blur"
                    },
                     { validator: validateDocument, trigger: 'blur' }
                    ],
                     max_attachment_size_per_doc: [{
                        required: true,
                        message: "Please choose maximum document size",
                        trigger: "blur"
                    },
                    { validator: validateDocument, trigger: 'blur' }],
                    customer_storage_id:[{ validator: validateCustomerStorage, trigger: 'blur' }],
                    publish_to_email_config: {
                        email_publish_to_format:[ { required: true, trigger: "change", message: "Please select 'Output file format'" } ],
                        email_publish_to_recipient:[ { required: true, trigger: "change", message: "Please select 'Email recipient(s)'" } ],
                        email_publish_to_template:[ { required: true, trigger: "change", message: "Please select 'Email templte'" } ]
                    }
                },
                modified_document_types: [],
                allListStages: Constants.DOCEX.ALL_LIST_STAGES,
                slushBucketDestination : {},
                showFieldOptions : false,
                fieldOptions:[],
                selectedFieldOptions:[],
                defaultTableTypeConfig:[{"label":"","key":"", "document_subtype":null, "selected_fields":[]}],
                showVendorAliasInputBox: false,
                vendorAliasInputValue: '',
                activeOCRVendor: '',
                secondaryOCRState: 0,
                clonedSecondaryOcrVendors: {},
                tableFieldsData : [],
            };
        },
        methods: {
            async getAllPrompts() {
                try {
                    const filter = { active : true, type: "text" };
                    const columns = [ "name", "label" ];
                    this.promptList = await PromptService.getAllPrompts(filter, columns);
                } catch (error) {
                    console.log(error);
                    this.notifyError("Error while getting prompts.");
                }
            },


            // Assign a page_type_mapping to an array containing group_creation_fields as key and select_fields as value
            setGroupCreationFields() {
                const groupCreationFields = { ...this.form.excel_config.group_creation_fields, [this.selectedSubtype]: this.selectedGroupedFields };
                this.form.excel_config.group_creation_fields = groupCreationFields;
            },

            // Convert ocr_dimension to an array
            formatOcrDimentions() {
                let ocrDimentions = this.form.excel_config.ocr_dimension;
                if (_.isString(ocrDimentions)) {
                    ocrDimentions = _.split(ocrDimentions, ',');
                    this.form.excel_config.ocr_dimension = _.map(ocrDimentions, dimension => _.parseInt(dimension, 10));
                }
            },

            // Update selectedGroupedFields based on changes in selectedSubtype
            onGroupFieldChange() {
                const groupField = this.selectedSubtype
                this.selectedGroupedFields =  this.form.excel_config.group_creation_fields[groupField] || [];
            },

            /*
            * Handle changes in page_type_mapping by splitting and updating the array with unique values
            * Example: "sov, , sov" => ['sov']
            */
            handlePageTypeMappingChange() {
                if (_.isString(this.form.page_type_mapping)) {
                    const pageTypeMapping = this.form.page_type_mapping.split(',').map(value => value.trim());

                    this.page_type_mapping = _.union(this.page_type_mapping, pageTypeMapping);
                    this.page_type_mapping = _.intersection(this.page_type_mapping, pageTypeMapping).filter(value => value !== '');
                    this.form.page_type_mapping = _.uniq(_.compact(_.map(this.form.page_type_mapping.split(/\s*,\s*/), _.trim)));
                }
            },

            onChangeIsExcelFormType(){
                if(this.form.excel_config.is_excel_form_type){
                    this.form.excel_config.post_extraction_batch_size = 1
                    this.form.excel_config.publish_batch_size = 1
                    this.form.excel_config.enable_cancel_extraction = false
                    this.form.excel_config.enable_cancel_publish = false
                }
                else {
                    this.form.excel_config.rows_limit = null
                }
            },
            handleEnableAssignmentNotificationChange() {
               // Reset assignment_email_template_id to null when assignment notification is disabled
                if (!this.form.email_notifications.enable_assignment_notification) {
                    this.form.email_notifications.assignment_email_template_id = null;
                }
            },
            handleClearEmailTemplate() {
                this.form.email_notifications.assignment_email_template_id = null; // Set to null when cleared
            },
            //on fields selection update fields_to_be_removed list.
            onFieldToBeRemovedChange: function ({ source, destination }) {
                this.fieldsToBeRemoved.source = source ;
                this.fieldsToBeRemoved.destination = destination ;
                // updating fields_to_be_removed list with new selected field list.
                this.form.fields_to_be_removed = _.map(destination, function(field) {return field.name;}, '')
            },
            onDynamicTabsListChange: function ({ source, destination }) {
                this.$set(this.dynamicTabsSlushBucketData, "source", source);
                this.$set(this.dynamicTabsSlushBucketData, "destination", destination);
                this.slushBucketDestination = this.dynamicTabsSlushBucketData.destination;
            },
            deSelectWorkFlow(value){
                if(value){
                    this.form.approval_workflow_id = null;
                }
            },
            hideShowDocumentRestorationInput(value){
                this.form.data_retention_policies.document_restoration = value;
                this.form.data_retention_policies.max_document_restoration_days = 15;
            },
            isValidateExcelTemplate(){
                let validateExcelTemplate = true
                const data = this.form.excel_config.template
                for (const prop in data) {
                    let obj = data[prop];
                    for(const res in obj){
                        //'color' can empty for 'config.template' hence, skipping the 'non empty' fields check
                        if(res == 'color'){
                            continue;
                        }
                        if(obj[res] == ""){
                            validateExcelTemplate = false
                            break;
                        }
                    }
                    if(!validateExcelTemplate){
                        break;
                    }
                }
                return validateExcelTemplate
            },

            async getFieldsOnDocumentType(){
                const documentType = this.form.document_type;
                const fields = await FieldService.getFieldByDocumentType({"document_type": documentType,"active":true},["label","field_type","name"])
                this.idToFieldMap = {}
                for(const field of fields){
                    this.idToFieldMap[field._id + ""] = field;
                    if(field.field_type == "table"){
                        this.tableFields.push({"label":field.label,"field_id":field._id,"field_type":field.field_type, "field_name":field.name})
                        this.de_fields.push({"label":field.label+' (line)',"field_id":field._id,"field_type":field.field_type, "field_name":field.name})
                        continue;
                    }
                    this.de_fields.push({"label":field.label,"field_id":field._id,"field_type":field.field_type, "field_name":field.name});
                }
                this.tableFields.sort((a, b) => a.label.localeCompare(b.label));
                this.de_fields.sort((a, b) => a.label.localeCompare(b.label));
            },
            handleTemplateChange(fieldId, template){
                const field = this.idToFieldMap[fieldId];
                template["ftype"] = field.field_type
                template["fname"] = field.name;
                template["field_id"] = fieldId + "";
                console.log("@template",template)
            },
            addExcelTemplate() {
                this.form.excel_config.template.push({
                    label: "",
                    field_id: "",
                    ftype:"",
                    fname:""
                });
            },
            addTableTypeConfig(){
                this.form.table_types_config.push({
                    label:"",
                    key:"",
                    document_subtype:null,
                    selected_fields:[]
                })
            },
            removeExcelTemplate(_index) {
                this.form.excel_config.template.splice(_index, 1);
            },
            removeTableTypeConfig(_index){
                this.form.table_types_config.splice(_index,1)
            },
            onChangePrimaryKeyColumn({ source, destination }){
                this.$set(this.primaryKeyColumns_slushBucketData, "source", source);
                this.$set(this.primaryKeyColumns_slushBucketData, "destination", destination);
            },
            preparePrimaryKeyColumnFields(allFields,selectedFields=[]){
                const headerFields = {
                    source: [],
                    destination: [],
                };
                const prepareBucketField = (field) => {
                    return {
                        label: field.label,
                        name:field.name,
                        code: "" + field._id,
                        order: !isNaN(field.order) ? field.order : 9999
                    };
                };
                const isSelectedField = (field)=>{
                        return selectedFields.find(item=>item.code == field._id);
                };
                const addField = (field) => {
                    if (!field || !field._id) {
                        return;
                    }
                    const fieldKey = isSelectedField(field) ? "destination" : "source";
                    headerFields[fieldKey].push(prepareBucketField(field));
                };
                allFields.map(addField);
                // Sort fields depending on order given
                headerFields.destination.sort((a, b) => a.order - b.order)
                headerFields.source.sort((a, b) => a.order - b.order)
                this.primaryKeyColumns_slushBucketData = headerFields;
            },

            onChangeList: function ({ source, destination }) {
                this.$set(this.slushBucketData, "source", source);
                this.$set(this.slushBucketData, "destination", destination);
                const packageCreationColumns = this.slushBucketData.destination.map(ele=>ele.code)
                this.$set(this.form, 'package_config',{ ...this.form.package_config,'creation_columns':packageCreationColumns});
            },
            closeListColumnDialog(){
                this.addListViewPopupModalData = '';
            },
            setAndUpdateForm(data){
                if(data.isEditMode){
                    this.form.list_view_columns[data.data.originalIndex].fields = data.data.fields
                    this.$set(this.form.list_view_columns[data.data.originalIndex], "sort_by", _.get(data,"data.sort_by"))
                }else{
                    const {fields,stage,category} = data.data;
                    this.form.list_view_columns.push({fields,stage,category});
                }
                this.enableListViewTable = false;
                this.onSave()
            },
            handleTypeChange(labelValue){
              this.form[labelValue]=true
            },
            onPublishToChange(publishTo) {
                this.form.showSelectOptions = publishTo === "system" ? true : false;
                this.form.system = null;
                this.form.workflow_id = null;
                this.form.customer_system_id = null;
                this.$forceUpdate();
            },
            async onUploadStorageSelect(){
                this.isStorageVisible =  true;
               if(this.form.storage_type =="customer_storage"){
                await this.getStorage()
               } else if(this.form.storage_type =="inline_attachment"){
                this.isStorageVisible =  false;
                this.form.customer_storage_id = null
               }
            },
            async getStorage(){
                this.customer_storages= await StorageService.getAll({active:true,storage_type: "attachment"})
                this.customer_publish_storages = await StorageService.getAll({active:true,storage_type: "publish"})
                this.customer_publish_storages.push({"name":"None","_id":null})
            },

            async onSystemChange(system) {

                this.form.workflow_id = null;

                if (!this.form.customer_system_id) {
                    this.form.customer_system_id = null;
                    this.form.master_system_id = null;
                    this.form.workflow_id = null;
                    this.workflow_list = [];
                    return;
                }

                this.loading = true;
                this.form.master_system_id = _.find(this.system_list,(obj)=>{
                    return obj.customer_system_id==this.form.customer_system_id
                })["master_system_id"]
                let workflowListResponse = await CustomerConfig.getWorkflowList({
                    master_system_id: this.form.master_system_id,
                });
                // this.workflow_list = _.get(
                //     workflowListResponse.data,
                //     this.form.customer_system_id,
                //     []
                // );
                this.workflow_list = workflowListResponse && workflowListResponse.data;
                this.loading = false;
                this.$forceUpdate();
            },
            reRenderDatatable() {
                this.showDatatable = false;
                this.$nextTick(() => {
                    this.showDatatable = true;
                });
            },
            selectDeleteOptions(){
                let options=["remove_document_post_polling","remove_document_post_publish"]
                options.forEach(option => {
                    this.form.data_retention_policies[option] = this.select_remove_after.includes(option);
                });
            },
            async getModelList(modelType){
                const params = {
                    filter: { model_type: {$in : modelType} },
                    projection: ["_id","model_name","customer_id","model_type"],
                    search_tenant_models: true,
                    search_system_models: true
                };
                let modelList = await KsModelService.getModels(params);

                const groupedModels = this.groupModelsByType(modelList);
                return groupedModels;
            },
            groupModelsByType(modelList){
                const modelTypeGroups = {};

                // Adding system to model_name if model is fetched from system DB
                _.each(modelList, model => {
                    if ( model.customer_id == Constants.SYSTEM_CUSTOMER_ID ) {
                        model.model_name = model.model_name + "(system)"
                    }
                });

                const groupedModels = _.groupBy(modelList, "model_type");
                return groupedModels;
            },
            removeEmptyTableTypeConfig(){
                this.form.table_types_config = this.form.table_types_config.filter(config => config.selected_fields.length > 0);
            },
            async onSave() {
                if(!this.isValidateExcelTemplate()){
                    this.notifyError("Excel template values can not be blank");
                    return
                }
                this.form.excel_config.primary_key_columns=this.primaryKeyColumns_slushBucketData.destination;
                this.form.stage_tabs_by_order = documentSetupService.getDestinationTabs(this.allListStages, this.slushBucketDestination);
                this.selectDeleteOptions();
                this.formatOcrDimentions();
                this.setGroupCreationFields();
                this.form.excel_config.is_templateless = this.form.excel_config.is_excel_form_type;
                this.copyClonedOcrVendors();

                //Check if dynamic tabs list is empty or not
                if(documentSetupService.isEmptyDynamicTabsList(this.form.stage_tabs_by_order)){
                    this.notifyError("Dynamic tabs list should have at least one tab value");
                    return;
                }
                
                const isTableTypeConfigInvalid = this.form.table_types_config.some(config => 
                    config.selected_fields.length === 0 || config.label === '' || config.key === ''
                );
                if(isTableTypeConfigInvalid){
                    this.notifyError("Table type configuration form is not valid. Please correct the form and save again.");
                    return ;
                }

                let isValid = await this.$refs.form.validate().catch(error => {});
                if(!isValid)return;
                this.showVersionList = false;
                // empty respective id if enable_approval is false
                if(!this.form.config.enable_approval || !this.form.approval_workflow_id){ this.form.approval_workflow_id=null;}
                this.loading = true;
                 //underscore in document_type if have space in middle
                let documentType = this.form.document_type;
                documentType = documentType.trim().replaceAll(" ","_");
                this.form.document_type = documentType;
                this.form.customer_storage_id =  this.form.customer_storage_id || null;
                this.form.extraction_threshold = this.extraction_threshold_enabled ? this.form.extraction_threshold : 0
                if (_.isEmpty(this.form.workflow_id)) {
                    this.form.workflow_id = null;
                }
                isValid &&  CustomerConfig.save(this.form)
                    .then((response) => {
                        this.loading = false;
                        if(response.data.code == 11000){
                            this.notifyError(`Record is already present for ${this.form.document_type}.`);
                            return
                        }
                        this.notifySuccess("Record saved successfully.");
                        this.tableParams.inlineAddButtonConfig.disable = false;
                        this.form = response.data;
                        this.extraction_threshold_enabled = this.form.extraction_threshold ? true : false
                        this.listViewTableParams.rows = _.get(this.form, 'list_view_columns'); // Process according to STAGE_LABEL_MAP : PENDING
                        this.reRenderDatatable();
                        this.copySecondaryOCRInfo();
                        const stageConfig = this.form.stage_tabs_by_order;
                        this.dynamicTabsSlushBucketData = documentSetupService.prepareDynamicTabsSlushBucketData(this.allListStages, stageConfig)
                        this.slushBucketDestination = this.dynamicTabsSlushBucketData.destination;
                    })
                    .catch((error) => {
                        this.loading = false;
                        this.notifyError("There is an error in saving data.");
                    }).finally(()=>{
                        this.enableListViewTable = true;
                        this.showVersionList = true;
                    })

            },

            getNotificationObject() {
                return {
                    reviewer: "",
                    approver: "",
                    publisher: "",
                    enable_assignment_notification: false,
                    assignment_email_template_id : null,
                    ap_team_mail: ""
                };
            },
            getFraudDetectionDefaultValues(){
                let defaultValues = {};
                const fraudConfigs = FraudDetectionConfig.FRAUD_DETECTIONS;
                for (let index in fraudConfigs) {
                        defaultValues[fraudConfigs[index].key] = fraudConfigs[index].default;
                };
                return defaultValues;
            },
            getConfigIdFromUrl() {
                return this.$route.query.id || "";
            },
            async loadModelOptions(modelTypes) {
                try{
                    const modelList = await this.getModelList(modelTypes);
                    this.template_ner_model_options = modelList["NER"] || [];
                    this.classification_model_options = modelList["DOCUMENT_CLASSIFICATION"] || [];
                }
                catch(error){
                    console.error("Error fetching models:", error);
                };
            },
            async init() {
                this.loading = true;
                this.activeTab = "general"
                try {
                    const configId = this.getConfigIdFromUrl();
                    if (configId) {
                        this.documentConfig = await CustomerConfig.getCustomerConfigurationById(configId);
                        this.form = _.merge({}, this.form, this.documentConfig);
                        this.extraction_threshold_enabled = this.form.extraction_threshold ? true : false
                        this.page_type_mapping = this.form.page_type_mapping;
                        if(!this.form.excel_config.is_templateless){
                            this.select_options=1
                        }
                        this.copySecondaryOCRInfo();
                        let filter = {
                            document_type:this.form.document_type,
                            active:true
                        }

                        const allFieldsList =  await FieldService.getFieldsList(filter, ['_id', 'name', 'label','move_to_document','order', 'document_subtype', 'field_type']);
                        // filter 'table' fields only- for multi table config
                        this.tableFieldsData = allFieldsList.filter((field)=>field.field_type === "table");

                        // filtering the selected and unselected 'fields to be removed' fields from moveToDocumentFields and assigning it to slush bucket list.
                        this.moveToDocumentFields = allFieldsList.filter((field)=>field.move_to_document==true)
                        if( !_.isEmpty(this.moveToDocumentFields) && !_.isEmpty(this.form.fields_to_be_removed)){
                            this.fieldsToBeRemoved.destination =  this.moveToDocumentFields.filter((field)=> this.form.fields_to_be_removed.includes(field.name));
                            this.fieldsToBeRemoved.source =  this.moveToDocumentFields.filter((field)=> !(this.form.fields_to_be_removed.includes(field.name)));
                        }else{
                            this.fieldsToBeRemoved = SlushBucketService.prepareSlushbucketFieldsData(allFieldsList, this.moveToDocumentFields.map(field => field.label));
                        }
                        this.slushBucketData = documentSetupService.prepareSelectionFields(allFieldsList, this.form.package_config.creation_columns);
                        this.preparePrimaryKeyColumnFields(allFieldsList, this.form.excel_config.primary_key_columns);
                        if(this.form.data_retention_policies.remove_document_post_polling){
                            this.select_remove_after.push("remove_document_post_polling")
                        }
                        if(this.form.data_retention_policies.remove_document_post_publish){
                            this.select_remove_after.push("remove_document_post_publish")
                        }
                        this.tableParams.inlineAddButtonConfig.disable = false;
                        this.listViewTableParams.rows = _.get(this.documentConfig , 'list_view_columns');
                        this.enableListViewTable = true;
                    }
                    this.getFieldsOnDocumentType();
                    const stageConfig = this.form.stage_tabs_by_order;
                    this.dynamicTabsSlushBucketData = documentSetupService.prepareDynamicTabsSlushBucketData(this.allListStages, stageConfig)
                    this.slushBucketDestination = this.dynamicTabsSlushBucketData.destination;


                    let systemConfiguration = await CustomerConfig.getSystemConfigurations()
                    this.dateFormats = systemConfiguration.date_format_list;
                    const customerSystems = await CustomerConfig.getCustomerSystemList({docexWFSystem: true});
                    const workflowList = await CustomerConfig.getWorkflowList();
                    this.emailTemplateNames = await EmailService.getEmailsTemplatesByFilter({active:true},['name','_id']);
                    this.enable_approval_workflow_list = workflowList["data"]["allWorkflows"];

                    if (this.form.customer_system_id) {
                        this.workflow_list = _.get(
                            workflowList["data"]["groupedWorkflows"],
                            this.form.master_system_id,
                            []
                        );
                    }
                    this.loadModelOptions(["NER","DOCUMENT_CLASSIFICATION"]);
                    this.reRenderDatatable();
                    this.getStorage()
                    this.system_list = customerSystems.data || [];
                    this.system_list.push({
                        system_name: "OTHER",
                        master_system_id: null,
                        customer_system_id : null,
                    });
                    await this.getAllPrompts();
                } catch (err) {
                    this.notifyError("Error occured while getting data.");
                    console.log(err.message);
                } finally {
                    this.loading = false;
                }
            },
            handleClick(tab, event) {

            },
            // after publish we move fields from the prediction(de_document_data) to de_documents and this function is to get all those fields.
           async getMoveToDocumentFields(){
                let filter = {
                        document_type:this.form.document_type,
                        active:true,
                        move_to_document:true
                }
                const response =  await FieldService.getFieldsList(filter, ['name', 'label',"name"]);
                return response;
            },
           async handleRefreshForm(data = {}){
              //this.$forceUpdate();
            this.showVersionList = false;
            let recordId = this.$route.query.id;
            await this.init(recordId);
            this.showVersionList = true;
         },

            registerEvents(){
                EventBus.$on("delete_list_view_column", async(data)=>{
                    this.deleteListViewColumn(data.row)
                })
                EventBus.$on("edit_list_view_column", async(data)=>{
                    this.displayAddListViewPopupModal = true;
                    this.addListViewPopupModalData = data.row;
                });
                EventBus.$on("add-list-view-column-from", async(data)=>{
                    this.addListViewPopupModalData = '';
                    this.displayAddListViewPopupModal = true;
                })
                EventBus.$on("add-business-rule-from",async (value) => {
                    this.displayAddBRDialog = true;
                })
                EventBus.$on("refresh-version-list", data => this.handleRefreshForm(data));
            },
            getFilteredFieldsData(rowIndex, documentSubType) {
                if(documentSubType){
                    return this.tableFieldsData.filter(field => field.document_subtype === documentSubType);
                } else {
                    return this.tableFieldsData;
                }
            },
            showVendorAliasInput(vendorName){
                // Set the active vendor for which alias input is shown
                this.activeOCRVendor = vendorName;
                // Show the input box for adding vendor alias
                this.showVendorAliasInputBox = true;
                // Focus on the input field for adding vendor alias
                this.$nextTick(_ => {
                    this.$refs.vendorAliasInputRef[0].$refs.input.focus();
                });
            },

            handleVendorAliasInputConfirm(vendorAliases){
                // Add new vendor alias to the list
                if (this.vendorAliasInputValue) {
                    vendorAliases.push(this.vendorAliasInputValue.toLowerCase());
                }
                // Hide the vendor alias input box after confirming input
                this.showVendorAliasInputBox = false;
                // Clear the vendor alias input field
                this.vendorAliasInputValue = '';
            },

            handleCloseVendorAlias(vendorAliases, aliasIndex){
                // Remove the specified vendor alias
                vendorAliases.splice(aliasIndex, 1);
            },

            removeSecondaryOCRVendor(vendorName) {
                // Delete the vendor from the list
                delete this.clonedSecondaryOcrVendors[vendorName];

                // Increment the state to trigger reactivity
                this.secondaryOCRState += 1;
            },

            addSecondaryOCRVendor(){
                // Add an empty vendor entry
                this.clonedSecondaryOcrVendors[''] = [];

                // Increment the state to trigger reactivity
                this.secondaryOCRState += 1;
            },
            copyClonedOcrVendors(){
                // Remove empty keys and their corresponding values from clonedSecondaryOcrVendors
                const cleanedClonedOcrVendors = _.omitBy(this.clonedSecondaryOcrVendors, (value, key) => key === "");

                // Assign the cleaned cloned object to form.secondry_ocr_vendors
                this.form.secondry_ocr_vendors = cleanedClonedOcrVendors;
            },
            copySecondaryOCRInfo(){
                // Copy secondary OCR info from the form to the cloned data structure
                if(_.isEmpty(this.form.secondry_ocr_vendors)){
                    // If form data is empty, initialize the cloned data structure with an empty entry
                    this.$set(this.clonedSecondaryOcrVendors, '', []);
                    return;
                }
                // Clone the secondary OCR info from the form to the cloned data structure
                this.clonedSecondaryOcrVendors = _.cloneDeep(this.form.secondry_ocr_vendors);
            },

            handleOCRVendorNameInput(index, event) {
                const newVendorName = event.target.value;
                const clonedSecondaryOcrVendorNames = Object.keys(this.clonedSecondaryOcrVendors);
                const oldVendorName = clonedSecondaryOcrVendorNames[index];

                // Case 1: Input old value is blank and key is not present in object
                if (oldVendorName === '' && !clonedSecondaryOcrVendorNames.includes(newVendorName)) {
                    // Add new key with empty array as value and push key into array
                    delete this.clonedSecondaryOcrVendors[''];
                    this.$set(this.clonedSecondaryOcrVendors, newVendorName, []);
                    this.clonedSecondaryOcrVendors[newVendorName].push(newVendorName);
                }
                // Case 2: Input value changes and old value is present in object
                else if (oldVendorName !== newVendorName && clonedSecondaryOcrVendorNames.includes(oldVendorName)) {
                    // Remove old key-value pair and add new key with same value
                    const vendorAliases = this.clonedSecondaryOcrVendors[oldVendorName];
                    delete this.clonedSecondaryOcrVendors[oldVendorName];
                    this.$set(this.clonedSecondaryOcrVendors, newVendorName, vendorAliases);
                    this.clonedSecondaryOcrVendorNames.splice(index, 1, newVendorName);
                }
            },
            isServiceContract(){
                const documentType = this.form.document_type;
                return documentType.toLowerCase() === Constants.DOCEX.DOCUMENT_TYPES.SERVICE_CONTRACT;
            }
        },
        beforeDestroy() {
            const busEvents= [
                "delete_list_view_column",
                "edit_list_view_column",
                "add-list-view-column-from",
                "add-business-rule-from"
            ]
            EventBus.$off(busEvents)
        },
        async beforeMount() {
            this.isSaveActionAllowed = await this.isSaveActionPermitted('de_customer_configuration');
            this.$store.commit("setDisplayIdpTree",false);
            this.$store.commit("setDisplayIdpNavbar",true);
            this.init();
            //this.getDocumentType();
            this.registerEvents();
        },
    };
    </script>

