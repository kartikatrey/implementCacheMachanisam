<template>
    <el-main class="kp-main">
        <section class="llm-setup-form-body page-body">

            <div class="page-title">
                <el-button cid="form-header-back" v-on:click="onBack" icon="mdi mdi-arrow-left-circle-outline"></el-button>
                <span class="page-title-text">LLM Setup</span>
                <span>Add new LLM Setup</span>
            </div>

            <section class="form-page-container">
                <div class="panel">
                    <div class="panel-body">
                        <el-form label-position="left" :model="form" :rules="formRules" ref="form" label-width="120px">
                            <ConfirmModel ref="model"> </ConfirmModel>

                            <div class="grouping-tile">General configuration</div>

                            <el-row :gutter="40">
                                <!-- LLM Document Type -->
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="document_type" label="Document type">
                                            <el-select cid="llm-form-type" v-model="form.document_type"
                                                placeholder="Please select document type" clearable>
                                                <el-option v-for="(item, index) in documentTypes"
                                                    :cid="'llm-form-document-type' + index" 
                                                    :key="item.value"
                                                    :value="item.value" 
                                                    :label="item.label">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </el-col>

                                <!-- Processor Type -->
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="processor_type" label="Processor Type">
                                            <el-select cid="llm-form-processor-type" v-model="form.processor_type"
                                                placeholder="Please select processor type" filterable clearable>
                                                <el-option v-for="(item, index) in processorTypes"
                                                    :cid="'llm-form-processor-type' + index" 
                                                    :key="item.value"
                                                    :value="item.value" 
                                                    :label="item.label"
                                                    >
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>

                            <el-row :gutter="40">
                                <!-- Replace action -->
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="replace_action" label="Replace action">
                                            <el-select cid="llm-form-replace-action" v-model="form.replace_action"
                                                placeholder="Select" clearable>
                                                <el-option v-for="(item, index) in replaceOptions"
                                                    :cid="'llm-form-replace-action_' + index" 
                                                    :key="item.value"
                                                    :value="item.value" 
                                                    :label="item.label">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <!-- Active flag -->
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="active" label="Active">
                                            <el-checkbox class="active-input" prop="active" v-model="form.active" :checked="form._id === undefined"></el-checkbox>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>

                            <el-row :gutter="40">
                               <!-- LLM prompt name -->
                                <el-col :span="12" v-if="form.processor_type=='llm'">
                                    <div class="kp-form-group">
                                        <el-form-item prop="prompt_name" label="Prompt name">
                                            <el-select cid="llm-form-prompt-name" v-model="form.prompt_name"
                                                placeholder="Please select prompt name" filterable clearable>
                                                <el-option v-for="(item, index) in prompts"
                                                    :cid="'llm-form-prompt-name' + index" 
                                                    :key="item.name"
                                                    :value="item.name" 
                                                    :label="item.label">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>

                            <div class="grouping-divide"></div>
                            <div class="grouping-tile">Additional configuration</div>
                            <el-row :gutter="40">
                                <el-col :span="24">
                                    <div class=" kp-form-group">
                                        <el-form-item id="query-builder" prop="rule" label="Rule">
                                        <QueryBuilder cid="notification-rule-form-rule" @onQueryChange="onQueryChange" :query="form.rule" :documentType="form.document_type" :dataToShow='["fieldsData", "stageData", "stateData", "fileTypeData"]'></QueryBuilder>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>

                        </el-form>
                    </div>
                    <footer>
                        <div>
                        </div>
                        <div>
                            <el-button cid="prompt-form-cancel" size="small" v-on:click="onBack">Cancel</el-button>
                        </div>
                        <div>
                            <el-button size="small" type="primary" cid="propmts-form-submit" :disabled="saveClicked"
                                v-on:click="save">
                                Save
                            </el-button>
                        </div>
                    </footer>
                </div>

            </section>

        </section>

        <!-- Previous version -->
      <VersionRelatedList :id="form._id !== undefined"  title="LLM Type versions"></VersionRelatedList>
    </el-main>
</template>
    
<script>
const _ = require("lodash");
import constants from "@/resources/Constants";
import Validator from "@/services/Validator";
import ConfirmModel from "@/components/ConfirmModel";
import LLMService from "@/idp/services/LLMService";
import FieldService from "@/idp/services/FieldService";
import PromptService from "@/idp/services/PromptService";
import QueryBuilder from "@/idp/pages/QueryBuilder.vue";
import DeCustomerConfig from "@/idp/services/DeCustomerConfig";
import VersionRelatedList from "@/idp/components/VersionRelatedList.vue";

