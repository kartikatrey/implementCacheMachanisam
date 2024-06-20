<template>
    <div class="properties-container" v-loading="loading">

        <!-- Header Properties -->
        <PropertiesHeader :currentNode="currentNode" :dialogFlowData="dialogFlowData" />

        <div class="content-body">
            <el-form :model="form" ref="form" label-width="110px">
                <el-tabs v-if="dialogFlowData.workflow_data.nodes[currentNode.id].data" class>

                    <!-- General Tab -->
                    <el-tab-pane>
                        <span slot="label">General</span>

                        <!-- Component Name -->
                        <el-form-item class="inline-label-item" label="Component Name" prop="component_name">
                            <el-input v-model="form.component_name" placeholder="Enter component name"></el-input>
                        </el-form-item>

                        <!-- Model Type Dropdown -->
                        <el-form-item :rules="{
                            required: true,
                            message: 'Model type is required',
                            trigger: 'blur',
                        }" class="inline-label-item" label="Model type" prop="model_type">
                            <el-select clearable v-model="form.model_type" placeholder="Select model type"
                                v-on:change="onDocTypeChange">
                                <el-option v-for="documentType in documentTypeList" :label="documentType.label"
                                    :value="documentType.value" :key="documentType.value"></el-option>
                            </el-select>
                        </el-form-item>

                        <!-- Select Model Dropdown -->
                        <el-form-item :rules="{
                            required: true,
                            message: 'Please select model',
                            trigger: 'blur',
                        }" class="inline-label-item" label="Select Model" prop="selected_model_name">
                            <el-select name="selected_model_name" v-model="form.selected_model_name"
                                placeholder="Select model" v-on:change="onModelSelectionChange">
                                <el-option v-for="selectedModel in selectedModels" :label="selectedModel.model_name"
                                    :value="selectedModel.model_name" :key="selectedModel.model_name"></el-option>
                            </el-select>
                        </el-form-item>

                        <!-- Pre Proccesing Script -->
                        <el-form-item class="inline-label-item codemirror-item-container" prop="pre_processing_script">
                            <label class="label-name">Pre script</label>
                            <codemirror v-model="form.pre_processing_script"></codemirror>
                        </el-form-item>

                        <!-- Post Proccesing Script -->
                        <el-form-item class="inline-label-item codemirror-item-container" prop="post_processing_script">
                            <label class="label-name">Post script</label>
                            <codemirror v-model="form.post_processing_script"></codemirror>
                        </el-form-item>
                    </el-tab-pane>

                    <!-- Connection Tab -->
                    <el-tab-pane>
                        <span slot="label">connection</span>
                        
                        <div v-for="(item, index) in form.connections" :key="index" class="add-condition-container">

                            <!-- Label -->
                            <el-form-item class="inline-label-item" disabled label="Label"
                                :prop="'connections.' + index + '.rule.label'" :rules="{
                                    required: true,
                                    message: 'label is required',
                                    trigger: 'blur',
                                }">
                                <el-input placeholder="Enter label" v-model="item['rule']['label']"></el-input>
                            </el-form-item>

                            <!-- Classification -->
                            <el-form-item class="inline-label-item" disabled label="Classification"
                                :prop="'connections.' + index + '.rule.classification_label'" :rules="{
                                    required: true,
                                    message: 'classification label is required',
                                    trigger: 'blur',
                                }">
                                <el-input placeholder="Enter classification label"
                                    v-model="item['rule']['classification_label']"></el-input>
                            </el-form-item>

                            <!-- Remove Button -->
                            <div class="notification-delete-container">
                                <el-button v-on:click="removeConnection(item, index)" class="btn-delete btn-delete-card"
                                    size="mini">
                                    Remove
                                    <!-- <i class="mdi mdi-delete"></i> -->
                                </el-button>
                            </div>
                        </div>

                        <!-- Add Condition Button -->
                        <el-button size="mini" class v-on:click="addConnection($event)" type="primary">+ ADD condition</el-button>
                        
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </div>

        <!-- Footer Properties -->
        <PropertiesFooter :currentNode="currentNode" :form.sync="form" :dialogFlowData="dialogFlowData" :formRef="$refs" :loading.sync="loading" />

    </div>
</template>

<script>
import _ from "lodash";
import Rete from "rete";
const uuidv4 = require("uuid/v4");
import EventBus from "@/EventBus";
import * as Socket from "../../sockets";
import wfDirty from "@/mixins/wfDirty.js";
import Constants from "@/resources/Constants";
import Codemirror from "@/components/Codemirror.vue";
import KsModelService from "@/idp/services/KsModelService";
import documentConfigService from "@/idp/services/DeCustomerConfig";
import PropertiesFooter from "@/dialogflow/components/properties/PropertiesFooter.vue";
import PropertiesHeader from "@/dialogflow/components/properties/PropertiesHeader.vue";

