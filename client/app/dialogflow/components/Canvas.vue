<template>
    <div :class="getCanvasClass()" id="workflow-wrapper">
        
        <!-- Component Panel -->
        <div v-if="showComponentPanel" :class="expandMenu ? 'add-node' : 'add-node collapse-menu'">
            <div class="add-node-container">
                <div class="add-node-header">
                    <div class="title">+ Add Node <el-button round @click="toggleNodeMenu"
                            :class="expandMenu ? 'toggle mdi mdi-chevron-left' : 'toggle mdi mdi-chevron-right'"></el-button>
                    </div>
                    <div class="search-wrapper">

                        <el-tooltip slot="reference" class="item" effect="dark" :content="'Search node'" placement="right">
                            <el-button class="serach-button">
                                <div class="search-container">
                                    <span @click="toggleNodeMenu" class="mdi mdi-magnify node-search-icon"></span>
                                    <div class="search-name">Search</div>
                                    <div class="node-search-input-container">
                                        <i class="mdi mdi-magnify search-icon search-int-icon"></i>
                                        <el-input ref="nodeSearchRef" v-if="expandMenu" v-model="nodeSearch" type="text"
                                            placeholder="Search node" name="search" size="mini" clearable
                                            cid="nav-bar-search-text">
                                        </el-input>
                                    </div>
                                </div>
                            </el-button>
                        </el-tooltip>

                    </div>
                </div>
                <div class="add-node-body">
                    <ul>
                        <li v-for="(component, index) in filteredNodes" v-bind:key="index">
                            <!-- <div class="icon"> <img src="../../../app/assets/images/start-icon.png" class=""></img> </div> -->
                            <el-tooltip slot="reference" class="item" effect="dark" :content="component.name"
                                placement="right">
                                <el-button @dragstart.native="(e) => handleOnDragStart(e)" draggable="true" :ref="component"
                                    :id="component.name">
                                    <div class="nodes-container">
                                        <i :class="component.iconClass"></i>
                                        <span v-if="expandMenu" class="node-name">{{ component.name }}</span>
                                        <div v-if="!expandMenu" class="node-short-name node-name">{{ component.name }}</div>
                                    </div>
                                </el-button>
                            </el-tooltip>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Canvas Workflow Editor -->
        <div id="canvas-container" class="canvas-container">
            <div ref="rete" id="rete" class="node-editor">
                <div v-show="!wfHistoryFound" class="wf-history-not-found"></div>
            </div>
            <el-button v-if="showComponentPanel" @click="showPropertyWindow({ name: `Properties` });"
                class="btn-workflowProperties">Workflow Properties</el-button>
        </div>

    </div>
</template>

<script>

const uuidv4 = require("uuid/v4");

import _ from "lodash";
import $ from 'jquery';
import Rete from "rete";
import "@babel/polyfill";
import EventBus from "@/EventBus";
import * as Socket from "../sockets";
import "splitpanes/dist/splitpanes.css";
import { Splitpanes, Pane } from "splitpanes";
import Constants from "@/resources/Constants";


// Import Rete Components Here
import BotPromptComponent from "./rete/BotPromptComponent";
import ConditionComponent from "./rete/ConditionComponent";
import EndWithMessageComponent from "./rete/EndWithMessageComponent";
import RunScriptComponent from "./rete/RunScriptComponent";
import WorkflowComponent from "./rete/WorkflowComponent";
import ApprovalComponent from "./rete/ApprovalComponent";
import ServiceCallComponent from "./rete/ServiceCallComponent";
import BeginComponent from "./rete/BeginComponent";
import CognitiveExtractionComponent from "./rete/CognitiveExtractionComponent";
import LLMExtractionComponent from "./rete/LLMExtractionComponent";
import IngestionComponent from "./rete/EmailIngestionComponent";
import CalloutComponent from "./rete/CalloutComponent";
import APIIngestionComponent from "./rete/APIIngestionComponent";
import IDPIngestionComponent from "./rete/IDPEmailIngestionComponent";
import ClassificationComponent from "./rete/ClassificationComponent";
import ValidationComponent from "./rete/ValidationComponent";
import HumanInterventionComponent from "./rete/HumanInterventionComponent";
import NotificationComponent from "./rete/NotificationComponent";
import AssignmentComponent from "./rete/AssignmentComponent";
import IDPApprovalComponent from "./rete/IDPApprovalComponent";
import IDPRunScriptComponent from "./rete/IDPRunScriptComponent";
import ApprovalActionComponent from "./rete/ApprovalActionComponent";
import IDPStatusComponent from "./rete/IDPStatusComponent";
import ForkComponent from "./rete/ForkComponent";
import JoinComponent from "./rete/JoinComponent";
import IDPConditionComponent from "./rete/IDPConditionComponent";
import KnowledgeBaseComponent from "./rete/KnowledgeBaseComponent";
import WaitComponent from "./rete/WaitComponent";
import IDPWaitComponent from "./rete/IDPWaitComponent";
import FTPUploadComponent from "./rete/FTPUploadComponent";


