<template>
    <div class="properties-container" v-loading="loading">

        <!-- Header Properties -->
        <PropertiesHeader :currentNode="currentNode" :dialogFlowData="dialogFlowData" />

        <div class="content-body">
            <el-form class="content-body" :model="form" ref="form" :rules="formRules" label-width="110px">
                <div class="without-tabs-container">

                    <!-- Component Name -->
                    <el-form-item class="inline-label-item" label="Component Name" prop="component_name">
                        <el-input v-model="form.component_name" placeholder="Enter component name"></el-input>
                    </el-form-item>

                    <!-- Model Type Dropdown -->
                    <el-form-item class="inline-label-item" label="Model type" prop="model_type">
                        <el-select clearable v-model="form.model_type" placeholder="Select model type"
                            v-on:change="onDocTypeChange">
                            <el-option v-for="documentType in documentTypeList" :label="documentType.label"
                                :value="documentType.value" :key="documentType.value"></el-option>
                        </el-select>
                    </el-form-item>

                    <!-- Select Model Dropdown -->
                    <el-form-item class="inline-label-item" label="Select Model" prop="selected_model_name">
                        <el-select name="selected_model_name" v-model="form.selected_model_name"
                            placeholder="Select model" v-on:change="onModelSelectionChange">
                            <el-option v-for="selectedModel in selectedModels" :label="selectedModel.model_name"
                                :value="selectedModel.model_name" :key="selectedModel.model_name"></el-option>
                        </el-select>
                    </el-form-item>

                    <!-- Pre Processing Script -->
                    <el-form-item class="inline-label-item codemirror-item-container" prop="pre_processing_script">
                        <label class="label-name">Pre script</label>
                        <codemirror v-model="form.pre_processing_script"></codemirror>
                    </el-form-item>

                    <!-- Post Processing Script -->
                    <el-form-item class="inline-label-item codemirror-item-container" prop="post_processing_script">
                        <label class="label-name">Post script</label>
                        <codemirror v-model="form.post_processing_script"></codemirror>
                    </el-form-item>

                </div>
            </el-form>
        </div>

        <!-- Footer Properties -->
        <PropertiesFooter :currentNode="currentNode" :form.sync="form" :dialogFlowData="dialogFlowData" :formRef="$refs" />

    </div>
</template>

<script>
import _ from "lodash";
import Codemirror from "@/components/Codemirror.vue";
import Validator from "@/services/Validator";
import PropertiesFooter from "./PropertiesFooter.vue";
import wfDirty from "@/mixins/wfDirty.js";
import Constants from "@/resources/Constants";
import KsModelService from "@/idp/services/KsModelService";
import documentConfigService from "@/idp/services/DeCustomerConfig";
import PropertiesHeader from "@/dialogflow/components/properties/PropertiesHeader.vue";

