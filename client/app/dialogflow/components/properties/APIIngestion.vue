<template>
<div class="properties-container" v-loading="loading">
    <PropertiesHeader :currentNode="currentNode" :dialogFlowData="dialogFlowData" />
    <div class="content-body">
        <el-form :model="form" ref="form" label-width="110px" :rules="formRules">
            <div class="without-tabs-container">
                <el-form-item class="inline-label-item" label="Endpoint" prop="endpoint">
                    <el-input v-model="form.endpoint" placeholder="Please enter endpoint..."></el-input>
                </el-form-item>

                <el-form-item class="inline-label-item" prop="name" label="File path">
                    <el-input @input="handleNameChange" v-model="form.name" placeholder="Upload folder path..."></el-input>
                </el-form-item>

                <el-form-item class="inline-label-item" prop="document_type" label="Document type">
                    <!-- v-on:change="onTypeChange" -->
                    <el-select clearable filterable v-model="form.document_type" placeholder="Document type">
                        <el-option v-for="option in documentTypes" :key="option.value" :value="option.value" :label="option.label"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item class="inline-label-item" disabled prop="org" label="Hierarchy">
                    <org-hierarchy-list :onSelectEventName="onSelectEventName" :hideHigherThanLevel="hideHigherThanLevel" :selectedValue="form.org" v-model="form.org" ref="orgComp"></org-hierarchy-list>
                </el-form-item>
            </div>
        </el-form>
    </div>
    <PropertiesFooter :currentNode="currentNode" :form.sync="form" :dialogFlowData="dialogFlowData" :formRef="$refs" />
</div>
</template>

<script>
import EventBus from "@/EventBus";
import PropertiesFooter from "@/dialogflow/components/properties/PropertiesFooter.vue";
import _ from "lodash";
import Codemirror from "@/components/Codemirror.vue";
import OrgHierarchyList from "@/idp/components/OrgHierarchyList.vue";
import InputChannelService from "@/idp/services/InputChannel";
import PropertiesHeader from "@/dialogflow/components/properties/PropertiesHeader.vue";
import wfDirty from "@/mixins/wfDirty.js";
import Constants from "@/resources/Constants";
import Validator from "@/services/Validator";

export default {
    name: "API Ingestion",
    props: ["dialogFlowData", "currentNode", "documentTypes"],
    mixins: [wfDirty],
    components: {
        PropertiesHeader,
        PropertiesFooter,
        Codemirror,
        OrgHierarchyList,
    },
    data() {
        const storage = JSON.parse(localStorage.getItem("vuex"));
        const userOrg =
            storage["user"] && storage["user"]["org"] ? storage["user"]["org"] : null;
        return {
            hideHigherThanLevel: userOrg,
            doucument_types: Constants.DOCEX.DOCUMENT_TYPE_LIST,
            form: {
                endpoint: "",
                name: "",
                org: "",
                document_type: "",
                upload_folder_path:""
            },
            formRules: {
                endpoint: [{
                    validator: Validator.EmptyValueValidator,
                    trigger: "blur",
                    message: "Please provide valid endpoint",
                }, {
                    trigger: "blur",
                    required: true,
                    message: "Endpoint is required"
                }, ],
                name: [{
                    validator: Validator.EmptyValueValidator,
                    trigger: "blur",
                    message: "Please provide valid file upload path",
                }, {
                    trigger: "blur",
                    required: true,
                    message: "Fileupload path is required",
                }, ],
                document_type: [{
                    trigger: "blur",
                    required: true,
                    message: "Document type is required",
                }],
                org: [{
                    trigger: "change",
                    required: true,
                    message: "Please provide org hierarchy",
                }, ],
            },
            onSelectEventName : "API_INGESTION"
        };
    },
    methods: {
        handleNameChange(){
               this.form.upload_folder_path = this.form.name;
        },
        async init() {
            let nodeData = JSON.parse(JSON.stringify(this.currentNode.data));
            this.form = {
                node_id: nodeData["node_id"],
                ...this.form,
            };
            _.size(nodeData) > 1 ? (this.form = nodeData) : null;
            this.$nextTick(() => {
                this.clonedForm = JSON.parse(JSON.stringify(this.form))
            })
        },
        registerEvents() {
            EventBus.$on("UPSERT_INPUT_CHANNEL", (dialogFlowData) => {
                _.forEach(dialogFlowData.workflow_data.nodes, (node) => {
                    console.log("node name isss:::", node.name);
                    if (node.name == "API Ingestion") {
                        node.data["workflow_id"] = dialogFlowData._id;
                        node.data["workflow_node_id"] = node.id;
                        node.data["type"] = "API";
                        node.data["active"] = true;
                        this.save(node.data);
                    }
                });
            });
        },
        async postProcessing() {
            try {
                let currentNode = JSON.parse(JSON.stringify(this.currentNode));
                currentNode.data["workflow_id"] = this.dialogFlowData._id;
                currentNode.data["workflow_node_id"] = currentNode.id;
                currentNode.data["type"] = "API";
                currentNode.data["active"] = true;
                currentNode.data = {
                    ...currentNode.data,
                    ...this.form
                };
                let status = await this.insertRecord(currentNode.data);
                return status;
            } catch (e) {
                console.log(e);
                return false;
            }
        },
        setUploadFolderPath() {
            this.form[
                "upload_folder_path"
            ] = this.form.name;
        },

        async insertRecord(data) {
            // this.setUploadFolderPath();
            try {
                let response = await InputChannelService.upsert(data)
                if (
                    _.get(response, "data.name") == "MongoError" &&
                    _.get(response, "data.errmsg").includes("duplicate key")
                ) {
                    this.handleError("Channel name is already present.");
                    return false
                }
                if (response.status == 200 || response.status == 201) {
                    this.form[
                        "_id"
                    ] = response.data._id;
                    if (!response.data.status && response.data.statusMessage) {
                        this.handleError(response.data.statusMessage);
                        return false
                    }

                    this.notifySuccess("Record saved successfully");
                    return true;
                }
            } catch (err) {
                this.handleError("Issue while creating channel");
                return false
            }

        },

        handleError(message) {
            this.notifyError(message);
        }
    },
    beforeDestroy() {
        EventBus.$off(["ON_SELECT_ORG_HIERARCHY_"+this.onSelectEventName]);
    },
    beforeMount() {
        this.init();
        EventBus.$on("ON_SELECT_ORG_HIERARCHY_"+this.onSelectEventName, (data) => {
            this.form.org = data && data.org;
        });
    },
};
</script>

<style lang="scss">

</style>
