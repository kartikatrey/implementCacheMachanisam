<template>
<el-main>
    <div class="kp-back-to-parent">
        <el-button class="kp-btn-back" icon="el-icon-back" v-on:click="displayList"></el-button>
        <h1 class="kp-page-title">{{pageTitle}}</h1>
    </div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/trn-customer-model-map-list' }">Customer model map</el-breadcrumb-item>
        <el-breadcrumb-item>{{pageTitle}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="kp-form-area">
        <div class="kp-form-panel">
            <el-row>
                <el-col>
                    <el-form :model="trn_customer_model_map" :rules="validationRules" ref="ruleForm">
                        <ConfirmModel ref="model"></ConfirmModel>
                        <el-row :gutter="72">
                            <el-col :span="8">
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" label="Module" prop="module">
                                        <el-input v-model="trn_customer_model_map.module" placeholder="e.g DA"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" prop="model_type" label="Model Type">
                                        <el-input v-model="trn_customer_model_map.model_type" placeholder="e.g. QNA"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" label="Current Model" prop="current_model">
                                        <el-input v-model="trn_customer_model_map.current_model" placeholder="e.g. false"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" label="Storage Path" prop="storage_path">
                                        <el-input v-model="trn_customer_model_map.storage_path" placeholder="e.g. id/QNA/GREETING/1.0"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" label="Model Name" prop="model_name">
                                        <el-input v-model="trn_customer_model_map.model_name" placeholder="e.g. GREETING"></el-input>
                                    </el-form-item>
                                </div>
                               <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item label="Domain" prop="domain" class="kp-form-field-label">
                                    <el-select
                                            v-model="trn_customer_model_map.domain"
                                            clearable
                                            placeholder="Select domain"
                                    >
                                        <el-option
                                            v-for="domain in domains"
                                            :key="domain"
                                            :label="domain"
                                            :value="domain"
                                        >
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                </div>
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" prop="current_model_version" label="Current Version">
                                        <el-input v-model="trn_customer_model_map.current_model_version" placeholder="e.g. 1.0"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" label="Method" prop="method">
                                        <el-input v-model="trn_customer_model_map.method" placeholder="e.g. SK-I"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <el-button v-on:click.once="save" :key="buttonKey" class="kp-btn-form-primary" type="primary">Save</el-button>
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
import TableAPIService from "@/services/TableAPIService";
import ConfirmModel from "@/components/ConfirmModel";
import CommonService from "@/services/CommonService";
import constants from "@/resources/Constants";
export default {
    name: "TrnCustomerModelMapFrom",
    components: {
        Codemirror,
        ConfirmModel
    },
    data() {
        return {
            requiredParam: {},
            pageTitle: "New model",
            editorOptions: {
                mode: "text/javascript",
                theme: "default"
            },
            trn_customer_model_map: {},
            buttonKey: 1,
            isFormValid: true,
            cacheDataModal: {
                cachedForm: {},
                isFormEdited: false,
                isEditForm: false,
                isNewForm: false
            },
            endpoint: "/portal/api/table/trn_customer_model_map",
            validationRules: this.setValidationRules(),
            domains:constants.DOMAINS
        };
    },
    watch: {
        trn_customer_model_map: {
            handler(newVal, oldVal) {
                if (this.cacheDataModal.isNewForm || this.cacheDataModal.isEditForm) {
                    this.cacheDataModal.isFormEdited =
                        JSON.stringify(this.cacheDataModal.cachedForm) !=
                        JSON.stringify(this.trn_customer_model_map);
                }
            },
            deep: true
        }
    },
    methods: {
        async init() {
            this.trn_customer_model_map = {};
            const mappingId = this.getMappingIdFromUrl();
            if (mappingId) {
                let restifyService = new TableAPIService();
                restifyService.findById(this.endpoint, mappingId, (error, response) => {
                    if (error) {
                        this.notifyError("Error while fetching model data");
                    }
                    this.trn_customer_model_map =
                        (response &&
                            _.defaultsDeep(response, this.trn_customer_model_map)) ||
                        this.trn_customer_model_map;
                    this.cacheDataModal.isEditForm = true;
                    this.cacheDataModal.isFormEdited = false;
                    this.cacheDataModal.cachedForm = {
                        ...this.trn_customer_model_map
                    };
                    this.pageTitle = "Edit model";
                });
            } else {
                this.cacheDataModal.isNewForm = true;
                this.cacheDataModal.isFormEdited = false;
                this.cacheDataModal.cachedForm = {
                    ...this.trn_customer_model_map
                };
            }
        },
        getMappingIdFromUrl() {
            return this.$route.query.id || "";
        },

        async save() {
            this.cacheDataModal.isFormEdited = false;
            let isValid = await this.$refs.ruleForm.validate().catch(error => {});
            this.isFormValid = isValid;
            let trn_customer_model_map =
                isValid &&
                (await CommonService.save(this.endpoint, this.trn_customer_model_map, ).catch(
                    error => {
                        this.isFormValid = false;
                        this.notifyError("Error while saving model data!!");
                    }
                ));
            if (trn_customer_model_map) {
                this.trn_customer_model_map._id = trn_customer_model_map._id; // add service id after first request to existing service object to avoid duplicate service entries
                this.notifySuccess("mapping saved successfully!!");
                this.displayList();
            }
            this.buttonKey++;
        },

        displayList() {
            this.$router.push({
                path: "/trn-customer-model-map-list"
            });
        },
        setValidationRules() {
            return {
                module: [{
                    required: true,
                    message: "Please input module",
                    trigger: "blur"
                }],
                model_type: [{
                    required: true,
                    message: "Please input model type",
                    trigger: "blur"
                }],
                model_name: [{
                    required: true,
                    message: "Please input model name",
                    trigger: "blur"
                }],
                domain: [{
                    required: true,
                    message: "Please input domain",
                    trigger: "blur"
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
@import "../../assets/scss/_variables";
</style>