// Import Rete Plugins Here
import AreaPlugin from "rete-area-plugin";
import TaskPlugin from "rete-task-plugin";
import ReadonlyPlugin from "rete-readonly-plugin";
import VueRenderPlugin from "rete-vue-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import ConnectionPathPlugin from 'rete-connection-path-plugin';
import ConnectionHighlightPlugin from "@/plugins/rete/rete-connection-highlight";


export default {

    props: ["dialogFlowData", "workflowType", "showSlide", "showComponentPanel"],
    watch: {
        // After refreshing canvas the updated store values are not reflecting over canvas
		dialogFlowData(newVal) {
			if (!_.isEmpty(newVal) && newVal._id) {
               this.init();
               this.wfHistoryFound = true;
            }
		}
	},
    computed: {
        ComponentsArray() {
            if (!_.get(this.editor, 'components')) {
                return []
            };
            return Array.from(this.editor.components, ([name, component]) => {
                return {
                    name,
                    iconClass: component.data.props.iconClass
                }
            })
        },
        sortedNodes() {
            return _.sortBy(this.ComponentsArray, ["label"]);
        },
        filteredNodes() {
            if (!this.nodeSearch) return this.sortedNodes;
            return this.sortedNodes.filter((nodeLabel) =>
                nodeLabel.name.toLowerCase().includes(this.nodeSearch.toLowerCase().trim())
            );
        },

    },
    data() {
        return {
            nodeSearch: '',
            editor: {},
            engine: {},
            currentSelectedNode: {},
            isFromJson: false,
            expandMenu: false,
            wfHistoryFound: true
        };
    },
    components: {
        Splitpanes,
        Pane
    },
    methods: {
        getCanvasClass() {
            let canvasClass = "workflow-wrapper";
            if (!this.showComponentPanel) {
                canvasClass += " workflow-history-height"
            }
            const kanvTheme = this.$store.getters.selectedTheme;
            if (kanvTheme === Constants.DOCEX.THEMES.DARK) {
                canvasClass += " dark-theme";
            }
            return canvasClass;
        },

        toggleNodeMenu() {
            this.expandMenu = !this.expandMenu;
            this.$nextTick(() => this.expandMenu && this.$refs.nodeSearchRef.focus())
        },
        handleOnDragStart(e) {
            if (!e.dataTransfer) {
                return;
            }
            e.dataTransfer.setData('componentName', e.currentTarget.id);
        },

        registerEvents() {
            EventBus.$on("UPDATE_NODE", (node) => {
                this.editor.view.updateConnections({
                    node
                })
            });

            EventBus.$on("REMOVE_CONNECTION", (connection) => {
                this.editor.removeConnection(connection)
            });

        },

        async init() {
            /* 
                In case of coming from workflow history icon and if workflow history not found
                then do no proceed further and display not found msg on canvas

            */
            if (!this.showComponentPanel && !this.checkIfWfHistoryAvailable()) {
                this.wfHistoryFound = false;
                return;
            }
            this.initEditor();
            this.registerEvents();
            //if in edit mode, get rete components dropdown data for selected workflowType(from props)
            if (this.dialogFlowData._id) {
                //'DA' default value for now, need to remove when all records in db have workflow_type
                this.workflowType = this.workflowType || Constants.WORKFLOW.TYPE.DA;
                this.initReteComponents()
            } else { //if new workflow, get rete components dropdown data only when workflow_type is selected
                this.workflowType ? this.initReteComponents() : "";
                setTimeout(() => {
                    this.showPropertyWindow({
                        name: `Properties`
                    })
                }, 500)
            }
            this.subscribeEvents();
            await this.fromJSON(this.dialogFlowData.workflow_data);
            this.isFromJson = false;
            this.$emit("update:showSlide", true);

        },

        checkIfWfHistoryAvailable() {
            // In case of coming from wf history icon, checking if wf history is present or not
            let isHistoryPresent = true;
            if (!this.showComponentPanel && _.isEmpty(this.dialogFlowData)) {
                isHistoryPresent = false;
            }
            return isHistoryPresent;
        },

        initEditor() {
            this.editor = new Rete.NodeEditor("kanverse@0.1.0", this.$refs.rete);
            this.engine = new Rete.Engine("kanverse@0.1.0");
            this.editor.use(VueRenderPlugin);
            this.editor.use(ConnectionPlugin);
            this.editor.use(ContextMenuPlugin);
            this.editor.use(TaskPlugin);
            this.editor.use(ConnectionPathPlugin, {
                type: ConnectionPathPlugin.DEFAULT, // DEFAULT or LINEAR transformer
                curve: ConnectionPathPlugin.curveStepAfter, // curve identifier
                arrow: { color: '#CBD5E0', marker: 'M4,-5 L4,5 L12,0 z' }
            });

            // While showing workflow progress on ui we are adding connection highlight and read-only plugin in editor
            if (this.dialogFlowData && this.dialogFlowData.processed_nodes) {
                // if processed_nodes are not empty, assume we are displaying the history of workflow instances

                // Connection Highlight plugin highlights the color of executed wf path
                const params = { 
                    processed_nodes: this.dialogFlowData.processed_nodes,
                    status: this.dialogFlowData.status,
                    node_contexts: this.dialogFlowData.node_contexts
                }
                this.editor.use(ConnectionHighlightPlugin, params);

                // Read-only plugin sets the editor on read-only mode
                this.editor.use(ReadonlyPlugin, { enabled: true })
            }
            this.editor.use(AreaPlugin, {
                background: false,
                snap: false,
                scaleExtent: {
                    min: 0.03,
                    max: 10
                },
                translateExtent: {
                    width: 5000,
                    height: 2000
                }
            });
        },

        //Load rete components and register it with editor and engine
        initReteComponents() {
            let defaultIcon = 'mdi mdi-axis-z-arrow green-icon'
            const beginComponent = new BeginComponent("mdi mdi-arrow-right-circle blue-icon");
            const botPromptComponent = new BotPromptComponent("mdi mdi-robot-outline red-icon");
            const conditionComponent = new ConditionComponent("mdi mdi-lan orange-icon");
            const runScriptComponent = new RunScriptComponent("mdi mdi-application red-icon");
            const workflowComponent = new WorkflowComponent("mdi mdi-lan blue-icon");
            const approvalComponent = new ApprovalComponent("mdi mdi-check-bold green-icon");
            const waitComponent = new WaitComponent("mdi mdi-clock orange-icon");
            const endWithMessageComponent = new EndWithMessageComponent('mdi mdi-close-octagon');
            const knowledgeBaseComponent = new KnowledgeBaseComponent("mdi mdi-book-open-variant green-icon");
            const serviceCallComponent = new ServiceCallComponent("mdi mdi-cog orange-icon");
            const ingestionComponent = new IngestionComponent("mdi mdi-email blue-icon");
            const idpIngestionComponent = new IDPIngestionComponent("mdi mdi-email blue-icon");
            const classificationComponent = new ClassificationComponent("mdi mdi-file-tree orange-icon");
            const validationComponent = new ValidationComponent("mdi mdi-text-box-check green-icon");
            const cognitiveExtractionComponent = new CognitiveExtractionComponent("mdi mdi-head-snowflake-outline blue-icon");
            const llmExtractionComponent = new LLMExtractionComponent("mdi mdi-brain blue-icon");
            const idpWaitComponent = new IDPWaitComponent("mdi mdi-clock green-icon");
            const calloutComponent = new CalloutComponent("mdi mdi-connection green-icon");
            const apiIngestionComponent = new APIIngestionComponent("mdi mdi-application-import orange-icon");
            const humanInterventionComponent = new HumanInterventionComponent("mdi mdi-account blue-icon", false);
            const notificationComponent = new NotificationComponent("mdi mdi-bell orange-icon");
            const assignmentComponent = new AssignmentComponent("mdi mdi-account-multiple-check blue-icon");
            const idpApprovalComponent = new IDPApprovalComponent("mdi mdi-check-bold green-icon");
            const approvalActionComponent = new ApprovalActionComponent("mdi mdi-checkbox-marked-circle-outline green-icon");
            const idpStatusComponent = new IDPStatusComponent("mdi mdi-list-status orange-icon");
            const forkComponent = new ForkComponent("mdi mdi-source-fork blue-icon");
            const joinComponent = new JoinComponent("mdi mdi-axis-z-arrow green-icon");
            const idpConditionComponent = new IDPConditionComponent("mdi mdi-sitemap orange-icon");
            const idpRunScriptComponent = new IDPRunScriptComponent("mdi mdi-application red-icon")
            const ftpUploadComponent = new FTPUploadComponent("mdi mdi-application-import orange-icon");


            let components = [];
            if (this.workflowType === Constants.WORKFLOW.TYPE.QNA)
                components = [
                    beginComponent,
                    botPromptComponent,
                    conditionComponent,
                    runScriptComponent,
                    workflowComponent,
                    approvalComponent,
                    idpIngestionComponent,
                    waitComponent,
                    endWithMessageComponent,
                ];
            else if (this.workflowType === Constants.WORKFLOW.TYPE.DOCEX)
                components = [
                    beginComponent,
                    runScriptComponent,
                    classificationComponent,
                    validationComponent,
                    idpIngestionComponent,
                    cognitiveExtractionComponent,
                    llmExtractionComponent,
                    idpWaitComponent,
                    calloutComponent,
                    apiIngestionComponent,
                    humanInterventionComponent,
                    assignmentComponent,
                    notificationComponent,
                    idpApprovalComponent,
                    approvalActionComponent,
                    idpStatusComponent,
                    joinComponent,
                    forkComponent,
                    idpConditionComponent,
                    idpRunScriptComponent,
                    ftpUploadComponent,
                    conditionComponent,
                    workflowComponent
                ];
            else
                components = [
                    beginComponent,
                    botPromptComponent,
                    conditionComponent,
                    runScriptComponent,
                    workflowComponent,
                    approvalComponent,
                    waitComponent,
                    knowledgeBaseComponent,
                    serviceCallComponent,
                    endWithMessageComponent,
                ];
            _.map(components, (object) => {
                this.editor.register(object);
                this.engine.register(object);
            });

            this.$nextTick(() => {
                this.handleDockEvents();
            })

        },

        handleDockEvents() {
            let self = this;
            this.editor.view.container.addEventListener('dragover', e => e.preventDefault())
            this.editor.view.container.addEventListener('drop', async e => { //if(!e.dataTransfer) return;
                const name = e.dataTransfer.getData('componentName');;
                const component = self.editor.components.get(name);
                if (!component) return;
                // force update the mouse position
                self.editor.view.area.pointermove(e);
                const node = await this.createNode(component, self.editor.view.area.mouse);
                self.editor.addNode(node)
                self.showPropertyWindow(node)
                this.expandMenu = false;
            })
        },

        async createNode(component, position) {
            let node = await component.createNode({});
            node.position = [position.x, position.y];
            return node;
        },

        showPropertyWindow(node) {
            if (Constants.WORKFLOW.NODES_WITHOUT_PROPERTY_WINDOW.includes(node.name)) { return; }
            EventBus.$emit("VISIBLE_SLIDEOUT", true, node);
        },

        subscribeEvents() {
            this.editor.on("nodeselect", node => { });

            this.editor.on("nodecreated", node => {
                if (this.isFromJson) {
                    Object.assign(this.dialogFlowData.workflow_data, this.editor.toJSON() || {});
                    this.dialogFlowData.workflow_data.nodes[node.id].data["node_id"] =
                        this.dialogFlowData.workflow_data.nodes[node.id].data["node_id"] ||
                        uuidv4();
                    this.$nextTick(() => this.showPropertyWindow(node))
                }

            });

            let drag = false
            this.editor.on('rendernode', ({ el, node }) => {
                el.addEventListener('mouseup', (evt) => {
                    if (evt.button == 0 && !drag && evt.target.id != 'node-socket') {
                        this.showPropertyWindow(node)
                    }
                    drag = false;
                }, false);
            });

            this.editor.on("nodetranslate", node => {
                drag = true;
            });

            this.editor.on("noderemoved", node => {
                Object.assign(this.dialogFlowData.workflow_data, this.editor.toJSON() || {});
            });

            this.editor.on("connectioncreated connectionremoved", () => {
                if (this.isFromJson) {
                    Object.assign(this.dialogFlowData.workflow_data, this.editor.toJSON() || {});
                }
            });

            this.editor.on("click", async () => {
                try {
                    this.editor.selected.clear();
                    this.editor.nodes.map(n => n.update());
                    EventBus.$emit("VISIBLE_SLIDEOUT", false);
                } catch (err) {
                    console.log(err);
                }
            })

        },

        // jsondata from database
        fromJSON(jsonData) {
            this.editor.fromJSON(jsonData).then(async () => {
                await this.editor.view.resize();
                const zoomToNode = _.take(this.editor.nodes, this.editor.nodes.length > 5 ? 5 : this.editor.nodes.length);
                AreaPlugin.zoomAt(this.editor, zoomToNode);
                await this.compile(jsonData);
                this.isFromJson = true;
            });
        },

        async addSocketsByConditions(conditions) {
            await _.forEach(conditions, condition => {
                new Rete.Output(condition, condition, Socket.anyTypeSocket);
            });
        },

        async compile(jsonData) {
            await this.engine.abort();
            await this.engine.process(jsonData);
        }
    },

    async mounted() {
        let self = this;
        this.init();
    },

    beforeMount() { }

};
</script>

