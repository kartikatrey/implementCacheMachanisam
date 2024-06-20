<template>
    <el-main class="kp-main kp-without-navbar">
        <div class="editor-container">

            <!-- Workflow Header with WF Name -->
            <div class="fc-toolbar fc-header-toolbar ">
                <div class="title">
                    <el-button type="text"> <i @click="showDisplayList" class="mdi mdi-arrow-left-circle-outline"></i>
                    </el-button> {{ dialogFlowData.name }}
                </div>
                <div class="toolbar-action">
                    <el-button v-if="isSaveActionAllowed" type="primary" :disabled="disableSave || visiblePropertWindow" v-on:click="save"
                        cid="form-header-save" size="small"> Save</el-button>
                    <el-button class="btn-clone" :disabled="visiblePropertWindow" cid="form-header-clone"
                        v-if="isDisplayClone()" v-on:click="createDialogFlowClone()" size="small"> Clone</el-button>

                    <el-button class="btn-fullscreen" text size="small" @click="toggleFullscreen">
                        <i class="mdi mdi-fullscreen"></i>
                    </el-button>
                </div>
            </div>

            <!-- Workflow Canvas Editor -->
            <canvas-container cid="workflow-form-container" v-if="!showElements" v-bind:showSlide.sync="showSlide"
                v-bind:dialogFlowData="dialogFlowData" v-bind:workflowType="workflowType"
                :showComponentPanel="showComponentPanel" class="rete-container" ref="canvas"></canvas-container>

            <!-- Slideout Component -->
            <Slideout :close-on-mask-click="closeOnMaskClick" size="37%" @close="onClose" v-if="showSlide" append-to="#workflow-wrapper" dock="right" :visible.sync="visiblePropertWindow">
                <properties v-if="!showElements && visiblePropertWindow" v-bind:dialogFlowData="dialogFlowData" v-bind:workflowType="workflowType" :documentTypes="documentTypes"></properties>
            </Slideout>
        </div>
    </el-main>
</template>

<script>
import $ from 'jquery';
import _ from 'lodash';
import EventBus from "@/EventBus";
import "splitpanes/dist/splitpanes.css";
import CanvasContainer from "@/dialogflow/components/Canvas";
import Properties from "@/dialogflow/components/Properties";
import TableAPIService from "@/services/TableAPIService";
import { Splitpanes, Pane } from "splitpanes";
import jsonData from "../data.json"; //workflowJSON
let tableAPI = new TableAPIService();
const uuidv4 = require('uuid/v4');
import Slideout from '@hyjiacan/vue-slideout'
import '@hyjiacan/vue-slideout/lib/slideout.css'
import CustomerConfig from "@/idp/services/DeCustomerConfig";
import DialogFlowService from "@/dialogflow/services/DialogFlowService";
import formMixin from "@/mixins/formMixin.js";

