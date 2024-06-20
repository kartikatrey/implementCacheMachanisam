<template>
<div class="properties-container" v-loading="loading">
    <PropertiesHeader :currentNode="currentNode" :dialogFlowData="dialogFlowData" />
    <div class="content-body">
        <el-form :model="form" ref="form" label-width="110px" :rules="formRules">
            <el-tabs v-if="dialogFlowData.workflow_data.nodes[currentNode.id].data">
                <!-- general -->
                <el-tab-pane>
                    <span slot="label">General</span>
                    <el-form-item class="inline-label-item" label="Component Name" prop="component_name">
                        <el-input v-model="form.component_name" placeholder="Enter component name"></el-input>
                    </el-form-item>
                    <el-form-item class="inline-label-item" label="Send to" prop="toemails">
                        <el-input v-model="form.toemails" placeholder="Please enter to emails..."></el-input>
                    </el-form-item>
                    <el-form-item class="inline-label-item" label="Subject" prop="subject">
                        <el-input v-model="form.subject" placeholder="Please enter subject..."></el-input>
                    </el-form-item>
                    <el-form-item class="inline-label-item" label="Message" prop="message">
                        <el-input type="textarea" v-model="form.message" placeholder="Please enter message..."></el-input>
                    </el-form-item>
                    <el-form-item prop="add_file_as_attachment" class="inline-label-item checkbox-item-container" label="Attachment" disabled>
                        <toggle-button active-color="none" inactive-color="none" v-model="form.add_file_as_attachment" :sync="true" :color="{checked: '#5f8fdf', unchecked: '#DCDFE6', disabled: '#CCCCCC'}" :labels="{checked: 'YES', unchecked: 'NO'}"></toggle-button>
                    </el-form-item>

                    <el-form-item class="inline-label-item codemirror-item-container" disabled>
                        <label class="label-name">Response processor</label>
                        <codemirror v-model="form.advance_script"></codemirror>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane>
                    <span slot="label">Connection </span>
                    <div v-for="(item, index) in form.connections" :key="index" class="add-condition-container">
                        <el-form-item class="inline-label-item" disabled label="Label" :prop="'connections.' + index + '.label'" :rules="[
          {
            validator: validator.EmptyValueValidator,
            trigger: 'blur',
            message: 'Please provide valid label',
          },
         {
                  required: true,
                  message: 'label is required',
                  trigger: 'blur',
                }
        ]">
                            <el-input placeholder="Enter label" v-model="item['label']"></el-input>
                        </el-form-item>
                        <el-form-item class="inline-label-item codemirror-item-container" disabled :prop="'connections.' + index + '.script'">
                            <label class="label-name">Script</label>
                            <codemirror v-model="item.script"></codemirror>
                        </el-form-item>

                        <div class="notification-delete-container">
                            <el-button v-on:click="removeConnection(item, index)" class="btn-delete btn-delete-card" size="mini">Remove
                                <!-- <i class="mdi mdi-delete"></i> -->
                            </el-button>
                        </div>
                    </div>
                    <el-button size="mini" class="" v-on:click="addConnection($event)" type="primary">+ ADD condition</el-button>
                </el-tab-pane>
            </el-tabs>
        </el-form>
    </div>
    <PropertiesFooter :currentNode="currentNode" :form.sync="form" :dialogFlowData="dialogFlowData" :formRef="$refs" :loading.sync="loading" />
</div>
</template>

<script>
import _ from "lodash";
import Codemirror from "@/components/Codemirror.vue";
import PropertiesFooter from "@/dialogflow/components/properties/PropertiesFooter.vue";
import PropertiesHeader from "@/dialogflow/components/properties/PropertiesHeader.vue";
import Rete from "rete";
import * as Socket from "../../sockets";
const uuidv4 = require("uuid/v4");
import wfDirty from "@/mixins/wfDirty.js";
import EventBus from "@/EventBus";
import Constants from "@/resources/Constants";
import DialogFlowService from "@/dialogflow/services/DialogFlowService";
import Validator from "@/services/Validator";

export default {
    name: "Notification",
    mixins: [wfDirty],
    props: ["dialogFlowData", "currentNode"],
    components: {
        Codemirror,
        PropertiesFooter,
        PropertiesHeader
    },
    data() {
        return {
            validator: Validator,
            loading: false,
            form: {
                component_name:"",
                toemails: "",
                subject: "",
                message: "",
                add_file_as_attachment: false,
                advance_script: Constants.WORKFLOW.GENERIC_SCRIPT || "",
                connections: [{
                    label: "",
                    script: ""
                }],
            },

            formRules: {
                toemails: [{
                        trigger: "blur",
                        required: true,
                        message: "Please enter to email"
                    },
                    {
                        validator: Validator.EmptyValueValidator,
                        trigger: 'blur',
                        message: 'To email is required',
                    }
                ],
                subject: [{
                        validator: Validator.EmptyValueValidator,
                        trigger: 'blur',
                        message: 'Please provide valid subject',
                    },
                    {
                        trigger: "blur",
                        required: true,
                        message: "Subject is required"
                    },
                ],
                message: [{
                        validator: Validator.EmptyValueValidator,
                        trigger: 'blur',
                        message: 'Please provide valid message',
                    },
                    {
                        trigger: "blur",
                        required: true,
                        message: "Message  is required"
                    },
                ],
                advance_script: [{
                        validator: Validator.EmptyValueValidator,
                        trigger: 'blur',
                        message: 'Please provide valid script',
                    },
                    {
                        trigger: "blur",
                        required: true,
                        message: "Script is required"
                    },
                ]
            },
        };
    },
    methods: {
        init() {
            let nodeData = JSON.parse(JSON.stringify(this.currentNode.data))
            this.form = {
                node_id: nodeData['node_id'],
                ...this.form,
            };
            _.size(
                nodeData
            ) > 1 ? (this.form = nodeData) : null;
            this.$nextTick(() => {
                this.clonedForm = JSON.parse(JSON.stringify(this.form))
            })

        },

        addConnection(event) {
            if (!this.form.connections) this.form.connections = [];
            this.form.connections.push({
                label: "",
                script: ""
            });
            this.$forceUpdate();
        },
        removeConnection(output, index) {
            this.form.connections.splice(index, 1);
        },
        async postProcessing() {
            this.form.__dynamic_fields = ["toemails","message","subject"];
            DialogFlowService.addOutput(this.currentNode, this.form);
            return true
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
    .el-textarea{
        margin-top: -20px;
        margin-bottom: -20px;
    }
</style>
