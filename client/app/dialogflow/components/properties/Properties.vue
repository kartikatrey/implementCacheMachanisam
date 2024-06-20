<template>
<div class="properties-container">
    <PropertiesHeader :title="'Workflow Properties'" />
    <div class="content-body">
         <el-tabs  >
             <el-tab-pane  label="General" name="general">
                <el-form :model="form" ref="form" label-width="90px" :rules="validationRules">
                    <div class="without-tabs-container">
                        <el-form-item class="inline-label-item" label="Type" prop="workflow_type">
                            <el-select v-model="form.workflow_type" cid="wf-properties-form-wf-type-select" @change="onworkflowTypeChange" placeholder="Select workflow type" :disabled="isEditMode">
                                <el-option v-for="(workflowType, index) in workflowTypeList" :cid="'wf-properties-form-wf_' + index" :label="workflowType.label" :value="workflowType.value" :key="workflowType.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="inline-label-item" label="Name" prop="name">
                            <el-input v-model="form.name" placeholder="Enter name" cid="wf-properties-form-name"></el-input>
                        </el-form-item>     
                        <el-form-item class="inline-label-item" label="Version" prop="workflow_version">
                            <el-input :readonly=true v-model="form.workflow_version" cid="wf-properties-form-name"></el-input>
                        </el-form-item>     
                <!-- :disabled="!isWorkflowTypeSelected" -->

                <!-- <el-form-item
            v-if="showDocumentType"
            class="inline-label-item"
            prop="document_type"
            label="Document type"
          >
            <el-select
              cid="wf-properties-form-doc-type-select"
              name="document_type"
              clearable
              filterable
              v-model="form.document_type"
              placeholder="Select"
            >
              <el-option
                v-for="(value, index) in document_types"
                :cid="'wf-properties-form-doc-type_' + index"
                :key="value.value"
                :value="value.value"
                :label="value.label"
              ></el-option>
            </el-select>
          </el-form-item> -->

                <!-- <el-form-item
            v-if="showDomainAndSystem"
            class="inline-label-item"
            label="Domain"
            prop="domain"
          >
            <el-select
              v-model="form.domain"
              @change="onDomainChange"
              placeholder="Select Domain"
              cid="wf-properties-form-domain-select"
              :disabled="!isWorkflowTypeSelected"
            >
              <el-option
                v-for="(domain, index) in domainList"
                :cid="'wf-properties-form-domain_' + index"
                :label="domain.name"
                :value="domain.name"
                :key="domain.name"
              ></el-option>
            </el-select>
          </el-form-item> -->
                <!-- <el-form-item
            class="inline-label-item"
            label="System"
            prop="system_name"
          >
            <el-select
              @change="onSystemChange"
              placeholder="Select System"
              v-model="form.system_name"
              cid="wf-properties-form-systems-select"
              :disabled="!isWorkflowTypeSelected"
            >
              <el-option
                v-for="(system, index) in systemList"
                :cid="'wf-properties-form-systems_' + index"
                :value="system"
                :key="system._id"
                :label="system.system_name"
              ></el-option>
            </el-select>
          </el-form-item> -->
                <!-- 
          <el-form-item
            v-if="showIntentFields"
            class="inline-label-item"
            label="Object"
          >
            <object-list
              cid="wf-properties-form-objects"
              :propData="ObjectListParam"
              @change="onChangeObject"
              :disabled="!isWorkflowTypeSelected"
            ></object-list>
          </el-form-item>
          <el-form-item
            v-if="showIntentFields"
            class="inline-label-item"
            label="Action"
            prop="action"
          >
            <el-select
              v-model="form.action"
              @change="onActionChange"
              cid="wf-properties-form-action-select"
              placeholder="Select Action"
              :disabled="!isWorkflowTypeSelected"
            >
              <el-option
                v-for="(action, index) in actionList"
                :cid="'wf-properties-form-action_' + index"
                :label="action.label"
                :value="action.value"
                :key="action.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="showIntentFields"
            class="inline-label-item"
            label="Entities"
            prop="entities"
          >
            <entity-tag-list
              :propData="ObjectListParam"
              @change="onChangeEntities"
              :disabled="!isWorkflowTypeSelected"
            ></entity-tag-list>
          </el-form-item>
          <el-form-item
            v-if="showIntentFields"
            class="inline-label-item"
            label="Error message"
            prop="error_message"
          >
            <el-input
              v-model="form.error_message"
              placeholder="Enter error message"
              cid="wf-properties-form-error-message"
              v-on:blur="onErrorMessageChange($event.target.value)"
              :disabled="!isWorkflowTypeSelected"
            ></el-input>
          </el-form-item> -->
            </div>
        </el-form>
         </el-tab-pane>
        <el-tab-pane label="Workflow version" name="Bucket_version">
            <VersionRelatedList v-if="showVersionList" :id="dialogFlowData._id"  title=""></VersionRelatedList>
        </el-tab-pane>     
        </el-tabs>
    </div>
    <PropertiesFooter :form.sync="form" :dialogFlowData="dialogFlowData" :formRef="$refs" :loading.sync="loading" :type="'Begin'" />