<style lang="scss">
@import "../../idp/_idpGlobal.scss";
@import "../../idp/_idpVariables.scss";


.add-node-container {
    display: flex;
    flex-direction: column;
    height: 100%;

    .add-node-header {}

    .add-node-body {
        height: 100%;
        flex: 1;
        overflow: auto;

        &:hover {
            overflow: auto;
        }

        &::-webkit-scrollbar {
            width: 3px;
        }


        &::-webkit-scrollbar-track {
            background: transparent;
        }


        &::-webkit-scrollbar-thumb {
            background: #CBD5E0;
        }
    }
}

.workflow-wrapper {
    display: flex;
    position: relative;
    height: calc(100% - 52px);

    .add-node {
        background-color: #fff;
        width: 240px;
        // border-right: var(--border-base) solid var(--brand-07);
    }

    .canvas-container {
        position: relative;
        flex-grow: 1;
        background: #aaa url(../../assets/images/workflow-bg.png) !important;
        border: 25px solid #fff;
    }

    &.dark-theme {
        .canvas-container {
            background: #aaa url(../../assets/images/workflow-bg-dark.png) !important;
            border: 25px solid #101111;
        }
    }

    .btn-workflowProperties {
        background: #fff;
        border: 0;
        position: absolute;
        top: 0;
        right: 0;
        color: var(--brand-05);
        padding: 0 0 1rem 1rem;

        i {
            border-radius: 100%;
            background: var(--brand-09);
            width: 23px;
            height: 23px;
            display: inline-block;
            font-size: 1.6rem;
            color: var(--brand-05);
            margin-right: .4rem;
            padding-right: 0;
        }
    }
    &.dark-theme {
        .btn-workflowProperties {
            background: transparent;
        }
    }
}

