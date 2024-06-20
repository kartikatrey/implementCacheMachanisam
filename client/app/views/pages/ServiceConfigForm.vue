<template>
<el-main id="container">
    <div class="kp-back-to-parent">
        <el-button class="kp-btn-back" icon="el-icon-back" v-on:click="displayList"></el-button>
        <h1 class="kp-page-title">{{pageTitle}}</h1>
    </div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/service-config-list' }">Service configuration</el-breadcrumb-item>
        <el-breadcrumb-item>{{pageTitle}}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form :model="service" :rules="validationRules" :label-position="labelPosition" ref="ruleForm" label-width="100px">
        <ConfirmModel ref="model"></ConfirmModel>
        <div class="kp-form-area kp-tabs">
            <el-tabs class="kp-form-tabs-panel" v-model="tabIndex" type="card">
                <el-tab-pane class="kp-tabs-body" label="Basic">
                    <el-row>
                        <el-col>
                            <el-row :gutter="72">
                                <el-col :span="8">
                                    <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item class="kp-form-field-label" label="Service Name" prop="service_name">
                                            <el-input v-model="service.service_name" placeholder="E.g. SYSTEM_NAME_CREATE_MEETING">
                                            </el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item class="kp-form-field-label" label="Table Name" prop="table_name">
                                            <el-input v-model="service.table_name" placeholder="E.g. tableName"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row :gutter="72">
                                <el-col :span="8">
                                    <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item class="kp-form-field-label" label="End Point" prop="endpoints">
                                            <el-input v-model="service.endpoints" placeholder="E.g. /oneNote/getPages"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item class="kp-form-field-label" label="Domain" prop="domain">
                                            <el-select clearable v-model="service.domain" @change="onDomainChange" placeholder="Select Domain">
                                                <el-option v-for="domain in domainList" :label="domain.name" :value="domain.name" :key="domain.name"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row :gutter="72">
                                <el-col :span="8">
                                    <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item class="kp-form-field-label" label="Sort Field" prop="sort_field">
                                            <el-input v-model="service.sort_field" placeholder="E.g. created_date"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item class="kp-form-field-label" prop="system_name" label="System">
                                            <el-select clearable @change="onSystemChange" placeholder="Please select system" v-model="service.system_name">
                                                <el-option v-for="system in masterSystemList" :value="system" :key="system._id" :label="system.system_name"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-tab-pane>

                <el-tab-pane label="Discover Criteria">
                    <el-row>
                        <el-col>
                            <el-row :gutter="72">
                                <el-col :span="8">
                                    <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item class="kp-form-field-label" label="Action Name" prop="action_name">
                                            <el-input v-model="service.action_name" placeholder="E.g. copy/create/delete/get">
                                            </el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="9">
                                    <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item class="kp-form-field-label" label="Object Name" prop="object_type">
                                            <object-list clearable :propData="ObjectListParam" @change="onChangeObject"></object-list>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row :gutter="72">
                                <el-col :span="9">
                                    <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item class="kp-form-field-label" label="Entity List" prop="entity_list">
                                            <entity-tag-list clearable :propData="ObjectListParam" @change="onChangeEntities"></entity-tag-list>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="Service Configuration">
                    <el-row>
                        <el-col>
                            <el-row :gutter="72">
                                <el-col :span="8">
                                    <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item class="kp-form-field-label" prop="request_type" label="Request Type">
                                            <el-radio v-for="requestType in requestTypeList" :key="requestType" :label="requestType" v-model="service.request_type"></el-radio>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row :gutter="72">
                                <el-col :span="9">
                                    <div class="kp-form-input-1 kp-form-field" v-if="service.action">
                                        <el-form-item class="kp-form-field-label" prop="action" label="Action Type">
                                            <el-select clearable v-model="service.action" placeholder="Select">
                                                <el-option v-for="(value,key) in actionList" :key="key" :label="key" :value="value"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="kp-form-input-1 kp-form-field" v-if="service.request_type">
                                        <el-form-item class="kp-form-field-label" label="Result Type" prop="result_type">
                                            <el-input v-model="service.result_type" placeholder="E.g. json"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="kp-form-input-1 kp-form-field" v-if="service.request_type">
                                        <el-form-item class="kp-form-field-label" v-if="service.request_type" label="Result Path" prop="result_path">
                                            <el-input v-model="service.result_path" placeholder="E.g. Value"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row :gutter="72">
                                <el-col :span="8">
                                    <div class="kp-form-input-1 kp-form-field" v-if="isSoapType()">
                                        <el-form-item class="kp-form-field-label" v-if="isSoapType()" label="Content Type" prop="content_type">
                                            <el-input placeholder="E.g. Value" v-model="service.content_type"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="kp-form-input-1 kp-form-field" v-if="isSoapType()">
                                        <el-form-item class="kp-form-field-label" label="Content path" prop="content_path">
                                            <el-input placeholder="E.g. Value" v-model="service.content_path"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row :gutter="72">
                                <el-col :span="24">
                                    <el-form-item class="kp-form-field-label" label="Request Body" prop="request_body"></el-form-item>
                                    <codemirror v-model="service.request_body" :value="service.request_body" :options="editorOptions"></codemirror>
                                </el-col>
                                <el-col :span="24" class="mt-30">
                                    <el-form-item class="kp-form-field-label" label="Response Body" prop="response_body"></el-form-item>
                                    <codemirror v-model="service.response_body" :value="service.response_body" :options="editorOptions"></codemirror>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="Default Condition">
                    <el-row>
                        <el-col>
                            <div v-for="(condition,index) in service.default_conditions" :key="index">
                                <div class="kp-attribute-wrap">
                                    <div class="kp-title">
                                        <el-row>
                                            <el-col :span="15">
                                                <span>Condition {{index+1}}</span>
                                            </el-col>
                                            <el-col :span="4">
                                                <!-- <el-button class="kp-blank-btn el-icon-minus el-button--default"></el-button> -->
                                                <el-button class="kp-blank-btn el-icon-delete el-button--default" v-on:click="removeConditionBlock(index)"></el-button>
                                            </el-col>
                                        </el-row>
                                    </div>
                                    <el-row :gutter="72">
                                        <el-col :span="8">
                                            <div class="kp-form-input-1 kp-form-field">
                                                <el-form-item class="kp-form-field-label" label="Column">
                                                    <el-input v-model="condition.column" placeholder="column name"></el-input>
                                                </el-form-item>
                                            </div>
                                            <div class="kp-form-input-1 kp-form-field">
                                                <el-form-item class="kp-form-field-label" label="Value">
                                                    <el-input v-model="condition.value" placeholder="column value"></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                        <el-col :span="8">
                                            <div class="kp-form-input-1 kp-form-field">
                                                <el-form-item class="kp-form-field-label" label="Operator">
                                                    <el-input v-model="condition.operator" placeholder="operator"></el-input>
                                                </el-form-item>
                                            </div>

                                            <div class="kp-form-input-1 kp-form-field">
                                                <el-form-item class="kp-form-field-label" label="Type">
                                                    <el-select clearable v-model="condition.type" placeholder="Select">
                                                        <el-option v-for="(value,key) in defaultConditionTypeList" :key="key" :label="key" :value="value"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                    <el-button class="kp-btn-primary" type="primary" v-on:click="addConditionBlock()">
                        <i class="el-icon-plus"></i> Add Condition
                    </el-button>
                </el-tab-pane>

                <el-tab-pane label="Display List">
                    <el-row>
                        <el-col>
                            <div v-for="(attribute,index) in service.display_list" :key="index">
                                <div class="kp-attribute-wrap">
                                    <div class="kp-title">
                                        <el-row :gutter="72">
                                            <el-col :span="15">
                                                <span>Attribute {{index+1}}</span>
                                            </el-col>
                                            <el-col :span="4">
                                                <!-- <el-button class="kp-blank-btn el-icon-minus el-button--default"></el-button> -->
                                                <el-button class="kp-blank-btn el-icon-delete el-button--default" v-on:click="removeAttributeBlock(index)"></el-button>
                                            </el-col>
                                        </el-row>
                                    </div>

                                    <el-row :gutter="72">
                                        <el-col :span="8">
                                            <div class="kp-form-input-1 kp-form-field">
                                                <el-form-item class="kp-form-field-label" label="Attribute Name">
                                                    <el-input v-model="attribute.NAME" placeholder="Attribute Name"></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                        <el-col :span="8">
                                            <div class="kp-form-input-1 kp-form-field">
                                                <el-form-item class="kp-form-field-label" label="Attribute value">
                                                    <el-input v-model="attribute.VALUE" placeholder="Attribute value"></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="72">
                                        <el-col :span="8">
                                            <div class="kp-form-input-1 kp-form-field">
                                                <el-form-item class="kp-form-field-label" label="Attribute Type">
                                                    <el-select clearable v-model="attribute.attribute_type" placeholder="Select">
                                                        <el-option v-for="(value,key) in attributeTypeList" :key="key" :label="key" :value="value"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="72">
                                        <el-col :span="16">
                                            <div class="kp-form-input-1 kp-form-field">
                                                <el-form-item class="kp-form-field-label" label="Link" prop="request_header"></el-form-item>
                                                <codemirror v-model="service.request_header" :value="service.request_header" :options="editorOptions">
                                                </codemirror>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                    <el-button class="kp-btn-primary" type="primary" v-on:click="addAttributeBlock()">
                        <i class="el-icon-plus"></i> Add Attribute
                    </el-button>
                </el-tab-pane>

                <el-tab-pane label="Header">
                    <el-row>
                        <el-col>
                            <el-row :gutter="72">
                                <el-col :span="20">
                                    <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item class="kp-form-field-label" label="Request Header" prop="request_header"></el-form-item>
                                        <codemirror v-model="service.request_header" :value="service.request_header" :options="editorOptions"></codemirror>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <!-- <div class="text-muted">Current Tab: {{ tabIndex }}</div> -->
            </el-tabs>
        </div>

    </el-form>
    <el-button class="kp-btn-form-outline" id="btPrev" @click="prevButton">Previous</el-button>
    <el-button class="kp-btn-form-outline" id="btNext" @click="nextButton">Next</el-button>

    <el-button class="kp-btn-form-primary" v-on:click.once="save" :key="buttonKey" type="primary">
        Save</el-button>
    <el-button v-on:click="displayList" class="kp-btn-form-outline">Cancel</el-button>
    <div v-if="!isFormValid" class="kp-form-error">
        * Please check field with errors
    </div>