export default {
    mixins: [formMixin],
    data() {
        return {
            closeOnMaskClick: true,
            paneSize: 60,
            contextMenuPaneSize: 30,
            showElements: true,
            nodeData: "",
            documentTypes: [],
            dialogFlowData: {},
            workflowType: "",
            zoom: 1,
            disableSave: false,
            isSaveActionAllowed: false,
            isClone: false,
            visiblePropertWindow: false,
            showSlide: false,
            dirty: false,
            clonedDialogFlow: "",
            defaultWorkFlowName: "New Workflow",
            showComponentPanel: true
        };
    },
    // watch: {
    //     dialogFlowData: {
    //         handler: function (newVal, oldVal) {
    //             // if (_.isEmpty(this.clonedDialogFlow) || _.isEmpty(newVal)) return;
    //             // const dirty = (JSON.stringify(newVal) !== JSON.stringify(this.clonedDialogFlow));
    //             // alert(dirty)
    //         },
    //         immediate: true,
    //         deep: true,
    //     }
    // },
    computed: {
        getElement() {
            return $(`.idp-toolbar`)
        },
        getTitle() {
            return this.dialogFlowData && this.dialogFlowData.workflow_data && this.dialogFlowData.workflow_data.nodes[6] && this.dialogFlowData.workflow_data.nodes[6].data["connections"][0]["label"]
        }

    },

    components: {
        Slideout,
        Splitpanes,
        CanvasContainer,
        Properties,
        Pane
    },
    methods: {
        toggleFullscreen() {
            this.$fullscreen.toggle(document.querySelector("body"), {
                wrap: false,
                callback: () => {
                    this.fullscreen = this.$fullscreen.getState();
                },
            });
        },
        showDisplayList() {
            this.$router.push({
                path: "/idp/workflows"
            });
        },
        async onClose(e) {
            // prevent close and wait
            e.wait = true
            try {
                if (this.$store.state.wfDirtyFlag) {
                    await this.$confirm('You have made changes to this shape. Are you sure that you want to discard the changes?', 'Confirm', {
                        closeOnClickModal: false,
                        confirmButtonText: 'Cancel',
                        cancelButtonText: 'Discard Changes'
                    })
                    this.closeSlidebar(e, false)
                    return;
                }
                this.closeSlidebar(e)

            } catch (err) {
                this.closeSlidebar(e)
                this.$store.commit("setWfDirtyFlag", false);
            }
        },

        closeSlidebar(e, close = true) {
            close ? this.visiblePropertWindow = false : null;
            e.close = close;
            e.wait = false;
        },

        closed() {
            alert('closed')
        },

        onClosing(e) {
            // prevent close and wait
            e.pause = true
            // close after 3 seconds
            setTimeout(() => {
                // assign true to close, do nothing or assign false to cancel close.
                e.resume = true
            }, 3000)
        },

        checkEmpty() {
            this.showElements = _.isEmpty(this.dialogFlowData) ? true : false;
        },

        async init(jsonData) {
            this.workflowType = this.getTypeFromUrl()
            let dialogFlowId = this.getIdFromUrl();
            this.originalDialogFlowData = {};
            let docTypeConfig = await CustomerConfig.getAllDocsCustConfiguration({document_type: {$exists: true}});
            this.documentTypes = CustomerConfig.getDocumentTypeList(docTypeConfig, true);
            if (dialogFlowId) {
                this.dialogFlowData = await DialogFlowService.fetchById(dialogFlowId).catch(error => {
                    this.notifyError("Error while fetching workflow data");
                });
                this.isClone = _.isObject(this.dialogFlowData) ? true : false;
                this.workflowType = this.dialogFlowData.workflow_type
            } else
                await Object.assign(this.dialogFlowData, jsonData);
            this.dialogFlowData.name = this.dialogFlowData.name ? this.dialogFlowData.name : this.defaultWorkFlowName;
            this.dialogFlowData.workflow_type = this.workflowType
            this.dialogFlowData.workflow_version = this.dialogFlowData.workflow_version || "3";
            this.$forceUpdate();
            this.originalDialogFlowData = _.cloneDeep(this.dialogFlowData);
        },

        //To display WorkFlowProperties On button click
        displayWorkFlowProperties() {
            EventBus.$emit("DISPLAY_PROPERTY_WINDOW", {
                name: "Properties"
            });
        },
        //To get DialogFlowId from routes
        getIdFromUrl() {
            return this.$route.query.id || "";
        },

        getTypeFromUrl() {
            return this.$route.query.workflowType || "";
        },
        //To save complete dialogFlow
        async save() {
            this.disableSave = true;
            this.dialogFlowData.active = true;
            this.dialogFlowData.workflow_type = this.dialogFlowData.workflow_type || this.workflowType;
            this.dialogFlowData.workflow_version = this.dialogFlowData.workflow_version;
            let response = await DialogFlowService.save(this.dialogFlowData).catch(
                error => {
                    this.disableSave = false
                    this.notifyError("Error while updating workflow");
                }
            );
            this.disableSave = false
            if (response) {
                if (response.code == 11000) {
                    this.notifyError("Workflow name is already present.");
                    this.displayWorkFlowProperties()
                    return false
                }
                this.dialogFlowData._id = response._id;
                this.isClone = _.isObject(response) ? true : false;
                Object.assign(this.originalDialogFlowData, this.dialogFlowData)
                this.notifySuccess("Workflow saved successfully");
            }
        },

        zoomIn() {
            let parent = document.getElementById("rete");
            let child = parent.childNodes[0];
            this.zoom = this.zoom + 0.2;
            child.style.transform = "scale(" + this.zoom + ")";
        },
        zoomOut() {
            var parent = document.getElementById("rete");
            var child = parent.childNodes[0];
            this.zoom = this.zoom - 0.2;
            child.style.transform = "scale(" + this.zoom + ")";
        },
        exportJson() {
            this.saveDraft();
            if (this.dialogFlowData._id) {
                const endPoint = `${window.location.origin}/portal/api/table/workflow/${this.dialogFlowData._id}?exportJson=true`;
                window.open(endPoint, '_self');
                this.notifySuccess("Workflow exported successfully!!");
                return;
            }
            this.notifyError("Please save workflow before export!!");
        },
        isDisplayClone() {
            return this.isClone;
        },
        async saveDraft() {
            if (this.hasFormChanged()) {
                let message = "There are some changes in draft, do you want to save them?";
                let confirmButtonText = "Save";
                let isConfirm = await this.notifyConfirm(message, confirmButtonText).catch(error => {
                    message = "Please save workflow data to proceed!!";
                    this.notifyError(message);
                });
                isConfirm && (await this.save());
            }
        },
        async createDialogFlowClone() {
            try {
                await this.saveDraft();
                delete this.dialogFlowData._id;
                await this.updateNodeIds();
                this.dialogFlowData.name = `copy of ${this.dialogFlowData.name}`;
                await this.save();
                this.$router.push({
                    path: "/idp/workflow",
                    query: {
                        id: this.dialogFlowData._id
                    }
                });
            } catch (error) {
                this.notifyError("Error while creating clone!!");
            }
        },
        updateNodeIds() {
            _.forEach(this.dialogFlowData.workflow_data.nodes, function (value, key) {
                value['data'].node_id = uuidv4()
            });
        },

        handleShowPropertyWindow(visiblePropertWindow, node) {
            if (!visiblePropertWindow) {
                this.$store.commit("setWfDirtyFlag", false);
            }
            this.visiblePropertWindow = visiblePropertWindow;
            visiblePropertWindow && node && this.$nextTick(() => {
                EventBus.$emit("DISPLAY_PROPERTY_WINDOW", node);
            })
        },

        resetWfDirtyFlag() {
            this.$store.commit("setWfDirtyFlag", false);
        },

        preventNav(event) {
            if (!this.hasFormChanged()) return;
            event.preventDefault();
            event.returnValue = "";
            this.resetWfDirtyFlag()
        },

        hasFormChanged() {
            return (JSON.stringify(this.dialogFlowData) !== JSON.stringify(this.originalDialogFlowData))
        },

    },
    mounted() {
        console.log("editor page mounted");
    },
    async beforeMount() {
        this.isSaveActionAllowed = await this.isSaveActionPermitted('workflow');
        // let cloned_json_data= _.cloneDeep(jsonData);
        EventBus.$on("VISIBLE_SLIDEOUT", (visiblePropertWindow, node) => {
            this.handleShowPropertyWindow(visiblePropertWindow, node)
        });

        EventBus.$on("CLOSE_ON_MASK_CLICK", (value) => {
            this.closeOnMaskClick = value
        });
        let self = this;
        this.$store.commit("setDisplayIdpTree",false);
        this.$store.commit("setDisplayIdpNavbar",false);
        this.init(_.cloneDeep(jsonData));
        window.addEventListener("beforeunload", this.preventNav);
        this.$once("hook:beforeDestroy", () => {
            window.removeEventListener("beforeunload", this.preventNav);
        });
    },

    updated() {
        this.checkEmpty();
    },

    async beforeRouteLeave(to, from, next) {
        if (this.hasFormChanged() || this.$store.state.wfDirtyFlag) {
            let res = await this.$confirm(
                `Changes you made may not be saved.`,
                "Leave page?", {
                    confirmButtonText: "Confirm",
                    cancelButtonText: "Cancel",
                    type: "warning"
                }
            ).
            then(() => {
                    next();
                    this.$store.commit("setWfDirtyFlag", false);
                })
                .catch((err) => {
                    next(false)
                })
            return;
        }
        next()
    }
};
</script>

