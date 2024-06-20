<template>
<el-main>
    <div class="kp-back-to-parent">
        <el-button class="kp-btn-back" icon="el-icon-back" v-on:click="displayList"></el-button>
        <h1 class="kp-page-title">{{pageTitle}}</h1>
    </div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: 'script-list' }">Script</el-breadcrumb-item>
        <el-breadcrumb-item>{{pageTitle}}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Form  Page -->

    <div class="kp-form-area">
        <div class="kp-form-panel">
            <el-row>
                <el-col>
                    <el-form :label-position="labelPosition" label-width="100px" :model="form" :rules="validationRules" ref="form">
                        <ConfirmModel ref="model"></ConfirmModel>
                        <el-row :gutter="72">
                            <el-col :span="8">
                                <div class="kp-form-select-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" prop="script_name" label="Script name" placeholder="Eg. 4">
                                        <el-input placeholder="Script Name" v-model="form.script_name"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="kp-form-select-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" prop="type" label="Type">
                                        <el-select v-model="form.type" placeholder="Select">
                                            <el-option v-for="(value) in scriptType" :key="value" :value="value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="72">
                            <el-col :span="8">
                                <div class="kp-form-select-1 kp-form-field">
                                    <el-form-item prop="script" label="Script" id="code-mirror-wrapper">
                                        <codemirror :value="form.script" v-model="form.script" :options="editorOptions"></codemirror>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <el-button type="primary" v-on:click.once="onSave" :key="buttonKey" class="kp-btn-form-primary">
            Save
        </el-button>
        <el-button v-on:click="$router.push('script-list')" class="kp-btn-form-outline">
            Cancel
        </el-button>
        <div v-if="!isFormValid" class="kp-form-error">
            * Please check field with errors
        </div>
    </div>
</el-main>
</template>

<script>
import _ from "lodash";
import Constants from "@/resources/Constants";
import Codemirror from "@/components/Codemirror";
import ScriptService from "@/services/ScriptService";
import ConfirmModel from "@/components/ConfirmModel";

export default {
    name: "ScriptForm",
    components: {
        Codemirror,
        ConfirmModel
    },
    data() {
        return {
            labelPosition: "top",
            isFormValid: true,
            cacheDataModal: {
                cachedForm: {},
                isFormEdited: false,
                isEditForm: false,
                isNewForm: false,
            },
            pageTitle: "New script",
            scriptType: Constants.SCRIPT_TYPE,
            buttonKey: 1,
            form: {
                script: "",
                script_name: "",
                type: ""
            },
            editorOptions: {
                mode: "text/javascript",
                theme: "default"
            },
            validationRules: this.validationRules()
        };
    },
    watch: {
        form: {
            handler(newVal, oldVal) {
                if (this.cacheDataModal.isNewForm || this.cacheDataModal.isEditForm) {
                    this.cacheDataModal.isFormEdited =
                        JSON.stringify(this.cacheDataModal.cachedForm) !=
                        JSON.stringify(this.form);
                }
            },
            deep: true
        }
    },
    methods: {
        addRoutingStatements() {
            this.form.routingData.push({});
        },

        async init() {
            try {
                if (!this.$route.query.id) {
                    this.cacheDataModal.isNewForm = true;
                    this.cacheDataModal.isFormEdited = false;
                    this.cacheDataModal.cachedForm = {
                        ...this.form
                    };
                    return;
                }
                await this.setForm();
            } catch (e) {
                console.log(e);
            }
        },
        async setForm() {
            this.scriptData = await ScriptService.fetchById(this.$route.query.id);
            this.form = this.scriptData;
            this.cacheDataModal.isEditForm = true;
            this.cacheDataModal.isFormEdited = false;
            this.cacheDataModal.cachedForm = {
                ...this.form
            };
            this.pageTitle = "Edit script";
        },

        async onSave() {
            this.isFormEdited = false;
            let isValid = await this.$refs.form.validate().catch(error => {});
            this.isFormValid = isValid;
            this.cacheDataModal.isFormEdited = false;
            let form =
                isValid &&
                (await ScriptService.save(this.form).catch(
                    error => {
                        this.isFormValid = false;
                        this.notifyError("Error while saving script data!!");
                    }
                ));
            if (form) {
                this.form._id = form._id;
                this.notifySuccess("Script saved successfully!!");
                this.displayList();
            }
            this.buttonKey++;
        },
        
        displayList() {
            this.$router.push({
                path: "/script-list"
            });
        },

        validationRules() {
            return {
                type: [{
                    required: true,
                    message: "Please select type",
                    trigger: "blur"
                }],
                script_name: [{
                    required: true,
                    message: "Please enter script name",
                    trigger: "change"
                }]
            };
        }
    },

    beforeMount() {
        let user = this.$store.getters.user;
        if (user.roles.includes("admin")) {
            this.showList = true;
        }
        this.init();
        window.addEventListener("beforeunload", event => {
            if (!this.cacheDataModal.isFormEdited) return;
            event.preventDefault();
            event.returnValue = "";
        });
    },
    beforeRouteLeave: function (to, from, next) {
        if (this.cacheDataModal.isFormEdited) {
            //    return window.confirm('Do you really want to leave? you have unsaved changes!')
            return this.$refs.model.open(next);
        } else {
            return next();
        }
    }
};
</script>

<style lang="scss">
// Global Components

@import "../../assets/scss/_variables";
</style>