</el-main>
</template>

<script>
import _ from "lodash";
import constants from "@/resources/Constants";
import Json from "@/util/Json";
import serviceConfig from "@/services/ServiceConfigService";
import Codemirror from "@/components/Codemirror";
import SystemService from "@/services/SystemService";
import DialogFlowService from "@/dialogflow/services/DialogFlowService";
import ObjectList from "@/components/ObjectList";
import EntityTagList from "@/components/EntityTagList";
import EventBus from "@/EventBus";
import Validator from "@/services/Validator";
import { isNullOrUndefined } from "util";
import ConfirmModel from "@/components/ConfirmModel";

export default {
  name: "ServiceConfigFrom",
  components: {
    Codemirror,
    ObjectList,
    EntityTagList,
    ConfirmModel
  },
  data() {
    return {
      requiredParam: {},
      pageTitle: "New service",
      editorOptions: {
        mode: "text/javascript",
        theme: "default"
      },
      service: {},
      cacheDataModal: {
        cachedForm: {},
        isFormEdited: false,
        isEditForm: false,
        isNewForm: false
      },
      buttonKey: 1,
      tabIndex: 0,
      isSaveData:false,
      terms: false,
      isFormValid: true,
      masterSystemList: [],
      labelPosition: "top",
      domainList: [],
      requestTypeList: [],
      attributeTypeList: constants.attribute_type,
      actionList: {
        Get: "GET",
        Put: "PUT",
        Post: "POST",
        Patch: "PATCH",
        Delete: "DELETE"
      },
      defaultConditionTypeList: {
        Literal: "WITHOUT_QUOTE"
      },
      validationRules: this.setValidationRules(),
      ObjectListParam: {}
    };
  },
  watch: {
    service: {
      handler(newVal, oldVal) {
        if (!this.isSaveData && (this.cacheDataModal.isNewForm || this.cacheDataModal.isEditForm)) {
          if (_.isEmpty(this.cacheDataModal.cachedForm)) {
            this.cacheDataModal.isFormEdited = false;
            this.cacheDataModal.cachedForm = { ...this.service };
            this.cacheDataModal.cachedForm.system_domain = `${
              this.cacheDataModal.cachedForm.domain
            }-${this.cacheDataModal.cachedForm.system_name}`;
          } else {
            this.cacheDataModal.isFormEdited = !(
              JSON.stringify(this.cacheDataModal.cachedForm) ===
              JSON.stringify(this.service)
            );
          }
        }
      },
      deep: true
    }
  },
  methods: {
    async init() {
      this.service = {
        default_conditions: [{}],
        display_list: [{}]
      };
      const serviceId = this.getServiceIdFromUrl();
      if (serviceId) {
        let service = await serviceConfig.fetchById(serviceId).catch(error => {
          this.notifyError("Error while fetching service data");
        });
        this.service =
          (service && _.defaultsDeep(service, this.service)) || this.service;
        // this.service.default_conditions= this.service.default_conditions
        // this.service.display_list= this.service.display_list
        // if(!service.system_name){
        //   let masterSystemRec = await SystemService.fetchMasterSystemById(service.master_system_id).catch(error => {
        //     this.notifyError("Error while fetching service data");
        //   });
        //   this.service.system_name = masterSystemRec.system_name
        // }
        this.pageTitle = (service && `Edit service`) || this.pageTitle;
        this.ObjectListParam.object = this.service.object_type;
        this.ObjectListParam.entities = this.service.entity_list;
        this.ObjectListParam.system_name = `${this.service.domain}-${
          this.service.system_name
        }`;
        EventBus.$emit("ASSIGN_OBJECT", this.ObjectListParam);
        EventBus.$emit("ASSIGN_ENTITIES", this.ObjectListParam);
        this.cacheDataModal.isEditForm = true;
      } else {
        this.cacheDataModal.isNewForm = true;
        this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = { ...this.form };
      }
    },
    onChangeObject(object) {
      this.service.object_type = object;
    },
    onChangeEntities(entities) {
      this.service.entity_list = entities;
    },
    setDefaultValues() {
      this.service.request_type = constants.SERVICE_CONFIG_REQUEST_TYPE_REST;
    },
    getServiceIdFromUrl() {
      return this.$route.query.id || "";
    },
    addConditionBlock() {
      this.service.default_conditions.push({});
    },
    addAttributeBlock() {
      this.service.display_list.push({});
    },
    removeAttributeBlock(index) {
      this.service.display_list.splice(index, 1);
    },
    removeConditionBlock(index) {
      this.service.default_conditions.splice(index, 1);
    },
    isSoapType() {
      return constants.SERVICE_CONFIG_REQUEST_TYPE_SOAP ===
        this.service.request_type
        ? true
        : false;
    },
    onSystemChange(system) {
      this.service.master_system_id = system._id;
      this.service.system_name = system.system_name;
      this.service.system_domain = `${this.service.domain}-${
        system.system_name
      }`;
      this.ObjectListParam.system_name = this.service.system_domain;
      EventBus.$emit("ASSIGN_OBJECT", this.ObjectListParam);
      EventBus.$emit("ASSIGN_ENTITIES", this.ObjectListParam);
    },
    onDomainChange(domain) {
      this.service.domain = domain;
      this.service.system_domain = `${domain}-${this.service.system_name}`;
      this.ObjectListParam.system_name = this.service.system_domain;
      EventBus.$emit("ASSIGN_OBJECT", this.ObjectListParam);
      EventBus.$emit("ASSIGN_ENTITIES", this.ObjectListParam);
    },
    async save() {
      this.cacheDataModal.isFormEdited = false;
      let isValid = await this.$refs.ruleForm.validate().catch(error => {});
      this.isFormValid = isValid;
      this.isSaveData = true;
      isValid && this.beforeSave();
      let service =
        isValid &&
        (await serviceConfig.save(this.service).catch(error => {
          this.isFormValid = false;
          this.notifyError("Error while saving service data!!");
        }));
      if (service) {
        this.service._id = service._id; // add service id after first request to existing service object to avoid duplicate service entries
        this.notifySuccess("Service saved successfully!!");
        this.$router.push({
          path: "/service-config-list"
        });

        this.$router.push({
          path: "/service-config-list"
        });
      }
      this.buttonKey++;
    },

    beforeSave() {
      this.service.entity_list = _.isEmpty(this.service.entity_list)
        ? []
        : this.service.entity_list;
      this.service.display_list
        ? _.isEmpty(this.service.display_list[0]) &&
          delete this.service.display_list
        : "";
      this.service.default_conditions
        ? _.isEmpty(this.service.default_conditions[0]) &&
          delete this.service.default_conditions
        : "";
    },

    prevButton() {
      var bt = document.getElementById("btPrev");
      if (this.tabIndex == 0) {
        bt.setAttribute("disabled", true);
        bt.classList.add("kp-btn-form-disabled");
        return;
      }
      this.tabIndex--;

      if (this.tabIndex >= 0) {
        bt.removeAttribute("disabled");
        bt.classList.add("kp-btn-form-outline");
        document.getElementById("tab-" + this.tabIndex).click();
        var nextBtn = document.getElementById("btNext");
        nextBtn.removeAttribute("disabled");
      } else {
        bt.setAttribute("disabled", true);
        bt.classList.add("kp-btn-form-disabled");
      }
    },

    nextButton() {
      var index = this.tabIndex;
      var bt = document.getElementById("btNext");
      index++;
      if (document.getElementById("tab-" + index) == null) {
        bt.setAttribute("disabled", true);
        bt.classList.add("kp-btn-form-disabled");
        return;
      }
      this.tabIndex++;

      if (document.getElementById("tab-" + this.tabIndex) != null) {
        bt.removeAttribute("disabled");
        bt.classList.add("kp-btn-form-outline");
        document.getElementById("tab-" + this.tabIndex).click();
        var preBtn = document.getElementById("btPrev");

        preBtn.removeAttribute("disabled");
      } else {
        bt.setAttribute("disabled", true);
        bt.classList.add("kp-btn-form-disabled");
      }
    },

    displayList() {
      this.$router.push({
        path: "/service-config-list"
      });
    },
    setValidationRules() {
      return {
        system_name: [
          {
            required: true,
            message: "Please input system name",
            trigger: "change"
          }
        ],
        service_name: [
          {
            required: true,
            message: "Please input service name",
            trigger: "change"
          }
        ],
        endpoints: [
          {
            required: false,
            message: "Please enter endpoint",
            trigger: "change"
          }
        ],
        request_type: [
          {
            required: true,
            message: "Please enter request type",
            trigger: "change"
          }
        ],
        table_name: [
          {
            required: true,
            message: "Please enter object type",
            trigger: "change"
          }
        ],
        action: [
          {
            required: true,
            message: "Please enter action",
            trigger: "change"
          }
        ],
        action_name: [
          {
            required: true,
            message: "Please enter action name",
            trigger: "change"
          }
        ],
        result_type: [
          {
            required: true,
            message: "Please enter result name",
            trigger: "change"
          }
        ],
        request_body: [
          {
            required: true,
            validator: Validator.scriptValidator,
            // message: "Please input request body",
            trigger: "change"
          }
        ],
        response_body: [
          {
            required: true,
            validator: Validator.scriptValidator,
            // message: "Please input response body",
            trigger: "change"
          }
        ],
        system_name: [
          {
            required: true,
            message: "Please select system",
            trigger: "change"
          }
        ],
        domain: [
          {
            required: true,
            message: "Please select domain",
            trigger: "change"
          }
        ],
        request_header: [
          {
            validator: this.validateRequestHeader,
            trigger: "change"
          }
        ]
      };
    },
    validateRequestHeader(rule, value, callback) {
      if (_.isEmpty(value)) {
        callback();
      }
      Json.isJson(value)
        ? callback()
        : callback(new Error("Please input correct JSON format!!"));
    },

    async fetchMasterSystems() {
      this.masterSystemList = await SystemService.fetchMasterSystems().catch(
        error => {
          this.notifyError("Error while fetching systems");
        }
      );
      this.domainList = await DialogFlowService.fetchDomains().catch(error => {
        this.notifyError("Error while fetching domains");
      });

      // this.masterSystemList = this.masterSystemList.reduce((unique,o)=>{
      // 	if(!unique.some(obj=>obj.master_system_id === o.master_system_id)){
      // 		unique.push(o);
      // 	}
      // 	return unique;
      // },[]);
    }
  },

  beforeMount() {
    let user = this.$store.getters.user;
    if (user.roles.includes("admin")) {
      this.showList = true;
    }
    this.init();
     window.addEventListener("beforeunload", event => {
      if (!this.cacheDataModal.isFormEdited) return;
      event.preventDefault();
      event.returnValue = "";
    });
    this.fetchMasterSystems();

    this.requestTypeList = [
      constants.SERVICE_CONFIG_REQUEST_TYPE_REST,
      constants.SERVICE_CONFIG_REQUEST_TYPE_SOAP
    ];
   
  },
  beforeRouteLeave: function(to, from, next) {
    if (this.cacheDataModal.isFormEdited) {
      //    return window.confirm('Do you really want to leave? you have unsaved changes!')
      return this.$refs.model.open(next);
    } else {
      return next();
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";

.el-button--small {
  padding: 6px 10px;
  font-size: 20px;
  border-radius: 3px;
}

.el-form-item__error {
  position: unset;
}

.kp-attribute-wrap {
  .kp-title {
    background: #fafafa;
    border-top: 0.5px solid rgba(196, 196, 196, 0.5);
    border-bottom: 0.5px solid rgba(196, 196, 196, 0.5);
    margin-bottom: 16px;
    span {
      font-weight: 700;
      font-size: 14px;
      display: inline-block;
      padding: 10px;
    }
    button {
      display: inline-block;
      padding: 12px 8px;
      margin: 0;
    }
  }
  .tagname-container {
    border: 1.5px solid #d8dbe6;
    width: 60%;
    padding: 20px;
    border-radius: 7px;
    .codemirror-wrap {
      .kp-full-indicator {
        font-size: 11px;
        position: absolute;
        right: 0;
        right: 0;
        top: 5px;
        color: #868686;
      }
    }

    .codemirror-container {
      margin: 0;
    }
  }
}
.kp-form-field {
  margin-bottom: 22px;
  input,
  select {
    background: #f5f6fa;
  }
}
.kp-form-field-label {
  position: relative;
  color: #77787b;
  font-size: 14px;
  margin-bottom: 8px;
}
.kp-command-title {
  font-weight: 700;
  color: #212121;
  clear: both;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    height: 0.5px;
    width: 77%;
    top: 9px;
    left: 110px;
    background: #a8a8a8;
  }
  .el-icon-delete {
    float: right;
    padding: 7px;
    margin-top: -5px;
  }
}
</style>