export default {
    name: "LLMSetupForm",
    components: {
        VersionRelatedList,
        ConfirmModel,
        QueryBuilder
    },
    data() {
        return {
            saveClicked: false,
            documentTypes: [],
            prompts : {},
            fields : [],
            processorTypes: constants.DOCEX.PROCESSOR_TYPES,
            form: {
                document_type: "",
                prompt_name: "",
                replace_action: "",
                active: "",
                processor_type: "",
                rule: {
                    logicalOperator: "all",
                    children: []
                }
            },
            replaceOptions : [
                {
                    label : "Merge Header & Table Fields",
                    value : "merge_ht_fields",
                },
                {
                    label : "Merge Header Fields",
                    value : "merge_h_fields",
                },
                {
                    label : "Merge Table Fields",
                    value : "merge_t_fields",
                },
                {
                    label : "Replace Header & Table fields",
                    value : "replace_ht_fields",
                },
                {
                    label : "Replace Header fields",
                    value : "replace_h_fields",
                },
                {
                    label : "Replace Table fields",
                    value : "replace_t_fields",
                },
                {
                    label : "Merge Header & Replace Table",
                    value : "merge_h_and_replace_t",
                },
                {
                    label : "Replace Header & Merge Table",
                    value : "replace_h_and_merge_t",
                }
            ],
            cacheDataModal: {
                cachedForm: {},
                isFormEdited: false,
                isInitialized: false,
            },
            formRules: {
                document_type: [
                    {
                        required: true,
                        message: "Please select document type.",
                        trigger: "blur"
                    }
                ],
                prompt_name: [
                    {
                        required: true,
                        message: "Please select prompt name."
                    }
                ],
                replace_action: [
                    {
                        required: true,
                        message: "Please select replace action.",
                        trigger: "blur",
                    },
                ],
                processor_type: [
                    {
                        required: true,
                        message: "Please select processor type.",
                        trigger: "blur",
                    },
                ],
                rule: [
                    {
                        validator: Validator.QueryBuilderValidator,
                        trigger: "blur"
                    }
                ],
            }
        };
    },
    watch: {
        form: {
            handler(newVal, oldVal) {
                if (this.cacheDataModal.isInitialized) {
                    this.cacheDataModal.isFormEdited = (!_.isEqual(this.cacheDataModal.cachedForm, this.form));
                }
            },
            deep: true,
        },
        'form.document_type': {
            handler(newVal, oldVal){
                if(newVal !== oldVal){
                    this.$nextTick(async () => {
                        await this.getFieldsByDocType();
                    })
                }
            },
            deep : true
        }
    },
    async beforeMount() {
        this.$store.commit("setDisplayIdpTree", false);
        this.$store.commit("setDisplayIdpNavbar", true);

        let recordId = this.$route.query.id;
        const cloneLLMForm = this.$route.query.clone;
        await this.init(recordId, cloneLLMForm);

    },
    methods: {
        cloneLLMRecord(LLMRecord) {
            const clonedLLM = { ...LLMRecord };
            const propertiesToRemove = [
                "_id",
                "created_at",
                "created_by",
                "updated_at",
                "updated_by",
                "updatedAt",
                "createdAt",
            ];
            propertiesToRemove.forEach(property => {
                if (clonedLLM.hasOwnProperty(property)) {
                    delete clonedLLM[property];
                }
            });

            return clonedLLM;
        },

        onQueryChange(input){
            this.form.rule = input.val;
        },

        async init(recordId, cloneLLMForm) {
            try {
                const promises = [
                    DeCustomerConfig.getAllDocsCustConfiguration(),
                    PromptService.getAllPrompts({ active: true, type: "image" }, ["name", "label"])
                ];

                // If recordId is present, add the LLM record promise
                if (recordId) {
                    promises.push(LLMService.getLLMRecordById(recordId));
                }

                // Execute all promises concurrently
                const results = await Promise.all(promises);

                if(!results.length){
                    this.notifyError("Error while getting records.");
                    return;
                }

                // Assign results to respective properties
                this.documentTypes = DeCustomerConfig.getDocumentTypeList(results[0]);
                this.prompts = results[1];

                // Check if recordId is present and LLM record is fetched successfully
                if (recordId && results.length === 3) {
                    let LLMRecord = results[2];

                    if (cloneLLMForm == "true") {
                        LLMRecord = this.cloneLLMRecord(LLMRecord);
                    }
                    // Update the form with LLM record data
                    this.form = LLMRecord;

                    if (!this.form.rule) {
                        this.form.rule = { logicalOperator: "all", children: [] };
                    }

                    if (!LLMRecord) {
                        this.notifyError("Error while getting LLM record.");
                    }
                }
            } catch (error) {
                console.error(error);
                this.notifyError("Error while getting LLM record.");
            }
        },
        async save() {
            this.saveClicked = true;
            let valid = await this.$refs.form.validate().catch((error) => { });
            if (!valid) {
                this.saveClicked = false
                return;
            }

            try {
                const response = await LLMService.upsertLLMRecrod(this.form);
                if (response) {
                    this.cacheDataModal.isFormEdited = false;
                    this.notifySuccess("LLM record saved successfully");
                    this.$router.push({
                        path: "/idp/llm-setup-list",
                    });
                } else {
                    this.isFormValid = false;
                    this.notifyError("Error while saving LLM record.");
                }
            } catch (error) {
                console.error(error);
                this.notifyError("Error while saving LLM record.");
            }
        },
        async getFieldsByDocType(){
            if(this.form.document_type === "") { return; }
            this.fields = [];
            const projection = [ "name", "label" ];
            const filter = { document_type : this.form.document_type, active : true };
            const fieldResponse = await FieldService.getFieldsList(filter, projection);
            this.fields = fieldResponse;
        },
        onBack() {
            this.$router.push("/idp/llm-setup-list");
        },
    },
};
</script>
    