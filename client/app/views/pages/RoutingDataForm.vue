<template>
<el-main>
    <!-- <el-form :model="form" ref="form" :rules="formRules" :gutter="20"> -->
    <!-- <h1 class="kp-page-title"></h1> -->
    <div class="kp-back-to-parent">
        <el-button class="kp-btn-back" icon="el-icon-back" v-on:click="$router.push('routing-list')"></el-button>
        <h1 class="kp-page-title">Routing data</h1>
    </div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/routing-list' }">Routing data</el-breadcrumb-item>
        <el-breadcrumb-item>{{label}}Statement</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="kp-form-area">
        <div class="kp-form-panel">
            <el-row>
                <el-col>
                    <el-form :label-position="labelPosition" label-width="100px" :model="form" :rules="rules" ref="form">
                        <ConfirmModel ref="model"></ConfirmModel>
                        <el-row :gutter="72">
                            <el-col :span="8">
                                <div class="kp-form-select-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" prop="domain" label="Domain">
                                        <el-select placeholder="Please select domain" v-model="form.domain">
                                            <el-option v-for="value in options" :value="value" :key="value" :label="value.domain"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="kp-form-select-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" prop="model" label="Model Type">
                                        <el-select placeholder="Please select model type" v-model="form.model">
                                            <el-option v-for="(value) in modelTypes" :value="value" :key="value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col>
                                <div class="kp-form-input-1 kp-form-field" v-for="(row,index) in form.routingData" :key="index">
                                    <!-- <div class="kp-form-field-label">Field Label</div> -->
                                    <el-row :gutter="72">
                                        <el-col :span="8">
                                            <el-form-item class="kp-form-field-label" :prop="'routingData.' + index + '.statement'" :rules="{required: true, message: 'Statement is required', trigger: 'change'}" :label="'Statement '+ (index+1)">
                                                <el-input placeholder="E.g. create incident" v-model="row.statement"></el-input>
                                            </el-form-item>
                                            <!-- </el-col>
                        <el-col :span="8">-->
                                        </el-col>
                                        <el-button class="kp-from-actions kp-blank-btn el-icon-delete el-button--default" v-if="index>0" v-on:click="removeStatement(index)"></el-button>
                                    </el-row>
                                </div>
                            </el-col>
                        </el-row>

                        <div class="left-block">
                            <el-button class="kp-btn-primary" type="primary" @click="addRoutingStatements" v-if="showAddButton">ADD ANOTHER</el-button>
                        </div>
                    </el-form>
                </el-col>
            </el-row>
        </div>

        <el-button v-on:click.once="onSave" :key="buttonKey" class="kp-btn-form-primary" type="primary">Save</el-button>
        <el-button v-on:click="$router.push('routing-list')" class="kp-btn-form-outline">Cancel</el-button>
        <div v-if="!isFormValid" class="kp-form-error">* Please check field with errors</div>
    </div>
</el-main>
</template>

<script>
import _ from "lodash";
import Constants from "@/resources/Constants";
import RoutingService from "@/services/RoutingService";
import ConfirmModel from "@/components/ConfirmModel";

export default {
    name: "RoutingDataForm",
    components: {
        ConfirmModel
    },
    data() {
        return {
            labelPosition: "top",
            options: Constants.DOMAINS,
            modelTypes: Constants.TRANING_MODEL_TYPES,
            form: {
                routingData: [{
                    statement: ""
                }],
                domain: "",
                model: ""
            },
            domain: "",
            model: "",
            showAddButton: true,
            isFormValid: true,
            cacheDataModal: {
                cachedForm: {},
                isFormEdited: false,
            },
            rules: this.rules(),
            label: "Add",
            buttonKey: 1
        };
    },
    watch: {
        form: {
            handler(newVal, oldVal) {
          let cachedForm = _.pickBy(this.cacheDataModal.cachedForm , _.identity);
          let form = _.pickBy(this.form , _.identity);

         cachedForm = JSON.stringify(cachedForm).replace(/\\n|\\t|\\r/g,"");
          form = JSON.stringify(form).replace(/\\n|\\t|\\r/g,"");


            this.cacheDataModal.isFormEdited = cachedForm != form;
        
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
                    
                    this.cacheDataModal.cachedForm = {
                        ...this.form
                    };
                    return;
                }
               
                this.showAddButton = false;
                this.label = "Edit";
                this.routingData = await RoutingService.fetchById(this.$route.query.id);
                this.form.domain = this.routingData.domain;

                this.form.model = this.routingData.Model;
                console.log(this.form.routingData[0]);

                this.form.routingData[0]["statement"] = this.routingData.statement;
                this.form.routingData[0]["_id"] = this.routingData._id;
                 this.cacheDataModal.cachedForm = {
                    ...this.form
                };
            } catch (e) {
                console.log(e);
            }
        },
        rules() {
            return {
                domain: [{
                    required: true,
                    message: "Please select Domain",
                    trigger: "change"
                }],
                model: [{
                    required: true,
                    message: "Please select Model",
                    trigger: "change"
                }]
            };
        },
        async onSave() {
            this.$refs.form.validate(valid => {
                this.isFormValid = valid;
                if (!valid) {
                    return;
                }
                _.each(this.form.routingData, record => {
                    record["domain"] = this.form.domain;
                    record["Model"] = this.form.model;
                });
                this.cacheDataModal.isFormEdited = false;
                let formData =
                    _.size(this.form.routingData) == 1 ?
                    this.form.routingData[0] :
                    this.form.routingData;
                RoutingService.save(formData)
                    .then(response => {
                        this.notifySuccess("Record saved successfully");
                        this.$router.push({
                            path: "/routing-list"
                        });
                    })
                    .catch(error => {
                        this.isFormValid = false;
                        this.notifyError("Error while processing");
                    });
                this.buttonKey++;
            });
        },
        removeStatement(index) {
            this.form.routingData.splice(index, 1);
        }
    },

    beforeMount() {
        window.addEventListener("beforeunload", event => {
            if (!this.cacheDataModal.isFormEdited) return;
            event.preventDefault();
            event.returnValue = "";
        });
        let user = this.$store.getters.user;
        if (user.roles.includes("admin")) {
            this.showList = true;
        }
        this.init();
        
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
