<template>
<el-main>
    <div class="kp-back-to-parent">
        <el-button class="kp-btn-back" icon="el-icon-back" v-on:click="displayList"></el-button>
        <h1 class="kp-page-title">{{pageTitle}}</h1>
    </div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/help-section-list' }">Help section</el-breadcrumb-item>
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
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" prop="object_type" label="Object type">
                                        <el-input v-model="form.object_type" placeholder="E.g. Opportunity"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="kp-form-select-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" prop="system_name" label="System name">
                                        <el-select placeholder="Please select system" filterable @change="onSystemChange" v-model="form.system_name">
                                            <el-option v-for="system in systemList" :value="system" :key="system._id" :label="system.system_name"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div class="kp-form-input-1 kp-form-field">
                                    <div class="kp-form-field-label">
                                        Sort
                                    </div>
                                    <el-input v-model="form.sort" @keypress.native="isNumber($event)" placeholder="Eg. 4"></el-input>
                                </div>
                            </el-col>

                            <el-col :span="8">
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" prop="user_query" label="Statement">
                                        <el-input v-model="form.user_query" placeholder="Add your query here"></el-input>
                                    </el-form-item>
                                </div>

                                <div class="kp-form-select-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" label="User role">
                                        <el-select v-model="form.user_role" placeholder="Select role">
                                            <el-option v-for="value in role" :key="value" :label="key" :value="value"></el-option>
                                        </el-select>
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
import HelpSectionService from "../../services/HelpSectionService";
import Constants from "@/resources/Constants";

import ConfirmModel from "@/components/ConfirmModel";
import _ from "lodash";

export default {
    name: "HelpSectionForm",
    components: {
        ConfirmModel
    },
    data() {
        return {
            labelPosition: "top",
            dialogFormVisible: false,
            cacheDataModal: {
                cachedForm: {},
                isFormEdited: false,
                isEditForm: false,
                isNewForm: false
            },
            system: "",
            pageTitle: "",
            systemList: [],
            buttonKey: 1,
            isSaveData: false,
            role: Constants.USER_ROLE,
            form: {},
            isFormValid: true,
            validationRules: this.setValidationRules()
        };
    },
    watch: {
        form: {
            handler(newVal, oldVal) {
                if (!this.isSaveData && (this.cacheDataModal.isNewForm || this.cacheDataModal.isEditForm)) {
                    this.cacheDataModal.isFormEdited =
                        JSON.stringify(this.cacheDataModal.cachedForm) !=
                        JSON.stringify(this.form);
                }
            },
            deep: true
        }
    },
    methods: {
        async save() {
            let isValid = await this.$refs.form.validate().catch(error => {});
            this.isSaveData = true;
            this.cacheDataModal.isFormEdited = false;
            let form =
                isValid &&
                (await HelpSectionService.save(this.form).catch(
                    error => {
                        this.isFormValid = false;
                        this.notifyError("There is an error in saving Help Section data");
                    }
                ));
            if (form) {
                this.form._id = form._id; // add service id after first request to existing service object to avoid duplicate service entries
                this.notifySuccess("Record saved successfully");
                this.displayList();
            }
            this.buttonKey++;
        },

        async fetchAllCustomerSystems() {
            let systemList = await HelpSectionService.fetchAllCustomerSystems().catch(
                error => {
                    this.notifyError("Error while fetching customer system list");
                }
            );
            this.systemList = _.uniqBy(systemList, "system_name");
        },

        onSystemChange(system) {
            this.form.system_name = system.system_name;
            this.form.customer_id = system.customer_id;
            this.form.customer_system_id = system._id;
        },
        onRoleChange(role) {
            this.form.user_role = role;
        },

        fetchRecordId() {
            return this.$route.query.id;
        },

        displayList() {
            this.$router.push({
                path: "/help-section-list"
            });
        },
        async init() {
            let recordId = this.fetchRecordId();
            if (recordId) {
                let response = await HelpSectionService.fetchRecordById(recordId).catch(
                    error => {
                        this.notifyError("There is an error in fetching record data");
                    }
                );
                this.form =
                    (response && _.defaultsDeep(response, this.form)) || this.form;
                this.cacheDataModal.isEditForm = true;
                this.cacheDataModal.isFormEdited = false;
                this.cacheDataModal.cachedForm = {
                    ...this.form
                };
                this.pageTitle = "Edit query";
                return;
            } else {
                this.cacheDataModal.isNewForm = true;
                this.cacheDataModal.isFormEdited = false;
                this.cacheDataModal.cachedForm = {
                    ...this.form
                };
            }
            this.pageTitle = "Add query";
        },
        isNumber: function (evt) {
            console.log("I am in  is Nymbetec chec" + evt);
            evt = evt ? evt : window.event;
            var charCode = evt.which ? evt.which : evt.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                evt.preventDefault();
            } else {
                return true;
            }
        },
        setValidationRules() {
            return {
                object_type: [{
                    required: true,
                    message: "Please input object_type",
                    trigger: "change"
                }],
                system_name: [{
                    required: true,
                    message: "Please input system_name",
                    trigger: "change"
                }],
                user_query: [{
                    required: true,
                    message: "Please input Statement",
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
        this.fetchAllCustomerSystems();
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
