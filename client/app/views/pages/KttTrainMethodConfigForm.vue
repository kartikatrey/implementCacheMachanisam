<template>
<el-main>
    <div class="kp-back-to-parent">
        <el-button class="kp-btn-back" icon="el-icon-back" v-on:click="displayList"></el-button>
        <h1 class="kp-page-title">{{pageTitle}}</h1>
    </div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/ktt-train-method-config-list' }">Training tool configurations</el-breadcrumb-item>
        <el-breadcrumb-item>{{pageTitle}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="kp-form-area">
        <div class="kp-form-panel">
            <el-row>
                <el-col>
                    <el-form :model="ktt_train_method_config" :rules="validationRules" ref="ruleForm">
                        <ConfirmModel ref="model"></ConfirmModel>
                        <el-row :gutter="72">
                            <el-col :span="8">
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" label="Name" prop="name">
                                        <el-input v-model="ktt_train_method_config.name" placeholder="Please input"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" prop="method" label="Method">
                                        <el-input v-model="ktt_train_method_config.method" placeholder="Please input"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="72">
                            <el-col :span="8">
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" label="Method description" prop="method_desc">
                                        <el-input v-model="ktt_train_method_config.method_desc" placeholder="Please input"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" prop="model_type" label="Model type">
                                        <el-input v-model="ktt_train_method_config.model_type" placeholder="Please input"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="72">
                            <el-col :span="8">
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" prop="template_id" label="Template">
                                        <el-select clearable placeholder="Please select template" v-model="ktt_train_method_config.template_id">
                                            <el-option v-for="template in templates" :value="template._id" :key="template._id" :label="template.name"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" label="Image name" prop="image_name">
                                        <el-input v-model="ktt_train_method_config.image_name" placeholder="Please input"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="72">
                            <el-col :span="8">
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" label="Code storage path" prop="code_storage_path">
                                        <el-input v-model="ktt_train_method_config.code_storage_path" placeholder="Please input"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" prop="file_storage_path" label="File storage path">
                                        <el-input v-model="ktt_train_method_config.file_storage_path" placeholder="Please input"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="72">
                            <el-col :span="8">
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" prop="pretrained_remote_mount_dir" label="Pretrained model directory">
                                        <el-input v-model="ktt_train_method_config.pretrained_remote_mount_dir" placeholder="Please input"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="72">
                            <el-col :span="24">
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" label="Config" prop="config"></el-form-item>
                                    <codemirror v-model="ktt_train_method_config.config" :value="ktt_train_method_config.config" :options="editorOptions"></codemirror>
                                </div>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <el-button v-on:click.once="onSave" :key="buttonKey" class="kp-btn-form-primary" type="primary">Save</el-button>
        <el-button v-on:click="displayList" class="kp-btn-form-outline">Cancel</el-button>
        <div v-if="!isFormValid" class="kp-form-error">
            * Please check field with errors
        </div>
    </div>
</el-main>
</template>

<script>
import _ from "lodash";
import Json from "@/util/Json";
import Codemirror from "@/components/Codemirror";
import TrainingService from "@/services/TrainingService";
import CommonService from "@/services/CommonService";
import constants from "@/resources/Constants";
import Validator from "@/services/Validator";
import ConfirmModel from "@/components/ConfirmModel";

export default {
    name: "KttTrainMethodConfigForm",
    components: {
        Codemirror,
        ConfirmModel
    },
    data() {
        return {
            requiredParam: {},
            cacheDataModal: {
                cachedForm: {},
                isFormEdited: false,
                isEditForm: false,
                isNewForm: false,
            },
            buttonKey: 1,
            pageTitle: "New configuration",
            editorOptions: {
                mode: "text/javascript",
                theme: "default"
            },
            ktt_train_method_config: {},
            templates: [],
            isFormValid: true,
            endpoint: constants.KTT_TRAIN_METHOD_CONFIG_ENDPOINT,
            validationRules: this.setValidationRules()
        };
    },
    watch: {
        ktt_train_method_config: {
            handler(newVal, oldVal) {
                if (this.cacheDataModal.isNewForm || this.cacheDataModal.isEditForm) {
                    this.cacheDataModal.isFormEdited =
                        JSON.stringify(this.cacheDataModal.cachedForm) !=
                        JSON.stringify(this.ktt_train_method_config);

                }
            },
            deep: true
        }
    },
    methods: {
        async init() {
            const configId = this.getConfigIdFromUrl();
            if (configId) {
                let ktt_train_method_config = await CommonService.fetchById(
                    this.endpoint,
                    configId
                ).catch(error => {
                    this.notifyError("Error while fetching config data");
                });

                this.ktt_train_method_config =
                    (ktt_train_method_config &&
                        _.defaultsDeep(
                            ktt_train_method_config,
                            this.ktt_train_method_config
                        )) ||
                    this.ktt_train_method_config;
                this.cacheDataModal.isEditForm = true;
                this.cacheDataModal.isFormEdited = false;
                this.cacheDataModal.cachedForm = {
                    ...this.ktt_train_method_config
                };
                this.pageTitle = "Edit configuration";
            } else {
                this.cacheDataModal.isNewForm = true;
                this.cacheDataModal.isFormEdited = false;
                this.cacheDataModal.cachedForm = {
                    ...this.ktt_train_method_config
                };
            }
        },
        getConfigIdFromUrl() {
            return this.$route.query.id || "";
        },
        async onSave() {
            let isValid = await this.$refs.ruleForm.validate().catch(error => {});
            this.isFormValid = isValid;
            this.cacheDataModal.isFormEdited = false;
            let ktt_train_method_config =
                isValid &&
                (await CommonService.save(
                    this.endpoint,
                    this.ktt_train_method_config
                ).catch(error => {
                    this.isFormValid = false;
                    this.notifyError("Error while saving config data!!");
                }));
            if (ktt_train_method_config) {
                this.ktt_train_method_config._id = ktt_train_method_config._id; // add service id after first request to existing service object to avoid duplicate service entries
                this.notifySuccess("Config data saved successfully!!");
                this.displayList();
            }
            this.buttonKey++;
        },

        async fetchTemplates() {
            this.templates = await TrainingService.find().catch(error => {
                this.notifyError("Error while fetching templates");
            });
        },

        displayList() {
            this.$router.push({
                path: "/ktt-train-method-config-list"
            });
        },
        setValidationRules() {
            return {
                name: [{
                    required: true,
                    message: "Please input name",
                    trigger: "blur"
                }],
                model_type: [{
                    required: true,
                    message: "Please input model type",
                    trigger: "blur"
                }],
                config: [{
                    validator: this.validateRequestHeader,
                    trigger: "blur"
                }]
            };
        },
        validateRequestHeader(rule, value, callback) {
            if (_.isEmpty(value)) {
                callback();
            }
            Json.isJson(value) ?
                callback() :
                callback(new Error("Please input correct JSON format!!"));
        }
    },

    beforeMount() {
        let user = this.$store.getters.user;
        if (user.roles.includes("admin")) {
            this.showList = true;
        }
        this.init();
        this.fetchTemplates();
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
@import "../../assets/scss/_variables";

.el-form-item__error {
    position: unset;
}

// end form section
</style>