<style lang="scss">
@import "../../idp/_idpGlobal.scss";
@import "../../idp/_idpVariables.scss";

.kp-without-navbar {
    padding: 0 !important;
}

.fc-toolbar.fc-header-toolbar {
    background: var(--dark-08);
    padding: 15px;
    margin-bottom: 0;
    border-bottom: 1px solid var(--dark-07);
    padding: 0 var(--space-lg);
    display: flex;
    justify-content: flex-start;

    .title {
        font-weight: bold;
        // padding-top: 10px;
        font-size: var(--font-lg);
        color: var(--dark-03);

        .el-button {
            color: var(--dark-03);
            font-size: 1.9rem;
            vertical-align: sub;
            margin-right: .5rem;
        }
    }

    .toolbar-action {
        margin-left: 4rem;
        padding-top: 1rem;

        .el-button {
            margin: 0 var(--space-md);
        }

        .btn-clone {
            background: #fff;
            color: var(--brand-05);
            border: 1px solid var(--brand-05);
        }

        .btn-home {
            // padding: 7px 10px !important;
            margin: 0px 0 0 0;
            vertical-align: bottom;

            i {
                color: var(--brand-05);
                font-size: 1.7rem !important;
            }
        }

        .btn-fullscreen {
            position: absolute;
            right: .4rem;
            font-size: 2rem;
            border: 0;
            color: var(--dark-04);

            &:hover {
                transform: scale(1.2);
            }
        }

    }
}