.add-node-container {
    padding: 2rem 0rem 0 1rem;
    height: calc(100% - 24px);
    background: rgb(237, 242, 247);

    .el-button.toggle {
        background: rgb(237, 242, 247);
        border-radius: 20px;
        padding: 0px 0px;
        position: absolute;
        right: -14px;
        top: 0px;
        z-index: 1;
        font-size: 1.7rem;
        border: 2px solid #fff;
        color: var(--brand-06);

        i {
            color: var(--brand-05);
        }
    }

    .title {
        position: relative;
        color: var(--brand-04);
        font-size: var(--font-lg);
        margin-bottom: .5rem;
        display: inline-block;
        display: block;
        overflow: visible !important;
    }

    ul {
        padding: 0;


        li {
            list-style: none;
            display: flex;
            padding-left: .2rem;
            margin: .5rem 0;

            .el-button {
                border: 0;
                width: 100%;
                text-align: left;
                color: var(--dark-02);
                font-size: var(--font-base);
                padding: .5rem .5rem .5rem 1.4rem;

                .nodes-container {
                    display: flex;

                    i {
                        font-size: 2rem;
                    }

                    .node-search-icon {
                        font-size: 2rem;
                    }

                    .node-search-input-container {
                        margin-left: 1rem;
                    }

                    .node-name {
                        display: inline-block;
                        padding: .5rem 0 0 1rem;
                    }

                    .node-short-name {
                        padding-left: 0px;
                    }
                }
            }
        }
    }
}

