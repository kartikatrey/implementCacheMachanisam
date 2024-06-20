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
import PropertiesFooter from "@/dialogflow/components/properties/PropertiesFooter.vue";
import PropertiesHeader from "@/dialogflow/components/properties/PropertiesHeader.vue";

export default {
    name: "Validation",
    props: ["dialogFlowData", "currentNode"],
    mixins: [wfDirty],
    components: {
        Codemirror,
        PropertiesFooter,
        PropertiesHeader
    },
    data() {
        return {
            form: {
                component_name: "",
                pre_processing_script: Constants.WORKFLOW.GENERIC_SCRIPT || "",
                post_processing_script: Constants.WORKFLOW.GENERIC_SCRIPT || "",
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

        init() {
            let nodeData = JSON.parse(JSON.stringify(this.currentNode.data));
            this.form = {
                node_id: nodeData["node_id"],
                ...this.form
            };
            _.size(nodeData) > 1 ? (this.form = nodeData) : null;
        }
    },
    mounted() {
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
</style>