export default {
    name: "Classification",
    props: ["dialogFlowData", "currentNode"],
    mixins: [wfDirty],
    components: {
        Codemirror,
        PropertiesFooter,
        PropertiesHeader
    },
    data() {
        return {
            documentTypeList: [],
            classificationModels: [],
            selectedModels: [],
            connectionForm: {
                label: "",
                classification_label: ""
            },

            form: {
                component_name: "",
                model_type: "",
                selected_model_name: "",
                selected_model_id: "",
                is_system_model: "",
                pre_processing_script: Constants.WORKFLOW.PRE_SCRIPT.EXTRACTION || "",
                post_processing_script: Constants.WORKFLOW.POST_SCRIPT.EXTRACTION || "",
                connections: [
                    {
                        rule: {
                            label: "",
                            classification_label: ""
                        }
                    }
                ]
            }
        };
    },

    methods: {
        // Calling this method on document type change from dropdown
        onDocTypeChange() {
            this.selectedModels = [];
            const documentType = this.form.model_type;

            // Setting selected_model_name as blank on model change
            this.$set(this.form, 'selected_model_name', "");
            if (!documentType) { return }

            // Storing models in selectedModels which includes document type in subtype
            for (let classificationModel of this.classificationModels) {
                const subtype = classificationModel.subtype || "";
                const modelSubtype = subtype.toLowerCase();
                if (modelSubtype && modelSubtype.includes(documentType)) {
                    this.selectedModels.push(classificationModel);
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

        async getClassificationModels() {
            // Get classification model with type Document Extraction
            // search_tenant_models --> To get tenant models
            // search_system_models --> To get system models
            const params = {
                filter: { model_type: "DOCUMENT_CLASSIFICATION" },
                projection: ["subtype", "model_name"],
                search_tenant_models: true,
                search_system_models: true
            };

            // Calling ks model service to fetch models from db
            let models = await KsModelService.getModels(params);

            if (models) {
                // Transforming model names
                models = this.transformModelNames(models);
                this.classificationModels = models;
            }
        },
        
        transformModelNames(models) {
            for (let model of models) {
                // Transforming model names using lodash startCase()
                // Ex. - _.startCase("document classification") --> Document Classification
                model["model_name"] = _.startCase(model.model_name.replace(/_/g, ' '));

                // In case of system model append "(System)" to model name
                if ("is_system_model" in model) {
                    model["model_name"] = model.model_name + " (System)";
                }
            }
            return models;
        },

        removeConnection(output, index) {
            this.form["connections"].splice(index, 1);
        },

        addConnection(event) {
            this.form.connections.push({
                rule: {
                    label: "",
                    classification_label: ""
                }
            });
            this.$forceUpdate();
        },

        postProcessing() {
            this.currentNode.outputs.forEach(output => {
                output.connections.map(connection =>
                    EventBus.$emit("REMOVE_CONNECTION", connection)
                );
            });
            // Remove all existing connections
            _.each(this.currentNode.data.connections, connections => {
                this.currentNode.removeOutput(
                    new Rete.Output(
                        connections.name,
                        connections.rule.label,
                        this.currentNode.inputs.get("act").socket
                    )
                );
            });
            // this.currentNode.update();
            // EventBus.$emit('UPDATE_NODE', this.currentNode);
            // Update with new connections

            _.each(this.form.connections, connection => {
                connection.name = uuidv4();
                this.currentNode.addOutput(
                    new Rete.Output(
                        connection.name,
                        connection.rule.label,
                        Socket.anyTypeSocket
                    )
                );
            });
            this.currentNode.update();
            EventBus.$emit("UPDATE_NODE", this.currentNode);
            return true;
        },

        init() {
            let nodeData = JSON.parse(JSON.stringify(this.currentNode.data));
            this.form = {
                node_id: nodeData["node_id"],
                ...this.form
            };
            _.size(nodeData) > 1 ? (this.form = nodeData) : null;

            // Get configured document types from de customer configurations
            this.getDocTypeList();

            // Get tenant and system classification models from ks model 
            this.getClassificationModels();
        }
    },
    mounted() {
        // EventBus.$emit("DISPLAY_PROPERTY_WINDOW", {name:'Properties'});
    },
    beforeMount() {
        this.init();
    }
};
</script>

<style lang="scss">
.vue-slideout-content {
    overflow: auto;
}

/* html,
body {
    height: 100%;
    margin: 0;
}

button.compile {
    z-index: 5;
    position: absolute;
    top: 10px;
    left: 10px;
} */
</style>