// end add node container

.node-editor {
    width: 100% !important;
    word-break: normal;
}

#d3ne {
    height: 100%;
    position: relative;
}

.collapse-menu {
    width: 115px !important;

    ul {
        li {
            .el-button {
                padding: .5rem .5rem .5rem 0rem !important;

                .nodes-container {
                    i {
                        padding-left: 2.7rem;
                        display: inline-block;
                    }

                    display: block !important;

                    .node-short-name {
                        display: block !important;
                        color: var(--dark-04) !important;
                        font-size: var(--font-sm);
                        text-align: center;
                    }
                }
            }

        }
    }
}

// collpase menu

// search Style start
.collapse-menu {
    .search-wrapper {
        position: relative;

        &::after {
            content: '';
            position: absolute;
            height: 1px;
            background: #d4dbe2;
            width: 88%;
        }

        .el-button {
            padding: 10px 0 !important;
            width: 100%;
            display: block;
        }

        .serach-button {
            padding: 0 0 1rem 0 !important;
        }

        .node-search-icon {
            font-size: 2.4rem;
            display: block;
            // padding-left: 2.4rem;
        }

        .search-name {
            color: var(--dark-04) !important;
            font-size: var(--font-sm);
            text-align: center;
            display: block !important;
        }

    }

    .node-search-input-container {
        display: none;
    }
}

.search-wrapper {
    .el-button {
        padding: 10px 0;
        border: 0;
        width: 96%;
    }

    .node-search-icon,
    .search-name {
        display: none;
        border: 0;
    }

    .node-search-input-container {
        position: relative;

        .search-int-icon {
            font-size: 1.6rem;
            color: var(--dark-03);
            position: absolute;
            top: 4px;
            left: 8px;
            z-index: 99;
        }

        .el-input__inner {
            color: var(--dark-02);
            font-size: var(font-base);
            border: 1px solid var(--dark-06);
            padding-left: 2.5rem;

            &::placeholder {
                color: var(--dark-04);
                font-size: var(font-base);

            }

            &:focus {
                // outline: 2px !important; 
                border: 2px solid var(--brand-05) !important;
            }
        }
    }
}
// search Style end

#canvas-container {
    position: relative !important;
}

.el-dialog__body {
    word-break: normal;
}

.workflow-history-height {
    height: 600px !important;
}

.workflow-history-height {
    height: 600px !important;
}

.wf-history-not-found {
    display: flex;
    justify-content: center;
    line-height: 10;
}
</style>