export default {
    name: "CognitiveExtraction",
    props: ["dialogFlowData", "currentNode"],
    components: {
        PropertiesFooter,
        Codemirror,
        PropertiesHeader,
    },
    mixins: [wfDirty],
    data() {
        return {
            clonedForm: {},
            documentTypeList: [],
            extractionModels: [],
            selectedModels: [],
            formRules: {
                model_type: [
                    {
                        validator: Validator.EmptyValueValidator,
                        trigger: "blur",
                        message: "Please provide model type",
                    },
                    {
                        required: true,
                        message: "Please provide model type",
                        trigger: "blur",
                    },
                ],
                selected_model: [
                    {
                        validator: Validator.EmptyValueValidator,
                        trigger: "blur",
                        message: "Please select model",
                    },
                    {
                        required: true,
                        message: "Please select model",
                        trigger: "blur",
                    },
                ]
            },
            form: {
                selected_model_name: "",
                selected_model_id: "",
                is_system_model: "",
                component_name: "",
                pre_processing_script: Constants.WORKFLOW.PRE_SCRIPT.EXTRACTION || "",
                post_processing_script: Constants.WORKFLOW.POST_SCRIPT.EXTRACTION || "",
                model_type: ""
            }
        };
    },
    methods: {
        // Calling this method on document type change from dropdown
        onDocTypeChange() {
            this.selectedModels = []
            const documentType = this.form.model_type

            // Setting selected_model_name as blank on model change
            this.$set(this.form, 'selected_model_name', "")
            if (!documentType) { return }

            // Storing models in selectedModels which includes document type in subtype
            for (const extractionModel of this.extractionModels) {
                const subtype = extractionModel.subtype || ""
                const modelSubtype = subtype.toLowerCase()
                if (modelSubtype && modelSubtype.includes(documentType)) {
                    this.selectedModels.push(extractionModel)
                }
            }
        },

        // Calling this method on model selection change from dropdown
        onModelSelectionChange() {
            // In case of system model selection set is_system_model key as true
            const selectedModel = this.selectedModels.filter((model) => model.model_name == this.form.selected_model_name)

            // Accessing 0th index model as we are getting model object in an array 
            if ("is_system_model" in selectedModel[0]) {
                this.form.is_system_model = true
            } else {
                this.form.is_system_model = false
            }

            // Set model id in selected_model_id key
            this.form.selected_model_id = selectedModel[0]["_id"]
        },

        async getDocTypeList() {
            // Fetching document types from de customer configurations table
            const filter = {};
            const projection = ["document_type"];
            const customerConfigs = await documentConfigService.getAllDocsCustConfiguration(filter, projection);

            // Transforming document types into label and value
            let documentTypeList = documentConfigService.getDocumentTypeList(customerConfigs);

            // Capitalizing first char of each word of document type using lodash startCase()
            // Ex. - _.startCase("sales order") --> Sales Order
            this.documentTypeList = documentTypeList.map((documentType) => {
                documentType.label = _.startCase(documentType.label);
                return documentType;
            })

            // Adding custom model type as Kanverse Model Store
            const kanModelStore = { label: "Kanverse Model Store", value: "kanverse_model_store" };
            this.documentTypeList.push(kanModelStore);
        },

        async getExtractionModels() {
            // Get classification model with type Document Extraction
            // search_tenant_models --> To get tenant models
            // search_system_models --> To get system models
            const params = {
                filter: { model_type: { $in: ["DOCUMENT_EXTRACTION"] } },
                projection: ["subtype", "model_name"],
                search_tenant_models: true,
                search_system_models: true
            }

            // Calling ks model service to fetch models from db
            let models = await KsModelService.getModels(params)
            
            if (models) {
                // Transforming model names
                models = this.transformModelNames(models)
                this.extractionModels = models
            }
        },

        transformModelNames(models) {
            // Transforming model names using lodash startCase()
            // Ex. - _.startCase("document extraction") --> Document Extraction
            for (let model of models) {
                model["model_name"] = _.startCase(model.model_name.replace(/_/g, ' '));

                // In case of system model appending "(System)" to model name
                if ("is_system_model" in model) {
                    model["model_name"] = model.model_name + " (System)";
                }
            }
            return models;
        },

        async init() {
            let nodeData = JSON.parse(JSON.stringify(this.currentNode.data));
            this.form = {
                node_id: nodeData["node_id"],
                ...this.form,
            };
            _.size(nodeData) > 1 ? (this.form = nodeData) : null;
            this.$nextTick(() => { this.clonedForm = JSON.parse(JSON.stringify(this.form)) })

            // Get configured document types from de customer configurations
            this.getDocTypeList()

            // Get tenant and system extraction models from ks model 
            this.getExtractionModels()
        }
    },

    mounted() {
        // EventBus.$emit("DISPLAY_PROPERTY_WINDOW", {name:'Properties'});
    },

    beforeMount() {
        this.init();
    },
};
</script>

<style lang="scss">
.vue-slideout-content {
    overflow: auto;
}
</style>
