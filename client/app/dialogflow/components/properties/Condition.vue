<template>
<div class="properties-container" v-loading="loading" v-scroll="onScroll">
    <PropertiesHeader :currentNode="currentNode" :dialogFlowData="dialogFlowData" />
    <div class="content-body">
        <el-form :rules="formRules" :model="form" ref="form" label-width="110px">
            <div class="without-tabs-container">
                <div v-for="(item, index) in form.connections" :key="index" class="add-condition-container">
                    <el-form-item class="inline-label-item" disabled label="Label" :prop="'connections.' + index + '.label'">
                        <el-input placeholder="Enter script" v-model="item['label']"></el-input>
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
            </div>
        </el-form>
    </div>
    <PropertiesFooter :currentNode="currentNode" :form.sync="form" :dialogFlowData="dialogFlowData" :formRef="$refs" />
    <!-- // content body -->
</div>
</template>

<script>
import EventBus from "@/EventBus";
import TableAPIService from "@/services/TableAPIService";
import constants from "@/dialogflow/helpers/Constants";
import Rete from "rete";
import * as Socket from "../../sockets";
import Constants from "@/resources/Constants";
import DialogFlowService from "@/dialogflow/services/DialogFlowService";
import propertyJSON from "@/dialogflow/helpers/Property";
import Codemirror from "@/components/Codemirror.vue";
import PropertiesFooter from "./PropertiesFooter.vue";
import PropertiesHeader from "@/dialogflow/components/properties/PropertiesHeader.vue";
import {
    ContainerMixin,
    ElementMixin
} from "vue-slicksort";
import wfDirty from "@/mixins/wfDirty.js";
const uuidv4 = require("uuid/v4");
let tableAPI = new TableAPIService();
import Validator from "@/services/Validator";
import _ from "lodash";

export default {
    name: "Condition",
    props: ["dialogFlowData", "currentNode"],
    components: {
        Codemirror,
        PropertiesFooter,
        PropertiesHeader,
    },
    mixins: [wfDirty],
    data() {
        return {
            validator: Validator,
            entityObject: {},
            form: {
                connections: [{
                    name: "",
                    label: "",
                    script: Constants.WORKFLOW.GENERIC_SCRIPT || "",
                }, ],
            },
        };
    },
    methods: {
        init() {
            this.setConnections();
            this.$nextTick(() => {
                this.clonedForm = JSON.parse(JSON.stringify(this.form))
            })
        },

        setConnections() {
            let form = JSON.parse(JSON.stringify(this.currentNode.data));
            this.form = {
                node_id: form.node_id,
                connections: this.form.connections
            };
            if (!_.isEmpty(form.connections)) {
                let connections = _.cloneDeep(this.currentNode.data["connections"]);
                this.$set(this.form, "connections", connections);
            }
        },

        addConnection(event) {
            this.form.connections.push({script: Constants.WORKFLOW.GENERIC_SCRIPT || ""});
            this.$forceUpdate();
        },

        postProcessing() {
            DialogFlowService.addOutput(this.currentNode, this.form);
            return true
        },

        removeConnection(output, index) {
            this.form.connections.splice(index, 1);
        },
    },
    mounted() {},

    beforeMount() {
        this.init();
    },
    updated() {
        console.log("inside condition updated");
    },
};
</script>

<style lang="scss">
    .vue-slideout-content {
        overflow: auto;
    }
</style>