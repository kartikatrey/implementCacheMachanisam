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

                    <!-- Select Prompt Dropdown -->
                    <el-form-item class="inline-label-item" prop="prompt_name" label="Prompt name">
                        <el-select cid="llm-form-prompt-name" v-model="form.prompt_name"
                            placeholder="Please select prompt" filterable clearable>
                            <el-option v-for="(item, index) in prompts"
                                :cid="'llm-form-prompt-name' + index" 
                                :key="item.name"
                                :value="item.name" 
                                :label="item.label">
                            </el-option>
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
import PromptService from "@/idp/services/PromptService";
import PropertiesHeader from "@/dialogflow/components/properties/PropertiesHeader.vue";

export default {
    name: "LlmExtraction",
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
            prompts : [],
            documentTypeList: [],
            formRules: {
                prompt_name: [
                    {
                        validator: Validator.EmptyValueValidator,
                        trigger: "blur",
                        message: "Please select prompt",
                    },
                    {
                        required: true,
                        message: "Please select prompt",
                        trigger: "blur",
                    },
                ]
            },
            form: {
                component_name: "",
                prompt_name: "",
                pre_processing_script: Constants.WORKFLOW.PRE_SCRIPT.EXTRACTION || "",
                post_processing_script: Constants.WORKFLOW.POST_SCRIPT.EXTRACTION || "",
            }
        };
    },
    methods: {
        async init() {
            let nodeData = JSON.parse(JSON.stringify(this.currentNode.data));
            this.form = { node_id: nodeData["node_id"], ...this.form };
            _.size(nodeData) > 1 ? (this.form = nodeData) : null;
            this.$nextTick(() => { this.clonedForm = JSON.parse(JSON.stringify(this.form)) })

            this.prompts = await PromptService.getAllPrompts({ active: true, type: "image" }, ["name", "label"])
        }
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
