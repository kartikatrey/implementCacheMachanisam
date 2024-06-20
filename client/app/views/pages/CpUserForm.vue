<template>
<el-main>
    <div class="kp-back-to-parent">
        <el-button class="kp-btn-back" icon="el-icon-back" v-on:click="$router.push('customer-users' )"></el-button>
        <h1 class="kp-page-title">Add user</h1>
    </div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/customer-users' }">Portal user</el-breadcrumb-item>
        <el-breadcrumb-item>{{pageTitle}}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="kp-form-area">
        <div class="kp-form-panel">
            <el-form :model="form" :rules="formRules" ref="form">
                <ConfirmModel ref="model"></ConfirmModel>
                <el-row :gutter="72">
                    <el-col :span="8">
                        <div class="kp-form-input-1 kp-form-field">
                            <el-form-item class="kp-form-field-label" prop="full_name" label="Name">
                                <el-input v-model="form.full_name" placeholder="User"></el-input>
                            </el-form-item>
                        </div>

                        <div class="kp-form-select-1 kp-form-field">
                            <el-form-item class="kp-form-field-label" prop="contact" label="Contact">
                                <el-input v-model="form.contact" placeholder="E.g. 1111111111"></el-input>
                            </el-form-item>
                        </div>

                    </el-col>
                    <el-col :span="8">
                        <div class="kp-form-select-1 kp-form-field">
                            <el-form-item class="kp-form-field-label" prop="email" label="Email">
                                <el-input v-model="form.email" placeholder="E.g. headoffice@jadeglobal.com"></el-input>
                            </el-form-item>
                        </div>
                        <div v-if="isAdmin" class="kp-form-input-1 kp-form-field">
                            <el-form-item label="Roles" prop="roles" class="kp-form-field-label">
                                <el-select v-model="form.roles" multiple default-first-option clearable placeholder="Select Role">
                                    <el-option v-for="role in roles" :key="role.value" :label="role.label" :value="role.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <el-button v-on:click.once="onSave" :key="buttonKey" class="kp-btn-form-primary" type="primary">Save</el-button>
        <el-button v-on:click="displayList" class="kp-btn-form-outline">Cancel</el-button>
        <div v-if="!isFormValid" class="kp-form-error">* Please check field with errors</div>
    </div>
</el-main>
</template>

<script>
import Json from "@/util/Json";
import constants from "@/resources/Constants";
import ConfirmModel from "@/components/ConfirmModel";
import AjaxService from "@/services/AjaxService.js";

export default {
    name: "CpUserForm",
    components: {
        ConfirmModel
    },
    data() {
        return {
            isFormValid: true,
            form: {},
            buttonKey: 1,
            endpoint: constants.CP_USER_ENDPOINT,
            roles: constants.ROLES,
            isAdmin: false,
            cacheDataModal: {
                cachedForm: {},
                isFormEdited: false
            },
            formRules: {
                full_name: [{
                    required: true,
                    message: "Please enter name",
                    trigger: "change"
                }],
                email: [{
                        required: true,
                        message: "Please input email address",
                        trigger: "change"
                    },
                    {
                        type: "email",
                        message: "Please input correct email address",
                        trigger: ["blur", "change"]
                    }],
                roles: [{
                    required: true,
                    message: "Please enter roles",
                    trigger: "blur"
                }],

            }
        };
    },
    watch: {
        form: {
            handler(newVal, oldVal) {
                let cachedForm = _.pickBy(this.cacheDataModal.cachedForm, _.identity);
                let form = _.pickBy(this.form, _.identity);
                this.cacheDataModal.isFormEdited = cachedForm != form;
            },
            deep: true
        }
    },
    methods: {
        onSave() {
            this.cacheDataModal.isFormEdited = false;
            this.$refs.form.validate(valid => {
                this.isFormValid = valid;
                if (valid) {
                    let userData = {
                        full_name: this.form.full_name,
                        email: this.form.email,
                        contact: this.form.contact,
                        roles: this.form.roles
                    };
                    AjaxService.postJson(
                        "/portal/api/customer-registration",
                        userData,
                        (err, response) => {
                            if (!response.data.data.status) {
                                this.notifyError(response.data.data.message,"Error","cssClass");
                                return;
                            }
                            this.notifySuccess("User added successfully");
                            this.$router.push({
                                path: "/customer-users"
                            });
                        }
                    );
                }
            });
            this.buttonKey++;
        },
        displayList() {
            this.$router.push({
                path: "/customer-users"
            });
        },
        async init() {
            let user = this.$store.getters.user;
            if (user.roles.includes("admin")) {
                this.isAdmin = true;
            }
        },
    },
    beforeMount() {
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

.cssClass{
    width:306px;
}

</style>
