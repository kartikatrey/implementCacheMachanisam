<template>
<el-main>
    <div class="kp-back-to-parent">
        <el-button class="kp-btn-back" icon="el-icon-back" v-on:click="displayList"></el-button>
        <h1 class="kp-page-title">{{pageTitle}}</h1>
    </div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path:'/ks-model-config-list' }">KS model</el-breadcrumb-item>
        <el-breadcrumb-item>{{pageTitle}}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Form  Page -->
    <el-form :label-position="labelPosition" label-width="100px" :model="ks_model_config" :rules="validationRules" ref="ruleForm">
        <ConfirmModel ref="model"></ConfirmModel>
        <div class="kp-form-area kp-tabs">
            <el-tabs class="kp-form-tabs-panel" v-model="tabIndex" type="card">
                <el-tab-pane class="kp-tabs-body" label="Basic">
                    <el-row>
                        <el-col>
                            <el-row :gutter="72">
                                <el-col :span="8">
                                    <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item prop="customer_id" label="Customer" class="kp-form-field-label">
                                            <el-select @change="onCustomerChange" placeholder="Please select customer" v-model="ks_model_config.customer_id" filterable clearable >
                                                <el-option v-for="customer in customers" :value="customer._id" :key="customer._id" :label="customer.customer_name"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item label="PT host" prop="pt_host" class="kp-form-field-label">
                                            <el-input v-model="ks_model_config.pt_host" placeholder="E.g. http://sandbox-api.kanverse.ai:8080"></el-input>
                                        </el-form-item>
                                    </div>

                                    <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item label="TF host" prop="tf_host" class="kp-form-field-label">
                                            <el-input v-model="ks_model_config.tf_host" placeholder="E.g. http://sandbox-api.kanverse.ai:8501"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item label="Usecase" prop="usecase" class="kp-form-field-label">
                                            <el-input v-model="ks_model_config.usecase" placeholder="E.g. NER prediction"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item label="Module" prop="module" class="kp-form-field-label">
                                            <el-input v-model="ks_model_config.module" placeholder="E.g. DA"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item label="Domain" prop="domain" class="kp-form-field-label">
                                            <el-input v-model="ks_model_config.domain" placeholder="E.g. CRM-SFDC"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item label="Serving method" prop="serving_method" class="kp-form-field-label">
                                            <el-input v-model="ks_model_config.serving_method" placeholder="E.g. tensorflow"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item label="Network type" prop="network_type" class="kp-form-field-label">
                                            <el-input v-model="ks_model_config.network_type" placeholder="E.g. LSTM"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item label="Model type" prop="model_type" class="kp-form-field-label">
                                            <el-input v-model="ks_model_config.model_type" placeholder="E.g. NERV2"></el-input>
                                        </el-form-item>
                                    </div>

                                    <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item label="Versions" prop="versions" class="kp-form-field-label">
                                            <el-input v-model="ks_model_config.versions" placeholder="E.g. 1,2,3"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item label="Model name" prop="model_name" class="kp-form-field-label">
                                            <el-input v-model="ks_model_config.model_name" placeholder="E.g. NER"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item label="Controller" prop="controller" class="kp-form-field-label">
                                            <el-input v-model="ks_model_config.controller" placeholder="E.g. tensorflow"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item label="Subtype" prop="subtype" class="kp-form-field-label">
                                            <el-input v-model="ks_model_config.subtype" placeholder="E.g. INVOICE"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item label="Default version" prop="default_version" class="kp-form-field-label">
                                            <el-input type="number" min="0" v-model="ks_model_config.default_version" placeholder="Eg. 1"></el-input>
                                            <!-- <el-input v-model="ks_model_config.default_version" placeholder="E.g. 1.0"></el-input> -->
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="Config">
                    <el-row>
                        <el-col>
                            <el-row :gutter="72">
                                <el-col :span="11">
                                    <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item label="Request body" prop="request_body" class="kp-form-field-label"></el-form-item>
                                        <codemirror v-model="ks_model_config.request_body" :value="ks_model_config.request_body" :options="editorOptions"></codemirror>
                                    </div>
                                    <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item label="Config" prop="config" class="kp-form-field-label"></el-form-item>
                                        <codemirror v-model="ks_model_config.config" :value="ks_model_config.config" :options="editorOptions"></codemirror>
                                    </div>
                                </el-col>
                                <el-col :span="11">
                                    <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item label="Response body" prop="response_body" class="kp-form-field-label"></el-form-item>
                                        <codemirror v-model="ks_model_config.response_body" :value="ks_model_config.response_body" :options="editorOptions"></codemirror>
                                    </div>
                                    <!-- <div class="kp-form-input-1 kp-form-field">
                                        <el-form-item label="Train config" prop="train_config" class="kp-form-field-label"></el-form-item>
                                        <codemirror v-model="ks_model_config.train_config" :value="ks_model_config.train_config" :options="editorOptions"></codemirror>
                                    </div> -->
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs>

            <el-button class="kp-btn-form-outline" id="btPrev" @click="prevButton">Previous</el-button>
            <el-button class="kp-btn-form-outline" id="btNext" @click="nextButton">Next</el-button>

            <el-button class="kp-btn-form-primary" v-on:click.once="save" :key="buttonKey" type="primary">
                Save</el-button>
            <el-button v-on:click="displayList" class="kp-btn-form-outline">Cancel</el-button>
            <div v-if="!isFormValid" class="kp-form-error">
                * Please check field with errors
            </div>

        </div>
    </el-form>