// toolbar

.editor-el-main {
    width: 1030px;
}

.editor-container {
    height: 100%;

    .context-menu {
        overflow: hidden;
        border-radius: 5px;
        padding: 0 !important;
        width: 145px !important;
        box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.2);

        .search {
            display: none;
        }

        .item[data-v-99007bda],
        .item .subitems .subitem[data-v-99007bda] {
            color: #fff;
            border-bottom: none;
            background-color: rgba(3, 168, 224, 0.9);

            cursor: pointer;
            width: 100%;
            position: relative;
            padding: 4px 10px;
        }
    }

    .control-btn-wrap {
        display: inline-block;
        right: 0;
        margin: 10px;
        float: right;
        position: relative;
        z-index: 9999;

        .btn-plus,
        .btn-minus {
            i {
                font-size: 1.1rem;
            }
        }
    }

    .splitpanes--vertical {
        .node-editor {
            // background: #aaa url(../../assets/images/workflow-bg.png) !important;
            height: 900px;
            overflow-y: hidden !important;
        }

        .splitpanes__pane {
            background: #fff !important;
            overflow-y: auto;
        }

        .splitpanes__splitter {
            background: rgba(0, 0, 0, 0.1);
            // background: rgba(255, 255, 255, 0.5);
            border: 0;

            &:before,
            &:after {
                background: #8a8a8a !important;

                height: 70px !important;
                border-radius: 10px;
                width: 2px;
            }
        }
    }

    .default-theme.splitpanes--vertical>.splitpanes__splitter:after,
    .default-theme .splitpanes--vertical>.splitpanes__splitter:after,
    .default-theme.splitpanes--vertical>.splitpanes__splitter:before,
    .default-theme .splitpanes--vertical>.splitpanes__splitter:before {
        background: #fff;
    }

    .el-input,
    .el-radio__label,
    .el-form-item__label,
    .el-select-dropdown__item,
    .el-button {}

    .el-form-item {
        margin-bottom: 0px;
    }

    .el-input__inner {
        height: 30px;
        line-height: 30px;
    }

    .blue-icon {
        color: #667EEA !important;
    }

    .red-icon {
        color: #FE2712 !important;
    }

    .orange-icon {
        color: #FB9902 !important;
    }

    .green-icon {
        color: #66B032 !important;
    }

}

//editor container

.property-wrapper {
    border-radius: 5px;
    width: 100%;
}

.el-tabs__item {
    padding: 0 10px;
}

.splitpanes.default-theme .splitpanes__pane {}

.checkbox-item-container {
    .el-form-item__content {
        margin-left: 0px !important;
    }
}

.codemirror-item-container {
    .el-form-item__content {
        margin-left: 0px !important;
    }
}

////////////////////// forms UI ///////////////////////////////////////////////////////////
.vue-slideout-content {
    overflow: visible;
}