</div>
</template>

<script>
import EventBus from "@/EventBus";
import EntityService from "@/services/EntityService";
import _ from "lodash";
import SystemService from "@/services/SystemService";
import ObjectList from "../../../components/ObjectList";
import EntityTagList from "../../../components/EntityTagList";
import Constants from "@/resources/Constants";
import CustomerConfig from "@/idp/services/DeCustomerConfig";
import PropertiesHeader from "@/dialogflow/components/properties/PropertiesHeader.vue";
import PropertiesFooter from "@/dialogflow/components/properties/PropertiesFooter.vue";
import wfDirty from "@/mixins/wfDirty.js";
import Validator from "@/services/Validator";
import VersionRelatedList from "../../../idp/components/VersionRelatedList.vue";
export default {
    name: "Properties",
    mixins: [wfDirty],
    props: ["dialogFlowData", "workflowType"],
    components: {
        ObjectList,
        EntityTagList,
        PropertiesHeader,
        PropertiesFooter,
        VersionRelatedList
    },
    computed: {
        workflowTypeList() {
            let typeList = [];
            let user = this.$store.getters.user;
            const isIdpUser = this.isIdpUser(user);
            if (isIdpUser)
                typeList.push(
                    _.find(Constants.WORKFLOW.TYPESLIST, {
                        value: Constants.WORKFLOW.TYPE.DOCEX,
                    })
                );
            if (_.includes(user.roles, "qna"))
                typeList.push(
                    _.find(Constants.WORKFLOW.TYPESLIST, {
                        value: Constants.WORKFLOW.TYPE.QNA,
                    })
                );
            if (_.includes(user.roles, "customer") || _.includes(user.roles, "admin"))
                typeList.push(
                    _.find(Constants.WORKFLOW.TYPESLIST, {
                        value: Constants.WORKFLOW.TYPE.DA,
                    })
                );
            return typeList;
        }
    },
    data() {
        return {
            showVersionList:true,
            loading: false,
            isEditMode: false,
            domainList: [],
            objectList: [],
            actionList: [],
            systemList: [],
            entityList: [],
            document_types: [],
            form: {
                workflow_type: "docex",
                name: "",
                workflow_version: ""
            },
            ObjectListParam: {
                multiple: true,
            },
            validationRules: this.setValidationRules(),
            isWorkflowTypeSelected: false,
            showDomainAndSystem: true,
            showDocumentType: false,
            showIntentFields: true,
        };
    },
    methods: {
        async getDocumentType() {
            let docTypeConfig = await CustomerConfig.getAllDocsCustConfiguration({document_type: {$exists: true }});
            this.document_types = CustomerConfig.getDocumentTypeList(docTypeConfig);
        },
        async onworkflowTypeChange(workflowType) {
            if (workflowType) {
                this.form.workflow_type = workflowType;
                this.$router.push({
                    path: "/idp/workflow",
                    query: {
                        workflowType: workflowType
                    },
                });
            }
        },
        async showFieldsBasedOnType(workflowType) {
            if (workflowType === Constants.WORKFLOW.TYPE.DOCEX) {
                this.showDomainAndSystem = false;
                this.showIntentFields = false;
                this.showDocumentType = true;
            } else if (workflowType === Constants.WORKFLOW.TYPE.QNA) {
                this.showDomainAndSystem = false;
                this.showIntentFields = true;
                let systemName = Constants.QNA_CUSTOMER.system;
                let domain = Constants.QNA_CUSTOMER.domain;
                let masterSystem = await SystemService.fetchMasterSystems({
                    system_name: systemName,
                });
                this.setSystemAndDomain(domain, systemName, masterSystem[0]._id);
            } else if (workflowType === Constants.WORKFLOW.TYPE.DA) {
                this.showDomainAndSystem = true;
                this.showIntentFields = true;
            }
            this.$forceUpdate();
        },

        async init() {
            this.form = {
                name: this.dialogFlowData.name,
                workflow_type: this.dialogFlowData.workflow_type,
                workflow_version: this.dialogFlowData.workflow_version,
            };

            this.$nextTick(() => {
                this.clonedForm = JSON.parse(JSON.stringify(this.form))
            })

            // this.getDocumentType();
            // if (this.dialogFlowData._id) {
            //   this.form = _.clone(this.dialogFlowData);
            //   this.isEditMode = true;
            //   this.form.workflow_type = this.dialogFlowData.workflow_type;
            //   this.isWorkflowTypeSelected = true;
            //   await this.showFieldsBasedOnType(this.workflowType);
            //   this.form.domain = _.split(this.dialogFlowData.domain, "-")[0];
            //   this.ObjectListParam.system_name = this.dialogFlowData.domain;
            //   this.ObjectListParam.object = this.dialogFlowData.object;
            //   this.ObjectListParam.entities = this.dialogFlowData.entities;
            //   EventBus.$emit("ASSIGN_OBJECT", this.ObjectListParam);
            //   EventBus.$emit("ASSIGN_ENTITIES", this.ObjectListParam);
            // } else {
            //   this.form.workflow_type = this.workflowType;
            //   this.isWorkflowTypeSelected = this.workflowType ? true : false;
            //   await this.showFieldsBasedOnType(this.workflowType);
            // }
            // try {
            //   this.systemList = await SystemService.fetchMasterSystems();
            //   this.domainList = await DialogFlowService.fetchDomains();
            //   this.domainList
            //     ? this.domainList
            //     : this.domainList.push({ name: "ERP-INV_DATA_EXTRACTION" });
            //   console.log("domainList !!!:", this.domainList);
            //   this.actionList = DialogFlowService.getActions();
            //   this.registerEvents();
            // } catch (error) {
            //   console.log(error);
            //   this.notifyError("Error while initializing workflow!!");
            // }
        },
        async setSystemAndDomain(domain, systemName, masterSystemId) {
            this.form.system_name = systemName;
            this.form.system_domain = `${domain}-${systemName}`;
            this.ObjectListParam.system_name = this.form.system_domain;
            EventBus.$emit("ASSIGN_OBJECT", this.ObjectListParam);
            EventBus.$emit("ASSIGN_ENTITIES", this.ObjectListParam);
            this.dialogFlowData.domain = this.form.system_domain;
            this.dialogFlowData.master_system_id = masterSystemId;
            this.dialogFlowData.system_name = systemName;
            this.fetchObjects();
            this.fetchEntities();
        },
        onChangeObject(object) {
            this.form.object = object;
            this.dialogFlowData.object = object;
        },
        onChangeEntities(entities) {
            this.form.entities = entities;
            this.dialogFlowData.entities = entities;
        },
        registerEvents() {
            EventBus.$on("VALIDATE_WORKFLOW_PROPERTIES", (dialogFlowData) => {
                if (this.$refs["form"]) {
                    this.$refs["form"].validate((valid) => {
                        if (!valid) {
                            this.dialogFlowData["isValid"] = false;
                            return false;
                        }
                        this.dialogFlowData["isValid"] = true;
                    });
                    return;
                }
                this.dialogFlowData["isValid"] = true;
            });
        },
        setValidationRules() {
            return {
                workflow_type: [{ required: true, message: "Please select workflow type", trigger: "blur" }],
                workflow_version: [{ required: true, message: "Please select workflow version", trigger: "blur" }],
                system_name: [{ required: false, message: "Please select system name", trigger: "blur" }],
                domain: [{ required: false, message: "Please select domain", trigger: "blur" }],
                system_name: [{ required: true, message: "Please select system", trigger: "blur" }],
                object: [{ required: true, message: "Please select object", trigger: "blur" }],
                action: [{ required: true, message: "Please select action", trigger: "blur" }],
                name: [
                    { validator: Validator.EmptyValueValidator, trigger: "blur", message: "Please provide valid name" },
                    { required: true, message: "Please enter workflow name", trigger: "blur" }
                ]
            };
        },
        onNameChange(name) {
            this.form.name = name;
            this.dialogFlowData.name = name;
        },
        onSystemChange(systemObject) {
            let systemName = systemObject.system_name;
            let domain = this.form.domain;
            this.setSystemAndDomain(domain, systemName, systemObject._id);
        },
        onDomainChange(domain) {
            this.form.domain = domain;
            this.form.system_domain = `${domain}-${this.form.system_name}`;
            this.ObjectListParam.system_name = this.form.system_domain;
            EventBus.$emit("ASSIGN_OBJECT", this.ObjectListParam);
            EventBus.$emit("ASSIGN_ENTITIES", this.ObjectListParam);
            this.dialogFlowData.domain = this.form.system_domain;
            this.fetchObjects();
            this.fetchEntities();
        },
        onActionChange(action) {
            this.form.action = action;
            this.dialogFlowData.action = action;
        },
        onObjectChange(object) {
            this.form.object = object;
            this.dialogFlowData.object = object;
            this.fetchEntities();
        },
        onEntityChange() {
            this.dialogFlowData.entities = this.form.entities;
        },
        onErrorMessageChange(errorMessage) {
            this.dialogFlowData.error_message = errorMessage;
        },
        async fetchObjects() {
            if (!this.form.system_domain) return;
            this.objectList = await EntityService.fetchObjectsByDomain(
                this.form.system_domain
            ).catch((error) => {
                this.notifyError("Error while fetching objects!!");
            });
        },
        async fetchEntities() {
            if (!this.form.system_domain) return;
            this.entityList = await EntityService.fetchTagListByDomain(
                this.form.system_domain
            ).catch((error) => {
                this.notifyError("Error while fetching objects!!");
            });
        },
    },
    beforeMount() {
        this.init();
    },
};
</script>

<style lang="scss">
</style>