</el-main>
</template>

<script>
import _ from "lodash";
import Json from "@/util/Json";
import Codemirror from "@/components/Codemirror";
import CustomerService from "@/services/CustomerService";
import CommonService from "@/services/CommonService";
import constants from "@/resources/Constants";
import Validator from "@/services/Validator";
import ConfirmModel from "@/components/ConfirmModel";

export default {
    name: "KsModelConfigFrom",
    components: {
        Codemirror,
        ConfirmModel
    },
    data() {
        return {
            requiredParam: {},
            isFormValid: true,
            cacheDataModal: {
                cachedForm: {},
                isFormEdited: false,
            },
            labelPosition: "top",
            pageTitle: "New model",
            editorOptions: {
                mode: "text/javascript",
                theme: "default",
                value:"{}"
            },
            ks_model_config: {},
            endpoint: constants.KS_MODEL_ENDPOINT,
            customers: [],
            submitted: null,
            loadingInstance: null,
            buttonKey: 1,
            validationRules: this.setValidationRules(),
            tabIndex: 0
        };
    },
    watch: {
        ks_model_config: {
            handler(newVal, oldVal) {
                let cachedForm = _.pickBy(this.cacheDataModal.cachedForm, _.identity);
                let ks_model_config = _.pickBy(this.ks_model_config, _.identity);
                cachedForm = JSON.stringify(cachedForm).replace(/\\n|\\t|\\r/g, "");
                ks_model_config = JSON.stringify(ks_model_config).replace(/\\n|\\t|\\r/g, "");
                this.cacheDataModal.isFormEdited = cachedForm != ks_model_config;
            },
            deep: true
        }
    },
    methods: {
        async init() {
            const modelId = this.getModelIdFromUrl();

            if (modelId) {
                let ks_model_config = await CommonService.fetchById(
                    this.endpoint,
                    modelId
                ).catch(error => {
                    this.notifyError("Error while fetching model data");
                });

                this.ks_model_config =
                    (ks_model_config &&
                        _.defaultsDeep(ks_model_config, this.ks_model_config)) ||
                    this.ks_model_config;

                this.cacheDataModal.cachedForm = {
                    ...this.ks_model_config
                };

                this.pageTitle = "Edit model";
            } else {
                this.cacheDataModal.cachedForm = {
                    ...this.ks_model_config
                };
            }
        },

        getModelIdFromUrl() {
            return this.$route.query.id || "";
        },

        async fetchCustomers() {
            this.customers = await CustomerService.find().catch(error => {
                this.notifyError("Error while fetching customer");
            });
        },
        onCustomerChange(customer_id) {
            let customer = _.find(this.customers, {
                _id: customer_id
            });
            this.ks_model_config.customer_name = customer.customer_name;
        },

        async save() {
            let isValid = await this.$refs.ruleForm.validate().catch(error => {});
            this.isFormValid = isValid;
            this.cacheDataModal.isFormEdited = false;
            this.ks_model_config.versions = _.isString(this.ks_model_config.versions) ? this.ks_model_config.versions.split(",") : this.ks_model_config.versions;
            let ks_model_config =
                isValid &&
                (await CommonService.save(this.endpoint, this.ks_model_config).catch(
                    error => {
                        this.isFormValid = false;
                        this.notifyError("Error while saving model data");
                    }
                ));
            if (ks_model_config) {
                this.ks_model_config._id = ks_model_config._id;
                this.notifySuccess("Model saved successfully");
                this.displayList();
            }
            this.buttonKey++;
        },

        displayList() {
            this.$router.push({
                path: "/ks-model-config-list"
            });
        },
        setValidationRules() {
            return {
                model_name: [{
                    required: true,
                    message: "Please input model name",
                    trigger: "change"
                }],
                customer_id: [{
                    required: true,
                    message: "Please input customer name",
                    trigger: "change"
                }],
                domain: [{
                    required: true,
                    message: "Please input domain",
                    trigger: "change"
                }],
                serving_method: [{
                    required: true,
                    message: "Please input serving method",
                    trigger: "change"
                }],
                controller: [{
                    required: true,
                    message: "Please input controller",
                    trigger: "change"
                }],
                config: [{
                    required: true,
                    validator: Validator.scriptValidator,
                    message: "Please input configuration",
                    trigger: "change"
                }],
                request_body: [{
                    required: true,
                    validator: Validator.scriptValidator,
                    message: "Please input request body",
                    trigger: "change"
                }],
                response_body: [{
                    required: true,
                    validator: Validator.scriptValidator,
                    message: "Please input response body",
                    trigger: "change"
                }],

            };
        },

        prevButton() {
            var bt = document.getElementById("btPrev");
            if (this.tabIndex == 0) {
                bt.setAttribute("disabled", true);
                bt.classList.add("kp-btn-form-disabled");
                return;
            }
            this.tabIndex--;
            if (this.tabIndex >= 0) {
                bt.removeAttribute("disabled");
                bt.classList.add("kp-btn-form-outline");
                document.getElementById("tab-" + this.tabIndex).click();
                var nextBtn = document.getElementById("btNext");
                nextBtn.removeAttribute("disabled");
            } else {
                bt.setAttribute("disabled", true);
                bt.classList.add("kp-btn-form-disabled");
            }
        },

        nextButton() {
            var index = this.tabIndex;
            var bt = document.getElementById("btNext");
            index++;
            if (document.getElementById("tab-" + index) == null) {
                bt.setAttribute("disabled", true);
                bt.classList.add("kp-btn-form-disabled");
                return;
            }
            this.tabIndex++;

            if (document.getElementById("tab-" + this.tabIndex) != null) {
                bt.removeAttribute("disabled");
                bt.classList.add("kp-btn-form-outline");
                document.getElementById("tab-" + this.tabIndex).click();
                var preBtn = document.getElementById("btPrev");

                preBtn.removeAttribute("disabled");
            } else {
                bt.setAttribute("disabled", true);
                bt.classList.add("kp-btn-form-disabled");
            }
        }
    },

    beforeMount() {
        let user = this.$store.getters.user;
        if (user.roles.includes("admin")) {
            this.showList = true;
        }
        this.init();
        this.fetchCustomers();
        window.addEventListener("beforeunload", event => {
            if (!this.cacheDataModal.isFormEdited) return;
            event.preventDefault();
            event.returnValue = "";
        });
    },
    beforeRouteLeave: function (to, from, next) {
        if (this.cacheDataModal.isFormEdited) {
            return this.$refs.model.open(next);
        } else {
            return next();
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";

.kp-form-tabs-panel {
    margin-top: 32px;
    margin-bottom: 32px;
    box-shadow: 0 0px 6px 1px rgba(0, 0, 0, 0.1);
    background: transparent;
    border-radius: 7px;

    .el-tabs:not(.el-tabs--border-card) .el-tabs__item:not(.is-active) {
        background: green;
    }
}

.kp-from-actions {
    margin-top: 40px;
}

// Global Ends
.el-form-item__error {
    position: unset;
}
</style> */