.properties-container {
    height: 100%;
    display: flex;
    flex-direction: column;

    .content-body {
        height: 100%;
        flex: 1;

        .el-tabs,
        .el-tabs__content {
            height: 100%;
            overflow: auto
        }

        .el-tabs__content {
            padding: var(--space-base) var(--space-xxl) var(--space-base) var(--space-xxl);
        }

        .without-tabs-container {
            padding: var(--space-base) var(--space-xxl) var(--space-base) var(--space-xxl);
            border-top: 1px solid var(--dark-07);
        }
    }

    .vue-treeselect__input-container {
            &::selection {
                background-color:var(--white) !important;
            }
    }

    .org-hierarchy{
        background: var(--white);
            .vue-treeselect__control {
                border-radius: 0;
                background: transparent;
                color: var(--dark-01);
                font-size: var(--font-base);
                border: 1px solid var(--dark-03);
                border-radius: .2rem;
                    .vue-treeselect__input {
                        color: var(--dark-01);
                        font-size: var(--font-base);
                        border-radius: .2rem;
                           
                        &::placeholder {
                            color: var(--dark-03);
                             font-size: var(--font-base);
                        }
                    }
            }
    }

    .vue-query-builder {
        .form-control {
                border-radius: 0;
                background: transparent;
                color: var(--dark-01);
                font-size: var(--font-base);
                border: 1px solid var(--dark-03);
                border-radius: .2rem;

                &::placeholder {
                    color: var(--dark-04);
                }
        }
    }

    #query-builder {
        .el-form-item__content {
            margin-left: 0px !important;
        }

        .form-control {
            width: 11rem !important;
        }
        .match-type-container  label {
            width: auto !important;
        }
        .form-inline label {
            width: 100%;
        }
    }

    // content body

    .property-heading {
        margin: 0;
        font-weight: 400;
        color: var(--brand-04);
        font-size: 1.4rem;
        padding: var(--space-base) var(--space-xxl) var(--space-base) var(--space-xxl);
        position: relative;

        .el-button {
            padding: 7px;
            position: absolute;
            left: -1.1rem;
            top: 1.7rem;
            background: var(--brand-09);
            font-size: 1.8rem;
            color: var(--brand-05);
            border: .3rem solid var(--white);
            padding: 0rem;
        }
    }

    .property-bottom-actions {
        background: #fff;
        border-top: 1px solid var(--dark-07);
        display: flex;
        justify-content: flex-end;
        padding: var(--space-base) var(--space-xl);

        .el-button {
            margin: 0 var(--space-sm);
        }
    }

    .el-form-item__error {
        color: var(--red-05);
    }
}

.properties-container {
    .el-tabs__nav-wrap {
        padding-left: var(--space-xxl);

        .el-tabs__header {
            padding-left: 0;
        }

        .el-tabs__item {
            color: var(--dark-01);
            font-weight: 400;
            font-size: var(--font-lg);
        }

        .el-tabs__item.is-active {
            color: var(--brand-05);
        }
    }
}

//tabs UI

button.compile {
    z-index: 5;
    position: absolute;
    top: 10px;
    left: 10px;
}

.el-button+.el-button {
    margin-left: 0px;
}

.content-body {
    overflow-y: auto;
    padding: 0;
            &::-webkit-scrollbar-track {
                -webkit-box-shadow: inset 0 0 6px var(--dark-06);
                background-color: var(--white);
            }

            &::-webkit-scrollbar {
                width: 6px;
                background-color: var(--white);
            }

            &::-webkit-scrollbar-thumb {
                background-color: var(--dark-05);
            }

    .el-select {
        display: block;
    }

    .el-form-item__error {
        position: relative;
    }

    .inline-label-item {
        margin-bottom: var(--space-sm);

        .el-form-item__label {
            width: 130px;
            background: transparent;
            height: 28px;
            line-height: 28px;
            // padding-left: 5px;
            text-align: left;
            font-size: var(--font-base);
            // color: var(--dark-04);
            color: var(--dark-02);
              &::selection {
                background-color:var(--white) !important;
            }
        }

        .el-input__inner {
            height: 28px;
            line-height: 28px;
            // border-top-left-radius: 0;
            // border-bottom-left-radius: 0;
            border-radius: 0;
            background: transparent;
            color: var(--dark-01);
            font-size: var(--font-base);
            border: 1px solid var(--dark-03);
             border-radius: .2rem;

            &::placeholder {
                color: var(--dark-04);
            }
        }

        .el-form-item__content {
            line-height: 28px;
        }

        .el-switch {
            .el-switch__label {
                span {
                    font-weight: 400;
                    font-size: var(--font-base);
                    color: var(--dark-02);
                }

            }

        }
    }

    // inline label

    // Codemirror STyle
    .codemirror-container {
        margin-top: 0;
        font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;

        .label-name {
            color: var(--dark-02);
        }
    }

    .CodeMirror {
        position: relative;
        overflow: hidden;
        border: 1px solid var(--dark-03);
        // background: var(--dark-07) !important;
        background: transparent !important;
        height: 160px;
        font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
    }

    .CodeMirror-gutters {
        left: 0px;
        // background: var(--dark-09) !important;
        background: var(--white) !important;

    }

    /// Codemirror STyle  

    .add-condition-container {
        border-bottom: 2px dashed var(--dark-06);
        padding: 0 0 var(--space-lg) 0;
        margin-bottom: var(--space-lg);

        .btn-delete {
            border: 1px solid var(--red-04);
            color: var(--red-04);
            margin-top: var(--space-base);

            &:hover {
                background: var(--red-09);
            }
        }
    }

    // add condition

}
</style>
